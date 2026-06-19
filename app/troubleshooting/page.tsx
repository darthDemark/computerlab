"use client";

import { useEffect, useState } from "react";
import { PageHeader, useClientData, Tag } from "@/components/ui";
import { TROUBLESHOOTING_CASES } from "@/lib/data/troubleshooting";
import { diagnosticsService } from "@/lib/services/diagnosticsService";
import { IconCheck } from "@/components/icons";

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="t-panel-heading mb-2" style={{ color: "var(--color-cyan)" }}>
        {label}
      </div>
      <div className="t-secondary" style={{ color: "var(--color-text)" }}>
        {children}
      </div>
    </div>
  );
}

export default function TroubleshootingPage() {
  const [selectedId, setSelectedId] = useState(TROUBLESHOOTING_CASES[0].id);
  const current = TROUBLESHOOTING_CASES.find((c) => c.id === selectedId)!;

  const [reviewed, refreshReviewed] = useClientData<string[]>(
    () => diagnosticsService.getReviewedCases(),
    [],
  );

  useEffect(() => {
    diagnosticsService.markReviewed(selectedId);
    refreshReviewed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  return (
    <div>
      <PageHeader
        kicker="Troubleshooting Cases"
        title="Field Manual · Known Failures"
        subtitle="Curated incident reports for the errors every engineer meets. Each case is dissected from symptom to prevention."
        actions={<Tag tone="success">{reviewed.length}/{TROUBLESHOOTING_CASES.length} reviewed</Tag>}
      />

      <div className="grid grid-cols-1 gap-px lg:grid-cols-[300px_minmax(0,1fr)]" style={{ background: "var(--line)" }}>
        <aside style={{ background: "var(--color-bg2)" }} className="max-h-[calc(100vh-140px)] overflow-y-auto">
          <div className="p-3 space-y-1">
            {TROUBLESHOOTING_CASES.map((c) => {
              const active = c.id === selectedId;
              const seen = reviewed.includes(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition-colors"
                  style={{
                    background: active ? "rgba(0,229,255,0.06)" : "transparent",
                    border: active ? "1px solid var(--line)" : "1px solid transparent",
                  }}
                >
                  <span style={{ color: seen ? "var(--color-success)" : "var(--color-muted)", flexShrink: 0 }}>
                    {seen ? <IconCheck width={13} height={13} /> : <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 99, background: "var(--color-muted)" }} />}
                  </span>
                  <div className="min-w-0">
                    <div className="t-secondary truncate" style={{ color: active ? "var(--color-cyan)" : "var(--color-text)", fontWeight: active ? 600 : 400 }}>
                      {c.title}
                    </div>
                    <div className="t-meta" style={{ color: "var(--color-muted)" }}>
                      {c.category}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <section style={{ background: "var(--color-panel)" }} className="max-h-[calc(100vh-140px)] overflow-y-auto">
          <div className="panel-header">
            <span className="t-panel-heading">Case File · {current.title}</span>
            <Tag>{current.category}</Tag>
          </div>
          <div className="p-5 md:p-7" style={{ maxWidth: 820 }}>
            <Section label="What Happened">{current.whatHappened}</Section>

            <Section label="Symptoms">
              <ul className="space-y-1.5">
                {current.symptoms.map((s, i) => (
                  <li key={i} className="t-code flex gap-2.5" style={{ fontSize: 12.5, color: "var(--color-text2)" }}>
                    <span style={{ color: "var(--color-warning)" }}>›</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Section>

            <Section label="Root Cause">
              <span style={{ color: "var(--color-error)" }}>{current.rootCause}</span>
            </Section>

            <Section label="Diagnosis">
              <ol className="space-y-1.5" style={{ listStyle: "decimal", paddingLeft: 18 }}>
                {current.diagnosis.map((d, i) => (
                  <li key={i} className="t-secondary" style={{ color: "var(--color-text)" }}>
                    {d}
                  </li>
                ))}
              </ol>
            </Section>

            <Section label="Fix">
              <span style={{ color: "var(--color-success)" }}>{current.fix}</span>
            </Section>

            <Section label="Prevention">{current.prevention}</Section>
          </div>
        </section>
      </div>
    </div>
  );
}
