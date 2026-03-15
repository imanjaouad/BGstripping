import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCasements,
  addCasementAsync,
  deleteCasementAsync,
  updateCasementAsync,
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

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler, ArcElement
);

// ─── CSS (identique Poussage DashboardComplet) ────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes db-fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes db-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes db-pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} 50%{box-shadow:0 0 20px 5px rgba(22,163,74,0.18)} }
  @keyframes db-countUp { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
  @keyframes db-rowIn   { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }

  .db-page { font-family:'Plus Jakarta Sans',sans-serif; }

  .db-tab { cursor:pointer; padding:8px 20px; border-radius:10px; font-size:13px; font-weight:600;
    color:#6b7280; border:1.5px solid transparent; transition:all .2s; background:none; }
  .db-tab.active { background:#16a34a; color:#fff; border-color:#15803d; box-shadow:0 4px 14px rgba(22,163,74,0.28); }
  .db-tab:not(.active):hover { background:#f0fdf4; border-color:#bbf7d0; color:#15803d; }

  .db-kpi { background:#fff; border:1.5px solid #bbf7d0; border-radius:16px;
    padding:20px 22px; position:relative; overflow:hidden;
    opacity:0; animation:db-fadeUp .5s ease forwards;
    transition:transform .2s,box-shadow .2s; cursor:default; }
  .db-kpi:hover { transform:translateY(-5px); animation:db-pulse 2s ease infinite !important; }
  .db-kpi::before { content:''; position:absolute; top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,#16a34a,#4ade80,#16a34a);
    background-size:200%; animation:db-shimmer 2.4s linear infinite; }
  .db-kpi-shimmer { position:absolute; inset:0;
    background:linear-gradient(100deg,transparent 25%,rgba(255,255,255,.6) 50%,transparent 75%);
    background-size:600px 100%; animation:db-shimmer 2.8s linear infinite; pointer-events:none; }
  .db-kpi-icon { width:36px; height:36px; background:#dcfce7; border-radius:10px;
    display:flex; align-items:center; justify-content:center; font-size:18px; margin-bottom:12px; }
  .db-kpi-label { font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase;
    color:#9ca3af; margin-bottom:6px; }
  .db-kpi-value { font-size:30px; font-weight:800; color:#15803d; line-height:1;
    animation:db-countUp .55s cubic-bezier(.34,1.56,.64,1) both; }
  .db-kpi-unit { font-size:13px; font-weight:500; color:#9ca3af; margin-left:3px; }

  .db-card { background:#fff; border:1.5px solid #bbf7d0; border-radius:16px;
    padding:24px 22px 20px; opacity:0; animation:db-fadeUp .55s ease forwards;
    transition:box-shadow .2s,transform .2s; }
  .db-card:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(22,163,74,0.11); }
  .db-card-title { font-size:14px; font-weight:700; color:#14532d; margin:0 0 3px; }
  .db-card-sub   { font-size:11px; color:#9ca3af; margin:0 0 18px; }
  .db-card-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:4px; }
  .db-pill { background:#dcfce7; color:#16a34a; font-size:11px; font-weight:600;
    padding:3px 10px; border-radius:20px; white-space:nowrap; flex-shrink:0; }

  .db-section { font-size:10px; font-weight:700; letter-spacing:.15em; text-transform:uppercase;
    color:#16a34a; margin:28px 0 14px; display:flex; align-items:center; gap:10px; }
  .db-section::after { content:''; flex:1; height:1px; background:#bbf7d0; }

  .db-table-wrap { overflow-x:auto; border-radius:12px; border:1.5px solid #bbf7d0; }
  .db-table { width:100%; border-collapse:collapse; font-size:12.5px; }
  .db-table thead tr { background:#15803d; }
  .db-table th { padding:11px 13px; text-align:left; font-size:10px; font-weight:700;
    letter-spacing:.07em; text-transform:uppercase; color:#fff; white-space:nowrap; }
  .db-table tbody tr { border-bottom:1px solid #f0fdf4; animation:db-rowIn .4s ease both; transition:background .15s; }
  .db-table tbody tr:hover { background:#f0fdf4; }
  .db-table tbody tr:last-child { border-bottom:none; }
  .db-table td { padding:10px 13px; color:#374151; vertical-align:middle; white-space:nowrap; }
  .db-table td:first-child { font-weight:600; color:#14532d; }

  .badge-marche { background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }
  .badge-arret  { background:#fef3c7; color:#92400e; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600; white-space:nowrap; }

  .db-btn-primary { background:#16a34a; color:#fff; border:none; border-radius:10px;
    padding:9px 18px; font-size:13px; font-weight:600; cursor:pointer;
    display:inline-flex; align-items:center; gap:6px; transition:all .18s;
    box-shadow:0 2px 8px rgba(22,163,74,0.22); }
  .db-btn-primary:hover { background:#15803d; transform:translateY(-1px); box-shadow:0 5px 16px rgba(22,163,74,0.28); }
  .db-btn-secondary { background:#fff; color:#16a34a; border:1.5px solid #bbf7d0;
    border-radius:10px; padding:8px 16px; font-size:13px; font-weight:600; cursor:pointer;
    display:inline-flex; align-items:center; gap:6px; transition:all .18s; }
  .db-btn-secondary:hover { background:#f0fdf4; border-color:#16a34a; }
  .db-btn-excel { background:#166534; color:#fff; border:none; border-radius:10px;
    padding:8px 16px; font-size:13px; font-weight:600; cursor:pointer;
    display:inline-flex; align-items:center; gap:6px; transition:all .18s; }
  .db-btn-excel:hover { background:#15803d; transform:translateY(-1px); }
  .db-btn-edit { background:#f0fdf4; color:#16a34a; border:1px solid #bbf7d0;
    border-radius:7px; padding:5px 11px; font-size:11px; font-weight:600; cursor:pointer;
    margin-right:5px; transition:all .15s; white-space:nowrap; }
  .db-btn-edit:hover { background:#dcfce7; border-color:#16a34a; }
  .db-btn-del { background:#fef2f2; color:#dc2626; border:1px solid #fecaca;
    border-radius:7px; padding:5px 11px; font-size:11px; font-weight:600; cursor:pointer;
    transition:all .15s; white-space:nowrap; }
  .db-btn-del:hover { background:#fee2e2; }

  .db-form-card { background:#fff; border:1.5px solid #bbf7d0; border-radius:16px;
    padding:28px 24px; margin-bottom:22px; animation:db-fadeUp .4s ease both; }
  .db-form-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:16px; }
  .db-form-label { font-size:11px; font-weight:600; color:#374151; margin-bottom:5px;
    display:block; text-transform:uppercase; letter-spacing:.06em; }
  .db-form-input { width:100%; border:1.5px solid #d1fae5; border-radius:9px;
    padding:9px 12px; font-size:13px; color:#111827; background:#fafffe;
    outline:none; transition:border .18s,box-shadow .18s; box-sizing:border-box; }
  .db-form-input:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.12); }
  .db-form-input[readonly] { background:#f0fdf4; color:#15803d; font-weight:700; }
  .db-form-select { width:100%; border:1.5px solid #d1fae5; border-radius:9px;
    padding:9px 12px; font-size:13px; color:#111827; background:#fafffe;
    outline:none; appearance:none; cursor:pointer; transition:border .18s; }
  .db-form-select:focus { border-color:#16a34a; }
  .db-equip-grid { display:flex; flex-wrap:wrap; gap:8px; margin-top:6px; }
  .db-equip-chip { padding:5px 14px; border-radius:20px; border:1.5px solid #bbf7d0;
    font-size:12px; font-weight:600; color:#374151; cursor:pointer; transition:all .15s; background:#fff; }
  .db-equip-chip:hover { background:#f0fdf4; border-color:#16a34a; }
  .db-equip-chip.selected { background:#16a34a; color:#fff; border-color:#15803d; }
  .db-equip-add { padding:5px 14px; border-radius:20px; border:1.5px dashed #16a34a;
    font-size:12px; font-weight:600; color:#16a34a; cursor:pointer; background:#fff; transition:background .15s; }
  .db-equip-add:hover { background:#f0fdf4; }
  .db-rendement-banner { background:linear-gradient(135deg,#15803d,#22c55e);
    border-radius:14px; padding:18px 24px; display:flex; align-items:center; gap:16px; margin-top:8px; }
  .db-rendement-value { font-size:36px; font-weight:800; color:#fff; }
  .db-rendement-label { font-size:14px; color:rgba(255,255,255,.8); }
  .db-auto-badge { margin-left:6px; font-size:10px; font-weight:700; color:#16a34a;
    background:#dcfce7; padding:2px 7px; border-radius:20px; letter-spacing:.04em; }
  .db-empty { text-align:center; padding:48px 0; color:#9ca3af; font-size:13px; }
  .db-grid2 { display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:20px; }
  .db-grid3 { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; }

  .db-cost-input { width:100%; border:1.5px solid #d1fae5; border-radius:9px;
    padding:9px 12px; font-size:13px; color:#111827; background:#fafffe;
    outline:none; transition:border .18s,box-shadow .18s; box-sizing:border-box; }
  .db-cost-input:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.12); }
  .db-cost-label { font-size:11px; font-weight:600; color:#374151; margin-bottom:5px;
    display:block; text-transform:uppercase; letter-spacing:.06em; }
  .db-cost-summary { display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr)); gap:14px; margin-bottom:20px; }
  .db-cost-stat { background:#fff; border:1.5px solid #bbf7d0; border-radius:14px;
    padding:18px 20px; position:relative; overflow:hidden;
    opacity:0; animation:db-fadeUp .5s ease forwards; }
  .db-cost-stat::before { content:''; position:absolute; top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,#16a34a,#4ade80); }
  .db-cost-stat-label { font-size:10px; font-weight:700; letter-spacing:.1em;
    text-transform:uppercase; color:#9ca3af; margin-bottom:6px; }
  .db-cost-stat-value { font-size:22px; font-weight:800; color:#15803d; line-height:1; }
  .db-cost-stat-unit  { font-size:12px; font-weight:500; color:#9ca3af; margin-left:3px; }
  .db-cost-progress-wrap { background:#f0fdf4; border-radius:20px; height:10px; overflow:hidden; margin-top:8px; }
  .db-cost-progress-bar { height:100%; border-radius:20px;
    background:linear-gradient(90deg,#16a34a,#4ade80);
    transition:width .8s cubic-bezier(.4,0,.2,1); }
`;

// ─── Chart helpers (identiques Poussage) ─────────────────────────────────────
const PALETTE = {
  emerald: "#16a34a", sky: "#22c55e", amber: "#4ade80", violet: "#15803d", rose: "#86efac",
  bg: "#f0fdf4", card: "#fff", border: "#bbf7d0", text: "#14532d", muted: "#6b7280",
};
const TRANCHEE_COLORS = [
  { main: "#16a34a", dim: "rgba(22,163,74,0.15)" },
  { main: "#22c55e", dim: "rgba(34,197,94,0.15)" },
  { main: "#4ade80", dim: "rgba(74,222,128,0.15)" },
  { main: "#86efac", dim: "rgba(134,239,172,0.15)" },
  { main: "#15803d", dim: "rgba(21,128,61,0.15)" },
];
const baseTooltip = {
  backgroundColor: "#fff", borderColor: "#bbf7d0", borderWidth: 1.5,
  titleColor: "#14532d", bodyColor: "#6b7280", padding: 12, cornerRadius: 10,
};
const baseGrid = { color: "rgba(22,163,74,0.07)", drawBorder: false };
const baseTick = { color: "#9ca3af", font: { family: "'Plus Jakarta Sans',sans-serif", size: 11 } };

function makeBarOpts(delayOffset = 0) {
  return {
    responsive: true,
    animation: {
      duration: 900, easing: "easeOutQuart",
      delay(ctx) { return ctx.type === "data" && ctx.mode === "default" ? ctx.dataIndex * 80 + delayOffset : 0; }
    },
    plugins: {
      legend: { display: false },
      tooltip: { ...baseTooltip, callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString()} t` } }
    },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: baseTick },
      y: {
        grid: baseGrid, border: { display: false },
        ticks: { ...baseTick, callback: (v) => v.toLocaleString() },
        title: { display: true, text: "Volume (t)", color: PALETTE.muted, font: { size: 10 } }
      },
    },
  };
}
const doughnutOpts = {
  responsive: true, cutout: "68%", animation: { duration: 1200, easing: "easeOutBack" },
  plugins: {
    legend: {
      position: "bottom", labels: {
        color: PALETTE.muted,
        font: { family: "'Plus Jakarta Sans',sans-serif", size: 11 }, padding: 14, usePointStyle: true, pointStyleWidth: 7
      }
    },
    tooltip: { ...baseTooltip, callbacks: { label: (c) => ` ${c.label}: ${c.parsed.toLocaleString()} t` } },
  },
};

function AnimCount({ target, duration = 1100 }) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const t0 = performance.now();
    const run = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return val.toLocaleString();
}

// ─── State initial casement ───────────────────────────────────────────────────
const EMPTY_FORM = {
  date: "", panneau: "", tranchee: "", niveau: "",
  volume_casse: "", granulometrie: "", type_roche: "", nombreCoups: "",
  equipements: [], conducteur: "", matricule: "",
  heureDebut: "", heureFin: "", temps: "", poste: "",
  etatMachine: "En marche", typeArret: "",
  heureDebutArret: "", heureFinArret: "",
};

function calcTemps(debut, fin) {
  if (!debut || !fin) return "";
  const [dh, dm] = debut.split(":").map(Number);
  const [fh, fm] = fin.split(":").map(Number);
  const mins = (fh * 60 + fm) - (dh * 60 + dm);
  return mins > 0 ? (mins / 60).toFixed(2) : "";
}

// ═══════════════════════════════════════════════════════════════════════════════
function StatistiqueCasement() {
  const dispatch = useDispatch();
  const casements = useSelector((s) => s.casement?.list || []);

  // Load data from API on mount
  useEffect(() => {
    dispatch(fetchCasements());
  }, [dispatch]);

  const location = useLocation();
  const navigate = useNavigate();

  // Navigation identique à DashboardComplet Poussage
  const activeTab = location.pathname.endsWith("historique") ? "historique"
    : location.pathname.endsWith("couts") ? "couts"
      : location.pathname.endsWith("rapport") ? "rapport"
        : "overview";

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  // ── Équipements CASEMENT ──────────────────────────────────────────────────
  const [equipOpts, setEquipOpts] = useState(["7500M1", "7500M2", "P&H1", "P&H2", "200B1"]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [annualCost, setAnnualCost] = useState(500000);
  const [meterCost, setMeterCost] = useState(120);
  const [costSaved, setCostSaved] = useState({ annualCost: 500000, meterCost: 120 });

  const resetForm = () => setFormData(EMPTY_FORM);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    if (name === "heureDebut" || name === "heureFin") {
      const debut = name === "heureDebut" ? value : formData.heureDebut;
      const fin = name === "heureFin" ? value : formData.heureFin;
      updated.temps = calcTemps(debut, fin);
    }
    setFormData(updated);
  };

  const toggleEquip = (eq) => setFormData({
    ...formData,
    equipements: formData.equipements.includes(eq)
      ? formData.equipements.filter(x => x !== eq)
      : [...formData.equipements, eq],
  });

  const addEquip = () => {
    const n = prompt("Nom du nouvel équipement");
    if (n && !equipOpts.includes(n)) setEquipOpts([...equipOpts, n]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex !== null) {
      const item = casements[editIndex];
      if (item?.id) {
        dispatch(updateCasementAsync({ id: item.id, data: formData }));
      }
      setEditIndex(null);
    } else {
      dispatch(addCasementAsync(formData));
    }
    resetForm(); setShowForm(false);
  };

  const handleEdit = (c, i) => {
    setFormData({ ...EMPTY_FORM, ...c, equipements: c.equipements || [] });
    setEditIndex(i); setShowForm(true);
    navigate("/operations/casement/statistique");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (i) => {
    const item = casements[i];
    if (item?.id && window.confirm("Supprimer cette opération ?")) {
      dispatch(deleteCasementAsync(item.id));
    }
  };

  // Rendement instantané basé sur volume_casse
  const rendement = formData.temps > 0 ? (formData.volume_casse / formData.temps).toFixed(2) : 0;

  // ── Statistiques ─────────────────────────────────────────────────────────
  const totalVolume = casements.reduce((a, c) => a + Number(c.volume_casse || 0), 0);
  const totalTemps = casements.reduce((a, c) => a + Number(c.temps || 0), 0);
  const totalCoups = casements.reduce((a, c) => a + Number(c.nombreCoups || 0), 0);
  const totalOps = casements.length;
  const rendMoyen = totalOps > 0
    ? (casements.reduce((a, c) => {
      const v = Number(c.volume_casse || 0), t = Number(c.temps || 0);
      return a + (t > 0 ? v / t : 0);
    }, 0) / totalOps).toFixed(2)
    : 0;
  const enMarcheCnt = casements.filter(c => c.etatMachine === "En marche").length;

  // Engins
  const enginStats = {};
  casements.forEach(c => (c.equipements || []).forEach(eq => {
    enginStats[eq] = (enginStats[eq] || 0) + Number(c.volume_casse || 0);
  }));
  const enginLabels = Object.keys(enginStats);
  const enginVolumes = Object.values(enginStats);

  const enginBarData = {
    labels: enginLabels,
    datasets: [{
      label: "Volume (t)", data: enginVolumes,
      backgroundColor: (ctx) => {
        const { chartArea, ctx: c } = ctx.chart;
        if (!chartArea) return PALETTE.emerald;
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, "#16a34a"); g.addColorStop(1, "#4ade80"); return g;
      },
      borderRadius: { topLeft: 8, topRight: 8 }, borderSkipped: false,
      barPercentage: 0.6, categoryPercentage: 0.7,
    }],
  };
  const enginDoughnutData = {
    labels: enginLabels,
    datasets: [{
      data: enginVolumes,
      backgroundColor: ["#16a34a", "#22c55e", "#4ade80", "#86efac", "#15803d"],
      borderWidth: 0, hoverOffset: 10
    }],
  };

  // Tranchées
  const trancheeGroups = {};
  casements.forEach(c => {
    const t = c.tranchee || "Non défini";
    if (!trancheeGroups[t]) trancheeGroups[t] = [];
    trancheeGroups[t].push(c);
  });
  const trancheeKeys = Object.keys(trancheeGroups);
  const trancheeVolumes = trancheeKeys.map(t =>
    trancheeGroups[t].reduce((s, op) => s + Number(op.volume_casse || 0), 0)
  );
  const trancheeBarData = {
    labels: trancheeKeys,
    datasets: [{
      label: "Volume total (t)", data: trancheeVolumes,
      backgroundColor: (ctx) => {
        const { chartArea, ctx: c } = ctx.chart;
        if (!chartArea) return "#22c55e";
        const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        g.addColorStop(0, "#22c55e"); g.addColorStop(1, "#86efac"); return g;
      },
      borderRadius: { topLeft: 8, topRight: 8 }, borderSkipped: false,
      barPercentage: 0.55, categoryPercentage: 0.7,
    }],
  };

  const recentCasements = [...casements].slice(-5).reverse();

  // Export Excel
  const exportExcel = () => {
    const data = casements.map(c => ({
      Date: c.date, Panneau: c.panneau, Tranchée: c.tranchee, Niveau: c.niveau,
      "Type Roche": c.type_roche, "Granulométrie(mm)": c.granulometrie,
      "Nb Coups BRH": c.nombreCoups,
      Équipements: c.equipements?.join(", "),
      Conducteur: c.conducteur, Matricule: c.matricule, Poste: c.poste,
      "Volume Cassé(t)": c.volume_casse, "Heures Marche": c.temps,
      Rendement: c.temps > 0 ? (c.volume_casse / c.temps).toFixed(2) : 0,
      État: c.etatMachine, "Nature Arrêt": c.typeArret || "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Casement");
    saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    }),
      "historique_casement.xlsx");
  };

  const anim = (delay) => ({
    style: { animationDelay: delay },
    ref: (el) => { if (el) el.style.animationDelay = delay; },
  });

  // ─── Table complète (identique Poussage, colonnes casement) ──────────────
  const FullTable = ({ data, showActions = false }) => (
    <div className="db-table-wrap">
      <table className="db-table">
        <thead>
          <tr>
            <th>Date</th><th>Panneau</th><th>Tranchée</th><th>Niveau</th>
            <th>Type Roche</th><th>Granulo.(mm)</th><th>Nb Coups</th>
            <th>Volume (t)</th><th>Équipements</th>
            <th>Conducteur</th><th>Matricule</th><th>Poste</th>
            <th>Heures</th><th>Rendement</th><th>État</th><th>Arrêt</th>
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={i} style={{ animationDelay: `${i * 0.04}s` }}>
              <td>{c.date}</td>
              <td>{c.panneau}</td>
              <td>{c.tranchee}</td>
              <td>{c.niveau}</td>
              <td>{c.type_roche}</td>
              <td>{c.granulometrie}</td>
              <td><strong>{c.nombreCoups}</strong></td>
              <td><strong>{Number(c.volume_casse).toLocaleString()}</strong></td>
              <td style={{ maxWidth: 130, overflow: "hidden", textOverflow: "ellipsis" }}>
                {c.equipements?.join(", ")}
              </td>
              <td>{c.conducteur}</td>
              <td>{c.matricule}</td>
              <td>{c.poste}</td>
              <td>{c.temps} h</td>
              <td>{c.temps > 0 ? (c.volume_casse / c.temps).toFixed(2) : 0} t/h</td>
              <td>
                <span className={c.etatMachine === "En marche" ? "badge-marche" : "badge-arret"}>
                  {c.etatMachine}
                </span>
              </td>
              <td style={{ color: "#9ca3af", fontSize: 12 }}>{c.typeArret || "—"}</td>
              {showActions && (
                <td>
                  <button className="db-btn-edit" onClick={() => handleEdit(c, casements.indexOf(c))}>✏️ Modifier</button>
                  <button className="db-btn-del" onClick={() => handleDelete(casements.indexOf(c))}>🗑️ Supprimer</button>
                </td>
              )}
            </tr>
          ))}
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
              value={formData.date} onChange={handleChange} required /></div>
          <div><label className="db-form-label">Panneau</label>
            <input className="db-form-input" type="text" name="panneau"
              value={formData.panneau} onChange={handleChange} /></div>
          <div><label className="db-form-label">Tranchée</label>
            <input className="db-form-input" type="text" name="tranchee"
              value={formData.tranchee} onChange={handleChange} /></div>
          <div><label className="db-form-label">Niveau</label>
            <input className="db-form-input" type="text" name="niveau"
              value={formData.niveau} onChange={handleChange} /></div>
          <div><label className="db-form-label">Volume Cassé (t)</label>
            <input className="db-form-input" type="number" name="volume_casse"
              value={formData.volume_casse} onChange={handleChange} required /></div>
          <div><label className="db-form-label">Granulométrie (mm)</label>
            <input className="db-form-input" type="number" name="granulometrie"
              value={formData.granulometrie} onChange={handleChange} /></div>
          <div><label className="db-form-label">Type de Roche</label>
            <select className="db-form-select" name="type_roche"
              value={formData.type_roche} onChange={handleChange}>
              <option value="">— Sélectionner —</option>
              <option>Phosphate</option><option>Silex</option>
              <option>Calcaire</option><option>Argile</option><option>Mixte</option>
            </select></div>
          <div><label className="db-form-label">Nombre de Coups BRH</label>
            <input className="db-form-input" type="number" name="nombreCoups"
              placeholder="coups BRH" value={formData.nombreCoups} onChange={handleChange} /></div>
          <div><label className="db-form-label">Heure de Début</label>
            <input className="db-form-input" type="time" name="heureDebut"
              value={formData.heureDebut} onChange={handleChange} /></div>
          <div><label className="db-form-label">Heure de Fin</label>
            <input className="db-form-input" type="time" name="heureFin"
              value={formData.heureFin} onChange={handleChange} /></div>
          <div><label className="db-form-label">
            Heures de Marche <span className="db-auto-badge">AUTO</span>
          </label>
            <input className="db-form-input" type="number" name="temps"
              value={formData.temps} onChange={handleChange}
              placeholder="Calculé automatiquement"
              readOnly={!!(formData.heureDebut && formData.heureFin)} required /></div>
          <div><label className="db-form-label">Conducteur</label>
            <input className="db-form-input" type="text" name="conducteur"
              value={formData.conducteur} onChange={handleChange} /></div>
          <div><label className="db-form-label">Matricule</label>
            <input className="db-form-input" type="text" name="matricule"
              value={formData.matricule} onChange={handleChange} /></div>
          <div><label className="db-form-label">Poste</label>
            <input className="db-form-input" type="text" name="poste"
              placeholder="Matin / Après-midi / Nuit"
              value={formData.poste} onChange={handleChange} /></div>
          <div><label className="db-form-label">État Machine</label>
            <select className="db-form-select" name="etatMachine"
              value={formData.etatMachine} onChange={handleChange}>
              <option>En marche</option>
              <option>En arrêt</option>
            </select></div>
          {formData.etatMachine === "En arrêt" && (<>
            <div><label className="db-form-label">Nature d'arrêt</label>
              <input className="db-form-input" type="text" name="typeArret"
                value={formData.typeArret} onChange={handleChange} /></div>
            <div><label className="db-form-label">Heure Début Arrêt</label>
              <input className="db-form-input" type="time" name="heureDebutArret"
                value={formData.heureDebutArret} onChange={handleChange} /></div>
            <div><label className="db-form-label">Heure Fin Arrêt</label>
              <input className="db-form-input" type="time" name="heureFinArret"
                value={formData.heureFinArret} onChange={handleChange} /></div>
          </>)}
        </div>

        {/* Équipements CASEMENT */}
        <div style={{ marginTop: 18 }}>
          <label className="db-form-label">Équipements</label>
          <div className="db-equip-grid">
            {equipOpts.map((eq, i) => (
              <div key={i}
                className={`db-equip-chip${formData.equipements.includes(eq) ? " selected" : ""}`}
                onClick={() => toggleEquip(eq)}>
                {eq}
              </div>
            ))}
            <button type="button" className="db-equip-add" onClick={addEquip}>＋ Ajouter</button>
          </div>
        </div>

        <div className="db-rendement-banner" style={{ marginTop: 20 }}>
          <div className="db-rendement-value">{rendement}</div>
          <div className="db-rendement-label">t/h — Rendement instantané</div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button type="submit" className="db-btn-primary">
            {editIndex !== null ? "💾 Mettre à jour" : "✅ Enregistrer"}
          </button>
          <button type="button" className="db-btn-secondary"
            onClick={() => { setShowForm(false); resetForm(); setEditIndex(null); }}>
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
      <div className="db-page" style={{
        minHeight: "100vh", background: PALETTE.bg,
        padding: "28px 24px 60px", color: PALETTE.text,
      }}>

        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="db-card" style={{
          marginBottom: 24, padding: "18px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          ...anim("0s").style,
        }}>
          <div>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: ".16em",
              textTransform: "uppercase", color: PALETTE.muted, marginBottom: 4
            }}>
              Tableau de bord
            </div>
            <h1 style={{
              margin: 0, fontSize: 24, fontWeight: 800,
              background: "linear-gradient(135deg,#15803d,#22c55e)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
            }}>
              Gestion Casement <span style={{ WebkitTextFillColor: "#16a34a" }}>ZD11</span>
            </h1>
          </div>
          <img src={image} alt="logo" style={{
            height: 46, borderRadius: 10, boxShadow: "0 4px 14px rgba(22,163,74,0.2)",
          }} />
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {activeTab === "overview" && (
          <>
            <div className="db-grid3" style={{ marginBottom: 24 }}>
              {[
                { icon: "🪨", label: "Volume Cassé", value: totalVolume, unit: "t", accent: "#16a34a", delay: "0.08s" },
                { icon: "⏱️", label: "Temps Total", value: totalTemps, unit: "h", accent: "#15803d", delay: "0.16s" },
                { icon: "📈", label: "Rendement Moyen", value: parseFloat(rendMoyen), unit: "t/h", accent: "#22c55e", delay: "0.24s" },
                { icon: "🔢", label: "Opérations", value: totalOps, unit: "op", accent: "#4ade80", delay: "0.32s" },
                { icon: "✅", label: "En Marche", value: enMarcheCnt, unit: "", accent: "#86efac", delay: "0.40s" },
              ].map(({ icon, label, value, unit, accent, delay }) => (
                <div key={label} className="db-kpi" style={{ animationDelay: delay }}>
                  <div className="db-kpi-shimmer" />
                  <div className="db-kpi-icon">{icon}</div>
                  <div className="db-kpi-label">{label}</div>
                  <div className="db-kpi-value" style={{ color: accent, animationDelay: delay }}>
                    <AnimCount target={value} /><span className="db-kpi-unit">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="db-grid2" style={{ marginBottom: 20 }}>
              <div className="db-card" {...anim("0.18s")}>
                <div className="db-card-header">
                  <div><p className="db-card-title">Volume par Engin</p>
                    <p className="db-card-sub">Cumul de tous les casetments</p></div>
                  {enginLabels.length > 0 && <span className="db-pill">{enginLabels.length} engins</span>}
                </div>
                {enginLabels.length > 0 ? <Bar data={enginBarData} options={makeBarOpts(300)} />
                  : <div className="db-empty">Aucune donnée</div>}
              </div>
              <div className="db-card" {...anim("0.28s")}>
                <div className="db-card-header">
                  <div><p className="db-card-title">Répartition par Engin</p>
                    <p className="db-card-sub">Distribution proportionnelle</p></div>
                </div>
                {enginLabels.length > 0
                  ? <div style={{ maxWidth: 280, margin: "0 auto" }}><Doughnut data={enginDoughnutData} options={doughnutOpts} /></div>
                  : <div className="db-empty">Aucune donnée</div>}
              </div>
            </div>

            {trancheeKeys.length > 0 && (
              <div className="db-card" {...anim("0.36s")} style={{ marginBottom: 20 }}>
                <p className="db-card-title">Volume Total par Tranchée</p>
                <p className="db-card-sub">Comparaison globale des volumes cassés</p>
                <Bar data={trancheeBarData} options={makeBarOpts(200)} />
              </div>
            )}

            <div className="db-section">Dernières opérations</div>
            <div className="db-card" {...anim("0.42s")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <p className="db-card-title" style={{ margin: 0 }}>
                  {recentCasements.length} opération{recentCasements.length !== 1 ? "s" : ""} récentes
                </p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="db-btn-secondary"
                    onClick={() => navigate("/operations/casement/historique")}
                    style={{ fontSize: 12, padding: "6px 12px" }}>Voir tout →</button>
                  <button className="db-btn-primary"
                    onClick={() => navigate("/operations/casement")}
                    style={{ fontSize: 12, padding: "6px 12px" }}>+ Ajouter</button>
                </div>
              </div>
              {recentCasements.length > 0 ? (
                <div className="db-table-wrap">
                  <table className="db-table">
                    <thead><tr>
                      <th>Date</th><th>Panneau</th><th>Tranchée</th>
                      <th>Volume</th><th>Rendement</th><th>État</th>
                    </tr></thead>
                    <tbody>
                      {recentCasements.map((c, i) => (
                        <tr key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                          <td>{c.date}</td><td>{c.panneau}</td><td>{c.tranchee}</td>
                          <td><strong>{Number(c.volume_casse).toLocaleString()}</strong> t</td>
                          <td>{c.temps > 0 ? (c.volume_casse / c.temps).toFixed(2) : 0} t/h</td>
                          <td><span className={c.etatMachine === "En marche" ? "badge-marche" : "badge-arret"}>
                            {c.etatMachine}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <div className="db-empty">Aucune opération enregistrée</div>}
            </div>
          </>
        )}

        {/* ══ SAISIE (Dashboard → formData) ════════════════════════════════ */}
        {activeTab === "saisie" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: PALETTE.text }}>
                {editIndex !== null ? "✏️ Modifier le casement" : "➕ Nouveau casement"}
              </h2>
              {!showForm && (
                <button className="db-btn-primary" onClick={() => setShowForm(true)}>
                  ＋ Ajouter les données
                </button>
              )}
            </div>
            {showForm && <FormBlock />}
            <div className="db-section">Liste des casements</div>
            <div className="db-card" {...anim("0.1s")}>
              {casements.length > 0
                ? <FullTable data={casements} showActions={true} />
                : <div className="db-empty">Aucun casement enregistré. Cliquez sur "Ajouter les données" pour commencer.</div>}
            </div>
          </>
        )}

        {/* ══ HISTORIQUE ═══════════════════════════════════════════════════ */}
        {activeTab === "historique" && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: PALETTE.text }}>
                Historique Casement — {casements.length} enregistrement{casements.length !== 1 ? "s" : ""}
              </h2>
              <div style={{ display: "flex", gap: 8 }}>
                {!showForm && (
                  <button className="db-btn-primary" onClick={() => setShowForm(true)}>
                    ＋ Ajouter
                  </button>
                )}
                <button className="db-btn-excel" onClick={exportExcel}>⬇️ Télécharger Excel</button>
              </div>
            </div>
            {showForm && <FormBlock />}
            <div className="db-card" {...anim("0.1s")}>
              {casements.length > 0
                ? <FullTable data={[...casements].reverse()} showActions={true} />
                : <div className="db-empty">Aucun historique disponible.</div>}
            </div>
          </>
        )}

        {/* ══ STATISTIQUES ═════════════════════════════════════════════════ */}
        {(activeTab === "stats" || activeTab === "overview" && false) && (
          <>
            <div className="db-grid3" style={{ marginBottom: 24 }}>
              {[
                { icon: "🪨", label: "Volume Cassé", value: totalVolume, unit: "t", accent: "#16a34a", delay: "0.08s" },
                { icon: "⏱️", label: "Temps Total", value: totalTemps, unit: "h", accent: "#15803d", delay: "0.16s" },
                { icon: "📈", label: "Rendement Moyen", value: parseFloat(rendMoyen), unit: "t/h", accent: "#22c55e", delay: "0.24s" },
              ].map(({ icon, label, value, unit, accent, delay }) => (
                <div key={label} className="db-kpi" style={{ animationDelay: delay }}>
                  <div className="db-kpi-shimmer" />
                  <div className="db-kpi-icon">{icon}</div>
                  <div className="db-kpi-label">{label}</div>
                  <div className="db-kpi-value" style={{ color: accent, animationDelay: delay }}>
                    <AnimCount target={value} /><span className="db-kpi-unit">{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="db-section">Analyse par Engin</div>
            <div className="db-grid2" style={{ marginBottom: 20 }}>
              <div className="db-card" {...anim("0.18s")}>
                <div className="db-card-header">
                  <div><p className="db-card-title">Volume par Engin</p>
                    <p className="db-card-sub">Répartition cumulative du volume cassé</p></div>
                  {enginLabels.length > 0 && <span className="db-pill">{enginLabels.length} engins</span>}
                </div>
                {enginLabels.length > 0 ? <Bar data={enginBarData} options={makeBarOpts(300)} />
                  : <div className="db-empty">Aucune donnée disponible</div>}
              </div>
              <div className="db-card" {...anim("0.28s")}>
                <p className="db-card-title">Part de Volume par Engin</p>
                <p className="db-card-sub">Distribution proportionnelle</p>
                {enginLabels.length > 0
                  ? <div style={{ maxWidth: 300, margin: "0 auto" }}><Doughnut data={enginDoughnutData} options={doughnutOpts} /></div>
                  : <div className="db-empty">Aucune donnée disponible</div>}
              </div>
            </div>

            <div className="db-section">Analyse par Tranchée</div>
            {trancheeKeys.length > 0 && (
              <div className="db-card" {...anim("0.32s")} style={{ marginBottom: 20 }}>
                <p className="db-card-title">Volume Total par Tranchée</p>
                <p className="db-card-sub">Comparaison globale des volumes cassés</p>
                <Bar data={trancheeBarData} options={makeBarOpts(200)} />
              </div>
            )}
            <div className="db-grid2">
              {trancheeKeys.map((tranchee, idx) => {
                const ops = trancheeGroups[tranchee];
                const color = TRANCHEE_COLORS[idx % TRANCHEE_COLORS.length];
                const labels = ops.map((_, i) => `Op ${i + 1}`);
                const volumes = ops.map(op => Number(op.volume_casse || 0));
                const lineData = {
                  labels,
                  datasets: [{
                    label: "Volume (t)", data: volumes,
                    borderColor: color.main, backgroundColor: color.dim,
                    pointBackgroundColor: color.main, pointBorderColor: "#fff",
                    pointBorderWidth: 2, pointRadius: 5, pointHoverRadius: 8,
                    borderWidth: 2.5, fill: true, tension: 0.42,
                  }],
                };
                const lineOpts = {
                  responsive: true,
                  animation: {
                    duration: 1000, easing: "easeOutQuart",
                    delay(ctx) { return ctx.type === "data" && ctx.mode === "default" ? ctx.dataIndex * 60 + idx * 100 : 0; }
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: { ...baseTooltip, callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString()} t` } }
                  },
                  scales: {
                    x: { grid: { display: false }, border: { display: false }, ticks: baseTick },
                    y: { grid: baseGrid, border: { display: false }, ticks: baseTick },
                  },
                };
                return (
                  <div key={tranchee} className="db-card"
                    ref={(el) => { if (el) el.style.animationDelay = `${0.36 + idx * 0.1}s`; }}>
                    <div className="db-card-header">
                      <div>
                        <p className="db-card-title" style={{ color: color.main }}>Tranchée {tranchee}</p>
                        <p className="db-card-sub">
                          {ops.length} opération{ops.length > 1 ? "s" : ""} · courbe d'évolution
                        </p>
                      </div>
                      <span className="db-pill" style={{ background: color.dim, color: color.main }}>
                        {volumes.reduce((a, b) => a + b, 0).toLocaleString()} t
                      </span>
                    </div>
                    <Line data={lineData} options={lineOpts} />
                  </div>
                );
              })}
              {trancheeKeys.length === 0 && (
                <div className="db-empty" style={{ gridColumn: "1/-1" }}>
                  Aucune donnée de tranchée disponible
                </div>
              )}
            </div>
          </>
        )}

        {/* ══ COÛTS ════════════════════════════════════════════════════════ */}
        {activeTab === "couts" && (() => {
          const totalCoups2 = casements.reduce((a, c) => a + Number(c.nombreCoups || 0), 0);
          const coutBRH = totalCoups2 * costSaved.meterCost;
          const coutAnnuel = costSaved.annualCost;
          const coutTotal = coutAnnuel + coutBRH;
          const pct = Math.min((coutTotal / (coutAnnuel * 1.5)) * 100, 100);
          const coutParTonne = totalVolume > 0 ? (coutTotal / totalVolume).toFixed(2) : 0;

          const monthlyMap = {};
          casements.forEach(c => {
            const m = c.date ? c.date.slice(0, 7) : "N/A";
            if (!monthlyMap[m]) monthlyMap[m] = { coups: 0, meters: 0 };
            monthlyMap[m].coups += Number(c.nombreCoups || 0);
          });
          const monthLabels = Object.keys(monthlyMap).sort();
          const monthCosts = monthLabels.map(m => monthlyMap[m].coups * costSaved.meterCost);
          const monthFixed = monthLabels.map(() => coutAnnuel / 12);

          const chartData = {
            labels: monthLabels.length > 0 ? monthLabels : ["Aucune donnée"],
            datasets: [
              {
                label: "Coût BRH (MAD)", data: monthCosts.length > 0 ? monthCosts : [0],
                backgroundColor: (ctx) => {
                  const { chartArea, ctx: c } = ctx.chart; if (!chartArea) return "#16a34a";
                  const g = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                  g.addColorStop(0, "#16a34a"); g.addColorStop(1, "#4ade80"); return g;
                },
                borderRadius: { topLeft: 8, topRight: 8 }, borderSkipped: false,
                barPercentage: 0.55, categoryPercentage: 0.7,
              },
              {
                label: "Coût Fixe Mensuel (MAD)", data: monthFixed.length > 0 ? monthFixed : [0],
                backgroundColor: "rgba(134,239,172,0.55)",
                borderRadius: { topLeft: 8, topRight: 8 }, borderSkipped: false,
                barPercentage: 0.55, categoryPercentage: 0.7,
              },
            ],
          };
          const chartOpts = {
            responsive: true,
            plugins: {
              legend: { position: "bottom", labels: { color: "#6b7280", font: { size: 11 }, padding: 14, usePointStyle: true } },
              tooltip: { ...baseTooltip, callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString()} MAD` } },
            },
            scales: {
              x: { grid: { display: false }, border: { display: false }, ticks: baseTick },
              y: {
                grid: baseGrid, border: { display: false },
                ticks: { ...baseTick, callback: (v) => `${(v / 1000).toFixed(0)}k` },
                title: { display: true, text: "MAD", color: "#9ca3af", font: { size: 10 } }
              },
            },
          };

          return (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#14532d" }}>Suivi des Coûts Casement</h2>
              </div>

              {/* KPI coûts */}
              <div className="db-cost-summary">
                {[
                  { label: "Coût Total", value: (coutTotal / 1000).toFixed(1), unit: "k MAD", delay: "0.08s" },
                  { label: "Coût BRH", value: (coutBRH / 1000).toFixed(1), unit: "k MAD", delay: "0.14s" },
                  { label: "Coût / Tonne", value: coutParTonne, unit: "MAD/t", delay: "0.20s" },
                  { label: "Coups BRH Total", value: totalCoups2.toLocaleString(), unit: "coups", delay: "0.26s" },
                ].map(({ label, value, unit, delay }) => (
                  <div key={label} className="db-cost-stat" style={{ animationDelay: delay }}>
                    <div className="db-cost-stat-label">{label}</div>
                    <div className="db-cost-stat-value">{value}<span className="db-cost-stat-unit">{unit}</span></div>
                    <div className="db-cost-progress-wrap"><div className="db-cost-progress-bar" style={{ width: `${pct}%` }} /></div>
                  </div>
                ))}
              </div>

              {/* Paramètres + Graphe */}
              <div className="db-grid2" style={{ marginBottom: 20 }}>
                <div className="db-card" style={{ animationDelay: "0.12s" }}>
                  <div className="db-card-header" style={{ marginBottom: 16 }}>
                    <div><p className="db-card-title">⚙️ Paramètres de Coût</p>
                      <p className="db-card-sub">Définissez les bases de calcul BRH</p></div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <div><label className="db-cost-label">Anticipation coût annuel (MAD)</label>
                      <input type="number" className="db-cost-input" value={annualCost}
                        onChange={(e) => setAnnualCost(Number(e.target.value))} /></div>
                    <div><label className="db-cost-label">Prix fixe par coup BRH (MAD)</label>
                      <input type="number" className="db-cost-input" value={meterCost}
                        onChange={(e) => setMeterCost(Number(e.target.value))} /></div>
                    <div style={{ paddingTop: 4 }}>
                      <button className="db-btn-primary"
                        onClick={() => setCostSaved({ annualCost, meterCost })}
                        style={{ width: "100%", justifyContent: "center" }}>
                        ✅ Mettre à jour les calculs
                      </button>
                    </div>
                    {/* Aperçu live */}
                    <div style={{
                      background: "#f0fdf4", borderRadius: 12, padding: "14px 16px",
                      border: "1.5px solid #bbf7d0", marginTop: 4
                    }}>
                      <div style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: ".1em",
                        textTransform: "uppercase", color: "#9ca3af", marginBottom: 8
                      }}>Aperçu en direct</div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151", marginBottom: 4 }}>
                        <span>Coût mensuel estimé</span>
                        <strong style={{ color: "#15803d" }}>{(annualCost / 12).toLocaleString(undefined, { maximumFractionDigits: 0 })} MAD</strong>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#374151" }}>
                        <span>Coût BRH total ({totalCoups2} coups)</span>
                        <strong style={{ color: "#15803d" }}>{(totalCoups2 * meterCost).toLocaleString()} MAD</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="db-card" style={{ animationDelay: "0.22s" }}>
                  <div className="db-card-header" style={{ marginBottom: 16 }}>
                    <div><p className="db-card-title">📊 Évolution Mensuelle des Coûts</p>
                      <p className="db-card-sub">Coût BRH vs coût fixe mensuel</p></div>
                    {monthLabels.length > 0 && <span className="db-pill">{monthLabels.length} mois</span>}
                  </div>
                  {monthLabels.length > 0
                    ? <Bar data={chartData} options={chartOpts} />
                    : <div className="db-empty">Aucune donnée — ajoutez des casements</div>}
                </div>
              </div>

              {/* Détail par opération */}
              <div className="db-section">Détail des coûts par opération</div>
              <div className="db-card" style={{ animationDelay: "0.28s" }}>
                {casements.length > 0 ? (
                  <div className="db-table-wrap">
                    <table className="db-table">
                      <thead><tr>
                        <th>Date</th><th>Panneau</th><th>Tranchée</th>
                        <th>Type Roche</th><th>Coups BRH</th>
                        <th>Coût BRH</th><th>Volume (t)</th>
                        <th>Coût/Tonne</th><th>État</th>
                      </tr></thead>
                      <tbody>
                        {[...casements].reverse().map((c, i) => {
                          const coups = Number(c.nombreCoups || 0);
                          const coutOp = coups * costSaved.meterCost;
                          const vol = Number(c.volume_casse || 0);
                          const coutT = vol > 0 ? (coutOp / vol).toFixed(2) : "—";
                          return (
                            <tr key={i} style={{ animationDelay: `${i * 0.03}s` }}>
                              <td>{c.date}</td><td>{c.panneau}</td><td>{c.tranchee}</td>
                              <td>{c.type_roche}</td>
                              <td><strong>{coups}</strong></td>
                              <td><strong style={{ color: "#15803d" }}>{coutOp.toLocaleString()}</strong> MAD</td>
                              <td>{vol.toLocaleString()} t</td>
                              <td>{coutT !== "—" ? `${coutT} MAD/t` : "—"}</td>
                              <td><span className={c.etatMachine === "En marche" ? "badge-marche" : "badge-arret"}>
                                {c.etatMachine}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : <div className="db-empty">Aucune opération enregistrée</div>}
              </div>
            </>
          );
        })()}

      </div>
    </>
  );
}

export default StatistiqueCasement;