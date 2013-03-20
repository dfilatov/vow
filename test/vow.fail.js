module.exports = {
    'onRejected callback should be called when argument rejected' : function(test) {
        var promise = Vow.promise();

        Vow.fail(promise, function(error) {
            test.strictEqual(error, 'err');
            test.done();
        });

        promise.reject('err');
    }
};