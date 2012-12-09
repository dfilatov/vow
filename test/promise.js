var Promise = require('../lib/promise');

module.exports = {
	'onresolved callbacks should be called on resolve only' : function(test) {
		var promise = Promise(),
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

		promise.resolve();

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

    'onRejected callbacks should be called on reject only' : function(test) {
		var promise = Promise(),
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

    'onresolved callbacks should be called once' : function(test) {
        var promise = Promise(),
            calledCnt = 0;

        promise.then(function() {
            calledCnt++;
        });

        promise.resolve();
        promise.resolve();

        promise.then(function() {
            test.strictEqual(calledCnt, 1);
            test.done();
        });
    },

    'onRejected callbacks should be called once' : function(test) {
        var promise = Promise(),
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

    'onresolved callbacks shouldn\'t be called if resolve have been called after reject' : function(test) {
        var promise = Promise(),
            called = false;

        promise.then(function() {
            called = true;
        });

        promise.reject();
        promise.resolve();

        promise.then(null, function() {
            test.ok(!called);
            test.done();
        });
    },

    'onRejected callbacks shouldn\'t be called if reject hav been called after resolve' : function(test) {
        var promise = Promise(),
            called = false;

        promise.then(null, function() {
            called = true;
        });

        promise.resolve();
        promise.reject();

        promise.then(function() {
            test.ok(!called);
            test.done();
        });
    },

    'onresolved callbacks should be executed in the order of their originating calls to then' : function(test) {
        var promise = Promise(),
            resOrder = [];

        promise.then(function() {
            resOrder.push(1);
        });

        promise.then(function() {
            resOrder.push(2);
        });

        promise.resolve();

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

    'onRejected callbacks should be executed in the order of their originating calls to then' : function(test) {
        var promise = Promise(),
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

    'onresolved callback shouldn\'t be called in the same turn of the event loop as the call to then' : function(test) {
        var promise = Promise(),
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
        promise.resolve();

        setTimeout(function() {
            test.deepEqual(resOrder, [1, 2, 3, 4, 5, 6, 7, 8]);
            test.done();
        }, 20);
    },

    'onRejected callback shouldn\'t be called in the same turn of the event loop as the call to then' : function(test) {
        var promise = Promise(),
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
    },

    'resulting promise should be resolved with same value' : function(test) {
        var promise = Promise();

        promise.then().then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        promise.resolve('val');
    },

    'resulting promise should be rejected with same reason' : function(test) {
        var promise = Promise(),
            error = new Error('errot');

        promise.then().then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });

        promise.reject(error);
    },

    'resulting promise should be resolved with returned value of resolved callback' : function(test) {
        var promise = Promise(),
            resPromise = promise.then(function() {
                return 'val';
            });

        promise.resolve();

        resPromise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

	'resulting promise should be resolved with same value as returned promise of resolved callback' : function(test) {
		var promise = Promise(),
			retPromise = Promise(),
			resPromise = promise.then(function() {				
				return retPromise;
			});

		promise.then(function() {
			retPromise.resolve('ok');
		});

		resPromise.then(function(val) {
			test.strictEqual(val, 'ok');
			test.done();
		});

		promise.resolve();
	},

    'resulting promise should be rejected with same value as returned promise of rejected callback' : function(test) {
		var promise = Promise(),
			retPromise = Promise(),
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

		promise.resolve();
	},

    'resulting promise should be rejected if resolved callback throw exception' : function(test) {
        var promise = Promise(),
			resPromise = promise.then(function() {
			    throw { message : 'error' };
		    });

		resPromise.then(null, function(arg) {
			test.deepEqual(arg, { message : 'error' });
			test.done();
		});

		promise.resolve();
    },

    'resulting promise should be rejected if rejected callback throw exception' : function(test) {
        var promise = Promise(),
			resPromise = promise.then(null, function() {
			    throw { message : 'error' };
		    });

		resPromise.then(null, function(arg) {
			test.deepEqual(arg, { message : 'error' });
			test.done();
		});

		promise.reject();
    },

    'resulting promise should be resolved after all promises resolved or rejected' : function(test) {
        var promises = [Promise(), Promise(), Promise()];

        Promise.all(promises).then(function(_promises) {
            test.deepEqual(_promises, promises);
            _promises.forEach(function(promise, i) {
                test.ok(i % 2? promise.isResolved() : promise.isRejected());
            });
            test.done();
        });

        promises.forEach(function(promise, i) {
            i % 2?
                promise.resolve() :
                promise.reject();
        });
    },

    'resulting promise should be rejected after timeout' : function(test) {
        var promise = Promise.timeout(Promise(), 10);
        setTimeout(function() {
            test.ok(promise.isRejected());
            test.deepEqual(promise.valueOf(), new Error('timed out'));
            test.done();
        }, 20);
    },

    'resulting promise should be resolved before timeout' : function(test) {
        var origPromise = Promise(),
            resPromise = Promise.timeout(origPromise, 20);

        setTimeout(function() {
            origPromise.resolve('val');
        }, 10);

        resPromise.then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });
    },

    'resulting promise should be rejected before timeout' : function(test) {
        var origPromise = Promise(),
            resPromise = Promise.timeout(origPromise, 20),
            error = new Error('error');

        setTimeout(function() {
            origPromise.reject(error);
        }, 10);

        resPromise.then(null, function(_error) {
            test.strictEqual(_error, error);
            test.done();
        });
    }
};