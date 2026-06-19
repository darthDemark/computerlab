import { ALL_LESSONS, CURRICULUM, getLessonById } from "@/lib/data/curriculum";
import { CHALLENGES } from "@/lib/data/challenges";
import { QUIZZES } from "@/lib/data/quizzes";
import type { Lesson, Level, LessonStatus, LevelMastery } from "@/lib/types";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";
import { progressService } from "./progressService";
import { challengeService } from "./challengeService";
import { quizService } from "./quizService";

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

  /**
   * A level's mastery checkpoint is cleared when all lessons are complete, the
   * level quiz is passed, and (if the level has challenges) at least one is
   * solved. Levels without challenges treat the challenge gate as satisfied.
   */
  getLevelMastery(levelId: number): LevelMastery {
    const { completed, total } = this.getLevelProgress(levelId);
    const lessonsComplete = total > 0 && completed === total;

    const hasQuiz = QUIZZES.some((q) => q.levelId === levelId);
    const quizPassed = hasQuiz ? quizService.isPassed(levelId) : true;

    const levelChallenges = CHALLENGES.filter((c) => c.levelId === levelId);
    const solved = new Set(
      challengeService.getAttempts().filter((a) => a.success).map((a) => a.challengeId),
    );
    const challengeSolved =
      levelChallenges.length === 0 || levelChallenges.some((c) => solved.has(c.id));

    return {
      levelId,
      lessonsComplete,
      lessonsDone: completed,
      lessonsTotal: total,
      quizPassed,
      challengeSolved,
      mastered: lessonsComplete && quizPassed && challengeSolved,
    };
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
