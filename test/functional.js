module.exports = {
    'new YSlow(url, args) functional test': function (test) {
        test.expect(7);
        var YSlow = require('lib/yslow');
        test.ok(YSlow, 'require YSlow');

        var yslow = new YSlow('https://raw.github.com/jmervine/yslowjs/master/README.md');
        test.ok(yslow, 'new YSlow');

        console.log('\nRunning (Sync)....');

        var results = yslow.runSync();
        test.ok(results, 'yslow.runSync');

        console.log('=> overall:   ' + results.o);
        test.ok(results.o, 'runSync: results.o');

        console.log('=> load time: ' + results.lt);
        test.ok(results.lt, 'runSync: results.lt');

        console.log('\nRunning (Async)....');

        yslow.run( function (result) {
            console.log('=> overall:   ' + result.o);
            test.ok(result.o, 'run: result.o');

            console.log('=> load time: ' + result.lt);
            test.ok(result.lt, 'run: result.lt');

            test.done();
        });
    }
};

