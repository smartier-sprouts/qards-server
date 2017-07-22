const knex = require('knex')(require('../knexfile'));
const db = require('bookshelf')(knex);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

db.plugin('registry');
mongoose.Promise = global.Promise;

const cardSchema = new Schema({
  desc: String,
  suit: String,
  pictureId: Number,
  value: Number
});

const ownerSchema = new Schema({
  name: String,
  username: String,
  turn: Number,
  cards: [cardSchema]
});

const gameSchema = new Schema({
  type: String,
  name: String,
  open: Boolean,
  complete: Boolean,
  winner: String,
  public: Boolean,
  owners: [ownerSchema]
});

const Card = mongoose.model('Card', cardSchema);
const Owner = mongoose.model('Owner', ownerSchema);
const Game = mongoose.model('Game', gameSchema);

// export default { Card, Owner, Game };

module.exports = {
  card: Card, 
  owner: Owner, 
  game: Game
};