# REV379 Remote Export Action Audit

## assets/tf-remote-sidebar-agent.js

### export_bundle_prepare @ 93917
~~~js
 disimpan di plugin Chrome.'};
    return {ok:true,action:'import_bundle_begin',transferId:id,message:'Transfer Import siap.',totalChunks:total};
  }
  async function importBundleChunk(payload){
    const id=cleanText(payload.transferId,100),index=Number(payload.index);if(!id||!Number.isInteger(index)||index<0)return {ok:false,code:'IMPORT_CHUNK_INVALID',message:'Chunk Import tidak valid.'};
    let st=await storageGet([REMOTE_IMPORT_META_KEY]);let meta=st[REMOTE_IMPORT_META_KEY];
    if(!meta||meta.id!==id){const cached=IMPORT_COMPLETED_CACHE.get(id);if(cached&&Date.now()-cached.at<5*60*1000)return cached.result;}
    // REV244 fast path: first chunk creates the session automatically.
    if((!meta||meta.id!==id) && payload.fastV2){
      const total=Math.max(1,Math.min(5000,Number(payload.totalChunks)||1));
      await clearOldImportTransferChunks();
      meta={id,total,fileName:cleanText(payload.fileName,180)||'mobile-import.json',encoding:cleanText(payload.encoding,20)||'plain',createdAt:Date.now(),fastV2:true};
      await storageSet({[REMOTE_IMPORT_META_KEY]:meta});
    }
    if(!meta||meta.id!==id)return {ok:false,code:'IMPORT_SESSION_MISSING',message:'Sesi Import Remote tidak ditemukan.'};
    if(index>=Number(meta.total||0))return {ok:false,code:'IMPORT_CHUNK_RANGE',message:'Index Chunk Import di luar range.'};
    const key=REMOTE_IMPORT_CHUNK_PREFIX+id+'_'+index,data=String(payload.data||'');
    await storageSet({[key]:data});
    const verify=await storageGet([key]);
    if(typeof verify[key]!=='string'||verify[key]!==data)return {ok:false,code:'IMPORT_CHUNK_STORE_FAILED',message:'Chunk '+(index+1)+' belum tersimpan di Chrome. Silakan retry.'};
    if(payload.fastV2&&payload.finalize===true)return await finalizeImportTransfer(id);
    return {ok:true,action:'import_bundle_chunk',transferId:id,index,stored:true,length:data.length,complete:false,message:'Chunk '+(index+1)+' diterima dan diverifikasi.'};
  }
  async function importStagedBundleV245(payload){
    const id=cleanText(payload&&payload.transferId,100);
    if(!id)return {ok:false,code:'IMPORT_STAGE_ID_REQUIRED',message:'Transfer ID Fast Import tidak tersedia.'};
    // REV246 FIX: REV245 forgot to attach the Desktop license credentials and
    // session to import-stage-get / clear. The Worker therefore rejected the
    // fetch with “Email dan token wajib diisi” even though Remote was Online.
    const a=await auth();
    if(!a)return {ok:false,code:'IMPORT_STAGE_DESKTOP_AUTH_MISSING',message:'Session lisensi Desktop belum siap untuk mengambil Fast Import.'};
    // REV248 Fast Staging V4: fetch metadata first, then small parts in
    // parallel. This avoids one multi-MB Apps Script response timing out.
    let staged=await api('/remote/import-stage-get',{...a,transferId:id,metaOnly:true},60000);
    if(!staged||staged.complete!==true)return {ok:false,code:'IMPORT_STAGE_INCOMPLETE',message:staged&&staged.message||'Fast Import staging belum lengkap.'};
    if(staged.multipart===true&&Number(staged.totalParts||0)>0){
      const total=Math.max(1,Math.min(100,Number(staged.totalParts||1)));const parts=new Array(total);
      const fetchPart=async(index)=>{
        let last=null;
        for(let attempt=1;attempt<=3;attempt++){
          try{
            const r=await api('/remote/import-stage-get',{...a,transferId:id,partIndex:index},60000);
            if(!r||r.complete!==true||typeof r.data!=='string')throw new Error(r&&r.message||('Fast Import part '+(index+1)+' belum tersedia.'));
            parts[index]=r.data;return;
          }catch(e){last=e;if(attempt<3)await sleep(350*attempt);}
        }
        throw last||new Error('Fast Import part gagal diambil.');
      };
      for(let i=0;i<total;i+=3)await Promise.all(Array.from({length:Math.min(3,total-i)},(_,off)=>fetchPart(i+off)));
      staged={...staged,data:parts.join('')};
    }else if(typeof staged.data!=='string'){
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
    if(remoteButtonDisabled(btn))return {ok:false,code:'SCAN_ISIGNAL_DISABLED',message:'Scan From iSignal User sedang nonaktif di sidebar PC.'};
    try{btn.click();}catch(e){return {ok:false,code:'SCAN_ISIGNAL_CLICK_FAILED',message:'Scan From iSignal gagal diklik: '+cleanText(e&&e.message||e,120)};}
    queueImmediateSync(5);
    return {ok:true,action:'scan_from_isignal',dispatched:true,started:true,analysts:[],analystCount:0,message:'Scan From iSignal langsung dimulai di plugin PC.'};
  }

  async function updateOrStopAndWait(){
    const btn=firstVisible(['tf-btn-update-main','tf-btn-update-masuk','tf-btn-update-isignal']);
    if(!btn)return {ok:false,code:'UPDATE_BUTTON_MISSING',message:'Tombol Update tidak tersedia di sidebar PC.'};
    if(btn.disabled)return {ok:false,code:'UPDATE_BUTTON_DISABLED',message:'Tombol Update sedang nonaktif di sidebar PC.'};
    const before=cleanText(btn.textContent,80);const stopping=/stop|stopping/i.test(before);
    btn.click();
    const started=Date.now();
    if(stopping){
      while(Date.now()-started<30000){await sleep(120);const t=cleanText(btn.textContent,80);const d=await storageGet(['tfScanInProgress']);if(!d.tfScanInProgress&&!/stop|stopping/i.test(t)){queueImmediateSync(30);return {ok:true,action:'update',scanActive:false,stopped:true,message:'Batch scanning sudah dihentikan.'};}}
      return {ok:false,code:'STOP_TIMEOUT',message:'Stop sudah dikirim, tetapi plugin belum memberi signal selesai.'};
    }
    while(Date.now()-started<12000){
      await sleep(120);
      const t=cleanText(btn.textContent,80);
      const d=await storageGet(['tfScanInProgress','tfAccountLoginState','tfRootLoginState','tfLoginError','tfForceLoginForm']);
      const account=String(d.tfAccountLoginState||'').toLowerCase();
      const root=String(d.tfRootLoginState||'').toLowerCase();
      const loginError=String(d.tfLoginError||'').trim();
      if(account==='logged_out'||root==='logged_out'||d.tfForceLoginForm===true||/session tradersfamily.*tidak aktif|silakan login kembali sebelum update|session.*berakhir/i.test(loginError)){
        queueImmediateSync(10);
        return {ok:false,code:'TRADERSFAMILY_LOGIN_REQUIRED',action:'update',scanActive:false,message:'Update dibatalkan: session TradersFamily sudah logout. Silakan login kembali di Plugin PC.'};
      }
      if(d.tfScanInProgress||/stop|stopping/i.test(t)){
        queueImmediateSync(30);
        return {ok:true,action:'update',scanActive:true,started:true,message:'Login TradersFamily valid. Batch scanning Update sudah dimulai.'};
      }
    }
    queueImmediateSync(30);
    return {ok:false,code:'UPDATE_PREFLIGHT_TIMEOUT',action:'update',scanActive:false,message:'Update belum dimulai karena status login TradersFamily belum dapat diverifikasi. Periksa koneksi/login lalu coba lagi.'};
  }

  function setRemoteInputValue(el,value){
    if(!el)return;
    try{
      const proto=el instanceof HTMLInputElement?HTMLInputElement.prototype:Object.getPrototypeOf(el);
      const desc=proto&&Object.getOwnPropertyDescriptor(proto,'value');
      if(desc&&desc.set)desc.set.call(el,value);else el.value=value;
    }catch(_){el.value=value;}
    try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
  }

  async function remoteLoginAndWait(payload){
    const mode=String(payload&&payload.loginMode||'standard').trim().toLowerCase()==='mt4'?'mt4':'standard';
    const identity=String(payl
~~~

### export_bundle_prepare @ 99585
~~~js
tEncoder().encode(text);let data=bytes,encoding='plain';
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
    if(remoteButtonDisabled(btn))return {ok:false,code:'SCAN_ISIGNAL_DISABLED',message:'Scan From iSignal User sedang nonaktif di sidebar PC.'};
    try{btn.click();}catch(e){return {ok:false,code:'SCAN_ISIGNAL_CLICK_FAILED',message:'Scan From iSignal gagal diklik: '+cleanText(e&&e.message||e,120)};}
    queueImmediateSync(5);
    return {ok:true,action:'scan_from_isignal',dispatched:true,started:true,analysts:[],analystCount:0,message:'Scan From iSignal langsung dimulai di plugin PC.'};
  }

  async function updateOrStopAndWait(){
    const btn=firstVisible(['tf-btn-update-main','tf-btn-update-masuk','tf-btn-update-isignal']);
    if(!btn)return {ok:false,code:'UPDATE_BUTTON_MISSING',message:'Tombol Update tidak tersedia di sidebar PC.'};
    if(btn.disabled)return {ok:false,code:'UPDATE_BUTTON_DISABLED',message:'Tombol Update sedang nonaktif di sidebar PC.'};
    const before=cleanText(btn.textContent,80);const stopping=/stop|stopping/i.test(before);
    btn.click();
    const started=Date.now();
    if(stopping){
      while(Date.now()-started<30000){await sleep(120);const t=cleanText(btn.textContent,80);const d=await storageGet(['tfScanInProgress']);if(!d.tfScanInProgress&&!/stop|stopping/i.test(t)){queueImmediateSync(30);return {ok:true,action:'update',scanActive:false,stopped:true,message:'Batch scanning sudah dihentikan.'};}}
      return {ok:false,code:'STOP_TIMEOUT',message:'Stop sudah dikirim, tetapi plugin belum memberi signal selesai.'};
    }
    while(Date.now()-started<12000){
      await sleep(120);
      const t=cleanText(btn.textContent,80);
      const d=await storageGet(['tfScanInProgress','tfAccountLoginState','tfRootLoginState','tfLoginError','tfForceLoginForm']);
      const account=String(d.tfAccountLoginState||'').toLowerCase();
      const root=String(d.tfRootLoginState||'').toLowerCase();
      const loginError=String(d.tfLoginError||'').trim();
      if(account==='logged_out'||root==='logged_out'||d.tfForceLoginForm===true||/session tradersfamily.*tidak aktif|silakan login kembali sebelum update|session.*berakhir/i.test(loginError)){
        queueImmediateSync(10);
        return {ok:false,code:'TRADERSFAMILY_LOGIN_REQUIRED',action:'update',scanActive:false,message:'Update dibatalkan: session TradersFamily sudah logout. Silakan login kembali di Plugin PC.'};
      }
      if(d.tfScanInProgress||/stop|stopping/i.test(t)){
        queueImmediateSync(30);
        return {ok:true,action:'update',scanActive:true,started:true,message:'Login TradersFamily valid. Batch scanning Update sudah dimulai.'};
      }
    }
    queueImmediateSync(30);
    return {ok:false,code:'UPDATE_PREFLIGHT_TIMEOUT',action:'update',scanActive:false,message:'Update belum dimulai karena status login TradersFamily belum dapat diverifikasi. Periksa koneksi/login lalu coba lagi.'};
  }

  function setRemoteInputValue(el,value){
    if(!el)return;
    try{
      const proto=el instanceof HTMLInputElement?HTMLInputElement.prototype:Object.getPrototypeOf(el);
      const desc=proto&&Object.getOwnPropertyDescriptor(proto,'value');
      if(desc&&desc.set)desc.set.call(el,value);else el.value=value;
    }catch(_){el.value=value;}
    try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
  }

  async function remoteLoginAndWait(payload){
    const mode=String(payload&&payload.loginMode||'standard').trim().toLowerCase()==='mt4'?'mt4':'standard';
    const identity=String(payload&&payload.identity||'').trim().slice(0,180);
    const password=String(payload&&payload.password||'').slice(0,300);
    const remember=!!(payload&&payload.remember);
    if(!identity||!password)return {ok:false,code:'REMOTE_LOGIN_FIELDS_REQUIRED',action:'remote_login',message:'Email/Username/MT4 Id dan Password wajib diisi di ponsel.'};

    const loginContainer=document.getElementById('login-container');
    if(!isVisible(loginContainer)){
      try{if(typeof window.showLoginView==='function')window.showLoginView();}catch(_){}
      await sleep(120);
    }
    const email=document.getElementById('login-email');
    const pass=document.getElementById('login-password');
    const rem=document.getElementById('login-remember');
    const btn=document.getElementById(mode==='mt4'?'login-mt4-btn':'login-btn');
    if(!email||!pass||!btn)return {ok:false,code:'REMOTE_LOGIN_FORM_MISSING',action:'remote_login',message:'Form Login plugin PC belum tersedia.'};
    if(btn.disabled)return {ok:false,code:'REMOTE_LOGIN_DISABLED',action:'remote_login',message:'Tombol login di plugin PC sedang nonaktif.'};

    setRemoteInputValue(email,identity);
    setRemoteInputValue(pass,password);
    if(rem){rem.checked=remember;try{rem.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){} }
    btn.click();
    const started=Date.now();let lastErr='';
    while(Date.now()-started<120000){
      await sleep(500);
      const d=await storageGet(['tfLoginConfirmed','tfAccountLoginState','tfRootLoginState','tfEnteredMain','tfUserProfile','tfLoginError','tfForceLoginForm']);
      const account=String(d.tfAccountLoginState||'').toLowerCase();
      const root=String(d.tfRootLoginState||'').toLowerCase();
      const profile=d.tfUserProfile&&typeof d.tfUserProfile==='object'?d.tfUserProfile:null;
      lastErr=String(d.tfLoginError||'').trim();
      const view=visibleContainer();
      const ok=!!(d.tfLoginConfirmed===true||d.tfEnteredMain===true||(profile&&(profile.email||profile.name))||/logged[_ -]?in|online|authenticated|active/.test(account)||/logged[_ -]?in|online|authenticated|active/.test(root)||view==='masuk'||view==='main'||view==='isignal');
      if(ok && view!=='login'){
        // Never leave the password in the sidebar input after success.
        try{setRemoteInputValue(pass,'');}catch(_){}
        queueImmediateSync(20);
        return {ok:true,action:'remote_login',loginMode:mode,loginState:'online',view,message:(mode==='mt4'?'Login MT4':'Login Biasa')+' berhasil. Akun PC sudah Online.'};
      }
      if(lastErr && /gagal|failed|salah|invalid|ditolak|wrong|error/i.test(lastErr)){
        try{setRemoteInputValue(pass,'');}catch(_){}
        return {ok:false,code:'REMOTE_LOGIN_FAILED',action:'remote_login',loginMode:mode,message:lastErr};
      }
    }
    try{setRemoteInputValue(pass,'');}catch(_){}
    return {ok:false,code:'REMOTE_LOGIN_TIMEOUT',action:'remote_login',loginMode:mode,message:'Login belum selesai di PC. Jika halaman login meminta CAPTCHA/verifikasi tambahan, selesaikan verifikasi tersebut di PC lalu coba lagi.'};
  }

  async function execute(command){
    const c=command && command.command || command || {};
    const action=String(c.action||'').trim().toLowerCase();
    const payload=c.payload && typeof c.payload==='object'?c.payload:{};
    if(action==='export_bundle_prepare') return await exportBundlePrepare(payload);
    if(action==='export_bundle_chunk') return await exportBundleChunk(payload);
    if(action==='export_bundle_finish') return await exportBundleFinish(payload);
    if(action==='import_bundle_begin') return await importBundleBegin(payload);
    if(action==='import_bundle_chunk') return await importBundleChunk(payload);
    if(action==='import_bundle_commit') return await importBundleCommit(payload);
    if(action==='update') return await updateOrStopAndWait();
    if(action==='refresh') return refreshDispatch();
    if(action==='batch_toggle') return batchOrStopDispatch();
    if(action==='scan_channel') return clickVisible(['tf-btn-scanlink-main','scan-btn','tf-btn-scanlink-isignal','tf-btn-scanlink-masuk']);
    if(action==='scan_from_isignal') return scanFromIsignalDispatch();
    if(action==='open_dashboard') return clickVisible(['open-dashboard-btn']);
    if(action==='export_data') return clickVisible(['tf-btn-export-main','tf-btn-export-isignal','tf-btn-export-masuk']);
    if(action==='add_analyst') return await addAnalystAndWait(payload);
    if(action==='set_time_range') return await setTimeRange(payload.value);
    if(action==='set_scan_pair') return setScanPair(payload.value);
    if(action==='set_all_analyst_pairs') return setAllAnalystPairs(payload.values||payload.value);
    if(action==='set_analysts'){
      const mode=String(payload&&payload.mode||'').trim().toLowerCase();
      if(mode==='remote_login')return await remoteLoginAndWait(payload);
      if(mode==='patch'||mode==='row_patch')return await patchAnalyst(payload);
      if(mode==='remove'||mode==='row_remove')return await removeAnalyst(payload);
      return await setAnalysts(payload.analysts);
    }
    // Compatibility aliases if a future backend allows these names directly.
    if(action==='patch_analyst'||action==='set_analyst_row'||action==='patch_analyst_row') return await patchAnalyst(payload);
    if(action==='remove_analyst'||action==='remove_analyst_row') return await removeAnalyst(payload);
    if(action==='set_remember_links') return setRememberLinks(payload.value);
    if(action==='clear_scan_log') return clearScanLog();
    if(action==='clear_power_log') return clearPowerLog();
    return {ok:false,message:'Perintah Remote tidak dikenali: '+
~~~

### export_bundle_prepare @ 111247
~~~js
ocument.getElementById('scan-from-isignal-btn');
    if(!btn)return {ok:false,code:'SCAN_ISIGNAL_MISSING',message:'Tombol Scan From iSignal User tidak tersedia di sidebar PC.'};
    if(remoteButtonDisabled(btn))return {ok:false,code:'SCAN_ISIGNAL_DISABLED',message:'Scan From iSignal User sedang nonaktif di sidebar PC.'};
    try{btn.click();}catch(e){return {ok:false,code:'SCAN_ISIGNAL_CLICK_FAILED',message:'Scan From iSignal gagal diklik: '+cleanText(e&&e.message||e,120)};}
    queueImmediateSync(5);
    return {ok:true,action:'scan_from_isignal',dispatched:true,started:true,analysts:[],analystCount:0,message:'Scan From iSignal langsung dimulai di plugin PC.'};
  }

  async function updateOrStopAndWait(){
    const btn=firstVisible(['tf-btn-update-main','tf-btn-update-masuk','tf-btn-update-isignal']);
    if(!btn)return {ok:false,code:'UPDATE_BUTTON_MISSING',message:'Tombol Update tidak tersedia di sidebar PC.'};
    if(btn.disabled)return {ok:false,code:'UPDATE_BUTTON_DISABLED',message:'Tombol Update sedang nonaktif di sidebar PC.'};
    const before=cleanText(btn.textContent,80);const stopping=/stop|stopping/i.test(before);
    btn.click();
    const started=Date.now();
    if(stopping){
      while(Date.now()-started<30000){await sleep(120);const t=cleanText(btn.textContent,80);const d=await storageGet(['tfScanInProgress']);if(!d.tfScanInProgress&&!/stop|stopping/i.test(t)){queueImmediateSync(30);return {ok:true,action:'update',scanActive:false,stopped:true,message:'Batch scanning sudah dihentikan.'};}}
      return {ok:false,code:'STOP_TIMEOUT',message:'Stop sudah dikirim, tetapi plugin belum memberi signal selesai.'};
    }
    while(Date.now()-started<12000){
      await sleep(120);
      const t=cleanText(btn.textContent,80);
      const d=await storageGet(['tfScanInProgress','tfAccountLoginState','tfRootLoginState','tfLoginError','tfForceLoginForm']);
      const account=String(d.tfAccountLoginState||'').toLowerCase();
      const root=String(d.tfRootLoginState||'').toLowerCase();
      const loginError=String(d.tfLoginError||'').trim();
      if(account==='logged_out'||root==='logged_out'||d.tfForceLoginForm===true||/session tradersfamily.*tidak aktif|silakan login kembali sebelum update|session.*berakhir/i.test(loginError)){
        queueImmediateSync(10);
        return {ok:false,code:'TRADERSFAMILY_LOGIN_REQUIRED',action:'update',scanActive:false,message:'Update dibatalkan: session TradersFamily sudah logout. Silakan login kembali di Plugin PC.'};
      }
      if(d.tfScanInProgress||/stop|stopping/i.test(t)){
        queueImmediateSync(30);
        return {ok:true,action:'update',scanActive:true,started:true,message:'Login TradersFamily valid. Batch scanning Update sudah dimulai.'};
      }
    }
    queueImmediateSync(30);
    return {ok:false,code:'UPDATE_PREFLIGHT_TIMEOUT',action:'update',scanActive:false,message:'Update belum dimulai karena status login TradersFamily belum dapat diverifikasi. Periksa koneksi/login lalu coba lagi.'};
  }

  function setRemoteInputValue(el,value){
    if(!el)return;
    try{
      const proto=el instanceof HTMLInputElement?HTMLInputElement.prototype:Object.getPrototypeOf(el);
      const desc=proto&&Object.getOwnPropertyDescriptor(proto,'value');
      if(desc&&desc.set)desc.set.call(el,value);else el.value=value;
    }catch(_){el.value=value;}
    try{el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){}
  }

  async function remoteLoginAndWait(payload){
    const mode=String(payload&&payload.loginMode||'standard').trim().toLowerCase()==='mt4'?'mt4':'standard';
    const identity=String(payload&&payload.identity||'').trim().slice(0,180);
    const password=String(payload&&payload.password||'').slice(0,300);
    const remember=!!(payload&&payload.remember);
    if(!identity||!password)return {ok:false,code:'REMOTE_LOGIN_FIELDS_REQUIRED',action:'remote_login',message:'Email/Username/MT4 Id dan Password wajib diisi di ponsel.'};

    const loginContainer=document.getElementById('login-container');
    if(!isVisible(loginContainer)){
      try{if(typeof window.showLoginView==='function')window.showLoginView();}catch(_){}
      await sleep(120);
    }
    const email=document.getElementById('login-email');
    const pass=document.getElementById('login-password');
    const rem=document.getElementById('login-remember');
    const btn=document.getElementById(mode==='mt4'?'login-mt4-btn':'login-btn');
    if(!email||!pass||!btn)return {ok:false,code:'REMOTE_LOGIN_FORM_MISSING',action:'remote_login',message:'Form Login plugin PC belum tersedia.'};
    if(btn.disabled)return {ok:false,code:'REMOTE_LOGIN_DISABLED',action:'remote_login',message:'Tombol login di plugin PC sedang nonaktif.'};

    setRemoteInputValue(email,identity);
    setRemoteInputValue(pass,password);
    if(rem){rem.checked=remember;try{rem.dispatchEvent(new Event('change',{bubbles:true}));}catch(_){} }
    btn.click();
    const started=Date.now();let lastErr='';
    while(Date.now()-started<120000){
      await sleep(500);
      const d=await storageGet(['tfLoginConfirmed','tfAccountLoginState','tfRootLoginState','tfEnteredMain','tfUserProfile','tfLoginError','tfForceLoginForm']);
      const account=String(d.tfAccountLoginState||'').toLowerCase();
      const root=String(d.tfRootLoginState||'').toLowerCase();
      const profile=d.tfUserProfile&&typeof d.tfUserProfile==='object'?d.tfUserProfile:null;
      lastErr=String(d.tfLoginError||'').trim();
      const view=visibleContainer();
      const ok=!!(d.tfLoginConfirmed===true||d.tfEnteredMain===true||(profile&&(profile.email||profile.name))||/logged[_ -]?in|online|authenticated|active/.test(account)||/logged[_ -]?in|online|authenticated|active/.test(root)||view==='masuk'||view==='main'||view==='isignal');
      if(ok && view!=='login'){
        // Never leave the password in the sidebar input after success.
        try{setRemoteInputValue(pass,'');}catch(_){}
        queueImmediateSync(20);
        return {ok:true,action:'remote_login',loginMode:mode,loginState:'online',view,message:(mode==='mt4'?'Login MT4':'Login Biasa')+' berhasil. Akun PC sudah Online.'};
      }
      if(lastErr && /gagal|failed|salah|invalid|ditolak|wrong|error/i.test(lastErr)){
        try{setRemoteInputValue(pass,'');}catch(_){}
        return {ok:false,code:'REMOTE_LOGIN_FAILED',action:'remote_login',loginMode:mode,message:lastErr};
      }
    }
    try{setRemoteInputValue(pass,'');}catch(_){}
    return {ok:false,code:'REMOTE_LOGIN_TIMEOUT',action:'remote_login',loginMode:mode,message:'Login belum selesai di PC. Jika halaman login meminta CAPTCHA/verifikasi tambahan, selesaikan verifikasi tersebut di PC lalu coba lagi.'};
  }

  async function execute(command){
    const c=command && command.command || command || {};
    const action=String(c.action||'').trim().toLowerCase();
    const payload=c.payload && typeof c.payload==='object'?c.payload:{};
    if(action==='export_bundle_prepare') return await exportBundlePrepare(payload);
    if(action==='export_bundle_chunk') return await exportBundleChunk(payload);
    if(action==='export_bundle_finish') return await exportBundleFinish(payload);
    if(action==='import_bundle_begin') return await importBundleBegin(payload);
    if(action==='import_bundle_chunk') return await importBundleChunk(payload);
    if(action==='import_bundle_commit') return await importBundleCommit(payload);
    if(action==='update') return await updateOrStopAndWait();
    if(action==='refresh') return refreshDispatch();
    if(action==='batch_toggle') return batchOrStopDispatch();
    if(action==='scan_channel') return clickVisible(['tf-btn-scanlink-main','scan-btn','tf-btn-scanlink-isignal','tf-btn-scanlink-masuk']);
    if(action==='scan_from_isignal') return scanFromIsignalDispatch();
    if(action==='open_dashboard') return clickVisible(['open-dashboard-btn']);
    if(action==='export_data') return clickVisible(['tf-btn-export-main','tf-btn-export-isignal','tf-btn-export-masuk']);
    if(action==='add_analyst') return await addAnalystAndWait(payload);
    if(action==='set_time_range') return await setTimeRange(payload.value);
    if(action==='set_scan_pair') return setScanPair(payload.value);
    if(action==='set_all_analyst_pairs') return setAllAnalystPairs(payload.values||payload.value);
    if(action==='set_analysts'){
      const mode=String(payload&&payload.mode||'').trim().toLowerCase();
      if(mode==='remote_login')return await remoteLoginAndWait(payload);
      if(mode==='patch'||mode==='row_patch')return await patchAnalyst(payload);
      if(mode==='remove'||mode==='row_remove')return await removeAnalyst(payload);
      return await setAnalysts(payload.analysts);
    }
    // Compatibility aliases if a future backend allows these names directly.
    if(action==='patch_analyst'||action==='set_analyst_row'||action==='patch_analyst_row') return await patchAnalyst(payload);
    if(action==='remove_analyst'||action==='remove_analyst_row') return await removeAnalyst(payload);
    if(action==='set_remember_links') return setRememberLinks(payload.value);
    if(action==='clear_scan_log') return clearScanLog();
    if(action==='clear_power_log') return clearPowerLog();
    return {ok:false,message:'Perintah Remote tidak dikenali: '+action};
  }

  function remoteUiState(){
    // REV354: until the persisted/background state has been read, show a
    // neutral CONNECTING state instead of flashing OFF for a few frames.
    if(!remoteAvailabilityLoaded)return 'connecting';
    if(!remoteAvailabilityEnabled){browserCoreLastStableOnlineAt=0;return 'off';}

    const now=Date.now();
    const terminal=/auth_missing|remote_disabled|license_invalid|license_blocked|license_revoked/i.test(String(browserCoreConnectionState||''));
    if(terminal){browserCoreLastStableOnlineAt=0;return 'off';}

    if(browserCoreDirectReady||browserCoreWsReady){browserCoreLastStableOnlineAt=now;return 'online';}
    // A recent authenticated relay sync is a usable fallback. Do not paint
    // Remote OFF only because the WebSocket backend is reconnecting briefly.
    if(browserCoreHttpReadyAt&&now-browserCoreHttpReadyAt<45000){browserCoreLastStableOnlineAt=now;return 'online';}
    // REV355: a recoverable ticket/socket reconnect is not REMOTE OFFLINE.
    // Keep the last proven ONLINE state while the core obtains a fresh ticket.
    // If recovery takes longer, degrade to CONNECTING (never OFFLINE) until an
    // actual auth/disable terminal state is reported.
    if(browserCoreLastStableOnlineAt&&now-browserCoreLastStableOnlineAt<REMOTE_UI_ONLINE_HOLD_MS)return 'online';
    return 'connecting';
  }

  function styleRemoteToggle(btn){
    if(!btn)return;
    const knob=btn.querySelector('.tf-remote-availability-knob');
    if(!remoteAvailabilityLoaded){
      btn.setAttribute('aria-checked','false');
      btn.dataset.enabled='loading';
      btn.title='Remote — memuat status tersimpan…';
      btn.style.background='#4b5563';
      btn.style.borderColor='rgba(156,163,175,.72)';
      btn.style.boxShadow='none';
      if(knob)knob.style.transform='translateX(0)';
      return;
    }
    const enabled=remoteAvailabilityEnabled===true;
    btn.setAttribute('aria-checked',enabled?'true':'false');
    btn.dataset.enabled=enabled?'1':'0';
    btn.title=enabled?'Remote ON — koneksi realtime hemat usage':'Remote OFF — klik untuk mengaktifkan Remote';
    btn.style.background=enabled?'#16a34a':'#dc2626';
    btn.style.borderColor=enabled?'rgba(74,222,128,.85)':'rgba(248,113,113,.88)';
    btn.style.boxShadow='none';
    if(knob)knob.style.transform=enabled?'translateX(9px)':'translateX(0)';
  }

  function setRemoteAvailabilityFromUi(next){
    if(remoteAvailabilityBusy)return;
    remoteAvailabilityBusy=true;
    const wanted=next===true;
    remoteAvailabilityEnabled=wanted;
    renderRemoteMobileStatus(remoteMobileOnline);
    try{
      chrome.runtime.sendMessage({type:'TF_REMOTE_AVAILABILITY_SET',enabled:wanted},r=>{
        try{void chrome.runtime.lastError;}catch(_){}
        remoteAvailabilityBusy=false;
        if(r&&r.ok){
          remoteAvailabilityEnabled=r.enabled===true;remoteAvailabilityLoaded=true;
          browserCoreWsReady=remoteAvailabilityEnabled&&r.wsReady===true;
          browserCoreDirectReady=remoteAvailabilityEnabled&&r.directReady===true;browserCoreConnectionState=String(r.connectionState||'');browserCoreLastError=String(r.lastError||'');
          if(remoteAvailabilityEnabled){queueImmediateSync(10);void connectFastLane();}
        }else remoteAvailabilityEnabled=!wanted;
        renderRemoteMobileStatus(remoteMobileOnline);
      });
    }catch(_){remoteAvailabilityBusy=false;remoteAvailabilityEnabled=!wanted;renderRemoteMobileStatus(remoteMobileOnline);}
  }

  function rebuildRemoteStatusUi(badge){
    if(!badge)return null;
    badge.textContent='';
    badge.dataset.tfRemoteLayout='rev285-mini-left';
    badge.style.cssText='margin-top:5px;display:flex;align-items:center;font-size:9px;font-weight:700;line-height:1;min-height:13px;';

    const statusRow=document.createElement('div');
    statusRow.className='tf-remote-status-row';
    statusRow.style.cssText='display:inline-flex;align-items:center;gap:4px;min-height:13px;white-space:nowrap;';

    const dot=document.createElement('span');
    dot.className='tf-remote-mobile-live-dot';
    dot.style.cssText='width:5px;height:5px;border-radius:50%;display:inline-block;flex:0 0 5px;';

    const text=document.createElement('span');
    text.className='tf-remote-mobile-live-text';
    text.style.cssText='display:inline-block;min-width:0;font-size:9px;line-height:11px;';

    const toggle=document.createElement('button');
    toggle.id='tf-remote-availability-toggle';
    toggle.type='button';
    toggle.setAttribute('role','switch');
    toggle.setAttribute('aria-label','Remote ON OFF');
    toggle.style.cssText='width:19px;height:10px;border-radius:999px;border:1px solid rgba(248,113,113,.88);padding:1px;display:inline-flex;align-items:center;position:relative;cursor:pointer;transition:background .14s,border-color .14s;flex:0 0 19px;margin-right:1px;vertical-align:middle;box-sizing:border-box;';

    const knob=document.createElement('span');
    knob.className='tf-remote-availability-knob';
    knob.style.cssText='width:6px;height:6px;border-radius:50%;background:#fff;display:block;transition:transform .14s;box-shadow:0 1px 1px rgba(0,0,0,.42);flex:0 0 6px;';
    toggle.appendChild(knob);
    toggle.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setRemoteAvailabilityFromUi(!remoteAvailabilityEnabled);});

    statusRow.appendChild(toggle);
    statusRow.appendChild(dot);
    statusRow.appendChild(text);
    badge.appendChild(statusRow);
    lastBadgeState=null;
    return badge;
  }

  function ensureRemoteStatusUi(){
    const upgrades=Array.from(document.querySelectorAll('.tf-license-upgrade-link'));
    const upgrade=upgrades.find(isVisible) || upgrades[0] || null;
    if(!upgrade) return null;

    // REV354: tfRenderLicenseStatus() owns .tf-license-profile-info and
    // periodically replaces its innerHTML. Mounting the Remote badge inside
    // that subtree caused the badge/toggle to be deleted and recreated every
    // refresh cycle (visible as endless blinking). Keep Remote as a sibling of
    // the managed profile node so license refreshes cannot destroy it.
    const profileInfo=upgrade.closest('.tf-license-profile-info') || upgrade.parentElement;
    if(!profileInfo || !profileInfo.parentElement)return null;

    let badge=document.getElementById('tf-remote-mobile-live-status');
    if(!badge || !badge.isConnected){
      badge=document.createElement('div');
      badge.id='tf-remote-mobile-live-status';
      rebuildRemoteStatusUi(badge);
    }else{
      // REV285: force-migrate any old two-row/right-toggle layout.
      const statusRow=badge.querySelector('.tf-remote-status-row');
      const toggle=badge.querySelector('#tf-remote-availability-toggle');
      const oldRow=badge.querySelector('.tf-remote-toggle-row');
      const oldLabel=badge.querySelector('.tf-remote-availability-label');
      if(badge.dataset.tfRemoteLayout!=='rev285-mini-left' || !statusRow || !toggle || oldRow || oldLabel){
        rebuildRemoteStatusUi(badge);
      }
    }
    if(profileInfo.nextElementSibling !== badge){try{profileInfo.insertAdjacentElement('afterend',badge);}catch(_) {}}
    return badge;
  }

  function renderRemoteMobileStatus(online){
    remoteMobileOnline=!!online;
    const badge=ensureRemoteStatusUi();
    if(!badge)return;
    const next=remoteUiState();
    badge.dataset.tfState=next;lastBadgeState=next;
    const dot=badge.querySelector('.tf-remote-mobile-live-dot');
    const text=badge.querySelector('.tf-remote-mobile-live-text');
    const toggle=badge.querySelector('#tf-remote-availability-toggle');
    styleRemoteToggle(toggle);
    if(dot){
      const color=next==='online'?'#22c55e':next==='connecting'?'#f59e0b':'#ef4444';
      dot.style.background=color;
      dot.style.boxShadow='none';
    }
    if(text){
      const wanted=next==='online'?'REMOTE ONLINE':next==='connecting'?'REMOTE CONNECTING':'REMOTE OFFLINE';
      if(text.textContent!==wanted)text.textContent=wanted;
      text.style.color=next==='online'?'#86efac':next==='connecting'?'#fcd34d':'#fca5a5';
      text.title=browserCoreLastError||browserCoreConnectionState||'';
    }
  }

  async function retryStoredAck(a){
    const st=await storageGet([LAST_EXEC_KEY]);
    const rec=st[LAST_EXEC_KEY];
    if(!rec || !rec.id || rec.acked===true || !rec.result) return false;
    if(Date.now()-Number(rec.at||0)>5*60*1000) return false;
    const ack=await api('/remote/desktop-ack',{
      ...a,commandId:String(rec.id),success:!!rec.result.ok,result:rec.result
    });
    if(ack && ack.ack){
      rec.acked=true;rec.ackedAt=Date.now();
      await storageSet({[LAST_EXEC_KEY]:rec});
      return true;
    }
    return false;
  }

  async function processCommand(a,cmd){
    if(!remoteAvailabilityEnabled)return;
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
    timer=setTimeout(()=>{timer=null;void
~~~
## assets/927ecbd63036f61b.js

### tf_multi_analyst_export_v1 @ 134839
~~~js
T_SOURCES_KEY]: sources,
[TF_ANALYST_NAME_CACHE_KEY]: nameCache,
[TF_REMEMBERED_LINKS_KEY]: nextRemembered
};
if (prog)
payload.tfHistoryBatchProgressMap = prog;
if (overall)
payload.tfHistoryBatchOverallMap = overall;
await new Promise((resolve) => {
try {
chrome.storage.local.set(payload, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
resolve();
});
}
catch (e) {
resolve();
}
});
try {
if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
chrome.runtime.sendMessage({ type: 'open_or_reload_dashboard', activate: false }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
}
catch (e) { }
return { ok: true, urlKey, rawUrl };
}
catch (e) {
return { ok: false, urlKey: '', rawUrl: '' };
}
}

