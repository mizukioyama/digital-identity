import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,relative,isAbsolute,extname} from 'node:path';
const root=fileURLToPath(new URL('.',import.meta.url));
const port=Number(process.env.PORT || 4177);
const base=process.env.PREVIEW_BASE || '/';
if(!base.startsWith('/') || !base.endsWith('/')) throw new Error('PREVIEW_BASE must start/end with /');
createServer(async(req,res)=>{try{
  const path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(!path.startsWith(base))throw Error();
  const local=path.slice(base.length),file=resolve(root,local+(path.endsWith('/')?'index.html':''));
  const rel=relative(root,file);
  if(rel.startsWith('..') || isAbsolute(rel) || rel.split('/').some(p=>p.startsWith('.') && p!=='.nojekyll'))throw Error();
  const data=await readFile(file);
  res.writeHead(200,{'Content-Type':({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'})[extname(file)]||'text/plain','Cache-Control':'no-store'});res.end(data);
}catch{res.writeHead(404);res.end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}${base}`));
