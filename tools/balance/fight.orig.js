/* Braresults — Jogo de luta v2 · Parte 1: paisagem, menu, opções de HUD, carregamento, seleção de candidato por cargo */
(()=>{
const W=800,H=450,GY=380,G=1900,WW=1600;
const imgs={};
const getImg=u=>{if(!u)return null;if(!imgs[u]){const i=new Image();i.src=u;imgs[u]=i}const i=imgs[u];return i.complete&&i.naturalWidth?i:null};
const ST={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('fg.'+k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem('fg.'+k,JSON.stringify(v))}catch{}}};
const OPT={side:'r',size:1,bars:'k',sj:'n',ind:'s',vib:'s',lay:null,...ST.get('opt',{})};
let CAND=null,CAND2=null,ENM=null,PL=1,WP=0,AC=0,WP2=1,AC2=1,MP=0,DF=1,MD=0,run=null;
let CG='presidente',UF=(typeof S!=='undefined'&&S.uf)||'sp',Q='',LIST=[],LOADING=0,ERRM='',SHOW=60,MR=null;const LC={};
const nz=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const E=s=>esc(s);

/* ---- v1.6.2 · helpers de cor e textura ---- */
const hx3=c=>{c=String(c||'#fff');if(c[0]!=='#')return null;if(c.length===4)c='#'+c[1]+c[1]+c[2]+c[2]+c[3]+c[3];return[parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]};
const hexA=(c,a)=>{const v=hx3(c);return v?`rgba(${v[0]},${v[1]},${v[2]},${Math.max(0,Math.min(1,a))})`:c};
const shd=(c,a)=>{const v=hx3(c);if(!v)return c;const t=a<0?0:255,k=Math.abs(a);return'#'+v.map(n=>Math.round(n+(t-n)*k).toString(16).padStart(2,'0')).join('')};
const rn=i=>{const q=Math.sin(i*127.1+311.7)*43758.5453;return q-Math.floor(q)};
const GLW={},glow=c=>{if(!GLW[c]){const k=document.createElement('canvas');k.width=k.height=64;const g=k.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.2,hexA(c,.95));r.addColorStop(.55,hexA(c,.35));r.addColorStop(1,hexA(c,0));g.fillStyle=r;g.fillRect(0,0,64,64);GLW[c]=k}return GLW[c]};
const EMC={'🌙':'#8ff','🪓':'#cfd8e6','🗡️':'#cfe','🔥':'#ff8a1f','📜':'#ffe9a0','📄':'#fff','💣':'#ff9a2a','🎵':'#c9f','🌊':'#4ac8ff','✴️':'#ffe27a','⚾':'#fff','☄️':'#ff7a2a','🪨':'#c8a070'};
const PTI={P:'☄️',Z:'❄️',M:'🎯',A:'💥',D:'💨',H:'💚',S:'🛡',B:'⚡'};
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
   Esfera do Brasil (Flávio): fica na mão até lançar (botão 🚀 ou sozinha após HOLDT s) e voa reta a SBS px/s, sem teleguiar; dá p/ pular ou usar dash (iv).
   Tempestade Vermelha (Lula): STN raios em x aleatório do mapa todo, 1 a cada STI s, com aviso de STW s no chão (raio de SR px); sem teleguiar. */
const AWDUR=20,AWC=60,CUTT=2.4,HOLDT=3,SBS=400,SBR=34,STN=44,STI=.18,STW=.65,SR=46;
const AWD={flavio:{p:.2,u:80,n:'Esfera do Brasil',ic:'☄️',d:'PODER FINAL · 80 de dano · lance a esfera!',c:['#f4ffd0','#3dff6a','#0a8a3a']},lula:{p:.15,u:18,n:'Tempestade Vermelha',ic:'🌩️',d:'PODER FINAL · raios caem por todo o mapa',c:['#ffe0d0','#ff3a2a','#8a0a0a']}};
const awKind=c=>{const n=nz(c&&c.nome);return /^lula$|luiz inacio lula|lula da silva/.test(n)?'lula':/flavio.*bolsonaro/.test(n)?'flavio':''};

const mk=(x,c,face,w,a)=>{const s={spd:0,jmp:0,dmg:0,def:0,cdr:0,ls:0,hp:0,reg:0,acd:0,kbr:0,dcd:0,pdm:0,crit:0,...(a?a[2]:{})},mx=100+s.hp;
  return {x,y:GY,vx:0,vy:0,hp:mx,mx,s,W:w?{a:w[2],p:w.slice(3)}:{a:1,p:[]},cd:[0,0,0],stun:0,slow:0,sh:0,shT:0,bf:0,bfv:0,face,gr:true,c,img:c.foto,dash:0,dcd:0,blk:false,atk:0,acd:0,hit:0,ph:0,hurt:0,wi:FD.W.indexOf(w),ai:a?FD.A.indexOf(a):-1,aw:awKind(c),awT:0,awP:0,awC:AWC,ulU:0,iv:0}};
/* ---------- paisagem: se o aparelho estiver em retrato, gira a tela do jogo ---------- */
const rotP=()=>innerHeight>innerWidth;
const lay=o=>{if(rotP()){o.style.width=innerHeight+'px';o.style.height=innerWidth+'px';o.style.transform=`translate(${innerWidth}px,0) rotate(90deg)`}else{o.style.width=innerWidth+'px';o.style.height=innerHeight+'px';o.style.transform='none'}};
const rv=(dx,dy)=>rotP()?[dy,-dx]:[dx,dy];
const css=()=>{if(document.getElementById('fgcss'))return;const s=document.createElement('style');s.id='fgcss';s.textContent=`
#fgm,#fg{position:fixed;left:0;top:0;z-index:99;background:#0b0f1a;color:#fff;font:14px system-ui,sans-serif;user-select:none;-webkit-user-select:none;overflow:hidden;transform-origin:0 0}
#fgm{display:flex;flex-direction:column}#fg{touch-action:none}
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
#fgm .ttl{font-weight:900;font-size:clamp(24px,7vh,42px);letter-spacing:2px;background:linear-gradient(90deg,#ffd54a,#ff5a8a,#6ad0ff);-webkit-background-clip:text;background-clip:text;color:transparent}
#fgm .bar{width:min(320px,70%);height:12px;border-radius:8px;background:#ffffff1f;overflow:hidden}
#fgm .bar i{display:block;height:100%;width:0;background:linear-gradient(90deg,#4af,#a6f);transition:width .2s}
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
#fg #fx,#fg #fp{background:linear-gradient(#2c3558dd,#0b0f1add)!important;border:1px solid #ffffff66!important;box-shadow:inset 0 1px 0 #ffffff55,0 3px 8px #0007;font-weight:700}
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
#fgm .hudtb .c{font-size:13px;padding:6px 10px}`;document.head.appendChild(s)};
const mkRoot=id=>{css();const o=document.createElement('div');o.id=id;lay(o);o._l=()=>lay(o);addEventListener('resize',o._l);document.body.appendChild(o);return o};
const kill=o=>{removeEventListener('resize',o._l);o.remove()};
const shell=h=>{if(!MR){MR=mkRoot('fgm');MR.addEventListener('click',onClick);MR.addEventListener('input',onInput);MR.addEventListener('change',onChange)}MR.innerHTML=h;return MR};
const closeMenu=()=>{if(MR){kill(MR);MR=null}};
const lock=f=>{try{const o=screen.orientation;if(o){const p=f?o.lock('landscape'):o.unlock();p&&p.catch&&p.catch(()=>{})}}catch(e){}};
const openFight=()=>{if(run||MR)return;lock(1);screenMenu()};
const exitFight=()=>{closeMenu();lock(0)};

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
const screenMenu=()=>shell(`<div class="cen" style="background:radial-gradient(circle at 50% 30%,#2b1a5a,#0b0f1a 70%)"><div style="font-size:clamp(32px,11vh,60px);line-height:1">🥊</div><div class="ttl">LUTA DE CANDIDATOS</div><div class="row" style="justify-content:center"><button class="b" data-a="play" style="min-width:170px">▶ Jogar</button><button class="b s" data-a="opts" style="min-width:170px">⚙ Opções</button></div><button class="c" data-a="exit">← Voltar ao app</button></div>`);

const chips=(k,cur,arr)=>`<div class="row">${arr.map(([v,n])=>`<button class="c${String(cur)===String(v)?' on':''}" data-a="opt" data-k="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
const preview=()=>{const s=OPT.size,R=OPT.side==='r',d=n=>Math.round(n*s),sd=R?'left':'right',bs=R?'right':'left',c=OPT.bars==='c';
  const dot=(x,y,z)=>`<i style="position:absolute;${bs}:${x}px;bottom:${y}px;width:${z}px;height:${z}px;border-radius:50%;background:#ffffff40;border:1px solid #fff8"></i>`;
  const bar=(l)=>`<i style="position:absolute;top:${c?22:6}px;${l?'left':'right'}:${c?'calc(50% + 4px)':'8px'};${c&&l?'left:auto;right:calc(50% + 4px)':''}width:90px;height:8px;border-radius:4px;background:#4c6"></i>`;
  return `<div style="position:relative;height:130px;border-radius:12px;background:linear-gradient(#2a3a6a,#1a2a1a);overflow:hidden;border:1px solid #fff3"><i style="position:absolute;${sd}:10px;bottom:8px;width:${d(46)}px;height:${d(46)}px;border-radius:50%;background:#ffffff25;border:2px solid #fff6"></i>${dot(10,8,d(30))}${dot(46,6,d(22))}${dot(10,50,d(20))}${dot(40,44,d(20))}${dot(70,30,d(20))}${bar(1)}${bar(0)}<span style="position:absolute;left:50%;top:4px;transform:translateX(-50%);font-size:9px;background:#0008;padding:1px 6px;border-radius:6px">✕ Sair</span></div>`};
const screenOpts=()=>shell(`<div class="top"><button class="c" data-a="menu">← Voltar</button><b>Opções · posição do HUD</b></div><div class="body"><div class="col" style="flex:1;overflow-y:auto"><button class="b" data-a="hud" style="font-size:14px;padding:10px 14px">🎛 Editar botões livremente</button><div class="lb" style="margin-top:-2px">Arraste e redimensione cada botão (1 jogador).${OPT.lay?' <b style="color:#ffd54a">Layout personalizado ativo.</b>':''}</div><div class="lb">Controles (padrão)</div>${chips('side',OPT.side,[['r','🕹 Joystick à esquerda'],['l','🕹 Joystick à direita']])}<div class="lb">Tamanho dos botões</div>${chips('size',OPT.size,[[.85,'Pequeno'],[1,'Médio'],[1.2,'Grande']])}<div class="lb">Barras de vida</div>${chips('bars',OPT.bars,[['k','Nos cantos'],['c','No centro']])}<div class="lb">Mira: indicador na tela</div>${chips('ind',OPT.ind,[['s','Mostrar'],['n','Esconder']])}<div class="lb">Pular empurrando o joystick pra cima</div>${chips('sj',OPT.sj,[['n','Desligado (mira)'],['s','Ligado']])}<div class="lb">Vibração ao tocar</div>${chips('vib',OPT.vib,[['s','Ligada'],['n','Desligada']])}</div><div class="col" style="flex:1"><div class="lb">Pré-visualização</div>${preview()}</div></div><div class="fgf"><span style="flex:1;font-size:11px;opacity:.7">As opções são salvas automaticamente.</span><button class="b" data-a="menu">Pronto</button></div>`);


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
const screenSetup=()=>{shell(`<div class="top"><button class="c" data-a="menu">← Menu</button><b>Escolha seu lutador</b></div><div class="body"><div class="col" style="flex:1.3"><div class="row" id="fgcg"></div><div class="row" id="fgsr" style="flex-wrap:nowrap"></div><div id="fgl" class="lst"></div></div><div class="col" id="fgr" style="flex:1;overflow-y:auto"></div></div><div class="fgf"><span id="fgmsg" style="flex:1;font-size:12px;color:#ffd54a"></span><button class="b" data-a="go">▶ LUTAR</button></div>`);paintTop();paintRight();loadList()};
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
const card=(n,c)=>`<button class="pc${PL===n?' on':''}" data-a="pl" data-v="${n}">${av(c)}<span><b>${MD?'Jogador '+n+': ':''}${c?E(c.nome):'— escolha na lista —'}</b><br><small>${c?E(c.partido||''):''}</small>${c&&awKind(c)?'<br><small style="color:#ffd54a">🔥 Despertar disponível</small>':''}</span></button>`;
const PK={w:[0,0],a:[0,0],m:0};let PI=null;
{const z=ST.get('sel',null);if(z){CAND=z.CAND||null;CAND2=z.CAND2||null;WP=z.WP|0;AC=z.AC|0;WP2=z.WP2|0;AC2=z.AC2|0;MP=z.MP|0;DF=z.DF??1;MD=z.MD|0;CG=z.CG||CG;UF=z.UF||UF;if(z.PK)Object.assign(PK,z.PK)}}
const kv=k=>k==='m'?MP:k==='w'?(PL===1?WP:WP2):(PL===1?AC:AC2);
const lst=k=>k==='w'?FD.W:k==='a'?FD.A:FD.M;
const nmk={w:'a arma',a:'o acessório',m:'o mapa'};
const slot=(k,lbl)=>{const done=k==='m'?PK.m:PK[k][PL-1],it=lst(k)[kv(k)];return `<button class="pc" data-a="slot" data-k="${k}"><span style="font-size:26px;width:46px;text-align:center">${done?(k==='m'?it[0]:FS.tag(k,kv(k),34)):'❔'}</span><span><b>${done?E(it[1]):'Selecione '+nmk[k]}</b><br><small>${done?'Toque para trocar':lbl}</small></span></button>`};
const paintRight=()=>{if(!MR)return;const r=MR.querySelector('#fgr');if(!r)return;
  r.innerHTML=`<div class="row">${[[0,'🤖 vs CPU'],[1,'👥 vs amigo']].map(([v,n])=>`<button class="c${MD===v?' on':''}" data-a="md" data-v="${v}">${n}</button>`).join('')}</div>${card(1,CAND)}${MD?card(2,CAND2):''}
  <div class="lb">Equipamento${MD?' do jogador '+PL:''}</div>${slot('w','Escolha o poder do lutador')}${slot('a','Ganhe um bônus')}
  <div class="lb">Arena</div>${slot('m','Escolha onde lutar')}
  ${MD?'':`<div class="lb">Dificuldade da CPU</div><div class="row">${['😊 Fácil','😐 Normal','😈 Difícil'].map((n,i)=>`<button class="c${DF===i?' on':''}" data-a="df" data-v="${i}">${n}</button>`).join('')}</div>`}`;
  const t=MR.querySelector('#fgmsg');if(t)t.textContent=''};
