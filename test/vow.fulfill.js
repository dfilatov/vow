module.exports = {
    'resulting promise should be fulfilled if argument is non-promise' : function(test) {
        Vow.fulfill('val').then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled if argument is fulfilled' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        Vow.fulfill(promise).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        resolver.fulfill('val');
    },

    'resulting promise should be fulfilled if argument is rejected' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        Vow.fulfill(promise).then(function(val) {
            test.strictEqual(val, 'error');
            test.done();
        });

        resolver.reject('error');
    }
};