function tf_resetAnalystRowToBlank(row, containerId) {
try {
if (!row)
return;
const input = row.querySelector('.analyst-link-input');
if (input) {
input.value = '';
input.disabled = false;
input.readOnly = false;
input.removeAttribute('readonly');
}
try {
tf_setAnalystRowLocked(row, false);
}
catch (e) { }
const pasteBtn = row.querySelector('.analyst-paste-btn');
if (pasteBtn) {
try {
pasteBtn.classList.remove('tf-analyst-name-pill');
if (pasteBtn.dataset) {
delete pasteBtn.dataset.tfFullName;
}
}
catch (e) { }
pasteBtn.textContent = 'Paste';
pasteBtn.title = '';
pasteBtn.disabled = false;
}
const nameBtn = row.querySelector('.analyst-name-btn');
if (nameBtn) {
try {
if (nameBtn.dataset)
delete nameBtn.dataset.tfFullName;
}
catch (e) { }
nameBtn.textContent = '-';
nameBtn.title = '';
nameBtn.disabled = false;
}
const sel = row.querySelector('.analyst-pair-select');
if (sel) {
Array.from(sel.options || []).forEach((opt) => {
try {
opt.selected = String(opt.value || '') === ALL_PAIR_OPTION_VALUE;
}
catch (e) { }
});
sel.disabled = false;
}
const widget = row.querySelector('.pair-multiselect');
if (widget) {
widget.classList.remove('open');
widget.style.pointerEvents = '';
widget.style.opacity = '';
}
row.querySelectorAll('.pair-multiselect-dropdown input[type="checkbox"]').forEach((cb) => {
try {
cb.disabled = false;
cb.checked = String(cb.dataset && cb.dataset.value ? cb.dataset.value : '') === ALL_PAIR_OPTION_VALUE;
}
catch (e) { }
});
try {
if (containerId === 'analyst-links-container')
tf_forcePasteButtonInRow(row);
}
catch (e) { }
try {
initPairMultiSelectForRow(row);
}
catch (e) { }
}
catch (e) { }
}
function tf_removeMatchingAnalystUrlFromOtherUiRows(urlKey, excludedRow) {
try {
if (!urlKey)
return;
['analyst-links-container', 'isignal-links-container'].forEach((containerId) => {
const container = document.getElementById(containerId);
if (!container)
return;
const rows = Array.from(container.querySelectorAll('.analyst-row'));
const matches = rows.filter((row) => {
if (!row || row === excludedRow)
return false;
try {
const input = row.querySelector('.analyst-link-input');
const k = tf_normUrlKey(input && input.value ? String(input.value).trim() : '');
return !!k && k === urlKey;
}
catch (e) {
return false;
}
});
matches.forEach((row) => {
try {
const currentRows = Array.from(container.querySelectorAll('.analyst-row'));
if (currentRows.length <= 1)
tf_resetAnalystRowToBlank(row, containerId);
else
row.remove();
}
catch (e) { }
});
});
}
catch (e) { }
}
function tf_maybeExitAddModeAfterRowRemoval() {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([
TF_HAS_IMPORTED_BUNDLE_KEY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY
], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const locked = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
if (!locked)
return;
const baseMain = Math.max(0, parseInt(d && d[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] || 0, 10) || 0);
const baseIsignal = Math.max(0, parseInt(d && d[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] || 0, 10) || 0);
const mainContainer = document.getElementById('analyst-links-container');
const isignalContainer = document.getElementById('isignal-links-container');
const mainCount = mainContainer ? mainContainer.querySelectorAll('.analyst-row').length : 0;
const isignalCount = isignalContainer ? isignalContainer.querySelectorAll('.analyst-row').length : 0;
const noExtraMain = mainCount <= baseMain;
const noExtraIsignal = isignalCount <= baseIsignal;
if (!noExtraMain || !noExtraIsignal)
return;
chrome.storage.local.set({
[TF_IMPORT_LOCK_ENGAGED_KEY]: false,
[TF_IMPORT_LOCKED_SIGS_KEY]: [],
[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY]: 0,
[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY]: 0
}, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
try {
tf_addModeEngaged = false;
tf_addModeSigSet = new Set();
}
catch (e) { }
try {
[mainContainer, isignalContainer].forEach((container) => {
if (!container)
return;
Array.from(container.querySelectorAll('.analyst-row')).forEach((row) => tf_setAnalystRowLocked(row, false));
});
}
catch (e) { }
try {
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
tf_setUpdateButtonsEnabled(hasImp, false);
tf_syncAddModeScanPairLinkLabels();
}
catch (e) { }
try {
setStatus('Row tambahan sudah dihapus. Tombol Update aktif kembali.');
}
catch (e) { }
});
});
}
catch (e) { }
}

