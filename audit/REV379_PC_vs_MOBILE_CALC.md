# PC REV379 vs Mobile REV372 - Calculation Parity Audit

- PC source asset: assets/4b4d6b8dc315a95c.js
- PC SHA256: 045cd41fa63ac70476184695a52dc179dc86d831c330574b419037856e1d343a
- Mobile SHA256: ff8330bb3cd898c107b5251b63e2acc9f167d2f1cd6a2d825688c9f38f5f7349

| Function | PC | Mobile | Normalized parity | PC hash | Mobile hash |
|---|---:|---:|---:|---|---|
| tf_calcDollarPerPipUSD | yes | yes | PASS | 58437d278f1f | 58437d278f1f |
| getDollarPerPipForPair | yes | yes | PASS | ee98ba3b5d09 | ee98ba3b5d09 |
| getDollarPerPipForAnalyst | yes | yes | PASS | 9c6abe452c2d | 9c6abe452c2d |
| computeSlStatsFromHistory | yes | yes | PASS | 70787d9cbca2 | 70787d9cbca2 |
| computeSlPipsFromHistory | yes | yes | PASS | 705e51053bdd | 705e51053bdd |
| getEffectiveSlForAnalyst | yes | yes | PASS | 39d6f917744f | 39d6f917744f |
| tf_buildTradeCostFields | yes | yes | PASS | 0fb977a2d589 | 0fb977a2d589 |
| tf_getHistoryNetPnlDollar | yes | yes | PASS | 95569311060a | 95569311060a |
| tf_getHistoryNetPnlPercent | yes | yes | PASS | e38a0cfba886 | e38a0cfba886 |
| getRiskPercentForAnalyst | yes | yes | PASS | fa58dbfded7c | fa58dbfded7c |
| computeLot | yes | yes | PASS | a92a8df1cc1a | a92a8df1cc1a |
| roundLotToTwoDecimals | yes | yes | PASS | cd6416f79cd5 | cd6416f79cd5 |
| computeFixedLot | yes | yes | PASS | 9c3b7054bb0f | 9c3b7054bb0f |
| tf_getCompoundBaseBalanceForMonth | yes | yes | PASS | f7c1cab1c7f4 | f7c1cab1c7f4 |
| tf_recomputeBalancesSkippingDisabled | yes | yes | PASS | dd1dbd828cb7 | dd1dbd828cb7 |
| recomputeHistoryRows | yes | yes | DIFF | e8a53df215b4 | f37d5c1e2ab3 |
| updateEquityCurveFromRows | yes | yes | DIFF | 8934d9734b99 | f8abd6db4a61 |
| tf_updateStreakStateFixedLot | yes | yes | PASS | a1805e4a6f31 | a1805e4a6f31 |
| computeAndRenderDrawdownStats | yes | yes | PASS | 5cc61276dcb6 | 5cc61276dcb6 |

## Diffs

### recomputeHistoryRows
~~~diff
--- PC_REV379/recomputeHistoryRows
+++ MOBILE_REV372/recomputeHistoryRows
@@ -429,21 +429,6 @@
 if (!tbody)
 return;
 tbody.innerHTML = '';
