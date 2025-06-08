/*****  DOM REFERENCES  *****/
const boxes        = document.querySelectorAll(".box");
const resetBtn     = document.querySelector("#reset-button");
const newGameBtn   = document.querySelector("#new-button");
const msgContainer = document.querySelector(".msg-container");
const msg          = document.querySelector("#msg");
const turnIndicator = document.getElementById("turn-indicator");
const modeRadioBtns = document.querySelectorAll("input[name='mode']");

/*****  SCORE / MODE STATE  *****/
let playerScoreX = 0;
let playerScoreO = 0;
let draws        = 0;

let mode   = "human"; // "human" | "ai"
let turnO  = true;    // true → O's turn
let gameOver = false;

/*****  WIN PATTERNS  *****/
const winPatterns = [
  [0,1,2],[0,3,6],[0,4,8],
  [1,4,7],[2,5,8],[2,4,6],
  [3,4,5],[6,7,8]
];

/*──────────────── MODE TOGGLE ───────────────*/
modeRadioBtns.forEach(r => {
  r.addEventListener("change", () => {
    mode = document.querySelector("input[name='mode']:checked").value.toLowerCase();  // Fixed here
    resetGame();
  });
});

/*──────────────── GAME CONTROL ───────────────*/
function resetGame() {
  turnO    = true;
  gameOver = false;
  enableBoxes();
  msgContainer.classList.add("hide");
  turnIndicator.innerText = "Turn: O";
}

function enableBoxes() {
  boxes.forEach(box => {
    box.disabled = false;
    box.innerText = "";
    box.style.backgroundColor = "#ffffc7";
  });
}

function disableBoxes() {
  boxes.forEach(box => box.disabled = true);
}

/*──────────────── SCORE / MESSAGE ────────────*/
function showWinner(winner) {
  msg.innerText = `🎉 Congratulations! Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  disableBoxes();
  gameOver = true;

  if (winner === "X") playerScoreX++;
  else                playerScoreO++;

  updateScore();
}

function updateScore() {
  document.getElementById("scoreX").innerText = playerScoreX;
  document.getElementById("scoreO").innerText = playerScoreO;
  document.getElementById("draws").innerText  = draws;
}

/*──────────────── GAME LOGIC ─────────────────*/
function checkWinner() {
  for (const [a,b,c] of winPatterns) {
    const val1 = boxes[a].innerText;
    const val2 = boxes[b].innerText;
    const val3 = boxes[c].innerText;

    if (val1 && val1 === val2 && val2 === val3) {
      [a,b,c].forEach(i => boxes[i].style.backgroundColor = "#90EE90");
      showWinner(val1);
      return;
    }
  }

  if ([...boxes].every(box => box.innerText)) {
    msg.innerText = "It's a Draw!";
    msgContainer.classList.remove("hide");
    disableBoxes();
    gameOver = true;
    draws++;
    updateScore();
  }
}

function makeMove(box, symbol) {
  box.innerText = symbol;
  box.disabled  = true;
  turnIndicator.innerText = `Turn: ${symbol === "X" ? "O" : "X"}`;
  checkWinner();
}

function aiMove() {
  if (gameOver) return;

  const empty = [...boxes].filter(b => !b.innerText);
  if (!empty.length) return;

  const randomBox = empty[Math.floor(Math.random() * empty.length)];
  makeMove(randomBox, "X");
  turnO = true;
}

/*──────────────── EVENT LISTENERS ───────────*/
boxes.forEach(box => {
  box.addEventListener("click", () => {
    if (box.innerText || gameOver) return;

    if (mode === "human") {
      if (turnO) { makeMove(box, "O"); turnO = false; }
      else       { makeMove(box, "X"); turnO = true;  }
    } else if (mode === "ai") {
      if (turnO) {
        makeMove(box, "O");
        turnO = false;
        setTimeout(aiMove, 500); // Delay for better UX
      }
    }
  });
});

newGameBtn.addEventListener("click", resetGame);
resetBtn   .addEventListener("click", resetGame);

