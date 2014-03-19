var defersToPromises = require('./utils/helpers').defersToPromises;

module.exports = {
    'resulting promise should be fulfilled after any item fulfilled' : function(test) {
        var defers = [Vow.defer(), Vow.defer(), Vow.defer()];

        Vow.anyResolved(defersToPromises(defers)).then(function(val) {
            test.strictEqual(val, 'val');
            test.done();
        });

        defers[1].resolve('val');
    },

    'resulting promise should be rejected after the first item is rejected' : function(test) {
        var defers = [Vow.defer(), Vow.defer(), Vow.defer()];

        Vow.anyResolved(defersToPromises(defers)).then(null, function(error) {
            test.strictEqual(error, 'error');
            test.done();
        });

        defers[1].reject('error');
    },

    'resulting promise should be rejected if argument is empty array' : function(test) {
        Vow.anyResolved([]).then(null, function() {
            test.done();
        });
    },

    'resulting defer should be notified if argument if any defer notified' : function(test) {
        var defers = [Vow.defer(), Vow.defer(), Vow.defer()],
            i = 0;

        Vow.anyResolved(defersToPromises(defers)).progress(function(val) {
            test.equal(val, i);
            (++i === defers.length) && test.done();
        });

        defers.forEach(function(defer, i) {
            defer.notify(i);
        });
    }
};
