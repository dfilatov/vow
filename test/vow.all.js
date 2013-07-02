module.exports = {
    'for Array' : {
        'resulting promise should be fulfilled after all promises fulfilled' : function(test) {
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

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2]);
                test.done();
            });

            resolvers.forEach(function(resolver, i) {
                resolver.fulfill(i);
            });
        },

        'resulting promise should be rejected if any promise rejected' : function(test) {
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
                ],
                error = new Error('error');

            Vow.all(promises).then(null, function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            resolvers.forEach(function(resolver, i) {
                i % 2? resolver.fulfill() : resolver.reject(error);
            });
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.all([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'arguments can contains non-promise items' : function(test) {
            var resolvers = [],
                promises = [
                    0,
                    Vow.promise(function(resolver) {
                        resolvers.push(resolver);
                    }),
                    Vow.promise(function(resolver) {
                        resolvers.push(resolver);
                    }),
                    3,
                    undefined
                ];

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2, 3, undefined]);
                test.done();
            });

            resolvers[0].fulfill(1);
            resolvers[1].fulfill(2);
        }
    },

    'for Object' : {
        'resulting promise should be fulfilled after all promises fulfilled' : function(test) {
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

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b :'b', c :'c' });
                test.done();
            });

            Object.keys(resolvers).forEach(function(key) {
                resolvers[key].fulfill(key);
            });
        },

        'resulting promise should be rejected if any promise rejected' : function(test) {
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
                },
                error = new Error('error');

            Vow.all(promises).fail(function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            Object.keys(resolvers).forEach(function(key, i) {
                var resolver = resolvers[key];
                i % 2? resolver.fulfill() : resolver.reject(error);
            });
        },

        'resulting promise should be fulfilled if argument is empty object' : function(test) {
            Vow.all({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        },

        'object properties can contains non-promise items' : function(test) {
            var resolvers = {},
                promises = {
                    a : 'a',
                    b : Vow.promise(function(resolver) {
                        resolvers.b = resolver;
                    }),
                    c : Vow.promise(function(resolver) {
                        resolvers.c = resolver;
                    }),
                    d : 3,
                    e : undefined
                };

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 1, c : 2, d : 3, e : undefined});
                test.done();
            });

            resolvers.b.fulfill(1);
            resolvers.c.fulfill(2);
        }
    }
};