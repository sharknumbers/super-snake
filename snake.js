// Canvas setup - with safe DOM access for testing
let canvas, ctx;

if (typeof document !== 'undefined') {
    canvas = document.getElementById("snake");
    if (canvas) {
        ctx = canvas.getContext("2d");
    }
}

// Fallback for testing environment
if (!canvas) {
    canvas = { width: 608, height: 608 };
    ctx = {
        createLinearGradient: () => ({ addColorStop: () => {} }),
        fillRect: () => {},
        beginPath: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        arc: () => {},
        fill: () => {},
        arcTo: () => {},
        closePath: () => {}
    };
}

// Create the unit
const box = 32;

// Create a blue tank background pattern
const groundPattern = (ctx) => {
    // Fill with gradient for water effect
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#7db9e8');
    gradient.addColorStop(0.5, '#207cca');
    gradient.addColorStop(1, '#1e5799');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a subtle grid for tank glass effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let i = 0; i <= canvas.width; i += box) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let i = 0; i <= canvas.height; i += box) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
    }
    
    // Add bubbles effect
    for (let i = 0; i < 15; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 5 + 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
    }
};

// Safe audio play function
function playAudio(audio) {
    // Only try to play if the audio exists and is loaded
    if (audio && audio.play) {
        try {
            // Create a clone to allow overlapping sounds
            const clone = audio.cloneNode();
            clone.volume = 0.5; // Lower volume
            clone.play().catch(e => console.log("Audio play failed:", e));
        } catch (e) {
            console.log("Audio play error:", e);
        }
    }
}

// Load audio files (with error handling)
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

// Try to load audio files, but don't break if they're missing
try {
    dead.src = "audio/dead.mp3";
    eat.src = "audio/eat.mp3";
    up.src = "audio/up.mp3";
    right.src = "audio/right.mp3";
    left.src = "audio/left.mp3";
    down.src = "audio/down.mp3";
} catch (e) {
    console.log("Error loading audio files:", e);
}

// Helper function to draw rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
}

