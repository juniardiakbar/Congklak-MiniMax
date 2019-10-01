import { generateCongklakInitialState } from './congklakUtils.js';
import { getCongklakNextState } from './coreLogic.js';
import { getChoice } from './alphaBetaPrunning.js';
import { simulateCongklakMove } from './simulateCongklakMove.js';

var buttonPlay =  document.getElementById('play');
var formType = document.getElementsByClassName('form-type');
var formDifficulty = document.getElementsByClassName('form-difficulty');
var type = 1;
var difficulty = 2;

var userHole = document.getElementsByClassName('user-hole');
var userHomeHole = document.getElementsByClassName('user-home-hole');
var aiHole = document.getElementsByClassName('ai-hole');
var aiHomeHole = document.getElementsByClassName('ai-home-hole');
var seedsLeft =  document.getElementById('seeds-left');
var playingStatus = document.getElementById('playing-status');
var buttonPlayGame = document.getElementById('play-game');
var playing = 1;

var beginningPage = document.getElementsByClassName('beginning-page');
var mainPage = document.getElementsByClassName('main-page');

var holes = [];
var congklakState;

for (let i=0; i<7; i++) {
  holes.push(userHole[i]);
}
holes.push(userHomeHole[0]);
for (let i=0; i<7; i++) {
  holes.push(aiHole[6-i]);
}
holes.push(aiHomeHole[0]);

for (let i=0; i<3; i++) {
  formType[i].addEventListener('change', function() {
    type = parseInt(formType[i].value);
    if (type != 3) {
      buttonPlayGame.classList.add('hidden');
    }
  });
}

for (let i=0; i<3; i++) {
  formDifficulty[i].addEventListener('change', function() {
    difficulty = parseInt(formDifficulty[i].value)*2;
  });
}

buttonPlay.addEventListener('click', function() {  
  congklakState = generateCongklakInitialState();
  congklakState.forEach((state, i) => {
    holes[i].innerHTML = state;
  });
  document.querySelector('.beginning-page').classList.add('hidden');
  mainPage[0].classList.remove('hidden');
  mainPage[0].style.display = 'flex';
  // beginningPage[0].classList.add('hidden');
});

buttonPlayGame.addEventListener('click', async function() {
  if (type == 3) {
    var tempState = [...congklakState];
    const randomHole = await getChoice(congklakState, 1);
  
    var result = await getCongklakNextState(congklakState, 1, randomHole);
    var nextState = result.nextState;
    playing = result.nextTurn;
    
    for (let i=0; i<16; i++) {
      congklakState[i] = nextState[i];
    }
    
    var botHoles = [];
  
    while (playing == 2) {
      const selectedHole = await getChoice(congklakState, difficulty);
      botHoles.push(selectedHole);
      var result = await getCongklakNextState(congklakState, 2, selectedHole);
      var nextState = result.nextState;
      playing = result.nextTurn;
      
      for (let i=0; i<16; i++) {
        congklakState[i] = nextState[i];
      }
    }
    console.log(botHoles);
    await simulateCongklakMove(tempState, 1, i, holes, seedsLeft, playingStatus, botHoles);
  }
})

for (let i=0; i<7; i++) {
  userHole[i].addEventListener('click', async function() {
    if (type == 1 || type == 2) {
      var tempState = [...congklakState];
      var result = await getCongklakNextState(congklakState, 1, i);
      var nextState = result.nextState;
      playing = result.nextTurn;
      
      for (let j=0; j<16; j++) {
        congklakState[j] = nextState[j];
      }
      
      var botHoles = [];

      while (playing == 2) {
        if (type == 2) {
          difficulty = 1;
        }
        const selectedHole = await getChoice(congklakState, difficulty);
        botHoles.push(selectedHole);
        var result = await getCongklakNextState(congklakState, 2, selectedHole);
        var nextState = result.nextState;
        playing = result.nextTurn;
        
        for (let i=0; i<16; i++) {
          congklakState[i] = nextState[i];
        }
      }
      console.log(botHoles);
      await simulateCongklakMove(tempState, 1, i, holes, seedsLeft, playingStatus, botHoles);
    }
  });
}