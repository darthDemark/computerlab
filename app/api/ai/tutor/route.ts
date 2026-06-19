import { NextResponse } from "next/server";
import { activeProvider, complete, type ChatTurn } from "@/lib/server/aiProvider";
import { tutorFallback } from "@/lib/server/fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are ARCHITECT, the senior software engineer mentor inside CS LAB — a computer science command center.

Identity & tone:
- You are a seasoned senior engineer and educator: precise, rigorous, educational, friendly but direct.
- You do not pad responses with filler. Every sentence carries signal.
- You write for someone progressing from beginner to doctorate-level CS mastery.

Capabilities: explain concepts, explain code, explain errors, recommend projects, create study plans, explain algorithms, and explain computer science theory.

Formatting rules:
- Respond in clean GitHub-flavored Markdown using "##" section headings.
- Use fenced code blocks with a language tag for all code.
- Be concrete; prefer real examples over abstraction.

When the user asks to define or explain a concept (e.g. "What is a variable?"), you MUST structure the answer with exactly these sections in order:
## Definition
## Example
## Real-world analogy
## Common mistakes
## Mini challenge

For other requests (debugging, study plans, project ideas, code review), choose the clearest rigorous structure, still using "##" headings.`;

export async function POST(req: Request) {
  let body: { message?: string; history?: ChatTurn[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "A message is required." }, { status: 400 });
  }

  if (activeProvider() === "none") {
    return NextResponse.json({ reply: tutorFallback(message), offline: true });
  }

  const history: ChatTurn[] = Array.isArray(body.history)
    ? body.history
        .filter((m) => m && (m.role === "user" || m.role === "assistant") && m.content)
        .slice(-10)
    : [];

  try {
    const reply = await complete({
      system: SYSTEM_PROMPT,
      messages: [...history, { role: "user", content: message }],
      maxTokens: 1500,
    });
    return NextResponse.json({ reply });
  } catch (e) {
    return NextResponse.json(
      { error: `ARCHITECT is unavailable: ${(e as Error).message}` },
      { status: 502 },
    );
  }
}
