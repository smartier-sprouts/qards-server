'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
// const { getHand } = require('../../db/helpers');

router.route('/:gameId/:playerId')
  .get((req, res) => {
    let gameId = req.params.gameId;
    let playerId = req.params.playerId;
    const getGame = new Promise((resolve, reject) => {
      findGame(gameId, resolve);
    });
    getGame
    .then(game => {
      console.log('Adding player to db');
      for (let i = 0; i < game.owners.length; i++) {
        if (game.owners[i]._id === playerId) {
          res.status(200).send(game.owners[i].cards);
          return;
        }
      }
      res.status(501).send('Did not locate player');
    });
  });

module.exports = router;