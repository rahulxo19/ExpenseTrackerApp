const mongoose = require("mongoose");
const User = require("../model/signup");

const expenseSchema = new mongoose.Schema({
  price: Number,
  category: String,
  description: String,
  userId: { type: mongoose.ObjectId, ref: "User" },
});

const Expenses = mongoose.model("Expenses", expenseSchema);

module.exports = Expenses;
