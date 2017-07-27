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
  serverEmitter.on('playerJoin', (gameId, data) => {
      io.emit(gameId, data);
  });
  serverEmitter.on('checkDiscard', (gameId, data) => {
      io.emit(gameId, data);
  });
  serverEmitter.on('emitCheckDiscardAndNewTurn', (gameId, data) => {
      io.emit(gameId, data);
  });
});

const emitPlayerNumber = function (gameId) {
  console.log('in emitPlayerNumber');
  serverEmitter.emit('playerJoin', gameId, {room: gameId, players: 5});
};

const emitCheckDiscard = function (gameId) {
  console.log('in emitCheckDiscard');
  serverEmitter.emit('checkDiscard', gameId, {checkDiscard: true});
};

const emitCheckDiscardAndNewTurn = function (gameId) {
  console.log('in emitCheckDiscardAndNewTurn');
  serverEmitter.emit('emitCheckDiscardAndNewTurn', gameId, {newTurn: true, checkDiscard: true});
};



module.exports.emitPlayerNumber = emitPlayerNumber;
module.exports.emitCheckDiscard = emitPlayerNumber;
module.exports.emitCheckDiscardAndNewTurn = emitPlayerNumber;
