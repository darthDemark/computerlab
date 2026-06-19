import type { Level, Lesson } from "@/lib/types";
import { DEEP_TOPICS, getDeepTopic } from "./deepContent";

/**
 * Curriculum content. The full path runs from Level 0 (Computer Literacy) to
 * Level 9 (Research / Doctorate Track). Levels 0 and 1 carry full lesson
 * bodies; eleven core CS topics carry deep 7-part content (see deepContent.ts);
 * remaining modules are seeded with structured outlines that the AI Tutor can
 * expand on demand.
 */

/** Pull a deep-dive topic by id, failing loudly if the id is wrong. */
function deep(id: string): Lesson {
  const topic = getDeepTopic(id);
  if (!topic) throw new Error(`Missing deep topic: ${id}`);
  return topic;
}

const level0Lessons: Lesson[] = [
  {
    id: "l0-what-is-a-computer",
    levelId: 0,
    title: "What is a Computer",
    summary: "The machine model: input, processing, memory, storage, output.",
    estMinutes: 12,
    keyPoints: [
      "A computer is a programmable machine that transforms input into output.",
      "CPU executes instructions; RAM holds working data; storage persists it.",
      "Everything reduces to binary — 1s and 0s.",
    ],
    body: `## Definition
A **computer** is a programmable machine that takes *input*, performs *processing* using a set of stored instructions, and produces *output*. Unlike a calculator, it can be reprogrammed to perform an unbounded range of tasks.

## The core model
Every computer — from a smartwatch to a datacenter — follows the same pipeline:

- **Input** — keyboard, mouse, network, sensors.
- **Processing** — the CPU executes instructions billions of times per second.
- **Memory (RAM)** — fast, volatile working space for the data in use *right now*.
- **Storage (disk/SSD)** — slow, persistent space that survives power loss.
- **Output** — screen, speakers, network, files.

## Real-world analogy
Think of a kitchen. The **CPU is the chef**, **RAM is the counter space** where ingredients are actively being chopped, **storage is the pantry** holding everything else, and **input/output** are the orders coming in and the plated dishes going out. A bigger counter (more RAM) lets the chef juggle more at once.

## Why it matters for you
As a software engineer you will constantly trade off speed (RAM, CPU) against persistence (storage) and cost. Understanding the machine model is the foundation for understanding performance.`,
    diagram: `INPUT ──▶ [ CPU ] ◀──▶ [ RAM ]
              │
              ▼
          [ STORAGE ] ──▶ OUTPUT`,
  },
  {
    id: "l0-files-and-folders",
    levelId: 0,
    title: "Files and Folders",
    summary: "How operating systems organize data into a hierarchical tree.",
    estMinutes: 10,
    keyPoints: [
      "Files store data; folders (directories) organize files.",
      "Paths describe a location in the tree, absolute or relative.",
      "File extensions hint at content type but do not guarantee it.",
    ],
    body: `## Definition
A **file** is a named container of bytes. A **folder** (also called a *directory*) is a container that holds files and other folders, forming a tree.

## Paths
A **path** is the address of a file in the tree.

- **Absolute path** starts from the root: \`/Users/dev/project/index.ts\`
- **Relative path** starts from where you currently are: \`./src/index.ts\` or \`../config\`

The special names \`.\` (current folder) and \`..\` (parent folder) let you navigate.

## Real-world analogy
A filing cabinet. Drawers contain folders, folders contain documents. The path is the instruction "third drawer → 'Taxes' folder → '2024.pdf'".

## Common mistakes
- Confusing absolute and relative paths — a script that works in one folder breaks in another.
- Assuming a \`.png\` file is really an image. Extensions are hints, not contracts.

## Mini challenge
Given you are inside \`/home/dev/app\`, what does the relative path \`../config/.env\` resolve to?`,
    diagram: `/                 (root)
└── home
    └── dev
        └── app
            ├── src
            │   └── index.ts
            └── config
                └── .env`,
  },
  {
    id: "l0-terminal-basics",
    levelId: 0,
    title: "Terminal Basics",
    summary: "Driving the computer with text commands instead of clicks.",
    estMinutes: 14,
    keyPoints: [
      "The terminal is a text interface to the operating system.",
      "Core commands: pwd, ls, cd, mkdir, touch, rm, cat.",
      "Commands take arguments and flags that modify behavior.",
    ],
    body: `## Definition
The **terminal** (or *shell*) is a text-based interface for issuing commands to the operating system. Engineers prefer it because it is fast, scriptable, and remote-friendly.

## Essential commands
- \`pwd\` — print working directory (where am I?)
- \`ls\` — list contents; \`ls -la\` shows hidden files and detail
- \`cd path\` — change directory
- \`mkdir name\` — make a directory
- \`touch file\` — create an empty file
- \`cat file\` — print a file's contents
- \`rm file\` — remove a file (no recycle bin — be careful)

## Anatomy of a command
\`\`\`bash
command --flag argument
ls     -la    /home/dev
\`\`\`
The **command** is the verb, **flags** modify it, **arguments** are what it acts on.

## Real-world analogy
A GUI is pointing at things in a store and saying "that one". The terminal is calling the warehouse and reading off exact SKU numbers — slower to learn, far faster once fluent.

## Common mistakes
- \`rm -rf\` deletes recursively with no confirmation. Respect it.
- Forgetting the terminal is *stateful* — \`cd\` changes where the next command runs.

## Mini challenge
Write the sequence of commands to create a folder \`lab\`, enter it, and create an empty file \`notes.md\`.`,
  },
  {
    id: "l0-internet-basics",
    levelId: 0,
    title: "Internet Basics",
    summary: "Clients, servers, DNS, and the request/response cycle.",
    estMinutes: 13,
    keyPoints: [
      "The web is clients (browsers) talking to servers over HTTP.",
      "DNS translates human names into IP addresses.",
      "A request gets a response with a status code and body.",
    ],
    body: `## Definition
The **internet** is a global network of computers. The **web** is one service running on top of it: clients (browsers) requesting resources from servers using the **HTTP** protocol.

## The request/response cycle
1. You type \`example.com\`.
2. **DNS** translates that name into an IP address like \`93.184.216.34\`.
3. Your browser opens a connection and sends an **HTTP request**.
4. The server returns an **HTTP response**: a status code (\`200\`, \`404\`, \`500\`), headers, and a body (HTML, JSON, an image).
5. The browser renders the result.

## Real-world analogy
Ordering by mail. DNS is the phone book that turns a business name into a street address. The request is your order letter; the response is the package that comes back — sometimes with "address not found" (404).

## Common mistakes
- Confusing the *domain name* with the *server* — many domains can map to one server and vice versa.
- Assuming \`https\` and \`http\` are the same. The \`s\` means the connection is encrypted.

## Mini challenge
What HTTP status code would you expect when requesting a page that does not exist?`,
    diagram: `BROWSER ──(1) name──▶ DNS
BROWSER ──(2) HTTP request──▶ SERVER
BROWSER ◀──(3) HTTP response──── SERVER`,
  },
  {
    id: "l0-git-github-basics",
    levelId: 0,
    title: "Git & GitHub Basics",
    summary: "Version control: tracking changes and collaborating safely.",
    estMinutes: 16,
    keyPoints: [
      "Git tracks snapshots of your project over time.",
      "Core flow: edit → add → commit → push.",
      "GitHub is a hosted home for Git repositories.",
    ],
    body: `## Definition
**Git** is a *version control system* — it records snapshots of your project so you can review history, undo mistakes, and collaborate. **GitHub** is a website that hosts Git repositories in the cloud.

## The core workflow
\`\`\`bash
git status          # what changed?
git add .           # stage changes for the next snapshot
git commit -m "msg" # save a snapshot with a message
git push            # upload snapshots to GitHub
\`\`\`

## Key concepts
- **Repository** — the project and its full history.
- **Commit** — a saved snapshot with a message and author.
- **Branch** — an independent line of work; \`main\` is the default.
- **Remote** — a hosted copy (e.g. on GitHub) referred to as \`origin\`.

## Real-world analogy
A video game with save points. Each **commit** is a save you can return to. **Branches** let you try a risky boss fight without overwriting your main save.

## Common mistakes
- Committing everything including secrets — use a \`.gitignore\`.
- Writing useless messages like "stuff". Future-you needs context.

## Mini challenge
You edited two files. Write the three commands to save and upload a snapshot labeled "add login form".`,
  },
];

