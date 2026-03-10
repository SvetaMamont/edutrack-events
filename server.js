import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

import { PORT, DATA_FILE } from './config.js';
import { logRequest } from './logger.js';

const server = http.createServer(async (req, res) => {

  logRequest(req);

  const url = new URL(req.url, `http://${req.headers.host}`);

  try {

    // API EVENTS
    if (url.pathname === '/api/events' && req.method === 'GET') {

      const data = await readFile(DATA_FILE, 'utf-8');

      res.setHeader('Content-Type', 'application/json');
      res.statusCode = 200;
      res.end(data);

      return;
    }

    // ГОЛОВНА СТОРІНКА
    if (url.pathname === '/' && req.method === 'GET') {

      const html = await readFile('./index.html', 'utf-8');

      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.end(html);

      return;
    }

    // 404
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: "Маршрут не знайдено"
    }));

  } catch (error) {

    // 500
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: "Помилка сервера"
    }));

  }

});

server.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});