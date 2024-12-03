// Redirect to the game page when "Start Game" button is clicked or Enter is pressed
const startButton = document.getElementById('start-btn');

// Handle click event
startButton.addEventListener('click', () => {
    window.location.href = 'game.html';
});

// Handle Enter key activation
startButton.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        window.location.href = 'game.html';
    }
});
