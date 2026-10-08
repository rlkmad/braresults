# Gera os 6 sons de ataque proprios (v1.9.45): swing_axe, swing_hammer, swing_pick, swing_staff, swing_book, swing_scepter
# uso: python3 tools/sfx_armas.py  (grava www/sfx/*.ogg; precisa de numpy e ffmpeg)
import numpy as np, subprocess, os, wave
SR=44100
rng=np.random.default_rng(45)
def tt(d): return np.arange(int(SR*d))/SR
def noise(d): return rng.uniform(-1,1,int(SR*d))
def svf(x,fc,q,mode='band'):
    # filtro de variavel de estado; fc pode ser vetor (varredura)
    fc=np.broadcast_to(fc,x.shape);lo=bp=0.0;out=np.empty_like(x)
    for i,v in enumerate(x):
        f=2*np.sin(np.pi*min(fc[i],SR*.2)/SR);hi=v-lo-bp/q;bp+=f*hi;lo+=f*bp
        out[i]={'band':bp,'low':lo,'high':hi}[mode]
    return out
def sweep(t,a,b): return a*(b/a)**(t/t[-1])
def env(t,att,pk,dec):  # sobe ate pk, cai exponencial
    e=np.where(t<pk,(t/pk)**att,np.exp(-(t-pk)*dec));return e
def sine(t,f,ph=0): return np.sin(2*np.pi*np.cumsum(np.broadcast_to(f,t.shape))/SR+ph)
def at(sig,total,start):
    o=np.zeros(int(SR*total));s=int(SR*start);o[s:s+len(sig)]+=sig[:len(o)-s];return o
def bell(d,f0,parts,dec):
    t=tt(d);return sum(a*np.sin(2*np.pi*f0*r*t)*np.exp(-t*dc) for (r,a,dc) in parts)
def fade(x,ms=4):
    n=int(SR*ms/1000);x[:n]*=np.linspace(0,1,n);x[-n:]*=np.linspace(1,0,n);return x
def axe():
    D=.34;t=tt(D);w=svf(noise(D),sweep(t,250,1400),1.6)*env(t,2,.2,30)
    tc=tt(.16);chop=sine(tc,sweep(tc,150,55))*np.exp(-tc*28)*1.4+svf(noise(.16),600,.8,'low')*np.exp(-tc*45)
    return w*1.0+at(chop,D,.19)
def hammer():
    D=.44;t=tt(D);w=svf(noise(D),sweep(t,110,650),1.2)*env(t,2.2,.3,24)*1.2
    tc=tt(.22);th=sine(tc,sweep(tc,85,32))*np.exp(-tc*16)*1.8+svf(noise(.22),300,.7,'low')*np.exp(-tc*30)*.9
    return w+at(th,D,.29)
def pick():
    D=.30;t=tt(D);w=svf(noise(D),sweep(t,500,2300),2.2)*env(t,2,.15,32)*.8
    tc=tt(.14);ti=sum(a*np.sin(2*np.pi*f*tc) for f,a in((1870,1),(2790,.6),(4210,.4)))*np.exp(-tc*38)+noise(.14)*np.exp(-tc*160)*.5
    return w+at(ti,D,.16)*.9
def staff():
    D=.40;t=tt(D);vib=1+.015*np.sin(2*np.pi*14*t);f=sweep(t,350,1000)*vib
    s=(sine(t,f)+.5*sine(t,f*2)+.25*sine(t,f*3))*env(t,1.5,.18,9)*.55
    air=svf(noise(D),sweep(t,1200,4000),1.5,'high')*env(t,1.5,.2,12)*.12
    sp=np.zeros_like(t)
    for st in (.12,.2,.27,.33):
        d=tt(.06);sp+=at(np.sin(2*np.pi*rng.uniform(2200,4200)*d)*np.exp(-d*60),D,st)*.25
    return s+air+sp
def book():
    D=.30;t=tt(D);n=svf(noise(D),1800,.9,'high')
    am=.55+.45*np.sign(np.sin(2*np.pi*34*t+rng.uniform(0,6)));w=n*am*env(t,1.2,.1,10)*.7
    w+=svf(noise(D),sweep(t,900,3200),1.4)*env(t,1.5,.14,22)*.6
    sl=tt(.08);slap=svf(noise(.08),1300,1.1)*np.exp(-sl*55)*1.4+sine(sl,180)*np.exp(-sl*40)*.5
    return w+at(slap,D,.2)
def scepter():
    D=.46;t=tt(D);w=svf(noise(D),sweep(t,600,1800),1.3)*env(t,2,.12,22)*.35
    b=bell(.4,660,[(1,1,7),(1.5,.6,9),(2,.5,11),(3,.3,16),(4.02,.18,24)],0)
    return w+at(b,D,.04)*.85+at(bell(.3,1320,[(1,.35,10),(1.5,.2,14)],0),D,.1)
OUT=os.path.join(os.path.dirname(__file__),'..','www','sfx')
for name,fn in dict(swing_axe=axe,swing_hammer=hammer,swing_pick=pick,swing_staff=staff,swing_book=book,swing_scepter=scepter).items():
    x=fade(fn());x=x/np.max(np.abs(x))*0.447  # pico -7 dB, igual aos swings atuais
    wv=f'/tmp/{name}.wav';w=wave.open(wv,'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype('<i2').tobytes());w.close()
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',wv,'-c:a','libvorbis','-q:a','4',os.path.join(OUT,name+'.ogg')],check=True)
    print(name,round(len(x)/SR,2),'s')
