const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const canvasSize = 400;
const snakeColor = 'lime';
const foodColor = 'red';
let snake = [{x: 100, y: 100}];
let food = getRandomFoodPosition();
let dx = gridSize;
let dy = 0;
let changingDirection = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameEnded = false;
let isPaused = false;

const gameOverSound = document.getElementById("gameOverSound");
const eatSound = document.getElementById("eatSound");
const moveSound = document.getElementById("moveSound");

function drawSnakePart(snakePart) {
    ctx.fillStyle = snakeColor;
    ctx.fillRect(snakePart.x, snakePart.y, gridSize, gridSize);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, gridSize, gridSize);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        updateScore();
        eatSound.play();
        food = getRandomFoodPosition();
    } else {
        snake.pop();
    }
}

function getRandomFoodPosition() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
        foodY = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
    } while (snake.some(part => part.x === foodX && part.y === foodY));
    return {x: foodX, y: foodY};
}

function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
    if (score > highScore) {
        highScore = score;
        document.getElementById("high-score").innerText = `High Score: ${highScore}`;
        localStorage.setItem("highScore", highScore);
    }
}

function gameLoop() {
    if (isPaused) return;
    if (hasGameEnded()) {
        displayGameOver();
        return;
    }
    changingDirection = false;
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    setTimeout(gameLoop, 100);
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function displayGameOver() {
    gameEnded = true;
    gameOverSound.play();
    ctx.fillStyle = 'red';
    ctx.font = '50px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvasSize / 2, canvasSize / 2);
    document.getElementById("restartButton").style.display = "block";
    document.getElementById("instructions").classList.add("hidden");
}

function startGame() {
    snake = [{x: 100, y: 100}];
    dx = gridSize;
    dy = 0;
    score = 0;
    gameEnded = false;
    isPaused = false;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("pauseButton").classList.remove("active");
    document.getElementById("instructions").classList.remove("hidden");
    clearCanvas();
    drawFood();
    drawSnake();
    gameLoop();
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        document.getElementById("pauseButton").innerText = "Resume";
        document.getElementById("pauseButton").classList.add("active");
    } else {
        document.getElementById("pauseButton").innerText = "Pause";
        document.getElementById("pauseButton").classList.remove("active");
        gameLoop();
    }
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;
    const goingUp = dy === -gridSize;
    const goingDown = dy === gridSize;
    const goingRight = dx === gridSize;
    const goingLeft = dx === -gridSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -gridSize;
        dy = 0;
        moveSound.play();
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = gridSize;
        dy = 0;
        moveSound.play();
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -gridSize;
        moveSound.play();
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = gridSize;
        moveSound.play();
    }
}

startGame();
