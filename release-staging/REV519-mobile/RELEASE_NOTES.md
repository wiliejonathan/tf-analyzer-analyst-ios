REV519 / v1.18.32 — reduce unnecessary report work on low-end laptops

Report iframe starts when its panel is opened, avoiding hidden startup chart work. Height-only iframe resizing no longer rebuilds every chart; real width changes still update responsive layouts. Balance/Risk drafts and withdrawal control edits synchronize controls without recomputing committed PnL or sending every trade. Committed settings and live costs retain full recalculation.

Collapsed Show More trade rows are created on first expansion, retaining all trades, totals and the ten-row scroll viewport. Hover nearest-point lookup uses binary search. Two-decimal R formatting reuses one formatter. Mount observer disconnects after mounting.

Validated against REV518 with 6,000 synthetic trades and 4x CPU throttling: unchanged trades/net/card counts, height-only resize rebuild count reduced from four to zero. Functional browser tests cover exact native lot/cost PnL, two-way settings, all years, Close At, R/DD, 280–1440px layouts and complete expandable trade lists. Timing is a local simulation, not a guarantee for every device.
