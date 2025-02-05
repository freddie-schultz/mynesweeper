let boardSize = 10
let numberOfBombs = 5
let bombIndexes = []
let gameOver = false
let board = []
let boardTable = document.querySelector('#board')
let cellsArray = []

function initBoard() {
  let idCounter = 0
  for (x = 0; x < boardSize; x++) {
    for (y = 0; y < boardSize; y++) {
      let newCell = {}
      newCell.x = x
      newCell.y = y
      newCell.isHidden = true
      newCell.isFlagged = false
      newCell.isBomb = false
      newCell.id = idCounter++
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
  let idCounter = 0
  for (let i = 0; i < boardSize; i++) {
    boardTable.appendChild(document.createElement('tr'))

    for (let i = 0; i < boardSize; i++) {
      let tableCell = document.createElement('td')
      tableCell.className = 'cell'
      tableCell.id = idCounter++
      boardTable.lastElementChild.appendChild(tableCell)
    }
  }

  for (let i in board) {
    board[i].surroundingBombs = checkSurroundingCells(board[i])
  }

  cellsArray = Array.from(document.querySelectorAll('.cell'))
  for (let i in cellsArray) {
    cellsArray[i].addEventListener('click', cellClicked)
  }
}

function updateBoardDisplay() {
  if (gameOver) {
    console.log('You lose!')
    setAllCellsVisible()
  }

  if (checkForWin()) {
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
  if (cell.isHidden == false) {
    return
  }

  cell.isHidden = false

  if (cell.isBomb) {
    gameOver = true
  }

  if (cell.surroundingBombs == 0 && !cell.isBomb) {
    let surroundingCells = getSurroundingCells(cell)
    for (let i in surroundingCells) {
      revealCell(surroundingCells[i])
    }
  }

  updateBoardDisplay()
}

function cellClicked(e) {
  if (gameOver) {
    return
  }

  element = e.target
  cell = board[element.id]

  revealCell(cell)
}

function bomblessBoard() {
  return board.filter((cell) => {
    return cell.isBomb == false
  })
}

initBoard()
// console.log(bombIndexes)
document.querySelector('#revealBoard').addEventListener('click', revealBoard)
