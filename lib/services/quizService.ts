import type { Quiz, QuizResult } from "@/lib/types";
import { QUIZZES, getQuizForLevel } from "@/lib/data/quizzes";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";
import { progressService } from "./progressService";

type ResultMap = Record<number, QuizResult>;

const QUIZ_XP = 80;

export const quizService = {
  getQuiz(levelId: number): Quiz | undefined {
    return getQuizForLevel(levelId);
  },

  getAllResults(): ResultMap {
    return readJSON<ResultMap>(STORAGE_KEYS.quizzes, {});
  },

  getResult(levelId: number): QuizResult | undefined {
    return this.getAllResults()[levelId];
  },

  isPassed(levelId: number): boolean {
    return this.getResult(levelId)?.passed ?? false;
  },

  /** Grade a set of answers (index per question) and persist the best result. */
  submit(quiz: Quiz, answers: number[]): QuizResult {
    const correct = quiz.questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
      0,
    );
    const total = quiz.questions.length;
    const passed = correct / total >= quiz.passThreshold;

    const result: QuizResult = {
      levelId: quiz.levelId,
      score: correct,
      total,
      passed,
      timestamp: Date.now(),
    };

    const all = this.getAllResults();
    const prev = all[quiz.levelId];
    const firstPass = passed && !(prev?.passed);
    // Keep the best score on record.
    if (!prev || correct >= prev.score) {
      all[quiz.levelId] = result;
      writeJSON(STORAGE_KEYS.quizzes, all);
    }

    if (firstPass) {
      progressService.addXP(QUIZ_XP);
      progressService.touchStreak();
      progressService.pushFeed("quiz", `Quiz passed — Level ${quiz.levelId} (${correct}/${total})`);
    } else {
      progressService.pushFeed("quiz", `Quiz attempted — Level ${quiz.levelId} (${correct}/${total})`);
    }

    return result;
  },

  passedCount(): number {
    return Object.values(this.getAllResults()).filter((r) => r.passed).length;
  },

  totalQuizzes(): number {
    return QUIZZES.length;
  },
};
