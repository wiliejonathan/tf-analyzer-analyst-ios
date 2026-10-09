const assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{const browser=await chromium.launch({headless:true,channel:process.env.TF_BROWSER_CHANNEL||(process.env.CI?undefined:'chrome')});try{
const page=await browser.newPage({viewport:{width:390,height:844}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.route('**/*',r=>r.request().isNavigationRequest()?r.fulfill({contentType:'text/html',body:'<!doctype html><html><head></head><body></body></html>'}):r.abort());await page.goto('https://mobile474.test');
await page.evaluate(()=>document.documentElement.dataset.tfServerAuthorized='1');
for(const file of ['assets/dashboard-original.css','mobile-overrides.css'])await page.addStyleTag({path:file});
for(const file of ['mobile-chrome-shim.js','assets/dashboard-mobile.js','mobile-data-bridge.js','assets/tf-analyst-risk-adjustment.js','assets/tf-analyst-report.js','assets/tf-dashboard-performance.js','mobile-app-shell.js'])await page.addScriptTag({path:file});
await page.evaluate(()=>document.dispatchEvent(new Event('DOMContentLoaded',{bubbles:true})));await page.waitForTimeout(1800);await page.locator('#tf-risk-explainer-understand').click();
assert.equal(await page.locator('#tf-pair-value-adjustment').isVisible(),false);assert.equal(await page.locator('.tf-price-fold').count(),0);assert.equal(await page.locator('#tf-analyst-risk-adjustment').evaluate(e=>e.nextElementSibling.id),'tf-pair-value-adjustment');assert.equal(await page.locator('.tf-risk-fold').getAttribute('open'),null);assert.equal(await page.locator('.tf-lot-fold').count(),0);assert.equal(await page.locator('#summary-table').isVisible(),true);
assert.equal(await page.locator('#tf-pair-value-adjustment .pip-table-compact').count(),2);assert.equal(await page.locator('#tf-pair-value-adjustment .pip-table-compact').first().isVisible(),false);assert.equal(await page.locator('#summary-table').isVisible(),true);
await page.evaluate(()=>{historySignals=[{analyst:'Sample',pair:'XAUUSD',pips:100,sortKey:new Date(2026,2,2).getTime()},{analyst:'Sample',pair:'XAUUSD',pips:-200,sortKey:new Date(2026,9,2).getTime()}];analystSourcesByName={Sample:{url:'https://example.com/analyst'}};});
assert.equal(await page.locator('.tf-risk-fold>summary').evaluate(el=>getComputedStyle(el).fontSize),await page.locator('#tf-user-adjustment415>legend').evaluate(el=>getComputedStyle(el).fontSize));await page.locator('[data-mobile-nav="report"]').click();assert.match(await page.locator('#tf-report-explainer').innerText(),/dibagi 4/);assert.equal(await page.locator('#tf-report-explainer .tf-risk-explainer-row').count(),2);assert.equal(await page.locator('#tf-report-explainer .tf-risk-green').count(),0);assert.equal(await page.locator('#tf-report-explainer h2').innerText(),'Analis Report');await page.locator('#tf-report-explainer button').click();
assert.equal(await page.locator('#tf-analyst-report').isVisible(),true);assert.equal(await page.locator('#tf-analyst-report #tf-analyst-risk-adjustment').count(),1);assert.equal(await page.locator('#tf-analyst-report #tf-user-adjustment415').isVisible(),true);
assert.equal(await page.locator('#tf-analyst-report tbody tr').count(),1);assert.equal(await page.locator('#tf-analyst-report a[target="_blank"]').getAttribute('href'),'https://example.com/analyst');
await page.locator('#tf-analyst-report .tf-risk-fold>summary').click();await page.locator('#tf-analyst-report [data-risk=cons]').fill('45');await page.locator('#tf-analyst-report [data-risk=cons]').dispatchEvent('change');assert.equal(await page.evaluate(()=>tf_analystRiskSettings().cons),30);await page.locator('.tf-risk-confirm').click();assert.equal(await page.evaluate(()=>tf_analystRiskSettings().cons),45);
await page.locator('[data-mobile-nav="table1"]').click();assert.equal(await page.locator('#tf-analyst-report').isVisible(),false);assert.equal(await page.locator('#section-summary #tf-analyst-risk-adjustment').count(),1);
await page.locator('[data-mobile-nav="performance"]').click();assert.equal(await page.locator('#tf-user-adjustment415').isVisible(),true);await page.locator('[data-mobile-nav="report"]').click();
assert.equal(await page.locator('#tf-analyst-report #tf-user-adjustment415').isVisible(),true);assert.equal(await page.locator('.tf-report-pnl-pair').count(),4);
await page.locator('[data-mobile-nav="performance"]').click();
assert.equal(await page.locator('#tf-balance-cards412').evaluate(e=>e.nextElementSibling.id),'tf-user-adjustment415');
for(const width of [1480,390]){
 await page.setViewportSize({width,height:844});await page.locator('[data-mobile-nav="table3"]').click();
 await page.evaluate(()=>{const body=document.querySelector('#drawdown-table>tbody');body.innerHTML='<tr data-analyst="Sample"><td class="dd-details-control">▶</td><td>Sample</td>'+Array.from({length:8},()=>'<td>1</td>').join('')+'</tr>';window.__tfDrawdownDetailByAnalyst={Sample:{maxProfitTrades:10,maxLossTrades:3,profitRuns:{9:{count:1,bestPips:100,bestDollar:10}}}};tf_bindDrawdownDetailsHandler();});
 await page.locator('#drawdown-table .dd-details-control').click();await page.waitForTimeout(100);
 assert.equal(await page.locator('.dd-child-row>.dd-detail-empty484').count(),2);
 assert.equal(await page.locator('.drawdown-detail-table tbody tr td').first().innerText(),'9');
 const positions=await page.evaluate(()=>{const hs=[...document.querySelectorAll('#drawdown-table>thead th')],ds=[...document.querySelectorAll('.drawdown-detail-table tbody tr:first-child td')];return ds.map((d,i)=>Math.abs(d.getBoundingClientRect().left-hs[i+2].getBoundingClientRect().left));});
 assert(positions.every(x=>x<2),JSON.stringify({width,positions}));
 await page.screenshot({path:'../../outputs/layout484-streak-'+width+'.png'});
}
await page.evaluate(async()=>{await chrome.storage.local.set({tfScoreHistory:[{analyst:'Sample',date:'September 2026',dateSort:2,averageScore:2.5},{analyst:'Sample',date:'August 2026',dateSort:1,averageScore:2.4}]});await window.tfRenderScoreHistory();});
await page.locator('[data-mobile-nav="table4"]').click();await page.locator('[data-score-detail]').first().click();
assert.equal(await page.locator('.tf-score-month484').count(),2);
assert.equal(await page.locator('.tf-score-month484').first().evaluate(e=>getComputedStyle(e).borderRadius),'10px');
await page.screenshot({path:'../../outputs/layout484-months.png'});
await page.screenshot({path:'../../outputs/mobile482-report.png'});assert.deepEqual(errors,[]);console.log('PASS actual mobile production order, Report navigation, shared risk inputs, fold controls, Performance restore, no runtime errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});



