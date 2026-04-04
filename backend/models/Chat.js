const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    lastMessageTime: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Ensure only 2 participants per chat
ChatSchema.pre("save", async function (next) {
  if (this.participants.length !== 2) {
    throw new Error("Chat must have exactly 2 participants");
  }
  next();
});

// Index for fast lookups
ChatSchema.index({ participants: 1 });

module.exports = mongoose.model("Chat", ChatSchema);
