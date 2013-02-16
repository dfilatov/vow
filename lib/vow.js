/**
 * Vow
 *
 * Copyright (c) 2012 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.1.9
 */

(function(global) {

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

    always : function(onResolved) {
        return this.then(onResolved, onResolved);
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

    timeout : function(timeout) {
        var promise = new Promise(),
            timer = setTimeout(
                function() {
                    promise.reject(Error('timed out'));
                },
                timeout);

        this.then(
            function(res) {
                clearTimeout(timer);
                promise.fulfill(res);
            },
            function(error) {
                clearTimeout(timer);
                promise.reject(error);
            });

        return promise;
    },

    _callCallbacks : function(callbacks) {
        var len = callbacks.length;
        if(!len) {
            return;
        }

        var arg = this._res,
            isFulfilled = this.isFulfilled();

        nextTick(function() {
            var i = 0, cb, promise, fn;
            while(i < len) {
                cb = callbacks[i++];
                promise = cb.promise;
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
        return this.isPromise(val)? val : new Promise(val);
    },

    when : function(obj, onFulfilled, onRejected) {
        return this.promise(obj).then(onFulfilled, onRejected);
    },

    fail : function(obj, onRejected) {
        return this.when(obj, undef, onRejected);
    },

    spread : function(obj, onFulfilled, onRejected) {
        return this.promise(obj).spread(onFulfilled, onRejected);
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
        return this.isPromise(val)? val : this.when(val);
    },

    forEach : function(promises, onFulfilled, onRejected) {
        var i = 0, len = promises.length;
        while(i < len) {
            this.when(promises[i++], onFulfilled, onRejected);
        }
    },

    all : function(promises) {
        var i = promises.length;
        if(!i) {
            return new Promise([]);
        }

        var resPromise = new Promise(),
            onFulfilled = function() {
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

        return resPromise;
    },

    allResolved : function(promises) {
        var i = promises.length;
        if(!i) {
            return new Promise([]);
        }

        var resPromise = new Promise(),
            onProgress = function() {
                if(!--i) {
                    resPromise.fulfill(promises);
                }
            };

        this.forEach(promises, onProgress, onProgress);

        return resPromise;
    },

    any : function(promises) {
        var len = promises.length,
            resPromise = new Promise();

        if(!len) {
            resPromise.reject(Error());
            return resPromise;
        }

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

        return resPromise;
    },

    timeout : function(val, timeout) {
        return this.promise(val).timeout(timeout);
    }
};

var undef,
    nextTick = typeof process === 'object'? // nodejs
        process.nextTick :
        global.setImmediate? // ie10
            global.setImmediate :
            global.postMessage? // modern browsers
                (function() {
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
                        fns.push(fn) === 1 && global.postMessage(msg, '*');
                    };
                })() :
                'onreadystatechange' in global.document.createElement('script')? // old IE
                    (function() {
                        var createScript = function() {
                                var script = document.createElement('script');
                                script.onreadystatechange = function() {
                                    script.parentNode.removeChild(script);
                                    script = script.onreadystatechange = null;
                                    callFns();
                                };
                                (global.document.documentElement || global.document.body).appendChild(script);
                            };

                        return function(fn) {
                            fns.push(fn) === 1 && createScript();
                        };
                    })() :
                    function(fn) { // old browsers
                        setTimeout(fn, 0);
                    },
    fns = [],
    callFns = function() {
        var fnsToCall = fns, i = 0, len = fns.length;
        fns = [];
        while(i < len) {
            fnsToCall[i++]();
        }
    },
    throwException = function(e) {
        nextTick(function() {
            throw e;
        });
    },
    isFunction = function(obj) {
        return typeof obj === 'function';
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