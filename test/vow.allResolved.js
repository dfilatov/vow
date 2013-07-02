module.exports = {
    'for Array' : {
        'resulting promise should be fulfilled after all promises fulfilled or rejected' : function(test) {
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

            Vow.allResolved(promises).then(function(_promises) {
                test.deepEqual(_promises, promises);
                _promises.forEach(function(promise, i) {
                    test.ok(i % 2? promise.isFulfilled() : promise.isRejected());
                });
                test.done();
            });

            resolvers.forEach(function(promise, i) {
                i % 2? promise.fulfill() : promise.reject();
            });
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.allResolved([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        }
    },

    'for Object' : {
        'resulting promise should be fulfilled after all promises fulfilled or rejected' : function(test) {
            var resolvers = {},
                promises = {
                    a : Vow.promise(function(resolver) {
                        resolvers.a = resolver;
                    }),
                    b : Vow.promise(function(resolver) {
                        resolvers.b = resolver;
                    }),
                    c : Vow.promise(function(resolver) {
                        resolvers.c = resolver;
                    })
                };

            Vow.allResolved(promises).then(function(_promises) {
                test.deepEqual(_promises, promises);
                Object.keys(_promises).forEach(function(key, i) {
                    test.ok(i % 2? _promises[key].isFulfilled() : _promises[key].isRejected());
                });
                test.done();
            });

            Object.keys(resolvers).forEach(function(key, i) {
                i % 2? resolvers[key].fulfill() : resolvers[key].reject();
            });
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.allResolved({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        }
    }
};
