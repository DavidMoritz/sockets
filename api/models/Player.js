/**
* Player.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		id:{
			type:'string',
			required:true
		},
		color: {
			type: 'string'
		},
		game: {
			type: 'integer'
		},
		name:{
			type:'string',
			required:true
		},
		auto:{
			type:'boolean',
			required:true
		},
		chips:{
			type:'array'
		},
		cards:{
			type:'array'
		},
		tiles:{
			type:'array'
		},
		reserve:{
			type:'array'
		},
		index:{
			type:'integer',
			required:true
		}
	}
};

