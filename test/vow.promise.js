module.exports = {
    'promise should be fulfilled with passed value' : function(test) {
        Vow
            .promise(function(resolve) {
                resolve('val');
            })
            .then(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
    },

    'promise should be rejected with passed value' : function(test) {
        Vow
            .promise(function(_, reject) {
                reject('error');
            })
            .fail(function(val) {
                test.strictEqual(val, 'error');
                test.done();
            });
    },

    'promise should be notified with passed value' : function(test) {
        var _notify;
        Vow
            .promise(function(_, _, notify) {
                _notify = notify;
            })
            .progress(function(val) {
                test.strictEqual(val, 'val');
                test.done();
            });
        _notify('val');
    }
};