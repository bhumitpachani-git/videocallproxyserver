const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

const app = express();

const proxy = createProxyMiddleware({
  target: 'http://18.188.251.4:3000', 
  changeOrigin: true,                
  ws: true,                         
  logLevel: 'info',                  
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    if (!res.headersSent) {
      res.status(502).send('Bad Gateway - Cannot reach backend');
    }
  }
});

app.use(proxy);

const server = http.createServer(app);

server.on('upgrade', proxy.upgrade);

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding all traffic to http://18.188.251.4:3000`);
});