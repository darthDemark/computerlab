export type LessonStatus = "locked" | "active" | "completed";

export interface LessonExample {
  title: string;
  language: string;
  code: string;
  explanation?: string;
}

/**
 * The 7-part deep-dive structure used by seed CS topics. Every field is
 * required for a topic to count as fully seeded.
 */
export interface LessonSections {
  /** Plain-language intuition for a beginner. (markdown) */
  beginner: string;
  /** Rigorous, precise treatment for an engineer. (markdown) */
  technical: string;
  /** Runnable JavaScript example — raw code, no fences. */
  jsExample: string;
  /** Where this shows up in real systems. (markdown) */
  realWorld: string;
  /** Frequent misconceptions and traps. */
  commonMistakes: string[];
  /** A concrete practice challenge prompt. */
  practiceChallenge: string;
  /** How the topic connects to a buildable project. */
  projectConnection: string;
}

export interface Lesson {
  id: string;
  levelId: number;
  title: string;
  summary: string;
  estMinutes: number;
  /** Markdown explanation body. */
  body: string;
  examples?: LessonExample[];
  /** Optional ASCII / textual diagram. */
  diagram?: string;
  keyPoints?: string[];
  /** Optional complexity annotation for data-structure / algorithm lessons. */
  complexity?: string;
  /** Optional 7-part deep-dive content for seeded core topics. */
  sections?: LessonSections;
}

export interface Level {
  id: number;
  code: string;
  title: string;
  description: string;
  /** Short outcome statement: what you can do after mastering the level. */
  outcome: string;
  lessons: Lesson[];
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  levelId: number;
  title: string;
  passThreshold: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  levelId: number;
  score: number;
  total: number;
  passed: boolean;
  timestamp: number;
}

/** Computed mastery checkpoint state for a level. */
export interface LevelMastery {
  levelId: number;
  lessonsComplete: boolean;
  lessonsDone: number;
  lessonsTotal: number;
  quizPassed: boolean;
  challengeSolved: boolean;
  mastered: boolean;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  levelId: number;
  prompt: string;
  rules: string[];
  starterCode: string;
  /** Simulated tests. Each test runs against the user's submitted function. */
  tests: ChallengeTest[];
  functionName: string;
}

export interface ChallengeTest {
  description: string;
  /** Stringified args, evaluated. */
  args: unknown[];
  expected: unknown;
}

export interface TestRun {
  description: string;
  passed: boolean;
  expected: string;
  received: string;
}

export interface ChallengeAttempt {
  challengeId: string;
  code: string;
  passed: number;
  total: number;
  success: boolean;
  timestamp: number;
}

export interface DiagnosticCategory {
  id: string;
  label: string;
}

export interface DebugSession {
  id: string;
  category: string;
  errorInput: string;
  analysis: string;
  timestamp: number;
}

export interface TroubleshootingCase {
  id: string;
  title: string;
  category: string;
  /** Curriculum level this failure most relates to. */
  levelId: number;
  whatHappened: string;
  symptoms: string[];
  rootCause: string;
  diagnosis: string[];
  fix: string;
  prevention: string;
}

export interface Project {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  /** Curriculum level this project reinforces. */
  levelId: number;
  blurb: string;
  skills: string[];
  requirements: string[];
}

export interface ResearchPaper {
  id: string;
  category: string;
  title: string;
  authors: string;
  year: number;
  abstract: string;
  tags: string[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ProgressState {
  xp: number;
  streak: number;
  lastActiveDay: string | null;
}

export interface FeedEvent {
  id: string;
  type: "lesson" | "challenge" | "diagnostic" | "quiz" | "system";
  message: string;
  timestamp: number;
}
