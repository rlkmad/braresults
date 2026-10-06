from harness import *
dst='/tmp/simwww_aw'; build_sim_www(dst)
with sync_playwright() as pw:
    b=pw.chromium.launch(args=['--allow-file-access-from-files']); pg=b.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e))); pg.add_init_script(INIT)
    pg.goto('file://'+dst+'/index.html'); pg.wait_for_timeout(400); pg.evaluate("d=>window.__FGSTART(d)",1)
    for kind in ('flavio','lula'):
        out=[]
        for seed in range(40):
            out.append(pg.evaluate("""([k,s,w])=>{__seed(s);const S=__FGSIM;S.setLV(1);S.setup(w,-1,(w+7)%20,-1,s%5);S.E.aw=k;S.E.awC=0;
              let fr=0,mx=[0,0];while(fr<14400&&S.P.hp>0&&S.E.hp>0){__tick(6);fr+=6}
              return [+(fr/60).toFixed(0),S.P.hp>0?(S.E.hp>0?'timeout':'P'):'E',Math.round(S.P.hp),Math.round(S.E.hp)]}""",[kind,seed,seed%20]))
        print(kind,'desperto vence',sum(o[1]=='E' for o in out),'/',len(out),'mediana',sorted(o[0] for o in out)[len(out)//2],'s')
    pass
    print('erros JS:',errs); b.close()
