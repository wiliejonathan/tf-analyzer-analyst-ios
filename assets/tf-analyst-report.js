(() => {
  'use strict';
  const id='tf-analyst-report', hash='#analis-report';
  const norm=v=>typeof tf_latestRiskNormAnalyst==='function'?tf_latestRiskNormAnalyst(v):String(v||'').trim().toLowerCase();
  const safeUrl=v=>{try{const u=new URL(v);return /^https?:$/.test(u.protocol)?u.href:'';}catch{return '';}};
  let panel,home,report,active=false,scheduled=false,lastHistory,lastSources,lastLength=-1,sortKey='name',direction=1,sortedRows=[],moneySignature='',dialog;
  const moved=[];let monthsByAnalyst={};
  function readMonths(){try{chrome.storage.local.get(['tfAnalystMonths'],d=>{monthsByAnalyst=d?.tfAnalystMonths||{};if(active)render();});}catch{}}
  function monthValue(value){const n=Number(value);return value!==null&&value!==undefined&&String(value).trim()!==''&&Number.isInteger(n)&&n>=0?n:null;}
  const columns=[['severity','Status'],['name','Nama Analis'],['monthsSince','Month Since'],['oldLoss','CL Lama'],['newLoss','CL Baru (4 bln)'],['oldDd','DD Lama'],['newDd','DD Baru'],['avgPnl','AVG. PnL (6 Month)\nTotal Bulan Profit saja'],['latestPnl','PnL Bulan Ini']];
  function dollarFactor(analyst,pair){
    try{
      const dpp=getDollarPerPipForAnalyst(null,pair),sl=getEffectiveSlForAnalyst(analyst,pair,computeSlStatsFromHistory(analyst,pair)).pips;
      const lot=roundLotToTwoDecimals(computeLot(currentBalance,getRiskPercentForAnalyst(analyst,pair),sl,dpp));
      return dpp>0&&sl>0&&Number.isFinite(lot)&&lot>=0?lot*dpp:null;
    }catch{return null;}
  }
  function moneyKey(){return ['balance-input','risk-input'].map(id=>document.getElementById(id)?.value||'').join('|')+'|'+(typeof currentBalance!=='undefined'?currentBalance:'')+'|'+(document.getElementById('pip-table-compact-body-left')?.textContent||'');}
  // Same high-to-low dollar curve and signed trade-PnL-percent accumulation as Equity Curve.
  function drawdownMetrics(source){
    if(!source.length)return {pips:0,usd:0,pct:0};
    let rows;const sizing=new Map();
    try{const base=source.map(row=>{const key=norm(row.analyst)+"|"+row.pair;if(sizing.has(key))return {...row,...sizing.get(key)};const dpp=getDollarPerPipForAnalyst(null,row.pair),risk=getRiskPercentForAnalyst(row.analyst,row.pair),sl=getEffectiveSlForAnalyst(row.analyst,row.pair,computeSlStatsFromHistory(row.analyst,row.pair)).pips;if(!(dpp>0&&sl>0))throw Error('Price/SL unavailable');const values={dollarPerPip:dpp,riskPercent:risk,lotFixed:roundLotToTwoDecimals(computeLot(currentBalance,risk,sl,dpp))};sizing.set(key,values);return {...row,...values};});
      rows=typeof tf_buildCompareRiskRows==='function'?tf_buildCompareRiskRows(base,typeof riskMode!=='undefined'?riskMode:'fixed',typeof compoundMonths!=='undefined'?compoundMonths:1):base.map(row=>({...row,pnlDollar:row.pips*row.lotFixed*row.dollarPerPip,pnlPercent:currentBalance?row.pips*row.lotFixed*row.dollarPerPip/currentBalance*100:0}));
    }catch{return {pips:null,usd:null,pct:null};}
    let equity=Number(currentBalance)||0,peak=equity,peakIndex=-1,maxDd=0,start=-1,end=-1;
    const points=rows.filter(row=>!row.isWithdraw||!row.__tfWithdrawAutoUntick).map(row=>({withdraw:!!row.isWithdraw,pips:Number(row.pips??row.pnlPips)||0,usd:typeof tf_getHistoryNetPnlDollar==='function'?tf_getHistoryNetPnlDollar(row):Number(row.pnlDollar)||0,pct:typeof tf_getHistoryNetPnlPercent==='function'?tf_getHistoryNetPnlPercent(row):Number(row.pnlPercent)||0}));
    for(let i=0;i<points.length;i++){equity+=points[i].usd;if(equity>peak){peak=equity;peakIndex=i;}if(equity-peak<maxDd){maxDd=equity-peak;start=peakIndex;end=i;}}
    let pips=0,usd=0,pct=0;for(let i=start+1;i<=end;i++){usd+=points[i].usd;if(!points[i].withdraw){pips+=points[i].pips;pct+=points[i].pct;}}
    return {pips,usd,pct};
  }
  function data(){
    const state=typeof tf_refreshLatestRiskState==='function'?tf_refreshLatestRiskState(true):{byPair:new Map(),byAnalyst:new Map()};
    const sources=typeof analystSourcesByName==='object'?analystSourcesByName:{};
    const grouped=new Map();
    state.byAnalyst.forEach((s,k)=>grouped.set(k,{name:s.analyst,severity:s.severity||0,reasons:s.reasons||[],pairs:[],oldLoss:null,newLoss:null,oldDd:null,newDd:null,oldUsd:null,newUsd:null}));
    state.byPair.forEach(s=>{
      const k=norm(s.analyst),r=grouped.get(k);if(!r)return;
      r.pairs.push(s.pair);r.oldLoss=Math.max(r.oldLoss||0,s.baselineMaxLossStreak||0);r.newLoss=Math.max(r.newLoss||0,s.recentMaxLossStreak||0);
      r.oldDd=Math.max(r.oldDd||0,s.baselineMaxDrawdownPips||0);r.newDd=Math.max(r.newDd||0,s.recentMaxDrawdownPips||0);
      const factor=dollarFactor(s.analyst,s.pair);if(factor!==null){r.oldUsd=Math.max(r.oldUsd||0,(s.baselineMaxDrawdownPips||0)*factor);r.newUsd=Math.max(r.newUsd||0,(s.recentMaxDrawdownPips||0)*factor);}else r.moneyMissing=true;
    });
    Object.entries(sources).forEach(([name,source])=>{
      const k=norm(name);if(!grouped.has(k))grouped.set(k,{name,severity:null,pairs:[],oldLoss:null,newLoss:null,oldDd:null,newDd:null,oldUsd:null,newUsd:null,reasons:[]});
      grouped.get(k).url=safeUrl(source?.url);grouped.get(k).monthsSince=monthValue(source?.monthsSince);
    });
    // Imported histories may retain URLs even when source metadata is absent.
    const history=typeof historySignals!=='undefined'&&Array.isArray(historySignals)?historySignals:[];
    for(const h of history){const r=grouped.get(norm(h.analyst));if(r&&!r.url)r.url=safeUrl(h.url||h.channelUrl||h.sourceUrl);}
    const histories=new Map();for(const h of history){if(h.isWithdraw)continue;const ts=tf_latestRiskRowTs(h);if(ts==null)continue;const month=tf_latestRiskMonthKey(ts);if(month>state.monthKey)continue;const key=norm(h.analyst);if(!histories.has(key))histories.set(key,[]);histories.get(key).push({...h,sortKey:ts,__reportMonth:month});}
    grouped.forEach(r=>{const pnl=state.byAnalyst.get(norm(r.name))?.monthlyPnl;r.pnl=pnl;r.avgPnl=pnl?.avgPips??null;r.latestPnl=pnl?.latestPips??null;const rows=(histories.get(norm(r.name))||[]).sort((a,b)=>a.sortKey-b.sortKey),old=rows.length?drawdownMetrics(rows.filter(h=>h.__reportMonth<state.windowStartMonth)):{pips:null,usd:null,pct:null},recent=rows.length?drawdownMetrics(rows.filter(h=>h.__reportMonth>=state.windowStartMonth)):{pips:null,usd:null,pct:null};r.oldDdSigned=old.pips;r.newDdSigned=recent.pips;r.oldDd=old.pips==null?null:Math.abs(old.pips);r.oldUsd=old.usd==null?null:Math.abs(old.usd);r.oldDdPct=old.pct;r.newDd=recent.pips==null?null:Math.abs(recent.pips);r.newUsd=recent.usd==null?null:Math.abs(recent.usd);r.newDdPct=recent.pct;});
    return {state,rows:[...grouped.values()]};
  }
  const pairNumber=new Intl.NumberFormat('en-US',{maximumFractionDigits:2});
  function valueLines(pips,usd,negative=false){if(negative){pips=pips==null?null:(pips>0?-pips:0);usd=usd==null?null:(usd>0?-usd:0);}return [pips==null?'—':pairNumber.format(pips)+' pips',usd==null?'—':(usd<0?'-$':'$')+pairNumber.format(Math.abs(usd))];}
  function metricLines(r,key){const prefix=key==='avgPnl'?'avg':'latest';const lines=key.endsWith('Dd')?valueLines(r[key+'Signed']??(r[key]==null?null:-r[key]),r[key==='oldDd'?'oldUsd':'newUsd']==null?null:-r[key==='oldDd'?'oldUsd':'newUsd']):valueLines(r.pnl?.[prefix+'Pips'],r.pnl?.[prefix+'Usd']);if(key.endsWith('Dd')){const pct=r[key+'Pct'];lines.push(pct==null?'—':pairNumber.format(pct)+'%');}else if(key==='avgPnl'){lines.push(r.pnl?.profitMonths==null?'—':'Avg. '+r.pnl.profitMonths+' Bulan');}else if(key==='latestPnl'){const numerator=r.latestPnl,denominator=r.avgPnl;lines.splice(1,0,numerator==null||denominator==null?'—':denominator>0?pairNumber.format(numerator/denominator*100)+'%':numerator===0?'0%':'—');}return lines;}
  function render(){
    if(!panel)return;
    const {state,rows}=data();for(const r of rows){const entry=Object.entries(monthsByAnalyst).find(([name])=>norm(name)===norm(r.name));if(entry)r.monthsSince=monthValue(typeof entry[1]==='object'?entry[1].monthsSince:entry[1]);}moneySignature=moneyKey();
    lastHistory=typeof historySignals!=='undefined'?historySignals:null;lastLength=lastHistory?.length||0;lastSources=typeof analystSourcesByName!=='undefined'?analystSourcesByName:null;
    panel.querySelector('.tf-report-period').textContent=state.monthKey?'Periode baru: '+state.windowStartMonth+' – '+state.monthKey+'. Pembanding lama: history sebelum periode tersebut.':'Belum ada history bertanggal untuk dibandingkan.';
    sortedRows=rows.sort((a,b)=>{const x=a[sortKey],y=b[sortKey];if(x==null||y==null)return x==null&&y==null?a.name.localeCompare(b.name):x==null?1:-1;return (sortKey==='name'?x.localeCompare(y,'id',{sensitivity:'base'}):x-y)*direction||a.name.localeCompare(b.name);});
    panel.querySelectorAll('th[data-sort]').forEach(th=>{th.setAttribute('aria-sort',th.dataset.sort===sortKey?(direction===1?'ascending':'descending'):'none');th.querySelector('.tf-report-arrow').textContent=th.dataset.sort===sortKey?(direction===1?'▲':'▼'):'▼';});
    const body=panel.querySelector('tbody');body.replaceChildren();
    const number=new Intl.NumberFormat('en-US',{maximumFractionDigits:2});
    for(const r of sortedRows){
      const tr=document.createElement('tr'),s=r.oldLoss===null?null:r.severity;
      tr.dataset.severity=s===null?'unknown':String(s);
      const td=document.createElement('td'),icon=document.createElement('span');
      icon.textContent=s===2?'×':s===1?'!':s===0?'✓':'—';icon.className='tf-report-status';
      icon.setAttribute('role','img');icon.setAttribute('aria-label',s===2?'Merah':s===1?'Kuning':s===0?'Hijau':'Data belum tersedia');
      icon.title=r.reasons?.join('; ')||(s===null?'Data history belum tersedia':'Tidak ada kejadian maksimum terbaru');td.append(icon);tr.append(td);
      const name=document.createElement('td'),link=document.createElement(r.url?'a':'span');link.textContent=r.name;
      if(r.url){link.href=r.url;link.target='_blank';link.rel='noopener noreferrer';}else link.title='Link analis belum tersedia pada data import.';
      name.append(link);tr.append(name);const months=document.createElement('td');months.textContent=r.monthsSince==null?'—':number.format(r.monthsSince);months.title='Months (since …) pada halaman channel; bukan jumlah bulan history yang diimpor.';tr.append(months);
      for(const key of ['oldLoss','newLoss']){const cell=document.createElement('td');cell.textContent=r[key]==null?'—':number.format(r[key])+'x';tr.append(cell);}
      for(const key of ['oldDd','newDd','avgPnl','latestPnl']){const cell=document.createElement('td'),grid=document.createElement('span');grid.className='tf-report-pnl-pair';const lines=metricLines(r,key);for(const text of lines){const part=document.createElement('span');part.textContent=text;grid.append(part);}cell.append(grid);cell.title=key.endsWith('Dd')?'PnL % (Akumulasi): jumlah PnL % trade pada rentang High → Low, bukan DD Baru ÷ DD Lama.':'';tr.append(cell);}
      body.append(tr);
    }
    if(!rows.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=columns.length;td.textContent='Belum ada data analis. Import JSON atau jalankan scan terlebih dahulu.';tr.append(td);body.append(tr);}
    requestAnimationFrame(limitRows);
  }
  function limitRows(){
    if(!panel)return;const wrap=panel.querySelector('.tf-report-scroll'),table=wrap.querySelector('table'),rows=[...table.tBodies[0].rows];
    wrap.style.maxHeight=rows.length>15?Math.ceil(table.tHead.getBoundingClientRect().height+rows.slice(0,15).reduce((n,r)=>n+r.getBoundingClientRect().height,0)+Math.max(0,wrap.offsetHeight-wrap.clientHeight))+'px':'none';
  }
  function moveControls(value){
    if(value){for(const [id,target] of [['tf-analyst-risk-adjustment','.tf-report-risk'],['tf-user-adjustment415','.tf-report-adjust'],['tf-balance-cards412','.tf-report-cards']]){
      const node=document.getElementById(id);if(!node||panel.contains(node))continue;
      const marker=document.createComment('Report shared control');node.before(marker);moved.push({node,marker});panel.querySelector(target).append(node);
    }}else{for(const {node,marker} of moved){marker.replaceWith(node);}moved.length=0;}
  }
  let riskTemplate=null;
  function explain(){
    dialog=document.createElement('dialog');dialog.id='tf-report-explainer';dialog.className='tf-report-dialog';
    const card=document.createElement('div');card.className='tf-risk-explainer-card';
    const cfg=typeof tf_analystRiskSettings==='function'?tf_analystRiskSettings():{warning:75,critical:120};
    card.innerHTML='<div class="tf-risk-explainer-eyebrow">// ANALYST RISK</div><h2>Analis Report</h2><div class="tf-risk-explainer-row tf-risk-yellow"><span class="tf-risk-explainer-icon" aria-hidden="true">!</span><div><strong>Kuning · Drawdown / PnL</strong><span></span></div></div><div class="tf-risk-explainer-row tf-risk-red"><span class="tf-risk-explainer-icon" aria-hidden="true">×</span><div><strong>Merah · Drawdown / PnL</strong><span></span></div></div><p class="tf-report-average-example"></p><p class="tf-report-rules"></p><button type="button">Mengerti !</button>';
    card.querySelector('.tf-risk-yellow div>span').textContent='Kerugian PnL pips bersih bulan terbaru melebihi '+cfg.warning+'% dari rata-rata bulan profit dalam 6 bulan sebelumnya (default 75%).';
    card.querySelector('.tf-risk-red div>span').textContent='Kerugian PnL pips bersih bulan terbaru melebihi '+cfg.critical+'% dari rata-rata bulan profit dalam 6 bulan sebelumnya (default 120%). Batas memakai tanda lebih dari (>), bukan sama dengan.';
    card.querySelector('.tf-report-average-example').textContent='Dalam 6 bulan sebelumnya, hanya bulan yang profit yang dijumlahkan. Contoh: ada 4 bulan profit, maka total PnL pips dari 4 bulan itu dibagi 4 = Avg. PnL. Hasil rata-rata tersebut menjadi tolok ukur persentase kerugian bulan terbaru. Bulan rugi dan nol tidak masuk pembagi. Bulan terbaru dihitung terpisah; penilaian risiko hanya memakai pips, bukan dolar.';
    card.querySelector('.tf-report-rules').textContent=document.querySelector('.tf-risk-adjust-help')?.textContent||'Pengaturan risiko diterapkan setelah Confirm. Sesuaikan persentase dan tick di Analyst adjustment risk.';
    const button=card.querySelector('button');dialog.append(card);document.body.append(dialog);button.onclick=()=>dialog.close();dialog.addEventListener('close',()=>{dialog.remove();report.focus();},{once:true});dialog.showModal();
  }
  function download(bytes){const url=URL.createObjectURL(new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));const a=document.createElement('a');a.href=url;a.download='Analis_Report.xlsx';a.click();setTimeout(()=>URL.revokeObjectURL(url),60000);}
  function excel(){
    render();const esc=tf_xlsxXmlEscape;
    const fonts=['111827','16A34A','CA8A04','DC2626'].map(c=>'<font><b/><sz val="11"/><color rgb="FF'+c+'"/><name val="Calibri"/></font>').join('');
    const xfs=[0,1,2,3].map(n=>'<xf numFmtId="0" fontId="'+n+'" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>').join('');
    const styles='<?xml version="1.0"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="4">'+fonts+'</fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="4">'+xfs+'</cellXfs></styleSheet>';
    const cells=[tf_xlsxRowXml(1,columns.map((c,i)=>tf_xlsxCellXml(1,i,c[1],0)),{height:42})];const links=[];
    sortedRows.forEach((r,i)=>{const row=i+2,style=r.oldLoss===null?0:(r.severity||0)+1;cells.push(tf_xlsxRowXml(row,columns.map(([k],j)=>tf_xlsxCellXml(row,j,k==='severity'?(r.oldLoss===null?'—':['✓','!','×'][r.severity]):['avgPnl','latestPnl','oldDd','newDd'].includes(k)?metricLines(r,k).join('\n'):r[k],style)),{height:48}));if(r.url)links.push({row,url:r.url});});
    const sheet='<?xml version="1.0"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="1" width="10" customWidth="1"/><col min="2" max="2" width="25" customWidth="1"/><col min="3" max="9" width="23" customWidth="1"/></cols><sheetData>'+cells.join('')+'</sheetData><autoFilter ref="A1:I'+(sortedRows.length+1)+'"/>'+ (links.length?'<hyperlinks>'+links.map((l,i)=>'<hyperlink ref="B'+l.row+'" r:id="l'+i+'"/>').join('')+'</hyperlinks>':'')+'</worksheet>';
    const entries=[{name:'[Content_Types].xml',data:'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'},
    {name:'_rels/.rels',data:'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="r1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'},
    {name:'xl/workbook.xml',data:'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Analis Report" sheetId="1" r:id="r1"/></sheets></workbook>'},
    {name:'xl/_rels/workbook.xml.rels',data:'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="r1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="r2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'},
    {name:'xl/styles.xml',data:styles},{name:'xl/worksheets/sheet1.xml',data:sheet}];
    if(links.length)entries.push({name:'xl/worksheets/_rels/sheet1.xml.rels',data:'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+links.map((l,i)=>'<Relationship Id="l'+i+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="'+esc(l.url)+'" TargetMode="External"/>').join('')+'</Relationships>'});
    download(tf_xlsxZipStore(entries));
  }
  function pdf(){
    render();const frame=document.createElement('iframe');frame.id='tf-report-print';frame.style.cssText='position:fixed;left:-10000px;width:1100px;height:800px';document.body.append(frame);
    frame.onload=()=>{frame.contentWindow.addEventListener('afterprint',()=>frame.remove(),{once:true});frame.contentWindow.focus();frame.contentWindow.print();};
    const table=panel.querySelector('table').cloneNode(true);table.querySelectorAll('.tf-report-arrow').forEach(n=>n.remove());
    frame.srcdoc='<!doctype html><html><head><title>Analis Report</title><style>@page{size:A4 landscape;margin:12mm}body{font:10px Arial;color:#111827}table{border-collapse:collapse;width:100%}th,td{border:1px solid #cbd5e1;padding:7px;text-align:center}th{background:#e2e8f0}td:nth-child(2){text-align:left}.tf-report-pnl-pair{display:grid;grid-template-columns:minmax(0,1fr);gap:2px;align-items:center;text-align:center;line-height:1.5}.tf-report-pnl-pair>span{min-width:0;overflow-wrap:anywhere}thead{display:table-header-group}tr{break-inside:avoid}a{color:inherit;text-decoration:none}tr[data-severity="0"]{color:#15803d}tr[data-severity="1"]{color:#a16207}tr[data-severity="2"]{color:#b91c1c}td{font-weight:bold}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}</style></head><body><h2>Analis Report</h2><p>'+panel.querySelector('.tf-report-period').textContent+'</p>'+table.outerHTML+'<p>3 bulan sebelumnya + bulan berjalan = 4 bulan. Drawdown $ mengikuti lot tetap, Balance, Risk dan SL pada User Adjustmend.</p></body></html>';
  }
  function show(value,push=true){
    active=value;document.body.classList.toggle('tf-report-view',value);panel.hidden=!value;
    home.closest('li').classList.toggle('active',!value);report.closest('li').classList.toggle('active',value);
    home.setAttribute('aria-current',value?'false':'page');report.setAttribute('aria-current',value?'page':'false');
    moveControls(value);if(value){render();if(!show.explained){show.explained=true;explain();}}else dialog?.close();if(push)history.pushState(null,'',value?hash:location.pathname+location.search);
  }
  window.tfAnalystReportShow=(value)=>show(value,false);
  function init(){
    riskTemplate ||= document.querySelector('#tf-risk-explainer .tf-risk-explainer-card')?.cloneNode(true);
    const nav=document.querySelector('.tf-top-nav > ul');if(!nav||document.getElementById('tf-report-nav'))return;
    home=nav.querySelector('a[data-tf-url="dashboard.html"]');if(!home)return;
    const li=document.createElement('li');report=document.createElement('a');report.id='tf-report-nav';report.className='tf-nav-link';
    report.href=String(document.body.dataset.page||'')==='isignal-users'?'dashboard.html'+hash:hash;
    report.innerHTML='<div class="tf-nav-icon"><span aria-hidden="true">▤</span><span>Analis Report</span></div>';li.append(report);home.closest('li').after(li);
    if(document.body.dataset.page==='isignal-users')return;
    const style=document.createElement('style');style.textContent=`
      .tf-report-view #tf-dashboard-main > section:not(#${id}),.tf-report-view #tf-risk-explainer{display:none!important}
      #${id}[hidden]{display:none!important} #${id}{margin-top:14px}
      #${id} h2{font-size:16.2px} #${id} .tf-report-period,#${id} .tf-report-note{font-size:9.9px;color:#94a3b8;line-height:1.6}
      #${id} .tf-report-scroll{overflow:auto} #${id} table{width:100%;min-width:820px;table-layout:fixed;border-collapse:collapse}
      #${id} th,#${id} td{padding:6.3px 7.2px;border-bottom:1px solid #273449;font-size:9.9px;text-align:right;height:31px}
      #${id} th{white-space:normal;line-height:1.5;color:#b9c9dc;background:#0b1627} #${id} th span{display:block;font-size:10px;color:#94a3b8}
      #${id} th:first-child,#${id} td:first-child{text-align:center;width:42px;min-width:42px;white-space:nowrap} #${id} th:nth-child(2),#${id} td:nth-child(2){text-align:left;min-width:140px}
      #${id} th:nth-child(3),#${id} th:nth-child(4),#${id} td:nth-child(3),#${id} td:nth-child(4){text-align:center;width:90px}
      #${id} thead th{position:sticky;top:0;z-index:1;cursor:pointer}#${id} .tf-report-arrow{display:inline;color:#38bdf8;font-size:9px;margin-left:4px}
      #${id} a{font-weight:700;color:inherit;text-decoration:none} #${id} a:hover{text-decoration:underline}
      #${id} tr[data-severity="0"] td{color:#22c55e!important} #${id} tr[data-severity="1"] td{color:#facc15!important}
      #${id} tr[data-severity="2"] td{color:#ef4444!important} #${id} .tf-report-status{font-weight:900;font-size:15px}
      #${id} [id^="rule"][id$="-withdraw-note"]{display:none!important}#${id} .tf-report-adjust{margin:12px 0}#${id} .tf-report-cards{margin:12px 0}
      #${id} .tf-report-pnl-pair{display:grid;grid-template-columns:minmax(0,1fr);gap:2px;align-items:center;text-align:center;line-height:1.5}#${id} .tf-report-pnl-pair>span{min-width:0;overflow-wrap:anywhere}#${id} .tf-report-risk{margin:10px 0}#${id} .tf-report-exports{display:flex;gap:7px;margin:8px 0 12px}#${id} .tf-report-exports .btn{font-size:9.9px;padding:5px 10px}
      .tf-report-dialog{max-width:360px;border:1px solid #334155;border-radius:12px;background:#0f172a;color:#cbd5e1;padding:18px;font:11px/1.6 Arial}.tf-report-dialog::backdrop{background:#020617b3}.tf-report-dialog h3{font-size:14px}.tf-report-dialog p{margin:8px 0}.tf-report-dialog button{margin-top:10px}
      #tf-report-nav .tf-nav-icon{gap:7px} @media(max-width:640px){#${id} h2{font-size:15px}.tf-top-nav>ul{flex-wrap:wrap}}
      #${id} th{position:relative;text-align:center!important;vertical-align:middle!important;font-size:9px;letter-spacing:.4px;padding:7px 20px 7px 8px;line-height:1.4}
      #${id} td{vertical-align:middle!important}#${id} th:first-child,#${id} td:first-child{width:64px;min-width:64px}
      #${id} .tf-report-header-label{display:block;font-size:inherit;color:inherit}#${id} .tf-report-arrow{position:absolute;right:7px;top:50%;transform:translateY(-50%);margin:0;display:block;font-size:8px}
      #${id} .tf-report-pnl-pair{align-content:center;justify-items:center;min-height:32px}
      #tf-report-explainer{width:calc(100vw - 32px);max-width:650px;padding:0}#tf-report-explainer .tf-risk-explainer-card{width:auto;max-width:none;max-height:80vh;overflow:auto;padding:22px 26px}#tf-report-explainer h2{font-size:24px;margin:8px 0 16px}#tf-report-explainer p{font:11px/1.65 Arial;margin:12px 0}#tf-report-explainer .tf-risk-explainer-row{margin:12px 0}#tf-report-explainer .tf-risk-explainer-row span{font-size:11px;line-height:1.6}#tf-report-explainer button{font-size:12px}
    `;document.head.append(style);
    panel=document.createElement('section');panel.id=id;panel.className='card';panel.hidden=true;
    panel.innerHTML='<h2>Analis Report</h2><div class="tf-report-exports"><button class="btn btn-ghost" id="tf-report-pdf">Export to PDF</button><button class="btn btn-ghost" id="tf-report-excel">Export to Excel</button></div><div class="tf-report-adjust"></div><div class="tf-report-cards"></div><p class="tf-report-period"></p><div class="tf-report-risk"></div><div class="table-wrapper"><div class="tf-report-scroll table-scroll"><table aria-label="Analis Report"><thead><tr>'+columns.map(([key,label])=>'<th data-sort="'+key+'" tabindex="0" role="button"><span class="tf-report-header-label">'+label.replace(' · ','<br>').replace('\n','<br>')+'</span><span class="tf-report-arrow">▼</span></th>').join('')+'</tr></thead><tbody></tbody></table></div></div><p class="tf-report-note">PnL: rata-rata hanya dari bulan profit dalam 6 bulan sebelumnya; bulan rugi dan nol dikeluarkan dari pembagi. Bulan terbaru dibandingkan terpisah (7 bulan). Kolom bulan terbaru menampilkan total PnL bersih, bukan rata-rata per trade. 3 bulan sebelumnya + bulan berjalan = 4 bulan untuk Cons. Loss / Drawdown. Warna mengikuti status dashboard dari ALL history. Drawdown $ memakai lot tetap sesuai Balance, Risk, SL dan $/pip seperti Table 1. DD mengikuti rentang High → Low equity dollar per analis, termasuk semua pair. Persen DD adalah jumlah PnL % trade dalam rentang itu; withdraw tidak dihitung dalam persen. — berarti data atau harga belum tersedia.</p>';
    document.querySelector('#tf-top-nav-wrap').after(panel);
    const sort=th=>{if(!th)return;direction=sortKey===th.dataset.sort?-direction:th.dataset.sort==='name'||th.dataset.sort==='severity'?1:-1;sortKey=th.dataset.sort;render();};
    panel.querySelector('thead').onclick=e=>sort(e.target.closest('th[data-sort]'));
    panel.querySelector('thead').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();sort(e.target.closest('th[data-sort]'));}};
    panel.querySelector('#tf-report-excel').onclick=()=>{try{excel();}catch(e){alert('Export Excel gagal: '+e.message);}};
    panel.querySelector('#tf-report-pdf').onclick=()=>{try{pdf();}catch(e){alert('Export PDF gagal: '+e.message);}};
    addEventListener('tf-analyst-risk-changed',()=>{if(active)render();});
    addEventListener('storage',e=>{if(e.key==='tfAnalystRiskAdjustment'&&active)render();});
    addEventListener('resize',()=>requestAnimationFrame(limitRows));
    panel.addEventListener('click',e=>{if(e.target.closest('.tf-report-adjust'))setTimeout(render,100);});
    panel.addEventListener('change',()=>{if(active)setTimeout(render,100);});
    document.addEventListener('click',e=>{
      if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
      const a=e.target.closest('a');if(a!==home&&a!==report)return;
      e.preventDefault();e.stopImmediatePropagation();show(a===report);
    },true);
    addEventListener('popstate',()=>show(location.hash===hash,false));
    readMonths();if(location.hash===hash)show(true,false);
    if(globalThis.chrome?.storage?.onChanged)chrome.storage.onChanged.addListener((changes,area)=>{
      if(area!=='local')return;if(changes.tfAnalystMonths){monthsByAnalyst=changes.tfAnalystMonths.newValue||{};if(active)render();}if(!active||!['tfHistorySignals','tfAnalystSources'].some(k=>k in changes)||scheduled)return;
      scheduled=true;setTimeout(()=>{scheduled=false;render();},200);
    });
    setInterval(()=>{
      if(!active||document.hidden)return;
      const h=typeof historySignals!=='undefined'?historySignals:null,s=typeof analystSourcesByName!=='undefined'?analystSourcesByName:null;
      if(h!==lastHistory||(h?.length||0)!==lastLength||s!==lastSources||moneyKey()!==moneySignature)render();
    },1500);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  // App scripts are mounted after device activation, including DOMContentLoaded dispatch.
  const observer=new MutationObserver(()=>{if(!document.getElementById('tf-report-nav'))init();});observer.observe(document.body,{childList:true});
})();
