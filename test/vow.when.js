module.exports = {
    'onFulfilled callback should be called when argument fulfilled' : function(test) {
        var defer = Vow.defer();

        Vow.when(defer.promise(), function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defer.resolve('val');
    },

    'onRejected callback should be called when argument rejected' : function(test) {
        var defer = Vow.defer();

        Vow.when(defer.promise(), null, function(error) {
            test.strictEqual(error, 'err');
            test.done();
        });

        defer.reject('err');
    },

    'onFulfilled callback should be called if argument is non-promise' : function(test) {
        Vow.when('val', function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'onProgress callback should be called when argument notified' : function(test) {
        var defer = Vow.defer();;

        Vow.when(defer.promise(), null, null, function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defer.notify('val');
    }
};
