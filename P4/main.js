const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const os = require('os');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

let mainWindow;
let connectedUsers = {};
let io;

// 🔌 Obtener IP local
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface of Object.values(interfaces)) {
    for (let config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        return config.address;
      }
    }
  }
  return 'localhost';
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // opcional
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));

  mainWindow.webContents.once('did-finish-load', () => {
    mainWindow.webContents.send('system-info', {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron,
      ip: getLocalIP(),
      port: 3000
    });
  });
}

app.whenReady().then(() => {
  createWindow();
  startServer();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

function startServer() {
  const expressApp = express();
  const server = http.createServer(expressApp);
  io = socketIo(server);

  expressApp.use(express.static(path.join(__dirname, 'public')));

  io.on('connection', (socket) => {
    let userName = '';

    socket.on('new user', (name) => {
      userName = name || 'Anónimo';
      connectedUsers[socket.id] = userName;

      socket.emit('chat message', { from: 'Sistema', text: `🎉 ¡Bienvenido, ${userName}!` });
      socket.broadcast.emit('chat message', { from: 'Sistema', text: `👤 ${userName} se ha unido al chat.` });

      io.emit('user list', Object.values(connectedUsers));

      // Notificar al renderizador
      mainWindow.webContents.send('server-log', `👤 ${userName} se ha unido al chat.`);
    });

    socket.on('chat message', (msg) => {
      const messageText = msg?.text;
      if (typeof messageText === 'string') {
        io.emit('chat message', { from: userName, text: messageText });
        mainWindow.webContents.send('server-log', `💬 ${userName}: ${messageText}`);
      }
    });

    socket.on('disconnect', () => {
      delete connectedUsers[socket.id];
      io.emit('chat message', { from: 'Sistema', text: `👤 ${userName} ha salido del chat.` });
      io.emit('user list', Object.values(connectedUsers));
      mainWindow.webContents.send('server-log', `❌ ${userName} ha salido del chat.`);
    });
  });

  // Escuchar el botón del renderer
  ipcMain.on('send-test-message', () => {
    io.emit('chat message', { from: 'Sistema', text: '📢 Este es un mensaje de prueba desde el servidor.' });
    mainWindow.webContents.send('server-log', `📢 Enviado mensaje de prueba a los clientes.`);
  });

  server.listen(3000, () => {
    console.log(`Servidor escuchando en http://${getLocalIP()}:3000`);
  });
}
