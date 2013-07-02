module.exports = {
    'onProgress callbacks should be called on each notify' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            calledArgs1 = [],
            calledArgs2 = [];

        promise.progress(function(val) {
            calledArgs1.push(val);
        });

        promise.then(null, null, function(val) {
            calledArgs2.push(val);
        });

        resolver.notify(1);
        resolver.notify(2);
        promise.then(function() {
            test.deepEqual(calledArgs1, [1, 2]);
            test.deepEqual(calledArgs2, [1, 2]);
            test.done();
        });

        resolver.fulfill();
    },

    'onProgress callbacks shouldn\'t be called after promise has been fulfilled' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            called = false;

        promise.progress(function() {
            called = true;
        });

        resolver.fulfill();
        resolver.notify();
        resolver.notify();
        promise.then(function() {
            test.ok(!called);
            test.done();
        });
    },

    'onProgress callbacks shouldn\'t be called after promise has been rejected' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            called = false;

        promise.progress(function() {
            called = true;
        });

        resolver.reject();
        resolver.notify();
        resolver.notify();
        promise.fail(function() {
            test.ok(!called);
            test.done();
        });
    }
};