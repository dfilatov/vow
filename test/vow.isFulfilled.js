module.exports = {
    'should return promise state if argument is promise' : function(test) {
        var pendingPromise = Vow.defer().promise();
        test.ok(Vow.isFulfilled(pendingPromise) === pendingPromise.isFulfilled());

        var fulfilledPromise = Vow.fulfill('val');
        test.ok(Vow.isFulfilled(fulfilledPromise) === fulfilledPromise.isFulfilled());

        var rejectedPromise = Vow.reject('error');
        test.ok(Vow.isRejected(rejectedPromise) === rejectedPromise.isRejected());

        test.done();
    },

    'should be true if argument is non-promise' : function(test) {
        test.ok(Vow.isFulfilled('val'));
        test.done();
    }
};