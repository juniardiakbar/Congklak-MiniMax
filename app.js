const express = require('express');
const app = express();
const congklakUtils = require("./congklakUtils");
const coreLogic = require("./coreLogic");
const alphaBetaPrunning = require("./alphaBetaPrunning");

const {
  getChoice
} = alphaBetaPrunning;

let state = [0, 0, 0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0, 0, 1, 50];
console.log(getChoice(state, 2));

// app.listen(3000, () => {
//   console.log('%s App is running at http://localhost:%d in %s mode', 3000, 'development');
//   console.log('  Press CTRL-C to stop\n');
// });