const pw=p=>`${(FD.PD[p[6]]||FD.T[p[1]]).replace('{d}',p[2]).replace('{e}',p[4]).replace('{s}',p[5])} · recarga ${p[3]}s`;
function screenPick(){const{k,i,info}=PI,L=lst(k),it=L[i],ttl={w:'Selecione a arma',a:'Selecione o acessório',m:'Selecione o mapa'}[k];let st;
  if(k==='m')st=`<div style="display:flex;flex-direction:column;align-items:center;gap:6px;min-height:0"><canvas id="fgpv" width="400" height="225" style="max-width:100%;max-height:60vh;border-radius:12px;border:2px solid #fff4"></canvas><b style="font-size:16px">${it[0]} ${E(it[1])}</b><small style="opacity:.7">${it[7].length} plataforma${it[7].length>1?'s':''}</small></div>`;
  else{const det=k==='w'?`<b>${E(it[1])}</b> · soco ×${it[2]}<br><br>`+it.slice(3).map((p,n)=>`<b>Poder ${n+1}: ${E(p[0])}</b><br><small>${pw(p)}</small>`).join('<br>'):`<b>${E(it[1])}</b><br><br>${FD.desc(it[2]).split(', ').map(x=>'• '+E(x)).join('<br>')}`;
    st=`<div style="display:flex;align-items:center;gap:14px;min-height:0;max-width:100%"><div style="text-align:center"><button data-a="pinfo" style="background:#ffffff12;border:2px solid ${info?'#4af':'#fff3'};border-radius:20px;font-size:min(20vh,84px);line-height:1.1;padding:6px 16px">${FS.tag(k,i,0,'width:min(20vh,90px);height:min(20vh,90px);display:block')}</button><div style="font-weight:800;margin-top:4px">${E(it[1])}</div><small style="opacity:.7">${info?'Toque para fechar':'Toque no ícone p/ detalhes'}</small></div>${info?`<div style="font-size:12px;line-height:1.35;background:#ffffff10;border-radius:12px;padding:8px 10px;overflow-y:auto;max-height:62vh;max-width:50%">${det}</div>`:''}</div>`}
  shell(`<div class="top"><button class="c" data-a="pback">← Voltar</button><b>${ttl}</b><span style="font-size:12px;opacity:.7">${i+1}/${L.length}</span></div><div class="body" style="align-items:center"><button class="b s" data-a="pnav" data-v="-1" style="padding:20px 14px;font-size:22px">◀</button><div class="cen" style="flex:1">${st}</div><button class="b s" data-a="pnav" data-v="1" style="padding:20px 14px;font-size:22px">▶</button></div><div class="fgf"><span style="flex:1"></span><button class="b" data-a="pok">✔ Escolher</button></div>`);
  if(k==='m'){const c=MR.querySelector('#fgpv'),x=c.getContext('2d');x.scale(.5,.5);paintMap(x,i,0)}}
const pickDone=()=>{const{k,i}=PI;if(k==='m'){MP=i;PK.m=1}else if(k==='w'){PL===1?WP=i:WP2=i;PK.w[PL-1]=1}else{PL===1?AC=i:AC2=i;PK.a[PL-1]=1}PI=null;screenSetup()};
async function loadList(force){const k=key();if(LC[k]&&!force){LIST=LC[k];ERRM='';LOADING=0;if(!CAND&&LIST[0])CAND=LIST[0];paintList();paintRight();return}
  LOADING=1;ERRM='';LIST=[];paintList();
  try{const r=await one(CG,1,CG==='presidente'?'':UF,'');LC[k]=r.c}
  catch(e){if(typeof D!=='undefined'&&D&&D.cargo===CG&&D.c&&D.c.length&&(CG==='presidente'||S.uf===UF))LC[k]=D.c;else ERRM=e&&e.st?'Candidatos ainda não disponíveis no TSE para esta seleção.':'Falha de conexão: '+(e&&e.message||e)}
  if(key()!==k)return;LOADING=0;LIST=LC[k]||[];if(!CAND&&LIST[0])CAND=LIST[0];paintList();paintRight()}
const rndEnemy=()=>{const l=LIST.filter(x=>!(CAND&&x.id===CAND.id)&&!(CAND2&&x.id===CAND2.id));return l.length?l[Math.random()*l.length|0]:{id:0,nome:'Adversário',partido:'',foto:''}};
const say=m=>{const t=MR&&MR.querySelector('#fgmsg');if(t)t.textContent=m};

function screenLoad(){ENM=MD?null:rndEnemy();
  const urls=[CAND&&CAND.foto,MD&&CAND2&&CAND2.foto,ENM&&ENM.foto].filter(Boolean),tasks=[['Preparando a arena…',()=>new Promise(r=>setTimeout(r,250))],...urls.map(u=>['Carregando lutadores…',()=>new Promise(r=>{const i=new Image();i.onload=i.onerror=()=>r();i.src=u;imgs[u]=i;setTimeout(r,3500)})]),['Montando armas e acessórios…',()=>new Promise(r=>setTimeout(r,250))],['Ajustando controles…',()=>new Promise(r=>setTimeout(r,250))]];
  shell(`<div class="cen" style="background:radial-gradient(circle at 50% 30%,#1a2a5a,#0b0f1a 70%)"><div style="font-size:42px">🥊</div><div class="ttl" style="font-size:clamp(20px,6vh,32px)">CARREGANDO</div><div class="bar"><i id="fgp"></i></div><div id="fgls" style="font-size:12px;opacity:.8">Iniciando…</div></div>`);
  (async()=>{for(let i=0;i<tasks.length;i++){if(!MR)return;MR.querySelector('#fgls').textContent=tasks[i][0];await tasks[i][1]();if(!MR)return;MR.querySelector('#fgp').style.width=Math.round((i+1)/tasks.length*100)+'%'}await new Promise(r=>setTimeout(r,200));if(MR)start()})()}

/* ---------- eventos do menu ---------- */
function onClick(e){const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,v=t.dataset.v;
  const A={play:screenSetup,opts:screenOpts,menu:screenMenu,exit:exitFight,
    hud:screenHud,hreset:()=>{OPT.lay=null;ST.set('opt',OPT);hudPaint()},hsz:()=>{const c=hudEnsure(HSEL);c.s=clampN(Math.round(((c.s||1)+.1*+v)*100)/100,.5,2.2);ST.set('opt',OPT);hudPaint()},
    opt:()=>{OPT[t.dataset.k]=t.dataset.k==='size'?+v:v;ST.set('opt',OPT);screenOpts()},
    cg:()=>{CG=v;Q='';SHOW=60;paintTop();loadList()},
    pl:()=>{PL=+v;paintRight();paintList()},
    md:()=>{MD=+v;if(!MD)PL=1;paintRight();paintList()},
    df:()=>{DF=+v;paintRight()},
    pick:()=>{const c=LIST[+v];if(!c)return;if(PL===1)CAND=c;else CAND2=c;paintRight();paintList();if(MD&&PL===1&&!CAND2){PL=2;paintRight();paintList()}},
    more:()=>{SHOW+=60;paintList()},slot:()=>{PI={k:t.dataset.k,i:kv(t.dataset.k),info:0};screenPick()},pnav:()=>{const n=lst(PI.k).length;PI.i=(PI.i+ +v+n)%n;screenPick()},pinfo:()=>{PI.info=PI.info?0:1;screenPick()},pok:pickDone,pback:()=>{PI=null;screenSetup()},retry:()=>loadList(true),
    go:()=>{if(!CAND)return say('Escolha um candidato na lista.');if(MD&&!CAND2)return say('Jogador 2: escolha um candidato.');{const bad=[0,MD?1:0].map(n=>!PK.w[n]?'a arma':!PK.a[n]?'o acessório':'').map((x,n)=>x?(MD?'Jogador '+(n+1)+': ':'')+'selecione '+x:'').find(Boolean)||(!PK.m?'Selecione o mapa.':'');if(bad)return say(bad);ST.set('sel',{CAND,CAND2,WP,AC,WP2,AC2,MP,DF,MD,CG,UF,PK});screenLoad()}}};
  (A[a]||(()=>{}))()}
