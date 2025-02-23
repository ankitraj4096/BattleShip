const playerGrid = document.getElementById('player-grid');
const computerGrid = document.getElementById('computer-grid');
const message = document.getElementById('message');
const gameOverScreen = document.getElementById('game-over');
const gameOverMessage = document.getElementById('game-over-message');
const restartButton = document.getElementById('restart-button');
const playerScore = document.getElementById('player-score');
const computerScore = document.getElementById('computer-score');
const no_of_attack = 5;
const gridSize = 10;
const shipLengths = [5, 4, 3, 3, 2];

let playerShips = [];
let computerShips = [];
let computerAttacks = [];
let playerHits = 0;
let computerHits = 0;

function createGrid(grid, isPlayer) {
  grid.innerHTML = '';
  for (let i = 0; i < gridSize * gridSize; i++) {
    const cell = document.createElement('div');
    cell.dataset.index = i;
    if (isPlayer) {
      cell.addEventListener('click', placeShip);
    } else {
      cell.addEventListener('click', attackComputer);
    }
    grid.appendChild(cell);
  }
}

function placeComputerShips() {
  computerShips = placeShipsRandomly();
}

function placeShipsRandomly() {
  const ships = [];
  for (const length of shipLengths) {
    let placed = false;
    while (!placed) {
      const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * gridSize);
      const col = Math.floor(Math.random() * gridSize);
      if (canPlaceShip(row, col, length, direction, ships)) {
        ships.push({ row, col, length, direction });
        placed = true;
      }
    }
  }
  return ships;
}

function canPlaceShip(row, col, length, direction, ships) {
  if (direction === 'horizontal' && col + length > gridSize) return false;
  if (direction === 'vertical' && row + length > gridSize) return false;
  for (let i = 0; i < length; i++) {
    const newRow = direction === 'vertical' ? row + i : row;
    const newCol = direction === 'horizontal' ? col + i : col;
    if (ships.some(ship => ship.row === newRow && ship.col === newCol)) return false;
  }
  return true;
}

function placeShip(event) {
  if (playerShips.length >= shipLengths.length) {
    return;
  }

  const index = event.target.dataset.index;
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;

  if (canPlaceShip(row, col, 2, 'horizontal', playerShips)) {
    playerShips.push({ row, col, length: 2, direction: 'horizontal' });
    event.target.style.backgroundColor = '#ffcc00';
  }

  if (playerShips.length === shipLengths.length) {
    message.textContent = 'All ships placed! Attack the computer!';
    const playerCells = playerGrid.querySelectorAll('div');
    playerCells.forEach(cell => {
      cell.removeEventListener('click', placeShip);
    });
  }
}

function attackComputer(event) {
  const index = event.target.dataset.index;
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  if (computerShips.some(ship => ship.row === row && ship.col === col)) {
    event.target.classList.add('hit');
    message.textContent = 'Hit!';
    playerHits++;
    playerScore.textContent = playerHits;
    checkWin('player');
  } else {
    event.target.classList.add('miss');
    message.textContent = 'Miss!';
  }
  event.target.removeEventListener('click', attackComputer);
  computerAttack();
}

function computerAttack() {
  let row, col;
  do {
    row = Math.floor(Math.random() * gridSize);
    col = Math.floor(Math.random() * gridSize);
  } while (computerAttacks.some(attack => attack.row === row && attack.col === col));
  computerAttacks.push({ row, col });
  const cell = playerGrid.children[row * gridSize + col];
  if (playerShips.some(ship => ship.row === row && ship.col === col)) {
    cell.classList.add('hit');
    cell.style.backgroundColor = '#00ff00';
    message.textContent = 'Computer hit your ship!';
    computerHits++;
    computerScore.textContent = computerHits;
    checkWin('computer');
  } else {
    cell.classList.add('miss');
    cell.style.backgroundColor = '#4444ff';
    message.textContent = 'Computer missed!';
  }
}

function checkWin(winner) {
  if (winner === 'player' && playerHits === no_of_attack) {
    endGame('Congratulations! You won!');
  } else if (winner === 'computer' && computerHits === no_of_attack) {
    endGame('Game Over! The computer won!');
  }
}

function endGame(messageText) {
  gameOverMessage.textContent = messageText;
  gameOverScreen.style.display = 'block';
  computerGrid.removeEventListener('click', attackComputer);
}

restartButton.addEventListener('click', () => {
  playerShips = [];
  computerShips = [];
  computerAttacks = [];
  playerHits = 0;
  computerHits = 0;
  playerScore.textContent = 0;
  computerScore.textContent = 0;
  gameOverScreen.style.display = 'none';
  message.textContent = 'Place your ships!';
  createGrid(playerGrid, true);
  createGrid(computerGrid, false);
  placeComputerShips();
});

function init() {
  createGrid(playerGrid, true);
  createGrid(computerGrid, false);
  placeComputerShips();
}

init();