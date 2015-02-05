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

Now we're ready to start our refactoring our first Angular module into Typescript! Until this point, we've had all our code in a single file. For the rest of this tutorial, we'll try to stick to one file per component, and import any dependencies at that point. We'll make an exception for directives which act as custom elements. All the directives in our example use a controller, and since their controllers are only designed to be used by their associated directive, we'll keep them in one file.

Let's add the files for our Cart module:

	touch cart/CartService.ts
	touch cart/shopping-cart.ts
	touch cart/cart-item.ts


### The Angular Module

_module.ts contains the definition of the 'futureStore.cart' Angular module. Each of the other files will reference _module.ts, and invoke the appropriate calls .service, .controller, etc.

For consistency, and to provide a differentation from the Typescript / ES6 module keyword, we'll export the Angular module as ngModule.

	// _module.ts
	export ngModule = angular.module('futureStore.cart', []);

After compiling with gulp task, take a look at the compiled Javascript:

	// _module.js
	define(["require", "exports"], function (require, exports) {
	    exports.ngModule = angular.module('futureStore.cart', []);
	});

This uses the standard AMD syntax for defining a module. You can read more about it here: https://github.com/jrburke/requirejs/wiki/Differences-between-the-simplified-CommonJS-wrapper-and-standard-AMD-define#exports



## Our First Service and Dependency Injection

Next, we'll begin transpiling our first service. We'll introduce another way to define dependency injection in Angular, and show how the ES6 class keyword works with the concept of Angular services.

First, we'll extract the CartService code from the Javascript and paste it into CartService.ts

	angular.module('futureStore.cart').service('CartService', ['$q', '$timeout', '$document', function($q, $timeout, $document){
		// Service factory function body

		var taxRate = 0.13; // Private variable taxRate

		// Public function - loadCartData()
		this.loadCartData = function () {/* ... */};
    }]);

If you've written an Angular service before, you're likely already following patterns related to accesibility. Variables which are defined in the body of the function are private. Variables which are attached to the function using the 'this' keyword (for example, ths.loadCartData) are public. Some authors of Angular services choose to expose the service in the following fashion:
	
	
	module.service('SomeService', function(){
		// This is kept private
		var theAnswer = 42;

		var loadCartData = function() {/** ... */}

		var theOtherFunction = function() {/** ... */}
		
		// loadCartData and theOtherFunction are exposed to service consumers
		return {
			loadCartData: loadCartData,
			otherPublicFunction: theOtherFunction
		};
	});

In each circumstance, there's a separation between public and private methods and properties. Typescript takes this information and makes it explicit:

	// Declare a class with an empty constructor function
	class SomeService
	{
		// Mark 'theAnswer' as private, and initialize it to a default value.
		// Privacy is enforced by the TypeScript compiler.
		private theAnswer = 42;
		
		// loadCartData ends up on the prototype, and isn't restricted by
		// the compiler.
		loadCartData(){/* ... */}
		
		// theOtherFunction also ends up on the prototype.
		theOtherFunction(){/* ... */}
	}
	// Angular is injected with a service called SomeService.
	module.service('SomeService', SomeService);

More information can be found on TypeScript classes at:
	http://www.typescriptlang.org/Handbook#classes

## ES6 classes and dependency injection

You may be wondering, 'How do I do dependency injection with Typescript'? Angular defines three methods for defining dependency injection:

	- Using an inline array.
		Example: 
		module.service('NeedyService', ['$http', function($http){

			}]);

	- Using the naming of function variables
		Example:
		module.service('NeedyService', function($http){

			});

	- Using a public property $inject
		Example:

		function NeedyService($http){

		};
		NeedyService.$inject = ['$http'];
		module.service('NeedyService', NeedyService);

For Typescript and ES6 classes, we'll use the third method. Typescript provides the *static* keyword, allowing properties and method to be defined on the class constructor function itself, rather than on the prototype.

	// Typescript Needy Service

	class NeedyService
	{
		static $inject = ['$http'];

		$http;

		constructor($http){
			this.$http = $http;
		}
	}
	module.service('NeedyService', NeedyService);

## Bringing it all together

Now that we've seen a few examples, let's refactor the CartService to use AMD modules, and Typescript classes. The full file can be reviewed in the included repository, in app/ts/cart/CartService.ts

	// CartService.ts
	import _module = require('_module');

	export class CartService
	{
	    static $inject = ['$q', '$timeout', '$document'];
	    
	    static $q;
	    static $timeout;
	    static $document;
	    
	    constructor($q, $timeout, $document){
	        CartService.$q = $q;
	        CartService.$timeout = $timeout;
	        CartService.$document = $document;

	        /* Rest of initialization */
	    }

	    /* Method definitions */
	}
	_module.ngModule.service('CartService', CartService);

Typescript uses immediately invoked functions to define classes. While we could have injected $q, $timeout, and $document into the service as instance variables (using *this*), instead, we've injected them onto CartService. This has an advantage of increasing minification when the code moves into production.

## Transpilation

The similarity between Typescript and Javascript affords a huge benefit when transpiling code between the two languages. If you're proficient with a text editor which supports multiple carets (think Sublime Text), you can convert the entirety of index.js to this new format in under an hour.

