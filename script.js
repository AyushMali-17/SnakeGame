document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const particleCanvas = document.getElementById('particleCanvas');
    const particleCtx = particleCanvas.getContext('2d');
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;

    const scoreDisplay = document.getElementById('score');
    const highScoreDisplay = document.getElementById('highScore');
    const levelDisplay = document.getElementById('level');
    const timeDisplay = document.getElementById('time');
    const finalScoreDisplay = document.getElementById('finalScore');
    const finalHighScoreDisplay = document.getElementById('finalHighScore');

    const startButton = document.getElementById('startButton');
    const pauseButton = document.getElementById('pauseButton');
    const restartButton = document.getElementById('restartButton');
    const playAgainButton = document.getElementById('playAgainButton');

    const difficultySelect = document.getElementById('difficultySelect');
    const soundToggle = document.getElementById('soundToggle');
    const themeSelect = document.getElementById('themeSelect');

    const gameOverModal = document.getElementById('gameOverModal');
    const powerUpList = document.getElementById('powerUpList');
    const achievementList = document.getElementById('achievementList');

    let snake;
    let apple;
    let score;
    let highScore = 0;
    let level;
    let gameInterval;
    let gamePaused = false;
    let startTime;
    let gameDuration = 0;
    let particles = [];

    function initGame() {
        snake = [{ x: 150, y: 150 }];
        apple = spawnApple();
        score = 0;
        level = 1;
        gameDuration = 0;
        startTime = Date.now();
        updateScore();
        updateHighScore();
        updateLevel();
        updateTime();
        spawnParticles();
        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, getSpeed());
    }

    function getSpeed() {
        switch (difficultySelect.value) {
            case 'easy': return 200;
            case 'medium': return 100;
            case 'hard': return 50;
            case 'extreme': return 25;
        }
    }

    function gameLoop() {
        if (!gamePaused) {
            moveSnake();
            checkCollision();
            draw();
            updateTime();
        }
    }

    function moveSnake() {
        const head = { ...snake[0] };
        if (direction === 'right') head.x += 10;
        if (direction === 'left') head.x -= 10;
        if (direction === 'up') head.y -= 10;
        if (direction === 'down') head.y += 10;

        snake.unshift(head);
        if (head.x === apple.x && head.y === apple.y) {
            score++;
            updateScore();
            apple = spawnApple();
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
            gameOver();
        }

        for (let i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                gameOver();
            }
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        snake.forEach((segment, index) => {
            ctx.fillStyle = index === 0 ? 'yellow' : 'lime';
            ctx.fillRect(segment.x, segment.y, 10, 10);
        });

        ctx.fillStyle = 'red';
        ctx.fillRect(apple.x, apple.y, 10, 10);
    }

    function spawnApple() {
        let x, y;
        do {
            x = Math.floor(Math.random() * (canvas.width / 10)) * 10;
            y = Math.floor(Math.random() * (canvas.height / 10)) * 10;
        } while (snake.some(segment => segment.x === x && segment.y === y));
        return { x, y };
    }

    function gameOver() {
        clearInterval(gameInterval);
        finalScoreDisplay.textContent = score;
        finalHighScoreDisplay.textContent = highScore;
        gameOverModal.style.display = 'block';
        storeHighScore();
    }

    function updateScore() {
        scoreDisplay.textContent = score;
        if (score > highScore) {
            highScore = score;
            updateHighScore();
        }
    }

    function updateHighScore() {
        highScoreDisplay.textContent = highScore;
    }

    function updateLevel() {
        levelDisplay.textContent = level;
    }

    function updateTime() {
        gameDuration = Date.now() - startTime;
        const minutes = Math.floor(gameDuration / 60000);
        const seconds = Math.floor((gameDuration % 60000) / 1000);
        timeDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function storeHighScore() {
        localStorage.setItem('highScore', highScore);
    }

    function loadHighScore() {
        const storedHighScore = localStorage.getItem('highScore');
        if (storedHighScore) {
            highScore = parseInt(storedHighScore, 10);
            updateHighScore();
        }
    }

    startButton.addEventListener('click', () => {
        initGame();
    });

    pauseButton.addEventListener('click', () => {
        gamePaused = !gamePaused;
    });

    restartButton.addEventListener('click', () => {
        initGame();
    });

    playAgainButton.addEventListener('click', () => {
        gameOverModal.style.display = 'none';
        initGame();
    });

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    });

    function spawnParticles() {
        for (let i = 0; i < 100; i++) {
            particles.push({
                x: Math.random() * particleCanvas.width,
                y: Math.random() * particleCanvas.height,
                radius: Math.random() * 3,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                alpha: Math.random() * 0.5 + 0.5
            });
        }
    }

    function drawParticles() {
        particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach((particle, index) => {
            particleCtx.beginPath();
            particleCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            particleCtx.fillStyle = `rgba(255, 215, 0, ${particle.alpha})`;
            particleCtx.fill();

            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > particleCanvas.width || particle.y < 0 || particle.y > particleCanvas.height) {
                particles[index] = {
                    x: Math.random() * particleCanvas.width,
                    y: Math.random() * particleCanvas.height,
                    radius: Math.random() * 3,
                    speedX: Math.random() * 0.5 - 0.25,
                    speedY: Math.random() * 0.5 - 0.25,
                    alpha: Math.random() * 0.5 + 0.5
                };
            }
        });
        requestAnimationFrame(drawParticles);
    }

    loadHighScore();
    drawParticles();
});
