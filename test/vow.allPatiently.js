module.exports = {
    'for Array' : {
        'resulting promise should be fulfilled after all promises fulfilled' : function(test) {
            var promises = [Vow.promise(), Vow.promise(), Vow.promise()];

            Vow.allPatiently(promises).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2]);
                test.done();
            });

            promises.forEach(function(promise, i) {
                promise.fulfill(i);
            });
        },

        'resulting promise should be rejected if any promise rejected' : function(test) {
            var promises = [Vow.promise(), Vow.promise(), Vow.promise()],
                error1 = new Error('error1'),
                error2 = new Error('error2');

            Vow.allPatiently(promises).then(null, function(errors) {
                test.deepEqual(errors, [error1, error2]);
                test.done();
            });

            promises[0].reject(error1);
            promises[1].fulfill('ok');
            promises[2].reject(error2);
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.allPatiently([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'arguments can contains non-promise items' : function(test) {
            var promises = [0, Vow.promise(), Vow.promise(), 3, undefined];

            Vow.allPatiently(promises).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2, 3, undefined]);
                test.done();
            });

            promises[1].fulfill(1);
            promises[2].fulfill(2);
        }
    },

    'for Object' : {
        'resulting promise should be fulfilled after all promises fulfilled' : function(test) {
            var promises = { a : Vow.promise(), b : Vow.promise(), c : Vow.promise() };

            Vow.allPatiently(promises).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 'b', c :'c' });
                test.done();
            });

            Object.keys(promises).forEach(function(key) {
                promises[key].fulfill(key);
            });
        },

        'resulting promise should be rejected if any promise rejected' : function(test) {
            var promises = { a : Vow.promise(), b : Vow.promise(), c : Vow.promise() },
                errorB = new Error('errorB'),
                errorC = new Error('errorC');

            Vow.allPatiently(promises).fail(function(errors) {
                test.deepEqual(errors, { b : errorB, c : errorC });
                test.done();
            });

            promises.a.fulfill('ok');
            promises.b.reject(errorB);
            promises.c.reject(errorC);
        },

        'resulting promise should be fulfilled if argument is empty object' : function(test) {
            Vow.allPatiently({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        },

        'object properties can contains non-promise items' : function(test) {
            var promises = { a : 'a', b : Vow.promise(), c : Vow.promise(), d : 3, e : undefined };

            Vow.allPatiently(promises).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 1, c : 2, d : 3, e : undefined });
                test.done();
            });

            promises.b.fulfill(1);
            promises.c.fulfill(2);
        }
    }
};