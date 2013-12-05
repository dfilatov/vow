module.exports = {
    'onRejected callback should be called on reject' : function(test) {
        var resolver = Vow.resolver();

        resolver.reject('error');
        resolver.promise().fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    }
};