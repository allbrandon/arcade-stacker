const startButton = document.getElementById("start-button");
const restartButton = document.getElementById("restart-button");

// Setup variables that track the game
let gameActive;
let currRow;
let currStack;
let hoverStackRight;
let maxRow;
let maxCol;
let gameBoard;
let moveStackIntId;
let speed;
let stackIndexes = [];

// Takes a DOM table
const extractGameBoard = (table) => {
  const tableRows = table.children;
  let gameBoard = [...tableRows];
  gameBoard = gameBoard.map((row) => {
    const cols = row.children;
    return [...cols];
  });
  return gameBoard;
};
const onKeydown = (e) => {
  if (e.repeat) return;
  if (e.key === " ") {
    placeStack();
    nextStack();
  }
};

const startGame = () => {
  gameActive = true;
  document.addEventListener("keydown", onKeydown);
  startButton.style.display = "none";
  moveStack();
};

const endGame = (won) => {
  gameActive = false;

  document.removeEventListener("keydown", onKeydown);
  if (won) {
    alert("Congratulations! You have won!");
  } else {
    alert("Game Over");
  }

  resetGame();
};
const resetGame = () => {
  clearInterval(moveStackIntId);
  gameBoard.forEach((row) =>
    row.forEach((col) => {
      col.setAttribute("hovering", false);
      col.setAttribute("placed", false);
    })
  );
  initGame();
  startButton.style.display = "inline-block";
};

const checkGameStatus = () => {
  if (currStack === 0) {
    endGame(false);
  }
  if (currRow === 0) {
    endGame(true);
  }
};
const updateSpeed = () => {
  speed = speed * 0.8;
};
const placeStack = () => {
  const rowToPlace = gameBoard[currRow];

  if (currRow === maxRow) {
    stackIndexes.forEach((index) => {
      rowToPlace[index].setAttribute("placed", true);
    });
  } else if (currRow >= 0) {
    const rowBelow = gameBoard[currRow + 1];
    let droppedCount = 0;
    stackIndexes.forEach((index) => {
      // Place only if the row below has placed as well
      // Check how many placed
      if (rowBelow[index].getAttribute("placed") === "true") {
        rowToPlace[index].setAttribute("placed", true);
        rowToPlace[index].setAttribute("hovering", false);
      } else {
        rowToPlace[index].setAttribute("hovering", false);
        droppedCount++;
      }
    });
    // Update the amount in the hover stack depending on how many missed
    currStack = currStack - droppedCount;
    checkGameStatus();
  } else {
    endGame(false);
  }
};
const nextStack = () => {
  clearInterval(moveStackIntId);
  currRow = currRow - 1;
  moveStackIntId = null;
  updateSpeed();
  moveStack();
};

// Using currStack and currRow, start from the first cell and move it back and forth, by incrementing
const moveStack = () => {
  const rowToPlace = gameBoard[currRow];

  // Place the first stack
  // Clear Stack indexes

  stackIndexes = [];
  for (let index = 0; index < currStack; index++) {
    rowToPlace[index].setAttribute("hovering", true);
    stackIndexes.push(index);
  }
  // Setup timer to make it move
  if (!moveStackIntId) {
    moveStackIntId = setInterval(() => {
      clearStack(rowToPlace);
      checkHoverDirection();
      stackIndexes = newStackIndexes();
      updateStack(rowToPlace);
    }, speed);
  }
};
const checkHoverDirection = () => {
  // Going left, about to go out of bounds, then reverse it

  if (stackIndexes[0] === 0 && !hoverStackRight) {
    hoverStackRight = !hoverStackRight;
  } else if (stackIndexes[currStack - 1] === maxCol && hoverStackRight) {
    hoverStackRight = !hoverStackRight;
  }
};

const newStackIndexes = () => {
  let increment = 1;
  if (!hoverStackRight) {
    increment = -1;
  }
  return stackIndexes.map((index) => {
    return index + increment;
  });
};
const clearStack = (row) => {
  stackIndexes.forEach((index) => {
    row[index].setAttribute("hovering", false);
  });
};
const updateStack = (row) => {
  stackIndexes.forEach((index) => {
    row[index].setAttribute("hovering", true);
  });
};

const initGame = () => {
  maxCol = gameBoard[0].length - 1;
  maxRow = gameBoard.length - 1;
  gameActive = false;
  currRow = maxRow;
  currStack = 3;
  hoverStackRight = true;
  moveStackIntId = null;
  speed = 1000;
  stackIndexes = [];

  // start at the max due to 2D array
};

window.addEventListener("DOMContentLoaded", () => {
  startButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", resetGame);
  gameBoard = extractGameBoard(document.getElementById("game-table"));
  initGame();
});
