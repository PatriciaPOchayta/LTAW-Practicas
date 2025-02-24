const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;

const server = http.createServer((req, res) => {
  let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
  let extname = path.extname(filePath);
  let contentType = 'text/html';

  switch (extname) {
    case '.css':
      contentType = 'text/css';
      break;
    case '.js':
      contentType = 'text/javascript';
      break;
    case '.jpg':
    case '.jpeg':
    case '.png':
      contentType = 'image/jpeg';
      break;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(__dirname, 'error.html'), (error, errorContent) => {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(errorContent, 'utf-8');
      });
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
