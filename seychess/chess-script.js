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

            // Fetch Only Rapid Rating
            const rapid = data.chess_rapid?.last?.rating || "N/A";

            rankings.push({
                username,
                platform: "Chess.com",
                rapid
            });
        } catch (error) {
            console.error(`Error fetching ${username}:`, error);
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
                <td>${player.username}</td>
                <td>${player.rapid}</td>
            </tr>
            <!-- Hidden Details Row -->
            <tr class="details">
                <td colspan="3">
                    <strong>Platform:</strong> ${player.platform}<br>
                    <strong>Rapid Rating:</strong> ${player.rapid}
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
