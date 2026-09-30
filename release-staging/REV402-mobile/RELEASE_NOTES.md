# TF Analyzer Analyst v1.17.15 — REV402

## Fast Import / Loading Optimization

- Import JSON menggunakan **single-flight render**: Table 1–4/equity tidak dihitung berulang oleh import, storage listener, dan boot timer secara bersamaan.
- Bulk write IndexedDB saat import dibuat silent agar tidak memicu render duplikat.
- Render retry dipangkas dari 5 pass menjadi 1 pass + 1 fallback singkat.
- Waktu tunggu overlay dipangkas; UI dibuka segera setelah data inti siap.
- Boot recovery dikurangi dari 4 kali menjadi 2 kali dan dilewati saat import sedang aktif.
- REV401 remembered analyst links restore tetap dipertahankan.
- REV400 Holding Period dan analyst-name color fixes tetap dipertahankan.

Version: **v1.17.15 / REV402**
