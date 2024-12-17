// Player List: Include platform, username, and hardcoded real names
const players = [
    { username: "adamo25", platform: "chesscom", realName: "Adam Smith" },          // Hardcoded real name
    { username: "Mordecai_6", platform: "chesscom", realName: "Darius Hoareau" },   // Hardcoded real name
    { username: "MinusE1", platform: "chesscom", realName: "Rudolph Camille" },     // Hardcoded real name
    { username: "KingBen36", platform: "lichess", realName: "Benjamin Hoareau" }    // Hardcoded real name
];

// Fetch Rankings When Page Loads
window.onload = fetchRankings;

// Main Function to Fetch and Display Rankings
async function fetchRankings() {
    const rankings = [];

    for (let player of players) {
        try {
            let ratingData = { rapid: "N/A", blitz: "N/A", bullet: "N/A" };
            let realName = player.realName; // Prioritize hardcoded real name
            let isAdjusted = false; // Track if the rating is adjusted
            let originalLichessRating = null; // Store original Lichess rating for the tooltip

            // Fetch data from Chess.com
            if (player.platform === "chesscom") {
                const statsRes = await fetch(`https://api.chess.com/pub/player/${player.username}/stats`);
                const statsData = await statsRes.json();

                ratingData = {
                    rapid: statsData.chess_rapid?.last?.rating || "N/A",
                    blitz: statsData.chess_blitz?.last?.rating || "N/A",
                    bullet: statsData.chess_bullet?.last?.rating || "N/A"
                };
            }
            // Fetch data from Lichess and normalize ratings
            else if (player.platform === "lichess") {
                const res = await fetch(`https://lichess.org/api/user/${player.username}`);
                const data = await res.json();

                originalLichessRating = data.perfs?.rapid?.rating || "N/A"; // Original rating
                ratingData = {
                    rapid: originalLichessRating !== "N/A" ? originalLichessRating - 200 : "N/A",
                    blitz: data.perfs?.blitz?.rating ? data.perfs.blitz.rating - 200 : "N/A",
                    bullet: data.perfs?.bullet?.rating ? data.perfs.bullet.rating - 200 : "N/A"
                };
                isAdjusted = true; // Mark as adjusted
            }

            // Add the player's data to the rankings list
            rankings.push({
                name: realName,
                username: player.username,
                platform: player.platform === "lichess" ? "Lichess (Adjusted)" : "Chess.com",
                rapid: ratingData.rapid,
                originalLichessRating: originalLichessRating, // Keep the original Lichess rating
                isAdjusted: isAdjusted, // Track if rating is adjusted
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
        // Asterisk and tooltip logic for adjusted ratings
        let ratingDisplay = player.rapid;
        if (player.isAdjusted && player.originalLichessRating !== "N/A") {
            ratingDisplay = `
                ${player.rapid}
                <span class="tooltip" data-tooltip="Adjusted from Lichess rating of ${player.originalLichessRating}">*</span>
            `;
        }

        // Main Row (Default Display)
        const mainRow = `
            <tr onclick="toggleDetails(this)">
                <td>${index + 1}</td>
                <td>${player.name}</td>
                <td>${ratingDisplay}</td>
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
