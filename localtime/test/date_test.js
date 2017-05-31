
describe('time zone tests',function(){

   const expect = require('expect.js');
   var app = require('../server/server'); 

   it('iso date from mongo can be converted to ms', function(){
     var dateObj = new Date('2017-11-06T12:00:00.000Z');
     expect(dateObj.getTime()).to.equal(1509969600000);
   });

   it('iso date from mongo can be converted to another local time', function(){
     var dateObj = new Date('2017-11-06T12:00:00.000Z');
     expect(dateObj.getTime()).to.equal(1509969600000);
   });

   it('time given in another timezone be converted to server time', function(){
     var dateObj = new Date('8:00 11/6/2017 EST');
     expect(dateObj.toLocaleString()).to.equal('11/6/2017, 6:00:00 AM');
     expect(dateObj.getTime()).to.equal(1509973200000);
   });


   it('date can be converted to a timestamp', function(){
   	 var dateObj = new Date(2017,11,16,0,0,0);
   	 expect(dateObj.getTime()).to.equal(1513407600000); 
   }); 

   it('date obj can be formatted to my user locale', function(){
   	 var dateObj = new Date(2017,11,16,8,0,0);
   	 expect(dateObj.toLocaleString()).to.equal('12/16/2017, 8:00:00 AM'); 
   }); 

   it('timestamp can be converted to the local machine date', function(){
   	 var dateObj = new Date(1513436400000);
   	 expect(dateObj.toLocaleString()).to.equal('12/16/2017, 8:00:00 AM');
   });

   it('date obj can be formatted to UTC', function(){
   	 var dateObj = new Date(2017,11,16,8,0,0);
   	 expect(dateObj.toUTCString()).to.equal('Sat, 16 Dec 2017 15:00:00 GMT'); 
   }); 

   it('date obj can be formatted to another local time', function(){
   	 var dateObj = new Date(2017,11,16,8,0,0);
       expect(dateObj.toLocaleString()+' MST').to.equal('12/16/2017, 8:00:00 AM MST');
       expect(dateObj.getTimezoneOffset()).to.equal(420);

       var apiOffset;

       //EST location:  Washington DC
       // 40.75368539999999,-73.9991637 
       app.models.Timezone.getTimeZone((dateObj.getTime()/1000),'40.75368539999999','-73.9991637', function(result,error){
            if (error) {
              console.log('there was an error with the api call: '+error);
            } else {
              console.log('google tz api result: '+JSON.stringify(result)); 
            }

            //

            //milliseconds
            var offset = apiOffset || -18000*1000;

            var newDateObj = new Date(dateObj.getTime() + dateObj.getTimezoneOffset()*60*1000 + offset);

            expect(newDateObj.toLocaleString()+' EST').to.equal('12/16/2017, 10:00:00 AM EST');
            expect(newDateObj.getTimezoneOffset()).to.equal(420);

            expect(newDateObj.toString('MMM dd yyyy')).to.equal('Sat Dec 16 2017 10:00:00 GMT-0500 (EST)');


      });


           
      // });
   	 // var localTime = app.models.Program.serverToLocal(remCtx.result[timeField].timestamp,
					// 					  timezone.rawOffset, timezone.dstOffset)
				 //                          + ' '+timezone.abbrev;
      
   }); 

   it('date obj has correct offset after Albuquerque clocks fall back on November 5', function(){
   	 var dateObj = new Date(2017,10,6,8,0,0);
   	 expect(dateObj.getTimezoneOffset()).to.equal(420); 
   }); 

   it('date obj has correct offset before Albuquerque clocks fall back on November 5', function(){
   	 var dateObj = new Date(2017,10,4,8,0,0);
   	 expect(dateObj.getTimezoneOffset()).to.equal(360); 
   }); 

}); 
