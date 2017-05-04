'use strict';

require('dotenv').config();
const utils = require('loopback-datasource-juggler/lib/utils');
// const googleMapsClient = require('@google/maps').createClient({
// 			key: process.env.GOOGLE_API_KEY
// });

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

		//promise not returned, then is not a function	
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


	// Timezone.testClient1 = function(callback){
	// 	console.log('API KEY: '+process.env.GOOGLE_API_KEY); 
	// 	callback(null,[]);
	// };


	//use this method as a placeholder for getting a list of city -> tz pairs used in a clinic settings dropdown 
	Timezone.getFromThirdParty = function(callback){
		callback(null,[]);
	};

    //return a time zone for a lat lon pair
	Timezone.fromLatLon = function(lat,lon,callback){
		callback(null,[]);
	};




	Timezone.utcToLocal = function(timestamp, lat, lon, callback){
		callback(null,[]);
	};

	Timezone.localToUtc = function(timestamp, lat, lon, callback){
		callback(null,[]);
	}

	Timezone.geocode = function(address, callback){

        console.log('API KEY: '+process.env.GOOGLE_API_KEY); 
  
		var googleMapsClient = require('@google/maps').createClient({
			key: process.env.GOOGLE_API_KEY
		});

		googleMapsClient.geocode({address: '411 Brandon Ave Charlottesville, VA 22903'}, function(err, response){
			if (err){
				console.error(err);
				callback(err);
			} else {
                console.log(response);
				callback(null,[]);
		    }
		})
	};

	Timezone.remoteMethod('testClient2',{
		description: 'make server API call to get all possible timezones.',
		accepts:[],
		http:{path:'/testClient2',verb:'get'},
        returns: {arg: 'allTimezones',type:'Object'}
	});

	//remote method for third-party API to populate the TZ DB
	Timezone.remoteMethod('getFromThirdParty',{
		description: 'make server API call to get all possible timezones.',
		accepts:[],
		http:{path:'/getFromThirdParty',verb:'get'},
        returns: {arg: 'allTimezones',type:'Object'}
	});

	Timezone.remoteMethod('fromLatLon',{
		description: 'estimate the time zone from the lat and lon',
		accepts:[
			{arg: 'lat', type: 'number'},
			{arg: 'lon', type: 'number'}
		],
		http:{path:'/fromLatLon',verb:'get'},
        returns: {arg: 'timezone',type:'Object'}
	});


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

    //this DOES NOT WORK!
    //Coordinator schedules a session in MDT, but it'll be stored in UTC.
	Timezone.remoteMethod('localToUtc',{
		description: 'publish the given timestamp as a UTC timestamp',
		accepts:[
		    {arg: 'timestamp', type: 'number' }, 
			{arg: 'lat', type: 'number' },
			{arg: 'lon', type: 'number' }
		],	
			http:{path:'/localToUtc',verb:'get'},
        	returns: {arg: 'localTime',type:'Object'}

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
