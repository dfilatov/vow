module.exports = {
    'onResolved callback should be called when argument fulfilled' : function(test) {
        var defer,
            promise = Vow.promise(function(_defer) {
                defer = _defer;
            });

        Vow.always(promise, function(promise) {
            test.ok(promise.isFulfilled());
            test.strictEqual(promise.valueOf(), 'ok');
            test.done();
        });

        defer.fulfill('ok');
    },

    'onResolved callback should be called when argument rejected' : function(test) {
        var defer,
            promise = Vow.promise(function(_defer) {
                defer = _defer;
            });

        Vow.always(promise, function(promise) {
            test.ok(promise.isRejected());
            test.strictEqual(promise.valueOf(), 'err');
            test.done();
        });

        defer.reject('err');
    },

    'onResolved callback should be called when argument is non-promise' : function(test) {
        Vow.always('ok', function(promise) {
            test.ok(promise.isFulfilled());
            test.strictEqual(promise.valueOf(), 'ok');
            test.done();
        });
    }
};

