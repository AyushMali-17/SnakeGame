document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const gameOverModal = document.getElementById('gameOverModal');
    const playAgainButton = document.getElementById('playAgainButton');
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    const nextNumberElement = document.getElementById('nextNumber');
    const finalScoreElement = document.getElementById('finalScore');
    const finalHighScoreElement = document.getElementById('finalHighScore');
    const difficultySelect = document.getElementById('difficulty');
    const eatSound = document.getElementById('eatSound');
    const gameOverSound = document.getElementById('gameOverSound');

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
    let intervalTime = 150;

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
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        for (let segment of snake) {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        }

        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

        ctx.font = '16px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(food.value, food.x * gridSize + 6, food.y * gridSize + 16);
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
                eatSound.play();
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
        gameOverSound.play();
    }

    function startGame() {
        resetGame();
        setDifficulty();
        gameInterval = setInterval(moveSnake, intervalTime);
    }

    function setDifficulty() {
        const difficulty = difficultySelect.value;
        switch (difficulty) {
            case 'easy':
                intervalTime = 200;
                break;
            case 'medium':
                intervalTime = 150;
                break;
            case 'hard':
                intervalTime = 100;
                break;
            case 'extreme':
                intervalTime = 50;
                break;
        }
    }

    function toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
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
    darkModeToggle.addEventListener('click', toggleDarkMode);

    resetGame();
});
