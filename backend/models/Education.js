const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  school: {
    type: String,
    required: [true, "Please provide school/college name"],
  },
  degree: {
    type: String,
    required: [true, "Please provide degree"],
  },
  fieldOfStudy: {
    type: String,
    required: [true, "Please provide field of study"],
  },
  startDate: {
    type: Date,
    required: [true, "Please provide start date"],
  },
  endDate: {
    type: Date,
  },
  currentlyStudying: {
    type: Boolean,
    default: false,
  },
  grade: {
    type: String,
    default: "",
  },
  activities: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Education", educationSchema);
