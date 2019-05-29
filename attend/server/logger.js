var winston = require('winston');
var config = require('./config');
// require("winston-azure-blob-transport");
var fs = require('fs');
var path = require('path');
//log_level can be, in order of decreasing importance:
//{ error: 0,
//  warn: 1,
//  info: 2,
//  verbose: 3,
//  debug: 4,
//  silly: 5 }
//
var log_level = process.env.LOG_LEVEL || 'debug';
var container = config.defaultLoggingContainer || 'customlogs';
var storageAccount = process.env.AZURE_STORAGE_ACCOUNT;
var storageKey = process.env.AZURE_STORAGE_ACCESS_KEY;
var serviceName = process.env.SERVICE_NAME||'NO_SERVICE_NAME';
var log_location = process.env.LOG_LOCATION;

var logger = null;


if (log_location && fs.existsSync(log_location)){

  logger = setupLocalLogging();

} else if (storageAccount && storageKey){
  console.error("Failed to set up custom logging for the application.  You must specify an absolute file path on your application server with process.env.LOG_LOCATION.");
  //logger = setupCloudLogging();
  return;
} else {
  console.error("Failed to set up custom logging for the application.  You must either specify an absolute file path on your application server with process.env.LOG_LOCATION, or specify process.env.AZURE_STORAGE_ACCOUNT and process.env.AZURE_STORAGE_ACCESS_KEY...");
  return;

}

function setupLocalLogging(){

  return winston.createLogger({
    level: log_level,
    transports: [
      new winston.transports.File({
       filename: path.join(log_location,'/be-'+serviceName+'-'+log_level+'.log'),
       json: true,
       timestamp: true,
       maxsize: 5242880,
       maxFiles: 5,
       colorize: true
      })
    ],
    exceptionHandlers: [
      new (winston.transports.Console)({ json: false, timestamp: true }),
      new winston.transports.File({
       filename: path.join(log_location,'be-'+serviceName+'-exceptions.log'),
       json: true,
       timestamp: true
      })
    ],
    exitOnError: false
  });

}


function setupCloudLogging(){

  return winston.createLogger({
    level: log_level,
    transports: [
      new winston.transports.AzureBlob({
       account: {
        name: storageAccount,
        key: storageKey
       },
       blobName: 'be-'+serviceName+'-'+log_level+'.log',
       containerName: container,
       json: false,
       timestamp: true
        })
    ],
    exceptionHandlers: [
      new (winston.transports.Console)({ json: false, timestamp: true }),
      new winston.transports.AzureBlob({
       account: {
        name: storageAccount,
        key: storageKey
       },
       blobName: 'be-'+serviceName+'-exceptions.log',
       containerName: container,
       json: false,
       timestamp: true
        })
    ],
    exitOnError: false
  });

}


//any transport instance can also be configured to serve as an exception handler, as shown above.
//An alternative is to use the handleExceptions flag (shown below), but then you
//cannot have a different filename for exceptions.
// new winston.transports.File({
//             level: 'info',
//             filename: './logs/all-logs.log',
//             handleExceptions: true,
//             json: true,
//             maxsize: 5242880, //5MB
//             maxFiles: 5,
//             colorize: false
//         })

//how to create an instance of winston.transports.Console:
//  new (winston.transports.Console)({ json: false, timestamp: true })

//how to create an instance of winston.transports.File:
    // new winston.transports.File({ filename: log_location + '/ea-be-debug.log',
    //  maxsize: 1048576,
    //  timestamp: true,
    //  json: false })

//more reading:
//http://tostring.it/2014/06/23/advanced-logging-with-nodejs/

module.exports = logger;
