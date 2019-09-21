exports.PLAYER1_SCORE_HOLE_NUMBER = 7;
exports.PLAYER2_SCORE_HOLE_NUMBER = 15;

exports.HOLE_NUMBER_TO_OPPOSITE_HOLE_NUMBER = {
  0: 14,
  1: 13,
  2: 12,
  3: 11,
  4: 10,
  5: 9,
  6: 8,

  8: 6,
  9: 5,
  10: 4,
  11: 3,
  12: 2,
  13: 1,
  14: 0
};

exports.PLAYER1_PLAYABLE_HOLE_NUMBERS = [0, 1, 2, 3, 4, 5, 6];
exports.PLAYER2_PLAYABLE_HOLE_NUMBERS = [8, 9, 10, 11, 12, 13, 14];

exports.isInOwnArea = (holeNumber, turn) =>
  holeNumber >= (turn - 1) * 8 && holeNumber < turn * 8 - 1;

exports.getNextHoleNumber = holeNumber => (holeNumber + 1) % 16;
exports.generateCongklakInitialState = () => {
  // return [3, 1, 2, 0, 0, 0, 0, 50, 0, 0, 0, 10, 1, 0, 0, 31];
  return [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
};

exports.getPlayer1PlayableHoles = congklakState =>
  congklakState.filter((_, i) => i >= 0 && i < 7);
exports.getPlayer2PlayableHoles = congklakState =>
  congklakState.filter((_, i) => i >= 8 && i < 15);

exports.getNextTurn = currentTurn => (currentTurn % 2) + 1;
exports.getOwnScoreHoleNumber = currentTurn => currentTurn * 8 - 1;
exports.getEnemyScoreHoleNumber = currentTurn =>
  exports.getNextTurn(currentTurn) * 8 - 1;

exports.isScoreHole = holeNumber =>
  holeNumber === PLAYER1_SCORE_HOLE_NUMBER ||
  holeNumber === PLAYER2_SCORE_HOLE_NUMBER;

exports.getOppositeHoleNumber = holeNumber =>
  holeNumber === exports.PLAYER1_SCORE_HOLE_NUMBER ||
  holeNumber === exports.PLAYER2_SCORE_HOLE_NUMBER
    ? -1
    : exports.HOLE_NUMBER_TO_OPPOSITE_HOLE_NUMBER[holeNumber];

exports.isPlayer1OutOfMove = congklakState =>
  exports.getPlayer1PlayableHoles(congklakState).filter(val => val > 0).length === 0;

exports.isPlayer2OutOfMove = congklakState =>
  exports.getPlayer2PlayableHoles(congklakState).filter(val => val > 0).length === 0;

exports.isGameOver = congklakState =>
  isPlayer1OutOfMove(congklakState) && isPlayer2OutOfMove(congklakState);

exports.getEndOfGameMessage = congklakState => {
  if (
    congklakState[PLAYER1_SCORE_HOLE_NUMBER] ===
    congklakState[PLAYER2_PLAYABLE_HOLE_NUMBERS]
  ) {
    return "Draw";
  } else if (
    congklakState[PLAYER1_SCORE_HOLE_NUMBER] >
    congklakState[PLAYER2_SCORE_HOLE_NUMBER]
  ) {
    return "Player wins!";
  } else {
    return "Congklak.AI wins!";
  }
}

exports.hashCongklakState = (depthLimit, congklakState) => {
  let str = `${depthLimit},`;
  for (let element of congklakState) {
    str = str + " " + element;
  }
  return str;
}
