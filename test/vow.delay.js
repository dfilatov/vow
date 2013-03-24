module.exports = {
    'resulting promise should be fulfilled with first argument if argument is not a promise' : function(test) {
        var resPromise = Vow.delay('ok', 10);
        setTimeout(function() {
            test.ok(resPromise.isFulfilled());
            test.ok(resPromise.valueOf('ok'));
            test.done();
        }, 20);
    }
};