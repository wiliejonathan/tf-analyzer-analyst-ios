# TF Analyzer Analyst V1.17.09 — REV396

## Analyst Colors + Multi-Pair Icons + Table 3 PNL Coloring

Perubahan:
- **Semua Nama Analis** sekarang selalu mengikuti status: hijau / kuning / merah. Tidak ada lagi nama analis putih saat status tersedia.
- Healthy = text hijau + ✓ hijau pada lokasi yang memakai icon.
- Warning = text kuning + ! kuning.
- Critical = text merah + × merah.
- Analis dengan >1 pair tetap mendapat icon. Jika pair spesifik tidak punya state bulan terbaru, icon fallback ke status agregat analis.
- Table 2 Nama Analis hanya berubah warna text; status tidak lagi ditambahkan ke text/title nama analis.
- Holding Period Max/Avg memakai format 2-digit: contoh **02d 04h 07m**, **04h 07m**, **07m**.
- Table 3: seluruh text row mengikuti warna PNL % (profit/zero hijau, loss merah), kecuali Nama Analis yang mengikuti warna status analis.
- Table 4, Table 1, TABLE ANALYTICS, Performance, Drawdown Stats, dan iSignal mengikuti warna status icon.

Version: **v1.17.09 / REV396**
