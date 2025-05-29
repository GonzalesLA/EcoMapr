document.addEventListener('DOMContentLoaded', () => {
    // Initialize the Leaflet map
    const map = L.map('map').setView([25.276987, 55.296249], 13); // Dubai default view

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Location markers with "Add to Favorites"
    const locations = [
        { name: "Burj Khalifa", coords: [25.1972, 55.2744] },
        { name: "Dubai Mall", coords: [25.1985, 55.2796] },
        { name: "Palm Jumeirah", coords: [25.1120, 55.1386] },
        { name: "Dubai Marina", coords: [25.0800, 55.1400] },
        { name: "Dubai Frame", coords: [25.2292, 55.2882] },
        { name: "Global Village", coords: [25.0672, 55.3050] },
        { name: "Dubai Creek", coords: [25.2637, 55.3088] },
        { name: "Museum of the future", coords: [25.2305, 55.2781] },
        { name: "Ain Dubai", coords: [25.0772, 55.1332] },
        { name: "Jumeirah Beach", coords: [25.2048, 55.2489] },
        { name: "Mall of Emirates", coords: [25.1180, 55.2003] },
        { name: "Wild Wadi Waterpark", coords: [25.1411, 55.1888] },
        { name: "IMG Wolds of Adventure", coords: [25.0700, 55.3012] },
        { name: "Al Fahidi Historical District", coords: [25.2639, 55.2978] },
        { name: "Dubai Butterfly Garden", coords: [25.0930, 55.1746] }
    ];

    locations.forEach(location => {
        const marker = L.marker(location.coords).addTo(map);
        marker.bindPopup(`
            <b>${location.name}</b><br/>
            <button onclick="saveToFavorites('${location.name}')">Add to Favorites</button>
        `);
    });
});

// Save to favorites function
function saveToFavorites(placeName) {
    const user = localStorage.getItem("loggedInUser");
    if (!user) {
        alert("You must be logged in to save favorites.");
        return;
    }

    const allFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    const userFavorites = allFavorites[user] || [];

    if (!userFavorites.includes(placeName)) {
        userFavorites.push(placeName);
        allFavorites[user] = userFavorites;
        localStorage.setItem("favorites", JSON.stringify(allFavorites));
        alert(`${placeName} added to favorites!`);
    } else {
        alert(`${placeName} is already in your favorites.`);
    }
}

// Welcome Message
const user = localStorage.getItem("loggedInUser");
if (user) {
    document.getElementById("welcome-message").textContent = `Welcome, ${user}!`;
}

// Logout function
function logout() {
    localStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}