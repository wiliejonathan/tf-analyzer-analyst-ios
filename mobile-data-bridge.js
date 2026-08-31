(function(){
"use strict";
const LOCAL_STATE_KEYS=[
  "tf_equity_metric","tf_risk_mode","tf_compound_months","tf_current_balance",
  "tf_current_risk_percent","tf_risk_overrides","tf_sl_type_selection"
];
const SCHEMA="tf_multi_analyst_export_v1";
const TF_MOBILE_IMPORT_LOADING_KEY="tf_mobile_import_loading_v8";
const TF_MOBILE_IMPORT_LOADING_DETAIL_KEY="tf_mobile_import_loading_detail_v8";
const TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY="tf_mobile_import_expected_trades_v8";
const TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY="tf_mobile_import_expected_analysts_v8";
const TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY="tf_mobile_import_expected_summary_rows_v8";
const TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY="tf_mobile_import_expected_score_v8";


// REV294 APK-only: universal 2-step in-app Cancel confirmation + Android Back guard.
(function tfRev294CancelFramework(){
  if(window.tfRev294ConfirmCancel)return;
  let resolver=null,step=1,loadingSources=new Set(),previousState=null,backArmed=false;
  function ensure(){
    let ov=document.getElementById('tf-rev294-confirm-overlay');
    if(ov)return ov;
    ov=document.createElement('div');ov.id='tf-rev294-confirm-overlay';ov.className='tf-rev294-confirm-overlay';ov.setAttribute('aria-hidden','true');
    ov.innerHTML=`<div class="tf-rev294-confirm-card" role="dialog" aria-modal="true">
      <strong id="tf-rev294-confirm-title">Batalkan proses?</strong>
      <p id="tf-rev294-confirm-text">Proses yang sedang berjalan akan dihentikan.</p>
      <div id="tf-rev294-confirm-step" class="tf-rev294-confirm-step">Verifikasi 1 dari 2</div>
      <div class="tf-rev294-confirm-actions"><button id="tf-rev294-confirm-no" class="tf-rev294-confirm-no" type="button">No</button><button id="tf-rev294-confirm-yes" class="tf-rev294-confirm-yes" type="button">Yes</button></div>
    </div>`;
    document.body.appendChild(ov);
    ov.querySelector('#tf-rev294-confirm-no').addEventListener('click',()=>finish(false));
    ov.querySelector('#tf-rev294-confirm-yes').addEventListener('click',()=>{
      if(step===1){step=2;ov.querySelector('#tf-rev294-confirm-title').textContent='Yakin force Cancel?';ov.querySelector('#tf-rev294-confirm-text').textContent='Konfirmasi terakhir. Proses Mobile akan dihentikan sekarang.';ov.querySelector('#tf-rev294-confirm-step').textContent='Verifikasi 2 dari 2';return;}
      finish(true);
    });
    return ov;
  }
  function finish(ok){const ov=ensure();ov.classList.remove('show');ov.setAttribute('aria-hidden','true');const r=resolver;resolver=null;step=1;if(r)r(!!ok);}
  window.tfRev294ConfirmCancel=function(){
    if(resolver)return Promise.resolve(false);
    const ov=ensure();step=1;ov.querySelector('#tf-rev294-confirm-title').textContent='Batalkan proses?';ov.querySelector('#tf-rev294-confirm-text').textContent='Proses yang sedang berjalan akan dihentikan.';ov.querySelector('#tf-rev294-confirm-step').textContent='Verifikasi 1 dari 2';ov.classList.add('show');ov.setAttribute('aria-hidden','false');
    return new Promise(resolve=>{resolver=resolve;});
  };
  window.tfRev294ConfirmAndCancel=async function(source){if(!await window.tfRev294ConfirmCancel())return false;window.dispatchEvent(new CustomEvent('tf-rev294-force-cancel',{detail:{source:source||'unknown'}}));return true;};
  function armBack(){
    if(backArmed)return;backArmed=true;previousState=history.state;
    try{history.pushState(Object.assign({},previousState||{},{tfRev294LoadingCancel:true}),'',location.href);}catch(_){}
  }
  function disarmBack(){
    if(!backArmed)return;backArmed=false;
    try{if(history.state&&history.state.tfRev294LoadingCancel)history.replaceState(previousState||null,'',location.href);}catch(_){}
    previousState=null;
  }
  window.tfRev294SetLoading=function(source,active){source=String(source||'unknown');if(active)loadingSources.add(source);else loadingSources.delete(source);if(loadingSources.size)armBack();else disarmBack();};
  window.addEventListener('popstate',function(e){
    if(!backArmed||!loadingSources.size)return;
    try{e.stopImmediatePropagation();e.preventDefault();}catch(_){}
    try{history.pushState(Object.assign({},previousState||{},{tfRev294LoadingCancel:true}),'',location.href);}catch(_){}
    const source=loadingSources.has('remote')?'remote':(loadingSources.has('import')?'import':Array.from(loadingSources)[0]);
    void window.tfRev294ConfirmAndCancel(source);
  });
})();

function tfMobileGetImportOverlay(){
  let el=document.getElementById("tf-mobile-import-loading");
  if(!el){
    el=document.createElement("div");
    el.id="tf-mobile-import-loading";el.className="tf-mobile-import-loading";el.setAttribute("role","status");el.setAttribute("aria-live","polite");
    el.innerHTML=`<div class="tf-mobile-import-loading-card"><div class="tf-mobile-import-spinner" aria-hidden="true"><span></span><span></span><span></span></div>
      <div class="tf-mobile-import-loading-title">Memuat Data</div><div id="tf-mobile-import-loading-message" class="tf-mobile-import-loading-message">Menyiapkan import…</div>
      <div class="tf-mobile-import-loading-bar" aria-hidden="true"><i></i></div><div id="tf-mobile-import-loading-detail" class="tf-mobile-import-loading-detail">Mohon tunggu. Jangan tutup aplikasi.</div>
      <button id="tf-mobile-import-cancel-rev293" class="tf-rev293-cancel-btn" type="button">Cancel</button></div>`;
    document.body.appendChild(el);
  }
  let cancel=el.querySelector('#tf-mobile-import-cancel-rev293');
  if(!cancel){cancel=document.createElement('button');cancel.id='tf-mobile-import-cancel-rev293';cancel.className='tf-rev293-cancel-btn';cancel.type='button';cancel.textContent='Cancel';const card=el.querySelector('.tf-mobile-import-loading-card')||el;card.appendChild(cancel);}
  if(cancel.dataset.rev294!=='1'){
    cancel.dataset.rev294='1';cancel.disabled=false;cancel.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();void window.tfRev294ConfirmAndCancel('import');},true);
  }
  return el;
}

