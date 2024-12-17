// List of Players from Seychelles (Add Real Usernames)
const players = [
    "username1",  // Replace with real usernames
    "username2",
    "username3",
    "username4"
];

// Automatically Fetch Rankings When the Page Loads
window.onload = fetchRankings;

// Main Function to Fetch and Display Rankings
async function fetchRankings() {
    const rankings = [];  // Store Fetched Data Here

    for (let username of players) {
        try {
            // Fetch Data from Chess.com API
            const chessComRes = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
            const chessComData = await chessComRes.json();

            // Fetch Data from Lichess API
            const lichessRes = await fetch(`https://lichess.org/api/user/${username}`);
            const lichessData = await lichessRes.json();

            // Collect Data from Chess.com
            rankings.push({
                platform: "Chess.com",   // Data Source
                username: username,     // Player's Username
                blitz: chessComData.chess_blitz?.last?.rating || "N/A",   // Blitz Rating
                rapid: chessComData.chess_rapid?.last?.rating || "N/A",   // Rapid Rating
                bullet: chessComData.chess_bullet?.last?.rating || "N/A"  // Bullet Rating
            });

            // Collect Data from Lichess
            rankings.push({
                platform: "Lichess",     // Data Source
                username: username,      // Player's Username
                blitz: lichessData.perfs?.blitz?.rating || "N/A",  // Blitz Rating
                rapid: lichessData.perfs?.rapid?.rating || "N/A",  // Rapid Rating
                bullet: lichessData.perfs?.bullet?.rating || "N/A" // Bullet Rating
            });

        } catch (error) {
            console.error(`Error fetching data for ${username}:`, error);  // Log Errors
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
    tableBody.innerHTML = "";  // Clear Old Data

    // Loop Through Each Player and Create Table Rows
    rankings.forEach((player, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>             <!-- Player Rank -->
                <td>${player.username}</td>      <!-- Username -->
                <td>${player.platform}</td>      <!-- Platform -->
                <td>${player.blitz}</td>         <!-- Blitz Rating -->
                <td>${player.rapid}</td>         <!-- Rapid Rating -->
                <td>${player.bullet}</td>        <!-- Bullet Rating -->
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);  // Add Row to Table
    });
}
