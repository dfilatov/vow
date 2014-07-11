module.exports = {
    'resulting promise should be immediately rejected' : function(test) {
        var promise = Vow.reject('error');
        test.ok(promise.isRejected());
        test.done();
    },

    'resulting promise should be rejected with argument if argument is not a promise' : function(test) {
        Vow.reject('error').fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    },

    'resulting promise should be rejected if argument is rejected' : function(test) {
        var defer = Vow.defer();

        Vow.reject(defer.promise()).fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });

        defer.reject('error');
    },

    'resulting promise should be rejected if argument is fulfilled' : function(test) {
        var defer = Vow.defer();

        Vow.reject(defer.promise()).fail(function(error) {
            test.strictEqual(error, 'val');
            test.done();
        });

        defer.resolve('val');
    }
};
