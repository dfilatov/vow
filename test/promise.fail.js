module.exports = {
    'onRejected callback should be called on reject' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        resolver.reject('error');
        promise.fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    }
};