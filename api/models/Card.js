/**
* Card.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		id:{
			type:'string',
			primaryKey: true,
			required:true
		},
		cost:{
			type:'json',
			required:true,
			defaultsTo: 'null'
		},
		points:{
			type:'integer',
			required:true,
			defaultsTo: 0
		},
		name:{
			type:'string',
			required:true
		},
		gem:{
			type:'string',
			required:true
		},
		track:{
			type:'integer',
			required:true,
			defaultsTo: 1
		}
	}
};

