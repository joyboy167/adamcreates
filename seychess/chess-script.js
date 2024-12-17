// Player List
const players = [
    "adamo25",
    "Mordecai_6"
];

// Fetch Rankings When Page Loads
window.onload = fetchRankings;

async function fetchRankings() {
    const rankings = [];

    for (let username of players) {
        try {
            const res = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
            const data = await res.json();

            rankings.push({
                username,
                platform: "Chess.com",
                rapid: data.chess_rapid?.last?.rating || "N/A",
                blitz: data.chess_blitz?.last?.rating || "N/A",
                bullet: data.chess_bullet?.last?.rating || "N/A",
                average: calculateAverage([
                    data.chess_rapid?.last?.rating,
                    data.chess_blitz?.last?.rating,
                    data.chess_bullet?.last?.rating
                ])
            });
        } catch (error) {
            console.error(`Error fetching ${username}:`, error);
        }
    }

    rankings.sort((a, b) => b.average - a.average); // Sort by Average Rating
    displayRankings(rankings);
}

function calculateAverage(ratings) {
    const validRatings = ratings.filter(rating => rating !== "N/A");
    const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
    return validRatings.length ? Math.round(sum / validRatings.length) : "N/A";
}

function displayRankings(rankings) {
    const tableBody = document.getElementById("rankingsBody");
    tableBody.innerHTML = "";

    rankings.forEach((player, index) => {
        const mainRow = `
            <tr onclick="toggleDetails(this)">
                <td>${index + 1}</td>
                <td>${player.username}</td>
                <td>${player.platform}</td>
                <td>${player
