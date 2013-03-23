var Vow = require('..');

module.exports = {
    'Vow.isPromise' : {
        'should be true if argument is promise' : function(test) {
            test.ok(Vow.isPromise(Vow.promise()));
            test.done();
        },

        'should be false if argument is non-promise' : function(test) {
            test.ok(!Vow.isPromise('val'));
            test.done();
        }
    },

    'Vow.resolve' : {
        'resulting promise should be argument if it is promise' : function(test) {
            var promise = Vow.promise(),
                isFulfilled = promise.isFulfilled(),
                resPromise = Vow.resolve(promise);

            test.strictEqual(resPromise, promise);
            test.strictEqual(resPromise.isFulfilled(), isFulfilled);
            test.done();
        },

        'resulting promise should be fulfilled if argument is non-promise' : function(test) {
            var promise = Vow.resolve('val');

            promise.then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
        }
    },

    'Vow.all(array)' : {
        'resulting promise should be fulfilled after all promises fulfilled' : function(test) {
            var promises = [Vow.promise(), Vow.promise(), Vow.promise()];

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2]);
                test.done();
            });

            promises.forEach(function(promise, i) {
                promise.fulfill(i);
            });
        },

        'resulting promise should be rejected if any promise rejected' : function(test) {
            var promises = [Vow.promise(), Vow.promise(), Vow.promise()],
                error = new Error('error');

            Vow.all(promises).then(null, function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            promises.forEach(function(promise, i) {
                i % 2? promise.fulfill() : promise.reject(error);
            });
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.all([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'arguments can contains non-promise items' : function(test) {
            var promises = [0, Vow.promise(), Vow.promise(), 3, undefined];

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2, 3, undefined]);
                test.done();
            });

            promises[1].fulfill(1);
            promises[2].fulfill(2);
        }
    },

    'Vow.all(object)' : {
        'resulting promise should be fulfilled after all promises fulfilled' : function(test) {
            var promises = { a : Vow.promise(), b : Vow.promise(), c :Vow.promise() };

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, {a : 'a', b :'b', c :'c'});
                test.done();
            });

            Object.keys(promises).forEach(function(promise) {
                promises[promise].fulfill(promise);
            });
        },

        'resulting promise should be rejected if any promise rejected' : function(test) {
            var promises = { a : Vow.promise(), b : Vow.promise(), c :Vow.promise() },
                error = new Error('error');

            Vow.all(promises).fail(function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            Object.keys(promises).forEach(function(promise, i) {
                var p = promises[promise];
                i % 2? p.fulfill() : p.reject(error);
            });
        },

        'resulting promise should be fulfilled if argument is empty object' : function(test) {
            Vow.all({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        },

        'object properties can contains non-promise items' : function(test) {
            var promises = {a : 'a', b : Vow.promise(), c : Vow.promise(), d : 3, e : undefined};

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 1, c : 2, d : 3, e : undefined});
                test.done();
            });

            promises.b.fulfill(1);
            promises.c.fulfill(2);
        }
    },

    'Vow.allResolved(array)' : {
        'resulting promise should be fulfilled after all promises fulfilled or rejected' : function(test) {
            var promises = [Vow.promise(), Vow.promise(), Vow.promise()];

            Vow.allResolved(promises).then(function(_promises) {
                test.deepEqual(_promises, promises);
                _promises.forEach(function(promise, i) {
                    test.ok(i % 2? promise.isFulfilled() : promise.isRejected());
                });
                test.done();
            });

            promises.forEach(function(promise, i) {
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

    'Vow.allResolved(object)' : {
        'resulting promise should be fulfilled after all promises fulfilled or rejected' : function(test) {
            var promises = { a : Vow.promise(), b : Vow.promise(), c : Vow.promise() };

            Vow.allResolved(promises).then(function(_promises) {
                test.deepEqual(_promises, promises);
                Object.keys(_promises).forEach(function(key, i) {
                    test.ok(i % 2? _promises[key].isFulfilled() : _promises[key].isRejected());
                });
                test.done();
            });

            Object.keys(promises).forEach(function(key, i) {
                i % 2? promises[key].fulfill() : promises[key].reject();
            });
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.allResolved({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        }
    },

    'Vow.any' : {
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
    }
};