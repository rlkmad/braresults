/* Braresults — Jogo de luta v2 · Parte 1: paisagem, menu, opções de HUD, carregamento, seleção de candidato por cargo */
(()=>{
const W=800,H=450,GY=380,G=1900;
const imgs={};
const getImg=u=>{if(!u)return null;if(!imgs[u]){const i=new Image();i.src=u;imgs[u]=i}const i=imgs[u];return i.complete&&i.naturalWidth?i:null};
const ST={get:(k,d)=>{try{return JSON.parse(localStorage.getItem('fg.'+k))??d}catch{return d}},set:(k,v)=>{try{localStorage.setItem('fg.'+k,JSON.stringify(v))}catch{}}};
const OPT={side:'r',size:1,bars:'k',...ST.get('opt',{})};
let CAND=null,CAND2=null,ENM=null,PL=1,WP=0,AC=0,WP2=1,AC2=1,MP=0,DF=1,MD=0,run=null;
let CG='presidente',UF=(typeof S!=='undefined'&&S.uf)||'sp',Q='',LIST=[],LOADING=0,ERRM='',SHOW=60,MR=null;const LC={};
const nz=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const E=s=>esc(s);
/* Despertar: dura AWDUR s, só pode ser ativado nos primeiros AWWIN s da luta, 1 vez por luta. CUTT = duração da cutscene do 4º poder. */
const AWDUR=20,AWWIN=60,CUTT=2.4;
const AWD={flavio:{p:.2,u:80,n:'Esfera do Brasil',ic:'☄️',c:['#f4ffd0','#3dff6a','#0a8a3a']},lula:{p:.15,u:85,n:'Tempestade Vermelha',ic:'🌩️',c:['#ffe0d0','#ff3a2a','#8a0a0a']}};
const awKind=c=>{const n=nz(c&&c.nome);return /^lula$|luiz inacio lula|lula da silva/.test(n)?'lula':/flavio.*bolsonaro/.test(n)?'flavio':''};

const mk=(x,c,face,w,a)=>{const s={spd:0,jmp:0,dmg:0,def:0,cdr:0,ls:0,hp:0,reg:0,acd:0,kbr:0,dcd:0,pdm:0,crit:0,...(a?a[2]:{})},mx=100+s.hp;
  return {x,y:GY,vx:0,vy:0,hp:mx,mx,s,W:w?{a:w[2],p:w.slice(3)}:{a:1,p:[]},cd:[0,0,0],stun:0,slow:0,sh:0,shT:0,bf:0,bfv:0,face,gr:true,c,img:c.foto,dash:0,dcd:0,blk:false,atk:0,acd:0,hit:0,ph:0,hurt:0,wi:FD.W.indexOf(w),ai:a?FD.A.indexOf(a):-1,aw:awKind(c),awT:0,awP:0,awU:0,ulU:0}};
/* ---------- paisagem: se o aparelho estiver em retrato, gira a tela do jogo ---------- */
const rotP=()=>innerHeight>innerWidth;
const lay=o=>{if(rotP()){o.style.width=innerHeight+'px';o.style.height=innerWidth+'px';o.style.transform=`translate(${innerWidth}px,0) rotate(90deg)`}else{o.style.width=innerWidth+'px';o.style.height=innerHeight+'px';o.style.transform='none'}};
const rv=(dx,dy)=>rotP()?[dy,-dx]:[dx,dy];
const css=()=>{if(document.getElementById('fgcss'))return;const s=document.createElement('style');s.id='fgcss';s.textContent=`
#fgm,#fg{position:fixed;left:0;top:0;z-index:99;background:#0b0f1a;color:#fff;font:14px system-ui,sans-serif;user-select:none;-webkit-user-select:none;overflow:hidden;transform-origin:0 0}
#fgm{display:flex;flex-direction:column}#fg{touch-action:none}
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
#fgm .row{display:flex;gap:6px;flex-wrap:wrap}`;document.head.appendChild(s)};
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

const paintMap=(x,mi,t)=>{const m=FD.M[mi],PLs=m[7],g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,m[2]);g.addColorStop(1,m[3]);x.fillStyle=g;x.fillRect(0,0,W,H);
    const tri=(c,n,w,h,o2)=>{x.fillStyle=c;for(let i=0;i<n;i++){x.beginPath();x.moveTo(i*w-w/3,GY);x.lineTo(i*w+w/2,GY-h-(i*37+o2)%50);x.lineTo(i*w+w*1.3,GY);x.fill()}};
    if(m[6]===0){x.fillStyle='#ffe9a0';x.beginPath();x.arc(650,90,38,0,7);x.fill();tri('#4a8a5a',4,230,100,0)}
    else if(m[6]===1){x.fillStyle='#fff';for(let i=0;i<40;i++)x.fillRect(i*97%W,i*53%250,2,2);x.fillStyle='#e8e8f8';x.beginPath();x.arc(120,80,28,0,7);x.fill();x.fillStyle='#14182c';for(let i=0;i<9;i++)x.fillRect(i*95,GY-50-(i*37%90),60,200)}
    else if(m[6]===2){tri('#3a1410',4,230,120,10);x.fillStyle='#ff5a1f55';x.fillRect(0,GY-30,W,30);x.fillStyle='#ffb347';for(let i=0;i<25;i++)x.fillRect(i*83%W,(i*61+t/20)%GY,2,2)}
    else if(m[6]===3){tri('#bfe6ff',4,230,110,20);x.fillStyle='#fff';for(let i=0;i<50;i++)x.fillRect(i*71%W,(i*43+t/15)%GY,3,3)}
    else{x.strokeStyle='#f0f6';x.lineWidth=1;for(let i=0;i<=16;i++){x.beginPath();x.moveTo(W/2+(i-8)*20,250);x.lineTo((i-8)*90+W/2,GY);x.stroke()}for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,250+i*i*5);x.lineTo(W,250+i*i*5);x.stroke()}}
    x.fillStyle=m[4];x.fillRect(0,GY,W,H-GY);x.fillStyle=m[5];x.fillRect(0,GY,W,4);PLs.forEach(q=>{x.fillStyle=m[5];x.fillRect(q[0],q[2],q[1],9);x.fillStyle='#fff3';x.fillRect(q[0],q[2],q[1],2)});};
