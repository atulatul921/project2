const mongoose = require("mongoose");

const batchTimingsModel = new mongoose.Schema({
  time: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("BatchTiming", batchTimingsModel);