function onInput(e){if(e.target.id==='fgq'){Q=e.target.value;SHOW=60;paintList()}}
function onChange(e){const t=e.target,a=t.dataset.a,v=t.value;
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
  o.innerHTML=`<canvas id="fgc" style="width:100%;height:100%;display:block"></canvas><button id="fx" style="position:absolute;top:5px;left:50%;transform:translateX(-50%);padding:6px 14px;font-size:12px;border-radius:10px;background:#0008;color:#fff;border:1px solid #fff4;z-index:2">✕ Sair</button><button id="fp" style="position:absolute;top:5px;left:calc(50% + 44px);padding:6px 14px;font-size:12px;border-radius:10px;background:#0008;color:#fff;border:1px solid #fff4;z-index:2">⏸</button>`;
  document.body.appendChild(o);o.addEventListener('contextmenu',e=>e.preventDefault());
  const mkCtl=(i,host,L,wp)=>{const K={l:0,r:0,jump:0,dash:0,blk:0,atk:0,ax:0,tm:0,ta:0,ku:0,kd:0};KS[i]=K;
    const btn=(t,s,css,cls)=>{host.insertAdjacentHTML('beforeend',`<button class="fb ${cls||''}" style="position:absolute;width:${s}px;height:${s}px;font-size:${Math.round(s*.44)}px;${css}">${t}</button>`);return host.lastElementChild};
    const vib=()=>{if(OPT.vib==='s'&&navigator.vibrate)try{navigator.vibrate(8)}catch(_){}};
    const flash=e=>{e.classList.add('on');setTimeout(()=>e.classList.remove('on'),140)};
    const hold=(e,k)=>{e.addEventListener('pointerdown',ev=>{ev.preventDefault();e.setPointerCapture(ev.pointerId);K[k]=1;e.classList.add('on');vib()});const up=()=>{e.classList.remove('on');if(k==='blk')K.blk=0};e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up);e.addEventListener('lostpointercapture',up)};
    L.b.forEach(([k,t,s,css])=>hold(btn(t,s,css,'k-'+k),k));
    pbs[i]=[0,1,2].map(n=>{const e=btn('<span class="pl">'+wp[3+n][0]+'</span><b class="pi">'+(PTI[wp[3+n][1]]||'⚡')+'</b><i class="cdv"></i>',L.pz?L.pz[n]:L.ps,L.p[n],'pw');e.addEventListener('pointerdown',ev=>{ev.preventDefault();flash(e);vib();cast(FT[i],FT[1-i],n)});return e});
    const ak=awKind(i?(CAND2||c):c);if(ak){const sp='<span class="pl">…</span>',bc='border-color:'+AWD[ak].c[1]+';border-width:3px;';
      abs[i]=[btn(sp,L.az||L.ps,L.a+';'+bc,'aw'),btn(sp,L.uz||L.ps,L.u+';'+bc,'aw')];
      abs[i][0].addEventListener('pointerdown',ev=>{ev.preventDefault();flash(abs[i][0]);vib();awaken(FT[i])});abs[i][1].addEventListener('pointerdown',ev=>{ev.preventDefault();flash(abs[i][1]);vib();ult(FT[i],FT[1-i])})}
    host.insertAdjacentHTML('beforeend',`<div class="jy" style="position:absolute;${L.j};width:${L.js}px;height:${L.js}px"><div class="jk" style="left:${L.js*.29}px;top:${L.js*.29}px;width:${L.js*.42}px;height:${L.js*.42}px"></div></div>`);
    const j=host.lastElementChild,kn=j.firstElementChild,jm=ev=>{const r=j.getBoundingClientRect(),h=L.js/2,dd=rv(ev.clientX-(r.left+r.width/2),ev.clientY-(r.top+r.height/2)),dx=dd[0],dy=dd[1],d=Math.hypot(dx,dy)||1,m=Math.min(d,h*.7);kn.style.transform=`translate(${dx/d*m}px,${dy/d*m}px)`;K.ax=Math.abs(dx)>h*.2?(dx>0?1:-1):0;K.tm=d>h*.3?1:0;K.ta=Math.abs(dy)<h*.14?0:Math.max(-1.3,Math.min(1.3,Math.atan2(-dy,Math.abs(dx))));if(OPT.sj==='s'&&dy<-h*.6)K.jump=1};
    j.addEventListener('pointerdown',ev=>{ev.preventDefault();j.setPointerCapture(ev.pointerId);j.classList.add('on');vib();jm(ev)});j.addEventListener('pointermove',ev=>{if(j.hasPointerCapture(ev.pointerId))jm(ev)});
    const jr=()=>{K.ax=0;K.tm=0;kn.style.transform='';j.classList.remove('on')};j.addEventListener('pointerup',jr);j.addEventListener('pointercancel',jr);j.addEventListener('lostpointercapture',jr)};
  const hostCss=(side)=>`position:absolute;bottom:env(safe-area-inset-bottom,0px);${side===2?'left:0;right:0;height:100%':'width:50%;height:150px;'+(side?'right:0;border-left:1px solid #fff3':'left:0')}`;
  const mkHost=side=>{o.insertAdjacentHTML('beforeend',`<div style="${hostCss(side)}"></div>`);return o.lastElementChild};
  const pvpL=i=>{const z=Math.min(OPT.size,1),s=Math.round(sz*z),g=s+4,a=i?'right':'left',o=n=>`${a}:${n}px`,js=Math.round(96*z),b0=js+16;
    return{j:`${a}:6px;bottom:6px`,js,ps:s,a:`${o(b0)};bottom:${2*s+18}px`,u:`${o(b0+g)};bottom:${2*s+18}px`,p:[0,1,2].map(n=>`${o(b0+n*g)};bottom:${s+10}px`),b:[['jump','⤒',s,`${o(b0)};bottom:6px`],['dash','💨',s,`${o(b0+g)};bottom:6px`],['blk','🛡',s,`${o(b0+2*g)};bottom:6px`],['atk','👊',s+8,`${o(b0+3*g)};bottom:6px`]]}};
  if(pvp){[0,1].forEach(i=>mkCtl(i,mkHost(i),pvpL(i),FD.W[i?WP2:WP]))}
  else mkCtl(0,mkHost(2),soloL(),FD.W[WP]);
  const K=KS[0],K2=KS[1];
  const key=(KK,i,m,k,v)=>{if(k===m[9])KK.ku=v;if(k===m[10])KK.kd=v;if(v&&k===m[7])awaken(FT[i]);if(v&&k===m[8])ult(FT[i],FT[1-i]);if(k===m[0])KK.l=v;if(k===m[1])KK.r=v;if(v&&k===m[2])KK.jump=1;if(v&&k===m[3])KK.atk=1;if(v&&k===m[4])KK.dash=1;if(k===m[5])KK.blk=v;if(v){const n=m[6].indexOf(k);if(n>=0)cast(FT[i],FT[1-i],n)}};
  const kd=e=>{const v=e.type==='keydown'?1:0,k=e.key.toLowerCase();key(K,0,['a','d','w','j','k','l','123','q','e','r','f'],k,v);
    if(pvp)key(K2,1,['arrowleft','arrowright','arrowup',',','.','/','890','m','n','o','p'],k,v);else{if(k==='arrowleft')K.l=v;if(k==='arrowright')K.r=v;if(v&&k==='arrowup')K.jump=1}};
  addEventListener('keydown',kd);addEventListener('keyup',kd);

  const cv=o.querySelector('#fgc'),x=cv.getContext('2d');
  const fit=()=>{const d=Math.min(devicePixelRatio||1,1.5);cv.width=o.clientWidth*d;cv.height=o.clientHeight*d};fit();addEventListener('resize',fit);
  const P=mk(400,c,1,FD.W[WP],FD.A[AC]),E=pvp?mk(1200,CAND2||c,-1,FD.W[WP2],FD.A[AC2]):mk(1200,ENM||rndEnemy(),-1,FD.W[Math.random()*20|0],FD.A[Math.random()*25|0]);FT.push(P,E);P.vit=E.vit=0;let last=performance.now(),raf,paused=0;
  const stop=back=>{cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',kd);removeEventListener('resize',fit);kill(o);run=null;if(back!==0)screenSetup()};
  o.querySelector('#fx').onclick=()=>stop();o.querySelector('#fp').onclick=e=>{paused=!paused;e.target.textContent=paused?'▶':'⏸'};run=1;

  const M={pl:FD.M[MP][7].map(q=>{const w=Math.round(q[1]*1.3),c=(q[0]+q[1]/2)*2;return[Math.round(c-w/2),w,q[2]]})},PR=[],FX=[],LV=[{r:.35,b:.25,a:.5},{r:.2,b:.5,a:.75},{r:.1,b:.75,a:1}][DF];let over2=1,mt=0,cut=null,shk=0,rd=1,rst=1,rt=1.9,wt='';const KOT=2.8,cam={x:WW/2,y:GY-100,z:1,i:0};const UL=[],TX=[];
  const SP=f=>230*(1+f.s.spd)*(f.bf>0?1+f.bfv:1)*(f.slow>0?.5:1);
  const flop=(t,dir,kb)=>{if(kb<80)return;t.rag=Math.max(t.rag||0,.15+kb/1400);if(t.rg)t.rg.forEach((p,i)=>{if(i!==2){p.vx+=dir*kb*(.35+Math.random()*.7);p.vy-=kb*.45*Math.random()}});if(kb>=250)shk=Math.min(9,shk+kb/55)};
  const hitF=(a,t,b,k,st,kb,dir)=>{dir=dir||a.face;const o=a._o||{};if(t.dig>0)return;if(t.dg>0&&!o.ap){t.dg=0;t.bf=2.5;t.bfv=.4;dodge(t);return}let d=b*(1+a.s.dmg)*(k==='p'?1+a.s.pdm:1)*(a.dd>0?1.3:1)*(a.wk>0?.75:1)*(t.mk>0?1.35:1)*(t.fu>0?1.1:1);if(a.nx>0){a.nx=0;a.inv=0;d*=1.6}if(Math.random()<a.s.crit)d*=2;if(!o.ap)d*=1-t.s.def;if(t.cn>0){t.cn=0;a.hp-=d;a.stun=Math.max(a.stun,.7);a.hurt=.3;ring(t.x,t.y-45,70,'#ffd54a');txt(a,'REFLETIDO!','#ffd54a');return}if(t.ice>0)a.slow=Math.max(a.slow,2);
    if(!o.gb&&t.blk&&t.face===-dir){t.hp-=Math.max(1,d*.1);t.vx=dir*80;return}
    if(!o.ap&&!o.gb&&t.sh>0){const q=Math.min(t.sh,d);t.sh-=q;d-=q}
    t.hp-=d;a.hp=Math.min(a.mx,a.hp+d*a.s.ls);t.vx=dir*kb*(1-t.s.kbr);if(kb){t.vy=-220*(1-t.s.kbr);t.gr=false}t.hurt=.25;t.hit=.2;if(st)t.stun=Math.max(t.stun,st);flop(t,dir,kb)};
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
  const aimA=(f,t)=>{if(f.mn)return clampA(f.am||0);const dx=(t.x-f.x)*f.face;if(dx<30)return 0;let a=Math.atan2((f.y-48)-(t.y-45),dx);if(!(f===P||(pvp&&f===E)))a+=(Math.random()-.5)*[.3,.16,.07][DF];return clampA(Math.max(-.6,Math.min(.9,a)))};
  const setAim=(f,k)=>{if(k.ku||k.kd){f.mn=1;f.am=(k.ku?.9:0)-(k.kd?.9:0)}else if(k.tm){f.mn=1;f.am=k.ta||0}else f.mn=0};
  const hit=(f,t,d,st,kb,dir,o)=>{f._o=o||null;hitF(f,t,d,'p',st||0,kb==null?200:kb,dir||sdir(f,t));f._o=null};
  const dotE=(f,t,k,dps,sec)=>{t.dot=(t.dot||[]).filter(q=>q.k!==k);t.dot.push({k,t:sec,v:dps*(1+f.s.dmg)*(1-t.s.def)})};
  const dashAt=(f,d,s,v,o)=>{o=o||{};f.dash=o.dur||.22;f.iv=o.iv||.3;f.vx=f.face*v;f.dm=[d,s||0];f.dmh=0;f.dmo=o.gb?{gb:1}:null;f.dmf=o.fn||null};
  const clampX=v=>Math.max(40,Math.min(WW-40,v));
  const strike=(px,py,r,delay,fn,c)=>hk((dt,h)=>{h.t+=dt;if(h.t>=delay){fn();return 1}},h=>{const a=Math.min(1,h.t/delay);x.save();x.strokeStyle=x.fillStyle=c||'#ff5a3a';x.lineWidth=3;x.globalAlpha=.25+.4*a;x.beginPath();x.ellipse(px,py-2,r,r*.28,0,0,7);x.stroke();x.globalAlpha=.1+.25*a;x.fill();x.restore()});
  const bolt=(px,py)=>hk((dt,h)=>{h.t+=dt;return h.t>=.2},()=>{x.save();x.strokeStyle='#fff';x.shadowColor='#9cf';x.shadowBlur=12;x.lineWidth=4;x.beginPath();for(let y=-400;y<py;y+=40)x.lineTo(px+(Math.random()-.5)*34,y);x.lineTo(px,py);x.stroke();x.restore()});
  const zap=(x1,y1,x2,y2,life,col)=>hk((dt,h)=>{h.t+=dt;return h.t>=life},()=>{x.save();x.strokeStyle=col||'#fff';x.shadowColor=col||'#9cf';x.shadowBlur=10;x.lineWidth=4;x.beginPath();x.moveTo(x1,y1);for(let n=1;n<8;n++)x.lineTo(x1+(x2-x1)*n/8,y1+(y2-y1)*n/8+(Math.random()-.5)*16);x.lineTo(x2,y2);x.stroke();x.restore()});
  const fire=(f,t,px,py,r,sec)=>hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;if(h.k>=.3){h.k=0;if(Math.abs(t.x-px)<r&&Math.abs(t.y-py)<60){hit(f,t,3,0,0,sdir({x:px},t));dotE(f,t,'🔥',3,2)}}return h.t>=sec},h=>{x.save();x.globalCompositeOperation='lighter';for(let n=0;n<8;n++){const u=((n*.19+h.t*1.6)%1);x.globalAlpha=(1-u)*.8;x.fillStyle=n%2?'#ff6a1a':'#ffd84a';x.beginPath();x.arc(px+(n/7-.5)*r*1.7,py-u*34,7*(1-u)+2,0,7);x.fill()}x.restore()});
  const shot2=(f,o)=>{const th=f.ca||0,c=Math.cos(th),sn=Math.sin(th),sx=f.x+f.face*26*c,sy=f.y-48-26*sn,q=Object.assign({o:f,x:sx,y:sy,x0:sx,vy:0,d:10,st:0,sl:0,t:1.6,dir:f.face,a:0,sz:14},o),lx=o.sp||520,ly=o.vy||0;q.vx=f.face*(lx*c+ly*sn);q.vy=ly*c-lx*sn;q.by=q.y;PR.push(q);return q};
  const blast=(q,px,py)=>{const f=q.o,t=foe(f),r=q.ex;FX.push({x:px,y:py,r,t:.35,c:q.c||'#ff9a3a'},{x:px,y:py,r:r*.6,t:.3,c:'#ffd84a'});shk=Math.min(9,shk+2);if(Math.abs(t.x-px)<r+20&&Math.abs(t.y-45-py)<r+40){hit(f,t,q.d,q.st,q.kb==null?300:q.kb,sdir({x:px},t));if(q.oh)q.oh(f,t,q)}};
  const updPR=dt=>{for(let i=PR.length-1;i>=0;i--){const q=PR[i],t=foe(q.o);let rm=0;q.a+=dt;q.t-=dt;q.x+=q.vx*dt;
    if(q.g)q.vy+=q.g*dt;q.by+=q.vy*dt;q.y=q.by+(q.sw?Math.sin(q.a*q.sw[1]+q.sw[2])*q.sw[0]:0);if(!q.g&&(q.by>GY-6||q.by<-600))rm=q.ex?2:1;
    if(q.g&&q.by>=GY-8&&q.vy>0){if(q.bn>0){q.bn--;q.by=GY-9;q.vy=-q.vy*.72;if(q.bf)q.bf(q)}else rm=q.ex?2:1}
    if(q.rt&&!q.rr&&q.a>=q.rt){q.rr=1;q.vx=-q.vx;q.vy=-q.vy;q.hh=0;q.dir=-q.dir}
    if(q.rr&&Math.abs(q.x-q.o.x)<30&&Math.abs(q.y-(q.o.y-48))<70)rm=1;
    if(q.x<0||q.x>WW){if(q.wb>0){q.wb--;q.vx=-q.vx;q.dir=-q.dir;q.x=Math.max(1,Math.min(WW-1,q.x))}else rm=1}
    if(q.fz&&q.a>=q.fz)rm=2;
    if(!rm&&!q.hh&&Math.abs(q.x-t.x)<(q.hw||26)&&Math.abs(q.y-(t.y-45))<(q.hv||50)){
      if(q.ex)rm=2;else{let d=q.d;if(q.ds)d*=1+Math.min(1,Math.abs(q.x-q.x0)/q.ds);if(q.oh)q.oh(q.o,t,q);hit(q.o,t,d,q.st,q.kb==null?260:q.kb,q.dir,q);if(q.sl)t.slow=Math.max(t.slow,q.sl);q.hh=1;if(!q.pi&&!q.rt)rm=1}}
    if(q.t<=0&&!rm)rm=1;
    if(rm===2)blast(q,q.x,q.y);
    if(rm)PR.splice(i,1)}};
  const drawQ=q=>{x.save();const sp=Math.hypot(q.vx,q.vy)||1,ux=q.vx/sp,uy=q.vy/sp,tm=performance.now();
    if(q.ln){const L=q.ln,c=q.c||'#ffd54a',tx=q.x-ux*L,ty=q.y-uy*L,gg=x.createLinearGradient(tx,ty,q.x,q.y);gg.addColorStop(0,hexA(c,0));gg.addColorStop(.7,hexA(c,.7));gg.addColorStop(1,'#fff');
      x.lineCap='round';x.strokeStyle=gg;x.lineWidth=5;x.beginPath();x.moveTo(tx,ty);x.lineTo(q.x,q.y);x.stroke();x.globalCompositeOperation='lighter';x.strokeStyle=hexA(c,.5);x.lineWidth=9;x.beginPath();x.moveTo(tx+ux*L*.4,ty+uy*L*.4);x.lineTo(q.x,q.y);x.stroke();x.globalAlpha=.9;x.drawImage(glow(c),q.x-13,q.y-13,26,26);x.globalCompositeOperation='source-over';x.globalAlpha=1;x.strokeStyle='#fff';x.lineWidth=1.6;x.beginPath();x.moveTo(q.x-ux*L*.35,q.y-uy*L*.35);x.lineTo(q.x,q.y);x.stroke()}
    else if(q.em){const c=EMC[q.em]||q.c||(q.z?'#8cf':'#ffd54a'),R=(q.sz+8)*1.2,tr=q.tr||(q.tr=[]),lt=tr[tr.length-1];if(!lt||Math.hypot(lt.x-q.x,lt.y-q.y)>7){tr.push({x:q.x,y:q.y});if(tr.length>9)tr.shift()}
      x.globalCompositeOperation='lighter';tr.forEach((p,n)=>{const k=(n+1)/tr.length;x.globalAlpha=.45*k;const r=R*(.35+.6*k);x.drawImage(glow(c),p.x-r,p.y-r,r*2,r*2)});
      x.globalAlpha=.85+.15*Math.sin(tm/60);x.drawImage(glow(c),q.x-R*1.25,q.y-R*1.25,R*2.5,R*2.5);x.globalCompositeOperation='source-over';x.globalAlpha=1;
      x.font=(q.sz+8)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.translate(q.x,q.y);if(q.spn)x.rotate(q.a*14);x.shadowColor=c;x.shadowBlur=10;x.fillText(q.em,0,0)}
    else{const c=q.z?'#8cf':'#ffd54a',pu=1+.12*Math.sin(tm/50);x.globalCompositeOperation='lighter';x.globalAlpha=.9;x.drawImage(glow(c),q.x-16*pu,q.y-16*pu,32*pu,32*pu);x.globalCompositeOperation='source-over';x.globalAlpha=1;const og=x.createRadialGradient(q.x-2,q.y-2,1,q.x,q.y,7.5);og.addColorStop(0,'#fff');og.addColorStop(.45,c);og.addColorStop(1,shd(c,-.4));x.fillStyle=og;x.beginPath();x.arc(q.x,q.y,7,0,7);x.fill();x.strokeStyle=hexA('#fff',.6);x.lineWidth=1;x.stroke()}x.restore()};
  const STK=['mk','wk','dd','fu','sil','dz','rt','ice','dg','cn','nx','inv','cdx','dig','rgn'];
  const stat=(f,dt)=>{STK.forEach(k=>{if(f[k]>0)f[k]=Math.max(0,f[k]-dt)});if(f.dot&&f.dot.length){f.dot.forEach(q=>{q.t-=dt;f.hp-=q.v*dt});f.dot=f.dot.filter(q=>q.t>0)}};
  const stI=f=>{if(f.dead)return;let s='';(f.dot||[]).forEach(q=>{if(!s.includes(q.k))s+=q.k});
    [['sil','🔇'],['dz','😵'],['rt','⛓️'],['mk','🎯'],['wk','📉'],['slow','🥶'],['cn','🔰'],['dg','💨'],['ice','🧊'],['nx','🗡️'],['cdx','🎸'],['dd','😡'],['rgn','💚']].forEach(([k,e])=>{if(f[k]>0&&!(k==='rt'&&f.dig>0))s+=e});
    if(!s)return;x.save();x.font='15px sans-serif';x.textAlign='center';x.fillText(s,f.x,f.y-112);x.restore()};
  const PW={
    swSpin:(f,t,d,e,s)=>{ring(f.x,f.y-40,e,'#cfe');let n=0;for(let j=PR.length-1;j>=0;j--)if(PR[j].o!==f&&Math.abs(PR[j].x-f.x)<e*1.5&&Math.abs(PR[j].y-f.y)<120){PR.splice(j,1);n++}if(n)txt(f,'PARRY!','#9ff');if(nr(f,t,e))hit(f,t,d,s,300)},
    swWave:(f,t,d,e)=>shot2(f,{d,sp:e,pi:1,hw:40,hv:75,sz:36,kb:180,t:1.2,em:'🌙'}),
    swLunge:(f,t,d,e,s)=>dashAt(f,d,s,850,{iv:.35,fn:(a,b)=>dotE(a,b,'🩸',3,3)}),
    axExec:(f,t,d,e,s)=>{ring(f.x+f.face*40,f.y-40,e,'#fa6');if(nr(f,t,e)){const ex=t.hp<t.mx*.4;if(ex)txt(t,'EXECUÇÃO!','#f55');hit(f,t,ex?d*1.6:d,s,320)}},
    axBoom:(f,t,d,e)=>shot2(f,{d,sp:e,rt:.7,hw:34,hv:60,sz:30,kb:200,t:2,em:'🪓',spn:1}),
    axRage:(f,t,d,e)=>{f.bf=e;f.bfv=d/100;f.dd=e;f.fu=e;ring(f.x,f.y-40,70,'#f44');txt(f,'FÚRIA!','#f66')},
    hmSlam:(f,t,d,e,s)=>{const px=f.x+f.face*70,py=f.y;strike(px,py,e,.45,()=>{ring(px,py-20,e,'#fc6');shk=Math.min(9,shk+4);if(Math.abs(t.x-px)<e+24&&Math.abs(t.y-py)<80)hit(f,t,d,s,350,sdir({x:px},t))},'#ffb347')},
    hmQuake:(f,t,d,e,s)=>{let done=0;for(let n=1;n<=4;n++){const px=f.x+f.face*(60+n*75),py=f.y;strike(px,py,36,.1+.14*n,()=>{ring(px,py-20,40,'#a86');shk=Math.min(9,shk+1.5);if(!done&&Math.abs(t.x-px)<46&&t.gr&&Math.abs(t.y-py)<60){done=1;hit(f,t,d,s,260,sdir(f,t))}},'#a86')}},
    hmLeap:(f,t,d,e,s)=>{f.vy=-640;f.vx=f.face*300;f.gr=false;f.dash=.55;f.dm=null;hk((dt,h)=>{h.t+=dt;if(h.t>.2&&f.gr||h.t>1.2){f.dash=0;ring(f.x,f.y-10,110,'#fc6');shk=Math.min(9,shk+5);if(nr(f,t,110)&&t.gr)hit(f,t,d,s,380);return 1}})},
    dgBack:(f,t,d,e,s)=>{const sx=sdir(f,t),h=d/2;ring(f.x,f.y-40,50,'#a7f');f.x=clampX(t.x+sx*55);f.y=t.y;f.vy=0;f.face=-sx;ring(f.x,f.y-40,50,'#a7f');hit(f,t,h,0,90,-sx);after(.18,()=>{if(nr(f,t,70))hit(f,t,h,s,180,-sx)})},
    dgFan:(f,t,d)=>{for(let j=-2;j<=2;j++)shot2(f,{d,sp:620,vy:j*48,t:1.1,sz:14,em:'🗡️',kb:90,spn:1,oh:(a,b)=>dotE(a,b,'🩸',2,3)})},
    dgShade:(f,t,d,e)=>{f.inv=e;f.nx=e;f.bf=e;f.bfv=d/100;ring(f.x,f.y-40,50,'#889');txt(f,'SOMBRA','#aab')},
    bwSnipe:(f,t,d,e)=>shot2(f,{d,sp:e,ds:520,sz:12,ln:28,c:'#ffe9a0',kb:220}),
    bwRain:(f,t,d)=>{const ty=t.y;for(let n=0;n<7;n++){const px=t.x+(n-3)*38;strike(px,ty,26,.55+n*.09,()=>{ring(px,ty-40,30,'#ffd');if(Math.abs(t.x-px)<34&&Math.abs(t.y-ty)<80)hit(f,t,d,0,120)},'#ffd54a')}},
    bwFrost:(f,t,d,e,s)=>shot2(f,{d,sp:e,sz:12,ln:26,c:'#9df',sl:s,oh:(a,b)=>{if(b.slow>0){b.stun=Math.max(b.stun,1);txt(b,'CONGELADO!','#9df')}}}),
    stFire:(f,t,d,e)=>shot2(f,{d,sp:e,ex:70,sz:22,em:'🔥',c:'#ff7a2a',kb:280,oh:(a,b)=>dotE(a,b,'🔥',3,3)}),
    stHeal:(f,t,d)=>{f.hp=Math.min(f.mx,f.hp+d);f.slow=0;f.stun=0;f.dot=[];f.sil=f.dz=f.rt=f.wk=f.mk=0;f.rgn=4;ring(f.x,f.y-40,60,'#6f6');hk((dt,h)=>{h.t+=dt;f.hp=Math.min(f.mx,f.hp+4*dt);return h.t>=4})},
    stBolt:(f,t,d,e,s)=>{const px=t.x,ty=t.y;strike(px,ty,40,.5,()=>{bolt(px,ty);ring(px,ty-20,50,'#9cf');shk=Math.min(9,shk+3);if(Math.abs(t.x-px)<50)hit(f,t,d,s,0,sdir(f,t))},'#7ad0ff')},
    shWall:(f,t,d,e)=>{const wx=f.x+f.face*80,wy=f.y;f.sh=d;f.shT=e;hk((dt,h)=>{h.t+=dt;for(let j=PR.length-1;j>=0;j--){const q=PR[j];if(q.o!==f&&Math.abs(q.x-wx)<16&&q.y>wy-100&&q.y<wy+4){ring(q.x,q.y,22,'#9cf');PR.splice(j,1)}}if(Math.abs(t.x-wx)<24&&t.y>wy-90)t.x=wx+(t.x>=wx?24:-24);return h.t>=e},()=>{x.fillStyle='#7a8fb0';x.fillRect(wx-9,wy-90,18,90);x.strokeStyle='#cfe';x.lineWidth=3;x.strokeRect(wx-9,wy-90,18,90)})},
    shBash:(f,t,d,e,s)=>{ring(f.x+f.face*30,f.y-40,e,'#9cf');if(nr(f,t,e))hit(f,t,d,s,720,f.face,{gb:1})},
    shCounter:(f,t,d,e)=>{f.cn=e;ring(f.x,f.y-40,60,'#ffd54a');txt(f,'CONTRA-ATAQUE','#ffd54a')},
    trHook:(f,t,d,e,s)=>shot2(f,{d,sp:e,sz:13,ln:30,c:'#bde',kb:0,oh:(a,b)=>{b.stun=Math.max(b.stun,s);const sd=sdir(b,a);hk((dt,h)=>{h.t+=dt;if(Math.abs(b.x-a.x)>62)b.x+=sd*900*dt;return h.t>.4||Math.abs(b.x-a.x)<=62})}}),
    trTide:(f,t,d,e,s)=>shot2(f,{d,sp:e,hw:52,hv:110,pi:1,kb:520,sl:s,sz:50,em:'🌊',y:f.y-34,t:1.5}),
    trJav:(f,t,d,e)=>shot2(f,{d,sp:e,vy:-380,g:760,sz:10,ln:34,c:'#cde',t:2.5,kb:240}),
    pkDig:(f,t,d,e,s)=>{f.dig=f.rt=f.inv=.75;ring(f.x,f.y-10,50,'#a86');hk((dt,h)=>{h.t+=dt;f.vx=0;if(h.t>=.75){const sx=sdir(f,t);f.x=clampX(t.x-sx*10);f.y=t.y;f.vy=0;ring(f.x,f.y-10,70,'#a86');shk=Math.min(9,shk+4);if(Math.abs(t.x-f.x)<60&&Math.abs(t.y-f.y)<80){hit(f,t,d,s,300,sx);t.vy=-520;t.gr=false}return 1}})},
    pkRock:(f,t,d,e)=>shot2(f,{d,sp:e,vy:-140,g:760,bn:2,hw:30,sz:34,em:'🪨',spn:1,t:2.6,kb:320}),
    pkQuake:(f,t,d,e,s)=>{const cx=f.x,cy=f.y;[.35,.8,1.25].forEach((dl,n)=>strike(cx,cy,e,dl,()=>{ring(cx,cy-10,e,'#a86');shk=Math.min(9,shk+4);if(Math.abs(t.x-cx)<e+24&&t.gr&&Math.abs(t.y-cy)<70)hit(f,t,d/3,n===2?s:0,260,sdir(f,t))},'#a86'))},
    btHome:(f,t,d,e,s)=>{ring(f.x+f.face*40,f.y-45,e,'#fd6');let n=0;PR.forEach(q=>{if(q.o!==f&&Math.abs(q.x-f.x)<e*1.6&&Math.abs(q.y-(f.y-45))<110){q.o=f;q.vx=-q.vx;q.dir=-q.dir;q.d*=1.5;q.hh=0;n++}});if(n)txt(f,'DEVOLVEU!','#fd6');if(nr(f,t,e)){hit(f,t,d,s,650,sdir(f,t));t.vy=-520;t.gr=false}},
    btRico:(f,t,d,e)=>shot2(f,{d,sp:e,wb:1,t:3,sz:10,em:'⚾',spn:1,kb:260}),
    btRoll:(f,t,d,e,s)=>dashAt(f,d,s,540,{dur:.5,iv:.55,fn:(a,b)=>{b.slow=Math.max(b.slow,1)}}),
    gnPierce:(f,t,d,e)=>shot2(f,{d,sp:e,ap:1,sz:5,ln:22,c:'#ffe27a',kb:120}),
    gnBurst:(f,t,d)=>{for(let n=0;n<6;n++)after(n*.1,()=>{if(f.stun>0)return;shot2(f,{d,sp:640,vy:(Math.random()-.5)*50,sz:5,ln:14,c:'#ffe27a',kb:60})})},
    gnReload:(f,t,d,e,s,i)=>{f.cd=f.cd.map((v,j)=>j===i?v:0);f.bf=e;f.bfv=.2;ring(f.x,f.y-40,60,'#ffd54a');txt(f,'RECARREGADO','#ffd54a')},
    bmMine:(f,t,d,e,s)=>{const mx=f.x+f.face*50,my=f.y;hk((dt,h)=>{h.t+=dt;if(h.t>9)return 1;if(h.t>.6&&Math.abs(t.x-mx)<48&&Math.abs(t.y-my)<70){ring(mx,my-10,e,'#ff9a3a');ring(mx,my-10,e*.6,'#ffd84a');shk=Math.min(9,shk+4);if(Math.abs(t.x-mx)<e+24&&Math.abs(t.y-my)<90)hit(f,t,d,s,420,sdir({x:mx},t));return 1}},h=>{x.save();x.globalAlpha=h.t>.6&&((h.t*4)|0)%2?1:.55;x.font='20px sans-serif';x.textAlign='center';x.fillText('💣',mx,my-2);x.restore()})},
    bmGren:(f,t,d,e)=>shot2(f,{d,sp:300,vy:-300,g:900,bn:3,fz:1.4,ex:e,sz:12,em:'💣',spn:1,t:3,kb:420}),
    bmJump:(f,t,d,e,s)=>{const bx=()=>{ring(f.x,f.y-10,e,'#ff9a3a');ring(f.x,f.y-10,e*.55,'#ffd84a');shk=Math.min(9,shk+4)};bx();if(nr(f,t,e))hit(f,t,d,s,420,sdir(f,t));f.vy=-840;f.gr=false;f.dash=0;hk((dt,h)=>{h.t+=dt;if(h.t>.3&&f.gr||h.t>1.5){bx();if(nr(f,t,e*.8))hit(f,t,d*.6,0,300,sdir(f,t));return 1}})},
    flJet:(f,t,d,e)=>{const A=()=>{const a=f.mn?(f.am||0):(f.ca||0);return[Math.cos(a),Math.sin(a)]};hk((dt,h)=>{h.t+=dt;if(f.stun>0)return 1;h.k=(h.k||0)+dt;if(h.k>=.15){h.k=0;const[c,n]=A();if(seg(f.x+f.face*20*c,f.y-48-20*n,f.x+f.face*e*c,f.y-48-e*n,t.x,t.y-45,38)){hit(f,t,d*.6,0,0,f.face);dotE(f,t,'🔥',3,3)}}return h.t>=1.2},()=>{const[c,n]=A(),fx=f.x+f.face*20*c,fy=f.y-48-20*n;x.save();x.globalCompositeOperation='lighter';for(let k=0;k<14;k++){const u=(k/14+performance.now()/260)%1;x.globalAlpha=1-u;x.fillStyle=u<.4?'#ffd84a':'#ff5a1a';x.beginPath();x.arc(fx+f.face*u*e*c,fy-u*e*n+Math.sin(k*5+u*9)*u*10,3+u*13,0,7);x.fill()}x.restore()})},
    flBall:(f,t,d,e)=>shot2(f,{d,sp:e,vy:-160,g:800,bn:3,sz:20,em:'☄️',t:2.4,kb:240,bf:q=>fire(f,t,q.x,GY,36,3),oh:(a,b)=>dotE(a,b,'🔥',3,2)}),
    flAura:(f,t,d,e)=>hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;if(h.k>=.4){h.k=0;if(nr(f,t,e)){hit(f,t,d*.2,0,90,sdir(f,t));dotE(f,t,'🔥',3,2)}}return h.t>=3},h=>{x.save();x.globalCompositeOperation='lighter';x.globalAlpha=.6;for(let n=0;n<20;n++){const a=n*.314+h.t*3,rr=e*(.5+.5*((n*.37+h.t*2)%1));x.fillStyle=n%2?'#ff6a1a':'#ffd84a';x.beginPath();x.arc(f.x+Math.cos(a)*rr,f.y-30+Math.sin(a)*rr*.35,6,0,7);x.fill()}x.restore()}),
    icSpike:(f,t,d,e,s)=>shot2(f,{d,sp:e,sz:10,ln:30,c:'#aef',kb:60,oh:(a,b)=>{b.stun=Math.max(b.stun,s);txt(b,'CONGELADO!','#9df')}}),
    icBliz:(f,t,d,e,s)=>{const cx=f.x+f.face*130,cy=f.y;hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;if(h.k>=.4){h.k=0;if(Math.abs(t.x-cx)<e+20&&Math.abs(t.y-cy)<120){hit(f,t,d*.13,0,0,sdir({x:cx},t));t.slow=Math.max(t.slow,s)}}return h.t>=3.5},h=>{x.save();x.fillStyle='#cfefff';x.globalAlpha=.18;x.beginPath();x.ellipse(cx,cy-4,e,e*.3,0,0,7);x.fill();x.globalAlpha=.85;for(let n=0;n<26;n++){x.fillRect(cx+((n*53)%(2*e))-e,cy-((n*37+h.t*160)%110),3,3)}x.restore()})},
    icArmor:(f,t,d,e)=>{f.sh=d;f.shT=e;f.ice=e;ring(f.x,f.y-40,60,'#9df');txt(f,'ARMADURA','#9df')},
    lgSpark:(f,t,d,e,s)=>{const th=f.ca||0,c=Math.cos(th),n=Math.sin(th),x1=f.x+f.face*20*c,y1=f.y-48-20*n,x2=f.x+f.face*e*c,y2=f.y-48-e*n;zap(x1,y1,x2,y2,.12);if(seg(x1,y1,x2,y2,t.x,t.y-45,40))hit(f,t,d,s,100,f.face)},
    lgThunder:(f,t,d)=>{const ty=t.y;for(let n=0;n<3;n++){const px=Math.max(30,Math.min(WW-30,t.x+(n-1)*95));strike(px,ty,34,.45+n*.28,()=>{bolt(px,ty);ring(px,ty-20,44,'#9cf');shk=Math.min(9,shk+2);if(Math.abs(t.x-px)<44)hit(f,t,d,.3,0,sdir(f,t))},'#9cf')}},
    lgBlink:(f,t,d,e)=>{const a=f.x,b=clampX(a+f.face*e);zap(a,f.y-45,b,f.y-45,.25);if((t.x-a)*f.face>-20&&(t.x-b)*f.face<20&&Math.abs(t.y-f.y)<80)hit(f,t,d,.3,200,f.face);f.x=b;f.iv=.3;ring(a,f.y-40,40,'#9cf');ring(b,f.y-40,40,'#9cf')},
    ktIai:(f,t,d,e,s)=>{f.rt=.5;ring(f.x,f.y-40,40,'#fff');txt(f,'FOCO...','#fff');hk((dt,h)=>{h.t+=dt;if(f.stun>0)return 1;if(h.t>=.5){dashAt(f,d*1.6,s,1500,{dur:.18});zap(f.x,f.y-45,f.x+f.face*270,f.y-45,.2);return 1}})},
    ktStar:(f,t,d)=>{for(let j=-1;j<=1;j++)shot2(f,{d,sp:560,sw:[46,7,j*2.1],sz:10,em:'✴️',spn:1,t:1.3,kb:100})},
    ktDodge:(f,t,d,e)=>{f.dg=e;f.bf=1;f.bfv=d/100;ring(f.x,f.y-40,50,'#9fb');txt(f,'ESQUIVA','#9fb')},
    gtChord:(f,t,d,e)=>{ring(f.x,f.y-40,e,'#f7f');if(nr(f,t,e)){hit(f,t,d,0,150,sdir(f,t));t.sil=2;txt(t,'SILENCIADO','#f9f')}},
    gtWave:(f,t,d,e)=>shot2(f,{d,sp:e,hw:40,hv:85,pi:1,sz:30,em:'🎵',kb:120,oh:(a,b)=>{b.dz=2.5;txt(b,'TONTO','#f9f')}}),
    gtSolo:(f,t,d,e)=>{f.cdx=e;f.bf=e;f.bfv=d/100;ring(f.x,f.y-40,60,'#f9f');txt(f,'SOLO!','#f9f')},
    bkWise:(f,t,d,e,s,i)=>{f.hp=Math.min(f.mx,f.hp+d);f.cd=f.cd.map((v,j)=>j===i?v:v*.5);ring(f.x,f.y-40,60,'#8f8')},
    bkQuiz:(f,t,d,e,s)=>{ring(f.x,f.y-40,e,'#ccf');if(nr(f,t,e)){hit(f,t,d,s,60,sdir(f,t));t.mk=4;txt(t,'MARCADO','#fd6')}},
    bkPaper:(f,t,d,e)=>shot2(f,{d,sp:e,sz:12,em:'📄',kb:80,oh:(a,b)=>{b.wk=4;txt(b,'FRACO','#bbb')}}),
    bxStraight:(f,t,d,e,s)=>dashAt(f,d,s,900,{dur:.14,gb:1}),
    bxCombo:(f,t,d,e)=>{[0,.2,.4].forEach((dl,n)=>after(dl,()=>{if(f.stun>0)return;f.dash=.12;f.vx=f.face*160;ring(f.x+f.face*40,f.y-45,50,'#fc6');if(nr(f,t,e)){hit(f,t,d*[.3,.3,.4][n],0,n<2?60:450,f.face);if(n===2){t.vy=-420;t.gr=false}}}))},
    bxKO:(f,t,d,e,s)=>{f.rt=.5;ring(f.x,f.y-40,50,'#f55');hk((dt,h)=>{h.t+=dt;if(f.stun>0)return 1;if(h.t>=.5){ring(f.x+f.face*40,f.y-45,e,'#f55');if(nr(f,t,e)){const g=t.stun>0||t.slow>0||t.rt>0||t.dz>0;hit(f,t,g?d*2.2:d*.9,s,g?600:300,sdir(f,t));if(g)txt(t,'NOCAUTE!','#f55')}return 1}})},
    crDecree:(f,t,d,e)=>shot2(f,{d,sp:e,sz:12,em:'📜',kb:60,oh:(a,b)=>{b.rt=2.5;txt(b,'PRESO','#fd6')}}),
    crGuard:(f,t,d,e)=>{const gx=f.x-f.face*45,gy=f.y;hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;if(h.k>=.9){h.k=0;const sx=t.x>=gx?1:-1;PR.push({o:f,x:gx+sx*20,y:gy-44,x0:gx,by:gy-44,vx:sx*600,vy:0,d,st:0,sl:0,t:1.3,dir:sx,a:0,sz:5,ln:16,c:'#ffd54a',kb:100})}return h.t>=e},()=>{x.save();x.font='34px sans-serif';x.textAlign='center';x.fillText('💂',gx,gy-8);x.restore()})},
    crDrain:(f,t,d,e)=>{if(Math.abs(t.x-f.x)<e&&Math.abs(t.y-f.y)<110){hit(f,t,d,0,60,sdir(f,t));f.hp=Math.min(f.mx,f.hp+d);zap(t.x,t.y-45,f.x,f.y-45,.3,'#6f6')}}
  };
  const cast=(f,t,i)=>{if(paused||cut||over2)return;const p=f.W.p[i];if(!p||f.cd[i]>0||f.stun>0||f.blk||f.sil>0||f.dig>0)return;f.cd[i]=p[3]*(1-f.s.cdr);f.ca=aimA(f,t);f.cat=.45;const k=p[1],d=('PZMAD'.includes(k)&&f.awT>0)?p[2]*(1+f.awP):p[2],h=PW[p[6]];if(h)h(f,t,d,p[4],p[5],i)};
  /* ---------- despertar ---------- */
  const trueHit=(a,t,d,kb,stn)=>{t.hp-=d;t.hurt=.2;t.hit=.25;if(kb){t.vx=(t.x>=a.x?1:-1)*kb;t.vy=-260;t.gr=false}if(stn)t.stun=Math.max(t.stun,stn);flop(t,t.x>=a.x?1:-1,kb||150)};
  const tickAw=(f,dt)=>{if(!f.aw)return;if(f.awT>0){f.awT=Math.max(0,f.awT-dt);if(f.awT<=0)f.awC=AWC}else if(f.awC>0)f.awC=Math.max(0,f.awC-dt)};
  const awaken=f=>{if(paused||over2||cut||!f.aw||f.awT>0||f.awC>0)return;f.awT=AWDUR;f.ulU=0;f.awP=AWD[f.aw].p;const c=AWD[f.aw].c;FX.push({x:f.x,y:f.y-45,r:150,t:.5,c:c[1]},{x:f.x,y:f.y-45,r:90,t:.4,c:c[0]})};
  const ult=(f,tg)=>{if(paused||over2||cut||!f.aw)return;const u=UL.find(q=>q.k==='b'&&q.o===f&&q.st==='h');if(u){throwB(u);return}if(!(f.awT>0)||f.ulU)return;f.ulU=1;cut={t:0,f,tg,k:f.aw}};
  const launch=c=>{const f=c.f,tg=c.tg;if(c.k==='flavio')UL.push({k:'b',o:f,tg,st:'h',x:f.x+f.face*40,y:f.y-70,vx:0,a:0});else UL.push({k:'s',o:f,tg,n:STN,tm:0,bl:[]})};
  const cpuAw=dt=>{if(!E.aw||cut||over2)return;if(E.awT<=0){if(E.awC<=0&&Math.random()<dt*.5)awaken(E)}else if(!E.ulU&&E.awT<AWDUR-1&&Math.random()<dt*1.2)ult(E,P)};
  /* CPU tenta desviar dos poderes finais (chance conforme a dificuldade): pula a esfera / sai de baixo do aviso do raio */
  const cpuDodge=dt=>{let ax=0;UL.forEach(u=>{if(u.o===E)return;
    if(u.k==='s')u.bl.forEach(b=>{if(b.w>0&&b.w<.5&&b.c&&Math.abs(b.x-E.x)<SR+40&&E.y<=b.g+4)ax=E.x>=b.x?1:-1});
    else if(u.st==='f'){const d=(E.x-u.x)*Math.sign(u.vx);if(d>50&&d<280&&E.gr&&Math.random()<dt*LV.a*2){E.vy=-720*(1+E.s.jmp);E.gr=false}}});return ax};
  const throwB=u=>{u.st='f';{const th=aimA(u.o,u.tg);u.vx=u.o.face*SBS*Math.cos(th);u.vy=-SBS*Math.sin(th)}u.a=0;u.x=u.o.x+u.o.face*50;u.y=u.o.y-62;FX.push({x:u.x,y:u.y,r:70,t:.3,c:'#3dff6a'})};
  const boom=(x0,y0)=>FX.push({x:x0,y:y0,r:180,t:.5,c:'#3dff6a'},{x:x0,y:y0,r:120,t:.45,c:'#ffd84a'},{x:x0,y:y0,r:60,t:.4,c:'#3a7bff'});
  const dodge=t=>TX.push({x:t.x,y:t.y-92,t:.9,s:'ESQUIVOU!',c:'#7dffb0'});
  const updUL=dt=>{for(let i=UL.length-1;i>=0;i--){const u=UL[i],tg=u.tg,o=u.o;u.a=(u.a||0)+dt;
    if(u.k==='b'){
      if(u.st==='h'){u.x=o.x+o.face*40;u.y=o.y-70;if(u.a>=HOLDT||(!pvp&&o===E&&u.a>.7&&Math.random()<dt*2.2))throwB(u);continue}
      u.x+=u.vx*dt;u.y+=(u.vy||0)*dt;
      if(Math.abs(tg.x-u.x)<SBR+14&&Math.abs(tg.y-45-u.y)<SBR+34){
        if(tg.iv>0){if(!u.dg){u.dg=1;dodge(tg)}}
        else{trueHit({x:u.x-Math.sign(u.vx)*20},tg,AWD.flavio.u,420,.5);boom(tg.x,tg.y-45);UL.splice(i,1);continue}}
      if(u.x<-60||u.x>WW+60||u.a>6||u.y>GY-6||u.y<-300){boom(Math.max(20,Math.min(WW-20,u.x)),u.y);UL.splice(i,1)}}
    else{u.tm-=dt;
      while(u.tm<=0&&u.n>0){u.n--;u.tm+=STI;const bx=30+Math.random()*(WW-60);u.bl.push({x:bx,g:gyAt(bx,-1e4,GY),w:STW,t:0,s:Math.random(),c:Math.random()<LV.a})}
      u.bl.forEach(b=>{if(b.w>0){b.w-=dt;if(b.w<=0){b.t=.22;FX.push({x:b.x,y:b.g-4,r:SR+10,t:.3,c:'#ff3a2a'});shk=Math.min(9,shk+2.5);
          if(Math.abs(tg.x-b.x)<SR+14&&tg.y<=b.g+4){if(tg.iv>0)dodge(tg);else trueHit(o,tg,AWD.lula.u,0,.15)}}}else b.t-=dt});
      u.bl=u.bl.filter(b=>b.w>0||b.t>0);if(!u.n&&!u.bl.length)UL.splice(i,1)}}};
  const aimInd=f=>{if(OPT.ind==='n'||f.dead||over2||paused||cut)return;if(!(f===P||(pvp&&f===E)))return;const man=!!f.mn,gh=f.cat>0;if(!man&&!gh)return;
    const th=man?(f.am||0):(f.ca||0),c=Math.cos(th),sn=Math.sin(th),ox=f.x,oy=f.y-48,L=220,ex=ox+f.face*L*c,ey=oy-L*sn,t=foe(f),lock=seg(ox,oy,ex,ey,t.x,t.y-45,44),col=lock?'#ff5a4a':(f===P?'#5fd0ff':'#ffb347'),z=Math.max(.7,cam.z);
    x.save();x.globalAlpha=man?1:Math.min(1,f.cat*3);x.lineCap='round';x.strokeStyle=col;x.shadowColor=col;x.shadowBlur=8;x.lineWidth=3;
    x.setLineDash([9,9]);x.lineDashOffset=-performance.now()/40;x.beginPath();x.moveTo(ox+f.face*44*c,oy-44*sn);x.lineTo(ex,ey);x.stroke();x.setLineDash([]);
    x.beginPath();x.arc(ex,ey,13,0,7);x.stroke();x.beginPath();[[1,0],[-1,0],[0,1],[0,-1]].forEach(([u,v])=>{x.moveTo(ex+u*8,ey+v*8);x.lineTo(ex+u*21,ey+v*21)});x.stroke();
    x.shadowBlur=0;const dg=Math.round(th*57.3),tx=(lock?'🎯 ':'')+(dg>0?'+':'')+dg+'°';x.font='bold '+Math.round(13/z)+'px sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='#000c';x.strokeText(tx,ex,ey-28/z);x.fillStyle=col;x.fillText(tx,ex,ey-28/z);x.restore()};
  const aura=(f,t)=>{if(!(f.awT>0))return;const c=AWD[f.aw].c;x.save();x.globalCompositeOperation='lighter';x.globalAlpha=(f.awT<3&&((t/110|0)%2))?.35:1;
    const g=x.createRadialGradient(f.x,f.y-45,8,f.x,f.y-45,90);g.addColorStop(0,c[1]+'77');g.addColorStop(1,c[2]+'00');x.fillStyle=g;x.beginPath();x.arc(f.x,f.y-45,90,0,7);x.fill();
    for(let i=0;i<16;i++){const bx=f.x+Math.sin(i*5.1)*24,by=f.y-2-(i/15)*78,h=36+Math.sin(t/85+i*1.9)*14,w=9+Math.abs(Math.sin(i*3))*5,sw=Math.sin(t/120+i)*7;
      x.fillStyle=c[1]+'99';x.beginPath();x.moveTo(bx-w,by);x.quadraticCurveTo(bx-w*.7,by-h*.55,bx+sw,by-h);x.quadraticCurveTo(bx+w*.7,by-h*.55,bx+w,by);x.fill();
      x.fillStyle=c[0]+'aa';x.beginPath();x.moveTo(bx-w*.4,by);x.quadraticCurveTo(bx-w*.3,by-h*.35,bx+sw*.6,by-h*.62);x.quadraticCurveTo(bx+w*.3,by-h*.35,bx+w*.4,by);x.fill()}
    x.restore()};
  const drawUL=t=>{UL.forEach(u=>{x.save();x.globalCompositeOperation='lighter';
    if(u.k==='b'){const hs=u.st==='h',r=(hs?SBR*Math.min(1,.25+u.a/.5):SBR)+Math.sin(t/60)*3;
      if(!hs){for(let k=1;k<=5;k++){x.globalAlpha=.3-k*.05;x.fillStyle=['#3dff6a','#ffd84a','#3a7bff'][k%3];x.beginPath();x.arc(u.x-Math.sign(u.vx)*k*16,u.y,r*(1-k*.1),0,7);x.fill()}x.globalAlpha=1}
      const g=x.createRadialGradient(u.x,u.y,r*.3,u.x,u.y,r*2.2);g.addColorStop(0,'#ffffff88');g.addColorStop(1,'#2a5bd800');x.fillStyle=g;x.beginPath();x.arc(u.x,u.y,r*2.2,0,7);x.fill();
      x.globalCompositeOperation='source-over';[['#1fcc55',r],['#ffd84a',r*.72],['#2a6bff',r*.44],['#ffffff',r*.18]].forEach(([q,rr])=>{x.fillStyle=q;x.beginPath();x.arc(u.x,u.y,rr,0,7);x.fill()});
      for(let k=0;k<3;k++){x.strokeStyle=['#77ff77','#ffdd44','#66aaff'][k];x.lineWidth=3;x.beginPath();x.arc(u.x,u.y,r*(.9+k*.18),t/150+k*2.1,t/150+k*2.1+1.6);x.stroke()}
      if(hs){x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.arc(u.x,u.y,r+9,-1.57,-1.57+6.28*Math.max(0,1-u.a/HOLDT));x.stroke()}}
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
    else{for(let i=0;i<46;i++){const ph=((i*.137+c.t*.9)%1),a0=i*2.399+c.t*2,rr=(1-ph)*330;x.fillStyle=['#3dff6a','#ffd84a','#3a7bff'][i%3];x.globalAlpha=.25+ph*.6;x.beginPath();x.arc(565+Math.cos(a0)*rr,225+Math.sin(a0)*rr*.7,2+ph*4,0,7);x.fill()}}
    x.globalAlpha=1;const R=14+Math.min(1,p*1.25)*72,ox=565,oy=225,og=x.createRadialGradient(ox,oy,R*.2,ox,oy,R*2);og.addColorStop(0,cl[0]+'cc');og.addColorStop(.5,cl[1]+'55');og.addColorStop(1,cl[2]+'00');x.fillStyle=og;x.beginPath();x.arc(ox,oy,R*2,0,7);x.fill();
    if(k==='flavio'){x.globalCompositeOperation='source-over';[['#1fcc55',R],['#ffd84a',R*.72],['#2a6bff',R*.44],['#ffffff',R*.16]].forEach(([q,r])=>{x.fillStyle=q;x.beginPath();x.arc(ox,oy,r,0,7);x.fill()})}
    else{x.fillStyle='#ff3a2a';x.beginPath();x.arc(ox,oy,R*.8,0,7);x.fill();x.fillStyle='#ffe0d0';x.beginPath();x.arc(ox,oy,R*.35,0,7);x.fill();for(let b=0;b<7;b++){const a0=rn(Math.floor(c.t*12)*7+b)*6.28;x.strokeStyle='#fff';x.lineWidth=2.5;x.beginPath();x.moveTo(ox+Math.cos(a0)*R*.8,oy+Math.sin(a0)*R*.8);x.lineTo(ox+Math.cos(a0+.15)*R*1.5,oy+Math.sin(a0+.15)*R*1.5);x.stroke()}}
    x.globalCompositeOperation='source-over';const hx=190,hy=225,hr=78+Math.sin(c.t*8)*2;x.save();x.beginPath();x.arc(hx,hy,hr,0,7);x.clip();const im=getImg(f.img);if(im){const s2=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-s2)/2,(im.naturalHeight-s2)/2,s2,s2,hx-hr,hy-hr,hr*2,hr*2)}else{x.fillStyle='#8899aa';x.fillRect(hx-hr,hy-hr,hr*2,hr*2)}x.restore();
    x.globalCompositeOperation='lighter';x.strokeStyle=cl[1];x.lineWidth=8;x.globalAlpha=.85;x.beginPath();x.arc(hx,hy,hr+4,0,7);x.stroke();x.lineWidth=3;x.strokeStyle=cl[0];x.beginPath();x.arc(hx,hy,hr+12+Math.sin(c.t*10)*4,0,7);x.stroke();
    x.globalCompositeOperation='source-over';x.globalAlpha=1;const bh=Math.min(1,c.t/.25)*56;x.fillStyle='#000';x.fillRect(0,0,W,bh);x.fillRect(0,H-bh,W,bh);
    const ts=Math.min(1,Math.max(0,(c.t-.35)/.35)),nm=A.n.toUpperCase();x.textAlign='center';x.save();x.translate(W/2,H-bh/2+10);x.scale(.6+.4*ts,.6+.4*ts);x.globalAlpha=ts;x.font='900 30px sans-serif';x.lineWidth=5;x.strokeStyle=cl[2];x.strokeText(nm,0,0);x.fillStyle='#fff';x.fillText(nm,0,0);x.restore();
    x.font='bold 15px sans-serif';x.fillStyle=cl[0];x.fillText(((f.c.nome||'')+'').toUpperCase()+' · '+A.d,W/2,Math.max(16,bh-18));
    if(c.t>CUTT-.3){x.fillStyle=`rgba(255,255,255,${Math.min(1,(c.t-(CUTT-.3))/.3)})`;x.fillRect(-W,-H,W*3,H*3)}
    x.restore()};

  const ai=(f,t,dt)=>{const a=f.br||(f.br={t:0,ax:0,blk:0});a.t-=dt;a.blk-=dt;
    if(a.t<=0){a.t=LV.r*(.6+Math.random()*.8);const d=t.x-f.x,ad=Math.abs(d),dir=d>0?1:-1;a.ax=0;a.at=a.jp=a.dh=0;f.face=dir;
      if(t.atk>0&&ad<120&&Math.random()<LV.b)a.blk=.45;
      else{if(ad>100)a.ax=dir;else if(ad<55&&Math.random()<.3)a.ax=-dir;
        if(ad<85&&Math.random()<LV.a)a.at=1;
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
      if(inp.jump&&f.gr&&!f.blk){f.vy=-720*(1+f.s.jmp);f.gr=false}
      if(inp.dash&&f.dcd<=0){f.dash=.18;f.iv=.3;f.dcd=.8*(1-f.s.dcd);f.vx=(ax||f.face)*620;f.face=ax||f.face}
      if(inp.atk&&f.acd<=0&&!f.blk){f.atk=.22;f.acd=.45*(1-f.s.acd);f.did=0}
    }
    if(f.atk>0){f.atk-=dt;if(!f.did&&f.atk<.14&&tgt){f.did=1;const d=(tgt.x-f.x)*f.face;if(d>0&&d<85&&Math.abs(tgt.y-f.y)<70){
      hitF(f,tgt,8*f.W.a,'m',0,260)}}}
    f.vy+=G*dt;f.x+=f.vx*dt;const py=f.y;f.y+=f.vy*dt;f.gr=false;let gy=GY;if(f.vy>=0)for(const q of M.pl)if(f.x>q[0]-8&&f.x<q[0]+q[1]+8&&py<=q[2]+2&&f.y>=q[2])gy=Math.min(gy,q[2]);
    if(f.y>=gy){f.y=gy;f.vy=0;f.gr=true;if(f.hurt>0)f.vx*=.9}
    f.x=Math.max(30,Math.min(WW-30,f.x));if(f.dm&&tgt){if(f.dash>0&&!f.dmh&&Math.abs(tgt.x-f.x)<50&&Math.abs(tgt.y-f.y)<70){f.dmh=1;f._o=f.dmo;hitF(f,tgt,f.dm[0],'p',f.dm[1],200);f._o=null;if(f.dmf)f.dmf(f,tgt)}if(f.dash<=0){f.dm=null;f.dmo=f.dmf=null}}
    if(f.hurt>0)f.vx*=.96;
  };
  /* ---------- ragdoll articulado: 11 pontos (cabeça, pescoço, quadril, cotovelos, mãos, joelhos, pés) ---------- */
  const RB=[[0,1,17],[1,2,25],[1,3,14],[3,4,14],[1,5,14],[5,6,14],[2,7,17],[7,8,17],[2,9,17],[9,10,17]];
  const ik=(a,b,l1,l2,sg)=>{const dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||.01,m=Math.min(d,l1+l2-.05),ux=dx/d,uy=dy/d,q=(l1*l1-l2*l2+m*m)/(2*m),h=Math.sqrt(Math.max(0,l1*l1-q*q));return[a[0]+ux*q-uy*h*sg,a[1]+uy*q+ux*h*sg]};
  const gyAt=(px,oy,ny)=>{let g=GY;for(const q of M.pl)if(px>q[0]-8&&px<q[0]+q[1]+8&&oy<=q[2]+2&&ny>=q[2])g=Math.min(g,q[2]);return g};
  const pose=(f,t)=>{const fc=f.face,X=f.x,Y=f.y,a=Math.min(1,Math.abs(f.vx)/190),sw=Math.sin(f.ph),air=!f.gr,hurt=f.hurt>0,at=f.atk>0?1-f.atk/.22:-1,bob=Math.sin(t/380)*1.2,
    hip=[X,Y-33+(f.blk?8:0)+(air?2:0)-Math.abs(sw)*a*2+bob*.5],
    lean=fc*(2+a*5+(at>=0?7*Math.sin(Math.min(1,at)*3.14):0)+(f.dash>0?10:0))-(hurt?fc*9:0),
    nk=[X+lean,hip[1]-25+(hurt?3:0)],hd=[nk[0]+lean*.3+fc*2-(hurt?fc*5:0),nk[1]-17+bob*.4];
    const lg=sg=>{if(f.dash>0)return sg>0?[X+fc*18,Y]:[X-fc*20,Y-5];
      if(air){const up=f.vy<0;return sg>0?[X+fc*9,Y-(up?15:9)]:[X-fc*7,Y-(up?9:4)]}
      if(f.blk)return[X+sg*fc*13,Y];
      const q=sg>0?sw:-sw,c=sg>0?Math.cos(f.ph):-Math.cos(f.ph);return[X+fc*(sg*8+q*17*a),Y-Math.max(0,c)*8*a]};
    const fF=lg(1),fB=lg(-1);let hF,hB;
    if(f.win){hF=[nk[0]+fc*9,nk[1]-26+Math.sin(t/110)*4];hB=[nk[0]-fc*9,nk[1]-26-Math.sin(t/110)*4]}
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
  const body=(f,col,t)=>{const P=f.rg;if(!P)return;
    const ln=(a,b,w,al)=>{x.globalAlpha=al;x.lineWidth=w;x.beginPath();x.moveTo(P[a].x,P[a].y);x.lineTo(P[b].x,P[b].y);x.stroke()},jn=(i,r,al)=>{x.globalAlpha=al;x.beginPath();x.arc(P[i].x,P[i].y,r,0,7);x.fill()};
    x.strokeStyle=col;x.fillStyle=col;x.lineCap='round';x.lineJoin='round';
    ln(1,5,4,.6);ln(5,6,4,.6);jn(5,2.4,.6);jn(6,3.2,.6);ln(2,9,4.5,.6);ln(9,10,4.5,.6);jn(9,2.6,.6);jn(10,3.4,.6);
    ln(1,2,6.5,1);jn(2,3.6,1);ln(2,7,4.5,1);ln(7,8,4.5,1);jn(7,2.6,1);jn(8,3.4,1);ln(1,3,4,1);ln(3,4,4,1);jn(3,2.4,1);jn(4,3.2,1);x.globalAlpha=1;
    {const hx=P[4].x,hh=P[4].y,im=f.wi>=0&&FS.img('w',f.wi);
      if(im&&im.complete&&im.naturalWidth){const r=FS.ori[f.wi]==='r',g=FS.gr[f.wi],tt=f.atk>0?1-f.atk/.22:0,k=.78,ar=f.atk>0;
        let ang=r?(f.blk?-.1:ar?-.5+tt*.9:-.3+Math.sin(f.ph)*.06):(f.blk?.1:ar?-.4+tt*2.3:.55+Math.sin(f.ph)*.08);
        if(f.dead||f.rag>0)ang=Math.atan2(P[4].y-P[3].y,(P[4].x-P[3].x)*f.face)*.8;
        x.save();x.translate(hx,hh);x.scale(f.face,1);x.rotate(ang);x.drawImage(im,-g[0]*k,-g[1]*k,64*k,64*k);x.restore()}}
    if((f.blk||f.sh>0)&&!f.dead){x.strokeStyle='#5bf8';x.lineWidth=3;x.beginPath();x.arc(f.x,f.y-45,44,0,7);x.stroke()}
    const hd=P[0],nk=P[1],an=Math.atan2(hd.x-nk.x,-(hd.y-nk.y));x.save();x.translate(hd.x,hd.y);x.rotate(an);
    x.save();x.beginPath();x.arc(0,0,16,0,7);x.clip();const im=getImg(f.img);
    if(im){const s=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-s)/2,(im.naturalHeight-s)/2,s,s,-16,-16,32,32)}else{x.fillStyle='#8899aa';x.fill()}
    x.restore();x.strokeStyle=f.hit>0?'#f55':col;x.lineWidth=3;x.beginPath();x.arc(0,0,16,0,7);x.stroke();
    if(f.ai===0||f.ai===10||f.ai===13){const h=FS.img('a',f.ai);if(h.complete&&h.naturalWidth)x.drawImage(h,-17,-34,34,34)}
    x.restore();
    x.font='bold '+Math.round(13/Math.max(.7,cam.z))+'px sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='#000c';const s2='★ '+(f.vit|0);x.strokeText(s2,hd.x,hd.y-27);x.fillStyle='#ffd54a';x.fillText(s2,hd.x,hd.y-27)};
  const rr=(a,b,ww,hh,r)=>{x.beginPath();if(x.roundRect)x.roundRect(a,b,ww,hh,r);else x.rect(a,b,ww,hh)};
  const bar=(f,l,left)=>{const w=240,c=OPT.bars==='c',xx=left?(c?W/2-8-w:16):(c?W/2+8:W-16-w),y=c?36:14,tm=performance.now(),pc=Math.max(0,f.hp)/f.mx;
    f.gh=f.gh==null?f.hp:(f.gh>f.hp?Math.max(f.hp,f.gh-(f.gh-f.hp)*.06-.12):f.hp);
    x.save();x.shadowColor='#000a';x.shadowBlur=8;x.shadowOffsetY=2;rr(xx-3,y-3,w+6,22,9);x.fillStyle='#0b0f1a';x.fill();x.restore();
    rr(xx-3,y-3,w+6,22,9);x.strokeStyle='#ffffff55';x.lineWidth=1.5;x.stroke();
    x.save();rr(xx,y,w,16,6);x.clip();x.fillStyle='#1a2036';x.fillRect(xx,y,w,16);
    const gw=w*Math.max(0,f.gh)/f.mx,bw=w*pc,bx=left?xx:xx+w-bw,gx=left?xx:xx+w-gw;x.fillStyle='#ffe9a0';x.globalAlpha=.85;x.fillRect(gx,y,gw,16);x.globalAlpha=1;
    const lo=pc>.5,mid=pc>.25,g1=x.createLinearGradient(0,y,0,y+16);if(lo){g1.addColorStop(0,'#9dff8a');g1.addColorStop(.5,'#35c24f');g1.addColorStop(1,'#1c7a34')}else if(mid){g1.addColorStop(0,'#ffe27a');g1.addColorStop(.5,'#f59b1f');g1.addColorStop(1,'#a85a08')}else{const pu=.75+.25*Math.sin(tm/110);g1.addColorStop(0,'#ff8a7a');g1.addColorStop(.5,'rgba(230,50,50,'+pu+')');g1.addColorStop(1,'#8a1414')}
    x.fillStyle=g1;x.fillRect(bx,y,bw,16);x.fillStyle='rgba(255,255,255,.3)';x.fillRect(bx,y+1,bw,5);
    x.strokeStyle='rgba(0,0,0,.28)';x.lineWidth=1;for(let i=1;i<10;i++){x.beginPath();x.moveTo(xx+w*i/10,y);x.lineTo(xx+w*i/10,y+16);x.stroke()}x.restore();
    if(f.aw){const on=f.awT>0,rdy=!on&&f.awC<=0,pr=on?f.awT/AWDUR:1-f.awC/AWC,cc=AWD[f.aw].c,col=on?cc[1]:rdy?cc[0]:'#ffffff66',by=y+44;x.save();rr(xx,by,w,7,3.5);x.clip();x.fillStyle='#0b0f1acc';x.fillRect(xx,by,w,7);const g2=x.createLinearGradient(xx,0,xx+w,0);g2.addColorStop(0,shd(col.length>=7?col:'#888888',-.35));g2.addColorStop(1,col);x.fillStyle=on||rdy?g2:col;x.fillRect(left?xx:xx+w-w*pr,by,w*pr,7);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(xx,by,w,2);x.restore();rr(xx,by,w,7,3.5);x.strokeStyle='#ffffff40';x.lineWidth=1;x.stroke();if(rdy){x.font='bold 10px sans-serif';x.fillStyle=cc[1];x.textAlign=left?'left':'right';x.fillText('🔥 DESPERTAR PRONTO',left?xx:xx+w,y+61)}}
    x.font='bold 12px sans-serif';x.textAlign=left?'left':'right';x.lineWidth=3;x.strokeStyle='#000c';const nm=(l||'').split(' ')[0]+' '+Math.ceil(Math.max(0,f.hp)),nx=left?xx:xx+w;x.strokeText(nm,nx,y+31);x.fillStyle='#fff';x.fillText(nm,nx,y+31);
    [['w',f.wi],['a',f.ai]].forEach(([k,i],n)=>{if(i<0)return;const m=FS.img(k,i);if(m.complete&&m.naturalWidth){const ix=left?xx+w-24-n*26:xx+4+n*26,iy=y+19;x.save();x.beginPath();x.arc(ix+11,iy+11,12,0,7);x.fillStyle='rgba(11,15,26,.8)';x.fill();x.strokeStyle='#ffffff66';x.lineWidth=1.5;x.stroke();x.drawImage(m,ix,iy,22,22);x.restore()}})};

  const paint=(x,t)=>{const m=FD.M[MP],g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,m[2]);g.addColorStop(1,m[3]);x.fillStyle=g;x.fillRect(0,0,WW,H);skyTex(x,m,WW);
    const tri=(c,n,w,h,o2)=>{x.fillStyle=c;for(let i=0;i<n;i++){x.beginPath();x.moveTo(i*w-w/3,GY);x.lineTo(i*w+w/2,GY-h-(i*37+o2)%50);x.lineTo(i*w+w*1.3,GY);x.fill()}};
    if(m[6]===0){x.fillStyle='#ffe9a0';x.beginPath();x.arc(1300,90,38,0,7);x.fill();tri('#4a8a5a',8,230,100,0)}
    else if(m[6]===1){x.fillStyle='#fff';for(let i=0;i<80;i++)x.fillRect(i*97%WW,i*53%250,2,2);x.fillStyle='#e8e8f8';x.beginPath();x.arc(240,80,28,0,7);x.fill();x.fillStyle='#14182c';for(let i=0;i<17;i++)x.fillRect(i*95,GY-50-(i*37%90),60,200)}
    else if(m[6]===2){tri('#3a1410',8,230,120,10);x.fillStyle='#ff5a1f55';x.fillRect(0,GY-30,WW,30)}
    else if(m[6]===3){tri('#bfe6ff',8,230,110,20)}
    else{x.strokeStyle='#f0f6';x.lineWidth=1;for(let i=0;i<=32;i++){x.beginPath();x.moveTo(WW/2+(i-16)*20,250);x.lineTo((i-16)*90+WW/2,GY);x.stroke()}for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,250+i*i*5);x.lineTo(WW,250+i*i*5);x.stroke()}}
    groundTex(x,m,WW,M.pl);};
  const BG=document.createElement('canvas');BG.width=WW*1.5;BG.height=H*1.5;{const c2=BG.getContext('2d');c2.scale(1.5,1.5);paint(c2,0)}
  const camU=dt=>{const lo=Math.min(P.y,E.y),dx=Math.abs(P.x-E.x),top=Math.min(lo-135,GY-150),bot=GY+36,z=Math.max(.5,Math.min(1.5,W/Math.max(520,dx+440),H/(bot-top))),cx=(P.x+E.x)/2,cy=(top+bot)/2;
    if(!cam.i){cam.x=cx;cam.y=cy;cam.z=z;cam.i=1;return}const k=1-Math.exp(-dt*6);cam.x+=(cx-cam.x)*k;cam.y+=(cy-cam.y)*k;cam.z+=(z-cam.z)*k};
  const ko=()=>{const pw=P.hp>=E.hp,w=pw?P:E,l=pw?E:P;rst=2;rt=KOT;over2=1;cut=null;UL.length=0;TX.length=0;PR.length=0;HK.length=0;w.vit++;w.win=1;l.dead=1;l.hp=Math.max(0,l.hp);const d=w.x<l.x?1:-1;
    if(l.rg)l.rg.forEach(p=>{p.vx=l.vx*.6+d*(260+Math.random()*160);p.vy=-330-Math.random()*260});shk=10;wt=pvp?'Jogador '+(pw?1:2)+' venceu!':pw?'VOCÊ VENCEU!':'CPU VENCEU!'};
  const newRound=()=>{rd++;[[P,400,1],[E,1200,-1]].forEach(([f,xx,fc])=>Object.assign(f,{x:xx,y:GY,vx:0,vy:0,hp:f.mx,cd:[0,0,0],stun:0,slow:0,sh:0,shT:0,bf:0,bfv:0,face:fc,gr:true,dash:0,dcd:0,blk:false,atk:0,acd:0,hit:0,ph:0,hurt:0,awT:0,awP:0,awC:AWC,ulU:0,iv:0,mk:0,wk:0,dd:0,fu:0,sil:0,dz:0,rt:0,ice:0,dg:0,cn:0,nx:0,inv:0,cdx:0,dig:0,rgn:0,dot:[],dmo:null,dmf:null,dead:0,win:0,rag:0,dm:null,br:null,rg:null,did:0}));
    PR.length=0;FX.length=0;UL.length=0;TX.length=0;HK.length=0;mt=0;rst=1;rt=1.7;over2=1;cam.i=0};
  const ban=(tx,c,sub)=>{x.textAlign='center';x.font='900 54px sans-serif';x.lineWidth=7;x.strokeStyle='#000b';x.strokeText(tx,W/2,190);x.fillStyle=c;x.fillText(tx,W/2,190);if(sub){x.font='bold 20px sans-serif';x.lineWidth=4;x.strokeText(sub,W/2,226);x.fillStyle='#fff';x.fillText(sub,W/2,226)}};
  const loop=t=>{
    const dt0=paused?0:Math.min(.033,(t-last)/1000);last=t;if(cut&&!paused){cut.t+=dt0;if(cut.t>=CUTT){launch(cut);cut=null}}
    const ts=(rst===2&&rt>KOT-.8)?.3:1,dt=cut?0:dt0*ts;
    setAim(P,K);if(pvp)setAim(E,K2);[P,E].forEach(f=>f.cat=Math.max(0,(f.cat||0)-dt0));
    const ax=K.ax||(K.r-K.l);
    if(!paused){
      if(rst===0){mt+=dt;tickAw(P,dt);tickAw(E,dt);if(pvp){const k2=KS[1];P.face=E.x>P.x?1:-1;step(P,dt,ax,K,E);step(E,dt,k2.ax||(k2.r-k2.l),k2,P)}else{const A=ai(E,P,dt);cpuAw(dt);const dg=cpuDodge(dt);step(P,dt,ax,K,E);step(E,dt,dg||A.ax,A.inp,P)}E.face=P.x<E.x?-1:1;if(P.hp<=0||E.hp<=0)ko()}
      else{rt-=dt0;
        if(rst===1){P.face=E.x>P.x?1:-1;E.face=-P.face;step(P,dt,0,null,E);step(E,dt,0,null,P);if(rt<=0){rst=0;over2=0}}
        else{[P,E].forEach(f=>{if(f.dead){const h=f.rg&&f.rg[2];if(h){f.x=h.x;f.y=Math.min(GY,h.y+10)}}else step(f,dt,0,null,f===P?E:P)});if(rt<=0)newRound()}}
      if(dt>0){rig(P,dt,t);rig(E,dt,t)}
    }
    KS.forEach(k=>k.jump=k.dash=k.atk=0);shk=Math.max(0,shk-dt0*22);
    updPR(dt);
    for(let i=FX.length-1;i>=0;i--){FX[i].t-=dt;if(FX[i].t<=0)FX.splice(i,1)}for(let i=TX.length-1;i>=0;i--){TX[i].t-=dt;TX[i].y-=34*dt;if(TX[i].t<=0)TX.splice(i,1)}
    for(let i=HK.length-1;i>=0;i--){if(HK[i].fn(dt,HK[i]))HK.splice(i,1)}updUL(dt);camU(dt0);
    abs.forEach((r,pi)=>{const f=FT[pi],hd=UL.some(u=>u.k==='b'&&u.o===f&&u.st==='h'),rdy=f.awT<=0&&f.awC<=0;r[0].firstChild.textContent=f.awT>0?'🔥 '+Math.ceil(f.awT)+'s':rdy?'🔥 PRONTO':'⏳ '+Math.ceil(f.awC)+'s';r[0].style.opacity=f.awT>0?.55:rdy?1:.4;r[1].firstChild.textContent=hd?'🚀 LANÇAR':f.ulU?'✔ usado':AWD[f.aw].ic;r[1].style.opacity=(hd||(f.awT>0&&!f.ulU))?1:.35});
    pbs.forEach((r,pi)=>r.forEach((e,n)=>{const f=FT[pi],v=f.cd[n];const mxc=(f.W.p[n][3]*(1-f.s.cdr))||1;e.style.opacity=v>0?.85:1;e.firstChild.textContent=v>0?Math.ceil(v):f.W.p[n][0];e.firstChild.style.fontSize=v>0?'18px':'';e.lastChild.style.background=v>0?`conic-gradient(rgba(0,0,0,.66) ${Math.min(1,v/mxc)*360}deg,transparent 0)`:'transparent'}));

    const cw=cv.width,ch=cv.height,s=Math.min(cw/W,ch/H),ox=(cw-W*s)/2,oy=(ch-H*s)/2;
    x.setTransform(1,0,0,1,0,0);x.fillStyle='#0b0f1a';x.fillRect(0,0,cw,ch);
    x.setTransform(s,0,0,s,ox,oy);
    x.save();x.beginPath();x.rect(0,0,W,H);x.clip();
    {const z=cam.z,vw=W/z,cx=Math.max(vw/2,Math.min(WW-vw/2,cam.x)),mm=FD.M[MP];
      x.translate(W/2+(Math.random()-.5)*shk*2,H/2+(Math.random()-.5)*shk*2);x.scale(z,z);x.translate(-cx,-cam.y);
      x.fillStyle=mm[2];x.fillRect(-W,-3000,WW+2*W,3000);x.fillStyle=mm[4];x.fillRect(-W,H,WW+2*W,3000);}
    x.drawImage(BG,0,0,WW,H);{const mz=FD.M[MP][6];if(mz===2||mz===3){x.fillStyle=mz===2?'#ffb347':'#fff';for(let i=0;i<52;i++){const px=(i*83)%WW+(mz===3?Math.sin(t/700+i)*12:0),py=mz===2?GY-((i*61+t/20)%GY):(i*43+t/15)%GY;x.fillRect(px,py,mz===2?2:3,mz===2?2:3)}}}
    FX.forEach(e=>{e.t0=e.t0||e.t;const p=1-e.t/e.t0,r=Math.max(2,e.r*(.3+.9*p)),a=Math.min(1,e.t/e.t0*1.7),c=e.c||'#fc6';x.save();const gg=x.createRadialGradient(e.x,e.y,r*.15,e.x,e.y,r);gg.addColorStop(0,hexA(c,0));gg.addColorStop(.65,hexA(c,.16*a));gg.addColorStop(1,hexA(c,.5*a));x.fillStyle=gg;x.beginPath();x.arc(e.x,e.y,r,0,7);x.fill();
      x.globalCompositeOperation='lighter';x.strokeStyle=c;x.globalAlpha=a;x.lineWidth=2+5*a;x.beginPath();x.arc(e.x,e.y,r,0,7);x.stroke();x.strokeStyle='#fff';x.globalAlpha=a*.75;x.lineWidth=1.4;x.beginPath();x.arc(e.x,e.y,r*.93,0,7);x.stroke();
      x.globalAlpha=a*.9;x.strokeStyle=c;x.lineWidth=2;x.lineCap='round';for(let i=0;i<10;i++){const an=i*.6283+e.x*.013,r1=r*.72,r2=r*(.92+p*.3);x.beginPath();x.moveTo(e.x+Math.cos(an)*r1,e.y+Math.sin(an)*r1);x.lineTo(e.x+Math.cos(an)*r2,e.y+Math.sin(an)*r2);x.stroke()}
      if(p<.5){x.globalAlpha=(1-p*2)*.9;x.drawImage(glow('#fff'),e.x-r*.5,e.y-r*.5,r,r)}x.restore()});HK.forEach(h=>h.dr&&h.dr(h));PR.forEach(drawQ);
    x.globalAlpha=E.inv>0?.28:1;aura(E,t);body(E,'#ff7a7a',t);x.globalAlpha=P.inv>0?.28:1;aura(P,t);body(P,'#7ad0ff',t);x.globalAlpha=1;stI(E);stI(P);aimInd(P);aimInd(E);drawUL(t);TX.forEach(q=>{x.globalAlpha=Math.min(1,q.t*2);x.font='bold '+Math.round(16/Math.max(.7,cam.z))+'px sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='#000c';x.strokeText(q.s,q.x,q.y);x.fillStyle=q.c||'#fff';x.fillText(q.s,q.x,q.y);x.globalAlpha=1});
    x.restore();
    bar(P,P.c.nome,1);bar(E,E.c.nome,0);
    x.textAlign='center';x.font='bold 13px sans-serif';x.lineWidth=3;x.strokeStyle='#000a';{const r2='ROUND '+rd+'  ·  '+P.vit+' × '+E.vit;x.strokeText(r2,W/2,72);x.fillStyle='#fff';x.fillText(r2,W/2,72)}
    if(rst===1)ban(rt>.7?'ROUND '+rd:'LUTAR!','#ffd54a');else if(rst===2)ban('K.O.!','#ff5a4a',wt);
    if(cut)drawCut(t);
    raf=requestAnimationFrame(loop)};
  raf=requestAnimationFrame(loop);
}
})();
