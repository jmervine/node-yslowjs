var YSlow      = require('lib/yslow');
module.exports = {

    setUp: function (callback) {

        callback();
    },

    'new YSlow(opts)': function (test) {
        var yslow = new YSlow({
                       url: "http://localhost/foobar",
                       info: "basic",
                       yslowdir: "./test/support" });

        test.ok(yslow);

        test.ok(yslow.url);
        test.equal("http://localhost/foobar", yslow.url);

        test.ok(yslow.options);
        test.ok(yslow.options.info);
        test.equal("basic", yslow.options.info);

        test.throws( function () { new YSlow() }, Error);

        test.done();
    },

    '#update_yslowdir': function (test) {
        var yslow = new YSlow({
                       url: "http://localhost/foobar",
                       info: "basic",
                       yslowdir: "./test/support" });

        test.ok(yslow.yslowdir);
        test.equal("./test/support", yslow.yslowdir);
        test.ok(process.env.PATH.indexOf("./test/support") !== -1);

        yslow.update_yslowdir("/foo/bar/bah");
        test.ok(yslow.yslowdir);
        test.equal("/foo/bar/bah", yslow.yslowdir);
        test.ok(process.env.PATH.indexOf("/foo/bar/bah") !== -1);

        test.done();
    },

    '#run -- callback': function (test) {
        test.expect(2);
        var yslow = new YSlow({
                       url: "http://localhost/foobar",
                       info: "basic",
                       yslowdir: "./test/support" });

        yslow.run( function (result) {
            test.ok(result);
            test.equal("bar", result.foo);
            test.done();
        });
    },

    '#runSync': function (test) {
        var yslow = new YSlow({
                       url: "http://localhost/foobar",
                       info: "basic",
                       yslowdir: "./test/support" });

        var results = yslow.runSync();
        test.ok(results);
        test.equal("bar", results.foo);
        test.equal("bar", yslow.results.foo);
        test.done();
    },

    '#command': function (test) {
        var yslow = new YSlow({
                       url: "http://localhost/foobar",
                       info: "basic",
                       yslowdir: "./test/support" });

        test.ok(yslow.command());
        test.equal("yslow.js --format json --info basic 'http://localhost/foobar'", yslow.command());

        test.done();
    },

    '#optionsToString': function (test) {
        var yslow = new YSlow({
                       url: "http://localhost/foobar",
                       info: "basic",
                       yslowdir: "./test/support" });

        test.ok(yslow.optionsToString());
        test.equal("--info basic", yslow.optionsToString());

        var y = new YSlow({ url: "foobar", info: "all", ruleset: "foo", ua: "foo"});
        test.equal("--info all --ruleset foo --ua foo", y.optionsToString());
        test.done();
    }

};

