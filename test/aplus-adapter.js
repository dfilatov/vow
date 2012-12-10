var Promise = require('../lib/promise');

module.exports = {
    fulfilled : function(val) {
        var promise = Promise();
        promise.resolve(val);
        return promise;
    },

    rejected : function(reason) {
        var promise = Promise();
        promise.reject(reason);
        return promise;  
    },

    pending : function() {
        var promise = Promise();
        return {
            promise : promise,
            
            fulfill : function(val) {
                promise.resolve(val);
            },

            reject : function(reason) {
                promise.reject(reason);
            }
        };
    }
};