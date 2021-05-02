const startButton = document.getElementById("start-button");

// Setup variables that track the game
let gameActive = false;
let currRow = 0;
let currStack = 3;
let hoverStackRight = true;
let maxRow;
let maxCol;
let gameBoard;

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

const startGame = () => {
  gameActive = true;
  document.addEventListener("keydown", (e) => {
    if (e.key === " ") {
      placeStack();
    }
  });
  moveStack();
};
const endGame = () => {
  gameActive = false;
};
const placeStack = () => {
  if (currRow > 0) {
    currRow = currRow - 1;
  } else {
    endGame();
  }
};

// Using currStack and currRow, start from the first cell and move it back and forth, by incrementing

const moveStack = () => {
  const rowToPlace = gameBoard[currRow];
  let stackIndexes = [];

  // Place the first stack
  for (let index = 0; index < currStack; index++) {
    rowToPlace[index].setAttribute("hovering", "true");
    stackIndexes.push(index);
  }
  // Setup timer to make it move

  setInterval(() => {
    clearStack(stackIndexes, rowToPlace);
    checkHoverDirection(stackIndexes);
    stackIndexes = newStackIndexes(stackIndexes);
    updateStack(stackIndexes, rowToPlace);
  }, 1000);
};
const checkHoverDirection = (stackIndexes) => {
  // Going left, about to go out of bounds, then reverse it

  if (stackIndexes[0] === 0 && !hoverStackRight) {
    hoverStackRight = !hoverStackRight;
  } else if (stackIndexes[currStack - 1] === maxCol && hoverStackRight) {
    hoverStackRight = !hoverStackRight;
  }
};
const newStackIndexes = (oldStackIndexes) => {
  const newIndex = oldStackIndexes.map((index) => {
    console.log(hoverStackRight);
    if (hoverStackRight) {
      return index + 1;
    } else {
      return index - 1;
    }
  });

  return newIndex;
};
const clearStack = (oldStackIndexes, row) => {
  oldStackIndexes.forEach((index) => {
    row[index].setAttribute("hovering", false);
  });
};
const updateStack = (newStackIndexes, row) => {
  newStackIndexes.forEach((index) => {
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
