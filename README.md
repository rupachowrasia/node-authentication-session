# NodeJs Basic Auth using Session



NodeJs Basic auth which covers brief introduction of the following:

  - bcryptjs [to hash password]
  - mongoose [database model]
  - client-sessions [to manage session]
  - express-session [to manage session]
  - csurf [to manage csrf token]

# New Features!

  - Hashing password using bcryptjs
  - Using session middleware
  - Using csrf token to validate the form


We can also use other module to manage session:
  - https://www.npmjs.com/package/cookie-session
  - https://www.npmjs.com/package/client-session
  - https://www.npmjs.com/package/cookie-parser


### Tech

This repo uses number of packages/modules:

* [https://www.npmjs.com/package/bcryptjs] - bcryptjs
* [https://www.npmjs.com/package/body-parser] - body-parser
* [https://www.npmjs.com/package/client-sessions] - client-sessions
* [https://github.com/expressjs/csurf] - csurf
* [https://www.npmjs.com/package/ejs] - ejs
* [https://www.npmjs.com/package/express] - express
* [https://www.npmjs.com/package/express-sessions] - express-session
* [https://www.npmjs.com/package/mongoose] - mongoose


### Installation

It requires [Node.js](https://nodejs.org/) v7+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd basicAuth
$ npm install
$ npm start
```

