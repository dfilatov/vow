module.exports = {
    'resulting promise should be fulfilled with same value' : function(test) {
        var defer = Vow.defer();

        defer.promise().then().then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defer.resolve('val');
    },

    'resulting promise should be rejected with same reason' : function(test) {
        var defer = Vow.defer(),
            error = new Error('error');

        defer.promise().then().then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });

        defer.reject(error);
    },

    'resulting promise should be notified with same value' : function(test) {
        var defer = Vow.defer();

        defer.promise().then().then(null, null, function(val) {
            test.strictEqual(val, 1);
            test.done();
        });

        defer.notify(1);
    },

    'resulting promise should be fulfilled with returned value of onFulfilled callback' : function(test) {
        var defer = Vow.defer(),
            resPromise = defer.promise().then(function() {
                return 'val';
            });

        defer.resolve();

        resPromise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled with same value as returned promise of onFulfilled callback' : function(test) {
        var defer = Vow.defer(),
            retdefer = Vow.defer(),
            resPromise = defer.promise().then(function() {
                return retdefer.promise();
            });

        defer.promise().then(function() {
            retdefer.resolve('ok');
        });

        resPromise.then(function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });

        defer.resolve();
    },

    'resulting promise should be rejected with same value as returned promise of onRejected callback' : function(test) {
        var defer = Vow.defer(),
            retdefer = Vow.defer(),
            resPromise = defer.promise().then(function() {
                return retdefer.promise();
            }),
            error = new Error('error');

        defer.promise().then(function() {
            retdefer.reject(error);
        });

        resPromise.then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });

        defer.resolve();
    },

    'resulting promise should be rejected if onFulfilled callback throw exception' : function(test) {
        var defer = Vow.defer(),
            resPromise = defer.promise().then(function() {
                throw { message : 'error' };
            });

        resPromise.then(null, function(arg) {
            test.deepEqual(arg, { message : 'error' });
            test.done();
        });

        defer.resolve();
    },

    'resulting promise should be rejected if onRejected callback throw exception' : function(test) {
        var defer = Vow.defer(),
            resPromise = defer.promise().then(null, function() {
                throw { message : 'error' };
            });

        resPromise.then(null, function(arg) {
            test.deepEqual(arg, { message : 'error' });
            test.done();
        });

        defer.reject();
    },

    'resulting promise should be notified with same value as returned promise of onFulfilled callback' : function(test) {
        var defer = Vow.defer(),
            retdefer = Vow.defer(),
            resPromise = defer.promise().then(function() {
                return retdefer.promise();
            });

        defer.promise().then(function() {
            retdefer.notify('ok');
        });

        resPromise.then(null, null, function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });

        defer.resolve();
    },

    'resulting promise should be notified with same value as returned promise of onRejected callback' : function(test) {
        var defer = Vow.defer(),
            retdefer = Vow.defer(),
            resPromise = defer.promise().then(null, function() {
                return retdefer.promise();
            });

        defer.promise().then(null, function() {
            retdefer.notify('ok');
        });

        resPromise.then(null, null, function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });

        defer.reject();
    },

    'resulting promise should be notified with returned value of onProgress callback' : function(test) {
        var defer = Vow.defer();

        defer.promise()
            .then(null, null, function(val) {
                return val + 1;
            })
            .then(null, null, function(val) {
                test.strictEqual(val, 2);
                test.done();
            });

        defer.notify(1);
    },

    'onFulfilled callback should be called in given context' : function(test) {
        var defer = Vow.defer(),
            ctx = {};

        defer.promise().then(function() {
            test.strictEqual(ctx, this);
            test.done();
        }, ctx);

        defer.resolve();
    },

    'onRejected callback should be called in given context' : function(test) {
        var defer = Vow.defer(),
            ctx = {};

        defer.promise().then(null, function() {
            test.strictEqual(ctx, this);
            test.done();
        }, ctx);

        defer.reject();
    },

    'onProgress callback should be called in given context' : function(test) {
        var defer = Vow.defer(),
            ctx = {};

        defer.promise().then(null, null, function() {
            test.strictEqual(ctx, this);
            test.done();
        }, ctx);

        defer.notify();
    }
};