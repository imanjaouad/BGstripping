import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCasement,
  deleteCasement,
  updateCasement,
} from "../../features/casementSlice";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler, ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import image from "../../images/image3.webp";
import "../../style/Casement.css"
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler, ArcElement
);

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
/* ── TOAST ALERTS ─────────────────────────────────────────────── */
@keyframes csm-toastIn  { from { opacity:0; transform:translateX(110%); } to { opacity:1; transform:translateX(0); } }
@keyframes csm-toastOut { from { opacity:1; transform:translateX(0);    } to { opacity:0; transform:translateX(110%); } }
@keyframes csm-progress { from { width:100%; } to { width:0%; } }

.csm-toast-wrap {
  position: fixed; bottom: 28px; right: 28px; z-index: 9999;
  display: flex; flex-direction: column; gap: 10px; pointer-events: none;
}
.csm-toast {
  pointer-events: all;
  min-width: 300px; max-width: 380px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.13), 0 2px 10px rgba(0,0,0,0.07);
  overflow: hidden;
  animation: csm-toastIn 0.42s cubic-bezier(0.16,1,0.3,1) forwards;
  border: 1.5px solid transparent;
  position: relative;
}
.csm-toast.out { animation: csm-toastOut 0.35s cubic-bezier(0.4,0,1,1) forwards; }
.csm-toast-inner { display: flex; align-items: flex-start; gap: 13px; padding: 16px 18px 18px; }
.csm-toast-icon {
  width: 38px; height: 38px; border-radius: 11px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.csm-toast-body { flex: 1; min-width: 0; }
.csm-toast-title { font-weight: 700; font-size: 14px; margin-bottom: 2px; line-height: 1.3; }
.csm-toast-msg   { font-size: 12.5px; line-height: 1.45; }
.csm-toast-close {
  background: none; border: none; cursor: pointer; padding: 2px 4px;
  border-radius: 6px; font-size: 16px; line-height: 1; opacity: 0.4;
  transition: opacity .18s; align-self: flex-start; margin-top: -2px;
}
.csm-toast-close:hover { opacity: 0.8; }
.csm-toast-bar {
  height: 3px; border-radius: 0 0 16px 16px;
  animation: csm-progress linear forwards;
}
.csm-toast.success { border-color: #bbf7d0; }
.csm-toast.success .csm-toast-icon  { background: #f0fdf4; color: #16a34a; }
.csm-toast.success .csm-toast-title { color: #14532d; }
.csm-toast.success .csm-toast-msg   { color: #15803d; }
.csm-toast.success .csm-toast-bar   { background: linear-gradient(90deg,#16a34a,#4ade80); }
.csm-toast.warning { border-color: #fde68a; }
.csm-toast.warning .csm-toast-icon  { background: #fffbeb; color: #d97706; }
.csm-toast.warning .csm-toast-title { color: #92400e; }
.csm-toast.warning .csm-toast-msg   { color: #b45309; }
.csm-toast.warning .csm-toast-bar   { background: linear-gradient(90deg,#f59e0b,#fcd34d); }
.csm-toast.danger { border-color: #fecaca; }
.csm-toast.danger .csm-toast-icon  { background: #fef2f2; color: #dc2626; }
.csm-toast.danger .csm-toast-title { color: #7f1d1d; }
.csm-toast.danger .csm-toast-msg   { color: #b91c1c; }
.csm-toast.danger .csm-toast-bar   { background: linear-gradient(90deg,#ef4444,#fca5a5); }

/* ── CONFIRM DIALOG ──────────────────────────────────────────── */
@keyframes csm-dlgIn { from { opacity:0; transform:scale(0.93) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
.csm-dlg-overlay {
  position: fixed; inset: 0; z-index: 9998;
  background: rgba(0,0,0,0.35); backdrop-filter: blur(3px);
  display: flex; align-items: center; justify-content: center;
}
.csm-dlg {
  background: #fff; border-radius: 20px; padding: 32px 36px; max-width: 400px; width: 90%;
  box-shadow: 0 24px 80px rgba(0,0,0,0.18);
  animation: csm-dlgIn 0.38s cubic-bezier(0.16,1,0.3,1) forwards;
  text-align: center;
}
.csm-dlg-icon { width: 56px; height: 56px; border-radius: 16px; background: #fef2f2; color: #dc2626; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
.csm-dlg-title { font-size: 17px; font-weight: 800; color: #111827; margin-bottom: 8px; }
.csm-dlg-msg   { font-size: 13.5px; color: #6b7280; line-height: 1.55; margin-bottom: 24px; }
.csm-dlg-btns  { display: flex; gap: 10px; justify-content: center; }
.csm-dlg-cancel {
  padding: 10px 24px; border-radius: 10px; border: 1.5px solid #e5e7eb;
  background: #f9fafb; color: #374151; font-weight: 600; font-size: 14px;
  cursor: pointer; transition: all .18s;
}
.csm-dlg-cancel:hover { background: #f3f4f6; border-color: #d1d5db; }
.csm-dlg-confirm {
  padding: 10px 28px; border-radius: 10px; border: none;
  background: linear-gradient(135deg,#dc2626,#ef4444); color: #fff;
  font-weight: 700; font-size: 14px; cursor: pointer; transition: all .18s;
  box-shadow: 0 4px 14px rgba(220,38,38,0.3);
}
.csm-dlg-confirm:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(220,38,38,0.4); }
`;

// ─── Chart helpers (identiques Poussage) ─────────────────────────────────────
const PALETTE = {
  emerald:"#16a34a", sky:"#22c55e", amber:"#4ade80", violet:"#15803d", rose:"#86efac",
  bg:"#f0fdf4", card:"#fff", border:"#bbf7d0", text:"#14532d", muted:"#6b7280",
};
const TRANCHEE_COLORS = [
  {main:"#16a34a",dim:"rgba(22,163,74,0.15)"},
  {main:"#22c55e",dim:"rgba(34,197,94,0.15)"},
  {main:"#4ade80",dim:"rgba(74,222,128,0.15)"},
  {main:"#86efac",dim:"rgba(134,239,172,0.15)"},
  {main:"#15803d",dim:"rgba(21,128,61,0.15)"},
];
const baseTooltip = {
  backgroundColor:"#fff", borderColor:"#bbf7d0", borderWidth:1.5,
  titleColor:"#14532d", bodyColor:"#6b7280", padding:12, cornerRadius:10,
};
const baseGrid = { color:"rgba(22,163,74,0.07)", drawBorder:false };
const baseTick = { color:"#9ca3af", font:{family:"'Plus Jakarta Sans',sans-serif",size:11} };

function makeBarOpts(delayOffset=0) {
  return {
    responsive:true,
    animation:{ duration:900, easing:"easeOutQuart",
      delay(ctx){ return ctx.type==="data"&&ctx.mode==="default"?ctx.dataIndex*80+delayOffset:0; }},
    plugins:{ legend:{display:false},
      tooltip:{...baseTooltip,callbacks:{label:(c)=>` ${c.parsed.y.toLocaleString()} t`}}},
    scales:{
      x:{ grid:{display:false}, border:{display:false}, ticks:baseTick },
      y:{ grid:baseGrid, border:{display:false},
        ticks:{...baseTick,callback:(v)=>v.toLocaleString()},
        title:{display:true,text:"Volume (t)",color:PALETTE.muted,font:{size:10}}},
    },
  };
}
const doughnutOpts = {
  responsive:true, cutout:"68%", animation:{duration:1200,easing:"easeOutBack"},
  plugins:{
    legend:{position:"bottom",labels:{color:PALETTE.muted,
      font:{family:"'Plus Jakarta Sans',sans-serif",size:11},padding:14,usePointStyle:true,pointStyleWidth:7}},
    tooltip:{...baseTooltip,callbacks:{label:(c)=>` ${c.label}: ${c.parsed.toLocaleString()} t`}},
  },
};

function AnimCount({ target, duration=1100 }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const t0 = performance.now();
    const run = (now) => {
      const p = Math.min((now-t0)/duration,1);
      setVal(Math.round((1-Math.pow(1-p,3))*target));
      if(p<1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [target,duration]);
  return val.toLocaleString();
}

// ─── State initial casement ───────────────────────────────────────────────────
const EMPTY_FORM = {
  date:"", panneau:"", tranchee:"", niveau:"",
  volume_casse:"", granulometrie:"", type_roche:"", nombreCoups:"",
  equipements:[], conducteur:"", matricule:"",
  heureDebut:"", heureFin:"", temps:"", poste:"",
  etatMachine:"En marche", typeArret:"",
  heureDebutArret:"", heureFinArret:"",
};

function calcTemps(debut,fin) {
  if(!debut||!fin) return "";
  const [dh,dm]=debut.split(":").map(Number);
  const [fh,fm]=fin.split(":").map(Number);
  const mins=(fh*60+fm)-(dh*60+dm);
  return mins>0?(mins/60).toFixed(2):"";
}


// ─── Toast & Confirm components ──────────────────────────────────────────────
const TOAST_ICONS = {
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:20,height:20}}>
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/><path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
};

function ToastContainer({ toasts, onClose }) {
  return (
    <div className="csm-toast-wrap">
      {toasts.map(t => (
        <div key={t.id} className={`csm-toast ${t.type}${t.out?" out":""}`}>
          <div className="csm-toast-inner">
            <div className="csm-toast-icon">{TOAST_ICONS[t.type]}</div>
            <div className="csm-toast-body">
              <div className="csm-toast-title">{t.title}</div>
              <div className="csm-toast-msg">{t.msg}</div>
            </div>
            <button className="csm-toast-close" onClick={()=>onClose(t.id)}>×</button>
          </div>
          <div className="csm-toast-bar" style={{animationDuration:`${t.duration}ms`}}/>
        </div>
      ))}
    </div>
  );
}

function ConfirmDialog({ open, title, msg, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="csm-dlg-overlay" onClick={onCancel}>
      <div className="csm-dlg" onClick={e=>e.stopPropagation()}>
        <div className="csm-dlg-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
          </svg>
        </div>
        <div className="csm-dlg-title">{title}</div>
        <div className="csm-dlg-msg">{msg}</div>
        <div className="csm-dlg-btns">
          <button className="csm-dlg-cancel" onClick={onCancel}>Annuler</button>
          <button className="csm-dlg-confirm" onClick={onConfirm}>Supprimer</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
function StatistiqueCasement() {
  const dispatch  = useDispatch();
  const casements = useSelector((s) => s.casement?.list || []);
  const location  = useLocation();
  const navigate  = useNavigate();

  // Navigation identique à DashboardComplet Poussage
  const activeTab = location.pathname.endsWith("historique") ? "historique"
    : location.pathname.endsWith("couts")      ? "couts"
    : location.pathname.endsWith("rapport")    ? "rapport"
    : "overview";

  const [showForm,  setShowForm]  = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  // ── Équipements CASEMENT ──────────────────────────────────────────────────
  const [equipOpts, setEquipOpts] = useState(["7500M1","7500M2","P&H1","P&H2","200B1"]);
  const [formData,  setFormData]  = useState(EMPTY_FORM);
  const [annualCost, setAnnualCost] = useState(500000);
  const [meterCost,  setMeterCost]  = useState(120);
  const [costSaved,  setCostSaved]  = useState({annualCost:500000,meterCost:120});

  // ── Toast & Confirm ───────────────────────────────────────────────────────
  const [toasts,    setToasts]    = useState([]);
  const [confirmDlg, setConfirmDlg] = useState({open:false, index:null, label:""});

  const showToast = (type, title, msg, duration=4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, {id, type, title, msg, duration, out:false}]);
    setTimeout(()=>{
      setToasts(prev => prev.map(t => t.id===id ? {...t,out:true} : t));
      setTimeout(()=> setToasts(prev => prev.filter(t => t.id!==id)), 380);
    }, duration);
  };
  const closeToast = (id) => {
    setToasts(prev => prev.map(t => t.id===id ? {...t,out:true} : t));
    setTimeout(()=> setToasts(prev => prev.filter(t => t.id!==id)), 380);
  };

  const resetForm = () => setFormData(EMPTY_FORM);

  const handleChange = (e) => {
    const {name,value} = e.target;
    const updated = {...formData,[name]:value};
    if(name==="heureDebut"||name==="heureFin") {
      const debut = name==="heureDebut"?value:formData.heureDebut;
      const fin   = name==="heureFin"  ?value:formData.heureFin;
      updated.temps = calcTemps(debut,fin);
    }
    setFormData(updated);
  };

  const toggleEquip = (eq) => setFormData({
    ...formData,
    equipements: formData.equipements.includes(eq)
      ? formData.equipements.filter(x=>x!==eq)
      : [...formData.equipements,eq],
  });

  const addEquip = () => {
    const n = prompt("Nom du nouvel équipement");
    if(n && !equipOpts.includes(n)) setEquipOpts([...equipOpts,n]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(editIndex!==null) {
      dispatch(updateCasement({index:editIndex,data:formData}));
      setEditIndex(null);
      showToast("warning","Opération modifiée","Les données du casement ont été mises à jour avec succès.");
    } else {
      dispatch(addCasement(formData));
      showToast("success","Opération ajoutée","Le nouveau casement a été enregistré avec succès.");
    }
    resetForm(); setShowForm(false);
  };

  const handleEdit = (c, i) => {
    navigate("/operations/casement/gestion", {
      state: { editData: c, editIndex: i },
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("warning","Mode édition activé","Formulaire pré-rempli avec les données de l'opération.");
  };

  const handleDelete = (i) => {
    const c = casements[i];
    const label = c ? `${c.date || ""} · ${c.panneau || ""} · ${c.tranchee || ""}`.trim().replace(/^·|·$/g,"").trim() : `#${i+1}`;
    setConfirmDlg({open:true, index:i, label});
  };
  const confirmDelete = () => {
    dispatch(deleteCasement(confirmDlg.index));
    showToast("danger","Opération supprimée",`L'enregistrement "${confirmDlg.label}" a été supprimé définitivement.`);
    setConfirmDlg({open:false, index:null, label:""});
  };

  // Rendement instantané basé sur volume_casse
  const rendement = formData.temps>0 ? (formData.volume_casse/formData.temps).toFixed(2) : 0;

  // ── Statistiques ─────────────────────────────────────────────────────────
  const totalVolume = casements.reduce((a,c)=>a+Number(c.volume_casse||0),0);
  const totalTemps  = casements.reduce((a,c)=>a+Number(c.temps||0),0);
  const totalCoups  = casements.reduce((a,c)=>a+Number(c.nombreCoups||0),0);
  const totalOps    = casements.length;
  const rendMoyen   = totalOps>0
    ? (casements.reduce((a,c)=>{
        const v=Number(c.volume_casse||0),t=Number(c.temps||0);
        return a+(t>0?v/t:0);
      },0)/totalOps).toFixed(2)
    : 0;
  const enMarcheCnt = casements.filter(c=>c.etatMachine==="En marche").length;

  // Engins
  const enginStats = {};
  casements.forEach(c=>(c.equipements||[]).forEach(eq=>{
    enginStats[eq]=(enginStats[eq]||0)+Number(c.volume_casse||0);
  }));
  const enginLabels  = Object.keys(enginStats);
  const enginVolumes = Object.values(enginStats);

  const enginBarData = {
    labels:enginLabels,
    datasets:[{
      label:"Volume (t)", data:enginVolumes,
      backgroundColor:(ctx)=>{
        const {chartArea,ctx:c}=ctx.chart;
        if(!chartArea) return PALETTE.emerald;
        const g=c.createLinearGradient(0,chartArea.top,0,chartArea.bottom);
        g.addColorStop(0,"#16a34a"); g.addColorStop(1,"#4ade80"); return g;
      },
      borderRadius:{topLeft:8,topRight:8}, borderSkipped:false,
      barPercentage:0.6, categoryPercentage:0.7,
    }],
  };
  const enginDoughnutData = {
    labels:enginLabels,
    datasets:[{data:enginVolumes,
      backgroundColor:["#16a34a","#22c55e","#4ade80","#86efac","#15803d"],
      borderWidth:0,hoverOffset:10}],
  };

  // Tranchées
  const trancheeGroups = {};
  casements.forEach(c=>{
    const t=c.tranchee||"Non défini";
    if(!trancheeGroups[t]) trancheeGroups[t]=[];
    trancheeGroups[t].push(c);
  });
  const trancheeKeys    = Object.keys(trancheeGroups);
  const trancheeVolumes = trancheeKeys.map(t=>
    trancheeGroups[t].reduce((s,op)=>s+Number(op.volume_casse||0),0)
  );
  const trancheeBarData = {
    labels:trancheeKeys,
    datasets:[{
      label:"Volume total (t)", data:trancheeVolumes,
      backgroundColor:(ctx)=>{
        const {chartArea,ctx:c}=ctx.chart;
        if(!chartArea) return "#22c55e";
        const g=c.createLinearGradient(0,chartArea.top,0,chartArea.bottom);
        g.addColorStop(0,"#22c55e"); g.addColorStop(1,"#86efac"); return g;
      },
      borderRadius:{topLeft:8,topRight:8}, borderSkipped:false,
      barPercentage:0.55, categoryPercentage:0.7,
    }],
  };

  const recentCasements = [...casements].slice(-5).reverse();

  // Export Excel
  const exportExcel = () => {
    const data = casements.map(c=>({
      Date:c.date, Panneau:c.panneau, Tranchée:c.tranchee, Niveau:c.niveau,
      "Type Roche":c.type_roche, "Granulométrie(mm)":c.granulometrie,
      "Nb Coups BRH":c.nombreCoups,
      Équipements:c.equipements?.join(", "),
      Conducteur:c.conducteur, Matricule:c.matricule, Poste:c.poste,
      "Volume Cassé(t)":c.volume_casse, "Heures Marche":c.temps,
      Rendement:c.temps>0?(c.volume_casse/c.temps).toFixed(2):0,
      État:c.etatMachine, "Nature Arrêt":c.typeArret||"",
    }));
    const ws=XLSX.utils.json_to_sheet(data);
    const wb=XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb,ws,"Casement");
    saveAs(new Blob([XLSX.write(wb,{bookType:"xlsx",type:"array"})],{
      type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}),
      "historique_casement.xlsx");
  };

  const anim = (delay) => ({
    style:{animationDelay:delay},
    ref:(el)=>{if(el)el.style.animationDelay=delay;},
  });

  // ─── Table complète (identique Poussage, colonnes casement) ──────────────
  const FullTable = ({data,showActions=false}) => (
    <div className="db-table-wrap">
      <table className="db-table">
        <thead>
          <tr>
            <th>Date</th><th>Panneau</th><th>Tranchée</th><th>Niveau</th>
            <th>Type Roche</th><th>Granulo.(mm)</th><th>Nb Coups</th>
            <th>Volume (t)</th><th>Équipements</th>
            <th>Conducteur</th><th>Matricule</th><th>Poste</th>
            <th>Heures</th><th>Rendement</th><th>État</th><th>Arrêt</th>
            {showActions&&<th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((c,i)=>{
            const realIndex = casements.findIndex(
              (x)=>x===c||(x.date===c.date&&x.panneau===c.panneau&&x.tranchee===c.tranchee&&x.heureDebut===c.heureDebut)
            );
            return(
            <tr key={i} style={{animationDelay:`${i*0.04}s`}}>
              <td>{c.date}</td>
              <td>{c.panneau}</td>
              <td>{c.tranchee}</td>
              <td>{c.niveau}</td>
              <td>{c.type_roche}</td>
              <td>{c.granulometrie}</td>
              <td><strong>{c.nombreCoups}</strong></td>
              <td><strong>{Number(c.volume_casse).toLocaleString()}</strong></td>
              <td style={{maxWidth:130,overflow:"hidden",textOverflow:"ellipsis"}}>
                {c.equipements?.join(", ")}
              </td>
              <td>{c.conducteur}</td>
              <td>{c.matricule}</td>
              <td>{c.poste}</td>
              <td>{c.temps} h</td>
              <td>{c.temps>0?(c.volume_casse/c.temps).toFixed(2):0} t/h</td>
              <td>
                <span className={c.etatMachine==="En marche"?"badge-marche":"badge-arret"}>
                  {c.etatMachine}
                </span>
              </td>
              <td style={{color:"#9ca3af",fontSize:12}}>{c.typeArret||"—"}</td>
              {showActions&&(
                <td>
                  <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                    <button
                      title="Modifier"
                      onClick={()=>handleEdit(c,realIndex)}
                      style={{
                        display:"inline-flex",alignItems:"center",gap:5,
                        padding:"5px 10px",borderRadius:8,border:"1.5px solid #22c55e",
                        background:"rgba(34,197,94,0.08)",color:"#15803d",
                        fontSize:12,fontWeight:600,cursor:"pointer",
                        transition:"all .18s",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background="#22c55e";e.currentTarget.style.color="#fff";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="rgba(34,197,94,0.08)";e.currentTarget.style.color="#15803d";}}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Modifier
                    </button>
                    <button
                      title="Supprimer"
                      onClick={()=>handleDelete(realIndex)}
                      style={{
                        display:"inline-flex",alignItems:"center",gap:5,
                        padding:"5px 10px",borderRadius:8,border:"1.5px solid #fca5a5",
                        background:"rgba(239,68,68,0.06)",color:"#dc2626",
                        fontSize:12,fontWeight:600,cursor:"pointer",
                        transition:"all .18s",
                      }}
                      onMouseEnter={e=>{e.currentTarget.style.background="#ef4444";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="#ef4444";}}
                      onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.06)";e.currentTarget.style.color="#dc2626";e.currentTarget.style.borderColor="#fca5a5";}}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:13,height:13}}>
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                      Supprimer
                    </button>
                  </div>
                </td>
              )}
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  // ─── Formulaire (réutilisé dans Saisie + Historique) ─────────────────────
  const FormBlock = () => (
    <div className="db-form-card">
      <form onSubmit={handleSubmit}>
        <div className="db-form-grid">
          <div><label className="db-form-label">Date</label>
            <input className="db-form-input" type="date" name="date"
              value={formData.date} onChange={handleChange} required/></div>
          <div><label className="db-form-label">Panneau</label>
            <input className="db-form-input" type="text" name="panneau"
              value={formData.panneau} onChange={handleChange}/></div>
          <div><label className="db-form-label">Tranchée</label>
            <input className="db-form-input" type="text" name="tranchee"
              value={formData.tranchee} onChange={handleChange}/></div>
          <div><label className="db-form-label">Niveau</label>
            <input className="db-form-input" type="text" name="niveau"
              value={formData.niveau} onChange={handleChange}/></div>
          <div><label className="db-form-label">Volume Cassé (t)</label>
            <input className="db-form-input" type="number" name="volume_casse"
              value={formData.volume_casse} onChange={handleChange} required/></div>
          <div><label className="db-form-label">Granulométrie (mm)</label>
            <input className="db-form-input" type="number" name="granulometrie"
              value={formData.granulometrie} onChange={handleChange}/></div>
          <div><label className="db-form-label">Type de Roche</label>
            <select className="db-form-select" name="type_roche"
              value={formData.type_roche} onChange={handleChange}>
              <option value="">— Sélectionner —</option>
              <option>Phosphate</option><option>Silex</option>
              <option>Calcaire</option><option>Argile</option><option>Mixte</option>
            </select></div>
          <div><label className="db-form-label">Nombre de Coups BRH</label>
            <input className="db-form-input" type="number" name="nombreCoups"
              placeholder="coups BRH" value={formData.nombreCoups} onChange={handleChange}/></div>
          <div><label className="db-form-label">Heure de Début</label>
            <input className="db-form-input" type="time" name="heureDebut"
              value={formData.heureDebut} onChange={handleChange}/></div>
          <div><label className="db-form-label">Heure de Fin</label>
            <input className="db-form-input" type="time" name="heureFin"
              value={formData.heureFin} onChange={handleChange}/></div>
          <div><label className="db-form-label">
              Heures de Marche <span className="db-auto-badge">AUTO</span>
            </label>
            <input className="db-form-input" type="number" name="temps"
              value={formData.temps} onChange={handleChange}
              placeholder="Calculé automatiquement"
              readOnly={!!(formData.heureDebut&&formData.heureFin)} required/></div>
          <div><label className="db-form-label">Conducteur</label>
            <input className="db-form-input" type="text" name="conducteur"
              value={formData.conducteur} onChange={handleChange}/></div>
          <div><label className="db-form-label">Matricule</label>
            <input className="db-form-input" type="text" name="matricule"
              value={formData.matricule} onChange={handleChange}/></div>
          <div><label className="db-form-label">Poste</label>
            <input className="db-form-input" type="text" name="poste"
              placeholder="Matin / Après-midi / Nuit"
              value={formData.poste} onChange={handleChange}/></div>
          <div><label className="db-form-label">État Machine</label>
            <select className="db-form-select" name="etatMachine"
              value={formData.etatMachine} onChange={handleChange}>
              <option>En marche</option>
              <option>En arrêt</option>
            </select></div>
          {formData.etatMachine==="En arrêt"&&(<>
            <div><label className="db-form-label">Nature d'arrêt</label>
              <input className="db-form-input" type="text" name="typeArret"
                value={formData.typeArret} onChange={handleChange}/></div>
            <div><label className="db-form-label">Heure Début Arrêt</label>
              <input className="db-form-input" type="time" name="heureDebutArret"
                value={formData.heureDebutArret} onChange={handleChange}/></div>
            <div><label className="db-form-label">Heure Fin Arrêt</label>
              <input className="db-form-input" type="time" name="heureFinArret"
                value={formData.heureFinArret} onChange={handleChange}/></div>
          </>)}
        </div>

        {/* Équipements CASEMENT */}
        <div style={{marginTop:18}}>
          <label className="db-form-label">Équipements</label>
          <div className="db-equip-grid">
            {equipOpts.map((eq,i)=>(
              <div key={i}
                className={`db-equip-chip${formData.equipements.includes(eq)?" selected":""}`}
                onClick={()=>toggleEquip(eq)}>
                {eq}
              </div>
            ))}
            <button type="button" className="db-equip-add" onClick={addEquip}>＋ Ajouter</button>
          </div>
        </div>

        <div className="db-rendement-banner" style={{marginTop:20}}>
          <div className="db-rendement-value">{rendement}</div>
          <div className="db-rendement-label">t/h — Rendement instantané</div>
        </div>

        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button type="submit" className="db-btn-primary">
            {editIndex!==null?"💾 Mettre à jour":"✅ Enregistrer"}
          </button>
          <button type="button" className="db-btn-secondary"
            onClick={()=>{setShowForm(false);resetForm();setEditIndex(null);}}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <>
      <style>{CSS}</style>
      <ToastContainer toasts={toasts} onClose={closeToast}/>
      <ConfirmDialog
        open={confirmDlg.open}
        title="Confirmer la suppression"
        msg={`Voulez-vous vraiment supprimer l'opération "${confirmDlg.label}" ? Cette action est irréversible.`}
        onConfirm={confirmDelete}
        onCancel={()=>setConfirmDlg({open:false,index:null,label:""})}
      />
      <div className="db-page" style={{
        minHeight:"100vh", background:PALETTE.bg,
        padding:"28px 24px 60px", color:PALETTE.text,
      }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="db-card" style={{
          marginBottom:24, padding:"18px 24px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          ...anim("0s").style,
        }}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:".16em",
              textTransform:"uppercase",color:PALETTE.muted,marginBottom:4}}>
              Tableau de bord
            </div>
            <h1 style={{margin:0,fontSize:24,fontWeight:800,
              background:"linear-gradient(135deg,#15803d,#22c55e)",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
              Gestion Casement
            </h1>
          </div>
          <img src={image} alt="logo" style={{
            height:46,borderRadius:10,boxShadow:"0 4px 14px rgba(22,163,74,0.2)",
          }}/>
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {activeTab==="overview"&&(
          <>
            <div className="db-grid3" style={{marginBottom:24}}>
              {[
                {
                  icon:(
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ),
                  label:"Volume Cassé", value:totalVolume, unit:"t", accent:"#16a34a", bg:"rgba(22,163,74,0.12)", delay:"0.08s"
                },
                {
                  icon:(
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  ),
                  label:"Temps Total", value:totalTemps, unit:"h", accent:"#15803d", bg:"rgba(21,128,61,0.12)", delay:"0.16s"
                },
                {
                  icon:(
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                    </svg>
                  ),
                  label:"Rendement Moyen", value:parseFloat(rendMoyen), unit:"t/h", accent:"#22c55e", bg:"rgba(34,197,94,0.12)", delay:"0.24s"
                },
                {
                  icon:(
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  ),
                  label:"En Marche", value:enMarcheCnt, unit:"", accent:"#86efac", bg:"rgba(134,239,172,0.18)", delay:"0.32s"
                },
              ].map(({icon,label,value,unit,accent,bg,delay})=>(
                <div key={label} className="db-kpi" style={{animationDelay:delay}}>
                  <div className="db-kpi-shimmer"/>
                  <div className="db-kpi-icon" style={{
                    background:bg,
                    color:accent,
                    width:52,height:52,
                    borderRadius:14,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    marginBottom:12,
                    boxShadow:`0 4px 14px ${bg}`,
                    border:`1.5px solid ${accent}33`,
                  }}>{icon}</div>
                  <div className="db-kpi-label">{label}</div>
                  <div className="db-kpi-value" style={{color:accent,animationDelay:delay}}>
                    <AnimCount target={value}/><span className="db-kpi-unit">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="db-grid2" style={{marginBottom:20}}>
              <div className="db-card" {...anim("0.18s")}>
                <div className="db-card-header">
                  <div><p className="db-card-title">Volume par Engin</p>
                    <p className="db-card-sub">Cumul de tous les casetments</p></div>
                  {enginLabels.length>0&&<span className="db-pill">{enginLabels.length} engins</span>}
                </div>
                {enginLabels.length>0?<Bar data={enginBarData} options={makeBarOpts(300)}/>
                  :<div className="db-empty">Aucune donnée</div>}
              </div>
              <div className="db-card" {...anim("0.28s")}>
                <div className="db-card-header">
                  <div><p className="db-card-title">Répartition par Engin</p>
                    <p className="db-card-sub">Distribution proportionnelle</p></div>
                </div>
                {enginLabels.length>0
                  ?<div style={{maxWidth:280,margin:"0 auto"}}><Doughnut data={enginDoughnutData} options={doughnutOpts}/></div>
                  :<div className="db-empty">Aucune donnée</div>}
              </div>
            </div>

            {trancheeKeys.length>0&&(
              <div className="db-card" {...anim("0.36s")} style={{marginBottom:20}}>
                <p className="db-card-title">Volume Total par Tranchée</p>
                <p className="db-card-sub">Comparaison globale des volumes cassés</p>
                <Bar data={trancheeBarData} options={makeBarOpts(200)}/>
              </div>
            )}

            <div className="db-section">Dernières opérations</div>
            <div className="db-card" {...anim("0.42s")}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <p className="db-card-title" style={{margin:0}}>
                opération{recentCasements.length!==1?"s":""} récentes
                </p>
                <div style={{display:"flex",gap:8}}>
                  <button className="db-btn-secondary"
                    onClick={()=>navigate("/operations/casement/historique")}
                    style={{fontSize:12,padding:"6px 12px"}}>Voir tout →</button>
                  <button className="db-btn-primary"
                    onClick={()=>navigate("/operations/casement/gestion")}
                    style={{fontSize:12,padding:"6px 12px"}}>+ Ajouter</button>
                </div>
              </div>
              {recentCasements.length>0?(
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead><tr>
                      <th>Date</th><th>Panneau</th><th>Tranchée</th>
                      <th>Volume</th><th>Rendement</th><th>État</th><th>Actions</th>
                    </tr></thead>
                    <tbody>
                      {recentCasements.map((c,i)=>(
                        <tr key={i} style={{animationDelay:`${i*0.06}s`}}>
                          <td>{c.date}</td><td>{c.panneau}</td><td>{c.tranchee}</td>
                          <td><strong>{Number(c.volume_casse).toLocaleString()}</strong> t</td>
                          <td>{c.temps>0?(c.volume_casse/c.temps).toFixed(2):0} t/h</td>
                          <td><span className={c.etatMachine==="En marche"?"badge-marche":"badge-arret"}>
                            {c.etatMachine}</span></td>
                          <td>
                            <div style={{display:"flex",gap:5,justifyContent:"center"}}>
                              <button
                                title="Modifier"
                                onClick={()=>handleEdit(c,casements.indexOf(c))}
                                style={{
                                  display:"inline-flex",alignItems:"center",gap:4,
                                  padding:"4px 9px",borderRadius:7,border:"1.5px solid #22c55e",
                                  background:"rgba(34,197,94,0.08)",color:"#15803d",
                                  fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .18s",
                                }}
                                onMouseEnter={e=>{e.currentTarget.style.background="#22c55e";e.currentTarget.style.color="#fff";}}
                                onMouseLeave={e=>{e.currentTarget.style.background="rgba(34,197,94,0.08)";e.currentTarget.style.color="#15803d";}}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12}}>
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                </svg>
                                Modifier
                              </button>
                              <button
                                title="Supprimer"
                                onClick={()=>handleDelete(casements.indexOf(c))}
                                style={{
                                  display:"inline-flex",alignItems:"center",gap:4,
                                  padding:"4px 9px",borderRadius:7,border:"1.5px solid #fca5a5",
                                  background:"rgba(239,68,68,0.06)",color:"#dc2626",
                                  fontSize:11,fontWeight:600,cursor:"pointer",transition:"all .18s",
                                }}
                                onMouseEnter={e=>{e.currentTarget.style.background="#ef4444";e.currentTarget.style.color="#fff";e.currentTarget.style.borderColor="#ef4444";}}
                                onMouseLeave={e=>{e.currentTarget.style.background="rgba(239,68,68,0.06)";e.currentTarget.style.color="#dc2626";e.currentTarget.style.borderColor="#fca5a5";}}
                              >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{width:12,height:12}}>
                                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                  <path d="M10 11v6"/><path d="M14 11v6"/>
                                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                </svg>
                                Supprimer
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ):<div className="db-empty">Aucune opération enregistrée</div>}
            </div>
          </>
        )}

        {/* ══ SAISIE (Dashboard → formData) ════════════════════════════════ */}
        {activeTab==="saisie"&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2 style={{margin:0,fontSize:17,fontWeight:700,color:PALETTE.text}}>
                {editIndex!==null?"✏️ Modifier le casement":"➕ Nouveau casement"}
              </h2>
              {!showForm&&(
                <button className="db-btn-primary" onClick={()=>setShowForm(true)}>
                  ＋ Ajouter les données
                </button>
              )}
            </div>
            {showForm&&<FormBlock/>}
            <div className="db-section">Liste des casements</div>
            <div className="db-card" {...anim("0.1s")}>
              {casements.length>0
                ?<FullTable data={casements} showActions={true}/>
                :<div className="db-empty">Aucun casement enregistré. Cliquez sur "Ajouter les données" pour commencer.</div>}
            </div>
          </>
        )}

        {/* ══ HISTORIQUE ═══════════════════════════════════════════════════ */}
        {activeTab==="historique"&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <h2 style={{margin:0,fontSize:17,fontWeight:700,color:PALETTE.text}}>
                Historique Casement — {casements.length} enregistrement{casements.length!==1?"s":""}
              </h2>
              <div style={{display:"flex",gap:8}}>
                {!showForm&&(
                  <button className="db-btn-primary" onClick={()=>setShowForm(true)}>
                    ＋ Ajouter
                  </button>
                )}
                <button className="db-btn-excel" onClick={exportExcel}>⬇️ Télécharger Excel</button>
              </div>
            </div>
            {showForm&&<FormBlock/>}
            <div className="db-card" {...anim("0.1s")}>
              {casements.length>0
                ?<FullTable data={[...casements].reverse()} showActions={true}/>
                :<div className="db-empty">Aucun historique disponible.</div>}
            </div>
          </>
        )}

        {/* ══ STATISTIQUES ═════════════════════════════════════════════════ */}
        {(activeTab==="stats"||activeTab==="overview"&&false)&&(
          <>
            <div className="db-grid3" style={{marginBottom:24}}>
              {[
                {
                  icon:(
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ),
                  label:"Volume Cassé", value:totalVolume, unit:"t", accent:"#16a34a", bg:"rgba(22,163,74,0.12)", delay:"0.08s"
                },
                {
                  icon:(
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  ),
                  label:"Temps Total", value:totalTemps, unit:"h", accent:"#15803d", bg:"rgba(21,128,61,0.12)", delay:"0.16s"
                },
                {
                  icon:(
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}>
                      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
                    </svg>
                  ),
                  label:"Rendement Moyen", value:parseFloat(rendMoyen), unit:"t/h", accent:"#22c55e", bg:"rgba(34,197,94,0.12)", delay:"0.24s"
                },
              ].map(({icon,label,value,unit,accent,bg,delay})=>(
                <div key={label} className="db-kpi" style={{animationDelay:delay}}>
                  <div className="db-kpi-shimmer"/>
                  <div className="db-kpi-icon" style={{
                    background:bg,
                    color:accent,
                    width:52,height:52,
                    borderRadius:14,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    marginBottom:12,
                    boxShadow:`0 4px 14px ${bg}`,
                    border:`1.5px solid ${accent}33`,
                  }}>{icon}</div>
                  <div className="db-kpi-label">{label}</div>
                  <div className="db-kpi-value" style={{color:accent,animationDelay:delay}}>
                    <AnimCount target={value}/><span className="db-kpi-unit">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="db-section">Analyse par Engin</div>
            <div className="db-grid2" style={{marginBottom:20}}>
              <div className="db-card" {...anim("0.18s")}>
                <div className="db-card-header">
                  <div><p className="db-card-title">Volume par Engin</p>
                    <p className="db-card-sub">Répartition cumulative du volume cassé</p></div>
                  {enginLabels.length>0&&<span className="db-pill">{enginLabels.length} engins</span>}
                </div>
                {enginLabels.length>0?<Bar data={enginBarData} options={makeBarOpts(300)}/>
                  :<div className="db-empty">Aucune donnée disponible</div>}
              </div>
              <div className="db-card" {...anim("0.28s")}>
                <p className="db-card-title">Part de Volume par Engin</p>
                <p className="db-card-sub">Distribution proportionnelle</p>
                {enginLabels.length>0
                  ?<div style={{maxWidth:300,margin:"0 auto"}}><Doughnut data={enginDoughnutData} options={doughnutOpts}/></div>
                  :<div className="db-empty">Aucune donnée disponible</div>}
              </div>
            </div>

            <div className="db-section">Analyse par Tranchée</div>
            {trancheeKeys.length>0&&(
              <div className="db-card" {...anim("0.32s")} style={{marginBottom:20}}>
                <p className="db-card-title">Volume Total par Tranchée</p>
                <p className="db-card-sub">Comparaison globale des volumes cassés</p>
                <Bar data={trancheeBarData} options={makeBarOpts(200)}/>
              </div>
            )}
            <div className="db-grid2">
              {trancheeKeys.map((tranchee,idx)=>{
                const ops   = trancheeGroups[tranchee];
                const color = TRANCHEE_COLORS[idx%TRANCHEE_COLORS.length];
                const labels  = ops.map((_,i)=>`Op ${i+1}`);
                const volumes = ops.map(op=>Number(op.volume_casse||0));
                const lineData = {
                  labels,
                  datasets:[{
                    label:"Volume (t)", data:volumes,
                    borderColor:color.main, backgroundColor:color.dim,
                    pointBackgroundColor:color.main, pointBorderColor:"#fff",
                    pointBorderWidth:2, pointRadius:5, pointHoverRadius:8,
                    borderWidth:2.5, fill:true, tension:0.42,
                  }],
                };
                const lineOpts = {
                  responsive:true,
                  animation:{duration:1000,easing:"easeOutQuart",
                    delay(ctx){return ctx.type==="data"&&ctx.mode==="default"?ctx.dataIndex*60+idx*100:0;}},
                  plugins:{legend:{display:false},
                    tooltip:{...baseTooltip,callbacks:{label:(c)=>` ${c.parsed.y.toLocaleString()} t`}}},
                  scales:{
                    x:{grid:{display:false},border:{display:false},ticks:baseTick},
                    y:{grid:baseGrid,border:{display:false},ticks:baseTick},
                  },
                };
                return(
                  <div key={tranchee} className="db-card"
                    ref={(el)=>{if(el)el.style.animationDelay=`${0.36+idx*0.1}s`;}}>
                    <div className="db-card-header">
                      <div>
                        <p className="db-card-title" style={{color:color.main}}>Tranchée {tranchee}</p>
                        <p className="db-card-sub">
                          {ops.length} opération{ops.length>1?"s":""} · courbe d'évolution
                        </p>
                      </div>
                      <span className="db-pill" style={{background:color.dim,color:color.main}}>
                        {volumes.reduce((a,b)=>a+b,0).toLocaleString()} t
                      </span>
                    </div>
                    <Line data={lineData} options={lineOpts}/>
                  </div>
                );
              })}
              {trancheeKeys.length===0&&(
                <div className="db-empty" style={{gridColumn:"1/-1"}}>
                  Aucune donnée de tranchée disponible
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ COÛTS ════════════════════════════════════════════════════════ */}
        {activeTab==="couts"&&(()=>{
          const totalCoups2  = casements.reduce((a,c)=>a+Number(c.nombreCoups||0),0);
          const coutBRH      = totalCoups2*costSaved.meterCost;
          const coutAnnuel   = costSaved.annualCost;
          const coutTotal    = coutAnnuel+coutBRH;
          const pct          = Math.min((coutTotal/(coutAnnuel*1.5))*100,100);
          const coutParTonne = totalVolume>0?(coutTotal/totalVolume).toFixed(2):0;

          const monthlyMap={};
          casements.forEach(c=>{
            const m=c.date?c.date.slice(0,7):"N/A";
            if(!monthlyMap[m]) monthlyMap[m]={coups:0,meters:0};
            monthlyMap[m].coups+=Number(c.nombreCoups||0);
          });
          const monthLabels = Object.keys(monthlyMap).sort();
          const monthCosts  = monthLabels.map(m=>monthlyMap[m].coups*costSaved.meterCost);
          const monthFixed  = monthLabels.map(()=>coutAnnuel/12);

          const chartData = {
            labels: monthLabels.length>0?monthLabels:["Aucune donnée"],
            datasets:[
              {
                label:"Coût BRH (MAD)", data:monthCosts.length>0?monthCosts:[0],
                backgroundColor:(ctx)=>{
                  const{chartArea,ctx:c}=ctx.chart;if(!chartArea)return"#16a34a";
                  const g=c.createLinearGradient(0,chartArea.top,0,chartArea.bottom);
                  g.addColorStop(0,"#16a34a");g.addColorStop(1,"#4ade80");return g;
                },
                borderRadius:{topLeft:8,topRight:8},borderSkipped:false,
                barPercentage:0.55,categoryPercentage:0.7,
              },
              {
                label:"Coût Fixe Mensuel (MAD)", data:monthFixed.length>0?monthFixed:[0],
                backgroundColor:"rgba(134,239,172,0.55)",
                borderRadius:{topLeft:8,topRight:8},borderSkipped:false,
                barPercentage:0.55,categoryPercentage:0.7,
              },
            ],
          };
          const chartOpts = {
            responsive:true,
            plugins:{
              legend:{position:"bottom",labels:{color:"#6b7280",font:{size:11},padding:14,usePointStyle:true}},
              tooltip:{...baseTooltip,callbacks:{label:(c)=>` ${c.parsed.y.toLocaleString()} MAD`}},
            },
            scales:{
              x:{grid:{display:false},border:{display:false},ticks:baseTick},
              y:{grid:baseGrid,border:{display:false},
                ticks:{...baseTick,callback:(v)=>`${(v/1000).toFixed(0)}k`},
                title:{display:true,text:"MAD",color:"#9ca3af",font:{size:10}}},
            },
          };

          return(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <h2 style={{margin:0,fontSize:17,fontWeight:700,color:"#14532d"}}>Suivi des Coûts Casement</h2>
              </div>

              {/* KPI coûts */}
              <div className="db-cost-summary">
                {[
                  {label:"Coût Total",      value:(coutTotal/1000).toFixed(1), unit:"k MAD", delay:"0.08s"},
                  {label:"Coût BRH",        value:(coutBRH/1000).toFixed(1),   unit:"k MAD", delay:"0.14s"},
                  {label:"Coût / Tonne",    value:coutParTonne,                unit:"MAD/t", delay:"0.20s"},
                  {label:"Coups BRH Total", value:totalCoups2.toLocaleString(),unit:"coups", delay:"0.26s"},
                ].map(({label,value,unit,delay})=>(
                  <div key={label} className="db-cost-stat" style={{animationDelay:delay}}>
                    <div className="db-cost-stat-label">{label}</div>
                    <div className="db-cost-stat-value">{value}<span className="db-cost-stat-unit">{unit}</span></div>
                    <div className="db-cost-progress-wrap"><div className="db-cost-progress-bar" style={{width:`${pct}%`}}/></div>
                  </div>
                ))}
              </div>

              {/* Paramètres + Graphe */}
              <div className="db-grid2" style={{marginBottom:20}}>
                <div className="db-card" style={{animationDelay:"0.12s"}}>
                  <div className="db-card-header" style={{marginBottom:16}}>
                    <div><p className="db-card-title">⚙️ Paramètres de Coût</p>
                      <p className="db-card-sub">Définissez les bases de calcul BRH</p></div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:16}}>
                    <div><label className="db-cost-label">Anticipation coût annuel (MAD)</label>
                      <input type="number" className="db-cost-input" value={annualCost}
                        onChange={(e)=>setAnnualCost(Number(e.target.value))}/></div>
                    <div><label className="db-cost-label">Prix fixe par coup BRH (MAD)</label>
                      <input type="number" className="db-cost-input" value={meterCost}
                        onChange={(e)=>setMeterCost(Number(e.target.value))}/></div>
                    <div style={{paddingTop:4}}>
                      <button className="db-btn-primary"
                        onClick={()=>setCostSaved({annualCost,meterCost})}
                        style={{width:"100%",justifyContent:"center"}}>
                        ✅ Mettre à jour les calculs
                      </button>
                    </div>
                    {/* Aperçu live */}
                    <div style={{background:"#f0fdf4",borderRadius:12,padding:"14px 16px",
                      border:"1.5px solid #bbf7d0",marginTop:4}}>
                      <div style={{fontSize:10,fontWeight:700,letterSpacing:".1em",
                        textTransform:"uppercase",color:"#9ca3af",marginBottom:8}}>Aperçu en direct</div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#374151",marginBottom:4}}>
                        <span>Coût mensuel estimé</span>
                        <strong style={{color:"#15803d"}}>{(annualCost/12).toLocaleString(undefined,{maximumFractionDigits:0})} MAD</strong>
                      </div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:"#374151"}}>
                        <span>Coût BRH total ({totalCoups2} coups)</span>
                        <strong style={{color:"#15803d"}}>{(totalCoups2*meterCost).toLocaleString()} MAD</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="db-card" style={{animationDelay:"0.22s"}}>
                  <div className="db-card-header" style={{marginBottom:16}}>
                    <div><p className="db-card-title">📊 Évolution Mensuelle des Coûts</p>
                      <p className="db-card-sub">Coût BRH vs coût fixe mensuel</p></div>
                    {monthLabels.length>0&&<span className="db-pill">{monthLabels.length} mois</span>}
                  </div>
                  {monthLabels.length>0
                    ?<Bar data={chartData} options={chartOpts}/>
                    :<div className="db-empty">Aucune donnée — ajoutez des casements</div>}
                </div>
              </div>

              {/* Détail par opération */}
              <div className="db-section">Détail des coûts par opération</div>
              <div className="db-card" style={{animationDelay:"0.28s"}}>
                {casements.length>0?(
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead><tr>
                        <th>Date</th><th>Panneau</th><th>Tranchée</th>
                        <th>Type Roche</th><th>Coups BRH</th>
                        <th>Coût BRH</th><th>Volume (t)</th>
                        <th>Coût/Tonne</th><th>État</th>
                      </tr></thead>
                      <tbody>
                        {[...casements].reverse().map((c,i)=>{
                          const coups  = Number(c.nombreCoups||0);
                          const coutOp = coups*costSaved.meterCost;
                          const vol    = Number(c.volume_casse||0);
                          const coutT  = vol>0?(coutOp/vol).toFixed(2):"—";
                          return(
                            <tr key={i} style={{animationDelay:`${i*0.03}s`}}>
                              <td>{c.date}</td><td>{c.panneau}</td><td>{c.tranchee}</td>
                              <td>{c.type_roche}</td>
                              <td><strong>{coups}</strong></td>
                              <td><strong style={{color:"#15803d"}}>{coutOp.toLocaleString()}</strong> MAD</td>
                              <td>{vol.toLocaleString()} t</td>
                              <td>{coutT!=="—"?`${coutT} MAD/t`:"—"}</td>
                              <td><span className={c.etatMachine==="En marche"?"badge-marche":"badge-arret"}>
                                {c.etatMachine}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ):<div className="db-empty">Aucune opération enregistrée</div>}
              </div>
            </>
          );
        })()}

      </div>
    </>
  );
}

export default StatistiqueCasement;