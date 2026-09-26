import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
    const relative = path.relative(root, file);
    if (relative.startsWith('..') || relative.split(path.sep).some(p => p.startsWith('.')) || !['index.html', 'style.css', 'app.js', 'catch.js', 'birthday-gate.js', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png'].includes(relative) && !relative.startsWith('assets' + path.sep)) {
      res.writeHead(403).end('Forbidden'); return;
    }
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff' });
    res.end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(process.env.PORT || 3000, '127.0.0.1', () => console.log(`Your little world is at http://localhost:${process.env.PORT || 3000}`));
