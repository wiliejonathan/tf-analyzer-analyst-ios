# TF Analyzer Analyst V1.17.03 — REV390

## Activation Backend Fallback Fix

- Memperbaiki error `[APPS_SCRIPT_HTTP_ERROR] Apps Script HTTP 404` pada aktivasi Android/iOS/website.
- Jalur utama tetap Cloudflare Device API.
- Jika Worker gagal karena Apps Script 404/timeout/network/invalid-response, login dan license-check otomatis pindah ke **public license lookup Apps Script** yang tidak membutuhkan `SERVER_SHARED_SECRET`.
- URL Apps Script fallback dibaca dari pointer publik `tf-analyzer-admin/license-endpoint.json`; hardcoded current endpoint tetap tersedia bila GitHub pointer tidak dapat dibaca.
- Respons invalid/expired/revoked yang eksplisit tidak diubah menjadi valid.
- Aktivasi yang berhasil via fallback tetap disimpan satu kali seperti sebelumnya.
- REV387 Holding Period timeframe parity dan seluruh perbaikan sebelumnya tetap dipertahankan.

Version: **v1.17.03 / REV390**
