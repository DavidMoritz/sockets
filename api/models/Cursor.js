/**
* Cursor.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	adapter: 'localDiskDb',
	attributes: {
		left:{
			type:'string',
			required:true,
			defaultsTo: '0px'
		},
		top:{
			type:'string',
			required:true,
			defaultsTo: '0px'
		}
	}
};