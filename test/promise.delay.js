module.exports = {
    'resulting promise should be fulfilled after delay' : function(test) {
        var resolver = Vow.resolver(),
            resPromise = resolver.promise().delay(30);

        setTimeout(function() {
            test.ok(!resPromise.isRejected());
            test.ok(!resPromise.isFulfilled());
        }, 20);
        setTimeout(function() {
            test.ok(resPromise.isFulfilled());
            test.strictEqual(resPromise.valueOf(), 'ok');
            test.done();
        }, 40);
        resolver.resolve('ok');
    },

    'resulting promise should be immediately rejected' : function(test) {
        var resolver = Vow.resolver(),
            resPromise = resolver.promise().delay(30);

        setTimeout(function() {
            test.ok(resPromise.isRejected());
            test.strictEqual(resPromise.valueOf(), 'error');
            test.done();
        }, 10);

        resolver.reject('error');
    }
};