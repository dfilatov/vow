module.exports = {
    'onRejected callback should be called when argument rejected' : function(test) {
        var defer = Vow.defer();

        Vow.fail(defer.promise(), function(error) {
            test.strictEqual(error, 'err');
            test.done();
        });

        defer.reject('err');
    }
};