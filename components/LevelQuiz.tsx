"use client";

import { useState } from "react";
import { quizService } from "@/lib/services/quizService";
import { IconClose, IconCheck } from "@/components/icons";
import type { Quiz, QuizResult } from "@/lib/types";

export function LevelQuiz({
  levelId,
  onClose,
  onComplete,
}: {
  levelId: number;
  onClose: () => void;
  onComplete?: (result: QuizResult) => void;
}) {
  const quiz: Quiz | undefined = quizService.getQuiz(levelId);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);

  if (!quiz) {
    return (
      <Shell onClose={onClose} title={`Level ${levelId} Quiz`}>
        <p className="t-secondary" style={{ color: "var(--color-muted)" }}>
          No quiz is configured for this level yet.
        </p>
      </Shell>
    );
  }

  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);

  const submit = () => {
    const res = quizService.submit(quiz, answers);
    setResult(res);
    onComplete?.(res);
  };

  const reset = () => {
    setAnswers([]);
    setResult(null);
  };

  return (
    <Shell onClose={onClose} title={quiz.title}>
      {result ? (
        <div className="fade-in">
          <div
            className="rounded p-4 text-center"
            style={{
              background: result.passed ? "rgba(0,255,178,0.08)" : "rgba(255,209,102,0.08)",
              border: `1px solid ${result.passed ? "var(--color-success)" : "var(--color-warning)"}`,
            }}
          >
            <div
              className="t-code"
              style={{ fontSize: 30, fontWeight: 700, color: result.passed ? "var(--color-success)" : "var(--color-warning)" }}
            >
              {result.score}/{result.total}
            </div>
            <div
              className="t-meta mt-1"
              style={{ color: result.passed ? "var(--color-success)" : "var(--color-warning)" }}
            >
              {result.passed ? "Checkpoint passed" : `Need ${Math.ceil(quiz.passThreshold * result.total)} to pass`}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {quiz.questions.map((q, i) => {
              const correct = answers[i] === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="panel-2 p-3"
                  style={{ borderRadius: 6, borderColor: correct ? "rgba(0,255,178,0.3)" : "rgba(255,90,90,0.3)" }}
                >
                  <div className="flex items-start gap-2">
                    <span
                      className="t-meta"
                      style={{ color: correct ? "var(--color-success)" : "var(--color-error)", fontWeight: 700, marginTop: 2 }}
                    >
                      {correct ? "✓" : "✗"}
                    </span>
                    <div>
                      <div className="t-secondary" style={{ color: "var(--color-text)" }}>
                        {q.prompt}
                      </div>
                      <div className="t-secondary mt-1" style={{ color: "var(--color-text2)" }}>
                        <span style={{ color: "var(--color-success)" }}>{q.options[q.correctIndex]}</span>
                        {" — "}
                        {q.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex gap-2.5">
            <button className="btn btn-secondary" onClick={reset}>
              Retake
            </button>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="space-y-4">
            {quiz.questions.map((q, i) => (
              <div key={q.id}>
                <div className="t-secondary mb-2" style={{ color: "var(--color-text)", fontWeight: 600 }}>
                  {i + 1}. {q.prompt}
                </div>
                <div className="space-y-1.5">
                  {q.options.map((opt, oi) => {
                    const selected = answers[i] === oi;
                    return (
                      <button
                        key={oi}
                        onClick={() => {
                          const next = [...answers];
                          next[i] = oi;
                          setAnswers(next);
                        }}
                        className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-left transition-colors"
                        style={{
                          background: selected ? "rgba(0,229,255,0.08)" : "var(--color-bg2)",
                          border: `1px solid ${selected ? "var(--color-cyan)" : "var(--line)"}`,
                        }}
                      >
                        <span
                          className="grid place-items-center"
                          style={{
                            width: 16,
                            height: 16,
                            borderRadius: 99,
                            flexShrink: 0,
                            border: `1px solid ${selected ? "var(--color-cyan)" : "var(--color-muted)"}`,
                            background: selected ? "var(--color-cyan)" : "transparent",
                          }}
                        >
                          {selected && <IconCheck width={10} height={10} style={{ color: "#03060a" }} />}
                        </span>
                        <span className="t-secondary" style={{ color: selected ? "var(--color-cyan)" : "var(--color-text2)" }}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex gap-2.5">
            <button className="btn btn-primary" onClick={submit} disabled={!allAnswered}>
              Submit Quiz
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}

function Shell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-start justify-center overflow-y-auto p-4 py-10"
      style={{ background: "rgba(3,6,10,0.78)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="panel w-full max-w-2xl fade-in"
        style={{ borderRadius: 8, borderColor: "var(--color-cyan)", boxShadow: "var(--glow)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <span className="t-panel-heading" style={{ color: "var(--color-cyan)" }}>
            Mastery Checkpoint · {title}
          </span>
          <button onClick={onClose} style={{ color: "var(--color-muted)" }}>
            <IconClose width={16} height={16} />
          </button>
        </div>
        <div className="p-5 md:p-6">{children}</div>
      </div>
    </div>
  );
}
