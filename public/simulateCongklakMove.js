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

function simulatePlaying(seeds, currentHoleNumber, nextState, turn, holes, seedsLeft) {
  if (seeds > 0) {
    setTimeout(function() {
      if (currentHoleNumber === getEnemyScoreHoleNumber(turn)) {
        currentHoleNumber = getNextHoleNumber(currentHoleNumber);
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
          const take = nextState[opposite] + nextState[currentHoleNumber];
          nextState[opposite] = 0;
          nextState[currentHoleNumber] = 0;
          nextState[getOwnScoreHoleNumber(turn)] += take;
        }
      }
      currentHoleNumber = getNextHoleNumber(currentHoleNumber);

      nextState.forEach((state, i) => {
        holes[i].innerHTML = state;
      });

      seedsLeft.innerHTML = seeds;

      simulatePlaying(seeds, currentHoleNumber, nextState, turn, holes, seedsLeft)
    }, 250);
  } else {
    return true;
  }
}

export async function simulateCongklakMove(
  currentState,
  turn,
  selectedHoleNumber,
  holes,
  seedsLeft
) {
  const nextState = [...currentState];

  const seeds = nextState[selectedHoleNumber];
  const currentHoleNumber = getNextHoleNumber(selectedHoleNumber);

  nextState[selectedHoleNumber] = 0;

  await setTimeout(function(){ 
    nextState.forEach((state, i) => {
      holes[i].innerHTML = state;
    });
  }, 250);

  
  return simulatePlaying(seeds, currentHoleNumber, nextState, turn, holes, seedsLeft);
}