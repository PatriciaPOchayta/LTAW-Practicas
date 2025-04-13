const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let connectedUsers = 0;

app.use(express.static('public'));

io.on('connection', (socket) => {
  connectedUsers++;

  socket.emit('chat message', { from: 'Sistema', text: '🎉 Bienvenido al chat!' });
  socket.broadcast.emit('chat message', { from: 'Sistema', text: '🔔 Un nuevo usuario se ha conectado.' });

  socket.on('chat message', (data) => {
    const msg = data.text.trim();
    const username = data.user || 'Anónimo';

    if (msg.startsWith('/')) {
      let response = '';
      switch (msg) {
        case '/help':
          response = '🛠 Comandos: /help, /list, /hello, /date, /hour';
          break;
        case '/list':
          response = `👥 Usuarios conectados: ${connectedUsers}`;
          break;
        case '/hello':
          response = '👋 ¡Hola! Bienvenido al servidor.';
          break;
        case '/date':
          response = `📅 Fecha actual: ${new Date().toLocaleDateString()}`;
          break;
        case '/hour':
          response = `⏰ Hora actual: ${new Date().toLocaleTimeString()}`;
          break;
        default:
          response = '❌ Comando no reconocido. Escribe /help para ver los comandos disponibles.';
      }
      socket.emit('chat message', { from: 'Sistema', text: response });
    } else {
      io.emit('chat message', { from: username, text: msg });
    }
  });

  socket.on('disconnect', () => {
    connectedUsers--;
    io.emit('chat message', { from: 'Sistema', text: '❌ Un usuario se ha desconectado.' });
  });
});

server.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});
