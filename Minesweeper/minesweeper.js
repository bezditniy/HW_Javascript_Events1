window.onload = () =>{

const TILE_STATUSES = {
  HIDDEN: "hidden",
  MINE: "mine",
  NUMBER: "number",
  MARKED: "marked",
}

// Функция которая создает поле игры;
function createBoard(boardSize, numberOfMines) {
  const board = [];
  const minePositions = getMinePositions(boardSize, numberOfMines);

  for (let x = 0; x < boardSize; x++) {
    const row = [];
    for (let y = 0; y < boardSize; y++) {
      const element = document.createElement("div");
      element.dataset.status = TILE_STATUSES.HIDDEN;

      const tile = {
        element,
        x,
        y,
        mine: minePositions.some(positionMatch.bind(null, { x, y })),
        get status() {
          return this.element.dataset.status;
        },
        set status(value) {
          this.element.dataset.status = value;
        },
      }

      row.push(tile);
    }
    board.push(row);
  }

  return board;
}

// Функция позволяющая отмечать мины метками
function markTile(tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) {
    return;
  }

  if (tile.status === TILE_STATUSES.MARKED) {
    tile.status = TILE_STATUSES.HIDDEN;
  } else {
    tile.status = TILE_STATUSES.MARKED;
  }
}

// Фнкция раскрывающая плитки
function revealTile(board, tile) {
  if (tile.status !== TILE_STATUSES.HIDDEN) {
    return;
  }

  if (tile.mine) {
    tile.status = TILE_STATUSES.MINE;
    return;
  }

  tile.status = TILE_STATUSES.NUMBER;
  const adjacentTiles = nearbyTiles(board, tile);
  const mines = adjacentTiles.filter(t => t.mine);
  if (mines.length === 0) {
    adjacentTiles.forEach(revealTile.bind(null, board));
  } else {
    tile.element.textContent = mines.length;
  }
}

// Функция проверяющая результат на победу, если результат вернул число или пустую плитку, игра продолжается
function checkWin(board) {
  return board.every(row => {
    return row.every(tile => {
      return (tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED)));
    });
  });
}

// Функция проверяющая результат на поражение, если результат вернул мину, игра прекращаеться
function checkLose(board) {
  return board.some(row => {
    return row.some(tile => {
      return tile.status === TILE_STATUSES.MINE;
    });
  });
}

// Получает позицию мин
function getMinePositions(boardSize, numberOfMines) {
  const positions = [];

  while (positions.length < numberOfMines) {
    const position = {
      x: randomNumber(boardSize),
      y: randomNumber(boardSize),
    }

    if (!positions.some(positionMatch.bind(null, position))) {
      positions.push(position);
    }
  }

  return positions;
}

// Функция на позиционирующее соответствие
function positionMatch(a, b) {
  return a.x === b.x && a.y === b.y;
}

// Рандомизирует поле
function randomNumber(size) {
  return Math.floor(Math.random() * size);
}

// Закрашивает пустые плитки или выставляет число на плитке с количеством мин поблизости 
function nearbyTiles(board, { x, y }) {
  const tiles = [];

  for (let xOffset = -1; xOffset <= 1; xOffset++) {
    for (let yOffset = -1; yOffset <= 1; yOffset++) {
      const tile = board[x + xOffset]?.[y + yOffset];
      if (tile) tiles.push(tile);
    }
  }

  return tiles;
}

const BOARD_SIZE = 8; // Размер поля
const NUMBER_OF_MINES = 10; // Количество мин

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector(".board");
const minesLeftText = document.querySelector("[data-mine-count]");
const messageText = document.querySelector(".subtext");
const restartBtn = document.querySelector(".restartBtn");
const timer = document.querySelector("#stopwatch");

// Создание таймера
let time = {
  hr: 0,
  min: 0,
  sec: 0,
  stoptime: true, 
}

// Запуск таймер
function startimer() {
  if (time.stoptime == true) {
    time.stoptime = false;
    timerCycle();
  }
}

// Остановка таймера
function stopTimer() {
  if (time.stoptime == false) {
    time.stoptime = true;
  }
}

// Цикл таймера
function timerCycle() {
  
  if (time.stoptime == false) {
    time.sec = parseInt(time.sec);
    time.min = parseInt(time.min);
    time.hr = parseInt(time.hr);

    time.sec += + 1;

    if (time.sec == 60) {
      time.min +=  1;
      time.sec = 0;
    }
    if (time.min == 60) {
      time.hr += 1;
      time.min = 0;
      time.sec = 0;
    }

    if (time.sec < 10 || time.sec == 0) {
      time.sec = "0" + time.sec;
    }
    if (time.min < 10 || time.min == 0) {
      time.min = "0" + time.min;
    }
    if (time.hr < 10 || time.hr == 0) {
      time.hr = "0" + time.hr;
    }

    timer.innerHTML = time.hr + ":" + time.min + ":" + time.sec;

    setTimeout(timerCycle, 1000);
  }
}

// Зaдает работоспособность кнопок (левая раскрывает плитку, правая ставит флажок)
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener("click", () => {
            revealTile(board, tile);
            checkGameEnd();
            startimer();
        });
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        });
    }); 
});
boardElement.style.setProperty("--size", BOARD_SIZE);
minesLeftText.textContent = NUMBER_OF_MINES;


// Отсчитывает количество оставшихся мин
function listMinesLeft() {
    const markedTliesCount = board.reduce((count, row) => {
       return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0);

    minesLeftText.textContent = NUMBER_OF_MINES - markedTliesCount
}

// Проверка результата checkLose и checkWin
function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if (win || lose) {
        boardElement.addEventListener("click", function() {
          stopTimer();
          delete(stopTimer());
          boardElement.addEventListener("click", stopProp, {capture: true});
        })
        boardElement.addEventListener("contextmenu", stopProp, {capture: true})  
      
    }

    if (win) {  
        messageText.textContent = "You Win"
        restartBtn.style.visibility = "visible";
    }
    if (lose) {
        messageText.textContent = "You Lose"
        restartBtn.style.visibility = "visible";
        board.forEach(row => {
            row.forEach(tile => {
                if (tile.status === TILE_STATUSES.MARKED) markTile(tile);
                if (tile.mine) revealTile(board, tile);
            });
        });
    }
}

// Блокирует любое нажатие по игровому полю
function stopProp(e) {
    e.stopImmediatePropagation()
}

}