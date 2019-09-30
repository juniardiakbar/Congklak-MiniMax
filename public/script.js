import { generateCongklakInitialState } from './congklakUtils.js';
import { getCongklakNextState } from './coreLogic.js';
import { getChoice } from './alphaBetaPrunning.js';
import { simulateCongklakMove } from './simulateCongklakMove.js';

var userHole = document.getElementsByClassName('user-hole');
var userHomeHole = document.getElementsByClassName('user-home-hole');
var aiHole = document.getElementsByClassName('ai-hole');
var aiHomeHole = document.getElementsByClassName('ai-home-hole');
var buttonPlay =  document.getElementById('play');
var seedsLeft =  document.getElementById('seeds-left');
var playing = 1;

const holes = [];
for (let i=0; i<7; i++) {
  holes.push(userHole[i]);
}
holes.push(userHomeHole[0]);
for (let i=0; i<7; i++) {
  holes.push(aiHole[6-i]);
}
holes.push(aiHomeHole[0]);

const congklakState = generateCongklakInitialState();
congklakState.forEach((state, i) => {
  holes[i].innerHTML = state;
});


for (let i=0; i<7; i++) {
  userHole[i].addEventListener('click', async function() {
    await simulateCongklakMove(congklakState, 1, i, holes, seedsLeft);
    
    const result = await getCongklakNextState(congklakState, 1, i);
    const nextState = result.nextState;
    playing = result.nextTurn;
    
    for (let i=0; i<16; i++) {
      congklakState[i] = nextState[i];
    }
  });

}

async function botAiTurn(
  playing,
  congklakState,
  level,
  holeNumber,
  holes,
  seedsLeft,
){
  if (playing == 2){
    var holeNumber = await getChoice(congklakState, level);
    await simulateCongklakMove(congklakState, 2, holeNumber, holes, seedsLeft);
    const result = await getCongklakNextState(congklakState, 2, holeNumber);
    const nextState = result.nextState;
    playing = result.nextTurn;
    
    for (let i=0; i<16; i++) {
      congklakState[i] = nextState[i];
    }
    holeNumber = await getChoice(congklakState, 4);
    return botAiTurn(playing, congklakState);
  }
}

buttonPlay.addEventListener('click', async function() {
  if (playing == 2) {
    var holeNumber = await getChoice(congklakState, 4);
    await simulateCongklakMove(congklakState, 2, holeNumber, holes, seedsLeft);
    const result = await getCongklakNextState(congklakState, 2, holeNumber);
    const nextState = result.nextState;
    playing = result.nextTurn;
    
    for (let i=0; i<16; i++) {
      congklakState[i] = nextState[i];
    }
    holeNumber = await getChoice(congklakState, 4);
  }
});
