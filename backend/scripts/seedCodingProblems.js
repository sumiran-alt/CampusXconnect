const mongoose = require("mongoose");
const dotenv = require("dotenv");
const CodingProblem = require("../models/CodingProblem");

dotenv.config();

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const SAMPLE_PROBLEMS = [
  {
    title: "Two Sum",
    slug: "two-sum",
    description: `Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    difficulty: "Easy",
    category: "Array",
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
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
};`,
      Python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass`,
      Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
        return new int[]{};
    }
}`,
      "C++": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        return {};
    }
};`,
    },
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
      {
        input: "nums = [2,5,5,11], target = 10",
        output: "[1,2]",
        isHidden: true,
      },
    ],
  },
  {
    title: "Palindrome Number",
    slug: "palindrome-number",
    description: `Given an integer x, return true if x is palindrome integer.

An integer is a palindrome when it reads the same backward as forward.

For example, 121 is a palindrome while 123 is not.`,
    difficulty: "Easy",
    category: "Math",
    tags: ["Math"],
    constraints: [
      "-2^31 <= x <= 2^31 - 1",
    ],
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome.",
      },
    ],
    starterCode: {
      JavaScript: `/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function(x) {
    // Write your solution here
};`,
      Python: `class Solution:
    def isPalindrome(self, x: int) -> bool:
        # Write your solution here
        pass`,
      Java: `class Solution {
    public boolean isPalindrome(int x) {
        // Write your solution here
        return false;
    }
}`,
      "C++": `class Solution {
public:
    bool isPalindrome(int x) {
        // Write your solution here
        return false;
    }
};`,
    },
    testCases: [
      {
        input: "121",
        output: "true",
        isHidden: false,
      },
      {
        input: "-121",
        output: "false",
        isHidden: false,
      },
      {
        input: "10",
        output: "false",
        isHidden: false,
      },
      {
        input: "0",
        output: "true",
        isHidden: true,
      },
      {
        input: "1",
        output: "true",
        isHidden: true,
      },
    ],
  },
  {
    slug: "reverse-integer",
    title: "Reverse Integer",
    description: `Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).`,
    difficulty: "Medium",
    category: "Math",
    tags: ["Math"],
    constraints: [
      "-2^31 <= x <= 2^31 - 1",
    ],
    examples: [
      {
        input: "x = 123",
        output: "321",
        explanation: "The reverse of 123 is 321.",
      },
      {
        input: "x = -123",
        output: "-321",
        explanation: "The reverse of -123 is -321.",
      },
      {
        input: "x = 120",
        output: "21",
        explanation: "The reverse of 120 is 021 which is 21.",
      },
      {
        input: "x = 0",
        output: "0",
        explanation: "0 reversed is 0.",
      },
    ],
    starterCode: {
      JavaScript: `/**
 * @param {number} x
 * @return {number}
 */
var reverse = function(x) {
    // Write your solution here
};`,
      Python: `class Solution:
    def reverse(self, x: int) -> int:
        # Write your solution here
        pass`,
      Java: `class Solution {
    public int reverse(int x) {
        // Write your solution here
        return 0;
    }
}`,
      "C++": `class Solution {
public:
    int reverse(int x) {
        // Write your solution here
        return 0;
    }
};`,
    },
    testCases: [
      {
        input: "123",
        output: "321",
        isHidden: false,
      },
      {
        input: "-123",
        output: "-321",
        isHidden: false,
      },
      {
        input: "120",
        output: "21",
        isHidden: false,
      },
      {
        input: "0",
        output: "0",
        isHidden: true,
      },
      {
        input: "1534236469",
        output: "0",
        isHidden: true,
      },
    ],
  },
  {
    slug: "merge-sorted-array",
    title: "Merge Sorted Array",
    description: `You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of valid elements in nums1 and nums2 respectively.

Merge nums2 into nums1 as one sorted array.

