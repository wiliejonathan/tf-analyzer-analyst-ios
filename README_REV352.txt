TF Analyzer Analyst Android — REV352
Version: v1.16.68
Mobile Runtime: 1.0.109

Activation flow:
- First install: Email + Token activation is required once.
- Subsequent launch: activation form is never rendered; only the loading animation appears.
- Dashboard restores immediately from the last server-confirmed remembered authorization.
- Server/session refresh runs silently in the background.
- Temporary timeout/offline/server failure does not block a remembered valid launch.
- Explicit invalid/revoked/expired/blocked/inactive license still clears remembered authorization and returns to activation.
- REV351 remembered Email + Token storage migrates automatically because the storage key is retained.
