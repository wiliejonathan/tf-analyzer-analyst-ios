# TF Analyzer Analyst V1.17.10 — REV397

## No White Analyst Names

REV397 menutup fallback putih sepenuhnya:
- Setiap nama analis non-kosong selalu mendapat state **hijau, kuning, atau merah**.
- Nama analis dinormalisasi/canonicalized agar variasi display, pair suffix, zero-width character, dan label status tidak menyebabkan mismatch.
- Semua analis yang dikenal dari History, ANALYSTS, Analyst Sources, dan global selection didaftarkan ke risk-state.
- Jika analis belum memiliki state risk yang cocok, fallback eksplisitnya adalah **HEALTHY / hijau**, bukan putih.
- Post-render color sweep diterapkan ke Performance, Holding, Table 1, Table 2, Table 3, Drawdown Stats, Table 4, iSignal, Users Details, dan ticker analis.
- Sweep hanya mengatur warna; ikon yang sudah ada tidak dihapus.
- Rule ikon dan warna tetap: ✓ hijau, ! kuning, × merah.
- Perbaikan REV396 tetap dipertahankan: multi-pair icon, Holding 2-digit, Table 3 mengikuti warna PnL %, alignment ikon presisi.

Version: **v1.17.10 / REV397**
