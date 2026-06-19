import type { ChatMessage } from "@/lib/types";
import { STORAGE_KEYS, readJSON, writeJSON } from "./storage";

/**
 * Client-side gateway to the server AI routes. The browser NEVER sees an API
 * key — every call is proxied through /api/ai/*. This module is the only place
 * the UI talks to the model.
 */

export interface TutorRequest {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export interface DebugRequest {
  errorMessage: string;
  category?: string;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    throw new Error((data.error as string) || `Request failed (${res.status})`);
  }
  return data as T;
}

export const aiService = {
  async tutor(req: TutorRequest): Promise<string> {
    const data = await postJSON<{ reply: string }>("/api/ai/tutor", req);
    return data.reply;
  },

  async debug(req: DebugRequest): Promise<string> {
    const data = await postJSON<{ analysis: string }>("/api/ai/debug", req);
    return data.analysis;
  },

  // ---- Chat history persistence -------------------------------------------
  getHistory(): ChatMessage[] {
    return readJSON<ChatMessage[]>(STORAGE_KEYS.chatHistory, []);
  },

  saveHistory(messages: ChatMessage[]): void {
    writeJSON(STORAGE_KEYS.chatHistory, messages.slice(-100));
  },

  clearHistory(): void {
    writeJSON(STORAGE_KEYS.chatHistory, []);
  },
};

export type { ChatMessage };
