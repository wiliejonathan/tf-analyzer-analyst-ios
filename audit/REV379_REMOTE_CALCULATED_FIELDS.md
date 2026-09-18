# REV379 Remote Calculated Fields

## assets/tf-remote-sidebar-agent.js

### snapshot @ 2860
~~~js

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
  // REV268: direct peer-to-peer WebRTC data channel. WebSocket remains the
  // signaling plane and deterministic fallback; HTTP is recovery only.
  let directPc=null,directDc=null,directReady=false,directPeerToken=0,directPendingCandidates=[];
  // REV269: no global Remote queue. A long Scan/Login must never block STOP,
  // Refresh, Pair, row delete, or any other unrelated control.
  const realtimeLaneQueues=new Map();
  const realtimeInflight=new Map();
  const realtimeRecentResults=new Map();
  function commandLaneKey(action,payload){
    const a=String(action||'').toLowerCase(),p=payload&&typeof payload==='object'?payload:{};
    if(a==='set_analysts'||/analyst/.test(a))return 'row:'+(String(p.rowKey||'')||String(Number(p.index)||0));
    if(/^import_bundle_/.test(a)||/^export_bundle_/.test(a))return 'transfer:'+(String(p.transferId||'default'));
    if(a==='set_time_range')return 'time-range';
    if(a==='set_scan_pair'||a==='set_all_analyst_pairs')return 'pairs-global';
    if(a==='set_remember_links')return 'remember';
    if(a==='update'||a==='batch_toggle')return 'scan-control';
    if(a==='refresh')return 'navigation';
    if(a==='open_dashboard')return 'dashboard';
    if(a==='scan_from_isignal'||a==='scan_channel')return 'scan-launch';
    if(a==='remote_login')return 'login';
    return 'action:'+a;
  }
  function runRealtimeLane(key,fn){
    const prev=realtimeLaneQueues.get(key)||Promise.resolve();
    const next=prev.catch(()=>{}).then(fn);
    realtimeLaneQueues.set(key,next);
    next.finally(()=>{if(realtimeLaneQueues.get(key)===next)realtimeLaneQueues.delete(key);}).catch(()=>{});
    return next;
  }
  function rememberRealtimeResult(id,result){
    if(!id)return;realtimeRecentResults.set(id,{at:Date.now(),result});
    if(realtimeRecentResults.size>120){for(const [k,v] of realtimeRecentResults){if(Date.now()-v.at>120000||realtimeRecentResults.size>100)realtimeRecentResults.delete(k);else break;}}
  }
  const EXPORT_TRANSFER_CACHE = new Map();
  // REV352: Drive relay failures such as an undeployed Apps Script route (HTTP 404)
  // are an expected compatibility condition, not an extension error. Cache the
  // unavailability briefly and go straight to the proven legacy chunk transport.
  let driveRelayUnavailableUntilV352=0;
  function driveRelayAvailableV352(){return Date.now()>=driveRelayUnavailableUntilV352;}
  function noteDriveRelayFailureV352(error){
    const message=String(error&&error.message||error||'');
    const hard404=/Apps Script HTTP 404|\bHTTP\s*404\b|not found/i.test(message);
    driveRelayUnavailableUntilV352=Date.now()+(hard404?30*60*1000:30*1000);
  }


  const MIRROR_PRESTAGE_KEY_V292='tfRemoteMirrorDriveStageV292';
  let MIRROR_PRESTAGE_V292=null;
  const IMPORT_COMPLETED_CACHE = new Map();

  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

  function storageGet(keys){
    return new Promise(resolve => {
      try { chrome.storage.local.get(keys, r => { try{void chrome.runtime.lastError;}catch(_){} resolve(r || {}); }); }
      catch(_) { resolve({}); }
    });
  }


  function storageSet(values){
    return new Promise(resolve => {
      try { chrome.storage.local.set(values, () => { try{void chrome.runtime.lastError;}catch(_){} resolve(); }); }
      catch(_) { resolve(); }
    });
  }

  function storageRemove(keys){
    return new Promise(resolve => {
      try { chrome.storage.local.remove(keys, () => { try{void chrome.runtime.lastError;}catch(_){} resolve(); }); }
      catch(_) { resolve(); }
    });
  }

  function isVisible(el){
    if(!el || !el.isConnected) return false;
    try{
      const s = getComputedStyle(el);
      return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity || 1) !== 0 && el.getClientRects().length > 0;
    }catch(_){ return false; }
  }


  // REV269 STRICT ROW IDENTITY.
  // Legacy sidebar markup may contain 16/28 mounted template rows that can look
  // "visible" for a frame during re-render. Visibility is therefore NEVER used
  // as row authority. A real Link Analis row is only:
  //   1) the first base row,
  //   2) a row containing a real URL, or
  //   3) a row carrying a Mobile-assigned stable tfRemoteRowKey.
  // This makes a bogus DOM count mathematically incapable of creating ghost rows.
  function analystRowUrlValue(row){
    return cleanText(row&&row.querySelector&&row.querySelector('.analyst-link-input')&&row.querySelector('.analyst-link-input').value||'',520);
  }
  function analystRowRemoteKey(row){
    return cleanText(row&&row.dataset&&row.dataset.tfRemoteRowKey||'',120);
  }
  function effectiveAnalystRows(container,limit=28){
    if(!container)return [];
    const all=Array.from(container.querySelectorAll('.analyst-row')).filter(r=>r&&r.isConnected);
    if(!all.length)return [];
    const strict=all.filter((row,index)=>index===0||!!analystRowUrlValue(row)||!!analystRowRemoteKey(row));
    return strict.slice(0,Math.max(1,Math.min(28,Number(limit)||28)));
  }

  function cleanText(v, max=1200){
    return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim().slice(0,max);
  }

  function textOf(id, max=1200){
    const el = document.getElementById(id);
    if(!el) return '';
    let v = '';
    try { v = typeof el.innerText === 'string' ? el.innerText : el.textContent; } catch(_) { v = el.textContent || ''; }
    return cleanText(v, max);
  }

  function firstVisible(ids){
    for(const id of ids){
      const el = document.getElementById(id);
      if(isVisible(el)) return el;
    }
    for(const id of ids){
      const el = document.getElementById(id);
      if(el) return el;
    }
    return null;
  }

 
~~~

