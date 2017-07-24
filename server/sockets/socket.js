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
  console.log('emiting player number to ', gameId);
  io.emit(gameId, {player: 5});
  setInterval(()=> {
    io.emit(gameId, {player: 5});
  },1000);
}


module.exports = { emitPlayerNumber };
