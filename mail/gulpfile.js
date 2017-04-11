var gulp = require("gulp");
var exec = require('child_process').exec;
var path = require('path');
require('dotenv').config();

//currently requires a Linux or MacOS environment, rather than Windows.

function logRedirect(logfile){

    if (typeof process.env.LOG_LOCATION != 'undefined'){
        var message = '>> '+process.env.LOG_LOCATION+'/'+logfile;
    } else {
        var message = '';
    } 

    return message; 

};


//user must already exist
gulp.task('clearDb', function(done){

  var redirect = logRedirect('ea-be-gulp.log');

  var command ='mongo -u'+process.env.MONGO_USER
                +' -p'+process.env.MONGO_PASSWORD
                +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_DATABASE
                +' '+path.join(process.env.MONGO_SCRIPT_HOME,'mongo_clear_db.js')
                +' '+redirect;
  
  exec(command, function(err){
      if(err){
        console.error(err);
        done(err);
      }else{
        done();
      }
  }); 

});


gulp.task('addDbRootUser', function(done){

//if not existing, create root user on an admin database
  var redirect = logRedirect('ea-be-gulp.log');

  var command ='mongo '+
                ' --eval "var user = \''+process.env.MONGO_ROOT_USER+
                '\'; var password = \''+process.env.MONGO_ROOT_PASSWORD+
                '\'; var admindatabase = \''+process.env.MONGO_ADMIN_DATABASE+
                '\'; var database = \''+process.env.MONGO_DATABASE 
                +'\';"'
                +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_ADMIN_DATABASE
                +' '
                +path.join(process.env.MONGO_SCRIPT_HOME,'mongo_create_rootuser.js')
                +' '+redirect;
  
  exec(command, function(err){
      if(err){
        console.error(err);
        done(err);
      }else{

      //  
      command ='mongo '+
                ' --eval "var user = \''+process.env.MONGO_ROOT_USER+
                '\'; var password = \''+process.env.MONGO_ROOT_PASSWORD+
                '\'; var database = \''+process.env.MONGO_DATABASE 
                +'\';"'
                +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_DATABASE
                +' '
                +path.join(process.env.MONGO_SCRIPT_HOME,'mongo_create_webuser.js')
                +' '+redirect;

      exec(command, function(err){
        if (err){
          done(err);
        }else{
          done();
        }
      });          

      }
  }); 

});


gulp.task('addDbWebUser', function(done){

//if not existing, create web app user on MONGO_DATABASE  
      var redirect = logRedirect('ea-be-gulp.log');

      var command ='mongo -u'+process.env.MONGO_ROOT_USER
                +' -p'+process.env.MONGO_ROOT_PASSWORD
                +' --authenticationDatabase '+process.env.MONGO_ADMIN_DATABASE
                +' --eval "var user = \''+process.env.MONGO_USER
                +'\'; var password = \''+process.env.MONGO_PASSWORD
                +'\'; var database = \''+process.env.MONGO_DATABASE 
                +'\';"'
                +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_DATABASE
                +' '
                +path.join(process.env.MONGO_SCRIPT_HOME,'mongo_create_webuser.js')
                +' '+redirect;

      exec(command, function(err){
        if (err){
          done(err);
        }else{
          done();
        }
      });  



})



gulp.task('grantDbRoleToUser', function(done){

//grant root user access to MONGO_DATABASE  
      var redirect = logRedirect('ea-be-gulp.log');

      var command ='mongo -u'+process.env.MONGO_ROOT_USER
                +' -p'+process.env.MONGO_ROOT_PASSWORD
                +' --authenticationDatabase '+process.env.MONGO_ADMIN_DATABASE
                +' --eval "var user = \''+process.env.MONGO_ROOT_USER
                +'\'; var database = \''+process.env.MONGO_DATABASE 
                +'\';"'
                +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_DATABASE
                +' '
                +path.join(process.env.MONGO_SCRIPT_HOME,'mongo_grant_role_to_user.js')
                +' '+redirect;

      exec(command, function(err){
        if (err){
          done(err);
        }else{
          done();
        }
      });  



})

/*
Helpful links:
https://github.com/gulpjs/gulp/blob/master/docs/API.md
*/