(() => {
  'use strict';

  const API_BASE = 'https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const LICENSE_WATCH_MS = 60000;
  // Keep the REV351 key so users who already activated on v1.16.67 migrate automatically.
  const AUTH_KEY = 'tfMobileRememberedLicenseV351';
  const APP_SCRIPTS = [
    'mobile-chrome-shim.js?rev=367',
    'assets/dashboard-mobile.js?rev=367',
    'mobile-data-bridge.js?rev=367',
    'mobile-app-shell.js?rev=367',
    'mobile-remote.js?rev=367'
  ];

  let appStarted = false;
  let busy = false;
  let watchBusy = false;
  let silentRefreshBusy = false;
  let watchTimer = null;
  let expiryTimer = null;
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
    return token.replace(/[\u200B-\u200D\u2060\uFEFF\u202A-\u202E\u2066-\u2069]/g, '')
      .replace(/[\u2010-\u2015\u2212\uFE58\uFE63\uFF0D]/g, '-')
      .replace(/\s+/g, '').trim();
  }

  function platformName() {
    const ua = navigator.userAgent || '';
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iPhone/iPad • PWA';
    if (/Android/i.test(ua)) return 'Android • TF Analyzer';
    return 'Web Browser • TF Analyzer';
  }

  async function api(path, body, timeoutMs = 15000) {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timeout = setTimeout(() => {
      try { controller && controller.abort(); } catch (_) {}
    }, Math.max(3500, timeoutMs));

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
          mobileVersion: '1.0.110',
          remoteRevision: 'REV368',
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
      for (const k of keys) {
        if (isTfStorageKey(k) && k !== AUTH_KEY && k !== 'tf_android_required_update_v1' && k !== 'tf_android_update_last_check_v1') {
          localStorage.removeItem(k);
        }
      }
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
        for (const name of ['tf-analyzer-mobile-device-v1', 'tf-analyzer-mobile-v1', 'tfAnalyzerMobile', 'tf_analyzer_mobile']) {
          try { indexedDB.deleteDatabase(name); } catch (_) {}
        }
      }
    } catch (_) {}

    try {
      if (window.caches) {
        const names = await caches.keys();
        await Promise.all((names || []).map(name => caches.delete(name)));
      }
    } catch (_) {}
  }

  function readRememberedAuthorization() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const email = cleanEmail(data && data.email);
      const token = normalizeToken(data && data.token);
      if (!email || !token) return null;
      return {
        email,
        token,
        licenseId: String(data && (data.licenseId || data.license) || ''),
        sessionToken: String(data && data.sessionToken || ''),
        lastValidAt: Number(data && (data.lastValidAt || data.savedAt) || 0) || 0
      };
    } catch (_) {
      return null;
    }
  }

  function rememberAuthorization(email, token, state) {
    try {
      email = cleanEmail(email);
      token = normalizeToken(token);
      if (!email || !token) return;

      const previous = readRememberedAuthorization() || {};
      const nextState = state || {};
      const licenseId = String(nextState.licenseId || nextState.license || previous.licenseId || '');
      const sessionToken = String(nextState.sessionToken || previous.sessionToken || '');

      localStorage.setItem(AUTH_KEY, JSON.stringify({
        email,
        token,
        licenseId,
        sessionToken,
        lastValidAt: Date.now(),
        schema: 352
      }));
    } catch (_) {}
  }

  function forgetCredentials() {
    try { localStorage.removeItem(AUTH_KEY); } catch (_) {}
  }

  function createActivationGate() {
    let root = document.getElementById('tf-mobile-license-gate');
    if (root) root.remove();

    root = document.createElement('div');
    root.id = 'tf-mobile-license-gate';
    root.innerHTML = `<div class="tf-license-card">
      <div class="tf-license-brand"><img src="icon32.png" alt="TF"><div><div class="tf-license-kicker">TF Analyzer Analyst</div><h1>Aktivasi</h1></div></div>
      <p class="tf-license-copy">Aktivasi hanya diperlukan <b>satu kali</b>. Masukkan <b>Email + Token Lisensi</b>. Setelah berhasil, aplikasi akan mengingat aktivasi ini dan pembukaan berikutnya hanya menampilkan loading screen.</p>
      <div id="tf-license-status" class="tf-license-status">Menyiapkan aktivasi…</div>
      <form id="tf-license-form" class="tf-license-form">
        <label>Email</label><input id="tf-license-email" type="email" autocomplete="off" placeholder="nama@email.com" required>
        <label>Token Lisensi</label><div class="tf-license-token-wrap"><input id="tf-license-token" type="password" autocomplete="off" placeholder="TFA-XXXX-XXXX-XXXX-XXXX" required><button id="tf-license-toggle" type="button" class="tf-license-mini">Lihat</button></div>
        <button id="tf-license-submit" class="tf-license-primary" type="submit">Aktivasi</button>
      </form>
      <div class="tf-license-note">Status lisensi tetap diperiksa selama aplikasi digunakan. Lisensi yang benar-benar expired, blocked, revoked, inactive, atau tokennya tidak valid akan ditutup otomatis.</div>
    </div>`;
    document.body.appendChild(root);
    return root;
  }

  function createLoadingGate() {
    let root = document.getElementById('tf-mobile-license-gate');
    if (root) root.remove();

    root = document.createElement('div');
    root.id = 'tf-mobile-license-gate';
    root.className = 'tf-license-loading-only';
    root.innerHTML = `<div class="tf-license-loading-card" role="status" aria-live="polite">
      <div class="tf-license-loading-logo"><img src="icon32.png" alt="TF Analyzer Analyst"></div>
      <div class="tf-license-spinner" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="tf-license-loading-title">TF Analyzer Analyst</div>
      <div id="tf-license-status" class="tf-license-loading-status">Memuat aplikasi…</div>
    </div>`;
    document.body.appendChild(root);
    return root;
  }

  function setStatus(message, kind = '') {
    const el = document.getElementById('tf-license-status');
    if (!el) return;
    el.textContent = String(message || '');
    if (el.classList.contains('tf-license-loading-status')) return;
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
      try { delete window.__TF_MOBILE_AUTH_V349; }
      catch (_) { window.__TF_MOBILE_AUTH_V349 = null; }
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

  async function startApp(source = 'activation') {
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
        catch (_) {
          try { document.dispatchEvent(new Event('DOMContentLoaded')); } catch (__) {}
        }
      }

      if (root) root.remove();
      startLicenseWatch();

      setTimeout(() => {
        try {
          if (typeof window.tfMobileRecoverRenderV31 === 'function') {
            window.tfMobileRecoverRenderV31('token-gate-rev352-' + source);
          }
        } catch (_) {}
      }, 400);
    } catch (error) {
      appStarted = false;
      if (root) root.classList.remove('tf-license-leaving');
      setStatus(error.message || String(error), 'error');
    }
  }

  function isExplicitDenial(result) {
    return !!(result && (result.valid === false || result.sessionValid === false));
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
      if (!(result && result.valid === true && result.sessionValid !== false)) {
        const code = String(result && (result.code || result.error) || 'MOBILE_LOGIN_FAILED');
        const message = String(result && (result.message || result.code || result.error) || 'Aktivasi gagal.');
        forgetCredentials();
        setStatus(`[${code}] ${message}`, 'error');
        return false;
      }

      activeCredentials = { email, token };
      activeState = { ...result, valid: true, checkedAt: Date.now(), cached: false };
      armExactExpiry(activeState);
      rememberAuthorization(email, token, activeState);
      exposeEphemeralAuth();
      setStatus('Token valid. Membuka TF Analyzer…', 'success');
      setTimeout(() => void startApp('first-activation'), 120);
      return true;
    } catch (error) {
      setStatus(error && error.name === 'AbortError' ? 'Server aktivasi timeout.' : (error.message || String(error)), 'error');
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function silentRefreshRememberedAuthorization() {
    if (silentRefreshBusy || kicked || !activeCredentials) return false;
    silentRefreshBusy = true;

    try {
      const result = await api('/mobile/login', {
        email: activeCredentials.email,
        token: activeCredentials.token
      }, 8000);

      if (result && result.valid === true && result.sessionValid !== false) {
        activeState = { ...(activeState || {}), ...result, valid: true, checkedAt: Date.now(), cached: false };
        armExactExpiry(activeState);
        rememberAuthorization(activeCredentials.email, activeCredentials.token, activeState);
        exposeEphemeralAuth();
        try {
          window.dispatchEvent(new CustomEvent('tf-mobile-auth-refreshed', { detail: { valid: true } }));
        } catch (_) {}
        return true;
      }

      if (isExplicitDenial(result)) {
        await hardKick(result);
      }
    } catch (_) {
      // REV352: a timeout/offline server is not an activation failure for a previously confirmed device.
      // The dashboard remains usable and the live checker retries silently later.
    } finally {
      silentRefreshBusy = false;
    }
    return false;
  }

  function stopExpiryTimer() {
    if (expiryTimer) clearTimeout(expiryTimer);
    expiryTimer = null;
  }

  function armExactExpiry(state) {
    stopExpiryTimer();
    if (!state || state.valid !== true || state.isPermanent === true || !state.expiresAt) return;
    const exp = Date.parse(String(state.expiresAt));
    if (!Number.isFinite(exp) || exp <= 0) return;
    const check = () => {
      const remaining = exp - Date.now();
      if (remaining <= 0) {
        void hardKick({ valid:false, code:'LICENSE_EXPIRED', message:'Masa berlaku lisensi telah berakhir.', expiresAt:state.expiresAt });
        return;
      }
      expiryTimer = setTimeout(check, Math.min(remaining, 24 * 60 * 60 * 1000));
    };
    check();
  }

  async function hardKick(result) {
    if (kicked) return;
    kicked = true;
    stopLicenseWatch();
    document.documentElement.removeAttribute('data-tf-server-authorized');
    document.documentElement.setAttribute('data-tf-license', 'locked');

    try {
      if (typeof window.tfMobileRemoteShutdown === 'function') {
        await window.tfMobileRemoteShutdown('license-revoked');
      }
    } catch (_) {}

    forgetCredentials();
    activeCredentials = null;
    activeState = null;
    exposeEphemeralAuth();
    await clearPersistentAppData();
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

      if (result && result.valid === true && result.sessionValid !== false) {
        activeState = { ...(activeState || {}), ...result, valid: true, checkedAt: Date.now() };
        armExactExpiry(activeState);
        rememberAuthorization(activeCredentials.email, activeCredentials.token, activeState);
        exposeEphemeralAuth();
        return;
      }

      if (isExplicitDenial(result)) await hardKick(result);
    } catch (_) {
      // Temporary network/server failure is retried and never revokes a previously confirmed authorization.
    } finally {
      watchBusy = false;
    }
  }

  function startLicenseWatch() {
    stopLicenseWatch();
    armExactExpiry(activeState);
    watchTimer = setInterval(() => {
      if (!document.hidden) void validateLiveLicense();
    }, LICENSE_WATCH_MS);

    // Give the remembered-session refresh time to run first and avoid duplicate requests during boot.
    setTimeout(() => void validateLiveLicense(), 4500);
  }

  function stopLicenseWatch() {
    if (watchTimer) clearInterval(watchTimer);
    watchTimer = null;
    stopExpiryTimer();
  }

  async function logout({ ask = true } = {}) {
    if (ask && !window.confirm('Log out TF Analyzer? Aplikasi akan kembali ke halaman Aktivasi dan seluruh data sesi lokal dibersihkan.')) return;
    stopLicenseWatch();
    try {
      if (typeof window.tfMobileRemoteShutdown === 'function') {
        await window.tfMobileRemoteShutdown('logout');
      }
    } catch (_) {}
    forgetCredentials();
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
      void login(
        document.getElementById('tf-license-email')?.value || '',
        document.getElementById('tf-license-token')?.value || ''
      );
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
    // Read before cleanPersistentAppData; AUTH_KEY is intentionally preserved during cleanup.
    const remembered = readRememberedAuthorization();
    await clearPersistentAppData();

    activeCredentials = null;
    activeState = null;
    exposeEphemeralAuth();

    if (remembered && remembered.email && remembered.token) {
      // REV352: subsequent launch never renders the activation form.
      createLoadingGate();
      setStatus('Memuat aktivasi tersimpan…');

      activeCredentials = { email: remembered.email, token: remembered.token };
      activeState = {
        valid: true,
        licenseId: remembered.licenseId || '',
        sessionToken: remembered.sessionToken || '',
        checkedAt: remembered.lastValidAt || 0,
        cached: true,
        restoredBy: 'REV368'
      };
      exposeEphemeralAuth();

      // Open the dashboard from the last server-confirmed activation immediately.
      // Server/session validation is refreshed silently in the background and never blocks boot on timeout.
      setTimeout(() => void startApp('remembered'), 180);
      setTimeout(() => void silentRefreshRememberedAuthorization(), 700);
      return;
    }

    // Only a truly fresh install / logged-out / explicitly revoked device sees the activation page.
    createActivationGate();
    bindUi();
    setStatus('Aktivasi pertama: masukkan Email dan Token lisensi.');
  }

  window.addEventListener('pagehide', () => {
    stopLicenseWatch();
    activeCredentials = null;
    activeState = null;
    exposeEphemeralAuth();
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
      for (const k of keys) {
        if (isTfStorageKey(k) && k !== AUTH_KEY && k !== 'tf_android_required_update_v1' && k !== 'tf_android_update_last_check_v1') {
          localStorage.removeItem(k);
        }
      }
    } catch (_) {}
  });

  window.addEventListener('online', () => {
    if (appStarted) {
      void silentRefreshRememberedAuthorization();
      void validateLiveLicense();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && appStarted) void validateLiveLicense();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => void boot(), { once: true });
  } else {
    void boot();
  }
})();
