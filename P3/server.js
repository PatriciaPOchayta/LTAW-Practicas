const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let connectedUsers = {}; // Usaremos un objeto para guardar el nombre de usuario y su socket ID

app.use(express.static('public'));

io.on('connection', (socket) => {
    let userName = '';

    // Nuevo usuario
    socket.on('new user', (name) => {
        userName = name || 'Anónimo';
        connectedUsers[socket.id] = userName;

        // Mensaje de bienvenida (sólo para el nuevo usuario)
        socket.emit('chat message', { from: 'Sistema', text: `🎉 ¡Bienvenido, ${userName}!` });

        // Anuncio para el resto de usuarios
        socket.broadcast.emit('chat message', { from: 'Sistema', text: `👤 ${userName} se ha unido al chat.` });

        // Enviar la lista de usuarios conectados
        io.emit('user list', Object.values(connectedUsers));
    });

    // Mensajes del chat
    socket.on('chat message', (msg) => {
        // Asegurarse de que msg.text existe y es un string
        const messageText = msg?.text;

        if (typeof messageText === 'string' && messageText.startsWith('/')) {
            // Comando
            let response = '';
            switch (messageText.trim()) {
                case '/help':
                    response = '🛠 Comandos disponibles: /help, /list, /hello, /date';
                    break;
                case '/list':
                    response = `👥 Usuarios conectados: ${Object.keys(connectedUsers).length}`;
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
            socket.emit('chat message', { from: 'Sistema', text: response });
        } else if (typeof messageText === 'string') {
            // Mensaje normal, reenviar a todos
            io.emit('chat message', { from: userName, text: messageText });
        }
    });

    // Usuario se desconecta
    socket.on('disconnect', () => {
        delete connectedUsers[socket.id];
        io.emit('chat message', { from: 'Sistema', text: `👤 ${userName} ha salido del chat.` });
        io.emit('user list', Object.values(connectedUsers)); // Actualizar la lista de usuarios
    });
});

http.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
