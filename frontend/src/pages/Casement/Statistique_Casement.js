import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addCasement,
  deleteCasement,
  updateCasement,
  fetchCasements, // ✅ Charger les données depuis Laravel
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
import RapportCasement from "./Rapport_Casement";
import "../../style/Casement.css";
import UseAuth from "../../components/UseAuth";
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler, ArcElement
);

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
  @keyframes acc-fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes acc-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes acc-stripe  { from{background-position:0%} to{background-position:200%} }
  @keyframes acc-float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

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

/* ── Form inputs aligned with Dashboard ── */
.db-form-card {
  background: #fff; border: 1.5px solid #bbf7d0; border-radius: 20px;
  padding: 28px 28px;
  position: relative; overflow: hidden;
  box-shadow: 0 4px 24px rgba(22,163,74,0.07);
  animation: acc-fadeUp .55s cubic-bezier(0.16,1,0.3,1) .1s both;
}
.db-form-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg,#16a34a,#4ade80,#16a34a);
  background-size: 200%; animation: acc-shimmer 2.4s linear infinite;
}
.db-form-label {
  font-family: 'DM Mono', monospace !important;
  font-size: 10px !important; font-weight: 700 !important;
  letter-spacing: .12em !important; text-transform: uppercase !important;
  color: #9ca3af !important; display: flex; align-items: center; gap: 7px;
  margin-bottom: 6px;
}
.db-form-input, .db-form-select {
  width: 100%; box-sizing: border-box;
  padding: 11px 14px;
  background: #fff !important;
  border: 1.5px solid #bbf7d0 !important;
  border-radius: 10px !important;
  color: #111827 !important;
  font-family: 'Plus Jakarta Sans', sans-serif !important; font-size: 13px !important;
  outline: none !important;
  transition: all .22s cubic-bezier(0.16,1,0.3,1) !important;
  box-shadow: 0 1px 3px rgba(20,83,45,0.04), inset 0 1px 0 rgba(255,255,255,0.8) !important;
  -webkit-appearance: none; appearance: none;
}
.db-form-input:focus, .db-form-select:focus {
  border-color: #16a34a !important;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.10), 0 2px 8px rgba(22,163,74,0.06) !important;
  transform: translateY(-1px);
  color: #14532d !important;
}
.db-form-input:hover:not(:focus), .db-form-select:hover:not(:focus) {
  border-color: rgba(22,163,74,0.4) !important;
  background: #f0fdf4 !important;
}
.db-auto-badge {
  font-size: 8px; font-weight: 600; color: #16a34a;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  padding: 1px 7px; border-radius: 20px;
}
.db-equip-chip {
  padding: 8px 16px; border: 1.5px solid #bbf7d0; border-radius: 999px;
  background: #fff; color: #6b7280;
  font-family: 'DM Mono', monospace; font-size: 12px; font-weight: 600;
  cursor: pointer; transition: all .2s; user-select: none;
}
.db-equip-chip:hover { border-color: #16a34a; color: #14532d; background: #f0fdf4; transform: translateY(-2px); }
.db-equip-chip.selected {
  background: linear-gradient(135deg,#15803d,#16a34a); border-color: #15803d;
  color: #fff; font-weight: 700; box-shadow: 0 4px 14px rgba(21,128,61,0.3);
}
.db-equip-add {
  padding: 8px 18px; border: none; border-radius: 999px;
  background: linear-gradient(135deg,#15803d,#16a34a); color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all .2s;
  box-shadow: 0 4px 14px rgba(21,128,61,0.28);
}
.db-equip-add:hover { transform: translateY(-2px); background: linear-gradient(135deg,#16a34a,#10b981); }
.db-rendement-banner {
  background: linear-gradient(135deg,#14532d,#15803d,#16a34a);
  border-radius: 14px; padding: 20px 24px;
  display: flex; align-items: center; gap: 16px;
  font-family: 'Plus Jakarta Sans', sans-serif;
  box-shadow: 0 8px 28px rgba(21,128,61,0.25);
}
.db-rendement-value { font-size: 2.2rem; font-weight: 800; color: #fff; line-height: 1; }
.db-rendement-label { font-size: 12px; color: rgba(255,255,255,0.6); margin-top: 4px; }
.db-btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px; border-radius: 12px; border: none;
  background: linear-gradient(135deg,#15803d,#16a34a); color: #fff;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 700;
  cursor: pointer; transition: all .2s;
  box-shadow: 0 4px 14px rgba(22,163,74,0.28);
}
.db-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(22,163,74,0.35); }
.db-btn-secondary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; border-radius: 12px;
  background: #fff; color: #15803d; border: 1.5px solid #bbf7d0;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .2s;
}
.db-btn-secondary:hover { background: #f0fdf4; border-color: #16a34a; transform: translateY(-1px); }
.db-btn-excel {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; border-radius: 12px;
  background: #fff; color: #15803d; border: 1.5px solid #bbf7d0;
  font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 600;
  cursor: pointer; transition: all .2s;
}
.db-btn-excel:hover { background: #f0fdf4; border-color: #16a34a; transform: translateY(-1px); }
.db-btn-edit {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 8px; border: 1.5px solid #22c55e;
  background: rgba(34,197,94,0.08); color: #15803d;
  font-size: 12px; font-weight: 600; cursor: pointer; transition: all .18s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.db-btn-edit:hover { background: #22c55e; color: #fff; }
.db-btn-del {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px; border-radius: 8px; border: 1.5px solid #fca5a5;
  background: rgba(239,68,68,0.06); color: #dc2626;
  font-size: 12px; font-weight: 600; cursor: pointer; transition: all .18s;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.db-btn-del:hover { background: #ef4444; color: #fff; border-color: #ef4444; }

/* ── Panneaux volume restant ── */
@keyframes csm-sweep { 0%{left:-100%} 50%{left:150%} 100%{left:150%} }
.csm-panneaux-section { margin-bottom: 20px; }
.csm-panneaux-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px;
}
.csm-panneau-card {
  background: #fff; border: 1.5px solid #bbf7d0; border-radius: 16px;
  padding: 16px 18px; position: relative; overflow: hidden;
  box-shadow: 0 2px 12px rgba(22,163,74,0.07);
  transition: transform .2s, box-shadow .2s;
}
.csm-panneau-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(22,163,74,0.13); }
.csm-panneau-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; border-radius: 16px 16px 0 0;
}
.csm-panneau-card.en_cours::before  { background: linear-gradient(90deg,#16a34a,#4ade80); }
.csm-panneau-card.completé::before  { background: linear-gradient(90deg,#2563eb,#60a5fa); }
.csm-panneau-card.suspendu::before  { background: linear-gradient(90deg,#f59e0b,#fcd34d); }
.csm-panneau-top {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;
}
.csm-panneau-name { font-weight: 800; font-size: 15px; color: #14532d; }
.csm-panneau-tranchee { font-family: 'DM Mono', monospace; font-size: 10px; color: #9ca3af; margin-top: 2px; }
.csm-panneau-badge {
  padding: 3px 10px; border-radius: 999px; font-size: 9px; font-weight: 700;
  font-family: 'DM Mono', monospace; letter-spacing: .08em; text-transform: uppercase;
}
.csm-panneau-badge.en_cours { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
.csm-panneau-badge.completé { background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe; }
.csm-panneau-badge.suspendu { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
.csm-panneau-bar-bg {
  height: 8px; background: #f3f4f6; border-radius: 999px; overflow: hidden; margin: 10px 0 8px;
}
.csm-panneau-bar-fill {
  height: 100%; border-radius: 999px;
  transition: width 1s cubic-bezier(0.16,1,0.3,1);
  position: relative; overflow: hidden;
}
.csm-panneau-bar-fill::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent);
  animation: csm-sweep 2.5s ease-in-out infinite;
}
.csm-panneau-volumes {
  display: flex; justify-content: space-between;
  font-family: 'DM Mono', monospace; font-size: 10px; color: #9ca3af;
}
.csm-panneau-pct { font-weight: 800; font-size: 11px; color: #15803d; }

/* ── OEE/TU/TD gauge rings ── */
.csm-gauge-grid {
  display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; margin-bottom: 20px;
}
@media(max-width:700px){ .csm-gauge-grid { grid-template-columns: 1fr; } }
.csm-gauge-card {
  background: #fff; border: 1.5px solid #e5e7eb; border-radius: 16px;
  padding: 20px 16px; text-align: center; position: relative; overflow: hidden;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  transition: transform .2s, box-shadow .2s;
}
.csm-gauge-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(0,0,0,0.09); }
.csm-gauge-stripe { position: absolute; top: 0; left: 0; right: 0; height: 3px; }
.csm-gauge-ring-wrap { position: relative; width: 100px; height: 100px; margin: 0 auto 12px; }
.csm-gauge-ring-wrap svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.csm-gauge-track    { fill: none; stroke: #f3f4f6; stroke-width: 7; }
.csm-gauge-fill     { fill: none; stroke-width: 7; stroke-linecap: round; stroke-dasharray: 283; transition: stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1); filter: drop-shadow(0 0 4px currentColor); }
.csm-gauge-center   { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.csm-gauge-val      { font-size: 18px; font-weight: 800; line-height: 1; font-family: 'Plus Jakarta Sans',sans-serif; }
.csm-gauge-unit     { font-size: 10px; opacity: .55; font-family: 'DM Mono',monospace; }
.csm-gauge-name     { font-family: 'DM Mono',monospace; font-size: 9px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: #9ca3af; margin-bottom: 4px; }
.csm-gauge-sub      { font-family: 'DM Mono',monospace; font-size: 10px; color: #9ca3af; margin-top: 6px; }
.csm-gauge-bar-bg   { height: 5px; background: #f3f4f6; border-radius: 999px; overflow: hidden; margin-top: 10px; }
.csm-gauge-bar-fill { height: 100%; border-radius: 999px; transition: width .8s cubic-bezier(0.16,1,0.3,1); }
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
        title:{display:true,text:"Volume (t)",color:"#6b7280",font:{size:10}}},
    },
  };
}
const doughnutOpts = {
  responsive:true, cutout:"68%", animation:{duration:1200,easing:"easeOutBack"},
  plugins:{
    legend:{position:"bottom",labels:{color:"#6b7280",
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
  date:"", panneau:"", tranchee:"", niveau:"", profondeur:"",
  volume_saute:"",
  equipements:[], conducteur:"", matricule:"",
  heureDebutCompteur:"", heureFinCompteur:"", temps:"", poste:"",
  htp:"",
  etatMachine:"marche", typeArret:"",
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
const { isAdmin } = UseAuth();
  // Navigation — saisie et historique gérés sur d'autres pages
  const activeTab = location.pathname.endsWith("couts") ? "couts" : "overview";

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
  const [confirmDlg, setConfirmDlg] = useState({open:false, index:null, id:null, label:""}); // ✅ id ajouté

  // ✅ Charger les données depuis Laravel au montage du composant
  useEffect(() => {
    dispatch(fetchCasements());
  }, [dispatch]);

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
    if(name==="heureDebutCompteur"||name==="heureFinCompteur") {
      const debut = name==="heureDebutCompteur"?value:formData.heureDebutCompteur;
      const fin   = name==="heureFinCompteur"  ?value:formData.heureFinCompteur;
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const TR = 24;
    const TB = Math.min(parseFloat(formData.temps || 0), TR);
    // TA = arrêt machine uniquement (arrêts par équipement supprimés)
    const TA = Math.min(
      parseFloat(calcTemps(formData.heureDebutArret, formData.heureFinArret) || 0),
      TB
    );
    const HM  = Math.max(0, TB - TA);
    const HTP = Math.min(
      formData.htp !== "" ? Math.max(0, parseFloat(formData.htp || 0)) : HM,
      HM, TR
    );
    // Formules corrigées
    const OEE = HTP > 0 ? parseFloat(Math.min((HTP / TR) * 100, 100).toFixed(2)) : 0;
    const TU  = TB  > 0 ? parseFloat(Math.min((HM  / TB) * 100, 100).toFixed(2)) : 0;
    const TD  = TB  > 0 ? parseFloat(Math.min(((TB - TA) / TB) * 100, 100).toFixed(2)) : 0;

    const payload = {
      ...formData,
      htp: HTP, oee: OEE, tu: TU, td: TD,
      temps: TB,
    };

    try {
      if (editIndex !== null) {
        const recordId = casements[editIndex]?.id ?? null;
        if (!recordId) throw new Error("ID manquant pour la mise à jour.");
        await dispatch(updateCasement({ id: recordId, data: payload })).unwrap();
        setEditIndex(null);
        showToast("warning", "Opération modifiée", "Les données ont été mises à jour dans la base de données.");
      } else {
        await dispatch(addCasement(payload)).unwrap();
        showToast("success", "Opération ajoutée", "Le nouveau casement a été enregistré avec succès.");
      }
      resetForm(); setShowForm(false);
    } catch (err) {
      showToast("danger", "Erreur API", err?.message ?? "Erreur de connexion au serveur.");
    }
  };

  const handleEdit = (c, i) => {
    navigate("/operations/casement/gestion", {
      state: { editData: c, editIndex: i, editId: c?.id }, // ✅ Passer l'ID Laravel
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    showToast("warning","Mode édition activé","Formulaire pré-rempli avec les données de l'opération.");
  };

  const handleDelete = (i) => {
    const c = casements[i];
    const label = c
      ? `${c.date || ""} · ${c.panneau || ""} · ${c.tranchee || ""}`.trim().replace(/^·|·$/g, "").trim()
      : `#${i + 1}`;
    setConfirmDlg({ open: true, index: i, id: c?.id ?? null, label });
  };

  const confirmDelete = async () => {
    if (!confirmDlg.id) {
      showToast("danger", "Erreur", "Identifiant manquant — impossible de supprimer.");
      setConfirmDlg({ open: false, index: null, id: null, label: "" });
      return;
    }
    try {
      await dispatch(deleteCasement(confirmDlg.id)).unwrap();
      showToast("danger", "Opération supprimée", `L'enregistrement "${confirmDlg.label}" a été supprimé de la base de données.`);
    } catch (err) {
      showToast("danger", "Erreur suppression", err?.message ?? "Erreur de connexion au serveur.");
    } finally {
      setConfirmDlg({ open: false, index: null, id: null, label: "" });
    }
  };

  // Rendement instantané basé sur volume_saute
  const rendement = Number(formData.temps)>0 ? (Number(formData.volume_saute)/Number(formData.temps)).toFixed(2) : 0;

  // ── Statistiques ─────────────────────────────────────────────────────────
  const totalVolume = casements.reduce((a,c)=>a+Number(c.volume_saute||0),0);
  const totalTemps  = casements.reduce((a,c)=>a+Number(c.temps||0),0); // TB (Heures de Marche)
  const totalCoups  = casements.reduce((a,c)=>a+Number(c.nombreCoups||0),0);
  const totalOps    = casements.length;
  const rendMoyen   = totalOps>0
    ? (casements.reduce((a,c)=>{
        const v=Number(c.volume_saute||0);
        const t=Number(c.htp||0)||Number(c.temps||0); // ✅ HTP en priorité, TB en fallback
        return a+(t>0?v/t:0);
      },0)/totalOps).toFixed(2)
    : 0;
  const enMarcheCnt = casements.filter(c=>c.etatMachine==="marche").length;
  const enArretCnt  = casements.filter(c=>c.etatMachine==="arret").length;

  // ── KPI OEE / TU / TD / HTP (moyennes sur les enregistrements valides) ──
  const totalHTP   = casements.reduce((a,c)=>a+Number(c.htp||0),0);
  const opsAvecHTP = casements.filter(c=>Number(c.htp||0)>0).length;
  const moyOEE = opsAvecHTP>0
    ? (casements.reduce((a,c)=>a+Number(c.oee||0),0)/opsAvecHTP).toFixed(1) : 0;
  const moyTU  = opsAvecHTP>0
    ? (casements.reduce((a,c)=>a+Number(c.tu||0),0)/opsAvecHTP).toFixed(1) : 0;
  const moyTD  = opsAvecHTP>0
    ? (casements.reduce((a,c)=>a+Number(c.td||0),0)/opsAvecHTP).toFixed(1) : 0;

  // ── Nature d'arrêt la plus fréquente ──────────────────────────────────
  const arretNatures = {};
  casements.forEach(c=>{
    if(c.etatMachine==="arret"&&c.typeArret){
      arretNatures[c.typeArret]=(arretNatures[c.typeArret]||0)+1;
    }
  });
  const topArret = Object.entries(arretNatures).sort((a,b)=>b[1]-a[1])[0];

  // ── Évolution mensuelle HTP / OEE ────────────────────────────────────
  const htpMonthMap = {};
  casements.forEach(c=>{
    const m = c.date?c.date.slice(0,7):"N/A";
    if(!htpMonthMap[m]) htpMonthMap[m]={htp:0,tb:0,oee:0,count:0};
    htpMonthMap[m].htp   += Number(c.htp||0);
    htpMonthMap[m].tb    += Number(c.temps||0);
    htpMonthMap[m].oee   += Number(c.oee||0);
    htpMonthMap[m].count += 1;
  });
  const htpMonthLabels = Object.keys(htpMonthMap).sort();
  const htpMonthValues = htpMonthLabels.map(m=>parseFloat(htpMonthMap[m].htp.toFixed(2)));
  const tbMonthValues  = htpMonthLabels.map(m=>parseFloat(htpMonthMap[m].tb.toFixed(2)));
  const oeeMonthValues = htpMonthLabels.map(m=>
    htpMonthMap[m].count>0?parseFloat((htpMonthMap[m].oee/htpMonthMap[m].count).toFixed(1)):0
  );

  // ── Évolution mensuelle TU / TD ──────────────────────────────────────
  const tuTdMonthMap = {};
  casements.forEach(c=>{
    const m = c.date?c.date.slice(0,7):"N/A";
    if(!tuTdMonthMap[m]) tuTdMonthMap[m]={tu:0,td:0,count:0};
    tuTdMonthMap[m].tu    += Number(c.tu||0);
    tuTdMonthMap[m].td    += Number(c.td||0);
    tuTdMonthMap[m].count += 1;
  });
  const tuMonthValues = htpMonthLabels.map(m=>
    tuTdMonthMap[m]?.count>0?parseFloat((tuTdMonthMap[m].tu/tuTdMonthMap[m].count).toFixed(1)):0
  );
  const tdMonthValues = htpMonthLabels.map(m=>
    tuTdMonthMap[m]?.count>0?parseFloat((tuTdMonthMap[m].td/tuTdMonthMap[m].count).toFixed(1)):0
  );

  // ── Panneaux depuis Redux (panneauSlice) ─────────────────────────────
  const panneauxRedux = useSelector((s)=>s.panneau?.list||[]);

  // ── Performance par panneau ──────────────────────────────────────────
  const panneauStats = {};
  casements.forEach(c=>{
    const p=c.panneau||"N/A";
    if(!panneauStats[p]) panneauStats[p]={volume:0,htp:0,ops:0};
    panneauStats[p].volume += Number(c.volume_saute||0);
    panneauStats[p].htp    += Number(c.htp||0);
    panneauStats[p].ops    += 1;
  });
  const panneauKeys    = Object.keys(panneauStats);
  const panneauVolumes = panneauKeys.map(p=>panneauStats[p].volume);
  const panneauHTP     = panneauKeys.map(p=>parseFloat(panneauStats[p].htp.toFixed(2)));

  // Engins
  const enginStats = {};
  casements.forEach(c=>(c.equipements||[]).forEach(eq=>{
    enginStats[eq]=(enginStats[eq]||0)+Number(c.volume_saute||0);
  }));
  const enginLabels  = Object.keys(enginStats);
  const enginVolumes = Object.values(enginStats);

  const enginBarData = {
    labels:enginLabels,
    datasets:[{
      label:"Volume (t)", data:enginVolumes,
      backgroundColor:(ctx)=>{
        const {chartArea,ctx:c}=ctx.chart;
        if(!chartArea) return "#16a34a";
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
    trancheeGroups[t].reduce((s,op)=>s+Number(op.volume_saute||0),0)
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

  // ── Chart data : HTP vs TB mensuel ─────────────────────────────────────
  const htpTbChartData = {
    labels: htpMonthLabels.length>0?htpMonthLabels:["Aucune donnée"],
    datasets:[
      {
        label:"HM — Heures de Marche (h)", data:tbMonthValues.length>0?tbMonthValues:[0],
        backgroundColor:"rgba(187,247,208,0.6)",
        borderRadius:{topLeft:8,topRight:8},borderSkipped:false,
        barPercentage:0.55,categoryPercentage:0.7,
      },
      {
        label:"HTP — Heures Travail Pur (h)", data:htpMonthValues.length>0?htpMonthValues:[0],
        backgroundColor:(ctx)=>{
          const{chartArea,ctx:c}=ctx.chart;if(!chartArea)return"#16a34a";
          const g=c.createLinearGradient(0,chartArea.top,0,chartArea.bottom);
          g.addColorStop(0,"#16a34a");g.addColorStop(1,"#4ade80");return g;
        },
        borderRadius:{topLeft:8,topRight:8},borderSkipped:false,
        barPercentage:0.55,categoryPercentage:0.7,
      },
    ],
  };
  const htpTbChartOpts = {
    responsive:true,
    plugins:{
      legend:{position:"bottom",labels:{color:"#6b7280",font:{size:11},padding:14,usePointStyle:true}},
      tooltip:{...baseTooltip,callbacks:{label:(c)=>` ${c.parsed.y.toFixed(2)} h`}},
    },
    scales:{
      x:{grid:{display:false},border:{display:false},ticks:baseTick},
      y:{grid:baseGrid,border:{display:false},
        ticks:{...baseTick,callback:(v)=>`${v}h`},
        title:{display:true,text:"Heures",color:"#9ca3af",font:{size:10}}},
    },
  };

  // ── Chart data : OEE mensuel (Line) ─────────────────────────────────────
  const oeeLineData = {
    labels: htpMonthLabels.length>0?htpMonthLabels:["Aucune donnée"],
    datasets:[{
      label:"OEE moyen (%)", data:oeeMonthValues.length>0?oeeMonthValues:[0],
      borderColor:"#2563eb", backgroundColor:"rgba(37,99,235,0.1)",
      pointBackgroundColor:"#2563eb", pointBorderColor:"#fff",
      pointBorderWidth:2, pointRadius:5, pointHoverRadius:8,
      borderWidth:2.5, fill:true, tension:0.42,
    }],
  };
  const oeeLineOpts = {
    responsive:true,
    plugins:{
      legend:{display:false},
      tooltip:{...baseTooltip,callbacks:{label:(c)=>` OEE : ${c.parsed.y}%`}},
    },
    scales:{
      x:{grid:{display:false},border:{display:false},ticks:baseTick},
      y:{grid:baseGrid,border:{display:false},min:0,max:100,
        ticks:{...baseTick,callback:(v)=>`${v}%`}},
    },
  };

  // ── Chart data : Performance par panneau ────────────────────────────────
  const panneauBarData = {
    labels: panneauKeys,
    datasets:[
      {
        label:"Volume (m²)", data:panneauVolumes,
        backgroundColor:(ctx)=>{
          const{chartArea,ctx:c}=ctx.chart;if(!chartArea)return"#16a34a";
          const g=c.createLinearGradient(0,chartArea.top,0,chartArea.bottom);
          g.addColorStop(0,"#15803d");g.addColorStop(1,"#4ade80");return g;
        },
        borderRadius:{topLeft:8,topRight:8},borderSkipped:false,
        barPercentage:0.5,categoryPercentage:0.65,yAxisID:"yVol",
      },
      {
        label:"HTP total (h)", data:panneauHTP,
        backgroundColor:"rgba(37,99,235,0.18)",
        borderRadius:{topLeft:8,topRight:8},borderSkipped:false,
        barPercentage:0.5,categoryPercentage:0.65,yAxisID:"yHTP",
      },
    ],
  };
  const panneauBarOpts = {
    responsive:true,
    plugins:{
      legend:{position:"bottom",labels:{color:"#6b7280",font:{size:11},padding:14,usePointStyle:true}},
      tooltip:{...baseTooltip},
    },
    scales:{
      x:{grid:{display:false},border:{display:false},ticks:baseTick},
      yVol:{position:"left",grid:baseGrid,border:{display:false},
        ticks:{...baseTick},title:{display:true,text:"Volume (m²)",color:"#9ca3af",font:{size:10}}},
      yHTP:{position:"right",grid:{display:false},border:{display:false},
        ticks:{...baseTick,callback:(v)=>`${v}h`},title:{display:true,text:"HTP (h)",color:"#9ca3af",font:{size:10}}},
    },
  };

  // Export Excel
  const exportExcel = () => {
    const data = casements.map(c=>({
      Date:c.date, Panneau:c.panneau, Tranchée:c.tranchee, Niveau:c.niveau,
      Profondeur:c.profondeur||"",
      Équipements:c.equipements?.join(", "),
      Conducteur:c.conducteur, Matricule:c.matricule, Poste:c.poste,
      "HM — Heures de Marche (h)":c.temps,
      "HTP — Heures Travail Pur (h)":c.htp||"",
      "OEE (%)":c.oee||"", "TU (%)":c.tu||"", "TD (%)":c.td||"",
      "Volume sauté(m²)":c.volume_saute,
      "Rendement (m²/h)":Number(c.temps)>0?(Number(c.volume_saute)/Number(c.temps)).toFixed(2):0,
      État:c.etatMachine, "Nature Arrêt":c.typeArret||"",
      "Heure Début Arrêt":c.heureDebutArret||"", "Heure Fin Arrêt":c.heureFinArret||"",
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

  // ─── Table complète  ──────────────
  const FullTable = ({data,showActions=false}) => (
    <div className="db-table-wrap">
      <table className="db-table">
        <thead>
          <tr>
            <th>Date</th><th>Panneau</th><th>Tranchée</th><th>Niveau</th><th>Profondeur</th>
            <th>Volume (m²)</th><th>Équipements</th>
            <th>Conducteur</th><th>Matricule</th><th>Poste</th>
            <th>HM (h)</th><th>HTP (h)</th><th>OEE %</th><th>TU %</th><th>TD %</th>
            <th>Rendement</th><th>État</th><th>Arrêt</th>
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
              <td>{c.profondeur||"—"}</td>
              <td><strong>{Number(c.volume_saute).toLocaleString()}</strong></td>
              <td style={{maxWidth:130,overflow:"hidden",textOverflow:"ellipsis"}}>
                {c.equipements?.join(", ")}
              </td>
              <td>{c.conducteur}</td>
              <td>{c.matricule}</td>
              <td>{c.poste}</td>
              <td><strong>{Number(c.temps||0).toFixed(2)}</strong></td>
              <td><strong style={{color:"#15803d"}}>{c.htp?Number(c.htp).toFixed(2):"—"}</strong></td>
              <td><span style={{color:"#1d4ed8",fontWeight:700}}>{c.oee?`${c.oee}%`:"—"}</span></td>
              <td><span style={{color:"#b45309",fontWeight:700}}>{c.tu?`${c.tu}%`:"—"}</span></td>
              <td><span style={{color:"#6d28d9",fontWeight:700}}>{c.td?`${c.td}%`:"—"}</span></td>
              <td>{c.temps>0?(c.volume_saute/c.temps).toFixed(2):0} m²/h</td>
              <td>
                <span className={c.etatMachine==="marche"?"badge-marche":"badge-arret"}>
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
              value={formData.date} onChange={handleChange} required
               disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Panneau</label>
            <input className="db-form-input" type="text" name="panneau"
              value={formData.panneau} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Tranchée</label>
            <input className="db-form-input" type="text" name="tranchee"
              value={formData.tranchee} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Niveau</label>
            <input className="db-form-input" type="text" name="niveau"
              value={formData.niveau} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Volume Sauté (t)</label>
            <input className="db-form-input" type="number" name="volume_saute"
              value={formData.volume_saute} onChange={handleChange} required  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Granulométrie (mm)</label>
            <input className="db-form-input" type="number" name="granulometrie"
              value={formData.granulometrie} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Type de Roche</label>
            <select className="db-form-select" name="type_roche"
              value={formData.type_roche} onChange={handleChange}>
              <option value="">— Sélectionner —</option>
              <option>Phosphate</option><option>Silex</option>
              <option>Calcaire</option><option>Argile</option><option>Mixte</option>  disabled={!isAdmin}
            </select></div>
          <div><label className="db-form-label">Nombre de Coups </label>
            <input className="db-form-input" type="number" name="nombreCoups"
              placeholder="coups " value={formData.nombreCoups} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Heure de Début</label>
            <input className="db-form-input" type="time" name="heureDebut"
              value={formData.heureDebut} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Heure de Fin</label>
            <input className="db-form-input" type="time" name="heureFin"
              value={formData.heureFin} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">
              Heures de Marche <span className="db-auto-badge">AUTO</span>
            </label>
            <input className="db-form-input" type="number" name="temps"
              value={formData.temps} onChange={handleChange}
              placeholder="Calculé automatiquement"
              readOnly={!!(formData.heureDebut&&formData.heureFin)} required  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Conducteur</label>
            <input className="db-form-input" type="text" name="conducteur"
              value={formData.conducteur} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Matricule</label>
            <input className="db-form-input" type="text" name="matricule"
              value={formData.matricule} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">Poste</label>
            <input className="db-form-input" type="text" name="poste"
              placeholder="Matin / Après-midi / Nuit"
              value={formData.poste} onChange={handleChange}  disabled={!isAdmin}/></div>
          <div><label className="db-form-label">État Machine</label>
            <select className="db-form-select" name="etatMachine"
              value={formData.etatMachine} onChange={handleChange}>
              <option>En marche</option>
              <option>En arrêt</option>
               disabled={!isAdmin}
            </select></div>
          {formData.etatMachine==="En arrêt"&&(<>
            <div><label className="db-form-label">Nature d'arrêt</label>
              <input className="db-form-input" type="text" name="typeArret"
                value={formData.typeArret} onChange={handleChange}  disabled={!isAdmin}/></div>
            <div><label className="db-form-label">Heure Début Arrêt</label>
              <input className="db-form-input" type="time" name="heureDebutArret"
                value={formData.heureDebutArret} onChange={handleChange}  disabled={!isAdmin}/></div>
            <div><label className="db-form-label">Heure Fin Arrêt</label>
              <input className="db-form-input" type="time" name="heureFinArret"
                value={formData.heureFinArret} onChange={handleChange}  disabled={!isAdmin}/></div>
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
            {isAdmin && ( <button type="button" className="db-equip-add" onClick={addEquip}>＋ Ajouter</button>)}
          </div>
        </div>

        <div className="db-rendement-banner" style={{marginTop:20}}>
          <div className="db-rendement-value">{rendement}</div>
          <div className="db-rendement-label">t/h — Rendement instantané</div>
        </div>

        <div style={{display:"flex",gap:10,marginTop:20}}>
          <button type="submit" className="db-btn-primary">
            {editIndex!==null?(
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13"/><polyline points="7 3 7 8 15 8"/></svg> Mettre à jour</>
            ):(
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> Enregistrer</>
            )}
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
        onCancel={()=>setConfirmDlg({open:false,index:null,id:null,label:""})}
      />
      <div className="db-page" style={{
        minHeight:"100vh", background:"#f0fdf4",
        padding:"32px 28px 60px", color:"#14532d",
        fontFamily:"'Plus Jakarta Sans', sans-serif",
      }}>

        {/* ── HEADER (Dashboard-style hero card) ────────────────────────── */}
        <div style={{
          background:"#fff", border:"1.5px solid #bbf7d0", borderRadius:20,
          padding:"28px 32px", marginBottom:24,
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"relative", overflow:"hidden",
          animation:"acc-fadeUp .7s cubic-bezier(0.16,1,0.3,1) .05s both",
          boxShadow:"0 4px 24px rgba(22,163,74,0.07)",
        }}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:4,
            background:"linear-gradient(90deg,#14532d,#16a34a,#10b981,#16a34a,#14532d)",
            backgroundSize:"200% 100%",animation:"acc-stripe 4s linear infinite"}}/>
          <div>
            <h1 style={{
              margin:0, fontSize:"clamp(1.6rem,3vw,2.4rem)", fontWeight:800,
              color:"#14532d", lineHeight:1.1,
              fontFamily:"'Plus Jakarta Sans', sans-serif",
            }}>
              Gestion{" "}
              <span style={{background:"linear-gradient(135deg,#16a34a,#10b981)",
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                Casement
              </span>
            </h1>
            <p style={{margin:"6px 0 0",fontSize:14,color:"#6b7280",
              fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
              Statistiques, saisie et historique des opérations de décapage.
            </p>
          </div>
          <img src={image} alt="logo" style={{
            height:72, borderRadius:16,
            border:"2px solid #bbf7d0",
            boxShadow:"0 8px 32px rgba(22,163,74,0.15)",
            animation:"acc-float 6s ease-in-out infinite",
          }}/>
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {activeTab==="overview"&&(
          <>
            {/* ── KPI Row 1 : volumétrie & temps ── */}
            <div className="db-grid3" style={{marginBottom:16}}>
              {[
                {
                  icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
                  label:"Volume sauté", value:totalVolume, unit:"m²", accent:"#16a34a", bg:"rgba(22,163,74,0.12)", delay:"0.08s"
                },
                {
                  icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>),
                  label:"HM — Heures de Marche", value:parseFloat(totalTemps.toFixed(1)), unit:"h", accent:"#15803d", bg:"rgba(21,128,61,0.12)", delay:"0.16s"
                },
                {
                  icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>),
                  label:"HTP — Heures Travail Pur", value:parseFloat(totalHTP.toFixed(1)), unit:"h", accent:"#0d9488", bg:"rgba(13,148,136,0.12)", delay:"0.24s"
                },
                {
                  icon:(<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width:26,height:26}}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>),
                  label:"Rendement Moyen", value:parseFloat(rendMoyen), unit:"m²/h", accent:"#22c55e", bg:"rgba(34,197,94,0.12)", delay:"0.32s"
                },
              ].map(({icon,label,value,unit,accent,bg,delay})=>(
                <div key={label} className="db-kpi" style={{animationDelay:delay}}>
                  <div className="db-kpi-shimmer"/>
                  <div className="db-kpi-icon" style={{background:bg,color:accent,width:52,height:52,borderRadius:14,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,boxShadow:`0 4px 14px ${bg}`,border:`1.5px solid ${accent}33`}}>{icon}</div>
                  <div className="db-kpi-label">{label}</div>
                  <div className="db-kpi-value" style={{color:accent,animationDelay:delay}}>
                    <AnimCount target={value}/><span className="db-kpi-unit">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ── KPI Row 2 : OEE / TU / TD / arrêts ── */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}}>
              {[
                {label:"OEE Moyen",value:parseFloat(moyOEE),unit:"%",color:"#1d4ed8",bg:"rgba(37,99,235,0.09)",border:"rgba(37,99,235,0.2)"},
                {label:"TU Moyen",value:parseFloat(moyTU),unit:"%",color:"#b45309",bg:"rgba(217,119,6,0.09)",border:"rgba(217,119,6,0.2)"},
                {label:"TD Moyen",value:parseFloat(moyTD),unit:"%",color:"#6d28d9",bg:"rgba(109,40,217,0.09)",border:"rgba(109,40,217,0.2)"},
                {label:"En Arrêt",value:enArretCnt,unit:"ops",color:"#dc2626",bg:"rgba(220,38,38,0.08)",border:"rgba(220,38,38,0.2)"},
              ].map(({label,value,unit,color,bg,border})=>(
                <div key={label} style={{background:bg,border:`1.5px solid ${border}`,borderRadius:14,padding:"14px 18px",textAlign:"center"}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color,opacity:.7,marginBottom:6}}>{label}</div>
                  <div style={{fontSize:"1.8rem",fontWeight:800,color,lineHeight:1}}><AnimCount target={value}/><span style={{fontSize:14,marginLeft:3}}>{unit}</span></div>
                </div>
              ))}
            </div>

            {/* ── Topologie arrêts ── */}
            {topArret&&(
              <div style={{background:"#fffbeb",border:"1.5px solid rgba(217,119,6,0.25)",borderRadius:12,padding:"10px 18px",marginBottom:16,display:"flex",alignItems:"center",gap:12,fontSize:13,color:"#92400e",fontFamily:"'DM Mono',monospace"}}>
                <span style={{fontSize:10,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",opacity:.6}}>Arrêt le + fréquent</span>
                <strong>{topArret[0]}</strong>
                <span style={{opacity:.6}}>— {topArret[1]} occurrence{topArret[1]>1?"s":""}</span>
              </div>
            )}

            {/* ── OEE / TU / TD — Jauges + graphique évolution ── */}
            <div className="db-section">Indicateurs de Performance</div>
            <div className="csm-gauge-grid">
              {[
                {name:"OEE",label:"Efficience Globale",value:parseFloat(moyOEE),color:"#2563eb",stripe:"linear-gradient(90deg,#2563eb,#60a5fa)"},
                {name:"TU", label:"Taux d'Utilisation",value:parseFloat(moyTU), color:"#d97706",stripe:"linear-gradient(90deg,#d97706,#fcd34d)"},
                {name:"TD", label:"Taux de Disponibilité",value:parseFloat(moyTD),color:"#7c3aed",stripe:"linear-gradient(90deg,#7c3aed,#c4b5fd)"},
              ].map(({name,label,value,color,stripe})=>{
                const C=283;
                const pct=Math.min(value,100)/100;
                return(
                  <div key={name} className="csm-gauge-card">
                    <div className="csm-gauge-stripe" style={{background:stripe}}/>
                    <div className="csm-gauge-name">{name}</div>
                    <div className="csm-gauge-ring-wrap">
                      <svg viewBox="0 0 100 100">
                        <circle className="csm-gauge-track" cx="50" cy="50" r="45"/>
                        <circle className="csm-gauge-fill" cx="50" cy="50" r="45"
                          style={{stroke:color,strokeDashoffset:C*(1-pct)}}/>
                      </svg>
                      <div className="csm-gauge-center">
                        <span className="csm-gauge-val" style={{color}}>{value>0?`${value}%`:"—"}</span>
                        <span className="csm-gauge-unit">moyen</span>
                      </div>
                    </div>
                    <div className="csm-gauge-sub">{label}</div>
                    <div className="csm-gauge-bar-bg">
                      <div className="csm-gauge-bar-fill" style={{width:`${Math.min(value,100)}%`,background:stripe}}/>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Graphique OEE / TU / TD mensuel ── */}
            {htpMonthLabels.length>0&&(
              <div className="db-card" {...anim("0.3s")} style={{marginBottom:20}}>
                <div className="db-card-header">
                  <div><p className="db-card-title">📈 OEE · TU · TD — Évolution Mensuelle</p>
                    <p className="db-card-sub">Moyennes mensuelles des indicateurs de performance (%)</p></div>
                  <span className="db-pill">{htpMonthLabels.length} mois</span>
                </div>
                <Line
                  data={{
                    labels:htpMonthLabels,
                    datasets:[
                      {label:"OEE (%)",data:oeeMonthValues,borderColor:"#2563eb",backgroundColor:"rgba(37,99,235,0.07)",pointBackgroundColor:"#2563eb",pointBorderColor:"#fff",pointBorderWidth:2,pointRadius:4,borderWidth:2.5,fill:false,tension:0.42},
                      {label:"TU (%)", data:tuMonthValues, borderColor:"#d97706",backgroundColor:"rgba(217,119,6,0.07)",  pointBackgroundColor:"#d97706",pointBorderColor:"#fff",pointBorderWidth:2,pointRadius:4,borderWidth:2.5,fill:false,tension:0.42},
                      {label:"TD (%)", data:tdMonthValues, borderColor:"#7c3aed",backgroundColor:"rgba(124,58,237,0.07)", pointBackgroundColor:"#7c3aed",pointBorderColor:"#fff",pointBorderWidth:2,pointRadius:4,borderWidth:2.5,fill:false,tension:0.42},
                    ],
                  }}
                  options={{
                    responsive:true,
                    plugins:{
                      legend:{position:"bottom",labels:{color:"#6b7280",font:{family:"'Plus Jakarta Sans',sans-serif",size:11},padding:16,usePointStyle:true,pointStyleWidth:8}},
                      tooltip:{...baseTooltip,callbacks:{label:(c)=>` ${c.dataset.label} : ${c.parsed.y}%`}},
                    },
                    scales:{
                      x:{grid:{display:false},border:{display:false},ticks:baseTick},
                      y:{grid:baseGrid,border:{display:false},min:0,max:100,
                        ticks:{...baseTick,callback:(v)=>`${v}%`},
                        title:{display:true,text:"Pourcentage (%)",color:"#9ca3af",font:{size:10}}},
                    },
                  }}
                />
              </div>
            )}

            {/* ── Volume restant des panneaux ── */}
            {panneauxRedux.length>0&&(
              <>
                <div className="db-section">Volume Restant par Panneau</div>
                <div className="csm-panneaux-grid" style={{marginBottom:20}}>
                  {panneauxRedux.map(p=>{
                    const decape = p.volumeInitial - p.volumeRestant;
                    const pct    = p.volumeInitial>0 ? Math.round((decape/p.volumeInitial)*100) : 0;
                    const barColor = pct<50
                      ? "linear-gradient(90deg,#16a34a,#4ade80)"
                      : pct<80
                        ? "linear-gradient(90deg,#f59e0b,#fcd34d)"
                        : "linear-gradient(90deg,#ef4444,#fca5a5)";
                    const opsCount = casements.filter(c=>c.panneau===p.panneau).length;
                    return(
                      <div key={p.id} className={`csm-panneau-card ${p.status}`}>
                        <div className="csm-panneau-top">
                          <div>
                            <div className="csm-panneau-name">{p.panneau}</div>
                            <div className="csm-panneau-tranchee">
                              {p.tranchee||"—"} · {opsCount} op{opsCount!==1?"s":""}
                            </div>
                          </div>
                          <span className={`csm-panneau-badge ${p.status}`}>{p.status}</span>
                        </div>
                        <div className="csm-panneau-bar-bg">
                          <div className="csm-panneau-bar-fill" style={{width:`${pct}%`,background:barColor}}/>
                        </div>
                        <div className="csm-panneau-volumes">
                          <span>Initial : <strong>{p.volumeInitial.toLocaleString()} m²</strong></span>
                          <span className="csm-panneau-pct">{pct}% décapé</span>
                          <span style={{color:p.volumeRestant<100?"#dc2626":"inherit"}}>
                            Restant : <strong>{p.volumeRestant.toLocaleString()} m²</strong>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <div className="db-grid2" style={{marginBottom:20}}>
              <div className="db-card" {...anim("0.18s")}>
                <div className="db-card-header">
                  <div><p className="db-card-title">Volume par Engin</p>
                    <p className="db-card-sub">Cumul de tous les casements</p></div>
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

            {/* ── HTP vs TB mensuel + OEE ── */}
            {htpMonthLabels.length>0&&(
              <div className="db-grid2" style={{marginBottom:20}}>
                <div className="db-card" {...anim("0.32s")}>
                  <div className="db-card-header">
                    <div><p className="db-card-title">📊 HTP vs HM — Évolution Mensuelle</p>
                      <p className="db-card-sub">Heures travail pur vs heures de marche</p></div>
                    <span className="db-pill">{htpMonthLabels.length} mois</span>
                  </div>
                  <Bar data={htpTbChartData} options={htpTbChartOpts}/>
                </div>
                <div className="db-card" {...anim("0.38s")}>
                  <div className="db-card-header">
                    <div><p className="db-card-title">📈 OEE Mensuel</p>
                      <p className="db-card-sub">Efficience globale équipement (%)</p></div>
                  </div>
                  <Line data={oeeLineData} options={oeeLineOpts}/>
                </div>
              </div>
            )}

            {/* ── Performance par panneau ── */}
            {panneauKeys.length>0&&(
              <div className="db-card" {...anim("0.42s")} style={{marginBottom:20}}>
                <div className="db-card-header">
                  <div><p className="db-card-title">🗺️ Performance par Panneau</p>
                    <p className="db-card-sub">Volume sauté & HTP cumulés par zone</p></div>
                  <span className="db-pill">{panneauKeys.length} panneaux</span>
                </div>
                <Bar data={panneauBarData} options={panneauBarOpts}/>
              </div>
            )}

            {/* ── Volume par tranchée ── */}
            {trancheeKeys.length>0&&(
              <div className="db-card" {...anim("0.46s")} style={{marginBottom:20}}>
                <p className="db-card-title">Volume Total par Tranchée</p>
                <p className="db-card-sub">Comparaison globale des volumes sautés</p>
                <Bar data={trancheeBarData} options={makeBarOpts(200)}/>
              </div>
            )}

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
                <h2 style={{margin:0,fontSize:17,fontWeight:700,color:"#14532d",fontFamily:"'Plus Jakarta Sans',sans-serif"}}>Suivi des Coûts Casement</h2>
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
                          const vol    = Number(c.volume_saute||0);
                          const coutT  = vol>0?(coutOp/vol).toFixed(2):"—";
                          return(
                            <tr key={i} style={{animationDelay:`${i*0.03}s`}}>
                              <td>{c.date}</td><td>{c.panneau}</td><td>{c.tranchee}</td>
                              <td>{c.type_roche}</td>
                              <td><strong>{coups}</strong></td>
                              <td><strong style={{color:"#15803d"}}>{coutOp.toLocaleString()}</strong> MAD</td>
                              <td>{vol.toLocaleString()} t</td>
                              <td>{coutT!=="—"?`${coutT} MAD/t`:"—"}</td>
                              <td><span className={c.etatMachine==="marche"?"badge-marche":"badge-arret"}>
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

        {/* ══ RAPPORT — affiché en bas de page sur tous les onglets ══════ */}
        {activeTab==="overview"&&(
          <div style={{marginTop:8}}>
            <RapportCasement embedded={true}/>
          </div>
        )}

      </div>
    </>
  );
}

export default StatistiqueCasement;