"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { useClientData } from "@/components/ui";
import { CURRICULUM, getLessonById } from "@/lib/data/curriculum";
import { lessonService } from "@/lib/services/lessonService";
import { journalService } from "@/lib/services/journalService";
import { IconCheck, IconLock, IconArrowRight } from "@/components/icons";
import type { Lesson } from "@/lib/types";

function LessonViewer() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedId = params.get("lesson");

  const flatLessons = useMemo(() => CURRICULUM.flatMap((l) => l.lessons), []);

  const [completed, refreshCompleted] = useClientData<string[]>(
    () => lessonService.getCompleted(),
    [],
  );

  const activeLesson: Lesson | undefined = useMemo(() => {
    if (requestedId) return getLessonById(requestedId);
    return lessonService.getNextLesson() ?? flatLessons[0];
    // `completed` is included intentionally: the recommended next lesson is
    // derived from completion state read inside lessonService.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedId, flatLessons, completed]);

  if (!activeLesson) {
    return <div className="p-8 t-secondary">Lesson not found.</div>;
  }

  const isDone = completed.includes(activeLesson.id);
  const idx = flatLessons.findIndex((l) => l.id === activeLesson.id);
  const nextLesson = flatLessons[idx + 1];
  const nextUnlocked = nextLesson ? lessonService.isLevelUnlocked(nextLesson.levelId) : false;

  const handleComplete = () => {
    lessonService.complete(activeLesson.id);
    refreshCompleted();
  };

  const goNext = () => {
    if (nextLesson && nextUnlocked) router.push(`/learn?lesson=${nextLesson.id}`);
  };

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5 md:px-8"
        style={{ borderColor: "var(--line)" }}
      >
        <div>
          <div className="t-meta" style={{ color: "var(--color-cyan)" }}>
            Lesson Viewer · Level {activeLesson.levelId}
          </div>
          <h1 className="t-page-title mt-0.5" style={{ color: "var(--color-text)" }}>
            {activeLesson.title}
          </h1>
        </div>
        <span className="t-meta" style={{ color: "var(--color-muted)" }}>
          {activeLesson.estMinutes} min · {idx + 1}/{flatLessons.length}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px lg:grid-cols-[240px_minmax(0,1fr)_300px]" style={{ background: "var(--line)" }}>
        {/* Modules */}
        <aside style={{ background: "var(--color-bg2)" }} className="max-h-[calc(100vh-160px)] overflow-y-auto">
          <div className="panel-header" style={{ position: "sticky", top: 0, background: "var(--color-bg2)", zIndex: 1 }}>
            <span className="t-panel-heading">Modules</span>
          </div>
          <div className="p-2">
            {CURRICULUM.map((level) => {
              const unlocked = lessonService.isLevelUnlocked(level.id);
              return (
                <div key={level.id} className="mb-2">
                  <div className="t-meta px-2 py-1.5" style={{ color: "var(--color-muted)" }}>
                    {level.code} · {level.title}
                  </div>
                  {level.lessons.map((lesson) => {
                    const active = lesson.id === activeLesson.id;
                    const done = completed.includes(lesson.id);
                    const locked = !unlocked && !done;
                    const inner = (
                      <div
                        className="flex items-center gap-2.5 rounded px-2 py-2 transition-colors"
                        style={{
                          background: active ? "rgba(0,229,255,0.06)" : "transparent",
                          border: active ? "1px solid var(--line)" : "1px solid transparent",
                          cursor: locked ? "not-allowed" : "pointer",
                        }}
                      >
                        <span style={{ flexShrink: 0, color: done ? "var(--color-success)" : locked ? "var(--color-muted)" : "var(--color-cyan)" }}>
                          {done ? (
                            <IconCheck width={13} height={13} />
                          ) : locked ? (
                            <IconLock width={12} height={12} />
                          ) : (
                            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 99, background: active ? "var(--color-cyan)" : "var(--color-muted)" }} />
                          )}
                        </span>
                        <span
                          className="t-secondary truncate"
                          style={{
                            color: active ? "var(--color-cyan)" : locked ? "var(--color-muted)" : "var(--color-text2)",
                            fontWeight: active ? 600 : 400,
                          }}
                        >
                          {lesson.title}
                        </span>
                      </div>
                    );
                    return locked ? (
                      <div key={lesson.id}>{inner}</div>
                    ) : (
                      <Link key={lesson.id} href={`/learn?lesson=${lesson.id}`}>
                        {inner}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <section style={{ background: "var(--color-panel)" }} className="min-w-0">
          <div className="panel-header">
            <span className="t-panel-heading">Content</span>
            {isDone && (
              <span className="t-meta" style={{ color: "var(--color-success)" }}>
                Completed
              </span>
            )}
          </div>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-5 md:p-7">
            <p className="t-secondary mb-5" style={{ color: "var(--color-text2)" }}>
              {activeLesson.summary}
            </p>

            <Markdown content={activeLesson.body} />

            {activeLesson.diagram && (
              <div className="mt-5">
                <div className="t-panel-heading mb-2" style={{ color: "var(--color-cyan)" }}>
                  Diagram
                </div>
                <pre
                  className="t-code overflow-x-auto rounded p-4"
                  style={{ background: "var(--color-bg2)", border: "1px solid var(--line)", color: "var(--color-cyansoft)", fontSize: 12.5, lineHeight: 1.5 }}
                >
                  {activeLesson.diagram}
                </pre>
              </div>
            )}

            {activeLesson.keyPoints && activeLesson.keyPoints.length > 0 && (
              <div className="mt-6 panel-2 p-4" style={{ borderRadius: 6 }}>
                <div className="t-panel-heading mb-2.5" style={{ color: "var(--color-cyan)" }}>
                  Key Takeaways
                </div>
                <ul className="space-y-1.5">
                  {activeLesson.keyPoints.map((kp, i) => (
                    <li key={i} className="t-secondary flex gap-2.5" style={{ color: "var(--color-text)" }}>
                      <span style={{ color: "var(--color-cyan)" }}>›</span>
                      {kp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-2.5 border-t pt-5" style={{ borderColor: "var(--line)" }}>
              {isDone ? (
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    lessonService.uncomplete(activeLesson.id);
                    refreshCompleted();
                  }}
                >
                  Mark Incomplete
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleComplete}>
                  <IconCheck width={14} height={14} /> Complete Lesson
                </button>
              )}
              <button
                className="btn btn-secondary"
                onClick={goNext}
                disabled={!nextLesson || !nextUnlocked}
              >
                Next Lesson <IconArrowRight width={14} height={14} />
              </button>
              <Link href="/ai-tutor" className="btn btn-secondary" style={{ marginLeft: "auto" }}>
                Ask ARCHITECT
              </Link>
            </div>
          </div>
        </section>

        {/* Notes — keyed by lesson so state resets cleanly per lesson */}
        <NotesPanel key={activeLesson.id} lessonId={activeLesson.id} />
      </div>
    </div>
  );
}

function NotesPanel({ lessonId }: { lessonId: string }) {
  const [note, setNote] = useState<string>(() => journalService.getNote(lessonId));
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onNoteChange = (value: string) => {
    setNote(value);
    setSaveState("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      journalService.saveNote(lessonId, value);
      setSaveState("saved");
    }, 500);
  };

  return (
    <aside style={{ background: "var(--color-bg2)" }} className="flex flex-col">
      <div className="panel-header">
        <span className="t-panel-heading">Notes</span>
        <span
          className="t-meta"
          style={{ color: saveState === "saved" ? "var(--color-success)" : "var(--color-muted)" }}
        >
          {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : "Autosave"}
        </span>
      </div>
      <div className="flex-1 p-4">
        <textarea
          className="textarea h-full min-h-[300px]"
          placeholder="Capture insights, questions, and code snippets. Notes autosave locally and persist per lesson."
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
          style={{ height: "calc(100vh - 280px)" }}
        />
      </div>
    </aside>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="p-8 t-secondary">Loading lesson…</div>}>
      <LessonViewer />
    </Suspense>
  );
}
