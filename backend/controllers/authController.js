const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Signup user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and password" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin Signup
// @route   POST /api/auth/admin/signup
// @access  Public (Protected by admin key)
exports.adminSignup = async (req, res) => {
  try {
    const { name, email, password, adminKey } = req.body;

    // Verify admin key
    const validAdminKey = process.env.ADMIN_KEY || "admin_secret_key_2024";
    if (adminKey !== validAdminKey) {
      return res.status(403).json({ message: "Invalid admin key" });
    }

    // Validate
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and password" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: "admin",
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Admin Login
// @route   POST /api/auth/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check for admin user
    const user = await User.findOne({ email, role: "admin" }).select(
      "+password",
    );

    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid credentials or not an admin" });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send OTP to Email
// @route   POST /api/auth/send-otp
// @access  Public
exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate
    if (!email) {
      return res.status(400).json({ message: "Please provide email" });
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set OTP expiry to 10 minutes from now
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP to database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // For development: log OTP to console
    console.log(`\n📧 OTP for ${email}: ${otp}`);
    console.log(`⏰ OTP expires at: ${otpExpiry}\n`);

    // TODO: In production, send email using nodemailer or SendGrid
    // sendEmailWithOTP(email, otp);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email. Check console for development.",
      // For development, return OTP (remove in production)
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP and Login
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTPAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate
    if (!email || !otp) {
      return res.status(400).json({ message: "Please provide email and OTP" });
    }

    // Find user with OTP
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP exists and hasn't expired
    if (!user.otp || !user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "No OTP requested. Request OTP first." });
    }

    if (new Date() > user.otpExpiry) {
      return res
        .status(400)
        .json({ message: "OTP has expired. Request a new one." });
    }

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    // OTP verified, clear it and generate token
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
