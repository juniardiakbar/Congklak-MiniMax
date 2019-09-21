const express = require('express');
const app = express();
const {
  PLAYER1_HOME_NUMBER,
  PLAYER2_HOME_NUMBER
} = require("./congklakUtils");

console.log(PLAYER1_HOME_NUMBER);

app.listen(3000, () => {
  console.log('%s App is running at http://localhost:%d in %s mode', 3000, 'development');
  console.log('  Press CTRL-C to stop\n');
});