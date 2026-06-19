/**
 * Low-level localStorage wrapper. All persistence flows through here so the
 * rest of the app never touches localStorage directly — enabling a future
 * migration to a backend (e.g. Supabase) by swapping this single module.
 */

export const STORAGE_KEYS = {
  completedLessons: "cs_lab_completed_lessons",
  notes: "cs_lab_notes",
  challenges: "cs_lab_challenges",
  debugSessions: "cs_lab_debug_sessions",
  progress: "cs_lab_progress",
  chatHistory: "cs_lab_chat_history",
  feed: "cs_lab_feed",
  reviewedCases: "cs_lab_reviewed_cases",
  quizzes: "cs_lab_quizzes",
} as const;

const isBrowser = (): boolean => typeof window !== "undefined";

export function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // Notify in-tab listeners (the native 'storage' event only fires cross-tab).
    window.dispatchEvent(new CustomEvent("cslab:storage", { detail: { key } }));
  } catch {
    /* quota or serialization failure — ignore in prototype */
  }
}

export function clearAll(): void {
  if (!isBrowser()) return;
  Object.values(STORAGE_KEYS).forEach((k) => window.localStorage.removeItem(k));
  window.dispatchEvent(new CustomEvent("cslab:storage", { detail: { key: "*" } }));
}
