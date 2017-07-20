'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { createGame } = require('../../db/helpers');

// see ~/db/dummyData/createGame.json for formatting
router.route('/')
  .post((req, res) => {
    console.log('Creating new game in db');
    createGame(req.body, res);
  });

module.exports = router;