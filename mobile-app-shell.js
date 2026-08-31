(function(){
  'use strict';

  const SCREENS = [
    { key:'table1', target:'section-summary', title:'Table 1', subtitle:'Summary & Money Management', icon:'risk' },
    { key:'calculator', target:'tf-mobile-lot-calculator-screen', title:'Calculator Lot', navLabel:'Calculator', subtitle:'Simulasi Risk & Lot', icon:'calc' },
    { key:'performance', target:'tf-mobile-performance-screen', title:'Performance', subtitle:'Probability Analis', icon:'perf' },
    { key:'table2', target:'section-monthly', title:'Table 2', subtitle:'Statistics', icon:'stats' },
    { key:'equity', target:'equity-curve-section', title:'Equity', subtitle:'Equity Curve', icon:'equity' },
    { key:'table3', target:'section-history', title:'Table 3', subtitle:'History & Result', icon:'history' },
    { key:'table4', target:'tf-score-history-section', title:'Table 4', subtitle:'Score History', icon:'score' }
  ];

  const ICONS = {
    risk:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/><path d="M3 19h18"/></svg>',
    calc:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M8 6h8v3H8zM8 13h2m4 0h2m-8 4h2m4 0h2"/></svg>',
    perf:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 17l5-5 4 3 7-8"/><path d="M16 7h4v4"/></svg>',
    stats:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 16v-4m4 4V8m4 8v-6"/></svg>',
    equity:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 17l5-6 4 3 4-7 5 4"/><path d="M3 20h18"/></svg>',
    history:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>',
    score:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z"/></svg>',
    export:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M5 20h14"/></svg>',
    data:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12"/><path d="M8 11l4 4 4-4"/><path d="M5 20h14"/></svg>',
    logout:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4"/><path d="M9 12h9"/></svg>'
  };

  function safeLocalGet(key){
    try { return window.localStorage ? localStorage.getItem(key) : null; }
    catch(e){ return null; }
  }
  function safeLocalSet(key,value){
    try { if(window.localStorage) localStorage.setItem(key,value); }
    catch(e){}
  }

  // REV322: preserve the current mobile page during short lifecycle changes
  // such as rotation, Fold resize, or temporarily switching to another app.
  // A cold launch after the resume window still starts from Table 1.
  const tfResumeUntilV322 = Number(safeLocalGet('tf_mobile_resume_until_v322') || 0);
  const tfSavedActiveV322 = safeLocalGet('tf_mobile_active_screen');
  const tfSavedActiveValidV322 = SCREENS.some(item=>item.key===tfSavedActiveV322);
  let activeKey = (Date.now() < tfResumeUntilV322 && tfSavedActiveValidV322)
    ? tfSavedActiveV322 : 'table1';
  if('scrollRestoration' in history) history.scrollRestoration = 'manual';
  let observer = null;

  function tfSaveMobileResumeStateV322(ttlMs){
    try{
      safeLocalSet('tf_mobile_active_screen', activeKey || 'table1');
      safeLocalSet('tf_mobile_resume_until_v322', String(Date.now() + Math.max(10000, Number(ttlMs)||0)));
      safeLocalSet('tf_mobile_resume_scroll_v322_' + (activeKey||'table1'), String(Math.max(0, window.scrollY || 0)));
    }catch(_){ }
  }
  function tfRestoreMobileResumeScrollV322(key){
    try{
      const y=Number(safeLocalGet('tf_mobile_resume_scroll_v322_' + key) || 0);
      if(!Number.isFinite(y) || y<1)return;
      requestAnimationFrame(()=>window.scrollTo(0,y));
      setTimeout(()=>window.scrollTo(0,y),90);
      setTimeout(()=>window.scrollTo(0,y),320);
    }catch(_){ }
  }
  // These listeners do not reload the app. They only make any OS/WebView
  // lifecycle recreation resume exactly where the user was.
  window.addEventListener('orientationchange',()=>tfSaveMobileResumeStateV322(120000),{passive:true});
  window.addEventListener('pagehide',()=>tfSaveMobileResumeStateV322(30*60*1000),{passive:true});
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='hidden')tfSaveMobileResumeStateV322(30*60*1000);
  },{passive:true});

  function q(id){ return document.getElementById(id); }

  function createPerformanceScreen(){
    if(q('tf-mobile-performance-screen')) return q('tf-mobile-performance-screen');
    const perf = q('tf-perf-wrap');
    if(!perf) return null;

    const section = document.createElement('section');
    section.id = 'tf-mobile-performance-screen';
    section.className = 'card tf-mobile-screen tf-mobile-performance-screen';

    // Preserve the exact REV224 performance DOM and all bound IDs.
    section.appendChild(perf);

    const host = q('tf-dashboard-main') || document.querySelector('.page') || document.body;
    const table2 = q('section-monthly');
    if(table2 && table2.parentNode) table2.parentNode.insertBefore(section, table2);
    else host.appendChild(section);

    return section;
  }

  function createLotCalculatorScreenV17(){
    if(q('tf-mobile-lot-calculator-screen')) return q('tf-mobile-lot-calculator-screen');

    const section = document.createElement('section');
    section.id = 'tf-mobile-lot-calculator-screen';
    section.className = 'card tf-mobile-screen tf-mobile-lot-calculator-screen';
    section.innerHTML = `
      <div class="tf-lot-calc-head">
        <h2>Calculator Lot & Actual Risk</h2>
        <p>Simulasikan lot berdasarkan Balance, Pair, target Risk, dan jarak Stop Loss.</p>
      </div>
      <div class="tf-lot-calc-form">
        <label class="tf-lot-calc-field">
          <span>Balance (USD)</span>
          <input id="tf-lot-calc-balance" class="form-input" type="number" min="1" step="1" inputmode="decimal" value="5000">
        </label>
        <label class="tf-lot-calc-field">
          <span>Pair</span>
          <select id="tf-lot-calc-pair" class="form-input"></select>
        </label>
        <label class="tf-lot-calc-field">
          <span>Risk Target (%)</span>
          <input id="tf-lot-calc-risk" class="form-input" type="number" min="0.01" step="0.1" inputmode="decimal" value="1">
        </label>
        <label class="tf-lot-calc-field">
          <span>Stop Loss (Pips)</span>
          <input id="tf-lot-calc-sl" class="form-input" type="number" min="0.1" step="0.1" inputmode="decimal" value="200">
        </label>
      </div>
      <div class="tf-lot-calc-results" aria-live="polite">
        <div class="tf-lot-calc-result tf-lot-calc-primary">
          <span>Recommended Lot</span>
          <strong id="tf-lot-calc-lot">0.00</strong>
        </div>
        <div class="tf-lot-calc-result">
          <span>Actual Risk</span>
          <strong id="tf-lot-calc-actual-percent">0.00%</strong>
        </div>
        <div class="tf-lot-calc-result">
          <span>Estimated Risk</span>
          <strong id="tf-lot-calc-risk-dollar">$0.00</strong>
        </div>
        <div class="tf-lot-calc-result">
          <span>$ / Pip (1 Lot)</span>
          <strong id="tf-lot-calc-dollar-per-pip">$0.00</strong>
        </div>
      </div>
      <p id="tf-lot-calc-note" class="tf-lot-calc-note">Lot dibulatkan ke kelipatan 0.01. Actual Risk dihitung ulang dari lot hasil pembulatan.</p>`;

    const host = q('tf-dashboard-main') || document.querySelector('.page') || document.body;
    const performance = q('tf-mobile-performance-screen');
    if(performance && performance.parentNode) performance.parentNode.insertBefore(section, performance);
    else host.appendChild(section);

    const pairSelect = q('tf-lot-calc-pair');
    const balanceInput = q('tf-lot-calc-balance');
    const riskInput = q('tf-lot-calc-risk');
    const slInput = q('tf-lot-calc-sl');
    const pairs = [
      'XAUUSD','EURUSD','GBPUSD','AUDUSD','NZDUSD','USDJPY','EURJPY',
      'GBPJPY','AUDJPY','NZDJPY','CADJPY','CHFJPY','USDCAD','USDCHF'
    ];
    const fallbackDollarPerPip = {
      XAUUSD:10,EURUSD:10,GBPUSD:10,AUDUSD:10,NZDUSD:10,
      USDJPY:6.5,EURJPY:6.5,GBPJPY:6.5,AUDJPY:6.5,NZDJPY:6.5,
      CADJPY:6.5,CHFJPY:6.5,USDCAD:7.2,USDCHF:12.5
    };

    pairs.forEach(pair=>{
      const option = document.createElement('option');
      option.value = pair;
      option.textContent = pair;
      pairSelect.appendChild(option);
    });

    balanceInput.value = safeLocalGet('tf_lot_calc_balance_v17') || q('balance-input')?.value || '5000';
    pairSelect.value = safeLocalGet('tf_lot_calc_pair_v17') || 'XAUUSD';
    riskInput.value = safeLocalGet('tf_lot_calc_risk_v17') || '1';
    slInput.value = safeLocalGet('tf_lot_calc_sl_v17') || '200';

    const calculate = ()=>{
      const balance = Number(balanceInput.value);
      const riskPercent = Number(riskInput.value);
      const slPips = Number(slInput.value);
      const pair = String(pairSelect.value || 'XAUUSD').toUpperCase();
      let dollarPerPip = 0;

      try{
        if(typeof getDollarPerPipForAnalyst === 'function'){
          dollarPerPip = Number(getDollarPerPipForAnalyst(null,pair)) || 0;
        }
      }catch(error){}
      if(!(dollarPerPip > 0)) dollarPerPip = fallbackDollarPerPip[pair] || 0;

      let rawLot = 0;
      if(balance > 0 && riskPercent > 0 && slPips > 0 && dollarPerPip > 0){
        rawLot = (balance * riskPercent / 100) / (slPips * dollarPerPip);
      }

      let roundedLot = 0;
      try{
        roundedLot = typeof roundLotToTwoDecimals === 'function'
          ? roundLotToTwoDecimals(rawLot)
          : Math.floor(rawLot * 100 + .499999) / 100;
      }catch(error){
        roundedLot = Math.floor(rawLot * 100 + .499999) / 100;
      }
      if(!Number.isFinite(roundedLot) || roundedLot < 0) roundedLot = 0;

      const riskDollar = roundedLot * slPips * dollarPerPip;
      const actualRisk = balance > 0 ? riskDollar / balance * 100 : 0;
      q('tf-lot-calc-lot').textContent = roundedLot.toFixed(2);
      q('tf-lot-calc-actual-percent').textContent = Number.isFinite(actualRisk) ? actualRisk.toFixed(2) + '%' : '0.00%';
      q('tf-lot-calc-risk-dollar').textContent = '$' + (Number.isFinite(riskDollar) ? riskDollar.toFixed(2) : '0.00');
      q('tf-lot-calc-dollar-per-pip').textContent = '$' + dollarPerPip.toFixed(2);
      q('tf-lot-calc-note').classList.toggle('invalid', !(balance > 0 && riskPercent > 0 && slPips > 0 && dollarPerPip > 0));

      safeLocalSet('tf_lot_calc_balance_v17',balanceInput.value);
      safeLocalSet('tf_lot_calc_pair_v17',pair);
      safeLocalSet('tf_lot_calc_risk_v17',riskInput.value);
      safeLocalSet('tf_lot_calc_sl_v17',slInput.value);
    };

    [balanceInput,riskInput,slInput].forEach(input=>input.addEventListener('input',calculate));
    pairSelect.addEventListener('change',calculate);
    calculate();
    window.tfMobileRecalculateLotV17 = calculate;
    return section;
  }

  function tfMobileAsciiPdfTextV19(value){
    return String(value == null ? '' : value)
      .normalize ? String(value == null ? '' : value).normalize('NFKD')
        .replace(/[\u0300-\u036f]/g,'')
        .replace(/[\u2012\u2013\u2014\u2212]/g,'-')
        .replace(/[\u2018\u2019]/g,"'")
        .replace(/[\u201c\u201d]/g,'"')
        .replace(/[^\x20-\x7E]/g,'?')
      : String(value == null ? '' : value).replace(/[^\x20-\x7E]/g,'?');
  }

  function tfMobilePdfEscapeV19(value){
    return tfMobileAsciiPdfTextV19(value)
      .replace(/\\/g,'\\\\')
      .replace(/\(/g,'\\(')
      .replace(/\)/g,'\\)');
  }

  function tfMobilePadV19(value,width,right){
    let text=tfMobileAsciiPdfTextV19(value).replace(/\s+/g,' ').trim();
    if(text.length>width){
      text=width>2 ? text.slice(0,width-1)+'~' : text.slice(0,width);
    }
    return right ? text.padStart(width,' ') : text.padEnd(width,' ');
  }

  function tfMobileFormatNumberV19(value,decimals){
    const n=Number(value);
    if(!Number.isFinite(n)) return '-';
    return n.toFixed(decimals);
  }

  function tfMobileExportRowsV19(){
    try{
      if(typeof lastHistoryRowsForExport!=='undefined' && Array.isArray(lastHistoryRowsForExport)){
        return lastHistoryRowsForExport;
      }
    }catch(e){}
    return [];
  }

  function tfMobileVisibleHistoryColumnsV19(){
    try{
      if(typeof tf_getVisibleHistoryColumnKeys==='function'){
        const keys=tf_getVisibleHistoryColumnKeys();
        if(Array.isArray(keys)&&keys.length) return keys;
      }
    }catch(e){}
    return ['created','closed','analyst','balance','pair','lot','pnlPips','pnlDollar','pnlDollarNet','pnlPercent','pnlPercentNet','swapDollar','commDollar','balancePnl'];
  }

  function tfMobileBuildPdfV19(rows){
    const definitions={
      created:{label:'Created At',width:16,get:r=>r?.createdDate||r?.created||''},
      closed:{label:'Closed At',width:16,get:r=>r?.displayDate||r?.closedDate||r?.closed||''},
      analyst:{label:'Analyst',width:18,get:r=>r?.analyst||''},
      balance:{label:'Balance',width:12,right:true,get:r=>tfMobileFormatNumberV19(r?.balanceCompound ?? r?.balance,2)},
      entry:{label:'Entry',width:10,right:true,get:r=>r?.entry ?? r?.price ?? ''},
      takeProfit:{label:'Take Profit',width:10,right:true,get:r=>r?.takeProfit ?? r?.take_profit ?? r?.tp ?? ''},
      stopLoss:{label:'Stop Loss',width:10,right:true,get:r=>r?.stopLoss ?? r?.stop_loss ?? r?.sl ?? ''},
      type:{label:'Type',width:8,get:r=>r?.type ?? r?.side ?? r?.orderType ?? ''},
      pair:{label:'Pair',width:8,get:r=>r?.pair||''},
      lot:{label:'Lot',width:7,right:true,get:r=>tfMobileFormatNumberV19(r?.lot,2)},
      pnlPips:{label:'PnL Pips',width:9,right:true,get:r=>tfMobileFormatNumberV19(r?.pnlPips,1)},
      pnlDollar:{label:'PnL $',width:10,right:true,get:r=>tfMobileFormatNumberV19(r?.pnlDollar,2)},
      pnlDollarNet:{label:'PnL $ Net',width:11,right:true,get:r=>tfMobileFormatNumberV19(r?.pnlDollarNet ?? r?.pnlDollar,2)},
      pnlPercent:{label:'PnL %',width:8,right:true,get:r=>tfMobileFormatNumberV19(r?.pnlPercent,2)},
      pnlPercentNet:{label:'PnL % Net',width:10,right:true,get:r=>tfMobileFormatNumberV19(r?.pnlPercentNet ?? r?.pnlPercent,2)},
      swapDollar:{label:'Swap $',width:9,right:true,get:r=>tfMobileFormatNumberV19(r?.swapDollar,2)},
      commDollar:{label:'Comm $',width:9,right:true,get:r=>tfMobileFormatNumberV19(r?.commDollar,2)},
      balancePnl:{label:'Balance PnL',width:12,right:true,get:r=>tfMobileFormatNumberV19(r?.balancePnl,2)}
    };
    let keys=tfMobileVisibleHistoryColumnsV19().filter(k=>definitions[k]);
    if(!keys.length) keys=['created','closed','analyst','balance','pair','lot','pnlPips','pnlDollar','pnlDollarNet','pnlPercent','pnlPercentNet','swapDollar','commDollar','balancePnl'];

    // Keep a readable landscape table even when every optional column is enabled.
    let total=keys.reduce((n,k)=>n+definitions[k].width,0)+Math.max(0,keys.length-1)*3;
    if(total>176){
      keys=keys.filter(k=>!['entry','takeProfit','stopLoss','type'].includes(k));
      total=keys.reduce((n,k)=>n+definitions[k].width,0)+Math.max(0,keys.length-1)*3;
    }

    const makeLine=(row,isHeader)=>keys.map(k=>{
      const d=definitions[k];
      return tfMobilePadV19(isHeader?d.label:d.get(row),d.width,!!d.right&&!isHeader);
    }).join(' | ');
    const header=makeLine({},true);
    const separator='-'.repeat(Math.min(180,header.length));
    const lines=rows.map(r=>makeLine(r,false));
    const rowsPerPage=47;
    const chunks=[];
    for(let i=0;i<lines.length;i+=rowsPerPage) chunks.push(lines.slice(i,i+rowsPerPage));
    if(!chunks.length) chunks.push([]);

    const now=new Date();
    const stamp=now.toLocaleString('id-ID');
    const pageW=842, pageH=595;
    const objects={};
    const kids=[];
    objects[1]='<< /Type /Catalog /Pages 2 0 R >>';
    objects[3]='<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>';

    chunks.forEach((chunk,pageIndex)=>{
      let content='';
      const text=(x,y,size,value)=>{
        content += 'BT /F1 '+size+' Tf '+x+' '+y+' Td ('+tfMobilePdfEscapeV19(value)+') Tj ET\n';
      };
      text(24,568,11,'TF Multi-Analyst - Table 3 Export');
      text(24,553,7,'Tanggal export: '+stamp+'    Rows: '+rows.length+'    Page: '+(pageIndex+1)+'/'+chunks.length);
      text(24,535,5.1,header);
      text(24,526,5.1,separator);
      let y=516;
      chunk.forEach(line=>{ text(24,y,5.1,line); y-=10; });
      text(24,18,6,'Generated by TF Analyzer Mobile');

      const contentNo=4+pageIndex*2;
      const pageNo=5+pageIndex*2;
      objects[contentNo]='<< /Length '+content.length+' >>\nstream\n'+content+'endstream';
      objects[pageNo]='<< /Type /Page /Parent 2 0 R /MediaBox [0 0 '+pageW+' '+pageH+'] /Resources << /Font << /F1 3 0 R >> >> /Contents '+contentNo+' 0 R >>';
      kids.push(pageNo+' 0 R');
    });
    objects[2]='<< /Type /Pages /Kids ['+kids.join(' ')+'] /Count '+kids.length+' >>';

    const maxObj=Math.max(...Object.keys(objects).map(Number));
    let pdf='%PDF-1.4\n';
    const offsets=new Array(maxObj+1).fill(0);
    for(let i=1;i<=maxObj;i++){
      offsets[i]=pdf.length;
      pdf+=i+' 0 obj\n'+objects[i]+'\nendobj\n';
    }
    const xref=pdf.length;
    pdf+='xref\n0 '+(maxObj+1)+'\n0000000000 65535 f \n';
    for(let i=1;i<=maxObj;i++) pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';
    pdf+='trailer\n<< /Size '+(maxObj+1)+' /Root 1 0 R >>\nstartxref\n'+xref+'\n%%EOF\n';
    return new Blob([pdf],{type:'application/pdf'});
  }

  function tfMobileDownloadBlobV19(blob,filename){
    if(window.AndroidSave && typeof window.AndroidSave.saveBase64==='function'){
      const reader=new FileReader();
      reader.onloadend=function(){
        try{
          const data=String(reader.result||'');
          const b64=data.indexOf(',')>=0?data.slice(data.indexOf(',')+1):data;
          window.AndroidSave.saveBase64(filename,blob.type||'application/octet-stream',b64);
        }catch(e){ alert('Gagal menyiapkan file untuk Android: '+e.message); }
      };
      reader.readAsDataURL(blob);
      return;
    }
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a'); a.href=url; a.download=filename; a.style.display='none';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),60000);
  }

  function tfMobileExportPdfV19(){
    const rows=tfMobileExportRowsV19();
    if(!rows.length){
      alert('Table 3 masih kosong. Silakan Import data dulu.');
      return;
    }
    const btn=q('tf-mobile-export-pdf-btn');
    const old=btn?btn.textContent:'';
    try{
      if(btn){ btn.disabled=true; btn.textContent='Preparing PDF...'; }
      const blob=tfMobileBuildPdfV19(rows);
      const now=new Date();
      const pad=n=>String(n).padStart(2,'0');
      const stamp=now.getFullYear()+'-'+pad(now.getMonth()+1)+'-'+pad(now.getDate())+'_'+pad(now.getHours())+'-'+pad(now.getMinutes());
      tfMobileDownloadBlobV19(blob,'tf_table3_history_'+stamp+'.pdf');
    }catch(error){
      console.error('TF Mobile PDF export gagal',error);
      alert('Gagal membuat PDF: '+(error&&error.message?error.message:String(error)));
    }finally{
      if(btn){ btn.disabled=false; btn.textContent=old||'Export to PDF'; }
    }
  }

  async function tfMobileExportExcelV19(){
    const btn=q('tf-mobile-export-excel-btn');
    const old=btn?btn.textContent:'';
    try{
      if(btn){ btn.disabled=true; btn.textContent='Preparing Excel...'; }
      if(typeof exportHistoryToExcel==='function'){
        await exportHistoryToExcel();
      }else{
        throw new Error('Fungsi Excel export tidak tersedia.');
      }
    }catch(error){
      console.error('TF Mobile Excel export gagal',error);
      alert('Gagal membuat Excel: '+(error&&error.message?error.message:String(error)));
    }finally{
      if(btn){ btn.disabled=false; btn.textContent=old||'Export to Excel'; }
    }
  }

  function createTable3ExportControlsV22(){
    if(q('tf-mobile-table3-export-actions')) return q('tf-mobile-table3-export-actions');
    const section=q('section-history');
    if(!section) return null;

    const row=document.createElement('div');
    row.id='tf-mobile-table3-export-actions';
    row.className='tf-table3-export-actions';
    row.innerHTML=`
      <button type="button" id="tf-mobile-export-pdf-btn" class="tf-table3-export-btn tf-table3-export-pdf">
        <span class="tf-table3-export-icon">PDF</span>
        <span>Export to PDF</span>
      </button>
      <button type="button" id="tf-mobile-export-excel-btn" class="tf-table3-export-btn tf-table3-export-excel">
        <span class="tf-table3-export-icon">XLSX</span>
        <span>Export to Excel</span>
      </button>`;

    const columnRow=section.querySelector('.tf-history-column-filter-row');
    if(columnRow && columnRow.parentNode){
      columnRow.parentNode.insertBefore(row,columnRow);
    }else{
      const firstTable=section.querySelector('.table-wrapper');
      if(firstTable && firstTable.parentNode) firstTable.parentNode.insertBefore(row,firstTable);
      else section.appendChild(row);
    }

    q('tf-mobile-export-pdf-btn')?.addEventListener('click',tfMobileExportPdfV19);
    q('tf-mobile-export-excel-btn')?.addEventListener('click',tfMobileExportExcelV19);
    return row;
  }

  function removeMobilePricePanel(){
    // Desktop REV224 places Investing.com note + price table + Performance
    // inside the same section-note. Performance is moved to its own screen
    // first, then the leftover price panel is removed completely.
    const wait = q('tf-wait-price-note');
    const priceWrap = wait ? wait.closest('.section-note') : null;

    if(priceWrap && priceWrap.closest('#section-summary')){
      priceWrap.remove();
      return;
    }

    const summary = q('section-summary');
    if(!summary) return;

    summary.querySelectorAll(
      '.pip-table-compact-wrap,#tf-wait-price-note,.tfRefreshPriceLink,#tfInvestingProLogoLink'
    ).forEach(el => el.remove());
  }

  function removeExportUi(){
    document.querySelectorAll(
      '#tf-mobile-export-btn,' +
      '#export-history-pdf-btn,' +
      '#export-history-excel-btn'
    ).forEach(el=>{
      const row=
        el.closest('.controls-row');

      el.remove();

      if(
        row &&
        !row.querySelector(
          'button,input,select'
        )
      ){
        row.remove();
      }
    });
  }

  function arrangeMobileControlsV4(){
    // REV306 Table 1 mobile layout:
    // Row 1 = Swap ($/Lot) | toggle | input || Comm ($/Lot) | toggle | input
    // Row 2 = Withdraw ($) | toggle | input | month | Apply Withdraw
    // Row 3 = Rules withdraw (!) | Reset ke Default
    // Keep the original Reset listener; only move it and add a non-destructive
    // show/hide control for the three red Withdraw rule notes.
    const costRow = q('tf-mm-cost-withdraw-row');
    const withdrawRow = q('withdraw-controls-row');
    const resetBtn = q('reset-defaults-btn');

    if(costRow) costRow.classList.add('tf-mobile-mm-cost-grid-v292');
    if(withdrawRow) withdrawRow.classList.add('tf-mobile-mm-withdraw-grid-v292');
    if(costRow) costRow.classList.add('tf-mobile-mm-align-v295','tf-mobile-mm-grid-v297');
    if(withdrawRow) withdrawRow.classList.add('tf-mobile-mm-align-v295','tf-mobile-mm-grid-v297');

    if(costRow && resetBtn){
      let resetRow = q('tf-mobile-mm-reset-row-v292');
      if(!resetRow){
        resetRow = document.createElement('div');
        resetRow.id = 'tf-mobile-mm-reset-row-v292';
        resetRow.className = 'tf-mobile-mm-reset-row-v292';
        costRow.insertAdjacentElement('afterend', resetRow);
      }

      let rulesBtn = q('withdraw-rules-toggle-btn');
      if(!rulesBtn){
        rulesBtn = document.createElement('button');
        rulesBtn.id = 'withdraw-rules-toggle-btn';
        rulesBtn.type = 'button';
        rulesBtn.className = 'btn btn-ghost tf-mm-rule-btn';
        rulesBtn.setAttribute('aria-expanded','false');
        rulesBtn.setAttribute('title','Tampilkan / sembunyikan Rules Withdraw');
        rulesBtn.innerHTML = '<span class="tf-rule-alert-icon" aria-hidden="true">!</span><span>Rules withdraw</span>';
      }

      if(rulesBtn.parentNode !== resetRow) resetRow.insertBefore(rulesBtn, resetRow.firstChild || null);
      if(resetBtn.parentNode !== resetRow) resetRow.appendChild(resetBtn);

      const rulesNotes = [q('rule1-withdraw-note'), q('rule2-withdraw-note'), q('rule3-withdraw-note')].filter(Boolean);
      if(rulesNotes.length && rulesBtn.getAttribute('data-tf-default-hidden') !== '1'){
        rulesNotes.forEach(function(el){ el.style.display = 'none'; });
        rulesBtn.setAttribute('aria-expanded','false');
        rulesBtn.classList.add('tf-rules-hidden');
        rulesBtn.setAttribute('data-tf-default-hidden','1');
      }

      if(rulesBtn.getAttribute('data-tf-bound') !== '1'){
        rulesBtn.setAttribute('data-tf-bound','1');
        rulesBtn.addEventListener('click', function(){
          const notes = [q('rule1-withdraw-note'), q('rule2-withdraw-note'), q('rule3-withdraw-note')].filter(Boolean);
          if(!notes.length) return;
          const currentlyVisible = notes.some(function(el){ return getComputedStyle(el).display !== 'none'; });
          const hide = currentlyVisible;
          notes.forEach(function(el){ el.style.display = hide ? 'none' : ''; });
          rulesBtn.setAttribute('aria-expanded', hide ? 'false' : 'true');
          rulesBtn.classList.toggle('tf-rules-hidden', hide);
        });
      }
    }
  }

  function scrollTable2ToLatest(){
    const table = q('monthly-table');
    if(!table) return;

    const scroller =
      table.closest('.monthly-table-scroll') ||
      table.closest('.table-scroll');

    if(!scroller) return;

    // Table 2 remains chronological (old -> new) internally.
    // On mobile, simply open at the newest columns on the far right.
    scroller.scrollLeft =
      Math.max(
        0,
        scroller.scrollWidth -
        scroller.clientWidth
      );
  }

  function scrollTable3ToLatestOnce(){
    const table = q('history-table');
    if(!table) return;

    const scroller =
      table.closest('.table-scroll');

    if(
      !scroller ||
      scroller.dataset.tfTable3LatestV13 === '1' ||
      !table.querySelector('tbody tr')
    ) return;

    scroller.scrollTop = scroller.scrollHeight;
    scroller.dataset.tfTable3LatestV13 = '1';
  }

  function arrangeHistoryTopControlsV8(){
    const section = q('section-history');
    const riskSelect = q('risk-mode-select-history');
    const withdrawRow = q('withdraw-controls-row-history');

    if(!section || !riskSelect || !withdrawRow) return;

    const riskFilter =
      riskSelect.closest('.equity-filter-row');

    if(!riskFilter) return;

    const oldRiskRow =
      riskFilter.parentElement;

    const oldWithdrawParent =
      withdrawRow.parentElement;

    const compoundRow =
      q('compound-sub-row-history');

    let note = null;

    if(oldRiskRow){
      note =
        Array.from(oldRiskRow.children)
          .find(el =>
            el.classList &&
            el.classList.contains('small-muted')
          ) || null;
    }

    let topRow =
      q('tf-mobile-history-risk-withdraw-row');

    if(topRow) topRow.classList.add('tf-mobile-history-stacked-v295');

    if(!topRow){
      topRow =
        document.createElement('div');

      topRow.id =
        'tf-mobile-history-risk-withdraw-row';

      topRow.className =
        'tf-mobile-history-risk-withdraw-row tf-mobile-history-stacked-v295';

      const anchor =
        oldRiskRow || riskFilter;

      anchor.parentNode.insertBefore(
        topRow,
        anchor
      );
    }

    if(riskFilter.parentNode !== topRow){
      topRow.appendChild(riskFilter);
    }

    if(withdrawRow.parentNode !== topRow){
      topRow.appendChild(withdrawRow);
    }

    if(compoundRow){
      topRow.insertAdjacentElement(
        'afterend',
        compoundRow
      );
    }

    if(note){
      note.classList.add(
        'tf-mobile-history-month-note'
      );

      if(compoundRow){
        compoundRow.insertAdjacentElement(
          'afterend',
          note
        );
      }else{
        topRow.insertAdjacentElement(
          'afterend',
          note
        );
      }
    }

    [oldRiskRow,oldWithdrawParent]
      .filter(Boolean)
      .forEach(row=>{
        if(
          row !== topRow &&
          row.isConnected &&
          !row.querySelector(
            'button,input,select,.small-muted,.equity-filter-row'
          )
        ){
          row.remove();
        }
      });
  }



  function arrangeEquityWithdrawV297(){ return; }

  function arrangeEquityDateGridV9(){
    const start = q('equity-start-date');
    const end = q('equity-end-date');
    const apply = q('equity-apply-filter-btn');
    const reset = q('equity-reset-filter-btn');

    if(!start || !end || !apply || !reset) return;

    const group =
      start.closest('.equity-date-group');

    if(!group) return;

    group.classList.add(
      'tf-mobile-equity-date-grid-v9',
      'tf-mobile-equity-date-grid-v11'
    );

    const separator =
      group.querySelector(
        '.equity-date-separator'
      );

    if(separator){
      separator.style.setProperty(
        'display',
        'none',
        'important'
      );
    }

    // Explicit inline !important values guarantee exact equal widths
    // in browser preview and Android WebView.
    group.style.setProperty(
      'display',
      'grid',
      'important'
    );

    group.style.setProperty(
      'grid-template-columns',
      'repeat(4,minmax(0,1fr))',
      'important'
    );

    group.style.setProperty(
      'gap',
      '5px',
      'important'
    );

    group.style.setProperty(
      'width',
      '100%',
      'important'
    );

    const label = group.querySelector('label');
    if(label){
      label.style.setProperty('grid-column','1 / -1','important');
      label.style.setProperty('grid-row','1','important');
    }

    [
      [start, '1'],
      [end, '2'],
      [apply, '3'],
      [reset, '4']
    ].forEach(([el,column])=>{
      el.style.setProperty('grid-column',column,'important');
      el.style.setProperty('grid-row','2','important');
      el.style.setProperty('justify-self','stretch','important');
      el.style.setProperty('align-self','stretch','important');
    });

    [start,end,apply,reset]
      .forEach(el=>{
        el.style.setProperty(
          'width',
          '100%',
          'important'
        );

        el.style.setProperty(
          'max-width',
          '100%',
          'important'
        );

        el.style.setProperty(
          'min-width',
          '0',
          'important'
        );

        el.style.setProperty(
          'box-sizing',
          'border-box',
          'important'
        );
      });

    [apply,reset].forEach(button=>{
      button.style.setProperty('display','flex','important');
      button.style.setProperty('align-items','center','important');
      button.style.setProperty('justify-content','center','important');
    });
  }

  function enableAdaptiveTableSwipeV16(){
    const selector = [
      '.tf-mobile-screen .table-scroll',
      '.tf-mobile-screen .monthly-table-scroll',
      '.tf-mobile-screen .tf-score-summary-wrap'
    ].join(',');

    document.querySelectorAll(selector).forEach(scroller=>{
      if(scroller.dataset.tfAdaptiveSwipeV16 === '1') return;
      scroller.dataset.tfAdaptiveSwipeV16 = '1';

      let startX=0,startY=0,lastX=0,lastY=0,startScrollLeft=0,startTime=0,lastTime=0;
      let axis='',verticalTarget='',velocity=0,momentumFrame=0,pageOnlyVertical=false,ignoreGesture=false;
      let frame=0,pendingPageY=0,pendingTableY=0,pendingLeft=null;

      const flush=()=>{
        frame=0;
        if(pendingLeft!==null){
          scroller.scrollLeft=pendingLeft;
          pendingLeft=null;
        }
        if(pendingTableY){
          scroller.scrollTop += pendingTableY;
          pendingTableY=0;
        }
        if(pendingPageY){
          const root=document.scrollingElement||document.documentElement||document.body;
          root.scrollTop += pendingPageY;
          pendingPageY=0;
        }
      };
      const schedule=()=>{ if(!frame) frame=requestAnimationFrame(flush); };
      const queueScroll=(target,delta,absolute)=>{
        if(target==='horizontal') pendingLeft = absolute ? delta : ((pendingLeft===null?scroller.scrollLeft:pendingLeft)+delta);
        else if(target==='table') pendingTableY += delta;
        else if(target==='page') pendingPageY += delta;
        schedule();
      };
      const cancelMomentum=()=>{
        if(momentumFrame){ cancelAnimationFrame(momentumFrame); momentumFrame=0; }
      };
      const startMomentum=target=>{
        if(!target || Math.abs(velocity)<.10) return;
        cancelMomentum();
        let speed=Math.max(-2.35,Math.min(2.35,velocity));
        let previous=performance.now();
        const step=now=>{
          const elapsed=Math.min(28,Math.max(1,now-previous)); previous=now;
          queueScroll(target,speed*elapsed,false);
          speed*=Math.pow(.90,elapsed/16.67);
          if(Math.abs(speed)>=.022) momentumFrame=requestAnimationFrame(step); else momentumFrame=0;
        };
        momentumFrame=requestAnimationFrame(step);
      };
      const isNestedIndependentSurface=target=>{
        try{
          if(!target||!target.closest)return false;
          const nested=target.closest('.drawdown-detail-wrap,.tf-score-detail-wrap');
          return !!(nested&&nested!==scroller&&scroller.contains(nested));
        }catch(_){return false;}
      };
      const isPinnedAnalystPageZone=target=>{
        try{
          if(!target||!target.closest)return false;
          return !!target.closest([
            '#section-summary #summary-table th:first-child',
            '#section-summary #summary-table td:first-child',
            '#section-monthly #monthly-table .monthly-sticky-col-2',
            '#section-history #history-table [data-history-col="analyst"]',
            '#section-history #drawdown-table > thead > tr > th:nth-child(2)',
            '#section-history #drawdown-table > tbody > tr:not(.dd-child-row) > td:nth-child(2)',
            '#tf-score-history-section .tf-score-analyst'
          ].join(','));
        }catch(_){return false;}
      };

      scroller.addEventListener('touchstart',event=>{
        if(!event.touches||event.touches.length!==1)return;
        cancelMomentum();
        ignoreGesture=isNestedIndependentSurface(event.target);
        pageOnlyVertical=!ignoreGesture&&isPinnedAnalystPageZone(event.target);
        if(ignoreGesture){ axis='';verticalTarget='';velocity=0;return; }
        const t=event.touches[0];
        startX=lastX=t.clientX; startY=lastY=t.clientY;
        startScrollLeft=scroller.scrollLeft;
        startTime=lastTime=performance.now();
        axis='';verticalTarget='';velocity=0;
      },{passive:true});

      scroller.addEventListener('touchmove',event=>{
        if(ignoreGesture||!event.touches||event.touches.length!==1)return;
        const t=event.touches[0],x=t.clientX,y=t.clientY,now=performance.now();
        const dx=x-startX,dy=y-startY,totalX=Math.abs(dx),totalY=Math.abs(dy);
        const elapsed=Math.max(1,now-lastTime);
        const sampleSpeed=Math.abs(y-lastY)/elapsed;
        const totalSpeed=totalY/Math.max(1,now-startTime);
        if(!axis&&Math.max(totalX,totalY)>=6) axis=totalX>totalY?'horizontal':'vertical';
        if(!axis){lastX=x;lastY=y;lastTime=now;return;}
        if(event.cancelable)event.preventDefault();

        if(axis==='horizontal'){
          queueScroll('horizontal',startScrollLeft+(startX-x),true);
          velocity=(lastX-x)/elapsed;
          lastX=x;lastY=y;lastTime=now;
          return;
        }

        if(!verticalTarget){
          const canScrollInside=scroller.scrollHeight>scroller.clientHeight+3;
          const isFastSwipe=totalSpeed>=.47||(sampleSpeed>=.68&&totalY>=18);
          if(pageOnlyVertical||!canScrollInside||isFastSwipe) verticalTarget='page';
          else if(totalY>=14||now-startTime>=42) verticalTarget='table';
          else {lastX=x;lastY=y;lastTime=now;return;}
        }
        const deltaY=lastY-y;
        queueScroll(verticalTarget,deltaY,false);
        velocity=deltaY/elapsed;
        lastX=x;lastY=y;lastTime=now;
      },{passive:false});

      const finish=()=>{
        if(ignoreGesture){ignoreGesture=false;pageOnlyVertical=false;axis='';verticalTarget='';velocity=0;return;}
        if(frame) flush();
        if(axis==='horizontal')startMomentum('horizontal');
        else if(axis==='vertical')startMomentum(verticalTarget);
        axis='';verticalTarget='';pageOnlyVertical=false;
      };
      scroller.addEventListener('touchend',finish,{passive:true});
      scroller.addEventListener('touchcancel',finish,{passive:true});
    });

    // Expanded detail tables: independent, rAF-batched drag so no parent/table
    // listener competes with them. Vertical gestures move the page smoothly.
    document.querySelectorAll('.tf-mobile-screen .drawdown-detail-wrap, .tf-mobile-screen .tf-score-detail-wrap').forEach(detail=>{
      if(detail.dataset.tfNestedSmoothSwipe==='1')return;
      detail.dataset.tfNestedSmoothSwipe='1';
      // REV321: Drawdown detail and its main-table header are one logical
      // horizontal surface. Drive BOTH scrollLeft values in the same rAF.
      const drawdownOuter=detail.classList.contains('drawdown-detail-wrap')
        ? detail.closest('.table-scroll.drawdown-noscroll') : null;
      let sx=0,sy=0,lx=0,ly=0,sl=0,lt=0,nestedAxis='',nestedVelocity=0,nestedFrame=0,frame=0,pendingLeft=null,pendingPage=0;
      const flush=()=>{
        frame=0;
        if(pendingLeft!==null){
          if(drawdownOuter){
            const maxOuter=Math.max(0,drawdownOuter.scrollWidth-drawdownOuter.clientWidth);
            const maxDetail=Math.max(0,detail.scrollWidth-detail.clientWidth);
            const next=Math.max(0,Math.min(maxOuter,pendingLeft));
            drawdownOuter.scrollLeft=next;
            detail.scrollLeft=Math.max(0,Math.min(maxDetail,next));
          }else detail.scrollLeft=pendingLeft;
          pendingLeft=null;
        }
        if(pendingPage){const root=document.scrollingElement||document.documentElement||document.body;root.scrollTop+=pendingPage;pendingPage=0;}
      };
      const schedule=()=>{if(!frame)frame=requestAnimationFrame(flush);};
      const cancelNested=()=>{if(nestedFrame){cancelAnimationFrame(nestedFrame);nestedFrame=0;}};
      const nestedMomentum=target=>{
        if(Math.abs(nestedVelocity)<.10)return;
        cancelNested();
        let speed=Math.max(-2.35,Math.min(2.35,nestedVelocity)),prev=performance.now();
        const step=now=>{
          const elapsed=Math.min(28,Math.max(1,now-prev));prev=now;
          if(target==='horizontal'){
            const maxLeft=drawdownOuter
              ? Math.max(0,drawdownOuter.scrollWidth-drawdownOuter.clientWidth)
              : Math.max(0,detail.scrollWidth-detail.clientWidth);
            const current=pendingLeft===null
              ? (drawdownOuter?drawdownOuter.scrollLeft:detail.scrollLeft)
              : pendingLeft;
            pendingLeft=Math.max(0,Math.min(maxLeft,current+speed*elapsed));
          }else pendingPage+=speed*elapsed;
          schedule();
          speed*=Math.pow(.90,elapsed/16.67);
          if(Math.abs(speed)>=.022)nestedFrame=requestAnimationFrame(step);else nestedFrame=0;
        };
        nestedFrame=requestAnimationFrame(step);
      };
      detail.addEventListener('touchstart',event=>{
        if(!event.touches||event.touches.length!==1)return;
        cancelNested();
        const t=event.touches[0];sx=lx=t.clientX;sy=ly=t.clientY;sl=drawdownOuter?drawdownOuter.scrollLeft:detail.scrollLeft;lt=performance.now();nestedAxis='';nestedVelocity=0;
      },{passive:true});
      detail.addEventListener('touchmove',event=>{
        if(!event.touches||event.touches.length!==1)return;
        const t=event.touches[0],x=t.clientX,y=t.clientY,now=performance.now(),dx=Math.abs(x-sx),dy=Math.abs(y-sy),elapsed=Math.max(1,now-lt);
        if(!nestedAxis&&Math.max(dx,dy)>=6)nestedAxis=dx>dy?'horizontal':'page';
        if(!nestedAxis){lx=x;ly=y;lt=now;return;}
        if(event.cancelable)event.preventDefault();
        if(nestedAxis==='horizontal'){
          const maxLeft=drawdownOuter
            ? Math.max(0,drawdownOuter.scrollWidth-drawdownOuter.clientWidth)
            : Math.max(0,detail.scrollWidth-detail.clientWidth);
          pendingLeft=Math.max(0,Math.min(maxLeft,sl+(sx-x)));
          nestedVelocity=(lx-x)/elapsed;
        }
        else{const d=ly-y;pendingPage+=d;nestedVelocity=d/elapsed;}
        schedule();lx=x;ly=y;lt=now;
      },{passive:false});
      const finish=()=>{if(frame)flush();if(nestedAxis==='horizontal')nestedMomentum('horizontal');else if(nestedAxis==='page')nestedMomentum('page');nestedAxis='';};
      detail.addEventListener('touchend',finish,{passive:true});
      detail.addEventListener('touchcancel',finish,{passive:true});
    });

    if(!window.__tfAdaptiveSwipeDynamicObserverV17){
      window.__tfAdaptiveSwipeDynamicObserverV17=new MutationObserver(mutations=>{
        let needsBind=false;
        for(const mutation of mutations){
          if(!mutation.addedNodes||!mutation.addedNodes.length)continue;
          for(const node of mutation.addedNodes){
            if(!node||node.nodeType!==1)continue;
            if((node.matches&&node.matches('.drawdown-detail-wrap,.tf-score-detail-wrap'))||(node.querySelector&&node.querySelector('.drawdown-detail-wrap,.tf-score-detail-wrap'))){needsBind=true;break;}
          }
          if(needsBind)break;
        }
        if(needsBind)requestAnimationFrame(()=>enableAdaptiveTableSwipeV16());
      });
      window.__tfAdaptiveSwipeDynamicObserverV17.observe(document.documentElement,{childList:true,subtree:true});
    }
  }

  function bindPairSelectorsV15(){
    document.querySelectorAll('.analyst-filter-item').forEach(item=>{
      const label = Array.from(item.children).find(element=>
        element.tagName === 'LABEL'
      );
      if(!label) return;

      const arrow = label.querySelector('.analyst-filter-arrow');
      if(!arrow) return;

      arrow.setAttribute('aria-hidden','false');

      const trigger = Array.from(label.children).find(element=>
        element.tagName === 'SPAN' &&
        !element.classList.contains('analyst-filter-arrow')
      );

      if(!trigger || trigger.dataset.tfPairTriggerV15 === '1') return;
      trigger.dataset.tfPairTriggerV15 = '1';
      trigger.classList.add('analyst-pair-selector-trigger');
      trigger.setAttribute('role','button');
      trigger.setAttribute('tabindex','0');

      const openPairSelector = event=>{
        event.preventDefault();
        event.stopPropagation();
        arrow.click();
      };

      trigger.addEventListener('click', openPairSelector);
      trigger.addEventListener('keydown', event=>{
        if(event.key === 'Enter' || event.key === ' ') openPairSelector(event);
      });
    });

    if(!window.__tfPairSelectorObserverV15){
      let scheduled = false;
      window.__tfPairSelectorObserverV15 = new MutationObserver(mutations=>{
        if(!mutations.some(mutation=>mutation.addedNodes && mutation.addedNodes.length)) return;
        if(scheduled) return;
        scheduled = true;
        requestAnimationFrame(()=>{
          scheduled = false;
          bindPairSelectorsV15();
        });
      });
      window.__tfPairSelectorObserverV15.observe(
        document.documentElement,
        {childList:true,subtree:true}
      );
    }
  }

  function ensurePageScrollbarV15(){
    let rail = q('tf-mobile-page-scrollbar');

    if(!rail){
      rail = document.createElement('div');
      rail.id = 'tf-mobile-page-scrollbar';
      rail.className = 'tf-mobile-page-scrollbar';
      rail.setAttribute('role','scrollbar');
      rail.setAttribute('aria-label','Scroll halaman');
      rail.setAttribute('aria-orientation','vertical');
      rail.innerHTML = '<div class="tf-mobile-page-scrollbar-thumb"></div>';
      document.body.appendChild(rail);
    }

    const thumb = rail.querySelector('.tf-mobile-page-scrollbar-thumb');
    if(!thumb || rail.dataset.tfPageScrollbarV15 === '1') return rail;
    rail.dataset.tfPageScrollbarV15 = '1';

    const metrics = ()=>{
      const root = document.scrollingElement || document.documentElement;
      const railHeight = Math.max(0, rail.clientHeight);
      const viewportHeight = Math.max(1, root.clientHeight || window.innerHeight || 1);
      const scrollHeight = Math.max(viewportHeight, root.scrollHeight || 0);
      const maxScroll = Math.max(0, scrollHeight - viewportHeight);
      const thumbHeight = Math.min(
        railHeight,
        Math.max(52, railHeight * viewportHeight / scrollHeight)
      );
      const travel = Math.max(0, railHeight - thumbHeight);
      return {root,railHeight,maxScroll,thumbHeight,travel};
    };

    let updateFrame = 0;
    const update = ()=>{
      updateFrame = 0;
      const value = metrics();
      const visible = value.maxScroll > 8 && value.railHeight > 0;
      rail.classList.toggle('visible', visible);
      if(!visible) return;

      const top = value.travel > 0
        ? Math.min(value.travel, Math.max(0, value.root.scrollTop / value.maxScroll * value.travel))
        : 0;
      thumb.style.height = value.thumbHeight + 'px';
      thumb.style.transform = 'translate3d(0,' + top + 'px,0)';
      rail.setAttribute('aria-valuemin','0');
      rail.setAttribute('aria-valuemax',String(Math.round(value.maxScroll)));
      rail.setAttribute('aria-valuenow',String(Math.round(value.root.scrollTop)));
    };

    const scheduleUpdate = ()=>{
      if(updateFrame) return;
      updateFrame = requestAnimationFrame(update);
    };

    let dragging = false;
    let pointerId = null;
    let dragStartY = 0;
    let dragStartTop = 0;

    const scrollFromThumbTop = top=>{
      const value = metrics();
      if(value.maxScroll <= 0 || value.travel <= 0) return;
      const clampedTop = Math.min(value.travel, Math.max(0, top));
      window.scrollTo(0, clampedTop / value.travel * value.maxScroll);
      scheduleUpdate();
    };

    rail.addEventListener('pointerdown', event=>{
      if(event.button !== undefined && event.button !== 0) return;
      const value = metrics();
      if(value.maxScroll <= 0 || value.travel <= 0) return;

      event.preventDefault();
      event.stopPropagation();
      dragging = true;
      pointerId = event.pointerId;
      rail.classList.add('dragging');
      if(rail.setPointerCapture) rail.setPointerCapture(pointerId);

      const rect = rail.getBoundingClientRect();
      const currentTop = value.root.scrollTop / value.maxScroll * value.travel;
      dragStartY = event.clientY;

      if(event.target === thumb){
        dragStartTop = currentTop;
      }else{
        dragStartTop = Math.min(
          value.travel,
          Math.max(0, event.clientY - rect.top - value.thumbHeight / 2)
        );
        scrollFromThumbTop(dragStartTop);
      }
    });

    rail.addEventListener('pointermove', event=>{
      if(!dragging || event.pointerId !== pointerId) return;
      event.preventDefault();
      scrollFromThumbTop(dragStartTop + event.clientY - dragStartY);
    });

    const finishDrag = event=>{
      if(!dragging || (event.pointerId !== undefined && event.pointerId !== pointerId)) return;
      dragging = false;
      rail.classList.remove('dragging');
      if(rail.releasePointerCapture && pointerId !== null){
        try{ rail.releasePointerCapture(pointerId); }catch(error){}
      }
      pointerId = null;
      scheduleUpdate();
    };

    rail.addEventListener('pointerup', finishDrag);
    rail.addEventListener('pointercancel', finishDrag);
    rail.addEventListener('lostpointercapture', finishDrag);
    window.addEventListener('scroll', scheduleUpdate, {passive:true});
    window.addEventListener('resize', scheduleUpdate, {passive:true});
    window.addEventListener('orientationchange', ()=>{
      setTimeout(scheduleUpdate, 80);
      setTimeout(scheduleUpdate, 360);
    }, {passive:true});

    const contentObserver = new MutationObserver(scheduleUpdate);
    contentObserver.observe(q('tf-dashboard-main') || document.body, {childList:true,subtree:true});
    window.tfMobileUpdatePageScrollbarV15 = scheduleUpdate;
    scheduleUpdate();
    return rail;
  }

  let tfPerformanceLayoutFrameV17 = 0;
  function refreshPerformanceLayoutV17(){
    if(tfPerformanceLayoutFrameV17) cancelAnimationFrame(tfPerformanceLayoutFrameV17);
    tfPerformanceLayoutFrameV17 = requestAnimationFrame(()=>{
      tfPerformanceLayoutFrameV17 = 0;
      const screen = q('tf-mobile-performance-screen');
      if(!screen) return;

      screen.querySelectorAll('.tf-perf-card').forEach(card=>{
        card.scrollLeft = 0;
      });
      screen.classList.remove('tf-perf-layout-ready-v17');
      void screen.offsetWidth;
      screen.classList.add('tf-perf-layout-ready-v17');
    });
  }

  function installPerformanceResizeV17(){
    if(window.__tfPerformanceResizeV17) return;
    window.__tfPerformanceResizeV17 = true;
    const refreshSoon = ()=>{
      refreshPerformanceLayoutV17();
      setTimeout(refreshPerformanceLayoutV17,80);
      setTimeout(refreshPerformanceLayoutV17,320);
    };
    window.addEventListener('resize',refreshSoon,{passive:true});
    window.addEventListener('orientationchange',refreshSoon,{passive:true});
  }

  function tagScreens(){
    createPerformanceScreen();
    createLotCalculatorScreenV17();
    createTable3ExportControlsV22();
    removeMobilePricePanel();
    removeExportUi();
    arrangeMobileControlsV4();
    arrangeHistoryTopControlsV8();
    arrangeEquityWithdrawV297();
    arrangeEquityDateGridV9();
    SCREENS.forEach(item => {
      const el = q(item.target);
      if(!el) return;
      el.classList.add('tf-mobile-screen');
      el.dataset.mobileScreen = item.key;
    });
    enableAdaptiveTableSwipeV16();
    // REV242 dynamic Table 4 detail rows are observed and auto-bound.
    bindPairSelectorsV15();
    installPerformanceResizeV17();
  }

  function createHeader(){
    if(q('tf-mobile-appbar')) return;
    const bar = document.createElement('header');
    bar.id = 'tf-mobile-appbar';
    bar.className = 'tf-mobile-appbar';
    bar.innerHTML = `
      <div class="tf-mobile-brandmark"><img src="icon32.png" alt="TF"></div>
      <div class="tf-mobile-appbar-copy">
        <div id="tf-mobile-appbar-title" class="tf-mobile-appbar-title">Table 1</div>
        <div id="tf-mobile-appbar-subtitle" class="tf-mobile-appbar-subtitle">Money Management</div>
      </div>
      <button type="button" id="tf-mobile-logout-open" class="tf-mobile-appbar-action tf-mobile-logout-action" aria-label="Log out">
        ${ICONS.logout}<span>Log out</span>
      </button>
      <button type="button" id="tf-mobile-data-open" class="tf-mobile-appbar-action" aria-label="Import data">
        ${ICONS.data}<span>Data</span>
      </button>`;
    document.body.prepend(bar);
    q('tf-mobile-logout-open')?.addEventListener('click',()=>{try{if(typeof window.tfMobileLogout==='function')void window.tfMobileLogout();}catch(_){}});
  }

  function createNav(){
    if(q('tf-mobile-bottom-nav')) return;
    const nav = document.createElement('nav');
    nav.id = 'tf-mobile-bottom-nav';
    nav.className = 'tf-mobile-bottom-nav';
    nav.setAttribute('aria-label','Navigasi TF Multi-Analyst Mobile');
    nav.innerHTML = `<div class="tf-mobile-nav-scroller">
      <div class="tf-mobile-landscape-only tf-mobile-nav-brand-v323" aria-label="TF Analyzer">
        <img src="icon32.png" alt="TF">
      </div>
      <button type="button" class="tf-mobile-nav-item tf-mobile-landscape-only tf-mobile-nav-special-v323" data-mobile-special="remote" aria-label="Remote">
        <span class="tf-mobile-nav-icon">${ICONS.remote || '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="11" rx="2"/><path d="M8 20h8M12 15v5"/></svg>'}</span>
        <span class="tf-mobile-nav-label">Remote</span>
      </button>
      <button type="button" class="tf-mobile-nav-item tf-mobile-landscape-only tf-mobile-nav-special-v323" data-mobile-special="data" aria-label="Data">
        <span class="tf-mobile-nav-icon">${ICONS.data}</span>
        <span class="tf-mobile-nav-label">Data</span>
      </button>
      ${SCREENS.map(item => `
      <button type="button" class="tf-mobile-nav-item" data-mobile-nav="${item.key}" aria-label="${item.title} ${item.subtitle}">
        <span class="tf-mobile-nav-icon">${ICONS[item.icon]}</span>
        <span class="tf-mobile-nav-label">${item.navLabel || item.title}</span>
      </button>`).join('')}
      <button type="button" class="tf-mobile-nav-item tf-mobile-landscape-only tf-mobile-nav-special-v323 tf-mobile-nav-logout-v330" data-mobile-special="logout" aria-label="Log out">
        <span class="tf-mobile-nav-icon">${ICONS.logout}</span>
        <span class="tf-mobile-nav-label">Log out</span>
      </button></div>`;
    document.body.appendChild(nav);
    nav.addEventListener('click', e => {
      const special = e.target.closest('[data-mobile-special]');
      if(special){
        if(special.dataset.mobileSpecial === 'data'){
          openDataSheet();
          return;
        }
        if(special.dataset.mobileSpecial === 'remote'){
          const remoteBtn=q('tf-mobile-remote-open');
          if(remoteBtn){ remoteBtn.click(); return; }
          // Remote script may finish bootstrapping a fraction later.
          setTimeout(()=>q('tf-mobile-remote-open')?.click(),80);
          return;
        }
        if(special.dataset.mobileSpecial === 'logout'){
          try{if(typeof window.tfMobileLogout==='function')void window.tfMobileLogout();}catch(_){}
          return;
        }
      }
      const btn = e.target.closest('[data-mobile-nav]');
      if(!btn) return;
      activate(btn.dataset.mobileNav, true);
    });
  }

  function ensureDataSheet(){
    const sheet = q('tf-mobile-data-controls');
    if(!sheet) return false;
    sheet.classList.add('tf-mobile-data-sheet');

    if(!sheet.querySelector('.tf-mobile-sheet-handle')){
      const handle = document.createElement('div');
      handle.className = 'tf-mobile-sheet-handle';
      handle.innerHTML = '<span></span>';
      sheet.prepend(handle);
    }

    if(!q('tf-mobile-data-close')){
      const close = document.createElement('button');
      close.id = 'tf-mobile-data-close';
      close.type = 'button';
      close.className = 'tf-mobile-sheet-close';
      close.setAttribute('aria-label','Tutup');
      close.textContent = '×';
      const header = sheet.querySelector('.card-header');
      if(header) header.appendChild(close); else sheet.prepend(close);
      close.addEventListener('click', closeDataSheet);
    }

    if(!q('tf-mobile-sheet-backdrop')){
      const backdrop = document.createElement('div');
      backdrop.id = 'tf-mobile-sheet-backdrop';
      backdrop.className = 'tf-mobile-sheet-backdrop';
      document.body.appendChild(backdrop);
      backdrop.addEventListener('click', closeDataSheet);
    }
    return true;
  }

  function openDataSheet(){
    if(!ensureDataSheet()) return;
    document.documentElement.classList.add('tf-mobile-sheet-open');
    q('tf-mobile-data-controls')?.classList.add('open');
    q('tf-mobile-sheet-backdrop')?.classList.add('open');
  }

  function closeDataSheet(){
    document.documentElement.classList.remove('tf-mobile-sheet-open');
    q('tf-mobile-data-controls')?.classList.remove('open');
    q('tf-mobile-sheet-backdrop')?.classList.remove('open');
  }

  function screenFor(key){
    const def = SCREENS.find(x => x.key === key) || SCREENS[0];
    return { def, el:q(def.target) };
  }

  // REV326: keep the active menu button visible after portrait <-> landscape
  // rotation. Landscape uses a vertically scrollable left rail, so centering
  // the active button directly via scrollTop avoids scrolling the page itself.
  function tfEnsureActiveNavVisibleV326(behavior){
    try{
      const landscape=(window.innerWidth||0)>(window.innerHeight||0) && (window.innerWidth||0)>=640;
      if(!landscape) return;
      const scroller=document.querySelector('#tf-mobile-bottom-nav .tf-mobile-nav-scroller');
      const active=scroller && scroller.querySelector('[data-mobile-nav].active');
      if(!scroller || !active) return;
      const top=Math.max(0, active.offsetTop - Math.max(0,(scroller.clientHeight-active.offsetHeight)/2));
      if(typeof scroller.scrollTo==='function') scroller.scrollTo({top,behavior:behavior||'auto'});
      else scroller.scrollTop=top;
    }catch(_){ }
  }

  if(!window.__tfNavRotateV326){
    window.__tfNavRotateV326=true;
    const syncActiveNavV326=()=>{
      setTimeout(()=>tfEnsureActiveNavVisibleV326('auto'),70);
      setTimeout(()=>tfEnsureActiveNavVisibleV326('auto'),240);
      setTimeout(()=>tfEnsureActiveNavVisibleV326('auto'),520);
    };
    window.addEventListener('orientationchange',syncActiveNavV326,{passive:true});
    window.addEventListener('resize',syncActiveNavV326,{passive:true});
  }

  function activate(key, userAction){
    tagScreens();
    let {def,el} = screenFor(key);
    if(!el){
      def = SCREENS[0];
      el = q(def.target);
      key = def.key;
    }
    if(!el) return;

    document.querySelectorAll('.tf-mobile-screen').forEach(node => {
      node.classList.toggle('tf-mobile-screen-active', node === el);
      node.setAttribute('aria-hidden', node === el ? 'false' : 'true');
    });

    document.querySelectorAll('[data-mobile-nav]').forEach(btn => {
      const on = btn.dataset.mobileNav === key;
      btn.classList.toggle('active', on);
      btn.setAttribute('aria-current', on ? 'page' : 'false');
      if(on && userAction) btn.scrollIntoView({behavior:'smooth',inline:'center',block:'nearest'});
    });
    // In landscape make the active rail item visible even when activation was
    // restored automatically (not only when the user tapped it).
    setTimeout(()=>tfEnsureActiveNavVisibleV326(userAction?'smooth':'auto'),20);

    q('tf-mobile-appbar-title').textContent = def.title;
    q('tf-mobile-appbar-subtitle').textContent = def.subtitle;
    activeKey = key;
    safeLocalSet('tf_mobile_active_screen', key);

    window.scrollTo({top:0, behavior:userAction?'smooth':'auto'});

    if(key === 'table2'){
      setTimeout(scrollTable2ToLatest, 0);
      setTimeout(scrollTable2ToLatest, 90);
      setTimeout(scrollTable2ToLatest, 320);
    }

    if(key === 'table3'){
      setTimeout(scrollTable3ToLatestOnce, 0);
      setTimeout(scrollTable3ToLatestOnce, 90);
      setTimeout(scrollTable3ToLatestOnce, 320);
    }

    if(key === 'performance'){
      setTimeout(refreshPerformanceLayoutV17,0);
      setTimeout(refreshPerformanceLayoutV17,100);
      setTimeout(refreshPerformanceLayoutV17,360);
    }

    if(key === 'calculator' && typeof window.tfMobileRecalculateLotV17 === 'function'){
      window.tfMobileRecalculateLotV17();
    }

    setTimeout(() => window.dispatchEvent(new Event('resize')), 40);
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }

  function cleanDesktopText(){
    const replacements = [
      [/hasil scan extension Chrome/gi,'hasil data TF Multi-Analyst Desktop'],
      [/lakukan Scan dari extension/gi,'Import data dari desktop'],
      [/lakukan Scan terlebih dahulu/gi,'Import data terlebih dahulu'],
      [/Jalankan batch scan\.?/gi,'Import data dari desktop.'],
      [/Tambahkan baris di Table 3 atau lakukan Scan dari extension\.?/gi,'Import data dari desktop untuk menampilkan history.']
    ];
    document.querySelectorAll('.section-note,.small-muted,#equity-empty-note,#equity-drawdown-detail,.tf-score-empty').forEach(el => {
      if(el.children.length) return;
      const before = el.textContent || '';
      let after = before;
      replacements.forEach(([a,b]) => after = after.replace(a,b));
      if(after !== before) el.textContent = after;
    });
  }

  function removeDesktopChrome(){
    q('tf-dashboard-scan-overlay')?.remove();
    q('tf-top-nav-wrap')?.remove();
    document.querySelector('.dashboard-header')?.remove();
    document.querySelector('#tf-dashboard-main > footer')?.remove();
    document.body.classList.add('tf-mobile-app');
  }

  function bindHeader(){
    q('tf-mobile-data-open')?.addEventListener('click', openDataSheet);
  }

  // REV247: Remote's “Buka Dashboard” returns to the Mobile app home (Table 1)
  // without sending any command to the PC sidebar.
  window.tfMobileGoHome = function(){
    try{ activate('table1', true); }catch(_){
      try{ const b=document.querySelector('[data-mobile-nav=\"table1\"]'); if(b)b.click(); }catch(__){}
    }
  };


  // REV316: Table 2 mobile uses only the visible columns when calculating width.
  // ACTION + PAIR are hidden on mobile, so the analyst column must never inherit
  // their colspan and the rightmost month/year column should finish exactly at
  // the table viewport (or continue naturally when horizontal scrolling is needed).
  function tfFixMonthlyLayoutV316(){
    try{
      const mt=document.getElementById('monthly-table');
      if(!mt)return;
      const scroller=mt.closest('.monthly-table-scroll')||mt.closest('.table-scroll');
      const total=mt.querySelector('tbody tr.monthly-total-row');
      if(total){
        const spacer=total.querySelector('.monthly-total-action-spacer');
        const label=total.querySelector('.monthly-total-label');
        if(spacer){spacer.style.setProperty('display','none','important');spacer.setAttribute('aria-hidden','true');}
        if(label){
          label.colSpan=1;
          label.style.setProperty('width','124px','important');
          label.style.setProperty('min-width','124px','important');
          label.style.setProperty('max-width','124px','important');
        }
      }
      const head=mt.querySelector('thead tr');
      const monthHeaders=head?Array.from(head.querySelectorAll('th[data-month-key]')):[];
      const count=monthHeaders.length;
      if(!count)return;
      const analystW=124;
      const minMonthW=120;
      const viewport=Math.max(0,Math.floor((scroller&&scroller.clientWidth)||0));
      const natural=analystW+(minMonthW*count);
      const tableW=viewport>0?Math.max(viewport,natural):natural;
      const monthW=Math.max(minMonthW,(tableW-analystW)/count);
      mt.style.setProperty('table-layout','fixed','important');
      mt.style.setProperty('width',tableW+'px','important');
      mt.style.setProperty('min-width',tableW+'px','important');
      mt.style.setProperty('max-width',tableW+'px','important');
      mt.style.setProperty('--tf-v316-month-w',monthW+'px');
      monthHeaders.forEach(th=>{
        th.style.setProperty('width',monthW+'px','important');
        th.style.setProperty('min-width',monthW+'px','important');
        th.style.setProperty('max-width',monthW+'px','important');
      });
      mt.querySelectorAll('tbody td[data-month-key]').forEach(td=>{
        td.style.setProperty('width',monthW+'px','important');
        td.style.setProperty('min-width',monthW+'px','important');
        td.style.setProperty('max-width',monthW+'px','important');
      });
      if(total){
        Array.from(total.children).filter(td=>!td.classList.contains('monthly-total-action-spacer')&&!td.classList.contains('monthly-total-label')).forEach(td=>{
          td.style.setProperty('width',monthW+'px','important');
          td.style.setProperty('min-width',monthW+'px','important');
          td.style.setProperty('max-width',monthW+'px','important');
        });
      }
    }catch(_){ }
  }

  // REV312: mobile-only table structure adaptations.
  function tfApplyRev312TableLayouts(){
    try{
      // Table 2: merge Pair into Nama Analis -> "Nama Analis (PAIR)" and hide
      // the separate Pair column. Refresh/action remains desktop-only hidden.
      const mt=document.getElementById('monthly-table');
      if(mt){
        const head=mt.querySelector('thead tr');
        if(head){
          const nameTh=head.querySelector('.monthly-sticky-col-2');
          const pairTh=head.querySelector('.monthly-sticky-col-3');
          if(nameTh&&nameTh.textContent!=='Nama Analis (Pair)')nameTh.textContent='Nama Analis (Pair)';
          if(pairTh)pairTh.classList.add('tf-mobile-pair-merged-v312');
        }
        mt.querySelectorAll('tbody tr').forEach(row=>{
          const name=row.querySelector('.monthly-sticky-col-2');
          const pair=row.querySelector('.monthly-sticky-col-3');
          if(!name||!pair)return;
          pair.classList.add('tf-mobile-pair-merged-v312');
          const base=(name.getAttribute('data-tf-v312-name')||name.title||name.textContent||'').trim();
          if(!name.getAttribute('data-tf-v312-name'))name.setAttribute('data-tf-v312-name',base);
          const p=(pair.textContent||'').trim();
          const desired=p&&p!=='-'?base+' ('+p+')':base;
          if((name.textContent||'')!==desired)name.textContent=desired;
          if(name.title!==desired)name.title=desired;
        });
        // REV315: desktop width calculation still counts ACTION + PAIR even
        // though both are hidden/merged on mobile. Remove that stale inline
        // minimum so the final visible month column ends exactly at its data.
        mt.style.setProperty('min-width','0px','important');
        mt.style.setProperty('width','max-content','important');
        mt.style.setProperty('max-width','none','important');
        tfFixMonthlyLayoutV316();
      }

      // REV315 Table 3 mobile order: selection/ticker stays column 1 and
      // Nama Analis is column 2. Both are frozen while Created/Closed/etc.
      // continue to scroll horizontally.
      const ht=document.getElementById('history-table');
      if(ht){
        const hr=ht.querySelector('thead tr');
        if(hr){
          const tick=hr.querySelector('.tf-history-cb-head');
          const analyst=hr.querySelector('[data-history-col="analyst"]');
          if(tick&&hr.firstElementChild!==tick)hr.insertBefore(tick,hr.firstElementChild);
          if(analyst&&tick&&tick.nextElementSibling!==analyst)hr.insertBefore(analyst,tick.nextElementSibling);
        }
        ht.querySelectorAll('tbody tr').forEach(row=>{
          // The synthetic Start Balance row has one colspan cell and should
          // not be reordered.
          if(row.classList.contains('tf-start-balance-row'))return;
          const tick=row.querySelector('.tf-history-cb-cell');
          const analyst=row.querySelector('[data-history-col="analyst"]');
          if(tick&&row.firstElementChild!==tick)row.insertBefore(tick,row.firstElementChild);
          if(analyst&&tick&&tick.nextElementSibling!==analyst)row.insertBefore(analyst,tick.nextElementSibling);
        });
      }
    }catch(_){ }
  }

  function installRev312LayoutObserver(){
    tfApplyRev312TableLayouts();
    if(window.__tfRev312TableObserver)return;
    let queued=false;
    window.__tfRev312TableObserver=new MutationObserver(mutations=>{
      let relevant=false;
      for(const m of mutations){
        const t=m.target&&m.target.nodeType===1?m.target:null;
        if(t&&(t.closest&&t.closest('#monthly-table,#history-table'))){relevant=true;break;}
        for(const n of (m.addedNodes||[])){
          if(n&&n.nodeType===1&&((n.matches&&n.matches('#monthly-table,#history-table,#monthly-table *,#history-table *'))||(n.querySelector&&n.querySelector('#monthly-table,#history-table')))){relevant=true;break;}
        }
        if(relevant)break;
      }
      if(!relevant||queued)return;
      queued=true;
      requestAnimationFrame(()=>{queued=false;tfApplyRev312TableLayouts();});
    });
    window.__tfRev312TableObserver.observe(document.documentElement,{childList:true,subtree:true});
    if(!window.__tfMonthlyResizeV316){
      window.__tfMonthlyResizeV316=true;
      window.addEventListener('resize',()=>requestAnimationFrame(tfFixMonthlyLayoutV316),{passive:true});
    }
  }

  function prepare(){
    removeDesktopChrome();
    tagScreens();
    installRev312LayoutObserver();
    createHeader();
    createNav();
    bindHeader();
    ensureDataSheet();
    cleanDesktopText();
    const tfStartKeyV322 = activeKey || 'table1';
    safeLocalSet('tf_mobile_active_screen', tfStartKeyV322);
    activate(tfStartKeyV322, false);
    if(Date.now() < tfResumeUntilV322) tfRestoreMobileResumeScrollV322(tfStartKeyV322);

    if(
      typeof window.tfMobileFinishImportLoadingWhenReady==="function"
    ){
      setTimeout(
        window.tfMobileFinishImportLoadingWhenReady,
        80
      );
    }

    if(observer) observer.disconnect();
    observer = new MutationObserver((mutations) => {
      // Only re-run screen wiring when the original REV224 code actually
      // inserts new elements. Avoid the old self-triggering text mutation loop.
      let relevant = false;
      for(const mutation of mutations){
        if(!mutation.addedNodes || !mutation.addedNodes.length) continue;
        for(const node of mutation.addedNodes){
          if(node.nodeType !== 1) continue;
          if(
            node.id === 'tf-score-history-section' ||
            node.id === 'tf-perf-wrap' ||
            node.id === 'tf-mobile-data-controls' ||
            (node.querySelector && (
              node.querySelector('#tf-score-history-section') ||
              node.querySelector('#tf-perf-wrap')
            ))
          ){
            relevant = true;
            break;
          }
        }
        if(relevant) break;
      }
      if(!relevant) return;

      const before = q('tf-score-history-section')?.classList.contains('tf-mobile-screen');
      tagScreens();
      tfApplyRev312TableLayouts();
      ensureDataSheet();
      cleanDesktopText();
      if(!before && q('tf-score-history-section')) activate(activeKey, false);
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }

  function boot(){
    // Let original REV224 initialize first, then turn its dashboard into app screens.
    setTimeout(prepare, 70);
    setTimeout(() => {
      tagScreens(); ensureDataSheet();
      if(!document.querySelector('.tf-mobile-screen.tf-mobile-screen-active')) activate(activeKey||'table1',false);
      if(Date.now() < tfResumeUntilV322) tfRestoreMobileResumeScrollV322(activeKey||'table1');
    }, 550);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, {once:true});
  else boot();
})();
