document.body.innerHTML = `
  <div class="toolbar">
    <button class="btn" id="btn-download" type="button" disabled>Preparing PDF...</button>
    <button class="btn" id="btn-close" type="button">Close</button>
  </div>

  <h1 id="report-title">Export</h1>
  <div class="note" id="report-note"></div>
  <div class="export-progress" id="export-progress" aria-live="polite"></div>

  <div id="table-wrap"></div>

  <div class="tf-copyright-footer">
    <div>© 2025 <a href="mailto:wiliejonathan@gmail.com">wiliejonathan@gmail.com</a></div>
    <div>Instagram <a class="tf-ig-link" href="https://www.instagram.com/wilie_jonathan/" target="_blank" rel="noopener noreferrer">Wilie_jonathan</a></div>
  </div>
`;

// REV194: memory-safe chronological print renderer with monthly totals for large Table 3 exports.
// Key changes:
// 1) no artificial N-trades-per-page split,
// 2) history is grouped by calendar year, then one table per month,
// 3) each monthly table may flow naturally across PDF pages and repeats its own header,
// 4) year/month boundaries use compact spacing instead of forced page breaks,
// 5) monthly tables are rendered in batches with event-loop yields,
// 6) temporary storage + JS row objects + heavy DOM are released as early as practical.
(async () => {
  if (window.tfIntegrityReady && !(await window.tfIntegrityReady)) return;

  const $ = (id) => document.getElementById(id);
  const MONTH_TABLES_PER_RENDER_BATCH = 6;

  function toNumber(v, fallback = 0) {
    const n = typeof v === 'number' ? v : parseFloat(v);
    return Number.isFinite(n) ? n : fallback;
  }

  function esc(v) {
    if (v == null) return '';
    return String(v);
  }

  function fmtMoney(x) {
    const n = toNumber(x, 0);
    return n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function fmtNumber(x, dp) {
    const n = toNumber(x, 0);
    return n.toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp });
  }

  function _pad2(n) {
    return String(n).padStart(2, '0');
  }

  function formatNowFilename() {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = _pad2(d.getMonth() + 1);
    const dd = _pad2(d.getDate());
    const HH = _pad2(d.getHours());
    const MI = _pad2(d.getMinutes());
    const SS = _pad2(d.getSeconds());
    return `${yyyy}-${mm}-${dd}_${HH}${MI}${SS}`;
  }

  function nextFrame() {
    return new Promise((resolve) => {
      if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
      else setTimeout(resolve, 0);
    });
  }

  const ALL_COLUMNS = [
    { key: 'created', header: 'Tanggal (Created At)', weight: 15 },
    { key: 'closed', header: 'Tanggal (Closed At)', weight: 15 },
    { key: 'analyst', header: 'Nama Analis', weight: 13 },
    { key: 'balance', header: 'Balance', weight: 10 },
    { key: 'entry', header: 'Entry', weight: 9 },
    { key: 'takeProfit', header: 'Take Profit', weight: 9 },
    { key: 'stopLoss', header: 'Stop Loss', weight: 9 },
    { key: 'type', header: 'Type', weight: 7 },
    { key: 'pair', header: 'Pair', weight: 8 },
    { key: 'lot', header: 'Lot Size', weight: 7 },
    { key: 'pnlPips', header: 'PnL (pips)', weight: 8 },
    { key: 'pnlDollar', header: 'PnL ($)', weight: 9 },
    { key: 'pnlDollarNet', header: 'PnL $ (Net)', weight: 11 },
    { key: 'pnlPercent', header: 'PnL %', weight: 8 },
    { key: 'pnlPercentNet', header: 'PnL % (Net)', weight: 11 },
    { key: 'swapDollar', header: 'Swap $', weight: 8 },
    { key: 'commDollar', header: 'Comm $', weight: 8 },
    { key: 'balancePnl', header: 'Balance PnL ($)', weight: 11 }
  ];

  const DEFAULT_VISIBLE = new Set([
    'created', 'closed', 'analyst', 'balance', 'pair', 'lot',
    'pnlPips', 'pnlDollar', 'pnlDollarNet', 'pnlPercent', 'pnlPercentNet', 'swapDollar', 'commDollar', 'balancePnl'
  ]);

  function getColumns(payload) {
    const requested = Array.isArray(payload.visibleColumns)
      ? new Set(payload.visibleColumns.map((x) => String(x)))
      : DEFAULT_VISIBLE;
    const balanceHeader = payload.balanceHeader || 'Balance';
    const costSuffix = payload.costHeaderSuffix || ' (Net)';
    return ALL_COLUMNS
      .filter((col) => requested.has(col.key))
      .map((col) => {
        if (col.key === 'balance') return { ...col, header: balanceHeader };
        if (col.key === 'pnlDollarNet') return { ...col, header: 'PnL $' + costSuffix };
        if (col.key === 'pnlPercentNet') return { ...col, header: 'PnL %' + costSuffix };
        return col;
      });
  }

  function addColGroup(table, columns) {
    const totalWeight = columns.reduce((sum, col) => sum + (col.weight || 1), 0) || 1;
    const group = document.createElement('colgroup');
    columns.forEach((col) => {
      const el = document.createElement('col');
      el.style.width = ((col.weight || 1) / totalWeight * 100).toFixed(3) + '%';
      group.appendChild(el);
    });
    table.appendChild(group);
  }

  function buildCellMap(r) {
    const createdAt = esc(r.createdDate || '');
    const closedAt = esc(r.displayDate || '');
    const analyst = esc(r.analyst || '');
    const entry = esc(r.entry ?? r.price ?? '');
    const takeProfit = esc(r.takeProfit ?? r.take_profit ?? r.tp ?? '');
    const stopLoss = esc(r.stopLoss ?? r.stop_loss ?? r.sl ?? '');
    const type = esc(r.type ?? r.side ?? r.orderType ?? '');
    const pair = esc(r.pair || '');
    const balanceBase = toNumber(r.balanceCompound, 0);
    const lot = toNumber(r.lot, 0);
    const pnlPips = toNumber(r.pnlPips, 0);
    const pnlDollar = toNumber(r.pnlDollar, 0);
    const pnlDollarNet = toNumber(r.pnlDollarNet, pnlDollar);
    const swapDollar = toNumber(r.swapDollar, 0);
    const commDollar = toNumber(r.commDollar, 0);
    const balancePnl = toNumber(r.balancePnl, balanceBase);
    const rawPct = toNumber(r.pnlPercent, NaN);
    const pnlPercent = Number.isFinite(rawPct)
      ? rawPct
      : (balanceBase !== 0 ? (pnlDollar / balanceBase) * 100 : 0);
    const rawPctNet = toNumber(r.pnlPercentNet, NaN);
    const pnlPercentNet = Number.isFinite(rawPctNet)
      ? rawPctNet
      : (balanceBase !== 0 ? (pnlDollarNet / balanceBase) * 100 : 0);
    const signCls = pnlDollar > 0 ? 'tp' : (pnlDollar < 0 ? 'sl' : 'neutral');
    const signNetCls = pnlDollarNet > 0 ? 'tp' : (pnlDollarNet < 0 ? 'sl' : 'neutral');
    const typeCls = /^buy$/i.test(type) ? 'type-buy' : (/^sell$/i.test(type) ? 'type-sell' : '');

    return {
      created: { text: createdAt, cls: 'mono' },
      closed: { text: closedAt, cls: 'mono' },
      analyst: { text: analyst, cls: '' },
      balance: { text: fmtMoney(balanceBase), cls: 'mono' },
      entry: { text: entry, cls: 'mono' },
      takeProfit: { text: takeProfit, cls: 'mono' },
      stopLoss: { text: stopLoss, cls: 'mono' },
      type: { text: type, cls: typeCls },
      pair: { text: pair, cls: '' },
      lot: { text: fmtNumber(lot, 2), cls: 'mono' },
      pnlPips: { text: fmtNumber(pnlPips, 1), cls: 'mono ' + (pnlPips > 0 ? 'tp' : (pnlPips < 0 ? 'sl' : 'neutral')) },
      pnlDollar: { text: fmtMoney(pnlDollar), cls: 'mono ' + signCls },
      pnlDollarNet: { text: fmtMoney(pnlDollarNet), cls: 'mono ' + signNetCls },
      pnlPercent: { text: fmtNumber(pnlPercent, 2) + '%', cls: 'mono ' + (pnlPercent > 0 ? 'tp' : (pnlPercent < 0 ? 'sl' : 'neutral')) },
      pnlPercentNet: { text: fmtNumber(pnlPercentNet, 2) + '%', cls: 'mono ' + (pnlPercentNet > 0 ? 'tp' : (pnlPercentNet < 0 ? 'sl' : 'neutral')) },
      swapDollar: { text: fmtMoney(swapDollar), cls: 'mono ' + (swapDollar < 0 ? 'sl' : 'neutral') },
      commDollar: { text: fmtMoney(commDollar), cls: 'mono ' + (commDollar < 0 ? 'sl' : 'neutral') },
      balancePnl: { text: fmtMoney(balancePnl), cls: 'mono' }
    };
  }

  const MONTH_NAMES_ID = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  function datePartsFromRow(row) {
    const r = row || {};
    const numeric = [r.sortKey, r.createdSortKey]
      .map((v) => Number(v))
      .find((v) => Number.isFinite(v) && v > 0);
    if (numeric) {
      const d = new Date(numeric);
      if (!Number.isNaN(d.getTime())) {
        return { year: d.getFullYear(), month: d.getMonth() + 1 };
      }
    }

    const candidates = [r.displayDate, r.createdDate]
      .map((v) => String(v || '').trim())
      .filter(Boolean);
    for (const text of candidates) {
      let m = text.match(/\b(\d{1,2})[-\/.](\d{1,2})[-\/.](\d{4})\b/);
      if (m) {
        const month = Number(m[2]);
        const year = Number(m[3]);
        if (month >= 1 && month <= 12 && year >= 1900) return { year, month };
      }
      m = text.match(/\b(\d{4})[-\/.](\d{1,2})[-\/.](\d{1,2})\b/);
      if (m) {
        const year = Number(m[1]);
        const month = Number(m[2]);
        if (month >= 1 && month <= 12 && year >= 1900) return { year, month };
      }
      const parsed = Date.parse(text);
      if (Number.isFinite(parsed)) {
        const d = new Date(parsed);
        if (!Number.isNaN(d.getTime())) return { year: d.getFullYear(), month: d.getMonth() + 1 };
      }
    }
    return { year: 0, month: 0 };
  }

  function groupRowsByYearMonth(rows) {
    const years = new Map();
    (Array.isArray(rows) ? rows : []).forEach((row, originalIndex) => {
      const parts = datePartsFromRow(row);
      const year = parts.year || 0;
      const month = parts.month || 0;
      const yearKey = String(year || 'unknown');
      const monthKey = String(month || 'unknown');
      if (!years.has(yearKey)) years.set(yearKey, { year, firstIndex: originalIndex, months: new Map(), count: 0 });
      const y = years.get(yearKey);
      if (!y.months.has(monthKey)) y.months.set(monthKey, { month, firstIndex: originalIndex, rows: [] });
      y.months.get(monthKey).rows.push(row);
      y.count += 1;
    });

    const yearList = Array.from(years.values()).sort((a, b) => {
      if (!a.year && !b.year) return a.firstIndex - b.firstIndex;
      if (!a.year) return 1;
      if (!b.year) return -1;
      return a.year - b.year;
    });
    yearList.forEach((year) => {
      year.monthList = Array.from(year.months.values()).sort((a, b) => {
        if (!a.month && !b.month) return a.firstIndex - b.firstIndex;
        if (!a.month) return 1;
        if (!b.month) return -1;
        return a.month - b.month;
      });
    });
    return yearList;
  }

  function monthLabel(month, year) {
    if (month >= 1 && month <= 12 && year) return `${MONTH_NAMES_ID[month - 1]} ${year}`;
    if (year) return `Tanggal tidak dikenali — ${year}`;
    return 'Tanggal tidak dikenali';
  }

  function calculateMonthTotals(rows) {
    const totals = { lot: 0, pnlPips: 0, pnlDollar: 0, pnlDollarNet: 0, pnlPercent: 0, pnlPercentNet: 0, swapDollar: 0, commDollar: 0, tradeCount: 0 };
    (Array.isArray(rows) ? rows : []).forEach((r) => {
      const row = r || {};
      // Withdraw/start-balance rows are cash-flow markers, not trades.
      if (row.isWithdraw || row.isStartBalance) return;
      totals.lot += toNumber(row.lot, 0);
      totals.pnlPips += toNumber(row.pnlPips, 0);
      totals.pnlDollar += toNumber(row.pnlDollar, 0);
      totals.pnlDollarNet += toNumber(row.pnlDollarNet, toNumber(row.pnlDollar, 0));
      totals.swapDollar += toNumber(row.swapDollar, 0);
      totals.commDollar += toNumber(row.commDollar, 0);

      const balanceBase = toNumber(row.balanceCompound, 0);
      const rawPct = toNumber(row.pnlPercent, NaN);
      const pnlPct = Number.isFinite(rawPct)
        ? rawPct
        : (balanceBase !== 0 ? (toNumber(row.pnlDollar, 0) / balanceBase) * 100 : 0);
      totals.pnlPercent += pnlPct;
      const rawPctNet = toNumber(row.pnlPercentNet, NaN);
      const pnlPctNet = Number.isFinite(rawPctNet)
        ? rawPctNet
        : (balanceBase !== 0 ? (toNumber(row.pnlDollarNet, toNumber(row.pnlDollar, 0)) / balanceBase) * 100 : 0);
      totals.pnlPercentNet += pnlPctNet;
      totals.tradeCount += 1;
    });
    return totals;
  }

  function totalSignClass(value) {
    return value > 0 ? 'tp' : (value < 0 ? 'sl' : 'neutral');
  }

  function appendMonthTotalRow(tbody, columns, monthRows) {
    const totals = calculateMonthTotals(monthRows);
    const totalKeys = new Set(['lot', 'pnlPips', 'pnlDollar', 'pnlDollarNet', 'pnlPercent', 'pnlPercentNet', 'swapDollar', 'commDollar', 'balancePnl']);
    let labelIndex = columns.findIndex((col) => !totalKeys.has(col.key));
    if (labelIndex < 0) labelIndex = 0;

    const tr = document.createElement('tr');
    tr.className = 'tf-month-total-row';
    columns.forEach((col, index) => {
      const td = document.createElement('td');
      td.className = 'mono';

      if (col.key === 'lot') {
        td.textContent = fmtNumber(totals.lot, 2);
        td.className += ' neutral';
      } else if (col.key === 'pnlPips') {
        td.textContent = fmtNumber(totals.pnlPips, 1);
        td.className += ' ' + totalSignClass(totals.pnlPips);
      } else if (col.key === 'pnlDollar') {
        td.textContent = fmtMoney(totals.pnlDollar);
        td.className += ' ' + totalSignClass(totals.pnlDollar);
      } else if (col.key === 'pnlDollarNet') {
        td.textContent = fmtMoney(totals.pnlDollarNet);
        td.className += ' ' + totalSignClass(totals.pnlDollarNet);
      } else if (col.key === 'pnlPercent') {
        td.textContent = fmtNumber(totals.pnlPercent, 2) + '%';
        td.className += ' ' + totalSignClass(totals.pnlPercent);
      } else if (col.key === 'pnlPercentNet') {
        td.textContent = fmtNumber(totals.pnlPercentNet, 2) + '%';
        td.className += ' ' + totalSignClass(totals.pnlPercentNet);
      } else if (col.key === 'swapDollar') {
        td.textContent = fmtMoney(totals.swapDollar);
        td.className += ' ' + totalSignClass(totals.swapDollar);
      } else if (col.key === 'commDollar') {
        td.textContent = fmtMoney(totals.commDollar);
        td.className += ' ' + totalSignClass(totals.commDollar);
      } else if (col.key === 'balancePnl') {
        // Intentionally blank: Balance PnL ($) is an ending balance, not an additive monthly metric.
        td.textContent = '';
      } else if (index === labelIndex) {
        td.textContent = `TOTAL BULAN (${totals.tradeCount.toLocaleString()} trade)`;
        td.className = 'tf-month-total-label';
      } else {
        td.textContent = '';
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  }

  function buildMonthTable(payload, columns, monthGroup, isFirstTable) {
    const section = document.createElement('section');
    section.className = 'tf-export-month';

    const title = document.createElement('div');
    title.className = 'tf-export-month-title';
    const titleMain = document.createElement('span');
    titleMain.className = 'tf-export-month-name';
    titleMain.textContent = monthLabel(monthGroup.month, monthGroup.year);
    const titleMeta = document.createElement('span');
    titleMeta.className = 'tf-export-month-meta';
    titleMeta.textContent = `${monthGroup.rows.length.toLocaleString()} trade`;
    title.append(titleMain, titleMeta);
    section.appendChild(title);

    const table = document.createElement('table');
    table.className = 'tf-export-table';
    addColGroup(table, columns);

    const thead = document.createElement('thead');
    const trh = document.createElement('tr');
    columns.forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col.header;
      trh.appendChild(th);
    });
    thead.appendChild(trh);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    if (isFirstTable && Object.prototype.hasOwnProperty.call(payload, 'startBalance')) {
      const trStart = document.createElement('tr');
      trStart.className = 'tf-start-balance-row';
      const tdStart = document.createElement('td');
      tdStart.colSpan = Math.max(1, columns.length);
      tdStart.textContent = `${esc(payload.startBalanceLabel || 'Start Balance')}: $${fmtMoney(payload.startBalance)}`;
      trStart.appendChild(tdStart);
      tbody.appendChild(trStart);
    }

    monthGroup.rows.forEach((r) => {
      const row = r || {};
      const tr = document.createElement('tr');
      if (row.isWithdraw) tr.className = 'tf-withdraw-row';
      const cells = buildCellMap(row);
      columns.forEach((col) => {
        const c = cells[col.key] || { text: '', cls: '' };
        const td = document.createElement('td');
        td.textContent = c.text;
        if (c.cls) td.className = c.cls;
        const color=col.key==='analyst'?(row.textColors?.analyst||row.textColors?.row):row.textColors?.row;
        if(/^#[0-9a-f]{6}$/i.test(color||''))td.style.setProperty('color',color,'important');
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    // REV194: one compact monthly summary row at the end of each monthly table.
    // Lot Size, PnL pips, PnL $, and PnL % are additive; Balance PnL ($) stays blank.
    appendMonthTotalRow(tbody, columns, monthGroup.rows);

    table.appendChild(tbody);
    section.appendChild(table);
    return section;
  }

  async function renderChronologicalReport(payload) {
    const rows = Array.isArray(payload.rows) ? payload.rows : [];
    const columns = getColumns(payload);
    const wrap = $('table-wrap');
    const progress = $('export-progress');
    wrap.textContent = '';

    const years = groupRowsByYearMonth(rows);
    const flatMonths = [];
    years.forEach((yearGroup) => {
      yearGroup.monthList.forEach((monthGroup) => {
        flatMonths.push({ ...monthGroup, year: yearGroup.year, yearGroup });
      });
    });
    const monthCount = flatMonths.length || 1;
    const yearCount = years.length || 1;
    if (progress) progress.textContent = `Preparing ${rows.length.toLocaleString()} rows • ${monthCount.toLocaleString()} monthly tables • ${yearCount.toLocaleString()} years...`;

    let monthRendered = 0;
    let firstTable = true;
    for (const yearGroup of years) {
      const yearSection = document.createElement('section');
      yearSection.className = 'tf-export-year';

      const yearTitle = document.createElement('div');
      yearTitle.className = 'tf-export-year-title';
      const yearName = document.createElement('span');
      yearName.className = 'tf-export-year-name';
      yearName.textContent = yearGroup.year ? `TAHUN ${yearGroup.year}` : 'TAHUN / TANGGAL TIDAK DIKENALI';
      const yearMeta = document.createElement('span');
      yearMeta.className = 'tf-export-year-meta';
      yearMeta.textContent = `${yearGroup.count.toLocaleString()} trade • ${yearGroup.monthList.length.toLocaleString()} bulan`;
      yearTitle.append(yearName, yearMeta);
      yearSection.appendChild(yearTitle);
      wrap.appendChild(yearSection);

      for (let i = 0; i < yearGroup.monthList.length; i += MONTH_TABLES_PER_RENDER_BATCH) {
        const frag = document.createDocumentFragment();
        const batch = yearGroup.monthList.slice(i, i + MONTH_TABLES_PER_RENDER_BATCH);
        batch.forEach((monthGroup) => {
          frag.appendChild(buildMonthTable(
            payload,
            columns,
            { ...monthGroup, year: yearGroup.year },
            firstTable
          ));
          firstTable = false;
          monthRendered += 1;
        });
        yearSection.appendChild(frag);
        if (progress) progress.textContent = `Preparing monthly tables: ${monthRendered.toLocaleString()} / ${monthCount.toLocaleString()}`;
        await nextFrame();
      }
    }

    try { rows.length = 0; } catch (_) {}
    try { payload.rows = null; } catch (_) {}
    years.forEach((year) => year.monthList && year.monthList.forEach((month) => { try { month.rows.length = 0; } catch (_) {} }));
    if (progress) progress.textContent = `Ready: ${monthCount.toLocaleString()} monthly tables across ${yearCount.toLocaleString()} years. PDF pages will flow naturally.`;
    return { monthCount, yearCount };
  }

  function releaseRenderedReport() {
    const wrap = $('table-wrap');
    if (wrap) wrap.replaceChildren();
    const progress = $('export-progress');
    if (progress) progress.textContent = 'Print Preview closed. Heavy report memory has been released. Export again from Table 3 to print another copy.';
    const btn = $('btn-download');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Print completed';
    }
  }

  function main() {
    const id = new URLSearchParams(location.search).get('id');
    if (!id) {
      $('report-title').textContent = 'Export Table 3';
      $('report-note').textContent = 'Error: export id tidak ditemukan.';
      return;
    }

    const key = 'tf_export_history_pdf_' + id;
    chrome.storage.local.get([key, 'tfLicenseCredentials'], async (res) => {
      const payload = res && res[key];
      // Delete the duplicate serialized copy immediately; the local JS copy is enough for rendering.
      try { chrome.storage.local.remove(key); } catch (_) {}

      if (!payload) {
        $('report-title').textContent = 'Export Table 3';
        $('report-note').textContent = 'Error: data export tidak ditemukan. Silakan export ulang.';
        return;
      }

      const fn = payload.tsFile ? String(payload.tsFile) : formatNowFilename();
      document.title = 'Table3_' + fn;
      $('report-title').textContent = payload.title || 'Export Table 3';

      const credentials = (res && res.tfLicenseCredentials) || {};
      const licensedEmail = String(credentials.email || '').trim().toLowerCase();
      const tokenText = String(credentials.token || '').trim().toUpperCase();
      const licenseSuffix = tokenText ? tokenText.replace(/[^A-Z0-9]/g, '').slice(-4) : '';
      const maskedLicenseId = licenseSuffix ? '••••-' + licenseSuffix : '-';
      const rowCount = Array.isArray(payload.rows) ? payload.rows.length : 0;

      $('report-note').textContent =
        'Risk Mode: ' + (payload.riskMode || '-') + ' | Rows: ' + rowCount.toLocaleString() +
        (licensedEmail ? ' | Licensed to: ' + licensedEmail + ' | License: ' + maskedLicenseId : '');

      if (licensedEmail) {
        const watermark = document.createElement('div');
        watermark.id = 'tf-license-watermark';
        watermark.className = 'tf-license-watermark';
        watermark.textContent = 'Licensed to: ' + licensedEmail + ' • License: ' + maskedLicenseId;
        document.body.appendChild(watermark);
      }

      const btnPrint = $('btn-download');
      const btnClose = $('btn-close');
      try {
        const reportStats = await renderChronologicalReport(payload);
        if (btnPrint) {
          btnPrint.disabled = false;
          btnPrint.textContent = reportStats.monthCount > 1 ? `Print / Save as PDF (${reportStats.monthCount} bulan)` : 'Print / Save as PDF';
          btnPrint.addEventListener('click', () => {
            btnPrint.disabled = true;
            document.documentElement.classList.add('tf-printing');
            setTimeout(() => {
              try { window.print(); }
              catch (_) { btnPrint.disabled = false; }
            }, 60);
          }, { once: true });
        }
      } catch (error) {
        if ($('export-progress')) $('export-progress').textContent = 'Gagal menyiapkan layout PDF: ' + (error && error.message ? error.message : String(error));
      }

      if (btnClose) {
        btnClose.addEventListener('click', () => {
          try { window.close(); } catch (_) {}
        });
      }
    });
  }

  window.addEventListener('afterprint', () => {
    document.documentElement.classList.remove('tf-printing');
    setTimeout(releaseRenderedReport, 250);
  }, { once: true });

  async function startExportWithoutLicenseGate() {
    if (window.tfIntegrityReady && typeof window.tfIntegrityReady.then === 'function') {
      const integrityOk = await window.tfIntegrityReady;
      if (!integrityOk) return;
    }
    main();
  }

  try { void startExportWithoutLicenseGate(); }
  catch (e) { console.error('Export page error:', e); }
})();
