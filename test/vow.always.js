module.exports = {
    'onResolved callback should be called when argument fulfilled' : function(test) {
        var promise = Vow.promise();

        Vow.always(promise, function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });

        promise.fulfill('ok');
    },

    'onResolved callback should be called when argument rejected' : function(test) {
        var promise = Vow.promise();

        Vow.always(promise, function(error) {
            test.strictEqual(error, 'err');
            test.done();
        });

        promise.reject('err');
    },

    'onResolved callback should be called when argument is non-promise' : function(test) {
        Vow.always('ok', function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });
    }
};