// Wire the Cancel button even when the loading overlay was restored by the inline boot script before this file loaded.
setTimeout(()=>{try{tfMobileGetImportOverlay();}catch(_){}},0);

function tfMobileShowImportLoading(message,detail){
  const el=tfMobileGetImportOverlay();
  const msg=el.querySelector("#tf-mobile-import-loading-message");
  const det=el.querySelector("#tf-mobile-import-loading-detail");

  if(msg)msg.textContent=message||"Memuat data…";
  if(det)det.textContent=detail||"Mohon tunggu. Jangan tutup aplikasi.";

  el.classList.add("show");
  document.documentElement.classList.add("tf-mobile-import-busy");
  try{window.tfRev294SetLoading&&window.tfRev294SetLoading('import',true);}catch(_){}

  try{
    sessionStorage.setItem(
      TF_MOBILE_IMPORT_LOADING_KEY,
      "1"
    );

    if(detail){
      sessionStorage.setItem(
        TF_MOBILE_IMPORT_LOADING_DETAIL_KEY,
        String(detail)
      );
    }
  }catch(e){}
}

function tfMobileUpdateImportLoading(message,detail){
  const el=tfMobileGetImportOverlay();
  const msg=el.querySelector("#tf-mobile-import-loading-message");
  const det=el.querySelector("#tf-mobile-import-loading-detail");

  if(msg&&message)msg.textContent=message;
  if(det&&detail)det.textContent=detail;

  if(!el.classList.contains("show")){
    el.classList.add("show");
  }
}

function tfMobileHideImportLoading(){
  const el=document.getElementById("tf-mobile-import-loading");

  try{
    [
      TF_MOBILE_IMPORT_LOADING_KEY,
      TF_MOBILE_IMPORT_LOADING_DETAIL_KEY,
      TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY,
      TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY,
      TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY,
      TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY
    ].forEach(k=>sessionStorage.removeItem(k));
  }catch(e){}

  document.documentElement.classList.remove("tf-mobile-import-busy");
  try{window.tfRev294SetLoading&&window.tfRev294SetLoading('import',false);}catch(_){}

  if(!el)return;

  el.classList.add("done");

  setTimeout(()=>{
    el.classList.remove("show","done");
  },240);
}
function tfMobileResumeImportLoadingIfNeeded(){
  let shouldResume=false;
  let detail="Membangun tabel, statistik, dan equity…";

  try{
    shouldResume=
      sessionStorage.getItem(
        TF_MOBILE_IMPORT_LOADING_KEY
      )==="1";

    detail=
      sessionStorage.getItem(
        TF_MOBILE_IMPORT_LOADING_DETAIL_KEY
      )||
      detail;
  }catch(e){}

  if(!shouldResume)return false;

  tfMobileShowImportLoading(
    "Menyiapkan dashboard…",
    detail
  );

  return true;
}

