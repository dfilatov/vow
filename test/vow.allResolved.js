module.exports = {
    'for Array' : {
        'resulting promise should be fulfilled after all promises fulfilled or rejected' : function(test) {
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

            Vow.allResolved(promises).then(function(_promises) {
                test.deepEqual(_promises, promises);
                _promises.forEach(function(promise, i) {
                    test.ok(i % 2? promise.isFulfilled() : promise.isRejected());
                });
                test.done();
            });

            defers.forEach(function(promise, i) {
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
            var defers = {},
                promises = {
                    a : Vow.promise(function(defer) {
                        defers.a = defer;
                    }),
                    b : Vow.promise(function(defer) {
                        defers.b = defer;
                    }),
                    c : Vow.promise(function(defer) {
                        defers.c = defer;
                    })
                };

            Vow.allResolved(promises).then(function(_promises) {
                test.deepEqual(_promises, promises);
                Object.keys(_promises).forEach(function(key, i) {
                    test.ok(i % 2? _promises[key].isFulfilled() : _promises[key].isRejected());
                });
                test.done();
            });

            Object.keys(defers).forEach(function(key, i) {
                i % 2? defers[key].fulfill() : defers[key].reject();
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
