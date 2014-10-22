module.exports = {
    'resulting promise should be rejected after timeout' : function(test) {
        var resPromise = Vow.defer().promise().timeout(10);
        setTimeout(function() {
            test.ok(resPromise.isRejected());
            test.ok(resPromise.valueOf() instanceof Vow.TimedOutError);
            test.done();
        }, 20);
    },

    'resulting promise should be fulfilled before timeout' : function(test) {
        var defer = Vow.defer(),
            resPromise = defer.promise().timeout(20);

        setTimeout(function() {
            defer.resolve('val');
        }, 10);

        resPromise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be rejected before timeout' : function(test) {
        var defer = Vow.defer(),
            resPromise = defer.promise().timeout(20),
            error = new Error('error');

        setTimeout(function() {
            defer.reject(error);
        }, 10);

        resPromise.then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });
    }
};
