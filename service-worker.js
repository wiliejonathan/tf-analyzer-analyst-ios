const CACHE='tf-analyzer-analyst-mobile-v134-rev334-exact-appbar-fix';
const ASSETS=[
  './assets/dashboard-mobile.js',
  './assets/dashboard-original.css',
  './icon32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './index.html',
  './manifest.webmanifest',
  './mobile-app-shell.js',
  './mobile-remote.js',
  './mobile-chrome-shim.js',
  './mobile-data-bridge.js',
  './mobile-license-gate.js',
  './mobile-import-fix-v30.js',
  './mobile-overrides.css'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy));return res;})));
});


// REV293: PWA notification Stop action -> active Mobile Remote page.
self.addEventListener('notificationclick', event => {
  const action=String(event.action||'');
  event.notification.close();
  if(action!=='stop')return;
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>Promise.all(list.map(c=>c.postMessage({type:'TF_REMOTE_STOP'})))));
});

// REV297: cache bump forces WebView to discard stale REV294/295/296 CSS/JS.

// REV308: cache bump for Equity touch inspection, candle auto-fit, Table 1 frozen-column styling, and Table 4 native swipe.
// REV309: cache bump for realtime Update ACK, authoritative batch queue progress and background notification repaint.

// REV312: mobile Table1/2/3/4 layout, two-finger candle drag+pinch, smoother rAF scrolling.

// REV313: nested Drawdown scroll, pinned Table4 Date, Remote UI-confirmed loading, resume-without-resync.

// REV314: Table4 header/value order fixed; Remote STOP! buttons carry a non-blocking mini spinner.

// REV315: Table3 checkbox+analyst double freeze, Drawdown nested horizontal overflow, Table2 exact right edge.

// REV316: Table2 exact width/TOTAL, opaque frozen columns, explicit STOP spinner, silent Remote resume.

// REV317: Drawdown detail header/value synchronized + blank rails removed; Table4 Date rail merged/flush-left.

// REV318: Drawdown detail scroll drives the main table header; profit/loss colours restored; compact Table2/3 analyst rails; Table4 3-row metric layout.

// REV319: Table4 detail fits screen without horizontal scroll; Drawdown expanded detail starts exactly under main column 3.

// REV320: Table 1 swaps $/Pips and LOT positions; retains REV319 Table4 fit + Drawdown column-3 alignment.

// REV321: exact Drawdown parent/detail column sync + compact Equity portrait/landscape height.

// REV324: compact Equity left Y-axis labels at >= $1,000; preserve full values below $1,000.
// REV325: Equity left Y-axis labels round to 0.5K increments (1K, 1,5K, 2K, 2,5K, ...).

// REV326: zero-floor Equity axis, unclipped risk descriptions, active-nav rotate centering, renamed app/logo.

// REV327: supplied green 7+signature logo, professionally cropped with transparent rounded corners.

// REV328: rounded supplied logo + authoritative PC Remote OFF status sync.

// REV329: mobile Sidebar Plugin shows synced user photo; icon/logo package retained.

// REV330: portable login (no Mobile device binding), explicit Log out, and one-active-browser Remote confirmation.
// REV331: login/dashboard independent from PC Remote toggle; Remote entry alone is gated by toggle ON.
// REV332: token gate is mandatory before app features load; no Mobile approval/slot transfer; Remote is explicit-user-entry only.

// REV333: appbar order fix keeps Log out | Remote | Data in one top-right row.

// REV335: portrait-only appbar fix for Web/iOS; Data locked right of Remote without changing landscape.
