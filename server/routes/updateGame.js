'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../../db/helpers');

router.route('/:id')
  .post((req, res) => {
    console.log(`Updating game id ${req.params.id} in the db`);
    console.log('req.body game data', req.body);
    db.updateGame(req.params.id, req.body, res);
  });

module.exports = router;