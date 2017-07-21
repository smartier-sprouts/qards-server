'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { findGame, dealCards } = require('../../db/helpers');
const shuffle = require('./newDeck').shuffle;

router.route('/:gameId') 
  .get((req, res) => {
    const getGame = new Promise((resolve, reject) => {
      findGame(req.params.gameId, resolve);
    });
    getGame
    .then(game => {
      if (!game) { throw err; }
      let playerCount = game.owners.length;
      let cardsPerPlayer = req.body.cardsPerPlayer || 7;
      let deck = require('./newDeck').deck;
      shuffle(deck);
      
      for (let i = 0; i < cardsPerPlayer; i++) {
        for (let j = 0; j < playerCount; j++) {
          game.owners[j].cards.push(deck.pop());
        }
      }

      let discardDeck = {
        name: 'Discard',
        username: 'Discard',
        cards: [deck.pop()],
        turn: null
      };

      let drawDeck = {
        name: 'Draw',
        username: 'Draw',
        cards: deck,
        turn: null
      };

      game.owners.push(discardDeck);
      game.owners.push(drawDeck);
      game.open = false;

      dealCards(game._id, game, res);

    })
    .catch(err => console.log(`Error dealing cards: ${err}`));
  });


module.exports = router;
