const EventEmitter = require('events').EventEmitter;
const server = require('../index.js').server;

const io = require('socket.io').listen(server);
const serverEmitter = require('../index.js').serverEmitter;

// io.on('connection', (socket) => {
//   console.log('Client connected');
//   socket.on('disconnect', () => console.log('Client disconnected'));
//
//   socket.emit('test', { hello: 'world' });
//
//
//   socket.on('create', function(room) {
//     console.log('new player joins');
//     socket.join(room);
//     io.to(room, 'a new user has joined the room');
//   });
//   serverEmitter.on('playerJoin', function (data) {
//    socket.emit(data);
//  });
// });
//
// setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

const emitPlayerNumber = (gameId) => {

  serverEmitter.emit('playerJoin', {room: gameId, players: 5});

};


module.exports = { emitPlayerNumber };
