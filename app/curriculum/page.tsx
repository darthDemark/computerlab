"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, ProgressBar, useClientData } from "@/components/ui";
import { LevelQuiz } from "@/components/LevelQuiz";
import { lessonService } from "@/lib/services/lessonService";
import { quizService } from "@/lib/services/quizService";
import { CURRICULUM } from "@/lib/data/curriculum";
import { CHALLENGES } from "@/lib/data/challenges";
import { IconCheck, IconLock, IconArrowRight, IconBolt } from "@/components/icons";
import type { LessonStatus } from "@/lib/types";

interface LevelView {
  id: number;
  code: string;
  title: string;
  description: string;
  outcome: string;
  unlocked: boolean;
  completed: number;
  total: number;
  deepCount: number;
  challengeCount: number;
  quizPassed: boolean;
  mastered: boolean;
  lessons: { id: string; title: string; status: LessonStatus; deep: boolean }[];
}

function buildView(): LevelView[] {
  return CURRICULUM.map((level) => {
    const prog = lessonService.getLevelProgress(level.id);
    const mastery = lessonService.getLevelMastery(level.id);
    return {
      id: level.id,
      code: level.code,
      title: level.title,
      description: level.description,
      outcome: level.outcome,
      unlocked: lessonService.isLevelUnlocked(level.id),
      completed: prog.completed,
      total: prog.total,
      deepCount: level.lessons.filter((l) => l.sections).length,
      challengeCount: CHALLENGES.filter((c) => c.levelId === level.id).length,
      quizPassed: quizService.isPassed(level.id),
      mastered: mastery.mastered,
      lessons: level.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        deep: Boolean(l.sections),
        status: lessonService.getStatus(l.id),
      })),
    };
  });
}

function fallbackView(): LevelView[] {
  return CURRICULUM.map((level) => ({
    id: level.id,
    code: level.code,
    title: level.title,
    description: level.description,
    outcome: level.outcome,
    unlocked: level.id <= 1,
    completed: 0,
    total: level.lessons.length,
    deepCount: level.lessons.filter((l) => l.sections).length,
    challengeCount: CHALLENGES.filter((c) => c.levelId === level.id).length,
    quizPassed: false,
    mastered: false,
    lessons: level.lessons.map((l) => ({
      id: l.id,
      title: l.title,
      deep: Boolean(l.sections),
      status: (level.id <= 1 ? "active" : "locked") as LessonStatus,
    })),
  }));
}

