const db = require('../models/databaseModel.js');
const User = db.users;
const bcrypt = require('bcrypt');
const lg = require('../logger.js')
const moment = require('moment');
const uuid = require('uuid');
const { PubSub } = require('@google-cloud/pubsub');
const { query } = require('express');

const pubsub = new PubSub();

// Publish message to verify_email topic
const publishMessage = async (data) => {
    try {
      const topicName = "verify_email"
      const dataBuffer = Buffer.from(JSON.stringify(data));
  
      const msgID = await pubsub.topic(topicName).publish(dataBuffer);
      console.log('Message published to verify_email topic:', dataBuffer);
    } catch (error) {
      console.error('Error publishing message:', error);
    }
  };

//to generate random token
function generateToken() {
    return uuid.v4();
  }

// to add minutes to a date
function addMinutes(date, minutes) {
    return moment(date).add(minutes, 'minutes').toDate();
  }

//to check if user already exists
const checkFunc = async (email) => {
    try {
        await db.sequelize.sync();
        console.log(email);
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        if(user!=null){
        return true;}
    } catch (error) {
       console.log(error);
    //     return false;
    }
};

//authenticate user
const authenticateUser = async(req, res)=>{

    const head = req.headers.authorization;
    //console.log(req.headers);

    if(!head){
        let err = new Error('User is not authorized');
        //console.log(err);
        res.setHeader('WWW-Authenticate', 'Basic');
        res.status(401).send(err);
        lg.error('User is not authorized. Check if headers are missing');
    }

    const auth = new Buffer.from(head.split(' ')[1], 'base64').toString().split(':');

    const username = auth[0];
    const pwd = auth[1];

    const dummyUser = await User.findOne({where:{"email":username}});
    if(!dummyUser){
        console.log('User not found');
        res.status(400).send('User not found');
        lg.error('User not found');
        return false;
    }
    const result = bcrypt.compareSync(pwd, dummyUser.password);

    if(result){
        console.log('Authentication Successful');
        res.send('Authentication Successful');
        return true;
    }else{
        console.log('Authentication failed');
        res.status(401).send('Authentication failed');
        lg.error('Authentication failed');
    }
    

}