function tfMobileFinishImportLoadingWhenReady(){
  let shouldFinish=false;

  try{
    shouldFinish=
      sessionStorage.getItem(
        TF_MOBILE_IMPORT_LOADING_KEY
      )==="1";
  }catch(e){}

  if(!shouldFinish)return;

  const intVal=(key,fallback=0)=>{
    try{
      const n=parseInt(
        sessionStorage.getItem(key)||"",
        10
      );
      return Number.isFinite(n)&&n>=0
        ? n
        : fallback;
    }catch(e){
      return fallback;
    }
  };

  const expectedTrades=
    intVal(
      TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY,
      0
    );

  const expectedAnalysts=
    intVal(
      TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY,
      0
    );

  const expectedSummaryRows=
    intVal(
      TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY,
      0
    );

  const expectedScoreRecords=
    intVal(
      TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY,
      0
    );

  const started=Date.now();
  let lastProgressText="";

  const count=(selector)=>{
    try{
      return document.querySelectorAll(selector).length;
    }catch(e){
      return 0;
    }
  };

  const isEquityReady=()=>{
    if(expectedTrades<=0)return true;

    const canvas=
      document.getElementById(
        "equity-curve-canvas"
      );

    const emptyNote=
      document.getElementById(
        "equity-empty-note"
      );

    if(!canvas||!emptyNote)return false;

    try{
      const display=
        getComputedStyle(
          emptyNote
        ).display;

      return display==="none";
    }catch(e){
      return (
        emptyNote.style.display==="none"
      );
    }
  };

  const check=()=>{
    const summaryRows=count("#summary-table tbody tr");
    const perfRows=count("#tf-perf-body-left tr")+count("#tf-perf-body-right tr");
    const monthlyRows=count("#monthly-body tr:not(.monthly-total-row)");
    const historyRows=count("#history-table tbody tr:not(.tf-start-balance-row)");
    const scoreRows=count("#tf-score-summary-body .tf-score-summary-row");
    const appReady=document.body.classList.contains("tf-mobile-app");

    const table1Ready=expectedSummaryRows>0?summaryRows>0:true;
    const performanceReady=expectedAnalysts>0?perfRows>0:true;
    const table2Ready=expectedSummaryRows>0?monthlyRows>0:true;
    const table3Ready=expectedTrades>0?historyRows>0:true;
    const equityReady=isEquityReady();
    const table4Ready=expectedScoreRecords>0?scoreRows>0:true;

    const states=[
      ["Table 1",table1Ready],
      ["Performance",performanceReady],
      ["Table 2",table2Ready],
      ["Equity",equityReady],
      ["Table 3",table3Ready],
      ["Table 4",table4Ready]
    ];

    const requiredStates=states.filter(([name])=>name!=="Table 4"||expectedScoreRecords>0);
    const readyCount=requiredStates.filter(([,ok])=>ok).length;
    const totalCount=requiredStates.length;
    const pendingNames=requiredStates.filter(([,ok])=>!ok).map(([name])=>name);
    const progressText=`${readyCount}/${totalCount} bagian siap`;

    if(progressText!==lastProgressText){
      lastProgressText=progressText;
      tfMobileUpdateImportLoading(
        "Membangun dashboard…",
        pendingNames.length
          ? `${progressText} • Menunggu ${pendingNames.join(", ")}`
          : `${progressText} • Menyelesaikan tampilan…`
      );
    }

    const allReady=appReady&&requiredStates.every(([,ok])=>ok);

    if(allReady){
      tfMobileUpdateImportLoading(
        "Data siap",
        "Semua tabel sudah selesai dimuat."
      );
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=>{
          setTimeout(
            tfMobileHideImportLoading,
            420
          );
        });
      });
      return;
    }

    const elapsedMs=Date.now()-started;

    // V29: never let the loading overlay become an endless blocker.
    // Core imported data is already safely stored before reload. Heavy charts
    // and optional panels may finish a moment later in the background.
    const coreReady=appReady && (
      expectedTrades>0 ? historyRows>0 : (summaryRows>0 || expectedSummaryRows===0)
    );

    if(elapsedMs>6000 && coreReady){
      tfMobileUpdateImportLoading(
        "Data berhasil dimuat",
        pendingNames.length
          ? `Panel ${pendingNames.join(", ")} dilanjutkan di background.`
          : "Dashboard siap digunakan."
      );
      setTimeout(tfMobileHideImportLoading,320);
      return;
    }

    if(elapsedMs>12000){
      tfMobileUpdateImportLoading(
        "Data import sudah tersimpan",
        pendingNames.length
          ? `Menutup loading. ${pendingNames.join(", ")} akan dirender saat tab dibuka.`
          : "Dashboard siap digunakan."
      );
      setTimeout(tfMobileHideImportLoading,320);
      return;
    }

    if(elapsedMs>4000){
      tfMobileUpdateImportLoading(
        "Menyiapkan tampilan…",
        pendingNames.length
          ? `Menunggu ${pendingNames.join(", ")}.`
          : "Menyelesaikan dashboard."
      );
    }

    setTimeout(check,150);
  };

  check();
}
window.tfMobileShowImportLoading=tfMobileShowImportLoading;
window.tfMobileUpdateImportLoading=tfMobileUpdateImportLoading;
window.tfMobileHideImportLoading=tfMobileHideImportLoading;
window.tfMobileResumeImportLoadingIfNeeded=tfMobileResumeImportLoadingIfNeeded;
window.tfMobileFinishImportLoadingWhenReady=tfMobileFinishImportLoadingWhenReady;

