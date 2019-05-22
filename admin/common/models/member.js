'use strict';

module.exports = function(Member) {


	Member.observe('before save',function(ctx,next){
        console.log('get the next available member id...');
        Member.app.models.Uid.getNextId("Member")
        .then(function(result){
        	console.log('use Member '+JSON.stringify(result.maxId));
        	console.log('instance: '+JSON.stringify(ctx.instance));
        	ctx.instance.id = result.maxId;
        	next();
        })
        .catch(function(err){
        	console.log('error in promise, Member < save: '+err);
        	next(err);
        });
	});

};
