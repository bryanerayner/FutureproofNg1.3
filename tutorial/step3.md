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

	// The existing Cart Service (abbreviated)
	angular.module('futureStore.cart').service('CartService', ['$q', '$timeout', '$document', function($q, $timeout, $document){
		// Service factory function body

		var taxRate = 0.13; // Private variable taxRate

		// Public function - loadCartData()
		this.loadCartData = function () {/* ... */};

		/* More Functions */
    }]);

If you've written an Angular service before, you're likely already following patterns to keep things public and private. Variables which are defined in the body of the function are private. Variables which are attached to the function using the 'this' keyword (for example, ths.loadCartData) are public. Some authors of Angular services choose to expose the service in the following fashion:
	
	
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

Typescript takes this information and makes it explicit:

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

You may be wondering how this translates to the outputted Javascript. In Typescript, each function in a class definition is defined on the prototype of the class. Each object, string, or number initialization is coded into the constructor function. In the traditional sense, 'private' variables are not possible with Typescript. However, since Typescript uses a compiler, accessing public/private methods is strictly enforced.

More information can be found on TypeScript classes at:
	http://www.typescriptlang.org/Handbook#classes

## ES6 classes and Dependency Injection

Class notation is a far cry from the style of Dependency Injection that we've displayed in the Javascript so far. You may be wondering, 'How do I do dependency injection with Typescript and classes'? Thankfully, Angular has provided a means to do Dependency Injection which fully supports classes.

Angular defines three methods for defining dependency injection:

- Using an inline array.

	//Use an array (you've probably gotten used to this)
	
	module.service('NeedyService', ['$http', function($http){

		}]);

- Using the naming of function variables

	//Using function parameter names (hopefully you aren't used to this)
	
	module.service('NeedyService', function($http){

		});

- Using a public property $inject

	//Using a static property $inject (What you'll be used to with Typescript classes)

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

Here's a breakdown of what we're doing to register the CartService class with Angular.

	import _module = require('_module');

In this step, we're importing all the exports which originate in _module. The shape of this object will look like this.

	// The exports of _module.ts
	{
		ngModule: angular.module() // 
	}

Next, we export a class, *CartService*

	export class CartService
	{
		// Definition
	}

This introduces both an Interface for Typescript's type checking system, and actual Javascript code. It's attached to the exports object which will be accesible to other files which import CartService.ts

In our definition of the class, we define $inject. This provides the Angular module with the names of components which should be injected.

	static $inject = ['$q', '$timeout', '$document'];

Finally, we register the service with the Angular module we got from _module.ts.

	_module.ngModule.service('CartService', CartService);

Inside the constructor function (which is what the generated CartServiceProvider will call with the injected dependencies) we're initializing CartService, and registering the injected functions onto the CartService class itself for future use.

    constructor($q, $timeout, $document){
        CartService.$q = $q;
        CartService.$timeout = $timeout;
        CartService.$document = $document;

        /* Rest of initialization */
    }

While this may be fine and dandy for ES6 classes, it's not going to fly by the Typescript type checker. Why? CartSerice doesn't HAVE $q, $timeout, or $document as part of its definition. Trying to assign them a value breaks the definition of the type. We fix that by declaring them (but not initializing them) in the class definition.

	export class CartService
	{
		static $q;
		static $timeout;
		static $document;
	}

Believe it or not, this is a "good thing". Type checking ensures that your errors are related to business logic - Not problems with mis-spelled variables, or improperly invoked methods.

You may be asking, 'Why are these being declared as static? WHy not just declare them as part of CartService?' The reason for this is purely subjective, and more influenced by minification than any issue related to functionality. In the output Javascript, Typescript uses immediately invoked functions to define classes. By injecting the services onto CartService (the class itself), we are left with a variable which can be safely minified, whereas 'this' will unforunately consistenlty be four characters long.

## Transpilation

The similarity between Typescript and Javascript affords a huge benefit when transpiling code between the two languages. If you're proficient with a text editor which supports multiple carets (think Sublime Text), you can convert the entirety of index.js to this new format in under an hour.


### Project Structure

Using Typescript and the AMD module syntax can improve the structure of a large Angular application. While there are multiple ways to organize Angular applications with Typescript, following a consistent pattern is a surefire way to improve structure, and reduce error. Here's just one method which works for my purposes.

By giving a folder to each Angular module in the project, the ease of navigating a large codebase is greatly increased. That said, there needs to be a consistent method of gathering these files to deliver them to the browser.

The _index.ts and _module.ts files accomplish this purpose. _index.ts files strictly load in the other files in the folder. _module.ts files only define the Angular module. In my workplace, we also place various run blocks in these files.

#### _index.ts Example

The _index files, as mentioned, import each other file in the folder. These are then exported as one object which we'll name in accordance with the module it represents.

	// cart/_index.ts

	///<reference path="../../../typings/tsd.d.ts"/>

	import _module = require('_module');
	import cartItem = require('cart-item');
	import cartService = require('CartService');
	import shoppingCart = require('shopping-cart');

	export var cart = {
	    ngModule:_module.ngModule,
	    CartItemController: cartItem.CartItemController,
	    CartService:cartService.CartService,
	    ShoppingCartController: shoppingCart.ShoppingCartController
	};

By referencing all required code in one file, other modules which are dependant on the cart module can import the code in one line. 

#### _module.ts Example

Here's an example of a _module.ts file. Unsurprizingly, it's very small. However, it's important to notice the two import statements at the top. These correspond to the dependant modules that futureStore.checkout relies upon, and guarantees that all required modules are loaded, and in proper order.

	// checkout/_module.ts

	///<reference path="../../../typings/tsd.d.ts"/>

	import orders = require('../orders/_index');
	import cart = require('../cart/_index');

	export var ngModule = angular.module('futureStore.checkout', [
	        'futureStore.orders',
	        'futureStore.cart']);

