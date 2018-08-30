module.exports = {
    'onFinalized callback should be called without arguments on fulfill' : function(test) {
        var defer = Vow.defer();
        defer.resolve('ok');
        defer.promise().finally(function() {
            test.strictEqual(arguments.length, 0);
            test.done();
        });
    },

    'onFinalized callback should be called without arguments on reject' : function(test) {
        var defer = Vow.defer();
        defer.reject('error');
        defer.promise().finally(function() {
            test.strictEqual(arguments.length, 0);
            test.done();
        });
    },

    'returned promise should be fulfilled with value of original promise' : function(test) {
        var defer = Vow.defer();
        defer.resolve('ok');
        defer.promise()
            .finally(function() {
                return 'finally';
            })
            .then(function(val) {
                test.strictEqual(val, 'ok');
                test.done();
            });
    },

    'returned promise should be rejected with value of original promise' : function(test) {
        var defer = Vow.defer(),
            error = new Error('error');
        defer.reject(error);
        defer.promise()
            .finally(function() {
                return new Error('finally');
            })
            .fail(function(_error) {
                test.strictEqual(_error, error);
                test.done();
            });
    },

    'returned promise should be rejected with value of returned promise' : function(test) {
        var defer = Vow.defer(),
            error = new Error('error'),
            finallyError = new Error('finally');
        defer.reject(error);
        defer.promise()
            .finally(function() {
                return Vow.reject(finallyError);
            })
            .fail(function(_error) {
                test.strictEqual(_error, finallyError);
                test.done();
            });
    }
};
