/* Braresults — sprites vetoriais (SVG) das 20 armas e 25 acessórios. viewBox 64x64. */
window.FS=(()=>{
const hd='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" stroke="#1b1b2b" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">';
const W=[
'<path d="M32 4l5 8v26H27V12z" fill="#e3ecf5"/><path d="M32 7v30" stroke="#9ab" stroke-width="1.5"/><rect x="21" y="38" width="22" height="5" rx="2" fill="#e0a82e"/><rect x="29.5" y="43" width="5" height="12" fill="#7a4a22"/><circle cx="32" cy="57" r="3.5" fill="#e0a82e"/>',
'<rect x="29.5" y="10" width="5" height="48" rx="2" fill="#7a4a22"/><path d="M34 12q20-2 22 14q-10 6-22 4z" fill="#d0d9e4"/><path d="M37 17q11 0 15 7" stroke="#fff" fill="none" stroke-width="1.5"/>',
'<rect x="29.5" y="16" width="5" height="42" rx="2" fill="#7a4a22"/><rect x="14" y="6" width="36" height="16" rx="3" fill="#8f9bab"/><rect x="14" y="6" width="8" height="16" rx="2" fill="#6d7888"/><rect x="42" y="6" width="8" height="16" rx="2" fill="#6d7888"/>',
'<path d="M32 14l4 6v20h-8V20z" fill="#e3ecf5"/><rect x="23" y="40" width="18" height="4" rx="2" fill="#c8402e"/><rect x="29.5" y="44" width="5" height="10" fill="#4a2c18"/><circle cx="32" cy="56" r="3" fill="#c8402e"/>',
'<path d="M24 4q30 28 0 56" fill="none" stroke="#8a5a2a" stroke-width="4"/><path d="M24 4V60" stroke="#eee" stroke-width="1.2" fill="none"/><path d="M12 32h34" stroke="#a77" stroke-width="2"/><path d="M52 32l-8-5v10z" fill="#ccd"/><path d="M12 32l-3-4M12 32l-3 4" stroke="#d44" stroke-width="2"/>',
'<rect x="30" y="14" width="4" height="46" rx="2" fill="#7a4a22"/><circle cx="32" cy="12" r="9" fill="#58b8ff"/><circle cx="29" cy="9" r="3" fill="#dff4ff" stroke="none"/><path d="M24 21q8 5 16 0" fill="none" stroke="#c9a23a" stroke-width="3"/>',
'<path d="M10 8h44v22q0 20-22 28Q10 50 10 30z" fill="#3a6ad8"/><path d="M32 8v50M10 28h44" stroke="#f2c230" stroke-width="4" fill="none"/><circle cx="32" cy="28" r="5" fill="#f2c230"/>',
'<rect x="30.5" y="16" width="3" height="44" rx="1.5" fill="#9fb0c4"/><path d="M18 8v12q0 8 14 8t14-8V8M32 4v24" fill="none" stroke="#e0b030" stroke-width="3.5"/><path d="M18 5l-4 7h8zM46 5l-4 7h8zM32 2l-4 7h8z" fill="#e0b030"/>',
'<rect x="29.5" y="12" width="5" height="46" rx="2" fill="#7a4a22"/><path d="M6 26Q32 -4 58 26Q32 12 6 26z" fill="#a9b4c4" stroke-width="2.5"/>',
'<path d="M28 4h8l1 30-3 22h-4l-3-22z" fill="#c78b4a"/><rect x="29" y="44" width="6" height="11" fill="#3a2a22"/><path d="M28.5 12h7" stroke="#8a5a2a" stroke-width="2" fill="none"/>',
'<rect x="14" y="20" width="38" height="11" rx="3" fill="#555"/><rect x="48" y="22" width="9" height="6" fill="#333"/><path d="M16 31h12l-3 20H13z" fill="#3a3a3a"/><path d="M30 31q4 8 8 0" fill="none" stroke="#aaa" stroke-width="2"/><rect x="20" y="23" width="10" height="3" fill="#888" stroke="none"/>',
'<circle cx="32" cy="38" r="17" fill="#2a2f3a"/><circle cx="26" cy="32" r="5" fill="#fff" fill-opacity=".3" stroke="none"/><rect x="28" y="16" width="8" height="6" rx="1" fill="#777"/><path d="M34 16q4-8 12-6" fill="none" stroke="#c9a" stroke-width="2.5"/><circle cx="47" cy="10" r="4" fill="#ff8a1f" stroke="#ffd54a"/>',
'<rect x="29.5" y="30" width="5" height="30" rx="2" fill="#7a4a22"/><path d="M32 3q14 14 8 24-2 5-8 5t-8-5q-6-10 8-24z" fill="#ff7a1a"/><path d="M32 14q7 8 4 14-2 3-4 3t-4-3q-3-6 4-14z" fill="#ffd54a" stroke="none"/>',
'<rect x="30" y="26" width="4" height="34" rx="2" fill="#9fc8e8"/><path d="M32 2l9 12-4 14H27l-4-14z" fill="#aee4ff"/><path d="M32 2v26M23 14h18" stroke="#fff" stroke-width="1.3" fill="none"/>',
'<path d="M38 2L16 34h14l-6 28 26-36H35z" fill="#ffe14a" stroke="#c98a00"/>',
'<path d="M35 3Q41 22 33 40h-5Q34 22 35 3z" fill="#e8eef5"/><rect x="24" y="40" width="14" height="4" rx="2" fill="#222"/><rect x="29.5" y="44" width="5" height="14" fill="#8a1f2a"/><path d="M29.5 48l5 3M29.5 53l5 3" stroke="#eee" stroke-width="1" fill="none"/>',
'<rect x="30" y="4" width="4" height="30" fill="#7a4a22"/><rect x="28" y="2" width="8" height="8" rx="2" fill="#333"/><path d="M32 30c-12 0-18 8-14 16-4 8 4 14 14 14s18-6 14-14c4-8-2-16-14-16z" fill="#d6403a"/><circle cx="32" cy="46" r="4" fill="#222"/><path d="M26 54h12" stroke="#eee" stroke-width="2" fill="none"/>',
'<rect x="16" y="8" width="32" height="46" rx="3" fill="#3b64c9"/><rect x="16" y="8" width="6" height="46" fill="#2a4a9a"/><rect x="26" y="16" width="16" height="10" rx="2" fill="#f2e6b0" stroke="none"/><path d="M26 34h16M26 40h12" stroke="#f2e6b0" stroke-width="2" fill="none"/>',
'<path d="M18 30q0-22 16-22 16 0 14 20-1 12-8 14v10H24V42q-6-4-6-12z" fill="#e23a3a"/><rect x="24" y="46" width="18" height="12" rx="2" fill="#f4f4f4"/><path d="M40 20q4 6 0 12" stroke="#fff" fill="none" stroke-width="2"/>',
'<rect x="30" y="20" width="4" height="40" rx="2" fill="#e0b030"/><path d="M20 22l-3-14 9 6 6-8 6 8 9-6-3 14z" fill="#f2c230"/><circle cx="32" cy="15" r="4" fill="#d8365a"/>'];
const A=[
'<path d="M12 40q0-24 22-24 18 0 20 24z" fill="#e23a3a"/><path d="M30 40h30q4 0 2 6H30z" fill="#b32a2a"/><circle cx="34" cy="16" r="2.5" fill="#fff" stroke="none"/><path d="M26 30h10" stroke="#fff" stroke-width="3" fill="none"/>',
'<path d="M10 28q0-10 10-10h8l6 6h14q8 0 8 8v6H10z" fill="#3a8ae8"/><rect x="10" y="38" width="48" height="6" rx="2" fill="#eee"/><path d="M18 46l8 3-8 3 8 3-8 3M42 46l8 3-8 3 8 3-8 3" fill="none" stroke="#888" stroke-width="2.5"/>',
'<rect x="6" y="24" width="24" height="16" rx="6" fill="#111"/><rect x="34" y="24" width="24" height="16" rx="6" fill="#111"/><path d="M30 29h4" stroke="#111" stroke-width="3"/><path d="M10 28h8M38 28h8" stroke="#6af" stroke-width="2"/>',
'<path d="M10 22q22 12 44 0v12q-22 12-44 0z" fill="#e8523a"/><path d="M40 32l4 24H34l-2-20z" fill="#e8523a"/><path d="M14 27q18 8 36 0M14 31q18 8 36 0" stroke="#fff" fill="none" stroke-width="2"/>',
'<rect x="24" y="4" width="16" height="14" fill="#444"/><rect x="24" y="46" width="16" height="14" fill="#444"/><circle cx="32" cy="32" r="16" fill="#f4f4f4" stroke="#c9a23a" stroke-width="3"/><path d="M32 22v10l7 4" stroke="#222" stroke-width="2.5" fill="none"/>',
'<path d="M10 10q22 40 44 0" fill="none" stroke="#c9a23a" stroke-width="3"/><path d="M24 36h16l-8 20z" fill="#e23a5a"/><path d="M27 38l2 8 2-8zM33 38l2 8 2-8z" fill="#fff" stroke="none"/>',
'<circle cx="32" cy="42" r="15" fill="none" stroke="#e0b030" stroke-width="7"/><path d="M32 6l9 7-3 9H26l-3-9z" fill="#ff4a6a"/>',
'<path d="M18 22q0-14 14-14t14 14v34H18z" fill="#4a9a5a"/><rect x="22" y="34" width="20" height="14" rx="3" fill="#357a43"/><path d="M26 22h12" stroke="#c9a23a" stroke-width="3" fill="none"/>',
'<path d="M16 58V30q-2-10 6-8V12q0-4 4-4t4 4v-2q0-4 4-4t4 4v4q6-2 6 6v26l-6 12z" fill="#8a5a2a"/><rect x="16" y="50" width="26" height="8" fill="#c78b4a"/>',
'<path d="M20 6h18v26l16 8q6 3 6 10v4H14V6z" fill="#6a4a2a"/><rect x="14" y="52" width="46" height="6" fill="#333"/><rect x="20" y="6" width="18" height="6" fill="#8a6a4a"/>',
'<rect x="20" y="8" width="24" height="34" rx="2" fill="#2a2a38"/><rect x="8" y="42" width="48" height="8" rx="3" fill="#2a2a38"/><rect x="20" y="32" width="24" height="6" fill="#c8402e" stroke="none"/>',
'<circle cx="32" cy="22" r="16" fill="none" stroke="#a66b3a" stroke-width="6" stroke-dasharray="0.1 8.3"/><path d="M32 40v20M24 48h16" stroke="#e0b030" stroke-width="5" fill="none"/>',
'<path d="M32 6q-14 4-14 22v10l-6 6h40l-6-6V28q0-18-14-22z" fill="#e0b030"/><circle cx="32" cy="52" r="5" fill="#a8801c"/>',
'<path d="M8 40q0-30 24-30t24 30z" fill="#6b7a4a"/><rect x="6" y="40" width="52" height="7" rx="3" fill="#4d5a35"/><path d="M32 10v30" stroke="#4d5a35" stroke-width="3" fill="none"/>',
'<path d="M20 4l12 24L44 4z" fill="#3a8ae8"/><circle cx="32" cy="42" r="15" fill="#f2c230"/><path d="M32 33l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" fill="#c98a00" stroke="none"/>',
'<path d="M12 8h14v26q0 6 6 6t6-6V8h14v26q0 20-20 20T12 34z" fill="#d83a3a"/><rect x="12" y="8" width="14" height="10" fill="#eee"/><rect x="38" y="8" width="14" height="10" fill="#eee"/>',
'<path d="M32 50Q4 46 4 12q16 2 28 18z" fill="#f4f4f4"/><path d="M32 50Q60 46 60 12 44 14 32 30z" fill="#f4f4f4"/><path d="M14 20q8 6 14 16M50 20q-8 6-14 16" stroke="#aab" fill="none" stroke-width="1.5"/>',
'<circle cx="32" cy="36" r="22" fill="#2a6ad8"/><circle cx="32" cy="36" r="15" fill="#fff"/><circle cx="32" cy="36" r="9" fill="#5ab8ff"/><circle cx="32" cy="36" r="4" fill="#111"/><circle cx="32" cy="8" r="3" fill="none" stroke="#c9a23a" stroke-width="2.5"/>',
'<path d="M12 40V30q0-22 20-22t20 22v10" fill="none" stroke="#333" stroke-width="5"/><rect x="6" y="36" width="12" height="20" rx="5" fill="#e23a5a"/><rect x="46" y="36" width="12" height="20" rx="5" fill="#e23a5a"/>',
'<rect x="18" y="14" width="28" height="44" rx="4" fill="#f4f4f4"/><rect x="16" y="6" width="32" height="10" rx="3" fill="#3a8ae8"/><path d="M32 28v18M23 37h18" stroke="#e23a3a" stroke-width="5" fill="none"/>',
'<path d="M16 10h32l12 16-28 34L4 26z" fill="#5ad8ff"/><path d="M4 26h56M22 26l10 34 10-34M16 10l6 16 10-16 10 16 6-16" fill="none" stroke="#fff" stroke-width="1.5"/>',
'<path d="M12 8l12 4q8 6 16 0l12-4 6 16-6 4v30H18V28l-6-4z" fill="#3a5a8a"/><path d="M32 16v40" stroke="#222" stroke-width="2" fill="none"/><rect x="20" y="36" width="9" height="9" fill="#2a4468"/><rect x="35" y="36" width="9" height="9" fill="#2a4468"/>',
'<rect x="16" y="22" width="12" height="38" rx="3" fill="#d83a3a"/><rect x="34" y="22" width="12" height="38" rx="3" fill="#d83a3a"/><path d="M22 22q4-12 14-14" fill="none" stroke="#c9a" stroke-width="2.5"/><circle cx="38" cy="8" r="4" fill="#ff8a1f" stroke="#ffd54a"/><path d="M16 36h30M16 46h30" stroke="#fff" stroke-width="2" fill="none"/>',
'<g fill="#3ab85a"><circle cx="24" cy="22" r="11"/><circle cx="40" cy="22" r="11"/><circle cx="24" cy="38" r="11"/><circle cx="40" cy="38" r="11"/></g><path d="M32 40q2 12-4 20" stroke="#1a7a3a" stroke-width="3" fill="none"/>',
'<path d="M12 22h34v18q0 14-17 14T12 40z" fill="#f4f4f4"/><path d="M46 26h6q6 0 6 8t-6 8h-6" fill="none" stroke="#f4f4f4" stroke-width="4"/><rect x="12" y="22" width="34" height="6" fill="#6a3a1a" stroke="none"/><path d="M22 16q-4-6 0-10M32 16q-4-6 0-10M42 16q-4-6 0-10" stroke="#aab" fill="none" stroke-width="2"/>'];
const url=(k,i)=>'data:image/svg+xml;utf8,'+encodeURIComponent(hd+(k==='w'?W:A)[i]+'</svg>'),cache={};
const img=(k,i)=>{const id=k+i;if(!cache[id]){const m=new Image();m.src=url(k,i);cache[id]=m}return cache[id]};
const gr=W.map(()=>[32,48]);gr[4]=[34,32];gr[6]=[32,34];gr[10]=[22,42];gr[11]=[32,44];gr[14]=[26,52];gr[16]=[32,38];gr[17]=[32,40];gr[18]=[32,52];
return{W,A,img,url,gr,ori:W.map((_,i)=>i===4||i===10?'r':'u'),tag:(k,i,s,st)=>`<img src="${url(k,i)}" alt="" style="${s?`width:${s}px;height:${s}px;`:''}${st||''}">`}})();
