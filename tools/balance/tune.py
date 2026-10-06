"""Loop de calibracao: ajusta wm[i] (multiplicador de dano por arma) pela taxa de vitoria
e a escala global G pela duracao mediana. Uso: python3 tune.py ITERS [alvo_mediana_s]"""
import json, subprocess, glob, statistics as st, math, sys, os
H = os.path.dirname(os.path.abspath(__file__)); SIM = os.path.join(H, '..', 'sim')
iters = int(sys.argv[1]); target = float(sys.argv[2]) if len(sys.argv) > 2 else 60
B = json.load(open(H + '/balance.json'))
def measure(tag, off):
    subprocess.run(['python3', H + '/apply.py'], check=True, stdout=subprocess.DEVNULL)
    R = []
    for df in (1,):
        subprocess.run(['./runall.sh', tag + str(df), '5', str(df), str(off)], cwd=SIM, check=True)
        for f in glob.glob(f'{SIM}/out/{tag}{df}_*.json'): R += json.load(open(f))['res']
    w = [0.] * 20; g = [0] * 20
    for r in R:
        for side in (0, 1):
            if r['w1'] == r['w2'] and side == 1: continue
            wi = r['w1'] if side == 0 else r['w2']; g[wi] += 1
            ws = r['win'] if r['win'] != -1 else (0 if r['hp'][0]/r['mx'][0] >= r['hp'][1]/r['mx'][1] else 1)
            w[wi] += 1 if ws == side else 0
    ts = [r['t'] for r in R if r['df'] == 1]
    return [w[i] / g[i] for i in range(20)], st.median(ts), sum(r['win'] == -1 for r in R) / len(R)
best = [9]
for it in range(iters):
    wr, med, to = measure('tune', 7919 * (it + 1))
    sd = st.pstdev(wr)
    print(f'it{it}: mediana={med:.1f}s timeout={100*to:.1f}% desvio_win={100*sd:.1f} min={100*min(wr):.0f} max={100*max(wr):.0f}', flush=True)
    json.dump(B, open(H + f'/hist_{it}.json', 'w'))
    if sd < best[0]: best[0] = sd; json.dump(B, open(H + '/balance.best.json', 'w'))
    G = math.exp(sum(math.log(x) for x in B['wm']) / 20)
    for i in range(20):
        B['wm'][i] *= math.exp(0.3 * (0.5 - wr[i]))
    # reescala: media geometrica = G corrigida pela duracao
    G2 = G * (med / target) ** 0.9
    g = math.exp(sum(math.log(x) for x in B['wm']) / 20)
    B['wm'] = [max(.05, min(3, round(x / g * G2, 3))) for x in B['wm']]
    B['dm'] = list(B['wm'])
    json.dump(B, open(H + '/balance.json', 'w'))
print('final wm', B['wm'])
