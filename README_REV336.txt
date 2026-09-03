TF Analyzer Analyst Web/iOS REV336

Fixes:
1. Refresh/reopen no longer shows activation/login process after a successful remembered Email + Token login.
2. Remembered login remains until explicit Log out.
3. JSON Import/Combine writes to IndexedDB and immediately repaints the dashboard without location.reload().
4. chrome.storage.onChanged is no longer suppressed during import, so Table 1/Table 3/Table 4 can refresh from imported data.
5. Service Worker cache bumped to REV336 and mutable HTML/JS/CSS uses network-first to reduce stale-cache deployments.
6. REV335 portrait appbar positioning remains intact.

Deploy by replacing the repository root files with this folder's contents.
