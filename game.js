const startButton = document.getElementById("start-button");

// Setup variables that track the game
let gameActive = false;
let currRow = 0;
let currStack = 3;
let hoverStackRight = true;
let maxRow;
let maxCol;
let gameBoard;
let moveStackIntId;
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
  moveStack();
};
const endGame = () => {
  gameActive = false;
  document.removeEventListener("keydown", onKeydown);
  alert("Game Over");
};
const checkGameStatus = () => {
  if (currStack === 0) {
    endGame();
  }
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
    endGame();
  }
};
const nextStack = () => {
  clearInterval(moveStackIntId);
  currRow = currRow - 1;
  moveStackIntId = null;
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
    }, 1000);
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
  const newIndex = stackIndexes.map((index) => {
    return index + increment;
  });

  return newIndex;
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
  startButton.addEventListener("click", startGame);
  gameBoard = extractGameBoard(document.getElementById("game-table"));
  maxCol = gameBoard[0].length - 1;
  maxRow = gameBoard.length - 1;
  // start at the max due to 2D array
  currRow = maxRow;
};

window.addEventListener("DOMContentLoaded", initGame);
