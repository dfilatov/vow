module.exports = {
    'resulting promise should be fulfilled after delay' : function(test) {
        var origPromise = Vow.promise(),
            resPromise = origPromise.delay(30);

        setTimeout(function() {
            test.ok(!resPromise.isResolved());
        }, 20);
        setTimeout(function() {
            test.ok(resPromise.isFulfilled());
            test.strictEqual(resPromise.valueOf(), 'ok');
            test.done();
        }, 40);
        origPromise.fulfill('ok');
    },

    'resulting promise should be immediately rejected' : function(test) {
        var origPromise = Vow.promise(),
            resPromise = origPromise.delay(30);

        setTimeout(function() {
            test.ok(resPromise.isRejected());
            test.strictEqual(resPromise.valueOf(), 'error');
            test.done();
        }, 10);

        origPromise.reject('error');
    }
};