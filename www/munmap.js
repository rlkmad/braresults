/* Mapa com todos os municípios (v1.7.0) — desenha ~5.570 cidades em UM <canvas>.
   Liga/desliga pelo botão "Municípios" do mapa. Sem a malha, o mapa de estados continua igual. */
(()=>{const X=window.MMX;if(!X)return;
const{CU,UC,IB,pcol,tseCd,gj,MP}=X,$=id=>document.getElementById(id);
const MM=window.MM={on:LS.get('mm.on',true),P:null,ub:null,full:null,ld:0,err:'',res:{},sel:null,v:null,vk:'',names:LS.get('mm.nm',{}),busy:0,tok:0,tick:0};
const NONE='#27324d',key=()=>MP.c+tn(),R=()=>MP.reg?REG.find(r=>r.id===MP.reg):null;
const ufOf=c=>CU[String(c).slice(0,2)];
const lsSet=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return 1}catch{return 0}};
/* ---------- A. geometria ---------- */
const px=l=>+((l+74)*.96).toFixed(3),py=t=>+(5.6-t).toFixed(3);
/* guarda cada anel como inteiros (centésimos de grau) em deltas; descarta pontos repetidos */
function pack(g){const out=[],P=g.type==='Polygon'?[g.coordinates]:g.coordinates;for(const poly of P){const r=poly[0];if(!r||r.length<4)continue;let a=[],lx=null,ly=null,fx=0,fy=0;for(const q of r){const x=Math.round(q[0]*100),y=Math.round(q[1]*100);if(x===lx&&y===ly)continue;if(lx===null){a.push(x,y);fx=x;fy=y}else a.push(x-lx,y-ly);lx=x;ly=y}if(a.length>=8)out.push(a)}return out}
function build(raw){const P=[];for(const code in raw){const rings=raw[code],p=new Path2D();let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;for(const a of rings){let x=a[0],y=a[1];for(let i=0;i<a.length;i+=2){if(i){x+=a[i];y+=a[i+1]}const X1=px(x/100),Y1=py(y/100);i?p.lineTo(X1,Y1):p.moveTo(X1,Y1);if(X1<x0)x0=X1;if(X1>x1)x1=X1;if(Y1<y0)y0=Y1;if(Y1>y1)y1=Y1}p.closePath()}if(x1>x0)P.push({c:code,u:ufOf(code),b:[x0,y0,x1,y1],p,a:(x1-x0)*(y1-y0)})}
P.sort((m,n)=>n.a-m.a);/* maiores primeiro: as pequenas (enclaves) ficam por cima */
MM.P=P;MM.ub={};const f=[1e9,1e9,-1e9,-1e9];for(const m of P){const b=MM.ub[m.u]=MM.ub[m.u]||[1e9,1e9,-1e9,-1e9];for(let i=0;i<4;i++){const lo=i<2;b[i]=lo?Math.min(b[i],m.b[i]):Math.max(b[i],m.b[i]);f[i]=lo?Math.min(f[i],m.b[i]):Math.max(f[i],m.b[i])}}MM.full=f;MM.by={};for(const m of P)MM.by[m.c]=m;MM.bt=null}
async function loadGeo(){if(MM.P||MM.ld)return;MM.ld=1;MM.err='';window.mapDraw&&window.mapDraw();try{let raw=LS.get('mm.geo1',null);if(!raw){const j=await gj(IB+'v3/malhas/paises/BR?formato=application/vnd.geo+json&qualidade=minima&intrarregiao=municipio');raw={};for(const f of j.features){const c=String(f.properties.codarea);if(!ufOf(c))continue;const r=pack(f.geometry);if(r.length)raw[c]=r}if(Object.keys(raw).length<5000)throw Error('malha incompleta');lsSet('mm.geo1',raw)}build(raw);MM.vk=''}catch(e){MM.err=e.message||'erro'}MM.ld=0;window.mapDraw&&window.mapDraw();fetchAll()}
async function loadNames(){const us=Object.keys(UC).filter(u=>!Object.keys(MM.names).some(c=>ufOf(c)===u));if(!us.length)return;let i=0;await Promise.all(Array.from({length:4},async()=>{while(i<us.length){const u=us[i++];try{for(const x of await gj(IB+'v1/localidades/estados/'+UC[u]+'/municipios'))MM.names[String(x.id)]=x.nome}catch{}}}));lsSet('mm.nm',MM.names)}
/* ---------- B. cores / dados dos vencedores ---------- */
const store=()=>MM.res[key()]=MM.res[key()]||(()=>{const w=LS.get('mm.w:'+key(),{}),o={};for(const c in w)o[c]={p:w[c][0],sp:w[c][1]};return o})();
const cdOf=c=>{const m=MM.names[c];return m&&MUN[ufOf(c)]?tseCd(ufOf(c),m):null};
const save=()=>{const o={},s=store();for(const c in s)if(s[c].p)o[c]=[s[c].p,s[c].sp];lsSet('mm.w:'+key(),o)};
let rp=0;const repaint=()=>{if(rp)return;rp=setTimeout(()=>{rp=0;MM.bt=null;paint()},1200)};
async function one1(c,k,tok){const u=ufOf(c),cd=cdOf(c);if(!cd)return;const s=store();try{const r=await one(MP.c,tn(),u,cd);if(tok!==MM.tok)return;s[c]={p:r.c[0]?r.c[0].partido:'',sp:r.sp,c:r.c.slice(0,4).map(x=>({n:x.nome,p:x.partido,v:x.votos,q:x.pct})),t:Date.now()}}catch(e){if(tok!==MM.tok)return;if(e.message==='SEM')s[c]={p:'',sp:0,none:1,t:Date.now()}}repaint()}
async function fetchAll(){if(!MM.on||!MM.P||MM.busy||document.hidden||S.tab!=='map')return;MM.busy=1;const tok=++MM.tok;try{await loadNames();if(!Object.keys(MUN).length)await loadMun('sp');const s=store(),now=Date.now(),first=MP.uf;
const L=MM.P.filter(m=>{const x=s[m.c];return!x||(x.sp<100&&now-(x.t||0)>(x.none?60000:90000))}).sort((a,b)=>(b.u===first)-(a.u===first));let i=0;
await Promise.all(Array.from({length:8},async()=>{while(i<L.length&&tok===MM.tok){const m=L[i++];await one1(m.c,key(),tok)}}));if(tok===MM.tok){save();MM.bt=null;window.mapDraw&&window.mapDraw()}}finally{MM.busy=0}}
/* ---------- C. canvas ---------- */
let cv=null,ctx=null,S0=1,TX=0,TY=0,all=null,gz=null;const dpr=()=>Math.min(window.devicePixelRatio||1,2.5);
const focus=u=>MP.uf?u===MP.uf:R()?R().ufs.includes(u):true;
function target(){const pd=b=>{const p=Math.max(b[2]-b[0],b[3]-b[1])*.04;return[b[0]-p,b[1]-p,b[2]-b[0]+2*p,b[3]-b[1]+2*p]};if(MP.uf&&MM.ub[MP.uf])return pd(MM.ub[MP.uf]);const r=R();if(r){const bs=r.ufs.filter(u=>MM.ub[u]).map(u=>MM.ub[u]);if(bs.length)return pd(bs.reduce((a,c)=>[Math.min(a[0],c[0]),Math.min(a[1],c[1]),Math.max(a[2],c[2]),Math.max(a[3],c[3])]))}return pd(MM.full)}
function fit(){if(!cv)return;const W=cv.width,H=cv.height,v=MM.v;S0=Math.min(W/v[2],H/v[3]);TX=(W-v[2]*S0)/2-v[0]*S0;TY=(H-v[3]*S0)/2-v[1]*S0}
function batches(){if(MM.bt)return MM.bt;const s=store(),B={};all=all||(()=>{const p=new Path2D();for(const m of MM.P)p.addPath(m.p);return p})();for(const m of MM.P){const x=s[m.c],c=x&&x.p?pcol(x.p):NONE,k=c+(focus(m.u)?'|1':'|0');(B[k]=B[k]||new Path2D()).addPath(m.p)}return MM.bt=B}
function paint(){if(!cv||!MM.P||!MM.v)return;fit();const g=cv.getContext('2d'),W=cv.width,H=cv.height;g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,W,H);g.setTransform(S0,0,0,S0,TX,TY);const B=batches();
for(const k in B){const f=k.endsWith('|1');g.globalAlpha=f?.92:.16;g.fillStyle=k.slice(0,-2);g.fill(B[k])}g.globalAlpha=.4;g.lineWidth=.7*dpr()/S0;g.strokeStyle='#fff';g.lineJoin='round';g.stroke(all);g.globalAlpha=1;
if(MM.sel){const m=MM.by[MM.sel.code];if(m){g.lineWidth=2.2*dpr()/S0;g.strokeStyle='#fff';g.stroke(m.p)}}cv.style.transform='';gz=null}
function mount(a){const w=a.clientWidth||320,h=a.clientHeight||360,d=dpr();let c=a.querySelector('#mcv');if(!c){a.innerHTML='<canvas id="mcv" aria-label="Mapa dos municípios"></canvas>';c=a.firstChild;bind(c)}
if(c.width!==Math.round(w*d)||c.height!==Math.round(h*d)){c.width=Math.round(w*d);c.height=Math.round(h*d)}cv=c;const vk=MP.uf+'|'+MP.reg;if(MM.vk!==vk||!MM.v){MM.vk=vk;MM.v=target();MM.bt=null}paint()}
/* gestos: durante o toque só transforma por CSS (60 fps); ao soltar, redesenha nítido */
function commit(){if(!gz||!cv)return;const s=gz.s,cw=cv.clientWidth,ch=cv.clientHeight,d=dpr(),wx=cx=>(cx*d-TX)/S0,wy=cy=>(cy*d-TY)/S0,x0=wx(-gz.x/s),y0=wy(-gz.y/s),x1=wx((cw-gz.x)/s),y1=wy((ch-gz.y)/s),F=target0();let v=[x0,y0,x1-x0,y1-y0];if(v[2]>F[2]*1.05)v=F.slice();if(v[2]<F[2]/80){const k=F[2]/80/v[2];v=[v[0]+v[2]*(1-k)/2,v[1]+v[3]*(1-k)/2,v[2]*k,v[3]*k]}MM.v=v;paint()}
const target0=()=>{const b=MM.full,p=Math.max(b[2]-b[0],b[3]-b[1])*.04;return[b[0]-p,b[1]-p,b[2]-b[0]+2*p,b[3]-b[1]+2*p]};
let ct=0;const cssT=()=>{cv.style.transformOrigin='0 0';cv.style.transform=`translate3d(${gz.x}px,${gz.y}px,0) scale(${gz.s})`;clearTimeout(ct);ct=setTimeout(commit,160)};
function bind(c){const D=(a,b)=>Math.hypot(a.clientX-b.clientX,a.clientY-b.clientY);let st=null;const zoomed=()=>MM.v&&MM.full&&MM.v[2]<target0()[2]*.97;
c.addEventListener('touchstart',e=>{const r=c.getBoundingClientRect(),T=e.touches;if(!gz)gz={s:1,x:0,y:0};if(T.length===2)st={d:D(T[0],T[1]),s:gz.s,x:gz.x,y:gz.y,cx:(T[0].clientX+T[1].clientX)/2-r.left,cy:(T[0].clientY+T[1].clientY)/2-r.top};else if(T.length===1)st={x0:T[0].clientX,y0:T[0].clientY,x:gz.x,y:gz.y,one:1,mv:0};clearTimeout(ct)},{passive:true});
c.addEventListener('touchmove',e=>{if(!st||!gz)return;const T=e.touches,r=c.getBoundingClientRect();if(T.length===2&&st.d){e.preventDefault();const ns=Math.max(.2,Math.min(12,st.s*D(T[0],T[1])/st.d)),cx=(T[0].clientX+T[1].clientX)/2-r.left,cy=(T[0].clientY+T[1].clientY)/2-r.top;gz.x=cx-(st.cx-st.x)/st.s*ns;gz.y=cy-(st.cy-st.y)/st.s*ns;gz.s=ns;st.mv=1;cssT()}
else if(T.length===1&&st.one){const dx=T[0].clientX-st.x0,dy=T[0].clientY-st.y0;if(Math.hypot(dx,dy)>8)st.mv=1;if(zoomed()||gz.s!==1){e.preventDefault();gz.x=st.x+dx;gz.y=st.y+dy;cssT()}}},{passive:false});
c.addEventListener('touchend',e=>{if(!e.touches.length){if(st&&st.mv&&gz)commit();st=null}});
c.addEventListener('touchcancel',()=>{st=null;if(gz)commit()});
c.addEventListener('wheel',e=>{e.preventDefault();const r=c.getBoundingClientRect();gz=gz||{s:1,x:0,y:0};const k=e.deltaY<0?1.25:.8,cx=e.clientX-r.left,cy=e.clientY-r.top;gz.x=cx-(cx-gz.x)*k;gz.y=cy-(cy-gz.y)*k;gz.s*=k;cssT()},{passive:false});
c.addEventListener('click',e=>{const r=c.getBoundingClientRect(),d=dpr(),x=((e.clientX-r.left)*d-TX)/S0,y=((e.clientY-r.top)*d-TY)/S0,m=hit(x,y);pick(m)});
c.style.touchAction='pan-y'}
const sc=document.createElement('canvas').getContext('2d');
function hit(x,y){if(!MM.P)return null;for(let i=MM.P.length-1;i>=0;i--){const m=MM.P[i],b=m.b;if(x<b[0]||x>b[2]||y<b[1]||y>b[3])continue;if(sc.isPointInPath(m.p,x,y))return m}return null}
function pick(m){navigator.vibrate&&navigator.vibrate(10);if(!m){MM.sel=null;info();paint();return}MM.sel={code:m.c,u:m.u,name:MM.names[m.c]||'Município'};loadCity(m.c);info();paint()}
const CG=[['presidente','Presidente',4],['governador','Governador',4],['senador','Senador',5],['deputado-federal','Dep. Federal',5],['deputado-estadual','Dep. Estadual',5]];MM.cc={};
const tnc=c=>{const t=S.turno||(Date.now()>=T2.ab?2:1);return(c==='presidente'||c==='governador')&&t===2?2:1};
async function loadCity(code){const cd=cdOf(code),u=ufOf(code);if(!cd)return;const o=MM.cc[code]=MM.cc[code]||{};await Promise.all(CG.map(async([c,,k])=>{try{const r=await one(c,tnc(c),u,cd);o[c]={sp:r.sp,c:r.c.slice(0,k).map(x=>({n:x.nome,p:x.partido,v:x.votos,q:x.pct,e:x.eleito}))}}catch(e){o[c]={err:e.message==='SEM'?'Sem resultado ainda.':'Não carregou.'}}}));if(MM.sel&&MM.sel.code===code){info();if(o.presidente&&o.presidente.c&&o.presidente.c[0]){const x=store()[code]=store()[code]||{};if(MP.c==='presidente'){x.p=o.presidente.c[0].p;x.sp=o.presidente.sp;MM.bt=null;paint()}}}}
/* ---------- card de resultado ---------- */
function info(){const el=$('mapinfo');if(!el||!MM.on||!MM.sel)return;const s=MM.sel,cd=cdOf(s.code),uf=ufOf(s.code),o=MM.cc[s.code];let h=`<h3>${esc(s.name)} <small class="mut">${uf.toUpperCase()}</small></h3>`;
if(!cd)h+='<p class="mut">Esta cidade não foi encontrada na lista do TSE pelo nome.</p>';else if(!o)h+='<p class="mut">Carregando…</p>';else for(const[c,t]of CG){const x=o[c];h+=`<p class="sm" style="margin:12px 0 4px"><b>${t}</b>${x&&x.sp!=null?` <small class="mut">${pc(x.sp)} apurado</small>`:''}</p>`;if(!x)h+='<p class="mut sm">Carregando…</p>';else if(x.err)h+=`<p class="mut sm">${esc(x.err)}</p>`;else h+=x.c.map(c=>`<div class="mb"><div><b>${esc(c.n)}</b> <small>${esc(c.p)}</small>${c.e?' ✔':''}</div><span>${pc(c.q)}</span><div class="br" style="--c:${pcol(c.p)}"><i style="width:${Math.min(100,c.q)}%"></i></div></div>`).join('')}
h+=`<div class="row"><button class="ch" data-m="uf" data-v="${uf}">Dar zoom em ${esc(ufn0(uf))}</button>${cd?'<button class="ch" data-m="mmgo">Resultados completos</button>':''}<button class="ch" data-m="mmclr">Fechar</button></div>`;el.innerHTML=h}
const ufn0=u=>UFS[u]||u.toUpperCase();
function after(){const lg=$('maplg');if(!lg||!MM.on)return;let t='';if(MM.ld)t='Carregando a malha dos municípios… (o mapa de estados aparece enquanto isso)';else if(MM.err)t=`Não foi possível carregar os municípios (${esc(MM.err)}). <a data-m="mmretry">tentar de novo</a>`;else if(MM.P){const s=store(),n1=Object.values(s).filter(x=>x.p).length;t=`Municípios com resultado: ${n1} de ${MM.P.length}${MM.busy?' · carregando…':''}`}if(t)lg.insertAdjacentHTML('beforeend',`<p class="mut sm">${t}</p>`);info()}
/* ---------- ligação com map.js ---------- */
MM.cdOf=cdOf;MM.ready=()=>!!(MM.on&&MM.P&&!MM.err);
MM.mount=a=>{mount(a);fetchAll()};MM.after=after;MM.load=()=>{loadGeo();fetchAll()};
MM.set=v=>{if(MM.on===v)return;MM.toggle()};MM.toggle=()=>{MM.on=!MM.on;lsSet('mm.on',MM.on);MM.sel=null;MM.vk='';if(MM.on)loadGeo()};
MM.back=()=>{if(MM.on&&MM.sel){MM.sel=null;return true}return false};
MM.resize=()=>{const a=$('mapsvg');if(cv&&a&&a.contains(cv)){const d=dpr();cv.width=Math.round(a.clientWidth*d);cv.height=Math.round(a.clientHeight*d);paint()}};
window.addEventListener('resize',()=>setTimeout(MM.resize,200));
document.addEventListener('click',e=>{const t=e.target.closest('[data-m]');if(!t)return;const a=t.dataset.m;
if(a==='mmgo'&&MM.sel){const u=ufOf(MM.sel.code);S.cargo=MP.c;S.uf=u;S.regiao=(REG.find(r=>r.ufs.includes(u))||{}).id||'';S.mun=cdOf(MM.sel.code)||'';S.tab='res';loadMun(u);sel()}
else if(a==='mmclr'){MM.sel=null;window.mapDraw()}else if(a==='mmretry'){MM.err='';MM.P=null;loadGeo()}});
setInterval(()=>{if(MM.on&&S.tab==='map'&&!document.hidden&&!(D&&D.sp>=100&&++MM.tick%10))fetchAll();if(MM.on&&MM.sel&&S.tab==='map'&&!document.hidden)loadCity(MM.sel.code)},30000);
if(MM.on)setTimeout(loadGeo,600);
})();
