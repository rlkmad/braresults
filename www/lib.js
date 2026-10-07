/* Braresults 1.9.9 — Biblioteca online (Etapa 3 leitura + Etapa 4 envio). Só dados: baixa o JSON "brc1" e passa pelo MESMO validador de custom.js. */
window.BRCL=(()=>{
const CF=()=>window.BRCL_CFG||{},PS=12,CK='brc_libcache',MK='brc_libmap',DK='brc_libdn',RK='brc_librep',NK='brc_nick',TK='brc_terms',UK='brc_upl',SK='brc_sent',MAXU=5;
const E=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jget=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},jset=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return 1}catch(e){return 0}};
const kb=n=>n<1024?n+' B':n<1048576?(n/1024).toFixed(1)+' KB':(n/1048576).toFixed(2)+' MB';
const TN={arma:'arma',acessorio:'acessório',mapa:'mapa',som:'som',finalizacao:'finalização',despertar:'despertar'},TI={arma:'⚔️',acessorio:'🎩',mapa:'🗺️',som:'🔊',finalizacao:'💥',despertar:'✨'};
const CATS=[['todas','Todas'],['arma','⚔️ Armas'],['acessorio','🎩 Acessórios'],['mapa','🗺️ Mapas'],['finalizacao','💥 Finalizações'],['despertar','✨ Despertares'],['som','🔊 Sons'],['inst','✔ Instaladas']];
const ORD={baixadas:['Mais baixadas','baixadas.desc,criado_em.desc'],novas:['Novas','criado_em.desc'],menores:['Menores','tamanho_bytes.asc,criado_em.desc']};
const vc=(a,b)=>{const x=String(a).split('.').map(Number),y=String(b).split('.').map(Number);for(let i=0;i<3;i++){const d=(x[i]||0)-(y[i]||0);if(d)return d<0?-1:1}return 0};
const okFoto=f=>typeof f==='string'&&f.length<60000&&/^data:image\/(webp|png|jpeg);base64,[A-Za-z0-9+\/=]+$/.test(f);
const configured=()=>!!(CF().url&&CF().key);
const plug=n=>{try{const C=window.Capacitor;if(!C||(C.isNativePlatform&&!C.isNativePlatform()))return null;return(C.Plugins&&C.Plugins[n])||C.registerPlugin(n)}catch(e){return null}};
/* HTTP: nativo (CapacitorHttp) com queda para fetch. Devolve {s,t}. */
const req=async(m,p,body,ex)=>{const u=String(CF().url).replace(/\/+$/,'')+'/rest/v1/'+p,h={apikey:CF().key,Authorization:'Bearer '+CF().key,Accept:'application/json'};if(body!==undefined)h['Content-Type']='application/json';if(ex)Object.assign(h,ex);
  const P=plug('CapacitorHttp');let en='';
  if(P&&P[m]){try{const r=await P[m]({url:u,headers:h,data:body,readTimeout:15000,connectTimeout:10000,responseType:'text'});return{s:r.status,t:typeof r.data==='string'?r.data:JSON.stringify(r.data)}}catch(e){en='nativo: '+(e&&e.message||e)}}
  const c=new AbortController(),t=setTimeout(()=>c.abort(),15000);try{const r=await fetch(u,{method:m.toUpperCase(),headers:h,body:body===undefined?undefined:JSON.stringify(body),signal:c.signal});return{s:r.status,t:await r.text()}}catch(e){throw Error((en?en+' | ':'')+'web: '+(e&&e.message||e))}finally{clearTimeout(t)}};
