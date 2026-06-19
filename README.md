# CS LAB — Computer Science Command Center

CS LAB is a **Knowledge Operating System**: a command center designed to take a
student from complete beginner to doctorate-level computer science mastery. It
is engineered to feel like a software engineering workstation and an
intelligence console — not an online course.

This is the **Phase 1 clickable prototype**: no auth, no database, no payments.
State lives in `localStorage` behind a service layer so a future backend
(e.g. Supabase) is a drop-in swap.

## Stack

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS v4**
- **localStorage** persistence via a service layer
- **Real AI** through server routes (Anthropic or OpenAI)
- Deployable to **Vercel**

## Real AI

Two server routes provide live AI. API keys are read **only on the server** and
are never exposed to the browser.

- `POST /api/ai/tutor` — ARCHITECT, the senior-engineer mentor.
- `POST /api/ai/debug` — the Diagnostics error-triage engine.

Set **one** of the following in your environment (see `.env.example`):

```bash
ANTHROPIC_API_KEY=...   # preferred if both are present
# or
OPENAI_API_KEY=...
```

If no key is configured, the routes return a structured offline template so the
prototype remains fully clickable.

## Getting started

```bash
npm install
cp .env.example .env.local   # add a key to enable live AI (optional)
npm run dev                  # http://localhost:3000
```

```bash
npm run build && npm start   # production build
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Dashboard — agent status, today's mission, task queue, quick access, system feed |
| `/curriculum` | Curriculum map across Levels 0–8 with lock/active/complete states |
| `/learn` | Lesson viewer — modules · content · autosaving notes |
| `/build` | Challenge mode — prompt · code editor · simulated test runner |
| `/diagnostics` | Diagnostics lab — paste an error, get real AI triage |
| `/troubleshooting` | Field manual of known-failure case files |
| `/ai-tutor` | ARCHITECT — real AI chat with persisted history |
| `/progress` | Mastery telemetry, level progress, achievements |
| `/research` | Research lab — foundational papers by category |
| `/projects` | Applied build missions with requirement specs |

## Architecture

Pages never touch `localStorage` directly. All persistence flows through
services in `lib/services/`:

- `lessonService.ts` · `progressService.ts` · `journalService.ts`
- `challengeService.ts` · `diagnosticsService.ts` · `aiService.ts`
- `storage.ts` — the single low-level localStorage wrapper

Content lives in `lib/data/`. Server-only AI logic lives in `lib/server/`.

### localStorage keys

`cs_lab_completed_lessons`, `cs_lab_notes`, `cs_lab_challenges`,
`cs_lab_debug_sessions`, `cs_lab_progress`, `cs_lab_chat_history`.
