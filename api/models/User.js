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
			defaultsTo: "Guest"
		},
		rating: {
			type: "integer",
			required: true,
			defaultsTo: 1200
		},
		uid: {
			type: "string",
			required: true,
			defaultsTo: "guest:12345"
		},
		gender: {
			type: "string",
			defaultsTo: "unknown"
		},
		firstName: {
			type: "string",
			required: true,
			defaultsTo: "Visiting"
		},
		lastName: {
			type: "string",
			required: true,
			defaultsTo: "Guest"
		},
		picture: {
			type: "string",
			required: true,
			defaultsTo: "http://lorempixel.com/100/100/animals/"
		},
		timezone: {
			type: "string",
			required: true,
			defaultsTo: "-5"
		}
	}
};

