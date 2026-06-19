/**
 * Deterministic structured fallbacks used ONLY when no AI provider key is
 * configured. This keeps the prototype fully clickable on a fresh clone while
 * still proving out the request → structured-response contract. When a real
 * key is set the live model is used instead.
 */

const FALLBACK_NOTICE =
  "> **Offline mode** — no `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` is configured, so ARCHITECT is returning a structured template. Add a key in your environment to enable live reasoning.\n\n";

export function tutorFallback(message: string): string {
  const topic = message.trim().replace(/[?.!]+$/, "") || "this topic";
  return (
    FALLBACK_NOTICE +
    `## Definition\nA concise, precise definition of **${topic}** would appear here, framed the way a senior engineer would explain it on a whiteboard.\n\n` +
    `## Example\n\`\`\`js\n// A minimal, runnable example illustrating ${topic}.\nconsole.log("example");\n\`\`\`\n\n` +
    `## Real-world analogy\nA grounded analogy that maps ${topic} onto something physical and familiar.\n\n` +
    `## Common mistakes\n- A frequent misconception about ${topic}.\n- A subtle edge case engineers miss.\n- A debugging trap to watch for.\n\n` +
    `## Mini challenge\nA small, concrete exercise to verify you understood ${topic}. Try it, then ask ARCHITECT to review your answer.`
  );
}

export function debugFallback(errorMessage: string): string {
  const err = errorMessage.trim().split("\n")[0] || "the reported error";
  return (
    FALLBACK_NOTICE +
    `## 1. What happened\nThe runtime reported: \`${err}\`. This is the observable symptom, not necessarily the root cause.\n\n` +
    `## 2. Most likely causes\n- A value was not what the code assumed (wrong type, undefined, or null).\n- A name, import, or path is incorrect.\n- State was read before it was ready.\n\n` +
    `## 3. How to diagnose\n- Read the full stack trace and open the named file and line.\n- Log the suspect values immediately before the failing line.\n- Reproduce reliably, then isolate by removing code until it stops.\n\n` +
    `## 4. How to fix\nCorrect the offending value, import, or guard, then confirm the symptom is gone.\n\n` +
    `## 5. How to prevent\nAdd type checks or TypeScript, validate inputs at boundaries, and write a test that reproduces this case.\n\n` +
    `## 6. Related concept to study\nReview **Debugging Basics** in Level 1 to reinforce a systematic approach.`
  );
}
