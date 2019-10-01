export const PLAYER1_HOME_HOLE_NUMBER = 7;
export const PLAYER2_HOME_HOLE_NUMBER = 15;
export const PLAYER1_HOLE_NUMBERS = [0, 1, 2, 3, 4, 5, 6];
export const PLAYER2_HOLE_NUMBERS = [8, 9, 10, 11, 12, 13, 14];
export const OPPOSITE_HOLE_NUMBER = function(holeNumber) {
  return 14-holeNumber;
};

export const isInOwnArea = function(holeNumber, turn) {
  return holeNumber >= (turn - 1) * 8 && holeNumber < turn * 8 - 1;
}

export const getNextHoleNumber = function(holeNumber) {
  return (holeNumber + 1) % 16;
}

export const generateCongklakInitialState = function() {
  return [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
};

export const getPlayer1PlayableHoles = function(congklakState) {
  return congklakState.filter((_, i) => PLAYER1_HOLE_NUMBERS.includes(i));
}

export const getPlayer2PlayableHoles = function(congklakState) {
  return congklakState.filter((_, i) => PLAYER2_HOLE_NUMBERS.includes(i));
}

export const getNextTurn = function(currentTurn) {
  return (currentTurn % 2) + 1;
}
export const getOwnScoreHoleNumber = function(currentTurn) {
  return currentTurn * 8 - 1;
}

export const getEnemyScoreHoleNumber = function(currentTurn) {
  return getNextTurn(currentTurn) * 8 - 1;
}

export const isScoreHole = function(holeNumber) {
  return holeNumber === PLAYER1_HOME_HOLE_NUMBER ||
  holeNumber === PLAYER2_HOME_HOLE_NUMBER;
}

export const getOppositeHoleNumber = function(holeNumber) {
  holeNumber === PLAYER1_HOME_HOLE_NUMBER ||
  holeNumber === PLAYER2_HOME_HOLE_NUMBER
    ? -1
    : OPPOSITE_HOLE_NUMBER(holeNumber);
}

export const isPlayer1OutOfMove = function(congklakState) {
  getPlayer1PlayableHoles(congklakState).filter(val => val > 0).length === 0;
}

export const isPlayer2OutOfMove = function(congklakState) {
  getPlayer2PlayableHoles(congklakState).filter(val => val > 0).length === 0;
}