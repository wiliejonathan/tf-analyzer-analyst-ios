(() => {
  'use strict';

  const API='https://tf-license-device-api.wiliejonathan1999.workers.dev';
  const CREDS_KEY='tfMobileLicenseCredentialsV2';
  const STATE_KEY='tfMobileLicenseStateV2';
  const POLL_ONLINE_MS=15000;
  const POLL_OFFLINE_MS=5000;
  const POLL_FAST_MS=30000;
  const REQUEST_TIMEOUT_MS=26000;
  const ALL='__ALL__';
  const PAIRS=['XAUUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','EURJPY','GBPJPY','AUDJPY','NZDJPY','CADJPY','CHFJPY','USDCAD','USDCHF'];
  const RANGE_OPTIONS=[['all_time','ALL'],['m3','3 Month'],['m6','6 Month'],['y1','1 Year'],['y2','2 Year'],['y3','3 Year'],['y5','5 Year']];
  const EVENT_KEY='tfRemoteMobileEventLogV248';
  const REMOTE_OPEN_KEY='tfRemoteWasOpenedV248';
  const REMOTE_BOOT_CACHE_KEY='tfRemoteBootstrapCacheV279';
  const FAST_TICKET_CACHE_KEY='tfRemoteMobileFastTicketV331';
  const MOBILE_INSTANCE_KEY='tfRemoteMobileInstanceV331';
  let pollTimer=null,opened=false,sending=false,statusInFlight=false,statusPromise=null,lastStatus=null,editorDirty=false,lastCommandSignature='',eventLog=[];
  let tfRemoteBackgroundedAtV313=0,tfRemoteResumeRestoreV313=false;
  let bootstrapFallbackTimer=null,bootstrapOpenedAt=0,lastDesktopSnapshotAt=0,desktopTransportOnline=false,desktopRemotePresenceAt=0,desktopExecutorPresenceAt=0,desktopSessionId='',desktopPresenceSeq=0,desktopExplicitOffAt=0,desktopExecutorExplicitOffAt=0,desktopRemoteReady=false,desktopExecutorReady=false,lastPluginOnlineAt=0,transportRecoveryUntil=0,uiPresenceTimer=null;
  // REV268: direct P2P command bus with WebSocket fallback with explicit transport state and automatic
  // fallback to the existing reliable HTTP relay.
  let fastWs=null,fastReady=false,fastConnecting=false,fastReconnectTimer=null,fastHeartbeatTimer=null,mobilePresenceTimer=null;
  let mobileConflictPending=false,mobileConflictBlocked=false,mobileConflictMode='';
  let remoteGateCheckBusy=false,remoteGatePopupOpen=false;
  // REV268 primary transport: direct WebRTC RTCDataChannel Mobile <-> Desktop.
  // WebSocket is signaling/fallback; HTTP is last-resort recovery only.
  let directPc=null,directDc=null,directReady=false,directConnecting=false,directPeerToken=0,directRetryTimer=null,directHeartbeatTimer=null,directStatsTimer=null,directPendingCandidates=[],directRttMs=0,directRoute='p2p',iceServersCache=null,iceServersAt=0;
  const fastPendingCommands=new Map();
  let bootHydrating=false,rowSyncBusyCount=0,importTransferBusy=false,loginBusy=false,stateRefreshBusy=false;
  let failureCount=0,lastSuccessAt=0,lastErrorLoggedAt=0,lastEditorSignature='',lastIsignalSignature='',pcMirrorBusy=false,pcMirrorPending=false,pcMirrorPromise=null,lastMirrorFingerprint='',pcMirrorBackoffUntil=0,exportPriority=false;
  let analystSyncTimer=null,analystSyncBusy=false,lastAnalystSentSignature='',pcMirrorTimer=null,mirrorDeferRequested=false,lastUserActionAt=0,remoteHistoryPushed=false,lastDesktopEventSignature='';
  const rowSyncTimers=new Map();
  const rowSyncBusy=new WeakSet();
  // REV263: analyst row creation is a verified PC transaction. Each local row gets a
  // stable key so Add Row -> Link -> Pair can execute sequentially in background.
  const rowAddPromises=new Map();
  const buttonLoadingCounts=new Map();
  let localRowSeq=0;
  // REV259: locally-created analyst rows survive stale/lagging PC snapshots.
  // Keyed by URL once the user starts typing. The entry is retired only after
  // the same URL has been observed in fresh PC snapshots for a grace period.
  const pendingLocalRows=new Map();
  // REV266: deletion tombstones prevent stale PC snapshots from resurrecting a row
  // that the user already removed optimistically on Mobile.
  const pendingDeletedRows=new Map();
  // REV281 APK-only: PC rows remain PC-owned. Mobile does not manufacture row identity or extra blank rows.

  const ICON_REMOTE='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="11" rx="2"/><path d="M8 20h8M12 16v4"/><path d="M7.5 9.5h.01M11 9.5h5"/></svg>';
  const q=id=>document.getElementById(id);
  const getJson=k=>{try{return JSON.parse(localStorage.getItem(k)||'null');}catch(_){return null;}};
  const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const clean=(v,max=2400)=>String(v==null?'':v).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'').replace(/[ \t]+/g,' ').replace(/\n{3,}/g,'\n\n').trim().slice(0,max);
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  function mobileInstanceId(){
    try{
      let id=String(localStorage.getItem(MOBILE_INSTANCE_KEY)||'').trim();
      if(id)return id;
      id='MOB-'+(crypto&&typeof crypto.randomUUID==='function'?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));
      localStorage.setItem(MOBILE_INSTANCE_KEY,id);return id;
    }catch(_){return 'MOB-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);}
  }
  function ensureMobileConflictUi(){
    let ov=q('tf-mobile-conflict-v330');if(ov)return ov;
    ov=document.createElement('div');ov.id='tf-mobile-conflict-v330';ov.className='tf-mobile-conflict-v330';ov.setAttribute('aria-hidden','true');
    ov.innerHTML=`<div class="tf-mobile-conflict-backdrop-v330"></div><div class="tf-mobile-conflict-card-v330"><div class="tf-mobile-conflict-icon-v330">⇄</div><div class="tf-mobile-conflict-kicker-v330">REMOTE CONNECTION</div><h2 id="tf-mobile-conflict-title-v330">Koneksi ganda terdeteksi</h2><p id="tf-mobile-conflict-text-v330">Token ini sedang aktif pada browser/ponsel lain.</p><div id="tf-mobile-conflict-actions-v330" class="tf-mobile-conflict-actions-v330"><button id="tf-mobile-conflict-cancel-v330" type="button">Batal</button><button id="tf-mobile-conflict-takeover-v330" type="button" class="primary">Gunakan Device Ini</button></div></div>`;
    document.body.appendChild(ov);
    q('tf-mobile-conflict-cancel-v330')?.addEventListener('click',()=>resolveMobileConflict(false));
    q('tf-mobile-conflict-takeover-v330')?.addEventListener('click',()=>resolveMobileConflict(true));
    return ov;
  }
  function showMobileConflict(mode,msg){
    const ov=ensureMobileConflictUi(),title=q('tf-mobile-conflict-title-v330'),text=q('tf-mobile-conflict-text-v330'),cancel=q('tf-mobile-conflict-cancel-v330'),take=q('tf-mobile-conflict-takeover-v330');
    mobileConflictMode=mode||'conflict';
    if(mobileConflictMode==='replaced'){
      if(title)title.textContent='Remote dipakai di perangkat lain';
      if(text)text.textContent='Koneksi Remote pada perangkat ini diputus karena token yang sama dikonfirmasi pada browser/ponsel lain. Login tetap tersimpan; buka Remote lagi jika ingin mengambil alih kembali.';
      if(cancel){cancel.style.display='none';}
      if(take){take.textContent='OK';}
    }else{
      if(title)title.textContent='Koneksi ganda terdeteksi';
      if(text)text.textContent=clean(msg&&msg.message||'Token ini sedang aktif pada browser/ponsel lain. Gunakan perangkat ini dan putus koneksi yang lama?',500);
      if(cancel){cancel.style.display='';cancel.disabled=false;}
      if(take){take.textContent='Gunakan Device Ini';take.disabled=false;}
    }
    ov.classList.add('show');ov.setAttribute('aria-hidden','false');
  }
  function hideMobileConflict(){const ov=q('tf-mobile-conflict-v330');if(ov){ov.classList.remove('show');ov.setAttribute('aria-hidden','true');}}
  function resolveMobileConflict(takeover){
    if(mobileConflictMode==='replaced'){
      hideMobileConflict();mobileConflictBlocked=true;mobileConflictPending=false;return;
    }
    const take=q('tf-mobile-conflict-takeover-v330'),cancel=q('tf-mobile-conflict-cancel-v330');if(take)take.disabled=true;if(cancel)cancel.disabled=true;
    if(!fastWs||fastWs.readyState!==WebSocket.OPEN){hideMobileConflict();mobileConflictBlocked=!takeover;mobileConflictPending=false;if(takeover){mobileConflictBlocked=false;void connectFastLane(true);}return;}
    try{fastWs.send(JSON.stringify({type:takeover?'mobile_takeover':'mobile_conflict_cancel',instanceId:mobileInstanceId(),at:Date.now()}));}
    catch(_){hideMobileConflict();mobileConflictBlocked=!takeover;mobileConflictPending=false;}
  }

  // REV332: login/activation is independent from the PC Remote toggle.
  // Only entry into the Remote screen is gated by the desktop Remote switch.
  function ensureRemotePluginGateUi(){
    let ov=q('tf-remote-plugin-gate-v331');if(ov)return ov;
    ov=document.createElement('div');ov.id='tf-remote-plugin-gate-v331';ov.className='tf-remote-plugin-gate-v331';ov.setAttribute('aria-hidden','true');
    ov.innerHTML=`<div class="tf-remote-plugin-gate-backdrop-v331"></div><div class="tf-remote-plugin-gate-card-v331" role="dialog" aria-modal="true" aria-labelledby="tf-remote-plugin-gate-title-v331"><div class="tf-remote-plugin-gate-icon-v331">⌁</div><div class="tf-remote-plugin-gate-kicker-v331">REMOTE ACCESS</div><h2 id="tf-remote-plugin-gate-title-v331">Turn on Remote Plugin in Your PC</h2><p id="tf-remote-plugin-gate-text-v331">Aktifkan terlebih dahulu Remote Plugin di Desktop/PC.</p><button id="tf-remote-plugin-gate-ok-v331" type="button">OK</button></div>`;
    document.body.appendChild(ov);
    q('tf-remote-plugin-gate-ok-v331')?.addEventListener('click',()=>hideRemotePluginGate());
    return ov;
  }
  function showRemotePluginGate(extra=''){
    const ov=ensureRemotePluginGateUi(),txt=q('tf-remote-plugin-gate-text-v331');
    const base='Aktifkan terlebih dahulu Remote Plugin di Desktop/PC.';
    if(txt)txt.textContent=extra?base+' '+clean(extra,220):base;
    ov.classList.add('show');ov.setAttribute('aria-hidden','false');remoteGatePopupOpen=true;
  }
  function hideRemotePluginGate(){const ov=q('tf-remote-plugin-gate-v331');if(ov){ov.classList.remove('show');ov.setAttribute('aria-hidden','true');}remoteGatePopupOpen=false;}
  async function readRemoteAvailability(){
    const a=auth();if(!a)throw new Error('Session login tidak tersedia. Silakan Log out lalu login kembali.');
    let r=await api('/remote/availability',{},9000);
    if(r&&r.valid===false)throw new Error(r.message||r.code||'Session Remote tidak valid.');
    // Backward-compatible fallback during a staged backend rollout.
    if(!r||r.code==='NOT_FOUND'||r.code==='REMOTE_AVAILABILITY_UNSUPPORTED'){
      r=await api('/remote/mobile-status',{},9000);
      return {ready:!!(r&&r.desktopOnline===true),source:'legacy',raw:r||{}};
    }
    return {ready:!!(r&&r.remoteEnabled===true),source:'fast-room',raw:r||{}};
  }
  async function openRemoteGuarded(resumeRestore=false){
    if(opened||remoteGateCheckBusy)return;
    remoteGateCheckBusy=true;
    const btn=q('tf-mobile-remote-open');
    if(btn){btn.disabled=true;btn.classList.add('is-checking-remote-v331');}
    try{
      const availability=await readRemoteAvailability();
      if(availability.ready){hideRemotePluginGate();openRemote(resumeRestore);return;}
      try{localStorage.removeItem(REMOTE_OPEN_KEY);}catch(_){}
      const raw=availability.raw||{};
      const extra=raw.desktopTransportOnline===false&&raw.desktopRemoteOnline===false?'Pastikan PC menyala, Chrome/Extension aktif, lalu ubah toggle REMOTE menjadi ON.':'';
      showRemotePluginGate(extra);
    }catch(e){
      try{localStorage.removeItem(REMOTE_OPEN_KEY);}catch(_){}
      showRemotePluginGate('Pastikan PC menyala dan Plugin PC dapat terhubung ke internet.');
    }finally{
      remoteGateCheckBusy=false;
      if(btn){btn.disabled=false;btn.classList.remove('is-checking-remote-v331');}
    }
  }
  function tfPaintImportAvailabilityV313(hasImport,text){
    const note=q('tf-remote-import-note');
    if(!note)return;
    if(typeof text==='string')note.textContent=text;
    note.classList.toggle('tf-import-available',!!hasImport);
    note.classList.toggle('tf-import-unavailable',!hasImport);
    // REV316: semantic state must remain visible even if an older cached CSS
    // sheet briefly wins during WebView resume.
    note.style.setProperty('margin-top','15px','important');
    note.style.setProperty('color',hasImport?'#4ade80':'#f87171','important');
    note.style.setProperty('opacity','1','important');
  }
  const nextPaint=()=>new Promise(resolve=>{
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(()=>requestAnimationFrame(resolve));
    else setTimeout(resolve,0);
  });
  const storageGet=keys=>new Promise(r=>{try{chrome.storage.local.get(keys,x=>r(x||{}));}catch(_){r({});}});
  const storageRemove=keys=>new Promise(r=>{try{chrome.storage.local.remove(keys,()=>r());}catch(_){r();}});


  function saveBootstrapCache(state){
    try{
      if(!state||!state.snapshot||typeof state.snapshot!=='object')return;
      const x=state.snapshot;
      const snapshot={
        view:x.view||'',userName:x.userName||'',userEmail:x.userEmail||'',login:x.login||{},
        timeRange:x.timeRange||'ALL',timeRangeValue:x.timeRangeValue||x.selectedTimeRange||'all_time',selectedTimeRange:x.selectedTimeRange||x.timeRangeValue||'all_time',
        analysts:Array.isArray(x.analysts)?x.analysts.slice(0,28):[],analystRowCount:Number(x.analystRowCount||0),analystRowCountMode:x.analystRowCountMode||'row-id',
        isignalAnalysts:Array.isArray(x.isignalAnalysts)?x.isignalAnalysts.slice(0,28):[],rememberAllLinks:!!x.rememberAllLinks,
        scanPair:x.scanPair||'ALL',allAnalystPairs:Array.isArray(x.allAnalystPairs)?x.allAnalystPairs:[],batchButton:x.batchButton||'',
        hasImportData:!!x.hasImportData,dataFingerprint:x.dataFingerprint||'',dataCounts:x.dataCounts||{},progress:x.progress||{},
        coreReady:!!x.coreReady,snapshotReady:!!x.snapshotReady,snapshotMode:'cached-rev275',
        sidebarOpen:!!x.sidebarOpen,executorReady:!!x.executorReady,executorHeartbeatAt:Number(x.executorHeartbeatAt||0),remoteProtocol:x.remoteProtocol||''
      };
      localStorage.setItem(REMOTE_BOOT_CACHE_KEY,JSON.stringify({at:Date.now(),extensionVersion:state.extensionVersion||'',snapshot}));
    }catch(_){ }
  }
  function loadBootstrapCache(){
    try{
      const c=JSON.parse(localStorage.getItem(REMOTE_BOOT_CACHE_KEY)||'null');
      if(!c||!c.snapshot||typeof c.snapshot!=='object')return null;
      if(Date.now()-Number(c.at||0)>24*60*60*1000)return null;
      return {desktopOnline:false,fastLane:false,directLane:false,extensionVersion:clean(c.extensionVersion||'',80),snapshot:c.snapshot};
    }catch(_){return null;}
  }
  function finishBootstrapUi(){
    if(!bootHydrating)return;
    bootHydrating=false;
    if(bootstrapFallbackTimer){clearTimeout(bootstrapFallbackTimer);bootstrapFallbackTimer=null;}
    setCommandOverlay(false);setSyncing(false);
    if(opened&&!pollTimer)schedulePoll(nextPollDelay());
  }

  async function resetMobileImportedState(){
    // REV254: Remote Refresh / Reset mirrors the PC hard reset but preserves
    // Mobile licensing / device authorization / account-login state.
    const all=await storageGet(null);
    const preserve=/^(tfMobileLicense|tfLicense|tfDevice|tfAuth|tfStableProfileEmail|tfUserProfile|tfRememberLogin|tfRootLoginState|tfAccountLoginState|tfLoginConfirmed|tfLoginError|tfForceLoginForm|tfExplicitLogoutAt|tfEnteredMain|tfPendingLogin|tfCaptcha|tfCurrentProfileUrl)/i;
    const removeKeys=Object.keys(all||{}).filter(k=>!preserve.test(String(k||'')));
    if(removeKeys.length)await storageRemove(removeKeys);
    ['tf_equity_metric','tf_risk_mode','tf_compound_months','tf_current_balance','tf_current_risk_percent','tf_risk_overrides','tf_sl_type_selection'].forEach(k=>{try{localStorage.removeItem(k);}catch(_){}});
    ['tf_mobile_import_loading_v8','tf_mobile_import_loading_detail_v8','tf_mobile_import_expected_trades_v8','tf_mobile_import_expected_analysts_v8','tf_mobile_import_expected_summary_rows_v8','tf_mobile_import_expected_score_v8'].forEach(k=>{try{sessionStorage.removeItem(k);}catch(_){}});
    lastMirrorFingerprint='';pcMirrorPending=false;if(pcMirrorTimer){clearTimeout(pcMirrorTimer);pcMirrorTimer=null;}lastEditorSignature='';lastIsignalSignature='';lastAnalystSentSignature='';editorDirty=false;pendingLocalRows.clear();
    if(lastStatus&&lastStatus.snapshot){
      const snap=lastStatus.snapshot;
      snap.analysts=[];snap.analystRowCount=1;snap.isignalAnalysts=[];snap.hasImportData=false;snap.dataFingerprint='';snap.timeRangeValue='all_time';snap.selectedTimeRange='all_time';
      snap.progress={active:false,percent:0,text:'Belum ada batch scanning berjalan.'};
    }
    renderEditor([],1);renderIsignal([]);
    const ts=q('tf-remote-time-select');if(ts)ts.value='all_time';
    tfPaintImportAvailabilityV313(false,'Update dikunci sampai data Import tersedia di plugin Chrome.');
    try{if(typeof window.tfMobileRecoverRenderV31==='function')window.tfMobileRecoverRenderV31('remote-reset');}catch(_){ }
  }

  function pcResetStateIsClean(st){
    const snap=st&&st.snapshot&&typeof st.snapshot==='object'?st.snapshot:{};
    const analysts=Array.isArray(snap.analysts)?snap.analysts.filter(x=>x&&clean(x.url,520)):[];
    const isignal=Array.isArray(snap.isignalAnalysts)?snap.isignalAnalysts.filter(x=>x&&clean(x.url,520)):[];
    const view=String(snap.view||'main').toLowerCase();
    return !snap.hasImportData&&analysts.length===0&&isignal.length===0&&view!=='isignal';
  }

  async function waitForPcResetState(timeoutMs=9000){
    const started=Date.now();let ticks=0;
    while(opened&&Date.now()-started<Math.max(1500,Number(timeoutMs)||9000)){
      ticks++;
      let st=null;
      try{
        if(realtimeOpen()){
          requestRealtimeSnapshot();
          await sleep(120);
          st=lastStatus;
          // HTTP is only a secondary proof. Use it periodically so a reset that
          // briefly reconnects realtime still finishes without waiting for ACK.
          if(!pcResetStateIsClean(st)&&ticks%4===0)st=await refreshStatus(true);
        }else{
          st=await refreshStatus(true);
        }
      }catch(_){st=lastStatus;}
      if(pcResetStateIsClean(st))return st;
      await sleep(220);
    }
    return null;
  }

  async function refreshRemoteStateOnly(){
    if(!opened||stateRefreshBusy)return lastStatus;
    stateRefreshBusy=true;markUserAction();
    const btn=q('tf-remote-refresh-state');if(btn){btn.disabled=true;btn.classList.add('is-refreshing');}
    setSyncing(true,'Mengambil status dan data terbaru dari plugin PC…');
    try{
      const before=lastDesktopSnapshotAt;
      let gotFresh=false;
      if(realtimeOpen()){
        sendMobileUiPresence(true);requestRealtimeSnapshot();
        const started=Date.now();
        while(opened&&Date.now()-started<2200){
          if(lastDesktopSnapshotAt>before){gotFresh=true;break;}
          await sleep(40);
        }
      }
      if(!gotFresh){
        const st=await refreshStatus(true);
        if(st){lastStatus=st;gotFresh=true;}
      }
      if(!gotFresh)throw new Error('Snapshot plugin PC belum tersedia.');
      // Header refresh is explicitly PC-authoritative: discard unsent Mobile
      // Link/Pair drafts and paint exactly what exists in the plugin right now.
      editorDirty=false;lastEditorSignature='';pendingLocalRows.clear();
      if(lastStatus)render(lastStatus);
      setSyncing(false);
      logEvent('Refresh status selesai: kondisi Remote dan data terbaru diambil dari plugin PC.','ok');
      return lastStatus;
    }catch(e){
      setSyncing(false);logEvent('Refresh status gagal: '+(e.message||e),'err');throw e;
    }finally{
      stateRefreshBusy=false;if(btn){btn.disabled=false;btn.classList.remove('is-refreshing');}
    }
  }

  async function refreshResetRemote(){
    if(sending||importTransferBusy||rowSyncBusyCount>0){logEvent('Tunggu proses Remote selesai sebelum Refresh / Reset.','err');return;}
    markUserAction();
    setButtonLoading('refresh',true);
    setCommandOverlay(true,'Jika sedang di page iSignal: Kembali → reset data PC → verifikasi state PC → reset data ponsel.','Refresh / Reset');
    setSyncing(true,'Menjalankan Refresh / Reset di plugin PC…');
    try{
      let commandResult=null;let cleanProof=null;
      try{
        // REV286: Reset may clear/reload the PC Remote agent immediately after
        // the button finishes. Never wait 90 seconds for an ACK that can be lost
        // by the reset itself. The PC snapshot below is authoritative.
        commandResult=await sendCommand('refresh',{mode:'reset',preserveRemoteAvailability:true},{timeoutMs:6500,keepOverlayUntilHydrated:true,label:'Refresh / Reset',quiet:true});
        if(!commandResult)throw Object.assign(new Error('Perintah Refresh / Reset belum diterima PC.'),{code:'REMOTE_REFRESH_NOT_DISPATCHED'});
      }catch(dispatchError){
        const code=String(dispatchError&&dispatchError.code||'');
        const recoverable=/REMOTE_(?:ACK_TIMEOUT|OPERATION_TIMEOUT|DIRECT_TIMEOUT|FAST_TIMEOUT|FAST_CLOSED|DIRECT_CLOSED|TIMEOUT)/.test(code)||/belum mengonfirmasi|hasil akhirnya belum tersedia|ACK/i.test(String(dispatchError&&dispatchError.message||''));
        if(!recoverable)throw dispatchError;
        setSyncing(true,'ACK Reset terputus saat PC mereset state; memverifikasi hasil langsung…');
        cleanProof=await waitForPcResetState(7000);
        if(!cleanProof)throw dispatchError;
        logEvent('Refresh PC selesai. ACK transport terputus saat Reset, tetapi state PC sudah terverifikasi.','ok');
      }

      setCommandOverlay(true,'PC sudah menerima Reset. Memverifikasi state kosong dari plugin PC…','Refresh / Reset');
      if(!cleanProof)cleanProof=await waitForPcResetState(10000);
      if(!cleanProof)throw new Error('Plugin PC sudah menerima Reset, tetapi state kosong belum terverifikasi di ponsel.');

      // Only clear Mobile after a fresh PC state is known to be clean. This
      // prevents the local optimistic reset from falsely satisfying verification.
      setCommandOverlay(true,'State PC sudah kosong. Membersihkan data Remote di ponsel…','Refresh / Reset');
      await resetMobileImportedState();
      lastEditorSignature='';lastIsignalSignature='';editorDirty=false;render(lastStatus||{});
      await nextPaint();
      tfPaintImportAvailabilityV313(false,'Belum ada data Import. SUBMIT dapat dipakai untuk batch scanning dari Link Analis.');
      setCommandOverlay(false);setSyncing(false);logEvent('Refresh / Reset selesai. PC sudah terverifikasi dan data ponsel kembali ke kondisi awal.','ok');
    }catch(e){setCommandOverlay(false);setSyncing(false);logEvent('Refresh / Reset gagal: '+(e.message||e),'err');throw e;}
    finally{setButtonLoading('refresh',false);}
  }

  function askRemoveConfirmation(row){
    return new Promise(resolve=>{
      const ov=q('tf-remote-delete-overlay'),yes=q('tf-remote-delete-yes'),no=q('tf-remote-delete-no'),text=q('tf-remote-delete-text');
      if(!ov||!yes||!no){resolve(false);return;}
      const name=clean(row?.querySelector('.tf-remote-editor-name')?.textContent||'',80);
      if(text)text.textContent=(name&&name!=='Nama analis belum terbaca'?name+': ':'')+'Link analis ini akan dihapus dari ponsel dan plugin PC.';
      const done=v=>{ov.classList.remove('show');ov.setAttribute('aria-hidden','true');yes.onclick=null;no.onclick=null;resolve(v);};
      yes.onclick=()=>done(true);no.onclick=()=>done(false);ov.onclick=e=>{if(e.target===ov)done(false);};
      ov.classList.add('show');ov.setAttribute('aria-hidden','false');
    });
  }

  function deleteTombstoneId(index,rowKeyValue,url){
    return rowKeyValue?('key:'+rowKeyValue):(url?('url:'+url):('index:'+index+':'+Date.now().toString(36)));
  }
  function snapshotStillContainsDeletedRow(snapshot,tombstone){
    const list=snapshot&&Array.isArray(snapshot.analysts)?snapshot.analysts:[];
    return list.some((item,i)=>{
      const itemKey=clean(item&&item.rowKey||'',120),itemUrl=clean(item&&item.url||'',520);
      if(tombstone.rowKey&&itemKey&&itemKey===tombstone.rowKey)return true;
      if(tombstone.url&&itemUrl&&itemUrl===tombstone.url)return true;
      return !tombstone.rowKey&&!tombstone.url&&Number(item&&item.no||i+1)===tombstone.index+1;
    });
  }
  function patchLastStatusAfterOptimisticDelete(tombstone){
    if(!lastStatus||!lastStatus.snapshot)return;
    const snap=lastStatus.snapshot;
    if(Array.isArray(snap.analysts))snap.analysts=snap.analysts.filter((item,i)=>{
      const itemKey=clean(item&&item.rowKey||'',120),itemUrl=clean(item&&item.url||'',520);
      if(tombstone.rowKey&&itemKey===tombstone.rowKey)return false;
      if(tombstone.url&&itemUrl===tombstone.url)return false;
      return true;
    });
    const count=Math.max(1,Number(snap.analystRowCount)||1);
    snap.analystRowCount=Math.max(1,count-1);
  }
  async function removeRowWithConfirmation(row){
    if(!row||!row.isConnected)return;
    const yes=await askRemoveConfirmation(row);if(!yes)return;
    markUserAction();
    const index=rowIndex(row),url=clean(row.querySelector('.tf-remote-link-input')?.value||'',520),key=clean(row.dataset.tfRowKey||'',120);
    if(index<0)return;
    // REV278: never assume a Mobile-created row is local-only merely because
    // the latest PC snapshot has not marked it ready yet. Row 2+ may already
    // exist physically in the plugin while presence/snapshot is delayed. Always
    // ask PC to delete first; only an explicit PC ROW_MISSING result may fall
    // back to local cleanup for a truly unsynced draft.
    const token=deleteTombstoneId(index,key,url);
    const currentCount=q('tf-remote-analyst-editor')?.querySelectorAll('.tf-remote-editor-row').length||1;
    const tombstone={token,index,rowKey:key,url,at:Date.now(),expectedRowCount:Math.max(1,currentCount-1)};
    pendingDeletedRows.set(token,tombstone);
    editorDirty=true;
    const timer=rowSyncTimers.get(row);if(timer){clearTimeout(timer);rowSyncTimers.delete(row);}
    row.classList.add('tf-remote-row-syncing');
    setSyncing(true,'Menghapus ROW Link Analis di plugin PC…');
    setCommandOverlay(true,'Menunggu plugin PC menghapus row dan mengirim snapshot terbaru…','Menghapus Row Analis');
    try{
      // REV273: PC-FIRST delete. Mobile is not allowed to disappear until the
      // plugin PC has returned a verified deletion result or emitted ROW_DELETED.
      // Canonical action is intentionally used here because every compatible
      // Worker already allows set_analysts. Older backends rejected the newer
      // remove_analyst alias before it ever reached the PC plugin.
      const result=await sendCommand('set_analysts',{mode:'remove',index,url,rowKey:key},{timeoutMs:9000,label:'Hapus ROW Link Analis'});
      if(!result||result.ok===false||result.verified!==true||result.survivorsPreserved!==true||result.pcDeleted!==true)throw new Error(result&&result.message||'Plugin PC belum memverifikasi penghapusan ROW Link Analis.');
      if(url)pendingLocalRows.delete(url);
      if(lastStatus&&lastStatus.snapshot){
        if(Array.isArray(result.analysts))lastStatus.snapshot.analysts=result.analysts;
        if(Number.isFinite(Number(result.rowCount)))lastStatus.snapshot.analystRowCount=Math.max(1,Number(result.rowCount));
      }
      pendingDeletedRows.delete(token);editorDirty=false;lastEditorSignature='';render(lastStatus||{});
      setSyncing(false);logEvent('Tombol delete Row '+(index+1)+' diteruskan ke plugin PC; ponsel mengikuti snapshot PC.','ok');
    }catch(e){
      // Lost ACK must never create a false Mobile-only delete. Ask for a fresh
      // realtime snapshot and only remove locally when that NEW snapshot proves
      // the row is gone. Otherwise keep the Mobile row visible.
      const beforeSnapAt=lastDesktopSnapshotAt;
      requestRealtimeSnapshot();
      const until=Date.now()+1400;
      while(opened&&Date.now()<until&&lastDesktopSnapshotAt<=beforeSnapAt)await sleep(35);
      const snap=lastStatus&&lastStatus.snapshot||{};
      const fresh=lastDesktopSnapshotAt>beforeSnapAt;
      const stillThere=snapshotStillContainsDeletedRow(snap,tombstone);
      pendingDeletedRows.delete(token);editorDirty=false;lastEditorSignature='';
      if(fresh&&!stillThere){
        if(url)pendingLocalRows.delete(url);render(lastStatus||{});
        logEvent('Row sudah hilang di PC; ACK terlambat dan ponsel mengikuti snapshot PC.','ok');
      }else{
        if(row.isConnected)row.classList.remove('tf-remote-row-syncing');render(lastStatus||{});
        logEvent('Delete dibatalkan di ponsel karena plugin PC belum menghapus row: '+(e.message||e),'err');
      }
      setSyncing(false);
    }finally{setCommandOverlay(false);setSyncing(false);if(row&&row.isConnected)row.classList.remove('tf-remote-row-syncing');}
  }

  function auth(){
    // REV349: strict fresh-start mode keeps Email/Token/session in memory only.
    const mem=window.__TF_MOBILE_AUTH_V349||null;
    if(mem&&mem.email&&mem.token&&mem.sessionToken){
      return {email:mem.email,token:mem.token,licenseId:mem.licenseId||'',sessionToken:mem.sessionToken};
    }
    // Compatibility fallback for older builds only. REV349 gate never writes these keys.
    const c=getJson(CREDS_KEY),s=getJson(STATE_KEY);
    if(!c||!s||!c.email||!c.token||!s.sessionToken)return null;
    return {email:c.email,token:c.token,licenseId:s.licenseId||s.license||'',sessionToken:s.sessionToken};
  }

  const tfRev294ApiControllers=new Set();
  let tfRev294CancelSerial=0;
  async function api(path,body,timeoutOverrideMs){
    const a=auth();
    if(!a)throw new Error('Session Mobile belum tersedia.');
    const ctl=typeof AbortController==='function'?new AbortController():null;if(ctl)tfRev294ApiControllers.add(ctl);
    const t=setTimeout(()=>{try{ctl&&ctl.abort();}catch(_){}},Math.max(3000,Number(timeoutOverrideMs)||REQUEST_TIMEOUT_MS));
    try{
      const r=await fetch(API+path,{method:'POST',cache:'no-store',signal:ctl?ctl.signal:undefined,headers:{'Content-Type':'application/json'},body:JSON.stringify({...a,...body,deviceType:'MOBILE',clientType:'MOBILE',mobileVersion:'1.0.106',remoteRevision:'REV349'})});
      const text=await r.text();let data;
      try{data=JSON.parse(text);}catch(_){throw new Error('Respons Remote bukan JSON.');}
      if(data&&data.valid===false)throw new Error(data.message||data.code||'Remote tidak tersedia.');
      return data||{};
    }catch(e){
      if(e&&(e.name==='AbortError'||/aborted/i.test(String(e.message||'')))){
        const x=new Error('Remote belum merespons. Sinkronisasi otomatis tetap berjalan.');x.code='REMOTE_TIMEOUT';throw x;
      }
      throw e;
    }finally{clearTimeout(t);if(ctl)tfRev294ApiControllers.delete(ctl);}
  }

  function fastWsUrl(ticket){return API.replace(/^http:/i,'ws:').replace(/^https:/i,'wss:')+'/remote/fast-ws?ticket='+encodeURIComponent(ticket);}
  function sendMobileUiPresence(open){if(!fastSocketOpen())return false;try{fastWs.send(JSON.stringify({type:'mobile_ui_presence',open:open===true,at:Date.now()}));return true;}catch(_){return false;}}
  function syncMobilePresenceLoop(){if(mobilePresenceTimer){clearInterval(mobilePresenceTimer);mobilePresenceTimer=null;}if(opened){sendMobileUiPresence(true);mobilePresenceTimer=setInterval(()=>{if(opened)sendMobileUiPresence(true);},1000);}else sendMobileUiPresence(false);}
  function fastSocketOpen(){return !!(fastWs&&fastWs.readyState===WebSocket.OPEN&&fastReady);}
  function directSocketOpen(){return !!(directDc&&directDc.readyState==='open'&&directReady);}
  function realtimeOpen(){return directSocketOpen()||fastSocketOpen();}
  function directSend(value){if(!directSocketOpen())return false;try{directDc.send(JSON.stringify(value));return true;}catch(_){return false;}}
  function cachedFastTicket(){
    try{const c=JSON.parse(localStorage.getItem(FAST_TICKET_CACHE_KEY)||'null');if(c&&c.ticket&&Number(c.expiresAt||0)>Date.now()+30000)return {...c,fromCache:true};}catch(_){}
    return null;
  }
  function storeFastTicket(x){try{if(x&&x.ticket)localStorage.setItem(FAST_TICKET_CACHE_KEY,JSON.stringify({ticket:x.ticket,expiresAt:Number(x.expiresAt||0),savedAt:Date.now()}));}catch(_){}}
  function clearFastTicket(){try{localStorage.removeItem(FAST_TICKET_CACHE_KEY);}catch(_){}}
  async function getFastTicket(force=false){
    if(!force){const c=cachedFastTicket();if(c)return c;}
    const x=await api('/remote/fast-ticket',{mobileInstanceId:mobileInstanceId()},6500);
    if(x&&x.fastAvailable===true&&x.ticket){storeFastTicket(x);return {...x,fromCache:false};}
    return x;
  }
  function executorOnlineFromState(state){
    const now=Date.now();
    // REV279 sticky session: ONLINE follows an explicit socket/session state,
    // never the punctuality of a 1-second browser timer. Explicit Remote OFF or
    // explicit executor close still wins immediately.
    if(desktopExplicitOffAt && now-desktopExplicitOffAt<30000)return false;
    if(desktopExecutorExplicitOffAt && now-desktopExecutorExplicitOffAt<30000)return false;
    const realtimeExecutor=desktopRemoteReady===true&&desktopExecutorReady===true&&(desktopTransportOnline===true||now<transportRecoveryUntil);
    const snap=state&&state.snapshot&&typeof state.snapshot==='object'?state.snapshot:{};
    const beat=Number(snap.executorHeartbeatAt||0);
    const snapshotExecutor=!!(snap.sidebarOpen===true&&snap.executorReady===true&&beat&&now-beat<60000);
    if(realtimeExecutor||snapshotExecutor){lastPluginOnlineAt=now;return true;}
    // Keep the last confirmed state while the socket performs a short automatic
    // reconnect. This is display hysteresis only; commands still use an actually
    // open DIRECT/WebSocket channel or the authenticated HTTP recovery path.
    if(lastPluginOnlineAt&&now-lastPluginOnlineAt<45000&&(now<transportRecoveryUntil||failureCount>0))return true;
    return false;
  }


  async function loadIceServers(force=false){if(!force&&Array.isArray(iceServersCache)&&iceServersCache.length&&Date.now()-iceServersAt<4*60*60*1000)return iceServersCache;try{const x=await api('/remote/ice-config',{},9000);if(x&&Array.isArray(x.iceServers)&&x.iceServers.length){iceServersCache=x.iceServers;iceServersAt=Date.now();return iceServersCache;}}catch(_){}iceServersCache=[{urls:['stun:stun.cloudflare.com:3478','stun:stun.l.google.com:19302']}];iceServersAt=Date.now();return iceServersCache;}
  async function directIceConfig(){return {iceServers:await loadIceServers(false),iceCandidatePoolSize:4,bundlePolicy:'max-bundle'};}
  async function updateDirectStats(){if(!directPc||!directSocketOpen())return;try{const r=await directPc.getStats();let pair=null,local=null,remote=null;r.forEach(x=>{if(x.type==='candidate-pair'&&x.state==='succeeded'&&(x.nominated||x.selected))pair=x;});if(!pair)r.forEach(x=>{if(!pair&&x.type==='transport'&&x.selectedCandidatePairId)pair=r.get(x.selectedCandidatePairId);});if(pair){local=r.get(pair.localCandidateId);remote=r.get(pair.remoteCandidateId);const relay=!!((local&&local.candidateType==='relay')||(remote&&remote.candidateType==='relay'));directRoute=relay?'turn':'p2p';if(Number.isFinite(Number(pair.currentRoundTripTime)))directRttMs=Math.max(0,Math.round(Number(pair.currentRoundTripTime)*1000));render(lastStatus||{});}}catch(_){}}
  function closeDirectPeer(schedule=false){
    directReady=false;directConnecting=false;const dc=directDc,pc=directPc;directDc=null;directPc=null;directPendingCandidates=[];directPeerToken++;if(directHeartbeatTimer){clearInterval(directHeartbeatTimer);directHeartbeatTimer=null;}if(directStatsTimer){clearInterval(directStatsTimer);directStatsTimer=null;}directRttMs=0;directRoute='p2p';
    try{dc&&dc.close();}catch(_){}try{pc&&pc.close();}catch(_){}if(directRetryTimer){clearTimeout(directRetryTimer);directRetryTimer=null;}
    if(schedule&&fastSocketOpen())directRetryTimer=setTimeout(()=>{directRetryTimer=null;void startDirectPeer();},450);
  }
  function handleRealtimeMessage(msg,transport){
    if(!msg||typeof msg!=='object')return;
    if(msg.type==='desktop_snapshot'){
      failureCount=0;lastSuccessAt=Date.now();lastDesktopSnapshotAt=Date.now();desktopTransportOnline=true;
      const snap=msg.snapshot&&typeof msg.snapshot==='object'?msg.snapshot:{};
      desktopRemotePresenceAt=Date.now();desktopRemoteReady=true;desktopExplicitOffAt=0;transportRecoveryUntil=0;
      if(snap&&snap.executorReady===true){desktopExecutorPresenceAt=Date.now();desktopExecutorReady=true;desktopExecutorExplicitOffAt=0;}
      lastStatus=Object.assign({},lastStatus||{},{desktopOnline:executorOnlineFromState({snapshot:snap}),fastLane:true,directLane:transport==='direct',extensionVersion:clean(msg.extensionVersion||lastStatus&&lastStatus.extensionVersion||'',80),snapshot:snap});
      saveBootstrapCache(lastStatus);render(lastStatus);finishBootstrapUi();return;
    }
    if(msg.type==='command_started'){
      markRealtimeCommandStarted(String(msg.clientCommandId||''));
      const st=q('tf-remote-command-status');if(st){st.textContent='Sudah diterima PC — dieksekusi sekarang.';st.className='tf-remote-command-status ok';}return;
    }
    if(msg.type==='state_event'){
      if(String(msg.event||'')==='ROW_DELETED'){
        const p=msg.payload&&typeof msg.payload==='object'?msg.payload:{};const rk=clean(p.rowKey||'',120),u=clean(p.url||'',520),idx=Number(p.index);
        if(lastStatus&&lastStatus.snapshot){if(Array.isArray(p.analysts)&&p.analysts.length){lastStatus.snapshot.analysts=p.analysts;lastStatus.snapshot.analystRowCount=Math.max(1,Number(p.rowCount)||p.analysts.length);}else if(Array.isArray(lastStatus.snapshot.analysts)){lastStatus.snapshot.analysts=lastStatus.snapshot.analysts.filter((x,i)=>!(rk&&clean(x&&x.rowKey||'',120)===rk)&&!(u&&clean(x&&x.url||'',520)===u)&&!(Number.isFinite(idx)&&!rk&&!u&&i===idx));lastStatus.snapshot.analystRowCount=Math.max(1,lastStatus.snapshot.analysts.length);}}
        const editor=q('tf-remote-analyst-editor');if(editor){for(const r of Array.from(editor.querySelectorAll('.tf-remote-editor-row'))){const rrk=clean(r.dataset.tfRowKey||'',120),ru=clean(r.querySelector('.tf-remote-link-input')?.value||'',520),ri=rowIndex(r);if((rk&&rrk===rk)||(u&&ru===u)||(Number.isFinite(idx)&&!rk&&!u&&ri===idx)){r.remove();break;}}renumberEditor();}
        for(const [token,t] of Array.from(pendingDeletedRows.entries())){if((rk&&t.rowKey===rk)||(u&&t.url===u)||(Number.isFinite(idx)&&t.index===idx))pendingDeletedRows.delete(token);}editorDirty=false;lastEditorSignature='';saveBootstrapCache(lastStatus||{});render(lastStatus||{});return;
      }
      return;
    }
    if(msg.type==='command_result'){
      const id=String(msg.clientCommandId||''),p=fastPendingCommands.get(id);if(!p)return;fastPendingCommands.delete(id);clearTimeout(p.timer);const result=msg.result&&typeof msg.result==='object'?msg.result:{ok:false,message:'Realtime result kosong.'};try{result.__transport=transport;}catch(_){}p.resolve(result);return;
    }
    if(msg.type==='ping'){if(transport==='direct')directSend({type:'pong',at:Date.now(),echoAt:Number(msg.at||0)});return;}if(msg.type==='pong'&&transport==='direct'){const echo=Number(msg.echoAt||0);if(echo){directRttMs=Math.max(0,Date.now()-echo);try{render(lastStatus||{});}catch(_){}}return;}
  }
  function bindDirectChannel(dc){
    if(!dc)return;directDc=dc;dc.binaryType='arraybuffer';
    dc.onopen=()=>{directReady=true;directConnecting=false;if(directHeartbeatTimer)clearInterval(directHeartbeatTimer);directHeartbeatTimer=setInterval(()=>{if(directSocketOpen())directSend({type:'ping',at:Date.now()});},1000);if(directStatsTimer)clearInterval(directStatsTimer);directStatsTimer=setInterval(()=>void updateDirectStats(),2500);try{directSend({type:'snapshot_request',at:Date.now()});directSend({type:'ping',at:Date.now()});}catch(_){}void updateDirectStats();render(lastStatus||{});logEvent('DataChannel realtime aktif — P2P/TURN dipilih otomatis.','ok');};
    dc.onmessage=e=>{let msg;try{msg=JSON.parse(String(e.data||''));}catch(_){return;}handleRealtimeMessage(msg,'direct');};
    dc.onclose=()=>{if(directDc===dc){directReady=false;directDc=null;render(lastStatus||{});if(opened&&fastSocketOpen())closeDirectPeer(true);}};dc.onerror=()=>{};
  }
  async function startDirectPeer(){
    if(!fastSocketOpen()||directSocketOpen()||directConnecting||typeof RTCPeerConnection!=='function')return;
    directConnecting=true;try{closeDirectPeer(false);directConnecting=true;const token=++directPeerToken;const pc=new RTCPeerConnection(await directIceConfig());directPc=pc;bindDirectChannel(pc.createDataChannel('tf-remote',{ordered:true}));
      pc.onicecandidate=e=>{if(token!==directPeerToken)return;if(e.candidate&&fastSocketOpen())try{fastWs.send(JSON.stringify({type:'rtc_signal',signal:{candidate:e.candidate.toJSON?e.candidate.toJSON():e.candidate},at:Date.now()}));}catch(_){}};
      pc.onconnectionstatechange=()=>{if(token!==directPeerToken)return;if(['failed','closed'].includes(pc.connectionState))closeDirectPeer(true);};
      const offer=await pc.createOffer();await pc.setLocalDescription(offer);if(fastSocketOpen())fastWs.send(JSON.stringify({type:'rtc_signal',signal:{description:pc.localDescription},at:Date.now()}));
      setTimeout(()=>{if(token===directPeerToken&&!directSocketOpen())closeDirectPeer(true);},7000);
    }catch(_){closeDirectPeer(true);}
  }
  async function handleRtcSignal(signal){
    if(!signal||!directPc)return;try{if(signal.description&&signal.description.type==='answer'){await directPc.setRemoteDescription(signal.description);for(const c of directPendingCandidates.splice(0)){try{await directPc.addIceCandidate(c);}catch(_){}}return;}if(signal.candidate){if(directPc.remoteDescription)await directPc.addIceCandidate(signal.candidate);else directPendingCandidates.push(signal.candidate);}}catch(_){closeDirectPeer(true);}
  }
  function makeRealtimePending(clientCommandId,resolve,reject,transport,operationTimeoutMs){
    const ackTimeout=transport==='direct'?850:1100;
    const rec={resolve,reject,timer:null,started:false,transport,operationTimeout:Math.max(2500,Number(operationTimeoutMs)||6500)};
    rec.timer=setTimeout(()=>{if(fastPendingCommands.get(clientCommandId)!==rec)return;fastPendingCommands.delete(clientCommandId);const e=new Error((transport==='direct'?'DIRECT P2P':'WebSocket')+' tidak memberi ACK awal; pindah jalur tanpa menunggu proses.');e.code=transport==='direct'?'REMOTE_DIRECT_TIMEOUT':'REMOTE_FAST_TIMEOUT';reject(e);},ackTimeout);
    fastPendingCommands.set(clientCommandId,rec);return rec;
  }
  function markRealtimeCommandStarted(clientCommandId){
    const rec=fastPendingCommands.get(String(clientCommandId||''));if(!rec||rec.started)return;
    rec.started=true;clearTimeout(rec.timer);
    rec.timer=setTimeout(()=>{if(fastPendingCommands.get(String(clientCommandId||''))!==rec)return;fastPendingCommands.delete(String(clientCommandId||''));const e=new Error('PC sudah menerima command tetapi hasil akhirnya belum tersedia.');e.code='REMOTE_OPERATION_TIMEOUT';rec.reject(e);},rec.operationTimeout);
  }
  function sendDirectCommand(action,payload,clientCommandId,timeoutMs){
    if(!directSocketOpen())return Promise.reject(Object.assign(new Error('DIRECT P2P belum tersambung.'),{code:'REMOTE_DIRECT_OFFLINE'}));
    return new Promise((resolve,reject)=>{const rec=makeRealtimePending(clientCommandId,resolve,reject,'direct',timeoutMs);try{directDc.send(JSON.stringify({type:'command',clientCommandId,action,payload,sentAt:Date.now()}));}catch(e){clearTimeout(rec.timer);fastPendingCommands.delete(clientCommandId);reject(e);}});
  }
  function requestRealtimeSnapshot(){
    if(directSocketOpen())return directSend({type:'snapshot_request',at:Date.now()});
    if(fastSocketOpen()){try{fastWs.send(JSON.stringify({type:'snapshot_request',at:Date.now()}));return true;}catch(_){}}
    return false;
  }
  async function realtimeStateTick(waitMs=8){
    if(realtimeOpen()){requestRealtimeSnapshot();if(waitMs>0)await sleep(waitMs);return lastStatus;}
    return await refreshStatus(false);
  }
  function failFastPending(code,message){
    for(const [id,p] of Array.from(fastPendingCommands.entries())){
      fastPendingCommands.delete(id);clearTimeout(p.timer);const e=new Error(message||'Fast Lane terputus.');e.code=code||'REMOTE_FAST_CLOSED';p.reject(e);
    }
  }
  function closeFastLane(){
    closeDirectPeer(false);fastReady=false;fastConnecting=false;if(fastReconnectTimer){clearTimeout(fastReconnectTimer);fastReconnectTimer=null;}
    if(fastHeartbeatTimer){clearInterval(fastHeartbeatTimer);fastHeartbeatTimer=null;}if(mobilePresenceTimer){clearInterval(mobilePresenceTimer);mobilePresenceTimer=null;}const ws=fastWs;fastWs=null;if(ws){try{ws.close(1000,'mobile-close');}catch(_){}}failFastPending('REMOTE_FAST_CLOSED','Fast Lane ditutup.');
  }
  function scheduleFastReconnect(delay=900){
    if(!opened||document.hidden||fastReconnectTimer||mobileConflictBlocked)return;
    fastReconnectTimer=setTimeout(()=>{fastReconnectTimer=null;void connectFastLane();},Math.max(500,delay));
  }
  async function connectFastLane(forceTicket=false){
    if(!opened||fastConnecting||fastSocketOpen()||document.hidden||mobileConflictBlocked)return;
    fastConnecting=true;
    let ticket=null,openedOk=false;
    try{
      ticket=await getFastTicket(forceTicket);
      if(!ticket||ticket.fastAvailable!==true||!ticket.ticket){fastConnecting=false;scheduleFastReconnect(1500);return;}
      const ws=new WebSocket(fastWsUrl(ticket.ticket));fastWs=ws;
      const guard=setTimeout(()=>{try{if(ws.readyState!==WebSocket.OPEN)ws.close();}catch(_){}},4200);
      ws.onopen=()=>{
        openedOk=true;clearTimeout(guard);fastConnecting=false;fastReady=true;
        if(fastHeartbeatTimer)clearInterval(fastHeartbeatTimer);
        fastHeartbeatTimer=setInterval(()=>{try{if(fastSocketOpen())ws.send(JSON.stringify({type:'ping',role:'MOBILE',live:true,at:Date.now()}));}catch(_){}},1000);
        try{ws.send(JSON.stringify({type:'snapshot_request',at:Date.now()}));}catch(_){}
        syncMobilePresenceLoop();
        try{render(lastStatus||{});}catch(_){}
      };
      ws.onmessage=e=>{
        let msg;try{msg=JSON.parse(String(e.data||''));}catch(_){return;}
        if(msg.type==='mobile_conflict'){
          mobileConflictPending=true;mobileConflictBlocked=false;closeDirectPeer(false);showMobileConflict('conflict',msg);return;
        }
        if(msg.type==='mobile_conflict_resolved'){
          mobileConflictPending=false;
          if(msg.authorized===true){mobileConflictBlocked=false;hideMobileConflict();clearFastTicket();requestRealtimeSnapshot();syncMobilePresenceLoop();try{render(lastStatus||{});}catch(_){}}
          else{mobileConflictBlocked=true;hideMobileConflict();}
          return;
        }
        if(msg.type==='mobile_replaced'){
          mobileConflictPending=false;mobileConflictBlocked=true;closeDirectPeer(false);showMobileConflict('replaced',msg);return;
        }
        if(msg.type==='fast_error'&&String(msg.code||'')==='MOBILE_CONFLICT_CONFIRM_REQUIRED'){
          mobileConflictPending=true;showMobileConflict('conflict',msg);return;
        }
        if(msg.type==='presence'){
          const now=Date.now();
          const rawTransport=Object.prototype.hasOwnProperty.call(msg,'desktopTransportOnline')?!!msg.desktopTransportOnline:!!msg.desktopOnline;
          const remoteOnline=Object.prototype.hasOwnProperty.call(msg,'desktopRemoteOnline')?!!msg.desktopRemoteOnline:!!msg.desktopOnline;
          if(rawTransport||remoteOnline){desktopTransportOnline=true;transportRecoveryUntil=0;}
          else{
            if(!transportRecoveryUntil)transportRecoveryUntil=now+15000;
            if(now>transportRecoveryUntil){desktopTransportOnline=false;desktopRemoteReady=false;desktopExecutorReady=false;lastPluginOnlineAt=0;}
          }
          if(!lastStatus)lastStatus={desktopOnline:false,fastLane:true,snapshot:{}};
          lastStatus.fastLane=true;lastStatus.desktopTransportOnline=desktopTransportOnline;
          if(msg.desktopRemoteDisabled===true&&!remoteOnline){
            // REV328: PC Remote toggle OFF is authoritative and must paint the
            // mobile UI Offline immediately. Do not keep the previous transport
            // hysteresis/direct lane alive after an explicit desktop OFF packet.
            desktopExplicitOffAt=now;desktopExecutorExplicitOffAt=now;
            desktopRemotePresenceAt=0;desktopExecutorPresenceAt=0;
            desktopRemoteReady=false;desktopExecutorReady=false;
            desktopTransportOnline=false;lastPluginOnlineAt=0;transportRecoveryUntil=0;
            if(lastStatus)lastStatus.desktopTransportOnline=false;
            closeDirectPeer(false);
            if(opened){
              showRemotePluginGate();
              setTimeout(()=>{try{if(history.state&&history.state.tfRemotePage)history.back();else closeRemote(true);}catch(_){closeRemote(true);}},20);
            }
          }
          else if(remoteOnline){desktopRemotePresenceAt=now;desktopExplicitOffAt=0;desktopRemoteReady=true;}
          // REV278: a transient presence packet with transport=false is NOT an
          // explicit Remote OFF. Only desktopRemoteDisabled=true (toggle OFF)
          // may force the red Offline state. Keep the last good presence through
          // short socket/reconnect jitter.
          if(Object.prototype.hasOwnProperty.call(msg,'desktopExecutorOnline')){
            desktopExecutorReady=msg.desktopExecutorOnline===true;
            if(desktopExecutorReady){desktopExecutorPresenceAt=now;desktopExecutorExplicitOffAt=0;}
            else if(remoteOnline)desktopExecutorExplicitOffAt=now;
          }
          const sid=String(msg.desktopSessionId||'');const seq=Number(msg.desktopSeq||0);
          if(sid){if(desktopSessionId&&desktopSessionId!==sid){closeDirectPeer(false);}desktopSessionId=sid;desktopPresenceSeq=Math.max(desktopPresenceSeq,seq);}
          lastStatus.executorPresenceAt=desktopExecutorPresenceAt;
          lastStatus.desktopOnline=executorOnlineFromState(lastStatus);
          try{render(lastStatus);}catch(_){}
          if(remoteOnline&&fastSocketOpen()){
            try{ws.send(JSON.stringify({type:'snapshot_request',at:Date.now()}));}catch(_){}
            void startDirectPeer();
          }else if(!desktopTransportOnline&&(!desktopRemotePresenceAt||now-desktopRemotePresenceAt>15000))closeDirectPeer(false);
          return;
        }
        if(msg.type==='rtc_signal'){void handleRtcSignal(msg.signal);return;}
        if(msg.type==='command_started'||msg.type==='state_event'){handleRealtimeMessage(msg,'fast');return;}
        if(msg.type==='desktop_snapshot'){desktopTransportOnline=true;handleRealtimeMessage(msg,'fast');return;}
        if(msg.type==='fast_accept'){
          const id=String(msg.clientCommandId||''),p=fastPendingCommands.get(id);
          if(p&&msg.delivered===false){fastPendingCommands.delete(id);clearTimeout(p.timer);const er=new Error('Plugin PC belum tersambung ke Fast Lane.');er.code='REMOTE_FAST_NO_DESKTOP';p.reject(er);}
          return;
        }
        if(msg.type==='command_result'){handleRealtimeMessage(msg,'fast');return;}
      };
      ws.onerror=()=>{};
      ws.onclose=()=>{
        clearTimeout(guard);
        if(fastWs===ws)fastWs=null;
        fastReady=false;fastConnecting=false;desktopTransportOnline=false;
        // Do not flash red during a normal sub-second reconnect. The physical
        // socket is closed, but the last confirmed PC session remains visible
        // for a bounded recovery window.
        transportRecoveryUntil=Date.now()+15000;
        if(fastHeartbeatTimer){clearInterval(fastHeartbeatTimer);fastHeartbeatTimer=null;}
        if(mobilePresenceTimer){clearInterval(mobilePresenceTimer);mobilePresenceTimer=null;}
        closeDirectPeer(false);
        failFastPending('REMOTE_FAST_CLOSED','Fast Lane terputus; mencoba reconnect.');
        try{render(lastStatus||{});}catch(_){}
        if(mobileConflictBlocked)return;
        if(!openedOk&&ticket&&ticket.fromCache){clearFastTicket();scheduleFastReconnect(100);}
        else scheduleFastReconnect(300);
      };
    }catch(_){
      fastConnecting=false;fastReady=false;
      if(mobileConflictBlocked)return;
      if(ticket&&ticket.fromCache){clearFastTicket();scheduleFastReconnect(100);}
      else scheduleFastReconnect(500);
    }
  }
  function sendFastCommand(action,payload,clientCommandId,timeoutMs){
    if(!fastSocketOpen())return Promise.reject(Object.assign(new Error('Fast Lane belum tersambung.'),{code:'REMOTE_FAST_OFFLINE'}));
    return new Promise((resolve,reject)=>{
      const rec=makeRealtimePending(clientCommandId,resolve,reject,'fast',timeoutMs);
      try{fastWs.send(JSON.stringify({type:'command',clientCommandId,action,payload,sentAt:Date.now()}));}
      catch(e){clearTimeout(rec.timer);fastPendingCommands.delete(clientCommandId);reject(e);}
    });
  }

  function loadEvents(){
    try{const v=JSON.parse(localStorage.getItem(EVENT_KEY)||'[]');if(Array.isArray(v))eventLog=v.slice(0,60);}catch(_){eventLog=[];}
  }
  function saveEvents(){try{localStorage.setItem(EVENT_KEY,JSON.stringify(eventLog.slice(0,60)));}catch(_){}}
  function logEvent(message,type='info'){
    const at=new Date();
    eventLog.unshift({at:at.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit',second:'2-digit'}),message:clean(message,500),type});
    if(eventLog.length>60)eventLog.length=60;saveEvents();renderEventLog();
  }
  function renderEventLog(){
    const el=q('tf-remote-event-log');if(!el)return;
    el.innerHTML=eventLog.length?eventLog.map(x=>`<div class="tf-remote-log-row ${esc(x.type)}"><span>${esc(x.at)}</span><div>${esc(x.message)}</div></div>`).join(''):'<div class="tf-remote-empty">Belum ada event Remote.</div>';
  }

  function pairLabels(selected){
    const vals=Array.isArray(selected)&&selected.length?selected:[ALL];
    return [ALL,...PAIRS].map(v=>`<label class="tf-remote-pair-chip"><input type="checkbox" data-pair="${v}" ${vals.includes(v)||((vals.includes('ALL'))&&v===ALL)?'checked':''}><span>${v===ALL?'ALL':v}</span></label>`).join('');
  }

  function ensureButton(){
    const data=q('tf-mobile-data-open');
    if(!data)return false;
    const bar=data.parentNode;
    try{bar.classList.add('tf-mobile-appbar-has-remote');}catch(_){}
    const existing=q('tf-mobile-remote-open');
    if(existing){
      try{bar.insertBefore(existing,data);}catch(_){}
      return true;
    }
    const b=document.createElement('button');b.type='button';b.id='tf-mobile-remote-open';b.className='tf-mobile-appbar-action tf-mobile-remote-open';b.setAttribute('aria-label','Remote plugin');b.innerHTML=ICON_REMOTE+'<span>Remote</span>';
    bar.insertBefore(b,data);
    b.addEventListener('click',()=>{void openRemoteGuarded(false);});return true;
  }

  function ensureUi(){
    if(q('tf-mobile-remote-page'))return q('tf-mobile-remote-page');
    const root=document.createElement('div');root.id='tf-mobile-remote-page';root.className='tf-mobile-remote-page';
    root.innerHTML=`
      <div class="tf-remote-head">
        <button id="tf-remote-back" type="button" class="tf-remote-back" aria-label="Kembali">‹</button>
        <div class="tf-remote-title-wrap"><div class="tf-remote-kicker">PREMIUM REMOTE</div><div class="tf-remote-title">Remote Sidebar PC</div></div>
        <button id="tf-remote-refresh-state" class="tf-remote-icon-btn" type="button" aria-label="Sinkronkan data dari plugin PC">↻</button>
      </div>
      <div class="tf-remote-body">
        <section class="tf-remote-card tf-remote-status-card">
          <div class="tf-remote-status-top"><span id="tf-remote-dot" class="tf-remote-dot"></span><strong id="tf-remote-pc-status">Menghubungkan PC…</strong><span id="tf-remote-version" class="tf-remote-version"></span></div>
          <div id="tf-remote-status-note" class="tf-remote-note">Menyinkronkan kondisi sidebar Chrome.</div>
          <div id="tf-remote-sync-line" class="tf-remote-sync-line"><span class="tf-remote-spinner"></span><span id="tf-remote-sync-text">Menyinkronkan Remote…</span></div>
        </section>

        <section class="tf-remote-card tf-remote-login-card">
          <div class="tf-remote-section-title">Login Traders Family di PC</div>
          <div id="tf-remote-login-note" class="tf-remote-help">Akun plugin PC sedang logout. Login dapat dijalankan dari ponsel.</div>
          <label class="tf-remote-field"><span>Email / Username</span><input id="tf-remote-login-identity" class="tf-remote-login-input" type="text" autocomplete="username" placeholder="Email / Username"></label>
          <label class="tf-remote-field"><span>Password</span><input id="tf-remote-login-password" class="tf-remote-login-input" type="password" autocomplete="current-password" placeholder="Password"></label>
          <label class="tf-remote-toggle"><input id="tf-remote-login-remember" type="checkbox"><span>Remember email / username di plugin PC</span></label>
          <div class="tf-remote-login-actions">
            <button id="tf-remote-login-standard" type="button">Login</button>
          </div>
          <div id="tf-remote-login-progress" class="tf-remote-login-progress" aria-hidden="true"><span class="tf-remote-login-spinner"></span><span>Menunggu plugin PC benar-benar login…</span></div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Sidebar Plugin</div>
          <div class="tf-remote-profile"><div class="tf-remote-avatar"><img id="tf-remote-avatar-img" alt="User photo" /></div><div><strong id="tf-remote-user">TF User</strong><div id="tf-remote-email" class="tf-remote-muted"></div></div></div>
        </section>

        <section class="tf-remote-card">
          <label class="tf-remote-field"><span>Time Range</span><select id="tf-remote-time-select">${RANGE_OPTIONS.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></label>
        </section>

        <section class="tf-remote-card tf-remote-main-only">
          <div class="tf-remote-section-title">Link Analis</div>
          <div class="tf-remote-help">Isi halaman ini selalu mengikuti link + pair yang sedang ada di sidebar PC.</div>
          <div id="tf-remote-analyst-editor" class="tf-remote-editor"></div>
          <div class="tf-remote-editor-actions"><button id="tf-remote-add-row" type="button">Tambahkan Analis</button></div>
          <label class="tf-remote-toggle"><input id="tf-remote-remember-links" type="checkbox"><span>Remember all analyst links</span></label>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">Remote Control</div>
          <div class="tf-remote-actions tf-remote-actions-2">
            <label id="tf-remote-import" class="tf-remote-import-picker-rev294"><span>Import JSON ke PC</span><input id="tf-remote-import-input" type="file" accept=".json,application/json,text/json"></label>
            <button id="tf-remote-export-phone" type="button">Export JSON ke Ponsel</button>
            <button id="tf-remote-update" class="primary" type="button" disabled>Update</button>
            <button id="tf-remote-refresh" type="button">Refresh / Reset</button>
            <button id="tf-remote-submit" type="button">Submit</button>
            <button id="tf-remote-isignal" class="accent" type="button">Scan From iSignal User</button>
            <button id="tf-remote-dashboard" type="button">Buka Dashboard</button>
          </div>
          <div id="tf-remote-import-note" class="tf-remote-help tf-import-unavailable">Update aktif setelah data Import tersedia di plugin Chrome.</div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-section-title">iSignal User / Analysts</div>
          <div class="tf-remote-isignal-mode-note">Mode Scan From iSignal sedang aktif di plugin PC. Tekan Refresh / Reset untuk kembali ke kondisi awal dan menghapus data Remote di PC + ponsel.</div>
          <div id="tf-remote-isignal-analysts" class="tf-remote-analysts"><div class="tf-remote-empty">Belum ada hasil iSignal.</div></div>
        </section>

        <section class="tf-remote-card tf-remote-progress-card">
          <div class="tf-remote-progress-head"><div class="tf-remote-section-title">Batch Scanning Progress</div><strong id="tf-remote-progress-percent">0%</strong></div>
          <div class="tf-remote-progress-track"><i id="tf-remote-progress-fill"></i></div>
          <div id="tf-remote-progress-text" class="tf-remote-progress-text">Belum ada batch scanning berjalan.</div>
          <div id="tf-remote-scan-status" class="tf-remote-console tf-remote-progress-console">Belum ada status.</div>
          <div id="tf-remote-command-status" class="tf-remote-command-status"></div>
        </section>

        <section class="tf-remote-card">
          <div class="tf-remote-event-head"><div class="tf-remote-section-title">Remote Event Log</div><button id="tf-remote-event-clear" type="button" class="tf-remote-event-clear">Clear</button></div>
          <div id="tf-remote-event-log" class="tf-remote-event-log"></div>
        </section>
      </div>
      <div id="tf-remote-delete-overlay" class="tf-remote-delete-overlay" aria-hidden="true">
        <div class="tf-remote-delete-box" role="dialog" aria-modal="true" aria-labelledby="tf-remote-delete-title">
          <strong id="tf-remote-delete-title">Hapus Analis?</strong>
          <span id="tf-remote-delete-text">Link analis ini akan dihapus dari ponsel dan plugin PC.</span>
          <div class="tf-remote-delete-actions">
            <button id="tf-remote-delete-no" type="button">No</button>
            <button id="tf-remote-delete-yes" class="danger" type="button">Yes</button>
          </div>
        </div>
      </div>
      <div id="tf-remote-loading-overlay" class="tf-remote-loading-overlay" aria-hidden="true">
        <div class="tf-remote-loading-box">
          <span class="tf-remote-loading-spinner"></span>
          <strong id="tf-remote-loading-title">Memproses perintah…</strong>
          <span id="tf-remote-loading-text">Menunggu plugin Chrome menyelesaikan proses.</span>
          <button id="tf-remote-loading-cancel-rev293" class="tf-rev293-cancel-btn" type="button">Cancel</button>
        </div>
      </div>`;
    document.body.appendChild(root);
    // Fallback watcher: if any future Remote action changes its label to STOP,
    // attach the same mini spinner automatically.
    if(!window.__tfRemoteStopObserverV316){
      window.__tfRemoteStopObserverV316=new MutationObserver(()=>tfDecorateAllStopButtonsV316());
      window.__tfRemoteStopObserverV316.observe(root,{subtree:true,childList:true,characterData:true});
    }

    q('tf-remote-back').addEventListener('click',navigateBackRemote);
    q('tf-remote-loading-cancel-rev293')?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();void window.tfRev294ConfirmAndCancel('remote');},true);
    q('tf-remote-refresh-state').addEventListener('click',()=>refreshRemoteStateOnly().catch(()=>{}));
    q('tf-remote-refresh').addEventListener('click',()=>refreshResetRemote().catch(()=>{}));
    q('tf-remote-update').addEventListener('click',()=>{
      const b=q('tf-remote-update');
      if(!b||b.disabled)return;
      try{tfEnsureRemoteNotificationPermissionV309();}catch(_){}
      tfRunToggleWithMobileUiAckV313('update').catch(()=>{});
    });
    q('tf-remote-submit').addEventListener('click',()=>{
      const b=q('tf-remote-submit');
      if(!b||b.disabled)return;
      try{tfEnsureRemoteNotificationPermissionV309();}catch(_){}
      tfRunToggleWithMobileUiAckV313('batch_toggle').catch(()=>{});
    });
    q('tf-remote-isignal').addEventListener('click',()=>scanFromIsignalMobile().catch(()=>{}));
    q('tf-remote-dashboard').addEventListener('click',()=>sendCommand('open_dashboard').catch(()=>{}));
    q('tf-remote-login-standard').addEventListener('click',()=>remoteLoginFromMobile('standard').catch(()=>{}));
    q('tf-remote-event-clear').addEventListener('click',()=>{eventLog=[];saveEvents();renderEventLog();});
    q('tf-remote-time-select').addEventListener('change',e=>{markUserAction();sendCommand('set_time_range',{value:e.target.value}).catch(()=>{});});
    q('tf-remote-remember-links').addEventListener('change',e=>{markUserAction();sendCommand('set_remember_links',{value:!!e.target.checked}).catch(()=>{});});
    q('tf-remote-add-row').addEventListener('click',()=>{void addAnalystRowTransaction();});
    q('tf-remote-import').addEventListener('click',()=>{markUserAction();mirrorDeferRequested=true;pcMirrorPending=false;if(pcMirrorTimer){clearTimeout(pcMirrorTimer);pcMirrorTimer=null;}refreshBusyControls();});
    q('tf-remote-import-input').addEventListener('change',async e=>{markUserAction();const f=e.target.files&&e.target.files[0];e.target.value='';if(f)await importFromPhone(f);});
    q('tf-remote-export-phone').addEventListener('click',()=>{markUserAction();exportJsonToPhone();});
    q('tf-remote-analyst-editor').addEventListener('input',e=>{const row=e.target&&e.target.closest?e.target.closest('.tf-remote-editor-row'):null;if(!row||!e.target.matches('.tf-remote-link-input'))return;markUserAction();editorDirty=true;updateLinkDraftState(row);refreshBusyControls();});
    q('tf-remote-analyst-editor').addEventListener('paste',e=>{const row=e.target&&e.target.closest?e.target.closest('.tf-remote-editor-row'):null;if(!row||!e.target.matches('.tf-remote-link-input'))return;markUserAction();editorDirty=true;setTimeout(()=>{if(row&&row.isConnected){updateLinkDraftState(row);refreshBusyControls();}},0);});
    q('tf-remote-analyst-editor').addEventListener('change',e=>{const row=e.target&&e.target.closest?e.target.closest('.tf-remote-editor-row'):null;if(!row)return;if(row.dataset.tfPairLocked==='1'&&e.target.matches('input[data-pair]')){e.preventDefault();return;}markUserAction();editorDirty=true;if(e.target.matches('input[data-pair]')){pairExclusivity(e.target);row.dataset.tfPairDraftDirty='1';/* Pair remains local draft until CONFIRM. */refreshBusyControls();return;}if(e.target.matches('.tf-remote-link-input'))updateLinkDraftState(row);refreshBusyControls();});
    q('tf-remote-analyst-editor').addEventListener('click',async e=>{const cl=e.target.closest('[data-confirm-link]');if(cl){const row=cl.closest('.tf-remote-editor-row');if(row)await confirmLinkSelection(row);return;}const cf=e.target.closest('[data-confirm-pair]');if(cf){const row=cf.closest('.tf-remote-editor-row');if(row)await confirmPairSelection(row);return;}const rm=e.target.closest('[data-remove-row]');if(!rm)return;const row=rm.closest('.tf-remote-editor-row');if(!row)return;await removeRowWithConfirmation(row);});
    q('tf-remote-analyst-editor').addEventListener('toggle',e=>{const d=e.target;if(!(d&&d.matches&&d.matches('.tf-remote-pair-details')))return;const row=d.closest('.tf-remote-editor-row');if(!row||row.dataset.tfPairLocked==='1')return;if(d.open){const committed=confirmedPairs(row);row.querySelectorAll('.tf-remote-pair-grid input[data-pair]').forEach(cb=>{cb.checked=committed.includes(cb.dataset.pair);});row.dataset.tfPairDraftDirty='0';return;}if(row.dataset.tfPairCommitting==='1')return;if(row.dataset.tfPairDraftDirty==='1'){const committed=confirmedPairs(row);row.querySelectorAll('.tf-remote-pair-grid input[data-pair]').forEach(cb=>{cb.checked=committed.includes(cb.dataset.pair);});row.dataset.tfPairDraftDirty='0';editorDirty=false;refreshBusyControls();}},true);
    renderEventLog();
    return root;
  }

  function pairExclusivity(target){
    if(!target||target.type!=='checkbox'||!target.dataset.pair)return;
    const root=target.closest('.tf-remote-pair-grid');if(!root)return;
    const all=root.querySelector('input[data-pair="'+ALL+'"]');
    const others=Array.from(root.querySelectorAll('input[data-pair]')).filter(x=>x!==all);
    if(target===all&&target.checked)others.forEach(x=>x.checked=false);
    if(target!==all&&target.checked&&all)all.checked=false;
    if(!Array.from(root.querySelectorAll('input[data-pair]')).some(x=>x.checked)&&all)all.checked=true;
  }
  function collectCheckedPairs(root){
    if(!root)return [ALL];
    const vals=Array.from(root.querySelectorAll('input[data-pair]:checked')).map(x=>x.dataset.pair);return vals.length?vals:[ALL];
  }
  function pairSummaryText(values){
    const vals=Array.isArray(values)&&values.length?values:[ALL];
    if(vals.includes(ALL)||vals.includes('ALL'))return 'ALL';
    if(vals.length===1)return String(vals[0]||'ALL').toUpperCase();
    return vals.length+' Pairs';
  }
  function updatePairSummary(row){
    if(!row)return;
    const out=row.querySelector('.tf-remote-pair-summary');
    if(out)out.textContent=pairSummaryText(collectCheckedPairs(row.querySelector('.tf-remote-pair-grid')));
  }
  function addEditorRow(item={}){
    const box=q('tf-remote-analyst-editor');if(!box)return;
    const idx=box.querySelectorAll('.tf-remote-editor-row').length+1;
    const pairs=Array.isArray(item.pairs)&&item.pairs.length?item.pairs:[ALL];
    const rawSource=String(item.source||'manual').toLowerCase();
    const source=rawSource==='import'?'import':rawSource==='isignal'?'isignal':'manual';
    const pairLocked=!!(item.pairLocked||source==='import');
    const nameReady=!!(item.nameReady===true||source==='import'||source==='isignal');
    const resolvedName=clean(item.name||item.analystName||'',90);
    // REV256: manual URL rows must remain predictable before batch scanning.
    const displayName=(source==='manual'&&!nameReady)?('Analis '+idx):(resolvedName||('Analis '+idx));
    const currentUrl=clean(item.url||'',520);const linkConfirmed=!!(currentUrl&&(item.linkConfirmed===true||item.localDraft!==true));
    const row=document.createElement('div');row.className='tf-remote-editor-row'+(pairLocked?' tf-remote-import-locked':' tf-remote-pair-confirmed');row.dataset.tfPairLocked=pairLocked?'1':'0';row.dataset.tfLocalDraft=item.localDraft===true?'1':'0';row.dataset.tfSource=source;row.dataset.tfNameReady=nameReady?'1':'0';row.dataset.tfConfirmedPairs=JSON.stringify(pairs);row.dataset.tfPcConfirmedPairs=JSON.stringify(pairs);row.dataset.tfPairPendingPc='0';row.dataset.tfPairDraftDirty='0';row.dataset.tfRowKey=clean(item.rowKey||'',120);row.dataset.tfNeedsPcAdd=item.needsPcAdd===true?'1':'0';row.dataset.tfPcRowReady=item.pcRowReady===true?'1':'0';row.dataset.tfConfirmedUrl=linkConfirmed?currentUrl:'';row.dataset.tfDraftUrl=currentUrl;row.innerHTML=`
      <div class="tf-remote-editor-head"><strong><span data-row-number>${idx}</span>. <span class="tf-remote-editor-name">${esc(displayName)}</span></strong><button data-remove-row type="button">✕</button></div>
      ${pairLocked?`<input class="tf-remote-link-input" type="url" inputmode="url" placeholder="https://account.tradersfamily.id/channels/..." value="${esc(currentUrl)}" readonly>`:`<div class="tf-remote-link-line"><input class="tf-remote-link-input" type="url" inputmode="url" placeholder="https://account.tradersfamily.id/channels/..." value="${esc(currentUrl)}"><button type="button" class="tf-remote-link-confirm${linkConfirmed?' is-success':''}" data-confirm-link>CONFIRM</button></div>`}
      <div class="tf-remote-pair-line"><details class="tf-remote-pair-details"><summary>${pairLocked?'Pair Import (Locked)':'Selector Pair'}</summary><div class="tf-remote-pair-grid">${pairLabels(pairs)}</div>${pairLocked?'':'<button type="button" class="tf-remote-pair-confirm" data-confirm-pair>CONFIRM</button>'}</details><span class="tf-remote-pair-summary">${esc(pairSummaryText(pairs))}</span></div>`;
    if(pairLocked)row.querySelectorAll('.tf-remote-pair-grid input[data-pair]').forEach(cb=>cb.disabled=true);
    box.appendChild(row);
    updatePairSummary(row);
    return row;
  }
  function renumberEditor(){q('tf-remote-analyst-editor')?.querySelectorAll('.tf-remote-editor-row').forEach((r,i)=>{const n=r.querySelector('[data-row-number]');if(n)n.textContent=String(i+1);});}
  function rowIndex(row){return Array.from(q('tf-remote-analyst-editor')?.querySelectorAll('.tf-remote-editor-row')||[]).indexOf(row);}
  function analystSig(items){return JSON.stringify((Array.isArray(items)?items:[]).map(x=>[x&&x.name||'',x&&x.url||'',x&&x.pairs||[],!!(x&&x.pairLocked),x&&x.source||'',!!(x&&x.nameReady),x&&x.rowKey||'']));}
  function renderEditor(items,pcRowCount=0,rowCountTrusted=false){
    if(editorDirty)return;
    const box=q('tf-remote-analyst-editor');if(!box)return;
    const now=Date.now();
    const emptyDraftRows=Array.from(box.querySelectorAll('.tf-remote-editor-row[data-tf-local-draft="1"]')).filter(r=>!clean(r.querySelector('.tf-remote-link-input')?.value||'',520));
    const emptyDrafts=emptyDraftRows.length;
    const incoming=Array.isArray(items)?items.filter(x=>x&&(x.rowExists===true||clean(x.url||'',520)||clean(x.rowKey||'',120)||clean(x.name||'',90))):[];
    const incomingUrls=new Set(incoming.map(x=>clean(x&&x.url||'',520)).filter(Boolean));
    for(const [url,entry] of Array.from(pendingLocalRows.entries())){
      if(incomingUrls.has(url)){
        if(!entry.pcSeenAt)entry.pcSeenAt=now;
        if(now-entry.pcSeenAt>10000){pendingLocalRows.delete(url);continue;}
      }
    }
    const merged=incoming.slice();
    const mergedUrls=new Set(incomingUrls);
    for(const [url,entry] of pendingLocalRows.entries()){
      if(!url||mergedUrls.has(url))continue;
      merged.push({url,pairs:Array.isArray(entry.pairs)&&entry.pairs.length?entry.pairs:[ALL],name:'',source:'manual',nameReady:false,localDraft:true,rowKey:entry.rowKey||''});
      mergedUrls.add(url);
    }

    // REV269 HARD RULE: analystRowCount is informational only. It NEVER creates
    // UI rows. A Mobile row exists only because it has a real item/rowKey/URL or
    // because the user explicitly created a local draft with Tambahkan Analis.
    // Therefore a transient PC count of 16/28 cannot create ghost Link rows.
    // REV281 APK-only: a synthetic empty Mobile placeholder must never be kept beside a real PC snapshot row.
    // If PC supplies at least one authoritative row, discard all stale empty Mobile drafts; otherwise keep exactly one base placeholder.
    const desiredEmptyRows=merged.length?0:Math.min(1,emptyDrafts);
    const sig=analystSig(merged)+'|drafts:'+desiredEmptyRows+'|strictRowId:1|pending:'+Array.from(pendingLocalRows.keys()).sort().join(',');
    if(sig===lastEditorSignature)return;lastEditorSignature=sig;
    box.innerHTML='';
    merged.slice(0,Math.max(0,28-desiredEmptyRows)).forEach(item=>{
      const url=clean(item&&item.url||'',520);
      if(url&&pendingLocalRows.has(url))item=Object.assign({},item,{localDraft:true});
      addEditorRow(item);
    });
    if(!merged.length&&!desiredEmptyRows)addEditorRow({url:'',pairs:[ALL],name:'',source:'manual',localDraft:true,pcRowReady:true});
    for(let i=0;i<desiredEmptyRows&&box.querySelectorAll('.tf-remote-editor-row').length<28;i++)addEditorRow({url:'',pairs:[ALL],name:'',source:'manual',localDraft:true,pcRowReady:true});
    renumberEditor();
  }

  function collectAnalysts(){
    const rows=Array.from(q('tf-remote-analyst-editor')?.querySelectorAll('.tf-remote-editor-row')||[]);
    return rows.map(r=>({name:clean(r.querySelector('.tf-remote-editor-name')?.textContent||'',90),url:clean(r.querySelector('.tf-remote-link-input')?.value||'',520),pairs:confirmedPairs(r)})).filter(x=>x.url);
  }
  function confirmedPairs(row){
    try{const v=JSON.parse(row&&row.dataset.tfConfirmedPairs||'[]');return Array.isArray(v)&&v.length?v:[ALL];}catch(_){return [ALL];}
  }
  function rowPayload(row,pairsOverride=null){
    const pairs=Array.isArray(pairsOverride)&&pairsOverride.length?pairsOverride:confirmedPairs(row);
    return {index:rowIndex(row),rowKey:rowKey(row),name:clean(row.querySelector('.tf-remote-editor-name')?.textContent||'',90),url:clean(row.querySelector('.tf-remote-link-input')?.value||'',520),pairs,pairLocked:row.dataset.tfPairLocked==='1',source:row.dataset.tfSource||'manual'};
  }
  function samePairs(a,b){return JSON.stringify((a||[]).slice().sort())===JSON.stringify((b||[]).slice().sort());}
  function setLinkConfirmState(row,state){
    const btn=row&&row.querySelector?row.querySelector('[data-confirm-link]'):null;if(!btn)return;
    btn.classList.remove('is-processing','is-success','is-failed');
    if(state==='processing')btn.classList.add('is-processing');
    else if(state==='success')btn.classList.add('is-success');
    else if(state==='failed')btn.classList.add('is-failed');
    btn.disabled=state==='processing';
  }
  function pcConfirmedPairs(row){
    try{const v=JSON.parse(row&&row.dataset.tfPcConfirmedPairs||'[]');return Array.isArray(v)&&v.length?v:[ALL];}catch(_){return [ALL];}
  }
  function updateLinkDraftState(row){
    if(!row)return;
    const input=row.querySelector('.tf-remote-link-input');const url=clean(input&&input.value||'',520);const previous=clean(row.dataset.tfDraftUrl||'',520);const confirmed=clean(row.dataset.tfConfirmedUrl||'',520);
    if(row.dataset.tfLocalDraft==='1'&&previous&&previous!==url)pendingLocalRows.delete(previous);
    row.dataset.tfDraftUrl=url;
    if(row.dataset.tfLocalDraft==='1'&&url){const prev=pendingLocalRows.get(url)||{};pendingLocalRows.set(url,{...prev,url,pairs:confirmedPairs(row),source:'manual',name:'',nameReady:false,createdAt:prev.createdAt||Date.now(),pcSeenAt:prev.pcSeenAt||0,confirmed:prev.confirmed===true});}
    const pairPending=row.dataset.tfPairPendingPc==='1'||!samePairs(confirmedPairs(row),pcConfirmedPairs(row));
    setLinkConfirmState(row,url&&url===confirmed&&!pairPending?'success':'idle');
  }
  async function confirmLinkSelection(row){
    if(!row||!row.isConnected||row.dataset.tfPairLocked==='1')return false;
    const selectedPairs=confirmedPairs(row);const payload=rowPayload(row,selectedPairs);const url=payload.url;
    markUserAction();editorDirty=true;updateLinkDraftState(row);
    if(payload.index<0||!url){setLinkConfirmState(row,'failed');logEvent('Isi Link Analis terlebih dahulu sebelum CONFIRM.','err');return false;}
    if(importTransferBusy||loginBusy){setLinkConfirmState(row,'failed');logEvent('Tunggu proses Remote selesai sebelum CONFIRM Link + Pair.','err');return false;}
    const alreadySynced=clean(row.dataset.tfConfirmedUrl||'',520)===url&&row.dataset.tfPairPendingPc!=='1'&&samePairs(selectedPairs,pcConfirmedPairs(row));
    if(alreadySynced){setLinkConfirmState(row,'success');editorDirty=false;return true;}
    setLinkConfirmState(row,'processing');row.classList.add('tf-remote-row-syncing');refreshBusyControls();
    try{
      if(row.dataset.tfNeedsPcAdd==='1'&&row.dataset.tfPcRowReady!=='1'){
        const ready=await ensurePcAnalystRow(row);if(!ready)throw new Error('Row target belum tersedia di plugin PC.');
      }
      // REV287: ONE button beside the Link input commits BOTH Link + locally
      // confirmed Pair selection. Pair selector CONFIRM never talks to the PC.
      const result=await sendCommand('set_analysts',{mode:'patch',field:'link_pair',...payload,pairs:selectedPairs},{timeoutMs:8500,keepOverlayUntilHydrated:true,label:'Confirm Link + Pair',quiet:true});
      let matched=result&&result.analyst||null;
      let verified=!!(result&&result.ok!==false&&result.linkVerified===true&&result.pairsVerified===true&&matched&&clean(matched.url||'',520)===url&&samePairs(matched.pairs||[],selectedPairs));
      if(!verified){
        const started=Date.now();
        while(opened&&Date.now()-started<4200){
          const st=realtimeOpen()?await realtimeStateTick(45):await refreshStatus(false);const aa=st&&st.snapshot&&Array.isArray(st.snapshot.analysts)?st.snapshot.analysts:[];
          matched=aa.find(x=>x&&payload.rowKey&&String(x.rowKey||'')===payload.rowKey)||aa.find(x=>x&&Number(x.no)===payload.index+1&&clean(x.url||'',520)===url)||aa.find(x=>x&&clean(x.url||'',520)===url)||null;
          if(matched&&clean(matched.url||'',520)===url&&samePairs(matched.pairs||[],selectedPairs)){verified=true;break;}
          await sleep(realtimeOpen()?35:180);
        }
      }
      if(!verified)throw new Error(result&&result.message||'Link + Pair belum terverifikasi di plugin PC.');
      row.dataset.tfConfirmedUrl=url;row.dataset.tfDraftUrl=url;row.dataset.tfLocalDraft='0';row.dataset.tfPcConfirmedPairs=JSON.stringify(selectedPairs);row.dataset.tfPairPendingPc='0';row.dataset.tfLastLinkSync=JSON.stringify([payload.index,payload.rowKey,url,selectedPairs]);
      const pe=pendingLocalRows.get(url);if(pe){pe.confirmed=true;pe.pcSeenAt=pe.pcSeenAt||Date.now();pe.pairs=selectedPairs;}
      setLinkConfirmState(row,'success');editorDirty=false;lastEditorSignature='';updatePairSummary(row);
      if(lastStatus&&lastStatus.snapshot&&Array.isArray(result&&result.analysts))lastStatus.snapshot.analysts=result.analysts;
      logEvent('Link + Pair '+pairSummaryText(selectedPairs)+' Row '+(payload.index+1)+' sudah aktif di plugin PC.','ok');
      setTimeout(()=>{if(opened){if(realtimeOpen()){sendMobileUiPresence(true);requestRealtimeSnapshot();}else refreshStatus(false).catch(()=>{});}},30);
      return true;
    }catch(e){setLinkConfirmState(row,'failed');logEvent('CONFIRM Link + Pair gagal: '+(e.message||e),'err');editorDirty=true;return false;}
    finally{row.classList.remove('tf-remote-row-syncing');refreshBusyControls();}
  }
  async function confirmPairSelection(row){
    if(!row||!row.isConnected||row.dataset.tfPairLocked==='1')return false;
    const draft=collectCheckedPairs(row.querySelector('.tf-remote-pair-grid'));
    const details=row.querySelector('.tf-remote-pair-details');if(details)details.open=false;
    row.dataset.tfConfirmedPairs=JSON.stringify(draft);
    row.dataset.tfPairDraftDirty='0';row.dataset.tfPairCommitting='0';row.dataset.tfPairPendingPc=samePairs(draft,pcConfirmedPairs(row))?'0':'1';
    row.querySelectorAll('.tf-remote-pair-grid input[data-pair]').forEach(cb=>{cb.checked=draft.includes(cb.dataset.pair);});
    row.classList.remove('tf-remote-pair-draft','tf-remote-pair-failed');row.classList.add('tf-remote-pair-confirmed');
    const btn=row.querySelector('[data-confirm-pair]');if(btn){btn.classList.add('is-local-confirmed');setTimeout(()=>btn&&btn.isConnected&&btn.classList.remove('is-local-confirmed'),900);}
    updatePairSummary(row);updateLinkDraftState(row);
    // Keep editorDirty while Pair differs from the PC so incoming snapshots do
    // not overwrite the user's local selection before Link CONFIRM is pressed.
    editorDirty=row.dataset.tfPairPendingPc==='1'||clean(row.dataset.tfDraftUrl||'',520)!==clean(row.dataset.tfConfirmedUrl||'',520);
    markUserAction();refreshBusyControls();
    logEvent('Pair '+pairSummaryText(draft)+' dipilih di ponsel. Belum dikirim ke PC; tekan CONFIRM di samping Link untuk mengirim Link + Pair.','info');
    return true;
  }

  function markUserAction(){
    lastUserActionAt=Date.now();mirrorDeferRequested=true;
    if(pcMirrorTimer){clearTimeout(pcMirrorTimer);pcMirrorTimer=null;}
  }
  function scheduleAnalystSync(delay=520){
    // REV243 legacy compatibility: full-list sync is no longer used for edits.
    if(analystSyncTimer)clearTimeout(analystSyncTimer);
    analystSyncTimer=setTimeout(()=>{analystSyncTimer=null;},Math.max(100,delay));
  }
  function rowKey(row){
    // REV283: never manufacture identity for an existing PC row. If the PC
    // snapshot has no rowKey, index is the authoritative fallback.
    return row?clean(row.dataset.tfRowKey||'',120):'';
  }
  async function addAnalystRowTransactionLegacyOptimistic(){
    if(!opened)return null;
    markUserAction();
    setCommandOverlay(true,'Menambahkan tepat satu row di plugin PC…','Tambahkan Analis');
    setSyncing(true,'Mengirim Add Row real-time…');
    setButtonLoading('add_analyst',true);
    refreshBusyControls();
    await nextPaint();
    let row=null,index=-1,key='',result=null;
    try{
      if(importTransferBusy||loginBusy)throw new Error('Tunggu Import/Login selesai sebelum Tambahkan Analis.');
      if((!lastStatus||!lastStatus.desktopOnline||!lastSuccessAt||Date.now()-lastSuccessAt>3000)&&!realtimeOpen())await refreshStatus(true);
      if(!lastStatus||!lastStatus.desktopOnline)throw new Error('PC/sidebar belum Online. Row baru belum dapat dibuat.');

      // Paint one local draft instantly. This is UI-only until the PC ACK proves
      // that the same stable rowKey exists on desktop.
      row=addEditorRow({url:'',pairs:[ALL],name:'',source:'manual',localDraft:true,needsPcAdd:true,pcRowReady:false});
      if(!row)throw new Error('Area Link Analis di ponsel belum siap.');
      renumberEditor();editorDirty=true;lastEditorSignature='';
      index=rowIndex(row);key=rowKey(row);
      row.classList.add('tf-remote-row-syncing');

      // REV270: ONE user tap sends ONE add transaction. No automatic retry loop.
      // If the transport result is lost, the stable rowKey is checked first; a
      // later retry with the same key is idempotent on PC.
      result=await sendCommand('add_analyst',{index,rowNumber:index+1,expectedRowCount:index+1,rowKey:key,addRequestId:key},{timeoutMs:7000,keepOverlayUntilHydrated:true,label:'Tambahkan Analis'});
      const ok=!!(result&&result.ok!==false&&result.verified===true&&Number(result.index)===index&&String(result.rowKey||'')===key&&Number(result.rowCount||0)>index);
      if(!ok)throw new Error(result&&result.message||'Row baru belum terverifikasi di plugin PC.');

      row.dataset.tfPcRowReady='1';row.dataset.tfNeedsPcAdd='0';row.dataset.tfPreserveUntil=String(Date.now()+15000);row.dataset.tfLocalDraft='1';
      editorDirty=false;lastEditorSignature='';
      if(lastStatus&&lastStatus.snapshot){
        const aa=Array.isArray(lastStatus.snapshot.analysts)?lastStatus.snapshot.analysts:[];
        if(!aa.some(x=>x&&String(x.rowKey||'')===key))aa.splice(Math.min(index,aa.length),0,{no:index+1,url:'',pairs:[ALL],rowKey:key,source:'manual'});
        lastStatus.snapshot.analysts=aa;
        lastStatus.snapshot.analystRowCount=Math.max(1,aa.length);
        lastStatus.snapshot.analystRowCountMode='strict-rowid-rev272';
      }
      setCommandOverlay(false);setSyncing(false);
      logEvent('Tepat satu row '+(index+1)+' dibuat di Mobile dan plugin PC.','ok');
      setTimeout(()=>{if(opened){if(realtimeOpen()){sendMobileUiPresence(true);requestRealtimeSnapshot();}else refreshStatus(false).catch(()=>{});}},25);
      return result;
    }catch(e){
      // Lost ACK is NOT permission to add another PC row. Ask for state once and
      // accept the existing row if the same key is already present.
      try{
        const st=realtimeOpen()?await realtimeStateTick(45):await refreshStatus(false);
        const aa=st&&st.snapshot&&Array.isArray(st.snapshot.analysts)?st.snapshot.analysts:[];
        const found=aa.find(x=>x&&String(x.rowKey||'')===key);
        if(found&&row){
          row.dataset.tfPcRowReady='1';row.dataset.tfNeedsPcAdd='0';row.dataset.tfLocalDraft='1';editorDirty=false;lastEditorSignature='';
          logEvent('ACK Add terlambat, tetapi row yang sama sudah ditemukan di PC. Tidak membuat row kedua.','ok');
          return {ok:true,verified:true,index:rowIndex(row),rowKey:key,rowCount:aa.length,alreadyReady:true};
        }
      }catch(_){ }
      if(row){row.dataset.tfNeedsPcAdd='1';row.dataset.tfPcRowReady='0';row.dataset.tfAddRetryAfter=String(Date.now()+1200);}
      logEvent('Tambahkan Analis gagal tanpa retry otomatis: '+(e.message||e),'err');
      return null;
    }finally{
      if(row)row.classList.remove('tf-remote-row-syncing');
      setButtonLoading('add_analyst',false);setCommandOverlay(false);setSyncing(false);refreshBusyControls();
    }
  }

  async function addAnalystRowTransaction(){
    if(!opened)return null;
    markUserAction();
    setCommandOverlay(true,'Meneruskan klik Tambahkan Analis ke plugin PC…','Tambahkan Analis');
    setSyncing(true,'Menunggu row baru benar-benar muncul di plugin PC…');
    setButtonLoading('add_analyst',true);
    refreshBusyControls();
    await nextPaint();
    const key='mobrow-'+(++localRowSeq)+'-'+Date.now().toString(36);
    try{
      if(importTransferBusy||loginBusy)throw new Error('Tunggu Import/Login selesai sebelum Tambahkan Analis.');
      if((!lastStatus||!lastStatus.desktopOnline||!lastSuccessAt||Date.now()-lastSuccessAt>3000)&&!realtimeOpen())await refreshStatus(true);
      if(!lastStatus||!lastStatus.desktopOnline)throw new Error('PC/sidebar belum Online. Tombol belum dapat diteruskan.');

      // REV280: Mobile never paints a draft row. It forwards one click and only
      // mirrors the row list returned by the authoritative PC plugin.
      const result=await sendCommand('add_analyst',{append:true,rowKey:key,addRequestId:key},{timeoutMs:12000,keepOverlayUntilHydrated:true,label:'Tambahkan Analis'});
      const analysts=result&&Array.isArray(result.analysts)?result.analysts:[];
      const found=analysts.find(x=>x&&String(x.rowKey||'')===key);
      if(!result||result.ok===false||result.verified!==true||!found)throw new Error(result&&result.message||'Row baru belum muncul di plugin PC.');

      if(!lastStatus)lastStatus={desktopOnline:true,snapshot:{}};
      if(!lastStatus.snapshot)lastStatus.snapshot={};
      lastStatus.snapshot.analysts=analysts;
      lastStatus.snapshot.analystRowCount=Math.max(1,Number(result.rowCount)||analysts.length);
      editorDirty=false;lastEditorSignature='';
      render(lastStatus);
      logEvent('Plugin PC membuat Row '+(Number(result.index)+1)+'; ponsel mengikuti snapshot PC.','ok');
      requestRealtimeSnapshot();
      return result;
    }catch(e){
      // A lost ACK may hide a successful PC click. Accept only a fresh snapshot
      // containing the same rowKey; otherwise keep Mobile unchanged.
      try{
        const st=realtimeOpen()?await realtimeStateTick(80):await refreshStatus(false);
        const analysts=st&&st.snapshot&&Array.isArray(st.snapshot.analysts)?st.snapshot.analysts:[];
        const found=analysts.find(x=>x&&String(x.rowKey||'')===key);
        if(found){editorDirty=false;lastEditorSignature='';render(st);logEvent('Row sudah muncul di PC; ACK terlambat dan ponsel mengikuti snapshot PC.','ok');return {ok:true,verified:true,index:Number(found.no||1)-1,rowKey:key,rowCount:analysts.length,analysts};}
      }catch(_){ }
      logEvent('Tambahkan Analis gagal: '+(e.message||e)+'. Tidak ada row lokal yang dibuat.','err');
      return null;
    }finally{
      setButtonLoading('add_analyst',false);setCommandOverlay(false);setSyncing(false);refreshBusyControls();
    }
  }

  async function ensurePcAnalystRow(row){
    if(!row||!row.isConnected)return false;
    if(row.dataset.tfNeedsPcAdd!=='1'||row.dataset.tfPcRowReady==='1')return true;
    const now=Date.now(),retryAfter=Number(row.dataset.tfAddRetryAfter||0);
    if(retryAfter>now)return false;
    const key=rowKey(row),existing=rowAddPromises.get(key);if(existing)return await existing;
    const task=(async()=>{
      const index=rowIndex(row);if(index<0)return false;
      row.dataset.tfAddRetryAfter=String(Date.now()+1200);
      try{
        const r=await sendCommand('add_analyst',{index,rowNumber:index+1,expectedRowCount:index+1,rowKey:key,addRequestId:key},{quiet:true,background:true,timeoutMs:7000,label:'Tambahkan Analis'});
        if(r&&r.ok!==false&&r.verified===true&&Number(r.index)===index&&String(r.rowKey||'')===key&&Number(r.rowCount||0)>index){
          row.dataset.tfPcRowReady='1';row.dataset.tfNeedsPcAdd='0';row.dataset.tfAddRetryAfter='0';
          if(!clean(row.querySelector('.tf-remote-link-input')?.value||'',520)&&row.dataset.tfPairDraftDirty!=='1'&&row.dataset.tfPairCommitting!=='1'){editorDirty=false;lastEditorSignature='';}
          return true;
        }
      }catch(e){
        // Do not loop. A future user/input event may retry after cooldown with
        // the SAME rowKey, which the desktop treats idempotently.
        try{
          const st=realtimeOpen()?await realtimeStateTick(35):await refreshStatus(false);const aa=st&&st.snapshot&&Array.isArray(st.snapshot.analysts)?st.snapshot.analysts:[];
          if(aa.some(x=>x&&String(x.rowKey||'')===key)){row.dataset.tfPcRowReady='1';row.dataset.tfNeedsPcAdd='0';row.dataset.tfAddRetryAfter='0';return true;}
        }catch(_){ }
        logEvent('Row PC belum siap; tidak ada retry berantai: '+(e.message||e),'err');
      }
      return false;
    })();
    rowAddPromises.set(key,task);
    try{return await task;}finally{rowAddPromises.delete(key);}
  }

  async function waitUntilLinkReadyForPair(row,url,timeoutMs=42000){
    const started=Date.now();
    while(opened&&row&&row.isConnected&&Date.now()-started<timeoutMs){
      if(row.dataset.tfNeedsPcAdd==='1'&&row.dataset.tfPcRowReady!=='1')await ensurePcAnalystRow(row);
      if(!rowSyncBusy.has(row))await syncRowRealtime(row);
      const indexNow=rowIndex(row),keyNow=rowKey(row),syncSig=JSON.stringify([indexNow,keyNow,url]);
      // REV267: syncRowRealtime sets tfLastLinkSync only after the PC URL is
      // verified. Reuse that proof instead of forcing another HTTP status read.
      if(row.dataset.tfLastLinkSync===syncSig)return {url,rowKey:keyNow,no:indexNow+1,verified:true,transport:directSocketOpen()?'direct':fastSocketOpen()?'fast':'relay'};
      try{
        const st=realtimeOpen()?await realtimeStateTick(35):await refreshStatus(false);const aa=st&&st.snapshot&&Array.isArray(st.snapshot.analysts)?st.snapshot.analysts:[];
        const key=rowKey(row),index=rowIndex(row);
        const pc=aa.find(x=>x&&key&&String(x.rowKey||'')===key)||aa.find(x=>x&&Number(x.no)===index+1&&clean(x.url||'',520)===url)||aa.find(x=>x&&clean(x.url||'',520)===url);
        if(pc)return pc;
      }catch(_){ }
      await sleep(realtimeOpen()?35:360);
    }
    return null;
  }

  function scheduleRowSync(row,delay=420){
    // REV283 hard lock: legacy callers are intentionally ignored. Link updates
    // are allowed only through confirmLinkSelection() after an explicit tap.
    return;
  }
  async function syncRowRealtime(row){
    // REV283: disabled legacy auto-sync path. Keep function only for compatibility.
    return false;
  }
  async function syncAnalystsRealtime(){return false;}

  function setSyncing(active,text){const line=q('tf-remote-sync-line'),label=q('tf-remote-sync-text');if(label&&text)label.textContent=text;if(line)line.classList.toggle('show',!!active);}
  function actionLabel(action){const m={refresh:'Refresh / Reset',update:'Update / Batch Scanning',batch_toggle:'Submit / Batch',scan_from_isignal:'Scan From iSignal User',open_dashboard:'Buka Dashboard',set_time_range:'Ubah Time Range',set_remember_links:'Remember Links',add_analyst:'Tambahkan Analis',patch_analyst:'Sinkron Link + Pair Analis',remove_analyst:'Hapus Analis',set_analysts:'Sinkron Link & Pair Analis'};return m[action]||String(action||'Perintah Remote');}
  async function tfRev294ForceCancelRemoteCore(){
    tfRev294CancelSerial++;
    // Abort HTTP waits immediately.
    try{for(const ctl of Array.from(tfRev294ApiControllers)){try{ctl.abort();}catch(_){}}tfRev294ApiControllers.clear();}catch(_){}
    // Reject realtime waits so DIRECT/WebSocket promises do not remain stuck.
    try{for(const [id,rec] of Array.from(fastPendingCommands.entries())){try{clearTimeout(rec.timer);}catch(_){}const e=new Error('Proses dibatalkan user.');e.code='USER_CANCELLED';try{rec.reject(e);}catch(_){}fastPendingCommands.delete(id);}}catch(_){}
    const snap=lastStatus&&lastStatus.snapshot||{};
    // Best-effort PC STOP only for processes that actually expose a native Stop action.
    try{
      if(tfRemoteBatchActiveV292(snap))await sendCommand('batch_toggle',{forceStop:true},{quiet:true,timeoutMs:5000,label:'Cancel Batch',cancelBypass:true});
      else if(tfRemoteUpdateActiveV292(snap))await sendCommand('update',{forceStop:true},{quiet:true,timeoutMs:5000,label:'Cancel Update',cancelBypass:true});
    }catch(_){}
    exportPriority=false;mirrorDeferRequested=true;pcMirrorPending=false;pcMirrorBusy=false;importTransferBusy=false;loginBusy=false;sending=false;rowSyncBusyCount=0;
    try{if(pcMirrorTimer){clearTimeout(pcMirrorTimer);pcMirrorTimer=null;}}catch(_){}
    setCommandOverlay(false);setSyncing(false);
    logEvent('Proses Mobile dibatalkan oleh user. State PC akan disinkronkan ulang.','info');refreshBusyControls();
    try{requestRealtimeSnapshot();}catch(_){}
  }
  async function forceCancelCurrentRemoteRev294(){if(!await window.tfRev294ConfirmCancel())return;await tfRev294ForceCancelRemoteCore();}
  window.addEventListener('tf-rev294-force-cancel',e=>{if(e&&e.detail&&e.detail.source==='remote')void tfRev294ForceCancelRemoteCore();});
  function setCommandOverlay(active,text,title){const ov=q('tf-remote-loading-overlay'),tx=q('tf-remote-loading-text'),tt=q('tf-remote-loading-title');if(tt)tt.textContent=title||'Memproses perintah…';if(tx&&text)tx.textContent=text;if(ov){ov.classList.toggle('show',!!active);ov.setAttribute('aria-hidden',active?'false':'true');}try{window.tfRev294SetLoading&&window.tfRev294SetLoading('remote',!!active);}catch(_){}}
  function buttonForAction(action){const map={update:'tf-remote-update',refresh:'tf-remote-refresh',batch_toggle:'tf-remote-submit',scan_from_isignal:'tf-remote-isignal',open_dashboard:'tf-remote-dashboard',add_analyst:'tf-remote-add-row'};return q(map[action]||'');}
  function setButtonLoading(action,on){
    const key=String(action||''),next=Math.max(0,(buttonLoadingCounts.get(key)||0)+(on?1:-1));
    if(next)buttonLoadingCounts.set(key,next);else buttonLoadingCounts.delete(key);
    const b=buttonForAction(action);if(b)b.classList.toggle('tf-remote-btn-loading',next>0);
  }
  // REV316: STOP is a real label + real spinner element, not only a CSS
  // pseudo-element. This survives repeated render()/text updates and remains
  // tappable while the background process is active.
  function tfSetStopButtonVisualV316(button,isStop,idleLabel){
    if(!button)return;
    if(isStop){
      button.classList.add('tf-remote-stop','tf-remote-stop-v316');
      let label=button.querySelector('.tf-remote-stop-label-v316');
      let spin=button.querySelector('.tf-remote-stop-spinner-v316');
      if(!label||!spin){
        button.textContent='';
        label=document.createElement('span');label.className='tf-remote-stop-label-v316';label.textContent='STOP!';
        spin=document.createElement('span');spin.className='tf-remote-stop-spinner-v316';spin.setAttribute('aria-hidden','true');
        button.append(label,spin);
      }else if(label.textContent!=='STOP!')label.textContent='STOP!';
      button.setAttribute('aria-busy','true');
    }else{
      button.classList.remove('tf-remote-stop','tf-remote-stop-v316');
      button.removeAttribute('aria-busy');
      if(button.querySelector('.tf-remote-stop-spinner-v316')||clean(button.textContent,40)!==idleLabel)button.textContent=idleLabel;
    }
  }
  function tfDecorateAllStopButtonsV316(){
    const root=q('tf-mobile-remote-page');if(!root)return;
    root.querySelectorAll('.tf-remote-actions button').forEach(btn=>{
      const raw=clean(btn.textContent,40).toUpperCase();
      if(/^STOP!?/.test(raw))tfSetStopButtonVisualV316(btn,true,'');
    });
  }
  function isOperationBusy(){return !!(sending||importTransferBusy||loginBusy||rowSyncBusyCount>0||pcMirrorBusy||pcMirrorPending);}
  function setGeneralDisabled(v){
    const root=q('tf-mobile-remote-page');if(!root)return;
    root.querySelectorAll('.tf-remote-actions button,#tf-remote-add-row,#tf-remote-time-select,#tf-remote-remember-links,.tf-remote-login-actions button,.tf-remote-login-input,#tf-remote-login-remember').forEach(el=>{if(el.id==='tf-remote-refresh'||el.id==='tf-remote-export-phone')return;el.disabled=!!v;});
  }
  function tfRemoteBatchActiveV292(s){
    s=s&&typeof s==='object'?s:{};
    const submitCtl=s.controls&&s.controls.submit||{};
    return !!(s.progress&&s.progress.active&&String(s.progress.source||'').toLowerCase()==='submit') || /stop|stopping/i.test(String(s.batchButton||submitCtl.text||''));
  }
  function tfRemoteUpdateActiveV292(s){
    s=s&&typeof s==='object'?s:{};
    const updateCtl=s.controls&&s.controls.update||{};
    return !!(s.progress&&s.progress.active&&String(s.progress.source||'').toLowerCase()==='update') || /stop|stopping/i.test(String(updateCtl.text||''));
  }
  async function tfWaitForMobileToggleStateV313(action,expectStop,timeoutMs=16000){
    const isUpdate=action==='update';
    const buttonId=isUpdate?'tf-remote-update':'tf-remote-submit';
    const idleText=isUpdate?'Update':'Submit';
    const started=Date.now();
    while(opened&&Date.now()-started<timeoutMs){
      const snap=lastStatus&&lastStatus.snapshot||{};
      const active=isUpdate?tfRemoteUpdateActiveV292(snap):tfRemoteBatchActiveV292(snap);
      try{render(lastStatus||{});}catch(_){}
      await nextPaint();
      const b=q(buttonId);
      const text=clean(b&&b.textContent||'',40);
      if(active===expectStop&&text===(expectStop?'STOP!':idleText))return true;
      if(realtimeOpen()){
        requestRealtimeSnapshot();
        await sleep(70);
      }else{
        try{await refreshStatus(false);}catch(_){}
        await sleep(180);
      }
    }
    return false;
  }
  async function tfRunToggleWithMobileUiAckV313(action){
    const isUpdate=action==='update';
    const snap=lastStatus&&lastStatus.snapshot||{};
    const beforeActive=isUpdate?tfRemoteUpdateActiveV292(snap):tfRemoteBatchActiveV292(snap);
    const expectStop=!beforeActive;
    const label=isUpdate?(beforeActive?'Stop Update':'Update'):(beforeActive?'Stop Submit':'Submit');
    setButtonLoading(action,true);
    setCommandOverlay(true,expectStop?'Menunggu tombol Stop benar-benar muncul di ponsel…':'Menunggu tombol kembali ke '+(isUpdate?'Update':'Submit')+' di ponsel…',label);
    setSyncing(true,'Menunggu state PC dan UI ponsel sama…');
    try{
      await sendCommand(action,{}, {timeoutMs:30000,label,quiet:true,keepOverlayUntilHydrated:true,forceOverlay:true});
      const ok=await tfWaitForMobileToggleStateV313(action,expectStop,18000);
      if(!ok)throw new Error('PC sudah memproses perintah, tetapi tombol di ponsel belum mencapai state final.');
      setSyncing(false);
      logEvent(label+' selesai dan state tombol ponsel sudah terverifikasi.','ok');
      return true;
    }catch(e){
      setSyncing(false);logEvent(label+' gagal: '+(e.message||e),'err');throw e;
    }finally{
      setCommandOverlay(false);
      setButtonLoading(action,false);
      refreshBusyControls();
    }
  }
  function refreshBusyControls(){
    const online=!!(lastStatus&&lastStatus.desktopOnline),s=lastStatus&&lastStatus.snapshot||{},busyNow=isOperationBusy();
    const batchActive=tfRemoteBatchActiveV292(s),updateActive=tfRemoteUpdateActiveV292(s),hasImport=!!s.hasImportData;
    const add=q('tf-remote-add-row');if(add)add.disabled=!online||busyNow||(q('tf-remote-analyst-editor')?.querySelectorAll('.tf-remote-editor-row').length||0)>=28;
    const submit=q('tf-remote-submit');
    if(submit){
      // REV292: STOP must always remain clickable. Normal SUBMIT is locked once a JSON/import bundle exists.
      submit.disabled=batchActive ? !online : (!online||busyNow||hasImport||!!(s.controls&&s.controls.submit&&s.controls.submit.disabled));
      submit.title=batchActive?'Hentikan batch scanning.':(hasImport?'Submit dikunci karena data JSON sudah tersedia. Gunakan Update untuk memperbarui data.':'Mulai batch scanning dari Link Analis di plugin PC.');
    }
    const imp=q('tf-remote-import'),impInput=q('tf-remote-import-input');const impDisabled=!online||sending||importTransferBusy||loginBusy||rowSyncBusyCount>0;
    if(imp){imp.classList.toggle('disabled',impDisabled);imp.setAttribute('aria-disabled',impDisabled?'true':'false');}if(impInput)impInput.disabled=impDisabled;
    const exp=q('tf-remote-export-phone');if(exp)exp.disabled=!online||importTransferBusy||sending||loginBusy||rowSyncBusyCount>0;
    const upd=q('tf-remote-update');
    if(upd){
      // REV292: an active STOP bypasses mirror/pending busy flags; otherwise Update needs imported JSON.
      upd.disabled=updateActive ? !online : (!online||busyNow||!hasImport||!!(s.controls&&s.controls.update&&s.controls.update.disabled));
      upd.title=updateActive?'Hentikan proses Update / batch scanning.':(!hasImport?'Import data terlebih dahulu.':'Perbarui data yang sudah di-import.');
    }
  }

  function fitIsignalFiveRows(list){
    if(!list)return;
    requestAnimationFrame(()=>{
      const rows=Array.from(list.querySelectorAll('.tf-remote-analyst'));
      if(rows.length<=5){list.style.maxHeight='none';return;}
      let h=0;for(let i=0;i<5;i++)h+=rows[i].getBoundingClientRect().height;
      const gap=parseFloat(getComputedStyle(list).rowGap||getComputedStyle(list).gap||'7')||7;
      list.style.maxHeight=Math.ceil(h+gap*4+2)+'px';
    });
  }
  function renderIsignal(items){
    const list=q('tf-remote-isignal-analysts');if(!list)return;
    const arr=Array.isArray(items)?items:[];const sig=analystSig(arr);if(sig===lastIsignalSignature)return;lastIsignalSignature=sig;
    list.innerHTML=arr.length?arr.map((x,i)=>`<div class="tf-remote-analyst"><span>${esc(x.no||i+1)}</span><div><strong>${esc(clean(x.name,80)||'Nama belum terbaca')}</strong><small>${esc(clean(x.url,400))}</small>${Array.isArray(x.pairs)&&x.pairs.length?`<em>${esc(x.pairs.map(p=>p===ALL?'ALL':p).join(', '))}</em>`:''}</div></div>`).join(''):'<div class="tf-remote-empty">Belum ada link analis hasil Scan From iSignal User.</div>';
    fitIsignalFiveRows(list);
  }

  function normalizeRange(value){
    const raw=String(value||'').toLowerCase();
    if(raw.includes('3 month'))return'm3';if(raw.includes('6 month'))return'm6';if(raw.includes('1 year'))return'y1';if(raw.includes('2 year'))return'y2';if(raw.includes('3 year'))return'y3';if(raw.includes('5 year'))return'y5';
    return RANGE_OPTIONS.some(x=>x[0]===raw)?raw:'all_time';
  }
  let tfRemoteLastProgressV309={active:false,percent:0,text:'',source:'',current:0,total:0};
  function renderProgress(p,s){
    p=p&&typeof p==='object'?p:{};
    const total=Math.max(0,Number(p.total)||0);
    const current=total>0?Math.max(0,Math.min(total,Number(p.current)||0)):0;
    let pct=Number(p.percent);if(!Number.isFinite(pct))pct=0;
    // REV309: authoritative queue fraction wins. If there are still queued
    // jobs, 100% is impossible by definition.
    if(total>0){
      pct=Math.round(current*100/total);
      if(current<total)pct=Math.min(99,pct);
    }
    pct=Math.max(0,Math.min(100,pct));
    const active=!!p.active;
    if(active&&total>0&&current<total&&pct>=100)pct=99;
    const progressText=clean(p.text,240)||(active?'Batch scanning sedang berjalan…':'Belum ada batch scanning berjalan.');
    if(q('tf-remote-progress-percent'))q('tf-remote-progress-percent').textContent=Math.round(pct)+'%';
    if(q('tf-remote-progress-fill'))q('tf-remote-progress-fill').style.width=pct+'%';
    if(q('tf-remote-progress-text'))q('tf-remote-progress-text').textContent=progressText;
    const statusText=clean([s.status,s.scanLog,s.isignalScanLog].filter(Boolean).join('\n'),5000)||'Belum ada status.';
    if(q('tf-remote-scan-status'))q('tf-remote-scan-status').textContent=statusText;
    tfRemoteLastProgressV309={active,percent:pct,text:progressText,source:clean(p.source,20),current,total};
    try{updateAndroidProgressNotification(active,pct,progressText,clean(p.source,20),current,total);}catch(_){}
  }
  function tfRemoteStopActiveFromNotificationV292(){
    const s=lastStatus&&lastStatus.snapshot||{};
    if(tfRemoteBatchActiveV292(s)){const b=q('tf-remote-submit');if(b&&!b.disabled){b.click();return;}}
    if(tfRemoteUpdateActiveV292(s)||!!(s.progress&&s.progress.active)){const b=q('tf-remote-update');if(b&&!b.disabled){b.click();return;}}
  }
  window.addEventListener('tf-android-remote-stop',()=>tfRemoteStopActiveFromNotificationV292());
  if(navigator.serviceWorker){navigator.serviceWorker.addEventListener('message',e=>{if(e&&e.data&&e.data.type==='TF_REMOTE_STOP')tfRemoteStopActiveFromNotificationV292();});}
  function tfEnsureRemoteNotificationPermissionV309(){
    if(typeof Notification==='undefined')return;
    if(Notification.permission!=='default')return;
    try{
      tfRemoteNotifPermissionAskedV309=true;
      const r=Notification.requestPermission();
      if(r&&typeof r.catch==='function')r.catch(()=>{});
    }catch(_){}
  }
  let tfRemoteNotifPermissionAskedV309=false;
  function tfRemoteProgressBarTextV309(pct){
    const p=Math.max(0,Math.min(100,Math.round(Number(pct)||0)));
    const filled=Math.max(0,Math.min(10,Math.round(p/10)));
    return '█'.repeat(filled)+'░'.repeat(10-filled)+' '+String(p)+'%';
  }
  function updateAndroidProgressNotification(active,pct,text,source,current,total){
    const title=(String(source||'').toLowerCase()==='update')?'TF Analyzer • Update':'TF Analyzer • Batch Scan';
    const queueText=(Number(total)>0)?(' • '+String(Math.max(0,Number(current)||0))+'/'+String(Math.max(0,Number(total)||0))+' job'):'';
    const nativeBridge=(window.AndroidRemote&&typeof window.AndroidRemote.showProgress==='function')
      ?window.AndroidRemote
      :((window.AndroidSave&&typeof window.AndroidSave.showProgress==='function')?window.AndroidSave:null);
    if(nativeBridge){
      try{nativeBridge.showProgress(title,(text||'Memproses data')+queueText,Math.round(pct),!!active,source||'scan');return;}catch(_){}
    }

    if(typeof Notification!=='undefined'&&active&&Notification.permission==='default'&&!tfRemoteNotifPermissionAskedV309){
      tfRemoteNotifPermissionAskedV309=true;
      try{Promise.resolve(Notification.requestPermission()).then(()=>{try{updateAndroidProgressNotification(active,pct,text,source,current,total);}catch(_){}}).catch(()=>{});}catch(_){}
    }

    if(navigator.serviceWorker&&typeof Notification!=='undefined'&&Notification.permission==='granted'){
      navigator.serviceWorker.ready.then(reg=>{
        if(!active){try{reg.getNotifications({tag:'tf-remote-progress'}).then(ns=>ns.forEach(n=>n.close()));}catch(_){}return;}
        const body=tfRemoteProgressBarTextV309(pct)+queueText+'\n'+(text||'Memproses data');
        return reg.showNotification(title,{body,tag:'tf-remote-progress',renotify:false,requireInteraction:true,silent:true,actions:[{action:'stop',title:'Stop'}],data:{source:source||'scan',percent:Math.round(pct),current:Number(current)||0,total:Number(total)||0}});
      }).catch(()=>{});
      return;
    }
    if(!active){try{if(window.__tfRemoteNotif)window.__tfRemoteNotif.close();}catch(_){}return;}
    if(typeof Notification==='function'&&Notification.permission==='granted'){
      try{
        if(window.__tfRemoteNotif)window.__tfRemoteNotif.close();
        window.__tfRemoteNotif=new Notification(title,{body:tfRemoteProgressBarTextV309(pct)+queueText+'\n'+(text||'Memproses data'),tag:'tf-remote-progress',renotify:false,silent:true});
      }catch(_){}
    }
  }
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&tfRemoteLastProgressV309&&tfRemoteLastProgressV309.active){
      const p=tfRemoteLastProgressV309;
      try{updateAndroidProgressNotification(true,p.percent,p.text,p.source,p.current,p.total);}catch(_){}
    }
  },{passive:true});

  async function decodeBase64Payload(b64,encoding){
    const bin=atob(String(b64||''));const bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    if(String(encoding||'')==='gzip'){
      if(typeof DecompressionStream!=='function')throw new Error('Mobile tidak mendukung decompression sync.');
      const ds=new DecompressionStream('gzip');return await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text();
    }
    return new TextDecoder().decode(bytes);
  }
  async function mobileDataFingerprint(){
    try{const d=await storageGet(['tfLastImportAt','tfLastImportMeta','tfHistorySignals','tfAnalystSources','tfRememberedAnalystLinks']);const h=Array.isArray(d.tfHistorySignals)?d.tfHistorySignals:[];const a=d.tfAnalystSources&&typeof d.tfAnalystSources==='object'?d.tfAnalystSources:{};const r=Array.isArray(d.tfRememberedAnalystLinks)?d.tfRememberedAnalystLinks:[];const m=d.tfLastImportMeta&&typeof d.tfLastImportMeta==='object'?d.tfLastImportMeta:{};return [String(d.tfLastImportAt||m.importedAt||m.exportedAt||''),h.length,Object.keys(a).length,r.length].join('|');}catch(_){return'';}
  }
  function schedulePcMirror(state){
    if(exportPriority)return;
    if(Date.now()<pcMirrorBackoffUntil)return;
    const snap=state&&state.snapshot||{};const fp=String(snap.dataFingerprint||'');
    if(!opened||!state||!state.desktopOnline||!snap.hasImportData||!fp){
      pcMirrorPending=false;refreshBusyControls();return;
    }
    if(fp===lastMirrorFingerprint&&!pcMirrorBusy){
      pcMirrorPending=false;refreshBusyControls();return;
    }
    pcMirrorPending=true;refreshBusyControls();
    const note=q('tf-remote-import-note');if(note)note.textContent='Data plugin PC berubah. Sync PC → Mobile belum selesai…';
    setSyncing(true,'Menunggu sinkronisasi data PC → Mobile…');
    if(!importTransferBusy&&!sending)setCommandOverlay(true,'Data plugin PC sedang ditransfer dan diterapkan ke ponsel. Jangan mulai Export sampai proses ini selesai.','Sinkronisasi Data PC → Ponsel');
    if(pcMirrorBusy||pcMirrorTimer||importTransferBusy||sending)return;
    pcMirrorTimer=setTimeout(()=>{pcMirrorTimer=null;void ensurePcDataMirrored(lastStatus,{showOverlay:true});},350);
  }
  async function getDriveRelayOnce(prep,opts={}){
    const id=String(prep&&prep.transferId||'');
    if(!id)throw new Error('Transfer ID Drive relay tidak tersedia.');
    const note=q('tf-remote-import-note');
    const title=opts.title||'Transfer Data PC → Ponsel';
    let lastErr=null;
    for(let attempt=1;attempt<=3;attempt++){
      try{
        if(note)note.textContent=`Drive relay: mengunduh 1 file dari PC${attempt>1?' • retry '+attempt+'/3':''}…`;
        setSyncing(true,attempt>1?`Drive relay retry ${attempt}/3`:'Drive relay • 1 file');
        if(opts.showOverlay!==false)setCommandOverlay(true,attempt>1?`Koneksi Drive sempat terputus. Retry download ${attempt}/3…`:'Mengunduh satu file bundle dari private Google Drive relay…',title);
        const relay=await api('/remote/drive-stage-get',{transferId:id},attempt===1?45000:60000);
        if(!relay||relay.complete!==true||typeof relay.data!=='string')throw new Error(relay&&relay.message||'Drive relay belum siap.');
        if(note)note.textContent='Drive relay: file diterima. Memverifikasi data…';
        setSyncing(true,'Drive relay • file diterima');
        return {data:relay.data,encoding:String(relay.encoding||prep.encoding||'plain')};
      }catch(e){
        lastErr=e;
        if(attempt<3)await sleep(500*attempt);
      }
    }
    const err=new Error('Drive relay gagal diunduh setelah retry: '+String(lastErr&&lastErr.message||lastErr||'Failed to Fetch'));
    err.code='DRIVE_RELAY_FETCH_FAILED';
    err.cause=lastErr;
    throw err;
  }
  async function clearDriveRelayQuiet(transferId){
    if(!transferId)return;
    try{await api('/remote/drive-stage-clear',{transferId},30000);}catch(_){}
  }

  async function fetchLegacyExportBundle(prep,opts={}){
    const title=opts.title||'Transfer Data PC → Ponsel';
    const note=q('tf-remote-import-note');
    const total=Math.max(0,Number(prep&&prep.totalChunks)||0);
    const transferId=String(prep&&prep.transferId||'');
    if(!transferId||!total)throw new Error('Fallback transfer PC tidak tersedia.');
    let b64='';
    for(let i=0;i<total;i++){
      const pct=Math.round(((i+1)/total)*100);
      if(note)note.textContent=`Fallback realtime ${i+1}/${total} (${pct}%)…`;
      setSyncing(true,`Fallback cepat ${pct}%`);
      if(opts.showOverlay!==false)setCommandOverlay(true,`Mengambil bundle langsung dari plugin PC ${i+1}/${total} (${pct}%)…`,title);
      const ch=await sendCommand('export_bundle_chunk',{transferId,index:i},{quiet:true,transfer:true,timeoutMs:30000});
      if(!ch||typeof ch.data!=='string')throw new Error('Bagian Export PC '+(i+1)+' tidak lengkap.');
      b64+=ch.data;
    }
    try{await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:15000});}catch(_){}
    return {data:b64,encoding:String(prep.encoding||'plain')};
  }

  async function prepareFastChunkFallback(opts={}){
    const prep=await sendCommand('export_bundle_prepare',{fullExport:true,forceLegacy:true,chunkSize:48000,priorityExport:opts.priorityExport===true,purpose:opts.purpose||'user-export'},{quiet:true,transfer:true,timeoutMs:30000});
    if(!prep||!prep.transferId||!Number(prep.totalChunks))throw new Error('Plugin PC tidak menyiapkan fallback Export cepat.');
    return prep;
  }

  async function ensurePcDataMirrored(state,opts={}){
    const force=opts.force===true,forceTransfer=opts.forceTransfer===true,throwOnError=opts.throwOnError===true,showOverlay=opts.showOverlay!==false;
    if(pcMirrorBusy){
      if((opts.wait===true||force)&&pcMirrorPromise)return await pcMirrorPromise;
      return false;
    }
    if(!opened||!state||!state.desktopOnline){if(throwOnError)throw new Error('PC / plugin belum Online untuk sinkronisasi data.');return false;}
    if(!force&&(sending||analystSyncBusy||Date.now()-lastUserActionAt<900)){schedulePcMirror(state);return false;}
    const snap=state.snapshot||{};let fp=String(snap.dataFingerprint||'');
    if(!forceTransfer){
      if(!snap.hasImportData||!fp){pcMirrorPending=false;refreshBusyControls();return true;}
      if(fp===lastMirrorFingerprint){pcMirrorPending=false;refreshBusyControls();return true;}
      const localFp=await mobileDataFingerprint();if(localFp===fp){lastMirrorFingerprint=fp;pcMirrorPending=false;refreshBusyControls();if(!importTransferBusy&&!sending){setCommandOverlay(false);setSyncing(false);}return true;}
    }
    pcMirrorBusy=true;pcMirrorPending=true;mirrorDeferRequested=false;const mirrorStartedAt=Date.now();
    const note=q('tf-remote-import-note');let transferId='';
    const run=(async()=>{
      try{
        if(note)note.textContent='Menyinkronkan file Import dari plugin Chrome ke ponsel…';
        setSyncing(true,'Sync data PC → Mobile…');
        if(showOverlay)setCommandOverlay(true,'Menyiapkan bundle data final dari plugin PC…',opts.title||'Sinkronisasi Data PC → Ponsel');
        const shouldDefer=()=>!force&&(mirrorDeferRequested||lastUserActionAt>mirrorStartedAt||sending||analystSyncBusy);
        const prep=await sendCommand('export_bundle_prepare',{fullExport:true,purpose:'mirror'}, {quiet:true,transfer:true,timeoutMs:90000});
        if(!prep||!prep.transferId)throw new Error('PC tidak menyiapkan data sinkronisasi.');
        transferId=prep.transferId;fp=String(prep.fingerprint||fp||'');
        let b64='',payloadEncoding=String(prep.encoding||'plain');
        if(String(prep.relayMode||'')==='drive-v1'){
          if(shouldDefer()){const e=new Error('Sinkronisasi ditunda karena ada aksi user.');e.code='MIRROR_DEFERRED';throw e;}
          try{
            const one=await getDriveRelayOnce(prep,{showOverlay,title:opts.title||'Sinkronisasi Data PC → Ponsel'});
            b64=one.data;payloadEncoding=one.encoding;
            await clearDriveRelayQuiet(transferId);
            try{await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:12000});}catch(_){}
            transferId='';
          }catch(driveErr){
            await clearDriveRelayQuiet(transferId);
            try{await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:9000});}catch(_){}
            transferId='';
            if(shouldDefer())throw driveErr;
            if(note)note.textContent='Drive relay terputus. Beralih ke fallback realtime cepat…';
            if(showOverlay)setCommandOverlay(true,'Drive relay tidak dapat di-fetch. Beralih ke transfer langsung plugin PC dengan bagian besar…',opts.title||'Sinkronisasi Data PC → Ponsel');
            const fb=await prepareFastChunkFallback({priorityExport:false});
            transferId=fb.transferId;
            const fast=await fetchLegacyExportBundle(fb,{showOverlay,title:opts.title||'Sinkronisasi Data PC → Ponsel'});
            b64=fast.data;payloadEncoding=fast.encoding;transferId='';
          }
        }else{
          if(!Number(prep.totalChunks))throw new Error('PC tidak menyiapkan data sinkronisasi.');
          for(let i=0;i<prep.totalChunks;i++){
            if(shouldDefer()){const e=new Error('Sinkronisasi ditunda karena ada aksi user.');e.code='MIRROR_DEFERRED';throw e;}
            const pct=Math.round(((i+1)/prep.totalChunks)*100);
            if(note)note.textContent=`Fallback sync ${i+1}/${prep.totalChunks} (${pct}%)`;
            setSyncing(true,`Fallback chunk ${pct}%`);
            if(showOverlay)setCommandOverlay(true,`Drive relay tidak tersedia. Fallback ${i+1}/${prep.totalChunks} (${pct}%)…`,opts.title||'Sinkronisasi Data PC → Ponsel');
            const ch=await sendCommand('export_bundle_chunk',{transferId,index:i},{quiet:true,transfer:true,timeoutMs:30000});
            if(!ch||typeof ch.data!=='string')throw new Error('Chunk fallback PC '+(i+1)+' tidak lengkap.');b64+=ch.data;
          }
          await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:20000});transferId='';
        }
        if(shouldDefer()){const e=new Error('Sinkronisasi ditunda karena ada aksi user.');e.code='MIRROR_DEFERRED';throw e;}
        if(showOverlay)setCommandOverlay(true,'File bundle sudah diterima. Menerapkan data ke penyimpanan ponsel…',opts.title||'Sinkronisasi Data PC → Ponsel');
        const payload=JSON.parse(await decodeBase64Payload(b64,payloadEncoding));
        if(typeof window.tfMobileApplyRemotePayload==='function')await window.tfMobileApplyRemotePayload(payload,['Remote-PC-Sync.json']);
        else{const st=payload.storage&&typeof payload.storage==='object'?payload.storage:payload;await new Promise(resolve=>chrome.storage.local.set(st,resolve));}
        await nextPaint();
        lastMirrorFingerprint=fp||String((lastStatus&&lastStatus.snapshot&&lastStatus.snapshot.dataFingerprint)||'');
        pcMirrorPending=false;
        logEvent('Data plugin Chrome selesai ditransfer dan sudah siap digunakan di ponsel.','ok');
        if(note)note.textContent='Data PC dan Mobile sudah sinkron. Export JSON sudah siap digunakan.';
        return true;
      }catch(e){
        if(transferId){await clearDriveRelayQuiet(transferId);try{await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:12000});}catch(_){}transferId='';}
        if(e&&e.code==='MIRROR_DEFERRED'){
          pcMirrorPending=true;if(note)note.textContent='Sync PC → Mobile menunggu Remote idle…';
        }else{
          lastMirrorFingerprint='';pcMirrorPending=false;pcMirrorBackoffUntil=Date.now()+30000;
          if(note)note.textContent='Sync PC → Mobile tertunda sementara. Export tetap dapat digunakan; sinkronisasi akan dicoba lagi setelah koneksi stabil.';
          logEvent('Sync PC → Mobile ditunda karena koneksi transfer: '+(e.message||e),'info');
        }
        if(throwOnError)throw e;
        return false;
      }finally{
        pcMirrorBusy=false;mirrorDeferRequested=false;refreshBusyControls();
        if(!pcMirrorPending&&!importTransferBusy&&!sending){setCommandOverlay(false);setSyncing(false);}
        if(opened&&pcMirrorPending&&!importTransferBusy&&!sending)schedulePcMirror(lastStatus);
      }
    })();
    pcMirrorPromise=run;
    try{return await run;}finally{if(pcMirrorPromise===run)pcMirrorPromise=null;}
  }
  async function waitForPcMirrorIdle(timeoutMs=120000){
    const started=Date.now();
    while(opened&&(pcMirrorPending||pcMirrorBusy||pcMirrorTimer)){
      if(Date.now()-started>timeoutMs)throw new Error('Sync data PC → Mobile belum selesai. Export belum aman dijalankan.');
      if(pcMirrorPending&&!pcMirrorBusy&&!pcMirrorTimer&&!importTransferBusy&&!sending)schedulePcMirror(lastStatus);
      if(pcMirrorPromise){try{await Promise.race([pcMirrorPromise,sleep(500)]);}catch(_){}}else await sleep(220);
    }
    return true;
  }

  function render(state){
    lastStatus=state||{};
    const s=state.snapshot||{};
    const online=executorOnlineFromState(state);
    // REV328: the phone-to-server WebSocket may remain open after the PC Remote
    // toggle is OFF. That transport must not be mistaken for a live PC/plugin.
    const explicitRemoteOff=!!(desktopExplicitOffAt&&Date.now()-desktopExplicitOffAt<30000);
    const transportOnline=!explicitRemoteOff&&(desktopTransportOnline||fastSocketOpen()||directSocketOpen()||Date.now()<transportRecoveryUntil);
    lastStatus.desktopOnline=online;
    const login=s.login&&typeof s.login==='object'?s.login:{};
    const pcView=String(s.view||'main').toLowerCase();
    // REV251: Remote login gate is evaluated only after Remote is explicitly opened
    // and the PC snapshot has been received. Do not show login merely because an
    // old logout flag exists; require the PC account identity to be absent too.
    const pcUserName=clean(s.userName,100),pcUserEmail=clean(s.userEmail,140);
    const hasPcIdentity=!!(pcUserName||pcUserEmail);
    const loginDecisionReady=!!(pcView==='login'||s.snapshotReady===true);
    const loggedOut=!!(online && loginDecisionReady && (pcView==='login' || ((login.loggedOut===true || login.loggedIn!==true) && !hasPcIdentity)));
    q('tf-remote-dot')?.classList.toggle('online',online);
    q('tf-remote-dot')?.classList.toggle('connecting',!online&&transportOnline);
    if(q('tf-remote-pc-status'))q('tf-remote-pc-status').textContent=online?(loggedOut?'PC + Plugin Online • Akun Logout':'PC + Plugin Online'):(transportOnline?'PC Online • Menunggu Plugin Sidebar':'PC + Plugin Offline');
    const tfTopRefreshV328=q('tf-remote-refresh-state');
    if(tfTopRefreshV328)tfTopRefreshV328.classList.toggle('tf-remote-offline',!online&&!transportOnline);
    if(q('tf-remote-version'))q('tf-remote-version').textContent=state.extensionVersion||'';
    if(q('tf-remote-status-note')){
      const transport=directSocketOpen()?((directRoute==='turn'?'TURN REALTIME':'DIRECT P2P')+(directRttMs?' • '+directRttMs+' ms':'')):(fastSocketOpen()?'WEBSOCKET REALTIME':'FALLBACK • HTTP recovery');
      q('tf-remote-status-note').textContent=online?(loggedOut?('['+transport+'] Plugin PC tersambung, tetapi akun Traders Family sedang logout. Silakan login dari ponsel.'):('['+transport+'] Sidebar plugin sudah terhubung dan siap menerima command.')):(explicitRemoteOff?'Remote pada plugin PC sedang OFF. Aktifkan toggle Remote di sidebar PC untuk menghubungkan kembali.':(transportOnline?'Transport realtime ke PC sudah tersambung, tetapi koneksi live sidebar plugin belum siap. Buka/biarkan sidebar TF aktif; status hijau baru muncul setelah executor benar-benar siap.':'PC/Mac harus menyala, Chrome aktif, extension aktif, dan sidebar TF terbuka untuk eksekusi UI.'));
    }
    setGeneralDisabled(!online||sending);
    if(q('tf-remote-user'))q('tf-remote-user').textContent=pcUserName||'TF User';
    if(q('tf-remote-email'))q('tf-remote-email').textContent=pcUserEmail;
    const tfRemoteAvatar=q('tf-remote-avatar-img');
    if(tfRemoteAvatar){
      const avatar=String(s.userAvatar||'').trim();
      if(avatar){tfRemoteAvatar.src=avatar;tfRemoteAvatar.style.display='block';tfRemoteAvatar.parentElement&&tfRemoteAvatar.parentElement.classList.add('has-photo');}
      else{tfRemoteAvatar.removeAttribute('src');tfRemoteAvatar.style.display='none';tfRemoteAvatar.parentElement&&tfRemoteAvatar.parentElement.classList.remove('has-photo');}
    }
    const page=q('tf-mobile-remote-page');if(page){page.classList.toggle('tf-remote-pc-isignal',pcView==='isignal');page.classList.toggle('tf-remote-pc-loggedout',loggedOut);page.dataset.tfPcView=pcView;}
    const loginNote=q('tf-remote-login-note');if(loginNote)loginNote.textContent=loggedOut?(clean(login.error,240)||'Akun plugin PC sedang logout. Silakan login dari ponsel.'):'Akun plugin PC sudah Online.';
    const loginButtons=[q('tf-remote-login-standard')].filter(Boolean);loginButtons.forEach(b=>b.disabled=!online||sending||!loggedOut);
    const ts=q('tf-remote-time-select');if(ts){const canonical=normalizeRange(s.timeRangeValue||s.selectedTimeRange||s.timeRange||'all_time');if(ts.value!==canonical)ts.value=canonical;}
    const submit=q('tf-remote-submit');
    const batchActive=tfRemoteBatchActiveV292(s);
    if(submit)tfSetStopButtonVisualV316(submit,batchActive,'Submit');
    const rem=q('tf-remote-remember-links');if(rem&&document.activeElement!==rem)rem.checked=!!s.rememberAllLinks;
    renderEditor(s.analysts,s.analystRowCount,String(s.analystRowCountMode||'')==='strict-rowid-rev272');renderIsignal(s.isignalAnalysts);renderProgress(s.progress,s);

    const update=q('tf-remote-update');const updateCtl=s.controls&&s.controls.update||{};
    const hasImport=!!s.hasImportData;const updateActive=tfRemoteUpdateActiveV292(s);
    if(update){tfSetStopButtonVisualV316(update,updateActive,'Update');update.title=updateActive?'Hentikan proses Update / batch scanning.':(!hasImport?'Import data terlebih dahulu.':'');}
    tfPaintImportAvailabilityV313(hasImport,(batchActive||updateActive)?'Batch scanning berjalan. Tekan Stop untuk menghentikan.':(hasImport?'Data import tersedia. SUBMIT dikunci; tombol Update siap digunakan.':'Belum ada data Import. SUBMIT dapat dipakai untuk batch scanning dari Link Analis.'));
    refreshBusyControls();

    const cs=q('tf-remote-command-status');
    if(cs){
      const st=clean(state.commandStatus,40),msg=state.result&&state.result.message?clean(state.result.message,300):'';
      cs.textContent=st?('Perintah terakhir: '+st+(msg?' — '+msg:'')):'';
      cs.className='tf-remote-command-status '+(st==='DONE'?'ok':st==='ERROR'?'err':'');
      const sig=[state.commandId||'',st,msg].join('|');
      if(sig&&sig!==lastCommandSignature&&st){lastCommandSignature=sig;if(!/^(import_bundle_(begin|chunk)|export_bundle_(prepare|chunk|finish))$/i.test(String(state.result&&state.result.action||'')))logEvent('Command '+st+(msg?' — '+msg:''),st==='ERROR'?'err':st==='DONE'?'ok':'info');}
    }
    const de=s.lastUiEvent&&typeof s.lastUiEvent==='object'?s.lastUiEvent:null;
    if(de&&de.seq){const ds=[de.seq,de.action,de.source].join('|');if(ds!==lastDesktopEventSignature){lastDesktopEventSignature=ds;if(de.source==='PC')logEvent('PC → Mobile: '+clean(de.label||de.action,120),'info');}}
    if(bootHydrating){if(online){bootHydrating=false;setCommandOverlay(false);setSyncing(false);}else{setCommandOverlay(false);setSyncing(true,transportOnline?'Transport tersambung • menunggu koneksi live sidebar…':'Menghubungkan realtime ke plugin PC…');}}
    if(!bootHydrating&&online&&s.hasImportData&&!pcMirrorBusy)schedulePcMirror(state);
  }

  async function refreshStatus(manual=false){
    if(!opened)return lastStatus;
    if(statusPromise)return await statusPromise;
    statusInFlight=true;
    statusPromise=(async()=>{
      if(manual||!lastSuccessAt)setSyncing(true,manual?'Menyinkronkan sekarang…':'Menghubungkan ke PC…');
      try{
        const r=await api('/remote/mobile-status',{});if(r&&r.retry)return lastStatus;
        failureCount=0;lastSuccessAt=Date.now();lastStatus=r||{};
        if(r&&r.desktopOnline===true){
          desktopTransportOnline=true;desktopRemoteReady=true;transportRecoveryUntil=0;
          const snap=r.snapshot&&typeof r.snapshot==='object'?r.snapshot:{};
          if(snap.executorReady===true||snap.sidebarOpen===true){desktopExecutorReady=true;desktopExecutorExplicitOffAt=0;}
        }else if(Date.now()>transportRecoveryUntil&&(!lastPluginOnlineAt||Date.now()-lastPluginOnlineAt>45000)){
          desktopTransportOnline=false;desktopRemoteReady=false;desktopExecutorReady=false;
        }
        lastStatus.desktopOnline=executorOnlineFromState(lastStatus);saveBootstrapCache(lastStatus);render(lastStatus);finishBootstrapUi();return lastStatus;
      }catch(e){
        failureCount++;const now=Date.now();const fresh=lastSuccessAt&&now-lastSuccessAt<45000;
        if(fresh&&lastStatus){const n=q('tf-remote-status-note');if(n)n.textContent='Koneksi sedang disambungkan ulang; state terakhir tetap ditampilkan.';setSyncing(true,'Menyambungkan ulang…');}
        else if(failureCount>=6){render({desktopOnline:false,snapshot:lastStatus&&lastStatus.snapshot||{},commandStatus:lastStatus&&lastStatus.commandStatus||'',extensionVersion:lastStatus&&lastStatus.extensionVersion||''});setSyncing(true,'Mencoba koneksi ulang…');}
        if(now-lastErrorLoggedAt>20000){lastErrorLoggedAt=now;logEvent('Sinkronisasi Remote tertunda: '+(e.message||e),'err');}return lastStatus;
      }
    })();
    try{return await statusPromise;}finally{statusInFlight=false;statusPromise=null;}
  }

  async function waitForCommand(commandId,timeoutMs=22000,cancelSerial=tfRev294CancelSerial){
    const started=Date.now();let polls=0;
    while(opened&&Date.now()-started<timeoutMs){
      if(cancelSerial!==tfRev294CancelSerial){const e=new Error('Proses dibatalkan user.');e.code='USER_CANCELLED';throw e;}
      // REV248: 180ms polling overwhelmed Apps Script while a command/import
      // was already running. Keep sub-second UX without request storms.
      const age=Date.now()-started;
      const delay=age<3500?520:(age<15000?720:950);
      await sleep(delay);polls++;
      const state=await refreshStatus(false);
      if(!state)continue;
      if(String(state.commandId||'')!==String(commandId||''))continue;
      const st=String(state.commandStatus||'').toUpperCase();
      if(st==='DONE'||st==='ERROR')return state;
    }
    return null;
  }


  function applyCompletedCommandResult(action,finalResult){
    if(action==='set_time_range'&&finalResult&&finalResult.value){const canonical=normalizeRange(finalResult.value);const ts=q('tf-remote-time-select');if(ts)ts.value=canonical;if(lastStatus&&lastStatus.snapshot){lastStatus.snapshot.timeRangeValue=canonical;lastStatus.snapshot.selectedTimeRange=canonical;}}
    if(action==='refresh'&&finalResult&&finalResult.view&&lastStatus&&lastStatus.snapshot){lastStatus.snapshot.view=String(finalResult.view);}
    if(action==='scan_from_isignal'&&finalResult&&lastStatus&&lastStatus.snapshot){lastStatus.snapshot.view='isignal';}
    if(action==='update'&&finalResult){
      const ub=q('tf-remote-update');
      if(ub&&finalResult.scanActive===true)tfSetStopButtonVisualV316(ub,true,'Update');
      if(finalResult.progress&&lastStatus&&lastStatus.snapshot){
        lastStatus.snapshot.progress=Object.assign({},lastStatus.snapshot.progress||{},finalResult.progress,{active:finalResult.scanActive===true});
        try{renderProgress(lastStatus.snapshot.progress,lastStatus.snapshot);}catch(_){}
      }
    }
  }

  async function sendCommand(action,payload={},opts={}){
    const commandCancelSerial=tfRev294CancelSerial;
    const isUser=!opts.transfer&&!opts.background;
    if(isUser)markUserAction();
    const stale=!lastSuccessAt||Date.now()-lastSuccessAt>6500;
    // REV266: a healthy WebSocket is itself the low-latency preflight. Do not
    // block the first tap after an idle period on an HTTP status round-trip.
    if(stale&&!realtimeOpen())await refreshStatus(true);
    if((!lastStatus||!lastStatus.desktopOnline)&&!realtimeOpen()){if(!opts.quiet)logEvent('Perintah dibatalkan: PC/sidebar belum online.','err');if(isUser)sending=false;return null;}
    const commandLabel=clean(opts.label||actionLabel(action),120);const quickAction=!opts.keepOverlayUntilHydrated&&!opts.forceOverlay&&!opts.transfer&&!['scan_from_isignal'].includes(String(action||''));setButtonLoading(action,true);if(!opts.quiet){setSyncing(true,'Mengirim perintah ke PC…');if(isUser&&!quickAction)setCommandOverlay(true,'Menunggu plugin Chrome menyelesaikan '+commandLabel+'…',commandLabel);}
    const status=q('tf-remote-command-status');if(status&&!opts.quiet){status.textContent='Mengirim perintah…';status.className='tf-remote-command-status';}
    try{
      const clientCommandId='mob-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
      const commandPayload=Object.assign({},payload||{},{clientCommandId});
      // REV268 transport priority for EVERY Remote command, including transfer
      // chunks: DIRECT WebRTC -> WebSocket -> HTTP recovery. The same
      // clientCommandId is reused across fallbacks to guarantee at-most-once UI clicks.
      if(directSocketOpen()){
        try{
          if(!opts.quiet)setSyncing(true,'DIRECT P2P: dieksekusi langsung di plugin PC…');
          const directResult=await sendDirectCommand(action,commandPayload,clientCommandId,opts.timeoutMs||6500);
          if(!directResult||directResult.ok===false){const er=new Error(directResult&&directResult.message||'Perintah DIRECT gagal di plugin PC.');er.code=String(directResult&&directResult.code||'REMOTE_DIRECT_PC_ERROR');er.result=directResult;throw er;}
          try{directResult.__transport='direct';}catch(_){}applyCompletedCommandResult(action,directResult);
          if(!opts.quiet){if(status){status.textContent='Dieksekusi via DIRECT P2P.';status.className='tf-remote-command-status ok';}logEvent('Perintah '+action+' selesai via DIRECT P2P.','ok');}
          directSend({type:'snapshot_request',at:Date.now()});return directResult;
        }catch(directError){
          const transportCodes=new Set(['REMOTE_DIRECT_OFFLINE','REMOTE_DIRECT_TIMEOUT','REMOTE_DIRECT_CLOSED']);
          if(directError&&directError.code&&!transportCodes.has(String(directError.code)))throw directError;
          if(!opts.quiet)setSyncing(true,'DIRECT reconnecting; memakai WebSocket real-time…');
        }
      }
      if(fastSocketOpen()){
        try{
          if(!opts.quiet)setSyncing(true,'WebSocket real-time: mengeksekusi di plugin PC…');
          const fastResult=await sendFastCommand(action,commandPayload,clientCommandId,opts.timeoutMs||6500);
          if(!fastResult||fastResult.ok===false){const er=new Error(fastResult&&fastResult.message||'Perintah Fast Lane gagal di plugin PC.');er.code=String(fastResult&&fastResult.code||'REMOTE_FAST_PC_ERROR');er.result=fastResult;throw er;}
          try{fastResult.__transport='fast';}catch(_){}applyCompletedCommandResult(action,fastResult);
          if(!opts.quiet){if(status){status.textContent='Dieksekusi via WebSocket.';status.className='tf-remote-command-status ok';}logEvent('Perintah '+action+' selesai via WebSocket.','ok');}
          try{fastWs.send(JSON.stringify({type:'snapshot_request',at:Date.now()}));}catch(_){}return fastResult;
        }catch(fastError){
          const transportCodes=new Set(['REMOTE_FAST_OFFLINE','REMOTE_FAST_CLOSED','REMOTE_FAST_TIMEOUT','REMOTE_FAST_NO_DESKTOP']);
          if(fastError&&fastError.code&&!transportCodes.has(String(fastError.code)))throw fastError;
          if(!opts.quiet)setSyncing(true,'WebSocket reconnecting; memakai HTTP recovery…');
        }
      }
      let r=null;const maxPost=opts.transfer?18:(opts.background?2:10);
      for(let attempt=1;attempt<=maxPost;attempt++){
        r=await api('/remote/mobile-command',{command:{action,payload:commandPayload}});
        if(r.accepted!==false)break;
        if(attempt<maxPost&&String(r.code||'').toUpperCase()==='REMOTE_BUSY'){
          if(opts.transfer)setSyncing(true,`Menunggu queue transfer PC kosong… ${attempt}/${maxPost}`);
          await sleep(opts.transfer?700:160+attempt*70);
          if(opts.transfer&&attempt%4===0){try{await refreshStatus(false);}catch(_){}}
          continue;
        }
        throw new Error(r.message||'Perintah sebelumnya masih diproses.');
      }
      if(!r||r.accepted===false)throw new Error(r&&r.message||'Perintah belum dapat dikirim.');
      const commandId=String(r.commandId||'');if(!opts.quiet)logEvent('Kirim: '+commandLabel,'info');
      const done=await waitForCommand(commandId,opts.timeoutMs||6500,commandCancelSerial);
      if(!done||String(done.commandId||'')!==commandId){const er=new Error(opts.transfer?'ACK transfer PC belum diterima.':'PC belum mengonfirmasi perintah; status akan disinkronkan otomatis.');er.code='REMOTE_ACK_TIMEOUT';throw er;}
      const st=String(done.commandStatus||'').toUpperCase();
      if(st==='ERROR'){const msg=done&&done.result&&done.result.message?done.result.message:'Perintah gagal di sidebar PC.';const er=new Error(msg);er.code=String(done&&done.result&&done.result.code||'REMOTE_PC_ERROR');er.result=done&&done.result||null;throw er;}
      if(st!=='DONE'){const er=new Error('Perintah masih belum selesai di PC.');er.code='REMOTE_NOT_DONE';throw er;}
      const finalResult=done&&done.result||{ok:true};
      try{finalResult.__transport='http';}catch(_){}
      applyCompletedCommandResult(action,finalResult);
      if(!opts.quiet){if(status){status.textContent='Perintah selesai.';status.className='tf-remote-command-status ok';}logEvent('Perintah '+action+' selesai.','ok');}
      return finalResult;
    }catch(e){if(status&&!opts.quiet){status.textContent=e.message||String(e);status.className='tf-remote-command-status err';}if(!opts.quiet&&e.code!=='REMOTE_ACK_TIMEOUT')logEvent('Gagal '+action+': '+(e.message||e),'err');throw e;
    }finally{if(isUser&&!opts.keepOverlayUntilHydrated)setCommandOverlay(false);setButtonLoading(action,false);setGeneralDisabled(!(lastStatus&&lastStatus.desktopOnline));refreshBusyControls();if(lastSuccessAt&&Date.now()-lastSuccessAt<6000&&!opts.quiet&&!opts.keepOverlayUntilHydrated)setSyncing(false);render(lastStatus||{});}
  }

  function setLoginProgress(active,text){
    loginBusy=!!active;
    const box=q('tf-remote-login-progress');
    if(box){box.classList.toggle('show',!!active);box.setAttribute('aria-hidden',active?'false':'true');const t=box.querySelector('span:last-child');if(t&&text)t.textContent=text;}
    [q('tf-remote-login-standard'),q('tf-remote-login-identity'),q('tf-remote-login-password'),q('tf-remote-login-remember')].filter(Boolean).forEach(el=>{el.disabled=!!active;});
  }

  async function remoteLoginFromMobile(mode='standard'){
    const identity=String(q('tf-remote-login-identity')?.value||'').trim();
    const password=String(q('tf-remote-login-password')?.value||'');
    const remember=!!q('tf-remote-login-remember')?.checked;
    mode='standard';
    const label='Login';
    const note=q('tf-remote-login-note');
    if(!identity||!password){if(note)note.textContent='Email/Username dan Password wajib diisi.';return null;}
    setLoginProgress(true,'Mengirim data login ke plugin PC…');
    setCommandOverlay(true,'Mengirim kredensial melalui Remote terautentikasi dan menunggu status akun PC menjadi Online…',label);
    setSyncing(true,label+' berjalan di PC…');
    try{
      const result=await sendCommand('set_analysts',{mode:'remote_login',loginMode:mode,identity,password,remember},{timeoutMs:125000,keepOverlayUntilHydrated:true,label});
      // Remove password from Mobile DOM immediately after the command returns.
      const pass=q('tf-remote-login-password');if(pass)pass.value='';
      const started=Date.now();let onlineConfirmed=false;
      while(opened&&Date.now()-started<12000){
        const st=realtimeOpen()?await realtimeStateTick(40):await refreshStatus(true);const s=st&&st.snapshot||{};const lg=s.login&&typeof s.login==='object'?s.login:{};const view=String(s.view||'').toLowerCase();
        if(lg.loggedIn===true||(['masuk','main','isignal'].includes(view)&&lg.loggedOut!==true)){onlineConfirmed=true;break;}
        setLoginProgress(true,'Menunggu plugin PC benar-benar login…');
        await sleep(realtimeOpen()?40:350);
      }
      if(!onlineConfirmed)throw new Error('Plugin sudah menerima proses login, tetapi status akun PC belum berubah menjadi Online.');
      setLoginProgress(false);setCommandOverlay(false);setSyncing(false);logEvent(label+' berhasil. Akun PC Online.','ok');
      return result;
    }catch(e){
      const pass=q('tf-remote-login-password');if(pass)pass.value='';
      setLoginProgress(false);setCommandOverlay(false);setSyncing(false);if(note)note.textContent=e&&e.message?e.message:String(e);throw e;
    }
  }

  async function scanFromIsignalMobile(){
    const title='Scan From iSignal User';
    setCommandOverlay(true,'Menunggu plugin PC menyelesaikan scan…',title);
    setSyncing(true,'Scan From iSignal berjalan di PC…');
    setButtonLoading('scan_from_isignal',true);
    try{
      const result=await sendCommand('scan_from_isignal',{}, {timeoutMs:125000,keepOverlayUntilHydrated:true});
      let analysts=result&&Array.isArray(result.analysts)?result.analysts.filter(x=>x&&clean(x.url,500)):[];
      let expected=Math.max(Number(result&&result.analystCount)||0,analysts.length); // REV269 dispatch ACK may be immediate; live snapshots become authoritative.

      // REV252: A PC DONE without hydrated analyst rows is NOT a Mobile DONE.
      // Keep the overlay and actively fetch fresh snapshots until the links
      // arrive from PC, then render them and verify the DOM before closing.
      setCommandOverlay(true,analysts.length?'Scan PC selesai. Memverifikasi '+analysts.length+' link analis di ponsel…':'Scan PC selesai. Menunggu link analis ditransfer dari plugin PC…',title);
      setSyncing(true,'Menunggu hasil analis dari PC…');
      const hydrateStarted=Date.now();let stableSig='';let stableHits=0;
      while(opened&&Date.now()-hydrateStarted<25000){
        if(!analysts.length || (expected&&analysts.length<expected)){
          const st=realtimeOpen()?await realtimeStateTick(40):await refreshStatus(true);
          const snap=st&&st.snapshot||{};
          const fresh=Array.isArray(snap.isignalAnalysts)?snap.isignalAnalysts.filter(x=>x&&clean(x.url,500)):[];
          if(fresh.length>=analysts.length)analysts=fresh;
          expected=Math.max(expected,fresh.length);
        }
        if(analysts.length){
          if(lastStatus){lastStatus.snapshot=lastStatus.snapshot&&typeof lastStatus.snapshot==='object'?lastStatus.snapshot:{};lastStatus.snapshot.view='isignal';lastStatus.snapshot.isignalAnalysts=analysts;}
          render(lastStatus||{}); renderIsignal(analysts);
          const sig=analystSig(analysts);
          const list=q('tf-remote-isignal-analysts');
          const count=list?list.querySelectorAll('.tf-remote-analyst').length:0;
          if(count>=analysts.length && lastIsignalSignature===sig){
            if(sig===stableSig)stableHits++;else{stableSig=sig;stableHits=0;}
            if(stableHits>=2)break;
          }else stableHits=0;
        }
        await sleep(realtimeOpen()?40:320);
      }

      const list=q('tf-remote-isignal-analysts');
      const renderedCount=list?list.querySelectorAll('.tf-remote-analyst').length:0;
      const finalSig=analystSig(analysts);
      const explicitEmpty=/(?:0\s+analis|tidak\s+ada\s+(?:analis|link)|no\s+(?:analyst|results?))/i.test(String(result&&result.message||''));
      if(!analysts.length&&!explicitEmpty)throw new Error('Scan PC selesai, tetapi link analis belum berhasil ditransfer ke ponsel. Loading dipertahankan sampai hasil benar-benar tersedia.');
      if(analysts.length && (renderedCount<analysts.length||lastIsignalSignature!==finalSig))throw new Error('Link analis sudah diterima, tetapi belum selesai dirender di ponsel.');

      setCommandOverlay(false);setSyncing(false);setButtonLoading('scan_from_isignal',false);
      logEvent('Scan From iSignal selesai dan '+analysts.length+' link analis sudah benar-benar tampil di ponsel.','ok');
      return Object.assign({},result,{analysts,analystCount:analysts.length,mobileHydrated:true});
    }catch(e){
      setCommandOverlay(false);setSyncing(false);setButtonLoading('scan_from_isignal',false);
      throw e;
    }
  }

  function openMobileDashboardHome(){
    markUserAction();
    // “Buka Dashboard” is a Mobile navigation action only. It must not send an
    // open_dashboard command to the PC sidebar.
    try{closeRemote(true);}catch(_){}
    try{
      if(typeof window.tfMobileGoHome==='function'){window.tfMobileGoHome();return;}
      const home=document.querySelector('[data-mobile-nav="table1"]');
      if(home){home.click();return;}
    }catch(_){}
    try{window.scrollTo({top:0,behavior:'auto'});}catch(_){}
  }

  async function gzipBase64(text){
    const bytes=new TextEncoder().encode(text);let data=bytes,encoding='plain';
    if(typeof CompressionStream==='function'){
      try{const cs=new CompressionStream('gzip');const ab=await new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer();data=new Uint8Array(ab);encoding='gzip';}catch(_){}
    }
    let bin='';const step=0x6000;for(let i=0;i<data.length;i+=step)bin+=String.fromCharCode(...data.subarray(i,i+step));
    return {encoding,data:btoa(bin),bytes:data.length};
  }

  async function sendTransferCommandWithRetry(action,payload,timeoutMs,attempts=4){
    let lastErr=null;
    for(let attempt=1;attempt<=attempts;attempt++){
      try{
        const result=await sendCommand(action,payload,{quiet:true,transfer:true,timeoutMs});
        if(result&&result.ok===false){const er=new Error(result.message||'Transfer ditolak PC.');er.result=result;throw er;}
        return result;
      }catch(e){
        lastErr=e;
        if(attempt<attempts){setSyncing(true,`Koneksi chunk belum ter-ACK. Retry ${attempt+1}/${attempts}…`);await sleep(650*attempt);try{await refreshStatus(true);}catch(_){};}
      }
    }
    throw lastErr||new Error('Transfer ke PC gagal setelah retry.');
  }

  async function finishImportAndSyncMobile(file){
    const note=q('tf-remote-import-note');
    if(note)note.textContent='Import sudah diterapkan di PC. Menyiapkan sinkronisasi final PC → Ponsel…';
    setCommandOverlay(true,'Import PC selesai. Sekarang mengambil bundle final dari plugin PC agar data ponsel benar-benar sama…','Import JSON ke PC');
    setSyncing(true,'Tahap akhir: sync PC → Mobile…');
    if(typeof window.tfMobileImportFiles==='function')await window.tfMobileImportFiles([file],{reload:false,stayRemote:true});
    else{
      const text=await file.text();const payload=JSON.parse(text);
      if(typeof window.tfMobileApplyRemotePayload==='function')await window.tfMobileApplyRemotePayload(payload,[file.name||'Remote-Import.json']);
      else{const st=payload.storage&&typeof payload.storage==='object'?payload.storage:payload;await new Promise(resolve=>chrome.storage.local.set(st,resolve));}
    }
    lastMirrorFingerprint='';lastEditorSignature='';pcMirrorPending=true;
    if(pcMirrorTimer){clearTimeout(pcMirrorTimer);pcMirrorTimer=null;}
    try{if(directSocketOpen())directSend({type:'snapshot_request',at:Date.now()});else if(fastSocketOpen())fastWs.send(JSON.stringify({type:'snapshot_request',at:Date.now()}));}catch(_){}
    const ok=await ensurePcDataMirrored(lastStatus||{desktopOnline:true,snapshot:{}},{force:true,forceTransfer:true,wait:true,throwOnError:true,showOverlay:true,title:'Import JSON ke PC'});
    if(!ok)throw new Error('Import sudah selesai di PC, tetapi sinkronisasi final ke ponsel belum selesai.');
    tfPaintImportAvailabilityV313(true,'Import selesai: PC dan ponsel sudah sinkron penuh.');
    await nextPaint();
    logEvent('Import selesai end-to-end: data sudah diterapkan di PC dan selesai disinkronkan ke ponsel.','ok');
  }

  async function importFromPhone(file){
    const note=q('tf-remote-import-note');
    const importBtn=q('tf-remote-import');
    if(importBtn)importBtn.classList.add('tf-remote-btn-loading');
    try{
      importTransferBusy=true;refreshBusyControls();
      setCommandOverlay(true,'Memeriksa koneksi Remote sebelum Import…','Import JSON ke PC');
      if((!lastStatus||!lastStatus.desktopOnline)&&!realtimeOpen())await refreshStatus(true);
      if(!lastStatus||!lastStatus.desktopOnline)throw new Error('PC / sidebar harus Online untuk menerima file dari ponsel.');
      const text=await file.text();JSON.parse(text);
      setSyncing(true,'Mengompres file Import…');if(note)note.textContent='Mengompres file sebelum dikirim ke PC…';
      const packed=await gzipBase64(text);
      if(packed.data.length>4500000)throw new Error('File Import terlalu besar untuk Fast Import Remote (maks. sekitar 4.5 MB setelah kompresi).');
      const transferId='MOB-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,8).toUpperCase();
      sending=true;refreshBusyControls();
      if(realtimeOpen()){
        setCommandOverlay(true,directSocketOpen()?'Mengirim file langsung P2P ke plugin PC…':'Mengirim file melalui WebSocket real-time…','Import JSON ke PC');
        setSyncing(true,directSocketOpen()?'DIRECT Import Mobile → PC':'WebSocket Import Mobile → PC');
        const PART=12000,parts=[];for(let pos=0;pos<packed.data.length;pos+=PART)parts.push(packed.data.slice(pos,pos+PART));
        await sendCommand('import_bundle_begin',{transferId,totalChunks:parts.length,encoding:packed.encoding,fileName:file.name||'mobile-import.json',originalChars:text.length},{quiet:true,transfer:true,timeoutMs:30000});
        for(let i=0;i<parts.length;i++){await sendTransferCommandWithRetry('import_bundle_chunk',{transferId,index:i,data:parts[i]},25000,3);const pct=Math.round(((i+1)/parts.length)*100);setSyncing(true,(directSocketOpen()?'DIRECT':'WebSocket')+` Import ${i+1}/${parts.length} (${pct}%)`);}
        const finalResult=await sendCommand('import_bundle_commit',{transferId},{quiet:true,transfer:true,timeoutMs:110000});
        if(!finalResult||finalResult.ok===false)throw new Error(finalResult&&finalResult.message||'Plugin PC belum menyelesaikan Import.');
        logEvent('Import real-time selesai diterapkan di plugin Chrome. Menunggu sinkronisasi final ke ponsel…','info');
        await finishImportAndSyncMobile(file);
        setCommandOverlay(false);setSyncing(false);return;
      }
      setCommandOverlay(true,'Mengunggah file ke relay cadangan…','Import JSON ke PC');setSyncing(true,'HTTP Recovery Upload Mobile → Relay…');
      if(note)note.textContent='HTTP recovery: mengunggah file ke relay…';
      // REV248 Fast Staging V4: upload small parts in parallel. This keeps
      // each Apps Script request small and bypasses the Remote command queue.
      const STAGE_PART_CHARS=65000;
      const parts=[];for(let pos=0;pos<packed.data.length;pos+=STAGE_PART_CHARS)parts.push(packed.data.slice(pos,pos+STAGE_PART_CHARS));
      const totalParts=Math.max(1,parts.length);let uploaded=0;
      const uploadPart=async(index)=>{
        let lastErr=null;
        for(let attempt=1;attempt<=3;attempt++){
          try{
            const r=await api('/remote/import-stage-put',{transferId,fileName:file.name||'mobile-import.json',encoding:packed.encoding,originalChars:text.length,partIndex:index,totalParts,data:parts[index]},60000);
            if(!r||r.stored!==true)throw new Error(r&&r.message||'Fast Import part gagal disimpan.');
            uploaded++;const pct=Math.round((uploaded/totalParts)*100);
            setSyncing(true,`HTTP Recovery Mobile → Relay ${uploaded}/${totalParts} (${pct}%)`);
            if(note)note.textContent=`HTTP recovery: upload ${uploaded}/${totalParts} part…`;
            return r;
          }catch(e){lastErr=e;if(attempt<3)await sleep(350*attempt);}
        }
        throw lastErr||new Error('Fast Import part gagal setelah retry.');
      };
      try{
        // Max 3 concurrent Apps Script requests: fast enough without causing a
        // new execution burst that can throttle the Apps Script deployment.
        for(let i=0;i<totalParts;i+=3){await Promise.all(parts.slice(i,i+3).map((_,off)=>uploadPart(i+off)));}
      }catch(e){
        if(/NOT_FOUND|Endpoint tidak ditemukan/i.test(String(e&&e.message||'')))throw new Error('Backend REV248 Fast Import belum di-deploy. Deploy Apps Script + Worker REV248 terlebih dahulu.');
        throw e;
      }
      setCommandOverlay(true,'File sudah di relay. Menunggu plugin PC mengambil dan menerapkan data…','Import JSON ke PC');setSyncing(true,'PC mengambil file dan melakukan Import…');
      if(note)note.textContent='File terkirim. Plugin PC sedang menerapkan Import…';
      const finalResult=await sendCommand('import_bundle_commit',{stagedV3:true,transferId},{quiet:true,transfer:true,timeoutMs:110000});
      if(!finalResult||finalResult.ok===false)throw new Error(finalResult&&finalResult.message||'Plugin PC belum menyelesaikan Import.');
      logEvent('Fast Import selesai diterapkan di plugin Chrome. Menunggu sinkronisasi final ke ponsel…','info');
      await finishImportAndSyncMobile(file);
      setCommandOverlay(false);setSyncing(false);
    }catch(e){setCommandOverlay(false);setSyncing(false);if(note)note.textContent='Import gagal: '+(e.message||e);logEvent('Import dari ponsel gagal: '+(e.message||e),'err');}
    finally{sending=false;importTransferBusy=false;if(importBtn)importBtn.classList.remove('tf-remote-btn-loading');refreshBusyControls();}
  }

  async function downloadBlob(blob,name){
    // Native APK: AndroidSave uses ACTION_CREATE_DOCUMENT, so Android shows its
    // real Save As / folder chooser. Do not report success until MainActivity
    // confirms the OutputStream has been written and closed.
    if(window.AndroidSave&&typeof window.AndroidSave.saveBase64==='function'){
      const dataUrl=await new Promise((resolve,reject)=>{const r=new FileReader();r.onerror=()=>reject(new Error('File Export gagal disiapkan untuk Android.'));r.onloadend=()=>resolve(String(r.result||''));r.readAsDataURL(blob);});
      const b64=dataUrl.includes(',')?dataUrl.slice(dataUrl.indexOf(',')+1):dataUrl;
      const saved=new Promise((resolve,reject)=>{
        let done=false;
        const finish=ok=>{if(done)return;done=true;clearTimeout(timer);window.removeEventListener('tf-native-save-complete',onSaved);ok?resolve(true):reject(new Error('Penyimpanan file dibatalkan atau belum dikonfirmasi Android.'));};
        const onSaved=()=>finish(true);
        window.addEventListener('tf-native-save-complete',onSaved,{once:true});
        const timer=setTimeout(()=>finish(false),180000);
      });
      window.AndroidSave.saveBase64(name,blob.type||'application/json',b64);
      await saved;
      return {ok:true,method:'android-save-as',name};
    }
    // PWA/Chrome: File System Access API opens a real Save As picker. startIn
    // requests Downloads as the initial directory when the platform supports it.
    if(typeof window.showSaveFilePicker==='function'){
      try{
        const handle=await window.showSaveFilePicker({suggestedName:name,startIn:'downloads',types:[{description:'JSON File',accept:{'application/json':['.json']}}]});
        const writable=await handle.createWritable();
        await writable.write(blob);await writable.close();
        return {ok:true,method:'file-system-access',name};
      }catch(e){
        if(e&&e.name==='AbortError')throw new Error('Penyimpanan dibatalkan oleh pengguna.');
        throw e;
      }
    }
    const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.style.display='none';document.body.appendChild(a);a.click();a.remove();
    await nextPaint();await sleep(150);setTimeout(()=>URL.revokeObjectURL(u),30000);
    return {ok:true,method:'browser-download',name};
  }
  async function exportJsonToPhone(){
    const note=q('tf-remote-import-note');
    const exportBtn=q('tf-remote-export-phone');
    if(exportBtn)exportBtn.classList.add('tf-remote-btn-loading');
    let transferId='';
    exportPriority=true;mirrorDeferRequested=true;pcMirrorBackoffUntil=Date.now()+30000;
    if(pcMirrorTimer){clearTimeout(pcMirrorTimer);pcMirrorTimer=null;}
    try{
      // Export is independent from the Mobile mirror. Never let a failed/retrying
      // background sync block the user's explicit request to save the PC JSON.
      if(pcMirrorBusy&&pcMirrorPromise){
        setCommandOverlay(true,'Menghentikan sinkronisasi background agar Export mendapat prioritas…','Export JSON ke Ponsel');
        await Promise.race([pcMirrorPromise.catch(()=>false),sleep(5000)]);
      }
      if(importTransferBusy||sending){
        setCommandOverlay(true,'Menunggu proses Remote sebelumnya benar-benar selesai sebelum menyiapkan Export…','Export JSON ke Ponsel');
        const started=Date.now();while(opened&&(importTransferBusy||sending)){if(Date.now()-started>120000)throw new Error('Proses Remote sebelumnya belum selesai.');await sleep(250);}
      }
      importTransferBusy=true;refreshBusyControls();
      setCommandOverlay(true,'Meminta bundle Export lengkap dari plugin PC…','Export JSON ke Ponsel');
      setSyncing(true,'Menyiapkan seluruh data plugin PC…');
      if(note)note.textContent='Export: plugin PC sedang menyiapkan file lengkap…';
      if((!lastStatus||!lastStatus.desktopOnline)&&!realtimeOpen())await refreshStatus(true);
      if(!lastStatus||!lastStatus.desktopOnline)throw new Error('PC / sidebar harus Online untuk Export JSON.');
      let prep=await sendCommand('export_bundle_prepare',{fullExport:true,priorityExport:true,purpose:'user-export'},{quiet:true,transfer:true,timeoutMs:45000});
      if(!prep||!prep.transferId)throw new Error('Plugin PC tidak menyiapkan bundle Export lengkap.');
      transferId=prep.transferId;let b64='',payloadEncoding=String(prep.encoding||'plain');
      if(String(prep.relayMode||'')==='drive-v1'){
        setCommandOverlay(true,'Plugin PC sudah upload 1 file ke private Drive relay. Mengunduh file…','Export JSON ke Ponsel');
        if(note)note.textContent='Export: Drive relay 1 file • mengunduh…';
        try{
          const one=await getDriveRelayOnce(prep,{showOverlay:true,title:'Export JSON ke Ponsel'});
          b64=one.data;payloadEncoding=one.encoding;
          await clearDriveRelayQuiet(transferId);
          try{await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:12000});}catch(_){}
          transferId='';
        }catch(driveErr){
          await clearDriveRelayQuiet(transferId);
          try{await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:9000});}catch(_){}
          transferId='';
          setCommandOverlay(true,'Drive relay gagal di-fetch. Beralih ke transfer realtime langsung dari plugin PC…','Export JSON ke Ponsel');
          if(note)note.textContent='Export: Drive fetch gagal • memakai fallback realtime cepat…';
          prep=await prepareFastChunkFallback({priorityExport:true});transferId=prep.transferId;
          const fast=await fetchLegacyExportBundle(prep,{showOverlay:true,title:'Export JSON ke Ponsel'});
          b64=fast.data;payloadEncoding=fast.encoding;transferId='';
        }
      }else{
        if(!Number(prep.totalChunks))throw new Error('Plugin PC tidak menyiapkan bundle Export lengkap.');
        for(let i=0;i<prep.totalChunks;i++){
          const pct=Math.round(((i+1)/prep.totalChunks)*100);
          setCommandOverlay(true,`Drive relay tidak tersedia. Fallback ${i+1}/${prep.totalChunks} (${pct}%)…`,'Export JSON ke Ponsel');
          setSyncing(true,`Fallback Export ${pct}%`);
          if(note)note.textContent=`Export fallback: ${i+1}/${prep.totalChunks} (${pct}%)…`;
          const ch=await sendCommand('export_bundle_chunk',{transferId,index:i},{quiet:true,transfer:true,timeoutMs:30000});
          if(!ch||typeof ch.data!=='string')throw new Error('Chunk Export fallback PC '+(i+1)+' tidak lengkap.');
          b64+=ch.data;
        }
        await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:20000});transferId='';
      }
      setCommandOverlay(true,'File relay sudah diterima. Memverifikasi dan membentuk file JSON…','Export JSON ke Ponsel');
      setSyncing(true,'Memverifikasi file Export…');
      const text=await decodeBase64Payload(b64,payloadEncoding);
      const payload=JSON.parse(text);
      if(!payload||payload.schema!=='tf_multi_analyst_export_v1'||!payload.storage)throw new Error('Bundle Export PC tidak valid.');
      const d=new Date(),pad=n=>String(n).padStart(2,'0');const name=`tf_scan_export_${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}.json`;
      const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
      setCommandOverlay(true,'File JSON sudah siap. Pilih lokasi penyimpanan; folder awal diarahkan ke Downloads jika didukung perangkat…','Export JSON ke Ponsel');
      setSyncing(true,'File siap • pilih folder lalu Simpan…');
      if(note)note.textContent='Export: file ready • pilih direktori penyimpanan (default Downloads jika tersedia)…';
      await downloadBlob(blob,name);
      await nextPaint();
      if(note)note.textContent='Export selesai. File sudah diserahkan ke ponsel untuk disimpan/download.';
      await nextPaint();
      logEvent('Export JSON ke ponsel selesai. File sudah benar-benar siap dan proses simpan/download sudah dipanggil.','ok');
    }catch(e){
      if(transferId){try{await sendCommand('export_bundle_finish',{transferId},{quiet:true,transfer:true,timeoutMs:12000});}catch(_){}transferId='';}
      if(note)note.textContent='Export gagal: '+(e.message||e);
      logEvent('Export JSON ke ponsel gagal: '+(e.message||e),'err');
    }finally{
      importTransferBusy=false;exportPriority=false;mirrorDeferRequested=false;if(exportBtn)exportBtn.classList.remove('tf-remote-btn-loading');setCommandOverlay(false);setSyncing(false);refreshBusyControls();
      if(opened&&lastStatus&&lastStatus.desktopOnline&&Date.now()>=pcMirrorBackoffUntil)schedulePcMirror(lastStatus);
    }
  }

  function disconnectRemotePresence(){
    const a=auth();if(!a)return;
    try{
      fetch(API+'/remote/mobile-disconnect',{method:'POST',cache:'no-store',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({...a,deviceType:'MOBILE',clientType:'MOBILE',mobileVersion:'1.0.106',remoteRevision:'REV349'})}).catch(()=>{});
    }catch(_){}
  }
  function nextPollDelay(){return realtimeOpen()?POLL_FAST_MS:(lastStatus&&lastStatus.desktopOnline?POLL_ONLINE_MS:POLL_OFFLINE_MS);}
  function schedulePoll(ms){if(pollTimer)clearTimeout(pollTimer);if(!opened){pollTimer=null;return;}pollTimer=setTimeout(async()=>{pollTimer=null;await refreshStatus(false);if(opened)schedulePoll(nextPollDelay());},Math.max(500,Number(ms)||POLL_OFFLINE_MS));}
  function openRemote(resumeRestore=false){
    ensureUi();
    if(!resumeRestore&&mobileConflictBlocked){mobileConflictBlocked=false;mobileConflictPending=false;clearFastTicket();}
    opened=true;failureCount=0;tfRemoteResumeRestoreV313=!!resumeRestore;bootHydrating=!resumeRestore;bootstrapOpenedAt=Date.now();
    try{localStorage.setItem(REMOTE_OPEN_KEY,'1');}catch(_){}
    if(bootstrapFallbackTimer){clearTimeout(bootstrapFallbackTimer);bootstrapFallbackTimer=null;}
    const cached=loadBootstrapCache();lastStatus=lastStatus||cached||null;
    if(!(history.state&&history.state.tfRemotePage)){
      try{history.pushState(Object.assign({},history.state||{},{tfRemotePage:true}),'',location.href);remoteHistoryPushed=true;}catch(_){remoteHistoryPushed=false;}
    }
    document.documentElement.classList.add('tf-mobile-remote-opened');
    q('tf-mobile-remote-page')?.classList.add('open');

    // REV275: never block the page behind a long initial-sync overlay.
    setCommandOverlay(false);
    if(lastStatus)render(lastStatus);
    if(resumeRestore&&lastStatus){lastSuccessAt=Date.now();setSyncing(false);}else setSyncing(true,realtimeOpen()?'Realtime siap • meminta snapshot sidebar…':'Menghubungkan realtime ke plugin PC…');

    void connectFastLane();
    if(realtimeOpen()){sendMobileUiPresence(true);requestRealtimeSnapshot();}syncMobilePresenceLoop();

    if(uiPresenceTimer)clearInterval(uiPresenceTimer);
    uiPresenceTimer=setInterval(()=>{if(opened)try{render(lastStatus||{});}catch(_){}},1000);

    // REV275: avoid realtime/HTTP deadlock. If Desktop snapshot has not arrived
    // quickly, start one NON-BLOCKING legacy status read even when Mobile WS is
    // already open. This also publishes Mobile Remote presence for old backends.
    bootstrapFallbackTimer=setTimeout(()=>{
      bootstrapFallbackTimer=null;if(!opened)return;
      const fresh=lastDesktopSnapshotAt&&Date.now()-lastDesktopSnapshotAt<3000;
      if(!fresh)void refreshStatus(false);
      if(opened&&!pollTimer)schedulePoll(nextPollDelay());
    },700);
  }
  function navigateBackRemote(){if(history.state&&history.state.tfRemotePage){try{history.back();return;}catch(_){}}closeRemote(true);}
  function closeRemote(fromHistory=false){
    // Keep the pre-warmed realtime channel alive while the mobile app itself
    // remains open. Closing only the Remote screen must not force a new handshake.
    if(bootstrapFallbackTimer){clearTimeout(bootstrapFallbackTimer);bootstrapFallbackTimer=null;}
    opened=false;bootHydrating=false;tfRemoteResumeRestoreV313=false;try{localStorage.removeItem(REMOTE_OPEN_KEY);}catch(_){}syncMobilePresenceLoop();disconnectRemotePresence();
    try{closeFastLane();}catch(_){}try{closeDirectPeer(false);}catch(_){}
    mobileConflictPending=false;mobileConflictBlocked=false;hideMobileConflict();
    document.documentElement.classList.remove('tf-mobile-remote-opened');
    q('tf-mobile-remote-page')?.classList.remove('open');
    if(pollTimer){clearTimeout(pollTimer);pollTimer=null;}
    if(uiPresenceTimer){clearInterval(uiPresenceTimer);uiPresenceTimer=null;}
    if(pcMirrorTimer){clearTimeout(pcMirrorTimer);pcMirrorTimer=null;}
    if(analystSyncTimer){clearTimeout(analystSyncTimer);analystSyncTimer=null;}
    for(const t of rowSyncTimers.values())clearTimeout(t);rowSyncTimers.clear();
    setSyncing(false);setCommandOverlay(false);remoteHistoryPushed=false;
    if(window.__tfMobileImportPendingReload){window.__tfMobileImportPendingReload=false;setTimeout(()=>location.reload(),80);}
  }
  async function shutdownRemoteForLogout(){
    try{opened=false;mobileConflictBlocked=true;mobileConflictPending=false;hideMobileConflict();}catch(_){}
    try{disconnectRemotePresence();}catch(_){}
    try{closeFastLane();}catch(_){}
    try{closeDirectPeer(false);}catch(_){}
    if(pollTimer){clearTimeout(pollTimer);pollTimer=null;}
    if(uiPresenceTimer){clearInterval(uiPresenceTimer);uiPresenceTimer=null;}
    if(pcMirrorTimer){clearTimeout(pcMirrorTimer);pcMirrorTimer=null;}
    if(analystSyncTimer){clearTimeout(analystSyncTimer);analystSyncTimer=null;}
    try{localStorage.removeItem(REMOTE_OPEN_KEY);localStorage.removeItem(FAST_TICKET_CACHE_KEY);localStorage.removeItem(REMOTE_BOOT_CACHE_KEY);}catch(_){}
    return true;
  }
  window.tfMobileRemoteShutdown=shutdownRemoteForLogout;

  function boot(){
    loadEvents();
    // REV332: Remote is NEVER auto-opened after login/reload. The dashboard is
    // independent from the Desktop Remote toggle. Only an explicit press on the
    // Remote button runs openRemoteGuarded() and checks that the PC toggle is ON.
    try{localStorage.removeItem(REMOTE_OPEN_KEY);}catch(_){}
    const finishButton=()=>ensureButton();
    if(finishButton())return;
    const mo=new MutationObserver(()=>{if(finishButton())mo.disconnect();});
    mo.observe(document.documentElement,{subtree:true,childList:true});
    setTimeout(()=>finishButton(),1200);
  }
  window.addEventListener('popstate',()=>{if(opened&&!(history.state&&history.state.tfRemotePage))closeRemote(true);},{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden){tfRemoteBackgroundedAtV313=Date.now();return;}
    // REV313: returning from Facebook/another app resumes the existing Remote
    // screen from cached state. Reconnect/snapshot is silent; never show the
    // initial synchronization flow again merely because Android paused WebView.
    const awayMs=tfRemoteBackgroundedAtV313?Date.now()-tfRemoteBackgroundedAtV313:0;tfRemoteBackgroundedAtV313=0;
    if(opened)void connectFastLane();
    if(opened){
      if(pollTimer){clearTimeout(pollTimer);pollTimer=null;}
      // REV316: resume is continuation, not a new synchronization session.
      // Paint the persisted snapshot immediately and reconnect invisibly.
      const cachedResume=loadBootstrapCache();
      if(cachedResume){lastStatus=cachedResume;try{render(lastStatus);}catch(_){}}
      setCommandOverlay(false);setSyncing(false);
      if(realtimeOpen()){sendMobileUiPresence(true);requestRealtimeSnapshot();schedulePoll(nextPollDelay());}
      else{
        // Keep the last UI on screen while transport reconnects. Only perform a
        // silent HTTP proof after a long suspension and no realtime recovery.
        setTimeout(()=>{if(opened&&!realtimeOpen()&&awayMs>45000)refreshStatus(false).finally(()=>schedulePoll(nextPollDelay()));else if(opened&&!pollTimer)schedulePoll(nextPollDelay());},650);
      }
    }
  });
  window.addEventListener('pageshow',()=>{if(opened)void connectFastLane();if(opened){const cached=loadBootstrapCache();if(cached){lastStatus=cached;try{render(lastStatus);}catch(_){}}setCommandOverlay(false);setSyncing(false);if(realtimeOpen()){sendMobileUiPresence(true);requestRealtimeSnapshot();}}},{passive:true});
  // Do not explicitly disconnect on Android app-switch pagehide; WebView may
  // emit pagehide while the Activity is merely backgrounded. Socket lifecycle
  // and OS cleanup handle a true unload automatically.
  window.addEventListener('pagehide',()=>{tfRemoteBackgroundedAtV313=Date.now();},{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
