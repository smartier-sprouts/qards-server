'use strict';
const app = require('./app');
// const db = require('../db');
const PORT = process.env.PORT || 3000;

const server =  app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

// var server = require('http').createServer(app);
const io = require('socket.io').listen(server);
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));

  socket.on('create', function(room) {
    console.log('new player joins');
    socket.join(room);
    io.to(room, 'a new user has joined the room');
  });

});
//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

module.exports.server = server;
