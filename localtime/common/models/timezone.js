'use strict';

require('dotenv').config();
const utils = require('loopback-datasource-juggler/lib/utils');
// const googleMapsClient = require('@google/maps').createClient({
// 			key: process.env.GOOGLE_API_KEY
// });
const logger = require('../../server/logger');
const urlencode = require('url-encode');
const Rx = require('rxjs/Rx');
const cjson = require('circular-json');

module.exports = function(Timezone) {


    /*
    *@name Timezone#testClient1
    *@function
    *@param {ResponseCallback} callback Callback function for handling the result
    *@return {RequestHandle}
    */
	Timezone.testClient1 = function(callback){
		
		console.log('API KEY: '+process.env.GOOGLE_API_KEY); 

		// const googleMapsClient = require('@google/maps').createClient({
		// 	clientId: process.env.GOOGLE_API_CLIENT_ID,
		// 	clientSecret: process.env.GOOGLE_API_CLIENT_SECRET
  //       });

		const maps = require('@google/maps');

		// maps.createClient({key:process.env.GOOGLE_API_KEY, timeout:10000}, 

		// 	function(err, client){

		// 	if (err){
		// 		console.error(err);
		// 		callback(err);
		// 	} else if (!client) {
		// 		console.info('sorry there was no client')
		// 		callback(null,[]);
		// 	} else {
		// 		console.log('client: '+JSON.stringify(client));
		// 		callback(null,[]);
		// 	}

		// });

		//promise not returned, .then is not a function	
		maps.createClient({key:process.env.GOOGLE_API_KEY, Promise: require('bluebird').Promise}).then(
			function(client){
			console.log(JSON.stringify(client));
			callback(null,[]);	
		}).catch(function(err){
			callback(err);
		});

        //callback = callback || utils.createPromiseCallback();

        //console.log(JSON.stringify(callback));
		//maps.createClient({key:process.env.GOOGLE_API_KEY, timeout:10000, Promise:callback.promise});

	};




	Timezone.beforeRemote('testClient2', function(context,instance,next){

	  var printHere = function(position){
	  	console.log(position.coords.latitude+', '+position.coords.longitude);
	  }	

	   //context.navigator.geolocation.getCurrentPosition(printHere);
       console.log('browserID: '+cjson.stringify(context.req.headers['user-agent']));
       next();
	});


    /*
    *@name Timezone#testClient2
    *@function
    *@param {ResponseCallback} callback Callback function for handling the result
    *@return {RequestHandle}
    */
	Timezone.testClient2 = function(callback){
	  console.log('testClient2...');	
	  console.log('API URL:'+process.env.GOOGLE_API_URL);
	  console.log('API KEY: '+process.env.GOOGLE_API_KEY);

	  var apiUrl = process.env.GOOGLE_API_URL+'/timezone/json';

	  apiUrl += '?location=33.45,-112.067&timestamp=1458000000&key='+process.env.GOOGLE_API_KEY;

	  var headers = {
       'Authorization':'Bearer '+process.env.GOOGLE_API_KEY,
       'Content-Type':'application/json'
      };

      var data = { headers:headers, url:apiUrl} 
	  
	  Timezone.app.observable.sendObservableRequest(data,"get")
	    .flatMap((response) => {
	      logger.log('debug','response: '+JSON.stringify(response));
	      return Rx.Observable.from([JSON.parse(response.body)]);
        }).subscribe(Timezone.app.observable.concatAndFinalize(callback,[]));
	};

	//use this method as a placeholder for getting a list of city -> tz pairs used in a clinic settings dropdown 
	//Is this because people are more likely to know the nearest large city than a zone name? 
	
	//this would be a reason to store a city->tz map in a local database.
	// Timezone.getFromThirdParty = function(callback){
	// 	callback(null,[]);
	// };


	Timezone.getTimeZone = function(timestamp, lat, lon, callback){

	  console.log('API KEY: '+process.env.GOOGLE_API_KEY); 

	  var apiUrl = process.env.GOOGLE_API_URL+'/timezone/json';

	  apiUrl += '?location='+lat+','+lon+'&timestamp='+timestamp+'&key='+process.env.GOOGLE_API_KEY;

      console.log(apiUrl);

	  var headers = {
       'Authorization':'Bearer '+process.env.GOOGLE_API_KEY,
       'Content-Type':'application/json'
      };

      var data = { headers:headers, url:apiUrl} 
	  
	  Timezone.app.observable.sendObservableRequest(data,"get")
	    .flatMap((response) => {
	      logger.log('debug','response: '+JSON.stringify(response));
	      return Rx.Observable.from([JSON.parse(response.body)]);
        }).subscribe(Timezone.app.observable.concatAndFinalize(callback,[]));

	};


	//can we flip a switch and get an observable, or not?
	Timezone.getTimeZoneObserv = function(timestamp,lat,lon){

		var apiUrl = process.env.GOOGLE_API_URL+'/timezone/json';

		if ((timestamp == 'undefined')||(lat == 'undefined')||(lon == 'undefined')){
			console.log('there was a problem with the params for google api call');
			return Rx.Observable.from([[]]);
		}

	  	apiUrl += '?location='+lat+','+lon+'&timestamp='+timestamp+'&key='+process.env.GOOGLE_API_KEY;

	  	var headers = {
	       'Authorization':'Bearer '+process.env.GOOGLE_API_KEY,
	       'Content-Type':'application/json'
      	};

      var data = { headers:headers, url:apiUrl} 
	  
	  return Timezone.app.observable.sendObservableRequest(data,"get")
	    .flatMap((response) => {
	      logger.log('debug','response: '+JSON.stringify(response));
	      return Rx.Observable.from([JSON.parse(response.body)]);
        })

	};


    /*
    *@name Timezone#utcToLocal
    *@function
	*@param {timestamp}
    *@param {lat}
    *@param {lon}
    *@param {ResponseCallback} callback Callback function for handling the result
    *@return {RequestHandle}
    */
    //timestamp must be in seconds
	Timezone.utcToLocal = function(timestamp, lat, lon, callback){
	  
	  console.log('API KEY: '+process.env.GOOGLE_API_KEY); 

	  var apiUrl = process.env.GOOGLE_API_URL+'/timezone/json';

	  apiUrl += '?location='+lat+','+lon+'&timestamp='+timestamp+'&key='+process.env.GOOGLE_API_KEY;

      console.log(apiUrl);

	  var headers = {
       'Authorization':'Bearer '+process.env.GOOGLE_API_KEY,
       'Content-Type':'application/json'
      };

      var data = { headers:headers, url:apiUrl} 
	  
	  Timezone.app.observable.sendObservableRequest(data,"get")
	    .flatMap((response) => {
	      logger.log('debug','response: '+JSON.stringify(response));
	      return Rx.Observable.from([JSON.parse(response.body)]).map((body)=>{
	      		console.log('body.rawOffset: '+JSON.stringify(body.rawOffset));
	      		var localtime = new Number(timestamp) + new Number(body.rawOffset) + new Number(body.dstOffset);
	      		//what context clues help? -- do we need?
	      		return {timestamp:localtime,
	      		        note: Timezone.app.date.formatUnixTimestamp(localtime),
	      		        lat:lat,
	      		        lng:lon,
	      		        originalUtc:timestamp,
	      		        rawOffset:body.rawOffset,
	      		        dstOffset:body.dstOffset,
	      		        timeZoneId:body.timeZoneId,
	      		        timeZoneName:body.timeZoneName,
	      		        createdAt: Math.floor(new Date().getTime()/1000)};  
	      });
        }).subscribe(Timezone.app.observable.concatAndFinalize(callback,[]));

	
	};


	Timezone.localToUtc = function(timestamp, lat, lon, callback){
	  
	  console.log('API KEY: '+process.env.GOOGLE_API_KEY); 

	  var apiUrl = process.env.GOOGLE_API_URL+'/timezone/json';

	  apiUrl += '?location='+lat+','+lon+'&timestamp='+timestamp+'&key='+process.env.GOOGLE_API_KEY;

      console.log(apiUrl);

	  var headers = {
       'Authorization':'Bearer '+process.env.GOOGLE_API_KEY,
       'Content-Type':'application/json'
      };

      var data = { headers:headers, url:apiUrl} 
	  
	  Timezone.app.observable.sendObservableRequest(data,"get")
	    .flatMap((response) => {
	      logger.log('debug','response: '+JSON.stringify(response));
	      return Rx.Observable.from([JSON.parse(response.body)]).map((body)=>{
	      		console.log('body.rawOffset: '+JSON.stringify(body.rawOffset));
	      		var utc = new Number(timestamp) - new Number(body.rawOffset) - new Number(body.dstOffset);
	      		//what context clues help? -- do we need?
	      		return {timestamp:utc,
	      		        note: Timezone.app.date.formatUnixTimestamp(utc),
	      		        lat:lat,
	      		        lng:lon,
	      		        originalLocalTime:timestamp,
	      		        rawOffset:body.rawOffset,
	      		        dstOffset:body.dstOffset,
	      		        timeZoneId:body.timeZoneId,
	      		        timeZoneName:body.timeZoneName,
	      		        createdAt: Math.floor(new Date().getTime() / 1000) };  
	      });
        }).subscribe(Timezone.app.observable.concatAndFinalize(callback,[]));
	}



	Timezone.makeUrlSafeForQuery = function(rawUrl){
		
 		rawUrl = rawUrl.replace(/\s+/g,'+');
 		var encoded = rawUrl;

		try {
		  encoded = urlencode(rawUrl);
		}catch(error){
		  console.error(error);	
		}

		return encoded;
	}


	Timezone.geocode = function(address, callback){

      console.log('API KEY: '+process.env.GOOGLE_API_KEY); 
  	  var rawUrl = process.env.GOOGLE_API_URL+'/geocode/json';

	  rawUrl += '?address='+address+'&key='+process.env.GOOGLE_API_KEY;

	  var apiUrl = Timezone.makeUrlSafeForQuery(rawUrl);

	  console.log('API URL: '+apiUrl);

	  var headers = {
       'Authorization':'Bearer '+process.env.GOOGLE_API_KEY,
       'Content-Type':'application/json'
      };

      var dp = { headers:headers, url:apiUrl}
	  
	  Timezone.app.observable.sendObservableRequest(dp,"get")
	    .flatMap((response) => {
	      logger.log('debug','response: '+JSON.stringify(response.body));
	      return Rx.Observable.from([JSON.parse(response.body)]).map((json)=>{
	      	//console.log('work on this data: '+JSON.stringify(json['results'][0]['geometry']['location']));
	      	return json['results'][0]['geometry']['location'];
	      });
        }).subscribe(Timezone.app.observable.concatAndFinalize(callback,[]));

	};

	Timezone.remoteMethod('testClient1',{
		description: 'make server API call',
		accepts:[],
		http:{path:'/testClient1',verb:'get'},
        returns: {arg: 'testResponse',type:'Object'}
	});


	Timezone.remoteMethod('testClient2',{
		description: 'make server API call',
		accepts:[],
		http:{path:'/testClient2',verb:'get'},
        returns: {arg: 'testResponse',type:'Object'}
	});

	//remote method for third-party API to populate the TZ DB
	// Timezone.remoteMethod('getFromThirdParty',{
	// 	description: 'make server API call to get all possible timezones.',
	// 	accepts:[],
	// 	http:{path:'/getFromThirdParty',verb:'get'},
 //        returns: {arg: 'allTimezones',type:'Object'}
	// });


	//think through DST portion and add more methods...

    //Session start and end times stored in UTC will be displayed in a local time
	Timezone.remoteMethod('utcToLocal',{
		description: 'publish the given timestamp as a local timestamp',
		accepts:[
		    {arg: 'timestamp', type: 'number' }, 
			{arg: 'lat', type: 'number' },
			{arg: 'lon', type: 'number' }
		],	
			http:{path:'/utcToLocal',verb:'get'},
        	returns: {arg: 'localTime',type:'Object'}

	});

    //Coordinator schedules a session in MDT, but it'll be stored in UTC, so convert the timestamp and 
    //return additional context clues as needed
	Timezone.remoteMethod('localToUtc',{
		description: 'publish the given timestamp as a UTC timestamp',
		accepts:[
		    {arg: 'timestamp', type: 'number' }, 
			{arg: 'lat', type: 'number' },
			{arg: 'lon', type: 'number' }
		],	
			http:{path:'/localToUtc',verb:'get'},
        	returns: {arg: 'utc',type:'Object'}

	});


    Timezone.remoteMethod('geocode',{
		description: 'estimate the lat and lon from the given address string',
		accepts:[
		    {arg: 'address', type: 'string' }
		],
		http:{path:'/geocode',verb:'get'},
        returns: {arg: 'latlon',type:'Object'}
	});

};
