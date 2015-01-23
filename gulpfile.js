var gulp = require('gulp');
var karma = require('gulp-karma');

var testFiles =[
'bower_components/angular/angular.js',
'bower_components/angular-mocks/angular-mocks.js',
'bower_components/lodash/lodash.min.js',
'app/js/*.js',
'app/js/*.test.js'
];
var karmaConfigFile = 'tests/karma.conf.js';

gulp.task('test', function(){
return gulp.src(testFiles)
		.pipe(karma({
			configFile: karmaConfigFile,
			action:'run'
		}))
		.on('error', function (err) {
			throw err;
		});
});


gulp.task('default', function () {
	gulp.src(testFiles)
	.pipe(karma({
		configFile: karmaConfigFile,
		action:'watch'
	}));
});
