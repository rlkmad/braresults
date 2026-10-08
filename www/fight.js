/* Braresults — Jogo de luta v2 · Parte 1: paisagem, menu, opções de HUD, carregamento, seleção de candidato por cargo */
(()=>{
const W=800,H=450,GY=380,G=1900,WW=1600;
const imgs={};
const getImg=u=>{if(!u)return null;if(!imgs[u]){const i=new Image();i.src=u;imgs[u]=i}const i=imgs[u];return i.complete&&i.naturalWidth?i:null};
const ST={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('fg.'+k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem('fg.'+k,JSON.stringify(v))}catch{}}};
const OPT={fps:'n',fsk:'p',side:'r',size:1,bars:'k',sj:'n',ind:'s',snap:'s',vib:'s',lay:null,vol:70,snd:'s',...ST.get('opt',{})};SFX.cfg(OPT.vol,OPT.snd);
let CAND=null,CAND2=null,ENM=null,PL=1,WP=0,AC=0,WP2=1,AC2=1,MP=0,DF=1,MD=0,ENW=-1,ENA=-1,CPW=-1,CPA=-1,CPF=-1,CPFR=-1,AW='auto',AW2='auto',AWE='auto',FKU=null,run=null,TRN=0,MPS=null;
let CG='presidente',UF=(typeof S!=='undefined'&&S.uf)||'sp',Q='',LIST=[],LOADING=0,ERRM='',SHOW=60,MR=null;const LC={};
const nz=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const E=s=>esc(s);

/* ---- v1.6.2 · helpers de cor e textura ---- */
const HXC={};const hx3=c0=>{if(HXC[c0])return HXC[c0];let c=String(c0||'#fff');if(c[0]!=='#')return null;if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return(HXC[c0]=[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)])};
const hexA=(c,a)=>{const v=hx3(c);return v?`rgba(${v[0]},${v[1]},${v[2]},${Math.max(0,Math.min(1,a))})`:c};
const shd=(c,a)=>{const v=hx3(c);if(!v)return c;const t=a<0?0:255,k=Math.abs(a);return'#'+v.map(n=>Math.round(n+(t-n)*k).toString(16).padStart(2,'0')).join('')};
const rn=i=>{const q=Math.sin(i*127.1+311.7)*43758.5453;return q-Math.floor(q)};
const GLW={},glow=c=>{if(!GLW[c]){const k=document.createElement('canvas');k.width=k.height=64;const g=k.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.2,hexA(c,.95));r.addColorStop(.55,hexA(c,.35));r.addColorStop(1,hexA(c,0));g.fillStyle=r;g.fillRect(0,0,64,64);GLW[c]=k}return GLW[c]};
const EMC={'🌙':'#8ff','🪓':'#cfd8e6','🗡️':'#cfe','🔥':'#ff8a1f','📜':'#ffe9a0','📄':'#fff','💣':'#ff9a2a','🎵':'#c9f','🌊':'#4ac8ff','trTide':'#4ac8ff','bmGren':'#ff9a2a','swWave':'#8ff','axBoom':'#cfd8e6','dgFan':'#cfe','stFire':'#ff8a1f',bala:'#ffb347',flecha:'#f1e6c8','flBall':'#ff6a1f','pkRock':'#c8a070','btRico':'#fff','ktStar':'#bfd4ff','gtWave':'#c9f','bkPaper':'#fff','crDecree':'#ffe9a0','✴️':'#ffe27a','⚾':'#fff','☄️':'#ff7a2a','🪨':'#c8a070'};
/* desenhos proprios dos projeteis (no lugar de emoji); origem = centro do projetil, hitbox nao muda */
const DRW={
bala:(x,q,tm)=>{x.rotate(Math.atan2(q.vy,q.vx));
  const g=x.createLinearGradient(-30,0,-4,0);g.addColorStop(0,'rgba(255,200,90,0)');g.addColorStop(1,'rgba(255,225,140,.85)');
  x.fillStyle=g;x.beginPath();x.moveTo(-4,-1.6);x.lineTo(-30,0);x.lineTo(-4,1.6);x.closePath();x.fill();
  const b=x.createLinearGradient(0,-2.8,0,2.8);b.addColorStop(0,'#ffe9b0');b.addColorStop(.45,'#d79a3a');b.addColorStop(1,'#7a4a14');
  x.fillStyle=b;x.beginPath();x.moveTo(-5,-2.8);x.lineTo(2,-2.8);x.quadraticCurveTo(8,-2,9,0);x.quadraticCurveTo(8,2,2,2.8);x.lineTo(-5,2.8);x.closePath();x.fill();
  x.strokeStyle='#5a3208';x.lineWidth=.7;x.stroke();x.fillStyle='rgba(255,255,255,.7)';x.fillRect(-4,-2,8,.9)},
flecha:(x,q,tm)=>{x.rotate(Math.atan2(q.vy,q.vx));x.lineCap='round';x.lineJoin='round';
  [[-1,'#e23b3b'],[1,'#f1efe6']].forEach(([m,c])=>{x.fillStyle=c;x.beginPath();x.moveTo(-13,0);x.lineTo(-16.5,m*4.6);x.lineTo(-23.5,m*4.6);x.lineTo(-20,0);x.closePath();x.fill();x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=.6;x.stroke()});
  x.strokeStyle='#8a5a2b';x.lineWidth=2;x.beginPath();x.moveTo(-21,0);x.lineTo(14,0);x.stroke();
  x.strokeStyle='#d9a566';x.lineWidth=.7;x.beginPath();x.moveTo(-19,-.5);x.lineTo(13,-.5);x.stroke();
  const h=x.createLinearGradient(0,-3.4,0,3.4);h.addColorStop(0,'#fff');h.addColorStop(.5,'#cdd6e2');h.addColorStop(1,'#7e8a9c');
  x.fillStyle=h;x.beginPath();x.moveTo(12,-3.4);x.lineTo(24,0);x.lineTo(12,3.4);x.lineTo(15,0);x.closePath();x.fill();x.strokeStyle='#4b5563';x.lineWidth=.8;x.stroke()},
crGuard:(x,h,gx,gy)=>{const s=h.sx||1,tm=performance.now(),rc=h.rc||0,rk=rc>0?Math.sin(rc/.22*Math.PI*.5):0,
  al=Math.min(1,h.t/.2,h.e?Math.max(0,(h.e-h.t)/.25):1),br=Math.sin(tm/420)*.7;
  x.save();x.globalAlpha=al;x.translate(gx,gy);
  x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(0,1,15,3.5,0,0,7);x.fill();
  x.scale(s,1);x.translate(-rk*3,br*.4);x.lineJoin='round';x.lineCap='round';
  x.fillStyle='#161a28';x.fillRect(-6,-17,5,15);x.fillRect(1,-17,5,15);x.fillStyle='#05060a';x.fillRect(-7,-3,6.5,3.5);x.fillRect(.5,-3,6.5,3.5);
  const cg=x.createLinearGradient(-8,0,8,0);cg.addColorStop(0,'#e0343c');cg.addColorStop(1,'#a8161f');
  x.fillStyle=cg;x.beginPath();x.moveTo(-8,-16);x.lineTo(-7,-36);x.quadraticCurveTo(0,-39,7,-36);x.lineTo(8,-16);x.closePath();x.fill();
  x.fillStyle='#fff';x.fillRect(-8,-19,16,2.6);x.beginPath();x.moveTo(-7,-35);x.lineTo(-3,-35);x.lineTo(7,-20);x.lineTo(3,-20);x.closePath();x.fill();
  x.fillStyle='#f2c94c';x.beginPath();x.arc(1,-28,1.3,0,7);x.arc(3.5,-24,1.3,0,7);x.fill();
  x.fillStyle='#f0c9a0';x.beginPath();x.arc(1,-41,4.6,0,7);x.fill();x.fillStyle='#222';x.fillRect(3.6,-42,1.6,1.6);
  const hg=x.createLinearGradient(0,-62,0,-45);hg.addColorStop(0,'#2a2a30');hg.addColorStop(1,'#08080b');
  x.fillStyle=hg;x.beginPath();x.moveTo(-6.5,-45);x.quadraticCurveTo(-8,-58,-4,-62);x.quadraticCurveTo(0,-64,5,-62);x.quadraticCurveTo(8.5,-58,7,-45);x.closePath();x.fill();
  x.strokeStyle='#f2c94c';x.lineWidth=1.2;x.beginPath();x.moveTo(-5,-46);x.quadraticCurveTo(1,-43,6.5,-46);x.stroke();
  const gxk=-rk*4;x.strokeStyle='#6b3f1e';x.lineWidth=3.4;x.beginPath();x.moveTo(-9+gxk,-30);x.lineTo(8+gxk,-37);x.stroke();
  x.strokeStyle='#2b2f3a';x.lineWidth=2.2;x.beginPath();x.moveTo(8+gxk,-37);x.lineTo(30+gxk,-44);x.stroke();
  x.strokeStyle='#cfd8e6';x.lineWidth=1.3;x.beginPath();x.moveTo(30+gxk,-44);x.lineTo(37+gxk,-46.2);x.stroke();
  x.strokeStyle='#b81e27';x.lineWidth=4;x.beginPath();x.moveTo(4,-33);x.lineTo(12+gxk,-38);x.stroke();
  x.fillStyle='#f0c9a0';x.beginPath();x.arc(13+gxk,-38.5,2.2,0,7);x.fill();
  if(rc>.12){const k=(rc-.12)/.1;x.globalCompositeOperation='lighter';x.globalAlpha=al*k;x.fillStyle='#ffd54a';x.beginPath();x.moveTo(31,-44);x.lineTo(40,-50);x.lineTo(36,-44);x.lineTo(41,-43);x.lineTo(36,-41.5);x.lineTo(40,-37);x.closePath();x.fill();x.fillStyle='#fff';x.beginPath();x.arc(33,-44,3,0,7);x.fill()}
  x.restore()},
bmGren:(x,q,tm)=>{const k=(q.sz||12)/12,fz=q.fz||1.4,p=Math.min(1,q.a/fz),u=1-p*.85,
  P=(v)=>[(1-v)*(1-v)*0+2*v*(1-v)*5+v*v*9,(1-v)*(1-v)*-11+2*v*(1-v)*-18+v*v*-14],e=P(u);
  x.scale(k,k);x.rotate((q.vx<0?-1:1)*.35+q.vy*.0004);
  const bg=x.createRadialGradient(-3,-3,1,0,0,9.5);bg.addColorStop(0,'#7b8290');bg.addColorStop(.5,'#232733');bg.addColorStop(1,'#050608');
  x.fillStyle=bg;x.beginPath();x.arc(0,0,9,0,7);x.fill();x.strokeStyle='#000';x.lineWidth=1;x.stroke();
  if(fz-q.a<.5){x.fillStyle='rgba(255,58,42,'+(.18+.25*Math.sin(tm/40))+')';x.beginPath();x.arc(0,0,9,0,7);x.fill()}
  x.fillStyle='rgba(255,255,255,.55)';x.beginPath();x.ellipse(-3.6,-3.8,2.4,1.5,-.7,0,7);x.fill();
  x.fillStyle='#8a8f99';x.fillRect(-3.5,-12,7,4);x.strokeStyle='#2a2d35';x.lineWidth=.8;x.strokeRect(-3.5,-12,7,4);
  x.strokeStyle='#c9a86a';x.lineWidth=1.6;x.lineCap='round';x.beginPath();x.moveTo(0,-12);for(let v=.1;v<u;v+=.1){const c=P(v);x.lineTo(c[0],c[1]-1)}x.lineTo(e[0],e[1]-1);x.stroke();
  const ex=e[0],ey=e[1]-1,fl=.7+.3*Math.sin(tm/35);x.globalCompositeOperation='lighter';
  x.fillStyle='rgba(255,150,40,.55)';x.beginPath();x.arc(ex,ey,5.5*fl,0,7);x.fill();x.fillStyle='#ffe27a';x.beginPath();x.arc(ex,ey,2.8*fl,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(ex,ey,1.3,0,7);x.fill();
  x.strokeStyle='#ffd54a';x.lineWidth=1;for(let n=0;n<4;n++){const a=n*1.7+tm/70+Math.sin(tm/55+n),l=4+3*Math.abs(Math.sin(tm/45+n*2));x.beginPath();x.moveTo(ex,ey);x.lineTo(ex+Math.cos(a)*l,ey+Math.sin(a)*l);x.stroke()}
  x.globalCompositeOperation='source-over'},
bmMine:(x,h,mx,my)=>{const on=h.t>.6&&((h.t*4)|0)%2===1,pop=Math.min(1,h.t/.15);x.save();x.translate(mx,my);x.scale(1,.6+.4*pop);
  x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(0,1,21,4,0,0,7);x.fill();
  x.fillStyle='#262a31';x.beginPath();x.ellipse(0,-1,19,4.2,0,0,7);x.fill();
  const g=x.createLinearGradient(0,-13,0,0);g.addColorStop(0,'#59606c');g.addColorStop(1,'#272b33');
  x.fillStyle=g;x.beginPath();x.ellipse(0,-1.5,15,11,0,Math.PI,0);x.closePath();x.fill();x.strokeStyle='#14161b';x.lineWidth=1;x.stroke();
  x.fillStyle='#8b93a0';[-8,0,8].forEach(c=>{x.beginPath();x.arc(c,-4+Math.abs(c)*.05,1.2,0,7);x.fill()});
  x.strokeStyle='#3b4049';x.lineWidth=1.4;x.beginPath();x.moveTo(0,-12);x.lineTo(0,-16);x.stroke();
  if(h.t>.6){if(on){x.globalCompositeOperation='lighter';x.fillStyle='rgba(255,40,30,.5)';x.beginPath();x.arc(0,-17,7,0,7);x.fill();x.globalCompositeOperation='source-over'}
    x.fillStyle=on?'#ff5a4a':'#5a1713'}else x.fillStyle='#d9a52b';
  x.beginPath();x.arc(0,-17,2.6,0,7);x.fill();x.restore()},
swWave:(x,q,tm)=>{const k=(q.sz||36)/36,pu=.85+.15*Math.sin(tm/70);x.scale(k*(q.vx<0?-1:1),k);
  x.lineCap='round';for(let n=-1;n<=1;n++){const g=x.createLinearGradient(-44,0,-14,0);g.addColorStop(0,'rgba(160,255,255,0)');g.addColorStop(1,'rgba(160,255,255,.6)');x.strokeStyle=g;x.lineWidth=1.6;x.beginPath();x.moveTo(-44,n*17);x.lineTo(-16,n*17*.9);x.stroke()}
  const ya=30.8,o=-14,R=34,cx2=-36,r2=Math.hypot(-.1-cx2,ya),a2=Math.atan2(ya,-.1-cx2);
  const g=x.createLinearGradient(-10,0,21,0);g.addColorStop(0,'#5fc4e6');g.addColorStop(.6,'#d8f6ff');g.addColorStop(1,'#fff');
  x.beginPath();x.arc(o,0,R,-1.15,1.15,false);x.arc(cx2,0,r2,a2,-a2,true);x.closePath();x.fillStyle=g;x.fill();
  x.lineJoin='round';x.strokeStyle='rgba(120,220,255,'+pu+')';x.lineWidth=1.6;x.stroke();
  x.strokeStyle='#fff';x.lineWidth=2;x.beginPath();x.arc(o,0,R-.8,-1.1,1.1,false);x.stroke()},
axBoom:(x,q,tm)=>{const k=(q.sz||30)/30*1.1;x.scale(k,k);x.lineCap='round';
  x.strokeStyle='#6b3f1e';x.lineWidth=3.6;x.beginPath();x.moveTo(-15,0);x.lineTo(11,0);x.stroke();
  x.strokeStyle='#3a2412';x.lineWidth=1.2;for(let n=0;n<3;n++){x.beginPath();x.moveTo(-14+n*3.2,-1.8);x.lineTo(-12.4+n*3.2,1.8);x.stroke()}
  x.fillStyle='#caa24a';x.beginPath();x.arc(-15,0,2,0,7);x.fill();
  const g=x.createLinearGradient(8,-14,22,14);g.addColorStop(0,'#f3f6fb');g.addColorStop(1,'#7e8a9c');
  x.beginPath();x.moveTo(7,-3.2);x.quadraticCurveTo(12,-18,24,-11);x.quadraticCurveTo(19,-2,24,11);x.quadraticCurveTo(12,18,7,3.2);x.closePath();
  x.fillStyle=g;x.fill();x.lineJoin='round';x.strokeStyle='#4b5563';x.lineWidth=1.3;x.stroke();
  x.strokeStyle='rgba(255,255,255,.9)';x.lineWidth=1.3;x.beginPath();x.moveTo(13,-13.5);x.quadraticCurveTo(21,-8,19.5,-1);x.stroke()},
dgFan:(x,q,tm)=>{const k=(q.sz||14)/14*.85;x.rotate(Math.atan2(q.vy,q.vx));x.scale(k,k);
  x.fillStyle='#5a3a22';x.fillRect(-11,-1.7,7,3.4);x.fillStyle='#d9a42b';x.beginPath();x.arc(-12,0,2.3,0,7);x.fill();x.fillRect(-4.8,-5.2,2.8,10.4);
  const g=x.createLinearGradient(0,-2.4,0,2.4);g.addColorStop(0,'#fff');g.addColorStop(.5,'#cdd6e2');g.addColorStop(1,'#7e8a9c');
  x.beginPath();x.moveTo(-2,-2.5);x.lineTo(12,-1.5);x.lineTo(19,0);x.lineTo(12,1.5);x.lineTo(-2,2.5);x.closePath();x.fillStyle=g;x.fill();
  x.strokeStyle='#4b5563';x.lineWidth=.8;x.lineJoin='round';x.stroke();x.strokeStyle='rgba(60,70,90,.7)';x.lineWidth=.7;x.beginPath();x.moveTo(-1,0);x.lineTo(16,0);x.stroke()},
stFire:(x,q,tm)=>{const k=(q.sz||22)/22;x.rotate(Math.atan2(q.vy,q.vx));x.scale(k,k);
  const L=[['#e0301a',1],['#ff8a1f',.74],['#ffd54a',.48],['#fff6c8',.24]];
  L.forEach((l,i)=>{const s=l[1],w=Math.sin(tm/45+i*1.7)*3*s,w2=Math.cos(tm/38+i)*2*s;x.fillStyle=l[0];x.beginPath();x.moveTo(11*s,0);x.bezierCurveTo(10*s,-10*s,-6*s,-11*s,-27*s,w);x.bezierCurveTo(-8*s,11*s,10*s,10*s,11*s,w2*.2);x.closePath();x.fill()});
  x.fillStyle='#ffd54a';for(let n=0;n<3;n++){const u=(tm/180+n*.34)%1;x.globalAlpha=1-u;x.beginPath();x.arc(-14-u*22,Math.sin(n*2.3+tm/90)*6,1.8*(1-u*.5),0,7);x.fill()}x.globalAlpha=1},
flBall:(x,q,tm)=>{const k=(q.sz||20)/20;x.rotate(Math.atan2(q.vy,q.vx));x.scale(k,k);
  const fl=Math.sin(tm/40)*3;x.globalCompositeOperation='lighter';
  [[40,9,'rgba(255,70,20,.55)'],[30,6.5,'rgba(255,140,40,.7)'],[18,4,'rgba(255,225,120,.85)']].forEach((t,i)=>{x.fillStyle=t[2];x.beginPath();x.moveTo(0,-t[1]);x.quadraticCurveTo(-t[0]*.6,-t[1]*.7+fl*(i?0:1),-t[0]-fl,0);x.quadraticCurveTo(-t[0]*.6,t[1]*.7-fl*(i?0:1),0,t[1]);x.closePath();x.fill()});
  x.globalCompositeOperation='source-over';
  const g=x.createRadialGradient(-2,-2,1,0,0,10);g.addColorStop(0,'#fff3b0');g.addColorStop(.35,'#ff9a2a');g.addColorStop(.75,'#c8300f');g.addColorStop(1,'#4a1006');
  x.fillStyle=g;x.beginPath();x.arc(0,0,9,0,7);x.fill();
  x.strokeStyle='rgba(255,220,120,.8)';x.lineWidth=1;x.beginPath();x.moveTo(-4,-3);x.lineTo(0,1);x.lineTo(3,-1);x.moveTo(0,1);x.lineTo(-1,6);x.stroke()},
pkRock:(x,q,tm)=>{const k=(q.sz||34)/34;x.scale(k,k);
  const R=[15,12,16,13,15,11,16,13],n=R.length;x.beginPath();for(let i=0;i<n;i++){const a=i/n*6.283+.3,px=Math.cos(a)*R[i],py=Math.sin(a)*R[i];i?x.lineTo(px,py):x.moveTo(px,py)}x.closePath();
  const g=x.createLinearGradient(-12,-14,12,14);g.addColorStop(0,'#b9a28a');g.addColorStop(.5,'#7d6a58');g.addColorStop(1,'#4a3f36');
  x.fillStyle=g;x.fill();x.lineJoin='round';x.strokeStyle='#2c2520';x.lineWidth=1.6;x.stroke();
  x.strokeStyle='rgba(30,22,16,.55)';x.lineWidth=1;x.beginPath();x.moveTo(-6,-3);x.lineTo(1,2);x.lineTo(-1,9);x.moveTo(1,2);x.lineTo(9,0);x.stroke();
  x.fillStyle='rgba(255,240,220,.35)';x.beginPath();x.moveTo(-9,-8);x.lineTo(-2,-11);x.lineTo(-5,-5);x.closePath();x.fill()},
btRico:(x,q,tm)=>{const k=(q.sz||10)/10*1.05;x.scale(k,k);
  const g=x.createRadialGradient(-3,-3,1,0,0,9.5);g.addColorStop(0,'#fff');g.addColorStop(.7,'#ece6d6');g.addColorStop(1,'#b9b09a');
  x.fillStyle=g;x.beginPath();x.arc(0,0,9,0,7);x.fill();x.strokeStyle='#6d6556';x.lineWidth=1;x.stroke();
  x.strokeStyle='#d02a2a';x.lineWidth=1.2;x.lineCap='round';
  [-1,1].forEach(s=>{x.beginPath();x.arc(s*10.5,0,7.6,s>0?2.35:-.79,s>0?3.93:.79,false);x.stroke();for(let n=-2;n<=2;n++){const a=n*.3+(s>0?3.14:0),px=s*10.5+Math.cos(a)*7.6,py=Math.sin(a)*7.6;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*-2.2*s*-1,py+2.2*(n?Math.sign(n):1));x.stroke()}})},
ktStar:(x,q,tm)=>{const k=(q.sz||10)/10*1.1;x.scale(k,k);x.lineJoin='round';
  const P=[];for(let i=0;i<8;i++){const a=i/8*6.283-1.571,r=i%2?4.2:12.5;P.push([Math.cos(a)*r,Math.sin(a)*r])}
  const g=x.createLinearGradient(-12,-12,12,12);g.addColorStop(0,'#f4f8ff');g.addColorStop(.5,'#9fb0c8');g.addColorStop(1,'#4d5a70');
  x.beginPath();P.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.closePath();x.fillStyle=g;x.fill();x.strokeStyle='#2a3342';x.lineWidth=1.1;x.stroke();
  x.strokeStyle='rgba(255,255,255,.7)';x.lineWidth=.8;x.beginPath();for(let i=0;i<8;i+=2){x.moveTo(0,0);x.lineTo(P[i][0]*.8,P[i][1]*.8)}x.stroke();
  x.fillStyle='#1b2230';x.beginPath();x.arc(0,0,2.2,0,7);x.fill();x.strokeStyle='#cfd8e6';x.lineWidth=.7;x.stroke()},
gtWave:(x,q,tm)=>{const k=(q.sz||30)/30,pu=(tm/260)%1;x.scale(k*(q.vx<0?-1:1),k);x.lineCap='round';
  for(let n=0;n<3;n++){const u=(pu+n/3)%1,r=10+u*22;x.globalAlpha=Math.min(1,(1-u)*1.4);x.strokeStyle=n%2?'#7ff':'#e090ff';x.lineWidth=3.2*(1-u*.4);x.beginPath();x.arc(-2,0,r,-.9,.9,false);x.stroke()}
  x.globalAlpha=1;x.translate(-9,Math.sin(tm/90)*1.5);
  x.fillStyle='#fff';x.strokeStyle='#7a2fd0';x.lineWidth=1.4;x.lineJoin='round';
  x.beginPath();x.ellipse(0,9,6,4.4,-.45,0,7);x.fill();x.stroke();
  x.fillStyle='#fff';x.fillRect(4.4,-14,2.4,23.5);x.strokeRect(4.4,-14,2.4,23.5);
  x.beginPath();x.moveTo(6.8,-14);x.bezierCurveTo(12,-10,16,-6,13,2);x.bezierCurveTo(14,-7,10,-8,6.8,-8);x.closePath();x.fill();x.stroke()},
bkPaper:(x,q,tm)=>{const k=(q.sz||12)/12*1.1;x.rotate(Math.sin(tm/110+q.a*6)*.28);x.scale(k*(q.vx<0?-1:1),k);x.lineJoin='round';
  x.fillStyle='rgba(0,0,0,.18)';x.fillRect(-6,-7,14,18);
  const g=x.createLinearGradient(-8,-10,8,10);g.addColorStop(0,'#fff');g.addColorStop(1,'#ddd6c4');
  x.beginPath();x.moveTo(-8,-10);x.lineTo(3,-10);x.lineTo(8,-5);x.lineTo(8,10);x.lineTo(-8,10);x.closePath();x.fillStyle=g;x.fill();x.strokeStyle='#8c8470';x.lineWidth=1;x.stroke();
  x.fillStyle='#cfc7b0';x.beginPath();x.moveTo(3,-10);x.lineTo(3,-5);x.lineTo(8,-5);x.closePath();x.fill();x.stroke();
  x.strokeStyle='#6a7488';x.lineWidth=1;x.lineCap='round';[-3,0,3,6].forEach((y,n)=>{x.beginPath();x.moveTo(-5,y);x.lineTo(n==3?0:5,y);x.stroke()})},
crDecree:(x,q,tm)=>{const k=(q.sz||12)/12*1.1;x.rotate(Math.sin(tm/160+q.a*5)*.1);x.scale(k*(q.vx<0?-1:1),k);x.lineJoin='round';x.lineCap='round';
  const g=x.createLinearGradient(0,-8,0,8);g.addColorStop(0,'#fff3cc');g.addColorStop(.5,'#f0d58c');g.addColorStop(1,'#c49a4a');
  x.fillStyle=g;x.fillRect(-11,-7,22,14);x.strokeStyle='#7a5a24';x.lineWidth=1;x.strokeRect(-11,-7,22,14);
  [-11,11].forEach(px=>{const r=x.createLinearGradient(px-3,0,px+3,0);r.addColorStop(0,'#a8782f');r.addColorStop(.5,'#f4dc9a');r.addColorStop(1,'#a8782f');x.fillStyle=r;x.beginPath();x.rect(px-3,-9,6,18);x.fill();x.stroke()});
  x.strokeStyle='rgba(90,60,20,.55)';[-3.5,0,3.5].forEach(y=>{x.beginPath();x.moveTo(-7,y);x.lineTo(2,y);x.stroke()});
  x.fillStyle='#c4202a';x.beginPath();x.arc(6,3,3,0,7);x.fill();x.strokeStyle='#7a1018';x.stroke();x.fillStyle='#e8545c';x.beginPath();x.arc(5.2,2.2,.9,0,7);x.fill()},
trTide:(x,q,tm)=>{const k=(q.sz||50)/50,w=Math.sin(tm/110),b=Math.sin(tm/70);
  x.scale(k*(q.vx<0?-1:1),k);x.translate(0,w*2);
  const g=x.createLinearGradient(0,-40,0,34);g.addColorStop(0,'#d8fbff');g.addColorStop(.3,'#52c8f5');g.addColorStop(.7,'#1c86d8');g.addColorStop(1,'#0a4a9c');
  x.beginPath();x.moveTo(-42,34);x.bezierCurveTo(-36,2,-18,-30,10,-37);x.bezierCurveTo(28,-42,42,-28,38,-12);x.bezierCurveTo(34,-22,23,-24,16,-14);x.bezierCurveTo(25,-3,32,14,38,34);x.closePath();
  x.fillStyle=g;x.fill();x.lineJoin='round';x.strokeStyle='#bff2ff';x.lineWidth=2;x.stroke();
  x.save();x.clip();x.strokeStyle='rgba(255,255,255,.45)';x.lineWidth=2;x.lineCap='round';
  for(let n=0;n<3;n++){const o=n*9+(tm/40%9);x.beginPath();x.moveTo(-34+n*3,28-o*.2);x.bezierCurveTo(-26+n*3,6-o,-8,-12-o*.6,8,-16-o*.4);x.stroke()}
  x.restore();
  x.fillStyle='#fff';for(let n=0;n<6;n++){const a=n/5,cx=-14+a*52+Math.sin(tm/90+n*2)*2,cy=-34+Math.sin(a*3.1)*-4+(n>3?10*(a-.7)*3:0),r=3+((n*7)%3);x.globalAlpha=.95;x.beginPath();x.arc(cx,cy,r,0,7);x.fill()}
  x.globalAlpha=.85;for(let n=0;n<5;n++){const t=(tm/260+n*.37)%1,px=34+t*16+n*2,py=-20-Math.sin(t*3.14)*18+t*22;x.beginPath();x.arc(px,py,2.4-t*1.2,0,7);x.fill()}
  x.globalAlpha=.8;x.beginPath();x.ellipse(-4,33,40+b*3,5,0,0,7);x.fill();
  x.globalAlpha=.5;x.beginPath();x.ellipse(-26,34,16,3.5,0,0,7);x.fill();x.globalAlpha=1}
};
const PTI={P:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M2 22 10 6l8 8z" fill="#ffd84a" opacity=".55"/><path d="M5 19 11 9l4 4z" fill="#ff8a1f"/><circle cx="16" cy="8" r="5" fill="#ff5a1f"/><circle cx="15" cy="7" r="2" fill="#ffe27a"/></svg>',Z:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><g stroke="#9fe8ff" stroke-width="2" stroke-linecap="round"><path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7"/></g><circle cx="12" cy="12" r="2.2" fill="#e8fbff"/></svg>',M:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><circle cx="12" cy="12" r="9" fill="none" stroke="#ff4a4a" stroke-width="2"/><circle cx="12" cy="12" r="4.5" fill="none" stroke="#ff4a4a" stroke-width="2"/><circle cx="12" cy="12" r="1.6" fill="#ff4a4a"/></svg>',A:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M12 1l2.6 6.4L21 4.5l-3 6.2 5.5 3.3-6.4.9.4 7.1L12 17l-4.5 5 .4-7.1-6.4-.9L6.99 10.7 4 4.5l6.4 2.9z" fill="#ffb02a" stroke="#ff5a1f" stroke-width="1"/></svg>',D:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><g fill="none" stroke="#bfe3ff" stroke-width="2" stroke-linecap="round"><path d="M3 8h11a3 3 0 1 0-3-3"/><path d="M3 13h16a3 3 0 1 1-3 3"/><path d="M3 18h8"/></g></svg>',H:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M12 21S3 14.5 3 8.5A4.6 4.6 0 0 1 12 6a4.6 4.6 0 0 1 9 2.5C21 14.5 12 21 12 21z" fill="#3dff8a" stroke="#0a8a3a" stroke-width="1.2"/></svg>',S:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M12 2 4 5v6c0 5 3.4 9 8 11 4.6-2 8-6 8-11V5z" fill="#6ab8ff" stroke="#1d5fb0" stroke-width="1.4"/><path d="M12 5v14c-3-1.6-5.4-4.6-5.4-8V7z" fill="#cfe8ff" opacity=".6"/></svg>',B:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M13 2 4 14h6l-1 8 9-12h-6z" fill="#ffe24a" stroke="#ff9a1f" stroke-width="1.2" stroke-linejoin="round"/></svg>'};
/* céu decorativo (nuvens, brilhos) */
const skyTex=(x,m,w)=>{const k=m[6];x.save();
  const hz=x.createLinearGradient(0,GY-170,0,GY);hz.addColorStop(0,hexA(m[3],0));hz.addColorStop(1,hexA(m[3],.55));x.fillStyle=hz;x.fillRect(0,GY-170,w,170);
  if(k===0){for(let i=0;i<Math.round(w/230);i++){const cx=i*230+rn(i)*120,cy=40+rn(i+9)*90,sc=.7+rn(i+3)*.8;x.fillStyle='rgba(255,255,255,.7)';[[0,0,34],[30,6,26],[-30,8,24],[12,-10,22]].forEach(([a,b,r])=>{x.beginPath();x.ellipse(cx+a*sc,cy+b*sc,r*sc,r*sc*.6,0,0,7);x.fill()});x.fillStyle='rgba(180,205,240,.35)';x.beginPath();x.ellipse(cx,cy+16*sc,56*sc,8*sc,0,0,7);x.fill()}}
  else if(k===1){const g=x.createRadialGradient(240*(w/W>1.5?2:1),80,10,240*(w/W>1.5?2:1),80,110);g.addColorStop(0,'rgba(200,210,255,.45)');g.addColorStop(1,'rgba(200,210,255,0)');x.fillStyle=g;x.fillRect(0,0,w,260);x.fillStyle='rgba(255,230,140,.8)';for(let i=0;i<Math.round(w/16);i++){if(rn(i+5)>.45)x.fillRect(i*16+3,GY-40-rn(i)*90+((i*7)%5)*14,4,5)}}
  else if(k===2){const g=x.createLinearGradient(0,GY-160,0,GY);g.addColorStop(0,'rgba(255,90,20,0)');g.addColorStop(1,'rgba(255,120,30,.45)');x.fillStyle=g;x.fillRect(0,GY-160,w,160);x.fillStyle='rgba(60,20,16,.5)';for(let i=0;i<Math.round(w/90);i++){x.beginPath();x.ellipse(i*90+rn(i)*60,70+rn(i+2)*80,60,10,0,0,7);x.fill()}}
  else if(k===3){for(let i=0;i<5;i++){const g=x.createLinearGradient(0,0,0,GY);const cx=i*w/5+rn(i)*60;g.addColorStop(0,'rgba(255,255,255,.28)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.beginPath();x.moveTo(cx,0);x.lineTo(cx+60,0);x.lineTo(cx+10,GY);x.lineTo(cx-70,GY);x.fill()}}
  else{const cx=w*.5,g=x.createLinearGradient(0,120,0,250);g.addColorStop(0,'#ff3ad8');g.addColorStop(1,'#ffd54a');x.fillStyle=g;x.beginPath();x.arc(cx,210,70,Math.PI,0);x.fill();x.fillStyle='#12002a';for(let i=0;i<6;i++)x.fillRect(cx-72,214-i*i*2.6-i*5,144,1.5+i*.9);x.fillStyle='rgba(0,229,255,.12)';x.fillRect(0,GY-12,w,12)}
  x.restore()};
/* chão e plataformas com textura detalhada por mapa */
const groundTex=(x,m,w,PLs)=>{const k=m[6],th=H-GY;
  let g=x.createLinearGradient(0,GY,0,H);g.addColorStop(0,shd(m[4],.22));g.addColorStop(.18,m[4]);g.addColorStop(1,shd(m[4],-.5));x.fillStyle=g;x.fillRect(0,GY,w,th);
  x.save();x.beginPath();x.rect(0,GY,w,th);x.clip();
  if(k===0){x.fillStyle='rgba(60,35,15,.28)';for(let i=0;i<Math.round(w/9);i++)x.fillRect(rn(i)*w,GY+14+rn(i+4)*(th-18),3+rn(i+8)*7,2);x.fillStyle='rgba(120,80,40,.35)';for(let i=0;i<Math.round(w/60);i++){x.beginPath();x.ellipse(rn(i+30)*w,GY+22+rn(i+31)*40,10+rn(i)*14,4,0,0,7);x.fill()}
    for(let i=0;i<Math.round(w/4);i++){const bx=i*4+rn(i)*3,bh=5+rn(i+1)*8;x.fillStyle=rn(i+2)>.5?'#58b869':'#2f7a3c';x.beginPath();x.moveTo(bx,GY+3);x.lineTo(bx+1+rn(i+3)*3-1.5,GY-bh);x.lineTo(bx+2.4,GY+3);x.fill()}
    for(let i=0;i<Math.round(w/70);i++){const fx=rn(i+60)*w;x.fillStyle=['#fff','#ffd54a','#ff7aa8'][i%3];x.beginPath();x.arc(fx,GY-3,2,0,7);x.fill()}}
  else if(k===1){x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1;for(let r=0;r<5;r++){const y=GY+6+r*14;x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();for(let i=0;i<w/34;i++){const bx=i*34+(r%2)*17;x.beginPath();x.moveTo(bx,y);x.lineTo(bx,y+14);x.stroke()}}x.fillStyle='rgba(255,255,255,.07)';for(let r=0;r<5;r++)x.fillRect(0,GY+7+r*14,w,2);x.fillStyle='rgba(255,230,140,.75)';for(let i=0;i<Math.round(w/120);i++)x.fillRect(i*120+30,GY+50,36,3)}
  else if(k===2){x.fillStyle='rgba(0,0,0,.35)';for(let i=0;i<Math.round(w/24);i++){const bx=rn(i)*w,by=GY+8+rn(i+1)*(th-14),r=6+rn(i+2)*10;x.beginPath();x.moveTo(bx,by);x.lineTo(bx+r,by+r*.4);x.lineTo(bx+r*.5,by+r);x.lineTo(bx-r*.6,by+r*.6);x.fill()}
    x.lineCap='round';for(let i=0;i<Math.round(w/55);i++){let px=rn(i+70)*w,py=GY+4;x.beginPath();x.moveTo(px,py);for(let j=0;j<4;j++){px+=(rn(i*7+j)-.5)*34;py+=8+rn(i+j)*12;x.lineTo(px,py)}x.strokeStyle='#ff6a1f';x.lineWidth=2.4;x.stroke();x.strokeStyle='#ffd54a';x.lineWidth=.9;x.stroke()}}
  else if(k===3){x.fillStyle='rgba(255,255,255,.35)';for(let i=0;i<Math.round(w/22);i++){const bx=rn(i)*w,bh=6+rn(i+1)*20;x.beginPath();x.moveTo(bx,GY+th);x.lineTo(bx+4,GY+th-bh);x.lineTo(bx+8,GY+th);x.fill()}x.strokeStyle='rgba(120,190,230,.55)';x.lineWidth=1.2;for(let i=0;i<Math.round(w/70);i++){let px=rn(i+9)*w,py=GY+4;x.beginPath();x.moveTo(px,py);for(let j=0;j<3;j++){px+=(rn(i*5+j)-.5)*40;py+=10+rn(j+i)*14;x.lineTo(px,py)}x.stroke()}x.fillStyle='rgba(255,255,255,.45)';for(let i=0;i<Math.round(w/50);i++)x.fillRect(rn(i+90)*w,GY+10+rn(i+91)*50,10,2)}
  else{x.lineWidth=1.4;for(let i=0;i<=w/44;i++){x.strokeStyle='rgba(0,229,255,.4)';x.beginPath();x.moveTo(i*44,GY);x.lineTo(i*44+(i*44-w/2)*.35,H);x.stroke()}for(let r=1;r<5;r++){x.strokeStyle='rgba(255,60,220,'+(.15+r*.08)+')';x.beginPath();x.moveTo(0,GY+r*r*3.4);x.lineTo(w,GY+r*r*3.4);x.stroke()}}
  x.restore();
  x.fillStyle=m[5];x.fillRect(0,GY,w,4);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(0,GY,w,1.5);x.fillStyle='rgba(0,0,0,.28)';x.fillRect(0,GY+4,w,2);
  if(k===4){x.save();x.shadowColor='#00e5ff';x.shadowBlur=14;x.fillStyle='#00e5ff';x.fillRect(0,GY,w,2.5);x.restore()}
  PLs.forEach(q=>{const px=q[0],pw=q[1],py=q[2],hh=11;x.save();x.shadowColor='rgba(0,0,0,.45)';x.shadowBlur=10;x.shadowOffsetY=5;let pg=x.createLinearGradient(0,py,0,py+hh);pg.addColorStop(0,shd(m[5],.32));pg.addColorStop(.3,m[5]);pg.addColorStop(1,shd(m[5],-.45));x.fillStyle=pg;x.fillRect(px,py,pw,hh);x.restore();
    x.save();x.beginPath();x.rect(px,py,pw,hh);x.clip();
    if(k===0||k===1||k===2){x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=1;for(let i=0;i<pw/26;i++){const bx=px+i*26+(k===1?13:0);x.beginPath();x.moveTo(bx,py+2);x.lineTo(bx,py+hh);x.stroke()}x.beginPath();x.moveTo(px,py+hh*.55);x.lineTo(px+pw,py+hh*.55);x.stroke()}
    if(k===3){x.fillStyle='rgba(255,255,255,.5)';for(let i=0;i<pw/18;i++)x.fillRect(px+i*18+rn(i+px)*8,py+3,6,1.5)}
    x.restore();x.fillStyle='rgba(255,255,255,.55)';x.fillRect(px,py,pw,1.8);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(px,py+hh-1.5,pw,1.5);
    if(k===4){x.save();x.shadowColor='#00e5ff';x.shadowBlur=12;x.strokeStyle='#00e5ff';x.lineWidth=2;x.strokeRect(px+.5,py+.5,pw-1,hh-1);x.restore()}
    if(k===0){x.fillStyle='#58b869';for(let i=0;i<pw/5;i++){x.beginPath();x.moveTo(px+i*5,py+1);x.lineTo(px+i*5+1.6,py-2-rn(i+px)*3);x.lineTo(px+i*5+3.2,py+1);x.fill()}}
    if(k===2){x.fillStyle='rgba(255,106,31,.7)';for(let i=0;i<pw/40;i++)x.fillRect(px+i*40+8,py+hh-2,16,2)}})};
/* Despertar: carrega por AWC s de luta; ao ativar dura AWDUR s; quando acaba, novo timer de AWC s para usar de novo. 4º poder: 1 vez por despertar.
   Frenesi Brasileira (Flávio): fica na mão até lançar (botão 🚀 ou sozinha após HOLDT s) e voa reta a SBS px/s, sem teleguiar; dá p/ pular ou usar dash (iv).
   Tempo Caótico (Lula): STN raios em x aleatório do mapa todo, 1 a cada STI s, com aviso de STW s no chão (raio de SR px); sem teleguiar. */
/* v1.6.3 balanceamento: vida base HPB; HS = escala dos valores fixos do código (sangramento, queimadura, regeneração, ataque básico, poder final) */
const HPB=FD.HPB||300,HS=HPB/100,UL3=FD.UL3||.6;
let AWDUR=20,AWC=60;const CUTT=2.4,HOLDT=3,SBS=400,SBR=34,STN=44,STI=.18,STW=.65,SR=46;
const IS={meteor:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M2 22 10 6l8 8z" fill="#ffd84a" opacity=".55"/><path d="M5 19 11 9l4 4z" fill="#ff8a1f" opacity=".7"/><circle cx="16" cy="8" r="6" fill="#3dff6a"/><circle cx="14.5" cy="6.5" r="2" fill="#f4ffd0"/></svg>',storm:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M6 14a4 4 0 0 1 1-7.8A5.5 5.5 0 0 1 17.6 7 3.7 3.7 0 0 1 18 14z" fill="#8a8f99"/><path d="M13 12 9 19h3l-1 4 5-8h-3l1-3z" fill="#ffd84a"/></svg>',fire:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M12 2c4 4 6 7 5 11a5 5 0 0 1-10 0c0-2 1-3 2-5 1 2 2 2 2 2 0-3 0-5 1-8z" fill="#ff6a1a"/><ellipse cx="12" cy="16.5" rx="2.2" ry="3" fill="#ffd84a"/></svg>',wait:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M6 3h12l-6 9 6 9H6l6-9z" fill="#cfe"/></svg>',rocket:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M12 2c4 3 5 8 4 13H8c-1-5 0-10 4-13z" fill="#e8eef5"/><circle cx="12" cy="9" r="2" fill="#4ac8ff"/><path d="M8 15 5 19l4-1zM16 15l3 4-4-1z" fill="#ff5a4a"/><path d="M10 16h4l-2 5z" fill="#ffb347"/></svg>',ok:'<svg viewBox="0 0 24 24" width="1.15em" height="1.15em" style="vertical-align:-.22em;display:inline-block"><path d="M4 13l5 5L20 6" fill="none" stroke="#4be07a" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'};const awIc=k=>IS[k]||k;
const AWD={flavio:{p:.2,u:Math.round(80*HS*UL3),n:'Frenesi Brasileira',ic:'meteor',d:'PODER FINAL · 80 de dano · lance a esfera!',c:['#f4ffd0','#3dff6a','#0a8a3a']},lula:{p:.15,u:Math.round(18*HS*UL3),n:'Tempo Caótico',ic:'storm',d:'PODER FINAL · raios caem por todo o mapa',c:['#ffe0d0','#ff3a2a','#8a0a0a']}};
const awKind0=c=>{const n=nz(c&&c.nome);return /^lula$|luiz inacio lula|lula da silva/.test(n)?'lula':/flavio.*bolsonaro/.test(n)?'flavio':''};
const awKind=c=>(window.BRC&&BRC.awKind&&BRC.awKind(c))||awKind0(c);window.BRC&&BRC.awi&&BRC.awi(AWD);

const mk=(x,c,face,w,a)=>{const s={spd:0,jmp:0,dmg:0,def:0,cdr:0,ls:0,hp:0,reg:0,acd:0,kbr:0,dcd:0,pdm:0,crit:0,...(a?a[2]:{})},mx=Math.round((HPB+s.hp)*(OPT.cVid||1));
  return {x,y:GY,vx:0,vy:0,hp:mx,mx,s,W:w?{a:w[2],p:w.slice(3)}:{a:1,p:[]},cd:[0,0,0],stun:0,slow:0,sh:0,shT:0,bf:0,bfv:0,face,gr:true,c,img:c.foto,dash:0,dcd:0,blk:false,atk:0,acd:0,hit:0,ph:0,hurt:0,wi:FD.W.indexOf(w),ai:a?FD.A.indexOf(a):-1,aw:awKind(c),awT:0,awP:0,awC:window.BRCT?0:AWC,ulU:0,iv:0}};
/* ---------- paisagem: se o aparelho estiver em retrato, gira a tela do jogo ---------- */
const rotP=()=>innerHeight>innerWidth;
const lay=o=>{const p=rotP();o.classList.toggle('fgrot',p);o.style.setProperty('--v',(p?innerWidth:innerHeight)/100+'px');if(p){o.style.width=innerHeight+'px';o.style.height=innerWidth+'px';o.style.transform=`translate(${innerWidth}px,0) rotate(90deg)`}else{o.style.width=innerWidth+'px';o.style.height=innerHeight+'px';o.style.transform='none'}};
const rv=(dx,dy)=>rotP()?[dy,-dx]:[dx,dy];
const css=()=>{if(document.getElementById('fgcss'))return;const s=document.createElement('style');s.id='fgcss';s.textContent=`
html.fgrun body>*:not(#fg):not(#fgm){visibility:hidden!important}html.fgrun body::before,html.fgrun #art{display:none!important}html.fgrun *{animation-play-state:paused!important}
#fgm,#fg{position:fixed;left:0;top:0;z-index:99;background:#0b0f1a;color:#fff;font:14px system-ui,sans-serif;user-select:none;-webkit-user-select:none;overflow:hidden;transform-origin:0 0}
#fgm{display:flex;flex-direction:column;box-sizing:border-box;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)}#fgm.fgrot{padding:env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px) env(safe-area-inset-top,0px)}#fg{touch-action:none}
#fg button{-webkit-tap-highlight-color:transparent}
#fg .fb,.fgx .fb{--c:rgba(255,255,255,.14);display:flex;align-items:center;justify-content:center;border-radius:50%;border:2px solid rgba(255,255,255,.55);color:#fff;font-weight:800;padding:0;overflow:hidden;touch-action:none;background:radial-gradient(circle at 34% 26%,rgba(255,255,255,.42),rgba(255,255,255,0) 58%),radial-gradient(circle at 50% 60%,var(--c),rgba(0,0,0,.38));box-shadow:0 4px 10px #0007,inset 0 -4px 8px rgba(0,0,0,.4),inset 0 2px 3px rgba(255,255,255,.4);text-shadow:0 1px 3px #000a;transition:transform .09s,filter .09s,box-shadow .09s}
#fg .fb.on,.fgx .fb.on{transform:scale(.9);filter:brightness(1.35);box-shadow:0 1px 4px #0009,inset 0 0 14px rgba(255,255,255,.5)}
#fg .k-atk,.fgx .k-atk{--c:rgba(255,72,60,.75)}#fg .k-dash,.fgx .k-dash{--c:rgba(70,150,255,.7)}#fg .k-jump,.fgx .k-jump{--c:rgba(60,210,110,.7)}#fg .k-blk,.fgx .k-blk{--c:rgba(150,170,205,.7)}#fg .pw,.fgx .pw{--c:rgba(160,100,255,.7)}#fg .aw,.fgx .aw{--c:rgba(255,200,60,.55)}
#fg .pl,.fgx .pl{position:relative;z-index:1;display:block;max-width:92%;overflow:hidden;text-overflow:ellipsis;font-size:10px;line-height:1.05;text-align:center}
#fg .cdv,.fgx .cdv{position:absolute;inset:0;border-radius:50%;pointer-events:none}
#fg .jy,.fgx .jy{border-radius:50%;touch-action:none;border:2px solid rgba(255,255,255,.4);background:radial-gradient(circle,rgba(255,255,255,.16),rgba(255,255,255,.03) 70%);box-shadow:inset 0 0 16px #0007,0 0 12px #0005}
#fg .jy::before,.fgx .jy::before{content:'';position:absolute;inset:-30px;border-radius:50%}
#fg .jy::after,.fgx .jy::after{content:'';position:absolute;inset:22%;border-radius:50%;border:1px dashed rgba(255,255,255,.28);pointer-events:none}
#fg .jy.on,.fgx .jy.on{border-color:#7fd8ffcc;box-shadow:inset 0 0 16px #0007,0 0 16px #5fd0ff77}
#fg .jk,.fgx .jk{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(circle at 36% 28%,#fff,#cfe6ff 45%,#7fa6d8);box-shadow:0 4px 10px #0008,inset 0 -3px 6px rgba(0,0,0,.3)}
#fgm button,#fgm select,#fgm input{font:inherit;color:#fff;box-sizing:border-box}
#fgm .b{border:0;border-radius:14px;padding:11px 24px;font-weight:800;font-size:17px;background:linear-gradient(135deg,#2a6df4,#8a3df0);box-shadow:0 6px 20px #8a3df055}
#fgm .b.s{background:#ffffff1c;box-shadow:none;font-weight:600}
#fgm .b:disabled{opacity:.4}
#fgm .c{padding:6px 10px;border-radius:10px;border:2px solid transparent;background:#ffffff14;font-size:12px}
#fgm .c.on{border-color:#4af;background:#44aaff33}
#fgm .cen{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;text-align:center;padding:10px;min-height:0}
#fgm .ttl{font-weight:900;font-size:clamp(24px,calc(7*var(--v)),42px);letter-spacing:2px;background:linear-gradient(90deg,#ffd54a,#ff5a8a,#6ad0ff);-webkit-background-clip:text;background-clip:text;color:transparent}
#fgm .bar{width:min(320px,70%);height:12px;border-radius:8px;background:#ffffff1f;overflow:hidden}
#fgm .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#4af,#a6f);transition:width .2s}#fgm .hl .mid{gap:calc(1.6*var(--v))}#fgm .hl .t1{font-size:clamp(26px,calc(10*var(--v)),50px)}#fgm .hl .t2{font-size:clamp(11px,calc(4*var(--v)),20px)}#fgm .hl .gl{font-size:clamp(36px,calc(16*var(--v)),80px)}#fgm .hl .bar{width:min(300px,100%)}#fgm .ldv{display:flex;align-items:center;gap:calc(3*var(--v))}#fgm .ldp{display:flex;flex-direction:column;align-items:center;gap:4px;max-width:calc(55*var(--v))}#fgm .ldp img,#fgm .ldp .av{width:clamp(40px,calc(16*var(--v)),88px);height:clamp(40px,calc(16*var(--v)),88px);border-radius:50%;object-fit:cover;border:3px solid #ffd54a;box-shadow:0 0 18px #ffd54a66;background:#556;display:block}#fgm .ldp b{font-size:12px;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#fgm .ldv>i{font-style:normal;font-weight:900;font-size:clamp(18px,calc(7*var(--v)),30px);color:#ff5a8a;text-shadow:0 0 14px #ff5a8a88}#fgm .tp{font-size:12px;opacity:.65;text-align:center;max-width:90%;min-height:1.2em}#fgm .ball{position:absolute;right:12px;bottom:10px;width:clamp(48px,calc(15*var(--v)),72px);aspect-ratio:1;border-radius:50%;background:conic-gradient(#4af calc(var(--p)*1%),#ffffff1f 0);display:flex;align-items:center;justify-content:center;box-shadow:0 0 16px #44aaff55}#fgm .ball::before{content:'';position:absolute;inset:14%;border-radius:50%;background:#0b0f1a}#fgm .ball span{position:relative;font-weight:800;font-size:clamp(11px,calc(3.6*var(--v)),15px)}
#fgm .top{display:flex;align-items:center;gap:8px;padding:6px 10px;background:#ffffff0d;flex:none}
#fgm .top b{flex:1;font-size:14px}
#fgm .body{flex:1;display:flex;gap:8px;padding:8px 10px;min-height:0}
#fgm .col{display:flex;flex-direction:column;gap:6px;min-height:0;min-width:0}
#fgm .fgf{flex:none;display:flex;align-items:center;gap:10px;padding:6px 10px;background:#ffffff0d}
#fgm #fgr>*{flex-shrink:0}
#fgm .lst{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(118px,1fr));gap:6px;align-content:start;-webkit-overflow-scrolling:touch;min-height:0}
#fgm .it{display:flex;align-items:center;gap:6px;padding:5px;border-radius:12px;border:2px solid transparent;background:#ffffff12;text-align:left;font-size:11px;line-height:1.15}
#fgm .it.on{border-color:#4af;background:#44aaff30}
#fgm .it img,#fgm .av{width:38px;height:38px;border-radius:50%;object-fit:cover;background:#556;flex:none;display:block}
#fgm .it span{overflow:hidden;min-width:0}#fgm .it small{display:block;opacity:.7}
#fgm input[type=text]{flex:1;min-width:0;padding:7px 10px;border-radius:10px;border:1px solid #fff3;background:#ffffff14;font-size:13px}
#fgm select{padding:6px;border-radius:10px;border:1px solid #fff3;background:#1a2036;font-size:12px;max-width:100%}
#fgm .pc{display:flex;align-items:center;gap:8px;padding:6px;border-radius:12px;border:2px solid transparent;background:#ffffff12;text-align:left;font-size:12px}
#fgm .pc.on{border-color:#ffd54a}
#fgm .pc .av{width:46px;height:46px}
#fgm .lb{font-size:11px;opacity:.7;margin-top:2px}
#fgm .row{display:flex;gap:6px;flex-wrap:wrap}
#fg .pw,.fgx .pw{flex-direction:column;gap:0}#fg .pw .pi,.fgx .pw .pi{position:relative;z-index:1;order:-1;font-size:.8em;line-height:1;filter:drop-shadow(0 1px 2px #000a)}#fg .pw .pl,.fgx .pw .pl{font-size:9px;white-space:nowrap}
#fg #fx,#fg #fp,#fg #fs,#fg #ftm,#fg #fti,#fg #ftr{background:linear-gradient(#2c3558dd,#0b0f1add)!important;border:1px solid #ffffff66!important;box-shadow:inset 0 1px 0 #ffffff55,0 3px 8px #0007;font-weight:700}
#fg #fgk{position:absolute;right:6px;top:6px;bottom:232px;width:min(46%,380px);z-index:6;background:#0b0f1af2;border:1px solid #ffffff55;border-radius:14px;display:flex;flex-direction:column;gap:5px;padding:7px;color:#fff;font-size:12px;box-shadow:0 6px 20px #000a}
#fg #fgk .tb{display:flex;gap:4px;flex-wrap:wrap;align-items:center}
#fg #fgk button{padding:3px 8px;border-radius:9px;background:#ffffff14;border:1px solid #ffffff33;color:#fff;font-size:11px}
#fg #fgk button.on{background:#2fbf71;border-color:#7dffa0;color:#04210f;font-weight:700}
#fg #fgk input{width:100%;box-sizing:border-box;padding:5px 8px;border-radius:9px;border:1px solid #ffffff33;background:#00000066;color:#fff;font-size:12px}
#fg #fgk .ls{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:3px;min-height:0}
#fg #fgk .ls button{display:flex;align-items:center;gap:6px;text-align:left;padding:4px 7px;font-size:12px}
#fg #fgk .ls button small{display:block;opacity:.7;font-size:10px;font-weight:400}
#fg #fgk .ls img{width:22px;height:22px;border-radius:50%;object-fit:cover;flex:none}
#fgm{background:radial-gradient(ellipse at 20% 0,#2a3a8a55,transparent 55%),radial-gradient(ellipse at 90% 100%,#7a2ab855,transparent 55%),repeating-linear-gradient(45deg,#ffffff06 0 2px,transparent 2px 14px),#0b0f1a}
#fgm .cen{background-image:radial-gradient(circle at 50% 30%,#2b1a5a99,transparent 70%)}
#fgm .b{border:1px solid #ffffff55;box-shadow:0 6px 18px #8a3df066,inset 0 2px 0 #ffffff66,inset 0 -3px 0 #0005;text-shadow:0 1px 2px #0008;transition:transform .08s,filter .08s}
#fgm .b:active{transform:translateY(2px) scale(.98);filter:brightness(1.15)}
#fgm .b.s{background:linear-gradient(#ffffff2a,#ffffff10);border:1px solid #ffffff33;box-shadow:inset 0 1px 0 #ffffff33,0 3px 8px #0005}
#fgm .c{background:linear-gradient(#ffffff1e,#ffffff0a);border:1px solid #ffffff22;box-shadow:inset 0 1px 0 #ffffff22}
#fgm .c.on{border-color:#5ab8ff;background:linear-gradient(#4aa8ff55,#2a6ad833);box-shadow:0 0 10px #4aa8ff55,inset 0 1px 0 #ffffff55}
#fgm .it{background:linear-gradient(135deg,#ffffff1c,#ffffff08);border:1px solid #ffffff1a;box-shadow:0 2px 6px #0004,inset 0 1px 0 #ffffff1a}
#fgm .it.on{border-color:#5ab8ff;background:linear-gradient(135deg,#4aa8ff44,#2a6ad822);box-shadow:0 0 12px #4aa8ff66}
#fgm .it img,#fgm .av{border:2px solid #ffffff55;box-shadow:0 2px 6px #0007}
#fgm .pc{background:linear-gradient(135deg,#ffffff1c,#ffffff08);border:1px solid #ffffff1a;box-shadow:0 2px 6px #0004,inset 0 1px 0 #ffffff1a}
#fgm .pc.on{border-color:#ffd54a;box-shadow:0 0 12px #ffd54a55}
#fgm .top{background:linear-gradient(#ffffff1c,#ffffff08);border-bottom:1px solid #ffffff22;box-shadow:0 3px 10px #0005}
#fgm .fgf{background:linear-gradient(#ffffff08,#ffffff1a);border-top:1px solid #ffffff22}
#fgm .ttl{text-shadow:0 0 24px #ff5a8a88;filter:drop-shadow(0 3px 0 #0006);background-size:200% 100%;animation:fgsh 4s linear infinite}
@keyframes fgsh{to{background-position:200% 0}}
#fgm .bar{border:1px solid #ffffff33;box-shadow:inset 0 2px 4px #0008}
#fgm .bar i{background:repeating-linear-gradient(45deg,#ffffff33 0 8px,transparent 8px 16px),linear-gradient(90deg,#4af,#a6f)}
#fgm input[type=text],#fgm select{box-shadow:inset 0 2px 4px #0006}
#fgm ::-webkit-scrollbar{width:6px}#fgm ::-webkit-scrollbar-thumb{background:#ffffff44;border-radius:3px}
#fgm .hudst{position:absolute;inset:0;touch-action:none;background:linear-gradient(#24407a,#12301e 78%,#2a5a2a)}
#fgm .hudst .hx{cursor:grab;touch-action:none}#fgm .hudst .hx.sel{outline:3px dashed #ffd54a;outline-offset:4px;z-index:3}
#fgm .hudtb{position:absolute;top:6px;left:50%;transform:translateX(-50%);z-index:5;display:flex;gap:6px;align-items:center;flex-wrap:wrap;justify-content:center;max-width:96%;padding:5px 8px;border-radius:12px;background:#0b0f1ae6;border:1px solid #ffffff33}
#fgm .hudtb .c{font-size:13px;padding:6px 10px}
#fgm{--g:#2ee27a;--y:#ffd54a;--b:#3aa0ff;--bg:#080d18;--pn:#ffffff0f;--ln:#ffffff1f;background:radial-gradient(ellipse at 15% 0,#0f4a3a66,transparent 55%),radial-gradient(ellipse at 100% 100%,#1b3a8a55,transparent 55%),var(--bg)}
#fgm .top{gap:10px;padding:8px 12px;background:#0a1020ee;border-bottom:1px solid var(--ln);box-shadow:none}
#fgm .top b{font-size:15px;font-weight:800;letter-spacing:.2px}
#fgm .top>.c{padding:7px 12px;font-weight:700;border-radius:999px}
#fgm .c{border:1px solid var(--ln);background:var(--pn);box-shadow:none;border-radius:999px;padding:7px 12px;font-size:12.5px;font-weight:600;min-height:34px;transition:background .12s,border-color .12s,transform .08s}
#fgm .c:active{transform:scale(.96)}
#fgm .c.on{border-color:var(--g);background:#2ee27a26;color:#c8ffe0;box-shadow:0 0 0 1px #2ee27a55}
#fgm .b{border:0;border-radius:16px;padding:13px 28px;font-size:17px;font-weight:800;letter-spacing:.3px;color:#04150c;background:linear-gradient(180deg,#5cf5a0,#1fc468);box-shadow:0 6px 0 #0d7a40,0 10px 22px #2ee27a44;text-shadow:none}
#fgm .b:active{transform:translateY(4px);box-shadow:0 2px 0 #0d7a40,0 4px 10px #2ee27a33;filter:none}
#fgm .b.s{color:#fff;background:var(--pn);border:1px solid var(--ln);box-shadow:none;font-weight:700}
#fgm .b.s:active{transform:scale(.97);background:#ffffff1c}
#fgm .ttl{font-size:clamp(22px,calc(7.5*var(--v)),40px);font-weight:900;letter-spacing:3px;background:linear-gradient(90deg,var(--y),var(--g) 55%,var(--b));-webkit-background-clip:text;background-clip:text;color:transparent;animation:none;filter:none;text-shadow:none}
#fgm .sub{font-size:12px;opacity:.65;margin-top:-4px}
#fgm .menu{display:flex;flex-direction:column;gap:10px;width:min(300px,86%);align-items:stretch}
#fgm .menu .b{width:100%;display:flex;align-items:center;justify-content:center;gap:8px}
#fgm .menu .c{align-self:center;margin-top:4px;opacity:.8}
#fgm .cen{background:none}
#fgm .sec{display:flex;flex-direction:column;gap:6px;padding:8px 9px;border-radius:14px;background:var(--pn);border:1px solid var(--ln)}
#fgm .sec>.lb{margin:0;font-size:11px;font-weight:800;letter-spacing:.6px;text-transform:uppercase;opacity:.6}
#fgm .seg{display:flex;gap:4px;padding:3px;border-radius:999px;background:#0006;border:1px solid var(--ln)}
#fgm .seg .c{flex:1;border:0;background:transparent;min-height:32px}
#fgm .seg .c.on{background:var(--g);color:#04150c;box-shadow:none;font-weight:800}
#fgm .chips{display:flex;flex-wrap:wrap;gap:5px}
#fgm .it,#fgm .pc{background:var(--pn);border:1.5px solid var(--ln);box-shadow:none;border-radius:14px;transition:border-color .12s,background .12s,transform .08s}
#fgm .it:active,#fgm .pc:active{transform:scale(.97)}
#fgm .it.on{border-color:var(--g);background:#2ee27a1f;box-shadow:0 0 0 1px #2ee27a55}
#fgm .pc{padding:8px;gap:10px;width:100%}
#fgm .pc.on{border-color:var(--y);background:#ffd54a14;box-shadow:0 0 0 1px #ffd54a55}
#fgm .pc>span:last-child{flex:1;min-width:0;line-height:1.25}
#fgm .pc .go{font-size:18px;opacity:.45;flex:none}
#fgm .pc.empty{border-style:dashed}
#fgm .it img,#fgm .av{border:2px solid #ffffff44;box-shadow:none}
#fgm .pc.on .av,#fgm .pc.on img{border-color:var(--y)}
#fgm .fgf{padding:8px 12px;gap:12px;background:#0a1020ee;border-top:1px solid var(--ln)}
#fgm .fgf .b{min-width:160px;padding:11px 26px}
#fgm input[type=text],#fgm select{border:1px solid var(--ln);background:#0007;box-shadow:none;min-height:36px;border-radius:999px;padding:6px 12px}
#fgm input[type=text]:focus,#fgm select:focus{outline:none;border-color:var(--g)}
#fgm .lst{grid-template-columns:repeat(auto-fill,minmax(132px,1fr))}
#fgm .nv{padding:20px 14px;font-size:22px;border-radius:18px;min-width:52px}
#fgm .stage{display:flex;align-items:center;gap:14px;min-height:0;max-width:100%}
#fgm .hero{background:radial-gradient(circle,#2ee27a22,#ffffff08 70%);border:2px solid var(--ln);border-radius:24px;padding:8px 18px;transition:border-color .12s}
#fgm .hero.on{border-color:var(--g)}
#fgm .dots{display:flex;gap:4px;justify-content:center;margin-top:6px}
#fgm .dots i{width:6px;height:6px;border-radius:50%;background:#ffffff33}
#fgm .dots i.on{background:var(--g);width:16px;border-radius:3px}
#fgm .hint{font-size:11px;opacity:.6}
#fgm #fgcg{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;flex:none;padding-bottom:2px}#fgm #fgcg::-webkit-scrollbar{display:none}#fgm #fgcg .c{flex:none;white-space:nowrap}
#fgm .lst .c{white-space:normal}
#fgm .col>*{flex-shrink:0}
#fgm .sec .seg .c{white-space:nowrap}
#fgm input[type=range]{height:22px}
@media (prefers-reduced-motion:reduce){#fgm *{transition:none!important}}
#fgm .top{padding:4px 10px}#fgm .top>.c{min-height:30px;padding:5px 11px}#fgm .top b{font-size:14px}
#fgm .body{padding:6px 10px;gap:8px}
#fgm .fgf{padding:5px 10px;gap:10px}#fgm .fgf .b{min-width:150px;padding:9px 24px;font-size:16px}
#fgm #fgmsg{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#d6ffe6!important;opacity:.85}
#fgm #fgcg{-webkit-mask-image:linear-gradient(90deg,#000 90%,transparent);mask-image:linear-gradient(90deg,#000 90%,transparent);padding-right:24px}
#fgm .it b{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word}
#fgm .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
#fgm .pc.tile{flex-direction:column;justify-content:center;text-align:center;padding:8px 4px;gap:4px;min-width:0}
#fgm .pc.tile>span:nth-child(2){width:100%;overflow:hidden}
#fgm .pc.tile b{display:block;font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#fgm .pc.tile small{display:block;font-size:10px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#fgm .pc.tile .go{display:none}#fgm .pc.tile br{display:none}

#fgm .hm{position:relative;flex:1;display:flex;align-items:center;justify-content:center;min-height:0;overflow:hidden;padding:8px 12px}
#fgm .hm .spot{position:absolute;left:50%;top:-10%;width:130%;height:120%;transform:translateX(-50%);background:conic-gradient(from 180deg at 50% 0,transparent 160deg,#ffffff14 172deg,#ffffff22 180deg,#ffffff14 188deg,transparent 200deg);pointer-events:none}
#fgm .hm .flag{position:absolute;inset:0;background:linear-gradient(115deg,transparent 0 38%,#2ee27a14 38% 50%,transparent 50% 56%,#ffd54a12 56% 66%,transparent 66% 72%,#3aa0ff14 72% 80%,transparent 80%);pointer-events:none}
#fgm .hm .ring{position:absolute;left:-5%;right:-5%;bottom:0;height:34%;background:linear-gradient(#0000,#0b1a30 70%);border-top:1px solid #ffffff1a;pointer-events:none}
#fgm .hm .ring::before,#fgm .hm .ring::after{content:'';position:absolute;left:0;right:0;height:3px;border-radius:2px;background:linear-gradient(90deg,#ff4a5a,#ffffff88,#ff4a5a);opacity:.55}
#fgm .hm .ring::before{top:22%}#fgm .hm .ring::after{top:52%}
#fgm .hm .mid{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center}
#fgm .hm .gl{position:relative;z-index:1;font-size:clamp(44px,calc(22*var(--v)),104px);line-height:1;filter:drop-shadow(0 8px 14px #000a);flex:none}
#fgm .hm .gl.l{transform:scaleX(-1) rotate(-12deg);animation:fgl 2.4s ease-in-out infinite}
#fgm .hm .gl.r{transform:rotate(-12deg);animation:fgr 2.4s ease-in-out infinite}
@keyframes fgl{50%{transform:scaleX(-1) rotate(-12deg) translateX(-10px)}}
@keyframes fgr{50%{transform:rotate(-12deg) translateX(-10px)}}
#fgm .hm .vs{position:absolute;z-index:2;left:50%;top:50%;display:none}
#fgm .hm .t1{font-weight:900;font-size:clamp(34px,calc(15*var(--v)),70px);line-height:.95;letter-spacing:6px;color:#fff;text-shadow:0 3px 0 #0d7a40,0 0 26px #2ee27a77;-webkit-text-stroke:1px #ffffff55}
#fgm .hm .t2{font-weight:800;font-size:clamp(13px,calc(5.2*var(--v)),24px);letter-spacing:5px;padding:3px 14px;border-radius:6px;color:#1a1200;background:linear-gradient(90deg,#ffd54a,#ffb347);box-shadow:0 4px 14px #ffd54a44;transform:skewX(-8deg)}
#fgm .hm .sub{margin:2px 0 4px;font-size:12px;opacity:.7}
#fgm .hm .menu{width:min(280px,100%);gap:calc(2*var(--v))}#fgm .hm .menu .b{padding:calc(2.4*var(--v)) 20px;font-size:clamp(14px,calc(4.2*var(--v)),17px)}#fgm .hm .mid{gap:calc(1.2*var(--v))}
#fgm .hm .last{display:flex;align-items:center;gap:8px;max-width:100%;padding:4px 12px 4px 4px;border-radius:999px;background:#ffffff0f;border:1px solid var(--ln);font-size:12px}
#fgm .hm .last .av,#fgm .hm .last img{width:26px;height:26px}
#fgm .hm .last span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#fgm .hm .ver{position:absolute;z-index:1;right:12px;bottom:6px;font-size:10px;opacity:.4}
@media (max-width:560px){#fgm .hm .gl{display:none}}
@media (max-height:300px){#fgm .hm .sub{display:none}#fgm .hm .menu .b{padding:9px 20px;font-size:15px}}
@media (prefers-reduced-motion:reduce){#fgm .hm .gl{animation:none!important}}

`;document.head.appendChild(s)};
const mkRoot=id=>{css();document.documentElement.classList.add('fgrun');const o=document.createElement('div');o.id=id;lay(o);o._l=()=>lay(o);addEventListener('resize',o._l);document.body.appendChild(o);return o};
const kill=o=>{removeEventListener('resize',o._l);o.remove();if(!document.getElementById('fg')&&!document.getElementById('fgm'))document.documentElement.classList.remove('fgrun')};
const shell=h=>{if(!MR){MR=mkRoot('fgm');MR.addEventListener('click',onClick);MR.addEventListener('input',onInput);MR.addEventListener('change',onChange)}MR.innerHTML=h;return MR};
const closeMenu=()=>{if(MR){kill(MR);MR=null}};
const lock=f=>{try{const d=document.documentElement;if(f){d.requestFullscreen&&d.requestFullscreen({navigationUI:'hide'}).catch(()=>{})}else if(document.fullscreenElement){document.exitFullscreen().catch(()=>{})}}catch(e){}try{const o=screen.orientation;if(o){const p=f?o.lock('landscape'):o.unlock();p&&p.catch&&p.catch(()=>{})}}catch(e){}};
const openFight=()=>{if(run||MR)return;lock(1);screenMenu()};
const exitFight=()=>{SFX.stop();closeMenu();lock(0);brcRest()};

/* ---------- aba: abre o menu em tela cheia ---------- */
window.tabFight=()=>`<section class="bx"><h3>🥊 Luta de candidatos</h3><button data-a="fgopen" style="width:100%;padding:14px;border-radius:12px;font-weight:700;font-size:16px">▶ Abrir</button></section>`;
addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-a="tab"][data-v="fight"],[data-a="fgopen"]');if(!t)return;e.stopPropagation();e.preventDefault();openFight()},true);

const paintMap=(x,mi,t)=>{const m=FD.M[mi],PLs=m[7],g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,m[2]);g.addColorStop(1,m[3]);x.fillStyle=g;x.fillRect(0,0,W,H);skyTex(x,m,W);
    const tri=(c,n,w,h,o2)=>{x.fillStyle=c;for(let i=0;i<n;i++){x.beginPath();x.moveTo(i*w-w/3,GY);x.lineTo(i*w+w/2,GY-h-(i*37+o2)%50);x.lineTo(i*w+w*1.3,GY);x.fill()}};
    if(m[6]===0){x.fillStyle='#ffe9a0';x.beginPath();x.arc(650,90,38,0,7);x.fill();tri('#4a8a5a',4,230,100,0)}
    else if(m[6]===1){x.fillStyle='#fff';for(let i=0;i<40;i++)x.fillRect(i*97%W,i*53%250,2,2);x.fillStyle='#e8e8f8';x.beginPath();x.arc(120,80,28,0,7);x.fill();x.fillStyle='#14182c';for(let i=0;i<9;i++)x.fillRect(i*95,GY-50-(i*37%90),60,200)}
    else if(m[6]===2){tri('#3a1410',4,230,120,10);x.fillStyle='#ff5a1f55';x.fillRect(0,GY-30,W,30);x.fillStyle='#ffb347';for(let i=0;i<25;i++)x.fillRect(i*83%W,(i*61+t/20)%GY,2,2)}
    else if(m[6]===3){tri('#bfe6ff',4,230,110,20);x.fillStyle='#fff';for(let i=0;i<50;i++)x.fillRect(i*71%W,(i*43+t/15)%GY,3,3)}
    else{x.strokeStyle='#f0f6';x.lineWidth=1;for(let i=0;i<=16;i++){x.beginPath();x.moveTo(W/2+(i-8)*20,250);x.lineTo((i-8)*90+W/2,GY);x.stroke()}for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,250+i*i*5);x.lineTo(W,250+i*i*5);x.stroke()}}
    groundTex(x,m,W,PLs);};
/* ---------- telas ---------- */
let fmRO=null;
const fitMenu=()=>{const hm=document.querySelector('#fgm .hm'),m=hm&&hm.querySelector('.mid');if(!m)return;m.style.transform='';const cs=getComputedStyle(hm),av=hm.clientHeight-parseFloat(cs.paddingTop)-parseFloat(cs.paddingBottom),aw=hm.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight),nh=m.offsetHeight,nw=m.offsetWidth,k=Math.max(.45,Math.min(1,av/Math.max(1,nh),aw/Math.max(1,nw)));m.style.transformOrigin='center';if(k<1)m.style.transform='scale('+k.toFixed(3)+')';};
const watchMenu=()=>{if(fmRO)fmRO.disconnect();const hm=document.querySelector('#fgm .hm');if(hm&&window.ResizeObserver){fmRO=new ResizeObserver(()=>fitMenu());fmRO.observe(hm)}};
const screenMenu=()=>(shell(`<div class="hm"><div class="flag"></div><div class="spot"></div><div class="ring"></div><div class="gl l">🥊</div><div class="mid"><div class="t1">LUTA</div><div class="t2">DE CANDIDATOS</div><div class="sub">Escolha seu candidato e suba no ringue</div><div class="menu"><button class="b" data-a="play">▶ Jogar</button><button class="b s" data-a="trn">🏋 Treinamento</button><button class="b s" data-a="opts">⚙ Opções</button><button class="b s" data-a="brclib">📚 Biblioteca</button><button class="b s" data-a="brc">🧩 Minhas criações</button><button class="c" data-a="exit">← Voltar ao app</button></div>${CAND?`<div class="last">${av(CAND)}<span>Último lutador: <b>${E(CAND.nome)}</b></span></div>`:''}</div><div class="gl r">🥊</div><div class="ver">v1.9.52</div></div>`),fitMenu(),watchMenu(),requestAnimationFrame(fitMenu),setTimeout(fitMenu,350));

