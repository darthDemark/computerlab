"use client";

import Link from "next/link";
import { PageHeader, ProgressBar, useClientData } from "@/components/ui";
import { lessonService } from "@/lib/services/lessonService";
import { CURRICULUM } from "@/lib/data/curriculum";
import { IconCheck, IconLock, IconArrowRight } from "@/components/icons";
import type { LessonStatus } from "@/lib/types";

interface LevelView {
  id: number;
  code: string;
  title: string;
  description: string;
  unlocked: boolean;
  completed: number;
  total: number;
  lessons: { id: string; title: string; status: LessonStatus; summary: string }[];
}

export default function CurriculumPage() {
  const [levels] = useClientData<LevelView[]>(
    () =>
      CURRICULUM.map((level) => {
        const prog = lessonService.getLevelProgress(level.id);
        return {
          id: level.id,
          code: level.code,
          title: level.title,
          description: level.description,
          unlocked: lessonService.isLevelUnlocked(level.id),
          completed: prog.completed,
          total: prog.total,
          lessons: level.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            summary: l.summary,
            status: lessonService.getStatus(l.id),
          })),
        };
      }),
    CURRICULUM.map((level) => ({
      id: level.id,
      code: level.code,
      title: level.title,
      description: level.description,
      unlocked: level.id <= 1,
      completed: 0,
      total: level.lessons.length,
      lessons: level.lessons.map((l) => ({
        id: l.id,
        title: l.title,
        summary: l.summary,
        status: (level.id <= 1 ? "active" : "locked") as LessonStatus,
      })),
    })),
  );

  return (
    <div>
      <PageHeader
        kicker="Curriculum Map"
        title="Mastery Track · Levels 0–8"
        subtitle="A structured progression from computer literacy to original research. Complete a level to unlock the next."
      />
      <div className="px-5 py-5 md:px-8 md:py-6">
        <div className="space-y-4">
          {levels.map((level) => (
            <div
              key={level.id}
              className="panel overflow-hidden"
              style={{
                borderRadius: 6,
                opacity: level.unlocked ? 1 : 0.66,
                borderColor:
                  level.completed === level.total && level.total > 0
                    ? "rgba(0,255,178,0.4)"
                    : "var(--line)",
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
                  <div className="flex items-center gap-2.5">
                    <h2 className="t-card-title" style={{ color: "var(--color-text)" }}>
                      {level.title}
                    </h2>
                    {!level.unlocked && (
                      <IconLock width={13} height={13} style={{ color: "var(--color-muted)" }} />
                    )}
                    {level.completed === level.total && level.total > 0 && (
                      <span className="t-meta" style={{ color: "var(--color-success)" }}>
                        Complete
                      </span>
                    )}
                  </div>
                  <p className="t-secondary mt-0.5" style={{ color: "var(--color-text2)" }}>
                    {level.description}
                  </p>
                </div>
                <div style={{ width: 160 }} className="hidden sm:block">
                  <div className="mb-1.5 flex justify-between">
                    <span className="t-meta" style={{ color: "var(--color-muted)" }}>
                      Progress
                    </span>
                    <span className="t-code" style={{ fontSize: 11, color: "var(--color-text2)" }}>
                      {level.completed}/{level.total}
                    </span>
                  </div>
                  <ProgressBar value={level.total ? level.completed / level.total : 0} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3" style={{ background: "var(--line)" }}>
                {level.lessons.map((lesson) => {
                  const locked = lesson.status === "locked";
                  const completed = lesson.status === "completed";
                  const body = (
                    <div
                      className="flex h-full items-start gap-3 p-4 transition-colors"
                      style={{
                        background: "var(--color-panel)",
                        cursor: locked ? "not-allowed" : "pointer",
                      }}
                    >
                      <span
                        className="grid place-items-center mt-0.5"
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          flexShrink: 0,
                          border: `1px solid ${
                            completed
                              ? "var(--color-success)"
                              : locked
                                ? "var(--line)"
                                : "var(--color-cyan)"
                          }`,
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
                          className="t-secondary"
                          style={{
                            fontWeight: 600,
                            color: locked ? "var(--color-muted)" : "var(--color-text)",
                          }}
                        >
                          {lesson.title}
                        </div>
                        <div className="t-meta mt-1" style={{ color: "var(--color-muted)" }}>
                          {completed ? "Completed" : locked ? "Locked" : "Available"}
                        </div>
                      </div>
                    </div>
                  );
                  return locked ? (
                    <div key={lesson.id}>{body}</div>
                  ) : (
                    <Link key={lesson.id} href={`/learn?lesson=${lesson.id}`}>
                      {body}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex justify-center">
          <Link href="/learn" className="btn btn-secondary">
            Open Lesson Viewer <IconArrowRight width={14} height={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
