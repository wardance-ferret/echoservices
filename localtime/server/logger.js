var winston = require('winston');

//log_level can be, in order of decreasing importance: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
var log_level = process.env.LOG_LEVEL || 'debug';

var log_location = process.env.LOG_LOCATION || __dirname;

var logger = new (winston.Logger)({
  level: log_level ,
  transports: [
    new winston.transports.File({ filename: log_location + '/tzapi-debug.log', json: false })
  ],
  exceptionHandlers: [
    new (winston.transports.Console)({ json: false, timestamp: true }),
    new winston.transports.File({ filename: log_location + '/tzapi-exceptions.log', json: false })
  ],
  exitOnError: false
});

module.exports = logger;
