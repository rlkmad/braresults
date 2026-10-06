import sys, json
from harness import *
w1,w2,mp,seed=map(int,sys.argv[1:5]); df=int(sys.argv[5]) if len(sys.argv)>5 else 1
dst='/tmp/simwww_dbg'; build_sim_www(dst)
with sync_playwright() as pw:
    b=pw.chromium.launch(args=['--allow-file-access-from-files']); pg=b.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.add_init_script(INIT)
    pg.goto('file://'+dst+'/index.html'); pg.wait_for_timeout(400); pg.evaluate("d=>window.__FGSTART(d)",df)
    pg.evaluate("([a,b,c,d,e,s])=>{__seed(s);__FGSIM.setLV(1);__FGSIM.setup(a,-1,b,-1,c)}",[w1,w2,mp,0,0,seed])
    for i in range(24):
        pg.evaluate("__tick(300)")
        print(pg.evaluate("()=>{const S=__FGSIM,P=S.P,E=S.E;const f=q=>`x=${q.x|0} y=${q.y|0} hp=${q.hp|0} cd=${q.cd.map(c=>c.toFixed(1))} stun=${q.stun.toFixed(1)} blk=${q.blk?1:0} atk=${q.atk>0?1:0}`;return 'mt='+S.mt.toFixed(0)+' | P '+f(P)+' | E '+f(E)+' PR='+S.PR.length}"))
    print(errs); b.close()
