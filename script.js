const cells = document.querySelectorAll(".cell");
const statusDiv = document.getElementById("status");
const restartBtn = document.getElementById("restart");

let board = Array(9).fill("");
let gameActive = true;

const HUMAN = "X";
const AI = "O";

const wins = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

/* CLICK */
cells.forEach(cell => {
  cell.addEventListener("click", () => {
    const i = cell.dataset.i;

    if (board[i] || !gameActive) return;

    move(i, HUMAN);
    if (endCheck()) return;

    setTimeout(aiMove, 250);
  });
});

/* MOVE */
function move(i, player) {
  board[i] = player;
  cells[i].setAttribute("data-value", player);
}

/* AI MOVE */
function aiMove() {
  let bestMove = minimax(board, AI, 0);
  move(bestMove.index, AI);
  endCheck();
}

/* MINIMAX (IMPROVED WITH DEPTH) */
function minimax(newBoard, player, depth) {

  if (check(newBoard, HUMAN)) return { score: depth - 10 };
  if (check(newBoard, AI)) return { score: 10 - depth };
  if (!newBoard.includes("")) return { score: 0 };

  let moves = [];

  for (let i = 0; i < 9; i++) {
    if (newBoard[i] === "") {
      let move = {};
      move.index = i;

      newBoard[i] = player;

      let result = minimax(
        newBoard,
        player === AI ? HUMAN : AI,
        depth + 1
      );

      move.score = result.score;
      newBoard[i] = "";

      moves.push(move);
    }
  }

  let bestMove;

  if (player === AI) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = moves[i];
      }
    }
  }

  return bestMove;
}

/* CHECK WIN */
function check(b, p) {
  return wins.some(w => w.every(i => b[i] === p));
}

/* END CHECK */
function endCheck() {
  if (check(board, HUMAN)) {
    end("You Win!", "#2ecc71");
    return true;
  }
  if (check(board, AI)) {
    end("You Lose!", "#e74c3c");
    return true;
  }
  if (!board.includes("")) {
    end("Draw!", "#3498db");
    return true;
  }
  return false;
}

/* END */
function end(msg, color) {
  gameActive = false;
  statusDiv.textContent = msg;
  statusDiv.style.background = color;
}

/* RESTART */
restartBtn.onclick = () => {
  board.fill("");
  gameActive = true;

  cells.forEach(c => c.setAttribute("data-value", ""));
  statusDiv.textContent = "Your Turn";
  statusDiv.style.background = "#4a90e2";
};