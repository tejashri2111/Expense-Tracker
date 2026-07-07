
const isLoggedIn = localStorage.getItem("isLoggedIn");

if (isLoggedIn !== "true") {
    window.location.href = "login.html";
}
const addBtn = document.getElementById("addBtn");
const transactionList = document.getElementById("transactionList");
const loading = document.getElementById("loading");
const search = document.getElementById("search");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
let filterType = "all";
const welcomeUser = document.getElementById("welcomeUser");
const logoutBtn = document.getElementById("logoutBtn");
let transactions = [];
let editId = null;
let expenseChart;ese

addBtn.addEventListener("click", function () {

    const title = document.getElementById("title").value;
    const amount = Number(document.getElementById("amount").value);
    const type = document.getElementById("type").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    const today = new Date().toISOString().split("T")[0];

if (date > today) {
    alert("Future dates are not allowed.");
    return;
}

if (title.trim() === "") {
    alert("Please enter a title.");
    return;
}

if (amount <= 0 || isNaN(amount)) {
    alert("Please enter a valid amount.");
    return;
}

if (date === "") {
    alert("Please select a date.");
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

    fetch(`https://expense-tracker-ni9x.onrender.com/transactions/${editId}`,  {
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
<div class="transaction-left">

    <div class="transaction-title">
        ${transaction.title}
    </div>

    <div class="transaction-info">

        <span>
            <i class="fa-solid fa-tag"></i>
            ${transaction.category}
        </span>

        <span>
            <i class="fa-solid fa-calendar"></i>
            ${transaction.date}
        </span>

    </div>

</div>

<div class="transaction-right">

    <div class="amount ${transaction.type}">
        ${transaction.type === "income" ? "+" : "-"}₹${transaction.amount}
    </div>

    <div class="action-buttons">

        <button class="edit-btn"
        onclick="editTransaction(${index})">
            <i class="fa-solid fa-pen"></i>
        </button>

        <button class="delete-btn"
        onclick="deleteTransaction(${index})">
            <i class="fa-solid fa-trash"></i>
        </button>

    </div>

</div>
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

    const confirmDelete = confirm("Are you sure you want to delete this transaction?");

    if (!confirmDelete) {
        return;
    }

    const id = transactions[index]._id;

    await fetch(`https://expense-tracker-ni9x.onrender.com/transactions/${id}`, {
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

    loading.style.display = "block";
    transactionList.style.display = "none";

    const response = await fetch("https://expense-tracker-ni9x.onrender.com/transactions");

    transactions = await response.json();

    loading.style.display = "none";
    transactionList.style.display = "block";

    displayTransactions();
}

loadTransactions();
document.getElementById("date").max =
    new Date().toISOString().split("T")[0];
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
    type: "doughnut",

    data: {
        labels: ["Income", "Expense"],

        datasets: [{
            data: [totalIncome, totalExpense],

            backgroundColor: [
                "#0F766E",
                "#EF4444"
            ],

            borderColor: [
                "#ffffff",
                "#ffffff"
            ],

            borderWidth: 4,
            hoverOffset: 15
        }]
    },

    options: {
        responsive: true,

        plugins: {

            legend: {
                position: "bottom",

                labels: {
                    padding: 20,
                    font: {
                        size: 14
                    }
                }
            }
        },

        cutout: "65%"
    }
});
}