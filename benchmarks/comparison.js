var cliff = require('cliff'),
    benchmark = require('benchmark'),
    fs = require('fs'),
    data = require('./data'),
    Vow = require('..'),
    Q = require('q'),
    When = require('when'),
    Bluebird = require('bluebird'),
    Pinkie = require('pinkie'),
    corePromise = require('core-js/library/es6/promise'),
    Davy = require('davy'),
    tests = {
        'Q' : function(deferred) {
            var toResolve = [],
                topPromises = [];

            Object.keys(data).forEach(function(key) {
                var defer = Q.defer();
                Q.all(data[key].map(function(val) {
                        var defer = Q.defer();
                        toResolve.push({ defer : defer, val : val });
                        return defer.promise;
                    }))
                    .then(function(val) {
                        defer.resolve(val);
                    });
                topPromises.push(defer.promise);
            });

            Q.all(topPromises).then(function() {
                deferred.resolve();
            });

            toResolve.forEach(function(obj) {
                obj.defer.resolve(obj.val);
            });
        },

        'When' : function(deferred) {
            var toResolve = [],
                topPromises = [];

            Object.keys(data).forEach(function(key) {
                var defer = When.defer();
                When.all(data[key].map(function(val) {
                        var defer = When.defer();
                        toResolve.push({ defer : defer, val : val });
                        return defer.promise;
                    }))
                    .then(function(val) {
                        defer.resolve(val);
                    });
                topPromises.push(defer.promise);
            });

            When.all(topPromises).then(function() {
                deferred.resolve();
            });

            toResolve.forEach(function(obj) {
                obj.defer.resolve(obj.val);
            });
        },

        'Bluebird' : function(deferred) {
            var toResolve = [],
                topPromises = [];

            Object.keys(data).forEach(function(key) {
                var resolve,
                    promise = new Bluebird(function(_resolve) {
                        resolve = _resolve;
                    });
                Bluebird.all(data[key].map(function(val) {
                        return new Bluebird(function(_resolve) {
                            toResolve.push({ resolve : _resolve, val : val });
                        });
                    }))
                    .then(function(val) {
                        resolve(val);
                    });
                topPromises.push(promise);
            });

            Bluebird.all(topPromises).then(function() {
                deferred.resolve();
            });

            toResolve.forEach(function(obj) {
                obj.resolve(obj.val);
            });
        },

        'Pinkie' : function(deferred) {
            var toResolve = [],
                topPromises = [];

            Object.keys(data).forEach(function(key) {
                var resolve,
                    promise = new Pinkie(function(_resolve) {
                        resolve = _resolve;
                    });
                Pinkie.all(data[key].map(function(val) {
                        return new Pinkie(function(_resolve) {
                            toResolve.push({ resolve : _resolve, val : val });
                        });
                    }))
                    .then(function(val) {
                        resolve(val);
                    });
                topPromises.push(promise);
            });

            Pinkie.all(topPromises).then(function() {
                deferred.resolve();
            });

            toResolve.forEach(function(obj) {
                obj.resolve(obj.val);
            });
        },

        'Davy': function (deferred) {
            var toResolve = [],
                topPromises = Object.keys(data).map(function(key) {
                    var defer = Davy.defer();
                    Davy.all(data[key].map(function(val) {
                            var defer = Davy.defer();
                            toResolve.push({ defer : defer, val : val });
                            return defer.promise;
                        }))
                        .then(function(val) {
                            defer.fulfill(val);
                        });
                    return defer.promise;
                });

            Davy.all(topPromises).then(function() {
                deferred.resolve();
            });

            toResolve.forEach(function(obj) {
                obj.defer.fulfill(obj.val);
            });
        },

        'ES2015 Promise' : function(deferred) {
            var toResolve = [],
                topPromises = [];

            Object.keys(data).forEach(function(key) {
                var resolve,
                    promise = new Promise(function(_resolve) {
                        resolve = _resolve;
                    });
                Promise.all(data[key].map(function(val) {
                        return new Promise(function(_resolve) {
                            toResolve.push({ resolve : _resolve, val : val });
                        });
                    }))
                    .then(function(val) {
                        resolve(val);
                    });
                topPromises.push(promise);
            });

            Promise.all(topPromises).then(function() {
                deferred.resolve();
            });

            toResolve.forEach(function(obj) {
                obj.resolve(obj.val);
            });
        },

        'core-js Promise' : function(deferred) {
            var toResolve = [],
                topPromises = [];

            Object.keys(data).forEach(function(key) {
                var resolve,
                    promise = new corePromise(function(_resolve) {
                        resolve = _resolve;
                    });
                corePromise.all(data[key].map(function(val) {
                        return new corePromise(function(_resolve) {
                            toResolve.push({ resolve : _resolve, val : val });
                        });
                    }))
                    .then(function(val) {
                        resolve(val);
                    });
                topPromises.push(promise);
            });

            corePromise.all(topPromises).then(function() {
                deferred.resolve();
            });

            toResolve.forEach(function(obj) {
                obj.resolve(obj.val);
            });
        },

        'Vow' : function(deferred) {
            var toResolve = [],
                topPromises = Object.keys(data).map(function(key) {
                    var defer = Vow.defer();
                    Vow.all(data[key].map(function(val) {
                            var defer = Vow.defer();
                            toResolve.push({ defer : defer, val : val });
                            return defer.promise();
                        }))
                        .then(function(val) {
                            defer.resolve(val);
                        });
                    return defer.promise();
                });

            Vow.all(topPromises).then(function() {
                deferred.resolve();
            });

            toResolve.forEach(function(obj) {
                obj.defer.resolve(obj.val);
            });
        }
    },
    results = [],
    onTestCompleted = function(name) {
        results.push({
            'library'   : name,
            'mean time' : (this.stats.mean * 1000).toFixed(3) + 'ms',
            'ops/sec'   : (1 / this.stats.mean).toFixed(0)
        });
    };

try {
    new Promise();
}
catch (err) {
    delete tests['ES2015 Promise'];
};

function compareMeanTime(a, b) {
    var pick = function (x) {
        return parseFloat(x['mean time']);
    };
    return pick(a) - pick(b);
};

var suite = new benchmark.Suite(
    'comparison',
    {
        onStart : function() {
            console.log('Starts\n');
        },

        onComplete : function() {
            results.sort(compareMeanTime);
            console.log(cliff.stringifyObjectRows(
                results,
                ['library', 'mean time', 'ops/sec'],
                ['red', 'green', 'blue']) + '\n');
            results = [];
        }
    });

Object.keys(tests).forEach(function(name) {
    var i = 0;
    suite.add(
        name,
        function(deferred) {
            tests[name](deferred);
        },
        {
            defer      : true,
            onStart    : function() {
                console.log(name  + '\n');
            },
            onCycle    : function() {
                console.log('\033[1A' + new Array(i++).join('.'));
            },
            onComplete : function() {
                console.log('');
                onTestCompleted.call(this, name);
            }
        });
});

suite.run();
