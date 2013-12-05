/**
 * Vow
 *
 * Copyright (c) 2012-2013 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.4
 */

(function(global) {

var Resolver = function() {
    this._promise = new Promise(this);
    this._res = undef;

    this._isFulfilled = false;
    this._isRejected = false;
    this._isPending = true;

    this._fulfilledCallbacks = [];
    this._rejectedCallbacks = [];
    this._progressCallbacks = [];
};

Resolver.prototype = {
    promise : function() {
        return this._promise;
    },

    valueOf : function() {
        return this._res;
    },

    isFulfilled : function() {
        return this._isFulfilled;
    },

    isRejected : function() {
        return this._isRejected;
    },

    isResolved : function() {
        return !this._isPending;
    },

    resolve : function(val) {
        this._isPending && this._resolve(val);
    },

    reject : function(err) {
        this._isPending && this._reject(err);
    },

    notify : function(val) {
        this._isPending && this._notify(val);
    },

    addCallbacks : function(resolver, onFulfilled, onRejected, onProgress, ctx) {
        if(onRejected && !isFunction(onRejected)) {
            ctx = onRejected;
            onRejected = undef;
        }
        else if(onProgress && !isFunction(onProgress)) {
            ctx = onProgress;
            onProgress = undef;
        }

        var cb;

        if(!this._isRejected) {
            cb = { resolver : resolver, fn : isFunction(onFulfilled)? onFulfilled : undef, ctx : ctx };
            this._isFulfilled?
                this._callCallbacks([cb], this._res) :
                this._fulfilledCallbacks.push(cb);
        }

        if(!this._isFulfilled) {
            cb = { resolver : resolver, fn : onRejected, ctx : ctx };
            this._isRejected?
                this._callCallbacks([cb], this._res) :
                this._rejectedCallbacks.push(cb);
        }

        if(!this._isRejected && !this._isFulfilled) {
            this._progressCallbacks.push({ resolver : resolver, fn : onProgress, ctx : ctx });
        }
    },

    _resolve : function(val) {
        this._isPending = false;

        if(val === this._promise) {
            this._reject(TypeError());
            return;
        }

        if(Vow.isPromise(val)) {
            val.then(
                this._resolve,
                this._reject,
                this._notify,
                this);
            return;
        }

        if(isObject(val) || isFunction(val)) {
            var then;
            try {
                then = val.then;
            }
            catch(e) {
                this._reject(e);
                return;
            }

            if(isFunction(then)) {
                var _this = this,
                    checkException = true,
                    isResolveCalled = false;

                try {
                    then.call(
                        val,
                        function(val) {
                            if(isResolveCalled) {
                                return;
                            }

                            checkException = false;
                            isResolveCalled = true;
                            _this._resolve(val);
                        },
                        function(err) {
                            if(isResolveCalled) {
                                return;
                            }

                            checkException = false;
                            _this._reject(err);
                        },
                        function(val) {
                            checkException = false;
                            _this._notify(val);
                        });
                }
                catch(e) {
                    checkException && this._reject(e);
                }

                return;
            }
        }

        this._fulfill(val);
    },

    _fulfill : function(val) {
        if(this._isFulfilled || this._isRejected) {
            return;
        }

        this._isFulfilled = true;
        this._res = val;

        this._callCallbacks(this._fulfilledCallbacks, val);
        this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = undef;
    },

    _reject : function(err) {
        if(this._isFulfilled || this._isRejected) {
            return;
        }

        this._isPending = false;
        this._isRejected = true;
        this._res = err;

        this._callCallbacks(this._rejectedCallbacks, err);
        this._fulfilledCallbacks = this._rejectedCallbacks = this._progressCallbacks = undef;
    },

    _notify : function(val) {
        this._callCallbacks(this._progressCallbacks, val);
    },

    _callCallbacks : function(callbacks, arg) {
        var len = callbacks.length;
        if(!len) {
            return;
        }

        var isResolved = !this._isPending,
            isFulfilled = this._isFulfilled;

        nextTick(function() {
            var i = 0, cb, resolver, fn;
            while(i < len) {
                cb = callbacks[i++];
                resolver = cb.resolver;
                fn = cb.fn;

                if(fn) {
                    var ctx = cb.ctx,
                        res;
                    try {
                        res = ctx? fn.call(ctx, arg) : fn(arg);
                    }
                    catch(e) {
                        resolver.reject(e);
                        continue;
                    }

                    isResolved?
                        resolver.resolve(res) :
                        resolver.notify(res);
                }
                else {
                    isResolved?
                        isFulfilled?
                            resolver.resolve(arg) :
                            resolver.reject(arg) :
                        resolver.notify(arg);
                }
            }
        });
    }
};

var Promise = function(resolver) {
    this._resolver = resolver;
};

Promise.prototype = {
    valueOf : function() {
        return this._resolver.valueOf();
    },

    isResolved : function() {
        return this._resolver.isResolved();
    },

    isRejected : function() {
        return this._resolver.isRejected();
    },

    isFulfilled : function() {
        return this._resolver.isFulfilled();
    },

    then : function(onFulfilled, onRejected, onProgress, ctx) {
        var resolver = new Resolver();
        this._resolver.addCallbacks(resolver, onFulfilled, onRejected, onProgress, ctx);
        return resolver.promise();
    },

    fail : function(onRejected, ctx) {
        return this.then(undef, onRejected, ctx);
    },

    always : function(onResolved, ctx) {
        var _this = this,
            cb = function() {
                return onResolved.call(this, _this);
            };

        return this.then(cb, cb, ctx);
    },

    progress : function(onProgress, ctx) {
        return this.then(undef, undef, onProgress, ctx);
    },

    spread : function(onFulfilled, onRejected, ctx) {
        return this.then(
            function(val) {
                return onFulfilled.apply(this, val);
            },
            onRejected,
            ctx);
    },

    done : function(onFulfilled, onRejected, onProgress, ctx) {
        this
            .then(onFulfilled, onRejected, onProgress, ctx)
            .fail(throwException);
    },

    delay : function(delay) {
        var timer,
            promise = this.then(function(val) {
                var resolver = new Resolver();
                timer = setTimeout(
                    function() {
                        resolver.resolve(val);
                    },
                    delay);

                return new Promise(resolver);
            });

        promise.always(function() {
            clearTimeout(timer);
        });

        return promise;
    },

    timeout : function(timeout) {
        var resolver = new Resolver(),
            promise = new Promise(resolver),
            timer = setTimeout(
                function() {
                    resolver._reject(Error('timed out'));
                },
                timeout);

        resolver.resolve(this);
        promise.always(function() {
            clearTimeout(timer);
        });

        return promise;
    }
};

var Vow = {
    Resolver : Resolver,

    Promise : Promise,

    resolver : function(val) {
        var res = new Resolver();
        arguments.length && res.resolve(val);
        return res;
    },

    promise : function(resolverFn) {
        var resolver = new Resolver();
        resolverFn(
            function(val) {
                resolver.resolve(val);
            },
            function(reason) {
                resolver.reject(reason);
            },
            function(val) {
                resolver.notify(val);
            });
        return resolver.promise();
    },

    when : function(obj, onFulfilled, onRejected, onProgress, ctx) {
        return Vow.resolver(obj).promise().then(onFulfilled, onRejected, onProgress, ctx);
    },

    fail : function(obj, onRejected, ctx) {
        return Vow.when(obj, undef, onRejected, ctx);
    },

    always : function(obj, onResolved, ctx) {
        return Vow.when(obj).always(onResolved, ctx);
    },

    progress : function(obj, onProgress, ctx) {
        return Vow.when(obj).progress(onProgress, ctx);
    },

    spread : function(obj, onFulfilled, onRejected, ctx) {
        return Vow.when(obj).spread(onFulfilled, onRejected, ctx);
    },

    done : function(obj, onFulfilled, onRejected, onProgress, ctx) {
        Vow.when(obj).done(onFulfilled, onRejected, onProgress, ctx);
    },

    isPromise : function(obj) {
        return obj instanceof Promise;
    },

    valueOf : function(obj) {
        return Vow.isPromise(obj)? obj.valueOf() : obj;
    },

    isFulfilled : function(obj) {
        return Vow.isPromise(obj)? obj.isFulfilled() : true;
    },

    isRejected : function(obj) {
        return Vow.isPromise(obj)? obj.isRejected() : false;
    },

    isResolved : function(obj) {
        return Vow.isPromise(obj)? obj.isResolved() : true;
    },

    resolve : function(val) {
        return Vow.resolve(val);
    },

    reject : function(err) {
        return Vow.when(err, function(val) {
            var resolver = new Resolver();
            resolver.reject(val);
            return resolver.promise();
        });
    },

    invoke : function(fn) {
        try {
            return Vow.resolver(fn.apply(global, slice.call(arguments, 1))).promise();
        }
        catch(e) {
            return Vow.reject(e);
        }
    },

    forEach : function(promises, onFulfilled, onRejected, keys) {
        var len = keys? keys.length : promises.length,
            i = 0;
        while(i < len) {
            Vow.when(promises[keys? keys[i] : i], onFulfilled, onRejected);
            ++i;
        }
    },

    all : function(promises) {
        var resolver = new Resolver(),
            isPromisesArray = isArray(promises),
            keys = isPromisesArray?
                getArrayKeys(promises) :
                getObjectKeys(promises),
            len = keys.length,
            res = isPromisesArray? [] : {};

        if(!len) {
            resolver.resolve(res);
            return resolver.promise();
        }

        var i = len,
            onFulfilled = function() {
                if(!--i) {
                    var j = 0;
                    while(j < len) {
                        res[keys[j]] = Vow.valueOf(promises[keys[j++]]);
                    }
                    resolver.resolve(res);
                }
            },
            onRejected = function(err) {
                resolver.reject(err);
            };

        Vow.forEach(promises, onFulfilled, onRejected, keys);

        return resolver.promise();
    },

    allResolved : function(promises) {
        var resolver = new Resolver(),
            isPromisesArray = isArray(promises),
            keys = isPromisesArray?
                getArrayKeys(promises) :
                getObjectKeys(promises),
            i = keys.length,
            res = isPromisesArray? [] : {};

        if(!i) {
            resolver.resolve(res);
            return resolver.promise();
        }

        var onProgress = function() {
                --i || resolver.resolve(promises);
            };

        Vow.forEach(promises, onProgress, onProgress, keys);

        return resolver;
    },

    allPatiently : function(promises) {
        return Vow.allResolved(promises).then(function() {
            var isPromisesArray = isArray(promises),
                keys = isPromisesArray?
                    getArrayKeys(promises) :
                    getObjectKeys(promises),
                rejectedPromises, fulfilledPromises,
                len = keys.length, i = 0, key, promise;

            if(!len) {
                return isPromisesArray? [] : {};
            }

            while(i < len) {
                key = keys[i++];
                promise = promises[key];
                if(Vow.isRejected(promise)) {
                    rejectedPromises || (rejectedPromises = isPromisesArray? [] : {});
                    isPromisesArray?
                        rejectedPromises.push(promise.valueOf()) :
                        rejectedPromises[key] = promise.valueOf();
                }
                else if(!rejectedPromises) {
                    (fulfilledPromises || (fulfilledPromises = isPromisesArray? [] : {}))[key] = Vow.valueOf(promise);
                }
            }

            if(rejectedPromises) {
                throw rejectedPromises;
            }

            return fulfilledPromises;
        });
    },

    any : function(promises) {
        var resolver = new Resolver(),
            len = promises.length;

        if(!len) {
            resolver.reject(Error());
            return resolver.promise();
        }

        var i = 0, err,
            onFulfilled = function(val) {
                resolver.resolve(val);
            },
            onRejected = function(e) {
                i || (err = e);
                ++i === len && resolver.reject(err);
            };

        Vow.forEach(promises, onFulfilled, onRejected);

        return resolver.promise();
    },

    delay : function(val, timeout) {
        return Vow.resolver(val).promise().delay(timeout);
    },

    timeout : function(val, timeout) {
        return Vow.resolver(val).promise().timeout(timeout);
    }
};

var undef,
    nextTick = (function() {
        var fns = [],
            enqueueFn = function(fn) {
                return fns.push(fn) === 1;
            },
            callFns = function() {
                var fnsToCall = fns, i = 0, len = fns.length;
                fns = [];
                while(i < len) {
                    fnsToCall[i++]();
                }
            };

        if(typeof setImmediate === 'function') { // ie10, nodejs >= 0.10
            return function(fn) {
                enqueueFn(fn) && setImmediate(callFns);
            };
        }

        if(typeof process === 'object' && process.nextTick) { // nodejs < 0.10
            return function(fn) {
                enqueueFn(fn) && process.nextTick(callFns);
            };
        }

        if(global.postMessage) { // modern browsers
            var isPostMessageAsync = true;
            if(global.attachEvent) {
                var checkAsync = function() {
                        isPostMessageAsync = false;
                    };
                global.attachEvent('onmessage', checkAsync);
                global.postMessage('__checkAsync', '*');
                global.detachEvent('onmessage', checkAsync);
            }

            if(isPostMessageAsync) {
                var msg = '__promise' + +new Date,
                    onMessage = function(e) {
                        if(e.data === msg) {
                            e.stopPropagation && e.stopPropagation();
                            callFns();
                        }
                    };

                global.addEventListener?
                    global.addEventListener('message', onMessage, true) :
                    global.attachEvent('onmessage', onMessage);

                return function(fn) {
                    enqueueFn(fn) && global.postMessage(msg, '*');
                };
            }
        }

        var doc = global.document;
        if('onreadystatechange' in doc.createElement('script')) { // ie6-ie8
            var createScript = function() {
                    var script = doc.createElement('script');
                    script.onreadystatechange = function() {
                        script.parentNode.removeChild(script);
                        script = script.onreadystatechange = null;
                        callFns();
                };
                (doc.documentElement || doc.body).appendChild(script);
            };

            return function(fn) {
                enqueueFn(fn) && createScript();
            };
        }

        return function(fn) { // old browsers
            enqueueFn(fn) && setTimeout(callFns, 0);
        };
    })(),
    throwException = function(e) {
        nextTick(function() {
            throw e;
        });
    },
    isFunction = function(obj) {
        return typeof obj === 'function';
    },
    isObject = function(obj) {
        return obj !== null && typeof obj === 'object';
    },
    slice = Array.prototype.slice,
    toStr = Object.prototype.toString,
    isArray = Array.isArray || function(obj) {
        return toStr.call(obj) === '[object Array]';
    },
    getArrayKeys = function(arr) {
        var res = [],
            i = 0, len = arr.length;
        while(i < len) {
            res.push(i++);
        }
        return res;
    },
    getObjectKeys = Object.keys || function(obj) {
        var res = [];
        for(var i in obj) {
            obj.hasOwnProperty(i) && res.push(i);
        }
        return res;
    };

var defineAsGlobal = true;
if(typeof exports === 'object') {
    module.exports = Vow;
    defineAsGlobal = false;
}

if(typeof modules === 'object') {
    modules.define('vow', function(provide) {
        provide(Vow);
    });
    defineAsGlobal = false;
}

if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = Vow;
    });
    defineAsGlobal = false;
}

defineAsGlobal && (global.Vow = Vow);

})(this);