const chips=(k,cur,arr)=>`<div class="row">${arr.map(([v,n])=>`<button class="c${String(cur)===String(v)?' on':''}" data-a="opt" data-k="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
const preview=()=>{const s=OPT.size,R=OPT.side==='r',d=n=>Math.round(n*s),sd=R?'left':'right',bs=R?'right':'left',c=OPT.bars==='c';
  const dot=(x,y,z)=>`<i style="position:absolute;${bs}:${x}px;bottom:${y}px;width:${z}px;height:${z}px;border-radius:50%;background:#ffffff40;border:1px solid #fff8"></i>`;
  const bar=(l)=>`<i style="position:absolute;top:${c?22:6}px;${l?'left':'right'}:${c?'calc(50% + 4px)':'8px'};${c&&l?'left:auto;right:calc(50% + 4px)':''}width:90px;height:8px;border-radius:4px;background:#4c6"></i>`;
  return `<div style="position:relative;height:130px;border-radius:12px;background:linear-gradient(#2a3a6a,#1a2a1a);overflow:hidden;border:1px solid #fff3"><i style="position:absolute;${sd}:10px;bottom:8px;width:${d(46)}px;height:${d(46)}px;border-radius:50%;background:#ffffff25;border:2px solid #fff6"></i>${dot(10,8,d(30))}${dot(46,6,d(22))}${dot(10,50,d(20))}${dot(40,44,d(20))}${dot(70,30,d(20))}${bar(1)}${bar(0)}<span style="position:absolute;left:50%;top:4px;transform:translateX(-50%);font-size:9px;background:#0008;padding:1px 6px;border-radius:6px">✕ Sair</span></div>`};
