module.exports = {
    'should return promise state if argument is promise' : function(test) {
        var pendingPromise = Vow.defer().promise();
        test.ok(Vow.isRejected(pendingPromise) === pendingPromise.isRejected());

        var fulfilledPromise = Vow.fulfill('val');
        test.ok(Vow.isRejected(fulfilledPromise) === fulfilledPromise.isRejected());

        var rejectedPromise = Vow.reject('error');
        test.ok(Vow.isRejected(rejectedPromise) === rejectedPromise.isRejected());

        test.done();
    },

    'should be false if argument is non-promise' : function(test) {
        test.ok(!Vow.isRejected('val'));
        test.done();
    }
};

