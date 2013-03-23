module.exports = {
    'resulting promise should not be rejected if argument is not a promise' : function(test) {
        var resPromise = Vow.timeout('a', 10);
        setTimeout(function() {
            test.ok(!resPromise.isRejected());
            test.done();
        }, 20);
    }
};