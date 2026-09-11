# TF Analyzer Analyst V1.16.86

## REV372 — Mobile Remote Dashboard Home Routing Fix

Release ini memperbaiki tombol **Buka Dashboard** pada halaman **Remote** di Android/iOS/Browser.

### Perbaikan utama
- Tombol **Remote > Buka Dashboard** sekarang kembali ke halaman depan aplikasi Mobile (Table 1).
- Tombol tersebut tidak lagi mengirim command `open_dashboard` ke Plugin PC.
- Karena itu menekan Dashboard dari Remote tidak akan membuka Dashboard milik PC/extension.
- Remote page ditutup terlebih dahulu, kemudian navigasi Mobile diarahkan ke halaman depan aplikasi.
- Update, Submit, Refresh/Reset, Scan From iSignal, dan command Remote lainnya tidak diubah.
- PWA/service-worker cache dinaikkan ke REV372 agar iOS/Browser mengambil hotfix terbaru.

### Browser / iOS
Source utama GitHub Pages sudah diperbarui dan bundle ZIP REV372 diterbitkan pada release ini.

**Build:** v1.16.86 • REV372

**Asset:** `TF_Analyzer_Analyst_iOS_BROWSER_REV372_REMOTE_DASHBOARD_HOME_FIX.zip`
