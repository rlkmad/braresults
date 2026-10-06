"""Uso: python3 shard.py NOME K N [seeds] [df] -> roda a fatia K de N do round-robin 20x20."""
import sys, os, json
from harness import run_jobs
name, k, n = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
seeds = int(sys.argv[4]) if len(sys.argv) > 4 else 3
df = int(sys.argv[5]) if len(sys.argv) > 5 else 1
off = int(sys.argv[6]) if len(sys.argv) > 6 else 0
jobs = [dict(w1=a, a1=-1, w2=b, a2=-1, mp=(s + a + b) % 5, df=df, seed=off + 1000 * s + 20 * a + b)
        for s in range(seeds) for a in range(20) for b in range(20)]
jobs = jobs[k::n]
os.makedirs('out', exist_ok=True)
run_jobs(jobs, out=f'out/{name}_{k}.json', tag=f'{name}{k}')
print('shard', k, 'ok', len(jobs))
