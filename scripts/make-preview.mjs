// npm run preview:file  ->  dirwa-showroom-preview.html (one file: open it anywhere, no server needed)
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

execSync('npx vite build --config vite.preview.config.js', { stdio: 'inherit' });
const dir = 'dist-preview';
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const js = fs.readFileSync(path.join(dir, html.match(/src="\/(assets\/[^"]+\.js)"/)[1]), 'utf8');
const cssMatch = html.match(/href="\/(assets\/[^"]+\.css)"/);
const css = cssMatch ? fs.readFileSync(path.join(dir, cssMatch[1]), 'utf8') : '';

const assets = {};
const b64 = (f, mime) => `data:${mime};base64,` + fs.readFileSync(f).toString('base64');
for (const f of fs.readdirSync('public/models')) assets['/models/' + f] = b64('public/models/' + f, 'model/gltf-binary');
for (const f of fs.readdirSync('public/products/thumbs')) {
  const uri = b64('public/products/thumbs/' + f, 'image/webp');
  assets['/products/thumbs/' + f] = uri;
  assets['/products/' + f] = uri; // large photos fall back to the thumbnail in this preview
}
const patch = `(function(){var A=window.__DIRWA_ASSETS||{};var d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
function m(u){try{var p=new URL(u,location.href).pathname;return A[p]||u}catch(e){return u}}
Object.defineProperty(HTMLImageElement.prototype,'src',{get:d.get,set:function(v){d.set.call(this,m(v))},configurable:true});
var sa=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(this instanceof HTMLImageElement&&n==='src')v=m(v);return sa.call(this,n,v)};})();`;

// Use function replacements: the bundled code contains $& and $' sequences, which a plain string
// replacement would expand and corrupt.
const safe = (code) => code.replace(/<\/script/gi, '<\\/script');
html = html
  .replace(/<link rel="modulepreload"[^>]*>/g, '')
  .replace(/<link rel="stylesheet"[^>]*assets\/[^>]*>/g, '')
  .replace(/<script type="module"[^>]*src="[^"]*"[^>]*><\/script>/g, '')
  .replace(/<link rel="icon"[^>]*>/g, '')
  .replace('</head>', () => `<style>${css}</style>\n</head>`)
  .replace('</body>', () => `<script>window.__DIRWA_ASSETS=${safe(JSON.stringify(assets))};</script>\n<script>${patch}</script>\n<script type="module">${safe(js)}</script>\n</body>`);
fs.writeFileSync('dirwa-showroom-preview.html', html);
console.log('Wrote dirwa-showroom-preview.html', (fs.statSync('dirwa-showroom-preview.html').size / 1048576).toFixed(1) + ' MB');
