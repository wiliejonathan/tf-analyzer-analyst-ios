REV517 / v1.18.30

All new analyst calendar/report charts use Closed At in GMT +7: daily tracking, daily/cumulative returns, monthly performance and consistency, weighted monthly R, hourly activity/profit/loss/comparison, monthly equity and the six-month RR reference. Created At remains available as trade metadata but cannot select the chart aggregation basis. Trades without Closed At are not assigned to a fabricated close date.

RR and weighted R labels/tooltips use at most two decimals, truncated toward zero (1.476 -> 1.47). Computation and totals retain full precision; actual Pips/Dollar figures are unchanged.

Show More keeps every trade but displays a scrolling viewport sized for the first ten rows, with sticky Close Date/PnL header and total footer. Size adjusts to wrapped mobile rows and risk-mode changes. All existing Monday-aligned calendar, shared adjustments and warning fixes remain.

Validated with trades created in January and closed in February at a different hour, two-decimal positive/negative display, exact full-precision totals, 25-trade lists with exactly ten visible rows, Pips/Dollar totals and responsive layouts.
