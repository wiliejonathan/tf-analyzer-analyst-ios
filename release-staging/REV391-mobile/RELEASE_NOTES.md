# TF Analyzer Analyst V1.17.04 — REV391

## Holding Period Checkbox Parity + Android Activation Relay

- **Holding Period sekarang memakai tepat baris Table 3 yang sedang dicentang/enabled.**
- Trade yang otomatis tidak dicentang karena **Time Range**, **Time Range per Month**, atau boundary awal periode tidak lagi masuk ke Max/Avg Holding Period.
- Contoh: saat 1M aktif, carry-over trade lama yang dibuat sebelum boundary 1M dan tampil sebagai unchecked tidak lagi membuat Max Holding menjadi 50–60+ hari.
- Filter Nama Analis + Pair tetap berlaku.
- Android mendapat fallback aktivasi tambahan melalui relay origin GitHub Pages yang sama dengan website yang sudah terbukti dapat melakukan aktivasi.
- Worker tetap jalur utama; public Apps Script lookup tetap fallback dan tidak mengekspos server secret.
- Cache/version dinaikkan ke REV391 agar APK/PWA tidak memakai JS aktivasi lama.

Version: **v1.17.04 / REV391**
