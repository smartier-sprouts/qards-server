'use strict';
const express = require('express');
const router = express.Router();
const { findGame, updateGame } = require('../../db/helpers');
import isHandWinning from './gameWinningHand';

router.route('/:gameId/:playerId/:cardId')
  .get((req, res) => {
    console.log('in discard');
    const getGame = new Promise((resolve, reject) => {
      findGame(req.params.gameId, resolve);
    });
    getGame
    .then(game => {
      if (!game) { throw err; }
      let card, hand, playerName;
      for (let i = 0; i < game.owners.length; i++) {
        if (game.owners[i]._id.toString() === req.params.playerId) {
          if (game.owners[i].cards.length === 7) {
            res.status(403).send('You have already discarded this turn');
          }
          for (let j = 0; j < game.owners[i].cards.length; j++) {
            if (game.owners[i].cards[j]._id.toString() === req.params.cardId) {
              card = game.owners[i].cards.splice(j, 1)[0];
              hand = game.owners[i].cards;
              if (isWinningHand(hand)) { 
                game.complete = true;
                game.winner = game.owners[i].name;
                updateGame(req.params.gameId, game, res);
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
    })
    .catch(err => (`Error moving card: ${err}`));
  });
  


module.exports = router;
