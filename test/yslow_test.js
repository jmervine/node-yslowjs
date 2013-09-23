var YSlow = require('lib/yslow');

// BEGIN stubs
var sample_runSync = {
    parsed: { o: 75 },
    stderr: null,
    stdout: "{ 'o': 75 }"
};

var sample_run = {
    parsed: { o: 75 },
    raw: {
        error: null,
        stdout: "{ 'o': 75 }",
        stderr: null
    }
};

var sample_error_run1 = {
    raw: {
        error: new Error('ack error1'),
        stderr: null
    }
};

var sample_error_run2 = {
    raw: {
        error: null,
        stderr: 'ack error2'
    }
};

var stub_runSync = function () {
    return sample_runSync;
};

var stub_run = function (callback) {
    callback(sample_run.parsed, sample_run.raw);
};

var stub_error_run1 = function (callback) {
    callback(null, sample_error_run1.raw);
};

var stub_error_run2 = function (callback) {
    callback(null, sample_error_run2.raw);
};

var stub_error_run3 = function (callback) {
    callback(undefined, {});
};

// END stubs
var yslow;

module.exports = {
    setUp: function (callback) {
        yslow = new YSlow('http://localhost/foobar');
        yslow.phantom.run = stub_run;
        yslow.phantom.runSync = stub_runSync;
        callback();
    },

    tearDown: function (callback) {
        yslow = undefined;
        callback();
    },

    'new YSlow(opts)': function (test) {
        test.expect(7);

        test.ok(yslow);
        test.ok(yslow.phantom);
        test.ok(yslow.phantom.script.indexOf('yslow_phantom.js'));

        test.ok(yslow.phantom.args.indexOf('--format') !== -1);
        test.ok(yslow.phantom.args.indexOf('json') !== -1);

        yslow = new YSlow();
        test.equal('http://localhost', yslow.url);
        test.ok(yslow.phantom.script.indexOf('yslow_phantom.js'));

        test.done();
    },

    '#run': function (test) {
        test.expect(2);

        yslow.run( function (error, result) {
            test.ok(result);
            test.equal(75, result.o);
            test.done();
        });
    },

    '#run w/ errors (condition 1)': function (test) {
        // error condition one
        yslow.phantom.run = stub_error_run1;
        yslow.run( function (error, result) {
            test.ok(error);
            test.equal('ack error1', error.message);
            test.done();
        });
    },

    '#run w/ errors (condition 2)': function (test) {
        // error condition two
        yslow.phantom.run = stub_error_run2;
        yslow.run( function (error, result) {
            test.ok(error);
            test.equal('ack error2', error.message);
            test.done();
        });
    },

    '#run w/ errors (condition 3)': function (test) {
        // error condition two
        yslow.phantom.run = stub_error_run3;
        yslow.run( function (error, result) {
            test.ok(error);
            test.equal('Error parsing results.', error.message);
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

    'Phapper#commandString': function (test) {
        test.expect(4);

        var yslow = new YSlow();
        var cmdStr = yslow.phantom.commandString();

        test.ok(cmdStr, 'expecting command string');

        var value;

        value = (cmdStr.indexOf('phantomjs ') !== -1);
        test.ok(value, 'expecting "phantomjs" in command string');

        value = (cmdStr.indexOf('yslow_phantom.js') !== -1);
        test.ok(value, 'expecting "yslow_phantom.js" in command string');

        value = (cmdStr.indexOf('http://localhost') !== -1);
        test.ok(value, 'expecting "http://localhost" in command string');

        test.done();
    },
};

