let currentScore = 0;
let highScore = localStorage.getItem('highScore') || 0;
let currentQuestion = {};
let level = 1; // Start at Level 1
let questionsAnswered = 0; // Tracks questions answered in the current level

// DOM Elements
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const feedbackElement = document.getElementById('feedback');
const currentScoreElement = document.getElementById('current-score');
const highScoreElement = document.getElementById('high-score');
const gameForm = document.getElementById('game-form');
const mainContainer = document.querySelector('main');

// Add Level Display
const levelElement = document.createElement('p'); // To show the level
levelElement.textContent = `Level: ${level}`;
levelElement.style.fontSize = "1.5rem";
levelElement.style.marginBottom = "20px";
mainContainer.prepend(levelElement); // Add level display to the top of the main container

// Initialize high score
highScoreElement.textContent = highScore;

// Generate a random math question based on the current level
function generateQuestion() {
    const min = 1;
    const max = level * 5; // Range increases with level (1-5, 1-10, 1-15, etc.)
    const questionIndex = questionsAnswered % 5; // Determine question type in the 5-question cycle
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let operator, answer;

    if (level === 1 || questionIndex < 2) {
        // Level 1 or first 2 questions in a cycle: Addition/Subtraction only
        operator = Math.random() < 0.5 ? '+' : '-';
        answer = operator === '+' ? num1 + num2 : num1 - num2;
    } else if (level > 1 && questionIndex < 4) {
        // Level 2+ or middle 2 questions: Multiplication/Division
        if (Math.random() < 0.5) {
            operator = '*';
            answer = num1 * num2;
        } else {
            operator = '/';
            answer = Math.floor(num1 / num2);
            num1 = answer * num2; // Ensure clean division
        }
    } else {
        // Last question in a cycle or Level 3+: Any operation
        const operators = ['+', '-', '*', '/'];
        operator = operators[Math.floor(Math.random() * operators.length)];
        if (operator === '+') answer = num1 + num2;
        if (operator === '-') answer = num1 - num2;
        if (operator === '*') answer = num1 * num2;
        if (operator === '/') {
            answer = Math.floor(num1 / num2);
            num1 = answer * num2;
        }
    }

    // Set the question and update the DOM
    currentQuestion = { question: `${num1} ${operator} ${num2}`, answer };
    questionElement.textContent = currentQuestion.question;
}

// Handle answer submission
function checkAnswer(event) {
    event.preventDefault();

    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentQuestion.answer) {
        // Increase score and track questions answered
        currentScore++;
        questionsAnswered++;
        if (questionsAnswered === 5) {
            levelUp(); // Move to the next level
        } else {
            generateQuestion(); // Load the next question
        }
    } else {
        endGame();
    }

    // Clear the input field and update stats
    answerInput.value = '';
    updateStats();
}

// Level up the game
function levelUp() {
    level++; // Increase the level
    questionsAnswered = 0; // Reset questions answered for the new level
    levelElement.textContent = `Level: ${level}`; // Update the level display
    feedbackElement.textContent = `Welcome to Level ${level}!`; // Show level-up feedback
    feedbackElement.style.color = 'gold';
    generateQuestion(); // Start the new level
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
