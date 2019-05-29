module.exports = DatasourcesWriter;

const fs = require('fs');
const path = require('path');
const logger = require('../logger');
var loopback = require('loopback');
var env = require ('dotenv').config({"path":path.join(__dirname,'../../.env')})
const dotenvParseVariables = require('dotenv-parse-variables');

//as suggested by https://github.com/strongloop/loopback/issues/174

var DatasourcesWriter = function(){

  DatasourcesWriter.prototype.clone = {};
  DatasourcesWriter.prototype.config = {};
  DatasourcesWriter.prototype.env = {};

  if (env.error) {
    throw env.error;
  }

  env = dotenvParseVariables(env);

  DatasourcesWriter.prototype.env = env;

  // console.log("process.env:",process.env.MONGO_HOST);
  // console.log("env:",DatasourcesWriter.prototype.env);


}

const DATASOURCES_FILE = '../datasources.json';
const DATASOURCES_CONFIG = './datasources-writer-config.json';



DatasourcesWriter.prototype.getValue = function(string){

  let env = DatasourcesWriter.prototype.env;

   if (typeof string === "undefined"){
      console.log("could not evaluate environment variable: must be a string, was ",(typeof string || "undefined"));
      return "";
   }

   if (typeof string.replace === "function"){

      //check for an initial $ which means the value is the name of a process.env variable
      let re = new RegExp(/^\$(.+)$/,'i');

      let modified = string.replace(re,'$1','g');

      if (modified!==string){
        return env[modified];
      } else {
        return string;
      }

   }

   return string;


}



//modify the file content using either the config file (versioned) or the existing file (not versioned)
DatasourcesWriter.prototype.createDatasourceConnection = function(name, json){

    Object.keys(json).forEach((property)=>{


      if (property==="url"){

        //may no longer be needed
        delete DatasourcesWriter.prototype.clone[name][property];

        //DO NOT comment this in, it should not write to the log.
        // logger.log("warn","setting connection url to "+url);
        DatasourcesWriter.prototype.clone[name][property] = url;

      }else{


        if(typeof DatasourcesWriter.prototype.clone[name] === "undefined"){
          DatasourcesWriter.prototype.clone[name]= {};
        }

        DatasourcesWriter.prototype.clone[name][property] = DatasourcesWriter.prototype.getValue(json[property]);

      }

    });

}




DatasourcesWriter.prototype.prepareClone = function(){

  var configFile = fs.readFileSync(path.join(__dirname, DATASOURCES_CONFIG));
  DatasourcesWriter.prototype.config = JSON.parse(configFile.toString());
  var config = DatasourcesWriter.prototype.config;
  if (typeof config === "undefined"){
    console.log("error, couldn't parse config file");
    return;
  }

  var content;

  // console.log(JSON.stringify(config));


  DatasourcesWriter.prototype.createDatasourceConnection("db",
                                                          config["db"]);


  DatasourcesWriter.prototype.createDatasourceConnection("transient",
                                                          config["transient"]);


  DatasourcesWriter.prototype.createDatasourceConnection("storage",
                                                          config["storage"]);

  DatasourcesWriter.prototype.createDatasourceConnection("restapi",
                                                          config["restapi"]);

  content = (DatasourcesWriter.prototype.clone||{});

  // console.log('updated values: ',content);

}


DatasourcesWriter.prototype.getClone = function(){
  return (DatasourcesWriter.prototype.clone||{});
}

