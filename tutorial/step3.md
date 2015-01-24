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

We've actually written code this way already. In index.js, each call to module.controller or module.service, is an effective class definition. For the rest of the tutorial, we'll extract these definitions into the ES6 class syntax.

We've also got three Angular.JS modules in the same file. We'll also take these angular modules and break them down into separate files and folders.

Along the way, we'll be adding type annotations. Code that's written this way is also easier to refactor, so even if you stay on the Angular 1.x series, you'll end up with a more managable project along the way,

### Typescript Modules

