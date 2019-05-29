'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
const path = require('path');


var app = module.exports = loopback();

if (!process.env.NODE_ENV){
  console.log("NODE_ENV was not set, loading .env file.");
  require('dotenv').config({'path': path.join(__dirname,'../.env')});
}

var DatasourcesWriter = require('./environment/datasources-writer');
console.log('NODE_ENV: '+JSON.stringify(process.env.NODE_ENV));


app.start = function() {
  // start the web server
  var server = app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
  return server;
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
