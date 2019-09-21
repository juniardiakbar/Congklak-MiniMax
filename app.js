const express = require('express');
const app = express();
const congklakUtils = require("./congklakUtils");
const coreLogic = require("./coreLogic");
const alphaBetaPrunning = require("./alphaBetaPrunning");

const {
  isGameOver,
  isPlayer1OutOfMove,
  isPlayer2OutOfMove,
  getPlayer1PlayableHoles,
  getPlayer2PlayableHoles,
  getOwnScoreHoleNumber,
  getNextTurn,
  PLAYER1_SCORE_HOLE_NUMBER,
  PLAYER2_SCORE_HOLE_NUMBER,
  getEnemyScoreHoleNumber,
  isScoreHole,
  generateCongklakInitialState,
  getNextHoleNumber,
  isInOwnArea,
} = congklakUtils;

const {
  getCongklakNextState
} = coreLogic;

const {
  getChoice
} = alphaBetaPrunning;

getChoice([8,8,8,8,8,8,1,9,0,8,8,8,8,0,8,0], 2)
  .then(value => {
    console.log(value);
  });
  // getChoice(generateCongklakInitialState, 4)

// app.listen(3000, () => {
//   console.log('%s App is running at http://localhost:%d in %s mode', 3000, 'development');
//   console.log('  Press CTRL-C to stop\n');
// });