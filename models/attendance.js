const mongoose = require("mongoose");

const attendanceSchema = mongoose.Schema({
  batch: {
    type: mongoose.Schema.ObjectId,
    ref: "Batch",
  },
  students: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
  ],
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
  },
  date: {
    type: Date,
    required: true,
    default: new Date().getDate,
  },
  dayReport: {
    type: String,
    required: false,
    default: "",
  },
});

module.exports = mongoose.model("attendance", attendanceSchema);
