TF ANALYZER ANALYST — REV341

Mobile Web/iOS + Android chart parity fix.

- LINE Chart remains trade-progression based.
- Candle Stick D1 now uses the same trade-progression X geometry.
- Candle close overlay is anchored to the same starting balance and daily closing trade indices.
- Candle Y scale is calculated from the full selected dataset and stays locked during pinch/wheel X zoom.
- Mobile candles keep a readable minimum body width instead of collapsing into hairlines.
- REV340 balance baseline rule remains: Y minimum = input starting balance - $1,000.
- Import JSON workflow and persistent login from REV340 are preserved.
- PC Extension is intentionally NOT modified in REV341.
