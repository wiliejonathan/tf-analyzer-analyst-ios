# REV379 PC Price Provider V2

/tmp/pc379/ext/assets/4b4d6b8dc315a95c.js
/tmp/pc379/ext/assets/901c62026afc22f4.js
/tmp/pc379/ext/assets/894f18e8a37bd7c6.js
/tmp/pc379/ext/assets/927ecbd63036f61b.js

## FILE 4b4d6b8dc315a95c.js
~~~js
shTimer = null;
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
function isGloballyChecked(analystNa

/* ---- HIT ---- */

Quote = 100000 * pipSize;
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
arrow.textContent = '▶';
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
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && m

/* ---- HIT ---- */

nt-input-equity');
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
perfCompGroup.style.display = (desiredRisk === 'compound') ? '' : 'none';
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
perfRiskGroup.style.display = showUsdControls ? '' : 'none';
if (!showUsdControls) {
if (perfCompGroup)
perfCompGroup.style.display = 'none';
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
perfCompGroup.style.display = (desiredRisk === 'compound') ? '' : 'none';
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
const byAnalyst = new Map(

/* ---- HIT ---- */

ONTHLY_COL_WIDTHS.analyst +
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
thAction.innerHTML = TF_MONTHLY_REFRESH_ICON;
thAction.classList.add('tf-monthly-refresh-head-icon');
thAction.title = 'Refresh data analis';
thAction.setAttribute('aria-label', 'Refresh');
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
theadRow.children[0].classList.add('monthly-sticky-col-1', 'tf-monthly-refresh-head-icon');
theadRow.children[0].innerHTML = TF_MONTHLY_REFRESH_ICON;
theadRow.children[0].title = 'Refresh data analis';
theadRow.children[0].setAttribute('aria-label', 'Refresh');
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
// REV364 performance: avoid one layout pass per analyst row.
const tfMonthlyRenderFragment = document.createDocumentFragment();
filteredAnalysts.forEach((a) => {
const tr = document.createElement('tr');
const actionCell = document.createElement('td');
actionCell.classList.add('monthly-sticky-col-1');
const btn = document.createElement('button');
btn.type = 'button';
btn.className = 'btn btn-xs tf-monthly-refresh-icon';
btn.innerHTML = TF_MONTHLY_REFRESH_ICON;
btn.title = 'Reload data analis ini dari website (Statistics + History)';
btn.setAttribute('aria-label', 'Refresh data analis');
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
tfMonthlyRenderFragment.appendChild(tr);
});
tbody.appendChild(tfMonthlyRenderFragment);
tf_applyMonthlyTableLayout(monthKeys.length);
try {
__tfMonthlyMonthKeysSig = (monthKeys || []).join('|');
}
catch (e) { }
tf_scrollMonthlyDefaultRight();
}
function refreshAnalystFromDashboard(analystName, pair, buttonEl) {
const hasChromeAPI = typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
if (!hasChromeAPI) {
console.warn('Chrome runtime API tidak tersedia – tombol refresh hanya berfungsi di extension.');
return;
}
if (buttonEl) {
buttonEl.disabled = true;
buttonEl.innerHTML = TF_MONTHLY_REFRESH_ICON;
buttonEl.classList.add('tf-refreshing');
buttonEl.setAttribute('aria-busy', 'true');
buttonEl.title = 'Refreshing data analis...';
}
const msg = { type: 'scanSingleAnalyst', analystName };
if (pair)
msg.pair = pair;
chrome.runtime.sendMessage(msg, (response) => {
if (buttonEl) {
buttonEl.disabled = false;
buttonEl.innerHTML = TF_MONTHLY_REFRESH_ICON;
buttonEl.classList.remove('tf-refreshing');
buttonEl.removeAttribute('aria-busy');
buttonEl.title = 'Reload data analis ini dari website (Statistics + History)';
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
const totalLabelCell = document.createElement('td');
totalLabelCell.colSpan = 3;
totalLabelCell.textContent = 'Total semua analis';
totalLabelCell.classList.add('monthly-sticky-col-1');
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
const raw =

/* ---- HIT ---- */

e {
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
// REV364 performance: build the large History table off-DOM, then commit once.
const tfHistoryRenderFragment = document.createDocumentFragment();
try {
const startBal = Number.isFinite(startingBalance) ? startingBalance : 0;
const trStart = document.createElement('tr');
trStart.className = 'tf-start-balance-row';
const tdStart = document.createElement('td');
tdStart.colSpan = Math.max(1, tf_getVisibleHistoryColumnKeys().length + 1);
tdStart.className = 'mono';
const sbLabel = (riskMode === 'compound') ? 'Start Balance Compounded' : 'Start Balance';
tdStart.textContent = sbLabel + ' : ' + formatMoney(startBal);
trStart.appendChild(tdStart);
tfHistoryRenderFragment.appendChild(trStart);
}
catch (e) { }
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
window.__tfHistoryDynamicTradeCount = Array.isArray(rowsForUi)
? rowsForUi.filter((r) => !(r && r.isWithdraw)).length
: 0;
}
catch (e) { window.__tfHistoryDynamicTradeCount = 0; }
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
rowsForUi.forEach((row) => {
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
tfHistoryRenderFragment.appendChild(tr);
});
tbody.appendChild(tfHistoryRenderFragment);
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
emptyNote.textContent = 'Belum ada data history untuk digambar. Tambahkan baris di Table 3 atau lakukan Scan dari extension.';
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
const pnlDollar = row.isWithdraw ? (Number.isFinite(row.pnlDollar) ? row.pnlDollar : ((row.dollarTP || 0) - (row.do

/* ---- HIT ---- */

oryDetail(['entry', 'price']);
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
tfHistoryRenderFragment.appendChild(tr);
});
tbody.appendChild(tfHistoryRenderFragment);
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
emptyNote.textContent = 'Belum ada data history untuk digambar. Tambahkan baris di Table 3 atau lakukan Scan dari extension.';
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
const baseHeight = 450;
if (!width)
return;
const dpr = window.devicePixelRatio || 1;
// REV364 performance: resize the backing store only when geometry actually changes.
// Resetting canvas.width/height reallocates the full bitmap and was happening on every hover.
const pixelWidth = Math.max(1, Math.round(width * dpr));
const pixelHeight = Math.max(1, Math.round(baseHeight * dpr));
if (canvas.width !== pixelWidth) canvas.width = pixelWidth;
if (canvas.height !== pixelHeight) canvas.height = pixelHeight;
const cssWidth = width + 'px';
const cssHeight = baseHeight + 'px';
if (canvas.style.width !== cssWidth) canvas.style.width = cssWidth;
if (canvas.style.height !== cssHeight) canvas.style.height = cssHeight;
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
ctx.clearRect(0, 0, width, baseHeight);
if (!equityCurvePoints.length)
return;
const paddingLeft = 48;
const paddingRight = tf_getEquityPaddingRight();
const paddingTop = 18;
const paddingBottom = 44;
const chartWidth = width - paddingLeft - paddingRight;
const chartHeight = baseHeight - paddingTop - paddingBottom;
if (chartWidth <= 0 || chartHeight <= 0)
return;
const isCandleMode = (equityChartMode === 'candle');
// REV364 / APK REV345 parity: USD Equity bounds are based on actual starting
// balance and actual end/extreme values, then padded by 5% at each outer edge.
const tfEqStartBalanceV364 = (equityCurvePoints[0] && Number.isFinite(Number(equityCurvePoints[0].equity)))
? Number(equityCurvePoints[0].equity)
: (Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : 0);
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
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const lo = Number(c.low);
const hi = Number(c.high);
if (isFinite(lo))
minYRaw = Math.min(minYRaw, lo);
if (isFinite(hi))
maxYRaw = Math.max(maxYRaw, hi);
const o = Number(c.open);
const cl = Number(c.close);
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
// REV364: mirror APK REV345 percentage-based USD Y-axis.
// Fixed/log padding made the PC chart produce misleading negative lower labels
// on very large growth curves. USD now uses actual values with 5% outer padding.
if (equityMetric === 'usd') useSharedActualLogScale = false;
let tMin = toT(minYRaw);
let tMax = toT(maxYRaw);
if (equityMetric === 'us

/* ---- HIT ---- */

rofitDollar = 0;
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
'Belum ada data drawdown. Tambahkan history di Table 3 atau lakukan Scan terlebih dahulu.';
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
if (ddTradesPip

/* ---- HIT ---- */

, '#fbbf24');
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
const validHistory = (rawHistory || []).filter((item) => {
if (!item || !item.analyst)
return false;
if (typeof item.pips === 'number')
return Number.isFinite(item.pips);
if (typeof item.pips === 'string' && item.pips.trim() !== '')
return Number.isFinite(parseFloat(item.pips));
return false;
});
historySignals = validHistory.map((item) => {
const parsedPips = (typeof item.pips === 'number') ? item.pips : parseFloat(item.pips);
return {
...item,
analyst: item.analyst,
pair: item.pair,
pips: Number.isFinite(parsedPips) ? parsedPips : 0,
displayDate: normalizeWIBSuffix(item.displayDate),
sortKey: item.sortKey,
createdDate: normalizeWIBSuffix(item.createdDate),
createdSortKey: item.createdSortKey
};
});
try {
initialHistorySignals = historySignals.map((item) => {
return {
...item,
displayDate: normalizeWIBSuffix(item.displayDate),
createdDate: normalizeWIBSuffix(item.createdDate)
};
});
}
catch (e) {
initialHistorySignals = Array.isArray(historySignals) ? historySignals.slice() : [];
}
rebuildAnalystListFromSources();
setupAnalystTickerFilter();
applyAnalystPairFilterAll();
setupHistoryForm();
chrome.storage.local.set({
tfAnalystSources: analystSourcesByName
}, () => {
recomputeHistoryRows();
});
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
riskRow.appe

/* ---- HIT ---- */

2px;
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
if (typeof window.tfRequireLicense === 'function') {
const __tfLicenseAllowed = await window.tfRequireLicense();
if (!__tfLicenseAllowed)
return;
}
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
tf_waitForPriceThenInitMain();
});
var __tfDrawdownDetailsBound = false;
function tf_applyDrawdownDetailColWidthsPx(detailTable) {
try {
if (!detailTable)
return;
const ths = document.querySelectorAll('#drawdown-table thead th');
if (!ths || ths.length !== 10)
return;
const cols = detailTable.querySelectorAll('colgroup col');
if (!cols || cols.length !== 10)
return;
for (let i = 0; i < 10; i++) {
const w = ths[i] ? Math.round(ths[i].getBoundingClientRect().width) : 0;
if (w && w > 0)
cols[i].style.width = w + 'px';
}
}
catch (e) { }
}
function tf_buildDrawdownDetailElement(st) {
const wrap = document.createElement('div');
wrap.className = 'drawdown-detail-wrap';
const maxP = st && st.maxProfitTrades ? st.maxProfitTrades : 0;
const maxL = st && st.maxLossTrades ? st.maxLossTrades : 0;
const maxN = Math.max(maxP, maxL);
if (maxN <= 1) {
const note = document.createElement('div');
note.style.opacity = '0.8';
note.textContent = 'Tidak ada detail streak untuk ditampilkan.';
wrap.appendChild(note);
return wrap;
}
const tbl = document.createElement('table');
tbl.className = 'drawdown-detail-table';
const cg = document.createElement('colgroup');
['4%', '16%', '12%', '8%', '10%', '12%', '12%', '8%', '10%', '12%'].forEach(w => {
const col = document.createElement('col');
col.style.width = w;
cg.appendChild(col);
});
tbl.appendChild(cg);
tf_applyDrawdownDetailColWidthsPx(tbl);
const priceBusy = tf_isMyfxbookPriceLoading();
for (let k = maxN - 1; k >= 1; k--) {
const tr = document.createElement('tr');
const tdArrowBlank = document.createElement('td');
tdArrowBlank.textContent = '';
tr.appendChild(tdArrowBlank);
const tdNameBlank = document.createElement('td');
tdNameBlank.textContent = '';
tr.appendChild(tdNameBlank);
const showPBase = (k <= maxP);
const pRun = (showPBase && st && st.profitRuns && st.profitRuns[k]) ? st.profitRuns[k] : null;
const pCount = (pRun && Number.isFinite(+pRun.count)) ? +pRun.count : 0;
const showP = showPBase && (pCount > 0);
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
const showLBase = (k <= maxL);
const lRun = (showLBase && st && st.lossRuns && st.lossRuns[k]) ? st.lossRuns[k] : null;
const lCount = (lRun && Number.isFinite(+lRun.count)) ? +lRun.count : 0;
const showL = showLBase && (lCount > 0);
if (!showP && !showL) {
continue;
}
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
tbl.appendChild(tr);
}
wrap.appendChild(tbl);
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
return info && info.subEndOn ? St

/* ---- HIT ---- */

t.remove('open');
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
tf_waitForPriceThenInitMain();
});
var __tfDrawdownDetailsBound = false;
function tf_applyDrawdownDetailColWidthsPx(detailTable) {
try {
if (!detailTable)
return;
const ths = document.querySelectorAll('#drawdown-table thead th');
if (!ths || ths.length !== 10)
return;
const cols = detailTable.querySelectorAll('colgroup col');
if (!cols || cols.length !== 10)
return;
for (let i = 0; i < 10; i++) {
const w = ths[i] ? Math.round(ths[i].getBoundingClientRect().width) : 0;
if (w && w > 0)
cols[i].style.width = w + 'px';
}
}
catch (e) { }
}
function tf_buildDrawdownDetailElement(st) {
const wrap = document.createElement('div');
wrap.className = 'drawdown-detail-wrap';
const maxP = st && st.maxProfitTrades ? st.maxProfitTrades : 0;
const maxL = st && st.maxLossTrades ? st.maxLossTrades : 0;
const maxN = Math.max(maxP, maxL);
if (maxN <= 1) {
const note = document.createElement('div');
note.style.opacity = '0.8';
note.textContent = 'Tidak ada detail streak untuk ditampilkan.';
wrap.appendChild(note);
return wrap;
}
const tbl = document.createElement('table');
tbl.className = 'drawdown-detail-table';
const cg = document.createElement('colgroup');
['4%', '16%', '12%', '8%', '10%', '12%', '12%', '8%', '10%', '12%'].forEach(w => {
const col = document.createElement('col');
col.style.width = w;
cg.appendChild(col);
});
tbl.appendChild(cg);
tf_applyDrawdownDetailColWidthsPx(tbl);
const priceBusy = tf_isMyfxbookPriceLoading();
for (let k = maxN - 1; k >= 1; k--) {
const tr = document.createElement('tr');
const tdArrowBlank = document.createElement('td');
tdArrowBlank.textContent = '';
tr.appendChild(tdArrowBlank);
const tdNameBlank = document.createElement('td');
tdNameBlank.textContent = '';
tr.appendChild(tdNameBlank);
const showPBase = (k <= maxP);
const pRun = (showPBase && st && st.profitRuns && st.profitRuns[k]) ? st.profitRuns[k] : null;
const pCount = (pRun && Number.isFinite(+pRun.count)) ? +pRun.count : 0;
const showP = showPBase && (pCount > 0);
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
const showLBase = (k <= maxL);
const lRun = (showLBase && st && st.lossRuns && st.lossRuns[k]) ? st.lossRuns[k] : null;
const lCount = (lRun && Number.isFinite(+lRun.count)) ? +lRun.count : 0;
const showL = showLBase && (lCount > 0);
if (!showP && !showL) {
continue;
}
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
tbl.appendChild(tr);
}
wrap.appendChild(tbl);
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
if (!cfg || typeof cfg !== 'obje

/* ---- HIT ---- */

 Math.max(3, parseInt(rows, 10) || 6);
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
target.title = 'Lot Size default dari perhitungan. Ubah angka untuk memakai Lo

/* ---- HIT ---- */

/div>\n</div>\n<div>\n<div class=\"tf-scan-section-title\">Batch scanning done!/progress...</div>\n<div class=\"tf-scan-list\" id=\"tf-dashboard-scan-detail\"></div>\n</div>\n</div>\n</div>\n</div>\n<div class=\"page\" id=\"tf-dashboard-main\">\n<header class=\"dashboard-header\">\n<div class=\"profile-row\">\n<img alt=\"User avatar\" class=\"dashboard-avatar\" id=\"dashboard-user-avatar\" src=\"https://account.tradersfamily.id/templates/panel/img/user-default-v2.png\"/>\n<div class=\"profile-main\">\n<div class=\"profile-name\" id=\"dashboard-user-name\">User belum login</div>\n<div class=\"profile-status\">\n<span class=\"status-dot\"></span>\n<span id=\"dashboard-user-status-text\">Offline</span>\n</div>\n</div>\n</div>\n<div class=\"title-block\">\n<h1>TF Multi-Analyst Dashboard</h1>\n<p class=\"sub-heading\">\n          Data di halaman ini di-load dari hasil scan extension Chrome\n          (<span class=\"mono\">tfMonthlyStats</span> &amp; <span class=\"mono\">tfHistorySignals</span>)\n          dan bisa kamu kombinasikan dengan pengaturan Balance &amp; Risk untuk menghitung Lot &amp; hasil $$.\n        </p>\n</div>\n</header>\n<!-- ==================== Top Navigator Menu ==================== -->\n<div class=\"tf-top-nav-wrap\" id=\"tf-top-nav-wrap\">\n<nav aria-label=\"Navigator\" class=\"tf-top-nav\">\n<ul>\n<li class=\"active\">\n<a class=\"tf-nav-link\" data-tf-url=\"dashboard.html\" href=\"dashboard.html\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/home-black.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/home-dgrey.png\"/>\n<span>Beranda</span>\n</div>\n</a>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li class=\"tf-dropdown\">\n<a class=\"tf-nav-link\" data-tf-parent=\"1\" data-tf-url=\"#\" href=\"#\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy.png\"/>\n<span>iSignal <span class=\"tf-caret\">\u25be</span></span>\n</div>\n</a>\n<ul aria-label=\"iSignal submenu\" class=\"tf-submenu\">\n<li><a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/isignal/\" href=\"https://account.tradersfamily.id/channels/isignal/\">iSignal Analis</a></li>\n<li><a class=\"tf-nav-link\" data-tf-url=\"iSignalUsers.html\" href=\"iSignalUsers.html\">iSignal Users</a></li>\n</ul>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li class=\"tf-dropdown\">\n<a class=\"tf-nav-link\" data-tf-parent=\"1\" data-tf-url=\"#\" href=\"#\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-dgrey.png\"/>\n<span>TF Copy Signal <span class=\"tf-caret\">\u25be</span></span>\n</div>\n</a>\n<ul aria-label=\"TF Copy Signal submenu\" class=\"tf-submenu\">\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/\" href=\"https://account.tradersfamily.id/channels/\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/home-dgrey.png\"/>\n<span>Beranda</span>\n</div>\n</a>\n</li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/browse/?v=symbol\" href=\"https://account.tradersfamily.id/channels/browse/?v=symbol\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/search-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/search-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/search-dgrey.png\"/>\n<span>Browse Channel</span>\n</div>\n</a>\n</li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/my/\" href=\"https://account.tradersfamily.id/channels/my/\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/user-dvc-dgrey.png\"/>\n<span>My Channels</span>\n</div>\n</a>\n</li>\n</ul>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li>\n<a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/profile/u/155921/?tab=settings\" href=\"https://account.tradersfamily.id/profile/u/155921/?tab=settings\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/user-black.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/user-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/user-dgrey.png\"/>\n<span>Profile</span>\n</div>\n</a>\n</li>\n</ul>\n</nav>\n</div>\n<!-- ==================== End Top Navigator Menu ==================== -->\n<section class=\"card\" id=\"section-summary\">\n<div class=\"card-header\">\n<div class=\"card-title-group\">\n<h2>Table 1 \u2013 History Signal \u2013 Money Management</h2>\n<div class=\"card-badge\">\n<span class=\"card-badge-dot\"></span>\n<span>Lot Size per Analyst</span>\n</div>\n</div>\n<div class=\"section-note\">\n          Rumus lot:<br/>\n<span class=\"mono\">(Balance \u00d7 Risk% / Trade) \u00f7 (Select SL PIPS) \u00f7 ($ / Pips)</span>\n</div>\n<div class=\"section-note\" id=\"tf-scanned-by\" style=\"margin-top: 6px;\"></div>\n</div>\n<div class=\"section-note\" style=\"margin-top: 4px;\">\n<div class=\"small-muted\" style=\"margin: 0 0 6px 0; display:flex; align-items:center; gap:10px; flex-wrap:wrap;\">\n<span>\n              Price is scanned from Investing.com\n              <a class=\"nav fxLogoLink\" id=\"tfInvestingProLogoLink\" href=\"https://id.investing.com/pro\" target=\"_blank\" rel=\"noopener\">\n                    <img id=\"investingProNavMenuItemWhite\" src=\"https://i-invdn-com.investing.com/InvestingProWhiteText.svg\" alt=\"InvestingPro\" width=\"70\" height=\"12\" style=\"position:relative;top:2px;\">\n                    <img id=\"investingProNavMenuItemBlack\" src=\"https://i-invdn-com.investing.com/InvestingProBlackText.svg\" alt=\"InvestingPro\" width=\"70\" height=\"12\" style=\"position:relative;top:2px;\">\n                  </a>\n</span>\n<span aria-hidden=\"true\" class=\"tf-note-sep\">|</span>\n<a class=\"tfRefreshPriceLink\" href=\"#\" id=\"tf-refresh-price-link\" title=\"Refresh Investing Price\">\n<span>Refresh Price</span>\n<svg class=\"svgMblExtend\" fill=\"none\" height=\"26\" style=\"display: block;border-radius: 10%;\" viewbox=\"0 0 26 26\" width=\"26\" xmlns=\"http://www.w3.org/2000/svg\">\n<path d=\"M6.81061 8.0437V4.3309H3.09521\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M19.1919 17.9497V21.6625H22.9047\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M10.5208 2.76563C11.3332 2.57084 12.1657 2.47223 13.0012 2.47183C15.2233 2.47216 17.3883 3.17581 19.1861 4.48199C20.9838 5.78816 22.322 7.62982 23.0089 9.74313C23.6958 11.8564 23.6962 14.1329 23.0101 16.2465C22.3239 18.3601 20.9864 20.2022 19.1892 21.509\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M15.4764 23.2277C13.1085 23.8014 10.6148 23.5358 8.4209 22.4762C6.22695 21.4166 4.46859 19.6286 3.44576 17.4173C2.42292 15.2059 2.19898 12.7082 2.81213 10.3502C3.42528 7.9922 4.83753 5.91995 6.80799 4.48695\" stroke=\"#111820\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M11.1436 14.2375V14.5599C11.147 14.9714 11.3129 15.3649 11.605 15.6546C11.8972 15.9444 12.2921 16.107 12.7036 16.1069H13.3224C13.7339 16.107 14.1287 15.9444 14.4209 15.6546C14.7131 15.3649 14.8789 14.9714 14.8824 14.5599C14.8805 14.2899 14.7947 14.0272 14.6367 13.8082C14.4788 13.5893 14.2566 13.4249 14.001 13.3379L12.051 12.6879C11.7953 12.601 11.5731 12.4366 11.4152 12.2177C11.2572 11.9987 11.1714 11.7359 11.1696 11.4659C11.173 11.0545 11.3389 10.661 11.631 10.3713C11.9232 10.0815 12.3181 9.91893 12.7296 9.91895H13.3484C13.7598 9.91893 14.1547 10.0815 14.4469 10.3713C14.7391 10.661 14.9049 11.0545 14.9084 11.4659V11.7753\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M13 9.646V8.047\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n<path d=\"M13 17.953V16.3384\" stroke=\"#111820\" stroke-linejoin=\"round\" stroke-width=\"1.5\"></path>\n</svg>\n</a>\n</div>\n\n<div id=\"tf-wait-price-note\">\n  <span aria-hidden=\"true\" class=\"mini-spinner tight\"></span>\n  <span>Menunggu price dari Investing.com\u2026 tabel lainnya akan muncul setelah price tersedia.</span>\n</div>\n<div class=\"pip-table-compact-wrap\">\n<table class=\"pip-table-compact pip-table-side\">\n<thead>\n<tr>\n<th class=\"pipTh\">Pair</th>\n<th class=\"pipTh\">Price <span aria-hidden=\"true\" class=\"mini-spinner pipPriceSpinner\" style=\"display:none;\"></span></th>\n<th class=\"pipTh\">$/Pip ( 1 Lot )</th>\n</tr>\n</thead>\n<tbody id=\"pip-table-compact-body-left\"></tbody>\n</table>\n<table class=\"pip-table-compact pip-table-side\">\n<thead>\n<tr>\n<th class=\"pipTh\">Pair</th>\n<th class=\"pipTh\">Price <span aria-hidden=\"true\" class=\"mini-spinner pipPriceSpinner\" style=\"display:none;\"></span></th>\n<th class=\"pipTh\">$/Pip ( 1 Lot )</th>\n</tr>\n</thead>\n<tbody id=\"pip-table-compact-body-right\"></tbody>\n</table>\n</div>\n\n<div class=\"tf-perf-wrap\" id=\"tf-perf-wrap\" style=\"display:none;\">\n  <div class=\"tf-perf-head\">\n    <div class=\"tf-perf-overall-title\">Performance/Probability Analis</div>\n    <!-- Metric selector (TP/SL | Pips | Dollar) -->\n    <div class=\"equity-filter-row tf-perf-metric-row\" style=\"margin-top: 0; margin-bottom: 0;\">\n      <div class=\"tf-perf-metric-risk-flex\" style=\"display:flex; align-items:center; gap: 14px; flex-wrap: wrap; width: 100%;\">\n        <div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n          <label for=\"tf-perf-metric-select\" style=\"min-width: 72px;\">Filter by:</label>\n          <select class=\"form-input\" id=\"tf-perf-metric-select\" style=\"width: 170px; padding: 6px 10px;\">\n            <option value=\"tp_sl\">TP/SL</option>\n            <option value=\"pips\">Pips</option>\n            <option value=\"usd\">Dollar</option>\n          </select>\n        </div>\n\n        <!-- Single-calendar-month selector (synced with Table 2, Equity Curve & Table 3) -->\n        <div class=\"equity-date-group\" style=\"align-items: center; gap: 8px;\">\n          <label for=\"tf-single-month-select-perf\" style=\"min-width: 56px;\">Month:</label>\n          <select class=\"form-input tf-single-month-select\" id=\"tf-single-month-select-perf\" style=\"width: 170px; padding: 6px 10px;\"></select>\n        </div>\n\n        <!-- Risk Mode selector (only when Filter by: Dollar) -->\n        <div class=\"equity-date-group\" id=\"tf-perf-risk-group\" style=\"align-items: center; gap: 8px; display:none; \">\n          <label for=\"tf-perf-risk-mode-select\" style=\"min-width: 72px;\">Risk Mode:</label>\n          <select class=\"form-input\" id=\"tf-perf-risk-mode-select\" style=\"width: 170px; padding: 6px 10px;\">\n            <option value=\"fixed\">Fixed Lot</option>\n            <option value=\"compound\">Compound %</option>\n          </select>\n        </div>\n\n        <!-- Month selector (only when Risk Mode: Compound %) -->\n        <div class=\"equity-date-group\" id=\"tf-perf-compound-group\" style=\"align-items: center; gap: 8px; display:none;\">\n          <label for=\"tf-perf-compound-months-select\" style=\"min-width: 56px;\">Month:</label>\n          <select class=\"form-input\" id=\"tf-perf-compound-months-select\" style=\"width: 120px; padding: 6px 10px;\"></select>\n        </div>\n      </div>\n    </div>\n    <!-- Time Range buttons (sync with Equity Curve & Table 3) -->\n    <div class=\"tf-time-range-row tf-perf-time-range-row\" id=\"tf-time-range-row-perf\">\n      <span class=\"tf-time-range-label\">Time Range:</span>\n      <div class=\"tf-time-range-buttons\" id=\"tf-time-range-buttons-perf\"></div>\n    </div>\n  </div>\n\n  <!-- Overall winrate bar spanning both tables (based on checked analysts) -->\n  <div class=\"tf-perf-overall\" id=\"tf-perf-overall\" style=\"display:none;\">\n    <div class=\"tf-perf-overall-row\">\n      <div class=\"tf-perf-overall-label\" id=\"tf-perf-overall-label\">Overall (All Analysts)</div>\n      <div class=\"tf-perf-count mono\" id=\"tf-perf-overall-count\"><span class=\"tf-perf-win\" id=\"tf-perf-overall-win\">0</span>/<span class=\"tf-perf-loss\" id=\"tf-perf-overall-loss\">0</span></div>\n      <div class=\"tf-perf-bar-track\" aria-hidden=\"true\">\n        <div class=\"tf-perf-bar-fill\" id=\"tf-perf-overall-fill\" style=\"width:0%\"></div>\n      </div>\n      <div class=\"tf-perf-overall-pct mono\" id=\"tf-perf-overall-pct\">0%</div>\n    </div>\n  </div>\n\n  <div class=\"tf-perf-card\">\n    <table class=\"tf-perf-table\">\n      <tbody id=\"tf-perf-body-left\"></tbody>\n    </table>\n  </div>\n  <div class=\"tf-perf-card\">\n    <table class=\"tf-perf-table\">\n      <tbody id=\"tf-perf-body-right\"></tbody>\n    </table>\n  </div>\n</div>\n\n</div>\n<div class=\"controls-row tf-mm-controls-row tf-mm-primary-row\">\n<div class=\"form-group tf-mm-main-input\">\n<label class=\"form-label\" for=\"balance-input\">Balance (USD)</label>\n<input class=\"form-input\" id=\"balance-input\" min=\"0\" placeholder=\"5000\" step=\"1\" type=\"number\"/>\n</div>\n<button class=\"btn tf-mm-action-btn\" id=\"apply-balance-btn\" type=\"button\">\n<span class=\"btn-icon\">$</span>\n          Apply Balance\n        </button>\n<div class=\"form-group tf-mm-main-input\">\n<label class=\"form-label\" for=\"risk-input\">Risk % / Trade</label>\n<input class=\"form-input\" id=\"risk-input\" min=\"0\" placeholder=\"1\" step=\"0.1\" type=\"number\"/>\n</div>\n<button class=\"btn tf-mm-action-btn\" id=\"apply-risk-btn\" type=\"button\">\n<span class=\"btn-icon\">%</span>\n          Apply Risk\n        </button>\n<button class=\"btn btn-ghost tf-mm-action-btn\" id=\"reset-defaults-btn\" type=\"button\">\n          Reset ke Default\n        </button>\n</div>\n<!-- REV288: Swap + Commission + Withdraw aligned on one second row -->\n<div class=\"controls-row tf-mm-secondary-row\" id=\"tf-mm-cost-withdraw-row\">\n<div class=\"tf-mm-inline-pair tf-mm-cost-pair\" title=\"Aktifkan biaya Swap pada setiap trade\">\n<span class=\"tf-switch tf-cost-switch tf-mm-row-switch\"><input id=\"swap-enabled-toggle\" type=\"checkbox\"/></span>\n<div class=\"form-group tf-mm-cost-input\">\n<label class=\"form-label\" for=\"swap-rate-input\">Swap ($/Lot)</label>\n<input class=\"form-input\" id=\"swap-rate-input\" min=\"0\" placeholder=\"9.01\" step=\"0.01\" title=\"Biaya swap rata-rata per 1.00 lot per trade. Perubahan langsung diterapkan.\" type=\"number\"/>\n</div>\n</div>\n<div class=\"tf-mm-inline-pair tf-mm-cost-pair\" title=\"Aktifkan biaya Commission pada setiap trade\">\n<span class=\"tf-switch tf-cost-switch tf-mm-row-switch\"><input id=\"commission-enabled-toggle\" type=\"checkbox\"/></span>\n<div class=\"form-group tf-mm-cost-input\">\n<label class=\"form-label\" for=\"commission-rate-input\">Comm ($/Lot)</label>\n<input class=\"form-input\" id=\"commission-rate-input\" min=\"0\" placeholder=\"20\" step=\"0.01\" title=\"Commission per 1.00 lot per trade. Perubahan langsung diterapkan.\" type=\"number\"/>\n</div>\n</div>\n<div class=\"tf-mm-inline-pair tf-mm-withdraw-pair\" id=\"withdraw-controls-row\">\n<span class=\"tf-switch tf-cost-switch tf-withdraw-toggle-switch tf-mm-row-switch\" title=\"Enable Withdraw\">\n<input id=\"withdraw-enabled-toggle\" type=\"checkbox\"/>\n</span>\n<div class=\"form-group tf-mm-withdraw-input-group\">\n<label class=\"form-label tf-withdraw-label-row\" for=\"withdraw-amount-input\">\n<span>Withdraw ($)</span>\n<span class=\"tf-withdraw-average\" id=\"withdraw-average-inline\">average : -</span>\n</label>\n<input class=\"form-input\" id=\"withdraw-amount-input\" min=\"0\" placeholder=\"0\" step=\"1\" type=\"number\"/>\n<div class=\"tf-withdraw-max-warning\" id=\"withdraw-max-warning\" style=\"display:none;\"></div>\n</div>\n<div class=\"form-group tf-mm-withdraw-period-group\">\n<label class=\"form-label\" for=\"withdraw-months-select\">&nbsp;</label>\n<select class=\"form-input\" id=\"withdraw-months-select\">\n<option selected=\"\" value=\"1\">1 month</option>\n<option value=\"2\">2 month</option>\n<option value=\"3\">3 month</option>\n<option value=\"4\">4 month</option>\n<option value=\"5\">5 month</option>\n<option value=\"6\">6 month</option>\n<option value=\"7\">7 month</option>\n<option value=\"8\">8 month</option>\n<option value=\"9\">9 month</option>\n<option value=\"10\">10 month</option>\n<option value=\"11\">11 month</option>\n<option value=\"12\">12 month</option>\n</select>\n</div>\n<button class=\"btn tf-mm-withdraw-btn\" id=\"withdraw-submit-btn\" type=\"button\">\n<span class=\"btn-icon\">$</span>\n          Apply Withdraw\n        </button>\n</div>\n</div>\n<div class=\"section-note\" id=\"rule1-withdraw-note\" style=\"color:#ef4444; font-weight:600; margin-bottom: 8px;\">\n  Jika trade terakhir di akhir bulan sebelumnya belum mengalami kenaikan <strong>10%</strong> dari saldo awal bulan tersebut (awal bulan pertama pakai <strong>Balance</strong> / <strong>Balance Compounded</strong>, bulan berikutnya pakai <strong>Balance PnL ($)</strong> dari <strong>trade terakhir di bulan sebelumnya</strong>), maka transaksi <strong>Withdraw</strong> di bulan berikutnya akan otomatis <strong>tidak dicentang</strong>! <span style=\"opacity:.9;\">(Berlaku jika akun belum pernah mencapai kenaikan total <strong>100%</strong>.)</span>\n</div>\n<div class=\"section-note\" id=\"rule2-withdraw-note\" style=\"color:#ef4444; font-weight:600; margin-bottom: 8px;\">\n  Jika trade terakhir di akhir bulan sebelumnya mengalami penurunan <strong>20%</strong> dari saldo awal bulan tersebut (awal bulan pertama pakai <strong>Balance</strong> / <strong>Balance Compounded</strong>, bulan berikutnya pakai <strong>Balance PnL ($)</strong> dari <strong>trade terakhir di bulan sebelumnya</strong>), maka transaksi <strong>Withdraw</strong> di bulan berikutnya juga otomatis <strong>tidak dicentang</strong>! <span style=\"opacity:.9;\">(Berlaku jika akun belum pernah mencapai kenaikan total <strong>100%</strong>.)</span>\n</div>\n<div class=\"section-note\" id=\"rule3-withdraw-note\" style=\"color:#ef4444; font-weight:600; margin-bottom: 8px;\">\n  Jika akun <strong>pernah</strong> mencapai kenaikan total <strong>100%</strong> (Balance PnL ($) pernah <strong>&gt;= 2x</strong> saldo awal bulan pertama / trade pertama), maka mulai <strong>bulan berikutnya</strong> ketentuan kenaikan <strong>10%</strong> <strong>dan</strong> penurunan <strong>20%</strong> <strong>tidak diperlukan</strong> lagi.\n</div>\n<p class=\"small-muted\" style=\"margin-bottom: 8px;\">\n        Saat kamu menekan <strong>Apply</strong>, kolom <span class=\"mono\">Balance</span>, <span class=\"mono\">Risk % / Trade</span>,\n        dan <span class=\"mono\">LOT</span> di tabel akan otomatis ter-update untuk semua analis, dan nilai <span class=\"mono\">$</span> di Table 2 ikut menyesuaikan.\n      </p>\n<!-- Analyst & Pair filter for Table 1, Table 2 and Equity Curve. When the\n           user toggles an analyst or its pairs, Table\u00a01 and Table\u00a02 update\n           accordingly. Table\u00a03 (history) remains unaffected. -->\n<div class=\"controls-row\" id=\"analyst-filter-row\" style=\"margin-bottom: 10px;\">\n<label style=\"font-size: 12px; margin-right: 8px;\">Filter:</label>\n<div id=\"analyst-filter-container\"></div>\n</div>\n<div class=\"table-wrapper\">\n<div class=\"table-scroll monthly-table-scroll\">\n<table id=\"summary-table\">\n<thead>\n<tr>\n<th style=\"width: 14%;\">Nama Analis</th>\n<th style=\"width: 14%;\">Pair</th>\n<th style=\"width: 14%;\">Select SL Pips</th>\n<th class=\"text-right\" style=\"width: 10%;\">SL FIXED PIPS (Avg. 6 Months)</th>\n<th class=\"text-right\" style=\"width: 10%;\">Avg. SL PIPS</th>\n<th class=\"text-right\" style=\"width: 10%;\">$ / Pips</th>\n<th class=\"text-right\" style=\"width: 10%;\">Lot</th>\n<th class=\"text-right\" style=\"width: 10%;\">Balance</th>\n<th class=\"text-right\" style=\"width: 8%;\">Risk % / Trade</th>\n</tr>\n</thead>\n<tbody></tbody>\n</table>\n</div>\n</div>\n</section>\n<section class=\"card\" id=\"section-monthly\">\n<div class=\"card-header\">\n<div class=\"card-title-group\">\n<h2>Table 2 \u2013 Statistics \u2013 Rekap Pips &amp; Signals per Bulan</h2>\n<div class=\"card-badge\">\n<span class=\"card-badge-dot\"></span>\n<span>Per Month Overview</span>\n</div>\n</div>\n<div class=\"section-note\">\n          Nilai di bawah bisa otomatis terisi dari hasil scan, dan juga bisa kamu edit manual.\n        </div>\n</div>\n<div class=\"chip-row\" style=\"margin-bottom: 6px;\">\n<span class=\"chip\">Format isi tiap sel bulan: baris 1 = <span class=\"mono\">Pips</span>, baris 2 = <span class=\"mono\">Signals</span>, baris 3 = <span class=\"mono\">$ (pips \u00d7 lot \u00d7 $/pips)</span>.</span>\n<span class=\"chip\">Lot diambil dari Table 1 (Balance &amp; Risk yang aktif).</span>\n</div>\n<!-- Risk Mode (for Table 2 monthly $ calculation) -->\n<div class=\"controls-row\" style=\"margin-bottom: 10px; align-items: center;\">\n<div class=\"equity-filter-ro

/* ---- HIT ---- */

mains open.
tfLicenseRecheckTimer = setInterval(() => { void tfLiveLicenseWatchTickV349(); }, 60000);
setTimeout(() => { void tfLiveLicenseWatchTickV349(); }, 450);
}
async function tfRequireLicense(options) {
const opts = options || {};
tfEnsureServerGateUi();
tfEnsureStatusTargets();
if (tfLicenseValid && tfLicenseFreshServerVerified && !opts.force) {
tfSetServerAuthorization(true);
return true;
}
if (tfLicenseCheckPromise && !opts.force)
return tfLicenseCheckPromise;
tfLicenseCheckPromise = (async () => {
if (!opts.force) {
const fastAllowed = await tfTryFastStoredLicenseGate();
if (fastAllowed)
return true;
}
tfLicenseFreshServerVerified = false;
tfShowServerGate('Connecting to server...', 'Checking license status', false);
const result = await tfValidateSavedLicense({
requireFreshServer: true,
allowStoredFallback: true,
quick: true
});
const valid = !!(result && result.valid === true);
tfLicenseValid = valid;
tfApplyLicenseResult(result, Date.now());
if (valid) {
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
tfScheduleRecheck();
if (result && result.verificationPending === true) {
tfScheduleQuickRetry();
}
try {
window.dispatchEvent(new CustomEvent('tf-license-valid', { detail: result }));
}
catch (e) { }
return true;
}
tfSetServerAuthorization(false);
if (tfIsPrimaryPopupPage()) {
tfShowLicenseUi((result && result.message) || 'Lisensi belum berhasil diverifikasi ke server.', false);
}
else {
tfShowServerGate('Validasi lisensi gagal', (result && result.message) || 'Buka popup utama untuk memeriksa aktivasi.', true);
}
try {
window.dispatchEvent(new CustomEvent('tf-license-invalid', { detail: result }));
}
catch (e) { }
return false;
})();
try {
return await tfLicenseCheckPromise;
}
finally {
tfLicenseCheckPromise = null;
}
}
async function tfRequireServerCheckOnly(options) {
const opts = options || {};
tfEnsureServerGateUi();
if (!opts.force) {
const recentHealth = await tfReadRecentServerHealth();
if (recentHealth.fresh) {
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
return true;
}
}
tfLicenseFreshServerVerified = false;
tfShowServerGate('Connecting to server...', 'Checking server availability', false);
const controller = typeof AbortController === 'function' ? new AbortController() : null;
const timeoutId = setTimeout(() => {
try {
if (controller)
controller.abort();
}
catch (e) { }
}, TF_LICENSE_GATE_REQUEST_TIMEOUT_MS);
try {
const response = await fetch(TF_LICENSE_HEALTH_URL, {
method: 'GET',
redirect: 'follow',
cache: 'no-store',
signal: controller ? controller.signal : undefined
});
if (!response.ok)
throw new Error('HTTP ' + response.status);
const parsed = JSON.parse(await response.text());
if (!parsed || (parsed.success !== true && parsed.ok !== true))
throw new Error('Server lisensi tidak siap.');
await tfSaveServerHealth(true);
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
return true;
}
catch (error) {
await tfSaveServerHealth(false);
tfLicenseFreshServerVerified = false;
tfSetServerAuthorization(false);
tfShowServerGate((typeof navigator !== 'undefined' && navigator.onLine === false)
? 'Tidak ada koneksi internet'
: 'Server belum merespons', (typeof navigator !== 'undefined' && navigator.onLine === false)
? 'Sambungkan internet lalu klik Coba Lagi.'
: 'Tunggu beberapa saat lalu klik Coba Lagi.', true);
return false;
}
finally {
clearTimeout(timeoutId);
}
}
window.addEventListener('online', () => {
if (tfLicenseValid && tfLicenseResult) {
tfApplyLicenseResult(tfNormalizeLicenseResult({
...tfLicenseResult,
valid: true,
code: 'LICENSE_VALID_CACHED',
message: 'Koneksi kembali. Memeriksa server lisensi...',
isOffline: false,
verificationPending: false,
offlineGraceExpiresAt: '',
offlineGraceRemainingSeconds: null
}), Date.now());
}
setTimeout(() => {
void tfRefreshLicenseStatus({
reloadOnSuccess: false,
showOverlayOnFailure: true
});
}, 300);
});
window.addEventListener('offline', () => {
if (!tfLicenseValid || !tfLicenseResult)
return;
void tfReadStoredLicense().then((snapshot) => {
const evaluation = tfEvaluateStoredLicense(snapshot);
if (!evaluation.usable)
return;
const estimatedServerNow = tfEstimateServerNowMs(snapshot.result, snapshot.checkedAt);
tfApplyLicenseResult(tfNormalizeLicenseResult({
...tfLicenseResult,
valid: true,
code: 'LICENSE_VALID_OFFLINE_GRACE',
message: 'Offline — verifikasi lisensi ditunda.',
serverTime: new Date(estimatedServerNow).toISOString(),
isOffline: true,
offlineGraceExpiresAt: evaluation.graceExpiresAt
? new Date(evaluation.graceExpiresAt).toISOString()
: '',
offlineGraceRemainingSeconds: evaluation.graceRemainingMs === null
? null
: Math.max(0, Math.ceil(evaluation.graceRemainingMs / 1000))
}), Date.now());
});
});

window.addEventListener('focus', () => { if (tfLicenseValid) void tfLiveLicenseWatchTickV349(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden && tfLicenseValid) void tfLiveLicenseWatchTickV349(); });
function tfGetISignalUsersAccessState() {
const result = tfLicenseResult || {};
const known = result.isignalUsersAccessKnown === true;
const duration = String(result.duration || '').trim().toUpperCase();
const reason = String(result.isignalUsersAccessReason || '').trim().toUpperCase();
const expiresAt = String(result.isignalUsersExpiresAt || '');
const included = result.isignalUsersIncluded === true;
const addonRequired = result.isignalUsersAddonRequired === true;
const addonPlan = String(result.isignalUsersPlan || '').trim().toUpperCase();
let access = result.valid === true && result.isignalUsersAccess === true;
let remainingSeconds = result.isignalUsersRemainingSeconds;
if (access && !included && expiresAt) {
const expiryMs = Date.parse(expiresAt);
const serverNowMs = Date.now() + tfLicenseServerOffsetMs;
if (Number.isFinite(expiryMs)) {
remainingSeconds = Math.max(0, Math.floor((expiryMs - serverNowMs) / 1000));
if (remainingSeconds <= 0)
access = false;
}
}
return {
known,
access,
included,
addonRequired,
addonPlan,
duration,
expiresAt,
remainingSeconds,
reason: access ? (reason || (included ? 'INCLUDED_IN_PLAN' : 'ADDON_ACTIVE')) : (reason || 'ACCESS_NOT_AVAILABLE'),
email: tfNormalizeEmail(result.email || '')
};
}
try {
if (document.body) {
tfShowServerGate('Connecting to server...', 'Checking license status', false);
}
else {
document.addEventListener('DOMContentLoaded', () => {
tfShowServerGate('Connecting to server...', 'Checking license status', false);
}, { once: true });
}
}
catch (e) { }
window.tfRequireLicense = tfRequireLicense;
window.tfRequireServerCheckOnly = tfRequireServerCheckOnly;
window.tfValidateSavedLicense = tfValidateSavedLicense;
window.tfRefreshLicenseStatus = tfRefreshLicenseStatus;
window.tfLicenseApiUrl = TF_LICENSE_API_URL;
window.tfGetLicenseResult = () => ({ ...(tfLicenseResult || {}) });
window.tfGetISignalUsersAccessState = tfGetISignalUsersAccessState;
tfEnsureLicenseUi();
tfEnsureStatusTargets();
})();
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
function tf_formatMyfxbookPrice(raw) 

/* ---- HIT ---- */

~~~
## FILE 901c62026afc22f4.js
~~~js
ase().replace(/[^A-Z0-9]/g, '');
const missing = [];
const rowBySym = new Map();
for (const r of rows) {
const rs = normSym(getSymbolFromRow(r));
if (rs && !rowBySym.has(rs))
rowBySym.set(rs, r);
}
function findRowForSymbol(symRaw) {
const key = normSym(symRaw);
if (!key)
return null;
let row = rowBySym.get(key) || null;
if (row)
return row;
for (const r of rows) {
const rs = normSym(getSymbolFromRow(r));
if (!rs)
continue;
if (rs === key || rs.includes(key) || key.includes(rs))
return r;
}
return null;
}
if (wantCount > 0) {
const wantSet = new Set(wantEntries.map(([s]) => normSym(s)));
for (const r of rows) {
const rs = normSym(getSymbolFromRow(r));
const cb = getCheckboxInRow(r);
if (cb && cb.checked && rs && !wantSet.has(rs)) {
const toggleTarget = r.querySelector('span.slider.round') || r.querySelector('label.switch') || cb || r;
try {
clickEl(toggleTarget);
}
catch (e) {
try {
clickEl(cb || r);
}
catch (_) { }
}
await sleep(250);
if (cb.checked) {
cb.checked = false;
cb.dispatchEvent(new Event('change', { bubbles: true }));
await sleep(250);
}
}
}
}
if (wantCount > 0) {
for (const [sym] of wantEntries) {
const row = findRowForSymbol(sym);
if (!row) {
missing.push(sym);
continue;
}
const cb = getCheckboxInRow(row);
if (cb && !cb.checked) {
const toggleTarget = row.querySelector('span.slider.round') || row.querySelector('label.switch') || cb || row;
try {
clickEl(toggleTarget);
}
catch (e) {
try {
clickEl(cb || row);
}
catch (_) { }
}
await sleep(250);
if (!cb.checked) {
try {
clickEl(row);
}
catch (e) { }
await sleep(250);
}
if (!cb.checked) {
cb.checked = true;
cb.dispatchEvent(new Event('change', { bubbles: true }));
await sleep(250);
}
}
}
}
if (missing.length) {
const avail = Array.from(rowBySym.keys()).slice(0, 40).join(', ');
const suffix = avail ? ` | Available: ${avail}` : '';
return { ok: false, code: 'PAIR_NOT_FOUND', reason: `Pairs not found: ${missing.join(', ')}${suffix}` };
}
const notReady = [];
if (wantCount > 0) {
for (const [sym, lot] of wantEntries) {
const row = findRowForSymbol(sym);
if (!row) {
notReady.push(`${sym} (row missing)`);
continue;
}
const cb = getCheckboxInRow(row);
if (!cb || !cb.checked) {
notReady.push(`${sym} (not checked)`);
continue;
}
const lotInput = getLotInputInRow(row);
if (!lotInput) {
notReady.push(`${sym} (lot input missing)`);
continue;
}
if (lotInput.disabled) {
const enabled = await waitFor(() => (!lotInput.disabled ? lotInput : null), 3000, 100);
if (!enabled) {
notReady.push(`${sym} (lot input disabled)`);
continue;
}
}
setInputValue(lotInput, lot);
lotInput.dispatchEvent(new Event('change', { bubbles: true }));
await sleep(250);
const cur = String(lotInput.value || '').trim();
const exp = String(lot || '').trim();
if (exp) {
const a = parseFloat(cur);
const b = parseFloat(exp);
const ok = (cur === exp) || (isFinite(a) && isFinite(b) && Math.abs(a - b) < 1e-6);
if (!ok)
notReady.push(`${sym} (value ${cur || '∅'})`);
}
}
}
if (notReady.length) {
return { ok: false, code: 'PAIR_NOT_READY', reason: `Pairs not ready: ${notReady.join(', ')}` };
}
const next1 = await waitFor(() => {
return document.querySelector('a.next-setlot-page-one-recconect, a.next-setlot-page-one-reconnect, a.next-setlot-page-one, a[name="md-submit"].next-setlot-page-one-recconect') ||
Array.from(document.querySelectorAll('a,button')).find(x => isVisible(x) && (x.textContent || '').trim().toLowerCase() === 'selanjutnya');
}, 15000, 250);
if (!next1)
return { ok: false, code: 'NEXT1_NOT_FOUND', reason: 'Next button (page1 reconnect) not found' };
clickEl(next1);
await sleep(400);
let pwdInput = null;
let pwdTry = 0;
while (!pwdInput) {
pwdInput = await waitFor(() => {
const p = Array.from(document.querySelectorAll('input[type="password"]')).find(x => isVisible(x));
return p || null;
}, 8000, 250);
if (pwdInput)
break;
pwdTry++;
const nextAgain = document.querySelector('a.next-page-setting-lot-size, button.next-page-setting-lot-size') ||
Array.from(document.querySelectorAll('a,button')).find(x => isVisible(x) && (x.textContent || '').trim().toLowerCase() === 'selanjutnya') ||
null;
if (nextAgain) {
clickEl(nextAgain);
}
await sleep(700);
}
setInputValue(pwdInput, password || '');
await sleep(250);
const next2 = await waitFor(() => {
return document.querySelector('a.next-page-password-setting, button.next-page-password-setting') ||
Array.from(document.querySelectorAll('a,button')).find(x => isVisible(x) && (x.textContent || '').trim().toLowerCase() === 'selanjutnya');
}, 15000, 250);
if (!next2)
return { ok: false, code: 'NEXT2_NOT_FOUND', reason: 'Next button (password) not found' };
clickEl(next2);
await sleep(400);
const step2 = await waitFor(() => {
const t = getAnyNotifText();
const tl = String(t || '').toLowerCase();
if (tl.includes('menunggu 5 menit'))
return { kind: 'cooldown', text: t };
if (tl.includes('tidak dapat menyambungkan') || tl.includes('salah password'))
return { kind: 'err', text: t };
const y = Array.from(document.querySelectorAll('button, a')).find(x => isVisible(x) && (x.textContent || '').trim().toLowerCase() === 'ya');
if (y)
return { kind: 'ok', yesBtn: y };
return null;
}, 15000, 200);
if (step2 && step2.kind === 'cooldown') {
return { ok: false, code: 'COOLDOWN_WAIT', reason: String(step2.text || 'menunggu 5 menit') };
}
if (step2 && step2.kind === 'err') {
return { ok: false, code: 'PASSWORD_INVALID', reason: String(step2.text || 'Password salah') };
}
const yesBtn = step2 && step2.kind === 'ok' ? step2.yesBtn : null;
if (!yesBtn)
return { ok: false, code: 'YES_NOT_FOUND', reason: 'Button Ya tidak ditemukan' };
clickEl(yesBtn);
await sleep(500);
const success = await waitFor(() => {
const b = document.querySelector('.text-header-notif.text-notif-render b, .text-header-notif b');
const t = (b && b.textContent) ? b.textContent.trim() : '';
const tl = t.toLowerCase();
if (tl.includes('berhasil disambungkan kembali'))
return t;
if (tl.includes('berhasil') && tl.includes('disambungkan'))
return t;
return null;
}, 20000, 250);
if (!success) {
const n2 = cardRoot.querySelector('.notif-of-card');
if (n2 && isVisible(n2)) {
return { ok: false, code: 'RECONNECT_NOT_CONFIRMED', reason: 'Reconnect belum terkonfirmasi (notif sukses tidak ditemukan)' };
}
return { ok: true, code: 'RECONNECTED_OK', reason: 'Akun MetaTrader berhasil disambungkan kembali' };
}
return { ok: true, code: 'RECONNECTED_OK', reason: success };
}
});
const payload = results && results[0] ? results[0].result : null;
shouldCloseTab = !!(payload && payload.ok);
sendResponse({
ok: !!(payload && payload.ok),
tabId,
code: payload && payload.code ? payload.code : '',
reason: payload && payload.reason ? payload.reason : '',
detail: payload || null
});
}
catch (e) {
sendResponse({ ok: false, error: String(e) });
}
finally {
if (shouldCloseTab && tabId != null) {
try {
await bg_sleep(350);
}
catch (e) { }
try {
await bg_removeTab(tabId);
}
catch (e) { }
}
if (tabId != null) {
try { bg_releaseSilentTab(tabId); } catch (e) { }
}
}
})();
return true;
}
if (msg.type === 'ensure_myfxbook_prices') {
(async () => {
try {
const res = await bg_ensureMyfxbookPrices({ force: !!(msg && msg.force) });
sendResponse(res || { ok: false, error: 'Unknown error' });
}
catch (e) {
sendResponse({ ok: false, error: String(e) });
}
})();
return true;
}
if (msg.type === 'tf_fetch_broker_platform_ids') {
(async () => {
let createdTabId = null;
try {
const normalizeProfileUrl = (value) => {
try {
const u = new URL(String(value || ''), 'https://account.tradersfamily.id/');
if (u.hostname !== 'account.tradersfamily.id' || !/\/profile\/u\/\d+\/?/i.test(u.pathname))
return '';
u.protocol = 'https:';
u.searchParams.set('tab', 'settings');
u.searchParams.set('tfscan', '1');
return u.href;
}
catch (e) {
return '';
}
};
const storage = await bg_storageLocalGet(['tfCurrentProfileUrl', 'tfUserProfile', 'tfIsignalUsersPlatformIds', 'tfIsignalUsersMgmt_v1']);
const cachedIds = [];
const addCachedId = (value) => {
const id = String(value == null ? '' : value).trim();
if (id && !cachedIds.includes(id))
cachedIds.push(id);
};
try {
(Array.isArray(storage && storage.tfIsignalUsersPlatformIds) ? storage.tfIsignalUsersPlatformIds : []).forEach(addCachedId);
const cfg = storage && storage.tfIsignalUsersMgmt_v1 && typeof storage.tfIsignalUsersMgmt_v1 === 'object' ? storage.tfIsignalUsersMgmt_v1 : null;
(Array.isArray(cfg && cfg.platformIds) ? cfg.platformIds : []).forEach(addCachedId);
Object.keys(cfg && cfg.users && typeof cfg.users === 'object' ? cfg.users : {}).forEach(addCachedId);
}
catch (e) { }
const candidates = [];
const addCandidate = (value) => {
const url = normalizeProfileUrl(value);
if (url && !candidates.includes(url))
candidates.push(url);
};
addCandidate(msg && msg.url ? msg.url : '');
addCandidate(storage && storage.tfCurrentProfileUrl ? storage.tfCurrentProfileUrl : '');
try {
const storedProfile = storage && storage.tfUserProfile && typeof storage.tfUserProfile === 'object' ? storage.tfUserProfile : null;
addCandidate(storedProfile && (storedProfile.profileUrl || storedProfile.url) ? (storedProfile.profileUrl || storedProfile.url) : '');
}
catch (e) { }
const legacyProfileFallback = 'https://account.tradersfamily.id/profile/u/155921/?tab=settings';
const inspectForProfile = async (tabId) => {
try {
const results = await chrome.scripting.executeScript({
target: { tabId },
func: () => {
const text = (el) => String(el && (el.innerText || el.textContent) || '').trim();
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect();
return !!(r && r.width > 0 && r.height > 0);
}
catch (e) { return false; }
};
const href = String(location.href || '');
const loginForm = document.querySelector('form.form-signin, form#loginForm, input#logname, input#logpass');
const loggedOutMenu = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean).find(visible);
if (loggedOutMenu)
return { ok: false, error: 'NOT_LOGGED_IN' };
const loggedUi = document.querySelector('#username_text, .pull-left.info, li.dropdown.user a[href*="/logout/"], a[href*="/logout/"], a[href*="/profile/u/"]');
const explicitLogin = /(?:\?|&)tfAuth=1(?:&|$)/i.test(href) || /\/login(?:mt)?\/?(?:$|[?#])/i.test(href) || /\/auth\//i.test(href);
if (explicitLogin && loginForm && visible(loginForm) && !loggedUi)
return { ok: false, error: 'NOT_LOGGED_IN' };
let profileUrl = '';
const nodes = Array.from(document.querySelectorAll('a[href*="/profile/u/"], [data-url*="/profile/u/"], [data-href*="/profile/u/"]'));
for (const node of nodes) {
const raw = node.getAttribute('href') || node.getAttribute('data-url') || node.getAttribute('data-href') || '';
const m = String(raw).match(/\/profile\/u\/\d+\/?(?:\?[^"'<>\s]*)?/i);
if (m) {
try { profileUrl = new URL(m[0], location.origin).href; } catch (e) { profileUrl = m[0]; }
break;
}
}
if (!profileUrl) {
const html = String(document.documentElement && document.documentElement.innerHTML || '');
const m = html.match(/\/profile\/u\/\d+\/?(?:\?[^"'<>\s]*)?/i);
if (m) {
try { profileUrl = new URL(m[0], location.origin).href; } catch (e) { profileUrl = m[0]; }
}
}
if (!profileUrl && /\/profile\/u\/\d+\/?/i.test(location.pathname))
profileUrl = location.href;
const imgEl = document.querySelector('.pull-left.image img.img-circle, .pull-left.image img, .user-panel img, li.dropdown.user img, .user-menu img, .user-header img, a[href*="/profile/u/"] img, [data-user-avatar] img, header .img-circle, img[class*="avatar"], img[class*="profile"]');
const nameEl = document.querySelector('.pull-left.info #username_text, .pull-left.info p.truncate, #username_text, .user-panel .info p, [data-user-name]');
let email = '';
const mailEl = document.querySelector('a[href^="mailto:"]');
if (mailEl) email = String(mailEl.getAttribute('href') || '').replace(/^mailto:/i, '').trim().toLowerCase();
return {
ok: true,
profileUrl,
profile: {
name: text(nameEl),
email,
avatarUrl: String(imgEl && (imgEl.getAttribute('src') || imgEl.getAttribute('data-src')) || '').trim(),
statusText: loggedUi ? 'Online' : ''
}
};
}
});
return results && results[0] ? (results[0].result || null) : null;
}
catch (e) { return null; }
};
// Discover the current UID from already-open authenticated tabs before using fallback.
try {
const tabs = await new Promise((resolve) => chrome.tabs.query({ url: 'https://account.tradersfamily.id/*' }, (items) => resolve(items || [])));
for (const tab of tabs) {
if (!tab || tab.id == null) continue;
const found = await inspectForProfile(tab.id);
if (found && found.profileUrl) addCandidate(found.profileUrl);
}
}
catch (e) { }
// REV59 compatibility fallback. Dynamic UID candidates are tried first;
// the former stable Settings URL remains available when discovery fails.
addCandidate(legacyProfileFallback);
const scrapeSettings = async (profileUrl) => {
let tabId = null;
try {
const tab = await bg_createTransientSilentTab(profileUrl, sender && sender.tab ? sender.tab.id : null);
tabId = tab && tab.id != null ? tab.id : null;
createdTabId = tabId;
if (tabId == null) return { ok: false, error: 'TAB_CREATE_FAILED' };
await bg_waitForTabLoaded(tabId, 45000);
try { await bg_restoreSilentOwner(tabId); } catch (e) { }
await bg_sleep(650);
const results = await chrome.scripting.executeScript({
target: { tabId },
func: async () => {
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const text = (el) => String(el && (el.innerText || el.textContent) || '').trim();
const visible = (el) => {
try {
if (!el) return false;
const cs = getComputedStyle(el);
if (cs && (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0')) return false;
const r = el.getBoundingClientRect();
return !!(r && r.width > 0 && r.height > 0);
}
catch (e) { return false; }
};
const href = String(location.href || '');
const loginForm = document.querySelector('form.form-signin, form#loginForm, input#logname, input#logpass');
const loggedOutMenu = [
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('li.user.user-menu.m a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean).find(visible);
if (loggedOutMenu)
return { ok: false, error: 'NOT_LOGGED_IN' };
const loggedUi = document.querySelector('#username_text, .pull-left.info, li.dropdown.user a[href*="/logout/"], a[href*="/logout/"], a[href*="/profile/u/"]');
const explicitLogin = /(?:\?|&)tfAuth=1(?:&|$)/i.test(href) || /\/login(?:mt)?\/?(?:$|[?#])/i.test(href) || /\/auth\//i.test(href);
if (explicitLogin && loginForm && visible(loginForm) && !loggedUi)
return { ok: false, error: 'NOT_LOGGED_IN' };
const brokerLink = document.querySelector('li#tab-broker a[href="#broker"], #tab-broker a, a[data-track="gtm_c_pf_tab_broker"], a[href*="tab=broker"], a[href="#broker"]');
if (brokerLink) { try { brokerLink.click(); } catch (e) { } }
const ids = [];
const addId = (value) => {
let id = String(value == null ? '' : value).trim();
id = id.replace(/^[\s:#-]+|[\s,;]+$/g, '').replace(/\s+/g, '');
if (!id || id.length < 4 || id.length > 32) return;
if (!/^[A-Za-z0-9._-]+$/.test(id) || !/\d/.test(id)) return;
if (/^(platform|broker|account|metatrader|subscription|active|inactive|settings)$/i.test(id)) return;
if (!ids.includes(id)) ids.push(id);
};
const scan = () => {
const exactTable = document.querySelector('#account-list-content table.profile-tbl tbody');
if (exactTable) {
exactTable.querySelectorAll('tr').forEach((tr) => {
const tds = tr.querySelectorAll('td.data');
if (tds && tds.length >= 2) addId(text(tds[1]));
});
}
const roots = [document.querySelector('#account-list-content'), document.querySelector('#broker'), document.querySelector('.tab-pane#broker'), document].filter(Boolean);
for (const root of roots) {
root.querySelectorAll('[data-platform-id]').forEach((el) => addId(el.getAttribute('data-platform-id')));
root.querySelectorAll('.platform-id, .platformId, [class*="platform-id"], [id*="platform-id"]').forEach((el) => { addId(el.getAttribute('data-value')); addId(text(el)); });
root.querySelectorAll('table tbody tr').forEach((tr) => {
const cells = Array.from(tr.querySelectorAll('td, th'));
const dataCells = Array.from(tr.querySelectorAll('td.data'));
if (dataCells.length >= 2) addId(text(dataCells[1]));
const idx = cells.findIndex((cell) => /platform\s*id/i.test(text(cell)));
if (idx >= 0) {
for (let i = idx + 1; i < cells.length; i++) { const v = text(cells[i]); if (v) { addId(v); break; } }
const m = text(tr).match(/platform\s*id\s*[:#-]?\s*([A-Za-z0-9._-]{4,32})/i);
if (m) addId(m[1]);
}
});
root.querySelectorAll('.card, .account-card, .platform-card, .broker-card, .form-group, .row').forEach((el) => {
const raw = text(el);
if (!/platform\s*id/i.test(raw)) return;
const m = raw.match(/platform\s*id\s*[:#-]?\s*([A-Za-z0-9._-]{4,32})/i);
if (m) addId(m[1]);
});
}
};
for (let attempt = 0; attempt < 100; attempt++) {
scan();
if (ids.length) break;
const loginNow = document.querySelector('form.form-signin, form#loginForm, input#logname, input#logpass');
const loggedOutNow = [
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean).find(visible);
if (loggedOutNow)
return { ok: false, error: 'NOT_LOGGED_IN' };
const accountNow = document.querySelector('#username_text, .pull-left.info, a[href*="/logout/"], a[href*="/profile/u/"]');
if (attempt > 8 && loginNow && visible(loginNow) && !accountNow)
return { ok: false, error: 'NOT_LOGGED_IN' };
await sleep(250);
}
scan();
const imgEl = document.querySelector('.pull-left.image img.img-circle, .pull-left.image img, .user-panel img, li.dropdown.user img, .user-menu img, .user-header img, a[href*="/profile/u/"] img, [data-user-avatar] img, header .img-circle, img[class*="avatar"], img[class*="profile"]');
const nameEl = document.querySelector('.pull-left.info #username_text, .pull-left.info p.truncate, #username_text, .user-panel .info p, [data-user-name]');
let email = '';
const mailEl = document.querySelector('a[href^="mailto:"]');
if (mailEl) email = String(mailEl.getAttribute('href') || '').replace(/^mailto:/i, '').trim().toLowerCase();
return {
ok: true,
platformIds: ids,
profileUrl: location.href,
profile: { name: text(nameEl), email, avatarUrl: String(imgEl && (imgEl.getAttribute('src') || imgEl.getAttribute('data-src')) || '').trim(), statusText: 'Online' }
};
}
});
return results && results[0] ? (results[0].result || null) : null;
}
finally {
if (tabId != null) { try { await bg_removeTab(tabId); } catch (e) { } }
if (createdTabId === tabId) createdTabId = null;
}
};
let lastError = 'PROFILE_URL_NOT_FOUND';
let successfulPayload = null;
for (const profileUrl of candidates) {
const payload = await scrapeSettings(profileUrl);
if (payload && payload.ok) {
successfulPayload = payload;
if (Array.isArray(payload.platformIds) && payload.platformIds.length) break;
}
if (payload && payload.error) lastError = String(payload.error);
}
if (!successfulPayload) {
// Last dynamic attempt: open account root, discover profile URL, then retry.
let rootTabId = null;
try {
const rootTab = await bg_createTransientSilentTab('https://account.tradersfamily.id/?tfscan_profile_resolve=1&ts=' + Date.now(), sender && sender.tab ? sender.tab.id : null);
rootTabId = rootTab && rootTab.id != null ? rootTab.id : null;
if (rootTabId != null) {
await bg_waitForTabLoaded(rootTabId, 45000);
await bg_sleep(900);
const found = await inspectForProfile(rootTabId);
if (found && found.profileUrl) successfulPayload = await scrapeSettings(normalizeProfileUrl(found.profileUrl));
if (found && found.error) lastError = String(found.error);
}
}
catch (e) { lastError = String(e && e.message ? e.message : e); }
finally { if (rootTabId != null) { try { await bg_removeTab(rootTabId); } catch (e) { } } }
}
if (!successfulPayload || !successfulPayload.ok) {
if (cachedIds.length) {
sendResponse({ ok: true, platformIds: cachedIds, cached: true, warning: lastError });
return;
}
sendResponse({ ok: false, error: lastError || 'Gagal mengambil Platform ID.' });
return;
}
const platformIds = Array.from(new Set((Array.isArray(successfulPayload.platformIds) ? successfulPayload.platformIds : []).map((v) => String(v || '').trim()).filter(Boolean)));
const storedProfile = storage && storage.tfUserProfile && typeof storage.tfUserProfile === 'object' ? storage.tfUserProfile : {};
const liveProfile = successfulPayload.profile && typeof successfulPayload.profile === 'object' ? successfulPayload.profile : {};
const mergedProfile = {
name: String(liveProfile.name || storedProfile.name || '').trim(),
email: String(liveProfile.email || storedProfile.email || '').trim().toLowerCase(),
avatarUrl: String(liveProfile.avatarUrl || storedProfile.avatarUrl || '').trim(),
statusText: 'Online',
profileUrl: normalizeProfileUrl(successfulPayload.profileUrl || candidates[0] || '')
};
await bg_storageLocalSet({
tfIsignalUsersPlatformIds: platformIds.length ? platformIds : cachedIds,
tfIsignalUsersPlatformIdsAt: Date.now(),
tfCurrentProfileUrl: mergedProfile.profileUrl || normalizeProfileUrl(candidates[0] || ''),
tfCurrentProfileUrlAt: Date.now(),
tfUserProfile: mergedProfile,
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: true,
tfForceLoginForm: false
});
sendResponse({ ok: true, platformIds: platformIds.length ? platformIds : cachedIds, profileUrl: mergedProfile.profileUrl, profile: mergedProfile });
}
catch (e) {
try {
const cached = await bg_storageLocalGet(['tfIsignalUsersPlatformIds']);
const ids = Array.isArray(cached && cached.tfIsignalUsersPlatformIds) ? cached.tfIsignalUsersPlatformIds : [];
if (ids.length) sendResponse({ ok: true, platformIds: ids, cached: true, warning: String(e && e.message ? e.message : e) });
else sendResponse({ ok: false, error: String(e && e.message ? e.message : e) });
}
catch (x) { sendResponse({ ok: false, error: String(e && e.message ? e.message : e) }); }
}
finally {
if (createdTabId != null) { try { await bg_removeTab(createdTabId); } catch (e) { } }
}
})();
return true;
}
if (msg.type === 'tf_scan_active_isigna

/* ---- HIT ---- */

tabs && tabs[0]) ? tabs[0] : null);
});
}
catch (e) { resolve(null); }
});
}

async function bg_resolveSilentOwner(preferredOwnerTabId = null) {
let owner = await bg_getTabSafe(preferredOwnerTabId);
if (!owner) owner = await bg_getForegroundTabSafe();
return owner || null;
}

// Kept as no-ops for compatibility with older call sites. REV164 no longer
// records a fixed owner tab and never restores focus programmatically.
function bg_releaseSilentTab(tabId) { void tabId; }
async function bg_restoreSilentOwner(tabId) { void tabId; }

async function bg_createSilentTab(url, preferredOwnerTabId = null) {
const owner = await bg_resolveSilentOwner(preferredOwnerTabId);
const ownerWindowId = owner && owner.windowId != null ? owner.windowId : null;
return bg_createTab(url, false, ownerWindowId);
}

async function bg_createTransientSilentTab(url, preferredOwnerTabId = null) {
return bg_createSilentTab(url, preferredOwnerTabId);
}

function bg_createWindowWithUrl(url, opts) {
return new Promise((resolve) => {
try {
const createData = {
url: url,
type: (opts && opts.type) ? String(opts.type) : 'normal',
focused: false,
width: (opts && typeof opts.width === 'number') ? opts.width : 1250,
height: (opts && typeof opts.height === 'number') ? opts.height : 900
};
chrome.windows.create(createData, async (w) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const windowId = (w && w.id != null) ? w.id : null;
let tabId = null;
try {
if (w && w.tabs && w.tabs.length && w.tabs[0] && w.tabs[0].id != null) {
tabId = w.tabs[0].id;
}
else if (windowId != null) {
const tabs = await new Promise((res) => {
try {
chrome.tabs.query({ windowId }, (t) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
res(t || []);
});
}
catch (e) {
res([]);
}
});
if (tabs && tabs[0] && tabs[0].id != null)
tabId = tabs[0].id;
}
}
catch (e) { }
resolve({ windowId, tabId });
});
}
catch (e) {
resolve({ windowId: null, tabId: null });
}
});
}
function bg_removeWindow(windowId) {
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
const tabs = await chrome.tabs.query({ url: ['https://account.tradersfamily.id/*', 'https://tradersfamily.id/*'] });
for (const tab of (tabs || [])) {
if (!tab || tab.id == null) continue;
try {
await chrome.tabs.reload(tab.id, { bypassCache: true });
}
catch (e) { }
}
}
catch (e) { }
}
async function bg_markStrictUpdateLogout() {
const now = Date.now();
try {
await bg_storageLocalSet({
tfLoginConfi

/* ---- HIT ---- */

~~~
## FILE 894f18e8a37bd7c6.js
~~~js
shTimer = null;
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
function isGloballyChecked(analystNa

/* ---- HIT ---- */

Quote = 100000 * pipSize;
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
arrow.textContent = '▶';
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
li.appendChild(subUl);
arrow.addEventListener('click', (e) => {
e.preventDefault();
e.stopPropagation();
const openMenus = document.querySelectorAll('.analyst-filter-item .sub-menu');
openMenus.forEach((menu) => {
if (menu !== subUl && m

/* ---- HIT ---- */

-amount-input');
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
tr.appendChild(lotCell);
const dollarCell = document.createElement('td');
dollarCell.className = 'text-right mono';
if (priceBusy) {
dollarCell.innerHTML = tf_spinnerHTML(true);
}
else {
dollarCell.textContent = dollarPerPip > 0 ? formatNumber(dollarPerPip, 2) : '-';
}
tr.appendChild(dollarCell);
const balanceCell = document.createElement('td');
balanceCell.className = 'text-right mono';
balanceCell.textContent = formatMoney(currentBalance);
tr.appendChild(balanceCell);
const riskCell = document.createElement('td');
riskCell.className = 'text-right mono';
const riskInput = document.createElement('input');
riskInput.type = 'number';
riskInput.inputMode = 'decimal';
riskInput.min = '0';
riskInput.step = '0.1';
riskInput.className = 'form-input mono tf-summary-risk-input';
riskInput.style.padding = '2px 4px';
riskInput.style.textAlign = 'left';
riskInput.style.width = '58px';
const analystRisk = getRiskPercentForAnalyst(baseName, rowPair || primaryPair);
riskInput.value = Number.isFinite(analystRisk) ? analystRisk.toString() : '';
riskInput.addEventListener('change', () => {
const v = safeParseFloat(riskInput.value);
if (v === null || v < 0) {
setAnalystRiskOverride(baseName, rowPair || primaryPair, null);
riskInput.value = formatNumber(currentRiskPercent, 2);
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
perfCompGroup.style.display = (desiredRisk === 'compound') ? '' : 'none';
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
perfRiskGroup.style.display = showUsdControls ? '' : 'none';
if (!showUsdControls) {
if (perfCompGroup)
perfCompGroup.style.display = 'none';
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
perfCompGroup.style.display = (desiredRisk === 'compound') ? '' : 'none';
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
if (typeof sk === 'number' && isFinite(sk)

/* ---- HIT ---- */

ontent = (it.isNegative ? "-" : "") + pct.toFixed(0) + "%";
tdPct.classList.toggle('tf-perf-neg', !!it.isNegative);
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
const dollars = pips * lot * dollarPerPip;
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
}
});
if (Array.isArray(tf_incomeMonthKeys) && tf_incomeMonthKeys.length && Number.isFinite(lotFixedIncome) && lotFixedIncome > 0 && dollarPerPip > 0) {
tf_incomeMonthKeys.forEach((monthKey) => {
const s = aStats[monthKey];
if (!s || typeof s.pips !== 'number')
return;
tf_incomeTotalsFixed[monthKey] += s.pips * lotFixedIncome * dollarPerPip;
});
}
});
const incomeValuesGross = [];
const incomeValuesNet = [];
const monthlyGrossByMonth = [];
const totalRow = document.createElement('tr');
totalRow.className = 'monthly-total-row';
const totalLabelCell = document.createElement('td');
totalLabelCell.colSpan = 3;
totalLabelCell.textContent = 'Total semua analis';
totalLabelCell.classList.add('monthly-sticky-col-1');
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
{ key: 'pnlPercent', label: 'PnL %', defaultVisible: true },
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
return TF_HISTORY_COLUMN_OPTIONS.filter((col) => visibility[col.key] !== false).map((col) => col.key);
}
function tf_markHistoryCell(cell, key) {
if (!cell)
return cell;
try {
cell.setAttribute('data-history-col', key);
}
catch (e) { }
const visibility = tf_getHistoryColumnVisibility();
const shouldHide = visibility[key] === false;
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
TF_HISTORY_COLUMN_OPTI

/* ---- HIT ---- */

 (e) { }
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
runningTrade += pnlDollar;
runningEquity += pnlDollar;
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
try {
const startBal = Number.isFinite(startingBalance) ? startingBalance : 0;
const trStart = document.createElement('tr');
trStart.className = 'tf-start-balance-row';
const tdStart = document.createElement('td');
tdStart.colSpan = Math.max(1, tf_getVisibleHistoryColumnKeys().length + 1);
tdStart.className = 'mono';
const sbLabel = (riskMode === 'compound') ? 'Start Balance Compounded' : 'Start Balance';
tdStart.textContent = sbLabel + ' : ' + formatMoney(startBal);
trStart.appendChild(tdStart);
tbody.appendChild(trStart);
}
catch (e) { }
const rowsForDisplay = rows.slice().sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
try {
let __runEq = startingBalance;
let __runTrade = startingBalance;
for (let i = 0; i < rowsForDisplay.length; i++) {
const r = rowsForDisplay[i];
if (!r)
continue;
const __pnl = (Number.isFinite(r.pnlDollar) ? r.pnlDollar : ((r.dollarTP || 0) - (r.dollarSL || 0)));
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
window.__tfHistoryDynamicTradeCount = Array.isArray(rowsForUi)
? rowsForUi.filter((r) => !(r && r.isWithdraw)).length
: 0;
}
catch (e) { window.__tfHistoryDynamicTradeCount = 0; }
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
rowsForUi.forEach((row) => {
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
const balanceCell = tf_markHistoryCell(document.createElement('td'), 'balancePnl');
balanceCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
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
const enabledRows = tf_applyStartTradeCreatedClosedRule(__rowsEnabled);
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
emptyNote.textContent = 'Belum ada data history untuk digambar. Tambahkan baris di Table 3 atau lakukan Scan dari extension.';
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
const pnlDollar = (Number.isFinite(row.pnlDollar) ? row.pnlDollar : ((row.dollarTP || 0) - (row.dollarSL || 0)));
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
pnlPercent: Number.isFinite(Number(row.pnlPercent)) ? Number(row.pnlPercent) : 0,
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
drawEquityCurve();
computeAndRenderEquityDrawdownSummary();
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
endKey = equityFilterMax

/* ---- HIT ---- */

r');
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
const balanceCell = tf_markHistoryCell(document.createElement('td'), 'balancePnl');
balanceCell.className = 'text-right mono ' + ((row.pnlDollar >= 0) ? 'tp' : 'sl');
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
const enabledRows = tf_applyStartTradeCreatedClosedRule(__rowsEnabled);
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
emptyNote.textContent = 'Belum ada data history untuk digambar. Tambahkan baris di Table 3 atau lakukan Scan dari extension.';
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
const pnlDollar = (Number.isFinite(row.pnlDollar) ? row.pnlDollar : ((row.dollarTP || 0) - (row.dollarSL || 0)));
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
pnlPercent: Number.isFinite(Number(row.pnlPercent)) ? Number(row.pnlPercent) : 0,
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
drawEquityCurve();
computeAndRenderEquityDrawdownSummary();
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
const baseHeight = 450;
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
const paddingRight = 18;
const paddingTop = 18;
const paddingBottom = 44;
const chartWidth = width - paddingLeft - paddingRight;
const chartHeight = baseHeight - paddingTop - paddingBottom;
if (chartWidth <= 0 || chartHeight <= 0)
return;
const isCandleMode = (equityChartMode === 'candle');
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
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const lo = Number(c.low);
const hi = Number(c.high);
if (isFinite(lo))
minYRaw = Math.min(minYRaw, lo);
if (isFinite(hi))
maxYRaw = Math.max(maxYRaw, hi);
const o = Number(c.open);
const cl = Number(c.close);
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
if (!isFinite(minYRaw) || !isFinite(maxYRaw))
return;
// REV340 PC: Line Chart + Candle Stick use actual USD balance with the Y-axis
// starting exactly $1,000 below the initial balance input.
const tfEqStartBalanceV340 = (equityCurvePoints[0] && Number.isFinite(Number(equityCurvePoints[0].equity)))
? Number(equityCurvePoints[0].equity)
: (Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : 0);
const tfEqAxisFloorV340 = tfEqStartBalanceV340 - 1000;
if (equityMetric === 'usd') {
const rawTopV340 = Math.max(Number(maxYRaw) || 0, tfEqStartBalanceV340);
const spanV340 = Math.max(1000, rawTopV340 - tfEqAxisFloorV340);
const stepV340 = Math.max(1000, Math.ceil((spanV340 / 4) / 1000) * 1000);
minYRaw = tfEqAxisFloorV340;
maxYRaw = tfEqAxisFloorV340 + stepV340 * 4;
} else if (minYRaw === maxYRaw) {
const delta = Math.max(10, Math.abs(minYRaw) * 0.02);
minYRaw -= delta;
maxYRaw += delta;
}
else {
const pad = (maxYRaw - minYRaw) * 0.08;
minYRaw -= pad;
maxYRaw += pad;
}
let tMin = minYRaw;
let tMax = maxYRaw;
function toT(v) { return v; }
function fromT(t) { return t; }
function xForIndex(i) {
if (equityCurvePoints.length === 1) {
return paddingLeft + chartWidth / 2;
}
const t = i / (equityCurvePoints.length - 1);
return paddingLeft + t * chartWidth;
}
function yForVal(v) {
if (tMax === tMin)
return paddingTop + chartHeight / 2;
const tv = toT(v);
const tt = (tv - tMin) / (tMax - tMin);
return paddingTop + (1 - tt) * chartHeight;
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
ctx.setLineDash([]);
if (isCandleMode && candleView && candleView.candles && candleView.candles.length) {
try {
const candles = candleView.candles;
const s = candleView.start;
const e = candleView.end;
const visCount = Math.max(1, e - s + 1);
const stepX = chartWidth / visCount;
let candleW = stepX * 0.78;
const maxW = Math.min(24, stepX * 0.92);
const minW = Math.min(Math.max(0.6, stepX * 0.25), stepX * 0.92);
candleW = Math.max(minW, Math.min(maxW, candleW));
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
visCount: visCount
};
function xForCandleAbsIndex(absIdx) {
const j = absIdx - s;
return paddingLeft + stepX * (j + 0.5);
}
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
const openY = yForVal(c.open);
const closeY = yForVal(c.close);
const highY = yForVal(c.high);
const lowY = yForVal(c.low);
const isUp = (Number(c.close) >= Number(c.open));
ctx.strokeStyle = isUp ? '#22c55e' : '#ef4444';
ctx.fillStyle = isUp ? '#22c55e' : '#ef4444';
ctx.beginPath();
ctx.moveTo(xC, highY);
ctx.lineTo(xC, lowY);
ctx.stroke();
const topY = Math.min(openY, closeY);
const botY = Math.max(openY, closeY);
const bodyH = Math.max(2, botY - topY);
ctx.beginPath();
ctx.rect(xC - candleW / 2, topY, candleW, bodyH);
ctx.fill();
ctx.stroke();
}
ctx.restore();
ctx.save();
ctx.beginPath();
for (let i = s; i <= e; i++) {
const c = candles[i];
if (!c)
continue;
const x = xForCandleAbsIndex(i);
const y = yForVal(c.close);
if (i === s)
ctx.moveTo(x, y);
else
ctx.lineTo(x, y);
}
ctx.strokeStyle = 'rgba(56, 189, 248, 0.60)';
ctx.lineWidth = 1;
ctx.stroke();
ctx.restore();
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
ctx

/* ---- HIT ---- */

 > (state.maxProfitDollar || 0))) {
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
function computeAndRenderEquityDrawdownSummary() {
const container = document.getElementById('equity-drawdown-summary');
const detailEl = document.getElementById('equity-drawdown-detail');
if (!container || !detailEl) {
return;
}
if (!Array.isArray(equityCurvePoints) || equityCurvePoints.length === 0) {
detailEl.textContent =
'Belum ada data drawdown. Tambahkan history di Table 3 atau lakukan Scan terlebih dahulu.';
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
if (ddTroughIdx > ddPeakIdx) {
let ddTradePctTotal = 0;
let ddTradePctHasValue = false;
for (let i = ddPeakIdx + 1; i <= ddTroughIdx; i++) {
const p = equityCurvePoints[i];
if (!p)
continue;
const pnlDollar = typeof p.pnlDollar === 'number' && isFinite(p.pnlDollar) ? p.pnlDollar : 0;
ddDetailTrades.push({
analyst: (p.isWithdraw ? 'Withdraw' : (p.analyst || 'Unknown')),
pair: (p.isWithdraw ? 'User' : (p.pair || '-')),
pnlDollar: pnlDollar
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
// REV177: summary values are rendered as separate metric cards so consecutive
// loss drawdown and maximum equity drawdown cannot be confused.
function tf_summarySectionStart(title, subtitle, accentColor) {
return '<section style="margin-top:8px;padding:8px 10px;border:1px solid rgba(148,163,184,.18);border-radius:12px;background:linear-gradient(180deg,rgba(15,23,42,.22),rgba(2,6,23,.12));">' +
'<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;">' +
'<div><div style="font-weight:800;color:' + accentColor + ';font-size:12px;line-height:1.2;">' + title + '</div>' +
'<div style="margin-top:2px;font-size:9px;opacity:.70;line-height:1.35;max-width:900px;">' + subtitle + '</div></div></div>';
}
function tf_summaryMetric(label, valueHtml, accentColor, noteHtml) {
return '<div style="min-width:170px;max-width:220px;flex:0 0 210px;padding:7px 8px;border:1px solid rgba(148,163,184,.16);border-radius:9px;background:rgba(2,6,23,.18);box-shadow:inset 0 1px 0 rgba(255,255,255,.02);">' +
'<div style="font-size:8px;opacity:.72;margin-bottom:3px;line-height:1.18;text-transform:uppercase;letter-spacing:.02em;">' + label + '</div>' +
'<div class="mono" style="font-size:11px;font-weight:700;line-height:1.32;overflow-wrap:anywhere;color:' + accentColor + ';">' + (valueHtml || '-') + '</div>' +
(noteHtml ? '<div style="font-size:7px;opacity:.58;margin-top:2px;line-height:1.22;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + noteHtml + '</div>' : '') + '</div>';
}
function tf_summaryDateRangeMetric(label, startHtml, endHtml, accentColor, noteHtml) {
return tf_summaryMetric(label, '<div style="display:grid;grid-template-columns:48px 1fr;column-gap:6px;row-gap:2px;align-items:start;"><span style="opacity:.78;">MULAI</span><span>' + (startHtml || '-') + '</span><span style="opacity:.78;">SELESAI</span><span>' + (endHtml || '-') + '</span></div>', accentColor, noteHtml);
}
function tf_summaryGridStart(minWidth) {
const w = (Number.isFinite(Number(minWidth)) && Number(minWidth) > 0) ? Math.max(160, Math.min(220, Number(minWidth))) : 190;
return '<div style="display:flex;flex-wrap:wrap;align-items:stretch;gap:6px;">';
}
function escHtml(str) {
return String(str || '')
.replace(/&/g, '&amp;')
.replace(/</g, '&lt;')
.replace(/>/g, '&gt;')
.replace(/"/g, '&quot;')
.replace(/'/g, '&#039;');
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
if (maxStreakLength > 0 && bestStartIndex !== -1 && bestEndIndex !== -1) {
const startPoint = equityCurvePoints[bestStartIndex];
const endPoint = equityCurvePoints[bestEndIndex];
// REV174: consecutive-loss capital statistics always use the actual USD balance,
// even when the visible Equity Curve metric is PnL Pips. The starting capital is
// the balance immediately BEFORE the first losing trade in the selected streak.
const streakStartCapital = (function () {
try {
const initialCapital = Number(currentBalance);
let capital = Number.isFinite(initialCapital) ? initialCapital : 0;
for (let i = 1; i < bestStartIndex; i++) {
const p = equityCurvePoints[i];
const d = p && Number.isFinite(Number(p.pnlDollar)) ? Number(p.pnlDollar) : 0;
capital += d;
}
return Number.isFinite(capital) ? capital : null;
}
catch (e) { return null; }
})();
const streakDollarLoss = (function () {
try {
let total = 0;
for (let i = bestStartIndex; i <= bestEndIndex; i++) {
const p = equityCurvePoints[i];
const d = p && Number.isFinite(Number(p.pnlDollar)) ? Number(p.pnlDollar) : 0;
total += d;
}
return Number.isFinite(total) ? total : null;
}
catch (e) { return null; }
})();
const streakEndCapital = (streakStartCapital !== null && streakDollarLoss !== null)
? (streakStartCapital + streakDollarLoss)
: null;
const tf_streakCapitalPctStr = function (value, base) {
try {
const v = Number(value);
const b = Number(base);
if (!Number.isFinite(v) || !Number.isFinite(b) || b === 0) return '';
const pct = (v / Math.abs(b)) * 100;
if (!Number.isFinite(pct)) return '';
const rounded = Math.round(pct);
const showInt = Math.abs(pct - rounded) < 0.05;
return (showInt ? String(rounded) : String(Math.round(pct * 10) / 10).replace(/\.0$/, '')) + '%';
}
catch (e) { return ''; }
};
// REV174: the percentage beside consecutive loss is the accumulated PnL %
// of every losing trade in the selected streak. Example: 25 trades at -1%
// each are displayed as 25%, regardless of the dollar balance growth before
// the streak. The actual capital impact remains shown separately below.
const streakTradePercentLoss = (function () {
try {
let total = 0;
let hasValue = false;
for (let i = bestStartIndex; i <= bestEndIndex; i++) {
const p = equityCurvePoints[i];
const pct = p && Number.isFinite(Number(p.pnlPercent)) ? Number(p.pnlPercent) : null;
if (pct !== null && pct < 0) {
total += Math.abs(pct);
hasValue = true;
}
}
return hasValue && Number.isFinite(total) ? total : null;
}
catch (e) { return null; }
})();
const tf_streakTradePctStr = function (value) {
try {
const v = Number(value);
if (!Number.isFinite(v)) return '';
const rounded2 = Math.round(v * 100) / 100;
const rounded1 = Math.round(v * 10) / 10;
const rounded0 = Math.round(v);
let text = '';
if (Math.abs(v - rounded0) < 0.005) text = String(rounded0);
else if (Math.abs(v - rounded1) < 0.005) text = String(rounded1).replace(/\.0$/, '');
else text = String(rounded2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1');
return text + '%';
}
catch (e) { return ''; }
};
const streakPct = tf_streakTradePctStr(streakTradePercentLoss);
// REV176: separate the two percentage bases clearly.
// 1) Drawdown actual uses the USD balance immediately before the first loss.
// 2) Cons Loss uses the accumulated PnL % of every loss trade in the streak.
// 3) The capital overview always starts from the user's original Balance input.
const streakActualDrawdownPct = (streakDollarLoss !== null && streakStartCapital !== null)
? tf_streakCapitalPctStr(Math.abs(streakDollarLoss), streakStartCapital)
: '';
const streakPeriodRemainPct = tf_streakCapitalPctStr(streakEndCapital, streakStartCapital);
const streakInputCapital = (Number.isFinite(Number(currentBalance)) ? Number(currentBalance) : null);
const streakInputRemainPct = tf_streakCapitalPctStr(streakEndCapital, streakInputCapital);
const streakValText = (priceBusy
? tf_spinnerHTML(true)
: (streakDollarLoss === null ? '-' : formatSignedMoney(streakDollarLoss))) +
(streakActualDrawdownPct ? ' (' + streakActualDrawdownPct + ')' : '');
const streakStartCapitalText = priceBusy
? tf_spinnerHTML(true)
: (streakStartCapital === null ? '-' : tf_balanceMoneyStr(streakStartCapital));
const streakEndCapitalText = priceBusy
? tf_spinnerHTML(true)
: (streakEndCapital === null ? '-' : tf_balanceMoneyStr(streakEndCapital));
const streakInputCapitalText = priceBusy
? tf_spinnerHTML(true)
: (streakInputCapital === null ? '-' : tf_balanceMoneyStr(streakInputCapital));
const ddBaseEquity = ddPeakPoint && typeof ddPeakPoint.equity === 'number' && isFinite(ddPeakPoint.equity) ? ddPeakPoint.equity : null;
const ddPct = tf_pctStr(Math.abs(maxEquityDrawdown), ddBaseEquity);
const ddPctNeg = ddPct ? ('-' + String(ddPct).replace(/^[-+]/, '')) : '';
const ddMoneyHtml = (priceBusy ? tf_spinnerHTML(true) : formatEquityMetricSigned(maxEquityDrawdown));
const startDate = startPoint && startPoint.date ? startPoint.date : '-';
const endDate = endPoint && endPoint.date ? endPoint.date : '-';
html += tf_summarySectionStart(
'1. Consecutive Loss Drawdown',
'Khusus rangkaian trade loss berturut-turut tanpa trade profit di antaranya. Tidak sama dengan penurunan High Equity → Low Equity.',
'#ef4444'
);
html += tf_summaryGridStart(155);
html += tf_summaryDateRangeMetric('Rentang streak loss', startDate, endDate, '#ef4444');
html += tf_summaryMetric('Jumlah loss berturut-turut', maxStreakLength + 'x', '#ef4444', 'Gabungan seluruh Analis–Pair sesuai filter.');
html += tf_summaryMetric('Total loss aktual', (priceBusy ? tf_spinnerHTML(true) : (streakDollarLoss === null ? '-' : formatSignedMoney(streakDollarLoss))), '#ef4444');
html += tf_summaryMetric('Drawdown aktual streak', (streakActualDrawdownPct || '-'), '#ef4444', 'Total loss aktual ÷ modal tepat sebelum loss pertama.');
html += tf_summaryMetric('Cons Loss (Σ PnL % trade)', (streakPct || '-'), '#ef4444', 'Akumulasi PnL % dari setiap trade loss dalam streak.');
html += '</div>';
html += '<div style="margin-top:8px;">' + tf_summaryGridStart(155);
html += tf_summaryMetric('Modal awal input', streakInputCapitalText, '#ef4444', 'Mengikuti input Balance awal pengguna.');
html += tf_summaryMetric('Modal setelah streak', streakEndCapitalText, '#ef4444');
html += tf_summaryMetric('Sisa modal vs input awal', (streakInputRemainPct || '-'), '#ef4444', 'Modal setelah streak ÷ modal awal input.');
html += '</div></div>';
html += '<div style="margin-top:8px;">' + tf_summaryGridStart(155);
html += tf_summaryMetric('Modal sebelum loss pertama', streakStartCapitalText, '#ef4444');
html += tf_summaryMetric('Modal setelah loss terakhir', streakEndCapitalText, '#ef4444');
html += tf_summaryMetric('Sisa modal periode streak', (streakPeriodRemainPct || '-'), '#ef4444', 'Modal setelah streak ÷ modal sebelum streak.');
html += '</div></div></section>';
html += tf_summarySectionStart(
'2. Maximum Equity Drawdown — High Equity → Low Equity',
'Penurunan paling tajam dari puncak equity tertinggi menuju titik equity terendah berikutnya. Periode ini dapat berisi trade loss dan trade profit.',
'#fbbf24'
);
const ddLowEquity = ddTroughPoint && typeof ddTroughPoint.equity === 'number' && isFinite(ddTroughPoint.equity)
? ddTroughPoint.equity
: null;
const ddRangeStartBalance = (function () {
try {
if (equityMetric !== 'usd')
return null;
if (riskMode === 'compound') {
const srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
if (!Array.isArray(srcRows) || !srcRows.length)
return null;
let firstRow = null;
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r || r.sortKey == null || !isFinite(r.sortKey))
continue;
if (!firstRow || r.sortKey < firstRow.sortKey)
firstRow = r;
}
if (!firstRow)
return null;
const mk = (firstRow.sortKey != null) ? tf_monthKeyFromSortKey(firstRow.sortKey) : null;
let bestRow = null;
if (mk) {
for (let i = 0; i < srcRows.length; i++) {
const r = srcRows[i];
if (!r || r.sortKey == null || !isFinite(r.sortKey))
continue;
if (tf_monthKeyFromSortKey(r.sortKey) !== mk)
continue;
if (Number.isFinite(r.balanceCompound) && r.balanceCompound > 0) {
if (!bestRow || r.sortKey < bestRow.sortKey)
bestRow = r;
}
}
}
if (bestRow && Number.isFinite(bestRow.balanceCompound) && bestRow.balanceCompound > 0)
return bestRow.balanceCompound;
if (Number.isFinite(firstRow.balanceCompound) && firstRow.balanceCompound > 0)
return firstRow.balanceCompound;
return null;
}
if (typeof currentBalance === 'number' && isFinite(currentBalance) && currentBalance > 0)
return currentBalance;
return null;
}
catch (e) {
return null;
}
})();
function tf_pctSignedStr(delta, base) {
try {
if (equityMetric !== 'usd')
return '';
const b = Number(base);
const d = Number(delta);
if (!isFinite(b) || b === 0 || !isFinite(d))
return '';
const mag = tf_pctStr(Math.abs(d), b);
if (!mag)
return '';
const sign = d > 0 ? '+' : (d < 0 ? '-' : '');
return sign + String(mag).replace(/^[-+]/, '');
}
catch (e) {
return '';
}
}
function tf_pctFromBaseStr(value, base) {
try {
const v = Number(value);
const b = Number(base);
if (!isFinite(v) || !isFinite(b) || b === 0)
return '';
return tf_pctSignedStr(v - b, b);
}
catch (e) {
return '';
}
}
const ddHighHtml = (priceBusy ? tf_spinnerHTML(true) : (ddBaseEquity === null ? '-' : (equityMetric === 'usd' ? tf_balanceMoneyStr(ddBaseEquity) : formatPlainNumber(ddBaseEquity, 2))));
const ddLowHtml = (priceBusy ? tf_spinnerHTML(true) : (ddLowEquity === null ? '-' : (equityMetric === 'usd' ? tf_balanceMoneyStr(ddLowEquity) : formatPlainNumber(ddLowEquity, 2))));
const ddHighPct = ddRangeStartBalance ? tf_pctFromBaseStr(ddBaseEquity, ddRangeStartBalance) : '';
const ddLowPct = ddRangeStartBalance ? tf_pctFromBaseStr(ddLowEquity, ddRangeStartBalance) : '';
const ddHighPctColor = ddHighPct.startsWith('+') ? '#22c55e' : (ddHighPct.startsWith('-') ? '#ef4444' : '#9ca3af');
const ddLowPctColor = ddLowPct.startsWith('+') ? '#22c55e' : (ddLowPct.startsWith('-') ? '#ef4444' : '#9ca3af');
const ddLossFromHighDollar = (function () {
try {
const h = Number(ddBaseEquity);
const l = 

/* ---- HIT ---- */

; text-align:right; border-top:1px solid rgba(148,163,184,0.25); font-weight:600;">' + (priceBusy ? tf_spinnerHTML(true) : ('<span class="mono" style="color:' + ((Number(ddDetailTotalDollar) >= 0) ? '#22c55e' : '#ef4444') + ';">' + formatSignedMoney(ddDetailTotalDollar) + '</span>')) + '</td>' +
'</tr></tfoot></table></div>';
}
html += '</section>';
}
else {
html += tf_summarySectionStart(
'1. Consecutive Loss Drawdown',
'Khusus rangkaian trade loss berturut-turut tanpa trade profit di antaranya.',
'#ef4444'
);
html += '<div style="font-size:11px;opacity:.75;">Belum ada periode consecutive loss yang dapat dihitung untuk filter saat ini.</div></section>';
html += tf_summarySectionStart(
'2. Maximum Equity Drawdown — High Equity → Low Equity',
'Penurunan paling tajam dari puncak equity tertinggi menuju titik equity terendah berikutnya.',
'#fbbf24'
);
const ddBaseEquity2 = ddPeakPoint && typeof ddPeakPoint.equity === 'number' && isFinite(ddPeakPoint.equity) ? ddPeakPoint.equity : null;
const ddPctNeg2 = tf_tradePnlPctSignedStr(ddTradePercentNet);
const ddMoneyHtml2 = (priceBusy ? tf_spinnerHTML(true) : formatEquityMetricSigned(maxEquityDrawdown));
html += tf_summaryGridStart();
html += tf_summaryDateRangeMetric('Rentang High → Low', ddPeakDate, ddTroughDate, '#fbbf24');
html += tf_summaryMetric('Penurunan equity aktual', '<span style="color:#ef4444;">' + ddMoneyHtml2 + '</span>', '#ef4444');
html += tf_summaryMetric('Drawdown PnL % (Σ trade)', (ddPctNeg2 || '-'), '#ef4444');
html += '</div>';
const ddStartEquity2 = tf_getStartBalanceForEquityMaxDD(ddPeakPoint, ddBaseEquity2);
const ddLossAbsDollar2 = (typeof ddDetailTotalDollar === 'number' && isFinite(ddDetailTotalDollar))
? Math.abs(ddDetailTotalDollar)
: 0;
const ddLastEquity2 = (ddStartEquity2 !== null && isFinite(ddStartEquity2))
? (ddStartEquity2 - ddLossAbsDollar2)
: null;
const ddLossPctNeg2 = tf_tradePnlPctSignedStr(ddTradePercentNet);
const ddLastHtml2 = (priceBusy ? tf_spinnerHTML(true) : (ddLastEquity2 === null ? '-' : tf_balanceMoneyStr(ddLastEquity2)));
html += '<div style="margin-top:8px;">' + tf_summaryGridStart(155);
html += tf_summaryMetric('Start Balance (basis)', (priceBusy ? tf_spinnerHTML(true) : (ddStartEquity2 === null ? '-' : tf_balanceMoneyStr(ddStartEquity2))), '#fbbf24');
html += tf_summaryMetric('Last Balance setelah drawdown', ddLastHtml2, '#fbbf24');
html += tf_summaryMetric('Drawdown PnL % periode', (ddLossPctNeg2 || '-'), '#ef4444');
html += '</div></div>';
if (equityMetric === 'usd') {
try {
const __startBalOverall = Number.isFinite(currentBalance) ? currentBalance : 0;
const __srcRows = (Array.isArray(tf_lastEquityCalcRows) && tf_lastEquityCalcRows.length)
? tf_lastEquityCalcRows
: (Array.isArray(lastHistoryRows) ? lastHistoryRows : []);
let __lastRow = null;
let __lastSk = null;
for (let i = 0; i < __srcRows.length; i++) {
const r = __srcRows[i];
if (!r)
continue;
if (r.isStart)
continue;
const sk = tf_getPrimarySortKey(r);
if (!Number.isFinite(sk))
continue;
if (__lastRow === null || sk > __lastSk) {
__lastRow = r;
__lastSk = sk;
}
}
const __lastBalOverall = (__lastRow && Number.isFinite(__lastRow.balancePnl))
? __lastRow.balancePnl
: (__lastRow && Number.isFinite(__lastRow.balanceCompound))
? __lastRow.balanceCompound
: null;
const __deltaOverall = (__lastBalOverall !== null) ? (__lastBalOverall - __startBalOverall) : null;
const __deltaColor = (typeof __deltaOverall === 'number' && isFinite(__deltaOverall))
? (__deltaOverall > 0 ? '#22c55e' : (__deltaOverall < 0 ? '#ef4444' : '#9ca3af'))
: '#9ca3af';
const __startHtml = priceBusy ? tf_spinnerHTML(true) : tf_balanceMoneyStr(__startBalOverall);
const __lastHtmlColored = priceBusy
? tf_spinnerHTML(true)
: (__lastBalOverall === null ? '-' : ('<span class="mono" style="color:' + __deltaColor + ';">' + tf_balanceMoneyStr(__lastBalOverall) + '</span>'));
const __deltaHtmlColored = priceBusy
? tf_spinnerHTML(true)
: (__deltaOverall === null ? '-' : ('<span class="mono" style="color:' + __deltaColor + ';">' + formatSignedMoney(__deltaOverall) + '</span>'));
const __pctHtml = (__deltaOverall !== null && __startBalOverall) ? tf_pctSignedStr(__deltaOverall, __startBalOverall) : '';
const __pctHtmlColored = __pctHtml
? (' <span class="mono" style="color:' + __deltaColor + '; opacity:.95;">(' + __pctHtml + ')</span>')
: '';
html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(148,163,184,.22);">' +
'<div style="font-size:11px;font-weight:700;margin-bottom:7px;">Ringkasan Balance Keseluruhan</div>' + tf_summaryGridStart() +
tf_summaryMetric('Modal awal input', __startHtml, '#cbd5e1') +
tf_summaryMetric('Last Balance', __lastHtmlColored, __deltaColor) +
tf_summaryMetric('Kenaikan / penurunan balance', __deltaHtmlColored + __pctHtmlColored, __deltaColor) +
'</div></div>';
}
catch (e) { }
}
if (ddDetailTrades.length > 0) {
html += '<div style="margin-top:6px;"><strong>Detail Trade Max Drawdown</strong></div>';
html += '<div style="margin-top:4px; max-height:140px; overflow:auto; border:1px solid rgba(148,163,184,0.35); border-radius:10px;">';
html += '<table style="width:100%; border-collapse:collapse; font-size:11px;">';
html += '<thead><tr>';
html += '<th style="text-align:left; padding:4px 6px; border-bottom:1px solid rgba(148,163,184,0.25);">Analis</th>';
html += '<th style="text-align:left; padding:4px 6px; border-bottom:1px solid rgba(148,163,184,0.25);">Pair</th>';
html += '<th style="text-align:right; padding:4px 6px; border-bottom:1px solid rgba(148,163,184,0.25);">PnL $</th>';
html += '</tr></thead><tbody>';
ddDetailTrades.forEach((t) => {
const __pnl = Number(t.pnlDollar);
const __pnlColor = (isFinite(__pnl) && __pnl >= 0) ? '#22c55e' : '#ef4444';
const __pnlHtml = priceBusy ? tf_spinnerHTML(true) : ('<span class="mono" style="color:' + __pnlColor + ';">' + formatSignedMoney(t.pnlDollar) + '</span>');
html += '<tr>' +
'<td style="padding:3px 6px; border-bottom:1px solid rgba(148,163,184,0.12);"><span class="mono">' + escHtml(t.analyst) + '</span></td>' +
'<td style="padding:3px 6px; border-bottom:1px solid rgba(148,163,184,0.12);"><span class="mono">' + escHtml(t.pair) + '</span></td>' +
'<td style="padding:3px 6px; text-align:right; border-bottom:1px solid rgba(148,163,184,0.12);">' + __pnlHtml + '</td>' +
'</tr>';
});
html += '</tbody><tfoot><tr>' +
'<td colspan="2" style="padding:4px 6px; border-top:1px solid rgba(148,163,184,0.25); font-weight:600;">Total</td>' +
'<td style="padding:4px 6px; text-align:right; border-top:1px solid rgba(148,163,184,0.25); font-weight:600;">' + (priceBusy ? tf_spinnerHTML(true) : ('<span class="mono" style="color:' + ((Number(ddDetailTotalDollar) >= 0) ? '#22c55e' : '#ef4444') + ';">' + formatSignedMoney(ddDetailTotalDollar) + '</span>')) + '</td>' +
'</tr></tfoot></table></div>';
}
html += '</section>';
}
detailEl.innerHTML = html;
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
const validHistory = (rawHistory || []).filter((item) => {
if (!item || !item.analyst)
return false;
if (typeof item.pips === 'number')
return Number.isFinite(item.pips);
if (typeof item.pips === 'string' && item.pips.trim() !== '')
return Number.isFinite(parseFloat(item.pips));
return false;
});
historySignals = validHistory.map((item) => {
const parsedPips = (typeof item.pips === 'number') ? item.pips : parseFloat(item.pips);
return {
...item,
analyst: item.analyst,
pair: item.pair,
pips: Number.isFinite(parsedPips) ? parsedPips : 0,
displayDate: normalizeWIBSuffix(item.displayDate),
sortKey: item.sortKey,
createdDate: normalizeWIBSuffix(item.createdDate),
createdSortKey: item.createdSortKey
};
});
try {
initialHistorySignals = historySignals.map((item) => {
return {
...item,
displayDate: normalizeWIBSuffix(item.displayDate),
createdDate: normalizeWIBSuffix(item.createdDate)
};
});
}
catch (e) {
initialHistorySignals = Array.isArray(historySignals) ? historySignals.slice() : [];
}
rebuildAnalystListFromSources();
setupAnalystTickerFilter();
applyAnalystPairFilterAll();
setupHistoryForm();
chrome.storage.local.set({
tfAnalystSources: analystSourcesByName
}, () => {
recomputeHistoryRows();
});
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
if (next === tfTradeTimeRangeKey)
return;
tfTradeTimeRangeKey = next;
tf_saveTradeTimeRangePreference();
// REV295: changing timeframe always starts from the full viewport of that
// newly selected range; no double-click/double-tap recovery is required.
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
tf_sa

/* ---- HIT ---- */

ndary {
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
if (typeof window.tfRequireLicense === 'function') {
const __tfLicenseAllowed = await window.tfRequireLicense();
if (!__tfLicenseAllowed)
return;
}
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
window.tf_isignalUsers_initPage = tf_isignalUsers_initPage;
document.documentElement.dataset.tfISignalUsersInit = 'running';
await tf_isignalUsers_initPage();
document.documentElement.dataset.tfISignalUsersInit = 'done';
}
catch (e) {
try { document.documentElement.dataset.tfISignalUsersInit = 'error'; } catch (x) { }
console.error('TF iSignal Users init failed:', e);
try {
const errBox = document.getElementById('tf-users-mgmt-error');
if (errBox) {
errBox.textContent = 'iSignal Users gagal dimuat: ' + String(e && e.message ? e.message : e);
errBox.style.display = 'block';
}
}
catch (x) { }
}
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
tf_waitForPriceThenInitMain();
});
var __tfDrawdownDetailsBound = false;
function tf_applyDrawdownDetailColWidthsPx(detailTable) {
try {
if (!detailTable)
return;
const ths = document.querySelectorAll('#drawdown-table thead th');
if (!ths || ths.length !== 10)
return;
const cols = detailTable.querySelectorAll('colgroup col');
if (!cols || cols.length !== 10)
return;
for (let i = 0; i < 10; i++) {
const w = ths[i] ? Math.round(ths[i].getBoundingClientRect().width) : 0;
if (w && w > 0)
cols[i].style.width = w + 'px';
}
}
catch (e) { }
}
function tf_buildDrawdownDetailElement(st) {
const wrap = document.createElement('div');
wrap.className = 'drawdown-detail-wrap';
const maxP = st && st.maxProfitTrades ? st.maxProfitTrades : 0;
const maxL = st && st.maxLossTrades ? st.maxLossTrades : 0;
const maxN = Math.max(maxP, maxL);
if (maxN <= 1) {
const note = document.createElement('div');
note.style.opacity = '0.8';
note.textContent = 'Tidak ada detail streak untuk ditampilkan.';
wrap.appendChild(note);
return wrap;
}
const tbl = document.createElement('table');
tbl.className = 'drawdown-detail-table';
const cg = document.createElement('colgroup');
['4%', '16%', '12%', '8%', '10%', '12%', '12%', '8%', '10%', '12%'].forEach(w => {
const col = document.createElement('col');
col.style.width = w;
cg.appendChild(col);
});
tbl.appendChild(cg);
tf_applyDrawdownDetailColWidthsPx(tbl);
const priceBusy = tf_isMyfxbookPriceLoading();
for (let k = maxN - 1; k >= 1; k--) {
const tr = document.createElement('tr');
const tdArrowBlank = document.createElement('td');
tdArrowBlank.textContent = '';
tr.appendChild(tdArrowBlank);
const tdNameBlank = document.createElement('td');
tdNameBlank.textContent = '';
tr.appendChild(tdNameBlank);
const showPBase = (k <= maxP);
const pRun = (showPBase && st && st.profitRuns && st.profitRuns[k]) ? st.profitRuns[k] : null;
const pCount = (pRun && Number.isFinite(+pRun.count)) ? +pRun.count : 0;
const showP = showPBase && (pCount > 0);
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
const showLBase = (k <= maxL);
const lRun = (showLBase && st && st.lossRuns && st.lossRuns[k]) ? st.lossRuns[k] : null;
const lCount = (lRun && Number.isFinite(+lRun.count)) ? +lRun.count : 0;
const showL = showLBase && (lCount > 0);
if (!showP && !showL) {
continue;
}
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
tbl.appendChild(tr);
}
wrap.appendChild(tbl);
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
function tf_isignalUsers_parseDecimal(v) {
try {
const raw = String(v == null ? '' : v).trim().replace(/\s+/g, '').replace(',', '.');
if (!raw) return null;
const n = Number(raw);
return Number.isFinite(n) ? n : null;
}
catch (e) { return null; }
}
function tf_isignalUsers_formatRiskPercent(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? n.toFixed(2).replace('.', ',') : '';
}
function tf_isignalUsers_roundRiskPercent(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? (Math.round(n * 100) / 100) : null;
}
function tf_isignalUsers_formatNumberInput(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? n.toFixed(2) : '';
}
function tf_isignalUsers_calcActualRiskPercent(balance, lot, sl, dollarPerPip) {
const b = tf_isignalUsers_parseDecimal(balance);
const l = tf_isignalUsers_parseDecimal(lot);
const s = tf_isignalUsers_parseDecimal(sl);
const dpp = tf_isignalUsers_parseDecimal(dollarPerPip);
if (!(b != null && b > 0 && l != null && l > 0 && s != null && s > 0 && dpp != null && dpp > 0)) return null;
return tf_isignalUsers_roundRiskPercent(((l * s * dpp) / b) * 100);
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
const resp = await tf_isignalUsers_sendMessage({
type: 'tf_fetch_broker_platform_ids',
url: 'https://account.tradersfamily.id/profile/u/155921/?tab=settings'
});
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
<path d="M15.1314 3.78317C16.572 1.88333 19.428 1.88333 20.8686 3.78317L21.5493 4.68092C22.3353 5.71754 23.6195 6.24944 24.9083 6.07224L26.0244 5.91878C28.3864 5.59402 30.406 7.61357 30.0812 9.97559L29.9278 11.0917C29.7506 12.3805 30.2825 13.6647 31.3191 14.4507L32.2168 15.1314C34.1167 16.572 34.1167 19.428 32.2168 20.8686L31.3191 21.5493C30.2825 22.3353 29.7506 23.6195 29.9278 24.9083L30.0812 26.0244C30.406 28.3864 28.3864 30.406 26.0244 30.0812L24.9083 29.9278C23.6195 29.7506 22.3353 30.2825 21.5493 31.3191L20.8686 32.2168C19.428 34.1167 16.572 34.1167 15.1314 32.2168L14.4507 31.3191C13.6647 30.2825 12.3805 29.7506 11.0917 29.9278L9.97559 30.0812C7.61357 30.406 5.59402 28.3864 5.91878 26.0244L6.07224 24.9083C6.24944 23.6195 5.71754 22.3353 4.68092 21.5493L3.78317 20.8686C1.88333 19.428 1.88333 16.572 3.78317 15.1314L4.68092 14.4507C5.71754 13.6647 6.24944 12.3805 6.07224 11.0917L5.91878 9.9756C5.59402 7.61358 7.61357 5.59402 9.97559 5.91878L11.0917 6.07224C12.3805 6.24944 13.6647 5.71754 14.4507 4.68

/* ---- HIT ---- */

== li && x.classList.remove('open'));
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
window.tf_isignalUsers_initPage = tf_isignalUsers_initPage;
document.documentElement.dataset.tfISignalUsersInit = 'running';
await tf_isignalUsers_initPage();
document.documentElement.dataset.tfISignalUsersInit = 'done';
}
catch (e) {
try { document.documentElement.dataset.tfISignalUsersInit = 'error'; } catch (x) { }
console.error('TF iSignal Users init failed:', e);
try {
const errBox = document.getElementById('tf-users-mgmt-error');
if (errBox) {
errBox.textContent = 'iSignal Users gagal dimuat: ' + String(e && e.message ? e.message : e);
errBox.style.display = 'block';
}
}
catch (x) { }
}
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
tf_waitForPriceThenInitMain();
});
var __tfDrawdownDetailsBound = false;
function tf_applyDrawdownDetailColWidthsPx(detailTable) {
try {
if (!detailTable)
return;
const ths = document.querySelectorAll('#drawdown-table thead th');
if (!ths || ths.length !== 10)
return;
const cols = detailTable.querySelectorAll('colgroup col');
if (!cols || cols.length !== 10)
return;
for (let i = 0; i < 10; i++) {
const w = ths[i] ? Math.round(ths[i].getBoundingClientRect().width) : 0;
if (w && w > 0)
cols[i].style.width = w + 'px';
}
}
catch (e) { }
}
function tf_buildDrawdownDetailElement(st) {
const wrap = document.createElement('div');
wrap.className = 'drawdown-detail-wrap';
const maxP = st && st.maxProfitTrades ? st.maxProfitTrades : 0;
const maxL = st && st.maxLossTrades ? st.maxLossTrades : 0;
const maxN = Math.max(maxP, maxL);
if (maxN <= 1) {
const note = document.createElement('div');
note.style.opacity = '0.8';
note.textContent = 'Tidak ada detail streak untuk ditampilkan.';
wrap.appendChild(note);
return wrap;
}
const tbl = document.createElement('table');
tbl.className = 'drawdown-detail-table';
const cg = document.createElement('colgroup');
['4%', '16%', '12%', '8%', '10%', '12%', '12%', '8%', '10%', '12%'].forEach(w => {
const col = document.createElement('col');
col.style.width = w;
cg.appendChild(col);
});
tbl.appendChild(cg);
tf_applyDrawdownDetailColWidthsPx(tbl);
const priceBusy = tf_isMyfxbookPriceLoading();
for (let k = maxN - 1; k >= 1; k--) {
const tr = document.createElement('tr');
const tdArrowBlank = document.createElement('td');
tdArrowBlank.textContent = '';
tr.appendChild(tdArrowBlank);
const tdNameBlank = document.createElement('td');
tdNameBlank.textContent = '';
tr.appendChild(tdNameBlank);
const showPBase = (k <= maxP);
const pRun = (showPBase && st && st.profitRuns && st.profitRuns[k]) ? st.profitRuns[k] : null;
const pCount = (pRun && Number.isFinite(+pRun.count)) ? +pRun.count : 0;
const showP = showPBase && (pCount > 0);
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
const showLBase = (k <= maxL);
const lRun = (showLBase && st && st.lossRuns && st.lossRuns[k]) ? st.lossRuns[k] : null;
const lCount = (lRun && Number.isFinite(+lRun.count)) ? +lRun.count : 0;
const showL = showLBase && (lCount > 0);
if (!showP && !showL) {
continue;
}
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
tbl.appendChild(tr);
}
wrap.appendChild(tbl);
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
function tf_isignalUsers_parseDecimal(v) {
try {
const raw = String(v == null ? '' : v).trim().replace(/\s+/g, '').replace(',', '.');
if (!raw) return null;
const n = Number(raw);
return Number.isFinite(n) ? n : null;
}
catch (e) { return null; }
}
function tf_isignalUsers_formatRiskPercent(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? n.toFixed(2).replace('.', ',') : '';
}
function tf_isignalUsers_roundRiskPercent(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? (Math.round(n * 100) / 100) : null;
}
function tf_isignalUsers_formatNumberInput(v) {
const n = tf_isignalUsers_parseDecimal(v);
return (n != null && n > 0) ? n.toFixed(2) : '';
}
function tf_isignalUsers_calcActualRiskPercent(balance, lot, sl, dollarPerPip) {
const b = tf_isignalUsers_parseDecimal(balance);
const l = tf_isignalUsers_parseDecimal(lot);
const s = tf_isignalUsers_parseDecimal(sl);
const dpp = tf_isignalUsers_parseDecimal(dollarPerPip);
if (!(b != null && b > 0 && l != null && l > 0 && s != null && s > 0 && dpp != null && dpp > 0)) return null;
return tf_isignalUsers_roundRiskPercent(((l * s * dpp) / b) * 100);
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
const resp = await tf_isignalUsers_sendMessage({
type: 'tf_fetch_broker_platform_ids',
url: 'https://account.tradersfamily.id/profile/u/155921/?tab=settings'
});
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
badgeEl.innerHTML = '<svg width="14" height

/* ---- HIT ---- */

"></div>';
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
if (!channels.length) {
[tb1, tb2].forEach((tbody, index) => {
tbody.innerHTML = '';
const tr = document.createElement('tr');
const td = document.createElement('td');
td.colSpan = 3;
td.style.textAlign = 'left';
td.textContent = index === 0
? 'Belum ada data analis iSignal yang ditemukan.'
: '—';
tr.appendChild(td);
tbody.appendChild(tr);
});
tf_isignalUsers_refreshAllVerifyBadges();
return;
}
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
if (!Array.isArray(__tfIsUsersVerifyState.channels)) __tfIsUsersVerifyState.channels = [];
if (!__tfIsUsersVerifyState.map || typeof __tfIsUsersVerifyState.map !== 'object') __tfIsUsersVerifyState.map = {};
__tfIsUsersVerifyState.state = __tfIsUsersVerifyState.channels.length ? 'done' : 'error';
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
const keys = ['tfMonthlyStats', 'tfHistorySignals', 'tfAnalystSources', 'tfNoDataPairs', 'tfAvgSlPips', TF_MYFXBOOK_PRICES_KEY];
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
// Fallback untuk data import lama: bila tfAnalystSources belum tersimpan tetapi
// tfMonthlyStats sudah ada, bentuk ulang Nama Analis dan Pair dari key
// "Nama Analis (PAIR)" yang dipakai Table 2 dashboard.
try {
const monthlyFallback = (data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object') ? data.tfMonthlyStats : {};
if (!Object.keys(analystSourcesByName || {}).length) {
Object.keys(monthlyFallback).forEach((rawKey) => {
const key = String(rawKey || '').trim();
if (!key)
return;
const match = key.match(/^(.*?)\s*\(([A-Z0-9._-]{3,20})\)\s*$/i);
const baseName = String(match && match[1] ? match[1] : key).trim();
const pair = String(match && match[2] ? match[2] : '').toUpperCase().replace(/[^A-Z0-9]/g, '');
if (!baseName)
return;
if (!analystSourcesByName[baseName])
analystSourcesByName[baseName] = { url: '', pairs: [] };
if (!Array.isArray(analystSourcesByName[baseName].pairs))
analystSourcesByName[baseName].pairs = [];
if (pair && !analystSourcesByName[baseName].pairs.includes(pair))
analystSourcesByName[baseName].pairs.push(pair);
});
}
}
catch (e) { }
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
const actualRisk = tf_isignalUsers_calcActualRiskPercent(balance, lotValue, sl, dpp);
const displayedRisk = (actualRisk != null && actualRisk > 0) ? actualRisk : risk;
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
if (sl != null && Number.isFinite(Number(sl)) && Number(sl) > 0) {
const slNum = Number(sl);
const slLabel = Math.abs(slNum - Math.round(slNum)) < 0.000001
? String(Math.round(slNum))
: String(Number(slNum.toFixed(2)));
tdPair.title = slLabel + ' pips';
tdPair.style.cursor = 'help';
}
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
inp.min = '0.01';
inp.inputMode = 'decimal';
inp.className = 'form-input tf-users-detail-risk-input';
inp.dataset.entryKey = key;
inp.dataset.targetRisk = String(risk);
inp.dataset.actualRisk = (actualRisk != null && actualRisk > 0) ? String(actualRisk) : '';
inp.value = tf_isignalUsers_formatNumberInput(displayedRisk);
inp.title = (actualRisk != null && actualRisk > 0)
? 'Risk aktual berdasarkan Lot Size yang dipakai setelah pembulatan 0.01 lot.'
: ((overrideRisk != null && overrideRisk > 0)
? 'Risk %/Trade custom untuk baris ini (Metatrader ID ini).'
: 'Risk %/Trade default mengikuti main row. Ubah angka untuk custom baris ini.');
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
// Simpan konteks render terbaru supaya event handler yang sudah terpasang tetap
// memakai data Dashboard terbaru ketika chrome.storage.local berubah.
tbody.__tfUsersRenderContext = {
cfg,
analystEntries: Array.isArray(analystEntries) ? analystEntries : [],
defaultBalance,
defaultRisk
};
tbody.innerHTML = '';
const normalizedPlatformIds = Array.isArray(platformIds)
? platformIds.map((x) => String(x == null ? '' : x).trim()).filter(Boolean)
: [];
if (!normalizedPlatformIds.length) {
const emptyRow = document.createElement('tr');
emptyRow.className = 'tf-users-empty-row';
const emptyCell = document.createElement('td');
emptyCell.colSpan = 6;
emptyCell.style.textAlign = 'left';
emptyCell.textContent = 'Belum ada Platform ID MetaTrader yang ditemukan. Data analis Dashboard tetap disiapkan dan akan muncul setelah Platform ID berhasil dibaca.';
emptyRow.appendChild(emptyCell);
tbody.appendChild(emptyRow);
}
normalizedPlatformIds.forEach((pid) => {
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
riskInp.min = '0.01';
riskInp.inputMode = 'decimal';
riskInp.className = 'form-input tf-users-risk-input';
riskInp.title = 'Risk target utama. Perubahan di sini menghitung ulang seluruh Lot Size dan Risk aktual semua analis.';
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
const __ctx = tbody.__tfUsersRenderContext || {};
cfg = __ctx.cfg || cfg;
analystEntries = Array.isArray(__ctx.an

/* ---- HIT ---- */

ers-sub-loading', !!loading);
if (loading) span.innerHTML = tf_spinnerHTML(true);
else span.textContent = value ? String(value) : '—';
});
}
catch (e) { }
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
if (!c) return;
const subRaw = (c.subscriptionEndOn || '').toString().trim();
const sub = (subRaw === '-' || subRaw === '—') ? '' : subRaw;
if (!sub) c.subscriptionLoading = false;
tf_isignalUsers_patchSubscriptionCell(c.name || '', sub, false);
});
}
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
if (idx >= 0) {
const row = arr[idx] || {};
const rowSub = row.subscriptionEndOn ? String(row.subscriptionEndOn).trim() : '';
tf_isignalUsers_patchSubscriptionCell(row.name || '', rowSub, !!row.subscriptionLoading);
}
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
const stored = await tf_storageLocalGet([TF_ISIGNAL_USERS_MGMT_KEY, 'tfIsignalUsersPlatformIds']);
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

// Baca data analis dari key yang sama dengan dashboard.html terlebih dahulu.
// Ini memastikan tabel detail tetap terisi walaupun pemeriksaan Platform ID sedang
// lambat, Cloudflare muncul, atau status login lokal belum tersimpan.
__tfIsUsersAnalystMetaCache = null;
const meta = await tf_isignalUsers_prepareAnalystMeta();
const analystEntries = (meta && meta.ok && Array.isArray(meta.entries)) ? meta.entries : [];

const cachedPlatformIds = [];
const addCachedPlatformId = (value) => {
const id = String(value == null ? '' : value).trim();
if (id && !cachedPlatformIds.includes(id))
cachedPlatformIds.push(id);
};
try {
(Array.isArray(stored && stored.tfIsignalUsersPlatformIds) ? stored.tfIsignalUsersPlatformIds : []).forEach(addCachedPlatformId);
}
catch (e) { }
try {
(Array.isArray(cfg.platformIds) ? cfg.platformIds : []).forEach(addCachedPlatformId);
}
catch (e) { }
try {
Object.keys(cfg.users || {}).forEach(addCachedPlatformId);
}
catch (e) { }

// Tampilkan cache lebih dulu. Pengambilan data live dapat tertahan Cloudflare,
// jadi halaman tidak boleh terlihat kosong selama tab background masih memuat.
let platformIds = cachedPlatformIds.slice();
platformIds.forEach((pid) => {
const id = String(pid);
if (!cfg.users[id])
cfg.users[id] = { password: '', balance: null, risk: null, analystRisk: {}, analystLot: {} };
});
tf_isignalUsers_renderUsersTable(platformIds, cfg, analystEntries, defaultBalance, defaultRisk);

let resp = null;
try {
resp = await tf_isignalUsers_fetchPlatformIds();
}
catch (e) {
resp = { ok: false, error: String(e && e.message ? e.message : e) };
}

if (resp && resp.ok && resp.profile) {
try { loadUserProfileIntoDashboard(); } catch (e) { }
}
if (resp && resp.ok && Array.isArray(resp.platformIds)) {
const liveIds = resp.platformIds.map((x) => String(x || '').trim()).filter(Boolean);
platformIds = liveIds.length ? Array.from(new Set(liveIds)) : cachedPlatformIds.slice();
}
else {
platformIds = cachedPlatformIds.slice();
}

let platformWarning = '';
if (!resp || !resp.ok) {
const err = resp && resp.error ? String(resp.error) : 'Gagal mengambil Platform ID.';
platformWarning = err === 'NOT_LOGGED_IN'
? 'Login account.tradersfamily.id belum terdeteksi. Data Dashboard dan Platform ID tersimpan tetap ditampilkan.'
: `Platform ID live belum dapat diperbarui: ${err}. Data tersimpan tetap ditampilkan.`;
}
else if (!Array.isArray(resp.platformIds) || !resp.platformIds.length) {
platformWarning = cachedPlatformIds.length
? 'Server tidak mengembalikan Platform ID baru. Data Platform ID tersimpan tetap digunakan.'
: 'Belum ada Platform ID MetaTrader yang ditemukan pada akun ini.';
}

cfg.platformIds = platformIds;
if (resp && resp.ok)
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
await tf_storageLocalSet({
[TF_ISIGNAL_USERS_MGMT_KEY]: cfg,
tfIsignalUsersPlatformIds: platformIds
});
window.__tf_isignalUsersMgmtCfg = cfg;

tf_isignalUsers_renderUsersTable(platformIds, cfg, analystEntries, defaultBalance, defaultRisk);

if (!meta || !meta.ok) {
const metaMessage = meta && meta.error ? String(meta.error) : 'Belum ada data analis dari dashboard.';
showError(platformWarning ? `${metaMessage} ${platformWarning}` : metaMessage);
}
else if (platformWarning) {
showError(platformWarning);
}
else {
showError('');
}

// Sinkronkan perubahan hasil scan/import dari dashboard.html tanpa perlu menutup
// iSignalUsers.html. Debounce mencegah render berulang ketika banyak key disimpan
// dalam satu proses scan.
if (!window.__tfIsignalDashboardStorageSyncBound) {
window.__tfIsignalDashboardStorageSyncBound = true;
let syncTimer = null;
chrome.storage.onChanged.addListener((changes, area) => {
if (area !== 'local' || !changes)
return;
const watched = ['tfMonthlyStats', 'tfHistorySignals', 'tfAnalystSources', 'tfNoDataPairs', 'tfAvgSlPips', TF_MYFXBOOK_PRICES_KEY];
if (!watched.some((key) => changes[key]))
return;
clearTimeout(syncTimer);
syncTimer = setTimeout(async () => {
try {
__tfIsUsersAnalystMetaCache = null;
const fresh = await tf_storageLocalGet([TF_ISIGNAL_USERS_MGMT_KEY, 'tfIsignalUsersPlatformIds']);
const freshCfg = fresh && fresh[TF_ISIGNAL_USERS_MGMT_KEY] && typeof fresh[TF_ISIGNAL_USERS_MGMT_KEY] === 'object'
? fresh[TF_ISIGNAL_USERS_MGMT_KEY]
: cfg;
if (!freshCfg.users || typeof freshCfg.users !== 'object')
freshCfg.users = {};
const freshIds = [];
const addFreshId = (value) => {
const id = String(value == null ? '' : value).trim();
if (id && !freshIds.includes(id))
freshIds.push(id);
};
(Array.isArray(fresh && fresh.tfIsignalUsersPlatformIds) ? fresh.tfIsignalUsersPlatformIds : []).forEach(addFreshId);
(Array.isArray(freshCfg.platformIds) ? freshCfg.platformIds : []).forEach(addFreshId);
Object.keys(freshCfg.users || {}).forEach(addFreshId);
const freshMeta = await tf_isignalUsers_prepareAnalystMeta();
const freshEntries = freshMeta && freshMeta.ok && Array.isArray(freshMeta.entries) ? freshMeta.entries : [];
cfg = freshCfg;
platformIds = freshIds;
window.__tf_isignalUsersMgmtCfg = cfg;
tf_isignalUsers_renderUsersTable(platformIds, cfg, freshEntries, defaultBalance, defaultRisk);
if (!freshMeta || !freshMeta.ok)
showError(freshMeta && freshMeta.error ? freshMeta.error : 'Belum ada data analis dari dashboard.');
else if (!platformWarning)
showError('');
}
catch (e) {
showError('Sinkronisasi data Dashboard gagal: ' + String(e && e.message ? e.message : e));
}
}, 350);
});
}
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
// Jangan menghapus pesan warning/error yang sudah dibuat oleh sinkronisasi di atas.
}
// REV340 EQUITY SCALE: USD Line + Candle floor = initial balance - $1,000.


/* ---- HIT ---- */

// Jangan revalidasi setiap 15 menit karena kegagalan jaringan sesaat dapat
// menghentikan batch scan yang sudah berjalan lama.
}
async function tfRequireLicense(options) {
const opts = options || {};
tfEnsureServerGateUi();
tfEnsureStatusTargets();
if (tfLicenseValid && tfLicenseFreshServerVerified && !opts.force) {
tfSetServerAuthorization(true);
return true;
}
if (tfLicenseCheckPromise && !opts.force)
return tfLicenseCheckPromise;
tfLicenseCheckPromise = (async () => {
if (!opts.force) {
const fastAllowed = await tfTryFastStoredLicenseGate();
if (fastAllowed)
return true;
}
tfLicenseFreshServerVerified = false;
tfShowServerGate('Connecting to server...', 'Checking license status', false);
const result = await tfValidateSavedLicense({
requireFreshServer: true,
allowStoredFallback: true,
quick: true
});
const valid = !!(result && result.valid === true);
tfLicenseValid = valid;
tfApplyLicenseResult(result, Date.now());
if (valid) {
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
tfScheduleRecheck();
if (result && result.verificationPending === true) {
tfScheduleQuickRetry();
}
try {
window.dispatchEvent(new CustomEvent('tf-license-valid', { detail: result }));
}
catch (e) { }
return true;
}
tfSetServerAuthorization(false);
if (tfIsPrimaryPopupPage()) {
tfShowLicenseUi((result && result.message) || 'Lisensi belum berhasil diverifikasi ke server.', false);
}
else {
tfShowServerGate('Validasi lisensi gagal', (result && result.message) || 'Buka popup utama untuk memeriksa aktivasi.', true);
}
try {
window.dispatchEvent(new CustomEvent('tf-license-invalid', { detail: result }));
}
catch (e) { }
return false;
})();
try {
return await tfLicenseCheckPromise;
}
finally {
tfLicenseCheckPromise = null;
}
}
async function tfRequireServerCheckOnly(options) {
const opts = options || {};
tfEnsureServerGateUi();
if (!opts.force) {
const recentHealth = await tfReadRecentServerHealth();
if (recentHealth.fresh) {
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
return true;
}
}
tfLicenseFreshServerVerified = false;
tfShowServerGate('Connecting to server...', 'Checking server availability', false);
const controller = typeof AbortController === 'function' ? new AbortController() : null;
const timeoutId = setTimeout(() => {
try {
if (controller)
controller.abort();
}
catch (e) { }
}, TF_LICENSE_GATE_REQUEST_TIMEOUT_MS);
try {
const response = await fetch(TF_LICENSE_HEALTH_URL, {
method: 'GET',
redirect: 'follow',
cache: 'no-store',
signal: controller ? controller.signal : undefined
});
if (!response.ok)
throw new Error('HTTP ' + response.status);
const parsed = JSON.parse(await response.text());
if (!parsed || (parsed.success !== true && parsed.ok !== true))
throw new Error('Server lisensi tidak siap.');
await tfSaveServerHealth(true);
tfLicenseFreshServerVerified = true;
tfSetServerAuthorization(true);
tfHideLicenseUi();
return true;
}
catch (error) {
await tfSaveServerHealth(false);
tfLicenseFreshServerVerified = false;
tfSetServerAuthorization(false);
tfShowServerGate((typeof navigator !== 'undefined' && navigator.onLine === false)
? 'Tidak ada koneksi internet'
: 'Server belum merespons', (typeof navigator !== 'undefined' && navigator.onLine === false)
? 'Sambungkan internet lalu klik Coba Lagi.'
: 'Tunggu beberapa saat lalu klik Coba Lagi.', true);
return false;
}
finally {
clearTimeout(timeoutId);
}
}
window.addEventListener('online', () => {
if (tfLicenseValid && tfLicenseResult) {
tfApplyLicenseResult(tfNormalizeLicenseResult({
...tfLicenseResult,
valid: true,
code: 'LICENSE_VALID_CACHED',
message: 'Koneksi kembali. Memeriksa server lisensi...',
isOffline: false,
verificationPending: false,
offlineGraceExpiresAt: '',
offlineGraceRemainingSeconds: null
}), Date.now());
}
setTimeout(() => {
void tfRefreshLicenseStatus({
reloadOnSuccess: false,
showOverlayOnFailure: true
});
}, 300);
});
window.addEventListener('offline', () => {
if (!tfLicenseValid || !tfLicenseResult)
return;
void tfReadStoredLicense().then((snapshot) => {
const evaluation = tfEvaluateStoredLicense(snapshot);
if (!evaluation.usable)
return;
const estimatedServerNow = tfEstimateServerNowMs(snapshot.result, snapshot.checkedAt);
tfApplyLicenseResult(tfNormalizeLicenseResult({
...tfLicenseResult,
valid: true,
code: 'LICENSE_VALID_OFFLINE_GRACE',
message: 'Offline — verifikasi lisensi ditunda.',
serverTime: new Date(estimatedServerNow).toISOString(),
isOffline: true,
offlineGraceExpiresAt: evaluation.graceExpiresAt
? new Date(evaluation.graceExpiresAt).toISOString()
: '',
offlineGraceRemainingSeconds: evaluation.graceRemainingMs === null
? null
: Math.max(0, Math.ceil(evaluation.graceRemainingMs / 1000))
}), Date.now());
});
});
function tfGetISignalUsersAccessState() {
const result = tfLicenseResult || {};
const known = result.isignalUsersAccessKnown === true;
const duration = String(result.duration || '').trim().toUpperCase();
const reason = String(result.isignalUsersAccessReason || '').trim().toUpperCase();
const expiresAt = String(result.isignalUsersExpiresAt || '');
const included = result.isignalUsersIncluded === true;
const addonRequired = result.isignalUsersAddonRequired === true;
const addonPlan = String(result.isignalUsersPlan || '').trim().toUpperCase();
const includedByMainPlan = ['TRIAL (1 HARI)', '6 BULAN', '1 TAHUN', 'PERMANENT'].includes(duration);
const effectiveKnown = known || includedByMainPlan;
const effectiveIncluded = included || includedByMainPlan;
let access = result.valid === true && (result.isignalUsersAccess === true || includedByMainPlan);
let remainingSeconds = result.isignalUsersRemainingSeconds;
if (access && !included && expiresAt) {
const expiryMs = Date.parse(expiresAt);
const serverNowMs = Date.now() + tfLicenseServerOffsetMs;
if (Number.isFinite(expiryMs)) {
remainingSeconds = Math.max(0, Math.floor((expiryMs - serverNowMs) / 1000));
if (remainingSeconds <= 0)
access = false;
}
}
return {
known: effectiveKnown,
access,
included: effectiveIncluded,
addonRequired,
addonPlan,
duration,
expiresAt,
remainingSeconds,
reason: access ? (reason || (included ? 'INCLUDED_IN_PLAN' : 'ADDON_ACTIVE')) : (reason || 'ACCESS_NOT_AVAILABLE'),
email: tfNormalizeEmail(result.email || '')
};
}
try {
if (document.body) {
tfShowServerGate('Connecting to server...', 'Checking license status', false);
}
else {
document.addEventListener('DOMContentLoaded', () => {
tfShowServerGate('Connecting to server...', 'Checking license status', false);
}, { once: true });
}
}
catch (e) { }
window.tfRequireLicense = tfRequireLicense;
window.tfRequireServerCheckOnly = tfRequireServerCheckOnly;
window.tfValidateSavedLicense = tfValidateSavedLicense;
window.tfRefreshLicenseStatus = tfRefreshLicenseStatus;
window.tfLicenseApiUrl = TF_LICENSE_API_URL;
window.tfGetLicenseResult = () => ({ ...(tfLicenseResult || {}) });
window.tfGetISignalUsersAccessState = tfGetISignalUsersAccessState;
tfEnsureLicenseUi();
tfEnsureStatusTargets();
})();
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
if (!nameEl && !avatarEl && !statusEl) {
return;
}
const accountState = String(data && data.tfAccountLoginState || '').trim().toLowerCase();
const rootState = String(data && data.tfRootLoginState || '').trim().toLowerCase();
const hasProfileIdentity = !!(profile && (profile.name || profile.email || profile.avatarUrl));
const isOnline = hasProfileIdentity ||
!!(data && (data.tfLoginConfirmed === true || data.tfEnteredMain === true)) ||
/logged[_ -]?in|online/.test(accountState) ||
/logged[_ -]?in|online/.test(rootState);
if (nameEl) {
if (profile && profile.name) {
nameEl.textContent = String(profile.name);
}
else if (isOnline && /belum login|offline/i.test(String(nameEl.textContent || ''))) {
nameEl.textContent = 'User';
}
}
if (avatarEl && profile && profile.avatarUrl) {
avatarEl.src = String(profile.avatarUrl);
}
if (statusEl) {
const explicitlyLoggedOut = !hasProfileIdentity && /logged[_ -]?out/.test(accountState) && /logged[_ -]?out/.test(rootState);
statusEl.textContent = isOnline ? 'Online' : (explicitlyLoggedOut ? 'Offline' : 'Memeriksa akun...');
}
if (nameEl && !hasProfileIdentity && !isOnline && /user belum login|offline/i.test(String(nameEl.textContent || ''))) {
nameEl.textContent = 'Memuat akun...';
}
try {
document.documentElement.dataset.tfAccountOnline = isOnline ? '1' : '0';
}
catch (e) { }
};
const readProfile = () => {
try {
chrome.storage.local.get(profileKeys, (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
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
if (profileKeys.some((key) => changes[key])) {
readProfile();
}
});
}
catch (e) { }
}
if (!window.__tfDashboardProfileRefreshStarted) {
window.__tfDashboardProfileRefreshStarted = true;
try {
chrome.runtime.sendMessage({ type: 'ensure_tf_profile', force: true }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
readProfile();
});
}
catch (e) { }
setTimeout(readProfile, 1200);
setTimeout(readProfile, 3500);
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
const importedBy = importMeta && importMeta.exportedBy ? importMeta.exportedBy : null;
const scanMeta = data && data.tfLastScanMeta ? data.tfLastScanMeta : null;
const scannedBy = scanMeta && scanMeta.scannedBy ? scanMeta.scannedBy : null;
const profile = data && data.tfUserProfile ? data.tfUserProfile : null;
const fixedOwner = importedBy || scannedBy || null;
const name = (fixedOwner && fixedOwner.name) || (!fixedOwner && profile && profile.name) || '';
const email = (fixedOwner && fixedOwner.email) || (!fixedOwner && profile && profile.email) || '';
if (!name && !email) {
noteEl.textContent = '';
return;
}
const namePart = name ? String(name).trim() : '';
const emailPart = email ? String(email).trim() : '';
noteEl.textContent = `Scanned by : ${namePart}${emailPart ? ' | ' + emailPart : ''}`;
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

/* ---- HIT ---- */

~~~
## FILE 927ecbd63036f61b.js
~~~js
air-select');
if (scanSel) {
let storedArr = null;
if (data && Array.isArray(data.tfScanChannelPairs)) {
storedArr = data.tfScanChannelPairs.map(String);
}
else if (data && typeof data.tfScanChannelPair === 'string') {
const v = String(data.tfScanChannelPair || '__ALL__');
storedArr = [v];
}
if (!storedArr || !storedArr.length)
storedArr = ['__ALL__'];
const opts = Array.from(scanSel.options || []);
opts.forEach(o => { o.selected = false; });
const hasAll = storedArr.includes('__ALL__');
if (hasAll) {
const allOpt = opts.find(o => o.value === '__ALL__');
if (allOpt)
allOpt.selected = true;
}
else {
storedArr.forEach((val) => {
const opt = opts.find(o => o.value === val);
if (opt)
opt.selected = true;
});
if (!opts.some(o => o.selected)) {
const allOpt = opts.find(o => o.value === '__ALL__');
if (allOpt)
allOpt.selected = true;
}
}
try {
const widget = document.getElementById('scan-pair-multiselect');
if (widget && typeof widget.__tf_syncFromSelect === 'function') {
widget.__tf_syncFromSelect();
}
}
catch (e) { }
}
}
catch (e) { }
const rawRootState = (data && data.tfRootLoginState) ? String(data.tfRootLoginState) : 'unknown';
const rootAt = (data && data.tfRootLoginStateAt) ? Number(data.tfRootLoginStateAt) : 0;
const rootState = (rootAt && (Date.now() - rootAt) > TF_LOGIN_STATE_STALE_MS) ? 'unknown' : rawRootState;
const rootLoggedIn = rootState === 'logged_in';
const rootLoggedOut = rootState === 'logged_out';
const rawAccState = (data && data.tfAccountLoginState) ? String(data.tfAccountLoginState) : 'unknown';
const accAt = (data && data.tfAccountLoginStateAt) ? Number(data.tfAccountLoginStateAt) : 0;
const accState = (accAt && (Date.now() - accAt) > TF_LOGIN_STATE_STALE_MS) ? 'unknown' : rawAccState;
const accLoggedIn = accState === 'logged_in';
const accLoggedOut = accState === 'logged_out';
const forceLoginForm = !!(data && data.tfForceLoginForm);
const isSessionExpiredMsg = !!(loginError && /Silahkan\s*login|Session\s*berakhir|Session\s*TradersFamily\s*tidak\s*aktif/i.test(String(loginError)));
let candidateView = null;
const now = Date.now();
const rootAge = rootAt ? (now - rootAt) : 999999;
const accAge = accAt ? (now - accAt) : 999999;
const confirmedAt = Number(data && data.tfLoginConfirmedAt || 0);
const confirmedAge = confirmedAt ? (now - confirmedAt) : 999999;
const accRecentLoggedIn = accLoggedIn && accAge < TF_LOGIN_STATE_STALE_MS;
const rootRecentLoggedIn = rootLoggedIn && rootAge < TF_LOGIN_STATE_STALE_MS;
const confirmedRecent = confirmed && confirmedAge < TF_LOGIN_STATE_STALE_MS;
const shownMainOnceThisLogin = !!(data && data.tfShownMainOnceThisLogin);
const explicitLogoutAt = Number(data && data.tfExplicitLogoutAt || 0);
const explicitLogoutRecent = !!(explicitLogoutAt && (now - explicitLogoutAt) >= 0 && (now - explicitLogoutAt) < (30 * 60 * 1000));
const latestLoginAt = Math.max(
accRecentLoggedIn ? accAt : 0,
rootRecentLoggedIn ? rootAt : 0,
confirmedRecent ? confirmedAt : 0
);
const latestLogoutAt = Math.max(
(accLoggedOut && accAge < TF_LOGIN_STATE_STALE_MS) ? accAt : 0,
(rootLoggedOut && rootAge < TF_LOGIN_STATE_STALE_MS) ? rootAt : 0,
explicitLogoutRecent ? explicitLogoutAt : 0
);
// REV201 — mirror the stable legacy rule from tradersfamily.id navbar:
//   User Profile => logged in
//   Masuk / no User Profile => logged out
// A fresh root result wins over stale account/profile/cache state.
const rootFresh = rootAt > 0 && rootAge < TF_LOGIN_STATE_STALE_MS;
const accFresh = accAt > 0 && accAge < TF_LOGIN_STATE_STALE_MS;
// REV202 — an explicit Logout clicked inside the extension is authoritative.
// Root/account pages that were already open can keep stale "User Profile" DOM after
// the server session has been destroyed. Keep Login visible until a new login flow
// explicitly clears tfExplicitLogoutAt.
const scanInProgress = !!(data && data.tfScanInProgress);
if (explicitLogoutRecent) {
candidateView = 'login';
if (!forceLoginForm) {
try { chrome.storage.local.set({ tfForceLoginForm: true, tfLoginConfirmed: false, tfEnteredMain: false, tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (forceLoginForm && (isSessionExpiredMsg || rootLoggedOut || accLoggedOut)) {
// REV377 — confirmed SESSION_EXPIRED/login-required is stronger than tfScanInProgress.
// Scan cleanup may still show Stop! briefly, but the sidebar must already show Login.
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (scanInProgress) {
// Keep Dashboard only for inconclusive/stale probes while a valid scan is active.
candidateView = 'main';
} else if (rootFresh && rootLoggedIn) {
candidateView = 'main';
if (forceLoginForm) {
try { chrome.storage.local.set({ tfForceLoginForm: false, tfLoginConfirmed: true, tfLoginConfirmedAt: Date.now() }, () => { }); } catch (e) { }
}
if (!shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: true }, () => { }); } catch (e) { }
}
} else if (rootFresh && rootLoggedOut) {
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
} else if (accFresh && accLoggedIn && (!rootAt || accAt > rootAt)) {
// Fresh account login can bridge the short window before the next root navbar probe.
candidateView = 'main';
if (!shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: true }, () => { }); } catch (e) { }
}
} else {
// Unknown is deliberately safe: show login form, never Offline dashboard.
candidateView = 'login';
if (shownMainOnceThisLogin) {
try { chrome.storage.local.set({ tfShownMainOnceThisLogin: false }, () => { }); } catch (e) { }
}
}
if (profile && (profile.name || profile.avatarUrl || profile.email)) {
applyProfileToPopup(profile);
}
try {
if (candidateView === 'main' && !tf__openedChannelsThisPopup) {
tf__openedChannelsThisPopup = true;
tf_openOrFocusChannelsTab();
}
}
catch (e) { }
tf__setCandidateView(candidateView);
if (loginError) {
const loginStatusEl = document.getElementById('login-status');
if (loginStatusEl) {
loginStatusEl.textContent = loginError;
}
chrome.storage.local.remove(['tfLoginError'], () => { });
}
});
}
document.addEventListener('DOMContentLoaded', async () => {
if (window.tfIntegrityReady && !(await window.tfIntegrityReady))
return;
if (typeof window.tfRequireLicense === 'function') {
const __tfLicenseAllowed = await window.tfRequireLicense();
if (!__tfLicenseAllowed)
return;
}
try {
tf_initConfirmModal();
}
catch (e) { }
try {
tf_uiPresenceOpen();
}
catch (e) { }
try {
tf_captureBaseAnalystRowTemplates();
}
catch (e) { }
// Do not reset tfEnteredMain here. Opening the side panel must not erase
// authenticated evidence from a website session that is already active.
try {
chrome.runtime.sendMessage({ type: 'ensure_myfxbook_prices' }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
catch (e) { }
const timeRangeToggleMain = document.getElementById('tf-tr-toggle-main');
const timeRangeToggleMasuk = document.getElementById('tf-tr-toggle-masuk');
const timeRangeToggleIsignal = document.getElementById('tf-tr-toggle-isignal');
const timeRangePanelMain = document.getElementById('tf-tr-panel-main');
const timeRangePanelMasuk = document.getElementById('tf-tr-panel-masuk');
const timeRangePanelIsignal = document.getElementById('tf-tr-panel-isignal');
const timeRangeParenMain = document.getElementById('tf-time-range-paren-main');
const timeRangeParenMasuk = document.getElementById('tf-time-range-paren-masuk');
const timeRangeParenIsignal = document.getElementById('tf-time-range-paren-isignal');
const timeRangeTitleMain = document.getElementById('tf-tr-title-main');
const timeRangeTitleMasuk = document.getElementById('tf-tr-title-masuk');
const timeRangeTitleIsignal = document.getElementById('tf-tr-title-isignal');
const TF_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_TIME_RANGE_ALLOWED = new Set(['m3', 'm6', 'y1', 'y2', 'y3', 'y5', 'all_time']);
const TF_TIME_RANGE_DEFAULT = 'all_time';
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL',
};
function tf_normalizeTimeRange(v) {
const s = String(v || '').trim();
if (TF_TIME_RANGE_ALLOWED.has(s))
return s;
return TF_TIME_RANGE_DEFAULT;
}
function tf_setActiveOption(root, v) {
if (!root)
return;
try {
const btns = root.querySelectorAll('.tf-tr-option');
btns.forEach((b) => {
const bv = b && b.dataset ? b.dataset.value : null;
b.classList.toggle('active', bv === v);
});
}
catch (e) { }
}
function tf_applyTimeRangeToUI(v) {
const label = TF_TIME_RANGE_LABELS[v] || TF_TIME_RANGE_LABELS[TF_TIME_RANGE_DEFAULT];
try {
if (timeRangeParenMain)
timeRangeParenMain.textContent = `(${label})`;
if (timeRangeParenMasuk)
timeRangeParenMasuk.textContent = `(${label})`;
if (timeRangeParenIsignal)
timeRangeParenIsignal.textContent = `(${label})`;
tf_setActiveOption(timeRangePanelMain, v);
tf_setActiveOption(timeRangePanelMasuk, v);
tf_setActiveOption(timeRangePanelIsignal, v);
}
catch (e) { }
}
function tf_saveTimeRange(v) {
try {
if (hasChromeStorage()) {
chrome.storage.local.set({ [TF_TIME_RANGE_KEY]: v }, () => { });
}
}
catch (e) { }
}
function tf_getCurrentTimeRangeForScan() {
try {
const panels = [timeRangePanelMain, timeRangePanelMasuk, timeRangePanelIsignal];
for (const panel of panels) {
if (!panel)
continue;
const active = panel.querySelector('.tf-tr-option.active[data-value]');
if (active && active.dataset && active.dataset.value) {
return tf_normalizeTimeRange(active.dataset.value);
}
}
}
catch (e) { }
return TF_TIME_RANGE_DEFAULT;
}
function tf_sendStartBatchScanWithSelectedTimeRange(message, callback) {
const forceTimeRange = tf_getCurrentTimeRangeForScan();
const payload = Object.assign({}, message || {}, { forceTimeRange });
const send = () => {
try {
chrome.runtime.sendMessage(payload, callback);
}
catch (e) {
if (typeof callback === 'function')
callback(null);
}
};
try {
if (hasChromeStorage()) {
chrome.storage.local.set({ [TF_TIME_RANGE_KEY]: forceTimeRange }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
send();
});
return;
}
}
catch (e) { }
send();
}
function tf_closeTimeRangePanels() {
try {
if (timeRangePanelMain)
timeRangePanelMain.hidden = true;
if (timeRangePanelMasuk)
timeRangePanelMasuk.hidden = true;
if (timeRangePanelIsignal)
timeRangePanelIsignal.hidden = true;
if (timeRangeToggleMain)
timeRangeToggleMain.setAttribute('aria-expanded', 'false');
if (timeRangeToggleMasuk)
timeRangeToggleMasuk.setAttribute('aria-expanded', 'false');
if (timeRangeToggleIsignal)
timeRangeToggleIsignal.setAttribute('aria-expanded', 'false');
}
catch (e) { }
}
function tf_toggleTimeRangePanelAny(toggle, panel) {
if (!toggle || !panel)
return;
const isOpen = panel.hidden === false;
const all = [
{ t: timeRangeToggleMain, p: timeRangePanelMain },
{ t: timeRangeToggleMasuk, p: timeRangePanelMasuk },
{ t: timeRangeToggleIsignal, p: timeRangePanelIsignal },
];
all.forEach((o) => {
if (!o || !o.t || !o.p)
return;
if (o.t === toggle)
return;
try {
o.p.hidden = true;
o.t.setAttribute('aria-expanded', 'false');
}
catch (e) { }
});
try {
panel.hidden = isOpen;
toggle.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
}
catch (e) { }
}
function tf_initTimeRangeSelector() {
const fallback = TF_TIME_RANGE_DEFAULT;
if (!hasChromeStorage()) {
tf_applyTimeRangeToUI(fallback);
return;
}
try {
chrome.storage.local.get([TF_TIME_RANGE_KEY], (res) => {
const raw = res ? res[TF_TIME_RANGE_KEY] : null;
const v = tf_normalizeTimeRange(raw);
tf_applyTimeRangeToUI(v);
if (!raw || raw !== v) {
tf_saveTimeRange(v);
}
});
}
catch (e) {
tf_applyTimeRangeToUI(fallback);
}
}
function tf_bindTimeRangeAccordion(toggle, panel, otherToggle, otherPanel) {
if (!toggle || !panel)
return;
const header = toggle.closest('.tf-tr-header');
if (header) {
header.addEventListener('click', (ev) => {
const isArrow = ev && ev.target ? !!ev.target.closest('.tf-tr-arrowbtn') : false;
if (isArrow)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
}
const box = toggle.closest('.profile-time-range');
if (box) {
box.addEventListener('click', (ev) => {
const t = ev && ev.target ? ev.target : null;
const inHeader = t ? !!t.closest('.tf-tr-header') : false;
const inPanel = t ? !!t.closest('.tf-tr-panel') : false;
const isArrow = t ? !!t.closest('.tf-tr-arrowbtn') : false;
const isOption = t ? !!t.closest('.tf-tr-option') : false;
if (inHeader || inPanel || isArrow || isOption)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
}
toggle.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggle, panel);
});
panel.addEventListener('click', (ev) => {
const btn = ev && ev.target ? ev.target.closest('.tf-tr-option') : null;
if (!btn)
return;
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
const v = tf_normalizeTimeRange(btn.dataset ? btn.dataset.value : null);
tf_applyTimeRangeToUI(v);
tf_saveTimeRange(v);
tf_closeTimeRangePanels();
});
}
try {
tf_bindTimeRangeAccordion(timeRangeToggleMain, timeRangePanelMain, timeRangeToggleMasuk, timeRangePanelMasuk);
tf_bindTimeRangeAccordion(timeRangeToggleMasuk, timeRangePanelMasuk, timeRangeToggleMain, timeRangePanelMain);
tf_bindTimeRangeAccordion(timeRangeToggleIsignal, timeRangePanelIsignal, timeRangeToggleMain, timeRangePanelMain);
const tf_bindTitleClick = (titleEl, toggleEl, panelEl, otherToggleEl, otherPanelEl) => {
if (!titleEl || !toggleEl || !panelEl)
return;
titleEl.addEventListener('click', (ev) => {
try {
ev.preventDefault();
ev.stopPropagation();
}
catch (e) { }
tf_toggleTimeRangePanelAny(toggleEl, panelEl);
});
};
tf_bindTitleClick(timeRangeTitleMain, timeRangeToggleMain, timeRangePanelMain, timeRangeToggleMasuk, timeRangePanelMasuk);
tf_bindTitleClick(timeRangeTitleMasuk, timeRangeToggleMasuk, timeRangePanelMasuk, timeRangeToggleMain, timeRangePanelMain);
tf_bindTitleClick(timeRangeTitleIsignal, timeRangeToggleIsignal, timeRangePanelIsignal, timeRangeToggleMain, timeRangePanelMain);
tf_initTimeRangeSelector();
document.addEventListener('click', (ev) => {
const t = ev && ev.target ? ev.target : null;
const inMain = (timeRangeToggleMain && timeRangeToggleMain.contains(t)) ||
(timeRangeTitleMain && timeRangeTitleMain.contains(t)) ||
(timeRangePanelMain && timeRangePanelMain.contains(t));
const inMasuk = (timeRangeToggleMasuk && timeRangeToggleMasuk.contains(t)) ||
(timeRangeTitleMasuk && timeRangeTitleMasuk.contains(t)) ||
(timeRangePanelMasuk && timeRangePanelMasuk.contains(t));
const inIsignal = (timeRangeToggleIsignal && timeRangeToggleIsignal.contains(t)) ||
(timeRangeTitleIsignal && timeRangeTitleIsignal.contains(t)) ||
(timeRangePanelIsignal && timeRangePanelIsignal.contains(t));
if (!inMain && !inMasuk && !inIsignal) {
tf_closeTimeRangePanels();
}
}, true);
document.addEventListener('keydown', (ev) => {
const k = ev ? (ev.key || ev.code || ev.keyCode) : null;
if (k === 'Escape' || k === 'Esc' || k === 27) {
tf_closeTimeRangePanels();
}
}, true);
}
catch (e) { }
const loginBtn = document.getElementById('login-btn');
const loginMt4Btn = document.getElementById('login-mt4-btn');
const loginGoogleBtn = document.getElementById('login-google-btn');
const loginUpgradePlanBtn = document.getElementById('login-upgrade-plan-btn');
const loginStatus = document.getElementById('login-status');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const rememberCheckbox = document.getElementById('login-remember');
const tfLoginOverlay = document.getElementById('tf-login-overlay');
const tfLoginOvTitle = document.getElementById('tf-login-ov-title');
const tfLoginOvSub = document.getElementById('tf-login-ov-sub');
const tfLoginOvCancel = document.getElementById('tf-login-ov-cancel');
const tfLoginOvRetry = document.getElementById('tf-login-ov-retry');
let tf__authTabId = null;
let tf__logoutTabId = null;
let tf__googleTimeoutT = null;
let tf__standardRetryTimer = null;
let tf__standardLoginAttempt = 0;
let tf__standardLoginIdentity = '';
let tf__standardLoginPassword = '';
let tf__standardRememberEnabled = false;
let tf__loginFlow = null;
let tf__loginFlowStartedAt = 0;
let tf__loginFlowToken = null;
let tf__openedChannelsThisPopup = false;
function tf_showLoginOverlay(title, sub, opts) {
try {
if (tfLoginOvTitle)
tfLoginOvTitle.textContent = title || 'Loading...';
if (tfLoginOvSub)
tfLoginOvSub.textContent = sub || '';
const showCancel = !!(opts && opts.showCancel);
const showRetry = !!(opts && opts.showRetry);
const hideSpinner = !!(opts && opts.hideSpinner);
if (tfLoginOvCancel)
tfLoginOvCancel.style.display = showCancel ? '' : 'none';
if (tfLoginOvRetry)
tfLoginOvRetry.style.display = showRetry ? '' : 'none';
try {
const sp = tfLoginOverlay ? tfLoginOverlay.querySelector('.boot-spinner') : null;
if (sp)
sp.style.display = hideSpinner ? 'none' : '';
}
catch (e) { }
if (tfLoginOverlay) {
tfLoginOverlay.style.display = 'flex';
tfLoginOverlay.setAttribute('aria-hidden', 'false');
try {
tfLoginOverlay.removeAttribute('inert');
}
catch (e) { }
try {
tfLoginOverlay.inert = false;
}
catch (e) { }
}
}
catch (e) { }
}
function tf__loginOverlayMoveFocusOut() {
try {
if (!tfLoginOverlay)
return;
const ae = document.activeElement;
if (ae && tfLoginOverlay.contains(ae)) {
try {
if (typeof ae.blur === 'function')
ae.blur();
}
catch (e) { }
const safe = loginBtn || loginMt4Btn || loginGoogleBtn || loginEmail || document.body;
try {
if (safe && typeof safe.focus === 'function')
safe.focus({ preventScroll: true });
}
catch (e) { }
}
}
catch (e) { }
}
function tf_hideLoginOverlay() {
try {
if (tfLoginOverlay) {
tf__loginOverlayMoveFocusOut();
try {
tfLoginOverlay.setAttribute('inert', '');
}
catch (e) { }
try {
tfLoginOverlay.inert = true;
}
catch (e) { }
tfLoginOverlay.setAttribute('aria-hidden', 'true');
tfLoginOverlay.style.display = 'none';
}
try {
const sp = tfLoginOverlay ? tfLoginOverlay.querySelector('.boot-spinner') : null;
if (sp)
sp.style.display = '';
}
catch (e) { }
if (tfLoginOvRetry)
tfLoginOvRetry.style.display = 'none';
if (tfLoginOvCancel)
tfLoginOvCancel.style.display = '';
}
catch (e) { }
}
function tf_cleanupTransientLoginTabs(extraTabIds) {
try {
if (typeof chrome === 'undefined' || !chrome.runtime || !chrome.runtime.sendMessage) return;
const ids = Array.isArray(extraTabIds) ? extraTabIds.filter((id) => id != null).map((id) => Number(id)) : [];
chrome.runtime.sendMessage({ type: 'tf_close_transient_login_tabs', tabIds: ids }, () => {
try { void chrome.runtime.lastError; } catch (e) { }
});
}
catch (e) { }
}
function tf_setManualAuthState(active, mode, token) {
try {
if (!hasChromeStorage()) return;
const now = Date.now();
chrome.storage.local.set({
tfManualAuthActive: !!active,
tfManualAuthMode: active ? String(mode || '') : '',
tfManualAuthToken: active ? String(token || '') : '',
tfManualAuthStartedAt: active ? now : 0,
tfManualAuthStateAt: now
}, () => { });
}
catch (e) { }
}
function tf_closeAuthTab() {
const id = tf__authTabId;
try {
if (typeof chrome !== 'undefined' && chrome.tabs && id != null) {
chrome.tabs.remove(id, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
}
catch (e) { }
try { tf_cleanupTransientLoginTabs(id != null ? [id] : []); } catch (e) { }
tf__authTabId = null;
}
function tf_closeLogoutTab() {
try {
if (typeof chrome !== 'undefined' && chrome.tabs && tf__logoutTabId != null) {
chrome.tabs.remove(tf__logoutTabId, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
}
catch (e) { }
tf__logoutTabId = null;
}
function tf_openOrFocusChannelsTab() {
try {
const urlPattern = 'https://account.tradersfamily.id/channels*';
const createUrl = 'https://account.tradersfamily.id/channels/';
chrome.tabs.query({ url: urlPattern }, (tabs) => {
try {
if (tabs && tabs.length) {
const t = tabs[0];
try {
chrome.windows.update(t.windowId, { focused: true }, () => { });
}
catch (e) { }
try {
chrome.tabs.update(t.id, { active: true }, () => { });
}
catch (e) { }
return;
}
}
catch (e) { }
try {
chrome.tabs.create({ url: createUrl, active: true }, () => { });
}
catch (e) { }
});
}
catch (e) { }
}
function tf_sendMessageWithRetry(tabId, message, maxTries = 10, delayMs = 700) {
try {
let tries = 0;
const attempt = () => {
tries++;
try {
chrome.tabs.sendMessage(tabId, message, (resp) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (resp && resp.ok) {
return;
}
if (tries < maxTries) {
setTimeout(attempt, delayMs);
}
});
}
catch (e) {
if (tries < maxTries)
setTimeout(attempt, delayMs);
}
};
setTimeout(attempt, 250);
}
catch (e) { }
}
function tf_clearGoogleTimer() {
try {
if (tf__googleTimeoutT)
clearTimeout(tf__googleTimeoutT);
}
catch (e) { }
tf__googleTimeoutT = null;
}
function tf_clearStandardRetryTimer() {
try {
if (tf__standardRetryTimer)
clearTimeout(tf__standardRetryTimer);
}
catch (e) { }
tf__standardRetryTimer = null;
}
function tf_resetStandardRetryState() {
tf_clearStandardRetryTimer();
tf__standardLoginAttempt = 0;
tf__standardLoginIdentity = '';
tf__standardLoginPassword = '';
tf__standardRememberEnabled = false;
}
function tf_openStandardLoginAttempt(attemptNumber) {
if (tf__loginFlow !== 'standard')
return;
tf_clearStandardRetryTimer();
tf__standardLoginAttempt = Math.max(1, Math.min(2, Number(attemptNumber) || 1));
tf__loginFlowStartedAt = Date.now();
tf__loginFlowToken = 'auth_' + Math.random().toString(36).slice(2) + '_' + Date.now();
const idVal = String(tf__standardLoginIdentity || '').trim();
const passVal = String(tf__standardLoginPassword || '').trim();
const rememberEnabled = !!tf__standardRememberEnabled;
if (!idVal || !passVal) {
tf_resetStandardRetryState();
tf__loginFlow = null;
if (loginStatus)
loginStatus.textContent = 'Email/Username dan Password tidak tersedia.';
return;
}
if (hasChromeStorage()) {
const toStore = {
tfLoginConfirmed: false,
tfLoginConfirmedAt: Date.now(),
tfAccountLoginState: 'unknown',
tfAccountLoginStateAt: Date.now(),
tfEnteredMain: false,
tfForceLoginForm: true,
tfEnterMainAfterLogin: true,
tfAuthFlowToken: tf__loginFlowToken,
tfAuthTokenSeen: '',
tfPendingLogin: { mode: 'standard', identity: idVal, password: passVal },
tfPendingGoogleLogin: false,
tfCaptchaNeeded: false,
tfCaptchaSolved: false,
tfRememberLogin: rememberEnabled ? { enabled: true, email: idVal } : { enabled: false, email: '' },
tfLoginError: '',
tfExplicitLogoutAt: 0,
tfScanInProgress: false
};
chrome.storage.local.set(toStore, () => { });
}
const attemptLabel = tf__standardLoginAttempt === 1 ? 'Percobaan 1 dari 2' : 'Percobaan 2 dari 2';
tf_showLoginOverlay('Membuka halaman login...', attemptLabel + ' • me

/* ---- HIT ---- */

~~~
