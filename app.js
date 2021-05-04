const gameboard = document.getElementsByClassName("gameboard");
const playfield = Array.from(document.getElementsByClassName("playfield"));
const resetBtn = document.getElementById("resetBtn");
let userMessage = document.querySelector(".usermessage");
let xCurrentScore = 0;
let oCurrentScore = 0;
let round = 1;
let winningFields = [];
const playerX = "x-player";
const playerO = "o-player";
let currentPlayer = playerX;
const winningCombinations = [
  [0, 1, 2], // Top/Bottom-Left Horizontal
  [0, 3, 6], // Top/Bottom-Left Vertical
  [3, 4, 5], // Mid Horizontal
  [1, 4, 7], // Mid Vertical
  [6, 7, 8], // Bottom Horizontal
  [0, 4, 8], // Top-Left/Bottom-Right Diagonal
  [2, 4, 6], // Top-Right/Bottom-Left Diagonal
  [2, 5, 8], // Top/Bottom-Right Vertical
];

const gameplaymusic = new Audio("./assets/audio/gameplay.mp3");

gameplaymusic.play();

// EVENT LISTENERS
window.addEventListener("DOMContentLoaded", (e) => {
  document
    .getElementById("gametitle")
    .classList.add("animate__animated", "animate__bounceInDown");
  playfield.forEach((item) => {
    item.classList.add("animate__animated", "animate__wobble");
  });
});

playfield.forEach((items) => {
  items.addEventListener("click", fieldClicked, {
    once: true,
  });
});

const resetGame = () => {
  currentPlayer = playerX;
  userMessage.innerText = "Tap any field to start the game!";

  for (let x = 0; x < playfield.length; x++) {
    playfield[x].classList.remove(playerX, playerO);
    playfield[x].removeEventListener("click", fieldClicked);
    playfield[x].addEventListener("click", fieldClicked, {
      once: true,
    });
    playfield[x].className = "playfield";
    playfield[x].classList.add("animate__animated", "animate__wobble");
  }

  winningFields[0].forEach((field) => {
    playfield[field].style.backgroundColor = "#20196c";
  });

  winningFields.pop();
  resetScore();
};

resetBtn.addEventListener("click", resetGame);

function fieldClicked(e) {
  const fieldclicksfx = new Audio("./assets/audio/fieldclicksfx.mp3");
  const clickedfield = e.target;

  userMessage.innerText = "Round: " + round;

  clickedfield.classList.add(currentPlayer);
  clickedfield.classList.remove("animate__wobble");
  clickedfield.classList.add("animate__rubberBand");

  //play SFX
  fieldclicksfx.play();

  //check if winner
  isWinner(currentPlayer, clickedfield.id);

  // TODO:
  // check if draw
  // display result
  // Switch Player if no draw or win until 9 fields filled.

  //switch player
  currentPlayer = switchPlayer(currentPlayer);
}

const switchPlayer = (currentPlayer) => {
  currentPlayer = currentPlayer === playerX ? playerO : playerX;

  return currentPlayer;
};

const isWinner = (currentPlayer, clickedfield) => {
  let matchesfound = 0;

  //filter all combinations to new array of only possible combinations.
  const possiblecombo = winningCombinations.filter((combination) =>
    combination.includes(parseInt(clickedfield))
  );

  for (let x = 0; x < possiblecombo.length; x++) {
    matchesfound = 0;

    //For each combination, validate if matching field contains currentplayer class
    possiblecombo[x].forEach((combination) => {
      if (playfield[combination].classList.contains(currentPlayer)) {
        matchesfound++;

        if (matchesfound === 3) {
          // Winner detected
          const winnersfx = new Audio("./assets/audio/winner.wav");

          winningFields.push(possiblecombo[x]);

          winningFields[0].forEach((field) => {
            playfield[field].style.backgroundColor = "#583ce6";
          });

          userMessage.innerText = currentPlayer + " wins the game!";
          userMessage.style.color = "green";
          winnersfx.play();
          updateScore();

          round++;
        }
      }
    });
  }
};

const updateScore = () => {
  if (currentPlayer === playerX) {
    xCurrentScore++;
    document.getElementById("xscore").innerText = xCurrentScore;
  } else {
    oCurrentScore++;
    document.getElementById("oscore").innerText = oCurrentScore;
  }
};

const resetScore = () => {
  xCurrentScore = 0;
  oCurrentScore = 0;
  document.getElementById("xscore").innerText = 0;
  document.getElementById("oscore").innerText = 0;
};

const animateWinningCells = () => {};
