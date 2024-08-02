const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
const canvasSize = 600;
const snakeColor = 'lime';
const foodColor = 'red';
const obstacleColor = 'gray';
const powerUpColor = 'gold';
const obstacleSize = 40;
let snake = [{x: 100, y: 100}];
let food = getRandomFoodPosition();
let powerUps = [getRandomPowerUpPosition()];
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
let powerUpTimer = 0;
const maxPowerUpTime = 5000; // 5 seconds for power-up

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

function drawPowerUps() {
    ctx.fillStyle = powerUpColor;
    powerUps.forEach(powerUp => {
        ctx.fillRect(powerUp.x, powerUp.y, gridSize, gridSize);
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

    // Check if snake hits power-up
    powerUps.forEach((powerUp, index) => {
        if (head.x === powerUp.x && head.y === powerUp.y) {
            powerUpTimer = maxPowerUpTime;
            powerUps.splice(index, 1); // Remove power-up after collection
            generatePowerUps();
        }
    });
}

function getRandomFoodPosition() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
        foodY = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
    } while (snake.some(part => part.x === foodX && part.y === foodY) || 
             obstacles.some(obs => obs.x === foodX && obs.y === foodY));
    return {x: foodX, y: foodY};
}

function generateObstacles() {
    let obstacles = [];
    for (let i = 0; i < 5; i++) {
        let obsX, obsY;
        do {
            obsX = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
            obsY = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
        } while (snake.some(part => part.x === obsX && part.y === obsY) || 
                 (obsX === food.x && obsY === food.y));
        obstacles.push({x: obsX, y: obsY});
    }
    return obstacles;
}

function generatePowerUps() {
    let newPowerUp = getRandomPowerUpPosition();
    if (!powerUps.some(pu => pu.x === newPowerUp.x && pu.y === newPowerUp.y)) {
        powerUps.push(newPowerUp);
    }
}

function getRandomPowerUpPosition() {
    let powerUpX, powerUpY;
    do {
        powerUpX = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
        powerUpY = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
    } while (snake.some(part => part.x === powerUpX && part.y === powerUpY) || 
             obstacles.some(obs => obs.x === powerUpX && obs.y === powerUpY) || 
             (powerUpX === food.x && powerUpY === food.y));
    return {x: powerUpX, y: powerUpY};
}

function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("level").innerText = `Level: ${level}`;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("high-score").innerText = `High Score: ${highScore}`;
    }
}

function gameLoop() {
    if (gameEnded) return;
    if (isPaused) {
        setTimeout(gameLoop, speed);
        return;
    }
    if (powerUpTimer > 0) {
        powerUpTimer -= speed;
    }

    if (hasGameEnded()) {
        displayGameOver();
        return;
    }
    changingDirection = false;
    clearCanvas();
    drawFood();
    drawObstacles();
    drawPowerUps();
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
    document.getElementById("finalScore").innerText = score;
    document.getElementById("gameOverModal").classList.remove("hidden");
    document.getElementById("highScoresModal").classList.add("hidden");
    updateHighScores();
}

function updateHighScores() {
    const highScoresList = document.getElementById("highScoresList");
    const highScores = JSON.parse(localStorage.getItem("highScores") || "[]");

    highScores.push(score);
    highScores.sort((a, b) => b - a);
    highScores.splice(5); // Keep top 5 scores

    localStorage.setItem("highScores", JSON.stringify(highScores));

    highScoresList.innerHTML = highScores.map(score => `<li>${score}</li>`).join('');
}

function startGame() {
    snake = [{x: 100, y: 100}];
    dx = gridSize;
    dy = 0;
    score = 0;
    level = 1;
    speed = 100;
    obstacles = generateObstacles();
    powerUps = [getRandomPowerUpPosition()];
    gameEnded = false;
    isPaused = false;
    powerUpTimer = 0;
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("level").innerText = `Level: ${level}`;
    document.getElementById("high-score").innerText = `High Score: ${highScore}`;
    document.getElementById("instructions").classList.add("hidden");
    document.getElementById("gameOverModal").classList.add("hidden");
    document.getElementById("highScoresModal").classList.add("hidden");
    clearCanvas();
    drawFood();
    drawObstacles();
    drawPowerUps();
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

function toggleHighScores() {
    document.getElementById("highScoresModal").classList.toggle("hidden");
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
