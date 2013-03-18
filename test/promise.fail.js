module.exports = {
    'onRejected callback should be called on reject' : function(test) {
        var promise = Vow.promise();
        promise.reject('error');
        promise.fail(function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });
    }
};