const mongoose = require("mongoose");

const startupIdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide an idea title"],
    trim: true,
    maxlength: 150,
  },
  description: {
    type: String,
    required: [true, "Please provide an idea description"],
    maxlength: 5000,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: [
      "fintech",
      "edtech",
      "healthtech",
      "social",
      "ecommerce",
      "ai_ml",
      "other",
    ],
    default: "other",
  },
  problemStatement: {
    type: String,
    required: true,
    maxlength: 1500,
  },
  solution: {
    type: String,
    required: true,
    maxlength: 1500,
  },
  targetMarket: {
    type: String,
    maxlength: 500,
  },
  businessModel: {
    type: String,
    enum: ["b2b", "b2c", "b2b2c", "freemium", "subscription", "other"],
  },
  rolesNeeded: [
    {
      role: String, // e.g., "Full Stack Developer", "UI/UX Designer"
      count: Number,
      description: String,
    },
  ],
  skillsRequired: [String],
  fundingStatus: {
    type: String,
    enum: ["pre_seed", "seed", "unfunded"],
    default: "unfunded",
  },
  estimatedBudget: {
    type: Number,
    default: 0,
  },
  interestedUsers: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      name: String,
      email: String,
      appliedRole: String,
      appliedAt: { type: Date, default: Date.now },
      status: {
        type: String,
        enum: ["interested", "accepted", "rejected", "pending"],
        default: "interested",
      },
    },
  ],
  interestedCount: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  tags: [String],
  status: {
    type: String,
    enum: ["open", "closed", "active", "funded"],
    default: "open",
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

startupIdeaSchema.index({ createdBy: 1 });
startupIdeaSchema.index({ status: 1 });
startupIdeaSchema.index({ createdAt: -1 });

module.exports = mongoose.model("StartupIdea", startupIdeaSchema);
