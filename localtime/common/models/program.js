'use strict';
const cjson = require('circular-json');
const Rx = require('rxjs/Rx');

module.exports = function(Program) {

    //why add hooks on sessions to program.js? 
    //This better reflects how sessions are set and got through a program in other areas 
	//put /Programs/:id/sessions/:fk


	//Nov 5 2017 8 am in MDT is 1509894000

    //todo: copy pasted from Tzuser.getTimezone, refactor!!!
	Program.getTimezone=function(programId,fieldName,timestamp){
		return Rx.Observable.fromPromise(Program.find({where: {id: programId}, include: ['timezone']})
		  		).flatMap((programs)=>{
		  		if (!programs[0]){
		  			//console.log('could not find program');
		  			return Rx.Observable.from([[]]);
		  		}
		  		//console.log(JSON.stringify(programs[0]));
		  		//console.log(JSON.stringify({location: programs[0].toJSON().location}));	
		  		return Rx.Observable.from([{location: programs[0].toJSON().location, timezoneId: programs[0].toJSON().timezoneId}]);
		  	}).flatMap((location)=>{
		  		if (!location){
		  			return Rx.Observable.from([[]]);
		  		}
		  		return Program.app.models.Timezone.getTimeZoneObserv(timestamp, location.location.lat, location.location.lng).map(
		  				(apiResponse) => {
		  					apiResponse.fieldName = fieldName;
		  					return apiResponse;
		  				}
		  			);
		});
	};



	Program.afterRemote('*.*', function(context, instance, next){

		console.log('the loopback method called was '+cjson.stringify(context.methodString));	
        next();

	});

	//session feed will show the session times with respect to the user's current time zone ()
	Program.afterRemote('*.__get__sessions', function(context, instance, next){

		//console.log(cjson.stringify(context.req));

		//console.log('instance:'+cjson.stringify(instance));


		//use the system's current timestamp
		Program.app.models.TzUser.getTimezone(context.req.accessToken.userId,
		                                      Math.ceil(new Date().getTime()/1000)
		                                      ).subscribe(Program.app.observable.concatAndFinalize(next,[]));

	});



	Program.utcToLocal = function(utcTime, rawOffset, dstOffset){
		return new Number(utcTime) + (new Number(rawOffset)*1000) + (new Number(dstOffset)*1000);
	}


	//our server time is returned by DateJs, so this method converts to UTC first before localizing...
	//is there a problem with the server to utc segment? 
	Program.serverToLocal = function(serverTime, rawOffset, dstOffset){
		var dateObj = new Date(new Number(serverTime));
		//console.log('minutes to UTC: '+dateObj.getTimezoneOffset());
		var serverOffset = dateObj.getTimezoneOffset()*60*1000;	
		return (new Number(serverTime) + serverOffset) + (new Number(rawOffset)*1000) + (new Number(dstOffset)*1000);
	}


	Program.serverToLocalTest = function(serverTime, rawOffset, dstOffset){
		var dateObj = new Date(new Number(serverTime));
		//console.log('minutes to UTC: '+dateObj.getTimezoneOffset());
		//console.log('toLocaleString: '+dateObj.toLocaleString());
		var serverOffset = dateObj.getTimezoneOffset()*60*1000;	
		return (new Number(serverTime) + serverOffset) + (new Number(rawOffset)*1000) + (new Number(dstOffset)*1000);
	}


	Program.serverToUtc = function(serverTime){
		var dateObj = new Date(new Number(serverTime));
		//console.log('minutes to UTC: '+dateObj.getTimezoneOffset());
		//console.log('toLocaleString: '+dateObj.toLocaleString());
		var serverOffset = dateObj.getTimezoneOffset()*60*1000;	
		return (new Number(serverTime) + serverOffset);
	}


    //edit session time (for Coordinators) will show times with respect to the program's current time zone
	//the instance is a session (the only model that displays time, without carrying time zone information in itself)
	Program.afterRemote('*.__findById__sessions', function(context, instance, next){

		const timeFields = ["startTime", "endTime"];
		var timeField;

		var remCtx = context.req.remotingContext;

		return Rx.Observable.from(timeFields).flatMap((field)=>{
            
			if (Object.keys(instance[field]).length===0){
				return Rx.Observable.from([[]]);

			}

			return Program.getTimezone(instance.programId, field,
					Math.ceil(instance[field].timestamp/1000));
		}).flatMap((timezone)=>{
			if (!timezone){
				return Rx.Observable.from([[]]);
			}

			//console.log(JSON.stringify(timezone));
            return Rx.Observable.fromPromise(Program.app.models.Timezone.find({where: {name : timezone.timeZoneName}})).flatMap((tz)=>{
            	if (!tz.length) {
            		return Rx.Observable.from([[]]);
            	}
            	console.log(JSON.stringify(tz));
            	timezone.abbrev = tz[0].abbrev||'';
            	return Rx.Observable.from([timezone]);
            });

		 }).flatMap((timezone)=>{

		 	//console.log(JSON.stringify(timezone));

			if (!timezone){
				return Rx.Observable.from([[]]);
			}

			//which are the time fields that need local info?

			var timeField = timezone.fieldName;

			if (remCtx.result[timeField] && remCtx.result[timeField].timestamp) {
				remCtx.result[timeField].timeZoneId = timezone.timeZoneId;
				remCtx.result[timeField].timeZoneName = timezone.timeZoneName;
				remCtx.result[timeField].dstOffset = timezone.dstOffset;
				remCtx.result[timeField].rawOffset = timezone.rawOffset;
				remCtx.result[timeField].abbrev = timezone.abbrev;

				var dateString2 = Program.app.date.formatUnixMilliseconds(new Number(remCtx.result[timeField].timestamp)) + ' System time (~MT)';
            	remCtx.result[timeField].note2 = dateString2;

				var dateString3 = Program.app.date.formatUnixMilliseconds(Program.serverToLocal(remCtx.result[timeField].timestamp, timezone.rawOffset, timezone.dstOffset)) + ' '+timezone.abbrev;
            	remCtx.result[timeField].note3 = dateString3;

            	//var dateString = Program.app.date.formatUnixMilliseconds(Program.serverToLocalTest(remCtx.result.startTime.timestamp, timezone.rawOffset, timezone.dstOffset)) + ' '+timezone.abbrev;			
				//remCtx.result.startTime.note = dateString;

            }


			return Rx.Observable.from([timezone]);
		}).subscribe(Program.app.observable.concatAndFinalize(next,[]));

		//next();
	});


	// Program.beforeRemote('*.__updateById__sessions', function(context, instance, next){

	// 	next();

	// });

	// // post /Programs/:id/sessions
	// Program.beforeRemote('*.__create__sessions', function(context, instance, next){

	// 	next();

	// });


};
