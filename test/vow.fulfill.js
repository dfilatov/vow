module.exports = {
    'resulting promise should be fulfilled if argument is non-promise' : function(test) {
        Vow.fulfill('val').then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled if argument is fulfilled' : function(test) {
        var defer,
            promise = Vow.promise(function(_defer) {
                defer = _defer;
            });

        Vow.fulfill(promise).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defer.fulfill('val');
    },

    'resulting promise should be fulfilled if argument is rejected' : function(test) {
        var defer,
            promise = Vow.promise(function(_defer) {
                defer = _defer;
            });

        Vow.fulfill(promise).then(function(val) {
            test.strictEqual(val, 'error');
            test.done();
        });

        defer.reject('error');
    }
};