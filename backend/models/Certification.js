const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: [true, "Please provide certification name"],
  },
  issuer: {
    type: String,
    required: [true, "Please provide issuer organization"],
  },
  issueDate: {
    type: Date,
    required: [true, "Please provide issue date"],
  },
  expiryDate: {
    type: Date,
  },
  doesNotExpire: {
    type: Boolean,
    default: false,
  },
  credentialId: {
    type: String,
    default: "",
  },
  credentialUrl: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Certification", certificationSchema);
