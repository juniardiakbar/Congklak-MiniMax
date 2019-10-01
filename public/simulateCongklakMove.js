import {
  getNextHoleNumber,
  getEnemyScoreHoleNumber,
  isInOwnArea,
  getNextTurn,
  getOwnScoreHoleNumber,
  PLAYER1_HOME_HOLE_NUMBER,
  PLAYER2_HOME_HOLE_NUMBER,
  getOppositeHoleNumber
} from "./congklakUtils.js";

async function simulatePlaying(
  seeds, 
  selectedHoleNumber,
  currentHoleNumber,
  nextState,
  turn, 
  holes, 
  seedsLeft, 
  playingStatus, 
  botHoles,
  hasVisited
) {
  if (seeds > 0) {
    if (turn == 1) {
      playingStatus.innerHTML = "Player is playing";
    } else {
      playingStatus.innerHTML = "AI is playing";
    }

    setTimeout(function() {
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
      holes.forEach(hole => {
        hole.classList.remove('active');
      })
      holes[currentHoleNumber].classList.add('active');

      currentHoleNumber = getNextHoleNumber(currentHoleNumber);

      nextState.forEach((state, i) => {
        holes[i].innerHTML = state;
        holes[i].classList.add('simulate');
      });

      seedsLeft.innerHTML = seeds;

      simulatePlaying(seeds,selectedHoleNumber, currentHoleNumber, nextState, turn, 
        holes, seedsLeft, playingStatus, botHoles, hasVisited)
    }, 250);
  } else {
    holes.forEach(hole => {
      hole.classList.remove('active');
    });

    setTimeout(async() => {
      if (currentHoleNumber !== getNextHoleNumber(getOwnScoreHoleNumber(turn))) {
        turn = getNextTurn(turn);
        if (turn == 2) {
          const selectedHoleNumber = botHoles.shift();
          seeds = nextState[selectedHoleNumber];
          currentHoleNumber = getNextHoleNumber(selectedHoleNumber);
          nextState[selectedHoleNumber] = 0;
          simulatePlaying(seeds, selectedHoleNumber, currentHoleNumber, nextState, 
            turn, holes, seedsLeft, playingStatus, botHoles, hasVisited);
        } else {
          playingStatus.innerHTML = "Player is playing";
          nextState.forEach((state, i) => {
            holes[i].innerHTML = state;
            holes[i].classList.remove('simulate');
          });
          return;
        }
      } else {
        if (turn == 2) {
          const selectedHoleNumber = botHoles.shift();
          seeds = nextState[selectedHoleNumber];
          currentHoleNumber = getNextHoleNumber(selectedHoleNumber);
          nextState[selectedHoleNumber] = 0;
          simulatePlaying(seeds,selectedHoleNumber, currentHoleNumber, nextState, 
            turn, holes, seedsLeft, playingStatus, botHoles, hasVisited);
        } else {
          playingStatus.innerHTML = "Player is playing";
          nextState.forEach((state, i) => {
            holes[i].innerHTML = state;
            holes[i].classList.remove('simulate');
          });
          return;
        }
      }
    }, 1500);

  }
}

export async function simulateCongklakMove(
  currentState,
  turn,
  selectedHoleNumber,
  holes,
  seedsLeft,
  playingStatus,
  botHoles
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

  simulatePlaying(seeds, selectedHoleNumber, currentHoleNumber, nextState, turn, 
    holes, seedsLeft, playingStatus, botHoles, false);
}