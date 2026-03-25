import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/* ───────── STYLE PREMIUM ───────── */

const CSS = `

@import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700;800&display=swap');

.casement-root{
font-family:'Epilogue',sans-serif;
background:#f8faf9;
min-height:100vh;
padding:25px;
}

.casement-header{
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:30px;
flex-wrap:wrap;
gap:15px;
}

.casement-title{
font-size:26px;
font-weight:800;
color:#14532d;
}

.casement-sub{
font-size:13px;
color:#6b7280;
}

.btn-export{
background:#166534;
color:white;
border:none;
padding:10px 18px;
border-radius:10px;
font-weight:700;
cursor:pointer;
transition:0.2s;
display:inline-flex;
align-items:center;
gap:7px;
}

.btn-export:hover{
background:#15803d;
}

.btn-pdf{
background:#1d4ed8;
color:white;
border:none;
padding:10px 18px;
border-radius:10px;
font-weight:700;
cursor:pointer;
transition:0.2s;
display:inline-flex;
align-items:center;
gap:7px;
}

.btn-pdf:hover{
background:#1e40af;
}

.kpi-grid{
display:grid;
grid-template-columns:repeat(auto-fill,minmax(180px,1fr));
gap:16px;
margin-bottom:30px;
}

.kpi-card{
background:white;
border-radius:16px;
padding:20px;
border:1px solid #bbf7d0;
box-shadow:0 6px 20px rgba(0,0,0,0.05);
transition:0.25s;
}

.kpi-card:hover{
transform:translateY(-4px);
box-shadow:0 10px 30px rgba(0,0,0,0.08);
}

.kpi-label{
font-size:11px;
letter-spacing:.1em;
text-transform:uppercase;
color:#9ca3af;
margin-bottom:6px;
}

.kpi-value{
font-size:28px;
font-weight:800;
color:#15803d;
}

.section-title{
font-size:12px;
letter-spacing:.15em;
text-transform:uppercase;
font-weight:700;
color:#16a34a;
margin:30px 0 12px;
display:flex;
align-items:center;
gap:10px;
}

.section-title:after{
content:"";
flex:1;
height:1px;
background:#bbf7d0;
}

.card{
background:white;
border-radius:16px;
padding:22px;
border:1px solid #bbf7d0;
margin-bottom:20px;
}

.table{
width:100%;
border-collapse:collapse;
font-size:13px;
}

.table thead{
background:#15803d;
color:white;
}

.table th{
padding:12px;
font-size:11px;
text-transform:uppercase;
}

.table td{
padding:10px;
border-bottom:1px solid #f0fdf4;
}

.table tr:hover{
background:#f0fdf4;
}

.progress{
height:8px;
background:#f3f4f6;
border-radius:999px;
overflow:hidden;
}

.progress-bar{
height:100%;
background:#16a34a;
transition:width .8s;
}

.empty{
text-align:center;
padding:40px;
color:#9ca3af;
}

`;

/* ───────── COMPONENT ───────── */

