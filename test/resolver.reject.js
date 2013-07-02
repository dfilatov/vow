var nextTick = typeof setImmediate === 'function'? setImmediate : process.nextTick;

module.exports = {
    'onRejected callbacks should be called on reject only' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            called1 = false,
            called2 = false,
            called3 = false,
            called4 = false;

        promise.then(null, function() {
            called1 = true;
        });

        promise.then(function() {
            called2 = true;
        });

        promise.then(null, function() {
            called3 = true;
        });

        resolver.reject();

        promise.then(null, function() {
            called4 = true;
        });

        promise.then(null, function() {
            test.ok(called1);
            test.ok(!called2);
            test.ok(called3);
            test.done();
        });
    },

    'onRejected callbacks should be called once' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            calledCnt = 0;

        promise.then(null, function() {
            calledCnt++;
        });

        resolver.reject();
        resolver.reject();

        promise.then(null, function() {
            test.strictEqual(calledCnt, 1);
            test.done();
        });
    },

    'onRejected callbacks shouldn\'t be called if reject have been called after fulfill' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            called = false;

        promise.then(null, function() {
            called = true;
        });

        resolver.fulfill();
        resolver.reject();

        promise.then(function() {
            test.ok(!called);
            test.done();
        });
    },

    'onRejected callbacks should be executed in the order of their originating calls to then' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            resOrder = [];

        promise.then(null, function() {
            resOrder.push(1);
        });

        promise.then(null, function() {
            resOrder.push(2);
        });

        resolver.reject();

        promise.then(null, function() {
            resOrder.push(3);
        });

        promise.then(null, function() {
            resOrder.push(4);
        });

        setTimeout(function() {
            promise.then(null, function() {
                resOrder.push(5);
                setTimeout(function() {
                    test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6]);
                    test.done();
                }, 10);
            });

            promise.then(null, function() {
                resOrder.push(6);
            });
        }, 10);
    },

    'onRejected callback shouldn\'t be called in the same turn of the event loop as the call to then' : function(test) {
        var resolver,
            promise = Vow.promise(function(_resolver) {
                resolver = _resolver;
            }),
            resOrder = [];

        promise.then(null, function() {
            resOrder.push(3);
        });

        nextTick(function() {
            nextTick(function() {
                resOrder.push(6);
                nextTick(function() {
                    resOrder.push(7);
                });
                promise.then(null, function() {
                    resOrder.push(8);
                });
            });

            promise.then(null, function() {
                resOrder.push(4);
            });

            promise.then(null, function() {
                resOrder.push(5);
            });

            resOrder.push(2);
        });

        resOrder.push(1);
        resolver.reject();

        setTimeout(function() {
            test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6, 7, 8]);
            test.done();
        }, 20);
    }
};