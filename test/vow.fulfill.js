module.exports = {
    'resulting promise should be fulfilled if argument is non-promise' : function(test) {
        Vow.fulfill('val').then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be fulfilled if argument is fulfilled' : function(test) {
        var promise = Vow.promise();

        Vow.fulfill(promise).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        promise.fulfill('val');
    },

    'resulting promise should be fulfilled if argument is rejected' : function(test) {
        var promise = Vow.promise();

        Vow.fulfill(promise).then(function(val) {
            test.strictEqual(val, 'error');
            test.done();
        });

        promise.reject('error');
    }
};