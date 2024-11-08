// const winston = require('winston');
// const moment = require('moment');
 
// const currentDate = moment().format('YYYY-MM-DD');
 
 
// // Define the log format
// const logFormat = winston.format.combine(
//   winston.format.timestamp(),
//   winston.format.simple()
// );
 
// // Create a Winston logger with multiple transports for different log levels
// const logger = winston.createLogger({
//   level: 'info', // Minimum log level to capture
//   format: logFormat,

//   transports: [
//     // Log 'info' and above messages to a file
//     new winston.transports.File({
//       filename: "var/log/csye6225.log",
//       level: 'info',
//     }),
 
//     // Log 'error' and 'warning' messages to a separate file
//     new winston.transports.File({
//       filename: "var/log/csye6225.log",
//       level: 'error',
//     }),
 
//     // Log 'warning' and above messages to the console
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple()
//       ),
//       level: 'warn',
//     }),
//   ],
// });
 
// module.exports = logger;

const winston = require('winston');
const moment = require('moment');

// Define the log format
const logFormat = winston.format.printf(({ timestamp, level, message }) => {
  // Create a custom log object
  const logObject = {
    timestamp: timestamp,
    severity: level.toUpperCase(),
    message: message
  };
  
  // Serialize the log object to JSON format
  return JSON.stringify(logObject);
});

// Create a Winston logger with a single transport
const logger = winston.createLogger({
  level: 'info', // Minimum log level to capture
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ssZ' }),
    logFormat
  ),
  transports: [
    // Log all messages to the console
    new winston.transports.File({ filename: 'var/log/csye6225.log' }),
  
  ],
});

module.exports = logger;
