/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {
		red: {
			type: "json"
		},
		blue: {
			type: "json"
		},
		orange: {
			type: "json"
		},
		green: {
			type: "json"
		},
		deck: {
			type: "array"
		},
		tiles: {
			type: "array"
		}
	}
};

