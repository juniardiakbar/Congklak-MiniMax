import {
  getCongklakNextState,
  getOwnScoreHoleNumber,
  isPlayer1OutOfMove,
  isPlayer2OutOfMove,
  PLAYER1_HOLE_NUMBERS,
  PLAYER2_HOLE_NUMBERS,
} from "./congklakUtils.js";

const MINUS_INFINITY = -1E8;
const PLUS_INFINITY = 1E8;

/**
 * 
 * Fungsi getChoice adalah fungsi untuk memanggil fungi minimax 
 * Menghasilkan gerakan random apabila difficulty = 1
 * 
 */
export async function getChoice(congklakState, difficulty, turn=2) {
  if (difficulty === 1) {
    return getRandomChoice(congklakState, turn);
  } else {
    // return nilai score pada hole_home
    return await minimax(congklakState, Number.parseInt(difficulty));
  }
}

/**
 * 
 * Fungsi getRandomChoice adalah fungsi yang 
 * mengembalikan gerakan random saat bermain
 * 
 */

function getRandomChoice(congklakState, turn) {
  var playableHoles;
  if (turn == 1) {
    playableHoles = PLAYER1_HOLE_NUMBERS.filter(
      val => congklakState[val] > 0
    );  
  } else {
    playableHoles = PLAYER2_HOLE_NUMBERS.filter(
      val => congklakState[val] > 0
    );
  }
  return playableHoles[Math.floor(Math.random() * playableHoles.length)];
}

/**
 * 
 * Fungsi isGameOver adalah fungsi untuk mengecek apakah
 * seorang pemain sudah kehabisan giliran bermain atau tidak
 * 
 */

function isGameOver(congklakState, turn) {
  if (turn === 1) {
    return isPlayer1OutOfMove(congklakState);
  } else {
    return isPlayer2OutOfMove(congklakState);
  }
}

/**
 * 
 * Fungsi utility adalah fungsi yang mengembalikan
 * nilai basis, yaitu banyaknya batu pada suatu lubang
 * pemain yang sedang mendapat giliran
 * 
 */

function utility(congklakState, turn) {
  return congklakState[getOwnScoreHoleNumber(turn)];
}

/**
 * 
 *  Fungsi minimax adalah fungsi untuk menghasilkan gerakan optimum
 *  untuk bot AI yang menggunakan algoritma minimax
 *  
 */

async function minimax(state, depthLimit = 8) {
  let maximum = MINUS_INFINITY;
  let choice;

  for (let holeNumber of PLAYER2_HOLE_NUMBERS) {
    if (state[holeNumber] > 0) {
      let { nextState, nextTurn } = await getCongklakNextState(
        state,
        2,
        holeNumber
      );
      let currentValue;
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

/**
 * 
 * Fungsi getMin adalah fungsi yang menghasilkan nilai 
 * optimum yang dapat dihasilkan oleh minimizer (pemain non-AI).
 * Fungsi ini menggunakan alpha-beta prunning
 *  
 */

async function getMin(
  state,
  depthLimit,
  alpha = MINUS_INFINITY,
  beta = PLUS_INFINITY
) {
  if (depthLimit <= 0 || isGameOver(state, 1)) {
    return utility(state, 2);
  }

  let minValue = PLUS_INFINITY;
  for (let holeNumber of PLAYER1_HOLE_NUMBERS) {
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

/**
 * 
 * Fungsi getMax adalah fungsi yang menghasilkan nilai 
 * optimum yang dapat dihasilkan oleh maximizer (pemain AI).
 * Fungsi ini menggunakan alpha-beta prunning
 *  
 */

async function getMax(
  state,
  depthLimit,
  alpha = MINUS_INFINITY,
  beta = PLUS_INFINITY
) {
  if (depthLimit <= 0 || isGameOver(state, 2)) {
    return utility(state, 2);
  }

  let maxValue = MINUS_INFINITY;
  for (let holeNumber of PLAYER2_HOLE_NUMBERS) {
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