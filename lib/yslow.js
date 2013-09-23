var path    = require('path');
var Phapper = require('phapper');

function YSlow(url, args) {
    // mostly for test stub
    if (!YSlow.prototype.script) {
        this.script = require(path.join(__dirname, 'yspath')).yslowjs;
    }

    args = args || [];
    args.push('--format');
    args.push('json');

    this.url = url || 'http://localhost';

    args.push(this.url);
    this.phantom = new Phapper(this.script, args);
}

YSlow.prototype = {
    run: function (callback) {
        this.phantom.run(function (parsed, raw) {
            if (raw.error) {
                callback(raw.error, parsed);
                return; // done
            }
            if (raw.stderr) {
                callback(new Error(raw.stderr), parsed);
                return; // done
            }
            if (!parsed) {
                callback(new Error('Error parsing results.'), parsed);
                return; // done
            }
            callback(null, parsed);
        });
    },

    runSync: function () {
        var res = this.phantom.runSync();
        if (res.stderr) {
            throw new Error(res.stderr);
        }
        if (!res.parsed) {
            throw new Error('Error parsing results from '+this.url);
        }
        this.results = res.parsed;
        return this.results;
    },
};

module.exports = YSlow;
