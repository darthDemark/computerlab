"use client";

import { useMemo, useState } from "react";
import { useClientData, Tag } from "@/components/ui";
import { CHALLENGES } from "@/lib/data/challenges";
import { challengeService } from "@/lib/services/challengeService";
import { IconCheck, IconBolt } from "@/components/icons";
import type { Challenge, TestRun } from "@/lib/types";

const DIFF_TONE: Record<Challenge["difficulty"], "success" | "warning" | "error"> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
};

export default function BuildPage() {
  const [selectedId, setSelectedId] = useState<string>(CHALLENGES[0].id);
  const challenge = useMemo(
    () => CHALLENGES.find((c) => c.id === selectedId) ?? CHALLENGES[0],
    [selectedId],
  );

  const [solvedIds, refreshSolved] = useClientData<string[]>(
    () => Array.from(new Set(challengeService.getAttempts().filter((a) => a.success).map((a) => a.challengeId))),
    [],
  );

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5 md:px-8"
        style={{ borderColor: "var(--line)" }}
      >
        <div>
          <div className="t-meta" style={{ color: "var(--color-cyan)" }}>
            Build · Challenge Mode
          </div>
          <h1 className="t-page-title mt-0.5" style={{ color: "var(--color-text)" }}>
            {challenge.title}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Tag tone={DIFF_TONE[challenge.difficulty]}>{challenge.difficulty}</Tag>
          <Tag>{solvedIds.length}/{CHALLENGES.length} solved</Tag>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px lg:grid-cols-[260px_minmax(0,1fr)_320px]" style={{ background: "var(--line)" }}>
        {/* Prompt + selector */}
        <aside style={{ background: "var(--color-bg2)" }} className="max-h-[calc(100vh-160px)] overflow-y-auto">
          <div className="panel-header">
            <span className="t-panel-heading">Prompt</span>
          </div>
          <div className="p-4">
            <p className="t-secondary" style={{ color: "var(--color-text)" }}>
              {challenge.prompt}
            </p>
            <div className="t-panel-heading mt-5 mb-2" style={{ color: "var(--color-cyan)" }}>
              Rules
            </div>
            <ul className="space-y-1.5">
              {challenge.rules.map((r, i) => (
                <li key={i} className="t-secondary flex gap-2" style={{ color: "var(--color-text2)" }}>
                  <span style={{ color: "var(--color-cyan)" }}>›</span>
                  {r}
                </li>
              ))}
            </ul>

            <div className="t-panel-heading mt-6 mb-2" style={{ color: "var(--color-muted)" }}>
              All Challenges
            </div>
            <div className="space-y-1">
              {CHALLENGES.map((c) => {
                const active = c.id === challenge.id;
                const solved = solvedIds.includes(c.id);
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className="flex w-full items-center gap-2.5 rounded px-2.5 py-2 text-left transition-colors"
                    style={{
                      background: active ? "rgba(0,229,255,0.06)" : "transparent",
                      border: active ? "1px solid var(--line)" : "1px solid transparent",
                    }}
                  >
                    <span style={{ color: solved ? "var(--color-success)" : "var(--color-muted)", flexShrink: 0 }}>
                      {solved ? <IconCheck width={13} height={13} /> : <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 99, background: "var(--color-muted)" }} />}
                    </span>
                    <span className="t-secondary truncate" style={{ color: active ? "var(--color-cyan)" : "var(--color-text2)" }}>
                      {c.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Code input + results — keyed so state resets per challenge */}
        <ChallengeWorkspace key={challenge.id} challenge={challenge} onSolved={refreshSolved} />
      </div>
    </div>
  );
}

