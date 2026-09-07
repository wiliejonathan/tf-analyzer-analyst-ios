(function(){
  'use strict';

  var CURRENT_TAG = 'v1.16.82';
  var API_URL = 'https://api.github.com/repos/wiliejonathan/Apk-android/releases/latest';
  var CACHE_KEY = 'tf_android_required_update_v1';
  var CHECK_KEY = 'tf_android_update_last_check_v1';
  var CHECK_EVERY_MS = 5 * 60 * 1000;
  var state = { checking:false, locked:false, latest:null };

  function hasNativeUpdater(){
    try {
      return !!(window.AndroidUpdate && typeof window.AndroidUpdate.downloadAndInstall === 'function');
    } catch (_) { return false; }
  }

  function nums(tag){
    var m=String(tag||'').match(/(\d+)\.(\d+)\.(\d+)/);
    return m ? [Number(m[1]),Number(m[2]),Number(m[3])] : [0,0,0];
  }
  function newer(a,b){
    var A=nums(a), B=nums(b);
    for(var i=0;i<3;i++){
      if(A[i]>B[i]) return true;
      if(A[i]<B[i]) return false;
    }
    return false;
  }
  function apkAsset(release){
    var list = release && Array.isArray(release.assets) ? release.assets : [];
    var apks = list.filter(function(x){
      return x && /\.apk$/i.test(String(x.name||'')) && x.browser_download_url;
    });
    apks.sort(function(a,b){
      return new Date(b.updated_at||b.created_at||0) - new Date(a.updated_at||a.created_at||0);
    });
    return apks[0] || null;
  }

  async function fetchLatestApkInfo(){
    var res=await fetch(API_URL+'?t='+Date.now(),{
      cache:'no-store',
      headers:{
        'Accept':'application/vnd.github+json',
        'Cache-Control':'no-cache'
      }
    });
    if(!res.ok) throw new Error('GitHub API HTTP '+res.status);
    var release=await res.json();
    var tag=String(release.tag_name||'').trim();
    var asset=apkAsset(release);
    if(!tag) throw new Error('Tag release terbaru tidak ditemukan.');
    if(!asset) throw new Error('Asset APK tidak ditemukan pada release '+tag+'.');
    return {
      tag:tag,
      url:String(asset.browser_download_url||''),
      name:String(asset.name||'TF.Analyzer.Analyst.update.apk'),
      releaseUrl:String(release.html_url||'')
    };
  }

  function saveRequired(info){ try{ localStorage.setItem(CACHE_KEY, JSON.stringify(info)); }catch(_){ } }
  function loadRequired(){
    try{ var raw=localStorage.getItem(CACHE_KEY); return raw ? JSON.parse(raw) : null; }
    catch(_){ return null; }
  }
  function clearRequired(){ try{ localStorage.removeItem(CACHE_KEY); }catch(_){ } }

  function setStatus(text){ var e=document.getElementById('tf-force-update-status'); if(e) e.textContent=String(text||''); }
  function setButton(enabled,label){
    var b=document.getElementById('tf-force-update-btn');
    if(!b) return;
    b.disabled=!enabled;
    if(label) b.textContent=label;
  }

  function overlay(){
    var el=document.getElementById('tf-force-update-overlay');
    if(el) return el;
    el=document.createElement('div');
    el.id='tf-force-update-overlay';
    el.innerHTML=''
      +'<div class="tf-force-update-card">'
      +'<div class="tf-force-update-icon">↻</div>'
      +'<div class="tf-force-update-title">Update Wajib Tersedia</div>'
      +'<div class="tf-force-update-copy">Versi aplikasi ini sudah tidak dapat digunakan karena versi terbaru TF Analyzer Analyst sudah tersedia.</div>'
      +'<div class="tf-force-update-version"><span>Versi sekarang</span><b id="tf-force-current">'+CURRENT_TAG+'</b></div>'
      +'<div class="tf-force-update-version"><span>Versi terbaru</span><b id="tf-force-latest">-</b></div>'
      +'<button type="button" id="tf-force-update-btn">DOWNLOAD & INSTALL UPDATE</button>'
      +'<div id="tf-force-update-status">Tekan tombol di atas untuk memperbarui aplikasi.</div>'
      +'<div class="tf-force-update-note">Tombol akan membaca release terbaru langsung dari GitHub, mengunduh asset .apk terbaru, lalu membuka Android Installer otomatis setelah download selesai.</div>'
      +'</div>';
    document.documentElement.appendChild(el);
    var style=document.createElement('style');
    style.id='tf-force-update-style';
    style.textContent=''
      +'#tf-force-update-overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(2,6,23,.98);display:none;align-items:center;justify-content:center;padding:22px;font-family:Arial,sans-serif;color:#f8fafc;box-sizing:border-box;pointer-events:auto}'
      +'#tf-force-update-overlay.show{display:flex}'
      +'.tf-force-update-card{width:min(430px,100%);background:#0f172a;border:1px solid #334155;border-radius:20px;padding:24px;box-shadow:0 24px 70px rgba(0,0,0,.55);text-align:center}'
      +'.tf-force-update-icon{width:62px;height:62px;border-radius:18px;background:#166534;margin:0 auto 14px;display:grid;place-items:center;font-size:36px;font-weight:700}'
      +'.tf-force-update-title{font-size:22px;font-weight:800;margin-bottom:10px}'
      +'.tf-force-update-copy{font-size:14px;line-height:1.55;color:#cbd5e1;margin-bottom:18px}'
      +'.tf-force-update-version{display:flex;justify-content:space-between;gap:16px;padding:10px 12px;background:#020617;border-radius:11px;margin:8px 0;font-size:13px}'
      +'.tf-force-update-version span{color:#94a3b8}.tf-force-update-version b{color:#fff}'
      +'#tf-force-update-btn{width:100%;margin-top:18px;border:0;border-radius:12px;padding:14px 16px;background:#16a34a;color:white;font-weight:800;font-size:14px;cursor:pointer;touch-action:manipulation;-webkit-tap-highlight-color:transparent}'
      +'#tf-force-update-btn:disabled{opacity:.62;cursor:default}'
      +'#tf-force-update-status{min-height:20px;margin-top:12px;font-size:13px;color:#bbf7d0}'
      +'.tf-force-update-note{margin-top:12px;font-size:11px;line-height:1.45;color:#94a3b8}'
      +'html.tf-force-update-locked body>*{pointer-events:none!important;user-select:none!important}'
      +'html.tf-force-update-locked #tf-force-update-overlay,html.tf-force-update-locked #tf-force-update-overlay *{pointer-events:auto!important;user-select:auto!important}';
    document.head.appendChild(style);

    /* REV350 IMPORTANT: do NOT stop click/touch propagation in capture phase on the overlay.
       The old capture listener stopped the event before it ever reached the update button. */
    var btn=el.querySelector('#tf-force-update-btn');
    btn.addEventListener('click',async function(e){
      e.preventDefault();
      e.stopPropagation();
      if(btn.disabled) return;
      btn.disabled=true;
      btn.textContent='MEMBACA RELEASE TERBARU…';
      setStatus('Mengecek release APK terbaru langsung dari GitHub…');
      try{
        if(!hasNativeUpdater()) throw new Error('Native Android updater tidak tersedia.');
        var info=await fetchLatestApkInfo();
        state.latest=info;
        var latest=document.getElementById('tf-force-latest');
        if(latest) latest.textContent=info.tag;
        saveRequired(info);
        btn.textContent='MEMULAI DOWNLOAD…';
        setStatus('Release '+info.tag+' ditemukan. Memulai download '+info.name+'…');
        window.AndroidUpdate.downloadAndInstall(info.url, info.name);
      }catch(err){
        btn.disabled=false;
        btn.textContent='COBA DOWNLOAD LAGI';
        setStatus((err&&err.message) ? err.message : 'Gagal membaca release terbaru. Periksa koneksi lalu coba lagi.');
      }
    },false);
    return el;
  }

  function lock(info){
    if(!info || !info.tag || !newer(info.tag,CURRENT_TAG)) return false;
    state.latest=info;
    state.locked=true;
    saveRequired(info);
    var el=overlay();
    var latest=document.getElementById('tf-force-latest');
    if(latest) latest.textContent=info.tag;
    document.documentElement.classList.add('tf-force-update-locked');
    el.classList.add('show');
    setButton(true,'DOWNLOAD & INSTALL UPDATE');
    setStatus('Update wajib. Aplikasi lama dikunci sampai versi terbaru diinstal.');
    try{ window.scrollTo(0,0); }catch(_){ }
    return true;
  }

  async function check(force){
    if(!hasNativeUpdater() || state.checking) return;
    var cached=loadRequired();
    if(cached && newer(cached.tag,CURRENT_TAG)) lock(cached);
    else if(cached && !newer(cached.tag,CURRENT_TAG)) clearRequired();

    var now=Date.now();
    try{
      var last=Number(localStorage.getItem(CHECK_KEY)||0);
      if(!force && !state.locked && last && now-last<CHECK_EVERY_MS) return;
    }catch(_){ }

    state.checking=true;
    try{
      var info=await fetchLatestApkInfo();
      try{ localStorage.setItem(CHECK_KEY,String(now)); }catch(_){ }
      if(info.tag && newer(info.tag,CURRENT_TAG)){
        lock(info);
      } else if(info.tag && !newer(info.tag,CURRENT_TAG)) {
        clearRequired();
      }
    }catch(err){
      if(state.locked) setStatus('Update tetap wajib. Sambungkan internet lalu tekan tombol Update.');
    }finally{
      state.checking=false;
    }
  }

  window.addEventListener('tf-native-update-started',function(){
    setButton(false,'MENGUNDUH UPDATE…');
    setStatus('Download berjalan. Setelah selesai installer Android akan terbuka otomatis.');
  });
  window.addEventListener('tf-native-update-needs-permission',function(){
    setButton(false,'MENUNGGU IZIN…');
    setStatus('Download selesai. Izinkan “Install unknown apps”, lalu kembali ke TF Analyzer Analyst. Installer akan dilanjutkan otomatis.');
  });
  window.addEventListener('tf-native-update-installer-opened',function(){
    setButton(true,'BUKA INSTALLER LAGI');
    setStatus('Installer Android sudah dibuka. Pilih Update / Install untuk melanjutkan.');
  });
  window.addEventListener('tf-native-update-failed',function(e){
    setButton(true,'COBA DOWNLOAD LAGI');
    setStatus((e && e.detail && e.detail.message) || 'Download gagal. Periksa koneksi lalu coba lagi.');
  });

  function boot(){
    if(!hasNativeUpdater()) return;
    check(true);
    setInterval(function(){ check(false); },CHECK_EVERY_MS);
    document.addEventListener('visibilitychange',function(){ if(!document.hidden) check(true); });
    window.addEventListener('online',function(){ check(true); });
    window.addEventListener('focus',function(){ check(false); });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
