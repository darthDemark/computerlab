import type { Quiz } from "@/lib/types";

/**
 * One mastery quiz per level. Passing a level's quiz is part of clearing its
 * mastery checkpoint. Questions are deliberately conceptual — they check
 * understanding, not recall.
 */

export const QUIZZES: Quiz[] = [
  {
    levelId: 0,
    title: "Computer Literacy Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q0-1",
        prompt: "Which component holds the data a program is actively working with right now?",
        options: ["Disk / SSD", "RAM", "The CPU cache only", "The network card"],
        correctIndex: 1,
        explanation: "RAM is fast, volatile working memory. Storage (disk/SSD) persists data but is slower.",
      },
      {
        id: "q0-2",
        prompt: "What does an absolute path always start from?",
        options: ["The current folder", "The home folder", "The filesystem root", "The Git repository"],
        correctIndex: 2,
        explanation: "Absolute paths start at the root (e.g. /). Relative paths start from where you currently are.",
      },
      {
        id: "q0-3",
        prompt: "In the request/response cycle, what does DNS do?",
        options: [
          "Encrypts the connection",
          "Translates a domain name into an IP address",
          "Renders the HTML",
          "Stores cookies",
        ],
        correctIndex: 1,
        explanation: "DNS is the phone book of the internet: it maps human names to IP addresses.",
      },
      {
        id: "q0-4",
        prompt: "Which Git command saves a snapshot locally with a message?",
        options: ["git push", "git add", "git commit -m", "git status"],
        correctIndex: 2,
        explanation: "git commit records a snapshot; git push uploads commits to the remote.",
      },
    ],
  },
  {
    levelId: 1,
    title: "JavaScript Foundations Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q1-1",
        prompt: "Which declaration should you reach for by default?",
        options: ["var", "let", "const", "function"],
        correctIndex: 2,
        explanation: "Prefer const; use let only when the binding must be reassigned. Avoid var.",
      },
      {
        id: "q1-2",
        prompt: "What does typeof null return?",
        options: ["'null'", "'undefined'", "'object'", "'number'"],
        correctIndex: 2,
        explanation: "typeof null is 'object' — a long-standing historical quirk of JavaScript.",
      },
      {
        id: "q1-3",
        prompt: "A function with no explicit return statement returns what?",
        options: ["0", "null", "undefined", "An error"],
        correctIndex: 2,
        explanation: "Without a return, the function evaluates to undefined.",
      },
      {
        id: "q1-4",
        prompt: "Why prefer === over ==?",
        options: [
          "It is faster to type",
          "It avoids implicit type coercion",
          "It works on objects only",
          "There is no difference",
        ],
        correctIndex: 1,
        explanation: "=== compares without coercion; == can produce surprises like 0 == '' being true.",
      },
    ],
  },
  {
    levelId: 2,
    title: "Programming Logic Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q2-1",
        prompt: "Every correct recursion must include which two parts?",
        options: [
          "A loop and a counter",
          "A base case and a recursive case",
          "A try and a catch",
          "A map and a filter",
        ],
        correctIndex: 1,
        explanation: "The base case stops recursion; the recursive case shrinks the problem toward it.",
      },
      {
        id: "q2-2",
        prompt: "Naive recursive Fibonacci is slow because it...",
        options: [
          "Uses too much disk",
          "Recomputes the same subproblems repeatedly (exponential)",
          "Cannot reach its base case",
          "Allocates a new array each call",
        ],
        correctIndex: 1,
        explanation: "Overlapping subproblems make it O(2^n); memoization brings it to O(n).",
      },
      {
        id: "q2-3",
        prompt: "What is the value of (true AND false) OR true?",
        options: ["true", "false", "undefined", "It throws"],
        correctIndex: 0,
        explanation: "(true AND false) is false; false OR true is true.",
      },
    ],
  },
  {
    levelId: 3,
    title: "Big O & Complexity Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q3-1",
        prompt: "What is the Big O of 3n² + 50n + 200?",
        options: ["O(n)", "O(n²)", "O(3n²)", "O(log n)"],
        correctIndex: 1,
        explanation: "Drop constants and lower-order terms; the dominant term is n².",
      },
      {
        id: "q3-2",
        prompt: "Binary search on a sorted array is which complexity?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 1,
        explanation: "Each step halves the search space, giving logarithmic time.",
      },
      {
        id: "q3-3",
        prompt: "Two nested loops over the same array of size n are usually...",
        options: ["O(n)", "O(2n)", "O(n²)", "O(log n)"],
        correctIndex: 2,
        explanation: "n iterations × n iterations = n², the classic quadratic pattern.",
      },
      {
        id: "q3-4",
        prompt: "Big O primarily describes...",
        options: [
          "Exact runtime in milliseconds",
          "How cost grows as input size grows",
          "Memory address layout",
          "The number of CPU cores needed",
        ],
        correctIndex: 1,
        explanation: "Big O is about growth (scaling), not wall-clock time.",
      },
    ],
  },
  {
    levelId: 4,
    title: "Data Structures Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q4-1",
        prompt: "Random access by index in an array is...",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correctIndex: 0,
        explanation: "Contiguous memory means element i is found by direct address arithmetic.",
      },
      {
        id: "q4-2",
        prompt: "A stack follows which ordering?",
        options: ["FIFO", "LIFO", "Sorted", "Random"],
        correctIndex: 1,
        explanation: "Stacks are Last-In-First-Out; queues are First-In-First-Out.",
      },
      {
        id: "q4-3",
        prompt: "Average lookup in a well-distributed hash map is...",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctIndex: 0,
        explanation: "Hashing maps a key directly to a bucket; average O(1), worst case O(n).",
      },
      {
        id: "q4-4",
        prompt: "Why can a Binary Search Tree degrade to O(n)?",
        options: [
          "Too much memory",
          "It becomes unbalanced (e.g. sorted inserts)",
          "Hash collisions",
          "Integer overflow",
        ],
        correctIndex: 1,
        explanation: "An unbalanced BST behaves like a linked list; balancing keeps it O(log n).",
      },
      {
        id: "q4-5",
        prompt: "Which traversal of a graph requires a visited set to avoid infinite loops?",
        options: ["Only BFS", "Only DFS", "Both BFS and DFS", "Neither"],
        correctIndex: 2,
        explanation: "Cyclic graphs can revisit nodes forever without tracking visited vertices.",
      },
    ],
  },
  {
    levelId: 5,
    title: "Algorithms Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q5-1",
        prompt: "Binary search requires the input to be...",
        options: ["A linked list", "Sorted", "Unique", "Numeric only"],
        correctIndex: 1,
        explanation: "Halving the space only works if the data is in order.",
      },
      {
        id: "q5-2",
        prompt: "Merge sort's time complexity is...",
        options: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"],
        correctIndex: 1,
        explanation: "Divide-and-conquer: log n levels of merging, each O(n).",
      },
      {
        id: "q5-3",
        prompt: "Which traversal finds the shortest path in an unweighted graph?",
        options: ["DFS", "BFS", "Quick sort", "Binary search"],
        correctIndex: 1,
        explanation: "BFS explores level by level, so it reaches the target in the fewest edges.",
      },
      {
        id: "q5-4",
        prompt: "JavaScript's default Array.sort() without a comparator sorts how?",
        options: ["Numerically ascending", "Lexicographically (as strings)", "Randomly", "Descending"],
        correctIndex: 1,
        explanation: "[10,2,1].sort() gives [1,10,2] — it compares string representations by default.",
      },
    ],
  },
  {
    levelId: 6,
    title: "Software Engineering Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q6-1",
        prompt: "What is the main benefit TypeScript adds over JavaScript?",
        options: [
          "Faster runtime execution",
          "Static types caught at compile time",
          "Smaller bundle size",
          "Built-in database access",
        ],
        correctIndex: 1,
        explanation: "TypeScript catches type errors before the code ever runs.",
      },
      {
        id: "q6-2",
        prompt: "In REST, which method is conventionally used to create a resource?",
        options: ["GET", "POST", "DELETE", "HEAD"],
        correctIndex: 1,
        explanation: "POST creates; GET reads; PUT/PATCH update; DELETE removes.",
      },
      {
        id: "q6-3",
        prompt: "Why write automated tests?",
        options: [
          "To make the code longer",
          "To catch regressions and document intended behavior",
          "Because the linter requires it",
          "To increase bundle size",
        ],
        correctIndex: 1,
        explanation: "Tests verify behavior and guard against future breakage during refactors.",
      },
    ],
  },
  {
    levelId: 7,
    title: "Computer Science Core Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q7-1",
        prompt: "What does an operating system primarily manage?",
        options: [
          "Only the screen",
          "Hardware resources and process scheduling",
          "Only network packets",
          "Source code formatting",
        ],
        correctIndex: 1,
        explanation: "The OS arbitrates CPU, memory, I/O, and scheduling among processes.",
      },
      {
        id: "q7-2",
        prompt: "A compiler translates...",
        options: [
          "Source code into a lower-level representation",
          "Network packets into HTML",
          "SQL into spreadsheets",
          "Images into audio",
        ],
        correctIndex: 0,
        explanation: "Compilers transform high-level source into machine or intermediate code.",
      },
      {
        id: "q7-3",
        prompt: "Graph theory studies...",
        options: ["Bar charts", "Vertices connected by edges", "Only binary trees", "Pixel grids"],
        correctIndex: 1,
        explanation: "Graphs model relationships as vertices and edges — foundational across CS.",
      },
    ],
  },
  {
    levelId: 8,
    title: "Advanced Systems Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q8-1",
        prompt: "A cache primarily improves...",
        options: ["Security", "Read latency for frequently accessed data", "Disk capacity", "Code readability"],
        correctIndex: 1,
        explanation: "Caches store hot data closer/faster to cut repeated expensive lookups.",
      },
      {
        id: "q8-2",
        prompt: "A load balancer's job is to...",
        options: [
          "Encrypt traffic",
          "Distribute requests across multiple servers",
          "Compile code",
          "Store user passwords",
        ],
        correctIndex: 1,
        explanation: "Load balancers spread traffic to improve throughput and availability.",
      },
      {
        id: "q8-3",
        prompt: "Horizontal scaling means...",
        options: [
          "Adding more machines",
          "Buying a bigger single machine",
          "Deleting old data",
          "Reducing replicas",
        ],
        correctIndex: 0,
        explanation: "Horizontal scaling adds more nodes; vertical scaling makes one node bigger.",
      },
    ],
  },
  {
    levelId: 9,
    title: "Research / Doctorate Track Checkpoint",
    passThreshold: 0.7,
    questions: [
      {
        id: "q9-1",
        prompt: "The P vs NP question asks whether...",
        options: [
          "Programs can run in parallel",
          "Problems verifiable in polynomial time are also solvable in polynomial time",
          "Networks can be partitioned",
          "Compilers can be proven correct",
        ],
        correctIndex: 1,
        explanation: "It is the central open question: does efficient verification imply efficient solving?",
      },
      {
        id: "q9-2",
        prompt: "When reading a research paper first, you should usually start with...",
        options: [
          "The references",
          "The abstract and conclusion",
          "The appendix proofs",
          "The acknowledgements",
        ],
        correctIndex: 1,
        explanation: "Abstract + conclusion give you the claim and result before you invest in the details.",
      },
      {
        id: "q9-3",
        prompt: "Formal methods aim to...",
        options: [
          "Make code prettier",
          "Mathematically prove properties of systems",
          "Replace all testing",
          "Speed up compilation",
        ],
        correctIndex: 1,
        explanation: "Formal methods use mathematics to prove correctness/safety properties.",
      },
    ],
  },
];

export function getQuizForLevel(levelId: number): Quiz | undefined {
  return QUIZZES.find((q) => q.levelId === levelId);
}
