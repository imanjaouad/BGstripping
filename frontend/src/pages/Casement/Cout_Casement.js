import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";
import "../../components/animations.css";
import UseAuth from "../../components/UseAuth";
// ── SVG icons ────────────────────────────────────────────────────────────────
const IcoMoney    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
const IcoCalc     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/></svg>;
const IcoChart    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const IcoCalendar = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IcoFilter   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
const IcoTrash    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>;

// ── Design tokens (aligned with Dashboard) ──────────────────────────────────
const DASH_FONT = "'Plus Jakarta Sans', sans-serif";
const DASH_MONO = "'DM Mono', monospace";

Chart.register(...registerables);

const MONTHS_NAMES = [
  "Janvier","Février","Mars","Avril","Mai","Juin",
  "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
];

function fmt(n) {
  return Number(n).toLocaleString("fr-MA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getColor(pct) {
  if (pct > 40) return "#EF4444";
  if (pct > 20) return "#F59E0B";
  return "#16A34A";
}

// ── KPI Card (identique Poussage) ────────────────────────────────────────────
function KpiCard({ label, value, unit, gold=false, delay="0s", icon }) {
  const accent = gold ? "#F59E0B" : "#16A34A";
  const bgIcon = gold ? "linear-gradient(145deg,#fffbeb,#fef3c7)" : "linear-gradient(145deg,#f0fdf4,#dcfce7)";
  const borderIcon = gold ? "rgba(245,158,11,0.5)" : "rgba(134,239,172,0.7)";
  const haloIcon = gold ? "rgba(245,158,11,0.15)" : "rgba(220,252,231,0.5)";
  return (
    <div
      className="kpi-card"
      style={{
        flex:1, minWidth:170, position:"relative",
        animation:`countUp .6s ${delay} ease both`,
        borderLeft:`4px solid ${accent}`,
        cursor:"default",
        transition:"transform .2s, box-shadow .2s",
      }}
      onMouseEnter={e=>{
        e.currentTarget.style.transform="translateY(-4px)";
        e.currentTarget.style.boxShadow=`0 14px 40px rgba(22,163,74,0.22)`;
        const ico = e.currentTarget.querySelector(".kpi-ico-wrap");
        if(ico){ ico.style.transform="scale(1.12) rotate(-4deg)"; ico.style.boxShadow=`0 8px 22px ${gold?"rgba(245,158,11,0.3)":"rgba(22,163,74,0.28)"}`; }
      }}
      onMouseLeave={e=>{
        e.currentTarget.style.transform="translateY(0)";
        e.currentTarget.style.boxShadow="0 8px 32px rgba(22,163,74,0.18)";
        const ico = e.currentTarget.querySelector(".kpi-ico-wrap");
        if(ico){ ico.style.transform="scale(1) rotate(0deg)"; ico.style.boxShadow=`0 4px 14px ${haloIcon}`; }
      }}
    >
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",
        background:gold?"rgba(245,158,11,0.06)":"rgba(22,163,74,0.06)"}}/>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
        <div className="kpi-ico-wrap" style={{
          width:42, height:42, borderRadius:12,
          background:bgIcon,
          border:`1.5px solid ${borderIcon}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:accent,
          boxShadow:`0 0 0 5px ${haloIcon}, 0 4px 14px ${haloIcon}`,
          transition:"transform .3s cubic-bezier(0.16,1,0.3,1), box-shadow .3s ease",
          flexShrink:0,
        }}>
          {icon}
        </div>
        <div className="kpi-label">{label}</div>
      </div>
      <div className="kpi-value" style={{color:accent}}>
        {value}
        {unit&&<span className="kpi-unit">{unit}</span>}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
function CoutCasement() {

  // Données depuis Redux casement
  const casements = useSelector((state) =>
    state.casement?.list ?? []
  );
const { isAdmin } = UseAuth();
  const [coupCost,      setCoupCost]      = useState("");   // coût par coup 
  const [annualCost,    setAnnualCost]    = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  // Persistance localStorage
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("cout-casement-history");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cout-casement-history", JSON.stringify(history));
  }, [history]);

  const chartRef      = useRef(null);
  const chartInstance = useRef(null);

  // Mois disponibles depuis Redux
  const availableMonths = useMemo(() => {
    const set = new Set();
    casements.forEach((c) => {
      if (!c.date) return;
      const idx = new Date(c.date).getMonth();
      if (!isNaN(idx)) set.add(MONTHS_NAMES[idx]);
    });
    return Array.from(set);
  }, [casements]);

  // Total coups  pour le mois sélectionné
  const totalCoupsForMonth = useMemo(() => {
    if (!selectedMonth) return 0;
    return casements
      .filter(c => {
        if (!c.date) return false;
        const idx = new Date(c.date).getMonth();
        return MONTHS_NAMES[idx] === selectedMonth;
      })
      .reduce((s, c) => s + Number(c.nombreCoups || 0), 0);
  }, [casements, selectedMonth]);

  // Calcul : (coût/coup × nb coups du mois) + quote-part annuelle
  const calculateBudget = () => {
    if (!coupCost || !annualCost || !selectedMonth) return;
    const cout  = Number(coupCost) * totalCoupsForMonth;
    const coutPart = Number(annualCost) / 12;
    const cost     = cout + coutPart;
    const newEntry = {
      month:      selectedMonth,
      cost,
      coupCost:   Number(coupCost),
      annualCost: Number(annualCost),
      totalCoups: totalCoupsForMonth,
      cout,
      createdAt:  new Date().toLocaleDateString("fr-MA"),
    };
    setHistory(prev => [...prev, newEntry]);
    resetForm();
  };

  const resetForm = () => {
    setCoupCost(""); setAnnualCost(""); setSelectedMonth("");
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("cout-casement-history");
  };

  const removeEntry = (i) => setHistory(prev => prev.filter((_,idx)=>idx!==i));

  const totalCost = history.reduce((s,h)=>s+h.cost,0);

  // Chart.js
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstance.current) { chartInstance.current.destroy(); chartInstance.current=null; }
    if (history.length===0) return;
    const ctx = chartRef.current.getContext("2d");
    const percents = history.map(h=>totalCost>0?parseFloat(((h.cost/totalCost)*100).toFixed(1)):0);

    chartInstance.current = new Chart(ctx, {
      type:"bar",
      data:{
        labels:history.map(h=>h.month),
        datasets:[{
          type:"bar",
          label:"% Répartition Budget",
          data:percents,
          backgroundColor:percents.map(p=>{
            const c=getColor(p);
            return c==="#16A34A"?"rgba(22,163,74,0.75)":c==="#F59E0B"?"rgba(245,158,11,0.75)":"rgba(239,68,68,0.75)";
          }),
          borderColor:percents.map(p=>getColor(p)),
          borderWidth:2, borderRadius:8, borderSkipped:false,
        }],
      },
      options:{
        responsive:true, maintainAspectRatio:false,
        plugins:{
          legend:{labels:{font:{family:"Plus Jakarta Sans,sans-serif",size:13},color:"#374151"}},
          tooltip:{callbacks:{label:(ctx)=>{
            const h=history[ctx.dataIndex];
            return[
              ` % Budget      : ${ctx.parsed.y}%`,
              ` Coût calculé  : ${fmt(h.cost)} MAD`,
              ` Coût/coup  : ${fmt(h.coupCost)} MAD`,
              ` Budget annuel : ${fmt(h.annualCost)} MAD`,
            ];
          }}},
        },
        scales:{
          x:{grid:{display:false},ticks:{font:{family:"Plus Jakarta Sans,sans-serif",size:12},color:"#6B7280"}},
          y:{grid:{color:"rgba(22,163,74,0.07)"},ticks:{callback:v=>v+"%",font:{family:"Plus Jakarta Sans,sans-serif",size:11},color:"#6B7280"},beginAtZero:true},
        },
      },
    });
    return()=>{if(chartInstance.current){chartInstance.current.destroy();chartInstance.current=null;}};
  },[history,totalCost]);

  const inputStyle = {
    border:"1.5px solid #bbf7d0", borderRadius:10, padding:"11px 14px",
    fontFamily:DASH_FONT, fontSize:13, outline:"none",
    background:"#fff", color:"#111827", width:"100%",
    transition:"border-color .22s,box-shadow .22s",
    boxShadow:"0 1px 3px rgba(20,83,45,0.04),inset 0 1px 0 rgba(255,255,255,0.8)",
  };
  const labelStyle = {
    fontSize:10, fontWeight:700, color:"#9ca3af",
    letterSpacing:".12em", textTransform:"uppercase",
    marginBottom:6, display:"block",
    fontFamily:DASH_MONO,
  };

  return (
    <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
      @keyframes acc-fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      @keyframes acc-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
      @keyframes acc-stripe  { from{background-position:0%} to{background-position:200%} }
      .cout-table { width:100%; border-collapse:collapse; font-size:13px; font-family:'Plus Jakarta Sans',sans-serif; }
      .cout-table thead tr { background:#15803d; }
      .cout-table th { padding:11px 13px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:#fff; white-space:nowrap; font-family:'DM Mono',monospace; }
      .cout-table tbody tr { border-bottom:1px solid #f0fdf4; transition:background .15s; }
      .cout-table tbody tr:hover { background:#f0fdf4; }
      .cout-table tbody tr:last-child { border-bottom:none; }
      .cout-table td { padding:10px 13px; color:#374151; vertical-align:middle; white-space:nowrap; }
      .cout-badge-green { background:#dcfce7;color:#15803d;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600; }
      .cout-badge-amber { background:#fef3c7;color:#92400e;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600; }
      .cout-badge-red   { background:#fee2e2;color:#b91c1c;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600; }
      .cout-del-btn { display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:8px;border:1.5px solid #fecaca;background:rgba(239,68,68,0.06);color:#dc2626;cursor:pointer;transition:all .18s; }
      .cout-del-btn:hover { background:#ef4444;color:#fff;border-color:#ef4444; }
    `}</style>
    <div style={{
      padding:"32px 28px 60px", overflowY:"auto",
      background:"#f0fdf4",
      minHeight:"100vh",
      fontFamily:DASH_FONT,
      color:"#14532d",
      position:"relative",
    }}>

      {/* ── Page Header (Dashboard-style hero card) ───────────────────── */}
      <div style={{
        background:"#fff", border:"1.5px solid #bbf7d0", borderRadius:20,
        padding:"28px 32px", marginBottom:24,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"relative", overflow:"hidden",
        animation:"acc-fadeUp .7s cubic-bezier(0.16,1,0.3,1) .05s both",
        boxShadow:"0 4px 24px rgba(22,163,74,0.07)",
      }}>
        {/* Stripe top */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:4,
          background:"linear-gradient(90deg,#14532d,#16a34a,#10b981,#16a34a,#14532d)",
          backgroundSize:"200% 100%",animation:"acc-stripe 4s linear infinite"}}/>
        <div>
          <div style={{fontFamily:DASH_MONO,fontSize:10,fontWeight:700,
            letterSpacing:".22em",textTransform:"uppercase",color:"#16a34a",
            display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <span style={{display:"inline-block",width:28,height:1.5,
              background:"linear-gradient(90deg,#16a34a,transparent)"}}/>
            Module Casement
          </div>
          <h1 style={{
            margin:0, fontSize:"clamp(1.6rem,3vw,2.2rem)", fontWeight:800,
            color:"#14532d", lineHeight:1.1, fontFamily:DASH_FONT,
          }}>
            Gestion des{" "}
            <span style={{background:"linear-gradient(135deg,#16a34a,#10b981)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Coûts
            </span>
          </h1>
          <p style={{margin:"6px 0 0",fontSize:14,color:"#6b7280",fontFamily:DASH_FONT}}>
            Suivi budgétaire par coup — calcul mensuel et répartition annuelle.
          </p>
        </div>
        <div style={{
          width:56,height:56,borderRadius:16,flexShrink:0,
          background:"linear-gradient(145deg,#f0fdf4,#dcfce7)",
          border:"1.5px solid rgba(134,239,172,0.7)",
          display:"flex",alignItems:"center",justifyContent:"center",
          color:"#16a34a",
          boxShadow:"0 0 0 6px rgba(220,252,231,0.4),0 6px 20px rgba(22,163,74,0.15)",
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
          </svg>
        </div>
      </div>

      {/* ── Bandeau mois disponibles ─────────────────────────────────────── */}
      <div style={{
        background:"white", borderRadius:14, padding:"14px 20px",
        marginBottom:24, border:"1px solid rgba(22,163,74,0.15)",
        boxShadow:"0 4px 16px rgba(22,163,74,0.08)",
        display:"flex", alignItems:"center", gap:14,
        animation:"fadeSlideDown .4s ease both",
      }}>
        <div style={{
          width:44, height:44, borderRadius:12, flexShrink:0,
          background:"linear-gradient(145deg,#f0fdf4,#dcfce7)",
          border:"1.5px solid rgba(134,239,172,0.7)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#16A34A",
          boxShadow:"0 0 0 5px rgba(220,252,231,0.45), 0 4px 14px rgba(22,163,74,0.12)",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <div style={{flex:1}}>
          <div style={{fontFamily:DASH_FONT,fontWeight:700,color:"#14532d",fontSize:"1rem"}}>
            {availableMonths.length>0
              ?`${availableMonths.length} mois disponible(s) dans les données`
              :"Aucune donnée — enregistrez d'abord des opérations dans Dashboard"}
          </div>
          <div style={{fontSize:12,color:"#9ca3af",marginTop:4,fontFamily:DASH_FONT}}>
            {availableMonths.length>0
              ?availableMonths.join("  •  ")
              :"Les mois apparaîtront automatiquement après saisie"}
          </div>
        </div>

      </div>



      {/* ── Form Card ───────────────────────────────────────────────────── */}
      <div style={{
        background:"#fff", border:"1.5px solid #bbf7d0", borderRadius:20,
        padding:"28px 28px", marginBottom:24,
        position:"relative", overflow:"hidden",
        boxShadow:"0 4px 24px rgba(22,163,74,0.07)",
        animation:"acc-fadeUp .55s cubic-bezier(0.16,1,0.3,1) .15s both",
      }}>
        {/* shimmer bar */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:3,
          background:"linear-gradient(90deg,#16a34a,#4ade80,#16a34a)",
          backgroundSize:"200%",animation:"acc-shimmer 2.4s linear infinite"}}/>
        <div className="form-section-title" style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,borderRadius:9,background:"linear-gradient(145deg,#f0fdf4,#dcfce7)",border:"1.5px solid rgba(134,239,172,0.7)",display:"flex",alignItems:"center",justifyContent:"center",color:"#16A34A",boxShadow:"0 0 0 4px rgba(220,252,231,0.4)"}}>
            <IcoCalc/>
          </div>
          Paramètres de Calcul
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>

          {/* Coût / coup  */}
          <div>
            <label style={labelStyle}>Coût par Mètre Carré (MAD)</label>
            <div style={{position:"relative"}}>
              <input type="number" value={coupCost} min="0" step="0.01"
                placeholder="0.00"
                onChange={e=>setCoupCost(e.target.value)}
                style={{...inputStyle,paddingRight:75}}
                className="form-control"
                onFocus={e=>{e.target.style.borderColor="#16A34A";e.target.style.boxShadow="0 0 0 4px rgba(22,163,74,0.08)";}}
                onBlur={e=>{e.target.style.borderColor="#E5E7EB";e.target.style.boxShadow="none";}}
                disabled={!isAdmin}
              />
              <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:".82rem",fontWeight:600,color:"#9CA3AF"}}>
                MAD
              </span>
            </div>
          </div>

          {/* Budget Annuel */}
          <div>
            <label style={labelStyle}>Anticipation du Coût Annuel (MAD)</label>
            <div style={{position:"relative"}}>
              <input type="number" value={annualCost} min="0" step="0.01"
                placeholder="0.00"
                onChange={e=>setAnnualCost(e.target.value)}
                style={{...inputStyle,paddingRight:56}}
                className="form-control"
                onFocus={e=>{e.target.style.borderColor="#16A34A";e.target.style.boxShadow="0 0 0 4px rgba(22,163,74,0.08)";}}
                onBlur={e=>{e.target.style.borderColor="#E5E7EB";e.target.style.boxShadow="none";}}
                disabled={!isAdmin}
              />
              <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:".82rem",fontWeight:600,color:"#9CA3AF"}}>
                MAD
              </span>
            </div>
          </div>

          {/* Sélecteur mois */}
          <div>
            <label style={labelStyle}>
              <span style={{color:"#16A34A",display:"inline-flex"}}><IcoFilter/></span> Mois
            </label>
            <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}
              className="form-select" style={inputStyle}
              onFocus={e=>{e.target.style.borderColor="#16A34A";e.target.style.boxShadow="0 0 0 4px rgba(22,163,74,0.08)";}}
              onBlur={e=>{e.target.style.borderColor="#E5E7EB";e.target.style.boxShadow="none";}}
              disabled={!isAdmin}
            >
              <option value="">Sélectionner un mois</option>
              {availableMonths.map((m,i)=><option key={i} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Boutons */}
        {isAdmin && (
        <div style={{display:"flex",gap:12,marginTop:20,flexWrap:"wrap"}}>
          <button onClick={calculateBudget}
            disabled={!coupCost||!annualCost||!selectedMonth}
            style={{
              display:"inline-flex",alignItems:"center",gap:8,
              padding:"12px 24px",borderRadius:12,border:"none",
              background:"linear-gradient(135deg,#15803d,#16a34a)",color:"#fff",
              fontFamily:DASH_FONT,fontSize:14,fontWeight:700,cursor:"pointer",
              opacity:(!coupCost||!annualCost||!selectedMonth)?0.5:1,
              boxShadow:"0 4px 14px rgba(22,163,74,0.3)",
              transition:"all .2s",
            }}
            onMouseEnter={e=>{if(coupCost&&annualCost&&selectedMonth)e.currentTarget.style.transform="translateY(-2px)";}}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
          >
            <IcoCalc/> Calculer
          </button>
          <button onClick={resetForm} style={{
            display:"inline-flex",alignItems:"center",gap:8,
            padding:"11px 22px",borderRadius:12,
            background:"#fff",color:"#15803d",
            border:"1.5px solid #bbf7d0",
            fontFamily:DASH_FONT,fontSize:14,fontWeight:600,
            cursor:"pointer",transition:"all .2s",
          }}
            onMouseEnter={e=>{e.currentTarget.style.background="#f0fdf4";e.currentTarget.style.borderColor="#16a34a";e.currentTarget.style.transform="translateY(-1px)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="#fff";e.currentTarget.style.borderColor="#bbf7d0";e.currentTarget.style.transform="translateY(0)";}}
          >Réinitialiser</button>
          {history.length>0&&(
            <button onClick={clearHistory} style={{
              display:"inline-flex",alignItems:"center",gap:8,
              padding:"11px 22px",borderRadius:12,border:"1.5px solid #fecaca",
              background:"rgba(239,68,68,0.06)",color:"#dc2626",
              fontFamily:DASH_FONT,fontSize:14,fontWeight:600,
              cursor:"pointer",transition:"all .2s",
            }}
              onMouseEnter={e=>{e.currentTarget.style.background="#ef4444";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="#ef4444";e.currentTarget.style.transform="translateY(-1px)";}}
              onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.06)";e.currentTarget.style.color="#dc2626";e.currentTarget.style.borderColor="#fecaca";e.currentTarget.style.transform="translateY(0)";}}
            >
              <IcoTrash/> Vider l'historique
            </button>
          )}
        </div>
         )}
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
     {isAdmin && history.length > 0 && (
        <div style={{display:"flex",gap:20,marginBottom:28,flexWrap:"wrap"}}>

          <KpiCard label="Coût Total Cumulé" value={fmt(totalCost)} unit=" MAD" icon={<IcoMoney/>} delay=".1s"/>
          <KpiCard label="Coût Moyen / Mois" value={fmt(totalCost/history.length)} unit=" MAD" icon={<IcoChart/>} gold delay=".2s"/>
          <KpiCard label="Dernier Mois" value={history[history.length-1]?.month??"—"} icon={<IcoCalendar/>} delay=".3s"/>
        </div>
      )}

      {/* ── Rendement Banner ────────────────────────────────────────────── */}
      {history.length>0&&(
        <div className="rendement-banner" style={{marginBottom:28}}>
          <div style={{
            width:50, height:50, borderRadius:14, flexShrink:0,
            background:"rgba(255,255,255,0.15)",
            border:"1.5px solid rgba(255,255,255,0.25)",
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"white",
            boxShadow:"inset 0 1px 0 rgba(255,255,255,0.2)",
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
              <line x1="2" y1="20" x2="22" y2="20"/>
            </svg>
          </div>
          <div style={{flex:1}}>
            <div className="rendement-label">Répartition du Budget Annuel — Casement</div>
            <div className="rendement-value">{fmt(totalCost)} MAD</div>
            <div style={{color:"rgba(240,253,244,.5)",fontSize:".78rem",marginTop:4}}>
              {history.length} mois enregistré(s)  •  Moyenne : {fmt(totalCost/history.length)} MAD / mois
            </div>
          </div>
          <div style={{
            background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.3)",
            borderRadius:50,padding:"6px 18px",fontFamily:DASH_FONT,
            fontSize:13,fontWeight:700,color:"#FCD34D",
          }}>
            {history.length} mois
          </div>
        </div>
      )}

      {/* ── Chart Card ──────────────────────────────────────────────────── */}
      <div style={{
        background:"#fff", border:"1.5px solid #bbf7d0", borderRadius:20,
        padding:"24px 24px", marginBottom:24,
        boxShadow:"0 4px 24px rgba(22,163,74,0.07)",
        animation:"acc-fadeUp .55s cubic-bezier(0.16,1,0.3,1) .25s both",
      }}>
        <div className="chart-card-title" style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
          <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(145deg,#f0fdf4,#dcfce7)",border:"1.5px solid rgba(134,239,172,0.7)",display:"flex",alignItems:"center",justifyContent:"center",color:"#16a34a",boxShadow:"0 0 0 5px rgba(220,252,231,0.4)"}}>
            <IcoChart/>
          </div>
          <span style={{fontFamily:DASH_FONT,fontWeight:700,fontSize:15,color:"#14532d"}}>Répartition du Budget Annuel (%)</span>
        </div>
        {history.length>0?(
          <div style={{position:"relative",height:320}}>
            <canvas ref={chartRef}/>
          </div>
        ):(
          <div className="rapport-empty">
            <div className="rapport-icon" style={{display:"flex",justifyContent:"center",marginBottom:8}}>
              <div style={{width:52,height:52,borderRadius:14,background:"#f0fdf4",border:"1.5px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",color:"#16A34A"}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
                </svg>
              </div>
            </div>
            <div style={{fontFamily:DASH_FONT}}>
              Ajoutez un calcul pour afficher le graphique
            </div>
          </div>
        )}
      </div>

      {/* ── Historique Table ────────────────────────────────────────────── */}
      <div style={{
        background:"#fff", border:"1.5px solid #bbf7d0", borderRadius:20,
        padding:"24px 24px",
        boxShadow:"0 4px 24px rgba(22,163,74,0.07)",
        animation:"acc-fadeUp .55s cubic-bezier(0.16,1,0.3,1) .35s both",
      }}>
        <div className="table-card-title" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:10,background:"linear-gradient(145deg,#f0fdf4,#dcfce7)",border:"1.5px solid rgba(134,239,172,0.7)",display:"flex",alignItems:"center",justifyContent:"center",color:"#16a34a",boxShadow:"0 0 0 5px rgba(220,252,231,0.4)"}}>
              <IcoCalendar/>
            </div>
            <span style={{fontFamily:DASH_FONT,fontWeight:700,fontSize:15,color:"#14532d"}}>Historique des Calculs</span>
          </span>
          {history.length>0&&(
            <span style={{
              background:"rgba(22,163,74,0.08)",border:"1px solid rgba(22,163,74,0.2)",
              borderRadius:50,padding:"3px 14px",
              fontFamily:DASH_FONT,fontWeight:700,color:"#16A34A",fontSize:".85rem",
            }}>
              {history.length} entrée(s)
            </span>
          )}
        </div>

        {history.length===0?(
          <div className="rapport-empty">
            <div className="rapport-icon" style={{display:"flex",justifyContent:"center",marginBottom:8}}>
              <div style={{width:52,height:52,borderRadius:14,background:"#f0fdf4",border:"1.5px solid #bbf7d0",display:"flex",alignItems:"center",justifyContent:"center",color:"#16A34A"}}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
            </div>
            <div style={{fontFamily:DASH_FONT}}>Aucun calcul enregistré</div>
          </div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table className="cout-table">
              <thead>
                <tr>
                  <th>#</th><th>Mois</th><th>Date</th>
                  <th>Coût/Coup (MAD)</th>
                  <th>Coût (MAD)</th><th>Budget Annuel (MAD)</th>
                  <th>Coût Total (MAD)</th><th>% Budget</th>
                  <th>Progression</th>
                  {isAdmin && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {history.map((h,i)=>{
                  const pct   = totalCost>0?((h.cost/totalCost)*100):0;
                  const color = getColor(pct);
                  const barW  = Math.min(pct*1.5,100);
                  return(
                    <tr key={i} style={{animation:`fadeSlideRight .4s ${i*0.05}s ease both`}}>
                      <td style={{fontWeight:700,color:"#9ca3af"}}>{i+1}</td>
                      <td><strong style={{fontFamily:DASH_FONT}}>{h.month}</strong></td>
                      <td style={{fontSize:".82rem",color:"#6B7280"}}>{h.createdAt??"—"}</td>
                      <td style={{fontFamily:DASH_FONT,fontWeight:600}}>{fmt(h.coupCost)} MAD</td>
                      <td style={{fontFamily:DASH_FONT,fontWeight:600}}>{fmt(h.cout)} MAD</td>
                      <td style={{fontFamily:DASH_FONT,fontWeight:600}}>{fmt(h.annualCost)} MAD</td>
                      <td style={{fontFamily:DASH_FONT,fontWeight:700,color:"#064E3B"}}>{fmt(h.cost)} MAD</td>
                      <td style={{fontFamily:DASH_FONT,fontWeight:700,color}}>{pct.toFixed(1)}%</td>
                      <td style={{minWidth:140}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{flex:1,height:8,background:"#F3F4F6",borderRadius:999,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${barW}%`,background:color,borderRadius:999,transition:"width .6s cubic-bezier(.4,0,.2,1)"}}/>
                          </div>
                          <span style={{fontFamily:DASH_FONT,fontWeight:700,fontSize:".85rem",color,minWidth:38,textAlign:"right"}}>{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                       {isAdmin && (
                      <td>
                        <button className="cout-del-btn" onClick={()=>removeEntry(i)} title="Supprimer"><IcoTrash/></button>
                      </td>
                       )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default CoutCasement;