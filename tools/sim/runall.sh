#!/bin/bash
# uso: ./runall.sh NOME [seeds] [df]  -> 4 shards paralelos e espera terminar
N=$1; S=${2:-3}; D=${3:-1}; O=${4:-0}
rm -f out/${N}_*.json
for k in 0 1 2 3; do python3 shard.py $N $k 4 $S $D $O > out/${N}_$k.log 2>&1 & done
wait
