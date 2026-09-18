# REV379 EXPORT_DATA_KEYS

## assets/tf-remote-sidebar-agent.js

### assignment
~~~js
'https://tf-license-device-api.wiliejonathan1999.workers.dev';
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
   
~~~

### first occurrence
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
  function effectiveAnal
~~~