function tf_normalizeTfAccountUrl(raw) {
try {
if (!raw)
return null;
let s = String(raw).trim();
if (!s)
return null;
s = s.replace(/^[\s"'`]+/, '').replace(/[\s"'`]+$/, '');
if (/^\/?channels\//i.test(s)) {
s = 'https://account.tradersfamily.id/' + s.replace(/^\/+/, '');
}
if (/^account\.tradersfamily\.id\//i.test(s)) {
s = 'https://' + s;
}
if (/^https?:\/\/(www\.)?tradersfamily\.id\/channels\//i.test(s)) {
s = s.replace(/^https?:\/\/(www\.)?tradersfamily\.id\//i, 'https://account.tradersfamily.id/');
}
const u = new URL(s);
const hostOk = (u.hostname || '').toLowerCase() === 'account.tradersfamily.id';
const pathOk = (u.pathname || '').toLowerCase().startsWith('/channels/');
if (!hostOk || !pathOk)
return null;
u.protocol = 'https:';
u.hash = '';
return u.toString();
}
catch (e) {
return null;
}
}
function tf_strictActiveTabChannelUrl(raw) {
try {
if (!raw)
return null;
const s = String(raw).trim();
if (!s)
return null;
const u = new URL(s);
const hostOk = (u.hostname || '').toLowerCase() === 'account.tradersfamily.id';
const path = (u.pathname || '');
const pathLower = path.toLowerCase();
if (!hostOk)
return null;
if (!pathLower.startsWith('/channels/'))
return null;
const segs = path.split('/').filter(Boolean);
if (!segs || segs.length < 2)
return null;
if ((segs[0] || '').toLowerCase() !== 'channels')
return null;
const idSeg = String(segs[1] || '').trim();
if (!/^\d+$/.test(idSeg))
return null;
u.protocol = 'https:';
u.hash = '';
return u.toString();
}
catch (e) {
return null;
}
}
function setIsignalStatus(text) {
const el = document.getElementById('isignal-status');
if (el) {
const nextText = text || '';
if (el.textContent !== nextText) {
el.textContent = nextText;
}
}
}
const TF_STOP_LABEL = 'Stop Progress!';
const TF_EXPORT_SCHEMA = 'tf_multi_analyst_export_v1';
const TF_SELECTED_TIME_RANGE_KEY = 'tfSelectedTimeRange';
const TF_ANALYST_SOURCES_KEY = 'tfAnalystSources';
const TF_ANALYST_NAME_CACHE_KEY = 'tfAnalystNameCacheByUrl';
const TF_REMEMBERED_LINKS_KEY = 'tfRememberedAnalystLinks';
const TF_REMEMBER_LINKS_ENABLED_KEY = 'tfRememberLinksEnabled';
let __tfStableAnalystNameByUrl = Object.create(null);
let __tfSavedChannelsRefreshTimer = null;
const TF_HAS_IMPORTED_BUNDLE_KEY = 'tfHasImportedBundle';
const TF_IMPORT_LOCK_ENGAGED_KEY = 'tfImportLockEngaged';
const TF_IMPORT_LOCKED_SIGS_KEY = 'tfImportLockedSigs';
const TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY = 'tfImportLockBaselineMainCount';
const TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY = 'tfImportLockBaselineIsignalCount';
let tf_addModeEngaged = false;
let tf_addModeSigSet = new Set();
let tf_addModeScanLinksManuallyHidden = false;
const TF_ALL_ANALYST_PAIRS_KEY_LEGACY = 'tfAllAnalystPairs';
const TF_ALL_ANALYST_PAIRS_KEY_MAIN = 'tfAllAnalystPairsMain';
const TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL = 'tfAllAnalystPairsIsignal';
const TF_EXPORT_LOCALSTORAGE_KEYS = [
'tf_equity_metric',
'tf_risk_mode',
'tf_compound_months',
'tf_current_balance',
'tf_current_risk_percent',
'tf_risk_overrides',
'tf_sl_type_selection'
];
const TF_EXPORT_STORAGE_KEYS = [
'tfMonthlyStats',
'tfHistorySignals',
'tfScoreHistory',
'tfNoDataPairs',
'tfAvgSlPips',
TF_ANALYST_SOURCES_KEY,
TF_ANALYST_NAME_CACHE_KEY,
TF_REMEMBERED_LINKS_KEY,
TF_REMEMBER_LINKS_ENABLED_KEY,
TF_ALL_ANALYST_PAIRS_KEY_MAIN,
TF_ALL_ANALYST_PAIRS_KEY_ISIGNAL,
TF_ALL_ANALYST_PAIRS_KEY_LEGACY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCKED_SIGS_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY,
TF_SELECTED_TIME_RANGE_KEY
];
const TF_TIME_RANGE_LABELS = {
m3: '3 Month',
m6: '6 Month',
y1: '1 Year',
y2: '2 Year',
y3: '3 Year',
y5: '5 Year',
all_time: 'ALL'
};
function tf_timeRangeLabel(v) {
const key = v ? String(v) : 'all_time';
return TF_TIME_RANGE_LABELS[key] || 'ALL';
}
function tf_isPlaceholderAnalystName(name) {
const s = String(name || '').trim();
if (!s)
return true;
if (/^imported$/i.test(s))
return true;
if (/^link\s*\d*$/i.test(s))
return true;
if (/^channel\s*(?:\d+|id|"id"|'id')$/i.test(s))
return true;
if (/^https?:\/\//i.test(s))
return true;
return false;
}
function tf_stableJson(value) {
try {
if (Array.isArray(value))
return '[' + value.map((item) => tf_stableJson(item)).join(',') + ']';
if (value && typeof value === 'object') {
const keys = Object.keys(value).sort();
return '{' + keys.map((key) => JSON.stringify(key) + ':' + tf_stableJson(value[key])).join(',') + '}';
}
return JSON.stringify(value);
}
catch (e) {
try {
return JSON.stringify(value);
}
catch (err) {
return String(value);
}
}
}
function tf_getStableAnalystUrlKey(rawUrl) {
try {
return tf_normalizeTfAccountUrl(rawUrl) || '';
}
catch (e) {
return '';
}
}
function tf_rememberStableAnalystName(rawUrl, rawName, persist = true) {
try {
const urlKey = tf_getStableAnalystUrlKey(rawUrl);
const name = String(rawName || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return false;
const previous = String(__tfStableAnalystNameByUrl[urlKey] || '').trim();
if (previous === name)
return false;
__tfStableAnalystNameByUrl[urlKey] = name;
if (persist && hasChromeStorage()) {
chrome.storage.local.get([TF_ANALYST_NAME_CACHE_KEY], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const current = data && data[TF_ANALYST_NAME_CACHE_KEY] && typeof data[TF_ANALYST_NAME_CACHE_KEY] === 'object'
? { ...data[TF_ANALYST_NAME_CACHE_KEY] }
: {};
if (String(current[urlKey] || '').trim() === name)
return;
current[urlKey] = name;
chrome.storage.local.set({ [TF_ANALYST_NAME_CACHE_KEY]: current }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
});
}
return true;
}
catch (e) {
return false;
}
}
function tf_mergeNameCacheIntoMaps(nameMaps, cache) {
const maps = nameMaps || { byUrl: {}, byChannelId: {} };
try {
if (cache && typeof cache === 'object') {
Object.keys(cache).forEach((rawUrl) => {
const urlKey = tf_getStableAnalystUrlKey(rawUrl);
const name = String(cache[rawUrl] || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return;
__tfStableAnalystNameByUrl[urlKey] = name;
maps.byUrl[urlKey] = name;
const mm = String(urlKey).match(/\/channels\/(\d+)/i);
if (mm && mm[1])
maps.byChannelId[String(mm[1])] = name;
});
}
Object.keys(__tfStableAnalystNameByUrl || {}).forEach((urlKey) => {
const name = String(__tfStableAnalystNameByUrl[urlKey] || '').trim();
if (!urlKey || tf_isPlaceholderAnalystName(name))
return;
maps.byUrl[urlKey] = name;
const mm = String(urlKey).match(/\/channels\/(\d+)/i);
if (mm && mm[1])
maps.byChannelId[String(mm[1])] = name;
});
}
catch (e) { }
return maps;
}
function tf_buildNameMapsFromSources(sources) {
const byUrl = {};
const byChannelId = {};
try {
if (sources && typeof sources === 'object') {
Object.keys(sources).forEach((nm) => {
try {
const it = sources[nm] || {};
const urlNorm = tf_normalizeTfAccountUrl(it.url || it.link || '');
const name = String(nm || '').trim();
if (!urlNorm || tf_isPlaceholderAnalystName(name))
return;
byUrl[urlNorm] = name;
const mm = String(urlNorm).match(/\/channels\/(\d+)/i);
if (mm && mm[1])
byChannelId[String(mm[1])] = name;
}
catch (e) { }
});
}
}
catch (e) { }
return { byUrl, byChannelId };
}
function tf_resolveAnalystNameForUrl(rawUrl, nameMaps) {
try {
const urlNorm = tf_normalizeTfAccountUrl(rawUrl);
if (!urlNorm)
return '';
const maps = nameMaps || { byUrl: {}, byChannelId: {} };
if (maps.byUrl && maps.byUrl[urlNorm])
return String(maps.byUrl[urlNorm]).trim();
const mm = String(urlNorm).match(/\/channels\/(\d+)/i);
const cid = (mm && mm[1]) ? String(mm[1]) : '';
if (cid && maps.byChannelId && maps.byChannelId[cid])
return String(maps.byChannelId[cid]).trim();
return '';
}
catch (e) {
return '';
}
}
function tf_enrichRememberedLinksWithNames(rememberedLinks, sources) {
try {
if (!Array.isArray(rememberedLinks))
return rememberedLinks;
const maps = tf_buildNameMapsFromSources(sources);
return rememberedLinks.map((it, idx) => {
const obj = (it && typeof it === 'object') ? { ...it } : { url: String(it || '') };
const url = obj.url ? String(obj.url).trim() : '';
let nm = obj.name || obj.analystName || obj.analis || obj.label || '';
nm = String(nm || '').trim();
if (tf_isPlaceholderAnalystName(nm))
nm = '';
if (!nm)
nm = tf_resolveAnalystNameForUrl(url, maps);
if (nm) {
obj.name = nm;
obj.analystName = nm;
}
else {
try {
delete obj.name;
}
catch (e) { }
}
if (!Array.isArray(obj.pairs) || !obj.pairs.length)
obj.pairs = ['__ALL__'];
if (!nm && url) {
const uNorm = tf_normalizeTfAccountUrl(url);
const mm = uNorm ? String(uNorm).match(/\/channels\/(\d+)/i) : null;
if (mm && mm[1])
obj._fallbackLabel = `Channel ${mm[1]}`;
else
obj._fallbackLabel = `Link ${idx + 1}`;
}
return obj;
});
}
catch (e) {
return rememberedLinks;
}
}
function tf_truncAnalystName10(name) {
try {
const s = String(name || '').trim();
if (!s)
return '';
if (s.length <= 10)
return s;
return s.slice(0, 10);
}
catch (e) {
return '';
}
}
function tf_applyAnalystNameToPasteButton(pasteBtn, name) {
if (!pasteBtn)
return;
const nm = String(name || '').trim();
if (!nm)
return;
try {
pasteBtn.classList.add('tf-analyst-name-pill');
try {
if (pasteBtn.dataset)
pasteBtn.dataset.tfFullName = nm;
}
catch (e) { }
pasteBtn.textContent = tf_truncAnalystName10(nm);
pasteBtn.title = nm;
pasteBtn.disabled = false;
}
catch (e) { }
}
function tf_applyAnalystNameToSidebarByUrl(rawUrl, name) {
try {
const nm = String(name || '').trim();
if (!nm)
return false;
if (tf_isPlaceholderAnalystName(nm))
return false;
const normUrl = tf_normalizeTfAccountUrl(rawUrl);
if (!normUrl)
return false;
try {
tf_rememberStableAnalystName(normUrl, nm, true);
}
catch (e) { }
const key = tf_normUrlKey(normUrl);
if (!key)
return false;
let did = false;
const updateContainer = (containerId) => {
const c = document.getElementById(containerId);
if (!c)
return;
const rows = Array.from(c.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
try {
const input = row.querySelector('.analyst-link-input');
const u = input && input.value ? String(input.value).trim() : '';
const k = tf_normUrlKey(u);
if (!k || k !== key)
return;
const pasteBtn = row.querySelector('.analyst-paste-btn');
if (pasteBtn) {
tf_applyAnalystNameToPasteButton(pasteBtn, nm);
did = true;
}
const nameBtn = row.querySelector('.analyst-name-btn');
if (nameBtn) {
try {
if (nameBtn.dataset)
nameBtn.dataset.tfFullName = nm;
}
catch (e) { }
nameBtn.textContent = tf_truncAnalystName10(nm);
nameBtn.title = nm;
nameBtn.disabled = false;
did = true;
}
}
catch (e) { }
});
};
updateContainer('analyst-links-container');
updateContainer('isignal-links-container');
return did;
}
catch (e) {
return false;
}
}
let __tfRememberedLinksSaveTimer = null;
function tf_scheduleSaveRememberedLinks() {
try {
if (__tfRememberedLinksSaveTimer)
return;
__tfRememberedLinksSaveTimer = setTimeout(() => {
__tfRememberedLinksSaveTimer = null;
try {
saveRememberedAnalystLinks();
}
catch (e) { }
}, 300);
}
catch (e) { }
}
function tf_reloadAnalystNamesInSidebarUI(cb) {
try {
if (!hasChromeStorage()) {
if (typeof cb === 'function')
cb();
return;
}
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_ANALYST_NAME_CACHE_KEY, TF_REMEMBERED_LINKS_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] ? d[TF_ANALYST_SOURCES_KEY] : null;
const remembered = Array.isArray(d && d[TF_REMEMBERED_LINKS_KEY]) ? d[TF_REMEMBERED_LINKS_KEY] : [];
const nameCache = d && d[TF_ANALYST_NAME_CACHE_KEY] && typeof d[TF_ANALYST_NAME_CACHE_KEY] === 'object' ? d[TF_ANALYST_NAME_CACHE_KEY] : {};
const maps = tf_mergeNameCacheIntoMaps(tf_buildNameMapsFromSources(sources), nameCache);
const updateContainer = (containerId) => {
const c = document.getElementById(containerId);
if (!c)
return;
const rows = Array.from(c.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
try {
const input = row.querySelector('.analyst-link-input');
const pasteBtn = row.querySelector('.analyst-paste-btn');
const nameBtn = row.querySelector('.analyst-name-btn');
const rawUrl = input && input.value ? String(input.value).trim() : '';
if (!rawUrl)
return;
const nm = tf_resolveAnalystNameForUrl(rawUrl, maps);
if (nm) {
if (pasteBtn)
tf_applyAnalystNameToPasteButton(pasteBtn, nm);
if (nameBtn) {
try {
if (nameBtn.dataset)
nameBtn.dataset.tfFullName = nm;
}
catch (e) { }
nameBtn.textContent = tf_truncAnalystName10(nm);
nameBtn.title = nm;
nameBtn.disabled = false;
}
}
}
catch (e) { }
});
};
updateContainer('analyst-links-container');
updateContainer('isignal-links-container');
const enriched = tf_enrichRememberedLinksWithNames(remembered, sources);
try {
if (tf_stableJson(enriched) === tf_stableJson(remembered)) {
if (typeof cb === 'function')
cb();
}
else {
chrome.storage.local.set({ [TF_REMEMBERED_LINKS_KEY]: enriched }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
if (typeof cb === 'function')
cb();
});
}
}
catch (e) {
if (typeof cb === 'function')
cb();
}
});
}
catch (e) {
if (typeof cb === 'function')
cb();
}
}
function tf_normPairsForSig(pairs) {
try {
const arr = Array.isArray(pairs) ? pairs.slice() : [];
const cleaned = arr
.map((p) => String(p || '').toUpperCase().trim())
.filter((p) => p);
if (!cleaned.length)
return ['__ALL__'];
if (cleaned.includes('__ALL__'))
return ['__ALL__'];
cleaned.sort();
return cleaned;
}
catch (e) {
return ['__ALL__'];
}
}
function tf_makeChannelSig(url, pairs) {
const u = tf_normalizeTfAccountUrl(url);
if (!u)
return null;
const ps = tf_normPairsForSig(pairs);
return u + '|' + ps.join(',');
}
function tf_computeRowSig(row) {
try {
if (!row)
return null;
const input = row.querySelector('.analyst-link-input');
const select = row.querySelector('.analyst-pair-select');
const rawUrl = input && input.value ? String(input.value).trim() : '';
if (!rawUrl)
return null;
const normUrl = tf_normalizeTfAccountUrl(rawUrl);
if (!normUrl)
return null;
const pairs = getSelectedPairsFromSelect(select);
return tf_makeChannelSig(normUrl, pairs);
}
catch (e) {
return null;
}
}
function tf_setAnalystRowLocked(row, locked) {
try {
if (!row)
return;
if (row.dataset)
row.dataset.tfLocked = locked ? '1' : '0';
row.classList.toggle('tf-row-locked', !!locked);
const input = row.querySelector('.analyst-link-input');
if (input) {
input.disabled = false;
input.readOnly = !!locked;
if (locked)
input.setAttribute('readonly', 'readonly');
else
input.removeAttribute('readonly');
}
const pasteBtn = row.querySelector('.analyst-paste-btn');
if (pasteBtn)
pasteBtn.disabled = false;
const removeBtn = row.querySelector('.analyst-remove-btn');
if (removeBtn)
removeBtn.disabled = false;
const select = row.querySelector('.analyst-pair-select');
if (select)
select.disabled = false;
const widget = row.querySelector('.pair-multiselect');
if (widget) {
widget.style.pointerEvents = '';
widget.style.opacity = '';
}
const cbs = row.querySelectorAll('.pair-multiselect-dropdown input[type=checkbox]');
cbs.forEach((cb) => {
cb.disabled = !!locked;
});
}
catch (e) { }
}
function tf_setTimeRangeLocked(locked) {
try {
const ids = ['main', 'masuk', 'isignal'];
ids.forEach((k) => {
const toggle = document.getElementById('tf-tr-toggle-' + k);
const panel = document.getElementById('tf-tr-panel-' + k);
if (toggle) {
try {
toggle.disabled = false;
}
catch (e) { }
toggle.title = locked ? 'Add-mode aktif (Import lock). Time Range tetap bisa dipilih.' : '';
try {
toggle.classList.toggle('tf-tr-soft-locked', !!locked);
}
catch (e) { }
}
if (panel) {
const opts = panel.querySelectorAll('.tf-tr-option');
opts.forEach((b) => {
try {
b.disabled = false;
}
catch (e) { }
});
}
});
}
catch (e) { }
}
function tf_setAddModeSecondaryActionsVisible(visible) {
try {
const on = !!visible;
if (!on)
tf_addModeScanLinksManuallyHidden = false;
const showClose = on && !tf_addModeScanLinksManuallyHidden;
['main', 'masuk', 'isignal'].forEach((k) => {
co
~~~

### TF_EXPORT_STORAGE_KEYS @ 183878
~~~js
l = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const pairs = Array.isArray(it && it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
return url ? { name: `Link ${idx + 1}`, url, pairs } : null;
})
.filter(Boolean);
}
}
catch (e) { }
return channels;
}
function tf_engageAddAnalystMode(cb, baselineCounts) {
try {
if (!hasChromeStorage()) {
tf_softResetUiNow();
tf_reloadDashboardTabs();
return;
}
chrome.storage.local.get([TF_HAS_IMPORTED_BUNDLE_KEY, TF_IMPORT_LOCK_ENGAGED_KEY, TF_ANALYST_SOURCES_KEY, TF_REMEMBERED_LINKS_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const already = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
if (already) {
try {
tf_setUpdateButtonsEnabled(hasImp, true);
}
catch (e) { }
try {
tf_addModeEngaged = true;
}
catch (e) { }
try {
tf_applyImportLockFromStorageToUI();
}
catch (e) { }
if (typeof cb === 'function')
cb();
return;
}
const channels = tf_collectChannelsFromStorage(d);
const sigs = tf_buildBaselineSigsFromChannels(channels);
let baseMainCount = 0;
let baseIsignalCount = 0;
try {
if (baselineCounts && typeof baselineCounts === 'object') {
baseMainCount = parseInt(baselineCounts.main || 0, 10) || 0;
baseIsignalCount = parseInt(baselineCounts.isignal || 0, 10) || 0;
}
else {
const c1 = document.getElementById('analyst-links-container');
const c2 = document.getElementById('isignal-links-container');
baseMainCount = c1 ? (c1.querySelectorAll('.analyst-row').length || 0) : 0;
baseIsignalCount = c2 ? (c2.querySelectorAll('.analyst-row').length || 0) : 0;
}
}
catch (e) { }
baseMainCount = Math.max(0, baseMainCount);
baseIsignalCount = Math.max(0, baseIsignalCount);
chrome.storage.local.set({
[TF_IMPORT_LOCK_ENGAGED_KEY]: true,
[TF_IMPORT_LOCKED_SIGS_KEY]: sigs,
[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY]: baseMainCount,
[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY]: baseIsignalCount
}, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
try {
tf_setUpdateButtonsEnabled(hasImp, true);
}
catch (e) { }
try {
tf_addModeEngaged = true;
tf_addModeSigSet = new Set(sigs);
}
catch (e) { }
try {
tf_applyImportLockFromStorageToUI();
}
catch (e) { }
try {
tf_syncAddModeScanPairLinkLabels();
}
catch (e) { }
if (typeof cb === 'function')
cb();
});
});
}
catch (e) {
if (typeof cb === 'function')
cb();
}
}
function tf_filterChannelsByAddMode(channels) {
try {
if (!Array.isArray(channels) || !channels.length)
return [];
if (!tf_addModeEngaged || !(tf_addModeSigSet && tf_addModeSigSet.size)) {
const seen = new Set();
const out = [];
channels.forEach((ch) => {
if (!ch || !ch.url)
return;
const url = String(ch.url);
let pairs = Array.isArray(ch.pairs) ? ch.pairs.slice() : [];
pairs = pairs.filter((p) => !!p);
if (!pairs.length)
pairs = ['__ALL__'];
if (pairs.includes('__ALL__')) {
const sig = tf_makeUrlPairSig(url, '__ALL__');
if (sig && !seen.has(sig)) {
seen.add(sig);
out.push({ ...ch, pairs: ['__ALL__'] });
}
return;
}
const uniq = [];
pairs.forEach((p) => {
const sig = tf_makeUrlPairSig(url, String(p));
if (sig && !seen.has(sig)) {
seen.add(sig);
uniq.push(String(p));
}
});
if (uniq.length)
out.push({ ...ch, pairs: uniq });
});
return out;
}
const baseSet = tf_addModeSigSet;
const seen = new Set();
const seenUrlAll = new Set();
const out = [];
channels.forEach((ch) => {
if (!ch || !ch.url)
return;
const url = String(ch.url);
let pairs = Array.isArray(ch.pairs) ? ch.pairs.slice() : [];
pairs = pairs.filter((p) => !!p);
if (!pairs.length)
pairs = ['__ALL__'];
if (baseSet.has(tf_makeUrlPairSig(url, '__ALL__')))
return;
if (pairs.includes('__ALL__')) {
for (const sig of baseSet) {
if (sig && sig.startsWith(url + '::'))
return;
}
const sigAll = tf_makeUrlPairSig(url, '__ALL__');
if (!sigAll)
return;
if (seenUrlAll.has(url) || seen.has(sigAll))
return;
seenUrlAll.add(url);
seen.add(sigAll);
out.push({ ...ch, pairs: ['__ALL__'] });
return;
}
const uniqPairs = [];
pairs.forEach((pRaw) => {
const p = String(pRaw);
const sig = tf_makeUrlPairSig(url, p);
if (!sig)
return;
if (baseSet.has(sig))
return;
if (seenUrlAll.has(url))
return;
if (seen.has(sig))
return;
seen.add(sig);
uniqPairs.push(p);
});
if (!uniqPairs.length)
return;
out.push({ ...ch, pairs: uniqPairs });
});
return out;
}
catch (e) {
return Array.isArray(channels) ? channels : [];
}
}
function tf_collectRememberedLinksUiSnapshotForExport() {
try {
const containers = [
document.getElementById('analyst-links-container'),
document.getElementById('isignal-links-container')
].filter(Boolean);
const byUrl = new Map();
containers.forEach((container) => {
const rows = Array.from(container.querySelectorAll('.analyst-row'));
rows.forEach((row) => {
try {
const input = row.querySelector('.analyst-link-input');
const url = input ? String(input.value || '').trim() : '';
if (!url)
return;
let nm = '';
try {
const nameBtn = row.querySelector('.analyst-paste-btn, .analyst-name-btn, .tf-analyst-name-pill');
if (nameBtn) {
if (nameBtn.dataset && nameBtn.dataset.tfFullName)
nm = String(nameBtn.dataset.tfFullName || '').trim();
if (!nm && nameBtn.title)
nm = String(nameBtn.title || '').trim();
if (!nm)
nm = String(nameBtn.textContent || '').trim();
}
if (nm === 'Paste' || nm === 'Channel' || nm === 'Nama' || nm === '-' || tf_isPlaceholderAnalystName(nm))
nm = '';
}
catch (e) {
nm = '';
}
const sel = row.querySelector('.analyst-pair-select');
let pairs = [];
if (sel) {
pairs = Array.from(sel.options || [])
.filter((o) => o && o.selected)
.map((o) => String(o.value || '').trim())
.filter(Boolean);
if (!pairs.length || pairs.includes(ALL_PAIR_OPTION_VALUE))
pairs = [];
else
pairs = pairs.filter((pair) => pair !== ALL_PAIR_OPTION_VALUE);
}
const key = tf_normUrlKey(url) || url;
const previous = byUrl.get(key) || null;
const candidate = { url, pairs };
if (nm) {
candidate.name = nm;
candidate.analystName = nm;
}
if (!previous) {
byUrl.set(key, candidate);
return;
}
const previousSpecific = Array.isArray(previous.pairs) && previous.pairs.length > 0;
const candidateSpecific = Array.isArray(candidate.pairs) && candidate.pairs.length > 0;
if (candidateSpecific || !previousSpecific) {
const merged = { ...previous, ...candidate, pairs: candidate.pairs.slice() };
if (!candidate.name && previous.name) {
merged.name = previous.name;
merged.analystName = previous.analystName || previous.name;
}
byUrl.set(key, merged);
}
else if (!previous.name && candidate.name) {
byUrl.set(key, { ...previous, name: candidate.name, analystName: candidate.analystName || candidate.name });
}
}
catch (e) { }
});
});
return Array.from(byUrl.values()).map((item) => ({
...item,
pairs: Array.isArray(item && item.pairs) ? item.pairs.slice() : []
}));
}
catch (e) {
return [];
}
}
function tf_exportScanDataNow() {
try {
if (!hasChromeStorage()) {
alert('Chrome Storage tidak tersedia.');
return;
}
const exportUiSnapshot = tf_collectRememberedLinksUiSnapshotForExport();
try {
saveRememberedAnalystLinks();
}
catch (e) { }
setStatus('Exporting...');
chrome.storage.local.get([...TF_EXPORT_STORAGE_KEYS, 'tfUserProfile', 'tfLastScanMeta', 'tfLastImportMeta'], (data) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
try {
const uiSnapshot = Array.isArray(exportUiSnapshot)
? exportUiSnapshot.map((it) => ({
...it,
pairs: Array.isArray(it && it.pairs) ? it.pairs.slice() : []
}))
: null;
if (uiSnapshot) {
data[TF_REMEMBERED_LINKS_KEY] = uiSnapshot;
const sourceMap = data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object'
? data[TF_ANALYST_SOURCES_KEY]
: null;
if (sourceMap) {
const pairsByUrl = new Map();
uiSnapshot.forEach((it) => {
try {
const key = tf_normUrlKey(it && it.url ? it.url : '');
if (!key)
return;
const pairs = Array.isArray(it && it.pairs) && it.pairs.length
? it.pairs.slice()
: [ALL_PAIR_OPTION_VALUE];
pairsByUrl.set(key, pairs);
}
catch (e) { }
});
Object.keys(sourceMap).forEach((name) => {
try {
const item = sourceMap[name] || {};
const key = tf_normUrlKey(item.url || item.link || '');
if (key && pairsByUrl.has(key)) {
sourceMap[name] = { ...item, pairs: pairsByUrl.get(key).slice() };
}
}
catch (e) { }
});
}
}
}
catch (e) { }
const profile = data && data.tfUserProfile ? data.tfUserProfile : null;
const importedBy = data && data.tfLastImportMeta && data.tfLastImportMeta.exportedBy
? data.tfLastImportMeta.exportedBy
: null;
const importedByList = data && data.tfLastImportMeta && Array.isArray(data.tfLastImportMeta.exportedByList)
? data.tfLastImportMeta.exportedByList
: [];
const scannedBy = data && data.tfLastScanMeta && data.tfLastScanMeta.scannedBy
? data.tfLastScanMeta.scannedBy
: null;
const scannedByList = data && data.tfLastScanMeta && Array.isArray(data.tfLastScanMeta.scannedByList)
? data.tfLastScanMeta.scannedByList
: [];
const tfOwnerKey = (owner) => {
try {
const n = owner && owner.name ? String(owner.name).trim().toLowerCase() : '';
const e = owner && owner.email ? String(owner.email).trim().toLowerCase() : '';
return e || n;
}
catch (e) { return ''; }
};
const fixedScanOwners = [];
const tfPushOwner = (owner) => {
if (!owner || typeof owner !== 'object')
return;
const item = {
name: owner.name ? String(owner.name).trim() : '',
email: owner.email ? String(owner.email).trim() : '',
avatarUrl: owner.avatarUrl ? String(owner.avatarUrl) : ''
};
if (!item.name && !item.email)
return;
const key = tfOwnerKey(item);
if (fixedScanOwners.some((x) => tfOwnerKey(x) === key))
return;
fixedScanOwners.push(item);
};
importedByList.forEach(tfPushOwner);
tfPushOwner(importedBy);
scannedByList.forEach(tfPushOwner);
tfPushOwner(scannedBy);
if (!fixedScanOwners.length)
tfPushOwner(profile);
const fixedScanOwner = fixedScanOwners.length ? fixedScanOwners[0] : null;
try {
if (data && Object.prototype.hasOwnProperty.call(data, 'tfUserProfile'))
delete data.tfUserProfile;
if (data && Object.prototype.hasOwnProperty.call(data, 'tfLastScanMeta'))
delete data.tfLastScanMeta;
if (data && Object.prototype.hasOwnProperty.call(data, 'tfLastImportMeta'))
delete data.tfLastImportMeta;
}
catch (e) { }
try {
const sources = data && data[TF_ANALYST_SOURCES_KEY] ? data[TF_ANALYST_SOURCES_KEY] : null;
if (data && Array.isArray(data[TF_REMEMBERED_LINKS_KEY])) {
const enriched = tf_enrichRememberedLinksWithNames(data[TF_REMEMBERED_LINKS_KEY], sources);
data[TF_REMEMBERED_LINKS_KEY] = enriched;
try {
chrome.storage.local.set({ [TF_REMEMBERED_LINKS_KEY]: enriched }, () => { try {
void chrome.runtime.lastError;
}
catch (e) { } });
}
catch (e) { }
}
}
catch (e) { }
try {
const remembered0 = data && Array.isArray(data[TF_REMEMBERED_LINKS_KEY]) ? data[TF_REMEMBERED_LINKS_KEY] : null;
const sources0 = data && data[TF_ANALYST_SOURCES_KEY] && typeof data[TF_ANALYST_SOURCES_KEY] === 'object' ? data[TF_ANALYST_SOURCES_KEY] : null;
if (remembered0 && remembered0.length && sources0) {
const allowed = new Set();
remembered0.forEach((it) => {
try {
const u = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const k = u ? tf_normUrlKey(u) : '';
if (k)
allowed.add(k);
}
catch (e) { }
});
const filtered = {};
Object.keys(sources0).forEach((nm) => {
try {
const it = sources0[nm] || {};
const u = tf_normalizeTfAccountUrl(it.url || it.link || '');
const k = u ? tf_normUrlKey(u) : '';
if (k && allowed.has(k))
filtered[nm] = it;
}
catch (e) { }
});
data[TF_ANALYST_SOURCES_KEY] = filtered;
}
}
catch (e) { }
const payload = {
schema: TF_EXPORT_SCHEMA,
exportedAt: new Date().toISOString(),
exportedBy: fixedScanOwner ? {
name: fixedScanOwner.name || '',
email: fixedScanOwner.email || '',
avatarUrl: fixedScanOwner.avatarUrl || ''
} : null,
exportedByList: fixedScanOwners.map((owner) => ({
name: owner.name || '',
email: owner.email || '',
avatarUrl: owner.avatarUrl || ''
})),
localState: tf_collectLocalStateForExport(),
storage: (() => {
try {
const s = Object.assign({}, (data || {}));
try {
if (Object.prototype.hasOwnProperty.call(s, 'tfUserProfile'))
delete s.tfUserProfile;
}
catch (e) { }
return s;
}
catch (e) {
return (data || {});
}
})()
};
const name = `tf_scan_export_${tf_makePrettyFilenameTimestamp()}.json`;
tf_downloadJsonFile(name, payload);
setStatus('Export selesai ✅');
});
}
catch (e) {
setStatus('Export gagal');
}
}

