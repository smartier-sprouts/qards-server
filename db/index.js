const knex = require('knex')(require('../knexfile'));
const db = require('bookshelf')(knex);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

db.plugin('registry');
mongoose.Promise = global.Promise;

const cardSchema = new Schema({
  desc: String,
  suit: String
});

const ownerSchema = new Schema({
  name: String,
  username: String,
  turn: Number,
  cards: [cardSchema]
});

const gameSchema = new Schema({
  type: String,
  owners: [ownerSchema]
});

const Card = mongoose.model('Card', cardSchema);
const Owner = mongoose.model('Owner', ownerSchema);
const Game = mongoose.model('Game', gameSchema);

module.exports = {
  card: Card,
  owner: Owner,
  game: Game,
  db: db
};

