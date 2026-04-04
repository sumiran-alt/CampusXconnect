const mongoose = require("mongoose");

const communityPostSchema = new mongoose.Schema({
  communityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Community",
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  type: {
    type: String,
    enum: ["discussion", "question", "resource", "event", "announcement"],
    default: "discussion",
  },
  tags: [String],
  attachments: [
    {
      url: String,
      type: String, // image, video, pdf, etc.
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  likesCount: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommunityComment",
    },
  ],
  commentsCount: {
    type: Number,
    default: 0,
  },
  isPinned: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["published", "archived", "removed"],
    default: "published",
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

communityPostSchema.index({ communityId: 1 });
communityPostSchema.index({ author: 1 });
communityPostSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CommunityPost", communityPostSchema);