function RapportCasement(){

const casements = useSelector(state=>state.casement?.list || []);

/* KPI CALCUL */

const totalVolume = useMemo(()=>casements.reduce((s,c)=>s+Number(c.volume_saute||0),0),[casements]);
const totalTemps  = useMemo(()=>casements.reduce((s,c)=>s+Number(c.temps||0),0),[casements]);
const totalHTP    = useMemo(()=>casements.reduce((s,c)=>s+Number(c.htp||0),0),[casements]);

const rendement   = totalTemps>0 ? (totalVolume/totalTemps).toFixed(2) : 0;

const nbMarche    = useMemo(()=>casements.filter(c=>c.etatMachine==="marche").length,[casements]);
const txDispo     = casements.length>0 ? ((nbMarche/casements.length)*100).toFixed(1) : 0;

// Moyennes OEE / TU / TD (depuis les valeurs sauvegardées)
const moyOEE = useMemo(()=>{
  const ops = casements.filter(c=>Number(c.oee||0)>0);
  return ops.length>0 ? (ops.reduce((s,c)=>s+Number(c.oee),0)/ops.length).toFixed(1) : 0;
},[casements]);
const moyTU = useMemo(()=>{
  const ops = casements.filter(c=>Number(c.tu||0)>0);
  return ops.length>0 ? (ops.reduce((s,c)=>s+Number(c.tu),0)/ops.length).toFixed(1) : 0;
},[casements]);
const moyTD = useMemo(()=>{
  const ops = casements.filter(c=>Number(c.td||0)>0);
  return ops.length>0 ? (ops.reduce((s,c)=>s+Number(c.td),0)/ops.length).toFixed(1) : 0;
},[casements]);

/* GROUP BY MONTH */

const MONTHS=["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

const monthlyStats = useMemo(()=>{
  const map={};
  casements.forEach(c=>{
    if(!c.date) return;
    const m=MONTHS[new Date(c.date).getMonth()];
    if(!map[m]) map[m]={volume:0,temps:0,htp:0,ops:0,oee:0,tu:0,td:0,oeeCount:0};
    map[m].volume += Number(c.volume_saute||0);
    map[m].temps  += Number(c.temps||0);
    map[m].htp    += Number(c.htp||0);
    map[m].ops    += 1;
    if(Number(c.oee||0)>0){ map[m].oee+=Number(c.oee); map[m].tu+=Number(c.tu||0); map[m].td+=Number(c.td||0); map[m].oeeCount+=1; }
  });
  return map;
},[casements]);


/* EXPORT EXCEL */

const exportRapport=()=>{
  const wb=XLSX.utils.book_new();

  const resume=[
    ["Rapport Casement"],
    [],
    ["Indicateur","Valeur","Unité"],
    ["Volume Total",     totalVolume,  "m²"],
    ["HTP Total",        totalHTP,     "h"],
    ["Heures de marche",   totalTemps,   "h"],
    ["Rendement Moyen",  rendement,    "m²/h"],
    ["Disponibilité",    txDispo,      "%"],
    ["OEE Moyen",        moyOEE,       "%"],
    ["TU Moyen",         moyTU,        "%"],
    ["TD Moyen",         moyTD,        "%"],
  ];
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(resume),"Résumé");

  const mensuel=[
    ["Mois","Opérations","Volume (m²)","HTP (h)","Heures","Rendement","OEE moy %","TU moy %","TD moy %"],
    ...Object.entries(monthlyStats).map(([m,d])=>[
      m, d.ops, d.volume, d.htp.toFixed(2), d.temps,
      d.temps>0?(d.volume/d.temps).toFixed(2):0,
      d.oeeCount>0?(d.oee/d.oeeCount).toFixed(1):0,
      d.oeeCount>0?(d.tu/d.oeeCount).toFixed(1):0,
      d.oeeCount>0?(d.td/d.oeeCount).toFixed(1):0,
    ])
  ];
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(mensuel),"Mensuel");

  saveAs(
    new Blob([XLSX.write(wb,{bookType:"xlsx",type:"array"})],
    {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),
    "rapport_casement.xlsx"
  );
};

/* EXPORT PDF */

const exportPDF=()=>{
  const doc = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
  const W = doc.internal.pageSize.width;
  const now = new Date().toLocaleDateString("fr-MA",{year:"numeric",month:"long",day:"numeric"});

  // ── En-tête ──
  doc.setFillColor(20, 83, 45);
  doc.rect(0, 0, W, 30, "F");
  doc.setFillColor(22, 163, 74);
  doc.rect(0, 27, W, 3, "F");

  doc.setTextColor(255,255,255);
  doc.setFontSize(18); doc.setFont("helvetica","bold");
  doc.text("Rapport Casement", 14, 16);
  doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text(`Synthèse des opérations de décapage  ·  ${now}`, 14, 24);
  doc.text(`opération(s) enregistrée(s)`, W-14, 24, {align:"right"});

  // ── KPI Résumé ──
  doc.setTextColor(22,163,74);
  doc.setFontSize(9); doc.setFont("helvetica","bold");
  doc.text("INDICATEURS GLOBAUX", 14, 42);
  doc.setDrawColor(187,247,208); doc.setLineWidth(0.4);
  doc.line(14, 44, W-14, 44);

  const kpiData = [
    ["Volume Total",    `${totalVolume} m²`],
    ["HTP Total",       `${totalHTP.toFixed(2)} h`],
    ["Heures de marche",  `${totalTemps} h`],
    ["Rendement Moyen", `${rendement} m²/h`],
    ["Disponibilité",   `${txDispo} %`],
    ["OEE Moyen",       `${moyOEE} %`],
    ["TU Moyen",        `${moyTU} %`],
    ["TD Moyen",        `${moyTD} %`],
  ];

  // Affichage en 2 colonnes
  const colW = (W - 28) / 2;
  kpiData.forEach(([label,val], i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = 14 + col * (colW + 4);
    const y = 52 + row * 12;
    doc.setFillColor(col === 0 ? 240 : 248, 253, 244);
    doc.roundedRect(x, y-5, colW, 10, 2, 2, "F");
    doc.setTextColor(107,114,128); doc.setFontSize(8); doc.setFont("helvetica","normal");
    doc.text(label, x+4, y);
    doc.setTextColor(20,83,45); doc.setFontSize(11); doc.setFont("helvetica","bold");
    doc.text(val, x+colW-4, y, {align:"right"});
  });

  let curY = 52 + Math.ceil(kpiData.length/2)*12 + 10;

  // ── Tableau mensuel ──
  if(Object.keys(monthlyStats).length > 0){
    doc.setTextColor(22,163,74);
    doc.setFontSize(9); doc.setFont("helvetica","bold");
    doc.text("RAPPORT MENSUEL", 14, curY);
    doc.line(14, curY+2, W-14, curY+2);

    autoTable(doc, {
      startY: curY+6,
      head: [["Mois","Ops","Volume (m²)","HTP (h)","Heures","Rendement","OEE %","TU %","TD %"]],
      body: Object.entries(monthlyStats).map(([m,d])=>[
        m, d.ops, d.volume,
        d.htp.toFixed(2), d.temps,
        d.temps>0?(d.volume/d.temps).toFixed(2):"—",
        d.oeeCount>0?(d.oee/d.oeeCount).toFixed(1):"—",
        d.oeeCount>0?(d.tu/d.oeeCount).toFixed(1):"—",
        d.oeeCount>0?(d.td/d.oeeCount).toFixed(1):"—",
      ]),
      styles:      { fontSize:8.5, cellPadding:3.5, font:"helvetica" },
      headStyles:  { fillColor:[20,83,45], textColor:255, fontStyle:"bold", fontSize:8 },
      alternateRowStyles: { fillColor:[240,253,244] },
      columnStyles:{ 0:{fontStyle:"bold"} },
      margin:      { left:14, right:14 },
    });
    curY = doc.lastAutoTable.finalY + 10;
  }

  // ── Tableau détail par opération ──
  if(casements.length > 0){
    // Nouvelle page si pas assez de place
    if(curY > 220) { doc.addPage(); curY = 20; }
    doc.setTextColor(22,163,74);
    doc.setFontSize(9); doc.setFont("helvetica","bold");
    doc.text("DÉTAIL DES OPÉRATIONS", 14, curY);
    doc.line(14, curY+2, W-14, curY+2);

    autoTable(doc, {
      startY: curY+6,
      head: [["Date","Panneau","Conducteur","Volume","HTP","OEE%","TU%","TD%","État"]],
      body: casements.map(c=>[
        c.date||"",
        c.panneau||"",
        c.conducteur||"",
        `${c.volume_saute||0} m²`,
        `${Number(c.htp||0).toFixed(2)} h`,
        c.oee ? `${c.oee}%` : "—",
        c.tu  ? `${c.tu}%`  : "—",
        c.td  ? `${c.td}%`  : "—",
        c.etatMachine==="marche" ? "En marche" : "En arrêt",
      ]),
      styles:      { fontSize:8, cellPadding:3, font:"helvetica" },
      headStyles:  { fillColor:[20,83,45], textColor:255, fontStyle:"bold", fontSize:8 },
      alternateRowStyles: { fillColor:[240,253,244] },
      columnStyles:{ 8:{ cellWidth:20 } },
      margin:      { left:14, right:14 },
    });
  }

  // ── Pied de page ──
  const pages = doc.getNumberOfPages();
  for(let i=1; i<=pages; i++){
    doc.setPage(i);
    doc.setFontSize(8); doc.setTextColor(156,163,175);
    doc.text(`Page ${i} / ${pages}`, 14, 290);
    doc.text("Casement — Rapport de synthèse", W-14, 290, {align:"right"});
    doc.setDrawColor(187,247,208); doc.setLineWidth(0.3);
    doc.line(14, 286, W-14, 286);
  }

  doc.save("rapport_casement.pdf");
};

/* KPI LIST */

const kpis=[
  {label:"Volume Total",    value:`${totalVolume} m²`},
  {label:"HTP Total",       value:`${totalHTP.toFixed(2)} h`},
  {label:"Rendement Moyen", value:`${rendement} m²/h`},
  {label:"Heures de marche",  value:`${totalTemps} h`},
  {label:"Disponibilité",   value:`${txDispo} %`},
  {label:"OEE Moyen",       value:`${moyOEE} %`},
  {label:"TU Moyen",        value:`${moyTU} %`},
  {label:"TD Moyen",        value:`${moyTD} %`},
];

/* RENDER */

return(

<>
<style>{CSS}</style>

<div className="casement-root">

{/* HEADER */}

<div className="casement-header">

<div>

<div className="casement-title">
Rapport Casement 
</div>

<div className="casement-sub">
Synthèse des opérations de casement
</div>

</div>

<div style={{display:"flex",gap:10,alignItems:"center"}}>

<button className="btn-pdf" onClick={exportPDF}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
  Télécharger PDF
</button>

<button className="btn-export" onClick={exportRapport}>
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
  Télécharger Excel
</button>

</div>

</div>

{/* KPI */}

<div className="kpi-grid">

{kpis.map((k,i)=>(

<div key={i} className="kpi-card">

<div className="kpi-label">
{k.label}
</div>

<div className="kpi-value">
{k.value}
</div>

</div>

))}

</div>

{/* MONTHLY */}

<div className="section-title">
Rapport Mensuel
</div>

<div className="card">

{Object.keys(monthlyStats).length>0 ? (

<table className="table">

<thead>
<tr>
<th>Mois</th>
<th>Opérations</th>
<th>Volume (m²)</th>
<th>HTP (h)</th>
<th>Heures</th>
<th>Rendement</th>
<th>OEE %</th>
<th>TU %</th>
<th>TD %</th>
</tr>
</thead>

<tbody>

{Object.entries(monthlyStats).map(([m,d])=>(

<tr key={m}>
<td><b>{m}</b></td>
<td>{d.ops}</td>
<td><b>{d.volume}</b> m²</td>
<td>{d.htp.toFixed(2)}</td>
<td>{d.temps}</td>
<td><b>{d.temps>0?(d.volume/d.temps).toFixed(2):0}</b> m²/h</td>
<td style={{color:"#1d4ed8",fontWeight:700}}>{d.oeeCount>0?(d.oee/d.oeeCount).toFixed(1):"—"}{d.oeeCount>0?"%":""}</td>
<td style={{color:"#b45309",fontWeight:700}}>{d.oeeCount>0?(d.tu/d.oeeCount).toFixed(1):"—"}{d.oeeCount>0?"%":""}</td>
<td style={{color:"#6d28d9",fontWeight:700}}>{d.oeeCount>0?(d.td/d.oeeCount).toFixed(1):"—"}{d.oeeCount>0?"%":""}</td>
</tr>

))}

</tbody>

</table>

):(

<div className="empty">
Aucune donnée disponible
</div>

)}

</div>





{casements.length===0 && (

<div className="empty">

<div style={{fontSize:50}}>📋</div>
<div>Aucune opération enregistrée</div>

</div>

)}

</div>

</>

);

}

export default RapportCasement;