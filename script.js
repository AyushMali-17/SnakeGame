const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const canvasSize = 600;
const snakeColor = 'lime';
const foodColor = 'red';
const obstacleColor = 'gray';
const obstacleSize = 40;
let snake = [{x: 100, y: 100}];
let food = getRandomFoodPosition();
let obstacles = generateObstacles();
let dx = gridSize;
let dy = 0;
let changingDirection = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let level = 1;
let speed = 100;
let gameEnded = false;
let isPaused = false;
let showInstructions = false;

const gameOverSound = document.getElementById("gameOverSound");
const eatSound = document.getElementById("eatSound");
const moveSound = document.getElementById("moveSound");
const hitSound = document.getElementById("hitSound");

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

function drawObstacles() {
    ctx.fillStyle = obstacleColor;
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, gridSize, gridSize);
    });
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        if (score % 50 === 0) {
            level++;
            speed = Math.max(50, speed - 10);
            obstacles = generateObstacles();
        }
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
    } while (snake.some(part => part.x === foodX && part.y === foodY) || obstacles.some(obstacle => obstacle.x === foodX && obstacle.y === foodY));
    return {x: foodX, y: foodY};
}

function generateObstacles() {
    const numberOfObstacles = Math.floor(level / 2) + 3;
    let obstacles = [];
    while (obstacles.length < numberOfObstacles) {
        const x = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
        const y = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
        if (!snake.some(part => part.x === x && part.y === y) &&
            !obstacles.some(obstacle => obstacle.x === x && obstacle.y === y)) {
            obstacles.push({x, y});
        }
    }
    return obstacles;
}

function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("level").innerText = `Level: ${level}`;
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
    drawObstacles();
    moveSnake();
    drawSnake();
    setTimeout(gameLoop, speed);
}

function hasGameEnded() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x >= canvas.width;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y >= canvas.height;

    const hitObstacle = obstacles.some(obstacle => obstacle.x === snake[0].x && obstacle.y === snake[0].y);

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall || hitObstacle;
}

function displayGameOver() {
    gameEnded = true;
    gameOverSound.play();
    document.getElementById("overlay").classList.remove("hidden");
}

function startGame() {
    snake = [{x: 100, y: 100}];
    dx = gridSize;
    dy = 0;
    score = 0;
    level = 1;
    speed = 100;
    obstacles = generateObstacles();
    gameEnded = false;
    isPaused = false;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("level").innerText = `Level: ${level}`;
    document.getElementById("high-score").innerText = `High Score: ${highScore}`;
    document.getElementById("restartButton").style.display = "none";
    document.getElementById("instructions").classList.add("hidden");
    document.getElementById("overlay").classList.add("hidden");
    clearCanvas();
    drawFood();
    drawObstacles();
    drawSnake();
    gameLoop();
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById("pauseButton").classList.toggle("active", isPaused);
    if (!isPaused) {
        gameLoop();
    }
}

function toggleInstructions() {
    showInstructions = !showInstructions;
    document.getElementById("instructions").classList.toggle("hidden", !showInstructions);
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    if (changingDirection || isPaused) return;
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
