/**
 * Vow
 *
 * Copyright (c) 2012-2013 Filatov Dmitry (dfilatov@yandex-team.ru)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * @version 0.1.12
 */

(function(global) {

var Promise = function(val) {
    this._res = val;

    this._isFulfilled = !!arguments.length;
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

    reject : function(err) {
        if(this.isResolved()) {
            return;
        }

        this._isRejected = true;
        this._res = err;

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
            function(err) {
                clearTimeout(timer);
                promise.reject(err);
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
                                function(err) {
                                    promise.reject(err);
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
        return arguments.length?
            this.isPromise(val)?
                val :
                new Promise(val) :
            new Promise();
    },

    when : function(obj, onFulfilled, onRejected) {
        return this.promise(obj).then(onFulfilled, onRejected);
    },

    fail : function(obj, onRejected) {
        return this.when(obj, undef, onRejected);
    },

    always : function(obj, onResolved) {
        return this.when(obj, onResolved, onResolved);
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

    valueOf : function(obj) {
        return this.isPromise(obj)? obj.valueOf() : obj;
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
        return this.when(val, undef, function(err) {
            return err;
        });
    },

    reject : function(err) {
        return this.when(err, function(val) {
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
        var resPromise = new Promise(),
            len = promises.length;

        if(!len) {
            resPromise.fulfill([]);
            return resPromise;
        }

        var i = len,
            onFulfilled = function() {
                if(!--i) {
                    var res = [], j = 0;
                    while(j < len) {
                        res.push(Vow.valueOf(promises[j++]));
                    }
                    resPromise.fulfill(res);
                }
            },
            onRejected = function(err) {
                resPromise.reject(err);
            };

        this.forEach(promises, onFulfilled, onRejected);

        return resPromise;
    },

    allResolved : function(promises) {
        var resPromise = new Promise(),
            i = promises.length;

        if(!i) {
            resPromise.fulfill([]);
            return resPromise;
        }

        var onProgress = function() {
                if(!--i) {
                    resPromise.fulfill(promises);
                }
            };

        this.forEach(promises, onProgress, onProgress);

        return resPromise;
    },

    any : function(promises) {
        var resPromise = new Promise(),
            len = promises.length;

        if(!len) {
            resPromise.reject(Error());
            return resPromise;
        }

        var i = 0, err,
            onFulfilled = function(val) {
                resPromise.fulfill(val);
            },
            onRejected = function(e) {
                i || (err = e);
                ++i === len && resPromise.reject(err);
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