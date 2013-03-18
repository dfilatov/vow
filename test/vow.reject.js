module.exports = {
    'resulting promise should be rejected if argument is non-promise' : function(test) {
        Vow.reject('error').fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    },

    'resulting promise should be rejected if argument is rejected' : function(test) {
        var promise = Vow.promise();

        Vow.reject(promise).fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });

        promise.reject('error');
    },

    'resulting promise should be rejected if argument is fulfilled' : function(test) {
        var promise = Vow.promise();

        Vow.reject(promise).fail(function(error) {
            test.strictEqual(error, 'val');
            test.done();
        });

        promise.fulfill('val');
    }
};