-// REV364 performance: build the large History table off-DOM, then commit once.
-const tfHistoryRenderFragment = document.createDocumentFragment();
-try {
-const startBal = Number.isFinite(startingBalance) ? startingBalance : 0;
-const trStart = document.createElement('tr');
-trStart.className = 'tf-start-balance-row';
-const tdStart = document.createElement('td');
-tdStart.colSpan = Math.max(1, tf_getVisibleHistoryColumnKeys().length + 1);
-tdStart.className = 'mono';
-const sbLabel = (riskMode === 'compound') ? 'Start Balance Compounded' : 'Start Balance';
-tdStart.textContent = sbLabel + ' : ' + formatMoney(startBal);
-trStart.appendChild(tdStart);
-tfHistoryRenderFragment.appendChild(trStart);
-}
-catch (e) { }
 const rowsForDisplay = rows.slice().sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
 try {
 let __runEq = startingBalance;
@@ -480,12 +465,6 @@
 const priceBusy = tf_isMyfxbookPriceLoading();
 const rowsForUi = tf_getHistoryRowsForUiAndExport(rowsForDisplay);
 try {
-window.__tfHistoryDynamicTradeCount = Array.isArray(rowsForUi)
-? rowsForUi.filter((r) => !(r && r.isWithdraw)).length
-: 0;
-}
-catch (e) { window.__tfHistoryDynamicTradeCount = 0; }
-try {
 tf_lastVisibleHistoryRowIds = Array.isArray(rowsForUi) ? rowsForUi.map(r => tf_historyRowId(r)).filter(Boolean) : [];
 tf_lastEligibleHistoryRowIds = Array.isArray(rowsForUi)
 ? rowsForUi.filter(r => tf_isHistoryRowEligibleForAllToggle(r)).map(r => tf_historyRowId(r)).filter(Boolean)
@@ -510,7 +489,41 @@
 tf_renderAnalystPerformanceTablesFromRows(rowsForCalc);
 }
 catch (e) { }
-rowsForUi.forEach((row) => {
+tfMobileHistoryTotalRows = Array.isArray(rowsForUi) ? rowsForUi.length : 0;
+try { tf_applyHistoryColumnVisibility(); } catch (e) { }
+if (!Number.isFinite(tfMobileHistoryRenderLimit) || tfMobileHistoryRenderLimit < TF_MOBILE_HISTORY_CHUNK_SIZE) {
+  tfMobileHistoryRenderLimit = TF_MOBILE_HISTORY_CHUNK_SIZE;
+}
+if (tfMobileHistoryRenderLimit > tfMobileHistoryTotalRows && tfMobileHistoryTotalRows > 0) {
+  tfMobileHistoryRenderLimit = Math.max(TF_MOBILE_HISTORY_CHUNK_SIZE, tfMobileHistoryTotalRows);
+}
+
+tfMobileHistoryRowsCache = Array.isArray(rowsForUi) ? rowsForUi : [];
+tfMobileHistoryRenderedStart = Math.max(
+  0,
+  tfMobileHistoryTotalRows - Math.min(tfMobileHistoryRenderLimit, tfMobileHistoryTotalRows)
+);
+tfMobileHistoryRenderContext = {
+  startingBalance,
+  priceBusy,
+  riskMode
+};
+
+const tfMobileRowsForDom = Array.isArray(rowsForUi)
+  ? rowsForUi.slice(tfMobileHistoryRenderedStart)
+  : [];
+
+if (tfMobileHistoryRenderedStart === 0) {
+try {
+tbody.appendChild(tfMobileCreateHistoryStartRow(startingBalance, riskMode));
+}
+catch (e) { }
+}
+
+tfMobileRowsForDom.forEach((row) => {
+const tfFastRow = tfMobileCreateHistoryRow(row, startingBalance, priceBusy);
+tbody.appendChild(tfFastRow);
+return;
 const isWithdrawRow = !!(row && row.isWithdraw);
 const tr = document.createElement('tr');
 if (isWithdrawRow) {
@@ -691,9 +704,80 @@
 balanceCell.textContent = Number.isFinite(row.balancePnl) ? formatMoney(row.balancePnl) : formatMoney(startingBalance || 0);
 }
 tr.appendChild(balanceCell);
-tfHistoryRenderFragment.appendChild(tr);
+tbody.appendChild(tr);
 });
-tbody.appendChild(tfHistoryRenderFragment);
+
+// MOBILE V13: open on the newest trades at the bottom. Older chunks are
+// prepended only when needed, without recalculating Table 3 or the dashboard.
+try {
+  const historyScrollBox = tbody.closest('.table-scroll');
+
+  if (historyScrollBox) {
+    historyScrollBox.dataset.tfMobileTotalRows = String(tfMobileHistoryTotalRows || 0);
+    historyScrollBox.dataset.tfMobileRenderedStart = String(tfMobileHistoryRenderedStart || 0);
+
+    if (!historyScrollBox.__tfMobileHistoryScrollInstalled) {
+      historyScrollBox.__tfMobileHistoryScrollInstalled = true;
+
+      historyScrollBox.addEventListener('scroll', () => {
+        if (historyScrollBox.__tfMobileHistoryScrollRaf) return;
+        historyScrollBox.__tfMobileHistoryScrollRaf = requestAnimationFrame(() => {
+          historyScrollBox.__tfMobileHistoryScrollRaf = 0;
+          if (historyScrollBox.__tfMobileHistoryScrollBusy) return;
+          if (historyScrollBox.scrollTop > 140) return;
+          if (tfMobileHistoryRenderedStart <= 0) return;
+
+          const cachedRows = Array.isArray(tfMobileHistoryRowsCache)
+            ? tfMobileHistoryRowsCache
+            : [];
+          const oldStart = tfMobileHistoryRenderedStart;
+          const newStart = Math.max(0, oldStart - TF_MOBILE_HISTORY_CHUNK_SIZE);
+          if (newStart >= oldStart || !cachedRows.length) return;
+
+          historyScrollBox.__tfMobileHistoryScrollBusy = true;
+          const oldScrollHeight = historyScrollBox.scrollHeight;
+          const oldScrollTop = historyScrollBox.scrollTop;
+          const oldScrollLeft = historyScrollBox.scrollLeft;
+          const context = tfMobileHistoryRenderContext || {};
+          const fragment = document.createDocumentFragment();
+
+          try {
+            if (newStart === 0) {
+              fragment.appendChild(tfMobileCreateHistoryStartRow(
+                context.startingBalance,
+                context.riskMode
+              ));
+            }
+            for (let i = newStart; i < oldStart; i++) {
+              fragment.appendChild(tfMobileCreateHistoryRow(
+                cachedRows[i],
+                context.startingBalance,
+                context.priceBusy
+              ));
+            }
+            tbody.insertBefore(fragment, tbody.firstChild);
+            tfMobileHistoryRenderedStart = newStart;
+            tfMobileHistoryRenderLimit = tfMobileHistoryTotalRows - newStart;
+            historyScrollBox.dataset.tfMobileRenderedStart = String(newStart);
+            tf_applyHistoryColumnVisibility();
+          }
+          catch (e) { }
+
+          requestAnimationFrame(() => {
+            try {
+              const addedHeight = historyScrollBox.scrollHeight - oldScrollHeight;
+              historyScrollBox.scrollTop = oldScrollTop + Math.max(0, addedHeight);
+              historyScrollBox.scrollLeft = oldScrollLeft;
+            }
+            catch (e) { }
+            historyScrollBox.__tfMobileHistoryScrollBusy = false;
+          });
+        });
+      }, { passive: true });
+    }
+  }
+} catch (e) {}
+
 try {
 tf_applyHistoryColumnVisibility();
 requestAnimationFrame(() => tf_applyHistoryColumnVisibility());
~~~

### updateEquityCurveFromRows
~~~diff
--- PC_REV379/updateEquityCurveFromRows
+++ MOBILE_REV372/updateEquityCurveFromRows
@@ -159,7 +159,7 @@
 }
 if (emptyNote) {
 emptyNote.style.display = 'none';
-emptyNote.textContent = 'Belum ada data history untuk digambar. Tambahkan baris di Table 3 atau lakukan Scan dari extension.';
+emptyNote.textContent = 'Belum ada data history untuk digambar. Import data dari TF Multi-Analyst Desktop.';
 }
 let equity = equityMetric === 'usd' ? (currentBalance || 0) : 0;
 try {
~~~
