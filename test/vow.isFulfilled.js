module.exports = {
    'should return promise state if argument is promise' : function(test) {
        var pendingPromise = Vow.promise();
        test.ok(Vow.isFulfilled(pendingPromise) === pendingPromise.isFulfilled());

        var fulfilledPromise = Vow.promise('val');
        test.ok(Vow.isFulfilled(fulfilledPromise) === fulfilledPromise.isFulfilled());

        var rejectedPromise = Vow.promise();
        rejectedPromise.reject('error');
        test.ok(Vow.isFulfilled(rejectedPromise) === rejectedPromise.isFulfilled());

        test.done();
    },

    'should be true if argument is non-promise' : function(test) {
        test.ok(Vow.isFulfilled('val'))
        test.done();
    }
};