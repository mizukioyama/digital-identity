export function clearFeedback(){
  document.querySelectorAll('.control-wave').forEach(e=>e.remove());
  document.querySelectorAll('.glass-control').forEach(e=>{e.classList.remove('is-pressed');e.getAnimations().forEach(a=>a.cancel())});
  document.querySelectorAll('#profile-panel,#links-panel').forEach(e=>e.getAnimations().forEach(a=>a.cancel()));
}
export function installFeedback(moving){
  document.querySelectorAll('.tabs button,.qr-actions button,.text-link,#links a').forEach(e=>e.classList.add('glass-control'));
  function release(){document.querySelectorAll('.is-pressed').forEach(e=>e.classList.remove('is-pressed'))}
  function press(control,x,y){
    if(!moving())return;
    control.classList.add('is-pressed');
    const bounds=control.getBoundingClientRect(),wave=document.createElement('span');
    wave.className='control-wave';wave.setAttribute('aria-hidden','true');wave.style.left=(x??bounds.width/2)+'px';wave.style.top=(y??bounds.height/2)+'px';
    control.append(wave);wave.addEventListener('animationend',()=>wave.remove(),{once:true});setTimeout(()=>wave.remove(),450);
  }
  document.addEventListener('pointerdown',e=>{const c=e.target.closest('.glass-control');if(!c)return;const r=c.getBoundingClientRect();press(c,e.clientX-r.left,e.clientY-r.top)});
  for(const event of ['pointerup','pointercancel','lostpointercapture'])document.addEventListener(event,release);
  document.addEventListener('keydown',e=>{if(e.repeat||!['Enter',' '].includes(e.key))return;const c=e.target.closest('.glass-control');if(c)press(c)});
  document.addEventListener('keyup',release);addEventListener('blur',release);
}
