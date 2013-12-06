module.exports = {
    'resulting promise should be rejected if argument is non-promise' : function(test) {
        Vow.reject('error').fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    },

    'resulting promise should be rejected if argument is rejected' : function(test) {
        var defer,
            promise = Vow.promise(function(_defer) {
                defer = _defer;
            });

        Vow.reject(promise).fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });

        defer.reject('error');
    },

    'resulting promise should be rejected if argument is fulfilled' : function(test) {
        var defer,
            promise = Vow.promise(function(_defer) {
                defer = _defer;
            });

        Vow.reject(promise).fail(function(error) {
            test.strictEqual(error, 'val');
            test.done();
        });

        defer.fulfill('val');
    }
};