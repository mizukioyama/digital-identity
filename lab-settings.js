// Preview-only parameters. Existing v0.2 defaults and key remain untouched.
export const labDefaults={refraction:35,organic:50};
const ranges={transparency:[15,80],light:[0,100],refraction:[0,100],organic:[0,100]};
export function restoreSettings(saved,defaults){
  const result={...defaults};
  if(!saved||typeof saved!=='object'||Array.isArray(saved))return result;
  for(const[field,[min,max]]of Object.entries(ranges))if(Number.isFinite(saved[field]))result[field]=Math.max(min,Math.min(max,saved[field]));
  if(['off','subtle','dynamic'].includes(saved.motion))result.motion=saved.motion;
  return result;
}
