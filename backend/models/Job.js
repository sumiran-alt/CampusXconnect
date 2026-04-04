const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a job title"],
    trim: true,
  },
  company: {
    type: String,
    required: [true, "Please provide company name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please provide job description"],
    maxlength: 5000,
  },
  jobType: {
    type: String,
    enum: ["internship", "full-time", "part-time", "contract"],
    required: true,
  },
  location: {
    type: String,
    default: "Remote",
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: "INR",
    },
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requirements: [
    {
      type: String,
    },
  ],
  responsibilities: [
    {
      type: String,
    },
  ],
  benefits: [String],
  duration: {
    // For internships
    months: Number,
    startDate: Date,
  },
  applyLink: {
    type: String,
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  tags: [String],
  status: {
    type: String,
    enum: ["open", "closed", "filled"],
    default: "open",
  },
  views: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

jobSchema.index({ postedBy: 1 });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ status: 1 });

module.exports = mongoose.model("Job", jobSchema);
