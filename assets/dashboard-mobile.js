document.body.innerHTML = "\n<!-- Scan Animation Overlay (shown before dashboard content while scan is running) -->\n<div id=\"tf-dashboard-scan-overlay\">\n<div id=\"tf-dashboard-scan-card\">\n<div class=\"tf-scan-head\">\n<div>\n<div class=\"tf-scan-title\">Scanning sedang berjalan...</div>\n<div class=\"tf-scan-sub\">Progress di sini sinkron dengan Status Scan Channel (sidebar extension).</div>\n</div>\n<button class=\"tf-scan-btn\" disabled=\"\" id=\"tf-dashboard-scan-skip\" type=\"button\">Lihat Dashboard</button>\n</div>\n<div class=\"tf-scan-bar\"><div id=\"tf-dashboard-scan-bar-fill\"></div></div>\n<div class=\"tf-scan-lists\">\n<div>\n<div class=\"tf-scan-section-title\">Overall</div>\n<div class=\"tf-scan-list\" id=\"tf-dashboard-scan-overall\"></div>\n</div>\n<div>\n<div class=\"tf-scan-section-title\">Batch scanning done!/progress...</div>\n<div class=\"tf-scan-list\" id=\"tf-dashboard-scan-detail\"></div>\n</div>\n</div>\n</div>\n</div>\n<div class=\"page\" id=\"tf-dashboard-main\">\n<header class=\"dashboard-header\">\n<div class=\"profile-row\">\n<img alt=\"User avatar\" class=\"dashboard-avatar\" id=\"dashboard-user-avatar\" src=\"\"/>\n<div class=\"profile-main\">\n<div class=\"profile-name\" id=\"dashboard-user-name\">User belum login</div>\n<div class=\"profile-status\">\n<span class=\"status-dot\"></span>\n<span id=\"dashboard-user-status-text\">Offline</span>\n</div>\n</div>\n</div>\n<div class=\"title-block\">\n<h1>TF Multi-Analyst Dashboard</h1>\n<p class=\"sub-heading\">\n          Data di halaman ini di-load dari hasil scan extension Chrome\n          (<span class=\"mono\">tfMonthlyStats</span> &amp; <span class=\"mono\">tfHistorySignals</span>)\n          dan bisa kamu kombinasikan dengan pengaturan Balance &amp; Risk untuk menghitung Lot &amp; hasil $$.\n        </p>\n</div>\n</header>\n<!-- ==================== Top Navigator Menu ==================== -->\n<div class=\"tf-top-nav-wrap\" id=\"tf-top-nav-wrap\">\n<nav aria-label=\"Navigator\" class=\"tf-top-nav\">\n<ul>\n<li class=\"active\">\n<a class=\"tf-nav-link\" data-tf-url=\"dashboard.html\" href=\"dashboard.html\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"\"/>\n<span>Beranda</span>\n</div>\n</a>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li class=\"tf-dropdown\">\n<a class=\"tf-nav-link\" data-tf-parent=\"1\" data-tf-url=\"#\" href=\"#\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"\"/>\n<span>iSignal <span class=\"tf-caret\">▾</span></span>\n</div>\n</a>\n<ul aria-label=\"iSignal submenu\" class=\"tf-submenu\">\n<li><a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/isignal/\" href=\"https://account.tradersfamily.id/channels/isignal/\">iSignal Analis</a></li>\n<li><a class=\"tf-nav-link\" data-tf-url=\"iSignalUsers.html\" href=\"iSignalUsers.html\">iSignal Users</a></li>\n</ul>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li class=\"tf-dropdown\">\n<a class=\"tf-nav-link\" data-tf-parent=\"1\" data-tf-url=\"#\" href=\"#\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"\"/>\n<span>TF Copy Signal <span class=\"tf-caret\">▾</span></span>\n</div>\n</a>\n<ul aria-label=\"TF Copy Signal submenu\" class=\"tf-submenu\">\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/\" href=\"https://account.tradersfamily.id/channels/\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"\"/>\n<span>Beranda</span>\n</div>\n</a>\n</li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/browse/?v=symbol\" href=\"https://account.tradersfamily.id/channels/browse/?v=symbol\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"\"/>\n<span>Browse Channel</span>\n</div>\n</a>\n</li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/my/\" href=\"https://account.tradersfamily.id/channels/my/\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"\"/>\n<span>My Channels</span>\n</div>\n</a>\n</li>\n</ul>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/profile/u/155921/?tab=settings\" href=\"https://account.tradersfamily.id/profile/u/155921/?tab=settings\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"\"/>\n<span>Profile</span>\n</div>\n</a>\n</li>\n</ul>\n</nav>\n</div>\n<!-- ==================== End Top Navigator Menu ==================== -->\n<section class=\"card\" id=\"section-summary\">\n<div class=\"card-header\">\n<div class=\"card-title-group\">\n<h2>Table 1 – History Signal – Money Management</h2>\n<div class=\"card-badge\">\n<span class=\"card-badge-dot\"></span>\n<span>Lot Size per Analyst</span>\n</div>\n</div>\n<div class=\"section-note\">\n          Rumus lot:<br/>\n<span class=\"mono\">(Balance × Risk% / Trade) ÷ (Select SL PIPS) ÷ ($ / Pips)</span>\n</div>\n<div class=\"section-note\" id=\"tf-scanned-by\" style=\"margin-top: 6px;\"></div>\n</div>\n<div class=\"section-note\" style=\"margin-top: 4px;\">\n<div class=\"small-muted\" style=\"margin: 0 0 6px 0; display:flex; align-items:center; gap:10px; flex-wrap:wrap;\">\n<span>\n              Price is scanned from Investing.com\n              <a class=\"nav fxLogoLink\" id=\"tfInvestingProLogoLink\" href=\"https://id.investing.com/pro\" target=\"_blank\" rel=\"noopener\">\n                    <img id=\"investingProNavMenuItemWhite\" src=\"\" alt=\"InvestingPro\" width=\"70\" height=\"12\" style=\"position:relative;top:2px;\">\n                    <img id=\"investingProNavMenuItemBlack\" src=\"\" alt=\"InvestingPro\" width=\"70\" height=\"12\" style=\"position:relative;top:2px;\">\n                  </a>\n</span>\n<span aria-hidden=\"true\" class=\"tf-note-sep\">|</span>\n<a class=\"tfRefreshPriceLink\" href=\"#\" id=\"tf-refresh-price-link\" title=\"Refresh Investing Price\">\n<span>Refresh Price</span>\n<svg class=\"svgMblExtend\" fill=\"none\" height=\"26\" style=\"display: block;border-radius: 10%;\" viewbox=\"0 0 26 26\" width=\"26\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6.81061 8.0437V4.3309H3.09521\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M19.1919 17.9497V21.6625H22.9047\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M10.5208 2.76563C11.3332 2.57084 12.1657 2.47223 13.0012 2.47183C15.2233 2.47216 17.3883 3.17581 19.1861 4.48199C20.9838 5.78816 22.322 7.62982 23.0089 9.74313C23.6958 11.8564 23.6962 14.1329 23.0101 16.2465C22.3239 18.3601 20.9864 20.2022 19.1892 21.509\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M15.4764 23.2277C13.1085 23.8014 10.6148 23.5358 8.4209 22.4762C6.22695 21.4166 4.46859 19.6286 3.44576 17.4173C2.42292 15.2059 2.19898 12.7082 2.81213 10.3502C3.42528 7.9922 4.83753 5.91995 6.80799 4.48695\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M11.1436 14.2375V14.5599C11.147 14.9714 11.3129 15.3649 11.605 15.6546C11.8972 15.9444 12.2921 16.107 12.7036 16.1069H13.3224C13.7339 16.107 14.1287 15.9444 14.4209 15.6546C14.7131 15.3649 14.8789 14.9714 14.8824 14.5599C14.8805 14.2899 14.7947 14.0272 14.6367 13.8082C14.4788 13.5893 14.2566 13.4249 14.001 13.3379L12.051 12.6879C11.7953 12.601 11.5731 12.4366 11.4152 12.2177C11.2572 11.9987 11.1714 11.7359 11.1696 11.4659C11.173 11.0545 11.3389 10.661 11.631 10.3713C11.9232 10.0815 12.3181 9.91893 12.7296 9.91895H13.3484C13.7598 9.91893 14.1547 10.0815 14.4469 10.3713C14.7391 10.661 14.9049 11.0545 14.9084 11.4659V11.7753\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M13 9.646V8.047\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M13 17.953V16.3384\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n</svg>\n</a>\n</div>\n\n<div id=\"tf-wait-price-note\">\n  <span aria-hidden=\"true\" class=\"mini-spinner tight\"></span>\n  <span>Menunggu price dari Investing.com… tabel lainnya akan muncul setelah price tersedia.</span>\n</div>\n<div class=\"pip-table-compact-wrap\">\n<table class=\"pip-table-compact pip-table-side\">\n<thead>\n<tr>\n<th class=\"pipTh\">Pair</th>\n<th class=\"pipTh\">Price <span aria-hidden=\"true\" class=\"mini-spinner pipPriceSpinner\" style=\"display:none;\"></span></th>\n<th class=\"pipTh\">$/Pip ( 1 Lot )</th>\n</tr>\n</thead>\n<tbody id=\"pip-table-compact-body-left\"></tbody>\n</table>\n<table class=\"pip-table-compact pip-table-side\">\n<thead>\n<tr>\n<th class=\"pipTh\">Pair</th>\n<th class=\"pipTh\">Price <span aria-hidden=\"true\" class=\"mini-spinner pipPriceSpinner\" style=\"display:none;\"></span></th>\n<th class=\"pipTh\">$/Pip ( 1 Lot )</th>\n</tr>\n</thead>\n<tbody id=\"pip-table-compact-body-right\"></tbody>\n</table>\n</div>\n\n<div class=\"tf-perf-wrap\" id=\"tf-perf-wrap\" style=\"display:none;\">\n  <div class=\"tf-perf-head\">\n    <div class=\"tf-perf-overall-title\">Performance/Probability Analis</div>\n    <!-- Metric selector (TP/SL | Pips | Dollar) -->\n    <div class=\"equity-filter-row tf-perf-metric-row\" style=\"margin-top: 0; margin-bottom: 0;\">\n      <div class=\"tf-perf-metric-risk-flex\" style=\"display:flex; align-items:center; gap: 14px; flex-wrap: wrap; width: 100%;\">\n        <div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n          <label for=\"tf-perf-metric-select\" style=\"min-width: 72px;\">Filter by:</label>\n          <select class=\"form-input\" id=\"tf-perf-metric-select\" style=\"width: 170px; padding: 6px 10px;\">\n            <option value=\"tp_sl\">TP/SL</option>\n            <option value=\"pips\">Pips</option>\n            <option value=\"usd\">Dollar</option>\n          </select>\n        </div>\n\n        <!-- Single-calendar-month selector (synced with Table 2, Equity Curve & Table 3) -->\n        <div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n          <label for=\"tf-single-month-select-perf\" style=\"min-width: 56px;\">Month:</label>\n          <select class=\"form-input tf-single-month-select\" id=\"tf-single-month-select-perf\" style=\"width: 170px; padding: 6px 10px;\"></select>\n        </div>\n\n        <!-- Risk Mode selector (only when Filter by: Dollar) -->\n        <div class=\"equity-date-group\" id=\"tf-perf-risk-group\" style=\"align-items: center; gap: 8px; display:none; \">\n          <label for=\"tf-perf-risk-mode-select\" style=\"min-width: 72px;\">Risk Mode:</label>\n          <select class=\"form-input\" id=\"tf-perf-risk-mode-select\" style=\"width: 170px; padding: 6px 10px;\">\n            <option value=\"fixed\">Fixed Lot</option>\n            <option value=\"compound\">Compound %</option>\n          </select>\n        </div>\n\n        <!-- Month selector (only when Risk Mode: Compound %) -->\n        <div class=\"equity-date-group\" id=\"tf-perf-compound-group\" style=\"align-items: center; gap: 8px; display:none;\">\n          <label for=\"tf-perf-compound-months-select\" style=\"min-width: 56px;\">Month:</label>\n          <select class=\"form-input\" id=\"tf-perf-compound-months-select\" style=\"width: 120px; padding: 6px 10px;\"></select>\n        </div>\n      </div>\n    </div>\n    <!-- Time Range buttons (sync with Equity Curve & Table 3) -->\n    <div class=\"tf-time-range-row tf-perf-time-range-row\" id=\"tf-time-range-row-perf\">\n      <span class=\"tf-time-range-label\">Time Range:</span>\n      <div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-perf\"></div>\n    </div>\n  </div>\n\n  <!-- Overall winrate bar spanning both tables (based on checked analysts) -->\n  <div class=\"tf-perf-overall\" id=\"tf-perf-overall\" style=\"display:none;\">\n    <div class=\"tf-perf-overall-row\">\n      <div class=\"tf-perf-overall-label\" id=\"tf-perf-overall-label\">Overall (All Analysts)</div>\n      <div class=\"tf-perf-count mono\" id=\"tf-perf-overall-count\"><span class=\"tf-perf-win\" id=\"tf-perf-overall-win\">0</span>/<span class=\"tf-perf-loss\" id=\"tf-perf-overall-loss\">0</span></div>\n      <div class=\"tf-perf-bar-track\" aria-hidden=\"true\">\n        <div class=\"tf-perf-bar-fill\" id=\"tf-perf-overall-fill\" style=\"width:0%\"></div>\n      </div>\n      <div class=\"tf-perf-overall-pct mono\" id=\"tf-perf-overall-pct\">0%</div>\n    </div>\n  </div>\n\n  <div class=\"tf-perf-card\">\n    <table class=\"tf-perf-table\">\n      <tbody id=\"tf-perf-body-left\"></tbody>\n    </table>\n  </div>\n  <div class=\"tf-perf-card\">\n    <table class=\"tf-perf-table\">\n      <tbody id=\"tf-perf-body-right\"></tbody>\n    </table>\n  </div>\n</div>\n\n</div>\n<div class=\"controls-row tf-mm-controls-row tf-mm-primary-row\">\n<div class=\"form-group tf-mm-main-input\">\n<label class=\"form-label\" for=\"balance-input\">Balance (USD)</label>\n<input class=\"form-input\" id=\"balance-input\" min=\"0\" placeholder=\"5000\" step=\"1\" type=\"number\"/>\n</div>\n<button class=\"btn tf-mm-action-btn\" id=\"apply-balance-btn\" type=\"button\">\n<span class=\"btn-icon\">$</span>\n          Apply Balance\n        </button>\n<div class=\"form-group tf-mm-main-input\">\n<label class=\"form-label\" for=\"risk-input\">Risk % / Trade</label>\n<input class=\"form-input\" id=\"risk-input\" min=\"0\" placeholder=\"1\" step=\"0.1\" type=\"number\"/>\n</div>\n<button class=\"btn tf-mm-action-btn\" id=\"apply-risk-btn\" type=\"button\">\n<span class=\"btn-icon\">%</span>\n          Apply Risk\n        </button>\n<button class=\"btn btn-ghost tf-mm-action-btn\" id=\"reset-defaults-btn\" type=\"button\">\n          Reset ke Default\n        </button>\n</div>\n<!-- REV288: Swap + Commission + Withdraw aligned on one second row -->\n<div class=\"controls-row tf-mm-secondary-row tf-mm-table3-layout-v301\" id=\"tf-mm-cost-withdraw-row\">\n  <div class=\"tf-mm-cost-line-v301\" title=\"Aktifkan biaya Swap pada setiap trade\">\n    <label for=\"swap-rate-input\">Swap ($/Lot):</label>\n    <div class=\"tf-withdraw-inline\">\n      <span class=\"tf-switch tf-cost-switch\"><input id=\"swap-enabled-toggle\" type=\"checkbox\"/></span>\n      <input class=\"form-input\" id=\"swap-rate-input\" min=\"0\" placeholder=\"9.01\" step=\"0.01\" title=\"Biaya swap rata-rata per 1.00 lot per trade. Perubahan langsung diterapkan.\" type=\"number\"/>\n    </div>\n  </div>\n  <div class=\"tf-mm-cost-line-v301\" title=\"Aktifkan biaya Commission pada setiap trade\">\n    <label for=\"commission-rate-input\">Comm ($/Lot):</label>\n    <div class=\"tf-withdraw-inline\">\n      <span class=\"tf-switch tf-cost-switch\"><input id=\"commission-enabled-toggle\" type=\"checkbox\"/></span>\n      <input class=\"form-input\" id=\"commission-rate-input\" min=\"0\" placeholder=\"20\" step=\"0.01\" title=\"Commission per 1.00 lot per trade. Perubahan langsung diterapkan.\" type=\"number\"/>\n    </div>\n  </div>\n  <div class=\"controls-row tf-mm-withdraw-line-v301\" id=\"withdraw-controls-row\" style=\"margin:0; gap:10px; align-items:center; justify-content:flex-start;\">\n    <div class=\"equity-date-group tf-withdraw-inline-row\" style=\"align-items:center; gap:8px;\">\n      <label class=\"tf-withdraw-label-row\" for=\"withdraw-amount-input\"><span>Withdraw ($):</span> <span class=\"tf-withdraw-average\" id=\"withdraw-average-inline\">average : -</span></label>\n      <div class=\"tf-withdraw-inline\" style=\"gap:10px;\">\n        <span class=\"tf-switch tf-cost-switch tf-withdraw-toggle-switch\" title=\"Enable Withdraw\"><input id=\"withdraw-enabled-toggle\" type=\"checkbox\"/></span>\n        <input class=\"form-input\" id=\"withdraw-amount-input\" min=\"0\" placeholder=\"average : -\" step=\"1\" type=\"number\"/>\n      </div>\n    </div>\n    <select class=\"form-input\" id=\"withdraw-months-select\" style=\"width:140px; padding:6px 10px;\">\n      <option selected=\"\" value=\"1\">1 month</option><option value=\"2\">2 month</option><option value=\"3\">3 month</option><option value=\"4\">4 month</option><option value=\"5\">5 month</option><option value=\"6\">6 month</option><option value=\"7\">7 month</option><option value=\"8\">8 month</option><option value=\"9\">9 month</option><option value=\"10\">10 month</option><option value=\"11\">11 month</option><option value=\"12\">12 month</option>\n    </select>\n    <button class=\"btn tf-mm-withdraw-btn\" id=\"withdraw-submit-btn\" type=\"button\"><span class=\"btn-icon\">$</span>Apply Withdraw</button>\n    <div class=\"tf-withdraw-max-warning\" id=\"withdraw-max-warning\" style=\"display:none; flex-basis:100%;\"></div>\n  </div>\n</div>\n<div class=\"section-note\" id=\"rule1-withdraw-note\" style=\"color:#ef4444; font-weight:600; margin-bottom: 8px; display:none;\">\n  Jika trade terakhir di akhir bulan sebelumnya belum mengalami kenaikan <strong>10%</strong> dari saldo awal bulan tersebut (awal bulan pertama pakai <strong>Balance</strong> / <strong>Balance Compounded</strong>, bulan berikutnya pakai <strong>Balance PnL ($)</strong> dari <strong>trade terakhir di bulan sebelumnya</strong>), maka transaksi <strong>Withdraw</strong> di bulan berikutnya akan otomatis <strong>tidak dicentang</strong>! <span style=\"opacity:.9;\">(Berlaku jika akun belum pernah mencapai kenaikan total <strong>100%</strong>.)</span>\n</div>\n<div class=\"section-note\" id=\"rule2-withdraw-note\" style=\"color:#ef4444; font-weight:600; margin-bottom: 8px; display:none;\">\n  Jika trade terakhir di akhir bulan sebelumnya mengalami penurunan <strong>20%</strong> dari saldo awal bulan tersebut (awal bulan pertama pakai <strong>Balance</strong> / <strong>Balance Compounded</strong>, bulan berikutnya pakai <strong>Balance PnL ($)</strong> dari <strong>trade terakhir di bulan sebelumnya</strong>), maka transaksi <strong>Withdraw</strong> di bulan berikutnya juga otomatis <strong>tidak dicentang</strong>! <span style=\"opacity:.9;\">(Berlaku jika akun belum pernah mencapai kenaikan total <strong>100%</strong>.)</span>\n</div>\n<div class=\"section-note\" id=\"rule3-withdraw-note\" style=\"color:#ef4444; font-weight:600; margin-bottom: 8px; display:none;\">\n  Jika akun <strong>pernah</strong> mencapai kenaikan total <strong>100%</strong> (Balance PnL ($) pernah <strong>&gt;= 2x</strong> saldo awal bulan pertama / trade pertama), maka mulai <strong>bulan berikutnya</strong> ketentuan kenaikan <strong>10%</strong> <strong>dan</strong> penurunan <strong>20%</strong> <strong>tidak diperlukan</strong> lagi.\n</div>\n<p class=\"small-muted\" style=\"margin-bottom: 8px;\">\n        Saat kamu menekan <strong>Apply</strong>, kolom <span class=\"mono\">Balance</span>, <span class=\"mono\">Risk % / Trade</span>,\n        dan <span class=\"mono\">LOT</span> di tabel akan otomatis ter-update untuk semua analis, dan nilai <span class=\"mono\">$</span> di Table 2 ikut menyesuaikan.\n      </p>\n<!-- Analyst & Pair filter for Table 1, Table 2 and Equity Curve. When the\n           user toggles an analyst or its pairs, Table 1 and Table 2 update\n           accordingly. Table 3 (history) remains unaffected. -->\n<div class=\"controls-row\" id=\"analyst-filter-row\" style=\"margin-bottom: 10px;\">\n<label style=\"font-size: 12px; margin-right: 8px;\">Filter:</label>\n<div id=\"analyst-filter-container\"></div>\n</div>\n<div class=\"table-wrapper\">\n<div class=\"table-scroll monthly-table-scroll\">\n<table id=\"summary-table\">\n<thead>\n<tr>\n<th style=\"width: 14%;\">Nama Analis</th>\n<th style=\"width: 14%;\">Pair</th>\n<th style=\"width: 14%;\">Select SL Pips</th>\n<th class=\"text-right\" style=\"width: 10%;\">SL FIXED PIPS (Avg. 6 Months)</th>\n<th class=\"text-right\" style=\"width: 10%;\">Avg. SL PIPS</th>\n<th class=\"text-right\" style=\"width: 10%;\">$ / Pips</th>\n<th class=\"text-right\" style=\"width: 10%;\">Lot</th>\n<th class=\"text-right\" style=\"width: 10%;\">Balance</th>\n<th class=\"text-right\" style=\"width: 8%;\">Risk % / Trade</th>\n</tr>\n</thead>\n<tbody></tbody>\n</table>\n</div>\n</div>\n</section>\n<section class=\"card\" id=\"section-monthly\">\n<div class=\"card-header\">\n<div class=\"card-title-group\">\n<h2>Table 2 – Statistics – Rekap Pips &amp; Signals per Bulan</h2>\n<div class=\"card-badge\">\n<span class=\"card-badge-dot\"></span>\n<span>Per Month Overview</span>\n</div>\n</div>\n<div class=\"section-note\">\n          Nilai di bawah bisa otomatis terisi dari hasil scan, dan juga bisa kamu edit manual.\n        </div>\n</div>\n<div class=\"chip-row\" style=\"margin-bottom: 6px;\">\n<span class=\"chip\">Format isi tiap sel bulan: baris 1 = <span class=\"mono\">Pips</span>, baris 2 = <span class=\"mono\">Signals</span>, baris 3 = <span class=\"mono\">$ (pips × lot × $/pips)</span>.</span>\n<span class=\"chip\">Lot diambil dari Table 1 (Balance &amp; Risk yang aktif).</span>\n</div>\n<!-- Risk Mode (for Table 2 monthly $ calculation) -->\n<div class=\"controls-row\" style=\"margin-bottom: 10px; align-items: center;\">\n<div class=\"equity-filter-row\" style=\"margin-top: 0;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"risk-mode-select-monthly\" style=\"min-width: 72px;\">Risk Mode:</label>\n<select class=\"form-input\" id=\"risk-mode-select-monthly\" style=\"width: 170px; padding: 6px 10px;\">\n<option selected=\"\" value=\"fixed\">Fixed Lot</option>\n<option value=\"compound\">Compound %</option>\n</select>\n</div>\n</div>\n<div class=\"equity-filter-row\" id=\"compound-sub-row-monthly\" style=\"margin-top: 0; display: none;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"compound-months-select-monthly\" style=\"min-width: 110px;\">Compound (%):</label>\n<select class=\"form-input\" id=\"compound-months-select-monthly\" style=\"width: 170px; padding: 6px 10px;\"></select>\n</div>\n</div>\n</div>\n<!-- Single-calendar-month selector (sync with Performance, Equity Curve & Table 3) -->\n<div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 8px;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"tf-single-month-select-monthly\" style=\"min-width: 150px;\">Time Range per Month:</label>\n<select class=\"form-input tf-single-month-select\" id=\"tf-single-month-select-monthly\" style=\"width: 190px; padding: 6px 10px;\"></select>\n<div class=\"tf-cost-sync-tickers\" data-tf-cost-scope=\"monthly\" title=\"Sinkron dengan Swap/Comm di Table 1\">\n<label class=\"tf-cost-ticker\"><input id=\"swap-enabled-ticker-monthly\" data-tf-cost-kind=\"swap\" type=\"checkbox\"/> <span>Swap</span></label>\n<label class=\"tf-cost-ticker\"><input id=\"commission-enabled-ticker-monthly\" data-tf-cost-kind=\"commission\" type=\"checkbox\"/> <span>Comm</span></label>\n</div>\n</div>\n</div>\n<!-- Time Range buttons (sync with Equity Curve & Table 3) -->\n<div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 8px;\">\n<div class=\"tf-time-range-row\" id=\"tf-time-range-row-monthly\">\n<span class=\"tf-time-range-label\">Time Range:</span>\n<div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-monthly\"></div>\n</div>\n</div>\n<div class=\"controls-row\" id=\"analyst-filter-row-monthly\" style=\"margin-bottom: 10px; justify-content: flex-start; gap: 10px;\">\n<label style=\"font-size: 12px; margin-right: 8px;\">Filter:</label>\n<div id=\"analyst-filter-container-monthly\"></div>\n</div>\n<div class=\"table-wrapper\">\n<div class=\"table-scroll monthly-table-scroll\">\n<table class=\"monthly-table\" id=\"monthly-table\">\n<thead>\n<tr>\n<th class=\"monthly-sticky-col-1\">ACTION</th>\n<th class=\"monthly-sticky-col-2\">NAMA ANALIS</th>\n<th class=\"monthly-sticky-col-3\">PAIR</th>\n</tr>\n</thead>\n<tbody id=\"monthly-body\"></tbody>\n</table>\n</div>\n</div>\n<div class=\"section-note\" id=\"income-minmax-range-note\" style=\"margin-top: 6px;\">\n<div id=\"income-minmax-range-text\">min-max income from January 2024 s.d -</div>\n</div>\n<div class=\"chip-row tf-income-chip-row\" style=\"margin-top: 6px;\">\n<span class=\"chip\"><strong>Income Minimum:</strong> <span class=\"mono\" id=\"income-min\">-</span></span>\n<span class=\"chip\"><strong>Income Maksimum:</strong> <span class=\"mono\" id=\"income-max\">-</span></span>\n</div>\n</section>\n<section class=\"card\" id=\"equity-curve-section\">\n<div class=\"card-header\">\n<div class=\"card-title-group\">\n<h2 id=\"equity-curve-title\">Equity Curve – Akumulasi Pips per Trade</h2>\n<div class=\"card-badge\">\n<span class=\"card-badge-dot\"></span>\n<span id=\"equity-curve-badge-text\">Hover untuk detail $ dan Equity</span>\n</div>\n</div>\n</div>\n<div class=\"section-note\">\n        Grafik ini menggunakan urutan Table 3 (History Signal) + pengaturan <span class=\"mono\">Balance</span> dan\n        <span class=\"mono\">Risk % / Trade</span> saat ini. Geser cursor di garis untuk melihat\n        <span class=\"mono\">Tanggal</span>, <span class=\"mono\">Nama Analis</span>,\n        <span class=\"mono\">$TP / $SL</span>, dan <span class=\"mono\">Equity</span>.\n      </div>\n<div class=\"equity-filter-row\">\n<div class=\"equity-date-group\">\n<label for=\"equity-start-date\">Filter tanggal:</label>\n<input id=\"equity-start-date\" type=\"date\"/>\n<span class=\"equity-date-separator\">sampai</span>\n<input id=\"equity-end-date\" type=\"date\"/>\n<button class=\"btn btn-ghost\" id=\"equity-apply-filter-btn\" type=\"button\">Apply</button>\n<button class=\"btn btn-ghost\" id=\"equity-reset-filter-btn\" type=\"button\">Reset</button>\n</div>\n<p class=\"small-muted\" style=\"margin: 2px 0 0;\">\n          Default: mengikuti tanggal terkecil &amp; terbesar dari data history yang tersedia.<br/>\n          Catatan: urutan akan otomatis dari tanggal paling lama ke paling baru.\n        </p>\n</div>\n<!-- Equity curve metric selector + Withdraw controls (sync with Table 1) -->\n<div class=\"controls-row\" id=\"equity-metric-withdraw-row\" style=\"margin-top: 0; margin-bottom: 10px; align-items: center;\">\n<div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 0;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"equity-metric-select\" style=\"min-width: 72px;\">Filter by:</label>\n<select class=\"form-input\" id=\"equity-metric-select\" style=\"width: 170px; padding: 6px 10px;\">\n<option value=\"pips\">PnL Pips</option>\n<option selected=\"\" value=\"usd\">PnL ($)</option>\n</select>\n</div>\n</div>\n<div class=\"controls-row tf-equity-withdraw-table3-v301\" id=\"withdraw-controls-row-equity\" style=\"margin:0; gap:10px; align-items:center; justify-content:flex-start;\">\n  <div class=\"equity-date-group tf-withdraw-inline-row\" style=\"align-items:center; gap:8px;\">\n    <label for=\"withdraw-amount-input-equity\" style=\"min-width:fit-content;\">Withdraw ($):</label>\n    <div class=\"tf-withdraw-inline\" style=\"gap:10px;\">\n      <span class=\"tf-switch\" title=\"Enable Withdraw\"><input id=\"withdraw-enabled-toggle-equity\" type=\"checkbox\"/></span>\n      <input class=\"form-input tf-withdraw-input-equity\" id=\"withdraw-amount-input-equity\" min=\"0\" placeholder=\"average : -\" step=\"1\" type=\"number\"/>\n    </div>\n  </div>\n  <select class=\"form-input\" id=\"withdraw-months-select-equity\" style=\"width:140px; padding:6px 10px;\">\n    <option selected=\"\" value=\"1\">1 month</option><option value=\"2\">2 month</option><option value=\"3\">3 month</option><option value=\"4\">4 month</option><option value=\"5\">5 month</option><option value=\"6\">6 month</option><option value=\"7\">7 month</option><option value=\"8\">8 month</option><option value=\"9\">9 month</option><option value=\"10\">10 month</option><option value=\"11\">11 month</option><option value=\"12\">12 month</option>\n  </select>\n  <button class=\"btn\" id=\"withdraw-submit-btn-equity\" type=\"button\"><span class=\"btn-icon\">$</span>Apply Withdraw</button>\n  <div class=\"tf-withdraw-max-warning\" id=\"withdraw-max-warning-equity\" style=\"display:none; flex-basis:100%;\"></div>\n</div>\n</div>\n<div class=\"controls-row\" style=\"margin-bottom: 10px; align-items: center;\">\n<div class=\"equity-filter-row\" style=\"margin-top: 0;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"risk-mode-select\" style=\"min-width: 72px;\">Risk Mode:</label>\n<select class=\"form-input\" id=\"risk-mode-select\" style=\"width: 170px; padding: 6px 10px;\">\n<option selected=\"\" value=\"fixed\">Fixed Lot</option>\n<option value=\"compound\">Compound %</option>\n</select>\n</div>\n</div>\n<div class=\"equity-filter-row\" id=\"compound-sub-row-equity\" style=\"margin-top: 0; display: none;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<select class=\"form-input\" id=\"compound-months-select-equity\" style=\"width: 170px; padding: 6px 10px;\"></select>\n</div>\n</div>\n</div>\n<!-- Single-calendar-month selector (sync with Performance, Table 2 & Table 3) -->\n<div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 8px;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"tf-single-month-select-equity\" style=\"min-width: 150px;\">Time Range per Month:</label>\n<select class=\"form-input tf-single-month-select\" id=\"tf-single-month-select-equity\" style=\"width: 190px; padding: 6px 10px;\"></select>\n<div class=\"tf-cost-sync-tickers\" data-tf-cost-scope=\"equity\" title=\"Sinkron dengan Swap/Comm di Table 1\">\n<label class=\"tf-cost-ticker\"><input id=\"swap-enabled-ticker-equity\" data-tf-cost-kind=\"swap\" type=\"checkbox\"/> <span>Swap</span></label>\n<label class=\"tf-cost-ticker\"><input id=\"commission-enabled-ticker-equity\" data-tf-cost-kind=\"commission\" type=\"checkbox\"/> <span>Comm</span></label>\n</div>\n</div>\n</div>\n<!-- Time Range buttons (sync with Table 3) -->\n<div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 8px;\">\n<div class=\"tf-time-range-row\" id=\"tf-time-range-row-equity\">\n<span class=\"tf-time-range-label\">Time Range:</span>\n<div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-equity\"></div>\n</div>\n</div>\n<div class=\"controls-row\" id=\"analyst-filter-row-equity\" style=\"margin-bottom: 10px; justify-content: flex-start; gap: 10px;\">\n<label style=\"font-size: 12px; margin-right: 8px;\">Filter:</label>\n<div id=\"analyst-filter-container-equity\"></div>\n</div>\n<div class=\"equity-curve-wrapper\">\n<canvas id=\"equity-curve-canvas\"></canvas>\n<div id=\"equity-empty-note\">\n          Belum ada data history untuk digambar. Import data dari TF Multi-Analyst Desktop.\n        </div>\n<div class=\"equity-tooltip\" id=\"equity-tooltip\" style=\"display: none;\"></div>\n</div>\n\n      <!-- Chart mode selector (default: LINE) -->\n      <div class=\"tf-equity-chartmode-row\" id=\"tf-equity-chartmode-row\">\n        <span class=\"tf-time-range-label\">Chart:</span>\n        <div class=\"tf-time-range-buttons\" id=\"tf-equity-chartmode-buttons\">\n          <button class=\"tf-time-range-btn active\" type=\"button\" data-mode=\"line\">LINE Chart</button>\n          <button class=\"tf-time-range-btn\" type=\"button\" data-mode=\"candle\">Candle Stick (D1)</button>\n        </div>\n      </div>\n<div class=\"equity-drawdown-summary\" id=\"equity-drawdown-summary\">\n<div class=\"equity-drawdown-summary-title\">\n          Ringkasan Risiko — Consecutive Loss &amp; Maximum Equity Drawdown\n        </div>\n<div id=\"equity-drawdown-detail\">\n          Belum ada data drawdown. Import data dari TF Multi-Analyst Desktop terlebih dahulu.\n        </div>\n</div>\n</section>\n<section class=\"card\" id=\"section-history\">\n<div class=\"card-header\">\n<div class=\"card-title-group\">\n<h2>Table 3 – History Signal – Perhitungan Hasil per Trade</h2>\n<div class=\"card-badge\">\n<span class=\"card-badge-dot\"></span>\n<span>Sorted by Closed Date</span>\n</div>\n</div>\n</div>\n<div class=\"chip-row\">\n<span class=\"chip\">Pips &amp; $ TP ditampilkan <span class=\"tp\">hijau</span>, Pips &amp; $ SL ditampilkan <span class=\"sl\">merah</span>.</span>\n<span class=\"chip\">Lot &amp; $$ akan mengikuti Balance &amp; Risk dari Table 1.</span>\n</div>\n<div class=\"controls-row\" style=\"margin-bottom: 6px;\">\n<div class=\"equity-filter-row\" style=\"margin-top: 6px;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"risk-mode-select-history\" style=\"min-width: 72px;\">Risk Mode:</label>\n<select class=\"form-input\" id=\"risk-mode-select-history\" style=\"width: 170px; padding: 6px 10px;\">\n<option selected=\"\" value=\"fixed\">Fixed Lot</option>\n<option value=\"compound\">Compound %</option>\n</select>\n</div>\n</div>\n<div class=\"equity-filter-row\" id=\"compound-sub-row-history\" style=\"margin-top: 0; display: none;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"compound-months-select-history\" style=\"min-width: 110px;\">Compound (%):</label>\n<select class=\"form-input\" id=\"compound-months-select-history\" style=\"width: 170px; padding: 6px 10px;\"></select>\n</div>\n</div>\n<span class=\"small-muted\">\n          Trade Pertama di awal bulan yaitu \"Tanggal (Created At)\" <span style=\"color:#ef4444; font-weight:700;\">EQUAL</span> dengan \"Tanggal (Closed At)\".\n          Jika ada trade sebelumnya di \"Tanggal (Created At)\" dan baru <span style=\"color:#ef4444; font-weight:700;\">Closed</span> di \"Tanggal (Closed At)\" berikutnya maka <span style=\"color:#ef4444; font-weight:700;\">NOT EQUAL</span>.\n        </span>\n</div>\n<div class=\"controls-row\" style=\"margin-bottom: 10px; align-items: center; justify-content: space-between;\">\n  <div class=\"controls-row\" style=\"margin:0; gap:8px; align-items:center; justify-content:flex-start;\">\n    <button class=\"btn btn-ghost\" id=\"export-history-pdf-btn\" type=\"button\">\n      Export Table 3 ke PDF\n    </button>\n    <button class=\"btn btn-ghost\" id=\"export-history-excel-btn\" type=\"button\" title=\"Export Table 3 aktif ke Microsoft Excel (.xlsx)\">\n      Convert to Excel .xlsx\n    </button>\n  </div>\n\n  <!-- Withdraw controls (sync with Table 1 & Equity Curve) -->\n  <div class=\"controls-row\" id=\"withdraw-controls-row-history\" style=\"margin: 0; gap: 10px; align-items: center; justify-content: flex-end;\">\n    <div class=\"equity-date-group tf-withdraw-inline-row\" style=\"align-items: center; gap: 8px;\">\n      <label for=\"withdraw-amount-input-history\" style=\"min-width: fit-content;\">Withdraw ($):</label>\n      <div class=\"tf-withdraw-inline\" style=\"gap: 10px;\">\n        <span class=\"tf-switch\" title=\"Enable Withdraw\">\n          <input id=\"withdraw-enabled-toggle-history\" type=\"checkbox\"/>\n        </span>\n        <input class=\"form-input tf-withdraw-input-equity\" id=\"withdraw-amount-input-history\" min=\"0\" placeholder=\"average : -\" step=\"1\" type=\"number\"/>\n      </div>\n    </div>\n\n    <select class=\"form-input\" id=\"withdraw-months-select-history\" style=\"width: 140px; padding: 6px 10px;\">\n      <option selected=\"\" value=\"1\">1 month</option>\n      <option value=\"2\">2 month</option>\n      <option value=\"3\">3 month</option>\n      <option value=\"4\">4 month</option>\n      <option value=\"5\">5 month</option>\n      <option value=\"6\">6 month</option>\n      <option value=\"7\">7 month</option>\n      <option value=\"8\">8 month</option>\n      <option value=\"9\">9 month</option>\n      <option value=\"10\">10 month</option>\n      <option value=\"11\">11 month</option>\n      <option value=\"12\">12 month</option>\n    </select>\n\n    <button class=\"btn\" id=\"withdraw-submit-btn-history\" type=\"button\">\n      <span class=\"btn-icon\">$</span>\n      Apply Withdraw\n    </button>\n\n    <div class=\"tf-withdraw-max-warning\" id=\"withdraw-max-warning-history\" style=\"display:none; flex-basis: 100%;\"></div>\n  </div>\n</div>\n<!-- Filter Tanggal (sync with Equity Curve) -->\n<div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 8px;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px; flex-wrap: wrap;\">\n<label for=\"history-start-date\" style=\"min-width: 92px;\">Filter Tanggal:</label>\n<input class=\"form-input\" id=\"history-start-date\" style=\"width: 160px; padding: 6px 10px;\" type=\"date\"/>\n<span style=\"opacity: 0.7;\">to</span>\n<input class=\"form-input\" id=\"history-end-date\" style=\"width: 160px; padding: 6px 10px;\" type=\"date\"/>\n<button class=\"btn btnmdlnew\" id=\"history-apply-filter-btn\" style=\"padding: 6px 10px;\" type=\"button\">Apply</button>\n<button class=\"btn btnmdlnew\" id=\"history-reset-filter-btn\" style=\"padding: 6px 10px;\" type=\"button\">Reset</button>\n</div>\n<div class=\"small-muted\" id=\"history-date-note\" style=\"margin-top: 4px;\">\n          Default: mengikuti tanggal terkecil &amp; terbesar dari data history yang tersedia.<br/>\n          Catatan: urutan akan otomatis dari tanggal paling lama ke paling baru.\n        </div>\n</div>\n<!-- Single-calendar-month selector (sync with Performance, Table 2 & Equity Curve) -->\n<div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 8px;\">\n<div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n<label for=\"tf-single-month-select-history\" style=\"min-width: 150px;\">Time Range per Month:</label>\n<select class=\"form-input tf-single-month-select\" id=\"tf-single-month-select-history\" style=\"width: 190px; padding: 6px 10px;\"></select>\n<div class=\"tf-cost-sync-tickers\" data-tf-cost-scope=\"history\" title=\"Sinkron dengan Swap/Comm di Table 1\">\n<label class=\"tf-cost-ticker\"><input id=\"swap-enabled-ticker-history\" data-tf-cost-kind=\"swap\" type=\"checkbox\"/> <span>Swap</span></label>\n<label class=\"tf-cost-ticker\"><input id=\"commission-enabled-ticker-history\" data-tf-cost-kind=\"commission\" type=\"checkbox\"/> <span>Comm</span></label>\n</div>\n</div>\n</div>\n<!-- Time Range buttons (sync with Equity Curve) -->\n<div class=\"equity-filter-row\" style=\"margin-top: 0; margin-bottom: 8px;\">\n<div class=\"tf-time-range-row\" id=\"tf-time-range-row-history\">\n<span class=\"tf-time-range-label\">Time Range:</span>\n<div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-history\"></div>\n</div>\n</div>\n<div class=\"controls-row\" id=\"analyst-filter-row-history\" style=\"margin-bottom: 10px; justify-content: flex-start; gap: 10px;\">\n<label style=\"font-size: 12px; margin-right: 8px;\">Filter:</label>\n<div id=\"analyst-filter-container-history\"></div>\n</div>\n<div class=\"controls-row tf-history-column-filter-row\">\n  <label style=\"font-size: 12px; margin-right: 2px;\">Tampilkan Kolom:</label>\n  <div class=\"tf-ticker-dropdown tf-history-column-filter\" id=\"history-column-filter\">\n    <button aria-expanded=\"false\" id=\"history-column-filter-btn\" type=\"button\">\n      <span id=\"history-column-filter-label\">Pilih Kolom</span>\n      <span class=\"caret\"></span>\n    </button>\n    <div class=\"dropdown-content\" id=\"history-column-filter-menu\"></div>\n  </div>\n  <span class=\"small-muted\">Default: Entry, Take Profit, Stop Loss, dan Type disembunyikan.</span>\n  <span class=\"small-muted\" id=\"history-detail-data-status\">Memeriksa data detail History Signal...</span>\n</div>\n<div class=\"table-wrapper\">\n<div class=\"table-scroll\">\n<table id=\"history-table\">\n<thead>\n<tr><th class=\"tf-history-cb-head\" style=\"width: 44px; text-align: center; vertical-align: middle;\"><div style=\"display:flex; align-items:center; justify-content:center;\"><input checked=\"\" id=\"history-all-checkbox\" style=\"transform: translateY(1px);\" type=\"checkbox\"/></div></th>\n<th data-history-col=\"created\" style=\"min-width: 160px;\">Tanggal (Created At)</th>\n<th data-history-col=\"closed\" style=\"min-width: 160px;\">Tanggal (Closed At)</th>\n<th data-history-col=\"analyst\" style=\"min-width: 150px;\">Nama Analis</th>\n<th class=\"text-right\" data-history-col=\"balance\" id=\"history-balance-base-th\" style=\"min-width: 120px;\">Balance</th>\n<th data-history-col=\"entry\" style=\"min-width: 90px;\">Entry</th>\n<th data-history-col=\"takeProfit\" style=\"min-width: 100px;\">Take Profit</th>\n<th data-history-col=\"stopLoss\" style=\"min-width: 100px;\">Stop Loss</th>\n<th data-history-col=\"type\" style=\"min-width: 70px;\">Type</th>\n<th data-history-col=\"pair\" style=\"min-width: 80px;\">Pair</th>\n<th class=\"text-right\" data-history-col=\"lot\" style=\"min-width: 80px;\">Lot Size</th>\n<th class=\"text-right\" data-history-col=\"pnlPips\" style=\"min-width: 90px;\">PnL (pips)</th>\n<th class=\"text-right\" data-history-col=\"pnlDollar\" style=\"min-width: 100px;\">PnL ($)</th>\n<th class=\"text-right tf-cost-net-head\" data-history-col=\"pnlDollarNet\" id=\"history-pnl-dollar-net-th\">PnL $</th>\n<th class=\"text-right\" data-history-col=\"pnlPercent\" style=\"min-width: 80px;\">PnL %</th>\n<th class=\"text-right tf-cost-net-head\" data-history-col=\"pnlPercentNet\" id=\"history-pnl-percent-net-th\">PnL %</th>\n<th class=\"text-right tf-cost-value-head\" data-history-col=\"swapDollar\">Swap $</th>\n<th class=\"text-right tf-cost-value-head\" data-history-col=\"commDollar\">Comm $</th>\n<th class=\"text-right\" data-history-col=\"balancePnl\" style=\"min-width: 130px;\">Balance PnL ($)</th>\n</tr>\n</thead>\n<tbody></tbody>\n</table>\n</div>\n</div>\n<div id=\"drawdown-summary\" style=\"margin-top: 14px;\">\n<h3 style=\"font-size: 13px; margin-bottom: 4px;\">Drawdown &amp; Consecutive Stats</h3>\n<p class=\"small-muted\">\n          Dihitung otomatis dari urutan history signal (semua analis), menggunakan lot &amp; $/pips yang sama seperti Table 3.\n        </p>\n<div class=\"chip-row\" id=\"drawdown-overall-chips\" style=\"margin-top: 6px; margin-bottom: 6px;\"></div>\n<div class=\"table-wrapper\">\n<div class=\"table-scroll drawdown-noscroll\">\n<table id=\"drawdown-table\">\n<thead>\n<tr>\n<th style=\"width: 4%;\"></th>\n<th style=\"width: 16%;\">Nama Analis</th>\n<th style=\"width: 12%;\">Max Consec Profit (trades)</th>\n<th style=\"width: 8%;\">Count</th>\n<th style=\"width: 10%;\">Pips</th>\n<th style=\"width: 12%;\">$ Profit <span aria-hidden=\"true\" class=\"mini-spinner tfPriceDepSpinner\" style=\"display:none;\"></span></th>\n<th style=\"width: 12%;\">Max Consec Loss (trades)</th>\n<th style=\"width: 8%;\">Count</th>\n<th style=\"width: 10%;\">Drawdown Pips</th>\n<th style=\"width: 12%;\">Drawdown $ <span aria-hidden=\"true\" class=\"mini-spinner tfPriceDepSpinner\" style=\"display:none;\"></span></th>\n</tr>\n</thead>\n<tbody></tbody>\n</table>\n</div>\n</div>\n<div style=\"margin-top: 12px;\">\n<h3 style=\"font-size: 13px; margin-bottom: 4px;\">Consecutive Profit &amp; Loss – Total Semua Analis</h3>\n<p class=\"small-muted\" style=\"margin-bottom: 6px;\">\n            Tabel ini merangkum streak profit &amp; loss terpanjang secara <strong>gabungan</strong> dari semua analis.\n          </p>\n<div class=\"table-wrapper\">\n<div class=\"table-scroll\">\n<table id=\"drawdown-total-table\">\n<thead>\n<tr>\n<th style=\"width: 22%;\">Tipe</th>\n<th class=\"text-right\" style=\"width: 18%;\">Trades</th>\n<th class=\"text-right\" style=\"width: 18%;\">Pips</th>\n<th class=\"text-right\" style=\"width: 18%;\">$ <span aria-hidden=\"true\" class=\"mini-spinner tfPriceDepSpinner\" style=\"display:none;\"></span></th>\n</tr>\n</thead>\n<tbody></tbody>\n</table>\n</div>\n</div>\n</div>\n</div>\n</section>\n<footer style=\"margin-top: 18px; font-size: 10px; color: #6b7280;\">\n<p>\n        Catatan: Dashboard ini berjalan sebagai halaman extension. Jika kamu membuka file ini langsung di browser\n        (di luar extension), integrasi dengan <span class=\"mono\">chrome.storage</span> tidak aktif, tetapi fungsi kalkulator tetap bisa dipakai manual.\n      </p>\n<div class=\"tf-copyright-footer\">\n<div>© 2025 <a href=\"mailto:wiliejonathan@gmail.com\">wiliejonathan@gmail.com</a></div>\n<div>Instagram <a class=\"tf-ig-link\" href=\"https://www.instagram.com/wilie_jonathan/\" rel=\"noopener noreferrer\" target=\"_blank\">Wilie_jonathan</a></div>\n</div>\n</footer>\n</div>\n\n";
/* MOBILE PROTOTYPE: production activation gate intentionally removed.
   The APK prototype is local/import-only, per requested scope. */
window.tfRequireLicense = async function(){ return { valid:true, mobilePrototype:true }; };
window.tfRequireServerCheckOnly = async function(){ return { valid:true, mobilePrototype:true }; };
window.tfValidateSavedLicense = async function(){ return { valid:true, mobilePrototype:true }; };
window.tfRefreshLicenseStatus = async function(){ return { valid:true, mobilePrototype:true }; };
window.tfLicenseApiUrl = '';
window.tfGetLicenseResult = function(){ return { valid:true, status:'ACTIVE', mobilePrototype:true }; };
window.tfGetISignalUsersAccessState = function(){
  return { known:true, access:false, reason:'MOBILE_NOT_INCLUDED' };
};
document.documentElement.setAttribute('data-tf-server-authorized','1');
document.documentElement.setAttribute('data-tf-license','valid');

window.trackInvestingProTopMenuLogoClick = window.trackInvestingProTopMenuLogoClick || function () {
};
function loadUserProfileIntoDashboard() {
try {
if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
return;
}
const profileKeys = [
  'tfUserProfile',
  'tfLoginConfirmed',
  'tfAccountLoginState',
  'tfRootLoginState',
  'tfEnteredMain'
];
const applyProfile = (data) => {
const profile = data && data.tfUserProfile && typeof data.tfUserProfile === 'object'
? data.tfUserProfile
: null;
const nameEl = document.getElementById('dashboard-user-name');
const avatarEl = document.getElementById('dashboard-user-avatar');
const statusEl = document.getElementById('dashboard-user-status-text');
if (!nameEl && !avatarEl && !statusEl)
return;
const accountState = String(data && data.tfAccountLoginState || '').trim().toLowerCase();
const rootState = String(data && data.tfRootLoginState || '').trim().toLowerCase();
const hasProfileIdentity = !!(profile && (profile.name || profile.email || profile.avatarUrl));
const isOnline = hasProfileIdentity ||
!!(data && (data.tfLoginConfirmed === true || data.tfEnteredMain === true)) ||
/logged[_ -]?in|online/.test(accountState) ||
/logged[_ -]?in|online/.test(rootState);
if (nameEl) {
const email = String(profile && profile.email || '').trim();
const fallbackName = email ? email.split('@')[0] : '';
if (profile && (profile.name || fallbackName)) {
nameEl.textContent = String(profile.name || fallbackName);
}
else if (isOnline) {
nameEl.textContent = 'Akun TradersFamily';
}
else if (/user belum login|offline/i.test(String(nameEl.textContent || ''))) {
nameEl.textContent = 'Memeriksa akun...';
}
}
if (avatarEl && profile && profile.avatarUrl) {
avatarEl.src = String(profile.avatarUrl);
}
if (statusEl) {
const explicitlyLoggedOut = !hasProfileIdentity && /logged[_ -]?out/.test(accountState) && /logged[_ -]?out/.test(rootState);
statusEl.textContent = isOnline ? 'Online' : (explicitlyLoggedOut ? 'Offline' : 'Memeriksa akun...');
}
try {
const row = statusEl && statusEl.closest ? statusEl.closest('.profile-status') : null;
const dot = row ? row.querySelector('.status-dot') : null;
if (dot) {
dot.classList.toggle('offline', !isOnline && /logged[_ -]?out/.test(accountState));
dot.classList.toggle('unknown', !isOnline && !/logged[_ -]?out/.test(accountState));
}
}
catch (e) { }
};
const readProfile = () => {
try {
chrome.storage.local.get(profileKeys, (data) => {
try { void chrome.runtime.lastError; } catch (e) { }
applyProfile(data || {});
});
}
catch (e) { }
};
readProfile();
if (!window.__tfDashboardProfileStorageBound) {
window.__tfDashboardProfileStorageBound = true;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local' || !changes)
return;
if (profileKeys.some((key) => changes[key]))
readProfile();
});
}
catch (e) { }
}
if (!window.__tfDashboardProfileRefreshStarted) {
window.__tfDashboardProfileRefreshStarted = true;
try {
chrome.runtime.sendMessage({ type: 'ensure_tf_profile', force: true }, () => {
try { void chrome.runtime.lastError; } catch (e) { }
readProfile();
});
}
catch (e) { }
setTimeout(readProfile, 1200);
setTimeout(readProfile, 3500);
setTimeout(readProfile, 8000);
}
}
catch (e) {
console.warn('TF dashboard: gagal load user profile', e);
}
}
function loadScannedByNoteIntoDashboard() {
try {
if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.local) {
return;
}
const noteEl = document.getElementById('tf-scanned-by');
if (!noteEl)
return;
chrome.storage.local.get(['tfLastImportMeta', 'tfLastScanMeta', 'tfUserProfile'], (data) => {
const importMeta = data && data.tfLastImportMeta ? data.tfLastImportMeta : null;
const scanMeta = data && data.tfLastScanMeta ? data.tfLastScanMeta : null;
const profile = data && data.tfUserProfile ? data.tfUserProfile : null;
const owners = [];
const ownerKey = (owner) => {
try {
const email = owner && owner.email ? String(owner.email).trim().toLowerCase() : '';
const name = owner && owner.name ? String(owner.name).trim().toLowerCase() : '';
return email || name;
}
catch (e) { return ''; }
};
const pushOwner = (owner) => {
if (!owner || typeof owner !== 'object')
return;
const item = {
name: owner.name ? String(owner.name).trim() : '',
email: owner.email ? String(owner.email).trim() : ''
};
if (!item.name && !item.email)
return;
const key = ownerKey(item);
if (owners.some((x) => ownerKey(x) === key))
return;
owners.push(item);
};
(Array.isArray(importMeta && importMeta.exportedByList) ? importMeta.exportedByList : []).forEach(pushOwner);
pushOwner(importMeta && importMeta.exportedBy ? importMeta.exportedBy : null);
(Array.isArray(scanMeta && scanMeta.scannedByList) ? scanMeta.scannedByList : []).forEach(pushOwner);
pushOwner(scanMeta && scanMeta.scannedBy ? scanMeta.scannedBy : null);
if (!owners.length)
pushOwner(profile);
if (!owners.length) {
noteEl.textContent = '';
return;
}
const tfOwnerAlphabetLabel = (index) => {
let n = Math.max(0, Number(index) || 0);
let out = '';
do {
out = String.fromCharCode(65 + (n % 26)) + out;
n = Math.floor(n / 26) - 1;
} while (n >= 0);
return out;
};
noteEl.style.whiteSpace = 'pre-line';
noteEl.textContent = owners.map((owner, index) => {
const namePart = owner.name ? String(owner.name).trim() : '';
const emailPart = owner.email ? String(owner.email).trim() : '';
return 'Scanned by ' + tfOwnerAlphabetLabel(index) + ' : ' + namePart + (emailPart ? ' | ' + emailPart : '');
}).join('\n');
});
}
catch (e) {
console.warn('TF dashboard: gagal load scanned-by note', e);
}
}
const __tfDashScanOverlay = {
visible: false,
overall: {},
detail: {},
detailOrder: [],
overallOrder: []
};
__tfDashScanOverlay.lastInProg = false;
__tfDashScanOverlay.lastMap = {};
function tfDash_isOverallComplete(mapObj) {
try {
const keys = Object.keys(mapObj || {});
let sawOverall = false;
for (const k of keys) {
const st = mapObj[k];
if (!st)
continue;
if (String(st.batchIndex) !== '0')
continue;
sawOverall = true;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return false;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!Number.isFinite(d) || !Number.isFinite(t) || t <= 0)
return false;
if (d < t)
return false;
}
return sawOverall;
}
catch (e) {
return false;
}
}
function tfDash_updateSkipButtonState() {
const els = tfDash_overlayEls();
if (!els.skip)
return;
const complete = tfDash_isOverallComplete(__tfDashScanOverlay.lastMap);
const enable = (!__tfDashScanOverlay.lastInProg) || complete;
try {
els.skip.disabled = !enable;
}
catch (e) { }
try {
if (enable)
els.skip.classList.remove('disabled');
else
els.skip.classList.add('disabled');
}
catch (e) { }
try {
els.skip.title = enable ? 'Buka Dashboard' : 'Menunggu semua batch selesai (100%)...';
}
catch (e) { }
}
function tfDash_hasChromeStorage() {
try {
return (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local);
}
catch (e) {
return false;
}
}
function tfDash_makeKey(analystName, pair, batchIndex) {
const a = String(analystName || '').trim();
const p = String(pair || '').trim();
const b = (batchIndex != null ? String(batchIndex) : '');
return a + '||' + p + '||' + b;
}
function tfDash_overlayEls() {
return {
skip: document.getElementById('tf-dashboard-scan-skip'),
bar: document.getElementById('tf-dashboard-scan-bar-fill'),
overall: document.getElementById('tf-dashboard-scan-overall'),
detail: document.getElementById('tf-dashboard-scan-detail')
};
}
function tfDash_overlayShow() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayHide() {
try {
document.body.classList.remove('tf-scan-loading');
}
catch (e) { }
__tfDashScanOverlay.visible = false;
}
function tfDash_overlayUpsert(kind, key, nameText, stateText) {
const els = tfDash_overlayEls();
const listEl = (kind === 'overall') ? els.overall : els.detail;
if (!listEl)
return;
const bag = (kind === 'overall') ? __tfDashScanOverlay.overall : __tfDashScanOverlay.detail;
if (!bag[key]) {
const row = document.createElement('div');
row.className = 'tf-scan-item';
const nameEl = document.createElement('span');
nameEl.className = 'name';
nameEl.textContent = nameText || '';
const stateEl = document.createElement('span');
stateEl.className = 'state';
stateEl.textContent = stateText || '';
row.appendChild(nameEl);
row.appendChild(stateEl);
listEl.appendChild(row);
bag[key] = { el: row, nameEl, stateEl };
if (kind === 'detail') {
__tfDashScanOverlay.detailOrder.push(key);
while (__tfDashScanOverlay.detailOrder.length > 120) {
const oldKey = __tfDashScanOverlay.detailOrder.shift();
const old = __tfDashScanOverlay.detail[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.detail[oldKey];
}
try {
listEl.scrollTop = listEl.scrollHeight;
}
catch (e) { }
}
else {
__tfDashScanOverlay.overallOrder.push(key);
while (__tfDashScanOverlay.overallOrder.length > 40) {
const oldKey = __tfDashScanOverlay.overallOrder.shift();
const old = __tfDashScanOverlay.overall[oldKey];
if (old && old.el && old.el.parentNode) {
try {
old.el.parentNode.removeChild(old.el);
}
catch (e) { }
}
delete __tfDashScanOverlay.overall[oldKey];
}
}
}
else {
const row = bag[key];
try {
if (row.nameEl)
row.nameEl.textContent = nameText || '';
}
catch (e) { }
try {
if (row.stateEl)
row.stateEl.textContent = stateText || '';
}
catch (e) { }
}
}
function tfDash_overlayUpdateBarFromOverall(mapObj) {
const els = tfDash_overlayEls();
if (!els.bar)
return;
let doneSum = 0;
let totalSum = 0;
try {
Object.keys(mapObj || {}).forEach((k) => {
const st = mapObj[k];
if (!st)
return;
if (String(st.batchIndex) !== '0')
return;
const m = String(st.stateText || '').match(/^(\d+)\s*\/\s*(\d+)$/);
if (!m)
return;
const d = parseInt(m[1], 10);
const t = parseInt(m[2], 10);
if (!isFinite(d) || !isFinite(t) || t <= 0)
return;
doneSum += d;
totalSum += t;
});
}
catch (e) { }
const pct = (totalSum > 0) ? Math.max(0, Math.min(100, Math.round((doneSum / totalSum) * 100))) : 0;
els.bar.style.width = pct + '%';
}
function tfDash_overlaySyncFromProgressMap(mapObj) {
if (!mapObj)
return;
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex === '0') {
const nameText = 'Overall, ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('overall', tfDash_makeKey(analystName, pair, 0), nameText, stateText);
}
});
}
catch (e) { }
try {
Object.keys(mapObj).forEach((k) => {
const p = mapObj[k];
if (!p)
return;
const analystName = (p.analystName || '').trim();
const pair = (p.pair || '').trim();
const batchIndex = (p.batchIndex != null) ? String(p.batchIndex) : '';
const stateText = (p.stateText != null) ? String(p.stateText) : 'Progress...';
const analystLabel = analystName || 'Analis';
const pairLabel = pair || 'PAIR';
if (batchIndex && batchIndex !== '0') {
const nameText = 'Batch ' + batchIndex + ', ' + pairLabel + ', ' + analystLabel;
tfDash_overlayUpsert('detail', tfDash_makeKey(analystName, pair, batchIndex), nameText, stateText);
}
});
}
catch (e) { }
tfDash_overlayUpdateBarFromOverall(mapObj);
}
function tfDash_overlayLoadInitial() {
if (!tfDash_hasChromeStorage())
return;
chrome.storage.local.get(['tfScanInProgress', 'tfHistoryBatchProgressMap'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const inProg = !!(data && data.tfScanInProgress);
const mapObj = (data && data.tfHistoryBatchProgressMap) ? data.tfHistoryBatchProgressMap : null;
__tfDashScanOverlay.lastInProg = inProg;
__tfDashScanOverlay.lastMap = (mapObj && typeof mapObj === 'object') ? mapObj : {};
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (mapObj) {
tfDash_overlaySyncFromProgressMap(mapObj);
}
if (inProg)
tfDash_overlayShow();
else
tfDash_overlayHide();
});
}
function tfDash_overlayBindListeners() {
const els = tfDash_overlayEls();
if (els.skip) {
els.skip.addEventListener('click', () => {
try {
if (els.skip.disabled)
return;
}
catch (e) { }
tfDash_overlayHide();
});
}
try {
if (chrome && chrome.runtime && chrome.runtime.onMessage) {
let __tfDashMsgFlushTimer = null;
const flush = () => {
__tfDashMsgFlushTimer = null;
try {
const mapObj = (__tfDashScanOverlay && __tfDashScanOverlay.lastMap) ? __tfDashScanOverlay.lastMap : {};
tfDash_overlaySyncFromProgressMap(mapObj);
tfDash_updateSkipButtonState();
}
catch (e) { }
};
const scheduleFlush = () => {
try {
if (__tfDashMsgFlushTimer)
return;
__tfDashMsgFlushTimer = setTimeout(flush, 200);
}
catch (e) {
flush();
}
};
chrome.runtime.onMessage.addListener((msg) => {
try {
if (msg && msg.type === 'tf_isignal_users_set_progress') {
const line = msg.line != null ? String(msg.line) : '';
const status = msg.status != null ? String(msg.status) : '';
if (line)
tf_isignalUsers_overlayAddLine(line);
if (status)
tf_isignalUsers_overlaySetStatus(status);
return;
}
if (!msg || msg.type !== 'historyBatchProgress')
return;
const analystName = (msg.analystName != null) ? String(msg.analystName).trim() : '';
const pair = (msg.pair != null) ? String(msg.pair).trim().toUpperCase() : '';
const bi = (msg.batchIndex != null) ? String(msg.batchIndex) : '';
const stateText = (msg.stateText != null) ? String(msg.stateText) : '';
const key = analystName + '||' + pair + '||' + bi;
if (!__tfDashScanOverlay.lastMap || typeof __tfDashScanOverlay.lastMap !== 'object') {
__tfDashScanOverlay.lastMap = {};
}
__tfDashScanOverlay.lastMap[key] = {
analystName,
pair,
batchIndex: bi,
stateText,
ts: Date.now()
};
try {
if (__tfDashScanOverlay.lastInProg)
tfDash_overlayShow();
}
catch (e) { }
scheduleFlush();
}
catch (e) { }
});
}
}
catch (e) { }
if (!tfDash_hasChromeStorage())
return;
try {
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local')
return;
if (changes.tfHistoryBatchProgressMap && changes.tfHistoryBatchProgressMap.newValue) {
try {
__tfDashScanOverlay.lastMap = changes.tfHistoryBatchProgressMap.newValue || {};
tfDash_overlaySyncFromProgressMap(__tfDashScanOverlay.lastMap);
tfDash_updateSkipButtonState();
}
catch (e) { }
}
if (changes.tfScanInProgress) {
const inProg = !!(changes.tfScanInProgress.newValue);
__tfDashScanOverlay.lastInProg = inProg;
try {
tfDash_updateSkipButtonState();
}
catch (e) { }
if (inProg) {
tfDash_overlayShow();
}
else {
setTimeout(() => {
try {
tfDash_overlayHide();
}
catch (e) { }
}, 350);
}
}
if (changes.tfUserProfile || changes.tfLastImportMeta || changes.tfLastScanMeta) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
}
});
}
catch (e) { }
}
function initDashboardScanOverlay() {
try {
tfDash_overlayBindListeners();
tfDash_overlayLoadInitial();
}
catch (e) { }
}
var ANALYSTS = [];
const PAIR_DOLLAR_PER_PIP = {
XAUUSD: 10,
EURUSD: 10,
GBPUSD: 10,
AUDUSD: 10,
NZDUSD: 10,
USDJPY: 6.5,
EURJPY: 6.5,
GBPJPY: 6.5,
AUDJPY: 6.5,
NZDJPY: 6.5,
CADJPY: 6.5,
CHFJPY: 6.5,
USDCAD: 7.2,
USDCHF: 12.5
};
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let tfMyfxbookPriceMapLatest = null;
let tfMyfxbookRefreshInProgress = false;
const TF_PIP_TABLE_PAIR_ORDER = [
'XAUUSD',
'EURUSD',
'GBPUSD',
'AUDUSD',
'NZDUSD',
'USDJPY',
'EURJPY',
'GBPJPY',
'AUDJPY',
'NZDJPY',
'CADJPY',
'CHFJPY',
'USDCAD',
'USDCHF'
];
function tf_storageLocalGet(keys) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(data || {});
});
}
catch (e) {
resolve({});
}
});
}
function tf_formatPipValue(val) {
const num = Number(val);
if (!Number.isFinite(num))
return '-';
return num.toFixed(2);
}
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
function tf_parseMyfxbookNumber(raw) {
if (raw == null)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/\s+/g, '');
if (s.includes(',') && s.includes('.')) {
s = s.replace(/\./g, '').replace(',', '.');
}
else if (s.includes(',') && !s.includes('.')) {
const parts = s.split(',');
const dec = parts.pop();
s = parts.join('') + '.' + dec;
}
else {
s = s.replace(/,/g, '');
}
s = s.replace(/[^0-9.\-]/g, '');
if (!s || s === '-' || s === '.' || s === '-.')
return null;
const n = Number(s);
return Number.isFinite(n) ? n : null;
}
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
function tf_getQuoteToUSD(quote, priceMap) {
const q = String(quote || '').toUpperCase();
if (!q)
return null;
if (q === 'USD')
return 1;
const direct = tf_getPriceNum(q + 'USD', priceMap);
if (direct != null && direct > 0)
return direct;
const inv = tf_getPriceNum('USD' + q, priceMap);
if (inv != null && inv > 0)
return 1 / inv;
if (q === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return 1 / uj;
}
return null;
}
function tf_calcDollarPerPipUSD(pair, priceMap) {
const p = String(pair || '').trim().toUpperCase();
if (!p)
return 0;
if (p === 'XAUUSD')
return 10;
if (p.length !== 6)
return 0;
const quote = p.slice(3);
const pipSize = (quote === 'JPY') ? 0.01 : 0.0001;
const pipValueQuote = 100000 * pipSize;
if (quote === 'USD')
return pipValueQuote;
if (quote === 'JPY') {
const uj = tf_getPriceNum('USDJPY', priceMap);
if (uj != null && uj > 0)
return pipValueQuote / uj;
return 0;
}
const q2usd = tf_getQuoteToUSD(quote, priceMap);
if (q2usd == null || q2usd <= 0)
return 0;
return pipValueQuote * q2usd;
}
function tf_spinnerHTML(tight = false) {
return `<span class="mini-spinner${tight ? ' tight' : ''}" aria-hidden="true"></span>`;
}
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
function tf_isMyfxbookPriceLoading() {
  // MOBILE: never block imported dashboard data while waiting for live price.
  return false;
}
async function tf_renderPipCompactTableFromCache() {
  // MOBILE: Investing.com price table is not part of the phone UI.
  // Use imported cached price data when available, otherwise existing
  // REV224 fallback $/pip mapping remains active.
  try {
    const store = await tf_storageLocalGet([
      TF_MYFXBOOK_PRICES_KEY,
      TF_MYFXBOOK_PRICES_AT_KEY
    ]);
    const priceMap =
      store &&
      store[TF_MYFXBOOK_PRICES_KEY] &&
      typeof store[TF_MYFXBOOK_PRICES_KEY] === 'object'
        ? store[TF_MYFXBOOK_PRICES_KEY]
        : null;

    tfMyfxbookPriceMapLatest =
      priceMap && Object.keys(priceMap).length
        ? priceMap
        : null;
  } catch (e) {
    tfMyfxbookPriceMapLatest = null;
  }

  try {
    tf_togglePriceDependentHeaderSpinners();
  } catch (e) {}

  return true;
}
function tf_setRefreshPriceLinkLoading(isLoading) {
const el = document.getElementById('tf-refresh-price-link');
if (!el)
return;
try {
if (isLoading) {
el.classList.add('is-loading');
el.setAttribute('aria-disabled', 'true');
}
else {
el.classList.remove('is-loading');
el.removeAttribute('aria-disabled');
}
}
catch (e) { }
}
let tfPriceDependentUiTimer = null;
let tfPriceDependentUiPromise = null;
let tfPriceDependentUiResolve = null;
let tfPriceDependentUiRunning = false;
function tf_schedulePriceDependentUiRefresh(delayMs = 35) {
if (tfPriceDependentUiRunning) {
return tfPriceDependentUiPromise || Promise.resolve(true);
}
try {
if (tfPriceDependentUiTimer) {
clearTimeout(tfPriceDependentUiTimer);
tfPriceDependentUiTimer = null;
}
}
catch (e) { }
if (!tfPriceDependentUiPromise) {
tfPriceDependentUiPromise = new Promise((resolve) => {
tfPriceDependentUiResolve = resolve;
});
}
tfPriceDependentUiTimer = setTimeout(() => {
tfPriceDependentUiTimer = null;
tfPriceDependentUiRunning = true;
const finish = () => {
tfPriceDependentUiRunning = false;
const resolve = tfPriceDependentUiResolve;
tfPriceDependentUiResolve = null;
tfPriceDependentUiPromise = null;
try {
if (typeof resolve === 'function')
resolve(true);
}
catch (e) { }
};
const runHeavyOnce = () => {
try {
renderSummaryTable();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
try {
updateMonthlyTableCells();
}
catch (x) { }
}
finish();
};
try {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(runHeavyOnce, 0));
}
else {
setTimeout(runHeavyOnce, 0);
}
}
catch (e) {
setTimeout(runHeavyOnce, 0);
}
}, Math.max(0, Number(delayMs) || 0));
return tfPriceDependentUiPromise;
}
async function tf_applyLatestPriceCacheAndRefreshUi() {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) { }
}
async function tf_refreshMyfxbookPricesForce() {
  // MOBILE: no live-price refresh workflow.
  await tf_renderPipCompactTableFromCache();
  try {
    renderSummaryTable();
    updateMonthlyTableCells();
    renderMonthlyTotals();
    tf_captureHistoryTableScrollForRestore();
    recomputeHistoryRows();
  } catch (e) {}
  return true;
}
function getDollarPerPipForPair(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
try {
if (tfMyfxbookPriceMapLatest && typeof tfMyfxbookPriceMapLatest === 'object') {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (dyn > 0)
return dyn;
}
}
catch (e) { }
return PAIR_DOLLAR_PER_PIP[key] || 0;
}
function tf_getDollarPerPipForCompact(pair) {
if (!pair)
return 0;
const key = String(pair).trim().toUpperCase();
if (key === 'XAUUSD')
return 10;
try {
const dyn = tf_calcDollarPerPipUSD(key, tfMyfxbookPriceMapLatest);
if (Number.isFinite(dyn) && dyn > 0)
return dyn;
}
catch (e) { }
return 0;
}
function getPrimaryPairForAnalyst(analyst) {
if (!analyst)
return null;
if (Array.isArray(analyst.pairs) && analyst.pairs.length > 0) {
return analyst.pairs[0];
}
return null;
}
function getDollarPerPipForAnalyst(analyst, explicitPair) {
if (explicitPair) {
const mapped = getDollarPerPipForPair(explicitPair);
if (mapped > 0)
return mapped;
}
if (!analyst)
return 0;
const pair = getPrimaryPairForAnalyst(analyst);
const mapped = getDollarPerPipForPair(pair);
if (mapped > 0)
return mapped;
if (typeof analyst.dollarPerPip === 'number')
return analyst.dollarPerPip;
return 0;
}
const MONTHS = [
'January',
'February',
'March',
'April',
'May',
'June',
'July',
'August',
'September',
'October',
'November',
'December'
];
let selectedPairs = null;
let selectedAnalystPairsMapStats = null;
let selectedAnalystPairsMapHistory = null;
let selectedAnalystsGlobal = undefined;
function setupPairFilter() {
const container = document.getElementById('pair-filter-checkboxes');
const allCheckbox = document.getElementById('pair-filter-all');
if (!container || !allCheckbox)
return;
const pairs = Object.keys(PAIR_DOLLAR_PER_PIP || {});
container.innerHTML = '';
pairs.forEach((pair) => {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-pair', pair);
cb.checked = true;
cb.addEventListener('change', () => {
if (cb.checked) {
allCheckbox.checked = false;
}
const anyChecked = Array.from(container.querySelectorAll('input[type="checkbox"][data-pair]')).some((c) => c.checked);
if (!anyChecked) {
allCheckbox.checked = true;
}
updateSelectedPairsFromUI();
applyPairFilter();
});
const span = document.createElement('span');
span.textContent = pair;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
allCheckbox.addEventListener('change', () => {
if (allCheckbox.checked) {
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
boxes.forEach((cb) => {
cb.checked = true;
});
}
updateSelectedPairsFromUI();
applyPairFilter();
});
updateSelectedPairsFromUI();
}
function updateSelectedPairsFromUI() {
const allCheckbox = document.getElementById('pair-filter-all');
const container = document.getElementById('pair-filter-checkboxes');
if (!allCheckbox || !container) {
selectedPairs = null;
return;
}
if (allCheckbox.checked) {
selectedPairs = null;
return;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-pair]');
const sel = [];
boxes.forEach((cb) => {
if (cb.checked) {
const val = cb.getAttribute('data-pair');
if (val)
sel.push(val);
}
});
selectedPairs = sel.length ? sel : null;
}
function setupPairTreeFilter() {
const dropdown = document.getElementById('ticker-dropdown');
if (!dropdown)
return;
const pairKeys = Object.keys(PAIR_DOLLAR_PER_PIP || {});
if (!pairKeys || !pairKeys.length)
return;
const groups = {};
pairKeys.forEach((p) => {
const key = String(p).substring(0, 3).toUpperCase();
if (!groups[key])
groups[key] = [];
groups[key].push(p);
});
const groupKeys = Object.keys(groups).sort();
dropdown.innerHTML = '';
const button = document.createElement('button');
const buttonText = document.createElement('span');
buttonText.className = 'selected-text';
buttonText.textContent = 'ALL';
const caretSpan = document.createElement('span');
caretSpan.className = 'caret';
button.appendChild(buttonText);
button.appendChild(caretSpan);
dropdown.appendChild(button);
const menu = document.createElement('div');
menu.className = 'dropdown-content';
dropdown.appendChild(menu);
const ul = document.createElement('ul');
const allLi = document.createElement('li');
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = true;
allCb.id = 'ticker-tree-all';
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
groupKeys.forEach((groupKey) => {
const li = document.createElement('li');
const headerDiv = document.createElement('div');
headerDiv.className = 'group-header';
headerDiv.style.display = 'flex';
headerDiv.style.alignItems = 'center';
headerDiv.style.gap = '4px';
const arrow = document.createElement('span');
arrow.className = 'toggle-arrow';
arrow.textContent = '\u25B6';
headerDiv.appendChild(arrow);
const groupCb = document.createElement('input');
groupCb.type = 'checkbox';
groupCb.checked = true;
groupCb.setAttribute('data-group', groupKey);
headerDiv.appendChild(groupCb);
const groupLabel = document.createElement('span');
groupLabel.textContent = groupKey;
headerDiv.appendChild(groupLabel);
li.appendChild(headerDiv);
const childList = document.createElement('ul');
childList.className = 'children';
childList.style.display = 'none';
groups[groupKey].sort().forEach((pair) => {
const childLi = document.createElement('li');
const childLabel = document.createElement('label');
const pairCb = document.createElement('input');
pairCb.type = 'checkbox';
pairCb.checked = true;
pairCb.setAttribute('data-pair', pair);
childLabel.appendChild(pairCb);
childLabel.appendChild(document.createTextNode(pair));
childLi.appendChild(childLabel);
childList.appendChild(childLi);
});
li.appendChild(childList);
ul.appendChild(li);
});
menu.appendChild(ul);
button.addEventListener('click', (e) => {
e.stopPropagation();
menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
});
document.addEventListener('click', (e) => {
if (!dropdown.contains(e.target)) {
menu.style.display = 'none';
}
});
ul.querySelectorAll('.toggle-arrow').forEach((arrowEl) => {
arrowEl.addEventListener('click', (e) => {
e.stopPropagation();
const parentLi = arrowEl.closest('li');
const childList = parentLi.querySelector('ul.children');
if (!childList)
return;
const isHidden = childList.style.display === 'none' || childList.style.display === '';
childList.style.display = isHidden ? 'block' : 'none';
arrowEl.textContent = isHidden ? '\u25BC' : '\u25B6';
});
});
function updateAllCheckboxState() {
const groupsChecked = Array.from(ul.querySelectorAll('input[type="checkbox"][data-group]')).every((cb) => cb.checked);
allCb.checked = groupsChecked;
}
function updateSelectedPairs() {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-pair]');
const allChecked = Array.from(pairCbs).every((cb) => cb.checked);
if (allChecked) {
selectedPairs = null;
}
else {
const sel = [];
pairCbs.forEach((cb) => {
if (cb.checked)
sel.push(cb.getAttribute('data-pair'));
});
selectedPairs = sel.length ? sel : null;
}
if (!selectedPairs || selectedPairs.length === pairCbs.length) {
buttonText.textContent = 'ALL';
}
else if (selectedPairs.length === 1) {
buttonText.textContent = selectedPairs[0];
}
else {
buttonText.textContent = selectedPairs.length + ' Pairs';
}
applyPairFilter();
}
allCb.addEventListener('change', () => {
const checked = allCb.checked;
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((cb) => {
cb.checked = checked;
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((cb) => {
cb.checked = checked;
});
updateSelectedPairs();
});
ul.querySelectorAll('input[type="checkbox"][data-group]').forEach((groupCb) => {
groupCb.addEventListener('change', () => {
const checked = groupCb.checked;
const parentLi = groupCb.closest('li');
if (parentLi) {
parentLi.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.checked = checked;
});
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pairCb) => {
pairCb.addEventListener('change', () => {
const parentLi = pairCb.closest('ul.children');
if (parentLi) {
const li = parentLi.parentElement;
const groupCb = li.querySelector('input[type="checkbox"][data-group]');
const pairs = li.querySelectorAll('ul.children input[type="checkbox"][data-pair]');
const allPairsChecked = Array.from(pairs).every((cb) => cb.checked);
if (groupCb)
groupCb.checked = allPairsChecked;
}
updateAllCheckboxState();
updateSelectedPairs();
});
});
updateSelectedPairs();
}
let __tfAnalystFilterOutsideClickInstalled = false;
let __tfAnalystTickerDefaultAppliedStats = false;
let __tfAnalystTickerDefaultAppliedHistory = false;
function tf_buildAnalystTickerFilterGroup(opts) {
const containers = Array.isArray(opts && opts.containers) ? opts.containers : [];
const analystNames = Array.isArray(opts && opts.analystNames) ? opts.analystNames : [];
const pairsByAnalyst = (opts && opts.pairsByAnalyst) || {};
const getState = opts && opts.getState;
const setState = opts && opts.setState;
const getGlobalState = opts && opts.getGlobalState;
const setGlobalState = opts && opts.setGlobalState;
const applyFn = opts && opts.applyFn;
const isPairNoValue = opts && opts.isPairNoValue;
const isAnalystNoValue = opts && opts.isAnalystNoValue;
const forceUncheckNoValue = !!(opts && opts.forceUncheckNoValue);
const pairNoValueClass = (opts && opts.pairNoValueClass) || 'tf-pair-no-value';
const autoSelectPairsOnAnalystEnable = !!(opts && opts.autoSelectPairsOnAnalystEnable);
if (!containers.length)
return;
const prevPairsState = (typeof getState === 'function') ? getState() : null;
const prevGlobalState = (typeof getGlobalState === 'function') ? getGlobalState() : undefined;
function isGloballyChecked(analystName) {
if (prevGlobalState === undefined || prevGlobalState === null)
return true;
if (prevGlobalState && typeof prevGlobalState === 'object') {
return tf_getSelectedAnalystEntry(prevGlobalState, analystName) !== undefined;
}
return true;
}
function getPairsList(analystName) {
const pairsSet = pairsByAnalyst[analystName] || new Set();
return Array.from(pairsSet).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
}
function isNoValuePair(analystName, pair) {
if (typeof isPairNoValue !== 'function')
return false;
try {
return !!isPairNoValue(analystName, pair);
}
catch (e) {
return false;
}
}
function getAllowedPairsRaw(analystName) {
if (!prevPairsState || typeof prevPairsState !== 'object')
return undefined;
return tf_getSelectedAnalystEntry(prevPairsState, analystName);
}
function computeGlobalAllComplete() {
for (const name of analystNames) {
if (!isGloballyChecked(name))
return false;
}
return analystNames.length > 0;
}
function buildOneContainer(container) {
container.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'analyst-filter-list';
const allLi = document.createElement('li');
allLi.className = 'analyst-filter-item';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.checked = computeGlobalAllComplete();
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const li = document.createElement('li');
li.className = 'analyst-filter-item';
li.setAttribute('data-analyst-item', name);
const label = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
let analystChecked = isGloballyChecked(name);
const analystNoValue = (typeof isAnalystNoValue === 'function') ? !!isAnalystNoValue(name, pairs) : false;
cb.checked = analystChecked;
label.appendChild(cb);
const nameSpan = document.createElement('span');
nameSpan.textContent = formatAnalystDisplayName(name);
nameSpan.title = String(name || '').trim();
if (analystNoValue)
nameSpan.classList.add('tf-analyst-no-value');
label.appendChild(nameSpan);
if (pairs.length === 1) {
const onlyPair = pairs[0];
const pairSpan = document.createElement('span');
pairSpan.textContent = ` (${onlyPair})`;
const pairNoValue = isNoValuePair(name, onlyPair);
if (pairNoValue)
pairSpan.classList.add(pairNoValueClass);
label.appendChild(pairSpan);
}
let arrow = null;
let subUl = null;
if (pairs.length > 1) {
arrow = document.createElement('span');
arrow.className = 'analyst-filter-arrow';
arrow.setAttribute('data-analyst', name);
arrow.setAttribute('aria-expanded', 'false');
arrow.textContent = '';
label.appendChild(arrow);
}
li.appendChild(label);
if (pairs.length > 1) {
subUl = document.createElement('ul');
subUl.className = 'sub-menu';
subUl.style.display = 'none';
subUl.setAttribute('data-analyst', name);
const allowedRaw = getAllowedPairsRaw(name);
const allowedAllMode = (allowedRaw === null || typeof allowedRaw === 'undefined');
const allowedArr = Array.isArray(allowedRaw) ? allowedRaw.map(tf_normPairKey) : [];
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
const subAllLi = document.createElement('li');
const subAllLabel = document.createElement('label');
const subAllCb = document.createElement('input');
subAllCb.type = 'checkbox';
subAllCb.setAttribute('data-analyst', name);
subAllCb.setAttribute('data-pair', '__ALL__');
let allPairsSelected = true;
for (const p of pairs) {
const isNoVal = !!(forceUncheckNoValue && allowedAllMode && isNoValuePair(name, p));
const pairSelected = isNoVal ? false : (allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p)));
if (!pairSelected) {
allPairsSelected = false;
break;
}
}
subAllCb.checked = !!(analystChecked && allPairsSelected);
subAllCb.disabled = !analystChecked;
subAllLabel.appendChild(subAllCb);
subAllLabel.appendChild(document.createTextNode('ALL'));
subAllLi.appendChild(subAllLabel);
subUl.appendChild(subAllLi);
pairs.forEach((p) => {
const pli = document.createElement('li');
const plabel = document.createElement('label');
const pcb = document.createElement('input');
pcb.type = 'checkbox';
pcb.setAttribute('data-analyst', name);
pcb.setAttribute('data-pair', p);
const pairNoValueNow = isNoValuePair(name, p);
if (!analystChecked) {
pcb.checked = false;
pcb.disabled = true;
}
else {
pcb.checked = allowedAllMode ? true : allowedArr.includes(tf_normPairKey(p));
pcb.disabled = false;
}
if (forceUncheckNoValue && allowedAllMode && pairNoValueNow) {
pcb.checked = false;
}
plabel.appendChild(pcb);
const pairText = document.createElement('span');
pairText.textContent = p;
if (pairNoValueNow)
pairText.classList.add(pairNoValueClass);
plabel.appendChild(pairText);
pli.appendChild(plabel);
subUl.appendChild(pli);
});
const updatePairCountLabel = () => {
const selectedCount = subUl.querySelectorAll('input[type="checkbox"][data-pair]:not([data-pair="__ALL__"]):checked').length;
const pairWord = selectedCount === 1 ? 'pair' : 'pairs';
arrow.textContent = selectedCount + ' ' + pairWord;
arrow.setAttribute('aria-label', selectedCount + ' ' + pairWord + ' dipilih untuk ' + formatAnalystDisplayName(name));
};
updatePairCountLabel();
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && menu.style.display === 'block') {
menu.style.display = 'none';
const a = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (a) {
a.classList.remove('open');
a.setAttribute('aria-expanded', 'false');
}
}
});
if (subUl.style.display === 'none' || subUl.style.display === '') {
subUl.style.display = 'block';
arrow.classList.add('open');
arrow.setAttribute('aria-expanded', 'true');
}
else {
subUl.style.display = 'none';
arrow.classList.remove('open');
arrow.setAttribute('aria-expanded', 'false');
}
});
}
ul.appendChild(li);
});
container.appendChild(ul);
function recomputeGlobalFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb && topCb.checked)
map[name] = true;
});
return map;
}
function recomputePairMapFromUI() {
const map = {};
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb || !topCb.checked)
return;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (!pairCbs || pairCbs.length === 0) {
return;
}
const selected = [];
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
selected.push(pair);
});
map[name] = selected;
});
return map;
}
function commitAndRefresh() {
const __openAnalysts = Array.from(container.querySelectorAll('.analyst-filter-item .sub-menu'))
.filter((m) => m && m.style && m.style.display === 'block')
.map((m) => m.getAttribute('data-analyst'))
.filter((x) => !!x);
const nextGlobal = recomputeGlobalFromUI();
const nextPairs = recomputePairMapFromUI();
if (typeof setGlobalState === 'function')
setGlobalState(nextGlobal);
if (typeof setState === 'function')
setState(nextPairs);
if (typeof applyFn === 'function')
applyFn();
setupAnalystTickerFilter();
try {
const menus = container.querySelectorAll('.analyst-filter-item .sub-menu[data-analyst]');
menus.forEach((m) => {
const a = m.getAttribute('data-analyst');
if (!a)
return;
if (__openAnalysts.indexOf(a) !== -1) {
m.style.display = 'block';
const li = m.closest('.analyst-filter-item');
const ar = li ? li.querySelector('span.analyst-filter-arrow') : null;
if (ar) {
ar.classList.add('open');
ar.setAttribute('aria-expanded', 'true');
}
}
});
}
catch (e) { }
}
allCb.addEventListener('change', () => {
const checked = !!allCb.checked;
if (checked) {
analystNames.forEach((name) => {
const pairs = getPairsList(name);
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.checked = true;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (!topCb.checked) {
pcb.checked = false;
pcb.disabled = true;
return;
}
if (pair === '__ALL__') {
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
pcb.checked = !anyNoValue;
pcb.disabled = false;
}
else {
const noVal = isNoValuePair(name, pair);
pcb.disabled = false;
pcb.checked = true;
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
}
}
});
});
}
else {
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (topCb)
topCb.checked = false;
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
if (pairCbs && pairCbs.length) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
});
}
commitAndRefresh();
});
analystNames.forEach((name) => {
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + name + '"]:not([data-pair])');
if (!topCb)
return;
topCb.addEventListener('change', () => {
const pairCbs = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]');
const pairs = getPairsList(name);
const anyNoValue = pairs.some((p) => isNoValuePair(name, p));
if (pairCbs && pairCbs.length) {
if (!topCb.checked) {
pairCbs.forEach((pcb) => {
pcb.checked = false;
pcb.disabled = true;
});
}
else {
let anySpecificChecked = false;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair || pair === '__ALL__')
return;
if (pcb.checked)
anySpecificChecked = true;
});
const doAutoSelect = !!(autoSelectPairsOnAnalystEnable && !anySpecificChecked);
let subAllCb = null;
pairCbs.forEach((pcb) => {
const pair = pcb.getAttribute('data-pair');
if (!pair)
return;
if (pair === '__ALL__') {
subAllCb = pcb;
return;
}
const noVal = isNoValuePair(name, pair);
if (forceUncheckNoValue && noVal) {
pcb.checked = false;
pcb.disabled = false;
}
else {
pcb.disabled = false;
if (doAutoSelect) {
pcb.checked = !noVal;
}
}
});
if (subAllCb) {
subAllCb.disabled = false;
if (doAutoSelect) {
let allSpecificChecked = true;
const specifics = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + name + '"][data-pair]:not([data-pair="__ALL__"])');
specifics.forEach((x) => {
if (!x.checked)
allSpecificChecked = false;
});
subAllCb.checked = !!allSpecificChecked;
}
else {
}
}
}
}
commitAndRefresh();
});
});
ul.querySelectorAll('input[type="checkbox"][data-pair]').forEach((pcb) => {
pcb.addEventListener('change', () => {
const analyst = pcb.getAttribute('data-analyst');
const pair = pcb.getAttribute('data-pair');
const topCb = ul.querySelector('input[type="checkbox"][data-analyst="' + analyst + '"]:not([data-pair])');
if (!topCb || !topCb.checked) {
pcb.checked = false;
commitAndRefresh();
return;
}
if (pair === '__ALL__') {
if (pcb.disabled) {
pcb.checked = false;
commitAndRefresh();
return;
}
if (pcb.checked) {
const specific = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair]:not([data-pair="__ALL__"])');
specific.forEach((x) => {
x.checked = true;
});
}
else {
}
commitAndRefresh();
return;
}
const subAll = ul.querySelector('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair="__ALL__"]');
if (subAll && !subAll.disabled) {
const specific = ul.querySelectorAll('input[type="checkbox"][data-analyst="' + analyst + '"][data-pair]:not([data-pair="__ALL__"])');
let allChecked = true;
specific.forEach((x) => {
if (!x.checked)
allChecked = false;
});
subAll.checked = allChecked;
}
else if (subAll) {
subAll.checked = false;
}
commitAndRefresh();
});
});
}
containers.forEach((c) => buildOneContainer(c));
}
function setupAnalystTickerFilter() {
const statsContainerIds = ['analyst-filter-container', 'analyst-filter-container-monthly'];
const historyContainerIds = ['analyst-filter-container-history', 'analyst-filter-container-equity'];
const statsContainers = statsContainerIds.map((id) => document.getElementById(id)).filter((el) => !!el);
const historyContainers = historyContainerIds.map((id) => document.getElementById(id)).filter((el) => !!el);
const allContainers = statsContainers.concat(historyContainers);
if (!allContainers.length)
return;
if (!__tfAnalystFilterOutsideClickInstalled) {
__tfAnalystFilterOutsideClickInstalled = true;
document.addEventListener('click', function onDocClickCloseMenus(event) {
const clickedInside = !!event.target.closest('#analyst-filter-container, #analyst-filter-container-monthly, #analyst-filter-container-history, #analyst-filter-container-equity');
if (clickedInside)
return;
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu && menu.style && menu.style.display === 'block') {
menu.style.display = 'none';
const arrow = menu.parentElement && menu.parentElement.querySelector('span.analyst-filter-arrow');
if (arrow) {
arrow.classList.remove('open');
arrow.setAttribute('aria-expanded', 'false');
}
}
});
});
}
const pairsByAnalystStats = {};
const pairsByAnalystHistory = {};
if (analystSourcesByName && typeof analystSourcesByName === 'object') {
Object.keys(analystSourcesByName).forEach((name) => {
if (!name)
return;
const src = analystSourcesByName[name];
if (!pairsByAnalystStats[name])
pairsByAnalystStats[name] = new Set();
if (!pairsByAnalystHistory[name])
pairsByAnalystHistory[name] = new Set();
if (src && Array.isArray(src.pairs)) {
src.pairs.forEach((p) => {
if (p) {
const pp = String(p).toUpperCase();
pairsByAnalystStats[name].add(pp);
pairsByAnalystHistory[name].add(pp);
}
});
}
});
}
if (Array.isArray(historySignals)) {
historySignals.forEach((item) => {
if (!item || !item.analyst)
return;
const name = item.analyst;
const p = item.pair;
if (name) {
if (!pairsByAnalystStats[name])
pairsByAnalystStats[name] = new Set();
if (!pairsByAnalystHistory[name])
pairsByAnalystHistory[name] = new Set();
if (p) {
pairsByAnalystStats[name].add(String(p).toUpperCase());
pairsByAnalystHistory[name].add(String(p).toUpperCase());
}
}
});
}
const analystNamesStats = Object.keys(pairsByAnalystStats).sort((a, b) => a.localeCompare(b));
const analystNamesHistory = Object.keys(pairsByAnalystHistory).sort((a, b) => a.localeCompare(b));
if (!analystNamesStats.length) {
statsContainers.forEach((c) => (c.innerHTML = ''));
}
if (!analystNamesHistory.length) {
historyContainers.forEach((c) => (c.innerHTML = ''));
}
function tf_getNoDataPairsEntry(map, baseName) {
if (!map || typeof map !== 'object')
return null;
if (Object.prototype.hasOwnProperty.call(map, baseName))
return map[baseName];
const target = tf_normAnalystKey(baseName).toLowerCase();
try {
const keys = Object.keys(map);
for (const k of keys) {
if (tf_normAnalystKey(k).toLowerCase() === target) {
return map[k];
}
}
}
catch (e) { }
return null;
}
function tf_isNoDataPairStats(baseName, pair) {
const entry = tf_getNoDataPairsEntry(noDataPairsByAnalyst, baseName);
const p = tf_normPairKey(pair);
return !!(entry && p && entry[p]);
}
function tf_computeHistoryNoValuePairsByAnalyst() {
const tmp = {};
const arr = Array.isArray(historySignals) ? historySignals : [];
arr.forEach((it) => {
if (!it)
return;
const a = tf_normAnalystKey(it.analyst || '');
const p = tf_normPairKey(it.pair || '');
if (!a || !p)
return;
if (!tmp[a])
tmp[a] = {};
if (!tmp[a][p])
tmp[a][p] = { count: 0, absPips: 0 };
tmp[a][p].count += 1;
let pv = 0;
if (typeof it.pips === 'number') {
pv = it.pips;
}
else if (typeof it.pips === 'string') {
const v = parseFloat(it.pips);
if (Number.isFinite(v))
pv = v;
}
tmp[a][p].absPips += Math.abs(pv);
});
const out = {};
if (pairsByAnalystHistory && typeof pairsByAnalystHistory === 'object') {
Object.keys(pairsByAnalystHistory).forEach((baseName) => {
const a = tf_normAnalystKey(baseName);
const set = pairsByAnalystHistory[baseName];
if (!a || !set)
return;
try {
for (const pairRaw of set) {
const p = tf_normPairKey(pairRaw);
if (!p)
continue;
const s = (tmp[a] && tmp[a][p]) ? tmp[a][p] : { count: 0, absPips: 0 };
const noValue = (s.count === 0) || (s.count > 0 && s.absPips === 0);
if (noValue) {
if (!out[a])
out[a] = {};
out[a][p] = true;
}
}
}
catch (e) { }
});
}
return out;
}
const historyNoValuePairsByAnalyst = tf_computeHistoryNoValuePairsByAnalyst();
function tf_isNoValuePairHistory(baseName, pair) {
const a = tf_normAnalystKey(baseName);
const p = tf_normPairKey(pair);
return !!(historyNoValuePairsByAnalyst && historyNoValuePairsByAnalyst[a] && historyNoValuePairsByAnalyst[a][p]);
}
const analystHasValueOverall = {};
const allAnalystNamesOverall = Array.from(new Set([].concat(analystNamesStats || [], analystNamesHistory || [])));
allAnalystNamesOverall.sort((a, b) => a.localeCompare(b));
function tf_pairExistsInHistory(baseName, pair) {
const set = pairsByAnalystHistory && pairsByAnalystHistory[baseName];
if (!set)
return false;
const target = tf_normPairKey(pair);
try {
for (const x of set) {
if (tf_normPairKey(x) === target)
return true;
}
}
catch (e) { }
return false;
}
allAnalystNamesOverall.forEach((name) => {
const u = new Set();
(pairsByAnalystStats[name] || new Set()).forEach((p) => u.add(tf_normPairKey(p)));
(pairsByAnalystHistory[name] || new Set()).forEach((p) => u.add(tf_normPairKey(p)));
const pairs = Array.from(u).filter(Boolean);
let hasValue = false;
if (pairs.length) {
for (const p of pairs) {
const statsHas = (getDollarPerPipForPair(p) > 0) && !tf_isNoDataPairStats(name, p);
const histHas = tf_pairExistsInHistory(name, p) ? !tf_isNoValuePairHistory(name, p) : false;
if (statsHas || histHas) {
hasValue = true;
break;
}
}
}
analystHasValueOverall[name] = hasValue;
});
if (selectedAnalystsGlobal === undefined) {
let anyExcluded = false;
const map = {};
allAnalystNamesOverall.forEach((name) => {
if (analystHasValueOverall[name]) {
map[name] = true;
}
else {
anyExcluded = true;
}
});
selectedAnalystsGlobal = anyExcluded ? map : null;
}
function tf_isNoValuePairOverall(baseName, pair) {
const p = tf_normPairKey(pair);
if (!p)
return true;
if (getDollarPerPipForPair(p) <= 0)
return true;
const statsHasPair = !!(pairsByAnalystStats && pairsByAnalystStats[baseName] && pairsByAnalystStats[baseName].has(p));
const histHasPair = tf_pairExistsInHistory(baseName, p);
const statsHasValue = statsHasPair && !tf_isNoDataPairStats(baseName, p);
const histHasValue = histHasPair && !tf_isNoValuePairHistory(baseName, p);
return !(statsHasValue || histHasValue);
}
const pairsByAnalystUnified = {};
allAnalystNamesOverall.forEach((name) => {
const u = new Set();
(pairsByAnalystStats[name] || new Set()).forEach((p) => u.add(tf_normPairKey(p)));
(pairsByAnalystHistory[name] || new Set()).forEach((p) => u.add(tf_normPairKey(p)));
const clean = new Set();
try {
for (const x of u) {
const pp = tf_normPairKey(x);
if (pp)
clean.add(pp);
}
}
catch (e) { }
pairsByAnalystUnified[name] = clean;
});
function tf_buildDefaultPairsMapUnified() {
const defMap = {};
allAnalystNamesOverall.forEach((name) => {
const set = pairsByAnalystUnified[name] || new Set();
const pairs = Array.from(set).map((p) => tf_normPairKey(p)).filter(Boolean).sort();
const selected = pairs.filter((p) => !tf_isNoValuePairOverall(name, p));
defMap[name] = selected;
});
return defMap;
}
function tf_mergePairsMap(a, b) {
const out = {};
allAnalystNamesOverall.forEach((name) => {
const set = new Set();
const e1 = tf_getAllowedPairsOrNull(a, name);
const e2 = tf_getAllowedPairsOrNull(b, name);
if (Array.isArray(e1))
e1.forEach((p) => set.add(tf_normPairKey(p)));
if (Array.isArray(e2))
e2.forEach((p) => set.add(tf_normPairKey(p)));
const allowed = [];
const avail = pairsByAnalystUnified[name] || new Set();
try {
for (const p of set) {
const pp = tf_normPairKey(p);
if (!pp)
continue;
if (avail && avail.has(pp)) {
allowed.push(pp);
}
}
}
catch (e) { }
if (set.size > 0 || tf_getSelectedAnalystEntry(a, name) !== undefined || tf_getSelectedAnalystEntry(b, name) !== undefined) {
out[name] = allowed.sort();
}
});
return out;
}
const statsOk = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object');
const histOk = (selectedAnalystPairsMapHistory && typeof selectedAnalystPairsMapHistory === 'object');
const defUnified = tf_buildDefaultPairsMapUnified();
function tf_clonePairsMap(src) {
const out = {};
try {
Object.keys(defUnified || {}).forEach((k) => {
out[k] = Array.isArray(defUnified[k]) ? defUnified[k].slice() : [];
});
}
catch (e) { }
if (src && typeof src === 'object') {
try {
Object.keys(src).forEach((k) => {
const v = src[k];
if (Array.isArray(v))
out[k] = v.slice();
});
}
catch (e) { }
}
return out;
}
function tf_ensurePairsMap(map) {
const out = tf_clonePairsMap(map);
allAnalystNamesOverall.forEach((name) => {
const entry = tf_getSelectedAnalystEntry(out, name);
if (entry === undefined) {
out[name] = Array.isArray(defUnified[name]) ? defUnified[name].slice() : [];
}
else if (Array.isArray(entry)) {
const avail = pairsByAnalystUnified[name] || new Set();
const seen = new Set();
const cleaned = [];
try {
entry.forEach((p) => {
const pp = tf_normPairKey(p);
if (!pp)
return;
if (avail && avail.size && !avail.has(pp))
return;
if (!seen.has(pp)) {
seen.add(pp);
cleaned.push(pp);
}
});
}
catch (e) { }
out[name] = cleaned.sort();
}
});
return out;
}
if (!statsOk && !histOk) {
selectedAnalystPairsMapStats = tf_ensurePairsMap(null);
selectedAnalystPairsMapHistory = selectedAnalystPairsMapStats;
__tfAnalystTickerDefaultAppliedStats = true;
__tfAnalystTickerDefaultAppliedHistory = true;
}
else {
if (statsOk && !histOk) {
selectedAnalystPairsMapStats = tf_ensurePairsMap(selectedAnalystPairsMapStats);
selectedAnalystPairsMapHistory = selectedAnalystPairsMapStats;
__tfAnalystTickerDefaultAppliedHistory = true;
}
else if (!statsOk && histOk) {
selectedAnalystPairsMapHistory = tf_ensurePairsMap(selectedAnalystPairsMapHistory);
selectedAnalystPairsMapStats = selectedAnalystPairsMapHistory;
__tfAnalystTickerDefaultAppliedStats = true;
}
else {
if (selectedAnalystPairsMapStats !== selectedAnalystPairsMapHistory) {
const merged = tf_mergePairsMap(selectedAnalystPairsMapStats, selectedAnalystPairsMapHistory);
selectedAnalystPairsMapStats = merged;
selectedAnalystPairsMapHistory = merged;
}
selectedAnalystPairsMapStats = tf_ensurePairsMap(selectedAnalystPairsMapStats);
selectedAnalystPairsMapHistory = selectedAnalystPairsMapStats;
__tfAnalystTickerDefaultAppliedStats = true;
__tfAnalystTickerDefaultAppliedHistory = true;
}
}
tf_buildAnalystTickerFilterGroup({
containers: allContainers,
analystNames: allAnalystNamesOverall,
pairsByAnalyst: pairsByAnalystUnified,
getState: () => selectedAnalystPairsMapStats,
setState: (m) => {
selectedAnalystPairsMapStats = m;
selectedAnalystPairsMapHistory = m;
},
getGlobalState: () => selectedAnalystsGlobal,
setGlobalState: (m) => (selectedAnalystsGlobal = m),
isAnalystNoValue: (name, pairs) => (analystHasValueOverall && analystHasValueOverall[name] === false),
applyFn: applyAnalystPairFilterAll,
isPairNoValue: (name, p) => tf_isNoValuePairOverall(name, p),
forceUncheckNoValue: true,
pairNoValueClass: 'tf-pair-no-value',
autoSelectPairsOnAnalystEnable: true
});
}
function applyAnalystPairFilterAll() {
buildMonthlyTableSkeleton();
renderSummaryTable();
recomputeHistoryRows();
}
function applyAnalystPairFilterStats() {
applyAnalystPairFilterAll();
}
function applyAnalystPairFilterHistory() {
applyAnalystPairFilterAll();
}
function applyAnalystPairFilter() {
applyAnalystPairFilterStats();
applyAnalystPairFilterHistory();
}
function applyPairFilter() {
applyAnalystPairFilterAll();
}
let analystSourcesByName = {};
function formatAnalystDisplayName(name) {
if (!name)
return '';
const raw = String(name).trim();
let out = raw;
if (/^https?:\/\//i.test(raw)) {
const m = raw.match(/channels\/(\d+)/i);
if (m && m[1]) {
out = 'Channel ' + m[1];
}
else {
try {
const u = new URL(raw);
out = u.hostname || 'Link';
}
catch (e) {
out = 'Link';
}
}
}
return out;
}
function tf_normAnalystKey(name) {
return String(name || '')
.replace(/[\u200B-\u200D\uFEFF]/g, '')
.replace(/\s+/g, ' ')
.trim();
}
function tf_normPairKey(pair) {
return String(pair || '')
.toUpperCase()
.replace(/[^A-Z0-9]/g, '')
.trim();
}
function tf_getSelectedAnalystEntry(map, analystName) {
if (!map || typeof map !== 'object')
return undefined;
if (Object.prototype.hasOwnProperty.call(map, analystName))
return map[analystName];
const norm = tf_normAnalystKey(analystName);
if (Object.prototype.hasOwnProperty.call(map, norm))
return map[norm];
const target = norm.toLowerCase();
try {
const keys = Object.keys(map);
for (const k of keys) {
if (tf_normAnalystKey(k).toLowerCase() === target) {
return map[k];
}
}
}
catch (e) { }
return undefined;
}
function tf_isAnalystGloballySelected(analystName) {
if (selectedAnalystsGlobal === undefined || selectedAnalystsGlobal === null)
return true;
if (selectedAnalystsGlobal && typeof selectedAnalystsGlobal === 'object') {
return tf_getSelectedAnalystEntry(selectedAnalystsGlobal, analystName) !== undefined;
}
return true;
}
function tf_getAllowedPairsOrNull(map, analystName) {
if (!map || typeof map !== 'object')
return null;
const entry = tf_getSelectedAnalystEntry(map, analystName);
return (typeof entry === 'undefined') ? null : entry;
}
function rebuildAnalystListFromSources() {
const nameSet = new Set();
const hasSources = (analystSourcesByName && typeof analystSourcesByName === 'object'
&& Object.keys(analystSourcesByName).some((k) => String(k || '').trim()));
if (hasSources) {
Object.keys(analystSourcesByName).forEach((name) => {
if (name) {
nameSet.add(name);
}
});
}
if (Array.isArray(historySignals)) {
historySignals.forEach((item) => {
if (item && item.analyst) {
nameSet.add(item.analyst);
}
});
}
const baseNames = Array.from(nameSet);
baseNames.sort((a, b) => a.localeCompare(b));
const expanded = [];
baseNames.forEach((baseName) => {
let pairs = [];
const src = analystSourcesByName && analystSourcesByName[baseName];
if (src && Array.isArray(src.pairs) && src.pairs.length) {
pairs = src.pairs.slice();
}
else if (Array.isArray(historySignals)) {
const pairSet = new Set();
historySignals.forEach((item) => {
if (item && item.analyst === baseName && item.pair) {
pairSet.add(item.pair);
}
});
pairs = Array.from(pairSet);
}
if (!pairs.length) {
expanded.push({
name: baseName,
baseName: baseName,
pair: null,
pairs: []
});
return;
}
pairs.forEach((pair) => {
expanded.push({
name: baseName + ' (' + pair + ')',
baseName: baseName,
pair: pair,
pairs: [pair]
});
});
});
ANALYSTS = expanded;
}
function computeSlStatsFromHistory(analystName, pair) {
const result = {
fixed: null,
fixedCount: 0,
avg: null
};
const pairUpper = pair ? String(pair).toUpperCase() : null;
const tf_getRowTs = (it) => {
if (!it)
return null;
if (typeof it.sortKey === 'number' && isFinite(it.sortKey))
return it.sortKey;
if (typeof it.sortKey === 'string' && it.sortKey) {
const t = Date.parse(it.sortKey);
if (!isNaN(t))
return t;
}
const s = String(it.displayDate || '').replace(/\s*WIB\s*$/i, '').trim();
const mm = /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(s);
if (mm) {
const dd = parseInt(mm[1], 10);
const mo = parseInt(mm[2], 10);
const yy = parseInt(mm[3], 10);
const hh = mm[4] ? parseInt(mm[4], 10) : 0;
const mi = mm[5] ? parseInt(mm[5], 10) : 0;
if (dd && mo && yy)
return new Date(yy, mo - 1, dd, hh || 0, mi || 0).getTime();
}
return null;
};
let avgCutoffTs = null;
let fixedCutoffTs = null;
try {
let maxTs = null;
(Array.isArray(historySignals) ? historySignals : []).forEach((it) => {
if (!it || it.analyst !== analystName)
return;
if (pairUpper) {
const p = String(it.pair || '').toUpperCase();
if (p !== pairUpper)
return;
}
const ts = tf_getRowTs(it);
if (ts == null)
return;
if (maxTs == null || ts > maxTs)
maxTs = ts;
});
if (maxTs != null) {
const avgDate = new Date(maxTs);
avgDate.setFullYear(avgDate.getFullYear() - 1);
avgCutoffTs = avgDate.getTime();
const fixedDate = new Date(maxTs);
fixedDate.setMonth(fixedDate.getMonth() - 6);
fixedCutoffTs = fixedDate.getTime();
}
}
catch (e) {
avgCutoffTs = null;
fixedCutoffTs = null;
}
let storedAvg = null;
try {
if (analystName && pairUpper && avgSlPipsByAnalystPair && typeof avgSlPipsByAnalystPair === "object") {
const baseMap = avgSlPipsByAnalystPair[String(analystName)];
if (baseMap && typeof baseMap === "object" && Object.prototype.hasOwnProperty.call(baseMap, pairUpper)) {
const v = parseFloat(baseMap[pairUpper]);
if (Number.isFinite(v) && v > 0) {
storedAvg = v;
}
}
}
}
catch (e) {
storedAvg = null;
}
if (!analystName || !Array.isArray(historySignals) || !historySignals.length) {
if (storedAvg) {
result.avg = storedAvg;
}
return result;
}
const MIN_FIXED_COUNT = 5;
const intFreq = Object.create(null);
const decSumByInt = Object.create(null);
let sumAbs = 0;
let count = 0;
historySignals.forEach((item) => {
if (!item || item.analyst !== analystName)
return;
if (pairUpper) {
const p = String(item.pair || '').toUpperCase();
if (p !== pairUpper)
return;
}
let rowTs = null;
if (avgCutoffTs != null || fixedCutoffTs != null) {
rowTs = tf_getRowTs(item);
if (rowTs == null)
return;
}
const inAvgWindow = avgCutoffTs == null || rowTs >= avgCutoffTs;
const inFixedWindow = fixedCutoffTs == null || rowTs >= fixedCutoffTs;
if (!inAvgWindow && !inFixedWindow)
return;
if (typeof item.pips !== 'number')
return;
if (item.pips >= 0)
return;
const absVal = Math.abs(item.pips);
if (!Number.isFinite(absVal) || absVal <= 0)
return;
if (inAvgWindow) {
sumAbs += absVal;
count += 1;
}
if (inFixedWindow) {
const baseInt = Math.trunc(absVal);
const dec = absVal - baseInt;
const k = String(baseInt);
intFreq[k] = (intFreq[k] || 0) + 1;
decSumByInt[k] = (decSumByInt[k] || 0) + (Number.isFinite(dec) ? dec : 0);
}
});
if (!count) {
if (storedAvg) {
result.avg = storedAvg;
}
return result;
}
const avgVal = sumAbs / count;
if (Number.isFinite(avgVal) && avgVal > 0) {
result.avg = avgVal;
}
let bestBase = null;
let bestCount = 0;
for (const k in intFreq) {
const c = intFreq[k] || 0;
if (c < MIN_FIXED_COUNT)
continue;
const base = parseInt(k, 10);
if (!Number.isFinite(base))
continue;
if (c > bestCount) {
bestCount = c;
bestBase = base;
}
else if (c === bestCount && bestBase != null && Number.isFinite(avgVal)) {
const candDist = Math.abs(base - avgVal);
const bestDist = Math.abs(bestBase - avgVal);
if (candDist < bestDist) {
bestBase = base;
}
}
else if (c === bestCount && bestBase == null) {
bestBase = base;
}
}
if (bestBase != null && bestCount >= MIN_FIXED_COUNT) {
const k = String(bestBase);
const decSum = decSumByInt[k] || 0;
const decAvg = decSum / bestCount;
const fixedVal = bestBase + (Number.isFinite(decAvg) ? decAvg : 0);
if (Number.isFinite(fixedVal) && fixedVal > 0) {
result.fixed = fixedVal;
result.fixedCount = bestCount;
}
}
if (storedAvg) {
result.avg = storedAvg;
}
return result;
}
function computeSlPipsFromHistory(analystName, pair) {
const stats = computeSlStatsFromHistory(analystName, pair);
if (!stats || !stats.fixed || stats.fixedCount < 5) {
return null;
}
return stats.fixed;
}
function tf_makeAnalystPairKey(analystName, pair) {
if (!analystName)
return '';
if (pair)
return analystName + '|' + String(pair).toUpperCase();
return analystName;
}
function getSelectedSlTypeForAnalyst(analystName, pair) {
if (!analystName)
return null;
const key = tf_makeAnalystPairKey(analystName, pair);
return slTypeSelectionByAnalyst[key] || null;
}
function setSelectedSlTypeForAnalyst(analystName, pair, type) {
if (!analystName)
return;
const key = tf_makeAnalystPairKey(analystName, pair);
if (type === 'fixed' || type === 'avg') {
slTypeSelectionByAnalyst[key] = type;
}
else {
delete slTypeSelectionByAnalyst[key];
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function getEffectiveSlForAnalyst(analystName, pairOrStats, maybeStats) {
let pair = null;
let precomputedStats = null;
if (pairOrStats && typeof pairOrStats === 'object' && maybeStats === undefined) {
precomputedStats = pairOrStats;
}
else {
pair = pairOrStats || null;
precomputedStats = maybeStats || null;
}
const stats = precomputedStats || computeSlStatsFromHistory(analystName, pair);
let type = getSelectedSlTypeForAnalyst(analystName, pair);
if (type === 'fixed' && (!stats.fixed || stats.fixedCount < 5)) {
type = null;
}
if (type === 'avg' && !stats.avg) {
type = null;
}
if (!type) {
if (stats.fixed && stats.fixedCount >= 5) {
type = 'fixed';
}
else if (stats.avg) {
type = 'avg';
}
else {
type = null;
}
}
if (type) {
setSelectedSlTypeForAnalyst(analystName, pair, type);
}
let pips = 0;
if (type === 'fixed') {
pips = stats.fixed || 0;
}
else if (type === 'avg') {
pips = stats.avg || 0;
}
return { type, pips };
}
let currentBalance = 5000;
let currentRiskPercent = 1;
let swapEnabled = false;
let swapRatePerLot = 9.01;
let commissionEnabled = false;
let commissionRatePerLot = 20;
let withdrawEnabled = false;
let withdrawAmount = 0;
let withdrawEveryMonths = 1;
let withdrawDraftEnabled = false;
let withdrawDraftAmount = null;
let withdrawDraftEveryMonths = 1;
const TF_WITHDRAW_ENABLED_KEY = "tf_withdraw_enabled";
const TF_WITHDRAW_AMOUNT_KEY = "tf_withdraw_amount";
const TF_WITHDRAW_EVERY_MONTHS_KEY = "tf_withdraw_every_months";
const TF_WITHDRAW_MIN_MONTHKEY = "2023-01";
const TF_INCOME_MINMAX_START_MONTHKEY = "2024-01";
function tf_monthIndexFromMonthKeySimple(monthKey) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
return (y * 12) + (mo - 1);
}
function tf_isWithdrawDueMonth(monthKey, everyMonths) {
const every = Number.isFinite(everyMonths) ? Math.max(1, Math.min(12, Math.floor(everyMonths))) : 1;
if (typeof monthKey !== 'string' || !/^\d{4}-\d{2}$/.test(monthKey))
return false;
if (monthKey < TF_WITHDRAW_MIN_MONTHKEY)
return false;
const idx = tf_monthIndexFromMonthKeySimple(monthKey);
const anchor = tf_monthIndexFromMonthKeySimple(TF_WITHDRAW_MIN_MONTHKEY);
if (idx === null || anchor === null)
return false;
return ((idx - anchor) % every) === 0;
}
let withdrawMaxAllowed = null;
let withdrawMinSuggested = null;
let withdrawDraftTouched = false;
let withdrawDraftAutoFilled = false;
function tf_setWithdrawAverageText(maxOrNull, priceBusy) {
try {
const elInline = document.getElementById('withdraw-average-inline');
const elInlineEq = document.getElementById('withdraw-average-inline-equity');
const elInlineHistory = document.getElementById('withdraw-average-inline-history');
const elLegacy = document.getElementById('withdraw-average-text');
const setText = (t) => {
if (elInline)
elInline.textContent = t;
if (elInlineEq)
elInlineEq.textContent = t;
if (elInlineHistory)
elInlineHistory.textContent = t;
if (elLegacy)
elLegacy.textContent = t;
const mainInput = document.getElementById('withdraw-amount-input');
if (mainInput)
mainInput.placeholder = t;
const eqInput = document.getElementById('withdraw-amount-input-equity');
if (eqInput)
eqInput.placeholder = t;
const histInput = document.getElementById('withdraw-amount-input-history');
if (histInput)
histInput.placeholder = t;
};
if (priceBusy) {
setText('average : -');
return;
}
if (maxOrNull === null || maxOrNull === undefined || !Number.isFinite(maxOrNull)) {
setText('average : -');
return;
}
setText(`average : ${formatMoney(Math.max(0, maxOrNull))}`);
}
catch (e) { }
}
function tf_setWithdrawMaxWarningVisible(visible, message) {
try {
const els = [
document.getElementById('withdraw-max-warning'),
document.getElementById('withdraw-max-warning-equity'),
document.getElementById('withdraw-max-warning-history')
].filter(Boolean);
if (!els.length)
return;
els.forEach((el) => {
if (visible) {
el.textContent = message || '';
el.style.display = 'block';
}
else {
el.textContent = '';
el.style.display = 'none';
}
});
}
catch (e) { }
}
function tf_getWithdrawMaxAllowedOrNull() {
return (Number.isFinite(withdrawMaxAllowed) && withdrawMaxAllowed >= 0) ? withdrawMaxAllowed : null;
}
function tf_enforceWithdrawAmountMax(showWarning, sourceInputEl) {
try {
const max = tf_getWithdrawMaxAllowedOrNull();
const inputsRaw = [
sourceInputEl,
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity'),
document.getElementById('withdraw-amount-input-history')
].filter(Boolean);
const seen = new Set();
const inputs = inputsRaw.filter((el) => {
const k = el && el.id ? el.id : String(el);
if (seen.has(k))
return false;
seen.add(k);
return true;
});
const input = inputs[0];
if (!input)
return false;
if (max === null) {
tf_setWithdrawMaxWarningVisible(false);
return false;
}
const rawStr = String(input.value || '').trim();
if (rawStr === '') {
withdrawDraftAmount = null;
tf_setWithdrawMaxWarningVisible(false);
inputs.forEach((el) => {
try {
el.value = '';
}
catch (e) { }
});
return false;
}
let v = safeParseFloat(input.value);
if (v === null || v < 0)
v = 0;
withdrawDraftAmount = v;
const exceeded = (v > max + 1e-9);
if (exceeded) {
const clamped = Math.max(0, max);
withdrawDraftAmount = clamped;
input.value = String(Math.round(clamped * 100) / 100);
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = input.value;
}
catch (e) { }
});
tf_setWithdrawMaxWarningVisible(true, `Withdraw tidak boleh melebihi ${formatMoney(clamped)}`);
return true;
}
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = String(input.value || '');
}
catch (e) { }
});
if (showWarning) {
tf_setWithdrawMaxWarningVisible(false);
}
return false;
}
catch (e) {
return false;
}
}
function tf_updateWithdrawMaxAllowedFromMonthlyIncome(incomeValuesGross, priceBusy) {
try {
if (priceBusy || !Array.isArray(incomeValuesGross) || !incomeValuesGross.length) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, priceBusy);
return;
}
let sum = 0;
let n = 0;
for (let i = 0; i < incomeValuesGross.length; i++) {
const v = incomeValuesGross[i];
if (!Number.isFinite(v))
continue;
sum += v;
n += 1;
}
if (!n) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
return;
}
const avg = sum / n;
withdrawMaxAllowed = Math.max(0, avg);
tf_setWithdrawAverageText(withdrawMaxAllowed, false);
tf_enforceWithdrawAmountMax(true);
}
catch (e) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
}
}
function tf_tryAutoFillWithdrawDraftFromSuggested() {
try {
if (withdrawDraftTouched)
return;
if (withdrawDraftAutoFilled)
return;
if (!Number.isFinite(withdrawMinSuggested) || withdrawMinSuggested === null)
return;
let hasStored = false;
let storedVal = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
hasStored = (raw !== null && raw !== undefined && String(raw).trim() !== '');
storedVal = safeParseFloat(raw);
}
}
catch (e) { }
if (hasStored && Number.isFinite(storedVal) && storedVal > 0)
return;
if (Number.isFinite(withdrawDraftAmount) && withdrawDraftAmount > 0)
return;
const inputs = [
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity')
].filter(Boolean);
if (!inputs.length)
return;
const v = Math.max(0, Number(withdrawMinSuggested) || 0);
withdrawDraftAmount = v;
const strVal = String(Math.round(v * 100) / 100);
inputs.forEach((el) => {
try {
el.value = strVal;
}
catch (e) { }
});
tf_enforceWithdrawAmountMax(true, inputs[0]);
withdrawDraftAutoFilled = true;
}
catch (e) { }
}
function tf_updateWithdrawMinSuggestedFromMonthlyIncome(monthlyGrossByMonth, priceBusy) {
try {
if (priceBusy || !Array.isArray(monthlyGrossByMonth) || !monthlyGrossByMonth.length) {
withdrawMinSuggested = null;
return;
}
let minAbs = null;
for (let i = 0; i < monthlyGrossByMonth.length; i++) {
const it = monthlyGrossByMonth[i] || {};
const mk = String(it.monthKey || '');
if (!mk || !/^\d{4}-\d{2}$/.test(mk))
continue;
if (mk < TF_WITHDRAW_MIN_MONTHKEY)
continue;
const v = Number(it.grossDollars);
if (!Number.isFinite(v))
continue;
const sig = Number(it.signals);
const hasData = (Number.isFinite(sig) ? sig : 0) > 0 || Math.abs(v) > 1e-9;
if (!hasData)
continue;
const absV = Math.abs(v);
if (!Number.isFinite(absV))
continue;
if (absV <= 0)
continue;
if (minAbs === null || absV < minAbs)
minAbs = absV;
}
withdrawMinSuggested = (minAbs === null) ? 0 : minAbs;
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) {
withdrawMinSuggested = null;
}
}
let analystRiskOverrides = {};
const TF_TABLE1_BALANCE_KEY = 'tf_current_balance';
const TF_TABLE1_RISK_KEY = 'tf_current_risk_percent';
const TF_TABLE1_RISK_OVERRIDES_KEY = 'tf_risk_overrides';
const TF_TABLE1_SWAP_ENABLED_KEY = 'tf_swap_enabled';
const TF_TABLE1_SWAP_RATE_KEY = 'tf_swap_rate_per_lot';
const TF_TABLE1_COMM_ENABLED_KEY = 'tf_commission_enabled';
const TF_TABLE1_COMM_RATE_KEY = 'tf_commission_rate_per_lot';
const TF_SL_TYPE_SELECTION_KEY = 'tf_sl_type_selection';
function tf_loadTable1StateFromLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
const bRaw = localStorage.getItem(TF_TABLE1_BALANCE_KEY);
const b = parseFloat(bRaw);
if (Number.isFinite(b) && b > 0)
currentBalance = b;
const rRaw = localStorage.getItem(TF_TABLE1_RISK_KEY);
const r = parseFloat(rRaw);
if (Number.isFinite(r) && r >= 0)
currentRiskPercent = r;
const swapEnRaw = localStorage.getItem(TF_TABLE1_SWAP_ENABLED_KEY);
if (swapEnRaw !== null) swapEnabled = (swapEnRaw === '1' || swapEnRaw === 'true' || swapEnRaw === 'yes');
const swapRateRaw = parseFloat(localStorage.getItem(TF_TABLE1_SWAP_RATE_KEY));
if (Number.isFinite(swapRateRaw) && swapRateRaw >= 0) swapRatePerLot = swapRateRaw;
const commEnRaw = localStorage.getItem(TF_TABLE1_COMM_ENABLED_KEY);
if (commEnRaw !== null) commissionEnabled = (commEnRaw === '1' || commEnRaw === 'true' || commEnRaw === 'yes');
const commRateRaw = parseFloat(localStorage.getItem(TF_TABLE1_COMM_RATE_KEY));
if (Number.isFinite(commRateRaw) && commRateRaw >= 0) commissionRatePerLot = commRateRaw;
const oRaw = localStorage.getItem(TF_TABLE1_RISK_OVERRIDES_KEY);
if (oRaw) {
const obj = JSON.parse(oRaw);
if (obj && typeof obj === 'object') {
const clean = {};
Object.keys(obj).forEach((k) => {
const v = parseFloat(obj[k]);
if (Number.isFinite(v) && v >= 0)
clean[String(k)] = v;
});
analystRiskOverrides = clean;
}
}
const slRaw = localStorage.getItem(TF_SL_TYPE_SELECTION_KEY);
if (slRaw) {
const obj2 = JSON.parse(slRaw);
if (obj2 && typeof obj2 === 'object') {
const clean2 = {};
Object.keys(obj2).forEach((k) => {
const v = obj2[k];
if (v === 'fixed' || v === 'avg')
clean2[String(k)] = v;
});
slTypeSelectionByAnalyst = clean2;
}
}
try {
const wEnRaw = localStorage.getItem(TF_WITHDRAW_ENABLED_KEY);
if (wEnRaw !== null) {
withdrawEnabled = (wEnRaw === '1' || wEnRaw === 'true' || wEnRaw === 'yes');
}
const wAmtRaw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
const wAmt = parseFloat(wAmtRaw);
if (Number.isFinite(wAmt) && wAmt >= 0)
withdrawAmount = wAmt;
const wEveryRaw = localStorage.getItem(TF_WITHDRAW_EVERY_MONTHS_KEY);
const wEvery = parseInt(wEveryRaw, 10);
if (Number.isFinite(wEvery) && wEvery >= 1 && wEvery <= 12)
withdrawEveryMonths = wEvery;
}
catch (e) { }
}
catch (e) {
}
}
function tf_saveTable1StateToLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
localStorage.setItem(TF_TABLE1_BALANCE_KEY, String(currentBalance));
localStorage.setItem(TF_TABLE1_RISK_KEY, String(currentRiskPercent));
localStorage.setItem(TF_TABLE1_SWAP_ENABLED_KEY, swapEnabled ? '1' : '0');
localStorage.setItem(TF_TABLE1_SWAP_RATE_KEY, String(Number.isFinite(swapRatePerLot) ? swapRatePerLot : 9.01));
localStorage.setItem(TF_TABLE1_COMM_ENABLED_KEY, commissionEnabled ? '1' : '0');
localStorage.setItem(TF_TABLE1_COMM_RATE_KEY, String(Number.isFinite(commissionRatePerLot) ? commissionRatePerLot : 20));
localStorage.setItem(TF_TABLE1_RISK_OVERRIDES_KEY, JSON.stringify(analystRiskOverrides || {}));
localStorage.setItem(TF_SL_TYPE_SELECTION_KEY, JSON.stringify(slTypeSelectionByAnalyst || {}));
localStorage.setItem(TF_WITHDRAW_ENABLED_KEY, withdrawEnabled ? '1' : '0');
try {
if (Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
localStorage.setItem(TF_WITHDRAW_AMOUNT_KEY, String(withdrawAmount));
}
else {
localStorage.removeItem(TF_WITHDRAW_AMOUNT_KEY);
}
}
catch (e) { }
localStorage.setItem(TF_WITHDRAW_EVERY_MONTHS_KEY, String(withdrawEveryMonths || 1));
}
catch (e) {
}
}
function tf_roundTradeCostMoney(value) {
const n = Number(value);
if (!Number.isFinite(n)) return 0;
return Math.round((n + Number.EPSILON) * 100) / 100;
}
function tf_buildTradeCostFields(lot, grossPnlDollar, denom) {
const lotAbs = Math.abs(Number(lot) || 0);
const gross = Number.isFinite(Number(grossPnlDollar)) ? Number(grossPnlDollar) : 0;
const swapCost = swapEnabled ? tf_roundTradeCostMoney(lotAbs * Math.max(0, Number(swapRatePerLot) || 0)) : 0;
const commCost = commissionEnabled ? tf_roundTradeCostMoney(lotAbs * Math.max(0, Number(commissionRatePerLot) || 0)) : 0;
const swapDollar = -swapCost;
const commDollar = -commCost;
const pnlDollarNet = tf_roundTradeCostMoney(gross + swapDollar + commDollar);
const d = Math.abs(Number(denom) || 0);
const pnlPercentNet = d > 0 ? (pnlDollarNet / d) * 100 : 0;
return { swapDollar, commDollar, pnlDollarNet, pnlPercentNet };
}
function tf_getHistoryNetPnlDollar(row) {
if (!row) return 0;
if (row.isWithdraw) return Number.isFinite(Number(row.pnlDollar)) ? Number(row.pnlDollar) : 0;
if (Number.isFinite(Number(row.pnlDollarNet))) return Number(row.pnlDollarNet);
const gross = Number.isFinite(Number(row.pnlDollar)) ? Number(row.pnlDollar) : ((Number(row.dollarTP) || 0) - (Number(row.dollarSL) || 0));
return tf_buildTradeCostFields(row.lot, gross, row.balanceCompound || currentBalance || 0).pnlDollarNet;
}
function tf_getHistoryNetPnlPercent(row) {
if (!row || row.isWithdraw) return Number.isFinite(Number(row && row.pnlPercent)) ? Number(row.pnlPercent) : 0;
if (Number.isFinite(Number(row.pnlPercentNet))) return Number(row.pnlPercentNet);
const denom = Math.abs(Number(row.balanceCompound) || Number(currentBalance) || 0);
return tf_buildTradeCostFields(row.lot, Number(row.pnlDollar) || 0, denom).pnlPercentNet;
}
function tf_getCostAdjustedHeaderSuffix() {
if (commissionEnabled && swapEnabled) return ' + COMM & SWAP';
if (commissionEnabled) return ' + COMM';
if (swapEnabled) return ' + SWAP';
return ' (Net)';
}
function tf_updateCostAdjustedHeaders() {
try {
let mode = '';
if (commissionEnabled && swapEnabled) mode = 'COMM & SWAP';
else if (commissionEnabled) mode = 'COMM';
else if (swapEnabled) mode = 'SWAP';
const dollarTh = document.getElementById('history-pnl-dollar-net-th');
const pctTh = document.getElementById('history-pnl-percent-net-th');
if (dollarTh) dollarTh.innerHTML = mode ? ('PnL $ +<br>' + mode) : 'PnL $';
if (pctTh) pctTh.innerHTML = mode ? ('PnL % +<br>' + mode) : 'PnL %';
}
catch (e) { }
}
function tf_isHistoryCostColumnEnabled(key) {
if (key === 'swapDollar') return !!swapEnabled;
if (key === 'commDollar') return !!commissionEnabled;
if (key === 'pnlDollarNet' || key === 'pnlPercentNet') return !!(swapEnabled || commissionEnabled);
return true;
}
function tf_shouldHideHistoryColumn(key, visibility) {
return !!((visibility && visibility[key] === false) || !tf_isHistoryCostColumnEnabled(key));
}
function getRiskPercentForAnalyst(analystName, pair) {
if (analystName) {
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (Object.prototype.hasOwnProperty.call(analystRiskOverrides, key)) {
const v = analystRiskOverrides[key];
if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
return v;
}
}
}
return currentRiskPercent;
}
function setAnalystRiskOverride(analystName, pair, value) {
if (!analystName)
return;
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (value === null || !Number.isFinite(value) || value < 0) {
delete analystRiskOverrides[key];
}
else {
analystRiskOverrides[key] = value;
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function clearAllAnalystRiskOverrides() {
analystRiskOverrides = {};
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function normalizeWIBSuffix(s) {
if (s == null)
return s;
const t = String(s).trim();
return t.replace(/\s*(WIB\s*)+$/i, ' WIB').trim();
}
let historySignals = [];
let initialHistorySignals = null;
let monthlyStatsByAnalyst = {};
let slTypeSelectionByAnalyst = {};
let noDataPairsByAnalyst = {};
let avgSlPipsByAnalystPair = {};
const TF_TRADE_RANGE_STORAGE_KEY = 'tf_trade_time_range_v1';
const TF_TRADE_RANGE_OPTIONS = [
{ key: 'all', label: 'ALL', title: 'All', monthsBack: 0 },
{ key: 'm1', label: '1M', title: '1 Month', monthsBack: 1 },
{ key: 'm2', label: '2M', title: '2 Month', monthsBack: 2 },
{ key: 'm3', label: '3M', title: '3 Month', monthsBack: 3 },
{ key: 'm4', label: '4M', title: '4 Month', monthsBack: 4 },
{ key: 'm5', label: '5M', title: '5 Month', monthsBack: 5 },
{ key: 'm6', label: '6M', title: '6 Month', monthsBack: 6 },
{ key: 'm7', label: '7M', title: '7 Month', monthsBack: 7 },
{ key: 'm8', label: '8M', title: '8 Month', monthsBack: 8 },
{ key: 'm9', label: '9M', title: '9 Month', monthsBack: 9 },
{ key: 'm10', label: '10M', title: '10 Month', monthsBack: 10 },
{ key: 'm11', label: '11M', title: '11 Month', monthsBack: 11 },
{ key: 'y1', label: '1Y', title: '1 Year', monthsBack: 12 },
{ key: 'y2', label: '2Y', title: '2 Year', monthsBack: 24 },
{ key: 'y3', label: '3Y', title: '3 Year', monthsBack: 36 },
{ key: 'y5', label: '5Y', title: '5 Year', monthsBack: 60 }
];
let tfTradeTimeRangeKey = 'all';
const TF_SINGLE_MONTH_STORAGE_KEY = 'tf_trade_single_month_v1';
let tfTradeSingleMonthKey = '';
let allMonthKeysSorted = [];
const MAX_MONTH_COLUMNS = 12;
function rebuildMonthKeysFromStats() {
const set = new Set();
const stats = monthlyStatsByAnalyst || {};
Object.keys(stats).forEach((name) => {
const aStats = stats[name];
if (!aStats || typeof aStats !== 'object')
return;
Object.keys(aStats).forEach((key) => {
if (!key || !/^\d{4}-\d{2}$/.test(key))
return;
set.add(key);
});
});
const keys = Array.from(set);
keys.sort((a, b) => {
const [aY, aM] = a.split('-').map((v) => parseInt(v, 10));
const [bY, bM] = b.split('-').map((v) => parseInt(v, 10));
if (aY !== bY)
return aY - bY;
return aM - bM;
});
allMonthKeysSorted = keys;
}
let __tfMonthlyMonthKeysSig = '';
function tf_getMonthlyVisibleMonthKeys() {
rebuildMonthKeysFromStats();
let monthKeys = Array.isArray(allMonthKeysSorted) ? allMonthKeysSorted.slice() : [];
if (tfTradeSingleMonthKey) {
monthKeys = monthKeys.filter((k) => String(k) === String(tfTradeSingleMonthKey));
return monthKeys;
}
const opt = tf_getRangeOptByKey(tfTradeTimeRangeKey);
const monthsBack = opt && Number.isFinite(opt.monthsBack) ? (opt.monthsBack || 0) : 0;
if (monthsBack && monthsBack > 0 && monthKeys.length) {
let maxIdx = null;
for (let i = 0; i < monthKeys.length; i++) {
const mi = tf_monthKeyToIndex(monthKeys[i]);
if (mi == null)
continue;
if (maxIdx == null || mi > maxIdx)
maxIdx = mi;
}
if (maxIdx == null) {
monthKeys = [];
}
else {
const startIdx = maxIdx - (monthsBack - 1);
monthKeys = monthKeys.filter((k) => {
const mi = tf_monthKeyToIndex(k);
if (mi == null)
return false;
return mi >= startIdx;
});
}
}
return monthKeys;
}
function tf_syncMonthlyTableToTradeRange() {
let monthKeys = [];
try {
monthKeys = tf_getMonthlyVisibleMonthKeys();
}
catch (e) {
monthKeys = [];
}
const sig = (monthKeys || []).join('|');
const needRebuild = (sig !== __tfMonthlyMonthKeysSig);
if (needRebuild) {
try {
buildMonthlyTableSkeleton();
}
catch (e) { }
__tfMonthlyMonthKeysSig = sig;
}
try {
updateMonthlyTableCells();
}
catch (e) { }
}
function rebuildMonthlyStatsFromHistory() {
const rows = Array.isArray(historySignals) ? historySignals : [];
if (!rows.length) {
rebuildMonthKeysFromStats();
return;
}
const stats = {};
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0) {
monthlyStatsByAnalyst = {};
rebuildMonthKeysFromStats();
return;
}
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
filteredAnalysts.forEach((a) => {
if (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object') {
const baseName = a.baseName || a.name;
const mapEntry = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (Array.isArray(mapEntry)) {
const pf = (a.pair || '').toString().toUpperCase();
if (!pf) {
return;
}
const match = mapEntry.some((p) => p.toString().toUpperCase() === pf);
if (!match) {
return;
}
}
}
else if (Array.isArray(selectedPairs) && selectedPairs.length > 0) {
const pf = a.pair;
if (pf && !selectedPairs.includes(pf)) {
return;
}
}
const baseName = a.baseName || a.name;
const pairFilter = a.pair || null;
const perMonth = {};
rows.forEach((item) => {
if (!item)
return;
if (item.analyst !== baseName)
return;
if (pairFilter && item.pair !== pairFilter)
return;
const rawSortKey = item.sortKey;
let monthKey = null;
if (typeof rawSortKey === 'number' && isFinite(rawSortKey)) {
const d = new Date(rawSortKey);
if (!isNaN(d.getTime())) {
const yyyy = d.getFullYear();
const mm = d.getMonth() + 1;
monthKey =
String(yyyy).padStart(4, '0') +
'-' +
String(mm).padStart(2, '0');
}
}
else if (typeof rawSortKey === 'string') {
if (rawSortKey.length >= 7) {
const candidate = rawSortKey.slice(0, 7);
if (/^\d{4}-\d{2}$/.test(candidate)) {
monthKey = candidate;
}
}
}
if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
return;
}
if (!perMonth[monthKey]) {
perMonth[monthKey] = { pips: 0, signals: 0 };
}
perMonth[monthKey].pips += typeof item.pips === 'number' ? item.pips : 0;
perMonth[monthKey].signals += 1;
});
stats[a.name] = perMonth;
});
monthlyStatsByAnalyst = stats;
rebuildMonthKeysFromStats();
}
function getVisibleMonthKeys() {
if (!Array.isArray(allMonthKeysSorted) || !allMonthKeysSorted.length)
return [];
const endKey = allMonthKeysSorted[allMonthKeysSorted.length - 1];
const m = endKey.match(/^(\d{4})-(\d{2})$/);
if (!m) {
const keys = allMonthKeysSorted.slice();
return keys.length <= MAX_MONTH_COLUMNS ? keys : keys.slice(keys.length - MAX_MONTH_COLUMNS);
}
const endYear = parseInt(m[1], 10);
const endMonth = parseInt(m[2], 10);
const formatKey = (y, mm) => String(y).padStart(4, '0') + '-' + String(mm).padStart(2, '0');
const shiftMonth = (y, mm, delta) => {
const total = y * 12 + (mm - 1) + delta;
const ny = Math.floor(total / 12);
const nm = (total % 12) + 1;
return formatKey(ny, nm);
};
const out = [];
for (let i = MAX_MONTH_COLUMNS - 1; i >= 0; i--) {
out.push(shiftMonth(endYear, endMonth, -i));
}
return out;
}
function formatMonthKeyToLabel(monthKey) {
if (!monthKey)
return '';
const m = monthKey.match(/^(\d{4})-(\d{2})$/);
if (!m)
return monthKey;
const year = m[1];
const monthIndex = parseInt(m[2], 10) - 1;
const monthName = MONTHS[monthIndex] || monthKey;
return monthName + '\n' + year;
}
function tf_formatMonthKeyInline(monthKey) {
if (!monthKey || typeof monthKey !== 'string')
return '-';
const m = monthKey.match(/^(\d{4})-(\d{2})$/);
if (!m)
return String(monthKey);
const year = m[1];
const monthIndex = parseInt(m[2], 10) - 1;
const monthName = MONTHS[monthIndex] || m[2];
return monthName + ' ' + year;
}
let equityCurvePoints = [];
let equityHoverIndex = null;
let equityCrosshairX = null;
let equityCrosshairY = null;
let lastHistoryRows = [];
const TF_EQUITY_CHART_MODE_KEY = 'tf_equity_chart_mode_v1';
let equityChartMode = 'line';
function tf_loadEquityChartModePreference() {
try {
const raw = localStorage.getItem(TF_EQUITY_CHART_MODE_KEY);
if (raw === 'candle' || raw === 'line') {
equityChartMode = raw;
}
else {
equityChartMode = 'line';
}
}
catch (e) {
equityChartMode = 'line';
}
}
function tf_saveEquityChartModePreference() {
try {
localStorage.setItem(TF_EQUITY_CHART_MODE_KEY, equityChartMode);
}
catch (e) { }
}
function tf_syncEquityChartModeButtonsUI() {
try {
const wrap = document.getElementById('tf-equity-chartmode-buttons');
if (!wrap)
return;
const btns = wrap.querySelectorAll('button[data-mode]');
Array.prototype.forEach.call(btns, function (b) {
const m = b.getAttribute('data-mode');
if (m === equityChartMode)
b.classList.add('active');
else
b.classList.remove('active');
});
}
catch (e) { }
}
const TF_EQUITY_LOG_SCALE_KEY = 'tf_equity_log_scale_v1';
let equityLogScaleEnabled = false;
function tf_loadEquityLogScalePreference() {
try {
const raw = localStorage.getItem(TF_EQUITY_LOG_SCALE_KEY);
equityLogScaleEnabled = (raw === '1');
}
catch (e) {
equityLogScaleEnabled = false;
}
}
function tf_saveEquityLogScalePreference() {
try {
localStorage.setItem(TF_EQUITY_LOG_SCALE_KEY, equityLogScaleEnabled ? '1' : '0');
}
catch (e) { }
}
function tf_syncEquityLogScaleButtonUI() {
try {
const btn = document.getElementById('tf-equity-log-btn');
if (!btn)
return;
if (equityLogScaleEnabled)
btn.classList.add('active');
else
btn.classList.remove('active');
}
catch (e) { }
}
let equityDailyCandles = [];
let equityCandleViewStart = 0;
let equityCandleViewEnd = null;
let equityCandleHoverIndex = null;
let equityCandleIsDragging = false;
let equityCandleDragStartX = 0;
let equityCandleDragStartStart = 0;
let equityCandleDrawMetrics = null;
// REV308: mobile-first Equity touch inspection state.
let tfEquityTouchActive = false;
let tfEquityTouchStartX = 0;
let tfEquityTouchStartY = 0;
let tfEquityLastTapAt = 0;
let tfEquityTouchHideTimer = 0;
// REV311: two-finger pinch state (mobile + touchscreen parity).
let tfEquityPinchActive = false;
let tfEquityPinchStartDistance = 0;
let tfEquityPinchStartSpan = 0;
let tfEquityPinchAnchorIndex = 0;
let tfEquityPinchAnchorFrac = 0.5;
function tf_markEquityCandleViewportForFullReset() {
try {
equityCandleViewStart = 0;
equityCandleViewEnd = null;
equityCandleHoverIndex = null;
equityHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
}
catch (e) { }
}
function tf_resetEquityCandleViewportToFull() {
try {
equityCandleViewStart = 0;
equityCandleViewEnd = (Array.isArray(equityDailyCandles) ? (equityDailyCandles.length - 1) : null);
}
catch (e) {
equityCandleViewStart = 0;
equityCandleViewEnd = null;
}
}
function tf_clampEquityCandleViewport() {
const n = Array.isArray(equityDailyCandles) ? equityDailyCandles.length : 0;
if (!n) {
equityCandleViewStart = 0;
equityCandleViewEnd = null;
return;
}
if (equityCandleViewEnd === null || !isFinite(equityCandleViewEnd))
equityCandleViewEnd = n - 1;
equityCandleViewStart = Math.max(0, Math.min(n - 1, Math.floor(equityCandleViewStart || 0)));
equityCandleViewEnd = Math.max(0, Math.min(n - 1, Math.floor(equityCandleViewEnd || 0)));
if (equityCandleViewEnd < equityCandleViewStart) {
const tmp = equityCandleViewStart;
equityCandleViewStart = equityCandleViewEnd;
equityCandleViewEnd = tmp;
}
const minSpan = Math.min(10, n);
let span = equityCandleViewEnd - equityCandleViewStart + 1;
if (span < minSpan) {
const mid = (equityCandleViewStart + equityCandleViewEnd) / 2;
const half = Math.floor(minSpan / 2);
equityCandleViewStart = Math.max(0, Math.round(mid) - half);
equityCandleViewEnd = Math.min(n - 1, equityCandleViewStart + minSpan - 1);
if (equityCandleViewEnd - equityCandleViewStart + 1 < minSpan) {
equityCandleViewStart = Math.max(0, equityCandleViewEnd - minSpan + 1);
}
}
}
function tf_buildEquityDailyCandlesFromPoints(points) {
try {
if (!Array.isArray(points) || points.length < 2)
return [];
function tf_parseTs(pt) {
try {
if (!pt)
return null;
if (typeof pt.sortKey === 'number' && isFinite(pt.sortKey))
return pt.sortKey;
const raw = String(pt.date || pt.displayDate || '').trim();
if (!raw)
return null;
const parsed = Date.parse(raw);
if (!isNaN(parsed))
return parsed;
const s = raw.replace(/\s*(WIB\s*)+$/i, '').trim();
const mm = /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(s);
if (mm) {
const dd = parseInt(mm[1], 10);
const mo = parseInt(mm[2], 10);
const yy = parseInt(mm[3], 10);
const hh = mm[4] ? parseInt(mm[4], 10) : 0;
const mi = mm[5] ? parseInt(mm[5], 10) : 0;
if (dd && mo && yy)
return new Date(yy, mo - 1, dd, hh || 0, mi || 0).getTime();
}
return null;
}
catch (e) {
return null;
}
}
const out = [];
let cur = null;
for (let i = 1; i < points.length; i++) {
const p = points[i];
const ts = tf_parseTs(p);
if (!ts)
continue;
const d = new Date(ts);
const dayTs = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const dayKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const prev = points[i - 1];
const prevEq = prev && typeof prev.equity === 'number' && isFinite(prev.equity) ? prev.equity : 0;
const nowEq = p && typeof p.equity === 'number' && isFinite(p.equity) ? p.equity : prevEq;
const analystName = (!p.isWithdraw && typeof p.analyst === 'string') ? String(p.analyst).trim() : '';
if (!cur || cur.dayKey !== dayKey) {
cur = {
dayKey: dayKey,
dayTs: dayTs,
label: (function () {
try {
const dd = String(d.getDate()).padStart(2, '0');
const mo = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][d.getMonth()] || '';
const yy = d.getFullYear();
return dd + ' ' + mo + ' ' + yy;
}
catch (e) {
return dayKey;
}
})(),
open: prevEq,
high: Math.max(prevEq, nowEq),
low: Math.min(prevEq, nowEq),
close: nowEq,
analysts: [],
_analystSet: new Set(),
startPointIndex: i,
endPointIndex: i,
sumPnlDollar: (typeof p.pnlDollar === 'number' && isFinite(p.pnlDollar)) ? p.pnlDollar : 0,
sumPnlPips: (typeof p.pnlPips === 'number' && isFinite(p.pnlPips)) ? p.pnlPips : 0,
sumDollarTP: (typeof p.dollarTP === 'number' && isFinite(p.dollarTP)) ? p.dollarTP : 0,
sumDollarSL: (typeof p.dollarSL === 'number' && isFinite(p.dollarSL)) ? p.dollarSL : 0,
hasWithdraw: !!p.isWithdraw
};
out.push(cur);
if (analystName) {
try {
if (!cur._analystSet.has(analystName)) {
cur._analystSet.add(analystName);
cur.analysts.push(analystName);
}
}
catch (e) { }
}
}
else {
cur.endPointIndex = i;
cur.close = nowEq;
if (nowEq > cur.high)
cur.high = nowEq;
if (nowEq < cur.low)
cur.low = nowEq;
cur.sumPnlDollar += (typeof p.pnlDollar === 'number' && isFinite(p.pnlDollar)) ? p.pnlDollar : 0;
cur.sumPnlPips += (typeof p.pnlPips === 'number' && isFinite(p.pnlPips)) ? p.pnlPips : 0;
cur.sumDollarTP += (typeof p.dollarTP === 'number' && isFinite(p.dollarTP)) ? p.dollarTP : 0;
cur.sumDollarSL += (typeof p.dollarSL === 'number' && isFinite(p.dollarSL)) ? p.dollarSL : 0;
if (p.isWithdraw)
cur.hasWithdraw = true;
if (analystName) {
try {
if (!cur._analystSet)
cur._analystSet = new Set();
if (!cur._analystSet.has(analystName)) {
cur._analystSet.add(analystName);
if (!Array.isArray(cur.analysts))
cur.analysts = [];
cur.analysts.push(analystName);
}
}
catch (e) { }
}
}
}
try {
for (let k = 0; k < out.length; k++) {
const c = out[k];
if (!c)
continue;
if (Array.isArray(c.analysts)) {
c.analysts = c.analysts
.map((x) => String(x || '').trim())
.filter(Boolean)
.sort((a, b) => a.localeCompare(b));
}
else {
c.analysts = [];
}
if (c._analystSet)
delete c._analystSet;
}
}
catch (e) { }
return out;
}
catch (e) {
return [];
}
}
function setupEquityLogScaleToggle() {
try {
tf_loadEquityLogScalePreference();
}
catch (e) { }
try {
tf_syncEquityLogScaleButtonUI();
}
catch (e) { }
const btn = document.getElementById('tf-equity-log-btn');
if (!btn)
return;
btn.addEventListener('click', function () {
equityLogScaleEnabled = !equityLogScaleEnabled;
tf_saveEquityLogScalePreference();
tf_syncEquityLogScaleButtonUI();
try {
equityHoverIndex = null;
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (e) { }
drawEquityCurve();
});
}
let lastHistoryRowsForExport = [];
const tf_historyRowEnabledMap = new Map();
const tf_historyRowManualOverrideSet = new Set();
function tf_closedKeyOf(row) {
try {
const k = row && row.sortKey;
return (typeof k === 'number' && isFinite(k)) ? k : 0;
}
catch (e) {
return 0;
}
}
function tf_createdKeyOf(row) {
try {
const k = row && row.createdSortKey;
return (typeof k === 'number' && isFinite(k)) ? k : 0;
}
catch (e) {
return 0;
}
}
let tf_lastVisibleHistoryRowIds = [];
let tf_lastEligibleHistoryRowIds = [];
let tf_historyScrollRestoreTop = null;
let tf_historyScrollRestoreLeft = null;
function tf_captureHistoryTableScrollForRestore() {
try {
const section = document.getElementById('section-history');
if (!section)
return;
const scrollDiv = section.querySelector('.table-scroll');
if (!scrollDiv)
return;
tf_historyScrollRestoreTop = scrollDiv.scrollTop;
tf_historyScrollRestoreLeft = scrollDiv.scrollLeft;
}
catch (e) { }
}
function tf_restoreHistoryTableScrollIfRequested(scrollDiv) {
try {
if (!scrollDiv)
return false;
const hasTop = (tf_historyScrollRestoreTop !== null && Number.isFinite(tf_historyScrollRestoreTop));
const hasLeft = (tf_historyScrollRestoreLeft !== null && Number.isFinite(tf_historyScrollRestoreLeft));
if (!hasTop && !hasLeft)
return false;
const top = hasTop ? tf_historyScrollRestoreTop : null;
const left = hasLeft ? tf_historyScrollRestoreLeft : null;
tf_historyScrollRestoreTop = null;
tf_historyScrollRestoreLeft = null;
if (top !== null) {
const maxTop = Math.max(0, (scrollDiv.scrollHeight || 0) - (scrollDiv.clientHeight || 0));
scrollDiv.scrollTop = Math.max(0, Math.min(top, maxTop));
}
if (left !== null) {
const maxLeft = Math.max(0, (scrollDiv.scrollWidth || 0) - (scrollDiv.clientWidth || 0));
scrollDiv.scrollLeft = Math.max(0, Math.min(left, maxLeft));
}
return true;
}
catch (e) {
try {
tf_historyScrollRestoreTop = null;
tf_historyScrollRestoreLeft = null;
}
catch (e2) { }
return false;
}
}
function tf_isHistoryRowEligibleForAllToggle(row) {
try {
if (!row)
return false;
if (row.isWithdraw)
return true;
if (row.__tfAutoUnticked)
return false;
return true;
}
catch (e) {
return true;
}
}
function tf_historyRowId(row) {
try {
if (!row)
return '';
if (row.__tfRowId)
return String(row.__tfRowId);
const a = (row.analyst || '').trim();
const p = (row.pair || '').trim();
const ck = tf_closedKeyOf(row) || 0;
const crk = tf_createdKeyOf(row) || 0;
const kind = row.isWithdraw ? 'withdraw' : 'trade';
const extra = row.isWithdraw
? (String(row.displayDate || row.createdDate || '') + '|' + String(row.pnlDollar || row.dollarTP || 0))
: (String((row.pnlPips != null ? row.pnlPips : row.pips) || ''));
const id = kind + '|' + a + '|' + p + '|' + crk + '|' + ck + '|' + extra;
row.__tfRowId = id;
return id;
}
catch (e) {
return '';
}
}
function tf_isHistoryRowEnabled(rowOrId) {
const id = (typeof rowOrId === 'string') ? rowOrId : tf_historyRowId(rowOrId);
if (!id)
return true;
if (!tf_historyRowEnabledMap.has(id))
return true;
return !!tf_historyRowEnabledMap.get(id);
}
function tf_setHistoryRowEnabled(rowOrId, enabled) {
const id = (typeof rowOrId === 'string') ? rowOrId : tf_historyRowId(rowOrId);
if (!id)
return;
try {
tf_historyRowManualOverrideSet.add(id);
}
catch (e) { }
tf_historyRowEnabledMap.set(id, !!enabled);
}
function tf_initAutoUntickStartOfMonthRule(rowsSortedByClosed) {
try {
if (!Array.isArray(rowsSortedByClosed) || rowsSortedByClosed.length === 0)
return;
try {
for (let i = 0; i < rowsSortedByClosed.length; i++) {
const r0 = rowsSortedByClosed[i];
if (!r0)
continue;
const id0 = tf_historyRowId(r0);
if (!id0)
continue;
if (tf_historyRowManualOverrideSet && tf_historyRowManualOverrideSet.has(id0))
continue;
if (tf_historyRowEnabledMap.has(id0))
tf_historyRowEnabledMap.delete(id0);
}
}
catch (e) { }
const timeRangeActive = (String(tfTradeTimeRangeKey || 'all') !== 'all') || !!tfTradeSingleMonthKey;
let isCustomDateFilter = false;
try {
if (equityFilterStart !== null && equityFilterEnd !== null) {
if (equityFilterMin !== null && equityFilterMax !== null) {
const s = tf_dayKey(equityFilterStart);
const e = tf_dayKey(equityFilterEnd);
const mn = tf_dayKey(equityFilterMin);
const mx = tf_dayKey(equityFilterMax);
if (s !== null && e !== null && mn !== null && mx !== null) {
isCustomDateFilter = (s !== mn) || (e !== mx);
}
else {
isCustomDateFilter = true;
}
}
else {
isCustomDateFilter = true;
}
}
}
catch (e) { }
let firstClosedKey = null;
for (let i = 0; i < rowsSortedByClosed.length; i++) {
const r = rowsSortedByClosed[i];
if (!r || r.isWithdraw)
continue;
const ck = tf_closedKeyOf(r);
if (!Number.isFinite(ck) || ck <= 0)
continue;
if (firstClosedKey === null || ck < firstClosedKey)
firstClosedKey = ck;
}
if (firstClosedKey === null)
return;
const firstMonthKey = tf_monthKeyFromSortKey(firstClosedKey);
if (!firstMonthKey)
return;
let thresholdDay = null;
// REV224: for the per-calendar-month selector, the boundary must be the
// first day of the selected month, NOT the first trade's Closed At day.
// Otherwise a valid trade created earlier in the same month (for example
// Created 22-Jun, Closed 23-Jun) is incorrectly auto-unticked, which makes
// Performance/Probability and Equity Curve appear empty. Carry-over trades
// created before the selected month are still excluded by this rule.
if (tfTradeSingleMonthKey) {
try {
const mm = String(tfTradeSingleMonthKey || '').match(/^(\d{4})-(\d{2})$/);
if (mm) {
const yy = parseInt(mm[1], 10);
const mo = parseInt(mm[2], 10);
if (Number.isFinite(yy) && Number.isFinite(mo) && mo >= 1 && mo <= 12)
thresholdDay = new Date(yy, mo - 1, 1, 0, 0, 0, 0).getTime();
}
}
catch (e) { }
if (thresholdDay === null)
thresholdDay = tf_dayKey(firstClosedKey);
}
else if (isCustomDateFilter || timeRangeActive) {
thresholdDay = tf_dayKey(firstClosedKey);
}
else {
return;
}
if (thresholdDay === null)
return;
for (let i = 0; i < rowsSortedByClosed.length; i++) {
const r = rowsSortedByClosed[i];
if (!r || r.isWithdraw)
continue;
const ck = tf_closedKeyOf(r);
if (!Number.isFinite(ck) || ck <= 0)
continue;
const mk = tf_monthKeyFromSortKey(ck);
if (mk !== firstMonthKey)
continue;
const crk = tf_createdKeyOf(r);
const createdDay = tf_dayKey(crk);
if (createdDay === null)
continue;
if (createdDay < thresholdDay) {
const id = tf_historyRowId(r);
if (!id)
continue;
if (tf_historyRowManualOverrideSet && tf_historyRowManualOverrideSet.has(id))
continue;
tf_historyRowEnabledMap.set(id, false);
r.__tfAutoUnticked = true;
}
}
}
catch (e) { }
}
function tf_recomputeBalancesSkippingDisabled(rowsForUi, startingBalance, rm) {
try {
if (!Array.isArray(rowsForUi) || rowsForUi.length === 0)
return;
const risk = (rm === 'compound') ? 'compound' : 'fixed';
const startBal = Number.isFinite(startingBalance) ? startingBalance : 0;
rowsForUi.sort((a, b) => {
const ak = (a && typeof a.sortKey === 'number' && isFinite(a.sortKey)) ? a.sortKey : 0;
const bk = (b && typeof b.sortKey === 'number' && isFinite(b.sortKey)) ? b.sortKey : 0;
return ak - bk;
});
let firstMonthKey = null;
for (let i = 0; i < rowsForUi.length; i++) {
const r = rowsForUi[i];
if (!r || r.isWithdraw)
continue;
const ck = tf_closedKeyOf(r);
if (!Number.isFinite(ck) || ck <= 0)
continue;
firstMonthKey = tf_monthKeyFromSortKey(ck);
break;
}
const monthKeys = [];
const seen = new Set();
for (let i = 0; i < rowsForUi.length; i++) {
const r = rowsForUi[i];
if (!r)
continue;
const ck = tf_closedKeyOf(r) || tf_createdKeyOf(r) || 0;
const mk = tf_monthKeyFromSortKey(ck);
if (!mk)
continue;
if (!seen.has(mk)) {
seen.add(mk);
monthKeys.push(mk);
}
}
const monthIndexFromKey = (mk) => {
const m = String(mk || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
return y * 12 + (mo - 1);
};
const keyFromMonthIndex = (idx) => {
const y = Math.floor(idx / 12);
const mo = (idx % 12) + 1;
return String(y).padStart(4, '0') + '-' + String(mo).padStart(2, '0');
};
let fullMonthKeys = monthKeys.slice();
if (monthKeys.length >= 2) {
const firstIdx = monthIndexFromKey(monthKeys[0]);
const lastIdx = monthIndexFromKey(monthKeys[monthKeys.length - 1]);
if (firstIdx !== null && lastIdx !== null && lastIdx >= firstIdx) {
fullMonthKeys = [];
for (let mi = firstIdx; mi <= lastIdx; mi++) {
fullMonthKeys.push(keyFromMonthIndex(mi));
}
}
}
if (!firstMonthKey && fullMonthKeys.length)
firstMonthKey = fullMonthKeys[0];
const periodMonths = (risk === 'compound') ? Math.max(1, Math.min(12, Math.floor(Number(compoundMonths) || 1))) : 1;
const monthToPeriodStart = Object.create(null);
for (let i = 0; i < fullMonthKeys.length; i++) {
const startIndex = Math.floor(i / periodMonths) * periodMonths;
monthToPeriodStart[fullMonthKeys[i]] = fullMonthKeys[startIndex] || fullMonthKeys[i];
}
let runningEquity = startBal;
let runningTradeOnly = startBal;
let currentMonthKey = null;
let currentPeriodStartKey = null;
let sizingBase = startBal;
const lotCache = new Map();
const clearLotCache = () => { try {
lotCache.clear();
}
catch (e) { } };
const slPipsCache = new Map();
const tf_getEffectiveSlPipsForRecompute = (analystName, pair) => {
try {
const a = (analystName || '').trim();
const p = pair ? String(pair).toUpperCase() : '';
const key = a + '|' + p;
if (slPipsCache.has(key))
return slPipsCache.get(key) || 0;
let v = 0;
try {
const stats = computeSlStatsFromHistory(a, p || null);
const eff = getEffectiveSlForAnalyst(a, p || null, stats);
v = (eff && Number.isFinite(eff.pips) && eff.pips > 0) ? eff.pips : 0;
}
catch (e2) {
v = 0;
}
slPipsCache.set(key, v);
return v;
}
catch (e) {
return 0;
}
};
const isFirstDayWithdrawRow = (row, mk) => {
try {
if (!row || !row.isWithdraw || !mk)
return false;
const fd = tf_firstDaySortKeyFromMonthKey(mk);
const d1 = tf_dayKey(fd);
const d2 = tf_dayKey(tf_createdKeyOf(row) || tf_closedKeyOf(row) || 0);
if (d1 === null || d2 === null)
return false;
return d1 === d2;
}
catch (e) {
return false;
}
};
const enterMonth = (mk) => {
currentMonthKey = mk;
const pStart = monthToPeriodStart[mk] || mk;
if (risk !== 'compound') {
sizingBase = startBal;
return;
}
if (currentPeriodStartKey !== pStart) {
currentPeriodStartKey = pStart;
sizingBase = (mk === firstMonthKey) ? startBal : runningEquity;
clearLotCache();
}
};
if (fullMonthKeys.length && !currentMonthKey) {
enterMonth(fullMonthKeys[0]);
}
for (let i = 0; i < rowsForUi.length; i++) {
const row = rowsForUi[i];
if (!row)
continue;
const ck = tf_closedKeyOf(row) || 0;
const mk = tf_monthKeyFromSortKey(ck) || tf_monthKeyFromSortKey(tf_createdKeyOf(row) || 0);
if (mk && mk !== currentMonthKey) {
enterMonth(mk);
}
else if (!currentMonthKey && mk) {
enterMonth(mk);
}
const enabled = tf_isHistoryRowEnabled(row);
if (row.isWithdraw) {
const before = runningEquity;
const pnl = Number.isFinite(row.pnlDollar) ? row.pnlDollar
: ((Number(row.dollarTP) || 0) - (Number(row.dollarSL) || 0));
if (enabled) {
runningEquity += pnl;
}
row.pnlDollarNet = pnl;
row.pnlPercentNet = Number.isFinite(Number(row.pnlPercent)) ? Number(row.pnlPercent) : 0;
row.swapDollar = 0;
row.commDollar = 0;
row.balanceTradeOnly = runningTradeOnly;
row.balancePnl = runningEquity;
row.balanceCompound = (risk === 'compound') ? before : startBal;
if (risk === 'compound' && enabled && mk && isFirstDayWithdrawRow(row, mk)) {
sizingBase = runningEquity;
clearLotCache();
}
continue;
}
if (risk !== 'compound') {
const pnlDollar = Number.isFinite(row.pnlDollar) ? row.pnlDollar
: ((Number(row.dollarTP) || 0) - (Number(row.dollarSL) || 0));
const costFields = tf_buildTradeCostFields(row.lot, pnlDollar, startBal);
Object.assign(row, costFields);
if (enabled) {
runningTradeOnly += costFields.pnlDollarNet;
runningEquity += costFields.pnlDollarNet;
}
row.balanceTradeOnly = runningTradeOnly;
row.balancePnl = runningEquity;
row.balanceCompound = startBal;
continue;
}
const analyst = (row.analyst || '').trim();
const pair = (row.pair || '').trim();
const pnlPips = Number.isFinite(row.pnlPips) ? row.pnlPips
: (Number.isFinite(row.pips) ? row.pips : (Number(row.pips) || 0));
row.pnlPips = pnlPips;
const riskPercent = Math.max(0, Number(row.riskPercent) || 0);
const dollarPerPip = Math.abs(Number(row.dollarPerPip) || 0);
const slPips = tf_getEffectiveSlPipsForRecompute(analyst, pair);
const baseKey = Number.isFinite(sizingBase) ? Math.round(sizingBase * 100) : 0;
const cacheKey = (currentPeriodStartKey || '') + '|' + (currentMonthKey || '') + '|' + analyst + '|' + pair
+ '|B' + baseKey + '|R' + Math.round(riskPercent * 1000) + '|D' + Math.round(dollarPerPip * 10000) + '|S' + Math.round(slPips * 1000);
let lot = 0;
if (lotCache.has(cacheKey)) {
lot = lotCache.get(cacheKey) || 0;
}
else {
let calcLot = 0;
const baseForLot = Math.max(0, Number(sizingBase) || 0);
if (baseForLot > 0 && slPips > 0 && dollarPerPip > 0) {
calcLot = computeLot(baseForLot, riskPercent, slPips, dollarPerPip);
if (!Number.isFinite(calcLot) || calcLot <= 0)
calcLot = 0;
else
calcLot = roundLotToTwoDecimals(calcLot);
}
lotCache.set(cacheKey, calcLot);
lot = calcLot;
}
row.lot = lot;
row.balanceCompound = sizingBase;
const pnlDollar = (Number.isFinite(pnlPips) && Number.isFinite(lot) && Number.isFinite(dollarPerPip))
? (pnlPips * lot * dollarPerPip)
: 0;
row.pnlDollar = pnlDollar;
row.pipsTP = pnlPips > 0 ? pnlPips : 0;
row.pipsSL = pnlPips < 0 ? Math.abs(pnlPips) : 0;
row.dollarTP = pnlDollar > 0 ? pnlDollar : 0;
row.dollarSL = pnlDollar < 0 ? Math.abs(pnlDollar) : 0;
const denom = Math.abs(Number(sizingBase) || 0);
row.pnlPercent = denom > 0 ? (pnlDollar / denom) * 100 : 0;
const costFields = tf_buildTradeCostFields(lot, pnlDollar, denom);
Object.assign(row, costFields);
if (enabled) {
runningTradeOnly += costFields.pnlDollarNet;
runningEquity += costFields.pnlDollarNet;
}
row.balanceTradeOnly = runningTradeOnly;
row.balancePnl = runningEquity;
}
}
catch (e) {
}
}
let tf_lastEquityCalcRows = [];
let lastHistoryRiskMode = 'fixed';
let equityFilterMin = null;
let equityFilterMax = null;
let equityFilterStart = null;
let equityFilterEnd = null;
let equityMetric = 'usd';
const EQUITY_METRIC_STORAGE_KEY = 'tf_equity_metric';
let riskMode = 'fixed';
const RISK_MODE_STORAGE_KEY = 'tf_risk_mode';
let compoundMonths = 1;
const COMPOUND_MONTHS_STORAGE_KEY = 'tf_compound_months';
function formatMoney(value) {
if (!isFinite(value))
return '-';
return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function formatPlainNumber(value, decimals = 2) {
if (!isFinite(value))
return '-';
const v = Number(value);
const absStr = Math.abs(v).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
return v < 0 ? ('-' + absStr) : absStr;
}
function formatSignedMoney(value) {
if (!isFinite(value))
return '-';
const abs = Math.abs(value);
const base = formatMoney(abs);
if (value < 0) {
return '-' + base;
}
if (value > 0) {
return '+' + base;
}
return base;
}
function formatNumber(value, decimals = 2) {
if (!isFinite(value))
return '-';
return value.toFixed(decimals);
}
function formatPips(value, decimals = 1) {
if (!isFinite(value))
return '-';
return value.toFixed(decimals) + ' pips';
}
function formatSignedPips(value, decimals = 1) {
if (!isFinite(value))
return '-';
const abs = Math.abs(value);
const base = formatPips(abs, decimals);
if (value < 0)
return '-' + base;
if (value > 0)
return '+' + base;
return formatPips(0, decimals);
}
function loadEquityMetricPreference() {
try {
const saved = localStorage.getItem(EQUITY_METRIC_STORAGE_KEY);
if (saved === 'usd' || saved === 'pips') {
equityMetric = saved;
}
}
catch (e) {
}
}
function saveEquityMetricPreference() {
try {
localStorage.setItem(EQUITY_METRIC_STORAGE_KEY, equityMetric);
}
catch (e) {
}
}
function loadRiskModePreference() {
// REV177: Fixed Lot is always the default whenever the page is opened.
// Users can still switch to Compound % for the current session.
riskMode = 'fixed';
try {
localStorage.setItem(RISK_MODE_STORAGE_KEY, 'fixed');
}
catch (e) {
}
}
function loadCompoundMonthsPreference() {
try {
const saved = parseInt(localStorage.getItem(COMPOUND_MONTHS_STORAGE_KEY), 10);
if (Number.isFinite(saved) && saved >= 1 && saved <= 12) {
compoundMonths = saved;
}
}
catch (e) {
}
}
function saveCompoundMonthsPreference() {
try {
localStorage.setItem(COMPOUND_MONTHS_STORAGE_KEY, String(compoundMonths));
}
catch (e) {
}
}
function tf_monthKeyFromSortKey(sortKey) {
if (typeof sortKey === 'number' && isFinite(sortKey)) {
const d = new Date(sortKey);
if (!isNaN(d.getTime())) {
const yyyy = d.getFullYear();
const mm = d.getMonth() + 1;
return String(yyyy).padStart(4, '0') + '-' + String(mm).padStart(2, '0');
}
}
else if (typeof sortKey === 'string' && sortKey.length >= 7) {
const candidate = sortKey.slice(0, 7);
if (/^\d{4}-\d{2}$/.test(candidate))
return candidate;
}
return null;
}
function tf_getPrimarySortKey(row) {
try {
const sk = row && row.sortKey;
if (typeof sk === 'number' && isFinite(sk))
return sk;
const ck = row && row.createdSortKey;
if (typeof ck === 'number' && isFinite(ck))
return ck;
}
catch (e) { }
return null;
}
function tf_firstDaySortKeyFromMonthKey(monthKey) {
const m = String(monthKey || '').match(/^([0-9]{4})-([0-9]{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
const d = new Date(y, mo - 1, 1, 0, 0, 0, 0);
const ms = d.getTime();
return (typeof ms === 'number' && isFinite(ms)) ? ms : null;
}
function tf_firstDayDisplayDateFromMonthKey(monthKey) {
const m = String(monthKey || '').match(/^([0-9]{4})-([0-9]{2})$/);
if (!m)
return '';
const yyyy = m[1];
const mm = m[2];
return `01-${mm}-${yyyy}`;
}
function tf_shiftMonthKey(monthKey, deltaMonths) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
let y = parseInt(m[1], 10);
let mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
mo += (Number.isFinite(deltaMonths) ? deltaMonths : 0);
while (mo <= 0) {
mo += 12;
y -= 1;
}
while (mo > 12) {
mo -= 12;
y += 1;
}
return String(y).padStart(4, '0') + '-' + String(mo).padStart(2, '0');
}
function tf_setCompoundSubRowsVisible(isVisible) {
const ids = ['compound-sub-row-equity', 'compound-sub-row-history', 'compound-sub-row-monthly'];
ids.forEach((id) => {
const el = document.getElementById(id);
if (!el)
return;
el.style.display = isVisible ? '' : 'none';
});
}
function tf_updateHistoryBalanceHeaderLabel(currentRiskMode) {
const th = document.getElementById('history-balance-base-th');
if (!th)
return;
th.textContent = currentRiskMode === 'compound' ? 'Balance Compounded' : 'Balance';
}
function tf_setRiskModeRowsVisible(isVisible) {
const selIds = ['risk-mode-select', 'risk-mode-select-history', 'risk-mode-select-monthly'];
selIds.forEach((id) => {
const sel = document.getElementById(id);
if (!sel)
return;
const row = sel.closest ? sel.closest('.equity-filter-row') : null;
if (!row)
return;
row.style.display = isVisible ? '' : 'none';
});
}
function tf_getAllRiskModeSelects() {
return Array.from(document.querySelectorAll('#risk-mode-select, #risk-mode-select-history, #risk-mode-select-monthly'));
}
function tf_getAllCompoundMonthsSelects() {
return Array.from(document.querySelectorAll('#compound-months-select-equity, #compound-months-select-history, #compound-months-select-monthly'));
}
function tf_renderCompoundMonthsOptions(monthCount) {
const sels = tf_getAllCompoundMonthsSelects();
if (!sels.length)
return;
const safeCount = Number.isFinite(monthCount) ? Math.max(0, Math.floor(monthCount)) : 0;
if (safeCount > 0 && compoundMonths > safeCount) {
compoundMonths = safeCount;
saveCompoundMonthsPreference();
}
if (compoundMonths < 1)
compoundMonths = 1;
if (compoundMonths > 12)
compoundMonths = 12;
sels.forEach((sel) => {
const previous = sel.value;
sel.innerHTML = '';
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = i === 1 ? '1 month' : String(i) + ' month';
if (safeCount > 0 && i > safeCount) {
opt.disabled = true;
}
sel.appendChild(opt);
}
try {
sel.value = String(compoundMonths);
if (!sel.value && previous)
sel.value = previous;
}
catch (e) { }
});
}
function tf_buildMonthEndBalanceMapFromHistoryRows(rows) {
const map = Object.create(null);
if (!Array.isArray(rows))
return map;
for (let i = 0; i < rows.length; i++) {
const r = rows[i];
const mk = tf_monthKeyFromSortKey(tf_getPrimarySortKey(r));
if (mk) {
map[mk] = (r && Number.isFinite(r.balanceTradeOnly)) ? r.balanceTradeOnly : ((r && Number.isFinite(r.balancePnl)) ? r.balancePnl : map[mk]);
}
}
return map;
}
function tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBalanceMap, fallbackBalance) {
const offset = Number.isFinite(compoundMonths) ? Math.max(1, Math.min(12, Math.floor(compoundMonths))) : 1;
const targetKey = tf_shiftMonthKey(monthKey, -offset);
if (targetKey && monthEndBalanceMap) {
let k = targetKey;
for (let i = 0; i < 36 && k; i++) {
if (Object.prototype.hasOwnProperty.call(monthEndBalanceMap, k)) {
const v = monthEndBalanceMap[k];
if (Number.isFinite(v))
return v;
}
k = tf_shiftMonthKey(k, -1);
}
}
if (Number.isFinite(fallbackBalance))
return fallbackBalance;
return Number.isFinite(currentBalance) ? currentBalance : 0;
}
function saveRiskModePreference() {
try {
localStorage.setItem(RISK_MODE_STORAGE_KEY, riskMode);
}
catch (e) {
}
}
function formatEquityMetricAxis(value) {
if (equityMetric === 'usd') {
if (!isFinite(value)) return '-';
const n = Number(value);
if (Math.abs(n) < 0.005) return '$0';
// REV325/326 mobile: compact ONLY the left Equity Y-axis from $1,000 upward.
// Round labels to the nearest 0.5K step: 1K, 1,5K, 2K, 2,5K, 3K, ...
// Values below $1,000 keep the existing full-money format.
if (Math.abs(n) >= 1000) {
const roundedK = Math.round((n / 1000) * 2) / 2;
const absK = Math.abs(roundedK);
const compactK = Number.isInteger(absK) ? String(absK) : absK.toFixed(1).replace('.', ',');
return (roundedK < 0 ? '-$' : '$') + compactK + 'K';
}
return formatMoney(n);
}
if (!isFinite(value))
return '-';
return value.toFixed(1);
}
function formatEquityMetricSigned(value) {
return equityMetric === 'usd' ? formatSignedMoney(value) : formatSignedPips(value, 1);
}
function formatEquityMetricValue(value) {
return equityMetric === 'usd' ? formatMoney(value) : formatPips(value, 1);
}
function updateEquityCurveCopyForMetric() {
const titleEl = document.getElementById('equity-curve-title');
const badgeEl = document.getElementById('equity-curve-badge-text');
if (titleEl) {
titleEl.textContent =
equityMetric === 'usd'
? 'Equity Curve – Akumulasi $ per Trade'
: 'Equity Curve – Akumulasi Pips per Trade';
}
if (badgeEl) {
badgeEl.textContent =
equityMetric === 'usd'
? 'Hover untuk detail $ dan Equity'
: 'Hover untuk detail Pips dan Akumulasi';
}
}
function tf_updateUiForEquityMetric() {
try {
const isUsd = (equityMetric === 'usd');
try {
tf_setRiskModeRowsVisible(isUsd);
}
catch (e) { }
try {
tf_setCompoundSubRowsVisible(isUsd && (riskMode === 'compound'));
}
catch (e) { }
const withdrawToggleMain = document.getElementById('withdraw-enabled-toggle');
const withdrawAmountInputMain = document.getElementById('withdraw-amount-input');
const withdrawMonthsSelectMain = document.getElementById('withdraw-months-select');
const withdrawSubmitBtnMain = document.getElementById('withdraw-submit-btn');
const withdrawToggleEq = document.getElementById('withdraw-enabled-toggle-equity');
const withdrawAmountInputEq = document.getElementById('withdraw-amount-input-equity');
const withdrawMonthsSelectEq = document.getElementById('withdraw-months-select-equity');
const withdrawSubmitBtnEq = document.getElementById('withdraw-submit-btn-equity');
const withdrawToggleHistory = document.getElementById('withdraw-enabled-toggle-history');
const withdrawAmountInputHistory = document.getElementById('withdraw-amount-input-history');
const withdrawMonthsSelectHistory = document.getElementById('withdraw-months-select-history');
const withdrawSubmitBtnHistory = document.getElementById('withdraw-submit-btn-history');
const withdrawGroups = [
{ toggle: withdrawToggleMain, amount: withdrawAmountInputMain, months: withdrawMonthsSelectMain, submit: withdrawSubmitBtnMain },
{ toggle: withdrawToggleEq, amount: withdrawAmountInputEq, months: withdrawMonthsSelectEq, submit: withdrawSubmitBtnEq },
{ toggle: withdrawToggleHistory, amount: withdrawAmountInputHistory, months: withdrawMonthsSelectHistory, submit: withdrawSubmitBtnHistory }
];
const disabledTitle = isUsd ? '' : 'Tidak tersedia saat Filter by: PnL Pips';
try {
const primaryRiskTitle = document.querySelector('#equity-drawdown-summary > .equity-drawdown-summary-title');
if (primaryRiskTitle) {
primaryRiskTitle.textContent = isUsd
? 'Ringkasan Risiko — Consecutive Loss & Maximum Equity Drawdown'
: 'Ringkasan Risiko Pips — Consecutive Loss & Maximum Pips Drawdown';
}
}
catch (e) { }
withdrawGroups.forEach((g) => {
[g.toggle, g.amount, g.months, g.submit].forEach((el) => {
if (!el)
return;
el.disabled = !isUsd;
if (!isUsd)
el.title = disabledTitle;
});
});
if (isUsd) {
withdrawGroups.forEach((g) => {
if (g.submit && g.toggle) {
g.submit.disabled = !g.toggle.checked;
g.submit.title = g.toggle.checked ? '' : 'Enable Withdraw to apply';
}
});
}
}
catch (e) { }
}
function computeLot(balance, riskPercent, pipsPerTrade, dollarPerPip) {
const riskAmount = (balance * riskPercent) / 100;
const denom = pipsPerTrade * dollarPerPip;
if (denom <= 0)
return 0;
return riskAmount / denom;
}
function roundLotToTwoDecimals(lot) {
if (!Number.isFinite(lot) || lot <= 0)
return 0;
const scaled = lot * 100;
const scaledFloor = Math.floor(scaled);
const diff = scaled - scaledFloor;
let roundedScaled;
if (diff > 0.5) {
roundedScaled = scaledFloor + 1;
}
else {
roundedScaled = scaledFloor;
}
return roundedScaled / 100;
}
function computeFixedLot(balance, riskPercent, pipsPerTrade, dollarPerPip) {
const rawLot = computeLot(balance, riskPercent, pipsPerTrade, dollarPerPip);
return roundLotToTwoDecimals(rawLot);
}
function safeParseFloat(v) {
const n = parseFloat(v);
return isNaN(n) ? null : n;
}
function parseDateFromInputs(dateStr, timeStr) {
const parts = (dateStr || '').trim().split('-');
if (parts.length !== 3)
return null;
const [ddStr, mmStr, yyyyStr] = parts;
const dd = parseInt(ddStr, 10);
const mm = parseInt(mmStr, 10);
const yyyy = parseInt(yyyyStr, 10);
let hh = 0;
let min = 0;
if ((timeStr || '').trim()) {
const tParts = timeStr.trim().split(':');
if (tParts.length >= 2) {
hh = parseInt(tParts[0], 10) || 0;
min = parseInt(tParts[1], 10) || 0;
}
}
if (!dd || !mm || !yyyy)
return null;
return new Date(yyyy, mm - 1, dd, hh, min).getTime();
}
function formatDateInputFromSortKey(sortKey) {
if (typeof sortKey !== 'number' || !isFinite(sortKey))
return '';
const d = new Date(sortKey);
const yyyy = d.getFullYear();
const mm = String(d.getMonth() + 1).padStart(2, '0');
const dd = String(d.getDate()).padStart(2, '0');
return yyyy + '-' + mm + '-' + dd;
}
function parseDateInputToSortKey(dateStr) {
if (!dateStr)
return null;
const parts = dateStr.split('-');
if (parts.length !== 3)
return null;
const yyyy = parseInt(parts[0], 10);
const mm = parseInt(parts[1], 10);
const dd = parseInt(parts[2], 10);
if (!yyyy || !mm || !dd)
return null;
return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0).getTime();
}
function tf_dayKey(ts) {
if (typeof ts !== 'number' || !isFinite(ts))
return null;
const s = formatDateInputFromSortKey(ts);
return parseDateInputToSortKey(s);
}
function tf_filterRowsByUnifiedDate(rows) {
if (!Array.isArray(rows) || rows.length === 0)
return [];
if (equityFilterStart === null || equityFilterEnd === null)
return rows.slice();
const startDay = tf_dayKey(equityFilterStart);
const endDay = tf_dayKey(equityFilterEnd);
if (startDay === null || endDay === null)
return rows.slice();
const lo = Math.min(startDay, endDay);
const hi = Math.max(startDay, endDay);
return rows.filter((row) => {
const k = tf_getPrimarySortKey(row);
const day = tf_dayKey(k);
if (day === null)
return false;
return day >= lo && day <= hi;
});
}
function tf_applyStartTradeCreatedClosedRule(rows) {
const arr = Array.isArray(rows) ? rows.slice() : [];
try {
return arr.filter(r => tf_isHistoryRowEnabled(r));
}
catch (e) {
return arr;
}
}
function tf_getHistoryRowsForUiAndExport(baseRows) {
const byDate = tf_filterRowsByUnifiedDate(baseRows);
tf_initAutoUntickStartOfMonthRule(byDate);
try {
for (let i = 0; i < byDate.length; i++) {
const r = byDate[i];
if (!r || !r.isWithdraw)
continue;
if (!r.__tfWithdrawAutoUntick)
continue;
const id = tf_historyRowId(r);
if (!id)
continue;
if (tf_historyRowManualOverrideSet && tf_historyRowManualOverrideSet.has(id))
continue;
tf_historyRowEnabledMap.set(id, false);
r.__tfWithdrawAutoUnticked = true;
}
}
catch (e) { }
try {
for (let i = 0; i < byDate.length; i++) {
const r = byDate[i];
if (!r)
continue;
r.__tfRowId = tf_historyRowId(r);
r.__tfEnabled = tf_isHistoryRowEnabled(r.__tfRowId);
}
}
catch (e) { }
return byDate;
}
function tf_syncHistoryDateInputsFromState() {
const startInput = document.getElementById('history-start-date');
const endInput = document.getElementById('history-end-date');
if (!startInput || !endInput)
return;
if (equityFilterMin === null || equityFilterMax === null)
return;
const minStr = formatDateInputFromSortKey(equityFilterMin);
const maxStr = formatDateInputFromSortKey(equityFilterMax);
startInput.min = minStr;
startInput.max = maxStr;
endInput.min = minStr;
endInput.max = maxStr;
if (equityFilterStart !== null)
startInput.value = formatDateInputFromSortKey(equityFilterStart);
if (equityFilterEnd !== null)
endInput.value = formatDateInputFromSortKey(equityFilterEnd);
}
function renderSummaryTable() {
const tbody = document.querySelector('#summary-table tbody');
if (!tbody)
return;
tbody.innerHTML = '';
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0) {
return;
}
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
const priceBusy = tf_isMyfxbookPriceLoading();
filteredAnalysts.forEach((a) => {
if (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object') {
const baseName = a.baseName || a.name;
const mapEntry = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (Array.isArray(mapEntry)) {
const rowPair = tf_normPairKey(a.pair || '');
if (!rowPair) {
return;
}
const match = mapEntry.some((p) => tf_normPairKey(p) === rowPair);
if (!match) {
return;
}
}
}
else if (Array.isArray(selectedPairs) && selectedPairs.length > 0) {
const apairs = Array.isArray(a.pairs) ? a.pairs : [];
const ok = apairs.length === 0 || apairs.some((p) => selectedPairs.includes(p));
if (!ok) {
return;
}
}
const baseName = a.baseName || a.name;
const rowPair = (a.pair || getPrimaryPairForAnalyst(a) || null);
const stats = computeSlStatsFromHistory(baseName, rowPair);
const effective = getEffectiveSlForAnalyst(baseName, rowPair, stats);
const slType = effective.type;
const effectiveSlPips = effective.pips || 0;
const primaryPair = getPrimaryPairForAnalyst(a);
const dollarPerPip = getDollarPerPipForAnalyst(a, rowPair || primaryPair);
const riskPercent = getRiskPercentForAnalyst(baseName, rowPair || primaryPair);
let rawLot = (effectiveSlPips > 0 && dollarPerPip > 0 && Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(currentBalance, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
let lot = roundLotToTwoDecimals(rawLot);
const tr = document.createElement('tr');
const nameCell = document.createElement('td');
nameCell.textContent = a.baseName || a.name;
nameCell.classList.add('monthly-sticky-col-2');
tr.appendChild(nameCell);
const pairCell = document.createElement('td');
pairCell.textContent = rowPair ? String(rowPair).toUpperCase() : '-';
tr.appendChild(pairCell);
const selectorCell = document.createElement('td');
const slSelect = document.createElement('select');
slSelect.className = 'form-input';
slSelect.style.padding = '2px 4px';
slSelect.classList.add('sltype-select');
slSelect.style.fontSize = '11px';
slSelect.style.maxWidth = '140px';
slSelect.style.width = '140px';
slSelect.style.overflow = 'hidden';
slSelect.style.textOverflow = 'ellipsis';
slSelect.title = 'SL Type';
const fixedOption = document.createElement('option');
fixedOption.value = 'fixed';
fixedOption.textContent = 'SL FIXED PIPS (Avg 6M)';
fixedOption.title = 'SL FIXED PIPS (Avg. 6 Months)';
if (!stats.fixed || stats.fixedCount < 5) {
fixedOption.disabled = true;
}
const avgOption = document.createElement('option');
avgOption.value = 'avg';
avgOption.textContent = 'Avg. SL PIPS';
if (!stats.avg) {
avgOption.disabled = true;
}
slSelect.appendChild(fixedOption);
slSelect.appendChild(avgOption);
if (slType && !slSelect.querySelector('option[value="' + slType + '"]')?.disabled) {
slSelect.value = slType;
}
else if (!fixedOption.disabled) {
slSelect.value = 'fixed';
}
else if (!avgOption.disabled) {
slSelect.value = 'avg';
}
else {
slSelect.value = '';
}
slSelect.addEventListener('change', () => {
const val = slSelect.value;
if (val === 'fixed' || val === 'avg') {
setSelectedSlTypeForAnalyst(baseName, rowPair || primaryPair, val);
}
else {
setSelectedSlTypeForAnalyst(baseName, rowPair || primaryPair, null);
}
renderSummaryTable();
});
selectorCell.appendChild(slSelect);
tr.appendChild(selectorCell);
const slFixedCell = document.createElement('td');
slFixedCell.className = 'text-right mono';
slFixedCell.style.color = '#ef4444';
if (stats.fixed && stats.fixedCount >= 5) {
const line1 = document.createElement('div');
line1.textContent = formatNumber(stats.fixed, 2);
const line2 = document.createElement('div');
line2.textContent = stats.fixedCount + 'x';
slFixedCell.innerHTML = '';
slFixedCell.appendChild(line1);
slFixedCell.appendChild(line2);
if (rawLot > 0) {
if (priceBusy) {
const line3 = document.createElement('div');
line3.style.fontSize = '11px';
line3.className = 'monthly-cell-line monthly-val-positive';
line3.innerHTML = tf_spinnerHTML(true);
slFixedCell.appendChild(line3);
}
else if (dollarPerPip > 0) {
const dollarFixed = stats.fixed * rawLot * dollarPerPip;
if (Number.isFinite(dollarFixed) && dollarFixed > 0) {
const line3 = document.createElement('div');
line3.style.fontSize = '11px';
line3.className = 'monthly-cell-line monthly-val-positive';
line3.textContent = formatMoney(dollarFixed);
slFixedCell.appendChild(line3);
}
}
}
}
else {
slFixedCell.textContent = '-';
}
tr.appendChild(slFixedCell);
const slAvgCell = document.createElement('td');
slAvgCell.className = 'text-right mono';
slAvgCell.style.color = '#ef4444';
if (stats.avg) {
const line1 = document.createElement('div');
line1.textContent = formatNumber(stats.avg, 2);
slAvgCell.innerHTML = '';
slAvgCell.appendChild(line1);
if (rawLot > 0) {
if (priceBusy) {
const line2 = document.createElement('div');
line2.style.fontSize = '11px';
line2.className = 'monthly-cell-line monthly-val-positive';
line2.innerHTML = tf_spinnerHTML(true);
slAvgCell.appendChild(line2);
}
else if (dollarPerPip > 0) {
const dollarAvg = stats.avg * rawLot * dollarPerPip;
if (Number.isFinite(dollarAvg) && dollarAvg > 0) {
const line2 = document.createElement('div');
line2.style.fontSize = '11px';
line2.className = 'monthly-cell-line monthly-val-positive';
line2.textContent = formatMoney(dollarAvg);
slAvgCell.appendChild(line2);
}
}
}
}
else {
slAvgCell.textContent = '-';
}
tr.appendChild(slAvgCell);
const lotCell = document.createElement('td');
lotCell.className = 'text-right mono';
lotCell.style.verticalAlign = 'middle';
if (priceBusy) {
lotCell.innerHTML = tf_spinnerHTML(true);
}
else if (lot > 0) {
const line1 = document.createElement('div');
line1.textContent = formatNumber(lot, 2);
lotCell.appendChild(line1);
if (rawLot > 0) {
const line2 = document.createElement('div');
line2.style.fontSize = '11px';
line2.style.opacity = '0.8';
line2.textContent = '( ' + formatNumber(rawLot, 5) + ' )';
lotCell.appendChild(line2);
}
}
else {
lotCell.textContent = '-';
}
const dollarCell = document.createElement('td');
dollarCell.className = 'text-right mono';
if (priceBusy) {
dollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
dollarCell.textContent = dollarPerPip > 0 ? formatNumber(dollarPerPip, 2) : '-';
}
tr.appendChild(dollarCell);
tr.appendChild(lotCell);
const balanceCell = document.createElement('td');
balanceCell.className = 'text-right mono';
balanceCell.textContent = formatMoney(currentBalance);
tr.appendChild(balanceCell);
const riskCell = document.createElement('td');
riskCell.className = 'text-right mono';
const riskInput = document.createElement('input');
riskInput.type = 'text';
riskInput.inputMode = 'decimal';
riskInput.maxLength = 5;
riskInput.className = 'form-input mono';
riskInput.style.padding = '2px 4px';
riskInput.style.textAlign = 'right';
riskInput.style.width = '48px';
const analystRisk = getRiskPercentForAnalyst(baseName, rowPair || primaryPair);
const actualRiskPercent = (Number.isFinite(currentBalance) && currentBalance > 0 &&
Number.isFinite(lot) && lot > 0 &&
Number.isFinite(effectiveSlPips) && effectiveSlPips > 0 &&
Number.isFinite(dollarPerPip) && dollarPerPip > 0)
? ((lot * effectiveSlPips * dollarPerPip) / currentBalance) * 100
: null;
riskInput.value = (actualRiskPercent != null && Number.isFinite(actualRiskPercent))
? Number(actualRiskPercent.toFixed(2)).toString()
: '';
riskInput.dataset.targetRisk = Number.isFinite(analystRisk) ? String(analystRisk) : '';
riskInput.title = (actualRiskPercent != null && Number.isFinite(actualRiskPercent))
? ('Actual Risk % berdasarkan Lot Size setelah pembulatan 0.01 lot. Target saat ini: ' + Number(analystRisk || 0).toFixed(2) + '%. Ubah angka jika ingin mengganti target Risk % untuk baris ini.')
: 'Actual Risk % belum dapat dihitung karena Lot / SL / $ per Pip belum tersedia.';
riskInput.addEventListener('change', () => {
const v = safeParseFloat(riskInput.value);
if (v === null || v < 0) {
setAnalystRiskOverride(baseName, rowPair || primaryPair, null);
}
else {
setAnalystRiskOverride(baseName, rowPair || primaryPair, v);
}
renderSummaryTable();
recomputeHistoryRows();
});
riskCell.appendChild(riskInput);
tr.appendChild(riskCell);
tbody.appendChild(tr);
});
updateMonthlyTableCells();
}
function tf_renderAnalystPerformanceTablesFromRows(rows) {
try {
window.__tf_perf_last_rows = rows;
}
catch (e) { }
const wrap = document.getElementById("tf-perf-wrap");
const leftBody = document.getElementById("tf-perf-body-left");
const rightBody = document.getElementById("tf-perf-body-right");
const overallBox = document.getElementById("tf-perf-overall");
const overallFill = document.getElementById("tf-perf-overall-fill");
const overallPctEl = document.getElementById("tf-perf-overall-pct");
const overallCountEl = document.getElementById("tf-perf-overall-count");
const overallWinEl = document.getElementById("tf-perf-overall-win");
const overallLossEl = document.getElementById("tf-perf-overall-loss");
const metricSel = document.getElementById('tf-perf-metric-select');
const perfRiskSel = document.getElementById('tf-perf-risk-mode-select');
const perfRiskGroup = document.getElementById('tf-perf-risk-group');
const perfCompSel = document.getElementById('tf-perf-compound-months-select');
const perfCompGroup = document.getElementById('tf-perf-compound-group');
if (!wrap || !leftBody || !rightBody)
return;
const PERF_USD_RISK_KEY = 'tf_perf_usd_risk_mode_v1';
const PERF_USD_MONTHS_KEY = 'tf_perf_usd_compound_months_v1';
const tf_perf_getUsdRiskMode = () => {
try {
const v = String(localStorage.getItem(PERF_USD_RISK_KEY) || 'fixed');
return (v === 'fixed' || v === 'compound') ? v : 'fixed';
}
catch (e) {
return 'fixed';
}
};
const tf_perf_setUsdRiskMode = (v) => {
const next = (v === 'compound') ? 'compound' : 'fixed';
try {
localStorage.setItem(PERF_USD_RISK_KEY, next);
}
catch (e) { }
try {
if (perfRiskSel)
perfRiskSel.value = next;
}
catch (e) { }
return next;
};
const tf_perf_getUsdCompoundMonths = () => {
try {
const v = parseInt(localStorage.getItem(PERF_USD_MONTHS_KEY) || '1', 10);
if (Number.isFinite(v) && v >= 1 && v <= 12)
return v;
}
catch (e) { }
return 1;
};
const tf_perf_setUsdCompoundMonths = (v) => {
const next = Math.max(1, Math.min(12, Math.floor(Number(v) || 1)));
try {
localStorage.setItem(PERF_USD_MONTHS_KEY, String(next));
}
catch (e) { }
try {
if (perfCompSel)
perfCompSel.value = String(next);
}
catch (e) { }
return next;
};
const tf_perf_syncGlobalRiskModeFromPerf = (desiredRisk, desiredMonths) => {
return false;
};
const METRIC_KEY = 'tf_perf_metric_v1';
const tf_perf_getMetric = () => {
try {
const v = (metricSel && metricSel.value) ? String(metricSel.value) : String(localStorage.getItem(METRIC_KEY) || 'tp_sl');
if (v === 'pips' || v === 'usd' || v === 'tp_sl')
return v;
}
catch (e) { }
return 'tp_sl';
};
const tf_perf_setMetric = (v) => {
const next = (v === 'pips' || v === 'usd' || v === 'tp_sl') ? v : 'tp_sl';
try {
localStorage.setItem(METRIC_KEY, next);
}
catch (e) { }
try {
if (metricSel)
metricSel.value = next;
}
catch (e) { }
};
try {
if (metricSel && !metricSel.dataset.tfBound) {
metricSel.dataset.tfBound = '1';
tf_perf_setMetric(String(localStorage.getItem(METRIC_KEY) || 'tp_sl'));
metricSel.addEventListener('change', () => {
const nextMetric = String(metricSel.value || 'tp_sl');
tf_perf_setMetric(nextMetric);
if (nextMetric === 'usd') {
const desiredRisk = tf_perf_setUsdRiskMode('fixed');
const desiredMonths = tf_perf_setUsdCompoundMonths(tf_perf_getUsdCompoundMonths());
const did = tf_perf_syncGlobalRiskModeFromPerf(desiredRisk, desiredMonths);
if (did)
return;
}
try {
const last = (window.__tf_perf_last_rows && Array.isArray(window.__tf_perf_last_rows)) ? window.__tf_perf_last_rows : rows;
tf_renderAnalystPerformanceTablesFromRows(last);
}
catch (e) { }
});
}
else if (metricSel) {
tf_perf_setMetric(String(localStorage.getItem(METRIC_KEY) || tf_perf_getMetric()));
}
}
catch (e) { }
try {
if (perfRiskSel && !perfRiskSel.dataset.tfBound) {
perfRiskSel.dataset.tfBound = '1';
perfRiskSel.addEventListener('change', () => {
const desiredRisk = tf_perf_setUsdRiskMode(String(perfRiskSel.value || 'fixed'));
const desiredMonths = tf_perf_setUsdCompoundMonths(tf_perf_getUsdCompoundMonths());
try {
if (perfCompGroup)
perfCompGroup.style.setProperty('display', (tf_perf_getMetric() === 'usd' && desiredRisk === 'compound') ? 'grid' : 'none', 'important');
}
catch (e) { }
try {
const last = (window.__tf_perf_last_rows && Array.isArray(window.__tf_perf_last_rows)) ? window.__tf_perf_last_rows : rows;
tf_renderAnalystPerformanceTablesFromRows(last);
}
catch (e) { }
});
}
}
catch (e) { }
try {
if (perfCompSel && !perfCompSel.dataset.tfBound) {
perfCompSel.dataset.tfBound = '1';
perfCompSel.addEventListener('change', () => {
tf_perf_setUsdCompoundMonths(perfCompSel.value);
const desiredRisk = tf_perf_getUsdRiskMode();
if (desiredRisk === 'compound') {
try {
const last = (window.__tf_perf_last_rows && Array.isArray(window.__tf_perf_last_rows)) ? window.__tf_perf_last_rows : rows;
tf_renderAnalystPerformanceTablesFromRows(last);
}
catch (e) { }
}
});
}
}
catch (e) { }
const perfMetric = tf_perf_getMetric();
try {
const showUsdControls = (perfMetric === 'usd');
if (perfRiskGroup)
perfRiskGroup.style.setProperty('display', showUsdControls ? 'grid' : 'none', 'important');
if (!showUsdControls) {
if (perfCompGroup)
perfCompGroup.style.setProperty('display', 'none', 'important');
}
else {
const desiredRisk = tf_perf_getUsdRiskMode();
const desiredMonths = tf_perf_getUsdCompoundMonths();
try {
tf_perf_setUsdRiskMode(desiredRisk);
}
catch (e) { }
try {
tf_perf_setUsdCompoundMonths(desiredMonths);
}
catch (e) { }
try {
const did = tf_perf_syncGlobalRiskModeFromPerf(desiredRisk, desiredMonths);
if (did)
return;
}
catch (e) { }
try {
if (perfCompSel && perfCompSel.options && perfCompSel.options.length === 0) {
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = (i === 1) ? '1 month' : String(i) + ' month';
perfCompSel.appendChild(opt);
}
}
}
catch (e) { }
if (perfCompGroup)
perfCompGroup.style.setProperty('display', (tf_perf_getMetric() === 'usd' && desiredRisk === 'compound') ? 'grid' : 'none', 'important');
}
}
catch (e) { }
const tf_perf_trim0 = (s) => {
const str = String(s || '');
return str
.replace(/(\.[0-9]*?[1-9])0+$/g, '$1')
.replace(/\.0+$/g, '')
.replace(/\.$/g, '');
};
const tf_perf_formatCompact = (num) => {
const n0 = Number(num);
if (!Number.isFinite(n0))
return '0';
const n = Math.abs(n0);
const units = [
{ v: 1e9, s: 'B' },
{ v: 1e6, s: 'M' },
{ v: 1e3, s: 'K' },
];
for (let i = 0; i < units.length; i++) {
const u = units[i];
if (n >= u.v) {
const x = n / u.v;
const dec = x < 100 ? 1 : 0;
const out = tf_perf_trim0(x.toFixed(dec));
return out + u.s;
}
}
try {
if (typeof formatNumber === 'function')
return tf_perf_trim0(formatNumber(n, 0));
}
catch (e) { }
return String(Math.round(n));
};
const tf_perf_formatPipsCompact = (num) => {
const n0 = Number(num);
if (!Number.isFinite(n0))
return '0';
const n = Math.abs(n0);
const units = [
{ v: 1e6, s: 'm' },
{ v: 1e3, s: 'k' },
];
for (let i = 0; i < units.length; i++) {
const u = units[i];
if (n >= u.v) {
const x = n / u.v;
const dec = x < 100 ? 1 : 0;
const out = tf_perf_trim0(x.toFixed(dec));
return out + u.s;
}
}
try {
if (typeof formatNumber === 'function')
return tf_perf_trim0(formatNumber(n, 1));
}
catch (e) { }
return tf_perf_trim0(n.toFixed(1));
};
const tf_perf_formatValue = (val) => {
const n = Number(val);
if (!Number.isFinite(n))
return '0';
if (perfMetric === 'tp_sl')
return String(Math.round(n));
if (perfMetric === 'usd')
return tf_perf_formatCompact(n);
return tf_perf_formatPipsCompact(n);
};
const tf_perf_formatSignedNet = (val) => {
const n = Number(val);
if (!Number.isFinite(n))
return '0';
if (perfMetric === 'tp_sl')
return String(Math.round(n));
const sign = n < 0 ? '-' : '';
const abs = Math.abs(n);
if (perfMetric === 'usd')
return sign + tf_perf_formatCompact(abs);
return sign + tf_perf_formatPipsCompact(abs);
};
const tf_perf_formatPctSigned = (pctVal) => {
const n = Number(pctVal);
if (!Number.isFinite(n))
return '0%';
return tf_perf_trim0(n.toFixed(1)) + '%';
};
const byAnalyst = new Map();
const TF_PERF_UNKNOWN = '__UNKNOWN__';
const tf_perf_keyOfAnalyst = (r) => {
try {
const raw = (r && r.analyst != null) ? String(r.analyst).trim() : '';
const low = raw.toLowerCase();
if (!raw || low === 'undefined' || low === 'null')
return TF_PERF_UNKNOWN;
return raw;
}
catch (e) {
return TF_PERF_UNKNOWN;
}
};
const tf_perf_add = (key, tpAdd, slAdd) => {
const cur = byAnalyst.get(key) || { tp: 0, sl: 0, total: 0 };
if (Number.isFinite(tpAdd) && tpAdd > 0)
cur.tp += tpAdd;
if (Number.isFinite(slAdd) && slAdd > 0)
cur.sl += slAdd;
cur.total = (cur.tp || 0) + (cur.sl || 0);
byAnalyst.set(key, cur);
};
const tf_perf_calcKey = (row) => {
const sk = row && row.sortKey;
if (typeof sk === 'number' && isFinite(sk))
return sk;
const ck = row && row.createdSortKey;
if (typeof ck === 'number' && isFinite(ck))
return ck;
return 0;
};
const tf_perf_getPips = (r) => {
const p = Number.isFinite(r && r.pnlPips) ? Number(r.pnlPips) : Number(r && (r.pnlPips != null ? r.pnlPips : r.pips));
return Number.isFinite(p) ? p : 0;
};
const tf_perf_getDollarPerPip = (pair, r) => {
const dpp = Number.isFinite(r && r.dollarPerPip) ? Number(r.dollarPerPip) : Number(getDollarPerPipForAnalyst(null, pair));
return Number.isFinite(dpp) ? Math.abs(dpp) : 0;
};
const tf_perf_getRiskPercent = (analyst, pair, r) => {
const rp = Number.isFinite(r && r.riskPercent) ? Number(r.riskPercent) : Number(getRiskPercentForAnalyst(analyst, pair));
return Number.isFinite(rp) ? Math.max(0, rp) : 0;
};
const _perfSlPipsCache = new Map();
const tf_perf_getEffectiveSlPips = (analyst, pair) => {
const k = String(analyst || '') + '|' + String(pair || '');
if (_perfSlPipsCache.has(k))
return _perfSlPipsCache.get(k) || 0;
let sl = 0;
try {
const slStats = (typeof computeSlStatsFromHistory === 'function') ? computeSlStatsFromHistory(analyst, pair) : null;
const eff = (typeof getEffectiveSlForAnalyst === 'function') ? getEffectiveSlForAnalyst(analyst, pair, slStats) : null;
if (eff && Number.isFinite(eff.pips))
sl = eff.pips;
}
catch (e) { }
if (!Number.isFinite(sl) || sl <= 0)
sl = 0;
_perfSlPipsCache.set(k, sl);
return sl;
};
const _perfFixedLotCache = new Map();
const tf_perf_getLotFixed = (analyst, pair, dollarPerPip, riskPercent, startingBalance) => {
const k = String(analyst || '') + '|' + String(pair || '');
if (_perfFixedLotCache.has(k))
return _perfFixedLotCache.get(k) || 0;
let lot = 0;
try {
const slPips = tf_perf_getEffectiveSlPips(analyst, pair);
if (slPips > 0 && dollarPerPip > 0 && Number.isFinite(startingBalance) && startingBalance > 0) {
lot = computeLot(startingBalance, riskPercent, slPips, dollarPerPip);
if (!Number.isFinite(lot) || lot <= 0)
lot = 0;
else
lot = roundLotToTwoDecimals(lot);
}
}
catch (e) { }
_perfFixedLotCache.set(k, lot);
return lot;
};
try {
const inputRows = Array.isArray(rows) ? rows : [];
const trades = inputRows
.filter((r) => r && !r.isWithdraw && String(r.analyst || '').toLowerCase() !== 'withdraw');
// REV223: a real trade with a numeric result of exactly 0 is still data.
// Seed the analyst map before metric aggregation so a zero-only month keeps
// its Performance/Probability rows visible instead of being treated as empty.
trades.forEach((r) => {
const key = tf_perf_keyOfAnalyst(r);
if (!byAnalyst.has(key))
byAnalyst.set(key, { tp: 0, sl: 0, total: 0 });
});
if (perfMetric === 'usd') {
const perfUsdRisk = tf_perf_getUsdRiskMode();
const perfUsdMonths = tf_perf_getUsdCompoundMonths();
const startingBalance = Number.isFinite(currentBalance) ? currentBalance : 0;
if (perfUsdRisk !== 'compound') {
trades.forEach((r) => {
const analyst = r.analyst || '';
const pair = r.pair || '';
const pips = tf_perf_getPips(r);
if (!Number.isFinite(pips) || pips === 0)
return;
const dpp = tf_perf_getDollarPerPip(pair, r);
if (!(dpp > 0))
return;
const rp = tf_perf_getRiskPercent(analyst, pair, r);
const lot = tf_perf_getLotFixed(analyst, pair, dpp, rp, startingBalance);
if (!(lot > 0))
return;
const pnlDollar = pips * lot * dpp;
if (!Number.isFinite(pnlDollar) || pnlDollar === 0)
return;
const key = tf_perf_keyOfAnalyst(r);
if (pnlDollar > 0)
tf_perf_add(key, pnlDollar, 0);
else
tf_perf_add(key, 0, Math.abs(pnlDollar));
});
}
else {
const sorted = trades.slice().sort((a, b) => tf_perf_calcKey(a) - tf_perf_calcKey(b));
const monthSeen = new Set();
const monthKeys = [];
const tradesByMonth = Object.create(null);
let minIdx = null;
let maxIdx = null;
for (let i = 0; i < sorted.length; i++) {
const r = sorted[i];
const k = tf_perf_calcKey(r);
const mk = (typeof tf_monthKeyFromSortKey === 'function') ? tf_monthKeyFromSortKey(k) : null;
if (!mk)
continue;
if (!monthSeen.has(mk)) {
monthSeen.add(mk);
monthKeys.push(mk);
}
if (!tradesByMonth[mk])
tradesByMonth[mk] = [];
tradesByMonth[mk].push(r);
const mi = (typeof tf_sortKeyToMonthIndex === 'function') ? tf_sortKeyToMonthIndex(k) : null;
if (mi != null) {
if (minIdx == null || mi < minIdx)
minIdx = mi;
if (maxIdx == null || mi > maxIdx)
maxIdx = mi;
}
}
const tf_perf_monthKeyFromIndex = (idx) => {
const y = Math.floor(idx / 12);
const m = (idx % 12) + 1;
return String(y) + '-' + String(m).padStart(2, '0');
};
const fullMonthKeys = (minIdx == null || maxIdx == null) ? monthKeys.slice() : (function () {
const out = [];
for (let mi = minIdx; mi <= maxIdx; mi++)
out.push(tf_perf_monthKeyFromIndex(mi));
return out;
})();
const periodMonths = Math.max(1, Math.min(12, Math.floor(Number(perfUsdMonths) || 1)));
const monthToPeriodStart = Object.create(null);
for (let i = 0; i < fullMonthKeys.length; i++) {
const mk = fullMonthKeys[i];
const startIndex = Math.floor(i / periodMonths) * periodMonths;
monthToPeriodStart[mk] = fullMonthKeys[startIndex] || mk;
}
let runningEquity = startingBalance;
let currentPeriodStart = null;
let sizingBase = startingBalance;
const lotCache = new Map();
const firstMonth = fullMonthKeys.length ? fullMonthKeys[0] : null;
for (let mi = 0; mi < fullMonthKeys.length; mi++) {
const monthKey = fullMonthKeys[mi];
const periodStartKey = monthToPeriodStart[monthKey] || monthKey;
if (currentPeriodStart !== periodStartKey) {
currentPeriodStart = periodStartKey;
sizingBase = (monthKey === firstMonth) ? startingBalance : runningEquity;
try {
lotCache.clear();
}
catch (e) { }
}
const monthTrades = tradesByMonth[monthKey] || [];
for (let j = 0; j < monthTrades.length; j++) {
const r = monthTrades[j];
const analyst = r.analyst || '';
const pair = r.pair || '';
const pips = tf_perf_getPips(r);
if (!Number.isFinite(pips) || pips === 0)
continue;
const dpp = tf_perf_getDollarPerPip(pair, r);
if (!(dpp > 0))
continue;
const rp = tf_perf_getRiskPercent(analyst, pair, r);
const baseBal = Math.max(0, Number(sizingBase) || 0);
const cacheKey = `${periodStartKey}|${analyst}|${pair}|B${Math.round(baseBal * 100)}`;
let lot = lotCache.get(cacheKey);
if (!Number.isFinite(lot)) {
lot = 0;
const slPips = tf_perf_getEffectiveSlPips(analyst, pair);
if (slPips > 0 && rp >= 0 && baseBal > 0) {
lot = computeLot(baseBal, rp, slPips, dpp);
if (!Number.isFinite(lot) || lot <= 0)
lot = 0;
else
lot = roundLotToTwoDecimals(lot);
}
lotCache.set(cacheKey, lot);
}
if (!(lot > 0))
continue;
const pnlDollar = pips * lot * dpp;
if (!Number.isFinite(pnlDollar) || pnlDollar === 0)
continue;
const key = tf_perf_keyOfAnalyst(r);
if (pnlDollar > 0)
tf_perf_add(key, pnlDollar, 0);
else
tf_perf_add(key, 0, Math.abs(pnlDollar));
runningEquity += pnlDollar;
}
}
}
}
else {
trades.forEach((r) => {
const p = tf_perf_getPips(r);
if (!Number.isFinite(p) || p === 0)
return;
const key = tf_perf_keyOfAnalyst(r);
if (perfMetric === 'pips') {
if (p > 0)
tf_perf_add(key, p, 0);
else
tf_perf_add(key, 0, Math.abs(p));
}
else {
if (p > 0)
tf_perf_add(key, 1, 0);
else
tf_perf_add(key, 0, 1);
}
});
}
}
catch (e) { }
const names = Array.from(byAnalyst.keys())
.filter(Boolean)
.sort((a, b) => {
const aa = String(a);
const bb = String(b);
if (aa === TF_PERF_UNKNOWN && bb !== TF_PERF_UNKNOWN)
return 1;
if (bb === TF_PERF_UNKNOWN && aa !== TF_PERF_UNKNOWN)
return -1;
return aa.localeCompare(bb, undefined, { sensitivity: 'base' });
});
if (!names.length) {
try {
wrap.style.display = "none";
}
catch (e) { }
try {
leftBody.innerHTML = "";
rightBody.innerHTML = "";
}
catch (e) { }
try {
if (overallBox)
overallBox.style.display = "none";
}
catch (e) { }
return;
}
try {
wrap.style.display = "flex";
}
catch (e) { }
const SEL_KEY = "tf_perf_selected_analysts_v1";
let sel = {};
try {
sel = JSON.parse(localStorage.getItem(SEL_KEY) || "{}");
}
catch (e) {
sel = {};
}
if (!sel || typeof sel !== "object")
sel = {};
const isChecked = (name) => (sel[String(name)] !== false);
const persistSel = () => {
try {
localStorage.setItem(SEL_KEY, JSON.stringify(sel));
}
catch (e) { }
};
const computeOverall = () => {
let totalTP = 0;
let totalSL = 0;
try {
names.forEach((n) => {
if (!isChecked(n))
return;
const v = byAnalyst.get(n);
if (!v)
return;
totalTP += (v.tp || 0);
totalSL += (v.sl || 0);
});
}
catch (e) { }
const totalAll = totalTP + totalSL;
const winrate = (totalAll > 0) ? (totalTP / totalAll) * 100 : 0;
const isNegative = (totalAll > 0) && (totalSL > totalTP);
return { totalTP, totalSL, totalAll, winrate, isNegative };
};
const renderOverall = () => {
if (!overallBox || !overallFill || !overallPctEl)
return;
const { winrate, totalTP, totalSL, isNegative } = computeOverall();
const pctOverall = Math.max(0, Math.min(100, Number.isFinite(winrate) ? winrate : 0));
const pctLabelNeg = !!isNegative && pctOverall > 0;
const fillNeg = !!isNegative && pctOverall > 0;
try {
overallBox.style.display = "block";
}
catch (e) { }
try {
overallFill.style.width = pctOverall <= 0 ? "2px" : (pctOverall.toFixed(0) + "%");
overallFill.style.background = pctOverall <= 0 ? "rgba(148,163,184,0.72)" : (fillNeg ? "var(--danger, #f97373)" : "var(--accent, #3c8dbc)");
overallFill.style.minWidth = pctOverall <= 0 ? "2px" : "0";
}
catch (e) { }
try {
const track = overallBox.querySelector(".tf-perf-bar-track");
if (track) {
let mid = track.querySelector(".tf-perf-bar-mid");
if (!mid) {
mid = document.createElement("div");
mid.className = "tf-perf-bar-mid mono";
track.appendChild(mid);
}
const net = (totalTP || 0) - (totalSL || 0);
if (perfMetric === 'usd') {
const base = (Number.isFinite(currentBalance) ? Number(currentBalance) : 0);
const pctNet = (base > 0) ? (net / base) * 100 : 0;
mid.textContent = 'PnL ' + tf_perf_formatSignedNet(net) + ' (' + tf_perf_formatPctSigned(pctNet) + ')';
mid.classList.toggle('tf-perf-neg', pctNet < 0);
}
else {
mid.textContent = tf_perf_formatSignedNet(net);
mid.classList.remove('tf-perf-neg');
}
}
}
catch (e) { }
try {
if (overallCountEl && (overallWinEl || overallLossEl)) {
if (overallWinEl)
overallWinEl.textContent = tf_perf_formatValue(totalTP || 0);
if (overallLossEl) {
overallLossEl.textContent = tf_perf_formatValue(totalSL || 0);
overallLossEl.classList.toggle("tf-perf-loss-red", (Number(totalSL) || 0) > 0);
}
}
}
catch (e) { }
try {
overallPctEl.textContent = (pctLabelNeg ? '-' : '') + pctOverall.toFixed(0) + '%';
overallPctEl.classList.toggle('tf-perf-neg', !!pctLabelNeg);
}
catch (e) { }
};
renderOverall();
const items = names.map((name) => {
const v = byAnalyst.get(name) || { tp: 0, sl: 0, total: 0 };
const winrate = (v.total > 0) ? (v.tp / v.total) * 100 : 0;
const isUnknown = String(name) === TF_PERF_UNKNOWN;
return {
name,
display: isUnknown
? '(Unknown)'
: ((typeof formatAnalystDisplayName === "function") ? formatAnalystDisplayName(name) : name),
tp: (v.tp || 0),
sl: (v.sl || 0),
winrate,
isNegative: (v.total > 0) && ((v.sl || 0) > (v.tp || 0))
};
});
const half = Math.ceil(items.length / 2);
const left = items.slice(0, half);
const right = items.slice(half);
const renderSide = (tbody, list) => {
try {
tbody.innerHTML = "";
}
catch (e) { }
list.forEach((it) => {
const tr = document.createElement("tr");
tr.className = "tf-perf-row";
tr.dataset.analyst = it.name;
const checked = isChecked(it.name);
if (!checked)
tr.classList.add("tf-perf-row-off");
const tdName = document.createElement("td");
tdName.className = "tf-perf-name";
const label = document.createElement("label");
label.className = "tf-perf-analyst-label";
const cb = document.createElement("input");
cb.type = "checkbox";
cb.className = "tf-perf-ck";
cb.checked = !!checked;
const nameSpan = document.createElement("span");
nameSpan.className = "tf-perf-name-text";
nameSpan.textContent = it.display || it.name || "";
nameSpan.title = String(it.name || "").trim();
cb.addEventListener("change", () => {
sel[String(it.name)] = cb.checked;
persistSel();
tr.classList.toggle("tf-perf-row-off", !cb.checked);
renderOverall();
});
label.appendChild(cb);
label.appendChild(nameSpan);
tdName.appendChild(label);
const tdBar = document.createElement("td");
tdBar.className = "tf-perf-bar-cell";
const barWrap = document.createElement("div");
barWrap.className = "tf-perf-bar-wrap";
const count = document.createElement("div");
count.className = "tf-perf-count mono";
const winSpan = document.createElement("span");
winSpan.className = "tf-perf-win";
winSpan.textContent = tf_perf_formatValue(it.tp || 0);
const sep = document.createTextNode("/");
const lossSpan = document.createElement("span");
lossSpan.className = "tf-perf-loss";
lossSpan.textContent = tf_perf_formatValue(it.sl || 0);
if ((Number(it.sl) || 0) > 0)
lossSpan.classList.add("tf-perf-loss-red");
count.appendChild(winSpan);
count.appendChild(sep);
count.appendChild(lossSpan);
const track = document.createElement("div");
track.className = "tf-perf-bar-track";
const fill = document.createElement("div");
fill.className = "tf-perf-bar-fill";
const pct = Math.max(0, Math.min(100, Number.isFinite(it.winrate) ? it.winrate : 0));
fill.style.width = pct <= 0 ? "2px" : (pct.toFixed(0) + "%");
const __neg = !!it.isNegative && pct > 0;
try {
fill.style.background = pct <= 0 ? "rgba(148,163,184,0.72)" : (__neg ? "var(--danger, #f97373)" : "var(--accent, #3c8dbc)");
fill.style.minWidth = pct <= 0 ? "2px" : "0";
}
catch (e) { }
track.appendChild(fill);
const mid = document.createElement("div");
mid.className = "tf-perf-bar-mid mono";
const net = (it.tp || 0) - (it.sl || 0);
if (perfMetric === 'usd') {
const base = (Number.isFinite(currentBalance) ? Number(currentBalance) : 0);
const pctNet = (base > 0) ? (net / base) * 100 : 0;
mid.textContent = 'PnL ' + tf_perf_formatSignedNet(net) + ' (' + tf_perf_formatPctSigned(pctNet) + ')';
mid.classList.toggle('tf-perf-neg', pctNet < 0);
}
else {
mid.textContent = tf_perf_formatSignedNet(net);
mid.classList.remove('tf-perf-neg');
}
track.appendChild(mid);
barWrap.appendChild(count);
barWrap.appendChild(track);
tdBar.appendChild(barWrap);
const tdPct = document.createElement("td");
tdPct.className = "tf-perf-pct mono";
tdPct.textContent = (__neg ? "-" : "") + pct.toFixed(0) + "%";
tdPct.classList.toggle('tf-perf-neg', __neg);
tr.appendChild(tdName);
tr.appendChild(tdBar);
tr.appendChild(tdPct);
tbody.appendChild(tr);
});
};
renderSide(leftBody, left);
renderSide(rightBody, right);
}
const TF_MONTHLY_COL_WIDTHS = {
action: 90,
analyst: 160,
pair: 110,
month: 120,
};
function tf_applyMonthlyTableLayout(monthCount) {
const section = document.getElementById('section-monthly');
const table = document.getElementById('monthly-table');
if (!table)
return;
const safeCount = Number.isFinite(monthCount) ? Math.max(0, Math.floor(monthCount)) : 0;
const requiredWidth = TF_MONTHLY_COL_WIDTHS.action +
TF_MONTHLY_COL_WIDTHS.analyst +
TF_MONTHLY_COL_WIDTHS.pair +
(TF_MONTHLY_COL_WIDTHS.month * safeCount);
const scrollEl = table.closest('.table-scroll.monthly-table-scroll') || table.closest('.table-scroll');
const containerW = scrollEl ? (scrollEl.clientWidth || 0) : 0;
const shouldFit = containerW > 0 && requiredWidth < (containerW - 6);
if (shouldFit) {
table.classList.add('monthly-fit');
table.style.minWidth = '100%';
table.style.width = '100%';
table.style.maxWidth = '100%';
}
else {
table.classList.remove('monthly-fit');
table.style.minWidth = `${requiredWidth}px`;
table.style.width = 'max-content';
table.style.maxWidth = 'none';
}
if (section) {
section.style.setProperty('--mcol-action', `${TF_MONTHLY_COL_WIDTHS.action}px`);
section.style.setProperty('--mcol-analyst', `${TF_MONTHLY_COL_WIDTHS.analyst}px`);
section.style.setProperty('--mcol-pair', `${TF_MONTHLY_COL_WIDTHS.pair}px`);
}
}
function buildMonthlyTableSkeleton() {
const tbody = document.getElementById('monthly-body');
if (!tbody)
return;
const monthKeys = tf_getMonthlyVisibleMonthKeys();
const theadRow = document.querySelector('#monthly-table thead tr');
if (theadRow) {
while (theadRow.children.length > 3) {
theadRow.removeChild(theadRow.lastChild);
}
if (theadRow.children.length === 2) {
const thPair = document.createElement('th');
thPair.textContent = 'Pair';
theadRow.appendChild(thPair);
}
else if (theadRow.children.length === 1) {
const thName = document.createElement('th');
thName.textContent = 'Nama Analis';
theadRow.appendChild(thName);
const thPair = document.createElement('th');
thPair.textContent = 'Pair';
theadRow.appendChild(thPair);
}
else if (theadRow.children.length === 0) {
const thAction = document.createElement('th');
thAction.textContent = 'Action';
theadRow.appendChild(thAction);
const thName = document.createElement('th');
thName.textContent = 'Nama Analis';
theadRow.appendChild(thName);
const thPair = document.createElement('th');
thPair.textContent = 'Pair';
theadRow.appendChild(thPair);
}
if (theadRow.children.length >= 3) {
theadRow.children[2].textContent = 'Pair';
}
if (theadRow.children[0]) {
theadRow.children[0].classList.add('monthly-sticky-col-1');
}
if (theadRow.children[1]) {
theadRow.children[1].classList.add('monthly-sticky-col-2');
}
if (theadRow.children[2]) {
theadRow.children[2].classList.add('monthly-sticky-col-3');
}
monthKeys.forEach((monthKey) => {
const th = document.createElement('th');
th.textContent = formatMonthKeyToLabel(monthKey);
th.setAttribute('data-month-key', monthKey);
theadRow.appendChild(th);
});
}
tbody.innerHTML = '';
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
if (!pairUpper)
return true;
return Array.isArray(allowedPairs)
? allowedPairs.map((p) => String(p).toUpperCase()).includes(pairUpper)
: true;
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
if (!Array.isArray(filteredAnalysts) || filteredAnalysts.length === 0 || !monthKeys.length) {
return;
}
filteredAnalysts.forEach((a) => {
const tr = document.createElement('tr');
const actionCell = document.createElement('td');
actionCell.classList.add('monthly-sticky-col-1');
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'btn btn-xs';
btn.textContent = 'Refresh';
btn.title = 'Reload data analis ini dari website (Statistics + History)';
btn.addEventListener('click', () => {
const baseName = a.baseName || a.name;
const pair = a.pair || (Array.isArray(a.pairs) && a.pairs.length ? a.pairs[0] : null);
refreshAnalystFromDashboard(baseName, pair, btn);
});
actionCell.appendChild(btn);
tr.appendChild(actionCell);
const nameCell = document.createElement('td');
nameCell.textContent = formatAnalystDisplayName(a.baseName || a.name);
nameCell.title = String(a.baseName || a.name || '').trim();
nameCell.classList.add('monthly-sticky-col-2');
tr.appendChild(nameCell);
const pairCell = document.createElement('td');
const pairText = (Array.isArray(a.pairs) && a.pairs.length)
? a.pairs.join(', ')
: (a.pair || '');
pairCell.textContent = pairText;
pairCell.classList.add('monthly-sticky-col-3');
tr.appendChild(pairCell);
monthKeys.forEach((monthKey) => {
const td = document.createElement('td');
td.setAttribute('contenteditable', 'true');
td.setAttribute('data-analyst', a.name);
td.setAttribute('data-month-key', monthKey);
td.style.whiteSpace = 'pre-line';
tr.appendChild(td);
});
tbody.appendChild(tr);
});
tf_applyMonthlyTableLayout(monthKeys.length);
try {
__tfMonthlyMonthKeysSig = (monthKeys || []).join('|');
}
catch (e) { }
const monthlyTable = document.getElementById('monthly-table');
if (monthlyTable) {
const scrollContainer = monthlyTable.closest('.table-scroll');
if (scrollContainer && scrollContainer.scrollWidth > scrollContainer.clientWidth) {
scrollContainer.scrollLeft = scrollContainer.scrollWidth;
}
}
}
function refreshAnalystFromDashboard(analystName, pair, buttonEl) {
const hasChromeAPI = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
if (!hasChromeAPI) {
console.warn('Chrome runtime API tidak tersedia – tombol refresh hanya berfungsi di extension.');
return;
}
if (buttonEl) {
buttonEl.disabled = true;
buttonEl.textContent = 'Refreshing...';
}
const msg = { type: 'scanSingleAnalyst', analystName };
if (pair)
msg.pair = pair;
chrome.runtime.sendMessage(msg, (response) => {
if (buttonEl) {
buttonEl.disabled = false;
buttonEl.textContent = 'Refresh';
}
if (chrome.runtime.lastError) {
console.error('scanSingleAnalyst error:', chrome.runtime.lastError.message);
return;
}
if (!response || !response.ok) {
console.error('scanSingleAnalyst gagal:', response && response.error);
return;
}
loadFromChromeStorageIfAvailable();
});
}
function updateMonthlyTableCells() {
const tbody = document.getElementById('monthly-body');
if (!tbody)
return;
const stats = monthlyStatsByAnalyst || {};
const monthKeys = tf_getMonthlyVisibleMonthKeys();
const priceBusy = tf_isMyfxbookPriceLoading();
const monthEndBalanceMap = (riskMode === 'compound')
? tf_buildMonthEndBalanceMapFromHistoryRows(lastHistoryRows)
: null;
let tf_monthlyCompoundFallback = Number.isFinite(currentBalance) ? currentBalance : 0;
try {
if (riskMode === 'compound' && Array.isArray(lastHistoryRows) && lastHistoryRows.length) {
const first = lastHistoryRows[0];
if (first && Number.isFinite(first.balanceCompound)) {
tf_monthlyCompoundFallback = first.balanceCompound;
}
}
}
catch (e) { }
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0 || !monthKeys.length) {
const cells = tbody.querySelectorAll('td[data-analyst]');
cells.forEach((cell) => {
cell.textContent = '-';
});
renderMonthlyTotals();
return;
}
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
filteredAnalysts.forEach((a) => {
const analystName = a.baseName || a.name;
const statsKey = a.name;
const hasPair = !!(a.pair);
const aStats = stats[statsKey] || (!hasPair && analystName ? stats[analystName] : null) || {};
const effective = getEffectiveSlForAnalyst(analystName, a.pair || null);
const effectiveSlPips = effective.pips || 0;
const dollarPerPip = getDollarPerPipForAnalyst(a);
const riskPercent = getRiskPercentForAnalyst(analystName, a.pair || getPrimaryPairForAnalyst(a));
const baseBalFixedForIncome = (Number.isFinite(currentBalance) ? currentBalance : 0);
let lotFixedIncome = (effectiveSlPips > 0 && dollarPerPip > 0 && Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(baseBalFixedForIncome, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
lotFixedIncome = roundLotToTwoDecimals(lotFixedIncome);
monthKeys.forEach((monthKey) => {
const selector = 'td[data-analyst="' + a.name + '"][data-month-key="' + monthKey + '"]';
const cell = document.querySelector(selector);
if (!cell)
return;
const s = aStats[monthKey] || {};
const pips = typeof s.pips === 'number' ? s.pips : null;
const signals = typeof s.signals === 'number' ? s.signals : null;
if (pips == null && signals == null) {
cell.textContent = '-';
return;
}
const lineElements = [];
if (pips != null) {
const span = document.createElement('span');
span.className = 'monthly-cell-line';
if (pips > 0) {
span.classList.add('monthly-val-positive');
}
else if (pips < 0) {
span.classList.add('monthly-val-negative');
}
span.textContent = formatNumber(pips, 1) + ' Pips';
lineElements.push(span);
}
if (signals != null) {
const span = document.createElement('span');
span.className = 'monthly-cell-line';
span.textContent = signals + ' Signals';
lineElements.push(span);
}
if (pips != null && effectiveSlPips > 0 && dollarPerPip > 0) {
const baseBal = (riskMode === 'compound')
? tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBalanceMap, tf_monthlyCompoundFallback)
: (Number.isFinite(currentBalance) ? currentBalance : 0);
let lot = (Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(baseBal, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
lot = roundLotToTwoDecimals(lot);
const grossDollars = pips * lot * dollarPerPip;
const activeCostRate = (swapEnabled ? Math.max(0, Number(swapRatePerLot) || 0) : 0)
+ (commissionEnabled ? Math.max(0, Number(commissionRatePerLot) || 0) : 0);
const costDollars = (signals != null && signals > 0) ? (signals * lot * activeCostRate) : 0;
const dollars = tf_roundTradeCostMoney(grossDollars - costDollars);
const span = document.createElement('span');
span.className = 'monthly-cell-line';
if (dollars > 0) {
span.classList.add('monthly-val-positive');
}
else if (dollars < 0) {
span.classList.add('monthly-val-negative');
}
if (priceBusy && ((signals != null && signals > 0) || (pips != null && pips !== 0))) {
span.innerHTML = tf_spinnerHTML(true);
}
else {
span.textContent = formatMoney(dollars);
}
lineElements.push(span);
}
cell.innerHTML = '';
lineElements.forEach((el) => cell.appendChild(el));
});
});
renderMonthlyTotals();
}
function renderMonthlyTotals() {
const priceBusy = tf_isMyfxbookPriceLoading();
const tbody = document.getElementById('monthly-body');
const incomeMinEl = document.getElementById('income-min');
const incomeMaxEl = document.getElementById('income-max');
const incomeRangeTextEl = document.getElementById('income-minmax-range-text');
const tf_setIncomeMinMaxUI = (minText, maxText, rangeText) => {
try {
if (incomeMinEl)
incomeMinEl.innerHTML = minText;
if (incomeMaxEl)
incomeMaxEl.innerHTML = maxText;
if (incomeRangeTextEl)
incomeRangeTextEl.textContent = rangeText || 'min-max income from January 2024 s.d -';
}
catch (e) { }
};
if (!tbody) {
tf_setIncomeMinMaxUI('-', '-', 'min-max income from January 2024 s.d -');
return;
}
const oldTotalRows = Array.from(tbody.querySelectorAll('tr.monthly-total-row'));
oldTotalRows.forEach((tr) => tr.remove());
const stats = monthlyStatsByAnalyst || {};
const monthKeys = tf_getMonthlyVisibleMonthKeys();
const firstMonthInCurrentRangeTotals = (monthKeys && monthKeys.length) ? monthKeys[0] : null;
const skipWithdrawMonthKeyTotals = (firstMonthInCurrentRangeTotals && firstMonthInCurrentRangeTotals >= TF_WITHDRAW_MIN_MONTHKEY) ? firstMonthInCurrentRangeTotals : null;
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0 || !monthKeys.length) {
tf_setIncomeMinMaxUI('-', '-', 'min-max income from January 2024 s.d -');
return;
}
const totals = {};
monthKeys.forEach((key) => {
totals[key] = { pips: 0, signals: 0, dollars: 0 };
});
const totalsFixedWithdraw = {};
monthKeys.forEach((key) => {
totalsFixedWithdraw[key] = { dollars: 0 };
});
const monthEndBalanceMap = (riskMode === 'compound')
? tf_buildMonthEndBalanceMapFromHistoryRows(lastHistoryRows)
: null;
let tf_monthlyCompoundFallback = Number.isFinite(currentBalance) ? currentBalance : 0;
try {
if (riskMode === 'compound' && Array.isArray(lastHistoryRows) && lastHistoryRows.length) {
const first = lastHistoryRows[0];
if (first && Number.isFinite(first.balanceCompound)) {
tf_monthlyCompoundFallback = first.balanceCompound;
}
}
}
catch (e) { }
try {
rebuildMonthKeysFromStats();
}
catch (e) { }
const tf_allKeysForIncome = Array.isArray(allMonthKeysSorted) ? allMonthKeysSorted.slice() : [];
const tf_incomeMonthKeys = tf_allKeysForIncome.filter((k) => typeof k === 'string' && /^\d{4}-\d{2}$/.test(k) && k >= TF_INCOME_MINMAX_START_MONTHKEY);
const tf_incomeEndKey = tf_incomeMonthKeys.length
? tf_incomeMonthKeys[tf_incomeMonthKeys.length - 1]
: (tf_allKeysForIncome.length ? tf_allKeysForIncome[tf_allKeysForIncome.length - 1] : null);
const tf_incomeRangeText = tf_incomeEndKey
? `min-max income from January 2024 s.d ${tf_formatMonthKeyInline(tf_incomeEndKey)}`
: 'min-max income from January 2024 s.d -';
const tf_incomeTotalsFixed = {};
tf_incomeMonthKeys.forEach((k) => { tf_incomeTotalsFixed[k] = 0; });
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
filteredAnalysts.forEach((a) => {
const analystName = a.baseName || a.name;
const statsKey = a.name;
const hasPair = !!(a.pair);
const aStats = stats[statsKey] || (!hasPair && analystName ? stats[analystName] : null) || {};
const effective = getEffectiveSlForAnalyst(analystName, a.pair || null);
const effectiveSlPips = effective.pips || 0;
const dollarPerPip = getDollarPerPipForAnalyst(a);
const riskPercent = getRiskPercentForAnalyst(analystName, a.pair || getPrimaryPairForAnalyst(a));
const baseBalFixedForIncome = (Number.isFinite(currentBalance) ? currentBalance : 0);
const activeCostRate = (swapEnabled ? Math.max(0, Number(swapRatePerLot) || 0) : 0)
+ (commissionEnabled ? Math.max(0, Number(commissionRatePerLot) || 0) : 0);
let lotFixedIncome = (effectiveSlPips > 0 && dollarPerPip > 0 && Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(baseBalFixedForIncome, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
lotFixedIncome = roundLotToTwoDecimals(lotFixedIncome);
monthKeys.forEach((monthKey) => {
const s = aStats[monthKey];
if (!s)
return;
const baseBal = (riskMode === 'compound')
? tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBalanceMap, tf_monthlyCompoundFallback)
: (Number.isFinite(currentBalance) ? currentBalance : 0);
let lot = (effectiveSlPips > 0 && dollarPerPip > 0 && Number.isFinite(riskPercent) && riskPercent >= 0)
? computeLot(baseBal, riskPercent, effectiveSlPips, dollarPerPip)
: 0;
lot = roundLotToTwoDecimals(lot);
if (typeof s.pips === 'number') {
totals[monthKey].pips += s.pips;
if (lot > 0 && dollarPerPip > 0) {
totals[monthKey].dollars += s.pips * lot * dollarPerPip;
}
}
if (typeof s.pips === 'number') {
if (lotFixedIncome > 0 && dollarPerPip > 0) {
totalsFixedWithdraw[monthKey].dollars += s.pips * lotFixedIncome * dollarPerPip;
}
}
if (typeof s.signals === 'number') {
totals[monthKey].signals += s.signals;
const signalCount = Math.max(0, s.signals);
if (activeCostRate > 0 && signalCount > 0) {
if (lot > 0) totals[monthKey].dollars -= signalCount * lot * activeCostRate;
if (lotFixedIncome > 0) totalsFixedWithdraw[monthKey].dollars -= signalCount * lotFixedIncome * activeCostRate;
}
}
});
if (Array.isArray(tf_incomeMonthKeys) && tf_incomeMonthKeys.length && Number.isFinite(lotFixedIncome) && lotFixedIncome > 0 && dollarPerPip > 0) {
tf_incomeMonthKeys.forEach((monthKey) => {
const s = aStats[monthKey];
if (!s || typeof s.pips !== 'number')
return;
tf_incomeTotalsFixed[monthKey] += s.pips * lotFixedIncome * dollarPerPip;
const signalCount = (typeof s.signals === 'number') ? Math.max(0, s.signals) : 0;
if (activeCostRate > 0 && signalCount > 0) {
tf_incomeTotalsFixed[monthKey] -= signalCount * lotFixedIncome * activeCostRate;
}
});
}
});
const incomeValuesGross = [];
const incomeValuesNet = [];
const monthlyGrossByMonth = [];
const totalRow = document.createElement('tr');
totalRow.className = 'monthly-total-row';

const totalActionSpacer = document.createElement('td');
totalActionSpacer.className = 'monthly-sticky-col-1 monthly-total-action-spacer';
totalActionSpacer.setAttribute('aria-hidden', 'true');
totalActionSpacer.textContent = '';
totalRow.appendChild(totalActionSpacer);

const totalLabelCell = document.createElement('td');
totalLabelCell.colSpan = 2;
totalLabelCell.textContent = 'TOTAL';
totalLabelCell.classList.add('monthly-sticky-col-2', 'monthly-total-label');
totalRow.appendChild(totalLabelCell);
monthKeys.forEach((monthKey, monthIdx) => {
const t = totals[monthKey] || { pips: 0, signals: 0, dollars: 0 };
const td = document.createElement('td');
const lineElements = [];
if (typeof t.pips === 'number') {
const span = document.createElement('span');
span.className = 'monthly-cell-line';
if (t.pips > 0) {
span.classList.add('monthly-val-positive');
}
else if (t.pips < 0) {
span.classList.add('monthly-val-negative');
}
span.textContent = formatNumber(t.pips, 1) + ' Pips';
lineElements.push(span);
}
const sigSpan = document.createElement('span');
sigSpan.className = 'monthly-cell-line';
sigSpan.textContent = (typeof t.signals === 'number' ? t.signals : 0) + ' Signals';
lineElements.push(sigSpan);
if (typeof t.dollars === 'number') {
const grossDollars = t.dollars;
let netDollars = grossDollars;
const grossDollarsFixed = (totalsFixedWithdraw[monthKey] && typeof totalsFixedWithdraw[monthKey].dollars === 'number')
? totalsFixedWithdraw[monthKey].dollars
: grossDollars;
if (equityMetric === 'usd' && withdrawEnabled && Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
const every = (Number.isFinite(withdrawEveryMonths) ? Math.max(1, Math.min(12, Math.floor(withdrawEveryMonths))) : 1);
if (tf_isWithdrawDueMonth(monthKey, every) && (!skipWithdrawMonthKeyTotals || monthKey !== skipWithdrawMonthKeyTotals)) {
netDollars = grossDollars - withdrawAmount;
}
}
const span = document.createElement('span');
span.className = 'monthly-cell-line';
if (netDollars > 0) {
span.classList.add('monthly-val-positive');
}
else if (netDollars < 0) {
span.classList.add('monthly-val-negative');
}
if (priceBusy) {
span.innerHTML = tf_spinnerHTML(true);
}
else {
span.textContent = formatMoney(netDollars);
}
lineElements.push(span);
if (!priceBusy) {
incomeValuesGross.push(grossDollarsFixed);
monthlyGrossByMonth.push({
monthKey,
grossDollars: grossDollarsFixed,
signals: (typeof t.signals === 'number' ? t.signals : 0)
});
}
}
if (!lineElements.length) {
td.textContent = '-';
}
else {
lineElements.forEach((el) => td.appendChild(el));
}
totalRow.appendChild(td);
});
tbody.appendChild(totalRow);
if (priceBusy) {
tf_setIncomeMinMaxUI(tf_spinnerHTML(true), tf_spinnerHTML(true), tf_incomeRangeText);
}
else {
const incomeRangeVals = [];
try {
if (Array.isArray(tf_incomeMonthKeys) && tf_incomeMonthKeys.length) {
const every = (Number.isFinite(withdrawEveryMonths) ? Math.max(1, Math.min(12, Math.floor(withdrawEveryMonths))) : 1);
tf_incomeMonthKeys.forEach((mk) => {
const gross = (tf_incomeTotalsFixed && Number.isFinite(tf_incomeTotalsFixed[mk])) ? tf_incomeTotalsFixed[mk] : 0;
let net = gross;
if (equityMetric === 'usd' && withdrawEnabled && Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
if (tf_isWithdrawDueMonth(mk, every)) {
net = gross - withdrawAmount;
}
}
if (Number.isFinite(net) && net > 0) {
incomeRangeVals.push(net);
}
});
}
}
catch (e) { }
if (incomeRangeVals.length) {
const minVal = Math.min(...incomeRangeVals);
const maxVal = Math.max(...incomeRangeVals);
tf_setIncomeMinMaxUI(formatMoney(minVal), formatMoney(maxVal), tf_incomeRangeText);
}
else {
tf_setIncomeMinMaxUI(formatMoney(0), formatMoney(0), tf_incomeRangeText);
}
}
try {
tf_updateWithdrawMaxAllowedFromMonthlyIncome(incomeValuesGross, priceBusy);
}
catch (e) { }
}
function fillMonthlyFromStorage(tfMonthlyStats) {
monthlyStatsByAnalyst = tfMonthlyStats || {};
}
const TF_HISTORY_COLUMN_PREF_KEY = 'tf_history_visible_columns_v1';
const TF_HISTORY_COLUMN_OPTIONS = [
{ key: 'created', label: 'Tanggal (Created At)', defaultVisible: true },
{ key: 'closed', label: 'Tanggal (Closed At)', defaultVisible: true },
{ key: 'analyst', label: 'Nama Analis', defaultVisible: true },
{ key: 'balance', label: 'Balance', defaultVisible: true },
{ key: 'entry', label: 'Entry', defaultVisible: false },
{ key: 'takeProfit', label: 'Take Profit', defaultVisible: false },
{ key: 'stopLoss', label: 'Stop Loss', defaultVisible: false },
{ key: 'type', label: 'Type', defaultVisible: false },
{ key: 'pair', label: 'Pair', defaultVisible: true },
{ key: 'lot', label: 'Lot Size', defaultVisible: true },
{ key: 'pnlPips', label: 'PnL (pips)', defaultVisible: true },
{ key: 'pnlDollar', label: 'PnL ($)', defaultVisible: true },
{ key: 'pnlDollarNet', label: 'PnL $ + Cost', defaultVisible: true },
{ key: 'pnlPercent', label: 'PnL %', defaultVisible: true },
{ key: 'pnlPercentNet', label: 'PnL % + Cost', defaultVisible: true },
{ key: 'swapDollar', label: 'Swap $', defaultVisible: true },
{ key: 'commDollar', label: 'Comm $', defaultVisible: true },
{ key: 'balancePnl', label: 'Balance PnL ($)', defaultVisible: true }
];
let tf_historyColumnVisibility = null;
function tf_defaultHistoryColumnVisibility() {
const out = {};
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => { out[col.key] = !!col.defaultVisible; });
return out;
}
function tf_getHistoryColumnVisibility() {
if (tf_historyColumnVisibility && typeof tf_historyColumnVisibility === 'object') {
return tf_historyColumnVisibility;
}
const defaults = tf_defaultHistoryColumnVisibility();
try {
const raw = localStorage.getItem(TF_HISTORY_COLUMN_PREF_KEY);
const saved = raw ? JSON.parse(raw) : null;
if (saved && typeof saved === 'object') {
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => {
if (Object.prototype.hasOwnProperty.call(saved, col.key)) {
defaults[col.key] = !!saved[col.key];
}
});
}
}
catch (e) { }
tf_historyColumnVisibility = defaults;
return tf_historyColumnVisibility;
}
function tf_saveHistoryColumnVisibility() {
try {
localStorage.setItem(TF_HISTORY_COLUMN_PREF_KEY, JSON.stringify(tf_getHistoryColumnVisibility()));
}
catch (e) { }
}
function tf_getVisibleHistoryColumnKeys() {
const visibility = tf_getHistoryColumnVisibility();
return TF_HISTORY_COLUMN_OPTIONS.filter((col) => !tf_shouldHideHistoryColumn(col.key, visibility)).map((col) => col.key);
}
function tf_markHistoryCell(cell, key) {
if (!cell)
return cell;
try {
cell.setAttribute('data-history-col', key);
}
catch (e) { }
const visibility = tf_getHistoryColumnVisibility();
const shouldHide = tf_shouldHideHistoryColumn(key, visibility);
try {
cell.classList.toggle('tf-history-col-hidden', shouldHide);
}
catch (e) { }
try {
cell.hidden = shouldHide;
}
catch (e) { }
return cell;
}
function tf_applyHistoryColumnVisibility() {
const visibility = tf_getHistoryColumnVisibility();
try { tf_updateCostAdjustedHeaders(); } catch (e) { }
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => {
document.querySelectorAll('#history-table [data-history-col="' + col.key + '"]').forEach((node) => {
const shouldHide = tf_shouldHideHistoryColumn(col.key, visibility);
node.classList.toggle('tf-history-col-hidden', shouldHide);
try {
node.hidden = shouldHide;
}
catch (e) { }
});
const cb = document.querySelector('#history-column-filter-menu input[data-history-column="' + col.key + '"]');
if (cb) {
const featureEnabled = tf_isHistoryCostColumnEnabled(col.key);
cb.disabled = !featureEnabled;
cb.title = featureEnabled ? '' : 'Aktifkan Swap/Comm terlebih dahulu';
}
});
const visibleCount = tf_getVisibleHistoryColumnKeys().length;
const label = document.getElementById('history-column-filter-label');
if (label)
label.textContent = 'Kolom: ' + visibleCount + '/' + TF_HISTORY_COLUMN_OPTIONS.length;
try {
const detailStatus = document.getElementById('history-detail-data-status');
if (detailStatus) {
const source = Array.isArray(historySignals) ? historySignals : [];
const sourceTradeCount = source.reduce((count, row) => count + (row ? 1 : 0), 0);
const currentTradeCount = (typeof tfMobileHistoryTotalRows !== 'undefined' && Number.isFinite(tfMobileHistoryTotalRows))
? Math.max(0, tfMobileHistoryTotalRows)
: sourceTradeCount;
if (currentTradeCount > 0) {
detailStatus.textContent = 'Data Entry/TP/SL/Type tersedia: ' + currentTradeCount + ' trade. Centang kolom untuk menampilkan.';
detailStatus.classList.add('tf-history-detail-ready');
}
else {
detailStatus.textContent = 'Data Entry/TP/SL/Type belum tersedia pada data saat ini.';
detailStatus.classList.remove('tf-history-detail-ready');
}
}
}
catch (e) { }
const menu = document.getElementById('history-column-filter-menu');
if (menu) {
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => {
const cb = menu.querySelector('input[data-history-column="' + col.key + '"]');
if (cb)
cb.checked = visibility[col.key] !== false;
});
const allCb = menu.querySelector('input[data-history-column-all="1"]');
if (allCb) {
allCb.checked = visibleCount === TF_HISTORY_COLUMN_OPTIONS.length;
allCb.indeterminate = visibleCount > 0 && visibleCount < TF_HISTORY_COLUMN_OPTIONS.length;
}
}
try {
const startCell = document.querySelector('#history-table tbody tr.tf-start-balance-row td');
if (startCell)
startCell.colSpan = Math.max(1, visibleCount + 1);
}
catch (e) { }
}
function setupHistoryColumnFilter() {
const root = document.getElementById('history-column-filter');
const button = document.getElementById('history-column-filter-btn');
const menu = document.getElementById('history-column-filter-menu');
if (!root || !button || !menu)
return;
if (root.getAttribute('data-ready') === '1') {
tf_applyHistoryColumnVisibility();
return;
}
root.setAttribute('data-ready', '1');
menu.innerHTML = '';
const ul = document.createElement('ul');
ul.className = 'tf-history-column-filter-list';
const allLi = document.createElement('li');
allLi.className = 'tf-history-column-filter-all';
const allLabel = document.createElement('label');
const allCb = document.createElement('input');
allCb.type = 'checkbox';
allCb.setAttribute('data-history-column-all', '1');
allLabel.appendChild(allCb);
allLabel.appendChild(document.createTextNode('ALL'));
allLi.appendChild(allLabel);
ul.appendChild(allLi);
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => {
const li = document.createElement('li');
const labelEl = document.createElement('label');
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-history-column', col.key);
cb.checked = tf_getHistoryColumnVisibility()[col.key] !== false;
labelEl.appendChild(cb);
labelEl.appendChild(document.createTextNode(col.label));
li.appendChild(labelEl);
ul.appendChild(li);
cb.addEventListener('change', () => {
tf_getHistoryColumnVisibility()[col.key] = !!cb.checked;
tf_saveHistoryColumnVisibility();
tf_applyHistoryColumnVisibility();
try {
requestAnimationFrame(() => tf_applyHistoryColumnVisibility());
}
catch (e) { }
});
});
allCb.addEventListener('change', () => {
const checked = !!allCb.checked;
const visibility = tf_getHistoryColumnVisibility();
TF_HISTORY_COLUMN_OPTIONS.forEach((col) => { visibility[col.key] = checked; });
tf_saveHistoryColumnVisibility();
tf_applyHistoryColumnVisibility();
try {
requestAnimationFrame(() => tf_applyHistoryColumnVisibility());
}
catch (e) { }
});
menu.appendChild(ul);
const footer = document.createElement('div');
footer.className = 'tf-history-column-filter-footer';
const reset = document.createElement('button');
reset.type = 'button';
reset.className = 'tf-history-column-filter-reset';
reset.textContent = 'Kembali ke Default';
reset.addEventListener('click', (event) => {
event.preventDefault();
event.stopPropagation();
tf_historyColumnVisibility = tf_defaultHistoryColumnVisibility();
tf_saveHistoryColumnVisibility();
tf_applyHistoryColumnVisibility();
});
footer.appendChild(reset);
menu.appendChild(footer);
button.addEventListener('click', (event) => {
event.preventDefault();
event.stopPropagation();
const opening = menu.style.display !== 'block';
menu.style.display = opening ? 'block' : 'none';
button.setAttribute('aria-expanded', opening ? 'true' : 'false');
});
menu.addEventListener('click', (event) => event.stopPropagation());
if (!window.__tfHistoryColumnFilterOutsideBound) {
window.__tfHistoryColumnFilterOutsideBound = true;
document.addEventListener('click', (event) => {
const activeRoot = document.getElementById('history-column-filter');
const activeMenu = document.getElementById('history-column-filter-menu');
const activeButton = document.getElementById('history-column-filter-btn');
if (!activeRoot || !activeMenu || activeRoot.contains(event.target))
return;
activeMenu.style.display = 'none';
if (activeButton)
activeButton.setAttribute('aria-expanded', 'false');
});
}
tf_applyHistoryColumnVisibility();
}
function getHistoryAnalystSource() {
if (!Array.isArray(historySignals))
return [];
const set = new Set();
historySignals.forEach((item) => {
if (item && item.analyst) {
set.add(item.analyst);
}
});
return Array.from(set).sort();
}
function getHistorySelectedAnalysts() {
const allCheckbox = document.getElementById('history-analyst-all');
const container = document.getElementById('history-analyst-checkboxes');
if (!allCheckbox || !container) {
return null;
}
if (allCheckbox.checked) {
return null;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
const selected = [];
boxes.forEach(function (cb) {
if (cb.checked) {
const name = cb.getAttribute('data-analyst') || '';
if (name)
selected.push(name);
}
});
return selected.length ? selected : null;
}
function setupHistoryAnalystFilter() {
const allCheckbox = document.getElementById('history-analyst-all');
const container = document.getElementById('history-analyst-checkboxes');
if (!allCheckbox || !container)
return;
const source = getHistoryAnalystSource();
container.innerHTML = '';
if (!source.length) {
allCheckbox.checked = true;
return;
}
source.forEach(function (name) {
const label = document.createElement('label');
label.style.fontSize = '12px';
label.style.marginRight = '8px';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.setAttribute('data-analyst', name);
cb.checked = true;
const span = document.createElement('span');
span.textContent = name;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
function syncAllFromChildren() {
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
let anyChecked = false;
let allChecked = true;
boxes.forEach(function (cb) {
if (cb.checked) {
anyChecked = true;
}
else {
allChecked = false;
}
});
if (!anyChecked) {
allCheckbox.checked = true;
boxes.forEach(function (cb) {
cb.checked = true;
});
}
else {
allCheckbox.checked = allChecked;
}
}
allCheckbox.addEventListener('change', function () {
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
const checked = !!allCheckbox.checked;
boxes.forEach(function (cb) {
cb.checked = checked;
});
if (!checked) {
boxes.forEach(function (cb) { cb.checked = true; });
allCheckbox.checked = true;
}
recomputeHistoryRows();
});
container.addEventListener('change', function (evt) {
const target = evt.target;
if (!target || target.type !== 'checkbox')
return;
syncAllFromChildren();
recomputeHistoryRows();
});
syncAllFromChildren();
}

const TF_MOBILE_HISTORY_CHUNK_SIZE = 50;
let tfMobileHistoryRenderLimit = TF_MOBILE_HISTORY_CHUNK_SIZE;
let tfMobileHistoryTotalRows = 0;
let tfMobileHistoryRestoreScrollTop = null;
let tfMobileHistoryRowsCache = [];
let tfMobileHistoryRenderedStart = 0;
let tfMobileHistoryRenderContext = {
startingBalance: 0,
priceBusy: false,
riskMode: 'fixed'
};

function tfMobileCreateHistoryStartRow(startingBalance, riskMode) {
const trStart = document.createElement('tr');
trStart.className = 'tf-start-balance-row';
const tdStart = document.createElement('td');
tdStart.colSpan = Math.max(1, tf_getVisibleHistoryColumnKeys().length + 1);
tdStart.className = 'mono';
const sbLabel = (riskMode === 'compound') ? 'Start Balance Compounded' : 'Start Balance';
tdStart.textContent = sbLabel + ' : ' + formatMoney(Number.isFinite(startingBalance) ? startingBalance : 0);
trStart.appendChild(tdStart);
return trStart;
}

function tfMobileCreateHistoryRow(row, startingBalance, priceBusy) {
const isWithdrawRow = !!(row && row.isWithdraw);
const tr = document.createElement('tr');
if (isWithdrawRow) {
tr.className = 'tf-withdraw-row';
}
const __rowId = tf_historyRowId(row);
const __enabled = tf_isHistoryRowEnabled(__rowId);
if (!__enabled) {
try {
tr.classList.add('tf-row-disabled');
}
catch (e) { }
}
const cbCell = document.createElement('td');
cbCell.className = 'tf-history-cb-cell';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.className = 'tf-history-row-cb';
cb.checked = !!__enabled;
cb.addEventListener('change', () => {
tf_captureHistoryTableScrollForRestore();
tf_setHistoryRowEnabled(__rowId, cb.checked);
recomputeHistoryRows();
});
cbCell.appendChild(cb);
tr.appendChild(cbCell);
const createdCell = tf_markHistoryCell(document.createElement('td'), 'created');
createdCell.classList.add('mono');
createdCell.textContent = row.createdDate || row.displayDate || '';
tr.appendChild(createdCell);
const dateCell = tf_markHistoryCell(document.createElement('td'), 'closed');
dateCell.classList.add('mono');
dateCell.textContent = row.displayDate || row.createdDate || '';
tr.appendChild(dateCell);
const analystCell = tf_markHistoryCell(document.createElement('td'), 'analyst');
analystCell.textContent = isWithdrawRow ? 'Withdraw' : formatAnalystDisplayName(row.analyst || '');
analystCell.title = isWithdrawRow ? 'Withdraw' : String(row.analyst || '').trim();
tr.appendChild(analystCell);
const balanceCompoundCell = tf_markHistoryCell(document.createElement('td'), 'balance');
balanceCompoundCell.classList.add('text-right', 'mono');
balanceCompoundCell.textContent = Number.isFinite(row.balanceCompound)
? formatMoney(row.balanceCompound)
: formatMoney(startingBalance || 0);
tr.appendChild(balanceCompoundCell);
const tfPickHistoryDetail = (keys) => {
if (isWithdrawRow)
return '';
for (let i = 0; i < keys.length; i++) {
const value = row ? row[keys[i]] : '';
if (value !== null && value !== undefined && String(value).trim() !== '') {
return String(value).trim();
}
}
return '';
};
const entryCell = tf_markHistoryCell(document.createElement('td'), 'entry');
entryCell.classList.add('mono');
entryCell.textContent = tfPickHistoryDetail(['entry', 'price']);
tr.appendChild(entryCell);
const takeProfitCell = tf_markHistoryCell(document.createElement('td'), 'takeProfit');
takeProfitCell.classList.add('mono');
takeProfitCell.textContent = tfPickHistoryDetail(['takeProfit', 'take_profit', 'tp']);
tr.appendChild(takeProfitCell);
const stopLossCell = tf_markHistoryCell(document.createElement('td'), 'stopLoss');
stopLossCell.classList.add('mono');
stopLossCell.textContent = tfPickHistoryDetail(['stopLoss', 'stop_loss', 'sl']);
tr.appendChild(stopLossCell);
const typeCell = tf_markHistoryCell(document.createElement('td'), 'type');
const typeText = tfPickHistoryDetail(['type', 'side', 'orderType']);
typeCell.textContent = typeText;
if (/^buy$/i.test(typeText))
typeCell.classList.add('tf-history-type-buy');
else if (/^sell$/i.test(typeText))
typeCell.classList.add('tf-history-type-sell');
tr.appendChild(typeCell);
const pairCell = tf_markHistoryCell(document.createElement('td'), 'pair');
pairCell.textContent = isWithdrawRow ? '' : (row.pair || '');
tr.appendChild(pairCell);
const lotCell = tf_markHistoryCell(document.createElement('td'), 'lot');
lotCell.className = 'text-right mono';
if (isWithdrawRow) {
lotCell.textContent = '-';
}
else if (priceBusy) {
lotCell.innerHTML = tf_spinnerHTML(true);
}
else {
lotCell.textContent = formatNumber(row.lot, 2);
}
tr.appendChild(lotCell);
const pnlPipsCell = tf_markHistoryCell(document.createElement('td'), 'pnlPips');
pnlPipsCell.className = 'text-right mono ' + ((row.pnlPips >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlPipsCell.className = 'text-right mono sl';
pnlPipsCell.textContent = '-';
}
else {
pnlPipsCell.textContent = row.pnlPips ? formatNumber(row.pnlPips, 1) : '0';
}
tr.appendChild(pnlPipsCell);
const pnlDollarCell = tf_markHistoryCell(document.createElement('td'), 'pnlDollar');
pnlDollarCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
const wd = Number.isFinite(row.pnlDollar) ? row.pnlDollar : (-(Math.abs(Number(row.withdrawAmount) || 0)));
pnlDollarCell.className = 'text-right mono sl';
pnlDollarCell.textContent = formatMoney(wd || 0);
}
else if (priceBusy) {
pnlDollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlDollarCell.textContent = row.pnlDollar ? formatMoney(row.pnlDollar) : formatMoney(0);
}
tr.appendChild(pnlDollarCell);
const pnlDollarNetCell = tf_markHistoryCell(document.createElement('td'), 'pnlDollarNet');
const pnlDollarNet = isWithdrawRow ? (Number.isFinite(row.pnlDollar) ? row.pnlDollar : 0) : tf_getHistoryNetPnlDollar(row);
pnlDollarNetCell.className = 'text-right mono ' + ((pnlDollarNet >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlDollarNetCell.className = 'text-right mono sl';
pnlDollarNetCell.textContent = formatMoney(pnlDollarNet || 0);
}
else if (priceBusy) {
pnlDollarNetCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlDollarNetCell.textContent = formatMoney(pnlDollarNet || 0);
}
tr.appendChild(pnlDollarNetCell);
const pnlPercentCell = tf_markHistoryCell(document.createElement('td'), 'pnlPercent');
pnlPercentCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlPercentCell.className = 'text-right mono sl';
pnlPercentCell.textContent = '—';
}
else if (priceBusy) {
pnlPercentCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlPercentCell.textContent = Number.isFinite(row.pnlPercent) ? (formatNumber(row.pnlPercent, 2) + '%') : '0%';
}
tr.appendChild(pnlPercentCell);
const pnlPercentNetCell = tf_markHistoryCell(document.createElement('td'), 'pnlPercentNet');
const pnlPercentNet = isWithdrawRow ? (Number.isFinite(row.pnlPercent) ? row.pnlPercent : 0) : tf_getHistoryNetPnlPercent(row);
pnlPercentNetCell.className = 'text-right mono ' + ((pnlDollarNet >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlPercentNetCell.className = 'text-right mono sl';
pnlPercentNetCell.textContent = '—';
}
else if (priceBusy) {
pnlPercentNetCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlPercentNetCell.textContent = Number.isFinite(pnlPercentNet) ? (formatNumber(pnlPercentNet, 2) + '%') : '0%';
}
tr.appendChild(pnlPercentNetCell);
const swapCell = tf_markHistoryCell(document.createElement('td'), 'swapDollar');
swapCell.className = 'text-right mono sl';
if (isWithdrawRow) swapCell.textContent = '-';
else if (priceBusy) swapCell.innerHTML = tf_spinnerHTML(true);
else swapCell.textContent = formatMoney(Number.isFinite(Number(row.swapDollar)) ? Number(row.swapDollar) : 0);
tr.appendChild(swapCell);
const commCell = tf_markHistoryCell(document.createElement('td'), 'commDollar');
commCell.className = 'text-right mono sl';
if (isWithdrawRow) commCell.textContent = '-';
else if (priceBusy) commCell.innerHTML = tf_spinnerHTML(true);
else commCell.textContent = formatMoney(Number.isFinite(Number(row.commDollar)) ? Number(row.commDollar) : 0);
tr.appendChild(commCell);
const balanceCell = tf_markHistoryCell(document.createElement('td'), 'balancePnl');
balanceCell.className = 'text-right mono ' + ((tf_getHistoryNetPnlDollar(row) >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
balanceCell.className = 'text-right mono sl';
balanceCell.textContent = Number.isFinite(row.balancePnl) ? formatMoney(row.balancePnl) : formatMoney(startingBalance || 0);
}
else if (priceBusy) {
balanceCell.innerHTML = tf_spinnerHTML(true);
}
else {
balanceCell.textContent = Number.isFinite(row.balancePnl) ? formatMoney(row.balancePnl) : formatMoney(startingBalance || 0);
}
tr.appendChild(balanceCell);
return tr;
}

function recomputeHistoryRows() {
const selectedAnalysts = null;
const fixedLotCache = new Map();
function getFixedLotCached(analystName, pair, dollarPerPip, riskPercent) {
const key = String(analystName || '') + '|' + String(pair || '');
if (fixedLotCache.has(key)) {
return fixedLotCache.get(key) || 0;
}
let lotFixed = 0;
try {
const slStats = computeSlStatsFromHistory(analystName, pair);
const effective = getEffectiveSlForAnalyst(analystName, pair, slStats);
const fixedSlPips = effective && Number.isFinite(effective.pips) ? effective.pips : 0;
if (fixedSlPips > 0 && dollarPerPip > 0 && Number.isFinite(currentBalance) && Number.isFinite(riskPercent) && riskPercent >= 0) {
lotFixed = computeLot(currentBalance, riskPercent, fixedSlPips, dollarPerPip);
if (!Number.isFinite(lotFixed) || lotFixed <= 0) {
lotFixed = 0;
}
else {
lotFixed = roundLotToTwoDecimals(lotFixed);
}
}
}
catch (e) {
}
fixedLotCache.set(key, lotFixed);
return lotFixed;
}
const slPipsCache = new Map();
function getEffectiveSlPipsCached(analystName, pair) {
const key = String(analystName || '') + '|' + String(pair || '');
if (slPipsCache.has(key)) {
return slPipsCache.get(key) || 0;
}
let slPips = 0;
try {
const slStats = computeSlStatsFromHistory(analystName, pair);
const effective = getEffectiveSlForAnalyst(analystName, pair, slStats);
if (effective && Number.isFinite(effective.pips)) {
slPips = effective.pips;
}
}
catch (e) {
}
if (!Number.isFinite(slPips) || slPips <= 0)
slPips = 0;
slPipsCache.set(key, slPips);
return slPips;
}
let baseRows = (Array.isArray(historySignals) ? historySignals : [])
.map((item) => {
if (!item)
return null;
const analystName = item.analyst || '';
const pair = item.pair || '';
if (!tf_isAnalystGloballySelected(analystName)) {
return null;
}
if (Array.isArray(selectedPairs) && selectedPairs.length > 0) {
const upperPair = String(pair || '').toUpperCase();
if (upperPair && !selectedPairs.includes(upperPair)) {
return null;
}
}
if (selectedAnalystPairsMapHistory && typeof selectedAnalystPairsMapHistory === 'object') {
const mapEntry = tf_getAllowedPairsOrNull(selectedAnalystPairsMapHistory, analystName);
if (Array.isArray(mapEntry)) {
const pairUpper = tf_normPairKey(pair || '');
if (!pairUpper) {
return null;
}
const match = mapEntry.some((p) => tf_normPairKey(p) === pairUpper);
if (!match) {
return null;
}
}
}
let pips = 0;
if (typeof item.pips === 'number') {
pips = item.pips;
}
else if (typeof item.pips === 'string') {
const parsed = parseFloat(item.pips);
if (Number.isFinite(parsed)) {
pips = parsed;
}
}
const absPips = Math.abs(pips);
const dollarPerPip = getDollarPerPipForAnalyst(null, pair);
const riskPercent = getRiskPercentForAnalyst(analystName, pair);
const lotFixed = getFixedLotCached(analystName, pair, dollarPerPip, riskPercent);
return {
...item,
analyst: analystName,
pair,
pips: pips,
absPips: absPips,
dollarPerPip: dollarPerPip,
riskPercent: riskPercent,
lotFixed: lotFixed
};
})
.filter(Boolean);
let minMonthIdx = null;
let maxMonthIdx = null;
try {
for (let i = 0; i < baseRows.length; i++) {
const mi = tf_sortKeyToMonthIndex(tf_getPrimarySortKey(baseRows[i]));
if (mi == null)
continue;
if (minMonthIdx == null || mi < minMonthIdx)
minMonthIdx = mi;
if (maxMonthIdx == null || mi > maxMonthIdx)
maxMonthIdx = mi;
}
}
catch (e) {
}
try {
tf_updateTradeRangeAvailabilityFromMonthSpan(minMonthIdx, maxMonthIdx);
}
catch (e) { }
try {
tf_refreshSingleMonthSelectors();
tf_syncSingleMonthSelectorsUI();
}
catch (e) { }
try {
baseRows = tf_filterRowsByTradeTimeRange(baseRows, maxMonthIdx);
}
catch (e) { }
const tf_closedKeyOf = (row) => {
const k = row && row.sortKey;
return (typeof k === 'number' && isFinite(k)) ? k : 0;
};
const tf_createdKeyOf = (row) => {
const k = row && row.createdSortKey;
return (typeof k === 'number' && isFinite(k)) ? k : 0;
};
const tf_calcKeyOf = (row) => {
const sk = tf_closedKeyOf(row);
return sk || tf_createdKeyOf(row);
};
const baseRowsForCalc = baseRows.slice().sort((a, b) => tf_calcKeyOf(a) - tf_calcKeyOf(b));
const monthKeys = [];
const monthSeen = new Set();
const tradesByMonth = Object.create(null);
for (let i = 0; i < baseRowsForCalc.length; i++) {
const rb = baseRowsForCalc[i];
const mk = tf_monthKeyFromSortKey(tf_calcKeyOf(rb));
if (!mk)
continue;
if (!monthSeen.has(mk)) {
monthSeen.add(mk);
monthKeys.push(mk);
}
if (!tradesByMonth[mk])
tradesByMonth[mk] = [];
tradesByMonth[mk].push(rb);
}
const tf_monthIndexFromMonthKey = (mk) => {
const parts = String(mk || '').split('-');
const y = parseInt(parts[0] || '0', 10);
const m = parseInt(parts[1] || '1', 10);
return (y * 12) + (m - 1);
};
const tf_monthKeyFromMonthIndex = (idx) => {
const y = Math.floor(idx / 12);
const m = (idx % 12) + 1;
const mm = String(m).padStart(2, '0');
return `${y}-${mm}`;
};
const fullMonthKeys = (monthKeys.length <= 1) ? monthKeys.slice() : (function () {
const startIdx = tf_monthIndexFromMonthKey(monthKeys[0]);
const endIdx = tf_monthIndexFromMonthKey(monthKeys[monthKeys.length - 1]);
const out = [];
for (let mi = startIdx; mi <= endIdx; mi++) {
out.push(tf_monthKeyFromMonthIndex(mi));
}
return out;
})();
try {
tf_setCompoundSubRowsVisible((equityMetric === 'usd') && (riskMode === 'compound'));
}
catch (e) { }
try {
tf_updateHistoryBalanceHeaderLabel(riskMode);
}
catch (e) { }
try {
tf_renderCompoundMonthsOptions(fullMonthKeys.length || monthKeys.length);
}
catch (e) { }
const periodMonths = (riskMode === 'compound') ? Math.max(1, Math.floor(compoundMonths || 1)) : 1;
const monthToPeriodStart = Object.create(null);
for (let i = 0; i < fullMonthKeys.length; i++) {
const mkey = fullMonthKeys[i];
const startIndex = Math.floor(i / periodMonths) * periodMonths;
monthToPeriodStart[mkey] = fullMonthKeys[startIndex] || mkey;
}
const startingBalance = Number.isFinite(currentBalance) ? currentBalance : 0;
let runningEquity = startingBalance;
let runningTrade = startingBalance;
const rows = [];
const compoundLotCache = new Map();
const periodStartBalanceCache = {};
const firstPeriodStartKey = (riskMode === 'compound' && fullMonthKeys && fullMonthKeys.length)
? (monthToPeriodStart[fullMonthKeys[0]] || fullMonthKeys[0])
: null;
if (riskMode === 'compound' && firstPeriodStartKey) {
periodStartBalanceCache[firstPeriodStartKey] = startingBalance;
}
const wEnabled = (equityMetric === 'usd') && !!withdrawEnabled && Number.isFinite(withdrawAmount) && withdrawAmount > 0;
const wAmt = wEnabled ? Math.max(0, withdrawAmount) : 0;
const wEvery = wEnabled ? Math.max(1, Math.min(12, Math.floor(withdrawEveryMonths || 1))) : 1;
const firstMonthInCurrentRange = (fullMonthKeys && fullMonthKeys.length) ? fullMonthKeys[0] : null;
const skipWithdrawMonthKey = (firstMonthInCurrentRange && firstMonthInCurrentRange >= TF_WITHDRAW_MIN_MONTHKEY) ? firstMonthInCurrentRange : null;
const tf_monthStartEquityAfterWithdraw = Object.create(null);
const tf_monthEndEquity = Object.create(null);
const tf_monthStartTradeAfterWithdraw = Object.create(null);
const tf_monthEndTrade = Object.create(null);
let tf_currentSizingBase = startingBalance;
let tf_currentPeriodStartKey = firstPeriodStartKey;
let tf_doubleAchievedEver = false;
let tf_maxEquityEver = Number.isFinite(startingBalance) ? startingBalance : 0;
for (let mIndex = 0; mIndex < fullMonthKeys.length; mIndex++) {
const monthKey = fullMonthKeys[mIndex];
const periodStartKey = monthToPeriodStart[monthKey] || monthKey;
if (riskMode === 'compound') {
if (tf_currentPeriodStartKey !== periodStartKey) {
tf_currentPeriodStartKey = periodStartKey;
tf_currentSizingBase = (monthKey === firstMonthInCurrentRange) ? startingBalance : runningEquity;
try {
compoundLotCache.clear();
}
catch (e) { }
}
periodStartBalanceCache[periodStartKey] = tf_currentSizingBase;
}
const tf_withdrawScheduled = (wEnabled && tf_isWithdrawDueMonth(monthKey, wEvery) && (!skipWithdrawMonthKey || monthKey !== skipWithdrawMonthKey));
let tf_withdrawEligible = false;
let tf_withdrawAutoUntick = false;
if (tf_withdrawScheduled) {
tf_withdrawEligible = true;
if (mIndex <= 0) {
tf_withdrawEligible = false;
}
else {
const __prevMonthKey = fullMonthKeys[mIndex - 1];
const __prevPrevMonthKey = (mIndex - 2 >= 0) ? fullMonthKeys[mIndex - 2] : null;
const __prevStart = (mIndex - 2 < 0)
? startingBalance
: ((__prevPrevMonthKey && Number.isFinite(tf_monthEndEquity[__prevPrevMonthKey]))
? tf_monthEndEquity[__prevPrevMonthKey]
: startingBalance);
const __prevEnd = (__prevMonthKey && Number.isFinite(tf_monthEndEquity[__prevMonthKey]))
? tf_monthEndEquity[__prevMonthKey]
: __prevStart;
if (!tf_doubleAchievedEver) {
if (!Number.isFinite(__prevStart) || __prevStart <= 0 || !Number.isFinite(__prevEnd) || (__prevEnd < (__prevStart * 1.10))) {
tf_withdrawEligible = false;
}
if (tf_withdrawEligible && Number.isFinite(__prevStart) && __prevStart > 0 && Number.isFinite(__prevEnd) && (__prevEnd <= (__prevStart * 0.80))) {
tf_withdrawEligible = false;
}
}
}
if (!tf_withdrawEligible) {
tf_withdrawAutoUntick = true;
}
}
if (tf_withdrawScheduled) {
const wSortKey = tf_firstDaySortKeyFromMonthKey(monthKey);
const wDateLabel = tf_firstDayDisplayDateFromMonthKey(monthKey);
const __balBeforeWithdraw = runningEquity;
let __balAfterWithdraw = __balBeforeWithdraw;
if (tf_withdrawEligible) {
runningEquity -= wAmt;
__balAfterWithdraw = runningEquity;
}
try {
if (Number.isFinite(runningEquity) && runningEquity > tf_maxEquityEver)
tf_maxEquityEver = runningEquity;
if (!tf_doubleAchievedEver && Number.isFinite(startingBalance) && startingBalance > 0 && tf_maxEquityEver >= (startingBalance * 2)) {
tf_doubleAchievedEver = true;
}
}
catch (e) { }
let __withdrawDenom = 0;
if (riskMode === 'fixed') {
__withdrawDenom = startingBalance;
}
else {
__withdrawDenom = __balBeforeWithdraw;
}
let __withdrawPct = 0;
if (Number.isFinite(__withdrawDenom) && __withdrawDenom !== 0) {
__withdrawPct = (-wAmt / __withdrawDenom) * 100;
}
rows.push({
isWithdraw: true,
__tfWithdrawEligible: !!tf_withdrawEligible,
__tfWithdrawAutoUntick: !!tf_withdrawAutoUntick,
withdrawMonthKey: monthKey,
withdrawAmount: wAmt,
sortKey: wSortKey,
createdSortKey: wSortKey,
createdDate: wDateLabel,
displayDate: wDateLabel,
analyst: 'Withdraw',
pair: 'User',
lot: 0,
pnlPips: 0,
pnlDollar: -wAmt,
pnlPercent: __withdrawPct,
pnlDollarNet: -wAmt,
pnlPercentNet: __withdrawPct,
swapDollar: 0,
commDollar: 0,
dollarTP: 0,
dollarSL: wAmt,
balancePnl: __balAfterWithdraw,
balanceCompound: (riskMode === 'compound') ? __balBeforeWithdraw : startingBalance,
balanceTradeOnly: runningTrade,
});
if (riskMode === 'compound' && tf_withdrawEligible) {
tf_currentSizingBase = runningEquity;
try {
compoundLotCache.clear();
}
catch (e) { }
try {
periodStartBalanceCache[periodStartKey] = tf_currentSizingBase;
}
catch (e) { }
}
}
try {
tf_monthStartEquityAfterWithdraw[monthKey] = runningEquity;
}
catch (e) { }
try {
tf_monthStartTradeAfterWithdraw[monthKey] = runningTrade;
}
catch (e) { }
try {
const monthTrades = tradesByMonth[monthKey] || [];
for (let j = 0; j < monthTrades.length; j++) {
const rowBase = monthTrades[j];
const mk = monthKey;
const pStart = periodStartKey;
const baseBalanceForPeriod = (riskMode === 'compound' && Number.isFinite(tf_currentSizingBase))
? tf_currentSizingBase
: startingBalance;
const riskPercent = Math.max(0, Number(rowBase.riskPercent) || 0);
const dollarPerPip = Math.abs(Number(rowBase.dollarPerPip) || 0);
const pnlPips = Number(rowBase.pips) || 0;
let lot = 0;
if (riskMode === 'fixed') {
lot = Number(rowBase.lotFixed) || 0;
}
else {
const baseForSizing = Math.max(0, Number(baseBalanceForPeriod) || 0);
const key = `${pStart}|${rowBase.analyst}|${rowBase.pair}|B${Math.round(baseForSizing * 100)}`;
if (!compoundLotCache.has(key)) {
const slPips = getEffectiveSlPipsCached(rowBase.analyst, rowBase.pair);
let lotC = 0;
if (slPips > 0 && dollarPerPip > 0 && riskPercent >= 0) {
lotC = computeLot(baseForSizing, riskPercent, slPips, dollarPerPip);
if (!Number.isFinite(lotC) || lotC <= 0) {
lotC = 0;
}
else {
lotC = roundLotToTwoDecimals(lotC);
}
}
compoundLotCache.set(key, lotC);
}
lot = compoundLotCache.get(key) || 0;
}
const pnlDollarRaw = pnlPips * lot * dollarPerPip;
const pnlDollar = Number.isFinite(pnlDollarRaw) ? pnlDollarRaw : 0;
const pipsTP = pnlPips > 0 ? pnlPips : 0;
const pipsSL = pnlPips < 0 ? Math.abs(pnlPips) : 0;
const dollarTP = pnlDollar > 0 ? pnlDollar : 0;
const dollarSL = pnlDollar < 0 ? Math.abs(pnlDollar) : 0;
const denom = Math.abs(baseBalanceForPeriod) || 0;
const pnlPercent = denom > 0 ? (pnlDollar / denom) * 100 : 0;
const costFields = tf_buildTradeCostFields(lot, pnlDollar, denom);
runningTrade += costFields.pnlDollarNet;
runningEquity += costFields.pnlDollarNet;
try {
if (Number.isFinite(runningEquity) && runningEquity > tf_maxEquityEver)
tf_maxEquityEver = runningEquity;
if (!tf_doubleAchievedEver && Number.isFinite(startingBalance) && startingBalance > 0 && tf_maxEquityEver >= (startingBalance * 2)) {
tf_doubleAchievedEver = true;
}
}
catch (e) { }
const __balanceColValue = (riskMode === 'compound') ? baseBalanceForPeriod : startingBalance;
rows.push({
...rowBase,
lot,
pnlPips,
pipsTP,
pipsSL,
dollarTP,
dollarSL,
pnlDollar,
pnlPercent,
...costFields,
balancePnl: runningEquity,
balanceCompound: __balanceColValue,
balanceTradeOnly: runningTrade,
});
}
try {
tf_monthEndEquity[monthKey] = runningEquity;
}
catch (e) { }
try {
tf_monthEndTrade[monthKey] = runningTrade;
}
catch (e) { }
}
catch (e) { }
}
const tbody = document.querySelector('#history-table tbody');
if (!tbody)
return;
tbody.innerHTML = '';
const rowsForDisplay = rows.slice().sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
try {
let __runEq = startingBalance;
let __runTrade = startingBalance;
for (let i = 0; i < rowsForDisplay.length; i++) {
const r = rowsForDisplay[i];
if (!r)
continue;
const __pnl = r.isWithdraw ? (Number.isFinite(r.pnlDollar) ? r.pnlDollar : ((r.dollarTP || 0) - (r.dollarSL || 0))) : tf_getHistoryNetPnlDollar(r);
if (r.isWithdraw) {
const __before = __runEq;
__runEq += __pnl;
r.balancePnl = __runEq;
r.balanceTradeOnly = __runTrade;
if (riskMode === 'fixed') {
r.balanceCompound = startingBalance;
}
else {
r.balanceCompound = __before;
}
}
else {
__runTrade += __pnl;
__runEq += __pnl;
r.balancePnl = __runEq;
r.balanceTradeOnly = __runTrade;
if (riskMode === 'fixed') {
r.balanceCompound = startingBalance;
}
}
}
}
catch (e) { }
const priceBusy = tf_isMyfxbookPriceLoading();
const rowsForUi = tf_getHistoryRowsForUiAndExport(rowsForDisplay);
try {
tf_lastVisibleHistoryRowIds = Array.isArray(rowsForUi) ? rowsForUi.map(r => tf_historyRowId(r)).filter(Boolean) : [];
tf_lastEligibleHistoryRowIds = Array.isArray(rowsForUi)
? rowsForUi.filter(r => tf_isHistoryRowEligibleForAllToggle(r)).map(r => tf_historyRowId(r)).filter(Boolean)
: [];
}
catch (e) {
tf_lastVisibleHistoryRowIds = [];
tf_lastEligibleHistoryRowIds = [];
}
try {
tf_recomputeBalancesSkippingDisabled(rowsForUi, startingBalance, riskMode);
}
catch (e) { }
const rowsForCalc = Array.isArray(rowsForUi) ? rowsForUi.filter(r => tf_isHistoryRowEnabled(r)) : [];
try {
lastHistoryRowsForExport = rowsForCalc.slice();
}
catch (e) {
lastHistoryRowsForExport = [];
}
try {
tf_renderAnalystPerformanceTablesFromRows(rowsForCalc);
}
catch (e) { }
tfMobileHistoryTotalRows = Array.isArray(rowsForUi) ? rowsForUi.length : 0;
try { tf_applyHistoryColumnVisibility(); } catch (e) { }
if (!Number.isFinite(tfMobileHistoryRenderLimit) || tfMobileHistoryRenderLimit < TF_MOBILE_HISTORY_CHUNK_SIZE) {
  tfMobileHistoryRenderLimit = TF_MOBILE_HISTORY_CHUNK_SIZE;
}
if (tfMobileHistoryRenderLimit > tfMobileHistoryTotalRows && tfMobileHistoryTotalRows > 0) {
  tfMobileHistoryRenderLimit = Math.max(TF_MOBILE_HISTORY_CHUNK_SIZE, tfMobileHistoryTotalRows);
}

tfMobileHistoryRowsCache = Array.isArray(rowsForUi) ? rowsForUi : [];
tfMobileHistoryRenderedStart = Math.max(
  0,
  tfMobileHistoryTotalRows - Math.min(tfMobileHistoryRenderLimit, tfMobileHistoryTotalRows)
);
tfMobileHistoryRenderContext = {
  startingBalance,
  priceBusy,
  riskMode
};

const tfMobileRowsForDom = Array.isArray(rowsForUi)
  ? rowsForUi.slice(tfMobileHistoryRenderedStart)
  : [];

if (tfMobileHistoryRenderedStart === 0) {
try {
tbody.appendChild(tfMobileCreateHistoryStartRow(startingBalance, riskMode));
}
catch (e) { }
}

tfMobileRowsForDom.forEach((row) => {
const tfFastRow = tfMobileCreateHistoryRow(row, startingBalance, priceBusy);
tbody.appendChild(tfFastRow);
return;
const isWithdrawRow = !!(row && row.isWithdraw);
const tr = document.createElement('tr');
if (isWithdrawRow) {
tr.className = 'tf-withdraw-row';
}
const __rowId = tf_historyRowId(row);
const __enabled = tf_isHistoryRowEnabled(__rowId);
if (!__enabled) {
try {
tr.classList.add('tf-row-disabled');
}
catch (e) { }
}
const cbCell = document.createElement('td');
cbCell.className = 'tf-history-cb-cell';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.className = 'tf-history-row-cb';
cb.checked = !!__enabled;
cb.addEventListener('change', () => {
tf_captureHistoryTableScrollForRestore();
tf_setHistoryRowEnabled(__rowId, cb.checked);
recomputeHistoryRows();
});
cbCell.appendChild(cb);
tr.appendChild(cbCell);
const createdCell = tf_markHistoryCell(document.createElement('td'), 'created');
createdCell.classList.add('mono');
createdCell.textContent = row.createdDate || row.displayDate || '';
tr.appendChild(createdCell);
const dateCell = tf_markHistoryCell(document.createElement('td'), 'closed');
dateCell.classList.add('mono');
dateCell.textContent = row.displayDate || row.createdDate || '';
tr.appendChild(dateCell);
const analystCell = tf_markHistoryCell(document.createElement('td'), 'analyst');
analystCell.textContent = isWithdrawRow ? 'Withdraw' : formatAnalystDisplayName(row.analyst || '');
analystCell.title = isWithdrawRow ? 'Withdraw' : String(row.analyst || '').trim();
tr.appendChild(analystCell);
const balanceCompoundCell = tf_markHistoryCell(document.createElement('td'), 'balance');
balanceCompoundCell.classList.add('text-right', 'mono');
balanceCompoundCell.textContent = Number.isFinite(row.balanceCompound)
? formatMoney(row.balanceCompound)
: formatMoney(startingBalance || 0);
tr.appendChild(balanceCompoundCell);
const tfPickHistoryDetail = (keys) => {
if (isWithdrawRow)
return '';
for (let i = 0; i < keys.length; i++) {
const value = row ? row[keys[i]] : '';
if (value !== null && value !== undefined && String(value).trim() !== '') {
return String(value).trim();
}
}
return '';
};
const entryCell = tf_markHistoryCell(document.createElement('td'), 'entry');
entryCell.classList.add('mono');
entryCell.textContent = tfPickHistoryDetail(['entry', 'price']);
tr.appendChild(entryCell);
const takeProfitCell = tf_markHistoryCell(document.createElement('td'), 'takeProfit');
takeProfitCell.classList.add('mono');
takeProfitCell.textContent = tfPickHistoryDetail(['takeProfit', 'take_profit', 'tp']);
tr.appendChild(takeProfitCell);
const stopLossCell = tf_markHistoryCell(document.createElement('td'), 'stopLoss');
stopLossCell.classList.add('mono');
stopLossCell.textContent = tfPickHistoryDetail(['stopLoss', 'stop_loss', 'sl']);
tr.appendChild(stopLossCell);
const typeCell = tf_markHistoryCell(document.createElement('td'), 'type');
const typeText = tfPickHistoryDetail(['type', 'side', 'orderType']);
typeCell.textContent = typeText;
if (/^buy$/i.test(typeText))
typeCell.classList.add('tf-history-type-buy');
else if (/^sell$/i.test(typeText))
typeCell.classList.add('tf-history-type-sell');
tr.appendChild(typeCell);
const pairCell = tf_markHistoryCell(document.createElement('td'), 'pair');
pairCell.textContent = isWithdrawRow ? '' : (row.pair || '');
tr.appendChild(pairCell);
const lotCell = tf_markHistoryCell(document.createElement('td'), 'lot');
lotCell.className = 'text-right mono';
if (isWithdrawRow) {
lotCell.textContent = '-';
}
else if (priceBusy) {
lotCell.innerHTML = tf_spinnerHTML(true);
}
else {
lotCell.textContent = formatNumber(row.lot, 2);
}
tr.appendChild(lotCell);
const pnlPipsCell = tf_markHistoryCell(document.createElement('td'), 'pnlPips');
pnlPipsCell.className = 'text-right mono ' + ((row.pnlPips >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlPipsCell.className = 'text-right mono sl';
pnlPipsCell.textContent = '-';
}
else {
pnlPipsCell.textContent = row.pnlPips ? formatNumber(row.pnlPips, 1) : '0';
}
tr.appendChild(pnlPipsCell);
const pnlDollarCell = tf_markHistoryCell(document.createElement('td'), 'pnlDollar');
pnlDollarCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
const wd = Number.isFinite(row.pnlDollar) ? row.pnlDollar : (-(Math.abs(Number(row.withdrawAmount) || 0)));
pnlDollarCell.className = 'text-right mono sl';
pnlDollarCell.textContent = formatMoney(wd || 0);
}
else if (priceBusy) {
pnlDollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlDollarCell.textContent = row.pnlDollar ? formatMoney(row.pnlDollar) : formatMoney(0);
}
tr.appendChild(pnlDollarCell);
const pnlDollarNetCell = tf_markHistoryCell(document.createElement('td'), 'pnlDollarNet');
const pnlDollarNet = isWithdrawRow ? (Number.isFinite(row.pnlDollar) ? row.pnlDollar : 0) : tf_getHistoryNetPnlDollar(row);
pnlDollarNetCell.className = 'text-right mono ' + ((pnlDollarNet >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlDollarNetCell.className = 'text-right mono sl';
pnlDollarNetCell.textContent = formatMoney(pnlDollarNet || 0);
}
else if (priceBusy) {
pnlDollarNetCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlDollarNetCell.textContent = formatMoney(pnlDollarNet || 0);
}
tr.appendChild(pnlDollarNetCell);
const pnlPercentCell = tf_markHistoryCell(document.createElement('td'), 'pnlPercent');
pnlPercentCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlPercentCell.className = 'text-right mono sl';
pnlPercentCell.textContent = '—';
}
else if (priceBusy) {
pnlPercentCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlPercentCell.textContent = Number.isFinite(row.pnlPercent) ? (formatNumber(row.pnlPercent, 2) + '%') : '0%';
}
tr.appendChild(pnlPercentCell);
const pnlPercentNetCell = tf_markHistoryCell(document.createElement('td'), 'pnlPercentNet');
const pnlPercentNet = isWithdrawRow ? (Number.isFinite(row.pnlPercent) ? row.pnlPercent : 0) : tf_getHistoryNetPnlPercent(row);
pnlPercentNetCell.className = 'text-right mono ' + ((pnlDollarNet >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
pnlPercentNetCell.className = 'text-right mono sl';
pnlPercentNetCell.textContent = '—';
}
else if (priceBusy) {
pnlPercentNetCell.innerHTML = tf_spinnerHTML(true);
}
else {
pnlPercentNetCell.textContent = Number.isFinite(pnlPercentNet) ? (formatNumber(pnlPercentNet, 2) + '%') : '0%';
}
tr.appendChild(pnlPercentNetCell);
const swapCell = tf_markHistoryCell(document.createElement('td'), 'swapDollar');
swapCell.className = 'text-right mono sl';
if (isWithdrawRow) swapCell.textContent = '-';
else if (priceBusy) swapCell.innerHTML = tf_spinnerHTML(true);
else swapCell.textContent = formatMoney(Number.isFinite(Number(row.swapDollar)) ? Number(row.swapDollar) : 0);
tr.appendChild(swapCell);
const commCell = tf_markHistoryCell(document.createElement('td'), 'commDollar');
commCell.className = 'text-right mono sl';
if (isWithdrawRow) commCell.textContent = '-';
else if (priceBusy) commCell.innerHTML = tf_spinnerHTML(true);
else commCell.textContent = formatMoney(Number.isFinite(Number(row.commDollar)) ? Number(row.commDollar) : 0);
tr.appendChild(commCell);
const balanceCell = tf_markHistoryCell(document.createElement('td'), 'balancePnl');
balanceCell.className = 'text-right mono ' + ((tf_getHistoryNetPnlDollar(row) >= 0) ? 'tp' : 'sl');
if (isWithdrawRow) {
balanceCell.className = 'text-right mono sl';
balanceCell.textContent = Number.isFinite(row.balancePnl) ? formatMoney(row.balancePnl) : formatMoney(startingBalance || 0);
}
else if (priceBusy) {
balanceCell.innerHTML = tf_spinnerHTML(true);
}
else {
balanceCell.textContent = Number.isFinite(row.balancePnl) ? formatMoney(row.balancePnl) : formatMoney(startingBalance || 0);
}
tr.appendChild(balanceCell);
tbody.appendChild(tr);
});

// MOBILE V13: open on the newest trades at the bottom. Older chunks are
// prepended only when needed, without recalculating Table 3 or the dashboard.
try {
  const historyScrollBox = tbody.closest('.table-scroll');

  if (historyScrollBox) {
    historyScrollBox.dataset.tfMobileTotalRows = String(tfMobileHistoryTotalRows || 0);
    historyScrollBox.dataset.tfMobileRenderedStart = String(tfMobileHistoryRenderedStart || 0);

    if (!historyScrollBox.__tfMobileHistoryScrollInstalled) {
      historyScrollBox.__tfMobileHistoryScrollInstalled = true;

      historyScrollBox.addEventListener('scroll', () => {
        if (historyScrollBox.__tfMobileHistoryScrollRaf) return;
        historyScrollBox.__tfMobileHistoryScrollRaf = requestAnimationFrame(() => {
          historyScrollBox.__tfMobileHistoryScrollRaf = 0;
          if (historyScrollBox.__tfMobileHistoryScrollBusy) return;
          if (historyScrollBox.scrollTop > 140) return;
          if (tfMobileHistoryRenderedStart <= 0) return;

          const cachedRows = Array.isArray(tfMobileHistoryRowsCache)
            ? tfMobileHistoryRowsCache
            : [];
          const oldStart = tfMobileHistoryRenderedStart;
          const newStart = Math.max(0, oldStart - TF_MOBILE_HISTORY_CHUNK_SIZE);
          if (newStart >= oldStart || !cachedRows.length) return;

          historyScrollBox.__tfMobileHistoryScrollBusy = true;
          const oldScrollHeight = historyScrollBox.scrollHeight;
          const oldScrollTop = historyScrollBox.scrollTop;
          const oldScrollLeft = historyScrollBox.scrollLeft;
          const context = tfMobileHistoryRenderContext || {};
          const fragment = document.createDocumentFragment();

          try {
            if (newStart === 0) {
              fragment.appendChild(tfMobileCreateHistoryStartRow(
                context.startingBalance,
                context.riskMode
              ));
            }
            for (let i = newStart; i < oldStart; i++) {
              fragment.appendChild(tfMobileCreateHistoryRow(
                cachedRows[i],
                context.startingBalance,
                context.priceBusy
              ));
            }
            tbody.insertBefore(fragment, tbody.firstChild);
            tfMobileHistoryRenderedStart = newStart;
            tfMobileHistoryRenderLimit = tfMobileHistoryTotalRows - newStart;
            historyScrollBox.dataset.tfMobileRenderedStart = String(newStart);
            tf_applyHistoryColumnVisibility();
          }
          catch (e) { }

          requestAnimationFrame(() => {
            try {
              const addedHeight = historyScrollBox.scrollHeight - oldScrollHeight;
              historyScrollBox.scrollTop = oldScrollTop + Math.max(0, addedHeight);
              historyScrollBox.scrollLeft = oldScrollLeft;
            }
            catch (e) { }
            historyScrollBox.__tfMobileHistoryScrollBusy = false;
          });
        });
      }, { passive: true });
    }
  }
} catch (e) {}

try {
tf_applyHistoryColumnVisibility();
requestAnimationFrame(() => tf_applyHistoryColumnVisibility());
}
catch (e) { }
computeAndRenderDrawdownStats(rowsForCalc.filter(r => !r.isWithdraw));
try {
const allCb = document.getElementById('history-all-checkbox');
if (allCb) {
const ids = Array.isArray(tf_lastEligibleHistoryRowIds) ? tf_lastEligibleHistoryRowIds : [];
const total = ids.length;
let enabledCount = 0;
for (let i = 0; i < ids.length; i++) {
if (tf_isHistoryRowEnabled(ids[i]))
enabledCount++;
}
if (total === 0) {
allCb.indeterminate = false;
allCb.checked = true;
}
else if (enabledCount === 0) {
allCb.indeterminate = false;
allCb.checked = false;
}
else if (enabledCount === total) {
allCb.indeterminate = false;
allCb.checked = true;
}
else {
allCb.checked = true;
allCb.indeterminate = true;
}
}
}
catch (e) { }
lastHistoryRiskMode = riskMode;
lastHistoryRows = rowsForDisplay.slice();
updateEquityCurveFromRows(rowsForDisplay);
try {
tf_syncMonthlyTableToTradeRange();
}
catch (e) { }
applyHistoryTableScroll();
}
function updateEquityCurveFromRows(rows) {
const canvas = document.getElementById('equity-curve-canvas');
const emptyNote = document.getElementById('equity-empty-note');
const tooltip = document.getElementById('equity-tooltip');
if (!canvas) {
return;
}
try {
if (emptyNote && emptyNote.dataset && emptyNote.dataset.origHtml) {
emptyNote.innerHTML = emptyNote.dataset.origHtml;
}
}
catch (e) { }
if (tf_isMyfxbookPriceLoading() && equityMetric === 'usd') {
try {
const ctx = canvas.getContext('2d');
if (ctx) {
ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
}
}
catch (e) { }
if (emptyNote) {
try {
if (!emptyNote.dataset.origHtml) {
emptyNote.dataset.origHtml = emptyNote.innerHTML;
}
}
catch (e) { }
emptyNote.style.display = 'block';
emptyNote.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;gap:8px;">' + tf_spinnerHTML(true) + '<span>Loading price…</span></div>';
}
if (tooltip) {
tooltip.style.display = 'none';
}
return;
}
equityCurvePoints = [];
equityCompareCurvePoints = [];
equityCompareRows = [];
equityCompareCalcRows = [];
if (!rows || rows.length === 0) {
const ctx = canvas.getContext && canvas.getContext('2d');
if (ctx) {
ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
}
if (emptyNote) {
emptyNote.style.display = 'block';
}
if (tooltip) {
tooltip.style.display = 'none';
}
return;
}
const keys = rows
.map((row) => { const k = tf_getPrimarySortKey(row); return (typeof k === 'number' && isFinite(k) ? k : null); })
.filter((k) => k !== null);
if (!keys.length) {
const ctx = canvas.getContext && canvas.getContext('2d');
if (ctx) {
ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
}
if (emptyNote) {
emptyNote.style.display = 'block';
}
if (tooltip) {
tooltip.style.display = 'none';
}
return;
}
const minKey = Math.min.apply(null, keys);
const maxKey = Math.max.apply(null, keys);
equityFilterMin = minKey;
equityFilterMax = maxKey;
if (equityFilterStart === null || equityFilterStart < equityFilterMin || equityFilterStart > equityFilterMax) {
equityFilterStart = equityFilterMin;
}
if (equityFilterEnd === null || equityFilterEnd > equityFilterMax || equityFilterEnd < equityFilterMin) {
equityFilterEnd = equityFilterMax;
}
if (equityFilterEnd < equityFilterStart) {
equityFilterStart = equityFilterMin;
equityFilterEnd = equityFilterMax;
}
const startInput = document.getElementById('equity-start-date');
const endInput = document.getElementById('equity-end-date');
if (startInput && endInput) {
const minStr = formatDateInputFromSortKey(equityFilterMin);
const maxStr = formatDateInputFromSortKey(equityFilterMax);
startInput.min = minStr;
startInput.max = maxStr;
endInput.min = minStr;
endInput.max = maxStr;
startInput.value = formatDateInputFromSortKey(equityFilterStart);
endInput.value = formatDateInputFromSortKey(equityFilterEnd);
}
try {
tf_syncHistoryDateInputsFromState();
}
catch (e) { }
const startDayKey = parseDateInputToSortKey(formatDateInputFromSortKey(equityFilterStart));
const endDayKey = parseDateInputToSortKey(formatDateInputFromSortKey(equityFilterEnd));
const filteredRows = rows.filter((row) => {
const k = tf_getPrimarySortKey(row);
if (k === null)
return false;
const dOnly = parseDateInputToSortKey(formatDateInputFromSortKey(k));
if (startDayKey !== null && dOnly < startDayKey)
return false;
if (endDayKey !== null && dOnly > endDayKey)
return false;
return true;
});
const ctx = canvas.getContext && canvas.getContext('2d');
const __rowsEnabled = Array.isArray(filteredRows)
? filteredRows.filter((r) => tf_isHistoryRowEnabled(r))
: [];
let enabledRows = tf_applyStartTradeCreatedClosedRule(__rowsEnabled);
// REV289: PnL Pips is a pure pips model. Cash withdraw rows are dollar-only
// movements and must not create points, reset streaks, or affect any pips summary.
if (equityMetric === 'pips' && Array.isArray(enabledRows)) {
enabledRows = enabledRows.filter((r) => r && !r.isWithdraw);
}
// REV223: zero is a valid result, not "no data". During a single-month view,
// if every selected-month trade has zero PnL and the legacy Created/Closed
// boundary rule leaves no enabled rows, keep those zero-impact trades as a
// visualization-only flat equity series. They cannot change the balance.
if ((!enabledRows || enabledRows.length === 0) && tfTradeSingleMonthKey && Array.isArray(filteredRows)) {
const zeroImpactRows = filteredRows.filter((r) => {
if (!r || r.isWithdraw)
return false;
const pp = Number.isFinite(Number(r.pnlPips)) ? Number(r.pnlPips) : Number(r.pips || 0);
// REV289: in pure-pips mode, a zero-pips trade stays valid regardless of any
// dollar-side cost calculation. USD mode keeps the previous zero-impact rule.
if (equityMetric === 'pips') return pp === 0;
const pd = r.isWithdraw ? (Number.isFinite(Number(r.pnlDollar)) ? Number(r.pnlDollar) : 0) : tf_getHistoryNetPnlDollar(r);
return pp === 0 && pd === 0;
});
if (zeroImpactRows.length)
enabledRows = zeroImpactRows;
}
try {
tf_lastEquityCalcRows = Array.isArray(enabledRows) ? enabledRows.slice() : [];
}
catch (e) {
tf_lastEquityCalcRows = [];
}
if (!enabledRows.length) {
if (ctx) {
ctx.clearRect(0, 0, canvas.width || 0, canvas.height || 0);
}
if (emptyNote) {
emptyNote.style.display = 'block';
emptyNote.textContent = 'Tidak ada data history dalam rentang tanggal yang dipilih.';
}
if (tooltip) {
tooltip.style.display = 'none';
}
return;
}
if (emptyNote) {
emptyNote.style.display = 'none';
emptyNote.textContent = 'Belum ada data history untuk digambar. Import data dari TF Multi-Analyst Desktop.';
}
let equity = equityMetric === 'usd' ? (currentBalance || 0) : 0;
try {
const first = enabledRows[0] || null;
const firstKey = (first ? tf_getPrimarySortKey(first) : null);
equityCurvePoints.push({
index: 0,
sortKey: (firstKey !== null ? (firstKey - 1) : null),
date: (equityMetric === 'usd') ? 'Start Balance' : 'Start',
analyst: '',
pair: '',
dollarTP: 0,
dollarSL: 0,
pnlDollar: 0,
pnlPips: 0,
pnlPercent: 0,
pnlValue: 0,
equity: equity,
isStart: true
});
}
catch (e) { }
enabledRows.forEach((row, index) => {
const pnlDollar = row.isWithdraw ? (Number.isFinite(row.pnlDollar) ? row.pnlDollar : ((row.dollarTP || 0) - (row.dollarSL || 0))) : tf_getHistoryNetPnlDollar(row);
const pnlPips = typeof row.pnlPips === 'number' && isFinite(row.pnlPips) ? row.pnlPips : 0;
const pnlValue = equityMetric === 'usd' ? pnlDollar : pnlPips;
equity += pnlValue;
equityCurvePoints.push({
index: index + 1,
sortKey: tf_getPrimarySortKey(row),
date: (row.displayDate || row.createdDate || ''),
analyst: row.analyst || '',
pair: row.pair || '',
dollarTP: row.dollarTP || 0,
dollarSL: row.dollarSL || 0,
pnlDollar: pnlDollar,
pnlPips: pnlPips,
pnlPercent: row.isWithdraw ? (Number.isFinite(Number(row.pnlPercent)) ? Number(row.pnlPercent) : 0) : tf_getHistoryNetPnlPercent(row),
pnlValue: pnlValue,
equity: equity,
isWithdraw: !!row.isWithdraw
});
});
try {
equityDailyCandles = tf_buildEquityDailyCandlesFromPoints(equityCurvePoints);
if (equityChartMode === 'candle') {
if (equityCandleViewEnd === null)
tf_resetEquityCandleViewportToFull();
tf_clampEquityCandleViewport();
}
}
catch (e) {
equityDailyCandles = [];
}
try { tf_updateEquityCompareDataFromRows(rows); } catch (e) { equityCompareCurvePoints = []; }
drawEquityCurve();
computeAndRenderEquityDrawdownSummary();
try { tf_renderEquityCompareSummary(); } catch (e) { }
}
function applyEquityDateFilterFromInputs() {
const startInput = document.getElementById('equity-start-date');
const endInput = document.getElementById('equity-end-date');
if (!startInput || !endInput)
return;
if (equityFilterMin === null || equityFilterMax === null)
return;
const startVal = startInput.value;
const endVal = endInput.value;
if (!startVal || !endVal) {
alert('Mohon pilih tanggal mulai dan selesai.');
return;
}
let startKey = parseDateInputToSortKey(startVal);
let endKey = parseDateInputToSortKey(endVal);
if (startKey === null || endKey === null) {
alert('Format tanggal tidak valid.');
return;
}
if (startKey < equityFilterMin)
startKey = equityFilterMin;
if (startKey > equityFilterMax)
startKey = equityFilterMax;
if (endKey > equityFilterMax)
endKey = equityFilterMax;
if (endKey < equityFilterMin)
endKey = equityFilterMin;
if (endKey < startKey) {
alert('Tanggal akhir tidak boleh lebih kecil dari tanggal awal.');
return;
}
equityFilterStart = startKey;
equityFilterEnd = endKey;
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
if (Array.isArray(lastHistoryRows) && lastHistoryRows.length > 0) {
updateEquityCurveFromRows(lastHistoryRows);
}
}
}
function resetEquityDateFilterToFullRange() {
if (equityFilterMin === null || equityFilterMax === null) {
return;
}
equityFilterStart = equityFilterMin;
equityFilterEnd = equityFilterMax;
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
if (Array.isArray(lastHistoryRows) && lastHistoryRows.length > 0) {
updateEquityCurveFromRows(lastHistoryRows);
}
}
}
function applyHistoryDateFilterFromInputs() {
const startInput = document.getElementById('history-start-date');
const endInput = document.getElementById('history-end-date');
if (!startInput || !endInput) {
return applyEquityDateFilterFromInputs();
}
if (equityFilterMin === null || equityFilterMax === null) {
alert('Belum ada data history untuk menentukan range tanggal.');
return;
}
const startVal = (startInput.value || '').trim();
const endVal = (endInput.value || '').trim();
if (!startVal || !endVal) {
alert('Mohon pilih tanggal mulai dan selesai.');
return;
}
let startKey = parseDateInputToSortKey(startVal);
let endKey = parseDateInputToSortKey(endVal);
if (startKey === null || endKey === null) {
alert('Format tanggal tidak valid.');
return;
}
if (startKey < equityFilterMin)
startKey = equityFilterMin;
if (startKey > equityFilterMax)
startKey = equityFilterMax;
if (endKey > equityFilterMax)
endKey = equityFilterMax;
if (endKey < equityFilterMin)
endKey = equityFilterMin;
if (endKey < startKey) {
alert('Tanggal akhir tidak boleh lebih kecil dari tanggal awal.');
return;
}
equityFilterStart = startKey;
equityFilterEnd = endKey;
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) {
if (Array.isArray(lastHistoryRows) && lastHistoryRows.length > 0) {
updateEquityCurveFromRows(lastHistoryRows);
}
}
}
function resetHistoryDateFilterToFullRange() {
return resetEquityDateFilterToFullRange();
}
function drawEquityCurve() {
const canvas = document.getElementById('equity-curve-canvas');
if (!canvas || !canvas.getContext)
return;
const ctx = canvas.getContext('2d');
const wrapper = canvas.parentElement;
if (!wrapper)
return;
const width = wrapper.clientWidth || 0;
// REV322 mobile: user requested the Equity chart to be ~2x taller than REV321.
// Keep it responsive in both portrait and landscape without forcing a page reload.
const tfEqLandscape = (window.innerWidth || 0) > (window.innerHeight || 0);
const tfEqViewportH = Math.max(320, window.innerHeight || 640);
const baseHeight = tfEqLandscape
? Math.max(264, Math.min(300, Math.round(tfEqViewportH * 0.72)))
: Math.max(336, Math.min(380, Math.round(tfEqViewportH * 0.44)));
if (!width)
return;
const dpr = window.devicePixelRatio || 1;
canvas.width = width * dpr;
canvas.height = baseHeight * dpr;
canvas.style.width = width + 'px';
canvas.style.height = baseHeight + 'px';
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
ctx.clearRect(0, 0, width, baseHeight);
if (!equityCurvePoints.length)
return;
const paddingLeft = 48;
const paddingRight = tf_getEquityPaddingRight();
const tfEqCompact = baseHeight < 210;
const paddingTop = tfEqCompact ? 11 : 18;
const paddingBottom = tfEqCompact ? 30 : 44;
const chartWidth = width - paddingLeft - paddingRight;
const chartHeight = baseHeight - paddingTop - paddingBottom;
if (chartWidth <= 0 || chartHeight <= 0)
return;
const isCandleMode = (equityChartMode === 'candle');
// REV340: Line Chart and Candle Stick both use the ACTUAL account balance.
// The USD Y-axis starts exactly $1,000 below the initial balance entered in
// Table 1. Examples: $5,000 -> $4,000 floor, $10,000 -> $9,000 floor.
const tfEqStartBalanceV340 = (equityCurvePoints[0] && Number.isFinite(Number(equityCurvePoints[0].equity)))
  ? Number(equityCurvePoints[0].equity)
  : (Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : 0);
const tfEqAxisFloorV340 = tfEqStartBalanceV340 - 1000;
// Compatibility names retained for downstream candle drawing/tooltip code.
// REV340 uses absolute values, so zero-baseline conversion is disabled.
const tfCandleZeroUsdV338 = false;
const tfCandleStartBalanceV338 = tfEqStartBalanceV340;
function tf_candleDisplayValueV338(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
let minYRaw = Infinity;
let maxYRaw = -Infinity;
let candleView = null;
if (isCandleMode) {
const candles = Array.isArray(equityDailyCandles) ? equityDailyCandles : [];
if (candles.length) {
try {
tf_clampEquityCandleViewport();
}
catch (e) { }
const s = Math.max(0, Math.min(candles.length - 1, equityCandleViewStart || 0));
const e = (equityCandleViewEnd === null) ? (candles.length - 1) : Math.max(0, Math.min(candles.length - 1, equityCandleViewEnd));
candleView = { candles: candles, start: s, end: e };
// REV343: adaptive-height Candle D1 zoom behavior.
// REV342: restore flexible Candle D1 zoom behavior. The visible viewport
// drives the candle scale again, so a shorter zoom window behaves like a
// shorter Time Range instead of keeping the full-history candle scale.
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const lo = tf_candleDisplayValueV338(c.low);
const hi = tf_candleDisplayValueV338(c.high);
if (isFinite(lo))
minYRaw = Math.min(minYRaw, lo);
if (isFinite(hi))
maxYRaw = Math.max(maxYRaw, hi);
const o = tf_candleDisplayValueV338(c.open);
const cl = tf_candleDisplayValueV338(c.close);
if (isFinite(o)) {
minYRaw = Math.min(minYRaw, o);
maxYRaw = Math.max(maxYRaw, o);
}
if (isFinite(cl)) {
minYRaw = Math.min(minYRaw, cl);
maxYRaw = Math.max(maxYRaw, cl);
}
}
}
}
if (!isFinite(minYRaw) || !isFinite(maxYRaw)) {
for (let i = 0; i < equityCurvePoints.length; i++) {
const v = Number(equityCurvePoints[i] && equityCurvePoints[i].equity);
if (!isFinite(v))
continue;
minYRaw = Math.min(minYRaw, v);
maxYRaw = Math.max(maxYRaw, v);
}
}
let compareMinYRaw = Infinity;
let compareMaxYRaw = -Infinity;
const compareActive = !isCandleMode && tf_isEquityCompareActive();
if (compareActive) {
for (let i = 0; i < equityCompareCurvePoints.length; i++) {
const v = Number(equityCompareCurvePoints[i] && equityCompareCurvePoints[i].equity);
if (!isFinite(v)) continue;
compareMinYRaw = Math.min(compareMinYRaw, v);
compareMaxYRaw = Math.max(compareMaxYRaw, v);
}
}
if (!isFinite(minYRaw) || !isFinite(maxYRaw)) return;

// When both lines use the same unit (USD vs USD), use one shared ACTUAL-value
// scale. Independent axes make equal screen heights represent unequal money,
// which is visually misleading. If the magnitude gap is large, a symmetric
// logarithmic transform keeps both growth curves visible while every tick and
// tooltip still displays the original dollar value.
const compareSameMetric = compareActive && equityCompareMetric === equityMetric &&
isFinite(compareMinYRaw) && isFinite(compareMaxYRaw);
if (compareSameMetric) {
minYRaw = Math.min(minYRaw, compareMinYRaw);
maxYRaw = Math.max(maxYRaw, compareMaxYRaw);
}
if (minYRaw === maxYRaw) {
const delta = Math.max(10, Math.abs(minYRaw) * 0.02);
minYRaw -= delta;
maxYRaw += delta;
}

let useSharedActualLogScale = false;
let sharedLogConstant = 1;
if (compareSameMetric) {
const allAbs = [];
const collectAbs = (arr) => {
(Array.isArray(arr) ? arr : []).forEach((point) => {
const v = Math.abs(Number(point && point.equity));
if (Number.isFinite(v) && v > 0) allAbs.push(v);
});
};
collectAbs(equityCurvePoints);
collectAbs(equityCompareCurvePoints);
if (allAbs.length) {
const maxAbs = Math.max.apply(null, allAbs);
const minAbs = Math.max(0.01, Math.min.apply(null, allAbs));
const startAbs = Math.abs(Number(currentBalance)) || minAbs;
const magnitudeRatio = maxAbs / minAbs;
useSharedActualLogScale = magnitudeRatio >= 25;
// REV171: use a wider linear region so per-trade fluctuations are not
// over-amplified into a "worm-like" curve. Values, ticks, tooltips and
// summaries remain the original actual amounts; only the display compression
// becomes gentler when the two USD series have a very large magnitude gap.
sharedLogConstant = Math.max(0.01, minAbs, startAbs, maxAbs / 100);
}
}
function toT(v) {
const n = Number(v);
if (!Number.isFinite(n)) return 0;
if (!useSharedActualLogScale) return n;
return Math.sign(n) * Math.log1p(Math.abs(n) / sharedLogConstant);
}
function fromT(t) {
const n = Number(t);
if (!Number.isFinite(n)) return 0;
if (!useSharedActualLogScale) return n;
return Math.sign(n) * sharedLogConstant * Math.expm1(Math.abs(n));
}
// REV340: USD chart floor follows the INPUT START BALANCE, not zero.
// Keep a fixed $1,000 visual gap below starting capital for BOTH Line Chart
// and Candle Stick while letting the upper bound expand with the dataset.
// The axis uses $1,000 increments for a stable, predictable money scale.
if (equityMetric === 'usd') useSharedActualLogScale = false;
let tMin = toT(minYRaw);
let tMax = toT(maxYRaw);
if (equityMetric === 'usd' && !useSharedActualLogScale) {
  const compareTopV340 = (compareSameMetric && Number.isFinite(compareMaxYRaw)) ? Number(compareMaxYRaw) : -Infinity;
  const rawTopV340 = Math.max(Number(maxYRaw) || 0, compareTopV340, tfEqStartBalanceV340);
  const spanV340 = Math.max(1000, rawTopV340 - tfEqAxisFloorV340);
  const stepV340 = Math.max(1000, Math.ceil((spanV340 / 4) / 1000) * 1000);
  const globalMinV343 = tfEqAxisFloorV340;
  const globalMaxV343 = tfEqAxisFloorV340 + stepV340 * 4;

  // REV343: Candle D1 uses a progressive AUTO-FIT Y scale while zooming.
  // Full-range view still honors the Balance - $1,000 baseline requested by
  // the user. As the viewport is zoomed in, the Y scale smoothly transitions
  // toward the visible OHLC range. This prevents candles becoming flatter as
  // the user zooms into a shorter date window.
  if (isCandleMode && candleView && candleView.candles && candleView.candles.length) {
    const totalCandleV343 = Math.max(1, candleView.candles.length);
    const visibleCandleV343 = Math.max(1, candleView.end - candleView.start + 1);
    const visibleRatioV343 = Math.max(0, Math.min(1, visibleCandleV343 / totalCandleV343));
    const localLoV343 = Number(minYRaw);
    const localHiV343 = Number(maxYRaw);
    const localSpanV343 = Math.max(1, localHiV343 - localLoV343);
    // At least a small money padding, but primarily follow visible volatility.
    const localPadV343 = Math.max(40, localSpanV343 * 0.10);
    let localMinV343 = localLoV343 - localPadV343;
    let localMaxV343 = localHiV343 + localPadV343;
    if (!(localMaxV343 > localMinV343)) {
      localMinV343 = localLoV343 - 100;
      localMaxV343 = localHiV343 + 100;
    }
    // Smoothly blend from global scale to local scale over the first ~45%
    // of zoom so there is no abrupt axis jump after the first pinch gesture.
    const zoomBlendV343 = Math.max(0, Math.min(1, (1 - visibleRatioV343) / 0.45));
    tMin = globalMinV343 * (1 - zoomBlendV343) + localMinV343 * zoomBlendV343;
    tMax = globalMaxV343 * (1 - zoomBlendV343) + localMaxV343 * zoomBlendV343;
    if (!(tMax > tMin)) {
      tMin = localMinV343;
      tMax = localMaxV343;
    }
  } else {
    tMin = globalMinV343;
    tMax = globalMaxV343;
  }
} else if (tMin === tMax) {
  const d = Math.max(1, Math.abs(tMin) * 0.02);
  tMin -= d;
  tMax += d;
} else {
  const padT = (tMax - tMin) * 0.08;
  tMin -= padT;
  tMax += padT;
}
window.TF_EQUITY_COMPARE_SCALE_INFO = {
mode: compareSameMetric ? (useSharedActualLogScale ? 'shared-actual-log' : 'shared-actual-linear') : (compareActive ? 'dual-unit' : 'primary-only'),
logConstant: sharedLogConstant,
primaryMin: minYRaw,
primaryMax: maxYRaw,
secondaryMin: compareMinYRaw,
secondaryMax: compareMaxYRaw
};
function yForVal(v) {
if (tMax === tMin) return paddingTop + chartHeight / 2;
const tv = toT(v);
const tt = (tv - tMin) / (tMax - tMin);
return paddingTop + (1 - tt) * chartHeight;
}

// Different units (Pips vs USD) still require independent axes. Same-unit
// comparisons deliberately reuse yForVal so screen position remains actual.
let compareScaleMin = compareMinYRaw;
let compareScaleMax = compareMaxYRaw;
if (!compareSameMetric) {
if (isFinite(compareScaleMin) && isFinite(compareScaleMax) && compareScaleMin === compareScaleMax) {
const d = Math.max(10, Math.abs(compareScaleMin) * 0.02);
compareScaleMin -= d;
compareScaleMax += d;
} else if (isFinite(compareScaleMin) && isFinite(compareScaleMax)) {
const d = (compareScaleMax - compareScaleMin) * 0.08;
compareScaleMin -= d;
compareScaleMax += d;
}
}
function yForCompareVal(v) {
if (compareSameMetric) return yForVal(v);
if (!isFinite(compareScaleMin) || !isFinite(compareScaleMax) || compareScaleMin === compareScaleMax)
return paddingTop + chartHeight / 2;
const tt = (Number(v) - compareScaleMin) / (compareScaleMax - compareScaleMin);
return paddingTop + (1 - tt) * chartHeight;
}
// REV171: keep the horizontal axis based on trade progression, as in the
// original smooth Equity Curve. Mapping every point directly to wall-clock
// timestamps caused trades that closed close together to stack vertically and
// made the line look tangled. Primary and Secondary still follow the exact
// same ordered trade base and retain their actual Y values.
function xForIndex(i) {
if (equityCurvePoints.length <= 1) return paddingLeft + chartWidth / 2;
return paddingLeft + (i / (equityCurvePoints.length - 1)) * chartWidth;
}
function xForCompareIndex(i) {
if (equityCompareCurvePoints.length <= 1) return paddingLeft + chartWidth / 2;
return paddingLeft + (i / (equityCompareCurvePoints.length - 1)) * chartWidth;
}
ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
ctx.lineWidth = 1;
ctx.setLineDash([4, 4]);
ctx.font = '10px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
ctx.fillStyle = '#9ca3af';
const steps = 4;
for (let i = 0; i <= steps; i++) {
const t = i / steps;
const tVal = tMin + (tMax - tMin) * t;
const value = fromT(tVal);
const y = yForVal(value);
ctx.beginPath();
ctx.moveTo(paddingLeft, y);
ctx.lineTo(width - paddingRight, y);
ctx.stroke();
const text = formatEquityMetricAxis(value);
ctx.fillText(text, 4, y + 3);
}
// REV340 compatibility block: zero-origin guide is disabled because USD charts use actual balance values.
if (tfCandleZeroUsdV338) {
  const zeroYV338 = yForVal(0);
  ctx.save();
  ctx.setLineDash([2, 3]);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.72)';
  ctx.lineWidth = 1.25;
  ctx.beginPath();
  ctx.moveTo(paddingLeft, zeroYV338);
  ctx.lineTo(width - paddingRight, zeroYV338);
  ctx.stroke();
  ctx.restore();
}
ctx.setLineDash([]);
if (!isCandleMode && tf_isEquityCompareActive() && !compareSameMetric && isFinite(compareScaleMin) && isFinite(compareScaleMax)) {
ctx.save();
ctx.font = '10px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
ctx.fillStyle = TF_EQUITY_COMPARE_SECONDARY_COLOR;
ctx.textAlign = 'right';
for (let i = 0; i <= steps; i++) {
const t = i / steps;
const value = compareScaleMin + (compareScaleMax - compareScaleMin) * t;
const y = yForCompareVal(value);
const text = equityCompareMetric === 'usd' ? formatMoney(value) : formatPips(value, 1);
ctx.fillText(text, width - 4, y + 3);
}
ctx.restore();
}
if (isCandleMode && candleView && candleView.candles && candleView.candles.length) {
try {
const candles = candleView.candles;
const s = candleView.start;
const e = candleView.end;
const visCount = Math.max(1, e - s + 1);
// REV342: D1 candles use a viewport-relative slot width. This is deliberately
// flexible: more visible days => smaller candles; zooming in => fewer visible
// days => wider candles. When a 2M/3M/... view is zoomed down to roughly the
// same visible day count as 1M, the candle width converges to the 1M size.
const stepX = chartWidth / visCount;
let candleW = stepX * 0.78;
const maxW = Math.min(24, stepX * 0.92);
// REV343: keep long-range candles visible, but never let width exceed its slot.
// Zooming in naturally increases stepX, so body width grows continuously.
const minReadableW343 = Math.min(1.45, stepX * 0.88);
const minW = Math.min(Math.max(minReadableW343, stepX * 0.30), stepX * 0.92);
candleW = Math.max(minW, Math.min(maxW, candleW));
// Vertical minimums are DISPLAY-ONLY legibility guards. Tooltip/OHLC values
// remain untouched. They are derived from stepX so zoom-in enlarges both
// width and height, while long time ranges remain compact.
const candleZoomStrengthV343 = Math.max(0, Math.min(1, (stepX - 1.35) / 10.5));
const minBodyPxV343 = 3.0 + candleZoomStrengthV343 * 6.0;
const minWickPxV343 = 6.0 + candleZoomStrengthV343 * 12.0;
function xForCandleAbsIndex(absIdx) {
const j = absIdx - s;
return paddingLeft + stepX * (j + 0.5);
}
function xForCandleCloseAbsIndex(absIdx) {
return xForCandleAbsIndex(absIdx);
}
equityCandleDrawMetrics = {
paddingLeft: paddingLeft,
paddingRight: paddingRight,
paddingTop: paddingTop,
paddingBottom: paddingBottom,
chartWidth: chartWidth,
chartHeight: chartHeight,
viewStart: s,
viewEnd: e,
stepX: stepX,
visCount: visCount,
candleZeroBaseline: tfCandleStartBalanceV338,
displayMode: tfCandleZeroUsdV338 ? 'net-from-start-zero' : 'absolute',
flexibleCandleWidth: candleW,
zoomSizingMode: 'visible-d1-count-plus-adaptive-height-v343',
minBodyPx: minBodyPxV343,
minWickPx: minWickPxV343
};
try {
const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const marks = [];
let prevKey = null;
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c || !c.dayTs)
continue;
const d = new Date(c.dayTs);
const key = d.getFullYear() + '-' + d.getMonth();
if (prevKey === null || key !== prevKey) {
prevKey = key;
marks.push({ idx: i, date: d });
}
}
if (marks.length) {
ctx.save();
ctx.strokeStyle = 'rgba(255,255,255,0.25)';
ctx.lineWidth = 1;
ctx.setLineDash([3, 4]);
marks.forEach((m) => {
const x = xForCandleAbsIndex(m.idx);
ctx.beginPath();
ctx.moveTo(x, paddingTop);
ctx.lineTo(x, paddingTop + chartHeight);
ctx.stroke();
});
ctx.restore();
ctx.save();
ctx.setLineDash([]);
ctx.font = '9px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.70)';
ctx.textAlign = 'center';
ctx.textBaseline = 'alphabetic';
const labelY1 = paddingTop + chartHeight + 14;
const labelY2 = labelY1 + 10;
let lastX = -1e9;
marks.forEach((m) => {
const x = xForCandleAbsIndex(m.idx);
if (x - lastX < 42)
return;
lastX = x;
const mo = monthNames[m.date.getMonth()] || '';
const yy = String(m.date.getFullYear());
ctx.fillText(mo, x, labelY1);
ctx.fillText(yy, x, labelY2);
});
ctx.restore();
}
}
catch (e) { }
ctx.save();
ctx.setLineDash([]);
ctx.lineWidth = 1.2;
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const xC = xForCandleAbsIndex(i);
const openYRawV343 = yForVal(tf_candleDisplayValueV338(c.open));
const closeYRawV343 = yForVal(tf_candleDisplayValueV338(c.close));
const highYRawV343 = yForVal(tf_candleDisplayValueV338(c.high));
const lowYRawV343 = yForVal(tf_candleDisplayValueV338(c.low));
const isUp = (Number(c.close) >= Number(c.open));
ctx.strokeStyle = isUp ? '#22c55e' : '#ef4444';
ctx.fillStyle = isUp ? '#22c55e' : '#ef4444';

// REV343: preserve actual OHLC mapping, but enforce a zoom-aware minimum
// visual wick/body height when real daily movement is only a few screen pixels.
// This solves the mobile case where candles looked flat even after zooming in.
let wickTopV343 = Math.min(highYRawV343, lowYRawV343);
let wickBotV343 = Math.max(highYRawV343, lowYRawV343);
let wickHV343 = wickBotV343 - wickTopV343;
if (wickHV343 < minWickPxV343) {
  const wickMidV343 = (wickTopV343 + wickBotV343) / 2;
  wickTopV343 = wickMidV343 - minWickPxV343 / 2;
  wickBotV343 = wickMidV343 + minWickPxV343 / 2;
}
wickTopV343 = Math.max(paddingTop, wickTopV343);
wickBotV343 = Math.min(paddingTop + chartHeight, wickBotV343);
ctx.beginPath();
ctx.moveTo(xC, wickTopV343);
ctx.lineTo(xC, wickBotV343);
ctx.stroke();

let topY = Math.min(openYRawV343, closeYRawV343);
let botY = Math.max(openYRawV343, closeYRawV343);
let bodyH = botY - topY;
if (bodyH < minBodyPxV343) {
  const bodyMidV343 = (topY + botY) / 2;
  topY = bodyMidV343 - minBodyPxV343 / 2;
  botY = bodyMidV343 + minBodyPxV343 / 2;
  bodyH = minBodyPxV343;
}
topY = Math.max(paddingTop, topY);
botY = Math.min(paddingTop + chartHeight, botY);
bodyH = Math.max(1.5, botY - topY);
ctx.beginPath();
ctx.rect(xC - candleW / 2, topY, candleW, bodyH);
ctx.fill();
ctx.stroke();
}
ctx.restore();
ctx.save();
ctx.beginPath();
let tfCandlePathMovedV341 = false;
// On the full view, anchor the candle close curve at the exact same starting
// balance/X origin used by LINE Chart.
if (s === 0 && equityCurvePoints[0] && Number.isFinite(Number(equityCurvePoints[0].equity))) {
ctx.moveTo(paddingLeft, yForVal(Number(equityCurvePoints[0].equity)));
tfCandlePathMovedV341 = true;
}
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const x = xForCandleCloseAbsIndex(i);
const y = yForVal(tf_candleDisplayValueV338(c.close));
if (!tfCandlePathMovedV341) {
ctx.moveTo(x, y);
tfCandlePathMovedV341 = true;
} else {
ctx.lineTo(x, y);
}
}
ctx.strokeStyle = 'rgba(56, 189, 248, 0.60)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.restore();
// Show the actual ending value for both series in the right margin. These
// labels are never normalized; they come directly from the final curve point.
if (!isCandleMode && tf_isEquityCompareActive()) {
try {
const findLastFinite = (arr) => {
for (let i = (Array.isArray(arr) ? arr.length : 0) - 1; i >= 0; i--) {
const p = arr[i];
if (p && Number.isFinite(Number(p.equity))) return { point: p, index: i };
}
return null;
};
const primaryEnd = findLastFinite(equityCurvePoints);
const secondaryEnd = findLastFinite(equityCompareCurvePoints);
if (primaryEnd && secondaryEnd) {
let py = yForVal(Number(primaryEnd.point.equity));
let sy = yForCompareVal(Number(secondaryEnd.point.equity));
let pyText = py;
let syText = sy;
if (Math.abs(pyText - syText) < 16) {
pyText = Math.max(paddingTop + 8, pyText - 8);
syText = Math.min(paddingTop + chartHeight - 4, syText + 8);
}
const primaryValueText = equityMetric === 'usd'
? formatMoney(Number(primaryEnd.point.equity))
: formatPips(Number(primaryEnd.point.equity), 1);
const secondaryValueText = equityCompareMetric === 'usd'
? formatMoney(Number(secondaryEnd.point.equity))
: formatPips(Number(secondaryEnd.point.equity), 1);
ctx.save();
ctx.font = 'bold 9px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
ctx.textAlign = 'right';
ctx.textBaseline = 'middle';
const endpointX = paddingLeft + chartWidth;
if (compareSameMetric) {
// Same-unit Compare uses the full chart width. Keep only compact P/S markers
// inside the plot so endpoint labels do not create an artificial empty strip.
ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
ctx.fillRect(endpointX - 20, pyText - 7, 18, 13);
ctx.fillRect(endpointX - 20, syText - 7, 18, 13);
ctx.fillStyle = TF_EQUITY_COMPARE_PRIMARY_COLOR;
ctx.fillText('P', endpointX - 6, pyText);
ctx.fillStyle = TF_EQUITY_COMPARE_SECONDARY_COLOR;
ctx.fillText('S', endpointX - 6, syText);
} else {
// Different units retain a dedicated right axis and enough margin for the
// actual ending values of both series.
ctx.strokeStyle = TF_EQUITY_COMPARE_PRIMARY_COLOR;
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(endpointX, py);
ctx.lineTo(width - 6, pyText);
ctx.stroke();
ctx.fillStyle = TF_EQUITY_COMPARE_PRIMARY_COLOR;
ctx.fillText('P ' + primaryValueText, width - 6, pyText);
ctx.strokeStyle = TF_EQUITY_COMPARE_SECONDARY_COLOR;
ctx.beginPath();
ctx.moveTo(endpointX, sy);
ctx.lineTo(width - 6, syText);
ctx.stroke();
ctx.fillStyle = TF_EQUITY_COMPARE_SECONDARY_COLOR;
ctx.fillText('S ' + secondaryValueText, width - 6, syText);
}
ctx.restore();
}
}
catch (e) { }
}

if (equityCrosshairX !== null && equityCrosshairY !== null) {
const cx = equityCrosshairX;
const cy = equityCrosshairY;
ctx.beginPath();
ctx.moveTo(cx, paddingTop);
ctx.lineTo(cx, paddingTop + chartHeight);
ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.beginPath();
ctx.moveTo(paddingLeft, cy);
ctx.lineTo(paddingLeft + chartWidth, cy);
ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
ctx.lineWidth = 1;
ctx.stroke();
}
if (equityCandleHoverIndex !== null && equityCandleHoverIndex >= s && equityCandleHoverIndex <= e) {
const c = candles[equityCandleHoverIndex];
if (c) {
const x = xForCandleAbsIndex(equityCandleHoverIndex);
const y = yForVal(tf_candleDisplayValueV338(c.close));
ctx.beginPath();
ctx.arc(x, y, 4, 0, Math.PI * 2);
ctx.fillStyle = '#38bdf8';
ctx.fill();
ctx.strokeStyle = '#0ea5e9';
ctx.lineWidth = 1.5;
ctx.stroke();
}
}
}
catch (e) { }
return;
}
function tf_parseEquityPointTs(pt) {
try {
if (!pt)
return null;
if (typeof pt.sortKey === 'number' && isFinite(pt.sortKey))
return pt.sortKey;
const raw = String(pt.date || pt.displayDate || '').trim();
if (!raw)
return null;
const parsed = Date.parse(raw);
if (!isNaN(parsed))
return parsed;
const s = raw.replace(/\s*(WIB\s*)+$/i, '').trim();
const mm = /^(\d{2})-(\d{2})-(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/.exec(s);
if (mm) {
const dd = parseInt(mm[1], 10);
const mo = parseInt(mm[2], 10);
const yy = parseInt(mm[3], 10);
const hh = mm[4] ? parseInt(mm[4], 10) : 0;
const mi = mm[5] ? parseInt(mm[5], 10) : 0;
if (dd && mo && yy)
return new Date(yy, mo - 1, dd, hh || 0, mi || 0).getTime();
}
return null;
}
catch (e) {
return null;
}
}
const tf_monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const monthMarkers = [];
let prevMonthKey = null;
for (let i = 0; i < equityCurvePoints.length; i++) {
const ts = tf_parseEquityPointTs(equityCurvePoints[i]);
if (!ts)
continue;
const d = new Date(ts);
const key = d.getFullYear() + '-' + d.getMonth();
if (prevMonthKey === null) {
prevMonthKey = key;
monthMarkers.push({ idx: i, date: d });
}
else if (key !== prevMonthKey) {
prevMonthKey = key;
monthMarkers.push({ idx: i, date: d });
}
}
if (monthMarkers.length > 0) {
ctx.save();
ctx.strokeStyle = 'rgba(255,255,255,0.25)';
ctx.lineWidth = 1;
ctx.setLineDash([3, 4]);
for (const m of monthMarkers) {
const x = xForIndex(m.idx);
ctx.beginPath();
ctx.moveTo(x, paddingTop);
ctx.lineTo(x, paddingTop + chartHeight);
ctx.stroke();
}
ctx.restore();
ctx.save();
ctx.setLineDash([]);
ctx.font = '9px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
ctx.fillStyle = 'rgba(255,255,255,0.70)';
ctx.textAlign = 'center';
ctx.textBaseline = 'alphabetic';
const labelY1 = paddingTop + chartHeight + 14;
const labelY2 = labelY1 + 10;
let lastLabelX = -1e9;
for (const m of monthMarkers) {
const x = xForIndex(m.idx);
if (x - lastLabelX < 36)
continue;
lastLabelX = x;
const mo = tf_monthNamesShort[m.date.getMonth()] || '';
const yy = String(m.date.getFullYear());
ctx.fillText(mo, x, labelY1);
ctx.fillText(yy, x, labelY2);
}
ctx.restore();
}
if (equityChartMode === 'candle') {
try {
const candles = [];
let cur = null;
for (let i = 1; i < equityCurvePoints.length; i++) {
const p = equityCurvePoints[i];
const ts = tf_parseEquityPointTs(p);
if (!ts)
continue;
const d = new Date(ts);
const dayKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
const prev = equityCurvePoints[i - 1];
const prevEquity = prev && typeof prev.equity === 'number' && isFinite(prev.equity) ? prev.equity : null;
const nowEquity = p && typeof p.equity === 'number' && isFinite(p.equity) ? p.equity : null;
if (!cur || cur.dayKey !== dayKey) {
const open = prevEquity !== null ? prevEquity : (nowEquity !== null ? nowEquity : 0);
const first = nowEquity !== null ? nowEquity : open;
cur = {
dayKey: dayKey,
startIdx: i,
endIdx: i,
open: open,
high: Math.max(open, first),
low: Math.min(open, first),
close: first
};
candles.push(cur);
}
else {
const v = nowEquity !== null ? nowEquity : cur.close;
cur.endIdx = i;
cur.close = v;
if (v > cur.high)
cur.high = v;
if (v < cur.low)
cur.low = v;
}
}
if (candles.length) {
ctx.save();
ctx.setLineDash([]);
ctx.lineWidth = 1;
candles.forEach((c) => {
const xStart = xForIndex(c.startIdx);
const xEnd = xForIndex(c.endIdx);
const xC = (xStart + xEnd) / 2;
const openY = yForVal(Math.max(0, tf_candleDisplayValueV338(c.open)));
const closeY = yForVal(Math.max(0, tf_candleDisplayValueV338(c.close)));
const highY = yForVal(Math.max(0, tf_candleDisplayValueV338(c.high)));
const lowY = yForVal(Math.max(0, tf_candleDisplayValueV338(c.low)));
const isUp = c.close >= c.open;
ctx.strokeStyle = isUp ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)';
ctx.fillStyle = isUp ? 'rgba(34, 197, 94, 0.28)' : 'rgba(239, 68, 68, 0.28)';
ctx.beginPath();
ctx.moveTo(xC, highY);
ctx.lineTo(xC, lowY);
ctx.stroke();
const topY = Math.min(openY, closeY);
const botY = Math.max(openY, closeY);
const bodyH = Math.max(1.5, botY - topY);
let bodyW = Math.abs(xEnd - xStart) * 0.7;
if (!isFinite(bodyW))
bodyW = 0;
bodyW = Math.max(4, Math.min(22, bodyW));
const left = xC - bodyW / 2;
ctx.beginPath();
ctx.rect(left, topY, bodyW, bodyH);
ctx.fill();
ctx.stroke();
});
ctx.restore();
}
}
catch (e) { }
}
ctx.beginPath();
equityCurvePoints.forEach((p, idx) => {
const x = xForIndex(idx);
const y = yForVal(p.equity);
if (idx === 0)
ctx.moveTo(x, y);
else
ctx.lineTo(x, y);
});
ctx.strokeStyle = (equityChartMode === 'candle') ? 'rgba(56, 189, 248, 0.65)' : TF_EQUITY_COMPARE_PRIMARY_COLOR;
ctx.lineWidth = (equityChartMode === 'candle') ? 1.2 : 2;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.stroke();
// REV223: make an all-zero selected month unmistakably visible as a flat
// equity line. Small neutral/cyan points show the zero-result trades without
// implying profit or loss.
try {
if (!isCandleMode && equityCurvePoints.length > 1) {
const baseEq = Number(equityCurvePoints[0] && equityCurvePoints[0].equity);
const flatZero = Number.isFinite(baseEq) && equityCurvePoints.every((p, idx) => {
const eq = Number(p && p.equity);
const pv = idx === 0 ? 0 : Number(p && p.pnlValue);
return Number.isFinite(eq) && Math.abs(eq - baseEq) < 1e-9 && Number.isFinite(pv) && Math.abs(pv) < 1e-9;
});
if (flatZero) {
ctx.save();
ctx.fillStyle = TF_EQUITY_COMPARE_PRIMARY_COLOR;
for (let i = 1; i < equityCurvePoints.length; i++) {
const x = xForIndex(i);
const y = yForVal(equityCurvePoints[i].equity);
ctx.beginPath();
ctx.arc(x, y, 2.5, 0, Math.PI * 2);
ctx.fill();
}
ctx.restore();
}
}
}
catch (e) { }
if (!isCandleMode && tf_isEquityCompareActive()) {
ctx.save();
ctx.beginPath();
for (let i = 0; i < equityCompareCurvePoints.length; i++) {
const p = equityCompareCurvePoints[i];
if (!p || !Number.isFinite(Number(p.equity))) continue;
const x = xForCompareIndex(i);
const y = yForCompareVal(Number(p.equity));
if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
}
ctx.strokeStyle = TF_EQUITY_COMPARE_SECONDARY_COLOR;
ctx.lineWidth = 2.2;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.setLineDash([]);
ctx.stroke();
ctx.restore();
}
(function drawEquityHighlights() {
if (!Array.isArray(equityCurvePoints) || equityCurvePoints.length < 2)
return;
let peakEquity = null;
let peakIdx = 0;
let maxDd = 0;
let ddPeakIdx = 0;
let ddTroughIdx = 0;
for (let i = 0; i < equityCurvePoints.length; i++) {
const p = equityCurvePoints[i];
const e = p && typeof p.equity === 'number' ? p.equity : null;
if (e === null || !isFinite(e))
continue;
if (peakEquity === null) {
peakEquity = e;
peakIdx = i;
ddPeakIdx = i;
ddTroughIdx = i;
continue;
}
if (e > peakEquity) {
peakEquity = e;
peakIdx = i;
}
const dd = e - peakEquity;
if (dd < maxDd) {
maxDd = dd;
ddPeakIdx = peakIdx;
ddTroughIdx = i;
}
}
let bestStart = -1;
let bestEnd = -1;
let maxLen = 0;
let bestLossSum = 0;
let curStart = -1;
let curLen = 0;
let curLoss = 0;
for (let i = 0; i < equityCurvePoints.length; i++) {
const p = equityCurvePoints[i];
const pnl = equityMetric === 'usd'
? (p && typeof p.pnlDollar === 'number' ? p.pnlDollar : 0)
: (p && typeof p.pnlPips === 'number' ? p.pnlPips : 0);
if (pnl < 0) {
if (curLen === 0) {
curStart = i;
curLen = 1;
curLoss = pnl;
}
else {
curLen += 1;
curLoss += pnl;
}
if (curLen > maxLen || (curLen === maxLen && curLoss < bestLossSum)) {
maxLen = curLen;
bestLossSum = curLoss;
bestStart = curStart;
bestEnd = i;
}
}
else {
curStart = -1;
curLen = 0;
curLoss = 0;
}
}
const segments = [];
if (maxDd < 0 && ddTroughIdx > ddPeakIdx) {
segments.push({
name: 'drawdown',
start: ddPeakIdx,
end: ddTroughIdx,
color: TF_EQUITY_PRIMARY_DRAWDOWN_COLOR
});
}
if (maxLen > 0 && bestStart !== -1 && bestEnd > bestStart) {
segments.push({
name: 'lossStreak',
start: bestStart,
end: bestEnd,
color: TF_EQUITY_PRIMARY_LOSS_COLOR
});
}
if (!segments.length)
return;
segments.sort((a, b) => {
const la = a.end - a.start;
const lb = b.end - b.start;
if (la !== lb)
return lb - la;
if (a.name === b.name)
return 0;
if (a.name === 'drawdown')
return -1;
return 1;
});
segments.forEach((seg, idx) => {
const isTop = idx === segments.length - 1;
ctx.beginPath();
for (let i = seg.start; i <= seg.end; i++) {
const p = equityCurvePoints[i];
if (!p)
continue;
const x = xForIndex(i);
const y = yForVal(p.equity);
if (i === seg.start)
ctx.moveTo(x, y);
else
ctx.lineTo(x, y);
}
ctx.strokeStyle = seg.color;
ctx.lineWidth = isTop ? 3 : 2;
ctx.stroke();
});
window.TF_EQUITY_HIGHLIGHTS = {
ddPeakIdx: ddPeakIdx,
ddTroughIdx: ddTroughIdx,
maxDd: maxDd,
lossStreakStartIdx: bestStart,
lossStreakEndIdx: bestEnd,
lossStreakLen: maxLen,
lossStreakLoss: bestLossSum
};
})();
try {
if (Array.isArray(equityCurvePoints) && equityCurvePoints.length > 1) {
const withdrawIdx = [];
for (let i = 0; i < equityCurvePoints.length; i++) {
const p = equityCurvePoints[i];
if (!p)
continue;
const isW = !!p.isWithdraw || (typeof p.analyst === 'string' && p.analyst.toLowerCase() === 'withdraw');
if (isW)
withdrawIdx.push(i);
}
if (withdrawIdx.length) {
ctx.save();
ctx.setLineDash([]);
ctx.strokeStyle = TF_EQUITY_PRIMARY_WITHDRAW_COLOR;
ctx.lineWidth = 4.2;
ctx.lineCap = "round";
ctx.lineJoin = "round";
withdrawIdx.forEach((i) => {
if (i <= 0)
return;
const p0 = equityCurvePoints[i - 1];
const p1 = equityCurvePoints[i];
if (!p0 || !p1)
return;
const x0 = xForIndex(i - 1);
const y0 = yForVal(p0.equity);
const x1 = xForIndex(i);
const y1 = yForVal(p1.equity);
ctx.beginPath();
ctx.moveTo(x0, y0);
ctx.lineTo(x1, y1);
ctx.stroke();
});
ctx.restore();
}
}
}
catch (e) { }
// Secondary highlight palette is intentionally different from Primary.
(function drawSecondaryEquityHighlights() {
if (isCandleMode || !tf_isEquityCompareActive() || !Array.isArray(equityCompareCurvePoints) || equityCompareCurvePoints.length < 2)
return;
function xForSecondaryIndex(i) {
return xForCompareIndex(i);
}
let peakEquity = null;
let peakIdx = 0;
let maxDd = 0;
let ddPeakIdx = 0;
let ddTroughIdx = 0;
for (let i = 0; i < equityCompareCurvePoints.length; i++) {
const p = equityCompareCurvePoints[i];
const e = p && Number.isFinite(Number(p.equity)) ? Number(p.equity) : null;
if (e === null) continue;
if (peakEquity === null) {
peakEquity = e;
peakIdx = i;
ddPeakIdx = i;
ddTroughIdx = i;
continue;
}
if (e > peakEquity) {
peakEquity = e;
peakIdx = i;
}
const dd = e - peakEquity;
if (dd < maxDd) {
maxDd = dd;
ddPeakIdx = peakIdx;
ddTroughIdx = i;
}
}
let bestStart = -1;
let bestEnd = -1;
let maxLen = 0;
let bestLossSum = 0;
let curStart = -1;
let curLen = 0;
let curLoss = 0;
for (let i = 0; i < equityCompareCurvePoints.length; i++) {
const p = equityCompareCurvePoints[i];
const pnl = equityCompareMetric === 'usd'
? (p && Number.isFinite(Number(p.pnlDollar)) ? Number(p.pnlDollar) : 0)
: (p && Number.isFinite(Number(p.pnlPips)) ? Number(p.pnlPips) : 0);
if (pnl < 0) {
if (curLen === 0) {
curStart = i;
curLen = 1;
curLoss = pnl;
} else {
curLen += 1;
curLoss += pnl;
}
if (curLen > maxLen || (curLen === maxLen && curLoss < bestLossSum)) {
maxLen = curLen;
bestLossSum = curLoss;
bestStart = curStart;
bestEnd = i;
}
} else {
curStart = -1;
curLen = 0;
curLoss = 0;
}
}
const segments = [];
if (maxDd < 0 && ddTroughIdx > ddPeakIdx) {
segments.push({ start: ddPeakIdx, end: ddTroughIdx, color: TF_EQUITY_SECONDARY_DRAWDOWN_COLOR, width: 3.3 });
}
if (maxLen > 0 && bestStart !== -1 && bestEnd > bestStart) {
segments.push({ start: bestStart, end: bestEnd, color: TF_EQUITY_SECONDARY_LOSS_COLOR, width: 3.5 });
}
ctx.save();
ctx.setLineDash([]);
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
segments.forEach((seg) => {
ctx.beginPath();
let moved = false;
for (let i = seg.start; i <= seg.end; i++) {
const p = equityCompareCurvePoints[i];
if (!p || !Number.isFinite(Number(p.equity))) continue;
const x = xForSecondaryIndex(i);
const y = yForCompareVal(Number(p.equity));
if (!moved) { ctx.moveTo(x, y); moved = true; }
else ctx.lineTo(x, y);
}
if (moved) {
ctx.strokeStyle = seg.color;
ctx.lineWidth = seg.width;
ctx.stroke();
}
});
ctx.strokeStyle = TF_EQUITY_SECONDARY_WITHDRAW_COLOR;
ctx.lineWidth = 4.2;
for (let i = 1; i < equityCompareCurvePoints.length; i++) {
const p = equityCompareCurvePoints[i];
const p0 = equityCompareCurvePoints[i - 1];
if (!p || !p0) continue;
const isW = !!p.isWithdraw || (typeof p.analyst === 'string' && p.analyst.toLowerCase() === 'withdraw');
if (!isW || !Number.isFinite(Number(p.equity)) || !Number.isFinite(Number(p0.equity))) continue;
ctx.beginPath();
ctx.moveTo(xForSecondaryIndex(i - 1), yForCompareVal(Number(p0.equity)));
ctx.lineTo(xForSecondaryIndex(i), yForCompareVal(Number(p.equity)));
ctx.stroke();
}
ctx.restore();
window.TF_EQUITY_COMPARE_HIGHLIGHTS = {
ddPeakIdx, ddTroughIdx, maxDd,
lossStreakStartIdx: bestStart,
lossStreakEndIdx: bestEnd,
lossStreakLen: maxLen,
lossStreakLoss: bestLossSum
};
})();
if (equityCrosshairX !== null && equityCrosshairY !== null) {
const cx = equityCrosshairX;
const cy = equityCrosshairY;
ctx.beginPath();
ctx.moveTo(cx, paddingTop);
ctx.lineTo(cx, paddingTop + chartHeight);
ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.beginPath();
ctx.moveTo(paddingLeft, cy);
ctx.lineTo(paddingLeft + chartWidth, cy);
ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
ctx.lineWidth = 1;
ctx.stroke();
}
if (equityHoverIndex !== null && equityHoverIndex >= 0 && equityHoverIndex < equityCurvePoints.length) {
const hp = equityCurvePoints[equityHoverIndex];
const x = xForIndex(equityHoverIndex);
const y = yForVal(hp.equity);
ctx.beginPath();
ctx.arc(x, y, 4, 0, Math.PI * 2);
ctx.fillStyle = TF_EQUITY_COMPARE_PRIMARY_COLOR;
ctx.fill();
ctx.strokeStyle = '#0ea5e9';
ctx.lineWidth = 1.5;
ctx.stroke();
if (tf_isEquityCompareActive() && equityCompareCurvePoints.length) {
const primaryProgress = equityCurvePoints.length > 1 ? (equityHoverIndex / (equityCurvePoints.length - 1)) : 0;
const secondaryIndex = Math.max(0, Math.min(equityCompareCurvePoints.length - 1,
Math.round(primaryProgress * Math.max(0, equityCompareCurvePoints.length - 1))));
const sp = equityCompareCurvePoints[secondaryIndex];
if (sp && Number.isFinite(Number(sp.equity))) {
ctx.beginPath();
ctx.arc(xForCompareIndex(secondaryIndex), yForCompareVal(Number(sp.equity)), 4, 0, Math.PI * 2);
ctx.fillStyle = TF_EQUITY_COMPARE_SECONDARY_COLOR;
ctx.fill();
ctx.strokeStyle = '#7c3aed';
ctx.lineWidth = 1.5;
ctx.stroke();
}
}
}
}
function getEquityAnalystsSource() {
if (Array.isArray(window.EQUITY_ANALYSTS_DYNAMIC) && window.EQUITY_ANALYSTS_DYNAMIC.length) {
return window.EQUITY_ANALYSTS_DYNAMIC.map(function (name) {
return { name: name };
});
}
return Array.isArray(ANALYSTS) ? ANALYSTS : [];
}
function setupEquityAnalystFilter() {
const container = document.getElementById('equity-analyst-checkboxes');
const allCheckbox = document.getElementById('equity-analyst-all');
if (!container || !allCheckbox)
return;
container.innerHTML = '';
const source = getEquityAnalystsSource();
if (Array.isArray(source)) {
source.forEach(function (a) {
const label = document.createElement('label');
label.className = 'equity-analyst-option';
const cb = document.createElement('input');
cb.type = 'checkbox';
cb.checked = true;
cb.setAttribute('data-analyst', a.name);
const span = document.createElement('span');
span.textContent = a.name;
label.appendChild(cb);
label.appendChild(span);
container.appendChild(label);
});
}
allCheckbox.checked = true;
function refreshCurve() {
if (Array.isArray(lastHistoryRows) && lastHistoryRows.length > 0) {
updateEquityCurveFromRows(lastHistoryRows);
}
}
allCheckbox.addEventListener('change', function () {
const checked = allCheckbox.checked;
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
Array.prototype.forEach.call(boxes, function (cb) {
cb.checked = checked;
});
refreshCurve();
});
container.addEventListener('change', function (evt) {
const target = evt.target;
if (!target || target.type !== 'checkbox' || !target.hasAttribute('data-analyst'))
return;
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
let allChecked = true;
let anyChecked = false;
Array.prototype.forEach.call(boxes, function (cb) {
if (cb.checked) {
anyChecked = true;
}
else {
allChecked = false;
}
});
allCheckbox.checked = allChecked && anyChecked;
refreshCurve();
});
}
function getEquitySelectedAnalysts() {
const allCheckbox = document.getElementById('equity-analyst-all');
const container = document.getElementById('equity-analyst-checkboxes');
if (!allCheckbox || !container) {
return null;
}
if (allCheckbox.checked) {
return null;
}
const boxes = container.querySelectorAll('input[type="checkbox"][data-analyst]');
const selected = [];
Array.prototype.forEach.call(boxes, function (cb) {
if (cb.checked) {
const name = cb.getAttribute('data-analyst') || '';
if (name)
selected.push(name);
}
});
return selected;
}
function tf_makeEquityTouchEvent(canvas, touch) {
return {
currentTarget: canvas,
clientX: touch ? touch.clientX : 0,
clientY: touch ? touch.clientY : 0
};
}
function tf_scheduleEquityTouchTooltipHide(delayMs) {
try {
if (tfEquityTouchHideTimer) clearTimeout(tfEquityTouchHideTimer);
tfEquityTouchHideTimer = setTimeout(function () {
try {
tfEquityTouchActive = false;
equityHoverIndex = null;
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
drawEquityCurve();
}
catch (e) { }
}, Math.max(800, Number(delayMs) || 2600));
}
catch (e) { }
}
function tf_equityTouchDistance(a, b) {
try {
const dx = Number(a.clientX || 0) - Number(b.clientX || 0);
const dy = Number(a.clientY || 0) - Number(b.clientY || 0);
return Math.sqrt(dx * dx + dy * dy);
}
catch (e) { return 0; }
}
function tf_startEquityPinch(evt) {
try {
if (equityChartMode !== 'candle' || !evt.touches || evt.touches.length < 2) return false;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length) return false;
const canvas = evt.currentTarget;
if (!canvas) return false;
if (!equityCandleDrawMetrics || !isFinite(equityCandleDrawMetrics.chartWidth)) drawEquityCurve();
const m = equityCandleDrawMetrics;
if (!m || !isFinite(m.chartWidth) || m.chartWidth <= 0) return false;
const n = equityDailyCandles.length;
if (equityCandleViewEnd === null) equityCandleViewEnd = n - 1;
tf_clampEquityCandleViewport();
const d = tf_equityTouchDistance(evt.touches[0], evt.touches[1]);
if (!(d > 2)) return false;
const rect = canvas.getBoundingClientRect();
const midX = ((evt.touches[0].clientX + evt.touches[1].clientX) / 2) - rect.left;
const frac = Math.max(0, Math.min(1, (midX - m.paddingLeft) / m.chartWidth));
const span = Math.max(1, equityCandleViewEnd - equityCandleViewStart + 1);
tfEquityPinchActive = true;
tfEquityPinchStartDistance = d;
tfEquityPinchStartSpan = span;
tfEquityPinchAnchorFrac = frac;
tfEquityPinchAnchorIndex = equityCandleViewStart + frac * span;
equityCandleHoverIndex = null;
equityHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
return true;
}
catch (e) { return false; }
}
function tf_moveEquityPinch(evt) {
try {
if (!tfEquityPinchActive || !evt.touches || evt.touches.length < 2) return false;
const n = Array.isArray(equityDailyCandles) ? equityDailyCandles.length : 0;
if (!n) return false;
const canvas = evt.currentTarget;
if (!canvas) return false;
if (!equityCandleDrawMetrics || !isFinite(equityCandleDrawMetrics.chartWidth)) drawEquityCurve();
const m = equityCandleDrawMetrics;
if (!m || !isFinite(m.chartWidth) || m.chartWidth <= 0) return false;
const d = tf_equityTouchDistance(evt.touches[0], evt.touches[1]);
if (!(d > 2) || !(tfEquityPinchStartDistance > 2)) return false;
const scale = d / tfEquityPinchStartDistance;
let newSpan = Math.round(tfEquityPinchStartSpan / Math.max(0.18, Math.min(5.5, scale)));
const minSpan = Math.min(10, n);
newSpan = Math.max(minSpan, Math.min(n, newSpan));

// REV312: pinch midpoint is live, not frozen at touch-start.
// Moving both fingers together therefore pans/drags the candle viewport, while
// changing their distance continues to zoom around the fingers.
const rect = canvas.getBoundingClientRect();
const midX = ((evt.touches[0].clientX + evt.touches[1].clientX) / 2) - rect.left;
const currentFrac = Math.max(0, Math.min(1, (midX - m.paddingLeft) / m.chartWidth));
let newStart = Math.round(tfEquityPinchAnchorIndex - currentFrac * newSpan);
let newEnd = newStart + newSpan - 1;
if (newStart < 0) { newStart = 0; newEnd = newSpan - 1; }
if (newEnd > n - 1) { newEnd = n - 1; newStart = Math.max(0, newEnd - newSpan + 1); }
equityCandleViewStart = newStart;
equityCandleViewEnd = newEnd;
tf_clampEquityCandleViewport();
drawEquityCurve();
return true;
}
catch (e) { return false; }
}
function tf_handleEquityCanvasTouchStart(evt) {
try {
if (!evt.touches || !evt.touches.length) return;
const canvas = evt.currentTarget;
if (!canvas) return;
if (tfEquityTouchHideTimer) { clearTimeout(tfEquityTouchHideTimer); tfEquityTouchHideTimer = 0; }
if (evt.touches.length >= 2) {
if (tf_startEquityPinch(evt) && evt.cancelable) evt.preventDefault();
return;
}
const t = evt.touches[0];
if (!t) return;
tfEquityPinchActive = false;
tfEquityTouchActive = true;
tfEquityTouchStartX = t.clientX;
tfEquityTouchStartY = t.clientY;
const now = Date.now();
// Keep double-tap reset as a convenience, but timeframe changes now auto-fit,
// so it is no longer required to recover the full candle viewport.
if (equityChartMode === 'candle' && tfEquityLastTapAt && (now - tfEquityLastTapAt) <= 320) {
tfEquityLastTapAt = 0;
tf_resetEquityCandleViewportToFull();
tf_clampEquityCandleViewport();
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
drawEquityCurve();
if (evt.cancelable) evt.preventDefault();
return;
}
tfEquityLastTapAt = now;
tf_handleEquityCanvasMouseMove(tf_makeEquityTouchEvent(canvas, t));
}
catch (e) { }
}
function tf_handleEquityCanvasTouchMove(evt) {
try {
if (!evt.touches || !evt.touches.length) return;
if (evt.touches.length >= 2) {
if (!tfEquityPinchActive) tf_startEquityPinch(evt);
if (tf_moveEquityPinch(evt) && evt.cancelable) evt.preventDefault();
return;
}
if (tfEquityPinchActive) return;
const canvas = evt.currentTarget;
const t = evt.touches[0];
if (!canvas || !t) return;
const dx = Math.abs(t.clientX - tfEquityTouchStartX);
const dy = Math.abs(t.clientY - tfEquityTouchStartY);
// One finger: inspect the chart horizontally while preserving normal page
// scrolling for a clear vertical gesture.
if ((dx >= dy * 0.72 || dy < 7) && evt.cancelable) evt.preventDefault();
tfEquityTouchActive = true;
tf_handleEquityCanvasMouseMove(tf_makeEquityTouchEvent(canvas, t));
}
catch (e) { }
}
function tf_handleEquityCanvasTouchEnd(evt) {
try {
if (tfEquityPinchActive && (!evt.touches || evt.touches.length < 2)) {
tfEquityPinchActive = false;
tfEquityPinchStartDistance = 0;
}
// Keep the last touched detail visible briefly as the touch equivalent of hover.
tfEquityTouchActive = false;
tf_scheduleEquityTouchTooltipHide(2800);
}
catch (e) { }
}
function tf_handleEquityCanvasTouchCancel(evt) {
try {
tfEquityPinchActive = false;
tfEquityPinchStartDistance = 0;
tfEquityTouchActive = false;
tf_scheduleEquityTouchTooltipHide(900);
}
catch (e) { }
}
function setupEquityCurveInteractions() {
const canvas = document.getElementById('equity-curve-canvas');
if (!canvas)
return;
canvas.addEventListener('mousemove', tf_handleEquityCanvasMouseMove);
canvas.addEventListener('mouseleave', tf_handleEquityCanvasMouseLeave);
canvas.addEventListener('mousedown', tf_handleEquityCanvasMouseDown);
canvas.addEventListener('dblclick', tf_handleEquityCanvasDoubleClick);
canvas.addEventListener('wheel', tf_handleEquityCanvasWheel, { passive: false });
// REV311: one-finger touch inspects; two-finger pinch zooms candlesticks.
canvas.style.touchAction = 'pan-y';
canvas.addEventListener('touchstart', tf_handleEquityCanvasTouchStart, { passive: false });
canvas.addEventListener('touchmove', tf_handleEquityCanvasTouchMove, { passive: false });
canvas.addEventListener('touchend', tf_handleEquityCanvasTouchEnd, { passive: false });
canvas.addEventListener('touchcancel', tf_handleEquityCanvasTouchCancel, { passive: false });
window.addEventListener('mouseup', tf_handleEquityCanvasMouseUp);
window.addEventListener('resize', function () {
if (!equityCurvePoints.length)
return;
drawEquityCurve();
});
}
function setupEquityChartModeSelector() {
try {
tf_loadEquityChartModePreference();
}
catch (e) { }
try {
tf_syncEquityChartModeButtonsUI();
}
catch (e) { }
const wrap = document.getElementById('tf-equity-chartmode-buttons');
if (!wrap)
return;
wrap.addEventListener('click', function (e) {
try {
const btn = e.target && e.target.closest ? e.target.closest('button[data-mode]') : null;
if (!btn)
return;
const mode = btn.getAttribute('data-mode');
if (mode !== 'line' && mode !== 'candle')
return;
if (mode === equityChartMode)
return;
equityChartMode = mode;
if (equityChartMode === 'candle') {
try {
if (Array.isArray(equityDailyCandles) && equityDailyCandles.length)
tf_resetEquityCandleViewportToFull();
}
catch (e) { }
try {
tf_clampEquityCandleViewport();
}
catch (e) { }
}
tf_saveEquityChartModePreference();
tf_syncEquityChartModeButtonsUI();
try {
equityHoverIndex = null;
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (x) { }
drawEquityCurve();
}
catch (x) { }
});
}
function handleEquityCanvasMouseMove(evt) {
const canvas = evt.currentTarget;
const rect = canvas.getBoundingClientRect();
const wrapper = canvas.parentElement;
if (!wrapper)
return;
const x = evt.clientX - rect.left;
const y = evt.clientY - rect.top;
if (!equityCurvePoints.length)
return;
const paddingLeft = 48;
const paddingRight = tf_getEquityPaddingRight();
const paddingTop = 18;
const paddingBottom = 44;
const width = rect.width;
const height = rect.height;
const chartWidth = width - paddingLeft - paddingRight;
const chartHeight = height - paddingTop - paddingBottom;
if (chartWidth <= 0 || chartHeight <= 0)
return;
const inX = (x >= paddingLeft && x <= paddingLeft + chartWidth);
const inY = (y >= paddingTop && y <= paddingTop + chartHeight);
if (!inX || !inY) {
equityCrosshairX = null;
equityCrosshairY = null;
if (equityHoverIndex !== null) {
equityHoverIndex = null;
drawEquityCurve();
}
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
return;
}
equityCrosshairX = Math.max(paddingLeft, Math.min(paddingLeft + chartWidth, x));
equityCrosshairY = Math.max(paddingTop, Math.min(paddingTop + chartHeight, y));
function xForIndex(i) {
// Keep mouse hit-testing identical to the rendered REV171 trade-progression
// X axis. Using the old timestamp domain here made the hover position differ
// from the visible line and could leave the last section difficult to reach.
if (equityCurvePoints.length <= 1) return paddingLeft + chartWidth / 2;
return paddingLeft + (i / (equityCurvePoints.length - 1)) * chartWidth;
}
let closestIndex = 0;
let minDist = Infinity;
equityCurvePoints.forEach((p, idx) => {
const px = xForIndex(idx);
const d = Math.abs(px - x);
if (d < minDist) {
minDist = d;
closestIndex = idx;
}
});
equityHoverIndex = closestIndex;
drawEquityCurve();
const point = equityCurvePoints[closestIndex];
const tooltip = document.getElementById('equity-tooltip');
if (!tooltip)
return;
const netValue = equityMetric === 'usd' ? (point.pnlDollar || 0) : (point.pnlPips || 0);
const tpText = point.dollarTP ? formatMoney(point.dollarTP) : '-';
const slText = point.dollarSL ? formatMoney(point.dollarSL) : '-';
const netText = netValue === 0
? (equityMetric === 'usd' ? '$0.00' : formatPips(0, 1))
: formatEquityMetricSigned(netValue);
const resultClass = netValue > 0 ? 'tp' : netValue < 0 ? 'sl' : '';
const equityLabel = equityMetric === 'usd' ? 'Equity' : 'Akumulasi';
tooltip.innerHTML =
'<div><span class="label">Tanggal:</span> <span class="value">' + (point.date || '-') + '</span></div>' +
'<div><span class="label">Analis:</span> <span class="value">' + (point.analyst || '-') + '</span></div>' +
'<div><span class="label">Pair:</span> <span class="value">' + (point.pair ? String(point.pair).toUpperCase() : '-') + '</span></div>' +
'<div><span class="label">Hasil trade:</span> <span class="value ' + resultClass + '">' + netText + '</span></div>' +
'<div><span class="label">$TP / $SL:</span> <span class="value"><span class="tp">' + tpText + '</span> / <span class="sl">' + slText + '</span></span></div>' +
'<div><span class="label">' + equityLabel + ':</span> <span class="value">' + formatEquityMetricValue(point.equity) + '</span></div>' +
(function () {
if (!tf_isEquityCompareActive()) return '';
const primaryProgress = equityCurvePoints.length > 1 ? (closestIndex / (equityCurvePoints.length - 1)) : 0;
const ci = Math.max(0, Math.min(equityCompareCurvePoints.length - 1,
Math.round(primaryProgress * Math.max(0, equityCompareCurvePoints.length - 1))));
const cp = equityCompareCurvePoints[ci];
if (!cp) return '';
const val = equityCompareMetric === 'usd' ? formatMoney(cp.equity) : formatPips(cp.equity, 1);
return '<div><span class="label" style="color:' + TF_EQUITY_COMPARE_SECONDARY_COLOR + ';">Secondary:</span> <span class="value" style="color:' + TF_EQUITY_COMPARE_SECONDARY_COLOR + ';">' + val + '</span></div>';
})();
tooltip.style.display = 'block';
const wrapRect = wrapper.getBoundingClientRect();
let tx = evt.clientX - wrapRect.left + 8;
let ty = evt.clientY - wrapRect.top - 8;
const tooltipRect = tooltip.getBoundingClientRect();
const maxX = wrapRect.width - tooltipRect.width - 8;
const maxY = wrapRect.height - tooltipRect.height - 8;
if (tx < 8)
tx = 8;
if (ty < 8)
ty = 8;
if (tx > maxX)
tx = maxX;
if (ty > maxY)
ty = maxY;
tooltip.style.left = tx + 'px';
tooltip.style.top = ty + 'px';
}
function handleEquityCanvasMouseLeave() {
equityHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
drawEquityCurve();
const tooltip = document.getElementById('equity-tooltip');
if (tooltip) {
tooltip.style.display = 'none';
}
}
function tf_hideEquityTooltip() {
try {
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (e) { }
}
function tf_handleEquityCanvasMouseMove(evt) {
if (equityChartMode === 'candle')
return tf_handleEquityCandleMouseMove(evt);
return handleEquityCanvasMouseMove(evt);
}
function tf_handleEquityCanvasMouseLeave(evt) {
if (equityChartMode === 'candle')
return tf_handleEquityCandleMouseLeave(evt);
return handleEquityCanvasMouseLeave(evt);
}
function tf_handleEquityCanvasMouseDown(evt) {
try {
if (equityChartMode !== 'candle')
return;
if (evt.button !== 0)
return;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length)
return;
equityCandleIsDragging = true;
equityCandleDragStartX = evt.clientX;
equityCandleDragStartStart = equityCandleViewStart || 0;
try {
evt.currentTarget.style.cursor = 'grabbing';
}
catch (e) { }
tf_hideEquityTooltip();
evt.preventDefault();
}
catch (e) { }
}
function tf_handleEquityCanvasMouseUp(evt) {
try {
if (!equityCandleIsDragging)
return;
equityCandleIsDragging = false;
const canvas = document.getElementById('equity-curve-canvas');
if (canvas)
canvas.style.cursor = (equityChartMode === 'candle') ? 'grab' : '';
}
catch (e) { }
}
function tf_handleEquityCanvasDoubleClick(evt) {
try {
if (equityChartMode !== 'candle')
return;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length)
return;
tf_resetEquityCandleViewportToFull();
tf_clampEquityCandleViewport();
equityCandleHoverIndex = null;
tf_hideEquityTooltip();
drawEquityCurve();
}
catch (e) { }
}
function tf_handleEquityCanvasWheel(evt) {
try {
if (equityChartMode !== 'candle')
return;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length)
return;
evt.preventDefault();
if (!equityCandleDrawMetrics || !isFinite(equityCandleDrawMetrics.stepX)) {
drawEquityCurve();
}
const m = equityCandleDrawMetrics;
if (!m || !isFinite(m.chartWidth) || m.chartWidth <= 0)
return;
const n = equityDailyCandles.length;
if (equityCandleViewEnd === null)
equityCandleViewEnd = n - 1;
tf_clampEquityCandleViewport();
const curSpan = Math.max(1, (equityCandleViewEnd - equityCandleViewStart + 1));
const rect = evt.currentTarget.getBoundingClientRect();
const mx = evt.clientX - rect.left;
const frac = Math.max(0, Math.min(1, (mx - m.paddingLeft) / m.chartWidth));
const anchor = equityCandleViewStart + frac * curSpan;
const zoomIn = (evt.deltaY < 0);
const factor = zoomIn ? 0.85 : 1.15;
let newSpan = Math.round(curSpan * factor);
const minSpan = Math.min(10, n);
newSpan = Math.max(minSpan, Math.min(n, newSpan));
let newStart = Math.round(anchor - frac * newSpan);
let newEnd = newStart + newSpan - 1;
if (newStart < 0) {
newStart = 0;
newEnd = newSpan - 1;
}
if (newEnd > n - 1) {
newEnd = n - 1;
newStart = Math.max(0, newEnd - newSpan + 1);
}
equityCandleViewStart = newStart;
equityCandleViewEnd = newEnd;
tf_clampEquityCandleViewport();
equityCandleHoverIndex = null;
tf_hideEquityTooltip();
drawEquityCurve();
}
catch (e) { }
}
function tf_handleEquityCandleMouseMove(evt) {
const canvas = evt.currentTarget;
if (!canvas)
return;
if (!Array.isArray(equityDailyCandles) || !equityDailyCandles.length) {
return handleEquityCanvasMouseMove(evt);
}
if (!equityCandleDrawMetrics || !isFinite(equityCandleDrawMetrics.stepX)) {
drawEquityCurve();
}
const m = equityCandleDrawMetrics;
if (!m || !isFinite(m.stepX) || m.stepX <= 0)
return;
if (equityCandleIsDragging) {
const dx = evt.clientX - equityCandleDragStartX;
const shift = Math.round(dx / m.stepX);
const span = m.visCount || Math.max(1, (m.viewEnd - m.viewStart + 1));
const n = equityDailyCandles.length;
let newStart = (equityCandleDragStartStart || 0) - shift;
let newEnd = newStart + span - 1;
if (newStart < 0) {
newStart = 0;
newEnd = span - 1;
}
if (newEnd > n - 1) {
newEnd = n - 1;
newStart = Math.max(0, newEnd - span + 1);
}
equityCandleViewStart = newStart;
equityCandleViewEnd = newEnd;
tf_clampEquityCandleViewport();
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
drawEquityCurve();
return;
}
const rect = canvas.getBoundingClientRect();
const mx = evt.clientX - rect.left;
const my = evt.clientY - rect.top;
const x0 = m.paddingLeft;
const x1 = m.paddingLeft + m.chartWidth;
const y0 = m.paddingTop;
const y1 = m.paddingTop + m.chartHeight;
if (mx < x0 || mx > x1 || my < y0 || my > y1) {
equityCrosshairX = null;
equityCrosshairY = null;
if (equityCandleHoverIndex !== null) {
equityCandleHoverIndex = null;
drawEquityCurve();
}
tf_hideEquityTooltip();
canvas.style.cursor = 'grab';
return;
}
canvas.style.cursor = 'grab';
equityCrosshairX = Math.max(x0, Math.min(x1, mx));
equityCrosshairY = Math.max(y0, Math.min(y1, my));
let absIdx = null;
if (Array.isArray(m.candleCenters) && m.candleCenters.length) {
let bestDist = Infinity;
for (let ci = 0; ci < m.candleCenters.length; ci++) {
const item = m.candleCenters[ci];
if (!item || !Number.isFinite(Number(item.x))) continue;
const dist = Math.abs(Number(item.x) - mx);
if (dist < bestDist) { bestDist = dist; absIdx = Number(item.absIdx); }
}
}
if (!Number.isFinite(absIdx)) {
const j = Math.max(0, Math.min(m.visCount - 1, Math.floor((mx - x0) / m.stepX)));
absIdx = (m.viewStart || 0) + j;
}
if (absIdx !== equityCandleHoverIndex) {
equityCandleHoverIndex = absIdx;
drawEquityCurve();
}
const c = equityDailyCandles[absIdx];
if (!c) {
tf_hideEquityTooltip();
return;
}
try {
const tooltip = document.getElementById('equity-tooltip');
if (!tooltip)
return;
function tf_escapeHtml(s) {
try {
return String(s)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#39;');
}
catch (e) {
return '';
}
}
function tf_formatAnalystsTwoPerLine(arr) {
const list = Array.isArray(arr) ? arr.map((x) => String(x || '').trim()).filter(Boolean) : [];
if (!list.length)
return '<div class="tf-analyst-line">-</div>';
let html = '';
for (let i = 0; i < list.length; i += 2) {
const a1 = list[i];
const a2 = (i + 1 < list.length) ? list[i + 1] : '';
const line = a2 ? (a1 + ',' + a2) : a1;
html += '<div class="tf-analyst-line">' + tf_escapeHtml(line) + '</div>';
}
return html;
}
const equityVal = Number(c.close);
const dailyPnl = Number(c.close) - Number(c.open);
const startBalanceV338 = (equityCurvePoints[0] && Number.isFinite(Number(equityCurvePoints[0].equity)))
  ? Number(equityCurvePoints[0].equity) : 0;
const netFromStartV338 = (equityMetric === 'usd') ? (equityVal - startBalanceV338) : equityVal;
const equityClass = (isFinite(equityVal) && equityVal >= 0) ? 'positive' : 'negative';
const pnlClass = (isFinite(dailyPnl) && dailyPnl >= 0) ? 'positive' : 'negative';
const netClassV338 = (isFinite(netFromStartV338) && netFromStartV338 >= 0) ? 'positive' : 'negative';
tooltip.innerHTML =
'<div><span class="label">Tanggal:</span> <span class="value">' + (c.label || c.dayKey || '-') + '</span></div>' +
'<div><span class="label">Analis:</span></div>' +
'<div class="tf-analyst-lines">' + tf_formatAnalystsTwoPerLine(c.analysts) + '</div>' +
'<div><span class="label">Equity:</span> <span class="value ' + equityClass + '">' +
formatEquityMetricValue(equityVal) +
'</span></div>' +
(equityMetric === 'usd'
  ? '<div><span class="label">Net dari Start:</span> <span class="value ' + netClassV338 + '">' + formatEquityMetricSigned(netFromStartV338) + '</span></div>'
  : '') +
'<div><span class="label">' + (equityMetric === 'usd' ? 'PnL $ Daily' : 'PnL Pips Daily') + ':</span> <span class="value ' + pnlClass + '">' +
formatEquityMetricSigned(dailyPnl) +
'</span></div>';
tooltip.style.display = 'block';
const wrapper = canvas.parentElement;
if (!wrapper)
return;
const wrapRect = wrapper.getBoundingClientRect();
let tx = evt.clientX - wrapRect.left + 8;
let ty = evt.clientY - wrapRect.top - 8;
const tooltipRect = tooltip.getBoundingClientRect();
const maxX = wrapRect.width - tooltipRect.width - 8;
const maxY = wrapRect.height - tooltipRect.height - 8;
if (tx < 8)
tx = 8;
if (ty < 8)
ty = 8;
if (tx > maxX)
tx = maxX;
if (ty > maxY)
ty = maxY;
tooltip.style.left = tx + 'px';
tooltip.style.top = ty + 'px';
}
catch (e) { }
}
function tf_handleEquityCandleMouseLeave(evt) {
try {
equityCandleHoverIndex = null;
equityCrosshairX = null;
equityCrosshairY = null;
tf_hideEquityTooltip();
const canvas = evt && evt.currentTarget;
if (canvas)
canvas.style.cursor = (equityChartMode === 'candle') ? 'grab' : '';
drawEquityCurve();
}
catch (e) { }
}
function formatMoneySigned(v) {
const n = Number(v) || 0;
return (n >= 0 ? '+' : '') + formatMoney(n);
}
function formatPipsSigned(v) {
const n = Number(v) || 0;
return (n >= 0 ? '+' : '') + formatPips(n);
}
async function exportHistoryToCSV() {
if (!lastHistoryRowsForExport || lastHistoryRowsForExport.length === 0) {
alert('Tidak ada data history di Table 3 untuk di-export.');
return;
}
try {
const cfgToSave = (window && window.__tf_isignalUsersMgmtCfg) ? window.__tf_isignalUsersMgmtCfg : null;
if (cfgToSave) {
cfgToSave.updatedAt = Date.now();
await tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: cfgToSave });
}
}
catch (e) { }
const sep = ',';
const newline = '\r\n';
const balanceHeader = (lastHistoryRiskMode === 'compound') ? 'Balance Compounded' : 'Balance';
const visibleKeys = new Set(tf_getVisibleHistoryColumnKeys());
const columnDefs = [
{ key: 'created', header: 'Tanggal (Created At)', value: (row) => row.createdDate || '' },
{ key: 'closed', header: 'Tanggal (Closed At)', value: (row) => row.displayDate || '' },
{ key: 'analyst', header: 'Nama Analis', value: (row) => row.analyst || '' },
{ key: 'balance', header: balanceHeader, value: (row) => isFinite(row.balanceCompound) ? row.balanceCompound.toFixed(2) : '' },
{ key: 'entry', header: 'Entry', value: (row) => row.entry ?? row.price ?? '' },
{ key: 'takeProfit', header: 'Take Profit', value: (row) => row.takeProfit ?? row.take_profit ?? row.tp ?? '' },
{ key: 'stopLoss', header: 'Stop Loss', value: (row) => row.stopLoss ?? row.stop_loss ?? row.sl ?? '' },
{ key: 'type', header: 'Type', value: (row) => row.type ?? row.side ?? row.orderType ?? '' },
{ key: 'pair', header: 'Pair', value: (row) => row.pair || '' },
{ key: 'lot', header: 'Lot Size', value: (row) => isFinite(row.lot) ? row.lot.toFixed(2) : '' },
{ key: 'pnlPips', header: 'PnL (pips)', value: (row) => isFinite(row.pnlPips) ? row.pnlPips.toFixed(1) : '0' },
{ key: 'pnlDollar', header: 'PnL ($)', value: (row) => isFinite(row.pnlDollar) ? row.pnlDollar.toFixed(2) : '0' },
{ key: 'pnlDollarNet', header: 'PnL $' + tf_getCostAdjustedHeaderSuffix(), value: (row) => isFinite(row.pnlDollarNet) ? row.pnlDollarNet.toFixed(2) : '0' },
{ key: 'pnlPercent', header: 'PnL %', value: (row) => isFinite(row.pnlPercent) ? (row.pnlPercent.toFixed(2) + '%') : '' },
{ key: 'pnlPercentNet', header: 'PnL %' + tf_getCostAdjustedHeaderSuffix(), value: (row) => isFinite(row.pnlPercentNet) ? (row.pnlPercentNet.toFixed(2) + '%') : '' },
{ key: 'swapDollar', header: 'Swap $', value: (row) => isFinite(row.swapDollar) ? row.swapDollar.toFixed(2) : '0' },
{ key: 'commDollar', header: 'Comm $', value: (row) => isFinite(row.commDollar) ? row.commDollar.toFixed(2) : '0' },
{ key: 'balancePnl', header: 'Balance PnL ($)', value: (row) => isFinite(row.balancePnl) ? row.balancePnl.toFixed(2) : '' }
].filter((col) => visibleKeys.has(col.key));
const headers = columnDefs.map((col) => col.header);
function esc(value) {
if (value === null || value === undefined)
return '';
const str = String(value);
if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
return '"' + str.replace(/"/g, '""') + '"';
}
return str;
}
let csv = headers.map(esc).join(sep) + newline;
try {
const startLabel = (lastHistoryRiskMode === 'compound') ? 'Start Balance Compounded' : 'Start Balance';
const startBalanceValue = isFinite(currentBalance) ? Number(currentBalance).toFixed(2) : '0.00';
const startValues = {
created: startLabel,
balance: startBalanceValue,
pnlPips: '0.0',
pnlDollar: '0.00',
pnlDollarNet: '0.00',
pnlPercentNet: '0.00%',
swapDollar: '0.00',
commDollar: '0.00',
balancePnl: startBalanceValue
};
const startLine = columnDefs.map((col) => esc(startValues[col.key] ?? '')).join(sep);
csv += startLine + newline;
}
catch (e) { }
lastHistoryRowsForExport.forEach((row) => {
const line = columnDefs.map((col) => esc(col.value(row))).join(sep);
csv += line + newline;
});
const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
const now = new Date();
const ts = [
now.getFullYear(),
String(now.getMonth() + 1).padStart(2, '0'),
String(now.getDate()).padStart(2, '0'),
'_',
String(now.getHours()).padStart(2, '0'),
String(now.getMinutes()).padStart(2, '0')
].join('');
a.href = url;
a.download = 'tf_table3_history_' + ts + '.csv';
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}
function tf_formatDateTimeForTitle(d) {
try {
const pad2 = (n) => String(n).padStart(2, '0');
const dd = pad2(d.getDate());
const mm = pad2(d.getMonth() + 1);
const yyyy = d.getFullYear();
const HH = pad2(d.getHours());
const MM = pad2(d.getMinutes());
return dd + '/' + mm + '/' + yyyy + ' ' + HH + ':' + MM;
}
catch (e) {
return '';
}
}
function escapeHtml(str) {
return String(str == null ? '' : str)
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
}
function tf_formatDateTimeForFilename(d) {
try {
const pad2 = (n) => String(n).padStart(2, '0');
const dd = pad2(d.getDate());
const mm = pad2(d.getMonth() + 1);
const yyyy = d.getFullYear();
const HH = pad2(d.getHours());
const MM = pad2(d.getMinutes());
const SS = pad2(d.getSeconds());
return yyyy + '-' + mm + '-' + dd + '_' + HH + MM + SS;
}
catch (e) {
return '';
}
}
// ===== REV196: Excel-compatible XLSX export for Table 3 (no remote dependency) =====
function tf_xlsxXmlEscape(value) {
// Excel/OOXML uses XML 1.0. Remove control characters that make sheet XML invalid.
return String(value == null ? '' : value)
.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
.replace(/[\uFFFE\uFFFF]/g, '')
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&apos;');
}
function tf_xlsxColumnName(indexZeroBased) {
let n = Number(indexZeroBased) + 1;
let out = '';
while (n > 0) {
const rem = (n - 1) % 26;
out = String.fromCharCode(65 + rem) + out;
n = Math.floor((n - 1) / 26);
}
return out || 'A';
}
function tf_xlsxCellRef(rowOneBased, colZeroBased) {
return tf_xlsxColumnName(colZeroBased) + String(rowOneBased);
}
function tf_xlsxCellXml(rowOneBased, colZeroBased, value, styleId) {
const ref = tf_xlsxCellRef(rowOneBased, colZeroBased);
const style = Number.isFinite(Number(styleId)) ? ' s="' + Number(styleId) + '"' : '';
if (value === null || value === undefined || value === '') {
return '<c r="' + ref + '"' + style + '/>';
}
if (typeof value === 'number' && Number.isFinite(value)) {
return '<c r="' + ref + '"' + style + '><v>' + String(value) + '</v></c>';
}
const text = tf_xlsxXmlEscape(value);
return '<c r="' + ref + '" t="inlineStr"' + style + '><is><t xml:space="preserve">' + text + '</t></is></c>';
}
function tf_xlsxRowXml(rowOneBased, cells, attrs) {
const options = attrs || {};
const extra = (options.height ? ' ht="' + Number(options.height) + '" customHeight="1"' : '') +
(options.hidden ? ' hidden="1"' : '');
return '<row r="' + rowOneBased + '"' + extra + '>' + cells.join('') + '</row>';
}
function tf_xlsxCrc32(bytes) {
if (!tf_xlsxCrc32.table) {
const table = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
let c = i;
for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
table[i] = c >>> 0;
}
tf_xlsxCrc32.table = table;
}
let crc = 0xFFFFFFFF;
const table = tf_xlsxCrc32.table;
for (let i = 0; i < bytes.length; i++) crc = table[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
return (crc ^ 0xFFFFFFFF) >>> 0;
}
function tf_xlsxWriteU16(view, offset, value) {
view.setUint16(offset, value & 0xFFFF, true);
}
function tf_xlsxWriteU32(view, offset, value) {
view.setUint32(offset, value >>> 0, true);
}
function tf_xlsxDosDateTime(date) {
const d = date instanceof Date && !Number.isNaN(date.getTime()) ? date : new Date();
const year = Math.max(1980, d.getFullYear());
const dosDate = ((year - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
const dosTime = (d.getHours() << 11) | (d.getMinutes() << 5) | Math.floor(d.getSeconds() / 2);
return { date: dosDate & 0xFFFF, time: dosTime & 0xFFFF };
}
function tf_xlsxConcatBytes(parts) {
let total = 0;
for (const part of parts) total += part.length;
const out = new Uint8Array(total);
let offset = 0;
for (const part of parts) {
out.set(part, offset);
offset += part.length;
}
return out;
}
function tf_xlsxZipStore(entries, timestamp) {
const encoder = new TextEncoder();
const dt = tf_xlsxDosDateTime(timestamp || new Date());
const localParts = [];
const centralParts = [];
let localOffset = 0;
for (const entry of entries) {
const nameBytes = encoder.encode(String(entry.name || ''));
const dataBytes = entry.data instanceof Uint8Array ? entry.data : encoder.encode(String(entry.data == null ? '' : entry.data));
const crc = tf_xlsxCrc32(dataBytes);
const local = new Uint8Array(30 + nameBytes.length);
const lv = new DataView(local.buffer);
tf_xlsxWriteU32(lv, 0, 0x04034B50);
tf_xlsxWriteU16(lv, 4, 20);
tf_xlsxWriteU16(lv, 6, 0x0800);
tf_xlsxWriteU16(lv, 8, 0);
tf_xlsxWriteU16(lv, 10, dt.time);
tf_xlsxWriteU16(lv, 12, dt.date);
tf_xlsxWriteU32(lv, 14, crc);
tf_xlsxWriteU32(lv, 18, dataBytes.length);
tf_xlsxWriteU32(lv, 22, dataBytes.length);
tf_xlsxWriteU16(lv, 26, nameBytes.length);
tf_xlsxWriteU16(lv, 28, 0);
local.set(nameBytes, 30);
localParts.push(local, dataBytes);
const central = new Uint8Array(46 + nameBytes.length);
const cv = new DataView(central.buffer);
tf_xlsxWriteU32(cv, 0, 0x02014B50);
tf_xlsxWriteU16(cv, 4, 20);
tf_xlsxWriteU16(cv, 6, 20);
tf_xlsxWriteU16(cv, 8, 0x0800);
tf_xlsxWriteU16(cv, 10, 0);
tf_xlsxWriteU16(cv, 12, dt.time);
tf_xlsxWriteU16(cv, 14, dt.date);
tf_xlsxWriteU32(cv, 16, crc);
tf_xlsxWriteU32(cv, 20, dataBytes.length);
tf_xlsxWriteU32(cv, 24, dataBytes.length);
tf_xlsxWriteU16(cv, 28, nameBytes.length);
tf_xlsxWriteU16(cv, 30, 0);
tf_xlsxWriteU16(cv, 32, 0);
tf_xlsxWriteU16(cv, 34, 0);
tf_xlsxWriteU16(cv, 36, 0);
tf_xlsxWriteU32(cv, 38, 0);
tf_xlsxWriteU32(cv, 42, localOffset);
central.set(nameBytes, 46);
centralParts.push(central);
localOffset += local.length + dataBytes.length;
}
const localBytes = tf_xlsxConcatBytes(localParts);
const centralBytes = tf_xlsxConcatBytes(centralParts);
const eocd = new Uint8Array(22);
const ev = new DataView(eocd.buffer);
tf_xlsxWriteU32(ev, 0, 0x06054B50);
tf_xlsxWriteU16(ev, 4, 0);
tf_xlsxWriteU16(ev, 6, 0);
tf_xlsxWriteU16(ev, 8, entries.length);
tf_xlsxWriteU16(ev, 10, entries.length);
tf_xlsxWriteU32(ev, 12, centralBytes.length);
tf_xlsxWriteU32(ev, 16, localBytes.length);
tf_xlsxWriteU16(ev, 20, 0);
return tf_xlsxConcatBytes([localBytes, centralBytes, eocd]);
}
function tf_historyExcelColumnDefs(visibleColumns, balanceHeader) {
const visible = new Set(Array.isArray(visibleColumns) ? visibleColumns : []);
const defs = [
{ key: 'created', header: 'Tanggal (Created At)', width: 23, style: 4, get: (r) => r && (r.createdDate || r.displayDate || '') },
{ key: 'closed', header: 'Tanggal (Closed At)', width: 23, style: 4, get: (r) => r && (r.displayDate || r.createdDate || '') },
{ key: 'analyst', header: 'Nama Analis', width: 24, style: 4, get: (r) => r && r.isWithdraw ? 'Withdraw' : (r && r.analyst != null ? String(r.analyst) : '') },
{ key: 'balance', header: balanceHeader || 'Balance', width: 16, style: 8, get: (r) => r && Number.isFinite(Number(r.balanceCompound)) ? Number(r.balanceCompound) : null },
{ key: 'entry', header: 'Entry', width: 14, style: 10, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.entry ?? r.price)) ? Number(r.entry ?? r.price) : (r && !r.isWithdraw ? (r.entry ?? r.price ?? '') : '') },
{ key: 'takeProfit', header: 'Take Profit', width: 14, style: 10, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.takeProfit ?? r.take_profit ?? r.tp)) ? Number(r.takeProfit ?? r.take_profit ?? r.tp) : (r && !r.isWithdraw ? (r.takeProfit ?? r.take_profit ?? r.tp ?? '') : '') },
{ key: 'stopLoss', header: 'Stop Loss', width: 14, style: 10, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.stopLoss ?? r.stop_loss ?? r.sl)) ? Number(r.stopLoss ?? r.stop_loss ?? r.sl) : (r && !r.isWithdraw ? (r.stopLoss ?? r.stop_loss ?? r.sl ?? '') : '') },
{ key: 'type', header: 'Type', width: 10, style: 5, get: (r) => r && !r.isWithdraw ? (r.type ?? r.side ?? r.orderType ?? '') : '' },
{ key: 'pair', header: 'Pair', width: 11, style: 5, get: (r) => r && !r.isWithdraw ? (r.pair || '') : '' },
{ key: 'lot', header: 'Lot Size', width: 11, style: 6, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.lot)) ? Number(r.lot) : null },
{ key: 'pnlPips', header: 'PnL (pips)', width: 13, style: 7, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.pnlPips)) ? Number(r.pnlPips) : null },
{ key: 'pnlDollar', header: 'PnL ($)', width: 15, style: 8, get: (r) => r && Number.isFinite(Number(r.pnlDollar)) ? Number(r.pnlDollar) : null },
{ key: 'pnlDollarNet', header: 'PnL $' + tf_getCostAdjustedHeaderSuffix(), width: 19, style: 8, get: (r) => r && Number.isFinite(Number(r.pnlDollarNet)) ? Number(r.pnlDollarNet) : null },
{ key: 'pnlPercent', header: 'PnL %', width: 12, style: 9, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.pnlPercent)) ? Number(r.pnlPercent) : null },
{ key: 'pnlPercentNet', header: 'PnL %' + tf_getCostAdjustedHeaderSuffix(), width: 19, style: 9, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.pnlPercentNet)) ? Number(r.pnlPercentNet) : null },
{ key: 'swapDollar', header: 'Swap $', width: 12, style: 8, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.swapDollar)) ? Number(r.swapDollar) : null },
{ key: 'commDollar', header: 'Comm $', width: 12, style: 8, get: (r) => r && !r.isWithdraw && Number.isFinite(Number(r.commDollar)) ? Number(r.commDollar) : null },
{ key: 'balancePnl', header: 'Balance PnL ($)', width: 18, style: 8, get: (r) => r && Number.isFinite(Number(r.balancePnl)) ? Number(r.balancePnl) : null }
];
return defs.filter((col) => visible.has(col.key));
}
function tf_createHistoryExcelWorkbookBytes(sourceRows, options) {
const opts = options || {};
const rows = Array.isArray(sourceRows) ? sourceRows : [];
const defs = tf_historyExcelColumnDefs(opts.visibleColumns, opts.balanceHeader);
if (!defs.length) throw new Error('Pilih minimal satu kolom Table 3 sebelum Convert to Excel.');
if (rows.length > 1048569) throw new Error('Jumlah trade melebihi batas maksimum baris Excel.');
const encoder = new TextEncoder();
const lastCol = tf_xlsxColumnName(defs.length - 1);
const headerRow = 5;
const firstDataRow = 6;
const lastDataRow = Math.max(headerRow, firstDataRow + rows.length - 1);
const sheetRows = [];
sheetRows.push(tf_xlsxRowXml(1, [tf_xlsxCellXml(1, 0, opts.title || 'Table 3 - History Signal - Perhitungan Hasil per Trade', 1)], { height: 24 }));
const metaCells = [];
metaCells.push(tf_xlsxCellXml(2, 0, 'Tanggal update', 2));
metaCells.push(tf_xlsxCellXml(2, 1, opts.tsTitle || '', 4));
if (defs.length >= 4) {
metaCells.push(tf_xlsxCellXml(2, 2, 'Risk Mode', 2));
metaCells.push(tf_xlsxCellXml(2, 3, opts.riskMode === 'compound' ? 'Compound %' : 'Fixed Lot', 4));
}
if (defs.length >= 6) {
metaCells.push(tf_xlsxCellXml(2, 4, opts.startBalanceLabel || 'Start Balance', 2));
metaCells.push(tf_xlsxCellXml(2, 5, Number.isFinite(Number(opts.startBalance)) ? Number(opts.startBalance) : 0, 8));
}
sheetRows.push(tf_xlsxRowXml(2, metaCells, { height: 20 }));
sheetRows.push(tf_xlsxRowXml(3, [tf_xlsxCellXml(3, 0, 'Export mengikuti Time Range / filter tanggal, filter analis & pair, Risk Mode, checkbox trade aktif, serta pilihan kolom Table 3 saat tombol Excel ditekan.', 11)], { height: 32 }));
const headerCells = defs.map((col, index) => tf_xlsxCellXml(headerRow, index, col.header, 3));
sheetRows.push(tf_xlsxRowXml(headerRow, headerCells, { height: 30 }));
rows.forEach((row, rowIndex) => {
const excelRow = firstDataRow + rowIndex;
const cells = defs.map((col, colIndex) => {
let value = col.get(row);
let style = col.style;
if (row && row.isWithdraw) {
if (!['created', 'closed', 'analyst', 'balance', 'pnlDollar', 'pnlDollarNet', 'balancePnl'].includes(col.key)) value = null;
}
if (typeof value === 'number' && Number.isFinite(value)) {
if (col.key === 'pnlPips') style = value > 0 ? 12 : (value < 0 ? 13 : 7);
else if (col.key === 'pnlDollar' || col.key === 'pnlDollarNet' || col.key === 'swapDollar' || col.key === 'commDollar') style = value > 0 ? 14 : (value < 0 ? 15 : 8);
else if (col.key === 'pnlPercent' || col.key === 'pnlPercentNet') style = value > 0 ? 16 : (value < 0 ? 17 : 9);
}
return tf_xlsxCellXml(excelRow, colIndex, value, style);
});
sheetRows.push(tf_xlsxRowXml(excelRow, cells, { height: 18 }));
});
const colsXml = defs.map((col, index) => '<col min="' + (index + 1) + '" max="' + (index + 1) + '" width="' + col.width + '" customWidth="1"/>').join('');
const mergeXml = defs.length > 1 ? '<mergeCells count="2"><mergeCell ref="A1:' + lastCol + '1"/><mergeCell ref="A3:' + lastCol + '3"/></mergeCells>' : '';
const worksheetXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
'<dimension ref="A1:' + lastCol + lastDataRow + '"/>' +
'<sheetViews><sheetView workbookViewId="0"><pane ySplit="5" topLeftCell="A6" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>' +
'<sheetFormatPr defaultRowHeight="18"/>' +
'<cols>' + colsXml + '</cols>' +
'<sheetData>' + sheetRows.join('') + '</sheetData>' +
// IMPORTANT: SpreadsheetML CT_Worksheet requires autoFilter BEFORE mergeCells.
// REV195 wrote these in reverse order; desktop Excel can reject/repair that file.
'<autoFilter ref="A' + headerRow + ':' + lastCol + lastDataRow + '"/>' +
mergeXml +
'<pageMargins left="0.3" right="0.3" top="0.5" bottom="0.5" header="0.2" footer="0.2"/>' +
'<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>' +
'</worksheet>';
const stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
'<numFmts count="4"><numFmt numFmtId="164" formatCode="0.0"/><numFmt numFmtId="165" formatCode="$#,##0.00;[Red]-$#,##0.00"/><numFmt numFmtId="166" formatCode="0.00&quot;%&quot;"/><numFmt numFmtId="167" formatCode="0.########"/></numFmts>' +
'<fonts count="6"><font><sz val="10"/><name val="Calibri"/></font><font><b/><sz val="10"/><name val="Calibri"/></font><font><b/><sz val="15"/><name val="Calibri"/><color rgb="FF0F172A"/></font><font><b/><sz val="10"/><name val="Calibri"/><color rgb="FFFFFFFF"/></font><font><sz val="10"/><name val="Calibri"/><color rgb="FF16A34A"/></font><font><sz val="10"/><name val="Calibri"/><color rgb="FFDC2626"/></font></fonts>' +
'<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1E3A8A"/><bgColor indexed="64"/></patternFill></fill></fills>' +
'<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border><border><left style="thin"><color rgb="FFD1D5DB"/></left><right style="thin"><color rgb="FFD1D5DB"/></right><top style="thin"><color rgb="FFD1D5DB"/></top><bottom style="thin"><color rgb="FFD1D5DB"/></bottom><diagonal/></border></borders>' +
'<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
'<cellXfs count="18">' +
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
'<xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
'<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
'<xf numFmtId="0" fontId="3" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>' +
'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="center"/></xf>' +
'<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>' +
'<xf numFmtId="4" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="164" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="165" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="166" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="167" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>' +
'<xf numFmtId="164" fontId="4" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="164" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="165" fontId="4" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="165" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="166" fontId="4" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'<xf numFmtId="166" fontId="5" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="right"/></xf>' +
'</cellXfs>' +
'<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
'<dxfs count="0"/>' +
'</styleSheet>';
const contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
'<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
'<Default Extension="xml" ContentType="application/xml"/>' +
'<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
'<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
'<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
'</Types>';
const rootRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
'</Relationships>';
const workbookXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
'<bookViews><workbookView/></bookViews><sheets><sheet name="Table 3" sheetId="1" r:id="rId1"/></sheets>' +
'</workbook>';
const workbookRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
'<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
'<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
'</Relationships>';
const entries = [
{ name: '[Content_Types].xml', data: encoder.encode(contentTypes) },
{ name: '_rels/.rels', data: encoder.encode(rootRels) },
{ name: 'xl/workbook.xml', data: encoder.encode(workbookXml) },
{ name: 'xl/_rels/workbook.xml.rels', data: encoder.encode(workbookRels) },
{ name: 'xl/styles.xml', data: encoder.encode(stylesXml) },
{ name: 'xl/worksheets/sheet1.xml', data: encoder.encode(worksheetXml) }
];
return tf_xlsxZipStore(entries, opts.now instanceof Date ? opts.now : new Date());
}
async function exportHistoryToExcel() {
if (!lastHistoryRowsForExport || !Array.isArray(lastHistoryRowsForExport) || lastHistoryRowsForExport.length === 0) {
alert('Table 3 masih kosong. Silakan Import data dulu.');
return;
}
const btn = document.getElementById('export-history-excel-btn');
const oldText = btn ? btn.textContent : '';
try {
if (btn) {
btn.disabled = true;
btn.textContent = 'Preparing Excel...';
}
const cfgToSave = (window && window.__tf_isignalUsersMgmtCfg) ? window.__tf_isignalUsersMgmtCfg : null;
if (cfgToSave) {
cfgToSave.updatedAt = Date.now();
await tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: cfgToSave });
}
const now = new Date();
const rm = (typeof lastHistoryRiskMode === 'string' && lastHistoryRiskMode) ? lastHistoryRiskMode : 'fixed';
const options = {
now,
title: 'Table 3 - History Signal - Perhitungan Hasil per Trade',
tsTitle: (typeof tf_formatDateTimeForTitle === 'function') ? tf_formatDateTimeForTitle(now) : now.toLocaleString(),
riskMode: rm,
balanceHeader: rm === 'compound' ? 'Balance Compounded' : 'Balance',
startBalance: (typeof currentBalance === 'number' && isFinite(currentBalance)) ? currentBalance : 0,
startBalanceLabel: rm === 'compound' ? 'Start Balance Compounded' : 'Start Balance',
visibleColumns: tf_getVisibleHistoryColumnKeys()
};
const bytes = tf_createHistoryExcelWorkbookBytes(lastHistoryRowsForExport, options);
const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
const filename = 'tf_table3_history_' + tf_formatDateTimeForFilename(now) + '.xlsx';
if (window.AndroidSave && typeof window.AndroidSave.saveBase64 === 'function') {
  const reader = new FileReader();
  reader.onloadend = function(){
    const data = String(reader.result || '');
    const b64 = data.indexOf(',') >= 0 ? data.slice(data.indexOf(',') + 1) : data;
    window.AndroidSave.saveBase64(filename, blob.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', b64);
  };
  reader.readAsDataURL(blob);
} else {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
}
catch (error) {
console.error('TF Excel export gagal', error);
alert('Gagal membuat file Excel .xlsx: ' + (error && error.message ? error.message : String(error)));
}
finally {
if (btn) {
btn.disabled = false;
btn.textContent = oldText || 'Convert to Excel .xlsx';
}
}
}
// ===== END REV196 XLSX export =====
async function exportHistoryToPDF() {
if (!lastHistoryRowsForExport || !Array.isArray(lastHistoryRowsForExport) || lastHistoryRowsForExport.length === 0) {
alert('Table 3 masih kosong. Silakan Import data dulu.');
return;
}
try {
const cfgToSave = (window && window.__tf_isignalUsersMgmtCfg) ? window.__tf_isignalUsersMgmtCfg : null;
if (cfgToSave) {
cfgToSave.updatedAt = Date.now();
await tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: cfgToSave });
}
}
catch (e) { }
const now = new Date();
const tsTitle = (typeof tf_formatDateTimeForTitle === 'function') ? tf_formatDateTimeForTitle(now) : now.toLocaleString();
const tsFile = (typeof tf_formatDateTimeForFilename === 'function') ? tf_formatDateTimeForFilename(now) : String(Date.now());
const baseTitle = 'Table 3 - History Signal - Perhitungan Hasil per Trade';
const fullTitle = baseTitle + ' (Tanggal update: ' + tsTitle + ')';
const rm = (typeof lastHistoryRiskMode === 'string' && lastHistoryRiskMode) ? lastHistoryRiskMode : 'fixed';
const balanceHeader = (rm === 'compound') ? 'Balance Compounded' : 'Balance';
const exportId = String(Date.now()) + '_' + Math.random().toString(16).slice(2);
const payload = {
exportId,
createdAt: Date.now(),
title: fullTitle,
baseTitle,
tsTitle,
tsFile,
riskMode: rm,
balanceHeader,
costHeaderSuffix: tf_getCostAdjustedHeaderSuffix(),
startBalance: (typeof currentBalance === 'number' && isFinite(currentBalance)) ? currentBalance : 0,
startBalanceLabel: (rm === 'compound') ? 'Start Balance Compounded' : 'Start Balance',
visibleColumns: tf_getVisibleHistoryColumnKeys(),
rows: lastHistoryRowsForExport.map((r) => ({
createdDate: r && r.createdDate != null ? r.createdDate : '',
displayDate: r && r.displayDate != null ? r.displayDate : '',
analyst: r && r.analyst != null ? r.analyst : '',
balanceCompound: r && Number.isFinite(Number(r.balanceCompound)) ? Number(r.balanceCompound) : 0,
entry: r ? (r.entry ?? r.price ?? '') : '',
takeProfit: r ? (r.takeProfit ?? r.take_profit ?? r.tp ?? '') : '',
stopLoss: r ? (r.stopLoss ?? r.stop_loss ?? r.sl ?? '') : '',
type: r ? (r.type ?? r.side ?? r.orderType ?? '') : '',
pair: r && r.pair != null ? r.pair : '',
lot: r && Number.isFinite(Number(r.lot)) ? Number(r.lot) : 0,
pnlPips: r && Number.isFinite(Number(r.pnlPips)) ? Number(r.pnlPips) : 0,
pnlDollar: r && Number.isFinite(Number(r.pnlDollar)) ? Number(r.pnlDollar) : 0,
pnlDollarNet: r && Number.isFinite(Number(r.pnlDollarNet)) ? Number(r.pnlDollarNet) : 0,
pnlPercent: r && Number.isFinite(Number(r.pnlPercent)) ? Number(r.pnlPercent) : 0,
pnlPercentNet: r && Number.isFinite(Number(r.pnlPercentNet)) ? Number(r.pnlPercentNet) : 0,
swapDollar: r && Number.isFinite(Number(r.swapDollar)) ? Number(r.swapDollar) : 0,
commDollar: r && Number.isFinite(Number(r.commDollar)) ? Number(r.commDollar) : 0,
balancePnl: r && Number.isFinite(Number(r.balancePnl)) ? Number(r.balancePnl) : 0,
isWithdraw: !!(r && r.isWithdraw)
}))
};
const storageKey = 'tf_export_history_pdf_' + exportId;
chrome.storage.local.set({ [storageKey]: payload }, () => {
const url = chrome.runtime.getURL('export_table3_pdf.html?id=' + encodeURIComponent(exportId));
chrome.tabs.create({ url });
});
}
function setupHistoryPdfExportButton() { /* Mobile: export removed. */ }
let historyFormInitialized = false;
function setupHistoryForm() {
if (historyFormInitialized) {
return;
}
historyFormInitialized = true;
const clearBtn = document.getElementById('clear-history-btn');
const resetBtn = document.getElementById('reset-history-btn');
if (clearBtn) {
clearBtn.addEventListener('click', () => {
if (!historySignals || historySignals.length === 0)
return;
const ok = confirm('Hapus semua baris History di Dashboard (data di extension tidak ikut terhapus)?');
if (!ok)
return;
historySignals = [];
recomputeHistoryRows();
});
}
if (resetBtn) {
resetBtn.addEventListener('click', () => {
if (Array.isArray(initialHistorySignals)) {
historySignals = initialHistorySignals.map((item) => {
return {
...item,
displayDate: normalizeWIBSuffix(item.displayDate),
createdDate: normalizeWIBSuffix(item.createdDate)
};
});
recomputeHistoryRows();
}
});
}
}
function setupBalanceAndRiskControls() {
const balanceInput = document.getElementById('balance-input');
const riskInput = document.getElementById('risk-input');
const applyBalanceBtn = document.getElementById('apply-balance-btn');
const applyRiskBtn = document.getElementById('apply-risk-btn');
const swapToggle = document.getElementById('swap-enabled-toggle');
const swapRateInput = document.getElementById('swap-rate-input');
const commissionToggle = document.getElementById('commission-enabled-toggle');
const commissionRateInput = document.getElementById('commission-rate-input');
const resetBtn = document.getElementById('reset-defaults-btn');
const withdrawToggle = document.getElementById('withdraw-enabled-toggle');
const withdrawAmountInput = document.getElementById('withdraw-amount-input');
const withdrawMonthsSelect = document.getElementById('withdraw-months-select');
const withdrawSubmitBtn = document.getElementById('withdraw-submit-btn');
const withdrawToggleEquity = document.getElementById('withdraw-enabled-toggle-equity');
const withdrawAmountInputEquity = document.getElementById('withdraw-amount-input-equity');
const withdrawMonthsSelectEquity = document.getElementById('withdraw-months-select-equity');
const withdrawSubmitBtnEquity = document.getElementById('withdraw-submit-btn-equity');
const withdrawToggleHistory = document.getElementById('withdraw-enabled-toggle-history');
const withdrawAmountInputHistory = document.getElementById('withdraw-amount-input-history');
const withdrawMonthsSelectHistory = document.getElementById('withdraw-months-select-history');
const withdrawSubmitBtnHistory = document.getElementById('withdraw-submit-btn-history');
const withdrawToggles = [withdrawToggle, withdrawToggleEquity, withdrawToggleHistory].filter(Boolean);
const withdrawAmountInputs = [withdrawAmountInput, withdrawAmountInputEquity, withdrawAmountInputHistory].filter(Boolean);
const withdrawMonthsSelects = [withdrawMonthsSelect, withdrawMonthsSelectEquity, withdrawMonthsSelectHistory].filter(Boolean);
const withdrawSubmitBtns = [withdrawSubmitBtn, withdrawSubmitBtnEquity, withdrawSubmitBtnHistory].filter(Boolean);
const swapSyncTickers = ['monthly', 'equity', 'history'].map((scope) => document.getElementById('swap-enabled-ticker-' + scope)).filter(Boolean);
const commissionSyncTickers = ['monthly', 'equity', 'history'].map((scope) => document.getElementById('commission-enabled-ticker-' + scope)).filter(Boolean);
function syncCostEnableControls() {
if (swapToggle) swapToggle.checked = !!swapEnabled;
if (commissionToggle) commissionToggle.checked = !!commissionEnabled;
swapSyncTickers.forEach((el) => { try { el.checked = !!swapEnabled; } catch (e) { } });
commissionSyncTickers.forEach((el) => { try { el.checked = !!commissionEnabled; } catch (e) { } });
try { tf_updateCostAdjustedHeaders(); } catch (e) { }
try { tf_applyHistoryColumnVisibility(); } catch (e) { }
}
function refreshCostDependentViews() {
try { tf_saveTable1StateToLocalStorage(); } catch (e) { }
try { syncCostEnableControls(); } catch (e) { }
try { recomputeHistoryRows(); } catch (e) { }
}
function setCostEnabledFromControl(kind, checked) {
if (kind === 'swap') swapEnabled = !!checked;
else if (kind === 'commission') commissionEnabled = !!checked;
refreshCostDependentViews();
}
function syncInputs() {
if (balanceInput)
balanceInput.value = currentBalance;
if (riskInput)
riskInput.value = currentRiskPercent;
if (swapRateInput) swapRateInput.value = Number.isFinite(swapRatePerLot) ? swapRatePerLot : 9.01;
if (commissionRateInput) commissionRateInput.value = Number.isFinite(commissionRatePerLot) ? commissionRatePerLot : 20;
syncCostEnableControls();
const hasWithdrawUi = withdrawToggles.length && withdrawAmountInputs.length && withdrawMonthsSelects.length;
if (hasWithdrawUi) {
withdrawDraftEnabled = !!withdrawEnabled;
let _hasStoredWithdrawAmt = false;
let _storedWithdrawAmt = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
_hasStoredWithdrawAmt = (raw !== null && raw !== undefined && String(raw).trim() !== '');
_storedWithdrawAmt = safeParseFloat(raw);
}
}
catch (e) { }
withdrawDraftAmount = (_hasStoredWithdrawAmt && Number.isFinite(_storedWithdrawAmt)) ? Math.max(0, _storedWithdrawAmt) : null;
withdrawDraftEveryMonths = (Number.isFinite(withdrawEveryMonths) ? withdrawEveryMonths : 1);
withdrawDraftTouched = false;
withdrawDraftAutoFilled = false;
withdrawToggles.forEach((t) => {
try {
t.checked = !!withdrawDraftEnabled;
}
catch (e) { }
});
withdrawSubmitBtns.forEach((btn) => {
if (!btn)
return;
btn.disabled = !withdrawDraftEnabled;
btn.title = withdrawDraftEnabled ? "" : "Enable Withdraw to apply";
});
const amtStr = (withdrawDraftAmount === null || !Number.isFinite(withdrawDraftAmount)) ? '' : String(withdrawDraftAmount);
withdrawAmountInputs.forEach((inp) => {
if (!inp)
return;
inp.value = amtStr;
inp.disabled = false;
});
const monthsStr = String(withdrawDraftEveryMonths || 1);
withdrawMonthsSelects.forEach((sel) => {
if (!sel)
return;
sel.value = monthsStr;
sel.disabled = false;
});
try {
tf_enforceWithdrawAmountMax(false, withdrawAmountInputs[0]);
}
catch (e) { }
try {
tf_setWithdrawAverageText(tf_getWithdrawMaxAllowedOrNull(), false);
}
catch (e) { }
try {
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) { }
}
}
syncInputs();
const hasWithdrawUi = withdrawToggles.length && withdrawAmountInputs.length && withdrawMonthsSelects.length;
if (hasWithdrawUi) {
withdrawToggles.forEach((toggleEl) => {
toggleEl.addEventListener('change', () => {
const checked = !!toggleEl.checked;
withdrawDraftEnabled = checked;
withdrawToggles.forEach((t) => {
if (t === toggleEl)
return;
try {
t.checked = checked;
}
catch (e) { }
});
withdrawSubmitBtns.forEach((btn) => {
if (!btn)
return;
btn.disabled = !checked;
btn.title = checked ? "" : "Enable Withdraw to apply";
});
if (!checked) {
withdrawEnabled = false;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
renderMonthlyTotals();
}
catch (e) { }
}
});
});
withdrawAmountInputs.forEach((inp) => {
inp.addEventListener('input', () => {
withdrawDraftTouched = true;
const raw = String(inp.value || '').trim();
if (raw === '') {
withdrawDraftAmount = null;
}
else {
const v = safeParseFloat(raw);
withdrawDraftAmount = (v === null || v < 0) ? 0 : v;
}
try {
tf_enforceWithdrawAmountMax(true, inp);
}
catch (e) { }
});
});
withdrawMonthsSelects.forEach((sel) => {
sel.addEventListener('change', () => {
const v = parseInt(sel.value, 10);
withdrawDraftEveryMonths = (Number.isFinite(v) && v >= 1 && v <= 12) ? v : 1;
const str = String(withdrawDraftEveryMonths || 1);
withdrawMonthsSelects.forEach((s) => {
if (s === sel)
return;
try {
s.value = str;
}
catch (e) { }
});
});
});
}
if (hasWithdrawUi && withdrawSubmitBtns.length) {
withdrawSubmitBtns.forEach((btn) => {
btn.addEventListener('click', () => {
if (equityMetric !== 'usd') {
alert('Withdraw hanya tersedia saat Filter by: PnL ($).');
return;
}
const toggleRef = withdrawToggles[0];
const inputRef = withdrawAmountInputs[0];
const monthsRef = withdrawMonthsSelects[0];
if (!toggleRef || !inputRef || !monthsRef)
return;
withdrawDraftEnabled = !!toggleRef.checked;
const v0 = safeParseFloat(inputRef.value);
withdrawDraftAmount = (v0 === null || v0 < 0) ? 0 : v0;
const m0 = parseInt(monthsRef.value, 10);
withdrawDraftEveryMonths = (Number.isFinite(m0) && m0 >= 1 && m0 <= 12) ? m0 : 1;
try {
tf_enforceWithdrawAmountMax(true, inputRef);
}
catch (e) { }
const v1 = safeParseFloat(inputRef.value);
withdrawDraftAmount = (v1 === null || v1 < 0) ? 0 : v1;
withdrawEnabled = !!withdrawDraftEnabled;
withdrawAmount = withdrawDraftAmount;
withdrawEveryMonths = withdrawDraftEveryMonths;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
recomputeHistoryRows();
renderMonthlyTotals();
});
});
}
if (swapToggle) {
swapToggle.addEventListener('change', () => {
setCostEnabledFromControl('swap', !!swapToggle.checked);
});
}
if (commissionToggle) {
commissionToggle.addEventListener('change', () => {
setCostEnabledFromControl('commission', !!commissionToggle.checked);
});
}
swapSyncTickers.forEach((ticker) => {
ticker.addEventListener('change', () => {
setCostEnabledFromControl('swap', !!ticker.checked);
});
});
commissionSyncTickers.forEach((ticker) => {
ticker.addEventListener('change', () => {
setCostEnabledFromControl('commission', !!ticker.checked);
});
});
function bindAutoCostRateInput(input, kind) {
if (!input) return;
input.addEventListener('input', () => {
const v = safeParseFloat(input.value);
if (v === null || v < 0) return;
if (kind === 'swap') swapRatePerLot = v;
else commissionRatePerLot = v;
refreshCostDependentViews();
});
input.addEventListener('change', () => {
const v = safeParseFloat(input.value);
if (v === null || v < 0) {
if (kind === 'swap') input.value = Number.isFinite(swapRatePerLot) ? swapRatePerLot : 9.01;
else input.value = Number.isFinite(commissionRatePerLot) ? commissionRatePerLot : 20;
return;
}
if (kind === 'swap') swapRatePerLot = v;
else commissionRatePerLot = v;
refreshCostDependentViews();
});
}
bindAutoCostRateInput(swapRateInput, 'swap');
bindAutoCostRateInput(commissionRateInput, 'commission');
applyBalanceBtn.addEventListener('click', () => {
const v = safeParseFloat(balanceInput.value);
if (v === null || v <= 0) {
alert('Balance tidak valid. Isi angka lebih besar dari 0.');
if (balanceInput)
balanceInput.value = currentBalance;
return;
}
currentBalance = v;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
renderSummaryTable();
recomputeHistoryRows();
});
applyRiskBtn.addEventListener('click', () => {
const v = safeParseFloat(riskInput.value);
if (v === null || v < 0) {
alert('Risk % / Trade tidak valid.');
if (riskInput)
riskInput.value = currentRiskPercent;
return;
}
currentRiskPercent = v;
clearAllAnalystRiskOverrides();
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
renderSummaryTable();
recomputeHistoryRows();
});
resetBtn.addEventListener('click', () => {
currentBalance = 5000;
currentRiskPercent = 1;
swapEnabled = false;
swapRatePerLot = 9.01;
commissionEnabled = false;
commissionRatePerLot = 20;
withdrawEnabled = false;
withdrawAmount = 0;
withdrawEveryMonths = 1;
clearAllAnalystRiskOverrides();
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
syncInputs();
renderSummaryTable();
recomputeHistoryRows();
});
}
function makeEmptyStreakState() {
return {
currentProfitTrades: 0,
currentProfitPips: 0,
currentProfitDollar: 0,
maxProfitTrades: 0,
maxProfitPips: 0,
maxProfitDollar: 0,
currentLossTrades: 0,
currentLossPips: 0,
currentLossDollar: 0,
maxLossTrades: 0,
maxLossPips: 0,
maxLossDollar: 0,
profitRuns: {},
lossRuns: {}
};
}
function commitProfitRun(state) {
try {
const len = state.currentProfitTrades || 0;
if (len <= 0)
return;
const pips = isFinite(state.currentProfitPips) ? state.currentProfitPips : 0;
const dollar = isFinite(state.currentProfitDollar) ? state.currentProfitDollar : 0;
const runs = state.profitRuns || (state.profitRuns = {});
const cur = runs[len] || { count: 0, bestPips: 0, bestDollar: 0 };
cur.count += 1;
if (cur.count === 1 || dollar > cur.bestDollar || (dollar === cur.bestDollar && pips > cur.bestPips)) {
cur.bestDollar = dollar;
cur.bestPips = pips;
}
runs[len] = cur;
if (len > (state.maxProfitTrades || 0) || (len === (state.maxProfitTrades || 0) && dollar > (state.maxProfitDollar || 0))) {
state.maxProfitTrades = len;
state.maxProfitPips = pips;
state.maxProfitDollar = dollar;
}
}
catch (e) { }
}
function commitLossRun(state) {
try {
const len = state.currentLossTrades || 0;
if (len <= 0)
return;
const pips = isFinite(state.currentLossPips) ? state.currentLossPips : 0;
const dollar = isFinite(state.currentLossDollar) ? state.currentLossDollar : 0;
const runs = state.lossRuns || (state.lossRuns = {});
const cur = runs[len] || { count: 0, bestPips: 0, bestDollar: 0 };
cur.count += 1;
if (cur.count === 1 || dollar > cur.bestDollar || (dollar === cur.bestDollar && pips > cur.bestPips)) {
cur.bestDollar = dollar;
cur.bestPips = pips;
}
runs[len] = cur;
if (len > (state.maxLossTrades || 0) || (len === (state.maxLossTrades || 0) && dollar > (state.maxLossDollar || 0))) {
state.maxLossTrades = len;
state.maxLossPips = pips;
state.maxLossDollar = dollar;
}
}
catch (e) { }
}
function finalizeStreakState(state) {
try {
commitProfitRun(state);
}
catch (e) { }
try {
commitLossRun(state);
}
catch (e) { }
try {
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
catch (e) { }
}
function updateStreakState(state, row) {
const pips = isFinite(row.pips) ? row.pips : 0;
const profitDollar = isFinite(row.dollarTP) ? row.dollarTP : (row.dollarTP || 0);
const lossDollar = isFinite(row.dollarSL) ? row.dollarSL : (row.dollarSL || 0);
if (pips > 0) {
if ((state.currentLossTrades || 0) > 0) {
commitLossRun(state);
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
state.currentProfitTrades += 1;
state.currentProfitPips += pips;
state.currentProfitDollar += profitDollar;
}
else if (pips < 0) {
const absPips = Math.abs(pips);
if ((state.currentProfitTrades || 0) > 0) {
commitProfitRun(state);
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
}
state.currentLossTrades += 1;
state.currentLossPips += absPips;
state.currentLossDollar += lossDollar;
}
else {
if ((state.currentProfitTrades || 0) > 0) {
commitProfitRun(state);
}
if ((state.currentLossTrades || 0) > 0) {
commitLossRun(state);
}
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
}
function tf_updateStreakStateFixedLot(state, row) {
const pips = isFinite(row.pips) ? row.pips : 0;
const lotFixed = Number(row.lotFixed);
const dpp = Math.abs(Number(row.dollarPerPip) || 0);
const pnlDollarFixed = (isFinite(lotFixed) ? lotFixed : 0) * dpp * (Number(pips) || 0);
const profitDollar = pnlDollarFixed > 0 ? pnlDollarFixed : 0;
const lossDollar = pnlDollarFixed < 0 ? Math.abs(pnlDollarFixed) : 0;
if (pips > 0) {
if ((state.currentLossTrades || 0) > 0) {
commitLossRun(state);
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
state.currentProfitTrades += 1;
state.currentProfitPips += pips;
state.currentProfitDollar += profitDollar;
}
else if (pips < 0) {
const absPips = Math.abs(pips);
if ((state.currentProfitTrades || 0) > 0) {
commitProfitRun(state);
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
}
state.currentLossTrades += 1;
state.currentLossPips += absPips;
state.currentLossDollar += lossDollar;
}
else {
if ((state.currentProfitTrades || 0) > 0) {
commitProfitRun(state);
}
if ((state.currentLossTrades || 0) > 0) {
commitLossRun(state);
}
state.currentProfitTrades = 0;
state.currentProfitPips = 0;
state.currentProfitDollar = 0;
state.currentLossTrades = 0;
state.currentLossPips = 0;
state.currentLossDollar = 0;
}
}
let tf_equitySummaryRenderRole = 'primary';
let tf_equitySummaryDetailBound = false;
function tf_summaryEscHtml(str) { return String(str == null ? '' : str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;'); }
function computeAndRenderEquityDrawdownSummary() {
const container = document.getElementById('equity-drawdown-summary');
const detailEl = document.getElementById('equity-drawdown-detail');
if (!container || !detailEl) {
return;
}
if (!Array.isArray(equityCurvePoints) || equityCurvePoints.length === 0) {
detailEl.textContent =
'Belum ada data drawdown. Import data dari TF Multi-Analyst Desktop terlebih dahulu.';
return;
}
let peakEquity = null;
let peakIdx = 0;
let maxEquityDrawdown = 0;
let ddPeakIdx = 0;
let ddTroughIdx = 0;
equityCurvePoints.forEach((p, idx) => {
const e = p && typeof p.equity === 'number' ? p.equity : null;
if (e === null || !isFinite(e))
return;
if (peakEquity === null) {
peakEquity = e;
peakIdx = idx;
ddPeakIdx = idx;
ddTroughIdx = idx;
return;
}
if (e > peakEquity) {
peakEquity = e;
peakIdx = idx;
}
const dd = e - peakEquity;
if (dd < maxEquityDrawdown) {
maxEquityDrawdown = dd;
ddPeakIdx = peakIdx;
ddTroughIdx = idx;
}
});
const ddPeakPoint = equityCurvePoints[ddPeakIdx] || null;
const ddTroughPoint = equityCurvePoints[ddTroughIdx] || null;
const ddPeakDate = ddPeakPoint && ddPeakPoint.date ? ddPeakPoint.date : '-';
const ddTroughDate = ddTroughPoint && ddTroughPoint.date ? ddTroughPoint.date : '-';
const ddDetailTrades = [];
let ddDetailTotalDollar = 0;
// REV175: drawdown percentage is calculated from the signed PnL % of each
// actual trade between the equity peak and trough. Withdraw rows remain part
// of the dollar equity curve, but are deliberately excluded from this
// percentage because they are cash movements, not trade PnL.
let ddTradePercentNet = null;
let ddCapitalAtPeakUsd = null;
let ddCapitalAtTroughUsd = null;
try {
let runningUsd = Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : 0;
for (let i = 1; i <= ddPeakIdx; i++) {
const p = equityCurvePoints[i];
runningUsd += p && Number.isFinite(Number(p.pnlDollar)) ? Number(p.pnlDollar) : 0;
}
ddCapitalAtPeakUsd = runningUsd;
}
catch (e) { ddCapitalAtPeakUsd = null; }
if (ddTroughIdx > ddPeakIdx) {
let ddRunningCapitalUsd = Number.isFinite(Number(ddCapitalAtPeakUsd)) ? Number(ddCapitalAtPeakUsd) : null;
let ddTradePctTotal = 0;
let ddTradePctHasValue = false;
for (let i = ddPeakIdx + 1; i <= ddTroughIdx; i++) {
const p = equityCurvePoints[i];
if (!p)
continue;
const pnlDollar = typeof p.pnlDollar === 'number' && isFinite(p.pnlDollar) ? p.pnlDollar : 0;
if (ddRunningCapitalUsd !== null) ddRunningCapitalUsd += pnlDollar;
ddDetailTrades.push({
date: p.date || '-',
analyst: (p.isWithdraw ? 'Withdraw' : (p.analyst || 'Unknown')),
pair: (p.isWithdraw ? 'User' : (p.pair || '-')),
pnlPips: Number.isFinite(Number(p.pnlPips)) ? Number(p.pnlPips) : 0,
pnlDollar: pnlDollar,
pnlPercent: (!p.isWithdraw && Number.isFinite(Number(p.pnlPercent))) ? Number(p.pnlPercent) : null,
balanceAfter: ddRunningCapitalUsd,
isWithdraw: !!p.isWithdraw
});
ddDetailTotalDollar += pnlDollar;
if (!p.isWithdraw) {
const pnlPct = Number(p.pnlPercent);
if (Number.isFinite(pnlPct)) {
ddTradePctTotal += pnlPct;
ddTradePctHasValue = true;
}
}
}
if (ddTradePctHasValue && Number.isFinite(ddTradePctTotal)) {
ddTradePercentNet = ddTradePctTotal;
}
ddCapitalAtTroughUsd = ddRunningCapitalUsd;
}
let maxStreakLength = 0;
let maxStreakLoss = 0;
let bestStartIndex = -1;
let bestEndIndex = -1;
let currentLength = 0;
let currentLoss = 0;
let currentStartIndex = -1;
equityCurvePoints.forEach((point, index) => {
const pnl = equityMetric === 'usd'
? (point && typeof point.pnlDollar === 'number' ? point.pnlDollar : 0)
: (point && typeof point.pnlPips === 'number' ? point.pnlPips : 0);
if (pnl < 0) {
if (currentLength === 0) {
currentStartIndex = index;
currentLength = 1;
currentLoss = pnl;
}
else {
currentLength += 1;
currentLoss += pnl;
}
if (currentLength > maxStreakLength ||
(currentLength === maxStreakLength && currentLoss < maxStreakLoss)) {
maxStreakLength = currentLength;
maxStreakLoss = currentLoss;
bestStartIndex = currentStartIndex;
bestEndIndex = index;
}
}
else {
currentLength = 0;
currentLoss = 0;
currentStartIndex = -1;
}
});
let html = '';
const priceBusy = tf_isMyfxbookPriceLoading();
// REV179: compact semantic summary cards, row-based layout, and collapsible trade detail.
function tf_summarySectionStart(title, subtitle, accentColor) {
const lower = String(title || '').toLowerCase();
const sectionKey = lower.includes('consecutive') ? 'consecutive' : (lower.includes('maximum') ? 'maximum' : (lower.includes('balance') ? 'balance' : 'other'));
return '<section class="tf-summary-section" data-summary-section="' + sectionKey + '">' +
'<div class="tf-summary-section-head">' +
'<div><div class="tf-summary-section-title" style="color:' + accentColor + ';">' + title + '</div>' +
'<div class="tf-summary-section-subtitle">' + subtitle + '</div></div></div>';
}
function tf_summaryMetric(label, valueHtml, accentColor, noteHtml, detailTarget) {
const safeLabel = escHtml(label);
const detailButton = detailTarget
? '<button type="button" class="tf-summary-detail-btn" data-detail-target="' + escHtml(detailTarget) + '" aria-expanded="false">Detail</button>'
: '';
return '<div class="tf-summary-metric" data-metric-label="' + safeLabel + '">' +
'<div class="tf-summary-metric-label">' + label + '</div>' +
'<div class="tf-summary-metric-main"><div class="mono tf-summary-metric-value" style="color:' + accentColor + ';">' + (valueHtml || '-') + '</div>' + detailButton + '</div>' +
(noteHtml ? '<div class="tf-summary-metric-note">' + noteHtml + '</div>' : '') + '</div>';
}
function tf_summaryRowStart(rowKey, rowLabel) {
return (rowLabel ? '<div class="tf-summary-row-label">' + rowLabel + '</div>' : '') +
'<div class="tf-summary-row-grid" data-summary-row="' + escHtml(rowKey || 'general') + '">';
}
function tf_summaryGridStart(rowKey) {
return tf_summaryRowStart(rowKey || 'general', '');
}
function tf_summaryDateRange(startValue, endValue) {
return '<div class="tf-summary-date-lines">' +
'<div class="tf-summary-date-line"><span>Mulai</span><strong>' + escHtml(startValue || '-') + '</strong></div>' +
'<div class="tf-summary-date-line"><span>Selesai</span><strong>' + escHtml(endValue || '-') + '</strong></div>' +
'</div>';
}
function escHtml(str) {
return String(str || '')
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
}
function tf_summaryDetailPanel(panelId, title, trades, totalDollar, totalPctHtml, accentColor, methodKey, methodDescription) {
if (!Array.isArray(trades) || !trades.length) return '';
const tf_detailSignColor = (value) => {
const n = Number(value);
if (!Number.isFinite(n) || n === 0) return '#f8fafc';
return n > 0 ? '#22c55e' : '#ef4444';
};
let body = '';
let totalPips = 0;
let totalPnlPct = 0;
let totalPnlPctHasValue = false;
trades.forEach((t, idx) => {
const pnlDollar = Number(t.pnlDollar);
const pnlPips = Number(t.pnlPips);
const pnlPct = Number(t.pnlPercent);
const balanceAfter = Number(t.balanceAfter);
if (Number.isFinite(pnlPips)) totalPips += pnlPips;
if (!t.isWithdraw && Number.isFinite(pnlPct)) { totalPnlPct += pnlPct; totalPnlPctHasValue = true; }
const dollarColor = tf_detailSignColor(pnlDollar);
const pipsColor = tf_detailSignColor(pnlPips);
const pctColor = tf_detailSignColor(pnlPct);
const dollarHtml = priceBusy ? tf_spinnerHTML(true) : (Number.isFinite(pnlDollar) ? '<span style="color:' + dollarColor + ';">' + formatSignedMoney(pnlDollar) + '</span>' : '-');
const pipsText = Number.isFinite(pnlPips) ? formatPlainNumber(pnlPips, 1) : '-';
const pipsHtml = Number.isFinite(pnlPips) ? '<span style="color:' + pipsColor + ';">' + pipsText + '</span>' : '-';
const pctText = (!t.isWithdraw && Number.isFinite(pnlPct)) ? tf_tradePnlPctSignedStr(pnlPct) : '-';
const pctHtml = (!t.isWithdraw && Number.isFinite(pnlPct)) ? '<span style="color:' + pctColor + ';">' + pctText + '</span>' : '<span style="color:#f8fafc;">-</span>';
const balanceHtml = priceBusy ? tf_spinnerHTML(true) : (Number.isFinite(balanceAfter) ? tf_balanceMoneyStr(balanceAfter) : '-');
body += '<tr>' +
'<td>' + (idx + 1) + '</td>' +
'<td><span class="mono">' + escHtml(t.date || '-') + '</span></td>' +
'<td><span class="mono">' + escHtml(t.analyst || 'Unknown') + '</span></td>' +
'<td><span class="mono">' + escHtml(t.pair || '-') + '</span></td>' +
'<td class="text-right"><span class="mono">' + pipsHtml + '</span></td>' +
'<td class="text-right"><span class="mono">' + dollarHtml + '</span></td>' +
'<td class="text-right"><span class="mono">' + pctHtml + '</span></td>' +
'<td class="text-right"><span class="mono" style="color:#f8fafc;">' + balanceHtml + '</span></td>' +
'</tr>';
});
const totalDollarNumber = Number(totalDollar);
const totalDollarHtml = priceBusy ? tf_spinnerHTML(true) : (Number.isFinite(totalDollarNumber) ? '<span style="color:' + tf_detailSignColor(totalDollarNumber) + ';">' + formatSignedMoney(totalDollarNumber) + '</span>' : '-');
const totalPipsHtml = Number.isFinite(totalPips) ? '<span style="color:' + tf_detailSignColor(totalPips) + ';">' + formatPlainNumber(totalPips, 1) + '</span>' : '-';
const pctNumeric = totalPnlPctHasValue ? totalPnlPct : null;
const footerPctColor = methodKey === 'pnlpct' && pctNumeric !== null ? tf_detailSignColor(pctNumeric) : (String(totalPctHtml || '').trim().startsWith('-') ? '#ef4444' : (String(totalPctHtml || '').trim().startsWith('+') ? '#22c55e' : '#f8fafc'));
const methodLabel = methodKey === 'pnlpct' ? 'PnL % (Akumulasi)' : 'History/Timeframe';
return '<div class="tf-summary-detail-panel" id="' + escHtml(panelId) + '" data-summary-detail-role="' + escHtml(tf_equitySummaryRenderRole) + '" data-summary-detail-method="' + escHtml(methodKey || 'history') + '" hidden>' +
'<div class="tf-summary-detail-head"><strong style="color:' + accentColor + ';">' + title + '</strong><span>' + trades.length + ' trade</span></div>' +
'<div class="tf-summary-detail-method"><span class="tf-summary-detail-method-badge">' + escHtml(methodLabel) + '</span><span>' + escHtml(methodDescription || '') + '</span></div>' +
'<div class="tf-summary-detail-scroll"><table class="tf-summary-detail-table"><thead><tr>' +
'<th>#</th><th>Tanggal</th><th>Analis</th><th>Pair</th><th class="text-right">PnL Pips</th><th class="text-right">PnL $</th><th class="text-right">PnL %</th><th class="text-right">Balance</th>' +
'</tr></thead><tbody>' + body + '</tbody><tfoot><tr>' +
'<td colspan="4">Total / hasil metode</td><td class="text-right"><span class="mono">' + totalPipsHtml + '</span></td><td class="text-right"><span class="mono">' + totalDollarHtml + '</span></td><td class="text-right"><span class="mono" style="color:' + footerPctColor + ';">' + (totalPctHtml || '-') + '</span></td><td></td>' +
'</tr></tfoot></table></div></div>';
}
function tf_setupSummaryDetailToggle() {
if (tf_equitySummaryDetailBound) return;
tf_equitySummaryDetailBound = true;
document.addEventListener('click', function (event) {
const btn = event.target && event.target.closest ? event.target.closest('.tf-summary-detail-btn') : null;
if (!btn) return;
const targetId = btn.getAttribute('data-detail-target');
if (!targetId) return;
const panel = document.getElementById(targetId);
if (!panel) return;
event.preventDefault();
const opening = panel.hidden;
panel.hidden = !opening;
document.querySelectorAll('.tf-summary-detail-btn').forEach((other) => {
if (other.getAttribute('data-detail-target') !== targetId) return;
other.setAttribute('aria-expanded', opening ? 'true' : 'false');
other.textContent = opening ? 'Tutup' : 'Detail';
});
if (opening && panel.scrollIntoView) {
setTimeout(() => panel.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 0);
}
});
}
// REV289 — Pure PnL Pips summary path.
// When Filter by = PnL Pips, every value below is derived only from raw trade pips.
// It deliberately ignores Balance, Risk %, Lot Size, $/pip, PnL $, PnL %, Swap,
// Commission, and Withdraw. The USD summary path below remains unchanged.
if (equityMetric === 'pips') {
const pipsSummaryRole = tf_equitySummaryRenderRole === 'secondary' ? 'secondary' : 'primary';
const pipsStreakDetailId = 'tf-summary-detail-consecutive-pips-' + pipsSummaryRole;
const pipsDdDetailId = 'tf-summary-detail-maximum-pips-' + pipsSummaryRole;
const pipsNum = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
const pipsSigned = (v) => formatSignedPips(pipsNum(v), 1);
const pipsPlain = (v) => formatPips(pipsNum(v), 1);
const pipsColor = (v, neutral) => {
const n = Number(v);
if (!Number.isFinite(n) || n === 0) return neutral || '#cbd5e1';
return n > 0 ? '#22c55e' : '#ef4444';
};
function tf_summaryPipsOnlyDetailPanel(panelId, title, trades, totalPips, accentColor, description) {
if (!Array.isArray(trades) || !trades.length) return '';
let body = '';
trades.forEach((t, idx) => {
const tradePips = pipsNum(t && t.pnlPips);
const cumPips = pipsNum(t && t.cumulativePips);
body += '<tr>' +
'<td>' + (idx + 1) + '</td>' +
'<td><span class="mono">' + escHtml(t && t.date ? t.date : '-') + '</span></td>' +
'<td><span class="mono">' + escHtml(t && t.analyst ? t.analyst : 'Unknown') + '</span></td>' +
'<td><span class="mono">' + escHtml(t && t.pair ? t.pair : '-') + '</span></td>' +
'<td class="text-right"><span class="mono" style="color:' + pipsColor(tradePips, '#f8fafc') + ';">' + pipsSigned(tradePips) + '</span></td>' +
'<td class="text-right"><span class="mono" style="color:' + pipsColor(cumPips, '#f8fafc') + ';">' + pipsSigned(cumPips) + '</span></td>' +
'</tr>';
});
const total = pipsNum(totalPips);
return '<div class="tf-summary-detail-panel" id="' + escHtml(panelId) + '" data-summary-detail-role="' + escHtml(tf_equitySummaryRenderRole) + '" data-summary-detail-method="pips" hidden>' +
'<div class="tf-summary-detail-head"><strong style="color:' + accentColor + ';">' + title + '</strong><span>' + trades.length + ' trade</span></div>' +
'<div class="tf-summary-detail-method"><span class="tf-summary-detail-method-badge">Pure Pips</span><span>' + escHtml(description || 'Semua nilai dihitung hanya dari PnL pips setiap trade.') + '</span></div>' +
'<div class="tf-summary-detail-scroll"><table class="tf-summary-detail-table"><thead><tr>' +
'<th>#</th><th>Tanggal</th><th>Analis</th><th>Pair</th><th class="text-right">PnL Pips</th><th class="text-right">Akumulasi Pips</th>' +
'</tr></thead><tbody>' + body + '</tbody><tfoot><tr>' +
'<td colspan="4">Total PnL Pips</td><td class="text-right"><span class="mono" style="color:' + pipsColor(total, '#f8fafc') + ';">' + pipsSigned(total) + '</span></td><td></td>' +
'</tr></tfoot></table></div></div>';
}

let pipsHtml = '';
const pipsStartPoint = equityCurvePoints[0] || null;
const pipsLastPoint = equityCurvePoints[equityCurvePoints.length - 1] || null;
const startPipsOverall = pipsStartPoint && Number.isFinite(Number(pipsStartPoint.equity)) ? Number(pipsStartPoint.equity) : 0;
const lastPipsOverall = pipsLastPoint && Number.isFinite(Number(pipsLastPoint.equity)) ? Number(pipsLastPoint.equity) : startPipsOverall;
const totalPipsOverall = lastPipsOverall - startPipsOverall;
let highestPipsOverall = startPipsOverall;
let lowestPipsOverall = startPipsOverall;
equityCurvePoints.forEach((pt) => {
const v = Number(pt && pt.equity);
if (!Number.isFinite(v)) return;
if (v > highestPipsOverall) highestPipsOverall = v;
if (v < lowestPipsOverall) lowestPipsOverall = v;
});

// Consecutive loss, chosen strictly by negative PnL pips sequence.
if (maxStreakLength > 0 && bestStartIndex !== -1 && bestEndIndex !== -1) {
const streakStartPoint = equityCurvePoints[bestStartIndex] || null;
const streakEndPoint = equityCurvePoints[bestEndIndex] || null;
const beforePoint = bestStartIndex > 0 ? equityCurvePoints[bestStartIndex - 1] : pipsStartPoint;
const pipsBeforeStreak = beforePoint && Number.isFinite(Number(beforePoint.equity)) ? Number(beforePoint.equity) : startPipsOverall;
const pipsAfterStreak = streakEndPoint && Number.isFinite(Number(streakEndPoint.equity)) ? Number(streakEndPoint.equity) : pipsBeforeStreak;
let streakLossPips = 0;
const streakTradesPips = [];
for (let i = bestStartIndex; i <= bestEndIndex; i++) {
const pt = equityCurvePoints[i] || {};
const tradePips = pipsNum(pt.pnlPips);
streakLossPips += tradePips;
streakTradesPips.push({
date: pt.date || '-', analyst: pt.analyst || 'Unknown', pair: pt.pair || '-',
pnlPips: tradePips, cumulativePips: pipsNum(pt.equity)
});
}
pipsHtml += tf_summarySectionStart('1. Consecutive Loss Drawdown — Pure Pips', 'Rangkaian loss berturut-turut dihitung langsung dari PnL pips setiap trade.', '#ef4444');
pipsHtml += tf_summaryRowStart('streak-overview', 'Rangkaian consecutive loss dalam pips');
pipsHtml += tf_summaryMetric('Rentang streak loss', tf_summaryDateRange(streakStartPoint && streakStartPoint.date ? streakStartPoint.date : '-', streakEndPoint && streakEndPoint.date ? streakEndPoint.date : '-'), '#ef4444');
pipsHtml += tf_summaryMetric('Jumlah loss berturut-turut', maxStreakLength + 'x', '#ef4444');
pipsHtml += tf_summaryMetric('Total loss pips', pipsSigned(streakLossPips), '#ef4444', 'Penjumlahan langsung PnL pips seluruh trade loss dalam streak.', pipsStreakDetailId);
pipsHtml += '</div>';
pipsHtml += tf_summaryRowStart('streak-pips-level', 'Akumulasi pips pada streak');
pipsHtml += tf_summaryMetric('Pips sebelum loss pertama', pipsSigned(pipsBeforeStreak), pipsColor(pipsBeforeStreak));
pipsHtml += tf_summaryMetric('Pips setelah loss terakhir', pipsSigned(pipsAfterStreak), pipsColor(pipsAfterStreak));
pipsHtml += tf_summaryMetric('Perubahan pips pada streak', pipsSigned(streakLossPips), '#ef4444');
pipsHtml += '</div>';
pipsHtml += tf_summaryPipsOnlyDetailPanel(pipsStreakDetailId, 'Detail Trade Consecutive Loss — Pure Pips', streakTradesPips, streakLossPips, '#ef4444', 'PnL Pips dijumlahkan apa adanya sesuai urutan trade.');
pipsHtml += '</section>';
}
else {
pipsHtml += tf_summarySectionStart('1. Consecutive Loss Drawdown — Pure Pips', 'Rangkaian loss berturut-turut dihitung hanya dari PnL pips per trade.', '#ef4444');
pipsHtml += '<div class="tf-summary-empty">Belum ada consecutive loss berbasis pips untuk filter saat ini.</div></section>';
}

// Maximum drawdown is peak cumulative pips -> subsequent lowest cumulative pips.
const pipsHigh = ddPeakPoint && Number.isFinite(Number(ddPeakPoint.equity)) ? Number(ddPeakPoint.equity) : startPipsOverall;
const pipsLow = ddTroughPoint && Number.isFinite(Number(ddTroughPoint.equity)) ? Number(ddTroughPoint.equity) : pipsHigh;
const pipsDrawdown = pipsLow - pipsHigh;
const ddTradesPips = [];
let ddTradePipsTotal = 0;
if (ddTroughIdx > ddPeakIdx) {
for (let i = ddPeakIdx + 1; i <= ddTroughIdx; i++) {
const pt = equityCurvePoints[i] || {};
const tradePips = pipsNum(pt.pnlPips);
ddTradePipsTotal += tradePips;
ddTradesPips.push({
date: pt.date || '-', analyst: pt.analyst || 'Unknown', pair: pt.pair || '-',
pnlPips: tradePips, cumulativePips: pipsNum(pt.equity)
});
}
}
pipsHtml += tf_summarySectionStart('2. Maximum Pips Drawdown — High Pips → Low Pips', 'Penurunan terdalam pada kurva akumulasi pips. High dan Low berasal langsung dari cumulative pips, tanpa konversi finansial.', '#fbbf24');
pipsHtml += tf_summaryRowStart('maximum-overview', 'Rentang penurunan pips terdalam');
pipsHtml += tf_summaryMetric('Rentang High → Low', tf_summaryDateRange(ddPeakDate, ddTroughDate), '#fbbf24');
pipsHtml += tf_summaryMetric('High Pips', pipsSigned(pipsHigh), pipsColor(pipsHigh, '#fbbf24'));
pipsHtml += tf_summaryMetric('Low Pips', pipsSigned(pipsLow), pipsColor(pipsLow, '#fbbf24'));
pipsHtml += tf_summaryMetric('Maximum Drawdown Pips', pipsSigned(pipsDrawdown), '#ef4444', 'Low Pips − High Pips.', ddTradesPips.length ? pipsDdDetailId : null);
pipsHtml += '</div>';
pipsHtml += tf_summaryRowStart('maximum-pips-math', 'Perhitungan pips murni');
pipsHtml += tf_summaryMetric('Total PnL Pips pada rentang High → Low', pipsSigned(ddTradePipsTotal), pipsColor(ddTradePipsTotal));
pipsHtml += tf_summaryMetric('Akumulasi High Pips', pipsSigned(pipsHigh), '#fbbf24');
pipsHtml += tf_summaryMetric('Akumulasi Low Pips', pipsSigned(pipsLow), '#ef4444');
pipsHtml += '</div>';
if (ddTradesPips.length) {
pipsHtml += tf_summaryPipsOnlyDetailPanel(pipsDdDetailId, 'Detail Trade Maximum Drawdown — Pure Pips', ddTradesPips, ddTradePipsTotal, '#fbbf24', 'Drawdown = titik High cumulative pips menuju Low cumulative pips berikutnya. Semua trade dihitung hanya dalam pips.');
}
pipsHtml += '</section>';

// Keep the established section title, but every metric inside is pips-only.
pipsHtml += tf_summarySectionStart('3. Ringkasan Balance Keseluruhan', 'Ringkasan akumulasi pips murni dari awal sampai trade terakhir pada filter saat ini.', '#38bdf8');
pipsHtml += tf_summaryRowStart('balance-overall', 'Akumulasi pips keseluruhan');
pipsHtml += tf_summaryMetric('Pips awal', pipsPlain(startPipsOverall), '#cbd5e1');
pipsHtml += tf_summaryMetric('Last Pips', pipsSigned(lastPipsOverall), pipsColor(lastPipsOverall));
pipsHtml += tf_summaryMetric('Total PnL Pips', pipsSigned(totalPipsOverall), pipsColor(totalPipsOverall));
pipsHtml += '</div>';
pipsHtml += tf_summaryRowStart('balance-risk-pct', 'Ringkasan risiko pips');
pipsHtml += tf_summaryMetric('Highest Pips', pipsSigned(highestPipsOverall), pipsColor(highestPipsOverall, '#38bdf8'));
pipsHtml += tf_summaryMetric('Lowest Pips', pipsSigned(lowestPipsOverall), pipsColor(lowestPipsOverall, '#38bdf8'));
pipsHtml += tf_summaryMetric('Consecutive Loss — Pips', maxStreakLength > 0 ? pipsSigned(maxStreakLoss) : pipsPlain(0), maxStreakLength > 0 ? '#ef4444' : '#cbd5e1');
pipsHtml += tf_summaryMetric('Maximum Drawdown — Pips', pipsSigned(pipsDrawdown), pipsDrawdown < 0 ? '#ef4444' : '#cbd5e1');
pipsHtml += '</div></section>';

detailEl.innerHTML = pipsHtml;
// Preserve REV190 layout: section 3 stays above PRIMARY/SECONDARY title.
if (tf_equitySummaryRenderRole === 'primary') {
try {
const primarySummary = document.getElementById('equity-drawdown-summary');
const primaryTitle = document.getElementById('tf-equity-summary-primary-title');
if (primarySummary) {
primarySummary.querySelectorAll(':scope > .tf-summary-balance-hoisted').forEach((node) => node.remove());
const balanceSection = detailEl.querySelector('.tf-summary-section[data-summary-section="balance"]');
if (balanceSection) {
balanceSection.classList.add('tf-summary-balance-hoisted');
balanceSection.setAttribute('data-tf-hoisted', '1');
if (primaryTitle) primarySummary.insertBefore(balanceSection, primaryTitle);
else primarySummary.insertBefore(balanceSection, primarySummary.firstChild);
}
}
}
catch (e) { }
}
tf_setupSummaryDetailToggle();
return;
}

function tf_pctStr(lossAbs, baseEquity) {
try {
if (equityMetric !== 'usd')
return '';
const b = Number(baseEquity);
const l = Number(lossAbs);
if (!isFinite(b) || !isFinite(l) || b === 0)
return '';
const pct = (l / Math.abs(b)) * 100;
if (!isFinite(pct))
return '';
const rounded = Math.round(pct);
const showInt = Math.abs(pct - rounded) < 0.05;
const s = showInt ? String(rounded) : String(Math.round(pct * 10) / 10).replace(/\.0$/, '');
return s + '%';
}
catch (e) {
return '';
}
}
function tf_pctRemainStr(lastEquity, baseEquity) {
try {
if (equityMetric !== 'usd')
return '';
const b = Number(baseEquity);
const l = Number(lastEquity);
if (!isFinite(b) || !isFinite(l) || b === 0)
return '';
const pct = (l / Math.abs(b)) * 100;
if (!isFinite(pct))
return '';
const rounded = Math.round(pct);
const showInt = Math.abs(pct - rounded) < 0.05;
const s = showInt ? String(rounded) : String(Math.round(pct * 10) / 10).replace(/\.0$/, '');
return s + '%';
}
catch (e) {
return '';
}
}
function tf_tradePnlPctSignedStr(value) {
try {
const v = Number(value);
if (!Number.isFinite(v))
return '';
const rounded2 = Math.round(v * 100) / 100;
const rounded1 = Math.round(v * 10) / 10;
const rounded0 = Math.round(v);
let text = '';
if (Math.abs(v - rounded0) < 0.005) text = String(rounded0);
else if (Math.abs(v - rounded1) < 0.005) text = String(rounded1).replace(/\.0$/, '');
else text = String(rounded2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
if (v > 0 && text.charAt(0) !== '+') text = '+' + text;
return text + '%';
}
catch (e) {
return '';
}
}
function tf_balanceMoneyStr(val) {
try {
const v = Number(val);
if (!isFinite(v))
return '-';
if (v < 0)
return '-' + formatMoney(Math.abs(v));
return formatMoney(v);
}
catch (e) {
return '-';
}
function tf_getStartBalanceForEquityMaxDD(ddPeakPoint, ddBaseEquity) {
try {
if (equityMetric !== 'usd')
return ddBaseEquity;
let startBal = null;
if (riskMode === 'compound') {
const mk = ddPeakPoint && (ddPeakPoint.sortKey != null) ? tf_monthKeyFromSortKey(ddPeakPoint.sortKey) : null;
const srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
if (mk && Array.isArray(srcRows) && srcRows.length) {
const sk = ddPeakPoint ? ddPeakPoint.sortKey : null;
const a = ddPeakPoint && ddPeakPoint.analyst ? String(ddPeakPoint.analyst) : '';
const p = ddPeakPoint && ddPeakPoint.pair ? String(ddPeakPoint.pair) : '';
if (sk != null) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r)
continue;
if (r.sortKey === sk && String(r.analyst || '') === a && String(r.pair || '') === p && Number.isFinite(r.balanceCompound) && r.balanceCompound > 0) {
startBal = r.balanceCompound;
break;
}
}
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r)
continue;
const rmk = tf_monthKeyFromSortKey(r.sortKey);
if (rmk === mk && Number.isFinite(r.balanceCompound) && r.balanceCompound > 0) {
startBal = r.balanceCompound;
break;
}
}
}
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
if (Number.isFinite(currentBalance) && currentBalance > 0)
startBal = currentBalance;
}
}
else {
if (Number.isFinite(currentBalance) && currentBalance > 0)
startBal = currentBalance;
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
startBal = ddBaseEquity;
}
return (Number.isFinite(startBal) ? startBal : ddBaseEquity);
}
catch (e) {
return ddBaseEquity;
}
}
}
const summaryRole = tf_equitySummaryRenderRole === 'secondary' ? 'secondary' : 'primary';
const streakHistoryDetailId = 'tf-summary-detail-consecutive-history-' + summaryRole;
const streakPnlPctDetailId = 'tf-summary-detail-consecutive-pnlpct-' + summaryRole;
const maxHistoryDetailId = 'tf-summary-detail-maximum-history-' + summaryRole;
const maxPnlPctDetailId = 'tf-summary-detail-maximum-pnlpct-' + summaryRole;
let tf_summaryConsecutivePnlPctForOverall = '-';
let tf_summaryMaximumPnlPctForOverall = '-';

if (maxStreakLength > 0 && bestStartIndex !== -1 && bestEndIndex !== -1) {
const startPoint = equityCurvePoints[bestStartIndex];
const endPoint = equityCurvePoints[bestEndIndex];
const streakStartCapital = (function () {
try {
const initialCapital = Number(currentBalance);
let capital = Number.isFinite(initialCapital) ? initialCapital : 0;
for (let i = 1; i < bestStartIndex; i++) {
const p = equityCurvePoints[i];
capital += p && Number.isFinite(Number(p.pnlDollar)) ? Number(p.pnlDollar) : 0;
}
return Number.isFinite(capital) ? capital : null;
}
catch (e) { return null; }
})();
let streakDollarLoss = 0;
let streakPctTotal = 0;
let streakPctHasValue = false;
let streakRunningBalance = Number.isFinite(streakStartCapital) ? streakStartCapital : null;
const streakDetailTrades = [];
for (let i = bestStartIndex; i <= bestEndIndex; i++) {
const p = equityCurvePoints[i] || {};
const pnlDollar = Number.isFinite(Number(p.pnlDollar)) ? Number(p.pnlDollar) : 0;
const pnlPips = Number.isFinite(Number(p.pnlPips)) ? Number(p.pnlPips) : 0;
const pnlPct = Number.isFinite(Number(p.pnlPercent)) ? Number(p.pnlPercent) : null;
streakDollarLoss += pnlDollar;
if (pnlPct !== null && pnlPct < 0) {
streakPctTotal += Math.abs(pnlPct);
streakPctHasValue = true;
}
if (streakRunningBalance !== null) streakRunningBalance += pnlDollar;
streakDetailTrades.push({
date: p.date || '-', analyst: p.analyst || 'Unknown', pair: p.pair || '-',
pnlPips, pnlDollar, pnlPercent: pnlPct,
balanceAfter: streakRunningBalance, isWithdraw: !!p.isWithdraw
});
}
const streakEndCapital = Number.isFinite(streakStartCapital) ? streakStartCapital + streakDollarLoss : null;
const tf_streakCapitalPctStr = function (value, base) {
try {
const v = Number(value), b = Number(base);
if (!Number.isFinite(v) || !Number.isFinite(b) || b === 0) return '';
const pct = (v / Math.abs(b)) * 100;
if (!Number.isFinite(pct)) return '';
const rounded = Math.round(pct), showInt = Math.abs(pct - rounded) < 0.05;
return (showInt ? String(rounded) : String(Math.round(pct * 10) / 10).replace(/\.0$/, '')) + '%';
}
catch (e) { return ''; }
};
const streakTradePercentLoss = streakPctHasValue ? streakPctTotal : null;
const streakPct = streakTradePercentLoss === null ? '' : String(Math.round(streakTradePercentLoss * 100) / 100).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1') + '%';
tf_summaryConsecutivePnlPctForOverall = streakPct || '-';
const streakActualDrawdownPct = (Number.isFinite(streakStartCapital) && streakStartCapital !== 0)
? tf_streakCapitalPctStr(Math.abs(streakDollarLoss), streakStartCapital) : '';
const streakPeriodRemainPct = tf_streakCapitalPctStr(streakEndCapital, streakStartCapital);
const streakInputCapital = Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : null;
// REV180: the input-capital row is a separate scenario. It applies the same
// consecutive-loss dollar result to the user's initial Balance, so the ending
// value must decrease from that input instead of reusing the later historical
// balance where the streak actually occurred.
const streakInputEndCapital = (Number.isFinite(streakInputCapital) && Number.isFinite(streakDollarLoss))
? streakInputCapital + streakDollarLoss : null;
const streakInputRemainPct = tf_streakCapitalPctStr(streakInputEndCapital, streakInputCapital);
const startDate = startPoint && startPoint.date ? startPoint.date : '-';
const endDate = endPoint && endPoint.date ? endPoint.date : '-';
const streakInputCapitalText = priceBusy ? tf_spinnerHTML(true) : (streakInputCapital === null ? '-' : tf_balanceMoneyStr(streakInputCapital));
const streakInputEndCapitalText = priceBusy ? tf_spinnerHTML(true) : (streakInputEndCapital === null ? '-' : tf_balanceMoneyStr(streakInputEndCapital));
const streakStartCapitalText = priceBusy ? tf_spinnerHTML(true) : (streakStartCapital === null ? '-' : tf_balanceMoneyStr(streakStartCapital));
const streakEndCapitalText = priceBusy ? tf_spinnerHTML(true) : (streakEndCapital === null ? '-' : tf_balanceMoneyStr(streakEndCapital));

html += tf_summarySectionStart('1. Consecutive Loss Drawdown', 'Khusus rangkaian trade loss berturut-turut tanpa trade profit di antaranya. Tidak sama dengan penurunan High Equity → Low Equity.', '#ef4444');
html += tf_summaryRowStart('streak-overview', 'Rangkaian consecutive loss');
html += tf_summaryMetric('Rentang streak loss', tf_summaryDateRange(startDate, endDate), '#ef4444');
html += tf_summaryMetric('Jumlah loss berturut-turut', maxStreakLength + 'x', '#ef4444', 'Gabungan seluruh Analis–Pair sesuai filter.');
html += tf_summaryMetric('Total loss — History/Timeframe', priceBusy ? tf_spinnerHTML(true) : formatSignedMoney(streakDollarLoss), '#ef4444', 'Total PnL dolar dari streak sesuai History dan Time Range yang sedang aktif.');
html += '</div>';
html += tf_summaryRowStart('streak-percent', 'Metode perhitungan consecutive loss');
html += tf_summaryMetric('Consecutive Loss — History/Timeframe', streakActualDrawdownPct || '-', '#ef4444', 'Persentase penurunan balance pada streak sesuai History dan Time Range aktif: total loss ÷ modal sebelum loss pertama.', streakHistoryDetailId);
html += tf_summaryMetric('Consecutive Loss — PnL % (Akumulasi)', streakPct || '-', '#ef4444', 'Akumulasi PnL % dari setiap trade loss dalam streak.', streakPnlPctDetailId);
html += '</div>';
html += tf_summaryRowStart('streak-input-capital', 'Simulasi streak terhadap modal awal input');
html += tf_summaryMetric('Modal awal input', streakInputCapitalText, '#ef4444');
html += tf_summaryMetric('Modal akhir dari input', streakInputEndCapitalText, '#ef4444', 'Modal awal input + total loss streak.');
html += tf_summaryMetric('Sisa modal input', streakInputRemainPct || '-', '#ef4444');
html += '</div>';
html += tf_summaryRowStart('streak-history-capital', 'Modal pada History saat streak terjadi');
html += tf_summaryMetric('Modal sebelum loss pertama', streakStartCapitalText, '#ef4444');
html += tf_summaryMetric('Modal setelah loss terakhir', streakEndCapitalText, '#ef4444');
html += tf_summaryMetric('Sisa modal periode streak', streakPeriodRemainPct || '-', '#ef4444');
html += '</div>';
html += tf_summaryDetailPanel(streakHistoryDetailId, 'Detail Trade Consecutive Loss — History/Timeframe', streakDetailTrades, streakDollarLoss, streakActualDrawdownPct || '-', '#ef4444', 'history', 'Persentase History/Timeframe = total perubahan balance pada streak ÷ modal sebelum loss pertama.');
html += tf_summaryDetailPanel(streakPnlPctDetailId, 'Detail Trade Consecutive Loss — PnL % (Akumulasi)', streakDetailTrades, streakDollarLoss, streakPct || '-', '#ef4444', 'pnlpct', 'PnL % (Akumulasi) = jumlah PnL % setiap trade loss dalam streak.');
html += '</section>';
}
else {
html += tf_summarySectionStart('1. Consecutive Loss Drawdown', 'Khusus rangkaian trade loss berturut-turut tanpa trade profit di antaranya.', '#ef4444');
html += '<div class="tf-summary-empty">Belum ada periode consecutive loss yang dapat dihitung untuk filter saat ini.</div></section>';
}

const ddBaseEquity = ddPeakPoint && Number.isFinite(Number(ddPeakPoint.equity)) ? Number(ddPeakPoint.equity) : null;
const ddLowEquity = ddTroughPoint && Number.isFinite(Number(ddTroughPoint.equity)) ? Number(ddTroughPoint.equity) : null;
const ddLossFromHigh = (ddBaseEquity !== null && ddLowEquity !== null) ? ddLowEquity - ddBaseEquity : null;
const ddActualCapitalDelta = (Number.isFinite(Number(ddCapitalAtPeakUsd)) && Number.isFinite(Number(ddCapitalAtTroughUsd)))
? Number(ddCapitalAtTroughUsd) - Number(ddCapitalAtPeakUsd) : null;
const ddActualPctRaw = (Number.isFinite(Number(ddCapitalAtPeakUsd)) && Number(ddCapitalAtPeakUsd) !== 0 && ddActualCapitalDelta !== null)
? (Math.abs(ddActualCapitalDelta) / Math.abs(Number(ddCapitalAtPeakUsd))) * 100 : null;
const ddActualPct = Number.isFinite(ddActualPctRaw) ? '-' + String(Math.round(ddActualPctRaw * 100) / 100).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1') + '%' : '-';
const ddTradePctText = tf_tradePnlPctSignedStr(ddTradePercentNet) || '-';
tf_summaryMaximumPnlPctForOverall = ddTradePctText;
const ddRangeStartBalance = (function () {
try {
if (equityMetric !== 'usd') return null;
if (riskMode !== 'compound') return Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : null;
const srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length) ? tf_lastEquityCalcRows : (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
let firstRow = null;
for (const r of srcRows) {
if (!r || !Number.isFinite(Number(r.sortKey))) continue;
if (!firstRow || Number(r.sortKey) < Number(firstRow.sortKey)) firstRow = r;
}
if (firstRow && Number.isFinite(Number(firstRow.balanceCompound)) && Number(firstRow.balanceCompound) > 0) return Number(firstRow.balanceCompound);
return Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : null;
}
catch (e) { return null; }
})();
function tf_pctSignedStr(delta, base) {
try {
if (equityMetric !== 'usd') return '';
const b = Number(base), d = Number(delta);
if (!Number.isFinite(b) || b === 0 || !Number.isFinite(d)) return '';
const pct = Math.abs(d / b) * 100;
const text = String(Math.round(pct * 100) / 100).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
return (d > 0 ? '+' : (d < 0 ? '-' : '')) + text + '%';
}
catch (e) { return ''; }
}
function tf_pctFromBaseStr(value, base) {
const v = Number(value), b = Number(base);
return Number.isFinite(v) && Number.isFinite(b) && b !== 0 ? tf_pctSignedStr(v - b, b) : '';
}
const ddHighHtml = priceBusy ? tf_spinnerHTML(true) : (ddBaseEquity === null ? '-' : (equityMetric === 'usd' ? tf_balanceMoneyStr(ddBaseEquity) : formatPlainNumber(ddBaseEquity, 2)));
const ddLowHtml = priceBusy ? tf_spinnerHTML(true) : (ddLowEquity === null ? '-' : (equityMetric === 'usd' ? tf_balanceMoneyStr(ddLowEquity) : formatPlainNumber(ddLowEquity, 2)));
const ddHighPct = ddRangeStartBalance ? tf_pctFromBaseStr(ddBaseEquity, ddRangeStartBalance) : '';
const ddLowPct = ddRangeStartBalance ? tf_pctFromBaseStr(ddLowEquity, ddRangeStartBalance) : '';
const ddStartEquity = Number.isFinite(Number(ddCapitalAtPeakUsd)) ? Number(ddCapitalAtPeakUsd) : tf_getStartBalanceForEquityMaxDD(ddPeakPoint, ddBaseEquity);
const ddLastEquity = Number.isFinite(Number(ddCapitalAtTroughUsd)) ? Number(ddCapitalAtTroughUsd) : ((Number.isFinite(Number(ddStartEquity)) && Number.isFinite(Number(ddDetailTotalDollar))) ? Number(ddStartEquity) + Number(ddDetailTotalDollar) : null);
const ddDelta = (Number.isFinite(Number(ddStartEquity)) && Number.isFinite(Number(ddLastEquity))) ? Number(ddLastEquity) - Number(ddStartEquity) : null;
const ddRemainPct = (equityMetric === 'usd' && Number.isFinite(Number(ddLastEquity)) && Number.isFinite(Number(ddStartEquity)) && Number(ddStartEquity) !== 0)
? String(Math.round((Number(ddLastEquity) / Math.abs(Number(ddStartEquity))) * 10000) / 100).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1') + '%' : '-';
const isMarginCall = Number.isFinite(Number(ddStartEquity)) && Number(ddStartEquity) > 0 && Number.isFinite(Number(ddLastEquity)) && Number(ddLastEquity) <= 0;

html += tf_summarySectionStart('2. Maximum Equity Drawdown — High Equity → Low Equity', 'Penurunan paling tajam dari puncak equity tertinggi menuju titik equity terendah berikutnya. Periode ini dapat berisi trade loss dan trade profit.', '#fbbf24');
html += tf_summaryRowStart('maximum-overview', 'Rentang penurunan equity terdalam');
html += tf_summaryMetric('Rentang High → Low', tf_summaryDateRange(ddPeakDate, ddTroughDate), '#fbbf24');
html += tf_summaryMetric(equityMetric === 'usd' ? 'High equity' : 'High Pips', ddHighHtml + (ddHighPct ? ' <span class="tf-summary-inline-pct">(' + ddHighPct + ')</span>' : ''), '#fbbf24');
html += tf_summaryMetric(equityMetric === 'usd' ? 'Low equity' : 'Low Pips', ddLowHtml + (ddLowPct ? ' <span class="tf-summary-inline-pct">(' + ddLowPct + ')</span>' : ''), '#fbbf24');
html += tf_summaryMetric(equityMetric === 'usd' ? 'Penurunan equity — History/Timeframe' : 'Penurunan Pips — History/Timeframe', priceBusy ? tf_spinnerHTML(true) : (ddLossFromHigh === null ? '-' : formatEquityMetricSigned(ddLossFromHigh)), '#ef4444', 'Penurunan nilai dari High menuju Low berdasarkan History dan Time Range aktif.');
html += '</div>';
html += tf_summaryRowStart('maximum-percent', 'Metode perhitungan maximum drawdown');
html += tf_summaryMetric('Maximum Drawdown — History/Timeframe', ddActualPct, '#ef4444', 'Persentase penurunan equity dari High menuju Low berdasarkan History dan Time Range aktif.', maxHistoryDetailId);
html += tf_summaryMetric('Maximum Drawdown — PnL % (Akumulasi)', ddTradePctText, '#ef4444', 'Akumulasi PnL % seluruh trade dalam rentang High → Low; withdraw tidak dihitung.', maxPnlPctDetailId);
html += '</div>';
html += tf_summaryRowStart('maximum-capital', 'Modal pada periode maximum drawdown');
html += tf_summaryMetric('Modal sebelum maximum drawdown', priceBusy ? tf_spinnerHTML(true) : (ddStartEquity === null ? '-' : tf_balanceMoneyStr(ddStartEquity)), '#fbbf24');
html += tf_summaryMetric('Modal setelah maximum drawdown', priceBusy ? tf_spinnerHTML(true) : (ddLastEquity === null ? '-' : tf_balanceMoneyStr(ddLastEquity)), '#fbbf24');
html += tf_summaryMetric('Perubahan balance pada periode', priceBusy ? tf_spinnerHTML(true) : (ddDelta === null ? '-' : formatEquityMetricSigned(ddDelta)), '#ef4444');
html += tf_summaryMetric('Sisa modal periode drawdown', ddRemainPct, '#ef4444');
if (isMarginCall) html += tf_summaryMetric('Status risiko', '<span style="color:#ef4444;font-weight:800;">MARGIN CALL!</span>', '#ef4444');
html += '</div>';
html += tf_summaryDetailPanel(maxHistoryDetailId, 'Detail Trade Maximum Drawdown — History/Timeframe', ddDetailTrades, ddDetailTotalDollar, ddActualPct, '#fbbf24', 'history', 'Persentase History/Timeframe = penurunan High Equity → Low Equity berdasarkan balance/equity pada History dan Time Range aktif.');
html += tf_summaryDetailPanel(maxPnlPctDetailId, 'Detail Trade Maximum Drawdown — PnL % (Akumulasi)', ddDetailTrades, ddDetailTotalDollar, ddTradePctText, '#fbbf24', 'pnlpct', 'PnL % (Akumulasi) = jumlah PnL % seluruh trade dalam rentang High → Low; withdraw tidak dihitung sebagai PnL trade.');
html += '</section>';

if (equityMetric === 'usd' || equityMetric === 'pips') {
try {
const startOverall = Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : 0;
const srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length) ? tf_lastEquityCalcRows : (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
let lastRow = null, lastSk = -Infinity;
for (const r of srcRows) {
if (!r || r.isStart) continue;
const sk = tf_getPrimarySortKey(r);
if (!Number.isFinite(sk) || sk < lastSk) continue;
lastRow = r; lastSk = sk;
}
const lastOverall = lastRow && Number.isFinite(Number(lastRow.balancePnl)) ? Number(lastRow.balancePnl) : (lastRow && Number.isFinite(Number(lastRow.balanceCompound)) ? Number(lastRow.balanceCompound) : null);
const deltaOverall = lastOverall === null ? null : lastOverall - startOverall;
const deltaColor = Number.isFinite(deltaOverall) ? (deltaOverall > 0 ? '#22c55e' : (deltaOverall < 0 ? '#ef4444' : '#9ca3af')) : '#9ca3af';
const overallPct = deltaOverall !== null && startOverall !== 0 ? (() => {
const pct = Math.abs(Number(deltaOverall) / Number(startOverall)) * 100;
if (!Number.isFinite(pct)) return '';
const text = String(Math.round(pct * 100) / 100).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
return (deltaOverall > 0 ? '+' : (deltaOverall < 0 ? '-' : '')) + text + '%';
})() : '';
// REV288: tampilkan Ringkasan Balance Keseluruhan pada mode PnL ($) maupun PnL Pips.
html += tf_summarySectionStart('3. Ringkasan Balance Keseluruhan', 'Ringkasan modal dari awal input sampai trade terakhir pada filter saat ini.', '#38bdf8');
html += tf_summaryRowStart('balance-overall', 'Balance keseluruhan');
html += tf_summaryMetric('Modal awal input', priceBusy ? tf_spinnerHTML(true) : tf_balanceMoneyStr(startOverall), '#cbd5e1');
html += tf_summaryMetric('Last Balance', priceBusy ? tf_spinnerHTML(true) : (lastOverall === null ? '-' : tf_balanceMoneyStr(lastOverall)), deltaColor);
html += tf_summaryMetric('Kenaikan / penurunan balance', priceBusy ? tf_spinnerHTML(true) : (deltaOverall === null ? '-' : formatSignedMoney(deltaOverall) + (overallPct ? ' (' + overallPct + ')' : '')), deltaColor);
html += '</div>';
html += tf_summaryRowStart('balance-risk-pct', 'Ringkasan risiko PnL % (Akumulasi)');
// REV204: show the exact longest consecutive-loss count beside its accumulated PnL %.
// maxStreakLength is the same combined Analis–Pair streak count used by the
// "Jumlah loss berturut-turut" metric above, so both summaries stay identical.
const tf_summaryConsecutivePnlPctOverallHtml = (maxStreakLength > 0 && tf_summaryConsecutivePnlPctForOverall && tf_summaryConsecutivePnlPctForOverall !== '-')
? tf_summaryConsecutivePnlPctForOverall + ' <strong class="tf-summary-cons-loss-count">(' + maxStreakLength + 'x Cons Loss)</strong>'
: '-';
html += tf_summaryMetric('Consecutive Loss — PnL % (Akumulasi)', tf_summaryConsecutivePnlPctOverallHtml, '#ef4444', 'Jumlah Cons Loss mengikuti "Jumlah loss berturut-turut" — gabungan seluruh Analis–Pair sesuai filter.');
html += tf_summaryMetric('Maximum Drawdown — PnL % (Akumulasi)', tf_summaryMaximumPnlPctForOverall || '-', '#ef4444');
html += '</div></section>';
}
catch (e) { }
}
detailEl.innerHTML = html;
// REV190: Ringkasan Balance Keseluruhan tampil di atas title PRIMARY agar
// customer melihat modal + dua risk PnL% utama sebelum blok risiko detail.
if (tf_equitySummaryRenderRole === 'primary') {
try {
const primarySummary = document.getElementById('equity-drawdown-summary');
const primaryTitle = document.getElementById('tf-equity-summary-primary-title');
if (primarySummary) {
primarySummary.querySelectorAll(':scope > .tf-summary-balance-hoisted').forEach((node) => node.remove());
const balanceSection = detailEl.querySelector('.tf-summary-section[data-summary-section="balance"]');
if (balanceSection) {
balanceSection.classList.add('tf-summary-balance-hoisted');
balanceSection.setAttribute('data-tf-hoisted', '1');
if (primaryTitle) primarySummary.insertBefore(balanceSection, primaryTitle);
else primarySummary.insertBefore(balanceSection, primarySummary.firstChild);
}
}
}
catch (e) { }
}
tf_setupSummaryDetailToggle();
}

function computeAndRenderDrawdownStats(rows) {
const overall = makeEmptyStreakState();
const perAnalystStates = new Map();
const priceBusy = tf_isMyfxbookPriceLoading();
rows.forEach((row) => {
tf_updateStreakStateFixedLot(overall, row);
const key = (row && row.isWithdraw) ? 'Withdraw' : (row.analyst || 'Unknown');
if (!perAnalystStates.has(key)) {
perAnalystStates.set(key, makeEmptyStreakState());
}
updateStreakState(perAnalystStates.get(key), row);
});
try {
finalizeStreakState(overall);
}
catch (e) { }
try {
perAnalystStates.forEach((st) => { try {
finalizeStreakState(st);
}
catch (e) { } });
}
catch (e) { }
const chipsContainer = document.getElementById('drawdown-overall-chips');
if (chipsContainer) {
chipsContainer.innerHTML = '';
const chip1 = document.createElement('span');
chip1.className = 'chip';
chip1.textContent =
'Max Consecutive Profit (Total): ' +
overall.maxProfitTrades +
' trades, ' +
formatNumber(overall.maxProfitPips || 0, 1) +
' pips, ' +
formatMoney(overall.maxProfitDollar || 0);
chipsContainer.appendChild(chip1);
const chip2 = document.createElement('span');
chip2.className = 'chip';
chip2.textContent =
'Max Consecutive Loss (Total Drawdown): ' +
overall.maxLossTrades +
' trades, ' +
formatNumber(overall.maxLossPips || 0, 1) +
' pips, ' +
formatMoney(overall.maxLossDollar || 0);
chipsContainer.appendChild(chip2);
const chip3 = document.createElement('span');
chip3.className = 'chip';
chip3.textContent = 'Total trades di history: ' + rows.length;
chipsContainer.appendChild(chip3);
}
const tbody = document.querySelector('#drawdown-table tbody');
if (tbody) {
tbody.innerHTML = '';
const analystNames = Array.from(perAnalystStates.keys()).sort((a, b) => a.localeCompare(b));
const detailByAnalyst = {};
analystNames.forEach((name) => {
const st = perAnalystStates.get(name);
detailByAnalyst[name] = st;
const tr = document.createElement('tr');
try {
tr.dataset.analyst = name;
}
catch (e) { }
const ctrlCell = document.createElement('td');
ctrlCell.className = 'dd-details-control';
ctrlCell.textContent = '▶';
tr.appendChild(ctrlCell);
const nameCell = document.createElement('td');
nameCell.textContent = name;
tr.appendChild(nameCell);
const maxProfitTradesCell = document.createElement('td');
maxProfitTradesCell.className = 'mono tp';
maxProfitTradesCell.textContent = st.maxProfitTrades || 0;
tr.appendChild(maxProfitTradesCell);
const profitBucket = st && st.profitRuns ? st.profitRuns[st.maxProfitTrades || 0] : null;
const maxProfitCountCell = document.createElement('td');
maxProfitCountCell.className = 'mono tp';
maxProfitCountCell.textContent = (st.maxProfitTrades || 0) ? ((profitBucket && profitBucket.count) ? profitBucket.count : 0) : '-';
tr.appendChild(maxProfitCountCell);
const maxProfitPipsCell = document.createElement('td');
maxProfitPipsCell.className = 'mono tp';
maxProfitPipsCell.textContent = st.maxProfitPips ? formatNumber(st.maxProfitPips, 1) : '-';
tr.appendChild(maxProfitPipsCell);
const maxProfitDollarCell = document.createElement('td');
maxProfitDollarCell.className = 'mono tp';
if (priceBusy) {
maxProfitDollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
maxProfitDollarCell.textContent = st.maxProfitDollar ? formatMoney(st.maxProfitDollar) : '-';
}
tr.appendChild(maxProfitDollarCell);
const maxLossTradesCell = document.createElement('td');
maxLossTradesCell.className = 'mono sl';
maxLossTradesCell.textContent = st.maxLossTrades || 0;
tr.appendChild(maxLossTradesCell);
const lossBucket = st && st.lossRuns ? st.lossRuns[st.maxLossTrades || 0] : null;
const maxLossCountCell = document.createElement('td');
maxLossCountCell.className = 'mono sl';
maxLossCountCell.textContent = (st.maxLossTrades || 0) ? ((lossBucket && lossBucket.count) ? lossBucket.count : 0) : '-';
tr.appendChild(maxLossCountCell);
const maxLossPipsCell = document.createElement('td');
maxLossPipsCell.className = 'mono sl';
maxLossPipsCell.textContent = st.maxLossPips ? formatNumber(st.maxLossPips, 1) : '-';
tr.appendChild(maxLossPipsCell);
const maxLossDollarCell = document.createElement('td');
maxLossDollarCell.className = 'mono sl';
if (priceBusy) {
maxLossDollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
maxLossDollarCell.textContent = st.maxLossDollar ? formatMoney(st.maxLossDollar) : '-';
}
tr.appendChild(maxLossDollarCell);
tbody.appendChild(tr);
});
try {
window.__tfDrawdownDetailByAnalyst = detailByAnalyst;
}
catch (e) { }
try {
tf_bindDrawdownDetailsHandler();
}
catch (e) { }
}
const totalTbody = document.querySelector('#drawdown-total-table tbody');
if (totalTbody) {
totalTbody.innerHTML = '';
const trProfit = document.createElement('tr');
const typeProfit = document.createElement('td');
typeProfit.textContent = 'Consecutive Profit (Total)';
trProfit.appendChild(typeProfit);
const profitTrades = document.createElement('td');
profitTrades.className = 'text-right mono tp';
profitTrades.textContent = overall.maxProfitTrades || 0;
trProfit.appendChild(profitTrades);
const profitPips = document.createElement('td');
profitPips.className = 'text-right mono tp';
profitPips.textContent = overall.maxProfitPips ? formatNumber(overall.maxProfitPips, 1) : '-';
trProfit.appendChild(profitPips);
const profitDollar = document.createElement('td');
profitDollar.className = 'text-right mono tp';
if (priceBusy) {
profitDollar.innerHTML = tf_spinnerHTML(true);
}
else {
profitDollar.textContent = overall.maxProfitDollar ? formatMoney(overall.maxProfitDollar) : '-';
}
trProfit.appendChild(profitDollar);
const trLoss = document.createElement('tr');
const typeLoss = document.createElement('td');
typeLoss.textContent = 'Consecutive Loss (Total)';
trLoss.appendChild(typeLoss);
const lossTrades = document.createElement('td');
lossTrades.className = 'text-right mono sl';
lossTrades.textContent = overall.maxLossTrades || 0;
trLoss.appendChild(lossTrades);
const lossPips = document.createElement('td');
lossPips.className = 'text-right mono sl';
lossPips.textContent = overall.maxLossPips ? formatNumber(overall.maxLossPips, 1) : '-';
trLoss.appendChild(lossPips);
const lossDollar = document.createElement('td');
lossDollar.className = 'text-right mono sl';
if (priceBusy) {
lossDollar.innerHTML = tf_spinnerHTML(true);
}
else {
lossDollar.textContent = overall.maxLossDollar ? formatMoney(overall.maxLossDollar) : '-';
}
trLoss.appendChild(lossDollar);
totalTbody.appendChild(trProfit);
totalTbody.appendChild(trLoss);
}
}
function loadFromChromeStorageIfAvailable() {
const hasChromeAPI = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
if (!hasChromeAPI)
return;
chrome.storage.local.get(['tfMonthlyStats', 'tfHistorySignals', 'tfAnalystSources', 'tfNoDataPairs', 'tfAvgSlPips'], (data) => {
const rawMonthlyStats = data.tfMonthlyStats || {};
const rawHistory = data.tfHistorySignals || [];
const rawSources = data.tfAnalystSources || {};
noDataPairsByAnalyst = (data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object') ? data.tfNoDataPairs : {};
avgSlPipsByAnalystPair = (data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object') ? data.tfAvgSlPips : {};
analystSourcesByName = {};
Object.keys(rawSources).forEach((name) => {
if (!name)
return;
analystSourcesByName[name] = {
url: rawSources[name].url,
pairs: Array.isArray(rawSources[name].pairs) ? rawSources[name].pairs.slice() : []
};
});
fillMonthlyFromStorage(rawMonthlyStats || {});
historySignals = [];
const historyInput = Array.isArray(rawHistory) ? rawHistory : [];
for (let i = 0; i < historyInput.length; i++) {
const item = historyInput[i];
if (!item || !item.analyst)
continue;
const parsedPips = (typeof item.pips === 'number') ? item.pips : parseFloat(item.pips);
if (!Number.isFinite(parsedPips))
continue;
historySignals.push({
...item,
analyst: item.analyst,
pair: item.pair,
pips: parsedPips,
displayDate: normalizeWIBSuffix(item.displayDate),
sortKey: item.sortKey,
createdDate: normalizeWIBSuffix(item.createdDate),
createdSortKey: item.createdSortKey
});
}
try {
initialHistorySignals = historySignals.slice();
}
catch (e) {
initialHistorySignals = Array.isArray(historySignals) ? historySignals.slice() : [];
}
try {
tfMobileHistoryRenderLimit = TF_MOBILE_HISTORY_CHUNK_SIZE;
}
catch (e) { }
rebuildAnalystListFromSources();
setupAnalystTickerFilter();
applyAnalystPairFilterAll();
setupHistoryForm();
});
}
function applyHistoryTableScroll() {
const section = document.getElementById('section-history');
if (!section)
return;
const scrollDiv = section.querySelector('.table-scroll');
const table = section.querySelector('#history-table');
if (!scrollDiv || !table)
return;
const tbody = table.querySelector('tbody');
if (!tbody)
return;
const rows = tbody.querySelectorAll('tr');
const rowCount = rows.length;
if (rowCount === 0) {
scrollDiv.style.maxHeight = '';
scrollDiv.style.overflowY = 'auto';
try {
tf_restoreHistoryTableScrollIfRequested(scrollDiv);
}
catch (e) { }
return;
}
if (rowCount <= 15) {
scrollDiv.style.maxHeight = '';
scrollDiv.style.overflowY = 'auto';
if (tf_restoreHistoryTableScrollIfRequested(scrollDiv))
return;
return;
}
const headerRow = table.querySelector('thead tr');
if (!headerRow)
return;
const headerRect = headerRow.getBoundingClientRect();
const fifteenthRow = rows[14];
const fifteenthRect = fifteenthRow.getBoundingClientRect();
if (!headerRect || !fifteenthRect)
return;
const top = headerRect.top;
const bottom = fifteenthRect.bottom;
const desiredHeight = Math.max(0, Math.ceil(bottom - top + 4));
scrollDiv.style.maxHeight = desiredHeight + 'px';
scrollDiv.style.overflowY = 'auto';
if (tf_restoreHistoryTableScrollIfRequested(scrollDiv))
return;
scrollDiv.scrollTop = scrollDiv.scrollHeight;
}

// ===== REV172: Equity Curve Compare full-width same-unit plotting (Equity-only) =====
const TF_EQUITY_COMPARE_SECONDARY_COLOR = '#a78bfa';
const TF_EQUITY_COMPARE_PRIMARY_COLOR = '#38bdf8';
const TF_EQUITY_PRIMARY_DRAWDOWN_COLOR = '#fbbf24';
const TF_EQUITY_PRIMARY_LOSS_COLOR = '#ef4444';
const TF_EQUITY_PRIMARY_WITHDRAW_COLOR = '#b91c1c';
const TF_EQUITY_SECONDARY_DRAWDOWN_COLOR = '#84cc16';
const TF_EQUITY_SECONDARY_LOSS_COLOR = '#f97316';
const TF_EQUITY_SECONDARY_WITHDRAW_COLOR = '#ec4899';
const TF_EQUITY_COMPARE_MONTHS_KEY = 'tf_equity_compare_months_v1';

// Return a stable numeric X key for a curve point. Compare curves may contain
// a different number of rows (for example, an auto-disabled withdraw), so X
// must be based on the actual trade time rather than each array's index.
function tf_getEquityPointXKey(point) {
try {
if (point && typeof point.sortKey === 'number' && isFinite(point.sortKey)) return point.sortKey;
const raw = point && point.date ? Date.parse(String(point.date)) : NaN;
return Number.isFinite(raw) ? raw : null;
}
catch (e) { return null; }
}
function tf_getEquityCombinedXDomain(includeCompare) {
let min = Infinity;
let max = -Infinity;
const collect = (arr) => {
(Array.isArray(arr) ? arr : []).forEach((point) => {
const key = tf_getEquityPointXKey(point);
if (!Number.isFinite(key)) return;
if (key < min) min = key;
if (key > max) max = key;
});
};
collect(equityCurvePoints);
if (includeCompare) collect(equityCompareCurvePoints);
return (Number.isFinite(min) && Number.isFinite(max) && max > min) ? { min, max } : null;
}
function tf_equityXForPoint(point, index, length, paddingLeft, chartWidth, domain) {
const key = tf_getEquityPointXKey(point);
if (domain && Number.isFinite(key)) {
const ratio = (key - domain.min) / (domain.max - domain.min);
return paddingLeft + Math.max(0, Math.min(1, ratio)) * chartWidth;
}
if (length <= 1) return paddingLeft + chartWidth / 2;
return paddingLeft + (index / (length - 1)) * chartWidth;
}
let equityCompareEnabled = false;
let equityCompareMonths = 1;
let equityCompareCurvePoints = [];
let equityCompareRows = [];
let equityCompareCalcRows = [];
let equityCompareMetric = 'usd';
let equityCompareRiskMode = 'fixed';
let equityCompareLabel = '';

function tf_isEquityCompareActive() {
return !!equityCompareEnabled && Array.isArray(equityCompareCurvePoints) && equityCompareCurvePoints.length > 0;
}
function tf_equityCompareNeedsRightAxis() {
return tf_isEquityCompareActive() && equityCompareMetric !== equityMetric;
}
function tf_getEquityPaddingRight() {
// REV172: only reserve a wide right margin when Primary and Secondary have
// different units (Pips vs USD) and therefore need a second Y axis. For
// USD-vs-USD Compare, both lines share the same axis and must use the full
// chart width, exactly like the non-Compare chart.
return tf_equityCompareNeedsRightAxis() ? 82 : 18;
}
function tf_loadEquityCompareMonths() {
try {
const raw = parseInt(localStorage.getItem(TF_EQUITY_COMPARE_MONTHS_KEY), 10);
if (Number.isFinite(raw) && raw >= 1 && raw <= 12)
equityCompareMonths = raw;
}
catch (e) { }
}
function tf_saveEquityCompareMonths() {
try { localStorage.setItem(TF_EQUITY_COMPARE_MONTHS_KEY, String(equityCompareMonths)); }
catch (e) { }
}
function tf_getEquityCompareDescriptor() {
if (equityMetric === 'pips') {
return {
metric: 'usd',
riskMode: riskMode,
months: compoundMonths,
button: 'Compare to : PnL ($)',
label: 'PnL ($)' + (riskMode === 'compound' ? (' · Compound % (' + compoundMonths + ' month)') : ' · Fixed Lot'),
showMonths: false,
placement: 'pips'
};
}
if (riskMode === 'fixed') {
return {
metric: 'usd',
riskMode: 'compound',
months: equityCompareMonths,
button: 'Compare to : Compound %',
label: 'PnL ($) · Compound % (' + equityCompareMonths + ' month)',
showMonths: true,
placement: 'usd'
};
}
return {
metric: 'usd',
riskMode: 'fixed',
months: 1,
button: 'Compare to : Fixed Lot',
label: 'PnL ($) · Fixed Lot',
showMonths: false,
placement: 'usd'
};
}
function tf_getEquityPrimaryLabel() {
if (equityMetric === 'pips') return 'PnL Pips';
return 'PnL ($) · ' + (riskMode === 'compound' ? ('Compound % (' + compoundMonths + ' month)') : 'Fixed Lot');
}
function tf_makeCompareButton(id) {
const btn = document.createElement('button');
btn.type = 'button';
btn.id = id;
btn.className = 'tf-equity-compare-btn';
btn.setAttribute('aria-pressed', 'false');
btn.addEventListener('click', () => {
equityCompareEnabled = !equityCompareEnabled;
tf_syncEquityCompareUi();
if (Array.isArray(lastHistoryRows)) updateEquityCurveFromRows(lastHistoryRows);
});
return btn;
}
function tf_createEquityCompareDom() {
if (document.getElementById('tf-equity-compare-row-pips')) return;
const metricRow = document.getElementById('equity-metric-withdraw-row');
const riskSel = document.getElementById('risk-mode-select');
const riskRow = riskSel && riskSel.closest ? riskSel.closest('.controls-row') : null;
if (!metricRow || !riskRow) return;

const pipsRow = document.createElement('div');
pipsRow.id = 'tf-equity-compare-row-pips';
pipsRow.className = 'controls-row tf-equity-compare-row';
pipsRow.style.display = 'none';
const pipsBtn = tf_makeCompareButton('tf-equity-compare-btn-pips');
pipsRow.appendChild(pipsBtn);
metricRow.insertAdjacentElement('afterend', pipsRow);

const usdWrap = document.createElement('div');
usdWrap.id = 'tf-equity-compare-inline-usd';
usdWrap.className = 'tf-equity-compare-inline';
const usdBtn = tf_makeCompareButton('tf-equity-compare-btn-usd');
usdWrap.appendChild(usdBtn);
const months = document.createElement('select');
months.id = 'tf-equity-compare-months';
months.className = 'form-input tf-equity-compare-months';
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = i + ' month';
months.appendChild(opt);
}
months.value = String(equityCompareMonths);
months.addEventListener('change', () => {
const n = parseInt(months.value, 10);
equityCompareMonths = (Number.isFinite(n) && n >= 1 && n <= 12) ? n : 1;
tf_saveEquityCompareMonths();
tf_syncEquityCompareUi();
if (equityCompareEnabled && Array.isArray(lastHistoryRows)) updateEquityCurveFromRows(lastHistoryRows);
});
usdWrap.appendChild(months);
riskRow.appendChild(usdWrap);

const chartModeRow = document.getElementById('tf-equity-chartmode-row');
if (chartModeRow) {
const legend = document.createElement('div');
legend.id = 'tf-equity-compare-legend';
legend.className = 'tf-equity-compare-legend';
legend.style.display = 'none';
chartModeRow.appendChild(legend);
}

const primarySummary = document.getElementById('equity-drawdown-summary');
if (primarySummary) {
const pTitle = document.createElement('div');
pTitle.id = 'tf-equity-summary-primary-title';
pTitle.className = 'tf-equity-summary-mode-title tf-equity-summary-primary-title';
const hoistedBalance = primarySummary.querySelector(':scope > .tf-summary-balance-hoisted');
if (hoistedBalance) hoistedBalance.insertAdjacentElement('afterend', pTitle);
else primarySummary.insertBefore(pTitle, primarySummary.firstChild);
const secondary = document.createElement('div');
secondary.id = 'equity-drawdown-summary-secondary';
secondary.className = 'equity-drawdown-summary tf-equity-summary-secondary';
secondary.style.display = 'none';
secondary.innerHTML = '<div id="tf-equity-summary-secondary-title" class="tf-equity-summary-mode-title tf-equity-summary-secondary-title"></div>' +
'<div class="equity-drawdown-summary-title">Ringkasan Risiko Secondary — Consecutive Loss & Maximum Equity Drawdown</div>' +
'<div id="equity-drawdown-detail-secondary">Belum ada data secondary.</div>';
primarySummary.insertAdjacentElement('afterend', secondary);
const combined = document.createElement('div');
combined.id = 'equity-drawdown-summary-combined';
combined.className = 'equity-drawdown-summary tf-equity-summary-combined';
combined.style.display = 'none';
combined.innerHTML = '<div class="equity-drawdown-summary-title">Compare Risk Summary</div><div id="equity-drawdown-detail-combined"></div>';
secondary.insertAdjacentElement('afterend', combined);
}
}
function tf_syncEquityCompareChartMode() {
const candle = document.querySelector('#tf-equity-chartmode-buttons button[data-mode="candle"]');
if (!candle) return;
candle.disabled = !!equityCompareEnabled;
candle.classList.toggle('tf-equity-chart-disabled', !!equityCompareEnabled);
candle.title = equityCompareEnabled ? 'Nonaktif saat Compare aktif.' : '';
if (equityCompareEnabled && equityChartMode === 'candle') {
equityChartMode = 'line';
tf_saveEquityChartModePreference();
tf_syncEquityChartModeButtonsUI();
}
}
function tf_syncEquityCompareUi() {
const d = tf_getEquityCompareDescriptor();
equityCompareMetric = d.metric;
equityCompareRiskMode = d.riskMode;
equityCompareLabel = d.label;
const pipsRow = document.getElementById('tf-equity-compare-row-pips');
const usdWrap = document.getElementById('tf-equity-compare-inline-usd');
const pipsBtn = document.getElementById('tf-equity-compare-btn-pips');
const usdBtn = document.getElementById('tf-equity-compare-btn-usd');
const months = document.getElementById('tf-equity-compare-months');
if (pipsRow) {
  pipsRow.style.setProperty(
    'display',
    d.placement === 'pips' ? 'grid' : 'none',
    'important'
  );
}
if (usdWrap) {
  usdWrap.style.setProperty(
    'display',
    d.placement === 'usd' ? 'grid' : 'none',
    'important'
  );
}
[pipsBtn, usdBtn].forEach((btn) => {
if (!btn) return;
btn.textContent = d.button;
btn.classList.toggle('active', !!equityCompareEnabled);
btn.setAttribute('aria-pressed', equityCompareEnabled ? 'true' : 'false');
});
if (months) {
months.style.display = (d.placement === 'usd' && d.showMonths) ? 'block' : 'none';
months.value = String(equityCompareMonths);
}
const legend = document.getElementById('tf-equity-compare-legend');
if (legend) {
legend.style.display = equityCompareEnabled ? 'flex' : 'none';
const sameUnit = (equityMetric === d.metric);
legend.innerHTML = '<span title="Primary: drawdown kuning, loss merah, withdraw merah tua"><i style="background:' + TF_EQUITY_COMPARE_PRIMARY_COLOR + '"></i>Primary: ' + tf_getEquityPrimaryLabel() + '</span>' +
'<span title="Secondary: drawdown hijau limau, loss oranye, withdraw magenta"><i style="background:' + TF_EQUITY_COMPARE_SECONDARY_COLOR + '"></i>Secondary: ' + d.label + '</span>' +
(sameUnit ? '<span class="tf-equity-actual-scale-note">Skala nilai aktual bersama</span>' : '<span class="tf-equity-actual-scale-note">Dual unit aktual</span>');
}
tf_syncEquityCompareChartMode();
tf_updateEquityCompareSummaryTitles();
}
function tf_updateEquityCompareSummaryTitles() {
const pt = document.getElementById('tf-equity-summary-primary-title');
if (pt) pt.textContent = 'PRIMARY — ' + tf_getEquityPrimaryLabel();
const st = document.getElementById('tf-equity-summary-secondary-title');
if (st) st.textContent = 'SECONDARY — ' + (equityCompareLabel || tf_getEquityCompareDescriptor().label);
const sec = document.getElementById('equity-drawdown-summary-secondary');
const primary = document.getElementById('equity-drawdown-summary');
const combined = document.getElementById('equity-drawdown-summary-combined');
if (!equityCompareEnabled) {
if (primary) primary.style.display = 'block';
if (sec) sec.style.display = 'none';
if (combined) combined.style.display = 'none';
}
}
function tf_renderCombinedCompareSummary() {
const primary = document.getElementById('equity-drawdown-summary');
const secondary = document.getElementById('equity-drawdown-summary-secondary');
const combined = document.getElementById('equity-drawdown-summary-combined');
const pDetail = document.getElementById('equity-drawdown-detail');
const sDetail = document.getElementById('equity-drawdown-detail-secondary');
const out = document.getElementById('equity-drawdown-detail-combined');
if (!primary || !secondary || !combined || !pDetail || !sDetail || !out) return;
if (!equityCompareEnabled) {
primary.style.display = 'block'; secondary.style.display = 'none'; combined.style.display = 'none'; return;
}
const pHoistedBalance = primary.querySelector(':scope > .tf-summary-section[data-summary-section="balance"][data-tf-hoisted="1"]');
const pSections = (pHoistedBalance ? [pHoistedBalance] : []).concat(Array.from(pDetail.querySelectorAll('.tf-summary-section')));
const sSections = Array.from(sDetail.querySelectorAll('.tf-summary-section'));
const keys = [];
pSections.concat(sSections).forEach((section) => {
const key = section.getAttribute('data-summary-section') || 'other';
if (!keys.includes(key)) keys.push(key);
});
if (keys.includes('balance')) { keys.splice(keys.indexOf('balance'), 1); keys.unshift('balance'); }
let html = '<div class="tf-summary-compare-head">' +
'<span class="tf-summary-series-chip primary">P · ' + tf_summaryEscHtml(tf_getEquityPrimaryLabel()) + '</span>' +
'<span class="tf-summary-series-chip secondary">S · ' + tf_summaryEscHtml(equityCompareLabel || tf_getEquityCompareDescriptor().label) + '</span></div>';
const detailClones = [];
keys.forEach((key) => {
const pSec = pSections.find((x) => (x.getAttribute('data-summary-section') || 'other') === key) || null;
const sSec = sSections.find((x) => (x.getAttribute('data-summary-section') || 'other') === key) || null;
const base = pSec || sSec;
if (!base) return;
const title = base.querySelector('.tf-summary-section-title');
const subtitle = base.querySelector('.tf-summary-section-subtitle');
const sectionAccent = key === 'consecutive' ? '#ef4444' : (key === 'maximum' ? '#fbbf24' : '#38bdf8');
html += '<section class="tf-summary-section tf-summary-compare-section" data-summary-section="' + tf_summaryEscHtml(key) + '">' +
'<div class="tf-summary-section-head"><div><div class="tf-summary-section-title" style="color:' + sectionAccent + ';">' + (title ? title.innerHTML : key) + '</div>' +
'<div class="tf-summary-section-subtitle">' + (subtitle ? subtitle.innerHTML : '') + '</div></div></div>';
const pRows = pSec ? Array.from(pSec.querySelectorAll('.tf-summary-row-grid')) : [];
const sRows = sSec ? Array.from(sSec.querySelectorAll('.tf-summary-row-grid')) : [];
const rowKeys = [];
pRows.concat(sRows).forEach((row) => {
const rk = row.getAttribute('data-summary-row') || 'general';
if (!rowKeys.includes(rk)) rowKeys.push(rk);
});
rowKeys.forEach((rk) => {
const pRow = pRows.find((x) => (x.getAttribute('data-summary-row') || 'general') === rk) || null;
const sRow = sRows.find((x) => (x.getAttribute('data-summary-row') || 'general') === rk) || null;
const pCards = pRow ? Array.from(pRow.querySelectorAll(':scope > .tf-summary-metric')) : [];
const sCards = sRow ? Array.from(sRow.querySelectorAll(':scope > .tf-summary-metric')) : [];
const labels = [];
pCards.concat(sCards).forEach((card) => {
const label = card.getAttribute('data-metric-label') || '';
if (!labels.includes(label)) labels.push(label);
});
if (!labels.length) return;
const sourceRow = pRow || sRow;
const rowLabel = sourceRow && sourceRow.previousElementSibling && sourceRow.previousElementSibling.classList.contains('tf-summary-row-label')
? sourceRow.previousElementSibling.textContent : '';
if (rowLabel) html += '<div class="tf-summary-row-label">' + tf_summaryEscHtml(rowLabel) + '</div>';
html += '<div class="tf-summary-row-grid tf-summary-compare-grid" data-summary-row="' + tf_summaryEscHtml(rk) + '">';
labels.forEach((label) => {
const pc = pCards.find((x) => (x.getAttribute('data-metric-label') || '') === label) || null;
const sc = sCards.find((x) => (x.getAttribute('data-metric-label') || '') === label) || null;
const pVal = pc && pc.querySelector('.tf-summary-metric-value') ? pc.querySelector('.tf-summary-metric-value').innerHTML : '-';
const sVal = sc && sc.querySelector('.tf-summary-metric-value') ? sc.querySelector('.tf-summary-metric-value').innerHTML : '-';
const pBtn = pc ? pc.querySelector('.tf-summary-detail-btn') : null;
const sBtn = sc ? sc.querySelector('.tf-summary-detail-btn') : null;
const pTarget = pBtn ? pBtn.getAttribute('data-detail-target') : '';
const sTarget = sBtn ? sBtn.getAttribute('data-detail-target') : '';
const pCombinedTarget = pTarget ? pTarget + '-combined' : '';
const sCombinedTarget = sTarget ? sTarget + '-combined' : '';
const makeBtn = (target) => target ? '<button type="button" class="tf-summary-detail-btn" data-detail-target="' + tf_summaryEscHtml(target) + '" aria-expanded="false">Detail</button>' : '';
html += '<div class="tf-summary-metric tf-summary-compare-metric" data-metric-label="' + tf_summaryEscHtml(label) + '">' +
'<div class="tf-summary-metric-label">' + tf_summaryEscHtml(label) + '</div>' +
'<div class="tf-summary-compare-line primary"><span class="tf-summary-series-mini">P</span><div class="mono tf-summary-metric-value">' + pVal + '</div>' + makeBtn(pCombinedTarget) + '</div>' +
'<div class="tf-summary-compare-line secondary"><span class="tf-summary-series-mini">S</span><div class="mono tf-summary-metric-value">' + sVal + '</div>' + makeBtn(sCombinedTarget) + '</div></div>';
});
html += '</div>';
});
html += '</section>';
});
[pDetail, sDetail].forEach((root, rootIndex) => {
root.querySelectorAll('.tf-summary-detail-panel').forEach((panel) => {
const clone = panel.cloneNode(true);
clone.id = panel.id + '-combined';
clone.hidden = true;
const head = clone.querySelector('.tf-summary-detail-head strong');
if (head) head.innerHTML = (rootIndex === 0 ? '<span class="tf-summary-series-mini primary">P</span> ' : '<span class="tf-summary-series-mini secondary">S</span> ') + head.innerHTML;
detailClones.push(clone.outerHTML);
});
});
out.innerHTML = html + detailClones.join('');
primary.style.display = 'none';
secondary.style.display = 'none';
combined.style.display = 'block';
}
function tf_compareEffectiveSlPips(analystName, pair) {
try {
const stats = computeSlStatsFromHistory(analystName, pair);
const effective = getEffectiveSlForAnalyst(analystName, pair, stats);
const v = effective && Number.isFinite(effective.pips) ? effective.pips : 0;
return v > 0 ? v : 0;
}
catch (e) { return 0; }
}
function tf_buildCompareRiskRows(sourceRows, targetRiskMode, targetMonths) {
const trades = (Array.isArray(sourceRows) ? sourceRows : []).filter((r) => r && !r.isWithdraw).slice();
trades.sort((a, b) => (tf_getPrimarySortKey(a) || 0) - (tf_getPrimarySortKey(b) || 0));
if (!trades.length) return [];
const monthKeys = [];
const seen = new Set();
const byMonth = Object.create(null);
for (const row of trades) {
const mk = tf_monthKeyFromSortKey(tf_getPrimarySortKey(row));
if (!mk) continue;
if (!seen.has(mk)) { seen.add(mk); monthKeys.push(mk); }
if (!byMonth[mk]) byMonth[mk] = [];
byMonth[mk].push(row);
}
if (!monthKeys.length) return [];
const monthIndex = (mk) => {
const a = String(mk).split('-');
return (parseInt(a[0], 10) * 12) + (parseInt(a[1], 10) - 1);
};
const monthFromIndex = (idx) => Math.floor(idx / 12) + '-' + String((idx % 12) + 1).padStart(2, '0');
const full = [];
for (let i = monthIndex(monthKeys[0]); i <= monthIndex(monthKeys[monthKeys.length - 1]); i++) full.push(monthFromIndex(i));
const periodMonths = targetRiskMode === 'compound' ? Math.max(1, Math.min(12, Number(targetMonths) || 1)) : 1;
const periodStart = Object.create(null);
for (let i = 0; i < full.length; i++) periodStart[full[i]] = full[Math.floor(i / periodMonths) * periodMonths] || full[i];
const startingBalance = Number.isFinite(currentBalance) ? currentBalance : 0;
let runningEquity = startingBalance;
let runningTrade = startingBalance;
let sizingBase = startingBalance;
let currentPeriod = periodStart[full[0]] || full[0];
const out = [];
const lotCache = new Map();
const monthEndEquity = Object.create(null);
let doubleAchieved = false;
let maxEquity = startingBalance;
const wEnabled = !!withdrawEnabled && Number.isFinite(withdrawAmount) && withdrawAmount > 0;
const wAmt = wEnabled ? Math.max(0, withdrawAmount) : 0;
const wEvery = wEnabled ? Math.max(1, Math.min(12, Math.floor(withdrawEveryMonths || 1))) : 1;
const skipMonth = full[0] && full[0] >= TF_WITHDRAW_MIN_MONTHKEY ? full[0] : null;
for (let mi = 0; mi < full.length; mi++) {
const mk = full[mi];
const ps = periodStart[mk] || mk;
if (targetRiskMode === 'compound' && currentPeriod !== ps) {
currentPeriod = ps;
sizingBase = mk === full[0] ? startingBalance : runningEquity;
lotCache.clear();
}
const scheduled = wEnabled && tf_isWithdrawDueMonth(mk, wEvery) && (!skipMonth || mk !== skipMonth);
let eligible = false;
let autoUntick = false;
if (scheduled) {
eligible = mi > 0;
if (eligible) {
const prev = full[mi - 1];
const prevPrev = mi >= 2 ? full[mi - 2] : null;
const prevStart = mi < 2 ? startingBalance : (prevPrev && Number.isFinite(monthEndEquity[prevPrev]) ? monthEndEquity[prevPrev] : startingBalance);
const prevEnd = prev && Number.isFinite(monthEndEquity[prev]) ? monthEndEquity[prev] : prevStart;
if (!doubleAchieved) {
if (!Number.isFinite(prevStart) || prevStart <= 0 || !Number.isFinite(prevEnd) || prevEnd < prevStart * 1.10) eligible = false;
if (eligible && prevEnd <= prevStart * 0.80) eligible = false;
}
}
autoUntick = !eligible;
const sk = tf_firstDaySortKeyFromMonthKey(mk);
const dl = tf_firstDayDisplayDateFromMonthKey(mk);
const before = runningEquity;
if (eligible) runningEquity -= wAmt;
const denom = targetRiskMode === 'fixed' ? startingBalance : before;
out.push({
isWithdraw: true,
__tfWithdrawEligible: eligible,
__tfWithdrawAutoUntick: autoUntick,
withdrawMonthKey: mk,
withdrawAmount: wAmt,
sortKey: sk,
createdSortKey: sk,
createdDate: dl,
displayDate: dl,
analyst: 'Withdraw', pair: 'User', lot: 0, pnlPips: 0, pnlDollar: -wAmt,
pnlPercent: denom ? (-wAmt / denom) * 100 : 0,
pnlDollarNet: -wAmt, pnlPercentNet: denom ? (-wAmt / denom) * 100 : 0, swapDollar: 0, commDollar: 0,
dollarTP: 0, dollarSL: wAmt, balancePnl: runningEquity,
balanceCompound: targetRiskMode === 'compound' ? before : startingBalance,
balanceTradeOnly: runningTrade
});
if (targetRiskMode === 'compound' && eligible) { sizingBase = runningEquity; lotCache.clear(); }
}
for (const base of (byMonth[mk] || [])) {
const riskPct = Math.max(0, Number(base.riskPercent) || 0);
const dpp = Math.abs(Number(base.dollarPerPip) || 0);
const pips = Number(base.pips != null ? base.pips : base.pnlPips) || 0;
let lot = 0;
if (targetRiskMode === 'fixed') {
lot = Number(base.lotFixed) || 0;
} else {
const baseForSizing = Math.max(0, Number(sizingBase) || 0);
const key = ps + '|' + String(base.analyst || '') + '|' + String(base.pair || '') + '|B' + Math.round(baseForSizing * 100);
if (!lotCache.has(key)) {
const sl = tf_compareEffectiveSlPips(base.analyst, base.pair);
let v = 0;
if (sl > 0 && dpp > 0) {
v = computeLot(baseForSizing, riskPct, sl, dpp);
v = Number.isFinite(v) && v > 0 ? roundLotToTwoDecimals(v) : 0;
}
lotCache.set(key, v);
}
lot = lotCache.get(key) || 0;
}
const pnlDollar = pips * lot * dpp;
const denom = targetRiskMode === 'compound' ? Math.max(0, Number(sizingBase) || 0) : startingBalance;
const costFields = tf_buildTradeCostFields(lot, pnlDollar, denom);
runningTrade += costFields.pnlDollarNet;
runningEquity += costFields.pnlDollarNet;
if (runningEquity > maxEquity) maxEquity = runningEquity;
if (!doubleAchieved && startingBalance > 0 && maxEquity >= startingBalance * 2) doubleAchieved = true;
out.push({ ...base, lot, pnlPips: pips,
pipsTP: pips > 0 ? pips : 0, pipsSL: pips < 0 ? Math.abs(pips) : 0,
dollarTP: pnlDollar > 0 ? pnlDollar : 0, dollarSL: pnlDollar < 0 ? Math.abs(pnlDollar) : 0,
pnlDollar, pnlPercent: denom ? (pnlDollar / denom) * 100 : 0, ...costFields,
balancePnl: runningEquity, balanceCompound: targetRiskMode === 'compound' ? sizingBase : startingBalance,
balanceTradeOnly: runningTrade });
}
monthEndEquity[mk] = runningEquity;
}
return out.sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
}
function tf_buildComparePoints(rows, metric) {
const filtered = tf_filterRowsByUnifiedDate(Array.isArray(rows) ? rows : []);
const enabled = filtered.filter((r) => {
if (!r) return false;
// REV289: a PnL Pips curve is independent from cash withdraw.
if (metric === 'pips' && r.isWithdraw) return false;
if (r.isWithdraw && r.__tfWithdrawAutoUntick) return false;
return tf_isHistoryRowEnabled(r);
});
equityCompareCalcRows = enabled.slice();
if (!enabled.length) return [];
let eq = metric === 'usd' ? (currentBalance || 0) : 0;
const firstKey = tf_getPrimarySortKey(enabled[0]);
const pts = [{ index:0, sortKey:Number.isFinite(firstKey) ? firstKey - 1 : null,
date:metric === 'usd' ? 'Start Balance' : 'Start', analyst:'', pair:'', dollarTP:0, dollarSL:0,
pnlDollar:0, pnlPips:0, pnlPercent:0, pnlValue:0, equity:eq, isStart:true }];
enabled.forEach((row, idx) => {
const pd = row.isWithdraw ? (Number.isFinite(row.pnlDollar) ? row.pnlDollar : ((row.dollarTP || 0) - (row.dollarSL || 0))) : tf_getHistoryNetPnlDollar(row);
const pp = Number.isFinite(row.pnlPips) ? row.pnlPips : (Number(row.pips) || 0);
const pv = metric === 'usd' ? pd : pp;
eq += pv;
pts.push({ index:idx+1, sortKey:tf_getPrimarySortKey(row), date:row.displayDate || row.createdDate || '',
analyst:row.analyst || '', pair:row.pair || '', dollarTP:row.dollarTP || 0, dollarSL:row.dollarSL || 0,
pnlDollar:pd, pnlPips:pp, pnlPercent:row.isWithdraw ? (Number.isFinite(Number(row.pnlPercent)) ? Number(row.pnlPercent) : 0) : tf_getHistoryNetPnlPercent(row), pnlValue:pv, equity:eq, isWithdraw:!!row.isWithdraw });
});
return pts;
}
function tf_updateEquityCompareDataFromRows(primaryRows) {
equityCompareCurvePoints = [];
equityCompareRows = [];
equityCompareCalcRows = [];
if (!equityCompareEnabled) return;
const d = tf_getEquityCompareDescriptor();
equityCompareMetric = d.metric;
equityCompareRiskMode = d.riskMode;
equityCompareLabel = d.label;
if (equityMetric === 'pips') {
equityCompareRows = Array.isArray(primaryRows) ? primaryRows.slice() : [];
} else {
equityCompareRows = tf_buildCompareRiskRows(primaryRows, d.riskMode, d.months);
}
equityCompareCurvePoints = tf_buildComparePoints(equityCompareRows, d.metric);
}
function tf_renderEquityCompareSummary() {
tf_updateEquityCompareSummaryTitles();
const secondary = document.getElementById('equity-drawdown-summary-secondary');
if (!secondary) return;
if (!equityCompareEnabled || !equityCompareCurvePoints.length) {
secondary.style.display = equityCompareEnabled ? 'block' : 'none';
const de = document.getElementById('equity-drawdown-detail-secondary');
if (de && equityCompareEnabled) de.textContent = 'Belum ada data secondary untuk filter saat ini.';
try { tf_renderCombinedCompareSummary(); } catch (e) { }
return;
}
const primaryContainer = document.getElementById('equity-drawdown-summary');
const primaryDetail = document.getElementById('equity-drawdown-detail');
const secondaryDetail = document.getElementById('equity-drawdown-detail-secondary');
if (!primaryContainer || !primaryDetail || !secondaryDetail) return;
const save = {
points: equityCurvePoints,
metric: equityMetric,
risk: riskMode,
calc: tf_lastEquityCalcRows,
rows: lastHistoryRows
};
try {
primaryContainer.id = 'equity-drawdown-summary-primary-temp';
primaryDetail.id = 'equity-drawdown-detail-primary-temp';
secondary.id = 'equity-drawdown-summary';
secondaryDetail.id = 'equity-drawdown-detail';
equityCurvePoints = equityCompareCurvePoints;
equityMetric = equityCompareMetric;
riskMode = equityCompareRiskMode;
tf_lastEquityCalcRows = equityCompareCalcRows;
lastHistoryRows = equityCompareRows;
tf_equitySummaryRenderRole = 'secondary';
computeAndRenderEquityDrawdownSummary();
// Secondary summary uses its own palette instead of reusing Primary colors.
try {
secondaryDetail.innerHTML = String(secondaryDetail.innerHTML || '')
.replace(/#ef4444/gi, TF_EQUITY_SECONDARY_LOSS_COLOR)
.replace(/#fbbf24/gi, TF_EQUITY_SECONDARY_DRAWDOWN_COLOR);
secondaryDetail.querySelectorAll('tr').forEach((tr) => {
const first = tr.querySelector('td');
if (!first || String(first.textContent || '').trim().toLowerCase() !== 'withdraw') return;
const cells = tr.querySelectorAll('td');
const last = cells && cells.length ? cells[cells.length - 1] : null;
if (!last) return;
last.style.color = TF_EQUITY_SECONDARY_WITHDRAW_COLOR;
last.querySelectorAll('*').forEach((el) => { el.style.color = TF_EQUITY_SECONDARY_WITHDRAW_COLOR; });
});
} catch (paletteError) { }
}
catch (e) {
try { secondaryDetail.textContent = 'Gagal menghitung summary secondary: ' + String(e && e.message ? e.message : e); }
catch (x) { }
}
finally {
equityCurvePoints = save.points;
equityMetric = save.metric;
riskMode = save.risk;
tf_lastEquityCalcRows = save.calc;
lastHistoryRows = save.rows;
tf_equitySummaryRenderRole = 'primary';
secondary.id = 'equity-drawdown-summary-secondary';
secondaryDetail.id = 'equity-drawdown-detail-secondary';
primaryContainer.id = 'equity-drawdown-summary';
primaryDetail.id = 'equity-drawdown-detail';
tf_updateEquityCompareSummaryTitles();
try { tf_renderCombinedCompareSummary(); } catch (combinedError) { }
}
}
function setupEquityCompareFeature() {
tf_loadEquityCompareMonths();
tf_createEquityCompareDom();
tf_syncEquityCompareUi();
const metricSel = document.getElementById('equity-metric-select');
const riskSel = document.getElementById('risk-mode-select');
if (metricSel) metricSel.addEventListener('change', () => setTimeout(() => {
tf_syncEquityCompareUi();
if (equityCompareEnabled && Array.isArray(lastHistoryRows)) updateEquityCurveFromRows(lastHistoryRows);
}, 0));
if (riskSel) riskSel.addEventListener('change', () => setTimeout(() => {
tf_syncEquityCompareUi();
if (equityCompareEnabled && Array.isArray(lastHistoryRows)) updateEquityCurveFromRows(lastHistoryRows);
}, 0));
}
// ===== END REV172 Equity Curve Compare =====

function setupEquityMetricSelector() {
loadEquityMetricPreference();
updateEquityCurveCopyForMetric();
const sel = document.getElementById('equity-metric-select');
if (!sel) {
return;
}
try {
sel.value = equityMetric;
}
catch (e) {
}
try {
tf_updateUiForEquityMetric();
}
catch (e) { }
sel.addEventListener('change', function () {
const v = sel.value === 'usd' ? 'usd' : 'pips';
if (v === equityMetric)
return;
equityMetric = v;
saveEquityMetricPreference();
updateEquityCurveCopyForMetric();
try {
tf_updateUiForEquityMetric();
}
catch (e) { }
if (Array.isArray(lastHistoryRows)) {
updateEquityCurveFromRows(lastHistoryRows);
}
});
}
function setupRiskModeSelector() {
loadRiskModePreference();
loadCompoundMonthsPreference();
const riskSels = tf_getAllRiskModeSelects();
const compoundSels = tf_getAllCompoundMonthsSelects();
function syncRiskModeToAll() {
riskSels.forEach((s) => {
try {
if (s.value !== riskMode)
s.value = riskMode;
}
catch (e) { }
});
}
function syncCompoundMonthsToAll() {
compoundSels.forEach((s) => {
try {
if (s.value !== String(compoundMonths))
s.value = String(compoundMonths);
}
catch (e) { }
});
}
syncRiskModeToAll();
try {
tf_updateUiForEquityMetric();
}
catch (e) { }
tf_renderCompoundMonthsOptions(0);
syncCompoundMonthsToAll();
riskSels.forEach((sel) => {
sel.addEventListener('change', function () {
const v = (sel.value === 'compound') ? 'compound' : 'fixed';
if (v !== riskMode) {
riskMode = v;
saveRiskModePreference();
}
syncRiskModeToAll();
try {
tf_updateUiForEquityMetric();
}
catch (e) { }
recomputeHistoryRows();
updateMonthlyTableCells();
});
});
compoundSels.forEach((sel) => {
sel.addEventListener('change', function () {
const v = parseInt(sel.value, 10);
const next = (Number.isFinite(v) && v >= 1 && v <= 12) ? v : 1;
if (next !== compoundMonths) {
compoundMonths = next;
saveCompoundMonthsPreference();
}
syncCompoundMonthsToAll();
if (riskMode === 'compound') {
recomputeHistoryRows();
updateMonthlyTableCells();
}
});
});
}
function tf_loadTradeTimeRangePreference() {
try {
const v = localStorage.getItem(TF_TRADE_RANGE_STORAGE_KEY);
if (!v)
return;
if (TF_TRADE_RANGE_OPTIONS.some((o) => o.key === v)) {
tfTradeTimeRangeKey = v;
}
}
catch (e) { }
}
function tf_saveTradeTimeRangePreference() {
try {
localStorage.setItem(TF_TRADE_RANGE_STORAGE_KEY, String(tfTradeTimeRangeKey || 'all'));
}
catch (e) { }
}
function tf_loadSingleMonthPreference() {
try {
const v = String(localStorage.getItem(TF_SINGLE_MONTH_STORAGE_KEY) || '').trim();
if (/^\d{4}-\d{2}$/.test(v))
tfTradeSingleMonthKey = v;
}
catch (e) { }
}
function tf_saveSingleMonthPreference() {
try {
if (tfTradeSingleMonthKey)
localStorage.setItem(TF_SINGLE_MONTH_STORAGE_KEY, String(tfTradeSingleMonthKey));
else
localStorage.removeItem(TF_SINGLE_MONTH_STORAGE_KEY);
}
catch (e) { }
}
function tf_getAvailableSingleMonthKeys() {
const set = new Set();
try {
const rows = Array.isArray(historySignals) ? historySignals : [];
for (let i = 0; i < rows.length; i++) {
const k = tf_monthKeyFromSortKey(tf_getPrimarySortKey(rows[i]));
if (k && /^\d{4}-\d{2}$/.test(k))
set.add(k);
}
}
catch (e) { }
try {
if (!set.size) {
rebuildMonthKeysFromStats();
(Array.isArray(allMonthKeysSorted) ? allMonthKeysSorted : []).forEach((k) => {
if (/^\d{4}-\d{2}$/.test(String(k || '')))
set.add(String(k));
});
}
}
catch (e) { }
return Array.from(set).sort((a, b) => b.localeCompare(a));
}
function tf_formatSingleMonthLabel(monthKey) {
try {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return String(monthKey || '');
const d = new Date(Number(m[1]), Number(m[2]) - 1, 1);
if (!isNaN(d.getTime())) {
const label = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(d);
return label ? (label.charAt(0).toUpperCase() + label.slice(1)) : String(monthKey);
}
}
catch (e) { }
return String(monthKey || '');
}
function tf_syncSingleMonthSelectorsUI() {
const ids = ['tf-single-month-select-perf', 'tf-single-month-select-monthly', 'tf-single-month-select-equity', 'tf-single-month-select-history'];
ids.forEach((id) => {
const sel = document.getElementById(id);
if (!sel)
return;
try {
sel.value = tfTradeSingleMonthKey || '';
}
catch (e) { }
});
}
function tf_getSingleMonthSelectorTimeline(availableKeys) {
const dataKeys = Array.isArray(availableKeys) ? availableKeys.filter((k) => /^\d{4}-\d{2}$/.test(String(k || ''))) : [];
if (!dataKeys.length)
return [];
const indices = dataKeys.map(tf_monthKeyToIndex).filter((v) => Number.isFinite(v));
if (!indices.length)
return dataKeys.slice();
const minIndex = Math.min.apply(null, indices);
const maxIndex = Math.max.apply(null, indices);
const out = [];
for (let idx = maxIndex; idx >= minIndex; idx--) {
const year = Math.floor(idx / 12);
const month = (idx % 12) + 1;
out.push(String(year).padStart(4, '0') + '-' + String(month).padStart(2, '0'));
}
return out;
}
function tf_refreshSingleMonthSelectors() {
const availableKeys = tf_getAvailableSingleMonthKeys();
const availableSet = new Set(availableKeys);
const timelineKeys = tf_getSingleMonthSelectorTimeline(availableKeys);
if (tfTradeSingleMonthKey && !availableSet.has(tfTradeSingleMonthKey)) {
tfTradeSingleMonthKey = '';
tf_saveSingleMonthPreference();
}
const ids = ['tf-single-month-select-perf', 'tf-single-month-select-monthly', 'tf-single-month-select-equity', 'tf-single-month-select-history'];
ids.forEach((id) => {
const sel = document.getElementById(id);
if (!sel)
return;
const current = tfTradeSingleMonthKey || '';
sel.innerHTML = '';
const def = document.createElement('option');
def.value = '';
def.textContent = 'Default (Time Range)';
sel.appendChild(def);
timelineKeys.forEach((k) => {
const hasTrade = availableSet.has(k);
const opt = document.createElement('option');
opt.value = k;
opt.textContent = tf_formatSingleMonthLabel(k);
if (!hasTrade) {
opt.disabled = true;
opt.style.color = '#64748b';
opt.setAttribute('data-tf-empty-month', '1');
opt.title = 'Tidak ada trade pada bulan ini';
}
sel.appendChild(opt);
});
sel.value = current;
sel.disabled = availableKeys.length === 0;
});
}
function tf_setTradeSingleMonth(monthKey) {
const next = (/^\d{4}-\d{2}$/.test(String(monthKey || '').trim())) ? String(monthKey).trim() : '';
if (next === tfTradeSingleMonthKey)
return;
tfTradeSingleMonthKey = next;
tf_saveSingleMonthPreference();
// REV308: any Time Range change must fit the new candle dataset immediately.
// Do not carry a zoom window from the previous smaller range.
tf_markEquityCandleViewportForFullReset();
if (next) {
tfTradeTimeRangeKey = 'all';
tf_saveTradeTimeRangePreference();
tf_syncTradeRangeButtonsUI();
}
tf_syncSingleMonthSelectorsUI();
try { equityFilterStart = null; } catch (e) { }
try { equityFilterEnd = null; } catch (e) { }
try {
equityHoverIndex = null;
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (e) { }
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
function setupTradeSingleMonthSelectors() {
tf_loadSingleMonthPreference();
tf_refreshSingleMonthSelectors();
const ids = ['tf-single-month-select-perf', 'tf-single-month-select-monthly', 'tf-single-month-select-equity', 'tf-single-month-select-history'];
ids.forEach((id) => {
const sel = document.getElementById(id);
if (!sel || (sel.dataset && sel.dataset.tfSingleMonthBound === '1'))
return;
if (sel.dataset)
sel.dataset.tfSingleMonthBound = '1';
sel.addEventListener('change', () => {
tf_setTradeSingleMonth(sel.value || '');
});
});
tf_syncSingleMonthSelectorsUI();
}
function tf_monthKeyToIndex(monthKey) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo) || mo < 1 || mo > 12)
return null;
return (y * 12) + (mo - 1);
}
function tf_sortKeyToMonthIndex(sortKey) {
try {
const k = tf_monthKeyFromSortKey(sortKey);
return tf_monthKeyToIndex(k);
}
catch (e) {
return null;
}
}
function tf_getRangeOptByKey(key) {
const k = String(key || '').trim();
return TF_TRADE_RANGE_OPTIONS.find((o) => o.key === k) || TF_TRADE_RANGE_OPTIONS[0];
}
function tf_pickBestTradeRangeForMonthsAvailable(monthsAvail) {
const n = Number.isFinite(monthsAvail) ? monthsAvail : 0;
if (n <= 0)
return 'all';
for (let i = TF_TRADE_RANGE_OPTIONS.length - 1; i >= 0; i--) {
const opt = TF_TRADE_RANGE_OPTIONS[i];
if (!opt)
continue;
if (!opt.monthsBack || opt.monthsBack <= 0)
continue;
if (opt.monthsBack <= n)
return opt.key;
}
return 'm1';
}
function tf_syncTradeRangeButtonsUI() {
const ids = ['tf-time-range-buttons-equity', 'tf-time-range-buttons-history', 'tf-time-range-buttons-monthly', 'tf-time-range-buttons-perf'];
ids.forEach((id) => {
const cont = document.getElementById(id);
if (!cont)
return;
const btns = cont.querySelectorAll('button.tf-time-range-btn');
btns.forEach((b) => {
const k = b && b.dataset ? String(b.dataset.range || '') : '';
const isActive = (k && k === tfTradeTimeRangeKey);
try {
if (isActive)
b.classList.add('active');
else
b.classList.remove('active');
}
catch (e) { }
});
});
}
function tf_renderTradeRangeButtons(containerId) {
const cont = document.getElementById(containerId);
if (!cont)
return;
cont.innerHTML = '';
TF_TRADE_RANGE_OPTIONS.forEach((opt) => {
const b = document.createElement('button');
b.type = 'button';
b.className = 'tf-time-range-btn';
b.dataset.range = opt.key;
b.textContent = opt.label;
b.title = opt.title;
b.addEventListener('click', () => {
if (b.disabled)
return;
tf_setTradeTimeRange(opt.key);
});
cont.appendChild(b);
});
}
function tf_setTradeTimeRange(key) {
const next = tf_getRangeOptByKey(key).key;
const hadSingleMonth = !!tfTradeSingleMonthKey;
if (next === tfTradeTimeRangeKey && !hadSingleMonth)
return;
if (hadSingleMonth) {
tfTradeSingleMonthKey = '';
tf_saveSingleMonthPreference();
tf_syncSingleMonthSelectorsUI();
}
tfTradeTimeRangeKey = next;
tf_saveTradeTimeRangePreference();
// REV308: 1Y/2Y/3Y/5Y/ALL (and every other range) auto-fit candles.
tf_markEquityCandleViewportForFullReset();
tf_syncTradeRangeButtonsUI();
try {
equityFilterStart = null;
}
catch (e) { }
try {
equityFilterEnd = null;
}
catch (e) { }
try {
equityHoverIndex = null;
const tt = document.getElementById('equity-tooltip');
if (tt)
tt.style.display = 'none';
}
catch (e) { }
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
function tf_updateTradeRangeAvailabilityFromMonthSpan(minIdx, maxIdx) {
const minI = Number.isFinite(minIdx) ? minIdx : null;
const maxI = Number.isFinite(maxIdx) ? maxIdx : null;
const monthsAvail = (minI == null || maxI == null) ? 0 : Math.max(0, (maxI - minI + 1));
const ids = ['tf-time-range-buttons-equity', 'tf-time-range-buttons-history', 'tf-time-range-buttons-monthly', 'tf-time-range-buttons-perf'];
ids.forEach((id) => {
const cont = document.getElementById(id);
if (!cont)
return;
const btns = cont.querySelectorAll('button.tf-time-range-btn');
btns.forEach((b) => {
const k = b && b.dataset ? String(b.dataset.range || '') : '';
const opt = tf_getRangeOptByKey(k);
const disable = (opt.monthsBack && opt.monthsBack > 0) ? (monthsAvail < opt.monthsBack) : false;
try {
b.disabled = !!disable;
}
catch (e) { }
});
});
const curOpt = tf_getRangeOptByKey(tfTradeTimeRangeKey);
const curDisabled = (curOpt.monthsBack && curOpt.monthsBack > 0) ? (monthsAvail < curOpt.monthsBack) : false;
if (curDisabled) {
const fallback = tf_pickBestTradeRangeForMonthsAvailable(monthsAvail);
tfTradeTimeRangeKey = fallback;
tf_saveTradeTimeRangePreference();
}
tf_syncTradeRangeButtonsUI();
}
function tf_filterRowsByTradeTimeRange(rows, maxMonthIdx) {
if (tfTradeSingleMonthKey) {
return (rows || []).filter((r) => {
const mk = tf_monthKeyFromSortKey(tf_getPrimarySortKey(r));
return mk === tfTradeSingleMonthKey;
});
}
const opt = tf_getRangeOptByKey(tfTradeTimeRangeKey);
const monthsBack = opt.monthsBack || 0;
if (!monthsBack || monthsBack <= 0)
return rows;
const endIdx = Number.isFinite(maxMonthIdx) ? maxMonthIdx : null;
if (endIdx == null)
return rows;
const startIdx = endIdx - (monthsBack - 1);
return (rows || []).filter((r) => {
const mi = tf_sortKeyToMonthIndex(tf_getPrimarySortKey(r));
if (mi == null)
return false;
return mi >= startIdx;
});
}
function setupTradeTimeRangeButtons() {
tf_loadTradeTimeRangePreference();
tf_renderTradeRangeButtons('tf-time-range-buttons-equity');
tf_renderTradeRangeButtons('tf-time-range-buttons-history');
tf_renderTradeRangeButtons('tf-time-range-buttons-monthly');
tf_renderTradeRangeButtons('tf-time-range-buttons-perf');
tf_syncTradeRangeButtonsUI();
setupTradeSingleMonthSelectors();
}
function tf_isignalUsers_getPremiumPlanValue() {
return 'ISIGNAL USERS PREMIUM';
}
function tf_isignalUsers_getPremiumPrice() {
return 'Rp299.000';
}
let __tfISignalPremiumLockActive = false;
let __tfISignalPremiumPageUnlocked = false;
let __tfISignalPremiumExpiryTimer = null;
let __tfISignalPremiumWatcherStarted = false;
function tf_isignalUsers_accessStateFromStored(rawValue) {
const raw = rawValue && typeof rawValue === 'object' ? rawValue : {};
const known = raw.isignalUsersAccessKnown === true ||
typeof raw.isignalUsersAccess === 'boolean' ||
typeof raw.isignalUsersIncluded === 'boolean' ||
typeof raw.isignalUsersAddonRequired === 'boolean' ||
Boolean(raw.isignalUsersAccessReason);
const duration = String(raw.duration || '').trim().toUpperCase();
const included = raw.isignalUsersIncluded === true;
const addonRequired = raw.isignalUsersAddonRequired === true;
const expiresAt = String(raw.isignalUsersExpiresAt || '');
let access = raw.valid === true && raw.isignalUsersAccess === true;
let reason = String(raw.isignalUsersAccessReason || '').trim().toUpperCase();
let remainingSeconds = Number.isFinite(Number(raw.isignalUsersRemainingSeconds))
? Math.max(0, Math.floor(Number(raw.isignalUsersRemainingSeconds)))
: null;
if (access && !included && expiresAt) {
const expiryMs = Date.parse(expiresAt);
const serverMs = Date.parse(String(raw.serverTime || ''));
const checkedAt = Number(raw.checkedAt || 0);
const estimatedNow = Number.isFinite(serverMs) && Number.isFinite(checkedAt) && checkedAt > 0
? serverMs + Math.max(0, Date.now() - checkedAt)
: Date.now();
if (Number.isFinite(expiryMs)) {
remainingSeconds = Math.max(0, Math.floor((expiryMs - estimatedNow) / 1000));
if (remainingSeconds <= 0) {
access = false;
reason = 'ADDON_EXPIRED';
}
}
}
return {
known,
access,
included,
addonRequired,
duration,
expiresAt,
remainingSeconds,
reason: access ? (reason || (included ? 'INCLUDED_IN_PLAN' : 'ADDON_ACTIVE')) : (reason || 'ACCESS_NOT_AVAILABLE'),
email: String(raw.email || '').trim().toLowerCase()
};
}
function tf_isignalUsers_schedulePremiumExpiry(accessState) {
try {
if (__tfISignalPremiumExpiryTimer)
clearTimeout(__tfISignalPremiumExpiryTimer);
}
catch (e) { }
__tfISignalPremiumExpiryTimer = null;
const state = accessState || {};
if (!state.access || state.included || !Number.isFinite(Number(state.remainingSeconds)))
return;
const delay = Math.max(0, Math.floor(Number(state.remainingSeconds)) * 1000);
__tfISignalPremiumExpiryTimer = setTimeout(() => {
if (__tfISignalPremiumLockActive)
return;
tf_isignalUsers_renderPremiumLock({
...state,
access: false,
remainingSeconds: 0,
reason: 'ADDON_EXPIRED'
});
}, Math.min(delay, 2147483647));
}
function tf_isignalUsers_startPremiumWatcher() {
if (__tfISignalPremiumWatcherStarted)
return;
__tfISignalPremiumWatcherStarted = true;
try {
chrome.storage.onChanged.addListener((changes, areaName) => {
if (areaName !== 'local' || !changes || !changes.tfLicenseState)
return;
const state = tf_isignalUsers_accessStateFromStored(changes.tfLicenseState.newValue || {});
if (state.access) {
if (__tfISignalPremiumLockActive) {
setTimeout(() => location.reload(), 100);
return;
}
tf_isignalUsers_schedulePremiumExpiry(state);
return;
}
if (__tfISignalPremiumPageUnlocked && !__tfISignalPremiumLockActive) {
tf_isignalUsers_renderPremiumLock(state);
}
});
}
catch (e) { }
}
function tf_isignalUsers_openUpgradePlan(accessState) {
const state = accessState || {};
const planValue = tf_isignalUsers_getPremiumPlanValue(state.duration);
const subscribeUrl = new URL(chrome.runtime.getURL('subscribe_plan.html'));
if (state.email)
subscribeUrl.searchParams.set('email', String(state.email));
subscribeUrl.searchParams.set('plan', planValue);
if (state.duration)
subscribeUrl.searchParams.set('currentPlan', String(state.duration));
subscribeUrl.searchParams.set('feature', 'isignal-users');
try {
chrome.tabs.create({ url: subscribeUrl.toString(), active: true });
}
catch (error) {
window.open(subscribeUrl.toString(), '_blank', 'noopener,noreferrer');
}
}
function tf_isignalUsers_renderPremiumLock(accessState) {
if (__tfISignalPremiumLockActive || document.getElementById('tf-isignal-premium-lock'))
return;
const state = accessState || {};
const duration = String(state.duration || '').trim().toUpperCase();
if (duration === 'PERMANENT')
return;
__tfISignalPremiumLockActive = true;
const reason = String(state.reason || '').trim().toUpperCase();
const price = tf_isignalUsers_getPremiumPrice(duration);
let explanation = 'Paket Anda belum menyertakan akses ke fitur iSignal Users.';
if (duration === '1 BULAN' || duration === '3 BULAN') {
explanation = `Paket ${duration} memerlukan add-on iSignal Users. Pilih akses 1 Hari Rp50.000 atau Premium Rp299.000 yang mengikuti sisa masa paket utama.`;
}
if (reason === 'ADDON_EXPIRED') {
explanation = 'Masa aktif add-on iSignal Users telah berakhir. Silakan perpanjang add-on untuk mengaktifkan fitur ini kembali.';
}
else if (reason === 'ADDON_NOT_PURCHASED') {
explanation = `Paket ${duration || 'Anda'} belum memiliki add-on iSignal Users.`;
}
else if (!state.known) {
explanation = 'Status akses premium belum dapat diverifikasi. Sambungkan internet, lalu klik hyperlink Refresh pada sidebar plugin.';
}
const style = document.createElement('style');
style.id = 'tf-isignal-premium-lock-style';
style.textContent = `
html, body { min-height: 100%; }
body.tf-isignal-premium-locked { overflow: hidden !important; }
#tf-isignal-premium-lock {
position: fixed;
inset: 0;
z-index: 2147483000;
display: flex;
align-items: center;
justify-content: center;
padding: 24px;
background:
radial-gradient(circle at 18% 12%, rgba(56,189,248,.14), transparent 34%),
radial-gradient(circle at 86% 18%, rgba(34,197,94,.11), transparent 30%),
#020617;
font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
color: #f8fafc;
}
#tf-isignal-premium-lock * { box-sizing: border-box; }
.tf-isignal-premium-card {
width: min(520px, 100%);
padding: 28px;
border: 1px solid rgba(148,163,184,.28);
border-radius: 20px;
background: rgba(15,23,42,.96);
box-shadow: 0 28px 80px rgba(0,0,0,.48);
text-align: center;
}
.tf-isignal-premium-badge {
display: inline-flex;
padding: 6px 10px;
border: 1px solid rgba(250,204,21,.35);
border-radius: 999px;
color: #fde047;
background: rgba(250,204,21,.08);
font-size: 11px;
font-weight: 900;
letter-spacing: .06em;
text-transform: uppercase;
}
.tf-isignal-premium-card h1 {
margin: 16px 0 9px;
font-size: 25px;
line-height: 1.2;
}
.tf-isignal-premium-card p {
margin: 0;
color: #aeb8c8;
font-size: 13px;
line-height: 1.65;
}
.tf-isignal-premium-plan {
margin: 18px 0;
padding: 13px 15px;
border: 1px solid rgba(56,189,248,.24);
border-radius: 12px;
background: rgba(56,189,248,.07);
color: #e0f2fe;
font-size: 12px;
line-height: 1.55;
}
.tf-isignal-premium-actions {
display: flex;
flex-direction: column;
gap: 9px;
margin-top: 18px;
}
.tf-isignal-premium-primary,
.tf-isignal-premium-secondary {
width: 100%;
min-height: 44px;
padding: 10px 14px;
border-radius: 10px;
cursor: pointer;
font-size: 13px;
font-weight: 850;
}
.tf-isignal-premium-primary {
border: 0;
background: #22c55e;
color: #052e16;
}
.tf-isignal-premium-secondary {
border: 1px solid #334155;
background: #020617;
color: #cbd5e1;
}
.tf-isignal-premium-note {
margin-top: 13px !important;
color: #64748b !important;
font-size: 10px !important;
}
`;
document.head.appendChild(style);
const root = document.createElement('div');
root.id = 'tf-isignal-premium-lock';
root.innerHTML = `
<section class="tf-isignal-premium-card" role="dialog" aria-modal="true" aria-labelledby="tf-isignal-premium-title">
<div class="tf-isignal-premium-badge">Fitur Premium</div>
<h1 id="tf-isignal-premium-title">iSignal Users</h1>
<p>${explanation}</p>
<div class="tf-isignal-premium-plan">
Paket utama: <strong>${duration || '-'}</strong><br>
${duration === '1 BULAN' || duration === '3 BULAN'
? `Pilihan add-on: <strong>1 Hari — Rp50.000</strong><br><strong>Premium — ${price}</strong> (mengikuti sisa paket utama)`
: 'Silakan pilih paket atau add-on yang sesuai.'}
</div>
<div class="tf-isignal-premium-actions">
<button type="button" class="tf-isignal-premium-primary" id="tf-isignal-premium-upgrade">Upgrade Plan / Check Status</button>
<button type="button" class="tf-isignal-premium-secondary" id="tf-isignal-premium-back">Kembali ke Dashboard</button>
</div>
<p class="tf-isignal-premium-note">Setelah add-on diaktifkan oleh admin, buka sidebar plugin lalu klik hyperlink Refresh.</p>
</section>
`;
document.body.classList.add('tf-isignal-premium-locked');
document.body.appendChild(root);
root.querySelector('#tf-isignal-premium-upgrade')?.addEventListener('click', () => {
tf_isignalUsers_openUpgradePlan(state);
});
root.querySelector('#tf-isignal-premium-back')?.addEventListener('click', () => {
window.location.href = chrome.runtime.getURL('dashboard.html');
});
}
async function tf_isignalUsers_requirePremiumAccess() {
let state = typeof window.tfGetISignalUsersAccessState === 'function'
? window.tfGetISignalUsersAccessState()
: null;
if (!state || state.known !== true) {
try {
if (typeof window.tfRefreshLicenseStatus === 'function') {
await window.tfRefreshLicenseStatus({
reloadOnSuccess: false,
showOverlayOnFailure: true
});
}
}
catch (e) { }
state = typeof window.tfGetISignalUsersAccessState === 'function'
? window.tfGetISignalUsersAccessState()
: state;
}
if (state && state.access === true)
return true;
tf_isignalUsers_renderPremiumLock(state || { known: false });
return false;
}
document.addEventListener('DOMContentLoaded', async () => {
if (window.tfIntegrityReady && !(await window.tfIntegrityReady))
return;
// MOBILE PRIVATE PROTOTYPE: activation intentionally disabled.
const __tfLicenseAllowed = true;
const __tfEarlyPageMode = (document.body && (document.body.getAttribute('data-page') || (document.body.dataset ? document.body.dataset.page : ''))) || '';
if (__tfEarlyPageMode === 'isignal-users') {
tf_isignalUsers_startPremiumWatcher();
const __tfPremiumAllowed = await tf_isignalUsers_requirePremiumAccess();
if (!__tfPremiumAllowed)
return;
__tfISignalPremiumPageUnlocked = true;
try {
if (typeof window.tfGetISignalUsersAccessState === 'function') {
tf_isignalUsers_schedulePremiumExpiry(window.tfGetISignalUsersAccessState());
}
}
catch (e) { }
}
try {
const logoLink = document.getElementById('tfInvestingProLogoLink') || document.querySelector('a.fxLogoLink');
if (logoLink) {
logoLink.addEventListener('click', () => {
try {
if (typeof window.trackInvestingProTopMenuLogoClick === 'function') {
window.trackInvestingProTopMenuLogoClick();
}
}
catch (e) { }
});
}
}
catch (e) { }
function tf_openNavLinkActiveTab(rawUrl) {
try {
if (rawUrl == null)
return;
let url = String(rawUrl).trim();
if (!url || url === '#' || url === 'javascript:void(0)' || url === 'javascript:void(0);')
return;
const isHttp = /^https?:\/\//i.test(url);
const isChromeExt = /^chrome-extension:\/\//i.test(url);
if (!isHttp && !isChromeExt) {
try {
if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) {
url = chrome.runtime.getURL(url.replace(/^\//, ''));
}
}
catch (e) { }
try {
window.location.href = url;
}
catch (e) {
try {
location.assign(url);
}
catch (x) { }
}
return;
}
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url, active: true });
}
else {
window.open(url, '_blank', 'noopener');
}
}
catch (e) {
try {
const u = String(rawUrl);
if (u && u !== '#')
window.open(u, '_blank', 'noopener');
}
catch (x) { }
}
}
function tf_initTopNavigatorMenu() {
try {
const links = document.querySelectorAll('a[data-tf-url]');
links.forEach(a => {
a.addEventListener('click', (e) => {
try {
if (e.button !== 0)
return;
if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
return;
}
catch (x) { }
try {
if ((a.getAttribute('data-tf-parent') || '') === '1') {
e.preventDefault();
const li = a.closest('.tf-dropdown');
if (li) {
const wasOpen = li.classList.contains('open');
document.querySelectorAll('.tf-top-nav .tf-dropdown.open').forEach(x => { if (x !== li)
x.classList.remove('open'); });
if (wasOpen)
li.classList.remove('open');
else
li.classList.add('open');
}
return;
}
}
catch (x) { }
try {
e.preventDefault();
}
catch (x) { }
const url = a.getAttribute('data-tf-url') || a.getAttribute('href');
tf_openNavLinkActiveTab(url);
});
});
const dropdowns = document.querySelectorAll('.tf-top-nav .tf-dropdown');
dropdowns.forEach(li => {
const mainA = li.querySelector(':scope > a');
if (!mainA)
return;
mainA.addEventListener('touchstart', (e) => {
try {
if (!li.classList.contains('open')) {
e.preventDefault();
dropdowns.forEach(x => x !== li && x.classList.remove('open'));
li.classList.add('open');
}
}
catch (x) { }
}, { passive: false });
});
document.addEventListener('click', (e) => {
try {
const nav = document.getElementById('tf-top-nav-wrap');
if (!nav)
return;
if (nav.contains(e.target))
return;
document.querySelectorAll('.tf-top-nav .tf-dropdown.open').forEach(x => x.classList.remove('open'));
}
catch (x) { }
});
}
catch (e) { }
}
try {
tf_initTopNavigatorMenu();
}
catch (e) { }
const __tfPageMode = (document.body && (document.body.getAttribute('data-page') || (document.body.dataset ? document.body.dataset.page : ''))) || '';
const __tfIsUsersPage = (__tfPageMode === 'isignal-users');
if (__tfIsUsersPage) {
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
tf_isignalUsers_initPage();
}
catch (e) { }
return;
}
try {
const refreshLink = document.getElementById('tf-refresh-price-link');
if (refreshLink) {
refreshLink.addEventListener('click', (e) => {
try {
e.preventDefault();
}
catch (x) { }
try {
tf_refreshMyfxbookPricesForce();
}
catch (x) { }
});
}
}
catch (e) { }
try {
tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
chrome.storage.onChanged.addListener(async (changes, area) => {
if (area !== 'local')
return;
if (!changes)
return;
if (changes[TF_MYFXBOOK_PRICES_KEY] || changes[TF_MYFXBOOK_PRICES_AT_KEY]) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
if (!__tfDashboardMainReady) {
if (typeof tf_isInvestingPriceReadyNow === 'function' && tf_isInvestingPriceReadyNow()) {
try {
tf_initDashboardMainAfterPrice();
}
catch (e) { }
}
return;
}
}
catch (e) { }
if (tfMyfxbookRefreshInProgress)
return;
try {
await tf_schedulePriceDependentUiRefresh(35);
}
catch (e) { }
}
});
}
catch (e) { }
try {
initDashboardScanOverlay();
}
catch (e) { }
try {
tf_loadTable1StateFromLocalStorage();
}
catch (e) { }
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
let __tfDashboardMainReady = false;
function tf_isInvestingPriceReadyNow() {
try {
if (tf_isMyfxbookPriceLoading())
return false;
const pm = tfMyfxbookPriceMapLatest;
if (!pm || typeof pm !== 'object')
return false;
const ks = Object.keys(pm);
if (!ks.length)
return false;
for (let i = 0; i < ks.length; i++) {
const v = pm[ks[i]];
if (v != null && String(v).trim() !== '')
return true;
}
return false;
}
catch (e) {
return false;
}
}
function tf_setWaitPriceMode(on) {
try {
if (!document.body)
return;
if (on)
document.body.classList.add('tf-wait-price');
else
document.body.classList.remove('tf-wait-price');
}
catch (e) { }
}
function tf_initDashboardMainAfterPrice() {
try {
if (__tfDashboardMainReady)
return;
__tfDashboardMainReady = true;
tf_setWaitPriceMode(false);
setupHistoryColumnFilter();
setupBalanceAndRiskControls();
setupHistoryForm();
setupHistoryPdfExportButton();
setupEquityCurveInteractions();
setupEquityChartModeSelector();
setupEquityMetricSelector();
setupRiskModeSelector();
setupEquityCompareFeature();
setupTradeTimeRangeButtons();
const equityApplyBtn = document.getElementById('equity-apply-filter-btn');
if (equityApplyBtn) {
equityApplyBtn.addEventListener('click', applyEquityDateFilterFromInputs);
}
const equityResetBtn = document.getElementById('equity-reset-filter-btn');
if (equityResetBtn) {
equityResetBtn.addEventListener('click', resetEquityDateFilterToFullRange);
}
const historyApplyBtn = document.getElementById('history-apply-filter-btn');
if (historyApplyBtn) {
historyApplyBtn.addEventListener('click', applyHistoryDateFilterFromInputs);
}
const historyResetBtn = document.getElementById('history-reset-filter-btn');
if (historyResetBtn) {
historyResetBtn.addEventListener('click', resetHistoryDateFilterToFullRange);
}
const historyAllCb = document.getElementById('history-all-checkbox');
if (historyAllCb) {
historyAllCb.addEventListener('change', () => {
tf_captureHistoryTableScrollForRestore();
const desired = !!historyAllCb.checked;
try {
const ids = Array.isArray(tf_lastEligibleHistoryRowIds) ? tf_lastEligibleHistoryRowIds : [];
for (let i = 0; i < ids.length; i++) {
tf_setHistoryRowEnabled(ids[i], desired);
}
}
catch (e) { }
recomputeHistoryRows();
});
}
try {
loadUserProfileIntoDashboard();
}
catch (e) { }
try {
loadScannedByNoteIntoDashboard();
}
catch (e) { }
loadFromChromeStorageIfAvailable();
}
catch (e) {
try {
tf_setWaitPriceMode(false);
}
catch (x) { }
try {
__tfDashboardMainReady = true;
}
catch (x) { }
try {
loadFromChromeStorageIfAvailable();
}
catch (x) { }
}
}
async function tf_waitForPriceThenInitMain() {
try {
if (__tfDashboardMainReady)
return;
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
// MOBILE V14: imported data uses the cached/fallback $/pip mapping. There is
// no live-price workflow, so never delay dashboard initialization for 60s.
tf_initDashboardMainAfterPrice();
}
catch (e) {
try {
tf_initDashboardMainAfterPrice();
}
catch (x) { }
}
}
tf_waitForPriceThenInitMain();
});
var __tfDrawdownDetailsBound = false;
function tf_applyDrawdownDetailColWidthsPx(detailTable) {
try {
if (!detailTable)
return;
const ths = document.querySelectorAll('#drawdown-table > thead > tr > th');
if (!ths || ths.length < 10)
return;
const cols = detailTable.querySelectorAll('colgroup col');
if (!cols || cols.length !== 8)
return;
// REV321: detail column 1 maps 1:1 to main column 3, detail column 2 to
// main column 4, and so on through parent column 10. Use the REAL rendered
// header widths (including border/padding) and force them with inline
// !important so legacy mobile width rules cannot drift out of alignment.
const widths = [];
let total = 0;
for (let i = 0; i < 8; i++) {
const src = ths[i + 2];
const rect = src ? src.getBoundingClientRect() : null;
const w = rect && Number.isFinite(rect.width) ? Math.max(1, rect.width) : 0;
widths.push(w);
if (w > 0) {
const px = w.toFixed(3) + 'px';
cols[i].style.setProperty('width', px, 'important');
cols[i].style.setProperty('min-width', px, 'important');
cols[i].style.setProperty('max-width', px, 'important');
total += w;
}
}
if (total > 0) {
const totalPx = total.toFixed(3) + 'px';
detailTable.style.setProperty('width', totalPx, 'important');
detailTable.style.setProperty('min-width', totalPx, 'important');
detailTable.style.setProperty('max-width', totalPx, 'important');
detailTable.style.setProperty('table-layout', 'fixed', 'important');
}
// Cell width rules from older revisions are also neutralized explicitly.
detailTable.querySelectorAll('tbody tr').forEach((tr) => {
const cells = tr.children || [];
for (let i = 0; i < Math.min(8, cells.length); i++) {
const w = widths[i] || 0;
if (!w) continue;
const px = w.toFixed(3) + 'px';
cells[i].style.setProperty('width', px, 'important');
cells[i].style.setProperty('min-width', px, 'important');
cells[i].style.setProperty('max-width', px, 'important');
}
});
detailTable.__tfDdMainWidths = widths;
}
catch (e) { }
}
function tf_bindDrawdownDetailScrollSync(wrap) {
try {
if (!wrap) return;
const outer = document.querySelector('#section-history #drawdown-summary > .table-wrapper > .table-scroll.drawdown-noscroll') ||
  document.querySelector('#section-history #drawdown-summary .table-scroll.drawdown-noscroll');
if (!outer) return;
wrap.classList.add('drawdown-detail-wrap-v318', 'drawdown-detail-wrap-v321');
const detailTable = wrap.querySelector('.drawdown-detail-table');

// REV321 geometry is calculated from the actual position of parent header #3,
// not from hard-coded 42+120px assumptions. This makes the empty area beneath
// main columns #1/#2 exact on every phone density/viewport.
const applyGeometry = () => {
  try {
    const ths = document.querySelectorAll('#drawdown-table > thead > tr > th');
    if (!ths || ths.length < 10) return;
    if (detailTable) tf_applyDrawdownDetailColWidthsPx(detailTable);
    const outerRect = outer.getBoundingClientRect();
    const thirdRect = ths[2].getBoundingClientRect();
    const frozen = Math.max(0, (thirdRect.left - outerRect.left) + (outer.scrollLeft || 0));
    const viewport = Math.max(96, outer.clientWidth - frozen);
    const leftPx = frozen.toFixed(3) + 'px';
    const viewportPx = viewport.toFixed(3) + 'px';
    wrap.style.setProperty('position', 'sticky', 'important');
    wrap.style.setProperty('left', leftPx, 'important');
    wrap.style.setProperty('width', viewportPx, 'important');
    wrap.style.setProperty('min-width', viewportPx, 'important');
    wrap.style.setProperty('max-width', viewportPx, 'important');
    wrap.style.setProperty('--tf-dd-frozen-width', leftPx);
  } catch (e) { }
};
applyGeometry();
requestAnimationFrame(applyGeometry);
setTimeout(applyGeometry, 60);

const syncToOuter = () => {
  if (wrap.__tfDdSyncBusy) return;
  wrap.__tfDdSyncBusy = true;
  const maxOuter = Math.max(0, outer.scrollWidth - outer.clientWidth);
  const target = Math.max(0, Math.min(wrap.scrollLeft || 0, maxOuter));
  if (Math.abs((outer.scrollLeft || 0) - target) > 0.25) outer.scrollLeft = target;
  requestAnimationFrame(() => { wrap.__tfDdSyncBusy = false; });
};
wrap.addEventListener('scroll', syncToOuter, { passive: true });

if (!outer.__tfDdOuterSyncBoundV321) {
  outer.__tfDdOuterSyncBoundV321 = true;
  outer.addEventListener('scroll', () => {
    const left = outer.scrollLeft || 0;
    document.querySelectorAll('#section-history #drawdown-table .drawdown-detail-wrap-v321').forEach((w) => {
      const max = Math.max(0, w.scrollWidth - w.clientWidth);
      const next = Math.max(0, Math.min(left, max));
      if (Math.abs((w.scrollLeft || 0) - next) > 0.25) w.scrollLeft = next;
    });
  }, { passive: true });
  try {
    window.addEventListener('resize', () => {
      document.querySelectorAll('#section-history #drawdown-table .drawdown-detail-wrap-v321').forEach((w) => {
        try {
          const tbl = w.querySelector('.drawdown-detail-table');
          if (tbl) tf_applyDrawdownDetailColWidthsPx(tbl);
          const ths = document.querySelectorAll('#drawdown-table > thead > tr > th');
          const out = document.querySelector('#section-history #drawdown-summary .table-scroll.drawdown-noscroll');
          if (!ths || ths.length < 3 || !out) return;
          const outRect = out.getBoundingClientRect();
          const thirdRect = ths[2].getBoundingClientRect();
          const frozen = Math.max(0, (thirdRect.left - outRect.left) + (out.scrollLeft || 0));
          const viewport = Math.max(96, out.clientWidth - frozen);
          w.style.setProperty('left', frozen.toFixed(3) + 'px', 'important');
          w.style.setProperty('width', viewport.toFixed(3) + 'px', 'important');
          w.style.setProperty('min-width', viewport.toFixed(3) + 'px', 'important');
          w.style.setProperty('max-width', viewport.toFixed(3) + 'px', 'important');
          const max = Math.max(0, w.scrollWidth - w.clientWidth);
          w.scrollLeft = Math.max(0, Math.min(out.scrollLeft || 0, max));
        } catch (e) { }
      });
    }, { passive:true });
  } catch (e) { }
}
const initialMax = Math.max(0, wrap.scrollWidth - wrap.clientWidth);
wrap.scrollLeft = Math.max(0, Math.min(outer.scrollLeft || 0, initialMax));
} catch (e) { }
}
function tf_buildDrawdownDetailElement(st) {
const wrap = document.createElement('div');
wrap.className = 'drawdown-detail-wrap drawdown-detail-wrap-v317 drawdown-detail-wrap-v318';
const maxP = st && st.maxProfitTrades ? st.maxProfitTrades : 0;
const maxL = st && st.maxLossTrades ? st.maxLossTrades : 0;
const maxN = Math.max(maxP, maxL);
if (maxN <= 1) {
const note = document.createElement('div');
note.style.opacity = '0.8';
note.textContent = 'Tidak ada detail streak untuk ditampilkan.';
wrap.appendChild(note);
requestAnimationFrame(() => tf_bindDrawdownDetailScrollSync(wrap));
return wrap;
}
const tbl = document.createElement('table');
tbl.className = 'drawdown-detail-table drawdown-detail-table-v317 drawdown-detail-table-v318';
const cg = document.createElement('colgroup');
// REV318: expanded detail contains ONLY the eight value columns. The existing
// header in the main Drawdown table is the single source of truth and will be
// moved in sync with this detail scroller.
['96px','58px','72px','82px','96px','58px','86px','88px'].forEach(w => {
const col = document.createElement('col');
col.style.width = w;
cg.appendChild(col);
});
tbl.appendChild(cg);

const tbody = document.createElement('tbody');
const priceBusy = tf_isMyfxbookPriceLoading();
for (let k = maxN - 1; k >= 1; k--) {
const tr = document.createElement('tr');
const showPBase = (k <= maxP);
const pRun = (showPBase && st && st.profitRuns && st.profitRuns[k]) ? st.profitRuns[k] : null;
const pCount = (pRun && Number.isFinite(+pRun.count)) ? +pRun.count : 0;
const showP = showPBase && (pCount > 0);
const showLBase = (k <= maxL);
const lRun = (showLBase && st && st.lossRuns && st.lossRuns[k]) ? st.lossRuns[k] : null;
const lCount = (lRun && Number.isFinite(+lRun.count)) ? +lRun.count : 0;
const showL = showLBase && (lCount > 0);
if (!showP && !showL) continue;

const tdPTrades = document.createElement('td');
tdPTrades.className = 'mono tp';
tdPTrades.textContent = showP ? String(k) : '';
tr.appendChild(tdPTrades);
const tdPCount = document.createElement('td');
tdPCount.className = 'mono tp';
tdPCount.textContent = showP ? String(pCount) : '';
tr.appendChild(tdPCount);
const tdPPips = document.createElement('td');
tdPPips.className = 'mono tp';
tdPPips.textContent = showP ? formatNumber((pRun && (pRun.bestPips || 0)) || 0, 1) : '';
tr.appendChild(tdPPips);
const tdPDollar = document.createElement('td');
tdPDollar.className = 'mono tp';
tdPDollar.innerHTML = showP ? (priceBusy ? tf_spinnerHTML(true) : formatMoney((pRun && (pRun.bestDollar || 0)) || 0)) : '';
tr.appendChild(tdPDollar);
const tdLTrades = document.createElement('td');
tdLTrades.className = 'mono sl';
tdLTrades.textContent = showL ? String(k) : '';
tr.appendChild(tdLTrades);
const tdLCount = document.createElement('td');
tdLCount.className = 'mono sl';
tdLCount.textContent = showL ? String(lCount) : '';
tr.appendChild(tdLCount);
const tdLPips = document.createElement('td');
tdLPips.className = 'mono sl';
tdLPips.textContent = showL ? formatNumber((lRun && (lRun.bestPips || 0)) || 0, 1) : '';
tr.appendChild(tdLPips);
const tdLDollar = document.createElement('td');
tdLDollar.className = 'mono sl';
tdLDollar.innerHTML = showL ? (priceBusy ? tf_spinnerHTML(true) : formatMoney((lRun && (lRun.bestDollar || 0)) || 0)) : '';
tr.appendChild(tdLDollar);
tbody.appendChild(tr);
}
tbl.appendChild(tbody);
wrap.appendChild(tbl);
requestAnimationFrame(() => {
  tf_applyDrawdownDetailColWidthsPx(tbl);
  tf_bindDrawdownDetailScrollSync(wrap);
});
return wrap;
}
function tf_bindDrawdownDetailsHandler() {
if (__tfDrawdownDetailsBound)
return;
const tbody = document.querySelector('#drawdown-table tbody');
if (!tbody)
return;
tbody.addEventListener('click', (ev) => {
try {
let t = ev && ev.target ? ev.target : null;
try {
if (t && t.nodeType === 3)
t = t.parentElement;
}
catch (e) { }
const cell = t && t.closest ? t.closest('td.dd-details-control') : null;
if (!cell)
return;
const tr = cell.parentElement;
if (!tr)
return;
const next = tr.nextElementSibling;
if (next && next.classList && next.classList.contains('dd-child-row')) {
try {
next.remove();
}
catch (e) {
try {
next.parentNode.removeChild(next);
}
catch (e2) { }
}
try {
tr.classList.remove('dd-open');
}
catch (e) { }
try {
cell.textContent = '▶';
}
catch (e) { }
return;
}
const analyst = tr.dataset ? tr.dataset.analyst : '';
const map = (typeof window !== 'undefined' && window.__tfDrawdownDetailByAnalyst) ? window.__tfDrawdownDetailByAnalyst : {};
const st = map && analyst ? map[analyst] : null;
const childTr = document.createElement('tr');
childTr.className = 'dd-child-row';
const td = document.createElement('td');
td.colSpan = 10;
td.appendChild(tf_buildDrawdownDetailElement(st || {}));
childTr.appendChild(td);
if (tr.parentNode) {
tr.parentNode.insertBefore(childTr, tr.nextSibling);
}
try {
tr.classList.add('dd-open');
}
catch (e) { }
try {
cell.textContent = '▼';
}
catch (e) { }
}
catch (e) { }
});
__tfDrawdownDetailsBound = true;
}
function tf_getStartBalanceForEquityMaxDD(ddPeakPoint, ddBaseEquity) {
try {
if (typeof equityMetric !== 'undefined' && equityMetric !== 'usd')
return ddBaseEquity;
let startBal = null;
if (typeof riskMode !== 'undefined' && riskMode === 'compound') {
const mk = ddPeakPoint && (ddPeakPoint.sortKey != null) ? tf_monthKeyFromSortKey(ddPeakPoint.sortKey) : null;
const srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
if (mk && Array.isArray(srcRows) && srcRows.length) {
const sk = ddPeakPoint ? ddPeakPoint.sortKey : null;
const a = ddPeakPoint && ddPeakPoint.analyst ? String(ddPeakPoint.analyst) : '';
const p = ddPeakPoint && ddPeakPoint.pair ? String(ddPeakPoint.pair) : '';
if (sk != null) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r)
continue;
if (r.sortKey === sk &&
String(r.analyst || '') === a &&
String(r.pair || '') === p &&
Number.isFinite(r.balanceCompound) &&
r.balanceCompound > 0) {
startBal = r.balanceCompound;
break;
}
}
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r)
continue;
const rmk = tf_monthKeyFromSortKey(r.sortKey);
if (rmk === mk && Number.isFinite(r.balanceCompound) && r.balanceCompound > 0) {
startBal = r.balanceCompound;
break;
}
}
}
}
if (!(Number.isFinite(startBal) && startBal > 0)) {
if (typeof currentBalance !== 'undefined' && Number.isFinite(currentBalance) && currentBalance > 0) {
startBal = currentBalance;
}
}
}
else {
if (typeof currentBalance !== 'undefined' && Number.isFinite(currentBalance) && currentBalance > 0) {
startBal = currentBalance;
}
}
if (!(Number.isFinite(startBal) && startBal > 0))
startBal = ddBaseEquity;
return (Number.isFinite(startBal) ? startBal : ddBaseEquity);
}
catch (e) {
return ddBaseEquity;
}
}
const TF_ISIGNAL_USERS_MGMT_KEY = 'tfIsignalUsersMgmt_v1';
function tf_storageLocalSet(obj) {
return new Promise((resolve) => {
try {
chrome.storage.local.set(obj, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(true);
});
}
catch (e) {
resolve(false);
}
});
}
function tf_isFiniteNumber(v) {
return Number.isFinite(v) && !Number.isNaN(v);
}
function tf_safeNumber(v) {
const n = typeof v === 'number' ? v : safeParseFloat(v);
return tf_isFiniteNumber(n) ? n : null;
}
function tf_isignalUsers_sendMessage(msg) {
return new Promise((resolve) => {
try {
chrome.runtime.sendMessage(msg, (resp) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(resp || null);
});
}
catch (e) {
resolve(null);
}
});
}
let __tfUsersMgmtSaveTimer = null;
function tf_isignalUsers_scheduleSave(cfg) {
try {
if (__tfUsersMgmtSaveTimer)
clearTimeout(__tfUsersMgmtSaveTimer);
}
catch (e) { }
__tfUsersMgmtSaveTimer = setTimeout(() => {
try {
tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: cfg });
}
catch (e) { }
}, 350);
}
async function tf_isignalUsers_fetchPlatformIds() {
const url = 'https://account.tradersfamily.id/profile/u/155921/?tab=settings';
const resp = await tf_isignalUsers_sendMessage({ type: 'tf_fetch_broker_platform_ids', url });
return resp || { ok: false, error: 'No response' };
}
const TF_ISIGNAL_CHANNELS_URL = 'https://account.tradersfamily.id/channels/isignal/';
const __tfIsUsersVerifyState = {
state: 'idle',
map: {},
channels: [],
fetchedAt: 0,
error: ''
};
function tf_isignalUsers_normName(s) {
return String(s || '').trim().toLowerCase();
}
function tf_isignalUsers_truncAnalyst10(nameRaw) {
const t = String(nameRaw || '').trim();
if (!t)
return '';
return (t.length > 10) ? (t.slice(0, 10) + '...') : t;
}
function tf_isignalUsers_buildActiveMap(channels) {
const map = {};
try {
(channels || []).forEach((ch) => {
const name = ch && ch.name ? String(ch.name).trim() : '';
const id = ch && ch.isignalId ? String(ch.isignalId).trim() : '';
const status = ch && ch.statusText ? String(ch.statusText).trim() : '';
const subEndOn = ch && ch.subscriptionEndOn ? String(ch.subscriptionEndOn).trim() : '';
if (!name)
return;
const k = tf_isignalUsers_normName(name);
if (!k || map[k])
return;
map[k] = { id: id || '', status: status || '', subEndOn: subEndOn || '' };
});
}
catch (e) { }
return map;
}
function tf_isignalUsers_getIsignalInfoByName(name) {
const k = tf_isignalUsers_normName(name);
return (k && __tfIsUsersVerifyState.map && __tfIsUsersVerifyState.map[k]) ? __tfIsUsersVerifyState.map[k] : null;
}
const __tfUsersVerifyOkSvg = `
<svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<path d="M15.1314 3.78317C16.572 1.88333 19.428 1.88333 20.8686 3.78317L21.5493 4.68092C22.3353 5.71754 23.6195 6.24944 24.9083 6.07224L26.0244 5.91878C28.3864 5.59402 30.406 7.61357 30.0812 9.97559L29.9278 11.0917C29.7506 12.3805 30.2825 13.6647 31.3191 14.4507L32.2168 15.1314C34.1167 16.572 34.1167 19.428 32.2168 20.8686L31.3191 21.5493C30.2825 22.3353 29.7506 23.6195 29.9278 24.9083L30.0812 26.0244C30.406 28.3864 28.3864 30.406 26.0244 30.0812L24.9083 29.9278C23.6195 29.7506 22.3353 30.2825 21.5493 31.3191L20.8686 32.2168C19.428 34.1167 16.572 34.1167 15.1314 32.2168L14.4507 31.3191C13.6647 30.2825 12.3805 29.7506 11.0917 29.9278L9.97559 30.0812C7.61357 30.406 5.59402 28.3864 5.91878 26.0244L6.07224 24.9083C6.24944 23.6195 5.71754 22.3353 4.68092 21.5493L3.78317 20.8686C1.88333 19.428 1.88333 16.572 3.78317 15.1314L4.68092 14.4507C5.71754 13.6647 6.24944 12.3805 6.07224 11.0917L5.91878 9.9756C5.59402 7.61358 7.61357 5.59402 9.97559 5.91878L11.0917 6.07224C12.3805 6.24944 13.6647 5.71754 14.4507 4.68092L15.1314 3.78317Z" fill="#00B451"></path>
<path d="M24.624 14.0039L16.596 21.9959L11.772 17.1359" stroke="#FCFCFC" stroke-width="2.7" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"></path>
</svg>`;
const __tfUsersVerifyBadSvg = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<circle cx="12" cy="12" r="10" fill="#EF4444"></circle>
<path d="M8 8l8 8M16 8l-8 8" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"></path>
</svg>`;
function tf_isignalUsers_getIsignalIdByName(name) {
const info = tf_isignalUsers_getIsignalInfoByName(name);
return info && info.id ? String(info.id) : '';
}
function tf_isignalUsers_getIsignalStatusByName(name) {
const info = tf_isignalUsers_getIsignalInfoByName(name);
return info && info.status ? String(info.status) : '';
}
function tf_isignalUsers_getIsignalSubscriptionEndOnByName(name) {
if (!name)
return '';
const k = tf_isignalUsers_normName(name);
if (!k)
return '';
const info = (__tfIsUsersVerifyState.map && __tfIsUsersVerifyState.map[k]) ? __tfIsUsersVerifyState.map[k] : null;
return info && info.subEndOn ? String(info.subEndOn).trim() : '';
}
function tf_isignalUsers_applyIsignalSubscriptionEndOn(el, nameRaw, mapState) {
if (!el)
return;
const name = String(nameRaw || '').trim();
const v = tf_isignalUsers_getIsignalSubscriptionEndOnByName(name, mapState);
const isPerAnalystLoading = (() => {
try {
if (el.classList && el.classList.contains('tf-isusers-sub-loading'))
return true;
const st = window.__tfIsUsersVerifyState;
const arr = st && Array.isArray(st.channels) ? st.channels : [];
const key = tf_isignalUsers_normName(name);
for (const c of arr) {
if (!c)
continue;
const nm = tf_isignalUsers_normName(c.name || c.baseName || '');
if (nm === key)
return !!c.subscriptionLoading;
}
}
catch (e) { }
return false;
})();
if (v) {
el.classList.remove('tf-isusers-sub-loading');
el.textContent = v;
return;
}
const state = (mapState && mapState.state) ? String(mapState.state) : '';
if (isPerAnalystLoading || state === 'loading') {
el.classList.add('tf-isusers-sub-loading');
el.innerHTML = tf_spinnerHTML(true);
return;
}
el.classList.remove('tf-isusers-sub-loading');
el.textContent = '—';
}
function tf_isignalUsers_getIsignalUrlByName(name) {
const id = tf_isignalUsers_getIsignalIdByName(name);
return id ? (`https://account.tradersfamily.id/channels/isignal/${id}`) : TF_ISIGNAL_CHANNELS_URL;
}
function tf_isignalUsers_applyVerifyBadge(badgeEl, analystName) {
if (!badgeEl)
return;
const name = String(analystName || '').trim();
const state = __tfIsUsersVerifyState.state || 'idle';
badgeEl.classList.remove('tf-users-verify-loading', 'tf-users-verify-ok', 'tf-users-verify-bad');
badgeEl.innerHTML = '';
badgeEl.removeAttribute('data-isignal-id');
if (state === 'loading' || state === 'idle') {
badgeEl.classList.add('tf-users-verify-loading');
badgeEl.title = 'Mencocokkan analis iSignal...';
return;
}
const id = tf_isignalUsers_getIsignalIdByName(name);
const status = tf_isignalUsers_getIsignalStatusByName(name);
if (state === 'done') {
if (id && String(status).trim().toLowerCase() === 'aktif') {
badgeEl.classList.add('tf-users-verify-ok');
badgeEl.innerHTML = __tfUsersVerifyOkSvg;
badgeEl.setAttribute('data-isignal-id', id);
badgeEl.title = 'Aktif (verified)';
}
else {
badgeEl.classList.add('tf-users-verify-bad');
badgeEl.innerHTML = __tfUsersVerifyBadSvg;
if (!id && !status) {
badgeEl.title = 'Tidak ditemukan di iSignal';
}
else if (!id && status) {
badgeEl.title = `${status} (id tidak ditemukan)`;
}
else {
badgeEl.title = status ? String(status) : 'Tidak aktif / belum diaktifkan';
}
}
return;
}
badgeEl.classList.add('tf-users-verify-bad');
badgeEl.innerHTML = __tfUsersVerifyBadSvg;
badgeEl.title = 'Gagal scan iSignal';
}
function tf_isignalUsers_applySetBadge(badgeEl, spinnerEl, cfg, platformId, analystName) {
try {
if (!badgeEl)
return;
const pid = String(platformId || '');
const aName = String(analystName || '');
const st = (cfg && cfg.usersSetStatus && cfg.usersSetStatus[pid] && cfg.usersSetStatus[pid][aName]) ? cfg.usersSetStatus[pid][aName] : null;
const status = st && st.status ? st.status : 'idle';
const reason = st && st.reason ? String(st.reason) : '';
badgeEl.classList.remove('tf-users-set-badge-idle', 'tf-users-set-badge-running', 'tf-users-set-badge-ok', 'tf-users-set-badge-fail', 'tf-users-set-badge-cooldown');
if (status === 'running')
badgeEl.classList.add('tf-users-set-badge-running');
else if (status === 'ok')
badgeEl.classList.add('tf-users-set-badge-ok');
else if (status === 'fail')
badgeEl.classList.add('tf-users-set-badge-fail');
else if (status === 'cooldown')
badgeEl.classList.add('tf-users-set-badge-cooldown');
else
badgeEl.classList.add('tf-users-set-badge-idle');
badgeEl.title =
reason ? reason :
(status === 'ok' ? 'Set berhasil' :
status === 'fail' ? 'Set gagal' :
status === 'running' ? 'Sedang proses...' :
status === 'cooldown' ? 'Cooldown 5 menit...' : '');
if (spinnerEl) {
const isRunning = (status === 'running');
spinnerEl.style.display = isRunning ? 'inline-flex' : 'none';
badgeEl.style.display = isRunning ? 'none' : 'inline-flex';
}
if (status === 'ok') {
badgeEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M7.629 13.233 4.34 9.944l-1.06 1.06 4.35 4.35L17.72 5.263l-1.06-1.06z"/></svg>';
}
else if (status === 'fail') {
badgeEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M11.414 10l4.95-4.95-1.414-1.414L10 8.586 5.05 3.636 3.636 5.05 8.586 10l-4.95 4.95 1.414 1.414L10 11.414l4.95 4.95 1.414-1.414z"/></svg>';
}
else if (status === 'cooldown') {
const until = st && (st.cooldownUntil || st.until) ? Number(st.cooldownUntil || st.until) : null;
const totalMs = st && st.cooldownTotalMs ? Number(st.cooldownTotalMs) : (5 * 60 * 1000);
const end = (until && Number.isFinite(until)) ? until : (Date.now() + (5 * 60 * 1000));
badgeEl.textContent = tf_isignalUsers_formatMMSS(Math.ceil(Math.max(0, end - Date.now()) / 1000));
badgeEl.setAttribute('data-end-at', String(end));
badgeEl.setAttribute('data-total-ms', String(totalMs));
try {
tf_isignalUsers_ensureCooldownTicker();
}
catch (e) { }
}
else {
badgeEl.innerHTML = '';
}
}
catch (e) { }
}
function tf_isignalUsers_formatMMSS(totalSeconds) {
const s = Math.max(0, Math.floor(Number(totalSeconds) || 0));
const m = Math.floor(s / 60);
const r = s % 60;
return `${m}:${String(r).padStart(2, '0')}`;
}
function tf_isignalUsers_migrateLegacyCooldownStatus(cfg) {
try {
if (!cfg || typeof cfg !== 'object')
return false;
if (!cfg.usersSetStatus || typeof cfg.usersSetStatus !== 'object')
return false;
let changed = false;
const now = Date.now();
if (!cfg.usersSetCooldown || typeof cfg.usersSetCooldown !== 'object')
cfg.usersSetCooldown = {};
Object.keys(cfg.usersSetStatus || {}).forEach((pid) => {
const mp = cfg.usersSetStatus[pid];
if (!mp || typeof mp !== 'object')
return;
Object.keys(mp || {}).forEach((aName) => {
const st = mp[aName];
if (!st || st.status !== 'cooldown')
return;
const until = Number(st.cooldownUntil || st.until);
const totalMs = Number(st.cooldownTotalMs || st.totalMs || (5 * 60 * 1000));
if (!cfg.usersSetCooldown[pid] || typeof cfg.usersSetCooldown[pid] !== 'object')
cfg.usersSetCooldown[pid] = {};
if (Number.isFinite(until) && until > now) {
cfg.usersSetCooldown[pid][aName] = {
until,
totalMs,
reason: st.reason ? String(st.reason) : 'Cooldown 5 menit',
updatedAt: now
};
}
mp[aName] = { status: 'fail', reason: st.reason ? String(st.reason) : 'Cooldown 5 menit', updatedAt: now };
changed = true;
});
});
if (changed) {
try {
cfg.updatedAt = now;
}
catch (e) { }
}
return changed;
}
catch (e) {
return false;
}
}
function tf_isignalUsers_refreshSetCountdownUI(platformId, analystName, cfgOverride) {
try {
const cfg = cfgOverride || window.__tf_isignalUsersMgmtCfg || null;
const pid = String(platformId || '');
const aName = String(analystName || '').trim();
if (!pid || !aName)
return;
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(pid) : pid;
const escA = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(aName) : aName;
const links = document.querySelectorAll(`.tf-users-detail-set-link[data-platform-id="${escPid}"][data-analyst="${escA}"]`);
if (!links || !links.length)
return;
const cd = (cfg && cfg.usersSetCooldown && cfg.usersSetCooldown[pid] && cfg.usersSetCooldown[pid][aName])
? cfg.usersSetCooldown[pid][aName]
: null;
const until = cd && cd.until ? Number(cd.until) : null;
const now = Date.now();
const active = (Number.isFinite(until) && until > now);
links.forEach((link) => {
try {
if (!link)
return;
let span = null;
const nxt = link.nextElementSibling;
if (nxt && nxt.classList && nxt.classList.contains('tf-users-set-countdown')) {
span = nxt;
}
else {
try {
span = link.parentElement ? link.parentElement.querySelector(`.tf-users-set-countdown[data-platform-id="${escPid}"][data-analyst="${escA}"]`) : null;
}
catch (e) { }
}
if (!span) {
span = document.createElement('span');
span.className = 'tf-users-set-countdown';
span.setAttribute('data-platform-id', pid);
span.setAttribute('data-analyst', aName);
span.style.display = 'none';
span.textContent = '';
try {
link.insertAdjacentElement('afterend', span);
}
catch (e) {
try {
link.parentNode && link.parentNode.insertBefore(span, link.nextSibling);
}
catch (e2) { }
}
}
if (!active) {
link.style.display = '';
span.style.display = 'none';
span.textContent = '';
span.removeAttribute('data-end-at');
span.removeAttribute('title');
return;
}
link.style.display = 'none';
span.style.display = 'inline-flex';
span.setAttribute('data-end-at', String(until));
span.title = (cd && cd.reason) ? String(cd.reason) : 'Anda harus menunggu 5 menit untuk melakukan perubahan lainnya';
const rem = Math.max(0, until - now);
span.textContent = tf_isignalUsers_formatMMSS(Math.ceil(rem / 1000));
}
catch (e) { }
});
}
catch (e) { }
}
function tf_isignalUsers_refreshAllSetCountdownUI(cfgOverride) {
try {
const cfg = cfgOverride || window.__tf_isignalUsersMgmtCfg || null;
if (!cfg || !cfg.usersSetCooldown)
return;
const now = Date.now();
Object.keys(cfg.usersSetCooldown || {}).forEach((pid) => {
const mp = cfg.usersSetCooldown[pid];
if (!mp)
return;
Object.keys(mp || {}).forEach((aName) => {
const st = mp[aName];
const until = st && st.until ? Number(st.until) : null;
if (Number.isFinite(until) && until > now) {
tf_isignalUsers_refreshSetCountdownUI(pid, aName, cfg);
}
});
});
}
catch (e) { }
}
function tf_isignalUsers_finalizeExpiredSetCooldowns() {
const cfg = window.__tf_isignalUsersMgmtCfg || null;
if (!cfg || !cfg.usersSetCooldown)
return;
const now = Date.now();
let changed = false;
try {
Object.keys(cfg.usersSetCooldown || {}).forEach((pid) => {
const mp = cfg.usersSetCooldown[pid];
if (!mp)
return;
Object.keys(mp || {}).forEach((aName) => {
const st = mp[aName];
const until = st && st.until ? Number(st.until) : null;
if (!Number.isFinite(until) || until > now)
return;
try {
delete mp[aName];
}
catch (e) {
mp[aName] = null;
}
changed = true;
try {
tf_isignalUsers_refreshSetCountdownUI(pid, aName, cfg);
}
catch (e) { }
});
try {
if (mp && typeof mp === 'object' && Object.keys(mp).filter(k => mp[k]).length === 0) {
delete cfg.usersSetCooldown[pid];
changed = true;
}
}
catch (e) { }
});
}
catch (e) { }
if (changed) {
try {
cfg.updatedAt = now;
}
catch (e) { }
try {
tf_isignalUsers_saveMgmtCfg(cfg);
}
catch (e) { }
}
}
function tf_isignalUsers_updateSetCountdownTimers() {
try {
const now = Date.now();
try {
document.querySelectorAll('.tf-users-set-countdown[data-end-at]').forEach((span) => {
const end = Number(span.getAttribute('data-end-at') || (span.dataset ? span.dataset.endAt : null));
if (!Number.isFinite(end) || !end)
return;
const rem = Math.max(0, end - now);
span.textContent = tf_isignalUsers_formatMMSS(Math.ceil(rem / 1000));
if (rem <= 0) {
try {
const link = span.previousElementSibling;
if (link && link.classList && link.classList.contains('tf-users-detail-set-link')) {
link.style.display = '';
}
span.style.display = 'none';
}
catch (e) { }
}
});
}
catch (e) { }
const cfg = window.__tf_isignalUsersMgmtCfg || null;
if (cfg && cfg.usersSetCooldown) {
try {
tf_isignalUsers_refreshAllSetCountdownUI(cfg);
}
catch (e) { }
tf_isignalUsers_finalizeExpiredSetCooldowns();
}
}
catch (e) { }
}
function tf_isignalUsers_ensureSetCountdownTicker() {
if (window.__tfIsUsersSetCountdownTicker)
return;
window.__tfIsUsersSetCountdownTicker = setInterval(() => {
try {
tf_isignalUsers_updateSetCountdownTimers();
}
catch (e) { }
}, 1000);
try {
tf_isignalUsers_updateSetCountdownTimers();
}
catch (e) { }
}
function tf_isignalUsers_updateCooldownTextBadges() {
try {
const badges = document.querySelectorAll('.tf-users-set-badge.tf-users-set-badge-cooldown[data-end-at]');
if (!badges || !badges.length)
return;
const now = Date.now();
badges.forEach((badge) => {
const end = Number(badge.getAttribute('data-end-at') || (badge.dataset ? badge.dataset.endAt : null));
if (!Number.isFinite(end))
return;
const rem = Math.max(0, end - now);
badge.textContent = tf_isignalUsers_formatMMSS(Math.ceil(rem / 1000));
});
}
catch (e) { }
}
function tf_isignalUsers_finalizeExpiredCooldowns() {
const cfg = window.__tf_isignalUsersMgmtCfg || null;
if (!cfg || !cfg.usersSetStatus)
return;
const now = Date.now();
let changed = false;
try {
Object.keys(cfg.usersSetStatus || {}).forEach((pid) => {
const mp = cfg.usersSetStatus[pid];
if (!mp)
return;
Object.keys(mp || {}).forEach((aName) => {
const st = mp[aName];
if (!st || st.status !== 'cooldown')
return;
const until = Number(st.cooldownUntil || st.until);
if (Number.isFinite(until) && until > now)
return;
const finalStatus = (st.finalStatus === 'ok') ? 'ok' : (st.finalStatus === 'fail' ? 'fail' : (st.finalOk ? 'ok' : 'fail'));
const finalReason = st.finalReason ? String(st.finalReason) : (st.reason ? String(st.reason) : '');
mp[aName] = { status: finalStatus, reason: finalReason, updatedAt: now };
changed = true;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
});
});
}
catch (e) { }
if (changed) {
try {
cfg.updatedAt = now;
}
catch (e) { }
try {
tf_isignalUsers_saveMgmtCfg(cfg);
}
catch (e) { }
}
}
function tf_isignalUsers_updateCooldownTimers() {
tf_isignalUsers_updateCooldownTextBadges();
tf_isignalUsers_finalizeExpiredCooldowns();
}
function tf_isignalUsers_ensureCooldownTicker() {
if (window.__tfIsUsersCooldownTicker)
return;
window.__tfIsUsersCooldownTicker = setInterval(() => {
try {
tf_isignalUsers_updateCooldownTimers();
}
catch (e) { }
}, 1000);
try {
tf_isignalUsers_updateCooldownTimers();
}
catch (e) { }
}
function tf_isignalUsers_applyAnalystLink(linkEl, analystName) {
if (!linkEl)
return;
const name = String(analystName || '').trim();
const id = tf_isignalUsers_getIsignalIdByName(name);
const url = id ? (`https://account.tradersfamily.id/channels/isignal/${id}`) : TF_ISIGNAL_CHANNELS_URL;
linkEl.setAttribute('href', url);
linkEl.setAttribute('data-isignal-url', url);
linkEl.setAttribute('data-analyst', name);
}
function tf_isignalUsers_statusClassFromText(statusText) {
const s = String(statusText || '').trim().toLowerCase();
if (s === 'aktif')
return 'tf-isignal-status-aktif';
if (s.includes('belum'))
return 'tf-isignal-status-belum';
if (s.includes('tidak'))
return 'tf-isignal-status-tidak';
return 'tf-isignal-status-unknown';
}
function tf_isignalUsers_applyIsignalStatusPill(pillEl, analystName) {
if (!pillEl)
return;
const name = String(analystName || '').trim();
const state = __tfIsUsersVerifyState.state || 'idle';
pillEl.classList.remove('tf-isignal-status-aktif', 'tf-isignal-status-belum', 'tf-isignal-status-tidak', 'tf-isignal-status-unknown');
if (state === 'loading') {
pillEl.classList.add('tf-isignal-status-unknown');
pillEl.textContent = 'Scanning...';
return;
}
if (state === 'idle') {
pillEl.classList.add('tf-isignal-status-unknown');
pillEl.textContent = '—';
return;
}
if (state === 'done') {
const status = tf_isignalUsers_getIsignalStatusByName(name);
const txt = status ? String(status) : 'Tidak ditemukan';
pillEl.textContent = txt;
pillEl.classList.add(tf_isignalUsers_statusClassFromText(txt));
return;
}
pillEl.classList.add('tf-isignal-status-unknown');
pillEl.textContent = 'Error';
}
function tf_isignalUsers_refreshIsignalAnalystStatusCells() {
try {
document.querySelectorAll('.tf-isignal-status-pill[data-analyst]').forEach((pill) => {
const name = pill.getAttribute('data-analyst') || '';
tf_isignalUsers_applyIsignalStatusPill(pill, name);
});
document.querySelectorAll('.tf-isignal-subend[data-analyst]').forEach((el) => {
const name = el.getAttribute('data-analyst') || '';
tf_isignalUsers_applyIsignalSubscriptionEndOn(el, name);
});
const loader = document.getElementById('tf-isignal-analysts-loader');
if (loader)
loader.style.display = (__tfIsUsersVerifyState.state === 'loading') ? 'flex' : 'none';
const errBox = document.getElementById('tf-isignal-analysts-error');
if (errBox) {
const show = (__tfIsUsersVerifyState.state === 'error');
errBox.style.display = show ? 'block' : 'none';
errBox.textContent = show ? (String(__tfIsUsersVerifyState.error || 'Gagal scan iSignal')) : '';
}
}
catch (e) { }
}
function tf_isignalUsers_getUniqueAnalystNamesFromEntries(entries) {
const out = [];
const seen = new Set();
try {
(entries || []).forEach((e) => {
const name = e && e.baseName ? String(e.baseName).trim() : '';
if (!name)
return;
const k = tf_isignalUsers_normName(name);
if (!k || seen.has(k))
return;
seen.add(k);
out.push(name);
});
}
catch (e) { }
out.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
return out;
}
function tf_isignalUsers_getAllChannelsSorted() {
const list = Array.isArray(__tfIsUsersVerifyState.channels) ? __tfIsUsersVerifyState.channels.slice() : [];
const out = [];
const seen = new Set();
try {
list.forEach((ch) => {
const name = ch && ch.name ? String(ch.name).trim() : '';
if (!name)
return;
const k = tf_isignalUsers_normName(name);
if (!k || seen.has(k))
return;
seen.add(k);
const rawSub = ch && ch.subscriptionEndOn ? String(ch.subscriptionEndOn).trim() : '';
const sub = (rawSub === '—' || rawSub === '-' || rawSub.toLowerCase() === 'n/a') ? '' : rawSub;
const loadingFlag = (ch && typeof ch.subscriptionLoading === 'boolean') ? ch.subscriptionLoading : !sub;
out.push({
name,
statusText: ch && ch.statusText ? String(ch.statusText).trim() : '',
subscriptionEndOn: sub,
subscriptionLoading: !!loadingFlag
});
});
}
catch (e) { }
out.sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { sensitivity: 'base' }));
return out;
}
function tf_isignalUsers_renderIsignalAnalystSkeleton(tbodies, rows) {
const bodies = Array.isArray(tbodies) ? tbodies : [];
const n = Math.max(3, parseInt(rows, 10) || 6);
bodies.forEach((tbody) => {
if (!tbody)
return;
tbody.innerHTML = '';
for (let i = 0; i < n; i++) {
const tr = document.createElement('tr');
const td1 = document.createElement('td');
const td2 = document.createElement('td');
const td3 = document.createElement('td');
td1.style.textAlign = 'left';
td2.style.textAlign = 'left';
td3.style.textAlign = 'left';
td1.innerHTML = '<div class="tf-skel-line" style="width: 78%;"></div>';
td2.innerHTML = '<div class="tf-skel-line" style="width: 62%;"></div>';
td3.innerHTML = '<div class="tf-skel-line" style="width: 72%;"></div>';
tr.appendChild(td1);
tr.appendChild(td2);
tr.appendChild(td3);
tbody.appendChild(tr);
}
});
}
function tf_isignalUsers_splitIntoColumns(arr, cols) {
const list = Array.isArray(arr) ? arr.slice() : [];
const n = Math.max(1, parseInt(cols, 10) || 1);
const per = Math.ceil(list.length / n) || 1;
const out = [];
for (let i = 0; i < n; i++) {
out.push(list.slice(i * per, (i + 1) * per));
}
return out;
}
function tf_isignalUsers_renderIsignalAnalystTables(entries) {
const tb1 = document.getElementById('tf-isignal-analyst-tbody-1');
const tb2 = document.getElementById('tf-isignal-analyst-tbody-2');
if (!tb1 || !tb2)
return;
tb1.innerHTML = '';
tb2.innerHTML = '';
const state = __tfIsUsersVerifyState.state || 'idle';
if (state === 'idle' || state === 'loading') {
tf_isignalUsers_renderIsignalAnalystSkeleton([tb1, tb2], 7);
tf_isignalUsers_refreshAllVerifyBadges();
return;
}
if (state === 'error') {
const msg = String(__tfIsUsersVerifyState.error || 'Gagal scan iSignal');
[tb1, tb2].forEach((tbody) => {
tbody.innerHTML = '';
const tr = document.createElement('tr');
const td = document.createElement('td');
td.colSpan = 3;
td.style.textAlign = 'left';
td.textContent = msg;
tr.appendChild(td);
tbody.appendChild(tr);
});
tf_isignalUsers_refreshAllVerifyBadges();
return;
}
const channels = Array.isArray(entries) ? entries : tf_isignalUsers_getAllChannelsSorted();
const cols = tf_isignalUsers_splitIntoColumns(channels, 2);
const bodies = [tb1, tb2];
cols.forEach((col, colIdx) => {
const tbody = bodies[colIdx];
(col || []).forEach((item) => {
const name = item && item.name ? String(item.name).trim() : '';
if (!name)
return;
const tr = document.createElement('tr');
const tdName = document.createElement('td');
tdName.style.textAlign = 'left';
const wrap = document.createElement('div');
wrap.className = 'tf-users-analyst-cell';
const badge = document.createElement('span');
badge.className = 'tf-users-verify tf-users-verify-loading';
badge.setAttribute('data-analyst', name);
badge.title = 'Mencocokkan analis iSignal...';
const a = document.createElement('a');
a.className = 'tf-users-analyst-link';
a.textContent = (typeof formatAnalystDisplayName === 'function') ? formatAnalystDisplayName(name) : name;
a.title = name;
a.setAttribute('data-analyst', name);
a.setAttribute('href', TF_ISIGNAL_CHANNELS_URL);
a.setAttribute('target', '_blank');
a.setAttribute('rel', 'noopener noreferrer');
wrap.appendChild(badge);
wrap.appendChild(a);
tdName.appendChild(wrap);
const tdStatus = document.createElement('td');
tdStatus.style.textAlign = 'left';
const pill = document.createElement('span');
pill.className = 'tf-isignal-status-pill tf-isignal-status-unknown';
pill.setAttribute('data-analyst', name);
const st = item && item.statusText ? String(item.statusText).trim() : '';
pill.textContent = st || '—';
pill.classList.remove('tf-isignal-status-unknown');
pill.classList.add(tf_isignalUsers_statusClassFromText(st || ''));
tdStatus.appendChild(pill);
const tdSub = document.createElement('td');
tdSub.className = 'tf-subend-td';
tdSub.style.verticalAlign = 'middle';
tdSub.style.textAlign = 'left';
const subSpan = document.createElement('span');
subSpan.className = 'tf-isignal-subend';
subSpan.setAttribute('data-analyst', name);
const subTxt = item && item.subscriptionEndOn ? String(item.subscriptionEndOn).trim() : '';
if (!subTxt && item && item.subscriptionLoading) {
subSpan.classList.add('tf-isusers-sub-loading');
subSpan.innerHTML = tf_spinnerHTML(true);
}
else {
subSpan.textContent = subTxt || '—';
}
tdSub.appendChild(subSpan);
tr.appendChild(tdName);
tr.appendChild(tdStatus);
tr.appendChild(tdSub);
tbody.appendChild(tr);
});
});
tf_isignalUsers_refreshAllVerifyBadges();
}
function tf_isignalUsers_refreshAllVerifyBadges() {
try {
document.querySelectorAll('.tf-users-verify[data-analyst]').forEach((badge) => {
const name = badge.getAttribute('data-analyst') || '';
tf_isignalUsers_applyVerifyBadge(badge, name);
});
document.querySelectorAll('a.tf-users-analyst-link[data-analyst]').forEach((a) => {
const name = a.getAttribute('data-analyst') || '';
tf_isignalUsers_applyAnalystLink(a, name);
});
tf_isignalUsers_refreshIsignalAnalystStatusCells();
}
catch (e) { }
}
async function tf_isignalUsers_startActiveChannelsScan() {
try {
if (__tfIsUsersVerifyState.state === 'loading')
return;
if (__tfIsUsersVerifyState.state === 'done' && __tfIsUsersVerifyState.fetchedAt && (Date.now() - __tfIsUsersVerifyState.fetchedAt) < 5 * 60 * 1000) {
try {
tf_isignalUsers_renderIsignalAnalystTables(null);
}
catch (e) { }
tf_isignalUsers_refreshAllVerifyBadges();
return;
}
__tfIsUsersVerifyState.state = 'loading';
__tfIsUsersVerifyState.error = '';
tf_isignalUsers_refreshAllVerifyBadges();
const resp = await tf_isignalUsers_sendMessage({ type: 'tf_scan_active_isignal_channels', url: TF_ISIGNAL_CHANNELS_URL });
if (resp && resp.ok) {
const channelsRaw = Array.isArray(resp.channels) ? resp.channels : [];
const channels = channelsRaw.map((c) => {
const out = Object.assign({}, c);
const subRaw = (out.subscriptionEndOn || '').toString().trim();
const sub = (subRaw === '-' || subRaw === '—') ? '' : subRaw;
out.subscriptionEndOn = sub;
if (!sub)
out.subscriptionLoading = true;
return out;
});
__tfIsUsersVerifyState.channels = channels;
__tfIsUsersVerifyState.map = tf_isignalUsers_buildActiveMap(channels);
__tfIsUsersVerifyState.state = 'done';
__tfIsUsersVerifyState.fetchedAt = Date.now();
__tfIsUsersVerifyState.error = '';
}
else {
__tfIsUsersVerifyState.channels = [];
__tfIsUsersVerifyState.map = {};
__tfIsUsersVerifyState.state = 'error';
__tfIsUsersVerifyState.fetchedAt = Date.now();
__tfIsUsersVerifyState.error = resp && resp.error ? String(resp.error) : 'Unknown error';
}
try {
tf_isignalUsers_renderIsignalAnalystTables(null);
}
catch (e) { }
tf_isignalUsers_refreshAllVerifyBadges();
}
catch (e) {
try {
__tfIsUsersVerifyState.state = 'error';
__tfIsUsersVerifyState.error = String(e);
__tfIsUsersVerifyState.fetchedAt = Date.now();
}
catch (x) { }
tf_isignalUsers_refreshAllVerifyBadges();
}
}
let __tfIsUsersAnalystMetaCache = null;
async function tf_isignalUsers_prepareAnalystMeta() {
if (__tfIsUsersAnalystMetaCache && __tfIsUsersAnalystMetaCache.ok)
return __tfIsUsersAnalystMetaCache;
try {
tf_loadTable1StateFromLocalStorage();
}
catch (e) { }
const keys = ['tfHistorySignals', 'tfAnalystSources', 'tfNoDataPairs', 'tfAvgSlPips', TF_MYFXBOOK_PRICES_KEY];
const data = await tf_storageLocalGet(keys);
try {
historySignals = Array.isArray(data.tfHistorySignals) ? data.tfHistorySignals : [];
}
catch (e) {
historySignals = [];
}
try {
analystSourcesByName = (data.tfAnalystSources && typeof data.tfAnalystSources === 'object') ? data.tfAnalystSources : {};
}
catch (e) {
analystSourcesByName = {};
}
try {
noDataPairsByAnalyst = (data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object') ? data.tfNoDataPairs : {};
}
catch (e) {
noDataPairsByAnalyst = {};
}
try {
avgSlPipsByAnalystPair = (data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object') ? data.tfAvgSlPips : {};
}
catch (e) {
avgSlPipsByAnalystPair = {};
}
try {
tfMyfxbookPriceMapLatest = (data && data[TF_MYFXBOOK_PRICES_KEY] && typeof data[TF_MYFXBOOK_PRICES_KEY] === 'object') ? data[TF_MYFXBOOK_PRICES_KEY] : null;
}
catch (e) {
tfMyfxbookPriceMapLatest = null;
}
try {
rebuildAnalystListFromSources();
}
catch (e) { }
if (!Array.isArray(ANALYSTS) || !ANALYSTS.length) {
__tfIsUsersAnalystMetaCache = { ok: false, error: 'Belum ada data analis. Silakan scan / import dulu di dashboard.' };
try {
window.__tfIsUsersAnalystMetaCache = __tfIsUsersAnalystMetaCache;
}
catch (e) { }
return __tfIsUsersAnalystMetaCache;
}
const entries = [];
try {
for (const a of ANALYSTS) {
const pair = (a && a.pair ? String(a.pair) : '').toUpperCase();
const base = a && a.baseName ? String(a.baseName) : '';
if (!base || !pair)
continue;
const slStats = computeSlStatsFromHistory(base, pair);
const effObj = getEffectiveSlForAnalyst(base, pair, slStats);
const effectiveSl = (effObj && typeof effObj === 'object') ? effObj.pips : effObj;
const suggestedRisk = getRiskPercentForAnalyst(base, pair);
const dollarPerPip = getDollarPerPipForAnalyst(a, pair);
entries.push({
baseName: base,
pair,
effectiveSlPips: (tf_isFiniteNumber(effectiveSl) && effectiveSl > 0) ? effectiveSl : null,
suggestedRisk: (tf_isFiniteNumber(suggestedRisk) && suggestedRisk > 0) ? suggestedRisk : null,
dollarPerPip: (tf_isFiniteNumber(dollarPerPip) && dollarPerPip > 0) ? dollarPerPip : null
});
}
}
catch (e) { }
__tfIsUsersAnalystMetaCache = { ok: true, entries };
try {
window.__tfIsUsersAnalystMetaCache = __tfIsUsersAnalystMetaCache;
}
catch (e) { }
return __tfIsUsersAnalystMetaCache;
}
function tf_isignalUsers_buildChildRowHtml(platformId) {
const tr = document.createElement('tr');
tr.className = 'tf-users-child-row';
tr.setAttribute('data-platform-id', platformId);
const td = document.createElement('td');
td.colSpan = 6;
const wrap = document.createElement('div');
wrap.className = 'tf-users-detail-wrap';
wrap.setAttribute('data-platform-id', platformId);
const grid = document.createElement('div');
grid.className = 'tf-users-detail-grid';
const makeTable = (tbodyClass) => {
const table = document.createElement('table');
table.className = 'tf-users-detail-table';
table.innerHTML = `
<thead>
<tr>
<th class="tf-col-action">Action</th>
<th class="tf-col-disconnect" style="text-align:left;">Disconnect</th>
<th class="tf-col-analyst" style="text-align:left;">Nama Analis</th>
<th class="tf-col-pair">Pair</th>
<th class="tf-col-lot">Lot<br>Size</th>
<th class="tf-col-risk">Risk % /<br>Trade</th>
</tr>
</thead>
<tbody class="${tbodyClass}"></tbody>
`;
return table;
};
grid.appendChild(makeTable('tf-users-detail-tbody-left'));
grid.appendChild(makeTable('tf-users-detail-tbody-right'));
wrap.appendChild(grid);
td.appendChild(wrap);
tr.appendChild(td);
return tr;
}
function tf_isignalUsers_renderDetailTable(childRow, cfg, analystEntries, platformId, defaultBalance, defaultRisk) {
const wrap = childRow ? childRow.querySelector('.tf-users-detail-wrap') : null;
const tbodyLeft = wrap ? wrap.querySelector('tbody.tf-users-detail-tbody-left') : null;
const tbodyRight = wrap ? wrap.querySelector('tbody.tf-users-detail-tbody-right') : null;
if (!tbodyLeft || !tbodyRight)
return;
const user = (cfg.users && cfg.users[platformId]) ? cfg.users[platformId] : {};
const bal = tf_safeNumber(user.balance);
const balance = (bal != null && bal > 0) ? bal : null;
const accRisk = tf_safeNumber(user.risk);
const accountRisk = (accRisk != null && accRisk > 0) ? accRisk : defaultRisk;
tbodyLeft.innerHTML = '';
tbodyRight.innerHTML = '';
const entries = Array.isArray(analystEntries) ? analystEntries : [];
const mid = Math.ceil(entries.length / 2);
const leftEntries = entries.slice(0, mid);
const rightEntries = entries.slice(mid);
const appendRow = (entry, tbody) => {
const key = `${entry.baseName}||${entry.pair}`;
const analystRiskMap = (user.analystRisk && typeof user.analystRisk === 'object') ? user.analystRisk : {};
const overrideRisk = tf_safeNumber(analystRiskMap[key]);
const risk = (overrideRisk != null && overrideRisk > 0) ? overrideRisk : accountRisk;
const analystLotMap = (user.analystLot && typeof user.analystLot === 'object') ? user.analystLot : {};
const overrideLot = tf_safeNumber(analystLotMap[key]);
const sl = (entry.effectiveSlPips != null && entry.effectiveSlPips > 0) ? entry.effectiveSlPips : null;
const dpp = (entry.dollarPerPip != null && entry.dollarPerPip > 0) ? entry.dollarPerPip : null;
let defaultLot = null;
if (balance != null && sl && dpp) {
const rawLot = computeLot(balance, risk, sl, dpp);
const lot = roundLotToTwoDecimals(rawLot);
if (tf_isFiniteNumber(lot) && lot > 0)
defaultLot = lot;
}
const lotValue = (overrideLot != null && overrideLot > 0) ? overrideLot : defaultLot;
const tr = document.createElement('tr');
tr.dataset.entryKey = key;
if (sl)
tr.dataset.sl = String(sl);
if (dpp)
tr.dataset.dpp = String(dpp);
const tdAnalyst = document.createElement('td');
tdAnalyst.className = 'tf-col-analyst';
const analystLink = document.createElement('a');
analystLink.href = '#';
analystLink.className = 'tf-link tf-users-analyst-link';
analystLink.textContent = tf_isignalUsers_truncAnalyst10(entry.baseName || '');
analystLink.title = String(entry.baseName || '').trim();
analystLink.setAttribute('data-analyst', String(entry.baseName || ''));
tdAnalyst.appendChild(analystLink);
const setBadge = document.createElement('span');
setBadge.className = 'tf-users-set-badge tf-users-set-badge-idle';
setBadge.setAttribute('data-analyst', String(entry.baseName || ''));
setBadge.setAttribute('data-platform-id', String(platformId));
const setSpinner = document.createElement('span');
setSpinner.className = 'tf-users-set-spinner';
setSpinner.setAttribute('data-analyst', String(entry.baseName || ''));
setSpinner.setAttribute('data-platform-id', String(platformId));
try {
tf_isignalUsers_applyAnalystLink(analystLink, entry.baseName);
tf_isignalUsers_applySetBadge(setBadge, setSpinner, cfg, platformId, entry.baseName);
}
catch (e) { }
const tdPair = document.createElement('td');
tdPair.className = 'tf-col-pair';
tdPair.innerHTML = `<span class="tf-users-mono">${escapeHtml(entry.pair)}</span>`;
const tdLot = document.createElement('td');
tdLot.className = 'tf-users-detail-lot-cell tf-col-lot';
const lotInp = document.createElement('input');
lotInp.type = 'number';
lotInp.step = '0.01';
lotInp.min = '0.01';
lotInp.inputMode = 'decimal';
lotInp.className = 'form-input tf-users-detail-lot-input';
lotInp.dataset.entryKey = key;
lotInp.dataset.defaultLot = (defaultLot != null) ? String(defaultLot) : '';
lotInp.dataset.customLot = (overrideLot != null && overrideLot > 0) ? '1' : '0';
lotInp.value = (lotValue != null && lotValue > 0) ? String(lotValue) : '';
lotInp.placeholder = defaultLot != null ? String(defaultLot) : '—';
lotInp.title = (overrideLot != null && overrideLot > 0)
? 'Lot Size custom untuk baris ini. Kosongkan untuk kembali ke hasil perhitungan default.'
: 'Lot Size default dari perhitungan. Ubah angka untuk memakai Lot Size custom.';
tdLot.appendChild(lotInp);
const tdRisk = document.createElement('td');
tdRisk.className = 'tf-col-risk';
const inp = document.createElement('input');
inp.type = 'number';
inp.step = '0.01';
inp.min = '0';
inp.className = 'form-input tf-users-detail-risk-input';
inp.dataset.entryKey = key;
inp.value = String(risk);
inp.title = (overrideRisk != null && overrideRisk > 0)
? 'Risk %/Trade ini custom untuk baris ini (Metatrader ID ini).'
: 'Risk %/Trade default (mengikuti main row). Ubah angka untuk custom baris ini.';
tdRisk.appendChild(inp);
const tdAction = document.createElement('td');
tdAction.className = 'tf-col-action';
const safeAnalyst = String(entry.baseName || '');
const setWrap = document.createElement('div');
setWrap.className = 'tf-users-action-setwrap';
const setLink = document.createElement('a');
setLink.href = '#';
setLink.className = 'tf-link tf-users-detail-set-link';
setLink.setAttribute('data-platform-id', String(platformId));
setLink.setAttribute('data-analyst', safeAnalyst);
setLink.textContent = 'Set';
setWrap.appendChild(setLink);
try {
setWrap.appendChild(setSpinner);
}
catch (e) { }
try {
setWrap.appendChild(setBadge);
}
catch (e) { }
tdAction.appendChild(setWrap);
const tdDisconnect = document.createElement('td');
tdDisconnect.className = 'tf-col-disconnect';
let isignalId = '';
try {
isignalId = (typeof tf_isignalUsers_getIsignalIdByName === 'function') ? String(tf_isignalUsers_getIsignalIdByName(safeAnalyst) || '') : '';
}
catch (e) {
isignalId = '';
}
if (!isignalId) {
tdDisconnect.innerHTML = `<span class="tf-users-disconnect-x">X</span>`;
}
else {
tdDisconnect.innerHTML = `<a href="#" class="tf-link tf-users-detail-disconnect-link" data-platform-id="${escapeHtml(String(platformId))}" data-analyst="${escapeHtml(safeAnalyst)}" data-isignal-id="${escapeHtml(String(isignalId))}">Disconnect</a>`;
}
tr.appendChild(tdAction);
tr.appendChild(tdDisconnect);
tr.appendChild(tdAnalyst);
tr.appendChild(tdPair);
tr.appendChild(tdLot);
tr.appendChild(tdRisk);
tbody.appendChild(tr);
};
leftEntries.forEach((entry) => appendRow(entry, tbodyLeft));
rightEntries.forEach((entry) => appendRow(entry, tbodyRight));
}
function tf_isignalUsers_renderUsersTable(platformIds, cfg, analystEntries, defaultBalance, defaultRisk) {
const table = document.getElementById('tf-users-mgmt-table');
if (!table)
return;
const tbody = table.querySelector('tbody');
if (!tbody)
return;
tbody.innerHTML = '';
(platformIds || []).forEach((pid) => {
const user = (cfg.users && cfg.users[pid]) ? cfg.users[pid] : {};
const tr = document.createElement('tr');
tr.setAttribute('data-platform-id', pid);
const tdAction = document.createElement('td');
tdAction.className = 'tf-col-action';
tdAction.innerHTML = `<a href="#" class="tf-link tf-users-set-link" data-platform-id="${escapeHtml(String(pid))}">Set ALL</a>`;
const tdId = document.createElement('td');
tdId.innerHTML = `<span class="tf-users-mono">${escapeHtml(String(pid))}</span>`;
const tdPass = document.createElement('td');
const passWrap = document.createElement('div');
passWrap.className = 'tf-pass-wrap';
const passInp = document.createElement('input');
passInp.type = 'password';
passInp.className = 'form-input tf-users-pass-input';
passInp.setAttribute('data-platform-id', pid);
passInp.placeholder = 'Password';
passInp.value = (user && typeof user.password === 'string') ? user.password : '';
const eyeBtn = document.createElement('button');
eyeBtn.type = 'button';
eyeBtn.className = 'tf-pass-eye';
eyeBtn.setAttribute('aria-label', 'Show/hide password');
eyeBtn.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
<g class="tf-eye-open">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
<circle cx="12" cy="12" r="3"/>
</g>
<g class="tf-eye-closed">
<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/>
<circle cx="12" cy="12" r="3"/>
<line x1="4" y1="4" x2="20" y2="20"/>
</g>
</svg>`;
passWrap.appendChild(passInp);
passWrap.appendChild(eyeBtn);
tdPass.appendChild(passWrap);
const tdBal = document.createElement('td');
const balInp = document.createElement('input');
balInp.type = 'number';
balInp.step = '0.01';
balInp.min = '0';
balInp.className = 'form-input tf-users-balance-input';
const bal = tf_safeNumber(user.balance);
balInp.value = (bal != null && bal > 0) ? String(bal) : '';
balInp.placeholder = 'Balance';
tdBal.appendChild(balInp);
const tdRisk = document.createElement('td');
const riskInp = document.createElement('input');
riskInp.type = 'number';
riskInp.step = '0.01';
riskInp.min = '0';
riskInp.className = 'form-input tf-users-risk-input';
const r = tf_safeNumber(user.risk);
riskInp.value = String((r != null && r > 0) ? r : defaultRisk);
tdRisk.appendChild(riskInp);
const tdDetail = document.createElement('td');
tdDetail.innerHTML = `<a href="#" class="tf-link tf-users-detail-link">Detail</a>`;
tr.appendChild(tdAction);
tr.appendChild(tdId);
tr.appendChild(tdPass);
tr.appendChild(tdBal);
tr.appendChild(tdRisk);
tr.appendChild(tdDetail);
tbody.appendChild(tr);
});
if (!tbody.__tfUsersMgmtBound) {
tbody.__tfUsersMgmtBound = true;
tbody.addEventListener('click', (ev) => {
const a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
if (!a)
return;
if (a.classList.contains('tf-users-analyst-link')) {
ev.preventDefault();
const name = a.getAttribute('data-analyst') || (a.textContent || '');
const url = a.getAttribute('data-isignal-url') || tf_isignalUsers_getIsignalUrlByName(name);
try {
if (chrome && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url, active: true });
}
else {
window.open(url, '_blank');
}
}
catch (e) {
try {
window.open(url, '_blank');
}
catch (x) { }
}
return;
}
if (a.classList.contains('tf-users-detail-link')) {
ev.preventDefault();
const row = a.closest('tr[data-platform-id]');
if (!row)
return;
const pid = row.getAttribute('data-platform-id') || '';
const next = row.nextElementSibling;
if (next && next.classList && next.classList.contains('tf-users-child-row')) {
next.remove();
return;
}
const child = tf_isignalUsers_buildChildRowHtml(pid);
row.insertAdjacentElement('afterend', child);
tf_isignalUsers_renderDetailTable(child, cfg, analystEntries, pid, defaultBalance, defaultRisk);
return;
}
});
tbody.addEventListener('input', (ev) => {
const tr = ev.target && ev.target.closest ? ev.target.closest('tr[data-platform-id]') : null;
const pid = tr ? tr.getAttribute('data-platform-id') : null;
if (!pid)
return;
cfg.users = cfg.users || {};
cfg.users[pid] = cfg.users[pid] || { password: '', balance: null, risk: null, analystRisk: {}, analystLot: {} };
const u = cfg.users[pid];
if (!u.analystRisk || typeof u.analystRisk !== 'object')
u.analystRisk = {};
if (!u.analystLot || typeof u.analystLot !== 'object')
u.analystLot = {};
const target = ev.target;
if (target.classList.contains('tf-users-pass-input')) {
u.password = String(target.value || '');
}
else if (target.classList.contains('tf-users-balance-input')) {
const n = tf_safeNumber(target.value);
u.balance = (n != null && n > 0) ? n : null;
}
else if (target.classList.contains('tf-users-risk-input')) {
const n = tf_safeNumber(target.value);
u.risk = (n != null && n > 0) ? n : null;
}
else if (target.classList.contains('tf-users-detail-lot-input')) {
const key = (target.dataset && target.dataset.entryKey)
? String(target.dataset.entryKey)
: (target.closest('tr') && target.closest('tr').dataset ? String(target.closest('tr').dataset.entryKey || '') : '');
const n = tf_safeNumber(target.value);
const defaultLot = tf_safeNumber(target.dataset ? target.dataset.defaultLot : null);
if (key) {
if (n != null && n > 0) {
if (defaultLot != null && Math.abs(n - defaultLot) < 0.0000001) {
delete u.analystLot[key];
target.dataset.customLot = '0';
target.title = 'Lot Size default dari perhitungan. Ubah angka untuk memakai Lot Size custom.';
}
else {
u.analystLot[key] = n;
target.dataset.customLot = '1';
target.title = 'Lot Size custom untuk baris ini. Kosongkan untuk kembali ke hasil perhitungan default.';
}
}
else {
delete u.analystLot[key];
target.dataset.customLot = '0';
target.title = 'Lot Size default dari perhitungan. Ubah angka untuk memakai Lot Size custom.';
}
}
}
else if (target.classList.contains('tf-users-detail-risk-input')) {
const key = (target.dataset && target.dataset.entryKey)
? String(target.dataset.entryKey)
: (target.closest('tr') && target.closest('tr').dataset ? String(target.closest('tr').dataset.entryKey || '') : '');
u.analystRisk = (u.analystRisk && typeof u.analystRisk === 'object') ? u.analystRisk : {};
const n = tf_safeNumber(target.value);
if (key) {
if (n != null && n > 0) {
u.analystRisk[key] = n;
target.title = 'Risk %/Trade ini custom untuk baris ini (Metatrader ID ini).';
}
else {
delete u.analystRisk[key];
target.title = 'Risk %/Trade default (mengikuti main row). Ubah angka untuk custom baris ini.';
}
}
const rowEl = target.closest('tr');
const lotInput = rowEl ? rowEl.querySelector('.tf-users-detail-lot-input') : null;
if (rowEl && lotInput) {
const sl = tf_safeNumber(rowEl.dataset ? rowEl.dataset.sl : null);
const dpp = tf_safeNumber(rowEl.dataset ? rowEl.dataset.dpp : null);
const bal = tf_safeNumber(u.balance);
const balanceNow = (bal != null && bal > 0) ? bal : null;
const accRisk = tf_safeNumber(u.risk);
const accountRiskNow = (accRisk != null && accRisk > 0) ? accRisk : defaultRisk;
const riskNow = (n != null && n > 0) ? n : accountRiskNow;
let defaultLot = null;
if (balanceNow != null && sl && dpp) {
const rawLot = computeLot(balanceNow, riskNow, sl, dpp);
const lot = roundLotToTwoDecimals(rawLot);
if (tf_isFiniteNumber(lot) && lot > 0)
defaultLot = lot;
}
lotInput.dataset.defaultLot = defaultLot != null ? String(defaultLot) : '';
lotInput.placeholder = defaultLot != null ? String(defaultLot) : '—';
if (lotInput.dataset.customLot !== '1') {
lotInput.value = defaultLot != null ? String(defaultLot) : '';
}
}
}
cfg.updatedAt = Date.now();
tf_isignalUsers_scheduleSave(cfg);
if (target.classList.contains('tf-users-balance-input') || target.classList.contains('tf-users-risk-input')) {
const child = tr.nextElementSibling && tr.nextElementSibling.classList.contains('tf-users-child-row') ? tr.nextElementSibling : null;
if (child) {
tf_isignalUsers_renderDetailTable(child, cfg, analystEntries, pid, defaultBalance, defaultRisk);
}
}
});
tbody.addEventListener('change', (ev) => {
const target = ev.target;
if (!target || !target.classList || !target.classList.contains('tf-users-detail-lot-input'))
return;
const tr = target.closest ? target.closest('tr[data-platform-id]') : null;
const pid = tr ? tr.getAttribute('data-platform-id') : null;
if (!pid)
return;
const n = tf_safeNumber(target.value);
if (n != null && n > 0)
return;
cfg.users = cfg.users || {};
cfg.users[pid] = cfg.users[pid] || { password: '', balance: null, risk: null, analystRisk: {}, analystLot: {} };
const u = cfg.users[pid];
if (!u.analystLot || typeof u.analystLot !== 'object')
u.analystLot = {};
const key = target.dataset ? String(target.dataset.entryKey || '') : '';
if (key)
delete u.analystLot[key];
const defaultLot = tf_safeNumber(target.dataset ? target.dataset.defaultLot : null);
target.value = (defaultLot != null && defaultLot > 0) ? String(defaultLot) : '';
target.dataset.customLot = '0';
target.title = 'Lot Size default dari perhitungan. Ubah angka untuk memakai Lot Size custom.';
cfg.updatedAt = Date.now();
tf_isignalUsers_scheduleSave(cfg);
});
}
}
function tf_isignalUsers_showSetOverlay() {
try {
const sec = document.getElementById('section-set-progress');
if (sec && typeof sec.scrollIntoView === 'function') {
}
}
catch (e) { }
}
function tf_isignalUsers_hideSetOverlay() {
}
function tf_isignalUsers_showOkModal(title, message, buttonLabel, onAction) {
const modal = document.getElementById('tf-iset-ok-modal');
if (!modal)
return;
if (typeof buttonLabel === 'function') {
onAction = buttonLabel;
buttonLabel = null;
}
const t = modal.querySelector('#tf-iset-ok-title') ||
modal.querySelector('.tf-iset-ok-title');
const msgEl = modal.querySelector('#tf-iset-ok-msg') ||
modal.querySelector('.tf-iset-ok-msg') ||
modal.querySelector('#tf-iset-ok-message') ||
modal.querySelector('.tf-iset-ok-message');
const btn = modal.querySelector('#tf-iset-ok-btn') ||
modal.querySelector('.tf-iset-ok-btn');
if (t)
t.textContent = title || 'Info';
if (msgEl)
msgEl.textContent = message || '';
const label = (typeof buttonLabel === 'string' && buttonLabel.trim()) ? buttonLabel.trim() : 'OK';
if (btn)
btn.textContent = label;
window.__tf_iset_ok_action = (typeof onAction === 'function') ? onAction : null;
modal.style.display = 'flex';
document.body.classList.add('tf-modal-open');
}
function tf_isignalUsers_showConnectModal(title, message, onConnect, onNo, yesLabel, noLabel) {
const modal = document.getElementById('tf-iset-connect-modal');
if (!modal)
return;
try {
tf_isignalUsers_hideOkModal();
}
catch (e) { }
const t = modal.querySelector('#tf-iset-connect-title') ||
modal.querySelector('.tf-iset-connect-title') ||
modal.querySelector('.tf-iset-ok-title');
const msgEl = modal.querySelector('#tf-iset-connect-msg') ||
modal.querySelector('.tf-iset-connect-msg') ||
modal.querySelector('.tf-iset-ok-msg');
if (t)
t.textContent = (title && String(title).trim()) ? String(title).trim() : 'Sambungkan akun MetaTrader baru';
if (msgEl) {
const m = (message == null) ? '' : String(message);
const looksLikeHtml = /<\s*span\b|<\s*br\b|<\s*\/[a-z]/i.test(m);
if (looksLikeHtml) {
msgEl.innerHTML = m;
}
else {
msgEl.textContent = m;
}
}
try {
const btnNo = modal.querySelector('#tf-iset-connect-no');
const btnYes = modal.querySelector('#tf-iset-connect-yes');
if (btnNo)
btnNo.textContent = (typeof noLabel === 'string' && noLabel.trim()) ? noLabel.trim() : 'No';
if (btnYes)
btnYes.textContent = (typeof yesLabel === 'string' && yesLabel.trim()) ? yesLabel.trim() : 'Sambungkan';
}
catch (e) { }
window.__tf_iset_connect_action = (typeof onConnect === 'function') ? onConnect : null;
window.__tf_iset_connect_no_action = (typeof onNo === 'function') ? onNo : null;
modal.style.display = 'flex';
document.body.classList.add('tf-modal-open');
}
function tf_isignalUsers_hideConnectModal() {
const modal = document.getElementById('tf-iset-connect-modal');
if (!modal)
return;
modal.style.display = 'none';
try {
const btnNo = modal.querySelector('#tf-iset-connect-no');
const btnYes = modal.querySelector('#tf-iset-connect-yes');
if (btnNo)
btnNo.textContent = 'No';
if (btnYes)
btnYes.textContent = 'Sambungkan';
}
catch (e) { }
document.body.classList.remove('tf-modal-open');
window.__tf_iset_connect_action = null;
window.__tf_iset_connect_no_action = null;
}
function tf_isignalUsers_hideOkModal() {
const modal = document.getElementById('tf-iset-ok-modal');
if (!modal)
return;
modal.style.display = 'none';
document.body.classList.remove('tf-modal-open');
const btn = modal.querySelector('#tf-iset-ok-btn') ||
modal.querySelector('.tf-iset-ok-btn');
if (btn)
btn.textContent = 'OK';
window.__tf_iset_ok_action = null;
}
function tf_isignalUsers_bindSetLinks() {
if (window.__tf_isusers_setLinksBound)
return;
window.__tf_isusers_setLinksBound = true;
if (window.__tfIsUsersSetLinksBound)
return;
window.__tfIsUsersSetLinksBound = true;
function setStopUI(a, label) {
if (!a)
return;
if (!a.dataset.tfOrigText)
a.dataset.tfOrigText = a.textContent || '';
a.textContent = (label != null ? String(label) : 'Stop!');
a.classList.add('tf-isusers-stop-link');
a.setAttribute('aria-busy', 'true');
}
function restoreUI(a) {
if (!a)
return;
const t = a.dataset.tfOrigText;
if (typeof t === 'string')
a.textContent = t;
a.classList.remove('tf-isusers-stop-link');
a.removeAttribute('aria-busy');
delete a.dataset.tfOrigText;
delete a.dataset.tfJobToken;
}
function restoreAllByToken(tok) {
if (!tok)
return;
try {
const t = String(tok);
const nodes = document.querySelectorAll(`.tf-isusers-stop-link[data-tf-job-token="${t}"]`);
if (nodes && nodes.length) {
nodes.forEach((n) => restoreUI(n));
}
}
catch (e) {
}
}
function tf_isignalUsers_lockInteractions(lockToken, keepNodes) {
try {
const tok = String(lockToken || '');
const keep = new Set((keepNodes || []).filter(Boolean));
const nodes = Array.from(document.querySelectorAll('.tf-users-set-link, .tf-users-detail-set-link, .tf-users-detail-disconnect-link'));
nodes.forEach((n) => {
if (!n)
return;
if (keep.has(n))
return;
if (n.classList.contains('tf-isusers-stop-link'))
return;
n.classList.add('tf-users-link-disabled');
try {
n.setAttribute('data-tf-lock-token', tok);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_isignalUsers_unlockInteractions(lockToken) {
try {
const tok = String(lockToken || '');
if (!tok)
return;
const nodes = Array.from(document.querySelectorAll(`.tf-users-link-disabled[data-tf-lock-token="${tok}"]`));
nodes.forEach((n) => {
if (!n)
return;
n.classList.remove('tf-users-link-disabled');
try {
n.removeAttribute('data-tf-lock-token');
}
catch (e) { }
});
}
catch (e) { }
}
function getDetailSetLinks(pid, analyst) {
try {
const p = String(pid || '').trim();
const a = String(analyst || '').trim();
if (!p || !a)
return [];
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(p) : p;
const escA = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(a) : a;
return Array.from(document.querySelectorAll(`.tf-users-detail-set-link[data-platform-id="${escPid}"][data-analyst="${escA}"]`));
}
catch (e) {
return [];
}
}
document.addEventListener('click', (e) => {
const a = e.target.closest('.tf-users-detail-disconnect-link') ||
e.target.closest('.tf-users-set-link') ||
e.target.closest('.tf-users-detail-set-link');
if (!a)
return;
e.preventDefault();
const pid = (a.getAttribute('data-platform-id') || '').trim();
if (!pid)
return;
if (a.classList.contains('tf-users-detail-disconnect-link')) {
if (a.classList.contains('tf-users-link-disabled'))
return;
const analyst = (a.getAttribute('data-analyst') || '').trim();
const isId = (a.getAttribute('data-isignal-id') || '').trim();
if (!analyst || !isId)
return;
try {
const cfgNow = window.__tf_isignalUsersMgmtCfg || null;
const passNow = tf_isignalUsers_getPasswordForPid(pid, cfgNow);
if (!passNow) {
tf_isignalUsers_showOkModal('Password belum diisi', `Silakan isi password di main row Metatrader ID (${pid}), lalu klik Disconnect lagi.`);
return;
}
}
catch (e) { }
const startDisconnectJob = () => {
const tokDisc = tf_isignalUsers_createJobToken('disconnect');
a.dataset.tfJobToken = tokDisc;
setStopUI(a, 'Stop!!');
try {
tf_isignalUsers_lockInteractions(tokDisc, [a]);
}
catch (e) { }
(async () => {
try {
if (tf_isignalUsers_isDisconnectJobCancelled(tokDisc))
return;
await tf_isignalUsers_startDisconnectFlowForAnalyst(pid, analyst, tokDisc);
}
catch (err) {
console.warn('[Fix205] Disconnect flow error:', err);
}
finally {
try {
tf_isignalUsers_clearDisconnectJob(tokDisc);
}
catch (e) { }
restoreAllByToken(tokDisc);
try {
tf_isignalUsers_unlockInteractions(tokDisc);
}
catch (e) { }
}
})();
};
try {
const safeName = escapeHtml(analyst);
tf_isignalUsers_showConnectModal('Konfirmasi Disconnect', `Apakah yakin ingin Disconnect akun untuk <b>${safeName}</b>?`, () => { try {
startDisconnectJob();
}
catch (e) { } }, () => { }, 'Yes', 'No');
}
catch (e) {
try {
if (confirm(`Disconnect akun untuk ${analyst}?`))
startDisconnectJob();
}
catch (e2) { }
}
return;
}
if (a.classList.contains('tf-isusers-stop-link') && a.dataset.tfJobToken) {
const tok = a.dataset.tfJobToken;
try {
if (String(tok).startsWith('disconnect_')) {
tf_isignalUsers_cancelDisconnectJob(tok);
}
else {
tf_isignalUsers_cancelSetJob(tok);
}
}
catch (e) { }
restoreAllByToken(tok);
try {
tf_isignalUsers_unlockInteractions(tok);
}
catch (e) { }
return;
}
const tok = tf_isignalUsers_createJobToken('set');
const isDetail = a.classList.contains('tf-users-detail-set-link');
const analystName = isDetail ? ((a.getAttribute('data-analyst') || '').trim()) : '';
const groupLinks = (isDetail && analystName) ? getDetailSetLinks(pid, analystName) : [a];
groupLinks.forEach((el) => {
try {
el.dataset.tfJobToken = tok;
}
catch (e) { }
setStopUI(el);
});
try {
tf_isignalUsers_lockInteractions(tok, groupLinks);
}
catch (e) { }
tf_isignalUsers_clearSetJob(tok);
(async () => {
try {
if (a.classList.contains('tf-users-set-link')) {
await tf_isignalUsers_startSetFlowForPlatform(pid, tok);
}
else if (a.classList.contains('tf-users-detail-set-link')) {
const analyst = (a.getAttribute('data-analyst') || '').trim();
if (!analyst)
return;
try {
const cfgNow = window.__tf_isignalUsersMgmtCfg || null;
const cdNow = (cfgNow && cfgNow.usersSetCooldown && cfgNow.usersSetCooldown[pid] && cfgNow.usersSetCooldown[pid][analyst])
? cfgNow.usersSetCooldown[pid][analyst]
: null;
const untilNow = cdNow && cdNow.until ? Number(cdNow.until) : null;
if (Number.isFinite(untilNow) && untilNow > Date.now()) {
try {
tf_isignalUsers_refreshSetCountdownUI(pid, analyst, cfgNow);
}
catch (e) { }
return;
}
}
catch (e) { }
await tf_isignalUsers_startSetFlowForAnalyst(pid, analyst, tok, false);
}
}
catch (err) {
console.warn('[Fix205] Set flow error:', err);
}
finally {
restoreAllByToken(tok);
try {
tf_isignalUsers_unlockInteractions(tok);
}
catch (e) { }
tf_isignalUsers_clearSetJob(tok);
}
})();
}, true);
}
function tf_isignalUsers_bindSetOverlayButtons() {
const root = document;
const btnClear = root.getElementById('tf-iset-progress-clear');
const btnOk = root.getElementById('tf-iset-ok-btn');
const btnConnNo = root.getElementById('tf-iset-connect-no');
const btnConnYes = root.getElementById('tf-iset-connect-yes');
if (!btnClear && !btnOk && !btnConnNo && !btnConnYes)
return;
if (btnClear && btnClear.dataset && btnClear.dataset.tfBoundClear !== '1') {
btnClear.dataset.tfBoundClear = '1';
btnClear.addEventListener('click', () => {
try {
const tbody = root.getElementById('tf-iset-progress-tbody');
if (tbody)
tbody.innerHTML = '';
const status = root.getElementById('tf-iset-progress-status');
if (status)
status.textContent = 'Idle.';
}
catch (e) { }
});
}
if (btnOk && btnOk.dataset && btnOk.dataset.tfBoundOk !== '1') {
btnOk.dataset.tfBoundOk = '1';
btnOk.addEventListener('click', () => {
const action = window.__tf_iset_ok_action;
tf_isignalUsers_hideOkModal();
if (typeof action === 'function') {
try {
action();
}
catch (e) { }
}
});
}
if (btnConnNo && btnConnNo.dataset && btnConnNo.dataset.tfBoundConnNo !== '1') {
btnConnNo.dataset.tfBoundConnNo = '1';
btnConnNo.addEventListener('click', () => {
const noAction = window.__tf_iset_connect_no_action;
tf_isignalUsers_hideConnectModal();
if (typeof noAction === 'function') {
try {
noAction();
}
catch (e) { }
}
});
}
if (btnConnYes && btnConnYes.dataset && btnConnYes.dataset.tfBoundConnYes !== '1') {
btnConnYes.dataset.tfBoundConnYes = '1';
btnConnYes.addEventListener('click', () => {
const action = window.__tf_iset_connect_action;
tf_isignalUsers_hideConnectModal();
if (typeof action === 'function') {
try {
action();
}
catch (e) { }
}
});
}
try {
const modal = root.getElementById('tf-iset-ok-modal');
if (modal && !modal.dataset.tfBoundBackdrop) {
modal.dataset.tfBoundBackdrop = '1';
modal.addEventListener('click', (ev) => {
if (ev.target === modal)
tf_isignalUsers_hideOkModal();
});
root.addEventListener('keydown', (ev) => {
if (ev.key === 'Escape')
tf_isignalUsers_hideOkModal();
});
}
}
catch (e) { }
try {
const modal2 = root.getElementById('tf-iset-connect-modal');
if (modal2 && !modal2.dataset.tfBoundBackdrop) {
modal2.dataset.tfBoundBackdrop = '1';
modal2.addEventListener('click', (ev) => {
if (ev.target === modal2) {
const noAction = window.__tf_iset_connect_no_action;
tf_isignalUsers_hideConnectModal();
if (typeof noAction === 'function') {
try {
noAction();
}
catch (e) { }
}
}
});
root.addEventListener('keydown', (ev) => {
if (ev.key === 'Escape') {
const noAction = window.__tf_iset_connect_no_action;
tf_isignalUsers_hideConnectModal();
if (typeof noAction === 'function') {
try {
noAction();
}
catch (e) { }
}
}
});
}
}
catch (e) { }
}
function tf_isignalUsers_overlayAddLine(textLine) {
try {
const tbody = document.getElementById('tf-iset-progress-tbody');
if (!tbody)
return;
const tr = document.createElement('tr');
const tdTime = document.createElement('td');
tdTime.className = 'tf-iset-col-time';
const now = new Date();
const hh = String(now.getHours()).padStart(2, '0');
const mm = String(now.getMinutes()).padStart(2, '0');
const ss = String(now.getSeconds()).padStart(2, '0');
tdTime.textContent = `${hh}:${mm}:${ss}`;
const tdLog = document.createElement('td');
tdLog.className = 'tf-iset-col-log';
tdLog.textContent = String(textLine || '');
tr.appendChild(tdTime);
tr.appendChild(tdLog);
tbody.appendChild(tr);
const scroll = document.getElementById('tf-iset-progress-scroll');
if (scroll)
scroll.scrollTop = scroll.scrollHeight;
}
catch (e) { }
}
function tf_isignalUsers_overlaySetStatus(textLine) {
try {
const el = document.getElementById('tf-iset-progress-status');
if (!el)
return;
el.textContent = String(textLine || '');
}
catch (e) { }
}
function tf_isignalUsers_refreshSetBadges(platformId, analystName) {
try {
const pid = String(platformId || '');
const aName = String(analystName || '');
const badgeSel = `.tf-users-set-badge[data-platform-id="${CSS.escape(pid)}"][data-analyst="${CSS.escape(aName)}"]`;
const spinSel = `.tf-users-set-spinner[data-platform-id="${CSS.escape(pid)}"][data-analyst="${CSS.escape(aName)}"]`;
const badges = document.querySelectorAll(badgeSel);
const spins = document.querySelectorAll(spinSel);
if (!badges.length)
return;
const cfg = window.__tf_isignalUsersMgmtCfg || null;
badges.forEach((b, i) => {
const s = spins && spins[i] ? spins[i] : null;
tf_isignalUsers_applySetBadge(b, s, cfg, pid, aName);
});
}
catch (e) { }
}
async function tf_isignalUsers_loadMgmtCfg() {
try {
const stored = await tf_storageLocalGet([TF_ISIGNAL_USERS_MGMT_KEY]);
const cfg = stored && stored[TF_ISIGNAL_USERS_MGMT_KEY] ? stored[TF_ISIGNAL_USERS_MGMT_KEY] : null;
return cfg && typeof cfg === 'object' ? cfg : {};
}
catch (e) {
return {};
}
}
async function tf_isignalUsers_saveMgmtCfg(cfg) {
try {
await tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: (cfg && typeof cfg === 'object') ? cfg : {} });
}
catch (e) { }
}
function tf_isignalUsers_getDomNumberForPid(pid, inputClass) {
try {
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const inp = document.querySelector(`input.${inputClass}[data-platform-id="${escPid}"]`) ||
document.querySelector(`tr[data-platform-id="${escPid}"] input.${inputClass}`) ||
document.querySelector(`input.${inputClass}[data-platform-id="${pid}"]`) ||
document.querySelector(`tr[data-platform-id="${pid}"] input.${inputClass}`);
if (inp && typeof inp.value !== 'undefined') {
const n = (typeof tf_safeNumber === 'function') ? tf_safeNumber(inp.value) : Number(inp.value);
return (n != null && Number.isFinite(n) && n > 0) ? n : null;
}
}
catch (e) { }
return null;
}
function tf_isignalUsers_getBalanceForPid(pid, cfg) {
const domBal = tf_isignalUsers_getDomNumberForPid(pid, 'tf-users-balance-input');
if (domBal != null)
return domBal;
const n = (cfg && cfg.users && cfg.users[pid]) ? ((typeof tf_safeNumber === 'function') ? tf_safeNumber(cfg.users[pid].balance) : Number(cfg.users[pid].balance)) : null;
return (n != null && Number.isFinite(n) && n > 0) ? n : null;
}
function tf_isignalUsers_getRiskForPid(pid, cfg, fallbackRisk = 1) {
const domRisk = tf_isignalUsers_getDomNumberForPid(pid, 'tf-users-risk-input');
if (domRisk != null)
return domRisk;
const n = (cfg && cfg.users && cfg.users[pid]) ? ((typeof tf_safeNumber === 'function') ? tf_safeNumber(cfg.users[pid].risk) : Number(cfg.users[pid].risk)) : null;
if (n != null && Number.isFinite(n) && n > 0)
return n;
const fb = (typeof tf_safeNumber === 'function') ? tf_safeNumber(fallbackRisk) : Number(fallbackRisk);
return (fb != null && Number.isFinite(fb) && fb > 0) ? fb : 1;
}
function tf_isignalUsers_getAnalystRiskMapForPid(pid, cfg) {
const out = {};
try {
const base = (cfg && cfg.users && cfg.users[pid] && cfg.users[pid].analystRisk && typeof cfg.users[pid].analystRisk === 'object')
? cfg.users[pid].analystRisk
: {};
for (const [k, v] of Object.entries(base))
out[k] = v;
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const detailScope = document.querySelector(`tr[data-platform-id="${escPid}"] + tr.tf-users-child-row`) ||
document.querySelector(`tr[data-platform-id="${pid}"] + tr.tf-users-child-row`);
if (detailScope) {
const inputs = detailScope.querySelectorAll('input.tf-users-detail-risk-input[data-entry-key]');
inputs.forEach(inp => {
const key = String(inp.dataset.entryKey || '').trim();
if (!key)
return;
const n = (typeof tf_safeNumber === 'function') ? tf_safeNumber(inp.value) : Number(inp.value);
if (n != null && Number.isFinite(n) && n > 0)
out[key] = n;
else
delete out[key];
});
}
}
catch (e) { }
return out;
}
function tf_isignalUsers_getAnalystLotMapForPid(pid, cfg) {
const out = {};
try {
const base = (cfg && cfg.users && cfg.users[pid] && cfg.users[pid].analystLot && typeof cfg.users[pid].analystLot === 'object')
? cfg.users[pid].analystLot
: {};
for (const [k, v] of Object.entries(base))
out[k] = v;
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const detailScope = document.querySelector(`tr[data-platform-id="${escPid}"] + tr.tf-users-child-row`) ||
document.querySelector(`tr[data-platform-id="${pid}"] + tr.tf-users-child-row`);
if (detailScope) {
const inputs = detailScope.querySelectorAll('input.tf-users-detail-lot-input[data-entry-key]');
inputs.forEach(inp => {
const key = String(inp.dataset.entryKey || '').trim();
if (!key)
return;
const n = (typeof tf_safeNumber === 'function') ? tf_safeNumber(inp.value) : Number(inp.value);
const defaultLot = (typeof tf_safeNumber === 'function') ? tf_safeNumber(inp.dataset.defaultLot) : Number(inp.dataset.defaultLot);
const isCustom = inp.dataset.customLot === '1';
if (isCustom && n != null && Number.isFinite(n) && n > 0 && !(defaultLot != null && Math.abs(n - defaultLot) < 0.0000001)) {
out[key] = n;
}
else {
delete out[key];
}
});
}
}
catch (e) { }
return out;
}
function tf_isignalUsers_buildAnalystEntries(platformId, cfg) {
try {
const pid = String(platformId || '');
if (!pid)
return [];
const meta = (window.__tfIsUsersAnalystMetaCache && window.__tfIsUsersAnalystMetaCache.ok)
? window.__tfIsUsersAnalystMetaCache
: null;
const baseEntries = meta && Array.isArray(meta.entries) ? meta.entries : [];
const srcEntries = (Array.isArray(baseEntries) && baseEntries.length)
? baseEntries
: (Array.isArray(window.ANALYSTS)
? window.ANALYSTS.map(a => ({ baseName: a && a.baseName ? String(a.baseName) : '', pair: a && a.pair ? String(a.pair).toUpperCase() : '' }))
: []);
const balance = tf_isignalUsers_getBalanceForPid(pid, cfg);
const accountRisk = tf_isignalUsers_getRiskForPid(pid, cfg, 1);
const analystRiskMap = tf_isignalUsers_getAnalystRiskMapForPid(pid, cfg);
const analystLotMap = tf_isignalUsers_getAnalystLotMapForPid(pid, cfg);
const out = [];
for (const e of (srcEntries || [])) {
if (!e)
continue;
const baseName = String(e.baseName || '').trim();
const pair = String(e.pair || '').trim().toUpperCase();
if (!baseName || !pair)
continue;
const key = `${baseName}||${pair}`;
const overrideRisk = (typeof tf_safeNumber === 'function') ? tf_safeNumber(analystRiskMap[key]) : null;
const risk = (overrideRisk != null && overrideRisk > 0) ? overrideRisk : accountRisk;
const sl = (e.effectiveSlPips != null && Number.isFinite(e.effectiveSlPips) && e.effectiveSlPips > 0) ? e.effectiveSlPips : null;
const dpp = (e.dollarPerPip != null && Number.isFinite(e.dollarPerPip) && e.dollarPerPip > 0) ? e.dollarPerPip : null;
let defaultLotSize = null;
if (balance != null && sl && dpp && typeof computeLot === 'function') {
const rawLot = computeLot(balance, risk, sl, dpp);
const lot = (typeof roundLotToTwoDecimals === 'function') ? roundLotToTwoDecimals(rawLot) : rawLot;
if (Number.isFinite(lot) && lot > 0)
defaultLotSize = lot;
}
const overrideLot = (typeof tf_safeNumber === 'function') ? tf_safeNumber(analystLotMap[key]) : Number(analystLotMap[key]);
const lotSize = (overrideLot != null && Number.isFinite(overrideLot) && overrideLot > 0)
? overrideLot
: defaultLotSize;
if (lotSize == null)
continue;
out.push({ baseName, pair, lotSize });
}
return out;
}
catch (e) {
return [];
}
}
function tf_isignalUsers_getSetJobMap() {
if (!window.__tfIsUsersSetJobMap)
window.__tfIsUsersSetJobMap = {};
return window.__tfIsUsersSetJobMap;
}
function tf_isignalUsers_createJobToken(prefix = 'job') {
const r = Math.random().toString(16).slice(2);
return `${prefix}_${Date.now()}_${r}`;
}
function tf_isignalUsers_cancelSetJob(token) {
if (!token)
return;
const map = tf_isignalUsers_getSetJobMap();
if (!map[token])
map[token] = { cancelled: true };
map[token].cancelled = true;
try {
chrome.runtime.sendMessage({ type: 'tf_isignal_users_set_cancel', jobToken: String(token) });
}
catch (e) { }
}
function tf_isignalUsers_getDisconnectJobMap() {
if (!window.__tf_isusers_disconnectJobMap)
window.__tf_isusers_disconnectJobMap = {};
return window.__tf_isusers_disconnectJobMap;
}
function tf_isignalUsers_cancelDisconnectJob(token) {
if (!token)
return;
const map = tf_isignalUsers_getDisconnectJobMap();
if (!map[token])
map[token] = { cancelled: true };
map[token].cancelled = true;
try {
chrome.runtime.sendMessage({ type: 'tf_isignal_users_disconnect_cancel', jobToken: String(token) });
}
catch (e) { }
}
function tf_isignalUsers_isDisconnectJobCancelled(token) {
if (!token)
return false;
const map = tf_isignalUsers_getDisconnectJobMap();
return !!(map[token] && map[token].cancelled);
}
function tf_isignalUsers_clearDisconnectJob(token) {
if (!token)
return;
const map = tf_isignalUsers_getDisconnectJobMap();
try {
delete map[token];
}
catch (e) {
map[token] = null;
}
}
function tf_isignalUsers_isSetJobCancelled(token) {
if (!token)
return false;
const map = tf_isignalUsers_getSetJobMap();
return !!(map[token] && map[token].cancelled);
}
function tf_isignalUsers_clearSetJob(token) {
if (!token)
return;
const map = tf_isignalUsers_getSetJobMap();
try {
delete map[token];
}
catch (e) {
map[token] = null;
}
}
function tf_isignalUsers_collectPairsLotsForAnalyst(platformId, analystName, cfg) {
const entries = tf_isignalUsers_buildAnalystEntries(platformId, cfg) || [];
const map = {};
for (const e of entries) {
if (!e || String(e.baseName || '') !== String(analystName || ''))
continue;
const pair = String(e.pair || '').trim();
if (!pair)
continue;
const lot = (e.lotSize != null) ? String(e.lotSize) : '';
map[pair] = lot;
}
const out = [];
for (const [pair, lot] of Object.entries(map)) {
const v = (lot ?? '').toString().trim();
if (!v)
continue;
out.push({ pair, lot: v });
}
return out;
}
async function tf_isignalUsers_startSetFlowForAnalyst(platformId, analystName, jobToken = null, isBatch = false) {
const pid = String(platformId || '');
const aName = String(analystName || '');
if (!pid || !aName)
return;
if (tf_isignalUsers_isSetJobCancelled(jobToken))
return;
tf_isignalUsers_showSetOverlay();
tf_isignalUsers_overlaySetStatus(`Setting lot untuk ${aName}...`);
tf_isignalUsers_overlayAddLine(`[Mulai] ${aName}`);
const cfg = await tf_isignalUsers_loadMgmtCfg();
window.__tf_isignalUsersMgmtCfg = cfg;
if (!cfg.usersSetStatus || typeof cfg.usersSetStatus !== 'object')
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid] || typeof cfg.usersSetStatus[pid] !== 'object')
cfg.usersSetStatus[pid] = {};
try {
const isignalIdTmp = (typeof tf_isignalUsers_getIsignalIdByName === 'function')
? String(tf_isignalUsers_getIsignalIdByName(aName) || '').trim()
: '';
if (!isignalIdTmp) {
const reasonNF = 'Nama analis tidak ditemukan di tabel Analis di iSignal.';
if (isBatch) {
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: `Skip: ${reasonNF}`, updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - ${reasonNF}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (analis tidak ditemukan).');
}
catch (e) { }
return;
}
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: reasonNF, updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - ${reasonNF}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Fail: analis tidak ditemukan.');
}
catch (e) { }
try {
tf_isignalUsers_showOkModal('Nama analis tidak ditemukan', `${reasonNF}\n\nSilakan Refresh / Update daftar analis iSignal, lalu coba lagi.`);
}
catch (e) { }
return;
}
}
catch (e) { }
function tf_isignalUsers_getPasswordForPid(pid, cfg) {
let v = '';
try {
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const inp = document.querySelector(`input.tf-users-pass-input[data-platform-id="${escPid}"]`) ||
document.querySelector(`tr[data-platform-id="${escPid}"] input.tf-users-pass-input`) ||
document.querySelector(`input.tf-users-pass-input[data-platform-id="${pid}"]`) ||
document.querySelector(`tr[data-platform-id="${pid}"] input.tf-users-pass-input`);
if (inp && typeof inp.value === 'string') {
v = inp.value.trim();
}
}
catch (e) { }
v = (v || '').trim();
if (v)
return v;
v = (cfg && cfg.users && cfg.users[pid] && typeof cfg.users[pid].password === 'string')
? String(cfg.users[pid].password).trim()
: '';
return (v || '').trim();
}
const pass = tf_isignalUsers_getPasswordForPid(pid, cfg);
if (!cfg.users)
cfg.users = {};
if (!cfg.users[pid])
cfg.users[pid] = {};
cfg.users[pid].password = pass;
if (!pass) {
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Password kosong (isi di main row Metatrader ID)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Password kosong`);
tf_isignalUsers_overlaySetStatus('Fail: Password kosong');
tf_isignalUsers_showOkModal('Password belum diisi', `Silakan isi password di main row Metatrader ID (${pid}), lalu klik Set lagi.`);
return;
}
const balNow = tf_isignalUsers_getBalanceForPid(pid, cfg);
const riskNow = tf_isignalUsers_getRiskForPid(pid, cfg, 1);
if (!cfg.users)
cfg.users = {};
if (!cfg.users[pid])
cfg.users[pid] = {};
if (balNow != null)
cfg.users[pid].balance = balNow;
cfg.users[pid].risk = riskNow;
if (!balNow) {
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Balance kosong (isi di main row Metatrader ID)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Balance kosong`);
tf_isignalUsers_overlaySetStatus('Fail: Balance kosong');
tf_isignalUsers_showOkModal('Balance belum diisi', `Silakan isi Balance di main row Metatrader ID (${pid}), lalu klik Set lagi.`);
return;
}
const pairsLots = tf_isignalUsers_collectPairsLotsForAnalyst(pid, aName, cfg);
if (!pairsLots || (Array.isArray(pairsLots) ? pairsLots.length === 0 : Object.keys(pairsLots).length === 0)) {
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Tidak ada pair yang dipilih / tidak ada Lot Size', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
tf_isignalUsers_overlayAddLine(`[Gagal] ${aName} - Tidak ada pair`);
tf_isignalUsers_overlaySetStatus('Gagal: Tidak ada pair');
return;
}
cfg.usersSetStatus[pid][aName] = { status: 'running', reason: 'Sedang proses...', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
let resp = null;
let __pwdNotFoundRetry = 0;
while (true) {
if (tf_isignalUsers_isSetJobCancelled(jobToken)) {
resp = { ok: false, code: 'CANCELLED', reason: 'Job cancelled' };
break;
}
resp = await chrome.runtime.sendMessage({
type: 'tf_isignal_users_set_apply',
jobToken: jobToken ? String(jobToken) : '',
platformId: pid,
mtId: pid,
analystName: aName,
analystUrl: tf_isignalUsers_getIsignalUrlByName(aName) || '',
pairsLots,
password: pass
});
const __okTmp = !!(resp && resp.ok);
const __codeTmp = resp && resp.code ? String(resp.code) : '';
if (!__okTmp && __codeTmp === 'PASSWORD_PAGE_NOT_FOUND') {
__pwdNotFoundRetry++;
try {
tf_isignalUsers_overlayAddLine(`[RETRY] ${aName} - Password page not found (${__pwdNotFoundRetry})`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus(`Retry ${__pwdNotFoundRetry}: Password page not found...`);
}
catch (e) { }
await new Promise((r) => setTimeout(r, 900));
continue;
}
break;
}
const ok = resp && resp.ok;
const code = resp && resp.code ? String(resp.code) : '';
const reason = resp && resp.reason ? String(resp.reason) : (ok ? 'OK' : 'Gagal');
if (tf_isignalUsers_isSetJobCancelled(jobToken) || code === 'CANCELLED') {
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Cancelled', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
tf_isignalUsers_overlayAddLine(`[CANCEL] ${aName} - Cancelled`);
tf_isignalUsers_overlaySetStatus('Cancelled.');
return;
}
if (!ok && code === 'PASSWORD_INVALID') {
const msg = `Tidak dapat menyambungkan ke MT4 atau salah password.
Silakan perbaiki password di kolom Password (main row Metatrader ID), lalu klik Try Again.`;
tf_isignalUsers_showOkModal('Password salah', msg, 'Try Again!', () => {
try {
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const inp = document.querySelector(`input.tf-users-pass-input[data-platform-id="${escPid}"]`) ||
document.querySelector(`tr[data-platform-id="${escPid}"] input.tf-users-pass-input`) ||
document.querySelector(`input.tf-users-pass-input[data-platform-id="${pid}"]`) ||
document.querySelector(`tr[data-platform-id="${pid}"] input.tf-users-pass-input`);
if (inp) {
try {
inp.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
catch (e) {
try {
inp.scrollIntoView(true);
}
catch (e2) { }
}
try {
inp.focus();
}
catch (e) { }
try {
inp.select();
}
catch (e) { }
const prev = inp.style.boxShadow;
inp.style.boxShadow = '0 0 0 2px rgba(248, 113, 113, 0.9), 0 0 0 6px rgba(248, 113, 113, 0.18)';
setTimeout(() => {
try {
inp.style.boxShadow = prev || '';
}
catch (e) { }
}, 1600);
}
}
catch (e) { }
});
}
if (!ok && code === 'ACCOUNT_DISCONNECT') {
if (isBatch) {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: Akun Disconnect', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - Akun Disconnect`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (Akun Disconnect).');
}
catch (e) { }
return;
}
const title = 'Akun Disconnect';
const msg = 'Akun Disconnect, Tolong Sambungkan kembali...';
try {
if (cfg.usersSetStatus && cfg.usersSetStatus[pid] && cfg.usersSetStatus[pid][aName]) {
delete cfg.usersSetStatus[pid][aName];
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
}
else {
window.__tf_isignalUsersMgmtCfg = cfg;
}
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[DISCONNECT] ${aName} - Akun Disconnect`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Akun Disconnect (butuh reconnect).');
}
catch (e) { }
const runReconnect = async () => {
try {
const url = tf_isignalUsers_getIsignalUrlByName(aName) || TF_ISIGNAL_CHANNELS_URL;
try {
tf_isignalUsers_overlayAddLine(`[RECONNECT] Membuka halaman ${aName}...`);
}
catch (e) { }
const res2 = await chrome.runtime.sendMessage({
type: 'tf_open_isignal_reconnect_and_set',
url,
activate: true,
mtId: pid,
pairsLots,
password: pass
});
const ok2 = !!(res2 && res2.ok);
const reason2 = ok2
? (res2 && res2.reason ? String(res2.reason) : 'Akun MetaTrader berhasil disambungkan kembali')
: (res2 && (res2.error || res2.reason || res2.code) ? String(res2.error || res2.reason || res2.code) : 'Gagal reconnect');
if (ok2) {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'ok', reason: 'Akun berhasil disambungkan kembali', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[OK] ${aName} - ${reason2}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Reconnect sukses.');
}
catch (e) { }
}
else {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: reason2, updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - ${reason2}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Reconnect gagal.');
}
catch (e) { }
try {
tf_isignalUsers_showOkModal('Reconnect gagal', reason2 || 'Gagal reconnect');
}
catch (e) { }
}
}
catch (e) {
const err = String(e && e.message ? e.message : e);
try {
tf_isignalUsers_showOkModal('Reconnect gagal', err);
}
catch (x) { }
}
};
if (isBatch) {
await new Promise((resolve) => {
const onYes = async () => { try {
await runReconnect();
}
catch (e) { } resolve(true); };
const onNo = async () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: user pilih No (Akun Disconnect)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (Akun Disconnect)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
resolve(false);
};
tf_isignalUsers_showConnectModal(title, msg, onYes, onNo, 'Sambungkan Kembali...', 'No');
});
}
else {
tf_isignalUsers_showConnectModal(title, msg, () => { void runReconnect(); }, () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'User pilih No (Akun Disconnect)', updatedAt: Date.now() };
tf_isignalUsers_saveMgmtCfg(cfg).then(() => {
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}).catch(() => { });
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (Akun Disconnect)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
}, 'Sambungkan Kembali...', 'No');
}
return;
}
if (!ok && code === 'EQUITY_NOT_ENOUGH') {
if (isBatch) {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: Equity tidak mencukupi', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - Equity tidak mencukupi`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (Equity tidak mencukupi).');
}
catch (e) { }
return;
}
const title = 'Equity tidak mencukupi';
const msg = 'Equity tidak mencukupi, Apakah ingin melakukan Deposit?';
try {
if (cfg.usersSetStatus && cfg.usersSetStatus[pid] && cfg.usersSetStatus[pid][aName]) {
delete cfg.usersSetStatus[pid][aName];
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
}
else {
window.__tf_isignalUsersMgmtCfg = cfg;
}
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[EQUITY] ${aName} - Equity tidak mencukupi`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Equity tidak mencukupi (butuh deposit).');
}
catch (e) { }
const runDeposit = async () => {
try {
const url = tf_isignalUsers_getIsignalUrlByName(aName) || TF_ISIGNAL_CHANNELS_URL;
try {
tf_isignalUsers_overlayAddLine(`[DEPOSIT] Membuka halaman ${aName}...`);
}
catch (e) { }
const res2 = await chrome.runtime.sendMessage({
type: 'tf_open_isignal_deposit_and_select',
url,
activate: true,
mtId: pid
});
const ok2 = !!(res2 && res2.ok);
const detail = res2 && res2.detail ? res2.detail : null;
const selected = !!(detail && detail.selected);
const clicked = !!(detail && detail.clickedDeposit);
try {
const extra = `${clicked ? 'deposit-click OK' : 'deposit-click ?'}${selected ? ', MTID selected' : ', MTID not selected'}`;
tf_isignalUsers_overlayAddLine(`[DEPOSIT] ${aName} - ${extra}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Deposit dibuka. Lanjut analis berikutnya...');
}
catch (e) { }
}
catch (e) {
const err = String(e && e.message ? e.message : e);
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Deposit error: ${err}`);
}
catch (x) { }
if (!isBatch) {
try {
tf_isignalUsers_showOkModal('Deposit gagal', err);
}
catch (x2) { }
}
}
};
if (isBatch) {
await new Promise((resolve) => {
const onYes = async () => { try {
await runDeposit();
}
catch (e) { } resolve(true); };
const onNo = async () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: user pilih No (Equity tidak mencukupi)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (Equity tidak mencukupi)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
resolve(false);
};
tf_isignalUsers_showConnectModal(title, msg, onYes, onNo, 'Deposit', 'No');
});
}
else {
tf_isignalUsers_showConnectModal(title, msg, () => { void runDeposit(); }, () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'User pilih No (Equity tidak mencukupi)', updatedAt: Date.now() };
tf_isignalUsers_saveMgmtCfg(cfg).then(() => {
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}).catch(() => { });
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (Equity tidak mencukupi)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
}, 'Deposit', 'No');
}
return;
}
if (!ok && code === 'MTID_NOT_FOUND') {
if (isBatch) {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: MTID tidak ditemukan', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - MTID tidak ditemukan di card MetaTrader`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (MTID tidak ditemukan).');
}
catch (e) { }
return;
}
const title = 'Sambungkan akun MetaTrader baru';
const red = (w) => `<span style="color:#ef4444;font-weight:700;">${w}</span>`;
const msg = `MetaTrader ID #${pid} tidak ditemukan di card MetaTrader (halaman iSignal).<br><br>` +
`Klik "Sambungkan" untuk membuka halaman analis di tab baru, lalu sambungkan akun MetaTrader secara (${red('Manual')}) (Input Lot Size Manual). ` +
`Setelah itu jika diharuskan (${red('bayar')}) iSignal, tolong selesaikan pembayaran, dan setelah berhasil, ${red('tidak perlu')} klik Set/Set ALL di Table Users and Management.`;
try {
if (cfg.usersSetStatus && cfg.usersSetStatus[pid] && cfg.usersSetStatus[pid][aName]) {
delete cfg.usersSetStatus[pid][aName];
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
}
else {
window.__tf_isignalUsersMgmtCfg = cfg;
}
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
const openConnectTab = async () => {
const url = tf_isignalUsers_getIsignalUrlByName(aName) || TF_ISIGNAL_CHANNELS_URL;
try {
if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
const res = await chrome.runtime.sendMessage({ type: 'tf_open_isignal_connect_account', url, activate: true });
if (res && res.ok)
return res;
}
}
catch (e) { }
try {
if (chrome && chrome.tabs && chrome.tabs.create) {
chrome.tabs.create({ url, active: true });
}
else {
window.open(url, '_blank');
}
}
catch (e2) {
try {
window.open(url, '_blank');
}
catch (e3) { }
}
return null;
};
if (isBatch) {
await new Promise((resolve) => {
const onYes = async () => {
let r = null;
try {
r = await openConnectTab();
}
catch (e) { }
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
try {
delete cfg.usersSetStatus[pid][aName];
}
catch (e) { }
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
const clicked = r && r.clicked ? ' (auto-click OK)' : '';
tf_isignalUsers_overlayAddLine(`[MANUAL] ${aName} - Buka tab analis${clicked}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Manual connect dibuka. Lanjut analis berikutnya...');
}
catch (e) { }
resolve(true);
};
const onNo = async () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'Skip: user pilih No (MTID tidak ditemukan)', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (MTID tidak ditemukan)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
resolve(false);
};
tf_isignalUsers_showConnectModal(title, msg, onYes, onNo, 'Sambungkan', 'No');
});
}
else {
tf_isignalUsers_showConnectModal(title, msg, () => { void openConnectTab(); }, () => {
try {
if (!cfg.usersSetStatus)
cfg.usersSetStatus = {};
if (!cfg.usersSetStatus[pid])
cfg.usersSetStatus[pid] = {};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: 'User pilih No (MTID tidak ditemukan)', updatedAt: Date.now() };
tf_isignalUsers_saveMgmtCfg(cfg).then(() => {
window.__tf_isignalUsersMgmtCfg = cfg;
try {
tf_isignalUsers_refreshSetBadges(pid, aName);
}
catch (e) { }
}).catch(() => { });
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - User pilih No (MTID tidak ditemukan)`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Skip (user pilih No).');
}
catch (e) { }
}, 'Sambungkan', 'No');
}
return;
}
const pop = resp && resp.popup ? resp.popup : null;
const codeU = (code || '').toUpperCase();
const popMsg = (pop && (pop.message || pop.text || pop.reason)) ? String(pop.message || pop.text || pop.reason) : '';
const isCooldown = !!((pop && pop.type === 'cooldown' && String(popMsg).trim()) ||
codeU.startsWith('COOLDOWN_') ||
(reason && /menunggu\s*5\s*menit/i.test(String(reason))));
if (isCooldown) {
const msg = String(popMsg || reason || '').trim();
const totalMs = 5 * 60 * 1000;
if (!cfg.usersSetCooldown || typeof cfg.usersSetCooldown !== 'object')
cfg.usersSetCooldown = {};
if (!cfg.usersSetCooldown[pid] || typeof cfg.usersSetCooldown[pid] !== 'object')
cfg.usersSetCooldown[pid] = {};
let until = Date.now() + totalMs;
try {
const prev = cfg.usersSetCooldown[pid][aName];
const prevUntil = prev && prev.until ? Number(prev.until) : null;
if (Number.isFinite(prevUntil) && prevUntil > Date.now())
until = prevUntil;
}
catch (e) { }
cfg.usersSetCooldown[pid][aName] = {
until,
totalMs,
reason: msg || 'Anda harus menunggu 5 menit untuk melakukan perubahan lainnya',
updatedAt: Date.now()
};
cfg.usersSetStatus[pid][aName] = { status: 'fail', reason: msg || 'Cooldown 5 menit', updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
try {
tf_isignalUsers_refreshSetCountdownUI(pid, aName, cfg);
}
catch (e) { }
try {
tf_isignalUsers_ensureSetCountdownTicker();
}
catch (e) { }
if (msg) {
if (!isBatch) {
try {
tf_isignalUsers_showOkModal(pop && pop.title ? pop.title : 'Info', msg, pop && pop.buttonLabel ? pop.buttonLabel : 'OK');
}
catch (e) { }
}
else {
try {
tf_isignalUsers_overlayAddLine(`[SKIP] ${aName} - ${msg}`);
}
catch (e) { }
}
}
tf_isignalUsers_overlayAddLine(`[COOLDOWN] ${aName} - ${msg || reason}`);
tf_isignalUsers_overlaySetStatus('Cooldown 5 menit (skip)...');
return;
}
cfg.usersSetStatus[pid][aName] = { status: ok ? 'ok' : 'fail', reason, updatedAt: Date.now() };
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_refreshSetBadges(pid, aName);
const tag = (ok && code === 'SKIP_SAME_LOT') ? '[SKIP]' : (ok ? '[OK]' : '[FAIL]');
tf_isignalUsers_overlayAddLine(`${tag} ${aName} - ${reason}`);
tf_isignalUsers_overlaySetStatus(ok ? 'Selesai.' : 'Selesai dengan error.');
}
async function tf_isignalUsers_startDisconnectFlowForAnalyst(platformId, analystName, jobToken = null) {
const pid = String(platformId || '');
const aName = String(analystName || '').trim();
if (!pid || !aName)
return;
if (tf_isignalUsers_isDisconnectJobCancelled(jobToken))
return;
try {
tf_isignalUsers_showSetOverlay();
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus(`Disconnect akun untuk ${aName}...`);
}
catch (e) { }
try {
tf_isignalUsers_overlayAddLine(`[Mulai] Disconnect - ${aName}`);
}
catch (e) { }
const cfg = await tf_isignalUsers_loadMgmtCfg();
window.__tf_isignalUsersMgmtCfg = cfg;
let pass = '';
try {
const escPid = (typeof CSS !== 'undefined' && CSS.escape) ? CSS.escape(String(pid)) : String(pid);
const inp = document.querySelector(`input.tf-users-pass-input[data-platform-id="${escPid}"]`) ||
document.querySelector(`tr[data-platform-id="${escPid}"] input.tf-users-pass-input`) ||
document.querySelector(`input.tf-users-pass-input[data-platform-id="${pid}"]`) ||
document.querySelector(`tr[data-platform-id="${pid}"] input.tf-users-pass-input`);
if (inp && typeof inp.value === 'string')
pass = inp.value.trim();
}
catch (e) { }
pass = (pass || '').trim();
if (!pass) {
try {
pass = (cfg && cfg.users && cfg.users[pid] && typeof cfg.users[pid].password === 'string')
? String(cfg.users[pid].password).trim()
: '';
}
catch (e) {
pass = '';
}
}
if (!pass) {
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Password kosong`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Fail: Password kosong');
}
catch (e) { }
try {
tf_isignalUsers_showOkModal('Password belum diisi', `Silakan isi Password di main row Metatrader ID (${pid}), lalu coba Disconnect lagi.`);
}
catch (e) { }
return;
}
try {
if (!cfg.users)
cfg.users = {};
if (!cfg.users[pid])
cfg.users[pid] = {};
cfg.users[pid].password = pass;
await tf_isignalUsers_saveMgmtCfg(cfg);
window.__tf_isignalUsersMgmtCfg = cfg;
}
catch (e) { }
const url = (typeof tf_isignalUsers_getIsignalUrlByName === 'function')
? (tf_isignalUsers_getIsignalUrlByName(aName) || '')
: '';
if (!url) {
try {
tf_isignalUsers_overlayAddLine(`[FAIL] ${aName} - Link analis kosong`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Fail: Link analis kosong');
}
catch (e) { }
return;
}
if (tf_isignalUsers_isDisconnectJobCancelled(jobToken))
return;
const resp = await chrome.runtime.sendMessage({
type: 'tf_isignal_users_disconnect_apply',
jobToken: jobToken ? String(jobToken) : '',
platformId: pid,
mtId: pid,
analystName: aName,
analystUrl: url,
password: pass
});
const ok = resp && resp.ok;
const code = resp && resp.code ? String(resp.code) : '';
const reason = resp && resp.reason ? String(resp.reason) : (ok ? 'OK' : 'Gagal');
if (tf_isignalUsers_isDisconnectJobCancelled(jobToken)) {
try {
tf_isignalUsers_overlayAddLine(`[CANCEL] Disconnect - ${aName}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Stopped.');
}
catch (e) { }
return;
}
if (ok) {
try {
tf_isignalUsers_overlayAddLine(`[OK] Disconnect - ${aName}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Disconnect OK');
}
catch (e) { }
}
else {
try {
tf_isignalUsers_overlayAddLine(`[FAIL] Disconnect - ${aName} (${code}) - ${reason}`);
}
catch (e) { }
try {
tf_isignalUsers_overlaySetStatus('Disconnect FAIL');
}
catch (e) { }
try {
if (resp && resp.popup && resp.popup.title) {
tf_isignalUsers_showOkModal(resp.popup.title, resp.popup.message || reason, resp.popup.buttonLabel || 'OK');
}
}
catch (e) { }
}
}
async function tf_isignalUsers_startSetFlowForPlatform(platformId, jobToken = null, uniqOverride = null) {
const pid = String(platformId || '');
if (!pid)
return;
if (tf_isignalUsers_isSetJobCancelled(jobToken))
return;
tf_isignalUsers_showSetOverlay();
tf_isignalUsers_overlaySetStatus('Setting lot untuk semua pair/analis...');
tf_isignalUsers_overlayAddLine(`[Mulai] Platform ${pid}`);
try {
tf_isignalUsers_ensureSetCountdownTicker();
}
catch (e) { }
const cfg = await tf_isignalUsers_loadMgmtCfg();
window.__tf_isignalUsersMgmtCfg = cfg;
const balNow = tf_isignalUsers_getBalanceForPid(pid, cfg);
const riskNow = tf_isignalUsers_getRiskForPid(pid, cfg, 1);
if (!cfg.users)
cfg.users = {};
if (!cfg.users[pid])
cfg.users[pid] = {};
if (balNow != null)
cfg.users[pid].balance = balNow;
cfg.users[pid].risk = riskNow;
if (!balNow) {
tf_isignalUsers_overlayAddLine('[FAIL] Balance kosong - isi Balance di main row Metatrader ID.');
tf_isignalUsers_overlaySetStatus('Fail: Balance kosong');
tf_isignalUsers_showOkModal('Balance belum diisi', `Silakan isi Balance di main row Metatrader ID (${pid}), lalu klik Set ALL lagi.`);
try {
await tf_isignalUsers_saveMgmtCfg(cfg);
}
catch (e) { }
window.__tf_isignalUsersMgmtCfg = cfg;
return;
}
const entries = tf_isignalUsers_buildAnalystEntries(pid, cfg) || [];
const uniq = Array.isArray(uniqOverride) && uniqOverride.length
? uniqOverride.map(x => String(x)).filter(Boolean)
: (() => {
const u = [];
for (const x of entries) {
const n = x && x.baseName ? String(x.baseName) : '';
if (!n)
continue;
if (!u.includes(n))
u.push(n);
}
return u;
})();
if (!uniq.length) {
tf_isignalUsers_overlayAddLine('[WARN] No analysts found to set.');
tf_isignalUsers_overlaySetStatus('Tidak ada analis untuk di-set.');
return;
}
tf_isignalUsers_overlayAddLine(`[INFO] Running Set ALL for ${uniq.length} analyst(s) ...`);
for (const aName of uniq) {
if (tf_isignalUsers_isSetJobCancelled(jobToken)) {
tf_isignalUsers_overlayAddLine('[CANCEL] Stopped by user.');
tf_isignalUsers_overlaySetStatus('Stopped.');
return;
}
await tf_isignalUsers_startSetFlowForAnalyst(pid, aName, jobToken, true);
await new Promise((r) => setTimeout(r, 0));
}
tf_isignalUsers_overlayAddLine('[Selesai] Semua proses selesai.');
tf_isignalUsers_overlaySetStatus('Done!');
}
async function tf_isignalUsers_initPage() {
const table = document.getElementById('tf-users-mgmt-table');
if (!table)
return;
const loader = document.getElementById('tf-users-mgmt-loader');
const errBox = document.getElementById('tf-users-mgmt-error');
const showLoading = (on) => {
if (!loader)
return;
loader.style.display = on ? 'flex' : 'none';
};
const showError = (msg) => {
if (!errBox)
return;
errBox.textContent = String(msg || '');
errBox.style.display = msg ? 'block' : 'none';
};
showError('');
showLoading(true);
try {
tf_isignalUsers_bindSetOverlayButtons();
}
catch (e) { }
try {
tf_isignalUsers_bindSetLinks();
}
catch (e) { }
const profileData = await tf_storageLocalGet(['tfUserProfile']);
const profile = profileData ? profileData.tfUserProfile : null;
const statusText = profile && profile.statusText ? String(profile.statusText) : '';
const isOnline = !!(profile && statusText && !/offline|belum login|not\\s*logged/i.test(statusText));
if (!isOnline) {
showLoading(false);
showError('Status belum Online/Terlogin. Silakan login dulu (menu Login) lalu buka iSignal users lagi.');
return;
}
try {
tf_isignalUsers_renderIsignalAnalystTables(null);
}
catch (e) { }
try {
setTimeout(() => { tf_isignalUsers_startActiveChannelsScan(); }, 30);
}
catch (e) { }
if (!window.__tfIsUsersPassEyeBound) {
window.__tfIsUsersPassEyeBound = true;
document.addEventListener('click', (e) => {
const btn = e.target && e.target.closest ? e.target.closest('.tf-pass-eye') : null;
if (!btn)
return;
const wrap = btn.closest('.tf-pass-wrap');
const inp = wrap ? wrap.querySelector('input') : null;
if (!inp)
return;
const willReveal = String(inp.type) === 'password';
inp.type = willReveal ? 'text' : 'password';
btn.setAttribute('aria-pressed', willReveal ? 'true' : 'false');
if (wrap)
wrap.classList.toggle('is-revealed', willReveal);
});
}
if (!window.__tfIsUsersSubProgressBound) {
window.__tfIsUsersSubProgressBound = true;
chrome.runtime.onMessage.addListener((msg) => {
try {
if (!msg || msg.type !== 'tf_isignal_sub_end_progress')
return;
const id = String(msg.isignalId || '').trim();
if (!id)
return;
if (id === '__DONE__') {
__tfIsUsersVerifyState.subScanDone = true;
if (Array.isArray(__tfIsUsersVerifyState.channels)) {
__tfIsUsersVerifyState.channels.forEach((c) => {
if (!c)
return;
const subRaw = (c.subscriptionEndOn || '').toString().trim();
const sub = (subRaw === '-' || subRaw === '—') ? '' : subRaw;
if (!sub)
c.subscriptionLoading = false;
});
}
tf_isignalUsers_renderIsignalAnalystTables();
return;
}
const itemDone = !!msg.done;
const endOnRaw = msg.subscriptionEndOn ? String(msg.subscriptionEndOn).trim() : '';
const endOn = (endOnRaw === '-' || endOnRaw === '—') ? '' : endOnRaw;
const arr = __tfIsUsersVerifyState.channels || [];
const idx = arr.findIndex((x) => x && String(x.isignalId || '').trim() === id);
if (idx >= 0) {
if (endOn) {
arr[idx].subscriptionEndOn = endOn;
arr[idx].subscriptionLoading = false;
}
else if (itemDone) {
arr[idx].subscriptionEndOn = '';
arr[idx].subscriptionLoading = false;
}
else {
arr[idx].subscriptionLoading = true;
}
__tfIsUsersVerifyState.channels = arr;
try {
__tfIsUsersVerifyState.map = tf_isignalUsers_buildActiveMap(arr);
}
catch (e) { }
}
tf_isignalUsers_renderIsignalAnalystTables(null);
}
catch (e) { }
});
}
try {
tf_loadTable1StateFromLocalStorage();
}
catch (e) { }
const defaultBalance = (typeof currentBalance !== 'undefined' && tf_isFiniteNumber(currentBalance) && currentBalance > 0) ? currentBalance : 5000;
const defaultRisk = (typeof currentRiskPercent !== 'undefined' && tf_isFiniteNumber(currentRiskPercent) && currentRiskPercent > 0) ? currentRiskPercent : 1;
const stored = await tf_storageLocalGet([TF_ISIGNAL_USERS_MGMT_KEY]);
let cfg = stored && stored[TF_ISIGNAL_USERS_MGMT_KEY] ? stored[TF_ISIGNAL_USERS_MGMT_KEY] : null;
if (!cfg || typeof cfg !== 'object')
cfg = { version: 1, users: {}, platformIds: [], fetchedAt: 0, updatedAt: 0 };
if (!cfg.users || typeof cfg.users !== 'object')
cfg.users = {};
try {
tf_isignalUsers_migrateLegacyCooldownStatus(cfg);
}
catch (e) { }
try {
window.__tf_isignalUsersMgmtCfg = cfg;
}
catch (e) { }
try {
tf_isignalUsers_refreshAllSetCountdownUI(cfg);
}
catch (e) { }
try {
tf_isignalUsers_ensureSetCountdownTicker();
}
catch (e) { }
const resp = await tf_isignalUsers_fetchPlatformIds();
if (!resp || !resp.ok) {
showLoading(false);
const err = resp && resp.error ? resp.error : 'Gagal mengambil Platform ID.';
showError(err === 'NOT_LOGGED_IN' ? 'Tidak bisa mengambil Platform ID karena belum login di account.tradersfamily.id.' : err);
return;
}
const platformIds = Array.isArray(resp.platformIds) ? resp.platformIds : [];
cfg.platformIds = platformIds;
cfg.fetchedAt = Date.now();
cfg.updatedAt = Date.now();
platformIds.forEach((pid) => {
const id = String(pid);
if (!cfg.users[id])
cfg.users[id] = { password: '', balance: null, risk: null, analystRisk: {}, analystLot: {} };
if (!cfg.users[id].analystRisk || typeof cfg.users[id].analystRisk !== 'object')
cfg.users[id].analystRisk = {};
if (!cfg.users[id].analystLot || typeof cfg.users[id].analystLot !== 'object')
cfg.users[id].analystLot = {};
});
await tf_storageLocalSet({ [TF_ISIGNAL_USERS_MGMT_KEY]: cfg });
const meta = await tf_isignalUsers_prepareAnalystMeta();
if (!meta.ok) {
tf_isignalUsers_renderUsersTable(platformIds, cfg, [], defaultBalance, defaultRisk);
showLoading(false);
showError(meta.error || 'Tidak ada data analis.');
return;
}
tf_isignalUsers_renderUsersTable(platformIds, cfg, meta.entries || [], defaultBalance, defaultRisk);
try {
window.__tf_isignalUsersMgmtCfg = cfg;
const migrated = (typeof tf_isignalUsers_migrateLegacyCooldownStatus === 'function')
? tf_isignalUsers_migrateLegacyCooldownStatus(cfg)
: false;
if (migrated) {
try {
await tf_isignalUsers_saveMgmtCfg(cfg);
}
catch (e) { }
window.__tf_isignalUsersMgmtCfg = cfg;
}
try {
tf_isignalUsers_refreshAllSetCountdownUI(cfg);
}
catch (e) { }
let hasCooldown = false;
try {
const now = Date.now();
const mpPid = cfg && cfg.usersSetCooldown ? cfg.usersSetCooldown : null;
if (mpPid) {
Object.keys(mpPid || {}).forEach((pid) => {
const mpA = mpPid[pid];
if (!mpA)
return;
Object.keys(mpA || {}).forEach((aName) => {
const st = mpA[aName];
const until = st && st.until ? Number(st.until) : null;
if (Number.isFinite(until) && until > now)
hasCooldown = true;
});
});
}
}
catch (e) { }
try {
tf_isignalUsers_ensureSetCountdownTicker();
}
catch (e) { }
}
catch (e) { }
showLoading(false);
showError('');
}

// ===== REV109: Table 4 - Score History Analis =====
(() => {
  'use strict';
  if (document.body && document.body.getAttribute('data-page') === 'isignal-users') return;
  const STORAGE_KEY = 'tfScoreHistory';
  const expanded = new Set();
  let sortBy = 'averageScore';
  const metricDefs = [
    ['level','Level'],['partnership','Kemitraan'],['subscriber','Subscriber'],['profitFactor','Profit Factor'],
    ['monthlyLossRatio','Mthly. Loss Ratio'],['profitMonths','Profit Months'],['recoveryRate','Recovery Rate']
  ];
  const sortDefs = [['averageScore','Average Score terbaru'], ...metricDefs, ['name','Nama Analis (A–Z)']];
  const esc = (v) => String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const num = (v) => { if (v === null || typeof v === 'undefined' || String(v).trim() === '') return null; const n = Number(v); return Number.isFinite(n) ? n : null; };
  const metric = (row, key) => {
    const raw = row && row[key];
    if (raw && typeof raw === 'object') return { value:String(raw.value == null ? '' : raw.value), score:num(raw.score), max:num(raw.max) == null ? 4 : num(raw.max) };
    return { value:String(raw == null ? '' : raw), score:num(row && row[key + 'Score']), max:4 };
  };
  const latestSort = (r) => Number(r && r.dateSort) || Number(r && r.scannedAt) || 0;
  function scoreText(value, fallback) {
    const n = num(value);
    if (n == null) return esc(fallback || '-');
    return esc(n.toLocaleString('id-ID', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })) + '<span class="tf-score-max"> / 4</span>';
  }
  function metricCell(row, key) {
    const m = metric(row, key);
    const val = m.value ? '<span class="tf-score-value">' + esc(m.value) + '</span>' : '<span class="tf-score-value">-</span>';
    const sc = m.score == null ? '<span class="tf-score-pill is-empty">-</span>' : '<span class="tf-score-pill score-' + Math.max(0, Math.min(4, Math.floor(m.score))) + '">' + esc(m.score) + '/4</span>';
    return val + sc;
  }
  function ensureSection() {
    if (document.getElementById('tf-score-history-section')) return document.getElementById('tf-score-history-section');
    const host = document.getElementById('tf-dashboard-main') || document.querySelector('.page') || document.body;
    if (!host) return null;
    const section = document.createElement('section');
    section.className = 'card tf-score-history-card';
    section.id = 'tf-score-history-section';
    section.innerHTML = `
      <div class="card-header tf-score-card-header">
        <div class="card-title-group">
          <h2>Table 4 – Score History Analis</h2>
          <div class="card-badge"><span class="card-badge-dot"></span><span>Score 0–4</span></div>
        </div>
        <div class="section-note">Ringkasan memakai data bulan terbaru. Klik <b>Detail</b> untuk melihat seluruh riwayat.</div>
      </div>
      <div class="tf-score-sortbar" id="tf-score-sortbar"></div>
      <div class="table-wrapper tf-score-summary-wrap">
        <table class="tf-score-summary-table">
          <thead><tr><th>Nama Analis</th><th>Average Score Terbaru</th><th>Detail</th></tr></thead>
          <tbody id="tf-score-summary-body"><tr><td colspan="3" class="tf-score-empty">Belum ada data Score. Import data yang memiliki Score History dari desktop.</td></tr></tbody>
        </table>
      </div>`;
    const footer = host.querySelector(':scope > footer');
    if (footer) host.insertBefore(section, footer); else host.appendChild(section);
    const sortHost = section.querySelector('#tf-score-sortbar');
    sortHost.innerHTML = '<label class="tf-score-sort"><span>Urutkan berdasarkan</span><select id="tf-score-sort-select">' +
      sortDefs.map(([key,label]) => '<option value="' + esc(key) + '"' + (key === sortBy ? ' selected' : '') + '>' + esc(label) + '</option>').join('') +
      '</select></label>';
    sortHost.addEventListener('change', (event) => {
      const sel = event.target && event.target.closest ? event.target.closest('#tf-score-sort-select') : null;
      if (!sel) return;
      sortBy = sel.value || 'averageScore';
      render();
    });
    section.addEventListener('click', (event) => {
      const link = event.target && event.target.closest ? event.target.closest('[data-score-detail]') : null;
      if (!link) return;
      event.preventDefault();
      const name = decodeURIComponent(link.getAttribute('data-score-detail') || '');
      if (expanded.has(name)) expanded.delete(name); else expanded.add(name);
      render();
    });
    return section;
  }
  function detailTable(records) {
    // REV318 mobile layout uses six equal metric units after one compact pinned
    // Date rail. Rows 1 and 2 are three equal columns (2 units each), while row
    // 3 is two equal columns (3 units each). Every header is followed by its
    // value row: Header -> Value -> Header -> Value -> Header -> Value.
    const rows = records.map((r) =>
      '<tr class="tf-score-head-primary tf-score-record-head tf-score-v318-head1">' +
        '<th class="tf-score-date-head-v318">Date</th>' +
        '<th colspan="2">Average Score</th><th colspan="2">Level</th><th colspan="2">KEMITRAAN</th>' +
      '</tr>' +
      '<tr class="tf-score-detail-primary tf-score-v318-value1">' +
        '<td class="tf-score-date-cell-v318" rowspan="5">' + esc(r.date || r.monthKey || '-') + '</td>' +
        '<td colspan="2" class="tf-score-average-cell">' + scoreText(r.averageScore, r.averageScoreText) + '</td>' +
        '<td colspan="2">' + metricCell(r,'level') + '</td>' +
        '<td colspan="2">' + metricCell(r,'partnership') + '</td>' +
      '</tr>' +
      '<tr class="tf-score-head-secondary tf-score-record-head tf-score-v318-head2">' +
        '<th colspan="2">SUBSCRIBER</th><th colspan="2">PROFIT FACTOR</th><th colspan="2">Mthly. Loss Ratio</th>' +
      '</tr>' +
      '<tr class="tf-score-detail-secondary tf-score-v318-value2">' +
        '<td colspan="2">' + metricCell(r,'subscriber') + '</td>' +
        '<td colspan="2">' + metricCell(r,'profitFactor') + '</td>' +
        '<td colspan="2">' + metricCell(r,'monthlyLossRatio') + '</td>' +
      '</tr>' +
      '<tr class="tf-score-head-tertiary tf-score-record-head tf-score-v318-head3">' +
        '<th colspan="3">Profit Months</th><th colspan="3">Recovery Rate</th>' +
      '</tr>' +
      '<tr class="tf-score-detail-tertiary tf-score-v318-value3">' +
        '<td colspan="3">' + metricCell(r,'profitMonths') + '</td>' +
        '<td colspan="3">' + metricCell(r,'recoveryRate') + '</td>' +
      '</tr>'
    ).join('');
    const cols = '<colgroup><col class="tf-score-date-col-v318">' +
      '<col class="tf-score-unit-v318"><col class="tf-score-unit-v318"><col class="tf-score-unit-v318">' +
      '<col class="tf-score-unit-v318"><col class="tf-score-unit-v318"><col class="tf-score-unit-v318"></colgroup>';
    return '<div class="tf-score-detail-wrap tf-score-detail-wrap-v317 tf-score-detail-wrap-v318"><table class="tf-score-detail-table tf-score-detail-mobile-v312 tf-score-detail-mobile-v314 tf-score-detail-mobile-v317 tf-score-detail-mobile-v318">' + cols + '<tbody>' + rows + '</tbody></table></div>';
  }
  function readStorage() {
    return new Promise((resolve) => {
      try { chrome.storage.local.get([STORAGE_KEY], (d) => resolve(Array.isArray(d && d[STORAGE_KEY]) ? d[STORAGE_KEY] : [])); }
      catch (e) { resolve([]); }
    });
  }
  function compareAnalysts(a, b) {
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'id', { sensitivity:'base' });
    const av = sortBy === 'averageScore' ? num(a.latest.averageScore) : metric(a.latest, sortBy).score;
    const bv = sortBy === 'averageScore' ? num(b.latest.averageScore) : metric(b.latest, sortBy).score;
    if (av == null && bv != null) return 1;
    if (av != null && bv == null) return -1;
    if (av != null && bv != null && bv !== av) return bv - av;
    const avgA = num(a.latest.averageScore);
    const avgB = num(b.latest.averageScore);
    if (avgA != null && avgB != null && avgB !== avgA) return avgB - avgA;
    return a.name.localeCompare(b.name, 'id', { sensitivity:'base' });
  }
  async function render() {
    const section = ensureSection();
    if (!section) return;
    const body = section.querySelector('#tf-score-summary-body');
    if (!body) return;
    const raw = await readStorage();
    const groups = new Map();
    raw.forEach((r) => {
      const name = String(r && (r.analyst || r.analystName) || '').trim();
      if (!name) return;
      if (!groups.has(name)) groups.set(name, []);
      groups.get(name).push(r);
    });
    const analysts = Array.from(groups.entries()).map(([name, records]) => {
      records.sort((a,b) => latestSort(b) - latestSort(a));
      return { name, records, latest: records[0] || {} };
    }).sort(compareAnalysts);
    if (!analysts.length) {
      body.innerHTML = '<tr><td colspan="3" class="tf-score-empty">Belum ada data Score. Import data yang memiliki Score History dari desktop.</td></tr>';
      return;
    }
    body.innerHTML = analysts.map(({name, records, latest}) => {
      const isOpen = expanded.has(name);
      const enc = encodeURIComponent(name);
      const summary = '<tr class="tf-score-summary-row"><td class="tf-score-analyst">' + esc(name) + '</td><td class="tf-score-average-cell">' + scoreText(latest.averageScore, latest.averageScoreText) + '</td><td><a href="#" class="tf-score-detail-link" data-score-detail="' + enc + '">' + (isOpen ? 'Tutup' : 'Detail') + '</a></td></tr>';
      const detail = isOpen ? '<tr class="tf-score-expanded-row"><td colspan="3">' + detailTable(records) + '</td></tr>' : '';
      return summary + detail;
    }).join('');
  }
  function boot() {
    ensureSection();
    render();
    try { chrome.storage.onChanged.addListener((changes, area) => { if (area === 'local' && changes && changes[STORAGE_KEY]) render(); }); } catch (e) {}
    window.tfRenderScoreHistory = render;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once:true }); else setTimeout(boot, 0);
})();
// ===== END REV109 Table 4 =====

// REV340 EQUITY SCALE: USD Line + Candle floor = initial balance - $1,000.

// REV342: Mobile/Web Candle D1 flexible zoom sizing: viewport-relative candle width and visible-range candle scale.