function tf_cloneJsonSafe(value, fallback) {
try {
return JSON.parse(JSON.stringify(value));
}
catch (e) {
return fallback;
}
}
function tf_ownerListFromPayload(payload) {
const out = [];
const keyOf = (o) => {
try {
const e = o && o.email ? String(o.email).trim().toLowerCase() : '';
const n = o && o.name ? String(o.name).trim().toLowerCase() : '';
return e || n;
}
catch (e) { return ''; }
};
const push = (o) => {
if (!o || typeof o !== 'object')
return;
const item = {
name: o.name ? String(o.name).trim() : '',
email: o.email ? String(o.email).trim() : '',
avatarUrl: o.avatarUrl ? String(o.avatarUrl) : ''
};
if (!item.name && !item.email)
return;
const k = keyOf(item);
if (out.some((x) => keyOf(x) === k))
return;
out.push(item);
};
try {
(Array.isArray(payload && payload.exportedByList) ? payload.exportedByList : []).forEach(push);
push(payload && payload.exportedBy ? payload.exportedBy : null);
const storage = payload && payload.storage && typeof payload.storage === 'object' ? payload.storage : null;
const metas = [
storage && storage.tfLastImportMeta ? storage.tfLastImportMeta : null,
storage && storage.tfLastScanMeta ? storage.tfLastScanMeta : null,
payload && payload.tfLastImportMeta ? payload.tfLastImportMeta : null,
payload && payload.tfLastScanMeta ? payload.tfLastScanMeta : null
];
metas.forEach((meta) => {
(Array.isArray(meta && meta.exportedByList) ? meta.exportedByList : []).forEach(push);
push(meta && meta.exportedBy ? meta.exportedBy : null);
(Array.isArray(meta && meta.scannedByList) ? meta.scannedByList : []).forEach(push);
push(meta && meta.scannedBy ? meta.scannedBy : null);
});
}
catch (e) { }
return out;
}
function tf_historyCombineKey(it) {
try {
const norm = (v) => String(v == null ? '' : v).trim().replace(/\s+/g, ' ');
const normNumberLike = (v) => {
const raw = norm(v);
if (!raw)
return '';
const n = Number(raw.replace(/,/g, ''));
return Number.isFinite(n) ? String(Math.round(n * 100000) / 100000) : raw.toLowerCase();
};
const analyst = norm(it && it.analyst).toLowerCase();
const pair = norm(it && it.pair).toUpperCase();
const created = norm((it && (it.createdSortKey != null ? it.createdSortKey : it.createdDate)) || '').toLowerCase();
const closed = norm((it && (it.sortKey != null ? it.sortKey : it.displayDate)) || '').toLowerCase();
const signalId = norm(it && it.signalId).toLowerCase();
// Created At + Closed At are always the core identity. signalId (when present)
// prevents two legitimate signals with the exact same timestamps from being merged.
if (signalId)
return [analyst, pair, created, closed, 'signal:' + signalId].join('|');
const entry = normNumberLike(it && it.entry);
const type = norm(it && it.type).toLowerCase();
return [analyst, pair, created, closed, 'entry:' + entry, 'type:' + type].join('|');
}
catch (e) { return ''; }
}
function tf_recordCompletenessScore(it) {
try {
const keys = ['entry', 'takeProfit', 'stopLoss', 'type', 'createdDate', 'displayDate', 'signalId', 'expiredDate'];
let n = 0;
keys.forEach((k) => {
const v = it && it[k];
if (v !== null && v !== undefined && String(v).trim() !== '' && String(v).trim() !== '-')
n += 1;
});
return n;
}
catch (e) { return 0; }
}
function tf_mergeHistoryArrays(a, b) {
const map = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const key = tf_historyCombineKey(it) || JSON.stringify(it);
const prev = map.get(key);
if (!prev) {
map.set(key, tf_cloneJsonSafe(it, { ...it }));
return;
}
const prevScore = tf_recordCompletenessScore(prev);
const nextScore = tf_recordCompletenessScore(it);
const base = nextScore > prevScore ? { ...prev, ...it } : { ...it, ...prev };
Object.keys(prev || {}).forEach((k) => {
if (base[k] === null || base[k] === undefined || String(base[k]).trim() === '')
base[k] = prev[k];
});
Object.keys(it || {}).forEach((k) => {
if (base[k] === null || base[k] === undefined || String(base[k]).trim() === '')
base[k] = it[k];
});
map.set(key, base);
};
(Array.isArray(a) ? a : []).forEach(put);
(Array.isArray(b) ? b : []).forEach(put);
return Array.from(map.values());
}
function tf_mergeScoreArrays(a, b) {
const map = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const key = [String(it.analyst || it.analystName || '').trim().toLowerCase(), String(it.pair || '').trim().toUpperCase(), String(it.displayDate || it.date || it.sortKey || '').trim(), String(it.score || it.value || '').trim()].join('|');
if (!map.has(key))
map.set(key, tf_cloneJsonSafe(it, { ...it }));
else
map.set(key, { ...map.get(key), ...it });
};
(Array.isArray(a) ? a : []).forEach(put);
(Array.isArray(b) ? b : []).forEach(put);
return Array.from(map.values());
}
function tf_mergeMonthlyStats(a, b) {
const out = tf_cloneJsonSafe(a && typeof a === 'object' ? a : {}, {});
const src = b && typeof b === 'object' ? b : {};
Object.keys(src).forEach((analystKey) => {
const prev = out[analystKey] && typeof out[analystKey] === 'object' ? out[analystKey] : {};
const next = src[analystKey] && typeof src[analystKey] === 'object' ? src[analystKey] : {};
out[analystKey] = { ...prev, ...tf_cloneJsonSafe(next, {}) };
});
return out;
}
function tf_mergeRememberedLinks(a, b) {
const byUrl = new Map();
const put = (it) => {
if (!it || typeof it !== 'object')
return;
const url = tf_normalizeTfAccountUrl(it.url || it.link || '');
const key = tf_normUrlKey(url);
if (!key)
return;
const rawPairs = Array.isArray(it.pairs) ? it.pairs.map((p) => String(p || '').trim().toUpperCase()).filter(Boolean) : [];
const explicit = rawPairs.filter((p) => p !== ALL_PAIR_OPTION_VALUE && p !== 'ALL');
const prev = byUrl.get(key) || { url, pairs: [] };
const prevExplicit = Array.isArray(prev.pairs) ? prev.pairs.filter((p) => p !== ALL_PAIR_OPTION_VALUE && p !== 'ALL') : [];
const mergedExplicit = Array.from(new Set([...prevExplicit, ...explicit]));
const name = String(it.name || it.analystName || '').trim();
byUrl.set(key, {
...prev,
...it,
url,
pairs: mergedExplicit.length ? mergedExplicit : [ALL_PAIR_OPTION_VALUE],
name: name || prev.name || prev.analystName || '',
analystName: name || prev.analystName || prev.name || ''
});
};
(Array.isArray(a) ? a : []).forEach(put);
(Array.isArray(b) ? b : []).forEach(put);
return Array.from(byUrl.values());
}
function tf_mergeAnalystSources(a, b) {
const rows = [];
const addMap = (m) => {
const obj = m && typeof m === 'object' ? m : {};
Object.keys(obj).forEach((name) => rows.push({ name, ...(obj[name] || {}) }));
};
addMap(a);
addMap(b);
const byUrl = new Map();
rows.forEach((it) => {
const url = tf_normalizeTfAccountUrl(it.url || it.link || '');
const key = tf_normUrlKey(url);
if (!key)
return;
const prev = byUrl.get(key) || { name: '', url, pairs: [] };
const incomingName = String(it.name || '').trim();
const prevName = String(prev.name || '').trim();
const chosenName = (!tf_isPlaceholderAnalystName(incomingName) && incomingName)
? incomingName
: (prevName || incomingName);
const inPairs = Array.isArray(it.pairs) ? it.pairs.map((p) => String(p || '').trim().toUpperCase()).filter(Boolean) : [];
const prevPairs = Array.isArray(prev.pairs) ? prev.pairs : [];
const specific = Array.from(new Set([...prevPairs, ...inPairs].filter((p) => p !== ALL_PAIR_OPTION_VALUE && p !== 'ALL')));
byUrl.set(key, { name: chosenName, url, pairs: specific.length ? specific : [ALL_PAIR_OPTION_VALUE] });
});
const out = {};
for (const row of byUrl.values()) {
let name = row.name || '';
if (!name) {
const m = String(row.url || '').match(/\/channels\/(\d+)/i);
name = m && m[1] ? ('Channel ' + m[1]) : row.url;
}
let finalName = name;
let suffix = 2;
while (Object.prototype.hasOwnProperty.call(out, finalName) && tf_normUrlKey(out[finalName].url || '') !== tf_normUrlKey(row.url || '')) {
finalName = name + ' #' + String(suffix++);
}
out[finalName] = { url: row.url, pairs: row.pairs };
}
return out;
}
function tf_combineImportPayloads(payloads, fileNames) {
const list = (Array.isArray(payloads) ? payloads : []).filter((p) => p && typeof p === 'object');
if (!list.length)
return null;
const primary = list[0];
const outStorage = tf_cloneJsonSafe(primary.storage && typeof primary.storage === 'object' ? primary.storage : primary, {});
const owners = [];
const ownerKey = (o) => String((o && (o.email || o.name)) || '').trim().toLowerCase();
const pushOwner = (o) => {
if (!o || typeof o !== 'object')
return;
const item = { name: String(o.name || '').trim(), email: String(o.email || '').trim(), avatarUrl: String(o.avatarUrl || '') };
if (!item.name && !item.email)
return;
const key = ownerKey(item);
if (!owners.some((x) => ownerKey(x) === key))
owners.push(item);
};
list.forEach((payload, idx) => {
tf_ownerListFromPayload(payload).forEach(pushOwner);
if (idx === 0)
return;
const src = payload.storage && typeof payload.storage === 'object' ? payload.storage : payload;
outStorage.tfHistorySignals = tf_mergeHis
~~~

### TF_EXPORT_STORAGE_KEYS @ 205215
~~~js
nSafe(src.tfNoDataPairs, {}) || {}) };
outStorage.tfAvgSlPips = { ...(outStorage.tfAvgSlPips || {}), ...(tf_cloneJsonSafe(src.tfAvgSlPips, {}) || {}) };
outStorage[TF_REMEMBERED_LINKS_KEY] = tf_mergeRememberedLinks(outStorage[TF_REMEMBERED_LINKS_KEY], src[TF_REMEMBERED_LINKS_KEY]);
outStorage[TF_ANALYST_SOURCES_KEY] = tf_mergeAnalystSources(outStorage[TF_ANALYST_SOURCES_KEY], src[TF_ANALYST_SOURCES_KEY]);
outStorage[TF_ANALYST_NAME_CACHE_KEY] = { ...(outStorage[TF_ANALYST_NAME_CACHE_KEY] || {}), ...(tf_cloneJsonSafe(src[TF_ANALYST_NAME_CACHE_KEY], {}) || {}) };
Object.keys(src || {}).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(outStorage, k))
outStorage[k] = tf_cloneJsonSafe(src[k], src[k]);
});
});
try {
outStorage[TF_REMEMBERED_LINKS_KEY] = tf_enrichRememberedLinksWithNames(outStorage[TF_REMEMBERED_LINKS_KEY] || [], outStorage[TF_ANALYST_SOURCES_KEY] || {});
outStorage[TF_REMEMBER_LINKS_ENABLED_KEY] = Array.isArray(outStorage[TF_REMEMBERED_LINKS_KEY]) && outStorage[TF_REMEMBERED_LINKS_KEY].length > 0;
}
catch (e) { }
return {
schema: TF_EXPORT_SCHEMA,
exportedAt: new Date().toISOString(),
exportedBy: owners.length ? owners[0] : (primary.exportedBy || null),
exportedByList: owners,
combined: list.length > 1,
combinedFileCount: list.length,
combinedFiles: Array.isArray(fileNames) ? fileNames.slice() : [],
localState: tf_cloneJsonSafe(primary.localState || {}, {}),
storage: outStorage
};
}

