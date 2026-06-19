"use client";

import { useState } from "react";
import { PageHeader, Panel, Tag } from "@/components/ui";
import { RESEARCH_CATEGORIES, RESEARCH_PAPERS } from "@/lib/data/research";
import { IconResearch } from "@/components/icons";

export default function ResearchPage() {
  const [filter, setFilter] = useState<string>("All");

  const papers =
    filter === "All"
      ? RESEARCH_PAPERS
      : RESEARCH_PAPERS.filter((p) => p.category === filter);

  return (
    <div>
      <PageHeader
        kicker="Research Lab"
        title="Doctorate Track · Primary Sources"
        subtitle="A reading room of foundational papers. The doctorate-level annotation and reproduction tooling lands in a future phase."
      />

      <div className="px-5 py-5 md:px-8 md:py-6">
        <div className="mb-5 flex flex-wrap gap-2">
          {["All", ...RESEARCH_CATEGORIES].map((cat) => {
            const active = cat === filter;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className="tag"
                style={{
                  cursor: "pointer",
                  color: active ? "var(--color-cyan)" : "var(--color-text2)",
                  borderColor: active ? "var(--color-cyan)" : "var(--line)",
                  background: active ? "rgba(0,229,255,0.06)" : "transparent",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {papers.map((p) => (
            <Panel key={p.id} className="h-full">
              <div className="flex items-start justify-between gap-3">
                <span
                  className="grid place-items-center"
                  style={{ width: 30, height: 30, borderRadius: 6, border: "1px solid var(--line)", color: "var(--color-cyan)", flexShrink: 0 }}
                >
                  <IconResearch width={15} height={15} />
                </span>
                <div className="flex items-center gap-2">
                  <Tag tone="cyan">{p.category}</Tag>
                  <span className="t-code" style={{ fontSize: 11, color: "var(--color-muted)" }}>
                    {p.year}
                  </span>
                </div>
              </div>
              <h3 className="t-card-title mt-3" style={{ color: "var(--color-text)" }}>
                {p.title}
              </h3>
              <div className="t-meta mt-1" style={{ color: "var(--color-muted)" }}>
                {p.authors}
              </div>
              <p className="t-secondary mt-3" style={{ color: "var(--color-text2)" }}>
                {p.abstract}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="t-meta" style={{ color: "var(--color-muted)" }}>
                    #{t}
                  </span>
                ))}
              </div>
            </Panel>
          ))}
        </div>

        <div
          className="mt-5 rounded border border-dashed p-5 text-center"
          style={{ borderColor: "var(--line)" }}
        >
          <div className="t-panel-heading" style={{ color: "var(--color-cyan)" }}>
            Doctorate Section · Coming Soon
          </div>
          <p className="t-secondary mt-2 mx-auto" style={{ color: "var(--color-muted)", maxWidth: 560 }}>
            Future phases unlock paper annotation, proof walkthroughs, reproduction labs, and an
            original-contribution workspace.
          </p>
        </div>
      </div>
    </div>
  );
}
