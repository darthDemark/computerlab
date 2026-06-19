/**
 * Server-only AI provider. Supports Anthropic and OpenAI via environment
 * variables. API keys are read here on the server and NEVER sent to the client.
 *
 *   ANTHROPIC_API_KEY  (preferred if both are set)
 *   OPENAI_API_KEY
 *
 * Optional overrides:
 *   ANTHROPIC_MODEL  (default: claude-3-5-sonnet-latest)
 *   OPENAI_MODEL     (default: gpt-4o-mini)
 */

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface CompletionInput {
  system: string;
  messages: ChatTurn[];
  maxTokens?: number;
}

export type Provider = "anthropic" | "openai" | "none";

export function activeProvider(): Provider {
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return "none";
}

export function isAIConfigured(): boolean {
  return activeProvider() !== "none";
}

async function callAnthropic(input: CompletionInput): Promise<string> {
  const model = process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-latest";
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY as string,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: input.maxTokens ?? 1400,
      system: input.system,
      messages: input.messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Anthropic API error (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  return (data.content ?? [])
    .map((b) => b.text ?? "")
    .join("")
    .trim();
}

async function callOpenAI(input: CompletionInput): Promise<string> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${process.env.OPENAI_API_KEY as string}`,
    },
    body: JSON.stringify({
      model,
      max_tokens: input.maxTokens ?? 1400,
      messages: [
        { role: "system", content: input.system },
        ...input.messages,
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI API error (${res.status}): ${detail.slice(0, 300)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

export async function complete(input: CompletionInput): Promise<string> {
  const provider = activeProvider();
  if (provider === "anthropic") return callAnthropic(input);
  if (provider === "openai") return callOpenAI(input);
  throw new Error("NO_PROVIDER");
}
