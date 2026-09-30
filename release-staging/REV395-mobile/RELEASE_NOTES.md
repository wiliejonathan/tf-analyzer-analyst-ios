# TF Analyzer Analyst V1.17.08 — REV395

## Semua Nama Analis Konsisten + Healthy Check

Perubahan:
- Warna **Nama Analis** sekarang selalu memakai severity agregat analis di seluruh pair.
- Jika minimal satu pair warning pada bulan terbaru, semua kemunculan Nama Analis ikut **kuning**.
- Jika minimal satu pair critical, semua kemunculan Nama Analis ikut **merah**.
- Tidak ada lagi Nama Analis yang tetap putih hanya karena row yang sedang tampil adalah pair lain.

Status normal:
- Jika analis/pair tidak mengalami Drawdown maupun Consecutive Loss pada bulan terbaru, permukaan yang memakai ikon menampilkan **centang hijau ✓**.
- Teks status normal tetap warna default.
- Ticker/sidebar dan Table Users and Management > Details tetap **tanpa ikon**, sesuai aturan sebelumnya.

Pair-specific:
- Holding Period dan Table 3 mempertahankan icon berdasarkan pair row.
- Table 2 Signals bulan terbaru tetap berdasarkan pair.
- Table 2 Nama Analis/Pair dan Details memakai warna agregat analis tanpa icon.

REV392 Holding strict range, REV393 severity rules, dan REV394 ukuran/posisi icon tetap dipertahankan.

Version: **v1.17.08 / REV395**
