TF Analyzer Analyst Mobile / iOS Browser — REV368
Unified release tag: v1.16.82
Mobile runtime: 1.0.110

Included:
- REV367 low-usage Remote mobile transport (30s Cloudflare Fast Lane heartbeat).
- 60s license safety validation + exact local expiry timer.
- Remembered activation behavior retained from REV352: first activation asks Email + Token; subsequent launches use loading-only restore unless server explicitly revokes/invalidates the license.
- Remote Update is compatible with PC REV368 strict TradersFamily login preflight. When PC session is logged out, the PC returns TRADERSFAMILY_LOGIN_REQUIRED instead of starting a failing scan.
- Service-worker cache bumped to REV368.
- Mandatory updater current tag bumped to v1.16.82.

Android production note:
A production-update APK must be signed with the SAME production/update keystore used by the existing Android install chain.
