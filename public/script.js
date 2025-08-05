let isAdmin = false;

function checkAdmin() {
  const pin = document.getElementById("adminPin").value;
  if (pin === "0255") {
    isAdmin = true;
    document.getElementById("addForm").style.display = "block";
  } else {
    alert("Incorrect pin");
  }
}

function loadData() {
  fetch(`/api/${gamemode}`)
    .then((res) => res.json())
    .then((data) => {
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";
      data.sort((a, b) => a.tier.localeCompare(b.tier));
      data.forEach((player) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${player.name}</td>
          <td>${player.tier}</td>
          <td class="actions">
            ${
              isAdmin
                ? `<button onclick="removePlayer('${player.name}', '${player.tier}')">Delete</button>`
                : ""
            }
          </td>`;
        tbody.appendChild(row);
      });
    });
}

function addPlayer() {
  const name = document.getElementById("nameInput").value;
  const tier = document.getElementById("tierInput").value;
  fetch(`/api/${gamemode}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, tier }),
  }).then(loadData);
}

function removePlayer(name, tier) {
  fetch(`/api/${gamemode}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, tier }),
  }).then(loadData);
}

window.onload = loadData;
