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

// Generate a new math question
function generateQuestion() {
    const min = 1;
    const max = level * 5;
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const operator = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
    let answer;

    if (operator === '+') answer = num1 + num2;
    if (operator === '-') answer = num1 - num2;
    if (operator === '*') answer = num1 * num2;
    if (operator === '/') {
        answer = Math.floor(num1 / num2);
        num1 = answer * num2;
    }

    currentQuestion = { question: `${num1} ${operator} ${num2}`, answer };
    console.log("Question generated:", currentQuestion); // Debugging log
    questionElement.textContent = currentQuestion.question;
}

// Handle answer submission
function checkAnswer(event) {
    event.preventDefault();
    const userAnswer = parseInt(answerInput.value);

    if (userAnswer === currentQuestion.answer) {
        questionsAnswered++;
        progress = (questionsAnswered / 8) * 100;
        progressBar.style.width = `${progress}%`;
        console.log("Progress:", progress, "Questions Answered:", questionsAnswered); // Debugging log

        if (questionsAnswered === 8) levelUp();
        else generateQuestion();
    } else {
        feedbackElement.textContent = "Incorrect. Try again.";
    }

    answerInput.value = '';
}

// Level up logic
function levelUp() {
    level++;
    questionsAnswered = 0;
    progressBar.style.width = '0%';
    levelElement.textContent = `Level: ${level}`;
    modalTitle.textContent = `Level ${level}`;
    modalDescription.textContent = levelDescriptions[level] || "New challenges!";
    levelModal.classList.add('show');
    console.log("Level up! Now at Level:", level); // Debugging log

    continueButton.onclick = () => {
        levelModal.classList.remove('show');
        generateQuestion();
    };
}

// Initialize the game
gameForm.addEventListener('submit', checkAnswer);
generateQuestion();
