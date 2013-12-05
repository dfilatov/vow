module.exports = {
    'onFulfilled argument should be spreaded' : function(test) {
        var resolver = Vow.resolver();
        resolver.promise().spread(function(arg1, arg2, arg3) {
            test.strictEqual(arguments.length, 3);
            test.strictEqual(arg1, 1);
            test.strictEqual(arg2, '2');
            test.strictEqual(arg3, true);
            test.done();
        });
        resolver.resolve([1, '2', true]);
    }
};
