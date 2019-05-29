'use strict';
//get a signed JW (using a shared lib)
//select the URL (in this module)
//make the HTTP request and handle the response (using a shared lib)

require('dotenv').config({"path": require('path').join(__dirname,'../../.env')});


//logging will fail because this module is configured in a different environment from the current app...
//and the path is a brittle one because it assumes that ea-be and es are sister nodes...
//nevertheless, disableAllMethods worked!
var disableAllMethods = require('../../../../../ea-be/common/modelHelper.js').disableAllMethods;

module.exports = function(Zoom) {

  Zoom.enabledMethods = ["launchMeeting","getMeetings"];
  disableAllMethods(Zoom,Zoom.enabledMethods);
   
  Zoom.getMeetings=function(data, callback){
  	console.log('data is: '+JSON.stringify(data['body']));
  	callback(null,{'result':'success'});
  };

  Zoom.launchMeeting=function(data, callback){
  	console.log('data is: '+JSON.stringify(data['body']));
  	callback(null,{'result':'success'});
  };

  Zoom.remoteMethod('getMeetings', 
  {
  description: 'get all meetings',
  accepts:
  { arg: 'request', type: 'Object', http: {source: 'req'}},
    http:
  {path: '/getMeetings', verb:'post'},
  returns:
  {arg: 'response', type: 'Object' }
  });

Zoom.remoteMethod('launchMeeting', 
  {
  description: 'Launch a meeting todo: given a meeting ID',
  accepts:
  { arg: 'request', type: 'Object', http: {source: 'req'}},
    http:
  {path: '/launchMeeting', verb:'post'},
  returns:
  {arg: 'response', type: 'Object' }
  });


};
