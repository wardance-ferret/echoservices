'use strict';
const cjson = require('circular-json');

module.exports = function(Program) {

	Program.beforeRemote('*.__updateById__sessions', function(context, instance, next){


		console.log(cjson.stringify(context.req));	

		var utcOffset = new Date().getTimezoneOffset();

		console.log('minutes offset from UTC: '+utcOffset);

		next();

	});


	Program.beforeRemote('*.__create__sessions', function(context, instance, next){


		console.log(cjson.stringify(context.req));	

		var utcOffset = new Date().getTimezoneOffset();

		console.log('minutes offset from UTC: '+utcOffset);

		next();

	});


};