/* ---------- telas ---------- */
const screenMenu=()=>shell(`<div class="cen" style="background:radial-gradient(circle at 50% 30%,#2b1a5a,#0b0f1a 70%)"><div style="font-size:clamp(32px,11vh,60px);line-height:1">🥊</div><div class="ttl">LUTA DE CANDIDATOS</div><div class="row" style="justify-content:center"><button class="b" data-a="play" style="min-width:170px">▶ Jogar</button><button class="b s" data-a="opts" style="min-width:170px">⚙ Opções</button></div><button class="c" data-a="exit">← Voltar ao app</button></div>`);

const chips=(k,cur,arr)=>`<div class="row">${arr.map(([v,n])=>`<button class="c${String(cur)===String(v)?' on':''}" data-a="opt" data-k="${k}" data-v="${v}">${n}</button>`).join('')}</div>`;
const preview=()=>{const s=OPT.size,R=OPT.side==='r',d=n=>Math.round(n*s),sd=R?'left':'right',bs=R?'right':'left',c=OPT.bars==='c';
  const dot=(x,y,z)=>`<i style="position:absolute;${bs}:${x}px;bottom:${y}px;width:${z}px;height:${z}px;border-radius:50%;background:#ffffff40;border:1px solid #fff8"></i>`;
  const bar=(l)=>`<i style="position:absolute;top:${c?22:6}px;${l?'left':'right'}:${c?'calc(50% + 4px)':'8px'};${c&&l?'left:auto;right:calc(50% + 4px)':''}width:90px;height:8px;border-radius:4px;background:#4c6"></i>`;
  return `<div style="position:relative;height:130px;border-radius:12px;background:linear-gradient(#2a3a6a,#1a2a1a);overflow:hidden;border:1px solid #fff3"><i style="position:absolute;${sd}:10px;bottom:8px;width:${d(46)}px;height:${d(46)}px;border-radius:50%;background:#ffffff25;border:2px solid #fff6"></i>${dot(10,8,d(30))}${dot(46,6,d(22))}${dot(10,50,d(20))}${dot(40,44,d(20))}${dot(70,30,d(20))}${bar(1)}${bar(0)}<span style="position:absolute;left:50%;top:4px;transform:translateX(-50%);font-size:9px;background:#0008;padding:1px 6px;border-radius:6px">✕ Sair</span></div>`};
