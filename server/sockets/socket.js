const server = require('../index.js').server;

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

const emitPlayerNumber = (gameId) => {
  socket.emit(gameID, 5);
}


module.exports = { emitPlayerNumber };
