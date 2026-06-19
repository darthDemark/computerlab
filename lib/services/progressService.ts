import type { FeedEvent, ProgressState } from "@/lib/types";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";

const DEFAULT_PROGRESS: ProgressState = {
  xp: 0,
  streak: 0,
  lastActiveDay: null,
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86_400_000);
}

export const XP_PER_LEVEL = 500;

export const progressService = {
  get(): ProgressState {
    return readJSON<ProgressState>(STORAGE_KEYS.progress, DEFAULT_PROGRESS);
  },

  set(state: ProgressState): void {
    writeJSON(STORAGE_KEYS.progress, state);
  },

  addXP(amount: number): ProgressState {
    const state = this.get();
    state.xp += amount;
    this.set(state);
    return state;
  },

  /** Compute the agent level from accumulated XP. Level floor is 1. */
  level(xp?: number): number {
    const value = xp ?? this.get().xp;
    return Math.max(1, Math.floor(value / XP_PER_LEVEL) + 1);
  },

  /** Progress (0–1) toward the next level. */
  levelProgress(xp?: number): number {
    const value = xp ?? this.get().xp;
    return (value % XP_PER_LEVEL) / XP_PER_LEVEL;
  },

  /** Record activity for the current day and maintain the streak. */
  touchStreak(): ProgressState {
    const state = this.get();
    const now = today();
    if (state.lastActiveDay === now) return state;

    if (state.lastActiveDay) {
      const diff = dayDiff(state.lastActiveDay, now);
      state.streak = diff === 1 ? state.streak + 1 : 1;
    } else {
      state.streak = 1;
    }
    state.lastActiveDay = now;
    this.set(state);
    return state;
  },

  // ---- System feed ---------------------------------------------------------
  getFeed(): FeedEvent[] {
    return readJSON<FeedEvent[]>(STORAGE_KEYS.feed, []);
  },

  pushFeed(type: FeedEvent["type"], message: string): void {
    const feed = this.getFeed();
    feed.unshift({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type,
      message,
      timestamp: Date.now(),
    });
    writeJSON(STORAGE_KEYS.feed, feed.slice(0, 50));
  },
};
