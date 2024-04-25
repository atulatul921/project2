const mongoose = require("mongoose");

const testDetail = mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  passingMarks: {
    type: String,
    required: true,
    default: 0,
  },
  totalMarks: {
    type: String,
    required: true,
    default: 100,
  },
  questions: [
    {
      id: Number,
      question: String,
      answers: [
        {
          answer: String,
          correct: Boolean,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("TestDetail", testDetail);
