# TF Analyzer Analyst V1.16.94 — REV381

## Mobile-only parity with official PC REV379

**Plugin PC tidak diubah.** Source of truth tetap PC REV379 / v1.16.92.

Perbaikan iOS/Browser:
- Bundle resmi PC `tf_multi_analyst_export_v1` sekarang diperlakukan sebagai data canonical.
- `tfHistorySignals` dari PC tidak lagi di-alias, di-uppercase, di-reindex, atau difilter ulang oleh bridge Mobile sebelum kalkulasi.
- `tfAnalystSources`, Monthly Stats, Score History, No-Data Pairs, dan Avg SL canonical dipertahankan.
- Identity duplicate trade dan completeness precedence disamakan dengan PC REV379 agar combine multi-file tidak memilih row yang salah.
- Formula inti dashboard Mobile diverifikasi terhadap PC REV379: $/pip formula, SL 6M, risk, lot/rounding, PnL, compound, trade cost, consecutive stats, equity/drawdown.
- File legacy/non-PC tetap melewati compatibility normalizer, sehingga kompatibilitas import lama dipertahankan.
- PWA cache dinaikkan ke REV381 agar iOS/Browser mengambil source terbaru.

Catatan: PC REV379 tetap official dan tidak mendapat patch dari release ini.
