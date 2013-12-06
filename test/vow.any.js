module.exports = {
    'resulting promise should be fulfilled after any item fulfilled' : function(test) {
        var defers = [],
            promises = [
                Vow.promise(function(defer) {
                    defers.push(defer);
                }),
                Vow.promise(function(defer) {
                    defers.push(defer);
                }),
                Vow.promise(function(defer) {
                    defers.push(defer);
                })
            ];

        Vow.any(promises).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defers[2].reject('val');
        defers[1].fulfill('val');
    },

    'resulting promise should be rejected after all items rejected' : function(test) {
        var defers = [],
            promises = [
                Vow.promise(function(defer) {
                    defers.push(defer);
                }),
                Vow.promise(function(defer) {
                    defers.push(defer);
                }),
                Vow.promise(function(defer) {
                    defers.push(defer);
                })
            ];

        Vow.any(promises).then(null, function(error) {
            test.strictEqual(error, 'error2');
            test.done();
        });

        defers[2].reject('error2');
        defers[0].reject('error0');
        defers[1].reject('error1');
    },

    'resulting promise should be rejected if argument is empty array' : function(test) {
        Vow.any([]).then(null, function() {
            test.done();
        });
    }
};