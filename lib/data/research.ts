import type { ResearchPaper } from "@/lib/types";

export const RESEARCH_CATEGORIES = [
  "Algorithms",
  "Systems",
  "Programming Languages",
  "Machine Learning",
  "Theory",
  "Distributed Systems",
] as const;

export const RESEARCH_PAPERS: ResearchPaper[] = [
  {
    id: "r-mapreduce",
    category: "Distributed Systems",
    title: "MapReduce: Simplified Data Processing on Large Clusters",
    authors: "Dean, Ghemawat",
    year: 2004,
    abstract:
      "A programming model and runtime for processing massive datasets across commodity clusters. Users express computation as map and reduce functions; the framework handles partitioning, scheduling, fault tolerance, and inter-machine communication.",
    tags: ["batch", "fault tolerance", "clusters"],
  },
  {
    id: "r-raft",
    category: "Distributed Systems",
    title: "In Search of an Understandable Consensus Algorithm (Raft)",
    authors: "Ongaro, Ousterhout",
    year: 2014,
    abstract:
      "Raft is a consensus algorithm designed for understandability. It separates leader election, log replication, and safety, achieving the same guarantees as Paxos with a structure that is easier to reason about and implement.",
    tags: ["consensus", "replication", "leader election"],
  },
  {
    id: "r-attention",
    category: "Machine Learning",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    year: 2017,
    abstract:
      "Introduces the Transformer, a model architecture relying entirely on self-attention, dispensing with recurrence and convolution. It enables far greater parallelism and sets the foundation for modern large language models.",
    tags: ["transformers", "attention", "sequence models"],
  },
  {
    id: "r-bigtable",
    category: "Systems",
    title: "Bigtable: A Distributed Storage System for Structured Data",
    authors: "Chang et al.",
    year: 2006,
    abstract:
      "A distributed storage system for managing structured data that scales to petabytes across thousands of machines, using a sparse, distributed, persistent multi-dimensional sorted map as its data model.",
    tags: ["storage", "scale", "nosql"],
  },
  {
    id: "r-quicksort",
    category: "Algorithms",
    title: "Quicksort",
    authors: "Hoare",
    year: 1962,
    abstract:
      "A divide-and-conquer sorting algorithm that partitions an array around a pivot and recursively sorts the partitions, achieving O(n log n) expected time with excellent cache behavior and in-place operation.",
    tags: ["sorting", "divide and conquer", "in-place"],
  },
  {
    id: "r-lambda",
    category: "Programming Languages",
    title: "The Lambda Calculus and Functional Programming",
    authors: "Church (foundations)",
    year: 1936,
    abstract:
      "A formal system for expressing computation based on function abstraction and application. The lambda calculus is Turing-complete and underpins functional languages, type theory, and the semantics of programming languages.",
    tags: ["functional", "formal systems", "type theory"],
  },
  {
    id: "r-pvsnp",
    category: "Theory",
    title: "The Complexity of Theorem-Proving Procedures (P vs NP)",
    authors: "Cook",
    year: 1971,
    abstract:
      "Establishes the theory of NP-completeness, showing that boolean satisfiability is NP-complete. It frames the central open question of computer science: whether problems verifiable in polynomial time are also solvable in polynomial time.",
    tags: ["complexity", "np-complete", "open problem"],
  },
  {
    id: "r-dynamo",
    category: "Distributed Systems",
    title: "Dynamo: Amazon's Highly Available Key-value Store",
    authors: "DeCandia et al.",
    year: 2007,
    abstract:
      "A highly available key-value store that sacrifices strong consistency for availability under partitions, introducing techniques such as consistent hashing, vector clocks, and eventual consistency to production systems.",
    tags: ["availability", "eventual consistency", "key-value"],
  },
];
