REV514 / v1.18.27

Monthly consistency now lists profit/loss years only, without Pips/Dollar totals. Monthly bars have thin year separators and a rotated label for every month. Narrow screens show separate yearly panels to keep all labels legible without horizontal scrolling. Monday calendar cells use a bold violet outline while preserving the original PnL fill.

New Perbandingan Profit & Loss per Jam pairs gross-profit bars on the left with gross-loss bars on the right using a shared scale, separate value labels and a small gap. The hourly distribution heading states GMT +7. All numbered report headings use a hyphen.

Monthly equity includes compact yearly/monthly summaries with Show More and Show Grafik. Show More lists Close Date and per-trade PnL in the selected Pips/Dollar mode, with the total at the bottom. Show Grafik scrolls to the matching full equity card below and flashes its outline twice after scrolling. Existing three-column desktop and one-column phone layouts remain.

Full raw trades and exact dashboard lot/cost calculations are retained. Validated: monthly aggregation, profit/loss year lists, all Monday dates, 48 paired hourly bars, trade totals, actual parent/iframe navigation with two outline flashes, Pips/Dollar mode and 280–1440px responsive layout.


Six-month risk:reward is mean positive trade Pips divided by mean absolute negative trade Pips for the selected analyst/pair, using the card month and five prior calendar months. It uses full raw history, ignores zero returns and never reads later months. Cards show RR, its period/sample size and (TP × RR) − SL = weighted R. Missing TP/SL reference returns unavailable rather than an assumed ratio.

A new monthly weighted-R bar chart follows Performa Bulanan & Konsistensi, with total R for the selected period. Months lacking a valid ratio are identified and excluded from the explicitly incomplete total. R is independent of the Pips/Dollar display mode; actual PnL remains unchanged.

User Adjustmend shares committed Balance/Risk, live Swap/Comm rates and toggles, ticker checkboxes and native Withdraw controls across Main Dashboard, Analis Report and Calendar/Trading Hours. Balance/Risk drafts mirror without changing Apply/Submit semantics. Cost toggles/rates apply immediately and preserve analyst risk overrides. Withdraw relays through the existing native validation and Apply handler. Fixed stale report cost caches and mismatched ticker IDs.

Validated with actual native control handlers, bidirectional draft/toggle/rate/Withdraw tests, formula fixtures (TP 3 × RR 2 − SL 5 = +1R), no-future-data and per-pair six-month boundaries, monthly R totals and responsive layouts.