const herr=s=>{const e=Error('HTTP '+s);e.code=s;return e};
const get=async p=>{const r=await req('get',p);if(r.s<200||r.s>=300)throw herr(r.s);return JSON.parse(r.t)};
/* download com progresso real: lê o corpo em pedaços (bytes recebidos / Content-Length; sem tamanho, curva por bytes). on(0..1). Se o fluxo não existir ou falhar (sem ser erro HTTP), cai no get() normal. */
const getP=async(p,on)=>{try{const u=String(CF().url).replace(/\/+$/,'')+'/rest/v1/'+p,c=new AbortController(),t=setTimeout(()=>c.abort(),15000);
  try{const r=await fetch(u,{headers:{apikey:CF().key,Authorization:'Bearer '+CF().key,Accept:'application/json'},signal:c.signal});if(r.status<200||r.status>=300)throw herr(r.status);
    if(!r.body||!r.body.getReader)return JSON.parse(await r.text());
    const tot=+r.headers.get('content-length')||0,rd=r.body.getReader(),dc=new TextDecoder();let got=0,tx='';
    for(;;){const x=await rd.read();if(x.done)break;got+=x.value.length;tx+=dc.decode(x.value,{stream:true});on(tot?Math.min(1,got/tot):1-Math.exp(-got/3000))}
    return JSON.parse(tx+dc.decode())}finally{clearTimeout(t)}}catch(e){if(e&&e.code)throw e;return get(p)}};
const prog=id=>f=>{const v=Math.round(10+80*f);if(S.dl[id]!=null&&v-S.dl[id]>=2){S.dl[id]=v;draw()}};
/* mensagens de erro em português claro */
const errMsg=e=>{const c=e&&e.code,m=String(e&&e.message||e||'');
  if(c===401||c===403)return'O servidor recusou o acesso (HTTP '+c+'). Confira a URL e a chave pública em lib-config.js e se o SQL do Supabase foi executado.';
  if(c===404)return'Tabela ou função não encontrada no Supabase (HTTP 404). Rode o arquivo supabase-biblioteca.sql no SQL Editor e confira a URL.';
  if(c===400||c===422)return'O servidor recusou os dados (HTTP '+c+'). Rode de novo o SQL mais recente (supabase-biblioteca.sql) no Supabase.';
  if(c===429)return'Muitas tentativas em pouco tempo. Aguarde um minuto e tente de novo.';
  if(c>=500)return'O servidor da biblioteca está com problema (HTTP '+c+'). Se o projeto do Supabase estiver pausado, abra o painel e toque em Restore.';
  if(/abort|timeout|timed out/i.test(m))return'A conexão demorou demais. Verifique a internet e tente de novo.';
  if(/Failed to fetch|NetworkError|Load failed|web:|nativo:/i.test(m))return'Sem conexão com o servidor. Verifique a internet e a URL em lib-config.js.';
  if(e instanceof SyntaxError||/resposta inv/i.test(m))return'O servidor respondeu algo inesperado. Confira a URL do Supabase em lib-config.js.';
  return m||'erro desconhecido'};
/* estado */
const S={cat:'todas',ord:'baixadas',q:'',qi:'',rows:[],more:0,busy:0,err:'',msg:'',mc:'',det:null,dl:{},tk:0,up:null};
let map=jget(MK,{}),cnt=jget(DK,[]),rep=jget(RK,[]);
const lib=()=>window.BRC&&BRC.lib;
const pidOf=r=>(map[r.id]&&lib().has(map[r.id].pid))?map[r.id].pid:(r.hash&&lib().has(r.hash)?r.hash:'');
const instRows=()=>Object.keys(map).filter(id=>lib().has(map[id].pid)).map(id=>{const m=map[id],p=lib().get(m.pid)||{};return{id,tipo:m.tipo,nome:m.nome,autor:m.autor,tamanho_bytes:m.tam,foto:p.foto||'',ver_min_app:'1.9.0',inst:1}});
const all=()=>S.rows.concat(instRows());const find=id=>all().find(r=>r.id===id);
/* cache da lista (1ª página de cada busca) */
const ckey=()=>S.cat+'|'+S.ord+'|'+S.q;
const cget=()=>(jget(CK,{})[ckey()]||null);
const cset=rows=>{let c=jget(CK,{});c[ckey()]={t:Date.now(),rows};const ks=Object.keys(c).sort((a,b)=>c[a].t-c[b].t);while(ks.length>6)delete c[ks.shift()];if(!jset(CK,c))jset(CK,{[ckey()]:c[ckey()]})};
const lpath=off=>{let p='creations?select=id,tipo,nome,autor,ver_min_app,tamanho_bytes,foto,hash,baixadas,criado_em&order='+ORD[S.ord][1]+'&limit='+PS+'&offset='+off;if(S.cat!=='todas')p+='&tipo=eq.'+S.cat;if(S.q)p+='&nome=ilike.*'+encodeURIComponent(S.q)+'*';return p};
const load=async more=>{if(!configured())return draw();const tk=++S.tk;S.busy=1;S.err='';draw();
  try{const r=await get(lpath(more?S.rows.length:0));if(tk!==S.tk)return;if(!Array.isArray(r))throw Error('resposta inválida');S.rows=more?S.rows.concat(r):r;S.more=r.length>=PS;if(!more)cset(r)}
  catch(e){if(tk!==S.tk)return;if(more)S.err='Não consegui carregar mais: '+errMsg(e);else{const c=cget();if(c){S.rows=c.rows;S.more=0;S.err=errMsg(e)+' Mostrando a última lista guardada ('+new Date(c.t).toLocaleString('pt-BR')+').'}else{S.rows=[];S.more=0;S.err=errMsg(e)+' Não há lista guardada. As criações instaladas funcionam offline (aba Instaladas).'}}}
  finally{if(tk===S.tk){S.busy=0;draw()}}};
