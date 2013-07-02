module.exports = {
    'resulting promise should be fulfilled with same value' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        promise.then().then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        resolver.fulfill('val');
    },

    'resulting promise should be rejected with same reason' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            error = new Error('error');

        promise.then().then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });

        resolver.reject(error);
    },

    'resulting promise should be notified with same value' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        promise.then().then(null, null, function(val) {
            test.strictEqual(val, 1);
            test.done();
        });

        resolver.notify(1);
    },

    'resulting promise should be fulfilled with returned value of onFulfilled callback' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            resPromise = promise.then(function() {
                return 'val';
            });

        resolver.fulfill();

        resPromise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled with same value as returned promise of onFulfilled callback' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            retResolver,
            retPromise = Vow.promise(function(_resolver) {
                retResolver = _resolver;
            }),
            resPromise = promise.then(function() {
                return retPromise;
            });

        promise.then(function() {
            retResolver.fulfill('ok');
        });

        resPromise.then(function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });

        resolver.fulfill();
    },

    'resulting promise should be rejected with same value as returned promise of onRejected callback' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            retResolver,
            retPromise = Vow.promise(function(_resolver) {
                retResolver = _resolver;
            }),
            resPromise = promise.then(function() {
                return retPromise;
            }),
            error = new Error('error');

        promise.then(function() {
            retResolver.reject(error);
        });

        resPromise.then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });

        resolver.fulfill();
    },

    'resulting promise should be rejected if onFulfilled callback throw exception' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            resPromise = promise.then(function() {
                throw { message : 'error' };
            });

        resPromise.then(null, function(arg) {
            test.deepEqual(arg, { message : 'error' });
            test.done();
        });

        resolver.fulfill();
    },

    'resulting promise should be rejected if onRejected callback throw exception' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            resPromise = promise.then(null, function() {
                throw { message : 'error' };
            });

        resPromise.then(null, function(arg) {
            test.deepEqual(arg, { message : 'error' });
            test.done();
        });

        resolver.reject();
    },

    'resulting promise should be notified with same value as returned promise of onFulfilled callback' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            retResolver,
            retPromise = Vow.promise(function(_resolver) {
                retResolver = _resolver;
            }),
            resPromise = promise.then(function() {
                return retPromise;
            });

        promise.then(function() {
            retResolver.notify('ok');
        });

        resPromise.then(null, null, function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });

        resolver.fulfill();
    },

    'resulting promise should be notified with same value as returned promise of onRejected callback' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            retResolver,
            retPromise = Vow.promise(function(_resolver) {
                retResolver = _resolver;
            }),
            resPromise = promise.then(null, function() {
                return retPromise;
            });

        promise.then(null, function() {
            retResolver.notify('ok');
        });

        resPromise.then(null, null, function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });

        resolver.reject();
    },

    'resulting promise should be notified with returned value of onProgress callback' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        promise
            .then(null, null, function(val) {
                return val + 1;
            })
            .then(null, null, function(val) {
                test.strictEqual(val, 2);
                test.done();
            });

        resolver.notify(1);
    },

    'onFulfilled callback should be called in given context' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            ctx = {};

        promise.then(function() {
            test.strictEqual(ctx, this);
            test.done();
        }, ctx);

        resolver.fulfill();
    },

    'onRejected callback should be called in given context' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            ctx = {};

        promise.then(null, function() {
            test.strictEqual(ctx, this);
            test.done();
        }, ctx);

        resolver.reject();
    },

    'onProgress callback should be called in given context' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            ctx = {};

        promise.then(null, null, function() {
            test.strictEqual(ctx, this);
            test.done();
        }, ctx);

        resolver.notify();
    }
};