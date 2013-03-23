module.exports = {
    'resulting promise should be fulfilled with first argument if argument is not a promise' : function(test) {
        var resPromise = Vow.delay('a', 10, 'b');
        setTimeout(function() {
            test.ok(resPromise.isFulfilled());
            test.ok(resPromise.valueOf('a'));
            test.done();
        }, 20);
    },

    'resulting promise should be fulfilled with fullfilledValue if argument is a promise' : function(test) {
        var resPromise = Vow.delay(Vow.promise(), 10, 'b');
        setTimeout(function() {
            test.ok(resPromise.isFulfilled());
            test.ok(resPromise.valueOf('b'));
            test.done();
        }, 20);
    },

    'original promise should not be fulfilled if argument is a promise' : function(test) {
        var origPromise = Vow.promise();
        Vow.delay(origPromise, 10, 'b');
        setTimeout(function() {
            test.ok(!origPromise.isFulfilled());
            test.done();
        }, 20);
    }
};