function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function clone(v,f){try{return JSON.parse(JSON.stringify(v));}catch(e){return f;}}
function storageGet(keys){return new Promise(r=>chrome.storage.local.get(keys,x=>r(x||{})));}
function storageSet(o){
  return new Promise((resolve,reject)=>{
    window.__TF_MOBILE_STORAGE_LAST_ERROR="";
    chrome.storage.local.set(o,()=>{
      const err=(window.__TF_MOBILE_STORAGE_LAST_ERROR||"").trim();
      if(err){reject(new Error("Gagal menyimpan data import: "+err));return;}
      resolve();
    });
  });
}
function status(msg,ok){
  const el=document.getElementById("tf-mobile-import-status");
  if(!el)return;
  el.textContent=msg||"";
  el.className="tf-mobile-import-status "+(ok===true?"ok":ok===false?"bad":"");
}
function historyKey(it){
  try{
    const norm=v=>String(v==null?"":v).trim().replace(/\s+/g," ");
    const numlike=v=>{const raw=norm(v);if(!raw)return"";const n=Number(raw.replace(/,/g,""));return Number.isFinite(n)?String(Math.round(n*100000)/100000):raw.toLowerCase();};
    const analyst=norm(it&&it.analyst).toLowerCase();
    const pair=norm(it&&it.pair).toUpperCase();
    const created=norm((it&&(it.createdSortKey!=null?it.createdSortKey:it.createdDate))||"").toLowerCase();
    const closed=norm((it&&(it.sortKey!=null?it.sortKey:it.displayDate))||"").toLowerCase();
    const signalId=norm(it&&it.signalId).toLowerCase();
    if(signalId)return [analyst,pair,created,closed,"signal:"+signalId].join("|");
    return [analyst,pair,created,closed,"entry:"+numlike(it&&it.entry),"type:"+norm(it&&it.type).toLowerCase()].join("|");
  }catch(e){return"";}
}
function completeness(it){
  if(!it||typeof it!=="object")return 0;
  let n=0;Object.keys(it).forEach(k=>{const v=it[k];if(v!==null&&v!==undefined&&String(v).trim()!=="")n++;});return n;
}
function mergeHistory(a,b){
  const map=new Map();
  const put=it=>{
    if(!it||typeof it!=="object")return;
    const k=historyKey(it)||JSON.stringify(it),prev=map.get(k);
    if(!prev){map.set(k,{...it});return;}
    const base=completeness(it)>completeness(prev)?{...prev,...it}:{...it,...prev};
    Object.keys(prev).forEach(x=>{if(base[x]==null||String(base[x]).trim()==="")base[x]=prev[x];});
    Object.keys(it).forEach(x=>{if(base[x]==null||String(base[x]).trim()==="")base[x]=it[x];});
    map.set(k,base);
  };
  (Array.isArray(a)?a:[]).forEach(put);(Array.isArray(b)?b:[]).forEach(put);
  return [...map.values()];
}
function mergeScore(a,b){
  const map=new Map();
  const put=it=>{
    if(!it||typeof it!=="object")return;
    const k=[String(it.analyst||it.analystName||"").trim().toLowerCase(),String(it.pair||"").trim().toUpperCase(),String(it.displayDate||it.date||it.sortKey||"").trim(),String(it.score||it.value||"").trim()].join("|");
    map.set(k,map.has(k)?{...map.get(k),...it}:{...it});
  };
  (Array.isArray(a)?a:[]).forEach(put);(Array.isArray(b)?b:[]).forEach(put);return [...map.values()];
}
function mergeMonthly(a,b){
  const out=clone(a&&typeof a==="object"?a:{},{});
  const src=b&&typeof b==="object"?b:{};
  Object.keys(src).forEach(k=>{out[k]={...(out[k]&&typeof out[k]==="object"?out[k]:{}),...clone(src[k]&&typeof src[k]==="object"?src[k]:{},{})};});
  return out;
}
function mergeObjects(a,b){return {...(clone(a&&typeof a==="object"?a:{},{})||{}),...(clone(b&&typeof b==="object"?b:{},{})||{})};}
function combine(payloads,names){
  const list=payloads.filter(x=>x&&typeof x==="object");
  if(!list.length)throw new Error("Tidak ada file valid.");
  const first=list[0].storage&&typeof list[0].storage==="object"?list[0].storage:list[0];
  let out={...(first||{})};
  out.tfHistorySignals=Array.isArray(first.tfHistorySignals)?first.tfHistorySignals.slice():[];
  out.tfScoreHistory=Array.isArray(first.tfScoreHistory)?first.tfScoreHistory.slice():[];
  out.tfMonthlyStats=mergeMonthly({},first.tfMonthlyStats);
  ["tfNoDataPairs","tfAvgSlPips","tfAnalystSources","tfAnalystNameCacheByUrl"].forEach(k=>{
    out[k]=mergeObjects({},first[k]);
  });
  for(let i=1;i<list.length;i++){
    const src=list[i].storage&&typeof list[i].storage==="object"?list[i].storage:list[i];
    out.tfHistorySignals=mergeHistory(out.tfHistorySignals,src.tfHistorySignals);
    out.tfScoreHistory=mergeScore(out.tfScoreHistory,src.tfScoreHistory);
    out.tfMonthlyStats=mergeMonthly(out.tfMonthlyStats,src.tfMonthlyStats);
    ["tfNoDataPairs","tfAvgSlPips","tfAnalystSources","tfAnalystNameCacheByUrl"].forEach(k=>out[k]=mergeObjects(out[k],src[k]));
    Object.keys(src||{}).forEach(k=>{if(!(k in out))out[k]=clone(src[k],src[k]);});
  }
  return {
    schema:SCHEMA,exportedAt:new Date().toISOString(),combined:list.length>1,
    combinedFileCount:list.length,combinedFiles:names.slice(),
    exportedBy:list[0].exportedBy||null,exportedByList:list[0].exportedByList||[],
    localState:clone(list[0].localState||{},{}),storage:out
  };
}
function tfMobileFirstFiniteV31(){
  for(let i=0;i<arguments.length;i++){
    const raw=arguments[i];
    if(raw===null||raw===undefined||raw==='')continue;
    const n=typeof raw==='number'?raw:Number(String(raw).replace(/,/g,'').trim());
    if(Number.isFinite(n))return n;
  }
  return null;
}
function tfMobileArrayV31(value){
  if(Array.isArray(value))return value.slice();
  if(!value||typeof value!=='object')return [];
  for(const k of ['items','rows','data','results','signals','history']){
    if(Array.isArray(value[k]))return value[k].slice();
  }
  const vals=Object.values(value);
  return vals.length&&vals.every(v=>v&&typeof v==='object')?vals:[];
}
function tfMobileNormalizeHistoryV31(value){
  const src=tfMobileArrayV31(value);
  return src.map((row,idx)=>{
    if(!row||typeof row!=='object')return null;
    const out={...row};
    const analyst=String(row.analyst??row.analystName??row.name??row.channelName??row.trader??'').trim();
    const pair=String(row.pair??row.symbol??row.ticker??row.instrument??'').trim().toUpperCase();
    const pips=tfMobileFirstFiniteV31(row.pips,row.pnlPips,row.profitPips,row.resultPips,row.closedPips,row.pip,row.pipResult);
    if(analyst)out.analyst=analyst;
    if(pair)out.pair=pair;
    if(pips!==null)out.pips=pips;
    if(out.displayDate==null||String(out.displayDate).trim()==='')out.displayDate=row.closedDate??row.closedAt??row.date??row.closeTime??'';
    if(out.createdDate==null||String(out.createdDate).trim()==='')out.createdDate=row.createdAt??row.openedAt??row.openDate??row.entryTime??'';
    if(out.sortKey==null&&row.closedAt){const t=Date.parse(String(row.closedAt));if(Number.isFinite(t))out.sortKey=t;}
    if(out.createdSortKey==null&&row.createdAt){const t=Date.parse(String(row.createdAt));if(Number.isFinite(t))out.createdSortKey=t;}
    if(!out.signalId&&row.id!=null)out.signalId=String(row.id);
    out.__tfMobileImportIndexV31=idx;
    return out;
  }).filter(row=>row&&row.analyst&&row.pair&&Number.isFinite(Number(row.pips)));
}
function tfMobileBuildSourcesFromHistoryV31(history,existing){
  const out=existing&&typeof existing==='object'&&!Array.isArray(existing)?clone(existing,{}):{};
  for(const row of history){
    const name=String(row&&row.analyst||'').trim();
    const pair=String(row&&row.pair||'').trim().toUpperCase();
    if(!name||!pair)continue;
    if(!out[name]||typeof out[name]!=='object')out[name]={url:'',pairs:[]};
    if(!Array.isArray(out[name].pairs))out[name].pairs=[];
    if(!out[name].pairs.map(x=>String(x).toUpperCase()).includes(pair))out[name].pairs.push(pair);
  }
  return out;
}
function tfMobileNormalizeStorageV31(input){
  const st=input&&typeof input==='object'?clone(input,{}):{};
  const historyCandidate=st.tfHistorySignals??st.historySignals??st.tfHistory??st.history??st.signals;
  const history=tfMobileNormalizeHistoryV31(historyCandidate);
  st.tfHistorySignals=history;
  st.tfAnalystSources=tfMobileBuildSourcesFromHistoryV31(history,st.tfAnalystSources??st.analystSources);
  st.tfMonthlyStats=(st.tfMonthlyStats&&typeof st.tfMonthlyStats==='object')?st.tfMonthlyStats:{};
  st.tfScoreHistory=tfMobileArrayV31(st.tfScoreHistory??st.scoreHistory);
  st.tfNoDataPairs=(st.tfNoDataPairs&&typeof st.tfNoDataPairs==='object')?st.tfNoDataPairs:{};
  st.tfAvgSlPips=(st.tfAvgSlPips&&typeof st.tfAvgSlPips==='object')?st.tfAvgSlPips:{};
  return st;
}
async function tfMobileReadBackV31(){
  return storageGet(['tfHistorySignals','tfAnalystSources','tfMonthlyStats','tfScoreHistory']);
}
async function tfMobileRecoverRenderV31(reason){
  try{
    const data=await tfMobileReadBackV31();
    const history=Array.isArray(data.tfHistorySignals)?data.tfHistorySignals:[];
    const sources=data.tfAnalystSources&&typeof data.tfAnalystSources==='object'?data.tfAnalystSources:{};
    if(!history.length&&!Object.keys(sources).length)return false;

    // REV336: imported IndexedDB data is authoritative. Always push it back into
    // the dashboard globals before deciding that the UI is already rendered.
    try{
      if(typeof selectedAnalystPairsMapStats!=='undefined')selectedAnalystPairsMapStats=null;
      if(typeof selectedAnalystPairsMapHistory!=='undefined')selectedAnalystPairsMapHistory=null;
      if(typeof selectedAnalystsGlobal!=='undefined')selectedAnalystsGlobal=null;
    }catch(_){ }

    if(typeof loadFromChromeStorageIfAvailable==='function')loadFromChromeStorageIfAvailable();
    await new Promise(r=>setTimeout(r,280));

    try{
      if(typeof rebuildAnalystListFromSources==='function')rebuildAnalystListFromSources();
      if(typeof setupAnalystTickerFilter==='function')setupAnalystTickerFilter();
      if(typeof applyAnalystPairFilterAll==='function')applyAnalystPairFilterAll();
      if(typeof recomputeHistoryRows==='function')recomputeHistoryRows();
      if(typeof renderSummaryTable==='function')renderSummaryTable();
      if(typeof window.tfRenderScoreHistory==='function')window.tfRenderScoreHistory();
    }catch(e){console.warn('TF Mobile REV336 render recovery warning',reason,e);}

    await new Promise(r=>setTimeout(r,120));
    const historyRows=[...document.querySelectorAll('#history-table tbody tr:not(.tf-start-balance-row)')].filter(tr=>{
      const txt=String(tr.textContent||'').trim();
      return txt && !/belum ada|tidak ada data|no data/i.test(txt);
    }).length;
    const summaryRows=[...document.querySelectorAll('#summary-table tbody tr')].filter(tr=>{
      const txt=String(tr.textContent||'').trim();
      return txt && !/belum ada|tidak ada data|no data/i.test(txt);
    }).length;
    return historyRows>0||summaryRows>0||history.length>0;
  }catch(e){console.warn('TF Mobile REV336 render recovery failed',reason,e);return false;}
}
window.tfMobileRecoverRenderV31=tfMobileRecoverRenderV31;

