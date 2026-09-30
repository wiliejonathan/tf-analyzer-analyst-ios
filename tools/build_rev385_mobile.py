from pathlib import Path
import re, sys

root=Path(sys.argv[1])
jsf=root/'assets/dashboard-mobile.js'
s=jsf.read_text()

pat1=re.compile(r"function tf_getHoldingDurationMs\(row\) \{.*?\n\}\nfunction tf_renderHoldingPeriodTables",re.S)
helpers=r"""function tf_parseHistoryTableDateMs(value) {
try {
if (value === null || value === undefined) return null;
if (typeof value === 'number' && Number.isFinite(value) && value > 0) return value;
const raw=String(value||'').trim();
if(!raw)return null;
const wib=raw.replace(/\s*WIB\s*$/i,'').trim();
const m=wib.match(/^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
if(m){
const day=Number(m[1]),month=Number(m[2]),year=Number(m[3]),hour=Number(m[4]),minute=Number(m[5]),second=Number(m[6]||0);
if(month>=1&&month<=12&&day>=1&&day<=31&&hour>=0&&hour<=23&&minute>=0&&minute<=59&&second>=0&&second<=59){
const utcMs=Date.UTC(year,month-1,day,hour-7,minute,second,0);
if(Number.isFinite(utcMs))return utcMs;
}
}
const parsed=Date.parse(raw);
return Number.isFinite(parsed)?parsed:null;
}catch(e){return null;}
}
function tf_getHoldingDurationMs(row) {
try {
if(!row||row.isWithdraw)return null;
let created=tf_parseHistoryTableDateMs(row.createdDate);
let closed=tf_parseHistoryTableDateMs(row.displayDate);
if(!Number.isFinite(created)||created<=0)created=Number(row.createdSortKey);
if(!Number.isFinite(closed)||closed<=0)closed=Number(row.sortKey);
if(!Number.isFinite(created)||!Number.isFinite(closed)||created<=0||closed<=0)return null;
const diff=closed-created;
return Number.isFinite(diff)&&diff>=0?diff:null;
}catch(e){return null;}
}
function tf_formatHoldingDuration(ms) {
const raw=Number(ms);
if(!Number.isFinite(raw)||raw<0)return '—';
let totalMinutes=Math.round(raw/60000);
if(totalMinutes<=0)return '0m';
const days=Math.floor(totalMinutes/1440); totalMinutes-=days*1440;
const hours=Math.floor(totalMinutes/60); const minutes=totalMinutes-hours*60;
const parts=[]; if(days>0)parts.push(days+'d'); if(hours>0||days>0)parts.push(hours+'h'); parts.push(minutes+'m');
return parts.join(' ');
}
function tf_renderHoldingPeriodTables"""
s,n=pat1.subn(lambda _:helpers,s,count=1)
assert n==1,'holding helper block not found'

