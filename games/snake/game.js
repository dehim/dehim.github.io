(function () {
  const board = document.getElementById("game-board");
  const ctx = board.getContext("2d");
  const scoreEl = document.getElementById("score");
  const bestScoreEl = document.getElementById("best-score");
  const messageEl = document.getElementById("game-message");
  const startButton = document.getElementById("start-button");
  const pauseButton = document.getElementById("pause-button");
  const restartButton = document.getElementById("restart-button");
  const directionButtons = document.querySelectorAll("[data-direction]");

  const gridSize = 20;
  const cellSize = board.width / gridSize;
  const storageKey = "dehim-snake-best-score";
  const tickMs = 120;

  let snake;
  let food;
  let direction;
  let nextDirection;
  let score;
  let bestScore;
  let timerId;
  let state;

  const directions = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  function init() {
    bestScore = Number(localStorage.getItem(storageKey)) || 0;
    resetGame();
    bindEvents();
    updateControls();
    draw();
  }

  function resetGame() {
    snake = [
      { x: 8, y: 10 },
      { x: 7, y: 10 },
      { x: 6, y: 10 }
    ];
    direction = directions.right;
    nextDirection = directions.right;
    score = 0;
    state = "ready";
    placeFood();
    stopTimer();
    updateScore();
    showMessage("按开始游戏");
  }

  function bindEvents() {
    startButton.addEventListener("click", startGame);
    pauseButton.addEventListener("click", togglePause);
    restartButton.addEventListener("click", restartGame);

    document.addEventListener("keydown", function (event) {
      const keyMap = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right"
      };

      const requested = keyMap[event.key];
      if (!requested) {
        return;
      }

      event.preventDefault();
      setDirection(requested);
      if (state === "ready") {
        startGame();
      }
    });

    directionButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setDirection(button.dataset.direction);
        if (state === "ready") {
          startGame();
        }
      });
    });
  }

  function startGame() {
    if (state === "running") {
      return;
    }

    if (state === "gameover") {
      resetGame();
    }

    state = "running";
    hideMessage();
    stopTimer();
    timerId = window.setInterval(tick, tickMs);
    updateControls();
  }

  function togglePause() {
    if (state === "running") {
      state = "paused";
      stopTimer();
      showMessage("已暂停");
    } else if (state === "paused") {
      state = "running";
      hideMessage();
      stopTimer();
      timerId = window.setInterval(tick, tickMs);
    }

    updateControls();
  }

  function restartGame() {
    resetGame();
    startGame();
  }

  function tick() {
    direction = nextDirection;

    const head = snake[0];
    const nextHead = {
      x: head.x + direction.x,
      y: head.y + direction.y
    };

    if (hasCollision(nextHead)) {
      endGame();
      return;
    }

    snake.unshift(nextHead);

    if (nextHead.x === food.x && nextHead.y === food.y) {
      score += 1;
      updateScore();
      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function setDirection(name) {
    const requested = directions[name];
    if (!requested) {
      return;
    }

    const isReverse = requested.x + direction.x === 0 && requested.y + direction.y === 0;
    if (isReverse) {
      return;
    }

    nextDirection = requested;
  }

  function hasCollision(cell) {
    const hitsWall = cell.x < 0 || cell.x >= gridSize || cell.y < 0 || cell.y >= gridSize;
    const hitsBody = snake.some(function (segment) {
      return segment.x === cell.x && segment.y === cell.y;
    });

    return hitsWall || hitsBody;
  }

  function placeFood() {
    let nextFood;

    do {
      nextFood = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
      };
    } while (snake.some(function (segment) {
      return segment.x === nextFood.x && segment.y === nextFood.y;
    }));

    food = nextFood;
  }

  function draw() {
    ctx.fillStyle = "#172033";
    ctx.fillRect(0, 0, board.width, board.height);

    drawGrid();
    drawFood();
    drawSnake();
  }

  function drawGrid() {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";
    ctx.lineWidth = 1;

    for (let i = 1; i < gridSize; i += 1) {
      const position = i * cellSize;
      ctx.beginPath();
      ctx.moveTo(position, 0);
      ctx.lineTo(position, board.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, position);
      ctx.lineTo(board.width, position);
      ctx.stroke();
    }
  }

  function drawSnake() {
    snake.forEach(function (segment, index) {
      ctx.fillStyle = index === 0 ? "#7ee2a8" : "#45c982";
      drawCell(segment, 5);
    });
  }

  function drawFood() {
    ctx.fillStyle = "#f45b69";
    drawCell(food, cellSize / 2);
  }

  function drawCell(cell, radius) {
    const inset = 3;
    const x = cell.x * cellSize + inset;
    const y = cell.y * cellSize + inset;
    const size = cellSize - inset * 2;

    roundedRect(x, y, size, size, radius);
    ctx.fill();
  }

  function roundedRect(x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
  }

  function updateScore() {
    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem(storageKey, String(bestScore));
    }

    scoreEl.textContent = String(score);
    bestScoreEl.textContent = String(bestScore);
  }

  function endGame() {
    state = "gameover";
    stopTimer();
    showMessage("游戏结束，得分 " + score);
    updateControls();
  }

  function stopTimer() {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = null;
    }
  }

  function showMessage(text) {
    messageEl.textContent = text;
    messageEl.classList.remove("hidden");
  }

  function hideMessage() {
    messageEl.classList.add("hidden");
  }

  function updateControls() {
    startButton.disabled = state === "running";
    pauseButton.disabled = state === "ready" || state === "gameover";
    pauseButton.textContent = state === "paused" ? "继续" : "暂停";
  }

  init();
}());
