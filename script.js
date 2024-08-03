document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const gameOverModal = document.getElementById('gameOverModal');
    const playAgainButton = document.getElementById('playAgainButton');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const nextNumberElement = document.getElementById('nextNumber');
    const finalScoreElement = document.getElementById('finalScore');
    const finalHighScoreElement = document.getElementById('finalHighScore');

    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    let snake;
    let food;
    let dx;
    let dy;
    let score;
    let highScore = 0;
    let nextNumber;
    let gameInterval;

    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        food = getRandomFood();
        dx = 0;
        dy = 0;
        score = 0;
        nextNumber = 1;
        updateScore();
        drawGame();
    }

    function getRandomFood() {
        return {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
            value: nextNumber
        };
    }

    function drawGame() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'green';
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);

        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText(food.value.toString(), food.x * gridSize + 6, food.y * gridSize + 14);
    }

    function moveSnake() {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        if (head.x < 0) head.x = tileCount - 1;
        if (head.x >= tileCount) head.x = 0;
        if (head.y < 0) head.y = tileCount - 1;
        if (head.y >= tileCount) head.y = 0;

        if (head.x === food.x && head.y === food.y) {
            if (food.value === nextNumber) {
                score += nextNumber;
                nextNumber++;
                updateScore();
                food = getRandomFood();
            } else {
                gameOver();
                return;
            }
        } else {
            snake.pop();
        }

        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);
        drawGame();
    }

    function updateScore() {
        scoreElement.textContent = score;
        if (score > highScore) {
            highScore = score;
            highScoreElement.textContent = highScore;
        }
        nextNumberElement.textContent = nextNumber;
    }

    function gameOver() {
        clearInterval(gameInterval);
        finalScoreElement.textContent = score;
        finalHighScoreElement.textContent = highScore;
        gameOverModal.style.display = 'block';
    }

    function startGame() {
        resetGame();
        gameInterval = setInterval(moveSnake, 150);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
        if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
        if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
        if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
    });

    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
        startGame();
    });

    resetGame();
});