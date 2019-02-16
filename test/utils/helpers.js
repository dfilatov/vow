module.exports = {
    defersToPromises : function(defers) {
        if(Array.isArray(defers)) {
            return defers.map(function(defer) {
                return defer instanceof Vow.Deferred?
                    defer.promise() :
                    defer;
            });
        }

        var res = {};
        Object.keys(defers).forEach(function(key) {
            res[key] = defers[key] instanceof Vow.Deferred?
                defers[key].promise() :
                defers[key];
        });
        return res;
    }
};
