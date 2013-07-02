module.exports = {
    'resulting promise should be fulfilled after any item fulfilled' : function(test) {
        var resolvers = [],
            promises = [
                Vow.promise(function(resolver) {
                    resolvers.push(resolver);
                }),
                Vow.promise(function(resolver) {
                    resolvers.push(resolver);
                }),
                Vow.promise(function(resolver) {
                    resolvers.push(resolver);
                })
            ];

        Vow.any(promises).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        resolvers[2].reject('val');
        resolvers[1].fulfill('val');
    },

    'resulting promise should be rejected after all items rejected' : function(test) {
        var resolvers = [],
            promises = [
                Vow.promise(function(resolver) {
                    resolvers.push(resolver);
                }),
                Vow.promise(function(resolver) {
                    resolvers.push(resolver);
                }),
                Vow.promise(function(resolver) {
                    resolvers.push(resolver);
                })
            ];

        Vow.any(promises).then(null, function(error) {
            test.strictEqual(error, 'error2');
            test.done();
        });

        resolvers[2].reject('error2');
        resolvers[0].reject('error0');
        resolvers[1].reject('error1');
    },

    'resulting promise should be rejected if argument is empty array' : function(test) {
        Vow.any([]).then(null, function() {
            test.done();
        });
    }
};