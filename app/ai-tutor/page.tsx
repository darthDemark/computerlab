"use client";

import { useEffect, useRef, useState } from "react";
import { Markdown } from "@/components/Markdown";
import { aiService } from "@/lib/services/aiService";
import { IconSend, IconTutor } from "@/components/icons";
import type { ChatMessage } from "@/lib/types";

function makeMessage(role: ChatMessage["role"], content: string): ChatMessage {
  return { role, content, timestamp: Date.now() };
}

const SUGGESTIONS = [
  "What is a variable?",
  "Explain Big-O notation",
  "Create a 2-week study plan for data structures",
  "What is a closure in JavaScript?",
];

export default function AiTutorPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Chat history lives in localStorage, which is unavailable during SSR.
    // Reading it after mount (and syncing into state) is the correct way to
    // hydrate without a server/client mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMessages(aiService.getHistory());
    setHydrated(true);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const userMsg = makeMessage("user", content);
    const next = [...messages, userMsg];
    setMessages(next);
    aiService.saveHistory(next);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const history = next
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));
      const reply = await aiService.tutor({ message: content, history });
      const assistantMsg = makeMessage("assistant", reply);
      const withReply = [...next, assistantMsg];
      setMessages(withReply);
      aiService.saveHistory(withReply);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    aiService.clearHistory();
    setMessages([]);
    setError(null);
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      <div
        className="flex items-center justify-between gap-3 border-b px-5 py-3 md:px-8"
        style={{ borderColor: "var(--line)" }}
      >
        <div className="flex items-center gap-3">
          <span
            className="grid place-items-center"
            style={{ width: 34, height: 34, borderRadius: 6, border: "1px solid var(--color-cyan)", color: "var(--color-cyan)", boxShadow: "var(--glow)" }}
          >
            <IconTutor width={18} height={18} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="t-card-title" style={{ color: "var(--color-text)", fontSize: 16 }}>
                ARCHITECT
              </h1>
              <span className="status-dot pulse" />
              <span className="t-meta" style={{ color: "var(--color-success)" }}>
                Online
              </span>
            </div>
            <div className="t-meta" style={{ color: "var(--color-muted)" }}>
              Senior Engineer · Mentor
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button className="btn btn-danger btn-sm" onClick={clear}>
            Clear Chat
          </button>
        )}
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 md:px-8">
        <div className="mx-auto" style={{ maxWidth: 860 }}>
          {hydrated && messages.length === 0 && !loading && (
            <div className="py-6">
              <div className="panel-2 p-5" style={{ borderRadius: 8 }}>
                <h2 className="t-card-title" style={{ color: "var(--color-text)" }}>
                  ARCHITECT is online.
                </h2>
                <p className="t-secondary mt-2" style={{ color: "var(--color-text2)" }}>
                  Your senior engineering mentor. Ask it to explain concepts, walk through code,
                  decode errors, design a study plan, or recommend a project. Concept questions
                  return a definition, example, analogy, common mistakes, and a mini challenge.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="tag"
                      style={{ cursor: "pointer", color: "var(--color-cyan)", borderColor: "var(--line)" }}
                      onClick={() => send(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-5">
            {messages.map((m, i) => (
              <div key={i} className="fade-in">
                {m.role === "user" ? (
                  <div className="flex justify-end">
                    <div
                      className="rounded px-4 py-2.5"
                      style={{ background: "rgba(0,229,255,0.08)", border: "1px solid var(--line)", maxWidth: "80%" }}
                    >
                      <div className="t-meta mb-1" style={{ color: "var(--color-cyan)" }}>
                        You
                      </div>
                      <div className="t-secondary" style={{ color: "var(--color-text)", whiteSpace: "pre-wrap" }}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="panel p-4 md:p-5" style={{ borderRadius: 8 }}>
                    <div className="t-meta mb-2.5 flex items-center gap-2" style={{ color: "var(--color-cyan)" }}>
                      <IconTutor width={13} height={13} /> ARCHITECT
                    </div>
                    <Markdown content={m.content} />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="panel p-4 md:p-5" style={{ borderRadius: 8 }}>
                <div className="t-meta mb-3 flex items-center gap-2" style={{ color: "var(--color-cyan)" }}>
                  <IconTutor width={13} height={13} /> ARCHITECT
                </div>
                <div className="flex items-center gap-2">
                  <span className="status-dot pulse" style={{ background: "var(--color-cyan)", boxShadow: "0 0 8px var(--color-cyan)" }} />
                  <span className="t-secondary" style={{ color: "var(--color-text2)" }}>
                    Reasoning…
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div
                className="t-secondary rounded p-3"
                style={{ background: "rgba(255,90,90,0.08)", border: "1px solid var(--color-error)", color: "var(--color-error)" }}
              >
                {error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t px-4 py-3 md:px-8" style={{ borderColor: "var(--line)", background: "var(--color-bg2)" }}>
        <div className="mx-auto flex items-end gap-2.5" style={{ maxWidth: 860 }}>
          <textarea
            className="textarea"
            placeholder="Ask ARCHITECT anything — concepts, code, errors, study plans…"
            value={input}
            rows={1}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            style={{ resize: "none", minHeight: 44, maxHeight: 160, fontFamily: "var(--font-sans)", fontSize: 14 }}
          />
          <button
            className="btn btn-primary"
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{ height: 44 }}
          >
            <IconSend width={15} height={15} /> Send
          </button>
        </div>
      </div>
    </div>
  );
}
