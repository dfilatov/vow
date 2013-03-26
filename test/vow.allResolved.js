module.exports = {
    'for Array' : {
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

    'for Object' : {
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
    }
};
