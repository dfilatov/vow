module.exports = {
    'resulting promise should be rejected if argument is non-promise' : function(test) {
        Vow.reject('error').fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    },

    'resulting promise should be rejected if argument is rejected' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        Vow.reject(promise).fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });

        resolver.reject('error');
    },

    'resulting promise should be rejected if argument is fulfilled' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        Vow.reject(promise).fail(function(error) {
            test.strictEqual(error, 'val');
            test.done();
        });

        resolver.fulfill('val');
    }
};