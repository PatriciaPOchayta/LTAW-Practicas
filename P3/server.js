const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let connectedUsers = 0;

app.use(express.static('public'));

io.on('connection', (socket) => {
    connectedUsers++;

    // Mensaje de bienvenida (sólo para el nuevo usuario)
    socket.emit('chat message', '🎉 ¡Bienvenido al chat!');

    // Anuncio para el resto de usuarios
    socket.broadcast.emit('chat message', '👤 Un nuevo usuario se ha conectado.');

    // Escuchar mensajes del cliente
    socket.on('chat message', (msg) => {
        if (msg.startsWith('/')) {
            // Comando
            let response = '';
            switch (msg.trim()) {
                case '/help':
                    response = '🛠 Comandos disponibles: /help, /list, /hello, /date';
                    break;
                case '/list':
                    response = `👥 Usuarios conectados: ${connectedUsers}`;
                    break;
                case '/hello':
                    response = '👋 ¡Hola! ¿Cómo estás?';
                    break;
                case '/date':
                    response = `📅 Fecha actual: ${new Date().toLocaleString()}`;
                    break;
                default:
                    response = '❌ Comando no reconocido. Usa /help para ver los disponibles.';
            }
            socket.emit('chat message', response);
        } else {
            // Mensaje normal, reenviar a todos
            io.emit('chat message', msg);
        }
    });

    // Usuario se desconecta
    socket.on('disconnect', () => {
        connectedUsers--;
        io.emit('chat message', '👤 Un usuario se ha desconectado.');
    });
});

http.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
