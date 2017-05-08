'use strict';

const logger = require('../../server/logger');


module.exports = function(app){

	app.date = {

		formatUnixTimestamp: (timestamp) => {
			var dateObj = new Date(timestamp*1000);
			return dateObj.getHours()+':'+(dateObj.getMinutes() < 10?'0'+dateObj.getMinutes():dateObj.getMinutes())+' '+dateObj.getDate() + ' ' + app.date.monthName(dateObj) + ' ' + dateObj.getFullYear()+'. UTC Offset: '+(dateObj.getTimezoneOffset()/60)+' hours';
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