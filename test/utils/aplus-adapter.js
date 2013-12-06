var Vow = require('../..');

module.exports = {
    resolved : function(val) {
        var defer = Vow.defer();
        defer.resolve(val);
        return defer.promise();
    },

    rejected : function(reason) {
        var defer = Vow.defer();
        defer.reject(reason);
        return defer.promise();
    },

    deferred : function() {
        var defer = Vow.defer();
        return {
            promise : defer.promise(),
            
            resolve : function(val) {
                defer.resolve(val);
            },

            reject : function(reason) {
                defer.reject(reason);
            }
        };
    }
};