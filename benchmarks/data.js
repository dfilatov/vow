var res = {};

['A', 'B', 'C'].forEach(function(key) {
    res[key] = [];
    for(var i = 0; i < 100; i++) {
        res[key].push(key + i);
    }
});

module.exports = res;
