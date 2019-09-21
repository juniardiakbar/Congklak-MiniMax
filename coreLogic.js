const {
    getNextHoleNumber,
    getEnemyScoreHoleNumber,
    isInOwnArea,
    getNextTurn,
    getOwnScoreHoleNumber,
    PLAYER1_HOME_NUMBER,
    PLAYER2_HOME_NUMBER,
    getOppositeHoleNumber
} = require("./congklakUtils");

exports.getCongklakNextState = async function(currentState, turn, nowHoleNumber) {
    const nextState = [...currentState];
    let seeds = nextState[nowHoleNumber];
    let currentHoleNumber = getNextHoleNumber(nowHoleNumber);
    nextState[nowHoleNumber] = 0;
    while (seeds > 0) {
        if (currentHoleNumber === getEnemyScoreHoleNumber(turn)) {
            currentHoleNumber = getNextHoleNumber(currentHoleNumber);
            continue;
        }
        seeds -= 1;
        nextState[currentHoleNumber] += 1;
        if (
            seeds === 0 &&
            currentHoleNumber !== PLAYER1_HOME_NUMBER &&
            currentHoleNumber !== PLAYER2_HOME_NUMBER
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

const waitFor = function(milliseconds) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, milliseconds);
    });
  };
  

exports.simulateCongklakRotation = async function ({
    congklakState,
    turn,
    selectedHoleNumber,
    setCongklakStateFn,
    setFocusedCongklakHoleNumberFn,
    setDisplayNumberOfSeedsToBeDistributedFn,
    setTurnFn,
    delay
}) {
    function setCongklakStateHelper(holeNumber, value) {
        congklakState[holeNumber] = value;
        setCongklakStateFn([...congklakState]);
        setFocusedCongklakHoleNumberFn(holeNumber);
        return congklakState;
    }

    let seeds = congklakState[selectedHoleNumber];
    let currentHoleNumber = getNextHoleNumber(selectedHoleNumber);

    setDisplayNumberOfSeedsToBeDistributedFn(seeds);
    setCongklakStateHelper(selectedHoleNumber, 0);
    await waitFor(delay);

    while (seeds > 0) {
        if (currentHoleNumber === getEnemyScoreHoleNumber(turn)) {
            currentHoleNumber = getNextHoleNumber(currentHoleNumber);
            continue;
        }

        seeds -= 1;
        setCongklakStateHelper(
            currentHoleNumber,
            congklakState[currentHoleNumber] + 1
        );
        setFocusedCongklakHoleNumberFn(currentHoleNumber);
        setDisplayNumberOfSeedsToBeDistributedFn(seeds);

        await waitFor(delay);

        if (
            seeds === 0 &&
            currentHoleNumber !== PLAYER1_HOME_NUMBER &&
            currentHoleNumber !== PLAYER2_HOME_NUMBER
        ) {
            if (congklakState[currentHoleNumber] > 1) {
                seeds += congklakState[currentHoleNumber];
                setCongklakStateHelper(currentHoleNumber, 0);
                setDisplayNumberOfSeedsToBeDistributedFn(seeds);
                await waitFor(delay);
            } else if (isInOwnArea(currentHoleNumber, turn)) {
                const opposite = getOppositeHoleNumber(currentHoleNumber);
                const take = congklakState[opposite];
                setFocusedCongklakHoleNumberFn(opposite);
                setCongklakStateHelper(opposite, 0);
                await waitFor(delay);

                setFocusedCongklakHoleNumberFn(getOwnScoreHoleNumber(turn));
                setDisplayNumberOfSeedsToBeDistributedFn(take);
                await waitFor(delay);

                setCongklakStateHelper(
                    getOwnScoreHoleNumber(turn),
                    congklakState[getOwnScoreHoleNumber(turn)] + take
                );
            }
        }
        currentHoleNumber = getNextHoleNumber(currentHoleNumber);
    }
    setDisplayNumberOfSeedsToBeDistributedFn(-1);
    setFocusedCongklakHoleNumberFn(-1);
    await waitFor(delay);
    if (currentHoleNumber !== getNextHoleNumber(getOwnScoreHoleNumber(turn))) {
        setTurnFn(getNextTurn(turn));
        await waitFor(delay);
        return { nextState: congklakState, nextTurn: getNextTurn(turn) };
    }
    return { nextState: congklakState, nextTurn: turn };
}
  