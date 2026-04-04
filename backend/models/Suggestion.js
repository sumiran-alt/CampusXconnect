const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  senderInfo: {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderProfilePicture: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  suggestionText: {
    type: String,
    required: [true, "Please provide a suggestion"],
    trim: true,
    maxlength: [500, "Suggestion cannot exceed 500 characters"],
    minlength: [10, "Suggestion must be at least 10 characters"],
  },
  category: {
    type: String,
    enum: ["skill_improvement", "project_idea", "career_advice", "collaboration", "other"],
    default: "other",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for faster queries
suggestionSchema.index({ receiverId: 1, createdAt: -1 });
suggestionSchema.index({ "senderInfo.senderId": 1, createdAt: -1 });

module.exports = mongoose.model("Suggestion", suggestionSchema);
