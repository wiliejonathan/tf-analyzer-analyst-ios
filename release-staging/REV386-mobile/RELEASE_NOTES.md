# TF Analyzer Analyst V1.16.99 — REV386

## Holding Period Final Accuracy

- Holding per trade = Closed At (`displayDate`) − Created At (`createdDate`) from Table 3.
- `createdSortKey` / `sortKey` are fallback-only when display-date strings are missing.
- Withdraw rows are excluded.
- **Max Holding Period** = longest holding from **all history** for each active Analyst-Pair.
- **Avg Holding Period** = average holding from the **active Table 3 dataset**, so Time Range, Time Range per Month, and Filter Tanggal affect Avg.
- Analyst/Pair ticker filters control which Analyst-Pair rows appear.
- REV384 alignment/performance, import persistence, custom cursor, and no-inner-scroll behavior are retained.

Version: **v1.16.99 / REV386**
