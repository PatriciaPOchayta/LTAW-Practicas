const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = 8000;

app.use(express.static(path.join(__dirname, 'public')));

let usersConnected = 0;

io.on('connection', (socket) => {
  usersConnected++;

  // Esperamos a que el cliente nos diga su nombre
  socket.on('new user', (username) => {
    socket.username = username;

    // ✅ Mensaje de bienvenida solo para él
    socket.emit('chat message', {
      from: 'Sistema',
      text: `👋 ¡Bienvenido, ${username}!`
    });

    // ✅ Anuncio para el resto
    socket.broadcast.emit('chat message', {
      from: 'Sistema',
      text: `🔔 ${username} se ha unido al chat.`
    });
  });

  // Comandos
  socket.on('chat message', (msg) => {
    if (msg.startsWith('/')) {
      let response = '';

      switch (msg) {
        case '/help':
          response = 'Comandos: /help /list /hello /date';
          break;
        case '/list':
          response = `👥 Usuarios conectados: ${usersConnected}`;
          break;
        case '/hello':
          response = '👋 ¡Hola!';
          break;
        case '/date':
          response = `📅 Fecha: ${new Date().toLocaleDateString()}`;
          break;
        default:
          response = '❓ Comando no reconocido';
      }

      socket.emit('chat message', {
        from: 'Sistema',
        text: response
      });
    } else {
      // Reenviar mensaje a todos
      io.emit('chat message', {
        from: socket.username || 'Anónimo',
        text: msg
      });
    }
  });

  // Cuando un usuario se desconecta
  socket.on('disconnect', () => {
    usersConnected--;
    if (socket.username) {
      socket.broadcast.emit('chat message', {
        from: 'Sistema',
        text: `❌ ${socket.username} ha salido del chat.`
      });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
