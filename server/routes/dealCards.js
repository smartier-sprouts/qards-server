'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
//const deck = require('./cards').deck;
const { findGame, dealCards } = require('../../db/helpers');

class Deck {
  constructor() {
    this.descs = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.suits = ['♥', '♣', '♦', '♠'];
    let cards = [];

    for (let suit = 0; suit < this.suits.length; suit++ ) {
      for (let desc = 0; desc < this.descs.length; desc++ ) {
        cards.push({value: desc + 1, desc: this.descs[desc], suit: this.suits[suit]});
      }
    }

    return cards;
  }
}

const shuffle = (deck) => {
  let temp = null;

  for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
};


router.route('/:gameId') 
  .get((req, response) => {
    const getGame = new Promise((resolve, reject) => {
      findGame(req.params.gameId, resolve);
    });
    getGame
    .then(game => {
      if (!game) { throw err; }
      let playerCount = game.owners.length;
      let hands = {};
      let cardsPerPlayer = req.body.cardsPerPlayer || 7;
      let deck = new Deck;
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

      dealCards(game._id, game, response);

    })
    .catch(err => console.log(`Error dealing cards: ${err}`));
  });


module.exports = router;

/*
{
  gameId:
  playerIds: []
};


*/