const mapEl = document.querySelector('.map');
const gameOverContainerEl = document.querySelector('.game-over-container');

let gameInterval;
let speedInterval;
let points = 0;
let direction = 1;
let _orientation = '';
let lastKeyPress = 'ArrowRight';

let isGameOver = false;
let snakeElementsPositions = [];
let foodTop, foodLeft;
let speed = 300;

document.addEventListener('keydown', (event) => {

  if (event.code === lastKeyPress && _orientation !== '') {
    return;
  }

  switch (event.code) {
    case 'ArrowUp':
      if (lastKeyPress === 'ArrowDown') {
        return;
      }
      direction = -1;
      _orientation = 'v';
      break;
    case 'ArrowDown':
      if (lastKeyPress === 'ArrowUp') {
        return;
      }
      direction = 1;
      _orientation = 'v'
      break;
    case 'ArrowLeft':
      if (lastKeyPress === 'ArrowRight') {
        return;
      }
      direction = -1;
      _orientation = 'h'
      break;
    case 'ArrowRight':
      if (lastKeyPress === 'ArrowLeft') {
        return;
      }
      direction = 1;
      _orientation = 'h'
      break;
    default:
      return;
  }

  // vreau sa miscam snake-ul
  moveSnake();
  lastKeyPress = event.code
})

document.querySelector('.restart')
  .addEventListener('click', () => {

    mapEl.querySelectorAll('.snake').forEach(el => {
      el.remove();
    })

    initSnake();

    gameOverContainerEl.style.display = 'none';

    _orientation = '';
    isGameOver = false;

    speed = 300;

    points = 0;
    setPointsInInterface();

    startGame();
  })

function startGame() {
  gameInterval = setInterval(() => {
    moveSnake();
  }, speed);
}

function startSpeedInterval() {
  speedInterval = setInterval(() => {
    decreaseSpeed()
  }, 1000)
}

function moveSnake() {
  if (_orientation === '' || isGameOver) {
    return;
  }

  if (!speedInterval) {
    startSpeedInterval();
  }

  const left = getLeftPosition();
  const top = getTopPosition();

  const newSnakeHead = document.createElement('span');
  newSnakeHead.classList.add('snake', 'snake-element');

  let newTop, newLeft;

  if (_orientation === 'h') {
    newTop = top;
    newLeft = left + (10 * direction)
  }

  if (_orientation === 'v') {
    newTop = top + (10 * direction);
    newLeft = left;
  }

  newSnakeHead.style.top = newTop + 'px';
  newSnakeHead.style.left = newLeft + 'px';

  snakeElementsPositions.push({
    left: newLeft,
    top: newTop,
  })

  mapEl.appendChild(newSnakeHead);

  if (getLeftPosition() === foodLeft && getTopPosition() === foodTop) {
    // am ajuns la mancare
    const foodEl = document.querySelector('.food');
    setRandomPositionForFood(foodEl);
    points++;
    setPointsInInterface();

    if (points % 1 === 0) {
      decreaseSpeed();
    }

  } else {
    // is altundeva pe map
    document.querySelector('.snake-element:first-of-type')
      .remove();

    snakeElementsPositions.shift();
  }

  checkGameOver();
}

function checkGameOver() {

  const left = getLeftPosition();
  const top = getTopPosition();

  if (left < 0 || left > 290 || top < 0 || top > 290) {
    gameOver();
    return;
  }

  const hit = snakeElementsPositions.slice(0, -1).some(pos => {
    if (pos.left === left && pos.top === top) {
      return true
    } else {
      return false
    }
  })

  if (hit) {
    gameOver();
  }
}

function gameOver() {
  clearInterval(gameInterval);
  gameOverContainerEl.style.display = 'block';
  isGameOver = true;
  clearInterval(speedInterval);
  speedInterval = null;
}

function getLeftPosition() {
  const snakeHead = getSnakeHead();
  return snakeHead.offsetLeft;
}

function getTopPosition() {
  const snakeHead = getSnakeHead();
  return snakeHead.offsetTop;
}

function getSnakeHead() {
  return document.querySelector('.snake-element:last-of-type');
}

function generateFood() {
  const foodEl = document.createElement('div');
  foodEl.classList.add('food')

  setRandomPositionForFood(foodEl);

  mapEl.appendChild(foodEl);
}

function setRandomPositionForFood(foodEl) {
  foodTop = getRandomInt(30) * 10;
  foodLeft = getRandomInt(30) * 10;

  foodEl.style.top = foodTop + 'px';
  foodEl.style.left = foodLeft + 'px';
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function initSnake() {
  snakeElementsPositions = [
    { left: 120, top: 130 },
    { left: 130, top: 130 },
    { left: 140, top: 130 },
  ]

  snakeElementsPositions.forEach(element => {
    const span = document.createElement('span');
    span.classList.add('snake', 'snake-element');
    span.style.top = element.top + 'px';
    span.style.left = element.left + 'px';
    mapEl.appendChild(span);
  })
}

function setPointsInInterface() {
  document.querySelector('.points-container strong')
    .innerText = points;
}

function decreaseSpeed() {
  speed = speed - 50 > 50 ? speed - 50 : 50;
  clearInterval(gameInterval);
  startGame();
}

initSnake();

startGame();

generateFood();
