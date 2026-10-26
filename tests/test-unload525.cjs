const {chromium}=require('playwright'),assert=require('assert/strict'),fs=require('fs'),path=require('path');
const root=process.env.TF_REV419_ROOT||'outputs/TF_Extension_PC_MAC_REV525_MULTI_LINK';
(async()=>{
 const browser=await chromium.launch({headless:true,channel:process.env.CI?undefined:'chrome'}),page=await browser.newPage(),errors=[],violations=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(/permissions.policy.violation.*unload/i.test(m.text()))violations.push(m.text());});
 const cdp=await page.context().newCDPSession(page);await cdp.send('Log.enable');cdp.on('Log.entryAdded',({entry})=>{if(/permissions.policy.violation.*unload/i.test(entry.text))violations.push(entry.text);});
 await page.route('**/*',r=>r.fulfill({body:'<!doctype html><html><body><main>Account fixture</main></body></html>',contentType:'text/html',headers:{'Permissions-Policy':'unload=()'}}));
 await page.goto('https://account.tradersfamily.id/?tfext_profile=1');
 await page.evaluate(()=>{
  window.__registered=[];window.__tracked=new Map();window.__cleared=0;window.__writes=[];
  const add=window.addEventListener.bind(window),timeout=window.setTimeout.bind(window),interval=window.setInterval.bind(window),ct=window.clearTimeout.bind(window),ci=window.clearInterval.bind(window);
  window.addEventListener=(type,...args)=>{__registered.push(type);return add(type,...args);};
  window.setTimeout=(fn,ms,...args)=>{let id;id=timeout(()=>{__tracked.delete(id);fn(...args);},ms);__tracked.set(id,'timeout');return id;};
  window.setInterval=(fn,ms,...args)=>{const id=interval(fn,ms,...args);__tracked.set(id,'interval');return id;};
  window.clearTimeout=id=>{if(__tracked.delete(id))__cleared++;return ct(id);};window.clearInterval=id=>{if(__tracked.delete(id))__cleared++;return ci(id);};
  const local={get:(keys,cb)=>{cb?.({});return Promise.resolve({});},set:(data,cb)=>{__writes.push(data);cb?.();return Promise.resolve();},remove:(keys,cb)=>{cb?.();return Promise.resolve();}};
  window.chrome={runtime:{id:'fixture-extension',onMessage:{addListener(){}},sendMessage:(data,cb)=>{cb?.({ok:true});return Promise.resolve({ok:true});},getURL:p=>location.origin+'/'+p},storage:{local,onChanged:{addListener(){}}}};
 });
 const script=fs.readFileSync(path.join(root,'assets/tf-login-helper-rev205.js'),'utf8');await page.addScriptTag({content:script});
 assert.equal(await page.evaluate(()=>__registered.filter(t=>t==='unload').length),0);assert.equal(await page.evaluate(()=>__registered.filter(t=>t==='pagehide').length),1);
 const before=await page.evaluate(()=>__tracked.size);assert(before>=8,'account probes still scheduled before navigation');
 await page.evaluate(()=>dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));assert.equal(await page.evaluate(()=>__tracked.size),0);assert.equal(await page.evaluate(()=>__cleared),before);
 assert.deepEqual(errors,[]);assert.deepEqual(violations,[]);
 console.log('PASS actual login helper under Permissions-Policy unload=(): no unload registration/violation; pagehide still cancels every scheduled account probe');await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
