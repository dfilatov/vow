module.exports = {
    'resulting promise should be immediately fulfilled if argument is not a promise' : function(test) {
        var promise = Vow.fulfill('val');
        test.ok(promise.isFulfilled());
        test.done();
    },

    'resulting promise should be fulfilled with argument if argument is not a promise' : function(test) {
        Vow.fulfill('val').then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled if argument is fulfilled' : function(test) {
        var defer = Vow.defer();

        Vow.fulfill(defer.promise()).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defer.resolve('val');
    },

    'resulting promise should be fulfilled if argument is rejected' : function(test) {
        var defer = Vow.defer();

        Vow.fulfill(defer.promise()).then(function(val) {
            test.strictEqual(val, 'error');
            test.done();
        });

        defer.reject('error');
    }
};
