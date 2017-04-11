'use strict';

require('dotenv').config();
var http = require('http');

module.exports = function(Person) {


 Person.invite = function(data, callback){

 	var dataString= JSON.stringify({invitePacket: data});
 	//console.log(dataString);

    var options = {
    	host: 'localhost',
    	port: 3005,
    	path: '/api/Messages/sendInvite', 
    	method:  'POST',
    	headers: {
	      'Content-Type': 'application/x-www-form-urlencoded',
	      'Content-Length': Buffer.byteLength(dataString)
	    }
    };


	var req = http.request(options, (res)=>{
  
  		console.log('statusCode:', res.statusCode);
  		console.log('headers:', res.headers);

  		res.on('data', (d) => {
    	process.stdout.write(d);
    	callback(null,d);

  		});

	}).on('error', (e) => {
  		console.error(e);
  		callback(e);
	});  

	req.write(dataString);
	req.end();

 }



  Person.remoteMethod('invite', 
  {
  description: 'Invite a person by email',
  accepts:
  { arg: 'invitePacket', type: 'Object', required: true},
    http:
  {path: '/invite', verb:'post'},
  returns:
  {arg: 'invitation-results', type: 'Object' }
  });

};
