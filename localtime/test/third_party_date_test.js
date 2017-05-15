var timezoneJS = require('timezone-js');
var tzdata = require('tzdata');
var _tz = timezoneJS.timezone;
_tz.loadingScheme = _tz.loadingSchemes.MANUAL_LOAD;

describe('third party time zone tests',function(){

   const expect = require('expect.js');
   var app = require('../server/server'); 

   before(function(){
		console.log('doing some setup...');
		_tz.loadZoneDataFromObject(tzdata);
   });

   it('should present a server time as a local time', function(){
   	var dt = new timezoneJS.Date(2017,11,16,8,0, 'America/New_York');
   	console.log(JSON.stringify(dt));
   	expect(dt.toString('MMM dd yyyy HH mm ss','America/Denver')).to.equal('Dec 16 2017 06 00 00');
   });


   //suppose we store the ms timestamp 
   it('should present a timestamp from the server as a local time', function(){
   	var dt = new timezoneJS.Date(1513436400000, 'America/New_York');
   	console.log(JSON.stringify(dt));

   	expect(dt.toString('MMM dd yyyy HH mm ss','America/Denver')).to.equal('Dec 16 2017 08 00 00');
   });


});   