const screenOpts=()=>{const sg=(k,cur,arr)=>`<div class="seg">${arr.map(([v,n])=>`<button class="c${String(cur)===String(v)?' on':''}" data-a="opt" data-k="${k}" data-v="${v}">${n}</button>`).join('')}</div>`,sec=(t,b)=>`<div class="sec"><div class="lb">${t}</div>${b}</div>`;
shell(`<div class="top"><button class="c" data-a="menu">← Voltar</button><b>Opções</b></div><div class="body"><div class="col" style="flex:1.15;overflow-y:auto;padding-right:2px"><button class="pc" data-a="hud"><span style="font-size:26px;width:46px;text-align:center;flex:none">🎛</span><span><b>Editar botões livremente</b><br><small>Arraste e redimensione cada botão${OPT.lay?' · <b style="color:#ffd54a">layout personalizado ativo</b>':''}</small></span><span class="go">›</span></button>`
+sec('Controles',sg('side',OPT.side,[['r','🕹 Joystick à esquerda'],['l','🕹 Joystick à direita']])+`<div class="lb" style="margin:2px 0 0">Tamanho dos botões</div>`+sg('size',OPT.size,[[.85,'Pequeno'],[1,'Médio'],[1.2,'Grande']]))
+sec('Tela',`<div class="lb" style="margin:0">Barras de vida</div>`+sg('bars',OPT.bars,[['k','Nos cantos'],['c','No centro']])+`<div class="lb" style="margin:2px 0 0">Mira: indicador na tela</div>`+sg('ind',OPT.ind,[['s','Mostrar'],['n','Esconder']])+`<div class="lb" style="margin:2px 0 0">Mira: ímã no alvo (trava perto do inimigo)</div>`+sg('snap',OPT.snap,[['s','Ligado'],['n','Desligado']]))
+sec('Joystick',`<div class="lb" style="margin:0">Pular empurrando pra cima</div>`+sg('sj',OPT.sj,[['n','Desligado (mira)'],['s','Ligado']]))
+sec('Som e vibração',sg('snd',OPT.snd,[['s','🔊 Ligados'],['n','🔇 Desligados']])+`<div class="lb" style="margin:2px 0 0">Volume: <b id="fgvl">${OPT.vol}%</b></div><input type="range" id="fgvol" min="0" max="100" step="5" value="${OPT.vol}" style="width:100%;accent-color:#2ee27a">`+`<div class="lb" style="margin:2px 0 0">Vibração ao tocar</div>`+sg('vib',OPT.vib,[['s','Ligada'],['n','Desligada']]))
+sec('Condições da luta',`<div class="lb" style="margin:0">Recarga do despertar</div>`+sg('cAwc',OPT.cAwc??60,[[15,'15 s'],[30,'30 s'],[60,'60 s (padrão)'],[90,'90 s']])+`<div class="lb" style="margin:2px 0 0">Duração do despertar</div>`+sg('cAwd',OPT.cAwd??20,[[10,'10 s'],[20,'20 s (padrão)'],[30,'30 s'],[45,'45 s']])+`<div class="lb" style="margin:2px 0 0">Tempo de cada round</div>`+sg('cRt',OPT.cRt??120,[[60,'60 s'],[90,'90 s'],[120,'120 s (padrão)'],[180,'180 s']])+`<div class="lb" style="margin:2px 0 0">Vida dos lutadores</div>`+sg('cVid',OPT.cVid??1,[[.5,'Metade'],[1,'Normal'],[1.5,'×1,5'],[2,'Dobro']])+`<div class="lb" style="margin:2px 0 0">Recarga dos poderes</div>`+sg('cCd',OPT.cCd??1,[[.5,'Metade do tempo'],[1,'Normal'],[1.5,'×1,5'],[2,'Dobro do tempo']])+`<button class="c" data-a="creset" style="margin-top:6px">↺ Restaurar padrão</button><small style="opacity:.6;display:block;margin-top:4px">Valem para os dois lutadores, na próxima luta.</small>`)
+sec('Finalização e desempenho',`<div class="lb" style="margin:0">Cena de finalização</div>`+sg('fsk',OPT.fsk||'p',[['s','Sempre mostrar'],['p','Permitir pular'],['x','Sempre pular']])+`<div class="lb" style="margin:2px 0 0">Contador de FPS na luta</div>`+sg('fps',OPT.fps||'n',[['n','Desligado'],['s','Ligado']]))
+sec('Aleatório (muda a cada luta)',`<div class="chips">${[['w','Arma'],['a','Acessório'],['m','Mapa'],['f','Finalização'],['d','Despertar']].map(([g,n])=>`<button class="c${rgAny(g)?' on':''}" data-a="rg" data-g="${g}">${n}</button>`).join('')}<button class="c${rallOn()?' on':''}" data-a="rg" data-g="all">🎲 Tudo</button></div>`)
+`</div><div class="col" style="flex:1"><div class="sec"><div class="lb">Pré-visualização</div>${preview()}</div></div></div><div class="fgf"><span style="flex:1;font-size:12px;opacity:.7">As opções são salvas automaticamente.</span><button class="b" data-a="menu">Pronto</button></div>`)};


/* ---------- editor de HUD: mover e redimensionar botões livremente (1 jogador) ---------- */
const HID={j:'Joystick',atk:'Ataque',dash:'Dash',jump:'Pulo',blk:'Defesa',p0:'Poder 1',p1:'Poder 2',p2:'Poder 3',a:'Despertar',u:'Poder final'};
let HSEL='atk';
const hudItems=()=>{const L=soloL(),it=[{id:'j',css:L.j,s:L.js,j:1}];L.b.forEach(([k,t,sz,css])=>it.push({id:k,t,s:sz,css,cls:'k-'+k}));L.p.forEach((css,n)=>it.push({id:'p'+n,t:'<b class="pi">⚡</b><span class="pl">Poder '+(n+1)+'</span>',s:L.pz[n],css,cls:'pw'}));it.push({id:'a',t:'🔥',s:L.az,css:L.a,cls:'aw'},{id:'u',t:'🚀',s:L.uz,css:L.u,cls:'aw'});return it};
const hudPaint=()=>{if(!MR)return;const st=MR.querySelector('#fgst');if(!st)return;
  st.innerHTML=hudItems().map(i=>i.j?`<div class="jy hx${HSEL==='j'?' sel':''}" data-id="j" style="position:absolute;${i.css};width:${i.s}px;height:${i.s}px"><div class="jk" style="left:${i.s*.29}px;top:${i.s*.29}px;width:${i.s*.42}px;height:${i.s*.42}px"></div></div>`:`<button class="fb ${i.cls} hx${HSEL===i.id?' sel':''}" data-id="${i.id}" style="position:absolute;width:${i.s}px;height:${i.s}px;font-size:${Math.round(i.s*.44)}px;${i.css}">${i.t}</button>`).join('')+`<div style="position:absolute;left:10px;top:64px;width:200px;height:14px;border-radius:7px;background:#4c6;opacity:.7"></div><div style="position:absolute;right:10px;top:64px;width:200px;height:14px;border-radius:7px;background:#4c6;opacity:.7"></div>`;
  const l=(OPT.lay&&OPT.lay[HSEL])||{s:1},lb=MR.querySelector('#fgsl');if(lb)lb.textContent=HID[HSEL]+' · '+Math.round((l.s||1)*100)+'%'};
const hudPos=id=>{const st=MR.querySelector('#fgst'),e=st&&st.querySelector('[data-id="'+id+'"]');if(!e)return{x:.5,y:.5};return{x:(e.offsetLeft+e.offsetWidth/2)/st.offsetWidth,y:(e.offsetTop+e.offsetHeight/2)/st.offsetHeight}};
const hudEnsure=id=>{OPT.lay=OPT.lay||{};if(!OPT.lay[id]||typeof OPT.lay[id].x!=='number'){const q=hudPos(id);OPT.lay[id]={x:q.x,y:q.y,s:(OPT.lay[id]&&OPT.lay[id].s)||1}}return OPT.lay[id]};
const clampN=(v,a,b)=>Math.max(a,Math.min(b,v));
const screenHud=()=>{shell(`<div class="hudst fgx" id="fgst"></div><div class="hudtb"><button class="c" data-a="opts">← Voltar</button><b id="fgsl" style="font-size:13px;min-width:120px;text-align:center"></b><button class="c" data-a="hsz" data-v="-1" style="font-size:18px;width:40px">−</button><button class="c" data-a="hsz" data-v="1" style="font-size:18px;width:40px">+</button><button class="c" data-a="hreset">↺ Padrão</button><button class="b" data-a="opts" style="padding:6px 16px;font-size:14px">Pronto</button></div><div style="position:absolute;left:50%;bottom:10px;transform:translateX(-50%);font-size:11px;opacity:.75;text-align:center;pointer-events:none;text-shadow:0 1px 3px #000;z-index:4">Arraste um botão para mover · toque para escolher · use − / + para o tamanho</div>`);
  const st=MR.querySelector('#fgst');let d=null;
  st.addEventListener('pointerdown',ev=>{const e=ev.target.closest('[data-id]');if(!e)return;ev.preventDefault();HSEL=e.dataset.id;const c=hudEnsure(HSEL);d={sx:ev.clientX,sy:ev.clientY,fx:c.x,fy:c.y,id:HSEL};try{st.setPointerCapture(ev.pointerId)}catch(_){}hudPaint()});
  st.addEventListener('pointermove',ev=>{if(!d)return;const r=rv(ev.clientX-d.sx,ev.clientY-d.sy),c=OPT.lay[d.id];c.x=clampN(d.fx+r[0]/st.offsetWidth,.03,.97);c.y=clampN(d.fy+r[1]/st.offsetHeight,.06,.97);hudPaint()});
  const up=()=>{if(d){d=null;ST.set('opt',OPT)}};st.addEventListener('pointerup',up);st.addEventListener('pointercancel',up);
  hudPaint()};

const cargoN={presidente:'Presidente',governador:'Governador',senador:'Senador','deputado-federal':'Dep. Federal','deputado-estadual':'Dep. Estadual'};
const key=()=>CG==='presidente'?'presidente|br':CG+'|'+UF;
const av=c=>c&&c.foto?`<img src="${E(c.foto)}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">`:'<span class="av"></span>';
const screenSetup=()=>{rndBack();shell(`<div class="top"><button class="c" data-a="menu">← Menu</button><b>${TRN?'🏋 Treinamento':'Monte sua luta'}</b></div><div class="body"><div class="col" style="flex:1.3"><div class="chips" id="fgcg"></div><div class="row" id="fgsr" style="flex-wrap:nowrap"></div><div id="fgl" class="lst"></div></div><div class="col" id="fgr" style="flex:1;overflow-y:auto;padding-right:2px"></div></div><div class="fgf"><span id="fgmsg" style="flex:1;font-size:12px;color:#ffd54a"></span><button class="b" data-a="go">${TRN?'🏋 TREINAR':'⚔ LUTAR'}</button></div>`);paintTop();paintRight();loadList()};
const paintTop=()=>{if(!MR)return;MR.querySelector('#fgcg').innerHTML=Object.keys(cargoN).map(k=>`<button class="c${CG===k?' on':''}" data-a="cg" data-v="${k}">${cargoN[k]}</button>`).join('');
  MR.querySelector('#fgsr').innerHTML=(CG!=='presidente'?`<select data-a="uf">${Object.entries(UFS).map(([u,n])=>`<option value="${u}"${u===UF?' selected':''}>${u.toUpperCase()} · ${E(n)}</option>`).join('')}</select>`:'')+`<input type="text" id="fgq" placeholder="🔍 Pesquisar nome, partido ou número" value="${E(Q)}" autocomplete="off">`};
const paintList=()=>{if(!MR)return;const l=MR.querySelector('#fgl');if(!l)return;const y=l.scrollTop,q=nz(Q);let h='';
  if(LOADING)h='<p style="grid-column:1/-1;opacity:.8">Carregando candidatos…</p>';
  else if(ERRM)h=`<p style="grid-column:1/-1">${E(ERRM)}</p><button class="c" data-a="retry">↻ Tentar de novo</button>`;
  else{const f=[];LIST.forEach((c,i)=>{if(!q||nz(c.nome).includes(q)||nz(c.partido).includes(q)||String(c.num||'').startsWith(q))f.push(i)});
    h=f.slice(0,SHOW).map(i=>{const c=LIST[i],sc=PL===1?CAND:CAND2,on=!!sc&&sc.id===c.id;return `<button class="it${on?' on':''}" data-a="pick" data-v="${i}">${av(c)}<span><b>${E(c.nome)}</b><small>${E(c.partido||'')}${c.num?' · '+E(c.num):''}</small></span></button>`}).join('');
    if(!f.length)h='<p style="grid-column:1/-1;opacity:.8">Nenhum candidato encontrado.</p>';
    else if(f.length>SHOW)h+=`<button class="c" data-a="more" style="grid-column:1/-1">Mostrar mais (${f.length-SHOW})</button>`}
  l.innerHTML=h;l.scrollTop=y};
const card=(n,c)=>`<button class="pc${PL===n?' on':''}${c?'':' empty'}" data-a="pl" data-v="${n}">${av(c)}<span><b>${MD?'Jogador '+n+': ':''}${c?E(c.nome):'Escolha na lista'}</b><br><small>${c?E(c.partido||''):'Toque num candidato ao lado'}</small></span></button>`;
const FIN_OK=[0,1,2,3,4,5],FIN_L=[[0,'🚫 Nenhuma'],[1,'👊 Socos'],[2,'🗡 Katana'],[3,'⚡ Raio'],[4,'🐕 Cães'],[5,'☢ Bomba']],FZ=ST.get('fin',{k:1,b:0});let FK=(FZ.k??1)|0,FB=FZ.b?1:0;window.BRC&&BRC.FO.forEach(q=>{FIN_OK.push(q.k);FIN_L.push([q.k,q.lb])});if(!FIN_OK.includes(FK))FK=1;const brcRest=()=>{window.BRCFT=0;window.BRCAWT=0;if(window.BRCFO){FK=BRCFO.k;FB=BRCFO.b;window.BRCFO=null}};
const PK={w:[0,0],a:[0,0],m:0};let PI=null,AWP=null,RM=null;
const RND={w1:0,w2:0,a1:0,a2:0,f:0,d1:0,d2:0,d3:0,m:0,l:{}};{const z=ST.get('rnd',null);if(z){Object.keys(RND).forEach(k=>{if(k!=='l'&&z[k])RND[k]=1});if(z.l)RND.l=z.l}}
const rndSave=()=>ST.set('rnd',RND);
const RG={w:['w1','w2'],a:['a1','a2'],f:['f'],d:['d1','d2','d3'],m:['m']},rgOn=g=>RG[g].every(k=>RND[k]),rgAny=g=>RG[g].some(k=>RND[k]),rallOn=()=>Object.keys(RG).every(rgOn);
const rndPick=(k,list)=>{const l=list.filter(v=>v!==RND.l[k]),c=l.length?l:list;const v=c[Math.random()*c.length|0];RND.l[k]=v;return v};
const rndLists=()=>({w:FD.W.map((_,i)=>i),a:FD.A.map((_,i)=>i),m:FD.M.map((m,i)=>i).filter(i=>!/Dojo/.test(FD.M[i][1])),f:FIN_OK.filter(q=>q>0),d:Object.keys(AWD)});
const rndRoll=()=>{const ks=TRN?['w1','a1']:['w1','a1','f','m','d1',...(MD?['w2','a2','d2']:['d3'])];if(!ks.some(k=>RND[k]))return;const L=rndLists();RM={WP,WP2,AC,AC2,FK,MP,AW,AW2,AWE};
  if(RND.w1&&ks.includes('w1'))WP=rndPick('w1',L.w);if(RND.w2&&ks.includes('w2'))WP2=rndPick('w2',L.w);if(RND.a1&&ks.includes('a1'))AC=rndPick('a1',L.a);if(RND.a2&&ks.includes('a2'))AC2=rndPick('a2',L.a);
  if(RND.f&&ks.includes('f'))FK=rndPick('f',L.f);if(RND.m&&ks.includes('m'))MP=rndPick('m',L.m);if(RND.d1&&ks.includes('d1'))AW=rndPick('d1',L.d);if(RND.d2&&ks.includes('d2'))AW2=rndPick('d2',L.d);if(RND.d3&&ks.includes('d3'))AWE=rndPick('d3',L.d);rndSave()};
const rndBack=()=>{if(RM){({WP,WP2,AC,AC2,FK,MP,AW,AW2,AWE}=RM);RM=null}};
{const z=ST.get('sel',null);if(z){CAND=z.CAND||null;CAND2=z.CAND2||null;WP=z.WP|0;AC=z.AC|0;WP2=z.WP2|0;AC2=z.AC2|0;MP=z.MP|0;DF=z.DF??1;MD=z.MD|0;CG=z.CG||CG;UF=z.UF||UF;if(z.PK)Object.assign(PK,z.PK);CPW=z.CPW??-1;CPA=z.CPA??-1;CPF=z.CPF??-1;AW=z.AW??'auto';AW2=z.AW2??'auto';AWE=z.AWE??'auto'}}
WP=Math.min(WP,FD.W.length-1);WP2=Math.min(WP2,FD.W.length-1);AC=Math.min(AC,FD.A.length-1);AC2=Math.min(AC2,FD.A.length-1);MP=Math.min(MP,FD.M.length-1);if(CPW>=FD.W.length)CPW=-1;if(CPA>=FD.A.length)CPA=-1;
const awOk=v=>v==='auto'||v===''||!!AWD[v],awChk=()=>{if(!awOk(AW))AW='auto';if(!awOk(AW2))AW2='auto';if(!awOk(AWE))AWE='auto'};awChk();
const awRes=(v,c)=>v==='auto'?awKind(c):v;
const kv=k=>k==='m'?MP:k==='w'?(PL===1?WP:WP2):(PL===1?AC:AC2);
const lst=k=>k==='w'?FD.W:k==='a'?FD.A:FD.M;
const nmk={w:'a arma',a:'o acessório',m:'o mapa'};
const slot=(k,lbl)=>{const rk=k==='m'?'m':k+PL;if(RND[rk])return `<button class="pc tile" data-a="slot" data-k="${k}"><span style="font-size:28px;line-height:1;text-align:center;flex:none">🎲</span><span><b>Aleatório</b><br><small>Muda a cada luta</small></span><span class="go">›</span></button>`;const done=k==='m'?PK.m:PK[k][PL-1],it=lst(k)[kv(k)];return `<button class="pc tile${done?'':' empty'}" data-a="slot" data-k="${k}"><span style="font-size:28px;line-height:1;text-align:center;flex:none">${done?(k==='m'?it[0]:FS.tag(k,kv(k),34)):'➕'}</span><span><b>${done?E(it[1]):(k==='w'?'Arma':k==='a'?'Acessório':'Arena')}</b><br><small>${done?'Trocar':lbl}</small></span><span class="go">›</span></button>`};
const awv=w=>w===3?AWE:w===2?AW2:AW;
const dslot=w=>{const v=awv(w),rd=RND['d'+w],k=v==='auto'?'':v,d=!rd&&k&&AWD[k],sub=rd?'Muda a cada luta':v==='auto'?(w===3?'Do adversário':'Do candidato'):d?'Trocar':'Sem despertar';return `<button class="pc tile" data-a="dslot" data-w="${w}" style="grid-column:1/-1"><span style="font-size:28px;line-height:1;text-align:center;flex:none">${rd?'🎲':d?awIc(d.ic):v===''?'🚫':'🔥'}</span><span><b>${rd?'Aleatório':d?E(d.n):v===''?'Nenhum':'Despertar'}</b><br><small>${sub}</small></span><span class="go">›</span></button>`};
const cslot=(k,lbl)=>{const v=k==='w'?CPW:CPA,L=lst(k),it=v>=0?L[v]:null;return `<button class="pc tile" data-a="cslot" data-k="${k}"><span style="font-size:28px;line-height:1;text-align:center;flex:none">${it?FS.tag(k,v,34):'🎲'}</span><span><b>${it?E(it[1]):'Aleatório'}</b><br><small>${it?'Trocar':lbl}</small></span><span class="go">›</span></button>`};
const paintRight=()=>{if(!MR)return;const r=MR.querySelector('#fgr');if(!r)return;
  const sec=(t,b)=>`<div class="sec"><div class="lb">${t}</div>${b}</div>`;
  r.innerHTML=(TRN?'<div class="sec"><div class="lb">🏋 Sem placar, sem derrota, mapa de treino. Boneco de teste no lugar do adversário.</div></div>':`<div class="seg">${[[0,'🤖 vs CPU'],[1,'👥 vs amigo']].map(([v,n])=>`<button class="c${MD===v?' on':''}" data-a="md" data-v="${v}">${n}</button>`).join('')}</div>`)
  +sec(MD?'Lutadores':'Lutador',card(1,CAND)+(MD?card(2,CAND2):''))
  +sec('Equipamento e arena'+(MD?' · jogador '+PL:''),`<div class="g3">${slot('w','Poder')}${slot('a','Bônus')}${TRN?'':slot('m','Onde lutar')}</div>${TRN?'':`<div class="g3" style="margin-top:6px">${dslot(MD?PL:1)}</div>`}${TRN?'':`<div class="chips" style="margin-top:6px"><button class="c${rallOn()?' on':''}" data-a="rall">🎲 Tudo aleatório</button></div>`}`)
  +sec('Finalização',`<div class="chips">${FIN_L.map(([v,n])=>`<button class="c${FK===v&&!RND.f?' on':''}" data-a="fk" data-v="${v}"${FIN_OK.includes(v)?'':' style="opacity:.55"'}>${n}</button>`).join('')}</div><div class="chips"><button class="c${RND.f?' on':''}" data-a="rt" data-k="f">🎲 Aleatória</button><button class="c${FB?' on':''}" data-a="fb">🩸 Sangue: ${FB?'ligado':'desligado'}</button></div>`)
  +(MD||TRN?'':sec('Adversário (CPU)',`<div class="g3">${cslot('w','Poder')}${cslot('a','Bônus')}</div><div class="g3" style="margin-top:6px">${dslot(3)}</div><div class="lb" style="margin-top:6px">Finalização da CPU</div><div class="chips">${[[-1,'🤝 Igual à minha'],[-2,'🎲 Aleatória'],...FIN_L].map(([v,n])=>`<button class="c${CPF===v?' on':''}" data-a="cfk" data-v="${v}">${n}</button>`).join('')}</div>`))
  +(MD||TRN?'':sec('Dificuldade da CPU',`<div class="seg">${['😊 Fácil','😐 Normal','😈 Difícil'].map((n,i)=>`<button class="c${DF===i?' on':''}" data-a="df" data-v="${i}">${n}</button>`).join('')}</div>`));
  const t=MR.querySelector('#fgmsg');if(t)t.textContent=(CAND?CAND.nome:'Escolha um candidato')+(MD?(CAND2?' vs '+CAND2.nome:' vs amigo'):(TRN?' · treino':' vs CPU'))};
const pw=p=>`${(FD.PD[p[6]]||FD.T[p[1]]).replace('{d}',p[2]).replace('{e}',p[4]).replace('{s}',p[5])} · recarga ${p[3]}s`;
function screenPick(){const{k,i,info}=PI,L=lst(k),it=L[i],ttl=(PI.cpu?'CPU · ':'')+{w:'Selecione a arma',a:'Selecione o acessório',m:'Selecione o mapa'}[k];let st;
  if(k==='m')st=`<div style="display:flex;flex-direction:column;align-items:center;gap:6px;min-height:0"><canvas id="fgpv" width="400" height="225" style="max-width:100%;max-height:calc(60*var(--v));border-radius:12px;border:2px solid #fff4"></canvas><b style="font-size:16px">${it[0]} ${E(it[1])}</b><small style="opacity:.7">${it[7].length} plataforma${it[7].length>1?'s':''}</small></div>`;
  else{const det=k==='w'?`<b>${E(it[1])}</b> · soco ×${it[2]}<br><br>`+it.slice(3).map((p,n)=>`<b>Poder ${n+1}: ${E(p[0])}</b><br><small>${pw(p)}</small>`).join('<br>'):`<b>${E(it[1])}</b><br><br>${FD.desc(it[2]).split(', ').map(x=>'• '+E(x)).join('<br>')}`;
    st=`<div class="stage"><div style="text-align:center"><button data-a="pinfo" class="hero${info?' on':''}" style="font-size:min(calc(20*var(--v)),84px);line-height:1.1">${FS.tag(k,i,0,'width:min(calc(20*var(--v)),90px);height:min(calc(20*var(--v)),90px);display:block')}</button><div style="font-weight:800;margin-top:4px">${E(it[1])}</div><small class="hint">${info?'Toque para fechar':'Toque no ícone p/ detalhes'}</small></div>${info?`<div style="font-size:12px;line-height:1.35;background:#ffffff10;border-radius:12px;padding:8px 10px;overflow-y:auto;max-height:calc(62*var(--v));max-width:50%">${det}</div>`:''}</div>`}
  shell(`<div class="top"><button class="c" data-a="pback">← Voltar</button><b>${ttl}</b><span class="hint" style="font-size:12px">${i+1} / ${L.length}</span></div><div class="body" style="align-items:center"><button class="b s nv" data-a="pnav" data-v="-1">◀</button><div class="cen" style="flex:1">${st}</div><button class="b s nv" data-a="pnav" data-v="1">▶</button></div><div class="fgf"><button class="b s" data-a="prnd">🎲 Aleatório</button><span style="flex:1"></span><button class="b" data-a="pok">✔ Escolher</button></div>`);
  if(k==='m'){const c=MR.querySelector('#fgpv'),x=c.getContext('2d');x.scale(.5,.5);paintMap(x,i,0)}}
const awOpts=()=>['auto','','*',...Object.keys(AWD)];
function screenAw(){const{w,i}=AWP,L=awOpts(),o=L[i],cn=w===3?null:w===2?CAND2:CAND,d=o&&o!=='auto'?AWD[o]:null,pk=o==='auto'?(w===3?null:AWD[awKind(cn)]):null;let h;
  if(o==='*')h=`<div style="font-size:42px">🎲</div><div style="font-weight:800;margin-top:4px">Aleatório</div><small class="hint">Um despertar diferente a cada luta</small>`;
  else if(o==='auto')h=`<div style="font-size:42px">🔥</div><div style="font-weight:800;margin-top:4px">${w===3?'Padrão do adversário':'Padrão do candidato'}</div><small class="hint">${w===3?'Só tem despertar se o adversário sorteado tiver um (como antes)':pk?'Hoje: '+E(pk.n):'Este candidato não tem despertar'}</small>`;
  else if(o==='')h=`<div style="font-size:42px">🚫</div><div style="font-weight:800;margin-top:4px">Nenhum</div><small class="hint">Sem despertar nem poder final</small>`;
  else h=`<div style="font-size:min(calc(18*var(--v)),72px);line-height:1.1">${awIc(d.ic)}</div><div style="font-weight:800;margin-top:4px">${E(d.n)}</div><small class="hint" style="display:block;max-width:80%;margin:4px auto 0">${E(d.d||'')}</small>`;
  shell(`<div class="top"><button class="c" data-a="pback">← Voltar</button><b>${w===3?'CPU · ':w===2&&MD?'Jogador 2 · ':''}Despertar</b><span class="hint" style="font-size:12px">${i+1} / ${L.length}</span></div><div class="body" style="align-items:center"><button class="b s nv" data-a="anav" data-v="-1">◀</button><div class="cen" style="flex:1"><div class="stage"><div style="text-align:center">${h}</div></div></div><button class="b s nv" data-a="anav" data-v="1">▶</button></div><div class="fgf"><span style="flex:1"></span><button class="b" data-a="aok">✔ Escolher</button></div>`)}
const pickDone=()=>{const{k,i}=PI;if(!PI.cpu){RND[k==='m'?'m':k+PL]=0;rndSave()}if(PI.cpu){if(k==='w')CPW=i;else CPA=i}else if(k==='m'){MP=i;PK.m=1}else if(k==='w'){PL===1?WP=i:WP2=i;PK.w[PL-1]=1}else{PL===1?AC=i:AC2=i;PK.a[PL-1]=1}PI=null;screenSetup()};
async function loadList(force){const k=key();if(LC[k]&&!force){LIST=LC[k];ERRM='';LOADING=0;if(!CAND&&LIST[0])CAND=LIST[0];paintList();paintRight();return}
  LOADING=1;ERRM='';LIST=[];paintList();
  try{const r=await one(CG,1,CG==='presidente'?'':UF,'');LC[k]=r.c}
  catch(e){if(typeof D!=='undefined'&&D&&D.cargo===CG&&D.c&&D.c.length&&(CG==='presidente'||S.uf===UF))LC[k]=D.c;else ERRM=e&&e.st?'Candidatos ainda não disponíveis no TSE para esta seleção.':'Falha de conexão: '+(e&&e.message||e)}
  if(key()!==k)return;LOADING=0;LIST=LC[k]||[];if(!CAND&&LIST[0])CAND=LIST[0];paintList();paintRight()}
const rndEnemy=()=>{const l=LIST.filter(x=>!(CAND&&x.id===CAND.id)&&!(CAND2&&x.id===CAND2.id));return l.length?l[Math.random()*l.length|0]:{id:0,nome:'Adversário',partido:'',foto:''}};
const say=m=>{const t=MR&&MR.querySelector('#fgmsg');if(t)t.textContent=m};

