# TF Analyzer Analyst v1.17.14 — REV401

## JSON Import Remembered Links Restore

- Import JSON memulihkan `tfRememberedAnalystLinks` ketika file berisi `[]` tetapi `tfAnalystSources` masih lengkap.
- Sidebar analis dibangun ulang otomatis dari URL/pair di `tfAnalystSources`.
- `tfRememberLinksEnabled` kembali aktif setelah recovery.
- Data import tetap disimpan di storage persisten; tutup/buka aplikasi tidak lagi menghilangkan daftar analis karena kondisi ini.
- Semua fix REV400 untuk Holding Period dan warna Nama Analis tetap dipertahankan.

Version: **v1.17.14 / REV401**
