const mongoose = require("mongoose");

const ExcelDataSchema = new mongoose.Schema({
  data: { type: Array, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("ExcelData", ExcelDataSchema);
