const mongoose = require("mongoose");

const batchModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  info: {
    type: String,
    required: false,
  },
  timing: {
    type: mongoose.Schema.ObjectId,
    ref: "BatchTiming",
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
  ],
  created_at: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("Batch", batchModel);
