'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { findAllGames } = require('../../db/helpers');

router.route('/')
  .get((req, res) => {
    findAllGames(res);
  });

module.exports = router;