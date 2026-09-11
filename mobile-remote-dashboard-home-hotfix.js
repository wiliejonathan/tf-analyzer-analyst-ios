(function(){
  'use strict';
  // REV372 — Mobile Remote Dashboard button routing fix.
  // The Dashboard button inside Remote is LOCAL mobile navigation. It must not
  // send the legacy "open_dashboard" command to the Desktop/PC plugin.
  function goMobileHome(){
    try{
      var back=document.getElementById('tf-remote-back');
      if(back){ back.click(); }
      else if(history.state && history.state.tfRemotePage){ history.back(); }
    }catch(_){ }
    setTimeout(function(){
      try{
        if(typeof window.tfMobileGoHome==='function'){
          window.tfMobileGoHome();
          return;
        }
        var home=document.querySelector('[data-mobile-nav="table1"]');
        if(home){ home.click(); return; }
        window.scrollTo({top:0,behavior:'auto'});
      }catch(_){ }
    },60);
  }
  document.addEventListener('click',function(event){
    var target=event.target;
    var button=target && target.closest ? target.closest('#tf-remote-dashboard') : null;
    if(!button)return;
    event.preventDefault();
    event.stopPropagation();
    if(typeof event.stopImmediatePropagation==='function')event.stopImmediatePropagation();
    goMobileHome();
  },true);
})();
