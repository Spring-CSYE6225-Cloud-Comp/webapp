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
        
        // console.log('not existing');

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

module.exports = { createUser }