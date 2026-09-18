# REV379 PC export/import data audit

## assets/927ecbd63036f61b.js
- score: 4, bytes: 428355, sha256: ec70e4cac55afc84d1341918b02d6f3c720e34308017d2c9130e2f99e51e0239

### tf_multi_analyst_export_v1 (1 hits)
~~~js
tps://account.tradersfamily.id/');
}
const u = new URL(s);
const hostOk = (u.hostname || '').toLowerCase() === 'account.tradersfamily.id';
const pathOk = (u.pathname || '').toLowerCase().startsWith('/channels/');
if (!hostOk || !pathOk)
return null;
u.protocol = 'https:';
u.hash = '';
return u.toString();
}
catch (e) {
return null;
}
}
function tf_strictActiveTabChannelUrl(raw) {
try {
if (!raw)
return null;
const s = String(raw).trim();
if (!s)
return null;
const u = new URL(s);
const hostOk = (u.hostname || '').toLowerCase() === 'account.tradersfamily.id';
const path = (u.pathname || '');
const pathLower = path.toLowerCase();
if (!hostOk)
return null;
if (!pathLower.startsWith('/channels/'))
return null;
const segs = path.split('/').filter(Boolean);
if (!segs || segs.length < 2)
return null;
if ((segs[0] || '').toLowerCase() !== 'channels')
return null;
const idSeg = String(segs[1] || '').trim();
if (!/^\d+$/.test(idSeg))
return null;
u.protocol = 'https:';
u.hash = '';
return u.toString();
}
catch (e) {
return null;
}
}
function setIsignalStatus(text) {
const el = document.getElementById('isignal-status');
if (el) {
const nextText = text || '';
if (el.textContent !== nextText) {
el.textContent = nextText;
}
}
}
const TF_STOP_LABEL = 'Stop Progress!';
const TF_EXPORT_SCHEMA = 'tf_multi_analyst_export_v1';
const TF_SELECTED_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_ANALYST_SOURCES_KEY = 'tfAnalystSources';
const TF_ANALYST_NAME_CACHE_KEY = 'tfAnalystNameCacheByUrl';
const TF_REMEMBERED_LINKS_KEY = 'tfRememberedAnalystLinks';
const TF_REMEMBER_LINKS_ENABLED_KEY = 'tfRememberLinksEnabled';
let __tfStableAnalystNameByUrl = Object.create(null);
let __tfSavedChannelsRefreshTimer = null;
const TF_HAS_IMPORTED_BUNDLE_KEY = 'tfHasImportedBundle';
const TF_IMPORT_LOCK_ENGAGED_KEY = 'tfImportLockEngaged';
const TF_IMPORT_LOCKED_SIGS_KEY = 'tfImportLockedSigs';
const TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY = 'tfImportLockBaselineMainCount';
const TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY = 'tfImportLockBaselineIsignalCount';
let tf_addModeEngaged = false;
let tf_addModeSigSet = new Set();
let tf_addModeScanLinksManuallyHidden = false;
const TF_ALL_ANALYST_PAIRS_KEY_LEGACY = 'tfAllAnalystPairs';
const TF_ALL_ANALYST_PAIRS_KEY_MAIN = 'tfAllAnalystPairsMain';
const TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL = 'tfAllAnalystPairsIsignal';
const TF_EXPORT_LOCALSTORAGE_KEYS = [
'tf_equity_metric',
'tf_risk_mode',
'tf_compound_months',
'tf_current_balance',
'tf_current_risk_percent',
'tf_risk_overrides',
'tf_sl_type_selection'
];
const TF_EXPORT_STORAGE_KEYS = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
TF_REMEMBER_LINKS_ENABLED_KEY,
TF_ALL_ANALYST_PAIRS_KEY_MAIN,
TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL,
TF_ALL_ANALYST_PAIRS_KEY_LEGACY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCKED_SIGS_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY,
TF_SELECTED_TIME_RANGE_KEY
];
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL'
};
function tf_timeRangeLabel(v) {
const key = v ? String(v) : 'all_time';
return TF_TIME_RANGE_LABELS[key] || 'ALL';
}
function tf_isPlaceholderAnalystName(name) {
const s = String(name || '').trim();
if (!s)
return true;
if (/^imported$/i.test(s))
return true;
if (/^link\s*\d*$/i.test(s))
return true;
if (/^channel\s*(?:\d+|id|"id"|'id')$/i.test(s))
return true;
if (/^https?:\/\//i.test(s))
return true;
return false;
}
function tf_stableJson(value) {
try {
if (Array.isArray(value))
return '[' + value.map((item) 
~~~
### localState (12 hits)
~~~js
ument.getElementById('analyst-links-container');
const containerIsignal = document.getElementById('isignal-links-container');
if (hasImp && lockEngaged) {
tf_applyImportLockToContainer(containerMain, baseMainCount);
tf_applyImportLockToContainer(containerIsignal, baseIsignalCount);
tf_setTimeRangeLocked(true);
tf_setAddModeSecondaryActionsVisible(true);
}
else {
if (containerMain) {
const rows = Array.from(containerMain.querySelectorAll('.analyst-row'));
rows.forEach((row) => tf_setAnalystRowLocked(row, false));
}
if (containerIsignal) {
const rows2 = Array.from(containerIsignal.querySelectorAll('.analyst-row'));
rows2.forEach((row) => tf_setAnalystRowLocked(row, false));
}
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
}
try {
tf_setUpdateButtonsEnabled(hasImp, lockEngaged);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_safeJsonParse(text) {
try {
return JSON.parse(text);
}
catch (e) {
return null;
}
}
function tf_collectLocalStateForExport() {
const out = {};
try {
if (typeof localStorage === 'undefined')
return out;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
try {
const v = localStorage.getItem(k);
if (v !== null && v !== undefined) {
out[k] = v;
}
}
catch (e) { }
});
}
catch (e) { }
return out;
}
function tf_applyLocalStateFromImport(localState) {
try {
if (!localState || typeof localState !== 'object')
return;
if (typeof localStorage === 'undefined')
return;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(localState, k))
return;
const v = localState[k];
try {
if (v === null || v === undefined || v === '') {
localStorage.removeItem(k);
}
else {
localStorage.setItem(k, String(v));
}
}
catch (e) { }
});
}
catch (e) { }
}
function tf_makeFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const y = d.getFullYear();
const m = pad(d.getMonth() + 1);
const day = pad(d.getDate());
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const ss = pad(d.getSeconds());
return `${y}${m}${day}_${hh}${mm}${ss}`;
}
catch (e) {
return String(Date.now());
}
}
function tf_makePrettyFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
const day = pad(d.getDate());
const month = pad(d.getMonth() + 1);
const year = d.getFullYear();
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const w = String(weekday || '').replace(/\s+/g, '_');
return `${w}_${day}-${month}-${year}_${hh}-${mm}`;
}
catch (e) {
return tf_makeFilenameTimestamp();
}
}
function tf_downloadJsonFile(filename, obj) {
try {
const json = JSON.stringify(obj, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
setTimeout(() => {
try {
URL.revokeObjectURL(url);
}
catch (e) { }
try {
a.remove();
}
catch (e) { }
}, 50);
}
catch (e) {
alert('Gagal export data. Coba lagi.');
}
}
function tf_shortUrl(url) {
try {
if (!url)
return '';
const u = new URL(String(url));
const host = u.hostname || '';
let p = u.pathname || '';
if (p.length > 32) {
p = p.slice(0, 10) + '…' + p.slice(-18);
}
return `${host}${p}`;
}
catch (e) {
const s = String(url);
if (s.length <= 48)
return s;
return s.slice(0, 18) + '…' + s.slice(-24);
}
}
function tf_getSavedListEls() {
return [
document.getElementById('scan-channel-saved-list'),
document.getElementById('scan-channel-saved-list-isignal')
].filter(Boolean);
}
function tf_renderSavedChannelsStatusFromStorage() {
try {
if (
~~~
~~~js
lyst-links-container');
const containerIsignal = document.getElementById('isignal-links-container');
if (hasImp && lockEngaged) {
tf_applyImportLockToContainer(containerMain, baseMainCount);
tf_applyImportLockToContainer(containerIsignal, baseIsignalCount);
tf_setTimeRangeLocked(true);
tf_setAddModeSecondaryActionsVisible(true);
}
else {
if (containerMain) {
const rows = Array.from(containerMain.querySelectorAll('.analyst-row'));
rows.forEach((row) => tf_setAnalystRowLocked(row, false));
}
if (containerIsignal) {
const rows2 = Array.from(containerIsignal.querySelectorAll('.analyst-row'));
rows2.forEach((row) => tf_setAnalystRowLocked(row, false));
}
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
}
try {
tf_setUpdateButtonsEnabled(hasImp, lockEngaged);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_safeJsonParse(text) {
try {
return JSON.parse(text);
}
catch (e) {
return null;
}
}
function tf_collectLocalStateForExport() {
const out = {};
try {
if (typeof localStorage === 'undefined')
return out;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
try {
const v = localStorage.getItem(k);
if (v !== null && v !== undefined) {
out[k] = v;
}
}
catch (e) { }
});
}
catch (e) { }
return out;
}
function tf_applyLocalStateFromImport(localState) {
try {
if (!localState || typeof localState !== 'object')
return;
if (typeof localStorage === 'undefined')
return;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(localState, k))
return;
const v = localState[k];
try {
if (v === null || v === undefined || v === '') {
localStorage.removeItem(k);
}
else {
localStorage.setItem(k, String(v));
}
}
catch (e) { }
});
}
catch (e) { }
}
function tf_makeFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const y = d.getFullYear();
const m = pad(d.getMonth() + 1);
const day = pad(d.getDate());
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const ss = pad(d.getSeconds());
return `${y}${m}${day}_${hh}${mm}${ss}`;
}
catch (e) {
return String(Date.now());
}
}
function tf_makePrettyFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
const day = pad(d.getDate());
const month = pad(d.getMonth() + 1);
const year = d.getFullYear();
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const w = String(weekday || '').replace(/\s+/g, '_');
return `${w}_${day}-${month}-${year}_${hh}-${mm}`;
}
catch (e) {
return tf_makeFilenameTimestamp();
}
}
function tf_downloadJsonFile(filename, obj) {
try {
const json = JSON.stringify(obj, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
setTimeout(() => {
try {
URL.revokeObjectURL(url);
}
catch (e) { }
try {
a.remove();
}
catch (e) { }
}, 50);
}
catch (e) {
alert('Gagal export data. Coba lagi.');
}
}
function tf_shortUrl(url) {
try {
if (!url)
return '';
const u = new URL(String(url));
const host = u.hostname || '';
let p = u.pathname || '';
if (p.length > 32) {
p = p.slice(0, 10) + '…' + p.slice(-18);
}
return `${host}${p}`;
}
catch (e) {
const s = String(url);
if (s.length <= 48)
return s;
return s.slice(0, 18) + '…' + s.slice(-24);
}
}
function tf_getSavedListEls() {
return [
document.getElementById('scan-channel-saved-list'),
document.getElementById('scan-channel-saved-list-isignal')
].filter(Boolean);
}
function tf_renderSavedChannelsStatusFromStorage() {
try {
if (!hasChromeStorage())
retu
~~~
~~~js
);
const containerIsignal = document.getElementById('isignal-links-container');
if (hasImp && lockEngaged) {
tf_applyImportLockToContainer(containerMain, baseMainCount);
tf_applyImportLockToContainer(containerIsignal, baseIsignalCount);
tf_setTimeRangeLocked(true);
tf_setAddModeSecondaryActionsVisible(true);
}
else {
if (containerMain) {
const rows = Array.from(containerMain.querySelectorAll('.analyst-row'));
rows.forEach((row) => tf_setAnalystRowLocked(row, false));
}
if (containerIsignal) {
const rows2 = Array.from(containerIsignal.querySelectorAll('.analyst-row'));
rows2.forEach((row) => tf_setAnalystRowLocked(row, false));
}
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
}
try {
tf_setUpdateButtonsEnabled(hasImp, lockEngaged);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_safeJsonParse(text) {
try {
return JSON.parse(text);
}
catch (e) {
return null;
}
}
function tf_collectLocalStateForExport() {
const out = {};
try {
if (typeof localStorage === 'undefined')
return out;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
try {
const v = localStorage.getItem(k);
if (v !== null && v !== undefined) {
out[k] = v;
}
}
catch (e) { }
});
}
catch (e) { }
return out;
}
function tf_applyLocalStateFromImport(localState) {
try {
if (!localState || typeof localState !== 'object')
return;
if (typeof localStorage === 'undefined')
return;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(localState, k))
return;
const v = localState[k];
try {
if (v === null || v === undefined || v === '') {
localStorage.removeItem(k);
}
else {
localStorage.setItem(k, String(v));
}
}
catch (e) { }
});
}
catch (e) { }
}
function tf_makeFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const y = d.getFullYear();
const m = pad(d.getMonth() + 1);
const day = pad(d.getDate());
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const ss = pad(d.getSeconds());
return `${y}${m}${day}_${hh}${mm}${ss}`;
}
catch (e) {
return String(Date.now());
}
}
function tf_makePrettyFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
const day = pad(d.getDate());
const month = pad(d.getMonth() + 1);
const year = d.getFullYear();
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const w = String(weekday || '').replace(/\s+/g, '_');
return `${w}_${day}-${month}-${year}_${hh}-${mm}`;
}
catch (e) {
return tf_makeFilenameTimestamp();
}
}
function tf_downloadJsonFile(filename, obj) {
try {
const json = JSON.stringify(obj, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
setTimeout(() => {
try {
URL.revokeObjectURL(url);
}
catch (e) { }
try {
a.remove();
}
catch (e) { }
}, 50);
}
catch (e) {
alert('Gagal export data. Coba lagi.');
}
}
function tf_shortUrl(url) {
try {
if (!url)
return '';
const u = new URL(String(url));
const host = u.hostname || '';
let p = u.pathname || '';
if (p.length > 32) {
p = p.slice(0, 10) + '…' + p.slice(-18);
}
return `${host}${p}`;
}
catch (e) {
const s = String(url);
if (s.length <= 48)
return s;
return s.slice(0, 18) + '…' + s.slice(-24);
}
}
function tf_getSavedListEls() {
return [
document.getElementById('scan-channel-saved-list'),
document.getElementById('scan-channel-saved-list-isignal')
].filter(Boolean);
}
function tf_renderSavedChannelsStatusFromStorage() {
try {
if (!hasChromeStorage())
return;
const lists = tf_
~~~
~~~js
yImportLockToContainer(containerIsignal, baseIsignalCount);
tf_setTimeRangeLocked(true);
tf_setAddModeSecondaryActionsVisible(true);
}
else {
if (containerMain) {
const rows = Array.from(containerMain.querySelectorAll('.analyst-row'));
rows.forEach((row) => tf_setAnalystRowLocked(row, false));
}
if (containerIsignal) {
const rows2 = Array.from(containerIsignal.querySelectorAll('.analyst-row'));
rows2.forEach((row) => tf_setAnalystRowLocked(row, false));
}
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
}
try {
tf_setUpdateButtonsEnabled(hasImp, lockEngaged);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_safeJsonParse(text) {
try {
return JSON.parse(text);
}
catch (e) {
return null;
}
}
function tf_collectLocalStateForExport() {
const out = {};
try {
if (typeof localStorage === 'undefined')
return out;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
try {
const v = localStorage.getItem(k);
if (v !== null && v !== undefined) {
out[k] = v;
}
}
catch (e) { }
});
}
catch (e) { }
return out;
}
function tf_applyLocalStateFromImport(localState) {
try {
if (!localState || typeof localState !== 'object')
return;
if (typeof localStorage === 'undefined')
return;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(localState, k))
return;
const v = localState[k];
try {
if (v === null || v === undefined || v === '') {
localStorage.removeItem(k);
}
else {
localStorage.setItem(k, String(v));
}
}
catch (e) { }
});
}
catch (e) { }
}
function tf_makeFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const y = d.getFullYear();
const m = pad(d.getMonth() + 1);
const day = pad(d.getDate());
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const ss = pad(d.getSeconds());
return `${y}${m}${day}_${hh}${mm}${ss}`;
}
catch (e) {
return String(Date.now());
}
}
function tf_makePrettyFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
const day = pad(d.getDate());
const month = pad(d.getMonth() + 1);
const year = d.getFullYear();
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const w = String(weekday || '').replace(/\s+/g, '_');
return `${w}_${day}-${month}-${year}_${hh}-${mm}`;
}
catch (e) {
return tf_makeFilenameTimestamp();
}
}
function tf_downloadJsonFile(filename, obj) {
try {
const json = JSON.stringify(obj, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
setTimeout(() => {
try {
URL.revokeObjectURL(url);
}
catch (e) { }
try {
a.remove();
}
catch (e) { }
}, 50);
}
catch (e) {
alert('Gagal export data. Coba lagi.');
}
}
function tf_shortUrl(url) {
try {
if (!url)
return '';
const u = new URL(String(url));
const host = u.hostname || '';
let p = u.pathname || '';
if (p.length > 32) {
p = p.slice(0, 10) + '…' + p.slice(-18);
}
return `${host}${p}`;
}
catch (e) {
const s = String(url);
if (s.length <= 48)
return s;
return s.slice(0, 18) + '…' + s.slice(-24);
}
}
function tf_getSavedListEls() {
return [
document.getElementById('scan-channel-saved-list'),
document.getElementById('scan-channel-saved-list-isignal')
].filter(Boolean);
}
function tf_renderSavedChannelsStatusFromStorage() {
try {
if (!hasChromeStorage())
return;
const lists = tf_getSavedListEls();
if (!lists.length)
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_ANALYST_NAME_CACHE_KEY, TF_SELECTED_TIME_RANGE_KEY, TF_REMEMBERED_LINKS_KEY], 
~~~
~~~js
ignal, baseIsignalCount);
tf_setTimeRangeLocked(true);
tf_setAddModeSecondaryActionsVisible(true);
}
else {
if (containerMain) {
const rows = Array.from(containerMain.querySelectorAll('.analyst-row'));
rows.forEach((row) => tf_setAnalystRowLocked(row, false));
}
if (containerIsignal) {
const rows2 = Array.from(containerIsignal.querySelectorAll('.analyst-row'));
rows2.forEach((row) => tf_setAnalystRowLocked(row, false));
}
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
}
try {
tf_setUpdateButtonsEnabled(hasImp, lockEngaged);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_safeJsonParse(text) {
try {
return JSON.parse(text);
}
catch (e) {
return null;
}
}
function tf_collectLocalStateForExport() {
const out = {};
try {
if (typeof localStorage === 'undefined')
return out;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
try {
const v = localStorage.getItem(k);
if (v !== null && v !== undefined) {
out[k] = v;
}
}
catch (e) { }
});
}
catch (e) { }
return out;
}
function tf_applyLocalStateFromImport(localState) {
try {
if (!localState || typeof localState !== 'object')
return;
if (typeof localStorage === 'undefined')
return;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(localState, k))
return;
const v = localState[k];
try {
if (v === null || v === undefined || v === '') {
localStorage.removeItem(k);
}
else {
localStorage.setItem(k, String(v));
}
}
catch (e) { }
});
}
catch (e) { }
}
function tf_makeFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const y = d.getFullYear();
const m = pad(d.getMonth() + 1);
const day = pad(d.getDate());
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const ss = pad(d.getSeconds());
return `${y}${m}${day}_${hh}${mm}${ss}`;
}
catch (e) {
return String(Date.now());
}
}
function tf_makePrettyFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
const day = pad(d.getDate());
const month = pad(d.getMonth() + 1);
const year = d.getFullYear();
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const w = String(weekday || '').replace(/\s+/g, '_');
return `${w}_${day}-${month}-${year}_${hh}-${mm}`;
}
catch (e) {
return tf_makeFilenameTimestamp();
}
}
function tf_downloadJsonFile(filename, obj) {
try {
const json = JSON.stringify(obj, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
setTimeout(() => {
try {
URL.revokeObjectURL(url);
}
catch (e) { }
try {
a.remove();
}
catch (e) { }
}, 50);
}
catch (e) {
alert('Gagal export data. Coba lagi.');
}
}
function tf_shortUrl(url) {
try {
if (!url)
return '';
const u = new URL(String(url));
const host = u.hostname || '';
let p = u.pathname || '';
if (p.length > 32) {
p = p.slice(0, 10) + '…' + p.slice(-18);
}
return `${host}${p}`;
}
catch (e) {
const s = String(url);
if (s.length <= 48)
return s;
return s.slice(0, 18) + '…' + s.slice(-24);
}
}
function tf_getSavedListEls() {
return [
document.getElementById('scan-channel-saved-list'),
document.getElementById('scan-channel-saved-list-isignal')
].filter(Boolean);
}
function tf_renderSavedChannelsStatusFromStorage() {
try {
if (!hasChromeStorage())
return;
const lists = tf_getSavedListEls();
if (!lists.length)
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_ANALYST_NAME_CACHE_KEY, TF_SELECTED_TIME_RANGE_KEY, TF_REMEMBERED_LINKS_KEY], (d) => {
try {
void chrome.runtime
~~~
### tfHistorySignals (15 hits)
~~~js
/tradersfamily/i.test(name))
return null;
if (/^channels?$/i.test(name))
return null;
if (/^history\s*signal/i.test(name))
return null;
return name;
}
catch (e) {
return null;
}
}
}, (results) => {
try {
const val = results && results[0] && results[0].result ? String(results[0].result).trim() : '';
done(val || null);
}
catch (e) {
done(null);
}
});
}
catch (e) {
done(null);
}
};
try {
chrome.tabs.onUpdated.addListener(onUpdated);
}
catch (e) { }
try {
chrome.tabs.create({ url: urlKey, active: false }, (tab) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (!tab || typeof tab.id === 'undefined')
return done(null);
tabId = tab.id;
});
}
catch (e) {
done(null);
}
});
}
catch (e) {
return null;
}
}
async function tf_deleteStoredDataForAnalystRow(rowEl) {
try {
if (!rowEl)
return;
const input = rowEl.querySelector('.analyst-link-input');
const selectEl = rowEl.querySelector('.analyst-pair-select');
const rawUrl = input && input.value ? String(input.value).trim() : '';
const urlKey = tf_normUrlKey(rawUrl);
if (!urlKey)
return;
const selectedPairs = getSelectedPairsFromSelect(selectEl) || [];
const selUpper = selectedPairs.map((p) => String(p || '').toUpperCase());
const hasAll = !selUpper.length || selUpper.includes(ALL_PAIR_OPTION_VALUE);
const keys = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
'tfHistoryBatchProgressMap',
'tfHistoryBatchOverallMap'
];
const data = await new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (r) => resolve(r || {}));
}
catch (e) {
resolve({});
}
});
const sources = (data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object')
? { ...data[TF_ANALYST_SOURCES_KEY] }
: {};
const monthlyStats = (data && data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object')
? { ...data.tfMonthlyStats }
: {};
const noDataPairs = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
const avgSlPips = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
const historySignals = Array.isArray(data && data.tfHistorySignals) ? (data.tfHistorySignals.slice()) : [];
const scoreHistory = Array.isArray(data && data.tfScoreHistory) ? data.tfScoreHistory.slice() : [];
const remembered = Array.isArray(data && data[TF_REMEMBERED_LINKS_KEY]) ? (data[TF_REMEMBERED_LINKS_KEY].slice()) : [];
const nameCache = (data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY] === 'object')
? { ...data[TF_ANALYST_NAME_CACHE_KEY] }
: {};
const baseNames = new Set();
try {
Object.keys(sources || {}).forEach((k) => {
const entry = sources[k];
const u = entry && entry.url ? tf_normUrlKey(entry.url) : null;
if (u && u === urlKey)
baseNames.add(String(k).trim());
});
}
catch (e) { }
try {
remembered.forEach((it) => {
const u = it && it.url ? tf_normUrlKey(it.url) : null;
if (u && u === urlKey) {
if (it.name)
baseNames.add(String(it.name).trim());
if (it.analystName)
baseNames.add(String(it.analystName).trim());
}
});
}
catch (e) { }
try {
const pill = rowEl.querySelector('.analyst-paste-btn.tf-analyst-name-pill') || rowEl.querySelector('.analyst-name-btn');
const t = pill ? String(pill.textContent || '').trim() : '';
if (t && !/^Channel\s+\d+/i.test(t) && t !== '-' && t.toLowerCase() !== 'paste')
baseNames.add(t);
}
catch (e) { }
if (!baseNames.size) {
try {
const resolved = await tf_resolveAnalystNameViaHiddenTab(urlKey);
if (resolved)
baseNames.add(String(resolved).trim());
}
catch (e) { }
}
const baseList = Array.from(baseNames).filter(Boolean);
const baseSet = 
~~~
~~~js

const rawUrl = input && input.value ? String(input.value).trim() : '';
const urlKey = tf_normUrlKey(rawUrl);
if (!urlKey)
return;
const selectedPairs = getSelectedPairsFromSelect(selectEl) || [];
const selUpper = selectedPairs.map((p) => String(p || '').toUpperCase());
const hasAll = !selUpper.length || selUpper.includes(ALL_PAIR_OPTION_VALUE);
const keys = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
'tfHistoryBatchProgressMap',
'tfHistoryBatchOverallMap'
];
const data = await new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (r) => resolve(r || {}));
}
catch (e) {
resolve({});
}
});
const sources = (data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object')
? { ...data[TF_ANALYST_SOURCES_KEY] }
: {};
const monthlyStats = (data && data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object')
? { ...data.tfMonthlyStats }
: {};
const noDataPairs = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
const avgSlPips = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
const historySignals = Array.isArray(data && data.tfHistorySignals) ? (data.tfHistorySignals.slice()) : [];
const scoreHistory = Array.isArray(data && data.tfScoreHistory) ? data.tfScoreHistory.slice() : [];
const remembered = Array.isArray(data && data[TF_REMEMBERED_LINKS_KEY]) ? (data[TF_REMEMBERED_LINKS_KEY].slice()) : [];
const nameCache = (data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY] === 'object')
? { ...data[TF_ANALYST_NAME_CACHE_KEY] }
: {};
const baseNames = new Set();
try {
Object.keys(sources || {}).forEach((k) => {
const entry = sources[k];
const u = entry && entry.url ? tf_normUrlKey(entry.url) : null;
if (u && u === urlKey)
baseNames.add(String(k).trim());
});
}
catch (e) { }
try {
remembered.forEach((it) => {
const u = it && it.url ? tf_normUrlKey(it.url) : null;
if (u && u === urlKey) {
if (it.name)
baseNames.add(String(it.name).trim());
if (it.analystName)
baseNames.add(String(it.analystName).trim());
}
});
}
catch (e) { }
try {
const pill = rowEl.querySelector('.analyst-paste-btn.tf-analyst-name-pill') || rowEl.querySelector('.analyst-name-btn');
const t = pill ? String(pill.textContent || '').trim() : '';
if (t && !/^Channel\s+\d+/i.test(t) && t !== '-' && t.toLowerCase() !== 'paste')
baseNames.add(t);
}
catch (e) { }
if (!baseNames.size) {
try {
const resolved = await tf_resolveAnalystNameViaHiddenTab(urlKey);
if (resolved)
baseNames.add(String(resolved).trim());
}
catch (e) { }
}
const baseList = Array.from(baseNames).filter(Boolean);
const baseSet = new Set(baseList.map((s) => String(s).trim()));
const pairsSet = new Set(selUpper.filter((p) => p && p !== ALL_PAIR_OPTION_VALUE).map((p) => String(p).toUpperCase()));
const parseMonthlyKey = (k) => {
try {
const s = String(k || '').trim();
const m = s.match(/^(.*)\s+\(([A-Za-z0-9]+)\)\s*$/);
if (m)
return { base: String(m[1] || '').trim(), pair: String(m[2] || '').toUpperCase() };
return { base: s, pair: '' };
}
catch (e) {
return { base: String(k || '').trim(), pair: '' };
}
};
try {
Object.keys(sources).forEach((k) => {
const entry = sources[k];
const u = entry && entry.url ? tf_normUrlKey(entry.url) : null;
if (u && u === urlKey)
delete sources[k];
});
baseList.forEach((b) => { if (sources[b])
delete sources[b]; });
}
catch (e) { }
try {
Object.keys(monthlyStats).forEach((k) => {
const { base, pair } = parseMonthlyKey(k);
if (!baseSet.has(base))
return;
if (hasAll) {
delete monthlyStats[k];
return;
}

~~~
~~~js
nput.value ? String(input.value).trim() : '';
const urlKey = tf_normUrlKey(rawUrl);
if (!urlKey)
return;
const selectedPairs = getSelectedPairsFromSelect(selectEl) || [];
const selUpper = selectedPairs.map((p) => String(p || '').toUpperCase());
const hasAll = !selUpper.length || selUpper.includes(ALL_PAIR_OPTION_VALUE);
const keys = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
'tfHistoryBatchProgressMap',
'tfHistoryBatchOverallMap'
];
const data = await new Promise((resolve) => {
try {
chrome.storage.local.get(keys, (r) => resolve(r || {}));
}
catch (e) {
resolve({});
}
});
const sources = (data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object')
? { ...data[TF_ANALYST_SOURCES_KEY] }
: {};
const monthlyStats = (data && data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object')
? { ...data.tfMonthlyStats }
: {};
const noDataPairs = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
const avgSlPips = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
const historySignals = Array.isArray(data && data.tfHistorySignals) ? (data.tfHistorySignals.slice()) : [];
const scoreHistory = Array.isArray(data && data.tfScoreHistory) ? data.tfScoreHistory.slice() : [];
const remembered = Array.isArray(data && data[TF_REMEMBERED_LINKS_KEY]) ? (data[TF_REMEMBERED_LINKS_KEY].slice()) : [];
const nameCache = (data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY] === 'object')
? { ...data[TF_ANALYST_NAME_CACHE_KEY] }
: {};
const baseNames = new Set();
try {
Object.keys(sources || {}).forEach((k) => {
const entry = sources[k];
const u = entry && entry.url ? tf_normUrlKey(entry.url) : null;
if (u && u === urlKey)
baseNames.add(String(k).trim());
});
}
catch (e) { }
try {
remembered.forEach((it) => {
const u = it && it.url ? tf_normUrlKey(it.url) : null;
if (u && u === urlKey) {
if (it.name)
baseNames.add(String(it.name).trim());
if (it.analystName)
baseNames.add(String(it.analystName).trim());
}
});
}
catch (e) { }
try {
const pill = rowEl.querySelector('.analyst-paste-btn.tf-analyst-name-pill') || rowEl.querySelector('.analyst-name-btn');
const t = pill ? String(pill.textContent || '').trim() : '';
if (t && !/^Channel\s+\d+/i.test(t) && t !== '-' && t.toLowerCase() !== 'paste')
baseNames.add(t);
}
catch (e) { }
if (!baseNames.size) {
try {
const resolved = await tf_resolveAnalystNameViaHiddenTab(urlKey);
if (resolved)
baseNames.add(String(resolved).trim());
}
catch (e) { }
}
const baseList = Array.from(baseNames).filter(Boolean);
const baseSet = new Set(baseList.map((s) => String(s).trim()));
const pairsSet = new Set(selUpper.filter((p) => p && p !== ALL_PAIR_OPTION_VALUE).map((p) => String(p).toUpperCase()));
const parseMonthlyKey = (k) => {
try {
const s = String(k || '').trim();
const m = s.match(/^(.*)\s+\(([A-Za-z0-9]+)\)\s*$/);
if (m)
return { base: String(m[1] || '').trim(), pair: String(m[2] || '').toUpperCase() };
return { base: s, pair: '' };
}
catch (e) {
return { base: String(k || '').trim(), pair: '' };
}
};
try {
Object.keys(sources).forEach((k) => {
const entry = sources[k];
const u = entry && entry.url ? tf_normUrlKey(entry.url) : null;
if (u && u === urlKey)
delete sources[k];
});
baseList.forEach((b) => { if (sources[b])
delete sources[b]; });
}
catch (e) { }
try {
Object.keys(monthlyStats).forEach((k) => {
const { base, pair } = parseMonthlyKey(k);
if (!baseSet.has(base))
return;
if (hasAll) {
delete monthlyStats[k];
return;
}
if (!pair) {
delete monthl
~~~
~~~js
ludes(b)) {
delete next[k];
break;
}
}
});
return next;
}
catch (e) {
return mapObj;
}
};
try {
if (prog)
prog = scrubProgressMap(prog);
}
catch (e) { }
try {
if (overall)
overall = scrubProgressMap(overall);
}
catch (e) { }
const nextRemembered = remembered.filter((it) => {
try {
const raw = it && typeof it === 'object' ? (it.url || it.link || '') : String(it || '');
const k = tf_normUrlKey(raw);
return !k || k !== urlKey;
}
catch (e) {
return true;
}
});
try {
Object.keys(nameCache).forEach((rawKey) => {
try {
const k = tf_normUrlKey(rawKey);
if (k && k === urlKey)
delete nameCache[rawKey];
}
catch (e) { }
});
}
catch (e) { }
try {
if (__tfStableAnalystNameByUrl && typeof __tfStableAnalystNameByUrl === 'object') {
Object.keys(__tfStableAnalystNameByUrl).forEach((rawKey) => {
try {
const k = tf_normUrlKey(rawKey);
if (k && k === urlKey)
delete __tfStableAnalystNameByUrl[rawKey];
}
catch (e) { }
});
}
}
catch (e) { }
try {
if (Array.isArray(window.__tfRememberedLinksUiSnapshot)) {
window.__tfRememberedLinksUiSnapshot = window.__tfRememberedLinksUiSnapshot.filter((it) => {
try {
const k = tf_normUrlKey(it && (it.url || it.link) ? (it.url || it.link) : '');
return !k || k !== urlKey;
}
catch (e) {
return true;
}
});
}
}
catch (e) { }
const payload = {
tfMonthlyStats: monthlyStats,
tfHistorySignals: nextHistory,
tfScoreHistory: nextScoreHistory,
tfNoDataPairs: noDataPairs,
tfAvgSlPips: avgSlPips,
[TF_ANALYST_SOURCES_KEY]: sources,
[TF_ANALYST_NAME_CACHE_KEY]: nameCache,
[TF_REMEMBERED_LINKS_KEY]: nextRemembered
};
if (prog)
payload.tfHistoryBatchProgressMap = prog;
if (overall)
payload.tfHistoryBatchOverallMap = overall;
await new Promise((resolve) => {
try {
chrome.storage.local.set(payload, () => {
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
try {
if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
chrome.runtime.sendMessage({ type: 'open_or_reload_dashboard', activate: false }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
return { ok: true, urlKey, rawUrl };
}
catch (e) {
return { ok: false, urlKey: '', rawUrl: '' };
}
}

function tf_resetAnalystRowToBlank(row, containerId) {
try {
if (!row)
return;
const input = row.querySelector('.analyst-link-input');
if (input) {
input.value = '';
input.disabled = false;
input.readOnly = false;
input.removeAttribute('readonly');
}
try {
tf_setAnalystRowLocked(row, false);
}
catch (e) { }
const pasteBtn = row.querySelector('.analyst-paste-btn');
if (pasteBtn) {
try {
pasteBtn.classList.remove('tf-analyst-name-pill');
if (pasteBtn.dataset) {
delete pasteBtn.dataset.tfFullName;
}
}
catch (e) { }
pasteBtn.textContent = 'Paste';
pasteBtn.title = '';
pasteBtn.disabled = false;
}
const nameBtn = row.querySelector('.analyst-name-btn');
if (nameBtn) {
try {
if (nameBtn.dataset)
delete nameBtn.dataset.tfFullName;
}
catch (e) { }
nameBtn.textContent = '-';
nameBtn.title = '';
nameBtn.disabled = false;
}
const sel = row.querySelector('.analyst-pair-select');
if (sel) {
Array.from(sel.options || []).forEach((opt) => {
try {
opt.selected = String(opt.value || '') === ALL_PAIR_OPTION_VALUE;
}
catch (e) { }
});
sel.disabled = false;
}
const widget = row.querySelector('.pair-multiselect');
if (widget) {
widget.classList.remove('open');
widget.style.pointerEvents = '';
widget.style.opacity = '';
}
row.querySelectorAll('.pair-multiselect-dropdown input[type="checkbox"]').forEach((cb) => {
try {
cb.disabled = false;
cb.checked = String(cb.dataset && cb.dataset.value ? cb.dataset.value : '') === ALL_PAIR_OPTION_VALUE;
}
catch (e) { }
});
try {
if (containerId === 'analyst-links-container')
tf_forcePasteButtonInRow(
~~~
~~~js
ti_analyst_export_v1';
const TF_SELECTED_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_ANALYST_SOURCES_KEY = 'tfAnalystSources';
const TF_ANALYST_NAME_CACHE_KEY = 'tfAnalystNameCacheByUrl';
const TF_REMEMBERED_LINKS_KEY = 'tfRememberedAnalystLinks';
const TF_REMEMBER_LINKS_ENABLED_KEY = 'tfRememberLinksEnabled';
let __tfStableAnalystNameByUrl = Object.create(null);
let __tfSavedChannelsRefreshTimer = null;
const TF_HAS_IMPORTED_BUNDLE_KEY = 'tfHasImportedBundle';
const TF_IMPORT_LOCK_ENGAGED_KEY = 'tfImportLockEngaged';
const TF_IMPORT_LOCKED_SIGS_KEY = 'tfImportLockedSigs';
const TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY = 'tfImportLockBaselineMainCount';
const TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY = 'tfImportLockBaselineIsignalCount';
let tf_addModeEngaged = false;
let tf_addModeSigSet = new Set();
let tf_addModeScanLinksManuallyHidden = false;
const TF_ALL_ANALYST_PAIRS_KEY_LEGACY = 'tfAllAnalystPairs';
const TF_ALL_ANALYST_PAIRS_KEY_MAIN = 'tfAllAnalystPairsMain';
const TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL = 'tfAllAnalystPairsIsignal';
const TF_EXPORT_LOCALSTORAGE_KEYS = [
'tf_equity_metric',
'tf_risk_mode',
'tf_compound_months',
'tf_current_balance',
'tf_current_risk_percent',
'tf_risk_overrides',
'tf_sl_type_selection'
];
const TF_EXPORT_STORAGE_KEYS = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
TF_REMEMBER_LINKS_ENABLED_KEY,
TF_ALL_ANALYST_PAIRS_KEY_MAIN,
TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL,
TF_ALL_ANALYST_PAIRS_KEY_LEGACY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCKED_SIGS_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY,
TF_SELECTED_TIME_RANGE_KEY
];
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL'
};
function tf_timeRangeLabel(v) {
const key = v ? String(v) : 'all_time';
return TF_TIME_RANGE_LABELS[key] || 'ALL';
}
function tf_isPlaceholderAnalystName(name) {
const s = String(name || '').trim();
if (!s)
return true;
if (/^imported$/i.test(s))
return true;
if (/^link\s*\d*$/i.test(s))
return true;
if (/^channel\s*(?:\d+|id|"id"|'id')$/i.test(s))
return true;
if (/^https?:\/\//i.test(s))
return true;
return false;
}
function tf_stableJson(value) {
try {
if (Array.isArray(value))
return '[' + value.map((item) => tf_stableJson(item)).join(',') + ']';
if (value && typeof value === 'object') {
const keys = Object.keys(value).sort();
return '{' + keys.map((key) => JSON.stringify(key) + ':' + tf_stableJson(value[key])).join(',') + '}';
}
return JSON.stringify(value);
}
catch (e) {
try {
return JSON.stringify(value);
}
catch (err) {
return String(value);
}
}
}
function tf_getStableAnalystUrlKey(rawUrl) {
try {
return tf_normalizeTfAccountUrl(rawUrl) || '';
}
catch (e) {
return '';
}
}
function tf_rememberStableAnalystName(rawUrl, rawName, persist = true) {
try {
const urlKey = tf_getStableAnalystUrlKey(rawUrl);
const name = String(rawName || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return false;
const previous = String(__tfStableAnalystNameByUrl[urlKey] || '').trim();
if (previous === name)
return false;
__tfStableAnalystNameByUrl[urlKey] = name;
if (persist && hasChromeStorage()) {
chrome.storage.local.get([TF_ANALYST_NAME_CACHE_KEY], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const current = data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY] === 'object'
? { ...data[TF_ANALYST_NAME_CACHE_KEY] }
: {};
if (String(current[urlKey] || '').trim() === name)
return;
current[urlKey] = name;
chrome.storage.local.set({ [TF_ANALYST_N
~~~
### combinedFiles (4 hits)
~~~js
 || {}), ...(tf_cloneJsonSafe(src.tfNoDataPairs, {}) || {}) };
outStorage.tfAvgSlPips = { ...(outStorage.tfAvgSlPips || {}), ...(tf_cloneJsonSafe(src.tfAvgSlPips, {}) || {}) };
outStorage[TF_REMEMBERED_LINKS_KEY] = tf_mergeRememberedLinks(outStorage[TF_REMEMBERED_LINKS_KEY], src[TF_REMEMBERED_LINKS_KEY]);
outStorage[TF_ANALYST_SOURCES_KEY] = tf_mergeAnalystSources(outStorage[TF_ANALYST_SOURCES_KEY], src[TF_ANALYST_SOURCES_KEY]);
outStorage[TF_ANALYST_NAME_CACHE_KEY] = { ...(outStorage[TF_ANALYST_NAME_CACHE_KEY] || {}), ...(tf_cloneJsonSafe(src[TF_ANALYST_NAME_CACHE_KEY], {}) || {}) };
Object.keys(src || {}).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(outStorage, k))
outStorage[k] = tf_cloneJsonSafe(src[k], src[k]);
});
});
try {
outStorage[TF_REMEMBERED_LINKS_KEY] = tf_enrichRememberedLinksWithNames(outStorage[TF_REMEMBERED_LINKS_KEY] || [], outStorage[TF_ANALYST_SOURCES_KEY] || {});
outStorage[TF_REMEMBER_LINKS_ENABLED_KEY] = Array.isArray(outStorage[TF_REMEMBERED_LINKS_KEY]) && outStorage[TF_REMEMBERED_LINKS_KEY].length > 0;
}
catch (e) { }
return {
schema: TF_EXPORT_SCHEMA,
exportedAt: new Date().toISOString(),
exportedBy: owners.length ? owners[0] : (primary.exportedBy || null),
exportedByList: owners,
combined: list.length > 1,
combinedFileCount: list.length,
combinedFiles: Array.isArray(fileNames) ? fileNames.slice() : [],
localState: tf_cloneJsonSafe(primary.localState || {}, {}),
storage: outStorage
};
}

function tf_importPayloadToStorage(payload, afterImport) {
try {
if (!payload || typeof payload !== 'object') {
alert('File tidak valid.');
return;
}
const storage = payload.storage && typeof payload.storage === 'object' ? payload.storage : payload;
if (!storage[TF_REMEMBERED_LINKS_KEY] && storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object') {
const sources = storage[TF_ANALYST_SOURCES_KEY];
const names = Object.keys(sources || {}).sort();
storage[TF_REMEMBERED_LINKS_KEY] = names
.map((n) => {
const it = sources[n] || {};
return {
url: it.url || '',
pairs: Array.isArray(it.pairs) ? it.pairs : ['__ALL__']
};
})
.filter((x) => x.url);
if (storage[TF_REMEMBERED_LINKS_KEY].length) {
storage[TF_REMEMBER_LINKS_ENABLED_KEY] = true;
}
}
if (Array.isArray(storage[TF_REMEMBERED_LINKS_KEY]) && storage[TF_REMEMBERED_LINKS_KEY].length) {
storage[TF_REMEMBER_LINKS_ENABLED_KEY] = true;
}
if (!storage[TF_SELECTED_TIME_RANGE_KEY]) {
storage[TF_SELECTED_TIME_RANGE_KEY] = 'all_time';
}
try {
const __tfDefaults = {};
__tfDefaults['tfMonthlyStats'] = {};
__tfDefaults['tfHistorySignals'] = [];
__tfDefaults['tfScoreHistory'] = [];
__tfDefaults['tfNoDataPairs'] = {};
__tfDefaults['tfAvgSlPips'] = {};
__tfDefaults[TF_ANALYST_SOURCES_KEY] = {};
__tfDefaults[TF_REMEMBERED_LINKS_KEY] = [];
__tfDefaults[TF_REMEMBER_LINKS_ENABLED_KEY] = false;
Object.keys(__tfDefaults).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(storage, k))
storage[k] = __tfDefaults[k];
});
}
catch (e) { }
try {
const remembered = Array.isArray(storage[TF_REMEMBERED_LINKS_KEY]) ? storage[TF_REMEMBERED_LINKS_KEY] : null;
const sources = storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object' ? storage[TF_ANALYST_SOURCES_KEY] : null;
if (remembered && remembered.length && sources) {
const allowed = new Set();
remembered.forEach((it) => {
try {
const u = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const k = u ? tf_normUrlKey(u) : '';
if (k)
allowed.add(k);
}
catch (e) { }
});
const filtered = {};
Object.keys(sources).forEach((nm) => {
try {
const it = sources[nm] || {};
const u = tf_normalizeTfAccountUrl(it.url || it.link || '');
const k = u ? tf_normUrlKey(u) : '';
if (k && allowed.h
~~~
~~~js
';
if (base && allowedNames.has(base))
out[kk] = obj[k];
});
return JSON.stringify(out);
}
catch (e) {
return rawStr;
}
};
if (Object.prototype.hasOwnProperty.call(ls, 'tf_sl_type_selection')) {
ls['tf_sl_type_selection'] = cleanJsonMapString(ls['tf_sl_type_selection']);
}
if (Object.prototype.hasOwnProperty.call(ls, 'tf_risk_overrides')) {
ls['tf_risk_overrides'] = cleanJsonMapString(ls['tf_risk_overrides']);
}
}
}
catch (e) { }
}
}
}
catch (e) { }
try {
tf_applyLocalStateFromImport(payload.localState);
}
catch (e) { }
const toSet = {};
TF_EXPORT_STORAGE_KEYS.forEach((k) => {
if (Object.prototype.hasOwnProperty.call(storage, k)) {
toSet[k] = storage[k];
}
});
try {
if (Object.prototype.hasOwnProperty.call(toSet, 'tfUserProfile'))
delete toSet.tfUserProfile;
}
catch (e) { }
try {
const __tfImportOwners = tf_ownerListFromPayload(payload);
toSet.tfLastImportMeta = (__tfImportOwners.length || (payload && payload.exportedBy)) ? {
exportedAt: payload.exportedAt || '',
exportedBy: __tfImportOwners.length ? __tfImportOwners[0] : (payload.exportedBy || null),
exportedByList: __tfImportOwners,
combined: !!(payload && payload.combined),
combinedFileCount: payload && payload.combinedFileCount ? Number(payload.combinedFileCount) : (__tfImportOwners.length > 1 ? __tfImportOwners.length : 1),
combinedFiles: payload && Array.isArray(payload.combinedFiles) ? payload.combinedFiles.slice() : []
} : null;
toSet.tfLastScanMeta = null;
}
catch (e) { }
toSet[TF_HAS_IMPORTED_BUNDLE_KEY] = true;
toSet[TF_IMPORT_LOCK_ENGAGED_KEY] = false;
toSet[TF_IMPORT_LOCKED_SIGS_KEY] = [];
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] = 0;
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] = 0;
toSet.tfLastImportAt = new Date().toISOString();
setStatus('Importing...');
chrome.storage.local.set(toSet, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
setStatus('Import selesai ✅');
try {
loadPopupStateFromStorage();
}
catch (e) { }
try {
tf_refreshTimeRangeUIFromStorage();
}
catch (e) { }
try {
tf_renderSavedChannelsStatusFromStorage();
}
catch (e) { }
if (typeof afterImport === 'function') {
try {
afterImport();
}
catch (e) { }
}
});
}
catch (e) {
alert('Gagal import file.');
}
}
function tf_startBatchScanFromStoredConfig(originLabel) {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_REMEMBERED_LINKS_KEY, TF_IMPORT_LOCK_ENGAGED_KEY, TF_IMPORT_LOCKED_SIGS_KEY, TF_SELECTED_TIME_RANGE_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] ? d[TF_ANALYST_SOURCES_KEY] : null;
const remembered = d && d[TF_REMEMBERED_LINKS_KEY] ? d[TF_REMEMBERED_LINKS_KEY] : null;
let channels = [];
const nameMaps = tf_buildNameMapsFromSources(sources);
const isPlaceholderName = (s) => {
const t = String(s || '').trim();
if (!t)
return true;
if (/^channel\s*id$/i.test(t))
return true;
if (/^channel\s+\d+$/i.test(t))
return true;
if (/^link\s+\d+$/i.test(t))
return true;
return false;
};
if (Array.isArray(remembered) && remembered.length) {
channels = remembered
.map((it, idx) => {
const url = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const pairs = Array.isArray(it && it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
let nm = (it && (it.name || it.analystName)) ? String(it.name || it.analystName) : '';
if (isPlaceholderName(nm))
nm = '';
if (!nm && url) {
try {
nm = tf_resolveAnalystNameForUrl(url, nameMaps) || '';
}
catch (e) {
nm = '';
}
}
if (!nm) {
const fb = (it && it._fallbackLabel) ? String(it._fallbackLabel) : '';
if (fb && !isPlaceholderName(fb))
nm = fb;
}
if (!nm && url) {
const m = String(url).match(/\/channels\/(\d+)/i);
if (m && m[1])
nm = 'Chann
~~~
~~~js
 obj[k];
});
return JSON.stringify(out);
}
catch (e) {
return rawStr;
}
};
if (Object.prototype.hasOwnProperty.call(ls, 'tf_sl_type_selection')) {
ls['tf_sl_type_selection'] = cleanJsonMapString(ls['tf_sl_type_selection']);
}
if (Object.prototype.hasOwnProperty.call(ls, 'tf_risk_overrides')) {
ls['tf_risk_overrides'] = cleanJsonMapString(ls['tf_risk_overrides']);
}
}
}
catch (e) { }
}
}
}
catch (e) { }
try {
tf_applyLocalStateFromImport(payload.localState);
}
catch (e) { }
const toSet = {};
TF_EXPORT_STORAGE_KEYS.forEach((k) => {
if (Object.prototype.hasOwnProperty.call(storage, k)) {
toSet[k] = storage[k];
}
});
try {
if (Object.prototype.hasOwnProperty.call(toSet, 'tfUserProfile'))
delete toSet.tfUserProfile;
}
catch (e) { }
try {
const __tfImportOwners = tf_ownerListFromPayload(payload);
toSet.tfLastImportMeta = (__tfImportOwners.length || (payload && payload.exportedBy)) ? {
exportedAt: payload.exportedAt || '',
exportedBy: __tfImportOwners.length ? __tfImportOwners[0] : (payload.exportedBy || null),
exportedByList: __tfImportOwners,
combined: !!(payload && payload.combined),
combinedFileCount: payload && payload.combinedFileCount ? Number(payload.combinedFileCount) : (__tfImportOwners.length > 1 ? __tfImportOwners.length : 1),
combinedFiles: payload && Array.isArray(payload.combinedFiles) ? payload.combinedFiles.slice() : []
} : null;
toSet.tfLastScanMeta = null;
}
catch (e) { }
toSet[TF_HAS_IMPORTED_BUNDLE_KEY] = true;
toSet[TF_IMPORT_LOCK_ENGAGED_KEY] = false;
toSet[TF_IMPORT_LOCKED_SIGS_KEY] = [];
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] = 0;
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] = 0;
toSet.tfLastImportAt = new Date().toISOString();
setStatus('Importing...');
chrome.storage.local.set(toSet, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
setStatus('Import selesai ✅');
try {
loadPopupStateFromStorage();
}
catch (e) { }
try {
tf_refreshTimeRangeUIFromStorage();
}
catch (e) { }
try {
tf_renderSavedChannelsStatusFromStorage();
}
catch (e) { }
if (typeof afterImport === 'function') {
try {
afterImport();
}
catch (e) { }
}
});
}
catch (e) {
alert('Gagal import file.');
}
}
function tf_startBatchScanFromStoredConfig(originLabel) {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_REMEMBERED_LINKS_KEY, TF_IMPORT_LOCK_ENGAGED_KEY, TF_IMPORT_LOCKED_SIGS_KEY, TF_SELECTED_TIME_RANGE_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] ? d[TF_ANALYST_SOURCES_KEY] : null;
const remembered = d && d[TF_REMEMBERED_LINKS_KEY] ? d[TF_REMEMBERED_LINKS_KEY] : null;
let channels = [];
const nameMaps = tf_buildNameMapsFromSources(sources);
const isPlaceholderName = (s) => {
const t = String(s || '').trim();
if (!t)
return true;
if (/^channel\s*id$/i.test(t))
return true;
if (/^channel\s+\d+$/i.test(t))
return true;
if (/^link\s+\d+$/i.test(t))
return true;
return false;
};
if (Array.isArray(remembered) && remembered.length) {
channels = remembered
.map((it, idx) => {
const url = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const pairs = Array.isArray(it && it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
let nm = (it && (it.name || it.analystName)) ? String(it.name || it.analystName) : '';
if (isPlaceholderName(nm))
nm = '';
if (!nm && url) {
try {
nm = tf_resolveAnalystNameForUrl(url, nameMaps) || '';
}
catch (e) {
nm = '';
}
}
if (!nm) {
const fb = (it && it._fallbackLabel) ? String(it._fallbackLabel) : '';
if (fb && !isPlaceholderName(fb))
nm = fb;
}
if (!nm && url) {
const m = String(url).match(/\/channels\/(\d+)/i);
if (m && m[1])
nm = 'Channel ' + m[1];
}
if (!nm)
nm = `Link ${idx + 1}`;

~~~
~~~js
stringify(out);
}
catch (e) {
return rawStr;
}
};
if (Object.prototype.hasOwnProperty.call(ls, 'tf_sl_type_selection')) {
ls['tf_sl_type_selection'] = cleanJsonMapString(ls['tf_sl_type_selection']);
}
if (Object.prototype.hasOwnProperty.call(ls, 'tf_risk_overrides')) {
ls['tf_risk_overrides'] = cleanJsonMapString(ls['tf_risk_overrides']);
}
}
}
catch (e) { }
}
}
}
catch (e) { }
try {
tf_applyLocalStateFromImport(payload.localState);
}
catch (e) { }
const toSet = {};
TF_EXPORT_STORAGE_KEYS.forEach((k) => {
if (Object.prototype.hasOwnProperty.call(storage, k)) {
toSet[k] = storage[k];
}
});
try {
if (Object.prototype.hasOwnProperty.call(toSet, 'tfUserProfile'))
delete toSet.tfUserProfile;
}
catch (e) { }
try {
const __tfImportOwners = tf_ownerListFromPayload(payload);
toSet.tfLastImportMeta = (__tfImportOwners.length || (payload && payload.exportedBy)) ? {
exportedAt: payload.exportedAt || '',
exportedBy: __tfImportOwners.length ? __tfImportOwners[0] : (payload.exportedBy || null),
exportedByList: __tfImportOwners,
combined: !!(payload && payload.combined),
combinedFileCount: payload && payload.combinedFileCount ? Number(payload.combinedFileCount) : (__tfImportOwners.length > 1 ? __tfImportOwners.length : 1),
combinedFiles: payload && Array.isArray(payload.combinedFiles) ? payload.combinedFiles.slice() : []
} : null;
toSet.tfLastScanMeta = null;
}
catch (e) { }
toSet[TF_HAS_IMPORTED_BUNDLE_KEY] = true;
toSet[TF_IMPORT_LOCK_ENGAGED_KEY] = false;
toSet[TF_IMPORT_LOCKED_SIGS_KEY] = [];
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] = 0;
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] = 0;
toSet.tfLastImportAt = new Date().toISOString();
setStatus('Importing...');
chrome.storage.local.set(toSet, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
setStatus('Import selesai ✅');
try {
loadPopupStateFromStorage();
}
catch (e) { }
try {
tf_refreshTimeRangeUIFromStorage();
}
catch (e) { }
try {
tf_renderSavedChannelsStatusFromStorage();
}
catch (e) { }
if (typeof afterImport === 'function') {
try {
afterImport();
}
catch (e) { }
}
});
}
catch (e) {
alert('Gagal import file.');
}
}
function tf_startBatchScanFromStoredConfig(originLabel) {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_REMEMBERED_LINKS_KEY, TF_IMPORT_LOCK_ENGAGED_KEY, TF_IMPORT_LOCKED_SIGS_KEY, TF_SELECTED_TIME_RANGE_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] ? d[TF_ANALYST_SOURCES_KEY] : null;
const remembered = d && d[TF_REMEMBERED_LINKS_KEY] ? d[TF_REMEMBERED_LINKS_KEY] : null;
let channels = [];
const nameMaps = tf_buildNameMapsFromSources(sources);
const isPlaceholderName = (s) => {
const t = String(s || '').trim();
if (!t)
return true;
if (/^channel\s*id$/i.test(t))
return true;
if (/^channel\s+\d+$/i.test(t))
return true;
if (/^link\s+\d+$/i.test(t))
return true;
return false;
};
if (Array.isArray(remembered) && remembered.length) {
channels = remembered
.map((it, idx) => {
const url = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const pairs = Array.isArray(it && it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
let nm = (it && (it.name || it.analystName)) ? String(it.name || it.analystName) : '';
if (isPlaceholderName(nm))
nm = '';
if (!nm && url) {
try {
nm = tf_resolveAnalystNameForUrl(url, nameMaps) || '';
}
catch (e) {
nm = '';
}
}
if (!nm) {
const fb = (it && it._fallbackLabel) ? String(it._fallbackLabel) : '';
if (fb && !isPlaceholderName(fb))
nm = fb;
}
if (!nm && url) {
const m = String(url).match(/\/channels\/(\d+)/i);
if (m && m[1])
nm = 'Channel ' + m[1];
}
if (!nm)
nm = `Link ${idx + 1}`;
return url ? { name: nm, 
~~~
### mergeHistory (2 hits)
~~~js
;
return Number.isFinite(n) ? String(Math.round(n * 100000) / 100000) : raw.toLowerCase();
};
const analyst = norm(it && it.analyst).toLowerCase();
const pair = norm(it && it.pair).toUpperCase();
const created = norm((it && (it.createdSortKey != null ? it.createdSortKey : it.createdDate)) || '').toLowerCase();
const closed = norm((it && (it.sortKey != null ? it.sortKey : it.displayDate)) || '').toLowerCase();
const signalId = norm(it && it.signalId).toLowerCase();
// Created At + Closed At are always the core identity. signalId (when present)
// prevents two legitimate signals with the exact same timestamps from being merged.
if (signalId)
return [analyst, pair, created, closed, 'signal:' + signalId].join('|');
const entry = normNumberLike(it && it.entry);
const type = norm(it && it.type).toLowerCase();
return [analyst, pair, created, closed, 'entry:' + entry, 'type:' + type].join('|');
}
catch (e) { return ''; }
}
function tf_recordCompletenessScore(it) {
try {
const keys = ['entry', 'takeProfit', 'stopLoss', 'type', 'createdDate', 'displayDate', 'signalId', 'expiredDate'];
let n = 0;
keys.forEach((k) => {
const v = it && it[k];
if (v !== null && v !== undefined && String(v).trim() !== '' && String(v).trim() !== '-')
n += 1;
});
return n;
}
catch (e) { return 0; }
}
function tf_mergeHistoryArrays(a, b) {
const map = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const key = tf_historyCombineKey(it) || JSON.stringify(it);
const prev = map.get(key);
if (!prev) {
map.set(key, tf_cloneJsonSafe(it, { ...it }));
return;
}
const prevScore = tf_recordCompletenessScore(prev);
const nextScore = tf_recordCompletenessScore(it);
const base = nextScore > prevScore ? { ...prev, ...it } : { ...it, ...prev };
Object.keys(prev || {}).forEach((k) => {
if (base[k] === null || base[k] === undefined || String(base[k]).trim() === '')
base[k] = prev[k];
});
Object.keys(it || {}).forEach((k) => {
if (base[k] === null || base[k] === undefined || String(base[k]).trim() === '')
base[k] = it[k];
});
map.set(key, base);
};
(Array.isArray(a) ? a : []).forEach(put);
(Array.isArray(b) ? b : []).forEach(put);
return Array.from(map.values());
}
function tf_mergeScoreArrays(a, b) {
const map = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const key = [String(it.analyst || it.analystName || '').trim().toLowerCase(), String(it.pair || '').trim().toUpperCase(), String(it.displayDate || it.date || it.sortKey || '').trim(), String(it.score || it.value || '').trim()].join('|');
if (!map.has(key))
map.set(key, tf_cloneJsonSafe(it, { ...it }));
else
map.set(key, { ...map.get(key), ...it });
};
(Array.isArray(a) ? a : []).forEach(put);
(Array.isArray(b) ? b : []).forEach(put);
return Array.from(map.values());
}
function tf_mergeMonthlyStats(a, b) {
const out = tf_cloneJsonSafe(a && typeof a === 'object' ? a : {}, {});
const src = b && typeof b === 'object' ? b : {};
Object.keys(src).forEach((analystKey) => {
const prev = out[analystKey] && typeof out[analystKey] === 'object' ? out[analystKey] : {};
const next = src[analystKey] && typeof src[analystKey] === 'object' ? src[analystKey] : {};
out[analystKey] = { ...prev, ...tf_cloneJsonSafe(next, {}) };
});
return out;
}
function tf_mergeRememberedLinks(a, b) {
const byUrl = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const url = tf_normalizeTfAccountUrl(it.url || it.link || '');
const key = tf_normUrlKey(url);
if (!key)
return;
const rawPairs = Array.isArray(it.pairs) ? it.pairs.map((p) => String(p || '').trim().toUpperCase()).filter(Boolean) : [];
const explicit = rawPairs.filter((p) => p !== ALL_PAIR_OPTION_VALUE && p !== 'ALL');
const p
~~~
~~~js
t finalName = name;
let suffix = 2;
while (Object.prototype.hasOwnProperty.call(out, finalName) && tf_normUrlKey(out[finalName].url || '') !== tf_normUrlKey(row.url || '')) {
finalName = name + ' #' + String(suffix++);
}
out[finalName] = { url: row.url, pairs: row.pairs };
}
return out;
}
function tf_combineImportPayloads(payloads, fileNames) {
const list = (Array.isArray(payloads) ? payloads : []).filter((p) => p && typeof p === 'object');
if (!list.length)
return null;
const primary = list[0];
const outStorage = tf_cloneJsonSafe(primary.storage && typeof primary.storage === 'object' ? primary.storage : primary, {});
const owners = [];
const ownerKey = (o) => String((o && (o.email || o.name)) || '').trim().toLowerCase();
const pushOwner = (o) => {
if (!o || typeof o !== 'object')
return;
const item = { name: String(o.name || '').trim(), email: String(o.email || '').trim(), avatarUrl: String(o.avatarUrl || '') };
if (!item.name && !item.email)
return;
const key = ownerKey(item);
if (!owners.some((x) => ownerKey(x) === key))
owners.push(item);
};
list.forEach((payload, idx) => {
tf_ownerListFromPayload(payload).forEach(pushOwner);
if (idx === 0)
return;
const src = payload.storage && typeof payload.storage === 'object' ? payload.storage : payload;
outStorage.tfHistorySignals = tf_mergeHistoryArrays(outStorage.tfHistorySignals, src.tfHistorySignals);
outStorage.tfScoreHistory = tf_mergeScoreArrays(outStorage.tfScoreHistory, src.tfScoreHistory);
outStorage.tfMonthlyStats = tf_mergeMonthlyStats(outStorage.tfMonthlyStats, src.tfMonthlyStats);
outStorage.tfNoDataPairs = { ...(outStorage.tfNoDataPairs || {}), ...(tf_cloneJsonSafe(src.tfNoDataPairs, {}) || {}) };
outStorage.tfAvgSlPips = { ...(outStorage.tfAvgSlPips || {}), ...(tf_cloneJsonSafe(src.tfAvgSlPips, {}) || {}) };
outStorage[TF_REMEMBERED_LINKS_KEY] = tf_mergeRememberedLinks(outStorage[TF_REMEMBERED_LINKS_KEY], src[TF_REMEMBERED_LINKS_KEY]);
outStorage[TF_ANALYST_SOURCES_KEY] = tf_mergeAnalystSources(outStorage[TF_ANALYST_SOURCES_KEY], src[TF_ANALYST_SOURCES_KEY]);
outStorage[TF_ANALYST_NAME_CACHE_KEY] = { ...(outStorage[TF_ANALYST_NAME_CACHE_KEY] || {}), ...(tf_cloneJsonSafe(src[TF_ANALYST_NAME_CACHE_KEY], {}) || {}) };
Object.keys(src || {}).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(outStorage, k))
outStorage[k] = tf_cloneJsonSafe(src[k], src[k]);
});
});
try {
outStorage[TF_REMEMBERED_LINKS_KEY] = tf_enrichRememberedLinksWithNames(outStorage[TF_REMEMBERED_LINKS_KEY] || [], outStorage[TF_ANALYST_SOURCES_KEY] || {});
outStorage[TF_REMEMBER_LINKS_ENABLED_KEY] = Array.isArray(outStorage[TF_REMEMBERED_LINKS_KEY]) && outStorage[TF_REMEMBERED_LINKS_KEY].length > 0;
}
catch (e) { }
return {
schema: TF_EXPORT_SCHEMA,
exportedAt: new Date().toISOString(),
exportedBy: owners.length ? owners[0] : (primary.exportedBy || null),
exportedByList: owners,
combined: list.length > 1,
combinedFileCount: list.length,
combinedFiles: Array.isArray(fileNames) ? fileNames.slice() : [],
localState: tf_cloneJsonSafe(primary.localState || {}, {}),
storage: outStorage
};
}