Note: You may assume that nums1 has a length of m + n, that it has enough space to hold additional elements from nums2.`,
    difficulty: "Easy",
    category: "Array",
    tags: ["Array", "Two Pointers"],
    constraints: [
      "nums1.length == m + n",
      "nums2.length == n",
      "0 <= m, n <= 200",
      "1 <= m + n <= 200",
      "-10^9 <= nums1[i], nums2[j] <= 10^9",
    ],
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
        explanation: "The arrays we are merging are [1,2,3] and [2,5,6].",
      },
      {
        input: "nums1 = [1], m = 1, nums2 = [], n = 0",
        output: "[1]",
        explanation: "The arrays we are merging are [1] and [].",
      },
    ],
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums1
 * @param {number} m
 * @param {number[]} nums2
 * @param {number} n
 * @return {void} Do not return anything, modify nums1 in-place instead.
 */
var merge = function(nums1, m, nums2, n) {
    // Write your solution here
};`,
      Python: `class Solution:
    def merge(self, nums1: List[int], m: int, nums2: List[int], n: int) -> None:
        # Write your solution here
        """
        Do not return anything, modify nums1 in-place instead.
        """
        pass`,
      Java: `class Solution {
    public void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your solution here
    }
}`,
      "C++": `class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        // Write your solution here
    }
};`,
    },
    testCases: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
        isHidden: false,
      },
      {
        input: "nums1 = [1], m = 1, nums2 = [], n = 0",
        output: "[1]",
        isHidden: false,
      },
      {
        input: "nums1 = [0], m = 0, nums2 = [1], n = 1",
        output: "[1]",
        isHidden: true,
      },
    ],
  },
  {slug: "binary-search",
    
    title: "Binary Search",
    description: `Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.`,
    difficulty: "Easy",
    category: "Binary Search",
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
        input: "nums = [-1,0,3,5,9,12], target = 13",
        output: "-1",
        explanation: "13 is not exists in nums so return -1",
      },
    ],
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    // Write your solution here
};`,
      Python: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        # Write your solution here
        pass`,
      Java: `class Solution {
    public int search(int[] nums, int target) {
        // Write your solution here
        return -1;
    }
}`,
      "C++": `class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here
        return -1;
    }
};`,
    },
    testCases: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        isHidden: false,
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 13",
        output: "-1",
        isHidden: false,
      },
      {
        input: "nums = [5], target = 5",
        output: "0",
        isHidden: true,
      },
      {
        input: "nums = [5], target = -5",
        output: "-1",
        isHidden: true,
      },
    ],
  },
  {slug: "median-of-two-sorted-arrays",
    
    title: "Median of Two Sorted Arrays",
    description: `Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    difficulty: "Hard",
    category: "Array",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[j] <= 10^6",
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
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    starterCode: {
      JavaScript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    // Write your solution here
};`,
      Python: `class Solution:
    def findMedianSortedArrays(self, nums1: List[int], nums2: List[int]) -> float:
        # Write your solution here
        pass`,
      Java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Write your solution here
        return 0;
    }
}`,
      "C++": `class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Write your solution here
        return 0;
    }
};`,
    },
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
      {
        input: "nums1 = [0,0], nums2 = [0,0]",
        output: "0.00000",
        isHidden: true,
      },
    ],
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
    category: "String",
    tags: ["String", "Stack"],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}',",
    ],
    examples: [
      {
        input: 's = "()"',
        output: "true",
        explanation: "A valid string",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        explanation: "A valid string",
      },
      {
        input: 's = "([)]"',
        output: "false",
        explanation: "Close bracket is of different type than open",
      },
    ],
    starterCode: {
      JavaScript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    // Write your solution here
};`,
      Python: `class Solution:
    def isValid(self, s: str) -> bool:
        # Write your solution here
        pass`,
      Java: `class Solution {
    public boolean isValid(String s) {
        // Write your solution here
        return false;
    }
}`,
      "C++": `class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        return false;
    }
};`,
    },
    testCases: [
      {
        input: '"()"',
        output: "true",
        isHidden: false,
      },
      {
        input: '"()[]{}"',
        output: "true",
        isHidden: false,
      },
      {
        input: '"([)]"',
        output: "false",
        isHidden: false,
      },
      {
        input: '"{[]}"',
        output: "true",
        isHidden: true,
      },
    ],
  },
];

async function seedProblems() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing problems
    await CodingProblem.deleteMany({});
    console.log("Cleared existing problems");

    // Insert new problems
    const result = await CodingProblem.insertMany(SAMPLE_PROBLEMS);
    console.log(`✅ Successfully seeded ${result.length} coding problems`);

    // Log problem details
    result.forEach((problem) => {
      console.log(
        `  - ${problem.difficulty} | ${problem.title} (${problem.slug})`,
      );
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding problems:", error);
    process.exit(1);
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedProblems();
}

module.exports = seedProblems;
