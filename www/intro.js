(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const d=document.createElement('div');d.id='intro';
const L=(p,c='')=>`<path class="ln ${c}" pathLength="1" d="${p}"/>`;
const keys=[0,1,2].flatMap(r=>[0,1,2].map(c=>`<rect class="key" x="${72+c*17}" y="${124+r*16}" width="11" height="11" rx="2.5" style="animation-delay:${1.55+(r*3+c)*.05}s${r==2&&c==2?';fill:#3b82ff':''}"/>`)).join('');
d.innerHTML=`<canvas></canvas><div class="st"><i class="ring2"></i><i class="ring2 b"></i><svg viewBox="0 0 200 200">
<g class="bal"><path d="M82 8l40-3 4 52H82z" fill="#ffd21a"/><path class="ck" pathLength="1" d="M94 30l9 9 17-19"/></g>
<rect class="scr" x="62" y="84" width="76" height="34" rx="4"/>
<g class="flag"><rect x="68" y="88" width="64" height="26" rx="2" fill="#19a64e"/><path d="M100 90l26 11-26 11-26-11z" fill="#ffdf00"/><circle cx="100" cy="101" r="7" fill="#1d4fd6"/></g>
${L('M64 64h72l10 10v100H54V74z','gl')}${L('M52 70q0-8 8-8h80q8 0 8 8')}${keys}
</svg><div class="sc"></div><div class="yr">2026</div></div><div class="nm">Braresults</div>`;
document.body.append(d);
const c=d.querySelector('canvas'),g=c.getContext('2d'),W=c.width=innerWidth*Math.min(devicePixelRatio,1.5),H=c.height=innerHeight*Math.min(devicePixelRatio,1.5),k=Math.min(devicePixelRatio,1.5),cl=['#19e06b','#ffdf00','#3b82ff','#fff'];
const P=Array.from({length:70},(_,i)=>{const a=Math.random()*6.283,s=2+Math.random()*7;return{x:W/2,y:H*.44,vx:Math.cos(a)*s*k,vy:Math.sin(a)*s*k,r:(1+Math.random()*2.5)*k,c:cl[i%4],l:1}});
const f0=performance.now();(function f(n){const t=n-f0;if(!d.isConnected)return;g.clearRect(0,0,W,H);
if(t<2000){for(let i=0;i<2;i++){const a=Math.random()*6.283,r=Math.max(W,H)*.5;g.fillStyle=cl[i];g.globalAlpha=.5;g.beginPath();g.arc(W/2+Math.cos(a)*r*(1-t/2000),H*.44+Math.sin(a)*r*(1-t/2000),2*k,0,7);g.fill()}}
else P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.96;p.vy=p.vy*.96+.06*k;p.l-=.012;if(p.l<=0)return;g.globalAlpha=p.l;g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()});
requestAnimationFrame(f)})(f0);
let done=0;const end=()=>{if(done)return;done=1;d.classList.add('out');setTimeout(()=>d.remove(),900)};
d.addEventListener('click',end);setTimeout(end,3700);navigator.vibrate&&setTimeout(()=>navigator.vibrate(25),2000);
})();
