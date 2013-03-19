module.exports = {
    'promise should be fulfilled when synced promise fulfilled' : function(test) {
        var promise = Vow.promise(),
            syncedWithPromise = Vow.promise();

        promise.sync(syncedWithPromise);

        promise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        syncedWithPromise.fulfill('val');
    },

    'promise should be rejected when synced promise fulfilled' : function(test) {
        var promise = Vow.promise(),
            syncedWithPromise = Vow.promise();

        promise.sync(syncedWithPromise);

        promise.fail(function(err) {
            test.strictEqual(err, 'err');
            test.done();
        });

        syncedWithPromise.reject('err');
    }
};