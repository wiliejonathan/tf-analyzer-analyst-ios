const fs=require('fs'),{chromium}=require('playwright'),assert=require('assert/strict');
const root=process.env.TF_REV419_ROOT||'work/mobile502';
(async()=>{const b=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'}),p=await b.newPage();await p.route('https://test.local/**',r=>r.fulfill({body:'<!doctype html><html data-tf-server-authorized="1"><body></body></html>',contentType:'text/html'}));await p.goto('https://test.local/dashboard.html');
await p.addScriptTag({path:root+'/assets/dashboard-mobile.js'});
await p.addScriptTag({path:root+'/assets/tf-analyst-risk-adjustment.js'});
await p.evaluate(()=>{document.getElementById('tf-risk-explainer')?.remove();document.body.classList.remove('tf-risk-explainer-open');tf_setupMonthlyRiskStop();document.querySelector('.tf-risk-fold').open=true;});
assert.equal(await p.locator('#tf-month-risk-toggle').isChecked(),false);assert.equal(await p.locator('#tf-month-risk-percent').inputValue(),'100');assert(await p.locator('#tf-month-risk-percent').isDisabled());
assert(await p.locator('#tf-month-risk-stop').evaluate(el=>el.nextElementSibling?.classList.contains('tf-risk-adjust-help')));
await p.evaluate(()=>{localStorage.setItem('tfMonthlySignalRiskStop',JSON.stringify({enabled:false,percent:75}));tf_syncMonthlyRiskStop();equityMetric='pips';tf_isMyfxbookPriceLoading=()=>false;getDollarPerPipForAnalyst=()=>1;getEffectiveSlForAnalyst=()=>({pips:100});historySignals=[];let i=0;const add=(date,pips)=>historySignals.push({analyst:'A',pair:'XAUUSD',pips,createdSortKey:Date.parse(date),sortKey:Date.parse(date),createdDate:date,displayDate:date,id:++i});for(let m=1;m<=6;m++)add('2026-'+String(m).padStart(2,'0')+'-02',100);add('2026-07-01',-80);add('2026-07-02',100);add('2026-08-01',100);});
await p.evaluate(()=>{const e=document.getElementById('tf-month-risk-toggle');e.checked=!e.checked;e.dispatchEvent(new Event('change',{bubbles:true}));});await p.waitForTimeout(100);
const stopped=p.locator('#history-table tr[data-month-risk-stopped]');assert.equal(await stopped.count(),1);assert.equal(await stopped.locator('input[type=checkbox]').isChecked(),false);assert(await stopped.locator('input').isDisabled());
const on=await p.evaluate(()=>({n:lastHistoryRowsForExport.length,ids:tf_lastEquityCalcRows.filter(r=>!r.isWithdraw).length,blocked:tf_monthRiskBlocked.size}));assert.equal(on.n,8);assert.equal(on.blocked,1);assert.equal(on.ids,8);
await p.evaluate(()=>{const e=document.getElementById('tf-month-risk-toggle');e.checked=!e.checked;e.dispatchEvent(new Event('change',{bubbles:true}));});const off=await p.evaluate(()=>({n:lastHistoryRowsForExport.length,ids:tf_lastEquityCalcRows.filter(r=>!r.isWithdraw).length}));assert.equal(off.n,9);assert.equal(off.ids,9);assert.equal(await stopped.count(),0);
await p.evaluate(()=>{const e=document.getElementById('tf-month-risk-toggle');e.checked=!e.checked;e.dispatchEvent(new Event('change',{bubbles:true}));});await p.locator('#tf-month-risk-percent').fill('90');await p.locator('#tf-month-risk-percent').dispatchEvent('change');assert.equal(await stopped.count(),0);
assert.equal(await p.locator('[data-month-risk-toggle]').count(),4);
await p.evaluate(()=>{const e=document.querySelector('.tf-cost-sync-tickers [data-month-risk-toggle]');e.checked=false;e.dispatchEvent(new Event('change',{bubbles:true}));});assert.equal(await p.locator('#tf-month-risk-toggle').isChecked(),false);
await p.evaluate(()=>{const e=document.getElementById('tf-month-risk-toggle');e.checked=true;e.dispatchEvent(new Event('change',{bubbles:true}));});
await p.locator('#tf-month-risk-percent').fill('75');await p.locator('#tf-month-risk-percent').dispatchEvent('change');
await p.evaluate(()=>{ANALYSTS=[{name:'A',pair:'XAUUSD'}];monthlyStatsByAnalyst={A:{'2026-07':{pips:-80,signals:1}}};tf_getMonthlyVisibleMonthKeys=()=>['2026-07'];document.getElementById('monthly-body').innerHTML='<tr><td data-analyst="A" data-month-key="2026-07"></td></tr>';updateMonthlyTableCells();});
const marked=p.locator('#monthly-body td[data-month-key="2026-07"]');assert.match(await marked.innerText(),/\u00d7/);assert.equal(await marked.locator('.tf-month-stop-loss').count(),3);assert.equal(await marked.locator('[data-tf-latest-risk-icon]').count(),0);
const bands=await p.evaluate(()=>{const calls=[];tf_lastEquityCalcRows=historySignals;const points=['2026-06-01','2026-07-01','2026-08-01'].map(date=>({sortKey:Date.parse(date)}));tf_drawMonthlyRiskBands({save(){},restore(){},fillRect(...args){calls.push(args)}},points,i=>i*50,10,100);return calls;});assert.deepEqual(bands,[[50,10,50,100]]);
await p.screenshot({path:'outputs/month-risk496.png',fullPage:false});console.log('PASS real dashboard UI placement/defaults/toggle, stopped Table 3 checkbox, exports and equity membership, OFF restoration, custom percentage');await b.close();})().catch(e=>{console.error(e);process.exit(1)});