// Helper function to draw a fish (food)
function drawFish(x, y, size) {
    const centerX = x + size/2;
    const centerY = y + size/2;
    const fishSize = size * 0.8;
    
    // Fish body
    ctx.fillStyle = '#e74c3c'; // Red fish
    ctx.beginPath();
    
    // Use arc instead of ellipse for better browser compatibility
    ctx.arc(centerX, centerY, fishSize/3, 0, Math.PI * 2);
    ctx.fill();
    
    // Tail
    ctx.beginPath();
    ctx.moveTo(centerX - fishSize/3, centerY);
    ctx.lineTo(centerX - fishSize/2 - fishSize/4, centerY - fishSize/4);
    ctx.lineTo(centerX - fishSize/2 - fishSize/4, centerY + fishSize/4);
    ctx.closePath();
    ctx.fillStyle = '#c0392b';
    ctx.fill();
    
    // Eye
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(centerX + fishSize/6, centerY - fishSize/8, fishSize/10, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupil
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(centerX + fishSize/6, centerY - fishSize/8, fishSize/20, 0, Math.PI * 2);
    ctx.fill();
    
    // Bubbles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.arc(centerX - fishSize/1.5, centerY - fishSize/2, fishSize/12, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX - fishSize/1.2, centerY - fishSize/1.5, fishSize/15, 0, Math.PI * 2);
    ctx.fill();
}

// Create the snake
let snake = [];
snake[0] = {
    x: 9 * box,
    y: 10 * box
};

// Calculate game boundaries based on canvas size
const gameWidth = Math.floor(canvas.width / box);
const gameHeight = Math.floor(canvas.height / box);

function createFood(canvas, box) {
    const gameWidth = Math.floor(canvas.width / box);
    const gameHeight = Math.floor(canvas.height / box);
    return {
        x: Math.floor(Math.random() * (gameWidth - 2) + 1) * box,
        y: Math.floor(Math.random() * (gameHeight - 2) + 1) * box
    };
}

let food = createFood(canvas, box);

// Create the score
let score = 0;
let highScore = 0;

// Safe localStorage access for testing
if (typeof localStorage !== 'undefined') {
    highScore = localStorage.getItem("snakeHighScore") || 0;
}

// Safe DOM updates for score display
function updateScoreDisplay() {
    if (typeof document !== 'undefined') {
        const scoreElement = document.getElementById("score");
        const highScoreElement = document.getElementById("high-score");
        if (scoreElement) scoreElement.textContent = "Score: " + score;
        if (highScoreElement) highScoreElement.textContent = "Best: " + highScore;
    }
}

updateScoreDisplay();

// Pause functionality
let paused = false;

// Control the snake
let d;

// Safe event listener for testing
if (typeof document !== 'undefined') {
    document.addEventListener("keydown", direction);
}

function direction(event) {
    // Support both keyCode (deprecated) and key properties
    const key = event.keyCode || event.which;
    const keyName = event.key;

    // Check for pause key
    if (keyName === 'p' || keyName === 'P' || key === 80) {
        togglePause();
        return;
    }

    // Don't process movement keys when paused
    if (paused) return;

    // Prevent the snake from reversing
    if ((key === 37 || keyName === "ArrowLeft") && d !== "RIGHT") {
        playAudio(left);
        d = "LEFT";
    } else if ((key === 38 || keyName === "ArrowUp") && d !== "DOWN") {
        playAudio(up);
        d = "UP";
    } else if ((key === 39 || keyName === "ArrowRight") && d !== "LEFT") {
        playAudio(right);
        d = "RIGHT";
    } else if ((key === 40 || keyName === "ArrowDown") && d !== "UP") {
        playAudio(down);
        d = "DOWN";
    }
}

function togglePause() {
    paused = !paused;
    if (typeof document !== 'undefined') {
        const pauseOverlay = document.getElementById("pause-overlay");
        if (pauseOverlay) {
            if (paused) {
                pauseOverlay.style.display = "flex";
            } else {
                pauseOverlay.style.display = "none";
            }
        }
    }
}

function collision(head, array) {
    for (let i = 1; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Draw everything to the canvas
// Draw everything to the canvas
function draw() {
    // Don't update game state when paused
    if (paused) {
        return;
    }

    // Draw the blue tank background pattern
    groundPattern(ctx);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        // Create a gradient for the snake body
        const snakeGradient = ctx.createLinearGradient(
            snake[i].x, snake[i].y,
            snake[i].x + box, snake[i].y + box
        );

        if (i === 0) {
            // Head of the snake - shark-like colors
            snakeGradient.addColorStop(0, '#2c3e50');
            snakeGradient.addColorStop(1, '#34495e');
        } else {
            // Body of the snake - shark-like colors
            snakeGradient.addColorStop(0, '#7f8c8d');
            snakeGradient.addColorStop(1, '#95a5a6');
        }

        ctx.fillStyle = snakeGradient;

        // Draw rounded rectangle for snake segments
        roundRect(ctx, snake[i].x, snake[i].y, box, box, 8);

        // Add details to snake head
        if (i === 0) {
            // Eyes
            const eyeSize = box / 8;
            ctx.fillStyle = 'white';

            // Position eyes based on direction
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

            switch(d) {
                case "UP":
                    leftEyeX = snake[i].x + box/4;
                    leftEyeY = snake[i].y + box/4;
                    rightEyeX = snake[i].x + 3*box/4;
                    rightEyeY = snake[i].y + box/4;
                    break;
                case "DOWN":
                    leftEyeX = snake[i].x + box/4;
                    leftEyeY = snake[i].y + 3*box/4;
                    rightEyeX = snake[i].x + 3*box/4;
                    rightEyeY = snake[i].y + 3*box/4;
                    break;
                case "LEFT":
                    leftEyeX = snake[i].x + box/4;
                    leftEyeY = snake[i].y + box/4;
                    rightEyeX = snake[i].x + box/4;
                    rightEyeY = snake[i].y + 3*box/4;
                    break;
                case "RIGHT":
                    leftEyeX = snake[i].x + 3*box/4;
                    leftEyeY = snake[i].y + box/4;
                    rightEyeX = snake[i].x + 3*box/4;
                    rightEyeY = snake[i].y + 3*box/4;
                    break;
                default:
                    // Default direction (right)
                    leftEyeX = snake[i].x + 3*box/4;
                    leftEyeY = snake[i].y + box/4;
                    rightEyeX = snake[i].x + 3*box/4;
                    rightEyeY = snake[i].y + 3*box/4;
            }

            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();

            // Pupils
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(rightEyeX, rightEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Draw the food (a small fish)
    drawFish(food.x, food.y, box);

    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // which direction
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // if the snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        playAudio(eat);
        food = createFood();
        // don't remove the tail
    } else {
        // remove the tail
        snake.pop();
    }

    // add new Head
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    // game over
    if (
        snakeX < 0 || snakeX >= canvas.width ||
        snakeY < 0 || snakeY >= canvas.height ||
        collision(newHead, snake)
    ) {
        playAudio(dead);

        // Update high score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
        }

        // Reset game state
        score = 0;
        snake = [];
        snake[0] = {
            x: 9 * box,
            y: 10 * box
        };
        d = undefined;
    }

    snake.unshift(newHead);

    // Update score and high score display
    document.getElementById("score").textContent = "Score: " + score;
    document.getElementById("high-score").textContent = "Best: " + highScore;
}

let game;

if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
    // run the game loop in browser environments
    game = setInterval(draw, 150);
}

// Bubbles for animation
let bubbles = [];

// Create initial bubbles
function createBubbles() {
    bubbles = [];
    for (let i = 0; i < 15; i++) {
        bubbles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 20,
            radius: Math.random() * 5 + 2,
            speed: Math.random() * 2 + 1
        });
    }
}

