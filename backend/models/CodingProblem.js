const mongoose = require("mongoose");

const codingProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title"],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, "Please provide a slug"],
    unique: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: [true, "Please provide a description"],
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    default: "Medium",
  },
  tags: [
    {
      type: String,
    },
  ],
  category: {
    type: String,
    required: true,
  },
  constraints: [
    {
      type: String,
    },
  ],
  examples: [
    {
      input: String,
      output: String,
      explanation: String,
    },
  ],
  starterCode: {
    type: Map,
    of: String,
    default: () =>
      new Map([
        [
          "JavaScript",
          `// Write your solution here\nfunction solution(input) {\n  // Your code here\n  return result;\n}`,
        ],
        [
          "Python",
          `# Write your solution here\ndef solution(input):\n    # Your code here\n    return result`,
        ],
        [
          "Java",
          `// Write your solution here\npublic class Solution {\n    public static void main(String[] args) {\n        // Your code here\n    }\n}`,
        ],
        [
          "C++",
          `// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    return 0;\n}`,
        ],
      ]),
  },
  testCases: [
    {
      input: String,
      output: String,
      isHidden: {
        type: Boolean,
        default: false,
      },
    },
  ],
  submissions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Submission",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create slug from title before saving
codingProblemSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// Index for searching
codingProblemSchema.index({ title: "text", description: "text" });
codingProblemSchema.index({ slug: 1 });
codingProblemSchema.index({ difficulty: 1 });
codingProblemSchema.index({ tags: 1 });

module.exports = mongoose.model("CodingProblem", codingProblemSchema);
