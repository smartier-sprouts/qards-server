'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { updateGame } = require('../../db/helpers');

router.route('/:gameId')
  .post((req, res) => {
    console.log('Updating game data after dealing');
    updateGame(req.params.gameId, req.body, res);
  });

module.exports = router;