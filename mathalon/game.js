let currentScore = 0;
let highScore = localStorage.getItem('highScore') || 0;
let currentQuestion = {};
let level = 1; // Start at Level 1
let questionsAnswered = 0; // Tracks questions answered in the current level
let firstAttempt = true; // Track the first attempt of each level
let timerInterval; // Holds the timer interval
let timeRemaining = 30; // Time in seconds for the level

// DOM Elements
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const feedbackElement = document.getElementById('feedback');
const currentScoreElement = document.getElementById('current-score');
const highScoreElement = document.getElementById('high-score');
const gameForm = document.getElementById('game-form');
const levelElement = document.getElementById('level-indicator');
const timerElement = document.createElement('p'); // Create timer element
timerElement.id = "timer";
levelElement.parentElement.appendChild(timerElement); // Append timer near level indicator

// Modal Elements
const levelModal = document.getElementById('level-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const continueButton = document.getElementById('continue-btn');

// Level descriptions
const levelDescriptions = {
    1: "Addition and subtraction with small numbers.",
    2: "Multiplication and division introduced.",
    3: "Larger numbers in all operations.",
    4: "Mix of operations and increased range.",
    5: "Operations now involve numbers up to 50.",
    6: "Challenging questions with all operators.",
    7: "High numbers with complex calculations.",
    8: "Precision division and multiplication.",
    9: "Fast-paced mix of all operators.",
    10: "Ultimate test with largest numbers!"
};

// Initialize high score
highScoreElement.textContent = highScore;

// Disable scroll buttons and remove "required" validation for the answer input field
answerInput.setAttribute('inputmode', 'numeric'); // Ensures numeric keyboard on mobile
answerInput.setAttribute('type', 'text'); // Avoids up/down arrows
answerInput.removeAttribute('required'); // Removes the "required" validation

// Generate a random math question based on the current level
function generateQuestion() {
    const min = 1;
    const max = level * 5; // Range increases with level (1-5, 1-10, etc.)
    const questionIndex = questionsAnswered % 5; // Determine question type
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    let operator, answer;

    if (level === 1 || questionIndex < 2) {
        operator = Math.random() < 0.5 ? '+' : '-';
        answer = operator === '+' ? num1 + num2 : num1 - num2;
    } else if (level > 1 && questionIndex < 4) {
        if (Math.random() < 0.5) {
            operator = '*';
            answer = num1 * num2;
        } else {
            operator = '/';
            answer = Math.floor(num1 / num2);
            num1 = answer * num2;
        }
    } else {
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

    currentQuestion = { question: `${num1} ${operator} ${num2}`, answer };
    questionElement.textContent = currentQuestion.question;
}

// Handle answer submission
function checkAnswer(event) {
    event.preventDefault();

    if (firstAttempt) {
        firstAttempt = false; // Ignore the first input and reset the flag
        answerInput.value = ''; // Clear the input field
        return;
    }

    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentQuestion.answer) {
        currentScore++;
        questionsAnswered++;
        feedbackElement.textContent = "Correct! Well done.";
        feedbackElement.style.color = "green";

        if (questionsAnswered === 5) {
            clearInterval(timerInterval); // Stop the timer when the level is completed
            levelUp();
        } else {
            generateQuestion();
        }
    } else {
        feedbackElement.textContent = "Incorrect. Try again.";
        feedbackElement.style.color = "red";
    }

    answerInput.value = '';
    updateStats();
}

// Level up the game
function levelUp() {
    level++;
    questionsAnswered = 0;
    firstAttempt = true; // Reset the first attempt flag for the new level
    timeRemaining = 30; // Reset the timer for the new level
    levelElement.textContent = `Level: ${level}`;
    feedbackElement.textContent = ""; // Clear feedback

    // Show modal with level description
    modalTitle.textContent = `Level ${level}`;
    modalDescription.textContent = levelDescriptions[level] || "New challenges ahead!";
    levelModal.classList.add('show');

    // Temporarily disable form submission during the modal
    gameForm.removeEventListener('submit', checkAnswer);

    continueButton.onclick = () => {
        levelModal.classList.remove('show');
        gameForm.addEventListener('submit', checkAnswer);
        generateQuestion();
        startTimer(); // Start the timer only after pressing "Continue"
    };
}

// Start the level timer
function startTimer() {
    clearInterval(timerInterval); // Clear any existing interval
    timerElement.textContent = `Time Remaining: ${timeRemaining}s`;
    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Time Remaining: ${timeRemaining}s`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            feedbackElement.textContent = "Time's up! Level failed.";
            feedbackElement.style.color = "red";

            // Reset level or allow retry
            setTimeout(() => {
                resetLevel();
            }, 3000);
        }
    }, 1000);
}

// Reset the current level
function resetLevel() {
    timeRemaining = 30;
    questionsAnswered = 0;
    feedbackElement.textContent = ""; // Clear feedback
    generateQuestion();
    startTimer();
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

// Initialize the game
generateQuestion();
gameForm.addEventListener('submit', checkAnswer);