/* telas */
const ph=(r,sz)=>okFoto(r.foto)?'<img src="'+r.foto+'" style="width:'+sz+'px;height:'+sz+'px;flex:none;border-radius:8px;background:#0004;object-fit:cover" data-a="brcldet" data-v="'+E(r.id)+'">':'<span data-a="brcldet" data-v="'+E(r.id)+'" style="width:'+sz+'px;height:'+sz+'px;flex:none;border-radius:8px;background:#0004;display:flex;align-items:center;justify-content:center;font-size:'+Math.round(sz*.55)+'px">'+TI[r.tipo]+'</span>';
const upd=r=>vc(r.ver_min_app||'1.9.0',BRC.APPV)>0;
const btn=r=>{const id=E(r.id);if(S.dl[r.id]!=null)return'<small>Baixando…</small>';if(pidOf(r))return'<button class="c on" data-a="brcldet" data-v="'+id+'">✔ Instalada</button>';if(upd(r))return'<button class="c" data-a="brcldet" data-v="'+id+'" style="opacity:.6">🔒 Atualize o app</button>';return'<button class="c" data-a="brcladd" data-v="'+id+'">⬇ Adicionar</button>'};
const bar=r=>S.dl[r.id]!=null?'<div style="height:5px;margin-top:4px;background:#fff3;border-radius:3px"><div style="width:'+S.dl[r.id]+'%;height:100%;background:#7dffa0;border-radius:3px"></div></div>':'';
const card=r=>'<div class="pc" style="gap:8px">'+ph(r,56)+'<span style="flex:1;min-width:0"><b>'+E(r.nome)+'</b><br><small>'+E(r.autor||'anônimo')+' · '+kb(r.tamanho_bytes||0)+' · '+TN[r.tipo]+(r.baixadas!=null?' · ⬇ '+(r.baixadas|0):'')+'</small>'+bar(r)+'</span>'+btn(r)+'</div>';
const detail=r=>{const pid=pidOf(r),id=E(r.id);return'<div class="sec" style="align-items:center;text-align:center">'+ph(r,Math.min(200,Math.round(innerHeight*.4)))+'<b style="font-size:16px">'+E(r.nome)+'</b><small>'+E(r.autor||'anônimo')+' · '+TN[r.tipo]+' · '+kb(r.tamanho_bytes||0)+(r.baixadas!=null?' · ⬇ '+(r.baixadas|0)+' baixadas':'')+(r.criado_em?'<br>Publicada em '+new Date(r.criado_em).toLocaleDateString('pt-BR'):'')+'</small>'
  +(S.dl[r.id]!=null?'<small>Baixando…</small>'+bar(r):pid?'<button class="c" data-a="brcldel" data-v="'+id+'">🗑 Remover do aparelho</button>':upd(r)?'<small style="color:#ffd54a">Requer atualização do app (versão '+E(r.ver_min_app)+').</small>':'<button class="c on" data-a="brcladd" data-v="'+id+'">⬇ Adicionar ao jogo</button>')
  +(!r.inst&&!pid&&!upd(r)&&S.dl[r.id]==null?'<button class="c" data-a="brclteste" data-v="'+id+'">🧪 Testar sem instalar</button><small style="opacity:.7">O teste abre a criação como rascunho em Minhas criações (lá dá para salvar).</small>':'')
  +(r.inst?'':'<button class="c" data-a="brclrep" data-v="'+id+'" style="opacity:.8">🚩 Denunciar</button>')+'</div>'};
