module.exports = {
    'onFulfilled callbacks should be called on fulfill only' : function(test) {
        var promise = Vow.promise(),
            called1 = false,
            called2 = false,
            called3 = false,
            called4 = false;

        promise.then(function() {
            called1 = true;
        });

        promise.then(null, function() {
            called2 = true;
        });

        promise.then(function() {
            called3 = true;
        });

        promise.fulfill();

        promise.then(function() {
            called4 = true;
        });

        promise.then(function() {
            test.ok(called1);
            test.ok(!called2);
            test.ok(called3);
            test.done();
        });
    },

    'onFulfilled callbacks should be called once' : function(test) {
        var promise = Vow.promise(),
            calledCnt = 0;

        promise.then(function() {
            calledCnt++;
        });

        promise.fulfill();
        promise.fulfill();

        promise.then(function() {
            test.strictEqual(calledCnt, 1);
            test.done();
        });
    },

    'onFulfilled callbacks shouldn\'t be called if fulfill have been called after reject' : function(test) {
        var promise = Vow.promise(),
            called = false;

        promise.then(function() {
            called = true;
        });

        promise.reject();
        promise.fulfill();

        promise.then(null, function() {
            test.ok(!called);
            test.done();
        });
    },

    'onFulfilled callbacks should be executed in the order of their originating calls to then' : function(test) {
        var promise = Vow.promise(),
            resOrder = [];

        promise.then(function() {
            resOrder.push(1);
        });

        promise.then(function() {
            resOrder.push(2);
        });

        promise.fulfill();

        promise.then(function() {
            resOrder.push(3);
        });

        promise.then(function() {
            resOrder.push(4);
        });

        setTimeout(function() {
            promise.then(function() {
                resOrder.push(5);
                setTimeout(function() {
                    test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6]);
                    test.done();
                }, 10);
            });

            promise.then(function() {
                resOrder.push(6);
            });
        }, 10);
    },

    'onFulfilled callback shouldn\'t be called in the same turn of the event loop as the call to then' : function(test) {
        var promise = Vow.promise(),
            resOrder = [];

        promise.then(function() {
            resOrder.push(3);
        });

        process.nextTick(function() {
            process.nextTick(function() {
                resOrder.push(4);
                process.nextTick(function() {
                    resOrder.push(7);
                });
                promise.then(function() {
                    resOrder.push(8);
                });
            });

            promise.then(function() {
                resOrder.push(5);
            });

            promise.then(function() {
                resOrder.push(6);
            });

            resOrder.push(2);
        });

        resOrder.push(1);
        promise.fulfill();

        setTimeout(function() {
            test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6, 7, 8]);
            test.done();
        }, 20);
    }
};