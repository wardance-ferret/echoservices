'use strict';

require('dotenv').config();

module.exports = function(Timezone) {

	var googleMapsClient = require('@google/maps').createClient({
		key: process.env.GOOGLE_API_KEY
	});


	Timezone.getFromThirdParty = function(callback){
		callback(null,[]);
	};

	Timezone.fromLatLon = function(lat,lon,callback){
		callback(null,[]);
	};

	Timezone.localizeTimestamp = function(timestamp, lat, lon, callback){
		callback(null,[]);
	};

	Timezone.geocode = function(address, callback){
		callback(null,[]);
	};

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

	Timezone.remoteMethod('localizeTimestamp',{
		description: 'publish the given timestamp as a local timestamp',
		accepts:[
		    {arg: 'timestamp', type: 'number' }, 
			{arg: 'lat', type: 'number' },
			{arg: 'lon', type: 'number' }
		],	
			http:{path:'/fromLatLon',verb:'get'},
        	returns: {arg: 'localizedTimestamp',type:'Object'}

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
