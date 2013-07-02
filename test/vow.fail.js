module.exports = {
    'onRejected callback should be called when argument rejected' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            });

        Vow.fail(promise, function(error) {
            test.strictEqual(error, 'err');
            test.done();
        });

        resolver.reject('err');
    }
};