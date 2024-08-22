import React from 'react';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { App } from './App.tsx';

const app = express();
const port = 3333;

// 렌더링된 결과를 저장할 캐시 객체
const renderCache = new Map();

app.get('*', (req, res) => {
  const url = req.url;

  // 캐시에 해당 URL의 렌더링 결과가 있는지 확인
  if (renderCache.has(url)) {
    console.log(`Serving from cache for ${url}`);
    return res.send(renderCache.get(url));
  }

  // 캐시에 없으면 새로 렌더링
  const app = ReactDOMServer.renderToString(<App url={url} />);

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Simple SSR</title>
    </head>
    <body>
      <div id="root">${app}</div>
    </body>
    </html>
  `;

  // 렌더링 결과를 캐시에 저장
  renderCache.set(url, html);

  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
