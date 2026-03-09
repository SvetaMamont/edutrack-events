import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

import { PORT, DATA_FILE } from './config.js';
import { logRequest } from './logger.js';

const server = http.createServer(async (req, res) => {

  logRequest(req);

  res.setHeader('Content-Type', 'application/json');

  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/api/events' && req.method === 'GET') {

    try {

      const data = await readFile(DATA_FILE, 'utf-8');

      res.statusCode = 200;
      res.end(data);

    } catch (error) {

      res.statusCode = 500;
      res.end(JSON.stringify({
        error: "Помилка сервера"
      }));

    }

  } else {

    res.statusCode = 404;
    res.end(JSON.stringify({
      error: "Маршрут не знайдено"
    }));

  }

});

server.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}/api/events`);
});

