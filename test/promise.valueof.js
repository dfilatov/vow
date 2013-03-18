module.exports = {
    'should return undefined if promise is unresolved' : function(test) {
        var promise = Vow.promise();

        test.strictEqual(promise.valueOf(), undefined);
        test.done();
    },

    'should return value of fulfillment if promise if fulfilled' : function(test) {
        var promise = Vow.promise();
        promise.fulfill('ok');

        test.strictEqual(promise.valueOf(), 'ok');
        test.done();
    },

    'should return reason of rejection if promise if rejected' : function(test) {
        var promise = Vow.promise(),
            error = Error();

        promise.reject(error);

        test.strictEqual(promise.valueOf(), error);
        test.done();
    }
};