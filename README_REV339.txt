TF Analyzer Analyst Web/iOS REV339

Fix: Equity Curve > Candle Stick (D1) USD now uses a HARD $0 Y-axis floor.
- Bottom Y-axis tick is always $0.
- No automatic negative range such as -$50K.
- Positive net equity uses the available chart height.
- Candle values below starting balance are clipped at the $0 visual floor.
- Line Chart and all other dashboard calculations remain unchanged.