const draw=()=>{const api=BRC.api;if(!api)return;const o=api.root(),sc=o&&o.querySelector('.col'),top=sc?sc.scrollTop:0,qe=o&&o.querySelector('#brclq');if(qe)S.qi=qe.value;
  if(S.up){keep();api.shell(upView());return}
  let b;
  if(!configured())b='<div class="sec"><b>Biblioteca ainda não configurada</b><small>Falta preencher a URL e a chave pública do Supabase em lib-config.js. Enquanto isso, use “Minhas criações” para importar arquivos.</small></div>';
  else if(S.det&&find(S.det))b=detail(find(S.det));
  else{const inst=S.cat==='inst',rows=inst?instRows():S.rows;
    b=(inst?'':'<div class="sec"><div style="display:flex;gap:6px"><input id="brclq" style="flex:1;min-width:0;padding:8px;border-radius:8px;border:1px solid #fff4;background:#0006;color:#fff;font-size:13px" maxlength="24" placeholder="Buscar por nome" value="'+E(S.qi)+'"><button class="c" data-a="brclsearch">🔍</button><button class="c" data-a="brclref">🔄</button></div><div class="chips">'+Object.keys(ORD).map(k=>'<button class="c'+(S.ord===k?' on':'')+'" data-a="brclord" data-v="'+k+'">'+ORD[k][0]+'</button>').join('')+'</div></div>')
    +'<div class="sec">'+(S.err?'<small style="color:#ffd54a">'+E(S.err)+'</small>':'')+(rows.length?rows.map(card).join(''):S.busy?'<small>Carregando…</small>':'<small style="opacity:.7">'+(inst?'Nenhuma criação instalada da biblioteca.':'Nenhuma criação encontrada.')+'</small>')+(!inst&&S.busy&&rows.length?'<small>Carregando…</small>':'')+(!inst&&S.more&&!S.busy?'<button class="c" data-a="brclmore">Carregar mais</button>':'')+'</div>'}
  api.shell('<div class="top"><button class="c" data-a="'+(S.det?'brclback':'menu')+'">← '+(S.det?'Lista':'Menu')+'</button><b>📚 Biblioteca</b><button class="c" data-a="brc">🧩 Minhas</button></div><div class="body"><div class="col" style="flex:1;overflow:auto">'
   +(configured()?'<div class="chips">'+CATS.map(c=>'<button class="c'+(S.cat===c[0]?' on':'')+'" data-a="brclcat" data-v="'+c[0]+'">'+c[1]+'</button>').join('')+'</div>':'')
   +(S.msg?'<small style="color:'+(S.mc||'#7dffa0')+'">'+E(S.msg)+'</small>':'')+(configured()&&!S.det&&BRC.space&&BRC.space().pct>=80?BRC.spaceHtml(0):'')+b+'</div></div>');
  const r=api.root(),c=r&&r.querySelector('.col');if(c)c.scrollTop=top;if(r)r.onkeydown=e=>{if(e.key==='Enter'&&e.target&&e.target.id==='brclq'){e.preventDefault();search()}}};
