/* Lote 3 (v1.4.5): gráfico por horário (%, votos/min, 1º−2º), comparar dois locais e replay do mapa. */
(()=>{
const $i=id=>document.getElementById(id),COL=['#00b84a','#2f6bff','#ffdf00'];
const TZ={timeZone:'America/Sao_Paulo'},HM=t=>new Date(t).toLocaleTimeString('pt-BR',{...TZ,hour:'2-digit',minute:'2-digit'}),
DT=t=>new Date(t).toLocaleString('pt-BR',{...TZ,day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}),
c1=v=>String(+v.toFixed(2)).replace('.',','),niceStep=r=>{const e=Math.pow(10,Math.floor(Math.log10(r||1))),f=r/e;return(f<=1?1:f<=2?2:f<=5?5:10)*e};
window.CM=window.CM||'p';let CC=null;

/* ---------- gráfico ---------- */
function series(h,cs,m){
if(m==='p')return cs.slice(0,3).map((c,i)=>({nm:c.nome,col:COL[i],pts:h.map(x=>{const y=x.c.find(z=>z[0]===c.id);return y?[x.ts,y[2]]:null}).filter(Boolean)}));
if(m==='v'){const p=[];for(let i=1;i<h.length;i++){const dt=(h[i].ts-h[i-1].ts)/6e4,dv=h[i].va-h[i-1].va;if(dt>0&&dv>=0)p.push([h[i].ts,dv/dt])}return[{nm:'Votos válidos por minuto',col:COL[0],pts:p}]}
return[{nm:'Diferença entre 1º e 2º',col:COL[1],pts:h.filter(x=>x.c[1]).map(x=>[x.ts,x.c[0][2]-x.c[1][2],x.c[0][1]-x.c[1][1]])}]}
window.chart=function(h,cs){
if(EM){const i=h.findIndex(x=>x.t===EM);if(i>=0)h=h.slice(0,i+1)}
if(h.length<2)return'<p class="mut sm">O gráfico aparece após a 2ª atualização do TSE com o app aberto.</p>';
const m=window.CM,SR=series(h,cs,m),all=SR.flatMap(s=>s.pts),
bt=`<div class="row">${[['p','Votos %'],['v','Votos/min'],['d','1º − 2º']].map(([k,t])=>`<button class="ch${m===k?' on':''}" data-c3="cm" data-v="${k}">${t}</button>`).join('')}</div>`;
if(all.length<2){CC=null;return bt+'<p class="mut sm">Ainda não há pontos suficientes para este gráfico.</p>'}
const W=320,H=170,L=38,R=8,T=8,B=22,pw=W-L-R,ph=H-T-B,t0=h[0].ts,sp=Math.max(1,h[h.length-1].ts-t0);
let lo=m==='p'?0:Math.min(0,...all.map(p=>p[1])),hi=Math.max(...all.map(p=>p[1]),.1);const st=niceStep((hi-lo)/4);hi=Math.ceil(hi/st)*st;lo=Math.floor(lo/st)*st;if(hi<=lo)hi=lo+st;
const X=t=>L+(t-t0)/sp*pw,Y=v=>T+ph-(v-lo)/(hi-lo)*ph,sf=m==='p'?'%':'',fy=v=>(Math.abs(v)>=100?String(Math.round(v)):c1(v))+sf;
let g='';for(let v=lo;v<=hi+st/2;v+=st)g+=`<line x1="${L}" x2="${W-R}" y1="${Y(v).toFixed(1)}" y2="${Y(v).toFixed(1)}" stroke="var(--l)" stroke-width=".6"/><text x="${L-4}" y="${(Y(v)+3).toFixed(1)}" text-anchor="end" font-size="9" fill="var(--m)">${fy(v)}</text>`;
const lg=sp>72e6?DT:HM;for(let i=0;i<4;i++){const t=t0+sp*i/3;g+=`<text x="${X(t).toFixed(1)}" y="${H-5}" text-anchor="${i?i===3?'end':'middle':'start'}" font-size="9" fill="var(--m)">${lg(t)}</text>`}
const ln=SR.map(s=>`<polyline fill="none" stroke="${s.col}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round" points="${s.pts.map(p=>X(p[0]).toFixed(1)+','+Y(p[1]).toFixed(1)).join(' ')}"/>`+(s.pts.length<=30?s.pts.map(p=>`<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="2.2" fill="${s.col}"/>`).join(''):'')).join('');
CC={h,SR,m,W,L,pw,t0,sp,X};
return bt+`<svg viewBox="0 0 ${W} ${H}" class="c3" role="img" aria-label="Gráfico da evolução da apuração por horário">${g}${ln}<line id="c3l" y1="${T}" y2="${T+ph}" stroke="var(--t)" stroke-width="1" stroke-dasharray="3 3" style="display:none"/></svg><p id="c3i" class="sm mut">Toque ou arraste no gráfico para ver os valores.</p>`};
function pick(e){const s=e.target.closest&&e.target.closest('svg.c3');if(!s||!CC)return;const r=s.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*CC.W,t=CC.t0+Math.min(1,Math.max(0,(x-CC.L)/CC.pw))*CC.sp;
let b=null;for(const q of CC.SR)for(const p of q.pts)if(!b||Math.abs(p[0]-t)<Math.abs(b-t))b=p[0];if(b==null)return;
const l=$i('c3l');if(l){l.setAttribute('x1',CC.X(b).toFixed(1));l.setAttribute('x2',CC.X(b).toFixed(1));l.style.display=''}
const sn=CC.h.find(y=>y.ts===b),p=CC.SR.map(q=>{const z=q.pts.find(y=>y[0]===b);if(!z)return'';return CC.m==='p'?`<span style="color:${q.col}">● ${esc(q.nm)}</span> ${pc(z[1])}`:CC.m==='v'?`<b>${n(Math.round(z[1]))}</b> votos válidos/min`:`<b>${c1(z[1])}</b> p.p. (${n(z[2])} votos)`}).filter(Boolean).join(' · ');
const i=$i('c3i');if(i)i.innerHTML=`${DT(b)}${sn?' · '+pc(sn.sp)+' apurado':''}<br>${p}`}
document.addEventListener('pointerdown',pick);document.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||e.buttons||e.target.closest('svg.c3'))pick(e)});

