const mongoose = require("mongoose");

const hackathonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide hackathon title"],
    trim: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 3000,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  organizer: String,
  banner: String,
  location: {
    type: String,
    default: "online",
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  registrationDeadline: Date,
  theme: String,
  prizePool: {
    totalAmount: Number,
    currency: {
      type: String,
      default: "INR",
    },
    distribution: [
      {
        position: String, // 1st, 2nd, 3rd, etc.
        amount: Number,
      },
    ],
  },
  maxTeamSize: {
    type: Number,
    default: 5,
  },
  minTeamSize: {
    type: Number,
    default: 1,
  },
  registeredTeams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HackathonTeam",
    },
  ],
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HackathonSubmission",
    },
  ],
  judgesCriteria: [
    {
      criteria: String,
      weight: Number, // percentage
    },
  ],
  judges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  status: {
    type: String,
    enum: ["upcoming", "registration", "ongoing", "judging", "completed"],
    default: "upcoming",
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

hackathonSchema.index({ startDate: 1 });
hackathonSchema.index({ status: 1 });

module.exports = mongoose.model("Hackathon", hackathonSchema);
