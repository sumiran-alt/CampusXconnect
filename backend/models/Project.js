const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a project title"],
    trim: true,
    maxlength: 200,
  },
  description: {
    type: String,
    required: [true, "Please provide a project description"],
    maxlength: 5000,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  techStack: [
    {
      type: String,
      trim: true,
    },
  ],
  githubLink: {
    type: String,
    default: "",
    match: [
      /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w-./]+$/,
      "Please provide a valid GitHub URL",
    ],
  },
  demoLink: {
    type: String,
    default: "",
  },
  screenshots: [
    {
      url: String,
      caption: String,
    },
  ],
  documentation: {
    url: String,
    type: String, // pdf, markdown, link
  },
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
      ref: "Comment",
    },
  ],
  status: {
    type: String,
    enum: ["draft", "published", "archived"],
    default: "draft",
  },
  visibility: {
    type: String,
    enum: ["public", "private", "connections"],
    default: "public",
  },
  collaborators: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      role: String, // lead, developer, designer
      joinedAt: Date,
    },
  ],
  tags: [String],
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

// Index for trending
projectSchema.index({ likesCount: -1, views: -1, createdAt: -1 });
projectSchema.index({ createdBy: 1 });

module.exports = mongoose.model("Project", projectSchema);
