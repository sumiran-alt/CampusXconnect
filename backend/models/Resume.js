const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    profileUrl: String,
    summary: String,
  },
  education: [
    {
      schoolName: String,
      degree: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
      grade: String,
      activities: String,
    },
  ],
  experience: [
    {
      companyName: String,
      position: String,
      startDate: Date,
      endDate: Date,
      currentlyWorking: Boolean,
      description: String,
    },
  ],
  projects: [
    {
      projectName: String,
      description: String,
      link: String,
      technologies: [String],
    },
  ],
  skills: [
    {
      skillName: String,
      proficiency: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "expert"],
      },
    },
  ],
  certifications: [
    {
      certName: String,
      issueOrg: String,
      issueDate: Date,
    },
  ],
  languages: [
    {
      language: String,
      proficiency: {
        type: String,
        enum: ["basic", "intermediate", "fluent", "native"],
      },
    },
  ],
  resumeAI: {
    suggestions: [String],
    improvementAreas: [String],
    lastAnalyzedAt: Date,
  },
  templates: {
    currentTemplate: {
      type: String,
      enum: ["classic", "modern", "creative", "minimal"],
      default: "modern",
    },
    customColor: {
      type: String,
      default: "#2563eb",
    },
  },
  exports: {
    pdfUrl: String,
    lastGeneratedAt: Date,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
  shareLink: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Resume", resumeSchema);
