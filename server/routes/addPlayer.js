'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { findGame, addPlayer } = require('../../db/helpers');

router.route('/')
  .post((req, res) => {
    let gameId = req.body.gameId;
    let player = req.body.player;
    const getGame = new Promise((resolve, reject) => {
      findGame(gameId, resolve);
    });
    getGame
    .then(game => {
      console.log('Adding player to db');
      player.turn = game.owners.length;
      addPlayer(gameId, player, res);
    })
    .catch(err => console.log(`Error adding player: ${err}`));
  });

module.exports = router;