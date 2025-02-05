let boardSize = 10
let numberOfBombs = 10
let bombIndexes = []

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
    cellsArray[i].addEventListener('click', clickCell)
  }
}

function updateBoardDisplay() {
  for (let i in board) {
    if (!board[i].isHidden) {
      if (board[i].isBomb) {
        cellsArray[i].textContent = 'x'
      } else {
        if (board[i].surroundingBombs > 0) {
          cellsArray[i].textContent = board[i].surroundingBombs
        }
      }
    }
  }
}

function revealBoard() {
  for (let i in board) {
    if (board[i].isBomb) {
      cellsArray[i].textContent = 'x'
    } else {
      if (board[i].surroundingBombs > 0) {
        cellsArray[i].textContent = board[i].surroundingBombs
      }
    }
  }
}

function checkSurroundingCells(cell) {
  let surroundingBombs = 0
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      let checkCell = getCell(cell.x + x, cell.y + y)
      if (checkCell != null) {
        if (checkCell.isBomb) {
          surroundingBombs++
        }
      }
    }
  }

  if (cell.isBomb) {
    surroundingBombs--
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

function clickCell(e) {
  e.target.setAttribute('style', 'background-color: white')
  board[e.target.id].isHidden = false
  updateBoardDisplay()
}

function bomblessBoard() {
  return board.filter((cell) => {
    return cell.isBomb == false
  })
}

initBoard()
// console.log(bombIndexes)
document.querySelector('#revealBoard').addEventListener('click', revealBoard)
