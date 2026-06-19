"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Markdown } from "@/components/Markdown";
import { useClientData } from "@/components/ui";
import { LevelQuiz } from "@/components/LevelQuiz";
import { CURRICULUM, getLessonById } from "@/lib/data/curriculum";
import { lessonService } from "@/lib/services/lessonService";
import { journalService } from "@/lib/services/journalService";
import { quizService } from "@/lib/services/quizService";
import { IconCheck, IconLock, IconArrowRight } from "@/components/icons";
import type { Lesson, LessonSections } from "@/lib/types";

const SECTION_META: { key: keyof LessonSections; label: string; tone: string }[] = [
  { key: "beginner", label: "Beginner Explanation", tone: "var(--color-cyansoft)" },
  { key: "technical", label: "Technical Explanation", tone: "var(--color-cyan)" },
  { key: "realWorld", label: "Real-World Use Case", tone: "var(--color-success)" },
  { key: "projectConnection", label: "Project Connection", tone: "var(--color-warning)" },
];

function SevenPart({ sections }: { sections: LessonSections }) {
  return (
    <div className="space-y-5">
      {SECTION_META.map(({ key, label, tone }) => (
        <section key={key}>
          <div className="t-panel-heading mb-2" style={{ color: tone }}>
            {label}
          </div>
          <Markdown content={sections[key] as string} />
        </section>
      ))}

      <section>
        <div className="t-panel-heading mb-2" style={{ color: "var(--color-cyan)" }}>
          JavaScript Example
        </div>
        <pre
          className="t-code overflow-x-auto rounded p-4"
          style={{ background: "var(--color-bg2)", border: "1px solid var(--line)", color: "var(--color-text)", fontSize: 12.5, lineHeight: 1.6 }}
        >
          {sections.jsExample}
        </pre>
      </section>

      <section>
        <div className="t-panel-heading mb-2" style={{ color: "var(--color-error)" }}>
          Common Mistakes
        </div>
        <ul className="space-y-1.5">
          {sections.commonMistakes.map((m, i) => (
            <li key={i} className="t-secondary flex gap-2.5" style={{ color: "var(--color-text)" }}>
              <span style={{ color: "var(--color-error)" }}>›</span>
              {m}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel-2 p-4" style={{ borderRadius: 6 }}>
        <div className="t-panel-heading mb-2" style={{ color: "var(--color-cyan)" }}>
          Practice Challenge
        </div>
        <p className="t-secondary" style={{ color: "var(--color-text)" }}>
          {sections.practiceChallenge}
        </p>
        <Link href="/build" className="btn btn-secondary btn-sm mt-3">
          Open Challenge Mode
        </Link>
      </section>
    </div>
  );
}

function LessonViewer() {
  const router = useRouter();
  const params = useSearchParams();
  const requestedId = params.get("lesson");

  const flatLessons = useMemo(() => CURRICULUM.flatMap((l) => l.lessons), []);

  const [completed, refreshCompleted] = useClientData<string[]>(
    () => lessonService.getCompleted(),
    [],
  );
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizPassedTick, setQuizPassedTick] = useState(0);

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

  // mastery recomputed when completion or quiz state changes
  void completed;
  void quizPassedTick;
  const mastery = lessonService.getLevelMastery(activeLesson.levelId);
  const quizPassed = quizService.isPassed(activeLesson.levelId);

  const handleComplete = () => {
    lessonService.complete(activeLesson.id);
    refreshCompleted();
  };

  const goNext = () => {
    if (nextLesson) router.push(`/learn?lesson=${nextLesson.id}`);
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
                          cursor: "pointer",
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
                    return (
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
            <div className="mb-4 flex flex-wrap items-center gap-2">
              {activeLesson.sections && (
                <span className="tag" style={{ color: "var(--color-cyansoft)", borderColor: "var(--line)" }}>
                  Deep Dive · 7-Part
                </span>
              )}
              {activeLesson.complexity && (
                <span className="tag t-code" style={{ color: "var(--color-warning)", borderColor: "var(--line)", textTransform: "none", letterSpacing: 0 }}>
                  {activeLesson.complexity}
                </span>
              )}
            </div>

            <p className="t-secondary mb-5" style={{ color: "var(--color-text2)" }}>
              {activeLesson.summary}
            </p>

            <Markdown content={activeLesson.body} />

            {activeLesson.sections && (
              <div className="mt-6">
                <SevenPart sections={activeLesson.sections} />
              </div>
            )}

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
                disabled={!nextLesson}
              >
                Next Lesson <IconArrowRight width={14} height={14} />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setQuizOpen(true)}
                style={{ marginLeft: "auto" }}
              >
                {quizPassed ? "Quiz Passed ✓" : "Level Quiz"}
              </button>
              <Link href="/ai-tutor" className="btn btn-secondary">
                Ask ARCHITECT
              </Link>
            </div>

            {/* Mastery checkpoint status for this level */}
            <div className="mt-4 panel-2 p-4" style={{ borderRadius: 6 }}>
              <div className="t-panel-heading mb-3" style={{ color: "var(--color-cyan)" }}>
                Level {activeLesson.levelId} Mastery Checkpoint
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <MasteryItem
                  done={mastery.lessonsComplete}
                  label={`Lessons ${mastery.lessonsDone}/${mastery.lessonsTotal}`}
                />
                <MasteryItem done={mastery.quizPassed} label="Quiz passed" />
                <MasteryItem done={mastery.challengeSolved} label="Challenge solved" />
              </div>
              {mastery.mastered && (
                <div className="t-meta mt-3" style={{ color: "var(--color-success)" }}>
                  ✓ Level mastered — checkpoint cleared
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Notes — keyed by lesson so state resets cleanly per lesson */}
        <NotesPanel key={activeLesson.id} lessonId={activeLesson.id} />
      </div>

      {quizOpen && (
        <LevelQuiz
          levelId={activeLesson.levelId}
          onClose={() => setQuizOpen(false)}
          onComplete={() => setQuizPassedTick((t) => t + 1)}
        />
      )}
    </div>
  );
}

function MasteryItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="grid place-items-center"
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          flexShrink: 0,
          border: `1px solid ${done ? "var(--color-success)" : "var(--line)"}`,
          background: done ? "var(--color-success)" : "transparent",
          color: "#03060a",
        }}
      >
        {done && <IconCheck width={10} height={10} />}
      </span>
      <span className="t-secondary" style={{ color: done ? "var(--color-text)" : "var(--color-text2)" }}>
        {label}
      </span>
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
