const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    title: String,
    amount: Number,
    type: String,
    category: String,
    date: String
});

module.exports = mongoose.model("Transaction", transactionSchema);