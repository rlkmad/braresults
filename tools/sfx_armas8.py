# Parte 8 (v1.9.46): impacto proprio por arma (hit_w0..hit_w19) + efeitos especiais (fx_*) + zunido de projetil
# uso: python3 tools/sfx_armas8.py  (grava www/sfx/*.ogg; precisa de numpy e ffmpeg)
import os,re
_src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'sfx_armas.py')).read()
exec(_src.split("def axe()")[0].replace("rng=np.random.default_rng(45)","rng=np.random.default_rng(46)"))
def clicks(d,n,hi=1,lo=0,dec=300):  # estalidos aleatorios (fogo, gelo, raio)
    o=np.zeros(int(SR*d))
    for _ in range(n):
        s=rng.uniform(lo,d-.02);c=noise(.015)*np.exp(-tt(.015)*dec)*rng.uniform(.3,1)*hi;i=int(SR*s);o[i:i+len(c)]+=c[:len(o)-i]
    return o
def thump(d,f0,f1,dec,a=1):
    t=tt(d);return sine(t,sweep(t,f0,f1))*np.exp(-t*dec)*a
def ring(d,parts,dec):
    t=tt(d);return sum(a*np.sin(2*np.pi*f*t)*np.exp(-t*dec*k) for f,a,k in parts)
def burst(d,fc,q,dec,mode='band',a=1):
    t=tt(d);return svf(noise(d),fc,q,mode)*np.exp(-t*dec)*a
# ---------- impactos por arma (id 0-19) ----------
def h0(): D=.26;return burst(D,3200,1.4,30,'band',1)+ring(D,[(1900,.6,1),(3100,.4,1.4),(4700,.2,2)],26)*.6+at(thump(.12,160,60,35,.9),D,0)
def h1(): D=.30;return thump(D,110,45,16,1.3)+burst(D,900,.9,24,'low',1.1)+burst(D,2200,1.2,55,'band',.7)+ring(D,[(1500,.3,1),(2600,.2,1.5)],30)*.5
def h2(): D=.40;return thump(D,75,30,9,1.8)+burst(D,260,.7,18,'low',1.0)+at(burst(.05,1500,1,90,'band',.5),D,0)
def h3(): D=.16;return burst(D,5200,1.8,70,'high',.8)+ring(D,[(4200,.5,1),(6300,.25,1.5)],40)*.5+at(thump(.08,200,100,50,.6),D,0)
def h4(): D=.34;t=tt(D);return thump(D,230,110,26,1.2)+burst(D,1800,1,120,'band',.7)+np.sin(2*np.pi*(780+40*np.sin(2*np.pi*22*t))*t)*np.exp(-t*14)*(1+.7*np.sin(2*np.pi*34*t))*.35
def h5(): D=.42;return at(burst(.12,1400,1.2,60,'band',1)+thump(.12,300,150,40,.9),D,0)+at(bell(.35,1320,[(1,.5,9),(1.5,.35,12),(2,.3,14),(2.76,.2,20)],0),D,.03)
def h6(): D=.40;return ring(D,[(430,1,1),(770,.8,1.3),(1210,.6,1.7),(1730,.4,2.2),(2410,.25,3)],9)*.9+at(thump(.14,140,60,28,1.1),D,0)

def _h7():
    D=.26;o=at(thump(.14,170,70,32,.9),D,.03)
    for i in range(3): o+=at(burst(.03,3800,1.6,110,'high',.9)+ring(.03,[(2600,.5,1)],50)*.4,D,.0+i*.012)
    return o+burst(D,1200,1,30,'band',.25)
