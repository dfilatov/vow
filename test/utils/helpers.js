module.exports = {
    resolversToPromises : function(resolvers) {
        if(Array.isArray(resolvers)) {
            return resolvers.map(function(resolver) {
                return resolver instanceof Vow.Resolver?
                    resolver.promise() :
                    resolver;
            });
        }

        var res = {};
        Object.keys(resolvers).forEach(function(key) {
            res[key] = resolvers[key] instanceof Vow.Resolver?
                resolvers[key].promise() :
                resolvers[key];
        });
        return res;
    }
};