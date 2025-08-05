// leaderboard.js

async function loadLeaderboard(gamemode) {
    try {
        const response = await fetch(`${gamemode}.json`);
        const data = await response.json();

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
