import sys, json, glob, statistics as st
name = sys.argv[1]
R = []
for f in sorted(glob.glob(f'out/{name}_*.json')):
    d = json.load(open(f)); R += d['res']
    if d['errs']: print('ERROS JS:', d['errs'])
names = ['Espada','Machado','Martelo','Adaga','Arco','Cajado','Escudo','Tridente','Picareta','Taco','Pistola','Bomba','Chamas','Gelo','Raio','Katana','Guitarra','Livro','Luvas','Cetro']
ts = sorted(r['t'] for r in R)
print(f'partidas={len(R)}  duracao: media={st.mean(ts):.1f}s mediana={st.median(ts):.1f}s p10={ts[len(ts)//10]:.1f} p90={ts[len(ts)*9//10]:.1f}  timeout={sum(r["win"]==-1 for r in R)}')
w=[0]*20; g=[0]*20; dur=[[] for _ in range(20)]; dmg=[0]*20
for r in R:
    for side in (0,1):
        wi=r['w1'] if side==0 else r['w2']; oi=1-side
        if r['w1']==r['w2'] and side==1: continue
        g[wi]+=1; dur[wi].append(r['t'])
        if r['win']==side: w[wi]+=1
        elif r['win']==-1: w[wi]+=.5
        dmg[wi]+=r['mx'][oi]-r['hp'][oi]
print(f'{"arma":10s} {"win%":>6s} {"dur":>6s}')
for i in sorted(range(20), key=lambda i:-w[i]/max(1,g[i])):
    print(f'{names[i]:10s} {100*w[i]/g[i]:6.1f} {st.mean(dur[i]):6.1f}')
wr=[w[i]/g[i] for i in range(20)]
print(f'desvio dos win%: {100*st.pstdev(wr):.1f}  (min {100*min(wr):.0f} max {100*max(wr):.0f})')
side=sum(r['win']==0 for r in R)/max(1,sum(r['win']>=0 for r in R)); print(f'vitoria do lado esquerdo: {100*side:.1f}%')
