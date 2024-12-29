// Player List: Include platform, username, and hardcoded real names
const players = [
    { username: "adamo25", platform: "chesscom", realName: "Adam Furneau" },
    { username: "Mordecai_6", platform: "chesscom", realName: "Darius Hoareau" },
    { username: "MinusE1", platform: "chesscom", realName: "Rudolph Camille" },
    { username: "KingBen36", platform: "lichess", realName: "Benjamin Hoareau" },
];

// Hosted JSON URL
const jsonURL = "./rankings.json"; // Corrected to point to the local file in the same directory

// Fetch Rankings When Page Loads
window.onload = fetchAndUpdateRankings;

// Main Function to Fetch and Display Rankings
async function fetchAndUpdateRankings() {
    try {
        // Fetch the rankings.json file
        const response = await fetch(jsonURL);
        if (!response.ok) throw new Error("Failed to fetch rankings.json");

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
            let ratingData = { rapid: "N/A", blitz: "N/A", bullet: "N/A", seychelles: "N/A" };
            let realName = player.realName;
            let isAdjusted = false;
            let originalLichessRating = null;

            // Fetch data from Chess.com
            if (player.platform === "chesscom") {
                const statsRes = await fetch(`https://api.chess.com/pub/player/${player.username}/stats`);
                if (!statsRes.ok) throw new Error(`Failed to fetch data for ${player.username}`);
                const statsData = await statsRes.json();

                ratingData = {
                    ...ratingData,
                    rapid: statsData.chess_rapid?.last?.rating || "N/A",
                    blitz: statsData.chess_blitz?.last?.rating || "N/A",
                    bullet: statsData.chess_bullet?.last?.rating || "N/A"
                };
            }
            // Fetch data from Lichess
            else if (player.platform === "lichess") {
                const res = await fetch(`https://lichess.org/api/user/${player.username}`);
                if (!res.ok) throw new Error(`Failed to fetch data for ${player.username}`);
                const data = await res.json();

                originalLichessRating = {
                    rapid: data.perfs?.rapid?.rating || "N/A",
                    blitz: data.perfs?.blitz?.rating || "N/A",
                    bullet: data.perfs?.bullet?.rating || "N/A"
                };

                ratingData = {
                    rapid: originalLichessRating.rapid !== "N/A" ? originalLichessRating.rapid - 200 : "N/A",
                    blitz: originalLichessRating.blitz !== "N/A" ? originalLichessRating.blitz - 200 : "N/A",
                    bullet: originalLichessRating.bullet !== "N/A" ? originalLichessRating.bullet - 200 : "N/A",
                    seychelles: "N/A" // Hardcoded as N/A for Seychelles rating
                };
                isAdjusted = true;
            }

            // Use 0 for calculation if value is N/A
            const calculatedBullet = ratingData.bullet === "N/A" ? 0 : ratingData.bullet;
            const calculatedBlitz = ratingData.blitz === "N/A" ? 0 : ratingData.blitz;
            const calculatedRapid = ratingData.rapid === "N/A" ? 0 : ratingData.rapid;

            // Calculate the SEYCHESS rating with a weighted formula
            const seyChessRating = (calculatedBullet * 0.15) + (calculatedBlitz * 0.35) + (calculatedRapid * 0.5);

            // Push the processed data
            rankings.push({
                name: realName,
                username: player.username,
                rank: 0, // Will be determined after sorting
                platform: player.platform === "lichess" ? "Lichess (Adjusted)" : "Chess.com",
                bullet: ratingData.bullet,
                blitz: ratingData.blitz,
                rapid: ratingData.rapid,
                seychelles: seyChessRating, // Display Seychelles Rating (calculated)
                calculatedBullet,
                calculatedBlitz,
                calculatedRapid,
            });
        } catch (error) {
            console.error(`Error fetching data for ${player.username}:`, error);
        }
    }

    // Sort Rankings by SEYCHESS Rating
    rankings.sort((a, b) => b.seychelles - a.seychelles); // Sort by SEYCHESS rating now

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
        // Format SeyChess rating to 1 decimal place unless it's "N/A"
        const seychessRating = player.seychelles === "N/A" ? "N/A" : player.seychelles.toFixed(1);

        const row = `
            <tr>
                <td>${player.rank}</td>
                <td>${player.evolution}</td>
                <td>${player.name}</td>
                <td>${player.bullet === "N/A" ? "N/A" : player.bullet}</td>
                <td>${player.blitz === "N/A" ? "N/A" : player.blitz}</td>
                <td>${player.rapid === "N/A" ? "N/A" : player.rapid}</td>
                <td>${seychessRating}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}

// Update rankings.json file
async function updateRankingsFile(updatedData) {
    console.log("Updated rankings.json:", updatedData);
}
