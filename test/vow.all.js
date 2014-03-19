var defersToPromises = require('./utils/helpers').defersToPromises;

module.exports = {
    'for Array' : {
        'resulting defer should be fulfilled after all defers fulfilled' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()];

            Vow.all(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2]);
                test.done();
            });

            defers.forEach(function(defer, i) {
                defer.resolve(i);
            });
        },

        'resulting defer should be rejected if any defer rejected' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()],
                error = new Error('error');

            Vow.all(defersToPromises(defers)).then(null, function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            defers.forEach(function(defer, i) {
                i % 2? defer.resolve() : defer.reject(error);
            });
        },

        'resulting defer should be fulfilled if argument is empty array' : function(test) {
            Vow.all([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'resulting defer should be notified if argument if any defer notified' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()],
                i = 0;

            Vow.all(defersToPromises(defers)).progress(function(val) {
                test.equal(val, i);
                (++i === defers.length) && test.done();
            });

            defers.forEach(function(defer, i) {
                defer.notify(i);
            });
        },

        'arguments can contains non-defer items' : function(test) {
            var defers = [0, Vow.defer(), Vow.defer(), 3, undefined];

            Vow.all(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2, 3, undefined]);
                test.done();
            });

            defers[1].resolve(1);
            defers[2].resolve(2);
        }
    },

    'for Object' : {
        'resulting defer should be fulfilled after all defers fulfilled' : function(test) {
            var defers = { a : Vow.defer(), b : Vow.defer(), c :Vow.defer() };

            Vow.all(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b :'b', c :'c' });
                test.done();
            });

            Object.keys(defers).forEach(function(key) {
                defers[key].resolve(key);
            });
        },

        'resulting defer should be rejected if any defer rejected' : function(test) {
            var defers = { a : Vow.defer(), b : Vow.defer(), c : Vow.defer() },
                error = new Error('error');

            Vow.all(defersToPromises(defers)).fail(function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            Object.keys(defers).forEach(function(key, i) {
                var p = defers[key];
                i % 2? p.resolve() : p.reject(error);
            });
        },

        'resulting defer should be fulfilled if argument is empty object' : function(test) {
            Vow.all({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        },

        'object properties can contains non-defer items' : function(test) {
            var defers = { a : 'a', b : Vow.defer(), c : Vow.defer(), d : 3, e : undefined };

            Vow.all(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 1, c : 2, d : 3, e : undefined});
                test.done();
            });

            defers.b.resolve(1);
            defers.c.resolve(2);
        }
    }
};
