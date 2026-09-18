# REV379 PC price logic audit

## 4b4d6b8dc315a95c.js
Functions: tf_applyLatestPriceCacheAndRefreshUi, tf_formatMyfxbookPrice, tf_getPriceNum, tf_initDashboardMainAfterPrice, tf_isInvestingPriceReadyNow, tf_isMyfxbookPriceLoading, tf_isignalUsers_getPremiumPrice, tf_parseMyfxbookNumber, tf_refreshMyfxbookPricesForce, tf_schedulePriceDependentUiRefresh, tf_setRefreshPriceLinkLoading, tf_setWaitPriceMode, tf_togglePriceDependentHeaderSpinners, tf_waitForPriceThenInitMain

### tf_applyLatestPriceCacheAndRefreshUi
~~~js
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
~~~

### tf_formatMyfxbookPrice
~~~js
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
~~~

### tf_getPriceNum
~~~js
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
~~~

### tf_initDashboardMainAfterPrice
~~~js
function tf_initDashboardMainAfterPrice() {
try {
if (__tfDashboardMainReady)
return;
__tfDashboardMainReady = true;
tf_setWaitPriceMode(false);
buildMonthlyTableSkeleton();
setupAnalystTickerFilter();
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
renderSummaryTable();
recomputeHistoryRows();
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
~~~

### tf_isInvestingPriceReadyNow
~~~js
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
~~~

### tf_isMyfxbookPriceLoading
~~~js
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
~~~

### tf_isignalUsers_getPremiumPrice
~~~js
function tf_isignalUsers_getPremiumPrice() {
return 'Rp299.000';
}
~~~

### tf_parseMyfxbookNumber
~~~js
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
~~~

### tf_refreshMyfxbookPricesForce
~~~js
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
~~~

### tf_schedulePriceDependentUiRefresh
~~~js
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
~~~

### tf_setRefreshPriceLinkLoading
~~~js
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
~~~

### tf_setWaitPriceMode
~~~js
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
~~~

### tf_togglePriceDependentHeaderSpinners
~~~js
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
~~~

### tf_waitForPriceThenInitMain
~~~js
async function tf_waitForPriceThenInitMain() {
try {
if (__tfDashboardMainReady)
return;
tf_setWaitPriceMode(true);
const start = Date.now();
const maxMs = 60000;
while (Date.now() - start < maxMs) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
if (tf_isInvestingPriceReadyNow())
break;
await new Promise((r) => setTimeout(r, 250));
}
tf_initDashboardMainAfterPrice();
}
catch (e) {
try {
tf_initDashboardMainAfterPrice();
}
catch (x) { }
}
}
~~~

### context TF_MYFXBOOK_PRICES_KEY
~~~js
onst analystName = (p.analystName || '').trim();
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
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
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
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
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
label.style.fon
~~~

### context tf_refreshMyfxbookPricesForce
~~~js
= 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
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
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
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
if (typeof isPairNoValue !== 'functi
~~~

### context fetch(
~~~js
r = normalized.toLowerCase();
const compact = upper.replace(/[^A-Z0-9]/g, '');
const candidates = [normalized, upper, lower, compact];
if (compact.startsWith('TF') && compact.length > 2) {
const body = compact.slice(2);
if (body.length >= 8 && body.length % 4 === 0) {
const groups = body.match(/.{1,4}/g) || [];
candidates.push('TF-' + groups.join('-'));
}
}
return Array.from(new Set(candidates.filter(Boolean)));
}
function tfShouldTryCredentialVariant(result) {
if (!result || result.valid === true)
return false;
const code = String(result.code || '').trim().toUpperCase();
if (['LICENSE_EXPIRED', 'LICENSE_BLOCKED', 'LICENSE_INACTIVE', 'DEVICE_TRANSFERRED'].includes(code))
return false;
const message = String(result.message || '').trim().toUpperCase();
return /TOKEN|EMAIL|CREDENTIAL|LICENSE[_ -]?NOT[_ -]?FOUND|INVALID[_ -]?LICENSE|PERIKSA.*TOKEN|EMAIL.*TOKEN/.test(code + ' ' + message);
}
function tfNormalizeLicenseResult(result) {
const source = result && typeof result === 'object' ? result : {};
return {
valid: source.valid === true,
success: source.success === true,
code: String(source.code || ''),
message: String(source.message || ''),
acceptedEmail: tfCleanEmail(source.acceptedEmail || ''),
acceptedToken: tfNormalizeToken(source.acceptedToken || ''),
email: tfNormalizeEmail(source.email),
status: String(source.status || '').trim().toUpperCase(),
duration: String(source.duration || '').trim().toUpperCase(),
isTrial: source.isTrial === true || String(source.duration || '').trim().toUpperCase() === 'TRIAL (1 HARI)',
isPermanent: source.isPermanent === true || String(source.duration || '').trim().toUpperCase() === 'PERMANENT',
activatedAt: String(source.activatedAt || ''),
expiresAt: String(source.expiresAt || ''),
serverTime: String(source.serverTime || ''),
remainingSeconds: Number.isFinite(Number(source.remainingSeconds))
? Math.max(0, Math.floor(Number(source.remainingSeconds)))
: null,
isOffline: source.isOffline === true || String(source.code || '').toUpperCase() === 'LICENSE_VALID_OFFLINE_GRACE',
verificationPending: source.verificationPending === true ||
['LICENSE_VALID_CACHED_SERVER_UNAVAILABLE', 'LICENSE_VALID_CACHED_PENDING'].includes(String(source.code || '').toUpperCase()),
offlineGraceExpiresAt: String(source.offlineGraceExpiresAt || ''),
offlineGraceRemainingSeconds: Number.isFinite(Number(source.offlineGraceRemainingSeconds))
? Math.max(0, Math.floor(Number(source.offlineGraceRemainingSeconds)))
: null,
serverVerified: source.serverVerified === true,
isignalUsersAccessKnown: source.isignalUsersAccessKnown === true ||
typeof source.isignalUsersAccess === 'boolean' ||
typeof source.isignalUsersIncluded === 'boolean' ||
typeof source.isignalUsersAddonRequired === 'boolean' ||
Boolean(source.isignalUsersAccessReason),
isignalUsersAccess: source.isignalUsersAccess === true,
isignalUsersIncluded: source.isignalUsersIncluded === true,
isignalUsersAddonRequired: source.isignalUsersAddonRequired === true,
isignalUsersPlan: String(source.isignalUsersPlan || '').trim().toUpperCase(),
isignalUsersExpiresAt: String(source.isignalUsersExpiresAt || ''),
isignalUsersRemainingSeconds: Number.isFinite(Number(source.isignalUsersRemainingSeconds))
? Math.max(0, Math.floor(Number(source.isignalUsersRemainingSeconds)))
: null,
isignalUsersAccessReason: String(source.isignalUsersAccessReason || '').trim().toUpperCase()
};
}
function tfWait(milliseconds) {
return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(milliseconds) || 0)));
}
async function tfCallLicenseApi(action, email, token, options) {
const opts = options || {};
const timeoutMs = Math.max(1000, Number(opts.timeoutMs) || TF_LICENSE_REQUEST_TIMEOUT_MS);
const attempts = Math.max(1, Math.floor(Number(opts.attempts) || TF_LICENSE_REQUEST_ATTEMPTS));
const retryDelayMs = Math.max(0, Number(opts.retryDelayMs) || TF_LICENSE_REQUEST_RETRY_DELAY_MS);
const deviceId = await tfGetDeviceId();
const __tfUiPresenceStored = await tfStorageGet(['tfUiPresenceStateV1']);
const __tfUiPresenceState = __tfUiPresenceStored.tfUiPresenceStateV1 || {};
const __tfUiPresenceActive = typeof opts.uiPresenceActive === 'boolean'
? opts.uiPresenceActive
: __tfUiPresenceState.active === true;
const __tfPresenceEvent = String(opts.presenceEvent || '').trim().toUpperCase();
const emailCandidates = tfBuildEmailCandidates(email);
const tokenCandidates = tfBuildTokenCandidates(token);
let lastError = null;
let lastResult = null;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
let networkFailed = false;
let credentialAttempt = 0;
const totalCredentialAttempts = Math.max(1, emailCandidates.length * tokenCandidates.length);
for (const candidateEmail of emailCandidates) {
for (const candidateToken of tokenCandidates) {
credentialAttempt += 1;
const controller = typeof AbortController === 'function'
? new AbortController()
: null;
const timeoutId = setTimeout(() => {
try {
if (controller)
controller.abort();
}
catch (e) { }
}, timeoutMs);
try {
const response = await fetch(TF_LICENSE_API_URL, {
method: 'POST',
redirect: 'follow',
cache: 'no-store',
signal: controller ? controller.signal : undefined,
headers: {
'Content-Type': 'application/json;charset=UTF-8'
},
body: JSON.stringify({
action: String(action || 'validate'),
email: candidateEmail,
emailCanonical: tfNormalizeEmail(candidateEmail),
token: candidateToken,
deviceId,
extensionId: chrome.runtime.id,
extensionVersion: chrome.runtime.getManifest().version,
uiPresenceActive: __tfUiPresenceActive,
presenceEvent: __tfPresenceEvent,
clientPage: (typeof location !== 'undefined' && location.pathname) ? String(location.pathname) : '',
requestNonce: String(Date.now()) + '-' + attempt + '-' + credentialAttempt + '-' + Math.random().toString(36).slice(2)
})
});
if (!response.ok) {
throw new Error('HTTP ' + response.status);
}
const text = await response.text();
let parsed;
try {
parsed = JSON.parse(text);
}
catch (e) {
throw new Error('Respons server bukan JSON yang valid.');
}
const normalized = tfNormalizeLicenseResult({
...(parsed || {}),
serverVerified: true
});
if (normalized.valid === true) {
normalized.acceptedEmail = candidateEmail;
normalized.acceptedToken = candidateToken;
}
const legacyMessage = String(normalized.message || '').toLowerCase();
if (legacyMessage.includes('device id') || legacyMessage.includes('device_id')) {
normalized.valid = false;
normalized.acceptedEmail = '';
normalized.acceptedToken = '';
normalized.code = 'LEGACY_DEVICE_SERVER';
normalized.message = 'Server lisensi masih memakai script lama yang membatasi Device ID. Perbarui Code.gs lalu Deploy sebagai New version.';
}
lastResult = normalized;
if (normalized.valid === true || !tfShouldTryCredentialVariant(normalized) || credentialAttempt >= totalCredentialAttempts) {
return normalized;
}
}
catch (error) {
lastError = error;
networkFailed = true;
break;
}
finally {
clearTimeout(timeoutId);
}
}
if (networkFailed)
break;
}
if (!networkFailed && lastResult)
return lastResult;
if (attempt < attempts) {
await tfWait(retryDelayMs);
}
}
if (lastResult)
return lastResult;
throw lastError || new Error('Server lisensi belum merespons.');
}

