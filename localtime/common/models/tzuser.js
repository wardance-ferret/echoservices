'use strict';

module.exports = function(Tzuser) {

  Tzuser.settings.caseSensitiveEmail=false;

  Tzuser.settings.acls.length=0;

  Tzuser.settings.acls = require('./tzuser.acl.json');


  //validation methods are invoked automatically each time a model instance is created or updated
  //if a user is registered ("created") then 
  
  Tzuser.validatesPresenceOf('email');


};
