"""Calibra B['cm'][df] (dano da CPU por arma) para uma dificuldade. Uso: python3 tune_df.py DF ITERS"""
import json, subprocess, glob, statistics as st, math, sys, os
H = os.path.dirname(os.path.abspath(__file__)); SIM = os.path.join(H, '..', 'sim')
DF = int(sys.argv[1]); iters = int(sys.argv[2]); K = str(DF)
B = json.load(open(H + '/balance.json')); B.setdefault('cm', {}).setdefault(K, [1.0] * 20)
best = [9]
for it in range(iters):
    json.dump(B, open(H + '/balance.json', 'w'))
    subprocess.run(['python3', H + '/apply.py'], check=True, stdout=subprocess.DEVNULL)
    subprocess.run(['./runall.sh', 'td', '5', K, str(8191 * (it + 1))], cwd=SIM, check=True)
    R = []
    for f in glob.glob(f'{SIM}/out/td_*.json'): R += json.load(open(f))['res']
    w = [0.] * 20; g = [0] * 20
    for r in R:
        for side in (0, 1):
            if r['w1'] == r['w2'] and side == 1: continue
            wi = r['w1'] if side == 0 else r['w2']; g[wi] += 1
            ws = r['win'] if r['win'] != -1 else (0 if r['hp'][0]/r['mx'][0] >= r['hp'][1]/r['mx'][1] else 1)
            w[wi] += 1 if ws == side else 0
    wr = [w[i] / g[i] for i in range(20)]; sd = st.pstdev(wr)
    print(f'it{it}: mediana={st.median([r["t"] for r in R]):.1f}s timeout={100*sum(r["win"]==-1 for r in R)/len(R):.1f}% desvio={100*sd:.1f} min={100*min(wr):.0f} max={100*max(wr):.0f}', flush=True)
    if sd < best[0]: best[0] = sd; json.dump(B, open(H + '/balance.best_df.json', 'w'))
    c = [x * math.exp(0.3 * (0.5 - wr[i])) for i, x in enumerate(B['cm'][K])]
    gm = math.exp(sum(math.log(x) for x in c) / 20)
    B['cm'][K] = [round(max(.2, min(3, x / gm)), 3) for x in c]
json.dump(B, open(H + '/balance.json', 'w')); print('final', B['cm'][K])
