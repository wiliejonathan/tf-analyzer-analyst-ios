(() => {
  'use strict';

  const API_BASE = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const CREDENTIALS_KEY = 'tfMobileLicenseCredentialsV2';
  const STATE_KEY = 'tfMobileLicenseStateV2';
  const DB_NAME = 'tf-analyzer-mobile-device-v1';
  const STORE_NAME = 'keys';
  const KEY_ID = 'mobile-p256-v1';
  const BACKUP_ID = 'mobile-license-backup-v1';
  const OFFLINE_GRACE_MS = 72 * 60 * 60 * 1000;
  const APP_SCRIPTS = ['mobile-chrome-shim.js','assets/dashboard-mobile.js','mobile-data-bridge.js','mobile-app-shell.js','mobile-remote.js'];
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
  function removeKey(key) { try { localStorage.removeItem(key); } catch (_) {} }
  function b64(buffer) { const bytes = new Uint8Array(buffer); let binary=''; for (const x of bytes) binary += String.fromCharCode(x); return btoa(binary); }
  function hex(bytes) { return Array.from(bytes).map(v=>v.toString(16).padStart(2,'0')).join('').toUpperCase(); }

  function openDb() {
    return new Promise((resolve,reject)=>{
      const req=indexedDB.open(DB_NAME,1);
      req.onupgradeneeded=()=>{ if(!req.result.objectStoreNames.contains(STORE_NAME)) req.result.createObjectStore(STORE_NAME,{keyPath:'id'}); };
      req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error||new Error('IndexedDB gagal dibuka.'));
    });
  }
  async function getKeyRecord() {
    const db=await openDb();
    try { return await new Promise((resolve,reject)=>{ const r=db.transaction(STORE_NAME,'readonly').objectStore(STORE_NAME).get(KEY_ID); r.onsuccess=()=>resolve(r.result||null); r.onerror=()=>reject(r.error); }); }
    finally { db.close(); }
  }
  async function putKeyRecord(record) {
    const db=await openDb();
    try { await new Promise((resolve,reject)=>{ const tx=db.transaction(STORE_NAME,'readwrite'); tx.objectStore(STORE_NAME).put(record); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); tx.onabort=()=>reject(tx.error); }); }
    finally { db.close(); }
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
  async function persistLicenseBackup(credentials,state) {
    try {
      if(!credentials || !credentials.email || !credentials.token) return;
      await putDbRecord({id:BACKUP_ID,credentials,state:state||null,savedAt:Date.now()});
    } catch (_) {}
  }
  async function restoreLicenseBackup() {
    try {
      const rec=await getDbRecord(BACKUP_ID);
      if(!rec || !rec.credentials || !rec.credentials.email || !rec.credentials.token) return null;
      if(!getJson(CREDENTIALS_KEY)) setJson(CREDENTIALS_KEY,rec.credentials);
      if(!getJson(STATE_KEY) && rec.state) setJson(STATE_KEY,rec.state);
      return rec;
    } catch (_) { return null; }
  }
  async function getOrCreateKeyPair() {
    const existing=await getKeyRecord();
    if(existing && existing.privateKey instanceof CryptoKey && existing.publicKey instanceof CryptoKey) return existing;
    const pair=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},false,['sign','verify']);
    const record={id:KEY_ID,privateKey:pair.privateKey,publicKey:pair.publicKey,createdAt:new Date().toISOString()};
    await putKeyRecord(record); return record;
  }
  async function getDeviceProof(challenge) {
    if(!window.crypto || !crypto.subtle || !window.indexedDB) throw new Error('Perangkat/browser ini tidak mendukung secure mobile device key.');
    const pair=await getOrCreateKeyPair();
    const spki=await crypto.subtle.exportKey('spki',pair.publicKey);
    const digest=await crypto.subtle.digest('SHA-256',spki);
    const deviceId='TFDEV-'+hex(new Uint8Array(digest));
    const signature=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},pair.privateKey,new TextEncoder().encode(String(challenge||'')));
    return { deviceId, publicKeySpki:b64(spki), signatureBase64:b64(signature) };
  }

  function platformName() {
    const ua=navigator.userAgent||'';
    if(/iPhone|iPad|iPod/i.test(ua)) return 'iPhone/iPad • PWA';
    if(/Android/i.test(ua)) return 'Android • TF Analyzer';
    return 'Mobile • TF Analyzer';
  }
  async function api(path, body) {
    const controller=typeof AbortController==='function'?new AbortController():null;
    const timeout=setTimeout(()=>{try{controller&&controller.abort();}catch(_){}},70000);
    try {
      const response=await fetch(API_BASE+path,{method:'POST',cache:'no-store',redirect:'follow',signal:controller?controller.signal:undefined,headers:{'Content-Type':'application/json'},body:JSON.stringify({...body,deviceType:'MOBILE',clientType:'MOBILE',mobilePlatform:platformName(),mobileVersion:'1.0.58'})});
      const text=await response.text(); let result;
      try{result=JSON.parse(text);}catch(_){throw new Error('Respons server lisensi bukan JSON.');}
      if(!response.ok&&!result.message)result.message='HTTP '+response.status;
      return result;
    } finally { clearTimeout(timeout); }
  }
  function validLicense(result) {
    if(!result||result.valid!==true)return false;
    const status=String(result.status||'ACTIVE').toUpperCase(); if(status!=='ACTIVE')return false;
    if(result.isPermanent===true)return true;
    const exp=String(result.expiresAt||'').trim(); if(!exp)return true;
    const ms=Date.parse(exp); return !Number.isFinite(ms)||ms>Date.now();
  }
  async function activateOnline(email,token) {
    const lookup=await api('/license-check',{email,token});
    if(!validLicense(lookup)) return lookup;
    const challenge=await api('/device-challenge',{email,token,licenseId:lookup.licenseId||lookup.license||''});
    if(challenge.valid!==true||!challenge.challenge||!challenge.requestId)return challenge;
    const proof=await getDeviceProof(challenge.challenge);
    const bind=await api('/bind-device',{
      email,token,licenseId:challenge.licenseId||lookup.licenseId||'',requestId:challenge.requestId,challenge:challenge.challenge,
      publicKeySpki:proof.publicKeySpki,signatureBase64:proof.signatureBase64,deviceName:platformName()
    });
    if(bind && bind.bound===true && bind.sessionToken){
      return {...bind,localDeviceId:proof.deviceId};
    }
    return bind;
  }

  async function resumeSession(credentials,state) {
    if(!credentials || !credentials.email || !credentials.token || !state || !state.sessionToken) return {ok:false,sessionValid:false,code:'NO_SAVED_SESSION'};
    const licenseId=state.licenseId||state.license||'';
    const ch=await api('/session-challenge',{email:credentials.email,token:credentials.token,licenseId,sessionToken:state.sessionToken});
    if(!(ch&&ch.valid===true&&ch.sessionValid===true&&ch.challenge&&ch.requestId)) return ch||{ok:false,sessionValid:false,code:'SESSION_CHALLENGE_FAILED'};
    const proof=await getDeviceProof(ch.challenge);
    const vr=await api('/session-validate',{
      email:credentials.email,token:credentials.token,licenseId,sessionToken:state.sessionToken,
      challenge:ch.challenge,requestId:ch.requestId,publicKeySpki:proof.publicKeySpki,signatureBase64:proof.signatureBase64
    });
    if(vr&&vr.valid===true&&vr.sessionValid===true){
      return {...state,...vr,valid:true,sessionToken:state.sessionToken,localDeviceId:state.localDeviceId||proof.deviceId};
    }
    return vr||{ok:false,sessionValid:false,code:'SESSION_VALIDATE_FAILED'};
  }

  function createGate(){
    let root=document.getElementById('tf-mobile-license-gate'); if(root)return root;
    root=document.createElement('div'); root.id='tf-mobile-license-gate';
    root.innerHTML=`<div class="tf-license-card"><div class="tf-license-brand"><img src="icon32.png" alt="TF"><div><div class="tf-license-kicker">TF Analyzer Mobile</div><h1>Aktivasi Lisensi</h1></div></div><p class="tf-license-copy">Satu email + token dapat digunakan untuk <b>1 PC</b> dan <b>1 Mobile</b>. Slot Mobile tidak mengambil alih Device Lock PC.</p><div id="tf-license-status" class="tf-license-status">Memeriksa lisensi tersimpan…</div><form id="tf-license-form" class="tf-license-form"><label>Email</label><input id="tf-license-email" type="email" autocomplete="username" placeholder="nama@email.com" required><label>Token Lisensi</label><div class="tf-license-token-wrap"><input id="tf-license-token" type="password" autocomplete="current-password" placeholder="TFA-XXXX-XXXX-XXXX-XXXX" required><button id="tf-license-toggle" type="button" class="tf-license-mini">Lihat</button></div><button id="tf-license-submit" class="tf-license-primary" type="submit">Aktifkan Mobile</button></form><div id="tf-license-valid-box" class="tf-license-valid-box hidden"><div class="tf-license-valid-title">Mobile teraktivasi</div><div id="tf-license-valid-detail" class="tf-license-valid-detail"></div><button id="tf-license-open" type="button" class="tf-license-primary">Buka TF Analyzer</button><button id="tf-license-change" type="button" class="tf-license-secondary">Ganti lisensi</button></div><div class="tf-license-note">Batas lisensi: 1 Desktop + 1 Mobile. HP kedua akan ditolak sampai slot Mobile di-reset oleh admin.</div></div>`;
    document.body.appendChild(root); return root;
  }
  function setStatus(message,kind=''){const e=document.getElementById('tf-license-status');if(e){e.textContent=String(message||'');e.className='tf-license-status'+(kind?' '+kind:'');}}
  function setBusy(v){busy=!!v;const b=document.getElementById('tf-license-submit');if(b){b.disabled=busy;b.textContent=busy?'Memverifikasi…':'Aktifkan Mobile';}}
  function showForm(credentials,message=''){document.getElementById('tf-license-form')?.classList.remove('hidden');document.getElementById('tf-license-valid-box')?.classList.add('hidden');const e=document.getElementById('tf-license-email'),t=document.getElementById('tf-license-token');if(e)e.value=cleanEmail(credentials&&credentials.email);if(t)t.value=normalizeToken(credentials&&credentials.token);if(message)setStatus(message,'error');}
  function showValid(state,cached=false){document.getElementById('tf-license-form')?.classList.add('hidden');document.getElementById('tf-license-valid-box')?.classList.remove('hidden');const d=document.getElementById('tf-license-valid-detail');if(d)d.textContent=(cached?'Mode offline sementara • ':'')+(state.localDeviceId?`Device: ${String(state.localDeviceId).slice(0,22)}…`:'Slot Mobile aktif.');setStatus(cached?'Lisensi mobile tersimpan masih valid.':'Aktivasi Mobile berhasil.','success');}
  function loadScript(src){return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=()=>reject(new Error('Gagal memuat '+src));document.body.appendChild(s);});}
  async function startApp(){if(appStarted)return;appStarted=true;document.documentElement.setAttribute('data-tf-server-authorized','1');document.documentElement.setAttribute('data-tf-license','valid');const root=document.getElementById('tf-mobile-license-gate');if(root)root.classList.add('tf-license-leaving');try{for(const src of APP_SCRIPTS)await loadScript(src);if(!window.__TF_MOBILE_DASHBOARD_DOM_READY_V32){window.__TF_MOBILE_DASHBOARD_DOM_READY_V32=true;try{document.dispatchEvent(new Event('DOMContentLoaded',{bubbles:true}));}catch(_){try{document.dispatchEvent(new Event('DOMContentLoaded'));}catch(__){}}}if(root)root.remove();setTimeout(()=>{try{if(typeof window.tfMobileRecoverRenderV31==='function')window.tfMobileRecoverRenderV31('license-start-v32');}catch(_){}},450);}catch(e){appStarted=false;if(root)root.classList.remove('tf-license-leaving');setStatus(e.message||String(e),'error');}}
  async function activate(email,token){if(busy)return;email=cleanEmail(email);token=normalizeToken(token);if(!email||!token){setStatus('Email dan token wajib diisi.','error');return;}setBusy(true);setStatus('Memverifikasi token dan slot Mobile…');try{const result=await activateOnline(email,token);if(!(result&&result.valid===true&&result.bound===true)){const code=String(result&&(result.code||result.error)||'MOBILE_ACTIVATION_FAILED');const message=String(result&&(result.message||result.code||result.error)||'Aktivasi Mobile gagal.');setStatus(`[${code}] ${message}`,'error');return;}const now=Date.now();const savedCred={email,token,savedAt:now};const savedState={...result,valid:true,checkedAt:now};setJson(CREDENTIALS_KEY,savedCred);setJson(STATE_KEY,savedState);await persistLicenseBackup(savedCred,savedState);showValid(savedState,false);setTimeout(()=>startApp(),350);}catch(e){setStatus(e&&e.name==='AbortError'?'Server lisensi timeout.':(e.message||String(e)),'error');}finally{setBusy(false);}}
  async function clearLicense(){removeKey(CREDENTIALS_KEY);removeKey(STATE_KEY);try{const db=await openDb();try{await new Promise((resolve,reject)=>{const tx=db.transaction(STORE_NAME,'readwrite');tx.objectStore(STORE_NAME).delete(BACKUP_ID);tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);});}finally{db.close();}}catch(_){}showForm(null,'Masukkan email dan token lisensi.');}
  function bindUi(){document.getElementById('tf-license-form')?.addEventListener('submit',e=>{e.preventDefault();void activate(document.getElementById('tf-license-email')?.value||'',document.getElementById('tf-license-token')?.value||'');});document.getElementById('tf-license-toggle')?.addEventListener('click',()=>{const i=document.getElementById('tf-license-token'),b=document.getElementById('tf-license-toggle');if(!i||!b)return;const show=i.type==='text';i.type=show?'password':'text';b.textContent=show?'Lihat':'Sembunyi';});document.getElementById('tf-license-open')?.addEventListener('click',()=>startApp());document.getElementById('tf-license-change')?.addEventListener('click',clearLicense);}
  async function boot(){
    createGate();bindUi();
    await restoreLicenseBackup();
    let cred=getJson(CREDENTIALS_KEY),state=getJson(STATE_KEY);
    const checked=Number(state&&state.checkedAt||0);
    const cached=Boolean(cred&&cred.email&&cred.token&&state&&state.valid===true&&checked&&Date.now()-checked<=OFFLINE_GRACE_MS&&validLicense(state));
    if(cached){
      await persistLicenseBackup(cred,state);
      showValid(state,true);setTimeout(()=>startApp(),220);return;
    }
    if(cred&&cred.email&&cred.token&&state&&state.sessionToken){
      showForm(cred);setStatus('Melanjutkan session Mobile tersimpan…');
      try{
        const resumed=await resumeSession(cred,state);
        if(resumed&&resumed.valid===true&&resumed.sessionValid===true){
          const next={...state,...resumed,valid:true,sessionToken:state.sessionToken,checkedAt:Date.now()};
          setJson(STATE_KEY,next);await persistLicenseBackup(cred,next);showValid(next,false);setTimeout(()=>startApp(),220);return;
        }
      }catch(_){}
      // Session lama expired/berubah. Re-bind perangkat yang sama otomatis sebelum meminta reset/approval.
      setStatus('Memulihkan session perangkat Mobile…');
      await activate(cred.email,cred.token);return;
    }
    if(cred&&cred.email&&cred.token){showForm(cred);setStatus('Memulihkan aktivasi Mobile tersimpan…');await activate(cred.email,cred.token);return;}
    showForm(null);setStatus('Masukkan email dan token untuk mengisi slot Mobile.');
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>void boot(),{once:true});else void boot();
})();
