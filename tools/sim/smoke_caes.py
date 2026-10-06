import sys
from harness import *
fb=int(sys.argv[1]) if len(sys.argv)>1 else 1
dst='/tmp/simwww_caes'; build_sim_www(dst)
p=dst+'/fight.js'; s=open(p,encoding='utf8').read()
assert 'if(!FIN_OK.includes(FK))FK=1;' in s
s=s.replace('if(!FIN_OK.includes(FK))FK=1;','FK=4;FB=%d;'%fb,1); open(p,'w',encoding='utf8').write(s)
with sync_playwright() as pw:
    b=pw.chromium.launch(args=['--allow-file-access-from-files']); pg=b.new_page(viewport={'width':800,'height':400}); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('file://'+dst+'/index.html'); pg.wait_for_timeout(500); pg.evaluate("d=>window.__FGSTART(d)",1); pg.wait_for_timeout(1500)
    pg.evaluate("()=>{const S=__FGSIM;S.E.hp=-5;S.P.hp=Math.max(S.P.hp,50);console.log(S.rst)}"); pg.wait_for_timeout(200); print("rst0",pg.evaluate("()=>__FGSIM.rst"))
    marks=[1.2,2.0,3.2,4.4,5.6,6.8,7.6,8.6]; t0=0
    import time; st=time.time()
    for m in marks:
        while time.time()-st<m+0.2: time.sleep(.02)
        pg.screenshot(path='/tmp/caes_%d_%s.png'%(fb,m)); 
    print('rst',pg.evaluate("()=>__FGSIM.rst"))
    pg.wait_for_timeout(5000); print('rst after',pg.evaluate("()=>__FGSIM.rst"),'erros JS:',errs); b.close()
