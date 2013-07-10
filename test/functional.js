#!/usr/bin/env node
var YSlow = require('lib/yslow');
var yslow = new YSlow({
    url: "http://mervine.net/projects/npms/yslowjs",
    info: "basic"
});

console.log("Configuration...");

console.log("> yslow.phantom.command():");
console.log("=> " + yslow.phantom.command());

console.log("\nRunning (Sync)....");

var results = yslow.runSync();

console.log("=> overall:   " + results.o);
console.log("=> load time: " + results.lt);

console.log("\nRunning (Async)....");
yslow.run( function (results) {
    console.log("=> overall:   " + results.o);
    console.log("=> load time: " + results.lt);
});

