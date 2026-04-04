const User = require("../models/User");

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set user type (student or alumni)
// @route   PUT /api/users/user-type
// @access  Private
exports.setUserType = async (req, res) => {
  try {
    const { userType } = req.body;

    // Validate user type
    if (!userType || !["student", "alumni"].includes(userType)) {
      return res.status(400).json({
        message: "Please provide a valid user type: 'student' or 'alumni'",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { userType },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      user,
      message: `User type set to ${userType}`,
    });
  } catch (error) {
    console.error("Set user type error:", error);
    
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      message: error.message || "Failed to set user type",
    });
  }
};

// @desc    Complete profile setup (after signup)
// @route   PUT /api/users/profile/complete
// @access  Private
exports.completeProfileSetup = async (req, res) => {
  try {
    const {
      degree,
      branch,
      year,
      passoutYear,
      company,
      jobRole,
      skills,
      interests,
      profilePicture,
      github,
      linkedin,
    } = req.body;

    // Get current user to check userType
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const userType = currentUser.userType;

    // Validate required fields
    if (!degree || !branch) {
      return res.status(400).json({
        message: "Please provide degree and branch",
      });
    }

    // Validate based on user type
    if (userType === "student" && !year) {
      return res.status(400).json({
        message: "Please provide year of study",
      });
    }

    if (userType === "alumni" && !passoutYear) {
      return res.status(400).json({
        message: "Please provide year of passing",
      });
    }

    // Validate profile picture size if provided (max 2MB)
    if (profilePicture && profilePicture.length > 2097152) {
      return res.status(400).json({
        message: "Profile picture is too large. Max size: 2MB. Please compress the image.",
      });
    }

    const updateData = {
      degree,
      branch,
      profileCompletionStatus: true,
    };

    // Add type-specific fields
    if (userType === "student") {
      updateData.year = parseInt(year);
      if (interests && interests.length > 0) {
        updateData.interests = interests;
      }
    } else if (userType === "alumni") {
      updateData.passoutYear = parseInt(passoutYear);
      if (company) {
        updateData.company = company;
      }
      if (jobRole) {
        updateData.jobRole = jobRole;
      }
    }

    // Add optional common fields
    if (skills && skills.length > 0) {
      updateData.skills = skills;
    }
    if (profilePicture) {
      updateData.profilePicture = profilePicture;
    }
    if (github) {
      updateData.github = github;
    }
    if (linkedin) {
      updateData.linkedin = linkedin;
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user,
      message: "Profile setup completed successfully",
    });
  } catch (error) {
    console.error("Profile completion error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: Object.values(error.errors)
          .map((e) => e.message)
          .join(", "),
      });
    }

    res.status(500).json({
      message: error.message || "Failed to complete profile setup",
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile/update
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const {
      name,
      bio,
      skills,
      github,
      linkedin,
      profilePicture,
      branch,
      year,
      passoutYear,
      rollNumber,
      company,
      degree,
    } = req.body;

    // Validate profile picture size (max 2MB)
    if (profilePicture && profilePicture.length > 2097152) {
      return res.status(400).json({ 
        message: "Profile picture is too large. Max size: 2MB. Please compress the image." 
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (skills) updateData.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim().filter(s => s));
    if (github) updateData.github = github;
    if (linkedin) updateData.linkedin = linkedin;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (branch) updateData.branch = branch;
    if (year) updateData.year = year;
    if (passoutYear) updateData.passoutYear = passoutYear;
    if (rollNumber) updateData.rollNumber = rollNumber;
    if (company) updateData.company = company;
    if (degree) updateData.degree = degree;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error("Profile update error:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }
    
    res.status(500).json({ 
      message: error.message || "Failed to update profile" 
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate("followers")
      .populate("following");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow a user
// @route   POST /api/users/follow/:id
// @access  Private
exports.followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    if (!currentUser.following.includes(req.params.id)) {
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user.id);

      await currentUser.save();
      await userToFollow.save();
    }

    res.status(200).json({
      success: true,
      message: "User followed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unfollow a user
// @route   POST /api/users/unfollow/:id
// @access  Private
exports.unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: "User not found" });
    }

    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== req.params.id,
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== req.user.id,
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: "User unfollowed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
