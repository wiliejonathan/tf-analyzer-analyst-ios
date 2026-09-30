# TF Analyzer Analyst V1.17.12 — REV399

## JSON Import Fix

REV399 memperbaiki jalur Import JSON di iOS/website/APK:
- menerima export resmi `tf_multi_analyst_export_v1`;
- menerima **raw canonical storage JSON** yang langsung berisi `tfHistorySignals`, `tfAnalystSources`, `tfMonthlyStats`, atau `tfScoreHistory`;
- file JSON lama tetap dinormalisasi;
- Combine beberapa JSON menormalisasi **setiap file** sebelum digabungkan;
- UTF-8 BOM / padding NUL dan satu lapis JSON yang ter-double-encode ditangani;
- Cancel import lama tidak lagi membuat import berikutnya langsung dianggap batal;
- file yang valid secara JSON tetapi bukan data TF Analyzer ditolak dengan pesan yang jelas;
- import kosong tidak boleh menimpa data lama.

Semua perbaikan REV392–REV398 tetap dipertahankan.

Version: **v1.17.12 / REV399**