const level1Lessons: Lesson[] = [
  {
    id: "l1-variables",
    levelId: 1,
    title: "Variables",
    summary: "Named containers that store values your program can reuse.",
    estMinutes: 12,
    keyPoints: [
      "A variable is a named reference to a value in memory.",
      "Use const by default, let when reassignment is required.",
      "Names should describe intent, not type.",
    ],
    body: `## Definition
A **variable** is a named container that stores a value so your program can reference and reuse it later. In JavaScript you declare one with \`const\` or \`let\`.

## Example
\`\`\`js
const username = "ada";   // cannot be reassigned
let score = 0;            // can change over time
score = score + 10;       // score is now 10
\`\`\`

## Real-world analogy
A variable is like a **labeled box** in a warehouse. The label (\`score\`) lets you find the box without knowing where it physically sits. You can look inside, and — if it is a \`let\` box — swap the contents.

## Common mistakes
- Using \`var\` (legacy, function-scoped, surprising). Prefer \`const\`/\`let\`.
- Reassigning a \`const\` — throws \`TypeError: Assignment to constant variable\`.
- Vague names like \`x\` or \`data\` that hide intent.

## Mini challenge
Declare a constant \`pi\` set to \`3.14159\` and a mutable \`radius\`, then compute and store the area of a circle in a variable called \`area\`.`,
  },
  {
    id: "l1-data-types",
    levelId: 1,
    title: "Data Types",
    summary: "The kinds of values JavaScript can represent.",
    estMinutes: 13,
    keyPoints: [
      "Primitives: string, number, boolean, null, undefined, symbol, bigint.",
      "Objects (including arrays and functions) are reference types.",
      "typeof reveals a value's type at runtime.",
    ],
    body: `## Definition
A **data type** classifies a value and defines what operations are valid on it. JavaScript has **primitives** and **objects**.

## The primitives
\`\`\`js
const name = "Ada";        // string
const age = 36;            // number
const active = true;       // boolean
const nothing = null;      // intentional emptiness
let notSet;                // undefined
\`\`\`

Objects, arrays, and functions are **reference types** — variables hold a *pointer* to them, not the value itself.

## Real-world analogy
Types are like **shipping categories**: "fragile", "liquid", "perishable". The category tells you what handling rules apply. You would not pour a number the way you pour a liquid.

## Common mistakes
- \`typeof null\` returns \`"object"\` — a famous historical bug. Remember it.
- Comparing reference types with \`===\` checks identity, not contents: \`[1] === [1]\` is \`false\`.

## Mini challenge
Predict the output of \`typeof 42\`, \`typeof "42"\`, \`typeof true\`, and \`typeof null\`.`,
  },
  {
    id: "l1-functions",
    levelId: 1,
    title: "Functions",
    summary: "Reusable, named blocks of logic that take inputs and return outputs.",
    estMinutes: 15,
    keyPoints: [
      "Functions package logic so it can be reused.",
      "Parameters are inputs; return sends a value back.",
      "Arrow functions are a concise alternative syntax.",
    ],
    body: `## Definition
A **function** is a reusable block of code that takes **inputs** (parameters), runs logic, and optionally **returns** an output. Functions are how you avoid repeating yourself.

## Example
\`\`\`js
function add(a, b) {
  return a + b;
}

const double = (n) => n * 2; // arrow function

add(2, 3);   // 5
double(10);  // 20
\`\`\`

## Real-world analogy
A function is a **vending machine**: you put in money and a code (the arguments), a defined process runs, and a snack comes out (the return value). You do not care about the internal wiring — only the contract.

## Common mistakes
- Forgetting \`return\` — the function silently returns \`undefined\`.
- Confusing **parameters** (the placeholders in the definition) with **arguments** (the real values you pass in).
- Side effects that mutate outside state, making functions hard to test.

## Mini challenge
Write a function \`greet(name)\` that returns \`"Hello, <name>!"\`, then call it with your own name.`,
  },
  {
    id: "l1-conditionals",
    levelId: 1,
    title: "Conditionals",
    summary: "Branching logic that lets programs make decisions.",
    estMinutes: 12,
    keyPoints: [
      "if / else if / else choose a branch based on a boolean.",
      "Comparison and logical operators build conditions.",
      "Prefer === over == to avoid type coercion surprises.",
    ],
    body: `## Definition
A **conditional** runs different code depending on whether a condition is \`true\` or \`false\`. This is how programs make decisions.

## Example
\`\`\`js
const score = 82;

if (score >= 90) {
  console.log("A");
} else if (score >= 80) {
  console.log("B");   // this runs
} else {
  console.log("Keep going");
}
\`\`\`

## Operators you will use
- Comparison: \`===\`, \`!==\`, \`>\`, \`<\`, \`>=\`, \`<=\`
- Logical: \`&&\` (and), \`||\` (or), \`!\` (not)

## Real-world analogy
A **fork in a road** with signs. The condition is the sign you read; based on it you take the left or right path. \`else if\` adds more forks; \`else\` is the default road when no sign matches.

## Common mistakes
- Using \`==\` (loose equality) which coerces types: \`0 == ""\` is \`true\`. Prefer \`===\`.
- Forgetting that any non-empty string and any non-zero number are "truthy".

## Mini challenge
Write a conditional that logs \`"even"\` or \`"odd"\` for a variable \`n\` using the modulo operator \`%\`.`,
  },
  {
    id: "l1-loops",
    levelId: 1,
    title: "Loops",
    summary: "Repeating work without copy-pasting code.",
    estMinutes: 14,
    keyPoints: [
      "Loops repeat a block until a condition stops them.",
      "for, while, and for...of cover most needs.",
      "Off-by-one and infinite loops are the classic bugs.",
    ],
    body: `## Definition
A **loop** repeats a block of code multiple times, so you do not copy-paste the same logic. The loop continues while a condition holds.

## Example
\`\`\`js
for (let i = 0; i < 3; i++) {
  console.log(i); // 0, 1, 2
}

const items = ["a", "b", "c"];
for (const item of items) {
  console.log(item);
}
\`\`\`

## Real-world analogy
A **treadmill belt**. Each pass of the belt is one iteration. The stop button is your condition — when it trips, the loop ends. Forget the stop button and you run forever (an *infinite loop*).

## Common mistakes
- **Off-by-one errors**: \`<=\` vs \`<\` changes how many times the loop runs.
- **Infinite loops**: forgetting to advance the counter (\`i++\`) so the condition never becomes false.

## Mini challenge
Write a loop that sums the numbers 1 through 10 and stores the result in \`total\`.`,
  },
  {
    id: "l1-arrays",
    levelId: 1,
    title: "Arrays",
    summary: "Ordered collections you can index, iterate, and transform.",
    estMinutes: 15,
    keyPoints: [
      "Arrays hold an ordered list of values, indexed from 0.",
      "map, filter, and reduce are the core transformations.",
      "Arrays are reference types — copies share the same data.",
    ],
    body: `## Definition
An **array** is an ordered collection of values stored under one name and accessed by a numeric **index** that starts at \`0\`.

## Example
\`\`\`js
const fruits = ["apple", "banana", "cherry"];
fruits[0];           // "apple"
fruits.length;       // 3
fruits.push("date"); // add to the end

const upper = fruits.map((f) => f.toUpperCase());
const long = fruits.filter((f) => f.length > 5);
\`\`\`

## Real-world analogy
A **numbered row of lockers**. Locker \`0\` is the first. You can walk the row (iterate), swap a locker's contents, or make a new row where every item is transformed (\`map\`).

## Common mistakes
- Forgetting indexing starts at **0**, so the last item is \`arr.length - 1\`.
- Mutating an array you meant to copy — \`const b = a\` shares the same array.

## Mini challenge
Given \`const nums = [1, 2, 3, 4]\`, use \`map\` to produce \`[2, 4, 6, 8]\`.`,
  },
  {
    id: "l1-objects",
    levelId: 1,
    title: "Objects",
    summary: "Key/value structures that model real-world entities.",
    estMinutes: 14,
    keyPoints: [
      "Objects store data as key/value pairs.",
      "Access with dot or bracket notation.",
      "Objects model entities; arrays model lists.",
    ],
    body: `## Definition
An **object** is a collection of **key/value pairs**. Where an array is an ordered list, an object is a labeled record — perfect for modelling a "thing" with named attributes.

## Example
\`\`\`js
const user = {
  name: "Ada",
  age: 36,
  isAdmin: true,
};

user.name;        // "Ada"  (dot notation)
user["age"];      // 36     (bracket notation)
user.role = "engineer"; // add a new key
\`\`\`

## Real-world analogy
A **passport**. It has labeled fields — name, date of birth, nationality — rather than a numbered list. You look things up by label (\`user.name\`), not by position.

## Common mistakes
- Using dot notation with a dynamic key — you need brackets: \`user[fieldName]\`.
- Assuming object key order is meaningful. Treat objects as unordered records.

## Mini challenge
Create an object \`book\` with keys \`title\`, \`author\`, and \`pages\`, then log the author using dot notation.`,
  },
  {
    id: "l1-debugging-basics",
    levelId: 1,
    title: "Debugging Basics",
    summary: "A systematic method for finding and fixing defects.",
    estMinutes: 16,
    keyPoints: [
      "Read the error message — it usually names the file and line.",
      "Reproduce, isolate, hypothesize, test, fix.",
      "console.log and the debugger reveal runtime state.",
    ],
    body: `## Definition
**Debugging** is the disciplined process of locating and fixing defects. It is a skill, not luck — and it is the daily work of every engineer.

## A repeatable method
1. **Read the error.** It usually names the type, message, file, and line.
2. **Reproduce** it reliably. A bug you can trigger on demand is half-solved.
3. **Isolate.** Comment out code or add logs to narrow the failing region.
4. **Hypothesize** a cause, then **test** that single hypothesis.
5. **Fix**, then confirm the symptom is gone and nothing else broke.

## Tools
\`\`\`js
console.log("value of x:", x);   // inspect runtime state
console.table(arrayOfObjects);   // tabular view
debugger;                        // pause in browser devtools
\`\`\`

## Real-world analogy
Diagnosing a car that will not start. You do not replace the whole engine — you check the battery, then the fuel, then the starter. **Isolate one system at a time.**

## Common mistakes
- Changing many things at once, so you never learn what actually fixed it.
- Ignoring the stack trace, which literally points at the line that failed.

## Mini challenge
Given \`TypeError: Cannot read properties of undefined (reading 'name')\`, name two log statements you would add to find which variable is \`undefined\`.`,
  },
];

