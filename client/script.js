console.log("script.js loaded");

// Redirect if you already logged in
const loggedInUser = localStorage.getItem("loggedInUser");
if (loggedInUser && window.location.pathname.includes("index.html")) {
    window.location.href = "map.html";
}

// Login
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            try {
                const response = await fetch("http://localhost:5000/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem("loggedInUser", username);
                    window.location.href = "map.html";
                } else {
                    showAlert(`Login failed: ${result.error}`);
                }
            } catch (err) {
                console.error(err);
                showAlert("Something went wrong during login.");
            }
        });
    }

    // Signup logic
    const signupForm = document.getElementById("signup-form");
    if (signupForm) {
        signupForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.getElementById("new-username").value.trim();
            const password = document.getElementById("new-password").value.trim();

            try {
                const response = await fetch("http://localhost:5000/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert("Signup successful! Redirecting to login...", "success");
                    setTimeout(() => window.location.href = "index.html", 1500);
                } else {
                    showAlert(`Signup failed: ${result.error}`);
                }
            } catch (err) {
                console.error(err);
                showAlert("Something went wrong during signup.");
            }
        });
    }
});

// Alert function
function showAlert(message, type = "danger") {
    const alertContainer = document.getElementById("alert-container");
    if (!alertContainer) return;

    alertContainer.innerHTML = `
        <div class="alert alert=${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    setTimeout(() => {
        const alert = document.querySelector(".alert");
        if (alert) alertremove();
    }, 4000);
}