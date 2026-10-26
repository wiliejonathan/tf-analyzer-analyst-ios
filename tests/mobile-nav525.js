// Keep the mobile navigation on one swipeable row, with directional hints.
(() => {
function connect() {
 const nav = document.getElementById('tf-mobile-bottom-nav');
 const scroller = nav?.querySelector('.tf-mobile-nav-scroller');
 if (!scroller || nav.dataset.swipe525) return;
 nav.dataset.swipe525 = 'true';
 for(const side of ['left','right']) {
  const hint = document.createElement('span');
  hint.className = 'tf-nav-hint525 ' + side; hint.textContent = side === 'left' ? '◂' : '▸';
  hint.setAttribute('aria-hidden','true'); nav.append(hint);
 }
 let queued = false;
 const update = () => {
  queued = false;
  nav.classList.toggle('has-left525', scroller.scrollLeft > 2);
  nav.classList.toggle('has-right525', scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft > 2);
 };
 const schedule = () => { if(!queued){queued=true;requestAnimationFrame(update);} };
 scroller.addEventListener('scroll', schedule, {passive:true});
 new ResizeObserver(schedule).observe(scroller);
 nav.addEventListener('click', e => {
  const button = e.target.closest('[data-mobile-nav]');
  if(button) {
   const left = button.offsetLeft, right = left + button.offsetWidth;
   if(left < scroller.scrollLeft) scroller.scrollLeft = left;
   else if(right > scroller.scrollLeft + scroller.clientWidth) scroller.scrollLeft = right - scroller.clientWidth;
  }
 });
 schedule(); observer.disconnect();
}
const observer = new MutationObserver(connect);
observer.observe(document.body,{childList:true,subtree:true}); connect();
})();
