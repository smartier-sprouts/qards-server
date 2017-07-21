'use strict';
const express = require('express');
const router = express.Router();
const { findGame, updateGame } = require('../../db/helpers');

router.route('/:gameId/:playerId/:drawDeckId')
  .get((req, res) => {
    console.log(req.params);
    const getGame = new Promise((resolve, reject) => {
      console.log('gameId', req.params.gameId);
      findGame(req.params.gameId, resolve);
    });
    getGame
    .then(game => {
      if (!game) { throw err; }
      console.log('game passed back to route', game);
      let card;

      for (let i = 0; i < game.owners.length; i++) {
        if (game.owners[i]._id.toString() === req.params.playerId) {
          console.log('found right player deck to insert draw card');
          if (game.owners[i].cards.length > 7) { 
            res.status(403).send('You have already drawn a card this turn');
            return; 
          }
          for (let j = game.owners.length - 1; j >= 0; j--) {
            if (game.owners[j]._id.toString() === req.params.drawDeckId) {
              console.log('found right draw deck');
              card = game.owners[j].cards.pop();
              console.log(`drew ${card} from deck ${req.params.drawDeckId}`);
              game.owners[i].cards.push(card);
              console.log(`${card} inserted into deck ${req.params.playerId}`);
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
