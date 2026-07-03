const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const user = JSON.parse(localStorage.getItem("user"));

    if (user === null) {
        alert("No account found. Please Sign Up first.");
        return;
    }

    if (email === user.email && password === user.password) {

    localStorage.setItem("isLoggedIn", "true");

    alert("Login Successful!");

    window.location.href = "dashboard.html";

} else {

        alert("Invalid Email or Password!");

    }

});