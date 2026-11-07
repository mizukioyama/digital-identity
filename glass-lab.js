// Local comparison engine: actual sphere-pixel lens at the rim, simulated CSS reflection.
export function createGlassLab(glass,select,description,invalidate){
  const optic=document.createElement('canvas');optic.className='glass-optics';optic.setAttribute('aria-hidden','true');glass.prepend(optic);
  const ctx=optic.getContext('2d');let style='current',box={x:0,y:0,width:1,height:1},scale=1,lastPose=-1;
  const copy={current:'v0.2の表現。比較の基準です。',a:'透明なレンズ。縁の球体線を微細にずらし、薄い虹色の反射を重ねます。',b:'柔らかな輪郭と呼吸。文字の面を保ちながら光がゆっくり移ります。',c:'縁のレンズと有機的な呼吸を、背景球体と同じ時間で動かします。',d:'Bの呼吸に細い屈折の縁を加えます。レンズの面積・解像度・更新頻度を抑えた比較案です。'};
  function clear(){if(ctx){ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,optic.width,optic.height)}}
  function resize(){box=glass.getBoundingClientRect();scale=Math.min(devicePixelRatio||1,style==='d'?.85:1.25);const needsLens=(style==='a'||style==='c'||style==='d')&&document.body.dataset.renderQuality!=='reduced';const w=needsLens?Math.max(1,Math.floor(box.width*scale)):1,h=needsLens?Math.max(1,Math.floor(box.height*scale)):1;if(optic.width!==w||optic.height!==h){optic.width=w;optic.height=h}lastPose=-1}
  function choose(value){style=['current','a','b','c','d'].includes(value)?value:'current';glass.dataset.glass=style;select.value=style;description.textContent=copy[style];glass.style.removeProperty('--lab-radius');glass.style.removeProperty('--lab-reflection');clear();resize()}
  select.addEventListener('input',()=>{choose(select.value);invalidate()});choose('current');
  function paint(source,width,height,phase,settings,low,moving){
    if(style==='current'||!ctx)return;
    // At most 15 lens/outline updates per second; no second rAF loop.
    const hz=style==='d'?10:15,phaseRate=settings.motion==='dynamic'?.00011:.000035;
    const pose=moving?Math.floor(phase/phaseRate*hz/1000):0;
    if(pose===lastPose)return;lastPose=pose;
    const organic=style!=='a',wave=(Math.sin(phase*8.7)+.35*Math.sin(phase*13.1+.8))*(settings.organic/50);
    if(organic){const base=innerWidth<600?34:48;glass.style.setProperty('--lab-radius',`${base+wave*3}px ${base-5-wave*2}px ${base+7+wave*2}px ${base-9-wave*3}px`)}
    glass.style.setProperty('--lab-reflection',`${45+Math.sin(phase*4.1)*16}deg`);
    clear();
    if(style==='b'||low||settings.refraction===0)return; // Reduced tier keeps CSS rim; no extra Canvas resampling.
    const sw=source.width/width,sh=source.height/height,w=box.width,h=box.height;
    ctx.setTransform(scale,0,0,scale,0,0);ctx.globalAlpha=style==='d'?.36:.52;
    const band=style==='d'?24:10,edge=style==='d'?8:18,strength=(style==='a'?4.5:style==='d'?1.6:3.2)*(settings.refraction/35)*(settings.motion==='dynamic'?1.15:1);
    for(let y=0;y<h;y+=band){
      const hh=Math.min(band,h-y),offset=Math.sin(y/h*Math.PI*2+phase*.83)*strength;
      const sx=Math.max(0,box.x+offset),sy=Math.max(0,box.y+y),cw=Math.min(w,width-sx),ch=Math.min(hh,height-sy);
      if(cw>0&&ch>0){
        // D samples only the rim; A/C retain the original full-strip comparison.
        const segments=style==='d'&&y>=edge&&y+hh<=h-edge?[[0,edge],[Math.max(0,cw-edge),edge]]:[[0,cw]];
        for(const[left,len]of segments)ctx.drawImage(source,(sx+left)*sw,sy*sh,len*sw,ch*sh,left,y,len,ch);
      }
    }
    ctx.clearRect(edge,edge,Math.max(0,w-edge*2),Math.max(0,h-edge*2));ctx.globalAlpha=1;
  }
  return {resize,paint,refresh(){lastPose=-1},select:choose,get style(){return style}};
}
