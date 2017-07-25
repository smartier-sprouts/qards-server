'use strict';
const app = require('./app');
// const db = require('../db');
const PORT = process.env.PORT || 3000;

const server =  app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});

// var server = require('http').createServer(app);

//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

module.exports = server;
