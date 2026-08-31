(function(){
"use strict";

// V29: IndexedDB-backed chrome.storage.local shim.
// Large TF JSON exports can exceed WebView localStorage quotas. IndexedDB avoids
// the silent quota failure that previously left the import loader waiting forever.
const LEGACY_PREFIX="tf_mobile_rev224_chrome_";
const DB_NAME="tf-mobile-chrome-storage-v29";
const DB_VERSION=1;
const STORE="kv";
const MIGRATION_FLAG="tf_mobile_storage_v29_migrated";
const changeListeners=[];
const cache=new Map();
let dbPromise=null;
let migrationPromise=null;

function openDb(){
  if(dbPromise)return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE,{keyPath:"key"});
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error||new Error("Mobile storage database gagal dibuka."));
  });
  return dbPromise;
}

function txDone(tx){
  return new Promise((resolve,reject)=>{
    tx.oncomplete=()=>resolve();
    tx.onerror=()=>reject(tx.error||new Error("Mobile storage transaction gagal."));
    tx.onabort=()=>reject(tx.error||new Error("Mobile storage transaction dibatalkan."));
  });
}

async function idbGet(key){
  if(cache.has(key))return cache.get(key);
  const db=await openDb();
  const value=await new Promise((resolve,reject)=>{
    const req=db.transaction(STORE,"readonly").objectStore(STORE).get(String(key));
    req.onsuccess=()=>resolve(req.result?req.result.value:undefined);
    req.onerror=()=>reject(req.error||new Error("Gagal membaca mobile storage."));
  });
  cache.set(String(key),value);
  return value;
}

async function idbGetAll(){
  const db=await openDb();
  return new Promise((resolve,reject)=>{
    const out={};
    const req=db.transaction(STORE,"readonly").objectStore(STORE).openCursor();
    req.onsuccess=()=>{
      const cursor=req.result;
      if(!cursor){resolve(out);return;}
      const row=cursor.value;
      if(row&&row.key!=null){out[row.key]=row.value;cache.set(String(row.key),row.value);}
      cursor.continue();
    };
    req.onerror=()=>reject(req.error||new Error("Gagal membaca seluruh mobile storage."));
  });
}

async function migrateLegacyOnce(){
  if(migrationPromise)return migrationPromise;
  migrationPromise=(async()=>{
    try{
      if(localStorage.getItem(MIGRATION_FLAG)==="1")return;
      const rows=[];
      for(let i=0;i<localStorage.length;i++){
        const full=localStorage.key(i);
        if(!full||!full.startsWith(LEGACY_PREFIX))continue;
        const key=full.slice(LEGACY_PREFIX.length);
        const raw=localStorage.getItem(full);
        if(raw==null)continue;
        try{rows.push({key,value:JSON.parse(raw)});}catch(_){}
      }
      if(rows.length){
        const db=await openDb();
        const tx=db.transaction(STORE,"readwrite");
        const store=tx.objectStore(STORE);
        rows.forEach(row=>{store.put(row);cache.set(row.key,row.value);});
        await txDone(tx);
      }
      localStorage.setItem(MIGRATION_FLAG,"1");
    }catch(e){console.warn("TF Mobile legacy storage migration warning",e);}
  })();
  return migrationPromise;
}

function setRuntimeError(message){
  try{runtime.lastError=message?{message:String(message)}:null;}catch(_){}
}

async function storageGetAsync(keys){
  await migrateLegacyOnce();
  const out={};
  if(keys==null)return idbGetAll();
  if(typeof keys==="string"){
    const value=await idbGet(keys); if(value!==undefined)out[keys]=value; return out;
  }
  if(Array.isArray(keys)){
    await Promise.all(keys.map(async k=>{const value=await idbGet(k);if(value!==undefined)out[k]=value;})); return out;
  }
  if(keys&&typeof keys==="object"){
    await Promise.all(Object.keys(keys).map(async k=>{const value=await idbGet(k);out[k]=value===undefined?keys[k]:value;})); return out;
  }
  return out;
}

function storageGet(keys,cb){
  storageGetAsync(keys).then(out=>{setRuntimeError(null);cb&&cb(out);}).catch(e=>{console.error("TF Mobile storageGet error",e);setRuntimeError(e.message||e);cb&&cb({});});
}

