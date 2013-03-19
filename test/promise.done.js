module.exports = {
    'exception should be throwed' : function(test) {
        var promise = Vow.promise(),
            e = Error();

        promise.done();
        promise.reject(e);

        process.once('uncaughtException', function(_e) {
            test.strictEqual(_e, e);
            test.done();
        });
    }
};
