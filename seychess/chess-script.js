// Player List
const players = [
    "adamo25",
    "Mordecai_6"
];

// Fetch Rankings When Page Loads
window.onload = fetchRankings;

// Main Function to Fetch and Display Rankings
async function fetchRankings() {
    const rankings = [];

    for (let username of players) {
        try {
            const res = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
            const data = await res.json();

            // Calculate Average of Rapid, Blitz, and Bullet Ratings
            const rapid = data.chess_rapid?.last?.rating || 0;
            const blitz = data.chess_blitz?.last?.rating || 0;
            const bullet = data.chess_bullet?.last?.rating || 0;
            const validRatings = [rapid, blitz, bullet].filter(rating => rating > 0);
            const average = validRatings.length ? Math.round(validRatings.reduce((a, b) => a + b, 0) / validRatings.length) : "N/A";

            rankings.push({
                username,
                platform: "Chess.com",
                rapid: rapid || "N/A",
                blitz: blitz || "N/A",
                bullet: bullet || "N/A",
                average
            });
        } catch (error) {
            console.error(`Error fetching ${username}:`, error);
        }
    }

    rankings.sort((a, b) => b.average - a.average); // Sort by Average Rating
    displayRankings(rankings);
}

// Function to Display Rankings in Table
function displayRankings(rankings) {
    const tableBody = document.getElementById("rankingsBody");
    tableBody.innerHTML = "";

    rankings.forEach((player, index) => {
        // Main Row (Collapsed by Default)
        const mainRow = `
            <tr onclick="toggleDetails(this)">
                <td>${index + 1}</td>
                <td>${player.username}</td>
                <td>${player.average}</td>
            </tr>
            <!-- Hidden Details Row -->
            <tr class="details">
                <td colspan="3">
                    <strong>Platform:</strong> ${player.platform}<br>
                    <strong>Rapid Rating:</strong> ${player.rapid}<br>
                    <strong>Blitz Rating:</strong> ${player.blitz}<br>
                    <strong>Bullet Rating:</strong> ${player.bullet}
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", mainRow);
    });
}

// Function to Toggle Hidden Details Row
function toggleDetails(row) {
    const detailsRow = row.nextElementSibling; // Get the next sibling row
    detailsRow.classList.toggle("expand");
}
