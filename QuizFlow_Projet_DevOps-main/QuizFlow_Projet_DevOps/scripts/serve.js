const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const port = Number(process.env.PORT || 3000);
const types = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8'};
http.createServer((req,res) => {
  const url = new URL(req.url, 'http://localhost');
  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '') || 'index.html';
  const filepath = path.resolve(root, relative);
  if (filepath !== root && !filepath.startsWith(root + path.sep)) {res.writeHead(403); return res.end('Forbidden');}
  fs.readFile(filepath, (err, data) => {
    if (err) {res.writeHead(404); return res.end('Not found');}
    res.writeHead(200, {'Content-Type':types[path.extname(filepath)] || 'application/octet-stream','X-Content-Type-Options':'nosniff'});
    res.end(data);
  });
}).listen(port, '0.0.0.0', () => console.log(`QuizFlow: http://localhost:${port}`));
