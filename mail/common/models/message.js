'use strict';
var CircularJSON = require('circular-json');

module.exports = function(Message) {

  Message.sendInvite=function(data, callback){
  	console.log('data is: '+JSON.stringify(data['body']));
  	callback(null,{'result':'success'});
  };

  Message.remoteMethod('sendInvite', 
  {
  description: 'Send a message to an email',
  accepts:
  { arg: 'invitePacket', type: 'Object', http: {source: 'req'}},
    http:
  {path: '/sendInvite', verb:'post'},
  returns:
  {arg: 'invitation-results', type: 'Object' }
  });

};
