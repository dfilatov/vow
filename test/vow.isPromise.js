module.exports = {
    'should be true if argument is promise' : function(test) {
        test.ok(Vow.isPromise(new Vow.Promise()));
        test.done();
    },

    'should be true if argument is thenable object' : function(test) {
        test.ok(Vow.isPromise({ then : function() { } }));
        test.done();
    },

    'should be false if argument is non-promise' : function(test) {
        test.ok(!Vow.isPromise(undefined));
        test.ok(!Vow.isPromise('val'));
        test.ok(!Vow.isPromise(5));
        test.ok(!Vow.isPromise(true));
        test.ok(!Vow.isPromise({}));
        test.ok(!Vow.isPromise(null));
        test.ok(!Vow.isPromise(function() {}));
        test.done();
    }
};