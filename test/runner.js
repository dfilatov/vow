require('nodeunit').reporters.default.run(['test/vow.js'], null, function(err) {
    err?
        process.exit(1) :
        require('promises-aplus-tests')(require('./aplus-adapter'), function(err) {
            err && process.exit(1);
        });
});