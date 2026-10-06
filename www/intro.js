(()=>{if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
const d=document.createElement('div');d.id='intro';
d.innerHTML='<canvas></canvas><div class="st"><img class="gw" src="logo.webp" alt=""><img class="gm" src="logo.webp" alt=""><i class="rg"></i><i class="rg b"></i><i class="rg c"></i></div><div class="nm">Braresults</div><div class="yr">ELEIÇÕES 2026</div>';
document.body.append(d);
const c=d.querySelector('canvas'),g=c.getContext('2d'),k=Math.min(devicePixelRatio,1.5),W=c.width=innerWidth*k,H=c.height=innerHeight*k,cl=['#2bff4a','#00e5ff','#f4ff2a','#ffb21a'],cy=H*.44;
const P=Array.from({length:80},(_,i)=>{const a=Math.random()*6.283,s=2+Math.random()*7;return{x:W/2,y:cy,vx:Math.cos(a)*s*k,vy:Math.sin(a)*s*k,r:(1+Math.random()*2.5)*k,c:cl[i%4],l:1}});
let f0=0;
(function f(n){if(!d.isConnected)return;if(!f0)f0=n;const t=n-f0;g.clearRect(0,0,W,H);
if(d.classList.contains('go')){
if(t<1750){for(let i=0;i<2;i++){const a=Math.random()*6.283,r=Math.max(W,H)*.55*(1-t/1750)+W*.12;g.fillStyle=cl[(i+(t/200|0))%4];g.globalAlpha=.55;g.beginPath();g.arc(W/2+Math.cos(a)*r,cy+Math.sin(a)*r,2*k,0,7);g.fill()}}
else P.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vx*=.96;p.vy=p.vy*.96+.06*k;p.l-=.012;if(p.l<=0)return;g.globalAlpha=p.l;g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,p.r,0,7);g.fill()})}
requestAnimationFrame(f)})(performance.now());
let done=0,t0=0;const end=()=>{if(done)return;done=1;d.classList.add('out');setTimeout(()=>d.remove(),900)};
const go=()=>{if(t0)return;t0=1;d.classList.add('go');setTimeout(end,3900);navigator.vibrate&&setTimeout(()=>navigator.vibrate(25),1750)};
const im=d.querySelector('.gm');(im.decode?im.decode():Promise.reject()).then(go,go);setTimeout(go,500);
d.addEventListener('click',end);
})();
