const gameboard = document.getElementsByClassName("gameboard");
const playfield = Array.from(document.getElementsByClassName("playfield"));
const resetBtn = document.getElementById("resetBtn");
let xCurrentScore = 0;
let oCurrentScore = 0;
const playerX = "x-player";
const playerO = "o-player";
let currentPlayer = playerX;
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// EVENT LISTENERS
window.addEventListener("DOMContentLoaded", (event) => {
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

  for (let x = 0; x < playfield.length; x++) {
    playfield[x].classList.remove(playerX, playerO);
    playfield[x].removeEventListener("click", fieldClicked, {
      once: false,
    });
    playfield[x].addEventListener("click", fieldClicked, {
      once: true,
    });
    playfield[x].className = "playfield";
    playfield[x].classList.add("animate__animated", "animate__wobble");
  }
};

resetBtn.addEventListener("click", resetGame);

function fieldClicked(e) {
  const audio = new Audio("fieldclicksfx.mp3");

  const clickedfield = e.target;
  clickedfield.classList.add(currentPlayer);
  clickedfield.classList.remove("animate__wobble");
  clickedfield.classList.add("animate__rubberBand");

  //play SFX
  audio.play();

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
  let match = 0;

  //filter all combinations to new array of only possible combinations.
  const possiblecombo = winningCombinations.filter((combination) =>
    combination.includes(parseInt(clickedfield))
  );
  console.log(possiblecombo);
  console.log("possiblecombo # : " + possiblecombo.length);

  for (let x = 0; x < possiblecombo.length; x++) {
    console.log("for X value is : " + x);
    console.log("possible combo value: " + possiblecombo[x]);

    //For each combination, validate if matching field contains currentplayer class

    possiblecombo[x].forEach((field) => {
      if (match === 3) {
        console.log("we have a winner");
      } else if (playfield[field].classList.contains(currentPlayer)) {
        console.log("playfieldid is : " + playfield[field].id);
        match++;
      } else match = 0;
    });

    if (match === 3) {
      console.log(currentPlayer + " wins the game!");
      updateScore();
    }
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
