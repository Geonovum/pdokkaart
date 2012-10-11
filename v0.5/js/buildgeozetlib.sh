#!/bin/sh

cd js
mv geozetlib.js geozetlib.js.bak
cat Geozet/Format/XLSLUS.js > cat.geozetlib.js
cat Geozet/Format/XLSAddress.js >> cat.geozetlib.js
cat Geozet/Format/XLSLUS/v1.js >> cat.geozetlib.js
cat Geozet/Format/XLSLUS/v1_1_0.js >> cat.geozetlib.js
# minify
cat cat.geozetlib.js | jsmin.py > geozetlib.js
rm cat.geozetlib.js
echo created and minified geozetlib.js. Old one is still available at geozetlib.js.bak

