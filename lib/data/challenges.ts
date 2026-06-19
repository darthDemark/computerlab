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
];

export function getChallengeById(id: string): Challenge | undefined {
  return CHALLENGES.find((c) => c.id === id);
}