function tfIsPrimaryPopupPage() {
try {
const path = String(location && location.pathname || '').toLowerCase();
return path.endsWith('/popup.html') || path === 'popup.html';
}
catch (e) {
return false;
}
}
function tfEnsureServerGateUi() {
let root = document.getElementById('tf-server-gate');
if (root)
return root;
const style = document.createElement('style');
style.id = 'tf-server-gate-style';
style.textContent = `
#tf-server-gate {
position: fixed;
inset: 0;
z-index: 2147483646;
display: flex;
align-items: center;
justify-content: center;
padding: 22px;
background: #020617;
color: #e5e7eb;
font-family: Arial, Helvetica, sans-serif;
}
#tf-server-gate.tf-server-gate-hidden { display: none !important; }
#tf-server-gate * { box-sizing: border-box; }
#tf-server-gate .tf-server-gate-card {
width: min(360px, calc(100vw - 36px));
display: flex;
align-items: center;
gap: 13px;
padding: 15px 17px;
border: 1px solid rgba(148,163,184,.30);
border-radius: 14px;
background: rgba(15,23,42,.97);
box-shadow: 0 22px 65px rgba(0,0,0,.48);
}
#tf-server-gate .tf-server-gate-spinner {
width: 28px;
height: 28px;
flex: 0 0 28px;
border-radius: 999px;
border: 3px solid rgba(148,163,184,.25);
border-top-color: #22c55e;
animation: tfServerGateSpin .82s linear infinite;
}
#tf-server-gate.tf-server-gate-locked .tf-server-gate-spinner {
animation: none;
border-color: rgba(239,68,68,.35);
border-top-color: #ef4444;
}
#tf-server-gate .tf-server-gate-copy {
min-width: 0;
display: flex;
flex-direction: column;
gap: 3px;
}
#tf-server-gate .tf-server-gate-title {
color: #f8fafc;
font-size: 13px;
font-weight: 800;
line-height: 1.25;
}
#tf-server-gate .tf-server-gate-subtitle {
color: #94a3b8;
font-size: 11px;
line-height: 1.4;
white-space: normal;
}
#tf-server-gate .tf-server-gate-retry {
display: none;
width: max-content;
margin-top: 7px;
padding: 5px 9px;
border: 1px solid rgba(56,189,248,.55);
border-radius: 999px;
background: rgba(14,165,233,.10);
color: #bae6fd;
cursor: pointer;
font-size: 10px;
font-weight: 750;
}
#tf-server-gate.tf-server-gate-locked .tf-server-gate-retry { display: inline-flex; }
#tf-server-gate .tf-server-gate-retry:disabled { opacity: .55; cursor: wait; }
@keyframes tfServerGateSpin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
root = document.createElement('div');
root.id = 'tf-server-gate';
root.className = 'tf-server-gate-hidden';
root.setAttribute('role', 'status');
root.setAttribute('aria-live', 'polite');
root.innerHTML = `
<div class="tf-server-gate-card">
<div class="tf-server-gate-spinner" aria-hidden="true"></div>
<div class="tf-server-gate-copy">
<div class="tf-server-gate-title">Connecting to server...</div>
<div class="tf-server-gate-subtitle">Checking license status</div>
<button class="tf-server-gate-retry" type="button">Coba Lagi</button>
</div>
</div>
`;
document.body.appendChild(root);
const retryButton = root.querySelector('.tf-server-gate-retry');
if (retryButton) {
retryButton.addEventListener('click', async () => {
retryButton.disabled = true;
tfShowServerGate('Connecting to server...', 'Checking license status', false);
try {
if (String(location.pathname || '').toLowerCase().endsWith('/subscribe_plan.html')) {
await tfRequireServerCheckOnly({ force: true });
}
else {
await tfRequireLicense({ force: true });
}
}
finally {
retryButton.disabled = false;
}
});
}
return root;
}
function tfShowServerGate(title, subtitle, locked) {
const root = tfEnsureServerGateUi();
const licenseRoot = document.getElementById('tf-license-root');
if (licenseRoot)
licenseRoot.classList.add('tf-license-hidden');
root.classList.remove('tf-server-gate-hidden');
root.classList.toggle('tf-server-gate-locked', !!locked);
const titleElement = root.querySelector('.tf-server-gate-title');
const subtitleElement = root.querySelector('.tf-server-gate-subtitle');
if (titleElement)
titleElement.textContent = String(title || 'Connecting to server...');
if (subtitleElement)
subtitleElement.textContent = String(subtitle || 'Checking license status');
document.documentElement.setAttribute('data-tf-gate-mode', locked ? 'locked' : 'loading');
document.documentElement.setAttribute('data-tf-license', 'locked');
tfSetServerAuthorization(false);
}
function tfHideServerGate() {
const root = document.getElementById('tf-server-gate');
if (root)
root.classList.add('tf-server-gate-hidden');
document.documentElement.removeAttribute('data-tf-gate-mode');
}
function tfEnsureLicenseUi() {
let root = document.getElementById('tf-license-root');
if (root)
return root;
const style = document.createElement('style');
style.id = 'tf-license-style';
style.textContent = `
#tf-license-root {
position: fixed;
inset: 0;
z-index: 2147483647;
display: flex;
align-items: center;
justify-content: center;
padding: 22px;
overflow: auto;
background: rgba(2, 6, 23, 0.985);
color: #e5e7eb;
font-family: Arial, Helvetica, sans-serif;
}
#tf-license-root.tf-license-hidden { display: none !important; }
#tf-license-root * { box-sizing: border-box; }
#tf-license-root .tf-license-card {
width: min(420px, 100%);
padding: 24px;
border: 1px solid rgba(148, 163, 184, 0.28);
border-radius: 16px;
background: #0f172a;
box-shadow: 0 24px 70px rgba(0,0,0,.48);
}
#tf-license-root .tf-license-title {
margin: 0 0 8px;
font-size: 22px;
line-height: 1.25;
color: #f8fafc;
}
#tf-license-root .tf-license-copy {
margin: 0 0 17px;
color: #aeb8c8;
font-size: 13px;
line-height: 1.55;
}
#tf-license-root .tf-license-label {
display: block;
margin: 11px 0 6px;
color: #dbe4f0;
font-size: 12px;
font-weight: 700;
}
#tf-license-root .tf-license-input {
width: 100%;
min-height: 42px;
padding: 10px 12px;
border: 1px solid #334155;
border-radius: 9px;
outline: none;
background: #020617;
color: #f8fafc;
font-size: 14px;
}
#tf-license-root .tf-license-input:focus {
border-color: #38bdf8;
box-shadow: 0 0 0 3px rgba(56,189,248,.15);
}
#tf-license-root .tf-license-button {
width: 100%;
min-height: 43px;
margin-top: 16px;
padding: 10px 14px;
border: 0;
border-radius: 9px;
background: #22c55e;
color: #052e16;
cursor: pointer;
font-size: 14px;
font-weight: 800;
}
#tf-license-root .tf-license-button:hover { filter: brightness(1.06); }
#tf-license-root .tf-license-button:disabled { opacity: .58; cursor: wait; }
#tf-license-root .tf-license-subscribe-button {
width: 100%;
min-height: 41px;
margin-top: 9px;
padding: 9px 13px;
border: 1px solid rgba(56,189,248,.72);
border-radius: 9px;
background: rgba(14,165,233,.12);
color: #bae6fd;
cursor: pointer;
font-size: 13px;
font-weight: 800;
}
#tf-license-root .tf-license-subscribe-button:hover {
background: rgba(14,165,233,.22);
border-color: #38bdf8;
color: #f0f9ff;
}
#tf-license-root .tf-license-message {
min-height: 20px;
margin-top: 12px;
color: #fca5a5;
font-size: 13px;
line-height: 1.45;
text-align: center;
}
#tf-license-root .tf-license-message.tf-license-ok { color: #86efac; }
#tf-license-root .tf-license-footnote {
margin: 12px 0 0;
color: #64748b;
font-size: 11px;
line-height: 1.45;
text-align: center;
}
`;
document.head.appendChild(style);
root = document.createElement('div');
root.id = 'tf-license-root';
root.className = 'tf-license-hidden';
root.setAttribute('role', 'dialog');
root.setAttribute('aria-modal', 'true');
root.innerHTML = `
<div class="tf-license-card">
<h1 class="tf-license-title">Aktivasi TF Extension</h1>
<p class="tf-license-copy">Masukkan email pembelian dan token aktivasi. Lisensi dapat digunakan selama email, token, status, dan masa berlakunya valid.</p>
<label class="tf-license-label" for="tf-license-email">Email pembelian</label>
<input class="tf-license-input" id="tf-license-email" type="email" autocomplete="email" placeholder="nama@email.com">
<label class="tf-license-label" for="tf-license-token">Token aktivasi</label>
<input class="tf-license-input" id="tf-license-token" type="text" autocomplete="off" spellcheck="false" placeholder="TF / TFA License Token">
<button class="tf-license-button" id="tf-license-activate" type="button">Aktivasi</button>
<button class="tf-license-subscribe-button" id="tf-license-subscribe" type="button">Subscribe Plan</button>
<div class="tf-license-message" id="tf-license-message">Memeriksa lisensi...</div>
<p class="tf-license-footnote">Status lisensi diperiksa melalui server pemilik extension.</p>
</div>
`;
document.body.appendChild(root);
const button = root.querySelector('#tf-license-activate');
const subscribeButton = root.querySelector('#tf-license-subscribe');
const emailInput = root.querySelector('#tf-license-email');
const tokenInput = root.querySelector('#tf-license-token');
const activate = async () => {
const email = tfCleanEmail(emailInput && emailInput.value);
const token = tfNormalizeToken(tokenInput && tokenInput.value);
if (!email || !token) {
tfShowLicenseMessage('Email dan token wajib diisi.', false);
return;
}
if (button) {
button.disabled = true;
button.textContent = 'Memeriksa...';
}
tfShowLicenseMessage('Menghubungkan ke server lisensi...', true);
try {
const result = await tfCallLicenseApi('activate', email, token);
if (!result || result.valid !== true) {
tfApplyLicenseResult(result);
tfShowLicenseMessage((result && result.message) || 'Aktivasi gagal.', false);
return;
}
const now = Date.now();
await tfStorageSet({
[TF_LICENSE_CREDENTIALS_KEY]: {
email: tfCleanEmail(result.acceptedEmail || result.email || email),
emailCanonical: tfNormalizeEmail(result.acceptedEmail || result.email || email),
token: tfNormalizeToken(result.acceptedToken || token),
deviceId: await tfGetDeviceId(),
activatedAt: result.activatedAt || now,
lastValidatedAt: now,
expiresAt: result.expiresAt || '',
duration: result.duration || '',
isTrial: !!result.isTrial,
isPermanent: !!result.isPermanent,
serverTime: result.serverTime || '',
remainingSeconds: result.remainingSeconds
},
[TF_LICENSE_STATE_KEY]: {
...result,
valid: true,
~~~

### context Investing.com
~~~js
nt=\"1\" data-tf-url=\"#\" href=\"#\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy.png\"/>\n<span>iSignal <span class=\"tf-caret\">\u25be</span></span>\n</div>\n</a>\n<ul aria-label=\"iSignal submenu\" class=\"tf-submenu\">\n<li><a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/isignal/\" href=\"https://account.tradersfamily.id/channels/isignal/\">iSignal Analis</a></li>\n<li><a class=\"tf-nav-link\" data-tf-url=\"iSignalUsers.html\" href=\"iSignalUsers.html\">iSignal Users</a></li>\n</ul>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li class=\"tf-dropdown\">\n<a class=\"tf-nav-link\" data-tf-parent=\"1\" data-tf-url=\"#\" href=\"#\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-dgrey.png\"/>\n<span>TF Copy Signal <span class=\"tf-caret\">\u25be</span></span>\n</div>\n</a>\n<ul aria-label=\"TF Copy Signal submenu\" class=\"tf-submenu\">\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/\" href=\"https://account.tradersfamily.id/channels/\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/home-dgrey.png\"/>\n<span>Beranda</span>\n</div>\n</a>\n</li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/browse/?v=symbol\" href=\"https://account.tradersfamily.id/channels/browse/?v=symbol\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/search-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/search-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/search-dgrey.png\"/>\n<span>Browse Channel</span>\n</div>\n</a>\n</li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/my/\" href=\"https://account.tradersfamily.id/channels/my/\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-dgrey.png\"/>\n<span>My Channels</span>\n</div>\n</a>\n</li>\n</ul>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/profile/u/155921/?tab=settings\" href=\"https://account.tradersfamily.id/profile/u/155921/?tab=settings\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/user-black.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/user-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/user-dgrey.png\"/>\n<span>Profile</span>\n</div>\n</a>\n</li>\n</ul>\n</nav>\n</div>\n<!-- ==================== End Top Navigator Menu ==================== -->\n<section class=\"card\" id=\"section-summary\">\n<div class=\"card-header\">\n<div class=\"card-title-group\">\n<h2>Table 1 \u2013 History Signal \u2013 Money Management</h2>\n<div class=\"card-badge\">\n<span class=\"card-badge-dot\"></span>\n<span>Lot Size per Analyst</span>\n</div>\n</div>\n<div class=\"section-note\">\n          Rumus lot:<br/>\n<span class=\"mono\">(Balance \u00d7 Risk% / Trade) \u00f7 (Select SL PIPS) \u00f7 ($ / Pips)</span>\n</div>\n<div class=\"section-note\" id=\"tf-scanned-by\" style=\"margin-top: 6px;\"></div>\n</div>\n<div class=\"section-note\" style=\"margin-top: 4px;\">\n<div class=\"small-muted\" style=\"margin: 0 0 6px 0; display:flex; align-items:center; gap:10px; flex-wrap:wrap;\">\n<span>\n              Price is scanned from Investing.com\n              <a class=\"nav fxLogoLink\" id=\"tfInvestingProLogoLink\" href=\"https://id.investing.com/pro\" target=\"_blank\" rel=\"noopener\">\n                    <img id=\"investingProNavMenuItemWhite\" src=\"https://i-invdn-com.investing.com/InvestingProWhiteText.svg\" alt=\"InvestingPro\" width=\"70\" height=\"12\" style=\"position:relative;top:2px;\">\n                    <img id=\"investingProNavMenuItemBlack\" src=\"https://i-invdn-com.investing.com/InvestingProBlackText.svg\" alt=\"InvestingPro\" width=\"70\" height=\"12\" style=\"position:relative;top:2px;\">\n                  </a>\n</span>\n<span aria-hidden=\"true\" class=\"tf-note-sep\">|</span>\n<a class=\"tfRefreshPriceLink\" href=\"#\" id=\"tf-refresh-price-link\" title=\"Refresh Investing Price\">\n<span>Refresh Price</span>\n<svg class=\"svgMblExtend\" fill=\"none\" height=\"26\" style=\"display: block;border-radius: 10%;\" viewbox=\"0 0 26 26\" width=\"26\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6.81061 8.0437V4.3309H3.09521\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M19.1919 17.9497V21.6625H22.9047\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M10.5208 2.76563C11.3332 2.57084 12.1657 2.47223 13.0012 2.47183C15.2233 2.47216 17.3883 3.17581 19.1861 4.48199C20.9838 5.78816 22.322 7.62982 23.0089 9.74313C23.6958 11.8564 23.6962 14.1329 23.0101 16.2465C22.3239 18.3601 20.9864 20.2022 19.1892 21.509\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M15.4764 23.2277C13.1085 23.8014 10.6148 23.5358 8.4209 22.4762C6.22695 21.4166 4.46859 19.6286 3.44576 17.4173C2.42292 15.2059 2.19898 12.7082 2.81213 10.3502C3.42528 7.9922 4.83753 5.91995 6.80799 4.48695\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M11.1436 14.2375V14.5599C11.147 14.9714 11.3129 15.3649 11.605 15.6546C11.8972 15.9444 12.2921 16.107 12.7036 16.1069H13.3224C13.7339 16.107 14.1287 15.9444 14.4209 15.6546C14.7131 15.3649 14.8789 14.9714 14.8824 14.5599C14.8805 14.2899 14.7947 14.0272 14.6367 13.8082C14.4788 13.5893 14.2566 13.4249 14.001 13.3379L12.051 12.6879C11.7953 12.601 11.5731 12.4366 11.4152 12.2177C11.2572 11.9987 11.1714 11.7359 11.1696 11.4659C11.173 11.0545 11.3389 10.661 11.631 10.3713C11.9232 10.0815 12.3181 9.91893 12.7296 9.91895H13.3484C13.7598 9.91893 14.1547 10.0815 14.4469 10.3713C14.7391 10.661 14.9049 11.0545 14.9084 11.4659V11.7753\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M13 9.646V8.047\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M13 17.953V16.3384\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n</svg>\n</a>\n</div>\n\n<div id=\"tf-wait-price-note\">\n  <span aria-hidden=\"true\" class=\"mini-spinner tight\"></span>\n  <span>Menunggu price dari Investing.com\u2026 tabel lainnya akan muncul setelah price tersedia.</span>\n</div>\n<div class=\"pip-table-compact-wrap\">\n<table class=\"pip-table-compact pip-table-side\">\n<thead>\n<tr>\n<th class=\"pipTh\">Pair</th>\n<th class=\"pipTh\">Price <span aria-hidden=\"true\" class=\"mini-spinner pipPriceSpinner\" style=\"display:none;\"></span></th>\n<th class=\"pipTh\">$/Pip ( 1 Lot )</th>\n</tr>\n</thead>\n<tbody id=\"pip-table-compact-body-left\"></tbody>\n</table>\n<table class=\"pip-table-compact pip-table-side\">\n<thead>\n<tr>\n<th class=\"pipTh\">Pair</th>\n<th class=\"pipTh\">Price <span aria-hidden=\"true\" class=\"mini-spinner pipPriceSpinner\" style=\"display:none;\"></span></th>\n<th class=\"pipTh\">$/Pip ( 1 Lot )</th>\n</tr>\n</thead>\n<tbody id=\"pip-table-compact-body-right\"></tbody>\n</table>\n</div>\n\n<div class=\"tf-perf-wrap\" id=\"tf-perf-wrap\" style=\"display:none;\">\n  <div class=\"tf-perf-head\">\n    <div class=\"tf-perf-overall-title\">Performance/Probability Analis</div>\n    <!-- Metric selector (TP/SL | Pips | Dollar) -->\n    <div class=\"equity-filter-row tf-perf-metric-row\" style=\"margin-top: 0; margin-bottom: 0;\">\n      <div class=\"tf-perf-metric-risk-flex\" style=\"display:flex; align-items:center; gap: 14px; flex-wrap: wrap; width: 100%;\">\n        <div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n          <label for=\"tf-perf-metric-select\" style=\"min-width: 72px;\">Filter by:</label>\n          <select class=\"form-input\" id=\"tf-perf-metric-select\" style=\"width: 170px; padding: 6px 10px;\">\n            <option value=\"tp_sl\">TP/SL</option>\n            <option value=\"pips\">Pips</option>\n            <option value=\"usd\">Dollar</option>\n          </select>\n        </div>\n\n        <!-- Single-calendar-month selector (synced with Table 2, Equity Curve & Table 3) -->\n        <div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n          <label for=\"tf-single-month-select-perf\" style=\"min-width: 56px;\">Month:</label>\n          <select class=\"form-input tf-single-month-select\" id=\"tf-single-month-select-perf\" style=\"width: 170px; padding: 6px 10px;\"></select>\n        </div>\n\n        <!-- Risk Mode selector (only when Filter by: Dollar) -->\n        <div class=\"equity-date-group\" id=\"tf-perf-risk-group\" style=\"align-items: center; gap: 8px; display:none; \">\n          <label for=\"tf-perf-risk-mode-select\" style=\"min-width: 72px;\">Risk Mode:</label>\n          <select class=\"form-input\" id=\"tf-perf-risk-mode-select\" style=\"width: 170px; padding: 6px 10px;\">\n            <option value=\"fixed\">Fixed Lot</option>\n            <option value=\"compound\">Compound %</option>\n          </select>\n        </div>\n\n        <!-- Month selector (only when Risk Mode: Compound %) -->\n        <div class=\"equity-date-group\" id=\"tf-perf-compound-group\" style=\"align-items: center; gap: 8px; display:none;\">\n          <label for=\"tf-perf-compound-months-select\" style=\"min-width: 56px;\">Month:</label>\n          <select class=\"form-input\" id=\"tf-perf-compound-months-select\" style=\"width: 120px; padding: 6px 10px;\"></select>\n        </div>\n      </div>\n    </div>\n    <!-- Time Range buttons (sync with Equity Curve & Table 3) -->\n    <div class=\"tf-time-range-row tf-perf-time-range-row\" id=\"tf-time-range-row-perf\">\n      <span class=\"tf-time-range-label\">Time Range:</span>\n      <div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-perf\"></div>\n    </div>\n  </div>\n\n  <!-- Overall winrate bar spanning both tables (based on checked analysts) -->\n  <div class=\"tf-perf-overall\" id=\"tf-perf-overall\" style=\"display:none;\">\n    <div class=\"tf-perf-overall-row\">\n      <div class=\"tf-perf-overall-label\" id=\"tf-perf-overall-label\">Overall (All Analysts)</div>\n      <div class=\"tf-perf-count mono\" id=\"tf-perf-overall-count\"><span class=\"tf-perf-win\" id=\"tf-perf-overall-win\">0</span>/<span class=\"tf-perf-loss\" id=\"tf-perf-overall-loss\">0</span></div>\n      <div class=\"tf-perf-bar-track\" aria-hidden=\"true\">\n        <div class=\"tf-perf-bar-fill\" id=\"tf-perf-overall-fill\" style=\"width:0%\"></div>\n      </div>\n      <div class=\"tf-perf-overall-pct mono\" id=\"tf-perf-overall-pct\">0%</div>\n    </div>\n  </div>\n\n  <div class=\"tf-perf-card\">\n    <table class=\"tf-perf-table\">\n      <tbody id=\"tf-perf-body-left\"></tbody>\n    </table>\n  </div>\n  <div class=\"tf-perf-card\">\n    <table class=\"tf-perf-table\">\n      <tbody id=\"tf-perf-body-right\"></tbody>\n    </table>\n  </div>\n</div>\n\n</div>\n<div class=\"controls-row tf-mm-controls-row tf-mm-primary-row\">\n<div class=\"form-group tf-mm-main-input\">\n<label class=\"form-label\" for=\"balance-input\">Balance (USD)</label>\n<input class=\"form-input\" id=\"balance-input\" min=\"0\" placeholder=\"5000\" step=\"1\" type=\"number\"/>\n</div>\n<button class=\"btn tf-mm-action-btn\" id=\"apply-balance-btn\" type=\"button\">\n<span class=\"btn-icon\">$</span>\n          Apply Balance\n        </button>\n<div class=\"form-group tf-mm-main-input\">\n<label class=\"form-label\" for=\"risk-input\">Risk % / Trade</label>\n<input class=\"form-input\" id=\"risk-input\" min=\"0\" placeholder=\"1\" step=\"0.1\" type=\"number\"/>\n</div>\n<button class=\"btn tf-mm-action-btn\" id=\"apply-risk-btn\" type=\"button\">\n<span class=\"btn-icon\">%</span>\n          Apply Risk\n        </button>\n<button class=\"btn btn-ghost tf-mm-action-btn\" id=\"reset-defaults-btn\" type=\"button\">\n          Reset ke Default\n        </button>\n</div>\n<!-- REV288: Swap + Commission + Withdraw aligned on one second row -->\n<div class=\"controls-row tf-mm-secondary-row\" id=\"tf-mm-cost-withdraw-row\">\n<div class=\"tf-mm-inline-pair tf-mm-cost-pair\" title=\"Aktifkan biaya Swap pada setiap trade\">\n<span class=\"tf-switch tf-cost-switch tf-mm-row-switch\"><input id=\"swap-enabled-toggle\" type=\"checkbox\"/></span>\n<div class=\"form-group tf-mm-cost-input\">\n<label class=\"form-label\" for=\"swap-rate-input\">Swap ($/Lot)</label>\n<input class=\"form-input\" id=\"swap-rate-input\" min=\"0\" placeholder=\"9.01\" step=\"0.01\" title=\"Biaya swap rata-rata per 1.00 lot per trade. Perubahan langsung diterapkan.\" type=\"number\"/>\n</div>\n</div>\n<div class=\"tf-mm-inline-pair tf-mm-cost-pair\" title=\"Aktifkan biaya Commission pada setiap trade\">\n<span class=\"tf-switch tf-cost-switch tf-mm-row-switch\"><input id=\"commission-enabled-toggle\" type=\"checkbox\"/></span>\n<div class=\"form-group tf-mm-cost-input\">\n<label class=\"form-label\" for=\"commission-rate-input\">Comm ($/Lot)</label>\n<input class=\"form-input\" id=\"commission-rate-input\" min=\"0\" placeholder=\"20\" step=\"0.01\" title=\"Commission per 1.00 lot per trade. Perubahan langsung diterapkan.\" type=\"number\"/>\n</div>\n</div>\n<div class=\"tf-mm-inline-pair tf-mm-withdraw-pair\" id=\"withdraw-controls-row\">\n<span class=\"tf-switch tf-cost-switch tf-withdraw-toggle-switch tf-mm-row-switch\" title=\"Enable Withdraw\">\n<input id=\"withdraw-enabled-toggle\" type=\"checkbox\"/>\n</span>\n<div class=\"form-group tf-mm-withdraw-input-group\">\n<label class=\"form-label tf-withdraw-label-row\" for=\"withdraw-amount-input\">\n<span>Withdraw ($)</span>\n<span class=\"tf-withdraw-average\" id=\"withdraw-average-inline\">average : -</span>\n</label>\n<input class=\"form-input\" id=\"withdraw-amount-input\" min=\"0\" placeholder=\"0\" step=\"1\" type=\"number\"/>\n<div class=\"tf-withdraw-max-warning\" id=\"withdraw-max-warning\" style=\"display:none;\"></div>\n</div>\n<div class=\"form-group tf-mm-withdraw-period-group\">\n<label class=\"form-label\" for=\"withdraw-months-select\">&nbsp;</label>\n<select class=\"form-input\" id=\"withdraw-months-select\">\n<option selected=\"\" value=\"1\">1 month</option>\n<option value=\"2\">2 month</option>\n<option value=\"3\">3 month</option>\n<option value=\"4\">4 month</option>\n<option value=\"5\">5 month</option>\n<option value=\"6\">6 month</option>\n<option value=\"7\">7 month</option>\n<option value=\"8\">8 month</option>\n<option value=\"9\">9 month</option>\n<option value=\"10\">10 month</option>\n<option value=\"11\">11 month</option>\n<option value=\"12\">12 month</option>\n</select>\n</div>\n<button class=\"btn tf-mm-withdraw-btn\" id=\"withdraw-submit-btn\" type=\"button\">\n<span class=\"btn-icon\">$</span>\n          Apply Withdraw\n        </button>\n</div>\n</div>\n<div class=\"section-note\" id=\"rule1-withdraw-note\" style=\"color:#ef4444; font-weight:600; margin-bottom: 8px;\">\n  Jika trade terakhir di akhir bulan sebelumnya belum mengalami kenaikan <strong>10%</strong> dari saldo awal bulan tersebut (awal bulan pertama pakai <strong>Balance</strong> / <strong>Balance Compounded</strong>, bulan berikutnya pakai <strong>Balance PnL (
~~~

### context myfxbook
~~~js
.tfScanInProgress.newValue);
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
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
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
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
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
menu.
~~~
## 901c62026afc22f4.js
Functions: bg_ensureMyfxbookPrices, bg_scrapeGoldPriceFromTab, bg_scrapeMyfxbookPricesFromTab

### bg_ensureMyfxbookPrices
~~~js
async function bg_ensureMyfxbookPrices(opts) {
const force = !!(opts && opts.force);
if (bg_myfxbookPriceJob)
return bg_myfxbookPriceJob;
bg_myfxbookPriceJob = (async () => {
const now = Date.now();
const cached = await bg_storageLocalGet([TF_MYFXBOOK_PRICES_AT_KEY]);
const lastAt = cached && cached[TF_MYFXBOOK_PRICES_AT_KEY] ? Number(cached[TF_MYFXBOOK_PRICES_AT_KEY]) : 0;
const ageMs = now - (Number.isFinite(lastAt) ? lastAt : 0);
if (!force && lastAt && ageMs >= 0 && ageMs < 10 * 60 * 1000) {
return { ok: true, skipped: true, ageMs };
}
const url = 'https://id.investing.com/tools/forex-pip-calculator?tfext_investing=1&t=' + now;
let tab = null;
try {
tab = await bg_createTab(url, false);
}
catch (e) {
tab = null;
}
const tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
return { ok: false, error: 'Gagal membuka tab Investing.com.' };
}
let prices = {};
try {
await bg_waitForTabLoaded(tabId, 45000);
await bg_sleep(600);
const scraped = await bg_scrapeMyfxbookPricesFromTab(tabId);
if (!scraped || scraped.error) {
return { ok: false, error: scraped && scraped.error ? scraped.error : 'Gagal membaca tabel Pip Calculator di Investing.com.' };
}
prices = scraped.prices || {};
}
finally {
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
let goldTabId = null;
try {
const goldUrl = 'https://id.investing.com/commodities/gold?tfext_investing=1&t=' + now;
const gtab = await bg_createTab(goldUrl, false);
goldTabId = gtab && gtab.id != null ? gtab.id : null;
if (goldTabId != null) {
await bg_waitForTabLoaded(goldTabId, 45000);
await bg_sleep(800);
const goldPrice = await bg_scrapeGoldPriceFromTab(goldTabId);
if (goldPrice && String(goldPrice).trim()) {
prices['XAUUSD'] = String(goldPrice).trim();
}
}
}
catch (e) {
}
finally {
if (goldTabId != null) {
try {
await bg_removeTab(goldTabId);
}
catch (e) { }
}
}
const at = Date.now();
await bg_storageLocalSet({
[TF_MYFXBOOK_PRICES_KEY]: prices,
[TF_MYFXBOOK_PRICES_AT_KEY]: at
});
return { ok: true, count: Object.keys(prices).length, at };
})().finally(() => {
bg_myfxbookPriceJob = null;
});
return bg_myfxbookPriceJob;
}
~~~

### bg_scrapeGoldPriceFromTab
~~~js
async function bg_scrapeGoldPriceFromTab(tabId) {
const start = Date.now();
const timeoutMs = 25000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const el = document.querySelector('[data-test="instrument-price-last"]');
if (!el)
return null;
let t = String(el.textContent || '').trim();
if (!t)
return null;
t = t.replace(/\s+/g, '');
const m = t.match(/[0-9][0-9.,]*/);
if (!m)
return null;
const price = m[0];
if (!price)
return null;
return { price };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.price)
return String(payload.price);
}
catch (e) {
}
await bg_sleep(600);
}
return null;
}
~~~

### bg_scrapeMyfxbookPricesFromTab
~~~js
async function bg_scrapeMyfxbookPricesFromTab(tabId) {
const start = Date.now();
const timeoutMs = 20000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const tbl = document.querySelector('table#results.pipCalcResults') || document.querySelector('table#results') || document.querySelector('table.pipCalcResults');
if (!tbl)
return null;
const rows = tbl.querySelectorAll('tbody tr');
if (!rows || !rows.length)
return null;
const out = {};
rows.forEach((tr) => {
const a = tr.querySelector('td.bold a') || tr.querySelector('td a');
let pairTxt = a ? String(a.textContent || '').trim() : '';
pairTxt = pairTxt.replace(/\s+/g, '').toUpperCase();
if (!pairTxt)
return;
const pairKey = pairTxt.replace(/[^A-Z0-9]/g, '');
if (!pairKey)
return;
const priceTd = tr.querySelector('td[id^="price_"]') || (tr.children && tr.children.length > 1 ? tr.children[1] : null);
let v = priceTd ? String(priceTd.textContent || '').trim() : '';
v = v.replace(/\s+/g, '').trim();
if (v)
out[pairKey] = v;
});
if (!out || Object.keys(out).length === 0)
return null;
return { prices: out, rowCount: rows.length };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.prices && typeof payload.prices === 'object') {
return payload;
}
}
catch (e) {
}
await bg_sleep(500);
}
return null;
}
~~~

### context TF_MYFXBOOK_PRICES_KEY
~~~js
{
return new Promise((resolve) => {
if (windowId == null)
return resolve();
try {
chrome.windows.remove(windowId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_getActiveTabId() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
const id = (tabs && tabs[0] && tabs[0].id != null) ? tabs[0].id : null;
resolve(id);
});
}
catch (e) {
resolve(null);
}
});
}
function bg_activateTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.update(tabId, { active: true }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_queryTabsByUrl(urlOrPattern) {
return new Promise((resolve) => {
try {
chrome.tabs.query({ url: urlOrPattern }, (tabs) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(tabs || []);
});
}
catch (e) {
resolve([]);
}
});
}
function bg_reloadTab(tabId, bypassCache = true) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(false);
try {
chrome.tabs.reload(tabId, { bypassCache: !!bypassCache }, () => {
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
async function bg_openOrReloadDashboard(opts) {
const activate = !!(opts && opts.activate);
const dashUrl = chrome.runtime.getURL('dashboard.html');
const existing = await bg_queryTabsByUrl(dashUrl + '*');
if (existing && existing.length && existing[0].id != null) {
const t = existing[0];
await bg_reloadTab(t.id, true);
if (activate)
await bg_activateTab(t.id);
return { reused: true, tabId: t.id };
}
const created = await bg_createTab(dashUrl, activate);
return { reused: false, tabId: (created && created.id != null) ? created.id : null };
}
function bg_removeTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.remove(tabId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
// REV217 — close ONLY tabs explicitly marked as disposable probes.
// Never close account.tradersfamily.id URLs merely because they contain tfAuth=1:
// tfAuth=1 is also used by real user-driven Standard / MT4 / Google login tabs.
// The old broad URL query could race with a fresh manual login tab and close it
// immediately after the user clicked Masuk / MetaTrader 4 / Google.
async function bg_closeTransientLoginTabs(extraTabIds) {
const ids = new Set();
try {
  (Array.isArray(extraTabIds) ? extraTabIds : []).forEach((id) => {
    if (id != null && Number.isFinite(Number(id))) ids.add(Number(id));
  });
} catch (e) { }

// Explicit disposable root probes use tfTransientProbe=1. This marker is never
// added to manual authentication tabs, so startup/idle cleanup cannot kill login.
try {
  const marked = await new Promise((resolve) => {
    try {
      chrome.tabs.query({ url: 'https://tradersfamily.id/*tfTransientProbe=1*' }, (tabs) => {
        try { void chrome.runtime.lastError; } catch (e) { }
        resolve(tabs || []);
      });
    } catch (e) { resolve([]); }
  });
  (marked || []).forEach((t) => { if (t && t.id != null) ids.add(Number(t.id)); });
} catch (e) { }

for (const id of Array.from(ids)) {
  try { await bg_removeTab(id); } catch (e) { }
}

// Legacy ID-only state is unsafe across Chrome/browser restarts because a stale
// numeric tab id can later belong to a completely different tab. Remove it only;
// never use it as authority for closing a tab.
try {
  await bg_storageLocalRemove(['tfLoginTransientTabIds']);
} catch (e) {
  try { chrome.storage.local.remove(['tfLoginTransientTabIds'], () => {}); } catch (err) { }
}
}
function bg_waitForTabLoaded(tabId, timeoutMs = 30000) {
return new Promise((resolve) => {
let done = false;
function finish() {
if (done)
return;
done = true;
try {
clearTimeout(timer);
}
catch (e) { }
try {
chrome.tabs.onUpdated.removeListener(listener);
}
catch (e) { }
try {
chrome.tabs.onRemoved.removeListener(removedListener);
}
catch (e) { }
resolve();
}
const timer = setTimeout(() => {
finish();
}, timeoutMs);
function listener(id, changeInfo, tab) {
if (id === tabId && changeInfo && changeInfo.status === 'complete') {
finish();
}
}
function removedListener(id) {
if (id === tabId) {
finish();
}
}
try {
chrome.tabs.onUpdated.addListener(listener);
chrome.tabs.onRemoved.addListener(removedListener);
}
catch (e) { }
try {
chrome.tabs.get(tabId, (tab) => {
if (done)
return;
if (chrome.runtime && chrome.runtime.lastError) {
return;
}
if (tab && tab.status === 'complete') {
finish();
}
});
}
catch (e) {
}
});
}
async function bg_waitForContentScriptReady(tabId, timeoutMs = 12000) {
const start = Date.now();
while (Date.now() - start < timeoutMs) {
try {
const resp = await bg_sendMessage(tabId, { type: 'ping' }, 1500);
if (resp && resp.ok)
return true;
}
catch (e) {
}
await bg_sleep(250);
}
return false;
}
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let bg_myfxbookPriceJob = null;
function bg_storageLocalGet(keys) {
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
function bg_storageLocalSet(obj) {
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
async function bg_scrapeMyfxbookPricesFromTab(tabId) {
const start = Date.now();
const timeoutMs = 20000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const tbl = document.querySelector('table#results.pipCalcResults') || document.querySelector('table#results') || document.querySelector('table.pipCalcResults');
if (!tbl)
return null;
const rows = tbl.querySelectorAll('tbody tr');
if (!rows || !rows.length)
return null;
const out = {};
rows.forEach((tr) => {
const a = tr.querySelector('td.bold a') || tr.querySelector('td a');
let pairTxt = a ? String(a.textContent || '').trim() : '';
pairTxt = pairTxt.replace(/\s+/g, '').toUpperCase();
if (!pairTxt)
return;
const pairKey = pairTxt.replace(/[^A-Z0-9]/g, '');
if (!pairKey)
return;
const priceTd = tr.querySelector('td[id^="price_"]') || (tr.children && tr.children.length > 1 ? tr.children[1] : null);
let v = priceTd ? String(priceTd.textContent || '').trim() : '';
v = v.replace(/\s+/g, '').trim();
if (v)
out[pairKey] = v;
});
if (!out || Object.keys(out).length === 0)
return null;
return { prices: out, rowCount: rows.length };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.prices && typeof payload.prices === 'object') {
return payload;
}
}
catch (e) {
}
await bg_sleep(500);
}
return null;
}
async function bg_scrapeGoldPriceFromTab(tabId) {
const start = Date.now();
const timeoutMs = 25000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const el = document.querySelector('[data-test="instrument-price-last"]');
if (!el)
return null;
let t = String(el.textContent || '').trim();
if (!t)
return null;
t = t.replace(/\s+/g, '');
const m = t.match(/[0-9][0-9.,]*/);
if (!m)
return null;
const price = m[0];
if (!price)
return null;
return { price };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.price)
return String(payload.price);
}
catch (e) {
}
await bg_sleep(600);
}
return null;
}
async function bg_ensureMyfxbookPrices(opts) {
const force = !!(opts && opts.force);
if (bg_myfxbookPriceJob)
return bg_myfxbookPriceJob;
bg_myfxbookPriceJob = (async () => {
const now = Date.now();
const cached = await bg_storageLocalGet([TF_MYFXBOOK_PRICES_AT_KEY]);
const lastAt = cached && cached[TF_MYFXBOOK_PRICES_AT_KEY] ? Number(cached[TF_MYFXBOOK_PRICES_AT_KEY]) : 0;
const ageMs = now - (Number.isFinite(lastAt) ? lastAt : 0);
if (!force && lastAt && ageMs >= 0 && ageMs < 10 * 60 * 1000) {
return { ok: true, skipped: true, ageMs };
}
const url = 'https://id.investing.com/tools/forex-pip-calculator?tfext_investing=1&t=' + now;
let tab = null;
try {
tab = await bg_createTab(url, false);
}
catch (e) {
tab = null;
}
const tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
return { ok: false, error: 'Gagal membuka tab Investing.com.' };
}
let prices = {};
try {
await bg_waitForTabLoaded(tabId, 45000);
await bg_sleep(600);
const scraped = await bg_scrapeMyfxbookPricesFromTab(tabId);
if (!scraped || scraped.error) {
return { ok: false, error: scraped && scraped.error ? scraped.error : 'Gagal membaca tabel Pip Calculator di Investing.com.' };
}
prices = scraped.prices || {};
}
finally {
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
let goldTabId = null;
try {
const goldUrl = 'https://id.investing.com/commodities/gold?tfext_investing=1&t=' + now;
const gtab = await bg_createTab(goldUrl, false);
goldTabId = gtab && gtab.id != null ? gtab.id : null;
if (goldTabId != null) {
await bg_waitForTabLoaded(goldTabId, 45000);
await bg_sleep(800);
const goldPrice = await bg_scrapeGoldPriceFromTab(goldTabId);
if (goldPrice && String(goldPrice).trim()) {
prices['XAUUSD'] = String(goldPrice).trim();
}
}
}
catch (e) {
}
finally {
if (goldTabId != null) {
try {
await bg_removeTab(goldTabId);
}
catch (e) { }
}
}
const at = Date.now();
await bg_storageLocalSet({
[TF_MYFXBOOK_PRICES_KEY]: prices,
[TF_MYFXBOOK_PRICES_AT_KEY]: at
});
return { ok: true, count: Object.keys(prices).length, at };
})().finally(() => {
bg_myfxbookPriceJob = null;
});
return bg_myfxbookPriceJob;
}
function bg_getTabInfo(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(null);
try {
chrome.tabs.get(tabId, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (!t)
return resolve(null);
resolve({
id: t.id,
url: t.url ? String(t.url) : '',
pendingUrl: t.pendingUrl ? String(t.pendingUrl) : '',
status: t.status ? String(t.status) : ''
});
});
}
catch (e) {
resolve(null);
}
});
}
async function bg_waitForTabUrlMatch(tabId, regex, timeoutMs = 8000, pollMs = 250) {
const start = Date.now();
let lastUrl = '';
while (Date.now() - start < timeoutMs) {
const info = await bg_getTabInfo(tabId);
if (!info)
return { matched: false, url: lastUrl };
const u = (info.pendingUrl || info.url || '').trim();
lastUrl = u;
if (u && regex.test(u))
return { matched: true, url: u };
await bg_sleep(pollMs);
}
return { matched: false, url: lastUrl };
}
async function bg_probeRootStateByDom(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
function isVisible(el) {
try {
if (!el)
return false;
const cs = window.getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0'))
return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
const hasBox = r ? (r.width > 0 && r.height > 0) : true;
const hasRects = el.getClientRects ? (el.getClientRects().length > 0) : true;
return !!(hasBox && hasRects);
}
catch (e) {
return false;
}
}
try {
const masukCandidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const daftarCandidates = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/register"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]'),
Array.from(document.querySelectorAll('li.user.user-menu.m a')).find(a => /\bDaftar\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masukEl = masukCandidates.find(isVisible) || masukCandidates[0] || null;
const daftarEl = daftarCandidates.find(isVisible) || daftarCandidates[0] || null;
const profileCandidates = [
document.querySelector('li.x-menu-item-login.reglog a[title="User Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a[title*="Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login.sudah[title="User Profile"]'),
document.querySelector('a.x-btn-navbar-login.sudah[href*="account.tradersfamily.id/profile"]'),
document.querySelector('a.x-btn-navbar-login[title="User Profile"]'),
document.querySelector('li.user.user-menu a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('nav a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('header a[href*="account.tradersfamily.id/profile"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.x-menu-item-login.reglog a, li.user.user-menu a')).find(a => /^(?:User\s*)?Profile$/i.test(String(a.textContent || '').replace(/\s+/g, ' ').trim()))
].filter(Boolean);
const profileEl = profileCandidates.find(isVisible) || profileCandidates[0] || null;
// REV210 — login confirmation accepts either of the two positive markers seen on
// TradersFamily after a real login: Profile/User Profile OR the live Online status.
// The disposable fresh tab remains the authority; stale/open tabs are not consulted.
const onlineCandidates = Array.from(document.querySelectorAll('small')).filter((el) => {
try {
if (!isVisible(el)) return false;
const icon = el.querySelector('i.fa.fa-circle');
if (!icon) return false;
return /^Online$/i.test(String(el.textContent || '').replace(/\s+/g, ' ').trim());
}
catch (e) { return false; }
});
const onlineEl = onlineCandidates[0] || null;
const hasOnlineMarker = !!onlineEl;
const hasVisibleProfile = !!(profileEl && isVisible(profileEl));
const hasVisibleLogout = !!((masukEl && isVisible(masukEl)) || (daftarEl && isVisible(daftarEl)));
// Explicit Masuk/Daftar has highest priority: the fresh page is logged out.
if (hasVisibleLogout)
return 'logged_out';
// A visible Profile/User Profile OR visible Online is sufficient positive evidence.
// This avoids falsely sending an already logged-in user back to Login when the
// Online badge is rendered later, omitted by a responsive layout, or not yet hydrated.
if (hasVisibleProfile || hasOnlineMarker)
return 'logged_in';
// Responsive fallback for elements that exist but have no box in the current viewport.
if (profileEl && !masukEl && !daftarEl)
return 'logged_in';
if ((masukEl || daftarEl) && !profileEl)
return 'logged_out';
return 'unknown';
}
catch (e) {
return 'unknown';
}
}
});
if (injected && injected[0] && typeof injected[0].result === 'string') {
return injected[0].result;
}
}
catch (e) {
}
return 'unknown';
}
async function bg_clickRootMasuk(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
return !r || (r.width > 0 && r.height > 0);
} catch (e) { return false; }
};
const candidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masuk = candidates.find(visible) || candidates[0] || null;
if (!masuk) return false;
masuk.click();
return true;
} catch (e) { return false; }
}
});
return !!(injected && injected[0] && injected[0].result === true);
} catch (e) { return false; }
}
async function bg_isManualAuthActiveForLoginProbe() {
try {
const d = await bg_storageLocalGet(['tfManua
~~~

### context fetch(
~~~js
const bg_isusers_setJobState = new Map();
const bg_isusers_disconnectJobState = new Map();
try {
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}
}
catch (e) {
}
const tf_keepalivePorts = new Set();
const tf_uiPresencePorts = new Set();
let tf_uiPresenceCloseGraceTimer = null;
const TF_UI_PRESENCE_STATE_KEY = 'tfUiPresenceStateV1';
const TF_UI_PRESENCE_LICENSE_API_URL = 'https://tf-license-device-api.wiliejonathan1999.workers.dev/license-check';
const TF_UI_PRESENCE_LICENSE_CREDENTIALS_KEY = 'tfLicenseCredentials';
const TF_UI_PRESENCE_DEVICE_KEY = 'tfLicenseDeviceId';
const TF_UI_PRESENCE_ENDPOINT_KEY = 'tfLicensePresenceEndpointV1';
function bg_sendUiPresenceEventBestEffort(active, eventName) {
try {
chrome.storage.local.get([TF_UI_PRESENCE_LICENSE_CREDENTIALS_KEY, TF_UI_PRESENCE_DEVICE_KEY, TF_UI_PRESENCE_ENDPOINT_KEY], (state) => {
try {
const c = state && state[TF_UI_PRESENCE_LICENSE_CREDENTIALS_KEY] || {};
const email = String(c.email || c.emailOriginal || c.emailCanonical || '').trim().toLowerCase();
const token = String(c.token || '').trim();
const deviceId = String(state && state[TF_UI_PRESENCE_DEVICE_KEY] || '').trim();
const endpoint = String(state && state[TF_UI_PRESENCE_ENDPOINT_KEY] || '').trim();
if (!email || !token) return;
const eventUpper = String(eventName || (active ? 'OPEN' : 'CLOSE')).toUpperCase();
if (endpoint) {
fetch(endpoint, {
method: 'POST', redirect: 'follow', cache: 'no-store', keepalive: active !== true,
headers: { 'Content-Type': 'application/json;charset=UTF-8' },
body: JSON.stringify({
action: 'presence', email, token, deviceId,
uiPresenceActive: active === true, presenceEvent: eventUpper,
clientPage: 'side_panel_background_direct', requestNonce: String(Date.now()) + '-bg-direct-' + Math.random().toString(36).slice(2)
})
}).catch(() => {});
return;
}
// Legacy fallback is OPEN-only. Never send CLOSE through a Worker that may
// strip the presence flags, because that could be misread as a heartbeat.
if (active === true) {
fetch(TF_UI_PRESENCE_LICENSE_API_URL, {
method: 'POST', redirect: 'follow', cache: 'no-store',
headers: { 'Content-Type': 'application/json;charset=UTF-8' },
body: JSON.stringify({
action: 'lookup', email, token, deviceId,
uiPresenceActive: true, presenceEvent: eventUpper,
clientPage: 'side_panel_background', requestNonce: String(Date.now()) + '-bg-presence-' + Math.random().toString(36).slice(2)
})
}).catch(() => {});
}
}
catch (e) { }
});
}
catch (e) { }
}
function bg_publishUiPresenceState(source) {
try {
chrome.storage.local.set({ [TF_UI_PRESENCE_STATE_KEY]: { active: tf_uiPresencePorts.size > 0, updatedAt: Date.now(), source: String(source || '') } }, () => { try { void chrome.runtime.lastError; } catch (e) { } });
}
catch (e) { }
}
bg_publishUiPresenceState('service_worker_boot');
try {
chrome.runtime.onConnect.addListener((port) => {
try {
if (!port)
return;
if (port.name === 'tf_ui_presence') {
const wasEmpty = tf_uiPresencePorts.size === 0;
try { if (tf_uiPresenceCloseGraceTimer) clearTimeout(tf_uiPresenceCloseGraceTimer); } catch (e) { }
tf_uiPresenceCloseGraceTimer = null;
tf_uiPresencePorts.add(port);
bg_publishUiPresenceState('side_panel_connect');
if (wasEmpty) bg_sendUiPresenceEventBestEffort(true, 'OPEN');
try {
port.onMessage.addListener((message) => {
try {
if (!message || message.type !== 'tf_ui_presence_ping') return;
// Receiving a real message keeps the MV3 service worker alive; merely opening
// a long-lived port is not enough on modern Chrome.
bg_publishUiPresenceState('side_panel_ping');
}
catch (e) { }
});
}
catch (e) { }
try {
port.onDisconnect.addListener(() => {
try {
tf_uiPresencePorts.delete(port);
if (tf_uiPresencePorts.size > 0) {
bg_publishUiPresenceState('side_panel_disconnect_other_port_alive');
return;
}
// Do not mark the user OFFLINE on a transient port break caused by an MV3
// service-worker recycle or a quick Side Panel document reload. Give the panel
// a short window to reconnect; a genuine close remains disconnected.
try { if (tf_uiPresenceCloseGraceTimer) clearTimeout(tf_uiPresenceCloseGraceTimer); } catch (e) { }
tf_uiPresenceCloseGraceTimer = setTimeout(() => {
tf_uiPresenceCloseGraceTimer = null;
if (tf_uiPresencePorts.size !== 0) return;
bg_publishUiPresenceState('side_panel_disconnect_confirmed');
bg_sendUiPresenceEventBestEffort(false, 'CLOSE');
}, 3000);
}
catch (e) { }
});
}
catch (e) { }
return;
}
if (port.name === 'tf_keepalive') {
tf_keepalivePorts.add(port);
try {
port.onMessage.addListener((message) => {
try {
if (!message || message.type !== 'tf_keepalive_ping') return;
// Message traffic keeps the service worker alive during long-running jobs.
}
catch (e) { }
});
}
catch (e) { }
try {
port.onDisconnect.addListener(() => { try {
tf_keepalivePorts.delete(port);
}
catch (e) { } });
}
catch (e) { }
return;
}
}
catch (e) { }
});
}
catch (e) { }
const TF_LOGIN_CHECK_ALARM = 'tf_login_check_30m';
let bg_loginProbeJob = null;
let bg_postLoginRootSyncJob = null;

// REV203/207 — after the account login page confirms a successful login, automatically
// perform the same tradersfamily.id navbar check that previously only happened when
// the user manually opened tradersfamily.id. This removes the manual-open requirement:
// Account login -> fresh root page -> Profile/User Profile or Online -> Dashboard.
async function bg_confirmRootAfterAccountLogin(source) {
if (bg_postLoginRootSyncJob)
return bg_postLoginRootSyncJob;
bg_postLoginRootSyncJob = (async () => {
let created = null;
let state = 'unknown';
const src = source ? String(source) : 'post_login';
try {
created = await bg_openTfRootTabFresh(false);
try { await bg_waitForTabLoaded(created.id, 60000); } catch (e) { }
// REV208: allow TradersFamily + the second verification step to finish before
// reading the public-root login state. Never trust a partially rendered page.
try { await bg_sleep(10000); } catch (e) { }
const delays = [0, 2000, 4000, 6000];
for (let attempt = 0; attempt < delays.length; attempt += 1) {
try { if (delays[attempt] > 0) await bg_sleep(delays[attempt]); } catch (e) { }
state = await bg_probeRootStateByDom(created.id);
if (state === 'logged_in' || state === 'logged_out') break;
if (attempt < delays.length - 1) {
try {
await new Promise((resolve) => {
try {
chrome.tabs.reload(created.id, { bypassCache: true }, () => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve();
});
}
catch (e) { resolve(); }
});
}
catch (e) { }
}
}
// REV215: an inconclusive post-login root render is not proof of logout.
// Keep the fresh account-login evidence and let the next probe finish synchronization.
if (state === 'unknown') {
const nowUnknown = Date.now();
try {
await bg_storageLocalSet({
tfRootLoginState: 'unknown',
tfRootLoginStateAt: nowUnknown,
tfForceLoginForm: false,
tfPostLoginRootUnknownAt: nowUnknown,
tfPostLoginRootUnknownSource: src
});
} catch (e) { }
return { ok: true, state: 'unknown', preserved: true };
}
const now = Date.now();
if (state === 'logged_in') {
await bg_storageLocalSet({
tfRootLoginState: 'logged_in',
tfRootLoginStateAt: now,
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: now,
tfLoginConfirmed: true,
tfLoginConfirmedAt: now,
tfEnteredMain: true,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: true,
tfForceLoginForm: false,
tfExplicitLogoutAt: 0,
tfPeriodicLogoutCandidateAt: 0,
tfPostLoginRootConfirmedAt: now,
tfPostLoginRootConfirmedSource: src,
tfLoginError: ''
});
return { ok: true, state: 'logged_in' };
}
// Fresh root navbar remains authoritative. If neither Profile/User Profile nor Online is found after retries,
// keep the Side Panel on Login rather than opening an Offline dashboard.
await bg_storageLocalSet({
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfForceLoginForm: true,
tfShownMainOnceThisLogin: false,
tfPostLoginRootFailedAt: now,
tfPostLoginRootFailedSource: src
});
return { ok: false, state: 'logged_out', error: 'ROOT_LOGIN_MARKER_NOT_FOUND' };
}
catch (e) {
const now = Date.now();
try {
await bg_storageLocalSet({
tfRootLoginState: 'unknown',
tfRootLoginStateAt: now,
tfForceLoginForm: false,
tfPostLoginRootFailedAt: now,
tfPostLoginRootFailedSource: src
});
}
catch (err) { }
return { ok: false, state: 'unknown', error: String(e && e.message ? e.message : e) };
}
finally {
try { if (created && created.id != null) await bg_removeTab(created.id); } catch (e) { }
try { await bg_closeTransientLoginTabs(created && created.id != null ? [created.id] : []); } catch (e) { }
}
})().finally(() => {
bg_postLoginRootSyncJob = null;
});
return bg_postLoginRootSyncJob;
}
function bg_setupLoginCheckAlarm() {
try {
if (!chrome.alarms || !chrome.alarms.create)
return;
chrome.alarms.create(TF_LOGIN_CHECK_ALARM, { periodInMinutes: 30 });
}
catch (e) {
}
}
try {
if (chrome.alarms && chrome.alarms.onAlarm) {
chrome.alarms.onAlarm.addListener((alarm) => {
try {
if (!alarm || alarm.name !== TF_LOGIN_CHECK_ALARM)
return;
bg_runPeriodicLoginProbe('alarm');
}
catch (e) { }
});
}
}
catch (e) { }
try {
bg_setupLoginCheckAlarm();
}
catch (e) { }
chrome.runtime.onInstalled.addListener(() => {
try {
if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
}
}
catch (e) {
console.warn('TF: gagal set side panel behavior', e);
}
try {
bg_setupLoginCheckAlarm();
}
catch (e) { }
});
try {
chrome.runtime.onStartup.addListener(() => {
(async () => {
try { bg_setupLoginCheckAlarm(); } catch (e) { }
// REV217: a browser/OS restart invalidates any unfinished auth transaction from
// the previous Chrome session. Clear only transient auth-flow state; preserve the
// actual logged-in/session/profile state so a valid website session can recover.
try {
await bg_storageLocalSet({
tfManualAuthActive: false,
tfManualAuthMode: '',
tfManualAuthToken: '',
tfManualAuthStartedAt: 0,
tfManualAuthStartupResetAt: Date.now()
});
} catch (e) { }
try {
await bg_storageLocalRemove(['tfPendingLogin','tfPendingGoogleLogin','tfCaptchaNeeded','tfCaptchaSolved','tfLoginError','tfLoginTransientTabIds']);
} catch (e) { }
// Close only explicitly disposable probe tabs restored by Chrome. Manual auth
// tabs never carry tfTransientProbe=1 and therefore cannot be closed here.
try { await bg_closeTransientLoginTabs([]); } catch (e) { }
try { await bg_runPeriodicLoginProbe('startup'); } catch (e) { }
})();
});
}
catch (e) { }
async function bg_openTfRootTabFresh(makeActive = false) {
const url = 'https://tradersfamily.id/?tfext=1&tfTransientProbe=1&ts=' + Date.now();
return new Promise((resolve, reject) => {
try {
chrome.tabs.create({ url, active: !!makeActive }, (tab) => {
if (chrome.runtime.lastError)
return reject(chrome.runtime.lastError);
try {
chrome.storage.local.set({ tfLastRootTabId: tab.id, tfLastRootOpenAt: Date.now() }, () => { });
}
catch (e) { }
resolve(tab);
});
}
catch (e) {
reject(e);
}
});
}
function bg_sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}
let bg_globalScanChain = Promise.resolve();
function bg_runExclusive(taskFn) {
const run = () => Promise.resolve().then(taskFn);
const p = bg_globalScanChain.then(run, run);
bg_globalScanChain = p.catch(() => { });
return p;
}
function bg_sendMessageWithTimeout(tabId, message, timeoutMs) {
const ms = (typeof timeoutMs === 'number' && timeoutMs > 0) ? timeoutMs : 60000;
return new Promise((resolve) => {
let settled = false;
const timer = setTimeout(() => {
if (settled)
return;
settled = true;
try {
resolve(null);
}
catch (e) { }
}, ms);
try {
chrome.tabs.sendMessage(tabId, message, (resp) => {
if (settled)
return;
settled = true;
try {
clearTimeout(timer);
}
catch (e) { }
try {
if (chrome.runtime && chrome.runtime.lastError) {
resolve({ ok: false, error: chrome.runtime.lastError.message || String(chrome.runtime.lastError) });
return;
}
}
catch (e) { }
resolve(resp);
});
}
catch (err) {
if (settled)
return;
settled = true;
try {
clearTimeout(timer);
}
catch (e) { }
resolve({ ok: false, error: (err && err.message) ? err.message : String(err) });
}
});
}
function bg_parseMonthKey(monthKey) {
try {
const m = String(monthKey || '').trim().match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!y || !mo || mo < 1 || mo > 12)
return null;
return { y, mo };
}
catch (e) {
return null;
}
}
function bg_monthKeyToDateStart(monthKey) {
const p = bg_parseMonthKey(monthKey);
if (!p)
return null;
const d = new Date(p.y, p.mo - 1, 1);
d.setHours(0, 0, 0, 0);
return d;
}
function bg_dateToMonthKey(d) {
try {
const y = d.getFullYear();
const m = d.getMonth() + 1;
return String(y).padStart(4, '0') + '-' + String(m).padStart(2, '0');
}
catch (e) {
return null;
}
}
function bg_addMonthsDate(d, delta) {
const out = new Date(d.getTime());
out.setDate(1);
out.setMonth(out.getMonth() + (delta || 0));
out.setHours(0, 0, 0, 0);
return out;
}
function bg_computeBatchMonthKeys(latestMonthKey, offsetMonths) {
const base = bg_monthKeyToDateStart(latestMonthKey);
if (!base)
return [];
const start = bg_addMonthsDate(base, -(offsetMonths || 0));
const mk1 = bg_dateToMonthKey(start);
const mk2 = bg_dateToMonthKey(bg_addMonthsDate(start, 1));
return [mk1, mk2].filter(Boolean);
}
async function bg_getExpectedSignalsByMonth(storageAnalystName) {
return new Promise((resolve) => {
try {
chrome.storage.local.get(['tfMonthlyStats'], (data) => {
try {
void chrom
~~~

### context Investing.com
~~~js
;
} catch (e) {
  try { chrome.storage.local.remove(['tfLoginTransientTabIds'], () => {}); } catch (err) { }
}
}
function bg_waitForTabLoaded(tabId, timeoutMs = 30000) {
return new Promise((resolve) => {
let done = false;
function finish() {
if (done)
return;
done = true;
try {
clearTimeout(timer);
}
catch (e) { }
try {
chrome.tabs.onUpdated.removeListener(listener);
}
catch (e) { }
try {
chrome.tabs.onRemoved.removeListener(removedListener);
}
catch (e) { }
resolve();
}
const timer = setTimeout(() => {
finish();
}, timeoutMs);
function listener(id, changeInfo, tab) {
if (id === tabId && changeInfo && changeInfo.status === 'complete') {
finish();
}
}
function removedListener(id) {
if (id === tabId) {
finish();
}
}
try {
chrome.tabs.onUpdated.addListener(listener);
chrome.tabs.onRemoved.addListener(removedListener);
}
catch (e) { }
try {
chrome.tabs.get(tabId, (tab) => {
if (done)
return;
if (chrome.runtime && chrome.runtime.lastError) {
return;
}
if (tab && tab.status === 'complete') {
finish();
}
});
}
catch (e) {
}
});
}
async function bg_waitForContentScriptReady(tabId, timeoutMs = 12000) {
const start = Date.now();
while (Date.now() - start < timeoutMs) {
try {
const resp = await bg_sendMessage(tabId, { type: 'ping' }, 1500);
if (resp && resp.ok)
return true;
}
catch (e) {
}
await bg_sleep(250);
}
return false;
}
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let bg_myfxbookPriceJob = null;
function bg_storageLocalGet(keys) {
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
function bg_storageLocalSet(obj) {
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
async function bg_scrapeMyfxbookPricesFromTab(tabId) {
const start = Date.now();
const timeoutMs = 20000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const tbl = document.querySelector('table#results.pipCalcResults') || document.querySelector('table#results') || document.querySelector('table.pipCalcResults');
if (!tbl)
return null;
const rows = tbl.querySelectorAll('tbody tr');
if (!rows || !rows.length)
return null;
const out = {};
rows.forEach((tr) => {
const a = tr.querySelector('td.bold a') || tr.querySelector('td a');
let pairTxt = a ? String(a.textContent || '').trim() : '';
pairTxt = pairTxt.replace(/\s+/g, '').toUpperCase();
if (!pairTxt)
return;
const pairKey = pairTxt.replace(/[^A-Z0-9]/g, '');
if (!pairKey)
return;
const priceTd = tr.querySelector('td[id^="price_"]') || (tr.children && tr.children.length > 1 ? tr.children[1] : null);
let v = priceTd ? String(priceTd.textContent || '').trim() : '';
v = v.replace(/\s+/g, '').trim();
if (v)
out[pairKey] = v;
});
if (!out || Object.keys(out).length === 0)
return null;
return { prices: out, rowCount: rows.length };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.prices && typeof payload.prices === 'object') {
return payload;
}
}
catch (e) {
}
await bg_sleep(500);
}
return null;
}
async function bg_scrapeGoldPriceFromTab(tabId) {
const start = Date.now();
const timeoutMs = 25000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const el = document.querySelector('[data-test="instrument-price-last"]');
if (!el)
return null;
let t = String(el.textContent || '').trim();
if (!t)
return null;
t = t.replace(/\s+/g, '');
const m = t.match(/[0-9][0-9.,]*/);
if (!m)
return null;
const price = m[0];
if (!price)
return null;
return { price };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.price)
return String(payload.price);
}
catch (e) {
}
await bg_sleep(600);
}
return null;
}
async function bg_ensureMyfxbookPrices(opts) {
const force = !!(opts && opts.force);
if (bg_myfxbookPriceJob)
return bg_myfxbookPriceJob;
bg_myfxbookPriceJob = (async () => {
const now = Date.now();
const cached = await bg_storageLocalGet([TF_MYFXBOOK_PRICES_AT_KEY]);
const lastAt = cached && cached[TF_MYFXBOOK_PRICES_AT_KEY] ? Number(cached[TF_MYFXBOOK_PRICES_AT_KEY]) : 0;
const ageMs = now - (Number.isFinite(lastAt) ? lastAt : 0);
if (!force && lastAt && ageMs >= 0 && ageMs < 10 * 60 * 1000) {
return { ok: true, skipped: true, ageMs };
}
const url = 'https://id.investing.com/tools/forex-pip-calculator?tfext_investing=1&t=' + now;
let tab = null;
try {
tab = await bg_createTab(url, false);
}
catch (e) {
tab = null;
}
const tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
return { ok: false, error: 'Gagal membuka tab Investing.com.' };
}
let prices = {};
try {
await bg_waitForTabLoaded(tabId, 45000);
await bg_sleep(600);
const scraped = await bg_scrapeMyfxbookPricesFromTab(tabId);
if (!scraped || scraped.error) {
return { ok: false, error: scraped && scraped.error ? scraped.error : 'Gagal membaca tabel Pip Calculator di Investing.com.' };
}
prices = scraped.prices || {};
}
finally {
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
let goldTabId = null;
try {
const goldUrl = 'https://id.investing.com/commodities/gold?tfext_investing=1&t=' + now;
const gtab = await bg_createTab(goldUrl, false);
goldTabId = gtab && gtab.id != null ? gtab.id : null;
if (goldTabId != null) {
await bg_waitForTabLoaded(goldTabId, 45000);
await bg_sleep(800);
const goldPrice = await bg_scrapeGoldPriceFromTab(goldTabId);
if (goldPrice && String(goldPrice).trim()) {
prices['XAUUSD'] = String(goldPrice).trim();
}
}
}
catch (e) {
}
finally {
if (goldTabId != null) {
try {
await bg_removeTab(goldTabId);
}
catch (e) { }
}
}
const at = Date.now();
await bg_storageLocalSet({
[TF_MYFXBOOK_PRICES_KEY]: prices,
[TF_MYFXBOOK_PRICES_AT_KEY]: at
});
return { ok: true, count: Object.keys(prices).length, at };
})().finally(() => {
bg_myfxbookPriceJob = null;
});
return bg_myfxbookPriceJob;
}
function bg_getTabInfo(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(null);
try {
chrome.tabs.get(tabId, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (!t)
return resolve(null);
resolve({
id: t.id,
url: t.url ? String(t.url) : '',
pendingUrl: t.pendingUrl ? String(t.pendingUrl) : '',
status: t.status ? String(t.status) : ''
});
});
}
catch (e) {
resolve(null);
}
});
}
async function bg_waitForTabUrlMatch(tabId, regex, timeoutMs = 8000, pollMs = 250) {
const start = Date.now();
let lastUrl = '';
while (Date.now() - start < timeoutMs) {
const info = await bg_getTabInfo(tabId);
if (!info)
return { matched: false, url: lastUrl };
const u = (info.pendingUrl || info.url || '').trim();
lastUrl = u;
if (u && regex.test(u))
return { matched: true, url: u };
await bg_sleep(pollMs);
}
return { matched: false, url: lastUrl };
}
async function bg_probeRootStateByDom(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
function isVisible(el) {
try {
if (!el)
return false;
const cs = window.getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0'))
return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
const hasBox = r ? (r.width > 0 && r.height > 0) : true;
const hasRects = el.getClientRects ? (el.getClientRects().length > 0) : true;
return !!(hasBox && hasRects);
}
catch (e) {
return false;
}
}
try {
const masukCandidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const daftarCandidates = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/register"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]'),
Array.from(document.querySelectorAll('li.user.user-menu.m a')).find(a => /\bDaftar\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masukEl = masukCandidates.find(isVisible) || masukCandidates[0] || null;
const daftarEl = daftarCandidates.find(isVisible) || daftarCandidates[0] || null;
const profileCandidates = [
document.querySelector('li.x-menu-item-login.reglog a[title="User Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a[title*="Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login.sudah[title="User Profile"]'),
document.querySelector('a.x-btn-navbar-login.sudah[href*="account.tradersfamily.id/profile"]'),
document.querySelector('a.x-btn-navbar-login[title="User Profile"]'),
document.querySelector('li.user.user-menu a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('nav a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('header a[href*="account.tradersfamily.id/profile"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.x-menu-item-login.reglog a, li.user.user-menu a')).find(a => /^(?:User\s*)?Profile$/i.test(String(a.textContent || '').replace(/\s+/g, ' ').trim()))
].filter(Boolean);
const profileEl = profileCandidates.find(isVisible) || profileCandidates[0] || null;
// REV210 — login confirmation accepts either of the two positive markers seen on
// TradersFamily after a real login: Profile/User Profile OR the live Online status.
// The disposable fresh tab remains the authority; stale/open tabs are not consulted.
const onlineCandidates = Array.from(document.querySelectorAll('small')).filter((el) => {
try {
if (!isVisible(el)) return false;
const icon = el.querySelector('i.fa.fa-circle');
if (!icon) return false;
return /^Online$/i.test(String(el.textContent || '').replace(/\s+/g, ' ').trim());
}
catch (e) { return false; }
});
const onlineEl = onlineCandidates[0] || null;
const hasOnlineMarker = !!onlineEl;
const hasVisibleProfile = !!(profileEl && isVisible(profileEl));
const hasVisibleLogout = !!((masukEl && isVisible(masukEl)) || (daftarEl && isVisible(daftarEl)));
// Explicit Masuk/Daftar has highest priority: the fresh page is logged out.
if (hasVisibleLogout)
return 'logged_out';
// A visible Profile/User Profile OR visible Online is sufficient positive evidence.
// This avoids falsely sending an already logged-in user back to Login when the
// Online badge is rendered later, omitted by a responsive layout, or not yet hydrated.
if (hasVisibleProfile || hasOnlineMarker)
return 'logged_in';
// Responsive fallback for elements that exist but have no box in the current viewport.
if (profileEl && !masukEl && !daftarEl)
return 'logged_in';
if ((masukEl || daftarEl) && !profileEl)
return 'logged_out';
return 'unknown';
}
catch (e) {
return 'unknown';
}
}
});
if (injected && injected[0] && typeof injected[0].result === 'string') {
return injected[0].result;
}
}
catch (e) {
}
return 'unknown';
}
async function bg_clickRootMasuk(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
return !r || (r.width > 0 && r.height > 0);
} catch (e) { return false; }
};
const candidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masuk = candidates.find(visible) || candidates[0] || null;
if (!masuk) return false;
masuk.click();
return true;
} catch (e) { return false; }
}
});
return !!(injected && injected[0] && injected[0].result === true);
} catch (e) { return false; }
}
async function bg_isManualAuthActiveForLoginProbe() {
try {
const d = await bg_storageLocalGet(['tfManualAuthActive', 'tfManualAuthStartedAt', 'tfPendingLogin', 'tfPendingGoogleLogin']);
if (!d || d.tfManualAuthActive !== true)
return false;
const startedAt = Number(d.tfManualAuthStartedAt || 0);
// A manual auth flow should never be interrupted by the periodic health checker.
// Treat it as active for up to 10 minutes; startup cleanup clears stale state.
if (startedAt > 0 && Date.now() - startedAt >= 0 && Date.now() - startedAt < 10 * 60 * 1000)
return true;
if (d.tfPendingLogin || d.tfPendingGoogleLogin)
return true;
return false;
}
catch (e) { return false; }
}

async function bg_isScanActiveForLoginProbe() {
try {
if (tf_batchScanState && tf_batchScanState.active && !tf_batchScanState.stopRequested)
return true;
}
catch (e) { }
try {
const stored = await bg_storageLocalGet(['tfScanInProgress', 'tfActiveScanHeartbeatAt', 'tfActiveScanProgressAt']);
if (!stored || stored.tfScanInProgress !== true)
return false;
const now = Date.now();
const heartbeatAt = Number(stored.tfActiveScanHeartbeatAt || 0);
const progressAt = Number(stored.tfActiveScanProgressAt || 0);
// A live heartbeat/progress proves that a long batch is still working.
// Even when no heartbeat has been written yet, tfScanInProgress itself is enough
// to defer a periodic auth probe for the duration of the active scan.
if ((heartbeatAt > 0 && now - heartbeatAt < 120000) || (progressAt > 0 && now - progressAt < 120000))
return true;
return true;
}
catch (e) { return false; }
}
// REV215 — secondary account-session verifier for idle periodic checks.
// The public tradersfamily.id root can transiently show Masuk/Daftar even when the
// authenticated account session is still valid. Verify the protected account area
// before treating a root logout marker as meaningful. This helper NEVER changes UI state.
async function bg_verifyAccountSessionByFetch() {
let controller = null;
let timeout = null;
try {
const url = 'https://account.tradersfamily.id/channels/?tfext_periodic_verify=1&ts=' + Date.now();
controller = new AbortController();
timeout = setTimeout(() => { try { controller.abort(); } catch (e) { } }, 12000);
const resp = await fetch(url, {
method: 'GET',
credentials: 'include',
cache: 'no-store',
redirect: 'follow',
headers: { 'Cache-Control': 'no-cache' },
signal: controller.signal
});
if (timeout) { clearTimeout(timeout); timeout = null; }
const finalUrl = String(resp && resp.url || '');
let body = '';
try { body = String(await resp.text()).slice(0, 260000); } catch (e) { }
const loginByUrl = /\/login(?:mt)?\/?(?:$|[?#])/i.test(finalUrl);
const loginByForm = /id=["'](?:logname|logpass|btn-signin)["']/i.test(body);
const loginByMessage = /Silahkan\s*login\s*untuk\s*mengakses/i.test(body);
if (loginByUrl || loginByForm || loginByMessage)
return { state: 'logged_out', finalUrl, httpStatus: Number(resp && resp.status || 0) };
if (resp && resp.ok)
return { state: 'logged_in', finalUrl, httpStatus: Number(resp.status || 0) };
return { state: 'unknown', finalUrl, httpStatus: Number(resp && resp.status || 0) };
}
catch (e) {
try { if (timeout) clearTimeout(timeout); } catch (err) { }
return { state: 'unknown', error: String(e && e.message ? e.message : e) };
}
}

// REV368 — strict preflight used before Update.
// Do not trust already-open TradersFamily tabs here: their rendered DOM can be stale
// after the server session has expired. The authoritative first check is a fresh,
// no-cache authenticated request to the protected account area. Only if that request
// is inconclusive do we open a disposable cache-busted probe tab.
async function bg_refreshOpenTradersFamilyTabsAfterStrictLogout() {
try {
const tabs = await chrome.tabs.
~~~

### context myfxbook
~~~js
owId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_getActiveTabId() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
const id = (tabs && tabs[0] && tabs[0].id != null) ? tabs[0].id : null;
resolve(id);
});
}
catch (e) {
resolve(null);
}
});
}
function bg_activateTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.update(tabId, { active: true }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
function bg_queryTabsByUrl(urlOrPattern) {
return new Promise((resolve) => {
try {
chrome.tabs.query({ url: urlOrPattern }, (tabs) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve(tabs || []);
});
}
catch (e) {
resolve([]);
}
});
}
function bg_reloadTab(tabId, bypassCache = true) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(false);
try {
chrome.tabs.reload(tabId, { bypassCache: !!bypassCache }, () => {
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
async function bg_openOrReloadDashboard(opts) {
const activate = !!(opts && opts.activate);
const dashUrl = chrome.runtime.getURL('dashboard.html');
const existing = await bg_queryTabsByUrl(dashUrl + '*');
if (existing && existing.length && existing[0].id != null) {
const t = existing[0];
await bg_reloadTab(t.id, true);
if (activate)
await bg_activateTab(t.id);
return { reused: true, tabId: t.id };
}
const created = await bg_createTab(dashUrl, activate);
return { reused: false, tabId: (created && created.id != null) ? created.id : null };
}
function bg_removeTab(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve();
try {
chrome.tabs.remove(tabId, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
// REV217 — close ONLY tabs explicitly marked as disposable probes.
// Never close account.tradersfamily.id URLs merely because they contain tfAuth=1:
// tfAuth=1 is also used by real user-driven Standard / MT4 / Google login tabs.
// The old broad URL query could race with a fresh manual login tab and close it
// immediately after the user clicked Masuk / MetaTrader 4 / Google.
async function bg_closeTransientLoginTabs(extraTabIds) {
const ids = new Set();
try {
  (Array.isArray(extraTabIds) ? extraTabIds : []).forEach((id) => {
    if (id != null && Number.isFinite(Number(id))) ids.add(Number(id));
  });
} catch (e) { }

// Explicit disposable root probes use tfTransientProbe=1. This marker is never
// added to manual authentication tabs, so startup/idle cleanup cannot kill login.
try {
  const marked = await new Promise((resolve) => {
    try {
      chrome.tabs.query({ url: 'https://tradersfamily.id/*tfTransientProbe=1*' }, (tabs) => {
        try { void chrome.runtime.lastError; } catch (e) { }
        resolve(tabs || []);
      });
    } catch (e) { resolve([]); }
  });
  (marked || []).forEach((t) => { if (t && t.id != null) ids.add(Number(t.id)); });
} catch (e) { }

for (const id of Array.from(ids)) {
  try { await bg_removeTab(id); } catch (e) { }
}

// Legacy ID-only state is unsafe across Chrome/browser restarts because a stale
// numeric tab id can later belong to a completely different tab. Remove it only;
// never use it as authority for closing a tab.
try {
  await bg_storageLocalRemove(['tfLoginTransientTabIds']);
} catch (e) {
  try { chrome.storage.local.remove(['tfLoginTransientTabIds'], () => {}); } catch (err) { }
}
}
function bg_waitForTabLoaded(tabId, timeoutMs = 30000) {
return new Promise((resolve) => {
let done = false;
function finish() {
if (done)
return;
done = true;
try {
clearTimeout(timer);
}
catch (e) { }
try {
chrome.tabs.onUpdated.removeListener(listener);
}
catch (e) { }
try {
chrome.tabs.onRemoved.removeListener(removedListener);
}
catch (e) { }
resolve();
}
const timer = setTimeout(() => {
finish();
}, timeoutMs);
function listener(id, changeInfo, tab) {
if (id === tabId && changeInfo && changeInfo.status === 'complete') {
finish();
}
}
function removedListener(id) {
if (id === tabId) {
finish();
}
}
try {
chrome.tabs.onUpdated.addListener(listener);
chrome.tabs.onRemoved.addListener(removedListener);
}
catch (e) { }
try {
chrome.tabs.get(tabId, (tab) => {
if (done)
return;
if (chrome.runtime && chrome.runtime.lastError) {
return;
}
if (tab && tab.status === 'complete') {
finish();
}
});
}
catch (e) {
}
});
}
async function bg_waitForContentScriptReady(tabId, timeoutMs = 12000) {
const start = Date.now();
while (Date.now() - start < timeoutMs) {
try {
const resp = await bg_sendMessage(tabId, { type: 'ping' }, 1500);
if (resp && resp.ok)
return true;
}
catch (e) {
}
await bg_sleep(250);
}
return false;
}
const TF_MYFXBOOK_PRICES_KEY = 'tfMyfxbookPrices';
const TF_MYFXBOOK_PRICES_AT_KEY = 'tfMyfxbookPricesAt';
let bg_myfxbookPriceJob = null;
function bg_storageLocalGet(keys) {
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
function bg_storageLocalSet(obj) {
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
async function bg_scrapeMyfxbookPricesFromTab(tabId) {
const start = Date.now();
const timeoutMs = 20000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const tbl = document.querySelector('table#results.pipCalcResults') || document.querySelector('table#results') || document.querySelector('table.pipCalcResults');
if (!tbl)
return null;
const rows = tbl.querySelectorAll('tbody tr');
if (!rows || !rows.length)
return null;
const out = {};
rows.forEach((tr) => {
const a = tr.querySelector('td.bold a') || tr.querySelector('td a');
let pairTxt = a ? String(a.textContent || '').trim() : '';
pairTxt = pairTxt.replace(/\s+/g, '').toUpperCase();
if (!pairTxt)
return;
const pairKey = pairTxt.replace(/[^A-Z0-9]/g, '');
if (!pairKey)
return;
const priceTd = tr.querySelector('td[id^="price_"]') || (tr.children && tr.children.length > 1 ? tr.children[1] : null);
let v = priceTd ? String(priceTd.textContent || '').trim() : '';
v = v.replace(/\s+/g, '').trim();
if (v)
out[pairKey] = v;
});
if (!out || Object.keys(out).length === 0)
return null;
return { prices: out, rowCount: rows.length };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.prices && typeof payload.prices === 'object') {
return payload;
}
}
catch (e) {
}
await bg_sleep(500);
}
return null;
}
async function bg_scrapeGoldPriceFromTab(tabId) {
const start = Date.now();
const timeoutMs = 25000;
while (Date.now() - start < timeoutMs) {
try {
const resArr = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const el = document.querySelector('[data-test="instrument-price-last"]');
if (!el)
return null;
let t = String(el.textContent || '').trim();
if (!t)
return null;
t = t.replace(/\s+/g, '');
const m = t.match(/[0-9][0-9.,]*/);
if (!m)
return null;
const price = m[0];
if (!price)
return null;
return { price };
}
catch (e) {
return { error: String(e) };
}
}
});
const payload = resArr && resArr[0] ? resArr[0].result : null;
if (payload && payload.price)
return String(payload.price);
}
catch (e) {
}
await bg_sleep(600);
}
return null;
}
async function bg_ensureMyfxbookPrices(opts) {
const force = !!(opts && opts.force);
if (bg_myfxbookPriceJob)
return bg_myfxbookPriceJob;
bg_myfxbookPriceJob = (async () => {
const now = Date.now();
const cached = await bg_storageLocalGet([TF_MYFXBOOK_PRICES_AT_KEY]);
const lastAt = cached && cached[TF_MYFXBOOK_PRICES_AT_KEY] ? Number(cached[TF_MYFXBOOK_PRICES_AT_KEY]) : 0;
const ageMs = now - (Number.isFinite(lastAt) ? lastAt : 0);
if (!force && lastAt && ageMs >= 0 && ageMs < 10 * 60 * 1000) {
return { ok: true, skipped: true, ageMs };
}
const url = 'https://id.investing.com/tools/forex-pip-calculator?tfext_investing=1&t=' + now;
let tab = null;
try {
tab = await bg_createTab(url, false);
}
catch (e) {
tab = null;
}
const tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
return { ok: false, error: 'Gagal membuka tab Investing.com.' };
}
let prices = {};
try {
await bg_waitForTabLoaded(tabId, 45000);
await bg_sleep(600);
const scraped = await bg_scrapeMyfxbookPricesFromTab(tabId);
if (!scraped || scraped.error) {
return { ok: false, error: scraped && scraped.error ? scraped.error : 'Gagal membaca tabel Pip Calculator di Investing.com.' };
}
prices = scraped.prices || {};
}
finally {
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
let goldTabId = null;
try {
const goldUrl = 'https://id.investing.com/commodities/gold?tfext_investing=1&t=' + now;
const gtab = await bg_createTab(goldUrl, false);
goldTabId = gtab && gtab.id != null ? gtab.id : null;
if (goldTabId != null) {
await bg_waitForTabLoaded(goldTabId, 45000);
await bg_sleep(800);
const goldPrice = await bg_scrapeGoldPriceFromTab(goldTabId);
if (goldPrice && String(goldPrice).trim()) {
prices['XAUUSD'] = String(goldPrice).trim();
}
}
}
catch (e) {
}
finally {
if (goldTabId != null) {
try {
await bg_removeTab(goldTabId);
}
catch (e) { }
}
}
const at = Date.now();
await bg_storageLocalSet({
[TF_MYFXBOOK_PRICES_KEY]: prices,
[TF_MYFXBOOK_PRICES_AT_KEY]: at
});
return { ok: true, count: Object.keys(prices).length, at };
})().finally(() => {
bg_myfxbookPriceJob = null;
});
return bg_myfxbookPriceJob;
}
function bg_getTabInfo(tabId) {
return new Promise((resolve) => {
if (tabId == null)
return resolve(null);
try {
chrome.tabs.get(tabId, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (!t)
return resolve(null);
resolve({
id: t.id,
url: t.url ? String(t.url) : '',
pendingUrl: t.pendingUrl ? String(t.pendingUrl) : '',
status: t.status ? String(t.status) : ''
});
});
}
catch (e) {
resolve(null);
}
});
}
async function bg_waitForTabUrlMatch(tabId, regex, timeoutMs = 8000, pollMs = 250) {
const start = Date.now();
let lastUrl = '';
while (Date.now() - start < timeoutMs) {
const info = await bg_getTabInfo(tabId);
if (!info)
return { matched: false, url: lastUrl };
const u = (info.pendingUrl || info.url || '').trim();
lastUrl = u;
if (u && regex.test(u))
return { matched: true, url: u };
await bg_sleep(pollMs);
}
return { matched: false, url: lastUrl };
}
async function bg_probeRootStateByDom(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
function isVisible(el) {
try {
if (!el)
return false;
const cs = window.getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0'))
return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
const hasBox = r ? (r.width > 0 && r.height > 0) : true;
const hasRects = el.getClientRects ? (el.getClientRects().length > 0) : true;
return !!(hasBox && hasRects);
}
catch (e) {
return false;
}
}
try {
const masukCandidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const daftarCandidates = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/register"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]'),
Array.from(document.querySelectorAll('li.user.user-menu.m a')).find(a => /\bDaftar\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masukEl = masukCandidates.find(isVisible) || masukCandidates[0] || null;
const daftarEl = daftarCandidates.find(isVisible) || daftarCandidates[0] || null;
const profileCandidates = [
document.querySelector('li.x-menu-item-login.reglog a[title="User Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a[title*="Profile"]'),
document.querySelector('li.x-menu-item-login.reglog a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login.sudah[title="User Profile"]'),
document.querySelector('a.x-btn-navbar-login.sudah[href*="account.tradersfamily.id/profile"]'),
document.querySelector('a.x-btn-navbar-login[title="User Profile"]'),
document.querySelector('li.user.user-menu a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('nav a[href*="account.tradersfamily.id/profile"]'),
document.querySelector('header a[href*="account.tradersfamily.id/profile"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.x-menu-item-login.reglog a, li.user.user-menu a')).find(a => /^(?:User\s*)?Profile$/i.test(String(a.textContent || '').replace(/\s+/g, ' ').trim()))
].filter(Boolean);
const profileEl = profileCandidates.find(isVisible) || profileCandidates[0] || null;
// REV210 — login confirmation accepts either of the two positive markers seen on
// TradersFamily after a real login: Profile/User Profile OR the live Online status.
// The disposable fresh tab remains the authority; stale/open tabs are not consulted.
const onlineCandidates = Array.from(document.querySelectorAll('small')).filter((el) => {
try {
if (!isVisible(el)) return false;
const icon = el.querySelector('i.fa.fa-circle');
if (!icon) return false;
return /^Online$/i.test(String(el.textContent || '').replace(/\s+/g, ' ').trim());
}
catch (e) { return false; }
});
const onlineEl = onlineCandidates[0] || null;
const hasOnlineMarker = !!onlineEl;
const hasVisibleProfile = !!(profileEl && isVisible(profileEl));
const hasVisibleLogout = !!((masukEl && isVisible(masukEl)) || (daftarEl && isVisible(daftarEl)));
// Explicit Masuk/Daftar has highest priority: the fresh page is logged out.
if (hasVisibleLogout)
return 'logged_out';
// A visible Profile/User Profile OR visible Online is sufficient positive evidence.
// This avoids falsely sending an already logged-in user back to Login when the
// Online badge is rendered later, omitted by a responsive layout, or not yet hydrated.
if (hasVisibleProfile || hasOnlineMarker)
return 'logged_in';
// Responsive fallback for elements that exist but have no box in the current viewport.
if (profileEl && !masukEl && !daftarEl)
return 'logged_in';
if ((masukEl || daftarEl) && !profileEl)
return 'logged_out';
return 'unknown';
}
catch (e) {
return 'unknown';
}
}
});
if (injected && injected[0] && typeof injected[0].result === 'string') {
return injected[0].result;
}
}
catch (e) {
}
return 'unknown';
}
async function bg_clickRootMasuk(tabId) {
try {
const injected = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
try {
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect ? el.getBoundingClientRect() : null;
return !r || (r.width > 0 && r.height > 0);
} catch (e) { return false; }
};
const candidates = [
document.querySelector('li.x-menu-item-login.remasuk a[title="Masuk"]'),
document.querySelector('li.x-menu-item-login.remasuk a.x-btn-navbar-login'),
document.querySelector('a.x-btn-navbar-login[title="Masuk"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('li.user.user-menu.m a[href*="account.tradersfamily.id/login"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
Array.from(document.querySelectorAll('a.x-btn-navbar-login, li.user.user-menu.m a')).find(a => /\bMasuk\b/i.test((a.textContent || '').trim()))
].filter(Boolean);
const masuk = candidates.find(visible) || candidates[0] || null;
if (!masuk) return false;
masuk.click();
return true;
} catch (e) { return false; }
}
});
return !!(injected && injected[0] && injected[0].result === true);
} catch (e) { return false; }
}
async function bg_isManualAuthActiveForLoginProbe() {
try {
const d = await bg_storageLocalGet(['tfManualAuthActive', 'tfManualAuthStartedAt', 'tfPendingLogin', 'tfPendingGoogleLogin']);
if (!d || d.tfManualAuthA
~~~
## 894f18e8a37bd7c6.js
Functions: tf_applyLatestPriceCacheAndRefreshUi, tf_formatMyfxbookPrice, tf_getPriceNum, tf_initDashboardMainAfterPrice, tf_isInvestingPriceReadyNow, tf_isMyfxbookPriceLoading, tf_isignalUsers_getPremiumPrice, tf_parseMyfxbookNumber, tf_refreshMyfxbookPricesForce, tf_schedulePriceDependentUiRefresh, tf_setRefreshPriceLinkLoading, tf_setWaitPriceMode, tf_togglePriceDependentHeaderSpinners, tf_waitForPriceThenInitMain

### tf_applyLatestPriceCacheAndRefreshUi
~~~js
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
~~~

### tf_formatMyfxbookPrice
~~~js
function tf_formatMyfxbookPrice(raw) {
if (raw == null)
return '-';
const s = String(raw).trim();
if (!s)
return '-';
return s;
}
~~~

### tf_getPriceNum
~~~js
function tf_getPriceNum(pair, priceMap) {
if (!pair || !priceMap)
return null;
const v = priceMap[String(pair).toUpperCase()];
return tf_parseMyfxbookNumber(v);
}
~~~

### tf_initDashboardMainAfterPrice
~~~js
function tf_initDashboardMainAfterPrice() {
try {
if (__tfDashboardMainReady)
return;
__tfDashboardMainReady = true;
tf_setWaitPriceMode(false);
buildMonthlyTableSkeleton();
setupAnalystTickerFilter();
setupHistoryColumnFilter();
setupBalanceAndRiskControls();
setupHistoryForm();
setupHistoryPdfExportButton();
setupEquityCurveInteractions();
setupEquityChartModeSelector();
setupEquityMetricSelector();
setupRiskModeSelector();
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
renderSummaryTable();
recomputeHistoryRows();
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
~~~

### tf_isInvestingPriceReadyNow
~~~js
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
~~~

### tf_isMyfxbookPriceLoading
~~~js
function tf_isMyfxbookPriceLoading() {
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
~~~

### tf_isignalUsers_getPremiumPrice
~~~js
function tf_isignalUsers_getPremiumPrice() {
return 'Rp299.000';
}
~~~

### tf_parseMyfxbookNumber
~~~js
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
~~~

### tf_refreshMyfxbookPricesForce
~~~js
async function tf_refreshMyfxbookPricesForce() {
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
}
~~~

### tf_schedulePriceDependentUiRefresh
~~~js
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
~~~

### tf_setRefreshPriceLinkLoading
~~~js
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
~~~

### tf_setWaitPriceMode
~~~js
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
~~~

### tf_togglePriceDependentHeaderSpinners
~~~js
function tf_togglePriceDependentHeaderSpinners() {
try {
document.querySelectorAll('.tfPriceDepSpinner').forEach((el) => {
el.style.display = 'none';
});
}
catch (e) { }
}
~~~

### tf_waitForPriceThenInitMain
~~~js
async function tf_waitForPriceThenInitMain() {
try {
if (__tfDashboardMainReady)
return;
tf_setWaitPriceMode(true);
const start = Date.now();
const maxMs = 60000;
while (Date.now() - start < maxMs) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
if (tf_isInvestingPriceReadyNow())
break;
await new Promise((r) => setTimeout(r, 250));
}
tf_initDashboardMainAfterPrice();
}
catch (e) {
try {
tf_initDashboardMainAfterPrice();
}
catch (x) { }
}
}
~~~

### context TF_MYFXBOOK_PRICES_KEY
~~~js
onst analystName = (p.analystName || '').trim();
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
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
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
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
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
label.style.fon
~~~

### context tf_refreshMyfxbookPricesForce
~~~js
= 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
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
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
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
if (typeof isPairNoValue !== 'functi
~~~

### context fetch(
~~~js
r = normalized.toLowerCase();
const compact = upper.replace(/[^A-Z0-9]/g, '');
const candidates = [normalized, upper, lower, compact];
if (compact.startsWith('TF') && compact.length > 2) {
const body = compact.slice(2);
if (body.length >= 8 && body.length % 4 === 0) {
const groups = body.match(/.{1,4}/g) || [];
candidates.push('TF-' + groups.join('-'));
}
}
return Array.from(new Set(candidates.filter(Boolean)));
}
function tfShouldTryCredentialVariant(result) {
if (!result || result.valid === true)
return false;
const code = String(result.code || '').trim().toUpperCase();
if (['LICENSE_EXPIRED', 'LICENSE_BLOCKED', 'LICENSE_INACTIVE', 'DEVICE_TRANSFERRED'].includes(code))
return false;
const message = String(result.message || '').trim().toUpperCase();
return /TOKEN|EMAIL|CREDENTIAL|LICENSE[_ -]?NOT[_ -]?FOUND|INVALID[_ -]?LICENSE|PERIKSA.*TOKEN|EMAIL.*TOKEN/.test(code + ' ' + message);
}
function tfNormalizeLicenseResult(result) {
const source = result && typeof result === 'object' ? result : {};
return {
valid: source.valid === true,
success: source.success === true,
code: String(source.code || ''),
message: String(source.message || ''),
acceptedEmail: tfCleanEmail(source.acceptedEmail || ''),
acceptedToken: tfNormalizeToken(source.acceptedToken || ''),
email: tfNormalizeEmail(source.email),
status: String(source.status || '').trim().toUpperCase(),
duration: String(source.duration || '').trim().toUpperCase(),
isTrial: source.isTrial === true || String(source.duration || '').trim().toUpperCase() === 'TRIAL (1 HARI)',
isPermanent: source.isPermanent === true || String(source.duration || '').trim().toUpperCase() === 'PERMANENT',
activatedAt: String(source.activatedAt || ''),
expiresAt: String(source.expiresAt || ''),
serverTime: String(source.serverTime || ''),
remainingSeconds: Number.isFinite(Number(source.remainingSeconds))
? Math.max(0, Math.floor(Number(source.remainingSeconds)))
: null,
isOffline: source.isOffline === true || String(source.code || '').toUpperCase() === 'LICENSE_VALID_OFFLINE_GRACE',
verificationPending: source.verificationPending === true ||
['LICENSE_VALID_CACHED_SERVER_UNAVAILABLE', 'LICENSE_VALID_CACHED_PENDING'].includes(String(source.code || '').toUpperCase()),
offlineGraceExpiresAt: String(source.offlineGraceExpiresAt || ''),
offlineGraceRemainingSeconds: Number.isFinite(Number(source.offlineGraceRemainingSeconds))
? Math.max(0, Math.floor(Number(source.offlineGraceRemainingSeconds)))
: null,
serverVerified: source.serverVerified === true,
isignalUsersAccessKnown: source.isignalUsersAccessKnown === true ||
typeof source.isignalUsersAccess === 'boolean' ||
typeof source.isignalUsersIncluded === 'boolean' ||
typeof source.isignalUsersAddonRequired === 'boolean' ||
Boolean(source.isignalUsersAccessReason),
isignalUsersAccess: source.isignalUsersAccess === true,
isignalUsersIncluded: source.isignalUsersIncluded === true,
isignalUsersAddonRequired: source.isignalUsersAddonRequired === true,
isignalUsersPlan: String(source.isignalUsersPlan || '').trim().toUpperCase(),
isignalUsersExpiresAt: String(source.isignalUsersExpiresAt || ''),
isignalUsersRemainingSeconds: Number.isFinite(Number(source.isignalUsersRemainingSeconds))
? Math.max(0, Math.floor(Number(source.isignalUsersRemainingSeconds)))
: null,
isignalUsersAccessReason: String(source.isignalUsersAccessReason || '').trim().toUpperCase()
};
}
function tfWait(milliseconds) {
return new Promise((resolve) => setTimeout(resolve, Math.max(0, Number(milliseconds) || 0)));
}
async function tfCallLicenseApi(action, email, token, options) {
const opts = options || {};
const timeoutMs = Math.max(1000, Number(opts.timeoutMs) || TF_LICENSE_REQUEST_TIMEOUT_MS);
const attempts = Math.max(1, Math.floor(Number(opts.attempts) || TF_LICENSE_REQUEST_ATTEMPTS));
const retryDelayMs = Math.max(0, Number(opts.retryDelayMs) || TF_LICENSE_REQUEST_RETRY_DELAY_MS);
const deviceId = await tfGetDeviceId();
const __tfUiPresenceStored = await tfStorageGet(['tfUiPresenceStateV1']);
const __tfUiPresenceState = __tfUiPresenceStored.tfUiPresenceStateV1 || {};
const __tfUiPresenceActive = typeof opts.uiPresenceActive === 'boolean'
? opts.uiPresenceActive
: __tfUiPresenceState.active === true;
const __tfPresenceEvent = String(opts.presenceEvent || '').trim().toUpperCase();
const emailCandidates = tfBuildEmailCandidates(email);
const tokenCandidates = tfBuildTokenCandidates(token);
let lastError = null;
let lastResult = null;
for (let attempt = 1; attempt <= attempts; attempt += 1) {
let networkFailed = false;
let credentialAttempt = 0;
const totalCredentialAttempts = Math.max(1, emailCandidates.length * tokenCandidates.length);
for (const candidateEmail of emailCandidates) {
for (const candidateToken of tokenCandidates) {
credentialAttempt += 1;
const controller = typeof AbortController === 'function'
? new AbortController()
: null;
const timeoutId = setTimeout(() => {
try {
if (controller)
controller.abort();
}
catch (e) { }
}, timeoutMs);
try {
const response = await fetch(TF_LICENSE_API_URL, {
method: 'POST',
redirect: 'follow',
cache: 'no-store',
signal: controller ? controller.signal : undefined,
headers: {
'Content-Type': 'application/json;charset=UTF-8'
},
body: JSON.stringify({
action: String(action || 'validate'),
email: candidateEmail,
emailCanonical: tfNormalizeEmail(candidateEmail),
token: candidateToken,
deviceId,
extensionId: chrome.runtime.id,
extensionVersion: chrome.runtime.getManifest().version,
uiPresenceActive: __tfUiPresenceActive,
presenceEvent: __tfPresenceEvent,
clientPage: (typeof location !== 'undefined' && location.pathname) ? String(location.pathname) : '',
requestNonce: String(Date.now()) + '-' + attempt + '-' + credentialAttempt + '-' + Math.random().toString(36).slice(2)
})
});
if (!response.ok) {
throw new Error('HTTP ' + response.status);
}
const text = await response.text();
let parsed;
try {
parsed = JSON.parse(text);
}
catch (e) {
throw new Error('Respons server bukan JSON yang valid.');
}
const normalized = tfNormalizeLicenseResult({
...(parsed || {}),
serverVerified: true
});
if (normalized.valid === true) {
normalized.acceptedEmail = candidateEmail;
normalized.acceptedToken = candidateToken;
}
const legacyMessage = String(normalized.message || '').toLowerCase();
if (legacyMessage.includes('device id') || legacyMessage.includes('device_id')) {
normalized.valid = false;
normalized.acceptedEmail = '';
normalized.acceptedToken = '';
normalized.code = 'LEGACY_DEVICE_SERVER';
normalized.message = 'Server lisensi masih memakai script lama yang membatasi Device ID. Perbarui Code.gs lalu Deploy sebagai New version.';
}
lastResult = normalized;
if (normalized.valid === true || !tfShouldTryCredentialVariant(normalized) || credentialAttempt >= totalCredentialAttempts) {
return normalized;
}
}
catch (error) {
lastError = error;
networkFailed = true;
break;
}
finally {
clearTimeout(timeoutId);
}
}
if (networkFailed)
break;
}
if (!networkFailed && lastResult)
return lastResult;
if (attempt < attempts) {
await tfWait(retryDelayMs);
}
}
if (lastResult)
return lastResult;
throw lastError || new Error('Server lisensi belum merespons.');
}

function tfIsPrimaryPopupPage() {
try {
const path = String(location && location.pathname || '').toLowerCase();
return path.endsWith('/popup.html') || path === 'popup.html';
}
catch (e) {
return false;
}
}
function tfEnsureServerGateUi() {
let root = document.getElementById('tf-server-gate');
if (root)
return root;
const style = document.createElement('style');
style.id = 'tf-server-gate-style';
style.textContent = `
#tf-server-gate {
position: fixed;
inset: 0;
z-index: 2147483646;
display: flex;
align-items: center;
justify-content: center;
padding: 22px;
background: #020617;
color: #e5e7eb;
font-family: Arial, Helvetica, sans-serif;
}
#tf-server-gate.tf-server-gate-hidden { display: none !important; }
#tf-server-gate * { box-sizing: border-box; }
#tf-server-gate .tf-server-gate-card {
width: min(360px, calc(100vw - 36px));
display: flex;
align-items: center;
gap: 13px;
padding: 15px 17px;
border: 1px solid rgba(148,163,184,.30);
border-radius: 14px;
background: rgba(15,23,42,.97);
box-shadow: 0 22px 65px rgba(0,0,0,.48);
}
#tf-server-gate .tf-server-gate-spinner {
width: 28px;
height: 28px;
flex: 0 0 28px;
border-radius: 999px;
border: 3px solid rgba(148,163,184,.25);
border-top-color: #22c55e;
animation: tfServerGateSpin .82s linear infinite;
}
#tf-server-gate.tf-server-gate-locked .tf-server-gate-spinner {
animation: none;
border-color: rgba(239,68,68,.35);
border-top-color: #ef4444;
}
#tf-server-gate .tf-server-gate-copy {
min-width: 0;
display: flex;
flex-direction: column;
gap: 3px;
}
#tf-server-gate .tf-server-gate-title {
color: #f8fafc;
font-size: 13px;
font-weight: 800;
line-height: 1.25;
}
#tf-server-gate .tf-server-gate-subtitle {
color: #94a3b8;
font-size: 11px;
line-height: 1.4;
white-space: normal;
}
#tf-server-gate .tf-server-gate-retry {
display: none;
width: max-content;
margin-top: 7px;
padding: 5px 9px;
border: 1px solid rgba(56,189,248,.55);
border-radius: 999px;
background: rgba(14,165,233,.10);
color: #bae6fd;
cursor: pointer;
font-size: 10px;
font-weight: 750;
}
#tf-server-gate.tf-server-gate-locked .tf-server-gate-retry { display: inline-flex; }
#tf-server-gate .tf-server-gate-retry:disabled { opacity: .55; cursor: wait; }
@keyframes tfServerGateSpin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
root = document.createElement('div');
root.id = 'tf-server-gate';
root.className = 'tf-server-gate-hidden';
root.setAttribute('role', 'status');
root.setAttribute('aria-live', 'polite');
root.innerHTML = `
<div class="tf-server-gate-card">
<div class="tf-server-gate-spinner" aria-hidden="true"></div>
<div class="tf-server-gate-copy">
<div class="tf-server-gate-title">Connecting to server...</div>
<div class="tf-server-gate-subtitle">Checking license status</div>
<button class="tf-server-gate-retry" type="button">Coba Lagi</button>
</div>
</div>
`;
document.body.appendChild(root);
const retryButton = root.querySelector('.tf-server-gate-retry');
if (retryButton) {
retryButton.addEventListener('click', async () => {
retryButton.disabled = true;
tfShowServerGate('Connecting to server...', 'Checking license status', false);
try {
if (String(location.pathname || '').toLowerCase().endsWith('/subscribe_plan.html')) {
await tfRequireServerCheckOnly({ force: true });
}
else {
await tfRequireLicense({ force: true });
}
}
finally {
retryButton.disabled = false;
}
});
}
return root;
}
function tfShowServerGate(title, subtitle, locked) {
const root = tfEnsureServerGateUi();
const licenseRoot = document.getElementById('tf-license-root');
if (licenseRoot)
licenseRoot.classList.add('tf-license-hidden');
root.classList.remove('tf-server-gate-hidden');
root.classList.toggle('tf-server-gate-locked', !!locked);
const titleElement = root.querySelector('.tf-server-gate-title');
const subtitleElement = root.querySelector('.tf-server-gate-subtitle');
if (titleElement)
titleElement.textContent = String(title || 'Connecting to server...');
if (subtitleElement)
subtitleElement.textContent = String(subtitle || 'Checking license status');
document.documentElement.setAttribute('data-tf-gate-mode', locked ? 'locked' : 'loading');
document.documentElement.setAttribute('data-tf-license', 'locked');
tfSetServerAuthorization(false);
}
function tfHideServerGate() {
const root = document.getElementById('tf-server-gate');
if (root)
root.classList.add('tf-server-gate-hidden');
document.documentElement.removeAttribute('data-tf-gate-mode');
}
function tfEnsureLicenseUi() {
let root = document.getElementById('tf-license-root');
if (root)
return root;
const style = document.createElement('style');
style.id = 'tf-license-style';
style.textContent = `
#tf-license-root {
position: fixed;
inset: 0;
z-index: 2147483647;
display: flex;
align-items: center;
justify-content: center;
padding: 22px;
overflow: auto;
background: rgba(2, 6, 23, 0.985);
color: #e5e7eb;
font-family: Arial, Helvetica, sans-serif;
}
#tf-license-root.tf-license-hidden { display: none !important; }
#tf-license-root * { box-sizing: border-box; }
#tf-license-root .tf-license-card {
width: min(420px, 100%);
padding: 24px;
border: 1px solid rgba(148, 163, 184, 0.28);
border-radius: 16px;
background: #0f172a;
box-shadow: 0 24px 70px rgba(0,0,0,.48);
}
#tf-license-root .tf-license-title {
margin: 0 0 8px;
font-size: 22px;
line-height: 1.25;
color: #f8fafc;
}
#tf-license-root .tf-license-copy {
margin: 0 0 17px;
color: #aeb8c8;
font-size: 13px;
line-height: 1.55;
}
#tf-license-root .tf-license-label {
display: block;
margin: 11px 0 6px;
color: #dbe4f0;
font-size: 12px;
font-weight: 700;
}
#tf-license-root .tf-license-input {
width: 100%;
min-height: 42px;
padding: 10px 12px;
border: 1px solid #334155;
border-radius: 9px;
outline: none;
background: #020617;
color: #f8fafc;
font-size: 14px;
}
#tf-license-root .tf-license-input:focus {
border-color: #38bdf8;
box-shadow: 0 0 0 3px rgba(56,189,248,.15);
}
#tf-license-root .tf-license-button {
width: 100%;
min-height: 43px;
margin-top: 16px;
padding: 10px 14px;
border: 0;
border-radius: 9px;
background: #22c55e;
color: #052e16;
cursor: pointer;
font-size: 14px;
font-weight: 800;
}
#tf-license-root .tf-license-button:hover { filter: brightness(1.06); }
#tf-license-root .tf-license-button:disabled { opacity: .58; cursor: wait; }
#tf-license-root .tf-license-subscribe-button {
width: 100%;
min-height: 41px;
margin-top: 9px;
padding: 9px 13px;
border: 1px solid rgba(56,189,248,.72);
border-radius: 9px;
background: rgba(14,165,233,.12);
color: #bae6fd;
cursor: pointer;
font-size: 13px;
font-weight: 800;
}
#tf-license-root .tf-license-subscribe-button:hover {
background: rgba(14,165,233,.22);
border-color: #38bdf8;
color: #f0f9ff;
}
#tf-license-root .tf-license-message {
min-height: 20px;
margin-top: 12px;
color: #fca5a5;
font-size: 13px;
line-height: 1.45;
text-align: center;
}
#tf-license-root .tf-license-message.tf-license-ok { color: #86efac; }
#tf-license-root .tf-license-footnote {
margin: 12px 0 0;
color: #64748b;
font-size: 11px;
line-height: 1.45;
text-align: center;
}
`;
document.head.appendChild(style);
root = document.createElement('div');
root.id = 'tf-license-root';
root.className = 'tf-license-hidden';
root.setAttribute('role', 'dialog');
root.setAttribute('aria-modal', 'true');
root.innerHTML = `
<div class="tf-license-card">
<h1 class="tf-license-title">Aktivasi TF Extension</h1>
<p class="tf-license-copy">Masukkan email pembelian dan token aktivasi. Lisensi dapat digunakan selama email, token, status, dan masa berlakunya valid.</p>
<label class="tf-license-label" for="tf-license-email">Email pembelian</label>
<input class="tf-license-input" id="tf-license-email" type="email" autocomplete="email" placeholder="nama@email.com">
<label class="tf-license-label" for="tf-license-token">Token aktivasi</label>
<input class="tf-license-input" id="tf-license-token" type="text" autocomplete="off" spellcheck="false" placeholder="TF / TFA License Token">
<button class="tf-license-button" id="tf-license-activate" type="button">Aktivasi</button>
<button class="tf-license-subscribe-button" id="tf-license-subscribe" type="button">Subscribe Plan</button>
<div class="tf-license-message" id="tf-license-message">Memeriksa lisensi...</div>
<p class="tf-license-footnote">Status lisensi diperiksa melalui server pemilik extension.</p>
</div>
`;
document.body.appendChild(root);
const button = root.querySelector('#tf-license-activate');
const subscribeButton = root.querySelector('#tf-license-subscribe');
const emailInput = root.querySelector('#tf-license-email');
const tokenInput = root.querySelector('#tf-license-token');
const activate = async () => {
const email = tfCleanEmail(emailInput && emailInput.value);
const token = tfNormalizeToken(tokenInput && tokenInput.value);
if (!email || !token) {
tfShowLicenseMessage('Email dan token wajib diisi.', false);
return;
}
if (button) {
button.disabled = true;
button.textContent = 'Memeriksa...';
}
tfShowLicenseMessage('Menghubungkan ke server lisensi...', true);
try {
const result = await tfCallLicenseApi('activate', email, token);
if (!result || result.valid !== true) {
tfApplyLicenseResult(result);
tfShowLicenseMessage((result && result.message) || 'Aktivasi gagal.', false);
return;
}
const now = Date.now();
await tfStorageSet({
[TF_LICENSE_CREDENTIALS_KEY]: {
email: tfCleanEmail(result.acceptedEmail || result.email || email),
emailCanonical: tfNormalizeEmail(result.acceptedEmail || result.email || email),
token: tfNormalizeToken(result.acceptedToken || token),
deviceId: await tfGetDeviceId(),
activatedAt: result.activatedAt || now,
lastValidatedAt: now,
expiresAt: result.expiresAt || '',
duration: result.duration || '',
isTrial: !!result.isTrial,
isPermanent: !!result.isPermanent,
serverTime: result.serverTime || '',
remainingSeconds: result.remainingSeconds
},
[TF_LICENSE_STATE_KEY]: {
...result,
valid: true,
~~~

### context myfxbook
~~~js
.tfScanInProgress.newValue);
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
if (tfMyfxbookRefreshInProgress)
return true;
if (!tfMyfxbookPriceMapLatest || typeof tfMyfxbookPriceMapLatest !== 'object')
return true;
try {
return Object.keys(tfMyfxbookPriceMapLatest).length === 0;
}
catch (e) {
return true;
}
}
async function tf_renderPipCompactTableFromCache() {
const tbodyL = document.getElementById('pip-table-compact-body-left');
const tbodyR = document.getElementById('pip-table-compact-body-right');
if (!tbodyL || !tbodyR)
return;
const store = await tf_storageLocalGet([TF_MYFXBOOK_PRICES_KEY, TF_MYFXBOOK_PRICES_AT_KEY]);
const priceMap = (store && store[TF_MYFXBOOK_PRICES_KEY]) ? store[TF_MYFXBOOK_PRICES_KEY] : {};
const isCacheEmpty = (!priceMap || Object.keys(priceMap).length === 0);
const isRefreshing = !!tfMyfxbookRefreshInProgress;
const isLoading = isCacheEmpty || isRefreshing;
tfMyfxbookPriceMapLatest = (!isCacheEmpty && priceMap && typeof priceMap === 'object') ? priceMap : null;
try {
document.querySelectorAll('.pipPriceSpinner').forEach((el) => {
el.style.display = isLoading ? 'inline-block' : 'none';
});
}
catch (e) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
try {
if (isCacheEmpty && !isRefreshing) {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
const mapPairs = Object.keys(PAIR_DOLLAR_PER_PIP || {}).map(p => String(p).toUpperCase());
const ordered = [];
TF_PIP_TABLE_PAIR_ORDER.forEach((p) => {
if (mapPairs.includes(p))
ordered.push(p);
});
mapPairs.forEach((p) => {
if (!ordered.includes(p))
ordered.push(p);
});
const half = Math.ceil(ordered.length / 2);
const left = ordered.slice(0, half);
const right = ordered.slice(half);
const rowCount = Math.max(left.length, right.length);
tbodyL.textContent = '';
tbodyR.textContent = '';
const buildCells = (pair) => {
const tdPair = document.createElement('td');
const tdPrice = document.createElement('td');
const tdPip = document.createElement('td');
if (!pair) {
tdPair.textContent = '';
tdPrice.textContent = '';
tdPip.textContent = '';
return [tdPair, tdPrice, tdPip];
}
tdPair.textContent = pair;
const pairKey = String(pair || '').trim().toUpperCase();
if (pairKey === 'XAUUSD') {
const priceRaw = priceMap ? priceMap[pairKey] : null;
const hasPrice = (priceRaw != null && String(priceRaw).trim() !== '');
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
tdPrice.textContent = hasPrice ? tf_formatMyfxbookPrice(priceRaw) : '—';
tdPip.textContent = '10.00';
}
return [tdPair, tdPrice, tdPip];
}
const priceRaw = priceMap ? priceMap[pair] : null;
if (isLoading) {
tdPrice.innerHTML = tf_spinnerHTML(true);
tdPip.innerHTML = tf_spinnerHTML(true);
}
else {
const priceNum = tf_getPriceNum(pair, priceMap);
if (priceNum == null || !isFinite(priceNum)) {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: '—';
const fallbackPip = getDollarPerPipForPair(pairKey);
tdPip.textContent = (fallbackPip && isFinite(fallbackPip)) ? fallbackPip.toFixed(2) : '';
}
else {
tdPrice.textContent = (priceRaw != null && String(priceRaw).trim() !== '')
? tf_formatMyfxbookPrice(priceRaw)
: String(priceNum);
const pipVal = tf_calcDollarPerPipUSD(pair, priceMap);
tdPip.textContent = (pipVal && isFinite(pipVal)) ? pipVal.toFixed(2) : '';
}
}
return [tdPair, tdPrice, tdPip];
};
for (let i = 0; i < rowCount; i++) {
const trL = document.createElement('tr');
buildCells(left[i]).forEach(td => trL.appendChild(td));
tbodyL.appendChild(trL);
const trR = document.createElement('tr');
buildCells(right[i]).forEach(td => trR.appendChild(td));
tbodyR.appendChild(trR);
}
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
if (tfMyfxbookRefreshInProgress)
return;
tfMyfxbookRefreshInProgress = true;
tf_setRefreshPriceLinkLoading(true);
try {
await tf_renderPipCompactTableFromCache();
}
catch (e) { }
try {
renderSummaryTable();
updateMonthlyTableCells();
renderMonthlyTotals();
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
await new Promise((resolve) => {
if (typeof requestAnimationFrame === 'function') {
requestAnimationFrame(() => setTimeout(resolve, 0));
}
else {
setTimeout(resolve, 0);
}
});
}
catch (e) { }
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices', force: true }, async (res) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError;
}
catch (e) { }
tfMyfxbookRefreshInProgress = false;
try {
await tf_renderPipCompactTableFromCache();
await tf_schedulePriceDependentUiRefresh(25);
}
catch (e) {
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
}
finally {
tf_setRefreshPriceLinkLoading(false);
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (e) { }
}
});
}
catch (e) {
tfMyfxbookRefreshInProgress = false;
tf_setRefreshPriceLinkLoading(false);
try {
await tf_renderPipCompactTableFromCache();
}
catch (x) { }
try {
await tf_schedulePriceDependentUiRefresh(25);
}
catch (x) { }
try {
tf_togglePriceDependentHeaderSpinners();
}
catch (x) { }
}
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
menu.
~~~