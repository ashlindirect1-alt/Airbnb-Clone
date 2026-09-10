const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        loginMessage.textContent = "Please enter email and password.";
        return;
    }

    // Save login information
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userEmail", email);

    loginMessage.textContent = "Login successful!";

    // Go back to Home
    setTimeout(function () {
        window.location.href = "index.html";
    }, 500);
});