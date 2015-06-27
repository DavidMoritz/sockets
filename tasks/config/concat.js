/**
 * Concatenate files.
 *
 * ---------------------------------------------------------------
 *
 * Concatenates files javascript and css from a defined array. Creates concatenated files in
 * .tmp/public/contact directory
 * [concat](https://github.com/gruntjs/grunt-contrib-concat)
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-concat
 */
module.exports = function(grunt) {

	grunt.config.set('concat', {
		js: {
			src: require('../pipeline').jsFilesToInject,
			dest: '.tmp/public/concat/production.js'
		},
		css: {
			src: require('../pipeline').cssFilesToInject,
			dest: '.tmp/public/concat/production.css'
		},
		sg: {
			options: {
				stripBanners: true
			},
			files: {
				'assets/inc/lib.js': [
					'lib/jquery/dist/jquery.min.js',
					'lib/jquery-ui/jquery-ui.min.js',
					'lib/bootstrap/dist/js/bootstrap.min.js',
					'lib/lodash/lodash.min.js',
					'lib/firebase/firebase.js',
					'lib/angularfire/dist/angularfire.min.js',
					'lib/angular-filter/dist/angular-filter.min.js',
					'lib/moment/min/moment.min.js',
					'lib/touch-punch/jquery.ui.touch-punch.min.js',
					'src/external/**/*.js'
				],
				'assets/inc/main.js': [
					'src/services/mc.js',
					'src/js/app.js',
					'src/services/*.js',
					'src/js/**/*.js'
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
};
