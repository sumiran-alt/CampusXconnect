const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  totalScore: {
    type: Number,
    default: 0,
  },
  rank: {
    type: Number,
    default: 0,
  },
  scoreBreakdown: {
    codingProblems: {
      type: Number,
      default: 0,
      description: "Points from solved coding problems",
    },
    projectsPosted: {
      type: Number,
      default: 0,
      description: "Points from posting projects",
    },
    projectLikes: {
      type: Number,
      default: 0,
      description: "Points from project likes",
    },
    connections: {
      type: Number,
      default: 0,
      description: "Points for established connections",
    },
    posts: {
      type: Number,
      default: 0,
      description: "Points from posts",
    },
    postEngagement: {
      type: Number,
      default: 0,
      description: "Points from post likes/comments",
    },
    communityParticipation: {
      type: Number,
      default: 0,
      description: "Points from community contributions",
    },
    hackathonParticipation: {
      type: Number,
      default: 0,
      description: "Points from hackathon wins",
    },
    jobApplications: {
      type: Number,
      default: 0,
      description: "Points from job applications and offers",
    },
  },
  statistics: {
    totalProblemnsSolved: Number,
    totalProjectsPosted: Number,
    totalConnections: Number,
    networkSize: Number,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

leaderboardSchema.index({ totalScore: -1, rank: 1 });
leaderboardSchema.index({ userId: 1 });

module.exports = mongoose.model("Leaderboard", leaderboardSchema);
