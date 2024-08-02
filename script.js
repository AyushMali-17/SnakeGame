const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 20;
const canvasSize = 400;
const snakeColor = 'lime';
const foodColor = 'red';
let snake = [{x: 100, y: 100}];
let food = {x: 200, y: 200};
let dx = gridSize;
let dy = 0;

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
    snake.pop();
}

function gameLoop() {
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    setTimeout(gameLoop, 100);
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (event.keyCode === LEFT_KEY && dx === 0) {
        dx = -gridSize;
        dy = 0;
    }
    if (event.keyCode === RIGHT_KEY && dx === 0) {
        dx = gridSize;
        dy = 0;
    }
    if (event.keyCode === UP_KEY && dy === 0) {
        dx = 0;
        dy = -gridSize;
    }
    if (event.keyCode === DOWN_KEY && dy === 0) {
        dx = 0;
        dy = gridSize;
    }
}

gameLoop();
