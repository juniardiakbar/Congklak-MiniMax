exports.PLAYER1_HOME_NUMBER = 7;
exports.PLAYER2_HOME_NUMBER = 15;
exports.PLAYER1_HOLE_NUMBERS = [0, 1, 2, 3, 4, 5, 6];
exports.PLAYER2_HOLE_NUMBERS = [8, 9, 10, 11, 12, 13, 14];

exports.DIFFICULTY = {
    EASY: "null",
    MEDIUM: "2",
    HARD: "4",
    BRUTAL: "8"
};
  
exports.MAP_DIFFICULTY_NUMBER_TO_DIFFICULTY = {
    null: "EASY",
    "2": "MEDIUM",
    "4": "HARD",
    "8": "BRUTAL"
};
  
exports.OPPOSITE_HOLE_NUMBER = function(hole) {
    return Math.abs((14-hole));
};

exports.generateCongklakInitialState = function() {
    return [7, 7, 7, 7, 7, 7, 7, 0, 7, 7, 7, 7, 7, 7, 7, 0];
}

exports.getNextHoleNumber = function(holeNumber) {
    return (holeNumber + 1) % 16;
}

exports.isInOwnArea = function(holeNumber, turn) {
    if (turn == 1) {
        return (0 <= holeNumber && holeNumber <= 7);
    } else if (turn == 2) {
        return (8 <= holeNumber && holeNumber <= 15);
    } else return false;
}

exports.getPlayer1PlayableHoles = function(congklakState) {
    return congklakState.filter((_, i) => i >= 0 && i < 7);
}
  
exports.getPlayer2PlayableHoles = function(congklakState) {
    return congklakState.filter((_, i) => i >= 8 && i < 15);
}

exports.getOppositeHoleNumber = function(holeNumber) {
    return (holeNumber === PLAYER1_SCORE_HOLE_NUMBER ||
    holeNumber === PLAYER2_SCORE_HOLE_NUMBER
      ? -1
      : OPPOSITE_HOLE_NUMBER(holeNumber));
}

exports.getNextTurn = function(currentTurn) {
    return currentTurn % 2 + 1;
}

exports.getOwnScoreHoleNumber = function(currentTurn)  { 
    return currentTurn * 8 - 1;
}

exports.isScoreHole = function(holeNumber) {
    return 
        (holeNumber === PLAYER1_SCORE_HOLE_NUMBER ||
        holeNumber === PLAYER2_SCORE_HOLE_NUMBER);
}

exports.getEndOfGameMessage = function(congklakState) {
    if (
        congklakState[PLAYER1_SCORE_HOLE_NUMBER] >
        congklakState[PLAYER2_SCORE_HOLE_NUMBER]
    ) {
        return "Player wins!";
    } else if (
        congklakState[PLAYER1_SCORE_HOLE_NUMBER] ===
        congklakState[PLAYER2_PLAYABLE_HOLE_NUMBERS]
    ){
        return "Draw";
    } else {
        return "Congklak.AI wins!";
    }
  }

exports.hashCongklakState = function(depthLimit, congklakState) {
    let str = `${depthLimit},`;
    for (let element of congklakState) {
        str = str + " " + element;
    }
    return str;
}

exports.isPlayer1OutOfMove = function(congklakState) {
    return getPlayer1PlayableHoles(congklakState).filter(val => val > 0).length === 0;
}

exports.isPlayer2OutOfMove = function(congklakState) {
    return getPlayer2PlayableHoles(congklakState).filter(val => val > 0).length === 0;
}

exports.isGameOver = function(congklakState) {
    isPlayer1OutOfMove(congklakState) && isPlayer2OutOfMove(congklakState);
}