export default function CurriculumPage() {
  const [levels] = useClientData<LevelView[]>(buildView, fallbackView());
  const [quizLevel, setQuizLevel] = useState<number | null>(null);

  const totalLessons = levels.reduce((a, l) => a + l.total, 0);
  const totalDeep = levels.reduce((a, l) => a + l.deepCount, 0);

  return (
    <div>
      <PageHeader
        kicker="Curriculum Map"
        title="Mastery Track · Levels 0–9"
        subtitle="The full path from computer literacy to original research. Big O, Data Structures, Algorithms, Advanced Systems, and Research are all on the map from day one — explore any level, even locked ones."
      />
      <div className="px-5 py-5 md:px-8 md:py-6">
        {/* Track overview */}
        <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Overview label="Levels" value="10" />
          <Overview label="Modules" value={String(totalLessons)} />
          <Overview label="Deep Dives" value={String(totalDeep)} />
          <Overview label="Quizzes" value={String(quizService.totalQuizzes())} />
        </div>

        <div className="space-y-4">
          {levels.map((level) => (
            <div
              key={level.id}
              className="panel overflow-hidden"
              style={{
                borderRadius: 6,
                opacity: level.unlocked ? 1 : 0.82,
                borderColor: level.mastered ? "rgba(0,255,178,0.45)" : "var(--line)",
              }}
            >
              <div
                className="flex flex-wrap items-center gap-4 border-b px-4 py-3.5 md:px-5"
                style={{ borderColor: "var(--line)", background: "var(--color-bg2)" }}
              >
                <div
                  className="grid place-items-center t-code"
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 6,
                    border: "1px solid var(--line)",
                    color: level.unlocked ? "var(--color-cyan)" : "var(--color-muted)",
                    fontWeight: 700,
                    fontSize: 15,
                    flexShrink: 0,
                  }}
                >
                  {level.code}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h2 className="t-card-title" style={{ color: "var(--color-text)" }}>
                      {level.title}
                    </h2>
                    {!level.unlocked && <IconLock width={13} height={13} style={{ color: "var(--color-muted)" }} />}
                    {level.mastered && (
                      <span className="t-meta" style={{ color: "var(--color-success)" }}>
                        Mastered
                      </span>
                    )}
                    {level.deepCount > 0 && (
                      <span className="tag" style={{ color: "var(--color-cyansoft)", borderColor: "var(--line)" }}>
                        {level.deepCount} deep dive{level.deepCount > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <p className="t-secondary mt-0.5" style={{ color: "var(--color-text2)" }}>
                    {level.description}
                  </p>
                  <p className="t-meta mt-1" style={{ color: "var(--color-muted)" }}>
                    Outcome: {level.outcome}
                  </p>
                </div>
                <div style={{ width: 170 }} className="hidden sm:block">
                  <div className="mb-1.5 flex justify-between">
                    <span className="t-meta" style={{ color: "var(--color-muted)" }}>
                      Progress
                    </span>
                    <span className="t-code" style={{ fontSize: 11, color: "var(--color-text2)" }}>
                      {level.completed}/{level.total}
                    </span>
                  </div>
                  <ProgressBar value={level.total ? level.completed / level.total : 0} />
                  <div className="mt-2.5 flex items-center justify-between">
                    <span className="t-meta" style={{ color: "var(--color-muted)" }}>
                      Checkpoint
                    </span>
                    <button
                      className="t-meta"
                      style={{ color: level.quizPassed ? "var(--color-success)" : "var(--color-cyan)" }}
                      onClick={() => setQuizLevel(level.id)}
                    >
                      {level.quizPassed ? "Quiz ✓" : "Take Quiz"}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--line)" }}>
                {level.lessons.map((lesson) => {
                  const completed = lesson.status === "completed";
                  const locked = lesson.status === "locked";
                  return (
                    <Link key={lesson.id} href={`/learn?lesson=${lesson.id}`}>
                      <div
                        className="flex h-full items-start gap-3 p-4 transition-colors"
                        style={{ background: "var(--color-panel)", cursor: "pointer" }}
                      >
                        <span
                          className="grid place-items-center mt-0.5"
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 4,
                            flexShrink: 0,
                            border: `1px solid ${completed ? "var(--color-success)" : locked ? "var(--line)" : "var(--color-cyan)"}`,
                            background: completed ? "var(--color-success)" : "transparent",
                            color: completed ? "#03060a" : "var(--color-cyan)",
                          }}
                        >
                          {completed ? (
                            <IconCheck width={12} height={12} />
                          ) : locked ? (
                            <IconLock width={11} height={11} style={{ color: "var(--color-muted)" }} />
                          ) : null}
                        </span>
                        <div className="min-w-0">
                          <div
                            className="t-secondary flex items-center gap-1.5"
                            style={{ fontWeight: 600, color: locked ? "var(--color-text2)" : "var(--color-text)" }}
                          >
                            {lesson.title}
                            {lesson.deep && (
                              <span title="Deep 7-part lesson" style={{ color: "var(--color-cyansoft)", fontSize: 11 }}>
                                ◆
                              </span>
                            )}
                          </div>
                          <div className="t-meta mt-1" style={{ color: "var(--color-muted)" }}>
                            {completed ? "Completed" : locked ? "Locked · preview" : "Available"}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-center gap-2.5">
          <Link href="/learn" className="btn btn-secondary">
            Open Lesson Viewer <IconArrowRight width={14} height={14} />
          </Link>
          <Link href="/build" className="btn btn-secondary">
            <IconBolt width={14} height={14} /> Challenge Mode
          </Link>
        </div>
      </div>

      {quizLevel !== null && (
        <LevelQuiz levelId={quizLevel} onClose={() => setQuizLevel(null)} />
      )}
    </div>
  );
}

function Overview({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel-2 p-3.5" style={{ borderRadius: 6 }}>
      <div className="t-meta" style={{ color: "var(--color-muted)" }}>
        {label}
      </div>
      <div className="t-code mt-1" style={{ fontSize: 22, fontWeight: 700, color: "var(--color-cyan)", lineHeight: 1 }}>
        {value}
      </div>
    </div>
  );
}
