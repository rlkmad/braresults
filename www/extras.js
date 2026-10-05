(()=>{if(window.CanvasRenderingContext2D&&!CanvasRenderingContext2D.prototype.roundRect)CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){r=Math.max(0,Math.min(Array.isArray(r)?r[0]||0:r||0,w/2,h/2));this.moveTo(x+r,y);this.arcTo(x+w,y,x+w,y+h,r);this.arcTo(x+w,y+h,x,y+h,r);this.arcTo(x,y+h,x,y,r);this.arcTo(x,y,x+w,y,r);this.closePath()};
const Z={s:1,x:0,y:0},$i=id=>document.getElementById(id);let g=null,g1=null,sup=0,lp=0,lt=0,lastTap=0;
const lim=()=>{const w=$i('mapsvg');if(!w)return;Z.s=Math.max(1,Math.min(8,Z.s));Z.x=Math.min(0,Math.max(w.clientWidth*(1-Z.s),Z.x));Z.y=Math.min(0,Math.max(w.clientHeight*(1-Z.s),Z.y))};
const rs=()=>{Z.s=1;Z.x=Z.y=0;ap()};window.zoomBack=()=>{if(Z.s>1.001){rs();return true}return false};
function ap(){const m=$i('msvg'),w=$i('mapsvg');if(!m||!w)return;const z=Z.s>1.001;m.style.transformOrigin='0 0';m.style.transform=z?`translate3d(${Z.x}px,${Z.y}px,0) scale(${Z.s})`:'';w.style.touchAction=z?'none':'pan-y';let b=w.querySelector('.zr');if(z&&!b){b=document.createElement('button');b.className='zr';b.textContent='Zoom 1×';b.onclick=ev=>{ev.stopPropagation();rs()};w.append(b)}else if(!z&&b)b.remove()}
new MutationObserver(()=>{const w=$i('mapsvg');if(w&&!w.dataset.o){w.dataset.o=1;new MutationObserver(ap).observe(w,{childList:true})}ap()}).observe(document.body,{childList:true,subtree:true});
const hide=()=>{const q=$i('qs');q&&q.remove()};
const D2=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);
document.addEventListener('touchstart',e=>{hide();const w=e.target.closest&&e.target.closest('#mapsvg');if(!w)return;const r=w.getBoundingClientRect(),T=e.touches;clearTimeout(lp);
if(T.length===2){g={d:D2(T[0],T[1]),s:Z.s,x:Z.x,y:Z.y,cx:(T[0].clientX+T[1].clientX)/2-r.left,cy:(T[0].clientY+T[1].clientY)/2-r.top};g1=null}
else if(T.length===1){g1={x0:T[0].clientX,y0:T[0].clientY,x:Z.x,y:Z.y,mv:0};const p=e.target.closest('path[data-m=uf],g[data-m=uf]');if(p&&Z.s<=1.001){const u=p.dataset.v;lp=setTimeout(()=>{if(g1&&!g1.mv&&window.mapQuick){sup=1;navigator.vibrate&&navigator.vibrate(18);const d=document.createElement('div');d.id='qs';d.innerHTML=window.mapQuick(u);document.body.append(d);setTimeout(hide,4500)}},450)}}},{passive:true});
document.addEventListener('touchmove',e=>{const w=$i('mapsvg');if(!w)return;const T=e.touches,r=w.getBoundingClientRect();
if(g&&T.length===2){e.preventDefault();const ns=Math.max(1,Math.min(8,g.s*D2(T[0],T[1])/g.d)),cx=(T[0].clientX+T[1].clientX)/2-r.left,cy=(T[0].clientY+T[1].clientY)/2-r.top;Z.x=cx-(g.cx-g.x)/g.s*ns;Z.y=cy-(g.cy-g.y)/g.s*ns;Z.s=ns;g.mv=1;lim();ap()}
else if(g1&&T.length===1){const dx=T[0].clientX-g1.x0,dy=T[0].clientY-g1.y0;if(Math.hypot(dx,dy)>8){g1.mv=1;clearTimeout(lp)}if(Z.s>1.001){e.preventDefault();Z.x=g1.x+dx;Z.y=g1.y+dy;lim();ap()}}},{passive:false});
document.addEventListener('touchend',e=>{clearTimeout(lp);if(e.touches.length)return;const moved=(g&&g.mv)||(g1&&g1.mv);if(g1&&!g1.mv&&!sup){const t=Date.now();if(t-lastTap<300&&Z.s>1.001){rs();sup=1}lastTap=t}if(moved||sup){setTimeout(()=>sup=0,350)}g=g1=null});
document.addEventListener('click',e=>{if(sup&&e.target.closest('#mapsvg')){e.stopPropagation();e.preventDefault();return}const m=e.target.closest('[data-m]');if(m&&m.dataset.m!=='heat'&&Z.s>1)rs();if(e.target.closest('[data-a=tab]'))navigator.vibrate&&navigator.vibrate(8)},true);
/* compartilhar como imagem */
document.addEventListener('click',async e=>{if(!e.target.closest('[data-a=sh]'))return;const r=cur();if(!r)return;e.stopImmediatePropagation();
const cs=getComputedStyle(document.documentElement),V=k=>cs.getPropertyValue(k).trim()||'#19e06b',W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
const bg=x.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#04101c');bg.addColorStop(1,'#02060d');x.fillStyle=bg;x.fillRect(0,0,W,H);
const gl=x.createRadialGradient(W*.8,0,0,W*.8,0,700);gl.addColorStop(0,V('--v')+'55');gl.addColorStop(1,'transparent');x.fillStyle=gl;x.fillRect(0,0,W,H);
x.fillStyle=V('--v');x.font='800 40px system-ui';x.fillText('BRARESULTS · APURAÇÃO 2026',70,110);
x.fillStyle='#fff';x.font='800 64px system-ui';x.fillText(String(r.nome||'').slice(0,26),70,200);x.fillStyle='#8aa0c8';x.font='500 36px system-ui';x.fillText(`${r.esc.nome} · ${r.turno}º turno · ${pc(r.sp)} apurado`,70,256);
const col=[V('--v'),V('--b'),V('--y'),V('--g3'),'#8aa0c8'];
r.c.slice(0,5).forEach((q,i)=>{const y=340+i*200;x.fillStyle='#fff';x.font='800 48px system-ui';x.fillText(String(q.nome).slice(0,24),70,y);x.fillStyle='#8aa0c8';x.font='500 34px system-ui';x.fillText(`${q.partido} · ${n(q.votos)} votos`,70,y+50);x.textAlign='right';x.fillStyle=col[i];x.font='800 64px system-ui';x.fillText(pc(q.pct),W-70,y+20);x.textAlign='left';
x.fillStyle='#ffffff18';x.beginPath();x.roundRect(70,y+76,W-140,18,9);x.fill();x.fillStyle=col[i];x.beginPath();x.roundRect(70,y+76,Math.max(18,(W-140)*Math.min(100,q.pct)/100),18,9);x.fill()});
x.fillStyle='#5f7399';x.font='500 30px system-ui';x.fillText(`Fonte: TSE · atualização ${r.tse}`,70,H-70);
c.toBlob(async b=>{if(!b)return;const f=new File([b],'braresults.png',{type:'image/png'});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f]});return}}catch(_){}
const o=document.createElement('div');o.id='shimg';o.innerHTML=`<img src="${URL.createObjectURL(b)}" alt=""><p>Segure a imagem para salvar ou compartilhar.</p><button class="more">Fechar</button>`;o.onclick=ev=>{if(ev.target.tagName!=='IMG')o.remove()};document.body.append(o)},'image/png')},true);
/* alerta de disputa apertada (app aberto) */
const R1=window.render;window.render=function(){R1();if(S.tab==='cfg'){const a=$i('app');a&&a.insertAdjacentHTML('beforeend',`<section class="bx"><h3>Disputa apertada</h3><p class="mut sm">Avisa quando a diferença entre os dois primeiros ficar abaixo do valor escolhido. Funciona com o app aberto.</p><select id="ma">${[['0','Desligado'],['0.5','Menos de 0,5 p.p.'],['1','Menos de 1 p.p.'],['2','Menos de 2 p.p.'],['3','Menos de 3 p.p.']].map(([v,t])=>`<option value="${v}"${String(S.ma||0)===v?' selected':''}>${t}</option>`).join('')}</select></section>`)}};
document.addEventListener('change',e=>{if(e.target.id==='ma'){S.ma=+e.target.value;arm=1;save()}});let arm=1;
setInterval(()=>{if(!S.ma||EM||!D)return;const r=cur();if(!r||!r.c||r.c.length<2)return;const m=r.c[0].pct-r.c[1].pct;if(m<=S.ma&&arm){arm=0;const t=`${r.nome}: diferença de ${m.toFixed(2).replace('.',',')} p.p.`,b=`${r.c[0].nome} × ${r.c[1].nome}`;toast('⚡ Disputa apertada\n'+t+'\n'+b);navigator.vibrate&&navigator.vibrate([40,40,40]);typeof notifyNow==='function'&&!quiet()&&notifyNow('Disputa apertada',t+' · '+b)}else if(m>S.ma+.3)arm=1},4000);
})();
/* botão voltar do Android e toque na notificação (plugins nativos) */
(()=>{const App=plug('App');
if(App&&App.addListener)App.addListener('backButton',()=>{
const sh=document.getElementById('shimg');if(sh){sh.remove();return}
const q=document.getElementById('qs');if(q){q.remove();return}
if(window.zoomBack&&window.zoomBack())return;
if(RP){rpStop();render();return}
if(window.mapBack&&window.mapBack())return;
if(EM||RB){rpLive();return}
if(S.tab!=='res'){S.tab='res';save();render();return}
App.minimizeApp?App.minimizeApp():App.exitApp&&App.exitApp()});
const LNp=LN();
if(LNp&&LNp.addListener)LNp.addListener('localNotificationActionPerformed',a=>{try{const nt=(a&&a.notification)||{};let x=nt.extra;
if(typeof x==='string'){try{x=JSON.parse(x)}catch(_){x=null}}
if(!x||!x.cargo){const b=String(nt.body||'');x=S.favs.filter(f=>f.label&&b.includes(f.label)).sort((p,q)=>q.label.length-p.label.length)[0]||null}
if(!x||!x.cargo)return;
rpStop();S.cargo=x.cargo;S.regiao=x.regiao||'';S.uf=x.uf||'';S.mun=x.mun||'';S.tab='res';if(S.uf)loadMun(S.uf);sel()}catch(_){}})})();

/* batimento: avisa o serviço em segundo plano que o app está aberto (evita notificação duplicada) */
setInterval(()=>{if(document.visibilityState==='visible'&&S.al)sync()},60000);
