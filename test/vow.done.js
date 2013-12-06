module.exports = {
    'exception should be throwed if argument is a promise' : function(test) {
        var defer,
            promise = Vow.promise(function(_defer) {
                defer = _defer;
            }),
            e = Error();

        defer.reject(e);
        Vow.done(promise);

        process.once('uncaughtException', function(_e) {
            test.strictEqual(_e, e);
            test.done();
        });
    },

    'nothing to be happen if argument is not a promise' : function(test) {
        Vow.done('val');
        test.done();
    }
};