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
    levelId: 6,
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
    levelId: 6,
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
    levelId: 6,
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
    levelId: 0,
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
    levelId: 6,
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
    levelId: 1,
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
    levelId: 6,
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
    levelId: 6,
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
  {
    id: "max-call-stack",
    title: "Maximum Call Stack Size Exceeded",
    category: "JavaScript",
    levelId: 2,
    whatHappened:
      "A recursion (or mutual recursion) never reached its base case, so frames piled up until the call stack overflowed.",
    symptoms: [
      "RangeError: Maximum call stack size exceeded.",
      "A function that calls itself with no progress toward termination.",
      "Crash that grows with input size.",
    ],
    rootCause:
      "A missing, unreachable, or non-shrinking base case — each recursive call fails to reduce the problem.",
    diagnosis: [
      "Locate the recursive function in the stack trace.",
      "Verify a base case exists and is actually reachable.",
      "Confirm every recursive call moves the argument toward the base case.",
    ],
    fix: "Add or fix the base case so recursion terminates; for deep linear recursion, convert to iteration or use an explicit stack.",
    prevention:
      "Always write the base case first, and add a guard/assertion that the input strictly shrinks each call.",
  },
  {
    id: "quadratic-slowdown",
    title: "Sudden Quadratic Slowdown",
    category: "JavaScript",
    levelId: 3,
    whatHappened:
      "Code that was fast on small inputs became unusably slow at scale because its complexity is O(n²).",
    symptoms: [
      "Runtime explodes as the dataset grows (10x data → ~100x time).",
      "Nested loops over the same collection.",
      "UI freeze / request timeout on large inputs.",
    ],
    rootCause:
      "An O(n²) algorithm (e.g., a nested scan, or repeated array.includes inside a loop) where an O(n) approach exists.",
    diagnosis: [
      "Identify nested iteration over the same data.",
      "Estimate the Big O class by counting loops.",
      "Check for O(n) operations (includes/indexOf) inside an O(n) loop.",
    ],
    fix: "Replace the inner scan with a hash map or Set lookup to drop from O(n²) to O(n).",
    prevention:
      "Reason about Big O before shipping; add a performance test on a realistically large input.",
  },
  {
    id: "off-by-one-index",
    title: "Index Out of Range / Undefined Element",
    category: "JavaScript",
    levelId: 4,
    whatHappened:
      "An array was accessed at an invalid index, yielding undefined and a downstream crash.",
    symptoms: [
      "Reading a property of undefined after an array access.",
      "Loop runs one time too many or too few.",
      "Last or first element is skipped or duplicated.",
    ],
    rootCause:
      "An off-by-one error: using <= instead of <, or assuming the last index is length rather than length - 1.",
    diagnosis: [
      "Print the index and array length at the boundary.",
      "Re-check loop bounds and termination condition.",
      "Confirm whether the structure is 0-indexed (arrays) as expected.",
    ],
    fix: "Correct the loop bound (length - 1 for the last valid index) and guard accesses that may be undefined.",
    prevention:
      "Prefer for...of / map over manual index loops, and add tests for empty and single-element inputs.",
  },
  {
    id: "unsorted-binary-search",
    title: "Binary Search Returns Wrong Result",
    category: "JavaScript",
    levelId: 5,
    whatHappened:
      "Binary search returned -1 or an incorrect index even though the value was present.",
    symptoms: [
      "Correct on some inputs, wrong on others.",
      "Returns -1 for values that exist.",
      "No error thrown — just wrong answers.",
    ],
    rootCause:
      "The input array was not sorted (binary search's precondition), or an off-by-one in the bound updates.",
    diagnosis: [
      "Assert the array is sorted before searching.",
      "Log low, high, and mid each iteration.",
      "Check that bounds move past mid (mid ± 1).",
    ],
    fix: "Sort the array first (or maintain it sorted), and fix the low/high update so the loop always shrinks.",
    prevention:
      "Encapsulate the sorted invariant in the data structure, and unit-test search on edge positions.",
  },
  {
    id: "n-plus-one-queries",
    title: "N+1 Query Problem",
    category: "Node / NPM",
    levelId: 7,
    whatHappened:
      "Loading a list issued one query per item instead of a single batched query, hammering the database.",
    symptoms: [
      "Hundreds of near-identical queries in the logs for one page.",
      "Latency scales linearly with list length.",
      "Database CPU spikes under light traffic.",
    ],
    rootCause:
      "Lazy-loading a relation inside a loop, producing 1 query for the list plus N for each row's relation.",
    diagnosis: [
      "Count the queries per request in the DB log.",
      "Find the loop that triggers a query per iteration.",
      "Confirm the relation could be fetched in one join/batch.",
    ],
    fix: "Eager-load or batch the relation (a single JOIN or an IN query) so the page costs a constant number of queries.",
    prevention:
      "Watch query counts in development, use dataloaders/eager loading, and add a query-count assertion in tests.",
  },
  {
    id: "thundering-herd",
    title: "Cache Stampede / Thundering Herd",
    category: "Vercel / Deploy",
    levelId: 8,
    whatHappened:
      "A popular cache key expired and thousands of requests simultaneously hit the origin to rebuild it.",
    symptoms: [
      "Periodic origin/database load spikes aligned with cache TTL.",
      "Latency cliffs every few minutes.",
      "Origin overload despite a high cache hit rate normally.",
    ],
    rootCause:
      "Many clients miss the cache at the same instant and all recompute the same expensive value (no coordination).",
    diagnosis: [
      "Correlate load spikes with cache TTL expiry.",
      "Check whether misses cluster in time.",
      "Confirm there is no single-flight / lock around recomputation.",
    ],
    fix: "Add request coalescing (single-flight), stagger TTLs with jitter, and serve stale-while-revalidate.",
    prevention:
      "Use jittered expiries, background refresh, and a lock so only one worker rebuilds a hot key.",
  },
  {
    id: "irreproducible-result",
    title: "Irreproducible Research Result",
    category: "JavaScript",
    levelId: 9,
    whatHappened:
      "An experiment produced different numbers on each run, undermining a claimed result.",
    symptoms: [
      "Metrics vary run to run with the same code.",
      "Reported figures cannot be regenerated.",
      "Reviewers cannot reproduce the headline number.",
    ],
    rootCause:
      "Uncontrolled randomness, unpinned dependencies/data versions, or undocumented hyperparameters.",
    diagnosis: [
      "Check for an unset random seed.",
      "Verify dataset and dependency versions are pinned.",
      "Confirm every parameter is recorded with the result.",
    ],
    fix: "Fix and log the random seed, pin data + dependency versions, and record the full experiment configuration.",
    prevention:
      "Script experiments end-to-end, log seeds and versions, and store configs alongside results for reproducibility.",
  },
];

export function getCaseById(id: string): TroubleshootingCase | undefined {
  return TROUBLESHOOTING_CASES.find((c) => c.id === id);
}
