"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { NAV_ITEMS } from "./nav";
import { IconMenu, IconClose } from "./icons";

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const command = NAV_ITEMS.filter((n) => n.section === "command");
  const ops = NAV_ITEMS.filter((n) => n.section === "ops");

  const renderNav = (items: typeof NAV_ITEMS) =>
    items.map((item) => {
      const Icon = item.icon;
      const active = isActive(pathname, item.href);
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileOpen(false)}
          className={`nav-item ${active ? "active" : ""}`}
        >
          <Icon className="nav-icon" />
          <span>{item.label}</span>
        </Link>
      );
    });

  return (
    <div className="relative z-[1] flex min-h-screen flex-col">
      {/* Header */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b px-4 md:px-6"
        style={{
          height: 56,
          borderColor: "var(--line)",
          backgroundColor: "rgba(7,11,18,0.85)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-3">
          <button
            className="btn btn-secondary md:hidden"
            style={{ height: 34, width: 38, padding: 0 }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <IconClose width={16} height={16} /> : <IconMenu width={16} height={16} />}
          </button>
          <Link href="/" className="flex items-center gap-2.5">
            <span
              className="grid place-items-center"
              style={{
                width: 26,
                height: 26,
                border: "1px solid var(--color-cyan)",
                color: "var(--color-cyan)",
                fontWeight: 800,
                fontSize: 12,
                boxShadow: "var(--glow)",
                borderRadius: 4,
              }}
            >
              CS
            </span>
            <span className="t-app-title" style={{ color: "var(--color-text)" }}>
              CS&nbsp;LAB
            </span>
          </Link>
          <span
            className="t-meta hidden sm:inline"
            style={{ color: "var(--color-muted)", marginLeft: 4 }}
          >
            Knowledge OS
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="status-dot pulse" />
          <span
            className="t-meta hidden sm:inline"
            style={{ color: "var(--color-success)", fontWeight: 700 }}
          >
            System Online
          </span>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside
          className="hidden md:flex md:flex-col shrink-0 border-r"
          style={{
            width: 240,
            borderColor: "var(--line)",
            backgroundColor: "var(--color-bg2)",
          }}
        >
          <nav className="flex flex-col gap-1 p-3">
            <div className="t-meta px-3 pb-2 pt-1" style={{ color: "var(--color-muted)" }}>
              Command
            </div>
            {renderNav(command)}
            <div
              className="t-meta px-3 pb-2 pt-4"
              style={{ color: "var(--color-muted)" }}
            >
              Operations
            </div>
            {renderNav(ops)}
          </nav>
          <div className="mt-auto p-3">
            <div className="panel p-3" style={{ borderRadius: 6 }}>
              <div className="t-meta" style={{ color: "var(--color-muted)" }}>
                Build
              </div>
              <div
                className="t-secondary"
                style={{ color: "var(--color-text2)", marginTop: 4 }}
              >
                CS LAB · Phase 1 Prototype
              </div>
            </div>
          </div>
        </aside>

        {/* Sidebar — mobile drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(3,6,10,0.7)" }}
              onClick={() => setMobileOpen(false)}
            />
            <aside
              className="fixed left-0 top-[56px] bottom-0 z-50 w-[260px] border-r md:hidden"
              style={{
                borderColor: "var(--line)",
                backgroundColor: "var(--color-bg2)",
              }}
            >
              <nav className="flex flex-col gap-1 p-3">
                <div className="t-meta px-3 pb-2 pt-1" style={{ color: "var(--color-muted)" }}>
                  Command
                </div>
                {renderNav(command)}
                <div
                  className="t-meta px-3 pb-2 pt-4"
                  style={{ color: "var(--color-muted)" }}
                >
                  Operations
                </div>
                {renderNav(ops)}
              </nav>
            </aside>
          </>
        )}

        {/* Workspace */}
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