### snapshot @ 10961
~~~js
row,index)=>index===0||!!analystRowUrlValue(row)||!!analystRowRemoteKey(row));
    return strict.slice(0,Math.max(1,Math.min(28,Number(limit)||28)));
  }

  function cleanText(v, max=1200){
    return String(v == null ? '' : v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim().slice(0,max);
  }

  function textOf(id, max=1200){
    const el = document.getElementById(id);
    if(!el) return '';
    let v = '';
    try { v = typeof el.innerText === 'string' ? el.innerText : el.textContent; } catch(_) { v = el.textContent || ''; }
    return cleanText(v, max);
  }

  function firstVisible(ids){
    for(const id of ids){
      const el = document.getElementById(id);
      if(isVisible(el)) return el;
    }
    for(const id of ids){
      const el = document.getElementById(id);
      if(el) return el;
    }
    return null;
  }

  function visibleContainer(){
    // REV249: iSignal is a sub-view that can coexist with a visible main container.
    // Always give the active iSignal view priority, otherwise Mobile Refresh can
    // incorrectly think it is already on main and skip the “← kembali” action.
    const pairs = [
      ['isignal','isignal-view'],
      ['login','login-container'],
      ['masuk','masuk-container'],
      ['main','main-container']
    ];
    for(const [key,id] of pairs){ if(isVisible(document.getElementById(id))) return key; }
    if(document.getElementById('main-container')) return 'main';
    return 'unknown';
  }

  function selectedValues(select){
    if(!select) return [ALL];
    const vals = Array.from(select.options || []).filter(o=>o.selected).map(o=>String(o.value||'')).filter(Boolean);
    if(!vals.length || vals.includes(ALL)) return [ALL];
    return vals;
  }

  function selectedScanPair(){
    const el = document.getElementById('scan-pair-select');
    if(!el) return 'ALL';
    return String(el.value || 'ALL').replace(/^__ALL__$/,'ALL');
  }

  function selectedAllPairs(view){
    const suffix = view === 'isignal' ? 'isignal' : view === 'masuk' ? 'masuk' : 'main';
    const el = document.getElementById('tf-allpairs-select-' + suffix) || document.getElementById('tf-allpairs-select-main');
    return selectedValues(el);
  }

  function isImportLockedUrl(url){
    if(!importLockEngagedCache||!url)return false;
    const u=String(url||'').trim();if(!u)return false;
    return importLockedSigsCache.some(sig=>String(sig||'').startsWith(u+'::'));
  }

  function analystSnapshot(containerId, limit=28){
    const container = document.getElementById(containerId);
    if(!container) return [];
    const sourceNameByUrl = Object.create(null);
    try{
      const sourceMap = window.analystSourcesByName && typeof window.analystSourcesByName==='object' ? window.analystSourcesByName : null;
      if(sourceMap) Object.keys(sourceMap).forEach(n=>{const it=sourceMap[n]||{};const u=String(it.url||it.link||'').trim();if(u)sourceNameByUrl[u]=n;});
    }catch(_){}
    return effectiveAnalystRows(container,limit).map((row,index)=>{
      const input = row.querySelector('.analyst-link-input');
      const nameEl = row.querySelector('.analyst-name-btn,.analyst-name,.analyst-label,.analyst-paste-btn');
      const select = row.querySelector('.analyst-pair-select');
      const pairs = selectedValues(select);
      const url=cleanText(input && input.value || '',520);
      const pairChecks=Array.from(row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]'));
      const pairLocked=!!((pairChecks.length && pairChecks.every(cb=>!!cb.disabled))||isImportLockedUrl(url));
      const isIsignalContainer=containerId==='isignal-links-container';
      const source=pairLocked?'import':(isIsignalContainer?'isignal':'manual');
      const resolvedName=url&&scanResolvedNamesByUrlCache[url]?cleanText(scanResolvedNamesByUrlCache[url],80):'';
      const manualBlocked=(source==='manual'&&url&&manualUnresolvedUrls.has(url));
      const nameReady=!!(pairLocked||isIsignalContainer||(resolvedName&&!manualBlocked));
      let name=cleanText(nameEl && nameEl.textContent || '',80);
      // REV256: manual links must stay generic before an actual batch result
      // resolves the analyst name. Do not leak stale remembered/name-cache labels.
      if(source==='manual'&&(!resolvedName||manualBlocked)){
        name='';
      }else if(source==='manual'&&resolvedName){
        name=resolvedName;
      }else if(!name || /^(paste|nama|analis\s*\d+)$/i.test(name)){
        try{
          const remoteMap=window.__tfRemoteAnalystNamesByUrlV237||{};
          if(url && remoteMap[url]) name=cleanText(remoteMap[url],80);
          if((!name || /^(paste|nama|analis\s*\d+)$/i.test(name)) && url && sourceNameByUrl[url]) name=cleanText(sourceNameByUrl[url],80);
          if((!name || /^(paste|nama|analis\s*\d+)$/i.test(name)) && typeof window.tf_getStableAnalystNameForUrl==='function') name=cleanText(window.tf_getStableAnalystNameForUrl(url),80);
        }catch(_){}
      }
      const rowKey=cleanText(row.dataset&&row.dataset.tfRemoteRowKey||'',120);
      // Empty rows are still real PC rows. Mobile must mirror the physical PC
      // state instead of inventing a local draft or dropping an empty row.
      return {no:index+1,name,url,pairs,pairLocked,source,nameReady,rowKey,rowExists:true,pcRowReady:true};
    });
  }

  function buttonSnapshot(id){
    const el = document.getElementById(id);
    if(!el) return {exists:false,visible:false,disabled:true,text:''};
    return {exists:true,visible:isVisible(el),disabled:!!el.disabled,text:cleanText(el.textContent,80)};
  }

  function logText(ids,max){
    const parts=[];
    for(const id of ids){
      const t=textOf(id,Math.floor(max/Math.max(1,ids.length)));
      if(t) parts.push(t);
    }
    return cleanText(parts.join('\n'),max);
  }

  function buildSnapshot(compact=false){
    const view = visibleContainer();
    const userName = textOf(view === 'masuk' ? 'masuk-user-name' : 'popup-user-name',100) || textOf('masuk-user-name',100) || textOf('user-name',100);
    const userEmail = textOf(view === 'masuk' ? 'masuk-user-email' : 'popup-user-email',140) || textOf('masuk-user-email',140) || textOf('user-email',140);
    const suffix = view === 'isignal' ? 'isignal' : view === 'masuk' ? 'masuk' : 'main';
    const timeRange = textOf('tf-time-range-paren-' + suffix,60) || 'ALL';
    const timeRangeValue = selectedTimeRangeCache || 'all_time';
    // REV260: while Mobile Remote is closed, keep only a compact CORE snapshot
    // in the relay cache. This makes the first Mobile open a small single read
    // instead of downloading logs/status text that are not needed to paint the UI.
    const statusRaw = view === 'isignal' ? textOf('isignal-status',1800) : textOf('status',1800) || textOf('login-status',1000);
    const status = compact ? cleanText(statusRaw,320) : statusRaw;
    const scanLog = compact ? '' : logText(['scan-channel-saved-list','scan-channel-status-list','scan-progress-overall','scan-progress-detail'],5200);
    const isignalScanLog = compact ? '' : logText(['scan-channel-saved-list-isignal','scan-channel-status-list-isignal','scan-progress-overall-isignal','scan-progress-detail-isignal'],5200);
    const powerLog = compact ? '' : logText(['tf-power-sleep-log'],3600);
    const batch = firstVisible(['batch-scan-btn','batch-scan-isignal-btn']);
    const remember = document.getElementById('remember-all-links-checkbox');
    let mainAnalysts=analystSnapshot('analyst-links-container');
    const mainAnalystContainer=document.getElementById('analyst-links-container');
    const analystRowCount=mainAnalystContainer?effectiveAnalystRows(mainAnalystContainer).length:0;
    const expectedUi=Math.min(28,Number(dataCountCache.remembered||0));
    // REV257: Remote opening must not wait for every sidebar row to finish a DOM
    // re-render. Remembered links/pairs are a fast, persistent fallback and are
    // replaced automatically by live DOM rows as soon as they exist.
    if(expectedUi>mainAnalysts.length && rememberedAnalystsCache.length){
      const byUrl=new Map(mainAnalysts.map(x=>[cleanText(x&&x.url||'',520),x]));
      for(const it of rememberedAnalystsCache){
        const u=cleanText(it&&it.url||'',520);if(!u||byUrl.has(u))continue;
        const locked=isImportLockedUrl(u);const unresolved=manualUnresolvedUrls.has(u);
        const x={no:byUrl.size+1,name:unresolved?'':cleanText(it&&it.name||'',80),url:u,pairs:normalizePairs(it&&it.pairs),pairLocked:locked,source:locked?'import':'manual',nameReady:!!locked};
        byUrl.set(u,x);
      }
      mainAnalysts=Array.from(byUrl.values()).slice(0,28).map((x,i)=>Object.assign({},x,{no:i+1}));
    }
    // REV260: core readiness no longer depends on the time-range DOM finishing a
    // legacy render. selectedTimeRangeCache + rememberedAnalystsCache are already
    // persistent authoritative fallbacks, so waiting for that DOM node only added
    // seconds of artificial 
~~~

### snapshot @ 14323
~~~js
(input && input.value || '',520);
      const pairChecks=Array.from(row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]'));
      const pairLocked=!!((pairChecks.length && pairChecks.every(cb=>!!cb.disabled))||isImportLockedUrl(url));
      const isIsignalContainer=containerId==='isignal-links-container';
      const source=pairLocked?'import':(isIsignalContainer?'isignal':'manual');
      const resolvedName=url&&scanResolvedNamesByUrlCache[url]?cleanText(scanResolvedNamesByUrlCache[url],80):'';
      const manualBlocked=(source==='manual'&&url&&manualUnresolvedUrls.has(url));
      const nameReady=!!(pairLocked||isIsignalContainer||(resolvedName&&!manualBlocked));
      let name=cleanText(nameEl && nameEl.textContent || '',80);
      // REV256: manual links must stay generic before an actual batch result
      // resolves the analyst name. Do not leak stale remembered/name-cache labels.
      if(source==='manual'&&(!resolvedName||manualBlocked)){
        name='';
      }else if(source==='manual'&&resolvedName){
        name=resolvedName;
      }else if(!name || /^(paste|nama|analis\s*\d+)$/i.test(name)){
        try{
          const remoteMap=window.__tfRemoteAnalystNamesByUrlV237||{};
          if(url && remoteMap[url]) name=cleanText(remoteMap[url],80);
          if((!name || /^(paste|nama|analis\s*\d+)$/i.test(name)) && url && sourceNameByUrl[url]) name=cleanText(sourceNameByUrl[url],80);
          if((!name || /^(paste|nama|analis\s*\d+)$/i.test(name)) && typeof window.tf_getStableAnalystNameForUrl==='function') name=cleanText(window.tf_getStableAnalystNameForUrl(url),80);
        }catch(_){}
      }
      const rowKey=cleanText(row.dataset&&row.dataset.tfRemoteRowKey||'',120);
      // Empty rows are still real PC rows. Mobile must mirror the physical PC
      // state instead of inventing a local draft or dropping an empty row.
      return {no:index+1,name,url,pairs,pairLocked,source,nameReady,rowKey,rowExists:true,pcRowReady:true};
    });
  }

  function buttonSnapshot(id){
    const el = document.getElementById(id);
    if(!el) return {exists:false,visible:false,disabled:true,text:''};
    return {exists:true,visible:isVisible(el),disabled:!!el.disabled,text:cleanText(el.textContent,80)};
  }

  function logText(ids,max){
    const parts=[];
    for(const id of ids){
      const t=textOf(id,Math.floor(max/Math.max(1,ids.length)));
      if(t) parts.push(t);
    }
    return cleanText(parts.join('\n'),max);
  }

  function buildSnapshot(compact=false){
    const view = visibleContainer();
    const userName = textOf(view === 'masuk' ? 'masuk-user-name' : 'popup-user-name',100) || textOf('masuk-user-name',100) || textOf('user-name',100);
    const userEmail = textOf(view === 'masuk' ? 'masuk-user-email' : 'popup-user-email',140) || textOf('masuk-user-email',140) || textOf('user-email',140);
    const suffix = view === 'isignal' ? 'isignal' : view === 'masuk' ? 'masuk' : 'main';
    const timeRange = textOf('tf-time-range-paren-' + suffix,60) || 'ALL';
    const timeRangeValue = selectedTimeRangeCache || 'all_time';
    // REV260: while Mobile Remote is closed, keep only a compact CORE snapshot
    // in the relay cache. This makes the first Mobile open a small single read
    // instead of downloading logs/status text that are not needed to paint the UI.
    const statusRaw = view === 'isignal' ? textOf('isignal-status',1800) : textOf('status',1800) || textOf('login-status',1000);
    const status = compact ? cleanText(statusRaw,320) : statusRaw;
    const scanLog = compact ? '' : logText(['scan-channel-saved-list','scan-channel-status-list','scan-progress-overall','scan-progress-detail'],5200);
    const isignalScanLog = compact ? '' : logText(['scan-channel-saved-list-isignal','scan-channel-status-list-isignal','scan-progress-overall-isignal','scan-progress-detail-isignal'],5200);
    const powerLog = compact ? '' : logText(['tf-power-sleep-log'],3600);
    const batch = firstVisible(['batch-scan-btn','batch-scan-isignal-btn']);
    const remember = document.getElementById('remember-all-links-checkbox');
    let mainAnalysts=analystSnapshot('analyst-links-container');
    const mainAnalystContainer=document.getElementById('analyst-links-container');
    const analystRowCount=mainAnalystContainer?effectiveAnalystRows(mainAnalystContainer).length:0;
    const expectedUi=Math.min(28,Number(dataCountCache.remembered||0));
    // REV257: Remote opening must not wait for every sidebar row to finish a DOM
    // re-render. Remembered links/pairs are a fast, persistent fallback and are
    // replaced automatically by live DOM rows as soon as they exist.
    if(expectedUi>mainAnalysts.length && rememberedAnalystsCache.length){
      const byUrl=new Map(mainAnalysts.map(x=>[cleanText(x&&x.url||'',520),x]));
      for(const it of rememberedAnalystsCache){
        const u=cleanText(it&&it.url||'',520);if(!u||byUrl.has(u))continue;
        const locked=isImportLockedUrl(u);const unresolved=manualUnresolvedUrls.has(u);
        const x={no:byUrl.size+1,name:unresolved?'':cleanText(it&&it.name||'',80),url:u,pairs:normalizePairs(it&&it.pairs),pairLocked:locked,source:locked?'import':'manual',nameReady:!!locked};
        byUrl.set(u,x);
      }
      mainAnalysts=Array.from(byUrl.values()).slice(0,28).map((x,i)=>Object.assign({},x,{no:i+1}));
    }
    // REV260: core readiness no longer depends on the time-range DOM finishing a
    // legacy render. selectedTimeRangeCache + rememberedAnalystsCache are already
    // persistent authoritative fallbacks, so waiting for that DOM node only added
    // seconds of artificial loading on Mobile.
    const analystCoreReady=(expectedUi===0||mainAnalysts.length>=expectedUi||rememberedAnalystsCache.length>=expectedUi);
    const coreReady=!!selectedTimeRangeCache && analystCoreReady && view!=='unknown';
    const snapshotReady=coreReady;
    const strongViewLogin=(view==='masuk'||view==='main'||view==='isignal');
    const strongViewLogout=(view==='login');
    // Explicit storage logout/offline evidence wins over a stale main container.
    const loggedOut=strongViewLogout || !!loginStateCache.loggedOut;
    const loggedIn=!loggedOut && (strongViewLogin || !!loginStateCache.loggedIn);
    return {
      sidebarOpen:true,
      executorReady:true,
      executorHeartbeatAt:Date.now(),
      remoteProtocol:'REV279-STICKY-SIDEBAR-EXECUTOR',
      view,
      userName,
      userEmail,
      userAvatar: String(userAvatarCache||'').trim(),
      login:{state:loggedIn?'online':loggedOut?'logout':String(loginStateCache.state||'unknown'),loggedIn:!!loggedIn,loggedOut:!!loggedOut,error:cleanText(loginStateCache.error||'',300)},
      timeRange,
      timeRangeValue,
      coreReady,
      snapshotReady,
      snapshotMode:compact?'core':'live',
      scanPair:selectedScanPair(),
      allAnalystPairs:selectedAllPairs(view),
      batchButton:batch ? cleanText(batch.textContent,90) : '',
      rememberAllLinks:!!(remember && remember.checked),
      status,
      scanLog,
      isignalScanLog,
      power:{
        badge:textOf('tf-power-sleep-badge',80),
        summary:textOf('tf-power-sleep-summary',400),
        log:powerLog
      },
      analysts:mainAnalysts,
      // Includes empty rows, so Mobile can preserve exactly the same row order
      // before a Link or Pair has been entered.
      analystRowCount,
      analystRowCountMode:'strict-rowid-rev272',
      isignalAnalysts:analystSnapshot('isignal-links-container'),
      hasImportData:hasImportDataCache,
      dataFingerprint:dataFingerprintCache,
      dataCounts:dataCountCache,
      progress:(()=>{
        const raw=cleanText([textOf('scan-progress-overall',1200),textOf('scan-progress-overall-isignal',1200),textOf('scan-progress-detail',1200),textOf('scan-progress-detail-isignal',1200)].filter(Boolean).join(' '),2600);
        let pct=0;const ms=Array.from(raw.matchAll(/(\d{1,3})\s*%/g)).map(m=>Number(m[1])).filter(n=>Number.isFinite(n));if(ms.length)pct=Math.max(...ms);
        const batchText=batch ? cleanText(batch.textContent,90) : '';
        const updateBtn=firstVisible(['tf-btn-update-main','tf-btn-update-masuk','tf-btn-update-isignal']);
        const updateText=updateBtn?cleanText(updateBtn.textContent,90):'';
        const batchStop=/stop|stopping/i.test(batchText),updateStop=/stop|stopping/i.test(updateText);
        const active=batchStop||updateStop||(/\b(\d+)\s*\/\s*(\d+)\b/.test(raw)&&pct<100);
        const frac=raw.match(/\b(\d+)\s*\/\s*(\d+)\b/);if(!ms.length&&frac&&Number(frac[2])>0)pct=Math.round(Number(frac[1])*100/Number(frac[2]));
        const source=batchStop?'submit':updateStop?'update':'';
        return {active:!!active,percent:Math.max(0,Math.min(100,pct||0)),text:raw.slice(0,260)||batchText||updateText,source};
      })(),
      controls:{
        update:buttonSnapshot('tf-btn-update-main'),
        refresh:buttonSnapshot('tf-btn-refresh-main'),
        submit:batch ? {text:cleanText(batch.t
~~~

### snapshot @ 17698
~~~js
signal' ? textOf('isignal-status',1800) : textOf('status',1800) || textOf('login-status',1000);
    const status = compact ? cleanText(statusRaw,320) : statusRaw;
    const scanLog = compact ? '' : logText(['scan-channel-saved-list','scan-channel-status-list','scan-progress-overall','scan-progress-detail'],5200);
    const isignalScanLog = compact ? '' : logText(['scan-channel-saved-list-isignal','scan-channel-status-list-isignal','scan-progress-overall-isignal','scan-progress-detail-isignal'],5200);
    const powerLog = compact ? '' : logText(['tf-power-sleep-log'],3600);
    const batch = firstVisible(['batch-scan-btn','batch-scan-isignal-btn']);
    const remember = document.getElementById('remember-all-links-checkbox');
    let mainAnalysts=analystSnapshot('analyst-links-container');
    const mainAnalystContainer=document.getElementById('analyst-links-container');
    const analystRowCount=mainAnalystContainer?effectiveAnalystRows(mainAnalystContainer).length:0;
    const expectedUi=Math.min(28,Number(dataCountCache.remembered||0));
    // REV257: Remote opening must not wait for every sidebar row to finish a DOM
    // re-render. Remembered links/pairs are a fast, persistent fallback and are
    // replaced automatically by live DOM rows as soon as they exist.
    if(expectedUi>mainAnalysts.length && rememberedAnalystsCache.length){
      const byUrl=new Map(mainAnalysts.map(x=>[cleanText(x&&x.url||'',520),x]));
      for(const it of rememberedAnalystsCache){
        const u=cleanText(it&&it.url||'',520);if(!u||byUrl.has(u))continue;
        const locked=isImportLockedUrl(u);const unresolved=manualUnresolvedUrls.has(u);
        const x={no:byUrl.size+1,name:unresolved?'':cleanText(it&&it.name||'',80),url:u,pairs:normalizePairs(it&&it.pairs),pairLocked:locked,source:locked?'import':'manual',nameReady:!!locked};
        byUrl.set(u,x);
      }
      mainAnalysts=Array.from(byUrl.values()).slice(0,28).map((x,i)=>Object.assign({},x,{no:i+1}));
    }
    // REV260: core readiness no longer depends on the time-range DOM finishing a
    // legacy render. selectedTimeRangeCache + rememberedAnalystsCache are already
    // persistent authoritative fallbacks, so waiting for that DOM node only added
    // seconds of artificial loading on Mobile.
    const analystCoreReady=(expectedUi===0||mainAnalysts.length>=expectedUi||rememberedAnalystsCache.length>=expectedUi);
    const coreReady=!!selectedTimeRangeCache && analystCoreReady && view!=='unknown';
    const snapshotReady=coreReady;
    const strongViewLogin=(view==='masuk'||view==='main'||view==='isignal');
    const strongViewLogout=(view==='login');
    // Explicit storage logout/offline evidence wins over a stale main container.
    const loggedOut=strongViewLogout || !!loginStateCache.loggedOut;
    const loggedIn=!loggedOut && (strongViewLogin || !!loginStateCache.loggedIn);
    return {
      sidebarOpen:true,
      executorReady:true,
      executorHeartbeatAt:Date.now(),
      remoteProtocol:'REV279-STICKY-SIDEBAR-EXECUTOR',
      view,
      userName,
      userEmail,
      userAvatar: String(userAvatarCache||'').trim(),
      login:{state:loggedIn?'online':loggedOut?'logout':String(loginStateCache.state||'unknown'),loggedIn:!!loggedIn,loggedOut:!!loggedOut,error:cleanText(loginStateCache.error||'',300)},
      timeRange,
      timeRangeValue,
      coreReady,
      snapshotReady,
      snapshotMode:compact?'core':'live',
      scanPair:selectedScanPair(),
      allAnalystPairs:selectedAllPairs(view),
      batchButton:batch ? cleanText(batch.textContent,90) : '',
      rememberAllLinks:!!(remember && remember.checked),
      status,
      scanLog,
      isignalScanLog,
      power:{
        badge:textOf('tf-power-sleep-badge',80),
        summary:textOf('tf-power-sleep-summary',400),
        log:powerLog
      },
      analysts:mainAnalysts,
      // Includes empty rows, so Mobile can preserve exactly the same row order
      // before a Link or Pair has been entered.
      analystRowCount,
      analystRowCountMode:'strict-rowid-rev272',
      isignalAnalysts:analystSnapshot('isignal-links-container'),
      hasImportData:hasImportDataCache,
      dataFingerprint:dataFingerprintCache,
      dataCounts:dataCountCache,
      progress:(()=>{
        const raw=cleanText([textOf('scan-progress-overall',1200),textOf('scan-progress-overall-isignal',1200),textOf('scan-progress-detail',1200),textOf('scan-progress-detail-isignal',1200)].filter(Boolean).join(' '),2600);
        let pct=0;const ms=Array.from(raw.matchAll(/(\d{1,3})\s*%/g)).map(m=>Number(m[1])).filter(n=>Number.isFinite(n));if(ms.length)pct=Math.max(...ms);
        const batchText=batch ? cleanText(batch.textContent,90) : '';
        const updateBtn=firstVisible(['tf-btn-update-main','tf-btn-update-masuk','tf-btn-update-isignal']);
        const updateText=updateBtn?cleanText(updateBtn.textContent,90):'';
        const batchStop=/stop|stopping/i.test(batchText),updateStop=/stop|stopping/i.test(updateText);
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
      const storageLoggedOut=explicitLogout;
      loginStateCache={state:storageLoggedIn?'online':storageLoggedOut?'logout':(accountState||rootState||'unknown'),loggedIn:storageLoggedIn,loggedOut:storageLoggedOut,error:String(d.tfLoginError||'')};
      importLockEngagedCache=!!d.tfImportLockEngaged;importLockedSigsCache=Array.isArray(d.tfImportLockedSigs)?d.
~~~

### snapshot @ 20744
~~~js
,
      userName,
      userEmail,
      userAvatar: String(userAvatarCache||'').trim(),
      login:{state:loggedIn?'online':loggedOut?'logout':String(loginStateCache.state||'unknown'),loggedIn:!!loggedIn,loggedOut:!!loggedOut,error:cleanText(loginStateCache.error||'',300)},
      timeRange,
      timeRangeValue,
      coreReady,
      snapshotReady,
      snapshotMode:compact?'core':'live',
      scanPair:selectedScanPair(),
      allAnalystPairs:selectedAllPairs(view),
      batchButton:batch ? cleanText(batch.textContent,90) : '',
      rememberAllLinks:!!(remember && remember.checked),
      status,
      scanLog,
      isignalScanLog,
      power:{
        badge:textOf('tf-power-sleep-badge',80),
        summary:textOf('tf-power-sleep-summary',400),
        log:powerLog
      },
      analysts:mainAnalysts,
      // Includes empty rows, so Mobile can preserve exactly the same row order
      // before a Link or Pair has been entered.
      analystRowCount,
      analystRowCountMode:'strict-rowid-rev272',
      isignalAnalysts:analystSnapshot('isignal-links-container'),
      hasImportData:hasImportDataCache,
      dataFingerprint:dataFingerprintCache,
      dataCounts:dataCountCache,
      progress:(()=>{
        const raw=cleanText([textOf('scan-progress-overall',1200),textOf('scan-progress-overall-isignal',1200),textOf('scan-progress-detail',1200),textOf('scan-progress-detail-isignal',1200)].filter(Boolean).join(' '),2600);
        let pct=0;const ms=Array.from(raw.matchAll(/(\d{1,3})\s*%/g)).map(m=>Number(m[1])).filter(n=>Number.isFinite(n));if(ms.length)pct=Math.max(...ms);
        const batchText=batch ? cleanText(batch.textContent,90) : '';
        const updateBtn=firstVisible(['tf-btn-update-main','tf-btn-update-masuk','tf-btn-update-isignal']);
        const updateText=updateBtn?cleanText(updateBtn.textContent,90):'';
        const batchStop=/stop|stopping/i.test(batchText),updateStop=/stop|stopping/i.test(updateText);
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
      const storageLoggedOut=explicitLogout;
      loginStateCache={state:storageLoggedIn?'online':storageLoggedOut?'logout':(accountState||rootState||'unknown'),loggedIn:storageLoggedIn,loggedOut:storageLoggedOut,error:String(d.tfLoginError||'')};
      importLockEngagedCache=!!d.tfImportLockEngaged;importLockedSigsCache=Array.isArray(d.tfImportLockedSigs)?d.tfImportLockedSigs.map(String):[];
      dataFingerprintCache=[String(d.tfLastImportAt||meta.importedAt||meta.exportedAt||''),histCount,Object.keys(src).length,remembered.length].join('|');
      const byUrl=Object.create(null);
      const resolvedByUrl=Object.create(null);
      Object.keys(src).forEach(name=>{const it=src[name]||{};const u=String(it.url||it.link||'').trim();if(u){byUrl[u]=name;resolvedByUrl[u]=name;}});
      scanResolvedNamesByUrlCache=resolvedByUrl;
      const scanActive=!!d.tfScanInProgress;
      if(scanActive)sawBatchScanActive=true;
      else if(sawBatchScanActive){
        for(const u of Array.from(manualUnresolvedUrls)){if(resolvedByUrl[u])manualUnresolvedUrls.delete(u);}
        sawBatchScanActive=false;
      }
      Object.keys(cache).forEach(u=>{const n=String(cache[u]||'').trim();if(u&&n)byUrl[u]=n;});
      remembered.forEach(it=>{const u=String(it&&it.url||'').trim(),n=String(it&&(it.name||it.analystName)||'').trim();if(u&&n&&!/^analis\s*\d+$/i.test(n))byUrl[u]=n;});
      window.__tfRemoteAnalystNamesByUrlV237=byUrl;
    }catch(_){}
  }

  async function auth(){
    const st = await storageGet([CREDS_KEY,SESSION_KEY,STATE_KEY]);
    const c = st[CREDS_KEY] || {};
    const s = st[STATE_KEY] || {};
    const sessionToken = String(st[SESSION_KEY] || '').trim();
    if(!c.email || !c.token || !sessionToken || s.valid !== true) return null;
    return {email:c.email,token:c.token,licenseId:s.licenseId || s.license || '',sessionToken};
  }

  async function api(path, body, timeoutOverrideMs){
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const t = setTimeout(()=>{try{ctl&&ctl.abort();}catch(_){}},Math.max(3000,Number(timeoutOverrideMs)||REQUEST_TIMEOUT_MS));
    try{
      const r = await fetch(API + path, {
        method:'POST',cache:'no-store',signal:ctl?ctl.signal:undefined,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...body,deviceType:'DESKTOP',clientType:'DESKTOP',extensionId:chrome.runtime.id,remoteRevision:'REV352'})
      });
      const text = await r.text();
      let data;
      try{data=JSON.parse(text);}catch(_){throw new Error('Respons Remote bukan JSON.');}
      if(data && data.valid === false) throw new Error(data.message || data.code || 'Remote tidak tersedia.');
      return data || {};
    }catch(e){
      if(e && (e.name === 'AbortError' || /aborted/i.test(String(e.message||'')))){
        const x=new Error('Remote server belum merespons. Sinkronisasi akan dicoba lagi otomatis.');
        x.code='REMOTE_TIMEOUT';
        throw x;
      }
      throw e;
    }finally{clearTimeout(t);}
  }


  // REV272: transport is owned by the extension Service Worker + Offscreen WebRTC.
  // The sidebar is only the DOM executor/state producer; closing/reloading it no
  // longer tears down the realtime socket itself.
  function coreSend(route,value){try{chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_SEND',route,message:value},()=>{try{void chrome.runtime.lastError;}catc
~~~

### snapshot @ 27986
~~~js
t[SESSION_KEY] || '').trim();
    if(!c.email || !c.token || !sessionToken || s.valid !== true) return null;
    return {email:c.email,token:c.token,licenseId:s.licenseId || s.license || '',sessionToken};
  }

  async function api(path, body, timeoutOverrideMs){
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const t = setTimeout(()=>{try{ctl&&ctl.abort();}catch(_){}},Math.max(3000,Number(timeoutOverrideMs)||REQUEST_TIMEOUT_MS));
    try{
      const r = await fetch(API + path, {
        method:'POST',cache:'no-store',signal:ctl?ctl.signal:undefined,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...body,deviceType:'DESKTOP',clientType:'DESKTOP',extensionId:chrome.runtime.id,remoteRevision:'REV352'})
      });
      const text = await r.text();
      let data;
      try{data=JSON.parse(text);}catch(_){throw new Error('Respons Remote bukan JSON.');}
      if(data && data.valid === false) throw new Error(data.message || data.code || 'Remote tidak tersedia.');
      return data || {};
    }catch(e){
      if(e && (e.name === 'AbortError' || /aborted/i.test(String(e.message||'')))){
        const x=new Error('Remote server belum merespons. Sinkronisasi akan dicoba lagi otomatis.');
        x.code='REMOTE_TIMEOUT';
        throw x;
      }
      throw e;
    }finally{clearTimeout(t);}
  }


  // REV272: transport is owned by the extension Service Worker + Offscreen WebRTC.
  // The sidebar is only the DOM executor/state producer; closing/reloading it no
  // longer tears down the realtime socket itself.
  function coreSend(route,value){try{chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_SEND',route,message:value},()=>{try{void chrome.runtime.lastError;}catch(_){}});return true;}catch(_){return false;}}
  function fastSocketOpen(){return !!browserCoreWsReady;}
  function fastSend(value){return coreSend('ws',value);}
  function relaySocketOpen(){return !!browserCoreWsReady;}
  function relaySend(value){return coreSend('ws',value);}
  function directSocketOpen(){return !!browserCoreDirectReady;}
  function directSend(value){return coreSend('direct',value);}
  function closeDirectPeer(){browserCoreDirectReady=false;browserCoreMode='connecting';browserCoreRtt=0;}
  function emitRealtimeStateEvent(event,payload){const msg={type:'state_event',event:String(event||''),payload:payload&&typeof payload==='object'?payload:{},at:Date.now()};if(!directSend(msg))relaySend(msg);}
  function sendDirectSnapshot(){if(!directSocketOpen())return false;try{const manifest=chrome.runtime.getManifest?chrome.runtime.getManifest():{};return directSend({type:'desktop_snapshot',snapshot:buildSnapshot(false),extensionVersion:String(manifest.version_name||manifest.version||'REV279'),at:Date.now()});}catch(_){return false;}}
  function sendCommandStarted(clientCommandId,action,transport){const msg={type:'command_started',clientCommandId:String(clientCommandId||'').slice(0,100),action:String(action||'').slice(0,80),transport,startedAt:Date.now()};return transport==='direct'?directSend(msg):relaySend(msg);}
  function sendRealtimeCommandResult(clientCommandId,result,transport){const msg={type:'command_result',clientCommandId:String(clientCommandId||'').slice(0,100),result:result||{ok:false,message:'Realtime result kosong.'},finishedAt:Date.now()};return transport==='direct'?directSend(msg):relaySend(msg);}
  async function executeRealtimeCommand(msg,transport){
    if(!remoteAvailabilityEnabled){const blocked=cleanText(msg&&msg.clientCommandId||'',100);sendRealtimeCommandResult(blocked,{ok:false,code:'REMOTE_DISABLED',message:'Remote PC sedang OFF. Aktifkan toggle Remote di sidebar PC.'},transport);return;}
    const clientCommandId=cleanText(msg&&msg.clientCommandId||'',100),action=cleanText(msg&&msg.action||'',80),payload=msg&&msg.payload&&typeof msg.payload==='object'?msg.payload:{};
    if(!clientCommandId||!action){sendRealtimeCommandResult(clientCommandId,{ok:false,code:'REMOTE_REALTIME_BAD_COMMAND',message:'Realtime command tidak valid.'},transport);return;}
    const cached=realtimeRecentResults.get(clientCommandId);if(cached&&Date.now()-cached.at<120000){sendRealtimeCommandResult(clientCommandId,cached.result,transport);transport==='direct'?sendDirectSnapshot():queueFastSnapshot(5);return;}
    const running=realtimeInflight.get(clientCommandId);if(running){running.then(r=>sendRealtimeCommandResult(clientCommandId,r,transport)).catch(()=>{});return;}
    sendCommandStarted(clientCommandId,action,transport);
    const lane=commandLaneKey(action,payload);
    const task=runRealtimeLane(lane,async()=>{remoteApplying=true;let result;try{result=await execute({id:transport+':'+clientCommandId,action,payload:{...payload,clientCommandId}});}catch(e){result={ok:false,message:e&&e.message?e.message:String(e)};}finally{remoteApplying=false;}result=result||{ok:false,message:'Tidak ada hasil command.'};rememberRealtimeResult(clientCommandId,result);const execRecord={[LAST_EXEC_KEY]:{id:transport+':'+clientCommandId,clientCommandId,result,at:Date.now(),acked:true,transport}};
      // REV286: Refresh/Reset intentionally clears extension storage. Do not
      // block the realtime command_result on storageSet, otherwise the reset can
      // erase the ACK record while it is being written and Mobile waits forever.
      if(action==='refresh'){try{void storageSet(execRecord).catch(()=>{});}catch(_){ }}else{try{await storageSet(execRecord);}catch(_){ }}
      if(result&&result.ok!==false&&(result.action==='remove_analyst'||action==='remove_analyst'||(action==='set_analysts'&&String(payload.mode||'')==='remove'))){emitRealtimeStateEvent('ROW_DELETED',{index:Number(result.index),rowKey:String(result.rowKey||payload.rowKey||''),url:String(payload.url||''),rowCount:Number(result.rowCount||0),analysts:Array.isArray(result.analysts)?result.analysts:[]});}
      transport==='direct'?sendDirectSnapshot():queueFastSnapshot(3);queueImmediateSync(15);return result;});
    realtimeInflight.set(clientCommandId,task);try{const result=await task;sendRealtimeCommandResult(clientCommandId,result,transport);}finally{if(realtimeInflight.get(clientCommandId)===task)realtimeInflight.delete(clientCommandId);}
  }
  function closeFastLane(){/* Service Worker owns transport; sidebar unload must not close it. */}
  function scheduleFastReconnect(){try{chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_RECONNECT'},()=>{try{void chrome.runtime.lastError;}catch(_){}});}catch(_){}}
  async function connectFastLane(){try{chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_STATUS_QUERY'},s=>{try{void chrome.runtime.lastError;}catch(_){}if(s&&s.ok){remoteAvailabilityEnabled=s.remoteEnabled===true;remoteAvailabilityLoaded=true;browserCoreWsReady=remoteAvailabilityEnabled&&s.wsReady===true;browserCoreDirectReady=remoteAvailabilityEnabled&&s.directReady===true;browserCoreMode=String(s.directMode||(remoteAvailabilityEnabled?'connecting':'off'));browserCoreRtt=Number(s.directRtt||0);browserCoreConnectionState=String(s.connectionState||'');browserCoreLastError=String(s.lastError||'');renderRemoteMobileStatus(Object.prototype.hasOwnProperty.call(s,'mobileRemoteOnline')?!!s.mobileRemoteOnline:!!s.mobileOnline);if(browserCoreWsReady)queueFastSnapshot(5);}});}catch(_){}}
  function sendFastSnapshot(){if(!relaySocketOpen())return false;try{const manifest=chrome.runtime.getManifest?chrome.runtime.getManifest():{};return relaySend({type:'desktop_snapshot',snapshot:buildSnapshot(false),extensionVersion:String(manifest.version_name||manifest.version||'REV279'),at:Date.now()});}catch(_){return false;}}
  function queueFastSnapshot(delay=50){if(fastSnapshotTimer)clearTimeout(fastSnapshotTimer);fastSnapshotTimer=setTimeout(()=>{fastSnapshotTimer=null;sendFastSnapshot();},Math.max(5,delay));}
  function sendFastCommandResult(clientCommandId,result){return relaySend({type:'command_result',clientCommandId:String(clientCommandId||'').slice(0,100),result:result||{ok:false,message:'Fast Lane result kosong.'},finishedAt:Date.now()});}
  function handleCoreInbound(route,msg){if(!msg||typeof msg!=='object'||!remoteAvailabilityEnabled)return;if(msg.type==='presence'){const live=Object.prototype.hasOwnProperty.call(msg,'mobileRemoteOnline')?!!msg.mobileRemoteOnline:!!msg.mobileOnline;renderRemoteMobileStatus(live);if(live)queueFastSnapshot(5);return;}if(msg.type==='command'){void executeRealtimeCommand(msg,route==='direct'?'direct':'fast');return;}if(msg.type==='snapshot_request'){route==='direct'?sendDirectSnapshot():queueFastSnapshot(3);return;}}
  try{
    chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{if(!message||typeof message!=='object')return;if(message.type==='TF_REMOTE_CORE_STATUS'){remoteAvailabilityEnabled=message.remoteEnabled===true;remoteAvailabilityLoaded=true;browserCoreWsReady=remoteAvailabilityEnabled&&message.wsReady===true;browserCoreDirectReady=remoteAvailabilityEnabled&&message.directReady===true;if(browserCoreWsReady||
~~~

### snapshot @ 31413
~~~js
uteRealtimeCommand(msg,transport){
    if(!remoteAvailabilityEnabled){const blocked=cleanText(msg&&msg.clientCommandId||'',100);sendRealtimeCommandResult(blocked,{ok:false,code:'REMOTE_DISABLED',message:'Remote PC sedang OFF. Aktifkan toggle Remote di sidebar PC.'},transport);return;}
    const clientCommandId=cleanText(msg&&msg.clientCommandId||'',100),action=cleanText(msg&&msg.action||'',80),payload=msg&&msg.payload&&typeof msg.payload==='object'?msg.payload:{};
    if(!clientCommandId||!action){sendRealtimeCommandResult(clientCommandId,{ok:false,code:'REMOTE_REALTIME_BAD_COMMAND',message:'Realtime command tidak valid.'},transport);return;}
    const cached=realtimeRecentResults.get(clientCommandId);if(cached&&Date.now()-cached.at<120000){sendRealtimeCommandResult(clientCommandId,cached.result,transport);transport==='direct'?sendDirectSnapshot():queueFastSnapshot(5);return;}
    const running=realtimeInflight.get(clientCommandId);if(running){running.then(r=>sendRealtimeCommandResult(clientCommandId,r,transport)).catch(()=>{});return;}
    sendCommandStarted(clientCommandId,action,transport);
    const lane=commandLaneKey(action,payload);
    const task=runRealtimeLane(lane,async()=>{remoteApplying=true;let result;try{result=await execute({id:transport+':'+clientCommandId,action,payload:{...payload,clientCommandId}});}catch(e){result={ok:false,message:e&&e.message?e.message:String(e)};}finally{remoteApplying=false;}result=result||{ok:false,message:'Tidak ada hasil command.'};rememberRealtimeResult(clientCommandId,result);const execRecord={[LAST_EXEC_KEY]:{id:transport+':'+clientCommandId,clientCommandId,result,at:Date.now(),acked:true,transport}};
      // REV286: Refresh/Reset intentionally clears extension storage. Do not
      // block the realtime command_result on storageSet, otherwise the reset can
      // erase the ACK record while it is being written and Mobile waits forever.
      if(action==='refresh'){try{void storageSet(execRecord).catch(()=>{});}catch(_){ }}else{try{await storageSet(execRecord);}catch(_){ }}
      if(result&&result.ok!==false&&(result.action==='remove_analyst'||action==='remove_analyst'||(action==='set_analysts'&&String(payload.mode||'')==='remove'))){emitRealtimeStateEvent('ROW_DELETED',{index:Number(result.index),rowKey:String(result.rowKey||payload.rowKey||''),url:String(payload.url||''),rowCount:Number(result.rowCount||0),analysts:Array.isArray(result.analysts)?result.analysts:[]});}
      transport==='direct'?sendDirectSnapshot():queueFastSnapshot(3);queueImmediateSync(15);return result;});
    realtimeInflight.set(clientCommandId,task);try{const result=await task;sendRealtimeCommandResult(clientCommandId,result,transport);}finally{if(realtimeInflight.get(clientCommandId)===task)realtimeInflight.delete(clientCommandId);}
  }
  function closeFastLane(){/* Service Worker owns transport; sidebar unload must not close it. */}
  function scheduleFastReconnect(){try{chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_RECONNECT'},()=>{try{void chrome.runtime.lastError;}catch(_){}});}catch(_){}}
  async function connectFastLane(){try{chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_STATUS_QUERY'},s=>{try{void chrome.runtime.lastError;}catch(_){}if(s&&s.ok){remoteAvailabilityEnabled=s.remoteEnabled===true;remoteAvailabilityLoaded=true;browserCoreWsReady=remoteAvailabilityEnabled&&s.wsReady===true;browserCoreDirectReady=remoteAvailabilityEnabled&&s.directReady===true;browserCoreMode=String(s.directMode||(remoteAvailabilityEnabled?'connecting':'off'));browserCoreRtt=Number(s.directRtt||0);browserCoreConnectionState=String(s.connectionState||'');browserCoreLastError=String(s.lastError||'');renderRemoteMobileStatus(Object.prototype.hasOwnProperty.call(s,'mobileRemoteOnline')?!!s.mobileRemoteOnline:!!s.mobileOnline);if(browserCoreWsReady)queueFastSnapshot(5);}});}catch(_){}}
  function sendFastSnapshot(){if(!relaySocketOpen())return false;try{const manifest=chrome.runtime.getManifest?chrome.runtime.getManifest():{};return relaySend({type:'desktop_snapshot',snapshot:buildSnapshot(false),extensionVersion:String(manifest.version_name||manifest.version||'REV279'),at:Date.now()});}catch(_){return false;}}
  function queueFastSnapshot(delay=50){if(fastSnapshotTimer)clearTimeout(fastSnapshotTimer);fastSnapshotTimer=setTimeout(()=>{fastSnapshotTimer=null;sendFastSnapshot();},Math.max(5,delay));}
  function sendFastCommandResult(clientCommandId,result){return relaySend({type:'command_result',clientCommandId:String(clientCommandId||'').slice(0,100),result:result||{ok:false,message:'Fast Lane result kosong.'},finishedAt:Date.now()});}
  function handleCoreInbound(route,msg){if(!msg||typeof msg!=='object'||!remoteAvailabilityEnabled)return;if(msg.type==='presence'){const live=Object.prototype.hasOwnProperty.call(msg,'mobileRemoteOnline')?!!msg.mobileRemoteOnline:!!msg.mobileOnline;renderRemoteMobileStatus(live);if(live)queueFastSnapshot(5);return;}if(msg.type==='command'){void executeRealtimeCommand(msg,route==='direct'?'direct':'fast');return;}if(msg.type==='snapshot_request'){route==='direct'?sendDirectSnapshot():queueFastSnapshot(3);return;}}
  try{
    chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{if(!message||typeof message!=='object')return;if(message.type==='TF_REMOTE_CORE_STATUS'){remoteAvailabilityEnabled=message.remoteEnabled===true;remoteAvailabilityLoaded=true;browserCoreWsReady=remoteAvailabilityEnabled&&message.wsReady===true;browserCoreDirectReady=remoteAvailabilityEnabled&&message.directReady===true;if(browserCoreWsReady||browserCoreDirectReady)httpRecoveryStep=0;browserCoreMode=String(message.directMode||(remoteAvailabilityEnabled?'connecting':'off'));browserCoreRtt=Number(message.directRtt||0);browserCoreConnectionState=String(message.connectionState||'');browserCoreLastError=String(message.lastError||'');renderRemoteMobileStatus(Object.prototype.hasOwnProperty.call(message,'mobileRemoteOnline')?!!message.mobileRemoteOnline:!!message.mobileOnline);return;}if(message.type==='TF_REMOTE_CORE_INBOUND'){handleCoreInbound(String(message.route||'ws'),message.message);return;}});
    chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_STATUS_QUERY'},s=>{try{void chrome.runtime.lastError;}catch(_){}if(s&&s.ok){remoteAvailabilityEnabled=s.remoteEnabled===true;remoteAvailabilityLoaded=true;browserCoreWsReady=remoteAvailabilityEnabled&&s.wsReady===true;browserCoreDirectReady=remoteAvailabilityEnabled&&s.directReady===true;browserCoreMode=String(s.directMode||(remoteAvailabilityEnabled?'connecting':'off'));browserCoreRtt=Number(s.directRtt||0);browserCoreConnectionState=String(s.connectionState||'');browserCoreLastError=String(s.lastError||'');renderRemoteMobileStatus(Object.prototype.hasOwnProperty.call(s,'mobileRemoteOnline')?!!s.mobileRemoteOnline:!!s.mobileOnline);if(browserCoreWsReady)queueFastSnapshot(5);}});
  }catch(_){ }


  function remoteButtonDisabled(el){
    if(!el)return true;
    try{if(el.disabled===true||el.matches(':disabled'))return true;}catch(_){}
    try{if(String(el.getAttribute('aria-disabled')||'').toLowerCase()==='true')return true;}catch(_){}
    try{if(el.dataset&&el.dataset.tfStopPending==='1')return true;}catch(_){}
    return false;
  }

  function clickVisible(ids){
    const candidates=[];
    for(const id of ids){const el=document.getElementById(id);if(el&&!candidates.includes(el))candidates.push(el);}
    const visible=candidates.filter(isVisible);
    // REV256: several generations of Submit buttons coexist in the sidebar.
    // Pick the first VISIBLE + ENABLED control instead of failing on an older
    // visible-but-disabled wrapper while another Submit is manually clickable.
    const el=visible.find(x=>!remoteButtonDisabled(x))||candidates.find(x=>isVisible(x)&&!remoteButtonDisabled(x));
    if(!el){
      const any=visible[0]||candidates[0];
      if(any)return {ok:false,message:'Tombol '+cleanText(any.textContent,70)+' sedang nonaktif di sidebar PC.'};
      return {ok:false,message:'Tombol tidak tersedia di sidebar PC.'};
    }
    try{el.click();}catch(e){return {ok:false,message:'Tombol '+cleanText(el.textContent,70)+' gagal diklik: '+cleanText(e&&e.message||e,120)};}
    return {ok:true,button:cleanText(el.textContent,100),buttonId:String(el.id||'')};
  }

  async function addAnalystAndWait(payload){
    const container=document.getElementById('analyst-links-container');
    if(!container)return {ok:false,code:'ANALYST_CONTAINER_MISSING',message:'Kolom Link Analis tidak tersedia di sidebar PC.'};
    const clientCommandId=cleanText(payload&&payload.clientCommandId||'',100);
    const rowKey=cleanText(payload&&payload.rowKey||'',120)||('cmdrow-'+clientCommandId);
    if(!rowKey)return {ok:false,code:'ANALYST_ROW_KEY_REQUIRED',message:'Row ID Remote tidak tersedia; Add dibatalkan untuk mencegah duplikasi.'};

    const allRowsNow=()=>Array.from(container.querySelectorAll('.analyst-row')).filter(r=>r&&r.isConnected);
    const logicalRowsNow=()=>effect
~~~

### snapshot @ 35774
~~~js
ot();},Math.max(5,delay));}
  function sendFastCommandResult(clientCommandId,result){return relaySend({type:'command_result',clientCommandId:String(clientCommandId||'').slice(0,100),result:result||{ok:false,message:'Fast Lane result kosong.'},finishedAt:Date.now()});}
  function handleCoreInbound(route,msg){if(!msg||typeof msg!=='object'||!remoteAvailabilityEnabled)return;if(msg.type==='presence'){const live=Object.prototype.hasOwnProperty.call(msg,'mobileRemoteOnline')?!!msg.mobileRemoteOnline:!!msg.mobileOnline;renderRemoteMobileStatus(live);if(live)queueFastSnapshot(5);return;}if(msg.type==='command'){void executeRealtimeCommand(msg,route==='direct'?'direct':'fast');return;}if(msg.type==='snapshot_request'){route==='direct'?sendDirectSnapshot():queueFastSnapshot(3);return;}}
  try{
    chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{if(!message||typeof message!=='object')return;if(message.type==='TF_REMOTE_CORE_STATUS'){remoteAvailabilityEnabled=message.remoteEnabled===true;remoteAvailabilityLoaded=true;browserCoreWsReady=remoteAvailabilityEnabled&&message.wsReady===true;browserCoreDirectReady=remoteAvailabilityEnabled&&message.directReady===true;if(browserCoreWsReady||browserCoreDirectReady)httpRecoveryStep=0;browserCoreMode=String(message.directMode||(remoteAvailabilityEnabled?'connecting':'off'));browserCoreRtt=Number(message.directRtt||0);browserCoreConnectionState=String(message.connectionState||'');browserCoreLastError=String(message.lastError||'');renderRemoteMobileStatus(Object.prototype.hasOwnProperty.call(message,'mobileRemoteOnline')?!!message.mobileRemoteOnline:!!message.mobileOnline);return;}if(message.type==='TF_REMOTE_CORE_INBOUND'){handleCoreInbound(String(message.route||'ws'),message.message);return;}});
    chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_STATUS_QUERY'},s=>{try{void chrome.runtime.lastError;}catch(_){}if(s&&s.ok){remoteAvailabilityEnabled=s.remoteEnabled===true;remoteAvailabilityLoaded=true;browserCoreWsReady=remoteAvailabilityEnabled&&s.wsReady===true;browserCoreDirectReady=remoteAvailabilityEnabled&&s.directReady===true;browserCoreMode=String(s.directMode||(remoteAvailabilityEnabled?'connecting':'off'));browserCoreRtt=Number(s.directRtt||0);browserCoreConnectionState=String(s.connectionState||'');browserCoreLastError=String(s.lastError||'');renderRemoteMobileStatus(Object.prototype.hasOwnProperty.call(s,'mobileRemoteOnline')?!!s.mobileRemoteOnline:!!s.mobileOnline);if(browserCoreWsReady)queueFastSnapshot(5);}});
  }catch(_){ }


  function remoteButtonDisabled(el){
    if(!el)return true;
    try{if(el.disabled===true||el.matches(':disabled'))return true;}catch(_){}
    try{if(String(el.getAttribute('aria-disabled')||'').toLowerCase()==='true')return true;}catch(_){}
    try{if(el.dataset&&el.dataset.tfStopPending==='1')return true;}catch(_){}
    return false;
  }

  function clickVisible(ids){
    const candidates=[];
    for(const id of ids){const el=document.getElementById(id);if(el&&!candidates.includes(el))candidates.push(el);}
    const visible=candidates.filter(isVisible);
    // REV256: several generations of Submit buttons coexist in the sidebar.
    // Pick the first VISIBLE + ENABLED control instead of failing on an older
    // visible-but-disabled wrapper while another Submit is manually clickable.
    const el=visible.find(x=>!remoteButtonDisabled(x))||candidates.find(x=>isVisible(x)&&!remoteButtonDisabled(x));
    if(!el){
      const any=visible[0]||candidates[0];
      if(any)return {ok:false,message:'Tombol '+cleanText(any.textContent,70)+' sedang nonaktif di sidebar PC.'};
      return {ok:false,message:'Tombol tidak tersedia di sidebar PC.'};
    }
    try{el.click();}catch(e){return {ok:false,message:'Tombol '+cleanText(el.textContent,70)+' gagal diklik: '+cleanText(e&&e.message||e,120)};}
    return {ok:true,button:cleanText(el.textContent,100),buttonId:String(el.id||'')};
  }

  async function addAnalystAndWait(payload){
    const container=document.getElementById('analyst-links-container');
    if(!container)return {ok:false,code:'ANALYST_CONTAINER_MISSING',message:'Kolom Link Analis tidak tersedia di sidebar PC.'};
    const clientCommandId=cleanText(payload&&payload.clientCommandId||'',100);
    const rowKey=cleanText(payload&&payload.rowKey||'',120)||('cmdrow-'+clientCommandId);
    if(!rowKey)return {ok:false,code:'ANALYST_ROW_KEY_REQUIRED',message:'Row ID Remote tidak tersedia; Add dibatalkan untuk mencegah duplikasi.'};

    const allRowsNow=()=>Array.from(container.querySelectorAll('.analyst-row')).filter(r=>r&&r.isConnected);
    const logicalRowsNow=()=>effectiveAnalystRows(container);
    const rowKeyOf=row=>analystRowRemoteKey(row);

    // A repeated delivery of the same command is ACKed without another click.
    let tagged=allRowsNow().find(row=>rowKeyOf(row)===rowKey);
    if(tagged){
      const logical=logicalRowsNow();
      const idx=logical.indexOf(tagged);
      if(idx<0)return {ok:false,code:'ANALYST_TAGGED_ROW_NOT_LOGICAL',message:'Row Remote sudah ditandai tetapi belum menjadi row aktif.',rowKey};
      queueImmediateSync(5);
      return {ok:true,action:'add_analyst',index:idx,rowNumber:idx+1,rowCount:logical.length,rowKey,verified:true,alreadyReady:true,analysts:analystSnapshot('analyst-links-container'),message:'Row '+(idx+1)+' sudah tersedia di sidebar PC.'};
    }

    const beforeRows=allRowsNow();
    const beforeSet=new Set(beforeRows);
    const beforeCount=logicalRowsNow().length;
    if(beforeCount>=28)return {ok:false,code:'ANALYST_ROW_LIMIT',message:'Maksimum 28 row Link Analis sudah tercapai.',rowCount:beforeCount};

    // REV280: Mobile forwards ONE click to the plugin's real Add Analis button.
    // The PC DOM is authoritative; no clone/fallback row is manufactured here.
    const add=document.getElementById('add-analyst-btn');
    if(!add)return {ok:false,code:'ANALYST_ADD_BUTTON_MISSING',message:'Tombol Tambahkan Analis tidak tersedia di plugin PC.'};
    const oldDisabled=!!add.disabled,oldAria=add.getAttribute('aria-disabled');
    const oldBypass=add.dataset&&add.dataset.tfHyperlinkBypass,oldBlocked=add.dataset&&add.dataset.tfImportBlocked;
    try{
      add.disabled=false;add.removeAttribute('disabled');add.setAttribute('aria-disabled','false');
      if(add.dataset){add.dataset.tfHyperlinkBypass='1';add.dataset.tfImportBlocked='0';}
      add.click();
    }catch(e){return {ok:false,code:'ANALYST_ADD_CLICK_FAILED',message:'Tombol Tambahkan Analis di plugin PC gagal diklik: '+cleanText(e&&e.message||e,160)};}
    finally{
      try{
        add.disabled=oldDisabled;
        if(oldAria==null)add.removeAttribute('aria-disabled');else add.setAttribute('aria-disabled',oldAria);
        if(add.dataset){
          if(oldBypass==null)delete add.dataset.tfHyperlinkBypass;else add.dataset.tfHyperlinkBypass=oldBypass;
          if(oldBlocked==null)delete add.dataset.tfImportBlocked;else add.dataset.tfImportBlocked=oldBlocked;
        }
      }catch(_){ }
    }

    let created=null;
    const started=Date.now();
    while(Date.now()-started<7000){
      await sleep(25);
      const rows=allRowsNow();
      created=rows.find(r=>!beforeSet.has(r))||null;
      if(created)break;
    }
    if(!created)return {ok:false,code:'ANALYST_ADD_NO_PC_ROW',message:'Tombol Tambahkan Analis sudah diklik di plugin PC, tetapi row baru tidak muncul.',rowCount:logicalRowsNow().length,rowKey};

    created.dataset.tfRemoteRowKey=rowKey;
    const logical=logicalRowsNow();
    const finalIndex=logical.indexOf(created);
    if(finalIndex<0||logical.length!==beforeCount+1){
      return {ok:false,code:'ANALYST_ADD_VERIFY_FAILED',message:'Row baru muncul, tetapi jumlah/urutan row plugin PC belum stabil.',index:finalIndex,rowCount:logical.length,rowKey};
    }
    try{if(typeof window.saveRememberedAnalystLinks==='function')window.saveRememberedAnalystLinks();}catch(_){ }
    const analysts=analystSnapshot('analyst-links-container');
    queueImmediateSync(5);
    return {ok:true,action:'add_analyst',index:finalIndex,rowNumber:finalIndex+1,rowCount:logical.length,rowKey,verified:true,created:true,analysts,message:'Tombol Tambahkan Analis diklik dan row '+(finalIndex+1)+' sudah muncul di plugin PC.'};
  }

  async function setTimeRange(value){
    const wanted=String(value||'all_time').trim();
    const candidates=Array.from(document.querySelectorAll('.tf-tr-option[data-value="'+wanted.replace(/"/g,'')+'"]'));
    const el=candidates.find(isVisible)||candidates[0];
    if(!el)return {ok:false,code:'TIME_RANGE_NOT_FOUND',message:'Pilihan Time Range tidak ditemukan.'};
    // Persist first, then fire the UI event. No polling verification in the click path.
    selectedTimeRangeCache=wanted;
    try{await storageSet({tfSelectedTimeRange:wanted});}catch(_){ }
    try{el.click();}catch(e){return {ok:false,code:'TIME_RANGE_CLICK_FAILED',message:'Time Range gagal diklik: '+cleanText(e&&e.message||e,120)};}
    queueImmediateSync(5);
    ret
~~~

### snapshot @ 41219
~~~js
oreRows);
    const beforeCount=logicalRowsNow().length;
    if(beforeCount>=28)return {ok:false,code:'ANALYST_ROW_LIMIT',message:'Maksimum 28 row Link Analis sudah tercapai.',rowCount:beforeCount};

    // REV280: Mobile forwards ONE click to the plugin's real Add Analis button.
    // The PC DOM is authoritative; no clone/fallback row is manufactured here.
    const add=document.getElementById('add-analyst-btn');
    if(!add)return {ok:false,code:'ANALYST_ADD_BUTTON_MISSING',message:'Tombol Tambahkan Analis tidak tersedia di plugin PC.'};
    const oldDisabled=!!add.disabled,oldAria=add.getAttribute('aria-disabled');
    const oldBypass=add.dataset&&add.dataset.tfHyperlinkBypass,oldBlocked=add.dataset&&add.dataset.tfImportBlocked;
    try{
      add.disabled=false;add.removeAttribute('disabled');add.setAttribute('aria-disabled','false');
      if(add.dataset){add.dataset.tfHyperlinkBypass='1';add.dataset.tfImportBlocked='0';}
      add.click();
    }catch(e){return {ok:false,code:'ANALYST_ADD_CLICK_FAILED',message:'Tombol Tambahkan Analis di plugin PC gagal diklik: '+cleanText(e&&e.message||e,160)};}
    finally{
      try{
        add.disabled=oldDisabled;
        if(oldAria==null)add.removeAttribute('aria-disabled');else add.setAttribute('aria-disabled',oldAria);
        if(add.dataset){
          if(oldBypass==null)delete add.dataset.tfHyperlinkBypass;else add.dataset.tfHyperlinkBypass=oldBypass;
          if(oldBlocked==null)delete add.dataset.tfImportBlocked;else add.dataset.tfImportBlocked=oldBlocked;
        }
      }catch(_){ }
    }

    let created=null;
    const started=Date.now();
    while(Date.now()-started<7000){
      await sleep(25);
      const rows=allRowsNow();
      created=rows.find(r=>!beforeSet.has(r))||null;
      if(created)break;
    }
    if(!created)return {ok:false,code:'ANALYST_ADD_NO_PC_ROW',message:'Tombol Tambahkan Analis sudah diklik di plugin PC, tetapi row baru tidak muncul.',rowCount:logicalRowsNow().length,rowKey};

    created.dataset.tfRemoteRowKey=rowKey;
    const logical=logicalRowsNow();
    const finalIndex=logical.indexOf(created);
    if(finalIndex<0||logical.length!==beforeCount+1){
      return {ok:false,code:'ANALYST_ADD_VERIFY_FAILED',message:'Row baru muncul, tetapi jumlah/urutan row plugin PC belum stabil.',index:finalIndex,rowCount:logical.length,rowKey};
    }
    try{if(typeof window.saveRememberedAnalystLinks==='function')window.saveRememberedAnalystLinks();}catch(_){ }
    const analysts=analystSnapshot('analyst-links-container');
    queueImmediateSync(5);
    return {ok:true,action:'add_analyst',index:finalIndex,rowNumber:finalIndex+1,rowCount:logical.length,rowKey,verified:true,created:true,analysts,message:'Tombol Tambahkan Analis diklik dan row '+(finalIndex+1)+' sudah muncul di plugin PC.'};
  }

  async function setTimeRange(value){
    const wanted=String(value||'all_time').trim();
    const candidates=Array.from(document.querySelectorAll('.tf-tr-option[data-value="'+wanted.replace(/"/g,'')+'"]'));
    const el=candidates.find(isVisible)||candidates[0];
    if(!el)return {ok:false,code:'TIME_RANGE_NOT_FOUND',message:'Pilihan Time Range tidak ditemukan.'};
    // Persist first, then fire the UI event. No polling verification in the click path.
    selectedTimeRangeCache=wanted;
    try{await storageSet({tfSelectedTimeRange:wanted});}catch(_){ }
    try{el.click();}catch(e){return {ok:false,code:'TIME_RANGE_CLICK_FAILED',message:'Time Range gagal diklik: '+cleanText(e&&e.message||e,120)};}
    queueImmediateSync(5);
    return {ok:true,action:'set_time_range',value:wanted,dispatched:true,message:'Time Range '+wanted+' langsung diterapkan di PC.'};
  }


  function normalizePairs(values){
    let arr = Array.isArray(values) ? values : String(values||'').split(',');
    arr = arr.map(v=>String(v||'').trim().toUpperCase()).filter(Boolean);
    if(!arr.length || arr.includes('ALL') || arr.includes(ALL)) return [ALL];
    const out=[];
    for(const p of arr){ if(PAIRS.includes(p) && !out.includes(p)) out.push(p); }
    return out.length ? out : [ALL];
  }

  function applySelectPairs(select, values){
    if(!select) return false;
    const vals = normalizePairs(values);
    for(const option of Array.from(select.options||[])){
      const ov=String(option.value||'').toUpperCase();
      option.selected = vals.includes(ALL) ? (ov===ALL) : vals.includes(ov);
    }
    select.dispatchEvent(new Event('change',{bubbles:true}));
    return true;
  }

  function syncPairWidget(row, values){
    if(!row) return;
    const vals=normalizePairs(values);
    const widget=row.querySelector('.pair-multiselect');
    // First prefer the plugin's own widget sync function so native select and
    // custom checkbox state can never drift apart.
    try{
      if(widget && typeof widget.__tf_syncFromSelect==='function'){
        widget.__tf_syncFromSelect();
      }else{
        const checks=Array.from(row.querySelectorAll('.pair-multiselect input[data-value]'));
        checks.forEach(ch=>{
          const v=String(ch.dataset.value||'').toUpperCase();
          ch.checked=vals.includes(ALL)?v===ALL:vals.includes(v);
        });
        const label=row.querySelector('.pair-multiselect-label');
        if(label) label.textContent=vals.includes(ALL)?'ALL':vals.join(', ');
      }
    }catch(_){}
    try{if(widget)widget.classList.remove('open');}catch(_){}
  }

  function samePairs(a,b){
    const aa=normalizePairs(a),bb=normalizePairs(b);
    if(aa.includes(ALL)||bb.includes(ALL))return aa.includes(ALL)&&bb.includes(ALL);
    return aa.slice().sort().join('|')===bb.slice().sort().join('|');
  }

  function isPairLockedRow(row){
    if(!row)return false;
    const checks=Array.from(row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]'));
    const inp=row.querySelector('.analyst-link-input');const url=cleanText(inp&&inp.value||'',520);
    return !!((checks.length && checks.every(cb=>!!cb.disabled))||isImportLockedUrl(url));
  }

  function widgetSelectedPairs(row){
    if(!row)return [ALL];
    const checks=Array.from(row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox][data-value]:checked'));
    const vals=checks.map(c=>String(c.dataset.value||'').toUpperCase()).filter(Boolean);
    return normalizePairs(vals);
  }

  function applyRowPairs(row,values){
    const vals=normalizePairs(values);
    const select=row&&row.querySelector?row.querySelector('.analyst-pair-select'):null;
    if(!select)return [ALL];
    if(isPairLockedRow(row))return selectedValues(select);
    try{if(typeof window.initPairMultiSelectForRow==='function')window.initPairMultiSelectForRow(row);}catch(_){ }
    const widget=row.querySelector('.pair-multiselect');
    const checks=Array.from(row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox][data-value]'));
    const useAll=vals.includes(ALL);

    // REV253: hidden select and checkbox widget are both authoritative targets.
    // Clear ALL first when a specific Pair is requested, then write exact values.
    for(const option of Array.from(select.options||[])){
      const ov=String(option.value||'').toUpperCase();
      option.selected=useAll ? (ov===ALL) : vals.includes(ov);
    }
    if(!Array.from(select.options||[]).some(o=>o.selected)){
      const allOpt=Array.from(select.options||[]).find(o=>String(o.value||'').toUpperCase()===ALL);
      if(allOpt)allOpt.selected=true;
    }
    for(const cb of checks){
      const v=String(cb.dataset.value||'').toUpperCase();
      cb.checked=useAll ? (v===ALL) : vals.includes(v);
    }
    // Trigger one specific checkbox AFTER exact state is present. The plugin's
    // handler persists the state but cannot resurrect ALL because ALL is false.
    const trigger=checks.find(cb=>cb.checked)||checks.find(cb=>String(cb.dataset.value||'').toUpperCase()===ALL)||checks[0];
    try{if(trigger)trigger.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){ }
    // Re-assert exact select state after legacy listeners have run.
    for(const option of Array.from(select.options||[])){
      const ov=String(option.value||'').toUpperCase();
      option.selected=useAll ? (ov===ALL) : vals.includes(ov);
    }
    try{select.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){ }
    try{if(widget&&typeof widget.__tf_syncFromSelect==='function')widget.__tf_syncFromSelect();}catch(_){ }
    try{if(widget)widget.classList.remove('open');}catch(_){ }
    try{if(typeof window.saveRememberedAnalystLinks==='function')window.saveRememberedAnalystLinks();}catch(_){ }
    return selectedValues(select);
  }

  async function applyRowPairsReliable(row,values){
    const vals=normalizePairs(values);
    const select=row&&row.querySelector?row.querySelector('.analyst-pair-select'):null;
    if(!row||!select)return {pairs:[ALL],widgetPairs:[ALL]};
    if(isPairLockedRow(row))return {pairs:selectedValues(select),widgetPairs:widgetSelectedPairs(row)};
    try{if(typeof window.initPairMulti
~~~

### snapshot @ 53852
~~~js
ks(); }catch(_){}
    return {ok:true,value:!!value};
  }

  async function ensureAnalystRows(count){
    const container=document.getElementById('analyst-links-container');
    if(!container) return null;
    const target=Math.max(1,Math.min(28,Number(count)||1));
    let guard=0;
    while(effectiveAnalystRows(container).length<target && guard<32){
      guard++;
      const before=effectiveAnalystRows(container).length;
      const add=document.getElementById('add-analyst-btn');
      if(add && !add.disabled){ add.click(); await sleep(20); }
      let after=effectiveAnalystRows(container).length;
      if(after<=before){
        const base=effectiveAnalystRows(container)[0]||container.querySelector('.analyst-row');
        if(!base) break;
        const clone=base.cloneNode(true);
        const inp=clone.querySelector('.analyst-link-input'); if(inp){inp.value='';inp.disabled=false;}
        const sel=clone.querySelector('.analyst-pair-select'); if(sel){applySelectPairs(sel,[ALL]);sel.disabled=false;}
        syncPairWidget(clone,[ALL]);
        const rememberRow=container.querySelector('.remember-links-row');
        if(rememberRow) container.insertBefore(clone,rememberRow); else container.appendChild(clone);
        try{ if(typeof window.initPairMultiSelectForRow==='function') window.initPairMultiSelectForRow(clone); }catch(_){}
      }
    }
    return container;
  }

  async function setAnalysts(items){
    const list=(Array.isArray(items)?items:[]).slice(0,28).map(x=>({
      url:cleanText(x&&x.url||'',520),
      pairs:normalizePairs(x&&x.pairs)
    })).filter(x=>x.url);
    const container=await ensureAnalystRows(Math.max(1,list.length));
    if(!container) return {ok:false,message:'Kolom Link Analis tidak tersedia di sidebar PC.'};
    const rows=effectiveAnalystRows(container);
    for(let i=0;i<rows.length;i++){
      const row=rows[i];
      const item=list[i]||{url:'',pairs:[ALL]};
      const input=row.querySelector('.analyst-link-input');
      if(input){
        try{input.readOnly=false;}catch(_){}
        input.disabled=false;
        if(input.value!==item.url){
          input.value=item.url;
          input.dispatchEvent(new Event('input',{bubbles:true}));
          input.dispatchEvent(new Event('change',{bubbles:true}));
        }
      }
      applyRowPairs(row,item.pairs);
    }
    try{ if(typeof window.saveRememberedAnalystLinks==='function') window.saveRememberedAnalystLinks(); }catch(_){}
    await sleep(90);
    let snap=analystSnapshot('analyst-links-container');
    let mismatch=false;
    for(let i=0;i<list.length;i++){if(!snap[i]||cleanText(snap[i].url,520)!==list[i].url||!samePairs(snap[i].pairs,list[i].pairs)){mismatch=true;break;}}
    // Some legacy row widgets finish initialization asynchronously. Re-apply once
    // and verify before ACK so Mobile never receives a false success.
    if(mismatch){
      const rows2=effectiveAnalystRows(container);
      for(let i=0;i<list.length&&i<rows2.length;i++)applyRowPairs(rows2[i],list[i].pairs);
      try{ if(typeof window.saveRememberedAnalystLinks==='function') window.saveRememberedAnalystLinks(); }catch(_){}
      await sleep(140);snap=analystSnapshot('analyst-links-container');
      mismatch=false;for(let i=0;i<list.length;i++){if(!snap[i]||cleanText(snap[i].url,520)!==list[i].url||!samePairs(snap[i].pairs,list[i].pairs)){mismatch=true;break;}}
    }
    if(mismatch)return {ok:false,code:'PAIR_SYNC_VERIFY_FAILED',message:'Link masuk, tetapi Pair belum berhasil dikunci di sidebar PC. Coba ulang otomatis dari Mobile.',analysts:snap};
    return {ok:true,count:list.length,analysts:snap,pairsSynced:true};
  }

  async function patchAnalyst(payload){
    const requestedIndex=Math.max(0,Math.min(27,Number(payload&&payload.index)||0));
    const container=document.getElementById('analyst-links-container');
    if(!container)return {ok:false,code:'ANALYST_CONTAINER_MISSING',message:'Kolom Link Analis tidak tersedia di sidebar PC.'};
    let rows=effectiveAnalystRows(container);
    const hasUrl=payload&&Object.prototype.hasOwnProperty.call(payload,'url');
    const nextUrl=cleanText(payload&&payload.url||'',520);
    const requestedRowKey=cleanText(payload&&payload.rowKey||'',120);
    const patchField=String(payload&&payload.field||'').toLowerCase();
    if(nextUrl&&(patchField==='link'||patchField==='link_pair')&&String(payload&&payload.source||'manual').toLowerCase()!=='isignal')manualUnresolvedUrls.add(nextUrl);
    // REV263: use the Mobile row key first, then the exact index. URL lookup is
    // only a legacy fallback. This guarantees Mobile row 2 writes to PC row 2.
    let matchedBy='';
    let row=requestedRowKey?rows.find(r=>cleanText(r.dataset&&r.dataset.tfRemoteRowKey||'',120)===requestedRowKey):null;
    if(row)matchedBy='rowKey';
    if(!row&&rows[requestedIndex]){row=rows[requestedIndex];matchedBy='index';}
    if(!row&&nextUrl){row=rows.find(r=>cleanText(r.querySelector('.analyst-link-input')&&r.querySelector('.analyst-link-input').value||'',520)===nextUrl);if(row)matchedBy='url';}
    if(!row)return {ok:false,code:'ANALYST_ROW_NOT_READY',message:'Row Link Analis belum dibuat di plugin PC. Tambahkan Analis harus selesai lebih dulu; Link/Pair tidak akan membuat row otomatis.',requestedIndex,rowKey:requestedRowKey};
    const actualIndex=Math.max(0,rows.indexOf(row));
    if(actualIndex!==requestedIndex&&matchedBy!=='rowKey')return {ok:false,code:'ANALYST_ROW_ORDER_CONFLICT',message:'Indeks row Mobile dan plugin PC tidak sama. Link tidak diterapkan agar tidak masuk ke analis yang salah.',index:actualIndex,requestedIndex,rowKey:requestedRowKey};
    if(requestedRowKey)row.dataset.tfRemoteRowKey=requestedRowKey;
    const input=row.querySelector('.analyst-link-input');
    const locked=isPairLockedRow(row);
    if(locked && payload && Array.isArray(payload.pairs)){
      const current=selectedValues(row.querySelector('.analyst-pair-select'));
      if(!samePairs(current,payload.pairs))return {ok:false,code:'PAIR_LOCKED_IMPORT',message:'Pair dari data Import dikunci permanen dan tidak dapat diubah.',index:actualIndex,analyst:analystSnapshot('analyst-links-container')[actualIndex]||null};
    }
    if(hasUrl&&nextUrl&&input&&!input.readOnly){
      input.disabled=false;
      if(cleanText(input.value||'',520)!==nextUrl){
        input.value=nextUrl;
        try{input.dispatchEvent(new Event('input',{bubbles:true}));}catch(_){ }
        try{input.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){ }
      }
    }
    // REV287: field:'link_pair' is the atomic Mobile commit: Link + locally selected
    // Pair are applied in the same desktop transaction. Legacy field:'link' keeps
    // its historical Link-only behavior for backward compatibility.
    const shouldPatchPairs=!!(payload&&Array.isArray(payload.pairs)&&patchField!=='link');
    const wantedPairs=shouldPatchPairs?normalizePairs(payload.pairs):selectedValues(row.querySelector('.analyst-pair-select'));
    if(!locked&&shouldPatchPairs)await applyRowPairsReliable(row,wantedPairs);
    if(nextUrl&&shouldPatchPairs){
      const isig=document.getElementById('isignal-links-container');
      if(isig){for(const r of Array.from(isig.querySelectorAll('.analyst-row'))){const inp=r.querySelector('.analyst-link-input');if(cleanText(inp&&inp.value||'',520)===nextUrl&&!isPairLockedRow(r))await applyRowPairsReliable(r,wantedPairs);}}
    }
    try{if(typeof window.saveRememberedAnalystLinks==='function')window.saveRememberedAnalystLinks();}catch(_){ }
    let snap=[],got=null,mismatch=true;
    for(let attempt=0;attempt<3;attempt++){
      await sleep(attempt?12:4);
      // REV257: a sidebar re-render invalidates old DOM row references. Re-find
      // the row by URL on EVERY verify/repair pass.
      rows=effectiveAnalystRows(container);
      const liveRow=(nextUrl?rows.find(r=>cleanText(r.querySelector('.analyst-link-input')&&r.querySelector('.analyst-link-input').value||'',520)===nextUrl):null)||rows[Math.min(actualIndex,Math.max(0,rows.length-1))]||null;
      snap=analystSnapshot('analyst-links-container');
      got=(nextUrl?snap.find(x=>x&&cleanText(x.url||'',520)===nextUrl):null)||snap[actualIndex]||null;
      mismatch=!got||(nextUrl&&cleanText(got.url||'',520)!==nextUrl)||(shouldPatchPairs&&!locked&&!samePairs(got.pairs,wantedPairs));
      if(shouldPatchPairs&&!locked&&liveRow)mismatch=mismatch||!samePairs(widgetSelectedPairs(liveRow),wantedPairs)||!samePairs(selectedValues(liveRow.querySelector('.analyst-pair-select')),wantedPairs);
      if(!mismatch)break;
      if(shouldPatchPairs&&!locked&&liveRow)await applyRowPairsReliable(liveRow,wantedPairs);
    }
    if(mismatch)return {ok:false,code:'ANALYST_PATCH_VERIFY_FAILED',message:shouldPatchPairs?'Pair belum berubah di row analis yang benar. Plugin masih belum cocok dengan pilihan Mobile.':'Link analis belum muncul di row plugin PC yang benar.',index:actualIndex,wantedPairs,analysts:snap};
    queueImmediateSync(20);
    r
~~~

### snapshot @ 57487
~~~js
irsSynced:true};
  }

  async function patchAnalyst(payload){
    const requestedIndex=Math.max(0,Math.min(27,Number(payload&&payload.index)||0));
    const container=document.getElementById('analyst-links-container');
    if(!container)return {ok:false,code:'ANALYST_CONTAINER_MISSING',message:'Kolom Link Analis tidak tersedia di sidebar PC.'};
    let rows=effectiveAnalystRows(container);
    const hasUrl=payload&&Object.prototype.hasOwnProperty.call(payload,'url');
    const nextUrl=cleanText(payload&&payload.url||'',520);
    const requestedRowKey=cleanText(payload&&payload.rowKey||'',120);
    const patchField=String(payload&&payload.field||'').toLowerCase();
    if(nextUrl&&(patchField==='link'||patchField==='link_pair')&&String(payload&&payload.source||'manual').toLowerCase()!=='isignal')manualUnresolvedUrls.add(nextUrl);
    // REV263: use the Mobile row key first, then the exact index. URL lookup is
    // only a legacy fallback. This guarantees Mobile row 2 writes to PC row 2.
    let matchedBy='';
    let row=requestedRowKey?rows.find(r=>cleanText(r.dataset&&r.dataset.tfRemoteRowKey||'',120)===requestedRowKey):null;
    if(row)matchedBy='rowKey';
    if(!row&&rows[requestedIndex]){row=rows[requestedIndex];matchedBy='index';}
    if(!row&&nextUrl){row=rows.find(r=>cleanText(r.querySelector('.analyst-link-input')&&r.querySelector('.analyst-link-input').value||'',520)===nextUrl);if(row)matchedBy='url';}
    if(!row)return {ok:false,code:'ANALYST_ROW_NOT_READY',message:'Row Link Analis belum dibuat di plugin PC. Tambahkan Analis harus selesai lebih dulu; Link/Pair tidak akan membuat row otomatis.',requestedIndex,rowKey:requestedRowKey};
    const actualIndex=Math.max(0,rows.indexOf(row));
    if(actualIndex!==requestedIndex&&matchedBy!=='rowKey')return {ok:false,code:'ANALYST_ROW_ORDER_CONFLICT',message:'Indeks row Mobile dan plugin PC tidak sama. Link tidak diterapkan agar tidak masuk ke analis yang salah.',index:actualIndex,requestedIndex,rowKey:requestedRowKey};
    if(requestedRowKey)row.dataset.tfRemoteRowKey=requestedRowKey;
    const input=row.querySelector('.analyst-link-input');
    const locked=isPairLockedRow(row);
    if(locked && payload && Array.isArray(payload.pairs)){
      const current=selectedValues(row.querySelector('.analyst-pair-select'));
      if(!samePairs(current,payload.pairs))return {ok:false,code:'PAIR_LOCKED_IMPORT',message:'Pair dari data Import dikunci permanen dan tidak dapat diubah.',index:actualIndex,analyst:analystSnapshot('analyst-links-container')[actualIndex]||null};
    }
    if(hasUrl&&nextUrl&&input&&!input.readOnly){
      input.disabled=false;
      if(cleanText(input.value||'',520)!==nextUrl){
        input.value=nextUrl;
        try{input.dispatchEvent(new Event('input',{bubbles:true}));}catch(_){ }
        try{input.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){ }
      }
    }
    // REV287: field:'link_pair' is the atomic Mobile commit: Link + locally selected
    // Pair are applied in the same desktop transaction. Legacy field:'link' keeps
    // its historical Link-only behavior for backward compatibility.
    const shouldPatchPairs=!!(payload&&Array.isArray(payload.pairs)&&patchField!=='link');
    const wantedPairs=shouldPatchPairs?normalizePairs(payload.pairs):selectedValues(row.querySelector('.analyst-pair-select'));
    if(!locked&&shouldPatchPairs)await applyRowPairsReliable(row,wantedPairs);
    if(nextUrl&&shouldPatchPairs){
      const isig=document.getElementById('isignal-links-container');
      if(isig){for(const r of Array.from(isig.querySelectorAll('.analyst-row'))){const inp=r.querySelector('.analyst-link-input');if(cleanText(inp&&inp.value||'',520)===nextUrl&&!isPairLockedRow(r))await applyRowPairsReliable(r,wantedPairs);}}
    }
    try{if(typeof window.saveRememberedAnalystLinks==='function')window.saveRememberedAnalystLinks();}catch(_){ }
    let snap=[],got=null,mismatch=true;
    for(let attempt=0;attempt<3;attempt++){
      await sleep(attempt?12:4);
      // REV257: a sidebar re-render invalidates old DOM row references. Re-find
      // the row by URL on EVERY verify/repair pass.
      rows=effectiveAnalystRows(container);
      const liveRow=(nextUrl?rows.find(r=>cleanText(r.querySelector('.analyst-link-input')&&r.querySelector('.analyst-link-input').value||'',520)===nextUrl):null)||rows[Math.min(actualIndex,Math.max(0,rows.length-1))]||null;
      snap=analystSnapshot('analyst-links-container');
      got=(nextUrl?snap.find(x=>x&&cleanText(x.url||'',520)===nextUrl):null)||snap[actualIndex]||null;
      mismatch=!got||(nextUrl&&cleanText(got.url||'',520)!==nextUrl)||(shouldPatchPairs&&!locked&&!samePairs(got.pairs,wantedPairs));
      if(shouldPatchPairs&&!locked&&liveRow)mismatch=mismatch||!samePairs(widgetSelectedPairs(liveRow),wantedPairs)||!samePairs(selectedValues(liveRow.querySelector('.analyst-pair-select')),wantedPairs);
      if(!mismatch)break;
      if(shouldPatchPairs&&!locked&&liveRow)await applyRowPairsReliable(liveRow,wantedPairs);
    }
    if(mismatch)return {ok:false,code:'ANALYST_PATCH_VERIFY_FAILED',message:shouldPatchPairs?'Pair belum berubah di row analis yang benar. Plugin masih belum cocok dengan pilihan Mobile.':'Link analis belum muncul di row plugin PC yang benar.',index:actualIndex,wantedPairs,analysts:snap};
    queueImmediateSync(20);
    return {ok:true,action:'patch_analyst',index:actualIndex,rowKey:requestedRowKey,analyst:got,analysts:snap,linkVerified:!!nextUrl,pairsVerified:shouldPatchPairs?true:undefined,message:shouldPatchPairs?(locked?'Link Import tetap terkunci; Pair hanya dapat dilihat.':((patchField==='link_pair'?'Link + Pair ':'Pair ')+wantedPairs.map(x=>x===ALL?'ALL':x).join(', ')+' sudah benar-benar aktif di plugin PC.')):'Link analis sudah aktif di row '+(actualIndex+1)+' plugin PC tanpa mengubah Pair.'};
  }

  function remoteUrlIdentity(v){
    const raw=cleanText(v||'',520);if(!raw)return '';
    try{const u=new URL(raw);return (u.origin+u.pathname.replace(/\/+$/,'')+(u.search||'')).toLowerCase();}catch(_){return raw.replace(/\/+$/,'').toLowerCase();}
  }
  async function persistRemoteAnalystDeletion(targetUrl){
    const key=remoteUrlIdentity(targetUrl);if(!key)return;
    const st=await storageGet(['tfRememberedAnalystLinks','tfAnalystSources','tfAnalystNameCacheByUrl']);
    const remembered=Array.isArray(st.tfRememberedAnalystLinks)?st.tfRememberedAnalystLinks:[];
    const nextRemembered=remembered.filter(it=>remoteUrlIdentity(it&&typeof it==='object'?(it.url||it.link||''):it)!==key);
    const sources=st.tfAnalystSources&&typeof st.tfAnalystSources==='object'?{...st.tfAnalystSources}:{};
    for(const name of Object.keys(sources)){const it=sources[name]||{};if(remoteUrlIdentity(it.url||it.link||'')===key)delete sources[name];}
    const nameCache=st.tfAnalystNameCacheByUrl&&typeof st.tfAnalystNameCacheByUrl==='object'?{...st.tfAnalystNameCacheByUrl}:{};
    for(const k of Object.keys(nameCache)){if(remoteUrlIdentity(k)===key)delete nameCache[k];}
    await storageSet({tfRememberedAnalystLinks:nextRemembered,tfAnalystSources:sources,tfAnalystNameCacheByUrl:nameCache});
    rememberedAnalystsCache=nextRemembered.map(it=>({url:cleanText(it&&typeof it==='object'?(it.url||it.link||''):it,520),name:cleanText(it&&typeof it==='object'?(it.name||it.analystName||''):'',80),pairs:normalizePairs(it&&typeof it==='object'?it.pairs:[])})).filter(it=>it.url).slice(0,28);
    dataCountCache.remembered=rememberedAnalystsCache.length;lastRemoteDataCacheAt=Date.now();
    try{if(Array.isArray(window.__tfRememberedLinksUiSnapshot))window.__tfRememberedLinksUiSnapshot=window.__tfRememberedLinksUiSnapshot.filter(it=>remoteUrlIdentity(it&&(it.url||it.link)||'')!==key);}catch(_){ }
  }
  function invokeNativeDeleteCleanupDetached(row){
    try{
      if(typeof tf_deleteStoredDataForAnalystRow==='function'){Promise.resolve(tf_deleteStoredDataForAnalystRow(row)).then(()=>refreshRemoteDataCache()).then(()=>queueImmediateSync(20)).catch(()=>{});return;}
      if(typeof window.tf_deleteStoredDataForAnalystRow==='function')Promise.resolve(window.tf_deleteStoredDataForAnalystRow(row)).then(()=>refreshRemoteDataCache()).then(()=>queueImmediateSync(20)).catch(()=>{});
    }catch(_){ }
  }

  async function removeAnalystLegacyDirectMutation(payload){
    const requestedIndex=Math.max(0,Math.min(27,Number(payload&&payload.index)||0));
    const targetUrl=cleanText(payload&&payload.url||'',520);
    const requestedRowKey=cleanText(payload&&payload.rowKey||'',120);
    const container=document.getElementById('analyst-links-container');
    if(!container)return {ok:false,code:'ANALYST_CONTAINER_MISSING',message:'Kolom Link Analis tidak tersedia di sidebar PC.'};

    const physicalRows=()=>Array.from(container.querySelectorAll('.analyst-row')).filter(r=>r&&r.isConnected);
    const findTarget=()=>{
      const physical=physicalRows();
      if(requestedRowKey){
        const byKey=physical.find(r=>analystRowRemoteKey(r
~~~

### snapshot @ 62580
~~~js
H_VERIFY_FAILED',message:shouldPatchPairs?'Pair belum berubah di row analis yang benar. Plugin masih belum cocok dengan pilihan Mobile.':'Link analis belum muncul di row plugin PC yang benar.',index:actualIndex,wantedPairs,analysts:snap};
    queueImmediateSync(20);
    return {ok:true,action:'patch_analyst',index:actualIndex,rowKey:requestedRowKey,analyst:got,analysts:snap,linkVerified:!!nextUrl,pairsVerified:shouldPatchPairs?true:undefined,message:shouldPatchPairs?(locked?'Link Import tetap terkunci; Pair hanya dapat dilihat.':((patchField==='link_pair'?'Link + Pair ':'Pair ')+wantedPairs.map(x=>x===ALL?'ALL':x).join(', ')+' sudah benar-benar aktif di plugin PC.')):'Link analis sudah aktif di row '+(actualIndex+1)+' plugin PC tanpa mengubah Pair.'};
  }

  function remoteUrlIdentity(v){
    const raw=cleanText(v||'',520);if(!raw)return '';
    try{const u=new URL(raw);return (u.origin+u.pathname.replace(/\/+$/,'')+(u.search||'')).toLowerCase();}catch(_){return raw.replace(/\/+$/,'').toLowerCase();}
  }
  async function persistRemoteAnalystDeletion(targetUrl){
    const key=remoteUrlIdentity(targetUrl);if(!key)return;
    const st=await storageGet(['tfRememberedAnalystLinks','tfAnalystSources','tfAnalystNameCacheByUrl']);
    const remembered=Array.isArray(st.tfRememberedAnalystLinks)?st.tfRememberedAnalystLinks:[];
    const nextRemembered=remembered.filter(it=>remoteUrlIdentity(it&&typeof it==='object'?(it.url||it.link||''):it)!==key);
    const sources=st.tfAnalystSources&&typeof st.tfAnalystSources==='object'?{...st.tfAnalystSources}:{};
    for(const name of Object.keys(sources)){const it=sources[name]||{};if(remoteUrlIdentity(it.url||it.link||'')===key)delete sources[name];}
    const nameCache=st.tfAnalystNameCacheByUrl&&typeof st.tfAnalystNameCacheByUrl==='object'?{...st.tfAnalystNameCacheByUrl}:{};
    for(const k of Object.keys(nameCache)){if(remoteUrlIdentity(k)===key)delete nameCache[k];}
    await storageSet({tfRememberedAnalystLinks:nextRemembered,tfAnalystSources:sources,tfAnalystNameCacheByUrl:nameCache});
    rememberedAnalystsCache=nextRemembered.map(it=>({url:cleanText(it&&typeof it==='object'?(it.url||it.link||''):it,520),name:cleanText(it&&typeof it==='object'?(it.name||it.analystName||''):'',80),pairs:normalizePairs(it&&typeof it==='object'?it.pairs:[])})).filter(it=>it.url).slice(0,28);
    dataCountCache.remembered=rememberedAnalystsCache.length;lastRemoteDataCacheAt=Date.now();
    try{if(Array.isArray(window.__tfRememberedLinksUiSnapshot))window.__tfRememberedLinksUiSnapshot=window.__tfRememberedLinksUiSnapshot.filter(it=>remoteUrlIdentity(it&&(it.url||it.link)||'')!==key);}catch(_){ }
  }
  function invokeNativeDeleteCleanupDetached(row){
    try{
      if(typeof tf_deleteStoredDataForAnalystRow==='function'){Promise.resolve(tf_deleteStoredDataForAnalystRow(row)).then(()=>refreshRemoteDataCache()).then(()=>queueImmediateSync(20)).catch(()=>{});return;}
      if(typeof window.tf_deleteStoredDataForAnalystRow==='function')Promise.resolve(window.tf_deleteStoredDataForAnalystRow(row)).then(()=>refreshRemoteDataCache()).then(()=>queueImmediateSync(20)).catch(()=>{});
    }catch(_){ }
  }

  async function removeAnalystLegacyDirectMutation(payload){
    const requestedIndex=Math.max(0,Math.min(27,Number(payload&&payload.index)||0));
    const targetUrl=cleanText(payload&&payload.url||'',520);
    const requestedRowKey=cleanText(payload&&payload.rowKey||'',120);
    const container=document.getElementById('analyst-links-container');
    if(!container)return {ok:false,code:'ANALYST_CONTAINER_MISSING',message:'Kolom Link Analis tidak tersedia di sidebar PC.'};

    const physicalRows=()=>Array.from(container.querySelectorAll('.analyst-row')).filter(r=>r&&r.isConnected);
    const findTarget=()=>{
      const physical=physicalRows();
      if(requestedRowKey){
        const byKey=physical.find(r=>analystRowRemoteKey(r)===requestedRowKey);
        if(byKey)return {row:byKey,matchedBy:'rowKey'};
      }
      if(targetUrl){
        const key=remoteUrlIdentity(targetUrl);
        const matches=physical.filter(r=>remoteUrlIdentity(analystRowUrlValue(r))===key);
        if(matches.length===1)return {row:matches[0],matchedBy:'url'};
        if(matches.length>1)return {error:{ok:false,code:'ANALYST_DELETE_URL_AMBIGUOUS',message:'Ada lebih dari satu row dengan URL yang sama; delete dibatalkan demi keamanan.',requestedIndex,rowKey:requestedRowKey}};
      }
      // REV278: Mobile row number maps to the PHYSICAL row container, not the
      // "effective" row list. Empty/new rows are still real rows and must be deletable.
      if(physical[requestedIndex])return {row:physical[requestedIndex],matchedBy:'physicalIndex'};
      const logical=effectiveAnalystRows(container);
      if(logical[requestedIndex])return {row:logical[requestedIndex],matchedBy:'logicalIndex'};
      return {row:null,matchedBy:''};
    };

    const target=findTarget();
    if(target.error)return target.error;
    const row=target.row,matchedBy=target.matchedBy;
    if(!row||!row.isConnected)return {ok:false,code:'ANALYST_ROW_MISSING',message:'Row Link Analis target tidak ditemukan di plugin PC.',requestedIndex,rowKey:requestedRowKey,pcDeleted:false};

    const beforePhysical=physicalRows();
    const physicalIndex=beforePhysical.indexOf(row);
    const beforeCount=beforePhysical.length;
    const liveUrl=analystRowUrlValue(row);
    const rowKeyLive=analystRowRemoteKey(row)||requestedRowKey;
    if(targetUrl&&['physicalIndex','logicalIndex'].includes(matchedBy)&&liveUrl&&remoteUrlIdentity(liveUrl)!==remoteUrlIdentity(targetUrl)){
      return {ok:false,code:'ANALYST_DELETE_TARGET_MISMATCH',message:'Row target PC berbeda dengan row yang dipilih di ponsel.',requestedIndex,physicalIndex,rowKey:requestedRowKey,pcDeleted:false};
    }

    // One base container must remain because the plugin UI is built around Row 1.
    // Every physical Row 2+ is deleted as a CONTAINER, even when it is empty.
    const removeContainer=physicalIndex>0 || beforeCount>1;
    const detachedRow=row;
    let deleteInfo=null;

    try{
      // REV278: use the exact cleanup lifecycle used by the plugin's own X button.
      // This is the single source of truth for storage cleanup; Remote does not
      // maintain a second, divergent delete implementation anymore.
      try{
        if(typeof tf_deleteStoredDataForAnalystRow==='function')deleteInfo=await tf_deleteStoredDataForAnalystRow(row);
        else if(typeof window.tf_deleteStoredDataForAnalystRow==='function')deleteInfo=await window.tf_deleteStoredDataForAnalystRow(row);
      }catch(_){deleteInfo=null;}

      try{
        const deletedKey=deleteInfo&&deleteInfo.urlKey?deleteInfo.urlKey:remoteUrlIdentity(liveUrl||targetUrl);
        if(deletedKey&&typeof tf_removeMatchingAnalystUrlFromOtherUiRows==='function')tf_removeMatchingAnalystUrlFromOtherUiRows(deletedKey,row);
        else if(deletedKey&&typeof window.tf_removeMatchingAnalystUrlFromOtherUiRows==='function')window.tf_removeMatchingAnalystUrlFromOtherUiRows(deletedKey,row);
      }catch(_){ }

      if(removeContainer){
        try{row.remove();}catch(_){if(row.parentNode)row.parentNode.removeChild(row);}
      }else{
        const input=row.querySelector('.analyst-link-input');
        if(input){
          input.value='';input.disabled=false;input.readOnly=false;
          try{input.removeAttribute('readonly');}catch(_){}
          try{input.dispatchEvent(new Event('input',{bubbles:true}));}catch(_){}
          try{input.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
        }
        try{
          const select=row.querySelector('.analyst-pair-select');
          if(select&&typeof tf_applyPairsArrayToSelect==='function')tf_applyPairsArrayToSelect(select,typeof tf_getAllAnalystPairsCached==='function'?tf_getAllAnalystPairsCached():[ALL]);
          else applyRowPairs(row,[ALL]);
        }catch(_){try{applyRowPairs(row,[ALL]);}catch(__){}}
        try{const nameBtn=row.querySelector('.analyst-name-btn,.tf-analyst-name-pill');if(nameBtn)nameBtn.textContent='-';}catch(_){}
        if(row.dataset)delete row.dataset.tfRemoteRowKey;
      }

      try{if(typeof saveRememberedAnalystLinks==='function')saveRememberedAnalystLinks();else if(typeof window.saveRememberedAnalystLinks==='function')window.saveRememberedAnalystLinks();}catch(_){}
      try{if(typeof tf_updateExportButtonsEnabledFromStorage==='function')tf_updateExportButtonsEnabledFromStorage();}catch(_){}
      try{if(typeof tf_maybeExitAddModeAfterRowRemoval==='function')tf_maybeExitAddModeAfterRowRemoval();}catch(_){}

      // Give native storage/UI listeners one paint cycle, then verify the physical
      // row itself is gone. Do not return success because only Link/Pair were cleared.
      await sleep(35);
      await refreshRemoteDataCache();
      const afterPhysical=physicalRows();
      const expectedCount=removeContainer?Math.max(1,beforeCount-1):Math.max(1,beforeCount);
      co
~~~

### snapshot @ 70347
~~~js
sArrayToSelect(select,typeof tf_getAllAnalystPairsCached==='function'?tf_getAllAnalystPairsCached():[ALL]);
          else applyRowPairs(row,[ALL]);
        }catch(_){try{applyRowPairs(row,[ALL]);}catch(__){}}
        try{const nameBtn=row.querySelector('.analyst-name-btn,.tf-analyst-name-pill');if(nameBtn)nameBtn.textContent='-';}catch(_){}
        if(row.dataset)delete row.dataset.tfRemoteRowKey;
      }

      try{if(typeof saveRememberedAnalystLinks==='function')saveRememberedAnalystLinks();else if(typeof window.saveRememberedAnalystLinks==='function')window.saveRememberedAnalystLinks();}catch(_){}
      try{if(typeof tf_updateExportButtonsEnabledFromStorage==='function')tf_updateExportButtonsEnabledFromStorage();}catch(_){}
      try{if(typeof tf_maybeExitAddModeAfterRowRemoval==='function')tf_maybeExitAddModeAfterRowRemoval();}catch(_){}

      // Give native storage/UI listeners one paint cycle, then verify the physical
      // row itself is gone. Do not return success because only Link/Pair were cleared.
      await sleep(35);
      await refreshRemoteDataCache();
      const afterPhysical=physicalRows();
      const expectedCount=removeContainer?Math.max(1,beforeCount-1):Math.max(1,beforeCount);
      const sameContainerAlive=detachedRow.isConnected;
      const matchingStillExists=afterPhysical.some(r=>{
        if(r===detachedRow)return true;
        if(rowKeyLive&&analystRowRemoteKey(r)===rowKeyLive)return true;
        if(liveUrl&&remoteUrlIdentity(analystRowUrlValue(r))===remoteUrlIdentity(liveUrl))return true;
        return false;
      });
      const baseCleared=!removeContainer&&detachedRow.isConnected&&!analystRowUrlValue(detachedRow)&&!analystRowRemoteKey(detachedRow);
      const verified=removeContainer
        ? (!sameContainerAlive&&!matchingStillExists&&afterPhysical.length<=expectedCount)
        : baseCleared;

      if(!verified){
        return {ok:false,code:'ANALYST_DELETE_VERIFY_FAILED',message:'Plugin PC belum menghapus ROW Link Analis target. Tidak ada perubahan Mobile yang dianggap sukses.',requestedIndex,physicalIndex,rowKey:rowKeyLive,pcDeleted:false,rowContainerDeleted:false};
      }

      queueImmediateSync(5);
      return {
        ok:true,action:'remove_analyst',index:physicalIndex,physicalIndex,requestedIndex,matchedBy,
        rowKey:rowKeyLive,rowCount:Math.max(1,afterPhysical.length),verified:true,pcDeleted:true,
        rowContainerDeleted:!!removeContainer,survivorsPreserved:true,
        analysts:analystSnapshot('analyst-links-container'),
        message:removeContainer?'ROW Link Analis target sudah benar-benar dihapus dari plugin PC.':'Base Row 1 dipertahankan kosong sesuai struktur plugin PC.'
      };
    }catch(e){
      return {ok:false,code:'ANALYST_DELETE_FAILED',message:'ROW Link Analis gagal dihapus di plugin PC: '+cleanText(e&&e.message||e,180),requestedIndex,physicalIndex,rowKey:rowKeyLive,pcDeleted:false};
    }
  }

  async function removeAnalyst(payload){
    const requestedIndex=Math.max(0,Math.min(27,Number(payload&&payload.index)||0));
    const targetUrl=cleanText(payload&&payload.url||'',520);
    const requestedRowKey=cleanText(payload&&payload.rowKey||'',120);
    const container=document.getElementById('analyst-links-container');
    if(!container)return {ok:false,code:'ANALYST_CONTAINER_MISSING',message:'Kolom Link Analis tidak tersedia di sidebar PC.'};

    const rowsNow=()=>effectiveAnalystRows(container);
    const findRow=()=>{
      const rows=rowsNow();
      if(requestedRowKey){const byKey=rows.find(r=>analystRowRemoteKey(r)===requestedRowKey);if(byKey)return byKey;}
      if(targetUrl){const key=remoteUrlIdentity(targetUrl),matches=rows.filter(r=>remoteUrlIdentity(analystRowUrlValue(r))===key);if(matches.length===1)return matches[0];}
      return rows[requestedIndex]||null;
    };
    const row=findRow();
    if(!row)return {ok:false,code:'ANALYST_ROW_MISSING',message:'Row '+(requestedIndex+1)+' tidak ditemukan di plugin PC.',requestedIndex,pcDeleted:false};
    const beforeRows=rowsNow(),beforeCount=beforeRows.length,beforeIndex=beforeRows.indexOf(row);
    const liveUrl=analystRowUrlValue(row),liveKey=analystRowRemoteKey(row)||requestedRowKey;
    if(beforeIndex!==requestedIndex&&!requestedRowKey&&!targetUrl)return {ok:false,code:'ANALYST_DELETE_TARGET_MISMATCH',message:'Nomor row ponsel dan plugin PC tidak sama.',requestedIndex,pcIndex:beforeIndex,pcDeleted:false};

    const removeButton=row.querySelector('.analyst-remove-btn');
    if(!removeButton)return {ok:false,code:'ANALYST_DELETE_BUTTON_MISSING',message:'Tombol delete Row '+(beforeIndex+1)+' tidak tersedia di plugin PC.',requestedIndex,pcDeleted:false};

    // REV280: forward the Mobile delete to the exact native X button, then
    // accept the plugin's own confirmation dialog. No parallel delete engine.
    try{removeButton.click();}catch(e){return {ok:false,code:'ANALYST_DELETE_CLICK_FAILED',message:'Tombol delete Row '+(beforeIndex+1)+' gagal diklik: '+cleanText(e&&e.message||e,160),pcDeleted:false};}
    let confirmYes=null;
    const confirmStarted=Date.now();
    while(Date.now()-confirmStarted<2500){
      const overlay=document.getElementById('tf-confirm-overlay');
      const yes=document.getElementById('tf-confirm-yes');
      if(yes&&overlay&&overlay.hidden===false){confirmYes=yes;break;}
      await sleep(20);
    }
    if(!confirmYes)return {ok:false,code:'ANALYST_DELETE_CONFIRM_MISSING',message:'Konfirmasi delete tidak muncul di plugin PC.',requestedIndex,pcDeleted:false};
    try{confirmYes.click();}catch(e){return {ok:false,code:'ANALYST_DELETE_CONFIRM_FAILED',message:'Konfirmasi delete Row '+(beforeIndex+1)+' gagal diklik.',requestedIndex,pcDeleted:false};}

    let verified=false,after=[];
    const started=Date.now();
    while(Date.now()-started<9000){
      await sleep(35);
      after=rowsNow();
      if(beforeCount>1){
        const same=after.some(r=>r===row||(liveKey&&analystRowRemoteKey(r)===liveKey)||(liveUrl&&remoteUrlIdentity(analystRowUrlValue(r))===remoteUrlIdentity(liveUrl)));
        if(!same&&after.length===beforeCount-1){verified=true;break;}
      }else if(row.isConnected&&!analystRowUrlValue(row)){
        if(row.dataset)delete row.dataset.tfRemoteRowKey;
        verified=true;after=rowsNow();break;
      }
    }
    if(!verified)return {ok:false,code:'ANALYST_DELETE_VERIFY_FAILED',message:'Tombol delete sudah diteruskan, tetapi Row '+(beforeIndex+1)+' belum hilang di plugin PC.',requestedIndex,pcDeleted:false};

    await refreshRemoteDataCache();
    const analysts=analystSnapshot('analyst-links-container');
    queueImmediateSync(5);
    return {ok:true,action:'remove_analyst',index:beforeIndex,requestedIndex,rowKey:liveKey,rowCount:Math.max(1,after.length),verified:true,pcDeleted:true,rowContainerDeleted:beforeCount>1,survivorsPreserved:true,analysts,message:'Tombol delete Row '+(beforeIndex+1)+' diklik dan hasil plugin PC sudah dikirim ke ponsel.'};
  }

  async function refreshToMainAndWait(){
    // REV252: Refresh from Mobile is a complete two-step flow when iSignal is active:
    // 1) click “← kembali” and wait until the iSignal page is really closed;
    // 2) click the normal Refresh button on the main page and wait until its
    //    own refresh-loading lifecycle is finished before returning DONE.
    let usedBackLink=false;
    const back=document.getElementById('isignal-back-link');
    const isignalPanel=document.getElementById('isignal-view');
    if(back && (isVisible(back)||isVisible(isignalPanel)||visibleContainer()==='isignal')){
      try{back.click();}catch(_){try{back.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));}catch(__){}}
      const backStarted=Date.now();let closed=false;
      while(Date.now()-backStarted<18000){
        await sleep(140);
        const backStill=document.getElementById('isignal-back-link');
        const panelStill=document.getElementById('isignal-view');
        const view=visibleContainer();
        if(view!=='isignal' && !(backStill&&isVisible(backStill)) && !(panelStill&&isVisible(panelStill))){closed=true;usedBackLink=true;break;}
      }
      if(!closed)return {ok:false,code:'ISIGNAL_BACK_TIMEOUT',action:'refresh',view:visibleContainer(),message:'Tombol ← kembali sudah diklik, tetapi page iSignal belum menutup di plugin PC.'};
      // Give the main controls a moment to finish their view transition.
      await sleep(160);
    }

    const before=visibleContainer();
    // Once back is completed, prefer the MAIN refresh button. Fallbacks remain
    // for login/intermediate layouts where main is not available.
    let btn=firstVisible(['tf-btn-refresh-main']);
    if(!btn)btn=firstVisible(['tf-btn-refresh-masuk','tf-btn-refresh-isignal']);
    if(!btn)return {ok:false,code:'REFRESH_BUTTON_MISSING',message:'Tombol Refresh tidak tersedia di sidebar PC setelah kembali ke halaman awal.',view:before,usedBackLink};
    if(btn.disabled && !btn.classList.contai
~~~

### snapshot @ 74430
~~~js
reIndex=beforeRows.indexOf(row);
    const liveUrl=analystRowUrlValue(row),liveKey=analystRowRemoteKey(row)||requestedRowKey;
    if(beforeIndex!==requestedIndex&&!requestedRowKey&&!targetUrl)return {ok:false,code:'ANALYST_DELETE_TARGET_MISMATCH',message:'Nomor row ponsel dan plugin PC tidak sama.',requestedIndex,pcIndex:beforeIndex,pcDeleted:false};

    const removeButton=row.querySelector('.analyst-remove-btn');
    if(!removeButton)return {ok:false,code:'ANALYST_DELETE_BUTTON_MISSING',message:'Tombol delete Row '+(beforeIndex+1)+' tidak tersedia di plugin PC.',requestedIndex,pcDeleted:false};

    // REV280: forward the Mobile delete to the exact native X button, then
    // accept the plugin's own confirmation dialog. No parallel delete engine.
    try{removeButton.click();}catch(e){return {ok:false,code:'ANALYST_DELETE_CLICK_FAILED',message:'Tombol delete Row '+(beforeIndex+1)+' gagal diklik: '+cleanText(e&&e.message||e,160),pcDeleted:false};}
    let confirmYes=null;
    const confirmStarted=Date.now();
    while(Date.now()-confirmStarted<2500){
      const overlay=document.getElementById('tf-confirm-overlay');
      const yes=document.getElementById('tf-confirm-yes');
      if(yes&&overlay&&overlay.hidden===false){confirmYes=yes;break;}
      await sleep(20);
    }
    if(!confirmYes)return {ok:false,code:'ANALYST_DELETE_CONFIRM_MISSING',message:'Konfirmasi delete tidak muncul di plugin PC.',requestedIndex,pcDeleted:false};
    try{confirmYes.click();}catch(e){return {ok:false,code:'ANALYST_DELETE_CONFIRM_FAILED',message:'Konfirmasi delete Row '+(beforeIndex+1)+' gagal diklik.',requestedIndex,pcDeleted:false};}

    let verified=false,after=[];
    const started=Date.now();
    while(Date.now()-started<9000){
      await sleep(35);
      after=rowsNow();
      if(beforeCount>1){
        const same=after.some(r=>r===row||(liveKey&&analystRowRemoteKey(r)===liveKey)||(liveUrl&&remoteUrlIdentity(analystRowUrlValue(r))===remoteUrlIdentity(liveUrl)));
        if(!same&&after.length===beforeCount-1){verified=true;break;}
      }else if(row.isConnected&&!analystRowUrlValue(row)){
        if(row.dataset)delete row.dataset.tfRemoteRowKey;
        verified=true;after=rowsNow();break;
      }
    }
    if(!verified)return {ok:false,code:'ANALYST_DELETE_VERIFY_FAILED',message:'Tombol delete sudah diteruskan, tetapi Row '+(beforeIndex+1)+' belum hilang di plugin PC.',requestedIndex,pcDeleted:false};

    await refreshRemoteDataCache();
    const analysts=analystSnapshot('analyst-links-container');
    queueImmediateSync(5);
    return {ok:true,action:'remove_analyst',index:beforeIndex,requestedIndex,rowKey:liveKey,rowCount:Math.max(1,after.length),verified:true,pcDeleted:true,rowContainerDeleted:beforeCount>1,survivorsPreserved:true,analysts,message:'Tombol delete Row '+(beforeIndex+1)+' diklik dan hasil plugin PC sudah dikirim ke ponsel.'};
  }

  async function refreshToMainAndWait(){
    // REV252: Refresh from Mobile is a complete two-step flow when iSignal is active:
    // 1) click “← kembali” and wait until the iSignal page is really closed;
    // 2) click the normal Refresh button on the main page and wait until its
    //    own refresh-loading lifecycle is finished before returning DONE.
    let usedBackLink=false;
    const back=document.getElementById('isignal-back-link');
    const isignalPanel=document.getElementById('isignal-view');
    if(back && (isVisible(back)||isVisible(isignalPanel)||visibleContainer()==='isignal')){
      try{back.click();}catch(_){try{back.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));}catch(__){}}
      const backStarted=Date.now();let closed=false;
      while(Date.now()-backStarted<18000){
        await sleep(140);
        const backStill=document.getElementById('isignal-back-link');
        const panelStill=document.getElementById('isignal-view');
        const view=visibleContainer();
        if(view!=='isignal' && !(backStill&&isVisible(backStill)) && !(panelStill&&isVisible(panelStill))){closed=true;usedBackLink=true;break;}
      }
      if(!closed)return {ok:false,code:'ISIGNAL_BACK_TIMEOUT',action:'refresh',view:visibleContainer(),message:'Tombol ← kembali sudah diklik, tetapi page iSignal belum menutup di plugin PC.'};
      // Give the main controls a moment to finish their view transition.
      await sleep(160);
    }

    const before=visibleContainer();
    // Once back is completed, prefer the MAIN refresh button. Fallbacks remain
    // for login/intermediate layouts where main is not available.
    let btn=firstVisible(['tf-btn-refresh-main']);
    if(!btn)btn=firstVisible(['tf-btn-refresh-masuk','tf-btn-refresh-isignal']);
    if(!btn)return {ok:false,code:'REFRESH_BUTTON_MISSING',message:'Tombol Refresh tidak tersedia di sidebar PC setelah kembali ke halaman awal.',view:before,usedBackLink};
    if(btn.disabled && !btn.classList.contains('tf-refresh-loading'))return {ok:false,code:'REFRESH_DISABLED',message:'Tombol Refresh sedang nonaktif di sidebar PC.',view:before,usedBackLink};

    const preStatus=textOf('status',700);
    try{btn.click();}catch(_){try{btn.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));}catch(__){}}
    const started=Date.now();let sawLoading=btn.classList.contains('tf-refresh-loading');let view=visibleContainer();
    while(Date.now()-started<20000){
      await sleep(140);
      view=visibleContainer();
      const mainBtn=document.getElementById('tf-btn-refresh-main')||btn;
      const loading=!!(mainBtn&&mainBtn.classList.contains('tf-refresh-loading'));
      if(loading)sawLoading=true;
      const status=textOf('status',700);
      const statusDone=/refresh\s+selesai|silakan\s+import\s+file\s+lagi|reset\s+data/i.test(status||'');
      // Primary completion signal is loading-class falling edge. Status text is
      // a fallback for extremely fast refreshes where class transition is missed.
      if(view!=='isignal' && ((sawLoading&&!loading)||(!loading&&statusDone&&status!==preStatus))){
        await refreshRemoteDataCache();
        queueImmediateSync(10);
        return {ok:true,action:'refresh',view:view==='unknown'?'main':view,usedBackLink,refreshClicked:true,message:usedBackLink?'Tombol ← kembali sudah diklik, lalu Refresh halaman utama selesai.':'Refresh halaman utama selesai.'};
      }
    }
    // Do not falsely report DONE when the actual Refresh lifecycle never ended.
    return {ok:false,code:'REFRESH_TIMEOUT',action:'refresh',view:visibleContainer(),usedBackLink,refreshClicked:true,message:'Tombol Refresh sudah diklik, tetapi proses Refresh plugin PC belum memberi signal selesai.'};
  }

  async function scanFromIsignalAndWait(){
    let btn=document.getElementById('scan-from-isignal-btn');
    if(!btn)return {ok:false,code:'SCAN_ISIGNAL_MISSING',message:'Tombol Scan From iSignal User tidak tersedia di sidebar PC.'};
    if(btn.disabled){
      const rr=await refreshToMainAndWait();
      if(!rr.ok)return rr;
      const waitStart=Date.now();
      while(Date.now()-waitStart<12000){await sleep(160);btn=document.getElementById('scan-from-isignal-btn');if(btn&&!btn.disabled)break;}
      if(!btn||btn.disabled)return {ok:false,code:'SCAN_ISIGNAL_STILL_DISABLED',message:'Refresh sudah dijalankan, tetapi Scan From iSignal masih belum available di sidebar PC.'};
    }
    const beforeRows=analystSnapshot('isignal-links-container');
    const started=Date.now();let sawBusy=String(btn.dataset&&btn.dataset.busy||'0')==='1';
    btn.click(); if(String(btn.dataset&&btn.dataset.busy||'0')==='1')sawBusy=true;
    let lastStatus='';
    while(Date.now()-started<100000){
      await sleep(200);
      const isBusy=String(btn.dataset&&btn.dataset.busy||'0')==='1';
      if(isBusy)sawBusy=true;
      lastStatus=textOf('isignal-status',700)||textOf('status',700)||lastStatus;
      if(sawBusy&&!isBusy){
        if(/\b(error|gagal|failed)\b/i.test(lastStatus))return {ok:false,code:'SCAN_ISIGNAL_FAILED',action:'scan_from_isignal',view:visibleContainer(),message:lastStatus||'Scan From iSignal User gagal.',analysts:analystSnapshot('isignal-links-container'),analystsReady:false};

        // REV252: busy=false means the scanner is done, NOT that its DOM rows
        // have necessarily been hydrated. Wait for the result rows themselves.
        let analysts=[];let stableSig='';let stableHits=0;let sawResult=false;
        const settleStarted=Date.now();
        while(Date.now()-settleStarted<18000){
          const now=analystSnapshot('isignal-links-container');
          const sig=now.map(x=>[x.url,(x.pairs||[]).join(','),x.name].join('|')).join('\n');
          const hasRealRows=now.some(x=>String(x&&x.url||'').trim());
          if(hasRealRows)sawResult=true;
          if(sig===stableSig && hasRealRows)stableHits++; else {stableSig=sig;stableHits=0;}
          analysts=now;
          // Require actual analyst rows plus several stable reads before ACK DONE.
          if(sawResult&&stab
~~~

### snapshot @ 79326
~~~js
!btn.classList.contains('tf-refresh-loading'))return {ok:false,code:'REFRESH_DISABLED',message:'Tombol Refresh sedang nonaktif di sidebar PC.',view:before,usedBackLink};

    const preStatus=textOf('status',700);
    try{btn.click();}catch(_){try{btn.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));}catch(__){}}
    const started=Date.now();let sawLoading=btn.classList.contains('tf-refresh-loading');let view=visibleContainer();
    while(Date.now()-started<20000){
      await sleep(140);
      view=visibleContainer();
      const mainBtn=document.getElementById('tf-btn-refresh-main')||btn;
      const loading=!!(mainBtn&&mainBtn.classList.contains('tf-refresh-loading'));
      if(loading)sawLoading=true;
      const status=textOf('status',700);
      const statusDone=/refresh\s+selesai|silakan\s+import\s+file\s+lagi|reset\s+data/i.test(status||'');
      // Primary completion signal is loading-class falling edge. Status text is
      // a fallback for extremely fast refreshes where class transition is missed.
      if(view!=='isignal' && ((sawLoading&&!loading)||(!loading&&statusDone&&status!==preStatus))){
        await refreshRemoteDataCache();
        queueImmediateSync(10);
        return {ok:true,action:'refresh',view:view==='unknown'?'main':view,usedBackLink,refreshClicked:true,message:usedBackLink?'Tombol ← kembali sudah diklik, lalu Refresh halaman utama selesai.':'Refresh halaman utama selesai.'};
      }
    }
    // Do not falsely report DONE when the actual Refresh lifecycle never ended.
    return {ok:false,code:'REFRESH_TIMEOUT',action:'refresh',view:visibleContainer(),usedBackLink,refreshClicked:true,message:'Tombol Refresh sudah diklik, tetapi proses Refresh plugin PC belum memberi signal selesai.'};
  }

  async function scanFromIsignalAndWait(){
    let btn=document.getElementById('scan-from-isignal-btn');
    if(!btn)return {ok:false,code:'SCAN_ISIGNAL_MISSING',message:'Tombol Scan From iSignal User tidak tersedia di sidebar PC.'};
    if(btn.disabled){
      const rr=await refreshToMainAndWait();
      if(!rr.ok)return rr;
      const waitStart=Date.now();
      while(Date.now()-waitStart<12000){await sleep(160);btn=document.getElementById('scan-from-isignal-btn');if(btn&&!btn.disabled)break;}
      if(!btn||btn.disabled)return {ok:false,code:'SCAN_ISIGNAL_STILL_DISABLED',message:'Refresh sudah dijalankan, tetapi Scan From iSignal masih belum available di sidebar PC.'};
    }
    const beforeRows=analystSnapshot('isignal-links-container');
    const started=Date.now();let sawBusy=String(btn.dataset&&btn.dataset.busy||'0')==='1';
    btn.click(); if(String(btn.dataset&&btn.dataset.busy||'0')==='1')sawBusy=true;
    let lastStatus='';
    while(Date.now()-started<100000){
      await sleep(200);
      const isBusy=String(btn.dataset&&btn.dataset.busy||'0')==='1';
      if(isBusy)sawBusy=true;
      lastStatus=textOf('isignal-status',700)||textOf('status',700)||lastStatus;
      if(sawBusy&&!isBusy){
        if(/\b(error|gagal|failed)\b/i.test(lastStatus))return {ok:false,code:'SCAN_ISIGNAL_FAILED',action:'scan_from_isignal',view:visibleContainer(),message:lastStatus||'Scan From iSignal User gagal.',analysts:analystSnapshot('isignal-links-container'),analystsReady:false};

        // REV252: busy=false means the scanner is done, NOT that its DOM rows
        // have necessarily been hydrated. Wait for the result rows themselves.
        let analysts=[];let stableSig='';let stableHits=0;let sawResult=false;
        const settleStarted=Date.now();
        while(Date.now()-settleStarted<18000){
          const now=analystSnapshot('isignal-links-container');
          const sig=now.map(x=>[x.url,(x.pairs||[]).join(','),x.name].join('|')).join('\n');
          const hasRealRows=now.some(x=>String(x&&x.url||'').trim());
          if(hasRealRows)sawResult=true;
          if(sig===stableSig && hasRealRows)stableHits++; else {stableSig=sig;stableHits=0;}
          analysts=now;
          // Require actual analyst rows plus several stable reads before ACK DONE.
          if(sawResult&&stableHits>=3)break;
          // Explicit no-result status is the only case where zero analysts may complete early.
          if(!hasRealRows && /(?:0\s+analis|tidak\s+ada\s+(?:analis|link)|no\s+(?:analyst|results?))/i.test(lastStatus||'') && Date.now()-settleStarted>1800)break;
          await sleep(220);
        }
        const hasRealRows=analysts.some(x=>String(x&&x.url||'').trim());
        const explicitEmpty=/(?:0\s+analis|tidak\s+ada\s+(?:analis|link)|no\s+(?:analyst|results?))/i.test(lastStatus||'');
        if(!hasRealRows&&!explicitEmpty){
          return {ok:false,code:'SCAN_RESULT_HYDRATION_TIMEOUT',action:'scan_from_isignal',view:'isignal',message:'Scan PC selesai, tetapi link analis belum selesai muncul di plugin PC. Loading Mobile tidak boleh ditutup.',analysts,analystsReady:false,analystCount:0};
        }
        await refreshRemoteDataCache();
        queueImmediateSync(10);
        return {ok:true,action:'scan_from_isignal',view:'isignal',message:lastStatus||('Scan From iSignal User selesai. '+analysts.length+' analis ditemukan.'),analysts,analystsReady:true,analystCount:analysts.length,hydratedAt:Date.now(),previousAnalystCount:beforeRows.length};
      }
    }
    return {ok:false,code:'SCAN_ISIGNAL_TIMEOUT',action:'scan_from_isignal',message:'Scan From iSignal User masih belum memberi signal selesai dari plugin PC.'};
  }

  function clearScanLog(){
    const els=['scan-channel-status-clear','scan-channel-status-clear-isignal'];
    let n=0;
    for(const id of els){const e=document.getElementById(id);if(e){e.click();n++;}}
    return n?{ok:true,message:'Log/progress scan dibersihkan.'}:{ok:false,message:'Kontrol Clear Scan Log tidak ditemukan.'};
  }

  function clearPowerLog(){
    const e=document.getElementById('tf-power-sleep-clear');
    if(!e) return {ok:false,message:'Power / Sleep Event Log tidak tersedia.'};
    e.click();
    return {ok:true,message:'Power / Sleep Event Log dibersihkan.'};
  }

  function b64ToBytes(b64){
    const bin=atob(String(b64||''));const out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out;
  }
  async function decodeTransferText(b64,encoding){
    const bytes=b64ToBytes(b64);
    if(String(encoding||'')==='gzip'){
      if(typeof DecompressionStream!=='function')throw new Error('Chrome tidak mendukung decompression import Remote.');
      const ds=new DecompressionStream('gzip');return await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text();
    }
    return new TextDecoder().decode(bytes);
  }
  async function clearOldImportTransferChunks(){
    try{
      const all=await storageGet(null);const keys=Object.keys(all||{}).filter(k=>k===REMOTE_IMPORT_META_KEY||k.startsWith(REMOTE_IMPORT_CHUNK_PREFIX));
      if(keys.length)await storageRemove(keys);
    }catch(_){}
  }
  async function finalizeImportTransfer(id){
    const st=await storageGet([REMOTE_IMPORT_META_KEY]);const meta=st[REMOTE_IMPORT_META_KEY];
    if(!meta||meta.id!==id){const cached=IMPORT_COMPLETED_CACHE.get(id);if(cached&&Date.now()-cached.at<5*60*1000)return cached.result;return {ok:false,code:'IMPORT_SESSION_MISSING',message:'Sesi Import Remote tidak ditemukan.'};}
    const keys=[];for(let i=0;i<meta.total;i++)keys.push(REMOTE_IMPORT_CHUNK_PREFIX+id+'_'+i);
    const chunks=await storageGet(keys);const missing=[];let b64='';
    for(let i=0;i<keys.length;i++){const value=chunks[keys[i]];if(typeof value!=='string')missing.push(i);else b64+=value;}
    if(missing.length)return {ok:true,action:'import_bundle_chunk',complete:false,transferId:id,missingIndexes:missing,message:'Ada '+missing.length+' chunk yang perlu dikirim ulang.'};
    let payloadObj;try{payloadObj=JSON.parse(await decodeTransferText(b64,meta.encoding));}catch(e){return {ok:false,code:'IMPORT_JSON_DECODE_FAILED',message:'File JSON Remote gagal dibaca: '+(e.message||e)};}
    await storageRemove(IMPORT_DATA_KEYS);
    const result=await new Promise(resolve=>{
      try{
        if(typeof window.tf_importPayloadToStorage==='function')window.tf_importPayloadToStorage(payloadObj,()=>resolve({ok:true,action:'import_bundle_chunk',complete:true,transferId:id,message:'Import dari ponsel diterapkan ke plugin Chrome.'}));
        else{const data=payloadObj&&payloadObj.storage&&typeof payloadObj.storage==='object'?payloadObj.storage:payloadObj;chrome.storage.local.set(data||{},()=>resolve({ok:true,action:'import_bundle_chunk',complete:true,transferId:id,message:'Import dari ponsel diterapkan ke storage Chrome.'}));}
      }catch(e){resolve({ok:false,code:'IMPORT_APPLY_FAILED',message:'Import gagal diterapkan: '+(e.message||e)});}
    });
    if(result&&result.ok!==false){
      await storageSet({tfHasImportedBundle:true,tfLastImportAt:Date.now(),tfLastImportMeta:{source:'MOBILE_REMOTE',fileName:meta.fileName||'',importedAt:new Date().toISOString()}});
      await storageR
~~~

### snapshot @ 93304
~~~js
f(typeof staged.data!=='string'){
      // Legacy REV245 staging: request the whole object once.
      staged=await api('/remote/import-stage-get',{...a,transferId:id},60000);
    }
    if(!staged||staged.complete!==true||typeof staged.data!=='string')return {ok:false,code:'IMPORT_STAGE_INCOMPLETE',message:staged&&staged.message||'Fast Import staging belum lengkap.'};
    const text=await decodeTransferText(staged.data,staged.encoding);
    let payloadObj;try{payloadObj=JSON.parse(text);}catch(_){return {ok:false,code:'IMPORT_JSON_INVALID',message:'JSON Fast Import tidak valid setelah diterima PC.'};}
    const result=await new Promise(resolve=>{
      try{
        if(typeof window.tf_importPayloadToStorage==='function')window.tf_importPayloadToStorage(payloadObj,()=>resolve({ok:true,action:'import_bundle_commit',complete:true,transferId:id,message:'Fast Import diterapkan ke plugin Chrome.'}));
        else{const data=payloadObj&&payloadObj.storage&&typeof payloadObj.storage==='object'?payloadObj.storage:payloadObj;chrome.storage.local.set(data||{},()=>resolve({ok:true,action:'import_bundle_commit',complete:true,transferId:id,message:'Fast Import diterapkan ke storage Chrome.'}));}
      }catch(e){resolve({ok:false,code:'IMPORT_APPLY_FAILED',message:e&&e.message?e.message:String(e)});}
    });
    if(result.ok){try{await api('/remote/import-stage-clear',{...a,transferId:id},45000);}catch(_){ }await refreshRemoteDataCache();queueImmediateSync(20);}
    return result;
  }

  async function importBundleCommit(payload){
    if(payload&&payload.stagedV3===true)return await importStagedBundleV245(payload);
    const id=cleanText(payload.transferId,100);return await finalizeImportTransfer(id);
  }

  async function gzipToBase64(text){
    const bytes=new TextEncoder().encode(text);let data=bytes,encoding='plain';
    if(typeof CompressionStream==='function'){
      try{const cs=new CompressionStream('gzip');const ab=await new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer();data=new Uint8Array(ab);encoding='gzip';}catch(_){}
    }
    let bin='';for(let i=0;i<data.length;i+=0x6000)bin+=String.fromCharCode(...data.subarray(i,i+0x6000));
    return {encoding,b64:btoa(bin)};
  }
  async function exportBundlePrepare(request={}){
    await refreshRemoteDataCache();
    const purpose=String(request&&request.purpose||'user-export').trim().toLowerCase();
    const prewarm=request&&request.prewarm===true;
    // REV292: Mobile mirror may reuse the Drive snapshot staged immediately after Import/Combine.
    // Explicit user Export intentionally never reuses it, so the file always contains the newest PC data.
    if(purpose==='mirror'&&!prewarm){
      try{
        if(!MIRROR_PRESTAGE_V292){const st=await storageGet([MIRROR_PRESTAGE_KEY_V292]);MIRROR_PRESTAGE_V292=st&&st[MIRROR_PRESTAGE_KEY_V292]||null;}
        const r=MIRROR_PRESTAGE_V292;
        if(r&&r.relayMode==='drive-v1'&&Date.now()-Number(r.createdAt||0)<30*60*1000&&(!dataFingerprintCache||!r.fingerprint||r.fingerprint===dataFingerprintCache)){
          return Object.assign({},r,{ok:true,action:'export_bundle_prepare',reusedPrestage:true,message:'Snapshot Import sudah siap di private Drive relay; Mobile dapat langsung mengunduh 1 file.'});
        }
      }catch(_){}
    }
    try{if(typeof window.saveRememberedAnalystLinks==='function')window.saveRememberedAnalystLinks();}catch(_){}
    const data=await storageGet([...EXPORT_DATA_KEYS,'tfUserProfile','tfLastScanMeta','tfLastImportMeta']);

    // REV258: build the Remote export from the same PC-side source set used by
    // the plugin's native Export JSON. Never export the Mobile mirror as truth.
    const liveRows=analystSnapshot('analyst-links-container').filter(x=>x&&x.url);
    if(liveRows.length){
      data.tfRememberedAnalystLinks=liveRows.map(x=>({url:cleanText(x.url,520),name:cleanText(x.name,90),analystName:cleanText(x.name,90),pairs:normalizePairs(x.pairs)}));
      data.tfRememberLinksEnabled=true;
      const src=data.tfAnalystSources&&typeof data.tfAnalystSources==='object'?data.tfAnalystSources:null;
      if(src){
        const pairByUrl=new Map(liveRows.map(x=>[cleanText(x.url,520),normalizePairs(x.pairs)]));
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
    EXPORT_TRANSFER_CACHE.set(id,{chunks,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache,legacyFallback:true});
    for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
    return {ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:total,chunkSize,relayMode:'legacy-chunks',encoding:packed.encoding,fingerprint:dataFingerprintCache,fullExport:true,message:forceLegacy?'Fallback realtime cepat siap.':'T
~~~

### snapshot @ 124857
~~~js
teAvailabilityEnabled)return;
    if(!cmd || !cmd.id) return;
    const cmdId=String(cmd.id);
    const clientCommandId=cleanText(cmd&&cmd.payload&&cmd.payload.clientCommandId||'',100);
    if(activeCommandId===cmdId)return;
    const st=await storageGet([LAST_EXEC_KEY]);
    let rec=st[LAST_EXEC_KEY];
    // REV267: if WebSocket already executed this user tap, a later HTTP fallback
    // carrying the same clientCommandId is ACKed without clicking twice.
    if(clientCommandId&&rec&&rec.clientCommandId===clientCommandId&&rec.result){
      try{
        const ack=await api('/remote/desktop-ack',{...a,commandId:cmdId,success:!!rec.result.ok,result:rec.result});
        if(ack&&ack.ack){rec={id:cmdId,clientCommandId,result:rec.result,at:Date.now(),acked:true};await storageSet({[LAST_EXEC_KEY]:rec});}
      }catch(_){}
      return;
    }
    if(rec && rec.id===cmdId && rec.result){
      try{await retryStoredAck(a);}catch(_){}
      return;
    }
    if(activeCommandId&&activeCommandId!==cmdId)return;
    activeCommandId=cmdId;
    let result;
    remoteApplying=true;
    try{result=await execute(cmd);}catch(e){result={ok:false,message:e&&e.message?e.message:String(e)};}
    finally{remoteApplying=false;}
    try{
      rec={id:cmdId,clientCommandId,result:result||{ok:false,message:'Tidak ada hasil command.'},at:Date.now(),acked:false};
      const commandMeta=cmd&&cmd.command||cmd||{};const commandAction=String(commandMeta.action||'').trim().toLowerCase();
      if(commandAction==='refresh'){
        // REV286: the Refresh button can clear LAST_EXEC_KEY before the generic
        // retryStoredAck() reads it. ACK the backend directly first using the
        // already captured authenticated session, then persist only as best effort.
        try{
          const ack=await api('/remote/desktop-ack',{...a,commandId:cmdId,success:!!rec.result.ok,result:rec.result});
          if(ack&&ack.ack){rec.acked=true;rec.ackedAt=Date.now();}
        }catch(_){}
        try{await storageSet({[LAST_EXEC_KEY]:rec});}catch(_){}
        if(!rec.acked){try{await retryStoredAck(a);}catch(_){}}
      }else{
        // Persist before ACK. If the ACK request is lost, the same command ID is
        // never executed twice (important for Submit/Stop toggle).
        await storageSet({[LAST_EXEC_KEY]:rec});
        try{await retryStoredAck(a);}catch(_){}
      }
    }finally{
      if(activeCommandId===cmdId)activeCommandId='';
      queueImmediateSync(40);
    }
  }

  function fastSnapshotSig(value){
    let text='';
    try{text=JSON.stringify(value||{});}catch(_){text=String(value||'');}
    let h=2166136261>>>0;
    for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
    return text.length.toString(36)+'-'+h.toString(36);
  }

  function scheduleNext(ms){
    if(timer) clearTimeout(timer);
    timer=setTimeout(()=>{timer=null;void syncOnce();},Math.max(500,Number(ms)||SYNC_IDLE_MS));
  }

  async function syncOnce(){
    if(!remoteAvailabilityEnabled){renderRemoteMobileStatus(false);scheduleNext(30000);return;}
    if(busy){scheduleNext(500);return;}
    busy=true;
    try{
      const a=await auth();
      if(!a){renderRemoteMobileStatus(false);failureCount=0;lastSuccessAt=0;return;}

      try{await retryStoredAck(a);}catch(_){}
      if(!lastRemoteDataCacheAt||Date.now()-lastRemoteDataCacheAt>5000)await refreshRemoteDataCache();
      const manifest=chrome.runtime.getManifest?chrome.runtime.getManifest():{};
      // REV260: if the Mobile Remote page is closed, send only the compact core
      // snapshot. The first successful presence response flips us to a full live
      // snapshot immediately.
      const snapshot=buildSnapshot(!remoteMobileOnline);
      const r=await api('/remote/desktop-sync',{
        ...a,
        extensionVersion:String(manifest.version_name||manifest.version||'REV279'),
        snapshot,
        snapshotSig:fastSnapshotSig(snapshot)
      });
      if(r && r.retry){
        // REV248: transient Apps Script cold-start is not an OFFLINE event.
        // Keep the sidebar badge ONLINE and retry without hammering the relay.
        return;
      }
      failureCount=0;
      lastSuccessAt=Date.now();browserCoreHttpReadyAt=lastSuccessAt;
      // REV260: Remote badge represents the MOBILE Remote page presence, not merely
      // the fact that the desktop sidebar live connection is active. Sidebar can stay in
      // standby while the badge correctly shows Remote Offline.
      const wasMobileOnline=remoteMobileOnline;
      renderRemoteMobileStatus(!!(r&&r.mobileRemoteOnline));
      if(!wasMobileOnline&&remoteMobileOnline){
        // Mobile just opened: publish a full live snapshot immediately after the
        // compact bootstrap snapshot.
        scheduleNext(120);
      }
      if(r&&r.command) void processCommand(a,r.command);
    }catch(_){
      failureCount+=1;
      // A single network/cold-start hiccup must not make the badge flicker.
      if(failureCount>=6 && (!lastSuccessAt || Date.now()-lastSuccessAt>45000)){browserCoreHttpReadyAt=0;renderRemoteMobileStatus(false);}
    }finally{
      busy=false;
      if(!timer){if(directSocketOpen()||relaySocketOpen()){httpRecoveryStep=0;scheduleNext(30000);}else{const delay=HTTP_RECOVERY_BACKOFF_MS[Math.min(httpRecoveryStep,HTTP_RECOVERY_BACKOFF_MS.length-1)];httpRecoveryStep=Math.min(httpRecoveryStep+1,HTTP_RECOVERY_BACKOFF_MS.length-1);scheduleNext(delay);}}
    }
  }

  function queueImmediateSync(delay=100){
    if(immediateSyncTimer)clearTimeout(immediateSyncTimer);
    immediateSyncTimer=setTimeout(()=>{
      immediateSyncTimer=null;
      // REV268: realtime transports push state directly. Do not turn every UI
      // event back into an Apps Script/HTTP round-trip.
      if(directSocketOpen()){sendDirectSnapshot();queueFastSnapshot(10);if(timer){clearTimeout(timer);timer=null;}scheduleNext(30000);return;}
      if(relaySocketOpen()){queueFastSnapshot(10);if(timer){clearTimeout(timer);timer=null;}scheduleNext(30000);return;}
      if(!busy){if(timer){clearTimeout(timer);timer=null;}void syncOnce();}
    },Math.max(15,delay));
  }
  function noteUiEvent(action,label,delay=100){
    lastUiEvent={seq:Number(lastUiEvent.seq||0)+1,action:String(action||''),label:cleanText(label||action,120),source:remoteApplying?'MOBILE':'PC',at:Date.now()};
    if(directSocketOpen())sendDirectSnapshot();queueFastSnapshot(Math.min(80,delay));
    queueImmediateSync(delay);
  }
  function installRealtimeUiBridge(){
    const clickMap={
      'tf-btn-update-main':['update','Update'],'tf-btn-update-masuk':['update','Update'],'tf-btn-update-isignal':['update','Update'],
      'tf-btn-refresh-main':['refresh','Refresh'],'tf-btn-refresh-masuk':['refresh','Refresh'],'tf-btn-refresh-isignal':['refresh','Refresh'],
      'batch-scan-btn':['batch_toggle','Submit / Batch'],'batch-scan-isignal-btn':['batch_toggle','Submit / Batch'],
      'scan-from-isignal-btn':['scan_from_isignal','Scan From iSignal User'],'open-dashboard-btn':['open_dashboard','Buka Dashboard'],
      'add-analyst-btn':['add_analyst','Add Analis'],'tf-btn-add-analyst-main':['add_analyst','Add Analis'],'add-analyst-isignal-btn':['add_analyst','Add Analis']
    };
    document.addEventListener('click',e=>{const el=e.target&&e.target.closest?e.target.closest('button,a'):null;if(!el)return;const rec=clickMap[el.id];if(rec)noteUiEvent(rec[0],rec[1],80);},true);
    document.addEventListener('change',e=>{const el=e.target;if(!el)return;if(el.id==='remember-all-links-checkbox')noteUiEvent('set_remember_links','Remember Links',90);else if(/tf-time-range|time-range/i.test(String(el.id||'')))noteUiEvent('set_time_range','Time Range',90);else if(el.matches&&el.matches('.analyst-pair-select,.pair-multiselect input'))noteUiEvent('patch_analyst','Pair Analis',140);},true);
    let analystInputTimer=null;
    document.addEventListener('input',e=>{const el=e.target;if(!(el&&el.matches&&el.matches('.analyst-link-input')))return;if(analystInputTimer)clearTimeout(analystInputTimer);analystInputTimer=setTimeout(()=>{analystInputTimer=null;noteUiEvent('patch_analyst','Link Analis',80);},180);},true);
  }

  function installRealtimeLoginViewWatcher(){
    // REV254: storage can lag behind the visible sidebar during logout. The
    // visible login page is authoritative and should be mirrored immediately.
    if(loginViewWatchTimer)return;
    lastLoginViewObserved=visibleContainer();
    loginViewWatchTimer=setInterval(()=>{
      try{
        const view=visibleContainer();
        if(view===lastLoginViewObserved)return;
        lastLoginViewObserved=view;
        void refreshRemoteDataCache().then(()=>queueImmediateSync(20));
      }catch(_){ }
    },220);
  }

  function start(){
    // REV354: bootstrap the persisted toggle before the first visual render.
    // Background status remains authoritative and will reconcile immediately.
    void storageGet([REMOTE_ENABLED_KEY]).then(st=>{
      if(!remoteAvailability
~~~

### snapshot @ 128169
~~~js
tRemoteDataCacheAt||Date.now()-lastRemoteDataCacheAt>5000)await refreshRemoteDataCache();
      const manifest=chrome.runtime.getManifest?chrome.runtime.getManifest():{};
      // REV260: if the Mobile Remote page is closed, send only the compact core
      // snapshot. The first successful presence response flips us to a full live
      // snapshot immediately.
      const snapshot=buildSnapshot(!remoteMobileOnline);
      const r=await api('/remote/desktop-sync',{
        ...a,
        extensionVersion:String(manifest.version_name||manifest.version||'REV279'),
        snapshot,
        snapshotSig:fastSnapshotSig(snapshot)
      });
      if(r && r.retry){
        // REV248: transient Apps Script cold-start is not an OFFLINE event.
        // Keep the sidebar badge ONLINE and retry without hammering the relay.
        return;
      }
      failureCount=0;
      lastSuccessAt=Date.now();browserCoreHttpReadyAt=lastSuccessAt;
      // REV260: Remote badge represents the MOBILE Remote page presence, not merely
      // the fact that the desktop sidebar live connection is active. Sidebar can stay in
      // standby while the badge correctly shows Remote Offline.
      const wasMobileOnline=remoteMobileOnline;
      renderRemoteMobileStatus(!!(r&&r.mobileRemoteOnline));
      if(!wasMobileOnline&&remoteMobileOnline){
        // Mobile just opened: publish a full live snapshot immediately after the
        // compact bootstrap snapshot.
        scheduleNext(120);
      }
      if(r&&r.command) void processCommand(a,r.command);
    }catch(_){
      failureCount+=1;
      // A single network/cold-start hiccup must not make the badge flicker.
      if(failureCount>=6 && (!lastSuccessAt || Date.now()-lastSuccessAt>45000)){browserCoreHttpReadyAt=0;renderRemoteMobileStatus(false);}
    }finally{
      busy=false;
      if(!timer){if(directSocketOpen()||relaySocketOpen()){httpRecoveryStep=0;scheduleNext(30000);}else{const delay=HTTP_RECOVERY_BACKOFF_MS[Math.min(httpRecoveryStep,HTTP_RECOVERY_BACKOFF_MS.length-1)];httpRecoveryStep=Math.min(httpRecoveryStep+1,HTTP_RECOVERY_BACKOFF_MS.length-1);scheduleNext(delay);}}
    }
  }

  function queueImmediateSync(delay=100){
    if(immediateSyncTimer)clearTimeout(immediateSyncTimer);
    immediateSyncTimer=setTimeout(()=>{
      immediateSyncTimer=null;
      // REV268: realtime transports push state directly. Do not turn every UI
      // event back into an Apps Script/HTTP round-trip.
      if(directSocketOpen()){sendDirectSnapshot();queueFastSnapshot(10);if(timer){clearTimeout(timer);timer=null;}scheduleNext(30000);return;}
      if(relaySocketOpen()){queueFastSnapshot(10);if(timer){clearTimeout(timer);timer=null;}scheduleNext(30000);return;}
      if(!busy){if(timer){clearTimeout(timer);timer=null;}void syncOnce();}
    },Math.max(15,delay));
  }
  function noteUiEvent(action,label,delay=100){
    lastUiEvent={seq:Number(lastUiEvent.seq||0)+1,action:String(action||''),label:cleanText(label||action,120),source:remoteApplying?'MOBILE':'PC',at:Date.now()};
    if(directSocketOpen())sendDirectSnapshot();queueFastSnapshot(Math.min(80,delay));
    queueImmediateSync(delay);
  }
  function installRealtimeUiBridge(){
    const clickMap={
      'tf-btn-update-main':['update','Update'],'tf-btn-update-masuk':['update','Update'],'tf-btn-update-isignal':['update','Update'],
      'tf-btn-refresh-main':['refresh','Refresh'],'tf-btn-refresh-masuk':['refresh','Refresh'],'tf-btn-refresh-isignal':['refresh','Refresh'],
      'batch-scan-btn':['batch_toggle','Submit / Batch'],'batch-scan-isignal-btn':['batch_toggle','Submit / Batch'],
      'scan-from-isignal-btn':['scan_from_isignal','Scan From iSignal User'],'open-dashboard-btn':['open_dashboard','Buka Dashboard'],
      'add-analyst-btn':['add_analyst','Add Analis'],'tf-btn-add-analyst-main':['add_analyst','Add Analis'],'add-analyst-isignal-btn':['add_analyst','Add Analis']
    };
    document.addEventListener('click',e=>{const el=e.target&&e.target.closest?e.target.closest('button,a'):null;if(!el)return;const rec=clickMap[el.id];if(rec)noteUiEvent(rec[0],rec[1],80);},true);
    document.addEventListener('change',e=>{const el=e.target;if(!el)return;if(el.id==='remember-all-links-checkbox')noteUiEvent('set_remember_links','Remember Links',90);else if(/tf-time-range|time-range/i.test(String(el.id||'')))noteUiEvent('set_time_range','Time Range',90);else if(el.matches&&el.matches('.analyst-pair-select,.pair-multiselect input'))noteUiEvent('patch_analyst','Pair Analis',140);},true);
    let analystInputTimer=null;
    document.addEventListener('input',e=>{const el=e.target;if(!(el&&el.matches&&el.matches('.analyst-link-input')))return;if(analystInputTimer)clearTimeout(analystInputTimer);analystInputTimer=setTimeout(()=>{analystInputTimer=null;noteUiEvent('patch_analyst','Link Analis',80);},180);},true);
  }

  function installRealtimeLoginViewWatcher(){
    // REV254: storage can lag behind the visible sidebar during logout. The
    // visible login page is authoritative and should be mirrored immediately.
    if(loginViewWatchTimer)return;
    lastLoginViewObserved=visibleContainer();
    loginViewWatchTimer=setInterval(()=>{
      try{
        const view=visibleContainer();
        if(view===lastLoginViewObserved)return;
        lastLoginViewObserved=view;
        void refreshRemoteDataCache().then(()=>queueImmediateSync(20));
      }catch(_){ }
    },220);
  }

  function start(){
    // REV354: bootstrap the persisted toggle before the first visual render.
    // Background status remains authoritative and will reconcile immediately.
    void storageGet([REMOTE_ENABLED_KEY]).then(st=>{
      if(!remoteAvailabilityLoaded){
        remoteAvailabilityEnabled=st&&st[REMOTE_ENABLED_KEY]===true;
        remoteAvailabilityLoaded=true;
        renderRemoteMobileStatus(remoteMobileOnline);
      }
    }).catch(()=>{});
    installRealtimeUiBridge();
    installRealtimeLoginViewWatcher();
    const tfExecutorLive=setInterval(()=>{try{chrome.runtime.sendMessage({type:'TF_REMOTE_EXECUTOR_LIVE',at:Date.now()},()=>{try{void chrome.runtime.lastError;}catch(_){}});}catch(_){}},30000);
    try{chrome.runtime.sendMessage({type:'TF_REMOTE_EXECUTOR_HEARTBEAT',at:Date.now()},()=>{try{void chrome.runtime.lastError;}catch(_){}});}catch(_){}
    try{
      if(typeof chrome!=='undefined'&&chrome.storage&&chrome.storage.onChanged){
        const realtimeKeys=new Set([REMOTE_ENABLED_KEY,'tfLoginConfirmed','tfAccountLoginState','tfRootLoginState','tfEnteredMain','tfUserProfile','tfLoginError','tfForceLoginForm','tfExplicitLogoutAt','tfScanInProgress','tfAnalystSources']);
        chrome.storage.onChanged.addListener((changes,area)=>{
          if(area!=='local')return;
          if(changes&&changes[REMOTE_ENABLED_KEY]){remoteAvailabilityEnabled=changes[REMOTE_ENABLED_KEY].newValue===true;remoteAvailabilityLoaded=true;renderRemoteMobileStatus(remoteMobileOnline);}if(Object.keys(changes||{}).some(k=>realtimeKeys.has(k))){void refreshRemoteDataCache().then(()=>{if(remoteAvailabilityEnabled){queueFastSnapshot(20);queueImmediateSync(20);}});}
        });
      }
    }catch(_){ }
    if(!badgeTimer){
      badgeTimer=setInterval(()=>{
        const b=ensureRemoteStatusUi();
        if(b) renderRemoteMobileStatus(remoteMobileOnline);
      },1500);
    }
    void syncOnce();
    void connectFastLane();
    window.addEventListener('focus',()=>{if(!busy){if(timer){clearTimeout(timer);timer=null;}void syncOnce();}if(!relaySocketOpen())void connectFastLane();},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(!busy){if(timer){clearTimeout(timer);timer=null;}void syncOnce();}if(!relaySocketOpen())void connectFastLane();}});
    window.addEventListener('beforeunload',()=>{
      closeFastLane();
      try{chrome.runtime.sendMessage({type:'TF_REMOTE_EXECUTOR_GONE',at:Date.now()},()=>{try{void chrome.runtime.lastError;}catch(_){}});}catch(_){}
      if(timer)clearTimeout(timer);timer=null;
      if(badgeTimer)clearInterval(badgeTimer);badgeTimer=null;
      if(loginViewWatchTimer)clearInterval(loginViewWatchTimer);loginViewWatchTimer=null;
      try{clearInterval(tfExecutorLive);}catch(_){}
    },{once:true});
  }

  // REV240: do NOT observe the full DOM and mutate the same subtree from a
  // MutationObserver callback. REV234 did that for the Remote badge and could
  // create a self-triggering mutation loop after activation, leaving the side
  // panel visually blank/black. A lightweight UI refresh safely recreates the badge instead.
  start();
})();

~~~

### snapshot @ 132740
~~~js
ment.addEventListener('input',e=>{const el=e.target;if(!(el&&el.matches&&el.matches('.analyst-link-input')))return;if(analystInputTimer)clearTimeout(analystInputTimer);analystInputTimer=setTimeout(()=>{analystInputTimer=null;noteUiEvent('patch_analyst','Link Analis',80);},180);},true);
  }

  function installRealtimeLoginViewWatcher(){
    // REV254: storage can lag behind the visible sidebar during logout. The
    // visible login page is authoritative and should be mirrored immediately.
    if(loginViewWatchTimer)return;
    lastLoginViewObserved=visibleContainer();
    loginViewWatchTimer=setInterval(()=>{
      try{
        const view=visibleContainer();
        if(view===lastLoginViewObserved)return;
        lastLoginViewObserved=view;
        void refreshRemoteDataCache().then(()=>queueImmediateSync(20));
      }catch(_){ }
    },220);
  }

  function start(){
    // REV354: bootstrap the persisted toggle before the first visual render.
    // Background status remains authoritative and will reconcile immediately.
    void storageGet([REMOTE_ENABLED_KEY]).then(st=>{
      if(!remoteAvailabilityLoaded){
        remoteAvailabilityEnabled=st&&st[REMOTE_ENABLED_KEY]===true;
        remoteAvailabilityLoaded=true;
        renderRemoteMobileStatus(remoteMobileOnline);
      }
    }).catch(()=>{});
    installRealtimeUiBridge();
    installRealtimeLoginViewWatcher();
    const tfExecutorLive=setInterval(()=>{try{chrome.runtime.sendMessage({type:'TF_REMOTE_EXECUTOR_LIVE',at:Date.now()},()=>{try{void chrome.runtime.lastError;}catch(_){}});}catch(_){}},30000);
    try{chrome.runtime.sendMessage({type:'TF_REMOTE_EXECUTOR_HEARTBEAT',at:Date.now()},()=>{try{void chrome.runtime.lastError;}catch(_){}});}catch(_){}
    try{
      if(typeof chrome!=='undefined'&&chrome.storage&&chrome.storage.onChanged){
        const realtimeKeys=new Set([REMOTE_ENABLED_KEY,'tfLoginConfirmed','tfAccountLoginState','tfRootLoginState','tfEnteredMain','tfUserProfile','tfLoginError','tfForceLoginForm','tfExplicitLogoutAt','tfScanInProgress','tfAnalystSources']);
        chrome.storage.onChanged.addListener((changes,area)=>{
          if(area!=='local')return;
          if(changes&&changes[REMOTE_ENABLED_KEY]){remoteAvailabilityEnabled=changes[REMOTE_ENABLED_KEY].newValue===true;remoteAvailabilityLoaded=true;renderRemoteMobileStatus(remoteMobileOnline);}if(Object.keys(changes||{}).some(k=>realtimeKeys.has(k))){void refreshRemoteDataCache().then(()=>{if(remoteAvailabilityEnabled){queueFastSnapshot(20);queueImmediateSync(20);}});}
        });
      }
    }catch(_){ }
    if(!badgeTimer){
      badgeTimer=setInterval(()=>{
        const b=ensureRemoteStatusUi();
        if(b) renderRemoteMobileStatus(remoteMobileOnline);
      },1500);
    }
    void syncOnce();
    void connectFastLane();
    window.addEventListener('focus',()=>{if(!busy){if(timer){clearTimeout(timer);timer=null;}void syncOnce();}if(!relaySocketOpen())void connectFastLane();},{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden){if(!busy){if(timer){clearTimeout(timer);timer=null;}void syncOnce();}if(!relaySocketOpen())void connectFastLane();}});
    window.addEventListener('beforeunload',()=>{
      closeFastLane();
      try{chrome.runtime.sendMessage({type:'TF_REMOTE_EXECUTOR_GONE',at:Date.now()},()=>{try{void chrome.runtime.lastError;}catch(_){}});}catch(_){}
      if(timer)clearTimeout(timer);timer=null;
      if(badgeTimer)clearInterval(badgeTimer);badgeTimer=null;
      if(loginViewWatchTimer)clearInterval(loginViewWatchTimer);loginViewWatchTimer=null;
      try{clearInterval(tfExecutorLive);}catch(_){}
    },{once:true});
  }

  // REV240: do NOT observe the full DOM and mutate the same subtree from a
  // MutationObserver callback. REV234 did that for the Remote badge and could
  // create a self-triggering mutation loop after activation, leaving the side
  // panel visually blank/black. A lightweight UI refresh safely recreates the badge instead.
  start();
})();

~~~

### dataFingerprint @ 24239
~~~js
LastImportAt','tfAnalystSources','tfAnalystNameCacheByUrl','tfRememberedAnalystLinks','tfSelectedTimeRange','tfImportLockEngaged','tfImportLockedSigs','tfLoginConfirmed','tfAccountLoginState','tfRootLoginState','tfEnteredMain','tfUserProfile','tfLoginError','tfForceLoginForm','tfExplicitLogoutAt','tfScanInProgress']);
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
      const storageLoggedOut=explicitLogout;
      loginStateCache={state:storageLoggedIn?'online':storageLoggedOut?'logout':(accountState||rootState||'unknown'),loggedIn:storageLoggedIn,loggedOut:storageLoggedOut,error:String(d.tfLoginError||'')};
      importLockEngagedCache=!!d.tfImportLockEngaged;importLockedSigsCache=Array.isArray(d.tfImportLockedSigs)?d.tfImportLockedSigs.map(String):[];
      dataFingerprintCache=[String(d.tfLastImportAt||meta.importedAt||meta.exportedAt||''),histCount,Object.keys(src).length,remembered.length].join('|');
      const byUrl=Object.create(null);
      const resolvedByUrl=Object.create(null);
      Object.keys(src).forEach(name=>{const it=src[name]||{};const u=String(it.url||it.link||'').trim();if(u){byUrl[u]=name;resolvedByUrl[u]=name;}});
      scanResolvedNamesByUrlCache=resolvedByUrl;
      const scanActive=!!d.tfScanInProgress;
      if(scanActive)sawBatchScanActive=true;
      else if(sawBatchScanActive){
        for(const u of Array.from(manualUnresolvedUrls)){if(resolvedByUrl[u])manualUnresolvedUrls.delete(u);}
        sawBatchScanActive=false;
      }
      Object.keys(cache).forEach(u=>{const n=String(cache[u]||'').trim();if(u&&n)byUrl[u]=n;});
      remembered.forEach(it=>{const u=String(it&&it.url||'').trim(),n=String(it&&(it.name||it.analystName)||'').trim();if(u&&n&&!/^analis\s*\d+$/i.test(n))byUrl[u]=n;});
      window.__tfRemoteAnalystNamesByUrlV237=byUrl;
    }catch(_){}
  }

  async function auth(){
    const st = await storageGet([CREDS_KEY,SESSION_KEY,STATE_KEY]);
    const c = st[CREDS_KEY] || {};
    const s = st[STATE_KEY] || {};
    const sessionToken = String(st[SESSION_KEY] || '').trim();
    if(!c.email || !c.token || !sessionToken || s.valid !== true) return null;
    return {email:c.email,token:c.token,licenseId:s.licenseId || s.license || '',sessionToken};
  }

  async function api(path, body, timeoutOverrideMs){
    const ctl = typeof AbortController === 'function' ? new AbortController() : null;
    const t = setTimeout(()=>{try{ctl&&ctl.abort();}catch(_){}},Math.max(3000,Number(timeoutOverrideMs)||REQUEST_TIMEOUT_MS));
    try{
      const r = await fetch(API + path, {
        method:'POST',cache:'no-store',signal:ctl?ctl.signal:undefined,
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({...body,deviceType:'DESKTOP',clientType:'DESKTOP',extensionId:chrome.runtime.id,remoteRevision:'REV352'})
      });
      const text = await r.text();
      let data;
      try{data=JSON.parse(text);}catch(_){throw new Error('Respons Remote bukan JSON.');}
      if(data && data.valid === false) throw new Error(data.message || data.code || 'Remote tidak tersedia.');
      return data || {};
    }catch(e){
      if(e && (e.name === 'AbortError' || /aborted/i.test(String(e.message||'')))){
        const x=new Error('Remote server belum merespons. Sinkronisasi akan dicoba lagi otomatis.');
        x.code='REMOTE_TIMEOUT';
        throw x;
      }
      throw e;
    }finally{clearTimeout(t);}
  }


  // REV272: transport is owned by the extension Service Worker + Offscreen WebRTC.
  // The sidebar is only the DOM executor/state producer; closing/reloading it no
  // longer tears down the realtime socket itself.
  function coreSend(route,value){try{chrome.runtime.sendMessage({type:'TF_REMOTE_CORE_SEND',route,message:value},()=>{try{void chrome.runtime.lastError;}catch(_){}});return true;}catch(_){return false;}}
  function fastSocketOpen(){return !!browserCoreWsReady;}
  function fastSend(value){return coreSend('ws',value);}
  function relaySocketOpen(){return !!browserCoreWsReady;}
  function relaySend(value){return coreSend('ws',value);}
  function directSocketOpen(){return !!browserCoreDirectReady;}
  function directSend(value){return coreSend('direct',value);}
  function closeDirectPeer(){browserCoreDirectReady=false;browserCoreMode='connecting';browserCoreRtt=0;}
  function emitRealtimeStateEvent(event,payload){const msg={type:'state_event',event:String(event||''),payload:payload&&typeof payload==='object'?payload:{},at:Date.now()};if(!directSend(msg))relaySend(msg);}
  function sendDirectSnapshot(){if(!directSocketOpen())return false;try{const manifest=chrome.runtime.getManifest?chrome.runtime.getManifest():{};return directSend({type:'desktop_snapshot',snapshot:buildSnapshot(false),extensionVersion:String(manifest.version_name||manifest.version||'REV279'),at:Date.now()});}catch(_){return false;}}
  function sendCommandStarted(clientCommandId,action,transport){const msg={type:'command_started',clientCommandId:String(clientCommandId||'').slice(0,100),action:String(action||'').slice(0,80),transport,startedAt:Date.now()};return transport==='direct'?directSend(msg):relaySend(msg);}
  function sendRealtimeCommandResult(clientCommandId,result,transport){const msg={type:'command_result',clientCommandId:String(clientCommandId||'').slice(0,100),result:result||{ok:false,message:'Realtime result kosong.'},finishedAt:Date.now()};return transport==='direct'?directSend(msg):relaySend(msg);}
  async function executeRealtimeCommand(msg,transport){
    if(!remoteAvailabilityEnabled){const blocked=cleanText(msg&&msg.clientCommandId||'',100);sendRealtimeCommandResult(blocked,{ok:false,code:'REMOTE_DISABLED',message:'Remote PC sedang OFF. Aktifkan toggle Remote di sidebar PC.'},transport);return;}
    const clientCommandId=cleanText(msg&&msg.clientCommandId||'',100),action=cleanText(msg&&msg.action||'',80),payload=msg&&msg.payload&&typeof msg.payload==='object'?msg.payload:{};
    if(!clientCommandId||!action){sendRealtimeCommandResult(clientCommandId,{ok:false,code:'REMOTE_REALTIME_BAD_COMMAND',message:'Realtime command tidak valid.'},transport);return;}
    const cached=realtimeRecentResults.get(clientCommandId);if(cached&&Date.now()-cached.at<120000){sendRealtimeCommandResult(clientCommandId,cached.result,transport);transport==='direct'?sendDirectSnapshot():queueFastSnapshot(5);return;}
    const running=realtimeInflight.get(clientCommandId);if(running){running.then(r=>sendRealtimeCommandResult(clientCommandId,r,transport)).catch(()=>{});return;}
    sendCommandStarted(clientCommandId,action,transport);
    const lane=commandLaneKey(action,payload);
    const task=runRealtimeLane(lane,async()=>{remoteApplying=true;let result;try{result=await execute({id:transport+':'+clientCommandId,action,payload:{...payload,clientCommandId}});}catch(e){result={ok:false,message:e&&e.message?e.message:String(e)};}finally{remoteApplying=false;}result=result||{ok:false,message:'Tidak ada hasil command.'};rememberRealtimeResult(clientCommandId,result);const execRecord={[LAST_EXEC_KEY]:{id:transport+':'+clientCommandId,clientCommandId,result,at:Date.now(),acked:true,transport}};
      // REV286: Refresh/Reset intentionally clears extension storage. Do not
      // block the realtime command_result on storageSet, otherwise the
~~~

### dataFingerprint @ 98035
~~~js
tarUrl:String(o.avatarUrl||'')};if(!item.name&&!item.email)return;const k=ownerKey(item);if(!owners.some(x=>ownerKey(x)===k))owners.push(item);};
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
    EXPORT_TRANSFER_CACHE.set(id,{chunks,encoding:packed.encoding,createdAt:Date.now(),fingerprint:dataFingerprintCache,legacyFallback:true});
    for(const [k,v] of EXPORT_TRANSFER_CACHE){if(Date.now()-v.createdAt>10*60*1000)EXPORT_TRANSFER_CACHE.delete(k);}
    return {ok:true,action:'export_bundle_prepare',transferId:id,totalChunks:total,chunkSize,relayMode:'legacy-chunks',encoding:packed.encoding,fingerprint:dataFingerprintCache,fullExport:true,message:forceLegacy?'Fallback realtime cepat siap.':'Transfer realtime fallback siap.'};
  }
  async function exportBundleChunk(payload){
    const id=cleanText(payload.transferId,100),idx=Number(payload.index),rec=EXPORT_TRANSFER_CACHE.get(id);if(!rec)return {ok:false,message:'Transfer export PC sudah tidak tersedia.'};if(!Number.isInteger(idx)||idx<0||idx>=rec.chunks.length)return {ok:false,message:'Index chunk export tidak valid.'};
    return {ok:true,action:'export_bundle_chunk',transferId:id,index:idx,data:rec.chunks[idx],totalChunks:rec.chunks.length,encoding:rec.encoding};
  }
  async function exportBundleFinish(payload){
    const id=cleanText(payload.transferId,100);EXPORT_TRANSFER_CACHE.delete(id);
    if(MIRROR_PRESTAGE_V292&&cleanText(MIRROR_PRESTAGE_V292.transferId,100)===id){MIRROR_PRESTAGE_V292=null;try{await storageSet({[MIRROR_PRESTAGE_KEY_V292]:null});}catch(_){}}
    return {ok:true,action:'export_bundle_finish',message:'Sync PC ke Mobile selesai.'};
  }
  window.addEventListener('tf-remote-prewarm-drive-v292',()=>{
    setTimeout(()=>{exportBundlePrepare({fullExport:true,purpose:'mirror',prewarm:true}).then(()=>{}).catch(e=>{try{noteDriveRelayFailureV352(e);}catch(_){}});},0);
  });

  function updateOrStopDispatch(){
    const btn=firstVisible(['tf-btn-update-main','tf-btn-update-masuk','tf-btn-update-isignal']);
    if(!btn)return {ok:false,code:'UPDATE_BUTTON_MISSING',message:'Tombol Update tidak tersedia di sidebar PC.'};
    const before=cleanText(btn.textContent,80),stopping=/stop|stopping/i.test(before)||(btn.dataset&&btn.dataset.tfStopMode==='1');
    if(remoteButtonDisabled(btn)&&!stopping)return {ok:false,code:'UPDATE_BUTTON_DISABLED',message:'Tombol Update sedang nonaktif di sidebar PC.'};
    if(stopping){try{btn.disabled=false;btn.removeAttribute('disabled');btn.setAttribute('aria-disabled','false');btn.style.pointerEvents='auto';}catch(_){}}
    try{btn.click();}catch(e){return {ok:false,code:'UPDATE_CLICK_FAILED',message:'Tombol Update/Stop gagal diklik: '+cleanText(e&&e.message||e,120)};}
    queueImmediateSync(5);
    return {ok:true,action:'update',dispatched:true,stopping,startedAt:Date.now(),message:stopping?'STOP langsung dikirim ke plugin PC.':'UPDATE langsung dikirim ke plugin PC.'};
  }

  function batchOrStopDispatch(){
    const btn=firstVisible(['batch-scan-btn','batch-scan-isignal-btn']);
    if(!btn)return {ok:false,code:'BATCH_BUTTON_MISSING',message:'Tombol Submit / Batch Scan tidak tersedia di sidebar PC.'};
    const before=cleanText(btn.textContent,80),stopping=/stop|stopping/i.test(before)||(btn.dataset&&btn.dataset.tfStopMode==='1');
    if(remoteButtonDisabled(btn)&&!stopping)return {ok:false,code:'BATCH_BUTTON_DISABLED',message:'Tombol Submit / Batch Scan sedang nonaktif di sidebar PC.'};
    // REV292: never let a stale disabled attribute block STOP.
    if(stopping){try{btn.disabled=false;btn.removeAttribute('disabled');btn.setAttribute('aria-disabled','false');btn.style.pointerEvents='auto';}catch(_){}}
    try{btn.click();}catch(e){return {ok:false,code:'BATCH_CLICK_FAILED',message:'Tombol Submit/Stop gagal diklik: '+cleanText(e&&e.message||e,120)};}
    queueImmediateSync(5);
    return {ok:true,action:'batch_toggle',dispatched:true,stopping,scanActive:!stopping,startedAt:Date.now(),message:stopping?'STOP batch scan langsung dikirim ke plugin PC.':'SUBMIT batch scan langsung dikirim ke plugin PC.'};
  }

  function refreshDispatch(){
    const back=document.getElementById('isignal-back-link');
    const isignalPanel=document.getElementById('isignal-view');
    if(back&&(isVisible(back)||isVisible(isignalPanel)||visibleContainer()==='isignal')){
      try{back.click();}catch(_){ }
      // Continue the second click asynchronously; do not block Mobile ACK.
      let tries=0;const tick=()=>{tries++;const btn=firstVisible(['tf-btn-refresh-main','refresh-btn','tf-btn-refresh-masuk']);if(btn&&!remoteButtonDisabled(btn)){try{btn.click();}catch(_){}queueImmediateSync(5);return;}if(tries<40)setTimeout(tick,25);};setTimeout(tick,10);
      return {ok:true,action:'refresh',dispatched:true,fromIsignal:true,message:'Refresh / Reset langsung dikirim; kembali dari iSignal diproses tanpa menahan Mobile.'};
    }
    const r=clickVisible(['tf-btn-refresh-main','refresh-btn','tf-btn-refresh-masuk']);
    if(r&&r.ok)queueImmediateSync(5);
    return Object.assign({action:'refresh',dispatched:!!(r&&r.ok)},r||{});
  }

  function scanFromIsignalDispatch(){
    const btn=document.getElementById('scan-from-isignal-btn');
    if(!btn)return {ok:false,code:'SCAN_ISIGNAL_MISSING',message:'Tombol Scan From iSignal User tidak tersedia di sidebar PC.'};
    if(remoteButtonDisabled(btn))return {ok:false,code:'SCAN_ISIGNAL_DISABLED',message:'Scan From iSignal User
~~~
