export type LessonStatus = "locked" | "active" | "completed";

export interface LessonExample {
  title: string;
  language: string;
  code: string;
  explanation?: string;
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
}

export interface Level {
  id: number;
  code: string;
  title: string;
  description: string;
  lessons: Lesson[];
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
  type: "lesson" | "challenge" | "diagnostic" | "system";
  message: string;
  timestamp: number;
}
