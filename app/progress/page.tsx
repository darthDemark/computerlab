"use client";

import { PageHeader, Panel, ProgressBar, Stat, useClientData } from "@/components/ui";
import { lessonService } from "@/lib/services/lessonService";
import { challengeService } from "@/lib/services/challengeService";
import { diagnosticsService } from "@/lib/services/diagnosticsService";
import { progressService } from "@/lib/services/progressService";
import { journalService } from "@/lib/services/journalService";
import { CHALLENGES } from "@/lib/data/challenges";
import { CURRICULUM, ALL_LESSONS } from "@/lib/data/curriculum";
import { clearAll } from "@/lib/services/storage";
import { IconCheck } from "@/components/icons";

interface Snapshot {
  xp: number;
  streak: number;
  lessonsCompleted: number;
  challengesAttempted: number;
  challengesSolved: number;
  diagnostics: number;
  notes: number;
  casesReviewed: number;
  levelProgress: { id: number; title: string; completed: number; total: number }[];
}

function readSnapshot(): Snapshot {
  return {
    xp: progressService.get().xp,
    streak: progressService.get().streak,
    lessonsCompleted: lessonService.completedCount(),
    challengesAttempted: challengeService.attemptCount(),
    challengesSolved: challengeService.solvedCount(),
    diagnostics: diagnosticsService.sessionCount(),
    notes: journalService.countNotes(),
    casesReviewed: diagnosticsService.reviewedCount(),
    levelProgress: CURRICULUM.map((l) => {
      const p = lessonService.getLevelProgress(l.id);
      return { id: l.id, title: l.title, completed: p.completed, total: p.total };
    }),
  };
}

export default function ProgressPage() {
  const [snap, refresh] = useClientData<Snapshot>(readSnapshot, {
    xp: 0,
    streak: 0,
    lessonsCompleted: 0,
    challengesAttempted: 0,
    challengesSolved: 0,
    diagnostics: 0,
    notes: 0,
    casesReviewed: 0,
    levelProgress: CURRICULUM.map((l) => ({ id: l.id, title: l.title, completed: 0, total: l.lessons.length })),
  });

  const level = progressService.level(snap.xp);
  const totalLessons = ALL_LESSONS.length;

  // Mastery = weighted blend of lessons, challenges, and diagnostics activity.
  const mastery = Math.min(
    100,
    Math.round(
      (snap.lessonsCompleted / totalLessons) * 60 +
        (snap.challengesSolved / CHALLENGES.length) * 30 +
        Math.min(snap.diagnostics, 5) * 2,
    ),
  );

  const achievements = [
    { id: "first-lesson", label: "First Steps", desc: "Complete your first lesson", unlocked: snap.lessonsCompleted >= 1 },
    { id: "level0", label: "Computer Literate", desc: "Finish Level 0", unlocked: (snap.levelProgress[0]?.completed ?? 0) === (snap.levelProgress[0]?.total ?? 1) },
    { id: "first-challenge", label: "Code Runner", desc: "Solve a challenge", unlocked: snap.challengesSolved >= 1 },
    { id: "debugger", label: "Field Diagnostician", desc: "Run 3 diagnostics", unlocked: snap.diagnostics >= 3 },
    { id: "streak", label: "Consistent Operator", desc: "Reach a 2-day streak", unlocked: snap.streak >= 2 },
    { id: "scholar", label: "Scholar", desc: "Write notes on 3 lessons", unlocked: snap.notes >= 3 },
  ];

  return (
    <div>
      <PageHeader
        kicker="Progress"
        title="Operator Telemetry"
        subtitle="Your mastery signal across lessons, challenges, diagnostics, and consistency."
        actions={
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (confirm("Reset all CS LAB progress? This clears local data.")) {
                clearAll();
                refresh();
              }
            }}
          >
            Reset Data
          </button>
        }
      />

      <div className="px-5 py-5 md:px-8 md:py-6 space-y-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Mastery Score" value={`${mastery}%`} tone="cyan" />
          <Stat label="Current Level" value={`L${level}`} tone="success" />
          <Stat label="Total XP" value={snap.xp} tone="text" />
          <Stat label="Day Streak" value={`${snap.streak}d`} tone="warning" />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Panel heading="Activity Summary">
            <div className="space-y-3.5">
              <Row label="Lessons completed" value={`${snap.lessonsCompleted} / ${totalLessons}`} ratio={snap.lessonsCompleted / totalLessons} />
              <Row label="Challenges solved" value={`${snap.challengesSolved} / ${CHALLENGES.length}`} ratio={snap.challengesSolved / CHALLENGES.length} />
              <Row label="Challenges attempted" value={`${snap.challengesAttempted}`} ratio={Math.min(1, snap.challengesAttempted / 10)} />
              <Row label="Diagnostics reviewed" value={`${snap.diagnostics}`} ratio={Math.min(1, snap.diagnostics / 10)} />
              <Row label="Cases reviewed" value={`${snap.casesReviewed} / 8`} ratio={snap.casesReviewed / 8} />
              <Row label="Lesson notes" value={`${snap.notes}`} ratio={Math.min(1, snap.notes / 8)} />
            </div>
          </Panel>

          <Panel heading="Mastery by Level">
            <div className="space-y-3">
              {snap.levelProgress.map((lp) => (
                <div key={lp.id}>
                  <div className="mb-1 flex justify-between">
                    <span className="t-secondary" style={{ color: "var(--color-text)" }}>
                      L{lp.id} · {lp.title}
                    </span>
                    <span className="t-code" style={{ fontSize: 11, color: "var(--color-text2)" }}>
                      {lp.completed}/{lp.total}
                    </span>
                  </div>
                  <ProgressBar value={lp.total ? lp.completed / lp.total : 0} />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel heading="Achievements">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className="panel-2 flex items-start gap-3 p-3.5"
                style={{ borderRadius: 6, opacity: a.unlocked ? 1 : 0.5, borderColor: a.unlocked ? "rgba(0,255,178,0.3)" : "var(--line)" }}
              >
                <span
                  className="grid place-items-center"
                  style={{ width: 30, height: 30, borderRadius: 6, flexShrink: 0, border: `1px solid ${a.unlocked ? "var(--color-success)" : "var(--line)"}`, color: a.unlocked ? "var(--color-success)" : "var(--color-muted)" }}
                >
                  <IconCheck width={15} height={15} />
                </span>
                <div>
                  <div className="t-secondary" style={{ color: "var(--color-text)", fontWeight: 600 }}>
                    {a.label}
                  </div>
                  <div className="t-meta mt-0.5" style={{ color: "var(--color-muted)" }}>
                    {a.unlocked ? "Unlocked" : a.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function Row({ label, value, ratio }: { label: string; value: string; ratio: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between">
        <span className="t-secondary" style={{ color: "var(--color-text2)" }}>
          {label}
        </span>
        <span className="t-code" style={{ fontSize: 12, color: "var(--color-text)" }}>
          {value}
        </span>
      </div>
      <ProgressBar value={ratio} />
    </div>
  );
}
