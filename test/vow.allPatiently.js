var defersToPromises = require('./utils/helpers').defersToPromises;

module.exports = {
    'for Array' : {
        'resulting promise should be resolved after all promises resolved' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()];

            Vow.allPatiently(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2]);
                test.done();
            });

            defers.forEach(function(defer, i) {
                defer.resolve(i);
            });
        },

        'resulting promise should be rejected if any promise rejected' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()],
                error1 = new Error('error1'),
                error2 = new Error('error2');

            Vow.allPatiently(defersToPromises(defers)).then(null, function(errors) {
                test.deepEqual(errors, [error1, error2]);
                test.done();
            });

            defers[0].reject(error1);
            defers[1].resolve('ok');
            defers[2].reject(error2);
        },

        'resulting promise should be resolved if argument is empty array' : function(test) {
            Vow.allPatiently([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'arguments can contain non-promise items' : function(test) {
            var defers = [0, Vow.defer(), Vow.defer(), 3, undefined];

            Vow.allPatiently(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2, 3, undefined]);
                test.done();
            });

            defers[1].resolve(1);
            defers[2].resolve(2);
        }
    },

    'for Object' : {
        'resulting promise should be resolved after all promises resolved' : function(test) {
            var defers = {
                    a : Vow.defer(),
                    b : Vow.defer(),
                    c : Vow.defer()
                };

            Vow.allPatiently(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 'b', c :'c' });
                test.done();
            });

            Object.keys(defers).forEach(function(key) {
                defers[key].resolve(key);
            });
        },

        'resulting promise should be rejected if any promise rejected' : function(test) {
                var defers = {
                        a : Vow.defer(),
                        b : Vow.defer(),
                        c : Vow.defer()
                    },
                errorB = new Error('errorB'),
                errorC = new Error('errorC');

            Vow.allPatiently(defersToPromises(defers)).fail(function(errors) {
                test.deepEqual(errors, { b : errorB, c : errorC });
                test.done();
            });

            defers.a.resolve('ok');
            defers.b.reject(errorB);
            defers.c.reject(errorC);
        },

        'resulting promise should be resolved if argument is empty object' : function(test) {
            Vow.allPatiently({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        },

        'object properties can contains non-promise items' : function(test) {
            var defers = {
                    a : 'a',
                    b : Vow.defer(),
                    c : Vow.defer(),
                    d : 3,
                    e : undefined
                };

            Vow.allPatiently(defersToPromises(defers)).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 1, c : 2, d : 3, e : undefined });
                test.done();
            });

            defers.b.resolve(1);
            defers.c.resolve(2);
        }
    }
};