const GLC=['#fff','#fc6','#ffb347','#00e5ff','#ff7a7a','#7ad0ff'],TIPS=['Dica: em Opções você edita o tamanho e a posição dos botões.','Dica: o botão 🛡 bloqueia ataques e o 💨 faz um avanço rápido.','Dica: crie armas, finalizações e despertares em Minhas criações.','Dica: a Biblioteca traz criações de outros jogadores.'];
const rndTxt=()=>{const r=[],n=(k,t)=>RND[k]&&r.push(t);const fn=FIN_L.find(q=>q[0]===FK);n('w1','Arma: '+((FD.W[WP]||[])[1]||''));n('w2','Arma J2: '+((FD.W[WP2]||[])[1]||''));n('a1','Acessório: '+((FD.A[AC]||[])[1]||''));n('a2','Acessório J2: '+((FD.A[AC2]||[])[1]||''));n('m','Mapa: '+((FD.M[MP]||[])[1]||''));if(!TRN){n('f','Finalização: '+(fn?fn[1].replace(/^\S+\s/,''):''));n('d1','Despertar: '+((AWD[AW]||{}).n||''));if(MD)n('d2','Despertar J2: '+((AWD[AW2]||{}).n||''));else n('d3','Despertar CPU: '+((AWD[AWE]||{}).n||''))}return r.length?'🎲 '+r.join(' · '):''};
function screenLoad(){ENM=TRN?{id:0,nome:'Boneco de teste',partido:'Treino',foto:''}:MD?null:rndEnemy();ENW=TRN?0:CPW>=0?CPW:rndPick('cw',Array.from({length:20},(_,i)=>i));ENA=TRN?0:CPA>=0?CPA:rndPick('ca',Array.from({length:25},(_,i)=>i));CPFR=CPF===-2?rndPick('cf',FIN_OK.filter(q=>q>0)):CPF>=0&&FIN_OK.includes(CPF)?CPF:-1;
  const pvp=MD===1,me=CAND,ot=pvp?CAND2:ENM,urls=[...new Set([me&&me.foto,ot&&ot.foto].filter(Boolean))];
  const sp=[['w',WP],['a',AC],...(pvp?[['w',WP2],['a',AC2]]:[['w',ENW],['a',ENA]])].filter((v,i,l)=>l.findIndex(u=>u[0]===v[0]&&u[1]===v[1])===i);
  const wait=(ok,ms)=>new Promise(r=>{const t0=performance.now(),f=()=>{if(ok()||performance.now()-t0>ms)r();else setTimeout(f,40)};f()});
  const photo=u=>new Promise(r=>{if(imgs[u]&&imgs[u].complete)return r();const i=new Image();i.onload=i.onerror=()=>r();i.src=u;imgs[u]=i;setTimeout(r,3500)});
  const T=[...urls.map(u=>['Carregando lutadores…',()=>photo(u)]),...sp.map(([k,i])=>[k==='w'?'Montando armas…':'Montando acessórios…',()=>{const c=FS.img(k,i);return wait(()=>c.complete,3000)}])];
  const awLn=k=>k&&AWD[k]?`<small style="opacity:.85;font-size:11px">🔥 ${E(AWD[k].n)}</small>`:'';
  const pic=c=>c&&c.foto?`<img src="${E(c.foto)}" alt="">`:'<span class="av"></span>',nm=c=>E(c&&c.nome||'Adversário');
  shell(`<div class="hm hl"><div class="flag"></div><div class="spot"></div><div class="ring"></div><div class="gl l">🥊</div><div class="mid"><div class="t1">LUTA</div><div class="t2">DE CANDIDATOS</div><div class="ldv"><div class="ldp">${pic(me)}<b>${nm(me)}</b>${awLn(awRes(AW,me))}</div><i>VS</i><div class="ldp">${pic(ot)}<b>${nm(ot)}</b>${TRN?'':awLn(awRes(pvp?AW2:AWE,ot))}${pvp||TRN?'':`<small style="opacity:.85;font-size:11px">${E((FD.W[ENW]||[])[1]||'')} · ${E((FD.A[ENA]||[])[1]||'')}</small>`}</div></div><div class="bar"><i id="fgp"></i></div>${RM?`<div class="sub" style="opacity:.95;margin:0;font-size:12px">${E(rndTxt())}</div>`:''}<div id="fgls" class="sub" style="opacity:.95;font-weight:700;margin:0">${T[0]?T[0][0]:'Preparando efeitos…'}</div><div id="fgtp" class="sub" style="margin:0">${TIPS[0]}</div></div><div class="gl r">🥊</div><div class="ball" id="fgb" style="--p:0"><span id="fgbp">0%</span></div></div>`);
  let done=0,ti=0,ix=0;const tot=T.length+2;
  const upd=txt=>{if(!MR)return;const p=Math.round(done/tot*100),q=n=>MR.querySelector(n);q('#fgp').style.width=p+'%';q('#fgb').style.setProperty('--p',p);q('#fgbp').textContent=p+'%';if(txt)q('#fgls').textContent=txt};
  ti=setInterval(()=>{const t=MR&&MR.querySelector('#fgtp');if(!t)return clearInterval(ti);ix=(ix+1)%TIPS.length;t.textContent=TIPS[ix]},3200);
  const warm=()=>{try{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');sp.forEach(([k,i])=>{try{g.drawImage(FS.img(k,i),0,0,64,64)}catch(e){}});GLC.forEach(k=>{try{g.drawImage(glow(k),0,0,64,64)}catch(e){}})}catch(e){}return new Promise(r=>{requestAnimationFrame(()=>r());setTimeout(r,150)})};
  (async()=>{const pend=T.map(t=>t[0]);
    await Promise.all(T.map((t,i)=>t[1]().catch(()=>0).then(()=>{done++;pend[i]=null;upd(pend.find(Boolean)||'Preparando efeitos…')})));
    if(!MR)return clearInterval(ti);
    upd('Preparando efeitos…');GLC.forEach(glow);done++;upd();
    upd('Aquecendo a arena…');await warm();done++;upd('Pronto!');
    await new Promise(r=>setTimeout(r,250));clearInterval(ti);if(MR)start()})()}

/* ---------- eventos do menu ---------- */
window.BRC&&(BRC.api={shell,root:()=>MR,cargos:cargoN,ufs:UFS,cur:()=>({cg:CG,uf:UF}),cands:(cg,uf)=>{const k=cg==='presidente'?'presidente|br':cg+'|'+uf;if(LC[k])return Promise.resolve(LC[k]);return one(cg,1,cg==='presidente'?'':uf,'').then(r=>(LC[k]=r.c))},fix:()=>{awChk();if(CPW>=FD.W.length)CPW=-1;if(CPA>=FD.A.length)CPA=-1;WP=Math.min(WP,FD.W.length-1);WP2=Math.min(WP2,FD.W.length-1);AC=Math.min(AC,FD.A.length-1);AC2=Math.min(AC2,FD.A.length-1);MP=Math.min(MP,FD.M.length-1);FIN_OK.length=6;FIN_L.length=6;BRC.FO.forEach(q=>{FIN_OK.push(q.k);FIN_L.push([q.k,q.lb])});if(!FIN_OK.includes(FK))FK=1},testFin:(k,fb,win)=>{if(!FIN_OK.includes(k))return 0;if(!window.BRCFO)window.BRCFO={k:FK,b:FB};FK=k;FB=fb?1:0;window.BRCFT={win:win?1:0};return 1},test:(wi,ai,mi,aw)=>{if(aw){CAND={id:0,nome:'Treino',partido:'',foto:''};window.BRCAWT=aw}else{window.BRCAWT=0;if(!CAND)CAND={id:0,nome:'Treino',partido:'',foto:''}}TRN=0;MD=0;PL=1;WP=wi==null?0:wi;AC=ai==null?Math.min(AC,FD.A.length-1):ai;if(mi!=null)MP=mi;PK.w[0]=PK.a[0]=PK.m=1;window.BRCT=1;screenLoad()}});
function onClick(e){const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,v=t.dataset.v;
  const A={trn:()=>{window.BRCT=0;brcRest();TRN=1;MD=0;PL=1;if(CAND&&CAND.id===0&&CAND.nome==='Treino')CAND=null;screenSetup()},play:()=>{TRN=0;window.BRCT=0;brcRest();if(CAND&&CAND.id===0&&CAND.nome==='Treino')CAND=null;screenSetup()},opts:screenOpts,menu:screenMenu,exit:exitFight,
    hud:screenHud,hreset:()=>{OPT.lay=null;ST.set('opt',OPT);hudPaint()},hsz:()=>{const c=hudEnsure(HSEL);c.s=clampN(Math.round(((c.s||1)+.1*+v)*100)/100,.5,2.2);ST.set('opt',OPT);hudPaint()},
    opt:()=>{const k=t.dataset.k,c0=MR&&MR.querySelector('.col'),sc=c0?c0.scrollTop:0;OPT[k]=(k==='size'||/^c[A-Z]/.test(k))?+v:v;ST.set('opt',OPT);SFX.cfg(OPT.vol,OPT.snd);screenOpts();const c1=MR&&MR.querySelector('.col');if(c1)c1.scrollTop=sc},
    creset:()=>{['cAwc','cAwd','cRt','cVid','cCd'].forEach(k=>delete OPT[k]);ST.set('opt',OPT);screenOpts()},
    cg:()=>{CG=v;Q='';SHOW=60;paintTop();loadList()},
    pl:()=>{PL=+v;paintRight();paintList()},
    md:()=>{MD=+v;if(!MD)PL=1;paintRight();paintList()},
    df:()=>{DF=+v;paintRight()},
    fk:()=>{const n=+v;if(!FIN_OK.includes(n)){paintRight();return say('Essa finalização chega nas próximas partes.')}FK=n;RND.f=0;rndSave();ST.set('fin',{k:FK,b:FB});paintRight()},
    fb:()=>{FB=FB?0:1;ST.set('fin',{k:FK,b:FB});paintRight()},
    pick:()=>{const c=LIST[+v];if(!c)return;if(PL===1)CAND=c;else CAND2=c;paintRight();paintList();if(MD&&PL===1&&!CAND2){PL=2;paintRight();paintList()}},
    more:()=>{SHOW+=60;paintList()},dslot:()=>{const w=+t.dataset.w,v=awv(w),L=awOpts();AWP={w,i:RND['d'+w]?2:Math.max(0,L.indexOf(v))};screenAw()},anav:()=>{const n=awOpts().length;AWP.i=(AWP.i+ +v+n)%n;screenAw()},aok:()=>{const{w,i}=AWP,o=awOpts()[i];RND['d'+w]=o==='*'?1:0;rndSave();if(o!=='*'){if(w===3)AWE=o;else if(w===2)AW2=o;else AW=o}AWP=null;screenSetup()},cslot:()=>{const k=t.dataset.k;PI={k,i:Math.max(0,k==='w'?CPW:CPA),info:0,cpu:1};screenPick()},prnd:()=>{if(PI.cpu){if(PI.k==='w')CPW=-1;else CPA=-1}else{RND[PI.k==='m'?'m':PI.k+PL]=1;rndSave()}PI=null;screenSetup()},rt:()=>{RND[t.dataset.k]=RND[t.dataset.k]?0:1;rndSave();paintRight()},rall:()=>{const on=!rallOn();Object.keys(RG).forEach(g=>RG[g].forEach(k=>RND[k]=on?1:0));rndSave();paintRight()},rg:()=>{const g=t.dataset.g,on=g==='all'?!rallOn():!rgAny(g),c0=MR&&MR.querySelector('.col'),sc=c0?c0.scrollTop:0;if(g==='all')Object.keys(RG).forEach(h=>RG[h].forEach(k=>RND[k]=on?1:0));else RG[g].forEach(k=>RND[k]=on?1:0);rndSave();screenOpts();const c1=MR&&MR.querySelector('.col');if(c1)c1.scrollTop=sc},cfk:()=>{CPF=+v;paintRight()},slot:()=>{PI={k:t.dataset.k,i:kv(t.dataset.k),info:0};screenPick()},pnav:()=>{const n=lst(PI.k).length;PI.i=(PI.i+ +v+n)%n;screenPick()},pinfo:()=>{PI.info=PI.info?0:1;screenPick()},pok:pickDone,pback:()=>{PI=null;AWP=null;screenSetup()},retry:()=>loadList(true),
    go:()=>{if(!CAND)return say('Escolha um candidato na lista.');if(MD&&!CAND2)return say('Jogador 2: escolha um candidato.');{const bad=[0,MD?1:0].map(n=>!PK.w[n]&&!RND['w'+(n+1)]?'a arma':!PK.a[n]&&!RND['a'+(n+1)]?'o acessório':'').map((x,n)=>x?(MD?'Jogador '+(n+1)+': ':'')+'selecione '+x:'').find(Boolean)||(!PK.m&&!TRN&&!RND.m?'Selecione o mapa.':'');if(bad)return say(bad);awChk();ST.set('sel',{CAND,CAND2,WP,AC,WP2,AC2,MP,DF,MD,CG,UF,PK,CPW,CPA,CPF,AW,AW2,AWE});rndRoll();screenLoad()}}};
  SFX.ui(a);(A[a]||(/^brc/.test(a)&&window.BRC?()=>BRC.click(a,t,e):()=>{}))()}
function onInput(e){if(e.target.id==='fgvol'){OPT.vol=+e.target.value;ST.set('opt',OPT);SFX.cfg(OPT.vol,OPT.snd);const l=document.getElementById('fgvl');if(l)l.textContent=OPT.vol+'%';return}if(e.target.id==='fgq'){Q=e.target.value;SHOW=60;paintList()}}
function onChange(e){if(window.BRC&&BRC.change(e))return;if(e.target.id==='fgvol'){SFX.unlock();SFX.p('select');return}const t=e.target,a=t.dataset.a,v=t.value;
  if(a==='uf'){UF=v;SHOW=60;loadList()}
  }

/* ---------- layout dos controles (1 jogador, paisagem) ---------- */
const soloL=()=>{const z=OPT.size,R=OPT.side==='r',s=n=>Math.round(n*z),X=n=>(R?'right:':'left:')+s(n)+'px',B=n=>'bottom:'+s(n)+'px';
  /* posição livre (editor de HUD): OPT.lay[id]={x,y,s} — centro em fração da tela + multiplicador de tamanho */
  const ov=(id,sz,css)=>{const l=OPT.lay&&OPT.lay[id];if(!l||typeof l.x!=='number')return[css,sz];const s2=Math.max(24,Math.round(sz*(l.s||1)));return[`left:${(l.x*100).toFixed(2)}%;top:${(l.y*100).toFixed(2)}%;margin:${-s2/2}px 0 0 ${-s2/2}px`,s2]};
  const j=ov('j',s(120),(R?'left':'right')+':18px;bottom:18px'),a=ov('a',s(54),X(226)+';'+B(152)),u=ov('u',s(54),X(226)+';'+B(92)),
    p=[ov('p0',s(54),X(28)+';'+B(166)),ov('p1',s(54),X(92)+';'+B(150)),ov('p2',s(54),X(156)+';'+B(122))],
    b=[['atk','👊',s(76),X(28)+';'+B(22)],['dash','💨',s(54),X(112)+';'+B(18)],['jump','⤒',s(58),X(176)+';'+B(34)],['blk','🛡',s(54),X(28)+';'+B(108)]].map(([k,t,sz,css])=>{const o=ov(k,sz,css);return[k,t,o[1],o[0]]});
  return{j:j[0],js:j[1],ps:s(54),a:a[0],az:a[1],u:u[0],uz:u[1],p:p.map(q=>q[0]),pz:p.map(q=>q[1]),b}};
function start(){
  if(run)return;closeMenu();const pvp=MD===1,c=CAND;
  const o=mkRoot('fg');
  const sz=o.clientWidth<720?38:44,KS=[],pbs=[],abs=[],FT=[];
  o.innerHTML=`<canvas id="fgc" style="width:100%;height:100%;display:block"></canvas><canvas id="fgh" style="position:absolute;left:0;top:0;width:100%;height:100%;display:block;pointer-events:none"></canvas><div id="fgt" style="position:absolute;top:5px;left:10px;display:flex;align-items:center;gap:6px;z-index:2;pointer-events:none"><button id="fx" style="padding:6px 14px;font-size:12px;border-radius:10px;background:#0008;color:#fff;border:1px solid #fff4;pointer-events:auto">✕ Sair</button><button id="fs" style="display:none;padding:6px 14px;font-size:12px;border-radius:10px;background:#0008;color:#fff;border:1px solid #fff4;pointer-events:auto">⏭ Pular</button><button id="fp" style="padding:6px 14px;font-size:12px;border-radius:10px;background:#0008;color:#fff;border:1px solid #fff4;pointer-events:auto">⏸</button><span id="fgr" style="font:bold 13px sans-serif;color:#fff;text-shadow:0 0 3px #000,0 1px 3px #000,0 0 6px #000;white-space:nowrap;margin-left:2px"></span><span id="fgfps" style="display:none;font:600 10px monospace;color:#7dff9a;opacity:.7;text-shadow:0 0 3px #000,0 1px 2px #000;margin-left:6px;white-space:nowrap"></span></div>${TRN?`<div id="fgd" style="position:absolute;left:10px;top:40px;display:flex;flex-wrap:wrap;max-width:360px;gap:5px;z-index:2;pointer-events:none">${[['ftm','🧍','Modo do boneco'],['fti','♾','Imortal / vida normal'],['ftr','↺','Reviver e resetar'],['ftz','⚡','Recarga zerada'],['ftv','1×','Velocidade do jogo'],['fta','✨','Ativar despertar agora'],['ftf','🎬','Disparar finalização agora'],['ftx','▢','Mostrar caixas de colisão'],['ftc','📖','Catálogo']].map(([i,t,h])=>`<button id="${i}" title="${h}" style="padding:2px 8px;font-size:13px;line-height:1.3;border-radius:9px;background:#0008;color:#fff;border:1px solid #fff4;pointer-events:auto">${t}</button>`).join('')}<span id="fgs" style="flex-basis:100%;font:bold 11px sans-serif;color:#fff;text-shadow:0 0 3px #000,0 1px 3px #000;white-space:nowrap">dano 0 · dps 0 · maior 0</span></div>`:''}`;
  document.body.appendChild(o);o.addEventListener('contextmenu',e=>e.preventDefault());
  const mkCtl=(i,host,L,wp)=>{const K=KS[i]||{l:0,r:0,jump:0,dash:0,blk:0,atk:0,ax:0,tm:0,ta:0,ku:0,kd:0};KS[i]=K;
    const btn=(t,s,css,cls)=>{host.insertAdjacentHTML('beforeend',`<button class="fb ${cls||''}" style="position:absolute;width:${s}px;height:${s}px;font-size:${Math.round(s*.44)}px;${css}">${t}</button>`);return host.lastElementChild};
    const vib=()=>{if(OPT.vib==='s'&&navigator.vibrate)try{navigator.vibrate(8)}catch(_){}};
    const flash=e=>{e.classList.add('on');setTimeout(()=>e.classList.remove('on'),140)};
    const hold=(e,k)=>{e.addEventListener('pointerdown',ev=>{ev.preventDefault();e.setPointerCapture(ev.pointerId);K[k]=1;e.classList.add('on');vib()});const up=()=>{e.classList.remove('on');if(k==='blk')K.blk=0};e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up);e.addEventListener('lostpointercapture',up)};
    L.b.forEach(([k,t,s,css])=>hold(btn(t,s,css,'k-'+k),k));
    pbs[i]=[0,1,2].map(n=>{const e=btn('<span class="pl">'+wp[3+n][0]+'</span><b class="pi">'+(PTI[wp[3+n][1]]||PTI.B)+'</b><i class="cdv"></i>',L.pz?L.pz[n]:L.ps,L.p[n],'pw');e.addEventListener('pointerdown',ev=>{ev.preventDefault();flash(e);vib();cast(FT[i],FT[1-i],n)});return e});
    const ak=TRN?(FT[i]?FT[i].aw:awKind(i?(CAND2||c):c)):awRes(i?AW2:AW,i?(CAND2||c):c);if(ak&&AWD[ak]){const sp='<span class="pl">…</span>',cc=AWD[ak].c,bc='border-color:'+cc[1]+';border-width:3px;background:linear-gradient(160deg,'+cc[0]+'55,'+cc[1]+'cc 55%,'+cc[2]+');color:#fff;text-shadow:0 1px 3px #000;box-shadow:0 0 14px '+cc[1]+'99;';
      abs[i]=[btn(sp,L.az||L.ps,L.a+';'+bc,'aw'),btn(sp,L.uz||L.ps,L.u+';'+bc,'aw')];
      abs[i][0].addEventListener('pointerdown',ev=>{ev.preventDefault();flash(abs[i][0]);vib();awaken(FT[i])});abs[i][1].addEventListener('pointerdown',ev=>{ev.preventDefault();flash(abs[i][1]);vib();ult(FT[i],FT[1-i])})}else delete abs[i];
    host.insertAdjacentHTML('beforeend',`<div class="jy" style="position:absolute;${L.j};width:${L.js}px;height:${L.js}px"><div class="jk" style="left:${L.js*.29}px;top:${L.js*.29}px;width:${L.js*.42}px;height:${L.js*.42}px"></div></div>`);
    const j=host.lastElementChild,kn=j.firstElementChild,jm=ev=>{const r=j.getBoundingClientRect(),h=L.js/2,dd=rv(ev.clientX-(r.left+r.width/2),ev.clientY-(r.top+r.height/2)),dx=dd[0],dy=dd[1],d=Math.hypot(dx,dy)||1,m=Math.min(d,h*.7);kn.style.transform=`translate(${dx/d*m}px,${dy/d*m}px)`;K.ax=Math.abs(dx)>h*.2?(dx>0?1:-1):0;K.tm=d>h*.3?1:0;K.ta=Math.abs(dy)<h*.14?0:Math.max(-1.3,Math.min(1.3,Math.atan2(-dy,Math.abs(dx))));if(OPT.sj==='s'&&dy<-h*.6)K.jump=1};
    j.addEventListener('pointerdown',ev=>{ev.preventDefault();j.setPointerCapture(ev.pointerId);j.classList.add('on');vib();jm(ev)});j.addEventListener('pointermove',ev=>{if(j.hasPointerCapture(ev.pointerId))jm(ev)});
    const jr=()=>{K.ax=0;K.tm=0;kn.style.transform='';j.classList.remove('on')};j.addEventListener('pointerup',jr);j.addEventListener('pointercancel',jr);j.addEventListener('lostpointercapture',jr)};
  const hostCss=(side)=>`position:absolute;bottom:env(safe-area-inset-bottom,0px);${side===2?'left:0;right:0;height:100%':'width:50%;height:150px;'+(side?'right:0;border-left:1px solid #fff3':'left:0')}`;
  const mkHost=side=>{o.insertAdjacentHTML('beforeend',`<div style="${hostCss(side)}"></div>`);return o.lastElementChild};
  const pvpL=i=>{const z=Math.min(OPT.size,1),s=Math.round(sz*z),g=s+4,a=i?'right':'left',o=n=>`${a}:${n}px`,js=Math.round(96*z),b0=js+16;
    return{j:`${a}:6px;bottom:6px`,js,ps:s,a:`${o(b0)};bottom:${2*s+18}px`,u:`${o(b0+g)};bottom:${2*s+18}px`,p:[0,1,2].map(n=>`${o(b0+n*g)};bottom:${s+10}px`),b:[['jump','⤒',s,`${o(b0)};bottom:6px`],['dash','💨',s,`${o(b0+g)};bottom:6px`],['blk','🛡',s,`${o(b0+2*g)};bottom:6px`],['atk','👊',s+8,`${o(b0+3*g)};bottom:6px`]]}};
  let H0=null;if(pvp){[0,1].forEach(i=>mkCtl(i,mkHost(i),pvpL(i),FD.W[i?WP2:WP]))}
  else{H0=mkHost(2);mkCtl(0,H0,soloL(),FD.W[WP])}
  const K=KS[0],K2=KS[1];
  const key=(KK,i,m,k,v)=>{if(k===m[9])KK.ku=v;if(k===m[10])KK.kd=v;if(v&&k===m[7])awaken(FT[i]);if(v&&k===m[8])ult(FT[i],FT[1-i]);if(k===m[0])KK.l=v;if(k===m[1])KK.r=v;if(v&&k===m[2])KK.jump=1;if(v&&k===m[3])KK.atk=1;if(v&&k===m[4])KK.dash=1;if(k===m[5])KK.blk=v;if(v){const n=m[6].indexOf(k);if(n>=0)cast(FT[i],FT[1-i],n)}};
  const kd=e=>{if(e.target&&e.target.tagName==='INPUT')return;const v=e.type==='keydown'?1:0,k=e.key.toLowerCase();key(K,0,['a','d','w','j','k','l','123','q','e','r','f'],k,v);
    if(pvp)key(K2,1,['arrowleft','arrowright','arrowup',',','.','/','890','m','n','o','p'],k,v);else{if(k==='arrowleft')K.l=v;if(k==='arrowright')K.r=v;if(v&&k==='arrowup')K.jump=1}};
  addEventListener('keydown',kd);addEventListener('keyup',kd);

  const cv=o.querySelector('#fgc'),x=cv.getContext('2d',{alpha:false}),hc=o.querySelector('#fgh'),hx=hc.getContext('2d'),gt=o.querySelector('#fgt'),gr=o.querySelector('#fgr'),gd=o.querySelector('#fgd'),gst=o.querySelector('#fgs');let gs='';
  let QL=0,fE=16.7,fN=0,fW=0,lt0=performance.now();const QS=[1,.78,.62];
  const fit=()=>{let d=Math.min(devicePixelRatio||1,1)*QS[QL];const cw=o.clientWidth*d;if(cw>1280)d*=1280/cw;const w=Math.round(o.clientWidth*d),h=Math.round(o.clientHeight*d);if(cv.width!==w)cv.width=w;if(cv.height!==h)cv.height=h;const hd=Math.min(devicePixelRatio||1,2),hw=Math.round(o.clientWidth*hd),hh=Math.round(o.clientHeight*hd);if(hc.width!==hw)hc.width=hw;if(hc.height!==hh)hc.height=hh;const cs=Math.min(o.clientWidth/W,o.clientHeight/H);gt.style.left=Math.max(6,(o.clientWidth-W*cs)/2+16*cs)+'px';gt.style.top=Math.max(4,(o.clientHeight-H*cs)/2+(OPT.bars==='c'?6:84)*cs)+'px';if(gd){gd.style.left=gt.style.left;gd.style.top=(parseFloat(gt.style.top)+30)+'px'}};fit();addEventListener('resize',fit);
  AWDUR=OPT.cAwd||20;AWC=OPT.cAwc||60;const P=mk(400,c,1,FD.W[WP],FD.A[AC]),E=pvp?mk(1200,CAND2||c,-1,FD.W[WP2],FD.A[AC2]):mk(1200,ENM||rndEnemy(),-1,FD.W[ENW>=0?ENW:Math.random()*20|0],FD.A[ENA>=0?ENA:Math.random()*25|0]);FT.push(P,E);ENW=ENA=-1;if(!TRN){const ap=(f,v)=>{if(v==='auto'||(v&&!AWD[v]))return;f.aw=v;f.awT=0;f.ulU=0};ap(P,AW);ap(E,pvp?AW2:AWE)}if(window.BRCT){E.hp=E.mx=99999}[P,E].forEach(f=>{if(f.wi>=0)FS.img('w',f.wi);if(f.ai>=0)FS.img('a',f.ai)});['#fff','#fc6','#ffb347','#00e5ff','#ff7a7a','#7ad0ff'].forEach(glow);E.cpu=!pvp;P.vit=E.vit=0;let last=performance.now(),raf,paused=0;
  const stop=back=>{if(FKU!==null){FK=FKU;FKU=null}rndBack();if(TRN&&MPS!=null){FD.M.pop();MP=MPS;MPS=null}brcRest();cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',kd);removeEventListener('resize',fit);kill(o);run=null;if(back!==0)screenSetup()};
  const fsB=o.querySelector('#fs'),fsShow=v=>{fsB.style.display=v&&OPT.fsk!=='s'?'':'none'};fsB.onclick=()=>skipFin();let fpsC=0,fpsT=0,fpsV=0,fpsOn=0;const fpsEl=o.querySelector('#fgfps');o.querySelector('#fx').onclick=()=>stop();o.querySelector('#fp').onclick=e=>{paused=!paused;SFX.hold(paused);e.target.textContent=paused?'▶':'⏸'};run=1;

  if(TRN){MPS=MP;FD.M.push(['🏋','Dojo de Treinamento','#1a1030','#3a2a5a','#2a2230','#6a5a7a',4,[[100,120,305],[340,120,262],[580,120,305]]]);MP=FD.M.length-1}
  const M={pl:FD.M[MP][7].map(q=>{const w=Math.round(q[1]*1.3),c=(q[0]+q[1]/2)*2;return[Math.round(c-w/2),w,q[2]]})},PR=[],FX=[],LV=[{r:.35,b:.25,a:.5},{r:.2,b:.5,a:.75},{r:.1,b:.75,a:1}][DF];let SR=0,SF=0,tmo=0,over2=1,mt=0,cut=null,shk=0,rd=1,rst=1,rt=1.9,wt='';const RT=OPT.cRt||120,KOT=2.8,cam={x:WW/2,y:GY-100,z:1,i:0};const UL=[],TX=[];
  const SP=f=>230*(1+f.s.spd)*(f.bf>0?1+f.bfv:1)*(f.slow>0?.5:1);
  const flop=(t,dir,kb)=>{if(kb<80)return;t.rag=Math.max(t.rag||0,.15+kb/1400);if(t.rg)t.rg.forEach((p,i)=>{if(i!==2){p.vx+=dir*kb*(.35+Math.random()*.7);p.vy-=kb*.45*Math.random()}});if(kb>=250)shk=Math.min(9,shk+kb/55)};
  const cm=a=>a.cpu&&FD.CM&&FD.CM[DF]?FD.CM[DF][a.wi]||1:1; /* v1.6.4: ajuste de dano da CPU por dificuldade e arma */
  const hitF=(a,t,b,k,st,kb,dir)=>{dir=dir||a.face;const o=a._o||{};if(t.dig>0)return;if(t.dg>0&&!o.ap){t.dg=0;t.bf=2.5;t.bfv=.4;dodge(t);return}let d=b*(1+a.s.dmg)*(k==='p'?1+a.s.pdm:1)*cm(a)*(a.dd>0?1.3:1)*(a.wk>0?.75:1)*(t.mk>0?1.35:1)*(t.fu>0?1.1:1);if(a.nx>0){a.nx=0;a.inv=0;d*=1.6}if(Math.random()<a.s.crit)d*=2;if(!o.ap)d*=1-t.s.def;if(t.cn>0){t.cn=0;a.hp-=d;a.stun=Math.max(a.stun,.7);a.hurt=.3;SFX.p('reflect');ring(t.x,t.y-45,70,'#ffd54a');txt(a,'REFLETIDO!','#ffd54a');return}if(t.ice>0)a.slow=Math.max(a.slow,2);
    if(!o.gb&&t.blk&&t.face===-dir){SFX.p('block');t.hp-=Math.max(1,d*.1);if(TRN)trDm(a,t,Math.max(1,d*.1),1);t.vx=dir*80;return}
    if(!o.ap&&!o.gb&&t.sh>0){const q=Math.min(t.sh,d);t.sh-=q;d-=q}
    SFX.hit(d,k,kb,a.wi);if(o.ap&&a.wi===8)SFX.p('fx_picareta');t.hp-=d;if(TRN)trDm(a,t,d);a.hp=Math.min(a.mx,a.hp+d*a.s.ls);t.vx=dir*kb*(1-t.s.kbr);if(kb){t.vy=-220*(1-t.s.kbr);t.gr=false}t.hurt=.25;t.hit=.2;if(st)t.stun=Math.max(t.stun,st);flop(t,dir,kb)};
  const shot=(f,d,sp,s,z,vy)=>PR.push({o:f,x:f.x+f.face*26,y:f.y-48,vx:f.face*sp,vy:vy||0,d,st:z?0:s,sl:z?s:0,z,t:1.6,dir:f.face});
  /* ---------- poderes únicos (Parte 2B): cada id de FD.W tem sua própria mecânica em PW ---------- */
  const HK=[];
  const hk=(fn,dr)=>{const h={t:0,fn,dr};HK.push(h);return h};
  const after=(s,fn)=>hk((dt,h)=>{h.t+=dt;if(h.t>=s){fn();return 1}});
  const foe=f=>f===P?E:P,sdir=(a,b)=>b.x>=a.x?1:-1,txt=(o,s,c)=>TX.push({x:o.x,y:o.y-92,t:.9,s,c:c||'#fff'});
  const ring=(px,py,r,c)=>FX.push({x:px,y:py,r,t:.3,c});
  const nr=(f,t,r)=>Math.abs(t.x-f.x)<r+22&&Math.abs(t.y-f.y)<90;
  /* ---------- Parte 3: mira (elevação em rad; + = pra cima; relativa ao lado que o lutador olha) ---------- */
  const seg=(x1,y1,x2,y2,px,py,r)=>{const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1,u=Math.max(0,Math.min(1,((px-x1)*dx+(py-y1)*dy)/l)),qx=x1+dx*u-px,qy=y1+dy*u-py;return qx*qx+qy*qy<r*r};
  const clampA=a=>Math.max(-1.3,Math.min(1.3,a));
  const manA=f=>{const m=clampA(f.am||0);if(OPT.snap==='n'||!(f===P||(pvp&&f===E)))return m;const t=foe(f),dx=(t.x-f.x)*f.face;if(dx>30){const ta=clampA(Math.atan2((f.y-48)-(t.y-45),dx));if(Math.abs(m-ta)<.1)return ta}return m};
  const aimA=(f,t)=>{if(f.mn)return manA(f);const dx=(t.x-f.x)*f.face;if(dx<30)return 0;let a=Math.atan2((f.y-48)-(t.y-45),dx);if(!(f===P||(pvp&&f===E)))a+=(Math.random()-.5)*[.3,.16,.07][DF];return clampA(Math.max(-.6,Math.min(.9,a)))};
  const setAim=(f,k,dt)=>{let T=null;if(k.ku||k.kd)T=(k.ku?.9:0)-(k.kd?.9:0);else if(k.tm)T=k.ta||0;if(T==null){f.mn=0;return}
    if(!f.mn){f.mn=1;const t=foe(f),dx=(t.x-f.x)*f.face;f.am=dx>30?clampA(Math.max(-.6,Math.min(.9,Math.atan2((f.y-48)-(t.y-45),dx)))):0}
    f.am+=(T-f.am)*Math.min(1,(dt||.016)*16)};
  const hit=(f,t,d,st,kb,dir,o)=>{f._o=o||null;hitF(f,t,d,'p',st||0,kb==null?200:kb,dir||sdir(f,t));f._o=null};
  const dotE=(f,t,k,dps,sec)=>{t.dot=(t.dot||[]).filter(q=>q.k!==k);t.dot.push({k,t:sec,v:dps*HS*(FD.DM[f.wi]||1)*cm(f)*(1+f.s.dmg)*(1-t.s.def)})};
  const dashAt=(f,d,s,v,o)=>{o=o||{};f.dash=o.dur||.22;f.iv=o.iv||.3;f.vx=f.face*v;f.dm=[d,s||0];f.dmh=0;f.dmo=o.gb?{gb:1}:null;f.dmf=o.fn||null};
  const clampX=v=>Math.max(40,Math.min(WW-40,v));
  const strike=(px,py,r,delay,fn,c)=>hk((dt,h)=>{h.t+=dt;if(h.t>=delay){fn();return 1}},h=>{const a=Math.min(1,h.t/delay);x.save();x.strokeStyle=x.fillStyle=c||'#ff5a3a';x.lineWidth=3;x.globalAlpha=.25+.4*a;x.beginPath();x.ellipse(px,py-2,r,r*.28,0,0,7);x.stroke();x.globalAlpha=.1+.25*a;x.fill();x.restore()});
  const bolt=(px,py)=>hk((dt,h)=>{h.t+=dt;return h.t>=.2},()=>{x.save();x.lineJoin='round';x.beginPath();for(let y=-400;y<py;y+=40)x.lineTo(px+(Math.random()-.5)*34,y);x.lineTo(px,py);x.strokeStyle='rgba(153,204,255,.35)';x.lineWidth=11;x.stroke();x.strokeStyle='#fff';x.lineWidth=4;x.stroke();x.restore()});
  const zap=(x1,y1,x2,y2,life,col)=>hk((dt,h)=>{h.t+=dt;return h.t>=life},()=>{x.save();x.lineJoin='round';x.beginPath();x.moveTo(x1,y1);for(let n=1;n<8;n++)x.lineTo(x1+(x2-x1)*n/8,y1+(y2-y1)*n/8+(Math.random()-.5)*16);x.lineTo(x2,y2);x.globalAlpha=.3;x.strokeStyle=col||'#9cf';x.lineWidth=10;x.stroke();x.globalAlpha=1;x.strokeStyle=col||'#fff';x.lineWidth=4;x.stroke();x.restore()});
  const fire=(f,t,px,py,r,sec)=>hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;if(h.k>=.3){h.k=0;if(Math.abs(t.x-px)<r&&Math.abs(t.y-py)<60){hit(f,t,3*HS*(FD.DM[f.wi]||1),0,0,sdir({x:px},t));dotE(f,t,'🔥',3,2)}}return h.t>=sec},h=>{x.save();x.globalCompositeOperation='lighter';for(let n=0;n<8;n++){const u=((n*.19+h.t*1.6)%1);x.globalAlpha=(1-u)*.8;x.fillStyle=n%2?'#ff6a1a':'#ffd84a';x.beginPath();x.arc(px+(n/7-.5)*r*1.7,py-u*34,7*(1-u)+2,0,7);x.fill()}x.restore()});
  const shot2=(f,o)=>{const th=f.ca||0,c=Math.cos(th),sn=Math.sin(th),sx=f.x+f.face*26*c,sy=f.y-48-26*sn,q=Object.assign({o:f,x:sx,y:sy,x0:sx,vy:0,d:10,st:0,sl:0,t:1.6,dir:f.face,a:0,sz:14},o),lx=o.sp||520,ly=o.vy||0;q.vx=f.face*(lx*c+ly*sn);q.vy=ly*c-lx*sn;q.by=q.y;PR.push(q);return q};
  const blast=(q,px,py)=>{if(q.sx)SFX.p(q.sx);const f=q.o,t=foe(f),r=q.ex;FX.push({x:px,y:py,r,t:.35,c:q.c||'#ff9a3a'},{x:px,y:py,r:r*.6,t:.3,c:'#ffd84a'});shk=Math.min(9,shk+2);if(Math.abs(t.x-px)<r+20&&Math.abs(t.y-45-py)<r+40){hit(f,t,q.d,q.st,q.kb==null?300:q.kb,sdir({x:px},t));if(q.oh)q.oh(f,t,q)}};
  const updPR=dt=>{for(let i=PR.length-1;i>=0;i--){const q=PR[i],t=foe(q.o);let rm=0;q.a+=dt;q.t-=dt;q.x+=q.vx*dt;
    if(q.g)q.vy+=q.g*dt;q.by+=q.vy*dt;q.y=q.by+(q.sw?Math.sin(q.a*q.sw[1]+q.sw[2])*q.sw[0]:0);if(!q.g&&(q.by>GY-6||q.by<-600))rm=q.ex?2:1;
    if(q.g&&q.by>=GY-8&&q.vy>0){if(q.bn>0){q.bn--;q.by=GY-9;q.vy=-q.vy*.72;if(q.bf)q.bf(q)}else rm=q.ex?2:1}
    if(q.rt&&!q.rr&&q.a>=q.rt){q.rr=1;q.vx=-q.vx;q.vy=-q.vy;q.hh=0;q.dir=-q.dir}
    if(q.rr&&Math.abs(q.x-q.o.x)<30&&Math.abs(q.y-(q.o.y-48))<70)rm=1;
    if(q.x<0||q.x>WW){if(q.wb>0){q.wb--;q.vx=-q.vx;q.dir=-q.dir;q.x=Math.max(1,Math.min(WW-1,q.x))}else rm=1}
    if(q.fz&&q.a>=q.fz)rm=2;
    if(!rm&&!q.hh&&Math.abs(q.x-t.x)<(q.hw||26)&&Math.abs(q.y-(t.y-45))<(q.hv||50)){
      if(q.ex)rm=2;else{let d=q.d;if(q.ds)d*=1+Math.min(1,Math.abs(q.x-q.x0)/q.ds);if(q.oh)q.oh(q.o,t,q);hit(q.o,t,d,q.st,q.kb==null?260:q.kb,q.dir,q);if(q.sx)SFX.p(q.sx);if(q.sl)t.slow=Math.max(t.slow,q.sl);q.hh=1;if(!q.pi&&!q.rt)rm=1}}
    if(q.t<=0&&!rm)rm=1;
    if(rm===2)blast(q,q.x,q.y);
    if(rm)PR.splice(i,1)}};
  const drawQ=q=>{x.save();const sp=Math.hypot(q.vx,q.vy)||1,ux=q.vx/sp,uy=q.vy/sp,tm=performance.now();
    if(q.ln){const L=q.ln,c=q.c||'#ffd54a',tx=q.x-ux*L,ty=q.y-uy*L,gg=x.createLinearGradient(tx,ty,q.x,q.y);gg.addColorStop(0,hexA(c,0));gg.addColorStop(.7,hexA(c,.7));gg.addColorStop(1,'#fff');
      x.lineCap='round';x.strokeStyle=gg;x.lineWidth=5;x.beginPath();x.moveTo(tx,ty);x.lineTo(q.x,q.y);x.stroke();x.globalCompositeOperation='lighter';x.strokeStyle=hexA(c,.5);x.lineWidth=9;x.beginPath();x.moveTo(tx+ux*L*.4,ty+uy*L*.4);x.lineTo(q.x,q.y);x.stroke();x.globalAlpha=.9;x.drawImage(glow(c),q.x-13,q.y-13,26,26);x.globalCompositeOperation='source-over';x.globalAlpha=1;x.strokeStyle='#fff';x.lineWidth=1.6;x.beginPath();x.moveTo(q.x-ux*L*.35,q.y-uy*L*.35);x.lineTo(q.x,q.y);x.stroke()}
    else if(q.em||q.dr||q.fm){const gm=({bala:.3,flecha:.22,swWave:.3,axBoom:.4,dgFan:.4,stFire:.5,flBall:.5,pkRock:.35,btRico:.3,ktStar:.4,gtWave:.35,bkPaper:.3,crDecree:.45})[q.dr]||1,c=EMC[q.dr||q.em]||q.c||(q.z?'#8cf':'#ffd54a'),R=(q.sz+8)*1.2,tr=q.tr||(q.tr=[]),lt=tr[tr.length-1];if(!lt||Math.hypot(lt.x-q.x,lt.y-q.y)>7){tr.push({x:q.x,y:q.y});if(tr.length>9)tr.shift()}
      x.globalCompositeOperation='lighter';tr.forEach((p,n)=>{const k=(n+1)/tr.length;x.globalAlpha=.45*k*gm;const r=R*(.35+.6*k);x.drawImage(glow(c),p.x-r,p.y-r,r*2,r*2)});
      x.globalAlpha=(.85+.15*Math.sin(tm/60))*gm;x.drawImage(glow(c),q.x-R*1.25,q.y-R*1.25,R*2.5,R*2.5);x.globalCompositeOperation='source-over';x.globalAlpha=1;
      x.font=(q.sz+8)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.translate(q.x,q.y);if(q.spn)x.rotate(q.a*14);if(q.dr&&DRW[q.dr])DRW[q.dr](x,q,tm);else if(q.fm&&window.BRCFM&&BRCFM[q.fm])BRCFM[q.fm](x,q.sz+8,tm,q.c);else x.fillText(q.em||'',0,0)}
    else{const c=q.z?'#8cf':'#ffd54a',pu=1+.12*Math.sin(tm/50);x.globalCompositeOperation='lighter';x.globalAlpha=.9;x.drawImage(glow(c),q.x-16*pu,q.y-16*pu,32*pu,32*pu);x.globalCompositeOperation='source-over';x.globalAlpha=1;const og=x.createRadialGradient(q.x-2,q.y-2,1,q.x,q.y,7.5);og.addColorStop(0,'#fff');og.addColorStop(.45,c);og.addColorStop(1,shd(c,-.4));x.fillStyle=og;x.beginPath();x.arc(q.x,q.y,7,0,7);x.fill();x.strokeStyle=hexA('#fff',.6);x.lineWidth=1;x.stroke()}x.restore()};
  const STK=['mk','wk','dd','fu','sil','dz','rt','ice','dg','cn','nx','inv','cdx','dig','rgn'];
  const stat=(f,dt)=>{STK.forEach(k=>{if(f[k]>0)f[k]=Math.max(0,f[k]-dt)});if(f.dot&&f.dot.length){f.dot.forEach(q=>{q.t-=dt;f.hp-=q.v*dt});f.dot=f.dot.filter(q=>q.t>0)}};
  const SI={
    '🔥':(c,r)=>{c.fillStyle='#ff6a1a';c.beginPath();c.moveTo(0,-r);c.quadraticCurveTo(r*.9,-r*.2,r*.6,r*.5);c.quadraticCurveTo(0,r*1.1,-r*.6,r*.5);c.quadraticCurveTo(-r*.9,-r*.2,0,-r);c.fill();c.fillStyle='#ffd84a';c.beginPath();c.ellipse(0,r*.4,r*.32,r*.45,0,0,7);c.fill()},
    '🩸':(c,r)=>{c.fillStyle='#d41f2a';c.beginPath();c.moveTo(0,-r);c.quadraticCurveTo(r*.95,r*.2,0,r);c.quadraticCurveTo(-r*.95,r*.2,0,-r);c.fill();c.fillStyle='#ff9a9a';c.beginPath();c.arc(-r*.25,r*.2,r*.15,0,7);c.fill()},
    sil:(c,r)=>{c.strokeStyle='#d8a0ff';c.fillStyle='#d8a0ff';c.lineWidth=2;c.beginPath();c.arc(0,-r*.3,r*.4,Math.PI,0);c.lineTo(r*.55,r*.3);c.lineTo(-r*.55,r*.3);c.closePath();c.fill();c.strokeStyle='#f44';c.beginPath();c.moveTo(-r,-r);c.lineTo(r,r);c.stroke()},
    dz:(c,r)=>{c.strokeStyle='#ffe066';c.lineWidth=2;c.beginPath();for(let a=0;a<14;a+=.3){const q=a*r/14*1.1;c.lineTo(Math.cos(a)*q,Math.sin(a)*q)}c.stroke()},
    rt:(c,r)=>{c.strokeStyle='#bcc';c.lineWidth=2.4;c.beginPath();c.ellipse(-r*.35,0,r*.5,r*.35,0,0,7);c.stroke();c.beginPath();c.ellipse(r*.35,0,r*.5,r*.35,0,0,7);c.stroke()},
    mk:(c,r)=>{c.strokeStyle='#ff4a4a';c.lineWidth=2;c.beginPath();c.arc(0,0,r*.75,0,7);c.stroke();c.beginPath();c.arc(0,0,r*.3,0,7);c.stroke();c.moveTo(-r,0);c.lineTo(r,0);c.moveTo(0,-r);c.lineTo(0,r);c.stroke()},
    wk:(c,r)=>{c.strokeStyle='#ff8a5a';c.fillStyle='#ff8a5a';c.lineWidth=2.4;c.beginPath();c.moveTo(0,-r*.8);c.lineTo(0,r*.2);c.stroke();c.beginPath();c.moveTo(-r*.6,r*.1);c.lineTo(r*.6,r*.1);c.lineTo(0,r*.9);c.fill()},
    slow:(c,r)=>{c.fillStyle='#7ad0ff';c.beginPath();c.moveTo(-r*.7,-r*.7);c.lineTo(r*.7,-r*.7);c.lineTo(0,0);c.lineTo(r*.7,r*.7);c.lineTo(-r*.7,r*.7);c.lineTo(0,0);c.closePath();c.fill()},
    cn:(c,r)=>{c.fillStyle='#6aa8ff';c.beginPath();c.moveTo(0,-r);c.lineTo(r*.8,-r*.6);c.quadraticCurveTo(r*.8,r*.5,0,r);c.quadraticCurveTo(-r*.8,r*.5,-r*.8,-r*.6);c.closePath();c.fill()},
    dg:(c,r)=>{c.strokeStyle='#dff';c.lineWidth=2;for(let n=-1;n<=1;n++){c.beginPath();c.moveTo(-r,n*r*.5);c.lineTo(r*.7,n*r*.5);c.stroke()}},
    ice:(c,r)=>{c.strokeStyle='#bff';c.lineWidth=2;for(let n=0;n<3;n++){const a=n*Math.PI/3;c.beginPath();c.moveTo(Math.cos(a)*r,Math.sin(a)*r);c.lineTo(-Math.cos(a)*r,-Math.sin(a)*r);c.stroke()}},
    nx:(c,r)=>{c.strokeStyle='#cfe';c.lineWidth=2.4;c.beginPath();c.moveTo(-r*.8,r*.8);c.lineTo(r*.8,-r*.8);c.stroke();c.strokeStyle='#a66';c.beginPath();c.moveTo(-r*.5,r*.2);c.lineTo(-r*.1,r*.6);c.stroke()},
    cdx:(c,r)=>{c.fillStyle='#c9f';c.beginPath();c.ellipse(-r*.3,r*.5,r*.4,r*.3,0,0,7);c.fill();c.strokeStyle='#c9f';c.lineWidth=2;c.beginPath();c.moveTo(r*.05,r*.5);c.lineTo(r*.05,-r*.8);c.lineTo(r*.7,-r*.5);c.stroke()},
    dd:(c,r)=>{c.fillStyle='#ff4a3a';c.beginPath();c.arc(0,0,r*.85,0,7);c.fill();c.strokeStyle='#300';c.lineWidth=2;c.beginPath();c.moveTo(-r*.5,-r*.35);c.lineTo(-r*.1,-r*.1);c.moveTo(r*.5,-r*.35);c.lineTo(r*.1,-r*.1);c.stroke()},
    rgn:(c,r)=>{c.fillStyle='#4be07a';c.fillRect(-r*.2,-r*.8,r*.4,r*1.6);c.fillRect(-r*.8,-r*.2,r*1.6,r*.4)}
  };
  const stI=f=>{if(f.dead)return;const L=[];(f.dot||[]).forEach(q=>{if(!L.includes(q.k))L.push(q.k)});
    ['sil','dz','rt','mk','wk','slow','cn','dg','ice','nx','cdx','dd','rgn'].forEach(k=>{if(f[k]>0&&!(k==='rt'&&f.dig>0))L.push(k)});
    if(!L.length)return;const r=6.5,g=17,x0=f.x-(L.length-1)*g/2;
    L.forEach((k,n)=>{x.save();x.translate(x0+n*g,f.y-112);x.shadowColor='#000a';x.shadowBlur=3;(SI[k]||((c,rr)=>{c.fillStyle='#fff';c.beginPath();c.arc(0,0,rr*.5,0,7);c.fill()}))(x,r);x.restore()})};
  const PW={
    swSpin:(f,t,d,e,s)=>{ring(f.x,f.y-40,e,'#cfe');let n=0;for(let j=PR.length-1;j>=0;j--)if(PR[j].o!==f&&Math.abs(PR[j].x-f.x)<e*1.5&&Math.abs(PR[j].y-f.y)<120){PR.splice(j,1);n++}if(n)txt(f,'PARRY!','#9ff');if(nr(f,t,e))hit(f,t,d,s,300)},
    swWave:(f,t,d,e)=>shot2(f,{d,sp:e,pi:1,hw:40,hv:75,sz:36,kb:180,t:1.2,dr:'swWave'}),
    swLunge:(f,t,d,e,s)=>dashAt(f,d,s,850,{iv:.35,fn:(a,b)=>dotE(a,b,'🩸',3,3)}),
    axExec:(f,t,d,e,s)=>{ring(f.x+f.face*40,f.y-40,e,'#fa6');if(nr(f,t,e)){const ex=t.hp<t.mx*.4;if(ex)txt(t,'EXECUÇÃO!','#f55');hit(f,t,ex?d*1.6:d,s,320)}},
    axBoom:(f,t,d,e)=>shot2(f,{d,sp:e,rt:.7,hw:34,hv:60,sz:30,kb:200,t:2,dr:'axBoom',spn:1}),
    axRage:(f,t,d,e)=>{f.bf=e;f.bfv=d/100;f.dd=e;f.fu=e;ring(f.x,f.y-40,70,'#f44');txt(f,'FÚRIA!','#f66')},
    hmSlam:(f,t,d,e,s)=>{const px=f.x+f.face*70,py=f.y;strike(px,py,e,.45,()=>{ring(px,py-20,e,'#fc6');shk=Math.min(9,shk+4);if(Math.abs(t.x-px)<e+24&&Math.abs(t.y-py)<80)hit(f,t,d,s,350,sdir({x:px},t))},'#ffb347')},
    hmQuake:(f,t,d,e,s)=>{let done=0;for(let n=1;n<=4;n++){const px=f.x+f.face*(60+n*75),py=f.y;strike(px,py,36,.1+.14*n,()=>{ring(px,py-20,40,'#a86');shk=Math.min(9,shk+1.5);if(!done&&Math.abs(t.x-px)<46&&t.gr&&Math.abs(t.y-py)<60){done=1;hit(f,t,d,s,260,sdir(f,t))}},'#a86')}},
    hmLeap:(f,t,d,e,s)=>{f.vy=-640;f.vx=f.face*300;f.gr=false;f.dash=.55;f.dm=null;hk((dt,h)=>{h.t+=dt;if(h.t>.2&&f.gr||h.t>1.2){f.dash=0;ring(f.x,f.y-10,110,'#fc6');shk=Math.min(9,shk+5);if(nr(f,t,110)&&t.gr)hit(f,t,d,s,380);return 1}})},
    dgBack:(f,t,d,e,s)=>{const sx=sdir(f,t),h=d/2;ring(f.x,f.y-40,50,'#a7f');f.x=clampX(t.x+sx*55);f.y=t.y;f.vy=0;f.face=-sx;ring(f.x,f.y-40,50,'#a7f');hit(f,t,h,0,90,-sx);after(.18,()=>{if(nr(f,t,70))hit(f,t,h,s,180,-sx)})},
    dgFan:(f,t,d)=>{for(let j=-2;j<=2;j++)shot2(f,{d,sp:620,vy:j*48,t:1.1,sz:14,dr:'dgFan',kb:90,oh:(a,b)=>dotE(a,b,'🩸',2,3)})},
    dgShade:(f,t,d,e)=>{f.inv=e;f.nx=e;f.bf=e;f.bfv=d/100;ring(f.x,f.y-40,50,'#889');txt(f,'SOMBRA','#aab')},
    bwSnipe:(f,t,d,e)=>shot2(f,{d,sp:e,ds:520,sz:12,ln:28,c:'#ffe9a0',kb:220}),
    bwRain:(f,t,d)=>{const ty=t.y;for(let n=0;n<7;n++){const px=t.x+(n-3)*38;strike(px,ty,26,.55+n*.09,()=>{ring(px,ty-40,30,'#ffd');if(Math.abs(t.x-px)<34&&Math.abs(t.y-ty)<80)hit(f,t,d,0,120)},'#ffd54a')}},
    bwFrost:(f,t,d,e,s)=>shot2(f,{d,sp:e,sz:12,ln:26,c:'#9df',sl:s,oh:(a,b)=>{if(b.slow>0){b.stun=Math.max(b.stun,1);txt(b,'CONGELADO!','#9df')}}}),
    stFire:(f,t,d,e)=>shot2(f,{d,sp:e,ex:70,sz:22,dr:'stFire',c:'#ff7a2a',kb:280,oh:(a,b)=>dotE(a,b,'🔥',3,3)}),
    stHeal:(f,t,d)=>{f.hp=Math.min(f.mx,f.hp+d);f.slow=0;f.stun=0;f.dot=[];f.sil=f.dz=f.rt=f.wk=f.mk=0;f.rgn=4;ring(f.x,f.y-40,60,'#6f6');hk((dt,h)=>{h.t+=dt;f.hp=Math.min(f.mx,f.hp+1.5*HS*dt);return h.t>=4})},
    stBolt:(f,t,d,e,s)=>{const px=t.x,ty=t.y;strike(px,ty,40,.5,()=>{bolt(px,ty);ring(px,ty-20,50,'#9cf');shk=Math.min(9,shk+3);if(Math.abs(t.x-px)<50)hit(f,t,d,s,0,sdir(f,t))},'#7ad0ff')},
    shWall:(f,t,d,e)=>{const wx=f.x+f.face*80,wy=f.y;f.sh=d;f.shT=e;hk((dt,h)=>{h.t+=dt;for(let j=PR.length-1;j>=0;j--){const q=PR[j];if(q.o!==f&&Math.abs(q.x-wx)<16&&q.y>wy-100&&q.y<wy+4){ring(q.x,q.y,22,'#9cf');PR.splice(j,1)}}if(Math.abs(t.x-wx)<24&&t.y>wy-90)t.x=wx+(t.x>=wx?24:-24);return h.t>=e},()=>{x.fillStyle='#7a8fb0';x.fillRect(wx-9,wy-90,18,90);x.strokeStyle='#cfe';x.lineWidth=3;x.strokeRect(wx-9,wy-90,18,90)})},
    shBash:(f,t,d,e,s)=>{ring(f.x+f.face*30,f.y-40,e,'#9cf');if(nr(f,t,e))hit(f,t,d,s,720,f.face,{gb:1})},
    shCounter:(f,t,d,e)=>{f.cn=e;ring(f.x,f.y-40,60,'#ffd54a');txt(f,'CONTRA-ATAQUE','#ffd54a')},
    trHook:(f,t,d,e,s)=>shot2(f,{d,sp:e,sz:13,ln:30,c:'#bde',kb:0,oh:(a,b)=>{b.stun=Math.max(b.stun,s);const sd=sdir(b,a);hk((dt,h)=>{h.t+=dt;if(Math.abs(b.x-a.x)>62)b.x+=sd*900*dt;return h.t>.4||Math.abs(b.x-a.x)<=62})}}),
    trTide:(f,t,d,e,s)=>shot2(f,{d,sp:e,hw:52,hv:110,pi:1,kb:520,sl:s,sz:50,dr:'trTide',y:f.y-34,t:1.5}),
    trJav:(f,t,d,e)=>shot2(f,{d,sp:e,vy:-380,g:760,sz:10,ln:34,c:'#cde',t:2.5,kb:240}),
    pkDig:(f,t,d,e,s)=>{f.dig=f.rt=f.inv=.75;ring(f.x,f.y-10,50,'#a86');hk((dt,h)=>{h.t+=dt;f.vx=0;if(h.t>=.75){const sx=sdir(f,t);f.x=clampX(t.x-sx*10);f.y=t.y;f.vy=0;ring(f.x,f.y-10,70,'#a86');shk=Math.min(9,shk+4);if(Math.abs(t.x-f.x)<60&&Math.abs(t.y-f.y)<80){hit(f,t,d,s,300,sx);t.vy=-520;t.gr=false}return 1}})},
    pkRock:(f,t,d,e)=>shot2(f,{d,sp:e,vy:-140,g:760,bn:2,hw:30,sz:34,dr:'pkRock',spn:1,t:2.6,kb:320}),
    pkQuake:(f,t,d,e,s)=>{const cx=f.x,cy=f.y;[.35,.8,1.25].forEach((dl,n)=>strike(cx,cy,e,dl,()=>{ring(cx,cy-10,e,'#a86');shk=Math.min(9,shk+4);if(Math.abs(t.x-cx)<e+24&&t.gr&&Math.abs(t.y-cy)<70)hit(f,t,d/3,n===2?s:0,260,sdir(f,t))},'#a86'))},
    btHome:(f,t,d,e,s)=>{ring(f.x+f.face*40,f.y-45,e,'#fd6');let n=0;PR.forEach(q=>{if(q.o!==f&&Math.abs(q.x-f.x)<e*1.6&&Math.abs(q.y-(f.y-45))<110){q.o=f;q.vx=-q.vx;q.dir=-q.dir;q.d*=1.5;q.hh=0;n++}});if(n)txt(f,'DEVOLVEU!','#fd6');if(nr(f,t,e)){hit(f,t,d,s,650,sdir(f,t));t.vy=-520;t.gr=false}},
    btRico:(f,t,d,e)=>shot2(f,{d,sp:e,wb:1,t:3,sz:10,dr:'btRico',spn:1,kb:260}),
    btRoll:(f,t,d,e,s)=>dashAt(f,d,s,540,{dur:.5,iv:.55,fn:(a,b)=>{b.slow=Math.max(b.slow,1)}}),
    gnPierce:(f,t,d,e)=>shot2(f,{d,sp:e,ap:1,sz:5,ln:22,c:'#ffe27a',kb:120}),
    gnBurst:(f,t,d)=>{for(let n=0;n<6;n++)after(n*.1,()=>{if(f.stun>0)return;shot2(f,{d,sp:640,vy:(Math.random()-.5)*50,sz:5,ln:14,c:'#ffe27a',kb:60})})},
    gnReload:(f,t,d,e,s,i)=>{f.cd=f.cd.map((v,j)=>j===i?v:0);f.bf=e;f.bfv=.2;ring(f.x,f.y-40,60,'#ffd54a');txt(f,'RECARREGADO','#ffd54a')},
    bmMine:(f,t,d,e,s)=>{const mx=f.x+f.face*50,my=f.y;hk((dt,h)=>{h.t+=dt;const bp=(h.t*4)|0;if(bp!==h.bp){h.bp=bp;if(h.t>.6&&bp%2)SFX.p('bip')}if(h.t>9)return 1;if(h.t>.6&&Math.abs(t.x-mx)<48&&Math.abs(t.y-my)<70){ring(mx,my-10,e,'#ff9a3a');ring(mx,my-10,e*.6,'#ffd84a');shk=Math.min(9,shk+4);if(Math.abs(t.x-mx)<e+24&&Math.abs(t.y-my)<90)hit(f,t,d,s,420,sdir({x:mx},t));return 1}},h=>DRW.bmMine(x,h,mx,my))},
    bmGren:(f,t,d,e)=>shot2(f,{d,sp:300,vy:-300,g:900,bn:3,fz:1.4,ex:e,sz:12,dr:'bmGren',t:3,kb:420}),
    bmJump:(f,t,d,e,s)=>{const bx=()=>{ring(f.x,f.y-10,e,'#ff9a3a');ring(f.x,f.y-10,e*.55,'#ffd84a');shk=Math.min(9,shk+4)};bx();if(nr(f,t,e))hit(f,t,d,s,420,sdir(f,t));f.vy=-840;f.gr=false;f.dash=0;hk((dt,h)=>{h.t+=dt;if(h.t>.3&&f.gr||h.t>1.5){bx();if(nr(f,t,e*.8))hit(f,t,d*.6,0,300,sdir(f,t));return 1}})},
    flJet:(f,t,d,e)=>{const A=()=>{const a=f.mn?(f.am||0):(f.ca||0);return[Math.cos(a),Math.sin(a)]};hk((dt,h)=>{h.t+=dt;if(f.stun>0)return 1;h.k=(h.k||0)+dt;if(h.k>=.15){h.k=0;const[c,n]=A();if(seg(f.x+f.face*20*c,f.y-48-20*n,f.x+f.face*e*c,f.y-48-e*n,t.x,t.y-45,38)){hit(f,t,d*.6,0,0,f.face);dotE(f,t,'🔥',3,3)}}return h.t>=1.2},()=>{const[c,n]=A(),fx=f.x+f.face*20*c,fy=f.y-48-20*n;x.save();x.globalCompositeOperation='lighter';for(let k=0;k<14;k++){const u=(k/14+performance.now()/260)%1;x.globalAlpha=1-u;x.fillStyle=u<.4?'#ffd84a':'#ff5a1a';x.beginPath();x.arc(fx+f.face*u*e*c,fy-u*e*n+Math.sin(k*5+u*9)*u*10,3+u*13,0,7);x.fill()}x.restore()})},
    flBall:(f,t,d,e)=>shot2(f,{d,sp:e,vy:-160,g:800,bn:3,sz:20,dr:'flBall',t:2.4,kb:240,bf:q=>fire(f,t,q.x,GY,36,3),oh:(a,b)=>dotE(a,b,'🔥',3,2)}),
    flAura:(f,t,d,e)=>hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;if(h.k>=.4){h.k=0;if(nr(f,t,e)){hit(f,t,d*.2,0,90,sdir(f,t));dotE(f,t,'🔥',3,2)}}return h.t>=3},h=>{x.save();x.globalCompositeOperation='lighter';x.globalAlpha=.6;for(let n=0;n<20;n++){const a=n*.314+h.t*3,rr=e*(.5+.5*((n*.37+h.t*2)%1));x.fillStyle=n%2?'#ff6a1a':'#ffd84a';x.beginPath();x.arc(f.x+Math.cos(a)*rr,f.y-30+Math.sin(a)*rr*.35,6,0,7);x.fill()}x.restore()}),
    icSpike:(f,t,d,e,s)=>shot2(f,{d,sp:e,sz:10,ln:30,c:'#aef',kb:60,oh:(a,b)=>{b.stun=Math.max(b.stun,s);txt(b,'CONGELADO!','#9df')}}),
    icBliz:(f,t,d,e,s)=>{const cx=f.x+f.face*130,cy=f.y;hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;if(h.k>=.4){h.k=0;if(Math.abs(t.x-cx)<e+20&&Math.abs(t.y-cy)<120){hit(f,t,d*.13,0,0,sdir({x:cx},t));t.slow=Math.max(t.slow,s)}}return h.t>=3.5},h=>{x.save();x.fillStyle='#cfefff';x.globalAlpha=.18;x.beginPath();x.ellipse(cx,cy-4,e,e*.3,0,0,7);x.fill();x.globalAlpha=.85;for(let n=0;n<26;n++){x.fillRect(cx+((n*53)%(2*e))-e,cy-((n*37+h.t*160)%110),3,3)}x.restore()})},
    icArmor:(f,t,d,e)=>{f.sh=d;f.shT=e;f.ice=e;ring(f.x,f.y-40,60,'#9df');txt(f,'ARMADURA','#9df')},
    lgSpark:(f,t,d,e,s)=>{const th=f.ca||0,c=Math.cos(th),n=Math.sin(th),x1=f.x+f.face*20*c,y1=f.y-48-20*n,x2=f.x+f.face*e*c,y2=f.y-48-e*n;zap(x1,y1,x2,y2,.12);if(seg(x1,y1,x2,y2,t.x,t.y-45,40))hit(f,t,d,s,100,f.face)},
    lgThunder:(f,t,d)=>{const ty=t.y;for(let n=0;n<3;n++){const px=Math.max(30,Math.min(WW-30,t.x+(n-1)*95));strike(px,ty,34,.45+n*.28,()=>{bolt(px,ty);ring(px,ty-20,44,'#9cf');shk=Math.min(9,shk+2);if(Math.abs(t.x-px)<44)hit(f,t,d,.3,0,sdir(f,t))},'#9cf')}},
    lgBlink:(f,t,d,e)=>{const a=f.x,b=clampX(a+f.face*e);zap(a,f.y-45,b,f.y-45,.25);if((t.x-a)*f.face>-20&&(t.x-b)*f.face<20&&Math.abs(t.y-f.y)<80)hit(f,t,d,.3,200,f.face);f.x=b;f.iv=.3;ring(a,f.y-40,40,'#9cf');ring(b,f.y-40,40,'#9cf')},
    ktIai:(f,t,d,e,s)=>{f.rt=.5;ring(f.x,f.y-40,40,'#fff');txt(f,'FOCO...','#fff');hk((dt,h)=>{h.t+=dt;if(f.stun>0)return 1;if(h.t>=.5){dashAt(f,d*1.6,s,1500,{dur:.18});zap(f.x,f.y-45,f.x+f.face*270,f.y-45,.2);return 1}})},
    ktStar:(f,t,d)=>{for(let j=-1;j<=1;j++)shot2(f,{d,sp:560,sw:[46,7,j*2.1],sz:10,dr:'ktStar',spn:1,t:1.3,kb:100})},
    ktDodge:(f,t,d,e)=>{f.dg=e;f.bf=1;f.bfv=d/100;ring(f.x,f.y-40,50,'#9fb');txt(f,'ESQUIVA','#9fb')},
    gtChord:(f,t,d,e)=>{ring(f.x,f.y-40,e,'#f7f');if(nr(f,t,e)){hit(f,t,d,0,150,sdir(f,t));t.sil=2;txt(t,'SILENCIADO','#f9f')}},
    gtWave:(f,t,d,e)=>shot2(f,{d,sp:e,hw:40,hv:85,pi:1,sz:30,dr:'gtWave',kb:120,oh:(a,b)=>{b.dz=2.5;txt(b,'TONTO','#f9f')}}),
    gtSolo:(f,t,d,e)=>{f.cdx=e;f.bf=e;f.bfv=d/100;ring(f.x,f.y-40,60,'#f9f');txt(f,'SOLO!','#f9f')},
    bkWise:(f,t,d,e,s,i)=>{f.hp=Math.min(f.mx,f.hp+d);f.cd=f.cd.map((v,j)=>j===i?v:v*.5);ring(f.x,f.y-40,60,'#8f8')},
    bkQuiz:(f,t,d,e,s)=>{ring(f.x,f.y-40,e,'#ccf');if(nr(f,t,e)){hit(f,t,d,s,60,sdir(f,t));t.mk=4;txt(t,'MARCADO','#fd6')}},
    bkPaper:(f,t,d,e)=>shot2(f,{d,sp:e,sz:12,dr:'bkPaper',kb:80,oh:(a,b)=>{b.wk=4;txt(b,'FRACO','#bbb')}}),
    bxStraight:(f,t,d,e,s)=>dashAt(f,d,s,900,{dur:.14,gb:1}),
    bxCombo:(f,t,d,e)=>{[0,.2,.4].forEach((dl,n)=>after(dl,()=>{if(f.stun>0)return;f.dash=.12;f.vx=f.face*160;ring(f.x+f.face*40,f.y-45,50,'#fc6');if(nr(f,t,e)){hit(f,t,d*[.3,.3,.4][n],0,n<2?60:450,f.face);if(n===2){t.vy=-420;t.gr=false}}}))},
    bxKO:(f,t,d,e,s)=>{f.rt=.5;ring(f.x,f.y-40,50,'#f55');hk((dt,h)=>{h.t+=dt;if(f.stun>0)return 1;if(h.t>=.5){ring(f.x+f.face*40,f.y-45,e,'#f55');if(nr(f,t,e)){const g=t.stun>0||t.slow>0||t.rt>0||t.dz>0;hit(f,t,g?d*2.2:d*.9,s,g?600:300,sdir(f,t));if(g)txt(t,'NOCAUTE!','#f55')}return 1}})},
    crDecree:(f,t,d,e)=>shot2(f,{d,sp:e,sz:12,dr:'crDecree',kb:60,oh:(a,b)=>{b.rt=2.5;txt(b,'PRESO','#fd6')}}),
    crGuard:(f,t,d,e)=>{const gx=f.x-f.face*45,gy=f.y;hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;h.e=e;h.sx=t.x>=gx?1:-1;h.rc=Math.max(0,(h.rc||0)-dt);if(h.k>=.9){h.k=0;const sx=h.sx;h.rc=.22;SFX.p('swing_gun');PR.push({o:f,x:gx+sx*20,y:gy-44,x0:gx,by:gy-44,vx:sx*600,vy:0,d,st:0,sl:0,t:1.3,dir:sx,a:0,sz:5,ln:16,c:'#ffd54a',kb:100})}return h.t>=e},h=>DRW.crGuard(x,h,gx,gy))},
    crDrain:(f,t,d,e)=>{if(Math.abs(t.x-f.x)<e&&Math.abs(t.y-f.y)<110){hit(f,t,d,0,60,sdir(f,t));f.hp=Math.min(f.mx,f.hp+d);zap(t.x,t.y-45,f.x,f.y-45,.3,'#6f6')}}
  };
  const cast=(f,t,i)=>{if(paused||cut||over2)return;const p=f.W.p[i];if(!p||f.cd[i]>0||f.stun>0||f.blk||f.sil>0||f.dig>0)return;f.cd[i]=p[3]*(1-f.s.cdr)*(OPT.cCd||1)*(window.BRCT?.15:1);f.ca=aimA(f,t);f.cat=.45;SFX.pw(p[1],(window.BRC&&BRC.S[p[6]])||p[6],i,f.awT>0);const k=p[1],d=('PZMAD'.includes(k)&&f.awT>0)?p[2]*(1+f.awP):p[2],h=PW[p[6]]||(window.BRC&&BRC.H[p[6]]);if(h)h(f,t,d,p[4],p[5],i)};
  /* ---------- ataque basico por arma (WB) ----------
     c = cooldown (s) | m = multiplicador de dano | r = alcance max. da IA | k = distancia preferida da IA | fn = disparo.
     Arma fora da tabela continua com o golpe corpo a corpo (0,45 s, 85 px). */
  const mel=(f,d,rg,st,kb,o,dl)=>after(dl||.07,()=>{if(f.stun>0||over2)return;const t=foe(f),dx=(t.x-f.x)*f.face;if(dx>-12&&dx<rg+20&&Math.abs(t.y-f.y)<80){f._o=o||null;hitF(f,t,d,'m',st,kb,f.face);f._o=null}});
  const WB={
    10:{c:.55,m:0.48,r:640,k:300,fn:(f,d)=>{SFX.p('fx_bala');shot2(f,{d,sp:900,sz:5,dr:'bala',c:'#ffd54a',kb:120,t:1.1})}},
    4:{c:.8,m:0.48,r:700,k:340,fn:(f,d)=>{SFX.p('fx_flecha');shot2(f,{d,sp:820,sz:6,dr:'flecha',c:'#d8c8a0',kb:200,t:1.3})}},
    5:{c:.7,m:1.4,r:620,k:300,fn:(f,d)=>shot2(f,{d,sp:640,sz:18,em:'\u{1F52E}',c:'#c9f',kb:200,t:1.6})},
    12:{c:.6,m:1.49,r:560,k:260,fn:(f,d)=>shot2(f,{d,sp:560,ex:60,sz:20,dr:'stFire',c:'#ff7a2a',kb:200,t:1.5,sx:'fx_queima',oh:(a,b)=>dotE(a,b,'\u{1F525}',3,3)})},
    13:{c:.65,m:1.51,r:600,k:290,fn:(f,d)=>shot2(f,{d,sp:700,sz:6,ln:18,c:'#8ef',kb:120,sl:1.5,sx:'fx_gelo',t:1.3})},
    14:{c:.5,m:0.73,r:680,k:320,fn:(f,d)=>shot2(f,{d,sp:1300,sz:5,ln:26,c:'#fff27a',kb:60,t:.9})}
    ,3:{c:.25,m:2.53,r:72,fn:(f,d)=>mel(f,d,72,0,120)}
    ,18:{c:.3,m:2.08,r:70,fn:(f,d)=>{mel(f,d*.5,70,0,100);after(.12,()=>mel(f,d*.5,70,0,160,0,.01))}}
    ,0:{c:.35,m:1.94,r:90,fn:(f,d)=>mel(f,d,90,0,220)}
    ,15:{c:.4,m:1.12,r:135,fn:(f,d)=>{SFX.p('fx_katana');ring(f.x+f.face*70,f.y-45,60,'#bfd4ff');mel(f,d,135,0,200)}}
    ,8:{c:.6,m:1.63,r:95,fn:(f,d)=>mel(f,d,95,0,200,{ap:1})}
    ,7:{c:.6,m:0.91,r:150,fn:(f,d)=>{f.vx=f.face*140;SFX.p('fx_tridente');mel(f,d,150,0,240)}}
    ,9:{c:.7,m:2.05,r:95,fn:(f,d)=>mel(f,d,95,0,560)}
    ,1:{c:.75,m:1.75,r:100,fn:(f,d)=>mel(f,d,100,0,320)}
    ,6:{c:.5,m:1.44,r:75,fn:(f,d)=>mel(f,d,75,.1,420)}
    ,11:{c:.8,m:1.74,r:420,k:260,fn:(f,d)=>shot2(f,{d,sp:380,vy:-240,g:900,bn:1,fz:1.1,ex:60,sz:11,dr:'bmGren',sx:'fx_bomba',t:2,kb:300})}
    ,16:{c:.6,m:0.47,r:320,k:200,fn:(f,d)=>shot2(f,{d,sp:520,hw:34,hv:70,sz:24,dr:'gtWave',kb:140,t:.65,sx:'fx_tontura',oh:(a,b)=>{b.dz=Math.max(b.dz||0,.8)}})}
    ,17:{c:.5,m:0.95,r:460,k:260,fn:(f,d)=>shot2(f,{d,sp:620,sz:12,dr:'bkPaper',kb:80,t:1.1})}
    ,19:{c:.6,m:1.09,r:520,k:280,fn:(f,d)=>shot2(f,{d,sp:560,sz:12,dr:'crDecree',kb:100,t:1.3})}
    ,2:{c:.9,m:1.14,r:300,fn:(f,d)=>{SFX.p('fx_martelo');ring(f.x+f.face*40,f.y-8,50,'#cfd8e6');shot2(f,{d,sp:430,sz:16,dr:'swWave',c:'#cfd8e6',kb:200,st:.6,hv:70,t:.7,by:f.y-14,y:f.y-14})}}
  };
  window.BRC&&BRC.ctx({hk,after,strike,ring,hit,dotE,dashAt,nr,txt,sdir,shot2,PR,GY,clampX,cx:()=>x,shake:n=>{shk=Math.min(9,shk+n)},fix:null});
  /* ---------- despertar ---------- */
  const trueHit=(a,t,d,kb,stn)=>{t.hp-=d;t.hurt=.2;t.hit=.25;if(kb){t.vx=(t.x>=a.x?1:-1)*kb;t.vy=-260;t.gr=false}if(stn)t.stun=Math.max(t.stun,stn);flop(t,t.x>=a.x?1:-1,kb||150)};
  const tickAw=(f,dt)=>{if(!f.aw)return;if(f.ab&&!(f.awT>0))BRC.awb(f,0);if(f.awT>0){f.awT=Math.max(0,f.awT-dt);if(f.awT<=0){f.awC=window.BRCT?4:AWC;f.ab&&BRC.awb(f,0)}}else if(f.awC>0)f.awC=Math.max(0,f.awC-dt)};
  const awaken=f=>{if(paused||over2||cut||!f.aw||f.awT>0||f.awC>0)return;SFX.awaken(AWD[f.aw].sn||f.aw);f.awT=AWDUR;f.ulU=0;f.awP=AWD[f.aw].p;AWD[f.aw].at&&BRC.awb(f,1);const c=AWD[f.aw].c;FX.push({x:f.x,y:f.y-45,r:150,t:.5,c:c[1]},{x:f.x,y:f.y-45,r:90,t:.4,c:c[0]})};
  const ult=(f,tg)=>{if(paused||over2||cut||!f.aw)return;const u=UL.find(q=>q.k==='b'&&q.o===f&&q.st==='h');if(u){u.cu?relC(u,UL.indexOf(u)):throwB(u);return}if(!(f.awT>0)||f.ulU)return;f.ulU=1;SFX.ult(1);cut={t:0,f,tg,k:f.aw}};
  const relC=(u,i)=>{if(i>=0)UL.splice(i,1);SFX.ult(2);u.o.ca=aimA(u.o,u.tg);BRC.AWU[u.cu](u.o,u.tg)};
  const launch=c=>{if(window.BRC&&BRC.AWU[c.k]&&AWD[c.k]&&AWD[c.k].hold){SFX.ult(3);UL.push({k:'b',cu:c.k,ht:AWD[c.k].ht||HOLDT,o:c.f,tg:c.tg,st:'h',x:c.f.x+c.f.face*40,y:c.f.y-70,vx:0,a:0});return}if(window.BRC&&BRC.AWU[c.k]){SFX.ult(2);c.f.ca=aimA(c.f,c.tg);BRC.AWU[c.k](c.f,c.tg);return}SFX.ult(c.k==='flavio'?3:2);const f=c.f,tg=c.tg;if(c.k==='flavio')UL.push({k:'b',o:f,tg,st:'h',x:f.x+f.face*40,y:f.y-70,vx:0,a:0});else UL.push({k:'s',o:f,tg,n:STN,tm:0,bl:[]})};
  const cpuAw=dt=>{if(!E.aw||cut||over2||TRN)return;if(E.awT<=0){if(E.awC<=0&&Math.random()<dt*.5)awaken(E)}else if(!E.ulU&&E.awT<AWDUR-1&&Math.random()<dt*1.2)ult(E,P)};
  /* CPU tenta desviar dos poderes finais (chance conforme a dificuldade): pula a esfera / sai de baixo do aviso do raio */
  const cpuDodge=dt=>{let ax=0;if(TRN)return 0;UL.forEach(u=>{if(u.o===E)return;
    if(u.k==='s')u.bl.forEach(b=>{if(b.w>0&&b.w<.5&&b.c&&Math.abs(b.x-E.x)<SR+40&&E.y<=b.g+4)ax=E.x>=b.x?1:-1});
    else if(u.st==='f'){const d=(E.x-u.x)*Math.sign(u.vx);if(d>50&&d<280&&E.gr&&Math.random()<dt*LV.a*2){E.vy=-720*(1+E.s.jmp);E.gr=false}}});return ax};
  const throwB=u=>{u.st='f';SFX.ult(4);{const th=aimA(u.o,u.tg);u.vx=u.o.face*SBS*Math.cos(th);u.vy=-SBS*Math.sin(th)}u.a=0;u.x=u.o.x+u.o.face*50;u.y=u.o.y-62;FX.push({x:u.x,y:u.y,r:70,t:.3,c:'#3dff6a'})};
  const boom=(x0,y0)=>SFX.p('boom')||FX.push({x:x0,y:y0,r:180,t:.5,c:'#3dff6a'},{x:x0,y:y0,r:120,t:.45,c:'#ffd84a'},{x:x0,y:y0,r:60,t:.4,c:'#3a7bff'});
  const dodge=t=>SFX.p('dodge')||TX.push({x:t.x,y:t.y-92,t:.9,s:'ESQUIVOU!',c:'#7dffb0'});
  const updUL=dt=>{for(let i=UL.length-1;i>=0;i--){const u=UL[i],tg=u.tg,o=u.o;u.a=(u.a||0)+dt;
    if(u.k==='b'){
      if(u.st==='h'){u.x=o.x+o.face*40;u.y=o.y-70;if(u.a>=(u.ht||HOLDT)||(!pvp&&o===E&&u.a>.7&&Math.random()<dt*2.2))(u.cu?relC(u,i):throwB(u));continue}
      u.x+=u.vx*dt;u.y+=(u.vy||0)*dt;
      if(Math.abs(tg.x-u.x)<SBR+14&&Math.abs(tg.y-45-u.y)<SBR+34){
        if(tg.iv>0){if(!u.dg){u.dg=1;dodge(tg)}}
        else{trueHit({x:u.x-Math.sign(u.vx)*20},tg,AWD.flavio.u,420,.5);boom(tg.x,tg.y-45);UL.splice(i,1);continue}}
      if(u.x<-60||u.x>WW+60||u.a>6||u.y>GY-6||u.y<-300){boom(Math.max(20,Math.min(WW-20,u.x)),u.y);UL.splice(i,1)}}
    else{u.tm-=dt;
      while(u.tm<=0&&u.n>0){u.n--;u.tm+=STI;const bx=30+Math.random()*(WW-60);u.bl.push({x:bx,g:gyAt(bx,-1e4,GY),w:STW,t:0,s:Math.random(),c:Math.random()<LV.a})}
      u.bl.forEach(b=>{if(b.w>0){b.w-=dt;if(b.w<=0){b.t=.22;SFX.ult(5);FX.push({x:b.x,y:b.g-4,r:SR+10,t:.3,c:'#ff3a2a'});shk=Math.min(9,shk+2.5);
          if(Math.abs(tg.x-b.x)<SR+14&&tg.y<=b.g+4){if(tg.iv>0)dodge(tg);else trueHit(o,tg,AWD.lula.u,0,.15)}}}else b.t-=dt});
      u.bl=u.bl.filter(b=>b.w>0||b.t>0);if(!u.n&&!u.bl.length)UL.splice(i,1)}}};
  const aimInd=f=>{if(OPT.ind==='n'||f.dead||over2||paused||cut)return;if(!(f===P||(pvp&&f===E)))return;const man=!!f.mn,gh=f.cat>0;if(!man&&!gh)return;
    const th=man?manA(f):(f.ca||0),c=Math.cos(th),sn=Math.sin(th),oy=f.y-48,t=foe(f),lock=seg(f.x,oy,f.x+f.face*210*c,oy-210*sn,t.x,t.y-45,44),col=lock?'#ff6a5a':'#ffffff',k=1/Math.max(.8,Math.min(1.2,cam.z));
    x.save();x.globalAlpha=man?1:Math.min(1,f.cat*3);x.translate(f.x+f.face*30,f.y-80);x.rotate(Math.atan2(-sn,f.face*c));x.scale(k,k);
    x.lineJoin='round';x.lineCap='round';x.beginPath();x.moveTo(-8,0);x.lineTo(6,0);x.moveTo(1,-6);x.lineTo(9,0);x.lineTo(1,6);
    x.strokeStyle='rgba(0,0,0,.55)';x.lineWidth=5.5;x.stroke();x.strokeStyle=col;x.lineWidth=2.6;x.stroke();x.restore()};
  const aura=(f,t)=>{if(!(f.awT>0))return;const c=AWD[f.aw].c;x.save();x.globalCompositeOperation='lighter';x.globalAlpha=(f.awT<3&&((t/110|0)%2))?.35:1;
    const g=x.createRadialGradient(f.x,f.y-45,8,f.x,f.y-45,90);g.addColorStop(0,c[1]+'77');g.addColorStop(1,c[2]+'00');x.fillStyle=g;x.beginPath();x.arc(f.x,f.y-45,90,0,7);x.fill();
    for(let i=0;i<16;i+=(QL?2:1)){const bx=f.x+Math.sin(i*5.1)*24,by=f.y-2-(i/15)*78,h=36+Math.sin(t/85+i*1.9)*14,w=9+Math.abs(Math.sin(i*3))*5,sw=Math.sin(t/120+i)*7;
      x.fillStyle=c[1]+'99';x.beginPath();x.moveTo(bx-w,by);x.quadraticCurveTo(bx-w*.7,by-h*.55,bx+sw,by-h);x.quadraticCurveTo(bx+w*.7,by-h*.55,bx+w,by);x.fill();
      x.fillStyle=c[0]+'aa';x.beginPath();x.moveTo(bx-w*.4,by);x.quadraticCurveTo(bx-w*.3,by-h*.35,bx+sw*.6,by-h*.62);x.quadraticCurveTo(bx+w*.3,by-h*.35,bx+w*.4,by);x.fill()}
    x.restore()};
  const drawUL=t=>{UL.forEach(u=>{x.save();x.globalCompositeOperation='lighter';
    if(u.k==='b'){const hs=u.st==='h',r=(hs?SBR*Math.min(1,.25+u.a/.5):SBR)+Math.sin(t/60)*3;
      if(!hs){for(let k=1;k<=5;k++){x.globalAlpha=.3-k*.05;x.fillStyle=['#3dff6a','#ffd84a','#3a7bff'][k%3];x.beginPath();x.arc(u.x-Math.sign(u.vx)*k*16,u.y,r*(1-k*.1),0,7);x.fill()}x.globalAlpha=1}
      const g=x.createRadialGradient(u.x,u.y,r*.3,u.x,u.y,r*2.2);g.addColorStop(0,'#ffffff88');g.addColorStop(1,'#2a5bd800');x.fillStyle=g;x.beginPath();x.arc(u.x,u.y,r*2.2,0,7);x.fill();
      x.globalCompositeOperation='source-over';[[u.cu?AWD[u.cu].c[1]:'#1fcc55',r],[u.cu?AWD[u.cu].c[0]:'#ffd84a',r*.72],[u.cu?AWD[u.cu].c[2]:'#2a6bff',r*.44],['#ffffff',r*.18]].forEach(([q,rr])=>{x.fillStyle=q;x.beginPath();x.arc(u.x,u.y,rr,0,7);x.fill()});
      for(let k=0;k<3;k++){x.strokeStyle=u.cu?AWD[u.cu].c[k]:['#77ff77','#ffdd44','#66aaff'][k];x.lineWidth=3;x.beginPath();x.arc(u.x,u.y,r*(.9+k*.18),t/150+k*2.1,t/150+k*2.1+1.6);x.stroke()}
      if(hs){x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.arc(u.x,u.y,r+9,-1.57,-1.57+6.28*Math.max(0,1-u.a/(u.ht||HOLDT)));x.stroke()}}
    else{x.fillStyle='rgba(180,0,0,'+(.07+.05*Math.sin(t/40))+')';x.fillRect(-W,-2000,WW+2*W,4000);
      u.bl.forEach(b=>{
        if(b.w>0){const p=1-b.w/STW;x.fillStyle='rgba(255,40,40,'+(.12+.38*p)+')';x.beginPath();x.ellipse(b.x,b.g,SR,SR*.22,0,0,7);x.fill();
          const q=1.15-.15*p;x.strokeStyle='rgba(255,130,110,'+(.4+.5*p)+')';x.lineWidth=2;x.beginPath();x.ellipse(b.x,b.g,SR*q,SR*.22*q,0,0,7);x.stroke();
          x.strokeStyle='rgba(255,60,60,'+(.12+.25*p)+')';x.beginPath();x.moveTo(b.x,-700);x.lineTo(b.x,b.g);x.stroke()}
        else{const pts=[];for(let y=-700,i=0;y<b.g;y+=44,i++)pts.push([b.x+Math.sin(b.s*91+i*7.3)*26*(i?1:0),y]);pts.push([b.x,b.g]);x.globalAlpha=Math.min(1,b.t*8);
          [['#ff2a2a',10],['#ffffff',3.5]].forEach(([q,lw])=>{x.strokeStyle=q;x.lineWidth=lw;x.beginPath();pts.forEach((q2,i)=>i?x.lineTo(q2[0],q2[1]):x.moveTo(q2[0],q2[1]));x.stroke()})}})}
    x.restore()})};
  const rn=s=>{s=Math.sin(s*127.1+311.7)*43758.5453;return s-Math.floor(s)};
  const drawCut=t=>{const c=cut,f=c.f,k=c.k,A=AWD[k],cl=A.c,p=c.t/CUTT,e=Math.min(1,c.t/.3);x.save();
    x.fillStyle=`rgba(0,0,0,${.74*e})`;x.fillRect(-W,-H,W*3,H*3);x.globalCompositeOperation='lighter';
    if(k==='lula'){const sd=Math.floor(c.t*14);for(let b=0;b<4;b++){let px=rn(sd*4+b)*W;x.strokeStyle=cl[1];x.lineWidth=5;x.globalAlpha=.9;x.beginPath();x.moveTo(px,0);for(let y=40;y<=H;y+=40){px+=(rn(sd*13+b*7+y)-.5)*70;x.lineTo(px,y)}x.stroke()}x.globalAlpha=1;x.fillStyle='rgba(255,40,40,'+(.06+.05*Math.sin(c.t*30))+')';x.fillRect(-W,-H,W*3,H*3)}
    else{for(let i=0;i<46;i++){const ph=((i*.137+c.t*.9)%1),a0=i*2.399+c.t*2,rr=(1-ph)*330;x.fillStyle=(k==='flavio'?['#3dff6a','#ffd84a','#3a7bff']:cl)[i%3];x.globalAlpha=.25+ph*.6;x.beginPath();x.arc(565+Math.cos(a0)*rr,225+Math.sin(a0)*rr*.7,2+ph*4,0,7);x.fill()}}
    x.globalAlpha=1;const R=14+Math.min(1,p*1.25)*72,ox=565,oy=225,og=x.createRadialGradient(ox,oy,R*.2,ox,oy,R*2);og.addColorStop(0,cl[0]+'cc');og.addColorStop(.5,cl[1]+'55');og.addColorStop(1,cl[2]+'00');x.fillStyle=og;x.beginPath();x.arc(ox,oy,R*2,0,7);x.fill();
    if(k==='flavio'){x.globalCompositeOperation='source-over';[['#1fcc55',R],['#ffd84a',R*.72],['#2a6bff',R*.44],['#ffffff',R*.16]].forEach(([q,r])=>{x.fillStyle=q;x.beginPath();x.arc(ox,oy,r,0,7);x.fill()})}
    else{x.fillStyle=cl[1];x.beginPath();x.arc(ox,oy,R*.8,0,7);x.fill();x.fillStyle=cl[0];x.beginPath();x.arc(ox,oy,R*.35,0,7);x.fill();for(let b=0;b<7;b++){const a0=rn(Math.floor(c.t*12)*7+b)*6.28;x.strokeStyle='#fff';x.lineWidth=2.5;x.beginPath();x.moveTo(ox+Math.cos(a0)*R*.8,oy+Math.sin(a0)*R*.8);x.lineTo(ox+Math.cos(a0+.15)*R*1.5,oy+Math.sin(a0+.15)*R*1.5);x.stroke()}}
    x.globalCompositeOperation='source-over';const hx=190,hy=225,hr=78+Math.sin(c.t*8)*2;x.save();x.beginPath();x.arc(hx,hy,hr,0,7);x.clip();const im=getImg(f.img);if(im){const s2=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-s2)/2,(im.naturalHeight-s2)/2,s2,s2,hx-hr,hy-hr,hr*2,hr*2)}else{x.fillStyle='#8899aa';x.fillRect(hx-hr,hy-hr,hr*2,hr*2)}x.restore();
    x.globalCompositeOperation='lighter';x.strokeStyle=cl[1];x.lineWidth=8;x.globalAlpha=.85;x.beginPath();x.arc(hx,hy,hr+4,0,7);x.stroke();x.lineWidth=3;x.strokeStyle=cl[0];x.beginPath();x.arc(hx,hy,hr+12+Math.sin(c.t*10)*4,0,7);x.stroke();
    x.globalCompositeOperation='source-over';x.globalAlpha=1;const bh=Math.min(1,c.t/.25)*56;x.fillStyle='#000';x.fillRect(0,0,W,bh);x.fillRect(0,H-bh,W,bh);
    const ts=Math.min(1,Math.max(0,(c.t-.35)/.35)),nm=A.n.toUpperCase();x.textAlign='center';x.save();x.translate(W/2,H-bh/2+10);x.scale(.6+.4*ts,.6+.4*ts);x.globalAlpha=ts;x.font='900 30px sans-serif';x.lineWidth=5;x.strokeStyle=cl[2];x.strokeText(nm,0,0);x.fillStyle='#fff';x.fillText(nm,0,0);x.restore();
    x.font='bold 15px sans-serif';x.fillStyle=cl[0];x.fillText(((f.c.nome||'')+'').toUpperCase()+' · '+A.d,W/2,Math.max(16,bh-18));
    if(c.t>CUTT-.3){x.fillStyle=`rgba(255,255,255,${Math.min(1,(c.t-(CUTT-.3))/.3)})`;x.fillRect(-W,-H,W*3,H*3)}
    x.restore()};

  const ai=(f,t,dt)=>{if(TRN)return trAi(f,t,dt);if(window.BRCT)return{ax:0,inp:{blk:0,atk:0,jump:0,dash:0}};const a=f.br||(f.br={t:0,ax:0,blk:0});a.t-=dt;a.blk-=dt;
    if(a.t<=0){a.t=LV.r*(.6+Math.random()*.8);const d=t.x-f.x,ad=Math.abs(d),dir=d>0?1:-1;a.ax=0;a.at=a.jp=a.dh=0;f.face=dir;
      if(t.atk>0&&ad<120&&Math.random()<LV.b)a.blk=.45;
      else{const wb=WB[f.wi];if(wb&&wb.k){if(ad>wb.k+60)a.ax=dir;else if(ad<wb.k-90&&Math.random()<.6)a.ax=-dir}else if(ad>(wb?wb.r*.8:78))a.ax=dir;else if(ad<55&&Math.random()<.3)a.ax=-dir;
        if((wb?(ad<wb.r&&(wb.k?ad>60:1)&&Math.abs(t.y-f.y)<(wb.k?110:80)):ad<85)&&Math.random()<(wb&&wb.k?Math.min(1,LV.a*1.5):LV.a))a.at=1;
        if(t.y<f.y-80&&Math.random()<.6||ad<150&&Math.random()<.08)a.jp=1;
        if(f.hp<f.mx*.3&&ad<100&&Math.random()<.4){a.dh=1;a.ax=-dir}}
      for(let i=0;i<3;i++){const p=f.W.p[i];if(!p||f.cd[i]>0||Math.random()>LV.a)continue;const k=p[1];
        if(('PZM'.includes(k)&&ad>140&&Math.abs(t.y-f.y)<90)||(k==='A'&&ad<p[4])||(k==='D'&&ad>60&&ad<200)||(k==='H'&&f.hp<f.mx*.6)||(k==='S'&&ad<160&&(t.atk>0||f.hp<f.mx*.7))||(k==='B'&&(ad>150||Math.random()<.2))){cast(f,t,i);break}}}
    const inp={blk:a.blk>0,atk:a.at,jump:a.jp,dash:a.dh};a.at=a.jp=a.dh=0;return{ax:a.ax,inp}};
  const step=(f,dt,ax,inp,tgt)=>{if(f.stun>0){f.stun-=dt;inp=null;ax=0}stat(f,dt);if(f.rt>0){ax=0;if(inp)inp=Object.assign({},inp,{jump:0,dash:0})}if(f.dz>0)ax=-ax;f.slow-=dt;f.bf-=dt;f.shT-=dt;f.iv=Math.max(0,f.iv-dt);if(f.shT<=0)f.sh=0;f.hp=Math.min(f.mx,f.hp+f.s.reg*dt);for(let i=0;i<3;i++)f.cd[i]-=dt*(f.cdx>0?2:1);
    f.ph+=dt*(Math.abs(f.vx)>10?10:0);f.acd=Math.max(0,f.acd-dt);f.dcd=Math.max(0,f.dcd-dt);f.hit=Math.max(0,f.hit-dt);f.hurt=Math.max(0,f.hurt-dt);
    f.blk=!!(inp&&inp.blk&&f.gr);
    if(f.dash>0){f.dash-=dt}else if(!f.blk&&f.hurt<=0){f.vx=ax*SP(f);if(ax)f.face=ax}
    if(inp){
      if(inp.jump&&f.gr&&!f.blk){f.vy=-720*(1+f.s.jmp);f.gr=false;SFX.p('jump')}
      if(inp.dash&&f.dcd<=0){SFX.p('dash');f.dash=.18;f.iv=.3;f.dcd=.8*(1-f.s.dcd);f.vx=(ax||f.face)*620;f.face=ax||f.face}
      if(inp.atk&&f.acd<=0&&!f.blk){SFX.swing(f.wi);f.atk=.22;const wb=WB[f.wi];if(wb){f.acd=wb.c*(1-f.s.acd);f.did=1;f.ca=aimA(f,tgt);wb.fn(f,8*HS*f.W.a*wb.m)}else{f.acd=.45*(1-f.s.acd);f.did=0}}
    }
    if(f.atk>0){f.atk-=dt;if(!f.did&&f.atk<.14&&tgt){f.did=1;const d=(tgt.x-f.x)*f.face;if(d>0&&d<85&&Math.abs(tgt.y-f.y)<70){
      hitF(f,tgt,8*HS*f.W.a,'m',0,260)}}}
    f.vy+=G*dt;f.x+=f.vx*dt;const py=f.y;f.y+=f.vy*dt;f.gr=false;let gy=GY;if(f.vy>=0)for(const q of M.pl)if(f.x>q[0]-8&&f.x<q[0]+q[1]+8&&py<=q[2]+2&&f.y>=q[2])gy=Math.min(gy,q[2]);
    if(f.y>=gy){f.y=gy;f.vy=0;f.gr=true;if(f.hurt>0)f.vx*=.9}
    f.x=Math.max(30,Math.min(WW-30,f.x));if(f.dm&&tgt){if(f.dash>0&&!f.dmh&&Math.abs(tgt.x-f.x)<50&&Math.abs(tgt.y-f.y)<70){f.dmh=1;f._o=f.dmo;hitF(f,tgt,f.dm[0],'p',f.dm[1],200);f._o=null;if(f.dmf)f.dmf(f,tgt)}if(f.dash<=0){f.dm=null;f.dmo=f.dmf=null}}
    if(f.hurt>0)f.vx*=.96;
  };
  /* ---------- ragdoll articulado: 11 pontos (cabeça, pescoço, quadril, cotovelos, mãos, joelhos, pés) ---------- */
  const RB=[[0,1,17],[1,2,25],[1,3,14],[3,4,14],[1,5,14],[5,6,14],[2,7,17],[7,8,17],[2,9,17],[9,10,17]];
  const ik=(a,b,l1,l2,sg)=>{const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||.01,m=Math.min(d,l1+l2-.05),ux=dx/d,uy=dy/d,q=(l1*l1-l2*l2+m*m)/(2*m),h=Math.sqrt(Math.max(0,l1*l1-q*q));return[a[0]+ux*q-uy*h*sg,a[1]+uy*q+ux*h*sg]};
  const gyAt=(px,oy,ny)=>{let g=GY;for(const q of M.pl)if(px>q[0]-8&&px<q[0]+q[1]+8&&oy<=q[2]+2&&ny>=q[2])g=Math.min(g,q[2]);return g};
  /* v1.9.47: pegada propria de cada arma (0-19). R=angulo de repouso (rad; 'u': + inclina a ponta para frente; 'r': + abaixa a ponta), H=mao da frente [x,y] relativa ao pescoco (x vezes o lado),
     B=distancia da 2a mao ao longo da arma (+ ponta, - cabo), BO=2a mao fixa [x,y], S=[angulo ini, fim] do golpe, A=[x0,y0,x1,y1] caminho da mao no golpe,
     M=1 mira (arma e braco seguem f.ca), AR=alcance do braco ao mirar, BM=B ao mirar, BA=caminho da 2a mao no golpe, k=escala. Arma sem entrada (personalizadas) usa o jeito antigo. */
  const HG=[
    {R:.95,H:[14,12],S:[-.5,1.9],A:[4,-16,28,12]},
    {R:-1.05,H:[9,8],S:[-1.1,1.6],A:[2,-22,26,14]},
    {R:-1.15,H:[10,9],B:13,S:[-1.4,1.5],A:[0,-24,24,16],k:.82},
    {R:1.3,H:[17,10],S:[1.2,1.5],A:[8,10,34,6]},
    {R:.1,H:[19,4],B:-5,M:1,AR:24,BM:-21},
    {R:.1,H:[13,12],M:1,AR:22},
    {R:.05,H:[17,6],S:[.05,.3],A:[16,6,34,2],k:.86},
    {R:1.1,H:[14,10],B:14,S:[1.1,1.3],A:[6,10,34,8]},
    {R:-1.1,H:[9,8],S:[-1.2,1.5],A:[0,-22,26,16]},
    {R:-1.15,H:[10,4],B:7,S:[-1.5,1.7],A:[4,-8,30,8]},
    {R:.3,H:[18,6],B:-5,M:1,AR:25,BM:-5},
    {R:0,H:[18,-3],S:[-.5,1.3],A:[-4,-22,30,-2],k:.7},
    {R:.55,H:[16,6],M:1,AR:23},
    {R:.4,H:[15,8],M:1,AR:23},
    {R:.75,H:[15,2],M:1,AR:23},
    {R:.75,H:[15,8],B:10,S:[-.9,2],A:[4,-16,28,12]},
    {R:1.35,H:[10,20],B:15,S:[-.7,1.9],A:[0,-16,24,14],k:.8},
    {R:.12,H:[11,6],S:[.12,.5],A:[11,6,26,-2],k:.8},
    {R:0,H:[21,3],BO:[14,7],S:[0,.2],A:[18,3,37,0],BA:[14,7,35,-2],k:.7},
    {R:.15,H:[14,2],M:1,AR:22}];
  const hgOk=(f,hurt)=>f.wi>=0&&HG[f.wi]&&!f.dead&&!hurt&&!f.win;
  const wAng=(f,at)=>{const g=HG[f.wi],r=FS.ori[f.wi]==='r';if(g.M&&(at>=0||f.cat>0)){const th=f.ca||0;return r?-th:Math.PI/2-th}
    if(f.blk)return r?-.1:.1;if(at>=0&&g.S){const e=1-(1-Math.min(1,at))*(1-Math.min(1,at));return g.S[0]+(g.S[1]-g.S[0])*e}return g.R};
  const pose=(f,t)=>{const fc=f.face,X=f.x,Y=f.y,a=Math.min(1,Math.abs(f.vx)/190),sw=Math.sin(f.ph),air=!f.gr,hurt=f.hurt>0,at=f.atk>0?1-f.atk/.22:-1,bob=Math.sin(t/380)*1.2,
    hip=[X,Y-33+(f.blk?8:0)+(air?2:0)-Math.abs(sw)*a*2+bob*.5],
    lean=fc*(2+a*5+(at>=0?7*Math.sin(Math.min(1,at)*3.14):0)+(f.dash>0?10:0))-(hurt?fc*9:0),
    nk=[X+lean,hip[1]-25+(hurt?3:0)],hd=[nk[0]+lean*.3+fc*2-(hurt?fc*5:0),nk[1]-17+bob*.4];
    const lg=sg=>{if(f.dash>0)return sg>0?[X+fc*18,Y]:[X-fc*20,Y-5];
      if(air){const up=f.vy<0;return sg>0?[X+fc*9,Y-(up?15:9)]:[X-fc*7,Y-(up?9:4)]}
      if(f.blk)return[X+sg*fc*13,Y];
      const q=sg>0?sw:-sw,c=sg>0?Math.cos(f.ph):-Math.cos(f.ph);return[X+fc*(sg*8+q*17*a),Y-Math.max(0,c)*8*a]};
    const fF=lg(1),fB=lg(-1);let hF,hB;
    if(hgOk(f,hurt)&&!(f.blk&&f.wi!==6)){const g=HG[f.wi],am=g.M&&(at>=0||f.cat>0),an=wAng(f,at),or=FS.ori[f.wi]==='r',ax=or?[fc*Math.cos(an),Math.sin(an)]:[fc*Math.sin(an),-Math.cos(an)];let H;
      if(am){const th=f.ca||0,rc=g.AR||24;H=[Math.cos(th)*rc,-Math.sin(th)*rc+4]}
      else if(at>=0&&g.A){const A=g.A;let e=1-(1-Math.min(1,at))*(1-Math.min(1,at));if(g.BA)e=Math.max(0,Math.min(1,at/.45))*(at>.45?Math.max(0,1-(at-.45)/.4):1);H=[A[0]+(A[2]-A[0])*e,A[1]+(A[3]-A[1])*e-Math.sin(e*3.14)*(g.BA?0:6)]}
      else if(f.blk)H=[20,-1];
      else H=[g.H[0]-sw*a*3,g.H[1]-Math.abs(sw)*2*a+bob*.6+(air?-3:0)];
      hF=[nk[0]+fc*H[0],nk[1]+H[1]];
      const bd=am&&g.BM!=null?g.BM:g.B;
      if(g.BA&&at>=0.45){const A=g.BA,e=Math.min(1,(at-.45)/.35)*(at>.8?Math.max(0,1-(at-.8)/.2):1);hB=[nk[0]+fc*(A[0]+(A[2]-A[0])*e),nk[1]+A[1]+(A[3]-A[1])*e]}
      else if(g.BO)hB=[nk[0]+fc*g.BO[0],nk[1]+g.BO[1]];
      else if(bd)hB=[hF[0]+ax[0]*bd,hF[1]+ax[1]*bd];
      else if(at>=0)hB=[nk[0]-fc*14,nk[1]+14];
      else hB=[nk[0]+fc*(-9+sw*14*a),nk[1]+17+bob]}
    else if(f.win){hF=[nk[0]+fc*9,nk[1]-26+Math.sin(t/110)*4];hB=[nk[0]-fc*9,nk[1]-26-Math.sin(t/110)*4]}
    else if(hurt){hF=[nk[0]-fc*12,nk[1]+8];hB=[nk[0]-fc*17,nk[1]+2]}
    else if(at>=0){const e=Math.min(1,at/.6),r=-12+54*(1-(1-e)*(1-e));hF=[nk[0]+fc*r,nk[1]+8-10*Math.sin(Math.min(1,at)*3.14)];hB=[nk[0]-fc*14,nk[1]+14]}
    else if(f.blk){hF=[nk[0]+fc*19,nk[1]-7];hB=[nk[0]+fc*12,nk[1]+9]}
    else if(air){hF=[nk[0]+fc*15,nk[1]+1];hB=[nk[0]-fc*11,nk[1]+5]}
    else{hF=[nk[0]+fc*(10-sw*14*a),nk[1]+16-Math.abs(sw)*3*a+bob];hB=[nk[0]+fc*(-9+sw*14*a),nk[1]+17+bob]}
    return[hd,nk,hip,ik(nk,hF,14,14,fc),hF,ik(nk,hB,14,14,fc),hB,ik(hip,fF,17,17,-fc),fF,ik(hip,fB,17,17,-fc),fB]};
  const rig=(f,dt,t)=>{const T=pose(f,t);if(!f.rg){f.rg=T.map(q=>({x:q[0],y:q[1],vx:0,vy:0}));return}
    const P=f.rg,dead=f.dead,k=dead?0:1-Math.exp(-(f.rag>0?2.2:26)*dt),O=P.map(p=>[p.x,p.y]),dm=Math.pow(dead?.35:.04,dt);if(f.rag>0)f.rag-=dt;
    P.forEach((p,i)=>{if(i===2&&!dead){p.x=T[2][0];p.y=T[2][1];return}p.vy+=G*dt*(dead?1:.7);p.vx*=dm;p.vy*=dm;p.x+=p.vx*dt+(T[i][0]-p.x)*k;p.y+=p.vy*dt+(T[i][1]-p.y)*k});
    for(let it=0;it<5;it++){RB.forEach(([a,b,l])=>{const A=P[a],B=P[b],dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||.01,df=(d-l)/d,wa=(a===2&&!dead)?0:1,wb=(b===2&&!dead)?0:1,ws=wa+wb;if(!ws)return;A.x+=dx*df*wa/ws;A.y+=dy*df*wa/ws;B.x-=dx*df*wb/ws;B.y-=dy*df*wb/ws});
      {const A=P[0],B=P[2],dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||.01,l=d<34?34:d>42?42:d;if(l!==d){const df=(d-l)/d,wb=dead?1:0,ws=1+wb;A.x+=dx*df/ws;A.y+=dy*df/ws;B.x-=dx*df*wb/ws;B.y-=dy*df*wb/ws}}}
    if(dead||f.rag>0)P.forEach((p,i)=>{if(i===2&&!dead)return;const g=gyAt(p.x,O[i][1],p.y);if(p.y>g-1.5){p.y=g-1.5;p.x=O[i][0]+(p.x-O[i][0])*.55}});
    P.forEach((p,i)=>{p.vx=(p.x-O[i][0])/dt;p.vy=(p.y-O[i][1])/dt})};
  const body=(f,col,t)=>{const P=f.rg;if(!P||f.hid)return;
    const ln=(a,b,w,al)=>{x.globalAlpha=al;x.lineWidth=w;x.beginPath();x.moveTo(P[a].x,P[a].y);x.lineTo(P[b].x,P[b].y);x.stroke()},jn=(i,r,al)=>{x.globalAlpha=al;x.beginPath();x.arc(P[i].x,P[i].y,r,0,7);x.fill()};
    x.strokeStyle=col;x.fillStyle=col;x.lineCap='round';x.lineJoin='round';
    ln(1,5,4,.6);ln(5,6,4,.6);jn(5,2.4,.6);jn(6,3.2,.6);ln(2,9,4.5,.6);ln(9,10,4.5,.6);jn(9,2.6,.6);jn(10,3.4,.6);
    ln(1,2,6.5,1);jn(2,3.6,1);ln(2,7,4.5,1);ln(7,8,4.5,1);jn(7,2.6,1);jn(8,3.4,1);ln(1,3,4,1);ln(3,4,4,1);jn(3,2.4,1);jn(4,3.2,1);x.globalAlpha=1;
    {const hx=P[4].x,hh=P[4].y,im=f.wi>=0&&FS.img('w',f.wi);
      if(im&&im.complete&&im.naturalWidth){const r=FS.ori[f.wi]==='r',g=FS.gr[f.wi],tt=f.atk>0?1-f.atk/.22:0,hg=HG[f.wi],k=hg&&hg.k||.78,ar=f.atk>0;
        let ang=r?(f.blk?-.1:ar?-.5+tt*.9:-.3+Math.sin(f.ph)*.06):(f.blk?.1:ar?-.4+tt*2.3:.55+Math.sin(f.ph)*.08);
        if(hg&&!f.dead&&!(f.rag>0)){const ta=wAng(f,f.atk>0?tt:-1),dw=Math.min(.05,Math.max(0,(t-(f._wt||t))/1000));f._wt=t;f._wa=f._wa==null?ta:f._wa+(ta-f._wa)*(1-Math.exp(-34*dw));ang=f._wa}else f._wa=null;
        if(f.dead||f.rag>0)ang=Math.atan2(P[4].y-P[3].y,(P[4].x-P[3].x)*f.face)*.8;
        x.save();x.translate(hx,hh);x.scale(f.face,1);x.rotate(ang);x.drawImage(im,-g[0]*k,-g[1]*k,64*k,64*k);x.restore();
        if(hg&&!f.dead&&!(f.rag>0)){jn(6,3.2,.9);jn(4,3.3,1)}}}
    if((f.blk||f.sh>0)&&!f.dead){x.strokeStyle='#5bf8';x.lineWidth=3;x.beginPath();x.arc(f.x,f.y-45,44,0,7);x.stroke()}
    const hd=P[0],nk=P[1],an=Math.atan2(hd.x-nk.x,-(hd.y-nk.y));if(f.nh){if(FB){x.fillStyle='#a00';x.beginPath();x.arc(nk.x,nk.y,4.5,0,7);x.fill()}return}x.save();x.translate(hd.x,hd.y);x.rotate(an);
    x.save();x.beginPath();x.arc(0,0,16,0,7);x.clip();const im=getImg(f.img);
    if(im){const s=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-s)/2,(im.naturalHeight-s)/2,s,s,-16,-16,32,32)}else{x.fillStyle='#8899aa';x.fill()}
    x.restore();x.strokeStyle=f.hit>0?'#f55':col;x.lineWidth=3;x.beginPath();x.arc(0,0,16,0,7);x.stroke();
    const ap=window.BRC&&f.ai>=25?BRC.anc(f.ai):'';if(f.ai===0||f.ai===10||f.ai===13||ap==='cabeca'||ap==='rosto'){const h=FS.img('a',f.ai);if(h.complete&&h.naturalWidth){if(ap==='rosto')x.drawImage(h,-13,-14,26,26);else x.drawImage(h,-17,-34,34,34)}}
    x.restore();
    x.font='bold '+Math.round(13/Math.max(.7,cam.z))+'px sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='#000c';const s2='★ '+(f.vit|0);x.strokeText(s2,hd.x,hd.y-27);x.fillStyle='#ffd54a';x.fillText(s2,hd.x,hd.y-27)};
  const rr=(a,b,ww,hh,r)=>{x.beginPath();if(x.roundRect)x.roundRect(a,b,ww,hh,r);else x.rect(a,b,ww,hh)};
  const bar=(f,l,left,x)=>{const rr=(a,b,ww,hh,r)=>{x.beginPath();if(x.roundRect)x.roundRect(a,b,ww,hh,r);else x.rect(a,b,ww,hh)},w=240,c=OPT.bars==='c',xx=left?(c?W/2-8-w:16):(c?W/2+8:W-16-w),y=c?36:14,tm=performance.now(),pc=Math.max(0,f.hp)/f.mx;
    f.gh=f.gh==null?f.hp:(f.gh>f.hp?Math.max(f.hp,f.gh-(f.gh-f.hp)*.06-.12):f.hp);
    rr(xx-3,y-3,w+6,22,9);x.fillStyle='#0b0f1a';x.fill();
    rr(xx-3,y-3,w+6,22,9);x.strokeStyle='#ffffff55';x.lineWidth=1.5;x.stroke();
    x.save();rr(xx,y,w,16,6);x.clip();x.fillStyle='#1a2036';x.fillRect(xx,y,w,16);
    const gw=w*Math.max(0,f.gh)/f.mx,bw=w*pc,bx=left?xx:xx+w-bw,gx=left?xx:xx+w-gw;x.fillStyle='#ffe9a0';x.globalAlpha=.85;x.fillRect(gx,y,gw,16);x.globalAlpha=1;
    const lo=pc>.5,mid=pc>.25,g1=x.createLinearGradient(0,y,0,y+16);if(lo){g1.addColorStop(0,'#9dff8a');g1.addColorStop(.5,'#35c24f');g1.addColorStop(1,'#1c7a34')}else if(mid){g1.addColorStop(0,'#ffe27a');g1.addColorStop(.5,'#f59b1f');g1.addColorStop(1,'#a85a08')}else{const pu=.75+.25*Math.sin(tm/110);g1.addColorStop(0,'#ff8a7a');g1.addColorStop(.5,'rgba(230,50,50,'+pu+')');g1.addColorStop(1,'#8a1414')}
    x.fillStyle=g1;x.fillRect(bx,y,bw,16);x.fillStyle='rgba(255,255,255,.3)';x.fillRect(bx,y+1,bw,5);
    x.strokeStyle='rgba(0,0,0,.28)';x.lineWidth=1;for(let i=1;i<10;i++){x.beginPath();x.moveTo(xx+w*i/10,y);x.lineTo(xx+w*i/10,y+16);x.stroke()}x.restore();
    if(f.aw){const on=f.awT>0,rdy=!on&&f.awC<=0,pr=on?f.awT/AWDUR:1-f.awC/AWC,cc=AWD[f.aw].c,col=on?cc[1]:rdy?cc[0]:'#ffffff66',by=y+44;x.save();rr(xx,by,w,7,3.5);x.clip();x.fillStyle='#0b0f1acc';x.fillRect(xx,by,w,7);const g2=x.createLinearGradient(xx,0,xx+w,0);g2.addColorStop(0,shd(col.length>=7?col:'#888888',-.35));g2.addColorStop(1,col);x.fillStyle=on||rdy?g2:col;x.fillRect(left?xx:xx+w-w*pr,by,w*pr,7);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(xx,by,w,2);x.restore();rr(xx,by,w,7,3.5);x.strokeStyle='#ffffff40';x.lineWidth=1;x.stroke();if(rdy){x.font='bold 10px sans-serif';x.fillStyle=cc[1];x.textAlign=left?'left':'right';x.fillText('DESPERTAR PRONTO',left?xx:xx+w,y+61)}}
    x.font='bold 12px sans-serif';x.textAlign=left?'left':'right';x.lineWidth=3;x.strokeStyle='#000c';const nm=(l||'').split(' ')[0]+' '+Math.ceil(Math.max(0,f.hp)),nx=left?xx:xx+w;x.strokeText(nm,nx,y+31);x.fillStyle='#fff';x.fillText(nm,nx,y+31);
    [['w',f.wi],['a',f.ai]].forEach(([k,i],n)=>{if(i<0)return;const m=FS.img(k,i);if(m.complete&&m.naturalWidth){const ix=left?xx+w-24-n*26:xx+4+n*26,iy=y+19;x.save();x.beginPath();x.arc(ix+11,iy+11,12,0,7);x.fillStyle='rgba(11,15,26,.8)';x.fill();x.strokeStyle='#ffffff66';x.lineWidth=1.5;x.stroke();x.drawImage(m,ix,iy,22,22);x.restore()}})};

  const trDeco=x=>{x.save();for(let i=0;i<4;i++){const cx=200+i*400,g=x.createRadialGradient(cx,0,0,cx,0,260);g.addColorStop(0,'rgba(255,240,200,.35)');g.addColorStop(1,'rgba(255,240,200,0)');x.fillStyle=g;x.fillRect(cx-260,0,520,300)}
    x.font='900 30px sans-serif';x.textAlign='center';x.fillStyle='rgba(255,255,255,.14)';x.fillText('DOJO DE TREINAMENTO',WW/2,92);
    [300,800,1300].forEach(cx=>{[34,24,14,6].forEach((r,k)=>{x.fillStyle=k%2?'#fff':'#d33';x.globalAlpha=.55;x.beginPath();x.arc(cx,200,r,0,7);x.fill()});x.globalAlpha=1});
    x.font='bold 12px sans-serif';x.fillStyle='#ffffffcc';x.strokeStyle='#ffffff66';x.lineWidth=2;for(let n=0;n<=16;n++){const px=n*100;x.beginPath();x.moveTo(px,GY-4);x.lineTo(px,GY+(n%5?8:18));x.stroke();if(n%5===0&&n)x.fillText(n+' m',px,GY+34)}x.restore()};
  const paint=(x,t)=>{const m=FD.M[MP],g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,m[2]);g.addColorStop(1,m[3]);x.fillStyle=g;x.fillRect(0,0,WW,H);skyTex(x,m,WW);
    const tri=(c,n,w,h,o2)=>{x.fillStyle=c;for(let i=0;i<n;i++){x.beginPath();x.moveTo(i*w-w/3,GY);x.lineTo(i*w+w/2,GY-h-(i*37+o2)%50);x.lineTo(i*w+w*1.3,GY);x.fill()}};
    if(m[6]===0){x.fillStyle='#ffe9a0';x.beginPath();x.arc(1300,90,38,0,7);x.fill();tri('#4a8a5a',8,230,100,0)}
    else if(m[6]===1){x.fillStyle='#fff';for(let i=0;i<80;i++)x.fillRect(i*97%WW,i*53%250,2,2);x.fillStyle='#e8e8f8';x.beginPath();x.arc(240,80,28,0,7);x.fill();x.fillStyle='#14182c';for(let i=0;i<17;i++)x.fillRect(i*95,GY-50-(i*37%90),60,200)}
    else if(m[6]===2){tri('#3a1410',8,230,120,10);x.fillStyle='#ff5a1f55';x.fillRect(0,GY-30,WW,30)}
    else if(m[6]===3){tri('#bfe6ff',8,230,110,20)}
    else{x.strokeStyle='#f0f6';x.lineWidth=1;for(let i=0;i<=32;i++){x.beginPath();x.moveTo(WW/2+(i-16)*20,250);x.lineTo((i-16)*90+WW/2,GY);x.stroke()}for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,250+i*i*5);x.lineTo(WW,250+i*i*5);x.stroke()}}
    groundTex(x,m,WW,M.pl);if(TRN)trDeco(x)};
  const BG=document.createElement('canvas');BG.width=WW*1.5;BG.height=H*1.5;{const c2=BG.getContext('2d');c2.scale(1.5,1.5);paint(c2,0)}
  const camU=dt=>{const lo=Math.min(P.y,E.y),dx=Math.abs(P.x-E.x),top=Math.min(lo-135,GY-150),bot=GY+36,z=Math.max(.5,Math.min(1.5,W/Math.max(520,dx+440),H/(bot-top)))*(fin&&fin.zm||1),cx=(P.x+E.x)/2,cy=(top+bot)/2;
    if(!cam.i){cam.x=cx;cam.y=cy;cam.z=z;cam.i=1;return}const k=1-Math.exp(-dt*6);cam.x+=(cx-cam.x)*k;cam.y+=(cy-cam.y)*k;cam.z+=(z-cam.z)*k};
  /* ---------- FINALIZAÇÕES (cutscene ≥ 10 s) ---------- */
  let fin=null,FH=null,SK=null;const FP=[],FS2=[],FDUR=()=>FK>=100?BRC.dur(FK):FK===5?14:11.5,FSEG=[[1,5],[5,6],[2,9],[9,10],[1,2],[2,7],[7,8],[1,3],[3,4],[0,1]];
  const finPt=l=>{const g=l.rg;if(!g)return{x:l.x,y:l.y-40};const q=FSEG[Math.random()*FSEG.length|0],a=g[q[0]],b=g[q[1]],u=Math.random();return{x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u}};
  window.BRC&&BRC.fctx({FP,FX,GY,x:()=>x,W:()=>W,H:()=>H,shk:n=>{shk=Math.max(shk,n)},fb:()=>FB});
  const finStart=(w,l)=>{fin={t:0,w,l,d:w.x<l.x?1:-1,bu:0,fk:0,fl:0,b2:0,col:l===P?'#7ad0ff':'#ff7a7a'};SK=null;FH=null;FP.length=0;FS2.length=0;rst=3;rt=99;[w,l].forEach(f=>{f.vx=f.vy=0;f.gr=true;f.stun=0;f.blk=false;f.dash=0;f.atk=0;f.dot=[];f.hit=0});l.dead=0;l.rg=null;l.hid=0;shk=0};
  const finU=dt=>{const F=fin;if(!F)return;F.t+=dt;const T=F.t,w=F.w,l=F.l,d=F.d,u=Math.max(0,Math.min(1,(T-.7)/7.3));w.face=d;l.face=-d;
    if(FK===2)finKat(F,dt,T,w,l,d);else if(FK===3)finRaio(F,dt,T,w,l,d);else if(FK===4)finCaes(F,dt,T,w,l,d);else if(FK===5)finBomba(F,dt,T,w,l,d);else if(FK>=100)BRC.fstep(FK,F,dt,T,w,l,d);else{
    if(T<.7){const k=Math.min(1,dt*9);w.x+=(l.x-d*54-w.x)*k;w.y+=(GY-w.y)*k;l.y+=(GY-l.y)*k}
    else if(T<8){l.x+=d*dt*7;w.x=l.x-d*(50+Math.sin(T*34)*7);w.y=GY;l.y=GY-((1-Math.exp(-(T-.7)*2.6))*48+Math.sin(T*17)*3);l.hit=.1;w.atk=.22*(1-((T*13)%1));
      F.bu-=dt;while(F.bu<=0){F.bu+=.075-.04*u;const px=l.x+(Math.random()-.5)*26,py=l.y-12-Math.random()*56;
        FX.push({x:px,y:py,r:22+Math.random()*20,c:Math.random()<.5?'#fff3a0':'#ffb347',t:.2});
        for(let i=0,n=FB?5:3;i<n;i++)FP.push({x:px,y:py,vx:d*(60+Math.random()*320)+(Math.random()-.5)*120,vy:-Math.random()*300,g:900,t:.7+Math.random()*.8,s:2+Math.random()*3,c:FB?(Math.random()<.5?'#c00':'#800'):'#ffe27a',bl:FB});
        shk=Math.max(shk,4+u*7)}}
    if(T>6.3&&T<8){F.fk-=dt;while(F.fk<=0){F.fk+=.012;const p=finPt(l),r=Math.random();FP.push({x:p.x,y:p.y,vx:(Math.random()-.5)*80,vy:-Math.random()*70,g:260,t:1+Math.random(),s:2+Math.random()*2,c:FB&&r<.3?'#c00':r<.65?F.col:'#bbb',bl:0})}}
    if(T>=8&&!F.b2){F.b2=1;F.fl=1;shk=24;l.hid=1;w.atk=0;const cx=l.x,cy=l.y-45;
      for(let i=0;i<300;i++){const p=finPt(l),a=Math.atan2(p.y-cy,p.x-cx)+(Math.random()-.5)*1.2,sp=140+Math.random()*520;FP.push({x:p.x,y:p.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-120,g:700,t:2+Math.random()*1.6,s:2+Math.random()*4,c:FB&&i%2?'#b00':i%7===0?'#e8b890':i%3===0?'#999':F.col,bl:FB&&i%2})}
      FX.push({x:cx,y:cy,r:130,c:'#ffffff',t:.45});if(OPT.vib==='s'&&navigator.vibrate)try{navigator.vibrate([60,40,120])}catch{}}}
    F.fl=Math.max(0,F.fl-dt*2.2);
    for(let i=FP.length-1;i>=0;i--){const p=FP[i];p.t-=dt;if(p.t<=0){FP.splice(i,1);continue}p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;
      if(p.y>GY-1&&p.vy>0){if(p.bl&&Math.random()<.5&&FS2.length<160)FS2.push({x:p.x,w:3+Math.random()*9});p.y=GY-1;p.vy*=-.3;p.vx*=.6;if(p.bl)p.t=Math.min(p.t,.05)}}
    if(T>=FDUR())finEnd(F)};
  const finEnd=F=>{const w=F.w,l=F.l;if(F.wi!==undefined)w.wi=F.wi;fin=null;FP.length=0;rst=2;rt=1.3;l.dead=1;if(FK!==2)l.hid=1;fsShow(0)};
  const katSettle=F=>{const l=F.l,d=F.d;l.nh=1;if(!FH)FH={x:Math.max(20,Math.min(WW-20,l.x+d*95)),y:GY-16,vx:0,vy:0,r:d*2.5,vr:0,img:l.img,col:F.col};else{if(FH.y<GY-16)FH.x+=FH.vx*.3;FH.x=Math.max(20,Math.min(WW-20,FH.x));FH.y=GY-16;FH.vx=FH.vy=FH.vr=0}};
  const skipFin=()=>{const F=fin;if(!F)return;const w=F.w,l=F.l,kat=FK===2;SFX.stop();SFX.win(!!F.good);if(kat)katSettle(F);finEnd(F);if(!kat){l.hid=1;FH=null;FS2.length=0}w.atk=0;l.hit=0;w.win=1;if(FK>=100&&window.BRC&&BRC.fend)BRC.fend(F);SK=null;shk=0};
  /* ---- Finalização 2: KATANA (decapitação) ---- */
  const rad=Math.PI/180,lp=(a,b,u)=>a+(b-a)*Math.max(0,Math.min(1,u)),es=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)};
  const kAng=T=>{let a;if(T<2.9)a=-75+Math.sin(T*1.5)*3;else if(T<3.1)a=lp(-75,-150,es((T-2.9)/.2));else if(T<3.3)a=lp(-150,35,es((T-3.1)/.2));else if(T<5.6)a=lp(35,60,(T-3.3)/2.3);else if(T<6)a=lp(60,-20,es((T-5.6)/.4));else if(T<6.25)a=lp(-20,75,es((T-6)/.25));else a=lp(75,10,es((T-6.25)/.35));return a};
  const finKat=(F,dt,T,w,l,d)=>{
    if(F.wi===undefined){F.wi=w.wi;w.wi=-1;F.lx=l.x;F.pl=0;F.bf=0}
    if(T<.7){const k=Math.min(1,dt*9);w.x+=(l.x-d*70-w.x)*k;w.y+=(GY-w.y)*k;l.y+=(GY-l.y)*k;F.lx=l.x}
    else{w.y=GY;if(!l.dead)l.y=GY;
      if(T<3.0){w.x=F.lx-d*70;l.hit=.1;l.x=F.lx+Math.sin(T*55)*1.2*Math.min(1,(T-.7)/1.5)}
      else{l.x=F.lx;if(!l.dead&&T<4.8)l.hit=.1;w.x=F.lx-d*70+d*140*es((T-3)/.3)}}
    w.atk=(T>3.05&&T<3.4)?.22*(1-(T-3.05)/.35):0;
    if(T>=6.6){w.win=1}
    if(T>=3.2&&!F.cut){F.cut=1;F.fl=.9;shk=18;const h=l.rg?l.rg[0]:{x:l.x,y:l.y-70};
      FH={x:h.x,y:h.y,vx:d*(150+Math.random()*60),vy:-430,r:0,vr:d*9,img:l.img,col:F.col};l.nh=1;FX.push({x:l.x,y:l.y-62,r:95,c:'#ffffff',t:.3});
      if(!FB)for(let i=0;i<22;i++)FP.push({x:l.x,y:l.y-62,vx:(Math.random()-.5)*300,vy:-Math.random()*260,g:600,t:.5+Math.random()*.5,s:2+Math.random()*2,c:'#ddd',bl:0});
      if(OPT.vib==='s'&&navigator.vibrate)try{navigator.vibrate([40,30,140])}catch{}}
    if(F.cut&&FB&&T<7&&l.rg){F.bf-=dt;const nk=l.rg[1],dc=Math.max(.25,1-(T-3.2)/3.8),pu=.65+.35*Math.sin(T*9);
      while(F.bf<=0){F.bf+=.016;FP.push({x:nk.x,y:nk.y,vx:(Math.random()-.5)*80+d*30,vy:-(250+Math.random()*190)*dc*pu,g:900,t:.8+Math.random()*.6,s:2+Math.random()*2.5,c:Math.random()<.5?'#b00':'#800',bl:1})}}
    if(T>=4.8&&!F.col2){F.col2=1;l.dead=1}
    if(T>=4.8&&T<5.4&&l.rg)l.rg.forEach(p=>{if(p.y<GY-12)p.x+=d*70*dt});
    if(FB&&T>5&&T<8&&l.rg){F.pl-=dt;if(F.pl<=0){F.pl+=.08;if(FS2.length<160)FS2.push({x:l.rg[2].x+(Math.random()-.5)*(24+(T-5)*20),w:6+Math.random()*10})}}
    if(FH){FH.vy+=1500*dt;FH.x+=FH.vx*dt;FH.y+=FH.vy*dt;FH.r+=FH.vr*dt;
      if(FH.y>GY-16){FH.y=GY-16;if(Math.abs(FH.vy)>90){FH.vy*=-.42;FH.vx*=.7;FH.vr*=.7;if(FB){for(let i=0;i<8;i++)FP.push({x:FH.x,y:FH.y+10,vx:(Math.random()-.5)*160,vy:-Math.random()*180,g:900,t:.6,s:2+Math.random()*2,c:'#a00',bl:1})}}
        else{FH.vy=0;FH.vx*=Math.exp(-dt*3);FH.vr=FH.vx/16;if(Math.abs(FH.vx)<5)FH.vx=FH.vr=0}}}};
  const headDraw=()=>{if(!FH)return;x.save();x.translate(FH.x,FH.y);x.rotate(FH.r);x.save();x.beginPath();x.arc(0,0,16,0,7);x.clip();const im=getImg(FH.img);
    if(im&&im.naturalWidth){const s=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-s)/2,(im.naturalHeight-s)/2,s,s,-16,-16,32,32)}else{x.fillStyle='#8899aa';x.fill()}
    x.restore();x.strokeStyle=FH.col;x.lineWidth=3;x.beginPath();x.arc(0,0,16,0,7);x.stroke();if(FB){x.fillStyle='#a00';x.beginPath();x.arc(0,15,5,0,7);x.fill()}x.restore()};
  const katDraw=F=>{if(!F||FK!==2||F.t>=6.6)return;const w=F.w,l=F.l,d=F.d,T=F.t,H=w.rg&&w.rg[4];if(!H)return;
    const dr=a=>[Math.cos(a*rad)*d,Math.sin(a*rad)],a=kAng(T),v=dr(a),vis=T<6.25?1:Math.max(0,1-(T-6.25)/.35),len=54*(T>6.25?lp(1,.4,(T-6.25)/.35):1);
    x.save();x.globalAlpha=vis;x.lineCap='round';
    if(T>3.1&&T<3.5){x.globalAlpha=Math.max(0,1-(T-3.3)/.2)*.9;x.strokeStyle='#fff';x.lineWidth=5;x.beginPath();for(let i=0;i<=10;i++){const q=dr(lp(-150,Math.min(a,35),i/10)),px=H.x+q[0]*len,py=H.y+q[1]*len;i?x.lineTo(px,py):x.moveTo(px,py)}x.stroke();x.globalAlpha=vis}
    x.strokeStyle='#2a1a12';x.lineWidth=5;x.beginPath();x.moveTo(H.x-v[0]*13,H.y-v[1]*13);x.lineTo(H.x,H.y);x.stroke();
    x.strokeStyle='#d4a53a';x.lineWidth=3;x.beginPath();x.moveTo(H.x-v[1]*5,H.y+v[0]*5);x.lineTo(H.x+v[1]*5,H.y-v[0]*5);x.stroke();
    x.strokeStyle='#cfd8e0';x.lineWidth=3;x.beginPath();x.moveTo(H.x,H.y);x.lineTo(H.x+v[0]*len,H.y+v[1]*len);x.stroke();
    x.strokeStyle='#fff';x.lineWidth=1;x.beginPath();x.moveTo(H.x+v[0]*4,H.y+v[1]*4-1);x.lineTo(H.x+v[0]*len,H.y+v[1]*len-1);x.stroke();
    if(T>3.2&&T<3.55&&l.rg){const nk=l.rg[1],al=1-(T-3.2)/.35;x.globalAlpha=al;x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.moveTo(F.lx-d*90,nk.y+12);x.lineTo(F.lx+d*90,nk.y-12);x.stroke()}
    x.restore()};
  /* ---- Finalização 3: RAIO DA MORTE ---- */
  const fzap=(x1,y1,x2,y2,n,j)=>{x.beginPath();x.moveTo(x1,y1);for(let i=1;i<n;i++){const u=i/n;x.lineTo(x1+(x2-x1)*u+(Math.random()-.5)*j,y1+(y2-y1)*u+(Math.random()-.5)*j)}x.lineTo(x2,y2);x.stroke()};
  const hnd=w=>w.rg&&w.rg[4]?w.rg[4]:{x:w.x,y:w.y-40};
  const finRaio=(F,dt,T,w,l,d)=>{
    if(F.wi===undefined){F.wi=w.wi;w.wi=-1;F.lx=l.x;F.bf=0;F.sp=0}
    if(T<.7){const k=Math.min(1,dt*9);w.x+=(l.x-d*170-w.x)*k;w.y+=(GY-w.y)*k;l.y+=(GY-l.y)*k;F.lx=l.x}
    else{w.y=GY;w.x=F.lx-d*170;if(!l.dead)l.y=GY;l.x=F.lx;
      if(T<5){l.hit=.1;l.x=F.lx+Math.sin(T*60)*(T<3?1:3)*Math.min(1,(T-.7)/1.5)}}
    w.atk=(T>1&&T<5.4)?.2:0;
    if(T>=3&&T<5){l.hid=Math.random()<.3?1:0;F.bf-=dt;if(F.bf<=0){F.bf=.07;FX.push({x:l.x+(Math.random()-.5)*30,y:l.y-20-Math.random()*50,r:18+Math.random()*16,c:Math.random()<.5?'#bfe8ff':'#fff',t:.15});shk=Math.max(shk,6)}}
    if(T>=3&&!F.hit){F.hit=1;F.fl=1;shk=20;if(OPT.vib==='s'&&navigator.vibrate)try{navigator.vibrate([60,30,200])}catch{}}
    if(T>=5&&!F.dis){F.dis=1;F.fl=1;shk=22;l.hid=1;const cx=l.x,cy=l.y-45;
      for(let i=0;i<260;i++){const p=finPt(l),a=Math.atan2(p.y-cy,p.x-cx)+(Math.random()-.5)*1.5,sp=40+Math.random()*260,r=Math.random();FP.push({x:p.x,y:p.y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-140,g:-30+Math.random()*60,t:1.5+Math.random()*2,s:2+Math.random()*3,c:r<.35?'#222':r<.6?'#777':r<.8?'#ff9a2a':(FB?'#a00':'#ccc'),bl:0})}
      FX.push({x:cx,y:cy,r:120,c:'#ffffff',t:.4});
      for(let i=0;i<5;i++)FS2.push({x:l.x+(Math.random()-.5)*70,w:20+Math.random()*30,h:3,c:'#111'})}
    if(T>=6.6)w.win=1;
    F.fl=Math.max(0,(F.fl||0)-dt*2.2)};
  const rayDraw=F=>{if(!F||FK!==3||F.t<.7||F.t>6)return;const T=F.t,w=F.w,l=F.l,d=F.d,H=hnd(w),cx=l.x,cy=l.y-45;x.save();x.lineCap='round';x.lineJoin='round';
    const arcs=(px,py,r,n)=>{x.strokeStyle='#bfe8ff';x.lineWidth=1.5;for(let i=0;i<n;i++){const a=Math.random()*6.28;fzap(px,py,px+Math.cos(a)*r,py+Math.sin(a)*r,4,r*.5)}};
    if(T<3.1){const u=es((T-.7)/2.3),r=3+u*17;x.fillStyle='rgba(120,200,255,.35)';x.beginPath();x.arc(H.x,H.y,r*1.8,0,7);x.fill();x.fillStyle='#fff';x.beginPath();x.arc(H.x,H.y,r*.6,0,7);x.fill();arcs(H.x,H.y,r*2.2+8,2+u*5|0);
      if(T>2.4&&Math.random()<.35){const bx=cx+(Math.random()-.5)*160;x.strokeStyle='rgba(190,230,255,.8)';x.lineWidth=2;fzap(bx,cy-420,bx+(Math.random()-.5)*40,GY,9,50)}}
    if(T>=3&&T<5){const f=1+Math.random()*.5;x.strokeStyle='rgba(90,170,255,.35)';x.lineWidth=16*f;fzap(H.x,H.y,cx,cy,10,14);x.strokeStyle='#8fd0ff';x.lineWidth=7;fzap(H.x,H.y,cx,cy,10,10);x.strokeStyle='#fff';x.lineWidth=2.5;fzap(H.x,H.y,cx,cy,10,6);
      x.strokeStyle='rgba(200,235,255,.9)';x.lineWidth=4;fzap(cx+(Math.random()-.5)*50,cy-440,cx,cy,12,45);x.lineWidth=2;fzap(cx+(Math.random()-.5)*80,cy-440,cx,cy,12,60);
      x.fillStyle='rgba(255,255,255,.8)';x.beginPath();x.arc(H.x,H.y,10+Math.random()*5,0,7);x.fill();arcs(cx,cy,50,4)}
    else if(T>=5){const u=1-(T-5)/1;if(u>0){x.globalAlpha=u;arcs(cx,cy+10,40,3)}}
    x.restore()};
  /* ---- Finalização 4: CÃES PRETOS COM FOGO (só ossos) ---- */
  const finCaes=(F,dt,T,w,l,d)=>{
    if(F.wi===undefined){F.wi=w.wi;w.wi=-1;F.lx=l.x;F.ff=0;F.dg=[-1,1,-1].map((s,i)=>({s,i,x:l.x+s*(130+i*25),y:GY,a:0,dir:-s,ph:Math.random()*6,jw:.3,hl:0,run:0,on:0,bt:0,st:1+i*.4}))}
    if(T<.7){const k=Math.min(1,dt*9);w.x+=(l.x-d*220-w.x)*k;w.y+=(GY-w.y)*k;l.y+=(GY-l.y)*k;F.lx=l.x}
    else{w.y=GY;w.x=F.lx-d*220;if(!l.dead)l.y=GY;l.x=F.lx;if(T>2.4&&T<5){l.hit=.1;l.x=F.lx+Math.sin(T*50)*2.5}}
    w.atk=(T>.9&&T<2.4)?.2:0;
    if(T>=5)l.hid=1;
    const k=Math.min(1,dt*12);
    F.dg.forEach(g=>{
      g.a=es((T-g.st)/.45);if(T>7.2)g.a=Math.max(0,Math.min(g.a,1-(T-7.2)/.6));
      if(!g.on&&T>=g.st){g.on=1;FX.push({x:g.x,y:GY-20,r:70,c:'#ff7a1a',t:.4});shk=Math.max(shk,7);for(let i=0;i<14;i++)FP.push({x:g.x+(Math.random()-.5)*30,y:GY,vx:(Math.random()-.5)*120,vy:-120-Math.random()*220,g:200,t:.6+Math.random()*.6,s:2+Math.random()*3,c:Math.random()<.5?'#ff7a1a':'#ffd54a',bl:0})}
      let tx=g.x,ty=GY;
      if(T<2.4){tx=F.lx+g.s*(130+g.i*25);g.run=0;g.jw=.25+Math.sin(T*18+g.i)*.2}
      else if(T<5){const u=((T-2.4)*1.15+g.i/3)%1;g.run=1;
        if(u<.45){const q=u/.45;tx=F.lx+g.s*lp(130,16,es(q));ty=GY-Math.sin(q*Math.PI)*38;g.jw=.75;g.bt=0}
        else{tx=F.lx+g.s*lp(16,90,es((u-.45)/.55));g.jw=u<.55?0:.35;
          if(!g.bt){g.bt=1;l.hit=.1;shk=Math.max(shk,8);FX.push({x:l.x,y:l.y-25-Math.random()*45,r:26,c:'#fff3a0',t:.15});
            for(let i=0;i<7;i++)FP.push({x:l.x,y:l.y-30-Math.random()*40,vx:-g.s*(40+Math.random()*220),vy:-Math.random()*220,g:900,t:.5+Math.random()*.5,s:2+Math.random()*3,c:FB?'#b00':'#ffb347',bl:FB})}}}
      else if(T<6.4){tx=F.lx+g.s*(16+g.i*9);g.run=0;g.hl=-es((T-5)/.3);g.jw=.45+Math.sin(T*22+g.i*2)*.4;
        if(Math.random()<dt*14)FP.push({x:l.x+(Math.random()-.5)*30,y:GY-10-Math.random()*30,vx:(Math.random()-.5)*200,vy:-Math.random()*240,g:900,t:.5,s:2+Math.random()*3,c:FB?'#b00':'#c9a27a',bl:FB})}
      else{tx=F.lx+g.s*(75+g.i*8);g.run=0;g.hl=es((T-6.8)/.4);g.jw=.7*g.hl}
      g.x+=(tx-g.x)*k;g.y+=(ty-g.y)*k;g.ph+=dt*(g.run?16:3);
      if(T>7.2&&g.a>0&&Math.random()<.5)FP.push({x:g.x+(Math.random()-.5)*50,y:g.y-20-Math.random()*20,vx:(Math.random()-.5)*60,vy:-60-Math.random()*120,g:-40,t:.5,s:3,c:'#ff9a2a',bl:0})});
    if(T>.9&&T<6.4){F.ff-=dt;while(F.ff<=0){F.ff+=.03;const r=Math.random();
      if(T<1.6||r<.35)FP.push({x:F.lx+(Math.random()-.5)*160,y:GY,vx:(Math.random()-.5)*30,vy:-90-Math.random()*130,g:-40,t:.5+Math.random()*.4,s:3+Math.random()*4,c:r<.5?'#ff5a12':'#ffb020',bl:0});
      else{const q=finPt(l);FP.push({x:q.x,y:q.y,vx:(Math.random()-.5)*40,vy:-110-Math.random()*150,g:-60,t:.5+Math.random()*.5,s:3+Math.random()*4,c:r<.6?'#ff5a12':r<.85?'#ffb020':'#ffe27a',bl:0})}}}
    if(T>=6.4&&!F.dis){F.dis=1;shk=10;SK={x:l.x,t0:performance.now()};FX.push({x:l.x,y:GY-20,r:60,c:'#ffb347',t:.3});
      for(let i=0;i<40;i++)FP.push({x:l.x+(Math.random()-.5)*50,y:GY-10-Math.random()*30,vx:(Math.random()-.5)*260,vy:-Math.random()*260,g:900,t:1+Math.random(),s:2+Math.random()*3,c:FB?'#a00':'#c9a27a',bl:FB});
      if(FB)for(let i=0;i<8;i++)FS2.push({x:l.x+(Math.random()-.5)*110,w:8+Math.random()*22})}
    if(T>=7.4)w.win=1;
    F.fl=Math.max(0,(F.fl||0)-dt*2.2)};
  const bone=f=>{x.lineCap='round';x.lineJoin='round';x.strokeStyle='#ff6a1a';x.lineWidth=7.5;f();x.stroke();x.strokeStyle='#0b090e';x.lineWidth=5.5;f();x.stroke()};
  const dogOne=g=>{const ph=g.ph,run=g.run,hl=g.hl,sc=1.15*g.a;if(sc<=0)return;x.save();x.translate(g.x,g.y);x.scale(g.dir*sc,sc);x.globalAlpha=Math.min(1,g.a*1.3);
    x.fillStyle='rgba(0,0,0,.35)';x.beginPath();x.ellipse(0,GY-g.y,32,4,0,0,7);x.fill();
    const fl=(fx,fy,h,c)=>{x.fillStyle=c;x.beginPath();x.moveTo(fx-4,fy);x.quadraticCurveTo(fx-2,fy-h*.5,fx+(Math.random()-.5)*6,fy-h);x.quadraticCurveTo(fx+2,fy-h*.4,fx+4,fy);x.fill()};
    for(let i=0;i<8;i++){const fx=-32+i*9,h=12+Math.random()*16;fl(fx,-30,h,'rgba(255,90,18,.85)');fl(fx,-30,h*.55,'rgba(255,213,74,.9)')}
    for(let i=0;i<3;i++)fl(36+i*4,-36-hl*10,8+Math.random()*10,'rgba(255,120,30,.8)');
    bone(()=>{x.beginPath();x.moveTo(-30,-27);x.quadraticCurveTo(-2,-34+(run?Math.sin(ph*2)*2:0),24,-30)});
    x.fillStyle='#0b090e';x.strokeStyle='#ff6a1a';x.lineWidth=1.5;x.beginPath();x.ellipse(-4,-26,28,9,0,0,7);x.fill();x.stroke();
    bone(()=>{x.beginPath();x.moveTo(-30,-27);x.lineTo(-33,-19)});
    const wag=Math.sin(ph*.7)*4;bone(()=>{x.beginPath();x.moveTo(-30,-27);x.quadraticCurveTo(-42,-30+wag,-48,-40+wag)});
    const leg=(hx,hy,p,hind)=>{const s=Math.sin(p)*run,a1=s*.9+(hind?.3:-.1),kx=hx+Math.sin(a1)*12,ky=hy+Math.cos(a1)*12,a2=-s*.5+(hind?-.4:.1)+Math.max(0,Math.cos(p))*run*.5*(hind?-1:1),px=kx+Math.sin(a2)*13,py=ky+Math.cos(a2)*13;bone(()=>{x.beginPath();x.moveTo(hx,hy);x.lineTo(kx,ky);x.lineTo(px,py)})};
    leg(-28,-26,ph,1);leg(-26,-26,ph+Math.PI,1);leg(20,-28,ph+Math.PI,0);leg(22,-28,ph,0);
    x.save();x.translate(26,-31);x.rotate(-hl*.9);
    bone(()=>{x.beginPath();x.moveTo(0,0);x.lineTo(10,-6)});bone(()=>{x.beginPath();x.arc(14,-8,6,0,7)});x.fillStyle='#0b090e';x.beginPath();x.arc(14,-8,6,0,7);x.fill();bone(()=>{x.beginPath();x.moveTo(18,-8);x.lineTo(32,-5)});bone(()=>{x.beginPath();x.moveTo(11,-13);x.lineTo(9,-20)});
    x.save();x.translate(18,-4);x.rotate(g.jw);bone(()=>{x.beginPath();x.moveTo(0,0);x.lineTo(13,2)});x.restore();
    x.fillStyle='#e6dcc8';for(let i=0;i<3;i++){x.beginPath();x.moveTo(22+i*3.5,-6);x.lineTo(23.5+i*3.5,-2.5);x.lineTo(25+i*3.5,-6);x.fill()}
    x.fillStyle='rgba(255,106,16,.45)';x.beginPath();x.arc(15,-9,4.8,0,7);x.fill();x.fillStyle='#ffb020';x.beginPath();x.arc(15,-9,2.2,0,7);x.fill();
    x.restore();x.restore()};
  const skDraw=()=>{if(!SK)return;const a=Math.min(1,(performance.now()-SK.t0)/500);x.save();x.translate(SK.x,GY);x.globalAlpha=a;
    const bw=f=>{x.lineCap='round';x.lineJoin='round';x.strokeStyle='#3a3228';x.lineWidth=5;f();x.stroke();x.strokeStyle='#e8e0cc';x.lineWidth=3;f();x.stroke()};
    bw(()=>{x.beginPath();x.moveTo(-28,-5);x.lineTo(14,-6)});
    for(let i=0;i<5;i++){const rx=-14+i*7;bw(()=>{x.beginPath();x.moveTo(rx,-6);x.quadraticCurveTo(rx+2,-18,rx+7,-7)})}
    bw(()=>{x.beginPath();x.moveTo(-32,-10);x.lineTo(-28,-4);x.lineTo(-32,1)});
    bw(()=>{x.beginPath();x.moveTo(-30,-4);x.lineTo(-48,-2);x.lineTo(-62,-6)});bw(()=>{x.beginPath();x.moveTo(-30,-3);x.lineTo(-46,-9);x.lineTo(-58,-2)});
    bw(()=>{x.beginPath();x.moveTo(10,-6);x.lineTo(24,0);x.lineTo(36,-4)});bw(()=>{x.beginPath();x.moveTo(8,-6);x.lineTo(18,-16);x.lineTo(28,-12)});
    x.fillStyle='#e8e0cc';x.strokeStyle='#3a3228';x.lineWidth=2;x.beginPath();x.arc(24,-10,8,0,7);x.fill();x.stroke();
    x.fillStyle='#111';x.beginPath();x.arc(21,-12,2.3,0,7);x.arc(27,-12,2.3,0,7);x.fill();bw(()=>{x.beginPath();x.moveTo(19,-3);x.lineTo(30,-3)});
    x.restore()};
  const dogDraw=F=>{if(!F||FK!==4||!F.dg)return;F.dg.forEach(dogOne);if(F.t>.7&&F.t<2.5){const H=hnd(F.w),u=es((F.t-.7)/1.5);x.save();x.fillStyle='rgba(255,70,20,.4)';x.beginPath();x.arc(H.x,H.y,4+u*14,0,7);x.fill();x.fillStyle='#ffd54a';x.beginPath();x.arc(H.x,H.y,2+u*4,0,7);x.fill();x.restore()}};
  /* ---- Finalização 5: BOMBA ATÔMICA + PLANETA TERRA DESTRUÍDO ---- */
  const finBomba=(F,dt,T,w,l,d)=>{
    if(F.wi===undefined){F.wi=w.wi;w.wi=-1;F.lx=l.x;F.wx=Math.max(70,Math.min(WW-70,l.x-d*260));F.sd=[];F.ch=[];F.st=[];F.ck=[];
      for(let i=0;i<70;i++)F.st.push({x:Math.random()*W,y:Math.random()*H,s:Math.random()<.2?2:1,a:.4+Math.random()*.6});
      const nb=7,bd=[];for(let i=0;i<nb;i++)bd.push(i/nb*6.283+(Math.random()-.5)*.5-1.2);bd.sort((a,b)=>a-b);
      const cl=['#2a6fd6','#3d9a48','#1f56b0','#8a5a2a','#2f8a4a','#2a6fd6','#3d9a48'];
      for(let r=0;r<2;r++)for(let i=0;i<nb;i++)F.ch.push({a0:bd[i],a1:i<nb-1?bd[i+1]:bd[0]+6.283,r0:r?0:.52,r1:r?.52:1,c:cl[(i+r*3)%nb],sp:130+Math.random()*190+(r?0:60),spin:(Math.random()-.5)*5,ox:(Math.random()-.5)*20,oy:(Math.random()-.5)*20});
      for(let k=0;k<9;k++){const pts=[];let a=-.8+(k/9)*6.283+(Math.random()-.5)*.6,px=0,py=0;for(let j=0;j<9;j++){a+=(Math.random()-.5)*.9;px+=Math.cos(a)*(.12+Math.random()*.1);py+=Math.sin(a)*(.12+Math.random()*.1);pts.push([px,py])}F.ck.push(pts)}}
    if(T<.7){const k=Math.min(1,dt*9);w.x+=(F.wx-w.x)*k;w.y+=(GY-w.y)*k;l.y+=(GY-l.y)*k;F.lx=l.x}
    else{w.y=GY;l.x=F.lx;if(!l.dead)l.y=GY;
      w.x=T<3.6?F.wx:Math.max(50,Math.min(WW-50,F.wx-d*lp(0,110,es((T-3.6)/.7))));
      if(T>2.1&&T<3.6){l.hit=.1;l.x=F.lx+Math.sin(T*60)*(1+(T-2.1)*2)}}
    w.atk=(T>.9&&T<2)?.2:0;
    if(T>=3.6)l.hid=1;
    if(T>2&&T<3.6){F.fk-=dt;while(F.fk<=0){F.fk+=.02;const my=lp(-60,GY-34,Math.pow((T-2)/1.6,2));
      FP.push({x:F.lx+(Math.random()-.5)*10,y:my-34,vx:(Math.random()-.5)*30,vy:-60-Math.random()*60,g:-20,t:.5+Math.random()*.4,s:3+Math.random()*4,c:Math.random()<.5?'#ffb020':'#9a9a9a',bl:0})}}
    if(T>=3.6&&!F.bm){F.bm=1;F.fl=1.5;shk=34;const cx=F.lx;
      FX.push({x:cx,y:GY-40,r:220,c:'#ffffff',t:.6});FX.push({x:cx,y:GY-40,r:150,c:'#ffb347',t:.9});
      for(let i=0;i<150;i++){const a=-Math.random()*Math.PI,sp=120+Math.random()*620,r=Math.random();FP.push({x:cx+(Math.random()-.5)*40,y:GY-8,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,g:600,t:1+Math.random()*1.5,s:2+Math.random()*4,c:FB&&r<.3?'#b00':r<.5?'#ffb020':r<.75?'#555':'#ffe27a',bl:FB&&r<.3})}
      [150,100,60].forEach(wd=>FS2.push({x:cx+(Math.random()-.5)*40,w:wd+Math.random()*40,h:5,c:'#120d08'}));
      if(OPT.vib==='s'&&navigator.vibrate)try{navigator.vibrate([80,40,200,60,120])}catch{}}
    if(T>=9.6&&!F.pb){F.pb=1;F.fl=1.3;shk=28;for(let i=0;i<110;i++){const a=Math.random()*6.283,sp=60+Math.random()*420;F.sd.push({x:W/2,y:H/2,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,t:1+Math.random()*1.6,c:Math.random()<.5?'#ffb020':Math.random()<.5?'#fff3a0':'#ff5a12'})}
      if(OPT.vib==='s'&&navigator.vibrate)try{navigator.vibrate([100,50,250])}catch{}}
    if(T>7.2&&T<9.6&&Math.random()<dt*6)shk=Math.max(shk,4+(T-7.2)*3);
    for(let i=F.sd.length-1;i>=0;i--){const p=F.sd[i];p.t-=dt;if(p.t<=0){F.sd.splice(i,1);continue}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vx*=1-dt*.6;p.vy*=1-dt*.6}
    if(T>=12)w.win=1;
    F.fl=Math.max(0,(F.fl||0)-dt*1.4)};
  const bombDraw=F=>{if(!F||FK!==5)return;const T=F.t,w=F.w,d=F.d,bx=F.lx;x.save();
    if(T>.9&&T<3.6){const H=w.rg&&w.rg[4]||{x:w.x+d*22,y:w.y-60},p=.6+.4*Math.sin(T*18);
      x.fillStyle='#111';x.fillRect(H.x-6,H.y-4,12,9);x.fillStyle='rgba(255,40,30,'+p+')';x.beginPath();x.arc(H.x,H.y-5,4+p*2,0,7);x.fill();
      if(T<2.2){x.strokeStyle='rgba(255,60,50,'+(.7-(T*3)%1*.7)+')';x.lineWidth=2;x.beginPath();x.arc(H.x,H.y,10+(T*3)%1*40,0,7);x.stroke()}}
    if(T>1.8&&T<3.6){const k=.35+.35*Math.sin(T*22);x.fillStyle='rgba(255,40,30,'+k+')';x.beginPath();x.ellipse(bx,GY,70,9,0,0,7);x.fill();
      x.strokeStyle='rgba(255,80,60,.9)';x.lineWidth=2;x.stroke()}
    if(T>2&&T<3.6){const my=lp(-60,GY-34,Math.pow((T-2)/1.6,2));x.save();x.translate(bx,my);
      x.fillStyle='rgba(255,170,40,.8)';x.beginPath();x.moveTo(-6,-26);x.lineTo(0,-60-Math.random()*16);x.lineTo(6,-26);x.fill();
      x.fillStyle='#b01818';x.beginPath();x.moveTo(-8,-18);x.lineTo(-17,-30);x.lineTo(-8,-34);x.fill();x.beginPath();x.moveTo(8,-18);x.lineTo(17,-30);x.lineTo(8,-34);x.fill();
      x.fillStyle='#8a8f98';x.beginPath();x.moveTo(-8,-34);x.lineTo(-8,-6);x.quadraticCurveTo(0,26,8,-6);x.lineTo(8,-34);x.fill();
      x.fillStyle='#ffd21a';x.beginPath();x.arc(0,-18,5,0,7);x.fill();x.fillStyle='#111';x.beginPath();x.arc(0,-18,1.8,0,7);x.fill();x.restore()}
    if(T>=3.6){x.globalAlpha=1-es((T-12.2)/1.6);const u=T-3.6,fr=lp(10,125,es(u/1.1)),fa=1-es((u-1.2)/1.6);
      if(fa>0){const g=x.createRadialGradient(bx,GY-fr*.5,0,bx,GY-fr*.5,fr);g.addColorStop(0,'rgba(255,255,230,'+fa+')');g.addColorStop(.35,'rgba(255,200,60,'+fa+')');g.addColorStop(.75,'rgba(255,90,10,'+fa*.8+')');g.addColorStop(1,'rgba(200,40,0,0)');x.fillStyle=g;x.beginPath();x.arc(bx,GY-fr*.5,fr,0,7);x.fill()}
      const h=lp(0,215,es(u/2.4)),sw=lp(46,24,Math.min(1,u/2.4)),cr=lp(20,128,es((u-.2)/2.6)),cool=es((u-.6)/2.4);
      const mix=(a,b)=>Math.round(lp(a,b,cool));
      if(h>2){const g=x.createLinearGradient(0,GY,0,GY-h);g.addColorStop(0,'rgba(255,140,30,.95)');g.addColorStop(1,'rgba('+mix(255,95)+','+mix(120,80)+','+mix(30,70)+',.95)');x.fillStyle=g;
        x.beginPath();x.moveTo(bx-sw*1.4,GY);x.quadraticCurveTo(bx-sw*.5,GY-h*.5,bx-sw*.6,GY-h);x.lineTo(bx+sw*.6,GY-h);x.quadraticCurveTo(bx+sw*.5,GY-h*.5,bx+sw*1.4,GY);x.fill()}
      if(u>.3){const cy=GY-h-cr*.15;for(let i=0;i<9;i++){const a=i/9*6.283,ox=Math.cos(a)*cr*.62,oy=Math.sin(a)*cr*.28,rr=cr*(.34+.08*Math.sin(i*2.3+u));
        x.fillStyle='rgb('+mix(255-i*6,95+i*5)+','+mix(150-i*8,75+i*4)+','+mix(40,68)+')';x.beginPath();x.arc(bx+ox,cy+oy,rr,0,7);x.fill()}
        x.fillStyle='rgba('+mix(255,120)+','+mix(190,90)+','+mix(80,70)+',.95)';x.beginPath();x.ellipse(bx,cy,cr*.75,cr*.34,0,0,7);x.fill();
        x.strokeStyle='rgba(60,45,40,.8)';x.lineWidth=7;x.beginPath();x.ellipse(bx,cy+cr*.34,cr*.78,cr*.14,0,0,Math.PI);x.stroke()}
      if(u<1.7){const sr=u*980,a=1-u/1.7;x.strokeStyle='rgba(255,235,190,'+a+')';x.lineWidth=7;x.beginPath();x.ellipse(bx,GY,sr,sr*.1,0,0,7);x.stroke();
        x.strokeStyle='rgba(255,150,60,'+a*.6+')';x.lineWidth=14;x.beginPath();x.ellipse(bx,GY,sr*.93,sr*.09,0,0,7);x.stroke()}}
    x.restore()};
  const bombOv=F=>{const T=F.t;
    if(T>.4&&T<3.6){x.fillStyle='rgba(10,0,10,'+.32*es((T-.4)/1.6)+')';x.fillRect(0,0,W,H)}
    if(T>=3.6&&T<7){x.fillStyle='rgba(255,110,20,'+.38*Math.max(0,1-(T-3.6)/3.2)+')';x.fillRect(0,0,W,H)}
    const sa=T<6.4?0:T<7.2?es((T-6.4)/.8):T<11.4?1:1-es((T-11.4)/.8);if(sa<=0)return;
    x.save();x.globalAlpha=sa;x.fillStyle='#02030a';x.fillRect(0,0,W,H);
    F.st.forEach(s=>{x.fillStyle='rgba(255,255,255,'+s.a+')';x.fillRect(s.x,s.y,s.s,s.s)});
    const cx=W/2,cy=H/2+4,R=lp(215,102,es((T-6.4)/2));
    if(T<9.6){const sh=T>8.4?(T-8.4)*4:0,ox=(Math.random()-.5)*sh,oy=(Math.random()-.5)*sh,c=Math.max(0,Math.min(1,(T-7.4)/2.1));
      x.save();x.translate(cx+ox,cy+oy);
      let g=x.createRadialGradient(0,0,R*.95,0,0,R*1.35);g.addColorStop(0,'rgba(110,180,255,.45)');g.addColorStop(1,'rgba(110,180,255,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,R*1.35,0,7);x.fill();
      x.beginPath();x.arc(0,0,R,0,7);x.clip();
      g=x.createRadialGradient(-R*.3,-R*.3,R*.1,0,0,R);g.addColorStop(0,'#3f8cf0');g.addColorStop(1,'#0b2a6b');x.fillStyle=g;x.fillRect(-R,-R,R*2,R*2);
      x.save();x.rotate(T*.03);[[-.35,-.25,.3,.2,'#3d9a48'],[.3,.2,.26,.38,'#3d9a48'],[-.1,.55,.22,.1,'#d9d9d9'],[.5,-.45,.14,.09,'#8a7a3a'],[-.6,.25,.1,.2,'#2f8a4a']].forEach(q=>{x.fillStyle=q[4];x.beginPath();x.ellipse(q[0]*R,q[1]*R,q[2]*R,q[3]*R,.4,0,7);x.fill()});
      x.fillStyle='rgba(255,255,255,.35)';[[-.2,.1,.35,.05],[.35,-.3,.28,.04],[-.5,-.5,.2,.04]].forEach(q=>{x.beginPath();x.ellipse(q[0]*R,q[1]*R,q[2]*R,q[3]*R,.2,0,7);x.fill()});x.restore();
      const ix=Math.cos(-.8)*R*.5,iy=Math.sin(-.8)*R*.5;
      x.strokeStyle='rgba(255,90,10,'+.55*c+')';x.lineWidth=7;F.ck.forEach(p=>{x.beginPath();x.moveTo(ix,iy);const n=Math.ceil(c*p.length);for(let i=0;i<n;i++)x.lineTo(ix+p[i][0]*R*2.2,iy+p[i][1]*R*2.2);x.stroke()});
      x.strokeStyle='#ffe08a';x.lineWidth=2;F.ck.forEach(p=>{x.beginPath();x.moveTo(ix,iy);const n=Math.ceil(c*p.length);for(let i=0;i<n;i++)x.lineTo(ix+p[i][0]*R*2.2,iy+p[i][1]*R*2.2);x.stroke()});
      g=x.createRadialGradient(ix,iy,0,ix,iy,R*(.2+c*.9));g.addColorStop(0,'rgba(255,240,170,'+.9*c+')');g.addColorStop(.5,'rgba(255,100,20,'+.5*c+')');g.addColorStop(1,'rgba(255,60,0,0)');x.fillStyle=g;x.fillRect(-R,-R,R*2,R*2);
      g=x.createLinearGradient(-R*.2,-R*.4,R,R*.6);g.addColorStop(0,'rgba(0,0,20,0)');g.addColorStop(1,'rgba(0,0,20,.55)');x.fillStyle=g;x.fillRect(-R,-R,R*2,R*2);
      x.restore()}
    else{const tt=T-9.6,fa=Math.max(0,Math.min(1,1-(T-10.6)/1.3));
      if(tt<1.6){const fr=tt*420,g=x.createRadialGradient(cx,cy,0,cx,cy,fr+1);g.addColorStop(0,'rgba(255,255,230,'+(1-tt/1.6)+')');g.addColorStop(.5,'rgba(255,150,40,'+(1-tt/1.6)*.7+')');g.addColorStop(1,'rgba(255,60,0,0)');x.fillStyle=g;x.beginPath();x.arc(cx,cy,fr+1,0,7);x.fill();
        x.strokeStyle='rgba(255,230,190,'+(1-tt/1.6)+')';x.lineWidth=5;x.beginPath();x.arc(cx,cy,tt*620,0,7);x.stroke()}
      x.globalAlpha=sa*fa;
      F.ch.forEach(c=>{const m=(c.a0+c.a1)/2,rm=(c.r0+c.r1)/2*R,mx=Math.cos(m)*rm,my=Math.sin(m)*rm,k=tt*(1-tt*.12);
        x.save();x.translate(cx+mx+Math.cos(m)*c.sp*k+c.ox*tt,cy+my+Math.sin(m)*c.sp*k+c.oy*tt);x.rotate(c.spin*tt);x.translate(-mx,-my);
        x.beginPath();x.arc(0,0,c.r1*R,c.a0,c.a1);if(c.r0>0)x.arc(0,0,c.r0*R,c.a1,c.a0,true);else x.lineTo(0,0);x.closePath();
        x.fillStyle=c.c;x.fill();x.strokeStyle='rgba(255,140,30,'+Math.max(.2,1-tt/1.5)+')';x.lineWidth=3;x.stroke();x.restore()});
      x.globalAlpha=sa;F.sd.forEach(p=>{x.fillStyle=p.c;x.globalAlpha=sa*Math.min(1,p.t*1.5);x.fillRect(p.x-1.5,p.y-1.5,3,3)})}
    x.restore()};
  const finDraw=()=>{if(!FP.length&&!FS2.length&&!FH&&!fin&&!SK)return;x.save();x.fillStyle='#7a0a0a';x.globalAlpha=.85;FS2.forEach(q=>{x.fillStyle=q.c||'#7a0a0a';x.fillRect(q.x-q.w/2,GY-2,q.w,q.h||3)});
    FP.forEach(p=>{x.globalAlpha=Math.min(1,p.t*1.6);x.fillStyle=p.c;x.fillRect(p.x-p.s/2,p.y-p.s/2,p.s,p.s)});x.restore();headDraw();katDraw(fin);rayDraw(fin);dogDraw(fin);bombDraw(fin);FK>=100&&window.BRC&&BRC.fd(fin);skDraw()};
  const finOv=()=>{const F=fin;if(!F)return;const T=F.t;x.save();
    if(FB&&T>.7){const g=x.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.9);g.addColorStop(0,'rgba(120,0,0,0)');g.addColorStop(1,'rgba(120,0,0,.5)');x.fillStyle=g;x.fillRect(0,0,W,H)}
    if(FK===2){const da=T<3.2?.38*es((T-.7)/1.5):lp(.38,.12,(T-3.2)/1.5);x.fillStyle='rgba(0,0,10,'+da+')';x.fillRect(0,0,W,H)}
    if(FK===3){const da=T<3?.5*es((T-.5)/1.8):lp(.5,.1,(T-5)/2);x.fillStyle='rgba(5,0,25,'+da+')';x.fillRect(0,0,W,H)}
    if(FK===4){const da=T<2.4?.45*es((T-.4)/1.6):lp(.45,.12,(T-6.4)/1.5);x.fillStyle='rgba(25,0,0,'+da+')';x.fillRect(0,0,W,H)}
    if(FK===5)bombOv(F);
    if(FK>=100&&window.BRC)BRC.fo(F);
    const bh=Math.max(0,Math.min(1,T/.5,(FDUR()-T)/.5))*22;x.fillStyle='#000';x.fillRect(0,0,W,bh);x.fillRect(0,H-bh,W,bh);
    if(F.fl>0){x.globalAlpha=Math.min(1,F.fl);x.fillStyle='#fff';x.fillRect(0,0,W,H);x.globalAlpha=1}
    if(T<1.4)ban('K.O.!','#ff5a4a',wt);else if(T>(FK===5?12.4:FK>=100?BRC.dur(FK)-3.1:8.4))ban('FINALIZAÇÃO!','#ff5a4a');x.restore()};
  const ko=()=>{SFX.ko();tmo=P.hp>0&&E.hp>0;const pw=P.hp/P.mx>=E.hp/E.mx,w=pw?P:E,l=pw?E:P;if(!pvp&&!TRN){if(FKU!==null){FK=FKU;FKU=null}if(!pw&&CPFR>=0){FKU=FK;FK=CPFR}}rst=2;rt=KOT;over2=1;cut=null;UL.length=0;TX.length=0;PR.length=0;HK.length=0;w.vit++;w.win=1;l.dead=1;l.hp=Math.max(0,l.hp);const d=w.x<l.x?1:-1;
    if(l.rg)l.rg.forEach(p=>{p.vx=l.vx*.6+d*(260+Math.random()*160);p.vy=-330-Math.random()*260});shk=10;wt=(tmo?'TEMPO ESGOTADO · ':'')+(pvp?'Jogador '+(pw?1:2)+' venceu!':pw?'VOCÊ VENCEU!':'CPU VENCEU!');if(FK>0&&FIN_OK.includes(FK)&&OPT.fsk!=='x'){if(FK<100)SFX.fin(FK,FB,pvp||pw);finStart(w,l);if(fin){fin.good=pvp||pw;fsShow(1)}}else SFX.win(pvp||pw)};
  const newRound=()=>{rd++;[[P,400,1],[E,1200,-1]].forEach(([f,xx,fc])=>Object.assign(f,{x:xx,y:GY,vx:0,vy:0,hp:f.mx,cd:[0,0,0],stun:0,slow:0,sh:0,shT:0,bf:0,bfv:0,face:fc,gr:true,dash:0,dcd:0,blk:false,atk:0,acd:0,hit:0,ph:0,hurt:0,awT:0,awP:0,awC:TRN?4:AWC,ulU:0,iv:0,mk:0,wk:0,dd:0,fu:0,sil:0,dz:0,rt:0,ice:0,dg:0,cn:0,nx:0,inv:0,cdx:0,dig:0,rgn:0,dot:[],dmo:null,dmf:null,dead:0,nh:0,win:0,rag:0,dm:null,br:null,rg:null,did:0,hid:0}));fin=null;SK=null;FH=null;FP.length=0;FS2.length=0;
    PR.length=0;FX.length=0;UL.length=0;TX.length=0;HK.length=0;mt=0;rst=1;rt=1.7;over2=1;cam.i=0};
  const TR={m:0,im:1,d:0,w:0,sp:1,nc:0,hb:0,dm:0,mx:0,ev:[]},TSP=[1,.5,.25],TSN=['1×','½×','¼×'],TRM=['🧍','🚶','⚔','🛡'],TRN2=['parado','andando','atacando','bloqueando'];
  const trAi=(f,t,dt)=>{const d=t.x-f.x,ad=Math.abs(d),dir=d>0?1:-1,m=TR.m;let ax=0,at=0,bk=0;
    if(m===1){TR.w+=dt;ax=Math.sin(TR.w*.9)>0?1:-1;if(f.x<250)ax=1;if(f.x>1350)ax=-1}
    else if(m===2){if(ad>78)ax=dir;else if(ad<50)ax=-dir;if(ad<90&&f.acd<=0)at=1}
    else if(m===3)bk=1;
    return{ax,inp:{blk:bk,atk:at,jump:0,dash:0}}};
  const trDm=(a,t,d,b)=>{if(t===E){TR.dm+=d;TR.mx=Math.max(TR.mx,d);TR.ev.push([performance.now(),d])}TX.push({x:t.x+(Math.random()-.5)*34,y:t.y-72,t:.8,s:String(Math.round(d)),c:b?'#9ad4ff':t===P?'#ff8a8a':'#ffe08a'})};
  const trSt=()=>{const n=performance.now();while(TR.ev.length&&n-TR.ev[0][0]>3000)TR.ev.shift();const dps=TR.ev.reduce((q,e)=>q+e[1],0)/3,r='dano '+Math.round(TR.dm)+' · dps '+Math.round(dps)+' · maior '+Math.round(TR.mx);if(gst&&gst.textContent!==r)gst.textContent=r};
  const trReset=()=>{newRound();rd=1;TR.dm=TR.mx=0;TR.ev.length=0;trSt()};
  const hbx=()=>{x.save();x.lineWidth=2;[[P,'#3dff6a'],[E,'#ff4a4a']].forEach(([f,c])=>{x.strokeStyle=c;x.strokeRect(f.x-22,f.y-90,44,90);x.beginPath();x.moveTo(f.x,f.y-45);x.lineTo(f.x+f.face*40,f.y-45);x.stroke()});x.restore()};
  const trTick=dt=>{mt=0;trSt();if(TR.nc){[P,E].forEach(f=>{f.cd[0]=f.cd[1]=f.cd[2]=0;f.dcd=0;if(!(f.awT>0))f.awC=0})}if(P.hp<P.mx*.2)P.hp=P.mx;if(TR.im){if(E.hp<E.mx)E.hp=Math.min(E.mx,E.hp+E.mx*.5*dt);if(E.hp<=0)E.hp=1}else if(E.hp<=0){TR.d+=dt;if(TR.d>1.2){TR.d=0;E.hp=E.mx}}else TR.d=0};
  if(TRN){gt.querySelectorAll('button').forEach(b=>{b.style.padding='3px 10px';b.style.fontSize='11px'});const bm=o.querySelector('#ftm'),bi=o.querySelector('#fti'),br=o.querySelector('#ftr');bm.onclick=()=>{TR.m=(TR.m+1)%4;bm.textContent=TRM[TR.m]};bi.onclick=()=>{TR.im^=1;bi.textContent=TR.im?'♾':'❤'};br.onclick=()=>trReset();o.querySelector('#ftc').onclick=()=>catOpen();
    const tgl=(id,fn)=>{const b=o.querySelector(id);b.onclick=()=>fn(b)},on=(b,v)=>{b.style.background=v?'#2fbf71cc':'#0008'};
    tgl('#ftz',b=>{TR.nc^=1;on(b,TR.nc)});tgl('#ftx',b=>{TR.hb^=1;on(b,TR.hb)});tgl('#ftv',b=>{TR.sp=TSP[(TSP.indexOf(TR.sp)+1)%3];b.textContent=TSN[TSP.indexOf(TR.sp)];on(b,TR.sp<1)});
    tgl('#fta',()=>{if(!P.aw){txt(P,'sem despertar (abra o catálogo, aba despertar)','#ffd54a');return}P.awC=0;awaken(P)});
    tgl('#ftf',()=>{if(rst!==0||fin||cut)return;if(!FK||!FIN_OK.includes(FK)){txt(P,'escolha a finalização no catálogo','#ffd54a');return}E.hp=0;ko();P.vit=Math.max(0,P.vit-1)})}
  const lw=(k,i)=>new Promise(r=>{const c=FS.img(k,i),t0=performance.now(),f=()=>{if(c.complete||performance.now()-t0>3000)r();else setTimeout(f,40)};f()});
  const ldP=u=>new Promise(r=>{if(!u||getImg(u))return r();const m=imgs[u];if(!m)return r();m.onload=m.onerror=()=>r();setTimeout(r,2500)});
  const rebuildCtl=()=>{if(!H0)return;H0.remove();H0=mkHost(2);mkCtl(0,H0,soloL(),[0,0,P.W.a,...P.W.p])};
  const stt=a=>({spd:0,jmp:0,dmg:0,def:0,cdr:0,ls:0,hp:0,reg:0,acd:0,kbr:0,dcd:0,pdm:0,crit:0,...(a?a[2]:{})});
  const cat={t:0,tab:'w',q:'',ps:0,n:60},tg=()=>cat.t?E:P;
  const APL={
    async c(i){const c=LIST[+i],f=tg();if(!c)return;await ldP(c.foto);f.c=c;f.img=c.foto;f.aw=awKind(c);f.awT=0;f.awC=4;f.ulU=0;if(f===P)rebuildCtl()},
    async w(i){const f=tg(),w=FD.W[+i];if(!w)return;await lw('w',+i);f.W={a:w[2],p:w.slice(3)};f.wi=+i;f.cd=[0,0,0];if(f===P)rebuildCtl()},
    async a(i){const f=tg();i=+i;if(i>=0)await lw('a',i);const a=i>=0?FD.A[i]:null;f.s=stt(a);f.ai=i;f.mx=Math.round((HPB+f.s.hp)*(OPT.cVid||1));f.hp=f.gh=f.mx},
    async pw(v){const f=tg(),[wi,pn]=v.split(':').map(Number),p=FD.W[wi]&&FD.W[wi][3+pn];if(!p)return;f.W={a:f.W.a,p:f.W.p.slice()};f.W.p[cat.ps]=p;f.cd[cat.ps]=0;if(f===P)rebuildCtl()},
    async aw(k){const f=tg();if(k&&!AWD[k])return;f.aw=k;f.awT=0;f.awC=4;f.ulU=0;if(f===P)rebuildCtl()},
    async fin(n){n=+n;if(!FIN_OK.includes(n))return;FK=n;ST.set('fin',{k:FK,b:FB})}
  };
  const CTB=[['c','👤','candidato'],['w','⚔','arma'],['a','🧢','acessório'],['pw','⚡','poder'],['fin','🎬','finalização'],['aw','🔥','despertar']];
  const catItems=()=>{const q=nz(cat.q),f=tg(),ok=t=>!q||nz(t).includes(q);let r=[];
    if(cat.tab==='c')LIST.forEach((c,i)=>{if(ok(c.nome)||ok(c.partido||'')||String(c.num||'').startsWith(q))r.push([f.c&&f.c.id===c.id,'c',i,av(c)+'<span>'+esc(c.nome)+'</span>',esc(c.partido||'')])});
    else if(cat.tab==='w')FD.W.forEach((w,i)=>{if(ok(w[1]))r.push([f.wi===i,'w',i,FS.tag('w',i,22)+'<span>'+esc(w[1]),'soco ×'+w[2]+'</span>'])});
    else if(cat.tab==='a'){if(ok('nenhum'))r.push([f.ai<0,'a',-1,'<span>🚫 Nenhum','</span>']);FD.A.forEach((a,i)=>{if(ok(a[1]))r.push([f.ai===i,'a',i,FS.tag('a',i,22)+'<span>'+esc(a[1]),esc(FD.desc(a[2]))+'</span>'])})}
    else if(cat.tab==='pw')FD.W.forEach((w,wi)=>{for(let n=0;n<3;n++){const p=w[3+n];if(p&&(ok(p[0])||ok(w[1])))r.push([f.W.p[cat.ps]===p,'pw',wi+':'+n,(PTI[p[1]]||PTI.B)+'<span>'+esc(p[0]),esc(w[1])+' · '+esc(pw(p))+'</span>'])}});
    else if(cat.tab==='fin')FIN_L.forEach(([v,n])=>{if(ok(n)&&FIN_OK.includes(v))r.push([FK===v,'fin',v,'<span>'+esc(n),'o botão de disparar vem na próxima etapa</span>'])});
    else if(cat.tab==='aw'){if(ok('nenhum'))r.push([!f.aw,'aw','','<span>🚫 Nenhum','</span>']);Object.keys(AWD).forEach(k=>{const d=AWD[k];if(ok(d.n))r.push([f.aw===k,'aw',k,awIc(d.ic)+'<span>'+esc(d.n),esc(d.d)+'</span>'])})}
    return r};
  const catList=()=>{const l=o.querySelector('#fgk .ls');if(!l)return;const r=catItems();let h=r.slice(0,cat.n).map(([on,k,v,a,b])=>`<button class="${on?'on':''}" data-k="${k}" data-v="${esc(String(v))}">${a}${b?'<small>'+b+'</small>':''}</button>`).join('');
    if(cat.tab==='c'&&!LIST.length)h='<div style="opacity:.8;padding:6px">Lista de candidatos não carregada.</div><button data-k="ld">↻ Carregar candidatos</button>';
    else if(!r.length)h='<div style="opacity:.8;padding:6px">Nada encontrado.</div>';
    else if(r.length>cat.n)h+=`<button data-k="more">Mostrar mais (${r.length-cat.n})</button>`;
    l.innerHTML=h};
  const catPaint=()=>{const k=o.querySelector('#fgk');if(!k)return;
    k.innerHTML=`<div class="tb">${CTB.map(([i,t,h])=>`<button data-k="tab" data-v="${i}" title="${h}" class="${cat.tab===i?'on':''}">${t}</button>`).join('')}<span style="width:6px"></span><button data-k="t" data-v="0" title="aplicar em mim" class="${cat.t?'':'on'}">🧍</button><button data-k="t" data-v="1" title="aplicar no boneco" class="${cat.t?'on':''}">🎯</button><span style="flex:1"></span><button data-k="x">✕</button></div>${cat.tab==='pw'?`<div class="tb"><small style="opacity:.7">Trocar o</small>${[0,1,2].map(n=>`<button data-k="ps" data-v="${n}" class="${cat.ps===n?'on':''}">poder ${n+1}</button>`).join('')}</div>`:''}<input id="fgks" placeholder="🔍 buscar ${CTB.find(t=>t[0]===cat.tab)[2]} · ${cat.t?'boneco':'eu'}" value="${esc(cat.q)}" autocomplete="off"><div class="ls"></div>`;catList()};
  const catOpen=()=>{if(o.querySelector('#fgk'))return catClose();o.insertAdjacentHTML('beforeend','<div id="fgk"></div>');const k=o.lastElementChild;
    k.addEventListener('input',e=>{if(e.target.id==='fgks'){cat.q=e.target.value;cat.n=60;catList()}});
    k.addEventListener('click',async e=>{const b=e.target.closest('button[data-k]');if(!b)return;const a=b.dataset.k,v=b.dataset.v;
      if(a==='tab'){cat.tab=v;cat.q='';cat.n=60;catPaint()}else if(a==='t'){cat.t=+v;catPaint()}else if(a==='ps'){cat.ps=+v;catPaint()}else if(a==='x')catClose();
      else if(a==='more'){cat.n+=60;catList()}else if(a==='ld'){loadList(true);b.textContent='Carregando…';setTimeout(catList,2000);setTimeout(catList,5000)}
      else if(APL[a]){b.style.opacity=.5;try{await APL[a](v)}catch(er){}catList()}});
    catPaint()};
  const catClose=()=>{const k=o.querySelector('#fgk');if(k)k.remove()};
  const ban=(tx,c,sub)=>{x.textAlign='center';x.font='900 54px sans-serif';x.lineWidth=7;x.strokeStyle='#000b';x.strokeText(tx,W/2,190);x.fillStyle=c;x.fillText(tx,W/2,190);if(sub){x.font='bold 20px sans-serif';x.lineWidth=4;x.strokeText(sub,W/2,226);x.fillStyle='#fff';x.fillText(sub,W/2,226)}};
  const fpsU=t=>{if(OPT.fps!=='s'){if(fpsOn){fpsOn=0;fpsEl.style.display='none'}return}if(!fpsOn){fpsOn=1;fpsEl.style.display='';fpsC=0;fpsT=t;fpsV=0}if(paused){fpsT=t;fpsC=0;return}fpsC++;if(t-fpsT>=500){const v=Math.round(fpsC*1000/(t-fpsT));fpsC=0;fpsT=t;if(v!==fpsV){fpsV=v;fpsEl.textContent=v+' FPS';fpsEl.style.color=v>=50?'#7dff9a':v>=30?'#ffd54a':'#ff6a5a'}}};
  const loop=t=>{fpsU(t);
    if(!paused&&!cut){const r=t-lt0;fE=fE*.92+Math.min(r,100)*.08;if(++fN>=150){fN=0;if(fW<2)fW++;else if(fE>27&&QL<2){QL++;fit();fE=16.7}}}lt0=t;
    const dt0=paused?0:Math.min(.033,(t-last)/1000);last=t;if(cut&&!paused){cut.t+=dt0;if(cut.t>=CUTT){launch(cut);cut=null}}
    const ts=((rst===2&&rt>KOT-.8)?.3:1)*(TRN?TR.sp:1),dt=cut?0:dt0*ts;
    setAim(P,K,dt0);if(pvp)setAim(E,K2,dt0);[P,E].forEach(f=>f.cat=Math.max(0,(f.cat||0)-dt0));
    const ax=K.ax||(K.r-K.l);if(rst===1&&!paused){if(SR!==rd){SR=rd;SFX.p('round')}if(rt<=.7&&SF!==rd){SF=rd;SFX.p('fight')}}
    if(!paused){
      if(rst===0){mt+=dt;tickAw(P,dt);tickAw(E,dt);if(pvp){const k2=KS[1];P.face=E.x>P.x?1:-1;step(P,dt,ax,K,E);step(E,dt,k2.ax||(k2.r-k2.l),k2,P)}else{const A=ai(E,P,dt);cpuAw(dt);const dg=cpuDodge(dt);step(P,dt,ax,K,E);step(E,dt,dg||A.ax,A.inp,P)}E.face=P.x<E.x?-1:1;if(window.BRCFT&&mt>1.3)(BRCFT.win?E:P).hp=0;if(TRN)trTick(dt);else if(P.hp<=0||E.hp<=0||mt>=RT)ko()}
      else if(rst===3){finU(dt0)}else{rt-=dt0;
        if(rst===1){P.face=E.x>P.x?1:-1;E.face=-P.face;step(P,dt,0,null,E);step(E,dt,0,null,P);if(rt<=0){rst=0;over2=0}}
        else{[P,E].forEach(f=>{if(f.dead){const h=f.rg&&f.rg[2];if(h){f.x=h.x;f.y=Math.min(GY,h.y+10)}}else step(f,dt,0,null,f===P?E:P)});if(rt<=0)newRound()}}
      if(dt>0){rig(P,dt,t);rig(E,dt,t)}
    }
    KS.forEach(k=>k.jump=k.dash=k.atk=0);shk=Math.max(0,shk-dt0*22);
    updPR(dt);
    for(let i=FX.length-1;i>=0;i--){FX[i].t-=dt;if(FX[i].t<=0)FX.splice(i,1)}for(let i=TX.length-1;i>=0;i--){TX[i].t-=dt;TX[i].y-=34*dt;if(TX[i].t<=0)TX.splice(i,1)}
    for(let i=HK.length-1;i>=0;i--){if(HK[i].fn(dt,HK[i]))HK.splice(i,1)}updUL(dt);camU(dt0);
    abs.forEach((r,pi)=>{const f=FT[pi],hd=UL.some(u=>u.k==='b'&&u.o===f&&u.st==='h'),rdy=f.awT<=0&&f.awC<=0;{const sg=(f.awT>0?'a'+Math.ceil(f.awT):rdy?'r':'c'+Math.ceil(f.awC))+(hd?'h':'')+(f.ulU?'u':'')+(f.awT>0&&!f.ulU?'x':'');if(r._sg===sg)return;r._sg=sg}r[0].firstChild.innerHTML=f.awT>0?IS.fire+' '+Math.ceil(f.awT)+'s':rdy?IS.fire+' PRONTO':IS.wait+' '+Math.ceil(f.awC)+'s';r[0].style.opacity=f.awT>0?.55:rdy?1:.4;r[1].firstChild.innerHTML=hd?IS.rocket+' LANÇAR':f.ulU?IS.ok+' usado':awIc(AWD[f.aw].ic);r[1].style.opacity=(hd||(f.awT>0&&!f.ulU))?1:.35});
    pbs.forEach((r,pi)=>r.forEach((e,n)=>{const f=FT[pi],v=f.cd[n];const mxc=(f.W.p[n][3]*(1-f.s.cdr)*(OPT.cCd||1))||1;{const sg=v>0?Math.ceil(v)+':'+Math.round(Math.min(1,v/mxc)*40):'0';if(e._sg===sg)return;e._sg=sg}e.style.opacity=v>0?.85:1;e.firstChild.textContent=v>0?Math.ceil(v):f.W.p[n][0];e.firstChild.style.fontSize=v>0?'18px':'';e.lastChild.style.background=v>0?`conic-gradient(rgba(0,0,0,.66) ${Math.min(1,v/mxc)*360}deg,transparent 0)`:'transparent'}));

    const cw=cv.width,ch=cv.height,s=Math.min(cw/W,ch/H),ox=(cw-W*s)/2,oy=(ch-H*s)/2;
    x.setTransform(1,0,0,1,0,0);x.fillStyle='#0b0f1a';x.fillRect(0,0,cw,ch);
    x.setTransform(s,0,0,s,ox,oy);
    x.save();x.beginPath();x.rect(0,0,W,H);x.clip();
    {const z=cam.z,vw=W/z,cx=Math.max(vw/2,Math.min(WW-vw/2,cam.x)),mm=FD.M[MP];
      x.translate(W/2+(Math.random()-.5)*shk*2,H/2+(Math.random()-.5)*shk*2);x.scale(z,z);x.translate(-cx,-cam.y);
      x.fillStyle=mm[2];x.fillRect(-W,-3000,WW+2*W,3000);x.fillStyle=mm[4];x.fillRect(-W,H,WW+2*W,3000);}
    {const z2=cam.z,vw3=W/z2,cx2=Math.max(vw3/2,Math.min(WW-vw3/2,cam.x)),hx=vw3/2+40,hy=H/(2*z2)+40,x0=Math.max(0,cx2-hx),x1=Math.min(WW,cx2+hx),y0=Math.max(0,cam.y-hy),y1=Math.min(H,cam.y+hy);if(x1>x0&&y1>y0)x.drawImage(BG,x0*1.5,y0*1.5,(x1-x0)*1.5,(y1-y0)*1.5,x0,y0,x1-x0,y1-y0)}{const mz=FD.M[MP][6];if(mz===2||mz===3){x.fillStyle=mz===2?'#ffb347':'#fff';for(let i=0;i<52;i++){const px=(i*83)%WW+(mz===3?Math.sin(t/700+i)*12:0),py=mz===2?GY-((i*61+t/20)%GY):(i*43+t/15)%GY;x.fillRect(px,py,mz===2?2:3,mz===2?2:3)}}}
    FX.forEach(e=>{e.t0=e.t0||e.t;const p=1-e.t/e.t0,r=Math.max(2,e.r*(.3+.9*p)),a=Math.min(1,e.t/e.t0*1.7),c=e.c||'#fc6';x.save();const gg=x.createRadialGradient(e.x,e.y,r*.15,e.x,e.y,r);gg.addColorStop(0,hexA(c,0));gg.addColorStop(.65,hexA(c,.16*a));gg.addColorStop(1,hexA(c,.5*a));x.fillStyle=gg;x.beginPath();x.arc(e.x,e.y,r,0,7);x.fill();
      x.globalCompositeOperation='lighter';x.strokeStyle=c;x.globalAlpha=a;x.lineWidth=2+5*a;x.beginPath();x.arc(e.x,e.y,r,0,7);x.stroke();x.strokeStyle='#fff';x.globalAlpha=a*.75;x.lineWidth=1.4;x.beginPath();x.arc(e.x,e.y,r*.93,0,7);x.stroke();
      x.globalAlpha=a*.9;x.strokeStyle=c;x.lineWidth=2;x.lineCap='round';x.beginPath();for(let i=0;i<(QL>1?5:10);i++){const an=i*(QL>1?1.2566:.6283)+e.x*.013,r1=r*.72,r2=r*(.92+p*.3);x.moveTo(e.x+Math.cos(an)*r1,e.y+Math.sin(an)*r1);x.lineTo(e.x+Math.cos(an)*r2,e.y+Math.sin(an)*r2)}x.stroke();
      if(p<.5){x.globalAlpha=(1-p*2)*.9;x.drawImage(glow('#fff'),e.x-r*.5,e.y-r*.5,r,r)}x.restore()});HK.forEach(h=>h.dr&&h.dr(h));PR.forEach(drawQ);
    x.globalAlpha=E.inv>0?.28:1;aura(E,t);body(E,'#ff7a7a',t);x.globalAlpha=P.inv>0?.28:1;aura(P,t);body(P,'#7ad0ff',t);x.globalAlpha=1;if(TRN&&TR.hb)hbx();stI(E);stI(P);aimInd(P);aimInd(E);drawUL(t);finDraw();TX.forEach(q=>{x.globalAlpha=Math.min(1,q.t*2);x.font='bold '+Math.round(16/Math.max(.7,cam.z))+'px sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='#000c';x.strokeText(q.s,q.x,q.y);x.fillStyle=q.c||'#fff';x.fillText(q.s,q.x,q.y);x.globalAlpha=1});
    x.restore();
    {const hw=hc.width,hh=hc.height,hs=Math.min(hw/W,hh/H),hox=(hw-W*hs)/2,hoy=(hh-H*hs)/2;hx.setTransform(1,0,0,1,0,0);hx.clearRect(0,0,hw,Math.min(hh,hoy+115*hs));if(!cut){hx.setTransform(hs,0,0,hs,hox,hoy);bar(P,P.c.nome,1,hx);bar(E,E.c.nome,0,hx)}}
    {const r2=TRN?'TREINO · boneco '+TRN2[TR.m]+' · '+(TR.im?'imortal':'vida normal'):'ROUND '+rd+'  ·  '+P.vit+' × '+E.vit+(rst===0?'  ·  ⏱ '+Math.max(0,Math.ceil(RT-mt)):'');if(r2!==gs){gs=r2;gr.textContent=r2}}
    if(rst===1)ban(rt>.7?(TRN?'TREINAMENTO':'ROUND '+rd):(TRN?'BORA!':'LUTAR!'),'#ffd54a');else if(rst===2)ban('K.O.!','#ff5a4a',wt);
    finOv();if(cut)drawCut(t);
    raf=requestAnimationFrame(loop)};
  raf=requestAnimationFrame(loop);
}
})();
