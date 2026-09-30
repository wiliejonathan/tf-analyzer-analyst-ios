# TF Analyzer Analyst V1.17.05 — REV392

## Holding Period Strict Time Range + Android Activation Parity

- **TABLE ANALYTICS → Holding Period per Analis** sekarang memakai hanya trade Table 3 yang benar-benar checked/enabled.
- Boundary Time Range memakai **Created At**, bukan hanya Closed At. Carry-over trade yang dibuat sebelum awal 1M/2M/3M/dst otomatis unchecked dan tidak masuk Max/Avg Holding.
- Boundary diterapkan ke seluruh range, bukan hanya bulan pertama yang kebetulan memiliki Closed At.
- Contoh: pada **1M**, trade lama yang Created At berada sebelum awal periode tidak dapat lagi membuat Max Holding menjadi 57d.
- Custom date range memakai tanggal awal custom sebagai hard boundary.
- Android APK mendapat fallback aktivasi yang lebih kuat: respons device/session lama yang menolak akan diverifikasi ulang melalui relay GitHub Pages dan sumber lisensi publik sebelum dianggap gagal.
- Relay mendukung jalur /mobile/login dan /license-check, sehingga aktivasi awal dan validasi berjalan konsisten.
- iOS/website tetap memakai alur yang sama dan cache dinaikkan ke REV392.

Version: **v1.17.05 / REV392**
