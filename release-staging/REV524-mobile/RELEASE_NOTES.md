REV524 / v1.18.37 — harden rapid filter interactions and dynamic table stability

Analyst/pair checkbox state now synchronizes across all existing filter controls immediately, while a single requestAnimationFrame performs the expensive view refresh and menu rebuild after the active input event completes. Rapid changes are coalesced using the latest state. The legacy combined filter entry point no longer repeats the same full dashboard update twice. Native direct calculations/import flows remain synchronous.

Removed content-visibility:auto/display locking from the three dynamic dashboard table sections. Standard layout, sticky headers, colors and scrolling remain. History loading ignores hidden/offscreen tables to prevent layout-driven scroll events from eagerly loading old rows. Old desktop scroll-render state releases references when replaced; stale frame callbacks cannot update a newer state. Repeated deferred column-visibility passes share one animation frame.

Retains complete raw data, actual PnL/lot/cost math, checkbox/select-all eligibility, automatic continuous scrolling without page buttons, Opened At hidden by default, exports, risk and money-control synchronization.

Stress validation: 3,000 trades, 93 rapid analyst changes, native cost toggles and viewport resizing under a 128MB JS old-space limit on desktop and mobile sources. All tests completed without renderer crashes; retained JS heap stayed bounded after GC. Tested checkbox nodes remain connected during change dispatch, controls synchronize immediately, batches refresh once, hidden scrolls do not add DOM rows, and full-data exports remain complete.

The user's exact native STATUS_BREAKPOINT crash was not reproduced in the test environment. These changes remove observed duplicate/reentrant rendering and dynamic-layout hazards; they do not establish a universal cause or guarantee against unrelated Chrome/OS/driver crashes. Tests exercise Chrome 156 and existing regression coverage.

Mobile compatibility license hooks now delegate to the existing server-validated gate state rather than returning unconditional prototype success. Missing, revoked/invalid, session-invalid and expired authorizations fail closed; valid gate sessions retain existing startup and transient-network behavior. The real mobile-license-gate.js validation flow is unchanged.
