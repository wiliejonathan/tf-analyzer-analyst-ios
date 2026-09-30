# REV404 — Activation Recovery (v1.17.17)

- PC: server-confirmed bind opens immediately without duplicate session handshake; challenge/read timeout 40s, mutation timeout 75s; one automatic activation retry.
- Mobile: 40s primary lookup allows the existing backend retry budget to finish; Android fallback goes directly to the relay lookup without calling Worker again.
- Mobile: concurrent checks share a request; boot refresh and live watch no longer overlap; transient backend errors preserve remembered activation.
- Explicit invalid, blocked, revoked or expired license remains denied. Device approval and cryptographic proof remain enforced on PC.
- REV403 table widths and REV402 fast import retained.

Validation: 11 PC activation tests + 6 mobile tests; JavaScript syntax; protected file hashes; packaged APK checks in CI.

The deployed Worker/Apps Script service has not been changed. Backend availability can still prevent a first activation. Physical device activation has not been tested with customer credentials.
