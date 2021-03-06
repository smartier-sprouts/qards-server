const mongoose = require('mongoose');
const { card: Card, owner: Owner, game: Game } = require('./index');
const socketLogic = require('../server/index.js');
const config = require('config');
// const { Card, Owner, Game } = require('./index');
// import { Card, Owner, Game } from './index.js';
const MONGODB_URI = process.env.MONGODB_URI || config.DBHost || 'mongodb://localhost/games';
mongoose.Promise = global.Promise;

console.log('MongoDB uri is', MONGODB_URI);
mongoose.connect(MONGODB_URI, { useMongoClient: true });

const findGame = (id, resolve) => {
  Game.findById(id)
  .catch(err => console.log('Error finding game:', err))
  .then(game => {
    resolve(game);
  });
};

const findAllGames = (res) => {
  Game.find({})
  .catch(err => console.log('Error finding game:', err))
  .then(games => {
    res.status(200).send(games);
  });
};

const findFilteredGames = (filter, res) => {
  Game.find(filter)
  .catch(err => console.log('Error finding game:', err))
  .then(games => {
    console.log('Games found:', games);
    res.status(200).send(games);
  });
};

const createGame = (data, res) => {
  const game = new Game(data).save()
  .catch(err => console.log('Error saving game:', err))
  .then(game => {
    console.log('Game saved:', game);
    game.key = game._id;
    game.save((err, data) => {
      if (err) { return `Error: ${err}`; }
      console.log(`key prop added to game: ${data.key}`);
    });
    res.status(201).send({gameId: game._id, player: game.owners[0]});
  });
};

const addPlayer = (gameId, player, res) => {
  let owner = new Owner(player);
  console.log(`Player data: ${player}`);
  Game.findByIdAndUpdate(gameId, {'$push': {'owners': player} }, {'new': true})
  .catch(err => console.log('Error adding player to existing game:', err))
  .then(game => {
    let playerId = game.owners[game.owners.length - 1]._id;
    res.status(200).send({gameId: game._id, player: game.owners[game.owners.length - 1]});
    socketLogic.emitPlayerCount(gameId, game.owners.length);
  });
};

const dealCards = (gameId, data, res) => {
  Game.findByIdAndUpdate(gameId, data, {'new': true})
  .catch(err => console.log('Error updating and returning game', err))
  .then(game => {
    res.status(200).send('Cards dealt');
    socketLogic.emitGameStart(gameId);
  });
};

const updateGame = (id, data, res) => {
  Game.findByIdAndUpdate(id, data, {'new': true})
  .catch(err => console.log('Error updating and returning game', err))
  .then(game => {
    console.log(`Game ${id} updated`);
    res.status(200).send(game);
    socketLogic.emitCheckDiscardAndNewTurn(id);
  });
};

const drawCard = (id, card, data, res) => {
  Game.findByIdAndUpdate(id, data, {'new': true})
  .catch(err => console.log('Error updating and returning game', err))
  .then(game => {
    console.log(`Game ${id} updated`);
    res.status(200).send(card);
    socketLogic.emitCheckDiscard(id);
  });
};

module.exports = {
  findGame: findGame,
  findAllGames: findAllGames,
  findFilteredGames: findFilteredGames,
  createGame: createGame,
  addPlayer: addPlayer,
  dealCards: dealCards,
  updateGame: updateGame,
  drawCard: drawCard
};
