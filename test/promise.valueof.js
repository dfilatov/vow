module.exports = {
    'should return undefined if promise is unresolved' : function(test) {
        var promise = Vow.defer().promise();

        test.strictEqual(promise.valueOf(), undefined);
        test.done();
    },

    'should return value of fulfillment if promise if fulfilled' : function(test) {
        var defer = Vow.defer();

        defer.resolve('ok');

        test.strictEqual(defer.promise().valueOf(), 'ok');
        test.done();
    },

    'should return reason of rejection if promise if rejected' : function(test) {
        var defer = Vow.defer(),
            error = Error();

        defer.reject(error);

        test.strictEqual(defer.promise().valueOf(), error);
        test.done();
    }
};