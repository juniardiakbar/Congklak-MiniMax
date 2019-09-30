import {
  getNextHoleNumber,
  getEnemyScoreHoleNumber,
  isInOwnArea,
  getNextTurn,
  getOwnScoreHoleNumber,
  PLAYER1_SCORE_HOLE_NUMBER,
  PLAYER2_SCORE_HOLE_NUMBER,
  getOppositeHoleNumber
} from "./congklakUtils.js";
  
export async function getCongklakNextState(
  currentState,
  turn,
  selectedHoleNumber
) {
  const nextState = [...currentState];

  let seeds = nextState[selectedHoleNumber];
  let currentHoleNumber = getNextHoleNumber(selectedHoleNumber);

  nextState[selectedHoleNumber] = 0;

  while (seeds > 0) {
    if (currentHoleNumber === getEnemyScoreHoleNumber(turn)) {
      currentHoleNumber = getNextHoleNumber(currentHoleNumber);
      continue;
    }

    seeds -= 1;
    nextState[currentHoleNumber] += 1;

    if (
      seeds === 0 &&
      currentHoleNumber !== PLAYER1_SCORE_HOLE_NUMBER &&
      currentHoleNumber !== PLAYER2_SCORE_HOLE_NUMBER
    ) {
      if (nextState[currentHoleNumber] > 1) {
        seeds += nextState[currentHoleNumber];
        nextState[currentHoleNumber] = 0;
      } else if (isInOwnArea(currentHoleNumber, turn)) {
        const opposite = getOppositeHoleNumber(currentHoleNumber);
        const take = nextState[opposite];
        nextState[opposite] = 0;
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