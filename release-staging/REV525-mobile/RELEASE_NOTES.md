REV525 / v1.18.38

- History scanning now stores Cancelled orders, with raw prices and actual timestamps preserved. All batch scanning routes use the same canonical parser.
- Table 3 has a default-off Tampilkan Cancelled option. Cancelled rows are unticked and cannot enter calculations; only Created, Opened and Closed dates display, with other values shown as dashes.
- Plugin-only Created MT4/MT5 Indicator page: analyst, pair, ALL-default period, MT4-default platform, executed-only TP/SL/R, pips, consecutive losses, drawdown and date range.
- Actual EX4/EX5 compilation uses the local Windows MetaEditor through an origin-restricted native messaging companion. Run indicator-compiler/Install-Compiler.ps1 once after extracting, and keep that folder in place. MetaTrader must be installed and opened once. No trading history is sent to an external compiler service.
- Cancelled indicator rectangles are grey and labelled Cancelled. Never-opened orders use Created-to-Closed time and are excluded from performance totals.
- Outcome labels use bounded nearby screen positions, collision checks and redraw on chart scaling. Labels without nearby room remain available through rectangle tooltips; off-screen results do not pile up at chart edges.
- APK and iOS/browser keep the indicator builder excluded. Bottom navigation stays on one horizontal swipe row with directional hints.
- Regression verification covers Opened At, shared money controls, executed-only calculations, continuous history, rapid filter stress, license gate preservation and local MT4/MT5 compilation with synthetic orders.
