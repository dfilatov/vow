module.exports = {
    'onResolved callback should be called on fulfill' : function(test) {
        var defer = Vow.defer();
        defer.resolve('ok');
        defer.promise().always(function(promise) {
            test.ok(promise.isFulfilled());
            test.strictEqual(promise.valueOf(), 'ok');
            test.done();
        });
    },

    'onResolved callback should be called on reject' : function(test) {
        var defer = Vow.defer(),
            promise = Vow.promise(defer);
        defer.reject('error');
        promise.always(function(promise) {
            test.ok(promise.isRejected());
            test.strictEqual(promise.valueOf(), 'error');
            test.done();
        });
    },

    'resulting promise should be fulfilled with returned value of onResolved callback' : function(test) {
        var defer = Vow.defer(),
            promise = Vow.promise(defer);
        defer.resolve('ok');
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
        var defer = Vow.defer(),
            promise = Vow.promise(defer);
        defer.resolve('ok');
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