pat2=re.compile(r"function tf_renderHoldingPeriodTables\(allTickerRows, filteredRows\) \{.*?\n\}\nfunction recomputeHistoryRows\(\) \{",re.S)
render=r"""function tf_renderHoldingPeriodTables(tableRows) {
const leftBody=document.getElementById('tf-holding-body-left');
const rightBody=document.getElementById('tf-holding-body-right');
if(!leftBody||!rightBody)return;
const rows=Array.isArray(tableRows)?tableRows.filter(r=>r&&!r.isWithdraw):[];
function keyOf(row){const analyst=String(row&&row.analyst||'').trim();const pair=String(row&&row.pair||'').trim().toUpperCase();return analyst&&pair?analyst+' - '+pair:'';}
const names=Array.from(new Set(rows.map(keyOf).filter(Boolean))).sort((a,b)=>a.localeCompare(b,'id',{sensitivity:'base'}));
const maxBy=new Map(),avgAgg=new Map();
for(const row of rows){
const k=keyOf(row),ms=tf_getHoldingDurationMs(row); if(!k||ms===null)continue;
const prev=maxBy.get(k); if(!Number.isFinite(prev)||ms>prev)maxBy.set(k,ms);
let a=avgAgg.get(k); if(!a){a={sum:0,count:0};avgAgg.set(k,a);} a.sum+=ms;a.count++;
}
function renderSide(tbody,subset){
tbody.innerHTML='';
if(!subset.length){const tr=document.createElement('tr');tr.className='tf-holding-empty-row';const td=document.createElement('td');td.colSpan=3;td.textContent=names.length?'—':'Belum ada trade yang tampil di Table 3 untuk filter aktif.';tr.appendChild(td);tbody.appendChild(tr);return;}
subset.forEach(name=>{const tr=document.createElement('tr');const n=document.createElement('td');n.className='tf-holding-analyst';n.textContent=name;const m=document.createElement('td');m.className='mono tf-holding-value';m.textContent=tf_formatHoldingDuration(maxBy.get(name));const a=document.createElement('td');a.className='mono tf-holding-value';const g=avgAgg.get(name);a.textContent=g&&g.count?tf_formatHoldingDuration(g.sum/g.count):'—';tr.append(n,m,a);tbody.appendChild(tr);});
}
const splitAt=Math.ceil(names.length/2);renderSide(leftBody,names.slice(0,splitAt));renderSide(rightBody,names.slice(splitAt));
}
function recomputeHistoryRows() {"""
s,n=pat2.subn(lambda _:render,s,count=1)
assert n==1,'holding renderer not found'

old="""const tf_holdingAllTickerRows = baseRows.slice();
try {
baseRows = tf_filterRowsByTradeTimeRange(baseRows, maxMonthIdx);
}
catch (e) { }
try {
const tf_holdingFilteredRows = tf_filterRowsByUnifiedDate(baseRows);
tf_renderHoldingPeriodTables(tf_holdingAllTickerRows, tf_holdingFilteredRows);
}
catch (e) { }"""
new="""try {
baseRows = tf_filterRowsByTradeTimeRange(baseRows, maxMonthIdx);
}
catch (e) { }"""
assert old in s
s=s.replace(old,new,1)
anchor="const rowsForUi = tf_getHistoryRowsForUiAndExport(rowsForDisplay);"
assert anchor in s
s=s.replace(anchor,anchor+"\ntry {\ntf_renderHoldingPeriodTables(rowsForUi);\n}\ncatch (e) { }",1)

oldnote="""    <strong>Max</strong> = holding period terlama dari seluruh trade yang masih termasuk ticker/analis-pair aktif.\\n    <strong>Avg.</strong> = rata-rata holding period dalam filter aktif (Time Range / Time Range per Month / Filter Tanggal)."""
newnote="""    <strong>Max</strong> dan <strong>Avg.</strong> dihitung langsung dari trade yang tampil di <strong>Table 3</strong> untuk filter aktif.\\n    Rumus setiap trade: <strong>Closed At − Created At</strong> dari kolom tanggal Table 3 (Time Range / Time Range per Month / Filter Tanggal / Nama Analis - Pair)."""
if oldnote in s:
    s=s.replace(oldnote,newnote,1)
jsf.write_text(s)

for name in ['index.html','service-worker.js','mobile-license-gate.js']:
    p=root/name
    c=p.read_text()
    c=c.replace('rev=384','rev=385').replace('REV384','REV385').replace('rev384','rev385')
    if name=='service-worker.js':
        c=c.replace('tf-analyzer-analyst-mobile-v154-rev385-holding-alignment-fix','tf-analyzer-analyst-mobile-v155-rev385-holding-table3-source-fix')
    p.write_text(c)

upd=root/'mobile-force-update.js'
c=upd.read_text()
assert "var CURRENT_TAG = 'v1.16.97';" in c
upd.write_text(c.replace("var CURRENT_TAG = 'v1.16.97';","var CURRENT_TAG = 'v1.16.98';",1))

(root/'README_REV385.md').write_text("""# REV385 Mobile
Holding Period is calculated from final Table 3 rows and the Table 3 Created At / Closed At labels.
Version: v1.16.98 / REV385.
""")
print('mobile REV385 patched')
