var Vow = require('../..');

module.exports = {
    resolved : function(val) {
        var resolver = Vow.resolver();

        resolver.resolve(val);
        return resolver.promise();
    },

    rejected : function(reason) {
        var resolver = Vow.resolver();

        resolver.reject(reason);
        return resolver.promise();
    },

    deferred : function() {
        var resolver = Vow.resolver();

        return {
            promise : resolver.promise(),
            
            resolve : function(val) {
                resolver.resolve(val);
            },

            reject : function(reason) {
                resolver.reject(reason);
            }
        };
    }
};