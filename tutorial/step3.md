## Writing for the Angular 2.0 Roadmap

Before we go to the work of convert our application to Typescript, it is important to understand the goal. The intended destination is not
just Typescript for its own sake (though I believe that would be compelling enough a reason.) The intended destination of
this project is alignment with the AtScript / Es6 syntax. In order to make our efforts worthwhile, we need to make sure we write code that will mesh well with that framework. 

Angular 2.0 is committed to the following:
	- Use of ES6 modules, instead of pure Angular modules.
	- Use of the ES6 class syntax
	- Type checking system during development to validate input
	- Type annotations to power dependency injection

Typescript has syntax for each of these things
	- The 'module' keyword
	- Support for ES6 class syntax
	- Type annotations throughout

We've actually written code this way already. Angular modules encapsulate all related functionality, and declare their dependencies. In index.js, each call to module.controller or module.service, is an effective class definition. And we've used consistent structure in our data, though it's never been formalized. For the rest of the tutorial, we'll take this existing structure, and make it explicit to the compiler using the Typescript / ES6 syntax.


### Typescript Modules

Typescript Modules use a common syntax, which is transpiled to either AMD or CommonJS. While this is not compliant with ES6 syntax, it does not require a commitment to a specific module system. When the Typescript compiler *is* upgraded to support ES6, your code will 'just work'. 

	// Example Typescript module syntax

	import services = require('../services');

	export var CONSTANT_VALUE = 'Some constant...';
	export function serviceUser (){/*...*/};

	// Equivalent ES6

	import * as services from '../services';

	export const CONSTANT_VALUE = 'Some constant...';
	export function serviceUser (){/*...*/};

As you can see, the syntax differences are incredibly small. So, let's start adding some modules to our project!

Navigate to the Typescript folder of the application

	cd app/ts

Next, make three directories - one for each submodule of our Angular code. 

	mkdir cart
	mkdir orders
	mkdir checkout

Following this, create two files in each folder. We'll call them _module.ts, and _index.ts
	
	touch cart/_module.ts
	touch cart/_index.ts

	touch orders/_module.ts
	touch orders/_index.ts

	touch checkout/_module.ts
	touch checkout/_index.ts

The _index files will contain a reference to each other file in the folder. This prevents circular dependencies for the AMD modules. 
The _module files, will each contain the definition and configuration of each Angular module, which can then be referenced by the individual class definiton files we'll be filling the folders with.

We preface the names 'module' and 'index' with an underscore in order to keep them in a consistent location when navigating through the folder structure in a GUI.

Finally, we'll add a final file

	touch futureStore.ts

This will contain the main Angular JS module, and reference the neccesary _index files for it's dependant modules. When using RequireJS (or your AMD loader of choice) we'll be referencing this file's compiled Javascript.


## Gulp Build Process

Before we continue, we should set up a Gulp task to compile our Typescript automatically. We'll also add a watch task to keep the compilation continuous. There are three Gulp modules for compiling typescript. I found Gulp-tsc to be the best option. 

	npm install --save-dev gulp-tsc

The Gulp task can then be configured as such:

	// In gulpfile.js:
	var ts = require('gulp-typescript');

	var config = {
		app:{
			ts:{
				src:'app/ts/**/*.ts',
				dest:'app/ts'
			}
		}
	};

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
		});

And that's all there is!

## The Cart Module

Now we're ready to start our refactoring our first Angular module into Typescript! Following AMD module recommendations, we'll make a file for each of our classes.