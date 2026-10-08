REV476 / v1.17.89

- Correct monthly PnL risk average: include only profitable months within the previous six completed calendar months, using Table 3 pips. Exclude loss and zero months from sum and divisor.
- Default warning 75%, critical 100%; migrate previous default 120% once.
- Add Reset beside Drawdown Terbaru; restore all five enabled rules and 30/75/100/30 defaults.
- Synchronize explanations, plugin, Android and iOS/browser website.

Validation: Trade07 fixture average 2945.925 pips and 70.14% loss ratio; strict threshold boundaries and pips-only calculations passed across all three engines.
