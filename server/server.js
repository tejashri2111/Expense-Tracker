const express = require("express");
const cors = require("cors");
const connectDB = require("./config");
const Transaction = require("./models/Transaction");

const app = express();
const PORT = 5000;
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Home Route
app.get("/transactions", async (req, res) => {

    const transactions = await Transaction.find();

    res.json(transactions);

});

app.post("/transactions", async(req, res) => {

    const transaction = req.body;

    const newTransaction = await Transaction.create(req.body);

    res.json({
        message: "Transaction added successfully",
        transaction: newTransaction
    });

});
app.put("/transactions/:id", async(req, res) => {

    const id = req.params.id;

const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    req.body,
    { new: true }
);

res.json({
    message: "Transaction updated successfully",
    transaction: updatedTransaction
});

});
app.delete("/transactions/:id", async (req, res) => {

    const id = req.params.id;

    await Transaction.findByIdAndDelete(id);

    res.json({
        message: "Transaction deleted successfully"
    });

});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});