'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { findFilteredGames } = require('../../db/helpers');

router.route('/')
  .get((req, res) => {
    findFilteredGames({open: true, public: true}, res);
  });

module.exports = router;