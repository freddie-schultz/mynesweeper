let boardSize = 12
let numberOfBombs = 1
let bombIndexes = []
let gameWon = false
let gameLost = false
let gameOver = false
let board = []
let boardTable = document.querySelector('#board')
let cellsArray = []

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
  generateBoard()
  updateBoardDisplay()
}

function setBombs() {
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

function generateBoard() {
  for (let i = 0; i < boardSize; i++) {
    boardTable.appendChild(document.createElement('tr'))

    for (let i = 0; i < boardSize; i++) {
      let tableCell = document.createElement('td')
      tableCell.className = 'cell'
      boardTable.lastElementChild.appendChild(tableCell)
    }
  }

  for (let i in board) {
    board[i].surroundingBombs = checkSurroundingCells(board[i])
  }

  cellsArray = Array.from(document.querySelectorAll('.cell'))
  for (let i in cellsArray) {
    cellsArray[i].addEventListener('click', cellLeftClicked)
    cellsArray[i].addEventListener('contextmenu', cellRightClicked)
  }
}

function updateBoardDisplay() {
  if (gameOver) {
    return
  }

  if (gameLost) {
    console.log('You lose!')
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
        cellsArray[i].textContent = 'x'
        cellsArray[i].setAttribute('style', 'background-color: red')
      } else {
        cellsArray[i].setAttribute('style', 'background-color: white')
        if (board[i].surroundingBombs > 0) {
          cellsArray[i].textContent = board[i].surroundingBombs
        }
      }
    } else if (board[i].isFlagged) {
      cellsArray[i].textContent = 'F'
      cellsArray[i].setAttribute('style', 'background-color: blue')
    } else if (!board[i].isFlagged) {
      cellsArray[i].textContent = ''
      cellsArray[i].setAttribute('style', 'background-color: green')
    }
  }
}

function checkForWin() {
  let numberOfHiddenCells = 0
  for (let i in board) {
    if (board[i].isHidden) {
      numberOfHiddenCells++
    }
  }
  console.log('hidden: ' + numberOfHiddenCells + ', bombs: ' + numberOfBombs)
  return numberOfHiddenCells == numberOfBombs
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

function revealCell(cell) {
  if (cell.isHidden == false || gameOver) {
    return
  }

  cell.isHidden = false

  if (cell.isBomb) {
    gameLost = true
    updateBoardDisplay()
    return
  }

  if (cell.surroundingBombs == 0 && !cell.isBomb) {
    let surroundingCells = getSurroundingCells(cell)
    for (let i in surroundingCells) {
      revealCell(surroundingCells[i])
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
  cell = board[getTableCellIndex(e.target)]

  revealCell(cell)
}

function cellRightClicked(e) {
  e.preventDefault()

  cell = board[getTableCellIndex(e.target)]

  flagCell(cell)
}

function getTableCellIndex(tableCell) {
  return cellsArray.indexOf(tableCell)
}

function bomblessBoard() {
  return board.filter((cell) => {
    return cell.isBomb == false
  })
}

initBoard()

document.querySelector('#revealBoard').addEventListener('click', revealBoard)
