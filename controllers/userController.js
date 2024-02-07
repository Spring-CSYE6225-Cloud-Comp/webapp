const db = require('../models/databaseModel.js');
const User = db.users;
const bcrypt = require('bcrypt');

//to check if user already exists
const checkFunc = async (email) => {
    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });
        return user !== null;
    } catch (error) {
       console.log('error in checkfunc');
        return false;
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
    }

    const auth = new Buffer.from(head.split(' ')[1], 'base64').toString().split(':');

    const username = auth[0];
    const pwd = auth[1];

    const dummyUser = await User.findOne({where:{"email":username}});
    if(!dummyUser){
        console.log('User not found');
        res.status(400).send('User not found');
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
    }
    

}

//new user creation
const createUser = async (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    //store info from request body
    let info ={
        email:req.body.email,
        password:hashedPassword,
        firstName:req.body.firstName,
        lastName:req.body.lastName
    }


    try {
        //check if user exists by calling check function
        const existingUser = await checkFunc(req.body.email);
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // validations
            if(req.body.id){
                throw new Error("Explicit 'id' field not allowed.")
            }

            const expectedParams = [
                'email',
                'password', 
                'firstName',
                'lastName'
            ];

            for (const key of Object.keys(req.body)) {
                if (!expectedParams.includes(key)) {
                    throw new Error(`Invalid field: ${key}`);
                    res.status()
                }
            }
        

        //create new user
        const newUser = await User.create(info);
        console.log('user created')
        // await db.sequelize.sync();

        //send to response
        res.status(201).json({
            id:newUser.id,
            first_name:newUser.firstName,
            last_name:newUser.lastName,
            username:newUser.email,
            account_created:newUser.account_created,
            account_updated:newUser.account_updated
    });
        // console.log(newUser);
    } catch (error) {
        if (error.message === "Explicit 'id' field not allowed."){
            res.status(400).json({ error: error.message });
    }else if (error.message.startsWith('Invalid field: ')) {
        res.status(400).json({ error: error.message });
    }else if(error.name == 'SequelizeValidationError'){ 
        res.status(400).json({ error: error.errors[0].message });
    }else{
        res.status(500).json({ error: 'Internal Server Error' });
    }
    }
};
 //get self info
const getUserInfo = async(req, res)=>{
    const authhead = req.headers.authorization;

    if(!authhead){
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('User is not authorized');
    }

    const auth = new Buffer.from(authhead.split(' ')[1], 'base64').toString().split(':');

    const username = auth[0];
    const pwd = auth[1];

    try{
        const currUser = await User.findOne({where:{"email":username}});

        if(!currUser || !bcrypt.compareSync(pwd, currUser.password)){
            console.log('Authentication failed');
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
        return res.status(200).json(userInfo);
    }catch (error) {
        console.error('Error while fetching user information:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

//update info
const updateUser = async(req, res)=>{
    const authhead = req.headers.authorization;

    if(!authhead){
        res.setHeader('WWW-Authenticate', 'Basic');
        return res.status(401).send('User is not authorized');
    }

    const auth = new Buffer.from(authhead.split(' ')[1], 'base64').toString().split(':');

    const username = auth[0];
    const pwd = auth[1];

    try{
        const currUser = await User.findOne({where:{"email":username}});

        if(!currUser || !bcrypt.compareSync(pwd, currUser.password)){
            console.log('Authentication failed');
            return res.status(401).send('Authentication failed');
        }

        // const updatedInfo = {
        //     firstName: req.body.firstName,
        //     lastName: req.body.lastName,
        //     newPassword: req.body.password
        // }
        const { firstName, lastName, newPassword } = req.body;

        currUser.firstName = firstName;
        currUser.lastName = lastName;

        if (newPassword) {
            currUser.password = bcrypt.hashSync(newPassword, 10);
        }

        currUser.account_updated = new Date();
        await currUser.save();

        return res.status(200).send('User account info updated successfully');
    }catch(error){
        console.error('Error while updating user account information:', error);
        return res.status(500).send('error while updating user info');
    }
}

module.exports = {createUser, getUserInfo, authenticateUser, updateUser}