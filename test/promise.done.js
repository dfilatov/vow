module.exports = {
    'exception should be throwed' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            e = Error();

        promise.done();
        resolver.reject(e);

        process.once('uncaughtException', function(_e) {
            test.strictEqual(_e, e);
            test.done();
        });
    }
};
