# Step 2 - Typescript conversion

Converting Javascript files to Typescript files is as easy as changing the extension from .JS to .TS. So, let's do that right now. First, go to the app/ folder, and add a folder called 'ts'

	cd app/
	mkdir ts

Then, copy index.js from the js folder, and move it to the ts folder.

	cp js/index.js ts/

And rename

	mv ts/index.js ts/index.ts

(Of course, you can follow these steps using the GUI of your liking)

There you have it! A perfectly valid Typescript file, ready to go. But no browser is going to accept a plain Typescript file as valid source. We'll need to compile it first. So, let's install the Typescript compiler.

## Compiling Typescript

To compile typescript, we'll need to install the compiler and language services. These are contained in a NPM module callled 'typescript' - at the time of this writing, 1.4.1 is the latest version. Since we'll need to use the compiler from the command line, we'll install it globally.

	cd ../
	sudo npm install -g --save-dev typescript

Next, you can compile the Javascript we just created, using 'tsc' (which should now be avaiable in your PATH)

	tsc app/ts/index.ts

You'll likely see a number of errors along the lines of 'Cannot find angular', or 'Cannot find _'. That's because, in the source code, we're assuming these global variables exist. Though this code compiles, we're really not getting the benefits of TypeScripts main feature - types. In order for the compiler to understand what's going on, we're going to need to install some type definition files.

## Type Systems

Discussing type systems is beyond the scope of this article, but in short, they allow the compiler to know code is and isn't valid, before attempting to execute it. This can save a ton of time writing unit tests, and gives you as a developer added power when it comes to refactoring. Here's how the Typescript syntax describes the type of a variable:


	// The colon (:) is used to define the type, after the declaration of a variable.
    
	// Tell Typescript that x is a number
	var x :number = 5;
    
	// Tell Typescript that y is a string
	var y :string = '5'; 
	
	//Tell Typescript that $scope is an Angular Scope.
	var $scope :ng.IScope = null; 
	
	// Tell Typescript that func is a function which takes two numbers and returns a number
	var func : (param1:number, param2:number)=>number = null;
    
    // Tell Typescript that something could be any type - essentially, turn off typechecking for this.
	var something : any;

Typescript uses the 'declare' keyword to define types, which are not found in the actual source code. This is how the definitions for Window, Document, HTMLElement, etc. are known to the compiler. These definitions can be added for other libraries as well, in files with the extension '.d.ts'. You can read more about it at http://www.typescriptlang.org/Handbook#writing-dts-files.

Fortunately, there's a large community supporting a repository called 'DefinitelyTyped', which has written extensive definition files, as well as a package manager to easily add them to your project.

### Installing Type Definitions

'tsd' is the NPM of the Typescript Definition commutity. Let's use that to install the definitions for Angular and Lodash.

	sudo npm install tsd@next -g

Next, we'll initialize the project. From the root, use tsd.init:

	tsd init

This will add a tsd.json file to our project, which declares the type definitions we'll need. 

Next, we'll install the definitions for the Angular and Lodash type files, which will go to the a 'typings' folder. Since the Angular typing library requires JQuery (for angular.element and jQLite) we'll install that type definition as well.

	tsd install angular --save
	tsd install lodash --save
	tsd install jquery --save

You should now see three directories in the typings folder, as well as a tsd.d.ts file. TypeScript references other files using XML tag comments

	/// <reference path="angularjs/angular.d.ts" />
	/// <reference path="lodash/lodash.d.ts" />
	/// <reference path="jquery/jquery.d.ts" />

In order to compile index.ts without warning flags (and have the type definitions available to us during development) we need to add a reference tag to the tsd.d.ts file. Open index.d.ts, and add this to the top of the document:

	/// <reference path="../../typings/tsd.d.ts" />


### Compiling with Types

Let's recompile the index.ts into index.js, and ensure that everything works:

	tsc app/ts/index.ts

When I ran this project, I recieved this error:

	app/ts/index.ts(62,36): error TS2339: Property 'price' does not exist on type '{}'.

This is a good thing. It means that Typescript is properly using the type definitions from Definitely Typed. It's not allowing us to write code that (it thinks) will break. We could fix this error by adding some type annotations, but before we do that, we'll plan our strategy for converting this codebase to something aligned with Angular 2.0.



