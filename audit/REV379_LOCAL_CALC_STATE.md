# REV379 Local Calculation State

## assets/tf-remote-sidebar-agent.js

### tf_collectLocalStateForExport @ 96475
~~~js
ile','tfLastScanMeta','tfLastImportMeta']);

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
    return {ok:true,action:'
~~~
## assets/4b4d6b8dc315a95c.js

### TF_TABLE1_SWAP_ENABLED_KEY @ 186244
~~~js
aftTouched)
return;
if (withdrawDraftAutoFilled)
return;
if (!Number.isFinite(withdrawMinSuggested) || withdrawMinSuggested === null)
return;
let hasStored = false;
let storedVal = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
hasStored = (raw !== null && raw !== undefined && String(raw).trim() !== '');
storedVal = safeParseFloat(raw);
}
}
catch (e) { }
if (hasStored && Number.isFinite(storedVal) && storedVal > 0)
return;
if (Number.isFinite(withdrawDraftAmount) && withdrawDraftAmount > 0)
return;
const inputs = [
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity')
].filter(Boolean);
if (!inputs.length)
return;
const v = Math.max(0, Number(withdrawMinSuggested) || 0);
withdrawDraftAmount = v;
const strVal = String(Math.round(v * 100) / 100);
inputs.forEach((el) => {
try {
el.value = strVal;
}
catch (e) { }
});
tf_enforceWithdrawAmountMax(true, inputs[0]);
withdrawDraftAutoFilled = true;
}
catch (e) { }
}
function tf_updateWithdrawMinSuggestedFromMonthlyIncome(monthlyGrossByMonth, priceBusy) {
try {
if (priceBusy || !Array.isArray(monthlyGrossByMonth) || !monthlyGrossByMonth.length) {
withdrawMinSuggested = null;
return;
}
let minAbs = null;
for (let i = 0; i < monthlyGrossByMonth.length; i++) {
const it = monthlyGrossByMonth[i] || {};
const mk = String(it.monthKey || '');
if (!mk || !/^\d{4}-\d{2}$/.test(mk))
continue;
if (mk < TF_WITHDRAW_MIN_MONTHKEY)
continue;
const v = Number(it.grossDollars);
if (!Number.isFinite(v))
continue;
const sig = Number(it.signals);
const hasData = (Number.isFinite(sig) ? sig : 0) > 0 || Math.abs(v) > 1e-9;
if (!hasData)
continue;
const absV = Math.abs(v);
if (!Number.isFinite(absV))
continue;
if (absV <= 0)
continue;
if (minAbs === null || absV < minAbs)
minAbs = absV;
}
withdrawMinSuggested = (minAbs === null) ? 0 : minAbs;
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) {
withdrawMinSuggested = null;
}
}
let analystRiskOverrides = {};
const TF_TABLE1_BALANCE_KEY = 'tf_current_balance';
const TF_TABLE1_RISK_KEY = 'tf_current_risk_percent';
const TF_TABLE1_RISK_OVERRIDES_KEY = 'tf_risk_overrides';
const TF_TABLE1_SWAP_ENABLED_KEY = 'tf_swap_enabled';
const TF_TABLE1_SWAP_RATE_KEY = 'tf_swap_rate_per_lot';
const TF_TABLE1_COMM_ENABLED_KEY = 'tf_commission_enabled';
const TF_TABLE1_COMM_RATE_KEY = 'tf_commission_rate_per_lot';
const TF_SL_TYPE_SELECTION_KEY = 'tf_sl_type_selection';
function tf_loadTable1StateFromLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
const bRaw = localStorage.getItem(TF_TABLE1_BALANCE_KEY);
const b = parseFloat(bRaw);
if (Number.isFinite(b) && b > 0)
currentBalance = b;
const rRaw = localStorage.getItem(TF_TABLE1_RISK_KEY);
const r = parseFloat(rRaw);
if (Number.isFinite(r) && r >= 0)
currentRiskPercent = r;
const swapEnRaw = localStorage.getItem(TF_TABLE1_SWAP_ENABLED_KEY);
if (swapEnRaw !== null) swapEnabled = (swapEnRaw === '1' || swapEnRaw === 'true' || swapEnRaw === 'yes');
const swapRateRaw = parseFloat(localStorage.getItem(TF_TABLE1_SWAP_RATE_KEY));
if (Number.isFinite(swapRateRaw) && swapRateRaw >= 0) swapRatePerLot = swapRateRaw;
const commEnRaw = localStorage.getItem(TF_TABLE1_COMM_ENABLED_KEY);
if (commEnRaw !== null) commissionEnabled = (commEnRaw === '1' || commEnRaw === 'true' || commEnRaw === 'yes');
const commRateRaw = parseFloat(localStorage.getItem(TF_TABLE1_COMM_RATE_KEY));
if (Number.isFinite(commRateRaw) && commRateRaw >= 0) commissionRatePerLot = commRateRaw;
const oRaw = localStorage.getItem(TF_TABLE1_RISK_OVERRIDES_KEY);
if (oRaw) {
const obj = JSON.parse(oRaw);
if (obj && typeof obj === 'object') {
const clean = {};
Object.keys(obj).forEach((k) => {
const v = parseFloat(obj[k]);
if (Number.isFinite(v) && v >= 0)
clean[String(k)] = v;
});
analystRiskOverrides = clean;
}
}
const slRaw = localStorage.getItem(TF_SL_TYPE_SELECTION_KEY);
if (slRaw) {
const obj2 = JSON.parse(slRaw);
if (obj2 && typeof obj2 === 'object') {
const clean2 = {};
Object.keys(obj2).forEach((k) => {
const v = obj2[k];
if (v === 'fixed' || v === 'avg')
clean2[String(k)] = v;
});
slTypeSelectionByAnalyst = clean2;
}
}
try {
const wEnRaw = localStorage.getItem(TF_WITHDRAW_ENABLED_KEY);
if (wEnRaw !== null) {
withdrawEnabled = (wEnRaw === '1' || wEnRaw === 'true' || wEnRaw === 'yes');
}
const wAmtRaw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
const wAmt = parseFloat(wAmtRaw);
if (Number.isFinite(wAmt) && wAmt >= 0)
withdrawAmount = wAmt;
const wEveryRaw = localStorage.getItem(TF_WITHDRAW_EVERY_MONTHS_KEY);
const wEvery = parseInt(wEveryRaw, 10);
if (Number.isFinite(wEvery) && wEvery >= 1 && wEvery <= 12)
withdrawEveryMonths = wEvery;
}
catch (e) { }
}
catch (e) {
}
}
function tf_saveTable1StateToLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
localStorage.setItem(TF_TABLE1_BALANCE_KEY, String(currentBalance));
localStorage.setItem(TF_TABLE1_RISK_KEY, String(currentRiskPercent));
localStorage.setItem(TF_TABLE1_SWAP_ENABLED_KEY, swapEnabled ? '1' : '0');
localStorage.setItem(TF_TABLE1_SWAP_RATE_KEY, String(Number.isFinite(swapRatePerLot) ? swapRatePerLot : 9.01));
localStorage.setItem(TF_TABLE1_COMM_ENABLED_KEY, commissionEnabled ? '1' : '0');
localStorage.setItem(TF_TABLE1_COMM_RATE_KEY, String(Number.isFinite(commissionRatePerLot) ? commissionRatePerLot : 20));
localStorage.setItem(TF_TABLE1_RISK_OVERRIDES_KEY, JSON.stringify(analystRiskOverrides || {}));
localStorage.setItem(TF_SL_TYPE_SELECTION_KEY, JSON.stringify(slTypeSelectionByAnalyst || {}));
localStorage.setItem(TF_WITHDRAW_ENABLED_KEY, withdrawEnabled ? '1' : '0');
try {
if (Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
localStorage.setItem(TF_WITHDRAW_AMOUNT_KEY, String(withdrawAmount));
}
else {
localStorage.removeItem(TF_WITHDRAW_AMOUNT_KEY);
}
}
catch (e) { }
localStorage.setItem(TF_WITHDRAW_EVERY_MONTHS_KEY, String(withdrawEveryMonths || 1));
}
catch (e) {
}
}
function tf_roundTradeCostMoney(value) {
const n = Number(value);
if (!Number.isFinite(n)) return 0;
return Math.round((n + Number.EPSILON) * 100) / 100;
}
function tf_buildTradeCostFields(lot, grossPnlDollar, denom) {
const lotAbs = Math.abs(Number(lot) || 0);
const gross = Number.isFinite(Number(grossPnlDollar)) ? Number(grossPnlDollar) : 0;
const swapCost = swapEnabled ? tf_roundTradeCostMoney(lotAbs * Math.max(0, Number(swapRatePerLot) || 0)) : 0;
const commCost = commissionEnabled ? tf_roundTradeCostMoney(lotAbs * Math.max(0, Number(commissionRatePerLot) || 0)) : 0;
const swapDollar = -swapCost;
const commDollar = -commCost;
const pnlDollarNet = tf_roundTradeCostMoney(gross + swapDollar + commDollar);
const d = Math.abs(Number(denom) || 0);
const pnlPercentNet = d > 0 ? (pnlDollarNet / d) * 100 : 0;
return { swapDollar, commDollar, pnlDollarNet, pnlPercentNet };
}
function tf_getHistoryNetPnlDollar(row) {
if (!row) return 0;
if (row.isWithdraw) return Number.isFinite(Number(row.pnlDollar)) ? Number(row.pnlDollar) : 0;
if (Number.isFinite(Number(row.pnlDollarNet))) return Number(row.pnlDollarNet);
const gross = Number.isFinite(Number(row.pnlDollar)) ? Number(row.pnlDollar) : ((Number(row.dollarTP) || 0) - (Number(row.dollarSL) || 0));
return tf_buildTradeCostFields(row.lot, gross, row.balanceCompound || currentBalance || 0).pnlDollarNet;
}
function tf_getHistoryNetPnlPercent(row) {
if (!row || row.isWithdraw) return Number.isFinite(Number(row && row.pnlPercent)) ? Number(row.pnlPercent) : 0;
if (Number.isFinite(Number(row.pnlPercentNet))) return Number(row.pnlPercentNet);
const denom = Math.abs(Number(row.balanceCompound) || Number(currentBalance) || 0);
return tf_buildTradeCostFields(row.lot, Number(row.pnlDollar) || 0, denom).pnlPercentNet;
}
function tf_getCostAdjustedHeaderSuffix() {
if (commissionEnabled && swapEnabled) return ' + COMM & SWAP';
if (commissionEnabled) return ' + COMM';
if (swapEnabled) return ' + SWAP';
return ' (Net)';
}
function tf_updateCostAdjustedHeaders() {
try {
let mode = '';
if (commissionEnabled && swapEnabled) mode = 'COMM & SWAP';
else if (commissionEnabled) mode = 'COMM';
else if (swapEnabled) mode = 'SWAP';
const dollarTh = document.getElementById('history-pnl-dollar-net-th');
const pctTh = document.getElementById('history-pnl-percent-net-th');
if (dollarTh) dollarTh.innerHTML = mode ? ('PnL $ +<br>' + mode) : 'PnL $';
if (pctTh) pctTh.innerHTML = mode ? ('PnL % +<br>' + mode) : 'PnL %';
}
catch (e) { }
}
function tf_isHistoryCostColumnEnabled(key) {
if (key === 'swapDollar') return !!swapEnabled;
if (key === 'commDollar') return !!commissionEnabled;
if (key === 'pnlDollarNet' || key === 'pnlPercentNet') return !!(swapEnabled || commissionEna
~~~

### TF_TABLE1_SWAP_ENABLED_KEY @ 189061
~~~js
r.isFinite(r) && r >= 0)
currentRiskPercent = r;
const swapEnRaw = localStorage.getItem(TF_TABLE1_SWAP_ENABLED_KEY);
if (swapEnRaw !== null) swapEnabled = (swapEnRaw === '1' || swapEnRaw === 'true' || swapEnRaw === 'yes');
const swapRateRaw = parseFloat(localStorage.getItem(TF_TABLE1_SWAP_RATE_KEY));
if (Number.isFinite(swapRateRaw) && swapRateRaw >= 0) swapRatePerLot = swapRateRaw;
const commEnRaw = localStorage.getItem(TF_TABLE1_COMM_ENABLED_KEY);
if (commEnRaw !== null) commissionEnabled = (commEnRaw === '1' || commEnRaw === 'true' || commEnRaw === 'yes');
const commRateRaw = parseFloat(localStorage.getItem(TF_TABLE1_COMM_RATE_KEY));
if (Number.isFinite(commRateRaw) && commRateRaw >= 0) commissionRatePerLot = commRateRaw;
const oRaw = localStorage.getItem(TF_TABLE1_RISK_OVERRIDES_KEY);
if (oRaw) {
const obj = JSON.parse(oRaw);
if (obj && typeof obj === 'object') {
const clean = {};
Object.keys(obj).forEach((k) => {
const v = parseFloat(obj[k]);
if (Number.isFinite(v) && v >= 0)
clean[String(k)] = v;
});
analystRiskOverrides = clean;
}
}
const slRaw = localStorage.getItem(TF_SL_TYPE_SELECTION_KEY);
if (slRaw) {
const obj2 = JSON.parse(slRaw);
if (obj2 && typeof obj2 === 'object') {
const clean2 = {};
Object.keys(obj2).forEach((k) => {
const v = obj2[k];
if (v === 'fixed' || v === 'avg')
clean2[String(k)] = v;
});
slTypeSelectionByAnalyst = clean2;
}
}
try {
const wEnRaw = localStorage.getItem(TF_WITHDRAW_ENABLED_KEY);
if (wEnRaw !== null) {
withdrawEnabled = (wEnRaw === '1' || wEnRaw === 'true' || wEnRaw === 'yes');
}
const wAmtRaw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
const wAmt = parseFloat(wAmtRaw);
if (Number.isFinite(wAmt) && wAmt >= 0)
withdrawAmount = wAmt;
const wEveryRaw = localStorage.getItem(TF_WITHDRAW_EVERY_MONTHS_KEY);
const wEvery = parseInt(wEveryRaw, 10);
if (Number.isFinite(wEvery) && wEvery >= 1 && wEvery <= 12)
withdrawEveryMonths = wEvery;
}
catch (e) { }
}
catch (e) {
}
}
function tf_saveTable1StateToLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
localStorage.setItem(TF_TABLE1_BALANCE_KEY, String(currentBalance));
localStorage.setItem(TF_TABLE1_RISK_KEY, String(currentRiskPercent));
localStorage.setItem(TF_TABLE1_SWAP_ENABLED_KEY, swapEnabled ? '1' : '0');
localStorage.setItem(TF_TABLE1_SWAP_RATE_KEY, String(Number.isFinite(swapRatePerLot) ? swapRatePerLot : 9.01));
localStorage.setItem(TF_TABLE1_COMM_ENABLED_KEY, commissionEnabled ? '1' : '0');
localStorage.setItem(TF_TABLE1_COMM_RATE_KEY, String(Number.isFinite(commissionRatePerLot) ? commissionRatePerLot : 20));
localStorage.setItem(TF_TABLE1_RISK_OVERRIDES_KEY, JSON.stringify(analystRiskOverrides || {}));
localStorage.setItem(TF_SL_TYPE_SELECTION_KEY, JSON.stringify(slTypeSelectionByAnalyst || {}));
localStorage.setItem(TF_WITHDRAW_ENABLED_KEY, withdrawEnabled ? '1' : '0');
try {
if (Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
localStorage.setItem(TF_WITHDRAW_AMOUNT_KEY, String(withdrawAmount));
}
else {
localStorage.removeItem(TF_WITHDRAW_AMOUNT_KEY);
}
}
catch (e) { }
localStorage.setItem(TF_WITHDRAW_EVERY_MONTHS_KEY, String(withdrawEveryMonths || 1));
}
catch (e) {
}
}
function tf_roundTradeCostMoney(value) {
const n = Number(value);
if (!Number.isFinite(n)) return 0;
return Math.round((n + Number.EPSILON) * 100) / 100;
}
function tf_buildTradeCostFields(lot, grossPnlDollar, denom) {
const lotAbs = Math.abs(Number(lot) || 0);
const gross = Number.isFinite(Number(grossPnlDollar)) ? Number(grossPnlDollar) : 0;
const swapCost = swapEnabled ? tf_roundTradeCostMoney(lotAbs * Math.max(0, Number(swapRatePerLot) || 0)) : 0;
const commCost = commissionEnabled ? tf_roundTradeCostMoney(lotAbs * Math.max(0, Number(commissionRatePerLot) || 0)) : 0;
const swapDollar = -swapCost;
const commDollar = -commCost;
const pnlDollarNet = tf_roundTradeCostMoney(gross + swapDollar + commDollar);
const d = Math.abs(Number(denom) || 0);
const pnlPercentNet = d > 0 ? (pnlDollarNet / d) * 100 : 0;
return { swapDollar, commDollar, pnlDollarNet, pnlPercentNet };
}
function tf_getHistoryNetPnlDollar(row) {
if (!row) return 0;
if (row.isWithdraw) return Number.isFinite(Number(row.pnlDollar)) ? Number(row.pnlDollar) : 0;
if (Number.isFinite(Number(row.pnlDollarNet))) return Number(row.pnlDollarNet);
const gross = Number.isFinite(Number(row.pnlDollar)) ? Number(row.pnlDollar) : ((Number(row.dollarTP) || 0) - (Number(row.dollarSL) || 0));
return tf_buildTradeCostFields(row.lot, gross, row.balanceCompound || currentBalance || 0).pnlDollarNet;
}
function tf_getHistoryNetPnlPercent(row) {
if (!row || row.isWithdraw) return Number.isFinite(Number(row && row.pnlPercent)) ? Number(row.pnlPercent) : 0;
if (Number.isFinite(Number(row.pnlPercentNet))) return Number(row.pnlPercentNet);
const denom = Math.abs(Number(row.balanceCompound) || Number(currentBalance) || 0);
return tf_buildTradeCostFields(row.lot, Number(row.pnlDollar) || 0, denom).pnlPercentNet;
}
function tf_getCostAdjustedHeaderSuffix() {
if (commissionEnabled && swapEnabled) return ' + COMM & SWAP';
if (commissionEnabled) return ' + COMM';
if (swapEnabled) return ' + SWAP';
return ' (Net)';
}
function tf_updateCostAdjustedHeaders() {
try {
let mode = '';
if (commissionEnabled && swapEnabled) mode = 'COMM & SWAP';
else if (commissionEnabled) mode = 'COMM';
else if (swapEnabled) mode = 'SWAP';
const dollarTh = document.getElementById('history-pnl-dollar-net-th');
const pctTh = document.getElementById('history-pnl-percent-net-th');
if (dollarTh) dollarTh.innerHTML = mode ? ('PnL $ +<br>' + mode) : 'PnL $';
if (pctTh) pctTh.innerHTML = mode ? ('PnL % +<br>' + mode) : 'PnL %';
}
catch (e) { }
}
function tf_isHistoryCostColumnEnabled(key) {
if (key === 'swapDollar') return !!swapEnabled;
if (key === 'commDollar') return !!commissionEnabled;
if (key === 'pnlDollarNet' || key === 'pnlPercentNet') return !!(swapEnabled || commissionEnabled);
return true;
}
function tf_shouldHideHistoryColumn(key, visibility) {
return !!((visibility && visibility[key] === false) || !tf_isHistoryCostColumnEnabled(key));
}
function getRiskPercentForAnalyst(analystName, pair) {
if (analystName) {
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (Object.prototype.hasOwnProperty.call(analystRiskOverrides, key)) {
const v = analystRiskOverrides[key];
if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
return v;
}
}
}
return currentRiskPercent;
}
function setAnalystRiskOverride(analystName, pair, value) {
if (!analystName)
return;
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (value === null || !Number.isFinite(value) || value < 0) {
delete analystRiskOverrides[key];
}
else {
analystRiskOverrides[key] = value;
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function clearAllAnalystRiskOverrides() {
analystRiskOverrides = {};
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function normalizeWIBSuffix(s) {
if (s == null)
return s;
const t = String(s).trim();
return t.replace(/\s*(WIB\s*)+$/i, ' WIB').trim();
}
let historySignals = [];
let initialHistorySignals = null;
let monthlyStatsByAnalyst = {};
let slTypeSelectionByAnalyst = {};
let noDataPairsByAnalyst = {};
let avgSlPipsByAnalystPair = {};
const TF_TRADE_RANGE_STORAGE_KEY = 'tf_trade_time_range_v1';
const TF_TRADE_RANGE_OPTIONS = [
{ key: 'all', label: 'ALL', title: 'All', monthsBack: 0 },
{ key: 'm1', label: '1M', title: '1 Month', monthsBack: 1 },
{ key: 'm2', label: '2M', title: '2 Month', monthsBack: 2 },
{ key: 'm3', label: '3M', title: '3 Month', monthsBack: 3 },
{ key: 'm4', label: '4M', title: '4 Month', monthsBack: 4 },
{ key: 'm5', label: '5M', title: '5 Month', monthsBack: 5 },
{ key: 'm6', label: '6M', title: '6 Month', monthsBack: 6 },
{ key: 'm7', label: '7M', title: '7 Month', monthsBack: 7 },
{ key: 'm8', label: '8M', title: '8 Month', monthsBack: 8 },
{ key: 'm9', label: '9M', title: '9 Month', monthsBack: 9 },
{ key: 'm10', label: '10M', title: '10 Month', monthsBack: 10 },
{ key: 'm11', label: '11M', title: '11 Month', monthsBack: 11 },
{ key: 'y1', label: '1Y', title: '1 Year', monthsBack: 12 },
{ key: 'y2', label: '2Y', title: '2 Year', monthsBack: 24 },
{ key: 'y3', label: '3Y', title: '3 Year', monthsBack: 36 },
{ key: 'y5', label: '5Y', title: '5 Year', monthsBack: 60 }
];
let tfTradeTimeRangeKey = 'all';
const TF_SINGLE_MONTH_STORAGE_KEY = 'tf_trade_single_month_v1';
let tfTradeSingleMonthKey = '';
let allMonthKeysSorted = [];
const MAX_MONTH_COLUMNS = 12;
function rebuildMonthKeysFromStats() {
const set = new Set();
const stats = monthlyStatsByAnalyst || {};
Object.keys(stats).forEach((name) => {
const aStats = stats[name];
if (!aS
~~~

### TF_WITHDRAW_ENABLED_KEY @ 178697
~~~js
turn result;
}
function computeSlPipsFromHistory(analystName, pair) {
const stats = computeSlStatsFromHistory(analystName, pair);
if (!stats || !stats.fixed || stats.fixedCount < 5) {
return null;
}
return stats.fixed;
}
function tf_makeAnalystPairKey(analystName, pair) {
if (!analystName)
return '';
if (pair)
return analystName + '|' + String(pair).toUpperCase();
return analystName;
}
function getSelectedSlTypeForAnalyst(analystName, pair) {
if (!analystName)
return null;
const key = tf_makeAnalystPairKey(analystName, pair);
return slTypeSelectionByAnalyst[key] || null;
}
function setSelectedSlTypeForAnalyst(analystName, pair, type) {
if (!analystName)
return;
const key = tf_makeAnalystPairKey(analystName, pair);
if (type === 'fixed' || type === 'avg') {
slTypeSelectionByAnalyst[key] = type;
}
else {
delete slTypeSelectionByAnalyst[key];
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function getEffectiveSlForAnalyst(analystName, pairOrStats, maybeStats) {
let pair = null;
let precomputedStats = null;
if (pairOrStats && typeof pairOrStats === 'object' && maybeStats === undefined) {
precomputedStats = pairOrStats;
}
else {
pair = pairOrStats || null;
precomputedStats = maybeStats || null;
}
const stats = precomputedStats || computeSlStatsFromHistory(analystName, pair);
let type = getSelectedSlTypeForAnalyst(analystName, pair);
if (type === 'fixed' && (!stats.fixed || stats.fixedCount < 5)) {
type = null;
}
if (type === 'avg' && !stats.avg) {
type = null;
}
if (!type) {
if (stats.fixed && stats.fixedCount >= 5) {
type = 'fixed';
}
else if (stats.avg) {
type = 'avg';
}
else {
type = null;
}
}
if (type) {
setSelectedSlTypeForAnalyst(analystName, pair, type);
}
let pips = 0;
if (type === 'fixed') {
pips = stats.fixed || 0;
}
else if (type === 'avg') {
pips = stats.avg || 0;
}
return { type, pips };
}
let currentBalance = 5000;
let currentRiskPercent = 1;
let swapEnabled = false;
let swapRatePerLot = 9.01;
let commissionEnabled = false;
let commissionRatePerLot = 20;
let withdrawEnabled = false;
let withdrawAmount = 0;
let withdrawEveryMonths = 1;
let withdrawDraftEnabled = false;
let withdrawDraftAmount = null;
let withdrawDraftEveryMonths = 1;
const TF_WITHDRAW_ENABLED_KEY = "tf_withdraw_enabled";
const TF_WITHDRAW_AMOUNT_KEY = "tf_withdraw_amount";
const TF_WITHDRAW_EVERY_MONTHS_KEY = "tf_withdraw_every_months";
const TF_WITHDRAW_MIN_MONTHKEY = "2023-01";
const TF_INCOME_MINMAX_START_MONTHKEY = "2024-01";
function tf_monthIndexFromMonthKeySimple(monthKey) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
return (y * 12) + (mo - 1);
}
function tf_isWithdrawDueMonth(monthKey, everyMonths) {
const every = Number.isFinite(everyMonths) ? Math.max(1, Math.min(12, Math.floor(everyMonths))) : 1;
if (typeof monthKey !== 'string' || !/^\d{4}-\d{2}$/.test(monthKey))
return false;
if (monthKey < TF_WITHDRAW_MIN_MONTHKEY)
return false;
const idx = tf_monthIndexFromMonthKeySimple(monthKey);
const anchor = tf_monthIndexFromMonthKeySimple(TF_WITHDRAW_MIN_MONTHKEY);
if (idx === null || anchor === null)
return false;
return ((idx - anchor) % every) === 0;
}
let withdrawMaxAllowed = null;
let withdrawMinSuggested = null;
let withdrawDraftTouched = false;
let withdrawDraftAutoFilled = false;
function tf_setWithdrawAverageText(maxOrNull, priceBusy) {
try {
const elInline = document.getElementById('withdraw-average-inline');
const elInlineEq = document.getElementById('withdraw-average-inline-equity');
const elInlineHistory = document.getElementById('withdraw-average-inline-history');
const elLegacy = document.getElementById('withdraw-average-text');
const setText = (t) => {
if (elInline)
elInline.textContent = t;
if (elInlineEq)
elInlineEq.textContent = t;
if (elInlineHistory)
elInlineHistory.textContent = t;
if (elLegacy)
elLegacy.textContent = t;
const eqInput = document.getElementById('withdraw-amount-input-equity');
if (eqInput)
eqInput.placeholder = t;
const histInput = document.getElementById('withdraw-amount-input-history');
if (histInput)
histInput.placeholder = t;
};
if (priceBusy) {
setText('average : -');
return;
}
if (maxOrNull === null || maxOrNull === undefined || !Number.isFinite(maxOrNull)) {
setText('average : -');
return;
}
setText(`average : ${formatMoney(Math.max(0, maxOrNull))}`);
}
catch (e) { }
}
function tf_setWithdrawMaxWarningVisible(visible, message) {
try {
const els = [
document.getElementById('withdraw-max-warning'),
document.getElementById('withdraw-max-warning-equity'),
document.getElementById('withdraw-max-warning-history')
].filter(Boolean);
if (!els.length)
return;
els.forEach((el) => {
if (visible) {
el.textContent = message || '';
el.style.display = 'block';
}
else {
el.textContent = '';
el.style.display = 'none';
}
});
}
catch (e) { }
}
function tf_getWithdrawMaxAllowedOrNull() {
return (Number.isFinite(withdrawMaxAllowed) && withdrawMaxAllowed >= 0) ? withdrawMaxAllowed : null;
}
function tf_enforceWithdrawAmountMax(showWarning, sourceInputEl) {
try {
const max = tf_getWithdrawMaxAllowedOrNull();
const inputsRaw = [
sourceInputEl,
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity'),
document.getElementById('withdraw-amount-input-history')
].filter(Boolean);
const seen = new Set();
const inputs = inputsRaw.filter((el) => {
const k = el && el.id ? el.id : String(el);
if (seen.has(k))
return false;
seen.add(k);
return true;
});
const input = inputs[0];
if (!input)
return false;
if (max === null) {
tf_setWithdrawMaxWarningVisible(false);
return false;
}
const rawStr = String(input.value || '').trim();
if (rawStr === '') {
withdrawDraftAmount = null;
tf_setWithdrawMaxWarningVisible(false);
inputs.forEach((el) => {
try {
el.value = '';
}
catch (e) { }
});
return false;
}
let v = safeParseFloat(input.value);
if (v === null || v < 0)
v = 0;
withdrawDraftAmount = v;
const exceeded = (v > max + 1e-9);
if (exceeded) {
const clamped = Math.max(0, max);
withdrawDraftAmount = clamped;
input.value = String(Math.round(clamped * 100) / 100);
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = input.value;
}
catch (e) { }
});
tf_setWithdrawMaxWarningVisible(true, `Withdraw tidak boleh melebihi ${formatMoney(clamped)}`);
return true;
}
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = String(input.value || '');
}
catch (e) { }
});
if (showWarning) {
tf_setWithdrawMaxWarningVisible(false);
}
return false;
}
catch (e) {
return false;
}
}
function tf_updateWithdrawMaxAllowedFromMonthlyIncome(incomeValuesGross, priceBusy) {
try {
if (priceBusy || !Array.isArray(incomeValuesGross) || !incomeValuesGross.length) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, priceBusy);
return;
}
let sum = 0;
let n = 0;
for (let i = 0; i < incomeValuesGross.length; i++) {
const v = incomeValuesGross[i];
if (!Number.isFinite(v))
continue;
sum += v;
n += 1;
}
if (!n) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
return;
}
const avg = sum / n;
withdrawMaxAllowed = Math.max(0, avg);
tf_setWithdrawAverageText(withdrawMaxAllowed, false);
tf_enforceWithdrawAmountMax(true);
}
catch (e) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
}
}
function tf_tryAutoFillWithdrawDraftFromSuggested() {
try {
if (withdrawDraftTouched)
return;
if (withdrawDraftAutoFilled)
return;
if (!Number.isFinite(withdrawMinSuggested) || withdrawMinSuggested === null)
return;
let hasStored = false;
let storedVal = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
hasStored = (raw !== null && raw !== undefined && String(raw).trim() !== '');
storedVal = safeParseFloat(raw);
}
}
catch (e) { }
if (hasStored && Number.isFinite(storedVal) && storedVal > 0)
return;
if (Number.isFinite(withdrawDraftAmount) && withdrawDraftAmount > 0)
return;
const inputs = [
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity')
].filter(Boolean);
if (!inputs.length)
return;
const v = Math.max(0, Number(withdrawMinSuggested) || 0);
withdrawDraftAmount = v;
const strVal = String(Math.round(v * 100) / 100);
inputs.forEach((el) => {
try {
el.value = strVal;
}
catch (e) { }
});
tf_enforceWithdrawAmountMax(true, inputs[0]);
withdrawDraftAutoFilled = true;
}
catch (e) { }
}
function tf_updateWithdrawMinSuggestedFromMonthlyIncome(monthlyGrossByMonth, priceBusy) {
try {
if (priceBusy || !
~~~

### TF_WITHDRAW_AMOUNT_KEY @ 432871
~~~js
hdrawAmountInputs = [withdrawAmountInput, withdrawAmountInputEquity, withdrawAmountInputHistory].filter(Boolean);
const withdrawMonthsSelects = [withdrawMonthsSelect, withdrawMonthsSelectEquity, withdrawMonthsSelectHistory].filter(Boolean);
const withdrawSubmitBtns = [withdrawSubmitBtn, withdrawSubmitBtnEquity, withdrawSubmitBtnHistory].filter(Boolean);
const swapSyncTickers = ['monthly', 'equity', 'history'].map((scope) => document.getElementById('swap-enabled-ticker-' + scope)).filter(Boolean);
const commissionSyncTickers = ['monthly', 'equity', 'history'].map((scope) => document.getElementById('commission-enabled-ticker-' + scope)).filter(Boolean);
function syncCostEnableControls() {
if (swapToggle) swapToggle.checked = !!swapEnabled;
if (commissionToggle) commissionToggle.checked = !!commissionEnabled;
swapSyncTickers.forEach((el) => { try { el.checked = !!swapEnabled; } catch (e) { } });
commissionSyncTickers.forEach((el) => { try { el.checked = !!commissionEnabled; } catch (e) { } });
try { tf_updateCostAdjustedHeaders(); } catch (e) { }
try { tf_applyHistoryColumnVisibility(); } catch (e) { }
}
function refreshCostDependentViews() {
try { tf_saveTable1StateToLocalStorage(); } catch (e) { }
try { syncCostEnableControls(); } catch (e) { }
try { recomputeHistoryRows(); } catch (e) { }
}
function setCostEnabledFromControl(kind, checked) {
if (kind === 'swap') swapEnabled = !!checked;
else if (kind === 'commission') commissionEnabled = !!checked;
refreshCostDependentViews();
}
function syncInputs() {
if (balanceInput)
balanceInput.value = currentBalance;
if (riskInput)
riskInput.value = currentRiskPercent;
if (swapRateInput) swapRateInput.value = Number.isFinite(swapRatePerLot) ? swapRatePerLot : 9.01;
if (commissionRateInput) commissionRateInput.value = Number.isFinite(commissionRatePerLot) ? commissionRatePerLot : 20;
syncCostEnableControls();
const hasWithdrawUi = withdrawToggles.length && withdrawAmountInputs.length && withdrawMonthsSelects.length;
if (hasWithdrawUi) {
withdrawDraftEnabled = !!withdrawEnabled;
let _hasStoredWithdrawAmt = false;
let _storedWithdrawAmt = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
_hasStoredWithdrawAmt = (raw !== null && raw !== undefined && String(raw).trim() !== '');
_storedWithdrawAmt = safeParseFloat(raw);
}
}
catch (e) { }
withdrawDraftAmount = (_hasStoredWithdrawAmt && Number.isFinite(_storedWithdrawAmt)) ? Math.max(0, _storedWithdrawAmt) : null;
withdrawDraftEveryMonths = (Number.isFinite(withdrawEveryMonths) ? withdrawEveryMonths : 1);
withdrawDraftTouched = false;
withdrawDraftAutoFilled = false;
withdrawToggles.forEach((t) => {
try {
t.checked = !!withdrawDraftEnabled;
}
catch (e) { }
});
withdrawSubmitBtns.forEach((btn) => {
if (!btn)
return;
btn.disabled = !withdrawDraftEnabled;
btn.title = withdrawDraftEnabled ? "" : "Enable Withdraw to apply";
});
const amtStr = (withdrawDraftAmount === null || !Number.isFinite(withdrawDraftAmount)) ? '' : String(withdrawDraftAmount);
withdrawAmountInputs.forEach((inp) => {
if (!inp)
return;
inp.value = amtStr;
inp.disabled = false;
});
const monthsStr = String(withdrawDraftEveryMonths || 1);
withdrawMonthsSelects.forEach((sel) => {
if (!sel)
return;
sel.value = monthsStr;
sel.disabled = false;
});
try {
tf_enforceWithdrawAmountMax(false, withdrawAmountInputs[0]);
}
catch (e) { }
try {
tf_setWithdrawAverageText(tf_getWithdrawMaxAllowedOrNull(), false);
}
catch (e) { }
try {
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) { }
}
}
syncInputs();
const hasWithdrawUi = withdrawToggles.length && withdrawAmountInputs.length && withdrawMonthsSelects.length;
if (hasWithdrawUi) {
withdrawToggles.forEach((toggleEl) => {
toggleEl.addEventListener('change', () => {
const checked = !!toggleEl.checked;
withdrawDraftEnabled = checked;
withdrawToggles.forEach((t) => {
if (t === toggleEl)
return;
try {
t.checked = checked;
}
catch (e) { }
});
withdrawSubmitBtns.forEach((btn) => {
if (!btn)
return;
btn.disabled = !checked;
btn.title = checked ? "" : "Enable Withdraw to apply";
});
if (!checked) {
withdrawEnabled = false;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
renderMonthlyTotals();
}
catch (e) { }
}
});
});
withdrawAmountInputs.forEach((inp) => {
inp.addEventListener('input', () => {
withdrawDraftTouched = true;
const raw = String(inp.value || '').trim();
if (raw === '') {
withdrawDraftAmount = null;
}
else {
const v = safeParseFloat(raw);
withdrawDraftAmount = (v === null || v < 0) ? 0 : v;
}
try {
tf_enforceWithdrawAmountMax(true, inp);
}
catch (e) { }
});
});
withdrawMonthsSelects.forEach((sel) => {
sel.addEventListener('change', () => {
const v = parseInt(sel.value, 10);
withdrawDraftEveryMonths = (Number.isFinite(v) && v >= 1 && v <= 12) ? v : 1;
const str = String(withdrawDraftEveryMonths || 1);
withdrawMonthsSelects.forEach((s) => {
if (s === sel)
return;
try {
s.value = str;
}
catch (e) { }
});
});
});
}
if (hasWithdrawUi && withdrawSubmitBtns.length) {
withdrawSubmitBtns.forEach((btn) => {
btn.addEventListener('click', () => {
if (equityMetric !== 'usd') {
alert('Withdraw hanya tersedia saat Filter by: PnL ($).');
return;
}
const toggleRef = withdrawToggles[0];
const inputRef = withdrawAmountInputs[0];
const monthsRef = withdrawMonthsSelects[0];
if (!toggleRef || !inputRef || !monthsRef)
return;
withdrawDraftEnabled = !!toggleRef.checked;
const v0 = safeParseFloat(inputRef.value);
withdrawDraftAmount = (v0 === null || v0 < 0) ? 0 : v0;
const m0 = parseInt(monthsRef.value, 10);
withdrawDraftEveryMonths = (Number.isFinite(m0) && m0 >= 1 && m0 <= 12) ? m0 : 1;
try {
tf_enforceWithdrawAmountMax(true, inputRef);
}
catch (e) { }
const v1 = safeParseFloat(inputRef.value);
withdrawDraftAmount = (v1 === null || v1 < 0) ? 0 : v1;
withdrawEnabled = !!withdrawDraftEnabled;
withdrawAmount = withdrawDraftAmount;
withdrawEveryMonths = withdrawDraftEveryMonths;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
recomputeHistoryRows();
renderMonthlyTotals();
});
});
}
if (swapToggle) {
swapToggle.addEventListener('change', () => {
setCostEnabledFromControl('swap', !!swapToggle.checked);
});
}
if (commissionToggle) {
commissionToggle.addEventListener('change', () => {
setCostEnabledFromControl('commission', !!commissionToggle.checked);
});
}
swapSyncTickers.forEach((ticker) => {
ticker.addEventListener('change', () => {
setCostEnabledFromControl('swap', !!ticker.checked);
});
});
commissionSyncTickers.forEach((ticker) => {
ticker.addEventListener('change', () => {
setCostEnabledFromControl('commission', !!ticker.checked);
});
});
function bindAutoCostRateInput(input, kind) {
if (!input) return;
input.addEventListener('input', () => {
const v = safeParseFloat(input.value);
if (v === null || v < 0) return;
if (kind === 'swap') swapRatePerLot = v;
else commissionRatePerLot = v;
refreshCostDependentViews();
});
input.addEventListener('change', () => {
const v = safeParseFloat(input.value);
if (v === null || v < 0) {
if (kind === 'swap') input.value = Number.isFinite(swapRatePerLot) ? swapRatePerLot : 9.01;
else input.value = Number.isFinite(commissionRatePerLot) ? commissionRatePerLot : 20;
return;
}
if (kind === 'swap') swapRatePerLot = v;
else commissionRatePerLot = v;
refreshCostDependentViews();
});
}
bindAutoCostRateInput(swapRateInput, 'swap');
bindAutoCostRateInput(commissionRateInput, 'commission');
applyBalanceBtn.addEventListener('click', () => {
const v = safeParseFloat(balanceInput.value);
if (v === null || v <= 0) {
alert('Balance tidak valid. Isi angka lebih besar dari 0.');
if (balanceInput)
balanceInput.value = currentBalance;
return;
}
currentBalance = v;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
renderSummaryTable();
recomputeHistoryRows();
});
applyRiskBtn.addEventListener('click', () => {
const v = safeParseFloat(riskInput.value);
if (v === null || v < 0) {
alert('Risk % / Trade tidak valid.');
if (riskInput)
riskInput.value = currentRiskPercent;
return;
}
currentRiskPercent = v;
clearAllAnalystRiskOverrides();
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
renderSummaryTable();
recomputeHistoryRows();
});
resetBtn.addEventListener('click', () => {
currentBalance = 5000;
currentRiskPercent = 1;
swapEnabled = false;
swapRatePerLot = 9.01;
commissionEnabled = false;
commissionRatePerLot = 20;
withdrawEnabled = false;
withdrawAmount = 0;
withdrawEveryMonths = 1;
clearAllAnalystRiskOverrides();
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
syncInputs();
renderSummaryTable();
recomputeHistoryRows();
});
}
function makeEmptyStreakState(
~~~

### RISK_MODE_STORAGE_KEY @ 224288
~~~js
s = Number.isFinite(row.pnlPips) ? row.pnlPips
: (Number.isFinite(row.pips) ? row.pips : (Number(row.pips) || 0));
row.pnlPips = pnlPips;
const riskPercent = Math.max(0, Number(row.riskPercent) || 0);
const dollarPerPip = Math.abs(Number(row.dollarPerPip) || 0);
const slPips = tf_getEffectiveSlPipsForRecompute(analyst, pair);
const baseKey = Number.isFinite(sizingBase) ? Math.round(sizingBase * 100) : 0;
const cacheKey = (currentPeriodStartKey || '') + '|' + (currentMonthKey || '') + '|' + analyst + '|' + pair
+ '|B' + baseKey + '|R' + Math.round(riskPercent * 1000) + '|D' + Math.round(dollarPerPip * 10000) + '|S' + Math.round(slPips * 1000);
let lot = 0;
if (lotCache.has(cacheKey)) {
lot = lotCache.get(cacheKey) || 0;
}
else {
let calcLot = 0;
const baseForLot = Math.max(0, Number(sizingBase) || 0);
if (baseForLot > 0 && slPips > 0 && dollarPerPip > 0) {
calcLot = computeLot(baseForLot, riskPercent, slPips, dollarPerPip);
if (!Number.isFinite(calcLot) || calcLot <= 0)
calcLot = 0;
else
calcLot = roundLotToTwoDecimals(calcLot);
}
lotCache.set(cacheKey, calcLot);
lot = calcLot;
}
row.lot = lot;
row.balanceCompound = sizingBase;
const pnlDollar = (Number.isFinite(pnlPips) && Number.isFinite(lot) && Number.isFinite(dollarPerPip))
? (pnlPips * lot * dollarPerPip)
: 0;
row.pnlDollar = pnlDollar;
row.pipsTP = pnlPips > 0 ? pnlPips : 0;
row.pipsSL = pnlPips < 0 ? Math.abs(pnlPips) : 0;
row.dollarTP = pnlDollar > 0 ? pnlDollar : 0;
row.dollarSL = pnlDollar < 0 ? Math.abs(pnlDollar) : 0;
const denom = Math.abs(Number(sizingBase) || 0);
row.pnlPercent = denom > 0 ? (pnlDollar / denom) * 100 : 0;
const costFields = tf_buildTradeCostFields(lot, pnlDollar, denom);
Object.assign(row, costFields);
if (enabled) {
runningTradeOnly += costFields.pnlDollarNet;
runningEquity += costFields.pnlDollarNet;
}
row.balanceTradeOnly = runningTradeOnly;
row.balancePnl = runningEquity;
}
}
catch (e) {
}
}
let tf_lastEquityCalcRows = [];
let lastHistoryRiskMode = 'fixed';
let equityFilterMin = null;
let equityFilterMax = null;
let equityFilterStart = null;
let equityFilterEnd = null;
let equityMetric = 'usd';
const EQUITY_METRIC_STORAGE_KEY = 'tf_equity_metric';
let riskMode = 'fixed';
const RISK_MODE_STORAGE_KEY = 'tf_risk_mode';
let compoundMonths = 1;
const COMPOUND_MONTHS_STORAGE_KEY = 'tf_compound_months';
function formatMoney(value) {
if (!isFinite(value))
return '-';
return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function formatPlainNumber(value, decimals = 2) {
if (!isFinite(value))
return '-';
const v = Number(value);
const absStr = Math.abs(v).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
return v < 0 ? ('-' + absStr) : absStr;
}
function formatSignedMoney(value) {
if (!isFinite(value))
return '-';
const abs = Math.abs(value);
const base = formatMoney(abs);
if (value < 0) {
return '-' + base;
}
if (value > 0) {
return '+' + base;
}
return base;
}
function formatNumber(value, decimals = 2) {
if (!isFinite(value))
return '-';
return value.toFixed(decimals);
}
function formatPips(value, decimals = 1) {
if (!isFinite(value))
return '-';
return value.toFixed(decimals) + ' pips';
}
function formatSignedPips(value, decimals = 1) {
if (!isFinite(value))
return '-';
const abs = Math.abs(value);
const base = formatPips(abs, decimals);
if (value < 0)
return '-' + base;
if (value > 0)
return '+' + base;
return formatPips(0, decimals);
}
function loadEquityMetricPreference() {
try {
const saved = localStorage.getItem(EQUITY_METRIC_STORAGE_KEY);
if (saved === 'usd' || saved === 'pips') {
equityMetric = saved;
}
}
catch (e) {
}
}
function saveEquityMetricPreference() {
try {
localStorage.setItem(EQUITY_METRIC_STORAGE_KEY, equityMetric);
}
catch (e) {
}
}
function loadRiskModePreference() {
// REV177: Fixed Lot is always the default whenever the page is opened.
// Users can still switch to Compound % for the current session.
riskMode = 'fixed';
try {
localStorage.setItem(RISK_MODE_STORAGE_KEY, 'fixed');
}
catch (e) {
}
}
function loadCompoundMonthsPreference() {
try {
const saved = parseInt(localStorage.getItem(COMPOUND_MONTHS_STORAGE_KEY), 10);
if (Number.isFinite(saved) && saved >= 1 && saved <= 12) {
compoundMonths = saved;
}
}
catch (e) {
}
}
function saveCompoundMonthsPreference() {
try {
localStorage.setItem(COMPOUND_MONTHS_STORAGE_KEY, String(compoundMonths));
}
catch (e) {
}
}
function tf_monthKeyFromSortKey(sortKey) {
if (typeof sortKey === 'number' && isFinite(sortKey)) {
const d = new Date(sortKey);
if (!isNaN(d.getTime())) {
const yyyy = d.getFullYear();
const mm = d.getMonth() + 1;
return String(yyyy).padStart(4, '0') + '-' + String(mm).padStart(2, '0');
}
}
else if (typeof sortKey === 'string' && sortKey.length >= 7) {
const candidate = sortKey.slice(0, 7);
if (/^\d{4}-\d{2}$/.test(candidate))
return candidate;
}
return null;
}
function tf_getPrimarySortKey(row) {
try {
const sk = row && row.sortKey;
if (typeof sk === 'number' && isFinite(sk))
return sk;
const ck = row && row.createdSortKey;
if (typeof ck === 'number' && isFinite(ck))
return ck;
}
catch (e) { }
return null;
}
function tf_firstDaySortKeyFromMonthKey(monthKey) {
const m = String(monthKey || '').match(/^([0-9]{4})-([0-9]{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
const d = new Date(y, mo - 1, 1, 0, 0, 0, 0);
const ms = d.getTime();
return (typeof ms === 'number' && isFinite(ms)) ? ms : null;
}
function tf_firstDayDisplayDateFromMonthKey(monthKey) {
const m = String(monthKey || '').match(/^([0-9]{4})-([0-9]{2})$/);
if (!m)
return '';
const yyyy = m[1];
const mm = m[2];
return `01-${mm}-${yyyy}`;
}
function tf_shiftMonthKey(monthKey, deltaMonths) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
let y = parseInt(m[1], 10);
let mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
mo += (Number.isFinite(deltaMonths) ? deltaMonths : 0);
while (mo <= 0) {
mo += 12;
y -= 1;
}
while (mo > 12) {
mo -= 12;
y += 1;
}
return String(y).padStart(4, '0') + '-' + String(mo).padStart(2, '0');
}
function tf_setCompoundSubRowsVisible(isVisible) {
const ids = ['compound-sub-row-equity', 'compound-sub-row-history', 'compound-sub-row-monthly'];
ids.forEach((id) => {
const el = document.getElementById(id);
if (!el)
return;
el.style.display = isVisible ? '' : 'none';
});
}
function tf_updateHistoryBalanceHeaderLabel(currentRiskMode) {
const th = document.getElementById('history-balance-base-th');
if (!th)
return;
th.textContent = currentRiskMode === 'compound' ? 'Balance Compounded' : 'Balance';
}
function tf_setRiskModeRowsVisible(isVisible) {
const selIds = ['risk-mode-select', 'risk-mode-select-history', 'risk-mode-select-monthly'];
selIds.forEach((id) => {
const sel = document.getElementById(id);
if (!sel)
return;
const row = sel.closest ? sel.closest('.equity-filter-row') : null;
if (!row)
return;
row.style.display = isVisible ? '' : 'none';
});
}
function tf_getAllRiskModeSelects() {
return Array.from(document.querySelectorAll('#risk-mode-select, #risk-mode-select-history, #risk-mode-select-monthly'));
}
function tf_getAllCompoundMonthsSelects() {
return Array.from(document.querySelectorAll('#compound-months-select-equity, #compound-months-select-history, #compound-months-select-monthly'));
}
function tf_renderCompoundMonthsOptions(monthCount) {
const sels = tf_getAllCompoundMonthsSelects();
if (!sels.length)
return;
const safeCount = Number.isFinite(monthCount) ? Math.max(0, Math.floor(monthCount)) : 0;
if (safeCount > 0 && compoundMonths > safeCount) {
compoundMonths = safeCount;
saveCompoundMonthsPreference();
}
if (compoundMonths < 1)
compoundMonths = 1;
if (compoundMonths > 12)
compoundMonths = 12;
sels.forEach((sel) => {
const previous = sel.value;
sel.innerHTML = '';
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = i === 1 ? '1 month' : String(i) + ' month';
if (safeCount > 0 && i > safeCount) {
opt.disabled = true;
}
sel.appendChild(opt);
}
try {
sel.value = String(compoundMonths);
if (!sel.value && previous)
sel.value = previous;
}
catch (e) { }
});
}
function tf_buildMonthEndBalanceMapFromHistoryRows(rows) {
const map = Object.create(null);
if (!Array.isArray(rows))
return map;
for (let i = 0; i < rows.length; i++) {
const r = rows[i];
const mk = tf_monthKeyFromSortKey(tf_getPrimarySortKey(r));
if (mk) {
map[mk] = (r && Number.isFinite(r.balanceTradeOnly)) ? r.balanceTradeOnly : ((r && Number.isFinite(r.balancePnl)) ? r.balancePnl : map[mk]);
}
}
return map;
}
function tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBala
~~~

### RISK_MODE_STORAGE_KEY @ 231429
~~~js
risk-mode-select-monthly'));
}
function tf_getAllCompoundMonthsSelects() {
return Array.from(document.querySelectorAll('#compound-months-select-equity, #compound-months-select-history, #compound-months-select-monthly'));
}
function tf_renderCompoundMonthsOptions(monthCount) {
const sels = tf_getAllCompoundMonthsSelects();
if (!sels.length)
return;
const safeCount = Number.isFinite(monthCount) ? Math.max(0, Math.floor(monthCount)) : 0;
if (safeCount > 0 && compoundMonths > safeCount) {
compoundMonths = safeCount;
saveCompoundMonthsPreference();
}
if (compoundMonths < 1)
compoundMonths = 1;
if (compoundMonths > 12)
compoundMonths = 12;
sels.forEach((sel) => {
const previous = sel.value;
sel.innerHTML = '';
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = i === 1 ? '1 month' : String(i) + ' month';
if (safeCount > 0 && i > safeCount) {
opt.disabled = true;
}
sel.appendChild(opt);
}
try {
sel.value = String(compoundMonths);
if (!sel.value && previous)
sel.value = previous;
}
catch (e) { }
});
}
function tf_buildMonthEndBalanceMapFromHistoryRows(rows) {
const map = Object.create(null);
if (!Array.isArray(rows))
return map;
for (let i = 0; i < rows.length; i++) {
const r = rows[i];
const mk = tf_monthKeyFromSortKey(tf_getPrimarySortKey(r));
if (mk) {
map[mk] = (r && Number.isFinite(r.balanceTradeOnly)) ? r.balanceTradeOnly : ((r && Number.isFinite(r.balancePnl)) ? r.balancePnl : map[mk]);
}
}
return map;
}
function tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBalanceMap, fallbackBalance) {
const offset = Number.isFinite(compoundMonths) ? Math.max(1, Math.min(12, Math.floor(compoundMonths))) : 1;
const targetKey = tf_shiftMonthKey(monthKey, -offset);
if (targetKey && monthEndBalanceMap) {
let k = targetKey;
for (let i = 0; i < 36 && k; i++) {
if (Object.prototype.hasOwnProperty.call(monthEndBalanceMap, k)) {
const v = monthEndBalanceMap[k];
if (Number.isFinite(v))
return v;
}
k = tf_shiftMonthKey(k, -1);
}
}
if (Number.isFinite(fallbackBalance))
return fallbackBalance;
return Number.isFinite(currentBalance) ? currentBalance : 0;
}
function saveRiskModePreference() {
try {
localStorage.setItem(RISK_MODE_STORAGE_KEY, riskMode);
}
catch (e) {
}
}
function formatEquityMetricAxis(value) {
if (equityMetric === 'usd') {
if (!isFinite(value)) return '-';
const n = Number(value);
if (Math.abs(n) < 0.005) return '$0';
// REV364: match the APK compact Equity Y-axis format.
// From $1,000 upward use 0.5K increments; smaller values keep full money.
if (Math.abs(n) >= 1000) {
const roundedK = Math.round((n / 1000) * 2) / 2;
const absK = Math.abs(roundedK);
const compactK = Number.isInteger(absK) ? String(absK) : absK.toFixed(1).replace('.', ',');
return (roundedK < 0 ? '-$' : '$') + compactK + 'K';
}
return formatMoney(n);
}
if (!isFinite(value))
return '-';
return value.toFixed(1);
}
function formatEquityMetricSigned(value) {
return equityMetric === 'usd' ? formatSignedMoney(value) : formatSignedPips(value, 1);
}
function formatEquityMetricValue(value) {
return equityMetric === 'usd' ? formatMoney(value) : formatPips(value, 1);
}
function updateEquityCurveCopyForMetric() {
const titleEl = document.getElementById('equity-curve-title');
const badgeEl = document.getElementById('equity-curve-badge-text');
if (titleEl) {
titleEl.textContent =
equityMetric === 'usd'
? 'Equity Curve – Akumulasi $ per Trade'
: 'Equity Curve – Akumulasi Pips per Trade';
}
if (badgeEl) {
badgeEl.textContent =
equityMetric === 'usd'
? 'Hover untuk detail $ dan Equity'
: 'Hover untuk detail Pips dan Akumulasi';
}
}
function tf_updateUiForEquityMetric() {
try {
const isUsd = (equityMetric === 'usd');
try {
tf_setRiskModeRowsVisible(isUsd);
}
catch (e) { }
try {
tf_setCompoundSubRowsVisible(isUsd && (riskMode === 'compound'));
}
catch (e) { }
const withdrawToggleMain = document.getElementById('withdraw-enabled-toggle');
const withdrawAmountInputMain = document.getElementById('withdraw-amount-input');
const withdrawMonthsSelectMain = document.getElementById('withdraw-months-select');
const withdrawSubmitBtnMain = document.getElementById('withdraw-submit-btn');
const withdrawToggleEq = document.getElementById('withdraw-enabled-toggle-equity');
const withdrawAmountInputEq = document.getElementById('withdraw-amount-input-equity');
const withdrawMonthsSelectEq = document.getElementById('withdraw-months-select-equity');
const withdrawSubmitBtnEq = document.getElementById('withdraw-submit-btn-equity');
const withdrawToggleHistory = document.getElementById('withdraw-enabled-toggle-history');
const withdrawAmountInputHistory = document.getElementById('withdraw-amount-input-history');
const withdrawMonthsSelectHistory = document.getElementById('withdraw-months-select-history');
const withdrawSubmitBtnHistory = document.getElementById('withdraw-submit-btn-history');
const withdrawGroups = [
{ toggle: withdrawToggleMain, amount: withdrawAmountInputMain, months: withdrawMonthsSelectMain, submit: withdrawSubmitBtnMain },
{ toggle: withdrawToggleEq, amount: withdrawAmountInputEq, months: withdrawMonthsSelectEq, submit: withdrawSubmitBtnEq },
{ toggle: withdrawToggleHistory, amount: withdrawAmountInputHistory, months: withdrawMonthsSelectHistory, submit: withdrawSubmitBtnHistory }
];
const disabledTitle = isUsd ? '' : 'Tidak tersedia saat Filter by: PnL Pips';
try {
const primaryRiskTitle = document.querySelector('#equity-drawdown-summary > .equity-drawdown-summary-title');
if (primaryRiskTitle) {
primaryRiskTitle.textContent = isUsd
? 'Ringkasan Risiko — Consecutive Loss & Maximum Equity Drawdown'
: 'Ringkasan Risiko Pips — Consecutive Loss & Maximum Pips Drawdown';
}
}
catch (e) { }
withdrawGroups.forEach((g) => {
[g.toggle, g.amount, g.months, g.submit].forEach((el) => {
if (!el)
return;
el.disabled = !isUsd;
if (!isUsd)
el.title = disabledTitle;
});
});
if (isUsd) {
withdrawGroups.forEach((g) => {
if (g.submit && g.toggle) {
g.submit.disabled = !g.toggle.checked;
g.submit.title = g.toggle.checked ? '' : 'Enable Withdraw to apply';
}
});
}
}
catch (e) { }
}
function computeLot(balance, riskPercent, pipsPerTrade, dollarPerPip) {
const riskAmount = (balance * riskPercent) / 100;
const denom = pipsPerTrade * dollarPerPip;
if (denom <= 0)
return 0;
return riskAmount / denom;
}
function roundLotToTwoDecimals(lot) {
if (!Number.isFinite(lot) || lot <= 0)
return 0;
const scaled = lot * 100;
const scaledFloor = Math.floor(scaled);
const diff = scaled - scaledFloor;
let roundedScaled;
if (diff > 0.5) {
roundedScaled = scaledFloor + 1;
}
else {
roundedScaled = scaledFloor;
}
return roundedScaled / 100;
}
function computeFixedLot(balance, riskPercent, pipsPerTrade, dollarPerPip) {
const rawLot = computeLot(balance, riskPercent, pipsPerTrade, dollarPerPip);
return roundLotToTwoDecimals(rawLot);
}
function safeParseFloat(v) {
const n = parseFloat(v);
return isNaN(n) ? null : n;
}
function parseDateFromInputs(dateStr, timeStr) {
const parts = (dateStr || '').trim().split('-');
if (parts.length !== 3)
return null;
const [ddStr, mmStr, yyyyStr] = parts;
const dd = parseInt(ddStr, 10);
const mm = parseInt(mmStr, 10);
const yyyy = parseInt(yyyyStr, 10);
let hh = 0;
let min = 0;
if ((timeStr || '').trim()) {
const tParts = timeStr.trim().split(':');
if (tParts.length >= 2) {
hh = parseInt(tParts[0], 10) || 0;
min = parseInt(tParts[1], 10) || 0;
}
}
if (!dd || !mm || !yyyy)
return null;
return new Date(yyyy, mm - 1, dd, hh, min).getTime();
}
function formatDateInputFromSortKey(sortKey) {
if (typeof sortKey !== 'number' || !isFinite(sortKey))
return '';
const d = new Date(sortKey);
const yyyy = d.getFullYear();
const mm = String(d.getMonth() + 1).padStart(2, '0');
const dd = String(d.getDate()).padStart(2, '0');
return yyyy + '-' + mm + '-' + dd;
}
function parseDateInputToSortKey(dateStr) {
if (!dateStr)
return null;
const parts = dateStr.split('-');
if (parts.length !== 3)
return null;
const yyyy = parseInt(parts[0], 10);
const mm = parseInt(parts[1], 10);
const dd = parseInt(parts[2], 10);
if (!yyyy || !mm || !dd)
return null;
return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0).getTime();
}
function tf_dayKey(ts) {
if (typeof ts !== 'number' || !isFinite(ts))
return null;
const s = formatDateInputFromSortKey(ts);
return parseDateInputToSortKey(s);
}
function tf_filterRowsByUnifiedDate(rows) {
if (!Array.isArray(rows) || rows.length === 0)
return [];
if (equityFilterStart === null || equityFilterEnd === null)
return rows.slice();
const startDay = tf_dayKey(equityFilterStart);
const endDay = tf_dayKey(equityFilterEnd);
if (startDay === null || endDay === null)
return rows.slice();
const lo = Math.min(startDay, endDay);
const hi = Math.max(startDay
~~~
## assets/894f18e8a37bd7c6.js

### TF_WITHDRAW_ENABLED_KEY @ 159817
~~~js
l > 0) {
result.fixed = fixedVal;
result.fixedCount = bestCount;
}
}
if (storedAvg) {
result.avg = storedAvg;
}
return result;
}
function computeSlPipsFromHistory(analystName, pair) {
const stats = computeSlStatsFromHistory(analystName, pair);
if (!stats || !stats.fixed || stats.fixedCount < 5) {
return null;
}
return stats.fixed;
}
function tf_makeAnalystPairKey(analystName, pair) {
if (!analystName)
return '';
if (pair)
return analystName + '|' + String(pair).toUpperCase();
return analystName;
}
function getSelectedSlTypeForAnalyst(analystName, pair) {
if (!analystName)
return null;
const key = tf_makeAnalystPairKey(analystName, pair);
return slTypeSelectionByAnalyst[key] || null;
}
function setSelectedSlTypeForAnalyst(analystName, pair, type) {
if (!analystName)
return;
const key = tf_makeAnalystPairKey(analystName, pair);
if (type === 'fixed' || type === 'avg') {
slTypeSelectionByAnalyst[key] = type;
}
else {
delete slTypeSelectionByAnalyst[key];
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function getEffectiveSlForAnalyst(analystName, pairOrStats, maybeStats) {
let pair = null;
let precomputedStats = null;
if (pairOrStats && typeof pairOrStats === 'object' && maybeStats === undefined) {
precomputedStats = pairOrStats;
}
else {
pair = pairOrStats || null;
precomputedStats = maybeStats || null;
}
const stats = precomputedStats || computeSlStatsFromHistory(analystName, pair);
let type = getSelectedSlTypeForAnalyst(analystName, pair);
if (type === 'fixed' && (!stats.fixed || stats.fixedCount < 5)) {
type = null;
}
if (type === 'avg' && !stats.avg) {
type = null;
}
if (!type) {
if (stats.fixed && stats.fixedCount >= 5) {
type = 'fixed';
}
else if (stats.avg) {
type = 'avg';
}
else {
type = null;
}
}
if (type) {
setSelectedSlTypeForAnalyst(analystName, pair, type);
}
let pips = 0;
if (type === 'fixed') {
pips = stats.fixed || 0;
}
else if (type === 'avg') {
pips = stats.avg || 0;
}
return { type, pips };
}
let currentBalance = 5000;
let currentRiskPercent = 1;
let withdrawEnabled = false;
let withdrawAmount = 0;
let withdrawEveryMonths = 1;
let withdrawDraftEnabled = false;
let withdrawDraftAmount = null;
let withdrawDraftEveryMonths = 1;
const TF_WITHDRAW_ENABLED_KEY = "tf_withdraw_enabled";
const TF_WITHDRAW_AMOUNT_KEY = "tf_withdraw_amount";
const TF_WITHDRAW_EVERY_MONTHS_KEY = "tf_withdraw_every_months";
const TF_WITHDRAW_MIN_MONTHKEY = "2023-01";
const TF_INCOME_MINMAX_START_MONTHKEY = "2024-01";
function tf_monthIndexFromMonthKeySimple(monthKey) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
return (y * 12) + (mo - 1);
}
function tf_isWithdrawDueMonth(monthKey, everyMonths) {
const every = Number.isFinite(everyMonths) ? Math.max(1, Math.min(12, Math.floor(everyMonths))) : 1;
if (typeof monthKey !== 'string' || !/^\d{4}-\d{2}$/.test(monthKey))
return false;
if (monthKey < TF_WITHDRAW_MIN_MONTHKEY)
return false;
const idx = tf_monthIndexFromMonthKeySimple(monthKey);
const anchor = tf_monthIndexFromMonthKeySimple(TF_WITHDRAW_MIN_MONTHKEY);
if (idx === null || anchor === null)
return false;
return ((idx - anchor) % every) === 0;
}
let withdrawMaxAllowed = null;
let withdrawMinSuggested = null;
let withdrawDraftTouched = false;
let withdrawDraftAutoFilled = false;
function tf_setWithdrawAverageText(maxOrNull, priceBusy) {
try {
const elInline = document.getElementById('withdraw-average-inline');
const elInlineEq = document.getElementById('withdraw-average-inline-equity');
const elInlineHistory = document.getElementById('withdraw-average-inline-history');
const elLegacy = document.getElementById('withdraw-average-text');
const setText = (t) => {
if (elInline)
elInline.textContent = t;
if (elInlineEq)
elInlineEq.textContent = t;
if (elInlineHistory)
elInlineHistory.textContent = t;
if (elLegacy)
elLegacy.textContent = t;
const eqInput = document.getElementById('withdraw-amount-input-equity');
if (eqInput)
eqInput.placeholder = t;
const histInput = document.getElementById('withdraw-amount-input-history');
if (histInput)
histInput.placeholder = t;
};
if (priceBusy) {
setText('average : -');
return;
}
if (maxOrNull === null || maxOrNull === undefined || !Number.isFinite(maxOrNull)) {
setText('average : -');
return;
}
setText(`average : ${formatMoney(Math.max(0, maxOrNull))}`);
}
catch (e) { }
}
function tf_setWithdrawMaxWarningVisible(visible, message) {
try {
const els = [
document.getElementById('withdraw-max-warning'),
document.getElementById('withdraw-max-warning-equity'),
document.getElementById('withdraw-max-warning-history')
].filter(Boolean);
if (!els.length)
return;
els.forEach((el) => {
if (visible) {
el.textContent = message || '';
el.style.display = 'block';
}
else {
el.textContent = '';
el.style.display = 'none';
}
});
}
catch (e) { }
}
function tf_getWithdrawMaxAllowedOrNull() {
return (Number.isFinite(withdrawMaxAllowed) && withdrawMaxAllowed >= 0) ? withdrawMaxAllowed : null;
}
function tf_enforceWithdrawAmountMax(showWarning, sourceInputEl) {
try {
const max = tf_getWithdrawMaxAllowedOrNull();
const inputsRaw = [
sourceInputEl,
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity'),
document.getElementById('withdraw-amount-input-history')
].filter(Boolean);
const seen = new Set();
const inputs = inputsRaw.filter((el) => {
const k = el && el.id ? el.id : String(el);
if (seen.has(k))
return false;
seen.add(k);
return true;
});
const input = inputs[0];
if (!input)
return false;
if (max === null) {
tf_setWithdrawMaxWarningVisible(false);
return false;
}
const rawStr = String(input.value || '').trim();
if (rawStr === '') {
withdrawDraftAmount = null;
tf_setWithdrawMaxWarningVisible(false);
inputs.forEach((el) => {
try {
el.value = '';
}
catch (e) { }
});
return false;
}
let v = safeParseFloat(input.value);
if (v === null || v < 0)
v = 0;
withdrawDraftAmount = v;
const exceeded = (v > max + 1e-9);
if (exceeded) {
const clamped = Math.max(0, max);
withdrawDraftAmount = clamped;
input.value = String(Math.round(clamped * 100) / 100);
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = input.value;
}
catch (e) { }
});
tf_setWithdrawMaxWarningVisible(true, `Withdraw tidak boleh melebihi ${formatMoney(clamped)}`);
return true;
}
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = String(input.value || '');
}
catch (e) { }
});
if (showWarning) {
tf_setWithdrawMaxWarningVisible(false);
}
return false;
}
catch (e) {
return false;
}
}
function tf_updateWithdrawMaxAllowedFromMonthlyIncome(incomeValuesGross, priceBusy) {
try {
if (priceBusy || !Array.isArray(incomeValuesGross) || !incomeValuesGross.length) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, priceBusy);
return;
}
let sum = 0;
let n = 0;
for (let i = 0; i < incomeValuesGross.length; i++) {
const v = incomeValuesGross[i];
if (!Number.isFinite(v))
continue;
sum += v;
n += 1;
}
if (!n) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
return;
}
const avg = sum / n;
withdrawMaxAllowed = Math.max(0, avg);
tf_setWithdrawAverageText(withdrawMaxAllowed, false);
tf_enforceWithdrawAmountMax(true);
}
catch (e) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
}
}
function tf_tryAutoFillWithdrawDraftFromSuggested() {
try {
if (withdrawDraftTouched)
return;
if (withdrawDraftAutoFilled)
return;
if (!Number.isFinite(withdrawMinSuggested) || withdrawMinSuggested === null)
return;
let hasStored = false;
let storedVal = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
hasStored = (raw !== null && raw !== undefined && String(raw).trim() !== '');
storedVal = safeParseFloat(raw);
}
}
catch (e) { }
if (hasStored && Number.isFinite(storedVal) && storedVal > 0)
return;
if (Number.isFinite(withdrawDraftAmount) && withdrawDraftAmount > 0)
return;
const inputs = [
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity')
].filter(Boolean);
if (!inputs.length)
return;
const v = Math.max(0, Number(withdrawMinSuggested) || 0);
withdrawDraftAmount = v;
const strVal = String(Math.round(v * 100) / 100);
inputs.forEach((el) => {
try {
el.value = strVal;
}
catch (e) { }
});
tf_enforceWithdrawAmountMax(true, inputs[0]);
withdrawDraftAutoFilled = true;
}
catch (e) { }
}
function tf_updateWithdrawMinSuggestedFromMonthlyIncome(monthlyGrossByMonth, priceBusy) {
try {
if (priceBusy || !
~~~

### TF_WITHDRAW_ENABLED_KEY @ 168481
~~~js
riceBusy) {
try {
if (priceBusy || !Array.isArray(monthlyGrossByMonth) || !monthlyGrossByMonth.length) {
withdrawMinSuggested = null;
return;
}
let minAbs = null;
for (let i = 0; i < monthlyGrossByMonth.length; i++) {
const it = monthlyGrossByMonth[i] || {};
const mk = String(it.monthKey || '');
if (!mk || !/^\d{4}-\d{2}$/.test(mk))
continue;
if (mk < TF_WITHDRAW_MIN_MONTHKEY)
continue;
const v = Number(it.grossDollars);
if (!Number.isFinite(v))
continue;
const sig = Number(it.signals);
const hasData = (Number.isFinite(sig) ? sig : 0) > 0 || Math.abs(v) > 1e-9;
if (!hasData)
continue;
const absV = Math.abs(v);
if (!Number.isFinite(absV))
continue;
if (absV <= 0)
continue;
if (minAbs === null || absV < minAbs)
minAbs = absV;
}
withdrawMinSuggested = (minAbs === null) ? 0 : minAbs;
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) {
withdrawMinSuggested = null;
}
}
let analystRiskOverrides = {};
const TF_TABLE1_BALANCE_KEY = 'tf_current_balance';
const TF_TABLE1_RISK_KEY = 'tf_current_risk_percent';
const TF_TABLE1_RISK_OVERRIDES_KEY = 'tf_risk_overrides';
const TF_SL_TYPE_SELECTION_KEY = 'tf_sl_type_selection';
function tf_loadTable1StateFromLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
const bRaw = localStorage.getItem(TF_TABLE1_BALANCE_KEY);
const b = parseFloat(bRaw);
if (Number.isFinite(b) && b > 0)
currentBalance = b;
const rRaw = localStorage.getItem(TF_TABLE1_RISK_KEY);
const r = parseFloat(rRaw);
if (Number.isFinite(r) && r >= 0)
currentRiskPercent = r;
const oRaw = localStorage.getItem(TF_TABLE1_RISK_OVERRIDES_KEY);
if (oRaw) {
const obj = JSON.parse(oRaw);
if (obj && typeof obj === 'object') {
const clean = {};
Object.keys(obj).forEach((k) => {
const v = parseFloat(obj[k]);
if (Number.isFinite(v) && v >= 0)
clean[String(k)] = v;
});
analystRiskOverrides = clean;
}
}
const slRaw = localStorage.getItem(TF_SL_TYPE_SELECTION_KEY);
if (slRaw) {
const obj2 = JSON.parse(slRaw);
if (obj2 && typeof obj2 === 'object') {
const clean2 = {};
Object.keys(obj2).forEach((k) => {
const v = obj2[k];
if (v === 'fixed' || v === 'avg')
clean2[String(k)] = v;
});
slTypeSelectionByAnalyst = clean2;
}
}
try {
const wEnRaw = localStorage.getItem(TF_WITHDRAW_ENABLED_KEY);
if (wEnRaw !== null) {
withdrawEnabled = (wEnRaw === '1' || wEnRaw === 'true' || wEnRaw === 'yes');
}
const wAmtRaw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
const wAmt = parseFloat(wAmtRaw);
if (Number.isFinite(wAmt) && wAmt >= 0)
withdrawAmount = wAmt;
const wEveryRaw = localStorage.getItem(TF_WITHDRAW_EVERY_MONTHS_KEY);
const wEvery = parseInt(wEveryRaw, 10);
if (Number.isFinite(wEvery) && wEvery >= 1 && wEvery <= 12)
withdrawEveryMonths = wEvery;
}
catch (e) { }
}
catch (e) {
}
}
function tf_saveTable1StateToLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
localStorage.setItem(TF_TABLE1_BALANCE_KEY, String(currentBalance));
localStorage.setItem(TF_TABLE1_RISK_KEY, String(currentRiskPercent));
localStorage.setItem(TF_TABLE1_RISK_OVERRIDES_KEY, JSON.stringify(analystRiskOverrides || {}));
localStorage.setItem(TF_SL_TYPE_SELECTION_KEY, JSON.stringify(slTypeSelectionByAnalyst || {}));
localStorage.setItem(TF_WITHDRAW_ENABLED_KEY, withdrawEnabled ? '1' : '0');
try {
if (Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
localStorage.setItem(TF_WITHDRAW_AMOUNT_KEY, String(withdrawAmount));
}
else {
localStorage.removeItem(TF_WITHDRAW_AMOUNT_KEY);
}
}
catch (e) { }
localStorage.setItem(TF_WITHDRAW_EVERY_MONTHS_KEY, String(withdrawEveryMonths || 1));
}
catch (e) {
}
}
function getRiskPercentForAnalyst(analystName, pair) {
if (analystName) {
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (Object.prototype.hasOwnProperty.call(analystRiskOverrides, key)) {
const v = analystRiskOverrides[key];
if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
return v;
}
}
}
return currentRiskPercent;
}
function setAnalystRiskOverride(analystName, pair, value) {
if (!analystName)
return;
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (value === null || !Number.isFinite(value) || value < 0) {
delete analystRiskOverrides[key];
}
else {
analystRiskOverrides[key] = value;
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function clearAllAnalystRiskOverrides() {
analystRiskOverrides = {};
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function normalizeWIBSuffix(s) {
if (s == null)
return s;
const t = String(s).trim();
return t.replace(/\s*(WIB\s*)+$/i, ' WIB').trim();
}
let historySignals = [];
let initialHistorySignals = null;
let monthlyStatsByAnalyst = {};
let slTypeSelectionByAnalyst = {};
let noDataPairsByAnalyst = {};
let avgSlPipsByAnalystPair = {};
const TF_TRADE_RANGE_STORAGE_KEY = 'tf_trade_time_range_v1';
const TF_TRADE_RANGE_OPTIONS = [
{ key: 'all', label: 'ALL', title: 'All', monthsBack: 0 },
{ key: 'm1', label: '1M', title: '1 Month', monthsBack: 1 },
{ key: 'm2', label: '2M', title: '2 Month', monthsBack: 2 },
{ key: 'm3', label: '3M', title: '3 Month', monthsBack: 3 },
{ key: 'm4', label: '4M', title: '4 Month', monthsBack: 4 },
{ key: 'm5', label: '5M', title: '5 Month', monthsBack: 5 },
{ key: 'm6', label: '6M', title: '6 Month', monthsBack: 6 },
{ key: 'm7', label: '7M', title: '7 Month', monthsBack: 7 },
{ key: 'm8', label: '8M', title: '8 Month', monthsBack: 8 },
{ key: 'm9', label: '9M', title: '9 Month', monthsBack: 9 },
{ key: 'm10', label: '10M', title: '10 Month', monthsBack: 10 },
{ key: 'm11', label: '11M', title: '11 Month', monthsBack: 11 },
{ key: 'y1', label: '1Y', title: '1 Year', monthsBack: 12 },
{ key: 'y2', label: '2Y', title: '2 Year', monthsBack: 24 },
{ key: 'y3', label: '3Y', title: '3 Year', monthsBack: 36 },
{ key: 'y5', label: '5Y', title: '5 Year', monthsBack: 60 }
];
let tfTradeTimeRangeKey = 'all';
let allMonthKeysSorted = [];
const MAX_MONTH_COLUMNS = 12;
function rebuildMonthKeysFromStats() {
const set = new Set();
const stats = monthlyStatsByAnalyst || {};
Object.keys(stats).forEach((name) => {
const aStats = stats[name];
if (!aStats || typeof aStats !== 'object')
return;
Object.keys(aStats).forEach((key) => {
if (!key || !/^\d{4}-\d{2}$/.test(key))
return;
set.add(key);
});
});
const keys = Array.from(set);
keys.sort((a, b) => {
const [aY, aM] = a.split('-').map((v) => parseInt(v, 10));
const [bY, bM] = b.split('-').map((v) => parseInt(v, 10));
if (aY !== bY)
return aY - bY;
return aM - bM;
});
allMonthKeysSorted = keys;
}
let __tfMonthlyMonthKeysSig = '';
function tf_getMonthlyVisibleMonthKeys() {
rebuildMonthKeysFromStats();
let monthKeys = Array.isArray(allMonthKeysSorted) ? allMonthKeysSorted.slice() : [];
const opt = tf_getRangeOptByKey(tfTradeTimeRangeKey);
const monthsBack = opt && Number.isFinite(opt.monthsBack) ? (opt.monthsBack || 0) : 0;
if (monthsBack && monthsBack > 0 && monthKeys.length) {
let maxIdx = null;
for (let i = 0; i < monthKeys.length; i++) {
const mi = tf_monthKeyToIndex(monthKeys[i]);
if (mi == null)
continue;
if (maxIdx == null || mi > maxIdx)
maxIdx = mi;
}
if (maxIdx == null) {
monthKeys = [];
}
else {
const startIdx = maxIdx - (monthsBack - 1);
monthKeys = monthKeys.filter((k) => {
const mi = tf_monthKeyToIndex(k);
if (mi == null)
return false;
return mi >= startIdx;
});
}
}
return monthKeys;
}
function tf_syncMonthlyTableToTradeRange() {
let monthKeys = [];
try {
monthKeys = tf_getMonthlyVisibleMonthKeys();
}
catch (e) {
monthKeys = [];
}
const sig = (monthKeys || []).join('|');
const needRebuild = (sig !== __tfMonthlyMonthKeysSig);
if (needRebuild) {
try {
buildMonthlyTableSkeleton();
}
catch (e) { }
__tfMonthlyMonthKeysSig = sig;
}
try {
updateMonthlyTableCells();
}
catch (e) { }
}
function rebuildMonthlyStatsFromHistory() {
const rows = Array.isArray(historySignals) ? historySignals : [];
if (!rows.length) {
rebuildMonthKeysFromStats();
return;
}
const stats = {};
if (!Array.isArray(ANALYSTS) || ANALYSTS.length === 0) {
monthlyStatsByAnalyst = {};
rebuildMonthKeysFromStats();
return;
}
const filteredAnalysts = (selectedAnalystPairsMapStats && typeof selectedAnalystPairsMapStats === 'object')
? ANALYSTS.filter((a) => {
const baseName = a.baseName || a.name;
if (!tf_isAnalystGloballySelected(baseName))
return false;
const allowedPairs = tf_getAllowedPairsOrNull(selectedAnalystPairsMapStats, baseName);
if (allowedPairs === null)
return true;
const pairUpper = (a.pair || getPrimaryPairForAnalyst(a) || '').toUpperCase();
return allowedPairs.map(String).map((p) => p.toUpperCase()).includes(pairUpper);
})
: ANALYSTS.filter((a) => tf_isAnalystGloballySelected(a.baseName || a.name));
filteredAnalysts.forEach((a) => {
if (selectedAnalystPairsMapStats && typeo
~~~

### TF_WITHDRAW_AMOUNT_KEY @ 165433
~~~js

if (max === null) {
tf_setWithdrawMaxWarningVisible(false);
return false;
}
const rawStr = String(input.value || '').trim();
if (rawStr === '') {
withdrawDraftAmount = null;
tf_setWithdrawMaxWarningVisible(false);
inputs.forEach((el) => {
try {
el.value = '';
}
catch (e) { }
});
return false;
}
let v = safeParseFloat(input.value);
if (v === null || v < 0)
v = 0;
withdrawDraftAmount = v;
const exceeded = (v > max + 1e-9);
if (exceeded) {
const clamped = Math.max(0, max);
withdrawDraftAmount = clamped;
input.value = String(Math.round(clamped * 100) / 100);
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = input.value;
}
catch (e) { }
});
tf_setWithdrawMaxWarningVisible(true, `Withdraw tidak boleh melebihi ${formatMoney(clamped)}`);
return true;
}
inputs.forEach((el) => {
if (el === input)
return;
try {
el.value = String(input.value || '');
}
catch (e) { }
});
if (showWarning) {
tf_setWithdrawMaxWarningVisible(false);
}
return false;
}
catch (e) {
return false;
}
}
function tf_updateWithdrawMaxAllowedFromMonthlyIncome(incomeValuesGross, priceBusy) {
try {
if (priceBusy || !Array.isArray(incomeValuesGross) || !incomeValuesGross.length) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, priceBusy);
return;
}
let sum = 0;
let n = 0;
for (let i = 0; i < incomeValuesGross.length; i++) {
const v = incomeValuesGross[i];
if (!Number.isFinite(v))
continue;
sum += v;
n += 1;
}
if (!n) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
return;
}
const avg = sum / n;
withdrawMaxAllowed = Math.max(0, avg);
tf_setWithdrawAverageText(withdrawMaxAllowed, false);
tf_enforceWithdrawAmountMax(true);
}
catch (e) {
withdrawMaxAllowed = null;
tf_setWithdrawMaxWarningVisible(false);
tf_setWithdrawAverageText(null, false);
}
}
function tf_tryAutoFillWithdrawDraftFromSuggested() {
try {
if (withdrawDraftTouched)
return;
if (withdrawDraftAutoFilled)
return;
if (!Number.isFinite(withdrawMinSuggested) || withdrawMinSuggested === null)
return;
let hasStored = false;
let storedVal = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
hasStored = (raw !== null && raw !== undefined && String(raw).trim() !== '');
storedVal = safeParseFloat(raw);
}
}
catch (e) { }
if (hasStored && Number.isFinite(storedVal) && storedVal > 0)
return;
if (Number.isFinite(withdrawDraftAmount) && withdrawDraftAmount > 0)
return;
const inputs = [
document.getElementById('withdraw-amount-input'),
document.getElementById('withdraw-amount-input-equity')
].filter(Boolean);
if (!inputs.length)
return;
const v = Math.max(0, Number(withdrawMinSuggested) || 0);
withdrawDraftAmount = v;
const strVal = String(Math.round(v * 100) / 100);
inputs.forEach((el) => {
try {
el.value = strVal;
}
catch (e) { }
});
tf_enforceWithdrawAmountMax(true, inputs[0]);
withdrawDraftAutoFilled = true;
}
catch (e) { }
}
function tf_updateWithdrawMinSuggestedFromMonthlyIncome(monthlyGrossByMonth, priceBusy) {
try {
if (priceBusy || !Array.isArray(monthlyGrossByMonth) || !monthlyGrossByMonth.length) {
withdrawMinSuggested = null;
return;
}
let minAbs = null;
for (let i = 0; i < monthlyGrossByMonth.length; i++) {
const it = monthlyGrossByMonth[i] || {};
const mk = String(it.monthKey || '');
if (!mk || !/^\d{4}-\d{2}$/.test(mk))
continue;
if (mk < TF_WITHDRAW_MIN_MONTHKEY)
continue;
const v = Number(it.grossDollars);
if (!Number.isFinite(v))
continue;
const sig = Number(it.signals);
const hasData = (Number.isFinite(sig) ? sig : 0) > 0 || Math.abs(v) > 1e-9;
if (!hasData)
continue;
const absV = Math.abs(v);
if (!Number.isFinite(absV))
continue;
if (absV <= 0)
continue;
if (minAbs === null || absV < minAbs)
minAbs = absV;
}
withdrawMinSuggested = (minAbs === null) ? 0 : minAbs;
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) {
withdrawMinSuggested = null;
}
}
let analystRiskOverrides = {};
const TF_TABLE1_BALANCE_KEY = 'tf_current_balance';
const TF_TABLE1_RISK_KEY = 'tf_current_risk_percent';
const TF_TABLE1_RISK_OVERRIDES_KEY = 'tf_risk_overrides';
const TF_SL_TYPE_SELECTION_KEY = 'tf_sl_type_selection';
function tf_loadTable1StateFromLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
const bRaw = localStorage.getItem(TF_TABLE1_BALANCE_KEY);
const b = parseFloat(bRaw);
if (Number.isFinite(b) && b > 0)
currentBalance = b;
const rRaw = localStorage.getItem(TF_TABLE1_RISK_KEY);
const r = parseFloat(rRaw);
if (Number.isFinite(r) && r >= 0)
currentRiskPercent = r;
const oRaw = localStorage.getItem(TF_TABLE1_RISK_OVERRIDES_KEY);
if (oRaw) {
const obj = JSON.parse(oRaw);
if (obj && typeof obj === 'object') {
const clean = {};
Object.keys(obj).forEach((k) => {
const v = parseFloat(obj[k]);
if (Number.isFinite(v) && v >= 0)
clean[String(k)] = v;
});
analystRiskOverrides = clean;
}
}
const slRaw = localStorage.getItem(TF_SL_TYPE_SELECTION_KEY);
if (slRaw) {
const obj2 = JSON.parse(slRaw);
if (obj2 && typeof obj2 === 'object') {
const clean2 = {};
Object.keys(obj2).forEach((k) => {
const v = obj2[k];
if (v === 'fixed' || v === 'avg')
clean2[String(k)] = v;
});
slTypeSelectionByAnalyst = clean2;
}
}
try {
const wEnRaw = localStorage.getItem(TF_WITHDRAW_ENABLED_KEY);
if (wEnRaw !== null) {
withdrawEnabled = (wEnRaw === '1' || wEnRaw === 'true' || wEnRaw === 'yes');
}
const wAmtRaw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
const wAmt = parseFloat(wAmtRaw);
if (Number.isFinite(wAmt) && wAmt >= 0)
withdrawAmount = wAmt;
const wEveryRaw = localStorage.getItem(TF_WITHDRAW_EVERY_MONTHS_KEY);
const wEvery = parseInt(wEveryRaw, 10);
if (Number.isFinite(wEvery) && wEvery >= 1 && wEvery <= 12)
withdrawEveryMonths = wEvery;
}
catch (e) { }
}
catch (e) {
}
}
function tf_saveTable1StateToLocalStorage() {
try {
if (typeof localStorage === 'undefined')
return;
localStorage.setItem(TF_TABLE1_BALANCE_KEY, String(currentBalance));
localStorage.setItem(TF_TABLE1_RISK_KEY, String(currentRiskPercent));
localStorage.setItem(TF_TABLE1_RISK_OVERRIDES_KEY, JSON.stringify(analystRiskOverrides || {}));
localStorage.setItem(TF_SL_TYPE_SELECTION_KEY, JSON.stringify(slTypeSelectionByAnalyst || {}));
localStorage.setItem(TF_WITHDRAW_ENABLED_KEY, withdrawEnabled ? '1' : '0');
try {
if (Number.isFinite(withdrawAmount) && withdrawAmount > 0) {
localStorage.setItem(TF_WITHDRAW_AMOUNT_KEY, String(withdrawAmount));
}
else {
localStorage.removeItem(TF_WITHDRAW_AMOUNT_KEY);
}
}
catch (e) { }
localStorage.setItem(TF_WITHDRAW_EVERY_MONTHS_KEY, String(withdrawEveryMonths || 1));
}
catch (e) {
}
}
function getRiskPercentForAnalyst(analystName, pair) {
if (analystName) {
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (Object.prototype.hasOwnProperty.call(analystRiskOverrides, key)) {
const v = analystRiskOverrides[key];
if (typeof v === 'number' && Number.isFinite(v) && v >= 0) {
return v;
}
}
}
return currentRiskPercent;
}
function setAnalystRiskOverride(analystName, pair, value) {
if (!analystName)
return;
const key = pair ? (analystName + '|' + String(pair).toUpperCase()) : analystName;
if (value === null || !Number.isFinite(value) || value < 0) {
delete analystRiskOverrides[key];
}
else {
analystRiskOverrides[key] = value;
}
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function clearAllAnalystRiskOverrides() {
analystRiskOverrides = {};
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
}
function normalizeWIBSuffix(s) {
if (s == null)
return s;
const t = String(s).trim();
return t.replace(/\s*(WIB\s*)+$/i, ' WIB').trim();
}
let historySignals = [];
let initialHistorySignals = null;
let monthlyStatsByAnalyst = {};
let slTypeSelectionByAnalyst = {};
let noDataPairsByAnalyst = {};
let avgSlPipsByAnalystPair = {};
const TF_TRADE_RANGE_STORAGE_KEY = 'tf_trade_time_range_v1';
const TF_TRADE_RANGE_OPTIONS = [
{ key: 'all', label: 'ALL', title: 'All', monthsBack: 0 },
{ key: 'm1', label: '1M', title: '1 Month', monthsBack: 1 },
{ key: 'm2', label: '2M', title: '2 Month', monthsBack: 2 },
{ key: 'm3', label: '3M', title: '3 Month', monthsBack: 3 },
{ key: 'm4', label: '4M', title: '4 Month', monthsBack: 4 },
{ key: 'm5', label: '5M', title: '5 Month', monthsBack: 5 },
{ key: 'm6', label: '6M', title: '6 Month', monthsBack: 6 },
{ key: 'm7', label: '7M', title: '7 Month', monthsBack: 7 },
{ key: 'm8', label: '8M', title: '8 Month', monthsBack: 8 },
{ key: 'm9', label: '9M', title: '9 Month', monthsBack: 9 },
{ key: 'm10', label: '10M', title: '10 Month', monthsBack: 10 },
{ key: 'm11', label: '11M', title: '11 Month', monthsBack: 11 },
{ key: 'y1', label: '1Y', title: '1 Year', monthsBack: 12 },
{ key: 'y2', 
~~~

### TF_WITHDRAW_AMOUNT_KEY @ 356623
~~~js
skInput = document.getElementById('risk-input');
const applyBalanceBtn = document.getElementById('apply-balance-btn');
const applyRiskBtn = document.getElementById('apply-risk-btn');
const resetBtn = document.getElementById('reset-defaults-btn');
const withdrawToggle = document.getElementById('withdraw-enabled-toggle');
const withdrawAmountInput = document.getElementById('withdraw-amount-input');
const withdrawMonthsSelect = document.getElementById('withdraw-months-select');
const withdrawSubmitBtn = document.getElementById('withdraw-submit-btn');
const withdrawToggleEquity = document.getElementById('withdraw-enabled-toggle-equity');
const withdrawAmountInputEquity = document.getElementById('withdraw-amount-input-equity');
const withdrawMonthsSelectEquity = document.getElementById('withdraw-months-select-equity');
const withdrawSubmitBtnEquity = document.getElementById('withdraw-submit-btn-equity');
const withdrawToggleHistory = document.getElementById('withdraw-enabled-toggle-history');
const withdrawAmountInputHistory = document.getElementById('withdraw-amount-input-history');
const withdrawMonthsSelectHistory = document.getElementById('withdraw-months-select-history');
const withdrawSubmitBtnHistory = document.getElementById('withdraw-submit-btn-history');
const withdrawToggles = [withdrawToggle, withdrawToggleEquity, withdrawToggleHistory].filter(Boolean);
const withdrawAmountInputs = [withdrawAmountInput, withdrawAmountInputEquity, withdrawAmountInputHistory].filter(Boolean);
const withdrawMonthsSelects = [withdrawMonthsSelect, withdrawMonthsSelectEquity, withdrawMonthsSelectHistory].filter(Boolean);
const withdrawSubmitBtns = [withdrawSubmitBtn, withdrawSubmitBtnEquity, withdrawSubmitBtnHistory].filter(Boolean);
function syncInputs() {
if (balanceInput)
balanceInput.value = currentBalance;
if (riskInput)
riskInput.value = currentRiskPercent;
const hasWithdrawUi = withdrawToggles.length && withdrawAmountInputs.length && withdrawMonthsSelects.length;
if (hasWithdrawUi) {
withdrawDraftEnabled = !!withdrawEnabled;
let _hasStoredWithdrawAmt = false;
let _storedWithdrawAmt = null;
try {
if (typeof localStorage !== 'undefined') {
const raw = localStorage.getItem(TF_WITHDRAW_AMOUNT_KEY);
_hasStoredWithdrawAmt = (raw !== null && raw !== undefined && String(raw).trim() !== '');
_storedWithdrawAmt = safeParseFloat(raw);
}
}
catch (e) { }
withdrawDraftAmount = (_hasStoredWithdrawAmt && Number.isFinite(_storedWithdrawAmt)) ? Math.max(0, _storedWithdrawAmt) : null;
withdrawDraftEveryMonths = (Number.isFinite(withdrawEveryMonths) ? withdrawEveryMonths : 1);
withdrawDraftTouched = false;
withdrawDraftAutoFilled = false;
withdrawToggles.forEach((t) => {
try {
t.checked = !!withdrawDraftEnabled;
}
catch (e) { }
});
withdrawSubmitBtns.forEach((btn) => {
if (!btn)
return;
btn.disabled = !withdrawDraftEnabled;
btn.title = withdrawDraftEnabled ? "" : "Enable Withdraw to apply";
});
const amtStr = (withdrawDraftAmount === null || !Number.isFinite(withdrawDraftAmount)) ? '' : String(withdrawDraftAmount);
withdrawAmountInputs.forEach((inp) => {
if (!inp)
return;
inp.value = amtStr;
inp.disabled = false;
});
const monthsStr = String(withdrawDraftEveryMonths || 1);
withdrawMonthsSelects.forEach((sel) => {
if (!sel)
return;
sel.value = monthsStr;
sel.disabled = false;
});
try {
tf_enforceWithdrawAmountMax(false, withdrawAmountInputs[0]);
}
catch (e) { }
try {
tf_setWithdrawAverageText(tf_getWithdrawMaxAllowedOrNull(), false);
}
catch (e) { }
try {
tf_tryAutoFillWithdrawDraftFromSuggested();
}
catch (e) { }
}
}
syncInputs();
const hasWithdrawUi = withdrawToggles.length && withdrawAmountInputs.length && withdrawMonthsSelects.length;
if (hasWithdrawUi) {
withdrawToggles.forEach((toggleEl) => {
toggleEl.addEventListener('change', () => {
const checked = !!toggleEl.checked;
withdrawDraftEnabled = checked;
withdrawToggles.forEach((t) => {
if (t === toggleEl)
return;
try {
t.checked = checked;
}
catch (e) { }
});
withdrawSubmitBtns.forEach((btn) => {
if (!btn)
return;
btn.disabled = !checked;
btn.title = checked ? "" : "Enable Withdraw to apply";
});
if (!checked) {
withdrawEnabled = false;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
try {
tf_captureHistoryTableScrollForRestore();
recomputeHistoryRows();
}
catch (e) { }
try {
renderMonthlyTotals();
}
catch (e) { }
}
});
});
withdrawAmountInputs.forEach((inp) => {
inp.addEventListener('input', () => {
withdrawDraftTouched = true;
const raw = String(inp.value || '').trim();
if (raw === '') {
withdrawDraftAmount = null;
}
else {
const v = safeParseFloat(raw);
withdrawDraftAmount = (v === null || v < 0) ? 0 : v;
}
try {
tf_enforceWithdrawAmountMax(true, inp);
}
catch (e) { }
});
});
withdrawMonthsSelects.forEach((sel) => {
sel.addEventListener('change', () => {
const v = parseInt(sel.value, 10);
withdrawDraftEveryMonths = (Number.isFinite(v) && v >= 1 && v <= 12) ? v : 1;
const str = String(withdrawDraftEveryMonths || 1);
withdrawMonthsSelects.forEach((s) => {
if (s === sel)
return;
try {
s.value = str;
}
catch (e) { }
});
});
});
}
if (hasWithdrawUi && withdrawSubmitBtns.length) {
withdrawSubmitBtns.forEach((btn) => {
btn.addEventListener('click', () => {
if (equityMetric !== 'usd') {
alert('Withdraw hanya tersedia saat Filter by: PnL ($).');
return;
}
const toggleRef = withdrawToggles[0];
const inputRef = withdrawAmountInputs[0];
const monthsRef = withdrawMonthsSelects[0];
if (!toggleRef || !inputRef || !monthsRef)
return;
withdrawDraftEnabled = !!toggleRef.checked;
const v0 = safeParseFloat(inputRef.value);
withdrawDraftAmount = (v0 === null || v0 < 0) ? 0 : v0;
const m0 = parseInt(monthsRef.value, 10);
withdrawDraftEveryMonths = (Number.isFinite(m0) && m0 >= 1 && m0 <= 12) ? m0 : 1;
try {
tf_enforceWithdrawAmountMax(true, inputRef);
}
catch (e) { }
const v1 = safeParseFloat(inputRef.value);
withdrawDraftAmount = (v1 === null || v1 < 0) ? 0 : v1;
withdrawEnabled = !!withdrawDraftEnabled;
withdrawAmount = withdrawDraftAmount;
withdrawEveryMonths = withdrawDraftEveryMonths;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
recomputeHistoryRows();
renderMonthlyTotals();
});
});
}
applyBalanceBtn.addEventListener('click', () => {
const v = safeParseFloat(balanceInput.value);
if (v === null || v <= 0) {
alert('Balance tidak valid. Isi angka lebih besar dari 0.');
if (balanceInput)
balanceInput.value = currentBalance;
return;
}
currentBalance = v;
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
renderSummaryTable();
recomputeHistoryRows();
});
applyRiskBtn.addEventListener('click', () => {
const v = safeParseFloat(riskInput.value);
if (v === null || v < 0) {
alert('Risk % / Trade tidak valid.');
if (riskInput)
riskInput.value = currentRiskPercent;
return;
}
currentRiskPercent = v;
clearAllAnalystRiskOverrides();
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
renderSummaryTable();
recomputeHistoryRows();
});
resetBtn.addEventListener('click', () => {
currentBalance = 5000;
currentRiskPercent = 1;
withdrawEnabled = false;
withdrawAmount = 0;
withdrawEveryMonths = 1;
clearAllAnalystRiskOverrides();
try {
tf_saveTable1StateToLocalStorage();
}
catch (e) { }
syncInputs();
renderSummaryTable();
recomputeHistoryRows();
});
}
function makeEmptyStreakState() {
return {
currentProfitTrades: 0,
currentProfitPips: 0,
currentProfitDollar: 0,
maxProfitTrades: 0,
maxProfitPips: 0,
maxProfitDollar: 0,
currentLossTrades: 0,
currentLossPips: 0,
currentLossDollar: 0,
maxLossTrades: 0,
maxLossPips: 0,
maxLossDollar: 0,
profitRuns: {},
lossRuns: {}
};
}
function commitProfitRun(state) {
try {
const len = state.currentProfitTrades || 0;
if (len <= 0)
return;
const pips = isFinite(state.currentProfitPips) ? state.currentProfitPips : 0;
const dollar = isFinite(state.currentProfitDollar) ? state.currentProfitDollar : 0;
const runs = state.profitRuns || (state.profitRuns = {});
const cur = runs[len] || { count: 0, bestPips: 0, bestDollar: 0 };
cur.count += 1;
if (cur.count === 1 || dollar > cur.bestDollar || (dollar === cur.bestDollar && pips > cur.bestPips)) {
cur.bestDollar = dollar;
cur.bestPips = pips;
}
runs[len] = cur;
if (len > (state.maxProfitTrades || 0) || (len === (state.maxProfitTrades || 0) && dollar > (state.maxProfitDollar || 0))) {
state.maxProfitTrades = len;
state.maxProfitPips = pips;
state.maxProfitDollar = dollar;
}
}
catch (e) { }
}
function commitLossRun(state) {
try {
const len = state.currentLossTrades || 0;
if (len <= 0)
return;
const pips = isFinite(state.currentLossPips) ? state.currentLossPips : 0;
const dollar = isFinite(state.currentLossDollar) ? state.currentLossDollar : 0;
const runs = state.lossRuns || (state.lossRuns = {});
const cur = runs[len] || { count: 0, bestPips:
~~~

### RISK_MODE_STORAGE_KEY @ 200063
~~~js
Compound = startBal;
continue;
}
const analyst = (row.analyst || '').trim();
const pair = (row.pair || '').trim();
const pnlPips = Number.isFinite(row.pnlPips) ? row.pnlPips
: (Number.isFinite(row.pips) ? row.pips : (Number(row.pips) || 0));
row.pnlPips = pnlPips;
const riskPercent = Math.max(0, Number(row.riskPercent) || 0);
const dollarPerPip = Math.abs(Number(row.dollarPerPip) || 0);
const slPips = tf_getEffectiveSlPipsForRecompute(analyst, pair);
const baseKey = Number.isFinite(sizingBase) ? Math.round(sizingBase * 100) : 0;
const cacheKey = (currentPeriodStartKey || '') + '|' + (currentMonthKey || '') + '|' + analyst + '|' + pair
+ '|B' + baseKey + '|R' + Math.round(riskPercent * 1000) + '|D' + Math.round(dollarPerPip * 10000) + '|S' + Math.round(slPips * 1000);
let lot = 0;
if (lotCache.has(cacheKey)) {
lot = lotCache.get(cacheKey) || 0;
}
else {
let calcLot = 0;
const baseForLot = Math.max(0, Number(sizingBase) || 0);
if (baseForLot > 0 && slPips > 0 && dollarPerPip > 0) {
calcLot = computeLot(baseForLot, riskPercent, slPips, dollarPerPip);
if (!Number.isFinite(calcLot) || calcLot <= 0)
calcLot = 0;
else
calcLot = roundLotToTwoDecimals(calcLot);
}
lotCache.set(cacheKey, calcLot);
lot = calcLot;
}
row.lot = lot;
row.balanceCompound = sizingBase;
const pnlDollar = (Number.isFinite(pnlPips) && Number.isFinite(lot) && Number.isFinite(dollarPerPip))
? (pnlPips * lot * dollarPerPip)
: 0;
row.pnlDollar = pnlDollar;
row.pipsTP = pnlPips > 0 ? pnlPips : 0;
row.pipsSL = pnlPips < 0 ? Math.abs(pnlPips) : 0;
row.dollarTP = pnlDollar > 0 ? pnlDollar : 0;
row.dollarSL = pnlDollar < 0 ? Math.abs(pnlDollar) : 0;
const denom = Math.abs(Number(sizingBase) || 0);
row.pnlPercent = denom > 0 ? (pnlDollar / denom) * 100 : 0;
if (enabled) {
runningTradeOnly += pnlDollar;
runningEquity += pnlDollar;
}
row.balanceTradeOnly = runningTradeOnly;
row.balancePnl = runningEquity;
}
}
catch (e) {
}
}
let tf_lastEquityCalcRows = [];
let lastHistoryRiskMode = 'fixed';
let equityFilterMin = null;
let equityFilterMax = null;
let equityFilterStart = null;
let equityFilterEnd = null;
let equityMetric = 'usd';
const EQUITY_METRIC_STORAGE_KEY = 'tf_equity_metric';
let riskMode = 'fixed';
const RISK_MODE_STORAGE_KEY = 'tf_risk_mode';
let compoundMonths = 1;
const COMPOUND_MONTHS_STORAGE_KEY = 'tf_compound_months';
function formatMoney(value) {
if (!isFinite(value))
return '-';
return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
function formatPlainNumber(value, decimals = 2) {
if (!isFinite(value))
return '-';
const v = Number(value);
const absStr = Math.abs(v).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
return v < 0 ? ('-' + absStr) : absStr;
}
function formatSignedMoney(value) {
if (!isFinite(value))
return '-';
const abs = Math.abs(value);
const base = formatMoney(abs);
if (value < 0) {
return '-' + base;
}
if (value > 0) {
return '+' + base;
}
return base;
}
function formatNumber(value, decimals = 2) {
if (!isFinite(value))
return '-';
return value.toFixed(decimals);
}
function formatPips(value, decimals = 1) {
if (!isFinite(value))
return '-';
return value.toFixed(decimals) + ' pips';
}
function formatSignedPips(value, decimals = 1) {
if (!isFinite(value))
return '-';
const abs = Math.abs(value);
const base = formatPips(abs, decimals);
if (value < 0)
return '-' + base;
if (value > 0)
return '+' + base;
return formatPips(0, decimals);
}
function loadEquityMetricPreference() {
try {
const saved = localStorage.getItem(EQUITY_METRIC_STORAGE_KEY);
if (saved === 'usd' || saved === 'pips') {
equityMetric = saved;
}
}
catch (e) {
}
}
function saveEquityMetricPreference() {
try {
localStorage.setItem(EQUITY_METRIC_STORAGE_KEY, equityMetric);
}
catch (e) {
}
}
function loadRiskModePreference() {
// REV177: Fixed Lot is always the default whenever the page is opened.
// Users can still switch to Compound % for the current session.
riskMode = 'fixed';
try {
localStorage.setItem(RISK_MODE_STORAGE_KEY, 'fixed');
}
catch (e) {
}
}
function loadCompoundMonthsPreference() {
try {
const saved = parseInt(localStorage.getItem(COMPOUND_MONTHS_STORAGE_KEY), 10);
if (Number.isFinite(saved) && saved >= 1 && saved <= 12) {
compoundMonths = saved;
}
}
catch (e) {
}
}
function saveCompoundMonthsPreference() {
try {
localStorage.setItem(COMPOUND_MONTHS_STORAGE_KEY, String(compoundMonths));
}
catch (e) {
}
}
function tf_monthKeyFromSortKey(sortKey) {
if (typeof sortKey === 'number' && isFinite(sortKey)) {
const d = new Date(sortKey);
if (!isNaN(d.getTime())) {
const yyyy = d.getFullYear();
const mm = d.getMonth() + 1;
return String(yyyy).padStart(4, '0') + '-' + String(mm).padStart(2, '0');
}
}
else if (typeof sortKey === 'string' && sortKey.length >= 7) {
const candidate = sortKey.slice(0, 7);
if (/^\d{4}-\d{2}$/.test(candidate))
return candidate;
}
return null;
}
function tf_getPrimarySortKey(row) {
try {
const sk = row && row.sortKey;
if (typeof sk === 'number' && isFinite(sk))
return sk;
const ck = row && row.createdSortKey;
if (typeof ck === 'number' && isFinite(ck))
return ck;
}
catch (e) { }
return null;
}
function tf_firstDaySortKeyFromMonthKey(monthKey) {
const m = String(monthKey || '').match(/^([0-9]{4})-([0-9]{2})$/);
if (!m)
return null;
const y = parseInt(m[1], 10);
const mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
const d = new Date(y, mo - 1, 1, 0, 0, 0, 0);
const ms = d.getTime();
return (typeof ms === 'number' && isFinite(ms)) ? ms : null;
}
function tf_firstDayDisplayDateFromMonthKey(monthKey) {
const m = String(monthKey || '').match(/^([0-9]{4})-([0-9]{2})$/);
if (!m)
return '';
const yyyy = m[1];
const mm = m[2];
return `01-${mm}-${yyyy}`;
}
function tf_shiftMonthKey(monthKey, deltaMonths) {
const m = String(monthKey || '').match(/^(\d{4})-(\d{2})$/);
if (!m)
return null;
let y = parseInt(m[1], 10);
let mo = parseInt(m[2], 10);
if (!Number.isFinite(y) || !Number.isFinite(mo))
return null;
mo += (Number.isFinite(deltaMonths) ? deltaMonths : 0);
while (mo <= 0) {
mo += 12;
y -= 1;
}
while (mo > 12) {
mo -= 12;
y += 1;
}
return String(y).padStart(4, '0') + '-' + String(mo).padStart(2, '0');
}
function tf_setCompoundSubRowsVisible(isVisible) {
const ids = ['compound-sub-row-equity', 'compound-sub-row-history', 'compound-sub-row-monthly'];
ids.forEach((id) => {
const el = document.getElementById(id);
if (!el)
return;
el.style.display = isVisible ? '' : 'none';
});
}
function tf_updateHistoryBalanceHeaderLabel(currentRiskMode) {
const th = document.getElementById('history-balance-base-th');
if (!th)
return;
th.textContent = currentRiskMode === 'compound' ? 'Balance Compounded' : 'Balance';
}
function tf_setRiskModeRowsVisible(isVisible) {
const selIds = ['risk-mode-select', 'risk-mode-select-history', 'risk-mode-select-monthly'];
selIds.forEach((id) => {
const sel = document.getElementById(id);
if (!sel)
return;
const row = sel.closest ? sel.closest('.equity-filter-row') : null;
if (!row)
return;
row.style.display = isVisible ? '' : 'none';
});
}
function tf_getAllRiskModeSelects() {
return Array.from(document.querySelectorAll('#risk-mode-select, #risk-mode-select-history, #risk-mode-select-monthly'));
}
function tf_getAllCompoundMonthsSelects() {
return Array.from(document.querySelectorAll('#compound-months-select-equity, #compound-months-select-history, #compound-months-select-monthly'));
}
function tf_renderCompoundMonthsOptions(monthCount) {
const sels = tf_getAllCompoundMonthsSelects();
if (!sels.length)
return;
const safeCount = Number.isFinite(monthCount) ? Math.max(0, Math.floor(monthCount)) : 0;
if (safeCount > 0 && compoundMonths > safeCount) {
compoundMonths = safeCount;
saveCompoundMonthsPreference();
}
if (compoundMonths < 1)
compoundMonths = 1;
if (compoundMonths > 12)
compoundMonths = 12;
sels.forEach((sel) => {
const previous = sel.value;
sel.innerHTML = '';
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = i === 1 ? '1 month' : String(i) + ' month';
if (safeCount > 0 && i > safeCount) {
opt.disabled = true;
}
sel.appendChild(opt);
}
try {
sel.value = String(compoundMonths);
if (!sel.value && previous)
sel.value = previous;
}
catch (e) { }
});
}
function tf_buildMonthEndBalanceMapFromHistoryRows(rows) {
const map = Object.create(null);
if (!Array.isArray(rows))
return map;
for (let i = 0; i < rows.length; i++) {
const r = rows[i];
const mk = tf_monthKeyFromSortKey(tf_getPrimarySortKey(r));
if (mk) {
map[mk] = (r && Number.isFinite(r.balanceTradeOnly)) ? r.balanceTradeOnly : ((r && Number.isFinite(r.balancePnl)) ? r.balancePnl : map[mk]);
}
}
return map;
}
function tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBala
~~~

### RISK_MODE_STORAGE_KEY @ 207204
~~~js
risk-mode-select-monthly'));
}
function tf_getAllCompoundMonthsSelects() {
return Array.from(document.querySelectorAll('#compound-months-select-equity, #compound-months-select-history, #compound-months-select-monthly'));
}
function tf_renderCompoundMonthsOptions(monthCount) {
const sels = tf_getAllCompoundMonthsSelects();
if (!sels.length)
return;
const safeCount = Number.isFinite(monthCount) ? Math.max(0, Math.floor(monthCount)) : 0;
if (safeCount > 0 && compoundMonths > safeCount) {
compoundMonths = safeCount;
saveCompoundMonthsPreference();
}
if (compoundMonths < 1)
compoundMonths = 1;
if (compoundMonths > 12)
compoundMonths = 12;
sels.forEach((sel) => {
const previous = sel.value;
sel.innerHTML = '';
for (let i = 1; i <= 12; i++) {
const opt = document.createElement('option');
opt.value = String(i);
opt.textContent = i === 1 ? '1 month' : String(i) + ' month';
if (safeCount > 0 && i > safeCount) {
opt.disabled = true;
}
sel.appendChild(opt);
}
try {
sel.value = String(compoundMonths);
if (!sel.value && previous)
sel.value = previous;
}
catch (e) { }
});
}
function tf_buildMonthEndBalanceMapFromHistoryRows(rows) {
const map = Object.create(null);
if (!Array.isArray(rows))
return map;
for (let i = 0; i < rows.length; i++) {
const r = rows[i];
const mk = tf_monthKeyFromSortKey(tf_getPrimarySortKey(r));
if (mk) {
map[mk] = (r && Number.isFinite(r.balanceTradeOnly)) ? r.balanceTradeOnly : ((r && Number.isFinite(r.balancePnl)) ? r.balancePnl : map[mk]);
}
}
return map;
}
function tf_getCompoundBaseBalanceForMonth(monthKey, monthEndBalanceMap, fallbackBalance) {
const offset = Number.isFinite(compoundMonths) ? Math.max(1, Math.min(12, Math.floor(compoundMonths))) : 1;
const targetKey = tf_shiftMonthKey(monthKey, -offset);
if (targetKey && monthEndBalanceMap) {
let k = targetKey;
for (let i = 0; i < 36 && k; i++) {
if (Object.prototype.hasOwnProperty.call(monthEndBalanceMap, k)) {
const v = monthEndBalanceMap[k];
if (Number.isFinite(v))
return v;
}
k = tf_shiftMonthKey(k, -1);
}
}
if (Number.isFinite(fallbackBalance))
return fallbackBalance;
return Number.isFinite(currentBalance) ? currentBalance : 0;
}
function saveRiskModePreference() {
try {
localStorage.setItem(RISK_MODE_STORAGE_KEY, riskMode);
}
catch (e) {
}
}
function formatEquityMetricAxis(value) {
if (equityMetric === 'usd')
return formatMoney(value);
if (!isFinite(value))
return '-';
return value.toFixed(1);
}
function formatEquityMetricSigned(value) {
return equityMetric === 'usd' ? formatSignedMoney(value) : formatSignedPips(value, 1);
}
function formatEquityMetricValue(value) {
return equityMetric === 'usd' ? formatMoney(value) : formatPips(value, 1);
}
function updateEquityCurveCopyForMetric() {
const titleEl = document.getElementById('equity-curve-title');
const badgeEl = document.getElementById('equity-curve-badge-text');
if (titleEl) {
titleEl.textContent =
equityMetric === 'usd'
? 'Equity Curve – Akumulasi $ per Trade'
: 'Equity Curve – Akumulasi Pips per Trade';
}
if (badgeEl) {
badgeEl.textContent =
equityMetric === 'usd'
? 'Hover untuk detail $ dan Equity'
: 'Hover untuk detail Pips dan Akumulasi';
}
}
function tf_updateUiForEquityMetric() {
try {
const isUsd = (equityMetric === 'usd');
try {
tf_setRiskModeRowsVisible(isUsd);
}
catch (e) { }
try {
tf_setCompoundSubRowsVisible(isUsd && (riskMode === 'compound'));
}
catch (e) { }
const withdrawToggleMain = document.getElementById('withdraw-enabled-toggle');
const withdrawAmountInputMain = document.getElementById('withdraw-amount-input');
const withdrawMonthsSelectMain = document.getElementById('withdraw-months-select');
const withdrawSubmitBtnMain = document.getElementById('withdraw-submit-btn');
const withdrawToggleEq = document.getElementById('withdraw-enabled-toggle-equity');
const withdrawAmountInputEq = document.getElementById('withdraw-amount-input-equity');
const withdrawMonthsSelectEq = document.getElementById('withdraw-months-select-equity');
const withdrawSubmitBtnEq = document.getElementById('withdraw-submit-btn-equity');
const withdrawToggleHistory = document.getElementById('withdraw-enabled-toggle-history');
const withdrawAmountInputHistory = document.getElementById('withdraw-amount-input-history');
const withdrawMonthsSelectHistory = document.getElementById('withdraw-months-select-history');
const withdrawSubmitBtnHistory = document.getElementById('withdraw-submit-btn-history');
const withdrawGroups = [
{ toggle: withdrawToggleMain, amount: withdrawAmountInputMain, months: withdrawMonthsSelectMain, submit: withdrawSubmitBtnMain },
{ toggle: withdrawToggleEq, amount: withdrawAmountInputEq, months: withdrawMonthsSelectEq, submit: withdrawSubmitBtnEq },
{ toggle: withdrawToggleHistory, amount: withdrawAmountInputHistory, months: withdrawMonthsSelectHistory, submit: withdrawSubmitBtnHistory }
];
const disabledTitle = isUsd ? '' : 'Tidak tersedia saat Filter by: PnL Pips';
withdrawGroups.forEach((g) => {
[g.toggle, g.amount, g.months, g.submit].forEach((el) => {
if (!el)
return;
el.disabled = !isUsd;
if (!isUsd)
el.title = disabledTitle;
});
});
if (isUsd) {
withdrawGroups.forEach((g) => {
if (g.submit && g.toggle) {
g.submit.disabled = !g.toggle.checked;
g.submit.title = g.toggle.checked ? '' : 'Enable Withdraw to apply';
}
});
}
}
catch (e) { }
}
function computeLot(balance, riskPercent, pipsPerTrade, dollarPerPip) {
const riskAmount = (balance * riskPercent) / 100;
const denom = pipsPerTrade * dollarPerPip;
if (denom <= 0)
return 0;
return riskAmount / denom;
}
function roundLotToTwoDecimals(lot) {
if (!Number.isFinite(lot) || lot <= 0)
return 0;
const scaled = lot * 100;
const scaledFloor = Math.floor(scaled);
const diff = scaled - scaledFloor;
let roundedScaled;
if (diff > 0.5) {
roundedScaled = scaledFloor + 1;
}
else {
roundedScaled = scaledFloor;
}
return roundedScaled / 100;
}
function computeFixedLot(balance, riskPercent, pipsPerTrade, dollarPerPip) {
const rawLot = computeLot(balance, riskPercent, pipsPerTrade, dollarPerPip);
return roundLotToTwoDecimals(rawLot);
}
function safeParseFloat(v) {
const n = parseFloat(v);
return isNaN(n) ? null : n;
}
function parseDateFromInputs(dateStr, timeStr) {
const parts = (dateStr || '').trim().split('-');
if (parts.length !== 3)
return null;
const [ddStr, mmStr, yyyyStr] = parts;
const dd = parseInt(ddStr, 10);
const mm = parseInt(mmStr, 10);
const yyyy = parseInt(yyyyStr, 10);
let hh = 0;
let min = 0;
if ((timeStr || '').trim()) {
const tParts = timeStr.trim().split(':');
if (tParts.length >= 2) {
hh = parseInt(tParts[0], 10) || 0;
min = parseInt(tParts[1], 10) || 0;
}
}
if (!dd || !mm || !yyyy)
return null;
return new Date(yyyy, mm - 1, dd, hh, min).getTime();
}
function formatDateInputFromSortKey(sortKey) {
if (typeof sortKey !== 'number' || !isFinite(sortKey))
return '';
const d = new Date(sortKey);
const yyyy = d.getFullYear();
const mm = String(d.getMonth() + 1).padStart(2, '0');
const dd = String(d.getDate()).padStart(2, '0');
return yyyy + '-' + mm + '-' + dd;
}
function parseDateInputToSortKey(dateStr) {
if (!dateStr)
return null;
const parts = dateStr.split('-');
if (parts.length !== 3)
return null;
const yyyy = parseInt(parts[0], 10);
const mm = parseInt(parts[1], 10);
const dd = parseInt(parts[2], 10);
if (!yyyy || !mm || !dd)
return null;
return new Date(yyyy, mm - 1, dd, 0, 0, 0, 0).getTime();
}
function tf_dayKey(ts) {
if (typeof ts !== 'number' || !isFinite(ts))
return null;
const s = formatDateInputFromSortKey(ts);
return parseDateInputToSortKey(s);
}
function tf_filterRowsByUnifiedDate(rows) {
if (!Array.isArray(rows) || rows.length === 0)
return [];
if (equityFilterStart === null || equityFilterEnd === null)
return rows.slice();
const startDay = tf_dayKey(equityFilterStart);
const endDay = tf_dayKey(equityFilterEnd);
if (startDay === null || endDay === null)
return rows.slice();
const lo = Math.min(startDay, endDay);
const hi = Math.max(startDay, endDay);
return rows.filter((row) => {
const k = tf_getPrimarySortKey(row);
const day = tf_dayKey(k);
if (day === null)
return false;
return day >= lo && day <= hi;
});
}
function tf_applyStartTradeCreatedClosedRule(rows) {
const arr = Array.isArray(rows) ? rows.slice() : [];
try {
return arr.filter(r => tf_isHistoryRowEnabled(r));
}
catch (e) {
return arr;
}
}
function tf_getHistoryRowsForUiAndExport(baseRows) {
const byDate = tf_filterRowsByUnifiedDate(baseRows);
tf_initAutoUntickStartOfMonthRule(byDate);
try {
for (let i = 0; i < byDate.length; i++) {
const r = byDate[i];
if (!r || !r.isWithdraw)
continue;
if (!r.__tfWithdrawAutoUntick)
continue;
const id = tf_historyRowId(r);
if (!id)
continue;
if (tf_historyRowManualOverrideSet && tf_historyRowManualOverrideSet.has(id))
continue;
tf_historyRowEna
~~~
## assets/927ecbd63036f61b.js

### tf_collectLocalStateForExport @ 151425
~~~js
ineCount) {
try {
if (!containerEl)
return;
const rows = Array.from(containerEl.querySelectorAll('.analyst-row'));
const n = Math.max(0, parseInt(baselineCount || 0, 10) || 0);
rows.forEach((row, idx) => {
const shouldLock = idx < n;
tf_setAnalystRowLocked(row, shouldLock);
});
}
catch (e) { }
}
function tf_applyImportLockFromStorageToUI() {
try {
if (!hasChromeStorage())
return;
chrome.storage.local.get([
TF_HAS_IMPORTED_BUNDLE_KEY,
TF_IMPORT_LOCK_ENGAGED_KEY,
TF_IMPORT_LOCKED_SIGS_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY,
TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY,
], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const hasImp = !!(d && d[TF_HAS_IMPORTED_BUNDLE_KEY]);
const lockEngaged = !!(d && d[TF_IMPORT_LOCK_ENGAGED_KEY]);
const lockedSigs = (d && Array.isArray(d[TF_IMPORT_LOCKED_SIGS_KEY])) ? d[TF_IMPORT_LOCKED_SIGS_KEY] : [];
void lockedSigs;
const baseMainCount = (d && typeof d[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY] !== 'undefined')
? (parseInt(d[TF_IMPORT_LOCK_BASELINE_COUNT_MAIN_KEY], 10) || 0)
: 0;
const baseIsignalCount = (d && typeof d[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY] !== 'undefined')
? (parseInt(d[TF_IMPORT_LOCK_BASELINE_COUNT_ISIGNAL_KEY], 10) || 0)
: 0;
const containerMain = document.getElementById('analyst-links-container');
const containerIsignal = document.getElementById('isignal-links-container');
if (hasImp && lockEngaged) {
tf_applyImportLockToContainer(containerMain, baseMainCount);
tf_applyImportLockToContainer(containerIsignal, baseIsignalCount);
tf_setTimeRangeLocked(true);
tf_setAddModeSecondaryActionsVisible(true);
}
else {
if (containerMain) {
const rows = Array.from(containerMain.querySelectorAll('.analyst-row'));
rows.forEach((row) => tf_setAnalystRowLocked(row, false));
}
if (containerIsignal) {
const rows2 = Array.from(containerIsignal.querySelectorAll('.analyst-row'));
rows2.forEach((row) => tf_setAnalystRowLocked(row, false));
}
tf_setTimeRangeLocked(false);
tf_setAddModeSecondaryActionsVisible(false);
}
try {
tf_setUpdateButtonsEnabled(hasImp, lockEngaged);
}
catch (e) { }
});
}
catch (e) { }
}
function tf_safeJsonParse(text) {
try {
return JSON.parse(text);
}
catch (e) {
return null;
}
}
function tf_collectLocalStateForExport() {
const out = {};
try {
if (typeof localStorage === 'undefined')
return out;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
try {
const v = localStorage.getItem(k);
if (v !== null && v !== undefined) {
out[k] = v;
}
}
catch (e) { }
});
}
catch (e) { }
return out;
}
function tf_applyLocalStateFromImport(localState) {
try {
if (!localState || typeof localState !== 'object')
return;
if (typeof localStorage === 'undefined')
return;
(TF_EXPORT_LOCALSTORAGE_KEYS || []).forEach((k) => {
if (!Object.prototype.hasOwnProperty.call(localState, k))
return;
const v = localState[k];
try {
if (v === null || v === undefined || v === '') {
localStorage.removeItem(k);
}
else {
localStorage.setItem(k, String(v));
}
}
catch (e) { }
});
}
catch (e) { }
}
function tf_makeFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const y = d.getFullYear();
const m = pad(d.getMonth() + 1);
const day = pad(d.getDate());
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const ss = pad(d.getSeconds());
return `${y}${m}${day}_${hh}${mm}${ss}`;
}
catch (e) {
return String(Date.now());
}
}
function tf_makePrettyFilenameTimestamp() {
try {
const d = new Date();
const pad = (n) => String(n).padStart(2, '0');
const weekday = new Intl.DateTimeFormat('id-ID', { weekday: 'long' }).format(d);
const day = pad(d.getDate());
const month = pad(d.getMonth() + 1);
const year = d.getFullYear();
const hh = pad(d.getHours());
const mm = pad(d.getMinutes());
const w = String(weekday || '').replace(/\s+/g, '_');
return `${w}_${day}-${month}-${year}_${hh}-${mm}`;
}
catch (e) {
return tf_makeFilenameTimestamp();
}
}
function tf_downloadJsonFile(filename, obj) {
try {
const json = JSON.stringify(obj, null, 2);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
setTimeout(() => {
try {
URL.revokeObjectURL(url);
}
catch (e) { }
try {
a.remove();
}
catch (e) { }
}, 50);
}
catch (e) {
alert('Gagal export data. Coba lagi.');
}
}
function tf_shortUrl(url) {
try {
if (!url)
return '';
const u = new URL(String(url));
const host = u.hostname || '';
let p = u.pathname || '';
if (p.length > 32) {
p = p.slice(0, 10) + '…' + p.slice(-18);
}
return `${host}${p}`;
}
catch (e) {
const s = String(url);
if (s.length <= 48)
return s;
return s.slice(0, 18) + '…' + s.slice(-24);
}
}
function tf_getSavedListEls() {
return [
document.getElementById('scan-channel-saved-list'),
document.getElementById('scan-channel-saved-list-isignal')
].filter(Boolean);
}
function tf_renderSavedChannelsStatusFromStorage() {
try {
if (!hasChromeStorage())
return;
const lists = tf_getSavedListEls();
if (!lists.length)
return;
chrome.storage.local.get([TF_ANALYST_SOURCES_KEY, TF_ANALYST_NAME_CACHE_KEY, TF_SELECTED_TIME_RANGE_KEY, TF_REMEMBERED_LINKS_KEY], (d) => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
const sources = d && d[TF_ANALYST_SOURCES_KEY] && typeof d[TF_ANALYST_SOURCES_KEY] === 'object'
? d[TF_ANALYST_SOURCES_KEY]
: {};
const remembered = Array.isArray(d && d[TF_REMEMBERED_LINKS_KEY])
? d[TF_REMEMBERED_LINKS_KEY]
: [];
const storedNameCache = d && d[TF_ANALYST_NAME_CACHE_KEY] && typeof d[TF_ANALYST_NAME_CACHE_KEY] === 'object'
? { ...d[TF_ANALYST_NAME_CACHE_KEY] }
: {};
const tr = d && d[TF_SELECTED_TIME_RANGE_KEY] ? d[TF_SELECTED_TIME_RANGE_KEY] : 'all_time';
const trLabel = tf_timeRangeLabel(tr);
const byUrl = new Map();
const order = [];
const cacheNext = { ...storedNameCache };
const addChannel = (rawUrl, rawName, rawPairs) => {
try {
const url = tf_normalizeTfAccountUrl(rawUrl);
if (!url)
return;
if (!byUrl.has(url)) {
byUrl.set(url, { url, name: '', pairs: [] });
order.push(url);
}
const entry = byUrl.get(url);
const name = String(rawName || '').trim();
if (!tf_isPlaceholderAnalystName(name)) {
entry.name = name;
__tfStableAnalystNameByUrl[url] = name;
cacheNext[url] = name;
}
const pairs = Array.isArray(rawPairs) ? rawPairs : [];
pairs.forEach((pair) => {
const p = String(pair || '').trim().toUpperCase();
if (!p || p === '__ALL__')
return;
if (!entry.pairs.includes(p))
entry.pairs.push(p);
});
}
catch (e) { }
};
remembered.forEach((item) => {
const it = item && typeof item === 'object' ? item : { url: String(item || '') };
addChannel(it.url || it.link || '', it.name || it.analystName || it.analis || it.label || '', it.pairs);
});
Object.keys(sources).forEach((sourceName) => {
const it = sources[sourceName] || {};
addChannel(it.url || it.link || '', sourceName, it.pairs);
});
Object.keys(storedNameCache).forEach((rawUrl) => {
const name = String(storedNameCache[rawUrl] || '').trim();
const url = tf_normalizeTfAccountUrl(rawUrl);
if (url && !tf_isPlaceholderAnalystName(name)) {
__tfStableAnalystNameByUrl[url] = name;
cacheNext[url] = name;
}
});
const channels = order.map((url, index) => {
const entry = byUrl.get(url);
let name = entry && entry.name ? String(entry.name).trim() : '';
if (tf_isPlaceholderAnalystName(name))
name = '';
if (!name) {
const cached = String(cacheNext[url] || __tfStableAnalystNameByUrl[url] || '').trim();
if (!tf_isPlaceholderAnalystName(cached))
name = cached;
}
if (!name) {
const mm = String(url).match(/\/channels\/(\d+)/i);
name = mm && mm[1] ? `Channel ${mm[1]}` : `Link ${index + 1}`;
}
const pairs = entry && Array.isArray(entry.pairs) ? entry.pairs.slice().sort() : [];
return { name, url, pairs };
});
if (tf_stableJson(cacheNext) !== tf_stableJson(storedNameCache)) {
chrome.storage.local.set({ [TF_ANALYST_NAME_CACHE_KEY]: cacheNext }, () => {
try {
void chrome.runtime.lastError;
}
catch (e) { }
});
}
const openUrl = (url) => {
try {
const u = String(url || '').trim();
if (!u)
return;
if (typeof chrome !== 'undefined' && chrome.tabs && chrome.runtime)
chrome.tabs.create({ url: u });
else
window.open(u, '_blank');
}
catch (e) {
try {
window.open(String(url || ''), '_blank');
}
catch (e2) { }
}
};
const renderSignature = tf_stableJson({ tr: trLabel, channels });
lists.forEach((el) => {
if (el.dataset && el.dataset.tfRenderSignature === renderSignature && el.childElementCount > 0)
return;
const previousScrollTop = el.scrollTop || 0;
const fragment = document.createDocumentFragment();
if (!channels.length) {
const empty = document.createElement('div');
empty.className = 'scan-channel-saved-item';
empty.textContent = 'Belum ada data tersimpan. Silakan Scan dulu atau Imp
~~~

### tf_collectLocalStateForExport @ 188577
~~~js
edByList.forEach(tfPushOwner);
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
name: name || prev.name || prev.analystName || '
~~~
