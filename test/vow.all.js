var resolversToPromises = require('./utils/helpers').resolversToPromises;

module.exports = {
    'for Array' : {
        'resulting resolver should be fulfilled after all resolvers fulfilled' : function(test) {
            var resolvers = [Vow.resolver(), Vow.resolver(), Vow.resolver()];

            Vow.all(resolversToPromises(resolvers)).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2]);
                test.done();
            });

            resolvers.forEach(function(resolver, i) {
                resolver.resolve(i);
            });
        },

        'resulting resolver should be rejected if any resolver rejected' : function(test) {
            var resolvers = [Vow.resolver(), Vow.resolver(), Vow.resolver()],
                error = new Error('error');

            Vow.all(resolversToPromises(resolvers)).then(null, function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            resolvers.forEach(function(resolver, i) {
                i % 2? resolver.resolve() : resolver.reject(error);
            });
        },

        'resulting resolver should be fulfilled if argument is empty array' : function(test) {
            Vow.all([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'arguments can contains non-resolver items' : function(test) {
            var resolvers = [0, Vow.resolver(), Vow.resolver(), 3, undefined];

            Vow.all(resolversToPromises(resolvers)).then(function(vals) {
                test.deepEqual(vals, [0, 1, 2, 3, undefined]);
                test.done();
            });

            resolvers[1].resolve(1);
            resolvers[2].resolve(2);
        }
    },

    'for Object' : {
        'resulting resolver should be fulfilled after all resolvers fulfilled' : function(test) {
            var resolvers = { a : Vow.resolver(), b : Vow.resolver(), c :Vow.resolver() };

            Vow.all(resolversToPromises(resolvers)).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b :'b', c :'c' });
                test.done();
            });

            Object.keys(resolvers).forEach(function(key) {
                resolvers[key].resolve(key);
            });
        },

        'resulting resolver should be rejected if any resolver rejected' : function(test) {
            var resolvers = { a : Vow.resolver(), b : Vow.resolver(), c : Vow.resolver() },
                error = new Error('error');

            Vow.all(resolversToPromises(resolvers)).fail(function(_error) {
                test.deepEqual(_error, error);
                test.done();
            });

            Object.keys(resolvers).forEach(function(key, i) {
                var p = resolvers[key];
                i % 2? p.resolve() : p.reject(error);
            });
        },

        'resulting resolver should be fulfilled if argument is empty object' : function(test) {
            Vow.all({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        },

        'object properties can contains non-resolver items' : function(test) {
            var resolvers = { a : 'a', b : Vow.resolver(), c : Vow.resolver(), d : 3, e : undefined };

            Vow.all(resolversToPromises(resolvers)).then(function(vals) {
                test.deepEqual(vals, { a : 'a', b : 1, c : 2, d : 3, e : undefined});
                test.done();
            });

            resolvers.b.resolve(1);
            resolvers.c.resolve(2);
        }
    }
};