module.exports = {
    'onResolved callback should be called on fulfill' : function(test) {
        var promise = Vow.promise();
        promise.fulfill('ok');
        promise.always(function(promise) {
            test.ok(promise.isFulfilled());
            test.strictEqual(promise.valueOf(), 'ok');
            test.done();
        });
    },

    'onResolved callback should be called on reject' : function(test) {
        var promise = Vow.promise();
        promise.reject('error');
        promise.always(function(promise) {
            test.ok(promise.isRejected());
            test.strictEqual(promise.valueOf(), 'error');
            test.done();
        });
    },

    'resulting promise should be fulfilled with returned value of onResolved callback' : function(test) {
        var promise = Vow.promise();
        promise.fulfill('ok');
        promise
            .always(function() {
                return 'ok-always';
            })
            .then(function(val) {
                test.strictEqual(val, 'ok-always');
                test.done();
            });
    },

    'resulting promise should be rejected with exception in onResolved callback' : function(test) {
        var promise = Vow.promise();
        promise.fulfill('ok');
        promise
            .always(function() {
                throw 'error-always';
            })
            .fail(function(err) {
                test.strictEqual(err, 'error-always');
                test.done();
            });
    }
};
