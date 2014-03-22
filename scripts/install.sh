#!/usr/bin/env bash
libdir="$(echo $(cd $(dirname $0)/..; pwd)/lib)"
srcpath="http://yslow.org"
version="3.1.8"

if test "$npm_config_yslowjs_version"; then
  version="$npm_config_yslowjs_version"
else
  version="$npm_package_config_yslowjs_version"
fi

yspkg="yslow-phantomjs-$version.zip"

decomp="unzip -q -o"

function yay_finished {
  echo " "
  echo "You can reference it within node like so:"
  echo " "
  echo "  var YSlow = require('yslow');"
  echo "  var yslow = new YSlow(url, args);"
  echo "  console.log(yslow.yslowjs);"
  echo " "
  exit 0
}

function write_yspath_js {
  echo "module.exports.yslowjs = '$1';" > $libdir/yspath.js
  echo "yslow.js is installed."
  echo "=> $1"
}

# check for yslowjs && exit
if test -f $libdir/yslow_phantom.js; then
  write_yspath_js $libdir/yslow_phantom.js
  yay_finished
fi

# dowload how? || fail
if which wget > /dev/null; then
  dldr="wget"
elif which curl > /dev/null; then
  dldr="curl -O"
else
  echo "I need wget or curl to download yslow.js"
  exit 1
fi

# check for previous temp dir || create
if ! test "$yslowjs_temp" && test -d $yslowjs_temp; then
  yslowjs_temp="/tmp/yslowjs.temp"
  mkdir -p $yslowjs_temp
  if [ $? -ne 0 ]; then
    echo "Couldn't make temp dir!";
    exit 1;
  fi
fi

cd $yslowjs_temp
# check for previous download || download
if test -f $yspkg; then
  echo "Found previous package, skipping download."
  echo "=> $yslowjs_temp/$yspkg"
  package="$yslowjs_temp/$yspkg"
else
  $dldr "$srcpath/$yspkg"
fi

# decompress package
echo " "
echo "Decompressing $yspkg"
$decomp $yspkg
if [ $? -ne 0 ]; then
  echo "Error occured decompressing $yspkg"
  exit 1
fi

cp $(pwd)/yslow.js $libdir/yslow_phantom.js
if [ $? -ne 0 ]; then
  echo "Error moving yslow.js in to place."
  exit 1
fi
echo " "

write_yspath_js "$libdir/yslow_phantom.js"
yay_finished

