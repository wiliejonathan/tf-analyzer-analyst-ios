# REV379 bg_ensureMyfxbookPrices definition

## assets/901c62026afc22f4.js
- hits: 2

### hit 1
~~~js
scan=1*'
] }, (tabs) => {
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
(markedTabs || []).forEach((t) => { if (t && t.id != null)
ids.add(t.id); });
}
catch (e) { }
for (const id of Array.from(ids)) {
try {
chrome.tabs.sendMessage(id, { type: 'stopScan' }, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
catch (e) { }
}
for (const id of Array.from(ids)) {
try {
await bg_removeTab(id);
}
catch (e) { }
}
try {
if (tf_batchScanState && tf_batchScanState.activeTabIds)
tf_batchScanState.activeTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState && tf_batchScanState.allTabIds)
tf_batchScanState.allTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState && tf_batchScanState.pairTabIds)
tf_batchScanState.pairTabIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState)
tf_batchScanState.allWindowIds.clear();
}
catch (e) { }
try {
if (tf_batchScanState)
tf_batchScanState.scanWindowId = null;
}
catch (e) { }
try {
if (typeof tf_scanWindowId !== 'undefined')
tf_scanWindowId = null;
}
catch (e) { }
}
catch (e) {
console.warn('tf_stopAllActiveScanTabs error', e);
}
}
function bg_createTab(url, makeActive = true, windowId = null) {
return new Promise((resolve, reject) => {
const createData = { url, active: !!makeActive };
if (windowId != null)
createData.windowId = windowId;
chrome.tabs.create(createData, (tab) => {
if (chrome.runtime.lastError) {
reject(chrome.runtime.lastError);
}
else {
resolve(tab);
}
});
});
}

// REV164 passive background-tab helpers.
// Background automation never activates a tab or focuses a Chrome window.
// iSignalUsers.html is only the initial/default tab; user navigation is never overridden.
function bg_getTabSafe(tabId) {
return new Promise((resolve) => {
if (tabId == null) return resolve(null);
try {
chrome.tabs.get(tabId, (tab) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve(tab || null);
});
}
catch (e) { resolve(null); }
});
}

