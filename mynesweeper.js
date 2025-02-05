let boardSize = 10
let numberOfBombs = 10

let gameWon = false
let gameLost = false
let gameOver = false

let board = []
let boardTable = document.querySelector('#board')
let tableCellsArray = []

// Initialize the board array with cells
// Set bombs into cells
// Set the surroundingBombs property for each cell
// Create the html table

function resetGame() {
  gameWon = false
  gameLost = false
  gameOver = false
  board = []
  tableCellsArray = []

  while (boardTable.children.length > 0) {
    boardTable.removeChild(boardTable.childNodes[0])
  }

  initBoard()
}

function initBoard() {
  for (x = 0; x < boardSize; x++) {
    for (y = 0; y < boardSize; y++) {
      let newCell = {}
      newCell.x = x
      newCell.y = y
      newCell.isHidden = true
      newCell.isFlagged = false
      newCell.isBomb = false
      board.push(newCell)
    }
  }

  setBombs()

  for (let i in board) {
    board[i].surroundingBombs = checkSurroundingCells(board[i])
  }

  generateBoardInHTML()
  updateBoardDisplay()
}

// Generate an array of bomb cell indexes and set those cells to .isBomb = true
function setBombs() {
  let bombIndexes = []

  while (bombIndexes.length < numberOfBombs) {
    let randomCellIndex = Math.floor(Math.random() * board.length)
    if (!bombIndexes.includes(randomCellIndex)) {
      bombIndexes.push(randomCellIndex)
    }
  }

  for (let i in bombIndexes) {
    board[bombIndexes[i]].isBomb = true
  }
}

// Generate the board html table and add event listeners for every cell
function generateBoardInHTML() {
  for (let i = 0; i < boardSize; i++) {
    boardTable.appendChild(document.createElement('tr'))

    for (let i = 0; i < boardSize; i++) {
      let tableCell = document.createElement('td')
      tableCell.className = 'cell'
      boardTable.lastElementChild.appendChild(tableCell)
    }
  }

  tableCellsArray = Array.from(document.querySelectorAll('.cell'))

  for (let i in tableCellsArray) {
    tableCellsArray[i].addEventListener('click', cellLeftClicked)
    tableCellsArray[i].addEventListener('contextmenu', cellRightClicked)
  }
}

function updateBoardDisplay() {
  if (gameOver) {
    return
  }

  if (gameLost) {
    console.log('You lose!')
    gameOver = true
    setAllCellsVisible()
  }

  if (checkForWin()) {
    gameWon = true
    gameOver = true
    console.log('You win!')
  }

  for (let i in board) {
    if (!board[i].isHidden) {
      if (board[i].isBomb) {
        tableCellsArray[i].textContent = 'x'
        tableCellsArray[i].setAttribute('style', 'background-color: red')
      } else {
        tableCellsArray[i].setAttribute('style', 'background-color: white')
        if (board[i].surroundingBombs > 0) {
          tableCellsArray[i].textContent = board[i].surroundingBombs
        }
      }
    } else if (board[i].isFlagged) {
      tableCellsArray[i].textContent = 'F'
      tableCellsArray[i].setAttribute('style', 'background-color: #00ccff')
    } else if (!board[i].isFlagged) {
      tableCellsArray[i].textContent = ''
      tableCellsArray[i].setAttribute('style', 'background-color: green')
    }
  }
}

function numberOfHiddenCells() {
  return board.filter((cell) => {
    return cell.isHidden
  }).length
}

function checkForWin() {
  let hiddenCells = numberOfHiddenCells()

  return hiddenCells == numberOfBombs
}

function setAllCellsVisible() {
  for (let i in board) {
    board[i].isHidden = false
  }
}

function revealBoard() {
  setAllCellsVisible()
  updateBoardDisplay()
}

function checkSurroundingCells(cell) {
  let surroundingBombs = 0
  let surroundingCells = getSurroundingCells(cell)

  for (let i in surroundingCells) {
    if (surroundingCells[i].isBomb) {
      surroundingBombs++
    }
  }

  return surroundingBombs
}

function getCell(x, y) {
  if (x < 0 || y < 0 || x >= boardSize || y >= boardSize) {
    return null
  }

  for (let i in board) {
    if (board[i].x == x && board[i].y == y) {
      return board[i]
    }
  }
}

function getSurroundingCells(cell) {
  let surroundingCells = []

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      let checkCell = getCell(cell.x + x, cell.y + y)
      if (checkCell != null) {
        if (checkCell != cell) {
          surroundingCells.push(checkCell)
        }
      }
    }
  }

  return surroundingCells
}

function revealCell(cellIndex) {
  let cell = board[cellIndex]

  // First click is a bomb
  if (cell.isBomb && numberOfHiddenCells() == board.length) {
    let cellIndex = getCellIndex(cell)
    do {
      resetGame()
    } while (board[cellIndex].isBomb)
  }

  cell = board[cellIndex]

  if (cell.isHidden == false || gameOver) {
    return
  }

  cell.isHidden = false

  if (cell.isBomb) {
    gameLost = true
    updateBoardDisplay()
    return
  }

  if (cell.surroundingBombs == 0) {
    let surroundingCells = getSurroundingCells(cell)
    for (let i in surroundingCells) {
      revealCell(getCellIndex(surroundingCells[i]))
    }
  }

  updateBoardDisplay()
}

function flagCell(cell) {
  if (cell.isHidden == false || gameOver) {
    return
  }

  cell.isFlagged = !cell.isFlagged

  updateBoardDisplay()
}

function cellLeftClicked(e) {
  revealCell(getTableCellIndex(e.target))
}

function cellRightClicked(e) {
  e.preventDefault()

  cell = board[getTableCellIndex(e.target)]

  flagCell(cell)
}

function getTableCellIndex(tableCell) {
  return tableCellsArray.indexOf(tableCell)
}

function getCellIndex(cell) {
  return board.indexOf(cell)
}

// function bomblessBoard() {
//   return board.filter((cell) => {
//     return cell.isBomb == false
//   })
// }

resetGame()

document.querySelector('#revealBoard').addEventListener('click', revealBoard)
document.querySelector('#resetGame').addEventListener('click', resetGame)
