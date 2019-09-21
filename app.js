const express = require('express');
const app = express();
const congklakUtils = require("./congklakUtils");
const coreLogic = require("./coreLogic");
const alphaBetaPrunning = require("./alphaBetaPrunning");

console.log(PLAYER1_HOME_NUMBER);

app.listen(3000, () => {
  console.log('%s App is running at http://localhost:%d in %s mode', 3000, 'development');
  console.log('  Press CTRL-C to stop\n');
});