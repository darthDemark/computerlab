"use client";

import { useState } from "react";
import { Markdown } from "@/components/Markdown";
import { useClientData } from "@/components/ui";
import { DIAGNOSTIC_CATEGORIES } from "@/lib/data/troubleshooting";
import { aiService } from "@/lib/services/aiService";
import { diagnosticsService } from "@/lib/services/diagnosticsService";
import { IconBolt } from "@/components/icons";
import type { DebugSession } from "@/lib/types";

const SAMPLE = "TypeError: Cannot read properties of undefined (reading 'map')";

export default function DiagnosticsPage() {
  const [category, setCategory] = useState<string>("javascript");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [sessions, refreshSessions] = useClientData<DebugSession[]>(
    () => diagnosticsService.getSessions(),
    [],
  );

  const analyze = async () => {
    const errorMessage = input.trim();
    if (!errorMessage || loading) return;
    setLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const label =
        DIAGNOSTIC_CATEGORIES.find((c) => c.id === category)?.label ?? category;
      const result = await aiService.debug({ errorMessage, category: label });
      setAnalysis(result);
      diagnosticsService.recordSession(label, errorMessage, result);
      refreshSessions();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5 md:px-8"
        style={{ borderColor: "var(--line)" }}
      >
        <div>
          <div className="t-meta" style={{ color: "var(--color-cyan)" }}>
            Diagnostics Lab
          </div>
          <h1 className="t-page-title mt-0.5" style={{ color: "var(--color-text)" }}>
            Error Triage Engine
          </h1>
        </div>
        <span className="t-meta" style={{ color: "var(--color-muted)" }}>
          {sessions.length} runs logged
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px lg:grid-cols-[220px_minmax(0,1fr)_minmax(0,1fr)]" style={{ background: "var(--line)" }}>
        {/* Categories */}
        <aside style={{ background: "var(--color-bg2)" }}>
          <div className="panel-header">
            <span className="t-panel-heading">Categories</span>
          </div>
          <div className="p-3 space-y-1">
            {DIAGNOSTIC_CATEGORIES.map((c) => {
              const active = c.id === category;
              return (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className="nav-item w-full"
                  style={{
                    color: active ? "var(--color-cyan)" : undefined,
                    background: active ? "rgba(0,229,255,0.06)" : undefined,
                    borderColor: active ? "var(--line)" : "transparent",
                  }}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Error input */}
        <section style={{ background: "var(--color-panel)" }} className="flex flex-col">
          <div className="panel-header">
            <span className="t-panel-heading">Error Input</span>
            <button
              className="t-meta"
              style={{ color: "var(--color-cyan)" }}
              onClick={() => setInput(SAMPLE)}
            >
              Insert Sample
            </button>
          </div>
          <div className="flex flex-1 flex-col p-4">
            <textarea
              className="textarea flex-1"
              placeholder="Paste a full error message and stack trace here. The Diagnostics Engine will triage it."
              value={input}
              spellCheck={false}
              onChange={(e) => setInput(e.target.value)}
              style={{ minHeight: 240, height: "calc(100vh - 320px)" }}
            />
            <div className="mt-3 flex gap-2.5">
              <button className="btn btn-primary" onClick={analyze} disabled={loading || !input.trim()}>
                <IconBolt width={14} height={14} />
                {loading ? "Analyzing…" : "Run Diagnostics"}
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setInput("");
                  setAnalysis(null);
                  setError(null);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        <section style={{ background: "var(--color-bg2)" }} className="flex flex-col">
          <div className="panel-header">
            <span className="t-panel-heading">AI Analysis</span>
            {loading && (
              <span className="t-meta pulse" style={{ color: "var(--color-cyan)" }}>
                Processing
              </span>
            )}
          </div>
          <div className="max-h-[calc(100vh-220px)] overflow-y-auto p-5">
            {error && (
              <div
                className="t-secondary rounded p-3"
                style={{ background: "rgba(255,90,90,0.08)", border: "1px solid var(--color-error)", color: "var(--color-error)" }}
              >
                {error}
              </div>
            )}
            {!analysis && !loading && !error && (
              <div className="t-secondary" style={{ color: "var(--color-muted)" }}>
                Select a category, paste an error, and run diagnostics. You will get: what happened,
                likely causes, how to diagnose, the fix, prevention, and a concept to study.
              </div>
            )}
            {loading && (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    style={{
                      height: 12,
                      borderRadius: 3,
                      background: "var(--color-panel)",
                      width: `${90 - i * 8}%`,
                    }}
                    className="pulse"
                  />
                ))}
              </div>
            )}
            {analysis && (
              <div className="fade-in">
                <Markdown content={analysis} />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
