var Vow = require('../..');

module.exports = {
    resolved : function(val) {
        var resolver = Vow.resolver(),
            promise = Vow.promise(resolver);

        resolver.resolve(val);
        return promise;
    },

    rejected : function(reason) {
        var resolver = Vow.resolver(),
            promise = Vow.promise(resolver);

        resolver.reject(reason);
        return promise;  
    },

    deferred : function() {
        var resolver = Vow.resolver(),
            promise = Vow.promise(resolver);

        return {
            promise : promise,
            
            resolve : function(val) {
                resolver.resolve(val);
            },

            reject : function(reason) {
                resolver.reject(reason);
            }
        };
    }
};