function ChallengeWorkspace({
  challenge,
  onSolved,
}: {
  challenge: Challenge;
  onSolved: () => void;
}) {
  const [code, setCode] = useState<string>(challenge.starterCode);
  const [runs, setRuns] = useState<TestRun[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const run = (persist: boolean) => {
    const result = challengeService.runTests(challenge, code);
    if (result.error) {
      setError(result.error);
      setRuns([]);
      return;
    }
    setError(null);
    setRuns(result.runs);
    if (persist) {
      challengeService.recordAttempt(challenge, code, result.runs);
      onSolved();
      setSubmitted(true);
    }
  };

  const passedCount = runs?.filter((r) => r.passed).length ?? 0;
  const total = runs?.length ?? 0;
  const allPassed = total > 0 && passedCount === total;

  return (
    <>
      {/* Code input */}
      <section style={{ background: "var(--color-panel)" }} className="flex min-w-0 flex-col">
        <div className="panel-header">
          <span className="t-panel-heading">Code Input</span>
          <span className="t-meta" style={{ color: "var(--color-muted)" }}>
            fn {challenge.functionName}()
          </span>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <textarea
            className="textarea flex-1"
            spellCheck={false}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ minHeight: 320, height: "calc(100vh - 320px)" }}
          />
          <div className="mt-3 flex flex-wrap gap-2.5">
            <button className="btn btn-secondary" onClick={() => run(false)}>
              <IconBolt width={14} height={14} /> Run Tests
            </button>
            <button className="btn btn-primary" onClick={() => run(true)}>
              Submit Challenge
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setCode(challenge.starterCode);
                setRuns(null);
                setError(null);
                setSubmitted(false);
              }}
              style={{ marginLeft: "auto" }}
            >
              Reset
            </button>
          </div>
        </div>
      </section>

      {/* Test results */}
      <aside style={{ background: "var(--color-bg2)" }} className="max-h-[calc(100vh-160px)] overflow-y-auto">
        <div className="panel-header">
          <span className="t-panel-heading">Test Results</span>
          {runs && (
            <span
              className="t-meta"
              style={{ color: allPassed ? "var(--color-success)" : "var(--color-warning)" }}
            >
              {passedCount}/{total} pass
            </span>
          )}
        </div>
        <div className="p-4">
          {error && (
            <div
              className="t-code mb-3 rounded p-3"
              style={{ background: "rgba(255,90,90,0.08)", border: "1px solid var(--color-error)", color: "var(--color-error)", fontSize: 12, whiteSpace: "pre-wrap" }}
            >
              {error}
            </div>
          )}

          {!runs && !error && (
            <div className="t-secondary" style={{ color: "var(--color-muted)" }}>
              Run the tests to validate your solution against the simulated suite.
            </div>
          )}

          {runs && runs.length > 0 && (
            <div className="space-y-2">
              {runs.map((r, i) => (
                <div
                  key={i}
                  className="rounded p-3"
                  style={{
                    background: "var(--color-panel)",
                    border: `1px solid ${r.passed ? "rgba(0,255,178,0.4)" : "rgba(255,90,90,0.4)"}`,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="t-meta"
                      style={{ color: r.passed ? "var(--color-success)" : "var(--color-error)", fontWeight: 700 }}
                    >
                      {r.passed ? "PASS" : "FAIL"}
                    </span>
                    <span className="t-code" style={{ fontSize: 12, color: "var(--color-text)" }}>
                      {r.description}
                    </span>
                  </div>
                  {!r.passed && (
                    <div className="t-code mt-2" style={{ fontSize: 11.5, color: "var(--color-text2)" }}>
                      <div>expected: <span style={{ color: "var(--color-success)" }}>{r.expected}</span></div>
                      <div>received: <span style={{ color: "var(--color-error)" }}>{r.received}</span></div>
                    </div>
                  )}
                </div>
              ))}

              {submitted && (
                <div
                  className="mt-3 rounded p-3 text-center fade-in"
                  style={{
                    background: allPassed ? "rgba(0,255,178,0.08)" : "rgba(255,209,102,0.08)",
                    border: `1px solid ${allPassed ? "var(--color-success)" : "var(--color-warning)"}`,
                  }}
                >
                  <span
                    className="t-meta"
                    style={{ color: allPassed ? "var(--color-success)" : "var(--color-warning)", fontWeight: 700 }}
                  >
                    {allPassed ? "Challenge solved · attempt recorded" : "Attempt recorded · keep iterating"}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
