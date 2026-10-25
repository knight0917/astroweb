---
name: audit-code-review
description: >-
  Comprehensive multi-axis code audit and review evaluating git diffs, PRs, and files for security boundaries
  (OWASP Top 10), architectural integrity, performance bottlenecks, and strict type safety.
---

# Multi-Axis Code Audit & Review Protocol

This skill enforces high-rigor, adversarial code auditing across 4 distinct axes to prevent security breaches, fragile workarounds, regression bugs, and performance degradation.

---

## 1. Review Axes & Verification Criteria

### Axis A: Security & Boundary Defense (OWASP Top 10)
- **Hostile Input Boundary**: Validate and sanitize all external inputs (URL query params, request bodies, route params, webhook payloads, file uploads).
- **Injection Preventions**: Zero raw string concatenation in SQL, NoSQL queries, child processes, or HTML rendering (`dangerouslySetInnerHTML`).
- **Secrets & Credentials**: Verify no hardcoded API keys, private keys, JWT secrets, or DB connection strings are committed.
- **Access Control & Auth**: Verify endpoint authorization, role guards, and resource ID ownership (IDOR).
- **Error Obfuscation**: Never leak stack traces, internal paths, or environment variables to client responses.

### Axis B: Architectural Integrity & Maintainability
- **Composition over Inheritance**: Favor small, pure, focused functional utilities over deep class hierarchies.
- **Fail Loud & Early**: Guard clauses must throw explicit errors or return typed failure states (`Result<T, E>`) on invalid states rather than failing silently.
- **Boundary Decoupling**: Isolate side effects (network, disk I/O, database) to thin boundary layers; keep business and calculation logic pure.
- **Single Source of Truth**: Eliminate duplicated state or split configuration files.

### Axis C: Performance & Memory Leak Prevention
- **React / Frontend**: Check for unbounded dependencies in `useEffect`/`useMemo`/`useCallback`, uncleaned event listeners, intervals, and 3D animations (`requestAnimationFrame`).
- **Data Fetching / Backend**: Detect $N+1$ query cascades, unindexed database filters, and unpaginated unbounded collection queries.
- **Algorithmic Complexity**: Prevent nested $O(n^2)$ or $O(n^3)$ iterations on dynamic collections where maps or sets achieve $O(1)$ lookup.

### Axis D: Correctness & Type Integrity
- **Zero `any` Policy**: Strict TypeScript typing. Reject `any`, `unknown` casts without type predicates, and unhandled `null`/`undefined` cases.
- **Edge Case Coverage**: Test and audit boundary values ($0$, $-1$, `NaN`, empty arrays, leap years, daylight saving time transitions, timezone shifts).
- **Deterministic Idempotency**: Verify mutations are idempotent or protected by unique constraints / transactions.

---

## 2. Review Severity Taxonomy

All findings must be tagged with one of the following severity tiers:

| Severity | Definition | Action Required |
|:---|:---|:---|
| **`[CRITICAL]`** | Vulnerability, data loss risk, regression break, or auth bypass. | Blocks merge immediately. Must fix before proceeding. |
| **`[REQUIRED]`** | Logic bug, missing error handler, type violation, or spec deviation. | Must fix before release. |
| **`[RECOMMENDED]`** | Performance improvement, maintainability cleanup, or cleaner refactor. | Highly advised; non-blocking if logged. |
| **`[NIT]`** | Cosmetic, formatting, naming nuance, or minor docstring tweak. | Optional. |

---

## 3. Standard Review Output Template

```markdown
### Summary of Changes
[Concise 2-3 sentence overview of the diff or feature being audited]

### Risk Level
[LOW | MEDIUM | HIGH | CRITICAL]

### Findings by Axis

#### 1. Security & Boundaries
- `[STATUS]` [Finding description + exact file:line reference + suggested fix]

#### 2. Architecture & Design
- `[STATUS]` [Finding description + exact file:line reference + suggested fix]

#### 3. Performance & Memory
- `[STATUS]` [Finding description + exact file:line reference + suggested fix]

#### 4. Type Safety & Correctness
- `[STATUS]` [Finding description + exact file:line reference + suggested fix]

### Final Verdict
[APPROVED | REQUEST_CHANGES | BLOCKED]
```
