import type { Project } from "@/lib/types";

export const PROJECTS: Project[] = [
  {
    id: "calculator",
    title: "Calculator",
    difficulty: "Beginner",
    blurb: "A four-function calculator with a clean keypad UI and keyboard support.",
    skills: ["DOM events", "State", "Functions", "Operator precedence"],
    requirements: [
      "Support +, −, ×, ÷ and clear.",
      "Handle chained operations.",
      "Prevent division by zero from crashing.",
      "Respond to keyboard input.",
    ],
  },
  {
    id: "guessing-game",
    title: "Number Guessing Game",
    difficulty: "Beginner",
    blurb: "Guess the secret number with higher/lower feedback and an attempt counter.",
    skills: ["Conditionals", "Loops", "Random", "State"],
    requirements: [
      "Generate a random target 1–100.",
      "Give higher/lower hints.",
      "Track and display attempts.",
      "Offer a replay.",
    ],
  },
  {
    id: "todo",
    title: "Todo App",
    difficulty: "Beginner",
    blurb: "Create, complete, filter, and persist tasks across reloads.",
    skills: ["Arrays", "localStorage", "Rendering", "Filtering"],
    requirements: [
      "Add and delete tasks.",
      "Toggle completion.",
      "Filter all / active / done.",
      "Persist with localStorage.",
    ],
  },
  {
    id: "quiz",
    title: "Quiz App",
    difficulty: "Intermediate",
    blurb: "A multiple-choice quiz with scoring, progress, and a results screen.",
    skills: ["Data modeling", "State machines", "Scoring", "Rendering"],
    requirements: [
      "Render questions from a data array.",
      "Track score across questions.",
      "Show a progress indicator.",
      "Display a final results summary.",
    ],
  },
  {
    id: "weather",
    title: "Weather App",
    difficulty: "Intermediate",
    blurb: "Fetch and display live weather for a searched city using a public API.",
    skills: ["fetch", "async/await", "APIs", "Error handling"],
    requirements: [
      "Search by city name.",
      "Call a weather API with async/await.",
      "Handle loading and error states.",
      "Display temperature and conditions.",
    ],
  },
  {
    id: "playlist",
    title: "Music Playlist App",
    difficulty: "Intermediate",
    blurb: "Build a queue with add, remove, reorder, and now-playing state.",
    skills: ["Arrays", "Immutable updates", "Sorting", "UI state"],
    requirements: [
      "Add and remove tracks.",
      "Reorder the queue.",
      "Track the currently playing item.",
      "Show total duration.",
    ],
  },
  {
    id: "notes",
    title: "Notes App",
    difficulty: "Intermediate",
    blurb: "A markdown-capable notes app with search and autosave.",
    skills: ["CRUD", "Debouncing", "Search", "localStorage"],
    requirements: [
      "Create, edit, and delete notes.",
      "Autosave with debounce.",
      "Full-text search across notes.",
      "Persist locally.",
    ],
  },
  {
    id: "rest-api",
    title: "REST API",
    difficulty: "Advanced",
    blurb: "Design and build a CRUD REST API with proper status codes and validation.",
    skills: ["HTTP", "Routing", "Validation", "Status codes"],
    requirements: [
      "Expose CRUD routes for one resource.",
      "Validate request bodies.",
      "Return correct status codes.",
      "Handle errors with a consistent shape.",
    ],
  },
  {
    id: "learning-tracker",
    title: "Learning Tracker",
    difficulty: "Advanced",
    blurb: "Model goals, sessions, and streaks — then visualize progress over time.",
    skills: ["Data modeling", "Date math", "Aggregation", "Charts"],
    requirements: [
      "Track goals and study sessions.",
      "Compute streaks and totals.",
      "Visualize progress over time.",
      "Persist all data locally.",
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}
