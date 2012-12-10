require('nodeunit').reporters.default.run(['test/promise.js'], null, function() {
    require('promises-aplus-tests')(require('./test/aplus-adapter'));
});