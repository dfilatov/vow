module.exports = {
    'should return given value if value is a promise-like object' : function(test) {
        var promise = Vow.defer().promise();
        test.strictEqual(Vow.cast(promise), promise);
        test.done();
    },

    'should return new promise if givena value is not a promise-like object' : function(test) {
        test.ok(Vow.isPromise(Vow.cast(undefined)));
        test.ok(Vow.isPromise(Vow.cast('val')));
        test.ok(Vow.isPromise(Vow.cast(5)));
        test.ok(Vow.isPromise(Vow.cast(true)));
        test.ok(Vow.isPromise(Vow.cast({})));
        test.ok(Vow.isPromise(Vow.cast(null)));
        test.ok(Vow.isPromise(Vow.cast(function() {})));
        test.done();
    }
};