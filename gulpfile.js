var gulp = require('gulp');
var karma = require('gulp-karma');
var ts = require('gulp-tsc');


var testFiles =[
	'bower_components/angular/angular.js',
	'bower_components/angular-messages/angular-messages.js',
	'bower_components/angular-mocks/angular-mocks.js',
	'bower_components/lodash/lodash.min.js',
	'app/js/*.js',
	'app/js/*.test.js'
];

var karmaConfigFile = 'tests/karma.conf.js';



var config = {
	app:{
		ts:{
			src:'app/ts/**/*.ts',
			dest:'app/ts'
		}
	}
}


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


gulp.task('typescript', function () {
  gulp.src(config.app.ts.src)
    .pipe(ts({
	    	module:'amd',
	    	sourcemap: true,
	    	emitError: false
	    }))
    	.pipe(gulp.dest(config.app.ts.dest));
});

gulp.task('watch', function(){
	gulp.watch(config.app.ts.src, ['typescript']);
})


gulp.task('default', function () {
	gulp.src(testFiles)
	.pipe(karma({
		configFile: karmaConfigFile,
		action:'watch'
	}));
});
