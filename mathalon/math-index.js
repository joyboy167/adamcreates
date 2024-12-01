// DOM Elements
const startButton = document.getElementById('start-btn');

// Function to redirect to the game page
function startGame() {
    window.location.href = 'game.html'; // Redirect to the game page
}

// Add event listener to the Start Game button
startButton.addEventListener('click', startGame);
