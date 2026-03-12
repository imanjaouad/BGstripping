import React, { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Chart, registerables } from "chart.js";
import { FaMoneyBillWave, FaCalculator, FaChartBar, FaCalendarAlt, FaFilter, FaTrash } from "react-icons/fa";
import "../../components/animations.css";

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
  return (
    <div
      className="kpi-card"
      style={{
        flex:1, minWidth:170, position:"relative",
        animation:`countUp .6s ${delay} ease both`,
        borderLeft:`5px solid ${gold?"#F59E0B":"#16A34A"}`,
        cursor:"default",
        transition:"transform .2s, box-shadow .2s",
      }}
      onMouseEnter={e=>{
        e.currentTarget.style.transform="translateY(-3px)";
        e.currentTarget.style.boxShadow="0 12px 36px rgba(22,163,74,0.22)";
      }}
      onMouseLeave={e=>{
        e.currentTarget.style.transform="translateY(0)";
        e.currentTarget.style.boxShadow="0 8px 32px rgba(22,163,74,0.18)";
      }}
    >
      <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",
        background:gold?"rgba(245,158,11,0.08)":"rgba(22,163,74,0.08)"}}/>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <span style={{color:gold?"#F59E0B":"#16A34A",fontSize:"1rem"}}>{icon}</span>
        <div className="kpi-label">{label}</div>
      </div>
      <div className="kpi-value" style={{color:gold?"#F59E0B":"#16A34A"}}>
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

  const [coupCost,      setCoupCost]      = useState("");   // coût par coup BRH
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

  // Total coups BRH pour le mois sélectionné
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
    const coutBRH  = Number(coupCost) * totalCoupsForMonth;
    const coutPart = Number(annualCost) / 12;
    const cost     = coutBRH + coutPart;
    const newEntry = {
      month:      selectedMonth,
      cost,
      coupCost:   Number(coupCost),
      annualCost: Number(annualCost),
      totalCoups: totalCoupsForMonth,
      coutBRH,
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
          legend:{labels:{font:{family:"'Rajdhani',sans-serif",size:13},color:"#374151"}},
          tooltip:{callbacks:{label:(ctx)=>{
            const h=history[ctx.dataIndex];
            return[
              ` % Budget      : ${ctx.parsed.y}%`,
              ` Coût calculé  : ${fmt(h.cost)} MAD`,
              ` Coût/coup BRH : ${fmt(h.coupCost)} MAD`,
              ` Coups BRH     : ${h.totalCoups}`,
              ` Budget annuel : ${fmt(h.annualCost)} MAD`,
            ];
          }}},
        },
        scales:{
          x:{grid:{display:false},ticks:{font:{family:"'Rajdhani',sans-serif",size:12},color:"#6B7280"}},
          y:{grid:{color:"rgba(22,163,74,0.07)"},ticks:{callback:v=>v+"%",font:{family:"'Rajdhani',sans-serif",size:11},color:"#6B7280"},beginAtZero:true},
        },
      },
    });
    return()=>{if(chartInstance.current){chartInstance.current.destroy();chartInstance.current=null;}};
  },[history,totalCost]);

  const inputStyle = {
    border:"2px solid #E5E7EB", borderRadius:10, padding:"11px 14px",
    fontFamily:"'Exo 2',sans-serif", fontSize:".92rem", outline:"none",
    background:"white", color:"#111827", width:"100%",
    transition:"border-color .25s,box-shadow .25s",
  };
  const labelStyle = {
    fontSize:".8rem", fontWeight:600, color:"#374151",
    letterSpacing:".5px", textTransform:"uppercase",
    marginBottom:6, display:"block",
  };

  return (
    <div style={{
      padding:"32px 36px", overflowY:"auto",
      background:"linear-gradient(135deg,#F0FDF4 0%,#ECFDF5 100%)",
      minHeight:"100vh",
    }}>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div className="page-header">
        <h1 className="page-title">
          Gestion des <span>Coûts</span> — Casement
        </h1>
        <div style={{
          borderRadius:"50%", padding:3,
          background:"conic-gradient(from 0deg,#16A34A,#22C55E,#F59E0B,#16A34A)",
          animation:"rotateBorder 6s linear infinite",
          boxShadow:"0 0 16px rgba(22,163,74,0.35)",
        }}>
          <div style={{
            width:58, height:58, borderRadius:"50%",
            background:"linear-gradient(135deg,#064E3B,#16A34A)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:"1.4rem", border:"3px solid #064E3B", color:"white",
          }}>
            <FaMoneyBillWave/>
          </div>
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
        <span style={{fontSize:"1.5rem"}}>📅</span>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,color:"#064E3B",fontSize:"1rem",letterSpacing:1}}>
            {availableMonths.length>0
              ?`${availableMonths.length} mois disponible(s) dans les données`
              :"Aucune donnée — enregistrez d'abord des opérations dans Dashboard"}
          </div>
          <div style={{fontSize:".8rem",color:"#6B7280",marginTop:2}}>
            {availableMonths.length>0
              ?availableMonths.join("  •  ")
              :"Les mois apparaîtront automatiquement après saisie"}
          </div>
        </div>
        {availableMonths.length>0&&(
          <div style={{
            background:"rgba(22,163,74,0.08)", border:"1px solid rgba(22,163,74,0.2)",
            borderRadius:50, padding:"4px 16px",
            fontFamily:"'Rajdhani',sans-serif", fontWeight:700, color:"#16A34A", fontSize:".9rem",
            whiteSpace:"nowrap",
          }}>
            {casements.length} enregistrement(s)
          </div>
        )}
      </div>

      {/* ── Coups BRH du mois sélectionné ───────────────────────────────── */}
      {selectedMonth&&(
        <div style={{
          background:"linear-gradient(135deg,#064E3B,#16A34A)",
          borderRadius:14, padding:"14px 24px", marginBottom:20,
          display:"flex", alignItems:"center", gap:16,
          animation:"fadeSlideDown .3s ease both",
        }}>
          <span style={{fontSize:"1.8rem"}}>🪨</span>
          <div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,color:"rgba(240,253,244,.7)",fontSize:".85rem",letterSpacing:1}}>
              COUPS BRH — {selectedMonth}
            </div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:800,color:"#fff",fontSize:"1.8rem"}}>
              {totalCoupsForMonth.toLocaleString()} coups
            </div>
          </div>
        </div>
      )}

      {/* ── Form Card ───────────────────────────────────────────────────── */}
      <div className="form-card">
        <div className="form-section-title">
          <FaCalculator style={{color:"#16A34A",marginRight:8}}/>
          Paramètres de Calcul BRH
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}}>

          {/* Coût / coup BRH */}
          <div>
            <label style={labelStyle}>Coût par Coup de BRH (MAD)</label>
            <div style={{position:"relative"}}>
              <input type="number" value={coupCost} min="0" step="0.01"
                placeholder="0.00"
                onChange={e=>setCoupCost(e.target.value)}
                style={{...inputStyle,paddingRight:75}}
                className="form-control"
                onFocus={e=>{e.target.style.borderColor="#16A34A";e.target.style.boxShadow="0 0 0 4px rgba(22,163,74,0.08)";}}
                onBlur={e=>{e.target.style.borderColor="#E5E7EB";e.target.style.boxShadow="none";}}
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
              />
              <span style={{position:"absolute",right:14,top:"50%",transform:"translateY(-50%)",fontSize:".82rem",fontWeight:600,color:"#9CA3AF"}}>
                MAD
              </span>
            </div>
          </div>

          {/* Sélecteur mois */}
          <div>
            <label style={labelStyle}>
              <FaFilter style={{marginRight:6,color:"#16A34A"}}/> Mois
            </label>
            <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)}
              className="form-select" style={inputStyle}
              onFocus={e=>{e.target.style.borderColor="#16A34A";e.target.style.boxShadow="0 0 0 4px rgba(22,163,74,0.08)";}}
              onBlur={e=>{e.target.style.borderColor="#E5E7EB";e.target.style.boxShadow="none";}}
            >
              <option value="">Sélectionner un mois</option>
              {availableMonths.map((m,i)=><option key={i} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* Boutons */}
        <div style={{display:"flex",gap:12,marginTop:20,flexWrap:"wrap"}}>
          <button className="btn-submit" onClick={calculateBudget}
            disabled={!coupCost||!annualCost||!selectedMonth}
            style={{opacity:(!coupCost||!annualCost||!selectedMonth)?0.5:1}}>
            <FaCalculator style={{marginRight:6}}/> Calculer
          </button>
          <button onClick={resetForm} style={{
            background:"linear-gradient(135deg,#6B7280,#9CA3AF)",color:"white",
            border:"none",borderRadius:50,padding:"13px 28px",
            fontFamily:"'Rajdhani',sans-serif",fontSize:"1rem",fontWeight:700,
            letterSpacing:"1px",cursor:"pointer",transition:"all .3s",
            boxShadow:"0 4px 14px rgba(107,114,128,0.3)",
          }}
            onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
            onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
          >Réinitialiser Formulaire</button>
          {history.length>0&&(
            <button onClick={clearHistory} style={{
              background:"linear-gradient(135deg,#991B1B,#EF4444)",color:"white",
              border:"none",borderRadius:50,padding:"13px 28px",
              fontFamily:"'Rajdhani',sans-serif",fontSize:"1rem",fontWeight:700,
              letterSpacing:"1px",cursor:"pointer",transition:"all .3s",
              boxShadow:"0 4px 14px rgba(239,68,68,0.3)",
              display:"flex",alignItems:"center",gap:6,
            }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
            >
              <FaTrash/> Vider l'historique
            </button>
          )}
        </div>
      </div>

      {/* ── KPI Row ─────────────────────────────────────────────────────── */}
      {history.length>0&&(
        <div style={{display:"flex",gap:20,marginBottom:28,flexWrap:"wrap"}}>
          <KpiCard label="Entrées Calculées" value={history.length} icon={<FaCalendarAlt/>} delay="0s"/>
          <KpiCard label="Coût Total Cumulé" value={fmt(totalCost)} unit=" MAD" icon={<FaMoneyBillWave/>} delay=".1s"/>
          <KpiCard label="Coût Moyen / Mois" value={fmt(totalCost/history.length)} unit=" MAD" icon={<FaChartBar/>} gold delay=".2s"/>
          <KpiCard label="Dernier Mois" value={history[history.length-1]?.month??"—"} icon={<FaCalendarAlt/>} delay=".3s"/>
        </div>
      )}

      {/* ── Rendement Banner ────────────────────────────────────────────── */}
      {history.length>0&&(
        <div className="rendement-banner" style={{marginBottom:28}}>
          <span style={{fontSize:"2rem"}}>📊</span>
          <div style={{flex:1}}>
            <div className="rendement-label">Répartition du Budget Annuel — Casement</div>
            <div className="rendement-value">{fmt(totalCost)} MAD</div>
            <div style={{color:"rgba(240,253,244,.5)",fontSize:".78rem",marginTop:4}}>
              {history.length} mois enregistré(s)  •  Moyenne : {fmt(totalCost/history.length)} MAD / mois
            </div>
          </div>
          <div style={{
            background:"rgba(245,158,11,.15)",border:"1px solid rgba(245,158,11,.3)",
            borderRadius:50,padding:"6px 18px",fontFamily:"'Rajdhani',sans-serif",
            fontSize:".95rem",fontWeight:600,color:"#FCD34D",letterSpacing:1,
          }}>
            {history.length} mois
          </div>
        </div>
      )}

      {/* ── Chart Card ──────────────────────────────────────────────────── */}
      <div className="chart-card" style={{marginBottom:28}}>
        <div className="chart-card-title">
          <FaChartBar style={{color:"#16A34A",marginRight:8}}/>
          Répartition du Budget Annuel (%)
        </div>
        {history.length>0?(
          <div style={{position:"relative",height:320}}>
            <canvas ref={chartRef}/>
          </div>
        ):(
          <div className="rapport-empty">
            <div className="rapport-icon">📉</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>
              Ajoutez un calcul pour afficher le graphique
            </div>
          </div>
        )}
      </div>

      {/* ── Historique Table ────────────────────────────────────────────── */}
      <div className="table-card" style={{animation:"fadeSlideUp .55s ease both"}}>
        <div className="table-card-title" style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span><FaCalendarAlt style={{color:"#16A34A",marginRight:8}}/>Historique des Calculs</span>
          {history.length>0&&(
            <span style={{
              background:"rgba(22,163,74,0.08)",border:"1px solid rgba(22,163,74,0.2)",
              borderRadius:50,padding:"3px 14px",
              fontFamily:"'Rajdhani',sans-serif",fontWeight:700,color:"#16A34A",fontSize:".85rem",
            }}>
              {history.length} entrée(s)
            </span>
          )}
        </div>

        {history.length===0?(
          <div className="rapport-empty">
            <div className="rapport-icon">🗂️</div>
            <div style={{fontFamily:"'Rajdhani',sans-serif",letterSpacing:1}}>Aucun calcul enregistré</div>
          </div>
        ):(
          <div style={{overflowX:"auto"}}>
            <table className="mine-table">
              <thead>
                <tr>
                  <th>#</th><th>Mois</th><th>Date</th>
                  <th>Coût/Coup (MAD)</th><th>Coups BRH</th>
                  <th>Coût BRH (MAD)</th><th>Budget Annuel (MAD)</th>
                  <th>Coût Total (MAD)</th><th>% Budget</th>
                  <th>Progression</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h,i)=>{
                  const pct   = totalCost>0?((h.cost/totalCost)*100):0;
                  const color = getColor(pct);
                  const barW  = Math.min(pct*1.5,100);
                  return(
                    <tr key={i} style={{animation:`fadeSlideRight .4s ${i*0.05}s ease both`}}>
                      <td style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,color:"#9CA3AF"}}>{i+1}</td>
                      <td><strong style={{fontFamily:"'Rajdhani',sans-serif"}}>{h.month}</strong></td>
                      <td style={{fontSize:".82rem",color:"#6B7280"}}>{h.createdAt??"—"}</td>
                      <td style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{fmt(h.coupCost)} MAD</td>
                      <td style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,color:"#064E3B"}}>{h.totalCoups}</td>
                      <td style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{fmt(h.coutBRH)} MAD</td>
                      <td style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:600}}>{fmt(h.annualCost)} MAD</td>
                      <td style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,color:"#064E3B"}}>{fmt(h.cost)} MAD</td>
                      <td style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,color}}>{pct.toFixed(1)}%</td>
                      <td style={{minWidth:140}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{flex:1,height:8,background:"#F3F4F6",borderRadius:999,overflow:"hidden"}}>
                            <div style={{height:"100%",width:`${barW}%`,background:color,borderRadius:999,transition:"width .6s cubic-bezier(.4,0,.2,1)"}}/>
                          </div>
                          <span style={{fontFamily:"'Rajdhani',sans-serif",fontWeight:700,fontSize:".85rem",color,minWidth:38,textAlign:"right"}}>{pct.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td>
                        <button className="btn-del" onClick={()=>removeEntry(i)} title="Supprimer"><FaTrash/></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CoutCasement;