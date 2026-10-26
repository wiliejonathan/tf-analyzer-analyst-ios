REV522 / v1.18.35 — restore the original continuous History table

Removed the Previous/Next buttons, page selector and 100-row pagination introduced in REV520. Table 3 once again displays the complete filtered history in one scrollable table, matching the original user experience. No pagination toolbar or explanatory paging note remains.

The core SL statistics cache and existing report optimizations remain. Opened At scanning/storage, hidden-by-default column, column preferences and CSV/Excel/PDF/JSON support are retained. Risk, PnL, lot, equity, eligibility/checkboxes and full-data exports retain their existing behavior.

Plugin, Android and iOS/website releases share version v1.18.35. Tested with more than 100 trade rows, verifying all rows are present, no pagination controls appear, and exports/data selection remain complete. Existing Opened At and money-control integration regressions pass.