def h8(): D=.30;return ring(D,[(1850,1,1),(2780,.7,1.3),(4300,.4,2)],26)*.9+at(burst(.12,700,1,40,'low',1.1)+thump(.12,180,80,40,.8),D,0)+clicks(D,6,.6,0,260)*.6
def h9(): D=.30;return at(burst(.07,1250,1.4,70,'band',1.4),D,0)+at(burst(.04,3500,1,160,'high',.6),D,0)+at(thump(.22,150,70,18,1.1),D,.005)+ring(D,[(480,.3,1)],22)*.4
def h10(): D=.18;return burst(D,2600,1,75,'high',.9)+at(thump(.12,140,70,40,1.1),D,0)+at(burst(.12,900,1,45,'band',.6),D,0)
def h11(): D=.45;return at(burst(.45,1800,.8,12,'low',1.0)+thump(.45,90,35,10,1.3),D,0)+clicks(D,18,.7,.02,200)*.7
def h12(): D=.48;t=tt(D);return svf(noise(D),sweep(t,500,3000),1.2)*env(t,1.6,.14,10)*1.0+clicks(D,24,.9,0,220)+at(thump(.2,130,55,18,.9),D,.01)
def h13(): D=.46;g=sum(np.sin(2*np.pi*rng.uniform(3000,7500)*tt(.2))*np.exp(-tt(.2)*rng.uniform(14,40))*.3 for _ in range(7));return at(g,D,0)+at(burst(.1,4500,1.3,40,'high',.8),D,0)+clicks(D,16,.7,.0,180)*.6+at(thump(.1,220,120,45,.6),D,0)
def h14(): D=.34;t=tt(D);saw=((t*70)%1*2-1);return (saw*(1+.5*np.sign(np.sin(2*np.pi*190*t)))*np.exp(-t*16))*.45+burst(D,3600,1,30,'high',.9)+clicks(D,22,1,0,260)+at(thump(.1,200,90,40,.8),D,0)
def h15(): D=.34;t=tt(D);return svf(noise(D),sweep(t,7000,2800),1.8)*env(t,1.2,.03,22)*.9+ring(D,[(2450,.8,1),(3680,.35,1.4)],12)*.7+at(thump(.08,170,80,45,.5),D,.0)
def h16(): D=.55;t=tt(D);ch=sum(np.sin(2*np.pi*f*d*t)*np.exp(-t*r) for f,d,r in((82.4,1,5),(110,1.02,6),(146.8,.99,6),(196,1.03,7),(246.9,.97,8),(329.6,1.04,9)))*.35;return ch+at(thump(.16,130,60,26,1.0)+burst(.16,700,1,60,'band',.8),D,0)
def h17(): D=.26;return at(burst(.14,1500,.9,34,'band',1.0)+thump(.14,170,85,34,.9),D,0)+svf(noise(D),sweep(tt(D),3000,1200),.9,'high')*env(tt(D),1.2,.02,20)*.25
def h18(): D=.24;return at(thump(.2,125,55,20,1.5)+burst(.2,700,.8,30,'low',.9),D,0)+at(burst(.04,2200,1,110,'band',.8),D,0)
def h19(): D=.60;return at(thump(.15,150,70,30,.9),D,0)+bell(D,880,[(1,1,6),(2,.6,8),(3,.4,11),(4.07,.25,15),(5.4,.15,22)],0)*.7+at(bell(.4,2640,[(1,.25,12),(1.5,.15,18)],0),D,.05)
# ---------- efeitos especiais ----------
def fx_martelo(): D=.60;t=tt(D);return thump(D,60,28,5,1.8)+svf(noise(D),sweep(t,500,90),.9,'low')*env(t,1.5,.05,7)*1.0+clicks(D,10,.6,.05,160)*.5
def fx_bomba(): D=1.0;t=tt(D);return svf(noise(D),sweep(t,3500,90),.8,'low')*env(t,1.2,.02,3.4)*1.3+thump(D,85,26,3.2,1.9)+clicks(D,34,.6,.05,170)*.6+at(burst(.4,900,1,6,'band',.5),D,.12)
def fx_queima(): D=.70;t=tt(D);return svf(noise(D),sweep(t,300,2600),1.1)*env(t,1.6,.12,5)+clicks(D,38,.9,.05,230)+at(thump(.3,110,45,12,.8),D,0)
def fx_gelo(): D=.60;f=[2093,2637,3136,3951];return sum(at(ring(.4,[(x,.5,1),(x*2.01,.2,1.6)],12),D,i*.05) for i,x in enumerate(f))*.5+clicks(D,18,.7,0,200)*.7+burst(D,5500,1.2,12,'high',.2)
def fx_tontura(): D=.80;t=tt(D);v=1+.12*np.sin(2*np.pi*7*t)*np.exp(-t*2);f=sweep(t,520,300)*v;return sine(t,f)*env(t,1.3,.03,3.5)*.7+sine(t,f*1.5)*env(t,1.3,.03,4)*.25+at(thump(.12,260,130,30,.8),D,0)+sum(at(ring(.18,[(g,.5,1)],14),D,.08+i*.14) for i,g in enumerate((1568,1319,1760)))*.3
def fx_katana(): D=.50;t=tt(D);return ring(D,[(3100,.9,1),(4650,.4,1.3),(6200,.2,1.8)],7)*.6+svf(noise(D),sweep(t,8000,3500),2,'band')*env(t,1.2,.02,14)*.5
def fx_tridente(): D=.34;t=tt(D);return svf(noise(D),sweep(t,300,1100),1.1)*env(t,1.5,.14,12)*.9+thump(D,130,55,14,1.0)
def fx_picareta(): D=.30;return ring(D,[(2350,1,1),(3530,.5,1.3),(5100,.3,1.9)],20)*.8+at(burst(.1,1000,1,50,'band',.9),D,0)+clicks(D,4,.5,0,300)
def fx_flecha(): D=.36;t=tt(D);return svf(noise(D),sweep(t,2200,900),3.0)*np.sin(np.pi*t/D)**1.5*.9+np.sin(2*np.pi*sweep(t,1500,700)*t)*np.sin(np.pi*t/D)*.15
def fx_bala(): D=.20;t=tt(D);return svf(noise(D),sweep(t,6000,2500),2.4)*np.sin(np.pi*t/D)**1.3*.9
HITS={f'hit_w{i}':f for i,f in enumerate([h0,h1,h2,h3,h4,h5,h6,_h7,h8,h9,h10,h11,h12,h13,h14,h15,h16,h17,h18,h19])}
FX={k:globals()[k] for k in('fx_martelo','fx_bomba','fx_queima','fx_gelo','fx_tontura','fx_katana','fx_tridente','fx_picareta','fx_flecha','fx_bala')}
OUT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','www','sfx')
for name,fn in {**HITS,**FX}.items():
    x=np.asarray(fn(),dtype=float);x=fade(x.copy());x=x/np.max(np.abs(x))*0.447
    wv=f'/tmp/{name}.wav';w=wave.open(wv,'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype('<i2').tobytes());w.close()
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',wv,'-c:a','libvorbis','-q:a','4',os.path.join(OUT,name+'.ogg')],check=True)
    print(name,round(len(x)/SR,2),'s',round(20*np.log10(np.sqrt(np.mean(x**2))),1),'dB rms')
