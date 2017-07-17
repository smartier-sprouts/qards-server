'use strict';
const app = require('./app');
// const db = require('../db');

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${PORT}!`);
});
