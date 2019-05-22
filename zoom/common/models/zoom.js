'use strict';

module.exports = function(Zoom) {

  Zoom.launchMeeting=function(data, callback){
  	console.log('data is: '+JSON.stringify(data['body']));
  	callback(null,{'result':'success'});
  };

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
