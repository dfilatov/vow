/**
 * Vow
 *
 * Copyright (c) 2012 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.1.6
 */

(function(global) {

var undef,
    nextTick = typeof process === 'object'? // nodejs
        process.nextTick :
        global.setImmediate? // ie10
            global.setImmediate :
            global.postMessage? // modern browsers
                (function() {
                    var fns = [],
                        msg = '__promise' + +new Date,
                        onMessage = function(e) {
                            if(e.data === msg) {
                                e.stopPropagation?
                                    e.stopPropagation() :
                                    e.cancelBubble = true;

                                var callFns = fns, i = 0, len = fns.length;
                                fns = [];
                                while(i < len) {
                                    callFns[i++]();
                                }
                            }
                        };

                    global.addEventListener?
                        global.addEventListener('message', onMessage, true) :
                        global.attachEvent('onmessage', onMessage);

                    return function(fn) {
                        fns.push(fn) === 1 && global.postMessage(msg, '*');
                    };
                })() :
                function(fn) { // old browsers
                    setTimeout(fn, 0);
                },
    throwException = function(e) {
        nextTick(function() {
            throw e;
        });
    },
    isFunction = function(obj) {
        return typeof obj === 'function';
    };

var Promise = function(val) {
    this._res = val;

    this._isFulfilled = typeof val !== 'undefined';
    this._isRejected = false;

    this._fulfilledCallbacks = [];
    this._rejectedCallbacks = [];
};

Promise.prototype = {
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
        return this._isFulfilled || this._isRejected;
    },

    fulfill : function(val) {
        if(this.isResolved()) {
            return;
        }

        this._isFulfilled = true;
        this._res = val;

        this._callCallbacks(this._fulfilledCallbacks);
        this._fulfilledCallbacks = this._rejectedCallbacks = undef;
    },

    reject : function(error) {
        if(this.isResolved()) {
            return;
        }

        this._isRejected = true;
        this._res = error;

        this._callCallbacks(this._rejectedCallbacks);
        this._fulfilledCallbacks = this._rejectedCallbacks = undef;
    },

    then : function(onFulfilled, onRejected) {
        var promise = new Promise(),
            cb;

        if(!this._isRejected) {
            cb = { promise : promise, fn : onFulfilled };
            this._isFulfilled?
                this._callCallbacks([cb]) :
                this._fulfilledCallbacks.push(cb);
        }

        if(!this._isFulfilled) {
            cb = { promise : promise, fn : onRejected };
            this._isRejected?
                this._callCallbacks([cb]) :
                this._rejectedCallbacks.push(cb);
        }

        return promise;
    },

    fail : function(onRejected) {
        return this.then(undef, onRejected);
    },

    spread : function(onFulfilled, onRejected) {
        return this.then(
            function(val) {
                return onFulfilled.apply(this, val);
            },
            onRejected);
    },

    done : function() {
        this.fail(throwException);
    },

    _callCallbacks : function(callbacks) {
        if(!callbacks.length) {
            return;
        }

        var arg = this._res,
            isFulfilled = this.isFulfilled();

        nextTick(function() {
            var i = 0, len = callbacks.length, cb;
            while(i < len) {
                var promise = (cb = callbacks[i++]).promise,
                    fn = cb.fn;

                if(isFunction(fn)) {
                    var res;
                    try {
                        res = fn(arg);
                    }
                    catch(e) {
                        promise.reject(e);
                        continue;
                    }

                    Vow.isPromise(res)?
                        (function(promise) {
                            res.then(
                                function(val) {
                                    promise.fulfill(val);
                                },
                                function(error) {
                                    promise.reject(error);
                                })
                        })(promise) :
                        promise.fulfill(res);
                }
                else {
                    isFulfilled?
                        promise.fulfill(arg) :
                        promise.reject(arg);
                }
            }
        });
    }
};

var Vow = {
    promise : function(val) {
        return new Promise(val);
    },

    when : function(obj, onFulfilled, onRejected) {
        return (this.isPromise(obj)? obj : new Promise(obj)).then(onFulfilled, onRejected);
    },

    fail : function(obj, onRejected) {
        return this.when(obj, undef, onRejected);
    },

    spread : function(obj, onFulfilled, onRejected) {
        return (this.isPromise(obj)? obj : new Promise(obj)).spread(onFulfilled, onRejected);
    },

    done : function(obj) {
        this.isPromise(obj) && obj.done();
    },

    isPromise : function(obj) {
        return obj && isFunction(obj.then);
    },

    isFulfilled : function(obj) {
        return this.isPromise(obj)? obj.isFulfilled() : true;
    },

    isRejected : function(obj) {
        return this.isPromise(obj)? obj.isRejected() : false;
    },

    isResolved : function(obj) {
        return this.isPromise(obj)? obj.isResolved() : true;
    },

    fulfill : function(val) {
        return this.when(val, undef, function(error) {
            return error;
        });
    },

    reject : function(error) {
        return this.when(error, function(val) {
            var promise = new Promise();
            promise.reject(val);
            return promise;
        });
    },

    resolve : function(val) {
        return this.isPromise(val)?
            val :
            this.when(val);
    },

    forEach : function(promises, onFulfilled, onRejected) {
        var i = 0, len = promises.length;
        while(i < len) {
            this.when(promises[i++], onFulfilled, onRejected);
        }
    },

    all : function(promises) {
        var resPromise = new Promise(),
            i = promises.length;

        if(i) {
            var onFulfilled = function() {
                    if(!--i) {
                        var res = [],
                            promise;
                        while(promise = promises[i++]) {
                            res.push(promise.valueOf());
                        }
                        resPromise.fulfill(res);
                    }
                },
                onRejected = function(error) {
                    resPromise.reject(error);
                };

            this.forEach(promises, onFulfilled, onRejected);
        }
        else {
            resPromise.fulfill([]);
        }

        return resPromise;
    },

    allResolved : function(promises) {
        var resPromise = new Promise(),
            i = promises.length;

        if(i) {
            var onProgress = function() {
                if(!--i) {
                    resPromise.fulfill(promises);
                }
            };

            this.forEach(promises, onProgress, onProgress);
        }
        else {
            resPromise.fulfill(promises);
        }

        return resPromise;
    },

    any : function(promises) {
        var resPromise = new Promise(),
            len = promises.length;

        if(len) {
            var i = 0, error,
                onFulfilled = function(val) {
                    resPromise.fulfill(val);
                },
                onRejected = function(_error) {
                    i || (error = _error);
                    if(++i === len) {
                        resPromise.reject(error);
                    }
                };

            this.forEach(promises, onFulfilled, onRejected);
        }
        else {
            resPromise.reject(Error());
        }

        return resPromise;
    },

    timeout : function(origPromise, timeout) {
        var resPromise = new Promise(),
            timer = setTimeout(function() {
                resPromise.reject(Error('timed out'));
            }, timeout);

        origPromise.then(
            function(res) {
                clearTimeout(timer);
                resPromise.fulfill(res);
            },
            function(error) {
                clearTimeout(timer);
                resPromise.reject(error);
            });

        return resPromise;
    }
};

if(typeof exports === 'object') {
    module.exports = Vow;
}
else if(typeof define === 'function') {
    define(function(require, exports, module) {
        module.exports = Vow;
    });
}
else {
    global.Vow = Vow;
}

})(this);