//new user creation
const createUser = async (req, res) => {
    const expectedParams = [
        'email',
        'password', 
        'firstName',
        'lastName'
    ];
    // additional validations
    for (const param of expectedParams) {
        if (!req.body[param]) {
            lg.error('Field missing');
            return res.status(404).json({ error: `Missing field: ${param}` });
        }
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    //store info from request body
    let info ={
        email:req.body.email,
        password:hashedPassword,
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        token: generateToken(),
        expiry: addMinutes(new Date(), 2) //added 2 minutes to expire
    }

    let topicMessage = {
        email: req.body.email,
        token: info.token
    }
    console.log('topic msg is:', topicMessage);
    lg.debug('The topic message is', topicMessage);

    try {
        //check if user exists by calling check function
        const existingUser = await checkFunc(req.body.email);
        if (existingUser) {
            lg.error('Existing user');
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // validations
            if(req.body.id){
                throw new Error("Explicit 'id' field not allowed.")
            }else if (typeof req.body.firstName !== 'string') {
                return res.status(400).json({ error: 'Invalid type for firstname. It should be a string.' });
            }else if (typeof req.body.lastName !== 'string') {
                return res.status(400).json({ error: 'Invalid type for lastname. It should be a string.' });
            }

            

            for (const key of Object.keys(req.body)) {
                if (!expectedParams.includes(key)) {
                    throw new Error(`Invalid field: ${key}`);
                    res.status()
                }
            }
            

        //create new user
        const newUser = await User.create(info);
        console.log('user info inserted in db')
        console.log('topic msg to be published is:',topicMessage);

        lg.info('User created successfully');
        res.status(201).json({
            // id:newUser.id,
            // first_name:newUser.firstName,
            // last_name:newUser.lastName,
            // username:newUser.email,
            // account_created:newUser.account_created,
            // account_updated:newUser.account_updated
            Info: 'User verification pending'
        });
        const msgBuffer = await publishMessage(topicMessage);
        console.log('contents of msgBuffer:',msgBuffer)
        //await publishMessage(topicMessage);
        // await db.sequelize.sync();

        //send to response
        
        // console.log(newUser);
    } catch (error) {
        if (error.message === "Explicit 'id' field not allowed."){
            lg.error('Explicit id field not allowed');
            res.status(400).json({ error: error.message });
    }else if (error.message.startsWith('Invalid field: ')) {
        lg.error('Invalid field');
        res.status(400).json({ error: error.message });
    }else if(error.name == 'SequelizeValidationError'){ 
        lg.error('Sequelize Validation Error');
        res.status(400).json({ error: error.errors[0].message });
    }else{
        lg.error('Service unavailable');
        res.status(503).json({ error: 'Service unavailable' });
    }
    }
};
 //get self info
const getUserInfo = async(req, res)=>{
    const authhead = req.headers.authorization;

    if(!authhead){
        res.setHeader('WWW-Authenticate', 'Basic');
        lg.error('User is not authorized. Check if headers are missing');
        return res.status(401).send('User is not authorized');
    }

    const auth = new Buffer.from(authhead.split(' ')[1], 'base64').toString().split(':');

    const username = auth[0];
    const pwd = auth[1];

    try{


        const currUser = await User.findOne({where:{"email":username}});

          // Check if the status field in the user table is set to "verified"
        if(!currUser.status == 'verified' || currUser.status == null){
            lg.error('User verification failed');
            return res.status(400).json({ error: 'User verification failed' });
        }
  
        if(!currUser || !bcrypt.compareSync(pwd, currUser.password)){
            console.log('Authentication failed');
            lg.error('Authentication failed');
            return res.status(401).send('Authentication failed');
        }

        const userInfo = {
            id: currUser.id,
            email: currUser.email,
            firstName: currUser.firstName,
            lastName: currUser.lastName,
            account_created: currUser.account_created,
            account_updated: currUser.account_updated
        }
        lg.info('User retrieved successfully')
        return res.status(200).json(userInfo);
    }catch (error) {
        console.error('Error while fetching user information:', error);
        lg.error('Service unavailable');
        return res.status(503).json({ error: 'Service unavailable' });
    }

}

//update info
const updateUser = async(req, res)=>{
    const authhead = req.headers.authorization;

    if(!authhead){
        res.setHeader('WWW-Authenticate', 'Basic');
        lg.error('User is not authorized. Check if headers are missing');
        return res.status(401).send('User is not authorized');
    }

    const auth = new Buffer.from(authhead.split(' ')[1], 'base64').toString().split(':');

    const username = auth[0];
    const pwd = auth[1];

    try{
        const currUser = await User.findOne({where:{"email":username}});

        // Check if the status field in the user table is set to "verified"
        if(!currUser.status == 'verified'){
            lg.error('User verification failed');
            return res.status(400).json({ error: 'User verification failed' });
        }

        if(!currUser || !bcrypt.compareSync(pwd, currUser.password)){
            lg.error('User Authentication failed');
            console.log('Authentication failed');
            return res.status(401).send('Authentication failed');
        }
        if(username!=req.body.email){
            lg.error('Username and email dont match');
            return res.status(400).send("'username and email don't match'")
        }
        if (typeof req.body.firstName !== 'string') {
            lg.error('Firstname should be a string');
            return res.status(400).json({ error: 'Invalid type for firstname. It should be a string.' });
        }else if (typeof req.body.lastName !== 'string') {
            lg.error('Lastname should be a string');
            return res.status(400).json({ error: 'Invalid type for lastname. It should be a string.' });
        }
        const { firstName, lastName, password } = req.body;

        currUser.firstName = firstName;
        currUser.lastName = lastName;

        if (password) {
            currUser.password = bcrypt.hashSync(password,10);
            console.log(password);
        }
        currUser.account_updated = new Date();
        
        await currUser.save();
        db.connect();
        lg.info('User updated successfully');
        return res.status(204).send('');
    }catch(error){
        console.error('Error while updating user account information:', error);
        lg.error('Error while updating user');
        return res.status(503).send('');
    }
}

//endpoint for token verification
const verifyToken = async (req, res) => {
    const { token } = req.query;
  console.log('token=',token)
    try {
      const user = await User.findOne({
        where: {
          token: token
        }
      });
      console.log('user is', user)
      if (!user) {
        lg.error('Token not found');
        return res.status(404).json({ error: 'Token not found' });
      }
      
      const currentTime = new Date();
        if (user.expiry && currentTime > user.expiry) {
            lg.error('Token has expired');
            return res.status(400).json({ error: 'Token has expired' });
        }

      // Set status as verified
      user.status = 'verified';
      await user.save();
  
      lg.info('User verified successfully');
      res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
      res.status(400).json({ error: error});
    }
  }

module.exports = {createUser, getUserInfo, authenticateUser, updateUser, verifyToken}