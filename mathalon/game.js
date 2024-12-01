let currentScore = 0;
let highScore = localStorage.getItem('highScore') || 0;
let currentQuestion = {};
let difficulty = 1;

// DOM Elements
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const feedbackElement = document.getElementById('feedback');
const currentScoreElement = document.getElementById('current-score');
const highScoreElement = document.getElementById('high-score');
const gameForm = document.getElementById('game-form');
const mainContainer = document.querySelector('main');

// Initialize high score
highScoreElement.textContent = highScore;

// Generate a random math question based on difficulty
function generateQuestion() {
    const num1 = Math.floor(Math.random() * 10 * difficulty) + 1;
    const num2 = Math.floor(Math.random() * 10 * difficulty) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    switch (operator) {
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case '*':
            answer = num1 * num2;
            break;
    }
    
    currentQuestion = { question: `${num1} ${operator} ${num2}`, answer };
    questionElement.textContent = currentQuestion.question;
}

// Handle answer submission
function checkAnswer(event) {
    event.preventDefault();

    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentQuestion.answer) {
        // Increase score and difficulty for correct answers
        currentScore++;
        difficulty++;
        generateQuestion(); // Load the next question directly
    } else {
        endGame();
    }

    // Clear the input field and update stats
    answerInput.value = '';
    updateStats();
}

// Update stats on the page
function updateStats() {
    currentScoreElement.textContent = currentScore;
    if (currentScore > highScore) {
        highScore = currentScore;
        localStorage.setItem('highScore', highScore);
    }
    highScoreElement.textContent = highScore;
}

// End the game
function endGame() {
    mainContainer.innerHTML = `
        <h2>Game Over</h2>
        <button id="restart-btn">Restart</button>
    `;
    const restartButton = document.getElementById('restart-btn');
    restartButton.addEventListener('click', () => {
        window.location.reload(); // Reload the page to restart the game
    });
}

// Initialize the game
generateQuestion();
gameForm.addEventListener('submit', checkAnswer);
