const dbConfig = require('../config/dbConfig.js');
const {Sequelize, DataTypes} = require('sequelize');

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,
    }

)

const connect = async() => {
    try {
      await sequelize.authenticate();

      db.sequelize.sync({ force: false
  
    .then(() => {
  
      console.log('yes re-sync done!')
  
  })
  
      return true;
  
    } catch(err) {
  
      return false;
  
    }
  
  }
  
  const dbConnectionCheck = async () => {

    try {
  
      await sequelize.authenticate();
      return {status: 200};
    } catch(err) {
      return {status: 503};
    }
  
  }
  
const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.connect = connect;
db.dbConnectionCheck = dbConnectionCheck;

db.users = require('./userModel.js')(sequelize, DataTypes);
console.log('this is db');


module.exports = db
