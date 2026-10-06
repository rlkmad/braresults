/* sfx.js - efeitos sonoros do jogo "Lutar" (sintetizados por WebAudio: nenhum arquivo de áudio, ~0 KB extra de assets).
   API (tudo seguro mesmo sem áudio): SFX.cfg(vol0a100,on) SFX.p(nome) SFX.ui(acao) SFX.hit SFX.swing SFX.pw SFX.awaken
   SFX.ult SFX.ko SFX.win SFX.fin SFX.stop SFX.hold(pausa) */
(function(){
const S={on:true,vol:.7},MG=2.2;let C=null,M=null,B=null,NB=null,voices=0,gen=0,held=0;const last={};
const ctx=()=>{if(C)return C;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
  try{C=new AC()}catch(e){return null}
  M=C.createGain();M.gain.value=S.vol*S.vol*MG;const cp=C.createDynamicsCompressor();cp.threshold.value=-14;cp.knee.value=8;cp.ratio.value=8;cp.attack.value=.003;cp.release.value=.14;
  const lm=C.createDynamicsCompressor();lm.threshold.value=-2;lm.knee.value=0;lm.ratio.value=20;lm.attack.value=.001;lm.release.value=.08;M.connect(cp);cp.connect(lm);lm.connect(C.destination);
  B=C.createGain();B.connect(M);
  NB=C.createBuffer(1,C.sampleRate,C.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return C};
const ok=dl=>{const c=ctx();return c&&S.on&&S.vol>0&&(dl||voices<28)?c:null};
/* tom: f0->f1 Hz, dur s, tipo, volume, atraso, ataque */
const T=(f0,f1,dur,type,v,dl,att)=>{const c=ok(dl);if(!c)return;const t=c.currentTime+(dl||0)+.004,o=c.createOscillator(),g=c.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f0,t);
  if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+(att<0?dur*.9:Math.min(att||.005,dur*.5)));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  o.connect(g);g.connect(B);const gq=gen;o.start(t);o.stop(t+dur+.03);voices++;o.onended=()=>{if(gq===gen)voices=Math.max(0,voices-1);try{g.disconnect()}catch(e){}}};
/* ruído filtrado */
const N=(dur,ft,f0,f1,q,v,dl,att)=>{const c=ok(dl);if(!c)return;const t=c.currentTime+(dl||0)+.004,s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=NB;s.loop=true;
  fl.type=ft;fl.Q.value=q||1;fl.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)fl.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+(att<0?dur*.9:Math.min(att||.004,dur*.5)));g.gain.exponentialRampToValueAtTime(.0001,t+dur);
  s.connect(fl);fl.connect(g);g.connect(B);const gq=gen;s.start(t,Math.random()*.6);s.stop(t+dur+.03);voices++;s.onended=()=>{if(gq===gen)voices=Math.max(0,voices-1);try{g.disconnect()}catch(e){}}};
const G=(g,fn)=>{const c=ctx();if(!c||!B||g===1)return fn();const pb=B,x=c.createGain();x.gain.value=g;x.connect(pb);B=x;try{fn()}finally{B=pb}};
const th=(n,ms)=>{const t=performance.now();if(last[n]&&t-last[n]<ms)return 1;last[n]=t;return 0};
/* id de poder/arma pode vir como texto ('swSpin'): vira número estável (antes virava NaN e todos os poderes soavam iguais) */
const H=id=>typeof id==='number'&&isFinite(id)?id:[...String(id==null?0:id)].reduce((h,c)=>(Math.imul(h,31)+c.charCodeAt(0))>>>0,7);
const R=id=>(Math.imul(H(id),2654435761)>>>0)/4294967296;
/* ---- blocos reutilizáveis ---- */
const thud=(v,dl)=>{T(170,50,.16,'sine',.4*v,dl);T(340,120,.1,'triangle',.3*v,dl);N(.08,'lowpass',2800,300,.7,.4*v,dl);N(.02,'highpass',2500,2500,.8,.25*v,dl)};
const boom=(v,dl,len)=>{len=len||.7;N(len,'lowpass',2800,100,.8,.55*v,dl);T(95,30,len*.8,'sine',.45*v,dl);T(190,60,len*.6,'triangle',.4*v,dl);N(len*.55,'bandpass',900,200,.9,.42*v,dl);N(.12,'highpass',1500,4000,1,.3*v,dl)};
const splat=(v,dl)=>{N(.22,'lowpass',1500,200,1,.4*v,dl);T(130,45,.25,'sine',.35*v,dl)};
const bark=dl=>{T(320,130,.17,'sawtooth',.22,dl);N(.13,'bandpass',900,450,3,.2,dl)};
const jingle=(good,dl)=>{dl=dl||0;if(good){[523,659,784,1047].forEach((f,i)=>T(f,f,.28,'triangle',.2,dl+i*.11,.01));T(1047,1047,.7,'triangle',.18,dl+.44);T(523,523,.7,'sine',.12,dl+.44)}
  else{[392,370,330,262].forEach((f,i)=>T(f,f*.98,.3,'triangle',.18,dl+i*.16,.01));T(131,131,.9,'sine',.2,dl+.64);T(262,262,.9,'triangle',.14,dl+.64)}};