function slug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Seed an outline lesson for modules that do not yet carry a full body.
 * The body is intentionally substantive — orientation, what you will learn,
 * and a direct path to expand it live with ARCHITECT — so the academy never
 * shows an empty "coming soon" page.
 */
function outlineLessons(levelId: number, theme: string, titles: string[]): Lesson[] {
  return titles.map((title) => ({
    id: `l${levelId}-${slug(title)}`,
    levelId,
    title,
    summary: `${theme} · ${title}.`,
    estMinutes: 20,
    keyPoints: [
      `${title} is a core module of Level ${levelId}: ${theme}.`,
      "Open ARCHITECT to get a full definition, examples, analogy, and challenge.",
      "Complete the level quiz and a challenge to clear the mastery checkpoint.",
    ],
    body: `## ${title}

**${title}** is part of **Level ${levelId} — ${theme}**. This module is seeded as a structured outline; the deep written lesson is being rolled out across the curriculum.

### What this module covers
- The core definition and mental model of ${title.toLowerCase()}.
- A worked JavaScript or pseudocode example.
- Where ${title.toLowerCase()} appears in real engineering systems.
- The common mistakes and how to avoid them.

### Study it now
Open the **AI Tutor (ARCHITECT)** and ask: *"Teach me ${title} as part of ${theme}. Give me a definition, a code example, a real-world use case, common mistakes, and a practice challenge."* ARCHITECT responds with rigorous, senior-engineer-level depth tailored to where you are in the track.`,
  }));
}

