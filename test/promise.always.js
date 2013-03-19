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
    }
};
