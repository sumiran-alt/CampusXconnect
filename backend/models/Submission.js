const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodingProblem",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ["JavaScript", "Python", "Java", "C++", "Go"],
    default: "JavaScript",
  },
  status: {
    type: String,
    enum: ["Accepted", "Wrong Answer", "Runtime Error", "Time Limit Exceeded"],
    default: "Accepted",
  },
  runtime: {
    type: Number,
    default: 0,
  },
  memory: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
