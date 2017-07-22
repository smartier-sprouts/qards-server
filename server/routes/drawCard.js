'use strict';
const express = require('express');
const router = express.Router();
const { findGame, updateGame } = require('../../db/helpers');

router.route('/:gameId/:playerId/:deckName')
  .get((req, res) => {
    console.log(req.params);
    const getGame = new Promise((resolve, reject) => {
      console.log('gameId', req.params.gameId);
      findGame(req.params.gameId, resolve);
    });
    getGame
    .then(game => {
      if (!game) { throw err; }
      let card;

      for (let i = 0; i < game.owners.length; i++) {
        if (game.owners[i]._id.toString() === req.params.playerId) {
          if (game.owners[i].cards.length > 7) { 
            res.status(403).send('You have already drawn a card this turn');
            return; 
          }
          for (let j = game.owners.length - 1; j >= 0; j--) {
            if (game.owners[j].name === req.params.deckName) {
              card = game.owners[j].cards.pop();
              game.owners[i].cards.push(card);
              break;
            }
          }
        }
      }
      updateGame(req.params.gameId, game, res);
    })
    .catch(err => (`Error moving card: ${err}`));
  });

module.exports = router;
