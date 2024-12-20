// Player List: Include platform, username, and hardcoded real names
const players = [
    { username: "adamo25", platform: "chesscom", realName: "Adam Furneau" },
    { username: "Mordecai_6", platform: "chesscom", realName: "Darius Hoareau" },
    { username: "MinusE1", platform: "chesscom", realName: "Rudolph Camille" },
    { username: "KingBen36", platform: "lichess", realName: "Benjamin Hoareau" },
    { username: "Jeremy_Raguain", platform: "chesscom", realName: "Jeremy Raguain" }
];

// Hosted JSON URL
const jsonURL = "https://your-username.github.io/your-repo/rankings.json";

// Fetch Rankings When Page Loads
window.onload = fetchAndUpdateRankings;

// Main Function to Fetch and Display Rankings
async function fetchAndUpdateRankings() {
    try {
        // Fetch the rankings.json file
        const response = await fetch(jsonURL);
        const rankingsData = await response.json();

        // Extract previous and current rankings
        const previousRankings = rankingsData.previousRankings || [];
        const currentRankings = await fetchCurrentRankings();

        // Calculate ranking changes
        const updatedRankings = calculateRankingChanges(previousRankings, currentRankings);

        // Display updated rankings in the table
        displayRankings(updatedRankings);

        // Update rankings.json with the latest rankings
        rankingsData.previousRankings = [...currentRankings];
        await updateRankingsFile(rankingsData);

    } catch (error) {
        console.error("Error fetching or updating rankings:", error);
    }
}

// Fetch current rankings from Chess.com and Lichess
async function fetchCurrentRankings() {
    const rankings = [];

    for (let player of players) {
        try {
            let ratingData = { rapid: "N/A", blitz: "N/A", bullet: "N/A" };
            let realName = player.realName;
            let isAdjusted = false;
            let originalLichessRating = null;

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
            // Fetch data from Lichess
            else if (player.platform === "lichess") {
                const res = await fetch(`https://lichess.org/api/user/${player.username}`);
                const data = await res.json();

                originalLichessRating = {
                    rapid: data.perfs?.rapid?.rating || "N/A",
                    blitz: data.perfs?.blitz?.rating || "N/A",
                    bullet: data.perfs?.bullet?.rating || "N/A"
                };

                ratingData = {
                    rapid: originalLichessRating.rapid !== "N/A" ? originalLichessRating.rapid - 200 : "N/A",
                    blitz: originalLichessRating.blitz !== "N/A" ? originalLichessRating.blitz - 200 : "N/A",
                    bullet: originalLichessRating.bullet !== "N/A" ? originalLichessRating.bullet - 200 : "N/A"
                };
                isAdjusted = true;
            }

            rankings.push({
                name: realName,
                username: player.username,
                rank: 0, // Will be determined after sorting
                platform: player.platform === "lichess" ? "Lichess (Adjusted)" : "Chess.com",
                rapid: ratingData.rapid,
                originalLichess: originalLichessRating,
                isAdjusted: isAdjusted
            });
        } catch (error) {
            console.error(`Error fetching data for ${player.username}:`, error);
        }
    }

    // Sort Rankings by Rapid Rating
    rankings.sort((a, b) => (b.rapid !== "N/A" ? b.rapid : 0) - (a.rapid !== "N/A" ? a.rapid : 0));

    // Assign ranks
    rankings.forEach((player, index) => player.rank = index + 1);

    return rankings;
}

// Calculate ranking changes
function calculateRankingChanges(previous, current) {
    return current.map(player => {
        const previousPlayer = previous.find(p => p.username === player.username);
        let evolution = "=";

        if (previousPlayer) {
            const rankDifference = previousPlayer.rank - player.rank;
            if (rankDifference > 0) evolution = `↑ ${rankDifference}`;
            else if (rankDifference < 0) evolution = `↓ ${Math.abs(rankDifference)}`;
        } else {
            evolution = "New";
        }

        return { ...player, evolution };
    });
}

// Display rankings in the table
function displayRankings(rankings) {
    const tableBody = document.getElementById("rankingsBody");
    tableBody.innerHTML = "";

    rankings.forEach(player => {
        const row = `
            <tr>
                <td>${player.rank}</td>
                <td>${player.evolution}</td>
                <td>${player.name}</td>
                <td>${player.rapid}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

// Update rankings.json file
async function updateRankingsFile(updatedData) {
    // POST request to update JSON file dynamically (requires server support)
    const response = await fetch("/update-json-endpoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData)
    });

    if (!response.ok) {
        console.error("Failed to update rankings.json");
    }
}
