
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
let filterType = "all";
const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");

let transactions = [];
let editId = null;
let expenseChart;

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

    if (editId) {

    fetch(`https://expense-tracker-ni9x.onrender.com/transactions/${editId}`, {, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
    })
    .then(response => response.json())
    .then(data => {
        editId = null;
        loadTransactions();
    });

} else {

    fetch("https://expense-tracker-ni9x.onrender.com/transactions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(transaction)
    })
    .then(response => response.json())
    .then(data => {
        loadTransactions();
    });

}

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
        // FILTER LOGIC (NEW)
    if (filterType !== "all" && transaction.type !== filterType) {
        return;
    }

    // SEARCH FILTER (your existing code)
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
    updateChart(totalIncome, totalExpense);
}
async function deleteTransaction(index) {

    const id = transactions[index]._id;

    await fetch(`https://expense-tracker-ni9x.onrender.com/transactions/${id}`,{
        method: "DELETE"
    });

    loadTransactions();

}
function editTransaction(index) {

    const transaction = transactions[index];

    editId = transaction._id;

    document.getElementById("title").value = transaction.title;
    document.getElementById("amount").value = transaction.amount;
    document.getElementById("type").value = transaction.type;
    document.getElementById("category").value = transaction.category;
    document.getElementById("date").value = transaction.date;

}

async function loadTransactions() {
    const response = await fetch("https://expense-tracker-ni9x.onrender.com/transactions");
    transactions = await response.json();
    console.log(transactions);
    displayTransactions();
}

loadTransactions();
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
function setFilter(type) {
    filterType = type;
    displayTransactions();
}
function updateChart(totalIncome, totalExpense) {
    const canvas = document.getElementById("expenseChart");

    if (!canvas) {
        return;
    }

    const ctx = canvas.getContext("2d");

    if (expenseChart) {
        expenseChart.destroy();
    }

    expenseChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: ['#4CAF50', '#F44336']
            }]
        }
    });
}