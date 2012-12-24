<a href="http://promises-aplus.github.com/promises-spec"><img src="http://promises-aplus.github.com/promises-spec/assets/logo-small.png" align="right" /></a>
Vow [![Build Status](https://secure.travis-ci.org/dfilatov/jspromise.png)](http://travis-ci.org/dfilatov/jspromise)
=========

Promises/A+ implementation.
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
Fulfill promise with given ````value````
````javascript
promise.fulfill(value);
````
####reject(reason)####
Reject promise with given ````reason````
````javascript
promise.reject(error);
````
####isFulfilled()####
Returns whether the promise is fulfilled
````javascript
promise.isFulfilled();
````
####isRejected()####
Returns whether the promise is rejected
````javascript
promise.isRejected();
````
####isResolved()####
Returns whether the promise is fulfilled or rejected
````javascript
promise.isResolved();
````
####then([onFulfilled], [onRejected])####
Arranges for:
  * ````onFulfilled```` to be called with the value after promise is fulfilled,
  * ````onRejected```` to be called with the rejection reason after promise is rejected.
 
Returns a new promise. See [Promises/A+ specification](https://github.com/promises-aplus/promises-spec) for details.

````javascript
promise.then(onFulfilled, onRejected);
````
####fail(onRejected)####
Arranges to call ````onRejected```` on the promise's rejection reason if it is rejected.
####spread([onFulfilled], [onRejected])####
Like "then", but "spreads" the array into a variadic value handler.

###Vow API###
####isPromise(value)####
Returns whether the given ````value```` is a promise.

####when(valueOrPromise, [onFulfilled], [onRejected])####

####isFulfilled(value)####

####isRejected(value)####

####isResolved(value)####

####fulfill(value)####
Returns a promise that has already been fulfilled with the given ````value````. If ````value```` is a promise, returned promise will be fulfilled with fulfill/rejection value of given promise.

####reject(reason)####
Returns a promise that has already been rejected with the given ````reason````. If ````reason```` is a promise, returned promise will be rejected with fulfill/rejection value of given promise.

####resolve(value)####
Returns a promise that has already been fulfilled with the given ````value````. If ````value```` is a promise, returns ````promise````.

####all(promises)####
####allResolved(promises)####
####any(promises)####
####timeout(promise, timeout)####
