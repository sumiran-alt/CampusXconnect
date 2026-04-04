const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    respondedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// Prevent duplicate pending requests
ConnectionRequestSchema.index(
  { from: 1, to: 1, status: 1 },
  { unique: true, sparse: true },
);

module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
