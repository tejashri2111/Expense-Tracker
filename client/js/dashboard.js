
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}
const addBtn = document.getElementById("addBtn");
const transactionList = document.getElementById("transactionList");
const search = document.getElementById("search");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

addBtn.addEventListener("click", function () {

    const title = document.getElementById("title").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;

    if (title === "" || amount === 0) {
        alert("Please fill all fields");
        return;
    }

    const transaction = {
        title,
        amount,
        type,
        category,
        date
    };

    transactions.push(transaction);

localStorage.setItem("transactions", JSON.stringify(transactions));

displayTransactions();

// Clear input fields
document.getElementById("title").value = "";
document.getElementById("amount").value = "";
document.getElementById("type").value = "income";
document.getElementById("category").value = "Salary";
document.getElementById("date").value = "";

});
function displayTransactions() {

    transactionList.innerHTML = "";
    const searchValue = search.value.toLowerCase();

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(function (transaction, index) {
        if (!transaction.title.toLowerCase().includes(searchValue)) {
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `
    <span>
        <strong>${transaction.title}</strong><br>
        Category: ${transaction.category}<br>
        Date: ${transaction.date}
    </span>

    <span>
        ₹${transaction.amount}
        <button onclick="editTransaction(${index})">Edit</button>
        <button onclick="deleteTransaction(${index})">Delete</button>
    </span>
`;
        transactionList.appendChild(li);

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }

    });

    income.innerText = "₹" + totalIncome;
    expense.innerText = "₹" + totalExpense;
    balance.innerText = "₹" + (totalIncome - totalExpense);
}
function deleteTransaction(index) {

    transactions.splice(index, 1);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    displayTransactions();

}
function editTransaction(index) {

    const transaction = transactions[index];
    document.getElementById("title").value = transaction.title; 
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("type").value = transaction.type;
    document.getElementById("category").value = transaction.category;
    document.getElementById("date").value = transaction.date;

    transactions.splice(index, 1);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    displayTransactions();

}

displayTransactions();
search.addEventListener("input", function () {

    displayTransactions();

});

const user = JSON.parse(localStorage.getItem("user"));

if (user) {
    welcomeUser.innerText = `Hello, ${user.name} 👋`;
}
logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("isLoggedIn");

    window.location.href = "login.html";

});