function tf_importPayloadToStorage(payload, afterImport) {
try {
if (!payload || typeof payload !== 'object') {
alert('File tidak valid.');
return;
}
const storage = payload.storage && typeof payload.storage === 'object' ? payload.storage : payload;
if (!storage[TF_REMEMBERED_LINKS_KEY] && storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object') {
const sources = storage[TF_ANALYST_SOURCES_KEY];
const names = Object.keys(sources || {}).sort();
storage[TF_REMEMBERED_LINKS_KEY] = names
.map((n) => {
const it = sources[n] || {};
return {
url: it.url || '',
pairs: Array.isArray(it.pairs) ? it.
~~~
### tf_current_balance (1 hits)
~~~js
|| '';
if (el.textContent !== nextText) {
el.textContent = nextText;
}
}
}
const TF_STOP_LABEL = 'Stop Progress!';
const TF_EXPORT_SCHEMA = 'tf_multi_analyst_export_v1';
const TF_SELECTED_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_ANALYST_SOURCES_KEY = 'tfAnalystSources';
const TF_ANALYST_NAME_CACHE_KEY = 'tfAnalystNameCacheByUrl';
const TF_REMEMBERED_LINKS_KEY = 'tfRememberedAnalystLinks';
const TF_REMEMBER_LINKS_ENABLED_KEY = 'tfRememberLinksEnabled';
let __tfStableAnalystNameByUrl = Object.create(null);
let __tfSavedChannelsRefreshTimer = null;
const TF_HAS_IMPORTED_BUNDLE_KEY = 'tfHasImportedBundle';
const TF_IMPORT_LOCK_ENGAGED_KEY = 'tfImportLockEngaged';
const TF_IMPORT_LOCKED_SIGS_KEY = 'tfImportLockedSigs';
const TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY = 'tfImportLockBaselineMainCount';
const TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY = 'tfImportLockBaselineIsignalCount';
let tf_addModeEngaged = false;
let tf_addModeSigSet = new Set();
let tf_addModeScanLinksManuallyHidden = false;
const TF_ALL_ANALYST_PAIRS_KEY_LEGACY = 'tfAllAnalystPairs';
const TF_ALL_ANALYST_PAIRS_KEY_MAIN = 'tfAllAnalystPairsMain';
const TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL = 'tfAllAnalystPairsIsignal';
const TF_EXPORT_LOCALSTORAGE_KEYS = [
'tf_equity_metric',
'tf_risk_mode',
'tf_compound_months',
'tf_current_balance',
'tf_current_risk_percent',
'tf_risk_overrides',
'tf_sl_type_selection'
];
const TF_EXPORT_STORAGE_KEYS = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
TF_REMEMBER_LINKS_ENABLED_KEY,
TF_ALL_ANALYST_PAIRS_KEY_MAIN,
TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL,
TF_ALL_ANALYST_PAIRS_KEY_LEGACY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCKED_SIGS_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY,
TF_SELECTED_TIME_RANGE_KEY
];
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL'
};
function tf_timeRangeLabel(v) {
const key = v ? String(v) : 'all_time';
return TF_TIME_RANGE_LABELS[key] || 'ALL';
}
function tf_isPlaceholderAnalystName(name) {
const s = String(name || '').trim();
if (!s)
return true;
if (/^imported$/i.test(s))
return true;
if (/^link\s*\d*$/i.test(s))
return true;
if (/^channel\s*(?:\d+|id|"id"|'id')$/i.test(s))
return true;
if (/^https?:\/\//i.test(s))
return true;
return false;
}
function tf_stableJson(value) {
try {
if (Array.isArray(value))
return '[' + value.map((item) => tf_stableJson(item)).join(',') + ']';
if (value && typeof value === 'object') {
const keys = Object.keys(value).sort();
return '{' + keys.map((key) => JSON.stringify(key) + ':' + tf_stableJson(value[key])).join(',') + '}';
}
return JSON.stringify(value);
}
catch (e) {
try {
return JSON.stringify(value);
}
catch (err) {
return String(value);
}
}
}
function tf_getStableAnalystUrlKey(rawUrl) {
try {
return tf_normalizeTfAccountUrl(rawUrl) || '';
}
catch (e) {
return '';
}
}
function tf_rememberStableAnalystName(rawUrl, rawName, persist = true) {
try {
const urlKey = tf_getStableAnalystUrlKey(rawUrl);
const name = String(rawName || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return false;
const previous = String(__tfStableAnalystNameByUrl[urlKey] || '').trim();
if (previous === name)
return false;
__tfStableAnalystNameByUrl[urlKey] = name;
if (persist && hasChromeStorage()) {
chrome.storage.local.get([TF_ANALYST_NAME_CACHE_KEY], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const current = data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY] === 'object'
? { ...data[TF_ANALYST_
~~~
### tf_risk_mode (1 hits)
~~~js
us');
if (el) {
const nextText = text || '';
if (el.textContent !== nextText) {
el.textContent = nextText;
}
}
}
const TF_STOP_LABEL = 'Stop Progress!';
const TF_EXPORT_SCHEMA = 'tf_multi_analyst_export_v1';
const TF_SELECTED_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_ANALYST_SOURCES_KEY = 'tfAnalystSources';
const TF_ANALYST_NAME_CACHE_KEY = 'tfAnalystNameCacheByUrl';
const TF_REMEMBERED_LINKS_KEY = 'tfRememberedAnalystLinks';
const TF_REMEMBER_LINKS_ENABLED_KEY = 'tfRememberLinksEnabled';
let __tfStableAnalystNameByUrl = Object.create(null);
let __tfSavedChannelsRefreshTimer = null;
const TF_HAS_IMPORTED_BUNDLE_KEY = 'tfHasImportedBundle';
const TF_IMPORT_LOCK_ENGAGED_KEY = 'tfImportLockEngaged';
const TF_IMPORT_LOCKED_SIGS_KEY = 'tfImportLockedSigs';
const TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY = 'tfImportLockBaselineMainCount';
const TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY = 'tfImportLockBaselineIsignalCount';
let tf_addModeEngaged = false;
let tf_addModeSigSet = new Set();
let tf_addModeScanLinksManuallyHidden = false;
const TF_ALL_ANALYST_PAIRS_KEY_LEGACY = 'tfAllAnalystPairs';
const TF_ALL_ANALYST_PAIRS_KEY_MAIN = 'tfAllAnalystPairsMain';
const TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL = 'tfAllAnalystPairsIsignal';
const TF_EXPORT_LOCALSTORAGE_KEYS = [
'tf_equity_metric',
'tf_risk_mode',
'tf_compound_months',
'tf_current_balance',
'tf_current_risk_percent',
'tf_risk_overrides',
'tf_sl_type_selection'
];
const TF_EXPORT_STORAGE_KEYS = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
TF_REMEMBER_LINKS_ENABLED_KEY,
TF_ALL_ANALYST_PAIRS_KEY_MAIN,
TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL,
TF_ALL_ANALYST_PAIRS_KEY_LEGACY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCKED_SIGS_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY,
TF_SELECTED_TIME_RANGE_KEY
];
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL'
};
function tf_timeRangeLabel(v) {
const key = v ? String(v) : 'all_time';
return TF_TIME_RANGE_LABELS[key] || 'ALL';
}
function tf_isPlaceholderAnalystName(name) {
const s = String(name || '').trim();
if (!s)
return true;
if (/^imported$/i.test(s))
return true;
if (/^link\s*\d*$/i.test(s))
return true;
if (/^channel\s*(?:\d+|id|"id"|'id')$/i.test(s))
return true;
if (/^https?:\/\//i.test(s))
return true;
return false;
}
function tf_stableJson(value) {
try {
if (Array.isArray(value))
return '[' + value.map((item) => tf_stableJson(item)).join(',') + ']';
if (value && typeof value === 'object') {
const keys = Object.keys(value).sort();
return '{' + keys.map((key) => JSON.stringify(key) + ':' + tf_stableJson(value[key])).join(',') + '}';
}
return JSON.stringify(value);
}
catch (e) {
try {
return JSON.stringify(value);
}
catch (err) {
return String(value);
}
}
}
function tf_getStableAnalystUrlKey(rawUrl) {
try {
return tf_normalizeTfAccountUrl(rawUrl) || '';
}
catch (e) {
return '';
}
}
function tf_rememberStableAnalystName(rawUrl, rawName, persist = true) {
try {
const urlKey = tf_getStableAnalystUrlKey(rawUrl);
const name = String(rawName || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return false;
const previous = String(__tfStableAnalystNameByUrl[urlKey] || '').trim();
if (previous === name)
return false;
__tfStableAnalystNameByUrl[urlKey] = name;
if (persist && hasChromeStorage()) {
chrome.storage.local.get([TF_ANALYST_NAME_CACHE_KEY], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const current = data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY
~~~
## assets/tf-remote-sidebar-agent.js
- score: 4, bytes: 134256, sha256: d56b111515e41560f0f21c6e19cc0af1ae4a2ab80c2f95bb8a4007f6f733b713

### tf_multi_analyst_export_v1 (1 hits)
~~~js
e||'',100),email:cleanText(o.email||'',140),avatarUrl:String(o.avatarUrl||'')};if(!item.name&&!item.email)return;const k=ownerKey(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
    const im=data.tfLastImportMeta&&typeof data.tfLastImportMeta==='object'?data.tfLastImportMeta:{};
    const sm=data.tfLastScanMeta&&typeof data.tfLastScanMeta==='object'?data.tfLastScanMeta:{};
    (Array.isArray(im.exportedByList)?im.exportedByList:[]).forEach(pushOwner);pushOwner(im.exportedBy);
    (Array.isArray(sm.scannedByList)?sm.scannedByList:[]).forEach(pushOwner);pushOwner(sm.scannedBy);
    if(!owners.length)pushOwner(data.tfUserProfile);

    const storage={};for(const k of EXPORT_DATA_KEYS)if(Object.prototype.hasOwnProperty.call(data,k))storage[k]=data[k];
    const localState={};
    const localKeys=['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'];
    if(typeof window.tf_collectLocalStateForExport==='function'){
      try{Object.assign(localState,window.tf_collectLocalStateForExport()||{});}catch(_){}
    }
    if(!Object.keys(localState).length){for(const k of localKeys){try{const v=localStorage.getItem(k);if(v!=null)localState[k]=v;}catch(_){}}}

    const payload={schema:'tf_multi_analyst_export_v1',exportedAt:new Date().toISOString(),exportedBy:owners.length?owners[0]:null,exportedByList:owners,localState,storage};
    const payloadText=JSON.stringify(payload);
    const packed=await gzipToBase64(payloadText);
    const id='PC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();

    // REV289 primary large-transfer path: one private Google Drive relay file.
    // This bypasses the Remote command queue for the actual bundle payload.
    // export_bundle_prepare itself remains a tiny realtime command/ACK.
    const forceLegacy=request&&request.forceLegacy===true;
    const requestedChunkSize=Math.max(12000,Math.min(64000,Number(request&&request.chunkSize)||48000));
    const a=await auth();
    if(!forceLegacy&&a&&packed.b64.length<=8500000&&driveRelayAvailableV352()){
      try{
        const relay=await api('/remote/drive-stage-put',{...a,transferId:id,fileName:'tf-pc-export-'+Date.now()+'.relay',encoding:packed.encoding,originalChars:payloadText.length,direction:'PC_TO_MOBILE',data:packed.b64},90000);
        if(relay&&relay.stored===true){
          EXPORT_TRANSFER_CACHE.set(id,{drive:true,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache});
          for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
          const result={ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:1,relayMode:'drive-v1',relayReady:true,encoding:packed.encoding,encodedChars:packed.b64.length,fingerprint:dataFingerprintCache,fullExport:true,purpose,message:'Bundle Export PC siap di private Drive relay untuk satu kali download.'};
          if(purpose==='mirror'||prewarm){
            MIRROR_PRESTAGE_V292=Object.assign({},result,{createdAt:Date.now(),purpose:'mirror'});
            try{await storageSet({[MIRROR_PRESTAGE_KEY_V292]:MIRROR_PRESTAGE_V292});}catch(_){}
          }
          return result;
        }
      }catch(e){
        noteDriveRelayFailureV352(e); // expected compatibility fallback; do not surface as a Chrome extension error
      }
    }

    // Emergency compatibility fallback only. Normal REV289 production should
    // never show 0/N here when the Drive backend is deployed and authorized.
    const chunkSize=requestedChunkSize,total=Math.max(1,Math.ceil(packed.b64.length/chunkSiz
~~~
### localState (5 hits)
~~~js
[cleanText(x.url,520),normalizePairs(x.pairs)]));
        for(const name of Object.keys(src)){
          const it=src[name]||{};const u=cleanText(it.url||it.link||'',520);
          if(u&&pairByUrl.has(u))src[name]=Object.assign({},it,{pairs:pairByUrl.get(u).slice()});
        }
      }
    }

    const owners=[];
    const ownerKey=o=>cleanText(o&&o.email||'',140).toLowerCase()||cleanText(o&&o.name||'',100).toLowerCase();
    const pushOwner=o=>{if(!o||typeof o!=='object')return;const item={name:cleanText(o.name||'',100),email:cleanText(o.email||'',140),avatarUrl:String(o.avatarUrl||'')};if(!item.name&&!item.email)return;const k=ownerKey(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
    const im=data.tfLastImportMeta&&typeof data.tfLastImportMeta==='object'?data.tfLastImportMeta:{};
    const sm=data.tfLastScanMeta&&typeof data.tfLastScanMeta==='object'?data.tfLastScanMeta:{};
    (Array.isArray(im.exportedByList)?im.exportedByList:[]).forEach(pushOwner);pushOwner(im.exportedBy);
    (Array.isArray(sm.scannedByList)?sm.scannedByList:[]).forEach(pushOwner);pushOwner(sm.scannedBy);
    if(!owners.length)pushOwner(data.tfUserProfile);

    const storage={};for(const k of EXPORT_DATA_KEYS)if(Object.prototype.hasOwnProperty.call(data,k))storage[k]=data[k];
    const localState={};
    const localKeys=['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'];
    if(typeof window.tf_collectLocalStateForExport==='function'){
      try{Object.assign(localState,window.tf_collectLocalStateForExport()||{});}catch(_){}
    }
    if(!Object.keys(localState).length){for(const k of localKeys){try{const v=localStorage.getItem(k);if(v!=null)localState[k]=v;}catch(_){}}}

    const payload={schema:'tf_multi_analyst_export_v1',exportedAt:new Date().toISOString(),exportedBy:owners.length?owners[0]:null,exportedByList:owners,localState,storage};
    const payloadText=JSON.stringify(payload);
    const packed=await gzipToBase64(payloadText);
    const id='PC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();

    // REV289 primary large-transfer path: one private Google Drive relay file.
    // This bypasses the Remote command queue for the actual bundle payload.
    // export_bundle_prepare itself remains a tiny realtime command/ACK.
    const forceLegacy=request&&request.forceLegacy===true;
    const requestedChunkSize=Math.max(12000,Math.min(64000,Number(request&&request.chunkSize)||48000));
    const a=await auth();
    if(!forceLegacy&&a&&packed.b64.length<=8500000&&driveRelayAvailableV352()){
      try{
        const relay=await api('/remote/drive-stage-put',{...a,transferId:id,fileName:'tf-pc-export-'+Date.now()+'.relay',encoding:packed.encoding,originalChars:payloadText.length,direction:'PC_TO_MOBILE',data:packed.b64},90000);
        if(relay&&relay.stored===true){
          EXPORT_TRANSFER_CACHE.set(id,{drive:true,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache});
          for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
          const result={ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:1,relayMode:'drive-v1',relayReady:true,encoding:packed.encoding,encodedChars:packed.b64.length,fingerprint:dataFingerprintCache,fullExport:true,purpose,message:'Bundle Export PC siap di private Drive relay untuk satu kali download.'};
          if(purpose==='mirror'||prewarm){
            MIRROR_PRESTAGE_V292=Object.assign({},result,{createdAt:Date.now(),purpose:'mirror'});
            try{await s
~~~
~~~js
     }
      }
    }

    const owners=[];
    const ownerKey=o=>cleanText(o&&o.email||'',140).toLowerCase()||cleanText(o&&o.name||'',100).toLowerCase();
    const pushOwner=o=>{if(!o||typeof o!=='object')return;const item={name:cleanText(o.name||'',100),email:cleanText(o.email||'',140),avatarUrl:String(o.avatarUrl||'')};if(!item.name&&!item.email)return;const k=ownerKey(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
    const im=data.tfLastImportMeta&&typeof data.tfLastImportMeta==='object'?data.tfLastImportMeta:{};
    const sm=data.tfLastScanMeta&&typeof data.tfLastScanMeta==='object'?data.tfLastScanMeta:{};
    (Array.isArray(im.exportedByList)?im.exportedByList:[]).forEach(pushOwner);pushOwner(im.exportedBy);
    (Array.isArray(sm.scannedByList)?sm.scannedByList:[]).forEach(pushOwner);pushOwner(sm.scannedBy);
    if(!owners.length)pushOwner(data.tfUserProfile);

    const storage={};for(const k of EXPORT_DATA_KEYS)if(Object.prototype.hasOwnProperty.call(data,k))storage[k]=data[k];
    const localState={};
    const localKeys=['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'];
    if(typeof window.tf_collectLocalStateForExport==='function'){
      try{Object.assign(localState,window.tf_collectLocalStateForExport()||{});}catch(_){}
    }
    if(!Object.keys(localState).length){for(const k of localKeys){try{const v=localStorage.getItem(k);if(v!=null)localState[k]=v;}catch(_){}}}

    const payload={schema:'tf_multi_analyst_export_v1',exportedAt:new Date().toISOString(),exportedBy:owners.length?owners[0]:null,exportedByList:owners,localState,storage};
    const payloadText=JSON.stringify(payload);
    const packed=await gzipToBase64(payloadText);
    const id='PC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();

    // REV289 primary large-transfer path: one private Google Drive relay file.
    // This bypasses the Remote command queue for the actual bundle payload.
    // export_bundle_prepare itself remains a tiny realtime command/ACK.
    const forceLegacy=request&&request.forceLegacy===true;
    const requestedChunkSize=Math.max(12000,Math.min(64000,Number(request&&request.chunkSize)||48000));
    const a=await auth();
    if(!forceLegacy&&a&&packed.b64.length<=8500000&&driveRelayAvailableV352()){
      try{
        const relay=await api('/remote/drive-stage-put',{...a,transferId:id,fileName:'tf-pc-export-'+Date.now()+'.relay',encoding:packed.encoding,originalChars:payloadText.length,direction:'PC_TO_MOBILE',data:packed.b64},90000);
        if(relay&&relay.stored===true){
          EXPORT_TRANSFER_CACHE.set(id,{drive:true,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache});
          for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
          const result={ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:1,relayMode:'drive-v1',relayReady:true,encoding:packed.encoding,encodedChars:packed.b64.length,fingerprint:dataFingerprintCache,fullExport:true,purpose,message:'Bundle Export PC siap di private Drive relay untuk satu kali download.'};
          if(purpose==='mirror'||prewarm){
            MIRROR_PRESTAGE_V292=Object.assign({},result,{createdAt:Date.now(),purpose:'mirror'});
            try{await storageSet({[MIRROR_PRESTAGE_KEY_V292]:MIRROR_PRESTAGE_V292});}catch(_){}
          }
          return result;
        }
      }catch(e){
        noteDriveRelayFailureV352(e); // expected compatibility fallback; do not surface as a Chrome extension error
      }
    }

    
~~~
~~~js
).toLowerCase()||cleanText(o&&o.name||'',100).toLowerCase();
    const pushOwner=o=>{if(!o||typeof o!=='object')return;const item={name:cleanText(o.name||'',100),email:cleanText(o.email||'',140),avatarUrl:String(o.avatarUrl||'')};if(!item.name&&!item.email)return;const k=ownerKey(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
    const im=data.tfLastImportMeta&&typeof data.tfLastImportMeta==='object'?data.tfLastImportMeta:{};
    const sm=data.tfLastScanMeta&&typeof data.tfLastScanMeta==='object'?data.tfLastScanMeta:{};
    (Array.isArray(im.exportedByList)?im.exportedByList:[]).forEach(pushOwner);pushOwner(im.exportedBy);
    (Array.isArray(sm.scannedByList)?sm.scannedByList:[]).forEach(pushOwner);pushOwner(sm.scannedBy);
    if(!owners.length)pushOwner(data.tfUserProfile);

    const storage={};for(const k of EXPORT_DATA_KEYS)if(Object.prototype.hasOwnProperty.call(data,k))storage[k]=data[k];
    const localState={};
    const localKeys=['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'];
    if(typeof window.tf_collectLocalStateForExport==='function'){
      try{Object.assign(localState,window.tf_collectLocalStateForExport()||{});}catch(_){}
    }
    if(!Object.keys(localState).length){for(const k of localKeys){try{const v=localStorage.getItem(k);if(v!=null)localState[k]=v;}catch(_){}}}

    const payload={schema:'tf_multi_analyst_export_v1',exportedAt:new Date().toISOString(),exportedBy:owners.length?owners[0]:null,exportedByList:owners,localState,storage};
    const payloadText=JSON.stringify(payload);
    const packed=await gzipToBase64(payloadText);
    const id='PC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();

    // REV289 primary large-transfer path: one private Google Drive relay file.
    // This bypasses the Remote command queue for the actual bundle payload.
    // export_bundle_prepare itself remains a tiny realtime command/ACK.
    const forceLegacy=request&&request.forceLegacy===true;
    const requestedChunkSize=Math.max(12000,Math.min(64000,Number(request&&request.chunkSize)||48000));
    const a=await auth();
    if(!forceLegacy&&a&&packed.b64.length<=8500000&&driveRelayAvailableV352()){
      try{
        const relay=await api('/remote/drive-stage-put',{...a,transferId:id,fileName:'tf-pc-export-'+Date.now()+'.relay',encoding:packed.encoding,originalChars:payloadText.length,direction:'PC_TO_MOBILE',data:packed.b64},90000);
        if(relay&&relay.stored===true){
          EXPORT_TRANSFER_CACHE.set(id,{drive:true,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache});
          for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
          const result={ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:1,relayMode:'drive-v1',relayReady:true,encoding:packed.encoding,encodedChars:packed.b64.length,fingerprint:dataFingerprintCache,fullExport:true,purpose,message:'Bundle Export PC siap di private Drive relay untuk satu kali download.'};
          if(purpose==='mirror'||prewarm){
            MIRROR_PRESTAGE_V292=Object.assign({},result,{createdAt:Date.now(),purpose:'mirror'});
            try{await storageSet({[MIRROR_PRESTAGE_KEY_V292]:MIRROR_PRESTAGE_V292});}catch(_){}
          }
          return result;
        }
      }catch(e){
        noteDriveRelayFailureV352(e); // expected compatibility fallback; do not surface as a Chrome extension error
      }
    }

    // Emergency compatibility fallback only. Normal REV289 production should
    // never show 0
~~~
~~~js
ypeof o!=='object')return;const item={name:cleanText(o.name||'',100),email:cleanText(o.email||'',140),avatarUrl:String(o.avatarUrl||'')};if(!item.name&&!item.email)return;const k=ownerKey(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
    const im=data.tfLastImportMeta&&typeof data.tfLastImportMeta==='object'?data.tfLastImportMeta:{};
    const sm=data.tfLastScanMeta&&typeof data.tfLastScanMeta==='object'?data.tfLastScanMeta:{};
    (Array.isArray(im.exportedByList)?im.exportedByList:[]).forEach(pushOwner);pushOwner(im.exportedBy);
    (Array.isArray(sm.scannedByList)?sm.scannedByList:[]).forEach(pushOwner);pushOwner(sm.scannedBy);
    if(!owners.length)pushOwner(data.tfUserProfile);

    const storage={};for(const k of EXPORT_DATA_KEYS)if(Object.prototype.hasOwnProperty.call(data,k))storage[k]=data[k];
    const localState={};
    const localKeys=['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'];
    if(typeof window.tf_collectLocalStateForExport==='function'){
      try{Object.assign(localState,window.tf_collectLocalStateForExport()||{});}catch(_){}
    }
    if(!Object.keys(localState).length){for(const k of localKeys){try{const v=localStorage.getItem(k);if(v!=null)localState[k]=v;}catch(_){}}}

    const payload={schema:'tf_multi_analyst_export_v1',exportedAt:new Date().toISOString(),exportedBy:owners.length?owners[0]:null,exportedByList:owners,localState,storage};
    const payloadText=JSON.stringify(payload);
    const packed=await gzipToBase64(payloadText);
    const id='PC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();

    // REV289 primary large-transfer path: one private Google Drive relay file.
    // This bypasses the Remote command queue for the actual bundle payload.
    // export_bundle_prepare itself remains a tiny realtime command/ACK.
    const forceLegacy=request&&request.forceLegacy===true;
    const requestedChunkSize=Math.max(12000,Math.min(64000,Number(request&&request.chunkSize)||48000));
    const a=await auth();
    if(!forceLegacy&&a&&packed.b64.length<=8500000&&driveRelayAvailableV352()){
      try{
        const relay=await api('/remote/drive-stage-put',{...a,transferId:id,fileName:'tf-pc-export-'+Date.now()+'.relay',encoding:packed.encoding,originalChars:payloadText.length,direction:'PC_TO_MOBILE',data:packed.b64},90000);
        if(relay&&relay.stored===true){
          EXPORT_TRANSFER_CACHE.set(id,{drive:true,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache});
          for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
          const result={ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:1,relayMode:'drive-v1',relayReady:true,encoding:packed.encoding,encodedChars:packed.b64.length,fingerprint:dataFingerprintCache,fullExport:true,purpose,message:'Bundle Export PC siap di private Drive relay untuk satu kali download.'};
          if(purpose==='mirror'||prewarm){
            MIRROR_PRESTAGE_V292=Object.assign({},result,{createdAt:Date.now(),purpose:'mirror'});
            try{await storageSet({[MIRROR_PRESTAGE_KEY_V292]:MIRROR_PRESTAGE_V292});}catch(_){}
          }
          return result;
        }
      }catch(e){
        noteDriveRelayFailureV352(e); // expected compatibility fallback; do not surface as a Chrome extension error
      }
    }

    // Emergency compatibility fallback only. Normal REV289 production should
    // never show 0/N here when the Drive backend is deployed and authorized.
    const chunkSize=requestedChunk
~~~
~~~js
Key(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
    const im=data.tfLastImportMeta&&typeof data.tfLastImportMeta==='object'?data.tfLastImportMeta:{};
    const sm=data.tfLastScanMeta&&typeof data.tfLastScanMeta==='object'?data.tfLastScanMeta:{};
    (Array.isArray(im.exportedByList)?im.exportedByList:[]).forEach(pushOwner);pushOwner(im.exportedBy);
    (Array.isArray(sm.scannedByList)?sm.scannedByList:[]).forEach(pushOwner);pushOwner(sm.scannedBy);
    if(!owners.length)pushOwner(data.tfUserProfile);

    const storage={};for(const k of EXPORT_DATA_KEYS)if(Object.prototype.hasOwnProperty.call(data,k))storage[k]=data[k];
    const localState={};
    const localKeys=['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'];
    if(typeof window.tf_collectLocalStateForExport==='function'){
      try{Object.assign(localState,window.tf_collectLocalStateForExport()||{});}catch(_){}
    }
    if(!Object.keys(localState).length){for(const k of localKeys){try{const v=localStorage.getItem(k);if(v!=null)localState[k]=v;}catch(_){}}}

    const payload={schema:'tf_multi_analyst_export_v1',exportedAt:new Date().toISOString(),exportedBy:owners.length?owners[0]:null,exportedByList:owners,localState,storage};
    const payloadText=JSON.stringify(payload);
    const packed=await gzipToBase64(payloadText);
    const id='PC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();

    // REV289 primary large-transfer path: one private Google Drive relay file.
    // This bypasses the Remote command queue for the actual bundle payload.
    // export_bundle_prepare itself remains a tiny realtime command/ACK.
    const forceLegacy=request&&request.forceLegacy===true;
    const requestedChunkSize=Math.max(12000,Math.min(64000,Number(request&&request.chunkSize)||48000));
    const a=await auth();
    if(!forceLegacy&&a&&packed.b64.length<=8500000&&driveRelayAvailableV352()){
      try{
        const relay=await api('/remote/drive-stage-put',{...a,transferId:id,fileName:'tf-pc-export-'+Date.now()+'.relay',encoding:packed.encoding,originalChars:payloadText.length,direction:'PC_TO_MOBILE',data:packed.b64},90000);
        if(relay&&relay.stored===true){
          EXPORT_TRANSFER_CACHE.set(id,{drive:true,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache});
          for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
          const result={ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:1,relayMode:'drive-v1',relayReady:true,encoding:packed.encoding,encodedChars:packed.b64.length,fingerprint:dataFingerprintCache,fullExport:true,purpose,message:'Bundle Export PC siap di private Drive relay untuk satu kali download.'};
          if(purpose==='mirror'||prewarm){
            MIRROR_PRESTAGE_V292=Object.assign({},result,{createdAt:Date.now(),purpose:'mirror'});
            try{await storageSet({[MIRROR_PRESTAGE_KEY_V292]:MIRROR_PRESTAGE_V292});}catch(_){}
          }
          return result;
        }
      }catch(e){
        noteDriveRelayFailureV352(e); // expected compatibility fallback; do not surface as a Chrome extension error
      }
    }

    // Emergency compatibility fallback only. Normal REV289 production should
    // never show 0/N here when the Drive backend is deployed and authorized.
    const chunkSize=requestedChunkSize,total=Math.max(1,Math.ceil(packed.b64.length/chunkSize));
    const chunks=[];for(let i=0;i<total;i++)chunks.push(packed.b64.slice(i*chunkSize,(i+1)*chunkSize));
    EXPORT_TRANSF
~~~
### tfHistorySignals (3 hits)
~~~js
(() => {
  'use strict';

  const API = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const CREDS_KEY = 'tfLicenseCredentials';
  const SESSION_KEY = 'tfDeviceSessionTokenV1';
  const STATE_KEY = 'tfDeviceLockStateV1';
  const SYNC_ONLINE_MS = 3000;
  const SYNC_IDLE_MS = 3000;
  const HTTP_RECOVERY_BACKOFF_MS = [3000, 5000, 10000, 30000];
  const REQUEST_TIMEOUT_MS = 26000;
  const LAST_EXEC_KEY = 'tfRemoteLastExecutedCommandV260';
  const PAIRS = ['XAUUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','EURJPY','GBPJPY','AUDJPY','NZDJPY','CADJPY','CHFJPY','USDCAD','USDCHF'];
  const ALL = '__ALL__';
  const REMOTE_IMPORT_META_KEY = 'tfRemoteImportMetaV245';
  const REMOTE_IMPORT_CHUNK_PREFIX = 'tfRemoteImportChunkV245_';
  const IMPORT_DATA_KEYS = ['tfMonthlyStats','tfHistorySignals','tfScoreHistory','tfNoDataPairs','tfAvgSlPips','tfAnalystSources','tfAnalystNameCacheByUrl','tfRememberedAnalystLinks','tfRememberLinksEnabled','tfAllAnalystPairsMain','tfAllAnalystPairsIsignal','tfAllAnalystPairs','tfImportLockEngaged','tfImportLockedSigs','tfImportLockBaselineMainCount','tfImportLockBaselineIsignalCount','tfSelectedTimeRange','tfLastImportMeta','tfLastScanMeta','tfHasImportedBundle','tfLastImportAt'];
  const EXPORT_DATA_KEYS = ['tfMonthlyStats','tfHistorySignals','tfScoreHistory','tfNoDataPairs','tfAvgSlPips','tfAnalystSources','tfAnalystNameCacheByUrl','tfRememberedAnalystLinks','tfRememberLinksEnabled','tfAllAnalystPairsMain','tfAllAnalystPairsIsignal','tfAllAnalystPairs','tfImportLockEngaged','tfImportLockedSigs','tfImportLockBaselineMainCount','tfImportLockBaselineIsignalCount','tfSelectedTimeRange'];

  let remoteMobileOnline = false;
  let busy = false;
  let timer = null;
  let badgeTimer = null;
  let lastBadgeState = null;
  let failureCount = 0;
  let httpRecoveryStep = 0;
  let lastSuccessAt = 0;
  let hasImportDataCache = false;
  let dataFingerprintCache = '';
  let dataCountCache = {history:0,analysts:0,remembered:0};
  let rememberedAnalystsCache=[];
  let lastRemoteDataCacheAt=0;
  let selectedTimeRangeCache = 'all_time';
  let loginStateCache={state:'unknown',loggedIn:false,loggedOut:false,error:''};
  let userAvatarCache='';
  let loginViewWatchTimer=null,lastLoginViewObserved='';
  let importLockEngagedCache=false;
  let importLockedSigsCache=[];
  let scanResolvedNamesByUrlCache=Object.create(null);
  let manualUnresolvedUrls=new Set();
  let sawBatchScanActive=false;
  let lastUiEvent={seq:0,action:'',label:'',source:'PC',at:0};
  let immediateSyncTimer=null,remoteApplying=false,activeCommandId='';
  // REV268: direct WebRTC command bus + WebSocket fallback + effective-row authority. HTTP polling remains only as a
  // compatibility/failover path when the Fast Lane backend is unavailable.
  let fastWs=null,fastReady=false,fastConnecting=false,fastReconnectTimer=null,fastSnapshotTimer=null,fastHeartbeatTimer=null;
  // REV272: pure-browser Service Worker owns the persistent WebSocket; Offscreen document owns WebRTC.
  // Sidebar visibility/lifecycle no longer owns the realtime transport.
  let browserCoreWsReady=false,browserCoreDirectReady=false,browserCoreMode='connecting',browserCoreRtt=0,browserCo
~~~
~~~js
(() => {
  'use strict';

  const API = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const CREDS_KEY = 'tfLicenseCredentials';
  const SESSION_KEY = 'tfDeviceSessionTokenV1';
  const STATE_KEY = 'tfDeviceLockStateV1';
  const SYNC_ONLINE_MS = 3000;
  const SYNC_IDLE_MS = 3000;
  const HTTP_RECOVERY_BACKOFF_MS = [3000, 5000, 10000, 30000];
  const REQUEST_TIMEOUT_MS = 26000;
  const LAST_EXEC_KEY = 'tfRemoteLastExecutedCommandV260';
  const PAIRS = ['XAUUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','EURJPY','GBPJPY','AUDJPY','NZDJPY','CADJPY','CHFJPY','USDCAD','USDCHF'];
  const ALL = '__ALL__';
  const REMOTE_IMPORT_META_KEY = 'tfRemoteImportMetaV245';
  const REMOTE_IMPORT_CHUNK_PREFIX = 'tfRemoteImportChunkV245_';
  const IMPORT_DATA_KEYS = ['tfMonthlyStats','tfHistorySignals','tfScoreHistory','tfNoDataPairs','tfAvgSlPips','tfAnalystSources','tfAnalystNameCacheByUrl','tfRememberedAnalystLinks','tfRememberLinksEnabled','tfAllAnalystPairsMain','tfAllAnalystPairsIsignal','tfAllAnalystPairs','tfImportLockEngaged','tfImportLockedSigs','tfImportLockBaselineMainCount','tfImportLockBaselineIsignalCount','tfSelectedTimeRange','tfLastImportMeta','tfLastScanMeta','tfHasImportedBundle','tfLastImportAt'];
  const EXPORT_DATA_KEYS = ['tfMonthlyStats','tfHistorySignals','tfScoreHistory','tfNoDataPairs','tfAvgSlPips','tfAnalystSources','tfAnalystNameCacheByUrl','tfRememberedAnalystLinks','tfRememberLinksEnabled','tfAllAnalystPairsMain','tfAllAnalystPairsIsignal','tfAllAnalystPairs','tfImportLockEngaged','tfImportLockedSigs','tfImportLockBaselineMainCount','tfImportLockBaselineIsignalCount','tfSelectedTimeRange'];

  let remoteMobileOnline = false;
  let busy = false;
  let timer = null;
  let badgeTimer = null;
  let lastBadgeState = null;
  let failureCount = 0;
  let httpRecoveryStep = 0;
  let lastSuccessAt = 0;
  let hasImportDataCache = false;
  let dataFingerprintCache = '';
  let dataCountCache = {history:0,analysts:0,remembered:0};
  let rememberedAnalystsCache=[];
  let lastRemoteDataCacheAt=0;
  let selectedTimeRangeCache = 'all_time';
  let loginStateCache={state:'unknown',loggedIn:false,loggedOut:false,error:''};
  let userAvatarCache='';
  let loginViewWatchTimer=null,lastLoginViewObserved='';
  let importLockEngagedCache=false;
  let importLockedSigsCache=[];
  let scanResolvedNamesByUrlCache=Object.create(null);
  let manualUnresolvedUrls=new Set();
  let sawBatchScanActive=false;
  let lastUiEvent={seq:0,action:'',label:'',source:'PC',at:0};
  let immediateSyncTimer=null,remoteApplying=false,activeCommandId='';
  // REV268: direct WebRTC command bus + WebSocket fallback + effective-row authority. HTTP polling remains only as a
  // compatibility/failover path when the Fast Lane backend is unavailable.
  let fastWs=null,fastReady=false,fastConnecting=false,fastReconnectTimer=null,fastSnapshotTimer=null,fastHeartbeatTimer=null;
  // REV272: pure-browser Service Worker owns the persistent WebSocket; Offscreen document owns WebRTC.
  // Sidebar visibility/lifecycle no longer owns the realtime transport.
  let browserCoreWsReady=false,browserCoreDirectReady=false,browserCoreMode='connecting',browserCoreRtt=0,browserCoreConnectionState='idle',browserCoreLastError='',browserCoreHttpReadyAt=0,browserCoreLastStableOnlineAt=0;
  const REMOTE_UI_ONLINE_HOLD_MS=60000; // REV355: keep a proven live server session visually stable during automatic recovery
  const REMOTE_ENABLED_KEY='tfRemoteAlwaysOnlineV276'; // preserved key: REV277 keeps user choice
  let remoteAvailabilityEnabled=false,remoteAvailabilityLoaded=false,remoteAvailabilityBusy=false;
  // REV268: direct peer-to-peer WebRTC data channel. Web
~~~
~~~js
top=/stop|stopping/i.test(updateText);
        const active=batchStop||updateStop||(/\b(\d+)\s*\/\s*(\d+)\b/.test(raw)&&pct<100);
        const frac=raw.match(/\b(\d+)\s*\/\s*(\d+)\b/);if(!ms.length&&frac&&Number(frac[2])>0)pct=Math.round(Number(frac[1])*100/Number(frac[2]));
        const source=batchStop?'submit':updateStop?'update':'';
        return {active:!!active,percent:Math.max(0,Math.min(100,pct||0)),text:raw.slice(0,260)||batchText||updateText,source};
      })(),
      controls:{
        update:buttonSnapshot('tf-btn-update-main'),
        refresh:buttonSnapshot('tf-btn-refresh-main'),
        submit:batch ? {text:cleanText(batch.textContent,90),disabled:!!batch.disabled,visible:isVisible(batch),id:batch.id||''} : {text:'',disabled:true,visible:false,id:''},
        scanChannel:buttonSnapshot('scan-btn'),
        scanFromIsignal:buttonSnapshot('scan-from-isignal-btn'),
        exportData:buttonSnapshot('tf-btn-export-main')
      },
      lastUiEvent:lastUiEvent,
      browserRemoteCore:{wsReady:!!browserCoreWsReady,directReady:!!browserCoreDirectReady,mode:cleanText(browserCoreMode,30),rtt:Number(browserCoreRtt||0),revision:'REV275'},
      capturedAt:new Date().toISOString()
    };
  }

  async function refreshRemoteDataCache(){
    try{
      // REV257: never read tfHistorySignals on the 700ms Remote refresh. That array can
      // be huge and was the main reason opening Remote felt slow. Small metadata
      // keys are enough for live Remote state.
      const d=await storageGet(['tfHasImportedBundle','tfLastImportMeta','tfLastImportAt','tfAnalystSources','tfAnalystNameCacheByUrl','tfRememberedAnalystLinks','tfSelectedTimeRange','tfImportLockEngaged','tfImportLockedSigs','tfLoginConfirmed','tfAccountLoginState','tfRootLoginState','tfEnteredMain','tfUserProfile','tfLoginError','tfForceLoginForm','tfExplicitLogoutAt','tfScanInProgress']);
      const src=d.tfAnalystSources&&typeof d.tfAnalystSources==='object'?d.tfAnalystSources:{};
      const cache=d.tfAnalystNameCacheByUrl&&typeof d.tfAnalystNameCacheByUrl==='object'?d.tfAnalystNameCacheByUrl:{};
      const remembered=Array.isArray(d.tfRememberedAnalystLinks)?d.tfRememberedAnalystLinks:[];
      const meta=d.tfLastImportMeta&&typeof d.tfLastImportMeta==='object'?d.tfLastImportMeta:{};
      const histCount=Number(meta.historyCount||meta.signalCount||meta.tradeCount||0)||0;
      hasImportDataCache=!!d.tfHasImportedBundle || !!d.tfLastImportMeta;
      rememberedAnalystsCache=remembered.map(it=>({url:cleanText(it&&it.url||'',520),name:cleanText(it&&(it.name||it.analystName)||'',80),pairs:normalizePairs(it&&it.pairs)})).filter(it=>it.url).slice(0,28);
      dataCountCache={history:histCount,analysts:Object.keys(src).length,remembered:remembered.length};
      selectedTimeRangeCache=String(d.tfSelectedTimeRange||selectedTimeRangeCache||'all_time');
      const accountState=String(d.tfAccountLoginState||'').trim().toLowerCase();
      const rootState=String(d.tfRootLoginState||'').trim().toLowerCase();
      const profile=d.tfUserProfile&&typeof d.tfUserProfile==='object'?d.tfUserProfile:null;
      userAvatarCache=String(profile&&profile.avatarUrl||'').trim();
      const explicitLogout=!!(d.tfForceLoginForm===true||Number(d.tfExplicitLogoutAt||0)>0||/logged[_ -]?out|logout|offline|unauth/.test(accountState)||/logged[_ -]?out|logout|offline|unauth/.test(rootState));
      const storageLoggedIn=!explicitLogout&&!!(d.tfLoginConfirmed===true||d.tfEnteredMain===true||(profile&&(profile.email||profile.name))||/logged[_ -]?in|online|authenticated|active/.test(accountState)||/logged[_ -]?in|online|authenticated|active/.test(rootState));
      const storageLoggedOut=explici
~~~
### tf_current_balance (1 hits)
~~~js
){
          const it=src[name]||{};const u=cleanText(it.url||it.link||'',520);
          if(u&&pairByUrl.has(u))src[name]=Object.assign({},it,{pairs:pairByUrl.get(u).slice()});
        }
      }
    }

    const owners=[];
    const ownerKey=o=>cleanText(o&&o.email||'',140).toLowerCase()||cleanText(o&&o.name||'',100).toLowerCase();
    const pushOwner=o=>{if(!o||typeof o!=='object')return;const item={name:cleanText(o.name||'',100),email:cleanText(o.email||'',140),avatarUrl:String(o.avatarUrl||'')};if(!item.name&&!item.email)return;const k=ownerKey(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
    const im=data.tfLastImportMeta&&typeof data.tfLastImportMeta==='object'?data.tfLastImportMeta:{};
    const sm=data.tfLastScanMeta&&typeof data.tfLastScanMeta==='object'?data.tfLastScanMeta:{};
    (Array.isArray(im.exportedByList)?im.exportedByList:[]).forEach(pushOwner);pushOwner(im.exportedBy);
    (Array.isArray(sm.scannedByList)?sm.scannedByList:[]).forEach(pushOwner);pushOwner(sm.scannedBy);
    if(!owners.length)pushOwner(data.tfUserProfile);

    const storage={};for(const k of EXPORT_DATA_KEYS)if(Object.prototype.hasOwnProperty.call(data,k))storage[k]=data[k];
    const localState={};
    const localKeys=['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'];
    if(typeof window.tf_collectLocalStateForExport==='function'){
      try{Object.assign(localState,window.tf_collectLocalStateForExport()||{});}catch(_){}
    }
    if(!Object.keys(localState).length){for(const k of localKeys){try{const v=localStorage.getItem(k);if(v!=null)localState[k]=v;}catch(_){}}}

    const payload={schema:'tf_multi_analyst_export_v1',exportedAt:new Date().toISOString(),exportedBy:owners.length?owners[0]:null,exportedByList:owners,localState,storage};
    const payloadText=JSON.stringify(payload);
    const packed=await gzipToBase64(payloadText);
    const id='PC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();

    // REV289 primary large-transfer path: one private Google Drive relay file.
    // This bypasses the Remote command queue for the actual bundle payload.
    // export_bundle_prepare itself remains a tiny realtime command/ACK.
    const forceLegacy=request&&request.forceLegacy===true;
    const requestedChunkSize=Math.max(12000,Math.min(64000,Number(request&&request.chunkSize)||48000));
    const a=await auth();
    if(!forceLegacy&&a&&packed.b64.length<=8500000&&driveRelayAvailableV352()){
      try{
        const relay=await api('/remote/drive-stage-put',{...a,transferId:id,fileName:'tf-pc-export-'+Date.now()+'.relay',encoding:packed.encoding,originalChars:payloadText.length,direction:'PC_TO_MOBILE',data:packed.b64},90000);
        if(relay&&relay.stored===true){
          EXPORT_TRANSFER_CACHE.set(id,{drive:true,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache});
          for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
          const result={ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:1,relayMode:'drive-v1',relayReady:true,encoding:packed.encoding,encodedChars:packed.b64.length,fingerprint:dataFingerprintCache,fullExport:true,purpose,message:'Bundle Export PC siap di private Drive relay untuk satu kali download.'};
          if(purpose==='mirror'||prewarm){
            MIRROR_PRESTAGE_V292=Object.assign({},result,{createdAt:Date.now(),purpose:'mirror'});
            try{await storageSet({[MIRROR_PRESTAGE_KEY_V292]:MIRROR_PRESTAGE_V292});}catch(_){}
          }
       
~~~
### tf_risk_mode (1 hits)
~~~js
  for(const name of Object.keys(src)){
          const it=src[name]||{};const u=cleanText(it.url||it.link||'',520);
          if(u&&pairByUrl.has(u))src[name]=Object.assign({},it,{pairs:pairByUrl.get(u).slice()});
        }
      }
    }

    const owners=[];
    const ownerKey=o=>cleanText(o&&o.email||'',140).toLowerCase()||cleanText(o&&o.name||'',100).toLowerCase();
    const pushOwner=o=>{if(!o||typeof o!=='object')return;const item={name:cleanText(o.name||'',100),email:cleanText(o.email||'',140),avatarUrl:String(o.avatarUrl||'')};if(!item.name&&!item.email)return;const k=ownerKey(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
    const im=data.tfLastImportMeta&&typeof data.tfLastImportMeta==='object'?data.tfLastImportMeta:{};
    const sm=data.tfLastScanMeta&&typeof data.tfLastScanMeta==='object'?data.tfLastScanMeta:{};
    (Array.isArray(im.exportedByList)?im.exportedByList:[]).forEach(pushOwner);pushOwner(im.exportedBy);
    (Array.isArray(sm.scannedByList)?sm.scannedByList:[]).forEach(pushOwner);pushOwner(sm.scannedBy);
    if(!owners.length)pushOwner(data.tfUserProfile);

    const storage={};for(const k of EXPORT_DATA_KEYS)if(Object.prototype.hasOwnProperty.call(data,k))storage[k]=data[k];
    const localState={};
    const localKeys=['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'];
    if(typeof window.tf_collectLocalStateForExport==='function'){
      try{Object.assign(localState,window.tf_collectLocalStateForExport()||{});}catch(_){}
    }
    if(!Object.keys(localState).length){for(const k of localKeys){try{const v=localStorage.getItem(k);if(v!=null)localState[k]=v;}catch(_){}}}

    const payload={schema:'tf_multi_analyst_export_v1',exportedAt:new Date().toISOString(),exportedBy:owners.length?owners[0]:null,exportedByList:owners,localState,storage};
    const payloadText=JSON.stringify(payload);
    const packed=await gzipToBase64(payloadText);
    const id='PC-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();

    // REV289 primary large-transfer path: one private Google Drive relay file.
    // This bypasses the Remote command queue for the actual bundle payload.
    // export_bundle_prepare itself remains a tiny realtime command/ACK.
    const forceLegacy=request&&request.forceLegacy===true;
    const requestedChunkSize=Math.max(12000,Math.min(64000,Number(request&&request.chunkSize)||48000));
    const a=await auth();
    if(!forceLegacy&&a&&packed.b64.length<=8500000&&driveRelayAvailableV352()){
      try{
        const relay=await api('/remote/drive-stage-put',{...a,transferId:id,fileName:'tf-pc-export-'+Date.now()+'.relay',encoding:packed.encoding,originalChars:payloadText.length,direction:'PC_TO_MOBILE',data:packed.b64},90000);
        if(relay&&relay.stored===true){
          EXPORT_TRANSFER_CACHE.set(id,{drive:true,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache});
          for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
          const result={ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:1,relayMode:'drive-v1',relayReady:true,encoding:packed.encoding,encodedChars:packed.b64.length,fingerprint:dataFingerprintCache,fullExport:true,purpose,message:'Bundle Export PC siap di private Drive relay untuk satu kali download.'};
          if(purpose==='mirror'||prewarm){
            MIRROR_PRESTAGE_V292=Object.assign({},result,{createdAt:Date.now(),purpose:'mirror'});
            try{await storageSet({[MIRROR_PRESTAGE_KEY_V292]:MIRROR_PRESTAGE_V2
~~~
## assets/4b4d6b8dc315a95c.js
- score: 2, bytes: 682173, sha256: 045cd41fa63ac70476184695a52dc179dc86d831c330574b419037856e1d343a

### tfHistorySignals (6 hits)
~~~js
ed=\"\" id=\"tf-dashboard-scan-skip\" type=\"button\">Lihat Dashboard</button>\n</div>\n<div class=\"tf-scan-bar\"><div id=\"tf-dashboard-scan-bar-fill\"></div></div>\n<div class=\"tf-scan-lists\">\n<div>\n<div class=\"tf-scan-section-title\">Overall</div>\n<div class=\"tf-scan-list\" id=\"tf-dashboard-scan-overall\"></div>\n</div>\n<div>\n<div class=\"tf-scan-section-title\">Batch scanning done!/progress...</div>\n<div class=\"tf-scan-list\" id=\"tf-dashboard-scan-detail\"></div>\n</div>\n</div>\n</div>\n</div>\n<div class=\"page\" id=\"tf-dashboard-main\">\n<header class=\"dashboard-header\">\n<div class=\"profile-row\">\n<img alt=\"User avatar\" class=\"dashboard-avatar\" id=\"dashboard-user-avatar\" src=\"https://account.tradersfamily.id/templates/panel/img/user-default-v2.png\"/>\n<div class=\"profile-main\">\n<div class=\"profile-name\" id=\"dashboard-user-name\">User belum login</div>\n<div class=\"profile-status\">\n<span class=\"status-dot\"></span>\n<span id=\"dashboard-user-status-text\">Offline</span>\n</div>\n</div>\n</div>\n<div class=\"title-block\">\n<h1>TF Multi-Analyst Dashboard</h1>\n<p class=\"sub-heading\">\n          Data di halaman ini di-load dari hasil scan extension Chrome\n          (<span class=\"mono\">tfMonthlyStats</span> &amp; <span class=\"mono\">tfHistorySignals</span>)\n          dan bisa kamu kombinasikan dengan pengaturan Balance &amp; Risk untuk menghitung Lot &amp; hasil $$.\n        </p>\n</div>\n</header>\n<!-- ==================== Top Navigator Menu ==================== -->\n<div class=\"tf-top-nav-wrap\" id=\"tf-top-nav-wrap\">\n<nav aria-label=\"Navigator\" class=\"tf-top-nav\">\n<ul>\n<li class=\"active\">\n<a class=\"tf-nav-link\" data-tf-url=\"dashboard.html\" href=\"dashboard.html\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/home-black.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/home-dgrey.png\"/>\n<span>Beranda</span>\n</div>\n</a>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li class=\"tf-dropdown\">\n<a class=\"tf-nav-link\" data-tf-parent=\"1\" data-tf-url=\"#\" href=\"#\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\" src=\"https://account.tradersfamily.id/templates/panel/img/autocopy.png\"/>\n<span>iSignal <span class=\"tf-caret\">\u25be</span></span>\n</div>\n</a>\n<ul aria-label=\"iSignal submenu\" class=\"tf-submenu\">\n<li><a class=\"tf-nav-link\" data-tf-url=\"https://account.tradersfamily.id/channels/isignal/\" href=\"https://account.tradersfamily.id/channels/isignal/\">iSignal Analis</a></li>\n<li><a class=\"tf-nav-link\" data-tf-url=\"iSignalUsers.html\" href=\"iSignalUsers.html\">iSignal Users</a></li>\n</ul>\n</li>\n<li aria-hidden=\"true\" class=\"tf-nav-divider\"></li>\n<li class=\"tf-dropdown\">\n<a class=\"tf-nav-link\" data-tf-parent=\"1\" data-tf-url=\"#\" href=\"#\">\n<div class=\"tf-nav-icon\">\n<img alt=\"\" class=\"tfnav-img-active\" src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-hov\" src=\"https://account.tradersfamily.id/templates/panel/img/copy-signal-fill-white.png\"/>\n<img alt=\"\" class=\"tfnav-img-noactive\"
~~~
~~~js
 tf_spinnerHTML(true);
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
scrollDiv.style.ma
~~~
~~~js
ollar);
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
scr
~~~
~~~js
 subRaw = (out.subscriptionEndOn || '').toString().trim();
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
function tf_isignalUsers_buildChildRowHt
~~~
~~~js
 = true;
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
const td = document.createElement('td')
~~~
### tf_current_balance (1 hits)
~~~js
 Number(withdrawMinSuggested) || 0);
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
if
~~~
### tf_risk_mode (1 hits)
~~~js
larPerPip);
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
return String(yyyy).padStart(4, '0') + '-' + St
~~~
### tf_swap (2 hits)
~~~js
 (e) { }
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
const wEvery = parseInt(wEveryRaw, 10)
~~~
~~~js
ts[0]);
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
if (Number.isFinite(wEvery) && wEvery >= 1 && wEv
~~~
### tf_commission (2 hits)
~~~js
unction tf_updateWithdrawMinSuggestedFromMonthlyIncome(monthlyGrossByMonth, priceBusy) {
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

~~~
~~~js
nthlyGrossByMonth, priceBusy) {
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
function tf_saveTable1StateToLocalStorage
~~~
### tf_withdraw (19 hits)
~~~js
fectiveSlForAnalyst(analystName, pairOrStats, maybeStats) {
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
document.getElementById('withdraw-max-warning-equi
~~~
~~~js
ts) {
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
document.getElementById('withdraw-max-warning-hi
~~~
~~~js
rOrStats && typeof pairOrStats === 'object' && maybeStats === undefined) {
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
els.for
~~~
~~~js
hdrawAmount) : 0;
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
analyst: 
~~~
~~~js
(fullMonthKeys && fullMonthKeys.length) ? fullMonthKeys[0] : null;
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
swap
~~~
## assets/894f18e8a37bd7c6.js
- score: 2, bytes: 567815, sha256: 939a930db9195ca97d58640af079915ae33e753b29a12c6eb9908cd512ab7905

### tfHistorySignals (7 hits)
~~~js
\">Overall</div>\n          <div class=\"tf-scan-list\" id=\"tf-dashboard-scan-overall\"></div>\n        </div>\n        <div>\n          <div class=\"tf-scan-section-title\">Batch scanning done!/progress...</div>\n          <div class=\"tf-scan-list\" id=\"tf-dashboard-scan-detail\"></div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"page\" id=\"tf-dashboard-main\">\n    <header class=\"dashboard-header\">\n      <div class=\"profile-row\">\n        <img\n          id=\"dashboard-user-avatar\"\n          class=\"dashboard-avatar\"\n          src=\"https://account.tradersfamily.id/templates/panel/img/user-default-v2.png\"\n          alt=\"User avatar\"\n        />\n        <div class=\"profile-main\">\n          <div id=\"dashboard-user-name\" class=\"profile-name\">User belum login</div>\n          <div class=\"profile-status\">\n            <span class=\"status-dot\"></span>\n            <span id=\"dashboard-user-status-text\">Offline</span>\n          </div>\n        </div>\n      </div>\n      <div class=\"title-block\">\n        <h1>TF Multi-Analyst Dashboard</h1>\n        <p class=\"sub-heading\">\n          Data di halaman ini di-load dari hasil scan extension Chrome\n          (<span class=\"mono\">tfMonthlyStats</span> &amp; <span class=\"mono\">tfHistorySignals</span>)\n          dan bisa kamu kombinasikan dengan pengaturan Balance &amp; Risk untuk menghitung Lot &amp; hasil $$.\n        </p>\n      </div>\n    </header>\n\n\n    <!-- ==================== Top Navigator Menu ==================== -->\n    <div class=\"tf-top-nav-wrap\" id=\"tf-top-nav-wrap\">\n      <nav class=\"tf-top-nav\" aria-label=\"Navigator\">\n        <ul>\n          <li class=\"active\">\n            <a class=\"tf-nav-link\" href=\"dashboard.html\" data-tf-url=\"dashboard.html\">\n              <div class=\"tf-nav-icon\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/home-black.png\" class=\"tfnav-img-active\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/home-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/home-dgrey.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                <span>Beranda</span>\n              </div>\n            </a>\n          </li>\n\n          <li class=\"tf-nav-divider\" aria-hidden=\"true\"></li>\n\n          <li class=\"tf-dropdown\">\n            <a class=\"tf-nav-link\" href=\"#\" data-tf-parent=\"1\" data-tf-url=\"#\">\n              <div class=\"tf-nav-icon\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\" class=\"tfnav-img-active\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/autocopy-fill-white.png\" class=\"tfnav-img-hov\" alt=\"\">\n                <img src=\"https://account.tradersfamily.id/templates/panel/img/autocopy.png\" class=\"tfnav-img-noactive\" alt=\"\">\n                <span>iSignal <span class=\"tf-caret\">\u25be</span></span>\n              </div>\n            </a>\n            <ul class=\"tf-submenu\" aria-label=\"iSignal submenu\">\n              <li><a class=\"tf-nav-link\" href=\"https://account.tradersfamily.id/channels/isignal/\" data-tf-url=\"https://account.tradersfamily.id/channels/isignal/\">iSignal Analis</a></li>\n              <li><a class=\"tf-nav-link\" href=\"iSignalUsers.html\" data-tf-url=\"iSignalUsers.html\">iSignal Users</a></li>\n            </ul>\n          </li>\n\n          <li class=\"tf-nav-divider\" aria-hidden=\"true\"></li>\n\n          <li class=\"tf-dropdown\">\n            <a cl
~~~
~~~js
 tf_spinnerHTML(true);
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
scrollDiv.style.ma
~~~
~~~js
ollar);
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
scr
~~~
~~~js
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
return __tfIsUsersAnalystMetaCa
~~~
~~~js
tchedAt = Date.now();
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
if
~~~
### tf_current_balance (1 hits)
~~~js
 Number(withdrawMinSuggested) || 0);
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
localStorage.setItem(TF_TABLE1_RISK_OVERRIDES_KEY, JSON.stringify(analystRiskOverrides || {}));
localStorage.setItem(TF_SL_TYPE_SELECTION_KEY, JSON.stringify(slTypeSelectionByAnalyst || {}));
localStorage.setItem(TF_WITHDRAW_ENABLED_KEY, withdrawEnabled ? '1' : '0');
try {
if (Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
localStorage.setItem(TF_WITHDRAW_AMOUNT_KEY, Str
~~~
### tf_risk_mode (1 hits)
~~~js
gBase) || 0);
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
if (enabled) {
runningTradeOnly += pnlDollar;
runningEquity += pnlDollar;
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
return String(yyyy).padStart(4, '0') + '-' + St
~~~
### tf_withdraw (19 hits)
~~~js
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
document.getElementById('withdraw-max-warning-equi
~~~
~~~js
able1StateToLocalStorage();
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
document.getElementById('withdraw-max-warning-hi
~~~
~~~js
ffectiveSlForAnalyst(analystName, pairOrStats, maybeStats) {
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
els.for
~~~
~~~js
hdrawAmount) : 0;
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
analyst: 
~~~
~~~js
(fullMonthKeys && fullMonthKeys.length) ? fullMonthKeys[0] : null;
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
dollarTP: 0,
dollarSL: wAmt,
balancePnl: __balAfterWith
~~~
## assets/901c62026afc22f4.js
- score: 1, bytes: 244334, sha256: b4144f57d0088e5526b9b74e309c5af2f691605f06ed8a7faefa0ff75f9701ed

### tfHistorySignals (1 hits)
~~~js
(String(rawUrl));
u.searchParams.set('tfscan', '1');
u.searchParams.set('tftoken', String(token != null ? token : Date.now()));
return u.toString();
}
catch (e) {
return rawUrl;
}
}
function bg_expandPairsFromUi(pairsRaw) {
try {
const raw = Array.isArray(pairsRaw) ? pairsRaw : [];
const cleaned = raw
.map((p) => String(p || '').trim())
.filter((p) => !!p);
const hasAll = cleaned.some((p) => TF_ALL_PAIR_SENTINELS.has(p));
if (!cleaned.length || hasAll) {
return TF_ALL_PAIRS_ORDER.slice();
}
const sel = new Set(cleaned.map((p) => String(p).toUpperCase()));
return TF_ALL_PAIRS_ORDER.filter((p) => sel.has(p));
}
catch (e) {
return TF_ALL_PAIRS_ORDER.slice();
}
}
const TF_MAX_SCAN_TABS = 1;
const TF_ALL_PAIRS_ORDER = [
'XAUUSD', 'EURUSD', 'GBPUSD', 'AUDUSD', 'NZDUSD',
'USDJPY', 'EURJPY', 'GBPJPY', 'AUDJPY', 'NZDJPY', 'CADJPY', 'CHFJPY',
'USDCAD', 'USDCHF'
];
const TF_ALL_PAIR_SENTINELS = new Set(['__ALL__', 'ALL', 'all']);
const TF_PREFLIGHT_OPEN_ALL_TABS = false;
const TF_PREFLIGHT_OPEN_TABS_PER_ANALYST = true;
const TF_MAX_PAIR_WINDOWS = 1;
const TF_MAX_BATCH_TABS_PER_WINDOW = 10;
const TF_LAUNCH_INTERVAL_MS = 5000;
const TF_SCANCHANNEL_START_TIMEOUT_MS = 30 * 1000;
const TF_SCANCHANNEL_MAX_WAIT_MS = 72 * 60 * 60 * 1000;
const TF_SINGLE_SCAN_TRANSACTION_KEYS = [
'tfMonthlyStats',
'tfHistorySignals',
'tfNoDataPairs',
'tfAvgSlPips',
'tfScoreHistory',
'tfScoreLastScanByAnalyst',
'tfAnalystSources',
'tfAnalystNameCacheByUrl'
];
function bg_isTransactionalSingleScanOrigin(origin) {
return String(origin || '') === 'scanChannelHyperlink';
}
function bg_cloneStorageSnapshotValue(value) {
try {
if (typeof structuredClone === 'function')
return structuredClone(value);
}
catch (e) { }
try {
return JSON.parse(JSON.stringify(value));
}
catch (e) {
return value;
}
}
async function bg_captureSingleScanSnapshot() {
const data = await bg_storageLocalGet(TF_SINGLE_SCAN_TRANSACTION_KEYS);
const present = {};
const values = {};
TF_SINGLE_SCAN_TRANSACTION_KEYS.forEach((key) => {
present[key] = Object.prototype.hasOwnProperty.call(data || {}, key);
if (present[key])
values[key] = bg_cloneStorageSnapshotValue(data[key]);
});
return { capturedAt: Date.now(), present, values };
}
async function bg_waitForMergeLockRelease(timeoutMs = 12000) {
const start = Date.now();
while (Date.now() - start < timeoutMs) {
try {
const d = await bg_storageLocalGet(['tfMergeLock']);
const lock = d && d.tfMergeLock ? d.tfMergeLock : null;
const stale = !!(lock && lock.at && (Date.now() - Number(lock.at) > 120000));
if (!lock || !lock.owner || stale)
return true;
}
catch (e) {
return true;
}
await bg_sleep(150);
}
return false;
}
async function bg_restoreSingleScanSnapshot(snapshot) {
if (!snapshot || !snapshot.present || !snapshot.values)
return false;
try {
const applySnapshot = async () => {
const toSet = {};
const toRemove = [];
TF_SINGLE_SCAN_TRANSACTION_KEYS.forEach((key) => {
if (snapshot.present[key])
toSet[key] = bg_cloneStorageSnapshotValue(snapshot.values[key]);
else
toRemove.push(key);
});
if (Object.keys(toSet).length)
await bg_storageLocalSet(toSet);
if (toRemove.length) {
await new Promise((resolve) => {
try {
chrome.storage.local.remove(toRemove, () => {
try { void chrome.runtime.lastError; } catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
}
};
await bg_waitForMergeLockRelease(12000);
await bg_sleep(250);
await applySnapshot();
// Terapkan ulang sekali untuk menutup kemungkinan callback storage dari tab scan
// selesai beberapa ratus milidetik setelah tab ditutup.
await bg_sleep(650);
await bg_waitForMergeLockRelease(2500);
await applySnapshot();
return true;
}
catch (e) {
console.warn('TF: gagal rollback hasil Scan Channel sementara', e);
return fals
~~~
## assets/dec74fd654ec6d54.js
- score: 1, bytes: 161528, sha256: 5515e6849138c860408962f9831134937ec3a8d16abfe20712b371db0ba17dd9

### tfHistorySignals (7 hits)
~~~js
edikit'))
return false;
const h4 = Array.from((statRoot || document).querySelectorAll('h4')).find((el) => tf_normText(el.textContent).includes('tidak dapat menampilkan data'));
if (!h4)
return true;
const container = h4.closest('.data-detail-signal') || h4.parentElement;
const span = container ? container.querySelector('span') : null;
const spanText = tf_normText(span ? span.textContent : '');
if (spanText.includes('jumlah signal terlalu sedikit'))
return true;
const scope = statRoot || document;
const anySpan = Array.from(scope.querySelectorAll('span')).find((s) => tf_normText(s.textContent).includes('jumlah signal terlalu sedikit'));
return !!anySpan;
}
catch (e) {
return false;
}
}
async function tf_checkTooFewSignalsOnStatistics(timeoutMs) {
const maxMs = (typeof timeoutMs === 'number' && isFinite(timeoutMs) && timeoutMs > 0)
? timeoutMs
: 7000;
const start = Date.now();
await tf_openStatisticsTab();
while (Date.now() - start < maxMs) {
if (tf_hasTooFewSignalsMessage())
return true;
await tf_sleep(350);
}
return tf_hasTooFewSignalsMessage();
}
async function tf_clearAnalystDataInStorage(storageAnalystName, baseAnalystName, pairKey) {
let token = null;
try {
token = await tf_acquireStorageLock('tfMergeLock', 60000, 120000);
const data = await tf_storageGet(['tfMonthlyStats', 'tfHistorySignals', 'tfNoDataPairs', 'tfAvgSlPips']);
const monthlyStats = (data && data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object')
? { ...data.tfMonthlyStats }
: {};
if (storageAnalystName && Object.prototype.hasOwnProperty.call(monthlyStats, storageAnalystName)) {
delete monthlyStats[storageAnalystName];
}
const oldHist = Array.isArray(data && data.tfHistorySignals) ? data.tfHistorySignals : [];
const pairUpper = String(pairKey || '').toUpperCase();
const newHist = oldHist.filter((it) => {
if (!it)
return false;
const a = String(it.analyst || it.analystName || '').trim();
if (!a)
return true;
if (a !== baseAnalystName)
return true;
if (!pairKey)
return false;
const p = String(it.pair || '').toUpperCase();
return p !== pairUpper;
});
const rawNoData = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper = String(pairKey).toUpperCase();
const baseMap = (rawNoData[base] && typeof rawNoData[base] === 'object') ? { ...rawNoData[base] } : {};
baseMap[pairUpper] = true;
rawNoData[base] = baseMap;
}
const rawAvgSl = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper2 = String(pairKey).toUpperCase();
if (rawAvgSl[base] && typeof rawAvgSl[base] === 'object') {
const baseMap2 = { ...rawAvgSl[base] };
delete baseMap2[pairUpper2];
if (Object.keys(baseMap2).length === 0) {
delete rawAvgSl[base];
}
else {
rawAvgSl[base] = baseMap2;
}
}
}
await tf_storageSet({ tfMonthlyStats: monthlyStats, tfHistorySignals: newHist, tfNoDataPairs: rawNoData, tfAvgSlPips: rawAvgSl });
}
catch (e) {
console.warn('TF: gagal clear data analis', e);
}
finally {
try {
await tf_releaseStorageLock('tfMergeLock', token);
}
catch (e) {
}
}
}
function tf_scanAverageSlPipsFromStatistics() {
try {
const spans = Array.from(document.querySelectorAll('span'));
for (const sp of spans) {
const label = tf_normText(sp && sp.textContent ? sp.textContent : '');
if (!label)
continue;
if (label.includes('average sl pips')) {
const block = sp.closest('.description-block') || sp.closest('.box-summary') || sp.parentElement;
if (block) {
const h5 = block.querySelector('h5.description-header') || block.querySelector('h5') || block.
~~~
~~~js
an ? span.textContent : '');
if (spanText.includes('jumlah signal terlalu sedikit'))
return true;
const scope = statRoot || document;
const anySpan = Array.from(scope.querySelectorAll('span')).find((s) => tf_normText(s.textContent).includes('jumlah signal terlalu sedikit'));
return !!anySpan;
}
catch (e) {
return false;
}
}
async function tf_checkTooFewSignalsOnStatistics(timeoutMs) {
const maxMs = (typeof timeoutMs === 'number' && isFinite(timeoutMs) && timeoutMs > 0)
? timeoutMs
: 7000;
const start = Date.now();
await tf_openStatisticsTab();
while (Date.now() - start < maxMs) {
if (tf_hasTooFewSignalsMessage())
return true;
await tf_sleep(350);
}
return tf_hasTooFewSignalsMessage();
}
async function tf_clearAnalystDataInStorage(storageAnalystName, baseAnalystName, pairKey) {
let token = null;
try {
token = await tf_acquireStorageLock('tfMergeLock', 60000, 120000);
const data = await tf_storageGet(['tfMonthlyStats', 'tfHistorySignals', 'tfNoDataPairs', 'tfAvgSlPips']);
const monthlyStats = (data && data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object')
? { ...data.tfMonthlyStats }
: {};
if (storageAnalystName && Object.prototype.hasOwnProperty.call(monthlyStats, storageAnalystName)) {
delete monthlyStats[storageAnalystName];
}
const oldHist = Array.isArray(data && data.tfHistorySignals) ? data.tfHistorySignals : [];
const pairUpper = String(pairKey || '').toUpperCase();
const newHist = oldHist.filter((it) => {
if (!it)
return false;
const a = String(it.analyst || it.analystName || '').trim();
if (!a)
return true;
if (a !== baseAnalystName)
return true;
if (!pairKey)
return false;
const p = String(it.pair || '').toUpperCase();
return p !== pairUpper;
});
const rawNoData = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper = String(pairKey).toUpperCase();
const baseMap = (rawNoData[base] && typeof rawNoData[base] === 'object') ? { ...rawNoData[base] } : {};
baseMap[pairUpper] = true;
rawNoData[base] = baseMap;
}
const rawAvgSl = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper2 = String(pairKey).toUpperCase();
if (rawAvgSl[base] && typeof rawAvgSl[base] === 'object') {
const baseMap2 = { ...rawAvgSl[base] };
delete baseMap2[pairUpper2];
if (Object.keys(baseMap2).length === 0) {
delete rawAvgSl[base];
}
else {
rawAvgSl[base] = baseMap2;
}
}
}
await tf_storageSet({ tfMonthlyStats: monthlyStats, tfHistorySignals: newHist, tfNoDataPairs: rawNoData, tfAvgSlPips: rawAvgSl });
}
catch (e) {
console.warn('TF: gagal clear data analis', e);
}
finally {
try {
await tf_releaseStorageLock('tfMergeLock', token);
}
catch (e) {
}
}
}
function tf_scanAverageSlPipsFromStatistics() {
try {
const spans = Array.from(document.querySelectorAll('span'));
for (const sp of spans) {
const label = tf_normText(sp && sp.textContent ? sp.textContent : '');
if (!label)
continue;
if (label.includes('average sl pips')) {
const block = sp.closest('.description-block') || sp.closest('.box-summary') || sp.parentElement;
if (block) {
const h5 = block.querySelector('h5.description-header') || block.querySelector('h5') || block.querySelector('.description-header');
const raw = (h5 && h5.textContent ? h5.textContent : '').replace(/,/g, '').trim();
const m = raw.match(/-?\d+(?:\.\d+)?/);
if (m) {
const v = parseFloat(m[0]);
if (Number.isFinite(v))
return v;
}
}
}
}
const candidates = Array.from(document.querySelectorAll('.description-block, .box-summary')).filter(Boolean);
for (const c of ca
~~~
~~~js
');
if (spanText.includes('jumlah signal terlalu sedikit'))
return true;
const scope = statRoot || document;
const anySpan = Array.from(scope.querySelectorAll('span')).find((s) => tf_normText(s.textContent).includes('jumlah signal terlalu sedikit'));
return !!anySpan;
}
catch (e) {
return false;
}
}
async function tf_checkTooFewSignalsOnStatistics(timeoutMs) {
const maxMs = (typeof timeoutMs === 'number' && isFinite(timeoutMs) && timeoutMs > 0)
? timeoutMs
: 7000;
const start = Date.now();
await tf_openStatisticsTab();
while (Date.now() - start < maxMs) {
if (tf_hasTooFewSignalsMessage())
return true;
await tf_sleep(350);
}
return tf_hasTooFewSignalsMessage();
}
async function tf_clearAnalystDataInStorage(storageAnalystName, baseAnalystName, pairKey) {
let token = null;
try {
token = await tf_acquireStorageLock('tfMergeLock', 60000, 120000);
const data = await tf_storageGet(['tfMonthlyStats', 'tfHistorySignals', 'tfNoDataPairs', 'tfAvgSlPips']);
const monthlyStats = (data && data.tfMonthlyStats && typeof data.tfMonthlyStats === 'object')
? { ...data.tfMonthlyStats }
: {};
if (storageAnalystName && Object.prototype.hasOwnProperty.call(monthlyStats, storageAnalystName)) {
delete monthlyStats[storageAnalystName];
}
const oldHist = Array.isArray(data && data.tfHistorySignals) ? data.tfHistorySignals : [];
const pairUpper = String(pairKey || '').toUpperCase();
const newHist = oldHist.filter((it) => {
if (!it)
return false;
const a = String(it.analyst || it.analystName || '').trim();
if (!a)
return true;
if (a !== baseAnalystName)
return true;
if (!pairKey)
return false;
const p = String(it.pair || '').toUpperCase();
return p !== pairUpper;
});
const rawNoData = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper = String(pairKey).toUpperCase();
const baseMap = (rawNoData[base] && typeof rawNoData[base] === 'object') ? { ...rawNoData[base] } : {};
baseMap[pairUpper] = true;
rawNoData[base] = baseMap;
}
const rawAvgSl = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper2 = String(pairKey).toUpperCase();
if (rawAvgSl[base] && typeof rawAvgSl[base] === 'object') {
const baseMap2 = { ...rawAvgSl[base] };
delete baseMap2[pairUpper2];
if (Object.keys(baseMap2).length === 0) {
delete rawAvgSl[base];
}
else {
rawAvgSl[base] = baseMap2;
}
}
}
await tf_storageSet({ tfMonthlyStats: monthlyStats, tfHistorySignals: newHist, tfNoDataPairs: rawNoData, tfAvgSlPips: rawAvgSl });
}
catch (e) {
console.warn('TF: gagal clear data analis', e);
}
finally {
try {
await tf_releaseStorageLock('tfMergeLock', token);
}
catch (e) {
}
}
}
function tf_scanAverageSlPipsFromStatistics() {
try {
const spans = Array.from(document.querySelectorAll('span'));
for (const sp of spans) {
const label = tf_normText(sp && sp.textContent ? sp.textContent : '');
if (!label)
continue;
if (label.includes('average sl pips')) {
const block = sp.closest('.description-block') || sp.closest('.box-summary') || sp.parentElement;
if (block) {
const h5 = block.querySelector('h5.description-header') || block.querySelector('h5') || block.querySelector('.description-header');
const raw = (h5 && h5.textContent ? h5.textContent : '').replace(/,/g, '').trim();
const m = raw.match(/-?\d+(?:\.\d+)?/);
if (m) {
const v = parseFloat(m[0]);
if (Number.isFinite(v))
return v;
}
}
}
}
const candidates = Array.from(document.querySelectorAll('.description-block, .box-summary')).filter(Boolean);
for (const c of candidates) {
const labelEl
~~~
~~~js
ta.tfHistorySignals : [];
const pairUpper = String(pairKey || '').toUpperCase();
const newHist = oldHist.filter((it) => {
if (!it)
return false;
const a = String(it.analyst || it.analystName || '').trim();
if (!a)
return true;
if (a !== baseAnalystName)
return true;
if (!pairKey)
return false;
const p = String(it.pair || '').toUpperCase();
return p !== pairUpper;
});
const rawNoData = (data && data.tfNoDataPairs && typeof data.tfNoDataPairs === 'object')
? { ...data.tfNoDataPairs }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper = String(pairKey).toUpperCase();
const baseMap = (rawNoData[base] && typeof rawNoData[base] === 'object') ? { ...rawNoData[base] } : {};
baseMap[pairUpper] = true;
rawNoData[base] = baseMap;
}
const rawAvgSl = (data && data.tfAvgSlPips && typeof data.tfAvgSlPips === 'object')
? { ...data.tfAvgSlPips }
: {};
if (baseAnalystName && pairKey) {
const base = String(baseAnalystName);
const pairUpper2 = String(pairKey).toUpperCase();
if (rawAvgSl[base] && typeof rawAvgSl[base] === 'object') {
const baseMap2 = { ...rawAvgSl[base] };
delete baseMap2[pairUpper2];
if (Object.keys(baseMap2).length === 0) {
delete rawAvgSl[base];
}
else {
rawAvgSl[base] = baseMap2;
}
}
}
await tf_storageSet({ tfMonthlyStats: monthlyStats, tfHistorySignals: newHist, tfNoDataPairs: rawNoData, tfAvgSlPips: rawAvgSl });
}
catch (e) {
console.warn('TF: gagal clear data analis', e);
}
finally {
try {
await tf_releaseStorageLock('tfMergeLock', token);
}
catch (e) {
}
}
}
function tf_scanAverageSlPipsFromStatistics() {
try {
const spans = Array.from(document.querySelectorAll('span'));
for (const sp of spans) {
const label = tf_normText(sp && sp.textContent ? sp.textContent : '');
if (!label)
continue;
if (label.includes('average sl pips')) {
const block = sp.closest('.description-block') || sp.closest('.box-summary') || sp.parentElement;
if (block) {
const h5 = block.querySelector('h5.description-header') || block.querySelector('h5') || block.querySelector('.description-header');
const raw = (h5 && h5.textContent ? h5.textContent : '').replace(/,/g, '').trim();
const m = raw.match(/-?\d+(?:\.\d+)?/);
if (m) {
const v = parseFloat(m[0]);
if (Number.isFinite(v))
return v;
}
}
}
}
const candidates = Array.from(document.querySelectorAll('.description-block, .box-summary')).filter(Boolean);
for (const c of candidates) {
const labelEl = c.querySelector('span');
const label = tf_normText(labelEl && labelEl.textContent ? labelEl.textContent : '');
if (label.includes('average sl pips')) {
const h5 = c.querySelector('h5.description-header') || c.querySelector('h5') || c.querySelector('.description-header');
const raw = (h5 && h5.textContent ? h5.textContent : '').replace(/,/g, '').trim();
const m = raw.match(/-?\d+(?:\.\d+)?/);
if (m) {
const v = parseFloat(m[0]);
if (Number.isFinite(v))
return v;
}
}
}
}
catch (e) {
}
return null;
}
function tf_scanMonthlyStats(analystName) {
const result = {};
const h4s = Array.from(document.querySelectorAll('h4'));
if (!h4s.length)
return result;
h4s.forEach((h4) => {
const text = (h4.innerText || '').trim();
if (!text)
return;
const lower = text.toLowerCase();
const monthName = TF_MONTH_NAMES.find((m) => lower.startsWith(m.toLowerCase()));
if (!monthName)
return;
let year = null;
const yearMatch = text.match(/(\d{4})/);
if (yearMatch) {
year = parseInt(yearMatch[1], 10);
}
const monthIndex = TF_MONTH_NAMES.findIndex((m) => m.toLowerCase() === monthName.toLowerCase());
if (monthIndex === -1)
return;
const monthKey = (year ? String(year).padStart(4, '0') : '0000') +
'-' +
String(monthIndex + 1).padStart(2, '0');
let signals = null;
let pips = null;
const searchRoots = [];
if
~~~
~~~js
.now();
const start = Date.now();
while (Date.now() - start < wait) {
let lock = null;
try {
const d = await tf_storageGet([key]);
lock = d ? d[key] : null;
}
catch (e) {
lock = null;
}
const now = Date.now();
const free = !lock || !lock.owner || (lock.at && (now - lock.at > stale));
if (free) {
try {
await tf_storageSet({ [key]: { owner: token, at: now } });
}
catch (e) {
}
try {
const d2 = await tf_storageGet([key]);
const lock2 = d2 ? d2[key] : null;
if (lock2 && lock2.owner === token)
return token;
}
catch (e) {
}
}
await tf_sleep(120 + Math.floor(Math.random() * 180));
}
return null;
}
async function tf_releaseStorageLock(lockKey, token) {
if (!token)
return;
const key = lockKey || 'tfMergeLock';
try {
const d = await tf_storageGet([key]);
const lock = d ? d[key] : null;
if (lock && lock.owner === token) {
await tf_storageRemove([key]);
}
}
catch (e) {
}
}
async function tf_mergeIntoStorage(scanResult) {
const lockToken = await tf_acquireStorageLock('tfMergeLock', 60000, 120000);
try {
function tf_parseStorageAnalystName(name) {
const s = String(name || '').trim();
const m = s.match(/^(.*)\s+\(([^()]+)\)\s*$/);
if (!m)
return { base: s, pair: null };
return { base: m[1].trim(), pair: String(m[2]).trim().toUpperCase() };
}
const data = await tf_storageGet(['tfMonthlyStats', 'tfHistorySignals', 'tfNoDataPairs', 'tfAvgSlPips']);
const rawMonthlyStats = data.tfMonthlyStats || {};
const rawHistorySignalsAll = data.tfHistorySignals || [];
const monthlyStats = {};
Object.keys(rawMonthlyStats).forEach((name) => {
monthlyStats[name] = rawMonthlyStats[name];
});
const parsedThis = tf_parseStorageAnalystName(scanResult && scanResult.analystName);
const hasMonthly = !!(scanResult && scanResult.monthly && typeof scanResult.monthly === 'object' && Object.keys(scanResult.monthly).length);
const hasHistory = !!(scanResult && Array.isArray(scanResult.historySignals) && scanResult.historySignals.length);
const hasAnyData = hasMonthly || hasHistory;
const isUpdate = !!(scanResult && String(scanResult.scanMode || '') === 'update');
const isPartial = !!(scanResult && (scanResult.partial || scanResult.scanMode === 'historyBatch' || scanResult.scanMode === 'historyMonth' || isUpdate));
try {
if (scanResult && scanResult.analystName && scanResult.monthly && typeof scanResult.monthly === 'object') {
if (isPartial) {
const prev = (monthlyStats[scanResult.analystName] && typeof monthlyStats[scanResult.analystName] === 'object')
? { ...monthlyStats[scanResult.analystName] }
: {};
monthlyStats[scanResult.analystName] = { ...prev, ...scanResult.monthly };
}
else {
monthlyStats[scanResult.analystName] = scanResult.monthly;
}
}
}
catch (e) { }
let historySignalsAll = Array.isArray(rawHistorySignalsAll) ? rawHistorySignalsAll.slice() : [];
try {
if (parsedThis && parsedThis.base && parsedThis.pair && !hasAnyData && !isPartial) {
const baseNorm = String(parsedThis.base || '').trim().toLowerCase();
const pairUpper = String(parsedThis.pair || '').trim().toUpperCase();
historySignalsAll = historySignalsAll.filter((it) => {
const a = String(it && it.analyst ? it.analyst : '').trim().toLowerCase();
const p = String(it && it.pair ? it.pair : '').trim().toUpperCase();
return !(a === baseNorm && p === pairUpper);
});
}
}
catch (e) { }
function tf_normStr(v) {
return String(v == null ? '' : v).trim();
}
function tf_normAnalyst(v) {
return tf_normStr(v).toLowerCase();
}
function tf_normPair(v) {
return tf_normStr(v).toUpperCase();
}
function tf_normTime(it) {
try {
if (it && typeof it.sortKey === 'number' && Number.isFinite(it.sortKey))
return String(Math.floor(it.sortKey));
}
catch (e) { }
let s = tf_normStr(it && it.displayDate ? it.displayDate : '');
s = s.replace(/\s
~~~

## Mobile bridge canonical normalization snippet
### LOCAL_STATE_KEYS
~~~js
(function(){
"use strict";
const LOCAL_STATE_KEYS=[
  "tf_equity_metric","tf_risk_mode","tf_compound_months","tf_current_balance",
  "tf_current_risk_percent","tf_risk_overrides","tf_sl_type_selection"
];
const SCHEMA="tf_multi_analyst_export_v1";
const TF_MOBILE_IMPORT_LOADING_KEY="tf_mobile_import_loading_v8";
const TF_MOBILE_IMPORT_LOADING_DETAIL_KEY="tf_mobile_import_loading_detail_v8";
const TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY="tf_mobile_import_expected_trades_v8";
const TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY="tf_mobile_import_expected_analysts_v8";
const TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY="tf_mobile_import_expected_summary_rows_v8";
const TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY="tf_mobile_import_expected_score_v8";


// REV294 APK-only: universal 2-step in-app Cancel confirmation + Android Back guard.
(function tfRev294CancelFramework(){
  if(window.tfRev294ConfirmCancel)return;
  let resolver=null,step=1,loadingSources=new Set(),previousState=null,backArmed=false;
  function ensure(){
    let ov=document.getElementById('tf-rev294-confirm-overlay');
    if(ov)return ov;
    ov=document.createElement('div');ov.id='tf-rev294-confirm-overlay';ov.className='tf-rev294-confirm-overlay';ov.setAttribute('aria-hidden','true');
    ov.innerHTML=`<div class="tf-rev294-confirm-card" role="dialog" aria-modal="true">
      <strong id="tf-rev294-confirm-title">Batalkan proses?</strong>
      <p id="tf-rev294-confirm-text">Proses yang sedang berjalan akan dihentikan.</p>
      <div id="tf-rev294-confirm-step" class="tf-rev294-confirm-step">Verifikasi 1 dari 2</div>
      <div class="tf-rev294-confirm-actions"><button id="tf-rev294-confirm-no" class="tf-rev294-confirm-no" type="button">No</button><button id="tf-rev294-confirm-yes" class="tf-rev294-confirm-yes" type="button">Yes</button></div>
    </div>`;
    document.body.appendChild(ov);
    ov.querySelector('#tf-rev294-confirm-no').addEventListener('click',()=>finish(false));
    ov.querySelector('#tf-rev294-confirm-yes').addEventListener('click',()=>{
      if(step===1){step=2;ov.querySelector('#tf-rev294-confirm-title').textContent='Yakin force Cancel?';ov.querySelector('#tf-rev294-confirm-text').textContent='Konfirmasi terakhir. Proses Mobile akan dihentikan sekarang.';ov.querySelector('#tf-rev294-confirm-step').textContent='Verifikasi 2 dari 2';return;}
      finish(true);
    });
    return ov;
  }
  function finish(ok){const ov=ensure();ov.classList.remove('show');ov.setAttribute('aria-hidden','true');const r=resolver;resolver=null;step=1;if(r)r(!!ok);}
  window.tfRev294ConfirmCancel=function(){
    if(resolver)return Promise.resolve
~~~
### tfMobileNormalizeHistoryV31
~~~js
t.length>1,
    combinedFileCount:list.length,combinedFiles:names.slice(),
    exportedBy:list[0].exportedBy||null,exportedByList:list[0].exportedByList||[],
    localState:clone(list[0].localState||{},{}),storage:out
  };
}
function tfMobileFirstFiniteV31(){
  for(let i=0;i<arguments.length;i++){
    const raw=arguments[i];
    if(raw===null||raw===undefined||raw==='')continue;
    const n=typeof raw==='number'?raw:Number(String(raw).replace(/,/g,'').trim());
    if(Number.isFinite(n))return n;
  }
  return null;
}
function tfMobileArrayV31(value){
  if(Array.isArray(value))return value.slice();
  if(!value||typeof value!=='object')return [];
  for(const k of ['items','rows','data','results','signals','history']){
    if(Array.isArray(value[k]))return value[k].slice();
  }
  const vals=Object.values(value);
  return vals.length&&vals.every(v=>v&&typeof v==='object')?vals:[];
}
function tfMobileNormalizeHistoryV31(value){
  const src=tfMobileArrayV31(value);
  return src.map((row,idx)=>{
    if(!row||typeof row!=='object')return null;
    const out={...row};
    const analyst=String(row.analyst??row.analystName??row.name??row.channelName??row.trader??'').trim();
    const pair=String(row.pair??row.symbol??row.ticker??row.instrument??'').trim().toUpperCase();
    const pips=tfMobileFirstFiniteV31(row.pips,row.pnlPips,row.profitPips,row.resultPips,row.closedPips,row.pip,row.pipResult);
    if(analyst)out.analyst=analyst;
    if(pair)out.pair=pair;
    if(pips!==null)out.pips=pips;
    if(out.displayDate==null||String(out.displayDate).trim()==='')out.displayDate=row.closedDate??row.closedAt??row.date??row.closeTime??'';
    if(out.createdDate==null||String(out.createdDate).trim()==='')out.createdDate=row.createdAt??row.openedAt??row.openDate??row.entryTime??'';
    if(out.sortKey==null&&row.closedAt){const t=Date.parse(String(row.closedAt));if(Number.isFinite(t))out.sortKey=t;}
    if(out.createdSortKey==null&&row.createdAt){const t=Date.parse(String(row.createdAt));if(Number.isFinite(t))out.createdSortKey=t;}
    if(!out.signalId&&row.id!=null)out.signalId=String(row.id);
    out.__tfMobileImportIndexV31=idx;
    return out;
  }).filter(row=>row&&row.analyst&&row.pair&&Number.isFinite(Number(row.pips)));
}
function tfMobileBuildSourcesFromHistoryV31(history,existing){
  const out=existing&&typeof existing==='object'&&!Array.isArray(existing)?clone(existing,{}):{};
  for(const row of history){
    const name=String(row&&row.analyst||'').trim();
    const pair=String(row&&row.pair||'').trim().toUpperCase();
    if(!name||!pair)continue;
    if(!out[name]||typeof out[name]!=='object')out[name]={url:'',pairs:[]};
    if(!Array.isArray(out[name].pairs))out[name].pairs=[];
    if(!out[name].pairs.map(x=>String(x).toUpperCase()).includes(pair))out[name].pairs.push(pair);
  }
  return out;
}
function tfMobileNormalizeStorageV31(input){
  const st=input&&typeof input==='object'?clone(input,{}):{};
  const historyCandidate=st.tfHistorySignals??st.historySignals??st.tfHistory??st.history??st.signals;
  const history=tfMobileNormalizeHistoryV31(historyCandidate);
  st.tfHistorySignals=history;
  st.tfAnalystSources=tfMobileBuildSourcesFromHistoryV31(history,st.tfAnalystSources??st.analystSources);
  st.tfMonthlyStats=(st.tfMonthlyStats&&typeof st.tfMonthlyStats==='object')?st.tfMonthlyStats:{};
  st.tfScoreHistory=tfMobileArrayV31(st.tfScoreHistory??st.scoreHistory);
  st.tfNoDataPairs=(st.tfNoDataPairs&&typeof st.tfNoDataPairs==='object')?st.tfNoDat
~~~
### tfMobileNormalizeStorageV31
~~~js
ow.createdAt){const t=Date.parse(String(row.createdAt));if(Number.isFinite(t))out.createdSortKey=t;}
    if(!out.signalId&&row.id!=null)out.signalId=String(row.id);
    out.__tfMobileImportIndexV31=idx;
    return out;
  }).filter(row=>row&&row.analyst&&row.pair&&Number.isFinite(Number(row.pips)));
}
function tfMobileBuildSourcesFromHistoryV31(history,existing){
  const out=existing&&typeof existing==='object'&&!Array.isArray(existing)?clone(existing,{}):{};
  for(const row of history){
    const name=String(row&&row.analyst||'').trim();
    const pair=String(row&&row.pair||'').trim().toUpperCase();
    if(!name||!pair)continue;
    if(!out[name]||typeof out[name]!=='object')out[name]={url:'',pairs:[]};
    if(!Array.isArray(out[name].pairs))out[name].pairs=[];
    if(!out[name].pairs.map(x=>String(x).toUpperCase()).includes(pair))out[name].pairs.push(pair);
  }
  return out;
}
function tfMobileNormalizeStorageV31(input){
  const st=input&&typeof input==='object'?clone(input,{}):{};
  const historyCandidate=st.tfHistorySignals??st.historySignals??st.tfHistory??st.history??st.signals;
  const history=tfMobileNormalizeHistoryV31(historyCandidate);
  st.tfHistorySignals=history;
  st.tfAnalystSources=tfMobileBuildSourcesFromHistoryV31(history,st.tfAnalystSources??st.analystSources);
  st.tfMonthlyStats=(st.tfMonthlyStats&&typeof st.tfMonthlyStats==='object')?st.tfMonthlyStats:{};
  st.tfScoreHistory=tfMobileArrayV31(st.tfScoreHistory??st.scoreHistory);
  st.tfNoDataPairs=(st.tfNoDataPairs&&typeof st.tfNoDataPairs==='object')?st.tfNoDataPairs:{};
  st.tfAvgSlPips=(st.tfAvgSlPips&&typeof st.tfAvgSlPips==='object')?st.tfAvgSlPips:{};
  return st;
}
async function tfMobileReadBackV31(){
  return storageGet(['tfHistorySignals','tfAnalystSources','tfMonthlyStats','tfScoreHistory']);
}
async function tfMobileRecoverRenderV31(reason){
  try{
    const data=await tfMobileReadBackV31();
    const history=Array.isArray(data.tfHistorySignals)?data.tfHistorySignals:[];
    const sources=data.tfAnalystSources&&typeof data.tfAnalystSources==='object'?data.tfAnalystSources:{};
    if(!history.length&&!Object.keys(sources).length)return false;

    // REV336: imported IndexedDB data is authoritative. Always push it back into
    // the dashboard globals before deciding that the UI is already rendered.
    try{
      if(typeof selectedAnalystPairsMapStats!=='undefined')selectedAnalystPairsMapStats=null;
      if(typeof selectedAnalystPairsMapHistory!=='undefined')selectedAnalystPairsMapHistory=null;
      if(typeof selectedAnalystsGlobal!=='undefined')selectedAnalystsGlobal=null;
    }catch(_){ }

    if(typeof loadFromChromeStorageIfAvailable==='function')loadFromChromeStorageIfAvailable();
    await new Promise(r=>setTimeout(r,280));

    try{
      if(typeof rebuildAnalystListFromSources==='function')rebuildAnalystListFromSources();
      if(typeof setupAnalystTickerFilter==='function')setupAnalystTickerFilter();
      if(typeof applyAnalystPairFilterAll==='function')applyAnalystPairFilterAll();
      if(typeof recomputeHistoryRows==='function')recomputeHistoryRows();
      if(typeof renderSummaryTable==='function')renderSummaryTable();
      if(typeof window.tfRenderScoreHistory==='function')window.tfRenderScoreHistory();
    }catch(e){console.warn('TF Mobile REV336 render recovery warning',reason,e);}

    await new Promise(r=>setTimeout(r,120));
    const historyRows=[...document.querySelectorAll('#history-table tbody tr:not(.tf-start-balance-row)')].
~~~
### applyPayload
~~~js
fRenderScoreHistory==='function')window.tfRenderScoreHistory();
    }catch(e){console.warn('TF Mobile REV336 render recovery warning',reason,e);}

    await new Promise(r=>setTimeout(r,120));
    const historyRows=[...document.querySelectorAll('#history-table tbody tr:not(.tf-start-balance-row)')].filter(tr=>{
      const txt=String(tr.textContent||'').trim();
      return txt && !/belum ada|tidak ada data|no data/i.test(txt);
    }).length;
    const summaryRows=[...document.querySelectorAll('#summary-table tbody tr')].filter(tr=>{
      const txt=String(tr.textContent||'').trim();
      return txt && !/belum ada|tidak ada data|no data/i.test(txt);
    }).length;
    return historyRows>0||summaryRows>0||history.length>0;
  }catch(e){console.warn('TF Mobile REV336 render recovery failed',reason,e);return false;}
}
window.tfMobileRecoverRenderV31=tfMobileRecoverRenderV31;

async function applyPayload(payload,fileNames){
  if(!payload||typeof payload!=="object")throw new Error("Format file tidak valid.");
  const rawStorage=payload.storage&&typeof payload.storage==="object"?payload.storage:payload;
  const st=tfMobileNormalizeStorageV31(rawStorage);
  const defaults={tfMonthlyStats:{},tfHistorySignals:[],tfScoreHistory:[],tfNoDataPairs:{},tfAvgSlPips:{},tfAnalystSources:{}};
  Object.keys(defaults).forEach(k=>{if(!(k in st))st[k]=defaults[k];});
  st.tfSelectedTimeRange=st.tfSelectedTimeRange||"all_time";
  st.tfLastImportMeta={
    importedAt:new Date().toISOString(),
    fileName:fileNames.length===1?fileNames[0]:"",
    files:fileNames.slice(),
    combined:fileNames.length>1,
    exportedBy:payload.exportedBy||null,
    exportedByList:Array.isArray(payload.exportedByList)?payload.exportedByList:[]
  };
  // REV336: do not suppress chrome.storage.onChanged. The IndexedDB shim writes
  // the entire payload in one transaction, then dashboard listeners can repaint.
  await storageSet(st);

  const verify=await tfMobileReadBackV31();
  const savedHistory=Array.isArray(verify.tfHistorySignals)?verify.tfHistorySignals:[];
  const savedSources=verify.tfAnalystSources&&typeof verify.tfAnalystSources==='object'?verify.tfAnalystSources:{};
  if(st.tfHistorySignals.length>0&&savedHistory.length===0){
    throw new Error('Data history sudah diproses tetapi gagal dibaca kembali dari storage Mobile.');
  }
  if(st.tfHistorySignals.length>0&&Object.keys(savedSources).length===0){
    throw new Error('Data analis gagal dibaca kembali setelah import.');
  }

  if(payload.localState&&typeof payload.localState==="object"){
    LOCAL_STATE_KEYS.forEach(k=>{
      if(Object.prototype.hasOwnProperty.call(payload.localState,k)){
        const v=payload.localState[k];
        if(v==null||v==="")localStorage.removeItem(k);else localStorage.setItem(k,String(v));
      }
    });
  }
}
async function importFiles(files,opts={}){
  if(!files.length)return;

  const started=performance.now();
  const payloads=[];
  const fileNames=files.map(f=>f.name);

  tfMobileShowImportLoading(
    files.length>1
      ? `Membaca ${files.length} file…`
      : "Membaca file JSON…",
    files.length>1
      ? "Menyiapkan data untuk digabungkan."
      : (fileNames[0]||"Menyiapkan data.")
  );

  status("Membaca data…");

  try{
    for(let i=0;i<files.length;i++){
      if(window.__tfRev293ImportCancelled)throw new Error('Import dibatalkan user.');
      const f=files[i];
      tfMobileUpdateImportLoading(files.length>1?`Membaca file ${i+1} dari ${files.length}…`:"Membaca file J
~~~
### mergeHistory
~~~js
Number(raw.replace(/,/g,""));return Number.isFinite(n)?String(Math.round(n*100000)/100000):raw.toLowerCase();};
    const analyst=norm(it&&it.analyst).toLowerCase();
    const pair=norm(it&&it.pair).toUpperCase();
    const created=norm((it&&(it.createdSortKey!=null?it.createdSortKey:it.createdDate))||"").toLowerCase();
    const closed=norm((it&&(it.sortKey!=null?it.sortKey:it.displayDate))||"").toLowerCase();
    const signalId=norm(it&&it.signalId).toLowerCase();
    if(signalId)return [analyst,pair,created,closed,"signal:"+signalId].join("|");
    return [analyst,pair,created,closed,"entry:"+numlike(it&&it.entry),"type:"+norm(it&&it.type).toLowerCase()].join("|");
  }catch(e){return"";}
}
function completeness(it){
  if(!it||typeof it!=="object")return 0;
  let n=0;Object.keys(it).forEach(k=>{const v=it[k];if(v!==null&&v!==undefined&&String(v).trim()!=="")n++;});return n;
}
function mergeHistory(a,b){
  const map=new Map();
  const put=it=>{
    if(!it||typeof it!=="object")return;
    const k=historyKey(it)||JSON.stringify(it),prev=map.get(k);
    if(!prev){map.set(k,{...it});return;}
    const base=completeness(it)>completeness(prev)?{...prev,...it}:{...it,...prev};
    Object.keys(prev).forEach(x=>{if(base[x]==null||String(base[x]).trim()==="")base[x]=prev[x];});
    Object.keys(it).forEach(x=>{if(base[x]==null||String(base[x]).trim()==="")base[x]=it[x];});
    map.set(k,base);
  };
  (Array.isArray(a)?a:[]).forEach(put);(Array.isArray(b)?b:[]).forEach(put);
  return [...map.values()];
}
function mergeScore(a,b){
  const map=new Map();
  const put=it=>{
    if(!it||typeof it!=="object")return;
    const k=[String(it.analyst||it.analystName||"").trim().toLowerCase(),String(it.pair||"").trim().toUpperCase(),String(it.displayDate||it.date||it.sortKey||"").trim(),String(it.score||it.value||"").trim()].join("|");
    map.set(k,map.has(k)?{...map.get(k),...it}:{...it});
  };
  (Array.isArray(a)?a:[]).forEach(put);(Array.isArray(b)?b:[]).forEach(put);return [...map.values()];
}
function mergeMonthly(a,b){
  const out=clone(a&&typeof a==="object"?a:{},{});
  const src=b&&typeof b==="object"?b:{};
  Object.keys(src).forEach(k=>{out[k]={...(out[k]&&typeof out[k]==="object"?out[k]:{}),...clone(src[k]&&typeof src[k]==="object"?src[k]:{},{})};});
  return out;
}
function mergeObjects(a,b){return {...(clone(a&&typeof a==="object"?a:{},{})||{}),...(clone(b&&typeof b==="object"?b:{},{})||{})};}
function combine(payloads,names){
  const list=payloads.filter(x=>x&&typeof x==="object");
  if(!list.length)throw new Error("Tidak ada file valid.");
  const first=list[0].storage&&typeof list[0].storage==="object"?list[0].storage:list[0];
  let out={...(first||{})};
  out.tfHistorySignals=Array.isArray(first.tfHistorySignals)?first.tfHistorySignals.slice():[];
  out.tfScoreHistory=Array.isArray(first.tfScoreHistory)?first.tfScoreHistory.slice():[];
  out.tfMonthlyStats=mergeMonthly({},first.tfMonthlyStats);
  ["tfNoDataPairs","tfAvgSlPips","tfAnalystSources","tfAnalystNameCacheByUrl"].forEach(k=>{
    out[k]=mergeObjects({},first[k]);
  });
  for(let i=1;i<list.length;i++){
    const src=list[i].storage&&typeof list[i].storage==="object"?list[i].storage:list[i];
    out.tfHistorySignals=mergeHistory(out.tfHistorySignals,src.tfHistorySignals);
    out.tfScoreHistory=mergeScore(out.tfScoreHistory,src.tfScoreHistory);
    out.tfMonthlyStats=mergeMonthly(out.tfMonthlyStats,src.tfMonthlyStats);
    ["tfNoDataPairs","tfAvgSlPips","tfAnalystSources","tfAnalyst
~~~
