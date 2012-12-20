var Vow = require('..');

module.exports = {
    'promise' : {
        'promise should be immediately fulfilled with argument value' : function(test) {
            var promise = Vow.promise('val');
            promise.then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
        }
    },
    'promise.fulfill' : {
        'onFulfilled callbacks should be called on fulfill only' : function(test) {
            var promise = Vow.promise(),
                called1 = false,
                called2 = false,
                called3 = false,
                called4 = false;

            promise.then(function() {
                called1 = true;
            });

            promise.then(null, function() {
                called2 = true;
            });

            promise.then(function() {
                called3 = true;
            });

            promise.fulfill();

            promise.then(function() {
                called4 = true;
            });

            promise.then(function() {
                test.ok(called1);
                test.ok(!called2);
                test.ok(called3);
                test.done();
            });
        },

        'onFulfilled callbacks should be called once' : function(test) {
            var promise = Vow.promise(),
                calledCnt = 0;

            promise.then(function() {
                calledCnt++;
            });

            promise.fulfill();
            promise.fulfill();

            promise.then(function() {
                test.strictEqual(calledCnt, 1);
                test.done();
            });
        },

        'onFulfilled callbacks shouldn\'t be called if fulfill have been called after reject' : function(test) {
            var promise = Vow.promise(),
                called = false;

            promise.then(function() {
                called = true;
            });

            promise.reject();
            promise.fulfill();

            promise.then(null, function() {
                test.ok(!called);
                test.done();
            });
        },

        'onFulfilled callbacks should be executed in the order of their originating calls to then' : function(test) {
            var promise = Vow.promise(),
                resOrder = [];

            promise.then(function() {
                resOrder.push(1);
            });

            promise.then(function() {
                resOrder.push(2);
            });

            promise.fulfill();

            promise.then(function() {
                resOrder.push(3);
            });

            promise.then(function() {
                resOrder.push(4);
            });

            setTimeout(function() {
                promise.then(function() {
                    resOrder.push(5);
                    setTimeout(function() {
                        test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6]);
                        test.done();
                    }, 10);
                });

                promise.then(function() {
                    resOrder.push(6);
                });
            }, 10);
        },

        'onFulfilled callback shouldn\'t be called in the same turn of the event loop as the call to then' : function(test) {
            var promise = Vow.promise(),
                resOrder = [];

            promise.then(function() {
                resOrder.push(3);
            });

            process.nextTick(function() {
                process.nextTick(function() {
                    resOrder.push(4);
                    process.nextTick(function() {
                        resOrder.push(7);
                    });
                    promise.then(function() {
                        resOrder.push(8);
                    });
                });

                promise.then(function() {
                    resOrder.push(5);
                });

                promise.then(function() {
                    resOrder.push(6);
                });

                resOrder.push(2);
            });

            resOrder.push(1);
            promise.fulfill();

            setTimeout(function() {
                test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6, 7, 8]);
                test.done();
            }, 20);
        }
    },

    'promise.reject' : {
        'onRejected callbacks should be called on reject only' : function(test) {
            var promise = Vow.promise(),
                called1 = false,
                called2 = false,
                called3 = false,
                called4 = false;

            promise.then(null, function() {
                called1 = true;
            });

            promise.then(function() {
                called2 = true;
            });

            promise.then(null, function() {
                called3 = true;
            });

            promise.reject();

            promise.then(null, function() {
                called4 = true;
            });

            promise.then(null, function() {
                test.ok(called1);
                test.ok(!called2);
                test.ok(called3);
                test.done();
            });
        },

        'onRejected callbacks should be called once' : function(test) {
            var promise = Vow.promise(),
                calledCnt = 0;

            promise.then(null, function() {
                calledCnt++;
            });

            promise.reject();
            promise.reject();

            promise.then(null, function() {
                test.strictEqual(calledCnt, 1);
                test.done();
            });
        },

        'onRejected callbacks shouldn\'t be called if reject have been called after fulfill' : function(test) {
            var promise = Vow.promise(),
                called = false;

            promise.then(null, function() {
                called = true;
            });

            promise.fulfill();
            promise.reject();

            promise.then(function() {
                test.ok(!called);
                test.done();
            });
        },

        'onRejected callbacks should be executed in the order of their originating calls to then' : function(test) {
            var promise = Vow.promise(),
                resOrder = [];

            promise.then(null, function() {
                resOrder.push(1);
            });

            promise.then(null, function() {
                resOrder.push(2);
            });

            promise.reject();

            promise.then(null, function() {
                resOrder.push(3);
            });

            promise.then(null, function() {
                resOrder.push(4);
            });

            setTimeout(function() {
                promise.then(null, function() {
                    resOrder.push(5);
                    setTimeout(function() {
                        test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6]);
                        test.done();
                    }, 10);
                });

                promise.then(null, function() {
                    resOrder.push(6);
                });
            }, 10);
        },

        'onRejected callback shouldn\'t be called in the same turn of the event loop as the call to then' : function(test) {
            var promise = Vow.promise(),
                resOrder = [];

            promise.then(null, function() {
                resOrder.push(3);
            });

            process.nextTick(function() {
                process.nextTick(function() {
                    resOrder.push(4);
                    process.nextTick(function() {
                        resOrder.push(7);
                    });
                    promise.then(null, function() {
                        resOrder.push(8);
                    });
                });

                promise.then(null, function() {
                    resOrder.push(5);
                });

                promise.then(null, function() {
                    resOrder.push(6);
                });

                resOrder.push(2);
            });

            resOrder.push(1);
            promise.reject();

            setTimeout(function() {
                test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6, 7, 8]);
                test.done();
            }, 20);
        }
    },

    'promise.then' : {
        'resulting promise should be fulfilled with same value' : function(test) {
            var promise = Vow.promise();

            promise.then().then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });

            promise.fulfill('val');
        },

        'resulting promise should be rejected with same reason' : function(test) {
            var promise = Vow.promise(),
                error = new Error('errot');

            promise.then().then(null, function(_error) {
                test.strictEqual(_error, error);
                test.done();
            });

            promise.reject(error);
        },

        'resulting promise should be fulfilled with returned value of onFulfilled callback' : function(test) {
            var promise = Vow.promise(),
                resPromise = promise.then(function() {
                    return 'val';
                });

            promise.fulfill();

            resPromise.then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
        },

        'resulting promise should be fulfilled with same value as returned promise of onFulfilled callback' : function(test) {
            var promise = Vow.promise(),
                retPromise = Vow.promise(),
                resPromise = promise.then(function() {
                    return retPromise;
                });

            promise.then(function() {
                retPromise.fulfill('ok');
            });

            resPromise.then(function(val) {
                test.strictEqual(val, 'ok');
                test.done();
            });

            promise.fulfill();
        },

        'resulting promise should be rejected with same value as returned promise of onRejected callback' : function(test) {
            var promise = Vow.promise(),
                retPromise = Vow.promise(),
                resPromise = promise.then(function() {
                    return retPromise;
                }),
                error = new Error('error');

            promise.then(function() {
                retPromise.reject(error);
            });

            resPromise.then(null, function(_error) {
                test.strictEqual(_error, error);
                test.done();
            });

            promise.fulfill();
        },

        'resulting promise should be rejected if onFulfilled callback throw exception' : function(test) {
            var promise = Vow.promise(),
                resPromise = promise.then(function() {
                    throw { message : 'error' };
                });

            resPromise.then(null, function(arg) {
                test.deepEqual(arg, { message : 'error' });
                test.done();
            });

            promise.fulfill();
        },

        'resulting promise should be rejected if onRejected callback throw exception' : function(test) {
            var promise = Vow.promise(),
                resPromise = promise.then(null, function() {
                    throw { message : 'error' };
                });

            resPromise.then(null, function(arg) {
                test.deepEqual(arg, { message : 'error' });
                test.done();
            });

            promise.reject();
        }
    },

    'promise.fail' : {
        'onRejected callback should be called on reject' : function(test) {
            var promise = Vow.promise();
            promise.reject('error');
            promise.fail(function(error) {
                test.strictEqual(error, 'error');
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

    'Vow.when' : {
        'onFullfilled callback should be called when argument fullfilled' : function(test) {
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

    'Vow.all' : {
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
            var promises = [Vow.promise(), 1, Vow.promise(), 3];

            Vow.all(promises).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2, 3]);
                test.done();
            });

            promises[0].fulfill(0);
            promises[2].fulfill(2);
        }
    },

    'Vow.allResolved' : {
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

        'resulting promise should be rejected after if argument is empty array' : function(test) {
            Vow.any([]).then(null, function() {
                test.done();
            });
        }
    },

    'Vow.timeout' : {
        'resulting promise should be rejected after timeout' : function(test) {
            var resPromise = Vow.timeout(Vow.promise(), 10);
            setTimeout(function() {
                test.ok(resPromise.isRejected());
                test.deepEqual(resPromise.valueOf(), new Error('timed out'));
                test.done();
            }, 20);
        },

        'resulting promise should be fulfilled before timeout' : function(test) {
            var origPromise = Vow.promise(),
                resPromise = Vow.timeout(origPromise, 20);

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
                resPromise = Vow.timeout(origPromise, 20),
                error = new Error('error');

            setTimeout(function() {
                origPromise.reject(error);
            }, 10);

            resPromise.then(null, function(_error) {
                test.strictEqual(_error, error);
                test.done();
            });
        }
    }
};