const mongoose = require("mongoose");

const hackathonTeamSchema = new mongoose.Schema({
  hackathonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hackathon",
    required: true,
  },
  teamName: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      userId: mongoose.Schema.Types.ObjectId,
      role: String,
      joinedAt: { type: Date, default: Date.now },
    },
  ],
  memberCount: {
    type: Number,
    default: 1,
  },
  logo: String,
  techStack: [String],
  ideaStatement: String,
  registeredAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["active", "submitted", "disqualified"],
    default: "active",
  },
});

hackathonTeamSchema.index({ hackathonId: 1 });
hackathonTeamSchema.index({ leader: 1 });

module.exports = mongoose.model("HackathonTeam", hackathonTeamSchema);
