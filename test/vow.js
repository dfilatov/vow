var Vow = require('..');

module.exports = {
    'promise.always' : {
        'onResolved callback should be called on fulfill' : function(test) {
            var promise = Vow.promise();
            promise.fulfill('ok');
            promise.always(function(promise) {
                test.ok(promise.isFulfilled());
                test.strictEqual(promise.valueOf(), 'ok');
                test.done();
            });
        },

        'onResolved callback should be called on reject' : function(test) {
            var promise = Vow.promise();
            promise.reject('error');
            promise.always(function(promise) {
                test.ok(promise.isRejected());
                test.strictEqual(promise.valueOf(), 'error');
                test.done();
            });
        }
    },

    'promise.spread' : {
        'onFulfilled argument should be spreaded' : function(test) {
            var promise = Vow.promise();
            promise.spread(function(arg1, arg2, arg3) {
                test.strictEqual(arguments.length, 3);
                test.strictEqual(arg1, 1);
                test.strictEqual(arg2, '2');
                test.strictEqual(arg3, true);
                test.done();
            });
            promise.fulfill([1, '2', true]);
        }
    },

    'promise.done' : {
        'exception should be throwed' : function(test) {
            var promise = Vow.promise(),
                e = Error();

            promise.done();
            promise.reject(e);

            process.once('uncaughtException', function(_e) {
                test.strictEqual(_e, e);
                test.done();
            });
        }
    },

    'promise.timeout' : {
        'resulting promise should be rejected after timeout' : function(test) {
            var resPromise = Vow.promise().timeout(10);
            setTimeout(function() {
                test.ok(resPromise.isRejected());
                test.deepEqual(resPromise.valueOf(), new Error('timed out'));
                test.done();
            }, 20);
        },

        'resulting promise should be fulfilled before timeout' : function(test) {
            var origPromise = Vow.promise(),
                resPromise = origPromise.timeout(20);

            setTimeout(function() {
                origPromise.fulfill('val');
            }, 10);

            resPromise.then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
        },

        'resulting promise should be rejected before timeout' : function(test) {
            var origPromise = Vow.promise(),
                resPromise = origPromise.timeout(20),
                error = new Error('error');

            setTimeout(function() {
                origPromise.reject(error);
            }, 10);

            resPromise.then(null, function(_error) {
                test.strictEqual(_error, error);
                test.done();
            });
        }
    },

    'promise.sync' : {
        'promise should be fulfilled when synced promise fulfilled' : function(test) {
            var promise = Vow.promise(),
                syncedWithPromise = Vow.promise();

            promise.sync(syncedWithPromise);

            promise.then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });

            syncedWithPromise.fulfill('val');
        },

        'promise should be rejected when synced promise fulfilled' : function(test) {
            var promise = Vow.promise(),
                syncedWithPromise = Vow.promise();

            promise.sync(syncedWithPromise);

            promise.fail(function(err) {
                test.strictEqual(err, 'err');
                test.done();
            });

            syncedWithPromise.reject('err');
        }
    },

    'Vow.when' : {
        'onFullfilled callback should be called when argument fulfilled' : function(test) {
            var promise = Vow.promise();

            Vow.when(promise, function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });

            promise.fulfill('val');
        },

        'onRejected callback should be called when argument rejected' : function(test) {
            var promise = Vow.promise();

            Vow.when(promise, null, function(error) {
                test.strictEqual(error, 'err');
                test.done();
            });

            promise.reject('err');
        },

        'onFulfilled callback should be called if argument is non-promise' : function(test) {
            Vow.when('val', function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
        }
    },

    'Vow.fail' : {
        'onRejected callback should be called when argument rejected' : function(test) {
            var promise = Vow.promise();

            Vow.fail(promise, function(error) {
                test.strictEqual(error, 'err');
                test.done();
            });

            promise.reject('err');
        }
    },

    'Vow.always' : {
        'onResolved callback should be called when argument fulfilled' : function(test) {
            var promise = Vow.promise();

            Vow.always(promise, function(val) {
                test.strictEqual(val, 'ok');
                test.done();
            });

            promise.fulfill('ok');
        },

        'onResolved callback should be called when argument rejected' : function(test) {
            var promise = Vow.promise();

            Vow.always(promise, function(error) {
                test.strictEqual(error, 'err');
                test.done();
            });

            promise.reject('err');
        },

        'onResolved callback should be called when argument is non-promise' : function(test) {
            Vow.always('ok', function(val) {
                test.strictEqual(val, 'ok');
                test.done();
            });
        }
    },

    'Vow.spread' : {
        'onFulfilled argument should be spreaded' : function(test) {
            Vow.spread([1, '2', true], function(arg1, arg2, arg3) {
                test.strictEqual(arguments.length, 3);
                test.strictEqual(arg1, 1);
                test.strictEqual(arg2, '2');
                test.strictEqual(arg3, true);
                test.done();
            });
        }
    },

    'Vow.done' : {
        'exception should be throwed if argument is a promise' : function(test) {
            var promise = Vow.promise(),
                e = Error();

            promise.reject(e);
            Vow.done(promise);

            process.once('uncaughtException', function(_e) {
                test.strictEqual(_e, e);
                test.done();
            });
        },

        'nothing to be happen if argument is not a promise' : function(test) {
            Vow.done('val');
            test.done();
        }
    },

    'Vow.isFulfilled' : {
        'should return promise state if argument is promise' : function(test) {
            var pendingPromise = Vow.promise();
            test.ok(Vow.isFulfilled(pendingPromise) === pendingPromise.isFulfilled());

            var fulfilledPromise = Vow.promise('val');
            test.ok(Vow.isFulfilled(fulfilledPromise) === fulfilledPromise.isFulfilled());

            var rejectedPromise = Vow.promise();
            rejectedPromise.reject('error');
            test.ok(Vow.isFulfilled(rejectedPromise) === rejectedPromise.isFulfilled());

            test.done();
        },

        'should be true if argument is non-promise' : function(test) {
            test.ok(Vow.isFulfilled('val'))
            test.done();
        }
    },

    'Vow.isRejected' : {
        'should return promise state if argument is promise' : function(test) {
            var pendingPromise = Vow.promise();
            test.ok(Vow.isRejected(pendingPromise) === pendingPromise.isRejected());

            var fulfilledPromise = Vow.promise('val');
            test.ok(Vow.isRejected(fulfilledPromise) === fulfilledPromise.isRejected());

            var rejectedPromise = Vow.promise();
            rejectedPromise.reject('error');
            test.ok(Vow.isRejected(rejectedPromise) === rejectedPromise.isRejected());

            test.done();
        },

        'should be false if argument is non-promise' : function(test) {
            test.ok(!Vow.isRejected('val'));
            test.done();
        }
    },

    'Vow.isResolved' : {
        'should return promise state if argument is promise' : function(test) {
            var pendingPromise = Vow.promise();
            test.ok(Vow.isResolved(pendingPromise) === pendingPromise.isResolved());

            var fulfilledPromise = Vow.promise('val');
            test.ok(Vow.isResolved(fulfilledPromise) === fulfilledPromise.isResolved());

            var rejectedPromise = Vow.promise();
            rejectedPromise.reject('error');
            test.ok(Vow.isResolved(rejectedPromise) === rejectedPromise.isResolved());

            test.done();
        },

        'should be true if argument is non-promise' : function(test) {
            test.ok(Vow.isResolved('val'));
            test.done();
        }
    },

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

    'Vow.fulfill' : {
        'resulting promise should be fulfilled if argument is non-promise' : function(test) {
            Vow.fulfill('val').then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
        },

        'resulting promise should be fulfilled if argument is fulfilled' : function(test) {
            var promise = Vow.promise();

            Vow.fulfill(promise).then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });

            promise.fulfill('val');
        },

        'resulting promise should be fulfilled if argument is rejected' : function(test) {
            var promise = Vow.promise();

            Vow.fulfill(promise).then(function(val) {
                test.strictEqual(val, 'error');
                test.done();
            });

            promise.reject('error');
        }
    },

    'Vow.reject' : {
        'resulting promise should be rejected if argument is non-promise' : function(test) {
            Vow.reject('error').fail(function(error) {
                test.strictEqual(error, 'error');
                test.done();
            });
        },

        'resulting promise should be rejected if argument is rejected' : function(test) {
            var promise = Vow.promise();

            Vow.reject(promise).fail(function(error) {
                test.strictEqual(error, 'error');
                test.done();
            });

            promise.reject('error');
        },

        'resulting promise should be rejected if argument is fulfilled' : function(test) {
            var promise = Vow.promise();

            Vow.reject(promise).fail(function(error) {
                test.strictEqual(error, 'val');
                test.done();
            });

            promise.fulfill('val');
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
    },

    'Vow.timeout' : {
        'resulting promise should not be rejected if arguments is not a promise' : function(test) {
            var resPromise = Vow.timeout('a', 10);
            setTimeout(function() {
                test.ok(!resPromise.isRejected());
                test.done();
            }, 20);
        }
    }
};