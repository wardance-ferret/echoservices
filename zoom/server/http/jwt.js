module.exports = Jwt;


var Jwt = function(){

  const jsonwebtoken = require('jsonwebtoken');
  
  const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
  };

  const Jwt.prototype.token = jsonwebtoken.sign(payload, config.APISecret);

}


Jwt.prototype.getToken = function(){
  return Jwt.prototype.token;
} 
