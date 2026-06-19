"use client";

import React, { useEffect, useState } from "react";

export function PageHeader({
  title,
  kicker,
  subtitle,
  actions,
}: {
  title: string;
  kicker?: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b px-5 py-4 md:px-8 md:py-5" style={{ borderColor: "var(--line)" }}>
      <div>
        {kicker && (
          <div className="t-meta mb-1.5" style={{ color: "var(--color-cyan)" }}>
            {kicker}
          </div>
        )}
        <h1 className="t-page-title" style={{ color: "var(--color-text)" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="t-secondary mt-1.5" style={{ color: "var(--color-text2)", maxWidth: 720 }}>
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  heading,
  right,
  children,
  className = "",
  bodyClassName = "",
  style,
}: {
  heading?: React.ReactNode;
  right?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section className={`panel flex flex-col ${className}`} style={{ borderRadius: 6, ...style }}>
      {heading && (
        <div className="panel-header">
          <span className="t-panel-heading">{heading}</span>
          {right}
        </div>
      )}
      <div className={`p-4 md:p-5 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "cyan" | "success" | "warning" | "error";
}) {
  const colorMap: Record<string, string> = {
    default: "var(--color-text2)",
    cyan: "var(--color-cyan)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    error: "var(--color-error)",
  };
  return (
    <span
      className="tag"
      style={{
        color: colorMap[tone],
        borderColor: tone === "default" ? "var(--line)" : colorMap[tone],
      }}
    >
      {children}
    </span>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(100, Math.round(value * 100)));
  return (
    <div className="progress-track">
      <div className="progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

export function Stat({
  label,
  value,
  tone = "cyan",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "cyan" | "success" | "warning" | "text";
}) {
  const colorMap: Record<string, string> = {
    cyan: "var(--color-cyan)",
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    text: "var(--color-text)",
  };
  return (
    <div className="panel-2 p-3.5" style={{ borderRadius: 6 }}>
      <div className="t-meta" style={{ color: "var(--color-muted)" }}>
        {label}
      </div>
      <div
        className="mt-1.5 t-code"
        style={{ fontSize: 24, fontWeight: 700, color: colorMap[tone], lineHeight: 1 }}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Re-runs `read` on mount and whenever CS LAB storage changes (same tab via
 * the custom event, other tabs via the native storage event). This keeps the
 * UI reactive without a global store, while avoiding hydration mismatches by
 * returning `initial` until mounted on the client.
 */
export function useClientData<T>(read: () => T, initial: T): [T, () => void] {
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    const update = () => setValue(read());
    update();
    window.addEventListener("cslab:storage", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cslab:storage", update);
      window.removeEventListener("storage", update);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = () => setValue(read());
  return [value, refresh];
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="t-secondary grid place-items-center rounded border border-dashed py-8 text-center"
      style={{ borderColor: "var(--line)", color: "var(--color-muted)" }}
    >
      {children}
    </div>
  );
}
