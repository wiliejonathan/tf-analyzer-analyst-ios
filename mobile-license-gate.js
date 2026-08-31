(() => {
  'use strict';

  // REV339 — persistent token gate: remembered login opens instantly; no activation screen on refresh.
  // Email + token are REQUIRED to enter TF Analyzer. Mobile/Web never binds or transfers
  // a permanent Mobile device slot. The remembered login remains until explicit Log out.
  // The PC REMOTE toggle is checked ONLY when the user presses Remote.
  const API_BASE = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const CREDENTIALS_KEY = 'tfMobileLicenseCredentialsV2';
  const STATE_KEY = 'tfMobileLicenseStateV2';
  const DB_NAME = 'tf-analyzer-mobile-device-v1';
  const STORE_NAME = 'keys';
  const BACKUP_ID = 'mobile-license-backup-v1';
  const APP_SCRIPTS = ['mobile-chrome-shim.js?rev=339','assets/dashboard-mobile.js?rev=339','mobile-data-bridge.js?rev=339','mobile-app-shell.js?rev=339','mobile-remote.js?rev=339'];
  let appStarted = false;
  let busy = false;

  function cleanEmail(value) {
    let email = String(value || '');
    try { email = email.normalize('NFKC'); } catch (_) {}
    return email.replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '').replace(/\s+/g, '').trim();
  }
  function normalizeToken(value) {
    let token = String(value || '');
    try { token = token.normalize('NFKC'); } catch (_) {}
    return token.replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '').replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-').replace(/\s+/g, '').trim();
  }
  function getJson(key, fallback = null) { try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback; } catch (_) { return fallback; } }
  function setJson(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (_) {} }

  function openDb() {
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{ if(!req.result.objectStoreNames.contains(STORE_NAME)) req.result.createObjectStore(STORE_NAME,{keyPath:'id'}); };
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error||new Error('IndexedDB gagal dibuka.'));
    });
  }
  async function getDbRecord(id) {
    const db=await openDb();
    try { return await new Promise((resolve,reject)=>{ const r=db.transaction(STORE_NAME,'readonly').objectStore(STORE_NAME).get(String(id)); r.onsuccess=()=>resolve(r.result||null); r.onerror=()=>reject(r.error); }); }
    finally { db.close(); }
  }
  async function putDbRecord(record) {
    const db=await openDb();
    try { await new Promise((resolve,reject)=>{ const tx=db.transaction(STORE_NAME,'readwrite'); tx.objectStore(STORE_NAME).put(record); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error); }); }
    finally { db.close(); }
  }
  async function persistLoginBackup(credentials,state) {
    try {
      if(!credentials || !credentials.email || !credentials.token) return;
      await putDbRecord({id:BACKUP_ID,credentials,state:state||null,savedAt:Date.now()});
    } catch (_) {}
  }
  async function restoreLoginBackup() {
    try {
      const rec=await getDbRecord(BACKUP_ID);
      if(!rec || !rec.credentials || !rec.credentials.email || !rec.credentials.token) return null;
      if(!getJson(CREDENTIALS_KEY)) setJson(CREDENTIALS_KEY,rec.credentials);
      if(!getJson(STATE_KEY) && rec.state) setJson(STATE_KEY,rec.state);
      return rec;
    } catch (_) { return null; }
  }

  function platformName() {
    const ua=navigator.userAgent||'';
    if(/iPhone|iPad|iPod/i.test(ua)) return 'iPhone/iPad • PWA';
    if(/Android/i.test(ua)) return 'Android • TF Analyzer';
    return 'Web Browser • TF Analyzer';
  }

  async function api(path, body, timeoutMs=25000) {
    const controller=typeof AbortController==='function'?new AbortController():null;
    const timeout=setTimeout(()=>{try{controller&&controller.abort();}catch(_){}},Math.max(4000,timeoutMs));
    try {
      const response=await fetch(API_BASE+path,{
        method:'POST',cache:'no-store',redirect:'follow',signal:controller?controller.signal:undefined,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...body,deviceType:'MOBILE',clientType:'MOBILE',mobilePlatform:platformName(),mobileVersion:'1.0.103',remoteRevision:'REV339'})
      });
      const text=await response.text(); let result;
      try{result=JSON.parse(text);}catch(_){throw new Error('Respons server bukan JSON.');}
      if(!response.ok&&!result.message)result.message='HTTP '+response.status;
      return result;
    } finally { clearTimeout(timeout); }
  }

  const LEGACY_MOBILE_APPROVAL_KEYS = [
    'tfDevicePendingApprovalV1','tfDeviceApprovalPopupShownV1','tfDeviceApprovedTransferV1',
    'tfMobilePendingApprovalV1','tfMobileDeviceApprovalV1','tfMobileDevicePendingV1'
  ];
  function cleanupLegacyMobileApprovalArtifacts(){
    try{for(const k of LEGACY_MOBILE_APPROVAL_KEYS){localStorage.removeItem(k);sessionStorage.removeItem(k);}}catch(_){}
    try{document.getElementById('tf-mobile-device-popup')?.remove();}catch(_){}
  }

  function createGate(){
    let root=document.getElementById('tf-mobile-license-gate'); if(root)return root;
    root=document.createElement('div'); root.id='tf-mobile-license-gate';
    root.innerHTML=`<div class="tf-license-card">
      <div class="tf-license-brand"><img src="icon32.png" alt="TF"><div><div class="tf-license-kicker">TF Analyzer Analyst</div><h1>Login</h1></div></div>
      <p class="tf-license-copy">Masukkan <b>Email + Token Lisensi</b> untuk membuka TF Analyzer. Login dapat dipakai dari Android, iOS, maupun browser/laptop dan tetap tersimpan pada perangkat ini sampai Anda menekan <b>Log out</b>.</p>
      <div id="tf-license-status" class="tf-license-status">Memeriksa login tersimpan…</div>
      <form id="tf-license-form" class="tf-license-form">
        <label>Email</label><input id="tf-license-email" type="email" autocomplete="username" placeholder="nama@email.com" required>
        <label>Token Lisensi</label><div class="tf-license-token-wrap"><input id="tf-license-token" type="password" autocomplete="current-password" placeholder="TFA-XXXX-XXXX-XXXX-XXXX" required><button id="tf-license-toggle" type="button" class="tf-license-mini">Lihat</button></div>
        <button id="tf-license-submit" class="tf-license-primary" type="submit">Login</button>
      </form>
      <div id="tf-license-valid-box" class="tf-license-valid-box hidden"><div class="tf-license-valid-title">Login berhasil</div><div id="tf-license-valid-detail" class="tf-license-valid-detail">Lisensi valid. Dashboard dapat digunakan langsung.</div><button id="tf-license-open" type="button" class="tf-license-primary">Buka TF Analyzer</button><button id="tf-license-change" type="button" class="tf-license-secondary">Ganti akun</button></div>
      <div class="tf-license-note">Aktivasi Mobile/Web tidak memakai approval atau transfer slot perangkat. Toggle REMOTE pada Plugin PC hanya diperlukan saat membuka fitur <b>Remote</b>.</div>
    </div>`;
    document.body.appendChild(root); return root;
  }
  function setStatus(message,kind=''){const e=document.getElementById('tf-license-status');if(e){e.textContent=String(message||'');e.className='tf-license-status'+(kind?' '+kind:'');}}
  function setBusy(v){busy=!!v;const b=document.getElementById('tf-license-submit');if(b){b.disabled=busy;b.textContent=busy?'Memverifikasi…':'Login';}}
  function showForm(credentials,message=''){document.getElementById('tf-license-form')?.classList.remove('hidden');document.getElementById('tf-license-valid-box')?.classList.add('hidden');const e=document.getElementById('tf-license-email'),t=document.getElementById('tf-license-token');if(e)e.value=cleanEmail(credentials&&credentials.email);if(t)t.value=normalizeToken(credentials&&credentials.token);if(message)setStatus(message,'error');}
  function showValid(state,cached=false){document.getElementById('tf-license-form')?.classList.add('hidden');document.getElementById('tf-license-valid-box')?.classList.remove('hidden');const d=document.getElementById('tf-license-valid-detail');if(d)d.textContent=(cached?'Login tersimpan dipulihkan. ':'')+'Token valid. Semua fitur aplikasi dapat digunakan. Toggle REMOTE Plugin PC hanya diperlukan ketika membuka fitur Remote.';setStatus('Token valid.','success');}
  function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('Gagal memuat '+src));document.body.appendChild(s);});}

  async function startApp(){
    if(appStarted)return;appStarted=true;
    document.documentElement.setAttribute('data-tf-server-authorized','1');
    document.documentElement.setAttribute('data-tf-license','valid');
    const root=document.getElementById('tf-mobile-license-gate');if(root)root.classList.add('tf-license-leaving');
    try{
      for(const src of APP_SCRIPTS)await loadScript(src);
      if(!window.__TF_MOBILE_DASHBOARD_DOM_READY_V32){window.__TF_MOBILE_DASHBOARD_DOM_READY_V32=true;try{document.dispatchEvent(new Event('DOMContentLoaded',{bubbles:true}));}catch(_){try{document.dispatchEvent(new Event('DOMContentLoaded'));}catch(__){}}}
      if(root)root.remove();
      setTimeout(()=>{try{if(typeof window.tfMobileRecoverRenderV31==='function')window.tfMobileRecoverRenderV31('token-gate-rev339');}catch(_){}},450);
    }catch(e){appStarted=false;if(root)root.classList.remove('tf-license-leaving');setStatus(e.message||String(e),'error');}
  }

  async function login(email,token,{silent=false}={}){
    if(busy)return false;
    email=cleanEmail(email);token=normalizeToken(token);
    if(!email||!token){if(!silent)setStatus('Email dan token wajib diisi.','error');return false;}
    setBusy(true);setStatus(silent?'Memulihkan login tersimpan…':'Memverifikasi email + token…');
    try{
      const result=await api('/mobile/login',{email,token});
      if(!(result&&result.valid===true&&result.sessionValid===true&&result.sessionToken)){
        const code=String(result&&(result.code||result.error)||'MOBILE_LOGIN_FAILED');
        const message=String(result&&(result.message||result.code||result.error)||'Login gagal.');
        setStatus(`[${code}] ${message}`,'error');return false;
      }
      cleanupLegacyMobileApprovalArtifacts();
      const now=Date.now();
      const savedCred={email,token,savedAt:now,portable:true};
      const savedState={...result,valid:true,portableSession:true,checkedAt:now};
      setJson(CREDENTIALS_KEY,savedCred);setJson(STATE_KEY,savedState);await persistLoginBackup(savedCred,savedState);
      showValid(savedState,silent);setTimeout(()=>startApp(),silent?80:220);return true;
    }catch(e){setStatus(e&&e.name==='AbortError'?'Server login timeout.':(e.message||String(e)),'error');return false;}
    finally{setBusy(false);}
  }

  function isTfStorageKey(key){
    const k=String(key||'');
    return /^(tf|TF|__tf|__TF)/.test(k) || /tf[-_ ]?analy/i.test(k) || /tradersfamily/i.test(k);
  }
  async function clearTfLocalStorage(){
    try{const keys=[];for(let i=0;i<localStorage.length;i++)keys.push(localStorage.key(i));for(const k of keys)if(isTfStorageKey(k))localStorage.removeItem(k);}catch(_){}
    try{const keys=[];for(let i=0;i<sessionStorage.length;i++)keys.push(sessionStorage.key(i));for(const k of keys)if(isTfStorageKey(k))sessionStorage.removeItem(k);}catch(_){}
  }
  async function clearTfIndexedDb(){
    try{
      if(indexedDB.databases){const list=await indexedDB.databases();for(const x of list||[]){const n=String(x&&x.name||'');if(n&&(/tf[-_ ]?analy/i.test(n)||/^tf[-_]/i.test(n)))try{indexedDB.deleteDatabase(n);}catch(_){}}}
      else try{indexedDB.deleteDatabase(DB_NAME);}catch(_){}
    }catch(_){}
  }
  async function clearTfCaches(){
    try{if(!window.caches)return;const names=await caches.keys();await Promise.all(names.filter(n=>/^tf[-_]/i.test(String(n))||/tf[-_ ]?analy/i.test(String(n))).map(n=>caches.delete(n)));}catch(_){}
  }

  async function logout({ask=true}={}){
    if(ask && !window.confirm('Log out TF Analyzer? Data login, cache Remote, dan data TF Analyzer yang tersimpan pada browser/ponsel ini akan dibersihkan.'))return;
    const cred=getJson(CREDENTIALS_KEY)||{};const state=getJson(STATE_KEY)||{};
    try{if(typeof window.tfMobileRemoteShutdown==='function')await window.tfMobileRemoteShutdown('logout');}catch(_){}
    try{await api('/mobile/logout',{email:cred.email||'',token:cred.token||'',licenseId:state.licenseId||state.license||'',sessionToken:state.sessionToken||''},8000);}catch(_){}
    await clearTfLocalStorage();await clearTfIndexedDb();await clearTfCaches();
    try{history.replaceState(null,'',location.pathname);}catch(_){}
    setTimeout(()=>location.reload(),120);
  }

  // Global hook used by the portrait header and landscape left navigation.
  window.tfMobileLogout = logout;

  function bindUi(){
    document.getElementById('tf-license-form')?.addEventListener('submit',e=>{e.preventDefault();void login(document.getElementById('tf-license-email')?.value||'',document.getElementById('tf-license-token')?.value||'');});
    document.getElementById('tf-license-toggle')?.addEventListener('click',()=>{const i=document.getElementById('tf-license-token'),b=document.getElementById('tf-license-toggle');if(!i||!b)return;const show=i.type==='text';i.type=show?'password':'text';b.textContent=show?'Lihat':'Sembunyi';});
    document.getElementById('tf-license-open')?.addEventListener('click',()=>startApp());
    document.getElementById('tf-license-change')?.addEventListener('click',async()=>{await clearTfLocalStorage();try{indexedDB.deleteDatabase(DB_NAME);}catch(_){}showForm(null);setStatus('Masukkan email dan token lain.');});
  }

  async function refreshRememberedSessionInBackground(credentials){
    try{
      if(!credentials||!credentials.email||!credentials.token)return;
      const result=await api('/mobile/login',{email:credentials.email,token:credentials.token},25000);
      if(result&&result.valid===true&&result.sessionValid===true&&result.sessionToken){
        const now=Date.now();
        const savedCred={email:cleanEmail(credentials.email),token:normalizeToken(credentials.token),savedAt:Number(credentials.savedAt||now),portable:true};
        const savedState={...result,valid:true,portableSession:true,checkedAt:now};
        setJson(CREDENTIALS_KEY,savedCred);setJson(STATE_KEY,savedState);await persistLoginBackup(savedCred,savedState);
      }
    }catch(_){
      // Network/server refresh must never throw the user back to activation.
      // The remembered login remains authoritative until explicit Log out.
    }
  }

  async function boot(){
    cleanupLegacyMobileApprovalArtifacts();
    await restoreLoginBackup();
    const cred=getJson(CREDENTIALS_KEY);
    const state=getJson(STATE_KEY);

    // REV339: once Email + Token have been activated successfully, refresh/reopen
    // must enter the app directly. Do not draw the activation gate again.
    if(cred&&cred.email&&cred.token&&state&&state.valid===true){
      void startApp();
      setTimeout(()=>void refreshRememberedSessionInBackground(cred),900);
      return;
    }

    createGate();bindUi();
    if(cred&&cred.email&&cred.token){
      showForm(cred);
      setStatus('Login tersimpan belum memiliki sesi valid. Silakan Login sekali lagi.');
      return;
    }
    showForm(null);setStatus('Masukkan email dan token untuk Login TF Analyzer.');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>void boot(),{once:true});else void boot();
})();
