console.log("signup.js loaded");

function showAlert(message, type = "danger") {
    const alertContainer = document.getElementById("alert-container");
    alertContainer.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
}

document.getElementById("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("new-username").value.trim();
    const password = document.getElementById("new-password").value;

    try {
        const res = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        const text = await res.text();
        console.log("Raw response from server:", text);

        const data = JSON.parse(text);

        if (data.success) {
            console.log("Signup successful");
            window.location.href = "index.html";
        } else {
            console.warn("Signup failed with message:", data.error);
            showAlert(data.error || "Signup failed.");
        }

    } catch (err) {
        console.error("Catch block error:", err);
        showAlert("Error signing up.");
    }
});