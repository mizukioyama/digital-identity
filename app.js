import {developerMode,experience,staticMode} from './experience-config.js';
import {installFeedback,clearFeedback} from './experience-ui.js';
import {createGlassLab} from './glass-lab.js';
import {content,defaults as baseDefaults} from './content.js';
import {labDefaults,restoreSettings} from './lab-settings.js';
const defaults={...baseDefaults,...labDefaults,...(developerMode?{}:experience.settings),...(staticMode?{motion:"off"}:{})};
document.body.classList.toggle("experience",!developerMode);
document.querySelector("#settings-open").hidden=!developerMode;
document.querySelector("#settings").hidden=!developerMode;
import {validateProfileUrl} from './url-config.js';
const $=id=>document.getElementById(id), key='digital-identity-v03-preview', reduced=matchMedia('(prefers-reduced-motion: reduce)');
let settings={...defaults}, tilt=false, sensorSeen=false, timer, frame=0, previous=0, phase=0, onScreen=true, suspended=false;
if(developerMode)try{settings=restoreSettings(JSON.parse(localStorage.getItem(key)),defaults)}catch{}
$('name').textContent=content.name;$('jp').textContent=content.japaneseName;$('role').textContent=content.role;
content.sections.forEach(item=>{
  const section=document.createElement('section'),heading=document.createElement('h2'),label=document.createElement('span');
  section.className='profile-section';heading.id='profile-'+item.id+'-heading';section.setAttribute('aria-labelledby',heading.id);
  heading.textContent=item.title;label.textContent=item.subtitle;heading.append(label);section.append(heading);
  item.paragraphs.forEach(text=>{const p=document.createElement('p');p.textContent=text;section.append(p)});
  $('bio').append(section);
});
const scrollPanel=document.querySelector('.panel-scroll');
let profileScroll=0,scrollUpdate=0;
function updateScrollEdges(){
  cancelAnimationFrame(scrollUpdate);
  scrollUpdate=requestAnimationFrame(()=>{
    const max=scrollPanel.scrollHeight-scrollPanel.clientHeight;
    scrollPanel.dataset.above=String(scrollPanel.scrollTop>2);
    scrollPanel.dataset.below=String(max-scrollPanel.scrollTop>2);
  });
}
scrollPanel.addEventListener('scroll',updateScrollEdges,{passive:true});
new ResizeObserver(updateScrollEdges).observe(scrollPanel);
new ResizeObserver(updateScrollEdges).observe($('bio'));
content.links.forEach(link=>{const url=new URL(link.url);if(url.protocol!=='https:')return;const a=document.createElement('a'),wrap=document.createElement('span'),small=document.createElement('small'),arrow=document.createElement('span');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';wrap.textContent=link.title;small.textContent=link.detail;arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');wrap.append(small);a.append(wrap,arrow);$('links').append(a)});
function status(text){$('status').textContent=text;clearTimeout(timer);timer=setTimeout(()=>$('status').textContent='',3500)}
function selectTab(id,focus=false){if(!$('profile-panel').hidden)profileScroll=scrollPanel.scrollTop;['profile','links'].forEach(name=>{const active=name===id;$(name+'-tab').setAttribute('aria-selected',String(active));$(name+'-tab').tabIndex=active?0:-1;$(name+'-panel').hidden=!active;if(active){if(developerMode){$(name+'-panel').classList.remove('enter');void $(name+'-panel').offsetWidth;$(name+'-panel').classList.add('enter')}else{const panel=$(name+'-panel');panel.getAnimations().forEach(a=>a.cancel());if(moving())panel.animate([{opacity:0,transform:'translateX(6px)'},{opacity:1,transform:'translateX(0)'}],{duration:180,easing:'ease-out'})}if(focus)$(name+'-tab').focus()}});scrollPanel.scrollTop=id==='profile'?profileScroll:0;updateScrollEdges()}
['profile','links'].forEach(name=>{$(name+'-tab').onclick=()=>selectTab(name);$(name+'-tab').onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();selectTab(e.key==='Home'?'profile':e.key==='End'?'links':name==='profile'?'links':'profile',true)}}});
function route(){const qr=location.hash==='#qr';$('qr-screen').hidden=!qr;$('profile-screen').hidden=qr;document.title=(qr?'QR':'Mizuki Oyama')+' — Digital Identity';document.documentElement.style.setProperty('--tilt','0deg')}
addEventListener('hashchange',route);route();
let target=new URL('./#profile',location.href).href;let published=false;
try{if(content.publicProfileUrl){const u=validateProfileUrl(content.publicProfileUrl);target=u.href;published=true}}catch{status('正式公開URLの設定を確認してください')}
$('qr-notice').textContent=published?'プロフィールを開く / Scan with your camera':'LOCAL PREVIEW — 公開URL未設定。同じ端末での確認用です。';
const localPreview=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
if(!published&&!localPreview){$('qr-notice').textContent='正式公開URLの設定待ちです。QRは公開準備が完了してから有効になります。';$('copy').disabled=true;$('tilt').disabled=true;}
try{if(!published&&!localPreview)throw Error();const qr=qrcode(0,'M');qr.addData(target);qr.make();$('qr').innerHTML=qr.createSvgTag({cellSize:6,margin:24,scalable:true});$('qr').querySelector('svg').setAttribute('role','img');$('qr').querySelector('svg').setAttribute('aria-label','プロフィールURL: '+target)}catch{$('qr').textContent=(!published&&!localPreview)?'QR — 公開準備中':'QRを生成できません。URL設定とライブラリを確認してください。'}
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText(target);status(published?'URLをコピーしました':'ローカル確認用URLをコピーしました')}catch{status('コピーできませんでした。ブラウザの権限を確認してください')}};
const dialog=$('settings');$('settings-open').onclick=()=>{if(developerMode)dialog.showModal()};$('settings-close').onclick=()=>dialog.close();dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
function glassRipplesClear(){document.querySelectorAll('.glass .ripple').forEach(node=>node.remove())}
function visiblePage(){return !document.hidden&&onScreen&&!suspended}
function moving(){return settings.motion!=='off'&&!reduced.matches&&visiblePage()}
function apply(save=false){document.documentElement.style.setProperty('--glass-alpha',String(1-settings.transparency/100));document.documentElement.style.setProperty('--light',String(settings.light/100));document.documentElement.style.setProperty('--duration',settings.motion==='dynamic'?'10s':'18s');document.body.classList.toggle('still',!moving());for(const field of ['transparency','motion','light','refraction','organic'])$(field).value=settings[field];$('transparency-value').textContent=settings.transparency+'%';$('light-value').textContent=settings.light+'%';$('refraction-value').textContent=settings.refraction+'%';$('organic-value').textContent=settings.organic+'%';lab.refresh();if(!moving()){stopTilt();glassRipplesClear();clearFeedback()}if(save&&developerMode)try{localStorage.setItem(key,JSON.stringify(settings));$('storage-notice').textContent=''}catch{$('storage-notice').textContent='このブラウザでは設定を保存できません。'}restart()}
for(const field of ['transparency','motion','light','refraction','organic'])$(field).addEventListener('input',()=>{settings[field]=field==='motion'?$(field).value:Number($(field).value);apply(true)});
$('reset').onclick=()=>{settings={...defaults};lab.select('current');apply(true);status('初期設定に戻しました')};reduced.addEventListener('change',()=>apply());document.addEventListener('visibilitychange',()=>apply());
function stopTilt(){tilt=false;removeEventListener('deviceorientation',orientation);$('tilt').textContent='傾き連動をON';$('tilt').setAttribute('aria-pressed','false');document.documentElement.style.setProperty('--tilt','0deg')}
function orientation(e){if(!tilt||!moving()||e.gamma===null||!Number.isFinite(e.gamma))return;sensorSeen=true;if(glass.dataset.glass!=='current')glass.style.setProperty('--x',Math.max(10,Math.min(90,50+e.gamma))+'%');document.documentElement.style.setProperty('--tilt',Math.max(-6,Math.min(6,e.gamma/5))+'deg')}
$('tilt').onclick=async()=>{if(tilt){stopTilt();return}if(!moving()){status('動きを有効にすると傾き連動を利用できます');return}if(!window.DeviceOrientationEvent){status('この端末では静止表示を使用します');return}try{if(typeof DeviceOrientationEvent.requestPermission==='function'&&await DeviceOrientationEvent.requestPermission()!=='granted'){status('許可されていないため静止表示を使用します');return}tilt=true;sensorSeen=false;addEventListener('deviceorientation',orientation);$('tilt').textContent='傾き連動をOFF';$('tilt').setAttribute('aria-pressed','true');setTimeout(()=>{if(tilt&&!sensorSeen){stopTilt();status('センサーを取得できないため静止表示を使用します')}},2500)}catch{stopTilt();status('センサーを利用できないため静止表示を使用します')}};
const glass=document.querySelector('.glass');
const lab=createGlassLab(glass,$('glass-style'),$('glass-description'),()=>{resize();restart()});
if(!developerMode){lab.select('b');installFeedback(moving)}
glass.addEventListener('pointermove',e=>{if(e.pointerType!=='mouse'||!moving())return;const r=glass.getBoundingClientRect();glass.style.setProperty('--x',(e.clientX-r.left)/r.width*100+'%');glass.style.setProperty('--y',(e.clientY-r.top)/r.height*100+'%')});glass.addEventListener('pointerdown',e=>{if(!moving()||e.target.closest('#qr-frame')||(!developerMode&&e.target.closest('.glass-control,.panel-scroll')))return;const r=glass.getBoundingClientRect();if(lab.style!=='current'){glass.style.setProperty('--x',(e.clientX-r.left)/r.width*100+'%');glass.style.setProperty('--y',(e.clientY-r.top)/r.height*100+'%')}const dot=document.createElement('span');dot.className='ripple';dot.style.left=e.clientX-r.left-10+'px';dot.style.top=e.clientY-r.top-10+'px';glass.append(dot);dot.addEventListener('animationend',()=>dot.remove(),{once:true})});
const canvas=$('sphere'),ctx=canvas.getContext('2d');let width=0,height=0;
const low=(navigator.hardwareConcurrency||4)<=4||(navigator.deviceMemory||8)<=4;
// Cache angles that do not vary with time; preserve the original curve counts and DPR.
const quality=low?experience.low:experience.full;
const sphereSteps=developerMode?(low?72:96):quality.steps, sphereQuarter=sphereSteps/4;
const samples=Array.from({length:sphereSteps+1},(_,i)=>{
  const t=i/sphereSteps*Math.PI*2;
  return {ct:Math.cos(t),st:Math.sin(t),s2:Math.sin(t*2),c2:Math.cos(t*2),s3:Math.sin(t*3),c3:Math.cos(t*3),s5:Math.sin(t*5),c5:Math.cos(t*5)};
});
const curves=[];
for(let family=0;family<2;family++){
  const count=developerMode?(family?(low?8:12):(low?18:28)):(family?quality.meridians:quality.latitudes);
  for(let j=0;j<count;j++){
    const angle=family?j/count*Math.PI:(j/count-.5)*Math.PI;
    curves.push({family,j,cos:Math.cos(angle),sin:Math.sin(angle)});
  }
}
document.body.dataset.renderQuality=low?'reduced':'full';
function resize(){
  width=innerWidth;height=window.visualViewport?.height||innerHeight;
  const cssHeight=height+'px';
  if(document.documentElement.style.getPropertyValue('--viewport-height')!==cssHeight)document.documentElement.style.setProperty('--viewport-height',cssHeight);
  const dpr=Math.min(devicePixelRatio||1,developerMode?(low?1.3:1.8):quality.dpr),pixelWidth=Math.floor(width*dpr),pixelHeight=Math.floor(height*dpr);
  if(canvas.width!==pixelWidth||canvas.height!==pixelHeight){canvas.width=pixelWidth;canvas.height=pixelHeight;ctx?.setTransform(dpr,0,0,dpr,0,0)}
  lab.resize();restart();
}
function draw(now){
  frame=0;if(!ctx||!visiblePage()){previous=0;return}
  const elapsed=previous?Math.min(now-previous,80):0;previous=now;
  if(moving())phase+=elapsed*(developerMode?(settings.motion==='dynamic'?.00011:.000035):experience.phaseRate);
  ctx.clearRect(0,0,width,height);
  const radius=Math.min(width*.65,height*.44,405)*(1+(developerMode?.012:.024)*Math.sin(phase*(developerMode?.83:2.1))+.008*Math.sin(phase*(developerMode?.39:3.7)));
  const cx=width*(.58+(developerMode?0:.018*Math.sin(phase*1.7))),cy=height*(.48+(developerMode?0:.012*Math.sin(phase*2.3))),light=settings.light/100+(developerMode?0:.045*Math.sin(phase*4.4));
  const yaw=phase+.13*Math.sin(phase*.37),pitch=.57+.12*Math.sin(phase*.61);
  const cosYaw=Math.cos(yaw),sinYaw=Math.sin(yaw),cosPitch=Math.cos(pitch),sinPitch=Math.sin(pitch);
  const glow=ctx.createLinearGradient(cx-radius,cy-radius,cx+radius,cy+radius);
  glow.addColorStop(0,`rgba(131,95,173,${.24+light*.30})`);
  glow.addColorStop(.48,`rgba(72,119,164,${.22+light*.32})`);
  glow.addColorStop(1,`rgba(183,123,91,${.18+light*.28})`);
  ctx.strokeStyle=glow;
  for(const curve of curves){
    const a=phase*1.37+curve.j*.3,b=-phase*.71+curve.j*.7,c=phase*.53+curve.j*.4;
    const sa=Math.sin(a),ca=Math.cos(a),sb=Math.sin(b),cb=Math.cos(b),sc=Math.sin(c),cc=Math.cos(c);
    const rCos=radius*curve.cos,rSin=radius*curve.sin;
    const life=(lab.style==='b'||lab.style==='c'||lab.style==='d')?(developerMode?.009:.018)*(settings.organic/50)*Math.sin(phase*8.7+curve.j*.51):0;
    for(let arc=0;arc<4;arc++){
      ctx.beginPath();let depth=0;
      for(let k=0;k<=sphereQuarter;k++){
        const t=samples[arc*sphereQuarter+k];
        // Angle-addition identities remove repeated per-vertex trigonometry.
        const wobble=1+life*t.c2+.015*(t.s3*ca+t.c3*sa)+.008*(t.c5*cb-t.s5*sb);
        const x=rCos*t.ct*wobble;
        const y=(curve.family?radius*t.st:rSin)+.016*radius*(t.s2*cc+t.c2*sc);
        const z=curve.family?rSin*t.ct:rCos*t.st;
        const rx=x*cosYaw-z*sinYaw,rz=x*sinYaw+z*cosYaw;
        const py=y*cosPitch-rz*sinPitch,pz=y*sinPitch+rz*cosPitch;
        depth+=pz/radius;
        if(k===0)ctx.moveTo(cx+rx,cy+py);else ctx.lineTo(cx+rx,cy+py);
      }
      const front=(depth/(sphereQuarter+1)+1)/2;
      const depthWeight=lab.style==='current'?Math.max(0,front):Math.pow(Math.max(0,front),1.35);
      ctx.globalAlpha=.23+depthWeight*.65;ctx.lineWidth=.55+depthWeight*.36;ctx.stroke();
    }
  }
  ctx.globalAlpha=1;
  if(developerMode)lab.paint(canvas,width,height,phase,settings,low,moving());
  if(moving())frame=requestAnimationFrame(draw);
}
function restart(){if(!visiblePage()){if(frame)cancelAnimationFrame(frame);frame=0;previous=0;return}if(moving()&&frame)return;if(frame)cancelAnimationFrame(frame);previous=0;frame=requestAnimationFrame(draw)}
new IntersectionObserver(entries=>{const next=entries[0].isIntersecting;if(next!==onScreen){onScreen=next;apply()}},{threshold:0}).observe(canvas);
addEventListener('pagehide',()=>{suspended=true;apply()});addEventListener('pageshow',()=>{suspended=false;apply()});
addEventListener('resize',resize);window.visualViewport?.addEventListener('resize',resize);resize();apply();updateScrollEdges();
