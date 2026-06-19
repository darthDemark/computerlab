import { CHALLENGES, getChallengeById } from "@/lib/data/challenges";
import type { Challenge, ChallengeAttempt, TestRun } from "@/lib/types";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";
import { progressService } from "./progressService";

const CHALLENGE_XP = 100;

function stringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  return stringify(a) === stringify(b);
}

export const challengeService = {
  getAll(): Challenge[] {
    return CHALLENGES;
  },

  get(id: string): Challenge | undefined {
    return getChallengeById(id);
  },

  /**
   * Run the user's code against a challenge's simulated tests. The code is
   * evaluated in a Function sandbox; the named function is then invoked per
   * test case. Errors are captured and reported as failures.
   */
  runTests(challenge: Challenge, code: string): { runs: TestRun[]; error?: string } {
    let fn: (...args: unknown[]) => unknown;
    try {
      const factory = new Function(
        `"use strict";${code};return typeof ${challenge.functionName} === "function" ? ${challenge.functionName} : undefined;`,
      );
      fn = factory() as (...args: unknown[]) => unknown;
    } catch (e) {
      return { runs: [], error: `Syntax error: ${(e as Error).message}` };
    }

    if (typeof fn !== "function") {
      return {
        runs: [],
        error: `No function named "${challenge.functionName}" was found. Make sure it is declared.`,
      };
    }

    const runs: TestRun[] = challenge.tests.map((test) => {
      try {
        const received = fn(...test.args);
        return {
          description: test.description,
          passed: deepEqual(received, test.expected),
          expected: stringify(test.expected),
          received: stringify(received),
        };
      } catch (e) {
        return {
          description: test.description,
          passed: false,
          expected: stringify(test.expected),
          received: `threw: ${(e as Error).message}`,
        };
      }
    });

    return { runs };
  },

  getAttempts(): ChallengeAttempt[] {
    return readJSON<ChallengeAttempt[]>(STORAGE_KEYS.challenges, []);
  },

  getAttemptsFor(challengeId: string): ChallengeAttempt[] {
    return this.getAttempts().filter((a) => a.challengeId === challengeId);
  },

  recordAttempt(challenge: Challenge, code: string, runs: TestRun[]): ChallengeAttempt {
    const passed = runs.filter((r) => r.passed).length;
    const total = runs.length;
    const success = total > 0 && passed === total;

    const attempt: ChallengeAttempt = {
      challengeId: challenge.id,
      code,
      passed,
      total,
      success,
      timestamp: Date.now(),
    };

    const attempts = this.getAttempts();
    attempts.unshift(attempt);
    writeJSON(STORAGE_KEYS.challenges, attempts.slice(0, 100));

    const alreadySolved = this.getAttemptsFor(challenge.id)
      .slice(1)
      .some((a) => a.success);

    if (success && !alreadySolved) {
      progressService.addXP(CHALLENGE_XP);
      progressService.touchStreak();
      progressService.pushFeed("challenge", `Challenge solved — ${challenge.title}`);
    } else {
      progressService.pushFeed(
        "challenge",
        `Challenge attempted — ${challenge.title} (${passed}/${total})`,
      );
    }

    return attempt;
  },

  attemptCount(): number {
    return this.getAttempts().length;
  },

  solvedCount(): number {
    const solved = new Set(
      this.getAttempts().filter((a) => a.success).map((a) => a.challengeId),
    );
    return solved.size;
  },
};
