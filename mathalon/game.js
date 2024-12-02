let currentQuestion = {};
let level = 1; 
let questionsAnswered = 0; 
let progress = 0;

const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer');
const feedbackElement = document.getElementById('feedback');
const gameForm = document.getElementById('game-form');
const levelElement = document.getElementById('level-indicator');
const progressBar = document.getElementById('progress-bar');
const levelModal = document.getElementById('level-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const continueButton = document.getElementById('continue-btn');

const levelDescriptions = {
    1: "Addition and subtraction with small numbers.",
    2: "Multiplication and division introduced.",
    3: "Larger numbers in all operations.",
    4: "Mix of operations and increased range.",
};

// Generate a random math question based on the current level
function generateQuestion() {
    const min = 1;
    const max = level * 5;
    let num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    let num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
    let answer;

    if (operator === '+') answer = num1 + num2;
    if (operator === '-') answer = num1 - num2;
    if (operator === '*') answer = num1 * num2;
    if (operator === '/') {
        answer = Math.floor(num1 / num2);
        num1 = answer * num2; // Ensure integer division
    }

    currentQuestion = { question: `${num1} ${operator} ${num2}`, answer };
    questionElement.textContent = currentQuestion.question;

    // Clear feedback only when a new question is generated
    feedbackElement.textContent = '';

    // Automatically focus the input field for typing
    answerInput.focus();
}

// Handle answer submission
function checkAnswer(event) {
    event.preventDefault();

    const userAnswer = parseInt(answerInput.value);

    if (userAnswer === currentQuestion.answer) {
        feedbackElement.textContent = "Correct! Well done.";
        feedbackElement.style.color = "green"; // Highlight positive feedback
        questionsAnswered++;
        progress = (questionsAnswered / 8) * 100;
        progressBar.style.width = `${progress}%`;

        if (questionsAnswered === 8) {
            levelUp();
        } else {
            generateQuestion();
        }
    } else {
        feedbackElement.textContent = "Incorrect. Try again.";
        feedbackElement.style.color = "red"; // Highlight negative feedback
    }

    answerInput.value = ''; // Clear input after each attempt
    answerInput.focus(); // Ensure focus remains on the input field
}

// Level up the game
function levelUp() {
    level++;
    questionsAnswered = 0;
    progressBar.style.width = '0%';
    levelElement.textContent = `Level: ${level}`;

    // Show modal with level description
    modalTitle.textContent = `Level ${level}`;
    modalDescription.textContent = levelDescriptions[level] || "New challenges!";
    levelModal.classList.add('show');

    // Wait for user to click "Continue"
    continueButton.onclick = () => {
        levelModal.classList.remove('show');
        generateQuestion();
        answerInput.focus(); // Automatically focus input field after closing modal
    };
}

// Initialize the game
gameForm.addEventListener('submit', checkAnswer);
generateQuestion();
