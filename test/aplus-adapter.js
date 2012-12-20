var Vow = require('..');

module.exports = {
    fulfilled : function(val) {
        var promise = Vow.promise();
        promise.fulfill(val);
        return promise;
    },

    rejected : function(reason) {
        var promise = Vow.promise();
        promise.reject(reason);
        return promise;  
    },

    pending : function() {
        var promise = Vow.promise();
        return {
            promise : promise,
            
            fulfill : function(val) {
                promise.fulfill(val);
            },

            reject : function(reason) {
                promise.reject(reason);
            }
        };
    }
};