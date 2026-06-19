import type { TroubleshootingCase, DiagnosticCategory } from "@/lib/types";

export const DIAGNOSTIC_CATEGORIES: DiagnosticCategory[] = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "node", label: "Node / NPM" },
  { id: "git", label: "Git" },
  { id: "vercel", label: "Vercel / Deploy" },
  { id: "browser", label: "Browser / CORS" },
];

export const TROUBLESHOOTING_CASES: TroubleshootingCase[] = [
  {
    id: "module-not-found",
    title: "Module Not Found",
    category: "Node / NPM",
    whatHappened:
      "The runtime tried to import a package or file that it could not resolve on disk.",
    symptoms: [
      "Error: Cannot find module 'xyz'",
      "Build or dev server crashes immediately on start.",
      "Red import underline in the editor.",
    ],
    rootCause:
      "The dependency is not installed, the path is wrong, or the casing of the path does not match the file on a case-sensitive filesystem.",
    diagnosis: [
      "Check whether the package is listed in package.json dependencies.",
      "Confirm node_modules exists and the package folder is present.",
      "Verify the relative import path and its exact casing.",
    ],
    fix: "Run `npm install` (or `npm install <pkg>`), then correct any wrong relative path or casing in the import statement.",
    prevention:
      "Commit package-lock.json, use the editor's auto-import, and treat all paths as case-sensitive even on macOS/Windows.",
  },
  {
    id: "cannot-get",
    title: "Cannot GET /",
    category: "Node / NPM",
    whatHappened:
      "The server received a request for a route it has no handler for, so it returned a default 404.",
    symptoms: [
      "Browser shows the bare text 'Cannot GET /'.",
      "No styled page renders.",
      "Works for some routes but not others.",
    ],
    rootCause:
      "No route handler is registered for the requested path, the server is serving the wrong directory, or the build output is missing.",
    diagnosis: [
      "List the routes your server actually registers.",
      "Confirm the server is running on the port you are visiting.",
      "Check that static files / build output exist where the server expects them.",
    ],
    fix: "Register a handler for `/` (or configure static file serving to the correct build directory), then restart the server.",
    prevention:
      "Add a catch-all/404 handler and a health-check route, and verify the build output path in your start script.",
  },
  {
    id: "cors-error",
    title: "CORS Error",
    category: "Browser / CORS",
    whatHappened:
      "The browser blocked a cross-origin request because the server did not return permissive CORS headers.",
    symptoms: [
      "Console: 'has been blocked by CORS policy'.",
      "Network tab shows the request but the response is unreadable to JS.",
      "Works in Postman/curl but not in the browser.",
    ],
    rootCause:
      "The server response is missing the Access-Control-Allow-Origin header for your frontend's origin, or the preflight OPTIONS request is not handled.",
    diagnosis: [
      "Inspect the failing request's response headers in the Network tab.",
      "Check whether it is a preflight (OPTIONS) request being rejected.",
      "Compare the frontend origin with what the server allows.",
    ],
    fix: "Configure the server to send `Access-Control-Allow-Origin` (and allow the needed methods/headers), or proxy the request through your own backend.",
    prevention:
      "Centralize CORS configuration, never use `*` with credentials, and document allowed origins per environment.",
  },
  {
    id: "git-push-rejected",
    title: "Git Push Rejected",
    category: "Git",
    whatHappened:
      "The remote refused your push because your local branch is behind the remote's history.",
    symptoms: [
      "'Updates were rejected because the remote contains work you do not have'.",
      "'failed to push some refs'.",
      "Push works after others have not pushed.",
    ],
    rootCause:
      "The remote branch has commits your local branch lacks; Git refuses to overwrite them with a non-fast-forward push.",
    diagnosis: [
      "Run `git status` and `git fetch` to see divergence.",
      "Check whether someone else pushed to the same branch.",
      "Confirm you are pushing to the intended branch.",
    ],
    fix: "Run `git pull --rebase origin <branch>` to integrate remote commits, resolve any conflicts, then push again.",
    prevention:
      "Pull before you start work, push frequently, and use feature branches to reduce contention on shared branches.",
  },
  {
    id: "build-failed",
    title: "Build Failed",
    category: "Vercel / Deploy",
    whatHappened:
      "The production build step exited with a non-zero status, so deployment was aborted.",
    symptoms: [
      "Deploy logs end in 'Build failed' or 'Command exited with 1'.",
      "Type errors or missing env vars in the log.",
      "Works locally in dev but fails in build.",
    ],
    rootCause:
      "Type errors, lint failures, missing environment variables, or differences between dev and production builds (dev skips type checking).",
    diagnosis: [
      "Read the build log from the FIRST error, not the last line.",
      "Reproduce locally with `npm run build`.",
      "Verify all required environment variables exist in the deploy settings.",
    ],
    fix: "Fix the first reported error (often a type error or missing env var), confirm `npm run build` passes locally, then redeploy.",
    prevention:
      "Run the production build in CI on every PR and keep a documented list of required environment variables.",
  },
  {
    id: "undefined-function",
    title: "Undefined Function",
    category: "JavaScript",
    whatHappened:
      "Code tried to call something that is not a function at the moment of the call.",
    symptoms: [
      "TypeError: x is not a function.",
      "Crash at the exact line of the call.",
      "Intermittent when it depends on async timing.",
    ],
    rootCause:
      "A typo in the name, a bad import (default vs named), the value being undefined, or calling before assignment.",
    diagnosis: [
      "Log the value just before the call to see its real type.",
      "Check the import style matches the export (default vs named).",
      "Confirm the value is assigned before it is invoked.",
    ],
    fix: "Correct the import/typo or guard the call, ensuring the reference is the function you expect before invoking it.",
    prevention:
      "Use TypeScript and an editor with go-to-definition; prefer named exports for discoverability.",
  },
  {
    id: "missing-env",
    title: "Missing Env Variable",
    category: "Vercel / Deploy",
    whatHappened:
      "Code read an environment variable that was undefined at runtime, producing downstream errors.",
    symptoms: [
      "undefined where a key/URL should be.",
      "401/403 from an API because the key was empty.",
      "Works locally but not in production.",
    ],
    rootCause:
      "The variable is defined in a local .env file but not in the deployment environment, or it lacks the required public prefix to reach the browser.",
    diagnosis: [
      "Log `process.env.NAME` on the server (never the secret value itself).",
      "Confirm the variable exists in the deployment's environment settings.",
      "Check whether it needs a public prefix to be exposed to the client.",
    ],
    fix: "Add the variable to the deployment environment settings and redeploy; expose client-side values only via the framework's public prefix.",
    prevention:
      "Keep a committed `.env.example`, validate required env vars at startup, and never expose secrets to the browser.",
  },
  {
    id: "npm-install-failed",
    title: "NPM Install Failed",
    category: "Node / NPM",
    whatHappened:
      "Dependency installation aborted due to a resolution conflict, network failure, or platform mismatch.",
    symptoms: [
      "ERESOLVE unable to resolve dependency tree.",
      "Network timeout / 403 fetching a package.",
      "node-gyp / native build errors.",
    ],
    rootCause:
      "Conflicting peer dependencies, a corrupted cache or lockfile, an unreachable registry, or a Node version mismatch.",
    diagnosis: [
      "Read which package pair conflicts in the ERESOLVE block.",
      "Check your Node version against the package's requirement.",
      "Try clearing the cache and removing node_modules + lockfile.",
    ],
    fix: "Resolve the version conflict (align peer deps), or run `rm -rf node_modules package-lock.json && npm cache clean --force && npm install`.",
    prevention:
      "Pin a Node version with an .nvmrc / engines field, commit the lockfile, and keep dependencies updated incrementally.",
  },
];

export function getCaseById(id: string): TroubleshootingCase | undefined {
  return TROUBLESHOOTING_CASES.find((c) => c.id === id);
}
