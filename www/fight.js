/* Braresults — Jogo de luta (Parte 1: base, controles, 1 mapa de teste) */
(()=>{
const W=800,H=450,GY=380,G=1900;
const fallback=[1,2,3,4].map(i=>({id:i,nome:'Candidato '+i,foto:''}));
const imgs={};
const getImg=u=>{if(!u)return null;if(!imgs[u]){const i=new Image();i.src=u;imgs[u]=i}const i=imgs[u];return i.complete&&i.naturalWidth?i:null};
const cands=()=>{try{return (D&&D.c&&D.c.length?D.c:fallback).slice(0,40)}catch(e){return fallback}};
let SEL=null,SEL2=1,WP=0,AC=0,WP2=1,AC2=1,MP=0,DF=1,MD=0,run=null;

const mk=(x,c,face,w,a)=>{const s={spd:0,jmp:0,dmg:0,def:0,cdr:0,ls:0,hp:0,reg:0,acd:0,kbr:0,dcd:0,pdm:0,crit:0,...(a?a[2]:{})},mx=100+s.hp;
  return {x,y:GY,vx:0,vy:0,hp:mx,mx,s,W:w?{a:w[2],p:w.slice(3)}:{a:1,p:[]},cd:[0,0,0],stun:0,slow:0,sh:0,shT:0,bf:0,bfv:0,face,gr:true,c,img:c.foto,dash:0,dcd:0,blk:false,atk:0,acd:0,hit:0,ph:0,hurt:0}};
window.tabFight=()=>{
  const l=cands();SEL=l[SEL]?SEL:0;SEL2=l[SEL2]?SEL2:(l[1]?1:0);
  const chip=(act,i,on,e,n)=>`<button data-a="${act}" data-v="${i}" style="padding:6px 4px;border-radius:12px;border:2px solid ${on?'var(--ac,#4af)':'transparent'};background:rgba(128,128,128,.15);color:inherit;font-size:11px">${e}<br>${n}</button>`;
  const grid=h=>`<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(70px,1fr));gap:6px;margin:8px 0">${h}</div>`;
  const pk=(f,s,w,a)=>{const W=FD.W[w],A=FD.A[a];return `<b>Candidato</b>${grid(l.map((c,i)=>chip('fsel'+f,i,i===s,`<img src="${esc(c.foto||'')}" alt="" style="width:40px;height:40px;border-radius:50%;object-fit:cover" onerror="this.style.opacity=0">`,esc((c.nome||'').split(' ')[0]))).join(''))}
  <b>Arma</b>${grid(FD.W.map((x,i)=>chip('fw'+f,i,i===w,`<span style="font-size:22px">${x[0]}</span>`,x[1])).join(''))}
  <p class="sm"><b>${W[0]} ${W[1]}</b> · soco x${W[2]}<br>${W.slice(3).map((p,i)=>`P${i+1} <b>${p[0]}</b> — ${FD.T[p[1]]} ${p[2]}${p[1]==='H'?' de vida':p[1]==='B'?'%':p[1]==='S'?' de proteção':' de dano'} · ${p[3]}s`).join('<br>')}</p>
  <b>Acessório</b>${grid(FD.A.map((x,i)=>chip('fac'+f,i,i===a,`<span style="font-size:22px">${x[0]}</span>`,x[1])).join(''))}
  <p class="sm"><b>${A[0]} ${A[1]}</b>: ${FD.desc(A[2])}</p>`};
  return `<section class="bx"><h3>🥊 Arena dos Candidatos</h3>
  <b>Modo</b>${grid(chip('fmd',0,MD===0,'🤖','Eu vs CPU')+chip('fmd',1,MD===1,'👥','Eu vs amigo'))}
  <h4>${MD?'Jogador 1':'Seu lutador'}</h4>${pk('',SEL,WP,AC)}
  ${MD?'<h4>Jogador 2 (amigo)</h4>'+pk('2',SEL2,WP2,AC2):''}
  <b>Mapa</b>${grid(FD.M.map((m,i)=>chip('fmp',i,i===MP,`<span style="font-size:22px">${m[0]}</span>`,m[1])).join(''))}
  ${MD?'<p class="mut sm">Tela dividida: o jogador 1 usa os controles da metade esquerda e o jogador 2 os da metade direita.</p>':'<b>Dificuldade da CPU</b>'+grid(['😊 Fácil','😐 Normal','😈 Difícil'].map((n,i)=>chip('fdf',i,i===DF,'',n)).join(''))}
  <button data-a="fgo" style="width:100%;padding:14px;border-radius:12px;font-weight:700;font-size:16px">▶ Jogar ${MD?'(2 jogadores)':'vs CPU'}</button></section>`};
document.addEventListener('click',e=>{const t=e.target.closest('[data-a]');if(!t)return;const a=t.dataset.a,v=+t.dataset.v;
  if(!/^(fsel|fw|fac)2?$|^(fmp|fdf|fmd|fgo)$/.test(a))return;if(a==='fgo')return start();
  ({fsel:()=>SEL=v,fsel2:()=>SEL2=v,fw:()=>WP=v,fw2:()=>WP2=v,fac:()=>AC=v,fac2:()=>AC2=v,fmp:()=>MP=v,fdf:()=>DF=v,fmd:()=>MD=v})[a]();const y=scrollY;render();scrollTo(0,y)});

function start(){
  if(run)return;const pvp=MD===1,c=cands()[SEL];
  const o=document.createElement('div');o.id='fg';
  o.style.cssText='position:fixed;inset:0;z-index:99;background:#0b0f1a;touch-action:none;user-select:none;-webkit-user-select:none';
  const sz=innerWidth<720?38:44,KS=[],pbs=[],FT=[];
  o.innerHTML=`<canvas id="fgc" style="width:100%;height:100%;display:block"></canvas><button id="fx" style="position:absolute;top:calc(env(safe-area-inset-top,0px) + 8px);right:8px;padding:6px 12px;border-radius:10px;background:#0008;color:#fff;border:1px solid #fff4;z-index:2">✕ Sair</button>`;
  document.body.appendChild(o);
  const mkCtl=(i,host,L,wp)=>{const K={l:0,r:0,jump:0,dash:0,blk:0,atk:0,ax:0};KS[i]=K;
    const btn=(t,s,css)=>{host.insertAdjacentHTML('beforeend',`<button style="position:absolute;width:${s}px;height:${s}px;border-radius:50%;border:2px solid #fff6;background:#ffffff22;color:#fff;font-size:12px;font-weight:700;padding:0;touch-action:none;${css}">${t}</button>`);return host.lastElementChild};
    const hold=(e,k)=>{e.addEventListener('pointerdown',ev=>{ev.preventDefault();e.setPointerCapture(ev.pointerId);K[k]=1});const up=()=>{if(k==='blk')K.blk=0};e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up)};
    L.b.forEach(([k,t,s,css])=>hold(btn(t,s,css),k));
    pbs[i]=[0,1,2].map(n=>{const e=btn('<span style="display:block;overflow:hidden;font-size:9px;line-height:1.05">'+wp[3+n][0]+'</span>',L.ps,L.p[n]);e.addEventListener('pointerdown',ev=>{ev.preventDefault();cast(FT[i],FT[1-i],n)});return e});
    host.insertAdjacentHTML('beforeend',`<div style="position:absolute;${L.j};width:${L.js}px;height:${L.js}px;border-radius:50%;background:#ffffff18;border:2px solid #fff4;touch-action:none"><div style="position:absolute;left:${L.js/2-25}px;top:${L.js/2-25}px;width:50px;height:50px;border-radius:50%;background:#fffb"></div></div>`);
    const j=host.lastElementChild,kn=j.firstElementChild,jm=ev=>{const r=j.getBoundingClientRect(),h=L.js/2,dx=ev.clientX-(r.left+h),dy=ev.clientY-(r.top+h),d=Math.hypot(dx,dy)||1,m=Math.min(d,h*.7);kn.style.transform=`translate(${dx/d*m}px,${dy/d*m}px)`;K.ax=Math.abs(dx)>h*.2?(dx>0?1:-1):0;if(dy<-h*.6)K.jump=1};
    j.addEventListener('pointerdown',ev=>{j.setPointerCapture(ev.pointerId);jm(ev)});j.addEventListener('pointermove',ev=>{if(j.hasPointerCapture(ev.pointerId))jm(ev)});
    const jr=()=>{K.ax=0;kn.style.transform=''};j.addEventListener('pointerup',jr);j.addEventListener('pointercancel',jr)};
  const hostCss=(side)=>`position:absolute;bottom:env(safe-area-inset-bottom,0px);${side===2?'left:0;right:0;height:260px':'width:50%;height:130px;'+(side?'right:0;border-left:1px solid #fff3':'left:0')}`;
  const mkHost=side=>{o.insertAdjacentHTML('beforeend',`<div style="${hostCss(side)}"></div>`);return o.lastElementChild};
  if(pvp){const s=sz,g=s+4,pc=n=>`left:${112+n*g}px;bottom:${s+10}px`;
    [0,1].forEach(i=>mkCtl(i,mkHost(i),{j:'left:6px;bottom:6px',js:96,ps:s,p:[0,1,2].map(pc),b:[['jump','⤒',s,`left:112px;bottom:6px`],['dash','💨',s,`left:${112+g}px;bottom:6px`],['blk','🛡',s,`left:${112+2*g}px;bottom:6px`],['atk','👊',s+8,`left:${112+3*g}px;bottom:6px`]]},FD.W[i?WP2:WP]))}
  else mkCtl(0,mkHost(2),{j:'left:18px;bottom:18px',js:130,ps:50,p:['right:20px;bottom:214px','right:84px;bottom:190px','right:148px;bottom:150px'],b:[['atk','👊',64,'right:96px;bottom:70px'],['blk','🛡',54,'right:20px;bottom:150px'],['dash','💨',54,'right:20px;bottom:30px'],['jump','⤒',60,'right:170px;bottom:24px']]},FD.W[WP]);
  const K=KS[0];
  const kd=e=>{const v=e.type==='keydown'?1:0,k=e.key.toLowerCase();if(k==='arrowleft'||k==='a')K.l=v;if(k==='arrowright'||k==='d')K.r=v;if(v&&(k==='arrowup'||k==='w'))K.jump=1;if(v&&k==='k')K.dash=1;if(v&&k==='j')K.atk=1;if(k==='l')K.blk=v;if(v&&k.length===1&&'123'.includes(k))cast(FT[0],FT[1],+k-1)};
  addEventListener('keydown',kd);addEventListener('keyup',kd);

  const cv=o.querySelector('#fgc'),x=cv.getContext('2d');
  const fit=()=>{const d=Math.min(devicePixelRatio||1,1.5);cv.width=innerWidth*d;cv.height=innerHeight*d};fit();addEventListener('resize',fit);
  const P=mk(220,c,1,FD.W[WP],FD.A[AC]),E=pvp?mk(580,cands()[SEL2]||c,-1,FD.W[WP2],FD.A[AC2]):mk(580,cands()[(SEL+1+Math.floor(Math.random()*(cands().length-1||1)))%cands().length],-1,FD.W[Math.random()*20|0],FD.A[Math.random()*25|0]);FT.push(P,E);let last=performance.now(),raf;
  const stop=()=>{cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',kd);removeEventListener('resize',fit);o.remove();run=null};
  o.querySelector('#fx').onclick=stop;run=1;

  const M={pl:FD.M[MP][7]},PR=[],FX=[],LV=[{r:.35,b:.25,a:.5},{r:.2,b:.5,a:.75},{r:.1,b:.75,a:1}][DF];let over2=0;
  const SP=f=>230*(1+f.s.spd)*(f.bf>0?1+f.bfv:1)*(f.slow>0?.5:1);
  const hitF=(a,t,b,k,st,kb,dir)=>{dir=dir||a.face;let d=b*(1+a.s.dmg)*(k==='p'?1+a.s.pdm:1);if(Math.random()<a.s.crit)d*=2;d*=1-t.s.def;
    if(t.blk&&t.face===-dir){t.hp-=Math.max(1,d*.1);t.vx=dir*80;return}
    if(t.sh>0){const q=Math.min(t.sh,d);t.sh-=q;d-=q}
    t.hp-=d;a.hp=Math.min(a.mx,a.hp+d*a.s.ls);t.vx=dir*kb*(1-t.s.kbr);if(kb){t.vy=-220*(1-t.s.kbr);t.gr=false}t.hurt=.25;t.hit=.2;if(st)t.stun=Math.max(t.stun,st)};
  const shot=(f,d,sp,s,z,vy)=>PR.push({o:f,x:f.x+f.face*26,y:f.y-48,vx:f.face*sp,vy:vy||0,d,st:z?0:s,sl:z?s:0,z,t:1.6,dir:f.face});
  const cast=(f,t,i)=>{const p=f.W.p[i];if(!p||f.cd[i]>0||f.stun>0||f.blk)return;f.cd[i]=p[3]*(1-f.s.cdr);const [,k,d,,x,s]=p;
    if(k==='P'||k==='Z')shot(f,d,x||520,s,k==='Z');
    else if(k==='M')for(let j=-1;j<=1;j++)shot(f,d,620,s||0,0,j*60);
    else if(k==='A'){FX.push({x:f.x,y:f.y-40,r:x,t:.25});if(Math.abs(t.x-f.x)<x+22&&Math.abs(t.y-f.y)<90)hitF(f,t,d,'p',s||0,300,t.x>=f.x?1:-1)}
    else if(k==='D'){f.dash=.22;f.vx=f.face*700;f.dm=[d,s||0];f.dmh=0}
    else if(k==='H')f.hp=Math.min(f.mx,f.hp+d);
    else if(k==='S'){f.sh=d;f.shT=x}
    else if(k==='B'){f.bf=x;f.bfv=d/100}};
  const ai=(f,t,dt)=>{const a=f.ai||(f.ai={t:0,ax:0,blk:0});a.t-=dt;a.blk-=dt;
    if(a.t<=0){a.t=LV.r*(.6+Math.random()*.8);const d=t.x-f.x,ad=Math.abs(d),dir=d>0?1:-1;a.ax=0;a.at=a.jp=a.dh=0;f.face=dir;
      if(t.atk>0&&ad<120&&Math.random()<LV.b)a.blk=.45;
      else{if(ad>100)a.ax=dir;else if(ad<55&&Math.random()<.3)a.ax=-dir;
        if(ad<85&&Math.random()<LV.a)a.at=1;
        if(t.y<f.y-80&&Math.random()<.6||ad<150&&Math.random()<.08)a.jp=1;
        if(f.hp<f.mx*.3&&ad<100&&Math.random()<.4){a.dh=1;a.ax=-dir}}
      for(let i=0;i<3;i++){const p=f.W.p[i];if(!p||f.cd[i]>0||Math.random()>LV.a)continue;const k=p[1];
        if(('PZM'.includes(k)&&ad>140&&Math.abs(t.y-f.y)<90)||(k==='A'&&ad<p[4])||(k==='D'&&ad>60&&ad<200)||(k==='H'&&f.hp<f.mx*.6)||(k==='S'&&ad<160&&(t.atk>0||f.hp<f.mx*.7))||(k==='B'&&(ad>150||Math.random()<.2))){cast(f,t,i);break}}}
    const inp={blk:a.blk>0,atk:a.at,jump:a.jp,dash:a.dh};a.at=a.jp=a.dh=0;return{ax:a.ax,inp}};
  const end=w=>{over2=1;const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#000a;color:#fff;font:700 34px sans-serif';
    d.innerHTML=(pvp?(w?'🏆 Jogador 1 venceu!':'🏆 Jogador 2 venceu!'):(w?'🏆 VITÓRIA!':'💀 DERROTA'))+'<button id="fr" style="font-size:18px;padding:12px 28px;border-radius:12px">↻ Revanche</button><button id="fm" style="font-size:16px;padding:10px 28px;border-radius:12px">Menu</button>';
    o.appendChild(d);d.querySelector('#fr').onclick=()=>{stop();start()};d.querySelector('#fm').onclick=stop};
  const step=(f,dt,ax,inp,tgt)=>{if(f.stun>0){f.stun-=dt;inp=null;ax=0}f.slow-=dt;f.bf-=dt;f.shT-=dt;if(f.shT<=0)f.sh=0;f.hp=Math.min(f.mx,f.hp+f.s.reg*dt);for(let i=0;i<3;i++)f.cd[i]-=dt;
    f.ph+=dt*(Math.abs(f.vx)>10?10:0);f.acd=Math.max(0,f.acd-dt);f.dcd=Math.max(0,f.dcd-dt);f.hit=Math.max(0,f.hit-dt);f.hurt=Math.max(0,f.hurt-dt);
    f.blk=!!(inp&&inp.blk&&f.gr);
    if(f.dash>0){f.dash-=dt}else if(!f.blk&&f.hurt<=0){f.vx=ax*SP(f);if(ax)f.face=ax}
    if(inp){
      if(inp.jump&&f.gr&&!f.blk){f.vy=-720*(1+f.s.jmp);f.gr=false}
      if(inp.dash&&f.dcd<=0){f.dash=.18;f.dcd=.8*(1-f.s.dcd);f.vx=(ax||f.face)*620;f.face=ax||f.face}
      if(inp.atk&&f.acd<=0&&!f.blk){f.atk=.22;f.acd=.45*(1-f.s.acd);f.did=0}
    }
    if(f.atk>0){f.atk-=dt;if(!f.did&&f.atk<.14&&tgt){f.did=1;const d=(tgt.x-f.x)*f.face;if(d>0&&d<85&&Math.abs(tgt.y-f.y)<70){
      hitF(f,tgt,8*f.W.a,'m',0,260)}}}
    f.vy+=G*dt;f.x+=f.vx*dt;const py=f.y;f.y+=f.vy*dt;f.gr=false;let gy=GY;if(f.vy>=0)for(const q of M.pl)if(f.x>q[0]-8&&f.x<q[0]+q[1]+8&&py<=q[2]+2&&f.y>=q[2])gy=Math.min(gy,q[2]);
    if(f.y>=gy){f.y=gy;f.vy=0;f.gr=true;if(f.hurt>0)f.vx*=.9}
    f.x=Math.max(30,Math.min(W-30,f.x));if(f.dm&&tgt){if(f.dash>0&&!f.dmh&&Math.abs(tgt.x-f.x)<50&&Math.abs(tgt.y-f.y)<70){f.dmh=1;hitF(f,tgt,f.dm[0],'p',f.dm[1],200)}if(f.dash<=0)f.dm=null}
    if(f.hurt>0)f.vx*=.96;
  };
  const stick=(f,col)=>{
    const hy=f.y-62,sw=Math.sin(f.ph)*14,ar=f.atk>0?1:0;
    x.strokeStyle=col;x.lineWidth=4;x.lineCap='round';x.beginPath();
    x.moveTo(f.x,hy+22);x.lineTo(f.x,f.y-24);
    x.moveTo(f.x,f.y-24);x.lineTo(f.x-sw-4,f.y);x.moveTo(f.x,f.y-24);x.lineTo(f.x+sw+4,f.y);
    if(f.blk){x.moveTo(f.x,hy+34);x.lineTo(f.x+f.face*20,hy+24)}
    else{x.moveTo(f.x,hy+34);x.lineTo(f.x-f.face*14,hy+50+sw*.3);x.moveTo(f.x,hy+34);x.lineTo(f.x+f.face*(ar?46:14),ar?hy+32:hy+50-sw*.3)}
    x.stroke();
    if(f.blk||f.sh>0){x.strokeStyle='#5bf8';x.lineWidth=3;x.beginPath();x.arc(f.x,f.y-45,46,0,7);x.stroke()}
    x.save();x.beginPath();x.arc(f.x,hy,22,0,7);x.clip();const im=getImg(f.img);
    if(im){const s=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-s)/2,(im.naturalHeight-s)/2,s,s,f.x-22,hy-22,44,44)}else{x.fillStyle='#8899aa';x.fill()}
    x.restore();x.strokeStyle=f.hit>0?'#f55':col;x.lineWidth=3;x.beginPath();x.arc(f.x,hy,22,0,7);x.stroke();
  };
  const bar=(f,l,left)=>{const w=240,xx=left?16:W-16-w;x.fillStyle='#0008';x.fillRect(xx,14,w,16);x.fillStyle=f.hp>30?'#4c6':'#e44';x.fillRect(xx,14,w*Math.max(0,f.hp)/f.mx,16);x.fillStyle='#fff';x.font='bold 12px sans-serif';x.textAlign=left?'left':'right';x.fillText((l||'').split(' ')[0]+' '+Math.ceil(Math.max(0,f.hp)),left?xx:xx+w,44)};

  const paint=(x,t)=>{const m=FD.M[MP],g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,m[2]);g.addColorStop(1,m[3]);x.fillStyle=g;x.fillRect(0,0,W,H);
    const tri=(c,n,w,h,o2)=>{x.fillStyle=c;for(let i=0;i<n;i++){x.beginPath();x.moveTo(i*w-w/3,GY);x.lineTo(i*w+w/2,GY-h-(i*37+o2)%50);x.lineTo(i*w+w*1.3,GY);x.fill()}};
    if(m[6]===0){x.fillStyle='#ffe9a0';x.beginPath();x.arc(650,90,38,0,7);x.fill();tri('#4a8a5a',4,230,100,0)}
    else if(m[6]===1){x.fillStyle='#fff';for(let i=0;i<40;i++)x.fillRect(i*97%W,i*53%250,2,2);x.fillStyle='#e8e8f8';x.beginPath();x.arc(120,80,28,0,7);x.fill();x.fillStyle='#14182c';for(let i=0;i<9;i++)x.fillRect(i*95,GY-50-(i*37%90),60,200)}
    else if(m[6]===2){tri('#3a1410',4,230,120,10);x.fillStyle='#ff5a1f55';x.fillRect(0,GY-30,W,30);x.fillStyle='#ffb347';for(let i=0;i<25;i++)x.fillRect(i*83%W,(i*61+t/20)%GY,2,2)}
    else if(m[6]===3){tri('#bfe6ff',4,230,110,20);x.fillStyle='#fff';for(let i=0;i<50;i++)x.fillRect(i*71%W,(i*43+t/15)%GY,3,3)}
    else{x.strokeStyle='#f0f6';x.lineWidth=1;for(let i=0;i<=16;i++){x.beginPath();x.moveTo(W/2+(i-8)*20,250);x.lineTo((i-8)*90+W/2,GY);x.stroke()}for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,250+i*i*5);x.lineTo(W,250+i*i*5);x.stroke()}}
    x.fillStyle=m[4];x.fillRect(0,GY,W,H-GY);x.fillStyle=m[5];x.fillRect(0,GY,W,4);M.pl.forEach(q=>{x.fillStyle=m[5];x.fillRect(q[0],q[2],q[1],9);x.fillStyle='#fff3';x.fillRect(q[0],q[2],q[1],2)});};
  const BG=document.createElement('canvas');BG.width=W*1.5;BG.height=H*1.5;{const c2=BG.getContext('2d');c2.scale(1.5,1.5);paint(c2,0)}
  const loop=t=>{
    const dt=Math.min(.033,(t-last)/1000);last=t;
    const ax=K.ax||(K.r-K.l);
    if(!over2){if(pvp){const k2=KS[1];P.face=E.x>P.x?1:-1;step(P,dt,ax,K,E);step(E,dt,k2.ax||(k2.r-k2.l),k2,P)}else{const A=ai(E,P,dt);step(P,dt,ax,K,E);step(E,dt,A.ax,A.inp,P)}E.face=P.x<E.x?-1:1;if(E.hp<=0)end(1);else if(P.hp<=0)end(0)}
    KS.forEach(k=>k.jump=k.dash=k.atk=0);
    for(let i=PR.length-1;i>=0;i--){const q=PR[i],t=q.o===P?E:P;q.x+=q.vx*dt;q.y+=q.vy*dt;q.t-=dt;
      if(Math.abs(q.x-t.x)<26&&Math.abs(q.y-(t.y-45))<50){hitF(q.o,t,q.d,'p',q.st,260,q.dir);if(q.sl)t.slow=q.sl;PR.splice(i,1)}else if(q.t<=0||q.x<0||q.x>W)PR.splice(i,1)}
    for(let i=FX.length-1;i>=0;i--){FX[i].t-=dt;if(FX[i].t<=0)FX.splice(i,1)}
    pbs.forEach((r,pi)=>r.forEach((e,n)=>{const f=FT[pi],v=f.cd[n];e.style.opacity=v>0?.4:1;e.firstChild.textContent=v>0?Math.ceil(v):f.W.p[n][0]}));
    
    const cw=cv.width,ch=cv.height,s=Math.min(cw/W,ch/H),ox=(cw-W*s)/2,oy=(ch-H*s)/2;
    x.setTransform(1,0,0,1,0,0);x.fillStyle='#0b0f1a';x.fillRect(0,0,cw,ch);
    x.setTransform(s,0,0,s,ox,oy);
    x.drawImage(BG,0,0,W,H);
    FX.forEach(e=>{x.strokeStyle='#fc6';x.lineWidth=5;x.globalAlpha=e.t*4;x.beginPath();x.arc(e.x,e.y,e.r*(1.2-e.t*.8),0,7);x.stroke();x.globalAlpha=1});PR.forEach(q=>{x.fillStyle=q.z?'#8cf':'#ffd54a';x.beginPath();x.arc(q.x,q.y,7,0,7);x.fill()});stick(E,'#ff7a7a');stick(P,'#7ad0ff');bar(P,P.c.nome,1);bar(E,E.c.nome,0);
    raf=requestAnimationFrame(loop)};
  raf=requestAnimationFrame(loop);
}
})();
