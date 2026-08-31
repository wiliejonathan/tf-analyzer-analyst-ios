(() => {
  'use strict';

  const PATCH_MARK = 'rev293';
  let patched = false;
  let loaderWatchStarted = 0;
  let loaderTimer = null;

  function q(id){ return document.getElementById(id); }

  function setStatus(text, ok){
    const el=q('tf-mobile-import-status');
    if(!el) return;
    el.textContent=String(text||'');
    el.className='tf-mobile-import-status '+(ok===true?'ok':ok===false?'bad':'');
  }

  function patchControls(){
    const box=q('tf-mobile-data-controls');
    const section=q('section-summary');
    if(!box || !section || !section.parentNode) return false;
    if(box.dataset.importFix===PATCH_MARK) return true;

    // V29 accidentally mounted the import controls inside Table 1 and removed
    // the classes expected by the mobile bottom-sheet shell. Move them back to
    // their original sibling position and restore the mobile card structure.
    if(box.parentNode===section){
      section.parentNode.insertBefore(box,section);
    }else if(box.nextSibling!==section){
      section.parentNode.insertBefore(box,section);
    }
    box.classList.add('card','tf-mobile-data-controls');

    let header=box.querySelector('.card-header');
    if(!header){
      header=document.createElement('div');
      header.className='card-header';
      header.innerHTML='<div class="card-title-group"><h2>Mobile Data</h2><div class="card-badge"><span class="card-badge-dot"></span><span>Import Viewer</span></div></div><div class="section-note">Import file JSON dari TF Multi-Analyst Desktop.</div>';
      box.prepend(header);
    }

    let row=box.querySelector('.tf-mobile-import-row,.tf-mobile-actions');
    if(!row){
      row=document.createElement('div');
      row.className='tf-mobile-actions';
      box.appendChild(row);
    }
    row.classList.remove('tf-mobile-import-row');
    row.classList.add('tf-mobile-actions');

    const oldButton=q('tf-mobile-import-btn');
    const input=q('tf-mobile-import-input');
    const clear=q('tf-mobile-clear-btn');

    if(input){
      input.removeAttribute('hidden');
      input.setAttribute('accept','.json,application/json,text/json,text/plain,application/octet-stream');
      input.setAttribute('aria-label','Pilih file JSON');
      input.addEventListener('click',()=>{ try{ input.value=''; }catch(_){} },true);

      let picker=q('tf-mobile-import-picker-v30');
      if(!picker){
        picker=document.createElement('label');
        picker.id='tf-mobile-import-picker-v30';
        picker.className='btn tf-mobile-import-primary tf-mobile-import-picker';
        picker.setAttribute('role','button');
        picker.setAttribute('tabindex','0');
        picker.innerHTML='<span>Import / Combine Data</span>';
        if(oldButton && oldButton.parentNode===row){
          row.insertBefore(picker,oldButton);
          oldButton.remove();
        }else{
          row.prepend(picker);
        }
        picker.appendChild(input);
        picker.addEventListener('keydown',e=>{
          if(e.key!=='Enter' && e.key!==' ') return;
          e.preventDefault();
          try{
            if(typeof input.showPicker==='function') input.showPicker();
            else input.click();
          }catch(_){ try{input.click();}catch(__){} }
        });
      }else if(input.parentNode!==picker){
        picker.appendChild(input);
      }
    }

    if(clear){
      clear.classList.add('btn','btn-ghost','tf-mobile-clear-secondary');
      if(clear.parentNode!==row) row.appendChild(clear);
    }

    box.dataset.importFix=PATCH_MARK;
    setStatus('Pilih file JSON untuk mulai.');

    // Let the shell re-apply bottom sheet behavior after the controls are moved.
    setTimeout(()=>{
      try{ window.dispatchEvent(new Event('resize')); }catch(_){}
      const dataButton=q('tf-mobile-data-open');
      if(dataButton) dataButton.disabled=false;
    },0);
    return true;
  }

  function loaderWatch(){
    const overlay=q('tf-mobile-import-loading');
    const showing=overlay && overlay.classList.contains('show');
    if(!showing){
      loaderWatchStarted=0;
      if(loaderTimer){clearTimeout(loaderTimer);loaderTimer=null;}
      return;
    }
    if(!loaderWatchStarted) loaderWatchStarted=Date.now();
    if(loaderTimer) return;
    loaderTimer=setTimeout(()=>{
      loaderTimer=null;
      const elapsed=Date.now()-loaderWatchStarted;
      if(elapsed<35000){ loaderWatch(); return; }
      // Last-resort safety only. Normal V29/V30 logic closes after core render.
      if(typeof window.tfMobileHideImportLoading==='function'){
        try{ window.tfMobileHideImportLoading(); }catch(_){}
      }else if(overlay){
        overlay.classList.remove('show');
        document.documentElement.classList.remove('tf-mobile-import-busy');
      }
      setStatus('Loading dihentikan karena terlalu lama. Data yang sudah tersimpan tetap dipertahankan.',false);
      loaderWatchStarted=0;
    },35000);
  }

  function boot(){
    if(patchControls()) patched=true;
    loaderWatch();
    const obs=new MutationObserver(()=>{
      if(!patched || !q('tf-mobile-import-picker-v30')) patched=patchControls();
      loaderWatch();
    });
    obs.observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
    setInterval(()=>{ if(!patched) patched=patchControls(); loaderWatch(); },1000);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();


// REV294 APK-only: direct native file input. This avoids WebView restrictions on programmatic input.click().
(function tfRev294NativeDataPicker(){
  function wire(){
    const box=document.getElementById('tf-mobile-data-controls'),input=document.getElementById('tf-mobile-import-input');if(!box||!input)return false;
    let picker=document.getElementById('tf-mobile-import-picker-v30');
    if(!picker)return false;
    if(picker.tagName.toLowerCase()!=='label'){
      const label=document.createElement('label');label.id='tf-mobile-import-picker-v30';label.className='btn tf-mobile-import-primary tf-mobile-import-picker tf-rev294-native-picker';label.innerHTML='<span>Import / Combine Data</span>';
      picker.replaceWith(label);picker=label;
    }
    picker.classList.add('tf-rev294-native-picker');
    input.hidden=false;input.disabled=false;input.removeAttribute('hidden');input.style.removeProperty('display');input.style.removeProperty('visibility');
    if(input.parentNode!==picker)picker.appendChild(input);
    const clear=document.getElementById('tf-mobile-clear-btn');if(clear){clear.disabled=false;clear.style.pointerEvents='auto';}
    return true;
  }
  const t=setInterval(wire,300);setTimeout(()=>clearInterval(t),30000);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire,{once:true});else wire();
})();
