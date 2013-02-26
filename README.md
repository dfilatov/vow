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
  * [Creating promise](#vowpromisevalue)
  * [Promise API](#promise-api)
    * [fulfill](#fulfillvalue)
    * [reject](#rejectreason)
    * [isFulfilled](#isfulfilled)
    * [isRejected](#isrejected)
    * [isResolved](#isresolved)
    * [valueOf](#valueof)
    * [then](#thenonfulfilled-onrejected)
    * [fail](#failonrejected)
    * [always](#alwaysonresolved)
    * [spread](#spreadonfulfilled-onrejected)
    * [done](#done)
    * [timeout](#timeouttimeout)
  * [Vow API](#vow-api)
    * [isPromise](#ispromisevalue)
    * [when](#whenvalue-onfulfilled-onrejected) 
    * [fail](#failvalue-onrejected)
    * [always](#alwaysvalue-onresolved)
    * [spread](#spreadvalue-onfulfilled-onrejected) 
    * [done](#donevalue)
    * [isFulfilled](#isfulfilledvalue)
    * [isRejected](#isrejectedvalue)
    * [isResolved](#isresolvededvalue)
    * [fulfill](#fulfillvalue-1)
    * [reject](#rejectreason-1)
    * [resolve](#resolvevalue)
    * [all](#allpromisesorvalues)
    * [allResolved](#allresolvedpromisesorvalues)
    * [any](#anypromisesorvalues)
    * [timeout](#timeoutpromise-timeout)

####Vow.promise([value])####
Create a new promise if no ````value```` given, or create a new fulfilled promise if the ````value```` is not a promise, or returns ````value```` if the given ````value```` is a promise.
````javascript
var promise = Vow.promise(), // create a new promise
    fulfilledPromise = Vow.promise('ok'), // create a new fulfilled promise
    anotherPromise = Vow.promise(existingPromise); // anotherPromise is equal an existingPromise
````
###Promise API###
####fulfill(value)####
Fulfill promise with given ````value````
````javascript
var promise = Vow.promise();
promise.fulfill('completed'); // fulfill promise with 'completed' value
````
####reject(reason)####
Reject promise with given ````reason````
````javascript
var promise = Vow.promise();
promise.reject(Error('internal error')); // reject promise with Error object
````
####isFulfilled()####
Returns whether the promise is fulfilled
````javascript
var promise = Vow.promise();
promise.isFulfilled(); // returns false
promise.fulfill('completed');
promise.isFulfilled(); // returns true
````

####isRejected()####
Returns whether the promise is rejected
````javascript
var promise = Vow.promise();
promise.isRejected(); // returns false
promise.reject(Error('internal error'));
promise.isRejected(); // returns true
````

####isResolved()####
Returns whether the promise is fulfilled or rejected
````javascript
var promise = Vow.promise();
promise.isResolved(); // returns false
promise.fulfill('completed'); // or promise.reject(Error('internal error'));
promise.isResolved(); // returns true
````

####valueOf()####
Returns value of the promise:
  * value of fulfillment, if promise is fullfilled 
  * reason of rejection, if promise is rejected 
  * undefined, if promise is not resolved

####then([onFulfilled], [onRejected])####
Arranges for:
  * ````onFulfilled```` to be called with the value after promise is fulfilled,
  * ````onRejected```` to be called with the rejection reason after promise is rejected.
 
Returns a new promise. See [Promises/A+ specification](https://github.com/promises-aplus/promises-spec) for details.
````javascript
var promise = Vow.promise();
promise.then(
    function() { }, // to be called after promise is fulfilled
    function() { }); // to be called after promise is rejected
````

####fail(onRejected)####
Arranges to call ````onRejected```` on the promise's rejection reason if it is rejected. Shortcut for ````then(null, onRejected)````.
````javascript
var promise = Vow.promise();
promise.fail(
    function() { // to be called after promise is rejected
    });
promise.reject(Error('error'));
````

####always(onResolved)####
Arranges to call ````onResolved```` on either the promise's value if it is fulfilled, or on it's rejection reason if it is rejected. Shortcut for ````then(onResolved, onResolved)````.
````javascript
var promise = Vow.promise();
promise.always(
    function() { // to be called after promise is fulfilled or rejected
    });
promise.fulfill('ok'); // or promise.reject(Error('error'));
````

####spread([onFulfilled], [onRejected])####
Like "then", but "spreads" the array into a variadic value handler.
It useful with [Vow.all](#allpromises), [Vow.allResolved](#allresolvedpromises) methods.
````javascript
var promise1 = Vow.promise(),
    promise2 = Vow.promise();

Vow.all([promise1, promise2]).spread(function(arg1, arg2) {
    // arg1 should be "1", arg2 should be "'two'"
});
    
promise1.fulfill(1);
promise2.fulfill('two');
````

####done()####
Terminate a chain of promises. If the promise is rejected, throws it as an exception in a future turn of the event loop.
````javascript
var promise = Vow.promise();
promise.reject(Error('Internal error'));
promise.done(); // exception to be throwed
````

####timeout(timeout)####
Returns a new promise that to be rejected after a ````timeout```` if promise does not resolved beforehand.
````javascript
var promise = Vow.promise(),
    promiseWithTimeout1 = promise.timeout(50),
    promiseWithTimeout2 = promise.timeout(200);

setTimeout(
    function() {
        promise.fulfill('ok');
    },
    100);

promiseWithTimeout1.fail(function(e) {
    // promiseWithTimeout to be rejected after 50ms
});

promiseWithTimeout2.then(function(val) {
    // promiseWithTimeout to be fulfilled with "'ok'" value
});
````

###Vow API###

####isPromise(value)####
Returns whether the given ````value```` is a promise.
````javascript
Vow.isPromise('value'); // returns false
Vow.isPromise(Vow.promise()); // returns true
````

####when(value, [onFulfilled], [onRejected])####
Static equivalent for [promise.then](#thenonfulfilled-onrejected). If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise.

####fail(value, onRejected)####
Static equivalent for [promise.fail](#failonrejected). If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise.

####always(value, onResolved)####
Static equivalent for [promise.always](#alwaysonresolved). If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise.

####spread(value, [onFulfilled], [onRejected])####
Static equivalent for [promise.spread](#spreadonfulfilled-onrejected).
If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise.

####done(value)####
Static equivalent for [promise.done](#done).
If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise. 

####isFulfilled(value)####
Static equivalent for [promise.isFulfilled](#isfulfilled).
If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise.

####isRejected(value)####
Static equivalent for [promise.isRejected](#isrejected).
If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise.

####isResolved(value)####
Static equivalent for [promise.isResolved](#isresolved).
If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise.

####fulfill(value)####
Returns a promise that has already been fulfilled with the given ````value````. If ````value```` is a promise, returned promise will be fulfilled with fulfill/rejection value of given promise.

####reject(reason)####
Returns a promise that has already been rejected with the given ````reason````. If ````reason```` is a promise, returned promise will be rejected with fulfill/rejection value of given promise.

####resolve(value)####
Returns a promise that has already been fulfilled with the given ````value````. If ````value```` is a promise, returns ````promise````.

####all(promisesOrValues)####
Returns a promise to be fulfilled only after all items in ````promisesOrValues```` is fulfilled, or to be rejected when the first promise is rejected.

####allResolved(promisesOrValues)####
Returns a promise to be fulfilled only after all items in ````promisesOrValues```` is resolved.
````javascript
var promise1 = Vow.promise(),
    promise2 = Vow.promise();
    
Vow.allResolved([promise1, promise2])
    .spread(function(promise1, promise2) {
        promise1.valueOf(); // returns 'error'
        promise2.valueOf(); // returns 'ok'
    });

promise1.reject('error');
promise2.fulfill('ok');
````

####any(promisesOrValues)####
Returns a promise to be fulfilled only any item in ````promisesOrValues```` is fulfilled, or to be rejected when all items is rejected (with reason of first rejected item).

####timeout(promise, timeout)####
Static equivalent for [promise.timeout](#timeouttimeout). If given ````value```` is not a promise, ````value```` is equivalent to fulfilled promise.
