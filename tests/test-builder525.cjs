const {chromium}=require('playwright'),assert=require('assert/strict'),fs=require('fs');
(async()=>{
 const b=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'}),p=await b.newPage();
 await p.route('**/*',r=>r.fulfill({body:'<html><body><main id="tf-dashboard-main"><nav><ul><li><a class="tf-nav-link" href="#">Profile</a></li></ul></nav><section>Dashboard</section></main></body></html>',contentType:'text/html'}));await p.goto('https://builder.test/');
 await p.evaluate(()=>{
  const base={analyst:'Synthetic',pair:'XAUUSD',entry:4000,takeProfit:4040,stopLoss:3980,type:'Buy',createdDate:'23-10-2026 20:00 WIB',openedDate:'23-10-2026 21:27 WIB',displayDate:'23-10-2026 22:27 WIB'};
  window.chrome={storage:{local:{get:async()=>({tfHistorySignals:[{...base,pips:400},{...base,pips:-200},{...base,isCancelled:true,status:'Cancelled',openedDate:'',pips:null}]})}},runtime:{connectNative:name=>{
   window.compilerHost=name;return {onDisconnect:{addListener(){}},onMessage:{addListener(fn){window.compilerResult=fn;}},postMessage(request){window.compilerRequest=request;},disconnect(){}};
  }}};
 });
 await p.addScriptTag({path:(process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV525_MULTI_LINK')+'/assets/tf-indicator-builder.js'});
 await p.getByText('Created MT4/MT5 Indicator',{exact:true}).first().click();
 await p.locator('[name=analyst]').selectOption('Synthetic');await p.locator('[name=pair]').selectOption('XAUUSD');
 assert.equal(await p.locator('[name=range]').inputValue(),'ALL');assert.equal(await p.locator('[name=platform]').inputValue(),'MT4');
 const text=await p.locator('#tf-indicator-summary').innerText();assert.match(text,/TP: 1/);assert.match(text,/SL: 1/);assert.match(text,/R: 1/);assert.match(text,/Cancelled: 1/);
 await p.getByRole('button',{name:'Submit',exact:true}).click();
 const request=await p.evaluate(()=>compilerRequest);assert.equal(request.rows.length,3);assert.equal(request.rows[2].opened,'');assert.equal(request.rows[2].status,'Cancelled');assert.equal(request.rows[0].opened,'2026.10.23 21:27');
 await p.evaluate(()=>compilerResult({type:'error',message:'Synthetic compiler error'}));assert.equal(await p.getByRole('button',{name:'Submit',exact:true}).isEnabled(),true);
 await p.getByRole('button',{name:'Reset',exact:true}).click();assert.equal(await p.locator('[name=platform]').inputValue(),'MT4');
 console.log('PASS plugin builder: selectors, executed-only statistics, exact Opened At, Cancelled payload, compiler error and reset');
 await p.close();
 const q=await b.newPage({viewport:{width:360,height:800}});await q.setContent('<html><body><nav id="tf-mobile-bottom-nav"><div class="tf-mobile-nav-scroller">'+Array.from({length:8},(_,i)=>`<button class="tf-mobile-nav-item" data-mobile-nav="${i}">Item ${i}</button>`).join('')+'</div></nav></body></html>');
 await q.addStyleTag({path:require('path').join(__dirname,'mobile-nav525.css')});await q.addScriptTag({path:require('path').join(__dirname,'mobile-nav525.js')});await q.waitForTimeout(40);
 const nav=q.locator('#tf-mobile-bottom-nav');assert.match(await nav.getAttribute('class')||'',/has-right525/);assert(!(await nav.getAttribute('class')||'').includes('has-left525'));
 const tops=await q.locator('button').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().top));assert.equal(new Set(tops).size,1);
 await q.locator('.tf-mobile-nav-scroller').evaluate(e=>{e.scrollLeft=e.scrollWidth;e.dispatchEvent(new Event('scroll'));});await q.waitForTimeout(40);
 assert.match(await nav.getAttribute('class'),/has-left525/);assert(!(await nav.getAttribute('class')).includes('has-right525'));
 console.log('PASS mobile one-row navigation and start/end directional hints');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
