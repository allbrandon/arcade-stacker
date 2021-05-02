// Makes thet table for stacker game
const initTable = (tableElem, numCols, numRows) => {
  // Makes a row with a specified number of columns
  const initRow = (numCols) => {
    const row = document.createElement("tr");
    // Loop to make a col element and add cols to it
    for (let index = 0; index < numCols; index++) {
      const col = document.createElement("td");
      col.classList.add("cell");
      row.appendChild(col);
    }
    return row;
  };

  // Makes rows
  for (let index = 0; index < numRows; index++) {
    tableElem.appendChild(initRow(numCols));
  }
};
const initGameBoard = () => {
  const table = document.getElementById("game-table");
  initTable(table, 7, 15);
};

window.addEventListener("DOMContentLoaded", initGameBoard);
