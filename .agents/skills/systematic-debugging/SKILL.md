---
name: systematic-debugging
description: >-
  Systematic, evidence-driven root-cause investigation and debugging protocol for runtime exceptions,
  flaky tests, race conditions, and logical regressions.
---

# Systematic Root-Cause Debugging Protocol

This skill enforces a hypothesis-driven, evidence-first engineering method for resolving software defects, stack traces, race conditions, and regression test failures. Guess-and-check coding and superficial symptom patching are strictly prohibited.

---

## 1. The Evidence Gate (Non-Negotiable Rule)

**Never apply a fix before the root cause is conclusively proven.**

- **Symptom Patching Violation**: Adding a null check (`x?.y`) or a `try/catch` wrapper that hides an error without understanding *why* the invalid state arose is a failure of protocol.
- **Hypothesis Requirement**: Every proposed code change must be backed by an observable, falsifiable mechanism explaining how the defect triggers and how the proposed change resolves it at its origin.

---

## 2. 4-Phase Debugging Workflow

```text
[Phase 1: Reproduce & Isolate]
              │
              ▼
[Phase 2: Formulate Falsifiable Hypotheses]
              │
              ▼
[Phase 3: Targeted Verification & Surgical Fix]
              │
              ▼
[Phase 4: Regression Guard & Full Test Pass]
```

### Phase 1: Reproduce & Isolate
1. **Capture the Full Failure Artifact**:
   - Exact error name, error code, stack trace, and failing assertion.
   - Exact inputs, timestamps, environment variables, and branch commit.
2. **Construct a Minimal Reproduction**:
   - Build a standalone unit test, minimal script, or single command that reliably reproduces the failure.
   - If intermittent (race condition / flake), isolate the shared state, asynchronous timing drift, or concurrency order.

### Phase 2: Formulate Falsifiable Hypotheses
1. Trace the code path backwards from the point of failure to the boundary input.
2. Formulate 1-2 distinct hypotheses:
   - *"Condition X was assumed to be non-empty, but under input Y, the parser returns an empty array before index 0 is accessed."*
   - *"The asynchronous lock is released before the transaction commits, allowing a concurrent worker to read uncommitted state."*
3. Identify an observable test that will confirm or refute each hypothesis.

### Phase 3: Targeted Verification & Surgical Fix
1. Test the hypothesis using targeted logging, debuggers, or step execution.
2. Once the defect mechanism is proven, implement the **minimal surgical fix**:
   - Fix the defect at the boundary or root computation, not downstream.
   - Maintain all existing invariants and contracts.
   - Never rewrite unaffected modules or introduce unrelated stylistic churn.

### Phase 4: Regression Guard & Full Test Pass
1. Run the reproduction test created in Phase 1; verify it transitions from **FAIL $\to$ PASS**.
2. Run the entire test suite (`npm test`, `pytest`, `cargo test`) to ensure **zero regressions**.
3. Verify type checking (`npx tsc --noEmit` or compiler check) and production build.
4. Clean up any temporary debug logs or scratch files.

---

## 3. Specialized Debugging Runbooks

### Concurrency & Race Conditions
- Check for shared mutable state across async turns.
- Verify atomic check-and-set operations or database transaction isolation levels.
- Check for missing `await` statements or unhandled Promise rejections.

### Memory Leaks & Event Listener Accumulation
- Check that every `addEventListener`, `setInterval`, or WebSocket connection has a corresponding cleanup in `useEffect` or lifecycle teardown.
- Inspect closures that retain large DOM elements or data caches.

### Timezone & Daylight Saving Time Drifts
- Never parse date strings with machine-local assumptions unless explicitly intended.
- Use explicit UTC methods (`getUTCHours()`, `Date.UTC()`) or timezone-aware formatters (`timeZone: "UTC"` / `timeZone: "Europe/Rome"`).
