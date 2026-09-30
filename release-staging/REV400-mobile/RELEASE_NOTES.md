# TF Analyzer Analyst V1.17.13 — REV400

## Analyst Name Span Fix

REV400 memperbaiki kasus Nama Analis yang masih putih pada row tertentu:
- Table 1 row pertama;
- Table 2 row pertama;
- Table 3 row tertentu;
- Table 4 row pertama.

Perubahan utama:
- teks Nama Analis di Table 1/2/3/4 tidak lagi menjadi text-node langsung di TD;
- setiap nama dibungkus span khusus `.tf-analyst-name-color-target`;
- hijau/kuning/merah ditulis langsung ke span tersebut;
- `-webkit-text-fill-color` juga dikunci agar sticky/table renderer tidak bisa mengembalikan teks menjadi putih;
- icon tetap terpisah dan tidak ikut berubah warna teks;
- post-render sweep tetap aktif sebagai lapisan tambahan.

Perbaikan JSON Import REV399 dan seluruh REV392–REV398 tetap dipertahankan.

Version: **v1.17.13 / REV400**
