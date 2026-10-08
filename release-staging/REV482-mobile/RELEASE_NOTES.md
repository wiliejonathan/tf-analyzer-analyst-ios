REV482 / v1.17.95

- Correct Report DD old/new to Equity Curve dollar high-to-low intervals and sum signed trade PnL percent in those intervals. Withdraw affects dollar equity but is excluded from trade PnL percent.
- Old period excludes latest three prior calendar months plus current month; recent period contains those four months, including incomplete current month.
- DD cells and exports show pips / dollars / accumulated PnL percent.
- Average PnL third line shows actual profitable-month divisor: Avg. N Bulan.
- Preserve draft/Confirm, 120% red, scanner changes and Hide/Show. Shared implementation on plugin, Android and iOS/browser.

Validation: winning dollar interval with intervening profit trades, variable trade percentages and withdraw exclusion, old/recent month boundary, row format and actual divisor, desktop/mobile navigation, sorting and exports.
