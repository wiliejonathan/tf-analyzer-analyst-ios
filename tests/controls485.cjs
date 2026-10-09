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
for(const width of [1480,390]){
 await page.setViewportSize({width,height:844});await page.locator('[data-mobile-nav=performance]').click();
 if(await page.locator('#tf-risk-explainer-understand').isVisible())await page.locator('#tf-risk-explainer-understand').click();
 const controls=await page.evaluate(()=>['swap-enabled-toggle','commission-enabled-toggle','withdraw-enabled-toggle'].map(id=>{const el=document.getElementById(id).parentElement,r=el.getBoundingClientRect();return {id,x:r.x,y:r.y,w:r.width,h:r.height};}));
 for(let i=0;i<controls.length;i++)for(let j=i+1;j<controls.length;j++){const a=controls[i],b=controls[j];assert(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y,JSON.stringify({width,controls}));}
 await page.screenshot({path:'../../outputs/controls485-performance-'+width+'.png'});
 await page.locator('[data-mobile-nav=table3]').click();
 const sizes=await page.evaluate(()=>['withdraw-amount-input-history','withdraw-months-select-history','withdraw-submit-btn-history'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};}));
 assert(sizes[1].w>=60&&sizes[2].w>=90,JSON.stringify({width,sizes}));if(width>640)assert(sizes[0].w<=221);
 for(let i=0;i<2;i++)assert(sizes[i].x+sizes[i].w<=sizes[i+1].x+1,JSON.stringify({width,sizes}));
 await page.screenshot({path:'../../outputs/controls485-history-'+width+'.png'});
 await page.evaluate(()=>{const container=document.getElementById('analyst-filter-container-history');container.innerHTML='<ul class="analyst-filter-list"><li class="analyst-filter-item"><label><input type="checkbox"><span class="analyst-pair-selector-trigger">Pips Gainers</span><span class="analyst-filter-arrow">3 pairs ▾</span></label></li></ul>';});
 const gap=await page.locator('#analyst-filter-container-history label').evaluate(el=>{const spans=el.querySelectorAll('span');return spans[1].getBoundingClientRect().left-spans[0].getBoundingClientRect().right;});assert(gap>=0&&gap<12,JSON.stringify({width,gap}));
}
await page.screenshot({path:'../../outputs/mobile482-report.png'});assert.deepEqual(errors,[]);console.log('PASS actual mobile production order, Report navigation, shared risk inputs, fold controls, Performance restore, no runtime errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exit(1)});