const screenOpts=()=>shell(`<div class="top"><button class="c" data-a="menu">← Voltar</button><b>Opções · posição do HUD</b></div><div class="body"><div class="col" style="flex:1;overflow-y:auto"><div class="lb">Controles</div>${chips('side',OPT.side,[['r','🕹 Joystick à esquerda'],['l','🕹 Joystick à direita']])}<div class="lb">Tamanho dos botões</div>${chips('size',OPT.size,[[.85,'Pequeno'],[1,'Médio'],[1.2,'Grande']])}<div class="lb">Barras de vida</div>${chips('bars',OPT.bars,[['k','Nos cantos'],['c','No centro']])}</div><div class="col" style="flex:1"><div class="lb">Pré-visualização</div>${preview()}</div></div><div class="fgf"><span style="flex:1;font-size:11px;opacity:.7">As opções são salvas automaticamente.</span><button class="b" data-a="menu">Pronto</button></div>`);

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
const pw=p=>`${FD.T[p[1]]} ${p[2]}${p[1]==='H'?' de vida':p[1]==='B'?'% veloc.':p[1]==='S'?' de proteção':' de dano'} · recarga ${p[3]}s${p[5]?(p[1]==='Z'?' · lentidão ':' · atordoa ')+p[5]+'s':''}`;
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
  return{j:(R?'left':'right')+':18px;bottom:18px',js:s(120),ps:s(50),a:X(226)+';'+B(152),u:X(226)+';'+B(92),p:[X(28)+';'+B(166),X(92)+';'+B(150),X(156)+';'+B(122)],b:[['atk','👊',s(68),X(28)+';'+B(22)],['dash','💨',s(50),X(108)+';'+B(18)],['jump','⤒',s(54),X(172)+';'+B(34)],['blk','🛡',s(50),X(28)+';'+B(108)]]}};
