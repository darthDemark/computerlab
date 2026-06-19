"use client";

import Link from "next/link";
import { Panel, ProgressBar, useClientData } from "@/components/ui";
import { lessonService } from "@/lib/services/lessonService";
import { progressService, XP_PER_LEVEL } from "@/lib/services/progressService";
import { challengeService } from "@/lib/services/challengeService";
import { diagnosticsService } from "@/lib/services/diagnosticsService";
import { NAV_ITEMS } from "@/components/nav";
import { IconArrowRight, IconBolt } from "@/components/icons";
import type { FeedEvent } from "@/lib/types";

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

const FEED_COLOR: Record<FeedEvent["type"], string> = {
  lesson: "var(--color-cyan)",
  challenge: "var(--color-success)",
  diagnostic: "var(--color-warning)",
  system: "var(--color-muted)",
};

export default function DashboardPage() {
  const [progress] = useClientData(() => progressService.get(), {
    xp: 0,
    streak: 0,
    lastActiveDay: null,
  });
  const [completedCount] = useClientData(() => lessonService.completedCount(), 0);
  const [attempts] = useClientData(() => challengeService.attemptCount(), 0);
  const [diagCount] = useClientData(() => diagnosticsService.sessionCount(), 0);
  const [feed] = useClientData<FeedEvent[]>(() => progressService.getFeed(), []);
  const [nextLesson] = useClientData(() => lessonService.getNextLesson(), undefined);

  const level = progressService.level(progress.xp);
  const levelProgress = progressService.levelProgress(progress.xp);
  const xpIntoLevel = progress.xp % XP_PER_LEVEL;

  const quickAccess = NAV_ITEMS.filter((n) =>
    ["Learn", "Build", "Diagnostics", "Research", "AI Tutor"].includes(n.label),
  );

  return (
    <div className="px-5 py-5 md:px-8 md:py-6">
      <div className="mb-5">
        <div className="t-meta" style={{ color: "var(--color-cyan)" }}>
          Command Center
        </div>
        <h1 className="t-page-title mt-1" style={{ color: "var(--color-text)" }}>
          Operations Dashboard
        </h1>
      </div>

      {/* Top row: status / mission / queue */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel heading="Agent Status" className="lg:col-span-3">
          <div className="space-y-4">
            <div>
              <div className="t-meta" style={{ color: "var(--color-muted)" }}>
                Clearance Level
              </div>
              <div
                className="t-code"
                style={{ fontSize: 30, fontWeight: 700, color: "var(--color-cyan)", lineHeight: 1.1 }}
              >
                L{level}
              </div>
            </div>
            <div>
              <div className="mb-1.5 flex justify-between">
                <span className="t-meta" style={{ color: "var(--color-muted)" }}>
                  Next Level
                </span>
                <span className="t-code" style={{ fontSize: 11, color: "var(--color-text2)" }}>
                  {xpIntoLevel}/{XP_PER_LEVEL}
                </span>
              </div>
              <ProgressBar value={levelProgress} />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <div className="t-meta" style={{ color: "var(--color-muted)" }}>
                  Streak
                </div>
                <div className="t-code" style={{ fontSize: 18, fontWeight: 700, color: "var(--color-success)" }}>
                  {progress.streak}d
                </div>
              </div>
              <div>
                <div className="t-meta" style={{ color: "var(--color-muted)" }}>
                  XP
                </div>
                <div className="t-code" style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text)" }}>
                  {progress.xp}
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel heading="Today's Mission" className="lg:col-span-6">
          {nextLesson ? (
            <div className="flex h-full flex-col">
              <div className="tag mb-3" style={{ alignSelf: "flex-start", color: "var(--color-cyan)", borderColor: "var(--line)" }}>
                Level {nextLesson.levelId} · {nextLesson.estMinutes} min
              </div>
              <h2 className="t-card-title" style={{ fontSize: 18, color: "var(--color-text)" }}>
                {nextLesson.title}
              </h2>
              <p className="t-secondary mt-2" style={{ color: "var(--color-text2)" }}>
                {nextLesson.summary}
              </p>
              <div className="mt-auto pt-5 flex flex-wrap gap-2.5">
                <Link href={`/learn?lesson=${nextLesson.id}`} className="btn btn-primary">
                  Continue Learning <IconArrowRight width={14} height={14} />
                </Link>
                <Link href="/curriculum" className="btn btn-secondary">
                  View Curriculum
                </Link>
              </div>
            </div>
          ) : (
            <div className="t-secondary" style={{ color: "var(--color-text2)" }}>
              All available lessons complete. Outstanding work, engineer.
            </div>
          )}
        </Panel>

        <Panel heading="Task Queue" className="lg:col-span-3">
          <div className="space-y-2.5">
            <QueueItem done={completedCount > 0} label="Complete a lesson" href="/learn" />
            <QueueItem done={attempts > 0} label="Attempt a challenge" href="/build" />
            <QueueItem done={diagCount > 0} label="Run diagnostics" href="/diagnostics" />
            <QueueItem done={progress.streak >= 2} label="Maintain a 2-day streak" href="/progress" />
          </div>
        </Panel>
      </div>

      {/* Quick access */}
      <div className="mt-4">
        <Panel heading="Quick Access">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {quickAccess.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="panel-2 group flex flex-col gap-3 p-4 transition-colors"
                  style={{ borderRadius: 6 }}
                >
                  <Icon width={18} height={18} style={{ color: "var(--color-cyan)" }} />
                  <span
                    className="t-meta"
                    style={{ color: "var(--color-text)", letterSpacing: "0.08em" }}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </Panel>
      </div>

      {/* System feed */}
      <div className="mt-4">
        <Panel
          heading="System Feed"
          right={
            <span className="t-meta" style={{ color: "var(--color-muted)" }}>
              {feed.length} events
            </span>
          }
        >
          {feed.length === 0 ? (
            <div className="t-secondary flex items-center gap-2" style={{ color: "var(--color-muted)" }}>
              <IconBolt width={14} height={14} />
              No activity yet. Complete a lesson or run a diagnostic to populate the feed.
            </div>
          ) : (
            <div className="space-y-0">
              {feed.slice(0, 8).map((event, i) => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 py-2.5"
                  style={{ borderTop: i === 0 ? "none" : "1px solid var(--line)" }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 99,
                      background: FEED_COLOR[event.type],
                      flexShrink: 0,
                    }}
                  />
                  <span className="t-secondary flex-1" style={{ color: "var(--color-text)" }}>
                    {event.message}
                  </span>
                  <span className="t-code" style={{ fontSize: 11, color: "var(--color-muted)" }}>
                    {timeAgo(event.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

function QueueItem({ done, label, href }: { done: boolean; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 py-1.5"
      style={{ color: done ? "var(--color-muted)" : "var(--color-text)" }}
    >
      <span
        className="grid place-items-center"
        style={{
          width: 16,
          height: 16,
          borderRadius: 3,
          border: `1px solid ${done ? "var(--color-success)" : "var(--line)"}`,
          background: done ? "var(--color-success)" : "transparent",
          flexShrink: 0,
        }}
      >
        {done && (
          <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#03060a" strokeWidth={3}>
            <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className="t-secondary" style={{ textDecoration: done ? "line-through" : "none" }}>
        {label}
      </span>
    </Link>
  );
}
