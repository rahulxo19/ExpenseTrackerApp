const mongoose = require("mongoose");

const forgotPasswordSchema = new mongoose.Schema({
  userId: mongoose.Types.ObjectId,
  id: String,
  active: Boolean,
  expiresby: Date,
});

const forgotPassword = mongoose.model("forgotPassword", forgotPasswordSchema);

module.exports = forgotPassword;
