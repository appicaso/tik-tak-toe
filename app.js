const gameboard = document.getElementsByClassName("gameboard");
const playfield = Array.from(document.getElementsByClassName("playfield"));
const resetBtn = document.getElementById("resetBtn");
let userMessage = document.querySelector(".usermessage");
const popup = document.querySelector(".popup");
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

gameplaymusic.loop = true;
//gameplaymusic.play();

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
    playfield[x].addEventListener("click", fieldClicked, {
      once: true,
    });
    playfield[x].className = "playfield";
    playfield[x].classList.add("animate__animated", "animate__wobble");
    playfield[x].style.opacity = "100%";
  }

  winningFields[0].forEach((field) => {
    playfield[field].style.backgroundColor = "#2c247d";
  });

  playfield.forEach((field) => {
    field.style.cursor = "pointer";
    if (!winningFields[0].includes(parseInt(field.id))) {
      field.animate(
        [
          // keyframes
          { opacity: "0" },
          { opacity: "100" },
        ],
        {
          // timing options
          duration: 1000,
          iterations: 1,
        }
      );
      field.style.opacity = "100%";
    }
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
            playfield[field].style.backgroundColor = "#30da7c";
          });

          playfield.forEach((field) => {
            field.removeEventListener("click", fieldClicked);
            field.style.cursor = "not-allowed";
          });

          reduceLosingFieldOpacity();
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

const reduceLosingFieldOpacity = () => {
  for (i = 0; i < winningFields.length; i++) {
    for (y = 0; y < playfield.length; y++) {
      if (!winningFields[i].includes(parseInt(playfield[y].id))) {
        playfield[y].style.opacity = "20%";
      }
    }
  }
};