function bg_getForegroundTabSafe() {
return new Promise((resolve) => {
try {
chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve((tabs && tabs[0]) ? tabs[0] : null);
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
tfLoginConfirmed: false,
tfLoginConfirmedAt: now,
tfAccountLoginState: 'logged_out',
tfAccountLoginStateAt: now,
tfRootLoginState: 'logged_out',
tfRootLoginStateAt: now,
tfEnteredMain: false,
tfEnterMainAfterLogin: false,
tfShownMainOnceThisLogin: false,
tfForceLoginForm: true,
tfProfileNeedsRefresh: false,
tfPeriodicLogoutAt: now,
tfLoginError: 'Session TradersFamily tidak aktif. Silakan login kembali sebelum Update.'
});
}
catch (e) { }
try {
await new Promise((resolve) => {
try {
chrome.storage.local.remove(['tfUserProfile', 'tfStableProfileEmail', 'tfCurrentProfileUrl'], () => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve();
});
}
catch (e) { resolve(); }
});
}
catch (e) { }
try { await bg_refreshOpenTradersFamilyTabsAfterStrictLogout(); } catch (e) { }
}
async function bg_verifyLoginBeforeUpdateStrict(ownerTabId) {
const startedAt = Date.now();
const network = await bg_verifyAccountSessionByFetch();
if (network && network.state === 'logged_in') {
try {
await bg_storageLocalSet({
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfForceLoginForm: false,
tfLoginError: ''
});
}
catch (e) { }
return { ok: true, loggedIn: true, state: 'logged_in', source: 'fresh_fetch', finalUrl: network.finalUrl || '', elapsedMs: Date.now() - startedAt };
}
if (network && network.state === 'logged_out') {
await bg_markStrictUpdateLogout();
return { ok: false, loggedIn: false, loggedOut: true, state: 'logged_out', code: 'TF_SESSION_EXPIRED', source: 'fresh_fetch', finalUrl: network.finalUrl || '', elapsedMs: Date.now() - startedAt };
}
let probeTabId = null;
try {
const url = 'https://account.tradersfamily.id/channels/?tfext_update_login_preflight=1&ts=' + Date.now();
const tab = await bg_createTransientSilentTab(url, ownerTabId != null ? ownerTabId : null);
probeTabId = tab && tab.id != null ? tab.id : null;
if (probeTabId == null) {
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNAVAILABLE', source: 'fresh_probe_unavailable', elapsedMs: Date.now() - startedAt };
}
try { await bg_waitForTabLoaded(probeTabId, 30000); } catch (e) { }
await bg_sleep(500);
const state = await bg_probeRootStateByDom(probeTabId);
if (state === 'logged_in') {
try {
await bg_storageLocalSet({
tfAccountLoginState: 'logged_in',
tfAccountLoginStateAt: Date.now(),
tfLoginConfirmed: true,
tfLoginConfirmedAt: Date.now(),
tfForceLoginForm: false,
tfLoginError: ''
});
}
catch (e) { }
return { ok: true, loggedIn: true, state, source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
if (state === 'logged_out') {
await bg_markStrictUpdateLogout();
return { ok: false, loggedIn: false, loggedOut: true, state, code: 'TF_SESSION_EXPIRED', source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_UNKNOWN', source: 'fresh_probe', elapsedMs: Date.now() - startedAt };
}
catch (e) {
return { ok: false, loggedIn: false, state: 'unknown', code: 'LOGIN_PREFLIGHT_ERROR', error: String(e && e.message ? e.message : e), elapsedMs: Date.now() - startedAt };
}
finally {
if (probeTabId != null) {
try { await bg_removeTab(probeTabId); } catch (e) { }
}
}
}

async function bg_runPeriodicLoginProbe(source) {
const src = source ? String(source) : 'alarm';
if (bg_loginProbeJob)
return bg_loginProbeJob;
bg_loginProbeJob = (async () => {
// REV217: a real user-driven login always wins over background health checks.
if (await bg_isManualAuthActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'MANUAL_AUTH_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_manual_auth', deferred: true };
}
// REV214: never let a background/session health probe interrupt an active batch scan.
if (await bg_isScanActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'SCAN_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_scan_active', deferred: true };
}

// REV214: every periodic root check uses a disposable tab that is ALWAYS closed
// immediately after that individual probe completes. Do not use the broad
// bg_closeTransientLoginTabs() here because a user may be performing a real login
// in another auth tab at the same time.
async function runDisposableRootProbe(initialDelayMs, retryDelays) {
let created = null;
let probeState = 'unknown';
try {
created = await bg_openTfRootTabFresh(false);
const probeTabId = created && created.id != null ? created.id : null;
if (probeTabId == null)
return 'unknown';
try {
await bg_storageLocalSet({
tfLastPeriodicProbeTabId: probeTabId,
tfLastPeriodicProbeTabOpenedAt: Date.now(),
tfLastPeriodicProbeSource: src
});
}
catch (e) { }
try { await bg_waitForTabLoaded(probeTabId, 60000); } catch (e) { }
if (initialDelayMs > 0) {
try { await bg_sleep(initialDelayMs); } catch (e) { }
}
probeState = await bg_probeRootStateByDom(probeTabId);
const delays = Array.isArray(retryDelays) ? retryDelays : [];
for (const delay of delays) {
if (probeState !== 'unknown') break;
if (delay > 0) {
try { await bg_sleep(delay); } catch (e) { }
}
probeState = await bg_probeRootStateByDom(probeTabId);
}
return probeState;
}
catch (e) {
return 'unknown';
}
finally {
const closeId = created && created.id != null ? created.id : null;
if (closeId != null) {
try { await bg_removeTab(closeId); } catch (e) { }
try {
await bg_storageLocalSet({
tfLastPeriodicProbeTabClosedId: closeId,
tfLastPeriodicProbeTabClosedAt: Date.now(),
tfLastPeriodicProbeTabCloseSource: src
});
}
catch (e) { }
}
}
}

// First disposable probe: give TradersFamily enough time to complete its normal render.
let state = await runDisposableRootProbe(10000, [2000, 4000]);
// If the first tab was inconclusive it has already been closed by finally above.
// Only then create a second disposable tab for a short retry.
if (state === 'unknown') {
state = await runDisposableRootProbe(1200, [1200, 1800]);
}

// REV217: if the user started a real login while this background probe was
// still running, discard the probe result completely. Manual authentication wins.
if (await bg_isManualAuthActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'MANUAL_AUTH_BECAME_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_manual_auth', deferred: true };
}

// An inconclusive disposable probe is NOT evidence of logout.
if (state === 'unknown') {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeUnknownAt: Date.now(),
tfPeriodicLoginProbeUnknownSource: src
});
}
catch (e) { }
return { ok: true, state: 'unknown', preserved: true };
}

// A probe may have started immediately before a scan. Re-check before applying any
// session conclusion. Active scan always wins.
if (state === 'logged_out' && await bg_isScanActiveForLoginProbe()) {
try {
await bg_storageLocalSet({
tfPeriodicLoginProbeDeferredAt: Date.now(),
tfPeriodicLoginProbeDeferredReason: 'SCAN_BECAME_ACTIVE',
tfPeriodicLoginProbeDeferredSource: src
});
}
catch (e) { }
return { ok: true, state: 'deferred_scan_active', deferred: true };
}

// REV215: a root-tab logout marker is only a CANDIDATE. Confirm against the protected
// account endpoint. Even when both observations look logged-out, an idle background
// health check is not allowed to throw the user out of the Side Panel. Real user-driven
// requests/content scripts still emit SESSION_EXPIRED when the server truly requires login.
let accountVerify = null;
if (state === 'logged_out') {
try { accountVerify = await bg_verifyAccountSessionByFetch(); } catch (e) { accountVerify = { state: 'unknown' }; }
if (accountVerify && accountVerify.state === 'logged_in') {
state = 'logged_in';
} else {
const stateAt = Date.now();
let previous = null;
try { previous = await bg_storageLocalGet(['tfPeriodicLogoutCandidateAt', 'tfPeriodicLogoutCandidateCount']); } catch (e) { previous = null; }
const prevAt = Number(previous && previous.tfPeriodicLogoutCandidateAt || 0);
const prevCount = Number(previous && previous.tfPeriodicLogoutCandidateCount || 0);
const withinWindow = prevAt > 0 && (stateAt - prevAt) >= 0 && (stateAt - prevAt) < (90 * 60 * 1000);
const nextCount = withinWindow ? Math.min(99, prevCount + 1) : 1;
try {
await bg_storageLocalSet({
tfPeriodicLogoutCandidateAt: stateAt,
tfPeriodicLogoutCandidateCount: nextCount,
tfPeriodicLogoutCandidateSource: src,
tfPeriodicLogoutCandidateAccountState: accountVerify && accountVerify.state ? String(accountVerify.state) : 'unknow
~~~

### hit 2
~~~js
bolRows(container) {
if (!container)
return [];
const rows = [];
const preferred = Array.from(container.querySelectorAll('label[for^="checked-set-lot-"]'));
for (const row of preferred) {
const cb = row.querySelector('input[type="checkbox"].child-toggle-reconnect, input[type="checkbox"].child-toggle-lot');
const lot = row.querySelector('input[type="number"].input-custom, input[type="number"][id="lot-input-custom"], input[type="text"].input-custom');
const sym = row.querySelector('.description.text-symbols-new b, .description b, .text-symbols-new b, b');
if (cb && lot && sym)
rows.push(row);
}
if (rows.length)
return rows;
const labelRows = Array.from(container.querySelectorAll('label'));
for (const row of labelRows) {
const cb = row.querySelector('input[type="checkbox"].child-toggle-reconnect, input[type="checkbox"].child-toggle-lot');
const lot = row.querySelector('input[type="number"].input-custom, input[type="number"][id="lot-input-custom"], input[type="text"].input-custom');
const sym = row.querySelector('.description.text-symbols-new b, .description b, .text-symbols-new b, b');
if (cb && lot && sym)
rows.push(row);
}
if (rows.length)
return rows;
const cbs = Array.from(container.querySelectorAll('input[type="checkbox"].child-toggle-reconnect, input[type="checkbox"].child-toggle-lot'));
for (const cb of cbs) {
const row = cb.closest('label') || cb.closest('.parent-symbol-global') || cb.parentElement;
if (row && !rows.includes(row))
rows.push(row);
}
return rows;
}
function getSymbolFromRow(row) {
if (!row)
return '';
const b = row.querySelector('.description.text-symbols-new b, .description b, .text-symbols-new b, b');
const raw = (b && b.textContent) ? b.textContent : '';
const s = String(raw || '').trim().toUpperCase();
if (!s)
return '';
const m = s.match(/XAUUSD|XAGUSD|[A-Z]{6}/);
return m ? m[0] : s.replace(/[^A-Z0-9]/g, '');
}
function getCheckboxInRow(row) {
return row.querySelector('input.child-toggle-reconnect') ||
row.querySelector('input.child-toggle-lot') ||
row.querySelector('input.form-check-input[type="checkbox"]') ||
row.querySelector('input[type="checkbox"]');
}
function getLotInputInRow(row) {
return row.querySelector('input[type="number"].input-custom, input[type="number"][id="lot-input-custom"], input[type="text"].input-custom');
}
function setInputValue(input, value) {
try {
const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
nativeInputValueSetter ? nativeInputValueSetter.call(input, String(value)) : (input.value = String(value));
}
catch (e) {
try {
input.value = String(value);
}
catch (e2) { }
}
try {
input.dispatchEvent(new Event('input', { bubbles: true }));
}
catch (e) { }
}
function getAnyNotifText() {
const parts = [];
const nodes = document.querySelectorAll('.text-header-notif, .text-notif-render, .notify-container-modal, .action-notif-container, .modal-content');
nodes.forEach((n) => {
const t = (n && n.textContent) ? n.textContent.trim() : '';
if (t && t.length < 500)
parts.push(t);
});
const joined = parts.join(' | ');
return joined;
}
await waitFor(() => document.querySelector('.list-auto-copy-signal .card-auto-copy-diss') || document.querySelector('.card-auto-copy-diss'), 30000, 300);
const cardRoot = await waitFor(() => findMtCardByMtId(mtId), 30000, 300);
if (!cardRoot)
return { ok: false, code: 'MTID_NOT_FOUND', reason: `MTID ${mtId} not found` };
const notif = await waitFor(() => {
const n = cardRoot.querySelector('.notif-of-card');
if (!n || !isVisible(n))
return null;
const b = n.querySelector('h5.text-header-notif b, .text-header-notif b');
const tx = (b && b.textContent) ? b.textContent.trim().toLowerCase() : '';
if (tx.includes('akun disconnect') || tx.includes('disconnect'))
return n;
return null;
}, 5000, 200);
if (!notif)
return { ok: false, code: 'DISCONNECT_NOT_FOUND', reason: 'Akun Disconnect overlay tidak ditemukan' };
const btnReconnect = notif.querySelector('a[data-track*="iset_reconn"], a[onclick*="toolsCard(\'reconnect\'"], a.btn-success.btnmdlnew, a.btn-success') ||
Array.from(notif.querySelectorAll('a,button')).find(x => (x.textContent || '').trim().toLowerCase().includes('sambungkan kembali')) ||
null;
if (!btnReconnect)
return { ok: false, code: 'RECONNECT_BUTTON_NOT_FOUND', reason: 'Tombol Sambungkan Kembali tidak ditemukan' };
clickEl(btnReconnect);
await sleep(600);
const symbolRoot = await waitFor(() => findSymbolListRoot(document), 30000, 250);
if (!symbolRoot)
return { ok: false, code: 'SYMBOL_LIST_NOT_FOUND', reason: 'Symbol list (pairs) tidak ditemukan' };
const wantEntries = Object.entries(pairsLots || {}).map(([k, v]) => [String(k), String(v)]);
const wantCount = wantEntries.length;
const rows = (wantCount > 0)
? (await waitFor(() => {
const r = collectSymbolRows(symbolRoot);
return (r && r.length) ? r : null;
}, 20000, 250)) || []
: collectSymbolRows(symbolRoot);
const normSym = (s) => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
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
if (msg.type === 'tf_scan_active_isignal_channels') {
(async () => {
const urlRaw = (msg && msg.url) ? String(msg.url) : 'https://account.tradersfamily.id/channels/isignal/';
const url = urlRaw.includes('tfscan=1') ? urlRaw : (urlRaw + (urlRaw.includes('?') ? '&' : '?') + 'tfscan=1');
let tabId = null;
const SUB_CACHE_KEY = 'tfIsignalSubEnds';
const SUB_CACHE_TTL_MS = 12 * 60 * 60 * 1000;
try {
const tab = await bg_createTransientSilentTab(url, sender && sender.tab ? sender.tab.id : null);
tabId = tab && tab.id != null ? tab.id : null;
if (tabId == null) {
sendResponse({ ok: false, error: 'Gagal membuka halaman iSignal' });
return;
}
await bg_waitForTabLoaded(tabId, 45000);
// The analyst-list worker remains inactive; never restore or force tab focus.
const results = await chrome.scripting.executeScript({
target: { tabId },
func: async () => {
try {
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isVisible = (el) => {
if (!el)
return false;
const style = window.getComputedStyle(el);
if (!style)
return false;
if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')
return false;
if (el.offsetParent === null)
return false;
const rect = el.getBoundingClientRect();
return rect && rect.width > 0 && rect.height > 0;
};
const href = String(location && location.href ? location.href : '');
if (/\/login\b/i.test(href) || /auth\//i.test(href)) {
return { ok: false, error: 'NOT_LOGGED_IN' };
}
// Protected builds load more slowly; wait until cards or an explicit login form exists.
for (let readyAttempt = 0; readyAttempt < 60; readyAttempt++) {
const readyCards = document.querySelectorAll('div.signal-card');
if (readyCards && readyCards.length) break;
const loginForm = document.querySelector('form.form-signin, form#loginForm, input#logname, input#logpass');
const loggedOutMenu = [
document.querySelector('a[data-track="gtm_c_sb_nav_msk"]'),
document.querySelector('a[href*="account.tradersfamily.id/login/"]'),
document.querySelector('a[data-track="gtm_c_sb_nav_rgstr"]'),
document.querySelector('a[href*="account.tradersfamily.id/register/"]')
].filter(Boolean).find(isVisible);
if (loggedOutMenu)
return { ok: false, error: 'NOT_LOGGED_IN' };
const accountUi = document.querySelector('#username_text, .pull-left.info, a[href*="/logout/"], a[href*="/profile/u/"]');
if (readyAttempt > 10 && loginForm && isVisible(loginForm) && !accountUi)
return { ok: false, error: 'NOT_LOGGED_IN' };
await sleep(250);
}
const maxClicks = 250;
const maxNoGrowth = 8;
let noGrowth = 0;
let lastCount = 0;
for (let i = 0; i < maxClicks; i++) {
const cards = document.querySelectorAll('div.signal-card');
const countNow = cards ? cards.length : 0;
if (countNow > lastCount) {
lastCount = countNow;
noGrowth = 0;
}
else {
noGrowth++;
}
const btn = document.querySelector('#btnLoad.btnLoad') ||
document.querySelector('#btnLoad') ||
Array.from(document.querySelectorAll('button, a')).find((x) => /load\s*more/i.test(x.textContent || ''));
if (!btn || !isVisible(btn) || btn.disabled)
break;
btn.click();
let grew = false;
for (let t = 0; t < 24; t++) {
await sleep(250);
const cc = document.querySelectorAll('div.signal-card');
const c = cc ? cc.length : 0;
if (c > lastCount) {
lastCount = c;
grew = true;
noGrowth = 0;
break;
}
}
if (!grew && noGrowth >= maxNoGrowth)
break;
await sleep(150);
}
const cards = Array.from(document.querySelectorAll('div.signal-card'));
const out = [];
const seen = new Set();
const norm = (s) => String(s || '').trim();
const STEP_DELAY = 200;
cards.forEach((card) => {
const nameEl = card.querySelector('.channel-name.add p.truncate-text') ||
card.querySelector('.channel-name p.truncate-text') ||
card.querySelector('.channel-name p') ||
card.querySelector('.channel-name');
const name = norm(nameEl ? nameEl.textContent : '');
if (!name)
return;
const key = name.toLowerCase();
if (seen.has(key))
return;
seen.add(key);
const header = card.querySelector('div.header');
const statusSpan = header ? header.querySelector('.text-header-auto span') : null;
const statusText = norm(statusSpan ? statusSpan.textContent : '');
const isignalLink = card.querySelector('a.button-autocopy[href^="/channels/isignal/"]') ||
card.querySelector('a[href^="/channels/isignal/"]');
const isignalHref = isignalLink ? isignalLink.getAttribute('href') : '';
const m = isignalHref ? String(isignalHref).match(/\/channels\/isignal\/(\d+)/) : null;
const isignalId = m ? m[1] : '';
out.push({ name, isignalId, statusText });
});
return { ok: true, channels: out };
}
catch (e) {
return { ok: false, error: String(e) };
}
}
});
const payload = results && results[0] && results[0].result ? results[0].result : null;
if (!payload || !payload.ok) {
const err = payload && payload.error ? payload.error : 'Gagal scan iSignal';
try {
const cached = await bg_storageLocalGet(['tfIsignalActiveChannels']);
const cachedChannels = Array.isArray(cached && cached.tfIsignalActiveChannels) ? cached.tfIsignalActiveChannels : [];
if (cachedChannels.length) {
sendResponse({ ok: true, channels: cachedChannels, cached: true, warning: String(err) });
return;
}
}
catch (e) { }
sendResponse({ ok: false, error: String(err) });
return;
}
let channels = Array.isArray(payload.channels) ? payload.channels : [];
if (!channels.length) {
try {
const cached = await bg_storageLocalGet(['tfIsignalActiveChannels']);
const cachedChannels = Array.isArray(cached && cached.tfIsignalActiveChannels) ? cached.tfIsignalActiveChannels : [];
if (cachedChannels.length) channels = cachedChannels;
}
catch (e) { }
}
try {
channels.sort((a, b) => {
const an = String(a && a.name ? a.name : '').toLowerCase();
const bn = String(b && b.name ? b.name : '').toLowerCase();
if (an < bn)
return -1;
if (an > bn)
return 1;
return 0;
});
}
catch (e) { }
const now = Date.now();
let subCache = {};
try {
const saved = await bg_storageLocalGet([SUB_CACHE_KEY]);
if (saved && saved[SUB_CACHE_KEY] && typeof saved[SUB_CACHE_KEY] === 'object') {
subCache = saved[SUB_CACHE_KEY] || {};
}
}
catch (e) { }
const missing = [];
try {
channels.forEach((ch) => {
const id = ch && ch.isignalId ? Strin
~~~
