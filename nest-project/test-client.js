const { io } = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('connected to server', socket.id);
});

socket.on('disconnect', () => {
  console.log('Disconnected', socket.id);
});
