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

            Vow.allPatiently(promises).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2]);
                test.done();
            });

            resolvers.forEach(function(promise, i) {
                promise.fulfill(i);
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
                error1 = new Error('error1'),
                error2 = new Error('error2');

            Vow.allPatiently(promises).then(null, function(errors) {
                test.deepEqual(errors, [error1, error2]);
                test.done();
            });

            resolvers[0].reject(error1);
            resolvers[1].fulfill('ok');
            resolvers[2].reject(error2);
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.allPatiently([]).then(function(vals) {
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

            Vow.allPatiently(promises).then(function(vals) {
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

            Vow.allPatiently(promises).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 'b', c :'c' });
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
                errorB = new Error('errorB'),
                errorC = new Error('errorC');

            Vow.allPatiently(promises).fail(function(errors) {
                test.deepEqual(errors, { b : errorB, c : errorC });
                test.done();
            });

            resolvers.a.fulfill('ok');
            resolvers.b.reject(errorB);
            resolvers.c.reject(errorC);
        },

        'resulting promise should be fulfilled if argument is empty object' : function(test) {
            Vow.allPatiently({}).then(function(vals) {
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

            Vow.allPatiently(promises).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 1, c : 2, d : 3, e : undefined });
                test.done();
            });

            resolvers.b.fulfill(1);
            resolvers.c.fulfill(2);
        }
    }
};