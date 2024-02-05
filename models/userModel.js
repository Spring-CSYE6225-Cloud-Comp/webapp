// const { DataTypes } = require('sequelize');
// const { sequelize } = require('./databaseModel');
// const db = require('./databaseModel');
module.exports = (sequelize, DataTypes)=>{
    const User = sequelize.define('user', {

        id: {
            type: DataTypes.UUID,
            defaultValue:DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            readOnly: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            writeOnly: true
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_created: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
            readOnly: true
        },
        account_updated: {
            type: DataTypes.DATE,
            allowNull: true,
            readOnly: true,
            defaultValue: DataTypes.NOW,
        },
    },{
        timestamps: false,
    });
    console.log("this is user in  userModel")
    console.log(User);
    return User;
}



