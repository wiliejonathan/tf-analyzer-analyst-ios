const CACHE='tf-analyzer-analyst-mobile-v147-rev352-desktop-drawdown-responsive';
const ASSETS=[
  './assets/dashboard-mobile.js?rev=352',
  './assets/dashboard-original.css?rev=352',
  './icon32.png',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './index.html',
  './manifest.webmanifest',
  './mobile-app-shell.js?rev=352',
  './mobile-remote.js?rev=352',
  './mobile-chrome-shim.js?rev=352',
  './mobile-data-bridge.js?rev=352',
  './mobile-force-update.js?rev=352',
  './mobile-license-gate.js?rev=352',
  './mobile-import-fix-v30.js?rev=352',
  './mobile-overrides.css?rev=352'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));

async function networkFirst(req){
  const cache=await caches.open(CACHE);
  try{
    const res=await fetch(req,{cache:'no-store'});
    if(res&&res.ok)cache.put(req,res.clone()).catch(()=>{});
    return res;
  }catch(_){
    const hit=await caches.match(req);
    if(hit)return hit;
    throw _;
  }
}
async function cacheFirst(req){
  const hit=await caches.match(req);
  if(hit)return hit;
  const res=await fetch(req);
  if(res&&res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone())).catch(()=>{});
  return res;
}
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  const mutable=req.mode==='navigate'||/\.(?:html|js|css|webmanifest)$/i.test(url.pathname);
  event.respondWith(mutable?networkFirst(req):cacheFirst(req));
});

self.addEventListener('notificationclick', event => {
  const action=String(event.action||'');
  event.notification.close();
  if(action!=='stop')return;
  event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>Promise.all(list.map(c=>c.postMessage({type:'TF_REMOTE_STOP'})))));
});

// REV345: Equity Y-axis uses 5% padding below actual low/start and 5% above actual high.

// REV345: Candle D1 keeps adaptive zoom; visible OHLC viewport also uses 5% edge padding.

// REV347: Touch tooltip is offset from the finger; desktop mouse behavior is unchanged.

// REV352: remember Email+Token only; verify server before dashboard; live revocation; fresh dashboard/import data every launch.

// REV352: desktop Drawdown table fills its card; expanded detail aligns after the two identity columns.
