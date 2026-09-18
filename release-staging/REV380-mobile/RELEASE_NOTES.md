# TF Analyzer Analyst V1.16.93

## REV380 — Mobile Calculation Parity

Perbaikan ini menyamakan input kalkulasi Android/iOS/Browser dengan Plugin PC REV380.

- Formula inti telah diaudit terhadap PC REV379/REV380: $/pip, SL Fixed 6M, risk, lot rounding, PnL, compound balance, cost, consecutive stats, dan drawdown tetap sama.
- Data `tfHistorySignals` canonical dari Plugin PC sekarang disimpan verbatim; Mobile tidak lagi memfilter atau mengubah row canonical sebelum kalkulasi.
- Prioritas merge duplicate history disamakan dengan implementasi Plugin PC.
- Snapshot `tfMyfxbookPrices` dan `tfMyfxbookPricesAt` dari PC REV380 dipertahankan di Mobile sehingga $/pip, lot dan PnL $ memakai price input yang sama.
- PWA cache dinaikkan ke REV380 agar iOS/Browser mengambil source terbaru.
- Perubahan Remote Dashboard Home REV372 tetap dipertahankan.

Build: v1.16.93 • REV380
