import React, { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchPoussages,
  deletePoussageAsync,
  updatePoussageAsync,
  forceUpdate,
} from "../../features/poussageSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import image from "../../images/image3.webp";

// ─── CSS ─────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  @keyframes hist-fadeUp  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes hist-rowIn   { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
  @keyframes hist-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }
  @keyframes hist-pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }

  .hist-page {
    font-family: 'Plus Jakarta Sans', sans-serif;
    min-height: 100vh;
    background: #f0fdf4;
    padding: 28px 24px 60px;
    color: #14532d;
  }

  /* ── Header ── */
  .hist-header {
    background: #fff; border: 1.5px solid #bbf7d0; border-radius: 16px;
    padding: 18px 24px; display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 24px;
    animation: hist-fadeUp .45s ease both;
    box-shadow: 0 2px 8px rgba(22,163,74,0.07);
  }
  .hist-header-label {
    font-size: 10px; font-weight: 700; letter-spacing: .16em;
    text-transform: uppercase; color: #9ca3af; margin-bottom: 4px;
  }
  .hist-header-title {
    margin: 0; font-size: 24px; font-weight: 800;
    background: linear-gradient(135deg,#15803d,#22c55e);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .hist-header-title span { -webkit-text-fill-color: #16a34a; }

  /* ── Cards ── */
  .hist-card {
    background: #fff; border: 1.5px solid #bbf7d0; border-radius: 16px;
    padding: 22px 22px 18px; margin-bottom: 20px;
    animation: hist-fadeUp .5s ease both;
    transition: box-shadow .2s;
  }
  .hist-card:hover { box-shadow: 0 8px 24px rgba(22,163,74,0.10); }
  .hist-card-title {
    font-size: 13px; font-weight: 700; color: #14532d; margin: 0 0 16px;
  }

  /* ── KPI row ── */
  .hist-kpi-row {
    display: grid; grid-template-columns: repeat(auto-fit,minmax(150px,1fr));
    gap: 14px; margin-bottom: 20px;
    animation: hist-fadeUp .4s ease both;
  }
  .hist-kpi {
    background: #fff; border: 1.5px solid #bbf7d0; border-radius: 14px;
    padding: 16px 18px; position: relative; overflow: hidden;
    transition: transform .2s, box-shadow .2s;
  }
  .hist-kpi:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(22,163,74,0.15); }
  .hist-kpi::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg,#16a34a,#4ade80,#16a34a);
    background-size: 200%; animation: hist-shimmer 2.4s linear infinite;
  }
  .hist-kpi-icon { font-size: 20px; margin-bottom: 8px; }
  .hist-kpi-label {
    font-size: 10px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: #9ca3af; margin-bottom: 4px;
  }
  .hist-kpi-value { font-size: 26px; font-weight: 800; color: #15803d; line-height: 1; }
  .hist-kpi-unit  { font-size: 12px; color: #9ca3af; margin-left: 2px; }

  /* ── Filter grid ── */
  .hist-filter-grid {
    display: grid; grid-template-columns: repeat(auto-fill,minmax(190px,1fr)); gap: 14px;
    margin-bottom: 14px;
  }
  .hist-filter-group { display: flex; flex-direction: column; gap: 5px; }
  .hist-filter-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .08em; color: #6b7280;
  }
  .hist-filter-input, .hist-filter-select {
    padding: 9px 12px; border-radius: 9px; border: 1.5px solid #d1fae5;
    background: #f8fafc; color: #1f2937; font-size: 13px; outline: none;
    transition: border .18s, box-shadow .18s; box-sizing: border-box;
    font-family: inherit;
  }
  .hist-filter-input:focus, .hist-filter-select:focus {
    border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  }
  .hist-filter-info {
    font-size: 12px; color: #9ca3af; font-style: italic; margin-top: 6px;
  }

  /* ── Buttons ── */
  .hist-btn-excel {
    background: #166534; color: #fff; border: none; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px; transition: all .18s;
    font-family: inherit;
  }
  .hist-btn-excel:hover { background: #15803d; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(22,163,74,0.25); }

  .hist-btn-pdf {
    background: #b91c1c; color: #fff; border: none; border-radius: 10px;
    padding: 9px 18px; font-size: 13px; font-weight: 600; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px; transition: all .18s;
    font-family: inherit;
  }
  .hist-btn-pdf:hover { background: #991b1b; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(185,28,28,0.25); }

  .hist-btn-reset {
    padding: 8px 16px; border-radius: 9px;
    border: 1.5px solid rgba(239,68,68,0.35);
    background: rgba(254,242,242,0.8); color: #dc2626;
    font-size: 12px; font-weight: 600; cursor: pointer; transition: all .18s;
    font-family: inherit;
  }
  .hist-btn-reset:hover { background: #fee2e2; border-color: #dc2626; }

  .hist-btn-edit {
    background: #f0fdf4; color: #16a34a; border: 1.5px solid #bbf7d0;
    border-radius: 8px; padding: 5px 12px; font-size: 11px; font-weight: 700;
    cursor: pointer; transition: all .15s; white-space: nowrap; font-family: inherit;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .hist-btn-edit:hover { background: #dcfce7; border-color: #16a34a; transform: translateY(-1px); }

  .hist-btn-del {
    background: #fef2f2; color: #dc2626; border: 1.5px solid #fecaca;
    border-radius: 8px; padding: 5px 12px; font-size: 11px; font-weight: 700;
    cursor: pointer; transition: all .15s; white-space: nowrap; font-family: inherit;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .hist-btn-del:hover { background: #fee2e2; border-color: #dc2626; transform: translateY(-1px); }

  /* ── Table ── */
  .hist-table-wrap { overflow-x: auto; border-radius: 12px; border: 1.5px solid #bbf7d0; }
  .hist-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
  .hist-table thead tr { background: #15803d; }
  .hist-table th {
    padding: 11px 12px; text-align: left; font-size: 10px; font-weight: 700;
    letter-spacing: .07em; text-transform: uppercase; color: #fff; white-space: nowrap;
  }
  .hist-table tbody tr {
    border-bottom: 1px solid #f0fdf4; transition: background .15s;
    animation: hist-rowIn .35s ease both;
  }
  .hist-table tbody tr:hover { background: #f0fdf4; }
  .hist-table tbody tr:last-child { border-bottom: none; }
  .hist-table td { padding: 10px 12px; color: #374151; vertical-align: middle; white-space: nowrap; }
  .hist-table td:first-child { font-weight: 600; color: #14532d; }

  .badge-marche {
    background: #dcfce7; color: #15803d; padding: 3px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap;
  }
  .badge-arret {
    background: #fef3c7; color: #92400e; padding: 3px 10px;
    border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap;
  }
  .badge-oee {
    background: #eff6ff; color: #2563eb; padding: 2px 8px;
    border-radius: 20px; font-size: 11px; font-weight: 700;
  }
  .badge-tu {
    background: #dcfce7; color: #15803d; padding: 2px 8px;
    border-radius: 20px; font-size: 11px; font-weight: 700;
  }
  .badge-td {
    background: #fef3c7; color: #92400e; padding: 2px 8px;
    border-radius: 20px; font-size: 11px; font-weight: 700;
  }
  .badge-td-ok {
    background: #f3f4f6; color: #9ca3af; padding: 2px 8px;
    border-radius: 20px; font-size: 11px; font-weight: 700;
  }

  .hist-empty {
    text-align: center; padding: 52px 0; color: #9ca3af; font-size: 13px;
  }

  /* ── Modal confirm suppression ── */
  .hist-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; animation: hist-fadeUp .2s ease both;
  }
  .hist-modal {
    background: #fff; border-radius: 18px; padding: 32px 28px;
    max-width: 420px; width: 90%; box-shadow: 0 24px 60px rgba(0,0,0,0.18);
    text-align: center;
  }
  .hist-modal-icon { font-size: 48px; margin-bottom: 12px; }
  .hist-modal-title { font-size: 18px; font-weight: 800; color: #14532d; margin-bottom: 8px; }
  .hist-modal-sub   { font-size: 13px; color: #6b7280; margin-bottom: 24px; line-height: 1.6; }
  .hist-modal-btns  { display: flex; gap: 12px; justify-content: center; }
  .hist-modal-cancel {
    padding: 10px 22px; border-radius: 10px; border: 1.5px solid #d1d5db;
    background: #f9fafb; color: #374151; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all .15s; font-family: inherit;
  }
  .hist-modal-cancel:hover { background: #f3f4f6; }
  .hist-modal-confirm {
    padding: 10px 22px; border-radius: 10px; border: none;
    background: #dc2626; color: #fff; font-size: 13px; font-weight: 700;
    cursor: pointer; transition: all .15s; font-family: inherit;
  }
  .hist-modal-confirm:hover { background: #b91c1c; }
  .hist-modal-confirm:disabled { opacity: .6; cursor: not-allowed; }

  /* ── Edit modal ── */
  .hist-edit-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; animation: hist-fadeUp .2s ease both;
    padding: 20px;
  }
  .hist-edit-modal {
    background: #fff; border-radius: 18px; padding: 28px;
    width: 100%; max-width: 820px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 24px 60px rgba(0,0,0,0.2);
  }
  .hist-edit-title {
    font-size: 18px; font-weight: 800; color: #14532d; margin-bottom: 20px;
    padding-bottom: 14px; border-bottom: 1.5px solid #bbf7d0;
    display: flex; align-items: center; gap: 10px;
  }
  .hist-edit-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(200px,1fr));
    gap: 16px; margin-bottom: 20px;
  }
  .hist-edit-label {
    font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .07em; color: #6b7280; margin-bottom: 5px; display: block;
  }
  .hist-edit-input, .hist-edit-select {
    width: 100%; border: 1.5px solid #d1fae5; border-radius: 9px;
    padding: 9px 12px; font-size: 13px; color: #1f2937; background: #f8fafc;
    outline: none; transition: border .18s, box-shadow .18s;
    box-sizing: border-box; font-family: inherit;
  }
  .hist-edit-input:focus, .hist-edit-select:focus {
    border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.10);
  }
  .hist-edit-input[readOnly] { background: #f0fdf4; color: #15803d; font-weight: 700; }
  .hist-edit-select-danger {
    border-color: rgba(217,119,6,0.4) !important;
    background-color: #fef3c7 !important; color: #92400e !important;
  }
  .hist-edit-arret-zone {
    grid-column: 1 / -1;
    background: linear-gradient(135deg,#fef3c7,#fff9ec);
    border: 1.5px solid rgba(217,119,6,0.25); border-radius: 12px;
    padding: 18px 20px; position: relative;
  }
  .hist-edit-arret-zone::before {
    content: ''; position: absolute; top: 0; left: 0; bottom: 0; width: 4px;
    background: linear-gradient(180deg,#b45309,#92400e); border-radius: 12px 0 0 12px;
  }
  .hist-edit-arret-title {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .1em; color: #b45309; margin-bottom: 14px;
    display: flex; align-items: center; gap: 6px;
  }
  .hist-edit-arret-grid {
    display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 14px;
  }
  .hist-edit-equip-wrap { grid-column: 1 / -1; }
  .hist-edit-equip-grid { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 6px; }
  .hist-edit-chip {
    padding: 5px 14px; border-radius: 20px; border: 1.5px solid #bbf7d0;
    font-size: 12px; font-weight: 600; color: #374151; cursor: pointer;
    transition: all .15s; background: #fff;
  }
  .hist-edit-chip:hover { background: #f0fdf4; border-color: #16a34a; }
  .hist-edit-chip.sel  { background: #16a34a; color: #fff; border-color: #15803d; }
  .hist-edit-footer {
    display: flex; gap: 12px; justify-content: flex-end;
    padding-top: 18px; border-top: 1.5px solid #f0fdf4;
  }
  .hist-edit-save {
    background: #16a34a; color: #fff; border: none; border-radius: 10px;
    padding: 11px 24px; font-size: 14px; font-weight: 700; cursor: pointer;
    transition: all .18s; font-family: inherit;
  }
  .hist-edit-save:hover { background: #15803d; transform: translateY(-1px); }
  .hist-edit-save:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .hist-edit-cancel-btn {
    background: #f3f4f6; color: #4b5563; border: none; border-radius: 10px;
    padding: 11px 24px; font-size: 14px; font-weight: 700; cursor: pointer;
    transition: all .18s; font-family: inherit;
  }
  .hist-edit-cancel-btn:hover { background: #e5e7eb; }

  @media (max-width: 768px) {
    .hist-page { padding: 16px 12px 40px; }
    .hist-edit-modal { padding: 20px 16px; }
  }
`;

// ─── Helper : heures depuis plage horaire ─────────────────────────────────────
function calcPlage(debut, fin) {
  if (!debut || !fin) return 0;
  const d = (debut || "").substring(0, 5);
  const f = (fin   || "").substring(0, 5);
  const [dh, dm] = d.split(":").map(Number);
  const [fh, fm] = f.split(":").map(Number);
  let mins = (fh * 60 + fm) - (dh * 60 + dm);
  if (mins < 0) mins += 24 * 60;
  return parseFloat((mins / 60).toFixed(2));
}

// ─── Helper : calcule OEE/TU/TD pour un enregistrement ───────────────────────
function calcIndicateurs(p) {
  const htpRaw = Number(p.htp || 0);
  const htp = htpRaw > 0 ? htpRaw : calcPlage(p.heureDebut, p.heureFin);

  const tm = Number(p.temps || 0);
  const ha = Number(p.heures_arret || 0);

  // OEE
  const oeeV = htp > 0 ? parseFloat(((htp / 24) * 100).toFixed(1)) : 0;

  // TU
  const tuV = htp > 0 ? parseFloat(((oeeV / 24) * 100).toFixed(1)) : 0;

  // TD
  const tempsFonctionnement = htp - ha;
  const tdV = htp > 0 ? parseFloat(((tempsFonctionnement / 24) * 100).toFixed(1)) : 0;

  return {
    tu: tuV + "%",
    td: tdV + "%",
    oee: oeeV + "%",
    tuV,
    tdV,
    oeeV,
  };
}

// ─── Composant principal ──────────────────────────────────────────────────────
function Historique() {
  const dispatch  = useDispatch();
  const { list: poussages, loading } = useSelector((s) => s.poussage);

  useEffect(() => { dispatch(fetchPoussages()); }, [dispatch]);

  // ── Filtres ──
  const [filterPanneau,   setFilterPanneau]   = useState("");
  const [filterTranchee,  setFilterTranchee]  = useState("");
  const [filterEtat,      setFilterEtat]      = useState("");
  const [filterDateDebut, setFilterDateDebut] = useState("");
  const [filterDateFin,   setFilterDateFin]   = useState("");

  // ── Modal suppression ──
  const [deleteTarget, setDeleteTarget] = useState(null); // { id, date, conducteur }
  const [deleting,     setDeleting]     = useState(false);

  // ── Modal édition ──
  const [editTarget,   setEditTarget]   = useState(null); // objet poussage complet
  const [editForm,     setEditForm]     = useState({});
  const [saving,       setSaving]       = useState(false);

  const EQUIP_OPTS = ["T1","T2","T3","T4","T5","T6","T7"];

  // ── Valeurs uniques pour dropdowns ──
  const uniquePanneaux  = useMemo(() => [...new Set(poussages.map(p => p.panneau).filter(Boolean))],  [poussages]);
  const uniqueTranchees = useMemo(() => [...new Set(poussages.map(p => p.tranchee).filter(Boolean))], [poussages]);

  // ── Données filtrées ──
  const filtered = useMemo(() => {
    return poussages.filter(p => {
      if (filterPanneau  && p.panneau    !== filterPanneau)  return false;
      if (filterTranchee && p.tranchee   !== filterTranchee) return false;
      if (filterEtat     && p.etatMachine !== filterEtat)    return false;
      if (filterDateDebut || filterDateFin) {
        const d = new Date(p.date);
        if (filterDateDebut && new Date(filterDateDebut) > d) return false;
        if (filterDateFin   && new Date(filterDateFin)   < d) return false;
      }
      return true;
    });
  }, [poussages, filterPanneau, filterTranchee, filterEtat, filterDateDebut, filterDateFin]);

  const hasFilters = filterPanneau || filterTranchee || filterEtat || filterDateDebut || filterDateFin;

  const resetFilters = () => {
    setFilterPanneau(""); setFilterTranchee(""); setFilterEtat("");
    setFilterDateDebut(""); setFilterDateFin("");
  };

  // ── KPIs globaux ──
  const kpiTotal  = filtered.length;
  const kpiVol    = filtered.reduce((a, p) => a + Number(p.volume_soté || 0), 0);
  const kpiTemps  = filtered.reduce((a, p) => a + Number(p.temps || 0), 0);
  const kpiRend   = kpiTemps > 0 ? (kpiVol / kpiTemps).toFixed(2) : 0;
  const kpiMarche = filtered.filter(p => p.etatMachine === "En marche").length;
  const kpiArret  = filtered.filter(p => p.etatMachine === "En arrêt").length;

  // ── Export Excel ──
  const exportExcel = () => {
    const data = filtered.map(p => {
      const ind = calcIndicateurs(p);
      return {
        Date: p.date,
        Panneau: p.panneau,
        Tranchée: p.tranchee,
        Niveau: p.niveau,
        Équipements: p.equipements?.join(", "),
        Conducteur: p.conducteur,
        Matricule: p.matricule,
        HTP: p.htp || "—",
        "Volume (t)": p.volume_soté,
        "Heures Marche (h)": p.temps,
        "Heures Arrêt (h)": p.heures_arret || 0,
        "OEE (%)": ind.oeeV,
        "TU (%)": ind.tuV,
        "TD (%)": ind.tdV,
        "Rendement (t/h)": p.temps > 0 ? (p.volume_soté / p.temps).toFixed(2) : 0,
        "État Machine": p.etatMachine,
        "Nature Arrêt": p.typeArret || "",
        Poste: p.poste || "",
      };
    });
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Historique");
    saveAs(
      new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })],
        { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }),
      "historique_poussage.xlsx"
    );
  };

  // ── Export PDF ──
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    // ── En-tête ──
    doc.setFillColor(21, 128, 61);
    doc.rect(0, 0, 297, 22, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Historique Poussage — Décapage ZD11", 14, 14);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Exporté le ${new Date().toLocaleDateString("fr-FR")}   •   ${filtered.length} opération${filtered.length !== 1 ? "s" : ""}`, 200, 14);

    // ── KPIs sous le header ──
    doc.setTextColor(20, 83, 45);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    const kpis = [
      `📋 Opérations : ${kpiTotal}`,
      `⛏️ Volume Total : ${kpiVol.toFixed(0)} t`,
      `⏱️ Heures Marche : ${kpiTemps.toFixed(1)} h`,
      `📈 Rendement Moy. : ${kpiRend} t/h`,
      `✅ En Marche : ${kpiMarche}`,
      `⛔ En Arrêt : ${kpiArret}`,
    ];
    kpis.forEach((kpi, i) => doc.text(kpi, 14 + i * 47, 30));

    // ── Tableau ──
    const head = [["Date","Panneau","Tranchée","Niveau","Équip.","Conducteur","Matr.","HTP","Vol (t)","H.M","H.A","OEE","TU","TD","Rend.","État","Nat. Arrêt"]];
    const body = filtered.map(p => {
      const ind = calcIndicateurs(p);
      const ha  = Number(p.heures_arret || 0);
      return [
        p.date || "—",
        p.panneau || "—",
        p.tranchee || "—",
        p.niveau || "—",
        p.equipements?.join(", ") || "—",
        p.conducteur || "—",
        p.matricule || "—",
        Number(p.htp) > 0 ? p.htp : "auto",
        Number(p.volume_soté).toLocaleString(),
        p.temps ? `${p.temps}h` : "—",
        ha > 0 ? `${ha}h` : "—",
        ind.oee,
        ind.tu,
        ind.td,
        p.temps > 0 ? (p.volume_soté / p.temps).toFixed(2) : "—",
        p.etatMachine || "—",
        p.typeArret || "—",
      ];
    });

    autoTable(doc, {
      head,
      body,
      startY: 35,
      styles: { fontSize: 7, cellPadding: 2, font: "helvetica", textColor: [55, 65, 81] },
      headStyles: { fillColor: [21, 128, 61], textColor: 255, fontStyle: "bold", fontSize: 7.5 },
      alternateRowStyles: { fillColor: [240, 253, 244] },
      columnStyles: {
        0:  { cellWidth: 18 },
        1:  { cellWidth: 14 },
        2:  { cellWidth: 14 },
        3:  { cellWidth: 12 },
        4:  { cellWidth: 20 },
        5:  { cellWidth: 22 },
        6:  { cellWidth: 14 },
        7:  { cellWidth: 10 },
        8:  { cellWidth: 14 },
        9:  { cellWidth: 10 },
        10: { cellWidth: 10 },
        11: { cellWidth: 12 },
        12: { cellWidth: 12 },
        13: { cellWidth: 12 },
        14: { cellWidth: 14 },
        15: { cellWidth: 16 },
        16: { cellWidth: 20 },
      },
      didDrawCell: (data) => {
        if (data.section === "body" && data.column.index === 15) {
          const val = data.cell.raw;
          if (val === "En marche") {
            doc.setFillColor(220, 252, 231);
            doc.setTextColor(21, 128, 61);
          } else if (val === "En arrêt") {
            doc.setFillColor(254, 243, 199);
            doc.setTextColor(146, 64, 14);
          }
        }
      },
      margin: { left: 8, right: 8 },
    });

    // ── Pied de page ──
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.setFont("helvetica", "normal");
      doc.text(`Page ${i} / ${pageCount}`, 280, 205, { align: "right" });
      doc.text("Historique Poussage — Décapage ZD11", 14, 205);
    }

    doc.save("historique_poussage.pdf");
  };


  const openDelete = (p) => setDeleteTarget({ id: p.id, date: p.date, conducteur: p.conducteur });
  const closeDelete = () => { setDeleteTarget(null); setDeleting(false); };
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await dispatch(deletePoussageAsync(deleteTarget.id)).unwrap();
      closeDelete();
    } catch (err) {
      alert("Erreur suppression : " + (typeof err === "string" ? err : JSON.stringify(err)));
      setDeleting(false);
    }
  };

  // ── Édition ──
  const openEdit = (p) => {
    setEditTarget(p);
    setEditForm({
      date:           p.date || "",
      panneau:        p.panneau || "",
      tranchee:       p.tranchee || "",
      niveau:         p.niveau || "",
      volume_soté:    p.volume_soté || "",
      profendeur:     p.profendeur || "",
      equipements:    p.equipements || [],
      conducteur:     p.conducteur || "",
      matricule:      p.matricule || "",
      heureDebut:     (p.heureDebut || "").substring(0, 5),
      heureFin:       (p.heureFin   || "").substring(0, 5),
      temps:          p.temps || "",
      poste:          p.poste || "",
      etat_machine:   p.etatMachine || "En marche",
      typeArret:      p.typeArret || "",
      heureDebutArret:(p.heureDebutArret || "").substring(0, 5),
      heureFinArret:  (p.heureFinArret   || "").substring(0, 5),
      heures_arret:   p.heures_arret || 0,
      htp:            p.htp || "",
    });
  };
  const closeEdit = () => { setEditTarget(null); setSaving(false); };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...editForm, [name]: value };

    // Auto-calcul temps
    if (name === "heureDebut" || name === "heureFin") {
      const debut = name === "heureDebut" ? value : editForm.heureDebut;
      const fin   = name === "heureFin"   ? value : editForm.heureFin;
      updated.temps = calcPlage(debut, fin) || editForm.temps;
    }
    // Auto-calcul heures arrêt
    if (name === "heureDebutArret" || name === "heureFinArret") {
      const d = name === "heureDebutArret" ? value : editForm.heureDebutArret;
      const f = name === "heureFinArret"   ? value : editForm.heureFinArret;
      updated.heures_arret = calcPlage(d, f) || 0;
    }
    // Reset arrêt si machine en marche
    if (name === "etat_machine" && value === "En marche") {
      updated.typeArret = ""; updated.heureDebutArret = "";
      updated.heureFinArret = ""; updated.heures_arret = 0;
    }
    setEditForm(updated);
  };

  const toggleEditEquip = (eq) => {
    const list = editForm.equipements || [];
    setEditForm({
      ...editForm,
      equipements: list.includes(eq) ? list.filter(x => x !== eq) : [...list, eq],
    });
  };

  const saveEdit = async () => {
    if (!editTarget) return;
    setSaving(true);

    const updatedData = {
      id:              editTarget.id,
      date:            editForm.date,
      panneau:         editForm.panneau,
      tranchee:        editForm.tranchee,
      niveau:          editForm.niveau,
      "volume_soté":   parseFloat(editForm["volume_soté"]) || 0,
      profendeur:      editForm.profendeur,
      equipements:     editForm.equipements || [],
      conducteur:      editForm.conducteur,
      matricule:       editForm.matricule,
      heureDebut:      editForm.heureDebut,
      heureFin:        editForm.heureFin,
      temps:           parseFloat(editForm.temps) || 0,
      poste:           editForm.poste,
      etatMachine:     editForm.etat_machine || "En marche",
      typeArret:       editForm.typeArret,
      heureDebutArret: editForm.heureDebutArret,
      heureFinArret:   editForm.heureFinArret,
      htp:             parseFloat(editForm.htp) || 0,
      heures_arret:    parseFloat(editForm.heures_arret) || 0,
    };

    try {
      // Appel API backend
      await dispatch(updatePoussageAsync({ id: editTarget.id, data: updatedData })).unwrap();
    } catch (apiErr) {
      alert("Erreur enregistrement : " + (typeof apiErr === "string" ? apiErr : JSON.stringify(apiErr)));
      setSaving(false);
      return;
    }

    // Toujours forcer la mise à jour du store local pour que le tableau
    // reflète immédiatement les nouvelles valeurs (le backend peut renvoyer
    // des noms de champs différents ex: operation_date vs date)
    dispatch(forceUpdate(updatedData));

    closeEdit();
  };

  // ── Preview OEE/TU/TD dans modal édition ──
 const previewHtp = parseFloat(editForm.htp) || 0;
const previewArret = parseFloat(editForm.heures_arret) || 0;

const previewBase = previewHtp > 0
  ? previewHtp
  : calcPlage(editForm.heureDebut, editForm.heureFin);

// OEE
const previewOEE = previewBase > 0
  ? ((previewBase / 24) * 100).toFixed(1)
  : "0.0";

// TU
const previewTU = previewBase > 0
  ? ((previewOEE / 24) * 100).toFixed(1)
  : "0.0";

// TD
const tempsFonctionnement = previewBase - previewArret;

const previewTD = previewBase > 0
  ? ((tempsFonctionnement / 24) * 100).toFixed(1)
  : "0.0";
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{CSS}</style>
      <div className="hist-page">

        {/* HEADER */}
        <div className="hist-header">
          <div>
            <div className="hist-header-label">Décapage ZD11</div>
            <h1 className="hist-header-title">Historique <span>Poussage</span></h1>
          </div>
          <img src={image} alt="logo" style={{ height: 46, borderRadius: 10, boxShadow: "0 4px 14px rgba(22,163,74,0.2)" }} />
        </div>

        {/* KPIs */}
        <div className="hist-kpi-row">
          {[
            { icon:"📋", label:"Opérations",     value: kpiTotal,              unit:"" },
            { icon:"⛏️",  label:"Volume Total",    value: kpiVol.toFixed(0),     unit:"t" },
            { icon:"⏱️",  label:"Heures Marche",   value: kpiTemps.toFixed(1),   unit:"h" },
            { icon:"📈",  label:"Rendement Moy.",  value: kpiRend,               unit:"t/h" },
            { icon:"✅",  label:"En Marche",       value: kpiMarche,             unit:"op" },
            { icon:"⛔",  label:"En Arrêt",        value: kpiArret,              unit:"op" },
          ].map(({ icon, label, value, unit }) => (
            <div className="hist-kpi" key={label}>
              <div className="hist-kpi-icon">{icon}</div>
              <div className="hist-kpi-label">{label}</div>
              <div className="hist-kpi-value">
                {value}<span className="hist-kpi-unit"> {unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* FILTRES */}
        <div className="hist-card">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <span className="hist-card-title" style={{ margin:0 }}>🔍 Filtres</span>
            {hasFilters && <button className="hist-btn-reset" onClick={resetFilters}>✕ Réinitialiser</button>}
          </div>
          <div className="hist-filter-grid">
            <div className="hist-filter-group">
              <label className="hist-filter-label">Panneau</label>
              <select className="hist-filter-select" value={filterPanneau} onChange={e => setFilterPanneau(e.target.value)}>
                <option value="">Tous</option>
                {uniquePanneaux.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="hist-filter-group">
              <label className="hist-filter-label">Tranchée</label>
              <select className="hist-filter-select" value={filterTranchee} onChange={e => setFilterTranchee(e.target.value)}>
                <option value="">Toutes</option>
                {uniqueTranchees.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="hist-filter-group">
              <label className="hist-filter-label">État Machine</label>
              <select className="hist-filter-select" value={filterEtat} onChange={e => setFilterEtat(e.target.value)}>
                <option value="">Tous</option>
                <option value="En marche">En marche</option>
                <option value="En arrêt">En arrêt</option>
              </select>
            </div>
            <div className="hist-filter-group">
              <label className="hist-filter-label">Date début</label>
              <input type="date" className="hist-filter-input" value={filterDateDebut} onChange={e => setFilterDateDebut(e.target.value)} />
            </div>
            <div className="hist-filter-group">
              <label className="hist-filter-label">Date fin</label>
              <input type="date" className="hist-filter-input" value={filterDateFin} onChange={e => setFilterDateFin(e.target.value)} />
            </div>
          </div>
          <div className="hist-filter-info">
            {loading ? "Chargement..." : `${filtered.length} résultat${filtered.length !== 1 ? "s" : ""}${hasFilters ? ` sur ${poussages.length} total` : ""}`}
          </div>
        </div>

        {/* TABLEAU */}
        <div className="hist-card">
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
            <span className="hist-card-title" style={{ margin:0 }}>📄 Liste des Opérations</span>
            <div style={{ display:"flex", gap:8 }}>
              <button className="hist-btn-pdf" onClick={exportPDF}>⬇ PDF</button>
              <button className="hist-btn-excel" onClick={exportExcel}>⬇ Excel</button>
            </div>
          </div>

          <div className="hist-table-wrap">
            <table className="hist-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Panneau</th>
                  <th>Tranchée</th>
                  <th>Niveau</th>
                  <th>Équipements</th>
                  <th>Conducteur</th>
                  <th>Matricule</th>
                  <th>HTP (h)</th>
                  <th>Volume (t)</th>
                  <th>H. Marche</th>
                  <th>H. Arrêt</th>
                  <th>OEE</th>
                  <th>TU</th>
                  <th>TD</th>
                  <th>Rend. t/h</th>
                  <th>État</th>
                  <th>Nature Arrêt</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? filtered.map((p, i) => {
                  const ind = calcIndicateurs(p);
                  const ha  = Number(p.heures_arret || 0);
                  return (
                    <tr key={p.id || i} style={{ animationDelay: `${i * 0.03}s` }}>
                      <td>{p.date}</td>
                      <td>{p.panneau || "—"}</td>
                      <td>{p.tranchee || "—"}</td>
                      <td>{p.niveau || "—"}</td>
                      <td style={{ maxWidth:120, overflow:"hidden", textOverflow:"ellipsis" }}>
                        {p.equipements?.join(", ") || "—"}
                      </td>
                      <td>{p.conducteur || "—"}</td>
                      <td>{p.matricule  || "—"}</td>
                      <td style={{ fontWeight:600, color:"#15803d" }}>
                        {Number(p.htp) > 0 ? p.htp : <span style={{ color:"#9ca3af", fontSize:11 }}>auto</span>}
                      </td>
                      <td><strong>{Number(p.volume_soté).toLocaleString()}</strong></td>
                      <td>{p.temps ? `${p.temps} h` : "—"}</td>
                      <td style={{ color: ha > 0 ? "#dc2626" : "#9ca3af", fontWeight: ha > 0 ? 700 : 400 }}>
                        {ha > 0 ? `${ha} h` : "—"}
                      </td>
                      <td><span className="badge-oee">{ind.oee}</span></td>
                      <td><span className="badge-tu">{ind.tu}</span></td>
                      <td><span className={ha > 0 ? "badge-td" : "badge-td-ok"}>{ind.td}</span></td>
                      <td>{p.temps > 0 ? (p.volume_soté / p.temps).toFixed(2) : "—"}</td>
                      <td>
                        <span className={p.etatMachine === "En marche" ? "badge-marche" : "badge-arret"}>
                          {p.etatMachine}
                        </span>
                      </td>
                      <td style={{ color:"#9ca3af", fontSize:12 }}>{p.typeArret || "—"}</td>
                      <td>
                        <div style={{ display:"flex", gap:6 }}>
                          <button className="hist-btn-edit" onClick={() => openEdit(p)}>
                            ✏️ Modifier
                          </button>
                          <button className="hist-btn-del" onClick={() => openDelete(p)}>
                            🗑️ Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={18} className="hist-empty">
                      {loading ? "⏳ Chargement des données..." : "Aucun résultat pour les filtres sélectionnés."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ══ MODAL SUPPRESSION ══ */}
        {deleteTarget && (
          <div className="hist-modal-overlay" onClick={closeDelete}>
            <div className="hist-modal" onClick={e => e.stopPropagation()}>
              <div className="hist-modal-icon">🗑️</div>
              <div className="hist-modal-title">Confirmer la suppression</div>
              <div className="hist-modal-sub">
                Voulez-vous supprimer l'opération du <strong>{deleteTarget.date}</strong>
                {deleteTarget.conducteur ? ` — conducteur ${deleteTarget.conducteur}` : ""} ?
                <br />Cette action est <strong>irréversible</strong>.
              </div>
              <div className="hist-modal-btns">
                <button className="hist-modal-cancel" onClick={closeDelete}>Annuler</button>
                <button className="hist-modal-confirm" onClick={confirmDelete} disabled={deleting}>
                  {deleting ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══ MODAL ÉDITION ══ */}
        {editTarget && (
          <div className="hist-edit-overlay" onClick={closeEdit}>
            <div className="hist-edit-modal" onClick={e => e.stopPropagation()}>
              <div className="hist-edit-title">
                ✏️ Modifier l'opération — {editTarget.date}
              </div>

              <div className="hist-edit-grid">

                {/* Champs principaux */}
                {[
                  { label:"Date",            name:"date",        type:"date"   },
                  { label:"Panneau",         name:"panneau",     type:"text",   ph:"Ex: P1"    },
                  { label:"Tranchée",        name:"tranchee",    type:"text",   ph:"Ex: TR12"  },
                  { label:"Niveau",          name:"niveau",      type:"text",   ph:"Ex: N1"    },
                  { label:"HTP (h)",         name:"htp",         type:"number", ph:"Heures théoriques", step:"0.1", min:"0", max:"24" },
                  { label:"Profondeur (m)",  name:"profendeur",  type:"number", ph:"0.00",     step:"0.01" },
                  { label:"Volume Souté (t)",name:"volume_soté", type:"number", ph:"0.00",     step:"0.01" },
                  { label:"Conducteur",      name:"conducteur",  type:"text",   ph:"Nom"       },
                  { label:"Matricule",       name:"matricule",   type:"text",   ph:"Matricule" },
                  { label:"Poste",           name:"poste",       type:"text",   ph:"Ex: Matin" },
                  { label:"Heure Début",     name:"heureDebut",  type:"time"   },
                  { label:"Heure Fin",       name:"heureFin",    type:"time"   },
                ].map(({ label, name, type, ph, step, min, max }) => (
                  <div key={name}>
                    <label className="hist-edit-label">{label}</label>
                    <input
                      type={type}
                      className="hist-edit-input"
                      name={name}
                      value={editForm[name] ?? ""}
                      onChange={handleEditChange}
                      placeholder={ph}
                      step={step}
                      min={min}
                      max={max}
                    />
                  </div>
                ))}

                {/* Temps calculé (readonly) */}
                <div>
                  <label className="hist-edit-label">Heures Marche (auto)</label>
                  <input
                    type="number" className="hist-edit-input" readOnly
                    value={editForm.temps || 0} style={{ background:"#f0fdf4", color:"#15803d", fontWeight:700 }}
                  />
                </div>

                {/* État machine */}
                <div style={{ gridColumn:"span 2" }}>
                  <label className="hist-edit-label">État Machine</label>
                  <select
                    className={`hist-edit-select ${editForm.etat_machine === "En arrêt" ? "hist-edit-select-danger" : ""}`}
                    name="etat_machine"
                    value={editForm.etat_machine || "En marche"}
                    onChange={handleEditChange}
                  >
                    <option value="En marche">En marche</option>
                    <option value="En arrêt">En arrêt</option>
                  </select>
                </div>

                {/* Zone arrêt conditionnelle */}
                {editForm.etat_machine === "En arrêt" && (
                  <div className="hist-edit-arret-zone">
                    <div className="hist-edit-arret-title">⚠️ Détails de l'arrêt</div>
                    <div className="hist-edit-arret-grid">
                      <div>
                        <label className="hist-edit-label" style={{ color:"#92400e" }}>Nature d'arrêt</label>
                        <input type="text" className="hist-edit-input" name="typeArret"
                          value={editForm.typeArret} onChange={handleEditChange} placeholder="Cause..." />
                      </div>
                      <div>
                        <label className="hist-edit-label" style={{ color:"#92400e" }}>Heure Début Arrêt</label>
                        <input type="time" className="hist-edit-input" name="heureDebutArret"
                          value={editForm.heureDebutArret} onChange={handleEditChange} />
                      </div>
                      <div>
                        <label className="hist-edit-label" style={{ color:"#92400e" }}>Heure Fin Arrêt</label>
                        <input type="time" className="hist-edit-input" name="heureFinArret"
                          value={editForm.heureFinArret} onChange={handleEditChange} />
                      </div>
                      <div>
                        <label className="hist-edit-label" style={{ color:"#92400e" }}>Heures Arrêt (auto)</label>
                        <input type="number" className="hist-edit-input" readOnly
                          value={editForm.heures_arret || 0}
                          style={{ background:"#fef3c7", color:"#92400e", fontWeight:700 }} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Équipements */}
                <div className="hist-edit-equip-wrap">
                  <label className="hist-edit-label">Équipements mobilisés</label>
                  <div className="hist-edit-equip-grid">
                    {EQUIP_OPTS.map(eq => (
                      <div
                        key={eq}
                        className={`hist-edit-chip ${(editForm.equipements || []).includes(eq) ? "sel" : ""}`}
                        onClick={() => toggleEditEquip(eq)}
                      >{eq}</div>
                    ))}
                  </div>
                </div>

                {/* Preview OEE/TU/TD */}
                <div style={{ gridColumn:"1 / -1" }}>
                  <div style={{ background:"linear-gradient(135deg,#f0fdf4,#dcfce7)", border:"1.5px solid #bbf7d0",
                    borderRadius:12, padding:"14px 18px", display:"flex", gap:24, flexWrap:"wrap" }}>
                    <span style={{ fontSize:11, fontWeight:700, color:"#9ca3af", textTransform:"uppercase",
                      letterSpacing:".08em", alignSelf:"center" }}>Aperçu :</span>
                    {[
                      { label:"OEE", val:previewOEE+"%", color:"#2563eb", bg:"#eff6ff" },
                      { label:"TU",  val:previewTU+"%",  color:"#15803d", bg:"#dcfce7" },
                      { label:"TD",  val:previewTD+"%",  color:"#92400e", bg:"#fef3c7" },
                      { label:"H. Marche", val:(editForm.temps||0)+"h", color:"#15803d", bg:"#f0fdf4" },
                    ].map(({ label, val, color, bg }) => (
                      <div key={label} style={{ textAlign:"center" }}>
                        <div style={{ fontSize:10, fontWeight:700, color:"#9ca3af", textTransform:"uppercase",
                          letterSpacing:".08em", marginBottom:4 }}>{label}</div>
                        <div style={{ background:bg, color, padding:"4px 14px", borderRadius:20,
                          fontSize:15, fontWeight:800 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>{/* /hist-edit-grid */}

              <div className="hist-edit-footer">
                <button className="hist-edit-cancel-btn" onClick={closeEdit}>Annuler</button>
                <button className="hist-edit-save" onClick={saveEdit} disabled={saving}>
                  {saving ? "Enregistrement..." : "💾 Enregistrer"}
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </>
  );
}

export default Historique;