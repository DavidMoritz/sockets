/**
* Gem.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	attributes: {
		name:{
			type:'string',
			required:true
		},
		display:{
			type:'string',
			required:true
		},
		btnClass:{
			type:'string',
			required:true
		},
		color:{
			type:'string',
			required:true
		}
	}
};

