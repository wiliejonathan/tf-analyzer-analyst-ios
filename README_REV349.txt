TF Analyzer Analyst REV349

- Strict Email + Token activation before app entry on every fresh launch.
- Live license validation every ~5 seconds while app is active.
- Deleted/expired/blocked/inactive licenses are kicked to Activation immediately after server confirmation.
- Mobile/Web credentials and user/import/session data are not persisted across launches; TF local/session/IndexedDB state is purged at boot.
- REV347 touch-safe chart tooltip and REV345 percentage Equity axis are retained.
