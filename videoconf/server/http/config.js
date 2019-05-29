module.exports = Options;





// the uri may depend on user input (user wants the /userinfo/{email} method)
// the qs may also depend on same (status: 'active')
// if there is a post body on the zoom api call itself, then the zoom client here will need to supply a post body also
// if we standardized on jwt, that wouldn't be something configurable & then the client itself of these service would need to use this technique also.  if we didn't standardize on jwt then we'd need to configure 
var Options = function(api,methodId,pathString,queryObject){

    //not necessarily read from .env, from config.json
    //FOR NOW:  assume this is for Zoom only, we need only jwt auth
    const apiUri = api || 'https://api.zoom.us/v2'; 	
    const methodId = methodId || '/userinfo'; 
    const path = pathString || '/myemail';
    const query = queryObject || { status: 'active'}
    const userAgent = 'Zoom-api-Jwt-Request';
    //is it a good idea to generate bearerToken each time there is a new Options?  No
    const bearerToken = require('./jwt').getBearerToken();

    //this options module is only ever used with request.js, therefore...
	//the User-Agent will need to be specific to this "service"
    Options.prototype  = {

    	//You can use a different uri if you're making an API call to a different Zoom endpoint.
	//
    	uri: apiUrl + methodId + pathString, 
    	qs: queryObject, 
    	auth: {
        	'bearer': bearerToken
    	},
    	headers: {
        	'User-Agent': userAgent,
        	'Content-Type': 'application/json'
    	},
    	json: true //Parse the JSON string in the response
    };

}

Options.prototype.update = function(methodId,pathString,queryObject){

  //domain will be the same for a series of calls
  //& so will jwt auth.
 //but the path & method will not be the same.
 //how to handle?
    Options.prototype.uri = apiUrl + methodId + pathString;   
    Options.prototype.qs = queryObject;

}

Options.prototype.getUri = function(){

     return Options.prototype.uri;	
}


//FUTURE:
//the idea is that we could pass in a baseUri for the api & a uri suffix for the api's method
//in this way, options is not tied to zoom specifically, and this method could work for box too, 
//only it is not clear if request-promise will break if the Options are specified differently
//the only thing that is zoom specific is the client api (this is just the particular implementation for
//making http requests)  

