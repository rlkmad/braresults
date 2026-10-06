import sys, json
from playwright.sync_api import sync_playwright
src=sys.argv[1]
JS=r"""
async (code)=>{
 const SR=44100, DUR=4;
 const calls={
  ui:'SFX.p("ui")',back:'SFX.p("back")',select:'SFX.p("select")',start:'SFX.p("start")',jump:'SFX.p("jump")',dash:'SFX.p("dash")',dodge:'SFX.p("dodge")',
  block:'SFX.p("block")',reflect:'SFX.p("reflect")',boom:'SFX.p("boom")',round:'SFX.p("round")',fight:'SFX.p("fight")',ko:'SFX.p("ko")',
  hit_low:'SFX.hit(8,"a",0,1)',hit_mid:'SFX.hit(25,"a",200,2)',hit_big:'SFX.hit(60,"p",600,3)',swing:'SFX.swing(4)',
  pw_P:'SFX.pw("P",5,0,false)',pw_Z:'SFX.pw("Z",12,1,false)',pw_A:'SFX.pw("A",20,0,false)',pw_B:'SFX.pw("B",31,2,true)',pw_H:'SFX.pw("H",14,1,false)',pw_S:'SFX.pw("S",40,1,false)',pw_D:'SFX.pw("D",8,2,false)',pw_M:'SFX.pw("M",33,1,false)',
  awaken:'SFX.awaken(1)',ult1:'SFX.ult(1)',ult2:'SFX.ult(2)',winG:'SFX.win(true,0)',winB:'SFX.win(false,0)'};
 const out={};
 for(const [k,c] of Object.entries(calls)){
  const off=new OfflineAudioContext(1,SR*DUR,SR);
  const w={};
  const f=new Function('window','addEventListener','performance',code+';return window.SFX');
  const win={AudioContext:function(){return off},webkitAudioContext:undefined};
  const perf={now:()=>1e6+Math.random()*0};
  const S=f(win,()=>{},perf);
  S.cfg(70,'s');
  new Function('SFX',c)(S);
  const buf=await off.startRendering(); const d=buf.getChannelData(0);
  let pk=0,ss=0,n=0,last=0; for(let i=0;i<d.length;i++){const a=Math.abs(d[i]);if(a>pk)pk=a;ss+=d[i]*d[i];if(a>.002)last=i}
  // spectrum via naive DFT bands using biquad-ish: use FFT size 2^15 over whole signal
  const N=1<<17, re=new Float64Array(N), im=new Float64Array(N); for(let i=0;i<Math.min(d.length,N);i++)re[i]=d[i];
  (function fft(re,im){const n=re.length;for(let i=1,j=0;i<n;i++){let b=n>>1;for(;j&b;b>>=1)j^=b;j^=b;if(i<j){[re[i],re[j]]=[re[j],re[i]];[im[i],im[j]]=[im[j],im[i]]}}
   for(let l=2;l<=n;l<<=1){const a=-2*Math.PI/l,wr=Math.cos(a),wi=Math.sin(a);for(let i=0;i<n;i+=l){let cr=1,ci=0;for(let j=0;j<l/2;j++){const u=i+j,v=i+j+l/2,xr=re[v]*cr-im[v]*ci,xi=re[v]*ci+im[v]*cr;re[v]=re[u]-xr;im[v]=im[u]-xi;re[u]+=xr;im[u]+=xi;const t=cr*wr-ci*wi;ci=cr*wi+ci*wr;cr=t}}}})(re,im);
  let e=[0,0,0,0]; for(let i=1;i<N/2;i++){const f=i*SR/N,p=re[i]*re[i]+im[i]*im[i];e[f<150?0:f<400?1:f<2000?2:3]+=p}
  const tot=e.reduce((a,b)=>a+b,0)||1;
  out[k]={peak:+pk.toFixed(3),rmsdb:+(10*Math.log10(ss/d.length+1e-12)).toFixed(1),len:+(last/SR).toFixed(2),lo:+(100*e[0]/tot).toFixed(0),lm:+(100*e[1]/tot).toFixed(0),mid:+(100*e[2]/tot).toFixed(0),hi:+(100*e[3]/tot).toFixed(0)};
 }
 return out}
"""
with sync_playwright() as pw:
    b=pw.chromium.launch(); pg=b.new_page(); pg.goto('about:blank')
    r=pg.evaluate(JS,open(src).read())
    print('%-9s %6s %7s %5s | %4s %4s %4s %4s  (energia %% <150 / 150-400 / 400-2k / >2k Hz)'%('som','pico','rms dB','dur','lo','lm','mid','hi'))
    for k,v in r.items(): print('%-9s %6.3f %7.1f %5.2f | %4d %4d %4d %4d'%(k,v['peak'],v['rmsdb'],v['len'],v['lo'],v['lm'],v['mid'],v['hi']))
    b.close()
