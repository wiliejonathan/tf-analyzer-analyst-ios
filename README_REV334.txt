TF Analyzer Analyst Web / iOS REV334

EXACT APPBAR FIX (same behavior as corrected Android APK):
Portrait top-right order is locked to: Log out | Remote | Data.
Data is always immediately to the right of Remote and cannot wrap to the upper-left.
Remote insertion is re-normalized before Data even if the button already exists.
Landscape navigation remains unchanged.
Service Worker cache bumped to REV334 so iOS/browser receives the new layout.
