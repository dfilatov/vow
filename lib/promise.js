var undef,
    nextTick = process.nextTick,
    isFunction = function(obj) {
        return typeof obj === 'function';
    };

var Promise = module.exports = function() {
    if(!(this instanceof Promise)) {
        return new Promise();
    }

    this._isResolved = false;
    this._isRejected = false;

    this._res = undef;

    this._resolvedCallbacks = [];
    this._rejectedCallbacks = [];
};

Promise.prototype = {
    valueOf : function() {
        return this._res;
    },

    isResolved : function() {
        return this._isResolved;
    },

    resolve : function(val) {
        if(this._isResolved || this._isRejected) {
            return;
        }

        this._isResolved = true;
        this._res = val;

        callCallbacks(this._resolvedCallbacks, val);
        delete this._resolvedCallbacks;
    },

    isRejected : function() {
        return this._isRejected;
    },

    reject : function(error) {
        if(this._isResolved || this._isRejected) {
            return;
        }

        this._isRejected = true;
        this._res = error;

        callCallbacks(this._rejectedCallbacks, error, true);
        delete this._rejectedCallbacks;
    },

    then : function(onResolved, onRejected) {
        var promise = new Promise(),
            cb;

        if(!this._isRejected) {
            cb = { promise : promise, fn : onResolved };
            this._isResolved?
                callCallbacks([cb], this._res) :
                this._resolvedCallbacks.push(cb);
        }

        if(!this._isResolved) {
            cb = { promise : promise, fn : onRejected };
            this._isRejected?
                callCallbacks([cb], this._res, true) :
                this._rejectedCallbacks.push(cb);
        }

        return promise;
    }
};

Promise.isPromise = function(obj) {
    return obj instanceof this;
};

Promise.all = function(promises) {
    var promise = new this(),
        len = promises.length,
        progress = function() {
            if(!--len) {
                promise.resolve(promises);
            }
        },
        i = 0;

    while(i < len) {
        promises[i++].then(progress, progress);
    }

    return promise;
};

Promise.timeout = function(origPromise, timeout) {
    var promise = new this(),
        timer = setTimeout(function() {
            promise.reject(new Error('timed out'));
        }, timeout);

    origPromise.then(
        function(res) {
            clearTimeout(timer);
            promise.resolve(res);
        },
        function(error) {
            clearTimeout(timer);
            promise.reject(error);
        });

    return promise;
};

function callCallbacks(callbacks, arg, isRejected) {
    callbacks.length && nextTick(function() {
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
                                promise.resolve(val);
                            },
                            function(error) {
                                promise.reject(error);
                            })
                    })(promise) :
                    promise.resolve(res);
            }
            else {
                isRejected?
                    promise.reject(arg) :
                    promise.resolve(arg);
            }
        }
    });
}