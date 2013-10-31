var Vow = require('../..');

module.exports = {
    resolved : function(val) {
        var promise = Vow.promise();
        promise.resolve(val);
        return promise;
    },

    rejected : function(reason) {
        var promise = Vow.promise();
        promise.reject(reason);
        return promise;  
    },

    deferred : function() {
        var promise = Vow.promise();
        return {
            promise : promise,
            
            resolve : function(val) {
                promise.resolve(val);
            },

            reject : function(reason) {
                promise.reject(reason);
            }
        };
    }
};