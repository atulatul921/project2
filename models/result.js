const mongoose = require("mongoose");

const resultModel = new mongoose.Schema({
    test: {
        type: mongoose.Schema.ObjectId,
        ref: "Test",
    },
    student:
    {
        type: mongoose.Schema.ObjectId,
        ref: "Student",
    },
    marks: {
        receivedMarks: {
            type: String
        },
        totalMarks: {
            type: String
        }
    },
});

module.exports = mongoose.model("Result", resultModel);
