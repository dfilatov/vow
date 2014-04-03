module.exports = {
    'function should be called without arguments' : function(test) {
        Vow.invoke(function() {
            test.strictEqual(arguments.length, 0);
            test.done();
        });
    },

    'function should be called with passed arguments' : function(test) {
        Vow.invoke(function(arg1, arg2, arg3) {
            test.strictEqual(arg1, 1);
            test.strictEqual(arg2, '2');
            test.strictEqual(arg3, true);
            test.done();
        }, 1, '2', true);
    },

    'resulting promise should be fulfilled with function result' : function(test) {
        Vow.invoke(function() { return 'ok'; }).then(function(res) {
            test.strictEqual(res, 'ok');
            test.done();
        });
    },

    'resulting promise should be rejected if function throw exception' : function(test) {
        var err = Error();
        Vow.invoke(function() { throw err; }).fail(function(_err) {
            test.strictEqual(_err, err);
            test.done();
        });
    },

    'if function return promise then result should adopt it state' : function(test) {
        var defer = Vow.defer();
        Vow.invoke(function() { return defer.promise(); }).then(function(val) {
            test.strictEqual(val, 'ok');
            test.done();
        });
        defer.resolve('ok')
    }
};