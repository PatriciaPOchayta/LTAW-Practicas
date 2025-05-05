const { ipcRenderer } = require('electron');

// Recibir info del sistema desde main.js
ipcRenderer.on('system-info', (event, data) => {
  document.getElementById('node-version').textContent = data.node;
  document.getElementById('electron-version').textContent = data.electron;
  document.getElementById('chrome-version').textContent = data.chrome;
  document.getElementById('server-url').textContent = `http://${data.ip}:${data.port}`;
});

// Recibir mensajes del servidor
ipcRenderer.on('server-log', (event, message) => {
  const log = document.getElementById('log');
  const li = document.createElement('li');
  li.textContent = message;
  log.appendChild(li);
  log.scrollTop = log.scrollHeight;
});

// Enviar mensaje de prueba al main
document.getElementById('test-button').addEventListener('click', () => {
  ipcRenderer.send('send-test-message');
});