// Update bubbles position
function updateBubbles() {
    for (let i = 0; i < bubbles.length; i++) {
        // Move bubbles upward
        bubbles[i].y -= bubbles[i].speed;
        
        // If bubble is out of canvas, reset it
        if (bubbles[i].y < -10) {
            bubbles[i].y = canvas.height + Math.random() * 20;
            bubbles[i].x = Math.random() * canvas.width;
        }
    }
}

// Draw bubbles
function drawBubbles() {
    for (let i = 0; i < bubbles.length; i++) {
        ctx.beginPath();
        ctx.arc(bubbles[i].x, bubbles[i].y, bubbles[i].radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
        
        // Add highlight to bubble
        ctx.beginPath();
        ctx.arc(bubbles[i].x - bubbles[i].radius/3, bubbles[i].y - bubbles[i].radius/3, 
                bubbles[i].radius/3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
    }
}



window.onload = function() {
    // Create initial bubbles
    createBubbles();

    // Start the game
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        game = setInterval(function() {
            draw();
            updateBubbles();
        }, 150);
    }

    // Add touch controls for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, false);

    document.addEventListener('touchend', function(e) {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;

        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        // Determine swipe direction based on which axis had the larger change
        if (Math.abs(dx) > Math.abs(dy)) {
            // Horizontal swipe
            if (dx > 0 && d !== "LEFT") {
                playAudio(right);
                d = "RIGHT";
            } else if (dx < 0 && d !== "RIGHT") {
                playAudio(left);
                d = "LEFT";
            }
        } else {
            // Vertical swipe
            if (dy > 0 && d !== "UP") {
                playAudio(down);
                d = "DOWN";
            } else if (dy < 0 && d !== "DOWN") {
                playAudio(up);
                d = "UP";
            }
        }

        // Prevent default behavior (scrolling)
        e.preventDefault();
    }, false);
};

// Getter and setter functions for testing
function getDirection() {
    return d;
}

function setDirection(direction) {
    d = direction;
}

function getSnake() {
    return snake;
}

function setSnake(newSnake) {
    snake = newSnake;
}

function getFood() {
    return food;
}

function setFood(newFood) {
    food = newFood;
}

function getScore() {
    return score;
}

function setScore(newScore) {
    score = newScore;
    updateScoreDisplay();
}

function getHighScore() {
    return highScore;
}

function setHighScore(newHighScore) {
    highScore = newHighScore;
    updateScoreDisplay();
}

function getPaused() {
    return paused;
}

function setPaused(newPaused) {
    paused = newPaused;
}

function resetGame() {
    snake = [{ x: 9 * box, y: 10 * box }];
    d = undefined;
    score = 0;
    paused = false;
    food = createFood(canvas, box);
    updateScoreDisplay();
}

// ... existing code ...

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        collision,
        createFood,
        direction,
        togglePause,
        box,
        snake,
        food,
        score,
        highScore,
        d,
        paused,
        setDirection,
        getDirection,
        setSnake,
        getSnake,
        setFood,
        getFood,
        setScore,
        getScore,
        setHighScore,
        getHighScore,
        setPaused,
        getPaused,
        resetGame,
    };
}