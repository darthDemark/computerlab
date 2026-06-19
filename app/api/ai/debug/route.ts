import { NextResponse } from "next/server";
import { activeProvider, complete } from "@/lib/server/aiProvider";
import { debugFallback } from "@/lib/server/fallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SYSTEM_PROMPT = `You are the CS LAB Diagnostics Engine — a senior engineer specialized in triaging software errors.

The user pastes an error message (optionally with a category like JavaScript, TypeScript, Git, Vercel, or CORS). Diagnose it like a staff engineer doing incident response: precise, calm, and educational.

You MUST respond in clean GitHub-flavored Markdown using EXACTLY these six sections, in this order:
## 1. What happened
## 2. Most likely causes
## 3. How to diagnose
## 4. How to fix
## 5. How to prevent
## 6. Related concept to study

Rules:
- Be specific to the actual error text provided; reference the real symbols/paths in it.
- Use bullet lists for causes and steps.
- Put any commands or code in fenced code blocks with a language tag.
- The "Related concept to study" should name a concrete topic the learner should review.`;

export async function POST(req: Request) {
  let body: { errorMessage?: string; category?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const errorMessage = (body.errorMessage ?? "").trim();
  if (!errorMessage) {
    return NextResponse.json({ error: "An error message is required." }, { status: 400 });
  }

  if (activeProvider() === "none") {
    return NextResponse.json({ analysis: debugFallback(errorMessage), offline: true });
  }

  const category = (body.category ?? "").trim();
  const userPrompt = category
    ? `Category: ${category}\n\nError:\n${errorMessage}`
    : `Error:\n${errorMessage}`;

  try {
    const analysis = await complete({
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
      maxTokens: 1400,
    });
    return NextResponse.json({ analysis });
  } catch (e) {
    return NextResponse.json(
      { error: `Diagnostics Engine is unavailable: ${(e as Error).message}` },
      { status: 502 },
    );
  }
}
