const mongoose = require("mongoose");

const studentModel = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
    default: "",
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  stream: {
    type: String,
    enum: ["Science", "Commerce", "Arts", "None"],
    default: "None",
    required: false,
  },
  dob: {
    type: Date,
    default: Date.now,
    required: true,
  },
  enrolled: {
    type: Boolean,
    required: true,
    default: false,
  },
  image: {
    type: String,
    required: false,
  },
  batches: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Batch",
    },
  ],
  courses: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
  tests: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Test",
    },
  ],
});

module.exports = mongoose.model("Student", studentModel);
