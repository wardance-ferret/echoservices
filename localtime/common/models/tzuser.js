'use strict';
const Rx = require('rxjs/Rx');

module.exports = function(Tzuser) {

  Tzuser.settings.caseSensitiveEmail=false;

  Tzuser.settings.acls.length=0;

  Tzuser.settings.acls = require('./tzuser.acl.json');


  //validation methods are invoked automatically each time a model instance is created or updated
  //if a user is registered ("created") then 
  
  Tzuser.validatesPresenceOf('email');


  Tzuser.getTimezone=function(id, timestamp){
  	return Rx.Observable.fromPromise(Tzuser.find({where: {id: id}, include: ['timezone']})
  		).flatMap((users)=>{
  		if (!users[0]){
  			return Rx.Observable.from([[]]);
  		}
  		//console.log(JSON.stringify(users[0]));
  		//console.log(JSON.stringify({lastLocation: users[0].toJSON().lastLocation}));	
  		return Rx.Observable.from([{lastLocation: users[0].toJSON().lastLocation, timezoneId: users[0].toJSON().timezoneId}]);
  	}).flatMap((location)=>{
  		return Tzuser.app.models.Timezone.getTimeZoneObserv(timestamp, location.lastLocation.lat, location.lastLocation.lng);
  	});
  }
 

};
