module.exports = {
    'resulting promise should be fulfilled after any item fulfilled' : function(test) {
        var promises = [Vow.promise(), Vow.promise(), Vow.promise()];

        Vow.any(promises).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        promises[2].reject('val');
        promises[1].fulfill('val');
    },

    'resulting promise should be rejected after all items rejected' : function(test) {
        var promises = [Vow.promise(), Vow.promise(), Vow.promise()];

        Vow.any(promises).then(null, function(error) {
            test.strictEqual(error, 'error2');
            test.done();
        });

        promises[2].reject('error2');
        promises[0].reject('error0');
        promises[1].reject('error1');
    },

    'resulting promise should be rejected if argument is empty array' : function(test) {
        Vow.any([]).then(null, function() {
            test.done();
        });
    }
};