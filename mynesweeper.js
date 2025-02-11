let defaultBoardSizeX = 12
let defaultBoardSizeY = 12
let defaultNumberOfBombs = 25

let maxResets = 1000
let minBoardWidth = 3
let minBoardHeight = 3
let maxBoardWidth = 20
let maxBoardHeight = 20

let boardWidthInput = document.querySelector('#boardWidth')
let boardHeightInput = document.querySelector('#boardHeight')
let numberOfBombsInput = document.querySelector('#numberOfBombs')

boardWidthInput.value = defaultBoardSizeX
boardHeightInput.value = defaultBoardSizeY
numberOfBombsInput.value = defaultNumberOfBombs

let boardSizeX = boardWidthInput.value
let boardSizeY = boardHeightInput.value
let numberOfBombs = numberOfBombsInput.value

let gameWon = false
let gameLost = false
let gameOver = false

let board = []
let boardTable = document.querySelector('#board')
let tableCellsArray = []

function saveSettings() {
  let boardWidthInputValue = Number(boardWidthInput.value)
  let boardHeightInputValue = Number(boardHeightInput.value)
  let numberOfBombsInputValue = Number(numberOfBombsInput.value)

  console.log('width: ' + boardWidthInputValue)
  console.log('height: ' + boardHeightInputValue)
  console.log('bombs: ' + numberOfBombsInputValue)

  if (!Number.isInteger(boardWidthInputValue)) {
    alert('Board width must be an integer')
    return
  }

  if (!Number.isInteger(boardHeightInputValue)) {
    alert('Board height must be an integer')
    return
  }

  if (!Number.isInteger(numberOfBombsInputValue)) {
    alert('Number of bombs must be an integer')
    return
  }

  if (
    boardWidthInputValue > maxBoardWidth ||
    boardWidthInputValue < minBoardWidth
  ) {
    alert(`Board width must be between ${minBoardWidth} and ${maxBoardWidth}`)
    return
  }

  if (
    boardHeightInputValue > maxBoardHeight ||
    boardHeightInputValue < minBoardHeight
  ) {
    alert(
      `Board height must be between ${minBoardHeight} and ${maxBoardHeight}`
    )
    return
  }

  if (numberOfBombsInputValue > boardWidthInputValue * boardHeightInputValue) {
    alert('Too many bombs')
    return
  }

  boardSizeX = boardWidthInputValue
  boardSizeY = boardHeightInputValue
  numberOfBombs = numberOfBombsInputValue

  resetGame()
}

// Reset global arrays
// Reset HTML table
// Reinitialize
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

// Initialize the board array with cells
// Set bombs into cells
// Set the surroundingBombs property for each cell
// Create the HTML table
function initBoard() {
  for (x = 0; x < boardSizeX; x++) {
    for (y = 0; y < boardSizeY; y++) {
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
  for (let i = 0; i < boardSizeY; i++) {
    boardTable.appendChild(document.createElement('tr'))

    for (let i = 0; i < boardSizeX; i++) {
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

  checkForWin()

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
  if (numberOfHiddenCells() == numberOfBombs) {
    gameWon = true
    gameOver = true
    console.log('You win!')
  }
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

// Returns the number of surrounding cells that are bombs
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

// Returns the cell object with the supplied x, y co-ordinates
function getCell(x, y) {
  if (x < 0 || y < 0 || x >= boardSizeX || y >= boardSizeY) {
    return null
  }

  for (let i in board) {
    if (board[i].x == x && board[i].y == y) {
      return board[i]
    }
  }
}

// Returns an array of cells that surround the supplied cell
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

// Reveals the cell at the given cell index
// Cell index is used so the game can be reset repeatedly if the first cell clicked is a bomb
function revealCell(cellIndex) {
  // First click
  if (numberOfHiddenCells() == board.length) {
    // If first click is not a blank cell, keep resetting until it is
    if (
      board[cellIndex].isBomb ||
      checkSurroundingCells(board[cellIndex]) > 0
    ) {
      let resetCount = 0
      do {
        resetGame()
        if (resetCount++ > maxResets) {
          alert(
            `Error: Cannot find valid game after ${maxResets} attempts. Try using less bombs or a bigger board.`
          )
          return
        }
      } while (
        board[cellIndex].isBomb ||
        checkSurroundingCells(board[cellIndex]) > 0
      )
    }
  }

  let cell = board[cellIndex]

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

// Toggles a hidden cell between flagged and not flagged
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

resetGame()

document.querySelector('#revealBoard').addEventListener('click', revealBoard)
document.querySelector('#resetGame').addEventListener('click', resetGame)
document.querySelector('#saveSettings').addEventListener('click', saveSettings)
