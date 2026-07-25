const mongoose = require('mongoose');
const Problem = require('../models/Problem');
require('dotenv').config({ path: '../.env' });

const sampleProblems = [
  {
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target. You may assume that each input has exactly one solution, and you may not use the same element twice.',
    difficulty: 'Easy',
    category: 'Array',
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] == 9, so we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'nums[1] + nums[2] == 6, so we return [1, 2].'
      }
    ],
    constraints: '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9',
    testCases: [
      { input: '[2,7,11,15],9', output: '[0,1]' },
      { input: '[3,2,4],6', output: '[1,2]' }
    ]
  },
  {
    title: 'Reverse String',
    description: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    difficulty: 'Easy',
    category: 'String',
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      }
    ],
    constraints: '1 <= s.length <= 10^5',
    testCases: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }
    ]
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    difficulty: 'Medium',
    category: 'String',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      }
    ],
    constraints: '0 <= s.length <= 5 * 10^4',
    testCases: [
      { input: '"abcabcbb"', output: '3' },
      { input: '"bbbbb"', output: '1' }
    ]
  },
  {
    title: 'Container With Most Water',
    description: 'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]). Find two lines that together with the x-axis form a container, such that the container contains the most water.',
    difficulty: 'Medium',
    category: 'Array',
    examples: [
      {
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        output: '49',
        explanation: 'The vertical lines are at indices 1 and 8.'
      }
    ],
    constraints: 'n == height.length, 2 <= n <= 10^5',
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', output: '49' }
    ]
  },
  {
    title: 'Median of Two Sorted Arrays',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
    difficulty: 'Hard',
    category: 'Array',
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      }
    ],
    constraints: 'nums1.length == m, nums2.length == n',
    testCases: [
      { input: '[1,3],[2]', output: '2.0' }
    ]
  },
  {
    title: 'Regular Expression Matching',
    description: 'Given an input string s and a pattern p, implement regular expression matching with support for . and *.',
    difficulty: 'Hard',
    category: 'String',
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: 'false',
        explanation: '"a" does not match the entire string "aa".'
      }
    ],
    constraints: '1 <= s.length <= 20, 1 <= p.length <= 30',
    testCases: [
      { input: '"aa","a"', output: 'false' }
    ]
  }
];

async function seedProblems() {
  try {
    const mongoUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/campusxconnect';
    await mongoose.connect(mongoUrl);
    
    await Problem.deleteMany({});
    await Problem.insertMany(sampleProblems);
    console.log('✅ Problems seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedProblems();