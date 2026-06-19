import type { Lesson } from "@/lib/types";

/**
 * Deep 7-part seed content for the core computer-science topics. Each topic
 * carries a full `sections` object: beginner explanation, technical
 * explanation, JavaScript example, real-world use case, common mistakes,
 * a practice challenge, and a project connection.
 */

export const DEEP_TOPICS: Lesson[] = [
  {
    id: "l3-big-o",
    levelId: 3,
    title: "What is Big O?",
    summary: "The language engineers use to describe how cost grows with input size.",
    estMinutes: 22,
    complexity: "Describes growth, not wall-clock time",
    keyPoints: [
      "Big O describes how runtime/space scales as input n grows.",
      "We keep the dominant term and drop constants.",
      "It is about the shape of growth, not the exact speed.",
    ],
    body: "Big O notation is the vocabulary of performance. Before optimizing anything, an engineer must be able to say *how* a solution scales.",
    sections: {
      beginner:
        "Imagine two ways to find a friend's name in a phone book. One: read every page from the start. Two: open to the middle, decide left or right, repeat. With 10 names both feel instant. With 10 million names, the first crawls while the second still finishes in a couple dozen steps. **Big O** is how we describe that difference *without* a stopwatch — it tells you how the work grows as the data grows.",
      technical:
        "Big O describes the **asymptotic upper bound** of an algorithm's cost as the input size `n` approaches infinity. We discard constant factors and lower-order terms because they stop mattering at scale: `3n² + 50n + 200` is `O(n²)`. Formally, `f(n) = O(g(n))` if there exist constants `c > 0` and `n₀` such that `f(n) ≤ c·g(n)` for all `n ≥ n₀`. Common classes ordered from best to worst: `O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)`.",
      jsExample: `// O(1) — constant: one step regardless of size
function first(arr) {
  return arr[0];
}

// O(n) — linear: work grows with the array
function sum(arr) {
  let total = 0;
  for (const x of arr) total += x;
  return total;
}

// O(n^2) — quadratic: a loop inside a loop
function hasDuplicate(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}`,
      realWorld:
        "Every system that handles growth lives or dies by Big O. A search feature that is `O(n)` per keystroke feels fine in a demo of 100 records and times out on 10 million. Database indexes exist to turn `O(n)` table scans into `O(log n)` lookups. When an interviewer asks you to 'optimize', they are almost always asking you to lower the Big O class.",
      commonMistakes: [
        "Confusing Big O with real speed — a smaller-O algorithm can be slower on tiny inputs due to constants.",
        "Keeping constants or lower-order terms (writing O(2n) or O(n + 5) instead of O(n)).",
        "Forgetting that nested loops over the same data are usually O(n²), not O(2n).",
        "Ignoring space complexity — an O(n) algorithm that copies the array is O(n) memory too.",
      ],
      practiceChallenge:
        "Given three functions, label each with its Big O: (1) returning `arr.length`; (2) a single loop summing an array; (3) two nested loops comparing every pair. Then rewrite the duplicate-finder to run in O(n) using a Set.",
      projectConnection:
        "When you build the **Learning Tracker** project, you will aggregate sessions and compute streaks. Doing it with nested loops is O(n²); using a hash map of dates makes it O(n). Big O is the difference between a tracker that stays instant at 5 years of data and one that stutters.",
    },
  },
  {
    id: "l4-arrays",
    levelId: 4,
    title: "Arrays",
    summary: "Contiguous, index-addressable memory — the most fundamental data structure.",
    estMinutes: 20,
    complexity: "Access O(1) · Search O(n) · Insert/Delete O(n) (end: O(1) amortized)",
    keyPoints: [
      "Arrays store elements in contiguous memory, indexed from 0.",
      "Random access by index is O(1); searching by value is O(n).",
      "Inserting/removing in the middle shifts elements: O(n).",
    ],
    body: "The array is the bedrock data structure. Almost every other structure is built on top of it or compared against it.",
    sections: {
      beginner:
        "An array is a row of numbered boxes sitting side by side. Because they are in a neat row and each box is the same size, if someone says 'box number 5', you can jump straight to it without checking boxes 0–4. That instant jump is the array's superpower. The trade-off: if you want to squeeze a new box into the middle, every box after it has to shuffle over to make room.",
      technical:
        "An array allocates a **contiguous block of memory**; element `i` lives at `base_address + i × element_size`. That formula is why **random access is O(1)**. Searching for a value you do not have the index for is **O(n)** (you must scan). Insertion or deletion at an arbitrary position is **O(n)** because subsequent elements must shift. Appending to the end is **O(1) amortized** — dynamic arrays (like JS arrays) occasionally double their capacity, an O(n) copy that averages out to O(1) per push.",
      jsExample: `const scores = [90, 82, 71, 64];

scores[2];          // 71  -> O(1) random access
scores.push(55);    // append -> O(1) amortized
scores.unshift(99); // prepend -> O(n), shifts everything right
scores.indexOf(71); // 3 -> O(n) search

// Transform without mutating the original
const curved = scores.map((s) => Math.min(100, s + 10));`,
      realWorld:
        "Arrays back almost everything: pixel buffers in images, audio samples, rows returned from a database, the list of items in a shopping cart, and the call stack itself. When order matters and you mostly read by position or iterate front-to-back, an array is the right default. CPUs also love arrays because contiguous memory is cache-friendly — iterating an array is dramatically faster than chasing pointers.",
      commonMistakes: [
        "Assuming search is fast — finding a value by content is O(n), not O(1).",
        "Using unshift/splice in hot loops; prepending and mid-insertion are O(n).",
        "Mutating an array you meant to copy (`const b = a` shares the same reference).",
        "Off-by-one errors: the last valid index is `length - 1`.",
      ],
      practiceChallenge:
        "Write `rotateLeft(arr, k)` that rotates an array left by k positions (`[1,2,3,4,5]`, k=2 → `[3,4,5,1,2]`). Do it in O(n) time. Then explain why repeatedly calling `shift()`/`push()` would be O(n·k).",
      projectConnection:
        "The **Todo App** and **Music Playlist** projects are array exercises in disguise: add (push), remove (filter/splice), reorder (swap indices), and render (map). Mastering array operations here is exactly what makes those projects feel effortless.",
    },
  },
  {
    id: "l4-hash-maps",
    levelId: 4,
    title: "Objects / Hash Maps",
    summary: "Key/value storage with average O(1) lookup — the engineer's Swiss army knife.",
    estMinutes: 22,
    complexity: "Average O(1) insert/lookup/delete · Worst O(n) on collisions",
    keyPoints: [
      "A hash function turns a key into an array index for instant lookup.",
      "Average insert/lookup/delete is O(1); worst case O(n).",
      "Use a Map for arbitrary keys; objects for string-keyed records.",
    ],
    body: "If arrays are about position, hash maps are about *naming*. They trade ordering for near-instant lookup by key, and they quietly power an enormous share of real software.",
    sections: {
      beginner:
        "A hash map is like a coat check. You hand over your coat and get a numbered ticket; later you show the ticket and get your exact coat back instantly — the attendant never searches the whole rack. The 'ticket' is computed from your key, so finding the value takes the same tiny effort whether there are 10 coats or 10 million.",
      technical:
        "A hash map applies a **hash function** to a key to produce an index into an internal array of 'buckets'. Good hash functions distribute keys uniformly, giving **average O(1)** insert, lookup, and delete. When two keys hash to the same bucket (a **collision**), the map resolves it via chaining (a list per bucket) or open addressing. Heavy collisions degrade performance toward **O(n)**. To keep collisions low, maps track a **load factor** and resize (rehash) when it grows too high. In JS, `Map` accepts any key type and preserves insertion order; plain objects coerce keys to strings.",
      jsExample: `const inventory = new Map();
inventory.set("apple", 12);
inventory.set("pear", 7);

inventory.get("apple");      // 12  -> O(1) average
inventory.has("pear");       // true
inventory.delete("apple");

// Classic use: count frequencies in O(n)
function wordCount(words) {
  const counts = new Map();
  for (const w of words) {
    counts.set(w, (counts.get(w) ?? 0) + 1);
  }
  return counts;
}`,
      realWorld:
        "Hash maps are everywhere: database indexes, in-memory caches like Redis, deduplication, session stores, symbol tables in compilers, and the 'seen set' that turns countless O(n²) brute-force solutions into O(n). Any time you find yourself scanning a list to check 'have I seen this before?', a hash map is the upgrade.",
      commonMistakes: [
        "Using an object when keys aren't strings — object keys are stringified, so `obj[1]` and `obj['1']` collide.",
        "Relying on worst-case O(1) — adversarial or poorly-distributed keys can degrade to O(n).",
        "Forgetting Map vs object: `Object.keys` ignores symbol keys and prototype quirks (`hasOwnProperty`).",
        "Storing huge values by key and never deleting them — hash maps are a common memory-leak source.",
      ],
      practiceChallenge:
        "Implement `twoSum(nums, target)` returning indices of the two numbers that add to target, in O(n), using a hash map of value→index. Then explain why the naive nested-loop version is O(n²).",
      projectConnection:
        "In the **Quiz App** and **Notes App**, hash maps let you look up a question by id or a note by key instantly instead of scanning arrays. The frequency-count pattern you learn here also powers search ranking and tag clouds.",
    },
  },
  {
    id: "l4-stacks",
    levelId: 4,
    title: "Stacks",
    summary: "Last-In-First-Out structure — the model behind undo, recursion, and parsing.",
    estMinutes: 18,
    complexity: "push O(1) · pop O(1) · peek O(1) · search O(n)",
    diagram: `push ─▶ ┌─────┐ ◀─ pop
        │  C  │  (top)
        ├─────┤
        │  B  │
        ├─────┤
        │  A  │  (bottom)
        └─────┘`,
    keyPoints: [
      "LIFO: the last item pushed is the first popped.",
      "push, pop, and peek are all O(1).",
      "Models call stacks, undo history, and bracket matching.",
    ],
    body: "A stack enforces a strict discipline: you can only touch the top. That single constraint turns out to model an enormous range of real problems.",
    sections: {
      beginner:
        "A stack is a pile of plates. You add a clean plate to the top, and when you need one you take it off the top. The plate you put down most recently is the one you pick up first. You never pull a plate from the middle — only the top is reachable. That 'last in, first out' rule is the whole idea.",
      technical:
        "A **stack** is a LIFO (Last-In-First-Out) collection supporting `push` (add to top), `pop` (remove top), and `peek` (read top) — all **O(1)**. It can be backed by an array (push/pop at the end) or a linked list (insert/remove at head). The **call stack** in every programming language is literally a stack of frames; each function call pushes a frame, each return pops one. Stack overflow errors happen when recursion pushes more frames than the stack can hold.",
      jsExample: `class Stack {
  #items = [];
  push(x) { this.#items.push(x); }     // O(1)
  pop()   { return this.#items.pop(); } // O(1)
  peek()  { return this.#items.at(-1); }
  get size() { return this.#items.length; }
}

// Validate balanced brackets with a stack
function isBalanced(str) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of str) {
    if ("([{".includes(ch)) stack.push(ch);
    else if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    }
  }
  return stack.length === 0;
}`,
      realWorld:
        "Stacks power the undo/redo in every editor, the back button's history, expression evaluation in calculators and compilers, depth-first search, and the call stack that runs your code. Any time you need to reverse work or remember 'what was I doing before this interruption', a stack is the tool.",
      commonMistakes: [
        "Popping from an empty stack — always check size or handle undefined.",
        "Using a stack when you actually need FIFO order (that's a queue).",
        "Deep unbounded recursion causing a stack overflow instead of using an explicit stack.",
        "Treating array index 0 as the top when you push/pop at the end (the top is the last element).",
      ],
      practiceChallenge:
        "Implement a `MinStack` that supports push, pop, and `getMin()` — all in O(1). Hint: keep a second stack tracking the minimum at each level.",
      projectConnection:
        "The undo feature in the **Notes App** and the navigation history in any multi-screen project are stacks. Build undo by pushing each state change and popping to revert.",
    },
  },
  {
    id: "l4-queues",
    levelId: 4,
    title: "Queues",
    summary: "First-In-First-Out structure — the backbone of scheduling and BFS.",
    estMinutes: 18,
    complexity: "enqueue O(1) · dequeue O(1) · peek O(1) · search O(n)",
    diagram: `enqueue ─▶ ┌───┬───┬───┬───┐ ─▶ dequeue
            │ D │ C │ B │ A │
            └───┴───┴───┴───┘
            (back)      (front)`,
    keyPoints: [
      "FIFO: the first item enqueued is the first dequeued.",
      "enqueue and dequeue should both be O(1).",
      "Models task scheduling, buffers, and breadth-first search.",
    ],
    body: "Where a stack reverses, a queue preserves order. It is the fairness structure: first come, first served.",
    sections: {
      beginner:
        "A queue is a line at a coffee shop. The first person to arrive is the first to be served; new arrivals join the back. Nobody jumps the line. This 'first in, first out' fairness is exactly what computers need when many requests are waiting their turn.",
      technical:
        "A **queue** is a FIFO (First-In-First-Out) collection supporting `enqueue` (add to back) and `dequeue` (remove from front). Both should be **O(1)**. A naive array implementation using `shift()` is **O(n)** because every element shifts forward — so production queues use a linked list or a circular buffer (ring) to keep both ends O(1). Variants include the **deque** (double-ended queue) and the **priority queue** (highest-priority element dequeues first, usually backed by a heap).",
      jsExample: `// O(1) queue using two indices over an object map
class Queue {
  #items = {};
  #head = 0;
  #tail = 0;
  enqueue(x) { this.#items[this.#tail++] = x; }   // O(1)
  dequeue() {                                       // O(1)
    if (this.#head === this.#tail) return undefined;
    const v = this.#items[this.#head];
    delete this.#items[this.#head++];
    return v;
  }
  get size() { return this.#tail - this.#head; }
}`,
      realWorld:
        "Queues run the world's task systems: print spoolers, message brokers (RabbitMQ, Kafka, SQS), web request buffers, OS process scheduling, and the event loop that powers JavaScript itself. Breadth-first search uses a queue to explore a graph level by level. Whenever producers and consumers work at different speeds, a queue decouples them.",
      commonMistakes: [
        "Using array.shift() for dequeue — it is O(n) and silently kills performance at scale.",
        "Confusing LIFO (stack) with FIFO (queue) and getting reversed output.",
        "Forgetting to handle the empty-queue case on dequeue.",
        "Letting an unbounded queue grow forever when consumers fall behind (backpressure).",
      ],
      practiceChallenge:
        "Implement a queue using **two stacks** (push onto an 'in' stack, dequeue from an 'out' stack, transferring when out is empty). Prove the amortized cost of dequeue is O(1).",
      projectConnection:
        "The play queue in the **Music Playlist App** is a literal queue. The same FIFO logic schedules notifications, retries failed API calls, and orders messages in a chat app.",
    },
  },
  {
    id: "l4-linked-lists",
    levelId: 4,
    title: "Linked Lists",
    summary: "Nodes connected by pointers — O(1) insertion at the cost of O(n) access.",
    estMinutes: 22,
    complexity: "Access/Search O(n) · Insert/Delete at known node O(1)",
    diagram: `head
 │
 ▼
┌────┬──┐   ┌────┬──┐   ┌────┬──┐
│ 7  │ ●─┼─▶│ 3  │ ●─┼─▶│ 9  │∅ │
└────┴──┘   └────┴──┘   └────┴──┘`,
    keyPoints: [
      "Each node holds a value and a pointer to the next node.",
      "Insert/delete at a known position is O(1) — no shifting.",
      "Access by index is O(n) — you must walk from the head.",
    ],
    body: "A linked list trades the array's instant access for cheap restructuring. Understanding it is the gateway to trees, graphs, and pointer thinking.",
    sections: {
      beginner:
        "Picture a treasure hunt. Each clue tells you where the next clue is. To reach the fifth clue you must follow the first four — you cannot teleport to clue five. But adding a new clue is easy: you just rewrite one clue to point at the new one, and the new one points where the old clue used to. No reshuffling of the whole hunt.",
      technical:
        "A **linked list** is a chain of **nodes**, each holding a value and a reference (pointer) to the next node; the last points to `null`. Because nodes are scattered in memory rather than contiguous, **random access is O(n)** — you traverse from the `head`. The payoff: once you hold a reference to a node, **insertion and deletion are O(1)** (just rewire pointers — no shifting like an array). A **doubly linked list** also points backward; a **circular list** loops the tail to the head. The cost is extra memory per node and poor cache locality.",
      jsExample: `class Node {
  constructor(value) { this.value = value; this.next = null; }
}

class LinkedList {
  constructor() { this.head = null; }

  prepend(value) {            // O(1)
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
  }

  find(value) {               // O(n)
    let cur = this.head;
    while (cur) {
      if (cur.value === value) return cur;
      cur = cur.next;
    }
    return null;
  }
}`,
      realWorld:
        "Linked lists underpin many structures: the buckets of a hash map use chains, LRU caches combine a hash map with a doubly linked list, the browser history is a doubly linked list, and music players use them for next/previous. Filesystems and memory allocators track free blocks with linked lists. Anywhere insertions and deletions dominate and you rarely need random access, a linked list shines.",
      commonMistakes: [
        "Losing the rest of the list by reassigning a pointer before saving `node.next`.",
        "Expecting O(1) indexing — there is no such thing; traversal is O(n).",
        "Forgetting the null terminator check and walking off the end.",
        "Creating a cycle by accident, causing infinite traversal (detect with fast/slow pointers).",
      ],
      practiceChallenge:
        "Write `reverse(head)` that reverses a singly linked list in O(n) time and O(1) extra space using three pointers (prev, cur, next). Then detect a cycle using Floyd's tortoise-and-hare.",
      projectConnection:
        "The next/previous track logic in the **Music Playlist App** is a doubly linked list. The same node-and-pointer reasoning is the foundation you will reuse for trees and graphs later in this level.",
    },
  },
  {
    id: "l4-trees",
    levelId: 4,
    title: "Trees",
    summary: "Hierarchical nodes with parent/child links — the shape of nested data.",
    estMinutes: 24,
    complexity: "Balanced BST: search/insert/delete O(log n) · Unbalanced: O(n)",
    diagram: `          (8)
         /    \\
      (3)      (10)
     /   \\        \\
   (1)   (6)      (14)`,
    keyPoints: [
      "A tree is nodes connected top-down with one root and no cycles.",
      "A Binary Search Tree keeps left < node < right for O(log n) search.",
      "Balance is everything — an unbalanced tree degrades to a linked list.",
    ],
    body: "Trees model hierarchy: file systems, the DOM, decision processes, and sorted data that must stay searchable. They are linked lists that branch.",
    sections: {
      beginner:
        "A tree is like a family tree drawn upside down. There is one ancestor at the top (the root). Each person can have children below them, and everyone (except the root) has exactly one parent. You never loop back up — you only branch downward. This shape is perfect for anything organized into nested categories.",
      technical:
        "A **tree** is a connected, acyclic graph with a designated **root**; each node has zero or more **children** and exactly one parent (except the root). A **binary tree** limits each node to two children. A **Binary Search Tree (BST)** adds an ordering invariant: every value in the left subtree is smaller, every value in the right is larger — enabling **O(log n)** search, insert, and delete *when balanced*. Without balancing, inserting sorted data produces a degenerate tree that behaves like a linked list (**O(n)**). Self-balancing variants (AVL, Red-Black) guarantee O(log n). Traversals: **in-order** (sorted output for a BST), **pre-order**, **post-order**, and **level-order** (BFS).",
      jsExample: `class TreeNode {
  constructor(value) { this.value = value; this.left = null; this.right = null; }
}

class BST {
  constructor() { this.root = null; }

  insert(value) {                       // O(log n) if balanced
    const node = new TreeNode(value);
    if (!this.root) { this.root = node; return; }
    let cur = this.root;
    while (true) {
      if (value < cur.value) {
        if (!cur.left) { cur.left = node; return; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = node; return; }
        cur = cur.right;
      }
    }
  }
}

// In-order traversal yields sorted values
function inOrder(node, out = []) {
  if (!node) return out;
  inOrder(node.left, out);
  out.push(node.value);
  inOrder(node.right, out);
  return out;
}`,
      realWorld:
        "Trees are the structure of the file system, the HTML DOM, JSON, abstract syntax trees in compilers, and database indexes (B-trees). Decision trees drive machine learning; tries power autocomplete; heaps power priority queues. Whenever data is hierarchical or must stay sorted and searchable, a tree is the answer.",
      commonMistakes: [
        "Ignoring balance — inserting sorted data into a plain BST gives O(n), not O(log n).",
        "Confusing tree traversals; only in-order on a BST yields sorted output.",
        "Forgetting base cases in recursive traversal, causing crashes on null children.",
        "Assuming all trees are binary — many real trees (DOM, filesystem) have many children.",
      ],
      practiceChallenge:
        "Write `maxDepth(root)` returning the height of a binary tree, and `isValidBST(root)` that verifies the BST ordering invariant across the whole tree (not just immediate children).",
      projectConnection:
        "The nested comment threads or category folders in a **Notes App**, and the rendering tree of any UI, are trees. The recursion you practice here is the same pattern that traverses a component tree.",
    },
  },
  {
    id: "l4-graphs",
    levelId: 4,
    title: "Graphs",
    summary: "Nodes joined by edges — the model for networks, maps, and relationships.",
    estMinutes: 24,
    complexity: "Adjacency list: space O(V+E) · BFS/DFS O(V+E)",
    diagram: `   (A)───(B)
    │  \\   │
    │   \\  │
   (C)───(D)───(E)`,
    keyPoints: [
      "A graph is a set of vertices connected by edges.",
      "Edges can be directed or undirected, weighted or unweighted.",
      "Adjacency lists give O(V+E) traversal and are the usual representation.",
    ],
    body: "A graph is the most general relationship structure — trees and linked lists are just special cases. It models anything that can be 'connected'.",
    sections: {
      beginner:
        "A graph is a map of dots connected by lines. The dots are things (people, cities, web pages) and the lines are relationships (friendship, roads, links). Unlike a family tree, a graph can loop back on itself and a dot can connect to many others. If you have ever seen a 'friends of friends' suggestion or a route on a map, you have used a graph.",
      technical:
        "A **graph** G = (V, E) is a set of **vertices** V and **edges** E connecting them. Edges may be **directed** (one-way, like Twitter follows) or **undirected** (mutual, like Facebook friends), and **weighted** (carrying a cost, like distance) or unweighted. Common representations: an **adjacency list** (a map from each vertex to its neighbors — space O(V+E), ideal for sparse graphs) or an **adjacency matrix** (a V×V grid — O(V²) space, O(1) edge lookup). Core traversals are **BFS** (queue, shortest path in unweighted graphs) and **DFS** (stack/recursion). Weighted shortest paths use **Dijkstra**; cycle-free ordering uses **topological sort**.",
      jsExample: `class Graph {
  constructor() { this.adj = new Map(); }

  addEdge(u, v) {                       // undirected
    if (!this.adj.has(u)) this.adj.set(u, []);
    if (!this.adj.has(v)) this.adj.set(v, []);
    this.adj.get(u).push(v);
    this.adj.get(v).push(u);
  }

  bfs(start) {                          // O(V + E)
    const visited = new Set([start]);
    const queue = [start];
    const order = [];
    while (queue.length) {
      const node = queue.shift();
      order.push(node);
      for (const next of this.adj.get(node) ?? []) {
        if (!visited.has(next)) { visited.add(next); queue.push(next); }
      }
    }
    return order;
  }
}`,
      realWorld:
        "Graphs model social networks (friend/follow), road and flight maps (GPS routing), the web (pages and hyperlinks → PageRank), dependency resolution in package managers and build tools, recommendation engines, and network packet routing. Almost any 'who is connected to whom' or 'what depends on what' question is a graph problem.",
      commonMistakes: [
        "Forgetting a visited set, causing infinite loops on cyclic graphs.",
        "Using an adjacency matrix for a sparse graph and wasting O(V²) memory.",
        "Using DFS when you need the shortest path — that requires BFS (unweighted) or Dijkstra (weighted).",
        "Treating a directed graph as undirected (adding edges both ways) and corrupting the model.",
      ],
      practiceChallenge:
        "Given a graph as an adjacency list, write `shortestPath(graph, start, end)` using BFS that returns the fewest edges between two nodes (or null if unreachable). Track each node's predecessor to reconstruct the path.",
      projectConnection:
        "A 'related notes' or tag-link feature in the **Notes App** is a graph traversal. The same BFS powers friend suggestions, maze solvers, and dependency graphs in the **REST API** project's data model.",
    },
  },
  {
    id: "l2-recursion",
    levelId: 2,
    title: "Recursion",
    summary: "A function that solves a problem by calling itself on a smaller piece.",
    estMinutes: 22,
    keyPoints: [
      "Every recursion needs a base case and a recursive case.",
      "Each call shrinks the problem toward the base case.",
      "Recursion mirrors the structure of trees, graphs, and divide-and-conquer.",
    ],
    body: "Recursion is one of the great mental unlocks in computer science. Once you trust it, whole categories of problems become almost trivial to express.",
    sections: {
      beginner:
        "Recursion is like standing between two mirrors and seeing a tunnel of reflections — each reflection contains a slightly smaller version of the same scene. To count people behind you in a line without turning around, you ask the person behind you 'how many are behind you?' and add one. They ask the same of the next person. Eventually the last person says 'zero' (the base case), and the answer travels back up the line.",
      technical:
        "**Recursion** is when a function calls itself on a smaller input. Two parts are mandatory: a **base case** that stops the recursion, and a **recursive case** that reduces the problem and recurses. Each call adds a **frame** to the call stack holding its own local state; frames unwind as calls return. Recursion is the natural tool for **self-similar** structures (trees, graphs) and **divide-and-conquer** algorithms (merge sort, binary search). Beware depth: too many frames cause a **stack overflow**. Some recursions (tail calls) or overlapping subproblems (Fibonacci) are better expressed iteratively or with **memoization** to avoid exponential blowup.",
      jsExample: `// Base case + recursive case
function factorial(n) {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // recursive case
}
factorial(5); // 120

// Naive Fibonacci is O(2^n) due to repeated work
function fib(n) {
  if (n < 2) return n;
  return fib(n - 1) + fib(n - 2);
}

// Memoized: O(n)
function fibFast(n, memo = new Map()) {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const result = fibFast(n - 1, memo) + fibFast(n - 2, memo);
  memo.set(n, result);
  return result;
}`,
      realWorld:
        "Recursion traverses every tree-shaped thing: the file system, the DOM, JSON, and compiler syntax trees. It powers divide-and-conquer algorithms, backtracking solvers (sudoku, mazes, the N-queens problem), and parsers. Many problems that look hard iteratively collapse into a few recursive lines once you spot the self-similar structure.",
      commonMistakes: [
        "Missing or unreachable base case → infinite recursion → stack overflow.",
        "Not reducing the input toward the base case on every call.",
        "Recomputing the same subproblem repeatedly (exponential time) instead of memoizing.",
        "Using recursion for deep linear loops where iteration is simpler and stack-safe.",
      ],
      practiceChallenge:
        "Write a recursive `sumNested(arr)` that sums an arbitrarily nested array of numbers (e.g. `[1, [2, [3, 4]], 5]` → 15). Identify the base case and the recursive case explicitly.",
      projectConnection:
        "Rendering nested categories or comment threads in the **Notes App**, and walking the requirement tree in the **Learning Tracker**, are recursion. The technique is also the engine behind the tree and graph topics in Level 4.",
    },
  },
  {
    id: "l5-binary-search",
    levelId: 5,
    title: "Binary Search",
    summary: "Halving a sorted search space each step — O(log n) lookup.",
    estMinutes: 20,
    complexity: "O(log n) time · O(1) space (iterative) · requires sorted input",
    diagram: `target = 7   [1, 3, 5, 7, 9, 11, 13]
step 1: mid=7? compare with middle (7) -> found
(each step discards half the remaining range)`,
    keyPoints: [
      "Binary search only works on sorted data.",
      "Each comparison halves the search space → O(log n).",
      "Off-by-one bugs in the bounds are the classic failure.",
    ],
    body: "Binary search is the canonical example of how the right data structure (sorted) plus the right algorithm turns O(n) into O(log n) — a difference that becomes astronomical at scale.",
    sections: {
      beginner:
        "Binary search is how you find a word in a dictionary. You do not start at page one — you open to the middle, see whether your word comes before or after, and throw away the half it cannot be in. Repeat, and a 1,000-page dictionary is conquered in about 10 flips instead of 1,000. The catch: it only works because the dictionary is already in order.",
      technical:
        "**Binary search** finds a target in a **sorted** array by repeatedly comparing it to the middle element and discarding the half that cannot contain it. With `low` and `high` bounds, compute `mid = low + (high - low) / 2` (this avoids integer overflow in other languages), compare, and move a bound. Because the search space halves each step, it runs in **O(log n)** time and **O(1)** space iteratively. The precondition — sorted input — is non-negotiable; the cost of sorting first (O(n log n)) only pays off if you search many times.",
      jsExample: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    if (arr[mid] === target) return mid;       // found
    if (arr[mid] < target) low = mid + 1;       // search right half
    else high = mid - 1;                        // search left half
  }
  return -1;                                    // not found
}

binarySearch([1, 3, 5, 7, 9, 11, 13], 7); // 3`,
      realWorld:
        "Binary search underlies database index lookups, the 'git bisect' command that finds a breaking commit, autocomplete on sorted word lists, version resolution, and any 'search a sorted log/range' operation. The deeper idea — **binary search on the answer** — solves optimization problems like 'minimum capacity to ship packages in D days'.",
      commonMistakes: [
        "Running it on unsorted data — it will return wrong answers, not errors.",
        "Off-by-one bugs: `low <= high` vs `low < high`, and `mid ± 1` updates.",
        "Infinite loops from failing to move a bound past mid.",
        "Computing mid as `(low + high) / 2` (overflow risk in fixed-width integer languages).",
      ],
      practiceChallenge:
        "Implement `firstOccurrence(arr, target)` that returns the index of the *first* occurrence of target in a sorted array with duplicates, still in O(log n). Hint: when you find a match, keep searching left.",
      projectConnection:
        "Fast lookup in the **Learning Tracker** (find the session for a given date) and jump-to-result in any sorted list use binary search. The 'halve the space' instinct also drives the merge step you will study in sorting.",
    },
  },
  {
    id: "l5-sorting",
    levelId: 5,
    title: "Sorting Algorithms",
    summary: "From O(n²) quadratic sorts to O(n log n) divide-and-conquer.",
    estMinutes: 26,
    complexity: "Bubble/Selection/Insertion O(n²) · Merge/Quick O(n log n)",
    keyPoints: [
      "Simple sorts (bubble, selection, insertion) are O(n²).",
      "Merge sort and quick sort are O(n log n) via divide-and-conquer.",
      "Stability and in-place behavior matter when choosing a sort.",
    ],
    body: "Sorting is the classic lens for comparing algorithms. The same task — put items in order — has solutions ranging from naive O(n²) to elegant O(n log n), and the gap is enormous at scale.",
    sections: {
      beginner:
        "Sorting is putting things in order, like alphabetizing a shelf of books. The slow way is to scan the whole shelf over and over, swapping neighbors until nothing is out of place. The fast way is to split the shelf in half, sort each half, and merge the two ordered halves together. For a handful of books the slow way is fine; for a library, the smart split-and-merge approach wins by a mile.",
      technical:
        "**Quadratic sorts** compare and swap neighbors: **bubble sort** repeatedly swaps adjacent out-of-order pairs; **selection sort** repeatedly selects the minimum; **insertion sort** grows a sorted prefix — all **O(n²)**, though insertion sort is excellent (near O(n)) on nearly-sorted data. **Divide-and-conquer sorts** hit **O(n log n)**: **merge sort** splits in half, recursively sorts, and merges (stable, O(n) extra space); **quick sort** partitions around a pivot and recurses (in-place, O(n²) worst case with bad pivots, O(n log n) average). The comparison-sort lower bound is **Ω(n log n)**; non-comparison sorts (counting, radix) can beat it for restricted inputs. **Stability** (preserving equal elements' order) decides which sort fits multi-key sorting.",
      jsExample: `// Insertion sort: O(n^2), great on nearly-sorted data
function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
    arr[j + 1] = key;
  }
  return arr;
}

// Merge sort: O(n log n), stable
function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = arr.length >> 1;
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    out.push(left[i] <= right[j] ? left[i++] : right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}`,
      realWorld:
        "Sorting is everywhere: ordering search results, leaderboards, timelines by date, and as a preprocessing step that unlocks binary search and many greedy algorithms. Real engines are hybrids — V8's `Array.prototype.sort` uses TimSort (merge + insertion), tuned for real-world partially-ordered data. Knowing the trade-offs lets you reason about why your sort is slow and when to sort once vs. keep data sorted.",
      commonMistakes: [
        "Reaching for a hand-rolled O(n²) sort when the built-in O(n log n) sort is right there.",
        "Forgetting JS's default sort is lexicographic — `[10,2,1].sort()` gives `[1,10,2]` without a comparator.",
        "Assuming quick sort is always fastest — adversarial input makes it O(n²) without randomized pivots.",
        "Ignoring stability when sorting by multiple keys.",
      ],
      practiceChallenge:
        "Implement quick sort with a randomized pivot, then empirically compare its swap count to bubble sort on a shuffled array of 1,000 numbers. Explain the O(n log n) vs O(n²) gap you observe.",
      projectConnection:
        "Sorting tasks by due date in the **Todo App**, ranking scores in the **Quiz App**, and ordering a playlist by title all use sorting. Choosing the right comparator — and trusting the O(n log n) built-in — is the practical takeaway.",
    },
  },
];

const byId = new Map(DEEP_TOPICS.map((t) => [t.id, t]));

export function getDeepTopic(id: string): Lesson | undefined {
  return byId.get(id);
}
