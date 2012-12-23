Vow [![Build Status](https://secure.travis-ci.org/dfilatov/jspromise.png)](http://travis-ci.org/dfilatov/jspromise)
=========

Promises/A+ specification compatible promises library.
See https://github.com/promises-aplus/promises-spec.

Getting Started
---------------
###In the Node.js###
You can install using Node Package Manager (npm):

    npm install vow

###In the Browsers###
```html
<script type="text/javascript" src="vow.min.js"></script>
```
Also RequireJS module format supported.

API
---
####Vow.promise()####
Create promise
````javascript
var promise = Vow.promise();    
````
###Promise API###
####fulfill(value)####
####reject(reason)####
####isFulfilled()####
####isRejected()####
####isResolved()####
####then(onFulfilled, onRejected)####
####fail(onRejected)####
####spread(onFulfilled, onRejected)####

###Vow API###
####isPromise(valueOrPromise)####
####fulfill(valueOrPromise)####
####reject(valueOrPromise)####
####when(valueOrPromise, onFulfilled, onRejected)####
####all(promisesOrValues)####
####allResolved(promisesOrValues)####
####any(promisesOrValues)####
####timeout(promise, timeout)####
