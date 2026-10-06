import json,glob,collections,sys
R=[]
for f in glob.glob(f'out/{sys.argv[1]}_*.json'): R+=json.load(open(f))['res']
names='Espada Machado Martelo Adaga Arco Cajado Escudo Tridente Picareta Taco Pistola Bomba Chamas Gelo Raio Katana Guitarra Livro Luvas Cetro'.split()
M=collections.defaultdict(lambda:[0,0]); T=collections.Counter(); N=collections.Counter()
for r in R:
    a,b=r['w1'],r['w2']
    if a==b: continue
    ws=r['win'] if r['win']!=-1 else (0 if r['hp'][0]/r['mx'][0]>=r['hp'][1]/r['mx'][1] else 1)
    M[(a,b)][0]+= ws==0; M[(a,b)][1]+=1
    M[(b,a)][0]+= ws==1; M[(b,a)][1]+=1
    if r['win']==-1: T[a]+=1;T[b]+=1
    N[a]+=1;N[b]+=1
ex=sorted(((v[0]/v[1],k) for k,v in M.items() if v[1]>=10))
print('piores confrontos:',[(names[k[0]]+'>'+names[k[1]],round(100*p)) for p,k in ex[:10]])
print('timeout% (>8%):',{names[i]:round(100*T[i]/N[i]) for i in range(20) if T[i]/N[i]>.08})
lop=sum(1 for p,k in ex if p<.2 or p>.8)//2
print('confrontos com <20% ou >80%:',lop,'de',len(ex)//2)
