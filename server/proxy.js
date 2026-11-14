import http from 'http';
import https from 'https';
import { URL } from 'url';

const PORT = process.env.PING_PROXY_PORT || 3001;

/**
 * Lightweight DevDeck Health-Check Proxy Server
 * Used optionally by developers to ping internal microservices or URLs
 * without triggering browser CORS restrictions.
 */
const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://localhost:${PORT}`);

  if (reqUrl.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'devdeck-proxy', uptime: process.uptime() }));
    return;
  }

  if (reqUrl.pathname === '/ping') {
    const targetUrl = reqUrl.searchParams.get('url');
    if (!targetUrl) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Missing ?url= query parameter' }));
      return;
    }

    try {
      const parsedTarget = new URL(targetUrl);
      const client = parsedTarget.protocol === 'https:' ? https : http;
      const startTime = Date.now();

      const proxyReq = client.get(targetUrl, { timeout: 8000 }, (targetRes) => {
        const latency = Date.now() - startTime;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            url: targetUrl,
            statusCode: targetRes.statusCode,
            latency,
            status: (targetRes.statusCode >= 200 && targetRes.statusCode < 400) ? 'healthy' : 'degraded',
          })
        );
      });

      proxyReq.on('timeout', () => {
        proxyReq.destroy();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: targetUrl, statusCode: 504, latency: 8000, status: 'down' }));
      });

      proxyReq.on('error', (err) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ url: targetUrl, statusCode: 500, error: err.message, status: 'down', latency: 0 }));
      });
    } catch (err) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid URL provided', details: err.message }));
    }
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`[DevDeck Proxy] Health check & ping daemon listening on http://localhost:${PORT}`);
});

