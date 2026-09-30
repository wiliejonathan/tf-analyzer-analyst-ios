# TF Analyzer Analyst V1.17.06 — REV393

## Latest-Month Risk Warning System

Status warning sekarang dihitung terpusat dari **Table 3 raw history**, per kombinasi **Analis + Pair**, pada **bulan Closed At paling terbaru**.

### Rule
- **Drawdown**: posisi kumulatif pips pada akhir bulan terbaru masih berada di bawah peak kumulatif pips bulan tersebut.
- **Consecutive Loss**: pada bulan terbaru terdapat minimal **2 loss berturut-turut** pada Analis + Pair yang sama.
- Jika hanya salah satu kondisi aktif → **text kuning + icon ! kuning**.
- Jika **Drawdown + Consecutive Loss aktif bersamaan pada Analis + Pair yang sama** → **text merah + icon × merah**.
- Tampilan yang memang tanpa icon tetap mengikuti severity warna: kuning untuk warning, merah untuk critical.

### Lokasi
- Performance/Probability Analis
- TABLE ANALYTICS — Holding Period per Analis
- Table 1 — Nama Analis, hanya row pertama per analis
- Table 2 — Nama Analis + icon/status pada text Signals di bulan terbaru
- Table 3 — Nama Analis
- Drawdown & Consecutive Stats — Nama Analis
- Table 4 — Score History Analis
- iSignal Users — Analis di iSignal
- Table Users and Management > Details — Nama Analis **warna saja, tanpa icon**

Holding strict range REV392 dan Android activation fallback tetap dipertahankan.

Version: **v1.17.06 / REV393**
