'use strict';

const logger = require('../../server/logger');


module.exports = function(app){

	app.date = {

		formatUnixTimestamp: (timestamp) => {
			var dateObj = new Date(timestamp*1000);

			return dateObj.toUTCString();
			// return dateObj.getHours()+':'
			//      +(dateObj.getMinutes() < 10?'0'+dateObj.getMinutes():dateObj.getMinutes())
			//      +' '+dateObj.getDate() + ' ' 
			//      + app.date.monthName(dateObj) + ' '
			//       + dateObj.getFullYear();
			//+'. UTC Offset: '+(dateObj.getTimezoneOffset()/60)+' hours';
		},

		formatUnixMilliseconds: (timestamp) => {
			//console.log(timestamp);
			var dateObj = new Date(timestamp);
			//console.log('dateObj: '+JSON.stringify(dateObj));
			return dateObj.getHours()+':'+(dateObj.getMinutes() < 10?'0'+dateObj.getMinutes():dateObj.getMinutes())+' '+dateObj.getDate() + ' ' + app.date.monthName(dateObj) + ' ' + dateObj.getFullYear();
			//+'. UTC Offset: '+(dateObj.getTimezoneOffset()/60)+' hours';
		},


		printServerUtcOffset: () => {
			var utcOffset = new Date().getTimezoneOffset();
			console.log('the iECHO server is minutes offset from UTC: '+utcOffset);
		},

		monthName: (dateTime,lang) => {
		    
		    lang = lang || "en";	
		   	var monthList = 
		   	{
				 "en":   
			   ["January", "February","March","April","May","June","July","August","September","October","November","December"]

		   	};

		       return monthList[lang][dateTime.getMonth()];

		}

 	}

}