var defersToPromises = require('./utils/helpers').defersToPromises;

module.exports = {
    'for Array' : {
        'resulting promise should be fulfilled after all promises fulfilled or rejected' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()];

            Vow.allResolved(defersToPromises(defers)).then(function(promises) {
                test.deepEqual(defersToPromises(defers), promises);
                promises.forEach(function(promise, i) {
                    test.ok(i % 2? promise.isFulfilled() : promise.isRejected());
                });
                test.done();
            });

            defers.forEach(function(promise, i) {
                i % 2? promise.resolve() : promise.reject();
            });
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.allResolved([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'resulting defer should be notified if argument if any defer notified' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()],
                i = 0;

            Vow.allResolved(defersToPromises(defers)).progress(function(val) {
                test.equal(val, i);
                (++i === defers.length) && test.done();
            });

            defers.forEach(function(defer, i) {
                defer.notify(i);
            });
        }
    },

    'for Object' : {
        'resulting promise should be fulfilled after all promises fulfilled or rejected' : function(test) {
            var defers = {
                    a : Vow.defer(),
                    b : Vow.defer(),
                    c : Vow.defer()
                };

            Vow.allResolved(defersToPromises(defers)).then(function(promises) {
                test.deepEqual(defersToPromises(defers), promises);
                Object.keys(promises).forEach(function(key, i) {
                    test.ok(i % 2? promises[key].isFulfilled() : promises[key].isRejected());
                });
                test.done();
            });

            Object.keys(defers).forEach(function(key, i) {
                i % 2? defers[key].resolve() : defers[key].reject();
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
