module.exports = function(config) {
	config.set({

		basePath: '../',

		frameworks: ['jasmine'],

		files: [
			'lib/angular.js',

            'lib/angular-debounce.js',
            'lib/elastic.js',

            'testing/*.js/',
            'testing/unit/*.js',

			'app/*.js',
			'app/controllers/*.js',
			'app/services/*.js',
			'app/filters/*.js',
		],

		exclude: [],

		preprocessors: {},

		reporters: ['progress'],

		port: 9876,

		colors: true,

		logLevel: config.LOG_INFO,

		autoWatch: true,

		browsers: ['Chrome'],

		singleRun: false,

		plugins: [
			'karma-chrome-launcher',
			'karma-jasmine'
		]
	});
};