const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  paymentid: String,
  orderid: String,
  status: String,
});

const Order = new mongoose.model("Order", orderSchema);

module.exports = Order;
