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
  serverEmitter.on('emitGameStart', (gameId, data) => {
      io.emit(gameId, data);
  });
});

const emitPlayerCount = function (gameId, count) {
  console.log('in emitPlayerNumber');
  serverEmitter.emit('playerJoin', gameId, {room: gameId, players: count});
};

const emitCheckDiscard = function (gameId) {
  console.log('in emitCheckDiscard');
  serverEmitter.emit('checkDiscard', gameId, {checkDiscard: true});
};

const emitCheckDiscardAndNewTurn = function (gameId) {
  console.log('in emitCheckDiscardAndNewTurn');
  serverEmitter.emit('emitCheckDiscardAndNewTurn', gameId, {newTurn: true, checkDiscard: true});
};

const emitGameStart = function (gameId) {
  serverEmitter.emit('emitGameStart', gameId, {gameStarted: true});
};





module.exports.emitPlayerCount = emitPlayerCount;
module.exports.emitCheckDiscard = emitCheckDiscard;
module.exports.emitCheckDiscardAndNewTurn = emitCheckDiscardAndNewTurn;
module.exports.emitGameStart = emitGameStart;
