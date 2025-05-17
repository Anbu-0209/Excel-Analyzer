const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  email:    { type: String, required: true },
  password: { type: String, required: true }, 
  token:    { type: String, required: true },
  loginAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model("Login", loginSchema);

