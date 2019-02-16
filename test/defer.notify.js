module.exports = {
    'onProgress callbacks should be called on each notify' : function(test) {
        var defer = Vow.defer(),
            promise = defer.promise(),
            calledArgs1 = [],
            calledArgs2 = [];

        promise.progress(function(val) {
            calledArgs1.push(val);
        });

        promise.then(null, null, function(val) {
            calledArgs2.push(val);
        });

        defer.notify(1);
        defer.notify(2);
        promise.then(function() {
            test.deepEqual(calledArgs1, [1, 2]);
            test.deepEqual(calledArgs2, [1, 2]);
            test.done();
        });

        defer.resolve();
    },

    'onProgress callbacks shouldn\'t be called after promise has been fulfilled' : function(test) {
        var defer = Vow.defer(),
            promise = defer.promise(),
            called = false;

        promise.progress(function() {
            called = true;
        });

        defer.resolve();
        defer.notify();
        defer.notify();
        promise.then(function() {
            test.ok(!called);
            test.done();
        });
    },

    'onProgress callbacks shouldn\'t be called after promise has been rejected' : function(test) {
        var defer = Vow.defer(),
            promise = defer.promise(),
            called = false;

        promise.progress(function() {
            called = true;
        });

        defer.reject();
        defer.notify();
        defer.notify();
        promise.fail(function() {
            test.ok(!called);
            test.done();
        });
    }
};