async function applyPayload(payload,fileNames){
  if(!payload||typeof payload!=="object")throw new Error("Format file tidak valid.");
  const rawStorage=payload.storage&&typeof payload.storage==="object"?payload.storage:payload;
  const st=tfMobileNormalizeStorageV31(rawStorage);
  const defaults={tfMonthlyStats:{},tfHistorySignals:[],tfScoreHistory:[],tfNoDataPairs:{},tfAvgSlPips:{},tfAnalystSources:{}};
  Object.keys(defaults).forEach(k=>{if(!(k in st))st[k]=defaults[k];});
  st.tfSelectedTimeRange=st.tfSelectedTimeRange||"all_time";
  st.tfLastImportMeta={
    importedAt:new Date().toISOString(),
    fileName:fileNames.length===1?fileNames[0]:"",
    files:fileNames.slice(),
    combined:fileNames.length>1,
    exportedBy:payload.exportedBy||null,
    exportedByList:Array.isArray(payload.exportedByList)?payload.exportedByList:[]
  };
  // REV336: do not suppress chrome.storage.onChanged. The IndexedDB shim writes
  // the entire payload in one transaction, then dashboard listeners can repaint.
  await storageSet(st);

  const verify=await tfMobileReadBackV31();
  const savedHistory=Array.isArray(verify.tfHistorySignals)?verify.tfHistorySignals:[];
  const savedSources=verify.tfAnalystSources&&typeof verify.tfAnalystSources==='object'?verify.tfAnalystSources:{};
  if(st.tfHistorySignals.length>0&&savedHistory.length===0){
    throw new Error('Data history sudah diproses tetapi gagal dibaca kembali dari storage Mobile.');
  }
  if(st.tfHistorySignals.length>0&&Object.keys(savedSources).length===0){
    throw new Error('Data analis gagal dibaca kembali setelah import.');
  }

  if(payload.localState&&typeof payload.localState==="object"){
    LOCAL_STATE_KEYS.forEach(k=>{
      if(Object.prototype.hasOwnProperty.call(payload.localState,k)){
        const v=payload.localState[k];
        if(v==null||v==="")localStorage.removeItem(k);else localStorage.setItem(k,String(v));
      }
    });
  }
}
async function importFiles(files,opts={}){
  if(!files.length)return;

  const started=performance.now();
  const payloads=[];
  const fileNames=files.map(f=>f.name);

  tfMobileShowImportLoading(
    files.length>1
      ? `Membaca ${files.length} file…`
      : "Membaca file JSON…",
    files.length>1
      ? "Menyiapkan data untuk digabungkan."
      : (fileNames[0]||"Menyiapkan data.")
  );

  status("Membaca data…");

  try{
    for(let i=0;i<files.length;i++){
      if(window.__tfRev293ImportCancelled)throw new Error('Import dibatalkan user.');
      const f=files[i];
      tfMobileUpdateImportLoading(files.length>1?`Membaca file ${i+1} dari ${files.length}…`:"Membaca file JSON…",f.name);
      const txt=await f.text();
      tfMobileUpdateImportLoading(files.length>1?`Memproses file ${i+1} dari ${files.length}…`:"Memproses data JSON…","Mengurai history, analyst, dan statistik.");
      status(files.length>1?`Membaca file ${i+1}/${files.length}…`:"Memproses JSON…");
      await new Promise(resolve=>requestAnimationFrame(resolve));
      const p=JSON.parse(txt);
      if(p.schema&&p.schema!==SCHEMA)console.warn("Schema berbeda:",p.schema);
      payloads.push(p);
    }

    if(window.__tfRev293ImportCancelled)throw new Error('Import dibatalkan user.');
    tfMobileUpdateImportLoading(payloads.length>1?"Menggabungkan data…":"Menyiapkan data…","Menghindari duplikasi dan menyiapkan storage.");
    status(payloads.length>1?"Menggabungkan data…":"Menyimpan data…");
    await new Promise(resolve=>requestAnimationFrame(resolve));

    const payload=payloads.length>1?combine(payloads,fileNames):payloads[0];
    const normalizedStorage=tfMobileNormalizeStorageV31(payload&&payload.storage&&typeof payload.storage==='object'?payload.storage:payload);
    if(payload&&payload.storage&&typeof payload.storage==='object')payload.storage=normalizedStorage;else Object.assign(payload,normalizedStorage);
    const trades=Array.isArray(normalizedStorage.tfHistorySignals)?normalizedStorage.tfHistorySignals.length:0;
    const analystSources=normalizedStorage.tfAnalystSources&&typeof normalizedStorage.tfAnalystSources==="object"?normalizedStorage.tfAnalystSources:{};
    const expectedAnalysts=Object.keys(analystSources).length;
    let expectedSummaryRows=0;
    Object.values(analystSources).forEach(source=>{
      const pairs=source&&Array.isArray(source.pairs)?source.pairs:[];
      expectedSummaryRows+=Math.max(1,pairs.length);
    });
    if(expectedSummaryRows<=0&&expectedAnalysts>0)expectedSummaryRows=expectedAnalysts;
    const scoreSource=normalizedStorage.tfScoreHistory;
    const expectedScoreRecords=Array.isArray(scoreSource)?scoreSource.length:(scoreSource&&typeof scoreSource==="object"?Object.keys(scoreSource).length:0);

    try{
      sessionStorage.setItem(TF_MOBILE_IMPORT_EXPECTED_TRADES_KEY,String(trades));
      sessionStorage.setItem(TF_MOBILE_IMPORT_EXPECTED_ANALYSTS_KEY,String(expectedAnalysts));
      sessionStorage.setItem(TF_MOBILE_IMPORT_EXPECTED_SUMMARY_ROWS_KEY,String(expectedSummaryRows));
      sessionStorage.setItem(TF_MOBILE_IMPORT_EXPECTED_SCORE_KEY,String(expectedScoreRecords));
    }catch(e){}

    tfMobileUpdateImportLoading("Menyimpan data…",trades?`${trades.toLocaleString("id-ID")} trade sedang disiapkan.`:"Menyimpan data ke perangkat.");
    await applyPayload(payload,fileNames);

    const elapsed=Math.max(0,(performance.now()-started)/1000);
    status(`Import selesai • ${trades.toLocaleString("id-ID")} trade • ${elapsed.toFixed(1)} dtk`,true);
    tfMobileUpdateImportLoading("Membangun dashboard…","Menyiapkan Table 1, Performance, Table 2, Equity, Table 3, dan Table 4.");

    try{
      sessionStorage.setItem(TF_MOBILE_IMPORT_LOADING_KEY,"1");
      sessionStorage.setItem(TF_MOBILE_IMPORT_LOADING_DETAIL_KEY,trades?`${trades.toLocaleString("id-ID")} trade sedang ditampilkan.`:"Menampilkan data hasil import.");
    }catch(e){}

    // REV336 Web/iOS: render imported data in-place. A full location.reload() was
    // causing the license gate to be revisited and could race IndexedDB hydration.
    let rendered=false;
    for(const waitMs of [0,180,420,900,1600]){
      if(waitMs)await new Promise(r=>setTimeout(r,waitMs));
      try{rendered=await tfMobileRecoverRenderV31('import-rev336-'+waitMs)||rendered;}catch(_){}
      if(rendered)break;
    }
    tfMobileUpdateImportLoading(
      rendered?'Data berhasil dimuat':'Data import tersimpan',
      rendered?'Dashboard sudah diperbarui tanpa refresh.':'Data tersimpan. Buka Table 1/Table 3 untuk memicu render ulang.'
    );
    status(`Import selesai • ${trades.toLocaleString("id-ID")} trade • ${elapsed.toFixed(1)} dtk`,true);
    setTimeout(tfMobileHideImportLoading,rendered?380:700);
    return {ok:true,trades,analysts:expectedAnalysts,reload:false,rendered};

  }catch(e){
    tfMobileUpdateImportLoading("Import gagal",e&&e.message?String(e.message):"File tidak dapat diproses.");
    setTimeout(tfMobileHideImportLoading,900);
    throw e;
  }
}
window.tfMobileImportFiles=importFiles;
window.tfMobileApplyRemotePayload=applyPayload;
async function clearData(){
  if(!confirm("Hapus semua data import di prototype mobile ini?"))return;
  await new Promise(r=>chrome.storage.local.clear(()=>r()));
  LOCAL_STATE_KEYS.forEach(k=>localStorage.removeItem(k));
  location.reload();
}
function mountControls(){
  if(document.getElementById("tf-mobile-data-controls"))return true;
  const section=document.getElementById("section-summary");
  if(!section)return false;
  const box=document.createElement("section");
  box.id="tf-mobile-data-controls";
  box.className="tf-mobile-data-controls";
  box.innerHTML=`
    <div class="tf-mobile-import-row">
      <button id="tf-mobile-import-btn" type="button">Import JSON</button>
      <button id="tf-mobile-clear-btn" type="button">Hapus Data</button>
      <input id="tf-mobile-import-input" type="file" accept=".json,application/json" multiple hidden>
    </div>
    <div id="tf-mobile-import-status" class="tf-mobile-import-status"></div>`;
  section.insertBefore(box,section.firstChild);
  const input=box.querySelector("#tf-mobile-import-input");
  box.querySelector("#tf-mobile-import-btn").onclick=()=>input.click();
  box.querySelector("#tf-mobile-clear-btn").onclick=()=>clearData();
  input.onchange=async()=>{
    const files=[...(input.files||[])];
    input.value="";
    try{await importFiles(files);}catch(e){status(e&&e.message?e.message:String(e),false);}
  };
  return true;
}

const timer=setInterval(()=>{if(mountControls())clearInterval(timer);},120);
setTimeout(()=>clearInterval(timer),15000);

// V31: imported storage is authoritative. If the original dashboard boots before
// IndexedDB data has finished propagating, reload it from storage and force a render.
[450,1200,2600,5200].forEach(ms=>setTimeout(()=>tfMobileRecoverRenderV31('boot-'+ms),ms));
try{chrome.storage.onChanged.addListener((changes,area)=>{if(area==='local'&&changes&&(changes.tfHistorySignals||changes.tfAnalystSources))setTimeout(()=>tfMobileRecoverRenderV31('storage-change'),80);});}catch(_){ }

})();


// REV294: confirmed Cancel from button or Android Back aborts local import immediately.
window.addEventListener('tf-rev294-force-cancel',e=>{
  if(!e||!e.detail||e.detail.source!=='import')return;
  window.__tfRev293ImportCancelled=true;
  try{tfMobileHideImportLoading();}catch(_){}
});
