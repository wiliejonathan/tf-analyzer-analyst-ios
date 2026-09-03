TF ANALYZER ANALYST — REV342
============================

Mobile / Web / iOS Candle Stick D1 Flexible Zoom

Changes:
- Restores flexible D1 candle sizing on Android, browser and iOS PWA.
- Candle width is based on the number of visible D1 candles.
- Longer Time Range = naturally smaller candles.
- Zooming in reduces visible candle count, so candle bodies widen progressively.
- When a 2M/3M/etc view is zoomed to about the same visible-day count as 1M, candle size converges to the 1M visual size.
- Candle scale uses the visible candle viewport again instead of being locked to the complete selected history.
- Existing Balance - $1,000 chart baseline logic is retained.
- Existing persistent login and Import JSON -> Table 1 workflow are retained.
- PC Extension is intentionally NOT modified in REV342.
