var jsong = require("../bin/Falcor");
var _ = require("lodash");
var Rx = require("rx");
var testRunner = require("./testRunner");
var noOp = function() {};
var chai = require("chai");
var expect = chai.expect;
var Model = jsong.Model;
var Cache = require("./data/Cache");

function getTestRunnerHeader(model, data, options) {
    if (!(model instanceof Rx.Observable)) {
        var m = model;
        model = Rx.Observable.returnValue(m);
    }
    return model.doAction(function(dataModel) {
        getTestRunner(dataModel, data, options);
    });
}
function getTestRunner(model, data, options) {
    options = _.extend({
        useNewModel: true,
        preCall: noOp
    }, options);

    var testRunnerResults = testRunner.transformData(data);
    var prefixesAndSuffixes = testRunnerResults.prefixesAndSuffixes;
    var universalExpectedValues = testRunnerResults.universalExpectedValues;
    var preCallFn = options.preCall;
    var actual;
    var expectedValues, expected;

    prefixesAndSuffixes[0].
        filter(function (prefix) {
            return ~prefix.indexOf("get");
        }).
        forEach(function (prefix) {
            prefixesAndSuffixes[1].map(function (suffix) {
                var query = data[prefix].query;
                var count = data[prefix].count === undefined ? 1 : 0;
                var op = "_" + prefix + suffix;
                
                count = Array(count).join(",").split(",").map(function() { return {}; });

                // If this prefix operation intentionally excludes then early return.
                if (data[prefix].exclude && _.contains(data[prefix].exclude, suffix)) {
                    return;
                }
                expectedValues = data[suffix];
                expected = _.assign({}, expectedValues, universalExpectedValues);

                if (options.useNewModel) {
                    model = testRunner.getModel(null, Cache());
                }

                // For doing any preprocessing.
                preCallFn(model, op, _.cloneDeep(query), count);

                actual = model[op](model, _.cloneDeep(query), count, model._errorSelector);

                // validates that the results from the operation and the expected values are valid.
                testRunner.validateData(expected, actual);

                // validates against the expected vs actual
                testRunner.validateOperation(op, expected, actual);
            });
        });
}

function async(obs, model, data, options) {
    var idx = 0;
    options = options || {};
    var expectedCount = options.onNextExpected &&
        options.onNextExpected.values &&
        options.onNextExpected.values.length || 0;
    var errorThrown = false;
    var verify = options && options.verify === false ? false : true;
    return Rx.Observable.create(function(observer) {
        obs.subscribe(function(x) {
            try {
                if (options.onNextExpected) {
                    var expected = options.onNextExpected.values[idx++];
                    testRunner.compare(expected, x);
                }
            } catch (e) {
                observer.onError(e);
            }
            observer.onNext(x);
        }, function(err) {
            // TODO: This is odd behavior, but it makes done calls easier.
            errorThrown = true;
            if (options.errors) {
                testRunner.compare(options.errors, err);
                complete();
            } else {
                observer.onError(err);
            }
        }, complete);
        function complete() {
            if (options.onNextExpected) {
                expect(idx, "The amount of onNexts did not meet expected").to.equal(expectedCount);
            }
            if (options.errors) {
                expect(errorThrown, "Expected an error to be thrown, and no error was.").to.be.ok;
            }
            if (verify) {
                getTestRunner(model, data, options);
            }
            observer.onCompleted();
        }
    });
}


var GetTestRunner = module.exports = {
    run: function() {
        var args = arguments;
        if (args[2] && args[2].it === false) {
            return getTestRunnerHeader.apply(null, args);
        } else {
            it("perform _get*", function(done) {
                getTestRunnerHeader.apply(null, args).subscribe(noOp, done, done);
            });
        }
    },
    runSync: function() {
        getTestRunner.apply(null, arguments);
    },
    async: async
};
