# TF Analyzer Analyst V1.16.99 — REV386

## Holding Period Final Table 3 Accuracy

- Dataset Holding Period = exact final trade rows displayed/exported by Table 3 after all active filters.
- Holding per trade = Closed At (`displayDate`) − Created At (`createdDate`).
- Numeric sort keys are fallback-only.
- Withdraw rows are excluded.
- Max = longest holding among the currently active Table 3 trades per Analyst-Pair.
- Avg = average holding among the same active Table 3 trades.
- Time Range, Time Range per Month, Filter Tanggal, analyst and pair filters therefore affect both Max and Avg consistently with Table 3.
- REV384 alignment/performance and import persistence are retained.

Version: **v1.16.99 / REV386**
