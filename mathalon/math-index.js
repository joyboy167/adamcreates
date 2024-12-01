let currentStreak = 0;
let highScore = localStorage.getItem('highScore') || 0;
let currentQuestion = {};
let difficulty = 1;

// DOM Elements
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const feedbackElement = document.getElementById('feedback');
const currentStreakElement = document.getElementById('current-streak');
const highScoreElement = document.getElementById('high-score');
const startButton = document.getElementById('start-btn');
const submitButton = document.getElementById('submit-btn');
const gameForm = document.getElementById('game-form');

// Initialize high score
highScoreElement.textContent = highScore;

// Generate a random question based on difficulty
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

// Start the game
function startGame() {
    currentStreak = 0;
    difficulty = 1;
    updateStats();
    feedbackElement.textContent = '';
    answerInput.disabled = false;
    submitButton.disabled = false;
    generateQuestion();
}

// Handle answer submission
function checkAnswer(event) {
    event.preventDefault();
    
    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentQuestion.answer) {
        currentStreak++;
        difficulty++;
        feedbackElement.textContent = 'Correct! 🎉';
        feedbackElement.style.color = 'green';
        generateQuestion();
    } else {
        feedbackElement.textContent = `Incorrect! The correct answer was ${currentQuestion.answer}. Try again!`;
        feedbackElement.style.color = 'red';
        endGame();
    }
    
    answerInput.value = '';
    updateStats();
}

// Update stats on the page
function updateStats() {
    currentStreakElement.textContent = currentStreak;
    if (currentStreak > highScore) {
        highScore = currentStreak;
        localStorage.setItem('highScore', highScore);
    }
    highScoreElement.textContent = highScore;
}

// End the game
function endGame() {
    answerInput.disabled = true;
    submitButton.disabled = true;
    questionElement.textContent = 'Press Start to try again!';
}

// Event Listeners
startButton.addEventListener('click', startGame);
gameForm.addEventListener('submit', checkAnswer);
