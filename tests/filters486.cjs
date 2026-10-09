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
await page.evaluate(()=>{
 const names=['BHAGAWANTA2','nicangg','Pips Gainers','still beginner','trade07','Udine_Trade'];
 const pairs=Object.fromEntries(names.map(n=>[n,new Set(n==='BHAGAWANTA2'||n==='Pips Gainers'?['USDJPY','GBPJPY','EURJPY']:['XAUUSD'])]));
 tf_buildAnalystTickerFilterGroup({containers:['analyst-filter-container-table1','analyst-filter-container-holding','analyst-filter-container-monthly'].map(id=>document.getElementById(id)),analystNames:names,pairsByAnalyst:pairs});
});
for(const width of [366,768,966,1480]){
 await page.setViewportSize({width,height:844});await page.locator('[data-mobile-nav=performance]').click();
 for(const id of ['analyst-filter-container-table1','analyst-filter-container-holding']){
  const geometry=await page.locator('#'+id).evaluate(el=>{const l=el.querySelector('.analyst-filter-list'),items=[...l.children],labels=items.map(li=>li.querySelector('label'));return {width:el.getBoundingClientRect().width,listWidth:l.getBoundingClientRect().width,cols:getComputedStyle(l).gridTemplateColumns.split(' ').length,widths:items.map(li=>li.getBoundingClientRect().width),names:labels.slice(1).map(label=>{const n=label.querySelector('span');return {text:n.textContent,client:n.clientWidth,scroll:n.scrollWidth};})};});
  assert(Math.abs(geometry.width-geometry.listWidth)<2,JSON.stringify({width,id,geometry}));
  assert(Math.max(...geometry.widths)-Math.min(...geometry.widths)<2);
  assert.equal(geometry.cols,width<641?2:width<900?3:4);
  assert(geometry.names.every(n=>n.client+1>=n.scroll),JSON.stringify({width,id,geometry}));
 }
 await page.locator('#tf-analyst-filter-row-table1').scrollIntoViewIfNeeded();await page.screenshot({path:'../../outputs/filters486-'+width+'.png'});
}
await page.screenshot({path:'../../outputs/mobile482-report.png'});assert.deepEqual(errors,[]);console.log('PASS actual mobile production order, Report navigation, shared risk inputs, fold controls, Performance restore, no runtime errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});