export const CURRICULUM: Level[] = [
  {
    id: 0,
    code: "L0",
    title: "Computer Literacy",
    description: "The machine, the filesystem, the terminal, the network, and version control.",
    outcome: "Operate a computer like an engineer: navigate the shell, the web model, and Git.",
    lessons: level0Lessons,
  },
  {
    id: 1,
    code: "L1",
    title: "JavaScript Foundations",
    description: "Variables, types, functions, control flow, scope, closures, errors, and debugging.",
    outcome: "Write, reason about, and debug real JavaScript programs from scratch.",
    lessons: [
      ...level1Lessons.slice(0, 7),
      ...outlineLessons(1, "JavaScript Foundations", ["Scope", "Closures", "Error Handling"]),
      level1Lessons[7],
    ],
  },
  {
    id: 2,
    code: "L2",
    title: "Programming Logic",
    description: "Boolean logic, truth tables, control flow, recursion, and problem decomposition.",
    outcome: "Decompose any problem into precise, testable logical steps.",
    lessons: [
      ...outlineLessons(2, "Programming Logic", ["Boolean Logic", "Truth Tables", "Control Flow"]),
      deep("l2-recursion"),
      ...outlineLessons(2, "Programming Logic", [
        "Problem Decomposition",
        "Pseudocode",
        "Pattern Recognition",
      ]),
    ],
  },
  {
    id: 3,
    code: "L3",
    title: "Big O & Complexity",
    description: "Asymptotic analysis from O(1) to O(n²), time vs space, and complexity drills.",
    outcome: "Analyze and compare the time and space complexity of any algorithm.",
    lessons: [
      deep("l3-big-o"),
      ...outlineLessons(3, "Big O & Complexity", [
        "O(1) — Constant Time",
        "O(log n) — Logarithmic Time",
        "O(n) — Linear Time",
        "O(n log n) — Linearithmic Time",
        "O(n²) — Quadratic Time",
        "Time Complexity",
        "Space Complexity",
        "Complexity Comparison Drills",
      ]),
    ],
  },
  {
    id: 4,
    code: "L4",
    title: "Data Structures",
    description: "Arrays, strings, hash maps, sets, stacks, queues, lists, trees, graphs, and tries.",
    outcome: "Choose and implement the right data structure for any problem.",
    lessons: [
      deep("l4-arrays"),
      ...outlineLessons(4, "Data Structures", ["Strings"]),
      deep("l4-hash-maps"),
      ...outlineLessons(4, "Data Structures", ["Sets"]),
      deep("l4-stacks"),
      deep("l4-queues"),
      deep("l4-linked-lists"),
      deep("l4-trees"),
      ...outlineLessons(4, "Data Structures", ["Binary Search Trees", "Heaps"]),
      deep("l4-graphs"),
      ...outlineLessons(4, "Data Structures", ["Tries"]),
    ],
  },
  {
    id: 5,
    code: "L5",
    title: "Algorithms",
    description: "Searching, sorting, recursion, two pointers, sliding window, BFS/DFS, and DP.",
    outcome: "Design and analyze efficient algorithms and recognize the classic patterns.",
    lessons: [
      ...outlineLessons(5, "Algorithms", ["Linear Search"]),
      deep("l5-binary-search"),
      deep("l5-sorting"),
      ...outlineLessons(5, "Algorithms", [
        "Bubble Sort",
        "Selection Sort",
        "Insertion Sort",
        "Merge Sort",
        "Quick Sort",
        "Recursion Algorithms",
        "Two Pointers",
        "Sliding Window",
        "Depth-First Search",
        "Breadth-First Search",
        "Dynamic Programming Basics",
      ]),
    ],
  },
  {
    id: 6,
    code: "L6",
    title: "Software Engineering",
    description: "TypeScript, testing, clean code, Git workflows, APIs, REST, auth, DBs, system design.",
    outcome: "Ship maintainable, tested, well-architected software in a team.",
    lessons: outlineLessons(6, "Software Engineering", [
      "TypeScript",
      "Testing",
      "Clean Code",
      "Git Workflows",
      "APIs",
      "REST",
      "Authentication",
      "Databases",
      "System Design Basics",
    ]),
  },
  {
    id: 7,
    code: "L7",
    title: "Computer Science Core",
    description: "Discrete math, logic, set theory, graph theory, OS, networking, DBs, compilers, PLs.",
    outcome: "Reason about computing from mathematical foundations up to systems.",
    lessons: outlineLessons(7, "Computer Science Core", [
      "Discrete Math",
      "Logic",
      "Set Theory",
      "Graph Theory",
      "Operating Systems",
      "Networking",
      "Databases",
      "Compilers",
      "Programming Languages",
    ]),
  },
  {
    id: 8,
    code: "L8",
    title: "Advanced Systems",
    description: "Distributed systems, caching, queues, load balancing, concurrency, security, scale.",
    outcome: "Design systems that stay correct, fast, and available at massive scale.",
    lessons: outlineLessons(8, "Advanced Systems", [
      "Distributed Systems",
      "Caching",
      "Queues",
      "Load Balancing",
      "Concurrency",
      "Security",
      "Scalability",
      "Cloud Architecture",
    ]),
  },
  {
    id: 9,
    code: "L9",
    title: "Research / Doctorate Track",
    description: "Reading papers, complexity theory, advanced algorithms, PL theory, ML theory, formal methods.",
    outcome: "Read the frontier, reason with formal methods, and produce original research.",
    lessons: outlineLessons(9, "Research / Doctorate Track", [
      "Reading Research Papers",
      "Complexity Theory",
      "Advanced Algorithms",
      "Programming Language Theory",
      "Compiler Design",
      "Distributed Systems Research",
      "Machine Learning Theory",
      "Formal Methods",
      "Original Research Project",
    ]),
  },
];

// Expose the deep topics for tooling/tests; they are already embedded above.
export { DEEP_TOPICS };

export const ALL_LESSONS: Lesson[] = CURRICULUM.flatMap((l) => l.lessons);

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getLevelById(id: number): Level | undefined {
  return CURRICULUM.find((l) => l.id === id);
}