const search=()=>{const e=BRC.api.root().querySelector('#brclq');S.qi=e?e.value:'';S.q=S.qi.replace(/[^\p{L}\p{N} _-]/gu,'').trim().slice(0,24);S.det=null;load()};
/* adicionar: baixa só os "dados" e passa pelo validador do app */
const add=async id=>{const r=find(id);if(!r||S.dl[id]!=null||pidOf(r))return;S.msg='';S.dl[id]=10;draw();let go2='';
  try{const rows=await getP('creations?id=eq.'+encodeURIComponent(id)+'&select=dados&limit=1',prog(id));S.dl[id]=90;draw();const d=rows&&rows[0]&&rows[0].dados;if(!d)throw Error('Criação não encontrada (talvez tenha sido removida).');
    const raw={fmt:'brc1',tipo:r.tipo,nome:r.nome,autor:r.autor||'',versao:1,ver_min_app:r.ver_min_app||'1.9.0',dados:d};if(okFoto(r.foto))raw.foto=r.foto;
    const x=await lib().add(raw);if(!x.ok)throw Error(x.e.join('; '));S.dl[id]=95;draw();
    map[id]={pid:x.pkg.id,tipo:r.tipo,nome:x.pkg.nome,autor:x.pkg.autor,tam:x.tam};jset(MK,map);
    if(!cnt.includes(id)){cnt.push(id);jset(DK,cnt);req('post','rpc/contar_download',{p_id:id}).catch(()=>{})}
    if(r.tipo==='despertar')go2=x.pkg.id;S.msg='“'+x.pkg.nome+'” instalada! '+(r.tipo==='som'?'O som já vale no jogo.':r.tipo==='finalizacao'?'Escolha em Jogar, na tela antes da luta.':r.tipo==='despertar'?'Escolha o candidato que vai usar este despertar.':'Já aparece nas listas do jogo.')+(x.n&&x.n.length?' ('+x.n.length+' ajuste(s) automático(s))':'');S.mc='#7dffa0'}
  catch(e){S.msg='Não foi possível adicionar: '+errMsg(e);S.mc='#ff7a7a'}
  finally{delete S.dl[id];draw();if(go2&&BRC.pickFor)setTimeout(()=>BRC.pickFor(go2,()=>draw()),50)}};
const teste=async id=>{const r=find(id);if(!r||S.dl[id]!=null||pidOf(r)||upd(r))return;
  if(BRC.draft&&!confirm('Você tem um rascunho em Minhas criações. Testar esta criação vai substituí-lo. Continuar?'))return;
  S.msg='';S.dl[id]=10;draw();let go=0;
  try{const rows=await getP('creations?id=eq.'+encodeURIComponent(id)+'&select=dados&limit=1',prog(id));S.dl[id]=90;draw();const d=rows&&rows[0]&&rows[0].dados;if(!d)throw Error('Criação não encontrada (talvez tenha sido removida).');
    const raw={fmt:'brc1',tipo:r.tipo,nome:r.nome,autor:r.autor||'',versao:1,ver_min_app:r.ver_min_app||'1.9.0',dados:d};if(okFoto(r.foto))raw.foto=r.foto;
    const x=BRC.install(raw,true);if(!x.ok)throw Error(x.e.join('; '));
    if(r.tipo==='som'){S.msg='Tocando o som (se não ouvir, confira o volume em Opções). Ele ficou como rascunho em Minhas criações.';S.mc='#7dffa0';BRC.click('brctest',{dataset:{v:'d'}})}
    else{delete S.dl[id];go=1;BRC.click('brctest',{dataset:{v:'d'}})}}
  catch(e){S.msg='Não foi possível testar: '+errMsg(e);S.mc='#ff7a7a'}
  finally{if(!go){delete S.dl[id];draw()}}};
const del=id=>{const r=find(id),pid=r&&pidOf(r);if(!pid)return;if(!confirm('Remover "'+r.nome+'" deste aparelho?'))return;lib().del(pid);delete map[id];jset(MK,map);S.msg='Removida.';S.mc='';if(S.cat==='inst')S.det=null;draw()};
const report=async id=>{const r=find(id);if(!r)return;if(rep.includes(id)){S.msg='Você já denunciou esta criação.';S.mc='#ffd54a';return draw()}if(!confirm('Denunciar "'+r.nome+'" como ofensiva ou inadequada?'))return;
  try{const x=await req('post','rpc/denunciar',{p_id:id});if(x.s<200||x.s>=300)throw herr(x.s);rep.push(id);jset(RK,rep);S.msg='Denúncia enviada. Obrigado!';S.mc='#7dffa0';S.rows=S.rows.filter(q=>q.id!==id);S.det=null}catch(e){S.msg='Não consegui enviar a denúncia: '+errMsg(e);S.mc='#ff7a7a'}draw()};

