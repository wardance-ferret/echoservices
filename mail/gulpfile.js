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

//this task can be run without error, even when the groups already exist.
gulp.task('addGroupsToDb', function(done){
   var redirect = logRedirect('ea-be-gulp.log');

   var command = 'mongo -u'+process.env.MONGO_USER
                  +' -p'+process.env.MONGO_PASSWORD
                  +' --authenticationDatabase '+process.env.MONGO_DATABASE
                  +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_DATABASE
                +' '
                +path.join(process.env.MONGO_SCRIPT_HOME,'mongo_add_groups.js')
                +' '+redirect;  

    exec(command, function(err){
        if (err){
          done(err);
        }else{
          done();
        }
    });

});


gulp.task('fixRegistrants', function(done){
   var redirect = logRedirect('ea-be-gulp.log');

   var command = 'mongo -u'+process.env.MONGO_USER
                  +' -p'+process.env.MONGO_PASSWORD
                  +' --authenticationDatabase '+process.env.MONGO_DATABASE
                  +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_DATABASE
                +' '
                +path.join(process.env.MONGO_SCRIPT_HOME,'mongo_update_registrants.js')
                +' '+redirect;  

    exec(command, function(err){
        if (err){
          done(err);
        }else{
          done();
        }
    });
});


gulp.task('fixForbiddenResources', function(done){
   var redirect = logRedirect('ea-be-gulp.log');

   var command = 'mongo -u'+process.env.MONGO_USER
                  +' -p'+process.env.MONGO_PASSWORD
                  +' --authenticationDatabase '+process.env.MONGO_DATABASE
                  +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_DATABASE
                +' '
                +path.join(process.env.MONGO_SCRIPT_HOME,'mongo_update_resources_1.js')
                +' '+redirect;  

    exec(command, function(err){
        if (err){
          done(err);
        }else{
          done();
        }
    });
});

gulp.task('fixUnknownResources', function(done){
   var redirect = logRedirect('ea-be-gulp.log');

   var command = 'mongo -u'+process.env.MONGO_USER
                  +' -p'+process.env.MONGO_PASSWORD
                  +' --authenticationDatabase '+process.env.MONGO_DATABASE
                  +' '+process.env.MONGO_HOST
                +':'
                +process.env.MONGO_PORT+'/'
                +process.env.MONGO_DATABASE
                +' '
                +path.join(process.env.MONGO_SCRIPT_HOME,'mongo_update_resources_2.js')
                +' '+redirect;  

    exec(command, function(err){
        if (err){
          done(err);
        }else{
          done();
        }
    });
});

//this doesn't include creating the web app user or the root user
gulp.task('populateDb', function(done){

   if (typeof process.env.MOCKDATA_HOME != 'undefined'){

      console.log('adding mock data to the database');
      var ClinicPermissionsTestSetup = require(path.join(process.env.MOCKDATA_HOME,'clinicPermissionsTestSetup.js'));
      var clinicPermissionsTestSetup = new ClinicPermissionsTestSetup();
      clinicPermissionsTestSetup.setup().then(function() {
        done();
      });

   } else {
      console.error('you must set MOCKDATA_HOME');
      done(new Error('you must set MOCKDATA_HOME'));
   }


});


gulp.task('depopulateDb', function(done){

   if (typeof process.env.MOCKDATA_HOME != 'undefined'){

      console.log('removing mock data from the database');
      var ClinicPermissionsTestSetup = require(path.join(process.env.MOCKDATA_HOME,'clinicPermissionsTestSetup.js'));
      var clinicPermissionsTestSetup = new ClinicPermissionsTestSetup();
      clinicPermissionsTestSetup.tearDown().then(function() {
        done();
      });

   } else {
      console.error('you must set MOCKDATA_HOME');
      done(new Error('you must set MOCKDATA_HOME'));
   }

});


gulp.task('deployRoutes', function(done){
//depending on whether this is production or deployment, run a different script.
   switch(process.env.NODE_ENV){
     case 'production':
     console.log();
     break;
     case 'development':
     console.log();
     break;
     default:
     console.log();
     break;
   }
});


gulp.task('init', ['addGroupsToDb'], function(done){
    done();
})


gulp.task('default', ['deploy'], function(done){
    var redirect = logRedirect('ea-be-console.log');

	if (process.env.NODE_ENV == 'production'){
	    console.log('app started!');
	    console.log('the process is: nohup node . '+redirect+' &');
      	exec('nohup node . '+redirect+' & ', function(err){
       		if (err){
       			done(err);
       		}else {
       			done();
       		}      		
        }); 		
	} else {

       console.log('you can now launch the app by typing \'nodemon\'...');

	}
});

//add a watch on two files to apply the patches
gulp.task('apply-patches', function(){
	console.log("apply the patches...");
});


gulp.task('run-tests', function(done){

    var redirect = logRedirect('ea-be-gulp-npm-test.log');
    
	if (process.env.NODE_ENV == 'development'){		
		exec('npm test '+redirect, function(err){
			if (redirect){
			   console.log("tests are running, you can view the results at "+redirect);
			}
			if (err){
				done(err);
			}else{
				done()
			}
		});
	} else {
		done();
	}
});

gulp.task('deploy', ['run-tests'], function(){
	console.log('deploy for '+process.env.NODE_ENV);
});

/*
Helpful links:
https://github.com/gulpjs/gulp/blob/master/docs/API.md
*/