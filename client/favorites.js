document.addEventListener('DOMContentLoaded', () => {
    const user = localStorage.getItem("loggedInUser");
    const favoritesList = document.getElementById("favorites-list");
    const searchInput = document.getElementById("searchInput");
    const logoutBtn = document.getElementById("logout-btn");

    if (!user) {
        alert("You must be logged in to view favorites.");
        window.location.href = "index.html";
        return;
    }

    // Safe copy of favorites
    const allFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    let userFavorites = Array.isArray(allFavorites[user]) ? [...allFavorites[user]] : [];

    function renderFavorites(filter = "") {
        favoritesList.innerHTML = "";

        const filtered = userFavorites.filter(item =>
            item.toLowerCase().includes(filter.toLowerCase())
        );

        if (filtered.length === 0) {
            favoritesList.innerHTML = "<li class='list-group-item'>No matching results.</li>";
            return;
        }

        filtered.forEach(place => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";
            li.textContent = place;

            const delBtn = document.createElement("button");
            delBtn.className = "btn btn-sm btn-danger";
            delBtn.textContent = "Remove";
            delBtn.onclick = () => {
                const index = userFavorites.indexOf(place);
                if (index > -1) {
                    userFavorites.splice(index, 1);
                    allFavorites[user] = userFavorites;
                    localStorage.setItem("favorites", JSON.stringify(allFavorites));
                    renderFavorites(searchInput.value);
                }
            };

            li.appendChild(delBtn);
            favoritesList.appendChild(li);
        });
    }

    renderFavorites();

    searchInput.addEventListener("input", () => {
        renderFavorites(searchInput.value);
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    });
});

// Welcome Message
const user = localStorage.getItem("loggedInUser");
if (user) {
    document.getElementById("welcome-message").textContent = `Welcome, ${user}!`;
}