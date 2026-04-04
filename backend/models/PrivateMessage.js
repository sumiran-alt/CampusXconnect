const mongoose = require("mongoose");

const PrivateMessageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    attachments: [
      {
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        path: String,
      },
    ],
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    deletedBySender: {
      type: Boolean,
      default: false,
    },
    deletedByRecipient: {
      type: Boolean,
      default: false,
    },
    deletedForEveryone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for fast lookups
PrivateMessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });
PrivateMessageSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model("PrivateMessage", PrivateMessageSchema);
