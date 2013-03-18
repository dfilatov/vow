module.exports = {
    'promise should be immediately fulfilled with argument value' : function(test) {
        var promise = Vow.promise('val');
        promise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    }
};