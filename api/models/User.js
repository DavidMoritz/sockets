/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		name: {
			type: "string",
			required: true,
			defaultsTo: ""
		},
		rating: {
			type: "integer",
			required: true,
			defaultsTo: 1200
		},
		uid: {
			type: "string", 
			required: true,
			defaultsTo: ""
		},
		gender: {
			type: "string",
			required: true,
			defaultsTo: "unknown"
		},
		firstName: {
			type: "string",
			required: true,
			defaultsTo: ""
		},
		lastName: {
			type: "string",
			required: true,
			defaultsTo: ""
		},
		picture: {
			type: "string",
			required: true,
			defaultsTo: ""
		},
		timezone: {
			type: "string",
			required: true,
			defaultsTo: ""
		}
	}
};

