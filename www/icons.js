/* Icones proprios (SVG desenhados a mao) no lugar dos emojis da interface.
   Troca o emoji por <svg> em qualquer texto/HTML novo (MutationObserver), sem mexer nas telas.
   Emojis nao listados (ex.: icone escolhido pelo usuario numa criacao) ficam como estao. */
(function(){
const F='fill="currentColor" stroke="none"';
const P={
glove:'<path d="M7 11c0-3.500 2-6 5.500-6S18 7.500 18 11v3.500c0 1.800-1 3-2.500 3.500V21h-6v-3C7.800 17.500 7 16.300 7 14.500z"/><path d="M7.500 12.500C5 12 4 13 4.500 14.500S6.500 16 8 15.500M9.500 18h6"/>',
dash:'<path d="M3 8h9a3 3 0 1 0-3-3M3 12h14a3 3 0 1 1-3 3M3 16h6"/>',
shield:'<path d="M12 3l7 3v5.5c0 4.5-3 7.5-7 9.5-4-2-7-5-7-9.5V6z"/>',
up:'<path d="M12 20V7M6 13l6-6 6 6M6 3h12"/>',
down:'<path d="M12 4v13M6 11l6 6 6-6M5 21h14"/>',
bolt:'<path d="M13 2L5 13.5h6L10 22l9-12h-6z"/>',
flame:'<path d="M12 3c.5 3.5 5 5.5 5 10.5a5 5 0 0 1-10 0c0-2 1-3.5 2.5-4.5 0 2 .8 3 2 3 .5-3-1-5 .5-9z"/>',
rocket:'<path d="M12 3c3.500 2.500 5 5.500 5 9.500l-2 3H9l-2-3C7 8.500 8.500 5.500 12 3z"/><circle cx="12" cy="10" r="1.600"/><path d="M7.500 13.500l-3 3 3 .5M16.500 13.500l3 3-3 .5M10 18.500L12 22l2-3.500"/>',
hourglass:'<path d="M7 3h10M7 21h10M8 3c0 5 4 5.500 4 9s-4 4-4 9M16 3c0 5-4 5.500-4 9s4 4 4 9"/>',
pause:'<path '+F+' d="M6 5h4v14H6zM14 5h4v14h-4z"/>',
prev:'<path d="M6 5v14"/><path '+F+' d="M19 5l-9 7 9 7z"/>',
next:'<path d="M18 5v14"/><path '+F+' d="M5 5l9 7-9 7z"/>',
search:'<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l6 6"/>',
gear:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="6.5"/><path d="M12 2v3.500M12 18.500V22M2 12h3.500M18.500 12H22M5 5l2.500 2.500M16.500 16.500L19 19M19 5l-2.500 2.500M7.500 16.500L5 19"/>',
joy:'<circle cx="12" cy="6" r="3"/><path d="M12 9v6M5 20h14l-1.500-5h-11z"/>',
sliders:'<path d="M6 4v16M12 4v16M18 4v16"/><path '+F+' d="M4 14h4v3H4zM10 7h4v3h-4zM16 12h4v3h-4z"/>',
spkOn:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.500 9a4 4 0 0 1 0 6M19 6.500a8 8 0 0 1 0 11"/>',
spkOff:'<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9.500l5 5M22 9.500l-5 5"/>',
bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
bellOff:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21a2 2 0 0 0 4 0M4 4l16 16"/>',
drop:'<path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.500" '+F+'/>',
robot:'<rect x="5" y="8" width="14" height="11" rx="2.500"/><path d="M12 8V5M9 16h6"/><circle cx="12" cy="3.800" r="1.100" '+F+'/><circle cx="9.200" cy="12.500" r="1.200" '+F+'/><circle cx="14.800" cy="12.500" r="1.200" '+F+'/>',
users:'<circle cx="9" cy="8" r="3.200"/><path d="M3 20c0-3.500 2.700-6 6-6s6 2.500 6 6"/><circle cx="17" cy="9" r="2.500"/><path d="M17 14c2.500 0 4.500 2 4.500 5"/>',
fHappy:'<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.100" '+F+'/><circle cx="15" cy="10" r="1.100" '+F+'/><path d="M8 14.500c1.500 2 6.500 2 8 0"/>',
fNeutral:'<circle cx="12" cy="12" r="9"/><circle cx="9" cy="10" r="1.100" '+F+'/><circle cx="15" cy="10" r="1.100" '+F+'/><path d="M8.500 15.500h7"/>',
fDevil:'<circle cx="12" cy="13" r="8"/><path d="M6.800 9l3.500 2M17.200 9l-3.500 2M8.500 17c1.500-2 5.500-2 7 0M5 3.500l2.300 3.200M19 3.500l-2.300 3.200"/><circle cx="9.300" cy="12.500" r="1" '+F+'/><circle cx="14.700" cy="12.500" r="1" '+F+'/>',
ban:'<circle cx="12" cy="12" r="9"/><path d="M5.600 5.600l12.800 12.800"/>',
dumbbell:'<path d="M3 9.500v5M6 7v10M18 7v10M21 9.500v5M6 12h12"/>',
bookO:'<path d="M12 6.500C9.500 4.500 6.500 4.300 3.500 5v13c3-.7 6-.5 8.500 1.500 2.500-2 5.500-2.200 8.500-1.500V5c-3-.7-6-.5-8.500 1.500zM12 6.500v13"/>',
stand:'<circle cx="12" cy="4.500" r="2.500"/><path d="M12 8v7M8.500 11h7M10 21l2-6 2 6"/>',
walk:'<circle cx="13" cy="4.500" r="2.500"/><path d="M12.500 8l-2 6 3.500 3v4M12.500 9l3 3 3 .5M10.500 14L7 16"/>',
swords:'<path d="M5 5l12 12M19 5L7 17M14.500 19.500l3-3M9.500 19.500l-3-3"/>',
clap:'<rect x="3" y="10" width="18" height="11" rx="1.500"/><path d="M3 10l2-5.500 4 1M8 10l2.500-5 4 1M13.500 10l2.500-4.500 4 1L18 10"/>',
sparkle:'<path d="M11 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/><path d="M19 3v4M17 5h4"/>',
inf:'<path d="M6 8c-2.500 0-4 1.800-4 4s1.500 4 4 4c4 0 8-8 12-8 2.500 0 4 1.800 4 4s-1.500 4-4 4c-4 0-8-8-12-8z"/>',
heart:'<path d="M12 20c-6-4-8-8-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 3-2 7-8 11z"/>',
turtle:'<path d="M4.500 16a7.500 7 0 0 1 15 0z"/><path d="M19.500 14l2.500-1.500M8 16v3M16 16v3M12 9v7"/>',
person:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.500 3.500-7 8-7s8 2.500 8 7"/>',
cap:'<path d="M5 15a7 7 0 0 1 14 0M5 15h17M12 8v.5"/>',
radio:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1.600" '+F+'/><path '+F+' d="M12 12L8.500 5.900A7 7 0 0 1 15.500 5.900z"/><path '+F+' d="M12 12L8.500 5.900A7 7 0 0 1 15.500 5.900z" transform="rotate(120 12 12)"/><path '+F+' d="M12 12L8.500 5.900A7 7 0 0 1 15.500 5.900z" transform="rotate(240 12 12)"/>',
dog:'<path d="M6 9L4 4.500l4.500 1.500M18 9l2-4.500L15.500 6"/><path d="M6 9c0-2 3-3 6-3s6 1 6 3v5a6 6 0 0 1-12 0z"/><circle cx="9.500" cy="11" r=".9" '+F+'/><circle cx="14.500" cy="11" r=".9" '+F+'/><path d="M11 14.500h2l-1 1.500z"/>',
dagger:'<path d="M20 4l-9 9M9 11l4 4M11 13l-6 6"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
comet:'<circle cx="16" cy="8" r="4"/><path d="M13 11L4 20M11 7L5 13M17 13l-6 6"/>',
snow:'<path d="M12 2v20M3.300 7l17.400 10M3.300 17L20.700 7M9.500 4L12 6.500 14.500 4M9.500 20L12 17.500 14.500 20"/>',
burst:'<path d="M12 2l2.200 6 5.800-3-3 5.800 5 2.200-5 2.200 3 5.800-5.800-3L12 22l-2.200-6-5.800 3 3-5.800-5-2.200 5-2.200L4 5l5.800 3z"/>',
heal:'<path d="M9.500 4h5v5.500H20v5h-5.500V20h-5v-5.500H4v-5h5.500z"/>',
storm:'<path d="M7 14.500a4 4 0 0 1 .5-8 5 5 0 0 1 9.500 1.500 3.500 3.500 0 0 1 0 6.500"/><path d="M13 11l-3 5h4l-2 5"/>',
flask:'<path d="M9 3h6M10 3v6l-5 10a1 1 0 0 0 1 1.500h12a1 1 0 0 0 1-1.500l-5-10V3M8 15h8"/>',
image:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.500"/><path d="M3 18l6-5 4 3 3-3 5 4"/>',
palette:'<path d="M12 3a9 9 0 0 0 0 18c2 0 2-2 1-3s0-3 2-3h3a3 3 0 0 0 3-3c0-5-4-9-9-9z"/><circle cx="8" cy="10" r="1" '+F+'/><circle cx="12" cy="7" r="1" '+F+'/><circle cx="16" cy="9" r="1" '+F+'/>',
trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
broom:'<path d="M20 4l-8 9M12 13c-4-1-7 1-8 7 6 0 8-3 8-7z"/>',
folder:'<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
upload:'<path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"/>',
books:'<rect x="4" y="4" width="4" height="16" rx="1"/><rect x="10" y="4" width="4" height="16" rx="1"/><path d="M16 6l4 1-3.500 13-4-1z"/>',
puzzle:'<path d="M10 4a2 2 0 0 1 4 0v2h4v4h-2a2 2 0 0 0 0 4h2v4h-4v-2a2 2 0 0 0-4 0v2H6v-4h2a2 2 0 0 0 0-4H6V6h4z"/>',
hat:'<path d="M3 18h18M6 18V7h12v11M6 13h12"/>',
map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v14M15 6v14"/>',
skull:'<path d="M12 3a8 8 0 0 0-5 14v3h10v-3a8 8 0 0 0-5-14zM10 20v-2M14 20v-2"/><circle cx="9" cy="11" r="1.800" '+F+'/><circle cx="15" cy="11" r="1.800" '+F+'/>',
trophy:'<path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v4M8 21h8M10 18h4"/>',
lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
flag:'<path d="M6 21V4M6 4h12l-3 4 3 4H6"/>',
refresh:'<path d="M20 6v5h-5M4 18v-5h5M5.500 9A8 8 0 0 1 19 11M18.500 15A8 8 0 0 1 5 13"/>',
chart:'<path d="M4 20h16M7 20v-7M12 20V6M17 20v-10"/>',
stopw:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 3h6"/>',
columns:'<path d="M3 9l9-5 9 5zM5 9v9M9 9v9M15 9v9M19 9v9M3 20h18"/>',
city:'<path d="M4 20V10h5v10M9 20V6h5v14M14 20v-8h6v8M3 20h18"/>',
volcano:'<path d="M3 20l6-12h6l6 12zM11 8L10 4M14 8l1-3"/>',
cube:'<path d="M12 3l8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10"/>',
diamond:'<path d="M12 3l9 9-9 9-9-9z"/><path d="M12 8l4 4-4 4-4-4z"/>',
back:'<path d="M20 12H5M11 6l-6 6 6 6"/>',
fwd:'<path d="M4 12h15M13 6l6 6-6 6"/>',
play:'<path '+F+' d="M7 4.500v15l13-7.500z"/>',
playL:'<path '+F+' d="M17 4.500v15L4 12z"/>',
check:'<path d="M5 12.500l4.500 4.500L19 7"/>',
cross:'<path d="M6 6l12 12M18 6L6 18"/>',
undo:'<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-3"/>',
redo:'<path d="M15 14l5-5-5-5"/><path d="M20 9H10a6 6 0 0 0 0 12h3"/>',
dotS:'<circle cx="12" cy="12" r="3.500" '+F+'/>',
dotL:'<circle cx="12" cy="12" r="8" '+F+'/>',
star:'<path '+F+' d="M12 2.500l2.900 6.100 6.600.8-4.900 4.600 1.300 6.600L12 17.300l-5.900 3.300 1.300-6.600L2.500 9.400l6.600-.8z"/>',
starO:'<path d="M12 2.500l2.900 6.100 6.600.8-4.900 4.600 1.300 6.600L12 17.300l-5.900 3.300 1.300-6.600L2.500 9.400l6.600-.8z"/>',
aim:'<circle cx="12" cy="12" r="6"/><path d="M12 2v5M12 17v5M2 12h5M17 12h5"/>',
boxC:'<rect x="4" y="4" width="16" height="16" rx="2.500"/><path d="M8 12.500l3 3 5-6"/>',
box:'<rect x="4" y="4" width="16" height="16" rx="2.500"/>'
};
const M={'👊':'glove','🥊':'glove','💨':'dash','🛡':'shield','⤒':'up','⬇':'down','⚡':'bolt','🔥':'flame','🚀':'rocket','⏳':'hourglass','⏸':'pause','⏮':'prev','⏭':'next','🔍':'search','⚙':'gear','🕹':'joy','🎛':'sliders','🔊':'spkOn','🔇':'spkOff','🔔':'bell','🔕':'bellOff','🩸':'drop','🎯':'target','🤖':'robot','👥':'users','😊':'fHappy','😐':'fNeutral','😈':'fDevil','🚫':'ban','🏋':'dumbbell','📖':'bookO','🧍':'stand','🚶':'walk','⚔':'swords','🎬':'clap','✨':'sparkle','♾':'inf','❤':'heart','🐢':'turtle','👤':'person','🧢':'cap','☢':'radio','🐕':'dog','🗡':'dagger','➕':'plus','☄':'comet','❄':'snow','💥':'burst','💚':'heal','🌩':'storm','🧪':'flask','🖼':'image','🎨':'palette','🗑':'trash','🧹':'broom','📁':'folder','📤':'upload','📚':'books','🧩':'puzzle','🎩':'hat','🗺':'map','💀':'skull','🏆':'trophy','🔒':'lock','🚩':'flag','🔄':'refresh','📊':'chart','⏱':'stopw','🏛':'columns','🌃':'city','🌋':'volcano','🧊':'cube','💜':'diamond'};
const S={'←':'back','→':'fwd','▶':'play','◀':'playL','✔':'check','✖':'cross','✕':'cross','↺':'undo','↻':'redo','●':'dotS','⬤':'dotL','★':'star','☆':'starO','⚑':'flag','⌖':'aim','▢':'box','☐':'box','☑':'boxC'};
const MM=Object.assign({},M,S),kk=o=>Object.keys(o).join('|');
const RX=new RegExp('('+kk(MM)+')\\uFE0F?','g'),TS=new RegExp('('+kk(MM)+')'),RXE=new RegExp('('+kk(M)+')\\uFE0F?','g'),TSE=new RegExp('('+kk(M)+')');
const svg=n=>'<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">'+P[n]+'</svg>';
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
window.IC={i:k=>P[k]?svg(k):'',names:()=>Object.keys(P),map:MM};
const st=document.createElement('style');
st.textContent='.hm .gl .ic{stroke-width:1.1}.ic{width:1.15em;height:1.15em;vertical-align:-.2em;display:inline-block;flex:none;overflow:visible;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}';
(document.head||document.documentElement).appendChild(st);
const SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,TITLE:1,NOSCRIPT:1};
const fixT=n=>{const t=n.nodeValue;if(!t||!TS.test(t))return;const p=n.parentNode;if(!p||SKIP[p.nodeName]||p.closest&&p.closest('svg'))return;
  if(p.nodeName==='OPTION'){n.nodeValue=t.replace(RX,'').replace(/^\s+/,'');return}
  const sp=document.createElement('span');sp.innerHTML=esc(t).replace(RX,(m,k)=>svg(MM[k]));n.replaceWith(sp)};
const fixA=e=>{['placeholder','title','aria-label'].forEach(a=>{const v=e.getAttribute&&e.getAttribute(a);if(v&&TSE.test(v))e.setAttribute(a,v.replace(RXE,'').replace(/^\s+/,''))})};
const walk=r=>{if(!r)return;if(r.nodeType===3){fixT(r);return}if(r.nodeType!==1)return;
  const w=document.createTreeWalker(r,5),l=[];let n=r;while(n){l.push(n);n=w.nextNode()}
  l.forEach(q=>q.nodeType===3?fixT(q):fixA(q))};
const obs=new MutationObserver(ms=>{for(const m of ms){if(m.type==='childList')m.addedNodes.forEach(walk);else if(m.type==='characterData')fixT(m.target);else if(m.type==='attributes')fixA(m.target)}});
obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label']});
const init=()=>walk(document.body);
document.body?init():document.addEventListener('DOMContentLoaded',init);
})();
