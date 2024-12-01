// Initialize variables
let currentStreak = 0;
let highScore = localStorage.getItem('highScore') || 0; // Retrieve high score from localStorage or default to 0
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

// Initialize high score display
highScoreElement.textContent = highScore;

// Function to generate a random math question based on difficulty
function generateQuestion() {
    const num1 = Math.floor(Math.random() * 10 * difficulty) + 1; // Generate a random number
    const num2 = Math.floor(Math.random() * 10 * difficulty) + 1; // Generate another random number
    const operators = ['+', '-', '*']; // Supported operators
    const operator = operators[Math.floor(Math.random() * operators.length)]; // Random operator
    
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

    // Store the generated question and answer
    currentQuestion = { question: `${num1} ${operator} ${num2}`, answer };
    questionElement.textContent = currentQuestion.question; // Display the question
}

// Function to start the game
function startGame() {
    currentStreak = 0; // Reset streak
    difficulty = 1; // Reset difficulty
    updateStats(); // Update stats on the UI
    feedbackElement.textContent = ''; // Clear feedback
    answerInput.disabled = false; // Enable the input field
    submitButton.disabled = false; // Enable the submit button
    generateQuestion(); // Generate the first question
}

// Function to handle answer submission
function checkAnswer(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    // Ensure input is a valid number
    const userAnswer = parseInt(answerInput.value);
    if (isNaN(userAnswer)) {
        feedbackElement.textContent = 'Please enter a valid number!';
        feedbackElement.style.color = 'red';
        return;
    }

    // Check if the answer is correct
    if (userAnswer === currentQuestion.answer) {
        currentStreak++; // Increment streak
        difficulty = Math.min(difficulty + 1, 10); // Increment difficulty, capped at 10
        feedbackElement.textContent = 'Correct! 🎉';
        feedbackElement.style.color = 'green';
        generateQuestion(); // Generate a new question
    } else {
        feedbackElement.textContent = `Incorrect! The correct answer was ${currentQuestion.answer}. Try again!`;
        feedbackElement.style.color = 'red';
        endGame(); // End the game
    }

    // Clear the input field
    answerInput.value = '';
    updateStats(); // Update stats on the UI
}

// Function to update the stats displayed on the page
function updateStats() {
    currentStreakElement.textContent = currentStreak; // Update current streak
    if (currentStreak > highScore) {
        highScore = currentStreak; // Update high score if the current streak is higher
        localStorage.setItem('highScore', highScore); // Save high score to localStorage
    }
    highScoreElement.textContent = highScore; // Update high score on the UI
}

// Function to end the game
function endGame() {
    answerInput.disabled = true; // Disable the input field
    submitButton.disabled = true; // Disable the submit button
    questionElement.textContent = 'Press Start to try again!'; // Reset question display
}

// Event listeners for game interaction
startButton.addEventListener('click', startGame); // Start game when the button is clicked
gameForm.addEventListener('submit', checkAnswer); // Handle answer submission
