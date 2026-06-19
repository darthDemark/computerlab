import type { Challenge } from "@/lib/types";

export const CHALLENGES: Challenge[] = [
  {
    id: "ch-sum",
    title: "Sum Two Numbers",
    difficulty: "Beginner",
    levelId: 1,
    functionName: "sum",
    prompt:
      "Implement a function `sum(a, b)` that returns the sum of two numbers. This warms up the run/test harness.",
    rules: [
      "Define a function named `sum`.",
      "It takes exactly two numeric parameters.",
      "Return their arithmetic sum.",
    ],
    starterCode: `function sum(a, b) {
  // your code here
}`,
    tests: [
      { description: "sum(2, 3) === 5", args: [2, 3], expected: 5 },
      { description: "sum(-4, 4) === 0", args: [-4, 4], expected: 0 },
      { description: "sum(10, 15) === 25", args: [10, 15], expected: 25 },
    ],
  },
  {
    id: "ch-even-odd",
    title: "Even or Odd",
    difficulty: "Beginner",
    levelId: 1,
    functionName: "parity",
    prompt:
      "Implement `parity(n)` that returns the string `\"even\"` when `n` is even and `\"odd\"` otherwise.",
    rules: [
      "Define a function named `parity`.",
      "Use the modulo operator `%`.",
      "Return the lowercase strings 'even' or 'odd'.",
    ],
    starterCode: `function parity(n) {
  // your code here
}`,
    tests: [
      { description: "parity(4) === 'even'", args: [4], expected: "even" },
      { description: "parity(7) === 'odd'", args: [7], expected: "odd" },
      { description: "parity(0) === 'even'", args: [0], expected: "even" },
    ],
  },
  {
    id: "ch-reverse",
    title: "Reverse a String",
    difficulty: "Beginner",
    levelId: 1,
    functionName: "reverse",
    prompt:
      "Implement `reverse(str)` that returns the input string with its characters in reverse order.",
    rules: [
      "Define a function named `reverse`.",
      "Do not mutate global state.",
      "Return the reversed string.",
    ],
    starterCode: `function reverse(str) {
  // your code here
}`,
    tests: [
      { description: "reverse('abc') === 'cba'", args: ["abc"], expected: "cba" },
      { description: "reverse('lab') === 'bal'", args: ["lab"], expected: "bal" },
      { description: "reverse('') === ''", args: [""], expected: "" },
    ],
  },
  {
    id: "ch-max",
    title: "Max of an Array",
    difficulty: "Intermediate",
    levelId: 1,
    functionName: "maxOf",
    prompt:
      "Implement `maxOf(arr)` that returns the largest number in an array of numbers.",
    rules: [
      "Define a function named `maxOf`.",
      "Assume the array has at least one element.",
      "Return the maximum value.",
    ],
    starterCode: `function maxOf(arr) {
  // your code here
}`,
    tests: [
      { description: "maxOf([1,9,3]) === 9", args: [[1, 9, 3]], expected: 9 },
      { description: "maxOf([-5,-1,-9]) === -1", args: [[-5, -1, -9]], expected: -1 },
      { description: "maxOf([42]) === 42", args: [[42]], expected: 42 },
    ],
  },
  {
    id: "ch-fizzbuzz",
    title: "FizzBuzz Value",
    difficulty: "Intermediate",
    levelId: 1,
    functionName: "fizzbuzz",
    prompt:
      "Implement `fizzbuzz(n)`: return 'Fizz' if divisible by 3, 'Buzz' if by 5, 'FizzBuzz' if by both, otherwise the number itself.",
    rules: [
      "Define a function named `fizzbuzz`.",
      "Check divisibility by 15 before 3 and 5.",
      "Return a string for Fizz/Buzz cases and a number otherwise.",
    ],
    starterCode: `function fizzbuzz(n) {
  // your code here
}`,
    tests: [
      { description: "fizzbuzz(3) === 'Fizz'", args: [3], expected: "Fizz" },
      { description: "fizzbuzz(5) === 'Buzz'", args: [5], expected: "Buzz" },
      { description: "fizzbuzz(15) === 'FizzBuzz'", args: [15], expected: "FizzBuzz" },
      { description: "fizzbuzz(7) === 7", args: [7], expected: 7 },
    ],
  },
  {
    id: "ch-count-vowels",
    title: "Count Vowels",
    difficulty: "Advanced",
    levelId: 1,
    functionName: "countVowels",
    prompt:
      "Implement `countVowels(str)` that returns how many vowels (a, e, i, o, u, case-insensitive) appear in the string.",
    rules: [
      "Define a function named `countVowels`.",
      "Count both uppercase and lowercase vowels.",
      "Return an integer count.",
    ],
    starterCode: `function countVowels(str) {
  // your code here
}`,
    tests: [
      { description: "countVowels('lab') === 1", args: ["lab"], expected: 1 },
      { description: "countVowels('AEIOU') === 5", args: ["AEIOU"], expected: 5 },
      { description: "countVowels('xyz') === 0", args: ["xyz"], expected: 0 },
    ],
  },

  // ---- Level 2 · Programming Logic / Recursion ----------------------------
  {
    id: "ch-factorial",
    title: "Factorial (Recursion)",
    difficulty: "Beginner",
    levelId: 2,
    functionName: "factorial",
    prompt:
      "Implement `factorial(n)` recursively: n! = n × (n-1) × … × 1, with factorial(0) === 1.",
    rules: [
      "Define a function named `factorial`.",
      "Use recursion with a base case.",
      "factorial(0) must return 1.",
    ],
    starterCode: `function factorial(n) {
  // base case + recursive case
}`,
    tests: [
      { description: "factorial(0) === 1", args: [0], expected: 1 },
      { description: "factorial(5) === 120", args: [5], expected: 120 },
      { description: "factorial(7) === 5040", args: [7], expected: 5040 },
    ],
  },
  {
    id: "ch-sum-nested",
    title: "Sum Nested Array (Recursion)",
    difficulty: "Intermediate",
    levelId: 2,
    functionName: "sumNested",
    prompt:
      "Implement `sumNested(arr)` that sums an arbitrarily nested array of numbers, e.g. [1,[2,[3,4]],5] → 15.",
    rules: [
      "Define a function named `sumNested`.",
      "Recurse into nested arrays.",
      "Return the total sum as a number.",
    ],
    starterCode: `function sumNested(arr) {
  // recurse when an element is itself an array
}`,
    tests: [
      { description: "sumNested([1,2,3]) === 6", args: [[1, 2, 3]], expected: 6 },
      { description: "sumNested([1,[2,[3,4]],5]) === 15", args: [[1, [2, [3, 4]], 5]], expected: 15 },
      { description: "sumNested([]) === 0", args: [[]], expected: 0 },
    ],
  },

  // ---- Level 4 · Data Structures ------------------------------------------
  {
    id: "ch-two-sum",
    title: "Two Sum (Hash Map)",
    difficulty: "Intermediate",
    levelId: 4,
    functionName: "twoSum",
    prompt:
      "Implement `twoSum(nums, target)` returning the indices of the two numbers that add up to target. Aim for O(n) using a hash map.",
    rules: [
      "Define a function named `twoSum`.",
      "Return an array of two indices [i, j] with i < j.",
      "Assume exactly one solution exists.",
    ],
    starterCode: `function twoSum(nums, target) {
  // map value -> index for O(n)
}`,
    tests: [
      { description: "twoSum([2,7,11,15], 9) -> [0,1]", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { description: "twoSum([3,2,4], 6) -> [1,2]", args: [[3, 2, 4], 6], expected: [1, 2] },
      { description: "twoSum([1,5,3], 8) -> [1,2]", args: [[1, 5, 3], 8], expected: [1, 2] },
    ],
  },
  {
    id: "ch-balanced-brackets",
    title: "Balanced Brackets (Stack)",
    difficulty: "Intermediate",
    levelId: 4,
    functionName: "isBalanced",
    prompt:
      "Implement `isBalanced(str)` returning true if every bracket (), [], {} is correctly opened and closed in order.",
    rules: [
      "Define a function named `isBalanced`.",
      "Use a stack to match opening and closing brackets.",
      "Return a boolean.",
    ],
    starterCode: `function isBalanced(str) {
  // push opens, pop and verify on closes
}`,
    tests: [
      { description: "isBalanced('([]{})') === true", args: ["([]{})"], expected: true },
      { description: "isBalanced('([)]') === false", args: ["([)]"], expected: false },
      { description: "isBalanced('(((') === false", args: ["((("], expected: false },
    ],
  },

  // ---- Level 5 · Algorithms -----------------------------------------------
  {
    id: "ch-binary-search",
    title: "Binary Search",
    difficulty: "Intermediate",
    levelId: 5,
    functionName: "binarySearch",
    prompt:
      "Implement `binarySearch(arr, target)` on a sorted array, returning the index of target or -1. Must run in O(log n).",
    rules: [
      "Define a function named `binarySearch`.",
      "Assume `arr` is sorted ascending.",
      "Return the index, or -1 if not present.",
    ],
    starterCode: `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  // halve the search space each step
}`,
    tests: [
      { description: "found in middle", args: [[1, 3, 5, 7, 9, 11, 13], 7], expected: 3 },
      { description: "found at end", args: [[1, 3, 5, 7, 9], 9], expected: 4 },
      { description: "not present -> -1", args: [[1, 3, 5, 7, 9], 8], expected: -1 },
    ],
  },
  {
    id: "ch-merge-sort",
    title: "Merge Sort",
    difficulty: "Advanced",
    levelId: 5,
    functionName: "mergeSort",
    prompt:
      "Implement `mergeSort(arr)` returning a new sorted array using the divide-and-conquer merge sort algorithm.",
    rules: [
      "Define a function named `mergeSort`.",
      "Split, recursively sort, then merge.",
      "Return a new ascending-sorted array.",
    ],
    starterCode: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  // split, recurse, merge
}`,
    tests: [
      { description: "sorts unordered", args: [[5, 2, 9, 1, 5, 6]], expected: [1, 2, 5, 5, 6, 9] },
      { description: "already sorted", args: [[1, 2, 3]], expected: [1, 2, 3] },
      { description: "single element", args: [[42]], expected: [42] },
    ],
  },
];

export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}
