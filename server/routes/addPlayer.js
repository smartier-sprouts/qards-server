'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { addPlayer } = require('../../db/helpers');

router.route('/')
  .post((req, res) => {
    let gameId = req.body.gameId;
    let player = req.body.player;
    console.log('Adding player to db');
    addPlayer(gameId, player, res);
  });

module.exports = router;