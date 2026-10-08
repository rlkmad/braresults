"""Teste do botao Pular finalizacao (v1.9.52). Roda o fight.js real no Chromium (canvas falso, relogio virtual).
Cobre: 5 finalizacoes nativas + 1 personalizada (id 100), pulo no inicio/meio/fim, pulo duplo, pulo em pausa,
PvP, varios rounds seguidos pulando, sair da luta depois de pular. Uso: python3 test_skip.py"""
import os, sys, json
sys.path.insert(0, os.path.dirname(__file__))
from harness import build_sim_www, INIT, ROOT
from playwright.sync_api import sync_playwright

DST = '/tmp/simwww_skip'
build_sim_www(DST)
p = os.path.join(DST, 'fight.js'); s = open(p, encoding='utf8').read()
HOOK = ("window.__SK={get fin(){return fin},get FH(){return FH},FS2,FP,get rst(){return rst},get rt(){return rt},get rd(){return rd},get shk(){return shk},"
        "get paused(){return paused},set paused(v){paused=v},get FK(){return FK},setFK(k,b){FK=k;FB=b?1:0},skip(){skipFin()},ko(){ko()},stop(b){stop(b)},"
        "get run(){return run},P,E,addFO(q){BRC.FO.push(q);FIN_OK.push(q.k)},get pvp(){return pvp},get FKU(){return FKU}};\n")
a = s.index("window.__FGSIM={")
s = s[:a] + HOOK + s[a:]
s = s.replace("window.__FGSTART=d=>", "window.__FGSTART2=d=>{CAND={id:1,nome:'X',foto:''};CAND2={id:2,nome:'Y',foto:''};MP=0;WP=0;AC=0;WP2=1;AC2=1;DF=d;MD=1;start()};\nwindow.__FGSTART=d=>", 1)
open(p, 'w', encoding='utf8').write(s)

TJ = json.load(open(os.path.join(ROOT, 'trovao-sombrio.json')))['dados']
FO100 = dict(k=100, nome='Trovao', lb='T Trovao', dur=TJ['duracao_s'], dist=TJ['distancia'], ev=TJ['eventos'])

CHK = """([fk,at,pvp])=>{
 const S=window.__FGSIM,K=window.__SK,P=K.P,E=K.E,out={fk,at,errs:[]};
 const ok=(c,m)=>{if(!c)out.errs.push(m)};
 S.setup(0,0,1,0,0);K.setFK(fk,0);
 const rd0=K.rd;E.hp=0;K.ko();
 ok(K.fin&&K.rst===3,'fin nao iniciou');
 const F=K.fin;if(!F)return out;const w=F.w,l=F.l,dur=(fk>=100?FO100d:(fk===5?14:11.5));
 let n=0;while(K.fin&&K.fin.t<at&&n++<2000)__tick(1);
 ok(K.fin,'fin acabou antes do pulo');
 K.skip();
 ok(!K.fin,'fin nao limpou');ok(K.rst===2,'rst!=2');ok(Math.abs(K.rt-1.3)<.01,'rt!=1.3');ok(l.dead===1,'l.dead');
 ok(w.atk===0,'w.atk');ok(l.hit===0,'l.hit');ok(w.win===1,'w.win');ok(K.shk===0,'shk');ok(K.FP.length===0,'FP');
 if(fk===2){ok(l.hid!==1,'katana: perdedor sumiu');ok(l.nh===1,'katana: sem nh');ok(K.FH&&K.FH.y===380-16&&K.FH.vx===0&&K.FH.vy===0,'katana: cabeca nao pousou');ok(w.wi>=0,'katana: wi nao restaurado')}
 else{ok(l.hid===1,'l.hid');ok(K.FH===null,'FH');ok(K.FS2.length===0,'FS2')}
 out.fh=K.FH?[Math.round(K.FH.x),K.FH.y]:null;out.lx=Math.round(l.x);
 K.skip();ok(!K.fin&&K.rst===2,'pulo duplo mudou estado');
 const vw=(w===P?P.vit:E.vit);ok(vw>=1,'vit nao contou');
 n=0;while(K.rst===2&&n++<400)__tick(1);
 ok(K.rst===1,'nao foi para o proximo round (rst='+K.rst+')');ok(K.rd===rd0+1,'rd nao subiu');ok(K.FH===null,'FH vazou para o round');ok(K.FS2.length===0,'FS2 vazou');
 n=0;while(K.rst===1&&n++<400)__tick(1);ok(K.rst===0,'round nao comecou');
 for(let i=0;i<120;i++)__tick(1);ok(K.rst===0&&P.hp>0&&E.hp>0,'round travou ou acabou do nada');
 return out}"""

