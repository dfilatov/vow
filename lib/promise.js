var nextTick = process.nextTick,
    isFunction = function(obj) {
        return typeof obj === 'function';
    };

var Promise = module.exports = function(val) {
    if(!(this instanceof Promise)) {
        return new Promise(val);
    }

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
        this._fulfilledCallbacks = this._rejectedCallbacks = null;
    },

    reject : function(error) {
        if(this.isResolved()) {
            return;
        }

        this._isRejected = true;
        this._res = error;

        this._callCallbacks(this._rejectedCallbacks);
        this._fulfilledCallbacks = this._rejectedCallbacks = null;
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

                    Promise.isPromise(res)?
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

Promise.isPromise = function(obj) {
    return obj && isFunction(obj.then);
};

Promise.forEach = function(promises, onFulfilled, onRejected) {
    var i = 0, len = promises.length, promise;
    while(i < len) {
        (this.isPromise(promise = promises[i++])? promise : new this(promise))
            .then(onFulfilled, onRejected);
    }
};

Promise.all = function(promises) {
    var resPromise = new this(),
        i = promises.length,
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
};

Promise.allResolved = function(promises) {
    var resPromise = new this(),
        i = promises.length,
        onProgress = function() {
            if(!--i) {
                resPromise.fulfill(promises);
            }
        };

    this.forEach(promises, onProgress, onProgress);

    return resPromise;
};

Promise.timeout = function(origPromise, timeout) {
    var resPromise = new this(),
        timer = setTimeout(function() {
            resPromise.reject(new Error('timed out'));
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
};