module.exports = {
    'for Array' : {
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

    'for Object' : {
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
    }
};