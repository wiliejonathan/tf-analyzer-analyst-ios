# TF Analyzer Analyst V1.16.95 — REV382

## JSON Import → Table Render Fix

Plugin PC tetap **REV379 / v1.16.92** dan tidak diubah.

- Memperbaiki manual Import JSON untuk export resmi PC schema `tf_multi_analyst_export_v1`.
- `storage.tfHistorySignals` dan `tfAnalystSources` sekarang dipertahankan sebagai canonical data sebelum `applyPayload()`.
- Monthly Stats, Score History, Avg SL, No-Data Pairs, dan storage canonical lain tetap dipertahankan.
- Cache PWA dinaikkan ke REV382 agar iOS/browser tidak memakai JavaScript REV381 lama.
- QA canonical fixture memverifikasi 5.075/5.075 trade tetap bertahan.
- Formula/perilaku kalkulasi tetap mengacu ke PC REV379 yang tidak diubah.

Root cause REV381: manual Import melakukan pre-normalization tanpa flag canonical PC, sehingga export resmi dapat dianggap legacy dan `tfHistorySignals` menjadi kosong sebelum penyimpanan.
