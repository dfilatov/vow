require('nodeunit').reporters.default.run(['test/vow.js'], null, function(error) {
    error || require('promises-aplus-tests')(require('./test/aplus-adapter'));
});