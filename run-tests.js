#!/usr/bin/env node
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001;
const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css' };

// Start server
const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
  const ext = path.extname(filePath);
  try {
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'text/plain' });
    res.end(fs.readFileSync(filePath));
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Server ready on ${PORT}`);
  
  // Run playwright
  const pw = spawn('npx', ['playwright', 'test', 'tests/italian.spec.js', '--project=chromium', '--reporter=list'], {
    cwd: __dirname,
    stdio: 'inherit'
  });
  
  pw.on('close', (code) => {
    console.log('Tests finished, code:', code);
    server.close();
    process.exit(code);
  });
});