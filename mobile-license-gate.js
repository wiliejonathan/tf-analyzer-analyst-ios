(() => {
  'use strict';

  // REV349 — strict token gate + live revocation + fresh-start mobile/web runtime.
  // - Every new page/app launch starts at the Email + Token gate.
  // - Login credentials/session are kept in memory only; they are never persisted.
  // - The license is revalidated against /license-check every 5 seconds while the app is open.
  // - Explicit server invalidation (deleted, expired, blocked, inactive, token invalid, etc.)
  //   immediately clears runtime data and returns to the activation page.
  // - Persisted TF Analyzer user/session/import data from older builds is purged on every boot.

  const API_BASE = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const LICENSE_WATCH_MS = 5000;
  const APP_SCRIPTS = [
    'mobile-chrome-shim.js?rev=349',
    'assets/dashboard-mobile.js?rev=349',
    'mobile-data-bridge.js?rev=349',
    'mobile-app-shell.js?rev=349',
    'mobile-remote.js?rev=349'
  ];

  let appStarted = false;
  let busy = false;
  let watchBusy = false;
  let watchTimer = null;
  let activeCredentials = null;
  let activeState = null;
  let kicked = false;

  function cleanEmail(value) {
    let email = String(value || '');
    try { email = email.normalize('NFKC'); } catch (_) {}
    return email.replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '').replace(/\s+/g, '').trim();
  }

  function normalizeToken(value) {
    let token = String(value || '');
    try { token = token.normalize('NFKC'); } catch (_) {}
    return token
      .replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
      .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
      .replace(/\s+/g, '')
      .trim();
  }

  function platformName() {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone/iPad • PWA';
    if (/Android/i.test(ua)) return 'Android • TF Analyzer';
    return 'Web Browser • TF Analyzer';
  }

  async function api(path, body, timeoutMs = 15000) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeout = setTimeout(() => { try { controller && controller.abort(); } catch (_) {} }, Math.max(3500, timeoutMs));
    try {
      const response = await fetch(API_BASE + path, {
        method: 'POST',
        cache: 'no-store',
        redirect: 'follow',
        signal: controller ? controller.signal : undefined,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(body || {}),
          deviceType: 'MOBILE',
          clientType: 'MOBILE',
          mobilePlatform: platformName(),
          mobileVersion: '1.0.106',
          remoteRevision: 'REV349',
          requestNonce: String(Date.now()) + '-' + Math.random().toString(36).slice(2)
        })
      });
      const text = await response.text();
      let result;
      try { result = JSON.parse(text); }
      catch (_) { throw new Error('Respons server bukan JSON.'); }
      if (!response.ok && !result.message) result.message = 'HTTP ' + response.status;
      return result;
    } finally {
      clearTimeout(timeout);
    }
  }

  function isTfStorageKey(key) {
    const k = String(key || '');
    return /^(tf|TF|__tf|__TF)/.test(k) || /tf[-_ ]?analy/i.test(k) || /tradersfamily/i.test(k);
  }

  async function clearPersistentAppData() {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
      for (const k of keys) if (isTfStorageKey(k)) localStorage.removeItem(k);
    } catch (_) {}
    try {
      const keys = [];
      for (let i = 0; i < sessionStorage.length; i++) keys.push(sessionStorage.key(i));
      for (const k of keys) if (isTfStorageKey(k)) sessionStorage.removeItem(k);
    } catch (_) {}
    try {
      if (indexedDB && typeof indexedDB.databases === 'function') {
        const list = await indexedDB.databases();
        for (const entry of list || []) {
          const name = String(entry && entry.name || '');
          if (name && (/tf[-_ ]?analy/i.test(name) || /^tf[-_]/i.test(name))) {
            try { indexedDB.deleteDatabase(name); } catch (_) {}
          }
        }
      } else {
        for (const name of ['tf-analyzer-mobile-device-v1','tf-analyzer-mobile-v1','tfAnalyzerMobile','tf_analyzer_mobile']) {
          try { indexedDB.deleteDatabase(name); } catch (_) {}
        }
      }
    } catch (_) {}
    // CacheStorage here contains only TF Analyzer static assets. Clearing it on a fresh launch
    // prevents stale app state/assets from carrying over; the active page can still run normally.
    try {
      if (window.caches) {
        const names = await caches.keys();
        await Promise.all((names || []).map(name => caches.delete(name)));
      }
    } catch (_) {}
  }

  function createGate() {
    let root = document.getElementById('tf-mobile-license-gate');
    if (root) return root;
    root = document.createElement('div');
    root.id = 'tf-mobile-license-gate';
    root.innerHTML = `<div class="tf-license-card">
      <div class="tf-license-brand"><img src="icon32.png" alt="TF"><div><div class="tf-license-kicker">TF Analyzer Analyst</div><h1>Aktivasi</h1></div></div>
      <p class="tf-license-copy">Masukkan <b>Email + Token Lisensi</b>. Token selalu diperiksa ke server <b>sebelum dashboard dibuka</b>. Demi keamanan, login dan data aplikasi tidak disimpan untuk pemakaian berikutnya.</p>
      <div id="tf-license-status" class="tf-license-status">Memeriksa kesiapan aplikasi…</div>
      <form id="tf-license-form" class="tf-license-form">
        <label>Email</label><input id="tf-license-email" type="email" autocomplete="off" placeholder="nama@email.com" required>
        <label>Token Lisensi</label><div class="tf-license-token-wrap"><input id="tf-license-token" type="password" autocomplete="off" placeholder="TFA-XXXX-XXXX-XXXX-XXXX" required><button id="tf-license-toggle" type="button" class="tf-license-mini">Lihat</button></div>
        <button id="tf-license-submit" class="tf-license-primary" type="submit">Aktivasi</button>
      </form>
      <div class="tf-license-note">Jika lisensi dihapus, diblokir, dinonaktifkan, token berubah, atau masa berlaku habis saat aplikasi sedang digunakan, aplikasi akan otomatis keluar dan kembali ke halaman Aktivasi.</div>
    </div>`;
    document.body.appendChild(root);
    return root;
  }

  function setStatus(message, kind = '') {
    const el = document.getElementById('tf-license-status');
    if (!el) return;
    el.textContent = String(message || '');
    el.className = 'tf-license-status' + (kind ? ' ' + kind : '');
  }

  function setBusy(value) {
    busy = !!value;
    const button = document.getElementById('tf-license-submit');
    if (button) {
      button.disabled = busy;
      button.textContent = busy ? 'Memverifikasi…' : 'Aktivasi';
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Gagal memuat ' + src));
      document.body.appendChild(script);
    });
  }

  function exposeEphemeralAuth() {
    if (!activeCredentials || !activeState) {
      try { delete window.__TF_MOBILE_AUTH_V349; } catch (_) { window.__TF_MOBILE_AUTH_V349 = null; }
      return;
    }
    window.__TF_MOBILE_AUTH_V349 = {
      email: activeCredentials.email,
      token: activeCredentials.token,
      licenseId: activeState.licenseId || activeState.license || '',
      sessionToken: activeState.sessionToken || '',
      state: activeState
    };
  }

  async function startApp() {
    if (appStarted) return;
    appStarted = true;
    exposeEphemeralAuth();
    document.documentElement.setAttribute('data-tf-server-authorized', '1');
    document.documentElement.setAttribute('data-tf-license', 'valid');
    const root = document.getElementById('tf-mobile-license-gate');
    if (root) root.classList.add('tf-license-leaving');
    try {
      for (const src of APP_SCRIPTS) await loadScript(src);
      if (!window.__TF_MOBILE_DASHBOARD_DOM_READY_V32) {
        window.__TF_MOBILE_DASHBOARD_DOM_READY_V32 = true;
        try { document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true })); }
        catch (_) { try { document.dispatchEvent(new Event('DOMContentLoaded')); } catch (__) {} }
      }
      if (root) root.remove();
      startLicenseWatch();
      setTimeout(() => {
        try { if (typeof window.tfMobileRecoverRenderV31 === 'function') window.tfMobileRecoverRenderV31('token-gate-rev349'); } catch (_) {}
      }, 400);
    } catch (error) {
      appStarted = false;
      if (root) root.classList.remove('tf-license-leaving');
      setStatus(error.message || String(error), 'error');
    }
  }

  async function login(email, token) {
    if (busy) return false;
    email = cleanEmail(email);
    token = normalizeToken(token);
    if (!email || !token) {
      setStatus('Email dan token wajib diisi.', 'error');
      return false;
    }
    setBusy(true);
    setStatus('Memverifikasi token ke server…');
    try {
      const result = await api('/mobile/login', { email, token });
      if (!(result && result.valid === true && result.sessionValid === true && result.sessionToken)) {
        const code = String(result && (result.code || result.error) || 'MOBILE_LOGIN_FAILED');
        const message = String(result && (result.message || result.code || result.error) || 'Aktivasi gagal.');
        setStatus(`[${code}] ${message}`, 'error');
        return false;
      }
      activeCredentials = { email, token };
      activeState = { ...result, valid: true, checkedAt: Date.now() };
      exposeEphemeralAuth();
      setStatus('Token valid. Membuka TF Analyzer…', 'success');
      setTimeout(() => void startApp(), 120);
      return true;
    } catch (error) {
      setStatus(error && error.name === 'AbortError' ? 'Server aktivasi timeout.' : (error.message || String(error)), 'error');
      return false;
    } finally {
      setBusy(false);
    }
  }

  function explicitInvalid(result) {
    return !!result && result.valid !== true && result.ok !== true;
  }

  async function hardKick(result) {
    if (kicked) return;
    kicked = true;
    stopLicenseWatch();
    document.documentElement.removeAttribute('data-tf-server-authorized');
    document.documentElement.setAttribute('data-tf-license', 'locked');
    try { if (typeof window.tfMobileRemoteShutdown === 'function') await window.tfMobileRemoteShutdown('license-revoked'); } catch (_) {}
    try {
      if (activeCredentials) {
        await api('/mobile/logout', {
          email: activeCredentials.email,
          token: activeCredentials.token,
          licenseId: activeState && (activeState.licenseId || activeState.license) || '',
          sessionToken: activeState && activeState.sessionToken || ''
        }, 5000);
      }
    } catch (_) {}
    activeCredentials = null;
    activeState = null;
    exposeEphemeralAuth();
    await clearPersistentAppData();
    try {
      sessionStorage.setItem('__tf_revoke_message_once', String(result && (result.message || result.code) || 'Lisensi tidak valid lagi.'));
    } catch (_) {}
    location.reload();
  }

  async function validateLiveLicense() {
    if (watchBusy || kicked || !activeCredentials) return;
    watchBusy = true;
    try {
      const result = await api('/license-check', {
        email: activeCredentials.email,
        token: activeCredentials.token
      }, 8000);
      if (result && result.valid === true) {
        if (activeState) activeState = { ...activeState, ...result, valid: true, checkedAt: Date.now() };
        exposeEphemeralAuth();
        return;
      }
      // A JSON response with valid!==true is an explicit server decision. Network failures throw
      // and are deliberately not treated as revocation so temporary outages do not log everyone out.
      if (result && result.valid !== true) await hardKick(result);
    } catch (_) {
      // Keep current in-memory session during a temporary network/server failure and retry soon.
    } finally {
      watchBusy = false;
    }
  }

  function startLicenseWatch() {
    stopLicenseWatch();
    watchTimer = setInterval(() => { if (!document.hidden) void validateLiveLicense(); }, LICENSE_WATCH_MS);
    setTimeout(() => void validateLiveLicense(), 350);
  }

  function stopLicenseWatch() {
    if (watchTimer) clearInterval(watchTimer);
    watchTimer = null;
  }

  async function logout({ ask = true } = {}) {
    if (ask && !window.confirm('Log out TF Analyzer? Aplikasi akan kembali ke halaman Aktivasi dan seluruh data sesi lokal dibersihkan.')) return;
    stopLicenseWatch();
    try { if (typeof window.tfMobileRemoteShutdown === 'function') await window.tfMobileRemoteShutdown('logout'); } catch (_) {}
    try {
      if (activeCredentials) {
        await api('/mobile/logout', {
          email: activeCredentials.email,
          token: activeCredentials.token,
          licenseId: activeState && (activeState.licenseId || activeState.license) || '',
          sessionToken: activeState && activeState.sessionToken || ''
        }, 5000);
      }
    } catch (_) {}
    activeCredentials = null;
    activeState = null;
    exposeEphemeralAuth();
    await clearPersistentAppData();
    location.reload();
  }

  window.tfMobileLogout = logout;
  window.tfMobileValidateLicenseNow = () => validateLiveLicense();

  function bindUi() {
    document.getElementById('tf-license-form')?.addEventListener('submit', event => {
      event.preventDefault();
      void login(document.getElementById('tf-license-email')?.value || '', document.getElementById('tf-license-token')?.value || '');
    });
    document.getElementById('tf-license-toggle')?.addEventListener('click', () => {
      const input = document.getElementById('tf-license-token');
      const button = document.getElementById('tf-license-toggle');
      if (!input || !button) return;
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      button.textContent = showing ? 'Lihat' : 'Sembunyi';
    });
  }

  async function boot() {
    // Strict fresh-start policy: purge all persisted TF Analyzer state before rendering anything.
    await clearPersistentAppData();
    activeCredentials = null;
    activeState = null;
    exposeEphemeralAuth();
    createGate();
    bindUi();
    let revokedMessage = '';
    try {
      revokedMessage = sessionStorage.getItem('__tf_revoke_message_once') || '';
      sessionStorage.removeItem('__tf_revoke_message_once');
    } catch (_) {}
    setStatus(revokedMessage ? ('Lisensi dicabut: ' + revokedMessage + ' Silakan aktivasi kembali.') : 'Masukkan email dan token untuk aktivasi TF Analyzer.', revokedMessage ? 'error' : '');
  }

  // Best effort cleanup when a browser/PWA page is actually closed/reloaded.
  window.addEventListener('pagehide', () => {
    stopLicenseWatch();
    activeCredentials = null;
    activeState = null;
    exposeEphemeralAuth();
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
      for (const k of keys) if (isTfStorageKey(k)) localStorage.removeItem(k);
    } catch (_) {}
  });
  window.addEventListener('online', () => { if (appStarted) void validateLiveLicense(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && appStarted) void validateLiveLicense(); });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => void boot(), { once: true });
  else void boot();
})();
