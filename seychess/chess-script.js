// List of Players to Fetch (Chess.com usernames only)
const players = [
    "adamo25",       // Chess.com Username
    "Mordecai_6"     // Chess.com Username
];

// Automatically Fetch Rankings When the Page Loads
window.onload = fetchRankings;

// Main Function to Fetch and Display Rankings
async function fetchRankings() {
    const rankings = [];  // Array to Store Player Data

    for (let username of players) {
        try {
            // Fetch Data from Chess.com API
            const chessComRes = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
            const chessComData = await chessComRes.json();

            // Collect Player Data
            rankings.push({
                platform: "Chess.com",    // Platform Name
                username: username,      // Player Username
                blitz: chessComData.chess_blitz?.last?.rating || "N/A",   // Blitz Rating
                rapid: chessComData.chess_rapid?.last?.rating || "N/A",   // Rapid Rating
                bullet: chessComData.chess_bullet?.last?.rating || "N/A"  // Bullet Rating
            });

        } catch (error) {
            console.error(`Error fetching data for ${username}:`, error);  // Log Any Errors
        }
    }

    // Sort Rankings by Rapid Rating (Highest First)
    rankings.sort((a, b) => (b.rapid || 0) - (a.rapid || 0));

    // Display Rankings in the Table
    displayRankings(rankings);
}

// Function to Insert Table Rows Dynamically
function displayRankings(rankings) {
    const tableBody = document.getElementById("rankingsBody");
    tableBody.innerHTML = "";  // Clear Previous Table Content

    // Loop Through Each Player and Add to Table
    rankings.forEach((player, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>             <!-- Player Rank -->
                <td>${player.username}</td>      <!-- Player Username -->
                <td>${player.platform}</td>      <!-- Platform -->
                <td>${player.blitz}</td>         <!-- Blitz Rating -->
                <td>${player.rapid}</td>         <!-- Rapid Rating -->
                <td>${player.bullet}</td>        <!-- Bullet Rating -->
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);  // Insert Row into Table
    });
}
