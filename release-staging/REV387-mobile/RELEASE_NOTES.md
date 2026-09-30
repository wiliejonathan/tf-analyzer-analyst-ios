# TF Analyzer Analyst V1.17.00 — REV387

## Holding Period Timeframe Parity

- Holding per trade = Closed At (`displayDate`) − Created At (`createdDate`) from Table 3.
- `createdSortKey` / `sortKey` remain fallback-only.
- Withdraw rows are excluded.
- **Max Holding Period and Avg Holding Period now use the same active filtered Table 3 dataset.**
- Therefore both Max and Avg follow **Time Range, Time Range per Month, Filter Tanggal, Nama Analis, and Pair**.
- REV384 alignment/performance, import persistence, custom cursor, and no-inner-scroll behavior are retained.

Version: **v1.17.00 / REV387**
