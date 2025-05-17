const mongoose = require("mongoose");

const uploadHistorySchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  size: { type: String, required: true },
  uploadTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model("UploadHistory", uploadHistorySchema);
