module.exports = {
    'promise should be fulfilled when synced promise fulfilled' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            syncedWithResolver,
            syncedWithPromise = Vow.promise(function(_resolver) {
                syncedWithResolver = _resolver;
            });

        resolver.sync(syncedWithPromise);
        promise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        syncedWithResolver.fulfill('val');
    },

    'promise should be rejected when synced promise rejected' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            syncedWithResolver,
            syncedWithPromise = Vow.promise(function(_resolver) {
                syncedWithResolver = _resolver;
            });

        resolver.sync(syncedWithPromise);
        promise.fail(function(err) {
            test.strictEqual(err, 'err');
            test.done();
        });

        syncedWithResolver.reject('err');
    },

    'promise should be notified when synced promise notified' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            syncedWithResolver,
            syncedWithPromise = Vow.promise(function(_resolver) {
                syncedWithResolver = _resolver;
            });

        resolver.sync(syncedWithPromise);
        promise.progress(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        syncedWithResolver.notify('val');
    }
};