function tf_importPayloadToStorage(payload, afterImport) {
try {
if (!payload || typeof payload !== 'object') {
alert('File tidak valid.');
return;
}
const storage = payload.storage && typeof payload.storage === 'object' ? payload.storage : payload;
if (!storage[TF_REMEMBERED_LINKS_KEY] && storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object') {
const sources = storage[TF_ANALYST_SOURCES_KEY];
const names = Object.keys(sources || {}).sort();
storage[TF_REMEMBERED_LINKS_KEY] = names
.map((n) => {
const it = sources[n] || {};
return {
url: it.url || '',
pairs: Array.isArray(it.pairs) ? it.pairs : ['__ALL__']
};
})
.filter((x) => x.url);
if (storage[TF_REMEMBERED_LINKS_KEY].length) {
storage[TF_REMEMBER_LINKS_ENABLED_KEY] = true;
}
}
if (Array.isArray(storage[TF_REMEMBERED_LINKS_KEY]) && storage[TF_REMEMBERED_LINKS_KEY].length) {
storage[TF_REMEMBER_LINKS_ENABLED_KEY] = true;
}
if (!storage[TF_SELECTED_TIME_RANGE_KEY]) {
storage[TF_SELECTED_TIME_RANGE_KEY] = 'all_time';
}
try {
const __tfDefaults = {};
__tfDefaults['tfMonthlyStats'] = {};
__tfDefaults['tfHistorySignals'] = [];
__tfDefaults['tfScoreHistory'] = [];
__tfDefaults['tfNoDataPairs'] = {};
__tfDefaults['tfAvgSlPips'] = {};
__tfDefaults[TF_ANALYST_SOURCES_KEY] = {};
__tfDefaults[TF_REMEMBERED_LINKS_KEY] = [];
__tfDefaults[TF_REMEMBER_LINKS_ENABLED_KEY] = false;
Object.keys(__tfDefaults).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(storage, k))
storage[k] = __tfDefaults[k];
});
}
catch (e) { }
try {
const remembered = Array.isArray(storage[TF_REMEMBERED_LINKS_KEY]) ? storage[TF_REMEMBERED_LINKS_KEY] : null;
const sources = storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object' ? storage[TF_ANALYST_SOURCES_KEY] : null;
if (remembered && remembered.length && sources) {
const allowed = new Set();
remembered.forEach((it) => {
try {
const u = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const k = u ? tf_normUrlKey(u) : '';
if (k)
allowed.add(k);
}
catch (e) { }
});
const filtered = {};
Object.keys(sources).forEach((nm) => {
try {
const it = sources[nm] || {};
const u = tf_normalizeTfAccountUrl(it.url || it.link || '');
const k = u ? tf_normUrlKey(u) : '';
if (k && allowed.has(k))
filtered[nm] = it;
}
catch (e) { }
});
storage[TF_ANALYST_SOURCES_KEY] = filtered;
}
}
catch (e) { }
try {
if (Array.isArray(storage[TF_REMEMBERED_LINKS_KEY])) {
storage[TF_REMEMBERED_LINKS_KEY] = tf_enrichRememberedLinksWithNames(storage[TF_REMEMBERED_LINKS_KEY], storage[TF_ANALYST_SOURCES_KEY]);
}
}
catch (e) { }
try {
const shouldClean = !!(payload && payload.forceCleanOrphans === true);
if (shouldClean) {
const allowedNames = new Set();
try {
const src = (storage[TF_ANALYST_SOURCES_KEY] && typeof storage[TF_ANALYST_SOURCES_KEY] === 'object') ? storage[TF_ANALYST_SOURCES_KEY] : {};
Object.keys(src || {}).forEach((nm) => {
const n = String(nm || '').trim();
if (n)
allowedNames.add(n);
});
}
catch (e) { }
const hasAllowed = allowedNames.size > 0;
const baseFromMonthlyKey = (k) => {
const s = String(k || '').trim();
const m = s.match(/^(.*)\s*\(([A-Z0-9]+)\)\s*$/);
if (m && m[1])
return String(m[1]).trim();
return s;
};
if (hasAllowed) {
try {
if (Array.isArray(storage.tfHistorySignals)) {
storage.tfHistorySignals = storage.tfHistorySignals.filter((it) => {
if (!it || !it.analyst)
return false;
const a = String(it.analyst || '').trim();
return a && allowedNames.has(a);
});
}
}
catch (e) { }
try {
if (Array.isArray(storage.tfScoreHistory)) {
storage.tfScoreHistory = storage.tfScoreHistory.filter((it) => {
const a = String(it && (it.analyst || it.analystName) || '').trim();
return a && allowedNames.has(a);
});
}
}
catch (e) { }
try {
if (storage.tfAvgSlPips && typeof storage.tfAvgSlPips === 'object') {
const out = {};
Object.keys(storage.tfAvgSlPips).forEach((nm) => {
const a = String(nm || '').trim();
if (a && allowedNames.has(a))
out[a] = storage.tfAvgSlPips[nm];
});
storage.tfAvgSlPips = out;
}
}
catch (e) { }
try {
if (storage.tfNoDataPairs && typeof storage.tfNoDataPairs === 'object') {
const out = {};
Object.keys(storage.tfNoDataPairs).forEach((nm) => {
const a = String(nm || '').trim();
if (a && allowedNames.has(a))
out[a] = storage.tfNoDataPairs[nm];
});
storage.tfNoDataPairs = out;
}
}
catch (e) { }
try {
if (storage.tfMonthlyStats && typeof storage.tfMonthlyStats === 'object') {
const out = {};
Object.keys(storage.tfMonthlyStats).forEach((k) => {
const base = baseFromMonthlyKey(k);
if (base && allowedNames.has(base))
out[k] = storage.tfMonthlyStats[k];
});
storage.tfMonthlyStats = out;
}
}
catch (e) { }
try {
const ls = (payload && payload.localState && typeof payload.localState === 'object') ? payload.localState : null;
if (ls) {
const cleanJsonMapString = (rawStr) => {
try {
const obj = JSON.parse(String(rawStr || ''));
if (!obj || typeof obj !== 'object')
return rawStr;
const out = {};
Object.keys(obj).forEach((k) => {
const kk = String(k || '');
const base = kk.split('|')[0] ? String(kk.split('|')[0]).trim() : '';
if (base && allowedNames.has(base))
out[kk] = obj[k];
});
return JSON.stringify(out);
}
catch (e) {
return rawStr;
}
};
if (Object.prototype.hasOwnProperty.call(ls, 'tf_sl_type_selection')) {
ls['tf_sl_type_selection'] = cleanJsonMapString(ls['tf_sl_type_selection']);
}
if (Object.prototype.hasOwnProperty.call(ls, 'tf_risk_overrides')) {
ls['tf_risk_overrides'] = cleanJsonMapString(ls['tf_risk_overrides']);
}
}
}
catch (e) { }
}
}
}
catch (e) { }
try {
tf_applyLocalStateFromImport(payload.localState);
}
catch (e) { }
const toSet = {};
TF_EXPORT_STORAGE_KEYS.forEach((k) => {
if (Object.prototype.hasOwnProperty.call(storage, k)) {
toSet[k] = storage[k];
}
});
try {
if (Object.prototype.hasOwnProperty.call(toSet, 'tfUserProfile'))
delete toSet.tfUserProfile;
}
catch (e) { }
try {
const __tfImportOwners = tf_ownerListFromPayload(payload);
toSet.tfLastImportMeta = (__tfImportOwners.length || (payload && payload.exportedBy)) ? {
exportedAt: payload.exportedAt || '',
exportedBy: __tfImportOwners.length ? __tfImportOwners[0] : (payload.exportedBy || null),
exportedByList: __tfImportOwners,
combined: !!(payload && payload.combined),
combinedFileCount: payload && payload.combinedFileCount ? Number(payload.combinedFileCount) : (__tfImportOwners.length > 1 ? __tfImportOwners.length : 1),
combinedFiles: payload && Array.isArray(payload.combinedFiles) ? payload.combinedFiles.slice() : []
} : null;
toSet.tfLastScanMeta = null;
}
catch (e) { }
toSet[TF_HAS_IMPORTED_BUNDLE_KEY] = true;
toSet[TF_IMPORT_LOCK_ENGAGED_KEY] = false;
toSet[TF_IMPORT_LOCKED_SIGS_KEY] = [];
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] = 0;
toSet[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] = 0;
toSet.tfLastImportAt = new Date().toISOString();
setStatus('Importing...');
chrome.storage.local.set(toSet, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
setStatus('Import selesai ✅');
try {
loadPopupStateFromStorage();
}
catch (e) { }
try {
tf_refreshTimeRangeUIFromStorage();
}
catch (e) { }
try {
tf_renderSavedChannelsStatusFromStorage();
}
catch (e) { }
if (typeof afterImport === 'function') {
try {
afterImport();
}
catch (e) { }
}
});
}
catch (e) {
alert('Gagal import file.');
}
}
function tf_startBatchScanFromStoredConfig(originLabel) {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_REMEMBERED_LINKS_KEY, TF_IMPORT_LOCK_ENGAGED_KEY, TF_IMPORT_LOCKED_SIGS_KEY, TF_SELECTED_TIME_RANGE_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] ? d[TF_ANALYST_SOURCES_KEY] : null;
const remembered = d && d[TF_REMEMBERED_LINKS_KEY] ? d[TF_REMEMBERED_LINKS_KEY] : null;
let channels = [];
const nameMaps = tf_buildNameMapsFromSources(sources);
const isPlaceholderName = (s) => {
const t = String(s || '').trim();
if (!t)
return true;
if (/^channel\s*id$/i.test(t))
return true;
if (/^channel\s+\d+$/i.test(t))
return true;
if (/^link\s+\d+$/i.test(t))
return true;
return false;
};
if (Array.isArray(remembered) && remembered.length) {
channels = remembered
.map((it, idx) => {
const url = tf_normalizeTfAccountUrl(it && it.url ? it.url : '');
const pairs = Array.isArray(it && it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
let nm = (it && (it.name || it.analystName)) ? String(it.name || it.analystName) : '';
if (isPlaceholderName(nm))
nm = '';
if (!nm && url) {
try {
nm = tf_resolveAnalystNameForUrl(url, nameMaps) || '';
}
catch (e) {
nm = '';
}
}
if (!nm) {
const fb = (it && it._fallbackLabel) ? String(it._fallbackLabel) : '';
if (fb && !isPlaceholderName(fb))
nm = fb;
}
if (!nm && url) {
const m = String(url).match(/\/channels\/(\d+)/i);
if (m && m[1])
nm = 'Channel ' + m[1];
}
if (!nm)
nm = `Link ${idx + 1}`;
return url ? { name: nm, url, pairs } : null;
})
.filter(Boolean);
}
if (!channels.length && sources && typeof sources === 'object') {
channels = Object.keys(sources)
.map((name) => {
const it = sources[name] || {};
const url = tf_normalizeTfAccountUrl(it.url || it.link || '');
const pairs = Array.isArray(it.pairs) && it.pairs.length ? it.pairs.slice() : ['__ALL__'];
return url ? { name, url, pairs } : null;
})
.filter(Boolean);
}
try {
const lockEngaged = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
const lockedSigs = (d && Array.isArray(d[TF_IMPORT_LOCKED_SIGS_KEY])) ? d[TF_IMPORT_LOCKED_SIGS_KEY] : [];
tf_addModeEngaged = lockEngaged;
tf_addModeSigSet = new Set(lockedSigs);
const isUpdateNow = String(originLabel || '').toLowerCase().includes('update');
if (lockEngaged && !isUpdateNow) {
channels = tf_filterChannelsByAddMode(channels);
}
}
catch (e) { }
if (!channels.length) {
alert('Tidak ada link channel di file / storage. Silakan Import file yang benar.');
return;
}
try {
const isUpdate = String(originLabel || '').toLowerCase().includes('update');
const scanMode = isUpdate ? 'update' : 'full';
const allowedRanges = new Set(['m3', 'm6', 'y1', 'y2', 'y3', 'y5', 'all_time']);
const storedRange = d && d[TF_SELECTED_TIME_RANGE_KEY] ? String(d[TF_SELECTED_TIME_RANGE_KEY]) : 'all_time';
const payload = {
type: 'startBatchScan',
channels: channels,
origin: originLabel || 'updateButton',
scanMode
};
// Hanya full scan yang boleh memakai selector Time Range.
// Update tidak mengirim forceTimeRange agar pilihan UI/storage tidak berubah.
if (!isUpdate) {
payload.forceTimeRange = allowedRanges.has(storedRange) ? storedRange : 'all_time';
}
if (isUpdate) {
__tfUpdateStopOptimisticUnlock = false;
try { tf_setUpdateActivityLock(true); } catch (e) { }
}
const sendUpdateRequest = (attempt) => {
try {
chrome.runtime.sendMessage(payload, (response) => {
let runtimeError = null;
try {
runtimeError = chrome.runtime.lastError || null;
}
catch (e) { }
if ((runtimeError || !response) && attempt < 1) {
setTimeout(() => sendUpdateRequest(attempt + 1), 350);
return;
}
if (runtimeError) {
try { if (isUpdate) tf_setUpdateActivityLock(false); } catch (e) { }
setStatus('Update gagal dimulai: ' + (runtimeError.message || 'background tidak merespons.'));
return;
}
if (!response || response.ok === false) {
try { if (isUpdate) tf_setUpdateActivityLock(false); } catch (e) { }
setStatus('Update gagal dimulai: ' + ((response && response.error) ? response.error : 'background tidak merespons.'));
return;
}
setStatus('Update scan dimulai...');
});
}
catch (error) {
if (attempt < 1) {
setTimeout(() => sendUpdateRequest(attempt + 1), 350);
return;
}
try { if (isUpdate) tf_setUpdateActivityLock(false); } catch (e) { }
setStatus('Update gagal dimulai: ' + ((error && error.message) ? error.message : String(error)));
}
};
sendUpdateRequest(0);
}
catch (e) {
setStatus('Update gagal dimulai: ' + ((e && e.message) ? e.message : String(e)));
}
});
}
catch (e) { }
}

