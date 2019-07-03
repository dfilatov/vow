var defersToPromises = require('./utils/helpers').defersToPromises;

module.exports = {
    'for Array' : {
        'resulting promise should be fulfilled after all promises fulfilled or rejected' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()];

            Vow.allSettled(defersToPromises(defers)).then(function(res) {
                test.deepEqual(
                    res,
                    [
                        { status : 'fulfilled', value : 'ok0' },
                        { status : 'rejected', reason : 'err1' },
                        { status : 'fulfilled', value : 'ok2' }
                    ]);
                test.done();
            });

            defers.forEach(function(promise, i) {
                i % 2? promise.reject('err' + i) : promise.resolve('ok' + i);
            });
        },

        'resulting promise should be fulfilled if argument is empty array' : function(test) {
            Vow.allSettled([]).then(function(vals) {
                test.deepEqual(vals, []);
                test.done();
            });
        },

        'resulting defer should be notified if argument if any defer notified' : function(test) {
            var defers = [Vow.defer(), Vow.defer(), Vow.defer()],
                i = 0;

            Vow.allSettled(defersToPromises(defers)).progress(function(val) {
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

            Vow.allSettled(defersToPromises(defers)).then(function(res) {
                test.deepEqual(
                    res,
                    {
                        a : { status : 'fulfilled', value : 'oka' },
                        b : { status : 'rejected', reason : 'errb' },
                        c : { status : 'fulfilled', value : 'okc' }
                    });
                test.done();
            });

            Object.keys(defers).forEach(function(key, i) {
                i % 2? defers[key].reject('err' + key) : defers[key].resolve('ok' + key);
            });
        },

        'resulting promise should be fulfilled if argument is empty object' : function(test) {
            Vow.allSettled({}).then(function(vals) {
                test.deepEqual(vals, {});
                test.done();
            });
        }
    }
};
