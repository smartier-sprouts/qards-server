'use strict';
const app = require('./app');
// const db = require('../db');
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});


const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

module.exports = app;
