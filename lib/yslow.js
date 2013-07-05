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
        this.yslowdir = opts.yslowdir;
        delete opts.yslowdir;
    }

    this.options = opts;

    // add 'phantomjs/yslow.js' to path.
    if (!this.yslowdir) {
        this.yslowdir = coerce_yslowdir();
        if (!this.yslowdir) {
            throw new Error("was unable to find yslow.js");
        }
    }
    process.env.PATH = this.yslowdir+":"+process.env.PATH;
}

YSlow.prototype = {
    run: function (callback) {
        return exec(this.command(), function (error, stdout, stderr) {
            if (error) {
                throw new Error(error);
            }
            if (stderr) {
                throw new Error(stderr);
            }
            var parsed = JSON.parse(stdout || false);

            if (!parsed) {
                throw new Error("Something went wrong parsing stdout to JSON: %j", parsed);
            }
            callback(parsed, stdout);
        });
    },

    runSync: function () {
        var result   = execSync(this.command(), true);

        if (result.stderr) {
            throw new Error(result.stderr);
        }

        this.results = JSON.parse(result.stdout) || false;

        if (!this.results) {
            throw new Error("Something went wrong parsing stdout to JSON: %j", result);
        }

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
            if (this.options[key]) {
                o.push("--"+key+" "+this.options[key]);
            }
        }

        return o.join(" ");
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
            if (fs.existsSync(node_paths[i]+"phantomjs/yslow.js")) {
                return node_paths[i]+"phantomjs";
            }
        }
    }
}

function run_command(command, callback) {
    var proc = exec(command, function (error, stdout, stderr) {
        console.log("stdout: " + stdout);
        console.log("stderr: " + stderr);
        if (error !== null) {
            console.log("error: " + error);
            throw error;
        }
        var result = JSON.parse(stdout) || false;
        callback(result);
    });
    proc.on('exit', function (err) {
        if (err) {
            return err;
        } else {
            return true;
        }
    });
}

// export
module.exports = YSlow;
