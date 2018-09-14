# PayneDentistry

Copyright 2018 Curve Dental 

PayneDentistry is a single page application written in Angular and Node.js.  It forms the basis of the
code challenge use for Curve Dental software developers and software developers in test.

Your problem is detailed in the email which accompanied this repository.

Your solution should be on a separate git branch.  Submit it as a single zip archive of the complete
repository including the .git folder.  Do not include the node_modules or server/node_modules folders
with Node.js dependencies.

There is nothing in the application which is meant to trick you.  If you spot a bug then it is simply a bug
and we'd be happy if you reported it or, better, fix it and send us a patch.

What if I don't know Angular, Express, or Bootstrap?

* The structure of the front-end application closely follows the [Angular Fundamentals](https://app.pluralsight.com/library/courses/angular-fundamentals/table-of-contents) course from PluralSight.
* All three technologies are popular and there is a wealth of information on their websites, Stack Overflow, and other technology websites plus print media.
* You can find examples of all the pieces you need to construct the solution already within the sample application.

## Dependencies

* NodeJS v8.11 or higher
* NPM 5.10 or higher
* Google Chrome (to run tests)

# Technologies

* [Angular 6.1](https://angular.io)
* [Express 4](https://expressjs.com/)
* [Bootstrap 4.1](https://getbootstrap.com/docs/4.1/getting-started/introduction/)
* [Moment.js](https://momentjs.com/)

## Installation

Run `npm install` from the root directory to install both the Angular client application and the Node.js Express server.

## Development server

Run `npm start` for a dev server. Navigate to [http://localhost:4200/](http://localhost:4200). The app will automatically reload if you change any of the source files.

The backend server listens on port 3000. Any requests by the application to /api/ are proxied to the backend server using the [proxying support](https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md) in webpack dev server.

## Build

Run `npm run build` to build the Angular project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Production server

**2018-07-28 Building the production source may take several minutes.  The build will appear to hang at 92% running the UglifyJSPlugin. It will eventually complete.  Fix is expected to webpack in a week or two. See https://github.com/FortAwesome/angular-fontawesome/issues/34.**

Run `npm run serve-prod` for a production server. Navigate to [http://localhost:3000/](http://localhost:3000). Express will host the production build of the Angular application.

## Tests

Tests are written using the [Jasmine](https://jasmine.github.io/) test framework.

### Running unit tests

Run `npm test` to execute the Angular unit tests via [Karma](https://karma-runner.github.io) and backend unit tests using Jasmine.

## Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/) and backend integration tests using Jasmine.

## Debugging end-to-end tests

Run `npm run e2e-debug`.  This will start the backend server on port 3000, compile and serve the front-end JavaScript on port 4200, and start Protractor with the Chrome debugger.  Wait until the back-end and front-end server starts and
then connect the debugger to the web socket URI printed to the console.  Suggested debuggers include Chrome Inspector(chrome://inspect) or VSCode Debugger for Chrome Extension.

## Linting

Run `npm run lint` to lint both the client and server code.  Angular code is linted using tslint for TypeScript.  Express code is linted using eslint.