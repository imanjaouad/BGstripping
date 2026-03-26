import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransportJournaliers, deleteTransportJournalier, updateTransportJournalier } from "../../features/transportSlice";
import { fetchPoussages } from "../../features/poussageSlice";
import { FaBolt, FaHardHat, FaTruck, FaTruckLoading, FaChartBar, FaFileExcel, FaFilePdf, FaInbox, FaSpinner, FaEdit, FaTrashAlt, FaTimes, FaSave } from "react-icons/fa";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, Title, Tooltip, Legend, Filler, ArcElement,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import image from "../../images/ocpLogo.png";
import TransportSidebar from "./TransportSidebar";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, ArcElement);

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  @keyframes ts-fadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ts-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes ts-pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(22,163,74,0)} 50%{box-shadow:0 0 20px 5px rgba(22,163,74,0.18)} }
  @keyframes ts-countUp { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
  @keyframes ts-rowIn   { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }

  .ts-page { font-family:'Plus Jakarta Sans',sans-serif; }

  .ts-kpi {
    background:#fff; border:1.5px solid #bbf7d0; border-radius:16px;
    padding:20px 22px; position:relative; overflow:hidden;
    opacity:1; animation:ts-fadeUp .5s ease both;
    transition:transform .2s,box-shadow .2s; cursor:default;
  }
  .ts-kpi:hover { transform:translateY(-5px); }
  .ts-kpi::before { content:''; position:absolute; top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,#16a34a,#4ade80,#16a34a);
    background-size:200%; animation:ts-shimmer 2.4s linear infinite; }
  .ts-kpi::after { content:''; position:absolute; inset:0; border-radius:inherit; pointer-events:none; opacity:0; }
  .ts-kpi:hover::after { opacity:1; animation:ts-pulse 2s ease infinite; }
  .ts-kpi-shimmer { position:absolute;inset:0;
    background:linear-gradient(100deg,transparent 25%,rgba(255,255,255,.6) 50%,transparent 75%);
    background-size:600px 100%;animation:ts-shimmer 2.8s linear infinite;pointer-events:none; }
  .ts-kpi-icon { width:36px;height:36px;background:#dcfce7;border-radius:10px;
    display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:12px; }
  .ts-kpi-label { font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
    color:#9ca3af;margin-bottom:6px; }
  .ts-kpi-value { font-size:28px;font-weight:800;color:#15803d;line-height:1;
    animation:ts-countUp .55s cubic-bezier(.34,1.56,.64,1) both; }
  .ts-kpi-unit { font-size:13px;font-weight:500;color:#9ca3af;margin-left:3px; }

  .ts-card {
    background:#fff; border:1.5px solid #bbf7d0; border-radius:16px;
    padding:24px 22px 20px; opacity:0; animation:ts-fadeUp .55s ease forwards;
    transition:box-shadow .2s,transform .2s;
  }
  .ts-card:hover { transform:translateY(-2px); box-shadow:0 10px 32px rgba(22,163,74,0.11); }
  .ts-card-title { font-size:14px;font-weight:700;color:#14532d;margin:0 0 3px; }
  .ts-card-sub   { font-size:11px;color:#9ca3af;margin:0 0 18px; }
  .ts-card-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px; }
  .ts-pill { background:#dcfce7;color:#16a34a;font-size:11px;font-weight:600;
    padding:3px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0; }

  .ts-section { font-size:10px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
    color:#16a34a;margin:28px 0 14px;display:flex;align-items:center;gap:10px; }
  .ts-section::after { content:'';flex:1;height:1px;background:#bbf7d0; }

  .ts-grid2 { display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:20px; }
  .ts-grid3 { display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px; }
  .ts-grid4 { display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:14px; }

  .ts-table-wrap { overflow-x:auto; border-radius:12px; border:1.5px solid #bbf7d0; }
  .ts-table { width:100%;border-collapse:collapse;font-size:11.5px; }
  .ts-table thead tr { background:#15803d; }
  .ts-table th { padding:10px 8px;text-align:left;font-size:9.5px;font-weight:700;
    letter-spacing:.05em;text-transform:uppercase;color:#fff;white-space:nowrap; }
  .ts-table tbody tr { border-bottom:1px solid #f0fdf4; animation:ts-rowIn .4s ease both; transition:background .15s; }
  .ts-table tbody tr:hover { background:#f0fdf4; }
  .ts-table tbody tr:last-child { border-bottom:none; }
  .ts-table td { padding:8px 8px;color:#374151;vertical-align:middle;white-space:nowrap; }
  .ts-table td:first-child { font-weight:600;color:#14532d; }

  .ts-btn-excel { background:#166534;color:#fff;border:none;border-radius:10px;
    padding:8px 16px;font-size:13px;font-weight:600;cursor:pointer;
    display:inline-flex;align-items:center;gap:6px;transition:all .18s; }
  .ts-btn-excel:hover { background:#15803d;transform:translateY(-1px); }

  .ts-filter-wrap { display:flex; gap:10px; align-items:center; flex-wrap:wrap; }
  .ts-select { padding:6px 12px; border-radius:8px; border:1.5px solid #bbf7d0;
    font-size:12px; color:#14532d; background:#fff; outline:none; cursor:pointer; }
  .ts-select:focus { border-color:#16a34a; }
  .ts-date { padding:6px 12px; border-radius:8px; border:1.5px solid #bbf7d0;
    font-size:12px; color:#14532d; background:#fff; outline:none;
    font-family:'Plus Jakarta Sans',sans-serif; }
  .ts-date:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.1); }

  .ts-empty { text-align:center; padding:48px 0; color:#9ca3af; font-size:14px; }

  .ts-progress-wrap { background:#f0fdf4; border-radius:20px; height:8px; overflow:hidden; margin-top:6px; }
  .ts-progress-bar  { height:100%; border-radius:20px;
    background:linear-gradient(90deg,#16a34a,#4ade80);
    transition:width .8s cubic-bezier(.4,0,.2,1); }

  /* ── CRUD Buttons ── */
  .ts-btn-edit {
    background:#eff6ff; color:#2563eb; border:1.5px solid #bfdbfe;
    border-radius:8px; padding:5px 11px; font-size:12px; font-weight:600;
    cursor:pointer; display:inline-flex; align-items:center; gap:5px;
    transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ts-btn-edit:hover { background:#dbeafe; border-color:#2563eb; transform:translateY(-1px); }

  .ts-btn-del {
    background:#fff5f5; color:#dc2626; border:1.5px solid #fecaca;
    border-radius:8px; padding:5px 11px; font-size:12px; font-weight:600;
    cursor:pointer; display:inline-flex; align-items:center; gap:5px;
    transition:all .18s; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ts-btn-del:hover { background:#fee2e2; border-color:#dc2626; transform:translateY(-1px); }

  /* ── Modal ── */
  .ts-modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,0.45);
    display:flex; align-items:center; justify-content:center;
    z-index:9999; animation:ts-fadeUp .2s ease;
    backdrop-filter:blur(3px);
  }
  .ts-modal {
    background:#fff; border-radius:20px; padding:32px;
    width:100%; max-width:560px; box-shadow:0 24px 80px rgba(22,163,74,0.18);
    border:1.5px solid #bbf7d0; position:relative;
    animation:ts-fadeUp .25s cubic-bezier(.34,1.56,.64,1) both;
  }
  .ts-modal-title { font-size:18px; font-weight:800; color:#14532d; margin:0 0 4px; }
  .ts-modal-sub   { font-size:12px; color:#9ca3af; margin:0 0 24px; }
  .ts-modal-grid  { display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:24px; }
  .ts-modal-label { font-size:10px; font-weight:700; color:#4b5563; text-transform:uppercase; letter-spacing:.06em; display:block; margin-bottom:5px; }
  .ts-modal-input {
    width:100%; border:1.5px solid #d1fae5; border-radius:8px;
    padding:9px 12px; font-size:13px; color:#1f2937;
    background:#f8fafc; outline:none; transition:all .2s;
    box-sizing:border-box; font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ts-modal-input:focus { border-color:#16a34a; background:#fff; box-shadow:0 0 0 3px rgba(22,163,74,0.1); }
  .ts-modal-input[readonly] { background:#f0fdf4; color:#15803d; font-weight:600; }
  .ts-modal-actions { display:flex; gap:10px; justify-content:flex-end; }
  .ts-modal-close {
    position:absolute; top:16px; right:16px;
    background:#f3f4f6; border:none; border-radius:50%;
    width:32px; height:32px; display:flex; align-items:center; justify-content:center;
    cursor:pointer; color:#6b7280; font-size:14px; transition:all .18s;
  }
  .ts-modal-close:hover { background:#e5e7eb; color:#111; }
  .ts-btn-save {
    background:#16a34a; color:#fff; border:none; border-radius:10px;
    padding:10px 22px; font-size:13px; font-weight:700; cursor:pointer;
    display:inline-flex; align-items:center; gap:7px; transition:all .18s;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ts-btn-save:hover { background:#15803d; transform:translateY(-1px); }
  .ts-btn-save:disabled { opacity:.6; cursor:not-allowed; transform:none; }
  .ts-btn-cancel2 {
    background:#f3f4f6; color:#4b5563; border:none; border-radius:10px;
    padding:10px 22px; font-size:13px; font-weight:700; cursor:pointer;
    display:inline-flex; align-items:center; gap:7px; transition:all .18s;
    font-family:'Plus Jakarta Sans',sans-serif;
  }
  .ts-btn-cancel2:hover { background:#e5e7eb; }
`;

const COLOR_PALETTE = [
  "#16a34a", "#2563eb", "#f59e0b", "#dc2626", "#8b5cf6",
  "#0891b2", "#ea580c", "#db2777", "#65a30d", "#7c3aed",
  "#0d9488", "#b45309",
];

const baseTooltip = {
  backgroundColor: "#fff", borderColor: "#bbf7d0", borderWidth: 1.5,
  titleColor: "#14532d", bodyColor: "#6b7280", padding: 12, cornerRadius: 10,
};
const baseGrid = { color: "rgba(22,163,74,0.07)", drawBorder: false };
const baseTick = { color: "#9ca3af", font: { family: "'Plus Jakarta Sans',sans-serif", size: 11 } };

function AnimCount({ target, duration = 1100 }) {
  const [val, setVal] = React.useState(0);
  const raf = React.useRef(null);
  React.useEffect(() => {
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

// ═════════════════════════════════════════════════════════════════════════════
export default function TransportStatistiques() {
  const dispatch = useDispatch();
  const transportData = useSelector((s) => s.transport?.list || []);
  const poussages = useSelector((s) => s.poussage?.list || []);
  const loading = useSelector((s) => s.transport?.loading);
  const saving = useSelector((s) => s.transport?.saving);

  const [period, setPeriod] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // ── Edit modal state ──
  const [editRecord, setEditRecord] = useState(null);
  const [editForm, setEditForm] = useState({});

  const openEdit = (r) => {
    setEditRecord(r);
    setEditForm({
      nombre_voyages: r.nombre_voyages,
      capacite_camion: r.capacite_camion,
      panneau: r.panneau || "",
      tranchee: r.tranchee || "",
      niveau: r.niveau || "",
    });
  };
  const closeEdit = () => { setEditRecord(null); setEditForm({}); };

  const handleEditChange = (field, val) => setEditForm((f) => ({ ...f, [field]: val }));

  const handleSaveEdit = async () => {
    if (!editRecord) return;
    await dispatch(updateTransportJournalier({ id: editRecord.id, data: editForm }));
    closeEdit();
  };

  const handleDelete = async (r) => {
    if (!window.confirm(`Supprimer l'enregistrement du ${r.date} (${r.entreprise} — ${r.type_moyen}) ?`)) return;
    dispatch(deleteTransportJournalier(r.id));
  };

  useEffect(() => {
    dispatch(fetchTransportJournaliers());
    dispatch(fetchPoussages());
  }, [dispatch]);

  // ─── Filter by period ──────────────────────────────────────────────────────
  const filtered = transportData.filter((r) => {
    if (!r.date) return false;
    const now = new Date();
    const d = r.date;
    if (period === "today") return d === now.toISOString().split("T")[0];
    if (period === "week") {
      const w = new Date(now); w.setDate(w.getDate() - 7);
      return d >= w.toISOString().split("T")[0];
    }
    if (period === "month") {
      return d >= new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    }
    if (period === "year") {
      return d >= new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
    }
    if (period === "custom") {
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
    }
    return true;
  });

  // ─── KPIs ──────────────────────────────────────────────────────────────────
  const totalVoyages = filtered.reduce((s, r) => s + r.nombre_voyages, 0);
  const totalVolumeDecape = filtered.reduce((s, r) => s + r.volume_decape, 0);
  const totalOps = filtered.length;
  const avgCapacite = totalOps > 0 ? (filtered.reduce((s, r) => s + r.capacite_camion, 0) / totalOps).toFixed(1) : 0;

  // Volume sauté depuis Sautage (Poussage), filtré par la même période
  const filteredPoussages = poussages.filter((p) => {
    if (!p.date) return false;
    const now = new Date();
    const d = p.date;
    if (period === "today") return d === now.toISOString().split("T")[0];
    if (period === "week") {
      const w = new Date(now); w.setDate(w.getDate() - 7);
      return d >= w.toISOString().split("T")[0];
    }
    if (period === "month") {
      return d >= new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    }
    if (period === "year") {
      return d >= new Date(now.getFullYear(), 0, 1).toISOString().split("T")[0];
    }
    if (period === "custom") {
      if (dateFrom && d < dateFrom) return false;
      if (dateTo && d > dateTo) return false;
    }
    return true;
  });
  const totalVolumeSaute = filteredPoussages.reduce((s, p) => s + Number(p.volume_soté || 0), 0);

  // ─── Volume décapé par entreprise ─────────────────────────────────────────
  const procaneqData = filtered.filter((r) => r.entreprise === "procaneq");
  const transwineData = filtered.filter((r) => r.entreprise === "transwine");

  const volProcaneq = procaneqData.reduce((s, r) => s + r.volume_decape, 0);
  const volTranswine = transwineData.reduce((s, r) => s + r.volume_decape, 0);

  const voyProcaneq = procaneqData.reduce((s, r) => s + r.nombre_voyages, 0);
  const voyTranswine = transwineData.reduce((s, r) => s + r.nombre_voyages, 0);

  // ─── Volume décapé par jour (last 30 days) ────────────────────────────────
  const last30 = [];
  for (let i = 29; i >= 0; i--) {
    const dt = new Date(); dt.setDate(dt.getDate() - i);
    last30.push(dt.toISOString().split("T")[0]);
  }
  const volParJour = last30.map((day) =>
    transportData.filter((r) => r.date === day).reduce((s, r) => s + r.volume_decape, 0)
  );
  const dayLabels = last30.map((d) => {
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("fr-MA", { day: "2-digit", month: "short" });
  });

  // ─── Petits vs Grands ─────────────────────────────────────────────────────
  const petitsData = filtered.filter((r) => r.type_moyen === "petits");
  const grandsData = filtered.filter((r) => r.type_moyen === "grands");
  const volPetits = petitsData.reduce((s, r) => s + r.volume_decape, 0);
  const volGrands = grandsData.reduce((s, r) => s + r.volume_decape, 0);
  const voyPetits = petitsData.reduce((s, r) => s + r.nombre_voyages, 0);
  const voyGrands = grandsData.reduce((s, r) => s + r.nombre_voyages, 0);

  // ─── Chart configs ────────────────────────────────────────────────────────
  const barOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { ...baseTooltip, callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString()} m³` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: baseTick },
      y: { grid: baseGrid, border: { display: false }, ticks: { ...baseTick, callback: (v) => v.toLocaleString() } },
    },
    animation: { duration: 900, easing: "easeOutQuart" },
  };

  const lineOpts = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: { ...baseTooltip, callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString()} m³` } },
    },
    scales: {
      x: { grid: { display: false }, ticks: { ...baseTick, maxTicksLimit: 10 } },
      y: { grid: baseGrid, border: { display: false }, ticks: { ...baseTick, callback: (v) => v.toLocaleString() } },
    },
    animation: { duration: 1000, easing: "easeOutCubic" },
  };

  const doughnutOpts = {
    responsive: true, cutout: "68%",
    animation: { duration: 1200, easing: "easeOutBack" },
    plugins: {
      legend: { position: "bottom", labels: { color: "#6b7280", font: { family: "'Plus Jakarta Sans',sans-serif", size: 11 }, padding: 14, usePointStyle: true } },
      tooltip: { ...baseTooltip, callbacks: { label: (c) => ` ${c.label}: ${c.parsed.toLocaleString()} m³` } },
    },
  };

  // ─── Excel export ─────────────────────────────────────────────────────────
  const exportExcel = () => {
    if (filtered.length === 0) {
      alert("Il n'y a aucune donnée à exporter pour la période sélectionnée.");
      return;
    }
    const rows = filtered.map((r) => ({
      Date: r.date,
      Entreprise: r.entreprise,
      "Type Moyen": r.type_moyen,
      "Nombre Voyages": r.nombre_voyages,
      "Capacité Camion (m³)": r.capacite_camion,
      "Volume Décapé (m³)": r.volume_decape,
      Panneau: r.panneau || "—",
      Tranchée: r.tranchee || "—",
      Niveau: r.niveau || "—",
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transport_Stats");
    saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })]), "statistiques_transport.xlsx");
  };

  // ─── PDF export ───────────────────────────────────────────────────────────
  const exportPDF = () => {
    if (filtered.length === 0) {
      alert("Il n'y a aucune donnée à exporter pour la période sélectionnée.");
      return;
    }
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    // Header bar
    doc.setFillColor(21, 128, 61);
    doc.rect(0, 0, pageW, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Rapport Transport \u2014 OCP", 14, 14);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`G\u00e9n\u00e9r\u00e9 le ${new Date().toLocaleDateString("fr-FR")} \u00e0 ${new Date().toLocaleTimeString("fr-FR")}`, pageW - 14, 14, { align: "right" });

    // KPIs row
    let y = 30;
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    const kpis = [
      `Volume Saut\u00e9: ${Math.round(totalVolumeSaute).toLocaleString()} m\u00b3`,
      `Volume D\u00e9cap\u00e9: ${Math.round(totalVolumeDecape).toLocaleString()} m\u00b3`,
      `Voyages: ${totalVoyages}`,
      `Capacit\u00e9 Moy.: ${avgCapacite} m\u00b3`,
    ];
    doc.text(kpis.join("   |   "), 14, y);
    y += 4;

    // Separator
    doc.setDrawColor(187, 247, 208);
    doc.setLineWidth(0.5);
    doc.line(14, y, pageW - 14, y);
    y += 4;

    // Table
    const head = [["Date", "Entreprise", "Type Moyen", "Voyages", "Capacit\u00e9 (m\u00b3)", "Volume D\u00e9cap\u00e9 (m\u00b3)", "Panneau", "Tranch\u00e9e", "Niveau"]];
    const body = filtered.map((r) => [
      r.date,
      r.entreprise,
      r.type_moyen,
      String(r.nombre_voyages),
      String(r.capacite_camion),
      r.volume_decape.toLocaleString(),
      r.panneau || "\u2014",
      r.tranchee || "\u2014",
      r.niveau || "\u2014",
    ]);

    autoTable(doc, {
      startY: y,
      head,
      body,
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74], textColor: 255, fontSize: 8, fontStyle: "bold", halign: "center" },
      bodyStyles: { fontSize: 8, textColor: [55, 65, 81], halign: "center" },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      margin: { left: 14, right: 14 },
      styles: { cellPadding: 3, lineColor: [187, 247, 208], lineWidth: 0.3 },
    });

    // Footer
    const pages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(`Page ${i} / ${pages}`, pageW - 14, doc.internal.pageSize.getHeight() - 8, { align: "right" });
      doc.text("OCP \u2014 Syst\u00e8me de Gestion Transport", 14, doc.internal.pageSize.getHeight() - 8);
    }

    doc.save(`rapport_transport_${new Date().toISOString().split("T")[0]}.pdf`);
  };

  const anim = (d) => ({ style: { animationDelay: d } });

  return (
    <>
      <style>{CSS}</style>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f0fdf4" }}>
        <TransportSidebar />

        <div className="ts-page" style={{ flex: 1, padding: "28px 24px 60px", overflowY: "auto" }}>

          {/* Header */}
          <div className="ts-card" style={{ marginBottom: 24, padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", ...anim("0s").style }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase", color: "#6b7280", marginBottom: 4 }}>
                Analyse Transport
              </div>
              <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg,#15803d,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Statistiques <span style={{ WebkitTextFillColor: "#16a34a" }}>Transport</span>
              </h1>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <div className="ts-filter-wrap">
                <select className="ts-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option value="all">Tout l'historique</option>
                  <option value="today">Aujourd'hui</option>
                  <option value="week">7 derniers jours</option>
                  <option value="month">Ce mois</option>
                  <option value="year">Cette année</option>
                  <option value="custom">Personnalisé</option>
                </select>
                {period === "custom" && (
                  <>
                    <input className="ts-date" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    <input className="ts-date" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </>
                )}
              </div>
              <img src={image} alt="logo" style={{ height: 46, borderRadius: 10, boxShadow: "0 4px 14px rgba(22,163,74,0.2)" }} />
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: 40, color: "#16a34a", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> Chargement des données transport...
            </div>
          )}

          {/* KPIs */}
          <div className="ts-grid4" style={{ marginBottom: 24 }}>
            {[
              { icon: <FaBolt />, label: "Volume Sauté", value: Math.round(totalVolumeSaute), unit: "m³", color: "#16a34a", delay: "0.05s" },
              { icon: <FaHardHat />, label: "Volume Décapé Total", value: Math.round(totalVolumeDecape), unit: "m³", color: "#2563eb", delay: "0.10s" },
              { icon: <FaTruck />, label: "Nombre de Voyages", value: totalVoyages, unit: "voyages", color: "#15803d", delay: "0.15s" },
              { icon: <FaTruckLoading />, label: "Capacité Moy. Camion", value: parseFloat(avgCapacite), unit: "m³", color: "#f59e0b", delay: "0.20s" },
            ].map(({ icon, label, value, unit, color, delay }) => (
              <div key={label} className="ts-kpi" style={{ animationDelay: delay, borderColor: color, borderTopWidth: 3 }}>
                <div className="ts-kpi-shimmer" />
                <div className="ts-kpi-icon" style={{ background: color + "20", color }}>{icon}</div>
                <div className="ts-kpi-label" style={{ color: color + "cc" }}>{label}</div>
                <div className="ts-kpi-value" style={{ color }}>
                  <AnimCount target={value} />
                  <span className="ts-kpi-unit">{unit}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Line chart — Volume décapé par jour (30j) */}
          <div className="ts-card" {...anim("0.22s")} style={{ marginBottom: 24 }}>
            <div className="ts-card-header">
              <div>
                <p className="ts-card-title">Volume Décapé par Jour</p>
                <p className="ts-card-sub">Évolution sur les 30 derniers jours (toutes entreprises)</p>
              </div>
              <span className="ts-pill" style={{ display: "flex", alignItems: "center", gap: 5 }}><FaChartBar size={10} /> Tendance</span>
            </div>
            <div style={{ height: 280 }}>
              <Line
                data={{
                  labels: dayLabels,
                  datasets: [{
                    label: "Volume Décapé (m³)", data: volParJour,
                    borderColor: "#16a34a", backgroundColor: "rgba(22,163,74,0.08)",
                    fill: true, tension: 0.35, pointRadius: 3, pointHoverRadius: 6, borderWidth: 2,
                  }],
                }}
                options={lineOpts}
              />
            </div>
          </div>

          {/* Procaneq vs Transwine — Bar + Doughnut */}
          <div className="ts-section">Comparaison Entreprises</div>
          <div className="ts-grid2" style={{ marginBottom: 24 }}>
            {/* Stacked bar: volume décapé par entreprise */}
            <div className="ts-card" {...anim("0.28s")}>
              <div className="ts-card-header">
                <div>
                  <p className="ts-card-title">Volume Décapé par Entreprise</p>
                  <p className="ts-card-sub">Procaneq vs Transwine</p>
                </div>
              </div>
              <div style={{ height: 260 }}>
                <Bar
                  data={{
                    labels: ["Procaneq", "Transwine"],
                    datasets: [{
                      label: "Volume Décapé (m³)",
                      data: [volProcaneq, volTranswine],
                      backgroundColor: ["#f59e0b", "#3b82f6"],
                      borderRadius: { topLeft: 8, topRight: 8 }, barPercentage: 0.5,
                    }],
                  }}
                  options={barOpts}
                />
              </div>
            </div>

            {/* Doughnut: répartition */}
            <div className="ts-card" {...anim("0.32s")}>
              <div className="ts-card-header">
                <div>
                  <p className="ts-card-title">Répartition Volume Décapé</p>
                  <p className="ts-card-sub">Part de chaque entreprise</p>
                </div>
              </div>
              {(volProcaneq + volTranswine) > 0 ? (
                <div style={{ maxWidth: 260, margin: "0 auto" }}>
                  <Doughnut
                    data={{
                      labels: ["Procaneq", "Transwine"],
                      datasets: [{
                        data: [volProcaneq, volTranswine],
                        backgroundColor: ["#f59e0b", "#3b82f6"],
                        borderWidth: 0, hoverOffset: 10,
                      }],
                    }}
                    options={doughnutOpts}
                  />
                </div>
              ) : <div className="ts-empty">Aucune donnée</div>}
            </div>
          </div>

          {/* Nombre de voyages par entreprise */}
          <div className="ts-grid2" style={{ marginBottom: 24 }}>
            <div className="ts-card" {...anim("0.35s")}>
              <div className="ts-card-header">
                <div>
                  <p className="ts-card-title">Nombre de Voyages par Entreprise</p>
                  <p className="ts-card-sub">Total des trajets effectués</p>
                </div>
              </div>
              <div style={{ height: 240 }}>
                <Bar
                  data={{
                    labels: ["Procaneq", "Transwine"],
                    datasets: [{
                      label: "Voyages",
                      data: [voyProcaneq, voyTranswine],
                      backgroundColor: ["#ea580c", "#8b5cf6"],
                      borderRadius: { topLeft: 8, topRight: 8 }, barPercentage: 0.5,
                    }],
                  }}
                  options={{
                    ...barOpts,
                    plugins: { ...barOpts.plugins, tooltip: { ...baseTooltip, callbacks: { label: (c) => ` ${c.parsed.y.toLocaleString()} voyages` } } },
                  }}
                />
              </div>
            </div>

            {/* Petits vs Grands Moyens */}
            <div className="ts-card" {...anim("0.38s")}>
              <div className="ts-card-header">
                <div>
                  <p className="ts-card-title">Petits vs Grands Moyens</p>
                  <p className="ts-card-sub">Volume décapé et voyages par type</p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
                {[
                  { label: "Petits Moyens", vol: volPetits, voy: voyPetits, color: "#0891b2" },
                  { label: "Grands Moyens", vol: volGrands, voy: voyGrands, color: "#dc2626" },
                ].map(({ label, vol, voy, color }) => (
                  <div key={label} style={{ textAlign: "center", padding: 16, background: "#f0fdf4", borderRadius: 14, border: "1px solid #bbf7d0" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".08em" }}>{label}</div>
                    <div style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{vol.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>tonnes décapées</div>
                    <div style={{ marginTop: 12, fontSize: 22, fontWeight: 800, color: "#14532d" }}>{voy.toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: "#9ca3af" }}>voyages</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tableau détaillé */}
          <div className="ts-section">Détail des Enregistrements</div>
          <div className="ts-card" {...anim("0.42s")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <p className="ts-card-title" style={{ margin: 0 }}>
                {filtered.length} enregistrement(s)
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="ts-btn-excel" onClick={exportExcel} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <FaFileExcel /> Exporter Excel
                </button>
                <button className="ts-btn-excel" onClick={exportPDF} style={{ display: "flex", alignItems: "center", gap: 7, background: "#dc2626" }}>
                  <FaFilePdf /> Exporter PDF
                </button>
              </div>
            </div>
            {filtered.length > 0 ? (
              <div className="ts-table-wrap">
                <table className="ts-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Entreprise</th>
                      <th>Type Moyen</th>
                      <th>Voyages</th>
                      <th>Capacité (m³)</th>
                      <th>Volume Décapé (m³)</th>
                      <th>Panneau</th>
                      <th>Tranchée</th>
                      <th>Niveau</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r, i) => (
                      <tr key={r.id || i} style={{ animationDelay: `${i * 0.03}s` }}>
                        <td>{r.date}</td>
                        <td>
                          <span style={{
                            background: r.entreprise === "procaneq" ? "#fef3c7" : "#dbeafe",
                            color: r.entreprise === "procaneq" ? "#92400e" : "#1e40af",
                            padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                          }}>
                            {r.entreprise}
                          </span>
                        </td>
                        <td style={{ textTransform: "capitalize" }}>{r.type_moyen}</td>
                        <td style={{ fontWeight: 700 }}>{r.nombre_voyages}</td>
                        <td>{r.capacite_camion} m³</td>
                        <td style={{ color: "#16a34a", fontWeight: 700 }}>{r.volume_decape.toLocaleString()} m³</td>
                        <td style={{ color: "#15803d", fontWeight: 600 }}>{r.panneau || "—"}</td>
                        <td style={{ color: "#2563eb", fontWeight: 600 }}>{r.tranchee || "—"}</td>
                        <td style={{ color: "#d97706", fontWeight: 600 }}>{r.niveau || "—"}</td>
                        <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                          <div style={{ display: "flex", gap: 6, justifyContent: "center" }}>
                            <button className="ts-btn-edit" onClick={() => openEdit(r)}>
                              <FaEdit size={14} />
                            </button>
                            <button className="ts-btn-del" onClick={() => handleDelete(r)}>
                              <FaTrashAlt size={14} />
                            </button>
                          </div>
                        </td>
                        <td>{r.capacite_camion} t</td>
                        <td style={{ color: "#16a34a", fontWeight: 700 }}>{r.volume_decape.toLocaleString()} t</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="ts-empty" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <FaInbox size={38} style={{ color: "#d1fae5" }} />
                Aucune donnée transport pour la période sélectionnée
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ── Edit Modal ────────────────────────────────────────────────────────── */}
      {editRecord && (
        <div className="ts-modal-overlay" onClick={(e) => e.target === e.currentTarget && closeEdit()}>
          <div className="ts-modal">
            <button className="ts-modal-close" onClick={closeEdit}><FaTimes /></button>
            <p className="ts-modal-title"> Modifier l’enregistrement</p>
            <p className="ts-modal-sub">
              {editRecord.date} — {editRecord.entreprise} — {editRecord.type_moyen}
            </p>

            <div className="ts-modal-grid">
              <div>
                <label className="ts-modal-label">Nombre de Voyages</label>
                <input
                  className="ts-modal-input" type="number" min="0"
                  value={editForm.nombre_voyages}
                  onChange={(e) => handleEditChange("nombre_voyages", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="ts-modal-label">Capacité Camion (m³)</label>
                <input
                  className="ts-modal-input" type="number" min="0" step="0.1"
                  value={editForm.capacite_camion}
                  onChange={(e) => handleEditChange("capacite_camion", Number(e.target.value))}
                />
              </div>
              <div>
                <label className="ts-modal-label">Volume Décapé (calculé)</label>
                <input
                  className="ts-modal-input" readOnly
                  value={`${(editForm.nombre_voyages * editForm.capacite_camion).toLocaleString()} m³`}
                />
              </div>
              <div>
                <label className="ts-modal-label">Panneau</label>
                <input
                  className="ts-modal-input" type="text"
                  placeholder="Ex: P1"
                  value={editForm.panneau}
                  onChange={(e) => handleEditChange("panneau", e.target.value)}
                />
              </div>
              <div>
                <label className="ts-modal-label">Tranchée</label>
                <input
                  className="ts-modal-input" type="text"
                  placeholder="Ex: T2"
                  value={editForm.tranchee}
                  onChange={(e) => handleEditChange("tranchee", e.target.value)}
                />
              </div>
              <div>
                <label className="ts-modal-label">Niveau</label>
                <input
                  className="ts-modal-input" type="text"
                  placeholder="Ex: N3"
                  value={editForm.niveau}
                  onChange={(e) => handleEditChange("niveau", e.target.value)}
                />
              </div>
            </div>

            <div className="ts-modal-actions">
              <button className="ts-btn-cancel2" onClick={closeEdit}>
                <FaTimes size={11} /> Annuler
              </button>
              <button className="ts-btn-save" onClick={handleSaveEdit} disabled={saving}>
                {saving ? <FaSpinner style={{ animation: "ts-spin 1s linear infinite" }} /> : <FaSave size={11} />}
                {saving ? "Enregistrement..." : "Sauvegarder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
