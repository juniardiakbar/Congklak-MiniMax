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

export const getOppositeHoleNumber = holeNumber =>
  holeNumber === PLAYER1_HOME_HOLE_NUMBER ||
  holeNumber === PLAYER2_HOME_HOLE_NUMBER
    ? -1
    : getOpposite(holeNumber);

export const isPlayer1OutOfMove = congklakState =>
  getPlayer1PlayableHoles(congklakState).filter(val => val > 0).length === 0;

export const isPlayer2OutOfMove = congklakState =>
  getPlayer2PlayableHoles(congklakState).filter(val => val > 0).length === 0;

/**
 * Fungsi yang akan memberikan state dari cogklak saat suatu hole dipilih.
 * Jika biji congklak yang didistribusikan belum melewati satu putaran,
 * maka congklak belum bisa mengambil isi dari opposite hole.
 */

export async function getCongklakNextState(
  currentState,
  turn,
  selectedHoleNumber
) {
  const nextState = [...currentState];

  let seeds = nextState[selectedHoleNumber];
  let currentHoleNumber = getNextHoleNumber(selectedHoleNumber);
  let hasVisited = false;
  
  nextState[selectedHoleNumber] = 0;

  while (seeds > 0) {
    if (currentHoleNumber === getEnemyScoreHoleNumber(turn)) {
      currentHoleNumber = getNextHoleNumber(currentHoleNumber);
    }

    seeds -= 1;
    nextState[currentHoleNumber] += 1;

    if (currentHoleNumber == selectedHoleNumber) {
      hasVisited = true;
    }

    if (
      seeds === 0 &&
      currentHoleNumber !== PLAYER1_HOME_HOLE_NUMBER &&
      currentHoleNumber !== PLAYER2_HOME_HOLE_NUMBER
    ) {
      if (nextState[currentHoleNumber] > 1) {
        seeds += nextState[currentHoleNumber];
        nextState[currentHoleNumber] = 0;
      } else if (isInOwnArea(currentHoleNumber, turn) && hasVisited) {
        const opposite = getOppositeHoleNumber(currentHoleNumber);
        const take = nextState[opposite] + nextState[currentHoleNumber];
        nextState[opposite] = 0;
        nextState[currentHoleNumber] = 0;
        nextState[getOwnScoreHoleNumber(turn)] += take;
      }
    }
    currentHoleNumber = getNextHoleNumber(currentHoleNumber);
  }

  if (currentHoleNumber !== getNextHoleNumber(getOwnScoreHoleNumber(turn))) {
    return { nextState, nextTurn: getNextTurn(turn) };
  }
  return { nextState, nextTurn: turn };
}