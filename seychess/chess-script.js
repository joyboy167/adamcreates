// Player List: Include platform, username, and hardcoded real names
const players = [
    { username: "adamo25", platform: "chesscom", realName: "Adam Furneau" },
    { username: "Mordecai_6", platform: "chesscom", realName: "Darius Hoareau" },
    { username: "MinusE1", platform: "chesscom", realName: "Rudolph Camille" },
    { username: "Jeremy_Raguain", platform: "chesscom", realName: "Jeremy Raguain" },
    { username: "Buumpliz", platform: "chesscom", realName: "Alex Jovanovic" }, // Corrected Player Added
    { username: "durupa", platform: "chesscom", realName: "Alexander Durup" } // New player added
];

// Fetch Rankings When Page Loads
window.onload = fetchAndUpdateRankings;

// Main Function to Fetch and Display Rankings
async function fetchAndUpdateRankings() {
    try {
        // Fetch current rankings
        const currentRankings = await fetchCurrentRankings();

        // Display updated rankings in the table
        displayRankings(currentRankings);

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
            let avatar = "default-avatar.png"; // Fallback for missing avatars
            let realName = player.realName;

            // Fetch data from Chess.com
            if (player.platform === "chesscom") {
                const profileRes = await fetch(`https://api.chess.com/pub/player/${player.username}`);
                if (!profileRes.ok) throw new Error(`Failed to fetch profile for ${player.username}`);
                const profileData = await profileRes.json();

                avatar = profileData.avatar || "default-avatar.png";

                const statsRes = await fetch(`https://api.chess.com/pub/player/${player.username}/stats`);
                if (!statsRes.ok) throw new Error(`Failed to fetch stats for ${player.username}`);
                const statsData = await statsRes.json();

                ratingData = {
                    rapid: statsData.chess_rapid?.last?.rating || "N/A",
                    blitz: statsData.chess_blitz?.last?.rating || "N/A",
                    bullet: statsData.chess_bullet?.last?.rating || "N/A"
                };
            }

            // Use 0 for calculation if value is N/A
            const calculatedBullet = ratingData.bullet === "N/A" ? 0 : ratingData.bullet;
            const calculatedBlitz = ratingData.blitz === "N/A" ? 0 : ratingData.blitz;
            const calculatedRapid = ratingData.rapid === "N/A" ? 0 : ratingData.rapid;

            // Calculate the SEYCHESS rating with the updated weighted formula
            const seyChessRating = (calculatedBullet * 0.05) + (calculatedBlitz * 0.25) + (calculatedRapid * 0.7);

            // Push the processed data
            rankings.push({
                name: realName,
                username: player.username,
                rank: 0,
                platform: player.platform === "lichess" ? "Lichess (Adjusted)" : "Chess.com",
                avatar: avatar,
                bullet: ratingData.bullet,
                blitz: ratingData.blitz,
                rapid: ratingData.rapid,
                seychelles: seyChessRating
            });
        } catch (error) {
            console.error(`Error processing ${player.username}:`, error);
        }
    }

    rankings.sort((a, b) => b.seychelles - a.seychelles); // Sort by SEYCHESS rating
    rankings.forEach((player, index) => (player.rank = index + 1));

    return rankings;
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
                <td class="avatar-cell">
                    <img 
                        src="${player.avatar}" 
                        alt="${player.name}'s Avatar" 
                        class="avatar-img"
                        onerror="this.src='default-avatar.png';">
                </td>
                <td>${player.username}</td>
                <td>${player.bullet === "N/A" ? "N/A" : player.bullet}</td>
                <td>${player.blitz === "N/A" ? "N/A" : player.blitz}</td>
                <td>${player.rapid === "N/A" ? "N/A" : player.rapid}</td>
                <td>${seychessRating}</td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", row);
    });
}
