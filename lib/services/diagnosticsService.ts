import type { DebugSession } from "@/lib/types";
import { TROUBLESHOOTING_CASES } from "@/lib/data/troubleshooting";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";
import { progressService } from "./progressService";

export const diagnosticsService = {
  getSessions(): DebugSession[] {
    return readJSON<DebugSession[]>(STORAGE_KEYS.debugSessions, []);
  },

  recordSession(category: string, errorInput: string, analysis: string): DebugSession {
    const session: DebugSession = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      category,
      errorInput,
      analysis,
      timestamp: Date.now(),
    };
    const sessions = this.getSessions();
    sessions.unshift(session);
    writeJSON(STORAGE_KEYS.debugSessions, sessions.slice(0, 50));
    progressService.addXP(25);
    progressService.touchStreak();
    progressService.pushFeed("diagnostic", "Diagnostics run completed");
    return session;
  },

  sessionCount(): number {
    return this.getSessions().length;
  },

  // ---- Troubleshooting case reviews ---------------------------------------
  getReviewedCases(): string[] {
    return readJSON<string[]>(STORAGE_KEYS.reviewedCases, []);
  },

  markReviewed(caseId: string): void {
    const reviewed = this.getReviewedCases();
    if (reviewed.includes(caseId)) return;
    reviewed.push(caseId);
    writeJSON(STORAGE_KEYS.reviewedCases, reviewed);
    progressService.pushFeed("diagnostic", "Troubleshooting case reviewed");
  },

  reviewedCount(): number {
    return this.getReviewedCases().length;
  },

  totalCases(): number {
    return TROUBLESHOOTING_CASES.length;
  },
};
