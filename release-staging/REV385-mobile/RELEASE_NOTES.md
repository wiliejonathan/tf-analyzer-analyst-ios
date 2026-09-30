# TF Analyzer Analyst V1.16.98 — REV385

## Holding Period Accuracy Fix

- Holding Period now uses the exact dates displayed in Table 3 as the source of truth.
- Created At = `createdDate`; Closed At = `displayDate`.
- `createdSortKey` / `sortKey` are fallback-only for legacy rows with missing display dates.
- Max Holding Period uses all history for the currently selected Analyst-Pair set.
- Avg Holding Period follows Time Range, Time Range per Month, and the active Table 3 date filters.
- PC/mobile calculation logic is now aligned.
- REV384 alignment, no-inner-scroll, Table 3 performance fix, import persistence, and Analyst-Pair filters are retained.

Version: **v1.16.98 / REV385**
