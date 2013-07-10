var fs       = require('fs');
var execSync = require('exec-sync');
var exec     = require('child_process').exec;
var Phapper  = require('phapper');

function YSlow(opts) {
    if (!opts) {
        opts = {};
    }

    if (!opts.hasOwnProperty('url')) {
        opts.url = "http://localhost";
    }

    yslow = opts.yslow || coerce_yslow();
    delete opts.yslow;

    this.phantom = new Phapper(yslow, optionsToArray(opts));
}

YSlow.prototype = {
    run: function (callback) {
        return this.phantom.run(callback);
    },

    runSync: function () {
        this.results = this.phantom.runSync();
        return this.results;
    }
};

// private functions
function optionsToArray(opts) {
    var url = opts.url;
    delete opts.url;

    var options = [];
    var keys = Object.keys(opts);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (typeof opts[key] !== 'undefined') {
            options.push("--"+key);
            options.push(opts[key]);
        }
    }

    options.push(url);
    return options;
}

// This is about the uglyest way I think to do this, but it's
// also the only way I can think of.
function coerce_yslow() {
    if (process.env.NODE_PATH) {
        var node_paths = process.env.NODE_PATH.split(":");
        for (var i = 0; i < node_paths.length; i++) {
            if (node_paths[i] === ".") {
                node_paths[i] = "./";
            }

            if (fs.existsSync(node_paths[i]+"yslowjs/lib/phantomjs/yslow.js")) {
                return node_paths[i]+"yslowjs/lib/phantomjs/yslow.js";
            }

            if (fs.existsSync(node_paths[i]+"phantomjs/yslow.js")) {
                return node_paths[i]+"phantomjs/yslow.js";
            }
        }
    }
    throw new Error("yslowjs couldn't find yslow.js");
}

// export
module.exports = YSlow;
