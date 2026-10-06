"""Simulador headless do jogo de luta (Braresults). Roda o fight.js REAL num Chromium
com canvas falso, relogio virtual e IA nas duas pontas. Uso: importar run_jobs()."""
import os, re, shutil, json, sys
from playwright.sync_api import sync_playwright

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SRC = os.path.join(ROOT, 'www')

def build_sim_www(dst):
    """Copia www e injeta ganchos de teste SOMENTE na copia (o jogo original nao muda)."""
    if os.path.exists(dst): shutil.rmtree(dst)
    shutil.copytree(SRC, dst)
    p = os.path.join(dst, 'fight.js'); s = open(p, encoding='utf8').read()
    def rep(old, new, count=1):
        nonlocal s
        assert old in s, 'trecho nao encontrado: ' + old[:60]
        s = s.replace(old, new, count)
    # IA tambem no jogador 1 (sem mira perfeita) e sem renderizacao
    rep("else{const A=ai(E,P,dt);cpuAw(dt);const dg=cpuDodge(dt);step(P,dt,ax,K,E);step(E,dt,dg||A.ax,A.inp,P)}",
        "else{const A=ai(E,P,dt);cpuAw(dt);const dg=cpuDodge(dt);if(window.__SIM2){const A2=ai(P,E,dt);step(P,dt,A2.ax,A2.inp,E)}else step(P,dt,ax,K,E);step(E,dt,dg||A.ax,A.inp,P)}")
    rep("if(!(f===P||(pvp&&f===E)))a+=(Math.random()-.5)", "if(window.__SIM2||!(f===P||(pvp&&f===E)))a+=(Math.random()-.5)")
    rep("if(dt>0){rig(P,dt,t);rig(E,dt,t)}", "if(dt>0&&!window.__NORENDER){rig(P,dt,t);rig(E,dt,t)}")
    rep("abs.forEach((r,pi)=>{const f=FT[pi],hd=UL.some", "if(window.__NORENDER){raf=requestAnimationFrame(loop);return}abs.forEach((r,pi)=>{const f=FT[pi],hd=UL.some")
    i = s.rindex("raf=requestAnimationFrame(loop);\n}\n})();")
    hook = ("window.__FGSIM={P,E,M,PR,mk,newRound,FD,get mt(){return mt},get rst(){return rst},get rd(){return rd},get over2(){return over2},"
            "setLV(d){const L=[{r:.35,b:.25,a:.5},{r:.2,b:.5,a:.75},{r:.1,b:.75,a:1}][d];Object.assign(LV,L)},"
            "setup(w1,a1,w2,a2,mp){const c={nome:'X',foto:''};Object.assign(P,mk(400,c,1,FD.W[w1],a1<0?null:FD.A[a1]));Object.assign(E,mk(1200,c,-1,FD.W[w2],a2<0?null:FD.A[a2]));"
            "P.cpu=E.cpu=1;P.vit=E.vit=0;M.pl=FD.M[mp][7].map(q=>{const w=Math.round(q[1]*1.3),c2=(q[0]+q[1]/2)*2;return[Math.round(c2-w/2),w,q[2]]});newRound();rst=0;over2=0;mt=0}};\n")
    s = s[:i] + hook + s[i:]
    j = s.rindex("})();")
    s = s[:j] + "window.__FGSTART=d=>{CAND={id:1,nome:'X',foto:''};ENM={id:2,nome:'Y',foto:''};MP=0;WP=0;AC=0;DF=d;MD=0;start()};\n" + s[j:]
    open(p, 'w', encoding='utf8').write(s)

INIT = r"""
(()=>{
 const mk=()=>{const f=function(){};const p=new Proxy(f,{get:(t,k)=>k===Symbol.toPrimitive?()=>0:(k==='width'?0:p),apply:()=>p,set:()=>true});return p};
 const ctx=mk();
 HTMLCanvasElement.prototype.getContext=function(){return ctx};
 let T=0,cb=null,s=1;
 performance.now=()=>T;
 window.requestAnimationFrame=f=>{cb=f;return 1};window.cancelAnimationFrame=()=>{cb=null};
 window.__seed=n=>{s=n>>>0};
 Math.random=()=>{s=(s+0x6D2B79F5)>>>0;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
 window.__tick=n=>{for(let i=0;i<n&&cb;i++){T+=1000/60;const f=cb;cb=null;f(T)}};
 window.__NORENDER=true;window.__SIM2=true;
})();
"""

JS_RUN = """([w1,a1,w2,a2,mp,df,seed,maxS])=>{
 const S=window.__FGSIM;__seed(seed);S.setLV(df);S.setup(w1,a1,w2,a2,mp);
 const P=S.P,E=S.E;let fr=0;const lim=maxS*60,tot=[0,0];
 let minHp=[100,100];
 while(fr<lim&&S.rst===0&&P.hp>0&&E.hp>0){__tick(6);fr+=6}
 const pw=P.hp>=E.hp;
 return {t:+(fr/60).toFixed(1),hp:[+Math.max(0,P.hp).toFixed(1),+Math.max(0,E.hp).toFixed(1)],mx:[P.mx,E.mx],
   win:(P.hp>0&&E.hp>0)?-1:(pw?0:1)};
}"""

def run_jobs(jobs, out=None, tag=''):
    """jobs: lista de dicts {w1,a1,w2,a2,mp,df,seed}. Retorna lista de resultados."""
    dst = os.path.join('/tmp', 'simwww_' + (tag or str(os.getpid())))
    build_sim_www(dst)
    res = []
    with sync_playwright() as pw:
        b = pw.chromium.launch(args=['--allow-file-access-from-files'])
        pg = b.new_page(); errs = []
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.add_init_script(INIT)
        pg.goto('file://' + dst + '/index.html'); pg.wait_for_timeout(500)
        started = False
        for n, j in enumerate(jobs):
            if not started:
                pg.evaluate("d=>window.__FGSTART(d)", j.get('df', 1)); started = True
            r = pg.evaluate(JS_RUN, [j['w1'], j['a1'], j['w2'], j['a2'], j.get('mp', 0), j.get('df', 1), j['seed'], j.get('maxS', 240)])
            r.update(j); res.append(r)
            if out and (n % 20 == 0 or n == len(jobs) - 1):
                json.dump({'res': res, 'errs': errs[:5]}, open(out, 'w'))
        b.close()
    if out: json.dump({'res': res, 'errs': errs[:5]}, open(out, 'w'))
    return res, errs

if __name__ == '__main__':
    import time; t = time.time()
    res, errs = run_jobs([dict(w1=0,a1=-1,w2=1,a2=-1,mp=0,df=1,seed=i) for i in range(3)], tag='t')
    print(res, errs, round(time.time() - t, 1), 's')
