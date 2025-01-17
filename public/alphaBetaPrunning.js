import {
  PLAYER2_PLAYABLE_HOLE_NUMBERS,
  getOwnScoreHoleNumber,
  isPlayer2OutOfMove,
  isPlayer1OutOfMove,
  PLAYER1_PLAYABLE_HOLE_NUMBERS,
} from "./congklakUtils.js";
import { getCongklakNextState } from "./coreLogic.js";

const MINUS_INFINITY = -10000000;
const PLUS_INFINITY = +10000000;

export async function getChoice(congklakState, difficulty, turn=2) {
  if (difficulty === 1) {
    return getRandomChoice(congklakState, turn);
  } else {
    return await minimax(congklakState, Number.parseInt(difficulty));
  }
}

function getRandomChoice(congklakState, turn) {
  var playableHoles;
  if (turn == 1) {
    playableHoles = PLAYER1_PLAYABLE_HOLE_NUMBERS.filter(
      val => congklakState[val] > 0
    );  
  } else {
    playableHoles = PLAYER2_PLAYABLE_HOLE_NUMBERS.filter(
      val => congklakState[val] > 0
    );
  }
  return playableHoles[Math.floor(Math.random() * playableHoles.length)];
}

function terminalTest(congklakState, turn) {
  if (turn === 1) {
    return isPlayer1OutOfMove(congklakState);
  } else {
    return isPlayer2OutOfMove(congklakState);
  }
}

function utility(congklakState, turn) {
  return congklakState[getOwnScoreHoleNumber(turn)];
}

async function minimax(state, depthLimit = 8) {
  let maximum = MINUS_INFINITY;
  let choice = null;
  console.log("Considering Actions: ");

  for (let holeNumber of PLAYER2_PLAYABLE_HOLE_NUMBERS) {
    if (state[holeNumber] > 0) {
      let { nextState, nextTurn } = await getCongklakNextState(
        state,
        2,
        holeNumber
      );
      let currentValue = null;
      if (nextTurn === 1) {
        currentValue = await getMin(nextState, depthLimit - 1);
      } else {
        currentValue = await getMax(nextState, depthLimit - 1);
      }
      console.log(`Actions: ${holeNumber}, Score: ${currentValue}`);
      if (currentValue > maximum) {
        maximum = currentValue;
        choice = holeNumber;
      }
    }
  }
  return choice;
}

async function getMin(
  state,
  depthLimit,
  alpha = MINUS_INFINITY,
  beta = PLUS_INFINITY
) {
  if (depthLimit <= 0 || terminalTest(state, 1)) {
    return utility(state, 2);
  }

  let minValue = PLUS_INFINITY;
  for (let holeNumber of PLAYER1_PLAYABLE_HOLE_NUMBERS) {
    if (state[holeNumber] > 0) {
      let { nextState, nextTurn } = await getCongklakNextState(
        state,
        1,
        holeNumber
      );
      let currentValue = null;
      if (nextTurn === 2) {
        currentValue = await getMax(nextState, depthLimit - 1, alpha, beta);
      } else {
        currentValue = await getMin(nextState, depthLimit - 1, alpha, beta);
      }
      minValue = Math.min(minValue, currentValue);
      if (minValue <= alpha) {
        return minValue;
      }
      beta = Math.min(beta, minValue);
    }
  }

  return minValue;
}

async function getMax(
  state,
  depthLimit,
  alpha = MINUS_INFINITY,
  beta = PLUS_INFINITY
) {
  if (depthLimit <= 0 || terminalTest(state, 2)) {
    return utility(state, 2);
  }

  let maxValue = MINUS_INFINITY;
  for (let holeNumber of PLAYER2_PLAYABLE_HOLE_NUMBERS) {
    if (state[holeNumber] > 0) {
      let { nextState, nextTurn } = await getCongklakNextState(
        state,
        2,
        holeNumber
      );
      let currentValue = null;
      if (nextTurn === 1) {
        currentValue = await getMin(nextState, depthLimit - 1, alpha, beta);
      } else {
        currentValue = await getMax(nextState, depthLimit - 1, alpha, beta);
      }
      maxValue = Math.max(maxValue, currentValue);
      if (maxValue >= beta) {
        return maxValue;
      }
      alpha = Math.max(alpha, maxValue);
    }
  }

  return maxValue;
}