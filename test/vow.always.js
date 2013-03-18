module.exports = {
    'onResolved callback should be called when argument fulfilled' : function(test) {
        var promise = Vow.promise();

        Vow.always(promise, function(promise) {
            test.ok(promise.isFulfilled());
            test.strictEqual(promise.valueOf(), 'ok');
            test.done();
        });

        promise.fulfill('ok');
    },

    'onResolved callback should be called when argument rejected' : function(test) {
        var promise = Vow.promise();

        Vow.always(promise, function(promise) {
            test.ok(promise.isRejected());
            test.strictEqual(promise.valueOf(), 'err');
            test.done();
        });

        promise.reject('err');
    },

    'onResolved callback should be called when argument is non-promise' : function(test) {
        Vow.always('ok', function(promise) {
            test.ok(promise.isFulfilled());
            test.strictEqual(promise.valueOf(), 'ok');
            test.done();
        });
    }
};

