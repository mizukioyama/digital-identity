// Preview-only experience. ?lab=1 restores developer controls; ?motion=off tests static use.
export const developerMode=false; // GUI stays disabled throughout this background study.
export const experience={
  settings:{transparency:52,light:45,motion:'subtle',refraction:0,organic:45},
  phaseRate:.000075,
  full:{steps:80,latitudes:24,meridians:10,dpr:1.4},
  low:{steps:56,latitudes:16,meridians:7,dpr:1}
};
export const staticMode=new URLSearchParams(location.search).get('motion')==='off';
