REV521 / v1.18.34 — Opened At in trade history

The History Signal scanner reads the actual Opened at label, stores openedDate and openedSortKey, and enriches existing records on re-scan without changing trade identity. Missing Opened at stays empty; Created/Closed timestamps are never substituted. The provided legacy scan schema contains no opening timestamps, so re-scan the relevant history periods to populate old trades.

Table 3 column order is Created At | Opened At | Closed At. Opened At is HIDDEN BY DEFAULT, including existing column preferences. Enable Tanggal (Opened At) in the column menu; the saved preference persists. Missing/legacy records display a dash. Withdrawals do not get fabricated opening times.

Enabled Opened At is included in CSV, Excel and PDF exports. Full JSON exports/imports preserve the new fields. PC/mobile combine enriches a legacy duplicate instead of creating another trade and does not erase known Opened At values. Mobile normalization keeps Created and Opened aliases distinct. Multi-scanner History DOM evidence includes opening timestamps when available.

Core money/risk math, Closed At chart grouping and the plugin's 100-row history pagination/per-render SL cache remain unchanged. Tested against the supplied Opened at DOM structure, out-of-order labels, missing timestamps, hidden defaults, opt-in persistence, native CSV/Excel/PDF rendering, JSON preservation and merge enrichment. Private user scan data is not shipped.
