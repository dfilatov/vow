module.exports = {
    'onProgress callbacks should be called on each notify' : function(test) {
        var promise = Vow.promise(),
            calledArgs1 = [],
            calledArgs2 = [];

        promise.progress(function(val) {
            calledArgs1.push(val);
        });

        promise.then(null, null, function(val) {
            calledArgs2.push(val);
        });

        promise.notify(1);
        promise.notify(2);
        promise.then(function() {
            test.deepEqual(calledArgs1, [1, 2]);
            test.deepEqual(calledArgs2, [1, 2]);
            test.done();
        });

        promise.fulfill();
    },

    'onProgress callbacks shouldn\'t be called after promise has been fulfilled' : function(test) {
        var promise = Vow.promise(),
            called = false;

        promise.progress(function() {
            called = true;
        });

        promise.fulfill();
        promise.notify();
        promise.notify();
        promise.then(function() {
            test.ok(!called);
            test.done();
        });
    },

    'onProgress callbacks shouldn\'t be called after promise has been rejected' : function(test) {
        var promise = Vow.promise(),
            called = false;

        promise.progress(function() {
            called = true;
        });

        promise.reject();
        promise.notify();
        promise.notify();
        promise.fail(function() {
            test.ok(!called);
            test.done();
        });
    }
};