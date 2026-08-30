TF Analyzer Analyst — Web/iOS REV333
Appbar Layout Fix

Perubahan:
- Portrait: urutan tombol kanan atas dikunci menjadi Log out | Remote | Data.
- Tombol Data tidak lagi turun/berpindah ke kiri atas.
- Tidak mengubah Token Gate, Dashboard, Remote logic, Table 1-4, Calculator, Performance, Equity, atau Data logic.
- Service Worker cache dinaikkan ke REV333 agar CSS baru diterapkan pada GitHub Pages/PWA.

Deploy:
1. Copy seluruh isi folder ini ke root repository GitHub Pages tf-analyzer-analyst-ios.
2. Commit dan Push ke branch main.
3. Tunggu GitHub Pages selesai deploy.
4. Pada browser/iOS, refresh/reopen PWA. Jika tampilan lama masih ter-cache, tutup PWA sepenuhnya lalu buka kembali URL yang sama.
