import { ALL_LESSONS, CURRICULUM, getLessonById } from "@/lib/data/curriculum";
import type { Lesson, Level, LessonStatus } from "@/lib/types";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";
import { progressService } from "./progressService";

const LESSON_XP = 60;

export const lessonService = {
  getCurriculum(): Level[] {
    return CURRICULUM;
  },

  getLesson(id: string): Lesson | undefined {
    return getLessonById(id);
  },

  getAllLessons(): Lesson[] {
    return ALL_LESSONS;
  },

  getCompleted(): string[] {
    return readJSON<string[]>(STORAGE_KEYS.completedLessons, []);
  },

  isCompleted(id: string): boolean {
    return this.getCompleted().includes(id);
  },

  completedCount(): number {
    return this.getCompleted().length;
  },

  complete(id: string): void {
    const completed = this.getCompleted();
    if (completed.includes(id)) return;
    completed.push(id);
    writeJSON(STORAGE_KEYS.completedLessons, completed);

    progressService.addXP(LESSON_XP);
    progressService.touchStreak();
    const lesson = getLessonById(id);
    progressService.pushFeed("lesson", `Lesson completed — ${lesson?.title ?? id}`);
  },

  uncomplete(id: string): void {
    const completed = this.getCompleted().filter((c) => c !== id);
    writeJSON(STORAGE_KEYS.completedLessons, completed);
  },

  /**
   * Status for a lesson based on completion and unlock order. A level unlocks
   * when the previous level is fully complete; within a level the next lesson
   * unlocks when the prior one is done. Level 0 & 1 are always open.
   */
  getStatus(lessonId: string): LessonStatus {
    if (this.isCompleted(lessonId)) return "completed";
    const lesson = getLessonById(lessonId);
    if (!lesson) return "locked";
    return this.isLevelUnlocked(lesson.levelId) ? "active" : "locked";
  },

  isLevelUnlocked(levelId: number): boolean {
    if (levelId <= 1) return true;
    const prev = CURRICULUM.find((l) => l.id === levelId - 1);
    if (!prev) return true;
    return prev.lessons.every((les) => this.isCompleted(les.id));
  },

  getLevelProgress(levelId: number): { completed: number; total: number } {
    const level = CURRICULUM.find((l) => l.id === levelId);
    if (!level) return { completed: 0, total: 0 };
    const completed = level.lessons.filter((l) => this.isCompleted(l.id)).length;
    return { completed, total: level.lessons.length };
  },

  /** The recommended next lesson to surface as "today's mission". */
  getNextLesson(): Lesson | undefined {
    for (const level of CURRICULUM) {
      if (!this.isLevelUnlocked(level.id)) continue;
      const next = level.lessons.find((l) => !this.isCompleted(l.id));
      if (next) return next;
    }
    return undefined;
  },
};