const SND={
  ui:()=>T(700,920,.07,'square',.1),
  back:()=>T(560,340,.08,'square',.09),
  select:()=>{T(880,1320,.06,'triangle',.13);T(1320,1760,.08,'triangle',.1,.05)},
  start:()=>{T(440,880,.16,'square',.12);T(660,1320,.2,'triangle',.1,.07)},
  jump:()=>{T(260,640,.15,'sine',.18);N(.08,'highpass',2500,5000,1,.06)},
  dash:()=>N(.22,'bandpass',500,2800,1.4,.3),
  dodge:()=>{N(.2,'bandpass',1600,400,2,.2);T(900,1500,.12,'sine',.08)},
  block:()=>{T(1500,1100,.12,'triangle',.14);T(900,700,.07,'square',.1);N(.06,'highpass',3500,3500,1,.16)},
  reflect:()=>{T(1200,2400,.22,'sine',.18);T(1800,3600,.25,'triangle',.11,.05)},
  boom:()=>boom(.8,0,.6),
  round:()=>{T(330,330,.2,'square',.1);T(330,330,.2,'square',.1,.28)},
  fight:()=>{T(196,190,1.2,'triangle',.3);T(392,390,.9,'sine',.14);N(.3,'bandpass',3200,1000,1,.15);thud(.7)},
  ko:()=>{boom(1,0,.9);T(1000,200,.5,'sawtooth',.09);T(220,60,1,'sine',.3,.1)}
};
const TR={ui:7.5,back:8,select:2,start:1.5,jump:3.6,dash:9.6,dodge:7.4,block:7.5,reflect:2.6,round:2.2,fight:1.9,boom:1.8,ko:1.2};
const TP={P:4,Z:4,A:2.6,M:2.6,B:1.05,H:1.6,S:6.5,D:12};
const API={
  cfg(v,on){S.vol=Math.max(0,Math.min(1,(v==null?70:+v)/100));S.on=on!=='n'&&on!==false;if(M)M.gain.value=S.vol*S.vol*MG},
  unlock(){if(held)return;const c=ctx();if(c&&c.state!=='running')try{c.resume()}catch(e){}},
  p(n){const f=SND[n];if(f&&!th('p'+n,60))try{G(TR[n]||1,f)}catch(e){}},
  ui(a){const m={menu:'back',exit:'back',pback:'back',go:'start',play:'start',pick:'select',pok:'select',slot:'select',pnav:'select'};API.p(m[a]||'ui')},
  /* golpe recebido: d=dano, k='p' poder, kb=empurrão, wi=arma do atacante */
  hit(d,k,kb,wi){if(th('h',38))return;G(2.6,()=>API._hit(d,k,kb,wi))},
  _hit(d,k,kb,wi){const s=Math.min(1,(d||10)/60+(kb||0)/800);
    T(190+R((wi||0)+3)*60,52,.12+.12*s,'sine',.32+.3*s);T(380+R((wi||0)+5)*90,120,.08+.08*s,'triangle',.16+.14*s);N(.06+.07*s,'lowpass',3200,320,.7,.25+.3*s);N(.014,'highpass',2800,2800,.8,.2+.2*s);
    if(s>.55){T(95,38,.28,'sawtooth',.16);N(.1,'highpass',1200,3000,1,.18)}
    if(k==='p')T(900+R(wi||1)*500,420,.12,'triangle',.07)},
  swing(wi){if(th('s',50))return;G(14,()=>API._sw(wi))},
  _sw(wi){const f=650+R((wi||0)+11)*900;N(.15,'bandpass',f,f*2.3,2,.22)},
  /* poder: kind (letra), id único (0-59), i slot, aw=despertado */
  pw(kind,id,i,aw){if(th('w',45))return;G(TP[kind]||3.5,()=>API._pw(kind,id,i,aw))},
  _pw(kind,id,i,aw){id=H(id||0);const r=R(id+7),f=210+r*620,ty=['sawtooth','square','triangle','sine'][id%4];
    if(kind==='H'){[523,659,784].forEach((q,j)=>T(q,q*1.01,.22,'sine',.16,j*.08));return}
    if(kind==='S'){T(280,620,.35,'triangle',.18);N(.3,'bandpass',1800,3000,3,.1);return}
    if(kind==='D'){SND.dash();T(f,f*1.8,.12,ty,.1);return}
    const iv=[1.5,1.25,2,1.33,1.78][id%5],du=.22+R(id+3)*.2;
    if(kind==='M'){for(let j=0;j<3;j++){T(f*1.2,f*.6,.07,'square',.13,j*.07);N(.05,'highpass',2500,4000,1,.14,j*.07)}return}
    if(kind==='A'){N(.13,'bandpass',f,f*2.5,2,.26);T(f*.8,f*.4,.12,ty,.14);thud(.7,.1);return}
    N(du,'bandpass',f,f*(r>.5?3.2:.35),1.6,.22);T(f,f*(r>.5?2.2:.45),du,ty,.2);T(f*iv,f*iv*(r>.5?2:.5),du*.8,'sine',.09,.03);
    if(kind==='Z'){T(f*3,f*3.2,.3,'sine',.08,.04);N(.25,'highpass',5000,7000,1,.1)}
    if(kind==='B')boom(.35,.12,.4);
    if(aw)T(f*2,f*4,.35,'sine',.07,.05)},
  awaken(k){G(.85,()=>API._aw(k))},
  _aw(k){T(60,130,1.3,'sawtooth',.22,0,.4);T(200,1700,1,'sawtooth',.12,0,.4);N(1.1,'lowpass',300,3500,1,.28,0,.5);
    [392,523,659].forEach((f,i)=>T(f,f,.9,'triangle',.14,.8+i*.04,.05));boom(.7,.8,.8)},
  /* pausa do jogo: congela o relógio de áudio (sons agendados das finalizações/cutscenes param junto) */
  hold(on){held=on?1:0;if(!C)return;try{on?C.suspend():C.resume()}catch(e){}},
  ult(n){G({1:2.1,2:1.2,3:1.4,4:2.5,5:3}[n]||1,()=>API._ult(n))},
  _ult(n){if(n===1){T(110,1100,2.1,'sawtooth',.2,0,-1);T(55,170,2.1,'sine',.25,0,-1);N(2.1,'bandpass',200,4500,2,.22,0,-1)}
    else if(n===3){T(260,780,.45,'triangle',.2);N(.35,'bandpass',800,3200,2,.18,0,.1);[660,880,1320].forEach((f,i)=>T(f,f,.3,'triangle',.1,i*.06))}
    else if(n===4){N(.35,'bandpass',300,2600,1.4,.3);T(200,70,.25,'sine',.35);T(500,1500,.3,'sawtooth',.08)}
    else if(n===5){N(.1,'highpass',2500,6000,1,.4);T(1100,140,.12,'sawtooth',.22);N(.2,'lowpass',2200,200,.8,.3);T(140,50,.14,'sine',.3)}
    else{boom(1,0,1);T(60,25,1,'sine',.35);T(180,60,.8,'triangle',.3);N(.6,'bandpass',800,150,1,.3);T(1800,300,.5,'sawtooth',.1)}},
  ko(){API.p('ko')},
  win(good,dl){G(1.4,()=>jingle(good,dl==null?.7:dl))},
  /* finalizações: tudo agendado no relógio de áudio com os tempos de cada cena (FK 1-5) */
  fin(fk,fb,good){API.stop();G(TR.ko,SND.ko);
    if(fk===1){for(let t=.7,i=0;t<8;i++){const u=(t-.7)/7.3;thud(.4+.5*u,t);if(fb&&i%3===0)splat(.4,t+.02);t+=.11-.05*u}
      T(200,1900,1.7,'sawtooth',.09,6.3,.8);boom(1.1,8,1.2);splat(1,8.02);jingle(good,8.9)}
    else if(fk===2){N(.5,'highpass',3000,7000,1,.22,.9);T(2400,3400,.45,'sine',.09,.9);N(.28,'bandpass',500,3200,2,.4,3);N(.12,'highpass',4000,8000,1,.5,3.2);T(2000,900,.3,'triangle',.2,3.2);thud(1,3.3);
      if(fb)splat(1,3.35);T(100,45,.25,'sine',.5,4.8);thud(.6,4.85);if(fb)splat(.7,5);T(1800,1800,.05,'square',.14,6.6);jingle(good,7.6)}
    else if(fk===3){T(100,1400,2,'sawtooth',.16,1,.9);N(2,'bandpass',300,5200,2,.22,1,.9);N(.15,'highpass',2000,6000,1,.6,3);boom(1.1,3,1.5);T(120,120,2,'sawtooth',.1,3);
      for(let t=3;t<5;t+=.09)N(.04,'highpass',3000,5000,1,.18,t);N(1.3,'bandpass',4200,500,1.5,.28,5);jingle(good,7.4)}
    else if(fk===4){[1,1.4,1.8].forEach(t=>bark(t));N(1.6,'highpass',2000,2200,.8,.13,.9);
      [2.4,2.52,2.8,3.08,3.38,3.67,3.97,4.25,4.53,4.83].forEach(t=>{thud(.55,t+.03);T(95,70,.3,'sawtooth',.13,t+.03);if(fb)splat(.45,t+.08)});
      for(let t=5;t<6.4;t+=.14){N(.06,'bandpass',1500,600,2,.3,t);T(210,100,.05,'square',.12,t+.07)}
      for(let i=0;i<5;i++)T(1100+R(i+5)*900,900,.05,'triangle',.1,6.4+i*.05);
      T(350,620,.8,'sine',.22,6.8,.2);T(640,430,.9,'sine',.18,7.3);N(.6,'bandpass',1500,300,1,.3,7.2);jingle(good,7.6)}
    else if(fk===5){T(1000,1000,.1,'square',.14,.9);T(900,900,.06,'square',.1,1.9);for(let t=1.8;t<3.6;t+=.3)T(1400,1400,.05,'square',.09,t);
      T(2200,500,1.6,'sine',.18,2);N(1.6,'bandpass',3000,800,2,.12,2);
      N(.2,'highpass',1500,4000,1,.7,3.6);N(2.6,'lowpass',3000,60,.7,.85,3.6);T(70,22,2.3,'sine',.8,3.6);T(45,30,3,'sawtooth',.2,3.6,.5);
      N(.8,'bandpass',200,2000,1,.25,6.4,.3);T(50,50,2.4,'sine',.28,7.2,.5);N(.3,'lowpass',400,200,1,.4,7.6);N(.3,'lowpass',400,200,1,.4,8.4);
      boom(1.2,9.6,2.2);T(55,18,2.4,'sine',.8,9.6);N(.8,'bandpass',2000,200,1,.22,11.4);jingle(good,12.4)}},
  stop(){if(!C)return;held=0;if(C.state==='suspended')try{C.resume()}catch(e){}gen++;try{B.disconnect()}catch(e){}B=C.createGain();B.connect(M);voices=0}
};
window.SFX=API;
if(typeof document!=='undefined')document.addEventListener('visibilitychange',()=>{if(!C)return;try{if(document.hidden)C.suspend();else if(!held)C.resume()}catch(e){}});
/* navegadores/WebView só liberam áudio após um toque: destrava no primeiro gesto */
['pointerdown','touchstart','keydown','click'].forEach(e=>addEventListener(e,()=>API.unlock(),{capture:true,passive:true}));
})();
