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
            const res = await fetch(`https://api.chess.com/pub/player/${username}`);
            const statsRes = await fetch(`https://api.chess.com/pub/player/${username}/stats`);

            const profileData = await res.json();
            const statsData = await statsRes.json();

            // Fetch Ratings
            const rapid = statsData.chess_rapid?.last?.rating || "N/A";
            const blitz = statsData.chess_blitz?.last?.rating || "N/A";
            const bullet = statsData.chess_bullet?.last?.rating || "N/A";

            rankings.push({
                name: profileData.name || username, // Real Name or Fallback to Username
                username: username,
                platform: "Chess.com",
                rapid,
                blitz,
                bullet
            });
        } catch (error) {
            console.error(`Error fetching data for ${username}:`, error);
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
    tableBody.innerHTML = "";

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
