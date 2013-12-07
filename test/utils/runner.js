global.Vow = require('../..');

var fs = require('fs'),
    path = require('path'),
    dir = path.join(__dirname, '..');

require('nodeunit').reporters.default.run(
    fs.readdirSync(dir)
        .filter(function(file){
            return fs.statSync(path.join(dir, file)).isFile();
        })
        .map(function(file) {
            return path.join('test', file);
        }),
    null,
    function(err) {
        err?
            process.exit(1) :
            require('promises-aplus-tests')(require('./aplus-adapter'), function(err) {
                err && process.exit(1);
            });
    });