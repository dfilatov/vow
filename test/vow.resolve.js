module.exports = {
    'resulting promise should be argument if it is promise' : function(test) {
        var promise = Vow.promise(),
            isFulfilled = promise.isFulfilled(),
            resPromise = Vow.resolve(promise);

        test.strictEqual(resPromise, promise);
        test.strictEqual(resPromise.isFulfilled(), isFulfilled);
        test.done();
    },

    'resulting promise should be fulfilled if argument is non-promise' : function(test) {
        var promise = Vow.resolve('val');

        promise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    }
};