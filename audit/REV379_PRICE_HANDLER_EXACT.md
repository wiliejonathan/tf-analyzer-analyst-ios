# REV379 ensure_myfxbook_prices exact handler

## assets/4b4d6b8dc315a95c.js
- hits: 2

### hit 1
~~~js
eturn '-';
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
cb.a
~~~

### hit 2
~~~js
ite(priceNum)) {
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
pairCbs.forEach
~~~
## assets/901c62026afc22f4.js
- hits: 1

### hit 1
~~~js
n (page1 reconnect) not found' };
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
const loggedUi = document.querySelector('#username_text, .pull-left.info, li
~~~
## assets/894f18e8a37bd7c6.js
- hits: 2

### hit 1
~~~js
eturn '-';
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
cb.a
~~~

### hit 2
~~~js
ite(priceNum)) {
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
pairCbs.forEach
~~~
## assets/927ecbd63036f61b.js
- hits: 1

### hit 1
~~~js
STALE_MS;
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
(timeRangeTitleIsignal &&
~~~
