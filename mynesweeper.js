let boardSize = 10
let numberOfBombs = 10
let bombIndexes = []

let board = []

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

function displayBoard() {}

function bomblessBoard() {
  return board.filter((cell) => {
    return cell.isBomb == false
  })
}

initBoard()
console.log(board)
console.log(bomblessBoard())
console.log(bombIndexes)
