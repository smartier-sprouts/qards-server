'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { findGame } = require('../../db/helpers');

router.route('/:gameId/:playerId')
  .get((req, res) => {
    let gameId = req.params.gameId;
    const getGame = new Promise((resolve, reject) => {
      findGame(gameId, resolve);
    });
    getGame
    .then(game => {
      let playerId = req.params.playerId;
      console.log('Getting hand for playerId');
      for (let i = 0; i < game.owners.length; i++) {
        console.log('current id:', game.owners[i]._id, 'static id:', playerId);
        if (game.owners[i]._id.toString() === playerId) {
          console.log('********', game.owners[i].cards);
          res.status(200).send(game.owners[i].cards);
          return;
        }
      }
      res.status(501).send('Did not locate player');
    });
  });

module.exports = router;