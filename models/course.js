const mongoose = require("mongoose");

const courseModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: true,
  },
  fees: {
    type: Number,
    required: true,
    default: 0,
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

module.exports = mongoose.model("Course", courseModel);
