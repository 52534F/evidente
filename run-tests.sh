#!/bin/bash
cd "$(dirname "$0")"

# Kill any existing server on 3001
pkill -f "node.*3001" 2>/dev/null || true
sleep 1

# Start server in background
node -e '
const http = require("http");
const fs = require("fs");
const path = require("path");
const mime = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css" };
const s = http.createServer((r,q)=>{
  let f = path.join(".", r.url==="/"?"index.html":r.url);
  try { q.writeHead(200,{"Content-Type":mime[path.extname(f)]||"text/plain"}); q.end(fs.readFileSync(f)); }
  catch { q.writeHead(404); q.end("Not found"); }
});
s.listen(3001,()=>console.log("READY"));
setTimeout(()=>process.exit(0), 60000);
' &

SERVER_PID=$!
sleep 2

# Run tests
npx playwright test tests/italian.spec.js --project=chromium --reporter=list "$@"
EXIT_CODE=$?

# Cleanup
kill $SERVER_PID 2>/dev/null || true
pkill -f "node.*3001" 2>/dev/null || true

exit $EXIT_CODE