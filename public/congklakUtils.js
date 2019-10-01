/**
 * Konstanta lubang pada congklak
 */

export const PLAYER1_HOME_HOLE_NUMBER = 7;
export const PLAYER2_HOME_HOLE_NUMBER = 15;
export const PLAYER1_HOLE_NUMBERS = [0, 1, 2, 3, 4, 5, 6];
export const PLAYER2_HOLE_NUMBERS = [8, 9, 10, 11, 12, 13, 14];

/**
 * Fungsi-fungsi helper pada permainan congklak
 */

export const getOpposite = (holeNumber) => 14-holeNumber;

export const isInOwnArea = (holeNumber, turn) => {
  if (turn == 1) {
    return PLAYER1_HOLE_NUMBERS.includes(holeNumber);
  } else {
    return PLAYER2_HOLE_NUMBERS.includes(holeNumber);
  }
}

export const getNextHoleNumber = holeNumber => (holeNumber + 1) % 16;

export const getPlayer1PlayableHoles = congklakState =>
  congklakState.filter((_, i) => i >= 0 && i < 7);

export const getPlayer2PlayableHoles = congklakState =>
  congklakState.filter((_, i) => i >= 8 && i < 15);


export const generateCongklakInitialState = () => {
  return [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
};

export const getNextTurn = currentTurn => (currentTurn % 2) + 1;

export const getOwnScoreHoleNumber = currentTurn => currentTurn * 8 - 1;

export const getEnemyScoreHoleNumber = currentTurn =>
  getNextTurn(currentTurn) * 8 - 1;

export const isScoreHole = holeNumber =>
  holeNumber === PLAYER1_HOME_HOLE_NUMBER ||
  holeNumber === PLAYER2_HOME_HOLE_NUMBER;

export const getOppositeHoleNumber = holeNumber =>
  holeNumber === PLAYER1_HOME_HOLE_NUMBER ||
  holeNumber === PLAYER2_HOME_HOLE_NUMBER
    ? -1
    : getOpposite(holeNumber);

export const isPlayer1OutOfMove = congklakState =>
  getPlayer1PlayableHoles(congklakState).filter(val => val > 0).length === 0;

export const isPlayer2OutOfMove = congklakState =>
  getPlayer2PlayableHoles(congklakState).filter(val => val > 0).length === 0;