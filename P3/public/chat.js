const socket = io();
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const usernameInput = document.getElementById('username');
const notifySound = document.getElementById('notify');

socket.on('chat message', (data) => {
  const item = document.createElement('li');
  item.classList.add(data.from === 'Sistema' ? 'system' : 'user');
  item.innerHTML = `<strong>${data.from}:</strong> ${data.text}`;
  messages.appendChild(item);
  notifySound.play();
  window.scrollTo(0, document.body.scrollHeight);
});

input.addEventListener('keypress', function (e) {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    const msg = input.value;
    const user = usernameInput.value.trim() || 'Anónimo';
    socket.emit('chat message', { text: msg, user });
    input.value = '';
  }
});
