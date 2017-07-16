'use strict';
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const db = require('../../db/helpers');

router.route('/updateGame:id')
  .post((req, res) => {
    console.log(`Updating game id ${req.params.id} in the db`);
    db.updateGame(req.params.id, req.gameData, res);
  });

module.exports = router;