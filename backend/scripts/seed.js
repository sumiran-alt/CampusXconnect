const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Post = require("./models/Post");
const CodingProblem = require("./models/CodingProblem");
const Comment = require("./models/Comment");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Connection Error:", error.message);
    process.exit(1);
  }
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    await CodingProblem.deleteMany({});
    await Comment.deleteMany({});

    console.log("Cleared existing data");

    // Create sample users
    const users = await User.insertMany([
      {
        name: "Raj Kumar",
        email: "raj@example.com",
        password: "password123",
        branch: "CSE",
        year: 3,
        bio: "Passionate about web development and AI",
        skills: ["React", "Node.js", "MongoDB", "Python"],
        github: "https://github.com/rajkumar",
        linkedin: "https://linkedin.com/in/rajkumar",
      },
      {
        name: "Priya Singh",
        email: "priya@example.com",
        password: "password123",
        branch: "ECE",
        year: 2,
        bio: "IoT and Embedded Systems enthusiast",
        skills: ["Arduino", "C++", "IoT", "Circuit Design"],
        github: "https://github.com/priyasingh",
        linkedin: "https://linkedin.com/in/priyasingh",
      },
      {
        name: "Ankit Patel",
        email: "ankit@example.com",
        password: "password123",
        branch: "IT",
        year: 1,
        bio: "Exploring full-stack development",
        skills: ["HTML", "CSS", "JavaScript"],
        github: "https://github.com/ankitpatel",
        linkedin: "https://linkedin.com/in/ankitpatel",
      },
      {
        name: "Neha Sharma",
        email: "neha@example.com",
        password: "password123",
        branch: "CSE",
        year: 4,
        bio: "Final year student interested in DevOps",
        skills: ["Docker", "Kubernetes", "CI/CD", "AWS"],
        github: "https://github.com/nehasharma",
        linkedin: "https://linkedin.com/in/nehasharma",
      },
    ]);

    console.log(`${users.length} users created`);

    // Create sample posts
    const posts = await Post.insertMany([
      {
        title: "AI-Powered Study Assistant",
        description:
          "Built a machine learning model that helps students with personalized study recommendations using their learning patterns.",
        author: users[0]._id,
        techStack: ["Python", "TensorFlow", "React", "Node.js"],
        githubLink: "https://github.com/rajkumar/study-assistant",
      },
      {
        title: "Smart IoT Door Lock System",
        description:
          "Developed an IoT-based door lock system with mobile app integration and biometric authentication.",
        author: users[1]._id,
        techStack: ["Arduino", "React Native", "Node.js", "MongoDB"],
        githubLink: "https://github.com/priyasingh/iot-lock",
      },
      {
        title: "College Resource Sharing Platform",
        description:
          "Created a web app for students to share and discover study materials, notes, and resources.",
        author: users[2]._id,
        techStack: ["React", "Express", "MongoDB", "Tailwind CSS"],
        githubLink: "https://github.com/ankitpatel/resource-sharing",
      },
    ]);

    console.log(`${posts.length} posts created`);

    // Create sample coding problems
    const problems = await CodingProblem.insertMany([
      {
        title: "Two Sum",
        description:
          "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
        difficulty: "Easy",
        category: "Array",
        testCases: [
          { input: "nums = [2,7,11,15], target = 9", output: "[0,1]" },
          { input: "nums = [3,2,4], target = 6", output: "[1,2]" },
        ],
      },
      {
        title: "Reverse String",
        description:
          "Write a function that reverses a string. The input string is given as an array of characters.",
        difficulty: "Easy",
        category: "String",
        testCases: [
          {
            input: 's = ["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
          },
        ],
      },
      {
        title: "Longest Substring Without Repeating Characters",
        description:
          "Given a string s, find the length of the longest substring without repeating characters.",
        difficulty: "Medium",
        category: "String",
        testCases: [
          { input: 's = "abcabcbb"', output: "3" },
          { input: 's = "bbbbb"', output: "1" },
        ],
      },
      {
        title: "Merge K Sorted Lists",
        description:
          "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
        difficulty: "Hard",
        category: "Linked List",
        testCases: [
          {
            input: "lists = [[1,4,5],[1,3,4],[2,6]]",
            output: "[1,1,2,3,4,4,5,6]",
          },
        ],
      },
      {
        title: "Median of Two Sorted Arrays",
        description:
          "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
        difficulty: "Hard",
        category: "Array",
        testCases: [{ input: "nums1 = [1,3], nums2 = [2]", output: "2" }],
      },
    ]);

    console.log(`${problems.length} coding problems created`);

    // Create sample comments
    const comments = await Comment.insertMany([
      {
        content: "This project looks amazing! Would love to collaborate on it.",
        author: users[1]._id,
        post: posts[0]._id,
      },
      {
        content: "Great implementation of ML concepts. Keep up the good work!",
        author: users[3]._id,
        post: posts[0]._id,
      },
    ]);

    console.log(`${comments.length} comments created`);

    // Add comments to posts
    posts[0].comments = [comments[0]._id, comments[1]._id];
    posts[0].likes = [users[1]._id, users[3]._id];
    await posts[0].save();

    console.log("Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error.message);
    process.exit(1);
  }
};

// Run the seed
connectDB().then(() => {
  seedDatabase();
});
