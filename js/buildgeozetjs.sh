#!/bin/sh


cd js
mv geozet.js geozet.js.bak
cat Geozet/Format/XLSLUS.js > cat.geozet.js
cat Geozet/Format/XLSAddress.js >> cat.geozet.js
cat Geozet/Format/XLSLUS/v1.js >> cat.geozet.js
cat Geozet/Format/XLSLUS/v1_1_0.js >> cat.geozet.js
# minify
cat cat.geozet.js | jsmin.py > geozet.js
rm cat.geozet.js
echo created and minified geozet.js. Old one is still available at geozet.js.bak

