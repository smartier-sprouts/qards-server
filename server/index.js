'use strict';
const EventEmitter = require('events');
const app = require('./app');

// const db = require('../db');
const PORT = process.env.PORT || 3000;

const server =  app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

const io = require('socket.io').listen(server);
const serverEmitter = new EventEmitter();


io.sockets.on('connection', (socket) => {
  console.log('client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  serverEmitter.on('playerJoin', (data) => {
      io.emit('playerJoin', {players : 5});
  });
});

setInterval(() =>( serverEmitter.emit('playerJoin','yo'), 2000 ))
//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

module.exports = server;
