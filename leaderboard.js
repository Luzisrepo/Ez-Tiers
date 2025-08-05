// leaderboard.js

const tierRank = {
    "HT1": 1,
    "HT2": 2,
    "LT1": 3,
    "LT2": 4,
    "LT3": 5
};

async function loadLeaderboard(gamemode) {
    try {
        const response = await fetch(`${gamemode}.json`);
        let data = await response.json();

        // Sort data by tier
        data.sort((a, b) => {
            const rankA = tierRank[a["Tier"]] || 999;
            const rankB = tierRank[b["Tier"]] || 999;
            return rankA - rankB; // ascending (HT1 -> LT3)
        });

        const container = document.getElementById("leaderboard");
        const table = document.createElement("table");

        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Player Name</th>
                <th>Tier</th>
            </tr>`;
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        data.forEach(player => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${player["Player Name"]}</td><td>${player["Tier"]}</td>`;
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        container.appendChild(table);
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        document.getElementById("leaderboard").innerText = "Failed to load leaderboard.";
    }
}
