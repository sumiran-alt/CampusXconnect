const User = require("../models/User");

// Search users with flexible query patterns
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const searchQuery = query.trim();
    let results = [];

    // Check if query contains dash (for multi-field search)
    if (searchQuery.includes("-")) {
      const parts = searchQuery.split("-").map((p) => p.trim());

      if (parts.length === 2) {
        const [part1, part2] = parts;

        // Try to determine which part is what
        // Check if part is a number (could be year/rollnumber)
        const part1IsNumber = !isNaN(part1);
        const part2IsNumber = !isNaN(part2);

        // Search by name and year (batch)
        if (part1IsNumber && !part2IsNumber) {
          // Format: "2024-John" or "2-John"
          results = await User.find({
            name: { $regex: part2, $options: "i" },
            year: parseInt(part1),
          }).select("-password");
        } else if (!part1IsNumber && part2IsNumber) {
          // Format: "John-2024" or "John-2"
          results = await User.find({
            name: { $regex: part1, $options: "i" },
            year: parseInt(part2),
          }).select("-password");
        } else if (part1IsNumber && part2IsNumber) {
          // Both numbers - try rollnumber and year
          results = await User.find({
            $or: [
              {
                rollNumber: { $regex: part1, $options: "i" },
                name: { $regex: part2, $options: "i" },
              },
              {
                rollNumber: { $regex: part2, $options: "i" },
                name: { $regex: part1, $options: "i" },
              },
            ],
          }).select("-password");
        } else {
          // Both are text - could be name and company
          results = await User.find({
            $or: [
              {
                name: { $regex: part1, $options: "i" },
                company: { $regex: part2, $options: "i" },
              },
              {
                name: { $regex: part2, $options: "i" },
                company: { $regex: part1, $options: "i" },
              },
              {
                name: { $regex: part1, $options: "i" },
                rollNumber: { $regex: part2, $options: "i" },
              },
              {
                name: { $regex: part2, $options: "i" },
                rollNumber: { $regex: part1, $options: "i" },
              },
            ],
          }).select("-password");
        }
      }
    } else {
      // Simple name search
      results = await User.find({
        name: { $regex: searchQuery, $options: "i" },
      }).select("-password");

      // If no results by name, try other fields
      if (results.length === 0) {
        results = await User.find({
          $or: [
            { rollNumber: { $regex: searchQuery, $options: "i" } },
            { company: { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
          ],
        }).select("-password");
      }
    }

    // Sort results by relevance (exact name match first)
    results.sort((a, b) => {
      const aNameMatch = a.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
        ? 1
        : 0;
      const bNameMatch = b.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
        ? 1
        : 0;
      return bNameMatch - aNameMatch;
    });

    res.json({
      success: true,
      count: results.length,
      results: results.slice(0, 50), // Limit to 50 results
    });
  } catch (error) {
    console.error("Error searching users:", error);
    res
      .status(500)
      .json({ message: "Error searching users", error: error.message });
  }
};

// Advanced search with filters
exports.advancedSearch = async (req, res) => {
  try {
    const { name, batch, branch, company, rollNumber } = req.query;

    let searchFilters = {};

    if (name) {
      searchFilters.name = { $regex: name, $options: "i" };
    }

    if (batch) {
      searchFilters.year = parseInt(batch);
    }

    if (branch) {
      searchFilters.branch = branch.toUpperCase();
    }

    if (company) {
      searchFilters.company = { $regex: company, $options: "i" };
    }

    if (rollNumber) {
      searchFilters.rollNumber = { $regex: rollNumber, $options: "i" };
    }

    const results = await User.find(searchFilters)
      .select("-password")
      .limit(50);

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    console.error("Error in advanced search:", error);
    res
      .status(500)
      .json({ message: "Error in advanced search", error: error.message });
  }
};

// Get all users (for admin or limited view)
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments({ role: "user" });
    const users = await User.find({ role: "user" })
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      totalUsers,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};