/* ---------- envio (Etapa 4): Testar -> Enviar. Publica na hora (status aprovado); só o dono modera pelo painel. ---------- */
const BAD=['porra','caralho','puta','merda','buceta','foder','fdp','viado','vadia','arrombado','nazista','estupro','estuprador','pedofilo','pedofilia','macaco','retardado'],BAD2=['hitler','nazi','estupr','pedofil'];
const nrm=s=>String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const bad=s=>{const n=nrm(s);return n.split(/[^a-z0-9]+/).some(w=>BAD.includes(w))||BAD2.some(w=>n.includes(w))};
const cl=(v,m)=>String(v||'').replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,m);
const sent=()=>jget(SK,{});
const keep=()=>{const o=BRC.api&&BRC.api.root(),a=o&&o.querySelector('#brcunm'),b=o&&o.querySelector('#brcuau');if(S.up&&a)S.up.nm=a.value;if(S.up&&b)S.up.au=b.value};
const upView=()=>{const u=S.up,it=u.it,p=it.pkg,id=p.id,tested=BRC.lib.tested(id),tos=jget(TK,0)||u.tos,done=sent()[id],tam=JSON.stringify(p.dados).length;
  const inp='width:100%;padding:8px;border-radius:8px;border:1px solid #fff4;background:#0006;color:#fff;font-size:13px;box-sizing:border-box';
  return'<div class="top"><button class="c" data-a="brcuback">← Voltar</button><b>📚 Enviar para a biblioteca</b></div><div class="body"><div class="col" style="flex:1;overflow:auto"><div class="sec">'
  +'<div style="display:flex;gap:8px;align-items:center">'+(okFoto(p.foto)?'<img src="'+p.foto+'" style="width:64px;height:64px;border-radius:8px;object-fit:cover">':'<span style="font-size:36px">'+TI[p.tipo]+'</span>')+'<small>'+TN[p.tipo]+' · '+kb(tam)+' para baixar<br>A foto é a da criação (🖼 em Minhas criações).</small></div>'
  +'<input id="brcunm" style="'+inp+'" maxlength="24" placeholder="Nome da criação" value="'+E(u.nm!=null?u.nm:p.nome)+'"><input id="brcuau" style="'+inp+'" maxlength="20" placeholder="Seu apelido (aparece como autor)" value="'+E(u.au!=null?u.au:(jget(NK,'')||p.autor||''))+'">'
  +(tos?'<small style="opacity:.75">✔ Termos aceitos.</small>':'<small style="color:#ffd54a">Ao enviar, você declara que a criação é sua (ou autorizada), que não tem ofensa, ódio, pornografia, violência real nem foto de pessoa real sem autorização, e que ela fica pública para todos os usuários. O dono pode removê-la a qualquer momento.</small><button class="c'+(u.tos?' on':'')+'" data-a="brcuterms">'+(u.tos?'☑':'☐')+' Li e aceito os termos</button>')
  +(tested?'<small style="opacity:.75">✔ Testada neste aparelho.</small>':'<small style="color:#ffd54a">Teste a criação antes de enviar (botão 🧪 Testar em Minhas criações) e volte aqui.</small>')
  +(done?'<small style="color:#7dffa0">✔ Esta criação já foi enviada deste aparelho.</small>':'')
  +'<button class="c on" data-a="brcugo" style="'+(!tested||done||u.busy?'opacity:.5':'')+'">'+(u.busy?'Enviando…':'📤 Enviar agora')+'</button>'
  +(S.msg?'<small style="color:'+(S.mc||'#7dffa0')+'">'+E(S.msg)+'</small>':'')+'</div></div></div>'};
