module.exports = {
    'resulting promise should be fulfilled with same value' : function(test) {
        var promise = Vow.promise();

        promise.then().then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        promise.fulfill('val');
    },

    'resulting promise should be rejected with same reason' : function(test) {
        var promise = Vow.promise(),
            error = new Error('error');

        promise.then().then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });

        promise.reject(error);
    },

    'resulting promise should be notified with same value' : function(test) {
        var promise = Vow.promise();

        promise.then().then(null, null, function(val) {
            test.strictEqual(val, 1);
            test.done();
        });

        promise.notify(1);
    },

    'resulting promise should be fulfilled with returned value of onFulfilled callback' : function(test) {
        var promise = Vow.promise(),
            resPromise = promise.then(function() {
                return 'val';
            });

        promise.fulfill();

        resPromise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled with same value as returned promise of onFulfilled callback' : function(test) {
        var promise = Vow.promise(),
            retPromise = Vow.promise(),
            resPromise = promise.then(function() {
                return retPromise;
            });

        promise.then(function() {
            retPromise.fulfill('ok');
        });

        resPromise.then(function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });

        promise.fulfill();
    },

    'resulting promise should be rejected with same value as returned promise of onRejected callback' : function(test) {
        var promise = Vow.promise(),
            retPromise = Vow.promise(),
            resPromise = promise.then(function() {
                return retPromise;
            }),
            error = new Error('error');

        promise.then(function() {
            retPromise.reject(error);
        });

        resPromise.then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });

        promise.fulfill();
    },

    'resulting promise should be rejected if onFulfilled callback throw exception' : function(test) {
        var promise = Vow.promise(),
            resPromise = promise.then(function() {
                throw { message : 'error' };
            });

        resPromise.then(null, function(arg) {
            test.deepEqual(arg, { message : 'error' });
            test.done();
        });

        promise.fulfill();
    },

    'resulting promise should be rejected if onRejected callback throw exception' : function(test) {
        var promise = Vow.promise(),
            resPromise = promise.then(null, function() {
                throw { message : 'error' };
            });

        resPromise.then(null, function(arg) {
            test.deepEqual(arg, { message : 'error' });
            test.done();
        });

        promise.reject();
    },

    'resulting promise should be notified with returned value of onProgress callback' : function(test) {
        var promise = Vow.promise();

        promise
            .then(null, null, function(val) {
                return val + 1;
            })
            .then(null, null, function(val) {
                test.strictEqual(val, 2);
                test.done();
            });

        promise.notify(1);
    }
};