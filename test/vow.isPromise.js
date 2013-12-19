module.exports = {
    'should be true if argument is promise' : function(test) {
        test.ok(Vow.isPromise(new Vow.Promise()));
        test.done();
    },

    'should be false if argument is non-promise' : function(test) {
        test.ok(!Vow.isPromise('val'));
        test.done();
    }
};