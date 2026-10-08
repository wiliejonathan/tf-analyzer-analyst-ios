REV475 / v1.17.88

- Five risk controls: consecutive-loss pips +30%, monthly PnL pips warning >75%, critical >120%, consecutive-loss count +30%, and latest drawdown. All enabled by default and individually adjustable.
- Severity uses pips only; dollar values remain informational and cannot override risk status. Old default 100% critical value migrates once to 120%.
- Updated first-visit and Report popup rules, helper text and yellow monthly average formula. Controls remain compact and collapsible.
- Same risk engine and UI in Chrome plugin, Android APK and iOS/browser website. Existing scrolling optimizations retained.

Validation: independent control switches including all off, strict percentage boundaries, pips/dollars disagreement, migration persistence, Report navigation, mobile layout and export regressions.
