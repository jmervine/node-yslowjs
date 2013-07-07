var fs = require('fs');
var execSync = require('exec-sync');
var exec = require('child_process').exec;

function YSlow(opts) {
    if (opts.url) {
        this.url = opts.url;
        delete opts.url;
    } else {
        throw new Error("url is a required option");
    }

    if (opts.yslowdir) {
        this.update_yslowdir(opts.yslowdir);
        delete opts.yslowdir;
    } else {
        this.update_yslowdir(coerce_yslowdir());
    }

    this.options = opts;
}

YSlow.prototype = {
    run: function (callback) {
        return exec(this.command(), function (error, stdout, stderr) {
            if (error)
                throw new Error(error);
            if (stderr)
                throw new Error(stderr);

            var parsed = JSON.parse(stdout) || false;

            if (!parsed)
                throw new Error("Something went wrong parsing stdout to JSON: %j", parsed);

            callback(parsed, stdout);
        });
    },

    runSync: function () {
        var result   = execSync(this.command(), true);

        if (result.stderr)
            throw new Error(result.stderr);

        this.results = JSON.parse(result.stdout) || false;

        if (!this.results)
            throw new Error("Something went wrong parsing stdout to JSON: %j", result);

        return this.results;
    },

    command: function () {
        return "yslow.js --format json " + this.optionsToString() + " '" + this.url + "'";
    },

    validOptions: [ "info", "ruleset", "beacon", "ua", "viewport", "headers" ],

    optionsToString: function () {
        var o = [];
        for (var i = 0; i < this.validOptions.length; i++) {
            var key = this.validOptions[i];

            if (this.options[key])
                o.push("--"+key+" "+this.options[key]);
        }
        return o.join(" ");
    },

    update_yslowdir: function (dir) {
        this.yslowdir = dir;
        process.env.PATH = dir+":"+process.env.PATH;
    },
};


// private functions
//
// This is about the uglyest way I think to do this, but it's
// also the only way I can think of.
function coerce_yslowdir() {
    if (process.env.NODE_PATH) {
        var node_paths = process.env.NODE_PATH.split(":");
        for (var i = 0; i < node_paths.length; i++) {
            if (node_paths[i] === ".")
                node_paths[i] = "./";

            if (fs.existsSync(node_paths[i]+"yslowjs/lib/phantomjs/yslow.js"))
                return node_paths[i]+"yslowjs/lib/phantomjs";

            if (fs.existsSync(node_paths[i]+"phantomjs/yslow.js"))
                return node_paths[i]+"phantomjs";
        }
    }
    console.log("WARNING: yslowjs couldn't find yslow.js. Set absolute path using 'yslowdir'.");
    return false;
}

// export
module.exports = YSlow;
