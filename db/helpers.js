const mongoose = require('mongoose');
const Card = require('./index').card;
const Owner = require('./index').owner;
const Game = require('./index').game;
mongoose.Promise = global.Promise;
// const db = require('./index').db;

let uri;
if (process.env.dbfilepath) {
  uri = process.env.dbfilepath;
  console.log('dbfilepath from process.env: ', dbfilepath);
}

if (process.env.MONGODB_URI) {
  uri = process.env.MONGODB_URI;
  console.log('MONGODB_URI: ', process.env.MONGODB_URI);
}

mongoose.connect(uri || 'mongodb://localhost/games', { useMongoClient: true });

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