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

function simulatePlaying(seeds, currentHoleNumber, nextState, turn, holes) {
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
          const take = nextState[opposite];
          nextState[opposite] = 0;
          nextState[getOwnScoreHoleNumber(turn)] += take;
        }
      }
      holes.forEach(hole => {
        hole.classList.remove('active');
      })
      holes[currentHoleNumber].classList.add('active');

      currentHoleNumber = getNextHoleNumber(currentHoleNumber);

      nextState.forEach((state, i) => {
        holes[i].innerHTML = state;
      });


      simulatePlaying(seeds, currentHoleNumber, nextState, turn, holes)
    }, 500);
  } else {
    setTimeout(() => {
      holes.forEach(hole => {
        hole.classList.remove('active');
      })
    }, 500);
    return;
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
  }, 500);

  
  simulatePlaying(seeds, currentHoleNumber, nextState, turn, holes);
}