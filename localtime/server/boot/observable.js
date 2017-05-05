const Rx = require('rxjs');
var logger = require('../logger');
var request = require('request');

module.exports = function(app){

	app.observable = {

		sendObservableRequest: (dataPacket,type) => {

		  console.log("sending observable request...");

		  return Rx.Observable.create((observer) => {
		    request[type](dataPacket, 
		      function(err, httpResponse, body) {

		        logger.log('debug', 'sendObservableRequest response: '+JSON.stringify(httpResponse));

		        if (err) {
		          observer.error(new Error("sendObservableRequest: "+err));
		        } 

		        observer.next(httpResponse);
		        observer.complete();

		    }); 
		  });
		},


		concatAndFinalize: (loopbackNext, results) => {
	          return {
			      next: (x) => {   console.log('result: '+JSON.stringify(x)); results = results.concat(x);},
			      error: (err) => { loopbackNext(err); },
			      complete: () => { loopbackNext(null, results); }
		  	  };
      	}

    }

} 