def jsfix(dur):
    return CHK.replace('FO100d', str(FO100['dur']))

res = []; errs = []
with sync_playwright() as pw:
    b = pw.chromium.launch(args=['--allow-file-access-from-files'])
    pg = b.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.add_init_script(INIT)
    pg.goto('file://' + DST + '/index.html'); pg.wait_for_timeout(500)
    pg.evaluate("d=>window.__FGSTART(d)", 1)
    pg.evaluate("q=>window.__SK.addFO(q)", FO100)
    pg.evaluate("q=>{window.FO100d=q}", FO100['dur'])
    for fk in [1, 2, 3, 4, 5, 100]:
        dur = FO100['dur'] if fk >= 100 else (14 if fk == 5 else 11.5)
        for at in [0.3, dur / 2, dur - 0.6]:
            r = pg.evaluate(jsfix(dur), [fk, at, 0]); res.append(r)
    # varios rounds seguidos pulando, trocando a finalizacao
    seq = pg.evaluate("""()=>{const S=window.__FGSIM,K=window.__SK,P=K.P,E=K.E,out={errs:[]};S.setup(0,0,1,0,0);
      const ks=[2,1,100,3,2,5,4,2];let rd0=K.rd,v0=P.vit+E.vit;
      for(const k of ks){K.setFK(k,0);if(K.rst!==0){out.errs.push('rst '+K.rst+' antes do KO');break}
        E.hp=0;K.ko();let n=0;while(K.fin&&K.fin.t<1.2+(k%3)&&n++<3000)__tick(1);K.skip();
        n=0;while(K.rst!==0&&n++<1200)__tick(1)}
      out.rounds=K.rd-rd0;out.vit=P.vit+E.vit-v0;if(out.rounds!==ks.length)out.errs.push('rounds '+out.rounds);if(out.vit!==ks.length)out.errs.push('vit '+out.vit);return out}""")
    # pulo com o jogo pausado
    pz = pg.evaluate("""()=>{const S=window.__FGSIM,K=window.__SK,E=K.E,out={errs:[]};S.setup(0,0,1,0,0);K.setFK(3,0);E.hp=0;K.ko();for(let i=0;i<90;i++)__tick(1);
      K.paused=true;K.skip();if(K.fin||K.rst!==2)out.errs.push('pulo em pausa falhou');K.paused=false;let n=0;while(K.rst!==0&&n++<800)__tick(1);if(K.rst!==0)out.errs.push('nao voltou apos despausar');return out}""")
    # sair da luta depois de pular
    sx = pg.evaluate("""()=>{const S=window.__FGSIM,K=window.__SK,E=K.E,out={errs:[]};S.setup(0,0,1,0,0);K.setFK(4,0);E.hp=0;K.ko();for(let i=0;i<60;i++)__tick(1);K.skip();K.stop(0);
      if(K.run!==null)out.errs.push('run nao ficou null');for(let i=0;i<30;i++)__tick(1);return out}""")
    # PvP
    pg.reload(); pg.wait_for_timeout(500)
    pg.evaluate("d=>window.__FGSTART2(d)", 1)
    pg.evaluate("q=>window.__SK.addFO(q)", FO100)
    pv = pg.evaluate("""()=>{const S=window.__FGSIM,K=window.__SK,E=K.E,out={errs:[]},W=[];const o=SFX.win;SFX.win=(g,...a)=>{W.push(g);return o.call(SFX,g,...a)};
      S.setup(0,0,1,0,0);if(!K.pvp)out.errs.push('nao e pvp');for(const k of [2,5,100]){K.setFK(k,0);E.hp=0;K.ko();for(let i=0;i<70;i++)__tick(1);K.skip();let n=0;while(K.rst!==0&&n++<800)__tick(1);if(K.rst!==0)out.errs.push('pvp travou fk'+k)}
      out.win=W;if(!W.every(g=>g===true))out.errs.push('som de vitoria pvp errado '+W.join());SFX.win=o;return out}""")
    b.close()

bad = [r for r in res if r['errs']]
for r in res:
    print('fk', r['fk'], 'pulo em %.1fs' % r['at'], 'OK' if not r['errs'] else 'FALHA ' + '; '.join(r['errs']), '| cabeca', r.get('fh'))
print('rounds seguidos:', seq)
print('pausa:', pz); print('sair:', sx); print('pvp:', pv)
print('erros JS da pagina:', errs[:5])
fail = bad or seq['errs'] or pz['errs'] or sx['errs'] or pv['errs'] or errs
print('RESULTADO:', 'FALHOU' if fail else 'TUDO OK (%d cenarios + rounds seguidos + pausa + sair + PvP, 0 erros JS)' % len(res))
sys.exit(1 if fail else 0)
