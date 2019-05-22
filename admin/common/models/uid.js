'use strict';
const Promise = require('bluebird');

module.exports = function(Uid) {

	Uid.getNextId = function(modelName){
 
       let newMax = 0; 

		return Uid.find({where: {modelName: modelName}})
		.then(function(result){
			//console.log(JSON.stringify(result));
			return result;
		})
		.then(function(result){
            newMax = new Number(result[0].maxId)+1;
			return result[0].updateAttributes({maxId: newMax.toString()});
		})
		.catch(function(err){
			console.log('error: '+err);
		});

	}

};
