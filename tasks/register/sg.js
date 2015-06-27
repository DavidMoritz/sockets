module.exports = function (grunt) {
	grunt.registerTask('sg', [
		'jade',
		'less:sg',
		'copy:sg',
		'concat:sg'
	]);
};
