const mongoose = require("mongoose");

const codingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  category: {
    type: String,
    required: true,
  },
  testCases: [
    {
      input: String,
      output: String,
    },
  ],
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CodingProblem", codingProblemSchema);
