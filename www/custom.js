/* Braresults 1.9.6 — Criações (armas, acessórios, mapas, sons, foto e finalizações). Criações são só DADOS (json "brc1"): validadas, limitadas e
   interpretadas por blocos conhecidos. NUNCA executam código (sem eval/Function/script/on*). */
window.BRC=(()=>{
const APPV='1.9.14',KEY='brc_lib',O0=FD.W.length,OA=FD.A.length,OM=FD.M.length,MAXB=40960;let FIXF=null;const AN={};
const vcmp=(a,b)=>{const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){const d=(x[i]||0)-(y[i]||0);if(d)return d<0?-1:1}return 0};
const hash=s=>{let h1=0xdeadbeef,h2=0x41c6ce57;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);h1=Math.imul(h1^c,2654435761);h2=Math.imul(h2^c,1597334677)}h1=Math.imul(h1^h1>>>16,2246822507)^Math.imul(h2^h2>>>13,3266489909);h2=Math.imul(h2^h2>>>16,2246822507)^Math.imul(h1^h1>>>13,3266489909);return(4294967296*(2097151&h2)+(h1>>>0)).toString(36)};
const isO=v=>!!v&&typeof v==='object'&&!Array.isArray(v);
const txt=(v,max,def)=>typeof v==='string'?v.replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,max):(def||'');
const col=(v,def)=>typeof v==='string'&&/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim())?v.trim():def;
const ico=v=>typeof v==='string'&&v.trim()&&!/[<>&"'\\]/.test(v)?Array.from(v.trim()).slice(0,2).join(''):'✨';
const enm=(v,L,def)=>L.includes(v)?v:def;
/* número com limites: fora da faixa vira o limite e avisa em português claro */
const N=(o,k,lo,hi,def,P,cx)=>{const v=o&&o[k];if(typeof v!=='number'||!isFinite(v))return def;if(v>hi){P.n.push(cx+': '+k+' acima do limite '+hi+', ajustado');return hi}if(v<lo){P.n.push(cx+': '+k+' abaixo do mínimo '+lo+', ajustado');return lo}return v};

/* ---------- sanitizador de SVG: lista branca de elementos/atributos, sem texto, sem referências externas ---------- */
const EL={svg:'svg',g:'g',path:'path',circle:'circle',ellipse:'ellipse',rect:'rect',line:'line',polyline:'polyline',polygon:'polygon',defs:'defs',lineargradient:'linearGradient',radialgradient:'radialGradient',stop:'stop'};
const AT={d:'d',cx:'cx',cy:'cy',r:'r',rx:'rx',ry:'ry',x:'x',y:'y',x1:'x1',y1:'y1',x2:'x2',y2:'y2',width:'width',height:'height',points:'points',fill:'fill',stroke:'stroke','stroke-width':'stroke-width','stroke-linecap':'stroke-linecap','stroke-linejoin':'stroke-linejoin','stroke-dasharray':'stroke-dasharray','stroke-miterlimit':'stroke-miterlimit',opacity:'opacity','fill-opacity':'fill-opacity','stroke-opacity':'stroke-opacity','fill-rule':'fill-rule',transform:'transform',id:'id',offset:'offset','stop-color':'stop-color','stop-opacity':'stop-opacity',gradientunits:'gradientUnits',gradienttransform:'gradientTransform',fx:'fx',fy:'fy',viewbox:'viewBox'};
const cleanSvg=(src,P)=>{
  if(typeof src!=='string'||!src.trim()){P.e.push('Sprite: ausente');return null}
  if(src.length>20480){P.e.push('Sprite: maior que 20 KB');return null}
  if(/<[!?]|&|<\s*\/?\s*(script|foreignobject|style|image|use|a|text|animate|set)\b/i.test(src)){P.e.push('Sprite: contém elemento ou texto não permitido');return null}
  if(!/^\s*<\s*svg\b/i.test(src))src='<svg viewBox="0 0 64 64">'+src+'</svg>';
  const re=/<\s*(\/?)\s*([a-zA-Z][\w:-]*)((?:\s[^<>]*?)?)\s*(\/?)\s*>/g,are=/([a-zA-Z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
  let m,last=0,cnt=0,st=[],out='',vb=null,root=0,ids=[];const toks=[];
  while((m=re.exec(src))){
    if(src.slice(last,m.index).trim()){P.e.push('Sprite: texto solto não permitido');return null}
    last=re.lastIndex;const close=m[1]==='/',nm=EL[m[2].toLowerCase()];
    if(!nm){P.e.push('Sprite: elemento <'+m[2]+'> não permitido');return null}
    if(++cnt>120){P.e.push('Sprite: elementos demais (máx. 120)');return null}
    if(close){if(st.pop()!==nm){P.e.push('Sprite: tags mal formadas');return null}toks.push({c:1,nm});continue}
    const self=m[4]==='/',rest=m[3]||'',at=[];let left=rest.replace(are,(_,k,v1,v2)=>{const kk=AT[k.toLowerCase()],v=v1!==undefined?v1:v2;if(!kk)return' ';if(!/^[A-Za-z0-9\s.,#%()+\-_]*$/.test(v)||(/url\(/i.test(v)&&!/^url\(#[\w-]+\)$/.test(v.trim())))return' ';at.push([kk,v]);return' '});
    if(left.trim()&&!/^[\w:.-]+(\s+[\w:.-]+)*$/.test(left.trim())){P.e.push('Sprite: atributo inválido');return null}
    if(nm==='svg'){if(root++){P.e.push('Sprite: mais de um <svg>');return null}const a=at.find(q=>q[0]==='viewBox');if(a){const p=a[1].trim().split(/[\s,]+/).map(Number);if(p.length===4&&p.every(isFinite)&&p[2]>0&&p[3]>0)vb=p}}
    at.forEach(q=>{if(q[0]==='id')ids.push(q[1])});
    toks.push({nm,at,self});if(!self)st.push(nm)}
  if(src.slice(last).trim()||st.length||!root){P.e.push('Sprite: formato inválido');return null}
  const pre='cx_'+hash(src).slice(0,6)+'_',mp=s=>s.startsWith('cx_')?s:pre+s;
  toks.forEach(t=>{if(t.nm==='svg')return;if(t.c){out+='</'+t.nm+'>';return}
    out+='<'+t.nm+t.at.map(([k,v])=>' '+k+'="'+(k==='id'?mp(v):v.replace(/url\(#([\w-]+)\)/g,(_,i)=>'url(#'+mp(i)+')'))+'"').join('')+(t.self?'/>':'>')});
  if(vb){const s=Math.max(.05,Math.min(20,64/Math.max(vb[2],vb[3])));if(Math.abs(s-1)>.001||vb[0]||vb[1])out='<g transform="scale('+s.toFixed(4)+') translate('+(-vb[0])+' '+(-vb[1])+')">'+out+'</g>'}
  return out};

/* ---------- blocos de poder (conjunto inicial) ---------- */
const FORMA={orbe:{em:'🔮',sz:20},caveira:{em:'💀',sz:24},lamina:{em:'🗡️',sz:22},flecha:{ln:24,sz:10},estrela:{em:'✴️',sz:18,spn:1}};
const RAST=['fogo','gelo','raio','fumaca','nenhum'],STE=['queimar','congelar','lentidao','silenciar','cura','escudo','velocidade'];
const rast=(r,P,cx)=>{if(!isO(r))return{tipo:'nenhum',cor1:'#ffffff',cor2:'#888888'};return{tipo:enm(r.tipo,RAST,'nenhum'),cor1:col(r.cor1,'#ffffff'),cor2:col(r.cor2,'#444444')}};
const clean1={
 projetil:(b,P,cx)=>({b:'projetil',forma:enm(b.forma,Object.keys(FORMA),'orbe'),vel:N(b,'vel',200,900,520,P,cx),dano:N(b,'dano',1,22,10,P,cx),quantidade:Math.round(N(b,'quantidade',1,5,1,P,cx)),espalhamento:N(b,'espalhamento',0,40,0,P,cx),perfura:!!b.perfura,rastro:rast(b.rastro,P,cx),explode:isO(b.explode)?{raio:N(b.explode,'raio',20,120,70,P,cx),dano:N(b.explode,'dano',0,14,0,P,cx)}:null}),
 onda:(b,P,cx)=>({b:'onda',largura:N(b,'largura',40,140,80,P,cx),vel:N(b,'vel',250,700,480,P,cx),dano:N(b,'dano',1,20,8,P,cx),empurrao:N(b,'empurrao',0,400,180,P,cx),cor:col(b.cor,'#8ff')}),
 investida:(b,P,cx)=>({b:'investida',distancia:N(b,'distancia',80,320,200,P,cx),dano:N(b,'dano',1,20,9,P,cx),invencivel_s:N(b,'invencivel_s',0,.6,.3,P,cx)}),
 chuva:(b,P,cx)=>({b:'chuva',area:N(b,'area',150,600,400,P,cx),quantidade:Math.round(N(b,'quantidade',3,20,8,P,cx)),dano:N(b,'dano',1,14,6,P,cx),duracao_s:N(b,'duracao_s',1,4,2,P,cx),forma:enm(b.forma,['caveira','orbe','lamina','estrela'],'orbe'),rastro:rast(b.rastro,P,cx)}),
 orbita:(b,P,cx)=>({b:'orbita',quantidade:Math.round(N(b,'quantidade',1,6,3,P,cx)),raio:N(b,'raio',50,160,90,P,cx),vel:N(b,'vel',1,6,3,P,cx),dano:N(b,'dano',1,18,8,P,cx),duracao_s:N(b,'duracao_s',1,5,3,P,cx),explode_no_fim:!!b.explode_no_fim,forma:enm(b.forma,['caveira','orbe','lamina','estrela'],'orbe'),rastro:rast(b.rastro,P,cx)}),
 aura:(b,P,cx)=>({b:'aura',raio:N(b,'raio',50,200,110,P,cx),dano_por_s:N(b,'dano_por_s',1,10,4,P,cx),duracao_s:N(b,'duracao_s',1,5,3,P,cx),cor:col(b.cor,'#ff7a2a')}),
 invocar:(b,P,cx)=>({b:'invocar',tipo:enm(b.tipo,['cao','caveira','espirito'],'espirito'),dano:N(b,'dano',1,10,5,P,cx),duracao_s:N(b,'duracao_s',2,6,4,P,cx)}),
 status:(b,P,cx)=>{const ef=enm(b.efeito,STE,'lentidao'),o={b:'status',efeito:ef,alcance:N(b,'alcance',60,400,220,P,cx)};
   if(ef==='queimar'){o.valor=N(b,'valor',1,6,3,P,cx);o.duracao_s=N(b,'duracao_s',1,5,3,P,cx)}
   else if(ef==='congelar')o.duracao_s=N(b,'duracao_s',.3,1.5,.8,P,cx);
   else if(ef==='lentidao'||ef==='silenciar')o.duracao_s=N(b,'duracao_s',1,3,2,P,cx);
   else if(ef==='cura')o.valor=N(b,'valor',1,20,10,P,cx);
   else if(ef==='escudo'){o.valor=N(b,'valor',1,15,8,P,cx);o.duracao_s=N(b,'duracao_s',1,5,3,P,cx)}
   else{o.valor=N(b,'valor',10,50,30,P,cx);o.duracao_s=N(b,'duracao_s',1,6,3,P,cx)}return o},
 teleporte:(b,P,cx)=>({b:'teleporte',distancia:N(b,'distancia',80,320,200,P,cx),dano:N(b,'dano',0,12,0,P,cx)}),
 terremoto:(b,P,cx)=>({b:'terremoto',raio:N(b,'raio',60,180,110,P,cx),dano:N(b,'dano',1,20,10,P,cx),atordoar:N(b,'atordoar',0,1,.4,P,cx)}),
 atrai:(b,P,cx)=>({b:'atrai',alcance:N(b,'alcance',100,400,250,P,cx)}),
 repele:(b,P,cx)=>({b:'repele',alcance:N(b,'alcance',60,300,160,P,cx),dano:N(b,'dano',0,10,0,P,cx)}),
 cura:(b,P,cx)=>({b:'cura',valor:N(b,'valor',1,20,10,P,cx)}),
 escudo:(b,P,cx)=>({b:'escudo',valor:N(b,'valor',1,15,8,P,cx),duracao_s:N(b,'duracao_s',1,5,3,P,cx)}),
 visual:(b,P,cx)=>({b:'visual',flash:!!b.flash,tremor_tela:N(b,'tremor_tela',0,8,0,P,cx),cor:col(b.cor,'#ffffff')}),
 som:(b,P,cx)=>{const id=typeof b.id==='string'&&/^pw_[A-Za-z]{2,12}$/.test(b.id)?b.id.slice(3):'';if(!id||!SNDS().includes(id)){P.n.push(cx+': som "'+txt(b.id,20)+'" não existe, ignorado');return null}return{b:'som',id:b.id}}};
const SNDS=()=>{const a=[];for(let i=0;i<O0;i++)FD.W[i].slice(3).forEach(p=>a.push(p[6]));return a};
/* orçamento de dano de um poder (mesma escala dos poderes embutidos) */
const orc=b=>b.b==='projetil'?(b.dano+(b.explode?b.explode.dano:0))*b.quantidade:b.b==='chuva'?b.dano*b.quantidade:b.b==='orbita'?b.dano*b.quantidade*(b.explode_no_fim?1:1):b.b==='aura'?b.dano_por_s*b.duracao_s:b.b==='invocar'?b.dano*b.duracao_s:b.b==='status'?(b.efeito==='queimar'?b.valor*b.duracao_s:b.efeito==='congelar'?b.duracao_s*8:b.efeito==='silenciar'?b.duracao_s*4:b.efeito==='lentidao'?b.duracao_s*2:0):('dano'in b?b.dano:0);
const BMAX=30,DPS=2.6;
const scaleD=(b,k)=>{['dano','dano_por_s'].forEach(f=>{if(f in b)b[f]=+(b[f]*k).toFixed(2)});if(b.explode)b.explode.dano=+(b.explode.dano*k).toFixed(2);if(b.b==='status'&&b.efeito==='queimar')b.valor=+(b.valor*k).toFixed(2)};
const SWM={blade:0,heavy:1,dagger:3,bow:4,magic:5,shield:6,spear:7,blunt:9,gun:10,throw:11,fire:12,ice:13,zap:14,katana:15,guitar:16,punch:18};
const FAM=['cut','blunt','shot','elem'];

/* ---------- validador de pacote brc1 ---------- */
const validate=raw=>{
  const P={e:[],n:[]};let o=raw;
  if(typeof raw==='string'){if(raw.length>300000)return{ok:0,e:['Arquivo grande demais'],n:[]};try{o=JSON.parse(raw)}catch(x){return{ok:0,e:['Não é um JSON válido'],n:[]}}}
  if(!isO(o))return{ok:0,e:['Arquivo inválido'],n:[]};
  if(o.fmt!=='brc1')P.e.push('Formato desconhecido (esperado "brc1")');
  const tipo=o.tipo;if(!['arma','acessorio','mapa','som','finalizacao','despertar'].includes(tipo))P.e.push('Tipo inválido');
  if(vcmp(o.ver_min_app||'1.9.0',APPV)>0)P.e.push('Requer atualização do app (versão '+o.ver_min_app+')');
  const d=o.dados;if(!isO(d))P.e.push('Faltam os "dados" da criação');
  if(P.e.length)return{ok:0,e:P.e,n:P.n};
  if(tipo==='som')return vSom(o,d,P);if(tipo==='acessorio')return vAcc(o,d,P);if(tipo==='mapa')return vMap(o,d,P);if(tipo==='finalizacao')return vFin(o,d,P);if(tipo==='despertar')return vDes(o,d,P);
  const nome=txt(o.nome,24);if(!nome)P.e.push('Nome ausente (1 a 24 caracteres)');
  const cd={atrib:{dano:N(isO(d.atrib)?d.atrib:{},'dano',12,40,22,P,'Atributos')},cor1:col(d.cor1,'#ffffff'),cor2:col(d.cor2,'#111111'),swing:enm(d.swing,Object.keys(SWM),'blade'),familia_impacto:enm(d.familia_impacto,FAM,'cut')};
  cd.sprite=cleanSvg(d.sprite,P);
  if(!Array.isArray(d.poderes)||d.poderes.length!==3)P.e.push('A arma precisa ter exatamente 3 poderes');
  else cd.poderes=d.poderes.map((p,i)=>{const cx='Poder '+(i+1);if(!isO(p)){P.e.push(cx+': inválido');return null}
    const bl=Array.isArray(p.blocos)?p.blocos.slice(0,4):[];if(!bl.length)P.e.push(cx+': sem blocos');
    const bs=[];bl.forEach(b=>{if(!isO(b)){return}const f=clean1[b.b];if(!f){P.e.push(cx+': bloco "'+txt(String(b.b),16)+'" desconhecido');return}const r=f(b,P,cx);if(r)bs.push(r)});
    let bud=bs.reduce((s,b)=>s+orc(b),0);if(bud>BMAX){const k=BMAX/bud;bs.forEach(b=>scaleD(b,k));P.n.push(cx+': dano total '+Math.round(bud)+' acima do limite '+BMAX+', reduzido');bud=BMAX}
    let rc=N(p,'recarga',3,20,8,P,cx);const mn=+(bud/DPS).toFixed(1);if(rc<mn){P.n.push(cx+': recarga '+rc+'s curta para o dano, ajustada para '+mn+'s');rc=mn}
    return{nome:txt(p.nome,16,'Poder '+(i+1))||'Poder '+(i+1),icone:ico(p.icone),recarga:+rc.toFixed(1),blocos:bs}});
  if(cd.poderes&&cd.poderes.some(p=>!p))P.e.push('Poderes inválidos');
  if(P.e.length)return{ok:0,e:P.e,n:P.n};
  const fo=vFoto(o,P),pkg={fmt:'brc1',tipo:'arma',id:'',nome,autor:txt(o.autor,20),versao:Math.max(1,Math.round(+o.versao||1)),ver_min_app:'1.9.0',dados:cd};if(fo)pkg.foto=fo;
  pkg.id='c_'+hash(JSON.stringify(cd));
  const tam=JSON.stringify(pkg).length;if(tam-fo.length>MAXB){return{ok:0,e:['Criação grande demais ('+((tam-fo.length)/1024).toFixed(1)+' KB; máx. 40 KB)'],n:P.n}}
  return{ok:1,pkg,tam,e:[],n:P.n}};

/* ---------- acessórios e mapas (mesmo pacote brc1) ---------- */
const vFoto=(o,P)=>{const f=o.foto;if(f==null||f==='')return'';if(typeof f!=='string'||!/^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+/]+={0,2}$/.test(f)){P.n.push('Foto: formato inválido, ignorada');return''}const b=f.slice(f.indexOf(',')+1);if(Math.floor(b.length*3/4)>40960){P.n.push('Foto: maior que 40 KB, ignorada');return''}let h='';try{h=atob(b.slice(0,16))}catch(e){return''}
  const ok=f.startsWith('data:image/webp')?h.startsWith('RIFF')&&h.slice(8,12)==='WEBP':f.startsWith('data:image/png')?h.startsWith('\x89PNG'):h.charCodeAt(0)===255&&h.charCodeAt(1)===216;if(!ok){P.n.push('Foto: o arquivo não confere com o formato, ignorada');return''}return f};

/* ---------- DESPERTAR (tipo "despertar"): aura, buffs temporários e 4º poder (poder final) para um candidato ---------- */
const BUL=90,DSEC=['spd','jmp','dmg','def','cdr','ls','reg','acd','kbr','dcd','pdm','crit'];
const vDes=(o,d,P)=>{const nome=txt(o.nome,24);if(!nome)P.e.push('Nome ausente (1 a 24 caracteres)');
  const cand=txt(d.candidato,40);if(cand&&cand.replace(/[^A-Za-zÀ-ÿ]/g,'').length<3)P.e.push('Candidato: nome curto demais (mín. 3 letras)');if(!cand)P.n.push('O arquivo não traz candidato: escolha um da lista do jogo no botão 👤');
  const cs=Array.isArray(d.cores)?d.cores:[];if(cs.length<3)P.n.push('Cores: o despertar usa 3 cores (brilho, aura, sombra); as que faltavam foram preenchidas');
  const cores=[0,1,2].map(i=>col(cs[i],['#fff2c0','#ffcc33','#aa5500'][i]));
  const bp=N(d,'bonus_poder',0,.4,.15,P,'Despertar'),a=isO(d.atrib)?d.atrib:{},st={};
  Object.keys(a).forEach(k=>{if(!DSEC.includes(k)){P.n.push('Atributos: "'+txt(k,12)+'" não vale no despertar, ignorado');return}const v=N(a,k,LIM[k][0],LIM[k][1],0,P,'Atributos');if(v)st[k]=rnd(k,v)});
  if(Object.keys(st).length>5){Object.keys(st).slice(5).forEach(k=>delete st[k]);P.n.push('Atributos: máximo de 5 bônus, o resto foi ignorado')}
  let pos=0,neg=0;Object.keys(st).forEach(k=>{const h=LIM[k][1];st[k]>0?pos+=st[k]/h:neg+=-st[k]/h});const cap=Math.min(2.4,2+.5*neg);
  if(pos>cap){const f=cap/pos;Object.keys(st).forEach(k=>{if(st[k]>0)st[k]=rnd(k,st[k]*f)});P.n.push('Atributos: bônus fortes demais juntos, reduzidos proporcionalmente')}
  const p=d.poder_final,cx='Poder final';let pf=null;
  if(!isO(p))P.e.push('Falta o "poder_final" (o 4º poder do despertar)');
  else{const bl=Array.isArray(p.blocos)?p.blocos.slice(0,4):[];if(!bl.length)P.e.push(cx+': sem blocos');
    const bs=[];bl.forEach(b=>{if(!isO(b))return;const f=clean1[b.b];if(!f){P.e.push(cx+': bloco "'+txt(String(b.b),16)+'" desconhecido');return}const r=f(b,P,cx);if(r)bs.push(r)});
    let bud=bs.reduce((s,b)=>s+orc(b),0);if(bud>BUL){const k=BUL/bud;bs.forEach(b=>scaleD(b,k));P.n.push(cx+': dano total '+Math.round(bud)+' acima do limite '+BUL+', reduzido')}
    pf={nome:txt(p.nome,16,'Poder final')||'Poder final',icone:ico(p.icone),lancar:p.lancar?1:0,espera:p.lancar?Math.min(8,Math.max(1,Math.round((+p.espera_s||3)*10)/10)):0,blocos:bs}}
  if(P.e.length)return{ok:0,e:P.e,n:P.n};
  return mkPkg(o,'despertar',nome,{candidato:cand,icone:ico(o.icone||d.icone),cores,bonus_poder:+bp.toFixed(2),atrib:st,poder_final:pf},P,12288)};
const mkPkg=(o,tipo,nome,cd,P,max)=>{const fo=vFoto(o,P),pkg={fmt:'brc1',tipo,id:'c_'+hash(JSON.stringify(cd)),nome,autor:txt(o.autor,20),versao:Math.max(1,Math.round(+o.versao||1)),ver_min_app:tipo==='despertar'?'1.9.9':tipo==='finalizacao'?'1.9.4':tipo==='som'?'1.9.2':'1.9.1',dados:cd};if(fo)pkg.foto=fo;const tam=JSON.stringify(pkg).length;if(tam-fo.length>max)return{ok:0,e:['Criação grande demais ('+(tam/1024).toFixed(1)+' KB; máx. '+max/1024+' KB)'],n:P.n};return{ok:1,pkg,tam,e:[],n:P.n}};
const LIM={spd:[-.12,.15],jmp:[-.15,.35],dmg:[-.12,.12],def:[-.12,.15],cdr:[-.2,.2],ls:[0,.08],hp:[-30,30],reg:[0,3.6],acd:[-.1,.15],kbr:[-.2,.4],dcd:[-.2,.3],pdm:[-.1,.15],crit:[0,.15]},ANC=['cabeca','rosto','costas','mao'];
const rnd=(k,v)=>k==='hp'?Math.round(v):k==='reg'?+v.toFixed(1):+v.toFixed(3);
const vAcc=(o,d,P)=>{const nome=txt(o.nome,24);if(!nome)P.e.push('Nome ausente (1 a 24 caracteres)');
  const a=isO(d.atrib)?d.atrib:{},st={};let ks=Object.keys(a);
  ks.forEach(k=>{if(!LIM[k]){P.n.push('Atributos: \"'+txt(k,12)+'\" desconhecido, ignorado');return}const v=N(a,k,LIM[k][0],LIM[k][1],0,P,'Atributos');if(v)st[k]=rnd(k,v)});
  if(Object.keys(st).length>4){Object.keys(st).slice(4).forEach(k=>delete st[k]);P.n.push('Atributos: máximo de 4 bônus, o resto foi ignorado')}
  if(!Object.keys(st).length)P.e.push('Atributos: precisa de pelo menos 1 bônus válido');
  let pos=0,neg=0;Object.keys(st).forEach(k=>{const h=LIM[k][1];st[k]>0?pos+=st[k]/h:neg+=-st[k]/h});const cap=Math.min(1.8,1.4+.5*neg);
  if(pos>cap){const f=cap/pos;Object.keys(st).forEach(k=>{if(st[k]>0)st[k]=rnd(k,st[k]*f)});P.n.push('Atributos: bônus fortes demais juntos, reduzidos proporcionalmente')}
  const sp=cleanSvg(d.sprite,P);if(P.e.length)return{ok:0,e:P.e,n:P.n};
  return mkPkg(o,'acessorio',nome,{atrib:st,sprite:sp,ancora:enm(d.ancora,ANC,'cabeca'),icone:ico(o.icone||d.icone)},P,25600)};
const TEMAS=['praca','noite','vulcao','geleira','neon'];
const vMap=(o,d,P)=>{const nome=txt(o.nome,24);if(!nome)P.e.push('Nome ausente (1 a 24 caracteres)');
  const ceu=isO(d.ceu)?d.ceu:{},ch=isO(d.chao)?d.chao:{};let pl=Array.isArray(d.plataformas)?d.plataformas.filter(isO):[];
  if(pl.length>5){pl=pl.slice(0,5);P.n.push('Mapa: máximo de 5 plataformas, o resto foi ignorado')}
  pl=pl.map((q,i)=>{const cx='Plataforma '+(i+1),w=Math.round(N(q,'w',60,200,120,P,cx)),x=Math.round(N(q,'x',0,800-w,100,P,cx)),y=Math.round(N(q,'y',150,340,305,P,cx));return{x,w,y}});
  /* alcançabilidade: do chão (y=380) ou de outra plataforma já alcançada, degrau máx. 120 e vão máx. 340 (pulo base ≈136 px; checagem aproximada) */
  const ex=q=>{const c=(q.x+q.w/2)*2,w=q.w*1.3;return[c-w/2,c+w/2]},ok=pl.map(()=>0);let ch2=1;while(ch2){ch2=0;pl.forEach((q,i)=>{if(ok[i])return;const[l,r]=ex(q);let good=380-q.y<=120;pl.forEach((u,j)=>{if(!good&&ok[j]&&u.y-q.y<=120){const[l2,r2]=ex(u);if(Math.max(l-r2,l2-r)<=340)good=true}});if(good){ok[i]=1;ch2=1}})}
  pl.forEach((q,i)=>{if(!ok[i])P.e.push('Plataforma '+(i+1)+': inalcançável (altura '+q.y+'; use degraus de até 120 de altura e vãos de até 340)')});
  if(P.e.length)return{ok:0,e:P.e,n:P.n};
  if(d.perigos||d.pontos_inicio)P.n.push('Mapa: perigos e pontos de início ainda não existem no jogo, ignorados');
  return mkPkg(o,'mapa',nome,{tema:enm(d.tema,TEMAS,'praca'),ceu:{cor1:col(ceu.cor1,'#6ab8ff'),cor2:col(ceu.cor2,'#d6f0ff')},chao:{cor:col(ch.cor,'#3f7d4a')},plataforma_cor:col(d.plataforma_cor,'#8a6a44'),icone:ico(o.icone||d.icone),plataformas:pl},P,20480)};
const EVT={jump:'Pulo',dash:'Dash (investida)',dodge:'Esquiva',block:'Defesa',reflect:'Reflexo',round:'Início do round',fight:'"Lutar!"',ko:'Nocaute',boom:'Explosão',ui_tap:'Toque nos menus',ui_go:'Começar a luta',awaken:'Despertar',win_good:'Vitória',win_bad:'Derrota'};
const vSom=(o,d,P)=>{const nome=txt(o.nome,24);if(!nome)P.e.push('Nome ausente (1 a 24 caracteres)');
  const ev=typeof d.evento==='string'&&EVT[d.evento]?d.evento:'';if(!ev)P.e.push('Evento inválido (use: '+Object.keys(EVT).join(', ')+')');
  const a=(typeof d.audio==='string'?d.audio.trim():'').replace(/^data:audio\/[\w.+-]+;base64,/,''),fm={};
  if(!/^[A-Za-z0-9+/]{16,}={0,2}$/.test(a))P.e.push('Áudio: ausente ou base64 inválido');
  else{const by=Math.floor(a.length*3/4)-(a.endsWith('==')?2:a.endsWith('=')?1:0);if(by>143360)P.e.push('Áudio: maior que 140 KB');
    let h='';try{h=atob(a.slice(0,16))}catch(e){}
    fm.f=h.startsWith('OggS')?'ogg':h.startsWith('RIFF')&&h.slice(8,12)==='WAVE'?'wav':h.startsWith('ID3')||(h.charCodeAt(0)===255&&(h.charCodeAt(1)&224)===224)?'mp3':'';
    if(!fm.f)P.e.push('Áudio: formato não reconhecido (use ogg, mp3 ou wav)')}
  if(P.e.length)return{ok:0,e:P.e,n:P.n};
  return mkPkg(o,'som',nome,{evento:ev,formato:fm.f,audio:a},P,200000)};
const b64u8=a=>{const s=atob(a),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u};
const decSom=pkg=>window.SFX&&SFX.dec?SFX.dec(b64u8(pkg.dados.audio).buffer):Promise.reject(new Error('sem áudio'));
const applySnd=()=>{if(!(window.SFX&&SFX.cust))return;const m={};items.forEach(i=>{if(i.pkg.tipo==='som'&&i.buf)m[i.pkg.dados.evento]=i.buf});SFX.cust(m)};
/* ---------- FINALIZAÇÃO POR MODELO: linha do tempo de ações de uma lista permitida (só dados, sem código) ---------- */
const FACT=['golpes_rapidos','corte','raio','particulas','flash','tremor','escurecer','som','camera_zoom','explosao','mordida','texto'];
const FSOM=['ko','boom','boom_b','splat','splat_big','reflect','awaken','hit_cut_h','hit_blunt_h','hit_elem_h','hit_shot_h','swing_blade','swing_katana','swing_heavy','swing_punch','swing_fire','swing_zap','pw_lgThunder','pw_stBolt','pw_hmQuake','round','fight'];
const FMAX={golpes_rapidos:4,corte:8,raio:6,particulas:10,flash:12,tremor:12,escurecer:8,som:16,camera_zoom:8,explosao:3,mordida:3,texto:4};
const PCOR={fogo:['#ffb347','#ff3a00'],gelo:['#e8fbff','#6cc8ff'],fumaca:['#d0d0d0','#555555'],faiscas:['#fff3a0','#ffb347']};
const FO=[];
const vFin=(o,d,P)=>{const nome=txt(o.nome,24);if(!nome)P.e.push('Nome ausente (1 a 24 caracteres)');
  const dur=N(d,'duracao_s',4,15,8,P,'Finalização');let ev=Array.isArray(d.eventos)?d.eventos.filter(isO):[];
  if(!ev.length)P.e.push('Finalização: precisa de pelo menos 1 evento em "eventos"');
  if(ev.length>40){ev=ev.slice(0,40);P.n.push('Finalização: máximo de 40 eventos, o resto foi ignorado')}
  const cnt={};
  ev=ev.map((e,i)=>{const cx='Evento '+(i+1),a=e.acao;
    if(!FACT.includes(a)){P.e.push(cx+': ação "'+txt(String(a),16)+'" desconhecida');return null}
    if((cnt[a]=(cnt[a]||0)+1)>FMAX[a]){P.n.push(cx+': ações "'+a+'" demais (máx. '+FMAX[a]+'), esta foi ignorada');return null}
    const f=(k,lo,hi,df)=>+N(e,k,lo,hi,df,P,cx).toFixed(2),c=(k,df)=>col(e[k],df),r={t:f('t',0,+(dur-.3).toFixed(1),1),acao:a};
    if(a==='golpes_rapidos'){r.dur=f('dur',.5,6,2);r.forca=Math.round(f('forca',1,5,3));r.cor=c('cor','#ffe27a')}
    else if(a==='corte'){r.angulo=Math.round(f('angulo',-80,80,-35));r.cor=c('cor','#ffffff')}
    else if(a==='raio'){r.dur=f('dur',.3,3,.8);r.cor=c('cor','#bfe8ff')}
    else if(a==='particulas'){r.tipo=enm(e.tipo,Object.keys(PCOR),'faiscas');r.dur=f('dur',.3,6,2);r.taxa=Math.round(f('taxa',10,150,60));r.cor1=c('cor1',PCOR[r.tipo][0]);r.cor2=c('cor2',PCOR[r.tipo][1]);r.alvo=enm(e.alvo,['perdedor','vencedor'],'perdedor')}
    else if(a==='flash'){r.cor=c('cor','#ffffff');r.dur=f('dur',.1,1.5,.5)}
    else if(a==='tremor'){r.forca=Math.round(f('forca',1,24,8));r.dur=f('dur',.1,4,1)}
    else if(a==='escurecer'){r.valor=f('valor',0,.85,.5);r.dur=f('dur',.2,4,1);r.cor=c('cor','#00000a')}
    else if(a==='som')r.evento=enm(e.evento,FSOM,'boom');
    else if(a==='camera_zoom'){r.zoom=f('zoom',.8,1.8,1.3);r.dur=f('dur',.2,4,1)}
    else if(a==='explosao'){r.forca=Math.round(f('forca',40,220,110));r.cor1=c('cor1','#ffb347');r.cor2=c('cor2','#ff3a00')}
    else if(a==='mordida'){r.quantidade=Math.round(f('quantidade',1,6,2));r.intervalo=f('intervalo',.2,1,.45)}
    else{r.texto=txt(typeof e.texto==='string'?e.texto:'',16).replace(/[^\p{L}\p{N} !?.,-]/gu,'').trim();if(!r.texto){P.e.push(cx+': "texto" ausente');return null}r.cor=c('cor','#ffffff');r.dur=f('dur',.3,4,1.5)}
    return r}).filter(Boolean);
  if(P.e.length)return{ok:0,e:P.e,n:P.n};
  ev.sort((a,b)=>a.t-b.t);
  return mkPkg(o,'finalizacao',nome,{duracao_s:+dur.toFixed(1),distancia:Math.round(N(d,'distancia',50,220,90,P,'Finalização')),icone:ico(o.icone||d.icone),eventos:ev},P,30720)};

/* execução da cena: usa os auxiliares do jogo entregues por fctx (partículas, flashes, tremor...) */
let FC=null;
const rgba=(h,a)=>{h=h.length===4?'#'+h[1]+h[1]+h[2]+h[2]+h[3]+h[3]:h;return'rgba('+parseInt(h.slice(1,3),16)+','+parseInt(h.slice(3,5),16)+','+parseInt(h.slice(5,7),16)+','+a+')'};
const fsnd=n=>{try{SFX.p(n)}catch(e){}};
const fpush=(c,p)=>{if(c.FP.length<900)c.FP.push(p)};
const fes=u=>{u=Math.max(0,Math.min(1,u));return u*u*(3-2*u)};
const fpart=(c,e,s)=>{const t=e.tipo,px=s.x+(Math.random()-.5)*30,py=s.y-8-Math.random()*60,r=Math.random(),cc=Math.random()<.5?e.cor1:e.cor2;
  if(t==='fogo')fpush(c,{x:px,y:py,vx:(Math.random()-.5)*50,vy:-80-r*140,g:-40,t:.5+Math.random()*.5,s:3+Math.random()*4,c:cc,bl:0});
  else if(t==='gelo')fpush(c,{x:px,y:py,vx:(Math.random()-.5)*60,vy:-40-r*80,g:140,t:.8+Math.random()*.6,s:2+Math.random()*3,c:cc,bl:0});
  else if(t==='fumaca')fpush(c,{x:px,y:py,vx:(Math.random()-.5)*30,vy:-30-r*60,g:-15,t:1+Math.random()*.8,s:5+Math.random()*5,c:cc,bl:0});
  else fpush(c,{x:px,y:py,vx:(Math.random()-.5)*400,vy:-60-r*300,g:700,t:.4+Math.random()*.5,s:2+Math.random()*2,c:cc,bl:0})};
const fbolt=(cx,cy)=>{const top=cy-430,o=[];for(let i=0;i<=8;i++)o.push([cx+(i<8?(Math.random()-.5)*70*(1-i/10):0),top+(cy-top)*i/8]);return o};
const ffire=(F,e,w,l,d)=>{const c=FC,cx=l.x,cy=l.y-45,FB=c.fb(),T=F.t;
  if(e.acao==='golpes_rapidos')F.act.push({a:'g',t1:T+e.dur,e,bu:0,n:0});
  else if(e.acao==='particulas')F.act.push({a:'p',t1:T+e.dur,e,bu:0});
  else if(e.acao==='tremor')F.act.push({a:'s',t1:T+e.dur,e});
  else if(e.acao==='raio'){F.act.push({a:'r',t1:T+e.dur,e,bu:0,pts:fbolt(cx,cy)});F.cfl=.8;F.cflc=e.cor;F.cfd=.25;fsnd('pw_lgThunder')}
  else if(e.acao==='corte'){F.sl.push({t0:T,e});l.hit=.25;c.shk(8);fsnd('hit_cut_h');const a=e.angulo*Math.PI/180;
    for(let i=0;i<(FB?26:14);i++){const u=(Math.random()-.5)*150;fpush(c,{x:cx+Math.cos(a)*u,y:cy+Math.sin(a)*u,vx:(Math.random()-.5)*260,vy:-Math.random()*220,g:700,t:.5+Math.random()*.5,s:2+Math.random()*3,c:FB&&i%2?'#b00':e.cor,bl:FB?1:0})}}
  else if(e.acao==='flash'){F.cfl=1;F.cflc=e.cor;F.cfd=e.dur}
  else if(e.acao==='escurecer'){F.dkT=e.valor;F.dkC=e.cor;F.dkR=1/e.dur}
  else if(e.acao==='som')fsnd(e.evento);
  else if(e.acao==='camera_zoom'){F.zT=e.zoom;F.zR=1/e.dur}
  else if(e.acao==='mordida')F.bt.push({t0:T,n:e.quantidade,iv:e.intervalo,k:0});
  else if(e.acao==='texto')F.tx.push({t0:T,e});
  else if(e.acao==='explosao'){F.hid=1;l.hid=1;c.shk(24);c.FX.push({x:cx,y:cy,r:e.forca+40,c:e.cor1,t:.45});F.cfl=1;F.cflc='#ffffff';F.cfd=.45;fsnd('boom');
    for(let i=0,n=Math.min(260,60+e.forca);i<n;i++){const a=Math.random()*6.283,sp=e.forca*(.6+Math.random()*3.4);fpush(c,{x:cx+(Math.random()-.5)*20,y:cy+(Math.random()-.5)*30,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-100,g:700,t:1.2+Math.random()*1.4,s:2+Math.random()*4,c:FB&&i%3===0?'#b00':i%2?e.cor1:e.cor2,bl:FB&&i%3===0?1:0})}}};
const fstep=(k,F,dt,T,w,l,d)=>{try{const c=FC;if(!c)throw 0;
  if(!F.o){const q=FO.find(z=>z.k===k);if(!q)throw 0;Object.assign(F,{o:q,ci:0,act:[],sl:[],bt:[],tx:[],dk:0,dkT:0,dkC:'#00000a',dkR:1,zm:1,zT:1,zR:1,cfl:0,cflc:'#ffffff',cfd:.4,hid:0,jg:0,psh:0})}
  const o=F.o,FB=c.fb();
  if(T<.7){const q=Math.min(1,dt*9);w.x+=(l.x-d*o.dist-w.x)*q;w.y+=(c.GY-w.y)*q;l.y+=(c.GY-l.y)*q}else{w.y=c.GY;if(!F.hid)l.y=c.GY;w.x=l.x-d*o.dist}
  while(F.ci<o.ev.length&&o.ev[F.ci].t<=T)ffire(F,o.ev[F.ci++],w,l,d);
  for(let i=F.act.length-1;i>=0;i--){const a=F.act[i],e=a.e;if(T>=a.t1){F.act.splice(i,1);continue}
    if(a.a==='g'){w.atk=.22*(1-((T*13)%1));if(!F.hid)l.hit=.1;if(F.psh<180){l.x+=d*dt*6;F.psh+=dt*6}a.bu-=dt;
      while(a.bu<=0){a.bu+=Math.max(.03,.16-.025*e.forca);const px=l.x+(Math.random()-.5)*26,py=l.y-12-Math.random()*56;c.FX.push({x:px,y:py,r:18+Math.random()*18,c:Math.random()<.5?'#fff3a0':e.cor,t:.2});
        for(let j=0,n=FB?4:3;j<n;j++)fpush(c,{x:px,y:py,vx:d*(60+Math.random()*320)+(Math.random()-.5)*120,vy:-Math.random()*300,g:900,t:.7+Math.random()*.8,s:2+Math.random()*3,c:FB&&j%2?'#b00':e.cor,bl:FB?1:0});
        c.shk(2+e.forca*1.6);if(++a.n%2===0)fsnd('hit_blunt_h')}}
    else if(a.a==='p'){const src=e.alvo==='vencedor'?w:l,st=1/e.taxa;let g=0;a.bu-=dt;while(a.bu<=0&&g++<8){a.bu+=st;fpart(c,e,src)}}
    else if(a.a==='s')c.shk(e.forca);
    else if(a.a==='r'){if(!F.hid)l.hit=.1;c.shk(6);a.bu-=dt;if(a.bu<=0){a.bu=.05;a.pts=fbolt(l.x,l.y-45)}}}
  F.bt.forEach(b=>{const tt=T-b.t0,ix=Math.floor(tt/b.iv);if(ix<b.n&&(tt-ix*b.iv)/b.iv>=.72&&b.k<=ix){b.k=ix+1;const cx=l.x,cy=l.y-45;c.shk(7);if(!F.hid)l.hit=.25;c.FX.push({x:cx,y:cy,r:40,c:'#ffffff',t:.12});fsnd('splat');
    for(let i=0;i<10;i++)fpush(c,{x:cx+(Math.random()-.5)*50,y:cy+(Math.random()-.5)*30,vx:(Math.random()-.5)*300,vy:-Math.random()*240,g:800,t:.5+Math.random()*.5,s:2+Math.random()*3,c:FB?'#b00':'#dddddd',bl:FB?1:0})}});
  F.dk+=(F.dkT-F.dk)*(1-Math.exp(-dt*3*F.dkR));F.zm+=(F.zT-F.zm)*(1-Math.exp(-dt*3*F.zR));F.cfl=Math.max(0,F.cfl-dt/F.cfd);
  if(!F.jg&&T>=Math.max(1,o.dur-2.4)){F.jg=1;try{SFX.win(F.good,0)}catch(e){}}
  if(!F.hid&&T>=o.dur-.05){F.hid=1;l.hid=1;for(let i=0;i<50;i++)fpush(c,{x:l.x+(Math.random()-.5)*30,y:l.y-10-Math.random()*70,vx:(Math.random()-.5)*160,vy:-Math.random()*120,g:-20,t:1+Math.random(),s:4+Math.random()*5,c:i%2?'#cccccc':'#777777',bl:0})}
  }catch(e){F.t=1e3}};
const fd=F=>{try{if(!F||!F.o||!FC)return;const x=FC.x(),T=F.t,l=F.l;x.save();x.lineCap='round';x.lineJoin='round';
  F.act.forEach(a=>{if(a.a!=='r'||!a.pts)return;x.beginPath();a.pts.forEach((q,i)=>i?x.lineTo(q[0],q[1]):x.moveTo(q[0],q[1]));
    x.globalAlpha=.35;x.strokeStyle=a.e.cor;x.lineWidth=16;x.stroke();x.globalAlpha=.9;x.lineWidth=6;x.stroke();x.globalAlpha=1;x.strokeStyle='#ffffff';x.lineWidth=2.5;x.stroke()});
  F.sl.forEach(s=>{const tt=T-s.t0;if(tt<0||tt>.4)return;const a=s.e.angulo*Math.PI/180,cx=l.x,cy=l.y-45,u=Math.min(1,tt/.08),fa=1-tt/.4,c=Math.cos(a),n=Math.sin(a);
    x.beginPath();x.moveTo(cx-c*95,cy-n*95);x.lineTo(cx-c*95+c*190*u,cy-n*95+n*190*u);x.globalAlpha=fa;x.strokeStyle=s.e.cor;x.lineWidth=9*fa+2;x.stroke();x.strokeStyle='#ffffff';x.lineWidth=3*fa+1;x.stroke()});
  F.bt.forEach(b=>{const tt=T-b.t0,ix=Math.floor(tt/b.iv);if(tt<0||ix>=b.n)return;const ph=(tt-ix*b.iv)/b.iv,op=ph<.6?fes(ph/.6):ph<.72?1-fes((ph-.6)/.12):0,gap=4+op*34;
    x.save();x.translate(l.x,l.y-45);x.globalAlpha=1;x.fillStyle='#5a0016';x.fillRect(-40,-gap,80,gap*2);x.fillStyle='#f4f4f4';x.strokeStyle='#222222';x.lineWidth=3;
    [-1,1].forEach(s=>{x.beginPath();x.moveTo(-46,s*(gap+14));x.lineTo(46,s*(gap+14));x.lineTo(46,s*gap);for(let i=0;i<8;i++){x.lineTo(46-i*11.5-5.75,s*(gap-11));x.lineTo(46-(i+1)*11.5,s*gap)}x.closePath();x.fill();x.stroke()});x.restore()});
  x.restore()}catch(e){}};
const fo=F=>{try{const c=FC;if(!F||!F.o||!c)return;const x=c.x(),W=c.W(),H=c.H(),T=F.t;x.save();
  if(F.dk>.005){x.fillStyle=rgba(F.dkC,F.dk);x.fillRect(0,0,W,H)}
  if(F.cfl>.01){x.globalAlpha=Math.min(1,F.cfl);x.fillStyle=F.cflc;x.fillRect(0,0,W,H);x.globalAlpha=1}
  F.tx.forEach(q=>{const tt=T-q.t0;if(tt<0||tt>q.e.dur)return;const a=Math.min(1,tt*5,(q.e.dur-tt)*5),sc=1+.12*(1-Math.min(1,tt*4));x.save();x.globalAlpha=a;x.translate(W/2,H*.45);x.scale(sc,sc);x.textAlign='center';x.font='900 46px sans-serif';x.lineWidth=8;x.strokeStyle='rgba(0,0,0,.8)';x.strokeText(q.e.texto,0,0);x.fillStyle=q.e.cor;x.fillText(q.e.texto,0,0);x.restore()});
  if(window.BRCFT){x.font='bold 12px sans-serif';x.textAlign='center';x.lineWidth=3;x.strokeStyle='rgba(0,0,0,.8)';const s='🧪 Teste · '+F.o.nome+' · duração '+F.o.dur+' s · agora '+Math.min(T,F.o.dur).toFixed(1)+' s · sangue '+(c.fb()?'ligado':'desligado');x.strokeText(s,W/2,H-30);x.fillStyle='#99ffee';x.fillText(s,W/2,H-30)}
  x.restore()}catch(e){}};
const addX=it=>{const p=it.pkg,d=p.dados;it.draft=it===draft;if(p.tipo==='finalizacao'){const k=100+FO.length;FO.push({k,nome:p.nome,lb:(d.icone+' '+p.nome).replace(/[&<>"']/g,''),dur:d.duracao_s,dist:d.distancia,ev:d.eventos});it.fk=k;return}if(p.tipo==='som'){if(!it.buf&&!it.dec){it.dec=1;decSom(p).then(b=>{it.buf=b;applySnd()}).catch(()=>{it.bad=1})}return}if(p.tipo==='despertar'){AWI.push(it);return}if(p.tipo==='acessorio'){const n=FD.A.length;FD.A.push([d.icone,p.nome,{...d.atrib}]);FS.A[n]=d.sprite;AN[n]=d.ancora;it.ix=n}else{const n=FD.M.length,c=d.ceu;FD.M.push([d.icone,p.nome,c.cor1,c.cor2,d.chao.cor,d.plataforma_cor,TEMAS.indexOf(d.tema),d.plataformas.map(q=>[q.x,q.w,q.y])]);it.ix=n}};

/* ---------- interpretador: cada bloco reaproveita os auxiliares do jogo (shot2, hit, strike, hk...) ---------- */
let C=null;const H={},S={},PD={};
const tcols=r=>!r||r.tipo==='nenhum'?null:r.tipo==='gelo'?['#e8fbff','#6cc8ff']:r.tipo==='raio'?['#ffffff','#7ab8ff']:r.tipo==='fumaca'?['#d0d0d0','#555555']:[r.cor1,r.cor2];
const trail=(q,cc)=>{if(!cc)return;C.hk((dt,h)=>{h.t+=dt;return!C.PR.includes(q)},h=>{const x=C.cx(),sp=Math.hypot(q.vx,q.vy)||1,ux=q.vx/sp,uy=q.vy/sp;x.save();for(let n=0;n<8;n++){const u=(n*.125+h.t*3)%1,px=q.x-ux*u*46+Math.sin(n*7+h.t*20)*4,py=q.y-uy*u*46-u*16+Math.cos(n*5+h.t*17)*4;x.globalAlpha=(1-u)*.9;x.fillStyle=n%2?cc[0]:cc[1];x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=1;x.beginPath();x.arc(px,py,7*(1-u)+2,0,7);x.fill();x.stroke()}x.restore()})};
const emo=(x,em,px,py,sz,rot)=>{x.save();x.translate(px,py);if(rot)x.rotate(rot);x.font=sz+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(em,0,0);x.restore()};
const RUN={
 projetil(f,t,b,k){const base=f.ca||0,cc=tcols(b.rastro),F=FORMA[b.forma];for(let n=0;n<b.quantidade;n++){f.ca=base+(b.quantidade>1?(n-(b.quantidade-1)/2)*b.espalhamento*Math.PI/180:0);const o={d:(b.dano+(b.explode?b.explode.dano:0))*k,sp:b.vel,sz:F.sz,c:b.rastro.cor1,kb:200};if(F.em)o.em=F.em;if(F.ln)o.ln=F.ln;if(F.spn)o.spn=1;if(b.perfura)o.pi=1;if(b.explode)o.ex=b.explode.raio;trail(C.shot2(f,o),cc)}f.ca=base},
 onda(f,t,b,k){const q=C.shot2(f,{d:b.dano*k,sp:b.vel,pi:1,hw:b.largura/2,hv:80,sz:36,em:'🌊',c:b.cor,kb:b.empurrao,t:1.2});trail(q,[b.cor,'#ffffff'])},
 investida(f,t,b,k){C.dashAt(f,b.dano*k,.2,b.distancia/.2,{dur:.2,iv:b.invencivel_s});C.ring(f.x,f.y-40,40,'#fff')},
 chuva(f,t,b,k){const cc=tcols(b.rastro),F=FORMA[b.forma]||FORMA.orbe,em=F.em||'🔮',c=b.rastro.cor1;for(let n=0;n<b.quantidade;n++){const dl=n*(b.duracao_s/b.quantidade)+.05,px=C.clampX(t.x+(Math.random()-.5)*b.area*(n%2?1:.25));C.after(dl,()=>{if(f.dead)return;const T=.55;C.hk((dt,h)=>{h.t+=dt;return h.t>=T},h=>{const x=C.cx(),u=h.t/T,y=-60+(C.GY+40)*u;if(cc){x.save();for(let j=0;j<5;j++){x.globalAlpha=.8*(1-j/5);x.fillStyle=j%2?cc[0]:cc[1];x.beginPath();x.arc(px+Math.sin(j*3+h.t*30)*5,y-j*11,6-j,0,7);x.fill()}x.restore()}emo(x,em,px,y,34,h.t*6)});
 C.strike(px,C.GY,32,T,()=>{C.ring(px,C.GY-20,44,c);C.shake(1.5);if(Math.abs(t.x-px)<40&&t.y>=C.GY-70)C.hit(f,t,b.dano*k,.15,160,C.sdir({x:px},t))},c)})}},
 orbita(f,t,b,k){const a0=Math.random()*6.28,cc=tcols(b.rastro),F=FORMA[b.forma]||FORMA.orbe,em=F.em||'🔮',alive=Array.from({length:b.quantidade},()=>1),d=b.dano*k;C.hk((dt,h)=>{h.t+=dt;if(f.dead)return 1;for(let n=0;n<b.quantidade;n++){if(!alive[n])continue;const a=a0+h.t*b.vel+6.283*n/b.quantidade,ox=f.x+Math.cos(a)*b.raio,oy=f.y-45+Math.sin(a)*b.raio*.55;if(Math.abs(ox-t.x)<28&&Math.abs(oy-(t.y-45))<46){alive[n]=0;C.ring(ox,oy,38,b.rastro.cor1);C.hit(f,t,d,.15,160,C.sdir(f,t))}}
   if(h.t>=b.duracao_s){if(b.explode_no_fim)for(let n=0;n<b.quantidade;n++){if(!alive[n])continue;const a=a0+h.t*b.vel+6.283*n/b.quantidade,ox=f.x+Math.cos(a)*b.raio,oy=f.y-45+Math.sin(a)*b.raio*.55;C.ring(ox,oy,60,b.rastro.cor1);if(Math.abs(ox-t.x)<64&&Math.abs(oy-(t.y-45))<80)C.hit(f,t,d,.15,200,C.sdir(f,t))}C.shake(b.explode_no_fim?2:0);return 1}},
  h=>{const x=C.cx();x.save();for(let n=0;n<b.quantidade;n++){if(!alive[n])continue;const a=a0+h.t*b.vel+6.283*n/b.quantidade,ox=f.x+Math.cos(a)*b.raio,oy=f.y-45+Math.sin(a)*b.raio*.55;if(cc)for(let j=1;j<6;j++){const a2=a-j*.12,px=f.x+Math.cos(a2)*b.raio,py=f.y-45+Math.sin(a2)*b.raio*.55;x.globalAlpha=.7*(1-j/6);x.fillStyle=j%2?cc[0]:cc[1];x.beginPath();x.arc(px,py-j*2,7-j,0,7);x.fill()}x.globalAlpha=1;emo(x,em,ox,oy,30,h.t*5)}x.restore()})},
 aura(f,t,b,k){let tk=0;C.hk((dt,h)=>{h.t+=dt;if(f.dead)return 1;tk+=dt;if(tk>=.3){tk=0;if(C.nr(f,t,b.raio))C.hit(f,t,b.dano_por_s*.3*k,0,0,C.sdir(f,t))}return h.t>=b.duracao_s},h=>{const x=C.cx();x.save();x.globalAlpha=.18+.08*Math.sin(h.t*12);x.fillStyle=b.cor;x.beginPath();x.ellipse(f.x,f.y-4,b.raio,b.raio*.3,0,0,7);x.fill();x.globalAlpha=.8;x.strokeStyle=b.cor;x.lineWidth=3;x.stroke();for(let n=0;n<10;n++){const u=(n*.1+h.t*1.5)%1,a=n*.63+h.t;x.globalAlpha=(1-u)*.8;x.fillStyle=n%2?b.cor:'#fff';x.beginPath();x.arc(f.x+Math.cos(a)*b.raio*(.4+.6*((n*37)%10)/10),f.y-u*70,5*(1-u)+1.5,0,7);x.fill()}x.restore()})},
 invocar(f,t,b,k){const gx=f.x-f.face*45,gy=f.y,em={cao:'🐕',caveira:'💀',espirito:'👻'}[b.tipo];C.hk((dt,h)=>{h.t+=dt;h.k=(h.k||0)+dt;if(h.k>=1&&!f.dead){h.k=0;const sx=t.x>=gx?1:-1;C.PR.push({o:f,x:gx+sx*20,y:gy-44,x0:gx,by:gy-44,vx:sx*600,vy:0,d:b.dano*k,st:0,sl:0,t:1.3,dir:sx,a:0,sz:5,ln:16,c:'#ffd54a',kb:100})}return h.t>=b.duracao_s},h=>{const x=C.cx();emo(x,em,gx,gy-28+Math.sin(h.t*5)*4,36)})},
 status(f,t,b,k){const e=b.efeito;
   if(e==='cura'){f.hp=Math.min(f.mx,f.hp+b.valor);C.ring(f.x,f.y-40,60,'#8f8');return}
   if(e==='escudo'){f.sh=b.valor;f.shT=b.duracao_s;C.ring(f.x,f.y-40,60,'#9df');C.txt(f,'ESCUDO','#9df');return}
   if(e==='velocidade'){f.bf=b.duracao_s;f.bfv=b.valor/100;C.ring(f.x,f.y-40,60,'#fd6');C.txt(f,'VELOZ','#fd6');return}
   if(!C.nr(f,t,b.alcance))return;
   if(e==='queimar')C.dotE(f,t,'🔥',b.valor*k,b.duracao_s);else if(e==='congelar'){t.stun=Math.max(t.stun,b.duracao_s);t.ice=Math.max(t.ice||0,.01);C.txt(t,'CONGELADO','#9df')}else if(e==='lentidao'){t.slow=Math.max(t.slow,b.duracao_s);C.txt(t,'LENTO','#9df')}else{t.sil=b.duracao_s;C.txt(t,'SILENCIADO','#f9f')}},
 teleporte(f,t,b,k){const a=f.x,c=C.clampX(a+f.face*b.distancia);if(b.dano&&(t.x-a)*f.face>-20&&(t.x-c)*f.face<20&&Math.abs(t.y-f.y)<80)C.hit(f,t,b.dano*k,.3,200,f.face);f.x=c;f.iv=.3;C.ring(a,f.y-40,40,'#c9f');C.ring(c,f.y-40,40,'#c9f')},
 terremoto(f,t,b,k){C.ring(f.x,f.y-10,b.raio,'#c8a070');C.shake(4);if(C.nr(f,t,b.raio)&&t.gr)C.hit(f,t,b.dano*k,b.atordoar,300,C.sdir(f,t))},
 atrai(f,t,b){if(Math.abs(t.x-f.x)<b.alcance+60){t.vx=-C.sdir(f,t)*650;t.stun=Math.max(t.stun,.25)}C.ring(f.x,f.y-40,b.alcance,'#a6f')},
 repele(f,t,b,k){C.ring(f.x,f.y-40,b.alcance,'#6cf');if(C.nr(f,t,b.alcance)){if(b.dano)C.hit(f,t,b.dano*k,.2,700,C.sdir(f,t));else{t.vx=C.sdir(f,t)*800;t.vy=-200;t.gr=false}}},
 cura(f,t,b){f.hp=Math.min(f.mx,f.hp+b.valor);C.ring(f.x,f.y-40,60,'#8f8')},
 escudo(f,t,b){f.sh=b.valor;f.shT=b.duracao_s;C.ring(f.x,f.y-40,60,'#9df');C.txt(f,'ESCUDO','#9df')},
 visual(f,t,b){if(b.flash)C.ring(f.x,f.y-40,140,b.cor);if(b.tremor_tela)C.shake(b.tremor_tela)},
 som(){}};
const mkH=(p,base)=>(f,t,d)=>{if(!C)return;const k=base>0?d/base:1;p.blocos.forEach(b=>{try{(RUN[b.b]||(()=>{}))(f,t,b,k)}catch(e){console.warn('brc',b.b,e)}})};
const kindOf=p=>{const b=p.blocos[0]||{};return{projetil:['P',b.vel],onda:['P',b.vel],chuva:['P',0],orbita:['A',b.raio],aura:['A',b.raio],terremoto:['A',b.raio],investida:['D',0],teleporte:['D',0],invocar:['A',160],atrai:['A',b.alcance],repele:['A',b.alcance],cura:['H',0],escudo:['S',b.duracao_s],visual:['A',100],status:b.efeito==='cura'?['H',0]:b.efeito==='escudo'?['S',b.duracao_s]:b.efeito==='velocidade'?['B',b.duracao_s]:['A',b.alcance]}[b.b]||['A',100]};
const lab=b=>({projetil:'Projétil',onda:'Onda',investida:'Investida',chuva:'Chuva',orbita:'Órbita',aura:'Aura',invocar:'Invocação',status:b.efeito,teleporte:'Teleporte',terremoto:'Terremoto',atrai:'Atrai',repele:'Repele',cura:'Cura',escudo:'Escudo',visual:'',som:''}[b.b]||'');

/* ---------- instalação nas listas do jogo (as 20 armas embutidas nunca são tocadas) ---------- */
let items=[],draft=null,bad=0;const TST=new Set();
const save=()=>{const d=JSON.stringify({v:1,items:items.map(i=>i.pkg)});try{localStorage.setItem(KEY,d);return 1}catch(e){}try{localStorage.removeItem('brc_libcache');localStorage.setItem(KEY,d);return 1}catch(e){return 0}};
const SCAP=5000000,SLB={brc_lib:'criações',brc_libcache:'cache da biblioteca'};
const space=()=>{let t=0,p={};try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i),n=k.length+(localStorage.getItem(k)||'').length;t+=n;p[k]=n}}catch(e){}return{used:t,cap:SCAP,pct:Math.min(100,Math.round(t*100/SCAP)),lib:p.brc_lib||0,cache:p.brc_libcache||0}};
const spaceHtml=cl=>{const q=space(),w=q.pct>=80,c=q.pct>=95?'#ff7a7a':w?'#ffd54a':'#7dffa0',f=n=>n<1e6?(n/1024).toFixed(0)+' KB':(n/1048576).toFixed(2)+' MB';
  return'<div class="sec"><div class="lb">Espaço no aparelho (estimado)</div><div style="height:8px;border-radius:5px;background:#fff2;overflow:hidden"><div style="height:100%;width:'+Math.min(100,q.pct)+'%;background:'+c+'"></div></div><small>'+q.pct+'% de ~5 MB usados · criações '+f(q.lib)+' · cache da biblioteca '+f(q.cache)+'</small>'
  +(w?'<small style="color:'+c+'">'+(q.pct>=95?'Armazenamento quase cheio: novas criações podem não caber. ':'Armazenamento acima de 80%. ')+'Apague criações que não usa (Minhas criações'+(cl?'':' ou aba Instaladas')+')'+(q.cache>0?' ou limpe o cache da biblioteca.':'.')+'</small>':'')
  +(cl&&q.cache>0?'<div class="chips"><button class="c" data-a="brcclr">🧹 Limpar cache da biblioteca</button></div>':'')+'</div>'};
const loadAll=()=>{items=[];bad=0;try{const j=JSON.parse(localStorage.getItem(KEY)||'null');((j&&j.items)||[]).forEach(p=>{const r=validate(p);if(r.ok)items.push({pkg:r.pkg,tam:r.tam});else bad++})}catch(e){}};
const AWI=[],AWU={};let AWR=null;let AWC={};try{AWC=JSON.parse(localStorage.getItem('brc_awc')||'{}')||{}}catch(e){}Object.keys(AWC).forEach(k=>{if(AWC[k]&&!Array.isArray(AWC[k]))AWC[k]=[AWC[k]];if(!AWC[k]||!AWC[k].length)delete AWC[k]});const cnm=l=>(l||[]).map(x=>x.nome).join(', ');
const awSave=()=>{try{localStorage.setItem('brc_awc',JSON.stringify(AWC))}catch(e){}};
const awt=s=>String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').split(/[^a-z0-9]+/).filter(Boolean);
const awInj=()=>{if(!AWR)return;Object.keys(AWR).forEach(k=>{if(AWR[k]&&AWR[k].x)delete AWR[k]});Object.keys(AWU).forEach(k=>delete AWU[k]);
  AWI.forEach(it=>{const d=it.pkg.dados,k=it.pkg.id,pf=d.poder_final,bud=Math.max(1,Math.round(pf.blocos.reduce((s,b)=>s+orc(b),0)*10)/10),h=mkH(pf,bud);
    AWR[k]={x:1,p:d.bonus_poder,u:0,n:pf.nome,ic:pf.icone,d:'PODER FINAL · '+(pf.blocos.map(lab).filter(Boolean).join(' + ')||'Efeito'),c:d.cores,hold:pf.lancar?1:0,ht:pf.espera||3,sn:'flavio',at:d.atrib,t:awt(d.candidato),dr:it.draft?1:0};AWU[k]=(f,tg)=>h(f,tg,bud)})};
const awKind=c=>{if(!c)return'';if(window.BRCAWT&&c.nome==='Treino'&&!c.id)return window.BRCAWT;const t=new Set(awt(c.nome)),cn=awt(c.nome).join(' ');let r='';AWI.forEach(it=>{if(it.draft)return;const bl=AWC[it.pkg.id];if(bl&&bl.length){if(bl.some(b=>(c.id&&String(c.id)===String(b.id))||awt(b.nome).join(' ')===cn))r=it.pkg.id;return}const w=awt(it.pkg.dados.candidato);if(w.length&&w.every(x=>t.has(x)))r=it.pkg.id});return r};
const awb=(f,on)=>{const A=AWR&&AWR[f.aw];if(!A||!A.at)return;if(on&&!f.ab){f.ab=1;for(const k in A.at)f.s[k]=+((f.s[k]||0)+A.at[k]).toFixed(4)}else if(!on&&f.ab){f.ab=0;for(const k in A.at)f.s[k]=+((f.s[k]||0)-A.at[k]).toFixed(4)}};
const sync=()=>{
  AWI.length=0;FO.length=0;FD.A.length=OA;FS.A.length=OA;FD.M.length=OM;for(const k in AN)delete AN[k];FD.W.length=O0;FS.W.length=O0;FS.gr.length=O0;FS.ori.length=O0;if(FS.clr)FS.clr();const T=window.SFX&&SFX.tab;if(T){T.SW.length=20;T.HF.length=20}
  [...items,...(draft?[draft]:[])].forEach(it=>{if(it.pkg.tipo!=='arma'){addX(it);return}const d=it.pkg.dados,n=FD.W.length,id=it.pkg.id;
    const ps=d.poderes.map((p,i)=>{const[k,e]=kindOf(p),pid=id+'_'+i,bud=Math.max(1,Math.round(p.blocos.reduce((s,b)=>s+orc(b),0)*10)/10),sd=p.blocos.find(b=>b.b==='som');H[pid]=mkH(p,bud);if(sd)S[pid]=sd.id.slice(3);PD[pid]=(p.blocos.map(lab).filter(Boolean).join(' + ')||'Efeito')+' · dano total {d}';FD.PD[pid]=PD[pid];
      return[p.nome,k,bud,p.recarga,Math.round(e||0),0,pid]});
    FD.W.push([d.poderes[0].icone,it.pkg.nome,d.atrib.dano/100,...ps]);FS.W[n]=d.sprite;FS.gr[n]=[32,48];FS.ori[n]='u';
    if(T){T.SW[n]=T.SW[SWM[d.swing]];T.HF[n]=d.familia_impacto}it.wi=n;it.draft=it===draft});
  awInj();applySnd();if(FIXF)FIXF()};
loadAll();sync();

/* ---------- telas (reaproveitam o shell e as classes do jogo) ---------- */
let api=null,msg='',msgc='',tfb=0,tfw=1;const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kb=n=>n<1024?n+' B':(n/1024).toFixed(1)+' KB';
const inp='width:100%;padding:8px;border-radius:8px;border:1px solid #fff4;background:#0006;color:#fff;font-size:13px;box-sizing:border-box';
const TN={arma:'arma',acessorio:'acessório',mapa:'mapa',som:'som',finalizacao:'finalização',despertar:'despertar'},spr=it=>{const t=it.pkg.tipo,bx='width:42px;height:42px;flex:none;border-radius:8px;background:#0004';if(it.pkg.foto)return'<img src="'+it.pkg.foto+'" style="'+bx+';object-fit:cover">';return t==='mapa'||t==='som'||t==='finalizacao'||t==='despertar'?'<span style="'+bx+';display:flex;align-items:center;justify-content:center;font-size:26px">'+(t==='som'?'🔊':E(it.pkg.dados.icone))+'</span>':'<img src="'+FS.url(t==='arma'?'w':'a',t==='arma'?it.wi:it.ix)+'" style="'+bx+'">'};
const bn=it=>{const b=it===draft?draft.cand:AWC[it.pkg.id];return b&&b.length?cnm(b):(it.pkg.dados.candidato||'(escolha em 👤)')};
const card=(it,key,drf)=>'<div class="pc" style="gap:8px">'+spr(it)+'<span style="flex:1;min-width:0"><b>'+E(it.pkg.nome)+'</b><br><small>'+E(it.pkg.autor||'anônimo')+' · '+kb(it.tam)+' · '+TN[it.pkg.tipo]+(drf?' · não salva':'')+'</small>'+(it.pkg.tipo==='acessorio'?'<br><small style="color:#9fe">'+E(FD.desc(it.pkg.dados.atrib))+'</small>':it.pkg.tipo==='mapa'?'<br><small style="color:#9fe">'+it.pkg.dados.plataformas.length+' plataforma(s)</small>':it.pkg.tipo==='som'?'<br><small style="color:#9fe">Evento: '+E(EVT[it.pkg.dados.evento])+(it.buf?' · '+it.buf.duration.toFixed(2)+' s':'')+'</small>':it.pkg.tipo==='finalizacao'?'<br><small style="color:#9fe">'+it.pkg.dados.duracao_s+' s · '+it.pkg.dados.eventos.length+' evento(s)</small>':it.pkg.tipo==='despertar'?'<br><small style="color:#9fe">Candidato: '+E(bn(it))+' · 4º poder: '+E(it.pkg.dados.poder_final.nome)+(Object.keys(it.pkg.dados.atrib).length?' · '+E(FD.desc(it.pkg.dados.atrib)):'')+'</small>':'')+'</span><button class="c" data-a="brctest" data-v="'+key+'">🧪 Testar</button>'+(it.pkg.tipo==='despertar'?'<button class="c" data-a="brcpk" data-v="'+key+'">👤</button>':'')+'<button class="c" data-a="brcfoto" data-v="'+key+'">🖼</button><button class="c" data-a="brcexp" data-v="'+key+'">📤</button><button class="c" data-a="brcusend" data-v="'+key+'">📚</button>'+(drf?'':'<button class="c" data-a="brcdel" data-v="'+key+'">🗑</button>')+'</div>';
const ftg=()=>items.some(i=>i.pkg.tipo==='finalizacao')||(draft&&draft.pkg.tipo==='finalizacao')?'<div class="sec"><div class="lb">Teste de finalização</div><div class="chips"><button class="c'+(tfb?' on':'')+'" data-a="brcxsangue">🩸 Sangue: '+(tfb?'ligado':'desligado')+'</button><button class="c" data-a="brcxvit">'+(tfw?'🏆 Você vence':'💀 Você perde')+'</button></div></div>':'';
const screen=()=>{if(!api)return;const dr=draft?'<div class="sec"><div class="lb">Criação importada (rascunho)</div>'+card(draft,'d',1)+'<input id="brcnm" style="'+inp+'" maxlength="24" value="'+E(draft.pkg.nome)+'" placeholder="Nome"><input id="brcau" style="'+inp+'" maxlength="20" value="'+E(draft.pkg.autor)+'" placeholder="Autor (apelido)">'+(draft.pkg.tipo==='despertar'?'<div class="pc" style="gap:8px"><span style="flex:1"><b>'+(draft.cand&&draft.cand.length?'👤 '+E(cnm(draft.cand)):(draft.pkg.dados.candidato?'👤 '+E(draft.pkg.dados.candidato):'👤 Nenhum candidato escolhido'))+'</b><br><small>'+(draft.cand&&draft.cand.length?'Vale sempre que um deles lutar.':(draft.pkg.dados.candidato?'Do arquivo: vale para "'+E(draft.pkg.dados.candidato)+'" (ou escolha outro na lista).':'Escolha entre os candidatos do TSE.'))+'</small></span><button class="c" data-a="brcpk" data-v="d">Escolher candidatos</button></div>':'')+(draft.n&&draft.n.length?'<small style="color:#ffd54a">'+draft.n.map(E).join('<br>')+'</small>':'')+'<div class="chips"><button class="c" data-a="brcsave">💾 Salvar só para mim</button><button class="c" data-a="brcusend" data-v="d">📚 Enviar para a biblioteca</button><button class="c" data-a="brcdrop">✖ Descartar</button></div></div>':'';
  api.shell('<div class="top"><button class="c" data-a="menu">← Menu</button><b>🧩 Minhas criações</b></div><div class="body"><div class="col" style="flex:1;overflow:auto">'
  +'<div class="sec"><div class="lb">Importar criação</div><div class="chips"><button class="c on">⚔️ Arma</button><button class="c on">🎩 Acessório</button><button class="c on">🗺️ Mapa</button><button class="c on">🔊 Som</button><button class="c on">💥 Finalização</button><button class="c on">✨ Despertar</button></div>'
  +'<label class="c" style="display:block;text-align:center;padding:10px;cursor:pointer">📁 Escolher arquivo .json<input type="file" data-a="brcfile" accept=".json,application/json,text/plain" style="display:none"></label>'
  +'<textarea id="brctxt" rows="3" style="'+inp+';resize:none" placeholder="Ou cole aqui o texto da criação"></textarea><button class="c" data-a="brcpaste">✔ Validar texto</button><small id="brcmsg" style="color:'+(msgc||'#ffd54a')+'">'+E(msg)+'</small></div>'
  +ftg()+dr+spaceHtml(1)+'<div class="sec"><div class="lb">Salvas neste aparelho ('+items.length+')</div>'+(items.length?items.map((it,i)=>card(it,i)).join(''):'<small style="opacity:.7">Nenhuma ainda.</small>')+(bad?'<small style="color:#ff7a7a">'+bad+' criação(ões) salva(s) ficaram desativadas (inválidas).</small>':'')+'</div></div></div>')};
const say=(m,c)=>{msg=m;msgc=c||'';const e=api&&api.root()&&api.root().querySelector('#brcmsg');if(e){e.textContent=m;e.style.color=c||'#ffd54a'}};
const take=async text=>{const r=validate(text);if(!r.ok){msg='Não foi possível importar: '+r.e.join('; ');msgc='#ff7a7a';screen();return}
  if(r.pkg.tipo==='som'){try{r.buf=await decSom(r.pkg)}catch(e){msg='Não consegui decodificar este áudio neste aparelho.';msgc='#ff7a7a';screen();return}if(r.buf.duration>3.05){msg='Som longo demais ('+r.buf.duration.toFixed(1)+' s; máx. 3 s).';msgc='#ff7a7a';screen();return}}
  draft=null;sync();draft={pkg:r.pkg,tam:r.tam,n:r.n,buf:r.buf};sync();if(!draft.pkg.foto){try{const u=await genFoto(draft);if(u){draft.pkg.foto=u;draft.tam=JSON.stringify(draft.pkg).length}}catch(e){}}msg='Criação válida! Teste antes de salvar.'+(r.n.length?' ('+r.n.length+' ajuste(s) automático(s))':'');msgc='#7dffa0';screen()};
const find=v=>v==='d'?draft:items[+v];
const exportIt=it=>{const b=it===draft?draft.cand:AWC[it.pkg.id],pk0=it.pkg.tipo==='despertar'&&b&&b.length?Object.assign({},it.pkg,{dados:Object.assign({},it.pkg.dados,{candidato:b[0].nome})}):it.pkg;const s=JSON.stringify(pk0,null,1);let ok=0;try{const b=new Blob([s],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=(it.pkg.nome||'criacao').replace(/[^\w-]+/g,'_')+'.json';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500);ok=1}catch(e){}
  try{navigator.clipboard&&navigator.clipboard.writeText(s).then(()=>say('Texto da criação copiado.','#7dffa0'),()=>{})}catch(e){}
  const t=api.root().querySelector('#brctxt');if(t)t.value=s;say(ok?'Arquivo .json gerado (e texto copiado, se permitido).':'Texto da criação aparece na caixa acima — copie.','#7dffa0')};
/* ---------- foto ilustrativa 256x256 (webp até 40 KB): gerar do sprite, desenhar, ou da galeria ---------- */
const FW=256,mkCv=s=>{const c=document.createElement('canvas');c.width=c.height=s||FW;return c};
/* ---------- escolher candidato (despertar) entre os candidatos do TSE ---------- */
let pk=null;
const pkFlt=()=>{const q=awt(pk.q).join(' ');return(pk.list||[]).map((c,i)=>[c,i]).filter(([c])=>!q||awt(c.nome).join(' ').includes(q)||awt(c.partido).join(' ').includes(q)||String(c.num||'').startsWith(q))};
const pkCur=()=>{const it=pk&&find(pk.v);return it?((it===draft?draft.cand:AWC[it.pkg.id])||[]):[]};const pkHas=c=>pkCur().some(x=>String(x.id)===String(c.id));const pkN=()=>{const e=api&&api.root().querySelector('#brcpn');if(e)e.textContent=pkCur().length?pkCur().length+' escolhido(s): '+cnm(pkCur()):'toque para escolher (vários, se quiser)'};const pkList=()=>{const e=api&&api.root().querySelector('#brcpl');if(!e||!pk)return;if(pk.err){e.innerHTML='<p>'+E(pk.err)+'</p><button class="c" data-a="brcpcg" data-v="'+pk.cg+'">↻ Tentar de novo</button>';return}if(!pk.list){e.innerHTML='<p style="opacity:.8">Carregando candidatos…</p>';return}const f=pkFlt();e.innerHTML=f.slice(0,60).map(([c,i])=>'<button class="it" data-a="brcpick" data-v="'+i+'"'+(pkHas(c)?' style="outline:2px solid #7dffa0"':'')+'>'+(c.foto?'<img src="'+E(c.foto)+'" loading="lazy" style="width:42px;height:42px;border-radius:50%;object-fit:cover;flex:none">':'')+'<span><b>'+(pkHas(c)?'✔ ':'')+E(c.nome)+'</b><small>'+E(c.partido||'')+(c.num?' · '+E(c.num):'')+'</small></span></button>').join('')||'<p style="opacity:.8">Nenhum candidato encontrado.</p>';if(f.length>60)e.innerHTML+='<p style="opacity:.7;grid-column:1/-1">Mostrando 60 de '+f.length+'. Digite para filtrar.</p>'};
const pkShow=()=>{const cg=api.cargos,uf=api.ufs;api.shell('<div class="top"><button class="c" data-a="brcpback">✔ Concluir</button><b>👤 Candidatos</b><small id="brcpn" style="flex:1;min-width:0;opacity:.85"></small></div><div class="body"><div class="col" style="flex:1;overflow:auto"><div class="chips">'+Object.keys(cg).map(k=>'<button class="c'+(pk.cg===k?' on':'')+'" data-a="brcpcg" data-v="'+k+'">'+E(cg[k])+'</button>').join('')+'</div>'+(pk.cg!=='presidente'?'<select data-a="brcpuf" style="'+inp+'">'+Object.entries(uf).map(([u,n])=>'<option value="'+u+'"'+(u===pk.uf?' selected':'')+'>'+u.toUpperCase()+' · '+E(n)+'</option>').join('')+'</select>':'')+'<input id="brcpq" style="'+inp+'" placeholder="🔍 Pesquisar nome, partido ou número" value="'+E(pk.q)+'" autocomplete="off"><div id="brcpl" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px"></div></div></div>');const q=api.root().querySelector('#brcpq');q.addEventListener('input',()=>{pk.q=q.value;pkList()});pkList();pkN()};
const pkLoad=()=>{const s=pk;s.list=null;s.err='';pkShow();api.cands(s.cg,s.uf).then(l=>{if(pk!==s)return;s.list=l||[];pkList()}).catch(e=>{if(pk!==s)return;s.err='Não consegui carregar os candidatos ('+((e&&e.message)||'sem conexão')+').';pkList()})};
const pkOpen=v=>{const it=find(v);if(!it||!api||!api.cands)return;const c=api.cur();pk={v,cg:c.cg,uf:c.uf,q:v==='d'?(it.pkg.dados.candidato||''):'',list:null,err:''};pkLoad()};
const loadImg=src=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error('img'));i.src=src});
const bgG=(x,a,b)=>{const g=x.createLinearGradient(0,0,0,FW);g.addColorStop(0,a);g.addColorStop(1,b);x.fillStyle=g;x.fillRect(0,0,FW,FW)};
const drawFoto=async(c,it)=>{const x=c.getContext('2d'),p=it.pkg,d=p.dados;x.clearRect(0,0,FW,FW);
  if(p.tipo==='mapa'){bgG(x,d.ceu.cor1,d.ceu.cor2);x.fillStyle=d.chao.cor;x.fillRect(0,380/450*FW,FW,FW);x.fillStyle=d.plataforma_cor;d.plataformas.forEach(q=>{const w=q.w*1.3/1600*FW*1.6,cx=(q.x+q.w/2)/800*FW;x.fillRect(cx-w/2,q.y/450*FW,w,7)});x.font='64px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(d.icone,FW/2,FW*.4)}
  else if(p.tipo==='despertar'){bgG(x,'#05000a',d.cores[2]);const g=x.createRadialGradient(FW/2,FW*.45,10,FW/2,FW*.45,FW*.5);g.addColorStop(0,d.cores[0]);g.addColorStop(.5,d.cores[1]+'99');g.addColorStop(1,d.cores[2]+'00');x.fillStyle=g;x.fillRect(0,0,FW,FW);x.font='110px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(d.icone,FW/2,FW*.45);x.font='bold 18px sans-serif';x.fillStyle='#fff';x.fillText(d.poder_final.nome,FW/2,FW*.85)}
  else if(p.tipo==='finalizacao'){bgG(x,'#3a0a0a','#05000a');x.font='120px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(d.icone,FW/2,FW*.42);x.font='bold 18px sans-serif';x.fillStyle='#ffb3a0';x.fillText(d.duracao_s+' s · '+d.eventos.length+' eventos',FW/2,FW*.85)}
  else if(p.tipo==='som'){bgG(x,'#0b0f1a','#1a2a5a');x.font='120px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('🔊',FW/2,FW*.45);x.font='bold 18px sans-serif';x.fillStyle='#9fe';x.fillText(EVT[d.evento],FW/2,FW*.85)}
  else{bgG(x,'#1a2a5a','#0b0f1a');const im=await loadImg(FS.url(p.tipo==='arma'?'w':'a',p.tipo==='arma'?it.wi:it.ix));x.drawImage(im,28,28,200,200)}};
const encode=c=>{const tr=cc=>{for(const k of[.85,.7,.55,.4,.3]){const u=cc.toDataURL('image/webp',k);if(Math.floor((u.length-u.indexOf(',')-1)*3/4)<=40960)return u}return''};let o=tr(c);if(o)return o;for(const s of[192,128]){const t=mkCv(s);t.getContext('2d').drawImage(c,0,0,s,s);o=tr(t);if(o)return o}return''};
const genFoto=async it=>{const c=mkCv();await drawFoto(c,it);return encode(c)};
const PAL=['#ffffff','#000000','#ff3b3b','#ff9a2a','#ffd54a','#3fd070','#2ab4ff','#a05aff'],SZS=[3,7,14];
let fe={v:null,col:'#ffffff',sz:7,er:0};
const fshow=()=>{const it=find(fe.v);if(!it||!api)return screen();
  api.shell('<div class="top"><button class="c" data-a="brcfback">← Voltar</button><b>🖼️ Foto: '+E(it.pkg.nome)+'</b></div><div class="body"><div class="col" style="flex:1;overflow:auto"><div style="display:flex;gap:14px;flex-wrap:wrap;justify-content:center;align-items:flex-start">'
  +'<canvas id="brcfc" width="256" height="256" style="width:min(62vh,256px);aspect-ratio:1;touch-action:none;border-radius:12px;border:2px solid #fff4;background:repeating-conic-gradient(#333 0 25%,#444 0 50%) 0 0/20px 20px"></canvas>'
  +'<div style="display:flex;flex-direction:column;gap:8px;min-width:190px"><div class="chips">'+PAL.map(c=>'<button class="c'+(c===fe.col&&!fe.er?' on':'')+'" data-a="brcfc" data-v="'+c+'" style="background:'+c+';width:34px;height:34px;padding:0"></button>').join('')+'</div>'
  +'<div class="chips">'+SZS.map(n=>'<button class="c'+(n===fe.sz?' on':'')+'" data-a="brcfs" data-v="'+n+'">'+(n<5?'●':n<10?'⬤':'⬤⬤')+'</button>').join('')+'<button class="c'+(fe.er?' on':'')+'" data-a="brcfe">🧽 Borracha</button><button class="c" data-a="brcfclr">🗑 Limpar</button></div>'
  +'<button class="c" data-a="brcfspr">🎨 Gerar do sprite</button><label class="c" style="display:block;text-align:center;cursor:pointer">🖼️ Escolher da galeria<input type="file" data-a="brcfimg" accept="image/*" style="display:none"></label>'
  +'<button class="c on" data-a="brcfok">✔ Usar esta foto</button><small id="brcfmsg" style="color:#ffd54a">Desenhe com o dedo. Vira 256×256, até 40 KB.</small></div></div></div></div>');
  const c=api.root().querySelector('#brcfc'),x=c.getContext('2d');let dn=0,lx=0,ly=0;
  (it.pkg.foto?loadImg(it.pkg.foto).then(i=>x.drawImage(i,0,0,FW,FW)):drawFoto(c,it)).catch(()=>{});
  const pt=e=>[e.offsetX*FW/c.clientWidth,e.offsetY*FW/c.clientHeight],ln=(a,b,u,v)=>{x.save();x.globalCompositeOperation=fe.er?'destination-out':'source-over';x.strokeStyle=x.fillStyle=fe.col;x.lineWidth=fe.sz*(fe.er?1.8:1);x.lineCap=x.lineJoin='round';x.beginPath();x.moveTo(a,b);x.lineTo(u,v);x.stroke();x.restore()};
  c.onpointerdown=e=>{e.preventDefault();dn=1;try{c.setPointerCapture(e.pointerId)}catch(_){}[lx,ly]=pt(e);ln(lx,ly,lx+.01,ly)};
  c.onpointermove=e=>{if(!dn)return;e.preventDefault();const[a,b]=pt(e);ln(lx,ly,a,b);lx=a;ly=b};
  c.onpointerup=c.onpointercancel=()=>{dn=0}};
const fmsg=(m,c)=>{const e=api&&api.root()&&api.root().querySelector('#brcfmsg');if(e){e.textContent=m;e.style.color=c||'#ffd54a'}};
const fclick=(a,t)=>{const root=api.root(),c=root&&root.querySelector('#brcfc'),on=sel=>root.querySelectorAll(sel).forEach(b=>b.classList.remove('on'));
  ({brcfback:screen,
   brcfc:()=>{fe.col=t.dataset.v;fe.er=0;on('[data-a="brcfc"],[data-a="brcfe"]');t.classList.add('on')},
   brcfs:()=>{fe.sz=+t.dataset.v;on('[data-a="brcfs"]');t.classList.add('on')},
   brcfe:()=>{fe.er=fe.er?0:1;on('[data-a="brcfc"]');t.classList.toggle('on',!!fe.er)},
   brcfclr:()=>{c&&c.getContext('2d').clearRect(0,0,FW,FW)},
   brcfspr:()=>{const it=find(fe.v);it&&c&&drawFoto(c,it).catch(()=>fmsg('Não consegui gerar do sprite.','#ff7a7a'))},
   brcfok:()=>{const it=find(fe.v);if(!it||!c)return;const u=encode(c);if(!u)return fmsg('Não coube em 40 KB. Use menos detalhes.','#ff7a7a');it.pkg.foto=u;it.tam=JSON.stringify(it.pkg).length;if(fe.v!=='d')save();msg='Foto atualizada ('+(Math.round((u.length-u.indexOf(',')-1)*3/4/102.4)/10)+' KB).';msgc='#7dffa0';screen()}}[a]||(()=>{}))()};
const click=(a,t)=>{if(/^brc[lu]/.test(a)&&window.BRCL)return BRCL.click(a,t);if(/^brcf(?!oto)/.test(a))return fclick(a,t);const v=t.dataset.v;
  ({brc:screen,
   brcfoto:()=>{fe.v=v;fshow()},
   brcpk:()=>pkOpen(v),
   brcpback:()=>{const bk=pk&&pk.back;pk=null;bk?bk():screen()},
   brcpcg:()=>{if(!pk)return;pk.cg=v;pk.list=null;pkLoad()},
   brcpick:()=>{if(!pk)return;const c=(pk.list||[])[+v],it=find(pk.v);if(!c||!it)return;const nb={id:c.id,nome:String(c.nome||'').slice(0,60)};let l=(it===draft?draft.cand:AWC[it.pkg.id])||[];const j=l.findIndex(x=>String(x.id)===String(nb.id));if(j>=0)l=l.filter((x,k)=>k!==j);else{if(l.length>=10){say('Máximo de 10 candidatos por despertar.','#ffd54a');return}l=l.concat([nb])}if(it===draft)draft.cand=l;else{if(l.length)AWC[it.pkg.id]=l;else delete AWC[it.pkg.id];awSave();sync()}pkList();pkN()},
   brcxsangue:()=>{tfb=tfb?0:1;screen()},
   brcxvit:()=>{tfw=tfw?0:1;screen()},
   brcsoon:()=>say('Essa categoria chega na próxima etapa.'),
   brcpaste:()=>{const e=api.root().querySelector('#brctxt');take(e?e.value:'')},
   brctest:()=>{const it=find(v);if(!it)return;const t=it.pkg.tipo;TST.add(it.pkg.id);if(t==='som'){const go=b=>{try{SFX.unlock()}catch(e){}SFX.play(b);say('Tocando: '+E(EVT[it.pkg.dados.evento])+' · '+b.duration.toFixed(2)+' s · '+kb(it.tam)+' (se não ouvir, confira o volume e o som do jogo em Opções).','#7dffa0')};it.buf?go(it.buf):decSom(it.pkg).then(b=>{it.buf=b;go(b)}).catch(()=>say('Não consegui tocar este áudio.','#ff7a7a'));return}t==='finalizacao'?(api.testFin(it.fk,tfb,tfw)&&api.test(0)):t==='despertar'?(say('Teste: toque em 🔥 Despertar e depois no poder final (a recarga é curta no teste).','#7dffa0'),api.test(0,null,null,it.pkg.id)):t==='arma'?api.test(it.wi):t==='acessorio'?api.test(null,it.ix):api.test(null,null,it.ix)},
   brcexp:()=>{const it=find(v);if(it)exportIt(it)},
   brcsave:()=>{if(!draft)return;const nm=api.root().querySelector('#brcnm'),au=api.root().querySelector('#brcau');draft.pkg.nome=txt(nm&&nm.value,24)||draft.pkg.nome;draft.pkg.autor=txt(au&&au.value,20);if(draft.pkg.tipo==='despertar'&&!(draft.cand&&draft.cand.length)&&(draft.pkg.dados.candidato||'').replace(/[^A-Za-zÀ-ÿ]/g,'').length<3){say('O arquivo não tem candidato: escolha um da lista (botão 👤).','#ffd54a');return}
     if(items.some(i=>i.pkg.id===draft.pkg.id)){msg='Essa criação já está salva.';msgc='#ffd54a';draft=null;sync();return screen()}
     draft.tam=JSON.stringify(draft.pkg).length;const tp=draft.pkg.tipo,ev=draft.pkg.dados.evento,cb=draft.cand&&draft.cand.length?draft.cand:null,pid=draft.pkg.id;items.push({pkg:draft.pkg,tam:draft.tam,buf:draft.buf});draft=null;if(cb){AWC[pid]=cb;awSave()}if(!save()){items.pop();msg='Sem espaço para salvar neste aparelho. Apague criações em Minhas criações e tente de novo.';msgc='#ff7a7a'}else{msg=tp==='despertar'?'Salvo! O despertar vale sempre que "'+(cb?cnm(cb):items[items.length-1].pkg.dados.candidato)+'" lutar (você ou a CPU). Excluir devolve o original.':tp==='som'?'Salvo! Já vale no jogo para: '+EVT[ev]+'. Excluir devolve o som original.':'Salva! Ela já aparece na lista de '+{arma:'armas',acessorio:'acessórios',mapa:'mapas',finalizacao:'finalizações (na tela antes da luta)'}[tp]+'.';msgc='#7dffa0'}sync();screen()},
   brcclr:()=>{try{localStorage.removeItem('brc_libcache')}catch(e){}msg='Cache da biblioteca limpo.';msgc='#7dffa0';screen()},
   brcdrop:()=>{draft=null;sync();msg='Rascunho descartado.';msgc='';screen()},
   brcdel:()=>{const it=items[+v];if(!it)return;if(!confirm('Excluir "'+it.pkg.nome+'" deste aparelho?'))return;delete AWC[it.pkg.id];awSave();items.splice(+v,1);save();sync();msg='Excluída.';msgc='';screen()},
   brcsend:()=>say('O envio para a biblioteca chega nas próximas etapas.')}[a]||(()=>{}))()};
const change=e=>{const t=e.target;if(t&&t.dataset&&t.dataset.a==='brcpuf'&&pk){pk.uf=t.value;pk.list=null;pkLoad();return 1}if(t&&t.dataset&&t.dataset.a==='brcfimg'){const f=t.files&&t.files[0],c=api&&api.root().querySelector('#brcfc');if(!f||!c)return 1;if(f.size>8e6){fmsg('Imagem grande demais (máx. 8 MB).','#ff7a7a');return 1}const r=new FileReader();r.onload=()=>loadImg(r.result).then(i=>{const x=c.getContext('2d'),s=Math.min(i.width,i.height);x.clearRect(0,0,FW,FW);x.drawImage(i,(i.width-s)/2,(i.height-s)/2,s,s,0,0,FW,FW);fmsg('Imagem carregada. Pode desenhar por cima.','#7dffa0')}).catch(()=>fmsg('Não consegui abrir esta imagem.','#ff7a7a'));r.onerror=()=>fmsg('Não consegui ler a imagem.','#ff7a7a');r.readAsDataURL(f);return 1}if(!t||!t.dataset||t.dataset.a!=='brcfile')return 0;const f=t.files&&t.files[0];if(!f)return 1;
  if(f.size>300000){msg='Arquivo grande demais.';msgc='#ff7a7a';screen();return 1}
  const r=new FileReader();r.onload=()=>take(String(r.result));r.onerror=()=>say('Não consegui ler o arquivo.','#ff7a7a');r.readAsText(f);return 1};
return{pickFor:(pid,back)=>{const i=items.findIndex(x=>x.pkg.id===pid);if(i>=0){pkOpen(String(i));if(pk)pk.back=back}},APPV,FO,space,spaceHtml,awi:a=>{AWR=a;awInj()},awKind,awb,AWU,fctx:c=>{FC=c},fstep,fd,fo,dur:k=>(FO.find(q=>q.k===k)||{dur:8}).dur,genFoto,encode,validate,sync,H,S,list:()=>items,get draft(){return draft},ctx:c=>{C=c;C.fix=C.fix||null},get api(){return api},set api(a){api=a;FIXF=a&&a.fix||null},lib:{tested:id=>TST.has(id),save:()=>save(),has:id=>items.some(i=>i.pkg.id===id),get:id=>(items.find(i=>i.pkg.id===id)||{}).pkg,del:id=>{const k=items.findIndex(i=>i.pkg.id===id);if(k<0)return 0;delete AWC[id];awSave();items.splice(k,1);save();sync();return 1},add:async raw=>{const r=validate(raw);if(!r.ok)return r;if(items.some(i=>i.pkg.id===r.pkg.id))return{ok:0,e:['Você já tem esta criação (em Minhas criações).'],n:[]};let buf;if(r.pkg.tipo==='som'){try{buf=await decSom(r.pkg)}catch(e){return{ok:0,e:['Não consegui decodificar este áudio neste aparelho.'],n:[]}}if(buf.duration>3.05)return{ok:0,e:['Som longo demais (máx. 3 s).'],n:[]}}items.push({pkg:r.pkg,tam:r.tam,buf});if(!save()){items.pop();return{ok:0,e:['Sem espaço para salvar neste aparelho. Apague criações em Minhas criações e tente de novo.'],n:[]}}sync();return r}},anc:i=>AN[i]||'',click,change,screen,install:(raw,tmp)=>{const r=validate(raw);if(!r.ok)return r;if(tmp){draft={pkg:r.pkg,tam:r.tam,n:r.n}}else{items.push({pkg:r.pkg,tam:r.tam});save()}sync();return r},reset:()=>{items=[];draft=null;try{localStorage.removeItem(KEY)}catch(e){}sync()}}})();
