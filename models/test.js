const mongoose = require("mongoose");

const testModel = new mongoose.Schema({
  testDetail: {
    type: mongoose.Schema.ObjectId,
    ref: "TestDetail",
  },
  attendedStudents: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
  ],
  completedStudents: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
  ],
  startTime: {
    type: Date,
    required: true,
    default: new Date().toUTCString,
  },
  endTime: {
    type: Date,
    required: true,
    default: new Date().toUTCString,
  },
});

module.exports = mongoose.model("Test", testModel);
