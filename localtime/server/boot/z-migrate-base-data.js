
module.exports = function(app){

    var Rx = require('rxjs/Rx');

    var emptyResult = (data) => { //see person.js for other usage
    	return Array.isArray(data) && data.length == 0;
    }

    var testAddModels = function(modelName,callback){
        addModels(modelName).subscribe(app.observable.concatAndFinalize(callback,[]));
    };


    var saveInstancesToModel = function(instances,modelName){

            console.log('save new instances...');
            return Rx.Observable.from(instances).flatMap((instance)=>{
            
                console.log(JSON.stringify(instance)+'...');
                return Rx.Observable.fromPromise(app.models[modelName].create(instance));
            
            });

    };


	var addModels = function(modelName){

		return Rx.Observable.fromPromise(app.models[modelName].find({})).flatMap((results)=>{
			if (!emptyResult(results)){
				return Rx.Observable.from(results);
			} else {
				//if no models found in db, create them
                console.log(modelName+' was not found in the database, creating...');
				let newInstances = require(process.env.MIGRATE_HOME+modelName+'.json');
				console.log('reading instances from: '+process.env.MIGRATE_HOME+modelName+'.json');
               
                if (!emptyResult(newInstances)){
                    return saveInstancesToModel(newInstances,modelName);
                } else {
				    return Rx.Observable.from([[]]);
			    }
			}
		});

	};


    testAddModels('Timezone',function(error, results){
        if (error){
            console.log('testAddModels - Timezone - there was an error: '+error);
            return;
        } else {
           //console.log('group results: '+JSON.stringify(results));
           //console.log('Group: database is OK');
           return;
        }
    });

	
} //end of module