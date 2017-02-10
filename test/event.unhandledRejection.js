module.exports = {
    '"unhandledRejection" event should be emitted if there is no onRejected callback' : function(test) {
        var defer = Vow.defer(),
            promise = defer.promise(),
            listener = function(reason, promise) {
                test.strictEqual(reason, 'err');
                test.ok(promise.isRejected());

                process.removeListener('unhandledRejection', listener);

                test.done();
            };

        process.on('unhandledRejection', listener);

        promise.then().then();

        defer.reject('err');
    },

    '"unhandledRejection" event should not be emitted if there is onRejected callback' : function(test) {
        var defer = Vow.defer(),
            promise = defer.promise(),
            listenerCalled = false,
            listener = function() {
                listenerCalled = true;
            };

        process.on('unhandledRejection', listener);

        promise.then().fail(function() {});

        defer.reject('err');

        setTimeout(function() {
            test.ok(!listenerCalled);

            process.removeListener('unhandledRejection', listener);

            test.done();
        }, 30);
    }
};
