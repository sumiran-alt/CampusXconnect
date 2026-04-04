const mongoose = require("mongoose");

const hackathonSubmissionSchema = new mongoose.Schema({
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hackathon",
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HackathonTeam",
    required: true,
  },
  projectTitle: {
    type: String,
    required: true,
  },
  description: String,
  projectLink: String,
  githubLink: String,
  demoLink: String,
  videoLink: String,
  documentation: String,
  screenshots: [String],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["submitted", "approved", "rejected"],
    default: "submitted",
  },
  judgeScores: [
    {
      judgeId: mongoose.Schema.Types.ObjectId,
      scores: [
        {
          criteria: String,
          points: Number,
        },
      ],
      feedback: String,
      submittedAt: Date,
    },
  ],
  finalRank: Number,
  totalScore: {
    type: Number,
    default: 0,
  },
  awards: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

hackathonSubmissionSchema.index({ hackathonId: 1 });
hackathonSubmissionSchema.index({ teamId: 1 });

module.exports = mongoose.model("HackathonSubmission", hackathonSubmissionSchema);
