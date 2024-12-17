// Player List: Include platform and username
const players = [
    { username: "adamo25", platform: "chesscom" },   // Chess.com player
    { username: "Mordecai_6", platform: "chesscom" }, // Chess.com player
    { username: "MinusE1", platform: "chesscom" },   // Chess.com player
    { username: "KingBen36", platform: "lichess" }   // Lichess player
];

// Fetch Rankings When Page Loads
window.onload = fetchRankings;

// Main Function to Fetch and Display Rankings
async function fetchRankings() {
    const rankings = [];

    for (let player of players) {
        try {
            let ratingData = { rapid: "N/A", blitz: "N/A", bullet: "N/A" };

            // Fetch ratings from Chess.com
            if (player.platform === "chesscom") {
                const statsRes = await fetch(`https://api.chess.com/pub/player/${player.username}/stats`);
                const statsData = await statsRes.json();

                ratingData = {
                    rapid: statsData.chess_rapid?.last?.rating || "N/A",
                    blitz: statsData.chess_blitz?.last?.rating || "N/A",
                    bullet: statsData.chess_bullet?.last?.rating || "N/A"
                };
            } 
            // Fetch ratings from Lichess and normalize them
            else if (player.platform === "lichess") {
                const res = await fetch(`https://lichess.org/api/user/${player.username}`);
                const data = await res.json();

                ratingData = {
                    rapid: data.perfs?.rapid?.rating ? data.perfs.rapid.rating - 200 : "N/A",
                    blitz: data.perfs?.blitz?.rating ? data.perfs.blitz.rating - 200 : "N/A",
                    bullet: data.perfs?.bullet?.rating ? data.perfs.bullet.rating - 200 : "N/A"
                };
            }

            rankings.push({
                name: player.username, // Use the username as the fallback
                username: player.username,
                platform: player.platform === "lichess" ? "Lichess (Adjusted)" : "Chess.com",
                rapid: ratingData.rapid,
                blitz: ratingData.blitz,
                bullet: ratingData.bullet
            });

        } catch (error) {
            console.error(`Error fetching data for ${player.username}:`, error);
        }
    }

    // Sort Rankings by Rapid Rating
    rankings.sort((a, b) => (b.rapid !== "N/A" ? b.rapid : 0) - (a.rapid !== "N/A" ? a.rapid : 0));

    // Display the Rankings
    displayRankings(rankings);
}

// Function to Display Rankings in Table
function displayRankings(rankings) {
    const tableBody = document.getElementById("rankingsBody");
    tableBody.innerHTML = ""; // Clear existing table rows

    rankings.forEach((player, index) => {
        // Main Row (Default Display)
        const mainRow = `
            <tr onclick="toggleDetails(this)">
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${player.rapid}</td>
            </tr>
            <!-- Hidden Details Row -->
            <tr class="details">
                <td colspan="3">
                    <div class="detail-platform">Platform: ${player.platform}</div>
                    <div class="detail-username">Username: ${player.username}</div>
                    <div class="detail-ratings">
                        <span>Rapid: ${player.rapid}</span>
                        <span>Blitz: ${player.blitz}</span>
                        <span>Bullet: ${player.bullet}</span>
                    </div>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", mainRow);
    });
}

// Function to Toggle Hidden Details Row
function toggleDetails(row) {
    const detailsRow = row.nextElementSibling; // Get the next sibling row
    if (detailsRow.style.display === "table-row") {
        detailsRow.style.display = "none"; // Hide the row
    } else {
        detailsRow.style.display = "table-row"; // Show the row
    }
}
