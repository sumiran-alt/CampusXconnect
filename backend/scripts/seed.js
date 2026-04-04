const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Post = require("./models/Post");
const CodingProblem = require("./models/CodingProblem");
const Comment = require("./models/Comment");
const Submission = require("./models/Submission");

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
    await Submission.deleteMany({});

    console.log("Cleared existing data");

    // Create sample users
    const users = await User.insertMany([
      {
        name: "Raj Kumar",
        email: "raj@example.com",
        password: "password123",
        college: "Dronacharya Group of Institutions",
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
        college: "Dronacharya Group of Institutions",
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
        college: "Dronacharya Group of Institutions",
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
        college: "Dronacharya Group of Institutions",
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

    // Create sample coding problems with enhanced fields
    const problems = await CodingProblem.insertMany([
      {
        title: "Two Sum",
        slug: "two-sum",
        description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Array", "Hash Table"],
        constraints: [
          "2 <= nums.length <= 10^4",
          "-10^9 <= nums[i] <= 10^9",
          "-10^9 <= target <= 10^9",
          "Only one valid answer exists.",
        ],
        examples: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
          },
          {
            input: "nums = [3,3], target = 6",
            output: "[0,1]",
          },
        ],
        testCases: [
          {
            input: "nums = [2,7,11,15], target = 9",
            output: "[0,1]",
            isHidden: false,
          },
          {
            input: "nums = [3,2,4], target = 6",
            output: "[1,2]",
            isHidden: false,
          },
          {
            input: "nums = [3,3], target = 6",
            output: "[0,1]",
            isHidden: true,
          },
        ],
        starterCode: {
          JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Your code here
}`,
          Python: `def twoSum(nums, target):
    # Your code here
    pass`,
          Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your code here
    }
}`,
          "C++": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your code here
    }
};`,
        },
      },
      {
        title: "Reverse String",
        slug: "reverse-string",
        description: `Write a function that reverses a string. The input string is given as an array of characters s.

You must do this by modifying the input array in-place with O(1) extra memory.`,
        difficulty: "Easy",
        category: "Strings",
        tags: ["String", "Two Pointers"],
        constraints: [
          "1 <= s.length <= 10^5",
          "s[i] is a printable ascii character.",
        ],
        examples: [
          {
            input: 's = ["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
          },
          {
            input: 's = ["H","a","n","n","a","h"]',
            output: '["h","a","n","n","a","H"]',
          },
        ],
        testCases: [
          {
            input: 's = ["h","e","l","l","o"]',
            output: '["o","l","l","e","h"]',
            isHidden: false,
          },
          {
            input: 's = ["H","a","n","n","a","h"]',
            output: '["h","a","n","n","a","H"]',
            isHidden: false,
          },
        ],
        starterCode: {
          JavaScript: `/**
 * @param {character[]} s
 * @return {void} Do not return anything, modify s in-place instead.
 */
function reverseString(s) {
  // Your code here
}`,
          Python: `def reverseString(s):
    # Your code here
    pass`,
          Java: `class Solution {
    public void reverseString(char[] s) {
        // Your code here
    }
}`,
        },
      },
      {
        title: "Longest Substring Without Repeating Characters",
        slug: "longest-substring-without-repeating",
        description: `Given a string s, find the length of the longest substring without repeating characters.`,
        difficulty: "Medium",
        category: "Strings",
        tags: ["String", "Sliding Window", "Hash Table"],
        constraints: [
          "0 <= s.length <= 5 * 10^4",
          "s consists of English letters, digits, symbols and spaces.",
        ],
        examples: [
          {
            input: 's = "abcabcbb"',
            output: "3",
            explanation: "The answer is 'abc', with the length of 3.",
          },
          {
            input: 's = "bbbbb"',
            output: "1",
            explanation: "The answer is 'b', with the length of 1.",
          },
          {
            input: 's = "pwwkew"',
            output: "3",
            explanation: "The answer is 'wke', with the length of 3.",
          },
        ],
        testCases: [
          { input: 's = "abcabcbb"', output: "3", isHidden: false },
          { input: 's = "bbbbb"', output: "1", isHidden: false },
          { input: 's = "pwwkew"', output: "3", isHidden: true },
        ],
        starterCode: {
          JavaScript: `/**
 * @param {string} s
 * @return {number}
 */
function lengthOfLongestSubstring(s) {
  // Your code here
}`,
          Python: `def lengthOfLongestSubstring(s):
    # Your code here
    pass`,
        },
      },
      {
        title: "Binary Search",
        slug: "binary-search",
        description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
        difficulty: "Easy",
        category: "Arrays",
        tags: ["Array", "Binary Search"],
        constraints: [
          "1 <= nums.length <= 10^4",
          "-10^4 < nums[i], target < 10^4",
          "All the integers in nums are unique.",
          "nums is sorted in ascending order.",
        ],
        examples: [
          {
            input: "nums = [-1,0,3,5,9,12], target = 9",
            output: "4",
            explanation: "9 exists in nums and its index is 4",
          },
          {
            input: "nums = [-1,0,3,5,9,12], target = 2",
            output: "-1",
            explanation: "2 does not exist in nums so return -1",
          },
        ],
        testCases: [
          {
            input: "nums = [-1,0,3,5,9,12], target = 9",
            output: "4",
            isHidden: false,
          },
          {
            input: "nums = [-1,0,3,5,9,12], target = 2",
            output: "-1",
            isHidden: false,
          },
        ],
        starterCode: {
          JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
function search(nums, target) {
  // Your code here
}`,
          Python: `def search(nums, target):
    # Your code here
    pass`,
        },
      },
      {
        title: "Merge K Sorted Lists",
        slug: "merge-k-sorted-lists",
        description: `You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.

Merge all the linked-lists into one sorted linked-list and return it.`,
        difficulty: "Hard",
        category: "Linked Lists",
        tags: ["Linked List", "Divide and Conquer", "Heap", "Priority Queue"],
        constraints: [
          "k == lists.length",
          "0 <= k <= 10^4",
          "0 <= lists[i].length <= 500",
          "-10^4 <= lists[i][j] <= 10^4",
        ],
        examples: [
          {
            input: "lists = [[1,4,5],[1,3,4],[2,6]]",
            output: "[1,1,2,3,4,4,5,6]",
            explanation:
              "The linked-lists are: [1->4->5, 1->3->4, 2->6]. Merging them into one sorted list: 1->1->2->3->4->4->5->6",
          },
          {
            input: "lists = []",
            output: "[]",
          },
          {
            input: "lists = [[]]",
            output: "[]",
          },
        ],
        testCases: [
          {
            input: "lists = [[1,4,5],[1,3,4],[2,6]]",
            output: "[1,1,2,3,4,4,5,6]",
            isHidden: false,
          },
          { input: "lists = []", output: "[]", isHidden: true },
        ],
        starterCode: {
          JavaScript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
function mergeKLists(lists) {
  // Your code here
}`,
          Python: `def mergeKLists(lists):
    # Your code here
    pass`,
        },
      },
      {
        title: "Median of Two Sorted Arrays",
        slug: "median-of-two-sorted-arrays",
        description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
        difficulty: "Hard",
        category: "Arrays",
        tags: ["Array", "Binary Search", "Divide and Conquer"],
        constraints: [
          "nums1.length == m",
          "nums2.length == n",
          "0 <= m <= 1000",
          "0 <= n <= 1000",
          "1 <= m + n <= 2000",
          "-10^6 <= nums1[i], nums2[i] <= 10^6",
        ],
        examples: [
          {
            input: "nums1 = [1,3], nums2 = [2]",
            output: "2.00000",
            explanation: "merged array = [1,2,3] and median is 2.",
          },
          {
            input: "nums1 = [1,2], nums2 = [3,4]",
            output: "2.50000",
            explanation:
              "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
          },
        ],
        testCases: [
          {
            input: "nums1 = [1,3], nums2 = [2]",
            output: "2.00000",
            isHidden: false,
          },
          {
            input: "nums1 = [1,2], nums2 = [3,4]",
            output: "2.50000",
            isHidden: false,
          },
        ],
        starterCode: {
          JavaScript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
function findMedianSortedArrays(nums1, nums2) {
  // Your code here
}`,
          Python: `def findMedianSortedArrays(nums1, nums2):
    # Your code here
    pass`,
        },
      },
      {
        title: "Valid Parentheses",
        slug: "valid-parentheses",
        description: `Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
        difficulty: "Easy",
        category: "Stacks",
        tags: ["String", "Stack"],
        constraints: [
          "1 <= s.length <= 10^4",
          "s consists of parentheses only '()[]{}'.",
        ],
        examples: [
          {
            input: 's = "()"',
            output: "true",
          },
          {
            input: 's = "()[]{}"',
            output: "true",
          },
          {
            input: 's = "(]"',
            output: "false",
          },
        ],
        testCases: [
          { input: 's = "()"', output: "true", isHidden: false },
          { input: 's = "()[]{}"', output: "true", isHidden: false },
          { input: 's = "(]"', output: "false", isHidden: true },
        ],
        starterCode: {
          JavaScript: `/**
 * @param {string} s
 * @return {boolean}
 */
function isValid(s) {
  // Your code here
}`,
          Python: `def isValid(s):
    # Your code here
    pass`,
        },
      },
      {
        title: "Maximum Subarray",
        slug: "maximum-subarray",
        description: `Given an integer array nums, find the subarray with the largest sum, and return its sum.`,
        difficulty: "Medium",
        category: "Dynamic Programming",
        tags: ["Array", "Divide and Conquer", "Dynamic Programming"],
        constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
        examples: [
          {
            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            output: "6",
            explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
          },
          {
            input: "nums = [1]",
            output: "1",
            explanation: "The subarray [1] has the largest sum 1.",
          },
          {
            input: "nums = [5,4,-1,7,8]",
            output: "23",
            explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
          },
        ],
        testCases: [
          {
            input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
            output: "6",
            isHidden: false,
          },
          { input: "nums = [1]", output: "1", isHidden: false },
          { input: "nums = [5,4,-1,7,8]", output: "23", isHidden: true },
        ],
        starterCode: {
          JavaScript: `/**
 * @param {number[]} nums
 * @return {number}
 */
function maxSubArray(nums) {
  // Your code here
}`,
          Python: `def maxSubArray(nums):
    # Your code here
    pass`,
        },
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
