const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide community name"],
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000,
  },
  icon: String,
  banner: String,
  category: {
    type: String,
    enum: [
      "ai_ml",
      "web_dev",
      "mobile_dev",
      "cloud",
      "competitive_programming",
      "startups",
      "design",
      "devops",
      "blockchain",
      "data_science",
      "other",
    ],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moderators: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  members: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      joinedAt: { type: Date, default: Date.now },
      role: {
        type: String,
        enum: ["member", "moderator", "admin"],
        default: "member",
      },
    },
  ],
  memberCount: {
    type: Number,
    default: 1,
  },
  rules: [String],
  tags: [String],
  isPrivate: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
  },
  stats: {
    totalPosts: {
      type: Number,
      default: 0,
    },
    totalMembers: {
      type: Number,
      default: 1,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
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

communitySchema.pre("save", function (next) {
  this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  next();
});

communitySchema.index({ slug: 1 });
communitySchema.index({ category: 1 });

module.exports = mongoose.model("Community", communitySchema);