let __tfUpdateActivityLocked = false;
let __tfUpdateStopOptimisticUnlock = false;
function tf_setUpdateActivityLock(on) {
try {
const locked = !!on;
__tfUpdateActivityLocked = locked;
const ids = [
  'tf-btn-import-main','tf-btn-import-masuk','tf-btn-import-isignal',
  'tf-btn-export-main','tf-btn-export-masuk','tf-btn-export-isignal',
  'tf-btn-add-analyst-main','tf-btn-add-analyst-masuk','tf-btn-add-analyst-isignal',
  'tf-btn-submit-main','tf-btn-submit-masuk','tf-btn-submit-isignal',
  'tf-btn-scanlink-main','tf-btn-scanlink-masuk','tf-btn-scanlink-isignal',
  'tf-btn-scanpair-main','tf-btn-scanpair-masuk','tf-btn-scanpair-isignal',
  'batch-scan-btn','batch-scan-isignal-btn','scan-btn',
  'add-analyst-btn','add-analyst-isignal-btn','scan-from-isignal-btn'
];
const nodes = ids.map((id) => document.getElementById(id)).filter(Boolean)
  .concat(Array.from(document.querySelectorAll('.analyst-remove-btn')));
nodes.forEach((el) => {
  try {
    if (!el || !el.dataset) return;
    if (locked) {
      if (typeof el.dataset.tfUpdatePrevDisabled === 'undefined')
        el.dataset.tfUpdatePrevDisabled = el.disabled ? '1' : '0';
      if (typeof el.dataset.tfUpdatePrevTitle === 'undefined')
        el.dataset.tfUpdatePrevTitle = el.title || '';
      el.disabled = true;
      el.setAttribute('aria-disabled', 'true');
      el.classList.add('tf-update-activity-locked');
      el.title = 'Dikunci sementara selama proses Update berjalan.';
    } else {
      const prev = el.dataset.tfUpdatePrevDisabled;
      if (prev === '0') el.disabled = false;
      else if (prev === '1') el.disabled = true;
      el.setAttribute('aria-disabled', el.disabled ? 'true' : 'false');
      el.classList.remove('tf-update-activity-locked');
      if (typeof el.dataset.tfUpdatePrevTitle !== 'undefined')
        el.title = el.dataset.tfUpdatePrevTitle || '';
      delete el.dataset.tfUpdatePrevDisabled;
      delete el.dataset.tfUpdatePrevTitle;
    }
  } catch (e) { }
});
// Refresh sengaja tetap aktif, kecuali sedang menjalankan animasi Refresh sendiri.
['tf-btn-refresh-main','tf-btn-refresh-masuk','tf-btn-refresh-isignal'].forEach((id) => {
  const b = document.getElementById(id);
  if (b && !b.classList.contains('tf-refresh-loading')) b.disabled = false;
});
if (!locked) {
  try { tf_syncUpdateButtonsEnabledFromStorage(); } catch (e) { }
  try { tf_updateExportButtonsEnabledFromStorage(); } catch (e) { }
}
}
catch (e) { }
}

