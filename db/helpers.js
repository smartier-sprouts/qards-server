const mongoose = require('mongoose');
const Card = require('./index').card;
const Owner = require('./index').owner;
const Game = require('./index').game;
mongoose.Promise = global.Promise;
// const db = require('./index').db;

let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/games';

mongoose.connect(MONGODB_URI, { useMongoClient: true });

const saveGame = (data, res) => {
  const game = new Game(data).save()
  .catch(err => console.log('Error saving game:', err))
  .then(game => {
    console.log('Game saved:', game);
    res.status(201).send(game._id);
  });
};

const findGame = (data, res) => {
  Game.find(data)
  .catch(err => console.log('Error finding game: ', err))
  .then(game => {
    console.log('Game found:', game);
    res.status(200).send(game);
  });
};

const updateGame = (id, gameData, res) => {
  Game.findByIdAndUpdate(id, {"owners": gameData.owners}, {"new": true})
  .catch(err => console.log('Error updating and returning game', err))
  .then(game => {
    console.log(`Game ${id} updated`);
    res.status(200).send(game);
  });
};

module.exports = {
  saveGame: saveGame,
  findGame: findGame,
  updateGame: updateGame
};