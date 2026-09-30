const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const {test}=require('node:test');
const source=fs.readFileSync('mobile-license-gate.js','utf8');
function harness(){
 const ctx={console,Map,Date,JSON,Promise,AbortController,setTimeout,clearTimeout,navigator:{userAgent:'Web'},location:{protocol:'https:'},document:{},window:{},localStorage:{}};
 vm.createContext(ctx);
 const end=source.indexOf('  window.tfMobileLogout = logout;');
 vm.runInContext(source.slice(0,end)+`globalThis.t={api,login,isExplicitDenial,isTemporaryLicenseResult,validateLiveLicense,silentRefreshRememberedAuthorization,override:code=>eval(code)};})();`,ctx);
 ctx.t.override(`setBusy=v=>{busy=v};setStatus=()=>{};forgetCredentials=()=>{globalThis.forgot++};`);ctx.forgot=0;
 return ctx;
}
test('transient valid:false does not revoke remembered license',()=>{const c=harness();assert.equal(c.t.isExplicitDenial({valid:false,code:'APPS_SCRIPT_TIMEOUT'}),false);assert.equal(c.t.isExplicitDenial({valid:false,code:'LICENSE_BLOCKED'}),true);assert.equal(c.t.isExplicitDenial({valid:false,code:'LICENSE_EXPIRED'}),true)});
test('failed temporary activation preserves stored credentials',async()=>{const c=harness();c.t.override(`apiTransport=async()=>({valid:false,code:'APPS_SCRIPT_TIMEOUT'});`);await c.t.login('a@b.c','T');assert.equal(c.forgot,0)});
test('confirmed invalid token still clears credentials',async()=>{const c=harness();c.t.override(`apiTransport=async()=>({valid:false,code:'TOKEN_INVALID'});`);await c.t.login('a@b.c','T');assert.equal(c.forgot,1)});
test('same path credential requests share one transport',async()=>{const c=harness();c.calls=0;let release;c.release=()=>release();c.wait=new Promise(r=>release=r);c.t.override(`apiTransport=async()=>{globalThis.calls++;await globalThis.wait;return {valid:true}};`);const a=c.t.api('/mobile/login',{email:'a@b.c',token:'T'});const b=c.t.api('/mobile/login',{email:'a@b.c',token:'T'});assert.equal(a,b);assert.equal(c.calls,1);c.release();await a;await c.t.api('/mobile/login',{email:'a@b.c',token:'T'});assert.equal(c.calls,2)});
test('boot refresh and watch do not overlap',async()=>{const c=harness();c.calls=0;let release;c.release=()=>release();c.wait=new Promise(r=>release=r);c.t.override(`activeCredentials={email:'a@b.c',token:'T'};apiTransport=async()=>{globalThis.calls++;await globalThis.wait;return {valid:false,code:'APPS_SCRIPT_TIMEOUT'}};`);const a=c.t.silentRefreshRememberedAuthorization();const b=c.t.validateLiveLicense();assert.equal(c.calls,1);c.release();await Promise.all([a,b]);assert.equal(c.forgot,0)});
test('Android fallback relay skips second main server lookup',()=>{const c=harness();assert(source.includes('directOnly: true'));const relay=fs.readFileSync('activation-proxy.html','utf8');assert(relay.includes('d.directOnly===true?await direct'));assert(!source.includes('try { return await androidRelayLicenseLookup'));});

test('failed fallback is not called twice by transport catch',async()=>{const c=harness();c.calls=0;c.fetch=async()=>({ok:true,status:200,text:async()=>JSON.stringify({valid:false,code:'APPS_SCRIPT_TIMEOUT'})});c.t.override(`licenseFallbackLookup=async()=>{globalThis.calls++;const e=new Error('relay timeout');e.name='AbortError';throw e};`);await assert.rejects(c.t.api('/mobile/login',{email:'a@b.c',token:'T'}));assert.equal(c.calls,1)});
