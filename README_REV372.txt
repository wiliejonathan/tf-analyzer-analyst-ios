TF ANALYZER ANALYST — MOBILE REV372
=====================================
Focus: Remote Dashboard button routing fix.

- Remote > Buka Dashboard now closes the Remote page and returns to the Android/iOS/Browser app home (Table 1).
- It no longer sends the legacy open_dashboard command to the PC plugin.
- Remote Update/Submit/Refresh and other PC commands are unchanged.
- PWA/service-worker cache bumped to REV372 so iOS/Browser receives the fix after update.
