module.exports = function (grunt) {
	grunt.registerTask('gs', [
		'jade',
		'less:sg',
		'copy:sg',
		'concat:sg'
	]);
};