function tf_btnEnsureOriginal(btn) {
if (!btn || !btn.dataset)
return;
if (!btn.dataset.tfOrigText)
btn.dataset.tfOrigText = btn.textContent || '';
if (!btn.dataset.tfOrigClass)
btn.dataset.tfOrigClass = btn.className || '';
}
function tf_isStopMode(btn) {
return !!(btn && btn.dataset && btn.dataset.tfStopMode === '1');
}
function tf_setStopMode(btn, on) {
if (!btn)
return;
tf_btnEnsureOriginal(btn);
const origClass = btn.dataset.tfOrigClass || '';
const isLinkStyle = origClass.includes('tf-action-link');
const isBoxStyle = origClass.includes('tf-action-box') || origClass.includes('tf-submit-action-btn');
if (on) {
btn.dataset.tfStopMode = '1';
const isUpdateButton = !!(btn.id && String(btn.id).indexOf('tf-btn-update-') === 0);
btn.textContent = isUpdateButton ? 'Stop!' : TF_STOP_LABEL;
btn.className = isBoxStyle
? (origClass + ' tf-action-stop')
: (isLinkStyle ? 'tf-action-link tf-action-stop' : 'btn danger');
}
else {
btn.dataset.tfStopMode = '0';
btn.textContent = btn.dataset.tfOrigText || 'Submit';
btn.className = btn.dataset.tfOrigClass || 'btn';
}
}
function tf_isSingleScanOrigin(origin) {
const o = origin ? String(origin) : '';
return o === 'scanChannelButton' || o === 'scanChannelHyperlink';
}
function tf_getScanHyperlinkButtons() {
return [
document.getElementById('tf-btn-scanlink-main'),
document.getElementById('tf-btn-scanlink-masuk'),
document.getElementById('tf-btn-scanlink-isignal')
].filter(Boolean);
}
function tf_isScanHyperlinkStopMode() {
try {
return tf_getScanHyperlinkButtons().some((btn) => !!(btn.dataset && btn.dataset.tfStopMode === '1'));
}
catch (e) {
return false;
}
}
function tf_setScanHyperlinkStopMode(on, stopping) {
try {
const isOn = !!on;
const isStopping = !!stopping;
tf_getScanHyperlinkButtons().forEach((btn) => {
if (!btn || !btn.dataset)
return;
if (!btn.dataset.tfScanLinkOrigText)
btn.dataset.tfScanLinkOrigText = btn.textContent || 'Scan Channel ini';
if (!btn.dataset.tfScanLinkOrigClass)
btn.dataset.tfScanLinkOrigClass = btn.className || 'tf-action-link';
if (isOn) {
btn.dataset.tfStopMode = '1';
btn.dataset.tfScanStopping = isStopping ? '1' : '0';
btn.disabled = false;
btn.removeAttribute('disabled');
btn.setAttribute('aria-disabled', 'false');
btn.setAttribute('aria-busy', 'true');
btn.style.pointerEvents = 'auto';
btn.className = (btn.dataset.tfScanLinkOrigClass || 'tf-action-link') + ' tf-action-stop tf-scanlink-running';
btn.innerHTML = '<span class="tf-scanlink-mini-spinner" aria-hidden="true"></span><span>' + (isStopping ? 'Stopping...' : 'Stop!!') + '</span>';
btn.title = isStopping
? 'Sedang menghentikan scan dan membuang hasil sementara.'
: 'Hentikan Scan Channel ini. Hasil scan sementara tidak akan disimpan.';
}
else {
btn.dataset.tfStopMode = '0';
btn.dataset.tfScanStopping = '0';
btn.removeAttribute('aria-busy');
btn.className = btn.dataset.tfScanLinkOrigClass || 'tf-action-link';
btn.textContent = btn.dataset.tfScanLinkOrigText || 'Scan Channel ini';
btn.title = '';
}
});
}
catch (e) { }
}
function tf_setStopModeAll(on) {
try {
tf_setStopMode(document.getElementById('batch-scan-btn'), on);
tf_setStopMode(document.getElementById('batch-scan-isignal-btn'), on);
tf_setStopMode(document.getElementById('scan-btn'), on);
if (!on)
tf_setScanHyperlinkStopMode(false, false);
}
catch (e) { }
}
function tf_getButtonForOrigin(origin) {
const o = origin ? String(origin) : '';
if (o === 'dashboardSubmit')
return document.getElementById('batch-scan-btn');
if (o === 'isignalSubmit')
return document.getElementById('batch-scan-isignal-btn');
if (o === 'scanChannelButton')
return document.getElementById('scan-btn');
if (o === 'updateButton')
return document.getElementById('tf-btn-update-main') || document.getElementById('tf-btn-update-masuk');
return null;
}
let tf_scanUiInProgress = false;
let tf_scanUiOrigin = '';
function tf_applyStopModeFromScanState(inProgress, origin) {
const on = !!inProgress;
tf_scanUiInProgress = on;
const o = origin ? String(origin) : '';
tf_scanUiOrigin = on ? o : '';
const btnDash = document.getElementById('batch-scan-btn');
const btnIsig = document.getElementById('batch-scan-isignal-btn');
const btnScan = document.getElementById('scan-btn');
const btnUpdMain = document.getElementById('tf-btn-update-main');
const btnUpdMasuk = document.getElementById('tf-btn-update-masuk');
const btnUpdIsignal = document.getElementById('tf-btn-update-isignal');
if (!on) {
__tfUpdateStopOptimisticUnlock = false;
[btnUpdMain, btnUpdMasuk, btnUpdIsignal].forEach((btn) => {
try {
if (btn && btn.dataset) delete btn.dataset.tfStopPending;
if (btn) btn.removeAttribute('aria-busy');
}
catch (e) { }
});
try { tf_setUpdateActivityLock(false); } catch (e) { }
try {
tf_setStopMode(btnDash, false);
}
catch (e) { }
try {
tf_setStopMode(btnIsig, false);
}
catch (e) { }
try {
tf_setStopMode(btnScan, false);
}
catch (e) { }
try {
tf_setStopMode(btnUpdMain, false);
}
catch (e) { }
try {
tf_setStopMode(btnUpdMasuk, false);
}
catch (e) { }
try {
tf_setStopMode(btnUpdIsignal, false);
}
catch (e) { }
try {
tf_setScanHyperlinkStopMode(false, false);
}
catch (e) { }
return;
}
const target = tf_getButtonForOrigin(origin);
try { tf_setUpdateActivityLock(o === 'updateButton' && !__tfUpdateStopOptimisticUnlock); } catch (e) { }
try {
tf_setStopMode(btnDash, target === btnDash);
}
catch (e) { }
try {
tf_setStopMode(btnIsig, target === btnIsig);
}
catch (e) { }
try {
tf
~~~
