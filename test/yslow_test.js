var YSlow      = require('lib/yslow');

// BEGIN stubs
var sample_results = {
    o: 75
};

var stub_runSync = function () {
    return sample_results;
};

var stub_run = function (callback) {
    callback(sample_results);
};

// END stubs
var yslow;

module.exports = {
    setUp: function (callback) {
        yslow = new YSlow({
           url: "http://localhost/foobar",
           info: "basic",
           yslow: "./test/support/yslow.js" });

        yslow.phantom.run = stub_run;
        yslow.phantom.runSync = stub_runSync;
        callback();
    },

    tearDown: function (callback) {
        yslow = undefined;
        callback();
    },

    'new YSlow(opts)': function (test) {
        test.expect(6);

        test.ok(yslow);
        test.ok(yslow.phantom);
        test.ok(yslow.phantom.script.indexOf("yslow.js"));
        test.ok(yslow.phantom.args.indexOf('--info') !== -1);
        test.ok(yslow.phantom.args.indexOf('basic') !== -1);

        yslow = new YSlow();
        test.ok(yslow.phantom.script.indexOf("yslow.js"));

        test.done();
    },

    '#run': function (test) {
        test.expect(2);

        yslow.run( function (result) {
            test.ok(result);
            test.equal(75, result.o);
            test.done();
        });
    },

    '#runSync': function (test) {
        test.expect(3);

        var results = yslow.runSync();
        test.ok(results);
        test.equal(75, results.o);
        test.equal(75, yslow.results.o);

        test.done();
    },

    'Phapper#command': function (test) {
        var yslow = new YSlow();

        test.ok(yslow.phantom.command());
        test.equal(
            "phantomjs ./lib/phantomjs/yslow.js http://localhost",
            yslow.phantom.command()
        );

        test.done();
    },
};

