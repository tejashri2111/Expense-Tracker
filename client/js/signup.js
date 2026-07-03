const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("name").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;
    const user = {
    name: name,
    email: email,
    password: password
};
localStorage.setItem("user",JSON.stringify(user));

    console.log(name);
    console.log(email);
    console.log(password);

    alert("Signup Successful!");
    window.location.href = "login.html";

});