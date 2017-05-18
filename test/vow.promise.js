module.exports = {
    'promise should be fulfilled with passed value' : function(test) {
        new Vow
            .Promise(function(resolve) {
                resolve('val');
            })
            .then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
    },

    'promise should be rejected with passed value' : function(test) {
        new Vow
            .Promise(function(_, reject) {
                reject('error');
            })
            .fail(function(val) {
                test.strictEqual(val, 'error');
                test.done();
            });
    },

    'promise should be rejected if an error is thrown in the resolver function' : function(test) {
        var _error = new Error();
        new Vow
            .Promise(function() {
                throw _error;
            })
            .fail(function(error) {
                test.strictEqual(error, _error);
                test.done();
            });
    },

    'promise should be notified with passed value' : function(test) {
        var _notify;
        new Vow
            .Promise(function(_, _, notify) {
                _notify = notify;
            })
            .progress(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
        _notify('val');
    }
};