const upOpen=v=>{const it=v==='d'?BRC.draft:BRC.list()[+v];if(!it)return;if(!configured()){BRC.api.shell('<div class="top"><button class="c" data-a="brc">← Voltar</button><b>📚 Enviar</b></div><div class="body"><div class="col"><div class="sec"><b>Biblioteca ainda não configurada</b><small>Falta a URL e a chave pública do Supabase em lib-config.js.</small></div></div></div>');return}S.up={it,tos:0};S.msg='';S.mc='';draw()};
const upGo=async()=>{const u=S.up;if(!u||u.busy)return;keep();const it=u.it,p=it.pkg,id=p.id,say=(m,c)=>{S.msg=m;S.mc=c||'#ff7a7a';draw()};
  const nm=cl(u.nm!=null?u.nm:p.nome,24),au=cl(u.au,20);
  if(sent()[id])return say('Esta criação já foi enviada deste aparelho.','#ffd54a');
  if(!BRC.lib.tested(id))return say('Teste a criação antes de enviar.','#ffd54a');
  if(!nm)return say('Digite um nome.');if(!au)return say('Digite um apelido para aparecer como autor.');
  if(bad(nm)||bad(au))return say('Nome ou apelido com palavra não permitida.');
  if(!(jget(TK,0)||u.tos))return say('Aceite os termos para enviar.','#ffd54a');
  const now=Date.now(),hist=jget(UK,[]).filter(t=>now-t<864e5);if(hist.length>=MAXU)return say('Limite de '+MAXU+' envios por dia neste aparelho. Tente amanhã.','#ffd54a');
  u.busy=1;S.msg='';draw();
  try{if(!okFoto(p.foto)){const f=await BRC.genFoto(it);if(f)p.foto=f}if(!okFoto(p.foto))throw Error('Crie uma foto para a criação (🖼).');
    p.nome=nm;p.autor=au;const r=BRC.validate(p);if(!r.ok)throw Error(r.e.join('; '));const d=r.pkg.dados,tam=JSON.stringify(d).length;if(tam>200000)throw Error('Criação grande demais para a biblioteca.');
    const x=await req('post','creations',{tipo:p.tipo,nome:nm,autor:au,ver_min_app:p.ver_min_app,tamanho_bytes:Math.max(1,tam),foto:p.foto,dados:d,hash:p.id,status:'aprovado',baixadas:0,denuncias:0},{Prefer:'return=minimal'});
    if(x.s===409)throw Error('Essa criação já existe na biblioteca.');if(x.s<200||x.s>=300)throw herr(x.s);
    if(BRC.list().includes(it))BRC.lib.save();jset(NK,au);if(u.tos)jset(TK,1);hist.push(now);jset(UK,hist);const sn=sent();sn[id]=now;jset(SK,sn);S.rows=[];
    u.busy=0;S.msg='Enviada! Ela já aparece na biblioteca para todos.';S.mc='#7dffa0';draw()}
  catch(e){u.busy=0;say('Não foi possível enviar: '+errMsg(e))}};
const click=(a,t)=>{const v=t&&t.dataset&&t.dataset.v;
  ({brcusend:()=>upOpen(v),brcuback:()=>{S.up=null;BRC.screen()},brcuterms:()=>{keep();S.up.tos=S.up.tos?0:1;draw()},brcugo:upGo,brclib:()=>{S.up=null;S.det=null;S.msg='';S.mc='';if(!S.rows.length&&configured())load();else draw()},
   brclcat:()=>{S.cat=v;S.det=null;S.msg='';S.cat==='inst'?draw():load()},
   brclord:()=>{S.ord=v;load()},brclsearch:search,brclref:()=>{S.det=null;load()},brclmore:()=>load(1),
   brcldet:()=>{S.det=v;draw()},brclteste:()=>teste(v),brclback:()=>{S.det=null;draw()},brcladd:()=>add(v),brcldel:()=>del(v),brclrep:()=>report(v)}[a]||(()=>{}))()};
return{click,S,configured}})();
