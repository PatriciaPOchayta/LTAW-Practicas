const socket = io();
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const notifySound = document.getElementById('notify');
const typingIndicator = document.getElementById('typing-indicator');
const userList = document.getElementById('user-list');

socket.on('chat message', (data) => {
  const item = document.createElement('li');
  item.classList.add(data.from === 'Sistema' ? 'system' : 'user');
  item.innerHTML = `<strong>${data.from}:</strong> ${data.text}`;
  messages.appendChild(item);
  notifySound.play();
  window.scrollTo(0, document.body.scrollHeight);
});

socket.on('user list', (users) => {
  userList.innerHTML = `Usuarios conectados: ${users.join(', ')}`; // Mostrar usuarios conectados
});

socket.on('typing', (user) => {
  typingIndicator.textContent = `${user} está escribiendo...`;
  setTimeout(() => {
    typingIndicator.textContent = '';
  }, 2000);
});

input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const msg = input.value;
    const user = usernameInput.value.trim() || 'Anónimo';
    socket.emit('chat message', { text: msg, user });
    socket.emit('typing', user); // Enviar evento de "escribiendo"
    input.value = '';
  } else {
    const user = usernameInput.value.trim() || 'Anónimo';
    socket.emit('typing', user); // Enviar evento de "escribiendo"
  }
});

// Cuando el usuario introduce un nombre, lo enviamos al servidor para agregarlo como usuario
usernameInput.addEventListener('blur', () => {
  const name = usernameInput.value.trim();
  if (name) {
    socket.emit('new user', name);
  }
});
