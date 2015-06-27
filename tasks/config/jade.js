/**
 * Clean files and folders.
 *
 * ---------------------------------------------------------------
 *
 * This grunt task is configured to clean out the contents in the .tmp/public of your
 * sails project.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-clean
 */
module.exports = function(grunt) {

	grunt.config('jade', {
		compile: {
			options: {
				pretty: true
			},
			files: grunt.file.expandMapping(['**/*.jade'], 'dist/', {
				cwd: 'src/jade',
				rename: function(destBase, destPath) {
					return destBase + destPath.replace(/\.jade$/, '.html');
				}
			})
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jade');
};