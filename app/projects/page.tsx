"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader, Panel, Tag } from "@/components/ui";
import { PROJECTS } from "@/lib/data/projects";
import { IconArrowRight, IconClose } from "@/components/icons";
import type { Project } from "@/lib/types";

const DIFF_TONE: Record<Project["difficulty"], "success" | "warning" | "error"> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "error",
};

export default function ProjectsPage() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <div>
      <PageHeader
        kicker="Projects"
        title="Build Lab · Applied Missions"
        subtitle="Ship real software. Each mission lists its difficulty, the skills it forges, and a concrete requirement spec."
      />

      <div className="px-5 py-5 md:px-8 md:py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <Panel key={p.id} className="h-full">
              <div className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="t-card-title" style={{ color: "var(--color-text)" }}>
                    {p.title}
                  </h3>
                  <Tag tone={DIFF_TONE[p.difficulty]}>{p.difficulty}</Tag>
                </div>
                <p className="t-secondary mt-2" style={{ color: "var(--color-text2)" }}>
                  {p.blurb}
                </p>
                <div className="mt-3.5">
                  <div className="t-meta mb-1.5" style={{ color: "var(--color-muted)" }}>
                    Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.skills.map((s) => (
                      <span key={s} className="tag" style={{ color: "var(--color-text2)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-auto pt-4">
                  <button className="btn btn-primary w-full" onClick={() => setActive(p)}>
                    Start Project <IconArrowRight width={14} height={14} />
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 grid place-items-center p-4"
          style={{ background: "rgba(3,6,10,0.78)", backdropFilter: "blur(4px)" }}
          onClick={() => setActive(null)}
        >
          <div
            className="panel w-full max-w-xl fade-in"
            style={{ borderRadius: 8, borderColor: "var(--color-cyan)", boxShadow: "var(--glow)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="panel-header">
              <span className="t-panel-heading" style={{ color: "var(--color-cyan)" }}>
                Mission Brief
              </span>
              <button onClick={() => setActive(null)} style={{ color: "var(--color-muted)" }}>
                <IconClose width={16} height={16} />
              </button>
            </div>
            <div className="p-5 md:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="t-card-title" style={{ fontSize: 18, color: "var(--color-text)" }}>
                  {active.title}
                </h2>
                <Tag tone={DIFF_TONE[active.difficulty]}>{active.difficulty}</Tag>
              </div>
              <p className="t-secondary mt-2" style={{ color: "var(--color-text2)" }}>
                {active.blurb}
              </p>

              <div className="t-panel-heading mt-5 mb-2" style={{ color: "var(--color-cyan)" }}>
                Requirements
              </div>
              <ul className="space-y-1.5">
                {active.requirements.map((r, i) => (
                  <li key={i} className="t-secondary flex gap-2.5" style={{ color: "var(--color-text)" }}>
                    <span style={{ color: "var(--color-cyan)" }}>›</span>
                    {r}
                  </li>
                ))}
              </ul>

              <div className="t-panel-heading mt-5 mb-2" style={{ color: "var(--color-cyan)" }}>
                Skills Forged
              </div>
              <div className="flex flex-wrap gap-1.5">
                {active.skills.map((s) => (
                  <span key={s} className="tag" style={{ color: "var(--color-text2)" }}>
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Link href="/ai-tutor" className="btn btn-primary">
                  Plan with ARCHITECT
                </Link>
                <button className="btn btn-secondary" onClick={() => setActive(null)}>
                  Close Brief
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
