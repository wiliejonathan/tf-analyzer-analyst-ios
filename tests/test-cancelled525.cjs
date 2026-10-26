const {chromium}=require('playwright'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const roots=process.env.TF_REV419_ROOT?[process.env.TF_REV419_ROOT]:['outputs/TF_Extension_PC_MAC_REV525_MULTI_LINK','work/mobile525'];
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'});
 const scanRoot=roots.find(root=>fs.existsSync(path.join(root,'assets/dec74fd654ec6d54.js')));
 if(scanRoot){const scan=await browser.newPage(),source=fs.readFileSync(path.join(scanRoot,'assets/dec74fd654ec6d54.js'),'utf8');
  await scan.setContent('<div class="container-card" id="22924777"><div class="symbol-card"><b>XAUUSD</b></div><p>Created at <span>29-09-2026, 06:09 WIB</span></p><p>Closed at <span>30-09-2026, 14:34 WIB</span></p><div class="box-footer"><span class="text-active-new"><b>Cancelled</b></span></div></div>');
  await scan.addScriptTag({content:source.slice(source.indexOf('function tf_parseCreatedAtToSortKey('),source.indexOf('function tf_monthKeyFromDisplayDate('))+source.slice(source.indexOf('function tf_readHistorySignalCardDetails('),source.indexOf('function tf_collectHistoryPageUrls('))});
  const rows=await scan.evaluate(()=>tf_scanHistorySignalsFromRoot(document,'Synthetic',['XAUUSD']));assert.equal(rows.length,1);assert.equal(rows[0].status,'Cancelled');assert.equal(rows[0].pips,null);assert.equal(rows[0].openedDate,'');assert.equal(rows[0].signalId,'22924777');await scan.close();console.log('PASS actual scanner: Cancelled DOM retained with null pips and no fabricated Opened At');
 }
 for(const root of roots){
  const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',r=>r.fulfill({contentType:'text/html',body:'<html><body></body></html>'}));await page.goto('https://cancelled.test/');
  const core=fs.existsSync(path.join(root,'assets/dashboard-mobile.js'))?'dashboard-mobile.js':'4b4d6b8dc315a95c.js';await page.addScriptTag({path:path.join(root,'assets',core)});
  const result=await page.evaluate(()=>{
   setupBalanceAndRiskControls();currentBalance=10000;currentRiskPercent=1;
   const base={analyst:'Synthetic',pair:'XAUUSD',entry:4000,takeProfit:4040,stopLoss:3980,type:'Buy',createdDate:'23-10-2026 20:00 WIB',createdSortKey:1792774800000,openedDate:'23-10-2026 21:27 WIB',openedSortKey:1792780020000,displayDate:'23-10-2026 22:27 WIB',sortKey:1792783620000};
   historySignals=[{...base,pips:400,signalId:'profit'},{...base,pips:-200,sortKey:base.sortKey+60000,signalId:'loss'}];
   avgSlPipsByAnalystPair={Synthetic:{XAUUSD:200}};recomputeHistoryRows();setupHistoryColumnFilter();
   const before=JSON.stringify(lastHistoryRowsForExport);
   historySignals.push({...base,isCancelled:true,status:'Cancelled',pips:null,openedDate:'',openedSortKey:null,signalId:'cancelled'});
   recomputeHistoryRows();return {before,after:JSON.stringify(lastHistoryRowsForExport),raw:historySignals.length};
  });
  assert.equal(result.before,result.after,'Cancelled must never alter executed trade calculations');assert.equal(result.raw,3);
  assert.equal(await page.locator('#tf-show-cancelled525').isChecked(),false);assert.equal(await page.locator('[data-cancelled]').count(),0);
  await page.locator('#tf-show-cancelled525').evaluate(e=>{e.checked=true;e.dispatchEvent(new Event('change'));});
  const row=page.locator('[data-cancelled]');assert.equal(await row.count(),1);assert.equal(await row.locator('input').isChecked(),false);assert.equal(await row.locator('input').isDisabled(),true);
  assert.equal(await row.locator('[data-history-col="created"]').textContent(),'23-10-2026 20:00 WIB');assert.equal(await row.locator('[data-history-col="opened"]').textContent(),'—');
  const other=await row.locator('[data-history-col]').evaluateAll(cells=>cells.filter(td=>!['created','opened','closed'].includes(td.dataset.historyCol)).map(td=>td.textContent));assert(other.every(t=>t==='—'));
  assert.equal(await page.evaluate(()=>lastHistoryRowsForExport.length),2);assert.deepEqual(errors,[]);
  console.log('PASS',root,': hidden/unticked Cancelled, dates-only rendering, financial and export isolation');
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
