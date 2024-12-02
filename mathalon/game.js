// New element for progress bar
const progressBar = document.createElement('div');
progressBar.id = 'progress-bar';
const progressFill = document.createElement('div');
progressFill.id = 'progress-fill';
progressBar.appendChild(progressFill);
document.querySelector('main').appendChild(progressBar); // Add progress bar to the main section

// Adjusting `checkAnswer` to update the progress bar
function checkAnswer(event) {
    event.preventDefault();

    const userAnswer = parseInt(answerInput.value);
    if (userAnswer === currentQuestion.answer) {
        currentScore++; // Increment score for level (if needed internally)
        questionsAnswered++;

        // Update the progress bar
        const progressPercentage = (questionsAnswered / 8) * 100; // 8 correct answers to advance
        progressFill.style.width = `${progressPercentage}%`;

        if (questionsAnswered === 8) {
            levelUp(); // Level up when progress bar is full
        } else {
            generateQuestion(); // Load the next question
        }
    } else {
        feedbackElement.textContent = "Incorrect. Try again.";
        feedbackElement.style.color = 'red';
    }

    // Clear the input field
    answerInput.value = '';
}

// Reset progress bar when leveling up
function levelUp() {
    level++;
    questionsAnswered = 0;
    progressFill.style.width = '0%'; // Reset progress bar for the new level
    levelElement.textContent = `Level: ${level}`;
    feedbackElement.textContent = '';
    startTimer(); // Reset timer
    showLevelModal();
}
