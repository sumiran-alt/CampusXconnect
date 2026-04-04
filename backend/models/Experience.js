const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: [true, "Please provide job title"],
  },
  company: {
    type: String,
    required: [true, "Please provide company name"],
  },
  type: {
    type: String,
    enum: ["Job", "Internship", "Freelance", "Contract", "Part-time"],
    required: [true, "Please select employment type"],
  },
  location: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    required: [true, "Please provide start date"],
  },
  endDate: {
    type: Date,
  },
  currentlyWorking: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: "",
  },
  skills: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Experience", experienceSchema);
