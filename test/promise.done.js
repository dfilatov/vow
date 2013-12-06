module.exports = {
    'exception should be throwed' : function(test) {
        var defer = Vow.defer(),
            e = Error();

        defer.promise().done();
        defer.reject(e);

        process.once('uncaughtException', function(_e) {
            test.strictEqual(_e, e);
            test.done();
        });
    }
};
