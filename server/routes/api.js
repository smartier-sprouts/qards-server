'use strict';
const express = require('express');
const router = express.Router();
const { findFilteredGames, findGame, createGame, addPlayer, dealCards, updateGame, drawCard } = require('../../db/helpers');
const { isHandWinning } = require('./isHandWinning');
const { shuffle } = require('./newDeck');
const { emitPlayerNumber } = require('../index.js');


router.route('/')
  .get((req, res) => {
    res.status(200).send('Hello World!');
  })
  .post((req, res) => {
    console.log('in the correct route');
    res.status(201).send({ data: 'Posted!' });
  });


router.route('/games')
  .get((req, res) => {
    findFilteredGames({open: true, public: true}, res);
  });


router.route('/createGame')
  .post((req, res) => {
    console.log('Creating new game in db');
    createGame(req.body, res);
  });


router.route('/addPlayer')
  .post((req, res) => {
    let gameId = req.body.gameId;
    let player = req.body.player;
    const getGame = new Promise((resolve, reject) => {
      findGame(gameId, resolve);
    })
    .then(game => {
      console.log('Adding player to db');
      player.turn = game.owners.length;
      addPlayer(gameId, player, res);
      emitPlayerNumber(gameId);
    })
    .catch(err => console.log(`Error adding player: ${err}`));
  });


router.route('/dealCards/:gameId')
  .get((req, res) => {
    const getGame = new Promise((resolve, reject) => {
      findGame(req.params.gameId, resolve);
    })
    .then(game => {
      if (!game) { throw err; }
      let playerCount = game.owners.length;
      let cardsPerPlayer = req.body.cardsPerPlayer || 7;
      let deck = require('./newDeck').deck.slice();
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
      game.turnNum = 0;
      dealCards(game._id, game, res);

    })
    .catch(err => console.log(`Error dealing cards: ${err}`));
  });

router.route('/hasStarted/:gameId')
  .get((req, res) => {
    let gameId = req.params.gameId;
    const getGame = new Promise((resolve, reject) => {
      findGame(gameId, resolve);
    })
    .then(game => {
      res.status(200).send(!game.open);
    });
  });


router.route('/getHand/:gameId/:playerId')
  .get((req, res) => {
    let gameId = req.params.gameId;
    const getGame = new Promise((resolve, reject) => {
      findGame(gameId, resolve);
    })
    .then(game => {
      let playerId = req.params.playerId;
      for (let i = 0; i < game.owners.length; i++) {
        if (game.owners[i]._id.toString() === playerId) {
          res.status(200).send({discard: game.owners[game.owners.length - 2].cards[0], hand: game.owners[i].cards});
          return;
        }
      }
    });
  });


router.route('/drawCard/:gameId/:playerId/:deckName')
  .get((req, res) => {
    const getGame = new Promise((resolve, reject) => {
      console.log('gameId', req.params.gameId);
      findGame(req.params.gameId, resolve);
    })
    .then(game => {
      if (!game) { throw err; }
      let card;
      let discardIndex = game.owners.length - 2;
      let drawIndex = game.owners.length - 1;

      console.log('deckName is', req.params.deckName);

      for (let i = 0; i < game.owners.length; i++) {
        if (game.owners[i]._id.toString() === req.params.playerId) {
          if (game.owners[i].cards.length > 7) {
            res.status(403).send('You have already drawn a card this turn');
            return;
          } else {
            if (req.params.deckName === 'Draw') {
              card = game.owners[drawIndex].cards.pop();
              game.owners[i].cards.push(card);
              console.log(`Draw pile now has ${game.owners[drawIndex].cards.length} cards in its pile.`);
              console.log(`Discard pile now has ${game.owners[discardIndex].cards.length} cards in its pile.`);
              if (game.owners[drawIndex].cards.length === 0) {
                console.log('Player just removed the last card from the deck. Pulling cards from discard pile and shuffling…');
                game.owners[drawIndex].cards = game.owners[discardIndex].cards.splice(0, game.owners[discardIndex].cards.length - 2);
                console.log('All cards except top removed from discard deck');
                shuffle(game.owners[drawIndex].cards);
                console.log('Shuffled');
                break;
              }
              console.log(`Draw deck now has ${game.owners[drawIndex].cards.length} cards in it.`);
            } else {
              card = game.owners[discardIndex].cards.pop();
              game.owners[i].cards.push(card);
            }
          }
        }
      }
      drawCard(req.params.gameId, card, game, res);
    })
    .catch(err => (`Error moving card: ${err}`));
  });


router.route('/discard/:gameId/:playerId/:cardId')
  .get((req, res) => {
    const getGame = new Promise((resolve, reject) => {
      findGame(req.params.gameId, resolve);
    })
    .then(game => {
      if (!game) { throw err; }
      let card, hand, playerName;
      game.turnNum = (game.turnNum === game.owners.length - 3) ? 0 : ++game.turnNum;
      for (let i = 0; i < game.owners.length; i++) {
        if (game.owners[i]._id.toString() === req.params.playerId) {
          if (game.owners[i].cards.length === 7) {
            res.status(403).send('You have already discarded this turn');
          } else {
            for (let j = 0; j < game.owners[i].cards.length; j++) {
              if (game.owners[i].cards[j]._id.toString() === req.params.cardId) {
                card = game.owners[i].cards.splice(j, 1)[0];
                if (isHandWinning(game.owners[i].cards)) {
                  game.complete = true;
                  game.winner = game.owners[i].name;
                  updateGame(req.params.gameId, game, res);
                  return;
                } else {
                  console.log('hand did not win');
                  break;
                }
              }
            }
          }
        }
      }

      for (let i = game.owners.length - 1; i > 0; i--) {
        if (game.owners[i].name === 'Discard') {
          game.owners[i].cards.push(card);
          break;
        }
      }
      updateGame(req.params.gameId, game, res);
      return;
    })
    .catch(err => (`Error moving card: ${err}`));
  });


router.route('/discardChange/:gameId')
  .get((req, res) => {
    const getGame = new Promise((resolve, reject) => {
      findGame(req.params.gameId, resolve);
    })
    .then(game => {
      if (!game) { console.log('could not find game'); }
      let discardDeckIndex = game.owners.length - 2;
      let lastDiscard = game.owners[discardDeckIndex].cards.length - 1;
      let activePlayerName;
      console.log(`turn number is ${game.turnNum}`);
      game.owners.forEach(player => {
        if (player.turn === game.turnNum) {
          activePlayerName = player.name;
        }
      });

      res.status(200).send({
        winner: game.winner,
        turnNum: game.turnNum,
        activePlayerName: activePlayerName,
        topOfDiscard: game.owners[discardDeckIndex].cards[lastDiscard]
      });

    })
    .catch(err => {
      console.log(`error getting top discard: ${err}`);
      res.status(404).send('Player not found');
    });
  });

module.exports = router;
