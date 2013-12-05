module.exports = {
    'exception should be throwed' : function(test) {
        var resolver = Vow.resolver(),
            e = Error();

        resolver.promise().done();
        resolver.reject(e);

        process.once('uncaughtException', function(_e) {
            test.strictEqual(_e, e);
            test.done();
        });
    }
};
