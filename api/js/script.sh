#!/usr/bin/env bash

rm -f out.json
for YEAR in 1971 {2000..2020};do
    echo $YEAR
    sed "s/\$YEAR/${YEAR}/g" < layer.template >> out.json
done
