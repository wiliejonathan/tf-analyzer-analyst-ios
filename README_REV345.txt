TF Analyzer Analyst Web/iOS REV345

Equity Curve axis update:
- USD Y-axis padding is percentage-based, not fixed-dollar.
- Lower edge = min(actual equity, starting balance) minus 5% of that lower value.
- Upper edge = highest actual equity plus 5% of that upper value.
- Example actual $5,000..$10,000 => chart approximately $4,750..$10,500.
- Line Chart and Candle Stick D1 use the same percentage principle.
- Candle D1 adaptive zoom from REV343/REV344 is preserved; zoomed visible OHLC gets 5% edge padding.
- JSON import -> Table 1 and persistent login behavior are preserved.
- Cache revision bumped to REV345.
