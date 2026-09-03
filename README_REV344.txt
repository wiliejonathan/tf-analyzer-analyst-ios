TF ANALYZER ANALYST — WEB / IOS REV344
========================================

REV344 — TIGHT EQUITY Y-AXIS PADDING

Equity Curve USD scaling:
- Lower edge: actual lower/start balance minus $1,000.
- Upper edge: actual highest equity plus $1,000.
- Example: data $5,000 to $10,000 -> chart range $4,000 to $11,000.
- Small datasets are no longer expanded to four forced $1,000 buckets that create excessive empty space.
- USD grid/ticks use adaptive clean money intervals.

Candle Stick D1:
- REV343 adaptive candle height/zoom behavior is preserved.
- Zoom may tighten the visible OHLC scale, with padding capped at $1,000, so candles remain readable.

Other behavior preserved:
- Persistent login.
- Import JSON returns to Table 1.
- Mobile Remote architecture unchanged.

Cache revision: REV344.
