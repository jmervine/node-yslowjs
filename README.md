# YSlow.js on Node.js

YSlow.js on [Node.js](http://mervine.net/nodejs) is a simple [Node.js](http://mervine.net/nodejs) wrapper for programmatically running [`phantomjs yslow.js`](http://yslow.org/phantomjs/).

## Links

* [package](https://npmjs.org/package/yslowjs)
* [source](https://github.com/jmervine/node-yslowjs)
* [tests](https://travis-ci.org/jmervine/yslowjs)

## Requirements

1. [PhantomJS](http://phantomjs.org/) in your `PATH`.
2. [![Build Status](https://travis-ci.org/jmervine/node-yslowjs.png?branch=master)](https://travis-ci.org/jmervine/node-yslowjs) for the following node versions:
    - 0.8
    - 0.10

## Installation

    :::shell
    $ npm install yslowjs

#### Additional Installation Notes

You can specify different versions of [YSlow.js](http://mervine.net/yslowjs) using `npm config`:

    $ npm config set yslowjs_version

> You will have to reinstall `yslowjs` if you change this option after initially installing it.

I've added limited Windows support, in that things should work by default, YSlow.js should be there and ready to use. If it doesn't, you'll have to install [`yslow.js`](http://yslow.org/phantomjs) yourself and specify the path like so:

    :::js
    var YSlow = require('yslowjs');
    YSlow.prototype.script = 'c:\path\to\yslow.js';

> It's important to note that I haven't tested this on Windows (and don't really have an easy way to), so feedback and/or pull requests are welcome.


## Configuration Options

    :::js
    var yslow = new YSlow('http://example.com/path/foo',
        [ '--arg', 'value' ]);
        // Supported:
        //   info     specify the information to display/log (basic|grade|stats|comps|all) [all],
        //   ruleset  specify the YSlow performance ruleset to be used (ydefault|yslow1|yblog) [ydefault],
        //   beacon   specify an URL to log the results,
        //   ua       specify the user agent string sent to server when the page requests resources,
        //   viewport specify page viewport size WxY, where W = width and H = height [400x300],
        //   headers  specify custom request headers, e.g.: -ch '{\'Cookie\': \'foo=bar\'}',
        // WARNING: format is locked at json, so don't pass it!

## Usage Examples

#### Async

    :::js
    // file: async.js
    var YSlow = require('lib/yslow');
    var yslow = new YSlow('http://mervine.net/projects/npms/yslowjs',
        [ '--info', 'basic' ]);
    console.log('\nRunning (Async)....');
    yslow.run( function (result) {
        console.log('=> overall:   ' + result.o);
        console.log('=> load time: ' + result.lt);
    });

#### Sync

    :::js
    // file: sync.js
    var YSlow = require('lib/yslow');
    var yslow = new YSlow('http://mervine.net/projects/npms/yslowjs',
        [ '--info', 'basic' ]);
    console.log('\nRunning (Sync)....');
    var results = yslow.runSync();
    console.log('=> overall:   ' + results.o);
    console.log('=> load time: ' + results.lt);

#### Using Custom `yslow.js` Download

    :::js
    var YSlow = require('lib/yslow');
    YSlow.prototype.script = '/path/to/your/yslow.js';
    // continue on