async function storageSetAsync(values){
  await migrateLegacyOnce();
  const entries=Object.entries(values||{});
  if(!entries.length)return {};
  const silentBulk=window.__TF_MOBILE_SILENT_STORAGE_SET===true;
  const changes={};
  if(!silentBulk){
    await Promise.all(entries.map(async([k,v])=>{changes[k]={oldValue:await idbGet(k),newValue:v};}));
  }
  const db=await openDb();
  const tx=db.transaction(STORE,"readwrite");
  const store=tx.objectStore(STORE);
  for(const [k,v] of entries){store.put({key:String(k),value:v});cache.set(String(k),v);}
  await txDone(tx);
  if(!silentBulk&&Object.keys(changes).length){
    queueMicrotask(()=>changeListeners.forEach(fn=>{try{fn(changes,"local");}catch(_){}}));
  }
  return changes;
}

function storageSet(values,cb){
  window.__TF_MOBILE_STORAGE_LAST_ERROR="";
  storageSetAsync(values).then(()=>{setRuntimeError(null);queueMicrotask(()=>cb&&cb());}).catch(e=>{
    console.error("TF Mobile storageSet error",e);
    window.__TF_MOBILE_STORAGE_LAST_ERROR=String(e&&e.message?e.message:e);
    setRuntimeError(window.__TF_MOBILE_STORAGE_LAST_ERROR);
    queueMicrotask(()=>cb&&cb());
  });
}

async function storageRemoveAsync(keys){
  await migrateLegacyOnce();
  const list=(Array.isArray(keys)?keys:[keys]).filter(k=>k!=null).map(String);
  const changes={};
  for(const k of list)changes[k]={oldValue:await idbGet(k),newValue:undefined};
  const db=await openDb();
  const tx=db.transaction(STORE,"readwrite");
  const store=tx.objectStore(STORE);
  list.forEach(k=>{store.delete(k);cache.delete(k);});
  await txDone(tx);
  if(list.length)queueMicrotask(()=>changeListeners.forEach(fn=>{try{fn(changes,"local");}catch(_){}}));
}
function storageRemove(keys,cb){storageRemoveAsync(keys).then(()=>{setRuntimeError(null);cb&&cb();}).catch(e=>{setRuntimeError(e.message||e);cb&&cb();});}

async function storageClearAsync(){
  const db=await openDb();
  const tx=db.transaction(STORE,"readwrite");
  tx.objectStore(STORE).clear();
  await txDone(tx);cache.clear();
}
function storageClear(cb){storageClearAsync().then(()=>{setRuntimeError(null);cb&&cb();}).catch(e=>{setRuntimeError(e.message||e);cb&&cb();});}

const runtime={
  id:"tf-mobile-rev224-private",
  lastError:null,
  getManifest(){return{name:"TF Multi-Analyst Mobile",version:"1.16.01",version_name:"REV231 Mobile IndexedDB Fast Import"};},
  getURL(path){const p=String(path||"").replace(/^dashboard\.html(\?.*)?$/,"index.html$1");try{return new URL(p,document.baseURI).href;}catch(e){return p;}},
  onMessage:{addListener(){}},
  sendMessage(msg,cb){
    const type=String(msg&&msg.type||"");
    if(type==="scanSingleAnalyst"||type.indexOf("tf_isignal_users_")===0){queueMicrotask(()=>cb&&cb({ok:false,mobile:true,error:"Scanner / iSignal Users tidak tersedia di mobile."}));return;}
    if(type==="ensure_myfxbook_prices"){queueMicrotask(()=>cb&&cb({ok:false,mobile:true,error:"Live price desktop tidak digunakan di mobile."}));return;}
    if(type==="ensure_tf_profile"){queueMicrotask(()=>cb&&cb({ok:true,mobile:true}));return;}
    queueMicrotask(()=>cb&&cb({ok:false,mobile:true}));
  }
};

window.chrome={
  storage:{local:{get:storageGet,set:storageSet,remove:storageRemove,clear:storageClear},onChanged:{addListener(fn){if(typeof fn==="function")changeListeners.push(fn);}}},
  runtime,
  tabs:{create(opts){try{window.open(String(opts&&opts.url||""),"_blank","noopener,noreferrer");}catch(e){}}}
};
window.__TF_MOBILE_STORAGE_BACKEND="indexeddb-v29";
})();