/* ---------- comparar ---------- */
const CP={a:{u:'',m:''},b:{u:'',m:''},r:{}};
const slot=(k,t)=>{const s=CP[k];return`<div class="sel"><select data-c3="u" data-k="${k}" aria-label="Estado ${t}"><option value="">${t}: estado…</option>${Object.entries(UFS).map(([u,x])=>`<option value="${u}"${s.u===u?' selected':''}>${x}</option>`).join('')}</select>${s.u?`<select data-c3="m" data-k="${k}" aria-label="Cidade ${t}"><option value="">Todo o estado</option>${(MUN[s.u]||[]).map(m=>`<option value="${m.cd}"${s.m===m.cd?' selected':''}>${esc(m.nm)}</option>`).join('')}</select>`:''}</div>`};
function cmpRes(){const A=CP.r.a,B=CP.r.b;if(!A&&!B)return'<p class="mut sm">Escolha dois locais para ver lado a lado.</p>';
const ms=(x,t)=>!x?`<p class="mut sm">${t}: escolha um local.</p>`:x.ld?`<p class="mut sm">${t}: carregando…</p>`:x.err?`<p class="mut sm">${t}: ${esc(x.err)}</p>`:'',a=A&&A.r,b=B&&B.r;
if(!a||!b)return ms(A,'A')+ms(B,'B');
const ids=[];for(const r of[a,b])for(const c of r.c.slice(0,4))if(!ids.some(i=>i.id===c.id))ids.push(c);
const f=(x,y)=>x==null||y==null?'':(x-y>0?'+':'')+c1(x-y),rw=(t,x,y,o)=>`<tr><td>${t}</td><td>${x}</td><td>${y}</td><td>${o||''}</td></tr>`;
return ms(A,'A')+ms(B,'B')+`<div class="c3w"><table class="c3t"><thead><tr><th>${esc(a.nome)}</th><th>${esc(a.esc.nome)}</th><th>${esc(b.esc.nome)}</th><th>A−B</th></tr></thead><tbody>`
+rw('Apurado',pc(a.sp),pc(b.sp),f(a.sp,b.sp))+rw('Comparec.',pc(a.cpp),pc(b.cpp),f(a.cpp,b.cpp))+rw('Abstenção',pc(a.abp),pc(b.abp),f(a.abp,b.abp))
+ids.map(c=>{const x=a.c.find(y=>y.id===c.id),y=b.c.find(z=>z.id===c.id);return rw(`${esc(c.nome)}<small>${esc(c.partido)}</small>`,x?pc(x.pct):'—',y?pc(y.pct):'—',x&&y?f(x.pct,y.pct):'')}).join('')
+`</tbody></table></div><p class="mut sm">A−B em pontos percentuais. “—” = candidato fora dos 4 primeiros daquele local.</p>`}
const cmpHTML=()=>`<section class="bx" id="c3"><h3>Comparar</h3><p class="mut sm">Dois estados ou cidades lado a lado · ${CARGOS[S.cargo][0]}.</p>${slot('a','A')}${slot('b','B')}<div id="c3r">${cmpRes()}</div>${CP.a.u||CP.b.u?'<button class="ch" data-c3="rf">Atualizar</button>':''}</section>`;
const cmpDraw=()=>{const el=$i('c3');if(el)el.outerHTML=cmpHTML()};
async function cmpFetch(k){const s=CP[k],tag=s.u+'|'+s.m+'|'+S.cargo;if(!s.u){delete CP.r[k];return cmpDraw()}
const mine=()=>CP.r[k]&&CP.r[k].tag===tag;CP.r[k]={ld:1,tag};cmpDraw();
try{const r=await one(S.cargo,tn(),s.u,s.m);if(mine())CP.r[k]={r,tag}}catch(e){if(mine())CP.r[k]={err:e.message==='SEM'?'O TSE ainda não publicou estes dados.':String(e.message||'erro'),tag}}cmpDraw()}
document.addEventListener('change',e=>{const t=e.target,a=t.dataset&&t.dataset.c3;if(a!=='u'&&a!=='m')return;const k=t.dataset.k;
if(a==='u'){CP[k]={u:t.value,m:''};if(t.value)loadMun(t.value).then(cmpDraw)}else CP[k].m=t.value;cmpFetch(k)});
document.addEventListener('click',e=>{const t=e.target.closest('[data-c3]');if(!t)return;const a=t.dataset.c3;
if(a==='cm'){window.CM=t.dataset.v;render()}else if(a==='rf'){cmpFetch('a');cmpFetch('b')}});
const A0=window.tabAn;window.tabAn=()=>A0()+cmpHTML();

/* ---------- replay no mapa: barra da linha do tempo na aba Mapa ---------- */
const M0=window.tabMap;
if(M0)window.tabMap=()=>{let h=typeof linha==='function'?linha():'';if(EM){const r=window.mapHist&&mapHist();h+=`<p class="mut sm">${r?`Mapa como estava às ${HM(r.ts)} (registro mais próximo, até ${DT(r.ts)}).`:'Não há registro do mapa para este horário: ele só guarda o histórico a partir desta versão, com o app aberto.'}</p>`}return h+M0()};
})();
