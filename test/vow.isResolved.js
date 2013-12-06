module.exports = {
    'should return promise state if argument is promise' : function(test) {
        var pendingPromise = Vow.promise();
        test.ok(Vow.isResolved(pendingPromise) === pendingPromise.isResolved());

        var fulfilledPromise = Vow.promise('val');
        test.ok(Vow.isResolved(fulfilledPromise) === fulfilledPromise.isResolved());

        var defer,
            rejectedPromise = Vow.promise(function(_defer) {
                defer = _defer;
            });
        defer.reject('error');
        test.ok(Vow.isResolved(rejectedPromise) === rejectedPromise.isResolved());

        test.done();
    },

    'should be true if argument is non-promise' : function(test) {
        test.ok(Vow.isResolved('val'));
        test.done();
    }
};