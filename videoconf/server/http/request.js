const rc = require('./config');
const rp = require('request-promise');

//this is the zoom service wrapper
//so that our zoom client does not need to care about the version or API methods we don't care about
//just use one object to make all requests?  seems preferable.
//whether this module is used on zoom's client seems less important 
//lol it probably can't be if zoom's client is in a different stack (java, php etc)
//this layer
module.exports = new Request(); //prepare to make multiple REST requests, with all the defaults if no params get passed


var Request = function(){
   //prepare to call multiple requests on a common api 	
   Request.prototype.options = new rc.Options();
}


Request.prototype.post = function(methodId, pathString, queryObject){

    let options = Request.prototype.options;	
    rp.post(options).then(function(htmlString){
       //todo: process html  
       console.log("sent a post request: ",htmlString); 
    })
    .catch(function(err){
       console.error("there was an error sending the request: ",err);	    
    });
    	
}

