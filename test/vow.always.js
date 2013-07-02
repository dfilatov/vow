module.exports = {
    'onResolved callback should be called when argument fulfilled' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        Vow.always(promise, function(promise) {
            test.ok(promise.isFulfilled());
            test.strictEqual(promise.valueOf(), 'ok');
            test.done();
        });

        resolver.fulfill('ok');
    },

    'onResolved callback should be called when argument rejected' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        Vow.always(promise, function(promise) {
            test.ok(promise.isRejected());
            test.strictEqual(promise.valueOf(), 'err');
            test.done();
        });

        resolver.reject('err');
    },

    'onResolved callback should be called when argument is non-promise' : function(test) {
        Vow.always('ok', function(promise) {
            test.ok(promise.isFulfilled());
            test.strictEqual(promise.valueOf(), 'ok');
            test.done();
        });
    }
};

