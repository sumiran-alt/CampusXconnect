const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  profilePicture: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
  college: {
    type: String,
    default: "Dronacharya Group of Institutions",
  },
  degree: {
    type: String,
    enum: {
      values: [null, "B.Tech", "MBA", "BCA", "B.Sc", "M.Tech", "M.Sc", "B.A", "M.A", "B.Com", "M.Com", "Other"],
      message: "Please select a valid degree"
    },
    default: null,
  },
  branch: {
    type: String,
    enum: {
      values: [null, "CSE", "ECE", "ME", "CIVIL", "EE", "IT", "BT", "CS-DS", "CSIT", "AIML", "ECZ", "Other"],
      message: "Please select a valid branch"
    },
    default: null,
  },
  year: {
    type: Number,
    enum: {
      values: [null, 1, 2, 3, 4],
      message: "Please select a valid year"
    },
    default: null,
  },
  userType: {
    type: String,
    enum: {
      values: [null, "student", "alumni"],
      message: "Please select a valid user type"
    },
    default: null,
  },
  passoutYear: {
    type: Number,
    default: null,
  },
  jobRole: {
    type: String,
    default: "",
  },
  interests: [{ type: String }],
  profileCompletionStatus: {
    type: Boolean,
    default: false,
  },
  skills: [{ type: String }],
  bio: {
    type: String,
    default: "",
  },
  github: {
    type: String,
    default: "",
  },
  linkedin: {
    type: String,
    default: "",
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  connections: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  rollNumber: {
    type: String,
    default: "",
  },
  company: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
