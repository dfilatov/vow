module.exports = {
    'onRejected callback should be called when argument rejected' : function(test) {
        var defer,
            promise = Vow.promise(function(_defer) {
                defer = _defer;
            });

        Vow.fail(promise, function(error) {
            test.strictEqual(error, 'err');
            test.done();
        });

        defer.reject('err');
    }
};