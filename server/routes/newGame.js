'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../../db/helpers');

router.route('/')
  .post((req, res) => {
    console.log('Saving new game to db');
    db.saveGame(req.body, res);
  });

module.exports = router;