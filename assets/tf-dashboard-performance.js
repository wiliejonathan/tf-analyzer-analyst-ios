(() => {
 'use strict';
 if(document.getElementById('tf-dashboard-performance474'))return;
 const style=document.createElement('style');style.id='tf-dashboard-performance474';
 style.textContent=`@media screen {
 #tf-dashboard-main .table-wrapper::before,#tf-dashboard-main .table-wrapper::after,#tf-dashboard-main .tf-holding-card::before,#tf-dashboard-main .tf-holding-card::after{display:none!important;transition:none!important;}
 #tf-dashboard-main .table-wrapper,#tf-dashboard-main .tf-holding-card{transition:none!important;}
 #tf-dashboard-main table th,#tf-dashboard-main table td{text-shadow:none!important;box-shadow:none!important;transition:none!important;}
 .tf-mobile-appbar,.tf-mobile-bottom-nav,#tf-mobile-bottom-nav{-webkit-backdrop-filter:none!important;backdrop-filter:none!important;}
 @supports(content-visibility:auto){#section-monthly,#section-history,#tf-score-history-section{content-visibility:auto;contain-intrinsic-block-size:auto 900px;}}
 } @media print {#section-monthly,#section-history,#tf-score-history-section{content-visibility:visible!important;contain-intrinsic-block-size:none!important;}}`;
 document.head.append(style);
})();