function start(){
  if(run)return;closeMenu();const pvp=MD===1,c=CAND;
  const o=mkRoot('fg');
  const sz=o.clientWidth<720?38:44,KS=[],pbs=[],abs=[],FT=[];
  o.innerHTML=`<canvas id="fgc" style="width:100%;height:100%;display:block"></canvas><button id="fx" style="position:absolute;top:5px;left:50%;transform:translateX(-50%);padding:3px 10px;font-size:11px;border-radius:10px;background:#0008;color:#fff;border:1px solid #fff4;z-index:2">✕ Sair</button><button id="fp" style="position:absolute;top:5px;left:calc(50% + 44px);padding:3px 10px;font-size:11px;border-radius:10px;background:#0008;color:#fff;border:1px solid #fff4;z-index:2">⏸</button>`;
  document.body.appendChild(o);
  const mkCtl=(i,host,L,wp)=>{const K={l:0,r:0,jump:0,dash:0,blk:0,atk:0,ax:0};KS[i]=K;
    const btn=(t,s,css)=>{host.insertAdjacentHTML('beforeend',`<button style="position:absolute;width:${s}px;height:${s}px;border-radius:50%;border:2px solid #fff6;background:#ffffff22;color:#fff;font-size:12px;font-weight:700;padding:0;touch-action:none;${css}">${t}</button>`);return host.lastElementChild};
    const hold=(e,k)=>{e.addEventListener('pointerdown',ev=>{ev.preventDefault();e.setPointerCapture(ev.pointerId);K[k]=1});const up=()=>{if(k==='blk')K.blk=0};e.addEventListener('pointerup',up);e.addEventListener('pointercancel',up)};
    L.b.forEach(([k,t,s,css])=>hold(btn(t,s,css),k));
    pbs[i]=[0,1,2].map(n=>{const e=btn('<span style="display:block;overflow:hidden;font-size:9px;line-height:1.05">'+wp[3+n][0]+'</span>',L.ps,L.p[n]);e.addEventListener('pointerdown',ev=>{ev.preventDefault();cast(FT[i],FT[1-i],n)});return e});
    const ak=awKind(i?(CAND2||c):c);if(ak){const sp='<span style="display:block;overflow:hidden;font-size:9px;line-height:1.05">…</span>',bc='border-color:'+AWD[ak].c[1]+';border-width:3px;';
      abs[i]=[btn(sp,L.ps,L.a+';'+bc),btn(sp,L.ps,L.u+';'+bc)];
      abs[i][0].addEventListener('pointerdown',ev=>{ev.preventDefault();awaken(FT[i])});abs[i][1].addEventListener('pointerdown',ev=>{ev.preventDefault();ult(FT[i],FT[1-i])})}
    host.insertAdjacentHTML('beforeend',`<div style="position:absolute;${L.j};width:${L.js}px;height:${L.js}px;border-radius:50%;background:#ffffff18;border:2px solid #fff4;touch-action:none"><div style="position:absolute;left:${L.js/2-25}px;top:${L.js/2-25}px;width:50px;height:50px;border-radius:50%;background:#fffb"></div></div>`);
    const j=host.lastElementChild,kn=j.firstElementChild,jm=ev=>{const r=j.getBoundingClientRect(),h=L.js/2,dd=rv(ev.clientX-(r.left+r.width/2),ev.clientY-(r.top+r.height/2)),dx=dd[0],dy=dd[1],d=Math.hypot(dx,dy)||1,m=Math.min(d,h*.7);kn.style.transform=`translate(${dx/d*m}px,${dy/d*m}px)`;K.ax=Math.abs(dx)>h*.2?(dx>0?1:-1):0;if(dy<-h*.6)K.jump=1};
    j.addEventListener('pointerdown',ev=>{j.setPointerCapture(ev.pointerId);jm(ev)});j.addEventListener('pointermove',ev=>{if(j.hasPointerCapture(ev.pointerId))jm(ev)});
    const jr=()=>{K.ax=0;kn.style.transform=''};j.addEventListener('pointerup',jr);j.addEventListener('pointercancel',jr)};
  const hostCss=(side)=>`position:absolute;bottom:env(safe-area-inset-bottom,0px);${side===2?'left:0;right:0;height:100%':'width:50%;height:150px;'+(side?'right:0;border-left:1px solid #fff3':'left:0')}`;
  const mkHost=side=>{o.insertAdjacentHTML('beforeend',`<div style="${hostCss(side)}"></div>`);return o.lastElementChild};
  const pvpL=i=>{const z=Math.min(OPT.size,1),s=Math.round(sz*z),g=s+4,a=i?'right':'left',o=n=>`${a}:${n}px`,js=Math.round(96*z),b0=js+16;
    return{j:`${a}:6px;bottom:6px`,js,ps:s,a:`${o(b0)};bottom:${2*s+18}px`,u:`${o(b0+g)};bottom:${2*s+18}px`,p:[0,1,2].map(n=>`${o(b0+n*g)};bottom:${s+10}px`),b:[['jump','⤒',s,`${o(b0)};bottom:6px`],['dash','💨',s,`${o(b0+g)};bottom:6px`],['blk','🛡',s,`${o(b0+2*g)};bottom:6px`],['atk','👊',s+8,`${o(b0+3*g)};bottom:6px`]]}};
  if(pvp){[0,1].forEach(i=>mkCtl(i,mkHost(i),pvpL(i),FD.W[i?WP2:WP]))}
  else mkCtl(0,mkHost(2),soloL(),FD.W[WP]);
  const K=KS[0],K2=KS[1];
  const key=(KK,i,m,k,v)=>{if(v&&k===m[7])awaken(FT[i]);if(v&&k===m[8])ult(FT[i],FT[1-i]);if(k===m[0])KK.l=v;if(k===m[1])KK.r=v;if(v&&k===m[2])KK.jump=1;if(v&&k===m[3])KK.atk=1;if(v&&k===m[4])KK.dash=1;if(k===m[5])KK.blk=v;if(v){const n=m[6].indexOf(k);if(n>=0)cast(FT[i],FT[1-i],n)}};
  const kd=e=>{const v=e.type==='keydown'?1:0,k=e.key.toLowerCase();key(K,0,['a','d','w','j','k','l','123','q','e'],k,v);
    if(pvp)key(K2,1,['arrowleft','arrowright','arrowup',',','.','/','890','m','n'],k,v);else{if(k==='arrowleft')K.l=v;if(k==='arrowright')K.r=v;if(v&&k==='arrowup')K.jump=1}};
  addEventListener('keydown',kd);addEventListener('keyup',kd);

  const cv=o.querySelector('#fgc'),x=cv.getContext('2d');
  const fit=()=>{const d=Math.min(devicePixelRatio||1,1.5);cv.width=o.clientWidth*d;cv.height=o.clientHeight*d};fit();addEventListener('resize',fit);
  const P=mk(220,c,1,FD.W[WP],FD.A[AC]),E=pvp?mk(580,CAND2||c,-1,FD.W[WP2],FD.A[AC2]):mk(580,ENM||rndEnemy(),-1,FD.W[Math.random()*20|0],FD.A[Math.random()*25|0]);FT.push(P,E);let last=performance.now(),raf,paused=0;
  const stop=back=>{cancelAnimationFrame(raf);removeEventListener('keydown',kd);removeEventListener('keyup',kd);removeEventListener('resize',fit);kill(o);run=null;if(back!==0)screenSetup()};
  o.querySelector('#fx').onclick=()=>stop();o.querySelector('#fp').onclick=e=>{paused=!paused;e.target.textContent=paused?'▶':'⏸'};run=1;

  const M={pl:FD.M[MP][7]},PR=[],FX=[],LV=[{r:.35,b:.25,a:.5},{r:.2,b:.5,a:.75},{r:.1,b:.75,a:1}][DF];let over2=0,mt=0,cut=null;const UL=[];
  const SP=f=>230*(1+f.s.spd)*(f.bf>0?1+f.bfv:1)*(f.slow>0?.5:1);
  const hitF=(a,t,b,k,st,kb,dir)=>{dir=dir||a.face;let d=b*(1+a.s.dmg)*(k==='p'?1+a.s.pdm:1);if(Math.random()<a.s.crit)d*=2;d*=1-t.s.def;
    if(t.blk&&t.face===-dir){t.hp-=Math.max(1,d*.1);t.vx=dir*80;return}
    if(t.sh>0){const q=Math.min(t.sh,d);t.sh-=q;d-=q}
    t.hp-=d;a.hp=Math.min(a.mx,a.hp+d*a.s.ls);t.vx=dir*kb*(1-t.s.kbr);if(kb){t.vy=-220*(1-t.s.kbr);t.gr=false}t.hurt=.25;t.hit=.2;if(st)t.stun=Math.max(t.stun,st)};
  const shot=(f,d,sp,s,z,vy)=>PR.push({o:f,x:f.x+f.face*26,y:f.y-48,vx:f.face*sp,vy:vy||0,d,st:z?0:s,sl:z?s:0,z,t:1.6,dir:f.face});
  const cast=(f,t,i)=>{if(paused||cut)return;const p=f.W.p[i];if(!p||f.cd[i]>0||f.stun>0||f.blk)return;f.cd[i]=p[3]*(1-f.s.cdr);const [,k,d0,,x,s]=p,d=('PZMAD'.includes(k)&&f.awT>0)?d0*(1+f.awP):d0;
    if(k==='P'||k==='Z')shot(f,d,x||520,s,k==='Z');
    else if(k==='M')for(let j=-1;j<=1;j++)shot(f,d,620,s||0,0,j*60);
    else if(k==='A'){FX.push({x:f.x,y:f.y-40,r:x,t:.25});if(Math.abs(t.x-f.x)<x+22&&Math.abs(t.y-f.y)<90)hitF(f,t,d,'p',s||0,300,t.x>=f.x?1:-1)}
    else if(k==='D'){f.dash=.22;f.vx=f.face*700;f.dm=[d,s||0];f.dmh=0}
    else if(k==='H')f.hp=Math.min(f.mx,f.hp+d);
    else if(k==='S'){f.sh=d;f.shT=x}
    else if(k==='B'){f.bf=x;f.bfv=d/100}};
  /* ---------- despertar ---------- */
  const trueHit=(a,t,d,kb,stn)=>{t.hp-=d;t.hurt=.2;t.hit=.25;if(kb){t.vx=(t.x>=a.x?1:-1)*kb;t.vy=-260;t.gr=false}if(stn)t.stun=Math.max(t.stun,stn)};
  const awaken=f=>{if(paused||over2||cut||!f.aw||f.awU||mt>AWWIN)return;f.awU=1;f.awT=AWDUR;f.awP=AWD[f.aw].p;const c=AWD[f.aw].c;FX.push({x:f.x,y:f.y-45,r:150,t:.5,c:c[1]},{x:f.x,y:f.y-45,r:90,t:.4,c:c[0]})};
  const ult=(f,tg)=>{if(paused||over2||cut||!f.aw||!(f.awT>0)||f.ulU)return;f.ulU=1;cut={t:0,f,tg,k:f.aw}};
  const launch=c=>{const f=c.f,tg=c.tg;if(c.k==='flavio')UL.push({k:'b',o:f,tg,x:f.x+f.face*40,y:f.y-55,a:0});else UL.push({k:'s',o:f,tg,n:10,tm:0,bl:[]})};
  const cpuAw=dt=>{if(!E.aw||cut||over2)return;if(!E.awU){if(mt>AWWIN-8||(mt>5&&Math.random()<dt*.25))awaken(E)}else if(E.awT>0&&!E.ulU&&E.awT<AWDUR-1&&Math.random()<dt*1.2)ult(E,P)};
  const updUL=dt=>{for(let i=UL.length-1;i>=0;i--){const u=UL[i],tg=u.tg;u.a=(u.a||0)+dt;
    if(u.k==='b'){const dx=tg.x-u.x,dy=tg.y-45-u.y,d=Math.hypot(dx,dy)||1,sp=520*dt;
      if(d<=Math.max(sp,40)||u.a>4){trueHit(u.o,tg,AWD.flavio.u,420,.5);FX.push({x:tg.x,y:tg.y-45,r:180,t:.5,c:'#3dff6a'},{x:tg.x,y:tg.y-45,r:120,t:.45,c:'#ffd84a'},{x:tg.x,y:tg.y-45,r:60,t:.4,c:'#3a7bff'});UL.splice(i,1)}
      else{u.x+=dx/d*sp;u.y+=dy/d*sp}}
    else{u.tm-=dt;while(u.tm<=0&&u.n>0){u.n--;u.tm+=.22;trueHit(u.o,tg,AWD.lula.u/10,0,.12);u.bl.push({x:tg.x+(Math.random()*40-20),t:.3,s:Math.random()});FX.push({x:tg.x,y:tg.y-10,r:50,t:.2,c:'#ff3a2a'})}
      u.bl.forEach(b=>b.t-=dt);u.bl=u.bl.filter(b=>b.t>0);if(!u.n&&!u.bl.length)UL.splice(i,1)}}};
  const aura=(f,t)=>{if(!(f.awT>0))return;const c=AWD[f.aw].c;x.save();x.globalCompositeOperation='lighter';x.globalAlpha=(f.awT<3&&((t/110|0)%2))?.35:1;
    const g=x.createRadialGradient(f.x,f.y-45,8,f.x,f.y-45,90);g.addColorStop(0,c[1]+'77');g.addColorStop(1,c[2]+'00');x.fillStyle=g;x.beginPath();x.arc(f.x,f.y-45,90,0,7);x.fill();
    for(let i=0;i<16;i++){const bx=f.x+Math.sin(i*5.1)*24,by=f.y-2-(i/15)*78,h=36+Math.sin(t/85+i*1.9)*14,w=9+Math.abs(Math.sin(i*3))*5,sw=Math.sin(t/120+i)*7;
      x.fillStyle=c[1]+'99';x.beginPath();x.moveTo(bx-w,by);x.quadraticCurveTo(bx-w*.7,by-h*.55,bx+sw,by-h);x.quadraticCurveTo(bx+w*.7,by-h*.55,bx+w,by);x.fill();
      x.fillStyle=c[0]+'aa';x.beginPath();x.moveTo(bx-w*.4,by);x.quadraticCurveTo(bx-w*.3,by-h*.35,bx+sw*.6,by-h*.62);x.quadraticCurveTo(bx+w*.3,by-h*.35,bx+w*.4,by);x.fill()}
    x.restore()};
  const drawUL=t=>{UL.forEach(u=>{x.save();x.globalCompositeOperation='lighter';
    if(u.k==='b'){const r=34+Math.sin(t/60)*3,g=x.createRadialGradient(u.x,u.y,r*.3,u.x,u.y,r*2.2);g.addColorStop(0,'#ffffff88');g.addColorStop(1,'#2a5bd800');x.fillStyle=g;x.beginPath();x.arc(u.x,u.y,r*2.2,0,7);x.fill();
      x.globalCompositeOperation='source-over';[['#1fcc55',r],['#ffd84a',r*.72],['#2a6bff',r*.44],['#ffffff',r*.18]].forEach(([q,rr])=>{x.fillStyle=q;x.beginPath();x.arc(u.x,u.y,rr,0,7);x.fill()});
      for(let k=0;k<3;k++){x.strokeStyle=['#77ff77','#ffdd44','#66aaff'][k];x.lineWidth=3;x.beginPath();x.arc(u.x,u.y,r*(.9+k*.18),t/150+k*2.1,t/150+k*2.1+1.6);x.stroke()}}
    else{x.fillStyle='rgba(180,0,0,'+(.07+.05*Math.sin(t/40))+')';x.fillRect(-W,-H,W*3,H*3);
      u.bl.forEach(b=>{const ty=u.tg.y-5,pts=[];for(let y=0,i=0;y<ty;y+=36,i++)pts.push([b.x+Math.sin(b.s*91+i*7.3)*24*(i?1:0),y]);pts.push([b.x,ty]);x.globalAlpha=Math.min(1,b.t*5);
        [['#ff2a2a',9],['#ffffff',3]].forEach(([q,lw])=>{x.strokeStyle=q;x.lineWidth=lw;x.beginPath();pts.forEach((q2,i)=>i?x.lineTo(q2[0],q2[1]):x.moveTo(q2[0],q2[1]));x.stroke()})})}
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
    x.font='bold 15px sans-serif';x.fillStyle=cl[0];x.fillText(((f.c.nome||'')+'').toUpperCase()+' · PODER FINAL · '+A.u+' de dano',W/2,Math.max(16,bh-18));
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
  const end=w=>{over2=1;const d=document.createElement('div');d.style.cssText='position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:#000a;color:#fff;font:700 34px sans-serif';
    d.innerHTML=(pvp?(w?'🏆 Jogador 1 venceu!':'🏆 Jogador 2 venceu!'):(w?'🏆 VITÓRIA!':'💀 DERROTA'))+'<button id="fr" style="font-size:18px;padding:12px 28px;border-radius:12px">↻ Revanche</button><button id="fm" style="font-size:16px;padding:10px 28px;border-radius:12px">Menu</button>';
    o.appendChild(d);d.querySelector('#fr').onclick=()=>{stop(0);start()};d.querySelector('#fm').onclick=()=>stop()};
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
    {const hx=f.x+f.face*(f.blk?20:ar?46:14),hh=f.blk?hy+24:ar?hy+32:hy+50-sw*.3,im=f.wi>=0&&FS.img('w',f.wi);
      if(im&&im.complete&&im.naturalWidth){const r=FS.ori[f.wi]==='r',g=FS.gr[f.wi],t=f.atk>0?1-f.atk/.22:0,k=.85;
        const ang=r?(f.blk?-.1:ar?-.5+t*.9:-.3+Math.sin(f.ph)*.06):(f.blk?.1:ar?-.4+t*2.3:.55+Math.sin(f.ph)*.08);
        x.save();x.translate(hx,hh);x.scale(f.face,1);x.rotate(ang);x.drawImage(im,-g[0]*k,-g[1]*k,64*k,64*k);x.restore()}}
    if(f.blk||f.sh>0){x.strokeStyle='#5bf8';x.lineWidth=3;x.beginPath();x.arc(f.x,f.y-45,46,0,7);x.stroke()}
    x.save();x.beginPath();x.arc(f.x,hy,22,0,7);x.clip();const im=getImg(f.img);
    if(im){const s=Math.min(im.naturalWidth,im.naturalHeight);x.drawImage(im,(im.naturalWidth-s)/2,(im.naturalHeight-s)/2,s,s,f.x-22,hy-22,44,44)}else{x.fillStyle='#8899aa';x.fill()}
    x.restore();x.strokeStyle=f.hit>0?'#f55':col;x.lineWidth=3;x.beginPath();x.arc(f.x,hy,22,0,7);x.stroke();
    if(f.ai===0||f.ai===10||f.ai===13){const h=FS.img('a',f.ai);if(h.complete&&h.naturalWidth)x.drawImage(h,f.x-20,hy-44,40,40)}
  };
  const bar=(f,l,left)=>{const w=240,c=OPT.bars==='c',xx=left?(c?W/2-8-w:16):(c?W/2+8:W-16-w),y=c?36:14;x.fillStyle='#0008';x.fillRect(xx,y,w,16);x.fillStyle=f.hp>30?'#4c6':'#e44';x.fillRect(xx,y,w*Math.max(0,f.hp)/f.mx,16);if(f.awT>0){x.fillStyle='#0008';x.fillRect(xx,y+44,w,6);x.fillStyle=AWD[f.aw].c[1];x.fillRect(xx,y+44,w*f.awT/AWDUR,6)}x.fillStyle='#fff';x.font='bold 12px sans-serif';x.textAlign=left?'left':'right';x.fillText((l||'').split(' ')[0]+' '+Math.ceil(Math.max(0,f.hp)),left?xx:xx+w,y+30);[['w',f.wi],['a',f.ai]].forEach(([k,i],n)=>{if(i<0)return;const m=FS.img(k,i);if(m.complete&&m.naturalWidth)x.drawImage(m,left?xx+w-24-n*24:xx+4+n*24,y+18,22,22)})};

  const paint=(x,t)=>{const m=FD.M[MP],g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,m[2]);g.addColorStop(1,m[3]);x.fillStyle=g;x.fillRect(0,0,W,H);
    const tri=(c,n,w,h,o2)=>{x.fillStyle=c;for(let i=0;i<n;i++){x.beginPath();x.moveTo(i*w-w/3,GY);x.lineTo(i*w+w/2,GY-h-(i*37+o2)%50);x.lineTo(i*w+w*1.3,GY);x.fill()}};
    if(m[6]===0){x.fillStyle='#ffe9a0';x.beginPath();x.arc(650,90,38,0,7);x.fill();tri('#4a8a5a',4,230,100,0)}
    else if(m[6]===1){x.fillStyle='#fff';for(let i=0;i<40;i++)x.fillRect(i*97%W,i*53%250,2,2);x.fillStyle='#e8e8f8';x.beginPath();x.arc(120,80,28,0,7);x.fill();x.fillStyle='#14182c';for(let i=0;i<9;i++)x.fillRect(i*95,GY-50-(i*37%90),60,200)}
    else if(m[6]===2){tri('#3a1410',4,230,120,10);x.fillStyle='#ff5a1f55';x.fillRect(0,GY-30,W,30);0}
    else if(m[6]===3){tri('#bfe6ff',4,230,110,20);0}
    else{x.strokeStyle='#f0f6';x.lineWidth=1;for(let i=0;i<=16;i++){x.beginPath();x.moveTo(W/2+(i-8)*20,250);x.lineTo((i-8)*90+W/2,GY);x.stroke()}for(let i=0;i<6;i++){x.beginPath();x.moveTo(0,250+i*i*5);x.lineTo(W,250+i*i*5);x.stroke()}}
    x.fillStyle=m[4];x.fillRect(0,GY,W,H-GY);x.fillStyle=m[5];x.fillRect(0,GY,W,4);M.pl.forEach(q=>{x.fillStyle=m[5];x.fillRect(q[0],q[2],q[1],9);x.fillStyle='#fff3';x.fillRect(q[0],q[2],q[1],2)});};
  const BG=document.createElement('canvas');BG.width=W*1.5;BG.height=H*1.5;{const c2=BG.getContext('2d');c2.scale(1.5,1.5);paint(c2,0)}
  const loop=t=>{
    const dt0=paused?0:Math.min(.033,(t-last)/1000);last=t;if(cut&&!paused){cut.t+=dt0;if(cut.t>=CUTT){launch(cut);cut=null}}const dt=cut?0:dt0;
    const ax=K.ax||(K.r-K.l);
    if(!over2&&!paused){mt+=dt;if(P.awT>0)P.awT=Math.max(0,P.awT-dt);if(E.awT>0)E.awT=Math.max(0,E.awT-dt);if(pvp){const k2=KS[1];P.face=E.x>P.x?1:-1;step(P,dt,ax,K,E);step(E,dt,k2.ax||(k2.r-k2.l),k2,P)}else{const A=ai(E,P,dt);cpuAw(dt);step(P,dt,ax,K,E);step(E,dt,A.ax,A.inp,P)}E.face=P.x<E.x?-1:1;if(E.hp<=0)end(1);else if(P.hp<=0)end(0)}
    KS.forEach(k=>k.jump=k.dash=k.atk=0);
    for(let i=PR.length-1;i>=0;i--){const q=PR[i],t=q.o===P?E:P;q.x+=q.vx*dt;q.y+=q.vy*dt;q.t-=dt;
      if(Math.abs(q.x-t.x)<26&&Math.abs(q.y-(t.y-45))<50){hitF(q.o,t,q.d,'p',q.st,260,q.dir);if(q.sl)t.slow=q.sl;PR.splice(i,1)}else if(q.t<=0||q.x<0||q.x>W)PR.splice(i,1)}
    for(let i=FX.length-1;i>=0;i--){FX[i].t-=dt;if(FX[i].t<=0)FX.splice(i,1)}
    updUL(dt);
    abs.forEach((r,pi)=>{const f=FT[pi],can=!f.awU&&mt<=AWWIN;r[0].firstChild.textContent=f.awT>0?'🔥 '+Math.ceil(f.awT)+'s':can?'🔥 '+Math.ceil(AWWIN-mt)+'s':'🔥 ✕';r[0].style.opacity=can?1:.4;r[1].firstChild.textContent=f.ulU?'1× ✕':AWD[f.aw].ic;r[1].style.opacity=(f.awT>0&&!f.ulU)?1:.35});
    pbs.forEach((r,pi)=>r.forEach((e,n)=>{const f=FT[pi],v=f.cd[n];e.style.opacity=v>0?.4:1;e.firstChild.textContent=v>0?Math.ceil(v):f.W.p[n][0]}));
    
    const cw=cv.width,ch=cv.height,s=Math.min(cw/W,ch/H),ox=(cw-W*s)/2,oy=(ch-H*s)/2;
    x.setTransform(1,0,0,1,0,0);x.fillStyle='#0b0f1a';x.fillRect(0,0,cw,ch);
    x.setTransform(s,0,0,s,ox,oy);
    x.drawImage(BG,0,0,W,H);{const mt=FD.M[MP][6];if(mt===2||mt===3){x.fillStyle=mt===2?'#ffb347':'#fff';for(let i=0;i<26;i++){const px=(i*83)%W+(mt===3?Math.sin(t/700+i)*12:0),py=mt===2?GY-((i*61+t/20)%GY):(i*43+t/15)%GY;x.fillRect(px,py,mt===2?2:3,mt===2?2:3)}}}
    FX.forEach(e=>{x.strokeStyle=e.c||'#fc6';x.lineWidth=5;x.globalAlpha=e.t*4;x.beginPath();x.arc(e.x,e.y,e.r*(1.2-e.t*.8),0,7);x.stroke();x.globalAlpha=1});PR.forEach(q=>{x.fillStyle=q.z?'#8cf':'#ffd54a';x.beginPath();x.arc(q.x,q.y,7,0,7);x.fill()});aura(E,t);stick(E,'#ff7a7a');aura(P,t);stick(P,'#7ad0ff');drawUL(t);bar(P,P.c.nome,1);bar(E,E.c.nome,0);if(cut)drawCut(t);
    raf=requestAnimationFrame(loop)};
  raf=requestAnimationFrame(loop);
}
})();
