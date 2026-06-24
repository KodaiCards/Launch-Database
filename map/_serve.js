// Tiny static server for previewing the map foundation locally. Not part of the
// app build — just lets the preview tool render map/*.html. Pure Node, no deps.
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const PORT = 4599;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/fiber_route_manager_v33.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log('map preview on http://localhost:' + PORT));
